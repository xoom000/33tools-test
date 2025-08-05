import React, { useRef, useState } from 'react';
import { cn } from '../../utils/classNames';
import Button from './Button';
import { useToast } from '../../contexts/ToastContext';

// 🚀 DEV TRANSFER BUTTON - Quick file upload for development
// DELETE THIS COMPONENT BEFORE PRODUCTION
const DevTransferButton = ({ className = '' }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/dev-transfer/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          console.log('🚀 ABOUT TO ADD SUCCESS TOAST:', file.name);
          addToast(`📁 Uploaded: ${file.name}`, { type: 'success', duration: 10000 });
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      addToast(`❌ Upload failed: ${error.message}`, { type: 'error', duration: 10000 });
    } finally {
      setUploading(false);
      // Clear the input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const handleClick = async () => {
    // Open file selector directly - no need to check since it's integrated
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="outline"
        size="small"
        onClick={handleClick}
        disabled={uploading}
        className={cn(className)}
      >
        {uploading ? '📤 Uploading...' : '📁 Transfer'}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="*/*"
      />
    </>
  );
};

export default DevTransferButton;