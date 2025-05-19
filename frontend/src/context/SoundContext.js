import React, { createContext, useContext } from 'react';
import useSounds from '../hooks/useSounds';

// Create a context for sounds
const SoundContext = createContext();

/**
 * Provider component for sound functionality
 */
export const SoundProvider = ({ children, initialSounds = {} }) => {
  const soundControls = useSounds(initialSounds);
  
  return (
    <SoundContext.Provider value={soundControls}>
      {children}
    </SoundContext.Provider>
  );
};

/**
 * Hook to use the sound context
 */
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export default SoundContext;
