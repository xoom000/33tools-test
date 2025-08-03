import React from 'react';
import AnimatedContainer from './AnimatedContainer';

// COMPOSE, NEVER DUPLICATE - Header animation wrapper! ⚔️
const AnimatedHeader = ({ 
  children, 
  className = '',
  delay = 0,
  ...props 
}) => {
  return (
    <AnimatedContainer
      variant="headerSlide"
      delay={delay}
      className={className}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
};

export default AnimatedHeader;