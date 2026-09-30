/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kmutnb: {
          red: '#990000',
          darkred: '#660000',
          orange: '#e65100',
          light: '#fdfbfb',
        }
      }
    },
  },
  plugins: [],
}
