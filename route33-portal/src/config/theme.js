/**
 * COMPOSE, NEVER DUPLICATE - Unified Theme Configuration System
 * Based on React best practices for consistent design systems
 * Integrates with Tailwind CSS for optimal performance
 */

// ============================================================================
// LAYOUT CONFIGURATIONS
// ============================================================================

export const LAYOUT_CONFIG = {
  // Container configurations
  containers: {
    page: 'min-h-screen bg-slate-50',
    main: 'container mx-auto px-4 py-6',
    section: 'mb-8',
    card: 'bg-white rounded-2xl border border-slate-100'
  },

  // Spacing configurations
  spacing: {
    xs: { padding: 'p-3', margin: 'm-3', gap: 'gap-2' },
    sm: { padding: 'p-4', margin: 'm-4', gap: 'gap-3' },
    md: { padding: 'p-6', margin: 'm-6', gap: 'gap-4' },
    lg: { padding: 'p-8', margin: 'm-8', gap: 'gap-6' },
    xl: { padding: 'p-12', margin: 'm-12', gap: 'gap-8' }
  },

  // Grid configurations
  grids: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    auto: 'grid grid-cols-auto-fit gap-4',
    dashboard: 'grid grid-cols-1 lg:grid-cols-4 gap-6'
  },

  // Flexbox configurations
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center'
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// ============================================================================
// TYPOGRAPHY CONFIGURATIONS
// ============================================================================

export const TYPOGRAPHY_CONFIG = {
  // Text sizes and weights
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  },

  // Font weights
  weights: {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  },

  // Text styles
  styles: {
    heading: 'text-lg font-semibold text-slate-800',
    subheading: 'text-base font-medium text-slate-700',
    body: 'text-sm text-slate-600',
    caption: 'text-xs text-slate-500',
    muted: 'text-xs text-slate-400'
  },

  // Text alignment
  align: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
};

// ============================================================================
// COLOR SYSTEM (From Tailwind Config)
// ============================================================================

export const COLOR_CONFIG = {
  // Primary grayscale system
  primary: {
    25: '#fdfdfe',   // Ultra-light - glass effects, overlays
    50: '#f9fafb',   // Whisper - subtle card backgrounds
    100: '#f3f4f6',  // Ghost - disabled states, skeleton loading
    200: '#e5e7eb',  // Mist - borders, dividers, input outlines
    300: '#d1d5db',  // Fog - placeholders, secondary borders
    400: '#9ca3af',  // Steel - secondary text, icons
    500: '#6b7280',  // Charcoal - body text, default state
    600: '#4b5563',  // Slate - headings, emphasized text
    700: '#374151',  // Graphite - primary buttons, strong emphasis
    800: '#1f2937',  // Obsidian - headers, navigation, dark surfaces
    900: '#111827',  // Void - maximum contrast, rare emphasis
    950: '#030712'   // Abyss - ultimate depth, shadows
  },

  // Accent colors
  accents: {
    success: {
      light: '#ecfdf5',
      base: '#10b981',
      dark: '#047857'
    },
    danger: {
      light: '#fef2f2',
      base: '#ef4444',
      dark: '#b91c1c'
    },
    warning: {
      light: '#fffbeb',
      base: '#f59e0b',
      dark: '#b45309'
    },
    info: {
      light: '#eff6ff',
      base: '#3b82f6',
      dark: '#1e40af'
    }
  },

  // Status colors
  status: {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  }
};

// ============================================================================
// COMPONENT-SPECIFIC THEMES
// ============================================================================

export const COMPONENT_THEMES = {
  // Button theme variations
  button: {
    primary: {
      base: 'bg-primary-800 text-white border-primary-800',
      hover: 'hover:bg-primary-900 hover:border-primary-900',
      focus: 'focus:ring-primary-600',
      disabled: 'disabled:bg-primary-200 disabled:text-primary-400'
    },
    secondary: {
      base: 'bg-primary-100 text-primary-800 border-primary-200',
      hover: 'hover:bg-primary-200 hover:border-primary-300',
      focus: 'focus:ring-primary-300',
      disabled: 'disabled:bg-primary-50 disabled:text-primary-300'
    },
    outline: {
      base: 'bg-transparent text-primary-700 border-primary-300',
      hover: 'hover:bg-primary-50 hover:border-primary-400',
      focus: 'focus:ring-primary-300',
      disabled: 'disabled:border-primary-200 disabled:text-primary-400'
    },
    ghost: {
      base: 'bg-transparent text-primary-600 border-transparent',
      hover: 'hover:bg-primary-100 hover:text-primary-800',
      focus: 'focus:ring-primary-300',
      disabled: 'disabled:text-primary-300'
    },
    danger: {
      base: 'bg-accent-danger-500 text-white border-accent-danger-500',
      hover: 'hover:bg-accent-danger-600 hover:border-accent-danger-600',
      focus: 'focus:ring-accent-danger-300',
      disabled: 'disabled:bg-accent-danger-200'
    }
  },

  // Card theme variations
  card: {
    default: {
      base: 'bg-white border border-slate-100',
      shadow: 'shadow-sm',
      hover: 'hover:shadow-md'
    },
    elevated: {
      base: 'bg-white border border-slate-100',
      shadow: 'shadow-lg',
      hover: 'hover:shadow-xl'
    },
    outlined: {
      base: 'bg-white border-2 border-slate-200',
      shadow: 'shadow-none',
      hover: 'hover:border-slate-300'
    }
  },

  // Input theme variations
  input: {
    default: {
      base: 'border-slate-300 bg-white',
      focus: 'focus:border-primary-500 focus:ring-primary-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
    }
  }
};

// ============================================================================
// COMMON CLASS COMBINATIONS
// ============================================================================

export const COMMON_CLASSES = {
  // Flex layouts
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',

  // Interactive states
  clickable: 'cursor-pointer transition-all duration-200',
  hoverCard: 'hover:shadow-md transition-shadow duration-200',

  // Common spacing
  cardPadding: 'p-6',
  sectionSpacing: 'space-y-4',
  gridGap: 'gap-4',

  // Form elements
  inputFocus: 'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500',
  inputError: 'border-red-300 focus:ring-red-500 focus:border-red-500',

  // Responsive helpers
  responsiveText: 'text-sm lg:text-base',
  responsivePadding: 'px-3 py-2 lg:px-4 lg:py-2.5',
  responsiveGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
};

// ============================================================================
// STYLE CONFIGURATIONS (Legacy Support)
// ============================================================================

export const STYLE_CONFIG = {
  // Border radius
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm', 
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  },

  // Shadows
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  },

  // Transitions
  transitions: {
    none: 'transition-none',
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    shadow: 'transition-shadow',
    transform: 'transition-transform'
  },

  // Duration
  durations: {
    75: 'duration-75',
    100: 'duration-100',
    150: 'duration-150',
    200: 'duration-200',
    300: 'duration-300',
    500: 'duration-500',
    700: 'duration-700',
    1000: 'duration-1000'
  }
};

// ============================================================================
// TAB CONFIGURATIONS
// ============================================================================

export const TAB_CONFIG = {
  // Tab styles
  styles: {
    container: 'border-b border-slate-200',
    list: 'flex space-x-8',
    tab: {
      base: 'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
      active: 'border-primary-500 text-primary-600',
      inactive: 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    },
    panel: 'py-6'
  },

  // Tab layouts
  layouts: {
    horizontal: 'flex',
    vertical: 'flex flex-col',
    pills: 'flex space-x-2'
  }
};

// Export legacy aliases for backward compatibility
export const LAYOUT_CONFIGS = LAYOUT_CONFIG;
export const STYLE_CONFIGS = STYLE_CONFIG;