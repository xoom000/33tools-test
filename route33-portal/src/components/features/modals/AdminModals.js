import BaseFormModal from '../../forms/BaseFormModal';
import { FORM_CONFIGS } from '../../../config/formConfigs';

// COMPOSE, NEVER DUPLICATE - Customer modal using base component!
export const CustomerModal = ({ isOpen, onClose, customer = null, onSave }) => {
  const isEditing = !!customer;
  const config = FORM_CONFIGS.customer;
  
  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title(isEditing)}
      fields={config.fields}
      initialData={customer || {}}
      onSave={onSave}
      submitText={config.submitText}
      editingText={config.editingText}
      isEditing={isEditing}
    />
  );
};

// COMPOSE, NEVER DUPLICATE - Item modal using base component!
export const ItemModal = ({ isOpen, onClose, customer, item = null, onSave }) => {
  const isEditing = !!item;
  const config = FORM_CONFIGS.item;
  
  const handleSave = async (formData) => {
    await onSave({ ...formData, customer_number: customer.customer_number });
  };
  
  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title(isEditing)}
      fields={config.fields}
      initialData={item || {}}
      onSave={handleSave}
      submitText={config.submitText}
      editingText={config.editingText}
      isEditing={isEditing}
    />
  );
};

