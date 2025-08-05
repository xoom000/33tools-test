// COMPOSE, NEVER DUPLICATE - Single source of truth for ALL design values!

// Brand Configuration
export const BRAND = {
  name: 'Route 33 Service',
  company: 'Route 33 Tools',
  defaultRoute: 33,
  supportEmail: 'support@route33.app',
  version: '2.0.0'
};

// FULL MONOCHROME Color System - Synced with tailwind.config.js
export const COLORS = {
  // Primary Brand Colors (matching tailwind.config.js exactly)
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
  
  // Accent Colors - Synced with tailwind.config.js accent system
  accent: {
    success: {
      50: '#ecfdf5',
      100: '#d1fae5', 
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444', 
      600: '#dc2626',
      700: '#b91c1c'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706', 
      700: '#b45309'
    }
  },

  // Semantic Colors - For backwards compatibility, using monochrome approach
  success: {
    light: '#6b7280',   // primary-500 (softer)
    DEFAULT: '#4b5563', // primary-600 (medium)
    dark: '#374151'     // primary-700 (stronger)
  },
  
  error: {
    light: '#9ca3af',   // primary-400 (lighter for errors)
    DEFAULT: '#6b7280', // primary-500 (medium error)
    dark: '#4b5563'     // primary-600 (strong error)
  },
  
  warning: {
    light: '#d1d5db',   // primary-300 (very light)
    DEFAULT: '#9ca3af', // primary-400 (medium warning)
    dark: '#6b7280'     // primary-500 (stronger warning)
  },
  
  info: {
    light: '#e5e7eb',   // primary-200 (very light)
    DEFAULT: '#d1d5db', // primary-300 (light info)
    dark: '#9ca3af'     // primary-400 (medium info)
  }
};

// Typography Scale
export const TYPOGRAPHY = {
  fonts: {
    base: 'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace'
  },
  
  sizes: {
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  },
  
  weights: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
};

// Spacing System
export const SPACING = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  base: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem'
};

// Component Variants - FULL MONOCHROME
export const VARIANTS = {
  button: {
    primary: `bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl focus:ring-slate-500`,
    secondary: `bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 shadow-sm focus:ring-slate-500`,
    success: `bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl focus:ring-slate-500`,
    danger: `bg-slate-500 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl focus:ring-slate-500`,
    ghost: `text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-500`,
    outline: `border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white bg-transparent focus:ring-slate-500`
  },
  
  card: {
    base: `bg-white rounded-2xl shadow-sm border border-slate-100`,
    elevated: `bg-white rounded-2xl shadow-lg border border-slate-200`,
    interactive: `bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow`
  },
  
  input: {
    base: `w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500`,
    error: `w-full border border-slate-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-600 focus:border-slate-600`
  }
};

// Layout Constants
export const LAYOUT = {
  containers: {
    sm: 'max-w-2xl',
    base: 'max-w-6xl', 
    lg: 'max-w-7xl',
    full: 'max-w-full'
  },
  
  backgrounds: {
    page: 'min-h-screen bg-gradient-to-br from-slate-100 to-slate-200',
    card: 'bg-white',
    header: 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60'
  },
  
  padding: {
    page: 'px-4 py-8',
    card: 'p-6',
    section: 'px-3 py-4 sm:px-4 lg:px-6 xl:px-8'
  }
};

// Animation Presets
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  }
};

// Utility Functions
export const getThemeValue = (path, fallback = '') => {
  const paths = path.split('.');
  let current = { COLORS, TYPOGRAPHY, SPACING, VARIANTS, LAYOUT, ANIMATIONS };
  
  for (const segment of paths) {
    current = current?.[segment];
    if (!current) return fallback;
  }
  
  return current;
};

// Convenience Exports
export const theme = {
  BRAND,
  COLORS,
  TYPOGRAPHY, 
  SPACING,
  VARIANTS,
  LAYOUT,
  ANIMATIONS,
  getThemeValue
};

export default theme;