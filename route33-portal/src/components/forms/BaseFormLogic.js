import { useState } from 'react';

// COMPOSE, NEVER DUPLICATE - Extract shared form logic! ⚔️
export const useBaseFormLogic = ({ 
  fields, 
  initialData = {},
  onSave,
  onClose = null 
}) => {
  const [formData, setFormData] = useState(() => {
    // Initialize with defaults + existing data
    const initial = {};
    // Safety check: ensure fields is an array before calling forEach
    if (fields && Array.isArray(fields)) {
      fields.forEach(field => {
        initial[field.name] = initialData[field.name] || field.defaultValue || '';
      });
    }
    return { ...initial, ...initialData };
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSave(formData);
      if (onClose) onClose(); // Only close if modal
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    setError
  };
};