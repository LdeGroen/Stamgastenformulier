/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Zorgt ervoor dat alle JS/JSX bestanden worden gescand
  ],
  theme: {
    extend: {
      colors: {
        'ctf-green': '#20747F', // De custom kleur van het festival
        'ctf-dark-green': '#1a5c66', // Een donkerdere variant voor hover-effecten
      },
      fontFamily: {
        // Optioneel: voeg hier je eigen lettertypes toe
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}