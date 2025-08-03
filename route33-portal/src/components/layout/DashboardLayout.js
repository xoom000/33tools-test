import { LAYOUT } from '../../theme';

const DashboardLayout = ({ children, header, navigation, className = "" }) => {
  return (
    <div className={`${LAYOUT.backgrounds.page} ${className}`}>
      {/* Dashboard Header */}
      {header}

      {/* Main Content Area */}
      <div className={`${LAYOUT.padding.section} ${LAYOUT.containers.lg} mx-auto`}>
        {/* Navigation */}
        {navigation}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;