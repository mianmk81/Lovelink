import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * A retro-style background with animated pixelated hearts
 */
const RetroHeartBackground = ({ children, heartCount = 20, className = '' }) => {
  // Generate random positions for hearts
  const hearts = useMemo(() => {
    return Array.from({ length: heartCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5
    }));
  }, [heartCount]);

  return (
    <div className={`retro-heart-background relative overflow-hidden ${className}`}>
      {/* Grid background */}
      <div className="absolute inset-0 z-0">
        <div className="grid-lines"></div>
      </div>
      
      {/* Floating hearts */}
      <div className="absolute inset-0 z-10">
        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="pixel-heart absolute"
            style={{
              left: heart.left,
              top: heart.top,
              transform: `scale(${heart.size})`,
              opacity: heart.opacity,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
      
      {/* Styles */}
      <style jsx="true">{`
        .retro-heart-background {
          background-color: #000;
          min-height: 100vh;
          width: 100%;
        }
        
        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 0, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-scroll 20s linear infinite;
        }
        
        @keyframes grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
        
        /* Pixelated heart using box-shadow */
        .pixel-heart {
          width: 8px;
          height: 8px;
          background-color: transparent;
          box-shadow:
            /* Row 1 */
            8px 0 0 0 #ff00ff,
            16px 0 0 0 #ff00ff,
            32px 0 0 0 #ff00ff,
            40px 0 0 0 #ff00ff,
            
            /* Row 2 */
            0 8px 0 0 #ff00ff,
            8px 8px 0 0 #ff33ff,
            16px 8px 0 0 #ff33ff,
            24px 8px 0 0 #ff00ff,
            32px 8px 0 0 #ff33ff,
            40px 8px 0 0 #ff33ff,
            48px 8px 0 0 #ff00ff,
            
            /* Row 3 */
            0 16px 0 0 #ff00ff,
            8px 16px 0 0 #ff33ff,
            16px 16px 0 0 #ff66ff,
            24px 16px 0 0 #ff33ff,
            32px 16px 0 0 #ff66ff,
            40px 16px 0 0 #ff33ff,
            48px 16px 0 0 #ff00ff,
            
            /* Row 4 */
            8px 24px 0 0 #ff00ff,
            16px 24px 0 0 #ff33ff,
            24px 24px 0 0 #ff66ff,
            32px 24px 0 0 #ff33ff,
            40px 24px 0 0 #ff00ff,
            
            /* Row 5 */
            16px 32px 0 0 #ff00ff,
            24px 32px 0 0 #ff33ff,
            32px 32px 0 0 #ff00ff,
            
            /* Row 6 */
            24px 40px 0 0 #ff00ff;
          
          animation: float-heart 15s ease-in-out infinite alternate;
          z-index: 1;
        }
        
        @keyframes float-heart {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(30px, -30px) rotate(5deg) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg) scale(0.9);
          }
          100% {
            transform: translate(10px, -10px) rotate(0deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

RetroHeartBackground.propTypes = {
  children: PropTypes.node.isRequired,
  heartCount: PropTypes.number,
  className: PropTypes.string
};

export default RetroHeartBackground;
