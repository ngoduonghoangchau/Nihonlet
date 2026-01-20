/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lemonada: ["Lemonada", "cursive"],
        literata: ["Literata", "serif"],
        lalezar: ["Lalezar", "system-ui"],
      },
    },
  },
  plugins: [],
};
