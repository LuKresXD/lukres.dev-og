import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'leaguespartan': ['League Spartan', 'sans-serif'],
        'display': ['var(--font-display)', 'sans-serif'],
        'sans': ['var(--font-sans)', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      colors: {
        text: '#ffffff',
        background: '#0a0a0a',
        primary: '#111111',
        secondary: '#1F1F1F',
        accent: '#333333',
        // ledger palette
        ink: '#0A0C0A',
        panel: '#111511',
        paper: '#E6EDE6',
        mut: '#93A093',
        faint: '#7E8B7E',
        line: 'rgba(230,237,230,0.13)',
        phos: '#3BE97B',
      },
      borderWidth: {
        1: '1px',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-20deg)' },
          '75%': { transform: 'rotate(20deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'wave': 'wave 0.8s linear',
        'blink': 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
};
export default config;
