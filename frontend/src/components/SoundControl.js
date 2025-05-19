import React from 'react';
import { useSound } from '../context/SoundContext';

/**
 * Component for controlling sound settings
 */
const SoundControl = () => {
  const { muted, toggleMute, playSound } = useSound();

  const handleToggle = () => {
    toggleMute();
    // Play a sound when unmuting to provide feedback
    if (muted) {
      setTimeout(() => playSound('toggle'), 50);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 p-2 bg-black border-2 border-neon-pink rounded-full"
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      <div className="text-neon-pink font-vt323 text-xl w-8 h-8 flex items-center justify-center">
        {muted ? '🔇' : '🔊'}
      </div>
    </button>
  );
};

export default SoundControl;
