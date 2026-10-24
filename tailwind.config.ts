import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        madrasah: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        arabic: ["Traditional Arabic", "Amiri", "Scheherazade New", "serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(22, 101, 52, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        cardHover: "0 12px 30px -4px rgba(22, 101, 52, 0.16), 0 4px 10px -2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
