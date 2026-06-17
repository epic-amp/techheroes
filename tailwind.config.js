/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF7A00', 50: '#FFF4E6', 100: '#FFE4C4', 200: '#FFC98A', 300: '#FFAE50', 400: '#FF7A00', 500: '#E66E00', 600: '#CC6200' },
        offwhite: '#F8F6F2', dark: { DEFAULT: '#121212', 100: '#1E1E1E', 200: '#2D2D2D', 300: '#3D3D3D' }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], arabic: ['Noto Sans Arabic','system-ui','sans-serif'] }
    }
  },
  plugins: []
}