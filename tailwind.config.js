export default {
  content: ["./src/**/*.{html,njk,js}"],
  safelist: [
    { pattern: /bg-(golden-pollen|blazing-flame|burnt-peach|olive-bark|seagrass|night-bordeaux|cotton-candy|mauve-shadow|sunshine|glowyellowgreen|forest-moss)-\d{2,3}/ },
    { pattern: /text-(golden-pollen|blazing-flame|burnt-peach|olive-bark|seagrass|night-bordeaux|cotton-candy|mauve-shadow|sunshine|glowyellowgreen|forest-moss)-\d{2,3}/ },
  ],
  theme: {
    extend: {
      colors: {
        'forest-moss': {
          50: '#f7faeb',
          100: '#ebf3d4',
          200: '#d9e8ae',
          300: '#bfd87e',
          400: '#a4c556',
          500: '#86aa38',
          600: '#5e7a25',
          700: '#506823',
          800: '#415321',
          900: '#384720',
          950: '#1c260d',
        },
      },
      screens: {
        'xs': '320px',
        'ml': '960px',
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
