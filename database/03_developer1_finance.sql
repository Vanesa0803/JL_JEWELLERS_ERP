
USE jl_jewellers_erp;

CREATE TABLE cash_book (

    cashbook_id INT AUTO_INCREMENT PRIMARY KEY,

    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    transaction_type ENUM(
        'Cash In',
        'Cash Out'
    ) NOT NULL,

    source ENUM(
        'Bill Payment',
        'Advance Payment',
        'Refund',
        'Expense',
        'Manual'
    ) NOT NULL,

    reference_id INT NULL,

    customer_id INT NULL,

    amount DECIMAL(18,2) NOT NULL,

    remarks TEXT,

    created_by INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id)

);

ALTER TABLE expenses
ADD COLUMN payment_method ENUM(
    'Cash',
    'Card',
    'UPI',
    'Bank Transfer'
) NOT NULL AFTER amount,

ADD COLUMN created_by INT NULL AFTER remarks,

ADD COLUMN created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP AFTER created_by,

ADD COLUMN updated_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP
AFTER created_at;

CREATE TABLE IF NOT EXISTS income (

    income_id INT PRIMARY KEY AUTO_INCREMENT,

    income_type VARCHAR(100) NOT NULL,

    amount DECIMAL(15,2) NOT NULL,

    payment_method ENUM(
        'Cash',
        'Card',
        'UPI',
        'Bank Transfer'
    ) NOT NULL,

    income_date DATE,

    remarks TEXT,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP

);

ALTER TABLE income
CHANGE COLUMN income_source income_type VARCHAR(100);

ALTER TABLE income
ADD COLUMN payment_method ENUM(
    'Cash',
    'Card',
    'UPI',
    'Bank Transfer'
) NOT NULL AFTER amount,

ADD COLUMN created_by INT NULL AFTER remarks,

ADD COLUMN created_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP AFTER created_by,

ADD COLUMN updated_at TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP
AFTER created_at;

ALTER TABLE income
CHANGE COLUMN received_date income_date DATE;

CREATE TABLE financial_security (
    security_id INT PRIMARY KEY AUTO_INCREMENT,

    pin_hash VARCHAR(255) NOT NULL,

    max_discount_percent DECIMAL(5,2) DEFAULT 10.00,

    max_rate_change_percent DECIMAL(5,2) DEFAULT 2.00,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);