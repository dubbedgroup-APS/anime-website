/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#060e20",
        "surface-container": "#0f1930",
        "surface-container-high": "#141f38",
        "surface-container-highest": "#192540",
        "surface-container-low": "#091328",
        "surface-variant": "#192540",
        primary: "#cc97ff",
        "primary-dim": "#9c48ea",
        secondary: "#699cff",
        "on-surface": "#dee5ff",
        "on-surface-variant": "#a3aac4",
        "on-primary-fixed": "#000000",
        "outline-variant": "#40485d",
        outline: "#6d758c",
        accent: "#5eead4",
        coral: "#fb7185",
        sun: "#fbbf24",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(156, 72, 234, 0.18)",
        halo: "0 0 32px rgba(156, 72, 234, 0.12)",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};