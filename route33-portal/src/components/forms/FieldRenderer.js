import React from 'react';
import BaseInput from './BaseInput';
import { INPUT_STYLES, FIELD_TYPES } from '../../config';

// COMPOSE, NEVER DUPLICATE - Single field renderer for all forms! ⚔️
export const FieldRenderer = ({ field, formData, onFieldChange }) => {
  const styles = INPUT_STYLES.base;
  
  const commonProps = {
    key: field.name,
    label: field.label,
    value: formData[field.name] || '',
    onChange: (e) => onFieldChange(field.name, e.target.value),
    required: field.required,
    placeholder: field.placeholder,
    helperText: field.helperText,
    type: field.type
  };

  // Render different field types using configuration
  switch (field.type) {
    case FIELD_TYPES.SELECT:
      return (
        <div className={styles.container}>
          <label className={styles.label}>
            {field.label}
            {field.required && <span className={styles.requiredIndicator}>*</span>}
          </label>
          <select
            value={formData[field.name] || ''}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            className={styles.input}
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {field.helperText && (
            <p className={styles.helper}>{field.helperText}</p>
          )}
        </div>
      );
    
    case FIELD_TYPES.TEXTAREA:
      return (
        <div className={styles.container}>
          <label className={styles.label}>
            {field.label}
            {field.required && <span className={styles.requiredIndicator}>*</span>}
          </label>
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            className={styles.input}
            rows={field.rows || 3}
            required={field.required}
            placeholder={field.placeholder}
          />
          {field.helperText && (
            <p className={styles.helper}>{field.helperText}</p>
          )}
        </div>
      );
    
    case FIELD_TYPES.CHECKBOX:
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={field.name}
            checked={formData[field.name] || false}
            onChange={(e) => onFieldChange(field.name, e.target.checked)}
            className="h-4 w-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
          />
          <label htmlFor={field.name} className={styles.label}>
            {field.label}
          </label>
        </div>
      );
    
    case FIELD_TYPES.FILE:
      return (
        <div className={styles.container}>
          <label className={styles.label}>
            {field.label}
            {field.required && <span className={styles.requiredIndicator}>*</span>}
          </label>
          <input
            type="file"
            onChange={(e) => onFieldChange(field.name, e.target.files[0])}
            className={styles.input}
            required={field.required}
            accept={field.accept}
            multiple={field.multiple}
          />
          {field.helperText && (
            <p className={styles.helper}>{field.helperText}</p>
          )}
        </div>
      );
    
    default:
      return <BaseInput {...commonProps} />;
  }
};