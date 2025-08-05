import React, { useState, useMemo, useCallback, memo } from 'react';
import { Button } from '../ui';
import BaseInput from './BaseInput';
import { cn } from '../../utils/classNames';

// COMPOSE, NEVER DUPLICATE - Embedded form (no modal wrapper) - Memoized for Performance ⚔️
const BaseForm = memo(({ 
  title,
  fields,
  initialData = {},
  onSave,
  submitText = "Save",
  editingText = "Update",
  isEditing = false,
  showTitle = true,
  className = ""
}) => {
  // Memoize initial form data calculation
  const initialFormData = useMemo(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.name] = initialData[field.name] || field.defaultValue || '';
    });
    return { ...initial, ...initialData };
  }, [fields, initialData]);

  const [formData, setFormData] = useState(initialFormData);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoized event handlers for performance
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error on change
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSave(formData);
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [onSave, formData]);

  // Memoized field rendering function for performance
  const renderField = useCallback((field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      value: formData[field.name],
      onChange: (e) => handleChange(field.name, e.target.value),
      required: field.required,
      placeholder: field.placeholder,
      type: field.type
    };

    switch (field.type) {
      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
            </label>
            <select
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required={field.required}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
            </label>
            <textarea
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={field.rows || 3}
              required={field.required}
              placeholder={field.placeholder}
            />
          </div>
        );
      
      default:
        return <BaseInput {...commonProps} />;
    }
  }, [formData, handleChange]);

  return (
    <div className={cn('', className)}>
      {showTitle && title && (
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {fields.map(renderField)}
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          {isEditing ? editingText : submitText}
        </Button>
      </form>
    </div>
  );
});

export default BaseForm;