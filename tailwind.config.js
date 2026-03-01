/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Bricolage Grotesque', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EEF3FF',
          100: '#D0DFFF',
          500: '#1A6BFF',
          600: '#1558E0',
        },
        surface: {
          DEFAULT: '#FAFAF8',
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1A1814',
          muted:   '#6B6560',
          faint:   '#A8A39C',
        },
        border: {
          DEFAULT: '#E8E4DC',
          strong:  '#D8D3C8',
        },
        bg: '#F4F2EE',
        success: '#00B574',
        warn:    '#FF6B2B',
        danger:  '#FF3B5C',
        star:    '#FFB800',
      },
      borderRadius: {
        card: '18px',
        xl2: '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        hover: '0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}