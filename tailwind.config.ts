import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-baloo)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        sky: {
          soft: "#BFE3F5",
          DEFAULT: "#7DC4E8",
          deep: "#3A9FD4",
          text: "#1A5F7A",
        },
        mint: {
          soft: "#B8EDD9",
          DEFAULT: "#5CC7A0",
          deep: "#3AAB82",
          text: "#0F5C3A",
        },
        cream: {
          DEFAULT: "#F8F6F0",
          warm: "#FFF3E0",
        },
        lavender: {
          soft: "#E8E0F8",
          DEFAULT: "#B8A8F0",
          deep: "#8E72DB",
          text: "#3D1F8A",
        },
        star: {
          DEFAULT: "#FFD93D",
          deep: "#FF922B",
        },
        calm: {
          50: "#F8F6F0",
          100: "#EDF5F9",
          200: "#D9EDF6",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "pop-in": "popIn 0.4s cubic-bezier(.18,1.4,.4,1)",
        "fade-up": "fadeUp 0.35s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "celebrate": "celebrate 0.6s cubic-bezier(.18,1.4,.4,1)",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        celebrate: {
          "0%": { transform: "scale(0.5) rotate(-10deg)", opacity: "0" },
          "70%": { transform: "scale(1.1) rotate(3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
