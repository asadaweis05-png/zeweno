/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/wordbuz/**/*.{js,ts,jsx,tsx}",
    "./src/gamezeweno/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],
  corePlugins: {
    preflight: false, /* Disables Tailwind's global CSS reset to prevent overriding main site styles */
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        gaming: ['Orbitron', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
        ui: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', /* Professional Teal */
          600: '#0d9488',
          900: '#134e4a',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
          muted: '#f8fafc',
          darkMuted: '#1e293b'
        },
        // Gamezeweno custom colors
        'neon-blue': '#00CFFF',
        'neon-purple': '#7A5CFF',
        'neon-green': '#00FF99',
        'dark-bg': '#0A0A0A',
        'card-bg': '#151515',
        'card-border': '#1E1E1E',
        'surface-game': '#111111',
        'surface-2': '#1A1A1A',
        'text-primary': '#F0F0F0',
        'text-secondary': '#A0A0A0',
        'text-muted': '#606060',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #00CFFF, 0 0 20px #00CFFF40' },
          '50%': { boxShadow: '0 0 15px #00CFFF, 0 0 40px #00CFFF60, 0 0 80px #00CFFF20' },
        },
        'glow-purple': {
          '0%, 100%': { boxShadow: '0 0 5px #7A5CFF, 0 0 20px #7A5CFF40' },
          '50%': { boxShadow: '0 0 15px #7A5CFF, 0 0 40px #7A5CFF60' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.7' },
          '94%': { opacity: '1' },
          '95%': { opacity: '0.8' },
          '96%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'particle-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0.6' },
          '33%': { transform: 'translate(30px, -40px) scale(1.2)', opacity: '0.9' },
          '66%': { transform: 'translate(-20px, -80px) scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'translate(10px, -120px) scale(0.3)', opacity: '0' },
        },
        'count-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: '#00CFFF40' },
          '50%': { borderColor: '#00CFFF' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-purple': 'glow-purple 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'neon-flicker': 'neon-flicker 4s step-end infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'particle-drift': 'particle-drift 4s ease-out infinite',
        'count-up': 'count-up 0.4s ease-out forwards',
        'border-glow': 'border-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gaming-grid': "linear-gradient(rgba(0,207,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,0.03) 1px, transparent 1px)",
        'neon-gradient': 'linear-gradient(135deg, #00CFFF, #7A5CFF)',
        'card-gradient': 'linear-gradient(135deg, #151515, #111111)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00CFFF60, 0 0 30px #00CFFF20',
        'neon-purple': '0 0 10px #7A5CFF60, 0 0 30px #7A5CFF20',
        'neon-green': '0 0 10px #00FF9960, 0 0 30px #00FF9920',
        'card': '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 40px rgba(0,207,255,0.15), 0 4px 24px rgba(0,0,0,0.8)',
      },
    },
  },
  safelist: [{ pattern: /.*/ }],

}
