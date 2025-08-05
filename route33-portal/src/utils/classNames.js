/**
 * COMPOSE, NEVER DUPLICATE - Enhanced className utility
 * Based on React best practices for conditional styling
 * 
 * Handles multiple input types:
 * - Strings: 'class-name'
 * - Objects: { 'class-name': boolean }
 * - Arrays: ['class1', 'class2']
 * - Mixed: cn('base', { active: isActive }, someClass)
 */
export const cn = (...inputs) => {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    const inputType = typeof input;

    if (inputType === 'string') {
      classes.push(input);
    } else if (inputType === 'object') {
      if (Array.isArray(input)) {
        // Handle arrays recursively
        const arrayResult = cn(...input);
        if (arrayResult) classes.push(arrayResult);
      } else {
        // Handle objects: { 'class-name': boolean }
        for (const [key, value] of Object.entries(input)) {
          if (value) classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
};

// Common class combinations - COMPOSE, NEVER DUPLICATE!
export const COMMON_CLASSES = {
  // Flex layouts
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
  
  // Text styles
  textHeading: 'text-lg font-semibold text-slate-800',
  textBody: 'text-sm text-slate-600',
  textMuted: 'text-xs text-slate-500',
  
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
  
  // Status indicators
  statusSuccess: 'bg-emerald-100 text-emerald-700',
  statusWarning: 'bg-yellow-100 text-yellow-700',
  statusError: 'bg-red-100 text-red-700',
  statusInfo: 'bg-blue-100 text-blue-700',
  
  // Responsive helpers
  responsiveText: 'text-sm lg:text-base',
  responsivePadding: 'px-3 py-2 lg:px-4 lg:py-2.5',
  responsiveGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
};

// Dynamic class builders
export const buildButtonClasses = (variant, size, disabled = false) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return cn(baseClasses, variant, size, disabledClasses);
};

export const buildCardClasses = (interactive = false, elevated = false) => {
  const baseClasses = 'bg-white rounded-2xl border border-slate-100';
  const shadowClasses = elevated ? 'shadow-lg' : 'shadow-sm';
  const interactiveClasses = interactive ? COMMON_CLASSES.hoverCard : '';
  
  return cn(baseClasses, shadowClasses, interactiveClasses);
};

/**
 * Variant-specific className utility for consistent component styling
 * Optimized for your existing component patterns
 * 
 * @param {string} base - Base classes (always applied)
 * @param {Object} variants - Variant mapping object
 * @param {string} selectedVariant - Current variant key
 * @param {Object|string} states - State-based classes or className string
 * @param {string} className - Additional classes for override
 * @returns {string} Combined class names
 */
export const variant = (base, variants, selectedVariant, states = {}, className = '') => {
  return cn(
    base,
    variants[selectedVariant],
    states,
    className
  );
};

/**
 * Size-based className utility for responsive components
 * Perfect for buttons, inputs, cards with size variants
 */
export const size = (sizes, selectedSize, className = '') => {
  return cn(sizes[selectedSize], className);
};

// Export enhanced cn as default for widespread usage
export default cn;