/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        MIDNIGHT_BLUE: "#003366",
        PACIFIC_BLUE: "#0099CC",
        ANAKIWA: "#99CCFF",
        BAHAMA_BLUE: "#006699",
        MALIBU: "#66CCFF",
      },
    },
  },
  plugins: [],
};
