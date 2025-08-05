import { useState, useCallback } from 'react';
import { databaseUpdateService } from '../services/databaseUpdateService';
import { useToast } from '../contexts/ToastContext';
import { useAsyncOperation } from './useAsyncOperation';

// COMPOSE NOT DUPLICATE - Staging Workflow Business Logic Hook ⚔️
export const useStagingWorkflow = (routeNumber = 33) => {
  // Optimized state initialization with initializer functions where beneficial
  const [workflowStep, setWorkflowStep] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [stagingResults, setStagingResults] = useState(() => ({}));
  const [pendingChanges, setPendingChanges] = useState(null);
  const [selectedChanges, setSelectedChanges] = useState(() => ({}));

  const { addToast } = useToast();
  
  // Use existing async operation pattern instead of manual loading state
  const stagingOperation = useAsyncOperation({ logContext: 'StagingWorkflow' });
  const inventoryOperation = useAsyncOperation({ logContext: 'InventoryPopulation' });
  const validationOperation = useAsyncOperation({ logContext: 'ChangeValidation' });

  // RESET WORKFLOW STATE
  const resetWorkflow = useCallback(() => {
    setWorkflowStep('upload');
    setSelectedFile(null);
    setBatchId(null);
    setStagingResults({});
    setPendingChanges(null);
    setSelectedChanges({});
    stagingOperation.reset();
    inventoryOperation.reset();
    validationOperation.reset();
  }, [stagingOperation, inventoryOperation, validationOperation]);

  // FILE VALIDATION AND SELECTION
  const handleFileSelect = useCallback((file) => {
    if (!file) return false;

    const validation = databaseUpdateService.validateFile(file);
    if (!validation.isValid) {
      addToast(validation.error, 'error');
      return false;
    }

    setSelectedFile(file);
    addToast(`File selected: ${file.name}`, 'info');
    return true;
  }, [addToast]);

  // STAGE 1: ROUTE OPTIMIZATION ANALYSIS - Using existing async operation pattern
  const executeRouteOptimizationStaging = useCallback(async () => {
    if (!selectedFile) return false;

    setWorkflowStep('staging');
    
    try {
      const result = await stagingOperation.execute({
        operation: async () => {
          const generatedBatchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
          setBatchId(generatedBatchId);

          // Define staging operations - COMPOSE existing service methods
          const operations = [
            { name: 'Customer Additions', key: 'shells', fn: () => databaseUpdateService.stageCustomerShells(selectedFile, { batchId: generatedBatchId }) },
            { name: 'Customer Removals', key: 'removals', fn: () => databaseUpdateService.stageCustomerRemovals(selectedFile, { batchId: generatedBatchId }) },
            { name: 'Customer Updates', key: 'updates', fn: () => databaseUpdateService.stageCustomerUpdates(selectedFile, { batchId: generatedBatchId }) }
          ];

          // Execute operations sequentially with progress updates
          const results = {};
          for (const operation of operations) {
            addToast(`Staging ${operation.name.toLowerCase()}...`, 'info');
            results[operation.key] = await operation.fn();
          }

          return results;
        },
        successMessage: 'Route optimization staging complete!',
        errorMessage: 'Staging failed',
        showSuccessToast: true,
        showErrorToast: true,
        toast: { success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error') },
        logSuccess: { message: 'Route optimization staging completed', data: { routeNumber, fileSize: selectedFile?.size } },
        logError: { message: 'Route optimization staging failed', data: { routeNumber } }
      });

      setStagingResults(result);
      return true;
      
    } catch (error) {
      setWorkflowStep('upload');
      return false;
    }
  }, [selectedFile, addToast, stagingOperation, routeNumber]);

  // STAGE 2: INVENTORY POPULATION - Using async operation pattern
  const executeInventoryPopulation = useCallback(async (inventoryFile) => {
    if (!batchId || !inventoryFile) return false;

    const isValidFile = handleFileSelect(inventoryFile);
    if (!isValidFile) return false;

    try {
      const result = await inventoryOperation.execute({
        operation: async () => {
          const result = await databaseUpdateService.stageInventoryPopulation(inventoryFile, batchId);
          return result;
        },
        successMessage: 'Inventory population complete! All changes staged for driver validation.',
        errorMessage: 'Inventory population failed',
        showSuccessToast: true,
        showErrorToast: true,
        toast: { success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error') },
        logSuccess: { message: 'Inventory population completed', data: { routeNumber, batchId } },
        logError: { message: 'Inventory population failed', data: { routeNumber, batchId } }
      });

      setStagingResults(prev => ({ ...prev, inventory: result }));
      setWorkflowStep('complete');
      return true;
      
    } catch (error) {
      return false;
    }
  }, [batchId, routeNumber, addToast, handleFileSelect, inventoryOperation]);

  // Note: Validation logic removed - handled by separate DriverValidationModal

  // COMPUTED VALUES (simplified for staging-only workflow)

  const stagingStats = [
    { 
      label: 'Customer Additions', 
      value: stagingResults.shells?.shells_staged || 0,
      color: 'green'
    },
    { 
      label: 'Customer Removals', 
      value: stagingResults.removals?.removals_staged || 0,
      color: 'red'
    },
    { 
      label: 'Customer Updates', 
      value: stagingResults.updates?.updates_staged || 0,
      color: 'yellow'
    }
  ];

  return {
    // State
    workflowStep,
    selectedFile,
    batchId,
    stagingResults,
    pendingChanges,
    selectedChanges,
    
    // Loading states from async operations (COMPOSE NOT DUPLICATE)
    loading: stagingOperation.loading || inventoryOperation.loading,
    stagingLoading: stagingOperation.loading,
    inventoryLoading: inventoryOperation.loading,
    
    // Error states from async operations
    error: stagingOperation.error || inventoryOperation.error,
    
    // Computed values
    stagingStats,
    
    // Actions
    setWorkflowStep,
    resetWorkflow,
    handleFileSelect,
    executeRouteOptimizationStaging,
    executeInventoryPopulation
  };
};