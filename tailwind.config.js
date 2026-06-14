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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
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
          '0%': { strokeDashoffset: '2000' },
          '100%': { strokeDashoffset: '0' },
        },
        'marker-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
            r: '4',
          },
          '50%': {
            transform: 'scale(1.4)',
            opacity: '0.7',
            r: '6',
          },
        },
        'marker-ripple': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0.8',
            r: '6',
          },
          '100%': {
            transform: 'scale(2.5)',
            opacity: '0',
            r: '15',
          },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'bounce-in': {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.08)',
          },
          '70%': {
            transform: 'scale(0.92)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'score-pop': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'card-hover': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1deg)' },
        },
      },
      animation: {
        'scroll-reveal': 'scroll-reveal 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.6s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'glow': 'glow 1.5s ease-in-out infinite',
        'draw-line': 'draw-line 2.5s ease-out forwards',
        'draw-line-slow': 'draw-line 4s ease-out forwards',
        'marker-pulse': 'marker-pulse 2s ease-in-out infinite',
        'marker-ripple': 'marker-ripple 2s ease-out infinite',
        'wave': 'wave 0.8s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'score-pop': 'score-pop 0.7s ease-out forwards',
        'progress-fill': 'progress-fill 1.5s ease-out forwards',
        'card-hover': 'card-hover 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
