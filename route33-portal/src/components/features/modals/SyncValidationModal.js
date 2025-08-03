import React, { useState, useMemo } from 'react';
import { Modal } from '../../ui';
import { Button } from '../../ui';

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

  const getSelectedCount = (routeNum, changeType) => {
    return changesByRoute[routeNum][changeType].filter(change => {
      const key = `${changeType}_${change.customer_number}`;
      return selectedChanges[key];
    }).length;
  };

  const getTotalSelected = () => {
    return Object.values(selectedChanges).filter(Boolean).length;
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
                  <span className="text-slate-600 font-medium">+</span>
                  <span className="text-sm font-medium text-slate-700">
                    New Customers ({route.additions.length})
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
                  <span className="text-slate-600 font-medium">-</span>
                  <span className="text-sm font-medium text-slate-700">
                    Remove Customers ({route.removals.length})
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
                  <span className="text-slate-600 font-medium">~</span>
                  <span className="text-sm font-medium text-slate-700">
                    Update Existing ({route.updates.length})
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

  const totalSelected = getTotalSelected();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Database Sync Validation"
      size="large"
      className="max-h-[80vh]"
    >
      <div className="space-y-4">
        <p className="text-slate-600 text-sm">
          Review changes before applying to database
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-800">
              {Object.values(selectedChanges).filter((selected, i) => 
                selected && Object.keys(selectedChanges)[i].startsWith('additions_')
              ).length}
            </div>
            <div className="text-sm text-slate-600">New Customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-800">
              {Object.values(selectedChanges).filter((selected, i) => 
                selected && Object.keys(selectedChanges)[i].startsWith('removals_')
              ).length}
            </div>
            <div className="text-sm text-slate-600">Remove Customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-800">
              {Object.values(selectedChanges).filter((selected, i) => 
                selected && Object.keys(selectedChanges)[i].startsWith('updates_')
              ).length}
            </div>
            <div className="text-sm text-slate-600">Updates</div>
          </div>
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
            {totalSelected} changes selected
          </div>
          <div className="space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => onExecuteSync(selectedChanges)}
              disabled={totalSelected === 0}
            >
              Apply Changes ({totalSelected})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SyncValidationModal;