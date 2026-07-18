/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#2E1F16',     // Deep dark brown
          medium: '#4A2C2A',   // Auburn/Mahogany
          brand: '#8B5E3C',    // Bronze/Gold caramel
          light: '#C4A484',    // Light tan
          cream: '#F5F1EB',    // Cream/Soft beige
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
