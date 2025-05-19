import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfileEditPage from './pages/ProfileEditPage';
import DashboardPage from './pages/DashboardPage';
import DateSetupPanel from './pages/DateSetupPanel';
import ActivityPickerPanel from './pages/ActivityPickerPanel';
import FoodPickerPanel from './pages/FoodPickerPanel';
import FinalPlanPanel from './pages/FinalPlanPanel';
import LocalEventsPage from './pages/LocalEventsPage';
import { DatePlanProvider } from './context/DatePlanContext';
import { SoundProvider } from './context/SoundContext';
import SoundControl from './components/SoundControl';

// Import sound files
import clickSound from './assets/sounds/click.wav';
import loadingSound from './assets/sounds/loading.wav';
import typewriterSound from './assets/sounds/typewriter.wav';
import findingSpotsSound from './assets/sounds/findingSpots.wav';

function App() {
  // Define sounds to load
  const sounds = {
    click: clickSound,
    loading: loadingSound,
    welcomeTypewriter: typewriterSound, // Only used for welcome animation
    findingSpots: findingSpotsSound,
    // Use click sound for these interactions until we have specific sounds
    success: clickSound,
    toggle: clickSound
  };

  return (
    <SoundProvider initialSounds={sounds}>
      <DatePlanProvider>
        <div className="App crt-effect min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/profile-edit" element={<ProfileEditPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/local-events" element={<LocalEventsPage />} />
            <Route path="/date-setup" element={<DateSetupPanel />} />
            <Route path="/activity-picker" element={<ActivityPickerPanel />} />
            <Route path="/food-picker" element={<FoodPickerPanel />} />
            <Route path="/final-plan" element={<FinalPlanPanel />} />
          </Routes>
          <SoundControl />
        </div>
      </DatePlanProvider>
    </SoundProvider>
  );
}

export default App;
