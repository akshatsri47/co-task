"use client";
import Spline from "@splinetool/react-spline";
import { useRef, useState, useEffect } from "react";

export default function App() {
  const splineRef = useRef(null);
  const trackerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Habits state (existing functionality)
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Tasks state (CRUD for tasks)
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  
  const [userId, setUserId] = useState<string | null>(null);

  // Read the user_id from the cookie and store it in state/localStorage
  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.user_id) {
      setUserId(cookies.user_id);
      localStorage.setItem("user_id", cookies.user_id);
      console.log("User ID from cookie stored:", cookies.user_id);
    } else {
      console.error("No user_id cookie found");
    }
  }, []);

  // ------------------- HABITS FUNCTIONS -------------------

  // Fetch habits from the API using the user ID
  const fetchHabits = async () => {
    const storedUserId = userId || localStorage.getItem("user_id");
    if (!storedUserId) {
      console.error("No user ID found for habits");
      return;
    }
    try {
      const response = await fetch(`/api/habit?user_id=${storedUserId}`);
      const data = await response.json();
      if (data.data) {
        setHabits(data.data);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  // Add a new habit using the user ID
  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const storedUserId = userId || localStorage.getItem("user_id");
    if (!storedUserId) {
      console.error("No user ID found for habits");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/habit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newHabit,
          streak: 0,
          user_id: storedUserId,
        }),
      });
      if (response.ok) {
        setNewHabit("");
        fetchHabits(); // Refresh habits after adding
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Increment the habit streak via PATCH endpoint
  const incrementStreak = async (id, currentStreak) => {
    try {
      await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streak: currentStreak + 1,
        }),
      });
      fetchHabits(); // Refresh habits after updating
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  // Delete a habit via DELETE endpoint
  const deleteHabit = async (id) => {
    try {
      await fetch(`/api/habit/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchHabits(); // Refresh habits after deletion
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // ------------------- TASKS FUNCTIONS -------------------

  // Fetch tasks from the API using the user ID
  const fetchTasks = async () => {
    const storedUserId = userId || localStorage.getItem("user_id");
    if (!storedUserId) {
      console.error("No user ID found for tasks");
      return;
    }
    try {
      const response = await fetch(`/api/task?user_id=${storedUserId}`);
      const data = await response.json();
      if (data.data) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task using the user ID
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const storedUserId = userId || localStorage.getItem("user_id");
    if (!storedUserId) {
      console.error("No user ID found for tasks");
      return;
    }
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask,
          iscompleted: false,
          user_id: storedUserId,
        }),
      });
      if (response.ok) {
        setNewTask("");
        fetchTasks(); // Refresh tasks after adding
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update a task's title via PATCH endpoint
  const updateTask = async (id) => {
    if (!editTaskTitle.trim()) return;
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTaskTitle }),
      });
      if (response.ok) {
        setEditingTaskId(null);
        setEditTaskTitle("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task via DELETE endpoint
  const deleteTask = async (id) => {
    try {
      await fetch(`/api/task/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ------------------- Spline and Visibility -------------------

  const onLoad = (splineApp) => {
    splineRef.current = splineApp;
    const object = splineApp.findObjectByName("head");
    if (object) {
      object.onLookAt = () => {
        console.log("User is looking at the object!");
      };
    }
  };

  useEffect(() => {
    // Fetch habits and tasks when userId changes
    fetchHabits();
    fetchTasks();

    const handleScroll = () => {
      if (trackerRef.current) {
        const rect = trackerRef.current.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight * 0.8;
        setIsVisible(isInViewport);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Spline Scene */}
      <div className="w-[100vw] h-[80vh] border border-gray-300 rounded-lg shadow-lg overflow-hidden mb-24">
        <Spline
          scene="https://prod.spline.design/xVpWvn9QKwNuGXYb/scene.splinecode"
          onLoad={onLoad}
        />
      </div>

      {/* Main Content */}
      <div
        ref={trackerRef}
        className={`bg-[#B3BEDF] w-[100vw] rounded-lg p-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="flex gap-4">
          {/* Habits Column */}
          <div className="bg-gray-100 rounded-md p-4 w-1/3">
            <h2 className="font-bold mb-4">Habits</h2>
            <form onSubmit={addHabit} className="bg-gray-200 p-2 rounded mb-4">
              <input
                type="text"
                placeholder="Add a Habit"
                className="w-full p-1 rounded border-none"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                disabled={loading}
              />
            </form>
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div key={habit.id} className="flex items-center mb-2">
                  <div className="bg-[#d6de8e] p-2 rounded-l-md">
                    <button
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      onClick={() => incrementStreak(habit.id, habit.streak)}
                    >
                      +
                    </button>
                  </div>
                  <div className="bg-white flex-1 p-2">{habit.title}</div>
                  <div className="bg-[#d6de8e] p-2 rounded-r-md flex items-center">
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                      {habit.streak}
                    </span>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex mb-2">
                <div className="bg-[#d6de8e] p-2 rounded-l-md">
                  <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center">+</button>
                </div>
                <div className="bg-white flex-1 p-2">Add your first habit</div>
                <div className="bg-[#d6de8e] p-2 rounded-r-md">
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">0</span>
                </div>
              </div>
            )}
            <p className="text-xs text-center mt-8">
              Track your good habits, no high-tech-uh, you can make them all up super simple to day
            </p>
          </div>

          {/* Tasks Column */}
          <div className="bg-gray-100 rounded-md p-4 w-1/3">
            <h2 className="font-bold mb-4">Tasks</h2>
            <form onSubmit={addTask} className="bg-gray-200 p-2 rounded mb-4">
              <input
                type="text"
                placeholder="Add a Task"
                className="w-full p-1 rounded border-none"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </form>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center mb-2">
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        className="flex-1 p-1 rounded border"
                      />
                      <button
                        onClick={() => updateTask(task.id)}
                        className="text-green-500 text-sm ml-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingTaskId(null);
                          setEditTaskTitle("");
                        }}
                        className="text-gray-500 text-sm ml-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-white flex-1 p-2">{task.title}</div>
                      <button
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditTaskTitle(task.title);
                        }}
                        className="text-blue-500 text-sm ml-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 text-sm ml-2"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="flex mb-2">
                <div className="bg-white flex-1 p-2">Add your first task</div>
              </div>
            )}
          </div>

          {/* Progress Indicators Column */}
          <div className="w-1/3 p-4 flex flex-col justify-around">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-center mb-4">
                <div className="w-6 h-6 bg-[#a98ad9] rounded-full mr-2"></div>
                <div className="h-2 bg-[#a98ad9] w-16 rounded-full mr-2"></div>
                <div className="h-2 bg-gray-200 flex-1 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Button (Global Action Button, if needed) */}
      <button className="fixed bottom-4 right-4 w-12 h-12 bg-[#a98ad9] rounded-full flex items-center justify-center text-white text-xl shadow-lg">
        +
      </button>
    </div>
  );
}
