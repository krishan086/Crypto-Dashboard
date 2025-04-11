module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    darkMode: 'class', // or 'media' depending on your preference
    theme: {
      extend: {
        borderColor: {
          DEFAULT: 'var(--border)' // Makes default border use your variable
        }
      }
    },
    plugins: [],
  }