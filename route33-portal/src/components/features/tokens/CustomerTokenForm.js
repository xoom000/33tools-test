import BaseTokenForm from './BaseTokenForm';
import { TOKEN_FORM_CONFIGS } from '../../../config/tokenFormConfigs';

// COMPOSE, NOT DUPLICATE - Customer form using base component!
const CustomerTokenForm = (props) => {
  return (
    <BaseTokenForm 
      type="customer"
      {...TOKEN_FORM_CONFIGS.customer}
      {...props}
    />
  );
};

export default CustomerTokenForm;