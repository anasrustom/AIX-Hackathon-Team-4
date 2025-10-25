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
        // Primary brand color - Samsung Blue
        primary: {
          50: '#e8eeff',
          100: '#d4ddff',
          200: '#b3c3ff',
          300: '#8ba0ff',
          400: '#6279ff',
          500: '#3d56ff',
          600: '#1428A0', // Main Samsung Blue
          700: '#0f1f7a',
          800: '#0d1a6b',
          900: '#0a1450',
          950: '#060d33',
        },
        // Secondary - Darker Blue
        secondary: {
          50: '#e8ecf7',
          100: '#d4dded',
          200: '#b3c3e0',
          300: '#8ba0ce',
          400: '#6279bc',
          500: '#3d56a8',
          600: '#0D1A6B', // Dark blue accent
          700: '#0a1452',
          800: '#081042',
          900: '#060d33',
          950: '#040820',
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
