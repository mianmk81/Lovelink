import React from 'react';

const LoadingIndicator = ({ text = 'Loading...', type = 'dots', color = 'green', className = '' }) => {
  const colorMap = {
    blue: 'text-neon-blue',
    pink: 'text-neon-pink',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    yellow: 'text-neon-yellow'
  };

  const colorClass = colorMap[color] || colorMap.green;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {type === 'dots' && (
        <div className="loading-dots mb-4 flex space-x-2">
          <span className={`dot w-3 h-3 rounded-full ${colorClass} animate-pulse`} style={{ animationDelay: '0ms' }}></span>
          <span className={`dot w-3 h-3 rounded-full ${colorClass} animate-pulse`} style={{ animationDelay: '300ms' }}></span>
          <span className={`dot w-3 h-3 rounded-full ${colorClass} animate-pulse`} style={{ animationDelay: '600ms' }}></span>
        </div>
      )}
      
      {type === 'bar' && (
        <div className="loading-bar w-48 h-4 bg-retro-darkgray mb-4 overflow-hidden">
          <div 
            className={`h-full ${colorClass} animate-pulse`} 
            style={{ 
              width: '30%', 
              animation: 'loading-bar 1.5s infinite linear',
              boxShadow: `0 0 10px currentColor`
            }}
          ></div>
        </div>
      )}
      
      {type === 'spinner' && (
        <div 
          className={`loading-spinner w-10 h-10 border-4 rounded-full ${colorClass} mb-4`}
          style={{ 
            borderTopColor: 'transparent',
            animation: 'spin 1s infinite linear'
          }}
        ></div>
      )}
      
      <p className={`font-vt323 text-xl ${colorClass} typewriter`}>
        {text}
        <span className="animate-pulse">_</span>
      </p>
    </div>
  );
};

export default LoadingIndicator;
