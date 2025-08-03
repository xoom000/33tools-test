import React from 'react';
import { BaseFormModal } from '../../forms';
import { FORM_CONFIGS } from '../../../config/formConfigs';

// COMPOSE, NEVER DUPLICATE - Login Modal Renderer like ModalRenderer! ⚔️
const LoginModalRenderer = ({
  modals,
  tokenData,
  closeModal,
  // Modal handlers
  onTokenValidation,
  onAccountSetup,
  onDemoAccess
}) => {
  return (
    <>
      {/* COMPOSE, NEVER DUPLICATE! Token Entry - 46 lines → 6 lines! ♻️ */}
      <BaseFormModal
        isOpen={modals.showTokenModal}
        onClose={() => closeModal('TokenModal')}
        onSave={onTokenValidation}
        {...FORM_CONFIGS.tokenSetup}
      />

      {/* COMPOSE, NEVER DUPLICATE! Account Setup - 58 lines → 8 lines! ♻️ */}
      <BaseFormModal
        isOpen={modals.showAccountSetupModal}
        onClose={() => closeModal('AccountSetupModal')}
        onSave={onAccountSetup}
        title={`Welcome ${tokenData.validatedDriver?.name}!`}
        showCloseButton={false}
        {...FORM_CONFIGS.accountSetup}
      />

      {/* COMPOSE, NEVER DUPLICATE! Demo Modal - 52 lines → 6 lines! ♻️ */}
      <BaseFormModal
        isOpen={modals.showDemoModal}
        onClose={() => closeModal('DemoModal')}
        onSave={onDemoAccess}
        {...FORM_CONFIGS.demoSetup}
      />
    </>
  );
};

export default LoginModalRenderer;