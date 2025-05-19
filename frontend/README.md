# LoveLink '89 Frontend

A retro-futuristic AI love concierge web application built with React.js and Tailwind CSS, styled like a 1989 sci-fi romance interface.

## 🎯 Overview

LoveLink '89 helps couples plan date nights step-by-step with an aesthetic that feels like using a romantic computer terminal from an alternate timeline — featuring glowing CRT visuals, pixel-perfect UI, retro animations, and AI-powered recommendations.

## 🧱 Tech Stack

- **Framework**: React.js
- **Styling**: Tailwind CSS with custom themes and animations
- **Fonts**:
  - Press Start 2P (primary)
  - VT323, IBM Plex Mono, Orbitron (for terminals/buttons)
- **Visual Theme**:
  - Synthwave / 80s cyberpunk aesthetic
  - Neon pinks, electric blues, soft purples, glowy greens
  - CRT monitor overlays (scanline and glass glare effects)
  - VHS distortions & transition wipes

## 🖥️ App Structure

1. **Landing Page**: Introduces the app with synthwave animations and retro styling
2. **Date Setup Panel**: Form with location, mood, budget, dietary needs, and transit filters
3. **Food Picker Panel**: Restaurant suggestions with images, ratings, and vibes
4. **Activity Picker Panel**: Activity suggestions based on food choice and location
5. **Surprise Generator**: AI-generated gesture and optional add-ons (events, fashion advice, playlist)
6. **Final Date Plan**: VHS-styled summary screen with all selections

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## ✨ Features

- Retro-futuristic UI with authentic 80s/90s computing aesthetics
- Step-by-step date planning flow
- CRT and VHS visual effects
- Responsive design for all devices
- Easter eggs (Konami code unlocks secret date ideas)
- Shareable date plans

## 🔌 Backend Integration

The frontend is designed to connect with these API endpoints:

- `/api/generate-food` - Generate food options
- `/api/generate-activity` - Lock in food, get activity
- `/api/generate-surprise` - Generate surprise
- `/api/eventbrite` - Get local events
- `/api/fashion-advice` - Outfit advisor
- `/api/playlist` - Playlist by vibe
- `/api/test` - Full plan testing (dev)
