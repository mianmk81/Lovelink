import React from 'react';
import PropTypes from 'prop-types';

// Import all SVG icons
import locationIcon from '../assets/pixel-icons/location.svg';
import hobbiesIcon from '../assets/pixel-icons/hobbies.svg';
import budgetIcon from '../assets/pixel-icons/budget.svg';
import dietaryIcon from '../assets/pixel-icons/dietary.svg';
import transitIcon from '../assets/pixel-icons/transit.svg';

// Hobby icons
import moviesIcon from '../assets/pixel-icons/movies.svg';
import gamingIcon from '../assets/pixel-icons/gaming.svg';
import musicIcon from '../assets/pixel-icons/music.svg';
import sportsIcon from '../assets/pixel-icons/sports.svg';
import artIcon from '../assets/pixel-icons/art.svg';
import cookingIcon from '../assets/pixel-icons/cooking.svg';
import readingIcon from '../assets/pixel-icons/reading.svg';
import hikingIcon from '../assets/pixel-icons/hiking.svg';
import dancingIcon from '../assets/pixel-icons/dancing.svg';
import photographyIcon from '../assets/pixel-icons/photography.svg';

// Budget icons
import freeIcon from '../assets/pixel-icons/free.svg';
import lowIcon from '../assets/pixel-icons/low.svg';
import mediumIcon from '../assets/pixel-icons/medium.svg';
import highIcon from '../assets/pixel-icons/high.svg';
import luxuryIcon from '../assets/pixel-icons/luxury.svg';

// Dietary icons
import vegetarianIcon from '../assets/pixel-icons/vegetarian.svg';
import veganIcon from '../assets/pixel-icons/vegan.svg';
import glutenFreeIcon from '../assets/pixel-icons/gluten-free.svg';
import dairyFreeIcon from '../assets/pixel-icons/dairy-free.svg';
import nutFreeIcon from '../assets/pixel-icons/nut-free.svg';
import allDietsIcon from '../assets/pixel-icons/all-diets.svg';

// Transit icons
import walkableIcon from '../assets/pixel-icons/walkable.svg';
import parkingIcon from '../assets/pixel-icons/parking.svg';
import publicTransitIcon from '../assets/pixel-icons/public.svg';
import rideshareIcon from '../assets/pixel-icons/rideshare.svg';
import anyTransitIcon from '../assets/pixel-icons/any-transit.svg';

// Icon mapping
const iconMap = {
  // Section icons
  location: locationIcon,
  hobbies: hobbiesIcon,
  budget: budgetIcon,
  dietary: dietaryIcon,
  transit: transitIcon,
  
  // Hobby icons
  movies: moviesIcon,
  gaming: gamingIcon,
  music: musicIcon,
  sports: sportsIcon,
  art: artIcon,
  cooking: cookingIcon,
  reading: readingIcon,
  hiking: hikingIcon,
  dancing: dancingIcon,
  photography: photographyIcon,
  
  // Budget icons
  free: freeIcon,
  low: lowIcon,
  medium: mediumIcon,
  high: highIcon,
  luxury: luxuryIcon,
  
  // Dietary icons
  vegetarian: vegetarianIcon,
  vegan: veganIcon,
  'gluten-free': glutenFreeIcon,
  'dairy-free': dairyFreeIcon,
  'nut-free': nutFreeIcon,
  'all-diets': allDietsIcon,
  
  // Transit icons
  walkable: walkableIcon,
  parking: parkingIcon,
  public: publicTransitIcon,
  rideshare: rideshareIcon,
  'any-transit': anyTransitIcon
};

const PixelIcon = ({ name, size = 24, className = '' }) => {
  const iconSrc = iconMap[name];
  
  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <img 
      src={iconSrc} 
      alt={`${name} icon`} 
      width={size} 
      height={size} 
      className={`inline-block ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

PixelIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string
};

export default PixelIcon;
