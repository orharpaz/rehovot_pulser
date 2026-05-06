import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#F5C800',
          black: '#1A1A1A',
          red: '#D42B3A',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        hebrew: ['var(--font-rubik)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
