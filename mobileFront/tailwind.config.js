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
    extend: {},
  },
  plugins: [],
};
