import BaseTokenForm from './BaseTokenForm';
import { TOKEN_FORM_CONFIGS } from '../../../config/tokenFormConfigs';

// COMPOSE, NOT DUPLICATE - Driver form using base component!
const DriverTokenForm = (props) => {
  return (
    <BaseTokenForm 
      type="driver"
      {...TOKEN_FORM_CONFIGS.driver}
      {...props}
    />
  );
};

export default DriverTokenForm;