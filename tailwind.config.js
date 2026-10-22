/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF6EC', deep: '#F3EAD7' },
        plum: {
          50: '#F7F2FE', 100: '#EDE5FB', 200: '#D9C9F6', 300: '#BFA3EE', 400: '#9F78E3',
          500: '#7F4FD6', 600: '#6A3BBE', 700: '#552E9A', 800: '#3F2275', 900: '#2A1650',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
