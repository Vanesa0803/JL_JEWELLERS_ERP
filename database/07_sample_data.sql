USE jl_jewellers_erp;

INSERT INTO cash_book
(
    transaction_type,
    source,
    reference_id,
    customer_id,
    amount,
    remarks,
    created_by
)
VALUES
(
    'Cash In',
    'Bill Payment',
    42,
    1,
    69360,
    'Bill Payment Received',
    1
);

INSERT INTO bank_accounts
(
    bank_name,
    account_holder,
    account_number,
    ifsc_code,
    opening_balance,
    current_balance
)
VALUES
(
    'State Bank of India',
    'JL Jewellers',
    '123456789012',
    'SBIN0001234',
    500000,
    500000
);

INSERT INTO gst_details
(
    gst_number,
    state
)
VALUES
(
    '09ABCDE1234F1Z5',
    'Uttar Pradesh'
);

INSERT INTO users
(name, email, password, role, status)
VALUES

('Admin User',
'admin@jljewellers.com',
'admin123',
'admin',
'active'),

('Riya Singh',
'riya@jljewellers.com',
'riya123',
'finance',
'active'),

('Purvansh Sharma',
'purvansh@jljewellers.com',
'purvansh123',
'inventory',
'active'),

('Solanki Patel',
'solanki@jljewellers.com',
'solanki123',
'manager',
'active'),

('Rahul Verma',
'rahul@jljewellers.com',
'rahul123',
'sales',
'active'),

('Priya Gupta',
'priya@jljewellers.com',
'priya123',
'cashier',
'active'),

('Nisha Sharma',
'nisha@jljewellers.com',
'nisha123',
'staff',
'active'),

('Vivek Singh',
'vivek@jljewellers.com',
'vivek123',
'staff',
'inactive');