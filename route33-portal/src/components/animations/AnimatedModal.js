import React from 'react';
import AnimatedContainer from './AnimatedContainer';

// COMPOSE, NEVER DUPLICATE - Modal animation wrapper! ⚔️
const AnimatedModal = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <AnimatedContainer
      variant="modalScale"
      className={className}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
};

export default AnimatedModal;