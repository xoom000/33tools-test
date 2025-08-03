import { motion } from 'framer-motion';
import OrdersTab from './OrdersTab';
import LoadListTab from './LoadListTab';
import CustomersTab from './CustomersTab';
import AdminTab from './AdminTab';

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
        // Default placeholder for unimplemented tabs
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-slate-600">Coming soon! This section is under development.</p>
          </motion.div>
        );
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;