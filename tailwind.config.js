/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-in": "slideInFromSide 0.5s ease-out forwards",
        "float-up-down": "floatUpDown 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
