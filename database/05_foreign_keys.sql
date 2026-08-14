USE jl_jewellers_erp;

-- =====================================================
-- JL JEWELLERS ERP
-- FOREIGN KEY CONSTRAINTS
-- CORE BILLING MODULE
-- =====================================================

-- =====================================================
-- BILLS
-- =====================================================

ALTER TABLE bills
ADD CONSTRAINT fk_bills_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON UPDATE CASCADE;

ALTER TABLE bills
ADD CONSTRAINT fk_bills_employee
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON UPDATE CASCADE;

-- =====================================================
-- BILL ITEMS
-- =====================================================

ALTER TABLE bill_items
ADD CONSTRAINT fk_bill_items_bill
FOREIGN KEY (bill_id)
REFERENCES bills(bill_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE bill_items
ADD CONSTRAINT fk_bill_items_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON UPDATE CASCADE;

-- =====================================================
-- PAYMENTS
-- =====================================================

ALTER TABLE payments
ADD CONSTRAINT fk_payments_bill
FOREIGN KEY (bill_id)
REFERENCES bills(bill_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Advance payments hang off a customer instead of a bill.
-- Added by migration 2026-08-13_01.
ALTER TABLE payments
ADD CONSTRAINT fk_payments_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id);

-- =====================================================
-- PAYMENT DETAILS
-- =====================================================

ALTER TABLE payment_details
ADD CONSTRAINT fk_payment_details_payment
FOREIGN KEY (payment_id)
REFERENCES payments(payment_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE bills
ADD CONSTRAINT fk_bills_created_by
FOREIGN KEY (created_by)
REFERENCES employees(employee_id);

ALTER TABLE bills
ADD CONSTRAINT fk_bills_updated_by
FOREIGN KEY (updated_by)
REFERENCES employees(employee_id);

ALTER TABLE bills
ADD CONSTRAINT fk_bills_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES employees(employee_id);

ALTER TABLE payments
ADD CONSTRAINT fk_payments_created_by
FOREIGN KEY (created_by)
REFERENCES employees(employee_id);

ALTER TABLE payments
ADD CONSTRAINT fk_payments_updated_by
FOREIGN KEY (updated_by)
REFERENCES employees(employee_id);
-- =====================================================
-- INVENTORY MODULE
-- =====================================================

-- -----------------------------------------------------
-- SUBCATEGORIES
-- -----------------------------------------------------

ALTER TABLE subcategories
ADD CONSTRAINT fk_subcategories_category
FOREIGN KEY (category_id)
REFERENCES categories(category_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PRODUCTS
-- -----------------------------------------------------

ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id)
REFERENCES categories(category_id)
ON UPDATE CASCADE;

ALTER TABLE products
ADD CONSTRAINT fk_products_subcategory
FOREIGN KEY (subcategory_id)
REFERENCES subcategories(subcategory_id)
ON UPDATE CASCADE;

ALTER TABLE products
ADD CONSTRAINT fk_products_design
FOREIGN KEY (design_id)
REFERENCES designs(design_id)
ON UPDATE CASCADE;

ALTER TABLE products
ADD CONSTRAINT fk_products_metal
FOREIGN KEY (metal_type_id)
REFERENCES metal_types(metal_type_id)
ON UPDATE CASCADE;

ALTER TABLE products
ADD CONSTRAINT fk_products_purity
FOREIGN KEY (purity_id)
REFERENCES purity(purity_id)
ON UPDATE CASCADE;

ALTER TABLE products
ADD CONSTRAINT fk_products_stone
FOREIGN KEY (stone_type_id)
REFERENCES stone_types(stone_type_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PRODUCT VARIANTS
-- -----------------------------------------------------

ALTER TABLE product_variants
ADD CONSTRAINT fk_variants_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PRODUCT IMAGES
-- -----------------------------------------------------

ALTER TABLE product_images
ADD CONSTRAINT fk_images_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PRODUCT BARCODES
-- -----------------------------------------------------

ALTER TABLE product_barcodes
ADD CONSTRAINT fk_barcodes_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- INVENTORY
-- -----------------------------------------------------

ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON UPDATE CASCADE;

ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_variant
FOREIGN KEY (variant_id)
REFERENCES product_variants(variant_id)
ON UPDATE CASCADE;
-- =====================================================
-- CUSTOMER MODULE
-- =====================================================

-- -----------------------------------------------------
-- CUSTOMER DOCUMENTS
-- -----------------------------------------------------

ALTER TABLE customer_documents
ADD CONSTRAINT fk_customer_documents_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- CUSTOMER NOTES
-- -----------------------------------------------------

ALTER TABLE customer_notes
ADD CONSTRAINT fk_customer_notes_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- CUSTOMER LOYALTY
-- -----------------------------------------------------

ALTER TABLE customer_loyalty
ADD CONSTRAINT fk_customer_loyalty_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- CUSTOMER ORDERS
-- -----------------------------------------------------

ALTER TABLE customer_orders
ADD CONSTRAINT fk_customer_orders_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- CUSTOMER ORDER ITEMS
-- -----------------------------------------------------

ALTER TABLE customer_order_items
ADD CONSTRAINT fk_customer_order_items_order
FOREIGN KEY (customer_order_id)
REFERENCES customer_orders(customer_order_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE customer_order_items
ADD CONSTRAINT fk_customer_order_items_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON UPDATE CASCADE;

ALTER TABLE customer_order_items
ADD CONSTRAINT fk_customer_order_items_purity
FOREIGN KEY (purity_id)
REFERENCES purity(purity_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- CUSTOMER ORDER MEASUREMENTS
-- -----------------------------------------------------

ALTER TABLE customer_order_measurements
ADD CONSTRAINT fk_customer_order_measurements_order
FOREIGN KEY (customer_order_id)
REFERENCES customer_orders(customer_order_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- SUPPLIER MODULE
-- =====================================================

-- -----------------------------------------------------
-- SUPPLIER DOCUMENTS
-- -----------------------------------------------------

ALTER TABLE supplier_documents
ADD CONSTRAINT fk_supplier_documents_supplier
FOREIGN KEY (supplier_id)
REFERENCES suppliers(supplier_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PURCHASE ORDERS
-- -----------------------------------------------------

ALTER TABLE purchase_orders
ADD CONSTRAINT fk_purchase_orders_supplier
FOREIGN KEY (supplier_id)
REFERENCES suppliers(supplier_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PURCHASE ORDER ITEMS
-- -----------------------------------------------------

ALTER TABLE purchase_order_items
ADD CONSTRAINT fk_purchase_order_items_order
FOREIGN KEY (purchase_order_id)
REFERENCES purchase_orders(purchase_order_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE purchase_order_items
ADD CONSTRAINT fk_purchase_order_items_product
FOREIGN KEY (product_id)
REFERENCES products(product_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- PURCHASE RETURNS
-- -----------------------------------------------------

ALTER TABLE purchase_returns
ADD CONSTRAINT fk_purchase_returns_supplier
FOREIGN KEY (supplier_id)
REFERENCES suppliers(supplier_id)
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- SUPPLIER PAYMENTS
-- -----------------------------------------------------

ALTER TABLE supplier_payments
ADD CONSTRAINT fk_supplier_payments_supplier
FOREIGN KEY (supplier_id)
REFERENCES suppliers(supplier_id)
ON UPDATE CASCADE;

ALTER TABLE supplier_payments
ADD CONSTRAINT fk_supplier_payments_purchase_order
FOREIGN KEY (purchase_order_id)
REFERENCES purchase_orders(purchase_order_id)
ON UPDATE CASCADE;

-- =====================================================
-- MAKER (KARIGAR) MODULE
-- =====================================================

-- Maker Categories
ALTER TABLE maker_categories
ADD CONSTRAINT fk_maker_categories_maker
FOREIGN KEY (maker_id)
REFERENCES makers(maker_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE maker_categories
ADD CONSTRAINT fk_maker_categories_category
FOREIGN KEY (category_id)
REFERENCES categories(category_id)
ON UPDATE CASCADE;

-- Maker Assignments
ALTER TABLE maker_assignments
ADD CONSTRAINT fk_maker_assignments_order
FOREIGN KEY (customer_order_id)
REFERENCES customer_orders(customer_order_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE maker_assignments
ADD CONSTRAINT fk_maker_assignments_maker
FOREIGN KEY (maker_id)
REFERENCES makers(maker_id)
ON UPDATE CASCADE;

-- Maker Work Logs
ALTER TABLE maker_work_logs
ADD CONSTRAINT fk_work_logs_assignment
FOREIGN KEY (assignment_id)
REFERENCES maker_assignments(assignment_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Maker Payments
ALTER TABLE maker_payments
ADD CONSTRAINT fk_maker_payments_maker
FOREIGN KEY (maker_id)
REFERENCES makers(maker_id)
ON UPDATE CASCADE;

ALTER TABLE maker_payments
ADD CONSTRAINT fk_maker_payments_assignment
FOREIGN KEY (assignment_id)
REFERENCES maker_assignments(assignment_id)
ON UPDATE CASCADE;

-- =====================================================
-- GOLD SCHEME MODULE
-- =====================================================

ALTER TABLE gold_scheme_enrollments
ADD CONSTRAINT fk_gold_enrollment_scheme
FOREIGN KEY (scheme_type_id)
REFERENCES gold_scheme_types(scheme_type_id)
ON UPDATE CASCADE;

ALTER TABLE gold_scheme_enrollments
ADD CONSTRAINT fk_gold_enrollment_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON UPDATE CASCADE;

ALTER TABLE gold_scheme_installments
ADD CONSTRAINT fk_gold_installments_enrollment
FOREIGN KEY (enrollment_id)
REFERENCES gold_scheme_enrollments(enrollment_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE gold_scheme_ledger
ADD CONSTRAINT fk_gold_ledger_enrollment
FOREIGN KEY (enrollment_id)
REFERENCES gold_scheme_enrollments(enrollment_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- USERS & SECURITY
-- =====================================================

ALTER TABLE user_sessions
ADD CONSTRAINT fk_user_sessions_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE activity_logs
ADD CONSTRAINT fk_activity_logs_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON UPDATE CASCADE;

ALTER TABLE audit_logs
ADD CONSTRAINT fk_audit_logs_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON UPDATE CASCADE;

ALTER TABLE login_logs
ADD CONSTRAINT fk_login_logs_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON UPDATE CASCADE;

ALTER TABLE pin_logs
ADD CONSTRAINT fk_pin_logs_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON UPDATE CASCADE;

ALTER TABLE security_pins
ADD CONSTRAINT fk_security_pins_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- =====================================================
-- FINANCE
-- =====================================================

ALTER TABLE customer_ledger
ADD CONSTRAINT fk_customer_ledger_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id)
ON UPDATE CASCADE;

ALTER TABLE customer_ledger
ADD CONSTRAINT fk_customer_ledger_bill
FOREIGN KEY (bill_id)
REFERENCES bills(bill_id)
ON UPDATE CASCADE;

ALTER TABLE supplier_ledger
ADD CONSTRAINT fk_supplier_ledger_supplier
FOREIGN KEY (supplier_id)
REFERENCES suppliers(supplier_id)
ON UPDATE CASCADE;

ALTER TABLE bank_ledger
ADD CONSTRAINT fk_bank_ledger_account
FOREIGN KEY (bank_account_id)
REFERENCES bank_accounts(bank_account_id)
ON UPDATE CASCADE;

ALTER TABLE ledger_transactions
ADD CONSTRAINT fk_ledger_transactions_bill
FOREIGN KEY (bill_id)
REFERENCES bills(bill_id)
ON UPDATE CASCADE;

ALTER TABLE ledger_transactions
ADD CONSTRAINT fk_ledger_transactions_created_by
FOREIGN KEY (created_by)
REFERENCES employees(employee_id)
ON UPDATE CASCADE;

ALTER TABLE refunds
ADD CONSTRAINT fk_refunds_payment
FOREIGN KEY (payment_id)
REFERENCES payments(payment_id)
ON UPDATE CASCADE;