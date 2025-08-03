import { useState, useMemo } from 'react';

// COMPOSE, NEVER DUPLICATE - Customer selection logic hook!
export const useCustomerSelection = (customers = [], initialFilter = null) => {
  // Initialize with customers who already have order_button enabled
  const [selectedCustomers, setSelectedCustomers] = useState(() => {
    return new Set(
      customers
        .filter(customer => customer.order_button)
        .map(customer => customer.customer_number)
    );
  });

  // Group customers by service day (reusable logic)
  const customersByDay = useMemo(() => {
    const groups = {};
    customers.forEach(customer => {
      const serviceDays = customer.service_days || '';
      if (serviceDays) {
        serviceDays.split('').forEach(day => {
          if (!groups[day]) groups[day] = [];
          groups[day].push(customer);
        });
      } else {
        // Customers with no service days go in a special group
        if (!groups['unassigned']) groups['unassigned'] = [];
        groups['unassigned'].push(customer);
      }
    });
    return groups;
  }, [customers]);

  const handleSelectAll = (dayCustomers) => {
    const newSelected = new Set(selectedCustomers);
    dayCustomers.forEach(customer => newSelected.add(customer.customer_number));
    setSelectedCustomers(newSelected);
  };

  const handleClearAll = (dayCustomers) => {
    const newSelected = new Set(selectedCustomers);
    dayCustomers.forEach(customer => newSelected.delete(customer.customer_number));
    setSelectedCustomers(newSelected);
  };

  const handleCustomerToggle = (customerNumber) => {
    const newSelected = new Set(selectedCustomers);
    if (selectedCustomers.has(customerNumber)) {
      newSelected.delete(customerNumber);
    } else {
      newSelected.add(customerNumber);
    }
    setSelectedCustomers(newSelected);
  };

  const getSelectedCustomerNumbers = () => Array.from(selectedCustomers);

  return {
    selectedCustomers,
    customersByDay,
    handleSelectAll,
    handleClearAll,
    handleCustomerToggle,
    getSelectedCustomerNumbers,
    selectedCount: selectedCustomers.size
  };
};