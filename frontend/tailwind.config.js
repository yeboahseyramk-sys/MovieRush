/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#0F0B1E",
        cinebase: "#0A0715",
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
      backgroundImage: {
        "cinema-gradient":
          "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(124,92,252,0.22), transparent 60%), radial-gradient(ellipse 70% 60% at 85% 20%, rgba(236,72,153,0.16), transparent 60%), radial-gradient(ellipse 70% 70% at 50% 100%, rgba(99,60,180,0.20), transparent 60%), linear-gradient(160deg, #0A0715 0%, #140B2A 35%, #1B0F33 60%, #0D0818 100%)",
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(-90vh) translateX(20px)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        glowPulseSlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1) translateY(0)" },
          "50%": { opacity: "0.9", transform: "scale(1.05) translateY(-10px)" },
        },
        raysDrift: {
          "0%": { transform: "translateX(-3%) rotate(0deg)" },
          "100%": { transform: "translateX(3%) rotate(1deg)" },
        },
      },
      animation: {
        floatUp: "floatUp 14s linear infinite",
        glowPulse: "glowPulse 8s ease-in-out infinite",
        glowPulseSlow: "glowPulseSlow 12s ease-in-out infinite",
        raysDrift: "raysDrift 18s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
