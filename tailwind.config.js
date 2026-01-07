export default {
  content: ["./src/**/*.{html,njk,js}"],
  safelist: ['bg-seagrass-700'],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
      },
      fontFamily: {
        sans: ["Rubik", "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ["Gaegu", "cursive"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
