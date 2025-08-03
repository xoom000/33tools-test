// COMPOSE, NEVER DUPLICATE - Demo Constants! ⚔️
export const DEMO_STEPS = [
  {
    title: "Welcome to 33 Tools",
    content: "Our revolutionary digital clipboard system replaces paper-based order management with instant, mobile-ready customer communication.",
    highlight: "From clipboard and pencil to digital precision"
  },
  {
    title: "Driver Workflow",
    content: "Driver visits customer location and builds their personalized order form on mobile device.",
    highlight: "Replace clipboard with digital precision"
  },
  {
    title: "Customer Self-Service",
    content: "Customers receive secure access to their personalized order form. They can review and submit requests whenever needed.",
    highlight: "Order form delivered directly to customer's phone"
  },
  {
    title: "Real-Time Notifications",
    content: "When customers submit orders, drivers receive instant notifications through the dashboard system for immediate processing.",
    highlight: "No delays, no missed orders, complete transparency"
  }
];

export const DEMO_DATA = {
  orders: [
    { id: 1, customer: "F M Valero", items: 4, status: "Pending", time: "2 minutes ago" },
    { id: 2, customer: "Valley Market", items: 7, status: "Pending", time: "15 minutes ago" },
    { id: 3, customer: "Corner Store", items: 3, status: "Approved", time: "1 hour ago" }
  ],
  customers: [
    { 
      name: "F M Valero", 
      number: "170449", 
      items: ["Kitchen Roll Towels", "Hand Sanitizer", "Paper Towels", "Multi-Surface Cleaner"] 
    },
    { 
      name: "Valley Market", 
      number: "180523", 
      items: ["Industrial Wipes", "Floor Cleaner", "Trash Bags"] 
    }
  ]
};

export const ITEM_DESCRIPTIONS = {
  0: '30 rolls per case',
  1: '12 bottles per case', 
  2: '24 rolls per case',
  3: '6 bottles per case'
};

export const DEFAULT_QUANTITIES = { 0: 12, 1: 6, 2: 24, 3: 4 };

export const DEMO_VIEWS = {
  DRIVER: 'driver',
  CUSTOMER: 'customer'
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved'
};