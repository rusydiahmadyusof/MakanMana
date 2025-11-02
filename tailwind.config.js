/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F59E0B',
          light: '#FEF3C7',
          accent: '#F87171',
          dark: '#78350F',
          neutral: '#FFF8E7'
        }
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

