import React, { useState, useEffect } from 'react';

const LandscapeReveal = () => {
  const [zoom, setZoom] = useState(1.5);
  const [yPosition, setYPosition] = useState(-15); // Start positioned to show the mountains
  const [started, setStarted] = useState(false);
  
  useEffect(() => {
  
    const timer = setTimeout(() => {
      setZoom(1.4);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStart = () => {
    setStarted(true);
    
    const duration = 2500;
    const startTime = Date.now();
    const startZoom = zoom;
    const targetZoom = 1;
    const startPosition = yPosition;
    const targetPosition = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
    
      const easing = 1 - Math.pow(1 - progress, 3);
      
      const currentZoom = startZoom - (startZoom - targetZoom) * easing;
      const currentPosition = startPosition - (startPosition - targetPosition) * easing;
      
      setZoom(currentZoom);
      setYPosition(currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-b from-blue-200 via-purple-100 to-pink-100">
     
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          transform: `scale(${zoom}) translateY(${yPosition}%)`,
          transformOrigin: "center center",
          transition: started ? "none" : "transform 800ms ease-out"
        }}
      >
        <img 
          src="/test.svg" 
          alt="Mountain landscape scene" 
          className="w-full h-full object-cover"
        />
      </div>
      
    
      <div 
        className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000"
        style={{ opacity: started ? 0 : 1, pointerEvents: started ? 'none' : 'auto' }}
      >
        <button
          onClick={handleStart}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-900 font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none"
        >
          START JOURNEY
        </button>
      </div>
      
     
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black bg-opacity-40 text-white text-sm rounded-full px-3 py-1 z-10">
        <span className="inline-block w-6 h-6 bg-black rounded-md flex items-center justify-center border border-gray-400">N</span>
        <span>to begin your adventure</span>
      </div>
    </div>
  );
};

export default LandscapeReveal;