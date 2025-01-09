/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'whiskey-gold': '#D4AF37',
        'whiskey-amber': '#B7410E',
        'whiskey-dark': '#2C1810'
      },
      fontFamily: {
        'whiskey': ['Garamond', 'serif']
      }
    },
  },
  plugins: [],
}