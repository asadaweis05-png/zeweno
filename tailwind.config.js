/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/wordbuz/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, /* Disables Tailwind's global CSS reset to prevent overriding main site styles */
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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
        }
      }
    },
  },
  plugins: [],
}
