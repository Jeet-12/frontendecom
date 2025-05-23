/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        'roboto': ['"Roboto"', 'sans-serif'],
      },
      colors: {
        primary: "#fbae44",
        green: "#15626a",
       'accent-content': '#000000', // Existing custom color
       'secondary-accent': '#ffeed6',
       'fbae44': '#fbae44',           // Custom button color
        'fbae40': '#fbae40',           // Darker shade for hover
         'custom-gray': '#484848',
      },
      spacing: {
        '18': '4.5rem', // Custom spacing if needed
      },
      backgroundImage: {
         'hero-pattern': "url('https://images.unsplash.com/photo-1599589915468-b4c71ed62543?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
         'stats-pattern': "url('https://images.unsplash.com/photo-1599589915468-b4c71ed62543?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
         'testimonial-bg': "url('/src/assets/customer_bg.jpg')",

      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
      },
    },
    themes: ["dark", "winter"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
