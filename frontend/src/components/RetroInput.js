import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RetroInput = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder = '',
  color = 'blue',
  required = false,
  disabled = false,
  error = '',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const colorMap = {
    blue: 'border-neon-blue focus:border-neon-blue text-neon-blue',
    pink: 'border-neon-pink focus:border-neon-pink text-neon-pink',
    green: 'border-neon-green focus:border-neon-green text-neon-green',
    purple: 'border-neon-purple focus:border-neon-purple text-neon-purple',
    yellow: 'border-neon-yellow focus:border-neon-yellow text-neon-yellow',
    red: 'border-neon-red focus:border-neon-red text-neon-red',
    cyan: 'border-neon-cyan focus:border-neon-cyan text-neon-cyan',
    white: 'border-white focus:border-white text-white'
  };

  const colorClass = colorMap[color] || colorMap.blue;
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const errorClass = error ? 'border-neon-red' : '';
  const focusedClass = isFocused ? `shadow-glow-${color}` : '';
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block font-ibm-plex ${colorClass} mb-2 ${required ? 'required' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-gray">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full bg-retro-darkgray border-2 p-3 
            font-vt323 text-xl text-white 
            focus:outline-none transition-all duration-300
            ${colorClass} ${disabledClass} ${errorClass} ${focusedClass}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
          `}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-retro-gray">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 font-vt323 text-neon-red text-sm">{error}</p>
      )}
      
      {/* Scanline effect */}
      {isFocused && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="scanline"></div>
        </div>
      )}
    </div>
  );
};

RetroInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan', 'white']),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string
};

export default RetroInput;
