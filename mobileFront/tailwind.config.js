/** @type {import('tailwindcss').Config} */
import nativewindPreset from "nativewind/preset";

module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#000000",
          card: "#f0f0f0",
          placeholder: "#a0a0a0",
        },
        dark: {
          background: "#121212",
          text: "#ffffff",
          card: "#1e1e1e",
          placeholder: "#808080",
        },
      },
    },
  },
  plugins: [],
};
