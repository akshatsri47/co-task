'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import RoadmapComponent from '../components/RoadmapComponent';

export default function RoadmapPage() {
  const [inputTask, setInputTask] = useState('');
  const [task, setTask] = useState('');

  const handleGenerate = () => {
    if (inputTask.trim()) {
      setTask(inputTask);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex mb-4">
          <input 
            type="text" 
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            placeholder="Enter task/project name"
            className="w-full p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleGenerate}
            className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600 transition flex items-center"
          >
            <Send className="mr-2" size={20} />
            Generate
          </button>
        </div>

        {task && <RoadmapComponent task={task} />}
      </div>
    </div>
  );
}