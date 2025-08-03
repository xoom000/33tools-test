import { MOCK_SYNC_VALIDATION_DATA } from '../constants/syncDemo';
import { useModalManager } from './useModalManager';
import logger from '../utils/logger';

// COMPOSE, NEVER DUPLICATE - Sync Validation Demo Business Logic! ⚔️
export const useSyncValidationDemo = () => {
  // EXTEND useModalManager - COMPOSE, NEVER DUPLICATE! ⚔️
  const { modals, openModal, closeModal } = useModalManager({
    showSyncValidationModal: false
  });

  const handleOpenModal = () => {
    logger.info('Opening sync validation modal');
    openModal('SyncValidationModal');
  };

  const handleCloseModal = () => {
    logger.info('Closing sync validation modal');
    closeModal('SyncValidationModal');
  };

  const handleExecuteSync = (selectedChanges) => {
    logger.info('Executing sync with selected changes', { 
      selectedChanges,
      totalChanges: selectedChanges?.length || 0 
    });
    
    // Here you would actually execute the database sync
    // For demo purposes, we just log and close
    closeModal('SyncValidationModal');
  };

  return {
    // Data
    validationData: MOCK_SYNC_VALIDATION_DATA,
    
    // State
    isModalOpen: modals.showSyncValidationModal,
    
    // Actions
    handleOpenModal,
    handleCloseModal,
    handleExecuteSync
  };
};