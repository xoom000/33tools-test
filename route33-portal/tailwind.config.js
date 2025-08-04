/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // 🎨 MODERN MINIMALIST MONOCHROME SYSTEM
        // Innovative grayscale palette with precision-tuned contrast ratios
        
        // PURE FOUNDATIONS
        white: '#ffffff',
        black: '#000000',
        
        // PRIMARY SCALE - Carefully crafted for optimal hierarchy
        primary: {
          25: '#fdfdfe',    // Ultra-light - glass effects, overlays
          50: '#f9fafb',    // Whisper - subtle card backgrounds
          100: '#f3f4f6',   // Ghost - disabled states, skeleton loading
          200: '#e5e7eb',   // Mist - borders, dividers, input outlines
          300: '#d1d5db',   // Fog - placeholders, secondary borders
          400: '#9ca3af',   // Steel - secondary text, icons
          500: '#6b7280',   // Charcoal - body text, default state
          600: '#4b5563',   // Slate - headings, emphasized text
          700: '#374151',   // Graphite - primary buttons, strong emphasis
          800: '#1f2937',   // Obsidian - headers, navigation, dark surfaces
          900: '#111827',   // Void - maximum contrast, rare emphasis
          950: '#030712'    // Abyss - ultimate depth, shadows
        },
        
        // INNOVATIVE ACCENT SYSTEM - Minimal but impactful
        accent: {
          // Emerald green for success/positive actions
          success: {
            50: '#ecfdf5',
            100: '#d1fae5', 
            500: '#10b981',
            600: '#059669',
            700: '#047857'
          },
          
          // Sophisticated red for errors/destructive actions  
          danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444', 
            600: '#dc2626',
            700: '#b91c1c'
          },
          
          // Warm amber for warnings/attention
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706', 
            700: '#b45309'
          }
        }
      }
    },
  },
  plugins: [],
}