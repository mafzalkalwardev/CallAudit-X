import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(217 24% 18%)",
        background: "#050812",
        foreground: "#f8fafc",
        muted: "#94a3b8",
        cyanx: "#22d3ee",
        violetx: "#8b5cf6"
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
