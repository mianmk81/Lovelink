import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RetroButton from './RetroButton';
import supabaseApi from '../services/supabaseApi';

const DashboardHeader = ({ userData, handlePlanNewDate }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabaseApi.logoutUser();
      if (error) {
        console.error('Error logging out:', error);
        return;
      }
      // Save the profile data before clearing auth tokens
      const profileData = localStorage.getItem('profileData');
      
      // Clear authentication tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('supabase.auth.token');
      
      // Restore profile data so it's available on next login
      if (profileData) {
        localStorage.setItem('profileData', profileData);
      }
      
      // Redirect to landing page
      navigate('/');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  return (
    <header className="bg-retro-black border-b-2 border-neon-pink py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo - clickable to go to dashboard */}
          <h1 
            className="font-press-start text-neon-pink text-2xl cursor-pointer hover:text-neon-green transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            LOVELINK &apos;89
          </h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <RetroButton
              color="pink"
              size="small"
              onClick={handlePlanNewDate}
            >
              PLAN A DATE
            </RetroButton>
            
            <RetroButton
              color="blue"
              size="small"
              onClick={() => navigate('/profile-edit')}
              title="Edit Profile"
            >
              WELCOME,{userData?.username || 'LOVER_1'}
            </RetroButton>
            
            <RetroButton
              color="red"
              size="small"
              onClick={handleLogout}
              title="Logout"
            >
              LOGOUT
            </RetroButton>
          </div>
          
          {/* Hamburger Menu Button (Mobile) */}
          <div className="md:hidden">
            <button 
              className="flex flex-col justify-center items-center w-10 h-10 border-2 border-neon-pink p-1"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`bg-neon-pink h-0.5 w-6 rounded-sm transition-all duration-300 ${menuOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`}></span>
              <span className={`bg-neon-pink h-0.5 w-6 rounded-sm transition-all duration-300 ${menuOpen ? 'opacity-0' : 'mb-1.5'}`}></span>
              <span className={`bg-neon-pink h-0.5 w-6 rounded-sm transition-all duration-300 ${menuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 border-t-2 border-neon-blue pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <RetroButton
                color="pink"
                size="small"
                onClick={() => {
                  handlePlanNewDate();
                  setMenuOpen(false);
                }}
                className="w-full"
              >
                PLAN A DATE
              </RetroButton>
              
              <RetroButton
                color="blue"
                size="small"
                onClick={() => {
                  navigate('/profile-edit');
                  setMenuOpen(false);
                }}
                className="w-full"
              >
                PROFILE SETTINGS
              </RetroButton>
              
              <RetroButton
                color="green"
                size="small"
                onClick={() => {
                  navigate('/dashboard');
                  setMenuOpen(false);
                }}
                className="w-full"
              >
                DASHBOARD
              </RetroButton>
              
              <RetroButton
                color="red"
                size="small"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full"
              >
                LOGOUT
              </RetroButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
