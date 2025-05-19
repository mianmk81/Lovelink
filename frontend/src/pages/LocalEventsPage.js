import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import RetroHeartBackground from '../components/RetroHeartBackground';
import RetroButton from '../components/RetroButton';
import TypewriterText from '../components/TypewriterText';
import RetroFooter from '../components/RetroFooter';
import RetroCursor from '../components/RetroCursor';
import VHSEffect from '../components/VHSEffect';
import LoadingIndicator from '../components/LoadingIndicator';

const LocalEventsPage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Mock data for local events
  const mockEvents = [
    {
      id: 1,
      title: "80s Roller Disco Night",
      date: "2025-04-15",
      time: "7:00 PM - 11:00 PM",
      location: "Stardust Roller Rink",
      address: "123 Neon Blvd, Retroville",
      image: "https://images.unsplash.com/photo-1604014137308-28951f810955",
      description: "Lace up your roller skates and groove to the best hits of the 80s! Featuring a live DJ, light show, and costume contest.",
      price: "$15 per person",
      tags: ["Music", "Dancing", "Retro"]
    },
    {
      id: 2,
      title: "Synthwave Summer Festival",
      date: "2025-05-20",
      time: "4:00 PM - 12:00 AM",
      location: "Sunset Beach",
      address: "456 Ocean Drive, Retroville",
      image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909",
      description: "Experience the ultimate retro-futuristic music festival featuring top synthwave artists, laser shows, and retro arcade games.",
      price: "$45 per person",
      tags: ["Music", "Festival", "Outdoors"]
    },
    {
      id: 3,
      title: "Retro Gaming Convention",
      date: "2025-04-28",
      time: "10:00 AM - 6:00 PM",
      location: "Pixel Palace Convention Center",
      address: "789 Arcade Avenue, Retroville",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      description: "The largest collection of vintage arcade machines, consoles, and gaming memorabilia. Tournaments, cosplay, and special guests!",
      price: "$25 per person",
      tags: ["Gaming", "Convention", "Competition"]
    },
    {
      id: 4,
      title: "Drive-In Movie Marathon",
      date: "2025-05-05",
      time: "7:30 PM - 2:00 AM",
      location: "Starlight Drive-In",
      address: "321 Cinema Lane, Retroville",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
      description: "Back-to-back screenings of classic 80s sci-fi and romance films under the stars. Featuring food trucks and vintage car showcase.",
      price: "$20 per car",
      tags: ["Movies", "Outdoors", "Food"]
    },
    {
      id: 5,
      title: "Neon Art Exhibition",
      date: "2025-04-22",
      time: "11:00 AM - 8:00 PM",
      location: "Glow Gallery",
      address: "555 Luminous Lane, Retroville",
      image: "https://images.unsplash.com/photo-1520453803296-c39eabe2dab4",
      description: "Immersive neon art installations by leading light artists. Interactive exhibits and photography opportunities in a retro-futuristic setting.",
      price: "$18 per person",
      tags: ["Art", "Exhibition", "Photography"]
    }
  ];
  
  // Fade-in animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    // Simulate loading events
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleViewEvent = (event) => {
    playSound('click');
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  const handleBackToDashboard = () => {
    playSound('click');
    navigate('/dashboard');
  };
  
  const handleAddToCalendar = (event) => {
    playSound('success');
    // In a real app, this would add the event to the user's calendar
    alert(`Added "${event.title}" to your calendar!`);
  };
  
  const handleCloseEventDetails = () => {
    playSound('click');
    setShowEventDetails(false);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Event details modal
  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="absolute inset-0 bg-retro-black opacity-80" onClick={handleCloseEventDetails}></div>
        <div className="relative bg-retro-darkgray border-4 border-neon-pink max-w-3xl w-full max-h-90vh overflow-y-auto z-10">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-press-start text-neon-pink text-xl">{selectedEvent.title}</h2>
              <button 
                className="font-press-start text-neon-blue hover:text-neon-pink"
                onClick={handleCloseEventDetails}
              >
                [X]
              </button>
            </div>
            
            <div className="mb-6 h-48 overflow-hidden">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-vt323 text-neon-blue text-lg">DATE</p>
                <p className="font-vt323 text-neon-green text-lg">{formatDate(selectedEvent.date)}</p>
              </div>
              
              <div>
                <p className="font-vt323 text-neon-blue text-lg">TIME</p>
                <p className="font-vt323 text-neon-green text-lg">{selectedEvent.time}</p>
              </div>
              
              <div>
                <p className="font-vt323 text-neon-blue text-lg">LOCATION</p>
                <p className="font-vt323 text-neon-green text-lg">{selectedEvent.location}</p>
              </div>
              
              <div>
                <p className="font-vt323 text-neon-blue text-lg">PRICE</p>
                <p className="font-vt323 text-neon-green text-lg">{selectedEvent.price}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="font-vt323 text-neon-blue text-lg">ADDRESS</p>
              <p className="font-vt323 text-neon-green text-lg">{selectedEvent.address}</p>
            </div>
            
            <div className="mb-6">
              <p className="font-vt323 text-neon-blue text-lg">DESCRIPTION</p>
              <p className="font-vt323 text-neon-green text-lg">{selectedEvent.description}</p>
            </div>
            
            <div className="mb-6">
              <p className="font-vt323 text-neon-blue text-lg">TAGS</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEvent.tags.map((tag, index) => (
                  <div key={index} className="bg-retro-black border border-neon-green px-3 py-1">
                    <p className="font-vt323 text-neon-green">{tag}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <RetroButton
                color="pink"
                size="medium"
                className="mr-4"
                onClick={() => handleAddToCalendar(selectedEvent)}
              >
                ADD TO CALENDAR
              </RetroButton>
              
              <RetroButton
                color="blue"
                size="medium"
                onClick={handleCloseEventDetails}
              >
                CLOSE
              </RetroButton>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <RetroHeartBackground heartCount={15}>
      <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <header className="bg-retro-black border-b-4 border-neon-pink py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="font-press-start text-neon-pink text-2xl md:text-3xl mb-4 md:mb-0">
                LOCAL EVENTS
              </h1>
              
              <RetroButton
                color="blue"
                size="small"
                onClick={handleBackToDashboard}
              >
                BACK TO DASHBOARD
              </RetroButton>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <VHSEffect intensity="light">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <TypewriterText 
                  text="SYSTEM: SCANNING LOCAL AREA FOR SPECIAL EVENTS... COMPLETE." 
                  className="font-vt323 text-neon-green text-xl"
                  speed={30}
                  playSound={false}
                />
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingIndicator message="LOADING EVENTS..." />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map(event => (
                    <div 
                      key={event.id} 
                      className="border-2 border-neon-blue bg-retro-darkgray hover:border-neon-pink transition-colors duration-300 cursor-pointer"
                      onClick={() => handleViewEvent(event)}
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-press-start text-neon-pink text-lg mb-2">{event.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="font-vt323 text-neon-blue text-sm">DATE</p>
                            <p className="font-vt323 text-neon-green">{formatDate(event.date)}</p>
                          </div>
                          <div>
                            <p className="font-vt323 text-neon-blue text-sm">LOCATION</p>
                            <p className="font-vt323 text-neon-green">{event.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {event.tags.map((tag, index) => (
                            <div key={index} className="bg-retro-black border border-neon-green px-2 py-0.5">
                              <p className="font-vt323 text-neon-green text-xs">{tag}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </VHSEffect>
        </main>
        
        <RetroFooter />
      </div>
      
      {showEventDetails && renderEventDetails()}
      <RetroCursor color="pink" size="medium" pulseEffect={true} />
    </RetroHeartBackground>
  );
};

export default LocalEventsPage;
