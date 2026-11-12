/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080511',
        card: '#120A24',
        cardBorder: '#2E1854',
        neonPurple: '#A855F7',
        neonViolet: '#8B5CF6',
        neonPink: '#EC4899',
        neonCyan: '#06B6D4',
        darkSurface: '#160E30',
        glassBorder: 'rgba(168, 85, 247, 0.25)'
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        'neon-pink': '0 0 25px -5px rgba(236, 72, 153, 0.45)',
        'glass': '0 8px 32px 0 rgba(11, 7, 24, 0.65)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
