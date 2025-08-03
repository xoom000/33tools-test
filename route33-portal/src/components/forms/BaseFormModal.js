import React from 'react';
import { Button, Modal } from '../ui';
import { useBaseFormLogic } from './BaseFormLogic';
import { FieldRenderer } from './FieldRenderer';

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
          {fields.map(renderField)}
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
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