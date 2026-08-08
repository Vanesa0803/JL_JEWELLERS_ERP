/*
===========================================================
JL JEWELLERS ERP
MASTER DATABASE SCHEMA
===========================================================

Project  : JL Jewellers ERP
Version  : 1.0
Database : jl_jewellers_erp

This file serves as the master installation guide.

Execution Order:

1. 01_developer3_foundation.sql
   - Company
   - Employees
   - Users
   - Departments

2. 02_developer2_inventory.sql
   - Customers
   - Suppliers
   - Categories
   - Products
   - Inventory

3. 03_developer1_finance.sql
   - Billing
   - Payments
   - Ledger
   - Finance
   - Notifications
   - Reports

After executing the above files, run:

4. 05_foreign_keys.sql
5. 06_views.sql
6. 07_sample_data.sql

===========================================================
*/