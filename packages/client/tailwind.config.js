/* eslint-env node */
const animate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  safelist: ['dark'],
  prefix: '',

  content: [
    './pages/admin/**/*.{ts,tsx,vue}',
    './pages/survey/**/*.{ts,tsx,vue}',
    './components/admin/**/*.{ts,tsx,vue}',
    './components/survey/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
    './formkit.theme.ts',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        xxs: '0.625rem',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        priorb: {
          white: '#F4F5F8',
          gray: '#222326',

          50: '#f3f2ff',
          100: '#e9e8ff',
          200: '#d7d4ff',
          300: '#b9b2ff',
          400: '#8370ff',
          500: '#7455fd',
          600: '#6332f5',
          700: '#5420e1',
          800: '#471abd',
          900: '#3b189a',
          950: '#220c69',
          DEFAULT: '#7455fd',
          PRIMARY: '#7455fd',
          primary: '#7455fd',

          secondary: '#558AFD',
          SECONDARY: '#558AFD',
          secondaryLight: '#c5e2f2',

          tertiary: '#C855FD',
          TERTIARY: '#C855FD',

          errorLight: '#ffdfdd',
          successLight: '#D0EDDA',
          success: '#34BF59',
          warning: '#FFC107',
        },
        vGray: {
          100: '#F8F9FA',
          400: '#CFD7E2',
          600: '#8E99A7',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
    },
  },
  plugins: [animate],
};
