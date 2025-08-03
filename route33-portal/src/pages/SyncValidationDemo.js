import React from 'react';
import { DemoPageLayout } from '../components/layout';
import { SyncValidationDemoContentRenderer } from '../components/features/sync-demo';
import { SyncValidationModal } from '../components/features/modals';
import { useSyncValidationDemo } from '../hooks/useSyncValidationDemo';

// COMPOSE, NEVER DUPLICATE - Pure Component Composition like AdminDashboard! ⚔️✨
const SyncValidationDemo = () => {
  // Custom hook - COMPOSE, NOT DUPLICATE!
  const {
    validationData,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleExecuteSync
  } = useSyncValidationDemo();

  return (
    <>
      <DemoPageLayout>
        <SyncValidationDemoContentRenderer 
          onOpenModal={handleOpenModal}
        />
      </DemoPageLayout>

      <SyncValidationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        validationData={validationData}
        onExecuteSync={handleExecuteSync}
      />
    </>
  );
};

export default SyncValidationDemo;