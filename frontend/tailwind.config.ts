import type { Config } from 'tailwindcss';
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [
    require('./tailwind-preset.js')
  ],
  theme: {
    fontFamily: {
      'sans': ['"Figtree"', ...defaultTheme.fontFamily.sans],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

