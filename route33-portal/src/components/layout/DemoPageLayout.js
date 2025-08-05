import React from 'react';
import { AnimatedContainer } from '../animations';
import { LAYOUT } from '../../theme';
import { cn } from '../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Demo/Onboarding Page Layout! ⚔️
const DemoPageLayout = ({ 
  children, 
  maxWidth = 'sm', // Use LAYOUT.containers
  animation = 'fadeIn',
  className = '' 
}) => {
  const containerClass = LAYOUT.containers[maxWidth] || maxWidth;
  
  return (
    <div className={cn(LAYOUT.backgrounds.page, LAYOUT.padding.page)}>
      <div className={cn(containerClass, 'mx-auto')}>
        <AnimatedContainer variant={animation} className={className}>
          {children}
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default DemoPageLayout;