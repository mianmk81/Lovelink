import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RetroButton from './RetroButton';

const RetroFooter = ({ 
  showBackButton = false, 
  backTo = '/', 
  showResetButton = false,
  onReset = null,
  customMessage = null,
  versionInfo = true,
  showHeartbeat = true,
  className = '' 
}) => {
  const currentYear = new Date().getFullYear();
  const randomBuild = Math.floor(Math.random() * 10) + 1;
  
  return (
    <footer className={`mt-12 text-center ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-4 mb-6">
          {showBackButton && (
            <RetroButton 
              color="blue"
              size="small"
              variant="outline"
              onClick={() => {}}
              icon="←"
            >
              <Link to={backTo}>BACK</Link>
            </RetroButton>
          )}
          
          {showResetButton && (
            <RetroButton 
              color="red"
              size="small"
              variant="outline"
              onClick={onReset}
              icon="↺"
            >
              RESET
            </RetroButton>
          )}
        </div>
        
        {customMessage && (
          <div className="mb-4 font-vt323 text-neon-green text-lg">
            {customMessage}
          </div>
        )}
        
        {versionInfo && (
          <div className="text-retro-lightgray font-ibm-plex text-xs">
            <p>LoveLink '89 v1.2 • APR 1989 •  BUILD {randomBuild}.2</p>
            <p className="mt-2 text-retro-gray">SYSTEM: Love probability increasing...</p>
            <p className="mt-1 text-retro-gray opacity-70"> {currentYear} LoveLink Industries</p>
          </div>
        )}
        
        {showHeartbeat && (
          <div className="mt-4 flex justify-center">
            <div className="animate-pulse-neon">
              <span className="text-neon-pink text-2xl">♥</span>
            </div>
          </div>
        )}
        
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          <div className="scanline"></div>
        </div>
      </div>
      
      {/* Easter egg - hidden message that appears on hover */}
      <div className="mt-6 opacity-0 hover:opacity-100 transition-opacity duration-1000 text-xs font-vt323 text-neon-green">
        HIDDEN MESSAGE: "The perfect date is the one where you both forget to check your phones."
      </div>
    </footer>
  );
};

RetroFooter.propTypes = {
  showBackButton: PropTypes.bool,
  backTo: PropTypes.string,
  showResetButton: PropTypes.bool,
  onReset: PropTypes.func,
  customMessage: PropTypes.string,
  versionInfo: PropTypes.bool,
  showHeartbeat: PropTypes.bool,
  className: PropTypes.string
};

export default RetroFooter;
