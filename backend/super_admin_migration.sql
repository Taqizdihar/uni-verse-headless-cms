-- Migration Script: Super Admin Update History
-- Run this in your MySQL database to support the new Super Admin Dashboard features.

CREATE TABLE IF NOT EXISTS update_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS update_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    update_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (update_id) REFERENCES update_history(id) ON DELETE CASCADE
);
