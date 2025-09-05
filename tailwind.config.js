/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],   // <- scan only src
  theme: {
    extend: {
      colors: {
        thunder: "#FFD600",
        moss: "#587a68",
        sage: "#94a3a8",
        sand: "#e7e5e4",
        fern: "#2f855a",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 20s) linear infinite",
      },
    },
  },
  plugins: [],
};
