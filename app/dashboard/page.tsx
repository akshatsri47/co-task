"use client";
import Spline from "@splinetool/react-spline";
import { useRef, useState, useEffect } from "react";

export default function App() {
  const splineRef = useRef(null);
  const trackerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch habits from the API
  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habit");
      const data = await response.json();
      
      if (data.data) {
        setHabits(data.data);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  // Add a new habit
  const addHabit = async (e) => {
    e.preventDefault();
    
    if (!newHabit.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/habit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: newHabit,
          streak: 0
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

  // Increment streak for a habit
  const incrementStreak = async (habitId, currentStreak) => {
    try {
      // Note: You would need to implement the PUT/PATCH endpoint 
      // for updating habits in your API
      await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          streak: currentStreak + 1
        }),
      });
      
      fetchHabits(); // Refresh habits after updating
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

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
    // Fetch habits when component mounts
    fetchHabits();
    
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
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">

      <div className="w-[100vw] h-[80vh] border border-gray-300 rounded-lg shadow-lg overflow-hidden mb-24">
        <Spline
          scene="https://prod.spline.design/xVpWvn9QKwNuGXYb/scene.splinecode"
          onLoad={onLoad}
        />
      </div>

      <div 
        ref={trackerRef}
        className={` bg-[#B3BEDF] w-[100vw] rounded-lg p-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
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
            
            {/* Habit Items */}
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div key={habit.id} className="flex mb-2">
                  <div className="bg-[#d6de8e] p-2 rounded-l-md">
                    <button 
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      onClick={() => incrementStreak(habit.id, habit.streak)}
                    >
                      +
                    </button>
                  </div>
                  <div className="bg-white flex-1 p-2">
                    {habit.title}
                  </div>
                  <div className="bg-[#d6de8e] p-2 rounded-r-md">
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      {habit.streak}
                    </span>
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
            
            <p className="text-xs text-center mt-8">Track your good habits, no high-tech-uh, you can make them all up super simple to day</p>
          </div>
          
          {/* To Do's Column */}
          <div className="bg-gray-100 rounded-md p-4 w-1/3">
            <h2 className="font-bold mb-4">To Do's</h2>
            <div className="bg-gray-200 p-2 rounded mb-4">
              <input type="text" placeholder="Add a To Do" className="w-full p-1 rounded border-none" />
            </div>
            
            {/* Todo Items */}
            <div className="flex items-center mb-2">
              <div className="bg-[#a98ad9] w-8 h-8 rounded mr-2"></div>
              <div className="bg-gray-200 flex-1 h-8 rounded"></div>
            </div>
            
            <div className="flex items-center mb-2">
              <div className="bg-[#a98ad9] w-8 h-8 rounded mr-2"></div>
              <div className="bg-gray-200 flex-1 h-8 rounded"></div>
            </div>
          </div>
          
          {/* Progress Indicators */}
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
      
      {/* Add Button */}
      <button className="fixed bottom-4 right-4 w-12 h-12 bg-[#a98ad9] rounded-full flex items-center justify-center text-white text-xl shadow-lg">
        +
      </button>
    </div>
  );
}