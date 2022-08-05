/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/**/*.html"],
  theme: {
    extend: {
      keyframes: {
        apparate: {
          "0%": { display: "none", opacity: 0 },
          "50%": { display: "block", opacity: 1 },
        },
      },
      screens: {
        dk: "900px",
      },
    },
  },
  plugins: [],
};
