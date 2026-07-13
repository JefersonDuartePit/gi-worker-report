import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '!./src/ref/**'],
  theme: {
    extend: {
      colors: {
        gi: {
          navy:      '#00145A',
          blue:      '#1D57FB',
          text:      '#666666',
          dark:      '#1E1E1E',
          charcoal:  '#4B4C4D',
          white:     '#FFFFFF',
          light:     '#EFEFEF',
          muted:     '#E6E9EA',
          border:    '#DBDBDB',
          red:       '#C10731',
          green:     '#49B100',
          amber:     '#FFC300',
          orange:    '#EB6608',
          steel:     '#4E7EB1',
          // Galaxy palette
          space:     '#000820',
          stardust:  '#8899cc',
          nebula:    '#7799bb',
          comet:     '#aaccff',
          crater:    '#445566',
          orbit:     '#3355aa',
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'galaxy-header': 'linear-gradient(to bottom, rgba(0, 8, 32, 0.67), transparent)',
      },
    },
  },
  plugins: [],
} satisfies Config
