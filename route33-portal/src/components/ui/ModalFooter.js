import React from 'react';
import { cn } from '../../utils/classNames';
import ButtonGroup from './ButtonGroup';
import { FLEX_LAYOUTS, SPACING_PATTERNS } from '../../config/layoutConfigs';

// COMPOSE, NEVER DUPLICATE - Modal footer base component! ⚔️
const ModalFooter = ({ 
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: cn(FLEX_LAYOUTS.header.between, 'mt-6 pt-4 border-t border-slate-200'),
    centered: cn(FLEX_LAYOUTS.header.center, 'mt-6 pt-4 border-t border-slate-200'),
    right: cn(FLEX_LAYOUTS.header.end, 'mt-6 pt-4 border-t border-slate-200'),
    simple: cn(FLEX_LAYOUTS.header.end, 'mt-6', SPACING_PATTERNS.gap.normal)
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
};

// COMPOSE, NEVER DUPLICATE - Footer with status counter and actions! ⚔️
export const ModalFooterWithCounter = ({
  count,
  itemName = 'items',
  actionText = 'selected',
  primaryButton,
  secondaryButton,
  variant = 'default'
}) => {
  const buttons = [
    secondaryButton && { ...secondaryButton, variant: secondaryButton.variant || 'secondary' },
    primaryButton && { ...primaryButton, variant: primaryButton.variant || 'primary' }
  ].filter(Boolean);

  return (
    <ModalFooter variant={variant}>
      <p className="text-sm text-slate-600">
        <span className="font-semibold">{count}</span> {itemName} {actionText}
      </p>
      <ButtonGroup buttons={buttons} />
    </ModalFooter>
  );
};

// COMPOSE, NEVER DUPLICATE - Simple action footer! ⚔️ 
export const ModalFooterActions = ({
  primaryButton,
  secondaryButton,
  variant = 'right'
}) => {
  const buttons = [
    secondaryButton && { ...secondaryButton, variant: secondaryButton.variant || 'secondary' },
    primaryButton && { ...primaryButton, variant: primaryButton.variant || 'primary' }
  ].filter(Boolean);

  return (
    <ModalFooter variant={variant}>
      <ButtonGroup buttons={buttons} />
    </ModalFooter>
  );
};

export default ModalFooter;