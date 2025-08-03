import { motion } from 'framer-motion';
import { ANIMATIONS } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Single animated container for all components!
const AnimatedContainer = ({ 
  children, 
  variant = 'fadeIn',
  delay = 0,
  duration = 0.3,
  className = '',
  ...motionProps 
}) => {
  const getAnimation = () => {
    const baseAnimations = {
      fadeIn: ANIMATIONS.fadeIn,
      slideUp: ANIMATIONS.slideUp,
      slideDown: ANIMATIONS.slideDown,
      scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration }
      },
      slideLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration }
      },
      slideRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration }
      },
      stagger: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay }
      },
      // EXTEND - Header slide down pattern (ELIMINATE DUPLICATION!) ⚔️
      headerSlide: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration }
      },
      // EXTEND - Modal scale pattern ⚔️
      modalScale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.2 }
      },
      // EXTEND - Modal with slide (enhanced modal animation) ⚔️
      modalSlide: {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        transition: { duration: 0.2 }
      },
      // EXTEND - List item stagger ⚔️
      listItem: {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.2 }
      }
    };

    return baseAnimations[variant] || baseAnimations.fadeIn;
  };

  const animation = getAnimation();

  // EXTEND - Support for exit animations ⚔️
  const animationProps = {
    initial: animation.initial,
    animate: animation.animate,
    exit: animation.exit || animation.initial,
    transition: { ...animation.transition, delay },
    className,
    ...motionProps
  };

  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;