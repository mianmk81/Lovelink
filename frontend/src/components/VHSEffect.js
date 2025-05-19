import React from 'react';

const VHSEffect = ({ children, className = '', intensity = 'medium' }) => {
  const intensityMap = {
    light: 'opacity-20',
    medium: 'opacity-40',
    strong: 'opacity-60'
  };

  const intensityClass = intensityMap[intensity] || intensityMap.medium;

  return (
    <div className={`vhs-distortion relative overflow-hidden ${className}`}>
      {children}
      <div 
        className={`absolute top-0 left-0 w-full h-full pointer-events-none z-10 ${intensityClass}`}
        style={{
          background: `
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              rgba(255, 0, 255, 0.03) 1px,
              transparent 2px
            )
          `
        }}
      ></div>
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-11 animate-glitch"
        style={{ opacity: 0.05 }}
      ></div>
    </div>
  );
};

export default VHSEffect;
