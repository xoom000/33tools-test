import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { getDayDisplayName } from '../../utils/adminDashboardHelpers';

// COMPOSE, NEVER DUPLICATE - Reusable customer selection grid!
const CustomerSelectionGrid = ({ 
  customersByDay,
  selectedCustomers,
  onSelectAll,
  onClearAll,
  onCustomerToggle,
  availableServiceDays = []
}) => {
  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
      {availableServiceDays.map((day) => {
        const dayCustomers = customersByDay[day] || [];
        
        if (dayCustomers.length === 0) return null;

        return (
          <div key={day} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {getDayDisplayName(day)} ({dayCustomers.length} customers)
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onSelectAll(dayCustomers)}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onClearAll(dayCustomers)}
                >
                  Clear All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {dayCustomers.map((customer) => (
                <CustomerSelectionCard
                  key={customer.customer_number}
                  customer={customer}
                  isSelected={selectedCustomers.has(customer.customer_number)}
                  onToggle={() => onCustomerToggle(customer.customer_number)}
                />
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Show unassigned customers if they exist */}
      {customersByDay.unassigned && customersByDay.unassigned.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Unassigned ({customersByDay.unassigned.length} customers)
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => onSelectAll(customersByDay.unassigned)}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onClearAll(customersByDay.unassigned)}
              >
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {customersByDay.unassigned.map((customer) => (
              <CustomerSelectionCard
                key={customer.customer_number}
                customer={customer}
                isSelected={selectedCustomers.has(customer.customer_number)}
                onToggle={() => onCustomerToggle(customer.customer_number)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// COMPOSE, NEVER DUPLICATE - Reusable customer selection card!
const CustomerSelectionCard = ({ customer, isSelected, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
          isSelected
            ? 'bg-blue-500 text-white'
            : 'bg-slate-300 text-slate-600'
        }`}>
          {isSelected ? '✓' : customer.account_name?.charAt(0) || '#'}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 text-sm leading-tight">
            {customer.account_name}
          </h4>
          <p className="text-xs text-slate-500">
            #{customer.customer_number}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerSelectionGrid;