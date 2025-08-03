import BaseTokenForm from './BaseTokenForm';
import { TOKEN_FORM_CONFIGS } from '../../../config/tokenFormConfigs';

// COMPOSE, NOT DUPLICATE - Demo form using base component!
const DemoTokenForm = (props) => {
  return (
    <BaseTokenForm 
      type="demo"
      {...TOKEN_FORM_CONFIGS.demo}
      {...props}
    />
  );
};

export default DemoTokenForm;