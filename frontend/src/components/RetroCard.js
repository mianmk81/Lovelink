import React from 'react';
import PropTypes from 'prop-types';

const RetroCard = ({ 
  children, 
  color = 'purple', 
  variant = 'default',
  glowEffect = true,
  withScanlines = false,
  withHeader = false,
  headerText = '',
  headerColor = '',
  onClick = null,
  className = '', 
  ...props 
}) => {
  const colorMap = {
    blue: 'border-neon-blue',
    pink: 'border-neon-pink',
    green: 'border-neon-green',
    purple: 'border-neon-purple',
    yellow: 'border-neon-yellow',
    red: 'border-neon-red',
    cyan: 'border-neon-cyan',
    white: 'border-white'
  };

  const variantMap = {
    default: 'bg-retro-darkgray border-2',
    outline: 'bg-transparent border-2',
    solid: `bg-${color}-900 bg-opacity-20 border-2`,
    terminal: 'bg-retro-black border-2 font-vt323'
  };

  // Use the header color if provided, otherwise use the card color
  const actualHeaderColor = headerColor || color;
  const headerColorClass = colorMap[actualHeaderColor].replace('border-', 'text-');

  const colorClass = colorMap[color] || colorMap.purple;
  const variantClass = variantMap[variant] || variantMap.default;
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : '';

  const glowStyle = glowEffect ? {
    boxShadow: `0 0 10px var(--color-${color})`
  } : {};

  return (
    <div
      className={`${variantClass} ${colorClass} p-4 rounded relative ${clickableClass} ${className}`}
      style={glowStyle}
      onClick={onClick}
      {...props}
    >
      {withHeader && headerText && (
        <div className={`absolute -top-3 left-4 px-2 ${headerColorClass} font-ibm-plex text-sm bg-retro-black`}>
          {headerText}
        </div>
      )}
      
      {children}
      
      {withScanlines && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 rounded">
          <div className="scanline"></div>
        </div>
      )}
    </div>
  );
};

RetroCard.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan', 'white']),
  variant: PropTypes.oneOf(['default', 'outline', 'solid', 'terminal']),
  glowEffect: PropTypes.bool,
  withScanlines: PropTypes.bool,
  withHeader: PropTypes.bool,
  headerText: PropTypes.string,
  headerColor: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default RetroCard;
