import React, { useState, useCallback } from 'react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import { LoadingSpinner } from '../../animations';

const RouteOptimizationUpload = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.name.toLowerCase().endsWith('.csv')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a CSV file');
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/database-update/route-optimization-compare', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResults(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="RouteOptimization Customer Comparison">
      <div className="space-y-6">
        {!results ? (
          <>
            {/* File Upload Area */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
                ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                ${error ? 'border-red-300 bg-red-50' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-gray-900">
                      Upload RouteOptimization CSV
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag and drop or click to select
                    </p>
                  </label>
                </div>
                
                {file && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-900">
                        {file.name}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? <LoadingSpinner size="sm" /> : 'Compare Data'}
              </Button>
            </div>
          </>
        ) : (
          /* Results Display */
          <RouteOptimizationResults 
            results={results} 
            onReset={handleReset}
            onClose={handleClose}
          />
        )}
      </div>
    </Modal>
  );
};

const RouteOptimizationResults = ({ results, onReset, onClose }) => {
  const { summary, customers_to_add, customers_to_remove, actions_needed } = results;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.csv_customers}</div>
          <div className="text-sm text-blue-800">CSV Customers</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{summary.database_customers}</div>
          <div className="text-sm text-green-800">DB Customers</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{summary.customers_to_add}</div>
          <div className="text-sm text-orange-800">To Add</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{summary.customers_to_remove}</div>
          <div className="text-sm text-red-800">To Review</div>
        </div>
      </div>

      {/* Action Plan */}
      {actions_needed && actions_needed.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
          <div className="space-y-2">
            {actions_needed.map((action, index) => (
              <div key={index} className={`
                flex items-center justify-between p-3 rounded border-l-4
                ${action.priority === 'HIGH' ? 'border-red-400 bg-red-50' : 
                  action.priority === 'MEDIUM' ? 'border-orange-400 bg-orange-50' : 
                  'border-blue-400 bg-blue-50'}
              `}>
                <div>
                  <div className="font-medium">{action.description}</div>
                  <div className="text-sm text-gray-600">
                    {action.count > 0 && `${action.count} items • `}
                    Est. time: {action.estimated_time}
                  </div>
                </div>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded
                  ${action.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 
                    action.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' : 
                    'bg-blue-100 text-blue-800'}
                `}>
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {customers_to_add.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-600">
              Customers to Add ({customers_to_add.length})
            </h3>
            <div className="bg-white border rounded-lg max-h-60 overflow-y-auto">
              {customers_to_add.slice(0, 10).map((customer, index) => (
                <div key={index} className="p-3 border-b last:border-b-0">
                  <div className="font-medium">#{customer.customer_number}</div>
                  <div className="text-sm text-gray-600">{customer.account_name}</div>
                  <div className="text-xs text-gray-500">
                    {customer.city}, {customer.state} • {customer.service_days}
                  </div>
                </div>
              ))}
              {customers_to_add.length > 10 && (
                <div className="p-3 text-center text-sm text-gray-500">
                  ... and {customers_to_add.length - 10} more
                </div>
              )}
            </div>
          </div>
        )}

        {customers_to_remove.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-600">
              Customers to Review ({customers_to_remove.length})
            </h3>
            <div className="bg-white border rounded-lg max-h-60 overflow-y-auto">
              {customers_to_remove.slice(0, 10).map((customer, index) => (
                <div key={index} className="p-3 border-b last:border-b-0">
                  <div className="font-medium">#{customer.customer_number}</div>
                  <div className="text-sm text-gray-600">{customer.account_name}</div>
                  <div className="text-xs text-gray-500">
                    {customer.city} • Active: {customer.is_active ? 'Yes' : 'No'}
                  </div>
                </div>
              ))}
              {customers_to_remove.length > 10 && (
                <div className="p-3 text-center text-sm text-gray-500">
                  ... and {customers_to_remove.length - 10} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onReset}>
          Upload Another File
        </Button>
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default RouteOptimizationUpload;