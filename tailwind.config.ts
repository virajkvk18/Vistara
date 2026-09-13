import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#04060c",
          900: "#070a13",
          850: "#0a0e18",
          800: "#0e1422",
          700: "#16202f",
          600: "#1f2b3d",
        },
        accent: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
          dim: "#4f46e5",
          glow: "#a5b4fc",
        },
        emeraldgov: {
          DEFAULT: "#10b981",
          soft: "#34d399",
        },
        govgold: {
          DEFAULT: "#eab308",
          soft: "#facc15",
          deep: "#b45309",
        },
        risk: {
          low: "#34d399",
          med: "#fbbf24",
          high: "#f87171",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          strong: "rgba(255, 255, 255, 0.07)",
          line: "rgba(255, 255, 255, 0.09)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(99, 102, 241, 0.18)",
        "glow-gold": "0 0 24px rgba(234, 179, 8, 0.15)",
        card: "0 8px 40px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-accent":
          "radial-gradient(1200px 600px at 20% -10%, rgba(99,102,241,0.16), transparent 60%), radial-gradient(1000px 500px at 90% 0%, rgba(16,185,129,0.10), transparent 55%)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(248,113,113,0.55)" },
          "70%": { boxShadow: "0 0 0 10px rgba(248,113,113,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(248,113,113,0)" },
        },
        "scan-line": {
          "0%": { top: "0%", opacity: "0.9" },
          "100%": { top: "100%", opacity: "0" },
        },
        "cpu-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 3.5s linear infinite",
        "cpu-blink": "cpu-blink 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;