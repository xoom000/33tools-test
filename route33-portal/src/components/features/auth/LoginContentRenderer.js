import React from 'react';
import { ButtonGroup, SectionDivider } from '../../ui';
import { BaseForm, BaseFormModal } from '../../forms';
import { FORM_CONFIGS, BUTTON_CONFIGS } from '../../../config/formConfigs';
import LoginHeader from './LoginHeader';

// COMPOSE, NEVER DUPLICATE - Login Content Renderer like TabContentRenderer! ⚔️
const LoginContentRenderer = ({
  loginType,
  onCustomerLogin,
  onDriverLogin,
  onButtonAction,
  onCloseDriverModal,
  className = ""
}) => {
  return (
    <div className={className}>
      {/* COMPOSE, NEVER DUPLICATE - Header component! ⚔️ */}
      <LoginHeader />

      {/* COMPOSE, NEVER DUPLICATE! Customer Login - 40 lines → 6 lines! ⚔️ */}
      <BaseForm
        onSave={onCustomerLogin}
        showTitle={false}
        {...FORM_CONFIGS.customerLogin}
      />

      {/* COMPOSE, NEVER DUPLICATE! Driver Options - 10 lines → 6 lines! ⚔️ */}
      <SectionDivider title={BUTTON_CONFIGS.loginOptions.title}>
        <ButtonGroup
          buttons={BUTTON_CONFIGS.loginOptions.buttons.map(btn => ({
            ...btn,
            onClick: () => onButtonAction(btn.key)
          }))}
          size={BUTTON_CONFIGS.loginOptions.size}
        />
      </SectionDivider>

      {/* COMPOSE, NEVER DUPLICATE! Driver Login Modal - 52 lines → 6 lines! ⚔️ */}
      <BaseFormModal
        isOpen={loginType === 'driver'}
        onClose={onCloseDriverModal}
        onSave={onDriverLogin}
        {...FORM_CONFIGS.driverLogin}
      />
    </div>
  );
};

export default LoginContentRenderer;