import React from 'react';
import { TYPOGRAPHY } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Consistent section breaks using theme! ⚔️
const SectionDivider = ({ 
  children,
  title,
  centered = true,
  spacing = 'mt-6 pt-4',
  borderStyle = 'border-t border-slate-100',
  titleStyle = `${TYPOGRAPHY.sizes.sm} text-slate-600 mb-3`,
  className = ''
}) => {
  const alignmentClass = centered ? 'text-center' : '';
  
  return (
    <div className={`${spacing} ${borderStyle} ${className}`}>
      <div className={alignmentClass}>
        {title && (
          <p className={titleStyle}>
            {title}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default SectionDivider;