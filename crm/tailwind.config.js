/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: '#0A0A0A',
        foreground: '#E5E9ED',
        card: '#1A1A1A',
        'card-foreground': '#E5E9ED',
        primary: '#A8B2C1',
        'primary-foreground': '#0A0A0A',
        secondary: '#1A1A1A',
        'secondary-foreground': '#E5E9ED',
        muted: '#1A1A1A',
        'muted-foreground': '#8B95A5',
        accent: '#A8B2C1',
        'accent-foreground': '#0A0A0A',
        border: '#2A2A2A',
        input: '#1A1A1A',
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
