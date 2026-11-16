// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        koi: {
          red: '#D61F26',
          redDark: '#A8151B',
          black: '#111111',
          charcoal: '#1C1C1E',
          light: '#F8FAFC'
        }
      },
      keyframes: {
        rippleExpand: {
          '0%': { transform: 'scale(0.82)', opacity: '0.55' },
          '100%': { transform: 'scale(1.75)', opacity: '0' },
        },
        floatPulse: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-3px) scale(1.01)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      },
      animation: {
        'ripple-1': 'rippleExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'ripple-2': 'rippleExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.3s',
        'ripple-3': 'rippleExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite 2.6s',
        'logo-float': 'floatPulse 4.5s ease-in-out infinite',
        'shimmer': 'shimmer 1.6s infinite',
      }
    },
  },
  plugins: [],
}