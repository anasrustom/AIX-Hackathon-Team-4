/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color - Deep Purple
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#441768', // Main brand color
          950: '#2e0f47',
        },
        // Secondary - Dark Navy
        secondary: {
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e3e7ef',
          300: '#c8d0e0',
          400: '#a6b3c8',
          500: '#8898b0',
          600: '#6e7e98',
          700: '#59687e',
          800: '#4a5669',
          900: '#1A2155', // Dark navy accent
          950: '#0f1430',
        },
        // Neutral colors
        dark: '#000000',
        light: '#FFFFFF',
        'light-gray': '#F2F2F2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
        bounceGentle: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(68, 23, 104, 0.1), 0 10px 20px -2px rgba(68, 23, 104, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(68, 23, 104, 0.15), 0 20px 30px -5px rgba(68, 23, 104, 0.1)',
        'glow': '0 0 20px rgba(68, 23, 104, 0.3)',
        'glow-lg': '0 0 40px rgba(68, 23, 104, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #441768 0%, #1A2155 100%)',
        'gradient-primary-light': 'linear-gradient(135deg, rgba(68, 23, 104, 0.1) 0%, rgba(26, 33, 85, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}
