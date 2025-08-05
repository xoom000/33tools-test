import { motion } from 'framer-motion';
import { MICRO_ANIMATIONS, CSS_ANIMATIONS } from '../../config/animationConfigs';
import { cn } from '../../utils/classNames';

// Simple, professional loading spinner - COMPOSE, NOT DUPLICATE!
const LoadingSpinner = ({ size = "small", className = "", useFramerMotion = false }) => {
  const sizes = {
    xs: "w-3 h-3",
    small: "w-4 h-4", 
    medium: "w-5 h-5",
    large: "w-6 h-6"
  };

  // Use Framer Motion for complex animations, CSS for simple ones
  if (useFramerMotion) {
    return (
      <motion.div 
        className={cn(sizes[size], "border-2 border-current border-t-transparent rounded-full opacity-75", className)}
        {...MICRO_ANIMATIONS.loading.spin}
      />
    );
  }

  // Default to CSS animation for better performance
  return (
    <div 
      className={cn(sizes[size], "border-2 border-current border-t-transparent rounded-full", CSS_ANIMATIONS.classes.spin, "opacity-75", className)}
    />
  );
};

export default LoadingSpinner;