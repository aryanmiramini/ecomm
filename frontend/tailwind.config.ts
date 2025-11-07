import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          burgundy: 'rgb(159, 31, 92)',
          'burgundy-light': 'rgb(105, 34, 71)',
          'dark-burgundy': 'rgb(65, 21, 39)',
        },
        accent: {
          pink: 'rgb(133, 30, 90)',
        },
        muted: {
          purple: 'rgb(97, 74, 104)',
          'purple-light': 'rgb(79, 61, 91)',
          mauve: 'rgb(122, 71, 105)',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
