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
        hapik: {
          red: '#dc2626',
          'red-light': '#fca5a5',
          'red-dark': '#991b1b',
        },
        climbing: {
          orange: '#ea580c',
          blue: '#0ea5e9',
          gray: '#374151',
        },
      },
    },
  },
  plugins: [],
}

export default config

