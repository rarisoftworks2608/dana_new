/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003B8E',
          light: '#0057D8',
          dark: '#00296B',
        },
        secondary: {
          DEFAULT: '#0057D8',
        },
        accent: {
          DEFAULT: '#F5B301',
          light: '#FFCB3D',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #003B8E 0%, #00296B 55%, #0F172A 100%)',
        'accent-gradient': 'linear-gradient(90deg, #F5B301 0%, #FFCB3D 100%)',
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(0, 59, 142, 0.15)',
        'card-hover': '0 20px 40px -12px rgba(0, 59, 142, 0.25)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
      },
    },
  },
  plugins: [],
};
