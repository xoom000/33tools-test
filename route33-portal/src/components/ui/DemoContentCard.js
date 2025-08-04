import React from 'react';
import { AnimatedContainer } from '../animations';
import { VARIANTS, TYPOGRAPHY } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Demo Content Card with helpful hints! ⚔️
const DemoContentCard = ({ 
  title, 
  description, 
  children, 
  className = '',
  showHelpHint = true 
}) => {
  return (
    <AnimatedContainer variant="scaleIn" className={`${VARIANTS.card.elevated} p-8 ${className}`}>
      {title && (
        <h1 className={`${TYPOGRAPHY.heading.h2} text-slate-800 mb-4`}>
          {title}
        </h1>
      )}
      
      {description && (
        <p className={`${TYPOGRAPHY.body.large} text-slate-600 mb-6`}>
          {description}
        </p>
      )}
      
      {showHelpHint && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-lg">💡</div>
            <div className="text-sm text-blue-700">
              <strong>Onboarding Tip:</strong> This demo shows how our components work together. 
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