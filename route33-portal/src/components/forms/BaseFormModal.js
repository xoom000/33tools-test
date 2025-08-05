import React from 'react';
import { Button, Modal } from '../ui';
import { useBaseFormLogic } from './BaseFormLogic';
import { FieldRenderer } from './FieldRenderer';
import { FORM_BUTTONS } from '../../config';

// COMPOSE, NEVER DUPLICATE - Single form modal for all types!
const BaseFormModal = ({ 
  isOpen, 
  onClose, 
  title,
  fields,
  initialData = {},
  onSave,
  size = "large",
  submitText = "Save",
  editingText = "Update",
  isEditing = false
}) => {
  // EXTEND useBaseFormLogic - COMPOSE, NEVER DUPLICATE! ⚔️
  const { formData, loading, error, handleChange, handleSubmit } = useBaseFormLogic({
    fields,
    initialData,
    onSave,
    onClose
  });

  // EXTEND FieldRenderer - COMPOSE, NEVER DUPLICATE! ⚔️
  const renderField = (field) => (
    <FieldRenderer 
      key={field.name}
      field={field} 
      formData={formData} 
      onFieldChange={handleChange} 
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields && Array.isArray(fields) ? fields.map(renderField) : null}
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
        
        <div className={FORM_BUTTONS.layouts.horizontal}>
          <Button
            {...FORM_BUTTONS.actions.cancel}
            onClick={onClose}
            className="flex-1"
          >
            {FORM_BUTTONS.actions.cancel.label}
          </Button>
          <Button
            {...FORM_BUTTONS.actions.submit.primary}
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {isEditing ? editingText : submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BaseFormModal;