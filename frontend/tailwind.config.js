// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        warehouse: {
          'rack': '#4b5563',
          'euro-pallet': '#10b981',
          'us-pallet': '#f59e0b',
          'grid': '#6b7280',
          'occupied': '#ef4444',
          'free': '#10b981',
          'selected': '#fbbf24',
          'reserved': '#8b5cf6',
        },
        factory: {
          'extrusion': '#8b5cf6',
          'casting': '#06b6d4',
          'packaging': '#f97316',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}