import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSound } from '../context/SoundContext';
import RetroButton from './RetroButton';
import TypewriterText from './TypewriterText';

/**
 * A retro-styled authentication form with login/signup functionality
 */
const RetroAuthForm = ({ onLogin, onSignup, onGuestAccess, error: propError }) => {
  const { playSound } = useSound();
  const [formType, setFormType] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTabChange = (type) => {
    playSound('click');
    setFormType(type);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('click');
    setError('');
    
    if (formType === 'signup') {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('INVALID EMAIL FORMAT');
        return;
      }
      
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        setError('PASSWORDS DO NOT MATCH');
        return;
      }
    }
    
    // Call the appropriate handler directly
    if (formType === 'login') {
      onLogin(formData);
    } else {
      onSignup(formData);
    }
  };

  const handleGuestAccess = () => {
    playSound('click');
    onGuestAccess();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black opacity-80"></div>
      
      <div className="retro-card border-4 border-neon-pink w-full max-w-md relative z-10 p-6 animate-fadeIn">
        {/* Pixelated heart decorations */}
        <div className="absolute -top-6 -left-6 w-12 h-12 pixel-heart"></div>
        <div className="absolute -top-6 -right-6 w-12 h-12 pixel-heart"></div>
        
        <div className="text-center mb-6">
          <h2 className="font-press-start text-neon-pink text-xl md:text-2xl mb-2">
            {formType === 'login' ? 'LOGIN' : 'SIGN UP'}
          </h2>
          <TypewriterText 
            text={formType === 'login' 
              ? "ENTER YOUR CREDENTIALS TO ACCESS YOUR SAVED DATES" 
              : "CREATE AN ACCOUNT TO SAVE YOUR PERFECT DATES"
            }
            className="font-vt323 text-neon-green text-lg"
            speed={30}
          />
        </div>
        
        {/* Tab navigation */}
        <div className="flex mb-6 border-b-2 border-neon-blue">
          <button
            type="button"
            className={`flex-1 py-2 font-vt323 text-lg ${
              formType === 'login' 
                ? 'text-neon-pink border-b-2 border-neon-pink' 
                : 'text-neon-blue hover:text-neon-pink'
            }`}
            onClick={() => handleTabChange('login')}
          >
            LOGIN
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-vt323 text-lg ${
              formType === 'signup' 
                ? 'text-neon-pink border-b-2 border-neon-pink' 
                : 'text-neon-blue hover:text-neon-pink'
            }`}
            onClick={() => handleTabChange('signup')}
          >
            SIGN UP
          </button>
        </div>
        
        {/* Error message */}
        {(error || propError) && (
          <div className="mb-4 p-2 border-2 border-neon-red bg-retro-black animate-pulse">
            <p className="font-vt323 text-neon-red text-center">{error || propError}</p>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-vt323 text-neon-blue mb-1">EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-retro-darkgray border-2 border-neon-blue p-3 font-vt323 text-lg text-white focus:border-neon-pink focus:outline-none"
              autoComplete="username email"
              required
            />
          </div>
          
          <div>
            <label className="block font-vt323 text-neon-blue mb-1">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-retro-darkgray border-2 border-neon-blue p-3 font-vt323 text-lg text-white focus:border-neon-pink focus:outline-none"
              autoComplete="current-password"
              required
            />
          </div>
          
          {formType === 'signup' && (
            <div>
              <label className="block font-vt323 text-neon-blue mb-1">CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-retro-darkgray border-2 border-neon-blue p-3 font-vt323 text-lg text-white focus:border-neon-pink focus:outline-none"
                autoComplete="new-password"
                required
              />
            </div>
          )}
          
          <div className="pt-4">
            <RetroButton
              type="submit"
              color="pink"
              className="w-full"
            >
              {formType === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
            </RetroButton>
          </div>
        </form>
        
        {/* Guest option */}
        <div className="mt-6 text-center">
          <p className="font-vt323 text-neon-blue mb-2">OR</p>
          <RetroButton
            type="button"
            color="green"
            variant="outline"
            className="w-full"
            onClick={handleGuestAccess}
          >
            CONTINUE AS GUEST
          </RetroButton>
        </div>
        
        {/* Pixelated heart decorations */}
        <div className="absolute -bottom-6 -left-6 w-12 h-12 pixel-heart"></div>
        <div className="absolute -bottom-6 -right-6 w-12 h-12 pixel-heart"></div>
        
        {/* Pixelated heart styling */}
        <style jsx="true">{`
          .pixel-heart {
            position: absolute;
            background-color: transparent;
            box-shadow:
              /* Row 1 */
              4px 0 0 0 #ff00ff,
              8px 0 0 0 #ff00ff,
              
              /* Row 2 */
              0 4px 0 0 #ff00ff,
              4px 4px 0 0 #ff33ff,
              8px 4px 0 0 #ff33ff,
              12px 4px 0 0 #ff00ff,
              
              /* Row 3 */
              0 8px 0 0 #ff00ff,
              4px 8px 0 0 #ff33ff,
              8px 8px 0 0 #ff66ff,
              12px 8px 0 0 #ff00ff,
              
              /* Row 4 */
              4px 12px 0 0 #ff00ff,
              8px 12px 0 0 #ff00ff;
            
            animation: pulse 2s ease-in-out infinite alternate;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1.1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

RetroAuthForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSignup: PropTypes.func.isRequired,
  onGuestAccess: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default RetroAuthForm;
