// AdminDashboard Utility Functions
// Extracted utility functions for better organization

export const determineAvailableServiceDays = (customers) => {
  if (!customers || customers.length === 0) return [];
  
  // Get unique service days from customers for this route
  const serviceDays = [...new Set(customers.map(c => c.service_days).filter(Boolean))];
  
  // Sort by day hierarchy: M=1, T=2, W=3, H=4, F=5
  const dayOrder = { 'M': 1, 'T': 2, 'W': 3, 'H': 4, 'F': 5 };
  serviceDays.sort((a, b) => dayOrder[a] - dayOrder[b]);
  
  return serviceDays;
};

export const getDayDisplayName = (dayCode) => {
  const dayNames = {
    'M': 'Monday',
    'T': 'Tuesday', 
    'W': 'Wednesday',
    'H': 'Thursday',
    'F': 'Friday'
  };
  return dayNames[dayCode] || dayCode;
};

export const generatePrintView = (loadList, customQuantities, selectedDay, currentRoute, currentUser, toastContext, logger) => {
  // Extract both toast methods and removeToast from the context
  const { toast, removeToast } = toastContext;
  try {
    // Validation checks with user feedback
    if (!loadList || loadList.length === 0) {
      toast.warning('No items to print', {
        title: 'Empty Load List',
        duration: 3000
      });
      return;
    }

    if (!selectedDay) {
      toast.warning('Please select a service day first', {
        title: 'No Day Selected',
        duration: 3000
      });
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading('Preparing print view...', {
      title: 'Generating Load List'
    });

    const totalItems = loadList.length;
    const totalQuantity = loadList.reduce((sum, item) => sum + (customQuantities[item.item_number] || item.total_quantity), 0);

    const printContent = `
      <html>
        <head>
          <title>Load List - Route ${currentRoute} - ${new Date().toLocaleDateString()}</title>
          <style>
            @page { margin: 0.5in; size: letter; }
            body { 
              font-family: 'Arial Black', Arial, sans-serif; 
              margin: 0; 
              padding: 0;
              line-height: 1.2; 
              font-size: 11px;
              color: #000;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px; 
              border-bottom: 3px solid #000; 
              padding-bottom: 8px; 
            }
            .header h1 { 
              font-size: 20px; 
              font-weight: 900; 
              margin: 0 0 5px 0; 
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .header p { 
              font-size: 12px; 
              font-weight: bold; 
              margin: 2px 0; 
            }
            .items-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 2px;
              margin-bottom: 15px;
            }
            .item { 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              padding: 3px 6px; 
              border: 1px solid #333;
              background: #f8f8f8;
              font-size: 10px;
              min-height: 20px;
            }
            .item:nth-child(odd) { background: #fff; }
            .item-info {
              flex: 1;
              min-width: 0;
            }
            .item-name { 
              font-weight: 900; 
              font-size: 11px;
              line-height: 1.1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-number { 
              font-size: 9px; 
              color: #333; 
              font-weight: bold;
            }
            .customers { 
              font-size: 8px; 
              color: #666; 
              font-weight: bold;
            }
            .quantity { 
              font-size: 16px; 
              font-weight: 900; 
              color: #000;
              background: #ffff00;
              padding: 2px 6px;
              border-radius: 3px;
              min-width: 25px;
              text-align: center;
              margin-left: 8px;
            }
            .summary { 
              background: #000; 
              color: #fff; 
              padding: 8px; 
              text-align: center; 
              font-weight: 900;
              font-size: 14px;
              margin-top: 10px;
              letter-spacing: 0.5px;
            }
            .print-info { display: none; }
            @media print { 
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .item { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Route ${currentRoute} Load List</h1>
            <p>${new Date().toLocaleDateString()} - ${getDayDisplayName(selectedDay)}</p>
            <p>Driver: ${currentUser?.name || 'Unknown'}</p>
          </div>
          
          <div class="items-container">
            ${loadList.map((item) => `
              <div class="item">
                <div class="item-info">
                  <div class="item-name">${item.item_name}</div>
                  <div class="item-number">#${item.item_number}</div>
                  <div class="customers">${item.customers.length} customer${item.customers.length !== 1 ? 's' : ''}</div>
                </div>
                <div class="quantity">${customQuantities[item.item_number] || item.total_quantity}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="summary">
            TOTAL: ${totalItems} ITEMS | ${totalQuantity} PIECES
          </div>
        </body>
      </html>
    `;
    
    // Simulate loading time for better UX
    setTimeout(() => {
      try {
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
          removeToast(loadingToastId);
          toast.error('Print window blocked by browser', {
            title: 'Print Failed',
            action: {
              label: 'Allow Popups',
              handler: () => {
                toast.info('Please allow popups for this site in your browser settings to enable printing.', {
                  title: 'Enable Popups',
                  duration: 8000
                });
              }
            }
          });
          return;
        }

        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Track if toast has been cleared to prevent duplicate cleanup
        let toastCleared = false;
        
        // Helper function to clean up loading toast
        const clearLoadingToast = () => {
          if (!toastCleared) {
            removeToast(loadingToastId);
            toastCleared = true;
          }
        };
        
        // Wait for content to load before printing
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          
          // Clean up loading toast and show success
          clearLoadingToast();
          toast.success(`Load list ready to print!`, {
            title: 'Print View Generated',
            duration: 5000,
            action: {
              label: 'View Details',
              handler: () => {
                toast.info(`Load List Summary:\n• ${totalItems} different items\n• ${totalQuantity} total pieces\n• Service day: ${getDayDisplayName(selectedDay)}\n• Driver: ${currentUser?.name}`, {
                  title: 'Print Summary',
                  duration: 8000
                });
              }
            }
          });
        };
        
        // Handle case when user closes print window without printing
        const checkWindowClosed = setInterval(() => {
          if (printWindow.closed) {
            clearInterval(checkWindowClosed);
            clearLoadingToast();
          }
        }, 1000);
        
        // Fallback: Clear loading toast after 10 seconds regardless
        setTimeout(() => {
          clearInterval(checkWindowClosed);
          clearLoadingToast();
        }, 10000);

      } catch (printError) {
        removeToast(loadingToastId);
        toast.error('Failed to generate print view', {
          title: 'Print Error',
          action: {
            label: 'Retry',
            handler: () => generatePrintView(loadList, customQuantities, selectedDay, currentRoute, currentUser, toastContext, logger)
          }
        });
        logger.error('Print generation failed', { error: printError.message });
      }
    }, 500);

  } catch (error) {
    toast.error('An unexpected error occurred while printing', {
      title: 'Print Failed',
      action: {
        label: 'Try Again',
        handler: () => generatePrintView(loadList, customQuantities, selectedDay, currentRoute, currentUser, toastContext, logger)
      }
    });
    logger.error('Print function error', { error: error.message });
  }
};

