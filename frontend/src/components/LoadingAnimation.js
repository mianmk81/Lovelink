import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSound } from '../context/SoundContext';

/**
 * Retro-style loading animation component with sound
 */
const LoadingAnimation = ({ message = 'LOADING...', className = '' }) => {
  const { playSound } = useSound();

  useEffect(() => {
    // Play loading sound when component mounts
    playSound('loading');
    
    // Set up interval to play the loading sound repeatedly
    const soundInterval = setInterval(() => {
      playSound('loading');
    }, 3000); // Play every 3 seconds
    
    return () => {
      clearInterval(soundInterval);
    };
  }, [playSound]);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50 ${className}`}>
      <div className="text-center">
        <div className="loading-dots mb-4">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <div className="text-neon-green font-vt323 text-2xl tracking-widest animate-pulse">
          {message}
        </div>
      </div>
      
      <style jsx="true">{`
        .loading-dots {
          display: flex;
          justify-content: center;
        }
        
        .dot {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          background-color: #00ff00;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.5s infinite ease-in-out;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

LoadingAnimation.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
};

export default LoadingAnimation;
