// Memory Leak Testing Script for Route33 Application
// Run in Chrome DevTools Console for memory stress testing

console.log('🧪 Starting Route33 Memory Leak Test Suite...');

// Test 1: Modal Stress Test
async function modalStressTest(iterations = 20) {
  console.log(`🔄 Modal Stress Test: ${iterations} iterations`);
  
  for (let i = 0; i < iterations; i++) {
    // Wait for modals to be available
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Try to find and click modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal], button[class*="modal"]');
    if (modalTriggers.length > 0) {
      modalTriggers[0].click();
      
      // Wait for modal to open
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Close modal (ESC key or close button)
      const closeButton = document.querySelector('[aria-label="Close modal"]');
      if (closeButton) {
        closeButton.click();
      } else {
        // Fallback: ESC key
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      }
    }
    
    if (i % 5 === 0) {
      console.log(`  ✅ Completed ${i}/${iterations} modal cycles`);
    }
  }
  
  console.log('✅ Modal stress test completed');
}

// Test 2: Navigation Stress Test  
async function navigationStressTest() {
  console.log('🧭 Navigation Stress Test');
  
  const routes = [
    '/',
    '/dashboard',
    '/dashboard/33',
    '/customer-portal',
    '/'
  ];
  
  for (let i = 0; i < routes.length; i++) {
    console.log(`  🔄 Navigating to: ${routes[i]}`);
    window.history.pushState({}, '', routes[i]);
    
    // Trigger React Router update
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Wait for route to load
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('✅ Navigation stress test completed');
}

// Test 3: Toast Notification Stress Test
async function toastStressTest(iterations = 15) {
  console.log(`🍞 Toast Stress Test: ${iterations} iterations`);
  
  for (let i = 0; i < iterations; i++) {
    // Try to trigger toasts by simulating form submissions or button clicks
    const buttons = document.querySelectorAll('button[type="submit"], button[class*="primary"]');
    if (buttons.length > 0) {
      // Simulate a quick click that might trigger a toast
      buttons[Math.floor(Math.random() * buttons.length)].click();
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (i % 5 === 0) {
      console.log(`  ✅ Completed ${i}/${iterations} toast triggers`);
    }
  }
  
  console.log('✅ Toast stress test completed');
}

// Test 4: Form Interaction Stress Test
async function formStressTest() {
  console.log('📝 Form Interaction Stress Test');
  
  // Find all inputs and simulate interactions
  const inputs = document.querySelectorAll('input, select, textarea');
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    
    // Simulate focus
    input.focus();
    
    // Simulate typing (for text inputs)
    if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
      input.value = `test-value-${i}`;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Simulate blur
    input.blur();
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`✅ Tested ${inputs.length} form inputs`);
}

// Memory Measurement Utilities
function getMemoryUsage() {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
}

function logMemoryUsage(label) {
  const memory = getMemoryUsage();
  if (memory) {
    console.log(`📊 ${label}: ${memory.used}MB used / ${memory.total}MB total`);
  }
}

// Main Test Suite
async function runFullMemoryTest() {
  console.log('🚀 Starting Full Memory Leak Test Suite');
  console.log('📊 Initial Memory Usage:');
  logMemoryUsage('Baseline');
  
  try {
    // Run all tests
    await navigationStressTest();
    logMemoryUsage('After Navigation Test');
    
    await modalStressTest(10);
    logMemoryUsage('After Modal Test');
    
    await formStressTest();
    logMemoryUsage('After Form Test');
    
    await toastStressTest(10);
    logMemoryUsage('After Toast Test');
    
    // Final memory check
    console.log('⏳ Waiting 3 seconds for garbage collection...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
      console.log('🗑️ Forced garbage collection');
    }
    
    logMemoryUsage('Final');
    
    console.log('✅ Memory leak test suite completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during memory testing:', error);
  }
}

// Export functions for individual testing
window.memoryTest = {
  runFullTest: runFullMemoryTest,
  modalTest: modalStressTest,
  navigationTest: navigationStressTest,
  toastTest: toastStressTest,
  formTest: formStressTest,
  logMemory: logMemoryUsage,
  getMemory: getMemoryUsage
};

console.log('✅ Memory test functions loaded. Use window.memoryTest.runFullTest() to start.');