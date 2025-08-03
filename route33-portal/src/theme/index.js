// COMPOSE, NEVER DUPLICATE - Single source of truth for ALL design values!

// Brand Configuration
export const BRAND = {
  name: 'Route 33 Service',
  company: 'Route 33 Tools',
  defaultRoute: 33,
  supportEmail: 'support@route33.app',
  version: '2.0.0'
};

// Color System - Single source for all colors
export const COLORS = {
  // Primary Brand Colors
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  
  // Semantic Colors
  success: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857'
  },
  
  error: {
    light: '#f87171',
    DEFAULT: '#ef4444', 
    dark: '#dc2626'
  },
  
  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706'
  },
  
  info: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb'
  }
};

// Typography Scale
export const TYPOGRAPHY = {
  fonts: {
    base: 'Inter, system-ui, sans-serif',
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

// Component Variants
export const VARIANTS = {
  button: {
    primary: `bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl focus:ring-slate-500`,
    secondary: `bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 shadow-sm focus:ring-slate-500`,
    success: `bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500`,
    danger: `bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500`,
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
    error: `w-full border border-red-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500`
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