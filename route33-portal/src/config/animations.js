/**
 * COMPOSE, NEVER DUPLICATE - Unified Animation Configuration System
 * Based on React best practices for smooth, performant animations
 * Uses Framer Motion for rich interactions and CSS animations for performance
 */

// ============================================================================
// ANIMATION CONSTANTS
// ============================================================================

export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.75,
  slowest: 1.0
};

export const ANIMATION_EASINGS = {
  linear: 'linear',
  easeIn: 'easeIn',
  easeOut: 'easeOut', 
  easeInOut: 'easeInOut',
  backIn: [0.6, -0.05, 0.01, 0.99],
  backOut: [0.175, 0.885, 0.32, 1.275],
  bounceOut: [0.68, -0.55, 0.265, 1.55],
  spring: { type: 'spring', stiffness: 300, damping: 30 }
};

// ============================================================================
// BASE ANIMATION PRESETS
// ============================================================================

export const ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },

  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },

  // Pop/bounce animations
  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.bounceOut }
  }
};

// ============================================================================
// COMPONENT-SPECIFIC ANIMATIONS
// ============================================================================

export const COMPONENT_ANIMATIONS = {
  // Modal animations
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: ANIMATION_DURATIONS.fast }
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    }
  },

  // Toast/notification animations
  toast: {
    slideInRight: {
      initial: { opacity: 0, x: 300, scale: 0.3 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 300, scale: 0.5 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    },
    slideInTop: {
      initial: { opacity: 0, y: -100, scale: 0.3 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -100, scale: 0.5 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    }
  },

  // Button animations
  button: {
    hover: {
      whileHover: { scale: 1.02 },
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeOut }
    },
    tap: {
      whileTap: { scale: 0.98 },
      transition: { duration: ANIMATION_DURATIONS.fast }
    }
  },

  // Card animations
  card: {
    hover: {
      whileHover: { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeOut }
    },
    tap: {
      whileTap: { scale: 0.98 },
      transition: { duration: ANIMATION_DURATIONS.fast }
    },
    entrance: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    }
  },

  // Form animations
  form: {
    field: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    },
    error: {
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 },
      transition: { duration: ANIMATION_DURATIONS.fast }
    }
  },

  // List animations
  list: {
    container: {
      animate: { transition: { staggerChildren: 0.1 } }
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    }
  },

  // Tab content animations
  tab: {
    content: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
    }
  }
};

// ============================================================================
// MICRO-INTERACTIONS
// ============================================================================

export const MICRO_ANIMATIONS = {
  // Loading states
  loading: {
    spin: {
      animate: { rotate: 360 },
      transition: { duration: 1, repeat: Infinity, ease: ANIMATION_EASINGS.linear }
    },
    pulse: {
      animate: { opacity: [1, 0.5, 1] },
      transition: { duration: 1.5, repeat: Infinity, ease: ANIMATION_EASINGS.easeInOut }
    },
    bounce: {
      animate: { y: [0, -10, 0] },
      transition: { duration: 0.8, repeat: Infinity, ease: ANIMATION_EASINGS.easeInOut }
    }
  },

  // Hover effects
  hover: {
    lift: {
      whileHover: { y: -2 },
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeOut }
    },
    scale: {
      whileHover: { scale: 1.05 },
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeOut }
    },
    glow: {
      whileHover: { boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
      transition: { duration: ANIMATION_DURATIONS.fast }
    }
  },

  // Tap/click effects
  tap: {
    scale: {
      whileTap: { scale: 0.95 },
      transition: { duration: ANIMATION_DURATIONS.fast }
    },
    press: {
      whileTap: { scale: 0.98, y: 1 },
      transition: { duration: ANIMATION_DURATIONS.fast }
    }
  }
};

// ============================================================================
// LAYOUT ANIMATIONS
// ============================================================================

export const LAYOUT_ANIMATIONS = {
  // Page entrance
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  },

  // Section animations
  section: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeOut }
  },

  // Header animations
  header: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut }
  }
};

// ============================================================================
// STAGGER CONFIGURATIONS
// ============================================================================

export const STAGGER_CONFIGS = {
  // List stagger
  list: {
    container: {
      animate: {
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
      }
    }
  },

  // Grid stagger
  grid: {
    container: {
      animate: {
        transition: { staggerChildren: 0.05, delayChildren: 0.02 }
      }
    }
  },

  // Card grid stagger
  cards: {
    container: {
      animate: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
      }
    }
  }
};

// ============================================================================
// CSS ANIMATIONS (Lightweight alternatives)
// ============================================================================

export const CSS_ANIMATIONS = {
  classes: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideIn: 'animate-slide-in',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping'
  },

  // Custom keyframes for Tailwind config
  keyframes: {
    'fade-in': {
      'from': { opacity: '0' },
      'to': { opacity: '1' }
    },
    'slide-up': {
      'from': { opacity: '0', transform: 'translateY(20px)' },
      'to': { opacity: '1', transform: 'translateY(0)' }
    },
    'slide-in': {
      'from': { opacity: '0', transform: 'translateX(20px)' },
      'to': { opacity: '1', transform: 'translateX(0)' }
    }
  }
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

export const ANIMATION_UTILS = {
  // Create stagger delay
  createStaggerDelay: (index, baseDelay = 0.1) => index * baseDelay,

  // Create responsive animation (faster on mobile)
  createResponsiveAnimation: (baseAnimation, mobileDuration = 0.2) => ({
    ...baseAnimation,
    transition: {
      ...baseAnimation.transition,
      duration: typeof window !== 'undefined' && window.innerWidth < 768 
        ? mobileDuration 
        : baseAnimation.transition.duration
    }
  }),

  // Combine animations
  combineAnimations: (...animations) => {
    return animations.reduce((combined, animation) => ({
      ...combined,
      ...animation
    }), {});
  }
};

// Export aliases for backward compatibility
export const COMPONENT_ANIMATIONS_ALIAS = COMPONENT_ANIMATIONS;
export const MICRO_ANIMATIONS_ALIAS = MICRO_ANIMATIONS;