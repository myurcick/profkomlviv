/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        appear: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        appear: 'appear 0.6s ease-out forwards',
      },
    },
    screens: {
      xxs: '320px',
      xs: '495px',
      xsm: '540px',
      sm: '640px',
      md: '768px',
      mdl: '880px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  plugins: [],
};
