import { motion } from 'framer-motion';
import OrdersTab from './OrdersTab';
import LoadListTab from './LoadListTab';
import CustomersTab from './CustomersTab';
import AdminTab from './AdminTab';
import { TAB_CONFIGS } from '../../../config/tabConfigs';
import { COMPONENT_ANIMATIONS } from '../../../config/animationConfigs';

const TabContentRenderer = ({ 
  activeTab, 
  tabs,
  currentRoute,
  // Orders tab props
  ordersProps,
  // Load List tab props  
  loadListProps,
  // Customers tab props
  customersProps,
  // Admin tab props
  adminProps
}) => {
  
  // Render specific tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab {...ordersProps} />;
        
      case 'loadlist':
        return <LoadListTab {...loadListProps} />;
        
      case 'customers':
        return <CustomersTab {...customersProps} />;
        
      case 'admin':
        // Admin tab only for Route 33
        return currentRoute === 33 ? <AdminTab {...adminProps} /> : null;
        
      default:
        // Default placeholder for unimplemented tabs using configuration
        const placeholderConfig = TAB_CONFIGS.placeholder;
        return (
          <motion.div
            {...COMPONENT_ANIMATIONS.tab.content}
            className={placeholderConfig.content.className}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-slate-600">{placeholderConfig.content.description}</p>
          </motion.div>
        );
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;