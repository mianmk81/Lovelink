import React from 'react';
import PropTypes from 'prop-types';

/**
 * A component that displays animated pixelated hearts
 */
const PixelHeartAnimation = ({ count = 5, className = '' }) => {
  return (
    <div className={`pixel-heart-animation relative ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="absolute heart-container"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        >
          <div className="heart-icon"></div>
        </div>
      ))}
      
      <style jsx="true">{`
        .pixel-heart-animation {
          overflow: hidden;
          min-height: 100px;
        }
        
        .heart-container {
          animation: float-up 7s ease-in-out infinite;
          opacity: 0;
        }
        
        .heart-icon {
          width: 16px;
          height: 16px;
          position: relative;
          background-color: transparent;
          box-shadow:
            /* Pixelated heart shape */
            4px 0 0 0 #ff00ff,
            8px 0 0 0 #ff00ff,
            0 4px 0 0 #ff00ff,
            4px 4px 0 0 #ff33ff,
            8px 4px 0 0 #ff33ff,
            12px 4px 0 0 #ff00ff,
            0 8px 0 0 #ff00ff,
            4px 8px 0 0 #ff33ff,
            8px 8px 0 0 #ff66ff,
            12px 8px 0 0 #ff00ff,
            4px 12px 0 0 #ff00ff,
            8px 12px 0 0 #ff00ff;
          animation: pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

PixelHeartAnimation.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string
};

export default PixelHeartAnimation;
