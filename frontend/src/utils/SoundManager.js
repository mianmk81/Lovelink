/**
 * SoundManager.js
 * Utility for managing sound effects in the application
 */

class SoundManager {
  constructor() {
    this.sounds = {};
    this.audioBuffers = {};
    this.muted = localStorage.getItem('soundMuted') === 'true';
    this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.5');
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Pre-initialize audio objects for mobile
    if (this.isMobile) {
      document.addEventListener('touchstart', this.initSoundsOnInteraction, { once: true });
    }
  }
  
  // Initialize sounds on first user interaction (needed for mobile)
  initSoundsOnInteraction = () => {
    // Create a silent audio context to unlock audio on mobile
    const silentSound = new Audio();
    silentSound.play().catch(() => {});
  };

  // Load a sound file
  loadSound(name, path) {
    // Create new Audio element
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = path;
    audio.volume = this.volume;
    
    // For mobile, we need to load the sound immediately
    if (this.isMobile) {
      audio.load();
    }
    
    this.sounds[name] = audio;
    return this;
  }

  // Play a sound by name
  play(name) {
    if (this.muted || !this.sounds[name]) return;
    
    try {
      // For mobile devices, create a new audio instance each time
      // This avoids the lag caused by resetting currentTime
      if (this.isMobile) {
        const sound = this.sounds[name].cloneNode();
        sound.volume = this.volume;
        
        const playPromise = sound.play();
        
        // Handle play() promise to avoid uncaught promise errors on mobile
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Failed to play sound "${name}":`, error);
          });
        }
      } else {
        // For desktop, reuse the audio element
        const sound = this.sounds[name];
        
        // Reset the sound if it's already playing
        sound.pause();
        sound.currentTime = 0;
        
        const playPromise = sound.play();
        
        // Handle play() promise
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Failed to play sound "${name}":`, error);
          });
        }
      }
    } catch (error) {
      console.warn(`Error playing sound "${name}":`, error);
    }
  }

  // Toggle mute state
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('soundMuted', this.muted);
    return this.muted;
  }

  // Set mute state
  setMute(muted) {
    this.muted = muted;
    localStorage.setItem('soundMuted', this.muted);
    return this.muted;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundVolume', this.volume);
    
    // Update volume for all loaded sounds
    Object.values(this.sounds).forEach(audio => {
      audio.volume = this.volume;
    });
    
    return this.volume;
  }

  // Preload all sounds
  preloadSounds(soundMap) {
    Object.entries(soundMap).forEach(([name, path]) => {
      this.loadSound(name, path);
    });
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

export default soundManager;
