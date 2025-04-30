module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scans JS/JSX/TS/TSX files in src
    "./public/**/*.html"  // Scans HTML files in public (if you have custom ones)
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
