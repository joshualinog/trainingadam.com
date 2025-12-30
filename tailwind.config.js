export default {
  content: ["./src/**/*.{html,njk,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
