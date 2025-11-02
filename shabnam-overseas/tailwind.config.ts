// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDFC',
        navy: '#2E415C',
        brown: '#742402',
        beige: '#A49D83',
        sand: '#E6D5B8',
      },
    },
  },
  plugins: [],
}
export default config
