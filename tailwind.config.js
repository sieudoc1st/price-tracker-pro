/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a202c',    // Dark background
        secondary: '#2d3748',  // Lighter card background
        accent: '#4299e1',     // Blue for buttons and highlights
        border: '#4a5568',     // Border color
        muted: '#a0aec0',      // Muted text color for labels/placeholders
      }
    },
  },
  plugins: [],
}
