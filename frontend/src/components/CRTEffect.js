import React from 'react';

const CRTEffect = ({ children, className = '', intensity = 'medium', ...props }) => {
  const intensityMap = {
    light: 'opacity-30',
    medium: 'opacity-50',
    strong: 'opacity-70'
  };

  const intensityClass = intensityMap[intensity] || intensityMap.medium;

  return (
    <div className={`crt-effect relative overflow-hidden ${className}`} {...props}>
      {children}
      <div className={`scanline absolute top-0 left-0 w-full h-full pointer-events-none z-10 ${intensityClass}`}></div>
      <div className="crt-overlay absolute top-0 left-0 w-full h-full pointer-events-none z-11"></div>
    </div>
  );
};

export default CRTEffect;
