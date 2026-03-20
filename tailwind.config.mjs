/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface:    'rgb(var(--color-surface) / <alpha-value>)',
        card:       'rgb(var(--color-card) / <alpha-value>)',
        border:     'rgb(var(--color-border) / <alpha-value>)',
        cream: {
          100: 'rgb(var(--color-text-100) / <alpha-value>)',
          200: 'rgb(var(--color-text-200) / <alpha-value>)',
          300: 'rgb(var(--color-text-300) / <alpha-value>)',
          400: 'rgb(var(--color-text-400) / <alpha-value>)',
        },
        amber: {
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
