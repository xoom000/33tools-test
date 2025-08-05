#!/usr/bin/env python3
"""
Cross-reference new customers from RouteOptimization CSV with CustomerMaster inventory data
"""

import pandas as pd
import sqlite3

def cross_reference_new_customers():
    # Load RouteOptimization CSV
    df_ro = pd.read_csv('/home/xoom000/GoPublic/33tools-staging/updatedocs/RouteOptimizationCLEAN.csv')
    df_ro['route_number'] = df_ro['route_number'].str.extract(r'2502-(\d+)').astype(int)
    your_routes = [5, 9, 11, 12, 33, 75]
    ro_data = df_ro[df_ro['route_number'].isin(your_routes)].copy()
    
    # Load database customers
    conn = sqlite3.connect('/home/xoom000/GoPublic/33tools-staging/route33-staging.db')
    db_data = pd.read_sql_query("""
        SELECT customer_number, account_name, route_number 
        FROM customers 
        WHERE is_active = 1
    """, conn)
    conn.close()
    
    # Find ALL new customers (not in database)
    csv_customers = set(ro_data['customer_number'].tolist())
    db_customers = set(db_data['customer_number'].tolist())
    all_new_customers = csv_customers - db_customers
    
    print(f"Found {len(all_new_customers)} NEW customers total across all routes\n")
    
    # Load CustomerMaster data
    try:
        df_cm = pd.read_csv('/home/xoom000/GoPublic/33tools-staging/csv_data/CustomerMasterAnalysisReport07-30-2025.csv')
        print(f"Loaded CustomerMaster with {len(df_cm)} records\n")
        
        # Check customer number column name
        print("CustomerMaster columns:", list(df_cm.columns)[:10])
        
        # Try different possible customer number column names
        customer_col = None
        for col in ['CustomerNum', 'customer_number', 'CustomerNumber', 'textbox1']:
            if col in df_cm.columns:
                customer_col = col
                break
        
        if customer_col:
            print(f"Using customer column: {customer_col}")
            cm_customers = set(df_cm[customer_col].dropna().astype(str).str.replace('Plant 2502,', '').astype(int))
            print(f"CustomerMaster has {len(cm_customers)} unique customers\n")
        else:
            print("Could not find customer number column in CustomerMaster!")
            return
            
    except Exception as e:
        print(f"Error loading CustomerMaster: {e}")
        return
    
    # Cross-reference new customers with CustomerMaster
    customers_with_inventory = []
    customers_without_inventory = []
    
    for cust_num in sorted(all_new_customers):
        if cust_num in cm_customers:
            customers_with_inventory.append(cust_num)
        else:
            customers_without_inventory.append(cust_num)
    
    print("🎯 CROSS-REFERENCE RESULTS:")
    print(f"✅ NEW customers WITH inventory data: {len(customers_with_inventory)}")
    print(f"❌ NEW customers WITHOUT inventory data: {len(customers_without_inventory)}")
    print()
    
    # Show customers WITH inventory
    if customers_with_inventory:
        print("📦 NEW CUSTOMERS WITH INVENTORY DATA:")
        for cust_num in customers_with_inventory:
            # Get customer info from RO
            cust_info = ro_data[ro_data['customer_number'] == cust_num].iloc[0]
            
            # Get inventory items from CustomerMaster
            cust_inventory = df_cm[df_cm[customer_col].astype(str).str.contains(str(cust_num), na=False)]
            
            print(f"   {cust_num}: {cust_info['account_name']} (Route {cust_info['route_number']})")
            print(f"      📍 {cust_info['address']}, {cust_info['city']}")
            print(f"      📦 {len(cust_inventory)} inventory items in CustomerMaster")
            
            # Show sample inventory items
            if len(cust_inventory) > 0:
                print("      🏷️  Sample items:")
                for idx, item in cust_inventory.head(3).iterrows():
                    item_desc = item.get('item_desc', 'N/A')
                    qty = item.get('reg_invty_qty', 'N/A')
                    print(f"         • {item_desc} (Qty: {qty})")
            print()
    
    # Show customers WITHOUT inventory  
    if customers_without_inventory:
        print("❓ NEW CUSTOMERS WITHOUT INVENTORY DATA:")
        for cust_num in customers_without_inventory:
            cust_info = ro_data[ro_data['customer_number'] == cust_num].iloc[0]
            print(f"   {cust_num}: {cust_info['account_name']} (Route {cust_info['route_number']})")
            print(f"      📍 {cust_info['address']}, {cust_info['city']}")
        print()
    
    return {
        'with_inventory': customers_with_inventory,
        'without_inventory': customers_without_inventory,
        'inventory_data': df_cm if 'df_cm' in locals() else None
    }

if __name__ == "__main__":
    results = cross_reference_new_customers()