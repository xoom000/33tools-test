import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';
import { TAB_CONFIGS, TAB_STYLES } from '../../../config/tabConfigs';
import { GRID_SYSTEMS } from '../../../config/layoutConfigs';
import { cn } from '../../../utils/classNames';
import { PerformanceTester } from '../../profiler';

// COMPOSE, NEVER DUPLICATE - Admin Tab with Configuration! ⚔️
const AdminTab = ({ 
  onShowStagingWorkflow,
  onManageDrivers,
  onViewReports
}) => {
  const config = TAB_CONFIGS.admin;
  const actionHandlers = {
    staging: onShowStagingWorkflow,
    drivers: onManageDrivers,
    reports: onViewReports
  };

  return (
    <motion.div
      {...TAB_STYLES.content.animation}
      className={TAB_STYLES.content.container}
    >
      <div className={TAB_STYLES.panel.withPadding}>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          {config.header.title}
        </h2>
        {config.header.subtitle && (
          <p className="text-sm text-slate-600 mb-6">
            {config.header.subtitle}
          </p>
        )}
        
        <div className={cn(GRID_SYSTEMS.content.container, 'grid-cols-1 md:grid-cols-3')}>
          {config.content.sections.map((section, index) => (
            <div 
              key={index}
              className={cn(
                'p-4 bg-slate-50 rounded-xl',
                {
                  'md:col-span-1 ring-2 ring-primary-100': section.featured
                }
              )}
            >
              <h4 className="font-semibold text-slate-800 mb-2">
                {section.title}
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                {section.description}
              </p>
              <Button 
                variant={section.action.variant} 
                size={section.action.size}
                onClick={actionHandlers[section.action.key]}
                className={section.action.className}
              >
                {section.action.label}
              </Button>
            </div>
          ))}
        </div>
        
        {/* Performance Testing Panel */}
        <div className="mt-8">
          <PerformanceTester />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminTab;