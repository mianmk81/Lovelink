import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSound } from '../context/SoundContext';

const TypewriterText = ({ 
  text, 
  speed = 100, 
  showCursor = true,
  className = '', 
  onComplete = () => {}, 
  startDelay = 500,
  pauseDelay = 0,
  playSound = false // Default to false now since we only want sound for welcome animation
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const { playSound: playSoundEffect } = useSound();
  
  // Use a ref to track if the component is mounted
  const isMountedRef = React.useRef(true);
  
  // Store text in a ref to avoid unnecessary re-renders
  const textRef = React.useRef(text);
  
  // Store functions in refs to avoid dependency changes
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  
  const playSoundEffectRef = React.useRef(playSoundEffect);
  playSoundEffectRef.current = playSoundEffect;
  
  // Reset when text changes
  React.useEffect(() => {
    textRef.current = text;
  }, [text]);
  
  useEffect(() => {
    // Reset state when component mounts
    setDisplayText('');
    setIsComplete(false);
    
    // Set mounted ref
    isMountedRef.current = true;
    
    // Start delay timer
    const startTimer = setTimeout(() => {
      // Only proceed if still mounted
      if (!isMountedRef.current) return;
      
      // Play typewriter sound once at the beginning if enabled
      if (playSound) {
        playSoundEffectRef.current('welcomeTypewriter');
      }
      
      let currentIndex = 0;
      const currentText = textRef.current;
      
      // Create typing interval
      const typingTimer = setInterval(() => {
        // Only proceed if still mounted
        if (!isMountedRef.current) {
          clearInterval(typingTimer);
          return;
        }
        
        if (currentIndex < currentText.length) {
          setDisplayText(currentText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          // Typing is complete
          clearInterval(typingTimer);
          
          // Set completion after pause delay
          const completeTimer = setTimeout(() => {
            if (isMountedRef.current) {
              setIsComplete(true);
              onCompleteRef.current();
            }
          }, pauseDelay);
          
          return () => clearTimeout(completeTimer);
        }
      }, speed);
      
      return () => clearInterval(typingTimer);
    }, startDelay);
    
    // Cleanup function to handle unmounting
    return () => {
      isMountedRef.current = false;
      clearTimeout(startTimer);
    };
  }, [speed, startDelay, pauseDelay, playSound]);
  
  return (
    <span className={`typewriter-container ${className}`}>
      <span className="typewriter-text">{displayText}</span>
      {showCursor && !isComplete && (
        <span className="cursor blink">|</span>
      )}
    </span>
  );
};

TypewriterText.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number,
  showCursor: PropTypes.bool,
  className: PropTypes.string,
  onComplete: PropTypes.func,
  startDelay: PropTypes.number,
  pauseDelay: PropTypes.number,
  playSound: PropTypes.bool
};

export default TypewriterText;
