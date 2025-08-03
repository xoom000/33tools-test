import React from 'react';
import { Modal, CustomerSelectionGrid, ModalFooterWithCounter, ModalDescription } from '../../ui';
import { FORM_CONFIGS } from '../../../config/formConfigs';
import { useCustomerSelection } from '../../../hooks/useCustomerSelection';
import { useOrderConfiguration } from '../../../hooks/useOrderConfiguration';

// COMPOSE, NEVER DUPLICATE - Refactored modal using our standards!
const ConfigureOrderingModal = ({ 
  isOpen, 
  onClose, 
  customers = [], 
  availableServiceDays = [],
  onCustomersUpdated 
}) => {
  const config = FORM_CONFIGS.orderConfiguration;
  
  // Use our composable hooks
  const {
    selectedCustomers,
    customersByDay,
    handleSelectAll,
    handleClearAll,
    handleCustomerToggle,
    getSelectedCustomerNumbers,
    selectedCount
  } = useCustomerSelection(customers);

  const { saveOrderConfiguration } = useOrderConfiguration(onCustomersUpdated);

  const handleSave = async () => {
    const customerNumbers = getSelectedCustomerNumbers();
    const result = await saveOrderConfiguration(customerNumbers);
    
    if (result.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title()}
      size={config.size}
    >
      <ModalDescription>
        {config.description}
      </ModalDescription>
      
      <CustomerSelectionGrid
        customersByDay={customersByDay}
        selectedCustomers={selectedCustomers}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        onCustomerToggle={handleCustomerToggle}
        availableServiceDays={availableServiceDays}
      />

      <ModalFooterWithCounter
        count={selectedCount}
        itemName="customers"
        actionText="selected for ordering"
        secondaryButton={{
          text: config.cancelText,
          onClick: onClose
        }}
        primaryButton={{
          text: config.submitText,
          onClick: handleSave
        }}
      />
    </Modal>
  );
};

export default ConfigureOrderingModal;