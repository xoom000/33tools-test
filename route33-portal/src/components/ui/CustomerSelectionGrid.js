import React, { memo } from 'react';
import { cn } from '../../utils/classNames';
import { motion } from 'framer-motion';
import Button from './Button';
import Badge from './Badge';
import { getDayDisplayName } from '../../utils/adminDashboardHelpers';
import { COMPONENT_ANIMATIONS } from '../../config/animations';
import { LAYOUT_PRESETS } from '../../config/layoutConfigs';

// COMPOSE, NEVER DUPLICATE - Reusable customer selection grid!
const CustomerSelectionGrid = memo(function CustomerSelectionGrid({ 
  customersByDay,
  selectedCustomers,
  onSelectAll,
  onClearAll,
  onCustomerToggle,
  availableServiceDays = []
}) {
  return (
    <div className={LAYOUT_PRESETS.customerSelection.container}>
      {availableServiceDays.map((day) => {
        const dayCustomers = customersByDay[day] || [];
        
        if (dayCustomers.length === 0) return null;

        return (
          <div key={day} className={LAYOUT_PRESETS.customerSelection.section}>
            <div className={cn(LAYOUT_PRESETS.customerSelection.sectionHeader, 'mb-4')}>
              <h3 className={LAYOUT_PRESETS.customerSelection.sectionTitle}>
                {getDayDisplayName(day)} ({dayCustomers.length} customers)
              </h3>
              <div className={LAYOUT_PRESETS.customerSelection.buttonGroup}>
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
            
            <div className={LAYOUT_PRESETS.customerSelection.grid}>
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
        <div className={LAYOUT_PRESETS.customerSelection.section}>
          <div className={cn(LAYOUT_PRESETS.customerSelection.sectionHeader, 'mb-4')}>
            <h3 className={LAYOUT_PRESETS.customerSelection.sectionTitle}>
              Unassigned ({customersByDay.unassigned.length} customers)
            </h3>
            <div className={LAYOUT_PRESETS.customerSelection.buttonGroup}>
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
          
          <div className={LAYOUT_PRESETS.customerSelection.grid}>
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
});

// COMPOSE, NEVER DUPLICATE - Reusable customer selection card!
const CustomerSelectionCard = memo(function CustomerSelectionCard({ customer, isSelected, onToggle }) {
  return (
    <motion.div
      {...COMPONENT_ANIMATIONS.card.entrance}
      {...COMPONENT_ANIMATIONS.card.hover}
      className={cn(
        'p-4 rounded-xl border-2 cursor-pointer transition-all',
        {
          'border-primary-500 bg-primary-50 shadow-md': isSelected,
          'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100': !isSelected
        }
      )}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <Badge
          size="lg"
          variant={isSelected ? 'primary' : 'default'}
          shape="square"
          className="w-8 h-8 font-bold"
        >
          {isSelected ? '✓' : customer.account_name?.charAt(0) || '#'}
        </Badge>
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
});

export default CustomerSelectionGrid;