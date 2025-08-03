import UnifiedHeader from './UnifiedHeader';
import { BRAND } from '../../theme';

// COMPOSE, NEVER DUPLICATE - Now using UnifiedHeader! ⚔️
const CustomerHeader = ({ 
  customerName, 
  customerNumber, 
  onLogout,
  serviceName = BRAND.name,
  ...props
}) => {
  return (
    <UnifiedHeader
      variant="sticky"
      customer={{ name: customerName, number: customerNumber }}
      subtitle={serviceName}
      logoutAction={{ text: "Sign Out", onClick: onLogout }}
      {...props}
    />
  );
};

export default CustomerHeader;