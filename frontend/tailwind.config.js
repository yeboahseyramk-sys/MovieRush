/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#0F0B1E",
        surface: "#1A1530",
        surface2: "#221C3E",
        accent: {
          DEFAULT: "#7C5CFC",
          light: "#A78BFA",
          pink: "#EC4899",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
