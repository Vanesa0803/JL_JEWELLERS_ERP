
USE jl_jewellers_erp;
CREATE TABLE backup_history (
    backup_id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255),
    backup_type VARCHAR(50), -- manual / auto
    file_path TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);