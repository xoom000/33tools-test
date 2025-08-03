import React from 'react';
import { DemoContentCard, Button } from '../../ui';

// COMPOSE, NEVER DUPLICATE - Sync Validation Demo Content Renderer! ⚔️
const SyncValidationDemoContentRenderer = ({ 
  onOpenModal 
}) => {
  return (
    <DemoContentCard
      title="Database Sync Validation Demo"
      description="This demonstrates the sync validation modal using your existing Modal and Button components."
      showHelpHint={true}
    >
      <Button 
        variant="primary" 
        onClick={onOpenModal}
      >
        Review Database Changes
      </Button>
    </DemoContentCard>
  );
};

export default SyncValidationDemoContentRenderer;