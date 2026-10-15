/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kiosk: {
          blue: '#1e40af',
          lightBlue: '#eff6ff',
          green: '#059669',
          amber: '#d97706',
          red: '#dc2626',
          ayush: '#047857'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
