import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const RetroCursor = ({ 
  color = 'pink',
  size = 'medium',
  blendMode = true,
  pulseEffect = true
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  const sizeMap = {
    small: { width: '15px', height: '15px' },
    medium: { width: '20px', height: '20px' },
    large: { width: '25px', height: '25px' }
  };
  
  const cursorSize = sizeMap[size] || sizeMap.medium;
  
  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);
  
  const cursorStyle = {
    position: 'fixed',
    width: cursorSize.width,
    height: cursorSize.height,
    border: `2px solid var(--color-${color})`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 9999,
    left: `${position.x}px`,
    top: `${position.y}px`,
    mixBlendMode: blendMode ? 'difference' : 'normal',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease',
    animation: pulseEffect ? 'cursor-pulse 1.5s infinite alternate' : 'none',
    boxShadow: `0 0 5px var(--color-${color})`
  };
  
  return <div style={cursorStyle} />;
};

RetroCursor.propTypes = {
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  blendMode: PropTypes.bool,
  pulseEffect: PropTypes.bool
};

export default RetroCursor;
