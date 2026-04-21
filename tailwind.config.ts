import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E77222",
          green: "#74E721",
          blue: "#73BDFA",
          purple: "#D422E7",
        },
        surface: {
          bg: "#F2F2F7",
          card: "#FFFFFF",
          border: "#D1D1D6",
          muted: "#8E8E93",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        mac: "12px",
        "mac-lg": "18px",
      },
      boxShadow: {
        mac: "0 2px 8px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
        "mac-md": "0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
        "mac-lg": "0 8px 32px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
