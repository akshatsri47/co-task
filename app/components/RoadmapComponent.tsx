import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Target, Rocket, CheckCircle, Award } from 'lucide-react';

const BubbleRoadmapComponent = ({ task }) => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoadmap = async () => {
    if (!task.trim()) {
      setError('Please enter a task');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }

      const data = await response.json();
      const parsedData = parseRoadmapData(data.data);
      
      setRoadmapData(parsedData);
      // Automatically expand first week
      setExpandedWeeks({ 1: true });
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (task) {
      fetchRoadmap();
    }
  }, [task]);

  const parseRoadmapData = (rawData) => {
    const weekSections = rawData.split('### ').slice(1);
    
    return weekSections.map((section, index) => {
      const [weekHeader, ...content] = section.split('\n');
      
      const weekMatch = weekHeader.match(/Week (\d+):\s*(.+)/);
      const weekNumber = weekMatch ? weekMatch[1] : (index + 1).toString();
      const weekFocus = weekMatch ? weekMatch[2].trim() : 'Undefined';

      const tasks = [];
      let currentTask = null;

      content.forEach(line => {
        line = line.trim();
        
        const taskMatch = line.match(/\*\*(.*)\*\*/);
        if (taskMatch) {
          if (currentTask) {
            tasks.push(currentTask);
          }
          currentTask = {
            name: taskMatch[1],
            subtasks: []
          };
        } 
        else if (line.startsWith('- ') && currentTask) {
          currentTask.subtasks.push(line.replace('- ', '').trim());
        }
      });

      if (currentTask) {
        tasks.push(currentTask);
      }

      return {
        number: weekNumber,
        focus: weekFocus,
        tasks
      };
    });
  };

  const toggleWeekExpansion = (weekNumber) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  // Icons for different task types
  const TaskIcons = [Target, Rocket, CheckCircle, Award];

  // Gradient and shadow styles for bubbles
  const bubbleStyles = [
    'from-blue-100 to-blue-200 shadow-blue-200/50',
    'from-green-100 to-green-200 shadow-green-200/50',
    'from-purple-100 to-purple-200 shadow-purple-200/50',
    'from-pink-100 to-pink-200 shadow-pink-200/50',
    'from-yellow-100 to-yellow-200 shadow-yellow-200/50'
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-2xl text-gray-600">
            Generating roadmap...
          </div>
        </div>
      ) : (
        roadmapData && (
          <div className="relative container mx-auto">
            <h2 className="text-4xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Roadmap for {task}
            </h2>
            <div className="flex flex-wrap justify-center gap-10">
              {roadmapData.map((week, weekIndex) => {
                const BubbleIcon = TaskIcons[weekIndex % TaskIcons.length];
                return (
                  <div 
                    key={week.number} 
                    className="relative w-80 group perspective-1000"
                  >
                    <div 
                      className={`
                        transform transition-all duration-500 
                        bg-gradient-to-br ${bubbleStyles[weekIndex % bubbleStyles.length]}
                        rounded-2xl shadow-2xl hover:rotate-y-6 hover:scale-105
                        border border-opacity-30 p-6
                        cursor-pointer
                      `}
                      onClick={() => toggleWeekExpansion(week.number)}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <BubbleIcon 
                            className="text-gray-700 opacity-70" 
                            size={32} 
                          />
                          <h3 className="text-2xl font-bold text-gray-800">
                            Week {week.number}
                          </h3>
                        </div>
                        {expandedWeeks[week.number] ? (
                          <ChevronDown className="text-gray-600" />
                        ) : (
                          <ChevronRight className="text-gray-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 italic text-sm">
                        {week.focus}
                      </p>
                      
                      {expandedWeeks[week.number] && (
                        <div className="space-y-3 mt-4">
                          {week.tasks.map((task, index) => (
                            <div 
                              key={index} 
                              className="
                                bg-white bg-opacity-80 
                                rounded-lg p-4 
                                shadow-md 
                                border border-gray-200 
                                transition 
                                hover:shadow-lg
                                hover:scale-[1.02]
                              "
                            >
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <span className="mr-2">
                                  {React.createElement(TaskIcons[index % TaskIcons.length], {
                                    size: 18, 
                                    className: 'text-gray-500 inline-block mr-2'
                                  })}
                                </span>
                                {task.name}
                              </h4>
                              <ul className="text-gray-600 space-y-1 pl-6 list-disc text-sm">
                                {task.subtasks.map((subtask, subIndex) => (
                                  <li key={subIndex} className="hover:text-blue-600 transition">
                                    {subtask}
                                  </li>
                              ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {weekIndex < roadmapData.length - 1 && (
                      <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 
                        w-0.5 h-10 bg-gradient-to-b from-gray-200 to-gray-300 
                        animate-pulse opacity-50">
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default BubbleRoadmapComponent;