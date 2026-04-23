import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      colors: {
        torii: {
          50:  "#fff1f1",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#ff6363",
          500: "#f83232",
          600: "#e51414",
          700: "#c10b0b",
          800: "#9f0d0d",
          900: "#841212",
        },
        yama: {
          teal:  "#1E6FA3",
          light: "#56B0D0",
          sage:  "#6DB46D",
          dark:  "#154D73",
        },
        forest: {
          deep: "#0F1A0C",
          mid:  "#1A2E1C",
          warm: "#0E1B0B",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
