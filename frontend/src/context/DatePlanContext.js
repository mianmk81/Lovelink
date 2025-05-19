import React, { createContext, useContext, useState, useEffect } from 'react';
import supabaseApi from '../services/supabaseApi';
import supabase from '../services/supabaseClient';

// Create the context
const DatePlanContext = createContext();

// Custom hook to use the context
export const useDatePlan = () => useContext(DatePlanContext);

// Provider component
export const DatePlanProvider = ({ children }) => {
  // State for the date plan
  const [dateSetup, setDateSetup] = useState({
    location: '',
    mood: '',
    budget: 2,
    dietaryNeeds: [],
    transit: []
  });
  
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [surprise, setSurprise] = useState(null);
  const [finalPlan, setFinalPlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to update date setup
  const updateDateSetup = async (newSetup) => {
    const updatedSetup = { ...dateSetup, ...newSetup };
    setDateSetup(updatedSetup);
    
    try {
      // Save to database
      await supabaseApi.saveUserPreferences({
        location_preference: updatedSetup.location,
        mood_preference: updatedSetup.mood,
        budget_preference: updatedSetup.budget,
        dietary_needs: updatedSetup.dietaryNeeds,
        transit_options: updatedSetup.transit
      });
      console.log('Date setup saved to database');
    } catch (error) {
      console.error('Error saving date setup to database:', error);
      // Fallback to localStorage if database save fails
      localStorage.setItem('dateSetup', JSON.stringify(updatedSetup));
    }
    
    return updatedSetup;
  };
  
  // Function to select restaurant
  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    
    try {
      // Save restaurant preference to database
      if (restaurant) {
        await supabaseApi.saveUserPreferences({
          favorite_cuisine: restaurant.cuisine,
          last_restaurant_choice: restaurant.name
        });
        console.log('Restaurant preference saved to database');
      }
    } catch (error) {
      console.error('Error saving restaurant preference to database:', error);
      // Fallback to localStorage if database save fails
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    }
    
    return restaurant;
  };
  
  // Function to select activity
  const selectActivity = async (activity) => {
    setSelectedActivity(activity);
    
    try {
      // Save activity preference to database
      if (activity) {
        await supabaseApi.saveUserPreferences({
          favorite_activity_type: activity.type,
          last_activity_choice: activity.name
        });
        console.log('Activity preference saved to database');
      }
    } catch (error) {
      console.error('Error saving activity preference to database:', error);
      // Fallback to localStorage if database save fails
      localStorage.setItem('selectedActivity', JSON.stringify(activity));
    }
    
    return activity;
  };
  
  // Function to set surprise
  const setSurpriseItem = (surpriseItem) => {
    setSurprise(surpriseItem);
    localStorage.setItem('surprise', JSON.stringify(surpriseItem));
    return surpriseItem;
  };
  
  // Function to compile final plan
  const compileFinalPlan = async () => {
    setIsLoading(true);
    
    try {
      const plan = {
        dateSetup,
        restaurant: selectedRestaurant,
        activity: selectedActivity,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        id: `plan-${Date.now()}`
      };
      
      setFinalPlan(plan);
      
      // Add to history in memory
      const updatedHistory = [...planHistory, plan];
      setPlanHistory(updatedHistory);
      
      // We don't save the plan to the database here
      // That will be done in the FinalPlanPanel when the user clicks Save
      
      // Fallback to localStorage
      localStorage.setItem('finalPlan', JSON.stringify(plan));
      
      setIsLoading(false);
      return plan;
    } catch (error) {
      console.error('Error compiling final plan:', error);
      setIsLoading(false);
      throw error;
    }
  };
  
  // Function to reset current plan
  const resetPlan = async () => {
    // Reset local state in a single batch to prevent multiple re-renders
    setDateSetup({
      location: '',
      mood: '',
      budget: 2,
      dietaryNeeds: [],
      transit: []
    });
    setSelectedRestaurant(null);
    setSelectedActivity(null);
    setSurprise(null);
    setFinalPlan(null);
    
    // Clear localStorage
    localStorage.removeItem('dateSetup');
    localStorage.removeItem('selectedRestaurant');
    localStorage.removeItem('selectedActivity');
    localStorage.removeItem('finalPlan');
    
    // Move database operations to a separate function to avoid state updates during effect cleanup
    if (process.env.NODE_ENV === 'production') {
      // Use setTimeout to break the render cycle and prevent loop
      setTimeout(async () => {
        try {
          // Try to reset user preferences in database if authenticated
          const { data } = await supabase.auth.getUser();
          const user = data?.user;
          
          if (user) {
            await supabaseApi.saveUserPreferences({
              current_plan_id: null,
              planning_state: 'reset'
            });
            console.log('Plan reset in database');
          } else {
            console.log('User not authenticated, using localStorage only');
          }
        } catch (error) {
          console.log('Using localStorage fallback for plan reset');
          // Already cleared localStorage above
        }
      }, 0);
    } else {
      console.log('Development mode: skipping database operations');
    }
  };
  
  // Function to clear all data including history
  const clearAllData = () => {
    resetPlan();
    setPlanHistory([]);
    localStorage.removeItem('planHistory');
  };
  
  // Function to get a plan from history
  const getPlanFromHistory = (planId) => {
    return planHistory.find(plan => plan.id === planId);
  };
  
  // Function to load a plan from history
  const loadPlanFromHistory = (planId) => {
    const plan = getPlanFromHistory(planId);
    if (plan) {
      setDateSetup(plan.dateSetup);
      setSelectedRestaurant(plan.restaurant);
      setSelectedActivity(plan.activity);
      setSurprise(plan.surprise);
      setFinalPlan(plan);
      
      // Update localStorage
      localStorage.setItem('dateSetup', JSON.stringify(plan.dateSetup));
      localStorage.setItem('selectedRestaurant', JSON.stringify(plan.restaurant));
      localStorage.setItem('selectedActivity', JSON.stringify(plan.activity));
      localStorage.setItem('surprise', JSON.stringify(plan.surprise));
      localStorage.setItem('finalPlan', JSON.stringify(plan));
      
      return plan;
    }
    return null;
  };
  
  // Load data from database on initial render
  useEffect(() => {
    // First load from localStorage as a reliable fallback
    const loadFromLocalStorage = () => {
      try {
        const loadedDateSetup = localStorage.getItem('dateSetup');
        const loadedRestaurant = localStorage.getItem('selectedRestaurant');
        const loadedActivity = localStorage.getItem('selectedActivity');
        const loadedSurprise = localStorage.getItem('surprise');
        const loadedFinalPlan = localStorage.getItem('finalPlan');
        const loadedHistory = localStorage.getItem('planHistory');
        
        if (loadedDateSetup) setDateSetup(JSON.parse(loadedDateSetup));
        if (loadedRestaurant) setSelectedRestaurant(JSON.parse(loadedRestaurant));
        if (loadedActivity) setSelectedActivity(JSON.parse(loadedActivity));
        if (loadedSurprise) setSurprise(JSON.parse(loadedSurprise));
        if (loadedFinalPlan) setFinalPlan(JSON.parse(loadedFinalPlan));
        if (loadedHistory) setPlanHistory(JSON.parse(loadedHistory));
      } catch (error) {
        console.log('Error loading from localStorage:', error);
      }
    };
    
    // Then try to load from database if user is authenticated
    const loadFromDatabase = async () => {
      try {
        // Wait for auth to be ready
        const { data: { session } } = await supabase.auth.getSession();
        
        // Only proceed if we have a valid session
        if (session?.user) {
          // Try to load from database
          const { data: preferences } = await supabaseApi.getUserPreferences();
          
          if (preferences) {
            // Set date setup from preferences
            setDateSetup({
              location: preferences.location_preference || '',
              mood: preferences.mood_preference || '',
              budget: preferences.budget_preference || 2,
              dietaryNeeds: preferences.dietary_needs || [],
              transit: preferences.transit_options || []
            });
            
            // Load date plans from database
            const { data: plans } = await supabaseApi.getDatePlans();
            if (plans && plans.length > 0) {
              setPlanHistory(plans);
              
              // If there's a current plan, load it
              if (preferences.current_plan_id) {
                const currentPlan = plans.find(plan => plan.id === preferences.current_plan_id);
                if (currentPlan) {
                  setFinalPlan(currentPlan);
                }
              }
            }
          }
        } else {
          console.log('No authenticated session found, using localStorage only');
        }
      } catch (dbError) {
        console.log('Error loading from database:', dbError);
        // Already loaded from localStorage as fallback
      }
    };
    
    // Always load from localStorage first for immediate data
    loadFromLocalStorage();
    
    // Then try to load from database if possible
    if (process.env.NODE_ENV === 'production') {
      loadFromDatabase();
    } else {
      console.log('Development mode: skipping database operations');
    }
  }, []);
  
  // Value object to be provided to consumers
  const value = {
    dateSetup,
    selectedRestaurant,
    selectedActivity,
    surprise,
    finalPlan,
    planHistory,
    isLoading,
    updateDateSetup,
    selectRestaurant,
    selectActivity,
    setSurpriseItem,
    compileFinalPlan,
    resetPlan,
    clearAllData,
    getPlanFromHistory,
    loadPlanFromHistory,
    setIsLoading
  };
  
  return (
    <DatePlanContext.Provider value={value}>
      {children}
    </DatePlanContext.Provider>
  );
};

export default DatePlanContext;
