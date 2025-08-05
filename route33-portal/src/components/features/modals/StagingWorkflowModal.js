import React, { useEffect, useCallback } from 'react';
import { Modal, StateRenderer, StatsGrid, StatsCard, ModalDescription, SectionDivider, EmptyState, TabContainer } from '../../ui';
import { useStagingWorkflow } from '../../../hooks/useStagingWorkflow';
import { TYPOGRAPHY, LAYOUT, SPACING } from '../../../theme';
import { WORKFLOW_STEPS, WORKFLOW_STEP_DESCRIPTIONS, WORKFLOW_ACTIONS, WORKFLOW_ICONS, FILE_UPLOAD_CONFIG } from '../../../constants/workflow';
import { STATUS_COLORS, COMPONENT_STATES, LOADING_MESSAGES } from '../../../constants/ui';
import { ROUTE_CONFIG, DATABASE_OPERATIONS } from '../../../constants/business';
import { MODAL_CONFIGS } from '../../../config/modalConfigs';
import { COMPONENT_CONFIGS } from '../../../config/componentConfigs';
import FileUploadStep from '../database-update/components/FileUploadStep';
import StepProgress from '../database-update/components/StepProgress';
import { cn } from '../../../utils/classNames';

// REFACTORED VERSION - COMPOSE NOT DUPLICATE ⚔️
const StagingWorkflowModal = ({ isOpen, onClose, routeNumber = ROUTE_CONFIG.DEFAULT_ROUTE }) => {
  // Use the business logic hook - COMPOSE NOT DUPLICATE
  const {
    workflowStep,
    selectedFile,
    batchId,
    loading,
    stagingStats,
    setWorkflowStep,
    resetWorkflow,
    handleFileSelect,
    executeRouteOptimizationStaging,
    executeInventoryPopulation
  } = useStagingWorkflow(routeNumber);

  // Reset modal when closed - use the hook's reset function
  useEffect(() => {
    if (!isOpen) {
      resetWorkflow();
    }
  }, [isOpen, resetWorkflow]);

  // Memoized event handlers for performance
  const handleInventoryFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) executeInventoryPopulation(file);
  }, [executeInventoryPopulation]);

  const handleBackToStaging = useCallback(() => {
    setWorkflowStep(WORKFLOW_STEPS.STAGING);
  }, [setWorkflowStep]);

  // All business logic now handled by the hook - COMPOSE NOT DUPLICATE

  // NO CUSTOM COMPONENTS - FULL UI COMPOSITION! ⚔️

  // RENDER STAGING RESULTS - FULL UI COMPOSITION
  const renderStagingStep = () => (
    <SectionDivider 
      title={WORKFLOW_STEP_DESCRIPTIONS[WORKFLOW_STEPS.STAGING].title}
      centered={true}
      className="space-y-6"
    >
      <ModalDescription>
        {WORKFLOW_STEP_DESCRIPTIONS[WORKFLOW_STEPS.STAGING].description}
      </ModalDescription>
      
      <StatsGrid 
        stats={stagingStats.map(stat => ({
          title: stat.label,
          value: stat.value,
          color: stat.color === 'green' ? STATUS_COLORS.SUCCESS : 
                 stat.color === 'red' ? STATUS_COLORS.ERROR : STATUS_COLORS.WARNING,
          ...COMPONENT_CONFIGS.statsCards[stat.label.toLowerCase().replace(' ', '')]?.config
        }))}
        columns={COMPONENT_CONFIGS.grids.stats.columns}
      />

      <FileUploadStep
        selectedFile={null}
        onFileSelect={handleInventoryFileSelect}
        title={FILE_UPLOAD_CONFIG.CUSTOMER_MASTER_ANALYSIS.title}
        description={FILE_UPLOAD_CONFIG.CUSTOMER_MASTER_ANALYSIS.description}
        acceptedTypes={FILE_UPLOAD_CONFIG.CUSTOMER_MASTER_ANALYSIS.acceptedTypes}
        loading={loading}
      />

      <div className="text-center text-sm text-slate-500">
        Batch ID: <code className="font-mono bg-slate-100 px-2 py-1 rounded">{batchId}</code>
      </div>
    </SectionDivider>
  );

  // Validation step removed - handled by separate DriverValidationModal

  // RENDER COMPLETE STEP - FULL UI COMPOSITION
  const renderCompleteStep = () => (
    <EmptyState
      variant="centered"  
      icon={WORKFLOW_ICONS.SUCCESS}
      title={WORKFLOW_STEP_DESCRIPTIONS[WORKFLOW_STEPS.COMPLETE].title}
      message={WORKFLOW_STEP_DESCRIPTIONS[WORKFLOW_STEPS.COMPLETE].description}
      actionText={WORKFLOW_ACTIONS.CLOSE}
      onAction={onClose}
    />
  );

  // RENDER CONTENT BY STEP
  const renderContent = () => {
    switch (workflowStep) {
      case WORKFLOW_STEPS.UPLOAD:
        return (
          <FileUploadStep
            selectedFile={selectedFile}
            onFileSelect={(e) => {
              const file = e.target.files[0];
              if (file) handleFileSelect(file);
            }}
            onNext={executeRouteOptimizationStaging}
            loading={loading}
            title={WORKFLOW_STEP_DESCRIPTIONS[WORKFLOW_STEPS.UPLOAD].title}
            description={WORKFLOW_STEP_DESCRIPTIONS[WORKFLOW_STEPS.UPLOAD].description}
          />
        );
      case WORKFLOW_STEPS.STAGING:
        return renderStagingStep();
      case WORKFLOW_STEPS.COMPLETE:
        return renderCompleteStep();
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={MODAL_CONFIGS.stagingWorkflow.size}>
      <div className={LAYOUT.padding.card}>
        <h2 className={cn(TYPOGRAPHY.sizes['2xl'], TYPOGRAPHY.weights.bold, 'flex items-center text-slate-800 mb-6')}
            style={{ gap: SPACING.sm }}>
          {MODAL_CONFIGS.stagingWorkflow.title}
          <span className={cn(TYPOGRAPHY.sizes.sm, TYPOGRAPHY.weights.normal, 'text-slate-500')}>
            {MODAL_CONFIGS.stagingWorkflow.subtitle(routeNumber)}
          </span>
        </h2>

        <StepProgress currentStep={workflowStep} />

        <StateRenderer
          state={loading ? COMPONENT_STATES.LOADING : COMPONENT_STATES.SUCCESS}
          loadingMessage={LOADING_MESSAGES.PROCESSING}
        >
          {renderContent()}
        </StateRenderer>
      </div>
    </Modal>
  );
};

export default StagingWorkflowModal;