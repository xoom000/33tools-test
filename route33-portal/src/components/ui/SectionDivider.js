import React from 'react';
import { cn } from '../../utils/classNames';
import { STYLE_PRESETS } from '../../config/styleConfigs';

// COMPOSE, NEVER DUPLICATE - Consistent section breaks using theme! ⚔️
const SectionDivider = ({ 
  children,
  title,
  centered = true,
  spacing = STYLE_PRESETS.sectionDivider.spacing,
  borderStyle = STYLE_PRESETS.sectionDivider.border,
  titleStyle = STYLE_PRESETS.sectionDivider.title,
  className = ''
}) => {
  const alignmentClass = centered ? 'text-center' : '';
  
  return (
    <div className={cn(spacing, borderStyle, className)}>
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