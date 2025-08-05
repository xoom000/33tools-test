import { motion } from 'framer-motion';
import { ANIMATION_PRESETS, COMPONENT_ANIMATIONS, LAYOUT_ANIMATIONS } from '../../config/animationConfigs';

// COMPOSE, NEVER DUPLICATE - Animated container with configuration! ⚔️
// Uses centralized animation configs for consistency across all components
const AnimatedContainer = ({ 
  children, 
  variant = 'fadeIn',
  delay = 0,
  duration,
  className = '',
  stagger = false,
  ...motionProps 
}) => {
  const getAnimation = () => {
    // Get base animation from presets
    let animation = ANIMATION_PRESETS[variant];
    
    // Fallback to component or layout animations
    if (!animation) {
      // Check component animations
      const componentKeys = Object.keys(COMPONENT_ANIMATIONS);
      for (const key of componentKeys) {
        if (COMPONENT_ANIMATIONS[key][variant]) {
          animation = COMPONENT_ANIMATIONS[key][variant];
          break;
        }
      }
      
      // Check layout animations
      if (!animation && LAYOUT_ANIMATIONS[variant]) {
        animation = LAYOUT_ANIMATIONS[variant];
      }
    }
    
    // Fallback to fadeIn if nothing found
    animation = animation || ANIMATION_PRESETS.fadeIn;
    
    // Override duration if provided
    if (duration !== undefined) {
      animation = {
        ...animation,
        transition: { ...animation.transition, duration }
      };
    }
    
    // Add delay if provided
    if (delay > 0) {
      animation = {
        ...animation,
        transition: { ...animation.transition, delay }
      };
    }
    
    return animation;
  };

  const animation = getAnimation();

  // Build animation props with configuration support
  const animationProps = {
    initial: animation.initial,
    animate: animation.animate,
    exit: animation.exit || animation.initial,
    transition: animation.transition,
    className,
    ...motionProps
  };

  // Add stagger support for parent containers
  if (stagger) {
    animationProps.animate = {
      ...animationProps.animate,
      transition: {
        ...animationProps.transition,
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    };
  }

  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;