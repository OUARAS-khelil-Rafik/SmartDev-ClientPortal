/** @type {import('tailwindcss').Config} */
module.exports = {
  // Only scan project source files — avoid broad globs that may match node_modules
  content: [
    './public/index.html',
    './src/index.tsx',
    './src/App.tsx',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/services/**/*.{ts,tsx,js,jsx}',
    './src/*.{ts,tsx,js,jsx,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        blob: 'blob 7s infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    }
  },
  plugins: [],
}
