/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
      colors: {
        border: 'var(--color-border)', // gold-opacity-20
        input: 'var(--color-input)', // gray-800
        ring: 'var(--color-ring)', // yellow-400
        background: 'var(--color-background)', // gray-950
        foreground: 'var(--color-foreground)', // white
        primary: {
          DEFAULT: 'var(--color-primary)', // green-500
          foreground: 'var(--color-primary-foreground)', // black
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // gray-900
          foreground: 'var(--color-secondary-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-800
          foreground: 'var(--color-muted-foreground)', // gray-400
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // yellow-400
          foreground: 'var(--color-accent-foreground)', // black
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // gray-800
          foreground: 'var(--color-popover-foreground)', // gray-100
        },
        card: {
          DEFAULT: 'var(--color-card)', // gray-800
          foreground: 'var(--color-card-foreground)', // gray-100
        },
        success: {
          DEFAULT: 'var(--color-success)', // green-400
          foreground: 'var(--color-success-foreground)', // black
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // orange-500
          foreground: 'var(--color-warning-foreground)', // black
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)', // white
        },
        'text-primary': 'var(--color-text-primary)', // white
        'text-secondary': 'var(--color-text-secondary)', // gray-400
        'surface-elevated-1': 'var(--color-surface-elevated-1)', // gray-800
        'surface-elevated-2': 'var(--color-surface-elevated-2)', // gray-700
        'surface-elevated-3': 'var(--color-surface-elevated-3)', // gray-600
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      boxShadow: {
        'warm-sm': '0 2px 4px rgba(255, 215, 0, 0.1)',
        warm: '0 4px 6px rgba(255, 215, 0, 0.1)',
        'warm-md': '0 6px 12px rgba(255, 215, 0, 0.1)',
        'warm-lg': '0 12px 24px rgba(255, 215, 0, 0.15)',
        'warm-xl': '0 24px 48px rgba(255, 215, 0, 0.2)',
        'warm-2xl': '0 32px 64px -12px rgba(255, 215, 0, 0.25)',
        'glow-accent': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-primary': '0 0 20px rgba(0, 217, 36, 0.3)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
