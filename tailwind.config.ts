import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#04080F', // deep navy-black base
          900: '#050A14',
          800: '#0A1428',
          700: '#0F1E3D',
          600: '#162B5C',
        },
        // Base brand palette — names kept for backwards compatibility
        neon: '#0052FF', // Base blue (was neon green)
        'neon-dim': '#001E66', // dark base blue
        gold: '#60A5FA', // light blue accent (was gold)
        'gold-deep': '#1E40AF',
        electric: '#2563FF', // bright Base blue
        danger: '#FF5C7A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'neon-glow': '0 0 0 1px rgba(0,82,255,0.35), 0 0 40px -8px rgba(0,82,255,0.55)',
        'gold-glow': '0 0 0 1px rgba(96,165,250,0.35), 0 0 50px -10px rgba(96,165,250,0.5)',
        'vault': '0 30px 80px -20px rgba(0,82,255,0.45), inset 0 0 60px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(0,82,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,255,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(8deg)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.6', filter: 'blur(28px)' },
          '50%': { opacity: '1', filter: 'blur(40px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rise: {
          from: { transform: 'translateY(110vh)', opacity: '0' },
          '10%': { opacity: '1' },
          to: { transform: 'translateY(-12vh)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
