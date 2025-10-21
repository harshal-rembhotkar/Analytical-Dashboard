/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // deep navy
        surface: '#1e293b',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        primary: '#3b82f6', // blue-500
        success: '#22c55e', // green-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444',   // red-500
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
      },
    },
  },
  plugins: [],
}


