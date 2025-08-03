import { useState } from 'react';
import BaseInput from '../../forms/BaseInput';
import { Button } from '../../ui';

// COMPOSE, NOT DUPLICATE - Single token form for all types!
const BaseTokenForm = ({ 
  type, 
  title,
  fields,
  validation,
  description,
  routes = [],
  onGenerate, 
  onBack, 
  isLoading, 
  error 
}) => {
  const [formData, setFormData] = useState(() => {
    // Initialize with default values from field configs
    const initial = {};
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });

  const handleSubmit = () => {
    onGenerate(type, formData);
  };

  // Dynamic validation based on field configs
  const isValid = validation ? validation(formData) : true;

  const updateField = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      value: formData[field.name],
      onChange: (e) => updateField(field.name, e.target.value),
      required: field.required,
      placeholder: field.placeholder
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
              onChange={(e) => updateField(field.name, e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required={field.required}
            >
              <option value="">{field.placeholder || 'Choose...'}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {/* Special handling for routes */}
              {field.name === 'routeNumber' && routes.map(route => (
                <option key={route.route_number} value={route.route_number}>
                  Route {route.route_number} - {route.driver_name}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'number':
        return (
          <BaseInput
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
          />
        );
      
      default:
        return <BaseInput {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - COMPOSE, NOT DUPLICATE */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="small" onClick={onBack}>
          ← Back
        </Button>
        <h3 className="text-lg font-semibold text-slate-800">
          {title}
        </h3>
      </div>

      {/* Dynamic Fields */}
      <div className="space-y-4">
        {fields.map(renderField)}
        
        {description && (
          <p className="text-sm text-slate-600">
            {description}
          </p>
        )}
      </div>

      {/* Error Display - COMPOSE, NOT DUPLICATE */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons - COMPOSE, NOT DUPLICATE */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !isValid}
          loading={isLoading}
          loadingText="Generating..."
          className="flex-1"
        >
          Generate Token
        </Button>
      </div>
    </div>
  );
};

export default BaseTokenForm;