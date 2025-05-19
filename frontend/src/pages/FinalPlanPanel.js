import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import RetroHeader from '../components/RetroHeader';
import RetroButton from '../components/RetroButton';
import LoadingIndicator from '../components/LoadingIndicator';
import RetroFooter from '../components/RetroFooter';
import VHSEffect from '../components/VHSEffect';
import CRTEffect from '../components/CRTEffect';
import supabaseApi from '../services/supabaseApi';
import supabase, { checkConnection, getCurrentUser } from '../services/supabaseClient';

// Arrays of different date tips for each category
const conversationStarters = [
  [
    "Ask about favorite 80s/90s movies or TV shows",
    "Discuss dream vacation destinations",
    "Share childhood memories from your hometown"
  ],
  [
    "Talk about your first concert experience",
    "Discuss favorite books or authors",
    "Share an embarrassing story from high school"
  ],
  [
    "Ask about their favorite music from the 80s/90s",
    "Discuss what superpower they'd choose",
    "Share a funny family tradition"
  ],
  [
    "Talk about your favorite retro video games",
    "Ask about their dream car from any era",
    "Discuss favorite childhood cartoons"
  ]
];

const diningEtiquette = [
  [
    "Put phones away to stay present",
    "Try each other's food for a shared experience",
    "Ask about food preferences and allergies"
  ],
  [
    "Order something you've never tried before",
    "Ask the server for their recommendations",
    "Share a dessert for a sweet ending"
  ],
  [
    "Take a photo of your meal together",
    "Compliment the chef if you enjoy the food",
    "Discuss your favorite restaurants"
  ],
  [
    "Try to guess the ingredients in each dish",
    "Share food stories from your childhood",
    "Take turns ordering for each other"
  ]
];

const activityAdvice = [
  [
    "Arrive 10-15 minutes early",
    "Be open to trying new things together",
    "Take photos to remember the experience"
  ],
  [
    "Dress appropriately for the activity",
    "Be a good sport, even if you're not winning",
    "Suggest a follow-up activity if you're having fun"
  ],
  [
    "Research the activity beforehand",
    "Bring water and snacks if needed",
    "Have a backup plan in case of bad weather"
  ],
  [
    "Focus on having fun, not being perfect",
    "Ask questions if you don't understand something",
    "Thank the staff or organizers afterward"
  ]
];

const romanceBoosters = [
  [
    "Compliment something specific about your date",
    "Create a shared playlist for the car ride",
    "End the night with a thoughtful thank you"
  ],
  [
    "Hold hands during the walk between venues",
    "Plan a small surprise like their favorite candy",
    "Notice and comment on something they care about"
  ],
  [
    "Bring up a happy memory you share",
    "Ask about their dreams for the future",
    "Find a scenic spot for a moment together"
  ],
  [
    "Create a mini scavenger hunt during the date",
    "Write a short note to leave with the tip",
    "Suggest stargazing after the main activities"
  ]
];

const FinalPlanPanel = () => {
  const location = useLocation();
  // const navigate = useNavigate(); // Uncomment if navigation is needed
  const passedDate = location.state?.date;
  const { dateSetup, selectedRestaurant, selectedActivity, surprise, compileFinalPlan } = useDatePlan();
  const [loading, setLoading] = useState(true);
  const [datePlan, setDatePlan] = useState(null);
  const [tipSet] = useState(Math.floor(Math.random() * 4)); // Randomly select one of the 4 sets of tips
  const [saveStatus, setSaveStatus] = useState(null); // For showing save confirmation
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const [showLoginForm, setShowLoginForm] = useState(false); // Show login form when needed
  
  // Add a ref to track if the component is mounted and if we've already loaded the plan
  const planLoaded = useRef(false);

  // Simplified useEffect that only runs once
  useEffect(() => {
    // Skip if we've already loaded a plan
    if (planLoaded.current) return;
    planLoaded.current = true;
    
    async function loadPlan() {
      try {
        setLoading(true);
        console.log('Loading date plan...');
        
        // If we have a date passed from the dashboard, use that
        if (passedDate) {
          console.log('Using passed date:', passedDate);
          const formattedDate = {
            timestamp: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            restaurant: {
              name: passedDate.food,
              image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
              cuisine: "Retro Cuisine",
              rating: "4.8",
              distance: "Nearby",
              vibe: ["Retro", "Nostalgic"]
            },
            activity: {
              name: passedDate.activity,
              image: "https://images.unsplash.com/photo-1604014137308-28951f810955",
              type: "Entertainment",
              tags: ["Fun", "Exciting"],
              location: passedDate.location
            },
            date: passedDate.date,
            time: passedDate.time
          };
          
          setDatePlan(formattedDate);
        } else if (selectedRestaurant && selectedActivity) {
          // Use the context data to create a plan
          try {
            const plan = await compileFinalPlan();
            console.log('Plan compiled successfully:', plan);
            setDatePlan(plan);
          } catch (error) {
            console.error('Error compiling plan:', error);
            // Fallback to direct data
            const directPlan = {
              timestamp: new Date().toLocaleString(),
              restaurant: selectedRestaurant,
              activity: selectedActivity,
              surprise: surprise || {
                name: "Mixtape Creation",
                description: "Create a custom digital mixtape of songs that remind you of each other.",
                image: "https://images.unsplash.com/photo-1619983081563-430f63602796"
              }
            };
            setDatePlan(directPlan);
          }
        } else {
          // Create a fallback plan if we don't have restaurant and activity
          const fallbackPlan = {
            timestamp: new Date().toLocaleString(),
            restaurant: {
              name: "Retro Diner",
              image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
              cuisine: "American",
              rating: 4.5,
              distance: "1.2 miles",
              vibe: ["Nostalgic", "Casual"]
            },
            activity: {
              name: "Retro Arcade Night",
              image: "/images/activities/arcade.svg",
              type: "Entertainment",
              tags: ["Indoor", "Nostalgic"],
              description: "Challenge your date to classic arcade games from the 80s."
            }
          };
          setDatePlan(fallbackPlan);
        }
      } catch (error) {
        console.error('Error loading plan:', error);
        // Set emergency fallback
        const emergencyPlan = {
          timestamp: new Date().toLocaleString(),
          restaurant: { 
            name: "Fallback Restaurant", 
            cuisine: "Various",
            image: "https://images.unsplash.com/photo-1555126634-323283e090fa"
          },
          activity: { 
            name: "Fallback Activity", 
            type: "Entertainment",
            image: "/images/activities/arcade.svg"
          }
        };
        setDatePlan(emergencyPlan);
      } finally {
        // Always set loading to false when we're done
        setLoading(false);
      }
    }
    
    // Start loading the plan
    loadPlan();
  }, [compileFinalPlan, passedDate, selectedActivity, selectedRestaurant, surprise]); // Include all dependencies

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image
    alert("In a full implementation, this would generate a downloadable VHS-styled PDF of your date plan!");
  };

  const handleSavePlan = async () => {
    if (isSaving) return; // Prevent multiple save attempts
    
    setIsSaving(true);
    
    try {
      // First try to save to database if possible
      let user = null;
      let isConnected = false;
      
      try {
        // Check connection and authentication without throwing
        isConnected = await checkConnection();
        if (isConnected) {
          user = await getCurrentUser();
        }
      } catch (connectionError) {
        console.log('Connection check failed:', connectionError);
        // Continue with localStorage fallback
      }
      
      console.log('Saving date plan to database');
      
      // Create restaurant in database if it doesn't exist
      const restaurantData = {
        name: datePlan?.restaurant?.name || 'Restaurant',
        image_url: datePlan?.restaurant?.image || 'https://images.unsplash.com/photo-1555126634-323283e090fa',
        cuisine: datePlan?.restaurant?.cuisine || 'Cuisine',
        rating: datePlan?.restaurant?.rating || 4.5,
        location: dateSetup?.location || 'Local Area',
        price_level: datePlan?.restaurant?.price_level || 2,
        vibe: JSON.stringify(datePlan?.restaurant?.vibe || ['Cozy'])
      };
      
      console.log('Creating restaurant record:', restaurantData);
      const { data: restaurantResult, error: restaurantError } = await supabaseApi.createRestaurant(restaurantData);
      
      if (restaurantError) {
        console.error('Error creating restaurant:', restaurantError);
        throw new Error(`Failed to save restaurant data: ${restaurantError.message}`);
      }
      
      // Create activity in database if it doesn't exist
      const activityData = {
        name: datePlan?.activity?.name || 'Activity',
        image_url: datePlan?.activity?.image || 'https://images.unsplash.com/photo-1511882150382-421056c89033',
        type: datePlan?.activity?.type || 'Entertainment',
        tags: JSON.stringify(datePlan?.activity?.tags || ['Fun']),
        description: datePlan?.activity?.description || 'A fun activity',
        location: dateSetup?.location || 'Local Area'
      };
      
      console.log('Creating activity record:', activityData);
      const { data: activityResult, error: activityError } = await supabaseApi.createActivity(activityData);
      
      if (activityError) {
        console.error('Error creating activity:', activityError);
        throw new Error(`Failed to save activity data: ${activityError.message}`);
      }
      
      // Create the date plan with references to the restaurant and activity
      const datePlanData = {
        user_id: user.id,
        title: `Date in ${dateSetup?.location || 'Local Area'}`,
        scheduled_for: new Date().toISOString(),
        location: dateSetup?.location || 'Local Area',
        budget: dateSetup?.budget || 'Medium',
        notes: `A ${datePlan?.restaurant?.cuisine || 'delicious'} meal at ${datePlan?.restaurant?.name || 'a restaurant'} and ${datePlan?.activity?.name || 'an activity'}.`,
        status: 'planned'
      };
      
      // If we have a connection and user, save to database
      if (isConnected && user) {
        console.log('Creating date plan record:', datePlanData);
        const { data: datePlanResult, error: datePlanError } = await supabaseApi.createDatePlan(datePlanData);
        
        if (datePlanError) {
          console.error('Error creating date plan:', datePlanError);
          throw new Error(`Failed to save date plan: ${datePlanError.message}`);
        }
        
        // Link restaurant and activity to the date plan
        if (datePlanResult?.id && restaurantResult?.id) {
          console.log('Linking restaurant to date plan');
          await supabaseApi.addRestaurantToDatePlan(datePlanResult.id, restaurantResult.id);
        }
        
        if (datePlanResult?.id && activityResult?.id) {
          console.log('Linking activity to date plan');
          await supabaseApi.addActivityToDatePlan(datePlanResult.id, activityResult.id);
        }
        
        // Update user preferences based on this date plan
        const preferencesUpdate = {
          favorite_cuisine: datePlan?.restaurant?.cuisine || null,
          favorite_activity_type: datePlan?.activity?.type || null,
          last_date_location: dateSetup?.location || null,
          dietary_needs: dateSetup?.dietaryNeeds || [],
          budget_preference: dateSetup?.budget || 'medium'
        };
        
        console.log('Updating user preferences:', preferencesUpdate);
        await supabaseApi.saveUserPreferences(preferencesUpdate);
        
        console.log('Date plan saved successfully to database');
      } else {
        // Fallback to localStorage for demo purposes
        console.log('Using localStorage fallback for saving date plan');
        
        // Create a simplified date plan object for localStorage
        const simplifiedPlan = {
          id: 'local-' + Date.now(),
          date: new Date().toLocaleDateString(),
          restaurant: datePlan?.restaurant,
          activity: datePlan?.activity,
          budget: dateSetup?.budget || 'Medium',
          location: dateSetup?.location || 'Local Area',
          notes: `A ${datePlan?.restaurant?.cuisine || 'delicious'} meal at ${datePlan?.restaurant?.name || 'a restaurant'} and ${datePlan?.activity?.name || 'an activity'}.`,
          savedAt: new Date().toISOString()
        };
        
        // Get existing saved plans or initialize empty array
        const existingPlans = JSON.parse(localStorage.getItem('savedDatePlans') || '[]');
        
        // Add the new plan and save back to localStorage (limit to 10 plans to avoid quota issues)
        existingPlans.push(simplifiedPlan);
        if (existingPlans.length > 10) existingPlans.shift(); // Remove oldest plan if more than 10
        
        localStorage.setItem('savedDatePlans', JSON.stringify(existingPlans));
        console.log('Date plan saved successfully to localStorage');
      }
      
      // Show success message
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving date plan to database:', error);
      
      // Show login form if it's an authentication error
      if (error.message.includes('auth') || error.message.includes('login') || error.message.includes('JWT')) {
        console.log('Authentication error, showing login form');
        setShowLoginForm(true);
        setSaveStatus('auth_error');
      } else {
        // Other database error
        setSaveStatus('db_error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CRTEffect intensity="medium" className="min-h-screen bg-retro-black p-4">
      <div className="max-w-4xl mx-auto">
        <RetroHeader title="FINAL DATE PLAN" color="pink" />
        
        {loading ? (
          <div className="retro-card p-8 flex flex-col items-center justify-center min-h-[400px]">
            <LoadingIndicator 
              text="Compiling VHS date plan..." 
              color="green" 
              type="spinner" 
            />
            <p className="font-ibm-plex text-retro-gray mt-4 text-center">
              SYSTEM: Finalizing all elements for optimal romance...
            </p>
          </div>
        ) : (
          <>
            <VHSEffect intensity="medium">
              <div className="retro-card mb-6 relative overflow-hidden border-4 border-neon-blue">
                {/* VHS Tape Design */}
                <div className="absolute top-0 left-0 w-full h-8 bg-retro-black flex items-center px-4">
                  <div className="w-4 h-4 rounded-full bg-neon-pink mr-2 animate-pulse-neon"></div>
                  <div className="w-4 h-4 rounded-full bg-neon-blue mr-2 animate-pulse-neon"></div>
                  <div className="w-4 h-4 rounded-full bg-neon-green animate-pulse-neon"></div>
                  <div className="flex-grow"></div>
                  <p className="font-vt323 text-neon-yellow">REC ●</p>
                </div>
                
                <div className="pt-10 p-6">
                  <div className="text-center mb-6">
                    <h2 className="font-press-start text-neon-blue text-xl mb-2">LOVELINK '89 PRESENTS</h2>
                    <h3 className="font-orbitron text-neon-pink text-2xl neon-text">YOUR PERFECT DATE NIGHT</h3>
                    <p className="font-vt323 text-neon-green text-xl mt-2">
                      {datePlan?.date} • {datePlan?.time || "7:00 PM"}
                    </p>
                  </div>
                  
                  {/* Restaurant Section */}
                  <div className="mb-6 p-4 bg-retro-darkgray">
                    <h3 className="font-press-start text-neon-green text-lg mb-3">01: DINING EXPERIENCE</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <div className="h-32 overflow-hidden">
                          <img 
                            src={datePlan?.restaurant?.image} 
                            alt={datePlan?.restaurant?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="font-vt323 text-neon-blue text-xl">{datePlan?.restaurant?.name}</h4>
                        <p className="font-vt323 text-white">{datePlan?.restaurant?.cuisine} • {datePlan?.restaurant?.rating} ⭐</p>
                        <p className="font-vt323 text-retro-gray">{datePlan?.restaurant?.distance}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {datePlan?.restaurant?.vibe?.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-retro-black text-neon-pink font-vt323 text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity Section */}
                  <div className="mb-6 p-4 bg-retro-darkgray">
                    <h3 className="font-press-start text-neon-green text-lg mb-3">02: ENTERTAINMENT</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <div className="h-32 overflow-hidden">
                          <img 
                            src={datePlan?.activity?.image} 
                            alt={datePlan?.activity?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="font-vt323 text-neon-blue text-xl">{datePlan?.activity?.name}</h4>
                        <p className="font-vt323 text-white">{datePlan?.activity?.type}</p>
                        <p className="font-vt323 text-retro-gray">{datePlan?.activity?.location}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {datePlan?.activity?.tags?.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-retro-black text-neon-blue font-vt323 text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Date Tips Section */}
                  <div className="mb-6 p-4 bg-retro-darkgray">
                    <h3 className="font-press-start text-neon-green text-lg mb-3">03: HELPFUL DATE TIPS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border-l-2 border-neon-pink">
                        <h4 className="font-vt323 text-neon-blue text-lg">CONVERSATION STARTERS</h4>
                        <ul className="font-vt323 text-white list-disc pl-5 mt-2">
                          {conversationStarters[tipSet].map((tip, index) => (
                            <li key={`conv-${index}`}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 border-l-2 border-neon-blue">
                        <h4 className="font-vt323 text-neon-pink text-lg">DINING ETIQUETTE</h4>
                        <ul className="font-vt323 text-white list-disc pl-5 mt-2">
                          {diningEtiquette[tipSet].map((tip, index) => (
                            <li key={`dining-${index}`}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 border-l-2 border-neon-green">
                        <h4 className="font-vt323 text-neon-yellow text-lg">ACTIVITY ADVICE</h4>
                        <ul className="font-vt323 text-white list-disc pl-5 mt-2">
                          {activityAdvice[tipSet].map((tip, index) => (
                            <li key={`activity-${index}`}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 border-l-2 border-neon-yellow">
                        <h4 className="font-vt323 text-neon-green text-lg">ROMANCE BOOSTERS</h4>
                        <ul className="font-vt323 text-white list-disc pl-5 mt-2">
                          {romanceBoosters[tipSet].map((tip, index) => (
                            <li key={`romance-${index}`}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Date Details */}
                  <div className="mb-6 p-4 bg-retro-darkgray">
                    <h3 className="font-press-start text-neon-green text-lg mb-3">DATE DETAILS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-vt323 text-neon-blue">BUDGET RANGE</p>
                        <p className="font-vt323 text-white">{dateSetup?.budget || "Moderate"}</p>
                      </div>
                      <div>
                        <p className="font-vt323 text-neon-blue">TRANSPORTATION</p>
                        <p className="font-vt323 text-white">{dateSetup?.transit?.join(", ") || "Car"}</p>
                      </div>
                      <div>
                        <p className="font-vt323 text-neon-blue">DIETARY NEEDS</p>
                        <p className="font-vt323 text-white">{dateSetup?.dietaryNeeds?.join(", ") || "None specified"}</p>
                      </div>
                      <div>
                        <p className="font-vt323 text-neon-blue">SHARED INTERESTS</p>
                        <p className="font-vt323 text-white">{dateSetup?.hobbies?.join(", ") || "Various activities"}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <RetroButton
                      color="pink"
                      onClick={handleDownload}
                    >
                      DOWNLOAD PLAN
                    </RetroButton>
                    
                    <RetroButton
                      color="blue"
                      onClick={handleSavePlan}
                      disabled={isSaving}
                    >
                      {isSaving ? 'SAVING...' : 'SAVE'}
                    </RetroButton>
                    
                    <Link to="/">
                      <RetroButton color="green">
                        NEW PLAN
                      </RetroButton>
                    </Link>
                  </div>
                  
                  {/* Save Status Message */}
                  {saveStatus && !showLoginForm && (
                    <div className="mt-4 p-4 bg-retro-darkgray text-center">
                      {saveStatus === 'success' ? (
                        <div className="flex items-center justify-center">
                          <span className="font-press-start text-neon-green text-lg mr-2">✓</span>
                          <p className="font-vt323 text-neon-green text-lg">DATE PLAN SAVED!</p>
                        </div>
                      ) : saveStatus === 'db_error' ? (
                        <div className="flex items-center justify-center">
                          <span className="font-press-start text-neon-pink text-lg mr-2">✗</span>
                          <p className="font-vt323 text-neon-pink text-lg">DATABASE ERROR. PLEASE TRY LATER.</p>
                        </div>
                      ) : saveStatus === 'auth_error' ? (
                        <div className="flex items-center justify-center">
                          <span className="font-press-start text-neon-yellow text-lg mr-2">!</span>
                          <p className="font-vt323 text-neon-yellow text-lg">PLEASE LOGIN TO SAVE YOUR DATE PLAN.</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span className="font-press-start text-neon-pink text-lg mr-2">✗</span>
                          <p className="font-vt323 text-neon-pink text-lg">ERROR SAVING DATE PLAN. PLEASE TRY AGAIN.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Quick Login Form */}
                  {showLoginForm && (
                    <div className="mt-4 p-4 bg-retro-darkgray">
                      <h3 className="font-press-start text-neon-blue text-lg mb-4 text-center">QUICK LOGIN</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const email = e.target.email.value;
                        const password = e.target.password.value;
                        
                        try {
                          // Clear any previous errors
                          console.log('Attempting to log in with Supabase');
                          
                          // Login with Supabase directly
                          const { data, error } = await supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                          });
                          
                          if (error) {
                            console.error('Login error:', error);
                            alert('Login failed: ' + (error.message || 'Unknown error'));
                          } else {
                            console.log('Login successful:', data);
                            setShowLoginForm(false);
                            setSaveStatus('success');
                            setTimeout(() => setSaveStatus(null), 3000);
                            
                            // Try saving again
                            handleSavePlan();
                          }
                        } catch (error) {
                          console.error('Login error:', error);
                          alert('Login failed: ' + (error.message || 'Unknown error'));
                        }
                      }}>
                        <div className="mb-3">
                          <label className="block font-vt323 text-neon-pink mb-1">EMAIL:</label>
                          <input 
                            type="email" 
                            name="email"
                            className="w-full bg-black border-2 border-neon-pink text-white font-vt323 p-2"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block font-vt323 text-neon-pink mb-1">PASSWORD:</label>
                          <input 
                            type="password" 
                            name="password"
                            className="w-full bg-black border-2 border-neon-pink text-white font-vt323 p-2"
                            placeholder="********"
                            autoComplete="current-password"
                            required
                          />
                        </div>
                        <div className="flex justify-between mt-4">
                          <button 
                            type="submit" 
                            className="bg-neon-blue text-black font-press-start py-2 px-4 hover:bg-neon-pink"
                          >
                            LOGIN
                          </button>
                          <button 
                            type="button" 
                            className="bg-retro-darkgray text-neon-pink font-press-start py-2 px-4 border-2 border-neon-pink hover:bg-black"
                            onClick={() => {
                              setShowLoginForm(false);
                              setSaveStatus(null);
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </VHSEffect>
            
            <div className="text-center mb-8">
              <p className="font-vt323 text-retro-gray">
                SYSTEM: Date plan successfully compiled! Ready for an unforgettable night.
              </p>
            </div>
          </>
        )}
      </div>
      
      <RetroFooter />
    </CRTEffect>
  );
};

export default FinalPlanPanel;
