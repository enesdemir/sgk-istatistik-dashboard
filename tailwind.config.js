/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Tema değişkenleri — RGB tuple, <alpha-value> ile opacity'e açık
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          subtle: 'rgb(var(--bg-subtle) / <alpha-value>)',
          surface: 'rgb(var(--bg-surface) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        },
        // border: opacity önceden baked (alfa modifier'a gerek yok).
        // Tek bir CSS var üzerinden iki tema (light dark slate, dark slate light) uyumlu hale gelir.
        border: {
          DEFAULT: 'rgb(var(--border) / 0.10)',
          strong: 'rgb(var(--border-strong) / 0.22)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          dim: 'rgb(var(--ink-dim) / <alpha-value>)',
        },
        // Brand & signal — her iki temada sabit (vurgu rengi)
        // SGK kurumsal mavi skalası
        brand: {
          50: '#e6f1fa',
          100: '#bfd9f0',
          200: '#94bee2',
          300: '#5b9dcf',
          400: '#2b7ebd',
          500: '#0066B3',
          600: '#00529F',
          700: '#003f7a',
          800: '#002b55',
          900: '#001a31',
        },
        signal: {
          ok: 'rgb(var(--signal-ok) / <alpha-value>)',
          okDim: 'rgb(var(--signal-ok) / 0.12)',
          warn: 'rgb(var(--signal-warn) / <alpha-value>)',
          warnDim: 'rgb(var(--signal-warn) / 0.12)',
          bad: 'rgb(var(--signal-bad) / <alpha-value>)',
          badDim: 'rgb(var(--signal-bad) / 0.12)',
          info: 'rgb(var(--signal-info) / <alpha-value>)',
          infoDim: 'rgb(var(--signal-info) / 0.12)',
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)',
        sheen:
          'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        tick: 'tick 0.4s ease-out',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.9' },
          '80%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tick: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
