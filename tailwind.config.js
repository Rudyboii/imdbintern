/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {navyBlue: "#1e2a47",
      "navyBlue-light": "#28365a",boxShadow: {
        glow: '0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.4)',
  },
  plugins: [require('tailwindcss-textshadow'),],
}


}}