import React from 'react';
import { Button } from '../../../ui';

const FileUploadStep = ({ 
  selectedFile, 
  onFileSelect, 
  onNext, 
  loading,
  title = "Upload RouteOptimization CSV",
  description = "Upload the RouteOptimization CSV to analyze customer changes",
  acceptedTypes = ".csv"
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {title}
        </h3>
        <p className="text-slate-600">
          {description}
        </p>
      </div>

      {/* File Drop Zone - Using existing design pattern */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
        <div className="text-4xl mb-4">
          {selectedFile ? '📊' : '📁'}
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
              Drop file here or click to browse
            </p>
            <p className="text-sm text-slate-600">
              Supported: {acceptedTypes} files only
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept={acceptedTypes}
          onChange={onFileSelect}
          className="mt-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
        />
      </div>

      {selectedFile && (
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            onClick={onNext}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadStep;