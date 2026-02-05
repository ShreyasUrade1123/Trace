import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F0F12",
        sidebar: "#08080A",
        card: "#18181B",
        cardHover: "#1E1E24",
        landing: {
          bg: "#ffffff",
          text: "#000000",
          accent: "#2D2D2D", // Dark grey for strong elements
          muted: "#F5F5F5",  // Light grey for backgrounds/pills
        },
        border: "#27272A",
        brand: {
          start: "#EC4899",
          end: "#8B5CF6",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        iki: ['IkiMono', 'sans-serif'],
        ikiLight: ['IkiMonoLight', 'sans-serif'],
        ikiThin: ['IkiMonoThin', 'sans-serif'],
        ikiExpandedThin: ['IkiMonoExpandedThin', 'sans-serif'],
        ikiExpandedLight: ['IkiMonoExpandedLight', 'sans-serif'],
        ikiCompressedThin: ['IkiMonoCompressedThin', 'sans-serif'],
        ikiCondensedLight: ['IkiMonoCondensedLight', 'sans-serif'],
        ikiCondensedThin: ['IkiMonoCondensedThin', 'sans-serif'],
        ppneue: ['PPNeueMontreal', 'sans-serif'],
        ppneueBook: ['PPNeueMontrealBook', 'sans-serif'],
        ppneueMedium: ['PPNeueMontrealMedium', 'sans-serif'],
        ppneueBold: ['PPNeueMontrealBold', 'sans-serif'],
        movatif: ['MovatifRegular', 'sans-serif'],
        movatifBook: ['MovatifBook', 'sans-serif'],
        movatifLight: ['MovatifLight', 'sans-serif'],
        movatifUltraLight: ['MovatifUltraLight', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        coolvetica: ['Coolvetica', 'sans-serif'],
        neueHaas: ['Neue Haas Grotesk Display Pro', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
