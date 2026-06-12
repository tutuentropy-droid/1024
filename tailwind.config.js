/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
    extend: {
      colors: {
        paper: {
          50: '#FBF8F1',
          100: '#F5F0E6',
          200: '#E8DFCE',
          300: '#D9CBB2',
          400: '#C7B594',
        },
        ink: {
          50: '#F5F5F5',
          100: '#8B8680',
          200: '#5C5A56',
          300: '#2C2C2C',
          400: '#1A1A1A',
        },
        cinnabar: {
          50: '#FDF2F4',
          100: '#F9D6DC',
          200: '#E89AA6',
          300: '#C41E3A',
          400: '#9B172E',
        },
        cobalt: {
          50: '#F0F5FA',
          100: '#C9D9E8',
          200: '#6B95BC',
          300: '#2B5C8A',
          400: '#1E4263',
        },
        jade: {
          50: '#F1F9F4',
          100: '#CCE8D6',
          200: '#7BC49A',
          300: '#2E8B57',
          400: '#226841',
        },
        gold: {
          50: '#FFF9F0',
          100: '#FFE8C9',
          200: '#FFC97D',
          300: '#DAA520',
          400: '#AD841A',
        },
      },
      fontFamily: {
        'display': ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', 'serif'],
        'serif': ['"Noto Serif SC"', 'SimSun', 'serif'],
        'kai': ['"STKaiti"', '"KaiTi"', 'serif'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.03\"/%3E%3C/svg%3E')",
        'ink-wash': "linear-gradient(135deg, rgba(44,44,44,0.02) 0%, rgba(44,44,44,0.05) 50%, rgba(44,44,44,0.02) 100%)",
      },
      boxShadow: {
        'scroll': '0 4px 20px rgba(44, 44, 44, 0.1), 0 2px 8px rgba(44, 44, 44, 0.08)',
        'card': '0 8px 30px rgba(44, 44, 44, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'stamp': '0 0 0 3px #C41E3A, 0 4px 12px rgba(196, 30, 58, 0.3)',
      },
      keyframes: {
        'scroll-reveal': {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(46, 139, 87, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(46, 139, 87, 0.8)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'scroll-reveal': 'scroll-reveal 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'glow': 'glow 1.5s ease-in-out infinite',
        'draw-line': 'draw-line 2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
