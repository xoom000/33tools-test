import React from 'react';
import BaseInput from './BaseInput';

// COMPOSE, NEVER DUPLICATE - Single field renderer for all forms! ⚔️
export const FieldRenderer = ({ field, formData, onFieldChange }) => {
  const commonProps = {
    key: field.name,
    label: field.label,
    value: formData[field.name],
    onChange: (e) => onFieldChange(field.name, e.target.value),
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
            onChange={(e) => onFieldChange(field.name, e.target.value)}
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
            onChange={(e) => onFieldChange(field.name, e.target.value)}
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
};