CREATE TABLE tenants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_code VARCHAR(64) NOT NULL UNIQUE,
  tenant_name VARCHAR(128) NOT NULL,
  industry_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE merchants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  merchant_name VARCHAR(128) NOT NULL,
  contact_name VARCHAR(64) NOT NULL,
  contact_phone VARCHAR(32) NOT NULL,
  province VARCHAR(64),
  city VARCHAR(64),
  district VARCHAR(64),
  address_detail VARCHAR(255),
  audit_status VARCHAR(32) NOT NULL,
  reject_reason VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE stores (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  store_name VARCHAR(128) NOT NULL,
  store_code VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  business_hours VARCHAR(128),
  phone VARCHAR(32),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT,
  store_id BIGINT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(64),
  phone VARCHAR(32),
  role_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  last_login_at DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT,
  role_name VARCHAR(64) NOT NULL,
  role_code VARCHAR(64) NOT NULL,
  data_scope VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  permission_name VARCHAR(64) NOT NULL,
  permission_code VARCHAR(128) NOT NULL UNIQUE,
  permission_type VARCHAR(32) NOT NULL,
  parent_id BIGINT,
  created_at DATETIME NOT NULL
);

CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  store_id BIGINT,
  product_name VARCHAR(128) NOT NULL,
  category_id BIGINT,
  product_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  min_price DECIMAL(10, 2) NOT NULL,
  max_price DECIMAL(10, 2) NOT NULL,
  total_stock INT NOT NULL DEFAULT 0,
  sales_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE skus (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  sku_code VARCHAR(64) NOT NULL,
  sku_name VARCHAR(128) NOT NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  store_id BIGINT,
  user_id BIGINT NOT NULL,
  order_no VARCHAR(64) NOT NULL UNIQUE,
  order_status VARCHAR(32) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  pay_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(32) NOT NULL,
  delivery_status VARCHAR(32) NOT NULL,
  after_sale_status VARCHAR(32),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  sku_id BIGINT NOT NULL,
  product_name VARCHAR(128) NOT NULL,
  sku_name VARCHAR(128) NOT NULL,
  quantity INT NOT NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  created_at DATETIME NOT NULL
);

CREATE TABLE inventory_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  sku_id BIGINT NOT NULL,
  change_type VARCHAR(32) NOT NULL,
  quantity INT NOT NULL,
  biz_ref_type VARCHAR(32),
  biz_ref_id BIGINT,
  remark VARCHAR(255),
  created_at DATETIME NOT NULL
);
