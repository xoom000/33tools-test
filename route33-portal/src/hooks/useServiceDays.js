import { useState, useEffect } from 'react';
import { determineAvailableServiceDays } from '../utils/adminDashboardHelpers';

export const useServiceDays = (customers) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableServiceDays, setAvailableServiceDays] = useState([]);

  // Set available service days and default selection when customers load
  useEffect(() => {
    if (customers.length > 0) {
      const serviceDays = determineAvailableServiceDays(customers);
      setAvailableServiceDays(serviceDays);
      
      // Auto-select first available day if none selected
      if (!selectedDay && serviceDays.length > 0) {
        setSelectedDay(serviceDays[0]);
      }
    }
  }, [customers, selectedDay]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeSelectedDay = (newDay) => {
    setSelectedDay(newDay);
  };

  return {
    selectedDay,
    availableServiceDays,
    setSelectedDay: changeSelectedDay,
    setAvailableServiceDays
  };
};