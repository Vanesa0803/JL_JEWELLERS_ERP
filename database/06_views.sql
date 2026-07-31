USE jl_jewellers_erp;

-- =====================================================
-- VIEW 1 : Invoice Summary
-- =====================================================

DROP VIEW IF EXISTS invoice_summary;

CREATE VIEW invoice_summary AS
SELECT
    b.bill_id,
    b.invoice_prefix,
    b.invoice_number,
    b.bill_date,

    c.customer_id,
    CONCAT(c.first_name, ' ', IFNULL(c.last_name, '')) AS customer_name,

    e.employee_id,
    e.name AS employee_name,

    b.subtotal,
    b.total_discount,
    b.total_gst,
    b.grand_total,

    b.payment_status,
    b.bill_status

FROM bills b
JOIN customers c
ON b.customer_id = c.customer_id
JOIN employees e
ON b.employee_id = e.employee_id;


-- =====================================================
-- VIEW 2 : Bill Item Details
-- =====================================================

DROP VIEW IF EXISTS bill_item_details;

CREATE VIEW bill_item_details AS
SELECT

    bi.bill_item_id,

    b.invoice_number,
    b.bill_date,

    CONCAT(c.first_name,' ',IFNULL(c.last_name,'')) AS customer_name,

    p.product_name,

    bi.metal_type,
    bi.purity,

    bi.quantity,
    bi.net_weight,
    bi.rate,

    bi.metal_value,
    bi.making_charge,
    bi.taxable_value,

    bi.gst_metal,
    bi.gst_making,

    bi.discount,

    bi.line_total

FROM bill_items bi

JOIN bills b
ON bi.bill_id = b.bill_id

JOIN customers c
ON b.customer_id = c.customer_id

JOIN products p
ON bi.product_id = p.product_id;


-- =====================================================
-- VIEW 3 : Daily Sales Report
-- =====================================================

DROP VIEW IF EXISTS daily_sales_report;

CREATE VIEW daily_sales_report AS
SELECT

    DATE(bill_date) AS sale_date,

    COUNT(*) AS total_bills,

    SUM(grand_total) AS total_sales,

    SUM(total_discount) AS total_discount,

    SUM(total_gst) AS total_gst

FROM bills

WHERE bill_status='Completed'

GROUP BY DATE(bill_date);


-- =====================================================
-- VIEW 4 : Pending Payments
-- =====================================================

DROP VIEW IF EXISTS pending_payment_view;

CREATE VIEW pending_payment_view AS
SELECT

    b.bill_id,
    b.invoice_number,

    CONCAT(c.first_name,' ',IFNULL(c.last_name,'')) AS customer_name,

    b.bill_date,

    b.grand_total,

    b.payment_status

FROM bills b

JOIN customers c
ON b.customer_id=c.customer_id

WHERE b.payment_status<>'Completed';


-- =====================================================
-- VIEW 5 : Customer Ledger Summary
-- =====================================================

DROP VIEW IF EXISTS customer_ledger_summary;

CREATE VIEW customer_ledger_summary AS
SELECT

    c.customer_id,

    CONCAT(c.first_name,' ',IFNULL(c.last_name,'')) AS customer_name,

    SUM(cl.debit) AS total_debit,

    SUM(cl.credit) AS total_credit,

    MAX(cl.balance) AS current_balance

FROM customers c

JOIN customer_ledger cl
ON c.customer_id=cl.customer_id

GROUP BY
c.customer_id,
customer_name;


-- =====================================================
-- VIEW 6 : Product Sales Report
-- =====================================================

DROP VIEW IF EXISTS product_sales_report;

CREATE VIEW product_sales_report AS
SELECT

    p.product_id,

    p.product_code,

    p.product_name,

    SUM(bi.quantity) AS total_quantity_sold,

    SUM(bi.net_weight) AS total_weight_sold,

    SUM(bi.line_total) AS total_revenue

FROM products p

JOIN bill_items bi
ON p.product_id=bi.product_id

GROUP BY

    p.product_id,
    p.product_code,
    p.product_name;

CREATE OR REPLACE VIEW customer_ledger_summary AS
SELECT

    c.customer_id,

    CONCAT(c.first_name,' ',IFNULL(c.last_name,'')) AS customer_name,

    SUM(cl.debit) AS total_debit,

    SUM(cl.credit) AS total_credit,

    SUM(cl.debit) - SUM(cl.credit) AS outstanding_balance

FROM customer_ledger cl

JOIN customers c
ON cl.customer_id = c.customer_id

GROUP BY
    c.customer_id,
    customer_name;    