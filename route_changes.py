#!/usr/bin/env python3
"""
Show customer changes per route: CSV vs Database
"""

import pandas as pd
import sqlite3

def analyze_route_changes():
    # Load CSV data
    df_csv = pd.read_csv('/home/xoom000/GoPublic/33tools-staging/updatedocs/RouteOptimizationCLEAN.csv')
    
    # Clean and process CSV data
    df_csv['route_number'] = df_csv['route_number'].str.extract(r'2502-(\d+)').astype(int)
    df_csv['zip_clean'] = df_csv['zip_code'].astype(str).str[:5]
    
    # Filter to your routes
    your_routes = [5, 9, 11, 12, 33, 75]
    csv_data = df_csv[df_csv['route_number'].isin(your_routes)].copy()
    
    # Load database data
    conn = sqlite3.connect('/home/xoom000/GoPublic/33tools-staging/route33-staging.db')
    db_data = pd.read_sql_query("""
        SELECT customer_number, account_name, route_number 
        FROM customers 
        WHERE is_active = 1
    """, conn)
    conn.close()
    
    print("ROUTE-BY-ROUTE CUSTOMER CHANGES:\n")
    
    for route in sorted(your_routes):
        print(f"🛣️  ROUTE {route}:")
        
        # Get customers for this route
        csv_route = csv_data[csv_data['route_number'] == route]['customer_number'].tolist()
        db_route = db_data[db_data['route_number'] == route]['customer_number'].tolist()
        
        # Find differences
        new_customers = set(csv_route) - set(db_route)
        removed_customers = set(db_route) - set(csv_route)
        
        print(f"   CSV: {len(csv_route)} customers | DB: {len(db_route)} customers")
        
        if new_customers:
            print(f"   ➕ NEW customers ({len(new_customers)}):")
            for cust_num in sorted(new_customers):
                cust_info = csv_data[csv_data['customer_number'] == cust_num].iloc[0]
                print(f"      {cust_num}: {cust_info['account_name']}")
        
        if removed_customers:
            print(f"   ➖ REMOVED customers ({len(removed_customers)}):")
            for cust_num in sorted(removed_customers):
                cust_info = db_data[db_data['customer_number'] == cust_num].iloc[0]
                print(f"      {cust_num}: {cust_info['account_name']}")
        
        if not new_customers and not removed_customers:
            print(f"   ✅ No changes - all customers match!")
        
        print()

if __name__ == "__main__":
    analyze_route_changes()