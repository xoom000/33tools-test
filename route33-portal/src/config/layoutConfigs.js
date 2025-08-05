// COMPOSE, NEVER DUPLICATE - Layout Configuration System! ⚔️

// Responsive breakpoint system
export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Standard spacing scale
export const SPACING = {
  none: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem'        // 128px
};

// Grid system configurations
export const GRID_SYSTEMS = {
  // Customer/card grids
  customer: {
    container: 'grid gap-3',
    responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    compact: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    wide: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  },
  
  // Stats/metrics grids
  stats: {
    container: 'grid gap-4',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    compact: 'grid-cols-2 lg:grid-cols-4'
  },
  
  // Form grids
  form: {
    container: 'grid gap-4',
    responsive: 'grid-cols-1 md:grid-cols-2',
    full: 'grid-cols-1',
    triple: 'grid-cols-1 md:grid-cols-3'
  },
  
  // Content grids
  content: {
    container: 'grid gap-6',
    responsive: 'grid-cols-1 lg:grid-cols-2',
    sidebar: 'grid-cols-1 lg:grid-cols-3', // 2/3 main, 1/3 sidebar
    equal: 'grid-cols-1 md:grid-cols-2'
  },
  
  // List grids
  list: {
    container: 'grid gap-2',
    responsive: 'grid-cols-1',
    compact: 'grid-cols-1 gap-1'
  }
};

// Flexbox layout patterns
export const FLEX_LAYOUTS = {
  // Header patterns
  header: {
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    center: 'flex items-center justify-center',
    end: 'flex items-center justify-end'
  },
  
  // Content patterns
  content: {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    wrap: 'flex flex-wrap',
    nowrap: 'flex flex-nowrap'
  },
  
  // Button groups
  buttonGroup: {
    horizontal: 'flex items-center gap-2',
    vertical: 'flex flex-col gap-2',
    spread: 'flex items-center justify-between',
    center: 'flex items-center justify-center gap-2'
  },
  
  // Card layouts
  card: {
    header: 'flex items-start justify-between',
    content: 'flex flex-col gap-3',
    footer: 'flex items-center justify-between',
    actions: 'flex items-center gap-2'
  }
};

// Container configurations
export const CONTAINERS = {
  // Page containers
  page: {
    full: 'w-full',
    contained: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-full mx-auto px-4 sm:px-6 lg:px-8'
  },
  
  // Modal containers
  modal: {
    small: 'max-w-md',
    medium: 'max-w-lg', 
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full'
  },
  
  // Content containers
  content: {
    prose: 'max-w-prose mx-auto',
    reading: 'max-w-2xl mx-auto',
    form: 'max-w-md mx-auto',
    dashboard: 'max-w-7xl mx-auto'
  },
  
  // Scrollable containers
  scroll: {
    vertical: 'overflow-y-auto',
    horizontal: 'overflow-x-auto',
    both: 'overflow-auto',
    hidden: 'overflow-hidden',
    maxHeight: {
      small: 'max-h-60 overflow-y-auto',
      medium: 'max-h-96 overflow-y-auto', 
      large: 'max-h-[60vh] overflow-y-auto',
      full: 'max-h-[80vh] overflow-y-auto'
    }
  }
};

// Spacing configurations  
export const SPACING_PATTERNS = {
  // Stack spacing (vertical)
  stack: {
    tight: 'space-y-1',
    normal: 'space-y-3', 
    relaxed: 'space-y-6',
    loose: 'space-y-8'
  },
  
  // Inline spacing (horizontal)
  inline: {
    tight: 'space-x-1',
    normal: 'space-x-3',
    relaxed: 'space-x-6', 
    loose: 'space-x-8'
  },
  
  // Gap spacing (for grid/flex)
  gap: {
    none: 'gap-0',
    tight: 'gap-1',
    normal: 'gap-3',
    relaxed: 'gap-6',
    loose: 'gap-8'
  },
  
  // Padding patterns
  padding: {
    none: 'p-0',
    tight: 'p-2',
    normal: 'p-4',
    relaxed: 'p-6',
    loose: 'p-8',
    card: 'p-4 sm:p-6',
    modal: 'p-6 sm:p-8'
  },
  
  // Margin patterns
  margin: {
    none: 'm-0',
    tight: 'm-2', 
    normal: 'm-4',
    relaxed: 'm-6',
    loose: 'm-8',
    section: 'mb-8',
    component: 'mb-6'
  }
};

// Responsive layout utilities
export const RESPONSIVE_LAYOUTS = {
  // Hide/show at breakpoints
  visibility: {
    hideOnMobile: 'hidden md:block',
    hideOnDesktop: 'block md:hidden',
    showOnMobile: 'block md:hidden',
    showOnDesktop: 'hidden md:block'
  },
  
  // Responsive text sizes
  text: {
    responsive: 'text-sm md:text-base lg:text-lg',
    title: 'text-lg md:text-xl lg:text-2xl',
    heading: 'text-xl md:text-2xl lg:text-3xl'
  },
  
  // Responsive spacing
  spacing: {
    responsive: 'p-4 md:p-6 lg:p-8',
    section: 'py-8 md:py-12 lg:py-16',
    container: 'px-4 sm:px-6 lg:px-8'
  }
};

// Layout component configurations
export const LAYOUT_COMPONENTS = {
  // Dashboard layouts
  dashboard: {
    main: {
      container: CONTAINERS.page.contained,
      spacing: SPACING_PATTERNS.stack.relaxed,
      padding: SPACING_PATTERNS.padding.normal
    },
    sidebar: {
      container: 'w-64 flex-shrink-0',
      content: FLEX_LAYOUTS.content.vertical,
      spacing: SPACING_PATTERNS.stack.normal
    },
    content: {
      container: 'flex-1 min-w-0',
      padding: SPACING_PATTERNS.padding.normal
    }
  },
  
  // Form layouts
  formSection: {
    container: SPACING_PATTERNS.stack.normal,
    header: FLEX_LAYOUTS.header.between,
    content: GRID_SYSTEMS.form.responsive,
    spacing: SPACING_PATTERNS.gap.normal
  },
  
  // Card layouts
  cardGrid: {
    container: `${GRID_SYSTEMS.customer.container} ${GRID_SYSTEMS.customer.responsive}`,
    spacing: SPACING_PATTERNS.gap.normal,
    section: SPACING_PATTERNS.margin.section
  },
  
  // List layouts
  listSection: {
    container: SPACING_PATTERNS.stack.normal,
    header: FLEX_LAYOUTS.header.between,
    content: SPACING_PATTERNS.stack.tight,
    item: SPACING_PATTERNS.padding.normal
  }
};

// Preset layout combinations
export const LAYOUT_PRESETS = {
  // Customer selection (like your current component)
  customerSelection: {
    container: `${SPACING_PATTERNS.stack.relaxed} ${CONTAINERS.scroll.maxHeight.large}`,
    section: SPACING_PATTERNS.margin.section,
    sectionHeader: FLEX_LAYOUTS.header.between,
    sectionTitle: 'text-lg font-semibold text-slate-800',
    buttonGroup: FLEX_LAYOUTS.buttonGroup.horizontal,
    grid: `${GRID_SYSTEMS.customer.container} ${GRID_SYSTEMS.customer.responsive}`
  },
  
  // Stats dashboard
  statsDashboard: {
    container: CONTAINERS.page.contained,
    grid: `${GRID_SYSTEMS.stats.container} ${GRID_SYSTEMS.stats.responsive}`,
    spacing: SPACING_PATTERNS.stack.relaxed
  },
  
  // Form sections
  formLayout: {
    container: CONTAINERS.content.form,
    section: SPACING_PATTERNS.stack.normal,
    fieldGrid: `${GRID_SYSTEMS.form.container} ${GRID_SYSTEMS.form.responsive}`,
    buttonGroup: FLEX_LAYOUTS.buttonGroup.center
  },
  
  // Modal content
  modalLayout: {
    container: SPACING_PATTERNS.stack.normal,
    header: FLEX_LAYOUTS.header.between,
    content: SPACING_PATTERNS.stack.relaxed,
    footer: FLEX_LAYOUTS.header.end
  }
};

// Layout utility functions
export const LAYOUT_UTILS = {
  // Combine layout classes
  combine: (...layouts) => layouts.filter(Boolean).join(' '),
  
  // Get responsive grid based on item count
  getResponsiveGrid: (itemCount, type = 'customer') => {
    const grid = GRID_SYSTEMS[type];
    if (!grid) return GRID_SYSTEMS.customer;
    
    if (itemCount <= 2) return `${grid.container} grid-cols-1 md:grid-cols-2`;
    if (itemCount <= 4) return `${grid.container} ${grid.compact}`;
    return `${grid.container} ${grid.responsive}`;
  },
  
  // Get container size based on content
  getContainer: (size = 'contained') => CONTAINERS.page[size] || CONTAINERS.page.contained,
  
  // Get spacing based on density
  getSpacing: (density = 'normal', type = 'stack') => {
    const spacingType = SPACING_PATTERNS[type];
    return spacingType?.[density] || spacingType?.normal || '';
  }
};

// Default export for convenience
const layoutConfigs = {
  BREAKPOINTS,
  SPACING,
  GRID_SYSTEMS,
  FLEX_LAYOUTS,
  CONTAINERS,
  SPACING_PATTERNS,
  RESPONSIVE_LAYOUTS,
  LAYOUT_COMPONENTS,
  LAYOUT_PRESETS,
  LAYOUT_UTILS
};

export default layoutConfigs;