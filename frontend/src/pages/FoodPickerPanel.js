import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import RetroHeader from '../components/RetroHeader';
import RetroButton from '../components/RetroButton';
import LoadingIndicator from '../components/LoadingIndicator';
import RetroFooter from '../components/RetroFooter';
import VHSEffect from '../components/VHSEffect';
import api from '../services/api';
import { useSound } from '../context/SoundContext';
import DashboardHeader from '../components/DashboardHeader';

const FoodPickerPanel = () => {
  const navigate = useNavigate();
  const { dateSetup, selectRestaurant } = useDatePlan();
  const { playSound } = useSound();
  const [loading, setLoading] = useState(true);
  const [selectedRestaurantState, setSelectedRestaurantState] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurants based on the date setup preferences
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        playSound('findingSpots');
        
        // Get stored API result from date setup if available
        const dateApiResult = JSON.parse(localStorage.getItem('dateApiResult') || '{}');
        
        if (dateApiResult && dateApiResult.restaurants && dateApiResult.restaurants.length > 0) {
          // Use restaurants from the API result
          console.log('Using restaurants from API result:', dateApiResult.restaurants);
          setRestaurants(dateApiResult.restaurants);
        } else {
          // Generate restaurants using the API
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
          console.log('API result for restaurants:', result);
          
          if (result && result.restaurants && result.restaurants.length > 0) {
            setRestaurants(result.restaurants);
            // Save the result for other panels to use
            localStorage.setItem('dateApiResult', JSON.stringify(result));
          } else {
            // Fallback to mock data if API doesn't return restaurants
            const mockRestaurants = [
              {
                id: 1,
                name: "Neon Noodle House",
                image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
                cuisine: "Asian Fusion",
                rating: 4.7,
                distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
                vibe: ["Late Night Bites", "Cyberpunk Vibes"],
                dietary_friendly: "Vegetarian, Gluten-free",
                things_to_order: "Signature Ramen, Dumplings",
                price_level: 2,
                budget_range: "$15-$25"
              },
              {
                id: 2,
                name: "Pixel Pizza Parlor",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
                cuisine: "Italian",
                rating: 4.5,
                distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
                vibe: ["Retro Gaming", "Family Friendly"],
                dietary_friendly: "Gluten-free, Vegan",
                things_to_order: "Classic Cheese, Meat Lover's",
                price_level: 1,
                budget_range: "$10-$20"
              }
            ];
            
            setRestaurants(mockRestaurants);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        
        // Fallback to mock data with location customization
        const mockRestaurants = [
          {
            id: 1,
            name: "Neon Noodle House",
            image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
            cuisine: "Asian Fusion",
            rating: 4.7,
            distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
            vibe: ["Late Night Bites", "Cyberpunk Vibes"],
            dietary_friendly: "Vegetarian, Gluten-free",
            things_to_order: "Signature Ramen, Dumplings",
            price_level: 2,
            budget_range: "$15-$25"
          },
          {
            id: 2,
            name: "Pixel Pizza Parlor",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
            cuisine: "Italian",
            rating: 4.5,
            distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
            vibe: ["Retro Gaming", "Family Friendly"],
            dietary_friendly: "Gluten-free, Vegan",
            things_to_order: "Classic Cheese, Meat Lover's",
            price_level: 1,
            budget_range: "$10-$20"
          }
        ];
        
        setRestaurants(mockRestaurants);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [dateSetup, playSound]);

  const handleSelectRestaurant = (restaurant) => {
    playSound('success');
    setSelectedRestaurantState(restaurant);
    selectRestaurant(restaurant);
    
    // Show loading effect before navigating
    setLoading(true);
    setTimeout(() => {
      navigate('/final-plan');
    }, 1000);
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
        exclude_ids: restaurants.map(r => r.id) // Exclude already shown restaurants
      };
      
      // Call the backend API
      const result = await api.datePlanning.generateDatePlan(preferences);
      
      if (result && result.restaurants && result.restaurants.length > 0) {
        setRestaurants(result.restaurants);
      } else {
        // Fallback to different mock data
        const moreRestaurants = [
          {
            id: 3,
            name: "Synthwave Sushi",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
            cuisine: "Japanese",
            rating: 4.8,
            distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
            vibe: ["Upscale", "Intimate"],
            dietary_friendly: "Vegetarian, Gluten-free",
            things_to_order: "Sushi Rolls, Ramen",
            price_level: 3,
            budget_range: "$25-$40"
          },
          {
            id: 4,
            name: "Retro Diner",
            image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
            cuisine: "American",
            rating: 4.3,
            distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
            vibe: ["Nostalgic", "Casual"],
            dietary_friendly: "Gluten-free, Vegan",
            things_to_order: "Burgers, Milkshakes",
            price_level: 2,
            budget_range: "$15-$30"
          }
        ];
        
        setRestaurants(moreRestaurants);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more restaurants:", error);
      
      // Fallback to different mock data with location customization
      const moreRestaurants = [
        {
          id: 3,
          name: "Synthwave Sushi",
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
          cuisine: "Japanese",
          rating: 4.8,
          distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
          vibe: ["Upscale", "Intimate"],
          dietary_friendly: "Vegetarian, Gluten-free",
          things_to_order: "Sushi Rolls, Ramen",
          price_level: 3,
          budget_range: "$25-$40"
        },
        {
          id: 4,
          name: "Retro Diner",
          image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
          cuisine: "American",
          rating: 4.3,
          distance: `${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)} miles from ${dateSetup.location || 'your location'}`,
          vibe: ["Nostalgic", "Casual"],
          dietary_friendly: "Gluten-free, Vegan",
          things_to_order: "Burgers, Milkshakes",
          price_level: 2,
          budget_range: "$15-$30"
        }
      ];
      
      setRestaurants(moreRestaurants);
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
                text="Scanning local restaurant database..." 
                color="green" 
                type="dots" 
              />
              <p className="font-ibm-plex text-retro-gray mt-4 text-center">
                SYSTEM: Analyzing compatibility with your preferences...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {restaurants.map(restaurant => (
                  <div 
                    key={restaurant.id} 
                    className={`retro-card overflow-hidden transition-all duration-300 hover:border-neon-pink ${
                      selectedRestaurantState?.id === restaurant.id ? 'border-neon-pink border-4' : ''
                    }`}
                  >
                    <VHSEffect intensity="light" className="h-48 overflow-hidden relative">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-neon-pink text-white font-vt323 px-2 py-1 z-20">
                        {restaurant.rating} 
                      </div>
                    </VHSEffect>
                    
                    <div className="p-4">
                      <h3 className="font-press-start text-neon-blue text-lg mb-2">{restaurant.name}</h3>
                      <div className="flex justify-between mb-2">
                        <span className="font-vt323 text-white">{restaurant.cuisine}</span>
                        <span className="font-vt323 text-retro-gray">{restaurant.distance}</span>
                      </div>
                      
                      {/* Additional restaurant details from Google Maps API */}
                      <div className="mb-3 border-t border-retro-darkgray pt-2">
                        {restaurant.dietary_friendly && (
                          <div className="flex mb-1">
                            <span className="font-vt323 text-neon-pink w-1/3">DIETARY:</span>
                            <span className="font-vt323 text-white w-2/3">{restaurant.dietary_friendly}</span>
                          </div>
                        )}
                        
                        {restaurant.things_to_order && (
                          <div className="flex mb-1">
                            <span className="font-vt323 text-neon-pink w-1/3">TRY:</span>
                            <span className="font-vt323 text-white w-2/3">{restaurant.things_to_order}</span>
                          </div>
                        )}
                        
                        <div className="flex mb-1">
                          <span className="font-vt323 text-neon-pink w-1/3">PRICE:</span>
                          <span className="font-vt323 text-white w-2/3">
                            {restaurant.budget_range || (restaurant.price_level ? '$'.repeat(restaurant.price_level) : '$$')}
                          </span>
                        </div>
                        
                        <div className="flex mb-1">
                          <span className="font-vt323 text-neon-pink w-1/3">RATING:</span>
                          <span className="font-vt323 text-white w-2/3">
                            {restaurant.rating} 
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.vibe && restaurant.vibe.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-retro-darkgray text-neon-green font-vt323 px-2 py-1 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <RetroButton
                        onClick={() => handleSelectRestaurant(restaurant)}
                        color="green"
                        className="w-full py-2 text-sm"
                      >
                        LOCK THIS IN
                      </RetroButton>
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
                  Tip: Choose the restaurant that best matches your date vibe!
                </p>
              </div>
            </>
          )}
          
          <RetroFooter showBackButton={true} backTo="/date-setup" />
        </div>
      </div>
    </div>
  );
};

export default FoodPickerPanel;
