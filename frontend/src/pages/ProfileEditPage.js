import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import RetroHeader from '../components/RetroHeader';
import RetroButton from '../components/RetroButton';
import RetroFooter from '../components/RetroFooter';
import VHSEffect from '../components/VHSEffect';
import CRTEffect from '../components/CRTEffect';
import DashboardHeader from '../components/DashboardHeader';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data - in a real app, this would come from a context or API
  const [userData] = useState({
    username: 'LOVER_1',
    partnerName: 'LOVER_2',
    email: 'lover1@lovelink89.com',
    partnerInfo: {
      birthday: '1989-06-15',
      anniversary: '2024-02-14',
      hobbies: ['Retro Gaming', 'Synthwave Music', 'Roller Skating'],
      favoriteFood: 'Pizza',
      favoriteMovie: 'Blade Runner'
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // Basic validation
    if (!currentPassword) {
      setErrorMessage('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setErrorMessage('New password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    // In a real app, we would call an API to update the password
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect back to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <CRTEffect intensity="medium" className="min-h-screen bg-retro-black">
      <DashboardHeader 
        userData={userData} 
        handlePlanNewDate={() => navigate('/date-setup')} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Profile Info Card */}
            <div className="md:col-span-1">
              <VHSEffect intensity="light">
                <div className="retro-card p-4 border-2 border-neon-pink">
                  <div className="flex flex-col items-center">
                    <h2 className="font-press-start text-neon-green text-xl mb-2">
                      {userData.username}
                    </h2>
                    
                    <p className="font-vt323 text-neon-blue text-lg mb-4">
                      {userData.email}
                    </p>
                    
                    <div className="w-full mt-4">
                      <RetroButton
                        color="pink"
                        size="medium"
                        className="w-full"
                        onClick={() => navigate('/dashboard')}
                      >
                        BACK TO DASHBOARD
                      </RetroButton>
                    </div>
                  </div>
                </div>
              </VHSEffect>
            </div>
            
            {/* Password Change Form */}
            <div className="md:col-span-2">
              <VHSEffect intensity="light">
                <div className="retro-card p-4 border-2 border-neon-blue">
                  <h2 className="font-press-start text-neon-blue text-xl mb-4">
                    CHANGE PASSWORD
                  </h2>
                  
                  {errorMessage && (
                    <div className="bg-red-900 border border-red-500 text-white p-3 mb-4">
                      <p className="font-vt323 text-lg">{errorMessage}</p>
                    </div>
                  )}
                  
                  {successMessage && (
                    <div className="bg-green-900 border border-green-500 text-white p-3 mb-4">
                      <p className="font-vt323 text-lg">{successMessage}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block font-vt323 text-neon-pink text-lg mb-2">
                        CURRENT PASSWORD
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-retro-darkgray border-2 border-neon-green p-2 font-vt323 text-white text-lg focus:outline-none focus:border-neon-pink"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-vt323 text-neon-pink text-lg mb-2">
                        NEW PASSWORD
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-retro-darkgray border-2 border-neon-green p-2 font-vt323 text-white text-lg focus:outline-none focus:border-neon-pink"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block font-vt323 text-neon-pink text-lg mb-2">
                        CONFIRM NEW PASSWORD
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-retro-darkgray border-2 border-neon-green p-2 font-vt323 text-white text-lg focus:outline-none focus:border-neon-pink"
                      />
                    </div>
                    
                    <div className="text-center">
                      <RetroButton
                        type="submit"
                        color="green"
                        size="medium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
                      </RetroButton>
                    </div>
                  </form>
                </div>
              </VHSEffect>
              
              <VHSEffect intensity="light">
                <div className="retro-card p-4 border-2 border-neon-pink mt-6">
                  <h2 className="font-press-start text-neon-pink text-xl mb-4">
                    EDIT PARTNER INFO
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-vt323 text-neon-blue text-lg">PARTNER NAME</p>
                      <p className="font-vt323 text-neon-green text-xl">{userData.partnerName}</p>
                    </div>
                    
                    <div>
                      <p className="font-vt323 text-neon-blue text-lg">BIRTHDAY</p>
                      <p className="font-vt323 text-neon-green text-xl">{userData.partnerInfo.birthday}</p>
                    </div>
                    
                    <div>
                      <p className="font-vt323 text-neon-blue text-lg">ANNIVERSARY</p>
                      <p className="font-vt323 text-neon-green text-xl">{userData.partnerInfo.anniversary}</p>
                    </div>
                    
                    <div>
                      <p className="font-vt323 text-neon-blue text-lg">FAVORITE FOOD</p>
                      <p className="font-vt323 text-neon-green text-xl">{userData.partnerInfo.favoriteFood}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <RetroButton
                      color="blue"
                      size="medium"
                      onClick={() => navigate('/profile-setup')}
                    >
                      EDIT PROFILE INFO
                    </RetroButton>
                  </div>
                </div>
              </VHSEffect>
            </div>
          </div>
        </div>
      </div>
      
      <RetroFooter />
    </CRTEffect>
  );
};

export default ProfileEditPage;
