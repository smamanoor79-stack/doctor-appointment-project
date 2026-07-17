/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A4D42',       // dark teal (hero, headings, strong CTAs)
        primaryLight: '#5C8A7C',  // sage green (medium sections)
        primaryPale: '#A8C4B8',   // pale sage (lighter than primaryLight)
        primarySoft: '#DCEAE5',   // very light mint (subtle backgrounds/cards)
        accent: '#E8927C',        // coral/peach (buttons, highlights)
        accentDark: '#D97B62',    // darker coral (hover states)
        dark: '#1E293B',          // text
        light: '#FDF9F6',         // warm off-white backgrounds
      },
    },
  },
  plugins: [],
};