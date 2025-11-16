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
        // Premium Luxury Indian Fashion Palette
        royalBrown: {
          DEFAULT: '#2C1810',
          light: '#3D2418',
          dark: '#1A0E08',
        },
        chocolate: {
          DEFAULT: '#4A2E29',
          light: '#5A3E39',
          dark: '#3A1E19',
        },
        maroon: {
          DEFAULT: '#8B3A3A',
          light: '#9B4A4A',
          dark: '#7B2A2A',
        },
        gold: {
          DEFAULT: '#C49E54',
          light: '#D4AE64',
          dark: '#B48E44',
        },
        sandBeige: '#E9E4D4',
        cream: '#F7F4EF',
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
        'luxury-lg': '14px',
      },
      boxShadow: {
        'gold': '0 4px 6px -1px rgba(196, 158, 84, 0.2), 0 2px 4px -1px rgba(196, 158, 84, 0.1)',
        'gold-lg': '0 10px 15px -3px rgba(196, 158, 84, 0.2), 0 4px 6px -2px rgba(196, 158, 84, 0.1)',
        'luxury': '0 20px 25px -5px rgba(44, 24, 16, 0.1), 0 10px 10px -5px rgba(44, 24, 16, 0.04)',
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
