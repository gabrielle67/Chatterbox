/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.jsx",
    "./src/components/*.jsx",
    "./src/components/pages/*.jsx",
    "./src/components/ChatComponents/*.jsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

