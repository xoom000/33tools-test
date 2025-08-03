// Lightweight animation utilities to replace heavy Framer Motion usage
// Only use Framer Motion for complex animations, CSS for simple ones

export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 }
};

export const slideUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 }
};

export const slideInAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.2 }
};

// CSS classes for simple animations (lighter than Framer Motion)
export const cssAnimations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideIn: 'animate-slide-in',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce'
};

// Simple hover effects using CSS instead of Framer Motion
export const hoverEffects = {
  scale: 'hover:scale-105 transition-transform duration-200',
  shadow: 'hover:shadow-lg transition-shadow duration-200',
  lift: 'hover:-translate-y-1 transition-transform duration-200',
  glow: 'hover:shadow-xl transition-shadow duration-200'
};