/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand + accent colors from the new UI
        primary: '#1173d4',
        'accent-purple': '#8b5cf6',

        // Backgrounds
        'background-light': '#f6f7f8',
        'background-dark': '#0f172a',

        // Surfaces
        'surface-dark': '#1e293b',
        'surface-light': '#ffffff',
        'surface-lighter': '#283039',

        // Borders
        'border-dark': '#2d3748',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at 50% 50%, rgba(17, 115, 212, 0.15) 0%, rgba(15, 23, 42, 0) 50%)',
        'card-gradient':
          'linear-gradient(145deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
