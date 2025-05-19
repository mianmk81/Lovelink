import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RetroSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  color = 'blue',
  required = false,
  disabled = false,
  error = '',
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full bg-retro-darkgray border-2 p-3 
            font-vt323 text-xl text-white 
            focus:outline-none transition-all duration-300
            appearance-none
            ${colorClass} ${disabledClass} ${errorClass} ${focusedClass}
          `}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-retro-black text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colorClass} pointer-events-none`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
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

RetroSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'pink', 'green', 'purple', 'yellow', 'red', 'cyan', 'white']),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default RetroSelect;
