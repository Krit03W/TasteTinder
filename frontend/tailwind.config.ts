import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // design.md color tokens
        surface: '#fbfaee',
        'surface-dim': '#dbdbcf',
        'surface-bright': '#fbfaee',
        'surface-lowest': '#ffffff',
        'surface-low': '#f5f4e8',
        'surface-container': '#efeee3',
        'surface-high': '#e9e9dd',
        'surface-highest': '#e4e3d7',
        'on-surface': '#1b1c15',
        'on-surface-variant': '#57423b',
        'inverse-surface': '#303129',
        outline: '#8b7169',
        'outline-variant': '#dec0b6',
        primary: '#a43c12',
        'on-primary': '#ffffff',
        'primary-container': '#ff7f50',
        'on-primary-container': '#6c2000',
        'inverse-primary': '#ffb59c',
        secondary: '#904d00',
        'on-secondary': '#ffffff',
        'secondary-container': '#fd8b00',
        'on-secondary-container': '#603100',
        tertiary: '#62603d',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#a9a57d',
        'on-tertiary-container': '#3d3b1c',
        error: '#ba1a1a',
        'primary-fixed': '#ffdbcf',
        'primary-fixed-dim': '#ffb59c',
        'secondary-fixed': '#ffdcc3',
        'tertiary-fixed': '#e9e4b8',
        'tertiary-fixed-dim': '#ccc89e',
        'on-tertiary-fixed': '#1e1c03',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.5rem',
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '12px',
        md: '24px',
        lg: '40px',
        xl: '64px',
      },
      boxShadow: {
        card: '0 8px 40px -4px rgba(164,60,18,0.12), 0 2px 8px -2px rgba(164,60,18,0.08)',
        'card-float': '0 20px 60px -8px rgba(164,60,18,0.18), 0 8px 24px -4px rgba(164,60,18,0.10)',
        btn: '0 4px 20px -2px rgba(164,60,18,0.30)',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
