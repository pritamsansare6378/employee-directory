CREATE DATABASE IF NOT EXISTS employee_directory
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE employee_directory;

CREATE TABLE IF NOT EXISTS employees (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  role VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_employees_email UNIQUE (email),
  INDEX idx_employees_name (name),
  INDEX idx_employees_role (role)
);
