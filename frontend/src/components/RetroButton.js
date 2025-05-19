import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RetroButton = ({ 
  children, 
  color = 'blue', 
  size = 'medium',
  variant = 'default',
  onClick, 
  className = '', 
  disabled = false,
  icon,
  iconPosition = 'left',
  glowEffect = true,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const colorMap = {
    blue: 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:shadow-neon-blue',
    pink: 'border-neon-pink text-neon-pink hover:bg-neon-pink hover:shadow-neon-pink',
    green: 'border-neon-green text-neon-green hover:bg-neon-green hover:shadow-neon-green',
    purple: 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:shadow-neon-purple',
    yellow: 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:shadow-neon-yellow',
    red: 'border-neon-red text-neon-red hover:bg-neon-red hover:shadow-neon-red',
    cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:shadow-neon-cyan'
  };

  const sizeMap = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const variantMap = {
    default: 'border-4 bg-retro-black',
    outline: 'border-2 bg-transparent',
    solid: `bg-${color} text-retro-black border-0`,
    ghost: 'border-0 bg-transparent hover:bg-opacity-20'
  };

  const disabledStyle = disabled ? 
    'opacity-50 cursor-not-allowed border-gray-500 text-gray-500 hover:bg-transparent hover:text-gray-500 hover:shadow-none' : 
    'cursor-pointer hover:text-retro-black';

  const pressedStyle = isPressed ? 'transform scale-95 opacity-90' : '';
  
  const glowClass = glowEffect && !disabled ? 
    `hover:shadow-glow-${color} transition-all duration-300` : 
    '';

  const colorClass = colorMap[color] || colorMap.blue;
  const sizeClass = sizeMap[size] || sizeMap.medium;
  const variantClass = variantMap[variant] || variantMap.default;

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };

  const handleClick = (e) => {
    if (!disabled && onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      className={`font-press-start ${sizeClass} ${variantClass} ${colorClass} 
                 ${glowClass} ${disabledStyle} ${pressedStyle}
                 relative overflow-hidden ${className}`}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center justify-center">
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        <span className={isPressed ? 'transform translate-y-px' : ''}>
          {children}
        </span>
        
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </div>
      
      {/* Scanline effect */}
      {!disabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="scanline"></div>
        </div>
      )}
    </button>
  );
};

RetroButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'outline', 'solid', 'ghost']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  glowEffect: PropTypes.bool
};

export default RetroButton;
