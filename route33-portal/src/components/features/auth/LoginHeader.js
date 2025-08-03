import UnifiedHeader from '../../layout/UnifiedHeader';
import { BRAND } from '../../../theme';

// COMPOSE, NEVER DUPLICATE - Now using UnifiedHeader! ⚔️
const LoginHeader = ({
  title = BRAND.company,
  subtitle = "Route system access",
  className = "",
  ...props
}) => {
  return (
    <UnifiedHeader
      variant="simple"
      title={title}
      subtitle={subtitle}
      animated={false}
      className={`mb-6 ${className}`}
      {...props}
    />
  );
};

export default LoginHeader;