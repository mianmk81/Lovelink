import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import { useSound } from '../context/SoundContext';
import api from '../services/api';
import RetroButton from '../components/RetroButton';
import VHSEffect from '../components/VHSEffect';
import RetroFooter from '../components/RetroFooter';
import RetroCursor from '../components/RetroCursor';
import RetroHeartBackground from '../components/RetroHeartBackground';
import RetroAuthForm from '../components/RetroAuthForm';
import LoadingAnimation from '../components/LoadingAnimation';

const LandingPage = () => {
  const navigate = useNavigate();
  const { resetPlan } = useDatePlan();
  const { playSound } = useSound();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const fullText = "Welcome to LoveLink '89 — Your Retro AI Date Concierge";
  
  // Use useCallback and a ref to ensure resetPlan only runs once
  const hasResetPlan = React.useRef(false);
  const resetPlanOnce = useCallback(() => {
    if (!hasResetPlan.current) {
      resetPlan();
      hasResetPlan.current = true;
    }
  }, [resetPlan]); // Include resetPlan as a dependency
  
  // Define restoreSession outside useEffect to prevent it being recreated every render
  const restoreSession = useCallback(async () => {
    try {
      // Import supabase using static import to avoid dynamic import in every render
      const { supabase } = await import('../services/supabaseClient');
      
      // Try to restore session from backup tokens first
      const accessToken = localStorage.getItem('supabase.auth.token');
      const refreshToken = localStorage.getItem('supabase.auth.refreshToken');
      
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        console.log('Restored Supabase session from localStorage tokens');
        return true;
      }
      
      // Fall back to full session object if available
      const savedSession = localStorage.getItem('supabaseSession');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          });
          console.log('Restored Supabase session from localStorage');
          return true;
        } catch (parseError) {
          console.warn('Could not parse saved session:', parseError);
        }
      }
      
      return false;
    } catch (error) {
      console.warn('Could not restore Supabase session:', error);
      return false;
    }
  }, []);
  
  // Only run this effect once when component mounts
  useEffect(() => {
    // Reset any existing plan when landing page loads - only once
    resetPlanOnce();
    
    // Avoid state updates during unmounting
    let isMounted = true;
    
    const checkAuth = async () => {
      // Check if user is already logged in
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Check if we're in the middle of a login flow
      const isInLoginFlow = sessionStorage.getItem('inLoginFlow');
      
      // Return early if component unmounted
      if (!isMounted) return;
      
      // Restore session and redirect if appropriate
      if (token && userId) {
        await restoreSession();
        
        // Only auto-redirect if we're not in the middle of a login flow
        if (!isInLoginFlow && isMounted) {
          // If user has completed profile setup before, go directly to dashboard
          const profileData = localStorage.getItem('profileData');
          if (profileData) {
            navigate('/dashboard');
          } else {
            // If user is logged in but hasn't set up profile, go to profile setup
            navigate('/profile-setup');
          }
        }
      } else if (isMounted) {
        // If no token is found, make sure to clear any stale session data
        localStorage.removeItem('supabaseSession');
      }
    };
    
    checkAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [resetPlanOnce, navigate, restoreSession]); // Added restoreSession to dependencies but it's stable
  
  // Konami code easter egg
  const [easterEggActivated, setEasterEggActivated] = useState(false);
  
  // Use useMemo to prevent the array from being recreated on every render
  const konamiSequence = useMemo(() => [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ], []);
  
  const checkKonamiCode = useCallback((keys) => {
    return JSON.stringify(keys) === JSON.stringify(konamiSequence);
  }, [konamiSequence]);
  
  useEffect(() => {
    const keys = [];
    
    const handleKeyDown = (e) => {
      keys.push(e.key);
      if (keys.length > konamiSequence.length) {
        keys.shift();
      }
      
      if (checkKonamiCode(keys)) {
        setEasterEggActivated(true);
        playSound('success');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiSequence, checkKonamiCode, playSound]);

  // Manual typewriter effect with sound
  useEffect(() => {
    if (showWelcomeScreen) {
      // Play welcome typewriter sound once at the beginning
      playSound('welcomeTypewriter');
      
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setWelcomeText(fullText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          
          // Show loading text after typing is complete
          setShowLoading(true);
          
          // Play finding spots sound for the loading animation
          playSound('findingSpots');
          
          // Navigate after a delay
          const navigateTo = sessionStorage.getItem('navigateTo');
          if (navigateTo === 'dashboard') {
            setTimeout(() => {
              // Clear login flow flag
              sessionStorage.removeItem('inLoginFlow');
              navigate('/dashboard');
            }, 2000);
          } else {
            setTimeout(() => {
              // Clear login flow flag
              sessionStorage.removeItem('inLoginFlow');
              navigate('/profile-setup');
            }, 2000);
          }
        }
      }, 80);
      
      return () => clearInterval(typingInterval);
    }
  }, [showWelcomeScreen, fullText, navigate, playSound]);

  const handleBeginPlanning = () => {
    // Play click sound when button is pressed
    playSound('click');
    // Show auth form instead of immediately showing welcome screen
    setShowAuthForm(true);
  };
  
  // Handle login from auth form
  const handleLogin = async (userData) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    try {
      // Call the backend API to login
      const result = await api.auth.login(userData.email, userData.password);
      
      // Validate the result to prevent runtime errors
      if (!result || !result.access_token || !result.user_id) {
        throw new Error('Invalid login response. Please try again.');
      }
      
      // Store auth data in localStorage
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('userId', result.user_id);
      localStorage.setItem('username', result.username);
      
      // Get and store the full Supabase session for better persistence
      try {
        const { supabase } = await import('../services/supabaseClient');
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          localStorage.setItem('supabaseSession', JSON.stringify(sessionData.session));
        }
      } catch (sessionError) {
        console.warn('Could not store session data:', sessionError);
        // Continue anyway since we have the token
      }
      
      // Play success sound
      playSound('success');
      
      // Set flag to indicate we're in the middle of login flow
      sessionStorage.setItem('inLoginFlow', 'true');
      
      // Show welcome screen first, then navigate to dashboard
      setShowAuthForm(false);
      setShowWelcomeScreen(true);
      
      // Set a flag to indicate we should navigate to dashboard after welcome animation
      sessionStorage.setItem('navigateTo', 'dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(
        error?.message?.toString() || 'Login failed. Please check your credentials.'
      );
      playSound('error');
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  // Handle signup from auth form
  const handleSignup = async (userData) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    try {
      // Call the backend API to register
      const result = await api.auth.register({
        email: userData.email,
        password: userData.password,
        username: userData.email.split('@')[0] // Use part of email as username
      });
      
      // Validate the result to prevent runtime errors
      if (!result || !result.access_token || !result.user_id) {
        throw new Error('Invalid registration response. Please try again.');
      }
      
      // Store auth data in localStorage
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('userId', result.user_id);
      localStorage.setItem('username', result.username);
      
      // Get and store the full Supabase session for better persistence
      try {
        const { supabase } = await import('../services/supabaseClient');
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          localStorage.setItem('supabaseSession', JSON.stringify(sessionData.session));
        }
      } catch (sessionError) {
        console.warn('Could not store session data:', sessionError);
        // Continue anyway since we have the token
      }
      
      // Play success sound
      playSound('success');
      
      // Set flag to indicate we're in the middle of login flow
      sessionStorage.setItem('inLoginFlow', 'true');
      
      // Show welcome screen first, then navigate to profile setup
      setShowAuthForm(false);
      setShowWelcomeScreen(true);
      
      // Set navigateTo flag to ensure consistent behavior with login
      sessionStorage.setItem('navigateTo', 'profile-setup');
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError(
        error?.message?.toString() || 'Registration failed. Please try again.'
      );
      playSound('error');
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  // Handle guest access from auth form
  const handleGuestAccess = () => {
    console.log('Continuing as guest');
    playSound('click');
    
    // Clear any existing auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    // Continue as guest
    setShowAuthForm(false);
    setShowWelcomeScreen(true);
  };

  // If we're showing the welcome screen
  if (showWelcomeScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-retro-black z-50">
        <div className="text-center">
          <h1 className="font-press-start text-neon-pink neon-text text-2xl md:text-4xl mb-8">
            {welcomeText}
            {welcomeText.length < fullText.length && (
              <span className="cursor blink">_</span>
            )}
          </h1>
          
          {showLoading && (
            <div className="animate-pulse-neon">
              <p className="font-vt323 text-neon-green text-xl">
                LOADING DATE PARAMETERS...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // If we're showing the loading animation
  if (isAuthLoading) {
    return (
      <RetroHeartBackground heartCount={15}>
        <LoadingAnimation message="AUTHENTICATING..." />
      </RetroHeartBackground>
    );
  }

  return (
    <RetroHeartBackground heartCount={30}>
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <div className="z-10 max-w-4xl w-full text-center">
          <h1 className="font-press-start text-neon-pink neon-text text-2xl md:text-4xl mb-8">
            LOVELINK &apos;89
          </h1>
          
          <VHSEffect intensity="light" className="my-12 relative">
            <div className="retro-card p-8 mb-8">
              <p className="font-vt323 text-xl md:text-2xl mb-6 text-neon-blue">
                It&apos;s 1989, but not as you remember it. In this timeline, AI helps you plan the perfect date night with your special someone.
              </p>
              <p className="font-vt323 text-xl md:text-2xl text-neon-green">
                Step into the future-past and let our love algorithm guide your romantic adventure.
              </p>
            </div>
            
            <RetroButton 
              color="blue" 
              size="large"
              glowEffect={true}
              className="text-lg md:text-xl"
              onClick={handleBeginPlanning}
            >
              BEGIN PLANNING
            </RetroButton>
            
            {easterEggActivated && (
              <div className="mt-8 p-4 bg-retro-black border-2 border-neon-yellow animate-pulse-neon">
                <p className="font-vt323 text-neon-yellow text-xl">SECRET DATE UNLOCKED: Arcade Night + Milkshake Sharing!</p>
              </div>
            )}
          </VHSEffect>
          
          <RetroFooter 
            customMessage="Press ↑↑↓↓←→←→BA for a surprise" 
            versionInfo={true}
            showHeartbeat={true}
          />
        </div>
        
        {/* Cassette player animation */}
        <div className="absolute bottom-4 right-4 w-24 h-24 md:w-32 md:h-32">
          <div className="cassette-animation"></div>
        </div>
        
        {/* Custom retro cursor */}
        <RetroCursor color="pink" size="medium" pulseEffect={true} />
        
        {/* Auth form modal */}
        {showAuthForm && (
          <RetroAuthForm
            onLogin={handleLogin}
            onSignup={handleSignup}
            onGuestAccess={handleGuestAccess}
            error={authError}
          />
        )}
      </div>
    </RetroHeartBackground>
  );
};

export default LandingPage;
