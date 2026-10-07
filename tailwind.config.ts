import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        berry: '#A8325E',
        berrydark: '#87244A',
        blush: '#FCE4EA',
        cream: '#FFF9F8',
        mint: '#DFF1E6',
        teal: '#1F6B70',
        ink: '#27151C',
        gold: '#D2A445',
        muted: '#6B5B5E',
        success: '#2F6B4F',
        whatsapp: '#1FAF54',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      fontSize: {
        micro: ['0.5rem', { lineHeight: '0.75rem' }],
        // Sizes come from CSS variables in index.css: phones get larger small text and smaller headings.
        xs: ['var(--text-xs)', { lineHeight: '1.4' }],
        sm: ['var(--text-sm)', { lineHeight: '1.45' }],
        eyebrow: ['var(--text-eyebrow)', { lineHeight: '1rem', letterSpacing: '0.22em' }],
        hero: ['var(--text-hero)', { lineHeight: '1.1' }],
        h2: ['var(--text-h2)', { lineHeight: '1.15' }],
        stat: ['clamp(3.25rem, 5vw, 4.25rem)', { lineHeight: '1' }],
      },
      spacing: {
        header: '4.75rem',
        'header-sm': '3.75rem',
        section: 'clamp(2.75rem, 4.5vw, 4rem)',
        badge: '8.5rem',
        'action-bar': '4rem',
      },
      inset: {
        '2/5': '40%',
      },
      maxHeight: {
        modal: '92dvh',
      },
      maxWidth: {
        '2/3': '66.666%',
        site: '77.5rem',
        drawer: '20rem',
        modal: '34rem',
      },
      aspectRatio: {
        photo: '4 / 3',
        guide: '8 / 5',
        banner: '2 / 1',
        portrait: '3 / 4',
      },
      borderRadius: {
        card: '0.875rem',
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgb(28 20 22 / 0.12)',
        lift: '0 20px 44px -18px rgb(168 50 94 / 0.3)',
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.14) translate(-2%, -2%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 28s linear infinite',
        kenburns: 'kenburns 22s ease-in-out infinite alternate',
        shimmer: 'shimmer 1.1s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
