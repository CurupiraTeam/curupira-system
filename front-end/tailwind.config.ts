import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 80px rgba(16, 185, 129, 0.25)'
      },
      backgroundImage: {
        'forest-radial': 'radial-gradient(circle at top left, rgba(34,197,94,0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(20,184,166,0.18), transparent 30%)'
      }
    }
  },
  plugins: []
};

export default config;
