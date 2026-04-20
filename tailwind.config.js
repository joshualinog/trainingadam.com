export default {
  content: ["./src/**/*.{html,njk,js}"],
  safelist: [
    { pattern: /bg-(golden-pollen|blazing-flame|burnt-peach|olive-bark|seagrass|night-bordeaux|cotton-candy|mauve-shadow|sunshine|glowyellowgreen)-\d{2,3}/ },
  ],
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
