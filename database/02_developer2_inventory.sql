-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: jl_jewellers_erp
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_code` varchar(15) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_code` (`category_code`),
  UNIQUE KEY `category_name` (`category_name`),
  UNIQUE KEY `idx_categories_code` (`category_code`),
  UNIQUE KEY `idx_categories_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_documents`
--

DROP TABLE IF EXISTS `customer_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `document_type` enum('Aadhaar','PAN','Passport','Driving Licence','GST Certificate','Other') NOT NULL,
  `document_number` varchar(50) DEFAULT NULL,
  `document_file` varchar(255) DEFAULT NULL,
  `remarks` text,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `idx_customer_documents_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_loyalty`
--

DROP TABLE IF EXISTS `customer_loyalty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_loyalty` (
  `loyalty_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `points_earned` int DEFAULT '0',
  `points_redeemed` int DEFAULT '0',
  `current_points` int DEFAULT '0',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loyalty_id`),
  KEY `idx_customer_loyalty_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_notes`
--

DROP TABLE IF EXISTS `customer_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_notes` (
  `note_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `note` text NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`),
  KEY `idx_customer_notes_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_order_items`
--

DROP TABLE IF EXISTS `customer_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_order_items` (
  `customer_order_item_id` int NOT NULL AUTO_INCREMENT,
  `customer_order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `gross_weight` decimal(10,3) DEFAULT NULL,
  `net_weight` decimal(10,3) DEFAULT NULL,
  `purity_id` int DEFAULT NULL,
  `making_charge` decimal(15,2) DEFAULT NULL,
  `estimated_price` decimal(15,2) DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`customer_order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_order_measurements`
--

DROP TABLE IF EXISTS `customer_order_measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_order_measurements` (
  `measurement_id` int NOT NULL AUTO_INCREMENT,
  `customer_order_id` int NOT NULL,
  `measurement_type` varchar(100) DEFAULT NULL,
  `measurement_value` varchar(50) DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`measurement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_orders`
--

DROP TABLE IF EXISTS `customer_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_orders` (
  `customer_order_id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(20) NOT NULL,
  `customer_id` int NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery` date DEFAULT NULL,
  `order_type` enum('Ready Stock','Custom Jewellery','Repair') DEFAULT 'Custom Jewellery',
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `advance_amount` decimal(15,2) DEFAULT '0.00',
  `balance_amount` decimal(15,2) DEFAULT '0.00',
  `remarks` text,
  `order_status` enum('Pending','Approved','In Production','Ready','Delivered','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_order_id`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_code` varchar(15) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `mobile` varchar(15) NOT NULL,
  `alternate_mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `anniversary_date` date DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'India',
  `pincode` varchar(10) DEFAULT NULL,
  `customer_type` enum('Regular','VIP','Wholesale') DEFAULT 'Regular',
  `loyalty_points` int DEFAULT '0',
  `credit_limit` decimal(15,2) DEFAULT '0.00',
  `remarks` text,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_code` (`customer_code`),
  UNIQUE KEY `mobile` (`mobile`),
  UNIQUE KEY `idx_customers_customer_code` (`customer_code`),
  UNIQUE KEY `idx_customers_mobile` (`mobile`),
  KEY `idx_customers_first_name` (`first_name`),
  KEY `idx_customers_last_name` (`last_name`),
  KEY `idx_customers_customer_type` (`customer_type`),
  KEY `idx_customers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `designs`
--

DROP TABLE IF EXISTS `designs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designs` (
  `design_id` int NOT NULL AUTO_INCREMENT,
  `design_code` varchar(15) NOT NULL,
  `design_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`design_id`),
  UNIQUE KEY `design_code` (`design_code`),
  UNIQUE KEY `design_name` (`design_name`),
  UNIQUE KEY `idx_designs_code` (`design_code`),
  UNIQUE KEY `idx_designs_name` (`design_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gold_scheme_enrollments`
--

DROP TABLE IF EXISTS `gold_scheme_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gold_scheme_enrollments` (
  `enrollment_id` int NOT NULL AUTO_INCREMENT,
  `enrollment_number` varchar(20) NOT NULL,
  `scheme_type_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `enrollment_date` date NOT NULL,
  `maturity_date` date NOT NULL,
  `nominee_name` varchar(100) DEFAULT NULL,
  `nominee_mobile` varchar(15) DEFAULT NULL,
  `total_paid` decimal(15,2) DEFAULT '0.00',
  `pending_amount` decimal(15,2) DEFAULT '0.00',
  `enrollment_status` enum('Active','Completed','Closed','Cancelled') DEFAULT 'Active',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `enrollment_number` (`enrollment_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gold_scheme_installments`
--

DROP TABLE IF EXISTS `gold_scheme_installments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gold_scheme_installments` (
  `installment_id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `installment_number` int NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `installment_amount` decimal(15,2) DEFAULT NULL,
  `payment_method` enum('Cash','Card','UPI','Bank Transfer') DEFAULT NULL,
  `payment_reference` varchar(50) DEFAULT NULL,
  `installment_status` enum('Pending','Paid','Missed') DEFAULT 'Pending',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`installment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gold_scheme_ledger`
--

DROP TABLE IF EXISTS `gold_scheme_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gold_scheme_ledger` (
  `ledger_id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `transaction_date` date NOT NULL,
  `transaction_type` enum('Installment','Bonus','Adjustment','Refund','Maturity') DEFAULT NULL,
  `debit` decimal(15,2) DEFAULT '0.00',
  `credit` decimal(15,2) DEFAULT '0.00',
  `balance` decimal(15,2) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ledger_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gold_scheme_types`
--

DROP TABLE IF EXISTS `gold_scheme_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gold_scheme_types` (
  `scheme_type_id` int NOT NULL AUTO_INCREMENT,
  `scheme_code` varchar(15) NOT NULL,
  `scheme_name` varchar(100) NOT NULL,
  `scheme_description` text,
  `installment_type` enum('Amount','Weight') DEFAULT 'Amount',
  `installment_amount` decimal(15,2) DEFAULT NULL,
  `installment_weight` decimal(10,3) DEFAULT NULL,
  `duration_months` int NOT NULL,
  `bonus_type` enum('None','One Installment','Percentage') DEFAULT 'None',
  `bonus_value` decimal(10,2) DEFAULT '0.00',
  `minimum_installment` decimal(15,2) DEFAULT NULL,
  `maximum_installment` decimal(15,2) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`scheme_type_id`),
  UNIQUE KEY `scheme_code` (`scheme_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `goods_receipt_items`
--

DROP TABLE IF EXISTS `goods_receipt_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt_items` (
  `grn_item_id` int NOT NULL AUTO_INCREMENT,
  `grn_id` int NOT NULL,
  `product_id` int NOT NULL,
  `received_quantity` int NOT NULL,
  `accepted_quantity` int NOT NULL,
  `rejected_quantity` int DEFAULT '0',
  `purchase_rate` decimal(15,2) DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`grn_item_id`),
  KEY `idx_grn_items_grn` (`grn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `goods_receipt_notes`
--

DROP TABLE IF EXISTS `goods_receipt_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt_notes` (
  `grn_id` int NOT NULL AUTO_INCREMENT,
  `grn_number` varchar(20) NOT NULL,
  `purchase_order_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `received_date` date NOT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `remarks` text,
  `status` enum('Pending','Verified','Completed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`grn_id`),
  UNIQUE KEY `grn_number` (`grn_number`),
  UNIQUE KEY `idx_grn_number` (`grn_number`),
  KEY `idx_grn_supplier` (`supplier_id`),
  KEY `idx_grn_po` (`purchase_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `available_quantity` int DEFAULT '0',
  `reserved_quantity` int DEFAULT '0',
  `minimum_stock` int DEFAULT '0',
  `maximum_stock` int DEFAULT '0',
  `stock_location` varchar(100) DEFAULT NULL,
  `last_stock_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_id`),
  KEY `idx_inventory_product` (`product_id`),
  KEY `idx_inventory_variant` (`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maker_assignments`
--

DROP TABLE IF EXISTS `maker_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maker_assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `customer_order_id` int NOT NULL,
  `maker_id` int NOT NULL,
  `assigned_date` date DEFAULT NULL,
  `expected_completion` date DEFAULT NULL,
  `actual_completion` date DEFAULT NULL,
  `assignment_status` enum('Assigned','In Progress','Completed','Delayed','Cancelled') DEFAULT 'Assigned',
  `remarks` text,
  PRIMARY KEY (`assignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maker_categories`
--

DROP TABLE IF EXISTS `maker_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maker_categories` (
  `maker_category_id` int NOT NULL AUTO_INCREMENT,
  `maker_id` int NOT NULL,
  `category_id` int NOT NULL,
  `skill_level` enum('Beginner','Intermediate','Expert') DEFAULT 'Intermediate',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`maker_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maker_payments`
--

DROP TABLE IF EXISTS `maker_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maker_payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `maker_id` int NOT NULL,
  `assignment_id` int DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `payment_method` enum('Cash','Bank Transfer','UPI','Cheque') DEFAULT NULL,
  `payment_status` enum('Pending','Paid') DEFAULT 'Pending',
  `remarks` text,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maker_work_logs`
--

DROP TABLE IF EXISTS `maker_work_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maker_work_logs` (
  `work_log_id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `work_date` date DEFAULT NULL,
  `work_description` text,
  `hours_worked` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`work_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `makers`
--

DROP TABLE IF EXISTS `makers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `makers` (
  `maker_id` int NOT NULL AUTO_INCREMENT,
  `maker_code` varchar(15) NOT NULL,
  `maker_name` varchar(150) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `alternate_mobile` varchar(15) DEFAULT NULL,
  `address` text,
  `joining_date` date DEFAULT NULL,
  `experience_years` int DEFAULT '0',
  `payment_type` enum('Piece Rate','Monthly Salary','Daily Wage') DEFAULT 'Piece Rate',
  `remarks` text,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`maker_id`),
  UNIQUE KEY `maker_code` (`maker_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metal_types`
--

DROP TABLE IF EXISTS `metal_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metal_types` (
  `metal_type_id` int NOT NULL AUTO_INCREMENT,
  `metal_code` varchar(15) NOT NULL,
  `metal_name` varchar(50) NOT NULL,
  `metal_symbol` varchar(10) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`metal_type_id`),
  UNIQUE KEY `metal_code` (`metal_code`),
  UNIQUE KEY `metal_name` (`metal_name`),
  UNIQUE KEY `idx_metal_types_code` (`metal_code`),
  UNIQUE KEY `idx_metal_types_name` (`metal_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `customer_order_id` int NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `changed_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `remarks` text,
  PRIMARY KEY (`history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_barcodes`
--

DROP TABLE IF EXISTS `product_barcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_barcodes` (
  `barcode_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`barcode_id`),
  UNIQUE KEY `barcode` (`barcode`),
  UNIQUE KEY `idx_product_barcodes_barcode` (`barcode`),
  KEY `idx_product_barcodes_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `image_type` enum('Front','Back','Side','Certificate','Other') DEFAULT 'Front',
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `idx_product_images_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `variant_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `variant_code` varchar(20) NOT NULL,
  `size` varchar(20) DEFAULT NULL,
  `gross_weight` decimal(10,3) DEFAULT NULL,
  `net_weight` decimal(10,3) DEFAULT NULL,
  `stone_weight` decimal(10,3) DEFAULT '0.000',
  `making_charge_type` enum('Fixed','Percentage') DEFAULT 'Percentage',
  `making_charge_value` decimal(15,2) DEFAULT NULL,
  `wastage_percentage` decimal(5,2) DEFAULT '0.00',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`variant_id`),
  UNIQUE KEY `variant_code` (`variant_code`),
  UNIQUE KEY `idx_product_variants_code` (`variant_code`),
  KEY `idx_product_variants_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(15) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `category_id` int NOT NULL,
  `subcategory_id` int DEFAULT NULL,
  `design_id` int DEFAULT NULL,
  `metal_type_id` int NOT NULL,
  `purity_id` int NOT NULL,
  `stone_type_id` int DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT NULL,
  `description` text,
  `is_customizable` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`),
  UNIQUE KEY `idx_products_code` (`product_code`),
  KEY `idx_products_name` (`product_name`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_subcategory` (`subcategory_id`),
  KEY `idx_products_design` (`design_id`),
  KEY `idx_products_metal` (`metal_type_id`),
  KEY `idx_products_purity` (`purity_id`),
  KEY `idx_products_stone` (`stone_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purchase_order_items`
--

DROP TABLE IF EXISTS `purchase_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_items` (
  `purchase_order_item_id` int NOT NULL AUTO_INCREMENT,
  `purchase_order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `ordered_quantity` int NOT NULL,
  `received_quantity` int DEFAULT '0',
  `purchase_rate` decimal(15,2) NOT NULL,
  `remarks` text,
  PRIMARY KEY (`purchase_order_item_id`),
  KEY `idx_purchase_order_items_po` (`purchase_order_id`),
  KEY `idx_purchase_order_items_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `purchase_order_id` int NOT NULL AUTO_INCREMENT,
  `purchase_order_number` varchar(20) NOT NULL,
  `supplier_id` int NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery` date DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `remarks` text,
  `order_status` enum('Draft','Approved','Partially Received','Completed','Cancelled') DEFAULT 'Draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_order_id`),
  UNIQUE KEY `purchase_order_number` (`purchase_order_number`),
  UNIQUE KEY `idx_purchase_orders_number` (`purchase_order_number`),
  KEY `idx_purchase_orders_supplier` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purchase_returns`
--

DROP TABLE IF EXISTS `purchase_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_returns` (
  `purchase_return_id` int NOT NULL AUTO_INCREMENT,
  `return_number` varchar(20) NOT NULL,
  `supplier_id` int NOT NULL,
  `grn_id` int NOT NULL,
  `return_date` date NOT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_return_id`),
  UNIQUE KEY `return_number` (`return_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purity`
--

DROP TABLE IF EXISTS `purity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purity` (
  `purity_id` int NOT NULL AUTO_INCREMENT,
  `purity_code` varchar(15) NOT NULL,
  `purity_name` varchar(20) NOT NULL,
  `purity_percentage` decimal(5,2) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`purity_id`),
  UNIQUE KEY `purity_code` (`purity_code`),
  UNIQUE KEY `purity_name` (`purity_name`),
  UNIQUE KEY `idx_purity_code` (`purity_code`),
  UNIQUE KEY `idx_purity_name` (`purity_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `movement_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `movement_type` enum('Purchase','Sale','Return','Repair','Adjustment','Opening Stock','Transfer') NOT NULL,
  `quantity` int NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `remarks` text,
  `movement_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movement_id`),
  KEY `idx_stock_movements_product` (`product_id`),
  KEY `idx_stock_movements_date` (`movement_date`),
  KEY `idx_stock_movements_type` (`movement_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stone_types`
--

DROP TABLE IF EXISTS `stone_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stone_types` (
  `stone_type_id` int NOT NULL AUTO_INCREMENT,
  `stone_code` varchar(15) NOT NULL,
  `stone_name` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`stone_type_id`),
  UNIQUE KEY `stone_code` (`stone_code`),
  UNIQUE KEY `stone_name` (`stone_name`),
  UNIQUE KEY `idx_stone_types_code` (`stone_code`),
  UNIQUE KEY `idx_stone_types_name` (`stone_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `subcategory_id` int NOT NULL AUTO_INCREMENT,
  `subcategory_code` varchar(15) NOT NULL,
  `category_id` int NOT NULL,
  `subcategory_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subcategory_id`),
  UNIQUE KEY `subcategory_code` (`subcategory_code`),
  UNIQUE KEY `idx_subcategories_code` (`subcategory_code`),
  KEY `idx_subcategories_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supplier_documents`
--

DROP TABLE IF EXISTS `supplier_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `document_type` enum('GST Certificate','PAN','Trade Licence','Agreement','Other') NOT NULL,
  `document_number` varchar(100) DEFAULT NULL,
  `document_file` varchar(255) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `idx_supplier_documents_supplier` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supplier_payments`
--

DROP TABLE IF EXISTS `supplier_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_payments` (
  `supplier_payment_id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `purchase_order_id` int DEFAULT NULL,
  `payment_reference` varchar(30) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_method` enum('Cash','Cheque','Bank Transfer','UPI','NEFT','RTGS') DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`supplier_payment_id`),
  KEY `idx_supplier_payments_supplier` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_code` varchar(15) NOT NULL,
  `supplier_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `mobile` varchar(15) NOT NULL,
  `alternate_mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'India',
  `pincode` varchar(10) DEFAULT NULL,
  `opening_balance` decimal(15,2) DEFAULT '0.00',
  `supplier_type` enum('Manufacturer','Wholesaler','Distributor','Local Vendor','Service Provider') DEFAULT 'Wholesaler',
  `remarks` text,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `supplier_code` (`supplier_code`),
  UNIQUE KEY `idx_suppliers_code` (`supplier_code`),
  KEY `idx_suppliers_name` (`supplier_name`),
  KEY `idx_suppliers_mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-30 23:09:15
