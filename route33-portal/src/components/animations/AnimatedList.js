import React from 'react';
import AnimatedContainer from './AnimatedContainer';

// COMPOSE, NEVER DUPLICATE - List animation wrapper! ⚔️
const AnimatedList = ({ 
  children, 
  staggerDelay = 0.1,
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedContainer
          variant="listItem"
          delay={index * staggerDelay}
          key={index}
          {...props}
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  );
};

export default AnimatedList;