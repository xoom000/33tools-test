import React from 'react';
import { AnimatedContainer } from '../../animations';
import { StatsGrid, ChecklistCard, ProgressBar } from '../../ui';
import NextServiceCard from '../customer-portal/NextServiceCard';
import ItemsGrid from '../customer-portal/ItemsGrid';
import { MORNING_CHECKLIST } from '../../../utils/constants';
import { VARIANTS } from '../../../theme';
import { cn } from '../../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Morning Workspace Content Renderer! ⚔️
const MorningWorkspaceContentRenderer = ({
  user,
  stats,
  generateMorningPrep,
  // Load List section props
  loadListProps,
  // Uniform Orders section props
  uniformOrdersProps,
  // Customer Notes section props
  customerNotesProps,
  // Checklist props
  checklistProps
}) => {
  return (
    <AnimatedContainer variant="fadeIn">
      {/* EXTEND NextServiceCard - COMPOSE, NEVER DUPLICATE! ⚔️ */}
      <NextServiceCard
        title="🌅 Today's Route"
        deliveryDay={`Route ${user?.route_id || 'N/A'}`}
        message="Review your morning checklist and load requirements. Everything is ready for a successful route!"
        buttonText="Refresh Data"
        onButtonClick={generateMorningPrep}
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* EXTEND ItemsGrid for Load List - COMPOSE, NEVER DUPLICATE! ⚔️ */}
        <ItemsGrid {...loadListProps} />

        {/* EXTEND ItemsGrid for Uniform Orders - COMPOSE, NEVER DUPLICATE! ⚔️ */}
        <ItemsGrid {...uniformOrdersProps} />

        {/* EXTEND ItemsGrid for Customer Notes - COMPOSE, NEVER DUPLICATE! ⚔️ */}
        <ItemsGrid {...customerNotesProps} />

        {/* EXTEND ChecklistCard - COMPOSE, NEVER DUPLICATE! ⚔️ */}
        <ChecklistCard
          title="Morning Checklist"
          icon="✅"
          items={MORNING_CHECKLIST}
          className="lg:col-span-2 xl:col-span-1"
          {...checklistProps}
        />

        {/* EXTEND StatsGrid + ProgressBar - COMPOSE, NEVER DUPLICATE! ⚔️ */}
        <div className={cn(VARIANTS.card.elevated, 'p-6 lg:col-span-2')}>
          <h2 className="text-xl font-semibold mb-4">🎯 Preparation Status</h2>
          
          <StatsGrid stats={stats} columns={4} className="mb-6" />
          
          <ProgressBar
            current={stats[0]?.value ? parseInt(stats[0].value) : 0}
            total={100}
            label="Overall Readiness"
            showSteps={false}
            className="mb-2"
          />
          <div className="text-xs text-slate-500 text-center">
            Ready to start your route with confidence!
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default MorningWorkspaceContentRenderer;