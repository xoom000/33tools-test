import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Edit, AlertTriangle, Upload } from 'lucide-react';

const SyncValidator = ({ validationData, onExecuteSync }) => {
  const [selectedChanges, setSelectedChanges] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    additions: true,
    removals: false,
    updates: true
  });

  // Initialize selected changes based on default_checked
  useEffect(() => {
    if (!validationData) return;
    
    const initialSelections = {};
    
    ['additions', 'removals', 'updates'].forEach(type => {
      validationData.changes[type].forEach(change => {
        const key = `${type}_${change.customer_number}`;
        initialSelections[key] = change.default_checked || false;
      });
    });
    
    setSelectedChanges(initialSelections);
  }, [validationData]);

  const handleToggleChange = (type, customerNumber) => {
    const key = `${type}_${customerNumber}`;
    setSelectedChanges(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAll = (type, checked) => {
    const updates = {};
    validationData.changes[type].forEach(change => {
      const key = `${type}_${change.customer_number}`;
      updates[key] = checked;
    });
    setSelectedChanges(prev => ({ ...prev, ...updates }));
  };

  const getSelectedCount = (type) => {
    return validationData.changes[type].filter(change => {
      const key = `${type}_${change.customer_number}`;
      return selectedChanges[key];
    }).length;
  };

  const renderChangeItem = (change, type) => {
    const key = `${type}_${change.customer_number}`;
    const isSelected = selectedChanges[key] || false;
    
    const getIcon = () => {
      switch (type) {
        case 'additions': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'removals': return <XCircle className="w-4 h-4 text-red-500" />;
        case 'updates': return <Edit className="w-4 h-4 text-blue-500" />;
        default: return null;
      }
    };

    const getRiskColor = () => {
      switch (change.risk_level) {
        case 'HIGH': return 'border-red-200 bg-red-50';
        case 'MEDIUM': return 'border-yellow-200 bg-yellow-50';
        case 'LOW': return 'border-green-200 bg-green-50';
        default: return 'border-gray-200 bg-gray-50';
      }
    };

    return (
      <div
        key={key}
        className={`p-3 border rounded-lg ${getRiskColor()} ${
          isSelected ? 'ring-2 ring-blue-300' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleToggleChange(type, change.customer_number)}
            className="mt-1"
          />
          {getIcon()}
          <div className="flex-1">
            <div className="font-medium">
              {change.customer_number}: {change.account_name}
            </div>
            <div className="text-sm text-gray-600">
              Route {change.route_number} • {change.address}, {change.city}
            </div>
            
            {/* Show updates details */}
            {type === 'updates' && change.changes && (
              <div className="mt-2 space-y-1">
                {change.changes.map((update, idx) => (
                  <div key={idx} className="text-xs bg-white p-2 rounded border">
                    <span className="font-medium">{update.field}:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-red-600 line-through">
                        "{update.old_value}"
                      </span>
                      <span>→</span>
                      <span className="text-green-600 font-medium">
                        "{update.new_value}"
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Show warnings */}
            {change.warning && (
              <div className="mt-2 flex items-center gap-2 text-orange-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {change.warning}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (type, title, icon, description) => {
    const changes = validationData.changes[type] || [];
    const selectedCount = getSelectedCount(type);
    const isExpanded = expandedSections[type];
    
    return (
      <div className="border rounded-lg">
        <div
          className="p-4 bg-gray-50 cursor-pointer flex items-center justify-between"
          onClick={() => setExpandedSections(prev => ({ ...prev, [type]: !prev[type] }))}
        >
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {selectedCount} of {changes.length} selected
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll(type, selectedCount < changes.length);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {selectedCount < changes.length ? 'Select All' : 'Deselect All'}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {changes.map(change => renderChangeItem(change, type))}
          </div>
        )}
      </div>
    );
  };

  if (!validationData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Upload className="w-8 h-8 text-gray-400 mr-3" />
        <span className="text-gray-600">Upload a RouteOptimization CSV to begin sync validation</span>
      </div>
    );
  }

  const totalSelected = Object.values(selectedChanges).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Summary Header */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Database Sync Validation</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {getSelectedCount('additions')}
            </div>
            <div className="text-sm text-gray-600">Additions</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {getSelectedCount('removals')}
            </div>
            <div className="text-sm text-gray-600">Removals</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {getSelectedCount('updates')}
            </div>
            <div className="text-sm text-gray-600">Updates</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {totalSelected}
            </div>
            <div className="text-sm text-gray-600">Total Selected</div>
          </div>
        </div>
      </div>

      {/* Change Sections */}
      <div className="space-y-6">
        {renderSection(
          'additions',
          'New Customers',
          <CheckCircle className="w-6 h-6 text-green-500" />,
          'Customers found in CSV but not in database (safe to add)'
        )}
        
        {renderSection(
          'removals',
          'Remove Customers',
          <XCircle className="w-6 h-6 text-red-500" />,
          'Customers in database but not in CSV (requires validation)'
        )}
        
        {renderSection(
          'updates',
          'Update Existing',
          <Edit className="w-6 h-6 text-blue-500" />,
          'Customers with changed information (address, name, etc.)'
        )}
      </div>

      {/* Execute Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => onExecuteSync(selectedChanges)}
          disabled={totalSelected === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            totalSelected > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Execute Sync ({totalSelected} changes)
        </button>
      </div>
    </div>
  );
};

export default SyncValidator;