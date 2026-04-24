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
        serif: ["var(--font-lora)", "Georgia", "serif"],
        jp: ["var(--font-shippori)", "serif"],
      },
      colors: {
        accent: {
          50:  "#faf6ef",
          100: "#efe4d1",
          200: "#d9c5a4",
          300: "#c1a57c",
          400: "#a08865",
          500: "#8a6d4a",
          600: "#6e563a",
          700: "#5a4530",
          800: "#443427",
          900: "#2e231a",
        },
        sumac: {
          500: "#9a3e3a",
          600: "#7d2f2c",
        },
        cedar: {
          deep: "#1a241c",
          mid:  "#2d3a2e",
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
