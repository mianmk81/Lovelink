/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Synthwave / 80s cyberpunk palette
        neon: {
          pink: '#ff00ff',
          blue: '#00ffff',
          purple: '#9900ff',
          green: '#00ff99',
          yellow: '#ffff00',
        },
        retro: {
          black: '#121212',
          darkgray: '#222222',
          gray: '#888888',
          lightgray: '#dddddd',
        }
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'vt323': ['"VT323"', 'monospace'],
        'ibm-plex': ['"IBM Plex Mono"', 'monospace'],
        'orbitron': ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanline 2s linear infinite',
        'glitch': 'glitch 500ms linear infinite',
        'pulse-neon': 'pulse-neon 2s infinite',
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        'scanline': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'crt-flicker': {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.98' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'synthwave-grid': "url('/src/assets/synthwave-grid.svg')",
        'crt-overlay': "url('/src/assets/crt-overlay.png')",
      },
    },
  },
  plugins: [],
}
