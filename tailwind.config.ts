import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0A",
        coal: "#141311",
        linen: "#F6F1E8",
        sand: "#D9C8AA",
        champagne: "#CBAF78",
        moss: "#77836B",
        clay: "#A36B4F",
        pearl: "#FFFDF8"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};

export default config;
