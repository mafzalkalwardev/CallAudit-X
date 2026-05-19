import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#1e293b",
        background: "#05070F",
        foreground: "#F8FAFC",
        muted: "#94A3B8",
        soft: "#CBD5E1",
        app: "#05070F",
        section: "#08111F",
        card: "#0D1628",
        elevated: "#111C33",
        primary: "#38BDF8",
        secondary: "#6366F1",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.16)",
        card: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "card-lg": "0 12px 40px rgba(0, 0, 0, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
