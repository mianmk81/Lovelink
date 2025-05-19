import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const VHSTransition = ({ 
  isActive = false, 
  duration = 1000, 
  onComplete = () => {},
  color = 'blue',
  intensity = 'medium',
  children 
}) => {
  const [isVisible, setIsVisible] = useState(isActive);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Short delay to allow exit animation
      
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete]);
  
  if (!isVisible) return null;
  
  // Intensity levels
  const intensityMap = {
    light: 'opacity-70',
    medium: 'opacity-85',
    heavy: 'opacity-95'
  };
  
  // Color map
  const colorMap = {
    blue: 'from-neon-blue',
    pink: 'from-neon-pink',
    green: 'from-neon-green',
    purple: 'from-neon-purple',
    yellow: 'from-neon-yellow',
    red: 'from-neon-red',
    cyan: 'from-neon-cyan'
  };
  
  const intensityClass = intensityMap[intensity] || intensityMap.medium;
  const colorClass = colorMap[color] || colorMap.blue;
  
  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isAnimating ? intensityClass : 'opacity-0'}`}>
      {/* VHS static noise */}
      <div className="absolute inset-0 bg-retro-black vhs-noise"></div>
      
      {/* Color overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${colorClass} to-transparent opacity-30`}></div>
      
      {/* Horizontal lines */}
      <div className="absolute inset-0 vhs-lines"></div>
      
      {/* Tracking issues */}
      <div className="absolute inset-0 vhs-tracking"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

VHSTransition.propTypes = {
  isActive: PropTypes.bool,
  duration: PropTypes.number,
  onComplete: PropTypes.func,
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan']),
  intensity: PropTypes.oneOf(['light', 'medium', 'heavy']),
  children: PropTypes.node
};

export default VHSTransition;
