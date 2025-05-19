import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatePlan } from '../context/DatePlanContext';
import RetroHeader from '../components/RetroHeader';
import RetroButton from '../components/RetroButton';
import LoadingIndicator from '../components/LoadingIndicator';
import RetroFooter from '../components/RetroFooter';
import VHSEffect from '../components/VHSEffect';
import api from '../services/api';

const SurprisePanel = () => {
  const navigate = useNavigate();
  const { dateSetup, selectedRestaurant, selectedActivity, setSurpriseItem } = useDatePlan();
  const [loading, setLoading] = useState(true);
  const [surprise, setSurprise] = useState(null);
  const [showExtras, setShowExtras] = useState({
    events: false,
    fashion: false,
    playlist: false
  });

  useEffect(() => {
    // Fetch surprise based on the selected restaurant and activity
    const fetchSurprise = async () => {
      try {
        setLoading(true);
        // In a real app, we would use the API service
        // const result = await api.generateSurprise(selectedRestaurant, selectedActivity, dateSetup);
        
        // For demo purposes, we'll use a timeout to simulate API call
        setTimeout(() => {
          const mockSurprise = {
            gesture: "Bring a disposable camera to capture retro-style photos of your date night. Develop them later for a nostalgic keepsake.",
            events: [
              { name: "80s Synthwave Concert", location: "Downtown Music Hall", date: "This Friday" },
              { name: "Retro Gaming Convention", location: "Tech Museum", date: "This Saturday" }
            ],
            fashion: {
              suggestion: "Go for a neon-accented outfit with vintage high-waisted jeans or a bold patterned jacket. Add chunky jewelry or a digital watch for authentic 80s flair."
            },
            playlist: {
              name: "Synthwave Romance",
              tracks: ["The Midnight - Los Angeles", "FM-84 - Running in the Night", "Timecop1983 - On the Run"]
            }
          };
          
          setSurprise(mockSurprise);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error fetching surprise:", error);
        setLoading(false);
      }
    };

    fetchSurprise();
  }, [dateSetup, selectedRestaurant, selectedActivity]);

  const handleContinue = () => {
    // Save surprise to context
    setSurpriseItem(surprise);
    
    // Show loading effect before navigating
    setLoading(true);
    setTimeout(() => {
      navigate('/final-plan');
    }, 1000);
  };

  const toggleExtra = (section) => {
    setShowExtras(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-retro-black p-4 crt-effect">
      <div className="max-w-4xl mx-auto">
        <RetroHeader title="SURPRISE GENERATOR" color="yellow" />
        
        {loading ? (
          <div className="retro-card p-8 flex flex-col items-center justify-center min-h-[400px]">
            <LoadingIndicator 
              text="Calculating romance enhancement..." 
              color="pink" 
              type="bar" 
            />
            <p className="font-ibm-plex text-retro-gray mt-4 text-center">
              SYSTEM: Generating personalized surprise element...
            </p>
          </div>
        ) : (
          <>
            <VHSEffect intensity="light">
              <div className="retro-card mb-6 border-neon-pink">
                <div className="bg-neon-pink bg-opacity-20 p-2">
                  <h2 className="font-press-start text-neon-pink text-lg">SURPRISE GESTURE</h2>
                </div>
                <div className="p-4">
                  <p className="font-vt323 text-xl text-white mb-4">
                    {surprise.gesture}
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-pulse-neon">
                      <span className="text-neon-pink text-4xl">♥</span>
                    </div>
                  </div>
                </div>
              </div>
            </VHSEffect>
            
            {/* Add-ons Section */}
            <div className="space-y-4 mb-8">
              {/* Local Events */}
              <div className="retro-card border-neon-blue">
                <button 
                  onClick={() => toggleExtra('events')}
                  className="w-full flex justify-between items-center bg-neon-blue bg-opacity-20 p-2"
                >
                  <h2 className="font-press-start text-neon-blue text-lg">🎟️ LOCAL EVENTS</h2>
                  <span className="text-neon-blue">{showExtras.events ? '▲' : '▼'}</span>
                </button>
                
                {showExtras.events && (
                  <div className="p-4">
                    {surprise.events.map((event, index) => (
                      <div key={index} className="mb-3 last:mb-0 p-2 border border-retro-gray">
                        <h3 className="font-vt323 text-neon-blue text-lg">{event.name}</h3>
                        <p className="font-vt323 text-white">📍 {event.location}</p>
                        <p className="font-vt323 text-retro-gray">📅 {event.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Fashion Advice */}
              <div className="retro-card border-neon-green">
                <button 
                  onClick={() => toggleExtra('fashion')}
                  className="w-full flex justify-between items-center bg-neon-green bg-opacity-20 p-2"
                >
                  <h2 className="font-press-start text-neon-green text-lg">👗 FASHION ADVICE</h2>
                  <span className="text-neon-green">{showExtras.fashion ? '▲' : '▼'}</span>
                </button>
                
                {showExtras.fashion && (
                  <div className="p-4">
                    <p className="font-vt323 text-white text-lg">
                      {surprise.fashion.suggestion}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Spotify Playlist */}
              <div className="retro-card border-neon-purple">
                <button 
                  onClick={() => toggleExtra('playlist')}
                  className="w-full flex justify-between items-center bg-neon-purple bg-opacity-20 p-2"
                >
                  <h2 className="font-press-start text-neon-purple text-lg">🎶 SPOTIFY PLAYLIST</h2>
                  <span className="text-neon-purple">{showExtras.playlist ? '▲' : '▼'}</span>
                </button>
                
                {showExtras.playlist && (
                  <div className="p-4">
                    <h3 className="font-vt323 text-neon-purple text-xl mb-2">{surprise.playlist.name}</h3>
                    <ul className="space-y-2">
                      {surprise.playlist.tracks.map((track, index) => (
                        <li key={index} className="font-vt323 text-white flex items-center">
                          <span className="mr-2">▶</span> {track}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <RetroButton
                onClick={handleContinue}
                color="yellow"
              >
                FINALIZE DATE PLAN
              </RetroButton>
              
              <p className="font-vt323 text-retro-gray mt-4">
                SYSTEM: All elements will be compiled into your final VHS date plan.
              </p>
            </div>
          </>
        )}
        
        <RetroFooter showBackButton={true} backTo="/activity-picker" />
      </div>
    </div>
  );
};

export default SurprisePanel;
