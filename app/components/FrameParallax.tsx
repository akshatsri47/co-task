import { useState, useEffect } from "react";

const FrameParallax = () => {
  const [zoomOut, setZoomOut] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleClick = () => {
    setZoomOut(true);
  };

  useEffect(() => {
    if (zoomOut) {
      const scrollDuration = 1000; // matches zoom duration
      const startTime = performance.now();

      const scrollAnimation = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        
        // Smooth easing function (ease-out-quad)
        const easedProgress = progress * (2 - progress);
        
        // Scroll by the full viewport height
        window.scrollTo(0, window.innerHeight * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
        }
      };

      requestAnimationFrame(scrollAnimation);
    }
  }, [zoomOut]);

  return (
    <div className="bg-[url(/vector.png)] bg-no-repeat bg-cover bg-center h-screen w-screen flex items-center justify-center overflow-hidden relative">
      
      <div
        className={`absolute w-full transition-transform duration-1000 ${
          zoomOut ? "scale-100" : "scale-225"
        }`}
      >
        <img src="/backmoun.svg" className="w-full h-[95vh]" alt="mountain" />
      </div>

      <div  
        className={`absolute w-full ${
          zoomOut ? "bottom-0" : "bottom-[-10%]"
        } transition-all duration-1000 ${
          zoomOut ? "scale-100" : "scale-175"
        }`}
      >
        <img 
          src="/Foreground.svg" 
          className="w-full h-full bottom-0 object-bottom object-cover" 
          alt="forest" 
        />
      </div>
      
      <button
        className="absolute text-xl px-6 py-3 bg-white text-black rounded-lg shadow-md font-bold transition-all hover:bg-gray-200"
        onClick={handleClick}
      >
        Click Me
      </button>
    </div>
  );
};

export default FrameParallax;