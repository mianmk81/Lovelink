import { useEffect, useState } from 'react';
import soundManager from '../utils/SoundManager';

/**
 * Custom hook for using sound effects in components
 */
const useSounds = (soundsToLoad = {}) => {
  const [muted, setMuted] = useState(soundManager.muted);
  const [volume, setVolume] = useState(soundManager.volume);
  const [isLoading, setIsLoading] = useState(Object.keys(soundsToLoad).length > 0);

  // Load sounds on component mount
  useEffect(() => {
    if (Object.keys(soundsToLoad).length > 0) {
      // Set a flag to indicate loading is in progress
      setIsLoading(true);
      
      // Preload sounds in batches to avoid overwhelming the browser
      const soundEntries = Object.entries(soundsToLoad);
      const batchSize = 2; // Load 2 sounds at a time
      
      // Function to load a batch of sounds
      const loadBatch = (startIndex) => {
        const batch = soundEntries.slice(startIndex, startIndex + batchSize);
        
        if (batch.length === 0) {
          // All sounds loaded
          setIsLoading(false);
          return;
        }
        
        // Load each sound in the current batch
        batch.forEach(([name, path]) => {
          soundManager.loadSound(name, path);
        });
        
        // Schedule the next batch with a small delay
        setTimeout(() => {
          loadBatch(startIndex + batchSize);
        }, 100);
      };
      
      // Start loading the first batch
      loadBatch(0);
    }
  }, [soundsToLoad]);

  // Play a sound with debouncing for performance
  const playSound = (name) => {
    // Skip if sounds are still loading
    if (isLoading) return;
    
    soundManager.play(name);
  };

  // Toggle mute state
  const toggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setMuted(newMuted);
    return newMuted;
  };

  // Set mute state
  const setMuteState = (muteState) => {
    const newMuted = soundManager.setMute(muteState);
    setMuted(newMuted);
    return newMuted;
  };

  // Set volume
  const setVolumeLevel = (newVolume) => {
    const vol = soundManager.setVolume(newVolume);
    setVolume(vol);
    return vol;
  };

  return {
    playSound,
    toggleMute,
    setMute: setMuteState,
    setVolume: setVolumeLevel,
    muted,
    volume,
    isLoading
  };
};

export default useSounds;
