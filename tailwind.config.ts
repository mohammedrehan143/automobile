import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090B",
        foreground: "#F8FAFC",
        surface: {
          50: "#1A1D24",
          100: "#14171E",
          200: "#0F1116",
          300: "#0B0D11",
          DEFAULT: "#0F1116",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.07)",
          light: "rgba(255, 255, 255, 0.14)",
          glow: "rgba(245, 158, 11, 0.35)",
        },
        accent: {
          DEFAULT: "#F59E0B", // Precision Racing Amber
          hover: "#D97706",
          dark: "#B45309",
          muted: "rgba(245, 158, 11, 0.12)",
          glow: "rgba(245, 158, 11, 0.25)",
        },
        metallic: {
          silver: "#94A3B8",
          charcoal: "#1E222D",
          steel: "#334155",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "Courier New", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      backgroundImage: {
        "carbon-pattern": "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
