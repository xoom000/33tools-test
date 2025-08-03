import React from 'react';
import { AnimatedContainer } from '../animations';
import { LAYOUT, VARIANTS } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Centralized page layout using theme system! ⚔️
const PageContainer = ({ 
  children,
  variant = 'elevated',
  maxWidth = 'sm',
  animation = 'slideUp',
  className = ''
}) => {
  const containerClass = LAYOUT.containers[maxWidth] || maxWidth;
  const cardClasses = `${VARIANTS.card[variant]} ${LAYOUT.padding.card} w-full ${containerClass} ${className}`;
  
  return (
    <div className={`${LAYOUT.backgrounds.page} flex items-center justify-center p-4`}>
      <AnimatedContainer
        variant={animation}
        className={cardClasses}
      >
        {children}
      </AnimatedContainer>
    </div>
  );
};

export default PageContainer;