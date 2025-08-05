// COMPOSE, NEVER DUPLICATE - Animation hooks for consistent motion! ⚔️
import { useMemo } from 'react';
import { 
  ANIMATION_PRESETS, 
  COMPONENT_ANIMATIONS, 
  MICRO_ANIMATIONS,
  STAGGER_CONFIGS,
  ANIMATION_UTILS
} from '../config/animationConfigs';

// Custom hook for getting standardized animations
export const useAnimations = () => {
  return useMemo(() => ({
    // Basic animation presets
    presets: ANIMATION_PRESETS,
    
    // Component-specific animations
    components: COMPONENT_ANIMATIONS,
    
    // Micro-interactions
    micro: MICRO_ANIMATIONS,
    
    // Stagger configurations
    stagger: STAGGER_CONFIGS,
    
    // Utility functions
    utils: ANIMATION_UTILS,
    
    // Quick access to commonly used animations
    quick: {
      fadeIn: ANIMATION_PRESETS.fadeIn,
      slideUp: ANIMATION_PRESETS.slideUp,
      modalBackdrop: COMPONENT_ANIMATIONS.modal.backdrop,
      modalContent: COMPONENT_ANIMATIONS.modal.content,
      buttonHover: COMPONENT_ANIMATIONS.button.hover,
      buttonTap: COMPONENT_ANIMATIONS.button.tap,
      cardHover: COMPONENT_ANIMATIONS.card.hover,
      listStagger: STAGGER_CONFIGS.list,
      loadingSpin: MICRO_ANIMATIONS.loading.spin
    }
  }), []);
};

// Hook for getting animations by component type
export const useComponentAnimations = (componentType) => {
  return useMemo(() => {
    const animations = COMPONENT_ANIMATIONS[componentType] || {};
    
    // Add utility methods for this component type
    return {
      ...animations,
      
      // Get animation with custom delay
      withDelay: (animationKey, delay) => ({
        ...animations[animationKey],
        transition: {
          ...animations[animationKey]?.transition,
          delay
        }
      }),
      
      // Get animation with custom duration
      withDuration: (animationKey, duration) => ({
        ...animations[animationKey],
        transition: {
          ...animations[animationKey]?.transition,
          duration
        }
      }),
      
      // Combine multiple animations
      combine: (...animationKeys) => {
        return animationKeys.reduce((combined, key) => ({
          ...combined,
          ...animations[key]
        }), {});
      }
    };
  }, [componentType]);
};

// Hook for list/grid stagger animations
export const useStaggerAnimation = (type = 'list', itemCount = 0) => {
  return useMemo(() => {
    const staggerConfig = STAGGER_CONFIGS[type] || STAGGER_CONFIGS.list;
    
    return {
      container: staggerConfig.container,
      
      // Generate item animation with calculated delay
      getItemAnimation: (index) => ({
        ...ANIMATION_PRESETS.staggerChild,
        transition: {
          ...ANIMATION_PRESETS.staggerChild.transition,
          delay: ANIMATION_UTILS.createStaggerDelay(index)
        }
      }),
      
      // Get all item animations at once
      getAllItemAnimations: () => {
        return Array.from({ length: itemCount }, (_, index) => ({
          index,
          animation: {
            ...ANIMATION_PRESETS.staggerChild,
            transition: {
              ...ANIMATION_PRESETS.staggerChild.transition,
              delay: ANIMATION_UTILS.createStaggerDelay(index)
            }
          }
        }));
      }
    };
  }, [type, itemCount]);
};

// Hook for responsive animations (lighter on mobile)
export const useResponsiveAnimation = (baseAnimation) => {
  return useMemo(() => {
    if (typeof window === 'undefined') return baseAnimation;
    
    return ANIMATION_UTILS.createResponsiveAnimation(baseAnimation);
  }, [baseAnimation]);
};

// Hook for combining multiple animation objects
export const useCombinedAnimations = (...animations) => {
  return useMemo(() => {
    return ANIMATION_UTILS.combineAnimations(...animations);
  }, [animations]);
};

export default useAnimations;