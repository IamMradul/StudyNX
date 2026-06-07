import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'Clash Display', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#050508',
        'electric-violet': '#7C3AED',
        'neon-cyan': '#06B6D4',
        'neon-indigo': '#4F46E5',
      },
      backdropBlur: {
        xs: '2px',
        xl: '24px',
        '2xl': '40px',
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(124,58,237,0.3)',
        'glow-cyan': '0 0 40px rgba(6,182,212,0.3)',
        'glow-emerald': '0 0 40px rgba(16,185,129,0.3)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 5s ease infinite',
      }
    },
  },
  plugins: [],
} satisfies Config
