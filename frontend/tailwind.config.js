/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Premium Minimal Palette
        'light-bg': '#FBFBFA',
        'soft-beige': '#C4C1B8',
        'warm-taupe': '#C7BDAA',
        'earthy-brown': '#817461',
        'neutral-grey': '#A09C92',
        'warm-grey': '#A59986',
        'muted-natural': '#817C70',
        'deep-brown': '#3B332B',
        'medium-brown': '#685846',
        'muted-dark': '#595147',
        'darkest-accent': '#3C301F',
        
        // Legacy aliases for compatibility
        royalBrown: '#3B332B',
        chocolate: '#685846',
        maroon: '#817461',
        gold: '#C7BDAA',
        sandBeige: '#C4C1B8',
        cream: '#FBFBFA',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'Cormorant Garamond', 'serif'],
        'body': ['Inter', 'Lato', 'sans-serif'],
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
      },
      letterSpacing: {
        'elegant': '0.05em',
        'luxury': '0.1em',
      },
      borderRadius: {
        'luxury': '12px',
        'luxury-lg': '16px',
      },
      boxShadow: {
        'luxury': '0 8px 16px rgba(60, 48, 31, 0.08), 0 2px 4px rgba(60, 48, 31, 0.04)',
        'luxury-sm': '0 2px 8px rgba(60, 48, 31, 0.06)',
        'luxury-lg': '0 12px 24px rgba(60, 48, 31, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
