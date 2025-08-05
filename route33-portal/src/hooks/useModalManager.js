import { useState } from 'react';

// COMPOSE, NEVER DUPLICATE - Generic modal management hook! ⚔️
export const useModalManager = (initialModals = {}) => {
  // Optimized state initialization with initializer function
  const [modals, setModals] = useState(() => ({
    // Default admin modals (for backward compatibility)
    showAddCustomer: false,
    showEditCustomer: false,
    showAddItem: false,
    showTokenGenerator: false,
    showSyncModal: false,
    showConfigureOrdering: false,
    showAddItemSearch: false,
    // Merge any custom modals
    ...initialModals
  }));

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [`show${modalName}`]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [`show${modalName}`]: false }));
  };

  const closeAllModals = () => {
    setModals(prev => {
      const closedModals = {};
      Object.keys(prev).forEach(key => {
        closedModals[key] = false;
      });
      return closedModals;
    });
  };

  const isAnyModalOpen = Object.values(modals).some(Boolean);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isAnyModalOpen
  };
};