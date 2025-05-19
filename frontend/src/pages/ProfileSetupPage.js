import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import api from '../services/api';
import RetroHeartBackground from '../components/RetroHeartBackground';
import RetroButton from '../components/RetroButton';
import TypewriterText from '../components/TypewriterText';
import RetroFooter from '../components/RetroFooter';
import RetroCursor from '../components/RetroCursor';
import VHSEffect from '../components/VHSEffect';
import DashboardHeader from '../components/DashboardHeader';
import LoadingAnimation from '../components/LoadingAnimation';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [fadeIn, setFadeIn] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Lover 1, 2: Lover 2
  const [formData, setFormData] = useState({
    lover1: {
      name: '',
      birthday: '',
      hobbies: [],
      favoriteFood: '',
      favoriteMovie: ''
    },
    lover2: {
      name: '',
      birthday: '',
      anniversary: '',
      hobbies: [],
      favoriteFood: '',
      favoriteMovie: ''
    }
  });
  const [hobbyInput, setHobbyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Common hobby suggestions
  const suggestedHobbies = [
    'Gaming', 'Reading', 'Cooking', 'Hiking', 'Movies', 
    'Music', 'Dancing', 'Art', 'Photography', 'Sports',
    'Traveling', 'Yoga', 'Cycling', 'Swimming', 'Gardening'
  ];
  
  // Fade-in animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // If we have existing profile data, load it
      const existingProfile = localStorage.getItem('profileData');
      if (existingProfile) {
        try {
          setFormData(JSON.parse(existingProfile));
        } catch (e) {
          console.error('Error parsing profile data:', e);
        }
      }
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleInputChange = (e, lover) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [lover]: {
        ...prev[lover],
        [name]: value
      }
    }));
  };
  
  const handleHobbyInputChange = (e) => {
    setHobbyInput(e.target.value);
  };
  
  const addCustomHobby = (lover) => {
    if (hobbyInput.trim() !== '' && !formData[lover].hobbies.includes(hobbyInput.trim())) {
      playSound('success');
      setFormData(prev => ({
        ...prev,
        [lover]: {
          ...prev[lover],
          hobbies: [...prev[lover].hobbies, hobbyInput.trim()]
        }
      }));
      setHobbyInput('');
    }
  };
  
  const handleHobbyToggle = (hobby, lover) => {
    playSound('click');
    
    setFormData(prev => {
      const updated = { ...prev };
      if (updated[lover].hobbies.includes(hobby)) {
        updated[lover].hobbies = updated[lover].hobbies.filter(item => item !== hobby);
      } else {
        updated[lover].hobbies = [...updated[lover].hobbies, hobby];
      }
      return updated;
    });
  };
  
  const saveProfileToBackend = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Format the profile data for the backend
      const profileData = {
        user: {
          name: formData.lover1.name,
          birthday: formData.lover1.birthday,
          hobbies: formData.lover1.hobbies,
          favorite_food: formData.lover1.favoriteFood,
          favorite_movie: formData.lover1.favoriteMovie
        },
        partner: {
          name: formData.lover2.name,
          birthday: formData.lover2.birthday,
          anniversary: formData.lover2.anniversary,
          hobbies: formData.lover2.hobbies,
          favorite_food: formData.lover2.favoriteFood,
          favorite_movie: formData.lover2.favoriteMovie
        }
      };
      
      // If we have a token, save to backend
      if (token) {
        await api.auth.saveProfile(profileData, token);
      }
      
      // Always save to localStorage as backup
      localStorage.setItem('profileData', JSON.stringify(formData));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. ' + error.message);
      
      // Still save to localStorage even if backend fails
      localStorage.setItem('profileData', JSON.stringify(formData));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextStep = () => {
    playSound('success');
    
    if (currentStep === 1) {
      // Validate Lover 1 data
      if (!formData.lover1.name.trim()) {
        alert('Please enter your name');
        return;
      }
      setCurrentStep(2);
    } else {
      // Validate Lover 2 data
      if (!formData.lover2.name.trim()) {
        alert('Please enter your partner\'s name');
        return;
      }
      
      // Save profile data to backend and localStorage
      saveProfileToBackend();
    }
  };
  
  // If loading, show loading animation
  if (isLoading) {
    return (
      <RetroHeartBackground heartCount={15}>
        <LoadingAnimation message="SAVING PROFILE..." />
      </RetroHeartBackground>
    );
  }
  
  const renderLover1Form = () => (
    <div className="space-y-6">
      <div className="retro-card p-6 border-2 border-neon-pink">
        <h2 className="font-press-start text-neon-pink text-xl mb-6">YOUR PROFILE</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block font-vt323 text-neon-blue text-lg mb-2">YOUR NAME</label>
            <input
              type="text"
              name="name"
              value={formData.lover1.name}
              onChange={(e) => handleInputChange(e, 'lover1')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
              placeholder="ENTER YOUR NAME"
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-blue text-lg mb-2">YOUR BIRTHDAY</label>
            <input
              type="date"
              name="birthday"
              value={formData.lover1.birthday}
              onChange={(e) => handleInputChange(e, 'lover1')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-blue text-lg mb-2">YOUR FAVORITE FOOD</label>
            <input
              type="text"
              name="favoriteFood"
              value={formData.lover1.favoriteFood}
              onChange={(e) => handleInputChange(e, 'lover1')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
              placeholder="PIZZA, SUSHI, ETC."
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-blue text-lg mb-2">YOUR FAVORITE MOVIE</label>
            <input
              type="text"
              name="favoriteMovie"
              value={formData.lover1.favoriteMovie}
              onChange={(e) => handleInputChange(e, 'lover1')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
              placeholder="BLADE RUNNER, THE BREAKFAST CLUB, ETC."
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-blue text-lg mb-2">YOUR HOBBIES</label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedHobbies.map((hobby, index) => (
                <div 
                  key={index}
                  onClick={() => handleHobbyToggle(hobby, 'lover1')}
                  className={`cursor-pointer px-3 py-1 border ${
                    formData.lover1.hobbies.includes(hobby) 
                      ? 'bg-neon-pink border-neon-pink text-retro-black' 
                      : 'bg-retro-black border-neon-blue text-neon-blue'
                  }`}
                >
                  {hobby}
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={hobbyInput}
                onChange={handleHobbyInputChange}
                className="flex-grow bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
                placeholder="ADD CUSTOM HOBBY"
              />
              <button
                type="button"
                onClick={() => addCustomHobby('lover1')}
                className="ml-2 bg-neon-blue text-retro-black px-4 font-vt323 hover:bg-neon-pink"
              >
                ADD
              </button>
            </div>
            
            {formData.lover1.hobbies.length > 0 && (
              <div className="mt-3">
                <p className="font-vt323 text-neon-green text-lg">SELECTED HOBBIES:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.lover1.hobbies.map((hobby, index) => (
                    <div key={index} className="bg-neon-pink text-retro-black px-3 py-1 font-vt323">
                      {hobby}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <RetroButton
          color="pink"
          size="large"
          className="text-lg px-8 py-3"
          onClick={handleNextStep}
        >
          NEXT: PARTNER INFO
        </RetroButton>
      </div>
    </div>
  );
  
  const renderLover2Form = () => (
    <div className="space-y-6">
      <div className="retro-card p-6 border-2 border-neon-blue">
        <h2 className="font-press-start text-neon-blue text-xl mb-6">PARTNER PROFILE</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block font-vt323 text-neon-pink text-lg mb-2">PARTNER'S NAME</label>
            <input
              type="text"
              name="name"
              value={formData.lover2.name}
              onChange={(e) => handleInputChange(e, 'lover2')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
              placeholder="ENTER PARTNER'S NAME"
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-pink text-lg mb-2">PARTNER'S BIRTHDAY</label>
            <input
              type="date"
              name="birthday"
              value={formData.lover2.birthday}
              onChange={(e) => handleInputChange(e, 'lover2')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-pink text-lg mb-2">YOUR ANNIVERSARY</label>
            <input
              type="date"
              name="anniversary"
              value={formData.lover2.anniversary}
              onChange={(e) => handleInputChange(e, 'lover2')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-pink text-lg mb-2">PARTNER'S FAVORITE FOOD</label>
            <input
              type="text"
              name="favoriteFood"
              value={formData.lover2.favoriteFood}
              onChange={(e) => handleInputChange(e, 'lover2')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
              placeholder="PIZZA, SUSHI, ETC."
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-pink text-lg mb-2">PARTNER'S FAVORITE MOVIE</label>
            <input
              type="text"
              name="favoriteMovie"
              value={formData.lover2.favoriteMovie}
              onChange={(e) => handleInputChange(e, 'lover2')}
              className="w-full bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
              placeholder="BLADE RUNNER, THE BREAKFAST CLUB, ETC."
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-pink text-lg mb-2">PARTNER'S HOBBIES</label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedHobbies.map((hobby, index) => (
                <div 
                  key={index}
                  onClick={() => handleHobbyToggle(hobby, 'lover2')}
                  className={`cursor-pointer px-3 py-1 border ${
                    formData.lover2.hobbies.includes(hobby) 
                      ? 'bg-neon-blue border-neon-blue text-retro-black' 
                      : 'bg-retro-black border-neon-pink text-neon-pink'
                  }`}
                >
                  {hobby}
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={hobbyInput}
                onChange={handleHobbyInputChange}
                className="flex-grow bg-retro-black border-2 border-neon-green p-2 font-vt323 text-neon-green focus:border-neon-pink outline-none"
                placeholder="ADD CUSTOM HOBBY"
              />
              <button
                type="button"
                onClick={() => addCustomHobby('lover2')}
                className="ml-2 bg-neon-pink text-retro-black px-4 font-vt323 hover:bg-neon-blue"
              >
                ADD
              </button>
            </div>
            
            {formData.lover2.hobbies.length > 0 && (
              <div className="mt-3">
                <p className="font-vt323 text-neon-green text-lg">SELECTED HOBBIES:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.lover2.hobbies.map((hobby, index) => (
                    <div key={index} className="bg-neon-blue text-retro-black px-3 py-1 font-vt323">
                      {hobby}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <RetroButton
          color="blue"
          size="large"
          className="text-lg px-8 py-3"
          onClick={handleNextStep}
        >
          COMPLETE SETUP
        </RetroButton>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-retro-black">
      <DashboardHeader 
        userData={{ username: 'LOVER_1' }} 
        handlePlanNewDate={() => navigate('/date-setup')} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <main className="flex-grow">
          <VHSEffect intensity="light">
            <div className="max-w-2xl mx-auto">
              {currentStep === 1 ? renderLover1Form() : renderLover2Form()}
            </div>
          </VHSEffect>
        </main>
        
        <RetroFooter />
      </div>
      
      <RetroCursor color="pink" size="medium" />
    </div>
  );
};

export default ProfileSetupPage;
