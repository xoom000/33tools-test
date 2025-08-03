// COMPOSE, NEVER DUPLICATE - Sync Demo Constants! ⚔️
export const MOCK_SYNC_VALIDATION_DATA = {
  summary: {
    total_changes: 23,
    additions: 9,
    removals: 11,
    updates: 3
  },
  changes: {
    additions: [
      {
        customer_number: 212636,
        account_name: "Antler's Resort - Seasonal",
        route_number: 5,
        default_checked: true
      },
      {
        customer_number: 324443,
        account_name: "Vic Hannan Landscape Materials",
        route_number: 5,
        default_checked: true
      },
      {
        customer_number: 325038,
        account_name: "Grape Ranch Golf Club",
        route_number: 33,
        default_checked: true
      }
    ],
    removals: [
      {
        customer_number: 170617,
        account_name: "S.C.P.",
        route_number: 5,
        default_checked: false
      },
      {
        customer_number: 170717,
        account_name: "Riverview Restaurant",
        route_number: 5,
        default_checked: false
      }
    ],
    updates: [
      {
        customer_number: 301105,
        account_name: "Elliott Acupuncture",
        route_number: 33,
        changes: [
          {
            field: "address",
            old_value: "1257 West Street",
            new_value: "1839 Sonoma St"
          }
        ],
        default_checked: true
      }
    ]
  }
};