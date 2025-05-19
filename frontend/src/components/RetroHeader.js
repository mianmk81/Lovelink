import React from 'react';
import PropTypes from 'prop-types';

const RetroHeader = ({ 
  title, 
  subtitle,
  color = 'pink', 
  size = 'medium',
  align = 'center',
  withUnderline = false,
  withGlow = true,
  withScanlines = true,
  className = '',
  onClick = null
}) => {
  const colorMap = {
    blue: 'text-neon-blue',
    pink: 'text-neon-pink',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    yellow: 'text-neon-yellow',
    red: 'text-neon-red',
    cyan: 'text-neon-cyan',
    white: 'text-white'
  };

  const sizeMap = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const colorClass = colorMap[color] || colorMap.pink;
  const sizeClass = sizeMap[size] || sizeMap.medium;
  const alignClass = alignMap[align] || alignMap.center;
  const glowClass = withGlow ? `glow-text-${color}` : '';
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';
  
  const underlineStyle = withUnderline ? {
    position: 'relative',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem'
  } : {};
  
  const underlineAfterStyle = withUnderline ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: align === 'center' ? '50%' : align === 'right' ? 'auto' : 0,
    right: align === 'right' ? 0 : 'auto',
    transform: align === 'center' ? 'translateX(-50%)' : 'none',
    height: '3px',
    width: align === 'center' ? '50%' : '100%',
    background: `var(--color-${color})`,
    boxShadow: withGlow ? `0 0 10px var(--color-${color})` : 'none'
  } : {};

  return (
    <div 
      className={`relative mb-8 ${className}`} 
      style={underlineStyle}
      onClick={onClick}
    >
      <h1 className={`font-press-start ${colorClass} ${sizeClass} ${alignClass} ${glowClass} ${clickableClass}`}>
        {title}
      </h1>
      
      {subtitle && (
        <p className={`font-vt323 text-lg mt-2 ${alignClass} text-gray-300`}>
          {subtitle}
        </p>
      )}
      
      {withUnderline && (
        <div style={underlineAfterStyle}></div>
      )}
      
      {withScanlines && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="scanline"></div>
        </div>
      )}
    </div>
  );
};

RetroHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan', 'white']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  withUnderline: PropTypes.bool,
  withGlow: PropTypes.bool,
  withScanlines: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default RetroHeader;
