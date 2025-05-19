import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import { useSound } from '../context/SoundContext';
import RetroHeartBackground from '../components/RetroHeartBackground';
import RetroButton from '../components/RetroButton';
import TypewriterText from '../components/TypewriterText';
import RetroFooter from '../components/RetroFooter';
import RetroCursor from '../components/RetroCursor';
import VHSEffect from '../components/VHSEffect';
import CRTEffect from '../components/CRTEffect';
import PixelIcon from '../components/PixelIcon';
import DashboardHeader from '../components/DashboardHeader';
import supabaseApi from '../services/supabaseApi';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { resetPlan } = useDatePlan();
  const { playSound } = useSound();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dashboard data
  const [userData, setUserData] = useState({
    username: '',
    partnerName: '',
    dateStats: {
      totalDates: 0,
      favoriteActivity: '',
      favoriteFood: '',
      upcomingDates: 0,
      lastDate: null
    },
    partnerInfo: {
      birthday: null,
      anniversary: null,
      hobbies: [],
      favoriteFood: '',
      favoriteMovie: ''
    },
    upcomingDate: null,
    pastDates: []
  });
  
  // Fade-in animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // First try to load from localStorage as a quick fix
        const localProfileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        if (localProfileData && localProfileData.lover1 && localProfileData.lover2) {
          console.log("Using profile data from localStorage:", localProfileData);
          
          // Format the data for the dashboard
          setUserData({
            username: localProfileData.lover1.name || 'LOVER_1',
            partnerName: localProfileData.lover2.name || 'LOVER_2',
            dateStats: {
              totalDates: 0,
              favoriteActivity: 'None yet',
              favoriteFood: 'None yet',
              upcomingDates: 0,
              lastDate: null
            },
            partnerInfo: {
              birthday: localProfileData.lover2.birthday || '',
              anniversary: localProfileData.lover2.anniversary || '',
              hobbies: localProfileData.lover2.hobbies || [],
              favoriteFood: localProfileData.lover2.favoriteFood || '',
              favoriteMovie: localProfileData.lover2.favoriteMovie || ''
            },
            upcomingDate: null,
            pastDates: []
          });
          
          setIsLoading(false);
          
          // Continue with Supabase fetch in the background
        }
        
        // Get current user
        const { data: userData } = await supabaseApi.getCurrentUser();
        console.log("Current user data:", userData);
        
        if (!userData || !userData.user) {
          console.log("No user logged in, using localStorage only");
          setIsLoading(false);
          return;
        }
        
        // Get user profile
        const { data: userProfileData } = await supabaseApi.getUserProfile();
        console.log("User profile data:", userProfileData);
        
        // Get partner profile and relationship data
        const { data: relationshipData } = await supabaseApi.getPartnerProfile();
        console.log("Full relationship data:", relationshipData);
        
        // Extract partner data from relationship
        const partnerData = relationshipData?.partner || {};
        console.log("Extracted partner data:", partnerData);
        
        // Get date plans
        const { data: datePlans } = await supabaseApi.getDatePlans();
        
        // Update state with fetched data
        updateUserData(userProfileData, partnerData, relationshipData, datePlans);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Try to load from localStorage as fallback
        const localProfileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        
        if (localProfileData && localProfileData.lover1 && localProfileData.lover2) {
          // Format the data for the dashboard
          setUserData({
            username: localProfileData.lover1.name || 'LOVER_1',
            partnerName: localProfileData.lover2.name || 'LOVER_2',
            dateStats: {
              totalDates: 0,
              favoriteActivity: 'None yet',
              favoriteFood: 'None yet',
              upcomingDates: 0,
              lastDate: null
            },
            partnerInfo: {
              birthday: localProfileData.lover2.birthday || '',
              anniversary: localProfileData.lover2.anniversary || '',
              hobbies: localProfileData.lover2.hobbies || [],
              favoriteFood: localProfileData.lover2.favoriteFood || '',
              favoriteMovie: localProfileData.lover2.favoriteMovie || ''
            },
            upcomingDate: null,
            pastDates: []
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Update user data from Supabase results
  const updateUserData = (userProfileData, partnerData, relationshipData, datePlans) => {
    console.log("Profile data:", userProfileData);
    console.log("Partner data:", partnerData);
    console.log("Relationship data:", relationshipData);
    
    // Process date plans to get stats
    const upcomingDates = datePlans?.filter(plan => new Date(plan.scheduled_for) > new Date()) || [];
    const pastDates = datePlans?.filter(plan => new Date(plan.scheduled_for) <= new Date()) || [];
    
    // Find favorite activity and restaurant
    const activityCounts = {};
    const restaurantCounts = {};
    
    pastDates.forEach(date => {
      if (date.activity_name) {
        activityCounts[date.activity_name] = (activityCounts[date.activity_name] || 0) + 1;
      }
      if (date.restaurant_name) {
        restaurantCounts[date.restaurant_name] = (restaurantCounts[date.restaurant_name] || 0) + 1;
      }
    });
    
    const favoriteActivity = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet';
    const favoriteFood = Object.entries(restaurantCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet';
    
    // Format upcoming date
    const nextDate = upcomingDates[0];
    const upcomingDate = nextDate ? {
      id: nextDate.date_plan_id,
      date: nextDate.scheduled_for,
      activity: nextDate.activity_name || 'TBD',
      food: nextDate.restaurant_name || 'TBD',
      time: nextDate.scheduled_time || '7:00 PM',
      location: nextDate.location || 'TBD'
    } : null;
    
    // Format past dates
    const formattedPastDates = pastDates.map(date => ({
      id: date.date_plan_id,
      date: date.scheduled_for,
      activity: date.activity_name || 'Unknown',
      food: date.restaurant_name || 'Unknown',
      rating: date.rating || 5
    }));
    
    // Update state with the correctly accessed data
    setUserData({
      username: userProfileData?.name || 'LOVER_1',
      partnerName: partnerData?.name || 'LOVER_2',
      dateStats: {
        totalDates: (pastDates?.length || 0),
        favoriteActivity,
        favoriteFood,
        upcomingDates: upcomingDates?.length || 0,
        lastDate: pastDates[0]?.scheduled_for || null
      },
      partnerInfo: {
        birthday: partnerData?.birth_date || '',
        anniversary: relationshipData?.anniversary || '',
        hobbies: partnerData?.hobbies?.map(h => h.hobby_name) || [],
        favoriteFood: partnerData?.favorite_food || '',
        favoriteMovie: partnerData?.favorite_movie || ''
      },
      upcomingDate,
      pastDates: formattedPastDates
    });
  };
  
  // Update user data from localStorage
  const updateUserDataFromLocal = (userProfile, partnerProfile) => {
    // Get date plans from localStorage
    const localDatePlans = JSON.parse(localStorage.getItem('datePlans') || '[]');
    
    setUserData({
      username: userProfile.name || 'LOVER_1',
      partnerName: partnerProfile.name || 'LOVER_2',
      dateStats: {
        totalDates: localDatePlans.length || 0,
        favoriteActivity: 'None yet',
        favoriteFood: 'None yet',
        upcomingDates: 0,
        lastDate: null
      },
      partnerInfo: {
        birthday: partnerProfile.birthday || partnerProfile.birth_date || null,
        anniversary: partnerProfile.anniversary || null,
        hobbies: partnerProfile.hobbies || [],
        favoriteFood: partnerProfile.favoriteFood || partnerProfile.favorite_food || '',
        favoriteMovie: partnerProfile.favoriteMovie || partnerProfile.favorite_movie || ''
      },
      upcomingDate: null,
      pastDates: []
    });
  };
  
  const handleTabChange = (tab) => {
    playSound('click');
    setActiveTab(tab);
  };
  
  const handlePlanNewDate = () => {
    playSound('click');
    resetPlan();
    navigate('/date-setup');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Calculate days until a specific date
  const calculateDaysUntil = (dateString) => {
    if (!dateString) return '?';
    
    try {
      const targetDate = new Date(dateString);
      const currentDate = new Date();
      const timeDiff = targetDate - currentDate;
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff < 0) {
        // If the date has passed this year, calculate for next year
        targetDate.setFullYear(currentDate.getFullYear() + 1);
        const newTimeDiff = targetDate - currentDate;
        return Math.ceil(newTimeDiff / (1000 * 3600 * 24));
      }
      
      return daysDiff;
    } catch (error) {
      console.error('Error calculating days until:', error);
      return '?';
    }
  };
  
  const renderDashboardTab = () => (
    <div className="space-y-6">
      <div className="retro-card p-4 border-2 border-neon-pink">
        <h2 className="font-press-start text-neon-pink text-xl mb-4">DATE STATS</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-item">
            <p className="font-vt323 text-neon-blue text-lg">TOTAL DATES</p>
            <p className="font-press-start text-neon-green text-2xl">{userData.dateStats.totalDates}</p>
          </div>
          <div className="stat-item">
            <p className="font-vt323 text-neon-blue text-lg">UPCOMING DATES</p>
            <p className="font-press-start text-neon-green text-2xl">{userData.dateStats.upcomingDates}</p>
          </div>
          <div className="stat-item">
            <p className="font-vt323 text-neon-blue text-lg">FAVORITE ACTIVITY</p>
            <p className="font-vt323 text-neon-green text-xl">{userData.dateStats.favoriteActivity}</p>
          </div>
          <div className="stat-item">
            <p className="font-vt323 text-neon-blue text-lg">FAVORITE RESTAURANT</p>
            <p className="font-vt323 text-neon-green text-xl">{userData.dateStats.favoriteFood}</p>
          </div>
        </div>
      </div>
      
      {userData.upcomingDate && (
        <div className="retro-card p-4 border-2 border-neon-pink bg-retro-darkgray animate-pulse-slow">
          <h2 className="font-press-start text-neon-pink text-xl mb-4">UPCOMING DATE</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-vt323 text-neon-yellow text-lg">{formatDate(userData.upcomingDate.date)} • {userData.upcomingDate.time}</p>
              <div className="bg-retro-black p-2 border border-neon-pink">
                <p className="font-press-start text-neon-pink text-md">
                  {calculateDaysUntil(userData.upcomingDate.date)} DAYS
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-vt323 text-neon-blue text-sm">ACTIVITY</p>
                <p className="font-vt323 text-neon-green">{userData.upcomingDate.activity}</p>
              </div>
              <div>
                <p className="font-vt323 text-neon-blue text-sm">FOOD</p>
                <p className="font-vt323 text-neon-green">{userData.upcomingDate.food}</p>
              </div>
              <div className="col-span-2">
                <p className="font-vt323 text-neon-blue text-sm">LOCATION</p>
                <p className="font-vt323 text-neon-green">{userData.upcomingDate.location}</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <RetroButton
              color="blue"
              size="medium"
              className="text-lg"
              onClick={() => navigate('/final-plan', { state: { date: userData.upcomingDate } })}
            >
              VIEW DATE DETAILS
            </RetroButton>
          </div>
        </div>
      )}
      
      <div className="retro-card p-4 border-2 border-neon-blue">
        <h2 className="font-press-start text-neon-blue text-xl mb-4">IMPORTANT DATES</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-vt323 text-neon-pink text-lg">{userData.partnerName}'S BIRTHDAY</p>
              <p className="font-vt323 text-neon-green text-md">{formatDate(userData.partnerInfo.birthday)}</p>
            </div>
            <div className="bg-retro-black p-2 border border-neon-pink">
              <p className="font-press-start text-neon-pink text-lg">
                {userData.partnerInfo.birthday ? 
                  calculateDaysUntil(userData.partnerInfo.birthday.replace(/\d{4}/, new Date().getFullYear())) : '?'} DAYS
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-vt323 text-neon-pink text-lg">ANNIVERSARY</p>
              <p className="font-vt323 text-neon-green text-md">{formatDate(userData.partnerInfo.anniversary)}</p>
            </div>
            <div className="bg-retro-black p-2 border border-neon-pink">
              <p className="font-press-start text-neon-pink text-lg">
                {userData.partnerInfo.anniversary ? 
                  calculateDaysUntil(userData.partnerInfo.anniversary.replace(/\d{4}/, new Date().getFullYear())) : '?'} DAYS
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="retro-card p-4 border-2 border-neon-pink animate-pulse-slow">
        <h2 className="font-press-start text-neon-pink text-xl mb-4">LOCAL SPECIAL EVENTS</h2>
        <p className="font-vt323 text-neon-green text-lg mb-3">
          5 EXCITING EVENTS HAPPENING NEAR YOU!
        </p>
        <div className="text-center">
          <RetroButton
            color="blue"
            size="medium"
            className="text-lg"
            onClick={() => navigate('/local-events')}
          >
            EXPLORE EVENTS
          </RetroButton>
        </div>
      </div>
      
      <div className="text-center">
        <RetroButton
          color="pink"
          size="large"
          className="text-lg px-8 py-3"
          onClick={handlePlanNewDate}
        >
          PLAN A NEW DATE
        </RetroButton>
      </div>
    </div>
  );
  
  const renderPartnerTab = () => (
    <div className="space-y-6">
      <div className="retro-card p-4 border-2 border-neon-pink">
        <h2 className="font-press-start text-neon-pink text-xl mb-4">{userData.partnerName}'S PROFILE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-vt323 text-neon-blue text-lg">BIRTHDAY</p>
            <p className="font-vt323 text-neon-green text-xl">{formatDate(userData.partnerInfo.birthday)}</p>
          </div>
          
          <div>
            <p className="font-vt323 text-neon-blue text-lg">ANNIVERSARY</p>
            <p className="font-vt323 text-neon-green text-xl">{formatDate(userData.partnerInfo.anniversary)}</p>
          </div>
          
          <div>
            <p className="font-vt323 text-neon-blue text-lg">FAVORITE FOOD</p>
            <p className="font-vt323 text-neon-green text-xl">{userData.partnerInfo.favoriteFood}</p>
          </div>
          
          <div>
            <p className="font-vt323 text-neon-blue text-lg">FAVORITE MOVIE</p>
            <p className="font-vt323 text-neon-green text-xl">{userData.partnerInfo.favoriteMovie}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="font-vt323 text-neon-blue text-lg">HOBBIES</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {userData.partnerInfo.hobbies.map((hobby, index) => (
              <div key={index} className="bg-retro-black border border-neon-green px-3 py-1">
                <p className="font-vt323 text-neon-green">{hobby}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="retro-card p-4 border-2 border-neon-blue">
        <h2 className="font-press-start text-neon-blue text-xl mb-4">GIFT IDEAS</h2>
        <ul className="space-y-2">
          <li className="font-vt323 text-neon-green text-lg">• Vintage arcade machine</li>
          <li className="font-vt323 text-neon-green text-lg">• Limited edition synthwave vinyl</li>
          <li className="font-vt323 text-neon-green text-lg">• Custom roller skates</li>
          <li className="font-vt323 text-neon-green text-lg">• Blade Runner collector's edition</li>
        </ul>
      </div>
      
      <div className="text-center">
        <RetroButton
          color="blue"
          size="large"
          className="text-lg"
          onClick={() => {}}
          onMouseEnter={() => playSound('hover')}
        >
          EDIT PARTNER INFO
        </RetroButton>
      </div>
    </div>
  );
  
  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="retro-card p-4 border-2 border-neon-pink">
        <h2 className="font-press-start text-neon-pink text-xl mb-4">DATE HISTORY</h2>
        
        <div className="space-y-4">
          {userData.pastDates.map(date => (
            <div key={date.id} className="border-2 border-neon-blue p-3 bg-retro-darkgray">
              <div className="flex justify-between items-center mb-2">
                <p className="font-vt323 text-neon-yellow text-lg">{formatDate(date.date)}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < date.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-vt323 text-neon-blue text-sm">ACTIVITY</p>
                  <p className="font-vt323 text-neon-green">{date.activity}</p>
                </div>
                <div>
                  <p className="font-vt323 text-neon-blue text-sm">FOOD</p>
                  <p className="font-vt323 text-neon-green">{date.food}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <RetroButton
          color="pink"
          size="large"
          className="text-lg px-8 py-3"
          onClick={handlePlanNewDate}
        >
          PLAN A NEW DATE
        </RetroButton>
      </div>
    </div>
  );
  
  return (
    <CRTEffect intensity="medium" className="min-h-screen bg-retro-black">
      <div className="flex flex-col min-h-screen">
        <DashboardHeader userData={userData} handlePlanNewDate={handlePlanNewDate} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <VHSEffect intensity="light">
            <div className="max-w-4xl mx-auto">
              {/* Tab navigation */}
              <div className="flex mb-6 border-b-2 border-neon-blue">
                <button
                  type="button"
                  className={`flex-1 py-3 font-vt323 text-lg ${
                    activeTab === 'dashboard' 
                      ? 'text-neon-pink border-b-2 border-neon-pink' 
                      : 'text-neon-blue hover:text-neon-pink'
                  }`}
                  onClick={() => handleTabChange('dashboard')}
                >
                  DASHBOARD
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 font-vt323 text-lg ${
                    activeTab === 'partner' 
                      ? 'text-neon-pink border-b-2 border-neon-pink' 
                      : 'text-neon-blue hover:text-neon-pink'
                  }`}
                  onClick={() => handleTabChange('partner')}
                >
                  PARTNER INFO
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 font-vt323 text-lg ${
                    activeTab === 'history' 
                      ? 'text-neon-pink border-b-2 border-neon-pink' 
                      : 'text-neon-blue hover:text-neon-pink'
                  }`}
                  onClick={() => handleTabChange('history')}
                >
                  DATE HISTORY
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 font-vt323 text-lg ${
                    activeTab === 'events' 
                      ? 'text-neon-pink border-b-2 border-neon-pink' 
                      : 'text-neon-blue hover:text-neon-pink'
                  }`}
                  onClick={() => navigate('/local-events')}
                >
                  LOCAL EVENTS
                </button>
              </div>
              
              {/* Tab content */}
              <div className="tab-content">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-neon-pink font-press-start animate-pulse text-xl">LOADING...</div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'dashboard' && renderDashboardTab()}
                    {activeTab === 'partner' && renderPartnerTab()}
                    {activeTab === 'history' && renderHistoryTab()}
                  </>
                )}
              </div>
            </div>
          </VHSEffect>
        </main>
        
        <RetroFooter />
      </div>
      
      <RetroCursor color="pink" size="medium" pulseEffect={true} />
    </CRTEffect>
  );
};

export default DashboardPage;
