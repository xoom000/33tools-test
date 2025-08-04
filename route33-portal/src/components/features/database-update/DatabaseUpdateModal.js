import React, { useState, useCallback } from 'react';
import { Modal, Button, StateRenderer } from '../../ui';
import { databaseUpdateService } from '../../../services/databaseUpdateService';
import { useToast } from '../../../contexts/ToastContext';

// COMPOSE, NEVER DUPLICATE - Ultimate Database Update Interface! ⚔️
const DatabaseUpdateModal = ({ isOpen, onClose }) => {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, preview, applying
  const [selectedFile, setSelectedFile] = useState(null);
  const [updateType, setUpdateType] = useState('customers');
  const [previewData, setPreviewData] = useState(null);
  const [updateOptions, setUpdateOptions] = useState({
    testMode: true, // Always start in test mode
    backupFirst: true,
    validateData: true
  });

  const { addToast } = useToast();

  // FILE SELECTION HANDLER
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = databaseUpdateService.validateFile(file);
    if (!validation.isValid) {
      addToast(validation.error, 'error');
      return;
    }

    setSelectedFile(file);
    addToast(`File selected: ${file.name}`, 'info');
  }, [addToast]);

  // PREVIEW UPDATES
  const handlePreview = useCallback(async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    try {
      const preview = await databaseUpdateService.previewUpdates(
        selectedFile, 
        updateType, 
        updateOptions
      );
      
      setPreviewData(preview);
      setUploadState('preview');
      addToast(`Preview generated: ${preview.totalChanges} potential changes`, 'success');
    } catch (error) {
      addToast(`Preview failed: ${error.message}`, 'error');
      setUploadState('idle');
    }
  }, [selectedFile, updateType, updateOptions, addToast]);

  // APPLY UPDATES
  const handleApply = useCallback(async () => {
    if (!previewData) return;

    setUploadState('applying');
    try {
      const result = await databaseUpdateService.applyUpdates(
        previewData.updateId,
        previewData.selectedChanges
      );
      
      addToast(`Database updated: ${result.appliedChanges} changes applied`, 'success');
      onClose();
      setUploadState('idle');
      setSelectedFile(null);
      setPreviewData(null);
    } catch (error) {
      addToast(`Update failed: ${error.message}`, 'error');
      setUploadState('preview'); // Back to preview state
    }
  }, [previewData, addToast, onClose]);

  // RESET MODAL
  const handleReset = useCallback(() => {
    setUploadState('idle');
    setSelectedFile(null);
    setPreviewData(null);
  }, []);

  // RENDER FILE UPLOAD AREA
  const renderFileUpload = () => (
    <div className="space-y-4">
      {/* File Drop Zone */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
        <div className="text-4xl mb-4">
          {selectedFile ? databaseUpdateService.getFormatIcon(selectedFile.name) : '📁'}
        </div>
        
        {selectedFile ? (
          <div>
            <p className="text-lg font-semibold text-slate-800">{selectedFile.name}</p>
            <p className="text-sm text-slate-600">
              {(selectedFile.size / 1024).toFixed(1)} KB • Ready to process
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-slate-800 mb-2">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-slate-600">
              Supported: CSV, XML, XLSX, Images (JPG, PNG, PDF)
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept=".csv,.xml,.xlsx,.jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
          className="mt-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
        />
      </div>

      {/* Update Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Update Type
        </label>
        <select
          value={updateType}
          onChange={(e) => setUpdateType(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        >
          {databaseUpdateService.getUpdateTypeOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Options</label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={updateOptions.testMode}
            onChange={(e) => setUpdateOptions(prev => ({ ...prev, testMode: e.target.checked }))}
            className="rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">Test mode (use testing database)</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={updateOptions.backupFirst}
            onChange={(e) => setUpdateOptions(prev => ({ ...prev, backupFirst: e.target.checked }))}
            className="rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">Create backup before updating</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={updateOptions.validateData}
            onChange={(e) => setUpdateOptions(prev => ({ ...prev, validateData: e.target.checked }))}
            className="rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">Validate data integrity</span>
        </label>
      </div>
    </div>
  );

  // RENDER PREVIEW RESULTS
  const renderPreview = () => (
    <div className="space-y-4">
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h3 className="font-semibold text-primary-800 mb-2">📊 Preview Results</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-primary-700">Total Changes:</span>
            <span className="font-semibold ml-2">{previewData?.totalChanges || 0}</span>
          </div>
          <div>
            <span className="text-primary-700">New Records:</span>
            <span className="font-semibold ml-2">{previewData?.newRecords || 0}</span>
          </div>
          <div>
            <span className="text-primary-700">Updates:</span>
            <span className="font-semibold ml-2">{previewData?.updates || 0}</span>
          </div>
          <div>
            <span className="text-primary-700">Conflicts:</span>
            <span className="font-semibold ml-2">{previewData?.conflicts || 0}</span>
          </div>
        </div>
      </div>

      {previewData?.changes && (
        <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">Action</th>
                <th className="px-3 py-2 text-left">Record</th>
                <th className="px-3 py-2 text-left">Changes</th>
              </tr>
            </thead>
            <tbody>
              {previewData.changes.slice(0, 10).map((change, index) => (
                <tr key={index} className="border-t border-slate-200">
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      change.action === 'create' ? 'bg-green-100 text-green-800' :
                      change.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {change.action}
                    </span>
                  </td>
                  <td className="px-3 py-2">{change.record}</td>
                  <td className="px-3 py-2 text-slate-600">{change.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {previewData.changes.length > 10 && (
            <div className="p-3 text-center text-sm text-slate-500">
              ... and {previewData.changes.length - 10} more changes
            </div>
          )}
        </div>
      )}
    </div>
  );

  // RENDER MODAL ACTIONS
  const renderActions = () => {
    if (uploadState === 'idle') {
      return (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePreview}
            disabled={!selectedFile}
          >
            Preview Changes
          </Button>
        </div>
      );
    }

    if (uploadState === 'preview') {
      return (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleReset}>
            Start Over
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleApply}
            disabled={!previewData || previewData.conflicts > 0}
          >
            Apply Updates
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          🗄️ Database Update System
        </h2>

        <StateRenderer
          state={uploadState === 'uploading' || uploadState === 'applying' ? 'loading' : 'success'}
          loadingMessage={
            uploadState === 'uploading' ? 'Analyzing file...' : 
            uploadState === 'applying' ? 'Applying updates...' : undefined
          }
        >
          {uploadState === 'preview' ? renderPreview() : renderFileUpload()}
        </StateRenderer>

        <div className="flex justify-end mt-6">
          {renderActions()}
        </div>
      </div>
    </Modal>
  );
};

export default DatabaseUpdateModal;