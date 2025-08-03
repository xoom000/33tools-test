import React from 'react';
import ButtonGroup from './ButtonGroup';

// COMPOSE, NEVER DUPLICATE - Modal footer base component! ⚔️
const ModalFooter = ({ 
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'flex items-center justify-between mt-6 pt-4 border-t border-slate-200',
    centered: 'flex items-center justify-center mt-6 pt-4 border-t border-slate-200',
    right: 'flex items-center justify-end mt-6 pt-4 border-t border-slate-200',
    simple: 'flex items-center justify-end mt-6 gap-3'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
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