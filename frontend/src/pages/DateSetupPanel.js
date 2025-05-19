import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import { useSound } from '../context/SoundContext';
import api from '../services/api';
import supabaseApi from '../services/supabaseApi';
import RetroHeader from '../components/RetroHeader';
import RetroButton from '../components/RetroButton';
import RetroFooter from '../components/RetroFooter';
import TypewriterText from '../components/TypewriterText';
import PixelIcon from '../components/PixelIcon';
import LoadingAnimation from '../components/LoadingAnimation';
import RetroHeartBackground from '../components/RetroHeartBackground';
import DashboardHeader from '../components/DashboardHeader';

const DateSetupPanel = () => {
  const navigate = useNavigate();
  const { dateSetup, updateDateSetup, setIsLoading: setContextIsLoading } = useDatePlan();
  const { playSound } = useSound();
  const [formData, setFormData] = useState({
    location: dateSetup.location || '',
    hobbies: dateSetup.hobbies || [],
    budget: dateSetup.budget || 'free',
    dietaryNeeds: dateSetup.dietaryNeeds || [],
    transit: dateSetup.transit || []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [hobbyInput, setHobbyInput] = useState('');
  const [error, setError] = useState('');
  
  // Fade-in animation when component mounts
  useEffect(() => {
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Load user preferences from Supabase when component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const { data: userData } = await supabaseApi.getCurrentUser();
        if (userData && userData.user) {
          // Get user preferences from Supabase
          const { data: preferences } = await supabaseApi.getUserPreferences();
          
          if (preferences) {
            // Update form data with saved preferences
            setFormData(prev => ({
              ...prev,
              budget: preferences.budget_preference || prev.budget,
              dietaryNeeds: preferences.dietary_needs || prev.dietaryNeeds,
              transit: preferences.transit_preferences || prev.transit
            }));
            console.log("Loaded user preferences from Supabase");
          }
        }
      } catch (error) {
        console.error("Error loading preferences from Supabase:", error);
        // Continue with default preferences if Supabase load fails
      }
    };
    
    loadUserPreferences();
  }, []);

  // Suggested hobby options
  const suggestedHobbies = [
    { id: 'movies', label: 'Movies' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'music', label: 'Music' },
    { id: 'sports', label: 'Sports' },
    { id: 'art', label: 'Art' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'reading', label: 'Reading' },
    { id: 'hiking', label: 'Hiking' },
    { id: 'dancing', label: 'Dancing' },
    { id: 'photography', label: 'Photography' }
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'nut-free', label: 'Nut-Free' }
  ];

  const transitOptions = [
    { id: 'walkable', label: 'Walkable' },
    { id: 'parking', label: 'Free Parking' },
    { id: 'public', label: 'Public Transit' },
    { id: 'rideshare', label: 'Rideshare Friendly' }
  ];

  const budgetOptions = [
    { id: 'free', label: 'Free Activities', description: 'No cost required' },
    { id: 'low', label: 'Budget-Friendly', description: 'Under $25 per person' },
    { id: 'medium', label: 'Mid-Range', description: '$25-$50 per person' },
    { id: 'high', label: 'Splurge', description: '$50-$100 per person' },
    { id: 'luxury', label: 'Luxury', description: '$100+ per person' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleHobbyInputChange = (e) => {
    setHobbyInput(e.target.value);
  };

  const addCustomHobby = () => {
    if (hobbyInput.trim() !== '' && !formData.hobbies.includes(hobbyInput.trim())) {
      playSound('success'); // Play success sound when hobby is added
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()]
      }));
      setHobbyInput('');
    }
  };

  const handleHobbyToggle = (hobby) => {
    playSound('click'); // Play click sound when hobby is toggled
    setFormData(prev => {
      const updated = { ...prev };
      if (updated.hobbies.includes(hobby)) {
        updated.hobbies = updated.hobbies.filter(item => item !== hobby);
      } else {
        updated.hobbies = [...updated.hobbies, hobby];
      }
      return updated;
    });
  };

  const handleDietaryToggle = (option) => {
    playSound('click'); // Play click sound when dietary option is toggled
    setFormData(prev => {
      const updated = { ...prev };
      if (updated.dietaryNeeds.includes(option)) {
        updated.dietaryNeeds = updated.dietaryNeeds.filter(item => item !== option);
      } else {
        updated.dietaryNeeds = [...updated.dietaryNeeds, option];
      }
      return updated;
    });
  };

  const handleTransitToggle = (option) => {
    playSound('click'); // Play click sound when transit option is toggled
    setFormData(prev => {
      const updated = { ...prev };
      if (updated.transit.includes(option)) {
        updated.transit = updated.transit.filter(item => item !== option);
      } else {
        updated.transit = [...updated.transit, option];
      }
      return updated;
    });
  };

  const generateDatePlan = async () => {
    setIsLoading(true);
    setError('');
    playSound('findingSpots');
    
    try {
      // Get profile data for personalization
      const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
      
      // Map frontend data format to backend expected format
      const preferences = {
        location: formData.location,
        budget: formData.budget,
        interests: formData.hobbies,
        dietary_restrictions: formData.dietaryNeeds,
        preferences: formData.transit, // Map transit preferences to preferences field
        vibe: "romantic", // Default vibe
        style_preference: "casual" // Default style
      };
      
      console.log("Sending to backend:", preferences);
      
      // Save user preferences to Supabase if user is logged in
      try {
        const { data: userData } = await supabaseApi.getCurrentUser();
        if (userData && userData.user) {
          // Save preferences to Supabase
          await supabaseApi.saveUserPreferences({
            dietaryNeeds: formData.dietaryNeeds,
            transitPreferences: formData.transit,
            budgetPreference: formData.budget
          });
          console.log("User preferences saved to Supabase");
        }
      } catch (supabaseError) {
        console.error("Error saving preferences to Supabase:", supabaseError);
        // Continue with API call even if Supabase save fails
      }
      
      // Call the backend API
      const result = await api.datePlanning.generateDatePlan(preferences);
      console.log("API result:", result);
      
      // Save to context
      updateDateSetup(formData);
      
      // Store the API result in localStorage for the next screens
      localStorage.setItem('dateApiResult', JSON.stringify(result));
      
      // Navigate to activity picker
      setTimeout(() => {
        navigate('/activity-picker');
      }, 1000);
    } catch (error) {
      console.error('Error generating date plan:', error);
      setError('Failed to generate date plan. ' + error.message);
      
      // Still save to context even if API fails
      updateDateSetup(formData);
      
      // Create mock data for fallback
      const mockResult = {
        activities: [
          {
            id: 1,
            name: "Retro Arcade Night",
            image: "https://images.unsplash.com/photo-1511882150382-421056c89033",
            type: "Entertainment",
            tags: ["Indoor", "Nostalgic", "Competitive"],
            description: `Challenge your date to classic arcade games from the 80s in ${formData.location || 'your area'}.`
          },
          {
            id: 2,
            name: "Stargazing Adventure",
            image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
            type: "Outdoor",
            tags: ["Romantic", "Peaceful", "Night"],
            description: `Escape the city lights near ${formData.location || 'your area'} and enjoy the stars with a guided constellation tour.`
          }
        ],
        restaurants: [
          {
            id: 1,
            name: "Neon Noodle House",
            image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
            cuisine: "Asian Fusion",
            rating: 4.7,
            distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${formData.location || 'your location'}`,
            vibe: ["Late Night Bites", "Cyberpunk Vibes"]
          },
          {
            id: 2,
            name: "Pixel Pizza Parlor",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
            cuisine: "Italian",
            rating: 4.5,
            distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${formData.location || 'your location'}`,
            vibe: ["Retro Gaming", "Family Friendly"]
          }
        ],
        surprise: {
          id: 1,
          name: "Mixtape Creation",
          description: `Create a custom digital mixtape of songs that remind you of each other. Find a local record store in ${formData.location || 'your area'} to browse for inspiration.`,
          image: "https://images.unsplash.com/photo-1619983081563-430f63602796"
        }
      };
      
      // Save mock data to localStorage
      localStorage.setItem('dateApiResult', JSON.stringify(mockResult));
      
      // Navigate to activity picker with mock data
      setTimeout(() => {
        navigate('/activity-picker');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.location) {
      alert('Please enter your location');
      return;
    }
    
    // Generate date plan
    generateDatePlan();
  };

  if (isLoading) {
    return (
      <RetroHeartBackground heartCount={15}>
        <LoadingAnimation message="FINDING PERFECT SPOTS..." />
      </RetroHeartBackground>
    );
  }

  return (
    <div className="min-h-screen bg-retro-black crt-effect">
      <DashboardHeader 
        userData={{ username: 'LOVER_1' }} 
        handlePlanNewDate={() => navigate('/date-setup')} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location */}
            <div className="retro-card">
              <label className="block font-ibm-plex text-neon-pink mb-2">
                <PixelIcon name="location" size={20} className="mr-2" />
                LOCATION (ZIP or CITY)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-retro-darkgray border-2 border-neon-blue p-3 font-vt323 text-xl text-white focus:border-neon-pink focus:outline-none"
                placeholder="Enter your location..."
                required
              />
            </div>
            
            {/* Hobbies Input */}
            <div className="retro-card">
              <label className="block font-ibm-plex text-neon-pink mb-2">
                <PixelIcon name="hobbies" size={20} className="mr-2" />
                YOUR HOBBIES & INTERESTS
              </label>
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={hobbyInput}
                    onChange={handleHobbyInputChange}
                    className="flex-grow bg-retro-darkgray border-2 border-neon-green p-3 font-vt323 text-xl text-white focus:border-neon-pink focus:outline-none"
                    placeholder="Add your own hobby..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHobby())}
                  />
                  <RetroButton 
                    type="button" 
                    color="green" 
                    onClick={addCustomHobby}
                    className="whitespace-nowrap"
                  >
                    ADD
                  </RetroButton>
                </div>
                <p className="text-neon-blue font-vt323 text-sm mt-1">Press Enter or click ADD to add your hobby</p>
              </div>
              
              <div className="mb-2">
                <p className="font-ibm-plex text-neon-yellow text-sm mb-2">SUGGESTED HOBBIES:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {suggestedHobbies.map(hobby => (
                    <button
                      key={hobby.id}
                      type="button"
                      onClick={() => handleHobbyToggle(hobby.id)}
                      className={`p-2 border-2 font-vt323 text-sm transition-all ${
                        formData.hobbies.includes(hobby.id)
                          ? 'border-neon-cyan bg-neon-cyan bg-opacity-30 text-white'
                          : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:bg-opacity-20'
                      }`}
                    >
                      <PixelIcon name={hobby.id} size={16} className="mr-1" />
                      {hobby.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {formData.hobbies.length > 0 && (
                <div>
                  <p className="font-ibm-plex text-neon-green text-sm mb-2">YOUR SELECTED HOBBIES:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.hobbies.map(hobby => {
                      const matchedHobby = suggestedHobbies.find(h => h.id === hobby);
                      const displayText = matchedHobby ? matchedHobby.label : hobby;
                      
                      return (
                        <div 
                          key={hobby} 
                          className="bg-retro-darkgray border-2 border-neon-green rounded px-3 py-1 flex items-center"
                        >
                          <span className="font-vt323 text-neon-green mr-2">{displayText}</span>
                          <button 
                            type="button" 
                            onClick={() => handleHobbyToggle(hobby)}
                            className="text-neon-red hover:text-neon-pink"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Budget Options */}
            <div className="retro-card">
              <label className="block font-ibm-plex text-neon-pink mb-2">
                <PixelIcon name="budget" size={20} className="mr-2" />
                BUDGET RANGE
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {budgetOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      playSound('click'); // Play click sound when budget option is selected
                      setFormData({...formData, budget: option.id});
                    }}
                    className={`p-3 border-2 font-vt323 text-lg transition-all ${
                      formData.budget === option.id
                        ? 'border-neon-green bg-neon-green bg-opacity-30 text-white'
                        : 'border-neon-green text-neon-green hover:bg-neon-green hover:bg-opacity-20'
                    }`}
                    onMouseEnter={() => playSound('hover')} // Play hover sound when mouse enters
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg flex items-center">
                        <PixelIcon name={option.id} size={18} className="mr-2" />
                        {option.label}
                      </span>
                      <span className="text-xs opacity-80">{option.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Dietary Needs */}
            <div className="retro-card">
              <label className="block font-ibm-plex text-neon-pink mb-2">
                <PixelIcon name="dietary" size={20} className="mr-2" />
                DIETARY NEEDS
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleDietaryToggle(option.id)}
                    className={`p-2 border-2 font-vt323 text-lg transition-all ${
                      formData.dietaryNeeds.includes(option.id)
                        ? 'border-neon-green bg-neon-green bg-opacity-30 text-white'
                        : 'border-neon-green text-neon-green hover:bg-neon-green hover:bg-opacity-20'
                    }`}
                  >
                    <div className="flex items-center">
                      <PixelIcon name={option.id} size={16} className="mr-2" />
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Transit Filters */}
            <div className="retro-card">
              <label className="block font-ibm-plex text-neon-pink mb-2">
                <PixelIcon name="transit" size={20} className="mr-2" />
                TRANSIT FILTERS
              </label>
              <div className="grid grid-cols-2 gap-3">
                {transitOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleTransitToggle(option.id)}
                    className={`p-2 border-2 font-vt323 text-lg transition-all ${
                      formData.transit.includes(option.id)
                        ? 'border-neon-yellow bg-neon-yellow bg-opacity-30 text-white'
                        : 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:bg-opacity-20'
                    }`}
                  >
                    <div className="flex items-center">
                      <PixelIcon name={option.id} size={16} className="mr-2" />
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="text-center">
              <RetroButton
                type="submit"
                color="blue"
                className="text-lg"
                disabled={isLoading}
              >
                SHOW DATE OPTIONS
              </RetroButton>
              
              {isLoading && (
                <div className="mt-4">
                  <TypewriterText 
                    text="Analyzing hobbies and generating personalized date suggestions..." 
                    className="font-vt323 text-neon-green text-xl"
                  />
                </div>
              )}
            </div>
          </form>
          
          <RetroFooter showBackButton={true} backTo="/" />
        </div>
      </div>
    </div>
  );
};

export default DateSetupPanel;
