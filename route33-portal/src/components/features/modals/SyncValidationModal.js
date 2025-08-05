import React, { useState, useMemo } from 'react';
import { Modal, Button } from '../../ui';
import { MODAL_CONFIGS } from '../../../config/modalConfigs';
import { cn } from '../../../utils/classNames';

const SyncValidationModal = ({ isOpen, onClose, validationData, onExecuteSync }) => {
  const [selectedChanges, setSelectedChanges] = useState({});

  // Initialize selections based on validation data defaults
  React.useEffect(() => {
    if (!validationData) return;
    
    const initialSelections = {};
    
    // Group changes by route for easier management
    Object.entries(validationData.changes).forEach(([changeType, changes]) => {
      changes.forEach(change => {
        const key = `${changeType}_${change.customer_number}`;
        initialSelections[key] = change.default_checked || false;
      });
    });
    
    setSelectedChanges(initialSelections);
  }, [validationData]);

  // Group changes by route
  const changesByRoute = useMemo(() => {
    if (!validationData) return {};
    
    const routes = {};
    
    Object.entries(validationData.changes).forEach(([changeType, changes]) => {
      changes.forEach(change => {
        const routeNum = change.route_number;
        if (!routes[routeNum]) {
          routes[routeNum] = { additions: [], removals: [], updates: [] };
        }
        routes[routeNum][changeType].push(change);
      });
    });
    
    return routes;
  }, [validationData]);

  const handleToggleChange = (changeType, customerNumber) => {
    const key = `${changeType}_${customerNumber}`;
    setSelectedChanges(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAllForRoute = (routeNum, changeType, selected) => {
    const updates = {};
    changesByRoute[routeNum][changeType].forEach(change => {
      const key = `${changeType}_${change.customer_number}`;
      updates[key] = selected;
    });
    setSelectedChanges(prev => ({ ...prev, ...updates }));
  };

  // Memoize selected counts for performance
  const selectedCounts = useMemo(() => {
    const counts = {};
    Object.keys(changesByRoute).forEach(routeNum => {
      counts[routeNum] = {};
      ['additions', 'removals', 'updates'].forEach(changeType => {
        counts[routeNum][changeType] = changesByRoute[routeNum][changeType]?.filter(change => {
          const key = `${changeType}_${change.customer_number}`;
          return selectedChanges[key];
        }).length || 0;
      });
    });
    return counts;
  }, [changesByRoute, selectedChanges]);

  const getSelectedCount = (routeNum, changeType) => {
    return selectedCounts[routeNum]?.[changeType] || 0;
  };

  // Memoize total selected count
  const totalSelected = useMemo(() => {
    return Object.values(selectedChanges).filter(Boolean).length;
  }, [selectedChanges]);

  const getTotalSelected = () => {
    return totalSelected;
  };

  const renderRouteSection = (routeNum) => {
    const route = changesByRoute[routeNum];
    const addCount = getSelectedCount(routeNum, 'additions');
    const removeCount = getSelectedCount(routeNum, 'removals');
    const updateCount = getSelectedCount(routeNum, 'updates');

    return (
      <div key={routeNum} className="border border-slate-200 rounded-lg bg-white overflow-hidden mb-4">
        {/* Route Header */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800">Route {routeNum}</h4>
            <div className="flex gap-2">
              {route.additions.length > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-slate-200 text-slate-600 rounded">
                  +{addCount}
                </span>
              )}
              {route.removals.length > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-slate-200 text-slate-600 rounded">
                  -{removeCount}
                </span>
              )}
              {route.updates.length > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-slate-200 text-slate-600 rounded">
                  ~{updateCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Route Changes */}
        <div className="p-4 space-y-4">
          {/* Additions */}
          {route.additions.length > 0 && (
            <div className="border border-slate-100 rounded">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {MODAL_CONFIGS.syncValidation.stats.types.additions.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {MODAL_CONFIGS.syncValidation.stats.types.additions.label} ({route.additions.length})
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={addCount === route.additions.length}
                  onChange={(e) => handleSelectAllForRoute(routeNum, 'additions', e.target.checked)}
                  className="accent-slate-800"
                />
              </div>
              <div className="max-h-24 overflow-y-auto">
                {route.additions.map(change => (
                  <div key={change.customer_number} className="flex items-center gap-3 px-3 py-2 border-b border-slate-50 last:border-b-0 hover:bg-slate-25">
                    <input
                      type="checkbox"
                      checked={selectedChanges[`additions_${change.customer_number}`] || false}
                      onChange={() => handleToggleChange('additions', change.customer_number)}
                      className="accent-slate-800"
                    />
                    <span className="font-medium text-slate-800 min-w-16">
                      {change.customer_number}
                    </span>
                    <span className="text-slate-600 text-sm flex-1">
                      {change.account_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removals */}
          {route.removals.length > 0 && (
            <div className="border border-slate-100 rounded">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {MODAL_CONFIGS.syncValidation.stats.types.removals.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {MODAL_CONFIGS.syncValidation.stats.types.removals.label} ({route.removals.length})
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={removeCount === route.removals.length}
                  onChange={(e) => handleSelectAllForRoute(routeNum, 'removals', e.target.checked)}
                  className="accent-slate-800"
                />
              </div>
              <div className="max-h-24 overflow-y-auto">
                {route.removals.map(change => (
                  <div key={change.customer_number} className="flex items-center gap-3 px-3 py-2 border-b border-slate-50 last:border-b-0 hover:bg-slate-25">
                    <input
                      type="checkbox"
                      checked={selectedChanges[`removals_${change.customer_number}`] || false}
                      onChange={() => handleToggleChange('removals', change.customer_number)}
                      className="accent-slate-800"
                    />
                    <span className="font-medium text-slate-800 min-w-16">
                      {change.customer_number}
                    </span>
                    <span className="text-slate-600 text-sm flex-1">
                      {change.account_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Updates */}
          {route.updates.length > 0 && (
            <div className="border border-slate-100 rounded">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">
                    {MODAL_CONFIGS.syncValidation.stats.types.updates.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {MODAL_CONFIGS.syncValidation.stats.types.updates.label} ({route.updates.length})
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={updateCount === route.updates.length}
                  onChange={(e) => handleSelectAllForRoute(routeNum, 'updates', e.target.checked)}
                  className="accent-slate-800"
                />
              </div>
              <div className="max-h-24 overflow-y-auto">
                {route.updates.map(change => (
                  <div key={change.customer_number} className="flex items-center gap-3 px-3 py-2 border-b border-slate-50 last:border-b-0 hover:bg-slate-25">
                    <input
                      type="checkbox"
                      checked={selectedChanges[`updates_${change.customer_number}`] || false}
                      onChange={() => handleToggleChange('updates', change.customer_number)}
                      className="accent-slate-800"
                    />
                    <span className="font-medium text-slate-800 min-w-16">
                      {change.customer_number}
                    </span>
                    <span className="text-slate-600 text-sm flex-1">
                      {change.account_name}
                    </span>
                    {change.changes && (
                      <span className="text-xs text-slate-500 italic">
                        {change.changes.map(c => c.field).join(', ')} updated
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!validationData) return null;

  const finalTotalSelected = getTotalSelected();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      {...MODAL_CONFIGS.syncValidation}
      title={MODAL_CONFIGS.syncValidation.title}
    >
      <div className="space-y-4">
        <p className="text-slate-600 text-sm">
          {MODAL_CONFIGS.syncValidation.subtitle}
        </p>

        {/* Summary Stats - Using Configuration */}
        <div className={cn('grid gap-4 p-4 bg-slate-50 rounded-lg', `grid-cols-${MODAL_CONFIGS.syncValidation.stats.columns}`)}>
          {Object.entries(MODAL_CONFIGS.syncValidation.stats.types).map(([type, config]) => {
            const count = Object.entries(selectedChanges).filter(([key, selected]) => 
              selected && key.startsWith(`${type}_`)
            ).length;
            
            return (
              <div key={type} className="text-center">
                <div className="text-xl font-semibold text-slate-800">
                  {count}
                </div>
                <div className="text-sm text-slate-600">{config.label}</div>
              </div>
            );
          })}
        </div>

        {/* Routes */}
        <div className="max-h-96 overflow-y-auto space-y-0">
          {Object.keys(changesByRoute)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(renderRouteSection)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            {getTotalSelected()} changes selected
          </div>
          <div className="space-x-3">
            <Button 
              variant={MODAL_CONFIGS.syncValidation.actions.cancel.variant}
              onClick={onClose}
            >
              {MODAL_CONFIGS.syncValidation.actions.cancel.text}
            </Button>
            <Button 
              variant={MODAL_CONFIGS.syncValidation.actions.apply.variant}
              onClick={() => onExecuteSync(selectedChanges)}
              disabled={finalTotalSelected === 0}
            >
              {typeof MODAL_CONFIGS.syncValidation.actions.apply.text === 'function' 
                ? MODAL_CONFIGS.syncValidation.actions.apply.text(finalTotalSelected)
                : MODAL_CONFIGS.syncValidation.actions.apply.text}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SyncValidationModal;