// COMPOSE, NEVER DUPLICATE - Layout hooks for consistent spacing and layout! ⚔️
import { useMemo } from 'react';
import { 
  LAYOUT_PRESETS, 
  LAYOUT_UTILS, 
  GRID_SYSTEMS,
  FLEX_LAYOUTS,
  SPACING_PATTERNS,
  CONTAINERS
} from '../config/layoutConfigs';

// Custom hook for getting standardized layouts
export const useLayout = () => {
  return useMemo(() => ({
    // Layout presets
    presets: LAYOUT_PRESETS,
    
    // Grid systems
    grids: GRID_SYSTEMS,
    
    // Flex layouts
    flex: FLEX_LAYOUTS,
    
    // Spacing patterns
    spacing: SPACING_PATTERNS,
    
    // Containers
    containers: CONTAINERS,
    
    // Utility functions
    utils: LAYOUT_UTILS,
    
    // Quick access to commonly used layouts
    quick: {
      // Common grids
      customerGrid: GRID_SYSTEMS.customer,
      statsGrid: GRID_SYSTEMS.stats,
      formGrid: GRID_SYSTEMS.form,
      
      // Common flex patterns
      headerBetween: FLEX_LAYOUTS.header.between,
      buttonGroup: FLEX_LAYOUTS.buttonGroup.horizontal,
      cardHeader: FLEX_LAYOUTS.card.header,
      
      // Common spacing
      stackNormal: SPACING_PATTERNS.stack.normal,
      gapNormal: SPACING_PATTERNS.gap.normal,
      paddingCard: SPACING_PATTERNS.padding.card,
      
      // Common containers
      pageContained: CONTAINERS.page.contained,
      scrollLarge: CONTAINERS.scroll.maxHeight.large
    }
  }), []);
};

// Hook for getting responsive grid based on screen size and item count
export const useResponsiveGrid = (itemCount, gridType = 'customer') => {
  return useMemo(() => {
    return LAYOUT_UTILS.getResponsiveGrid(itemCount, gridType);
  }, [itemCount, gridType]);
};

// Hook for building layout classes dynamically
export const useLayoutBuilder = () => {
  return useMemo(() => ({
    // Build container class
    container: (size = 'contained', extraClasses = '') => 
      LAYOUT_UTILS.combine(LAYOUT_UTILS.getContainer(size), extraClasses),
    
    // Build grid class
    grid: (type = 'customer', responsive = true) => {
      const grid = GRID_SYSTEMS[type];
      if (!grid) return GRID_SYSTEMS.customer.container;
      return responsive 
        ? `${grid.container} ${grid.responsive}`
        : grid.container;
    },
    
    // Build flex class
    flex: (type = 'between', extraClasses = '') => 
      LAYOUT_UTILS.combine(FLEX_LAYOUTS.header[type], extraClasses),
    
    // Build spacing class
    spacing: (density = 'normal', type = 'stack') => 
      LAYOUT_UTILS.getSpacing(density, type),
    
    // Build section class
    section: (spacing = 'normal', extraClasses = '') => 
      LAYOUT_UTILS.combine(SPACING_PATTERNS.margin.section, SPACING_PATTERNS.stack[spacing], extraClasses),
    
    // Build card layout
    cardLayout: (padding = 'card', extraClasses = '') =>
      LAYOUT_UTILS.combine(SPACING_PATTERNS.padding[padding], extraClasses)
  }), []);
};

// Hook for component-specific layouts
export const useComponentLayout = (componentType) => {
  return useMemo(() => {
    switch (componentType) {
      case 'customerSelection':
        return LAYOUT_PRESETS.customerSelection;
      case 'statsDashboard':
        return LAYOUT_PRESETS.statsDashboard;
      case 'formLayout':
        return LAYOUT_PRESETS.formLayout;
      case 'modalLayout':
        return LAYOUT_PRESETS.modalLayout;
      default:
        return {};
    }
  }, [componentType]);
};

// Hook for responsive layout utilities
export const useResponsiveLayout = () => {
  return useMemo(() => ({
    // Check if mobile screen (could be enhanced with actual screen size detection)
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
    
    // Get mobile-first responsive classes
    responsive: {
      text: 'text-sm md:text-base lg:text-lg',
      padding: 'p-4 md:p-6 lg:p-8',
      margin: 'm-4 md:m-6 lg:m-8',
      grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    },
    
    // Hide/show patterns
    visibility: {
      mobileOnly: 'block md:hidden',
      desktopOnly: 'hidden md:block'
    }
  }), []);
};

export default useLayout;