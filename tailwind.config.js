/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,svelte,js,ts}"],
  theme: {
    extend: {
      screens: {
        paper: {"max": "856px"},
        menu: {"max": "500px"}
      },
      width:{
        'margin': "624px"
      },
      boxShadow: {
        'in': "inset 0 0 0 1px rgba(0, 0, 0, 0.3)"
      },
      colors: {
        gray: {
          100: "#f2f2f2",
          200: "#a6a6a6",
          300: "808080"
        },
        blue: {
          900: "#536878",
          1000: "#E3ECF8"
        },
        black: {
          100: "rgba(25, 25, 25, 0.5)",
          200: "#000000"
        }
      }
    },
  },
  plugins: [],
}

