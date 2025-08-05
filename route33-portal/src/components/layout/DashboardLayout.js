import { LAYOUT } from '../../theme';
import { cn } from '../../utils/classNames';

const DashboardLayout = ({ children, header, navigation, className = "" }) => {
  return (
    <div className={cn(LAYOUT.backgrounds.page, className)}>
      {/* Dashboard Header */}
      {header}

      {/* Main Content Area */}
      <div className={cn(LAYOUT.padding.section, LAYOUT.containers.lg, 'mx-auto')}>
        {/* Navigation */}
        {navigation}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;