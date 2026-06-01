/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  'hsl(120,24%,96%)',
          100: 'hsl(120,24%,90%)',
          200: 'hsl(120,24%,78%)',
          300: 'hsl(120,24%,62%)',
          400: 'hsl(120,24%,48%)',
          500: 'hsl(120,24%,38%)',
          600: '#3A5F3A',
          700: 'hsl(120,24%,24%)',
          800: 'hsl(120,24%,18%)',
          900: 'hsl(120,24%,12%)',
          950: 'hsl(120,24%,8%)',
        },
        accent: {
          50:  'hsl(37,80%,96%)',
          100: 'hsl(37,80%,90%)',
          200: 'hsl(37,70%,78%)',
          300: 'hsl(37,68%,64%)',
          400: 'hsl(37,67%,56%)',
          500: '#D4922A',
          600: 'hsl(37,67%,42%)',
          700: 'hsl(37,67%,32%)',
        },
        surface: {
          DEFAULT: '#FAFAF7',
          muted: 'hsl(60,10%,96%)',
          subtle: 'hsl(60,6%,92%)',
        },
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        '2xl': '12px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        card: '0 2px 8px 0 rgb(0 0 0 / 0.06)',
        hover: '0 4px 16px 0 rgb(0 0 0 / 0.10)',
      },
      animation: {
        'fade-in': 'fadeIn 0.18s ease-out',
        'slide-up': 'slideUp 0.22s ease-out',
        'slide-down': 'slideDown 0.22s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
