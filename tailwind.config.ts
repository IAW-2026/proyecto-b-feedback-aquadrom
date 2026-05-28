// tailwind.config.ts
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
        primary: "#0058bc", 
        secondary: "#526069", 
        tertiary: "#006762", 
        background: "#fcf8fb", 
        "surface-container": "#f0edef", 
        "on-surface-variant": "#414755",
        "outline-variant": "#c1c6d7", 
      },
      spacing: {
        "margin-desktop": "32px", 
        "margin-mobile": "16px", 
        gutter: "24px", 
      },
      fontFamily: {
        headline: ["var(--font-montserrat)", "sans-serif"], 
        body: ["var(--font-inter)", "sans-serif"], 
      },
      fontSize: {
        "headline-lg": ["40px", { lineHeight: "48px", fontWeight: "700" }], 
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }], 
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }], 
      },
    },
  },
  plugins: [],
};
export default config;