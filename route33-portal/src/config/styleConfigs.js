// COMPOSE, NEVER DUPLICATE - Centralized Style Configuration System! ⚔️
// This file uses design tokens from theme/index.js and creates ready-to-use component patterns
// 
// ARCHITECTURE:
// - theme/index.js = Design Tokens (colors, fonts, spacing - the raw values)
// - styleConfigs.js = Usage Patterns (how to apply those tokens in components)

import { COLORS, TYPOGRAPHY, SPACING, VARIANTS } from '../theme';

// Size system for buttons, inputs, controls
export const SIZE_CONFIGS = {
  // Button/Control sizes
  button: {
    xs: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      dimensions: 'w-6 h-6'
    },
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      dimensions: 'w-7 h-7'
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      dimensions: 'w-8 h-8'
    },
    lg: {
      padding: 'px-6 py-3',
      text: 'text-base',
      dimensions: 'w-10 h-10'
    }
  },
  
  // Input sizes
  input: {
    xs: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      height: 'h-8',
      minWidth: 'min-w-[2rem]'
    },
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      height: 'h-9',
      minWidth: 'min-w-[3rem]'
    },
    md: {
      padding: 'px-3 py-2',
      text: 'text-base',
      height: 'h-10',
      minWidth: 'min-w-[4rem]'
    },
    lg: {
      padding: 'px-4 py-3',
      text: 'text-lg',
      height: 'h-12',
      minWidth: 'min-w-[5rem]'
    }
  },
  
  // Icon sizes
  icon: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  },
  
  // Avatar/Circle sizes
  avatar: {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
};

// Border radius system
export const RADIUS_CONFIGS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
};

// Shadow system
export const SHADOW_CONFIGS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  inner: 'shadow-inner'
};

// Border system
export const BORDER_CONFIGS = {
  none: 'border-0',
  default: 'border border-slate-200',
  focus: 'border border-slate-300 focus:border-slate-500',
  error: 'border border-red-300 focus:border-red-500',
  success: 'border border-green-300 focus:border-green-500'
};

// Background system (references theme colors)
export const BACKGROUND_CONFIGS = {
  // Solid backgrounds (using theme color scale)
  primary: 'bg-primary-800', // COLORS.primary[800] - now synced!
  secondary: 'bg-primary-100', // COLORS.primary[100] - now synced!
  white: 'bg-white',
  gray: 'bg-primary-50', // COLORS.primary[50] - now synced!
  
  // Interactive backgrounds
  hover: {
    primary: 'hover:bg-primary-900', // COLORS.primary[900] - now synced!
    secondary: 'hover:bg-primary-200', // COLORS.primary[200] - now synced!
    white: 'hover:bg-primary-50',
    gray: 'hover:bg-primary-100'
  },
  
  // Status backgrounds (using theme semantic colors)
  success: 'bg-primary-100', // Using monochrome per theme
  error: 'bg-primary-100',   // Using monochrome per theme  
  warning: 'bg-primary-50',  // Using monochrome per theme
  info: 'bg-primary-50'      // Using monochrome per theme
};

// Text color system (references theme colors)
export const TEXT_CONFIGS = {
  // Main text colors (using theme color scale)
  primary: 'text-primary-800',   // COLORS.primary[800] - now synced!
  secondary: 'text-primary-600', // COLORS.primary[600] - now synced!
  muted: 'text-primary-500',     // COLORS.primary[500] - now synced!
  light: 'text-primary-400',     // COLORS.primary[400] - now synced!
  white: 'text-white',
  
  // Status text colors (monochrome per theme)
  success: 'text-primary-600',   // COLORS.success.DEFAULT
  error: 'text-primary-500',     // COLORS.error.DEFAULT  
  warning: 'text-primary-400',   // COLORS.warning.DEFAULT
  info: 'text-primary-300',      // COLORS.info.DEFAULT
  
  // Interactive text colors
  interactive: 'text-primary-600 hover:text-primary-800',
  link: 'text-primary-600 hover:text-primary-800' // Monochrome links
};

// Common component styles
export const COMPONENT_STYLES = {
  // Standard form control
  formControl: {
    base: `w-full ${BORDER_CONFIGS.focus} ${RADIUS_CONFIGS.lg} focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors`,
    error: `w-full ${BORDER_CONFIGS.error} ${RADIUS_CONFIGS.lg} focus:ring-2 focus:ring-red-500 focus:ring-offset-2`
  },
  
  // Standard card
  card: {
    base: `${BACKGROUND_CONFIGS.white} ${RADIUS_CONFIGS['2xl']} ${SHADOW_CONFIGS.sm} ${BORDER_CONFIGS.default}`,
    elevated: `${BACKGROUND_CONFIGS.white} ${RADIUS_CONFIGS['2xl']} ${SHADOW_CONFIGS.lg} ${BORDER_CONFIGS.default}`,
    interactive: `${BACKGROUND_CONFIGS.white} ${RADIUS_CONFIGS['2xl']} ${SHADOW_CONFIGS.sm} ${BORDER_CONFIGS.default} hover:${SHADOW_CONFIGS.md} transition-shadow`
  },
  
  // Standard button base
  buttonBase: `inline-flex items-center justify-center font-medium ${RADIUS_CONFIGS.lg} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`,
  
  // Standard overlay/backdrop
  backdrop: 'fixed inset-0 bg-black bg-opacity-50',
  
  // Standard center container
  centerContainer: 'flex items-center justify-center',
  
  // Standard section divider
  divider: 'border-t border-slate-200',
  
  // Standard status dot
  statusDot: `${RADIUS_CONFIGS.full} flex-shrink-0`,
  
  // Standard progress bar
  progressBar: {
    container: `w-full ${BACKGROUND_CONFIGS.secondary} ${RADIUS_CONFIGS.full} h-2`,
    fill: `${BACKGROUND_CONFIGS.primary} h-2 ${RADIUS_CONFIGS.full} transition-all duration-300`
  }
};

// Badge/Chip system - Status indicators, tags, labels
export const BADGE_CONFIGS = {
  // Badge sizes
  sizes: {
    xs: {
      padding: 'px-1.5 py-0.5',
      text: TYPOGRAPHY.sizes.xs,
      dimensions: 'h-4',
      icon: SIZE_CONFIGS.icon.xs
    },
    sm: {
      padding: 'px-2 py-0.5', 
      text: TYPOGRAPHY.sizes.xs,
      dimensions: 'h-5',
      icon: SIZE_CONFIGS.icon.sm
    },
    md: {
      padding: 'px-2.5 py-1',
      text: TYPOGRAPHY.sizes.sm,
      dimensions: 'h-6',
      icon: SIZE_CONFIGS.icon.md
    },
    lg: {
      padding: 'px-3 py-1',
      text: TYPOGRAPHY.sizes.sm,
      dimensions: 'h-7',
      icon: SIZE_CONFIGS.icon.md
    }
  },
  
  // Badge variants (using theme COLORS)
  variants: {
    default: {
      background: 'bg-primary-100', // COLORS.primary[100] - now synced!
      text: 'text-primary-700',     // COLORS.primary[700] - now synced!
      border: 'border-primary-200'  // COLORS.primary[200] - now synced!
    },
    primary: {
      background: 'bg-primary-800', // COLORS.primary[800] - now synced!
      text: 'text-white',
      border: 'border-primary-700'  // COLORS.primary[700] - now synced!
    },
    success: {
      background: 'bg-primary-100', // Using monochrome success
      text: 'text-primary-600',     // COLORS.success.DEFAULT
      border: 'border-primary-200'
    },
    error: {
      background: 'bg-primary-50',  // Lighter for errors
      text: 'text-primary-500',     // COLORS.error.DEFAULT
      border: 'border-primary-200'
    },
    warning: {
      background: 'bg-primary-50',
      text: 'text-primary-400',     // COLORS.warning.DEFAULT
      border: 'border-primary-100'
    },
    info: {
      background: 'bg-primary-50',
      text: 'text-primary-300',     // COLORS.info.DEFAULT
      border: 'border-primary-100'
    },
    outline: {
      background: 'bg-transparent',
      text: 'text-primary-700',
      border: 'border-primary-300'
    }
  },
  
  // Badge shapes
  shapes: {
    rounded: RADIUS_CONFIGS.md,
    pill: RADIUS_CONFIGS.full,
    square: RADIUS_CONFIGS.sm
  },
  
  // Status dots (small indicators)
  statusDots: {
    online: 'bg-primary-600 border-primary-700',    // Success variant - now synced!
    offline: 'bg-primary-400 border-primary-500',   // Error variant - now synced!
    away: 'bg-primary-300 border-primary-400',      // Warning variant - now synced!
    busy: 'bg-primary-500 border-primary-600'       // Info variant - now synced!
  }
};

// Preset combinations for common patterns
export const STYLE_PRESETS = {
  // Quantity control
  quantityControl: {
    container: 'flex items-center gap-3',
    button: {
      small: `${SIZE_CONFIGS.button.xs.dimensions} ${RADIUS_CONFIGS.full} bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 font-bold flex items-center justify-center transition-colors`,
      medium: `${SIZE_CONFIGS.button.sm.dimensions} ${RADIUS_CONFIGS.full} bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 font-bold flex items-center justify-center transition-colors`,
      large: `${SIZE_CONFIGS.button.md.dimensions} ${RADIUS_CONFIGS.full} bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 font-bold flex items-center justify-center transition-colors`
    },
    display: {
      small: `${SIZE_CONFIGS.input.xs.text} ${SIZE_CONFIGS.input.xs.padding} ${SIZE_CONFIGS.input.xs.minWidth} font-semibold text-slate-800 text-center bg-white ${RADIUS_CONFIGS.lg} ${BORDER_CONFIGS.default}`,
      medium: `${SIZE_CONFIGS.input.sm.text} ${SIZE_CONFIGS.input.sm.padding} ${SIZE_CONFIGS.input.sm.minWidth} font-semibold text-slate-800 text-center bg-white ${RADIUS_CONFIGS.lg} ${BORDER_CONFIGS.default}`,
      large: `${SIZE_CONFIGS.input.md.text} ${SIZE_CONFIGS.input.md.padding} ${SIZE_CONFIGS.input.md.minWidth} font-semibold text-slate-800 text-center bg-white ${RADIUS_CONFIGS.lg} ${BORDER_CONFIGS.default}`
    }
  },
  
  // Section divider
  sectionDivider: {
    spacing: 'mt-6 pt-4',
    border: COMPONENT_STYLES.divider,
    title: 'text-sm text-slate-600 mb-3'
  },
  
  // Empty state
  emptyState: {
    container: 'text-center py-12',
    icon: 'text-slate-400 text-4xl mb-3',
    title: 'text-lg font-semibold text-slate-700 mb-2',
    message: 'text-slate-500'
  },
  
  // Error state
  errorState: {
    container: 'text-center py-12',
    icon: 'text-red-600 text-6xl mb-4',
    title: 'text-red-600 text-xl mb-4',
    message: 'text-slate-600 mb-6 max-w-md mx-auto'
  },
  
  // Badge/Chip presets (combining size + variant + shape)
  badge: {
    // Status badges
    status: {
      active: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.success.background} ${BADGE_CONFIGS.variants.success.text} ${BADGE_CONFIGS.shapes.pill} border ${BADGE_CONFIGS.variants.success.border}`,
      inactive: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.error.background} ${BADGE_CONFIGS.variants.error.text} ${BADGE_CONFIGS.shapes.pill} border ${BADGE_CONFIGS.variants.error.border}`,
      pending: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.warning.background} ${BADGE_CONFIGS.variants.warning.text} ${BADGE_CONFIGS.shapes.pill} border ${BADGE_CONFIGS.variants.warning.border}`
    },
    
    // Priority badges
    priority: {
      high: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.primary.background} ${BADGE_CONFIGS.variants.primary.text} ${BADGE_CONFIGS.shapes.rounded}`,
      medium: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.default.background} ${BADGE_CONFIGS.variants.default.text} ${BADGE_CONFIGS.shapes.rounded} border ${BADGE_CONFIGS.variants.default.border}`,
      low: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.outline.background} ${BADGE_CONFIGS.variants.outline.text} ${BADGE_CONFIGS.shapes.rounded} border ${BADGE_CONFIGS.variants.outline.border}`
    },
    
    // Category tags
    tag: {
      small: `inline-flex items-center gap-1 ${BADGE_CONFIGS.sizes.xs.padding} ${BADGE_CONFIGS.sizes.xs.text} ${BADGE_CONFIGS.variants.default.background} ${BADGE_CONFIGS.variants.default.text} ${BADGE_CONFIGS.shapes.pill} border ${BADGE_CONFIGS.variants.default.border}`,
      medium: `inline-flex items-center gap-1.5 ${BADGE_CONFIGS.sizes.sm.padding} ${BADGE_CONFIGS.sizes.sm.text} ${BADGE_CONFIGS.variants.default.background} ${BADGE_CONFIGS.variants.default.text} ${BADGE_CONFIGS.shapes.pill} border ${BADGE_CONFIGS.variants.default.border}`,
      large: `inline-flex items-center gap-2 ${BADGE_CONFIGS.sizes.md.padding} ${BADGE_CONFIGS.sizes.md.text} ${BADGE_CONFIGS.variants.default.background} ${BADGE_CONFIGS.variants.default.text} ${BADGE_CONFIGS.shapes.pill} border ${BADGE_CONFIGS.variants.default.border}`
    },
    
    // Count badges (notification counters)
    count: {
      small: `inline-flex items-center justify-center ${BADGE_CONFIGS.sizes.xs.dimensions} ${BADGE_CONFIGS.sizes.xs.text} min-w-[1rem] ${BADGE_CONFIGS.variants.primary.background} ${BADGE_CONFIGS.variants.primary.text} ${BADGE_CONFIGS.shapes.pill} font-semibold`,
      medium: `inline-flex items-center justify-center ${BADGE_CONFIGS.sizes.sm.dimensions} ${BADGE_CONFIGS.sizes.sm.text} min-w-[1.25rem] ${BADGE_CONFIGS.variants.primary.background} ${BADGE_CONFIGS.variants.primary.text} ${BADGE_CONFIGS.shapes.pill} font-semibold`
    }
  },
  
  // Status dots (connection indicators, etc.)
  statusDot: {
    online: `w-2 h-2 ${BADGE_CONFIGS.statusDots.online} ${BADGE_CONFIGS.shapes.pill} border`,
    offline: `w-2 h-2 ${BADGE_CONFIGS.statusDots.offline} ${BADGE_CONFIGS.shapes.pill} border`,
    away: `w-2 h-2 ${BADGE_CONFIGS.statusDots.away} ${BADGE_CONFIGS.shapes.pill} border`,
    busy: `w-2 h-2 ${BADGE_CONFIGS.statusDots.busy} ${BADGE_CONFIGS.shapes.pill} border`
  }
};

// Utility functions
export const STYLE_UTILS = {
  // Get size configuration
  getSize: (component, size) => SIZE_CONFIGS[component]?.[size] || SIZE_CONFIGS[component]?.md,
  
  // Combine style classes
  combine: (...classes) => classes.filter(Boolean).join(' '),
  
  // Get responsive size classes
  getResponsiveSize: (baseSize) => {
    const sizes = {
      xs: 'sm:text-sm',
      sm: 'sm:text-base',
      md: 'sm:text-lg',
      lg: 'sm:text-xl'
    };
    return sizes[baseSize] || sizes.md;
  }
};

// Default export for convenience
const styleConfigs = {
  SIZE_CONFIGS,
  RADIUS_CONFIGS,
  SHADOW_CONFIGS,
  BORDER_CONFIGS,
  BACKGROUND_CONFIGS,
  TEXT_CONFIGS,
  COMPONENT_STYLES,
  BADGE_CONFIGS,
  STYLE_PRESETS,
  STYLE_UTILS
};

export default styleConfigs;