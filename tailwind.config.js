/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'brand': ["Inter Tight", "Inter", "system-ui", "sans-serif"],
        'display': ["Space Grotesk", "Inter Tight", "sans-serif"],
        'heading': ["Space Grotesk", "Inter Tight", "sans-serif"],
        'body': ["Inter", "system-ui", "sans-serif"],
        'mono': ["JetBrains Mono", "Consolas", "monospace"],
        'accent': ["Bebas Neue", "Space Grotesk", "sans-serif"],
      },
      colors: {
        neon: "#a3e635",
        purpleMain: "#7c3aed",
        darkBg: "#0d0d0d",
      },
      transitionDuration: {
        '400': '400ms',
        '800': '800ms',
      }
    },
  },
  plugins: [],
}