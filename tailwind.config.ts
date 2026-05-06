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
        primary: {
          DEFAULT: "#FF5733",
          light: "#FFE8E3",
          mid: "#FF8C6E",
        },
        background: {
          DEFAULT: "#F4F5F7",
          card: "#FFFFFF",
        },
        text: {
          primary: "#1A1A2E",
          secondary: "#6B7280",
        },
        border: {
          DEFAULT: "#E5E7EB",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
          dark: "#065F46",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#92400E",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
          dark: "#991B1B",
        },
        accepted: {
          light: "#DBEAFE",
          dark: "#1E40AF",
        },
        sidebar: {
          bg: "#FFFFFF",
          active: "#FF5733",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        badge: "6px",
        modal: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        dropdown: "0 4px 16px rgba(0,0,0,0.10)",
        modal: "0 20px 60px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
