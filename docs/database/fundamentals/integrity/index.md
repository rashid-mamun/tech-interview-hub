---
sidebar_position: 7
title: 'Integrity'
---

# Data Integrity

Data integrity হলো database এ stored data এর accuracy, consistency এবং reliability maintain করার process, যা business rule এবং constraint enforcement এর মাধ্যমে achieve করা হয়।

## ৭. What is data integrity?

**Data Integrity** হলো database এ data এর correctness, consistency এবং validity ensure করার mechanism যা data quality এবং reliability maintain করে।

#### Data Integrity এর মূল উপাদান:
- **Accuracy**: Data সঠিক এবং error-free
- **Consistency**: Data system জুড়ে uniform এবং coherent  
- **Validity**: Data business rule এবং constraint অনুসরণ করে
- **Completeness**: Required data missing নেই
- **Reliability**: Data trusted এবং dependable

#### উদাহরণ:
```sql
-- Data integrity constraint example
CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,                    -- Entity integrity
    email VARCHAR(100) UNIQUE NOT NULL,            -- Entity integrity
    age INT CHECK (age >= 18 AND age <= 65),       -- Domain integrity
    department_id INT,                             
    salary DECIMAL(10,2) CHECK (salary > 0),       -- Domain integrity
    hire_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) -- Referential integrity
);

-- Business rule enforcement
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

#### Data Integrity এর গুরুত্ব:
- **Business Decision**: Reliable data দিয়ে সঠিক decision নেওয়া
- **Legal Compliance**: Regulatory requirement meet করা  
- **Customer Trust**: Accurate information provide করা
- **System Reliability**: Consistent application behavior
- **Cost Reduction**: Data error correction এর cost কমানো

### Types of integrity (entity, referential, domain)?

Database system এ তিন ধরনের integrity constraint আছে যা collectively data quality ensure করে:

#### ১. **Entity Integrity**:

Entity integrity ensure করে যে প্রতিটি table এর প্রতিটি row uniquely identifiable।

```sql
-- Entity integrity rules:
-- 1. Primary key cannot be NULL
-- 2. Primary key must be unique
-- 3. Each row must be uniquely identifiable

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,    -- Cannot be NULL, must be unique
    name VARCHAR(100) NOT NULL,                    -- Required field
    email VARCHAR(100) UNIQUE NOT NULL,            -- Unique constraint
    phone VARCHAR(15) UNIQUE,                      -- Optional but if provided, must be unique
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- These operations violate entity integrity:
-- INSERT INTO customers (customer_id, name) VALUES (NULL, 'John'); -- ERROR: Primary key cannot be NULL
-- INSERT INTO customers (customer_id, name) VALUES (1, 'John'); 
-- INSERT INTO customers (customer_id, name) VALUES (1, 'Jane'); -- ERROR: Duplicate primary key
```

#### ২. **Referential Integrity**:

Referential integrity maintain করে table গুলোর মধ্যে relationship এর consistency।

```sql
-- Parent table
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    manager_id INT
);

-- Child table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id)
        ON DELETE CASCADE         -- Child records delete হবে parent delete হলে
        ON UPDATE CASCADE         -- Child records update হবে parent update হলে
);

-- Referential integrity rules:
-- 1. Foreign key value must exist in referenced table
-- 2. Cannot delete parent record if child records exist (unless CASCADE)
-- 3. Cannot insert child record with non-existent parent reference

-- Valid operations:
INSERT INTO departments (dept_id, dept_name) VALUES (1, 'IT');
INSERT INTO employees (emp_id, name, department_id) VALUES (101, 'John', 1); -- OK

-- Invalid operations:
-- INSERT INTO employees (emp_id, name, department_id) VALUES (102, 'Jane', 999); -- ERROR: Department 999 doesn't exist
-- DELETE FROM departments WHERE dept_id = 1; -- OK if CASCADE, ERROR if RESTRICT
```

#### ৩. **Domain Integrity**:

Domain integrity ensure করে যে column value গুলো defined range বা format এর মধ্যে আছে।

```sql
-- Domain integrity constraints
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),              -- Price must be positive
    category ENUM('electronics', 'clothing', 'books'),   -- Limited valid values
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5), -- Rating between 0-5
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0), -- Non-negative stock
    manufacture_date DATE CHECK (manufacture_date <= CURRENT_DATE), -- Cannot be future date
    expiry_date DATE CHECK (expiry_date > manufacture_date),  -- Expiry after manufacture
    sku VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Domain-specific validation examples
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL CHECK (LENGTH(username) >= 3), -- Minimum length
    email VARCHAR(100) NOT NULL CHECK (email LIKE '%@%.%'),      -- Basic email format
    age INT CHECK (age >= 13 AND age <= 120),                   -- Reasonable age range
    gender ENUM('M', 'F', 'Other'),                             -- Predefined values
    registration_date DATE DEFAULT CURRENT_DATE
);
```

#### **Integrity Types Comparison**:

| Integrity Type | Purpose | Implementation | Example |
|----------------|---------|----------------|---------|
| **Entity** | Unique row identification | PRIMARY KEY, UNIQUE, NOT NULL | customer_id cannot be NULL |
| **Referential** | Relationship consistency | FOREIGN KEY constraints | Order must have valid customer |
| **Domain** | Value validation | CHECK constraints, Data types | Age must be between 0-120 |

### How does DBMS enforce referential integrity?

DBMS multiple mechanism use করে referential integrity enforce করে:

#### ১. **Foreign Key Constraints**:

```sql
-- Basic foreign key constraint
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    CONSTRAINT fk_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Multi-column foreign key
CREATE TABLE order_items (
    item_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    CONSTRAINT fk_order_product 
        FOREIGN KEY (order_id, product_id) REFERENCES order_products(order_id, product_id)
);
```

#### ২. **Referential Actions**:

```sql
-- Different referential actions
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    manager_id INT,
    department_id INT,
    
    -- CASCADE: Delete/update child records when parent changes
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- SET NULL: Set foreign key to NULL when parent is deleted
    FOREIGN KEY (department_id) REFERENCES departments(dept_id)
        ON DELETE SET NULL
        ON UPDATE SET NULL
);

-- RESTRICT: Prevent parent deletion if children exist
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(100)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT  -- Cannot delete category if products exist
        ON UPDATE RESTRICT
);
```

#### ৩. **Enforcement Process**:

```sql
-- DBMS checks referential integrity at different times:

-- 1. INSERT operation check
INSERT INTO orders (order_id, customer_id, order_date) 
VALUES (1001, 500, '2024-01-15');
-- DBMS checks: Does customer_id 500 exist in customers table?

-- 2. UPDATE operation check  
UPDATE orders SET customer_id = 501 WHERE order_id = 1001;
-- DBMS checks: Does customer_id 501 exist in customers table?

-- 3. DELETE operation check
DELETE FROM customers WHERE customer_id = 500;
-- DBMS checks: Are there any orders with customer_id = 500?
-- Action depends on referential action (CASCADE, RESTRICT, SET NULL)

-- 4. Parent table UPDATE check
UPDATE customers SET customer_id = 502 WHERE customer_id = 500;
-- DBMS checks: Are there child records? What action to take?
```

#### ৪. **Deferred Constraint Checking**:

```sql
-- Some DBMS support deferred constraint checking
-- Useful for complex transactions

SET CONSTRAINTS fk_customer DEFERRED;

-- These operations might temporarily violate constraints
INSERT INTO orders (order_id, customer_id) VALUES (1001, 999);
INSERT INTO customers (customer_id, name) VALUES (999, 'New Customer');

-- Constraint checked at transaction commit
COMMIT; -- All constraints must be satisfied here
```

### What happens when foreign key constraint is violated?

Foreign key constraint violation হলে DBMS specific error message দিয়ে operation reject করে:

#### ১. **INSERT Violation**:

```sql
-- Attempt to insert order with non-existent customer
INSERT INTO orders (order_id, customer_id, order_date) 
VALUES (1001, 999, '2024-01-15');

-- Error message (MySQL):
-- ERROR 1452 (23000): Cannot add or update a child row: 
-- a foreign key constraint fails (`database`.`orders`, 
-- CONSTRAINT `fk_customer` FOREIGN KEY (`customer_id`) 
-- REFERENCES `customers` (`customer_id`))

-- PostgreSQL error:
-- ERROR: insert or update on table "orders" violates foreign key constraint "fk_customer"
-- DETAIL: Key (customer_id)=(999) is not present in table "customers".
```

#### ২. **UPDATE Violation**:

```sql
-- Attempt to update to non-existent reference
UPDATE orders SET customer_id = 888 WHERE order_id = 1001;

-- Error: Foreign key constraint violation
-- The operation is rolled back, no changes made
```

#### ৩. **DELETE Violation (RESTRICT mode)**:

```sql
-- Setup with RESTRICT constraint
ALTER TABLE orders ADD CONSTRAINT fk_customer_restrict
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE RESTRICT;

-- Attempt to delete customer with existing orders
DELETE FROM customers WHERE customer_id = 100;

-- Error message:
-- ERROR 1451 (23000): Cannot delete or update a parent row: 
-- a foreign key constraint fails (`database`.`orders`, 
-- CONSTRAINT `fk_customer_restrict` FOREIGN KEY (`customer_id`) 
-- REFERENCES `customers` (`customer_id`))
```

#### ৪. **Handling Different Referential Actions**:

```sql
-- Example setup with different actions
CREATE TABLE departments (dept_id INT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    manager_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id) ON DELETE CASCADE
);

-- Test data
INSERT INTO departments VALUES (1, 'IT'), (2, 'HR');
INSERT INTO employees VALUES (101, 'Manager', 1, NULL);
INSERT INTO employees VALUES (102, 'Employee', 1, 101);

-- CASCADE example: Delete manager
DELETE FROM employees WHERE emp_id = 101;
-- Result: Employee 102 is also deleted (CASCADE)

-- SET NULL example: Delete department  
DELETE FROM departments WHERE dept_id = 1;
-- Result: All employees in dept 1 have dept_id set to NULL
```

#### ৫. **Application Error Handling**:

```javascript
// JavaScript/Node.js example
async function createOrder(customerId, orderData) {
    try {
        const order = await db.query(
            'INSERT INTO orders (customer_id, order_date, total) VALUES (?, ?, ?)',
            [customerId, orderData.date, orderData.total]
        );
        return { success: true, orderId: order.insertId };
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return { 
                success: false, 
                error: 'Invalid customer ID. Customer does not exist.' 
            };
        }
        throw error; // Re-throw unexpected errors
    }
}
```

```python
# Python example with proper error handling
import mysql.connector
from mysql.connector import Error

def create_order(customer_id, order_data):
    try:
        cursor.execute(
            "INSERT INTO orders (customer_id, order_date, total) VALUES (%s, %s, %s)",
            (customer_id, order_data['date'], order_data['total'])
        )
        connection.commit()
        return {'success': True, 'order_id': cursor.lastrowid}
    
    except mysql.connector.IntegrityError as e:
        if e.errno == 1452:  # Foreign key constraint violation
            return {
                'success': False,
                'error': 'Customer not found. Please verify customer ID.'
            }
        raise e
```

#### ৬. **Best Practices for Handling Constraint Violations**:

#### **Prevention Strategy**:
```sql
-- Validate before insertion
CREATE PROCEDURE CreateOrderSafely(
    IN p_customer_id INT,
    IN p_order_date DATE,
    IN p_total DECIMAL(10,2)
)
BEGIN
    DECLARE customer_exists INT DEFAULT 0;
    
    -- Check if customer exists
    SELECT COUNT(*) INTO customer_exists 
    FROM customers 
    WHERE customer_id = p_customer_id;
    
    IF customer_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found';
    ELSE
        INSERT INTO orders (customer_id, order_date, total)
        VALUES (p_customer_id, p_order_date, p_total);
    END IF;
END;
```

#### **User-Friendly Error Messages**:
```sql
-- Create custom error handling
DELIMITER //
CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE customer_name VARCHAR(100);
    
    SELECT name INTO customer_name 
    FROM customers 
    WHERE customer_id = NEW.customer_id;
    
    IF customer_name IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = CONCAT('Customer with ID ', NEW.customer_id, ' does not exist. Please verify the customer ID.');
    END IF;
END //
DELIMITER ;
```

#### **Summary of Constraint Violation Handling**:
1. **Prevention** - Validate data before database operations
2. **Graceful Error Handling** - Catch and handle constraint violations properly  
3. **User-Friendly Messages** - Convert technical errors to meaningful messages
4. **Logging** - Log constraint violations for debugging
5. **Recovery** - Provide options for users to correct invalid data
6. **Testing** - Test constraint violations in development environment