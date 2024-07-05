/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        verde: '#0a8342',
        primary: '#0a8342',
        secondary: {
          100: '#0a8342',
          200: '#0a8342',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

