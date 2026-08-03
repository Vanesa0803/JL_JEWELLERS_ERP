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