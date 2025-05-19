import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import RetroHeader from '../components/RetroHeader';
import RetroButton from '../components/RetroButton';
import LoadingIndicator from '../components/LoadingIndicator';
import RetroFooter from '../components/RetroFooter';
import api from '../services/api';
import supabaseApi from '../services/supabaseApi';
import { useSound } from '../context/SoundContext';
import DashboardHeader from '../components/DashboardHeader';

const ActivityPickerPanel = () => {
  const navigate = useNavigate();
  const { dateSetup, selectedRestaurant, selectActivity } = useDatePlan();
  const { playSound } = useSound();
  const [loading, setLoading] = useState(true);
  const [selectedActivityState, setSelectedActivityState] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch activities based on the date setup preferences
    const fetchActivities = async () => {
      try {
        setLoading(true);
        playSound('findingSpots');
        
        // Get stored API result from date setup if available
        const dateApiResult = JSON.parse(localStorage.getItem('dateApiResult') || '{}');
        
        if (dateApiResult && dateApiResult.activities && dateApiResult.activities.length > 0) {
          // Use activities from the API result
          console.log('Using activities from API result:', dateApiResult.activities);
          setActivities(dateApiResult.activities);
        } else {
          // Generate activities using the API
          const preferences = {
            location: dateSetup.location,
            budget: dateSetup.budget,
            interests: dateSetup.hobbies,
            dietary_restrictions: dateSetup.dietaryNeeds,
            preferences: dateSetup.transit,
            vibe: "romantic",
            style_preference: "casual"
          };
          
          // Call the backend API
          const result = await api.datePlanning.generateDatePlan(preferences);
          console.log('API result for activities:', result);
          
          if (result && result.activities && result.activities.length > 0) {
            setActivities(result.activities);
            // Save the result for other panels to use
            localStorage.setItem('dateApiResult', JSON.stringify(result));
          } else {
            // Fallback to mock data if API doesn't return activities
            const mockActivities = [
              {
                id: 1,
                name: "Retro Arcade Night",
                image: "/images/activities/arcade.svg",
                type: "Entertainment",
                tags: ["Indoor", "Nostalgic", "Competitive"],
                description: `Challenge your date to classic arcade games from the 80s in ${dateSetup.location || 'your area'}.`
              },
              {
                id: 2,
                name: "Stargazing Adventure",
                image: "/images/activities/stargazing.svg",
                type: "Outdoor",
                tags: ["Romantic", "Peaceful", "Night"],
                description: `Escape the city lights near ${dateSetup.location || 'your area'} and enjoy the stars with a guided constellation tour.`
              }
            ];
            
            setActivities(mockActivities);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        
        // Fallback to mock data with location customization
        const mockActivities = [
          {
            id: 1,
            name: "Retro Arcade Night",
            image: "/images/activities/arcade.svg",
            type: "Entertainment",
            tags: ["Indoor", "Nostalgic", "Competitive"],
            description: `Challenge your date to classic arcade games from the 80s in ${dateSetup.location || 'your area'}.`
          },
          {
            id: 2,
            name: "Stargazing Adventure",
            image: "/images/activities/stargazing.svg",
            type: "Outdoor",
            tags: ["Romantic", "Peaceful", "Night"],
            description: `Escape the city lights near ${dateSetup.location || 'your area'} and enjoy the stars with a guided constellation tour.`
          }
        ];
        
        setActivities(mockActivities);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [dateSetup, playSound]);

  const handleSelectActivity = async (activity) => {
    playSound('click');
    setSelectedActivityState(activity);
    selectActivity(activity);
    
    // Save activity to localStorage if user is logged in
    try {
      const { data: userData } = await supabaseApi.getCurrentUser();
      if (userData && userData.user) {
        // Check if activity exists in Supabase
        const { data: activities } = await supabaseApi.getActivities({ name: activity.name });
        
        // If activity doesn't exist, create it
        if (!activities || activities.length === 0) {
          // Store activity in localStorage for now
          // We'll properly save it when we create the date plan
          const storedActivities = JSON.parse(localStorage.getItem('savedActivities') || '[]');
          storedActivities.push(activity);
          localStorage.setItem('savedActivities', JSON.stringify(storedActivities));
        }
      }
    } catch (error) {
      console.error("Error checking activity in Supabase:", error);
      // Continue with flow even if Supabase check fails
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmActivity = async () => {
    // Show loading effect before navigating
    playSound('success');
    setLoading(true);
    
    // Save date plan progress to localStorage
    try {
      const datePlan = {
        title: `Date in ${dateSetup.location}`,
        scheduledFor: new Date().toISOString(),
        location: dateSetup.location,
        budget: dateSetup.budget,
        notes: `Activities and restaurants in ${dateSetup.location}`,
        activity: selectedActivityState
      };
      
      // Store in localStorage for now
      localStorage.setItem('currentDatePlan', JSON.stringify(datePlan));
      
      // We'll save this to Supabase when the user completes the entire date plan
      console.log("Date plan with activity saved to localStorage:", datePlan);
    } catch (error) {
      console.error("Error preparing date plan:", error);
      // Continue with flow even if saving fails
    }
    
    setTimeout(() => {
      navigate('/food-picker');
    }, 1000);
  };

  const handlePickAnotherActivity = () => {
    playSound('click');
    // Keep the activity selected in context, but go back to selection mode
    setShowConfirmation(false);
  };

  const handleMoreOptions = async () => {
    try {
      setLoading(true);
      playSound('findingSpots');
      
      // Get profile data for personalization
      const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
      
      // Prepare request for backend
      const preferences = {
        location: dateSetup.location,
        interests: dateSetup.hobbies,
        budget: dateSetup.budget,
        dietary_restrictions: dateSetup.dietaryNeeds,
        transportation: dateSetup.transit,
        user_name: profileData?.lover1?.name || '',
        partner_name: profileData?.lover2?.name || '',
        user_hobbies: profileData?.lover1?.hobbies || [],
        partner_hobbies: profileData?.lover2?.hobbies || [],
        exclude_ids: activities.map(a => a.id) // Exclude already shown activities
      };
      
      // Call the backend API
      const result = await api.datePlanning.generateDatePlan(preferences);
      
      if (result && result.activities && result.activities.length > 0) {
        setActivities(result.activities);
      } else {
        // Fallback to different mock data
        const moreActivities = [
          {
            id: 3,
            name: "Neon Mini Golf",
            image: "/images/activities/minigolf.svg",
            type: "Entertainment",
            tags: ["Indoor", "Playful", "Casual"],
            description: `Play 18 holes of glow-in-the-dark mini golf in a neon-lit course with 80s music in ${dateSetup.location || 'your area'}.`
          },
          {
            id: 4,
            name: "Drive-In Movie",
            image: "/images/activities/drivein.svg",
            type: "Entertainment",
            tags: ["Outdoor", "Classic", "Romantic"],
            description: `Enjoy a classic film under the stars at a retro drive-in theater near ${dateSetup.location || 'your area'}.`
          }
        ];
        
        setActivities(moreActivities);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more activities:", error);
      
      // Fallback to different mock data with location customization
      const moreActivities = [
        {
          id: 3,
          name: "Neon Mini Golf",
          image: "/images/activities/minigolf.svg",
          type: "Entertainment",
          tags: ["Indoor", "Playful", "Casual"],
          description: `Play 18 holes of glow-in-the-dark mini golf in a neon-lit course with 80s music in ${dateSetup.location || 'your area'}.`
        },
        {
          id: 4,
          name: "Drive-In Movie",
          image: "/images/activities/drivein.svg",
          type: "Entertainment",
          tags: ["Outdoor", "Classic", "Romantic"],
          description: `Enjoy a classic film under the stars at a retro drive-in theater near ${dateSetup.location || 'your area'}.`
        }
      ];
      
      setActivities(moreActivities);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-black crt-effect">
      <DashboardHeader 
        userData={{ username: 'LOVER_1' }} 
        handlePlanNewDate={() => navigate('/date-setup')} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="retro-card p-8 flex flex-col items-center justify-center min-h-[400px]">
              <LoadingIndicator 
                text="Analyzing compatibility patterns..." 
                color="blue" 
                type="dots" 
              />
              <p className="font-ibm-plex text-retro-gray mt-4 text-center">
                SYSTEM: Matching restaurant selection with optimal activities...
              </p>
            </div>
          ) : showConfirmation ? (
            <div className="retro-card mb-6 p-6 border-4 border-neon-green">
              <div className="text-center mb-6">
                <h3 className="font-press-start text-neon-green text-xl mb-4">ACTIVITY LOCKED IN</h3>
                <div className="w-24 h-24 mx-auto mb-4 bg-retro-darkgray rounded-full overflow-hidden border-2 border-neon-yellow">
                  <img 
                    src={selectedActivityState.image} 
                    alt={selectedActivityState.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-orbitron text-neon-purple text-2xl mb-2">{selectedActivityState.name}</p>
                <p className="font-vt323 text-white">{selectedActivityState.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RetroButton
                  onClick={handleConfirmActivity}
                  color="green"
                >
                  CONTINUE TO FOOD
                </RetroButton>
                
                <RetroButton
                  onClick={handlePickAnotherActivity}
                  color="blue"
                >
                  PICK ANOTHER ACTIVITY
                </RetroButton>
              </div>
              
              <p className="font-vt323 text-retro-gray text-center mt-4">
                Tip: Your activity is saved! You can always pick another one if you change your mind.
              </p>
            </div>
          ) : (
            <>
              <div className="retro-card mb-6">
                <p className="font-vt323 text-xl text-neon-blue mb-4">
                  SYSTEM: Activity scan complete. Select your preferred experience to complement your dining choice.
                </p>
                {selectedActivityState && (
                  <div className="p-3 bg-retro-darkgray border-l-4 border-neon-purple">
                    <p className="font-vt323 text-neon-yellow">
                      Currently selected: <span className="text-neon-green">{selectedActivityState.name}</span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {activities.map(activity => (
                  <div 
                    key={activity.id} 
                    className={`retro-card overflow-hidden transition-all duration-300 hover:border-neon-green ${
                      selectedActivityState?.id === activity.id ? 'border-neon-green border-4' : ''
                    }`}
                  >
                    <div className="h-48 overflow-hidden relative vhs-distortion">
                      <img 
                        src={activity.image} 
                        alt={activity.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-neon-green text-retro-black font-vt323 px-2 py-1">
                        {activity.type}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-press-start text-neon-purple text-lg mb-2">{activity.name}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {activity.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-retro-darkgray text-neon-yellow font-vt323 px-2 py-1 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <p className="font-vt323 text-white mb-4">
                        {activity.description}
                      </p>
                      
                      <button
                        onClick={() => handleSelectActivity(activity)}
                        className="w-full bg-retro-black border-2 border-neon-purple text-neon-purple font-press-start py-2 hover:bg-neon-purple hover:text-retro-black transition-colors"
                      >
                        LOCK THIS IN
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <RetroButton
                  onClick={handleMoreOptions}
                  color="yellow"
                  className="mb-4"
                >
                  MORE LIKE THIS
                </RetroButton>
                
                <p className="font-vt323 text-retro-gray">
                  Tip: Choose an activity that complements your restaurant choice for optimal date flow!
                </p>
              </div>
            </>
          )}
          
          <RetroFooter showBackButton={true} backTo="/food-picker" />
        </div>
      </div>
    </div>
  );
};

export default ActivityPickerPanel;
