import React from 'react';
import { CustomerModal, ItemModal } from './AdminModals';
import { TokenGenerator } from '../tokens';
import SyncValidationModal from './SyncValidationModal';
import ConfigureOrderingModal from './ConfigureOrderingModal';
import AddItemSearchModal from './AddItemSearchModal';

const ModalRenderer = ({
  modals,
  closeModal,
  currentRoute,
  selectedCustomer,
  setSelectedCustomer,
  toast,
  // Modal-specific props
  customerModalProps,
  itemModalProps,
  tokenGeneratorProps,
  syncModalProps,
  configureOrderingProps,
  addItemSearchProps
}) => {
  return (
    <>
      {/* Customer Management Modals */}
      <CustomerModal
        isOpen={modals.showAddCustomer}
        onClose={() => closeModal('addCustomer')}
        {...customerModalProps}
      />

      <CustomerModal
        isOpen={modals.showEditCustomer}
        onClose={() => {
          closeModal('editCustomer');
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        {...customerModalProps}
      />

      <ItemModal
        isOpen={modals.showAddItem}
        onClose={() => {
          closeModal('addItem');
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        {...itemModalProps}
      />

      {/* Route 33 Only Modals */}
      {currentRoute === 33 && (
        <>
          <TokenGenerator
            isOpen={modals.showTokenGenerator}
            onClose={() => closeModal('tokenGenerator')}
            {...tokenGeneratorProps}
          />

          <SyncValidationModal
            isOpen={modals.showSyncModal}
            onClose={() => closeModal('syncModal')}
            validationData={null}
            onExecuteSync={(selectedChanges) => {
              console.log('Executing sync with changes:', selectedChanges);
              toast({ type: 'success', message: 'CSV sync completed successfully!' });
              closeModal('syncModal');
            }}
            {...syncModalProps}
          />
        </>
      )}

      {/* Configure Ordering Modal */}
      <ConfigureOrderingModal
        isOpen={modals.showConfigureOrdering}
        onClose={() => closeModal('configureOrdering')}
        {...configureOrderingProps}
      />

      {/* Add Item Search Modal */}
      <AddItemSearchModal
        {...addItemSearchProps}
      />
    </>
  );
};

export default React.memo(ModalRenderer);