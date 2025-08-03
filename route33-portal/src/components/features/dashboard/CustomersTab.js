import React from 'react';
import { AnimatedContainer } from '../../animations';
import { Button } from '../../ui';
import CustomerCard from './CustomerCard';
import { getDayDisplayName } from '../../../utils/adminDashboardHelpers';

const CustomersTab = ({ 
  customers = [],
  selectedDay,
  availableServiceDays = [],
  onSetSelectedDay,
  onShowConfigureOrdering,
  onShowAddCustomer,
  onGenerateToken,
  onEditCustomer,
  onAddItem
}) => {
  
  // Filter customers by selected day
  const filteredCustomers = selectedDay 
    ? customers.filter(customer => {
        // Include customers with empty service_days or service_days that include the selected day
        return !customer.service_days || customer.service_days === '' || customer.service_days.includes(selectedDay);
      })
    : customers;

  return (
    <AnimatedContainer
      variant="slideRight"
      className="space-y-6"
    >
      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Customers</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="xs"
              onClick={onShowConfigureOrdering}
            >
              Configure Ordering
            </Button>
            <Button 
              variant="secondary" 
              size="xs"
              onClick={onShowAddCustomer}
            >
              Add
            </Button>
            <Button 
              variant="primary" 
              size="xs"
            >
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg lg:text-xl font-semibold text-slate-800">
              Active Customers ({filteredCustomers.length})
            </h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">
                Filter by day:
              </label>
              <select
                value={selectedDay || ''}
                onChange={(e) => onSetSelectedDay(e.target.value || null)}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Days</option>
                {availableServiceDays.map((day) => (
                  <option key={day} value={day}>
                    {getDayDisplayName(day)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="p-4 lg:p-6">
          {filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.customer_number}
                  customer={customer}
                  onGenerateToken={onGenerateToken}
                  onEditCustomer={onEditCustomer}
                  onAddItem={onAddItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                {selectedDay ? `No customers for ${getDayDisplayName(selectedDay)}` : 'No customers found'}
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-4">
                {selectedDay 
                  ? `No customers are scheduled for ${getDayDisplayName(selectedDay)}. Try selecting a different day.`
                  : 'Start by adding your first customer to begin managing your route.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                {selectedDay && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => onSetSelectedDay(null)}
                  >
                    Show All Days
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="small"
                  onClick={onShowAddCustomer}
                >
                  Add Customer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default CustomersTab;