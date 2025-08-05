import UnifiedHeader from '../../layout/UnifiedHeader';
import { BRAND } from '../../../theme';
import { cn } from '../../../utils/classNames';

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
      className={cn('mb-6', className)}
      {...props}
    />
  );
};

export default LoginHeader;