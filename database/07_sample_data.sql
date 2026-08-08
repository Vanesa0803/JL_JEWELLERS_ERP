USE jl_jewellers_erp;

-- =====================================================
-- COMPANY DETAILS
-- =====================================================

INSERT INTO company_details
(company_name, owner_name, phone, email, address)

VALUES
(
'JL Jewellers',
'Jitendra Lal',
'9876543210',
'info@jljewellers.com',
'Main Market, Darbhanga, Bihar'
);

-- =====================================================
-- DEPARTMENTS
-- =====================================================

INSERT INTO departments
(department_name, description)

VALUES
('Sales','Handles customer billing and jewellery sales'),
('Accounts','Finance, ledger and GST'),
('Inventory','Stock and inventory management'),
('Purchase','Supplier and purchase management'),
('Admin','System administration');

-- =====================================================
-- EMPLOYEES
-- =====================================================

INSERT INTO employees
(
name,
phone,
email,
department,
designation,
salary,
joining_date,
status
)

VALUES

(
'Rohan Sharma',
'9876543211',
'rohan@jljewellers.com',
'Sales',
'Sales Executive',
30000,
'2025-01-15',
'active'
),

(
'Priya Singh',
'9876543212',
'priya@jljewellers.com',
'Accounts',
'Accountant',
40000,
'2024-11-20',
'active'
),

(
'Amit Kumar',
'9876543213',
'amit@jljewellers.com',
'Inventory',
'Inventory Manager',
35000,
'2025-02-10',
'active'
),

(
'Neha Verma',
'9876543214',
'neha@jljewellers.com',
'Purchase',
'Purchase Officer',
32000,
'2025-03-18',
'active'
),

(
'Admin User',
'9999999999',
'admin@jljewellers.com',
'Admin',
'Administrator',
60000,
'2024-01-01',
'active'
);

-- =====================================================
-- CATEGORIES
-- =====================================================

INSERT INTO categories
(
category_code,
category_name,
description,
display_order
)

VALUES

('CAT001','Rings','Finger rings',1),
('CAT002','Chains','Gold and Silver Chains',2),
('CAT003','Necklaces','Traditional Necklaces',3),
('CAT004','Bracelets','Bracelets and Kada',4),
('CAT005','Earrings','Studs and Earrings',5),
('CAT006','Pendants','Gold Pendants',6),
('CAT007','Anklets','Silver Anklets',7),
('CAT008','Coins','Gold and Silver Coins',8);

-- =====================================================
-- SUBCATEGORIES
-- =====================================================

INSERT INTO subcategories
(
subcategory_code,
category_id,
subcategory_name,
description
)

VALUES

('SUB001',1,'Gold Rings','22K & 18K Gold Rings'),
('SUB002',1,'Diamond Rings','Diamond Collection'),

('SUB003',2,'Gold Chains','22K Chains'),
('SUB004',2,'Silver Chains','Silver Chains'),

('SUB005',3,'Wedding Necklaces','Bridal Collection'),
('SUB006',3,'Daily Wear Necklaces','Regular Wear'),

('SUB007',4,'Bracelets','Bracelets'),
('SUB008',4,'Kada','Traditional Kada'),

('SUB009',5,'Stud Earrings','Daily Wear'),
('SUB010',5,'Hanging Earrings','Party Wear'),

('SUB011',6,'Religious Pendants','Temple Jewellery'),
('SUB012',7,'Silver Anklets','Traditional'),

('SUB013',8,'Gold Coins','Investment'),
('SUB014',8,'Silver Coins','Investment');

-- =====================================================
-- DESIGNS
-- =====================================================

INSERT INTO designs
(
design_code,
design_name,
description
)

VALUES

('DES001','Classic','Traditional Design'),
('DES002','Modern','Modern Collection'),
('DES003','Antique','Antique Finish'),
('DES004','Temple','Temple Jewellery'),
('DES005','Bridal','Wedding Collection'),
('DES006','Minimal','Minimal Design'),
('DES007','Luxury','Premium Collection'),
('DES008','Designer','Exclusive Design');

-- =====================================================
-- METAL TYPES
-- =====================================================

INSERT INTO metal_types
(
metal_code,
metal_name,
metal_symbol
)

VALUES

('MT001','Gold','Au'),
('MT002','Silver','Ag'),
('MT003','Platinum','Pt');

-- =====================================================
-- PURITY
-- =====================================================

INSERT INTO purity
(
purity_code,
purity_name,
purity_percentage
)

VALUES

('P001','24K',99.90),
('P002','22K',91.60),
('P003','18K',75.00),
('P004','14K',58.50),
('P005','999 Silver',99.90),
('P006','925 Silver',92.50),
('P007','950 Platinum',95.00);

-- =====================================================
-- STONE TYPES
-- =====================================================

INSERT INTO stone_types
(
stone_code,
stone_name
)

VALUES

('ST001','None'),
('ST002','Diamond'),
('ST003','Ruby'),
('ST004','Emerald'),
('ST005','Sapphire'),
('ST006','Pearl'),
('ST007','CZ'),
('ST008','American Diamond');

USE jl_jewellers_erp;

-- =====================================================
-- GST RATES
-- =====================================================

INSERT INTO gst_rates
(gst_name, percentage, applicable_to, effective_from, is_active)

VALUES
('GST on Gold',3.00,'Metal','2025-04-01',1),
('GST on Silver',3.00,'Metal','2025-04-01',1),
('GST on Platinum',3.00,'Metal','2025-04-01',1),
('GST on Making Charges',5.00,'Making Charge','2025-04-01',1);

-- =====================================================
-- METAL RATES
-- =====================================================

INSERT INTO metal_rates
(metal_type, rate)

VALUES
('Gold',9850.00),
('Silver',115.00),
('Platinum',4200.00);

-- =====================================================
-- SUPPLIERS
-- =====================================================

INSERT INTO suppliers
(
supplier_code,
supplier_name,
contact_person,
mobile,
email,
gst_number,
pan_number,
address_line1,
city,
state,
country,
pincode,
opening_balance,
supplier_type,
remarks,
status
)

VALUES

('SUP001','Shree Gold House','Rajesh Agarwal','9876500001',
'goldhouse@gmail.com','10ABCDE1234F1Z5','ABCDE1234F',
'Karol Bagh','New Delhi','Delhi','India','110005',
50000,'Manufacturer','Gold Jewellery Supplier','Active'),

('SUP002','Silver Palace','Amit Jain','9876500002',
'silverpalace@gmail.com','10ABCDE5678G1Z2','ABCDE5678G',
'Johari Bazaar','Jaipur','Rajasthan','India','302003',
30000,'Wholesaler','Silver Jewellery','Active'),

('SUP003','Diamond World','Neeraj Gupta','9876500003',
'diamond@gmail.com','27ABCDE3456H1Z6','ABCDE3456H',
'Opera House','Mumbai','Maharashtra','India','400004',
70000,'Distributor','Diamond Supplier','Active'),

('SUP004','Classic Jewels','Sanjay Verma','9876500004',
'classic@gmail.com','09ABCDE2222K1Z1','ABCDE2222K',
'Hazratganj','Lucknow','Uttar Pradesh','India','226001',
25000,'Local Vendor','Local Supplier','Active'),

('SUP005','Royal Bullion','Pankaj Singh','9876500005',
'royal@gmail.com','20ABCDE9999L1Z4','ABCDE9999L',
'Boring Road','Patna','Bihar','India','800001',
40000,'Wholesaler','Bullion Supplier','Active');

-- =====================================================
-- PRODUCTS
-- =====================================================

INSERT INTO products
(
product_code,
product_name,
category_id,
subcategory_id,
design_id,
metal_type_id,
purity_id,
stone_type_id,
hsn_code,
description,
is_customizable,
is_active
)

VALUES

('PRD001','22K Gold Ring',1,1,1,1,2,1,'7113','Classic Gold Ring',1,1),

('PRD002','Diamond Ring',1,2,7,1,2,2,'7113','Diamond Ring',1,1),

('PRD003','Gold Chain 18 Inch',2,3,2,1,2,1,'7113','Gold Chain',1,1),

('PRD004','Silver Chain',2,4,6,2,6,1,'7113','Silver Chain',0,1),

('PRD005','Bridal Necklace',3,5,5,1,2,2,'7113','Wedding Necklace',1,1),

('PRD006','Daily Wear Necklace',3,6,6,1,2,1,'7113','Daily Necklace',0,1),

('PRD007','Gold Bracelet',4,7,2,1,2,1,'7113','Bracelet',1,1),

('PRD008','Traditional Kada',4,8,3,1,2,1,'7113','Gold Kada',1,1),

('PRD009','Gold Stud Earrings',5,9,1,1,2,1,'7113','Stud Earrings',0,1),

('PRD010','Designer Earrings',5,10,8,1,2,2,'7113','Designer Earrings',1,1),

('PRD011','Temple Pendant',6,11,4,1,2,1,'7113','Temple Pendant',1,1),

('PRD012','Silver Anklet',7,12,1,2,6,1,'7113','Silver Anklet',0,1),

('PRD013','Gold Coin 10g',8,13,1,1,1,1,'7114','Investment Coin',0,1),

('PRD014','Silver Coin 20g',8,14,1,2,5,1,'7114','Silver Coin',0,1),

('PRD015','Platinum Ring',1,1,7,3,7,1,'7113','Premium Platinum Ring',1,1);

-- =====================================================
-- INVENTORY
-- =====================================================

INSERT INTO inventory
(
product_id,
variant_id,
available_quantity,
reserved_quantity,
minimum_stock,
maximum_stock,
stock_location
)

VALUES

(1,NULL,25,2,5,100,'Rack A1'),
(2,NULL,10,1,2,50,'Rack A2'),
(3,NULL,18,0,5,80,'Rack B1'),
(4,NULL,30,2,10,120,'Rack B2'),
(5,NULL,8,0,2,30,'Rack C1'),
(6,NULL,12,0,3,40,'Rack C2'),
(7,NULL,15,1,5,50,'Rack D1'),
(8,NULL,9,0,2,30,'Rack D2'),
(9,NULL,20,2,5,70,'Rack E1'),
(10,NULL,14,1,5,60,'Rack E2'),
(11,NULL,11,0,2,40,'Rack F1'),
(12,NULL,22,2,5,80,'Rack F2'),
(13,NULL,40,0,10,200,'Vault A'),
(14,NULL,35,0,10,150,'Vault B'),
(15,NULL,5,0,2,20,'Premium Locker');

USE jl_jewellers_erp;

-- =====================================================
-- CUSTOMERS
-- =====================================================

INSERT INTO customers
(
customer_code,
first_name,
last_name,
gender,
mobile,
email,
city,
state,
country,
customer_type,
credit_limit,
status
)

VALUES

('CUST001','Rahul','Sharma','Male','9877000001','rahul@gmail.com','Darbhanga','Bihar','India','Regular',50000,'Active'),
('CUST002','Priya','Singh','Female','9877000002','priya@gmail.com','Patna','Bihar','India','VIP',150000,'Active'),
('CUST003','Amit','Kumar','Male','9877000003','amit@gmail.com','Muzaffarpur','Bihar','India','Regular',50000,'Active'),
('CUST004','Neha','Verma','Female','9877000004','neha@gmail.com','Ranchi','Jharkhand','India','Regular',50000,'Active'),
('CUST005','Sanjay','Gupta','Male','9877000005','sanjay@gmail.com','Delhi','Delhi','India','Wholesale',300000,'Active'),
('CUST006','Kavita','Jha','Female','9877000006','kavita@gmail.com','Darbhanga','Bihar','India','VIP',200000,'Active'),
('CUST007','Ankit','Sinha','Male','9877000007','ankit@gmail.com','Patna','Bihar','India','Regular',50000,'Active'),
('CUST008','Sneha','Mishra','Female','9877000008','sneha@gmail.com','Lucknow','UP','India','Regular',50000,'Active'),
('CUST009','Rohit','Yadav','Male','9877000009','rohit@gmail.com','Kanpur','UP','India','Regular',50000,'Active'),
('CUST010','Meera','Das','Female','9877000010','meera@gmail.com','Kolkata','West Bengal','India','VIP',200000,'Active'),
('CUST011','Deepak','Pandey','Male','9877000011','deepak@gmail.com','Patna','Bihar','India','Regular',50000,'Active'),
('CUST012','Pooja','Kumari','Female','9877000012','pooja@gmail.com','Darbhanga','Bihar','India','Regular',50000,'Active'),
('CUST013','Vivek','Singh','Male','9877000013','vivek@gmail.com','Gaya','Bihar','India','Regular',50000,'Active'),
('CUST014','Nisha','Roy','Female','9877000014','nisha@gmail.com','Siliguri','West Bengal','India','Regular',50000,'Active'),
('CUST015','Arjun','Prasad','Male','9877000015','arjun@gmail.com','Patna','Bihar','India','VIP',150000,'Active'),
('CUST016','Riya','Sinha','Female','9877000016','riya@gmail.com','Darbhanga','Bihar','India','Regular',50000,'Active'),
('CUST017','Mohit','Jain','Male','9877000017','mohit@gmail.com','Jaipur','Rajasthan','India','Wholesale',300000,'Active'),
('CUST018','Anjali','Gupta','Female','9877000018','anjali@gmail.com','Ranchi','Jharkhand','India','Regular',50000,'Active'),
('CUST019','Karan','Malhotra','Male','9877000019','karan@gmail.com','Delhi','Delhi','India','VIP',250000,'Active'),
('CUST020','Sakshi','Agarwal','Female','9877000020','sakshi@gmail.com','Patna','Bihar','India','Regular',50000,'Active');


-- =====================================================
-- BILLS
-- =====================================================

INSERT INTO bills
(
invoice_prefix,
invoice_number,
customer_id,
employee_id,
bill_date,
subtotal,
total_discount,
total_gst,
grand_total,
payment_status,
bill_status,
version_no,
remarks,
created_by,
updated_by
)

VALUES

('INV','INV000001',1,1,'2026-07-25 10:15:00',85000,2000,2550,85550,'Completed','Completed',1,'Festival Purchase',5,5),

('INV','INV000002',2,2,'2026-07-25 11:40:00',125000,5000,3600,123600,'Completed','Completed',1,NULL,5,5),

('INV','INV000003',3,1,'2026-07-25 13:20:00',54000,1000,1620,54620,'Pending','Completed',1,NULL,5,5),

('INV','INV000004',4,3,'2026-07-26 10:30:00',95000,3000,2760,94760,'Completed','Completed',1,NULL,5,5),

('INV','INV000005',5,2,'2026-07-26 12:15:00',160000,5000,4650,159650,'Completed','Completed',1,NULL,5,5),

('INV','INV000006',6,1,'2026-07-26 15:40:00',72000,1500,2115,72615,'Partial','Completed',1,NULL,5,5),

('INV','INV000007',7,4,'2026-07-27 09:45:00',48000,1000,1410,48410,'Completed','Completed',1,NULL,5,5),

('INV','INV000008',8,1,'2026-07-27 11:00:00',89000,2500,2595,89095,'Pending','Completed',1,NULL,5,5),

('INV','INV000009',9,3,'2026-07-27 13:30:00',112000,3000,3270,112270,'Completed','Completed',1,NULL,5,5),

('INV','INV000010',10,2,'2026-07-28 10:10:00',65000,1500,1905,65405,'Completed','Completed',1,NULL,5,5),

('INV','INV000011',11,1,'2026-07-28 12:25:00',98000,2000,2880,98880,'Completed','Completed',1,NULL,5,5),

('INV','INV000012',12,4,'2026-07-28 15:00:00',45000,500,1335,45835,'Pending','Completed',1,NULL,5,5),

('INV','INV000013',13,2,'2026-07-29 11:45:00',175000,6000,5070,174070,'Completed','Completed',1,NULL,5,5),

('INV','INV000014',14,3,'2026-07-29 14:10:00',58000,1000,1710,58710,'Completed','Completed',1,NULL,5,5),

('INV','INV000015',15,1,'2026-07-30 16:20:00',210000,7000,6090,209090,'Partial','Completed',1,'Wedding Order',5,5);

USE jl_jewellers_erp;

INSERT INTO bill_items
(
bill_id,
product_id,
metal_type,
purity,
quantity,
net_weight,
rate,
metal_value,
making_charge_percent,
making_charge,
taxable_value,
gst_metal,
gst_making,
discount,
line_total
)

VALUES
(2,1,'Gold','22K',1,8.500,9850,83725,10,8372.50,92097.50,2511.75,418.63,2000,89027.88),
(2,9,'Gold','22K',1,2.000,9850,19700,8,1576.00,21276.00,591.00,78.80,0,21945.80),
(3,2,'Gold','22K',1,6.200,9850,61070,12,7328.40,68398.40,1832.10,366.42,2000,68596.92),
(3,11,'Gold','22K',1,4.100,9850,40385,10,4038.50,44423.50,1211.55,201.93,3000,42837.98),
(4,3,'Gold','22K',1,5.000,9850,49250,9,4432.50,53682.50,1477.50,221.63,1000,54381.63),
(5,5,'Gold','22K',1,9.200,9850,90620,12,10874.40,101494.40,2718.60,543.72,3000,101756.72),
(6,5,'Gold','22K',1,14.800,9850,145780,10,14578.00,160358.00,4373.40,728.90,5000,160460.30),
(6,13,'Gold','24K',1,10.000,9850,98500,2,1970.00,100470.00,2955.00,98.50,0,103523.50),
(7,7,'Gold','22K',1,6.800,9850,66980,8,5358.40,72338.40,2009.40,267.92,1500,73115.72),
(8,12,'Silver','925 Silver',1,25.000,115,2875,12,345.00,3220.00,86.25,17.25,500,2823.50),
(8,14,'Silver','999 Silver',2,20.000,115,4600,5,230.00,4830.00,138.00,11.50,500,4479.50),

(9,10,'Gold','22K',1,7.300,9850,71905,10,7190.50,79095.50,2157.15,359.53,2500,79112.18),
(10,8,'Gold','22K',1,10.000,9850,98500,8,7880.00,106380.00,2955.00,394.00,3000,106729.00),

(11,4,'Silver','925 Silver',1,18.000,115,2070,8,165.60,2235.60,62.10,8.28,500,1805.98),

(12,15,'Platinum','950 Platinum',1,5.500,4200,23100,12,2772.00,25872.00,693.00,138.60,1000,25703.60),
(13,1,'Gold','22K',1,4.000,9850,39400,10,3940.00,43340.00,1182.00,197.00,500,44219.00),


(14,5,'Gold','22K',1,16.500,9850,162525,10,16252.50,178777.50,4875.75,812.63,6000,178465.88),
(15,3,'Gold','22K',1,5.800,9850,57130,8,4570.40,61700.40,1713.90,228.52,1000,62642.82),

(16,5,'Gold','22K',1,18.000,9850,177300,12,21276.00,198576.00,5319.00,1063.80,7000,197958.80);

USE jl_jewellers_erp;

INSERT INTO payments
(
bill_id,
payment_date,
total_amount,
payment_status,
payment_type,
created_by,
updated_by
)

VALUES

(2,'2026-07-25 10:20:00',85550.00,'Completed','Bill Payment',1,1),
(3,'2026-07-25 11:45:00',123600.00,'Completed','Bill Payment',2,2),
(4,'2026-07-25 13:20:00',0.00,'Pending','Bill Payment',1,1),
(5,'2026-07-26 10:35:00',94760.00,'Completed','Bill Payment',3,3),
(6,'2026-07-26 12:20:00',159650.00,'Completed','Bill Payment',2,2),
(7,'2026-07-26 15:45:00',40000.00,'Partial','Bill Payment',1,1),
(8,'2026-07-27 09:50:00',48410.00,'Completed','Bill Payment',4,4),
(9,'2026-07-27 11:00:00',0.00,'Pending','Bill Payment',1,1),
(10,'2026-07-27 13:35:00',112270.00,'Completed','Bill Payment',3,3),
(11,'2026-07-28 10:15:00',65405.00,'Completed','Bill Payment',2,2),
(12,'2026-07-28 12:30:00',98880.00,'Completed','Bill Payment',1,1),
(13,'2026-07-28 15:00:00',0.00,'Pending','Bill Payment',4,4),
(14,'2026-07-29 11:50:00',174070.00,'Completed','Bill Payment',2,2),
(15,'2026-07-29 14:15:00',58710.00,'Completed','Bill Payment',3,3),
(16,'2026-07-30 16:25:00',100000.00,'Partial','Bill Payment',1,1);

USE jl_jewellers_erp;

INSERT INTO payment_details
(
payment_id,
payment_method,
amount,
reference_number,
transaction_time
)

VALUES

(1,'Cash',85550.00,NULL,'2026-07-25 10:20:00'),
(2,'UPI',123600.00,'UPI20260725001','2026-07-25 11:45:00'),
(4,'Card',94760.00,'CARD94760','2026-07-26 10:35:00'),
(5,'Cash',100000.00,NULL,'2026-07-26 12:20:00'),
(5,'Bank Transfer',59650.00,'BANK59650','2026-07-26 12:21:00'),
(6,'Cash',40000.00,NULL,'2026-07-26 15:45:00'),
(7,'UPI',48410.00,'UPI20260727001','2026-07-27 09:50:00'),
(9,'Bank Transfer',112270.00,'BANK112270','2026-07-27 13:35:00'),
(10,'Cash',65405.00,NULL,'2026-07-28 10:15:00'),
(11,'Card',98880.00,'CARD98880','2026-07-28 12:30:00'),
(13,'Cash',100000.00,NULL,'2026-07-29 11:50:00'),
(13,'UPI',74070.00,'UPI20260729001','2026-07-29 11:51:00'),
(14,'Cash',58710.00,NULL,'2026-07-29 14:15:00'),
(15,'Bank Transfer',100000.00,'BANK100000','2026-07-30 16:25:00');

USE jl_jewellers_erp;

INSERT INTO customer_ledger
(
customer_id,
bill_id,
transaction_type,
debit,
credit,
balance,
remarks
)

VALUES

(1,2,'Bill',85550.00,0.00,85550.00,'Invoice INV000001'),
(1,2,'Payment',0.00,85550.00,0.00,'Full Payment'),
(2,3,'Bill',123600.00,0.00,123600.00,'Invoice INV000002'),
(2,3,'Payment',0.00,123600.00,0.00,'Full Payment'),
(3,4,'Bill',54620.00,0.00,54620.00,'Invoice INV000003'),
(4,5,'Bill',94760.00,0.00,94760.00,'Invoice INV000004'),
(4,5,'Payment',0.00,94760.00,0.00,'Full Payment'),
(5,6,'Bill',159650.00,0.00,159650.00,'Invoice INV000005'),
(5,6,'Payment',0.00,159650.00,0.00,'Full Payment'),
(6,7,'Bill',72615.00,0.00,72615.00,'Invoice INV000006'),
(6,7,'Payment',0.00,40000.00,32615.00,'Partial Payment'),
(7,8,'Bill',48410.00,0.00,48410.00,'Invoice INV000007'),
(7,8,'Payment',0.00,48410.00,0.00,'Full Payment'),
(8,9,'Bill',89095.00,0.00,89095.00,'Invoice INV000008'),
(9,10,'Bill',112270.00,0.00,112270.00,'Invoice INV000009'),
(9,10,'Payment',0.00,112270.00,0.00,'Full Payment'),
(10,11,'Bill',65405.00,0.00,65405.00,'Invoice INV000010'),
(10,11,'Payment',0.00,65405.00,0.00,'Full Payment'),
(11,12,'Bill',98880.00,0.00,98880.00,'Invoice INV000011'),
(11,12,'Payment',0.00,98880.00,0.00,'Full Payment'),
(12,13,'Bill',45835.00,0.00,45835.00,'Invoice INV000012'),
(13,14,'Bill',174070.00,0.00,174070.00,'Invoice INV000013'),
(13,14,'Payment',0.00,174070.00,0.00,'Full Payment'),
(14,15,'Bill',58710.00,0.00,58710.00,'Invoice INV000014'),
(14,15,'Payment',0.00,58710.00,0.00,'Full Payment'),
(15,16,'Bill',209090.00,0.00,209090.00,'Invoice INV000015'),
(15,16,'Payment',0.00,100000.00,109090.00,'Partial Payment');

