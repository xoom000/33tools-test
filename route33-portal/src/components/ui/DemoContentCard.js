import React from 'react';
import { cn } from '../../utils/classNames';
import { AnimatedContainer } from '../animations';
import { CARD_CONFIGS } from '../../config/cardConfigs';

// COMPOSE, NEVER DUPLICATE - Demo Content Card with helpful hints! ⚔️
const DemoContentCard = ({ 
  title, 
  description, 
  children, 
  className = '',
  showHelpHint = true 
}) => {
  return (
    <AnimatedContainer variant={CARD_CONFIGS.demo.animation} className={cn(CARD_CONFIGS.demo.container, className)}>
      {title && (
        <h1 className={CARD_CONFIGS.demo.header.title}>
          {title}
        </h1>
      )}
      
      {description && (
        <p className={CARD_CONFIGS.demo.header.description}>
          {description}
        </p>
      )}
      
      {showHelpHint && (
        <div className={CARD_CONFIGS.demo.helpHint.container}>
          <div className={CARD_CONFIGS.demo.helpHint.layout}>
            <div className={CARD_CONFIGS.demo.helpHint.icon}>💡</div>
            <div className={CARD_CONFIGS.demo.helpHint.content}>
              <span className={CARD_CONFIGS.demo.helpHint.title}>Onboarding Tip:</span> This demo shows how our components work together. 
              Feel free to explore and test the functionality!
            </div>
          </div>
        </div>
      )}
      
      {children}
    </AnimatedContainer>
  );
};

export default DemoContentCard;