---
sidebar_position: 6
title: "Views, Stored Procedures & Triggers - Overview"
description: "Database views, stored procedures, triggers, cursors এবং UDFs এর comprehensive overview"
---

# Views, Stored Procedures & Triggers - Overview

এই section এ আমরা database এর advanced features গুলো নিয়ে আলোচনা করব যেগুলো modern database applications এর জন্য অত্যন্ত গুরুত্বপূর্ণ।

## 📋 **Topic Coverage:**

### **Views & Materialized Views** 
- Database Views এবং তাদের types
- Materialized Views এবং refresh strategies  
- Performance optimization techniques
- Real-world use cases এবং examples

### **Stored Procedures & Functions**
- Stored Procedures এবং complex business logic
- User-Defined Functions (UDFs) 
- Parameter handling এবং return values
- Practical applications in business scenarios

### **Triggers & Cursors**
- BEFORE, AFTER, এবং INSTEAD OF triggers
- Cascading triggers এবং performance considerations
- Cursors for row-by-row processing
- When to use এবং when to avoid

---

## 🎯 **Learning Objectives:**

এই documentation complete করার পর আপনি পারবেন:

- **Views** design এবং optimize করতে complex reporting এর জন্য
- **Materialized Views** implement করতে performance improvement এর জন্য  
- **Stored Procedures** লিখতে complex business workflows এর জন্য
- **Triggers** ব্যবহার করতে data integrity এবং auditing এর জন্য
- **Cursors** apply করতে sequential data processing এর জন্য
- **UDFs** create করতে reusable business logic এর জন্য

---

## 🚀 **Real-world Applications:**

### **E-commerce Systems:**
- Product catalog views with dynamic pricing
- Order processing stored procedures
- Inventory management triggers
- Customer analytics materialized views

### **Financial Applications:**
- Account balance calculation functions
- Transaction processing procedures  
- Audit trail triggers
- Regulatory reporting views

### **HR Management:**
- Employee hierarchy views
- Payroll processing procedures
- Performance review triggers
- Salary analysis functions

---

## 📚 **Section Structure:**

### **1. [Views & Materialized Views](./views-materialized-views)**
**Questions 62-63:** Basic থেকে advanced views, materialized views এর সব aspects

### **2. [Stored Procedures & Functions](./stored-procedures-functions)**  
**Questions 64-65, 69-70:** Procedures, functions, UDFs এবং তাদের differences

### **3. [Triggers & Cursors](./triggers-cursors)**
**Questions 66-68:** সব ধরনের triggers এবং cursor programming

---

## ⚡ **Key Features:**

- **Comprehensive Examples:** Real-world scenarios সহ detailed code examples
- **Performance Focus:** Optimization techniques এবং best practices
- **Bengali-English Mixed:** Technical terms ইংরেজিতে, explanations বাংলায়
- **Interview Ready:** Common interview questions এর thorough coverage
- **Production Ready:** Industry-standard coding patterns এবং error handling

---

## 🎯 **Before You Begin:**

এই advanced topics well understand করার জন্য নিশ্চিত করুন যে আপনি comfortable আছেন:

- Basic SQL operations (SELECT, INSERT, UPDATE, DELETE)
- JOINs এবং subqueries
- Database normalization concepts
- Transaction management basics

---

প্রতিটি section এ আপনি পাবেন extensive examples, practical use cases, এবং real-world scenarios যা আপনাকে এই powerful database features effectively ব্যবহার করতে সাহায্য করবে।

**Happy Learning! 🚀**

### Simple View Example:

```sql
-- Create a view for active employees
CREATE VIEW active_employees AS
SELECT 
    employee_id,
    name,
    department,
    salary,
    hire_date
FROM employees
WHERE status = 'ACTIVE';

-- Use the view like a table
SELECT * FROM active_employees WHERE department = 'IT';
```

### Advantages of using views?

**1. Data Security এবং Access Control:**
```sql
-- Sensitive salary information hidden
CREATE VIEW employee_public_info AS
SELECT 
    employee_id,
    name,
    department,
    email,
    phone
FROM employees;
-- salary, SSN ইত্যাদি sensitive fields hide করা হয়েছে

-- Grant access to view only, not base table
GRANT SELECT ON employee_public_info TO hr_staff;
-- hr_staff salary information দেখতে পাবে না
```

**2. Query Simplification:**
```sql
-- Complex join query simplified through view
CREATE VIEW order_summary AS
SELECT 
    o.order_id,
    c.customer_name,
    o.order_date,
    SUM(oi.quantity * oi.price) as total_amount,
    COUNT(oi.item_id) as total_items
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, c.customer_name, o.order_date;

-- Now simple query instead of complex joins
SELECT * FROM order_summary WHERE total_amount > 1000;
```

**3. Data Abstraction:**
```sql
-- Abstract complex business logic
CREATE VIEW monthly_sales_report AS
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') as month,
    department,
    COUNT(*) as total_orders,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value,
    CASE 
        WHEN SUM(total_amount) > 100000 THEN 'Excellent'
        WHEN SUM(total_amount) > 50000 THEN 'Good'
        ELSE 'Needs Improvement'
    END as performance_category
FROM order_summary
GROUP BY DATE_FORMAT(order_date, '%Y-%m'), department;

-- Business users can easily query without knowing complex logic
SELECT * FROM monthly_sales_report WHERE month = '2023-12';
```

**4. Logical Data Independence:**
```sql
-- Application uses view, underlying table structure can change
CREATE VIEW customer_profile AS
SELECT 
    customer_id,
    CONCAT(first_name, ' ', last_name) as full_name,  -- Concatenated name
    email,
    phone,
    address_line1,
    city,
    country
FROM customers;

-- If table structure changes (e.g., name stored differently),
-- only view definition needs update, applications remain unchanged
```

### Can views be updated?

**হ্যাঁ, কিছু conditions এর under এ views update করা যায়।** কিন্তু সব views updatable নয়।

#### **Updatable Views:**

**Simple view example:**
```sql
-- Simple view থেকে একটি table
CREATE VIEW it_employees AS
SELECT employee_id, name, email, salary
FROM employees
WHERE department = 'IT';

-- This view is updatable
UPDATE it_employees SET salary = 60000 WHERE employee_id = 123;
-- এটি actually employees table এ update করবে

INSERT INTO it_employees (name, email, salary) 
VALUES ('নতুন ডেভেলপার', 'dev@company.com', 55000);
-- এটি employees table এ insert করবে department = 'IT' সহ
```

#### **Non-updatable Views:**

**Views with aggregation:**
```sql
-- This view is NOT updatable
CREATE VIEW department_stats AS
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department;

-- This will fail
UPDATE department_stats SET avg_salary = 70000 WHERE department = 'IT';
-- Error: Cannot update view with aggregation
```

**Views with joins:**
```sql
-- Complex join view - typically not updatable
CREATE VIEW employee_department_info AS
SELECT 
    e.employee_id,
    e.name,
    d.department_name,
    d.location
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- Update may be ambiguous - which table to update?
-- UPDATE employee_department_info SET location = 'Dhaka' WHERE employee_id = 123;
```

### What is an updatable view?

**Updatable view** হল এমন view যা INSERT, UPDATE, DELETE operations support করে। একটি view updatable হতে হলে নিম্নলিখিত conditions পূরণ করতে হবে:

#### **Conditions for Updatable Views:**

**1. Single Table Source:**
```sql
-- ✅ Updatable - single table source
CREATE VIEW sales_team AS
SELECT employee_id, name, email, commission_rate
FROM employees
WHERE department = 'Sales';
```

**2. No Aggregate Functions:**
```sql
-- ❌ Not updatable - has aggregation
CREATE VIEW dept_summary AS
SELECT department, COUNT(*) as count, AVG(salary) as avg_sal
FROM employees
GROUP BY department;

-- ✅ Updatable - no aggregation
CREATE VIEW high_earners AS
SELECT employee_id, name, salary
FROM employees
WHERE salary > 75000;
```

**3. No DISTINCT, GROUP BY, HAVING:**
```sql
-- ❌ Not updatable - has DISTINCT
CREATE VIEW unique_departments AS
SELECT DISTINCT department FROM employees;

-- ✅ Updatable - simple filter
CREATE VIEW recent_hires AS
SELECT employee_id, name, hire_date
FROM employees
WHERE hire_date >= '2023-01-01';
```

**4. No Window Functions:**
```sql
-- ❌ Not updatable - has window function
CREATE VIEW employee_ranks AS
SELECT 
    employee_id,
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;
```

#### **Real-world Updatable View Examples:**

**Employee Management:**
```sql
-- Updatable view for HR operations
CREATE VIEW hr_employee_view AS
SELECT 
    employee_id,
    name,
    email,
    phone,
    department,
    hire_date,
    status
FROM employees
WHERE department IN ('HR', 'Admin');

-- HR can update employee information
UPDATE hr_employee_view 
SET phone = '01712345678' 
WHERE employee_id = 101;

-- HR can add new employees
INSERT INTO hr_employee_view (name, email, department, hire_date, status)
VALUES ('নতুন এইচআর', 'hr@company.com', 'HR', CURDATE(), 'ACTIVE');
```

**Product Management:**
```sql
-- Updatable view for product catalog
CREATE VIEW active_products AS
SELECT 
    product_id,
    product_name,
    price,
    stock_quantity,
    category
FROM products
WHERE status = 'ACTIVE' AND stock_quantity > 0;

-- Product manager can update prices
UPDATE active_products SET price = 1500 WHERE product_id = 'P001';

-- Can add new products (status will be automatically set based on view condition)
INSERT INTO active_products (product_name, price, stock_quantity, category)
VALUES ('নতুন পণ্য', 2000, 50, 'Electronics');
```

#### **View Update Rules:**

**MySQL Example:**
```sql
-- Create updatable view with CHECK OPTION
CREATE VIEW sales_employees AS
SELECT employee_id, name, department, salary
FROM employees
WHERE department = 'Sales'
WITH CHECK OPTION;

-- This will work
UPDATE sales_employees SET salary = 60000 WHERE employee_id = 123;

-- This will fail because it violates the WHERE condition
UPDATE sales_employees SET department = 'IT' WHERE employee_id = 123;
-- Error: CHECK OPTION failed
```

**PostgreSQL INSTEAD OF Triggers:**
```sql
-- Make complex view updatable using triggers
CREATE VIEW employee_summary AS
SELECT 
    e.employee_id,
    e.name,
    d.department_name,
    e.salary
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- Create INSTEAD OF trigger to handle updates
CREATE OR REPLACE FUNCTION update_employee_summary()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE employees 
    SET name = NEW.name, salary = NEW.salary 
    WHERE employee_id = NEW.employee_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_summary_update
    INSTEAD OF UPDATE ON employee_summary
    FOR EACH ROW EXECUTE FUNCTION update_employee_summary();
```

### View Performance Considerations:

**Indexed Base Tables:**
```sql
-- Ensure base tables have appropriate indexes
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);

-- View will benefit from these indexes
CREATE VIEW active_it_employees AS
SELECT employee_id, name, email, salary
FROM employees
WHERE department = 'IT' AND status = 'ACTIVE';
```

**Materialized Views for Performance:**
```sql
-- For expensive views, consider materialized views
CREATE MATERIALIZED VIEW monthly_sales_summary AS
SELECT 
    DATE_TRUNC('month', order_date) as month,
    SUM(total_amount) as total_revenue,
    COUNT(*) as total_orders,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE order_date >= '2023-01-01'
GROUP BY DATE_TRUNC('month', order_date);

-- Refresh periodically
REFRESH MATERIALIZED VIEW monthly_sales_summary;
```

---

## **63. What is a materialized view?**

**Materialized view** হল একটি database object যা view এর query results কে physically store করে disk এ। Regular view এর মত এটি virtual নয়, বরং actual data store করে এবং periodically refresh করা হয়।

**Technical definition:** Materialized view হল একটি cached result set যা একটি query এর output store করে এবং base tables এর data change হলে refresh করতে হয়।

### Basic Materialized View Syntax:

```sql
-- PostgreSQL
CREATE MATERIALIZED VIEW mv_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;

-- Oracle
CREATE MATERIALIZED VIEW mv_name
REFRESH FAST ON COMMIT
AS
SELECT column1, column2, ...
FROM table_name;
```

### How is it different from normal view?

| Aspect | Regular View | Materialized View |
|--------|-------------|------------------|
| **Data Storage** | Virtual (no data stored) | Physical (data stored on disk) |
| **Query Performance** | Executes underlying query each time | Fast (data pre-computed) |
| **Data Freshness** | Always current | May be stale until refreshed |
| **Storage Space** | No additional space | Requires storage space |
| **Maintenance** | No maintenance needed | Requires periodic refresh |

#### **Regular View Example:**
```sql
-- Regular view - no data stored
CREATE VIEW department_stats AS
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary
FROM employees
GROUP BY department;

-- Every time this query runs, it calculates fresh results
SELECT * FROM department_stats;  -- Scans employees table each time
```

#### **Materialized View Example:**
```sql
-- Materialized view - results pre-computed and stored
CREATE MATERIALIZED VIEW mv_department_stats AS
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    CURRENT_TIMESTAMP as last_updated
FROM employees
GROUP BY department;

-- Query returns pre-computed results instantly
SELECT * FROM mv_department_stats;  -- Very fast, no table scan needed
```

### When would you use materialized views?

#### **1. Complex Aggregations:**

**Data warehouse reporting:**
```sql
-- Expensive aggregation query
CREATE MATERIALIZED VIEW mv_monthly_sales_report AS
SELECT 
    DATE_TRUNC('month', order_date) as month,
    product_category,
    region,
    COUNT(*) as total_orders,
    SUM(order_amount) as total_revenue,
    AVG(order_amount) as avg_order_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders o
JOIN products p ON o.product_id = p.product_id
JOIN customers c ON o.customer_id = c.customer_id
WHERE order_date >= '2020-01-01'
GROUP BY DATE_TRUNC('month', order_date), product_category, region;

-- Business intelligence queries run instantly
SELECT * FROM mv_monthly_sales_report 
WHERE month >= '2023-01-01' AND product_category = 'Electronics';
```

#### **2. Cross-Database Joins:**

**Joining remote/federated data:**
```sql
-- Expensive cross-database join
CREATE MATERIALIZED VIEW mv_customer_order_summary AS
SELECT 
    c.customer_id,
    c.customer_name,
    c.country,
    COUNT(o.order_id) as total_orders,
    SUM(o.order_amount) as lifetime_value,
    MAX(o.order_date) as last_order_date
FROM remote_customers c  -- Data from different database/server
LEFT JOIN local_orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name, c.country;

-- Customer service dashboard loads quickly
SELECT * FROM mv_customer_order_summary 
WHERE country = 'Bangladesh' AND total_orders > 5;
```

#### **3. Real-time Analytics:**

**Website analytics dashboard:**
```sql
-- Real-time user behavior analysis
CREATE MATERIALIZED VIEW mv_hourly_website_stats AS
SELECT 
    DATE_TRUNC('hour', visit_timestamp) as hour,
    page_url,
    COUNT(*) as page_views,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(time_on_page) as avg_time_on_page
FROM website_visits
WHERE visit_timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', visit_timestamp), page_url;

-- Analytics dashboard loads instantly
SELECT * FROM mv_hourly_website_stats 
WHERE hour >= CURRENT_DATE AND page_views > 100
ORDER BY page_views DESC;
```

#### **4. ETL/Data Pipeline Results:**

**Data transformation caching:**
```sql
-- Complex data transformation for ML features
CREATE MATERIALIZED VIEW mv_customer_features AS
SELECT 
    customer_id,
    -- Behavioral features
    COUNT(DISTINCT order_date) as shopping_days,
    AVG(order_amount) as avg_order_value,
    MAX(order_date) - MIN(order_date) as customer_lifetime_days,
    
    -- Seasonal features
    SUM(CASE WHEN EXTRACT(quarter FROM order_date) = 1 THEN order_amount ELSE 0 END) as q1_spending,
    SUM(CASE WHEN EXTRACT(quarter FROM order_date) = 2 THEN order_amount ELSE 0 END) as q2_spending,
    
    -- Product preference features
    MODE() WITHIN GROUP (ORDER BY product_category) as preferred_category,
    COUNT(DISTINCT product_category) as category_diversity
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY customer_id
HAVING COUNT(*) >= 3;  -- Only customers with 3+ orders

-- ML pipeline uses pre-computed features
SELECT * FROM mv_customer_features WHERE customer_id IN (SELECT customer_id FROM target_customers);
```

### How do you refresh materialized views?

#### **1. Manual Refresh:**

**PostgreSQL:**
```sql
-- Complete refresh (recreate all data)
REFRESH MATERIALIZED VIEW mv_department_stats;

-- Concurrent refresh (allows queries during refresh)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_department_stats;

-- Refresh with data
REFRESH MATERIALIZED VIEW mv_department_stats WITH DATA;

-- Refresh without data (empties the view)
REFRESH MATERIALIZED VIEW mv_department_stats WITH NO DATA;
```

**Oracle:**
```sql
-- Complete refresh
BEGIN
    DBMS_MVIEW.REFRESH('mv_department_stats', 'C');
END;

-- Fast refresh (incremental)
BEGIN
    DBMS_MVIEW.REFRESH('mv_department_stats', 'F');
END;

-- Force refresh
BEGIN
    DBMS_MVIEW.REFRESH('mv_department_stats', '?');
END;
```

#### **2. Automatic Refresh:**

**Oracle - ON COMMIT:**
```sql
-- Refresh automatically when base tables commit
CREATE MATERIALIZED VIEW mv_current_inventory
REFRESH FAST ON COMMIT
AS
SELECT 
    product_id,
    warehouse_id,
    SUM(quantity) as current_stock
FROM inventory_transactions
WHERE transaction_type IN ('IN', 'OUT')
GROUP BY product_id, warehouse_id;

-- Every commit to inventory_transactions triggers refresh
INSERT INTO inventory_transactions VALUES ('P001', 'WH001', 'IN', 100);
COMMIT;  -- mv_current_inventory automatically updated
```

**Oracle - ON DEMAND with Schedule:**
```sql
-- Schedule refresh every hour
BEGIN
    DBMS_SCHEDULER.CREATE_JOB(
        job_name        => 'refresh_sales_mv',
        job_type        => 'PLSQL_BLOCK',
        job_action      => 'BEGIN DBMS_MVIEW.REFRESH(''mv_hourly_sales''); END;',
        start_date      => SYSTIMESTAMP,
        repeat_interval => 'FREQ=HOURLY;INTERVAL=1',
        enabled         => TRUE
    );
END;
```

#### **3. Incremental Refresh:**

**Fast refresh setup (Oracle):**
```sql
-- Create materialized view log for fast refresh
CREATE MATERIALIZED VIEW LOG ON orders;
CREATE MATERIALIZED VIEW LOG ON products;

-- Create materialized view with fast refresh capability
CREATE MATERIALIZED VIEW mv_product_sales
REFRESH FAST ON DEMAND
AS
SELECT 
    p.product_id,
    p.product_name,
    SUM(o.quantity) as total_sold,
    SUM(o.order_amount) as total_revenue,
    COUNT(*) as order_count
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY p.product_id, p.product_name;

-- Fast refresh only processes changes since last refresh
BEGIN
    DBMS_MVIEW.REFRESH('mv_product_sales', 'F');  -- Much faster than complete refresh
END;
```

#### **4. Application-level Refresh Management:**

**Python example with scheduling:**
```python
import psycopg2
from apscheduler.schedulers.background import BackgroundScheduler

def refresh_materialized_view(view_name):
    conn = psycopg2.connect("dbname=mydb user=myuser")
    cur = conn.cursor()
    
    try:
        cur.execute(f"REFRESH MATERIALIZED VIEW CONCURRENTLY {view_name}")
        conn.commit()
        print(f"Successfully refreshed {view_name}")
    except Exception as e:
        print(f"Error refreshing {view_name}: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

# Schedule different views at different intervals
scheduler = BackgroundScheduler()

# Critical business views - refresh every 15 minutes
scheduler.add_job(
    refresh_materialized_view,
    'interval',
    minutes=15,
    args=['mv_current_inventory']
)

# Reporting views - refresh hourly
scheduler.add_job(
    refresh_materialized_view,
    'interval',
    hours=1,
    args=['mv_hourly_sales_report']
)

# Analytics views - refresh daily at 2 AM
scheduler.add_job(
    refresh_materialized_view,
    'cron',
    hour=2,
    minute=0,
    args=['mv_daily_customer_analytics']
)

scheduler.start()
```

### Materialized View Best Practices:

#### **1. Choose Refresh Strategy Based on Requirements:**

```sql
-- High-frequency trading: Real-time refresh needed
CREATE MATERIALIZED VIEW mv_stock_prices
REFRESH FAST ON COMMIT  -- Updates immediately
AS SELECT symbol, last_price, volume FROM stock_trades;

-- Daily reports: Once-daily refresh sufficient
CREATE MATERIALIZED VIEW mv_daily_sales_summary
-- Refresh via scheduled job at midnight
AS SELECT DATE(order_date), SUM(amount) FROM orders GROUP BY DATE(order_date);

-- Ad-hoc analytics: Manual refresh when needed
CREATE MATERIALIZED VIEW mv_customer_segments
-- Refresh manually before running analysis
AS SELECT customer_type, COUNT(*), AVG(lifetime_value) FROM customers GROUP BY customer_type;
```

#### **2. Monitor Refresh Performance:**

```sql
-- Track refresh times and performance
CREATE TABLE mv_refresh_log (
    view_name VARCHAR(100),
    refresh_start TIMESTAMP,
    refresh_end TIMESTAMP,
    refresh_duration INTERVAL,
    rows_affected INTEGER,
    refresh_type VARCHAR(20)  -- 'FULL', 'FAST', 'CONCURRENT'
);

-- Log refresh activity
CREATE OR REPLACE FUNCTION log_mv_refresh()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO mv_refresh_log 
    VALUES (TG_TABLE_NAME, OLD.last_refresh, NEW.last_refresh, 
            NEW.last_refresh - OLD.last_refresh, NEW.row_count, 'FULL');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### **3. Balance Storage vs Performance:**

```sql
-- Consider partitioning large materialized views
CREATE MATERIALIZED VIEW mv_sales_by_month
PARTITION BY RANGE (month) AS
SELECT 
    DATE_TRUNC('month', order_date) as month,
    product_category,
    SUM(order_amount) as revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date), product_category;

-- Create partitions for specific months
CREATE MATERIALIZED VIEW mv_sales_2023_01 PARTITION OF mv_sales_by_month
FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');
```

Materialized views হল powerful tools for performance optimization, কিন্তু এগুলো carefully design এবং maintain করতে হয় data freshness এবং storage requirements এর balance maintain করার জন্য।

---

## **64. What is a stored procedure?**

**Stored procedure** হল একটি precompiled collection of SQL statements এবং optional control-flow statements যা database server এ stored থাকে। এটি একটি function এর মতো কাজ করে যা parameters নিতে পারে এবং specific tasks perform করে।

**Technical definition:** Stored procedure হল একটি named database program যা application থেকে call করা যায় এবং database server এ execute হয়।

### Basic Stored Procedure Syntax:

```sql
-- MySQL/SQL Server
CREATE PROCEDURE procedure_name(
    IN parameter1 datatype,
    OUT parameter2 datatype,
    INOUT parameter3 datatype
)
BEGIN
    -- SQL statements
    -- Business logic
END;

-- PostgreSQL
CREATE OR REPLACE FUNCTION procedure_name(
    parameter1 datatype,
    parameter2 datatype
) RETURNS datatype AS $$
BEGIN
    -- SQL statements
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### Simple Stored Procedure Examples:

#### **Employee Management Procedure:**
```sql
-- MySQL example
DELIMITER //
CREATE PROCEDURE GetEmployeesByDepartment(
    IN dept_name VARCHAR(50),
    OUT total_count INT
)
BEGIN
    SELECT 
        employee_id,
        name,
        salary,
        hire_date
    FROM employees 
    WHERE department = dept_name
    ORDER BY hire_date DESC;
    
    SELECT COUNT(*) INTO total_count
    FROM employees 
    WHERE department = dept_name;
END //
DELIMITER ;

-- Call the procedure
CALL GetEmployeesByDepartment('IT', @count);
SELECT @count as total_employees;
```

#### **Order Processing Procedure:**
```sql
-- Complex business logic in stored procedure
DELIMITER //
CREATE PROCEDURE ProcessOrder(
    IN customer_id INT,
    IN product_id VARCHAR(20),
    IN quantity INT,
    OUT order_id INT,
    OUT status_message VARCHAR(200)
)
BEGIN
    DECLARE available_stock INT DEFAULT 0;
    DECLARE product_price DECIMAL(10,2) DEFAULT 0;
    DECLARE order_total DECIMAL(10,2) DEFAULT 0;
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET status_message = 'Error occurred during order processing';
        SET order_id = -1;
    END;
    
    START TRANSACTION;
    
    -- Check stock availability
    SELECT stock_quantity, price 
    INTO available_stock, product_price
    FROM products 
    WHERE product_id = product_id AND status = 'ACTIVE';
    
    IF available_stock IS NULL THEN
        SET status_message = 'Product not found or inactive';
        SET order_id = -1;
        ROLLBACK;
    ELSEIF available_stock < quantity THEN
        SET status_message = CONCAT('Insufficient stock. Available: ', available_stock);
        SET order_id = -1;
        ROLLBACK;
    ELSE
        -- Calculate total
        SET order_total = quantity * product_price;
        
        -- Create order
        INSERT INTO orders (customer_id, order_date, total_amount, status)
        VALUES (customer_id, NOW(), order_total, 'PENDING');
        
        SET order_id = LAST_INSERT_ID();
        
        -- Add order items
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (order_id, product_id, quantity, product_price);
        
        -- Update inventory
        UPDATE products 
        SET stock_quantity = stock_quantity - quantity
        WHERE product_id = product_id;
        
        -- Log the transaction
        INSERT INTO order_log (order_id, action, timestamp)
        VALUES (order_id, 'ORDER_CREATED', NOW());
        
        COMMIT;
        SET status_message = 'Order processed successfully';
    END IF;
END //
DELIMITER ;

-- Use the procedure
CALL ProcessOrder(123, 'P001', 2, @new_order_id, @message);
SELECT @new_order_id, @message;
```

### Advantages over normal SQL queries?

#### **1. Performance Benefits:**

**Precompiled and Cached:**
```sql
-- Stored procedure - compiled once, cached execution plan
CREATE PROCEDURE GetCustomerOrders(IN customer_id INT)
BEGIN
    SELECT o.order_id, o.order_date, o.total_amount, o.status
    FROM orders o
    WHERE o.customer_id = customer_id
    ORDER BY o.order_date DESC;
END;

-- vs Normal SQL - parsed and compiled every time
-- Application code:
-- "SELECT o.order_id, o.order_date, o.total_amount, o.status 
--  FROM orders o WHERE o.customer_id = ? ORDER BY o.order_date DESC"
```

**Reduced Network Traffic:**
```sql
-- Single procedure call instead of multiple queries
CREATE PROCEDURE CompleteOrderProcess(IN order_id INT)
BEGIN
    -- Multiple operations in one call
    UPDATE orders SET status = 'PROCESSING' WHERE order_id = order_id;
    
    INSERT INTO order_audit (order_id, status_change, timestamp)
    VALUES (order_id, 'PROCESSING', NOW());
    
    UPDATE inventory SET reserved_quantity = reserved_quantity + 
        (SELECT SUM(quantity) FROM order_items WHERE order_id = order_id)
    WHERE product_id IN (SELECT product_id FROM order_items WHERE order_id = order_id);
    
    -- Send notification (could be external API call)
    INSERT INTO notifications (type, message, created_at)
    VALUES ('ORDER_UPDATE', CONCAT('Order ', order_id, ' is being processed'), NOW());
END;

-- Single call vs 4 separate network round trips
CALL CompleteOrderProcess(12345);
```

#### **2. Security Benefits:**

**SQL Injection Prevention:**
```sql
-- Stored procedure with parameters - safe from SQL injection
CREATE PROCEDURE AuthenticateUser(
    IN username VARCHAR(50),
    IN password_hash VARCHAR(255),
    OUT user_id INT,
    OUT is_valid BOOLEAN
)
BEGIN
    SELECT id INTO user_id
    FROM users 
    WHERE username = username AND password_hash = password_hash AND status = 'ACTIVE';
    
    IF user_id IS NOT NULL THEN
        SET is_valid = TRUE;
        UPDATE users SET last_login = NOW() WHERE id = user_id;
    ELSE
        SET is_valid = FALSE;
        SET user_id = NULL;
    END IF;
END;

-- Safe parameter binding
CALL AuthenticateUser('john_doe', SHA2('user_password', 256), @uid, @valid);
```

**Access Control:**
```sql
-- Grant access to procedure only, not underlying tables
GRANT EXECUTE ON PROCEDURE GetEmployeeSalary TO hr_role;
-- HR can get salary info but cannot directly access employees table

CREATE PROCEDURE GetEmployeeSalary(IN emp_id INT, OUT salary DECIMAL(10,2))
BEGIN
    -- Additional business rules and validations
    IF EXISTS(SELECT 1 FROM employee_access_log WHERE requesting_user = USER() AND request_date = CURDATE() AND request_count >= 10) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Daily salary query limit reached';
    END IF;
    
    SELECT salary_amount INTO salary FROM employees WHERE employee_id = emp_id;
    
    -- Audit trail
    INSERT INTO employee_access_log (employee_id, requesting_user, access_type, timestamp)
    VALUES (emp_id, USER(), 'SALARY_QUERY', NOW());
END;
```

#### **3. Business Logic Centralization:**

**Complex Business Rules:**
```sql
-- Centralized pricing logic
CREATE PROCEDURE CalculateOrderDiscount(
    IN customer_id INT,
    IN order_total DECIMAL(10,2),
    OUT discount_amount DECIMAL(10,2),
    OUT discount_type VARCHAR(50)
)
BEGIN
    DECLARE customer_tier VARCHAR(20);
    DECLARE order_count INT;
    DECLARE is_first_order BOOLEAN DEFAULT FALSE;
    
    -- Get customer information
    SELECT tier, total_orders INTO customer_tier, order_count
    FROM customer_summary 
    WHERE customer_id = customer_id;
    
    SET discount_amount = 0;
    SET discount_type = 'NONE';
    
    -- First-time customer discount
    IF order_count = 0 THEN
        SET discount_amount = order_total * 0.10;  -- 10% first-time discount
        SET discount_type = 'FIRST_TIME_CUSTOMER';
    -- VIP customer discount
    ELSEIF customer_tier = 'VIP' THEN
        SET discount_amount = order_total * 0.15;  -- 15% VIP discount
        SET discount_type = 'VIP_CUSTOMER';
    -- Bulk order discount
    ELSEIF order_total > 10000 THEN
        SET discount_amount = order_total * 0.05;  -- 5% bulk discount
        SET discount_type = 'BULK_ORDER';
    -- Regular customer small discount
    ELSEIF customer_tier IN ('GOLD', 'SILVER') THEN
        SET discount_amount = order_total * 0.03;  -- 3% loyalty discount
        SET discount_type = 'LOYALTY_DISCOUNT';
    END IF;
    
    -- Apply maximum discount limit
    IF discount_amount > 5000 THEN
        SET discount_amount = 5000;
        SET discount_type = CONCAT(discount_type, '_CAPPED');
    END IF;
END;

-- All applications use same business logic
CALL CalculateOrderDiscount(123, 15000, @discount, @type);
```

### Can stored procedures return values?

**হ্যাঁ, stored procedures বিভিন্ন উপায়ে values return করতে পারে:**

#### **1. Output Parameters:**

```sql
-- Multiple output values
CREATE PROCEDURE GetOrderStatistics(
    IN customer_id INT,
    OUT total_orders INT,
    OUT total_spent DECIMAL(10,2),
    OUT avg_order_value DECIMAL(10,2),
    OUT last_order_date DATE
)
BEGIN
    SELECT 
        COUNT(*),
        SUM(total_amount),
        AVG(total_amount),
        MAX(order_date)
    INTO total_orders, total_spent, avg_order_value, last_order_date
    FROM orders
    WHERE customer_id = customer_id;
END;

-- Call and retrieve multiple values
CALL GetOrderStatistics(123, @orders, @spent, @avg, @last_date);
SELECT @orders, @spent, @avg, @last_date;
```

#### **2. Result Sets:**

```sql
-- Return result sets directly
CREATE PROCEDURE GetCustomerOrderHistory(IN customer_id INT)
BEGIN
    -- First result set: Order summary
    SELECT 
        order_id,
        order_date,
        total_amount,
        status
    FROM orders
    WHERE customer_id = customer_id
    ORDER BY order_date DESC;
    
    -- Second result set: Top products
    SELECT 
        p.product_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.price) as total_spent
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.customer_id = customer_id
    GROUP BY p.product_id, p.product_name
    ORDER BY total_spent DESC
    LIMIT 5;
END;

-- Application receives two result sets
CALL GetCustomerOrderHistory(123);
```

#### **3. Return Status Codes:**

```sql
-- Return success/failure status
CREATE PROCEDURE TransferFunds(
    IN from_account VARCHAR(20),
    IN to_account VARCHAR(20),
    IN amount DECIMAL(10,2)
)
BEGIN
    DECLARE from_balance DECIMAL(10,2);
    DECLARE return_code INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 999 as return_code, 'Database error occurred' as message;
    END;
    
    START TRANSACTION;
    
    -- Check source account balance
    SELECT balance INTO from_balance
    FROM accounts
    WHERE account_number = from_account
    FOR UPDATE;
    
    IF from_balance IS NULL THEN
        SELECT 404 as return_code, 'Source account not found' as message;
    ELSEIF from_balance < amount THEN
        SELECT 400 as return_code, 'Insufficient funds' as message;
    ELSE
        -- Perform transfer
        UPDATE accounts SET balance = balance - amount
        WHERE account_number = from_account;
        
        UPDATE accounts SET balance = balance + amount
        WHERE account_number = to_account;
        
        -- Log transaction
        INSERT INTO transaction_log (from_account, to_account, amount, timestamp)
        VALUES (from_account, to_account, amount, NOW());
        
        COMMIT;
        SELECT 200 as return_code, 'Transfer completed successfully' as message;
    END IF;
END;

-- Check return status
CALL TransferFunds('ACC001', 'ACC002', 1000);
```

#### **4. Function-style Returns (PostgreSQL):**

```sql
-- PostgreSQL functions can return values directly
CREATE OR REPLACE FUNCTION calculate_tax(
    income DECIMAL(10,2),
    tax_year INT
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    tax_amount DECIMAL(10,2) := 0;
    tax_rate DECIMAL(5,4);
BEGIN
    -- Get tax rate for the year
    SELECT rate INTO tax_rate
    FROM tax_brackets
    WHERE min_income <= income AND max_income >= income AND year = tax_year;
    
    IF tax_rate IS NOT NULL THEN
        tax_amount := income * tax_rate;
    END IF;
    
    RETURN tax_amount;
END;
$$ LANGUAGE plpgsql;

-- Use like a function
SELECT calculate_tax(75000, 2023) as tax_owed;

-- Or in queries
SELECT 
    employee_id,
    name,
    salary,
    calculate_tax(salary, 2023) as annual_tax
FROM employees;
```

#### **5. Table-valued Returns:**

```sql
-- PostgreSQL function returning table
CREATE OR REPLACE FUNCTION get_top_customers(
    limit_count INT DEFAULT 10
) RETURNS TABLE(
    customer_id INT,
    customer_name VARCHAR(100),
    total_orders INT,
    total_spent DECIMAL(10,2),
    avg_order_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.customer_id,
        c.customer_name,
        COUNT(o.order_id)::INT as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.customer_name
    ORDER BY total_spent DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Use like a table
SELECT * FROM get_top_customers(5);

-- Join with other tables
SELECT tc.*, co.country
FROM get_top_customers(10) tc
JOIN customer_addresses ca ON tc.customer_id = ca.customer_id
JOIN countries co ON ca.country_id = co.country_id;
```

### Real-world Stored Procedure Examples:

#### **E-commerce Order Processing:**
```sql
CREATE PROCEDURE CompleteCheckout(
    IN session_id VARCHAR(50),
    IN payment_method VARCHAR(20),
    OUT order_id INT,
    OUT final_amount DECIMAL(10,2),
    OUT status_code INT,
    OUT status_message VARCHAR(200)
)
BEGIN
    DECLARE customer_id INT;
    DECLARE cart_total DECIMAL(10,2);
    DECLARE discount_amount DECIMAL(10,2);
    DECLARE tax_amount DECIMAL(10,2);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET status_code = 500;
        SET status_message = 'Internal error during checkout';
        SET order_id = NULL;
    END;
    
    START TRANSACTION;
    
    -- Validate session and get customer
    SELECT c.customer_id INTO customer_id
    FROM customer_sessions cs
    JOIN customers c ON cs.customer_id = c.customer_id
    WHERE cs.session_id = session_id AND cs.expires_at > NOW();
    
    IF customer_id IS NULL THEN
        SET status_code = 401;
        SET status_message = 'Invalid or expired session';
        ROLLBACK;
    ELSE
        -- Calculate cart total
        SELECT SUM(ci.quantity * p.price) INTO cart_total
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.customer_id = customer_id;
        
        -- Apply discounts
        CALL CalculateOrderDiscount(customer_id, cart_total, discount_amount, @discount_type);
        
        -- Calculate tax
        SET tax_amount = (cart_total - discount_amount) * 0.08;  -- 8% tax
        SET final_amount = cart_total - discount_amount + tax_amount;
        
        -- Create order
        INSERT INTO orders (customer_id, subtotal, discount, tax, total_amount, payment_method, status)
        VALUES (customer_id, cart_total, discount_amount, tax_amount, final_amount, payment_method, 'PENDING');
        
        SET order_id = LAST_INSERT_ID();
        
        -- Move cart items to order items
        INSERT INTO order_items (order_id, product_id, quantity, price)
        SELECT order_id, ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.customer_id = customer_id;
        
        -- Clear cart
        DELETE FROM cart_items WHERE customer_id = customer_id;
        
        -- Update inventory
        UPDATE products p
        JOIN order_items oi ON p.product_id = oi.product_id
        SET p.stock_quantity = p.stock_quantity - oi.quantity
        WHERE oi.order_id = order_id;
        
        COMMIT;
        SET status_code = 200;
        SET status_message = 'Order created successfully';
    END IF;
END;
```

---

## **65. What is difference between stored procedure and function?**

**Stored procedures** এবং **functions** দুটোই database এ stored code blocks, কিন্তু এদের মধ্যে গুরুত্বপূর্ণ differences আছে।

| Aspect | Stored Procedure | Function |
|--------|-----------------|----------|
| **Primary Purpose** | Perform actions/tasks | Calculate and return values |
| **Return Value** | Optional (via OUT parameters) | Mandatory return value |
| **Usage in SQL** | Called independently | Used in SELECT, WHERE, etc. |
| **Transaction Control** | Can use COMMIT/ROLLBACK | Cannot control transactions |
| **Side Effects** | Can modify database state | Should be side-effect free |
| **Performance** | Optimized for complex operations | Optimized for calculations |

### Detailed Comparison:

#### **1. Return Value Handling:**

**Stored Procedure:**
```sql
-- Procedure can return multiple values via OUT parameters
CREATE PROCEDURE GetCustomerStats(
    IN customer_id INT,
    OUT total_orders INT,
    OUT total_spent DECIMAL(10,2),
    OUT loyalty_points INT
)
BEGIN
    SELECT COUNT(*), SUM(total_amount), SUM(loyalty_earned)
    INTO total_orders, total_spent, loyalty_points
    FROM orders
    WHERE customer_id = customer_id;
END;

-- Must be called separately
CALL GetCustomerStats(123, @orders, @spent, @points);
SELECT @orders, @spent, @points;
```

**Function:**
```sql
-- Function must return exactly one value
CREATE FUNCTION CalculateLoyaltyPoints(customer_id INT)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE points INT DEFAULT 0;
    
    SELECT COALESCE(SUM(order_amount * 0.01), 0) INTO points
    FROM orders
    WHERE customer_id = customer_id;
    
    RETURN points;
END;

-- Can be used directly in queries
SELECT 
    customer_id,
    customer_name,
    CalculateLoyaltyPoints(customer_id) as loyalty_points
FROM customers
WHERE CalculateLoyaltyPoints(customer_id) > 1000;
```

#### **2. Usage in SQL Queries:**

**Function in SELECT:**
```sql
-- Functions can be used anywhere expressions are allowed
SELECT 
    product_id,
    product_name,
    price,
    CalculateDiscount(price, category) as discounted_price,
    CASE 
        WHEN CalculateDiscount(price, category) > 100 THEN 'High Value'
        ELSE 'Regular'
    END as price_category
FROM products
WHERE CalculateDiscount(price, category) BETWEEN 50 AND 200
ORDER BY CalculateDiscount(price, category) DESC;
```

**Procedure Cannot be Used in SELECT:**
```sql
-- This is NOT possible with procedures
-- SELECT customer_id, GetCustomerStats(customer_id) FROM customers;  -- ❌ Error

-- Procedures must be called separately
CALL GetCustomerStats(123, @orders, @spent, @points);
```

#### **3. Transaction Control:**

**Stored Procedure with Transactions:**
```sql
CREATE PROCEDURE ProcessRefund(
    IN order_id INT,
    IN refund_amount DECIMAL(10,2),
    OUT status_code INT
)
BEGIN
    DECLARE customer_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET status_code = 500;
    END;
    
    START TRANSACTION;  -- Procedures can control transactions
    
    -- Get customer for this order
    SELECT customer_id INTO customer_id FROM orders WHERE order_id = order_id;
    
    -- Update order status
    UPDATE orders SET status = 'REFUNDED', refunded_amount = refund_amount
    WHERE order_id = order_id;
    
    -- Credit customer wallet
    UPDATE customer_wallets SET balance = balance + refund_amount
    WHERE customer_id = customer_id;
    
    -- Log the refund
    INSERT INTO refund_log (order_id, amount, processed_at)
    VALUES (order_id, refund_amount, NOW());
    
    COMMIT;  -- Complete transaction
    SET status_code = 200;
END;
```

**Function Cannot Control Transactions:**
```sql
CREATE FUNCTION CalculateRefundAmount(order_id INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE refund_amount DECIMAL(10,2);
    
    -- Functions cannot use START TRANSACTION, COMMIT, ROLLBACK
    -- START TRANSACTION;  -- ❌ This would cause error
    
    SELECT total_amount * 0.95 INTO refund_amount  -- 5% processing fee
    FROM orders
    WHERE order_id = order_id AND status = 'DELIVERED';
    
    RETURN COALESCE(refund_amount, 0);
END;
```

### When to use procedures vs functions?

#### **Use Stored Procedures When:**

**1. Complex Business Operations:**
```sql
-- Multi-step order fulfillment process
CREATE PROCEDURE FulfillOrder(IN order_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        INSERT INTO error_log (operation, order_id, error_time)
        VALUES ('ORDER_FULFILLMENT', order_id, NOW());
    END;
    
    START TRANSACTION;
    
    -- Step 1: Validate order
    IF NOT EXISTS(SELECT 1 FROM orders WHERE order_id = order_id AND status = 'CONFIRMED') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid order for fulfillment';
    END IF;
    
    -- Step 2: Reserve inventory
    UPDATE products p
    JOIN order_items oi ON p.product_id = oi.product_id
    SET p.reserved_stock = p.reserved_stock + oi.quantity
    WHERE oi.order_id = order_id;
    
    -- Step 3: Create shipment
    INSERT INTO shipments (order_id, status, created_at)
    VALUES (order_id, 'PREPARING', NOW());
    
    -- Step 4: Update order status
    UPDATE orders SET status = 'FULFILLING', fulfillment_date = NOW()
    WHERE order_id = order_id;
    
    -- Step 5: Notify warehouse
    INSERT INTO warehouse_notifications (order_id, notification_type, created_at)
    VALUES (order_id, 'FULFILLMENT_REQUEST', NOW());
    
    COMMIT;
END;

-- Complex operation that modifies multiple tables
CALL FulfillOrder(12345);
```

**2. Administrative Tasks:**
```sql
-- Database maintenance procedure
CREATE PROCEDURE CleanupOldData(IN retention_days INT)
BEGIN
    DECLARE rows_deleted INT DEFAULT 0;
    
    START TRANSACTION;
    
    -- Archive old orders
    INSERT INTO orders_archive 
    SELECT * FROM orders 
    WHERE order_date < DATE_SUB(NOW(), INTERVAL retention_days DAY);
    
    -- Delete old logs
    DELETE FROM access_logs 
    WHERE log_date < DATE_SUB(NOW(), INTERVAL retention_days DAY);
    
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    
    -- Update maintenance log
    INSERT INTO maintenance_log (operation, rows_affected, execution_time)
    VALUES ('CLEANUP_OLD_DATA', rows_deleted, NOW());
    
    COMMIT;
END;

-- Run monthly cleanup
CALL CleanupOldData(90);  -- Keep 90 days of data
```

**3. Batch Processing:**
```sql
-- Process pending payments in batch
CREATE PROCEDURE ProcessPendingPayments()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE payment_id INT;
    DECLARE payment_amount DECIMAL(10,2);
    
    -- Cursor for batch processing
    DECLARE payment_cursor CURSOR FOR
        SELECT id, amount FROM payments WHERE status = 'PENDING' LIMIT 100;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN payment_cursor;
    
    payment_loop: LOOP
        FETCH payment_cursor INTO payment_id, payment_amount;
        
        IF done THEN
            LEAVE payment_loop;
        END IF;
        
        -- Process individual payment
        CALL ProcessSinglePayment(payment_id, payment_amount);
    END LOOP;
    
    CLOSE payment_cursor;
END;
```

#### **Use Functions When:**

**1. Calculations and Computations:**
```sql
-- Calculate compound interest
CREATE FUNCTION CalculateCompoundInterest(
    principal DECIMAL(10,2),
    rate DECIMAL(5,4),
    time_years INT,
    compound_frequency INT
) RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE amount DECIMAL(10,2);
    SET amount = principal * POWER((1 + rate/compound_frequency), compound_frequency * time_years);
    RETURN amount;
END;

-- Use in financial calculations
SELECT 
    account_id,
    balance,
    CalculateCompoundInterest(balance, 0.05, 10, 12) as projected_balance
FROM savings_accounts;
```

**2. Data Formatting:**
```sql
-- Format phone numbers
CREATE FUNCTION FormatPhoneNumber(phone VARCHAR(20))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE formatted VARCHAR(20);
    
    IF LENGTH(phone) = 10 THEN
        SET formatted = CONCAT('(', SUBSTR(phone, 1, 3), ') ', 
                              SUBSTR(phone, 4, 3), '-', SUBSTR(phone, 7, 4));
    ELSE
        SET formatted = phone;  -- Return as-is if not 10 digits
    END IF;
    
    RETURN formatted;
END;

-- Use in reports
SELECT 
    customer_name,
    FormatPhoneNumber(phone) as formatted_phone,
    email
FROM customers
ORDER BY customer_name;
```

**3. Business Rule Validation:**
```sql
-- Validate credit score eligibility
CREATE FUNCTION IsEligibleForLoan(
    customer_id INT,
    loan_amount DECIMAL(10,2)
) RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE credit_score INT;
    DECLARE annual_income DECIMAL(10,2);
    DECLARE existing_debt DECIMAL(10,2);
    DECLARE debt_to_income_ratio DECIMAL(5,4);
    
    SELECT credit_score, annual_income INTO credit_score, annual_income
    FROM customer_profiles
    WHERE customer_id = customer_id;
    
    SELECT COALESCE(SUM(outstanding_balance), 0) INTO existing_debt
    FROM loans
    WHERE customer_id = customer_id AND status = 'ACTIVE';
    
    SET debt_to_income_ratio = (existing_debt + loan_amount) / annual_income;
    
    RETURN (credit_score >= 650 AND debt_to_income_ratio <= 0.4);
END;

-- Use in loan application queries
SELECT 
    la.application_id,
    la.customer_id,
    la.requested_amount,
    IsEligibleForLoan(la.customer_id, la.requested_amount) as is_eligible
FROM loan_applications la
WHERE la.status = 'PENDING'
  AND IsEligibleForLoan(la.customer_id, la.requested_amount) = TRUE;
```

### Can functions modify database state?

**সাধারণত functions database state modify করতে পারে না** (best practice অনুযায়ী), কিন্তু এটি database-specific।

#### **MySQL Function Restrictions:**
```sql
-- MySQL functions with READS SQL DATA can only read
CREATE FUNCTION GetCustomerTier(customer_id INT)
RETURNS VARCHAR(20)
READS SQL DATA  -- Only reads, cannot modify
DETERMINISTIC
BEGIN
    DECLARE total_spent DECIMAL(10,2);
    
    SELECT COALESCE(SUM(total_amount), 0) INTO total_spent
    FROM orders
    WHERE customer_id = customer_id;
    
    -- Cannot do: INSERT, UPDATE, DELETE operations
    -- INSERT INTO audit_log ...  -- ❌ This would cause error
    
    CASE
        WHEN total_spent > 50000 THEN RETURN 'PLATINUM';
        WHEN total_spent > 20000 THEN RETURN 'GOLD';
        WHEN total_spent > 5000 THEN RETURN 'SILVER';
        ELSE RETURN 'BRONZE';
    END CASE;
END;
```

#### **PostgreSQL Functions (More Flexible):**
```sql
-- PostgreSQL functions can modify state (but shouldn't for best practices)
CREATE OR REPLACE FUNCTION log_customer_access(customer_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    -- PostgreSQL allows this, but it's not recommended for functions
    INSERT INTO customer_access_log (customer_id, access_time)
    VALUES (customer_id, NOW());
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Better approach: Use a procedure for side effects
CREATE OR REPLACE PROCEDURE log_customer_access_proc(customer_id INT)
AS $$
BEGIN
    INSERT INTO customer_access_log (customer_id, access_time)
    VALUES (customer_id, NOW());
END;
$$ LANGUAGE plpgsql;
```

#### **Best Practice: Pure Functions**
```sql
-- Good: Pure function without side effects
CREATE FUNCTION CalculateShippingCost(
    weight DECIMAL(5,2),
    distance_km INT,
    shipping_method VARCHAR(20)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE base_cost DECIMAL(10,2);
    DECLARE cost_per_km DECIMAL(8,4);
    
    CASE shipping_method
        WHEN 'STANDARD' THEN SET base_cost = 5.00, cost_per_km = 0.02;
        WHEN 'EXPRESS' THEN SET base_cost = 15.00, cost_per_km = 0.05;
        WHEN 'OVERNIGHT' THEN SET base_cost = 25.00, cost_per_km = 0.10;
        ELSE SET base_cost = 5.00, cost_per_km = 0.02;
    END CASE;
    
    RETURN base_cost + (weight * 0.5) + (distance_km * cost_per_km);
END;

-- Can be used safely anywhere without side effects
SELECT 
    order_id,
    shipping_method,
    CalculateShippingCost(total_weight, delivery_distance, shipping_method) as shipping_cost
FROM orders
WHERE status = 'PENDING_SHIPMENT';
```

**Summary:** Functions should be **pure** (no side effects) এবং শুধুমাত্র calculations এর জন্য ব্যবহার করা উচিত। Database state modification এর জন্য stored procedures ব্যবহার করা best practice।

---

## **66. What is a trigger?**

**Trigger** হল একটি special type of stored procedure যা automatically execute হয় specific database events এর response এ। এটি manually call করা যায় না, বরং নির্দিষ্ট operations (INSERT, UPDATE, DELETE) এর সময় automatically fire হয়।

**Technical definition:** Trigger হল event-driven stored procedure যা database table এ specific changes এর সময় automatically execute হয় data integrity, business rules enforcement, এবং auditing এর জন্য।

### Basic Trigger Syntax:

```sql
-- MySQL
CREATE TRIGGER trigger_name
{BEFORE | AFTER} {INSERT | UPDATE | DELETE}
ON table_name
FOR EACH ROW
BEGIN
    -- Trigger logic
END;

-- PostgreSQL
CREATE OR REPLACE FUNCTION trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger logic
    RETURN NEW; -- or OLD for DELETE
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_name
    {BEFORE | AFTER} {INSERT | UPDATE | DELETE}
    ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION trigger_function();
```

### Simple Trigger Examples:

#### **Audit Trail Trigger:**
```sql
-- Create audit table
CREATE TABLE employee_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    action VARCHAR(10),  -- INSERT, UPDATE, DELETE
    old_salary DECIMAL(10,2),
    new_salary DECIMAL(10,2),
    changed_by VARCHAR(50),
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to log salary changes
DELIMITER //
CREATE TRIGGER employee_salary_audit
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    -- Only log if salary actually changed
    IF OLD.salary != NEW.salary THEN
        INSERT INTO employee_audit (employee_id, action, old_salary, new_salary, changed_by)
        VALUES (NEW.employee_id, 'UPDATE', OLD.salary, NEW.salary, USER());
    END IF;
END //
DELIMITER ;

-- Test the trigger
UPDATE employees SET salary = 60000 WHERE employee_id = 123;
-- Automatically creates audit record
```

#### **Automatic Timestamp Trigger:**
```sql
-- Add timestamp columns to table
ALTER TABLE orders ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Trigger to ensure updated_at is always set
DELIMITER //
CREATE TRIGGER orders_update_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Any update to orders will automatically update the timestamp
UPDATE orders SET status = 'SHIPPED' WHERE order_id = 123;
```

### Difference between BEFORE and AFTER trigger?

#### **BEFORE Triggers:**
- Execute **before** the triggering event
- Can **modify** the NEW values
- Can **prevent** the operation by raising an error
- Used for **validation** and **data transformation**

#### **AFTER Triggers:**
- Execute **after** the triggering event and COMMIT
- **Cannot modify** the row being changed
- Used for **logging**, **notifications**, and **cascading operations**

### BEFORE Trigger Examples:

#### **Data Validation:**
```sql
-- Validate business rules before insertion
DELIMITER //
CREATE TRIGGER validate_employee_before_insert
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    -- Validate salary range
    IF NEW.salary < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary cannot be negative';
    END IF;
    
    IF NEW.salary > 500000 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary exceeds maximum limit';
    END IF;
    
    -- Validate email format
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
    
    -- Auto-generate employee code
    IF NEW.employee_code IS NULL OR NEW.employee_code = '' THEN
        SET NEW.employee_code = CONCAT('EMP', LPAD(NEW.employee_id, 6, '0'));
    END IF;
    
    -- Set default values
    IF NEW.status IS NULL THEN
        SET NEW.status = 'ACTIVE';
    END IF;
END //
DELIMITER ;

-- Insert with validation
INSERT INTO employees (name, email, salary, department)
VALUES ('নতুন কর্মী', 'invalid-email', 75000, 'IT');  -- Will fail due to email validation
```

#### **Data Transformation:**
```sql
-- Normalize data before storage
DELIMITER //
CREATE TRIGGER normalize_customer_data
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    -- Normalize phone number
    SET NEW.phone = REGEXP_REPLACE(NEW.phone, '[^0-9]', '');  -- Remove non-digits
    
    -- Normalize email to lowercase
    SET NEW.email = LOWER(TRIM(NEW.email));
    
    -- Capitalize name properly
    SET NEW.first_name = CONCAT(UPPER(LEFT(NEW.first_name, 1)), LOWER(SUBSTRING(NEW.first_name, 2)));
    SET NEW.last_name = CONCAT(UPPER(LEFT(NEW.last_name, 1)), LOWER(SUBSTRING(NEW.last_name, 2)));
    
    -- Generate customer code
    SET NEW.customer_code = CONCAT('CUST', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(CONNECTION_ID(), 4, '0'));
END //
DELIMITER ;

-- Data is automatically normalized
INSERT INTO customers (first_name, last_name, email, phone)
VALUES ('জনি', 'ডো', '  JOHN.DOE@EXAMPLE.COM  ', '+1-234-567-8900');
-- Stored as: first_name='জনি', email='john.doe@example.com', phone='12345678900'
```

### AFTER Trigger Examples:

#### **Inventory Management:**
```sql
-- Update inventory after order items are inserted
DELIMITER //
CREATE TRIGGER update_inventory_after_order
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    -- Reduce available stock
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        reserved_stock = reserved_stock + NEW.quantity
    WHERE product_id = NEW.product_id;
    
    -- Check if stock is low and create alert
    IF (SELECT stock_quantity FROM products WHERE product_id = NEW.product_id) < 10 THEN
        INSERT INTO inventory_alerts (product_id, alert_type, message, created_at)
        VALUES (NEW.product_id, 'LOW_STOCK', 
                CONCAT('Product ', NEW.product_id, ' stock is running low'), NOW());
    END IF;
    
    -- Log the inventory movement
    INSERT INTO inventory_movements (product_id, movement_type, quantity, order_id, movement_date)
    VALUES (NEW.product_id, 'RESERVED', NEW.quantity, NEW.order_id, NOW());
END //
DELIMITER ;

-- Order placement automatically updates inventory
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (12345, 'P001', 5, 299.99);
-- Automatically updates stock and creates logs
```

#### **Cascading Updates:**
```sql
-- Update customer statistics after order completion
DELIMITER //
CREATE TRIGGER update_customer_stats
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Only process when order status changes to 'COMPLETED'
    IF OLD.status != 'COMPLETED' AND NEW.status = 'COMPLETED' THEN
        -- Update customer totals
        UPDATE customer_statistics 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            last_order_date = NEW.order_date,
            loyalty_points = loyalty_points + FLOOR(NEW.total_amount * 0.01)
        WHERE customer_id = NEW.customer_id;
        
        -- Update customer tier based on total spending
        UPDATE customers c
        JOIN customer_statistics cs ON c.customer_id = cs.customer_id
        SET c.customer_tier = CASE
            WHEN cs.total_spent > 100000 THEN 'PLATINUM'
            WHEN cs.total_spent > 50000 THEN 'GOLD'
            WHEN cs.total_spent > 20000 THEN 'SILVER'
            ELSE 'BRONZE'
        END
        WHERE c.customer_id = NEW.customer_id;
        
        -- Send completion notification
        INSERT INTO notifications (customer_id, type, message, created_at)
        VALUES (NEW.customer_id, 'ORDER_COMPLETED', 
                CONCAT('Your order #', NEW.order_id, ' has been completed!'), NOW());
    END IF;
END //
DELIMITER ;
```

### Can triggers call other triggers?

**হ্যাঁ, triggers অন্য triggers call করতে পারে।** এটাকে **cascading triggers** বলা হয়।

#### **Cascading Trigger Example:**
```sql
-- First trigger: Order status change
DELIMITER //
CREATE TRIGGER order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        -- This INSERT will fire another trigger
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_at)
        VALUES (NEW.order_id, OLD.status, NEW.status, NOW());
    END IF;
END //
DELIMITER ;

-- Second trigger: Status history processing (cascaded)
DELIMITER //
CREATE TRIGGER process_status_history
AFTER INSERT ON order_status_history
FOR EACH ROW
BEGIN
    -- This trigger fires when the first trigger inserts into order_status_history
    
    -- Update analytics
    INSERT INTO daily_status_changes (date, status_from, status_to, count)
    VALUES (CURDATE(), NEW.old_status, NEW.new_status, 1)
    ON DUPLICATE KEY UPDATE count = count + 1;
    
    -- If order is completed, trigger customer rewards
    IF NEW.new_status = 'COMPLETED' THEN
        UPDATE customer_rewards cr
        JOIN orders o ON cr.customer_id = o.customer_id
        SET cr.points = cr.points + FLOOR(o.total_amount * 0.02)
        WHERE o.order_id = NEW.order_id;
    END IF;
END //
DELIMITER ;

-- Single update cascades through multiple triggers
UPDATE orders SET status = 'COMPLETED' WHERE order_id = 123;
-- Fires: order_status_change → process_status_history → customer rewards update
```

### What is cascading triggers?

**Cascading triggers** হল যখন একটি trigger এর execution অন্য triggers কে fire করে। এটি একটি chain reaction তৈরি করে।

#### **Complex Cascading Example:**
```sql
-- Level 1: Product price update trigger
DELIMITER //
CREATE TRIGGER price_change_audit
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.price != NEW.price THEN
        -- Insert into price history (will fire Level 2 trigger)
        INSERT INTO price_history (product_id, old_price, new_price, change_date)
        VALUES (NEW.product_id, OLD.price, NEW.price, NOW());
    END IF;
END //
DELIMITER ;

-- Level 2: Price history processing
DELIMITER //
CREATE TRIGGER process_price_change
AFTER INSERT ON price_history
FOR EACH ROW
BEGIN
    DECLARE price_change_percent DECIMAL(5,2);
    
    -- Calculate price change percentage
    SET price_change_percent = ((NEW.new_price - NEW.old_price) / NEW.old_price) * 100;
    
    -- If significant price change, create notification (will fire Level 3 trigger)
    IF ABS(price_change_percent) > 10 THEN
        INSERT INTO price_change_notifications (product_id, change_percent, notification_type)
        VALUES (NEW.product_id, price_change_percent, 
                IF(price_change_percent > 0, 'PRICE_INCREASE', 'PRICE_DECREASE'));
    END IF;
    
    -- Update product analytics
    UPDATE product_analytics 
    SET price_changes = price_changes + 1,
        last_price_change = NOW()
    WHERE product_id = NEW.product_id;
END //
DELIMITER ;

-- Level 3: Notification processing
DELIMITER //
CREATE TRIGGER send_price_notifications
AFTER INSERT ON price_change_notifications
FOR EACH ROW
BEGIN
    -- Notify customers who have this product in wishlist
    INSERT INTO customer_notifications (customer_id, message, type, created_at)
    SELECT 
        w.customer_id,
        CONCAT('Price ', NEW.notification_type, ' for ', p.product_name, 
               ': ', ABS(NEW.change_percent), '% change'),
        'PRICE_ALERT',
        NOW()
    FROM wishlists w
    JOIN products p ON w.product_id = p.product_id
    WHERE w.product_id = NEW.product_id;
    
    -- Create marketing campaign for price drops
    IF NEW.notification_type = 'PRICE_DECREASE' AND NEW.change_percent < -15 THEN
        INSERT INTO marketing_campaigns (product_id, campaign_type, discount_percent, start_date)
        VALUES (NEW.product_id, 'FLASH_SALE', ABS(NEW.change_percent), NOW());
    END IF;
END //
DELIMITER ;

-- Single price update cascades through all levels
UPDATE products SET price = 799.99 WHERE product_id = 'P001';  -- Was 999.99
-- Level 1: Logs price change
-- Level 2: Calculates 20% decrease, creates notification
-- Level 3: Notifies wishlist customers, creates flash sale campaign
```

#### **Controlling Cascade Depth:**
```sql
-- Prevent infinite recursion with cascade depth control
DELIMITER //
CREATE TRIGGER safe_cascading_trigger
AFTER UPDATE ON sensitive_table
FOR EACH ROW
BEGIN
    DECLARE cascade_level INT DEFAULT 0;
    
    -- Check if we're already in a cascade
    SELECT COALESCE(@cascade_level, 0) INTO cascade_level;
    
    -- Prevent deep cascading
    IF cascade_level < 5 THEN
        SET @cascade_level = cascade_level + 1;
        
        -- Perform operations that might trigger other triggers
        INSERT INTO cascade_log (level, table_name, action, timestamp)
        VALUES (cascade_level, 'sensitive_table', 'UPDATE', NOW());
        
        -- Reset cascade level when done
        SET @cascade_level = cascade_level - 1;
    ELSE
        -- Log cascade limit reached
        INSERT INTO error_log (error_type, message, timestamp)
        VALUES ('CASCADE_LIMIT', 'Maximum cascade depth reached', NOW());
    END IF;
END //
DELIMITER ;
```

### Trigger Performance Considerations:

#### **Efficient Trigger Design:**
```sql
-- Good: Conditional logic to minimize unnecessary work
DELIMITER //
CREATE TRIGGER efficient_audit_trigger
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Only audit significant changes
    IF (OLD.status != NEW.status) OR 
       (ABS(OLD.total_amount - NEW.total_amount) > 0.01) OR
       (OLD.customer_id != NEW.customer_id) THEN
        
        INSERT INTO order_audit (order_id, changed_fields, old_values, new_values, change_time)
        VALUES (
            NEW.order_id,
            CONCAT_WS(',',
                IF(OLD.status != NEW.status, 'status', NULL),
                IF(ABS(OLD.total_amount - NEW.total_amount) > 0.01, 'total_amount', NULL),
                IF(OLD.customer_id != NEW.customer_id, 'customer_id', NULL)
            ),
            JSON_OBJECT('status', OLD.status, 'total_amount', OLD.total_amount, 'customer_id', OLD.customer_id),
            JSON_OBJECT('status', NEW.status, 'total_amount', NEW.total_amount, 'customer_id', NEW.customer_id),
            NOW()
        );
    END IF;
END //
DELIMITER ;
```

#### **Batch-Friendly Triggers:**
```sql
-- Handle both single row and batch operations efficiently
DELIMITER //
CREATE TRIGGER batch_friendly_inventory_update
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    -- Use INSERT ... ON DUPLICATE KEY UPDATE for efficiency
    INSERT INTO inventory_movements (product_id, total_reserved, last_updated)
    VALUES (NEW.product_id, NEW.quantity, NOW())
    ON DUPLICATE KEY UPDATE 
        total_reserved = total_reserved + NEW.quantity,
        last_updated = NOW();
        
    -- Batch notification at end of statement
    -- Use a temporary flag table to avoid multiple notifications per batch
    INSERT IGNORE INTO pending_notifications (product_id, notification_type)
    VALUES (NEW.product_id, 'INVENTORY_CHANGE');
END //
DELIMITER ;
```

Triggers অত্যন্ত powerful tools, কিন্তু সাবধানে ব্যবহার করতে হয় কারণ এগুলো performance impact করতে পারে এবং debugging কঠিন হতে পারে।

---

## **67. What is an INSTEAD OF trigger?**

**INSTEAD OF trigger** হল একটি special type of trigger যা শুধুমাত্র **views** এর উপর defined হয় এবং original DML operation (INSERT, UPDATE, DELETE) এর পরিবর্তে custom logic execute করে।

**Technical definition:** INSTEAD OF trigger হল view-specific trigger যা view এর উপর DML operations এর সময় default behavior replace করে custom business logic দিয়ে।

### Key Characteristics:

- শুধুমাত্র **views** এর উপর ব্যবহার হয়, tables এর উপর নয়
- Original operation **replace** করে, supplement করে না
- Complex views কে updatable বানানোর জন্য ব্যবহার হয়
- **FOR EACH ROW** basis এ execute হয়

### Basic INSTEAD OF Trigger Syntax:

```sql
-- SQL Server
CREATE TRIGGER trigger_name
ON view_name
INSTEAD OF {INSERT | UPDATE | DELETE}
AS
BEGIN
    -- Custom logic to handle the operation
END

-- PostgreSQL  
CREATE OR REPLACE FUNCTION instead_of_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Custom logic
    RETURN NULL; -- For INSTEAD OF triggers
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_name
    INSTEAD OF {INSERT | UPDATE | DELETE}
    ON view_name
    FOR EACH ROW
    EXECUTE FUNCTION instead_of_function();
```

### When would you use INSTEAD OF triggers?

#### **1. Making Complex Views Updatable:**

**Complex Join View:**
```sql
-- Create a complex view that's not naturally updatable
CREATE VIEW employee_department_view AS
SELECT 
    e.employee_id,
    e.name as employee_name,
    e.email,
    e.salary,
    d.department_name,
    d.location as department_location,
    d.budget as department_budget
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- This view cannot be updated directly because of the join
-- UPDATE employee_department_view SET salary = 60000; -- Would fail

-- Create INSTEAD OF trigger to handle updates
CREATE OR REPLACE FUNCTION update_employee_department_view()
RETURNS TRIGGER AS $$
BEGIN
    -- Update employee table
    UPDATE employees
    SET name = NEW.employee_name,
        email = NEW.email,
        salary = NEW.salary
    WHERE employee_id = NEW.employee_id;
    
    -- Update department table if department info changed
    UPDATE departments
    SET department_name = NEW.department_name,
        location = NEW.department_location,
        budget = NEW.department_budget
    WHERE department_id = (SELECT department_id FROM employees WHERE employee_id = NEW.employee_id);
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_department_update_trigger
    INSTEAD OF UPDATE
    ON employee_department_view
    FOR EACH ROW
    EXECUTE FUNCTION update_employee_department_view();

-- Now the view can be updated
UPDATE employee_department_view 
SET salary = 65000, department_location = 'Dhaka'
WHERE employee_id = 123;
```

#### **2. Business Logic Enforcement:**

**Order Summary View with Complex Insert Logic:**
```sql
-- Create summary view
CREATE VIEW order_summary_view AS
SELECT 
    o.order_id,
    c.customer_name,
    o.order_date,
    o.total_amount,
    o.status,
    COUNT(oi.item_id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, c.customer_name, o.order_date, o.total_amount, o.status;

-- INSTEAD OF INSERT to handle complex order creation
CREATE OR REPLACE FUNCTION insert_order_summary()
RETURNS TRIGGER AS $$
DECLARE
    new_order_id INT;
    customer_id INT;
BEGIN
    -- Get customer ID from name
    SELECT c.customer_id INTO customer_id
    FROM customers c
    WHERE c.customer_name = NEW.customer_name;
    
    IF customer_id IS NULL THEN
        RAISE EXCEPTION 'Customer % not found', NEW.customer_name;
    END IF;
    
    -- Insert into orders table
    INSERT INTO orders (customer_id, order_date, total_amount, status)
    VALUES (customer_id, NEW.order_date, NEW.total_amount, NEW.status)
    RETURNING order_id INTO new_order_id;
    
    -- Log order creation
    INSERT INTO order_audit (order_id, action, performed_by, performed_at)
    VALUES (new_order_id, 'CREATED_VIA_VIEW', current_user, NOW());
    
    -- Apply business rules
    IF NEW.total_amount > 10000 THEN
        -- Large orders need approval
        UPDATE orders SET status = 'PENDING_APPROVAL' WHERE order_id = new_order_id;
        
        -- Notify management
        INSERT INTO notifications (type, message, created_at)
        VALUES ('LARGE_ORDER', 
                format('Large order %s requires approval: $%s', new_order_id, NEW.total_amount),
                NOW());
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_summary_insert_trigger
    INSTEAD OF INSERT
    ON order_summary_view
    FOR EACH ROW
    EXECUTE FUNCTION insert_order_summary();

-- Insert through view with business logic
INSERT INTO order_summary_view (customer_name, order_date, total_amount, status)
VALUES ('John Doe', CURRENT_DATE, 15000, 'PENDING');
-- Automatically applies approval workflow for large orders
```

#### **3. Data Transformation and Validation:**

**Normalized Data Entry Through Denormalized View:**
```sql
-- Create denormalized view for easy data entry
CREATE VIEW customer_contact_view AS
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    ca.street_address,
    ca.city,
    ca.postal_code,
    co.country_name,
    cp.phone_number,
    cp.phone_type
FROM customers c
LEFT JOIN customer_addresses ca ON c.customer_id = ca.customer_id
LEFT JOIN countries co ON ca.country_id = co.country_id
LEFT JOIN customer_phones cp ON c.customer_id = cp.customer_id;

-- INSTEAD OF INSERT with data transformation
CREATE OR REPLACE FUNCTION insert_customer_contact()
RETURNS TRIGGER AS $$
DECLARE
    new_customer_id INT;
    country_id INT;
BEGIN
    -- Validate and transform email
    IF NEW.email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;
    
    -- Insert customer
    INSERT INTO customers (first_name, last_name, email)
    VALUES (INITCAP(NEW.first_name), INITCAP(NEW.last_name), LOWER(NEW.email))
    RETURNING customer_id INTO new_customer_id;
    
    -- Get or create country
    SELECT country_id INTO country_id FROM countries WHERE country_name = NEW.country_name;
    IF country_id IS NULL THEN
        INSERT INTO countries (country_name) VALUES (NEW.country_name)
        RETURNING country_id INTO country_id;
    END IF;
    
    -- Insert address if provided
    IF NEW.street_address IS NOT NULL THEN
        INSERT INTO customer_addresses (customer_id, street_address, city, postal_code, country_id)
        VALUES (new_customer_id, NEW.street_address, NEW.city, NEW.postal_code, country_id);
    END IF;
    
    -- Insert phone if provided
    IF NEW.phone_number IS NOT NULL THEN
        -- Clean phone number (remove non-digits)
        INSERT INTO customer_phones (customer_id, phone_number, phone_type)
        VALUES (new_customer_id, 
                REGEXP_REPLACE(NEW.phone_number, '[^0-9]', '', 'g'),
                COALESCE(NEW.phone_type, 'PRIMARY'));
    END IF;
    
    -- Create welcome notification
    INSERT INTO customer_notifications (customer_id, type, message, created_at)
    VALUES (new_customer_id, 'WELCOME', 
            format('Welcome %s %s! Your account has been created.', NEW.first_name, NEW.last_name),
            NOW());
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_contact_insert_trigger
    INSTEAD OF INSERT
    ON customer_contact_view
    FOR EACH ROW
    EXECUTE FUNCTION insert_customer_contact();

-- Simple insert through view handles complex normalization
INSERT INTO customer_contact_view (
    first_name, last_name, email, 
    street_address, city, postal_code, country_name,
    phone_number, phone_type
) VALUES (
    'জন', 'ডো', 'JOHN.DOE@EXAMPLE.COM',
    '123 Main St', 'Dhaka', '1000', 'Bangladesh',
    '+880-171-234-5678', 'MOBILE'
);
-- Automatically normalizes data across multiple tables
```

### How is it different from BEFORE/AFTER triggers?

| Aspect | BEFORE/AFTER Triggers | INSTEAD OF Triggers |
|--------|----------------------|-------------------|
| **Target** | Tables only | Views only |
| **Execution** | Supplement original operation | Replace original operation |
| **When executed** | Before/After original DML | Instead of original DML |
| **Purpose** | Enhance or validate operations | Implement custom operations |
| **Original operation** | Still happens | Does not happen |

#### **Comparison Example:**

**BEFORE/AFTER on Table:**
```sql
-- BEFORE trigger on table - supplements the operation
CREATE TRIGGER before_employee_update
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    -- Validate new salary
    IF NEW.salary < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid salary';
    END IF;
    
    -- Set audit fields
    SET NEW.updated_at = NOW();
    SET NEW.updated_by = USER();
END;

-- AFTER trigger on table - supplements the operation
CREATE TRIGGER after_employee_update  
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    -- Log the change
    INSERT INTO employee_audit (employee_id, old_salary, new_salary, changed_at)
    VALUES (NEW.employee_id, OLD.salary, NEW.salary, NOW());
END;

-- Original UPDATE operation still happens + trigger logic
UPDATE employees SET salary = 60000 WHERE employee_id = 123;
-- 1. BEFORE trigger validates and sets audit fields
-- 2. Original UPDATE executes
-- 3. AFTER trigger logs the change
```

**INSTEAD OF on View:**
```sql
-- INSTEAD OF trigger on view - replaces the operation
CREATE TRIGGER instead_of_employee_view_update
INSTEAD OF UPDATE ON employee_view
FOR EACH ROW
BEGIN
    -- Custom logic completely replaces the original operation
    
    -- Validate business rules
    IF NEW.salary < OLD.salary * 0.5 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary reduction too large';
    END IF;
    
    -- Update multiple tables as needed
    UPDATE employees SET salary = NEW.salary WHERE employee_id = NEW.employee_id;
    UPDATE salary_history SET current_salary = NEW.salary WHERE employee_id = NEW.employee_id;
    
    -- Additional business logic
    IF NEW.salary > OLD.salary * 1.5 THEN
        INSERT INTO hr_notifications (type, message) 
        VALUES ('LARGE_RAISE', 'Employee received large salary increase');
    END IF;
END;

-- Original UPDATE on view does NOT happen, only trigger logic executes
UPDATE employee_view SET salary = 60000 WHERE employee_id = 123;
-- Only the custom trigger logic runs, no default view update behavior
```

### Advanced INSTEAD OF Trigger Examples:

#### **Soft Delete Implementation:**
```sql
-- View that hides soft-deleted records
CREATE VIEW active_products_view AS
SELECT product_id, product_name, price, stock_quantity
FROM products
WHERE deleted_at IS NULL;

-- INSTEAD OF DELETE to implement soft delete
CREATE OR REPLACE FUNCTION soft_delete_product()
RETURNS TRIGGER AS $$
BEGIN
    -- Instead of actual delete, mark as deleted
    UPDATE products 
    SET deleted_at = NOW(),
        deleted_by = current_user
    WHERE product_id = OLD.product_id;
    
    -- Move to archive table
    INSERT INTO products_archive 
    SELECT *, NOW() as archived_at
    FROM products 
    WHERE product_id = OLD.product_id;
    
    -- Update related records
    UPDATE order_items 
    SET product_status = 'DISCONTINUED'
    WHERE product_id = OLD.product_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soft_delete_trigger
    INSTEAD OF DELETE
    ON active_products_view
    FOR EACH ROW
    EXECUTE FUNCTION soft_delete_product();

-- "Delete" from view performs soft delete
DELETE FROM active_products_view WHERE product_id = 'P001';
-- Product marked as deleted but data preserved
```

#### **Multi-Table Update Through Single View:**
```sql
-- Unified customer profile view
CREATE VIEW customer_profile_view AS
SELECT 
    c.customer_id,
    c.email,
    cp.first_name,
    cp.last_name,
    cp.birth_date,
    cs.loyalty_points,
    cs.membership_tier
FROM customers c
JOIN customer_profiles cp ON c.customer_id = cp.customer_id
JOIN customer_stats cs ON c.customer_id = cs.customer_id;

-- INSTEAD OF UPDATE to handle multi-table updates
CREATE OR REPLACE FUNCTION update_customer_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customers table
    IF NEW.email != OLD.email THEN
        UPDATE customers 
        SET email = NEW.email,
            email_verified = FALSE  -- Reset verification on email change
        WHERE customer_id = NEW.customer_id;
        
        -- Send verification email
        INSERT INTO email_verifications (customer_id, email, sent_at)
        VALUES (NEW.customer_id, NEW.email, NOW());
    END IF;
    
    -- Update customer_profiles table
    UPDATE customer_profiles
    SET first_name = NEW.first_name,
        last_name = NEW.last_name,
        birth_date = NEW.birth_date
    WHERE customer_id = NEW.customer_id;
    
    -- Update customer_stats table with business logic
    IF NEW.loyalty_points != OLD.loyalty_points THEN
        UPDATE customer_stats
        SET loyalty_points = NEW.loyalty_points,
            membership_tier = CASE
                WHEN NEW.loyalty_points > 10000 THEN 'PLATINUM'
                WHEN NEW.loyalty_points > 5000 THEN 'GOLD'
                WHEN NEW.loyalty_points > 1000 THEN 'SILVER'
                ELSE 'BRONZE'
            END,
            last_updated = NOW()
        WHERE customer_id = NEW.customer_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_profile_update_trigger
    INSTEAD OF UPDATE
    ON customer_profile_view
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_profile();

-- Single view update affects multiple tables with business logic
UPDATE customer_profile_view 
SET email = 'new@example.com',
    loyalty_points = 12000
WHERE customer_id = 123;
-- Updates 3 tables + sends verification email + recalculates tier
```

INSTEAD OF triggers হল complex views কে fully functional বানানোর powerful tool, যা application developers কে simple interface provide করে complex database operations এর জন্য।

---

## **68. What is a cursor? When would you use it?**

**Cursor** হল একটি database object যা result set এর মধ্যে row-by-row navigation করার জন্য ব্যবহার হয়। এটি SQL query এর result set কে sequential access করার mechanism provide করে।

**Technical definition:** Cursor হল pointer যা SQL query result set এর specific row point করে এবং একবারে এক row process করার facility দেয়।

### Basic Cursor Syntax:

#### **MySQL Cursor:**
```sql
DELIMITER //
CREATE PROCEDURE cursor_example()
BEGIN
    -- Cursor variables
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_name VARCHAR(100);
    
    -- Declare cursor
    DECLARE emp_cursor CURSOR FOR
        SELECT employee_id, name FROM employees WHERE department = 'IT';
    
    -- Declare continue handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Open cursor
    OPEN emp_cursor;
    
    -- Loop through cursor
    read_loop: LOOP
        FETCH emp_cursor INTO emp_id, emp_name;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Process each row
        SELECT CONCAT('Processing employee: ', emp_name) AS message;
    END LOOP;
    
    -- Close cursor
    CLOSE emp_cursor;
END //
DELIMITER ;
```

#### **PostgreSQL Cursor:**
```sql
CREATE OR REPLACE FUNCTION cursor_example()
RETURNS VOID AS $$
DECLARE
    emp_record RECORD;
    emp_cursor CURSOR FOR
        SELECT employee_id, name, salary FROM employees WHERE department = 'IT';
BEGIN
    -- Open cursor and loop
    FOR emp_record IN emp_cursor LOOP
        -- Process each row
        RAISE NOTICE 'Processing employee: % with salary: %', 
                     emp_record.name, emp_record.salary;
        
        -- Example processing logic
        IF emp_record.salary < 50000 THEN
            UPDATE employees 
            SET salary = salary * 1.1 
            WHERE employee_id = emp_record.employee_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### When would you use cursors?

#### **1. Row-by-Row Processing with Complex Logic:**

**Salary Review Process:**
```sql
DELIMITER //
CREATE PROCEDURE annual_salary_review()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_name VARCHAR(100);
    DECLARE current_salary DECIMAL(10,2);
    DECLARE years_of_service INT;
    DECLARE performance_rating DECIMAL(3,2);
    DECLARE new_salary DECIMAL(10,2);
    DECLARE raise_percentage DECIMAL(5,2);
    
    -- Cursor for all active employees
    DECLARE salary_cursor CURSOR FOR
        SELECT 
            e.employee_id,
            e.name,
            e.salary,
            YEAR(CURDATE()) - YEAR(e.hire_date) as service_years,
            COALESCE(pr.rating, 3.0) as rating
        FROM employees e
        LEFT JOIN performance_reviews pr ON e.employee_id = pr.employee_id 
            AND pr.review_year = YEAR(CURDATE()) - 1
        WHERE e.status = 'ACTIVE'
        ORDER BY e.department, e.hire_date;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Create temporary table for results
    CREATE TEMPORARY TABLE salary_adjustments (
        employee_id INT,
        employee_name VARCHAR(100),
        old_salary DECIMAL(10,2),
        new_salary DECIMAL(10,2),
        raise_amount DECIMAL(10,2),
        raise_percentage DECIMAL(5,2),
        reason VARCHAR(255)
    );
    
    OPEN salary_cursor;
    
    salary_loop: LOOP
        FETCH salary_cursor INTO emp_id, emp_name, current_salary, years_of_service, performance_rating;
        
        IF done THEN
            LEAVE salary_loop;
        END IF;
        
        -- Complex business logic for salary calculation
        SET raise_percentage = 0;
        
        -- Base raise based on performance
        CASE
            WHEN performance_rating >= 4.5 THEN SET raise_percentage = 8.0;
            WHEN performance_rating >= 4.0 THEN SET raise_percentage = 6.0;
            WHEN performance_rating >= 3.5 THEN SET raise_percentage = 4.0;
            WHEN performance_rating >= 3.0 THEN SET raise_percentage = 2.0;
            ELSE SET raise_percentage = 0;
        END CASE;
        
        -- Additional raise for long service
        IF years_of_service >= 10 THEN
            SET raise_percentage = raise_percentage + 2.0;
        ELSEIF years_of_service >= 5 THEN
            SET raise_percentage = raise_percentage + 1.0;
        END IF;
        
        -- Market adjustment for low salaries
        IF current_salary < 45000 THEN
            SET raise_percentage = raise_percentage + 3.0;
        END IF;
        
        -- Calculate new salary
        SET new_salary = current_salary * (1 + raise_percentage / 100);
        
        -- Cap maximum raise at 15%
        IF raise_percentage > 15 THEN
            SET raise_percentage = 15;
            SET new_salary = current_salary * 1.15;
        END IF;
        
        -- Minimum raise of 1% for active employees
        IF raise_percentage = 0 THEN
            SET raise_percentage = 1;
            SET new_salary = current_salary * 1.01;
        END IF;
        
        -- Store results
        INSERT INTO salary_adjustments VALUES (
            emp_id, emp_name, current_salary, new_salary,
            new_salary - current_salary, raise_percentage,
            CONCAT('Performance: ', performance_rating, ', Service: ', years_of_service, ' years')
        );
        
        -- Apply salary update
        UPDATE employees SET salary = new_salary WHERE employee_id = emp_id;
        
        -- Log the change
        INSERT INTO salary_history (employee_id, old_salary, new_salary, change_date, reason)
        VALUES (emp_id, current_salary, new_salary, CURDATE(), 'Annual Review');
        
    END LOOP;
    
    CLOSE salary_cursor;
    
    -- Return summary report
    SELECT 
        'Salary Review Complete' as status,
        COUNT(*) as employees_processed,
        ROUND(AVG(raise_percentage), 2) as avg_raise_percent,
        ROUND(SUM(raise_amount), 2) as total_raise_amount
    FROM salary_adjustments;
    
    -- Show detailed results
    SELECT * FROM salary_adjustments ORDER BY raise_percentage DESC;
    
    DROP TEMPORARY TABLE salary_adjustments;
END //
DELIMITER ;

-- Execute salary review
CALL annual_salary_review();
```

#### **2. Generating Sequential Data:**

**Order Number Generation with Custom Logic:**
```sql
DELIMITER //
CREATE PROCEDURE generate_order_numbers(IN batch_date DATE)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE order_id INT;
    DECLARE customer_tier VARCHAR(20);
    DECLARE order_total DECIMAL(10,2);
    DECLARE order_number VARCHAR(50);
    DECLARE sequence_num INT DEFAULT 1;
    
    -- Cursor for orders without order numbers
    DECLARE order_cursor CURSOR FOR
        SELECT 
            o.order_id,
            c.customer_tier,
            o.total_amount
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        WHERE o.order_date = batch_date 
        AND o.order_number IS NULL
        ORDER BY c.customer_tier DESC, o.total_amount DESC, o.created_at;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN order_cursor;
    
    order_loop: LOOP
        FETCH order_cursor INTO order_id, customer_tier, order_total;
        
        IF done THEN
            LEAVE order_loop;
        END IF;
        
        -- Generate custom order number based on business rules
        SET order_number = CONCAT(
            DATE_FORMAT(batch_date, '%Y%m%d'),  -- Date part
            '-',
            CASE customer_tier
                WHEN 'PLATINUM' THEN 'P'
                WHEN 'GOLD' THEN 'G'
                WHEN 'SILVER' THEN 'S'
                ELSE 'B'
            END,  -- Tier prefix
            LPAD(sequence_num, 4, '0'),  -- Sequential number
            IF(order_total > 1000, 'H', 'L')  -- High/Low value suffix
        );
        
        -- Update the order
        UPDATE orders SET order_number = order_number WHERE order_id = order_id;
        
        -- Increment sequence
        SET sequence_num = sequence_num + 1;
        
        -- Special handling for VIP orders
        IF customer_tier = 'PLATINUM' AND order_total > 5000 THEN
            INSERT INTO vip_order_notifications (order_id, order_number, created_at)
            VALUES (order_id, order_number, NOW());
        END IF;
        
    END LOOP;
    
    CLOSE order_cursor;
    
    SELECT CONCAT('Generated order numbers for ', sequence_num - 1, ' orders') as result;
END //
DELIMITER ;

-- Generate order numbers for today's orders
CALL generate_order_numbers(CURDATE());
```

#### **3. Data Migration with Transformation:**

**Customer Data Migration:**
```sql
DELIMITER //
CREATE PROCEDURE migrate_customer_data()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE old_id INT;
    DECLARE full_name VARCHAR(200);
    DECLARE email_phone VARCHAR(300);
    DECLARE address_info TEXT;
    DECLARE new_customer_id INT;
    DECLARE first_name VARCHAR(100);
    DECLARE last_name VARCHAR(100);
    DECLARE email VARCHAR(100);
    DECLARE phone VARCHAR(20);
    
    -- Cursor for legacy customer data
    DECLARE migration_cursor CURSOR FOR
        SELECT customer_id, full_name, contact_info, address
        FROM legacy_customers
        WHERE migrated = 0
        ORDER BY customer_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Create migration log table
    CREATE TEMPORARY TABLE IF NOT EXISTS migration_log (
        legacy_id INT,
        new_id INT,
        status VARCHAR(50),
        errors TEXT,
        migrated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    OPEN migration_cursor;
    
    migration_loop: LOOP
        FETCH migration_cursor INTO old_id, full_name, email_phone, address_info;
        
        IF done THEN
            LEAVE migration_loop;
        END IF;
        
        -- Parse full name
        SET first_name = SUBSTRING_INDEX(full_name, ' ', 1);
        SET last_name = SUBSTRING(full_name, LENGTH(first_name) + 2);
        
        -- Extract email (look for @ symbol)
        SET email = NULL;
        IF email_phone REGEXP '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' THEN
            SET email = REGEXP_SUBSTR(email_phone, '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}');
        END IF;
        
        -- Extract phone (look for numbers)
        SET phone = REGEXP_REPLACE(email_phone, '[^0-9]', '');  -- Remove non-digits
        IF LENGTH(phone) < 10 THEN
            SET phone = NULL;
        END IF;
        
        -- Begin transaction for each customer
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                INSERT INTO migration_log (legacy_id, status, errors)
                VALUES (old_id, 'FAILED', 'Database error during migration');
            END;
            
            -- Insert into new customer table
            INSERT INTO customers (first_name, last_name, email, created_at, migrated_from)
            VALUES (first_name, last_name, email, NOW(), old_id);
            
            SET new_customer_id = LAST_INSERT_ID();
            
            -- Insert phone if available
            IF phone IS NOT NULL THEN
                INSERT INTO customer_phones (customer_id, phone_number, phone_type)
                VALUES (new_customer_id, phone, 'PRIMARY');
            END IF;
            
            -- Parse and insert address
            IF address_info IS NOT NULL AND address_info != '' THEN
                INSERT INTO customer_addresses (customer_id, full_address, created_at)
                VALUES (new_customer_id, address_info, NOW());
            END IF;
            
            -- Mark as migrated in legacy table
            UPDATE legacy_customers SET migrated = 1 WHERE customer_id = old_id;
            
            -- Log successful migration
            INSERT INTO migration_log (legacy_id, new_id, status)
            VALUES (old_id, new_customer_id, 'SUCCESS');
            
            COMMIT;
            
        END;
        
    END LOOP;
    
    CLOSE migration_cursor;
    
    -- Migration summary
    SELECT 
        status,
        COUNT(*) as count,
        GROUP_CONCAT(DISTINCT legacy_id ORDER BY legacy_id SEPARATOR ', ') as customer_ids
    FROM migration_log
    GROUP BY status;
    
END //
DELIMITER ;

-- Run migration
CALL migrate_customer_data();
```

### Cursor Types এবং Properties:

#### **Cursor Types:**

**1. Forward-Only Cursor (Default):**
```sql
-- Can only move forward through result set
DECLARE simple_cursor CURSOR FOR SELECT * FROM employees;
```

**2. Scrollable Cursor (PostgreSQL):**
```sql
-- Can move backward and forward
DECLARE scrollable_cursor SCROLL CURSOR FOR SELECT * FROM employees;

-- Usage with FETCH directions
FETCH NEXT FROM scrollable_cursor;      -- Next row
FETCH PRIOR FROM scrollable_cursor;     -- Previous row  
FETCH FIRST FROM scrollable_cursor;     -- First row
FETCH LAST FROM scrollable_cursor;      -- Last row
FETCH ABSOLUTE 5 FROM scrollable_cursor; -- 5th row
FETCH RELATIVE 3 FROM scrollable_cursor; -- 3 rows forward
```

#### **Cursor with Parameters (PostgreSQL):**
```sql
CREATE OR REPLACE FUNCTION process_department_employees(dept_name TEXT)
RETURNS VOID AS $$
DECLARE
    emp_cursor CURSOR(department TEXT) FOR 
        SELECT employee_id, name, salary 
        FROM employees 
        WHERE department = $1
        ORDER BY salary DESC;
    
    emp_record RECORD;
    bonus_amount DECIMAL(10,2);
BEGIN
    -- Open cursor with parameter
    FOR emp_record IN emp_cursor(dept_name) LOOP
        -- Calculate department-specific bonus
        bonus_amount = CASE dept_name
            WHEN 'SALES' THEN emp_record.salary * 0.15
            WHEN 'IT' THEN emp_record.salary * 0.12
            WHEN 'HR' THEN emp_record.salary * 0.10
            ELSE emp_record.salary * 0.08
        END;
        
        -- Apply bonus
        UPDATE employees 
        SET bonus = bonus_amount 
        WHERE employee_id = emp_record.employee_id;
        
        RAISE NOTICE 'Applied bonus of % to %', bonus_amount, emp_record.name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT process_department_employees('IT');
```

### When NOT to use cursors:

#### **Avoid cursors for simple operations:**

**❌ Bad - Using cursor for simple updates:**
```sql
-- DON'T DO THIS
DELIMITER //
CREATE PROCEDURE bad_salary_update()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_salary DECIMAL(10,2);
    
    DECLARE salary_cursor CURSOR FOR SELECT employee_id, salary FROM employees;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN salary_cursor;
    
    update_loop: LOOP
        FETCH salary_cursor INTO emp_id, emp_salary;
        IF done THEN LEAVE update_loop; END IF;
        
        UPDATE employees SET salary = emp_salary * 1.1 WHERE employee_id = emp_id;
    END LOOP;
    
    CLOSE salary_cursor;
END //
DELIMITER ;
```

**✅ Good - Use set-based operation:**
```sql
-- DO THIS INSTEAD
UPDATE employees SET salary = salary * 1.1;
```

#### **Use cursors only when necessary:**

**Cursors are appropriate for:**
- Complex row-by-row business logic
- Sequential processing requirements  
- Data transformation during migration
- Generating sequential numbers/codes
- Cross-table operations with complex dependencies

**Avoid cursors for:**
- Simple calculations
- Basic filtering/aggregation
- Standard SQL operations
- Large datasets (performance issues)

### Cursor Performance Considerations:

#### **Efficient Cursor Usage:**
```sql
DELIMITER //
CREATE PROCEDURE efficient_cursor_processing()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE batch_size INT DEFAULT 1000;
    DECLARE processed_count INT DEFAULT 0;
    
    -- Process in batches to avoid long transactions
    DECLARE batch_cursor CURSOR FOR
        SELECT employee_id, salary 
        FROM employees 
        WHERE last_processed < DATE_SUB(NOW(), INTERVAL 1 DAY)
        ORDER BY employee_id
        LIMIT batch_size;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Start transaction
    START TRANSACTION;
    
    OPEN batch_cursor;
    
    process_loop: LOOP
        FETCH batch_cursor INTO @emp_id, @emp_salary;
        
        IF done THEN
            LEAVE process_loop;
        END IF;
        
        -- Process individual record
        CALL process_employee_record(@emp_id, @emp_salary);
        
        SET processed_count = processed_count + 1;
        
        -- Commit every 100 records to avoid long locks
        IF processed_count MOD 100 = 0 THEN
            COMMIT;
            START TRANSACTION;
        END IF;
        
    END LOOP;
    
    CLOSE batch_cursor;
    COMMIT;
    
    SELECT CONCAT('Processed ', processed_count, ' employees') AS result;
END //
DELIMITER ;
```

Cursors powerful tools হলেও সাবধানে ব্যবহার করতে হয় কারণ অনেক সময় set-based operations বেশি efficient হয়।

---

## **69. What are User-Defined Functions (UDFs)?**

**User-Defined Functions (UDFs)** হল custom functions যা developers নিজেরা create করে specific business logic implement করার জন্য। এগুলো built-in functions এর মতো reusable এবং SQL statements এ directly ব্যবহার করা যায়।

**Technical definition:** UDF হল user-created function যা input parameters নেয় এবং single value বা table return করে, SQL expressions এ ব্যবহারের জন্য।

### Types of UDFs:

#### **1. Scalar Functions (Single Value Return):**
```sql
-- MySQL Scalar Function
DELIMITER //
CREATE FUNCTION calculate_tax(salary DECIMAL(10,2), tax_rate DECIMAL(5,4))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE tax_amount DECIMAL(10,2);
    
    -- Basic tax calculation with exemption
    IF salary <= 25000 THEN
        SET tax_amount = 0;
    ELSEIF salary <= 50000 THEN
        SET tax_amount = (salary - 25000) * tax_rate;
    ELSE
        SET tax_amount = 25000 * tax_rate + (salary - 50000) * (tax_rate + 0.05);
    END IF;
    
    RETURN ROUND(tax_amount, 2);
END //
DELIMITER ;

-- Usage in SELECT statement
SELECT 
    employee_id,
    name,
    salary,
    calculate_tax(salary, 0.15) as tax_amount,
    salary - calculate_tax(salary, 0.15) as net_salary
FROM employees;
```

#### **2. Table-Valued Functions (Return Table):**
```sql
-- PostgreSQL Table Function
CREATE OR REPLACE FUNCTION get_employee_hierarchy(manager_id INT)
RETURNS TABLE(
    employee_id INT,
    employee_name VARCHAR(100),
    level_depth INT,
    manager_chain TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE employee_tree AS (
        -- Base case: direct reports
        SELECT 
            e.employee_id,
            e.name::VARCHAR(100),
            1 as level_depth,
            m.name::TEXT as manager_chain
        FROM employees e
        JOIN employees m ON e.manager_id = m.employee_id
        WHERE e.manager_id = $1
        
        UNION ALL
        
        -- Recursive case: reports of reports
        SELECT 
            e.employee_id,
            e.name::VARCHAR(100),
            et.level_depth + 1,
            et.manager_chain || ' -> ' || e.name
        FROM employees e
        JOIN employee_tree et ON e.manager_id = et.employee_id
    )
    SELECT * FROM employee_tree ORDER BY level_depth, employee_name;
END;
$$ LANGUAGE plpgsql;

-- Usage as table source
SELECT * FROM get_employee_hierarchy(101);

-- Join with other tables
SELECT 
    eh.*,
    d.department_name
FROM get_employee_hierarchy(101) eh
JOIN employees e ON eh.employee_id = e.employee_id
JOIN departments d ON e.department_id = d.department_id;
```

### Complex UDF Examples:

#### **Business Logic Functions:**

**Customer Credit Score Calculation:**
```sql
DELIMITER //
CREATE FUNCTION calculate_credit_score(customer_id INT)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE credit_score INT DEFAULT 300;  -- Base score
    DECLARE payment_history DECIMAL(5,2);
    DECLARE credit_utilization DECIMAL(5,2);
    DECLARE account_age_months INT;
    DECLARE total_orders INT;
    DECLARE payment_delays INT;
    
    -- Get payment history (% of on-time payments)
    SELECT 
        COALESCE(
            (COUNT(CASE WHEN payment_date <= due_date THEN 1 END) * 100.0 / COUNT(*)), 
            0
        )
    INTO payment_history
    FROM orders 
    WHERE customer_id = customer_id AND status = 'PAID';
    
    -- Get credit utilization (% of credit limit used)
    SELECT 
        COALESCE(
            (SUM(outstanding_amount) * 100.0 / NULLIF(credit_limit, 0)), 
            0
        )
    INTO credit_utilization
    FROM customer_accounts 
    WHERE customer_id = customer_id;
    
    -- Account age in months
    SELECT 
        TIMESTAMPDIFF(MONTH, MIN(created_at), NOW())
    INTO account_age_months
    FROM customers 
    WHERE customer_id = customer_id;
    
    -- Total successful orders
    SELECT COUNT(*) INTO total_orders
    FROM orders 
    WHERE customer_id = customer_id AND status IN ('COMPLETED', 'PAID');
    
    -- Payment delays count
    SELECT COUNT(*) INTO payment_delays
    FROM orders 
    WHERE customer_id = customer_id 
    AND payment_date > due_date;
    
    -- Calculate credit score based on factors
    
    -- Payment history impact (35% of score)
    SET credit_score = credit_score + ROUND(payment_history * 3.15);
    
    -- Credit utilization impact (30% of score) - lower is better
    IF credit_utilization <= 10 THEN
        SET credit_score = credit_score + 270;  -- Excellent
    ELSEIF credit_utilization <= 30 THEN
        SET credit_score = credit_score + 210;  -- Good
    ELSEIF credit_utilization <= 50 THEN
        SET credit_score = credit_score + 150;  -- Fair
    ELSE
        SET credit_score = credit_score + 90;   -- Poor
    END IF;
    
    -- Length of credit history (15% of score)
    SET credit_score = credit_score + LEAST(account_age_months * 2, 135);
    
    -- Order activity (10% of score)
    SET credit_score = credit_score + LEAST(total_orders * 2, 90);
    
    -- Payment delays penalty (10% of score)
    SET credit_score = credit_score - (payment_delays * 5);
    
    -- Ensure score is within valid range
    SET credit_score = GREATEST(300, LEAST(850, credit_score));
    
    RETURN credit_score;
END //
DELIMITER ;

-- Usage examples
SELECT 
    customer_id,
    name,
    calculate_credit_score(customer_id) as credit_score,
    CASE 
        WHEN calculate_credit_score(customer_id) >= 750 THEN 'Excellent'
        WHEN calculate_credit_score(customer_id) >= 700 THEN 'Good'
        WHEN calculate_credit_score(customer_id) >= 650 THEN 'Fair'
        ELSE 'Poor'
    END as credit_rating
FROM customers
ORDER BY calculate_credit_score(customer_id) DESC;
```

**Dynamic Pricing Function:**
```sql
DELIMITER //
CREATE FUNCTION get_dynamic_price(
    product_id VARCHAR(50), 
    customer_tier VARCHAR(20),
    quantity INT,
    season VARCHAR(20)
)
RETURNS DECIMAL(10,2)
READS SQL DATA
NOT DETERMINISTIC  -- Price can change based on time/inventory
BEGIN
    DECLARE base_price DECIMAL(10,2);
    DECLARE final_price DECIMAL(10,2);
    DECLARE stock_level INT;
    DECLARE demand_factor DECIMAL(5,3) DEFAULT 1.0;
    DECLARE tier_discount DECIMAL(5,3) DEFAULT 0.0;
    DECLARE quantity_discount DECIMAL(5,3) DEFAULT 0.0;
    DECLARE seasonal_adjustment DECIMAL(5,3) DEFAULT 1.0;
    
    -- Get base price and stock
    SELECT price, stock_quantity 
    INTO base_price, stock_level
    FROM products 
    WHERE product_id = product_id;
    
    IF base_price IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Customer tier discount
    SET tier_discount = CASE customer_tier
        WHEN 'PLATINUM' THEN 0.20
        WHEN 'GOLD' THEN 0.15
        WHEN 'SILVER' THEN 0.10
        WHEN 'BRONZE' THEN 0.05
        ELSE 0.0
    END;
    
    -- Quantity discount
    SET quantity_discount = CASE 
        WHEN quantity >= 100 THEN 0.15
        WHEN quantity >= 50 THEN 0.10
        WHEN quantity >= 20 THEN 0.07
        WHEN quantity >= 10 THEN 0.05
        ELSE 0.0
    END;
    
    -- Demand-based pricing (low stock = higher price)
    SET demand_factor = CASE
        WHEN stock_level <= 10 THEN 1.2   -- 20% premium for low stock
        WHEN stock_level <= 50 THEN 1.1   -- 10% premium
        WHEN stock_level > 500 THEN 0.95  -- 5% discount for overstock
        ELSE 1.0
    END;
    
    -- Seasonal adjustment
    SET seasonal_adjustment = CASE season
        WHEN 'WINTER' THEN 
            CASE 
                WHEN product_id LIKE 'WINTER%' THEN 1.3  -- Winter items premium
                WHEN product_id LIKE 'SUMMER%' THEN 0.7  -- Summer items discount
                ELSE 1.0
            END
        WHEN 'SUMMER' THEN
            CASE 
                WHEN product_id LIKE 'SUMMER%' THEN 1.25
                WHEN product_id LIKE 'WINTER%' THEN 0.8
                ELSE 1.0
            END
        WHEN 'RAMADAN' THEN 1.15  -- Festival premium
        WHEN 'EID' THEN 1.20
        ELSE 1.0
    END;
    
    -- Calculate final price
    SET final_price = base_price * demand_factor * seasonal_adjustment;
    
    -- Apply discounts
    SET final_price = final_price * (1 - tier_discount) * (1 - quantity_discount);
    
    -- Ensure minimum margin (never below 70% of base price)
    SET final_price = GREATEST(final_price, base_price * 0.7);
    
    RETURN ROUND(final_price, 2);
END //
DELIMITER ;

-- Usage in pricing queries
SELECT 
    p.product_id,
    p.product_name,
    p.price as base_price,
    get_dynamic_price(p.product_id, 'GOLD', 25, 'WINTER') as dynamic_price,
    get_dynamic_price(p.product_id, 'GOLD', 25, 'WINTER') - p.price as price_difference
FROM products p
WHERE p.category = 'ELECTRONICS';

-- Use in order processing
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (
    12345, 
    'P001', 
    10, 
    get_dynamic_price('P001', 'PLATINUM', 10, 'RAMADAN')
);
```

#### **Utility Functions:**

**Date and Time Utilities:**
```sql
-- Get next business day
DELIMITER //
CREATE FUNCTION get_next_business_day(input_date DATE, skip_days INT)
RETURNS DATE
DETERMINISTIC
BEGIN
    DECLARE result_date DATE;
    DECLARE days_added INT DEFAULT 0;
    DECLARE current_date DATE;
    
    SET current_date = input_date;
    
    WHILE days_added < skip_days DO
        SET current_date = DATE_ADD(current_date, INTERVAL 1 DAY);
        
        -- Skip weekends and holidays
        IF DAYOFWEEK(current_date) NOT IN (1, 7) THEN  -- Not Sunday(1) or Saturday(7)
            -- Check if it's not a holiday
            IF NOT EXISTS (
                SELECT 1 FROM holidays 
                WHERE holiday_date = current_date
            ) THEN
                SET days_added = days_added + 1;
            END IF;
        END IF;
    END WHILE;
    
    RETURN current_date;
END //
DELIMITER ;

-- Fiscal year calculation
DELIMITER //
CREATE FUNCTION get_fiscal_year(input_date DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE fiscal_year INT;
    DECLARE fiscal_start_month INT DEFAULT 7;  -- July start (common in many countries)
    
    IF MONTH(input_date) >= fiscal_start_month THEN
        SET fiscal_year = YEAR(input_date) + 1;
    ELSE
        SET fiscal_year = YEAR(input_date);
    END IF;
    
    RETURN fiscal_year;
END //
DELIMITER ;

-- Usage examples
SELECT 
    order_date,
    get_next_business_day(order_date, 3) as expected_delivery,
    get_fiscal_year(order_date) as fiscal_year
FROM orders
WHERE order_date >= '2024-01-01';
```

**String and Validation Functions:**
```sql
-- Validate and format phone number
DELIMITER //
CREATE FUNCTION format_phone_number(phone VARCHAR(50), country_code VARCHAR(10))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE clean_phone VARCHAR(20);
    
    -- Remove all non-digits
    SET clean_phone = REGEXP_REPLACE(phone, '[^0-9]', '');
    
    -- Validate length based on country
    CASE country_code
        WHEN 'BD' THEN
            IF LENGTH(clean_phone) = 11 AND LEFT(clean_phone, 2) = '01' THEN
                RETURN CONCAT('+880', SUBSTRING(clean_phone, 2));
            ELSE
                RETURN NULL;
            END IF;
        WHEN 'US' THEN
            IF LENGTH(clean_phone) = 10 THEN
                RETURN CONCAT('+1', clean_phone);
            ELSEIF LENGTH(clean_phone) = 11 AND LEFT(clean_phone, 1) = '1' THEN
                RETURN CONCAT('+', clean_phone);
            ELSE
                RETURN NULL;
            END IF;
        ELSE
            RETURN clean_phone;
    END CASE;
END //
DELIMITER ;

-- Email domain validation
DELIMITER //
CREATE FUNCTION is_business_email(email VARCHAR(255))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE domain VARCHAR(100);
    
    IF email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN FALSE;
    END IF;
    
    SET domain = LOWER(SUBSTRING_INDEX(email, '@', -1));
    
    -- Check against list of personal email providers
    IF domain IN ('gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
                  'aol.com', 'icloud.com', 'live.com', 'msn.com') THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END //
DELIMITER ;

-- Usage in data validation
SELECT 
    customer_id,
    email,
    phone,
    format_phone_number(phone, 'BD') as formatted_phone,
    is_business_email(email) as is_business_contact
FROM customers
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Function Properties এবং Characteristics:

#### **Function Attributes:**
```sql
-- Different function characteristics
DELIMITER //

-- DETERMINISTIC: Same input always gives same output
CREATE FUNCTION calculate_circle_area(radius DECIMAL(10,2))
RETURNS DECIMAL(15,5)
DETERMINISTIC
BEGIN
    RETURN PI() * radius * radius;
END //

-- NOT DETERMINISTIC: Output can vary for same input
CREATE FUNCTION get_random_discount()
RETURNS DECIMAL(5,2)
NOT DETERMINISTIC
BEGIN
    RETURN ROUND(RAND() * 20, 2);  -- Random discount 0-20%
END //

-- READS SQL DATA: Function reads from database
CREATE FUNCTION get_customer_total_orders(cust_id INT)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM orders WHERE customer_id = cust_id;
    RETURN total;
END //

-- NO SQL: Function doesn't access database
CREATE FUNCTION calculate_compound_interest(
    principal DECIMAL(15,2),
    rate DECIMAL(5,4),
    time_years INT,
    compounds_per_year INT
)
RETURNS DECIMAL(15,2)
NO SQL
DETERMINISTIC
BEGIN
    RETURN principal * POWER(1 + rate/compounds_per_year, compounds_per_year * time_years);
END //

DELIMITER ;
```

### UDF Performance এবং Best Practices:

#### **Optimized UDF Example:**
```sql
-- Efficient aggregation function
DELIMITER //
CREATE FUNCTION get_monthly_sales_summary(
    target_year INT,
    target_month INT,
    summary_type VARCHAR(20)
)
RETURNS DECIMAL(15,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE result DECIMAL(15,2);
    
    -- Single query with CASE for different summary types
    SELECT 
        CASE summary_type
            WHEN 'TOTAL' THEN SUM(total_amount)
            WHEN 'AVERAGE' THEN AVG(total_amount)
            WHEN 'COUNT' THEN COUNT(*)
            WHEN 'MAX' THEN MAX(total_amount)
            WHEN 'MIN' THEN MIN(total_amount)
            ELSE 0
        END
    INTO result
    FROM orders
    WHERE YEAR(order_date) = target_year 
    AND MONTH(order_date) = target_month
    AND status = 'COMPLETED';
    
    RETURN COALESCE(result, 0);
END //
DELIMITER ;

-- Usage
SELECT 
    'January 2024' as period,
    get_monthly_sales_summary(2024, 1, 'TOTAL') as total_sales,
    get_monthly_sales_summary(2024, 1, 'COUNT') as order_count,
    get_monthly_sales_summary(2024, 1, 'AVERAGE') as avg_order_value;
```

UDFs powerful tools যা code reusability এবং business logic encapsulation provide করে, কিন্তু performance implications বিবেচনা করে ব্যবহার করতে হয়।

---

## **70. What is the difference between stored procedures and functions?**

Stored procedures এবং functions দুটোই database এ reusable code blocks, কিন্তু তাদের মধ্যে significant differences রয়েছে:

### Key Differences Summary:

| Aspect | Stored Procedures | Functions |
|--------|------------------|-----------|
| **Return Value** | Optional (0, 1, or many values) | Mandatory (single value or table) |
| **Usage in SQL** | Cannot use in SELECT/WHERE | Can use in SELECT/WHERE/HAVING |
| **Side Effects** | Allowed (INSERT/UPDATE/DELETE) | Should be pure (no side effects) |
| **Transaction Control** | Can use COMMIT/ROLLBACK | Cannot control transactions |
| **Error Handling** | Full exception handling | Limited error handling |
| **Output Parameters** | Supports OUT/INOUT parameters | Only input parameters |
| **Call Method** | CALL statement | Direct usage in expressions |

### Detailed Comparison with Examples:

#### **1. Return Values:**

**Stored Procedure - Multiple/Optional Returns:**
```sql
DELIMITER //
CREATE PROCEDURE get_employee_stats(
    IN dept_name VARCHAR(50),
    OUT total_employees INT,
    OUT avg_salary DECIMAL(10,2),
    OUT highest_salary DECIMAL(10,2)
)
BEGIN
    SELECT 
        COUNT(*),
        ROUND(AVG(salary), 2),
        MAX(salary)
    INTO total_employees, avg_salary, highest_salary
    FROM employees 
    WHERE department = dept_name;
    
    -- Can also return result sets
    SELECT employee_id, name, salary 
    FROM employees 
    WHERE department = dept_name
    ORDER BY salary DESC
    LIMIT 5;
    
    -- Multiple result sets possible
    SELECT department, COUNT(*) as count
    FROM employees
    GROUP BY department;
END //
DELIMITER ;

-- Usage
CALL get_employee_stats('IT', @total, @avg, @max);
SELECT @total as total_employees, @avg as avg_salary, @max as highest_salary;
```

**Function - Single Return Value:**
```sql
DELIMITER //
CREATE FUNCTION get_department_avg_salary(dept_name VARCHAR(50))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE avg_salary DECIMAL(10,2);
    
    SELECT ROUND(AVG(salary), 2)
    INTO avg_salary
    FROM employees 
    WHERE department = dept_name;
    
    RETURN COALESCE(avg_salary, 0);
END //
DELIMITER ;

-- Usage directly in SELECT
SELECT 
    department,
    get_department_avg_salary(department) as avg_salary,
    COUNT(*) as employee_count
FROM employees
GROUP BY department;
```

#### **2. Usage in SQL Statements:**

**Functions in Complex Queries:**
```sql
-- Functions can be used anywhere expressions are allowed
SELECT 
    e.name,
    e.salary,
    get_department_avg_salary(e.department) as dept_avg,
    e.salary - get_department_avg_salary(e.department) as salary_diff,
    CASE 
        WHEN e.salary > get_department_avg_salary(e.department) THEN 'Above Average'
        ELSE 'Below Average'
    END as performance_category
FROM employees e
WHERE get_department_avg_salary(e.department) > 50000  -- Function in WHERE clause
ORDER BY get_department_avg_salary(e.department) DESC; -- Function in ORDER BY
```

**Stored Procedures Cannot be Used in Expressions:**
```sql
-- ❌ This will NOT work
SELECT name, salary, get_employee_stats('IT') FROM employees;  -- Error!

-- ✅ Must use CALL statement
CALL get_employee_stats('IT');
```

#### **3. Side Effects and Data Modification:**

**Stored Procedure with Side Effects:**
```sql
DELIMITER //
CREATE PROCEDURE process_monthly_bonuses(IN target_month INT, IN target_year INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE performance_score DECIMAL(3,2);
    DECLARE bonus_amount DECIMAL(10,2);
    DECLARE total_bonus DECIMAL(15,2) DEFAULT 0;
    
    -- Cursor for eligible employees
    DECLARE bonus_cursor CURSOR FOR
        SELECT employee_id, performance_rating
        FROM employees e
        JOIN performance_reviews pr ON e.employee_id = pr.employee_id
        WHERE pr.review_month = target_month 
        AND pr.review_year = target_year
        AND e.status = 'ACTIVE';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Clear previous bonus calculations
    DELETE FROM monthly_bonuses 
    WHERE bonus_month = target_month AND bonus_year = target_year;
    
    OPEN bonus_cursor;
    
    bonus_loop: LOOP
        FETCH bonus_cursor INTO emp_id, performance_score;
        
        IF done THEN
            LEAVE bonus_loop;
        END IF;
        
        -- Calculate bonus based on performance
        SET bonus_amount = CASE
            WHEN performance_score >= 4.5 THEN 5000
            WHEN performance_score >= 4.0 THEN 3500
            WHEN performance_score >= 3.5 THEN 2000
            WHEN performance_score >= 3.0 THEN 1000
            ELSE 0
        END;
        
        -- Insert bonus record
        INSERT INTO monthly_bonuses (employee_id, bonus_amount, bonus_month, bonus_year, calculated_at)
        VALUES (emp_id, bonus_amount, target_month, target_year, NOW());
        
        -- Update employee record
        UPDATE employees 
        SET last_bonus_date = NOW(),
            total_bonuses_received = total_bonuses_received + bonus_amount
        WHERE employee_id = emp_id;
        
        SET total_bonus = total_bonus + bonus_amount;
        
    END LOOP;
    
    CLOSE bonus_cursor;
    
    -- Log the process
    INSERT INTO bonus_processing_log (process_month, process_year, total_amount, processed_at)
    VALUES (target_month, target_year, total_bonus, NOW());
    
    COMMIT;
    
    -- Return summary
    SELECT 
        CONCAT('Processed bonuses for ', target_month, '/', target_year) as message,
        total_bonus as total_amount_distributed,
        (SELECT COUNT(*) FROM monthly_bonuses 
         WHERE bonus_month = target_month AND bonus_year = target_year) as employees_processed;
         
END //
DELIMITER ;

-- Usage
CALL process_monthly_bonuses(12, 2024);
```

**Function Should be Pure (No Side Effects):**
```sql
-- ❌ BAD: Function with side effects
DELIMITER //
CREATE FUNCTION bad_calculate_bonus(emp_id INT)
RETURNS DECIMAL(10,2)
MODIFIES SQL DATA  -- This is generally not recommended
BEGIN
    DECLARE bonus DECIMAL(10,2);
    
    -- Calculating bonus (OK)
    SELECT salary * 0.1 INTO bonus FROM employees WHERE employee_id = emp_id;
    
    -- Side effect: updating data (BAD PRACTICE in functions)
    UPDATE employees SET last_bonus_calculated = NOW() WHERE employee_id = emp_id;
    
    RETURN bonus;
END //
DELIMITER ;

-- ✅ GOOD: Pure function without side effects
DELIMITER //
CREATE FUNCTION good_calculate_bonus(emp_salary DECIMAL(10,2), performance_rating DECIMAL(3,2))
RETURNS DECIMAL(10,2)
NO SQL
DETERMINISTIC
BEGIN
    RETURN emp_salary * (performance_rating / 5.0) * 0.15;
END //
DELIMITER ;

-- Usage in calculations
SELECT 
    employee_id,
    name,
    salary,
    performance_rating,
    good_calculate_bonus(salary, performance_rating) as calculated_bonus
FROM employees e
JOIN performance_reviews pr ON e.employee_id = pr.employee_id;
```

#### **4. Transaction Control:**

**Stored Procedure with Transaction Control:**
```sql
DELIMITER //
CREATE PROCEDURE transfer_funds(
    IN from_account INT,
    IN to_account INT,
    IN amount DECIMAL(15,2),
    OUT result_message VARCHAR(255)
)
BEGIN
    DECLARE from_balance DECIMAL(15,2);
    DECLARE to_balance DECIMAL(15,2);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET result_message = 'Transaction failed due to database error';
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Check source account balance
    SELECT balance INTO from_balance 
    FROM accounts 
    WHERE account_id = from_account 
    FOR UPDATE;  -- Lock the row
    
    IF from_balance < amount THEN
        ROLLBACK;
        SET result_message = 'Insufficient funds';
    ELSE
        -- Debit from source account
        UPDATE accounts 
        SET balance = balance - amount,
            last_transaction_date = NOW()
        WHERE account_id = from_account;
        
        -- Credit to destination account
        UPDATE accounts 
        SET balance = balance + amount,
            last_transaction_date = NOW()
        WHERE account_id = to_account;
        
        -- Log the transaction
        INSERT INTO transaction_log (from_account, to_account, amount, transaction_type, created_at)
        VALUES (from_account, to_account, amount, 'TRANSFER', NOW());
        
        COMMIT;
        SET result_message = CONCAT('Successfully transferred $', amount);
    END IF;
END //
DELIMITER ;

-- Usage
CALL transfer_funds(12345, 67890, 1000.00, @message);
SELECT @message;
```

**Functions Cannot Control Transactions:**
```sql
-- ❌ This would cause error - Functions cannot use COMMIT/ROLLBACK
DELIMITER //
CREATE FUNCTION invalid_transaction_function(account_id INT)
RETURNS VARCHAR(100)
MODIFIES SQL DATA
BEGIN
    START TRANSACTION;  -- Error: Not allowed in functions
    UPDATE accounts SET balance = 0 WHERE account_id = account_id;
    COMMIT;  -- Error: Not allowed in functions
    RETURN 'Done';
END //
DELIMITER ;
```

#### **5. Error Handling:**

**Comprehensive Error Handling in Stored Procedures:**
```sql
DELIMITER //
CREATE PROCEDURE safe_employee_update(
    IN emp_id INT,
    IN new_salary DECIMAL(10,2),
    IN new_department VARCHAR(50),
    OUT operation_result VARCHAR(255)
)
BEGIN
    DECLARE dept_id INT;
    DECLARE current_salary DECIMAL(10,2);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1
            @error_code = MYSQL_ERRNO,
            @error_message = MESSAGE_TEXT;
        SET operation_result = CONCAT('Error: ', @error_code, ' - ', @error_message);
    END;
    
    START TRANSACTION;
    
    -- Validate employee exists
    SELECT salary INTO current_salary 
    FROM employees 
    WHERE employee_id = emp_id;
    
    IF current_salary IS NULL THEN
        ROLLBACK;
        SET operation_result = 'Error: Employee not found';
    ELSE
        -- Validate department
        SELECT department_id INTO dept_id
        FROM departments
        WHERE department_name = new_department;
        
        IF dept_id IS NULL THEN
            ROLLBACK;
            SET operation_result = 'Error: Invalid department';
        ELSE
            -- Business rule validation
            IF new_salary < current_salary * 0.8 THEN
                ROLLBACK;
                SET operation_result = 'Error: Salary reduction exceeds 20% limit';
            ELSE
                -- Perform update
                UPDATE employees 
                SET salary = new_salary,
                    department_id = dept_id,
                    updated_at = NOW()
                WHERE employee_id = emp_id;
                
                -- Log the change
                INSERT INTO employee_changes (employee_id, field_changed, old_value, new_value, changed_at)
                VALUES 
                    (emp_id, 'salary', current_salary, new_salary, NOW()),
                    (emp_id, 'department', 
                     (SELECT department_name FROM departments d JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id = emp_id),
                     new_department, NOW());
                
                COMMIT;
                SET operation_result = 'Success: Employee updated successfully';
            END IF;
        END IF;
    END IF;
END //
DELIMITER ;

-- Usage with comprehensive error handling
CALL safe_employee_update(123, 75000, 'Engineering', @result);
SELECT @result;
```

### When to Use Each:

#### **Use Stored Procedures When:**
- Need to perform complex business operations with multiple steps
- Require transaction control (COMMIT/ROLLBACK)
- Need to return multiple result sets
- Want to encapsulate complex workflows
- Need comprehensive error handling
- Performing data modifications (INSERT/UPDATE/DELETE)

#### **Use Functions When:**
- Need to calculate and return a single value
- Want to use the result in SQL expressions
- Creating reusable calculations
- Implementing data transformations
- Need deterministic computations
- Building utility functions for string/date manipulation

### Best Practices Summary:

#### **Stored Procedure Best Practices:**
```sql
-- Template for well-structured stored procedure
DELIMITER //
CREATE PROCEDURE template_procedure(
    IN input_param INT,
    OUT success_flag BOOLEAN,
    OUT error_message VARCHAR(500)
)
BEGIN
    -- Variable declarations
    DECLARE done INT DEFAULT FALSE;
    DECLARE result_count INT DEFAULT 0;
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1 @error_message = MESSAGE_TEXT;
        SET success_flag = FALSE;
        SET error_message = @error_message;
    END;
    
    -- Input validation
    IF input_param IS NULL OR input_param <= 0 THEN
        SET success_flag = FALSE;
        SET error_message = 'Invalid input parameter';
        LEAVE;
    END IF;
    
    -- Main logic with transaction
    START TRANSACTION;
    
    -- Business operations
    -- ... your logic here ...
    
    COMMIT;
    SET success_flag = TRUE;
    SET error_message = 'Operation completed successfully';
END //
DELIMITER ;
```

#### **Function Best Practices:**
```sql
-- Template for well-structured function
DELIMITER //
CREATE FUNCTION template_function(input_value DECIMAL(10,2))
RETURNS DECIMAL(10,2)
READS SQL DATA  -- Specify data access type
DETERMINISTIC   -- Specify deterministic nature
BEGIN
    DECLARE result DECIMAL(10,2);
    
    -- Input validation
    IF input_value IS NULL OR input_value < 0 THEN
        RETURN 0;
    END IF;
    
    -- Pure calculation logic
    -- No data modifications
    -- No transaction control
    
    RETURN COALESCE(result, 0);
END //
DELIMITER ;
```

Functions এবং stored procedures দুটোই valuable tools, কিন্তু সঠিক context এ ব্যবহার করা important performance এবং maintainability এর জন্য।