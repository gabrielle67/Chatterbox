/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.jsx",
    "./src/pages/*.jsx",
    "./src/context/*.jsx",
    "./src/components/*.jsx",
    "./src/components/chatPanels/*.jsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

