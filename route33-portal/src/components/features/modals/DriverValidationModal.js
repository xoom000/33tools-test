import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, EmptyState, LoadingSkeleton, Badge } from '../../ui';
import { usePendingChanges } from '../../../hooks/usePendingChanges';
import { cn } from '../../../utils/classNames';

const DriverValidationModal = ({ isOpen, onClose, routeNumber }) => {
  const {
    pendingChanges,
    totalPending,
    loading,
    error,
    validateChanges,
    fetchPendingChanges
  } = usePendingChanges(routeNumber);

  const [selectedChanges, setSelectedChanges] = useState({});
  const [validating, setValidating] = useState(false);

  // Reset selections when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedChanges({});
    }
  }, [isOpen]);

  const handleToggleChange = useCallback((changeId) => {
    setSelectedChanges(prev => ({
      ...prev,
      [changeId]: !prev[changeId]
    }));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!pendingChanges?.all_changes) return;
    
    const allSelected = {};
    pendingChanges.all_changes.forEach(change => {
      allSelected[change.id] = true;
    });
    setSelectedChanges(allSelected);
  }, [pendingChanges]);

  const handleDeselectAll = useCallback(() => {
    setSelectedChanges({});
  }, []);

  const selectedCount = useMemo(() => {
    return Object.values(selectedChanges).filter(Boolean).length;
  }, [selectedChanges]);

  const handleValidateChanges = useCallback(async () => {
    const approvedIds = Object.keys(selectedChanges)
      .filter(id => selectedChanges[id])
      .map(Number);
    
    if (approvedIds.length === 0) {
      return;
    }

    setValidating(true);
    const success = await validateChanges(approvedIds);
    setValidating(false);
    
    if (success) {
      setSelectedChanges({});
      if (totalPending === 0) {
        onClose();
      }
    }
  }, [selectedChanges, validateChanges, totalPending, onClose]);

  const getChangeTypeIcon = (changeType) => {
    switch (changeType) {
      case 'addition': return '➕';
      case 'removal': return '➖';
      case 'update': return '✏️';
      case 'inventory': return '📦';
      default: return '🔄';
    }
  };

  const getChangeTypeColor = (changeType) => {
    switch (changeType) {
      case 'addition': return 'bg-green-100 text-green-800 border-green-200';
      case 'removal': return 'bg-red-100 text-red-800 border-red-200';
      case 'update': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inventory': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const renderChangeItem = (change, index) => {
    const isSelected = selectedChanges[change.id] || false;
    
    return (
      <div
        key={change.id || index}
        className={cn(
          'flex items-center justify-between p-4 border rounded-lg transition-all',
          isSelected 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-slate-200 bg-white hover:border-slate-300'
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getChangeTypeIcon(change.change_type)}</span>
            <Badge 
              variant="outline" 
              className={getChangeTypeColor(change.change_type)}
            >
              {change.change_type}
            </Badge>
            {change.customer_number && (
              <Badge variant="outline" className="bg-slate-100 text-slate-600">
                #{change.customer_number}
              </Badge>
            )}
          </div>
          
          <div className="font-medium text-slate-900 mb-1">
            {change.customer_name || `Change ${index + 1}`}
          </div>
          
          {change.change_data && (
            <div className="text-sm text-slate-600">
              {change.change_data.address && (
                <div>📍 {change.change_data.address}</div>
              )}
              {change.change_data.description && (
                <div>{change.change_data.description}</div>
              )}
            </div>
          )}
          
          <div className="text-xs text-slate-500 mt-1">
            Batch: {change.batch_id} • {new Date(change.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="ml-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleChange(change.id)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-slate-700">
              Approve
            </span>
          </label>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xlarge">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Driver Validation - Route {routeNumber}
            </h2>
            <p className="text-slate-600 mt-1">
              Review and approve pending changes before they are applied to the database
            </p>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={fetchPendingChanges}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}

        {loading && !pendingChanges ? (
          <LoadingSkeleton variant="list" lines={5} />
        ) : totalPending === 0 ? (
          <EmptyState
            variant="centered"
            icon="✅"
            title="No Pending Changes"
            message="All changes have been reviewed and validated."
            actionText="Close"
            onAction={onClose}
          />
        ) : (
          <>
            {/* Summary and Controls */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    {totalPending} Changes Pending Validation
                  </div>
                  <div className="text-sm text-slate-600">
                    {selectedCount} changes selected for approval
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={handleSelectAll}
                    disabled={loading}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={handleDeselectAll}
                    disabled={loading}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>

            {/* Changes List */}
            <div className="max-h-96 overflow-y-auto space-y-3 mb-6">
              {pendingChanges?.all_changes?.map(renderChangeItem)}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={validating}
              >
                Close
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleValidateChanges}
                  disabled={selectedCount === 0 || validating}
                  className="min-w-[120px]"
                >
                  {validating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Applying...
                    </div>
                  ) : (
                    `Apply ${selectedCount} Changes`
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DriverValidationModal;