import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gi: {
          navy:     '#00145A',
          blue:     '#1D57FB',
          text:     '#666666',
          dark:     '#1E1E1E',
          charcoal: '#4B4C4D',
          white:    '#FFFFFF',
          light:    '#EFEFEF',
          muted:    '#E6E9EA',
          border:   '#DBDBDB',
          red:      '#C10731',
          green:    '#49B100',
          amber:    '#FFC300',
          orange:   '#EB6608',
          steel:    '#4E7EB1',
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
