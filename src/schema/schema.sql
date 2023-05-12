CREATE TABLE DiscountCodes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  expiration_date DATE NOT NULL,
  minimum_order_value NUMERIC(10,2),
  UNIQUE (code)
);

CREATE TABLE Categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
);

CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance NUMERIC(10,2) DEFAULT 100.0
);

CREATE TABLE Orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE OrderItems (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE ApplicableCategories (
  discount_code_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (discount_code_id, category_id),
  FOREIGN KEY (discount_code_id) REFERENCES DiscountCodes(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
);

CREATE TABLE OrderDiscounts (
  order_id INT NOT NULL,
  discount_code_id INT NOT NULL,
  PRIMARY KEY (order_id, discount_code_id),
  FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
  FOREIGN KEY (discount_code_id) REFERENCES DiscountCodes(id) ON DELETE CASCADE
);
