import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        linen: "#F7F1E9",
        bone: "#EFE4D6",
        oat: "#D9C7B2",
        cedar: "#9A7B5D",
        ink: "#282522",
        smoke: "#66615B"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 22px 60px rgba(42, 37, 32, 0.08)"
      },
      animation: {
        "float-slow": "floatSlow 4s ease-in-out infinite",
        marquee: "marquee 25s linear infinite"
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
