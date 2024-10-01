/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#7F3DFF",
        secondaryGreen: "#00A86B",
        secondaryRed: "#FD3C4A",
        secondaryBlue: "#0077FF",
        base: "#91919F",
        selectText: "#FCAC12",
        selectTextHover: "#FCEED4",
        primaryHover: "#541ac4",
      },
      fontFamily: {
        roboto: ["roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
