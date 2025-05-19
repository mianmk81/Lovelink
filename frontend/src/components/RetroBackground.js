import React from 'react';
import PropTypes from 'prop-types';

/**
 * A retro-style animated background component with grid and floating pixelated hearts
 */
const RetroBackground = ({ children, className = '' }) => {
  return (
    <div className={`retro-background relative overflow-hidden ${className}`}>
      {/* Background grid and elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid lines */}
        <div className="grid-container absolute inset-0"></div>
        
        {/* Floating pixelated hearts */}
        <div className="floating-elements">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="pixel-heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 10}s`,
                opacity: 0.2 + Math.random() * 0.5,
                transform: `scale(${0.5 + Math.random() * 1.5})`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Styles */}
      <style jsx="true">{`
        .retro-background {
          background-color: #000;
          min-height: 100vh;
        }
        
        .grid-container {
          background-image: 
            linear-gradient(to right, rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 0, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-scroll 20s linear infinite;
        }
        
        /* Pixelated heart using box-shadow */
        .pixel-heart {
          position: absolute;
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
        
        @keyframes grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
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

RetroBackground.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default RetroBackground;
