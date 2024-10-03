/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["poppins", "sans-serif"],
        sans2: ["roboto", "sans-serif"],
        serif3: ["Kreon", "serif"],
      },
      colors: {
        bleu: "#21a2d9",
        bleu2: "#088acc",
        bleu3: "#4B28F0",
        bleu4: "#2f4858",
        orange: "#F0701E",
        orange2: "#b44084",
        orange3: "#FE8E3C",
        orange4: "#F19F62",
      },
      screens: {
        sm: "640px",

        md: "768px",
        md2: "832px",
        lg: "1024px",

        xl: "1300px",

        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
