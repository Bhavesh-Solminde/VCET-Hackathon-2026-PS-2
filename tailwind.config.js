/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        amber: { DEFAULT: '#f59e0b', dim: 'rgba(245,158,11,0.12)' },
        surface: { DEFAULT: '#141414', raised: '#1c1c1c', high: '#242424' },
        border:  { DEFAULT: '#262626', dim: '#1c1c1c', bright: '#333' },
        ink:     { DEFAULT: '#efefef', secondary: '#888', dim: '#525252' },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateY(-6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
