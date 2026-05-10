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
        primary: "#0058bc", // [cite: 2]
        secondary: "#526069", // [cite: 5]
        tertiary: "#006762", // [cite: 8]
        background: "#fcf8fb", // [cite: 9]
        "surface-container": "#f0edef", // [cite: 9]
        "on-surface-variant": "#414755", // [cite: 3]
        "outline-variant": "#c1c6d7", // [cite: 11]
      },
      spacing: {
        "margin-desktop": "32px", // [cite: 15]
        "margin-mobile": "16px", // [cite: 14]
        gutter: "24px", // [cite: 14]
      },
      fontFamily: {
        headline: ["var(--font-montserrat)", "sans-serif"], // [cite: 17]
        body: ["var(--font-inter)", "sans-serif"], // [cite: 16]
      },
      fontSize: {
        "headline-lg": ["40px", { lineHeight: "48px", fontWeight: "700" }], // [cite: 20]
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }], // [cite: 19]
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }], // [cite: 20]
      },
    },
  },
  plugins: [],
};
export default config;