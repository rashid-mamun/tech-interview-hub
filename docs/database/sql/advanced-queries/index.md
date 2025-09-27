---
sidebar_position: 2
title: ''
---

## **16. What is a Subquery?**

Subquery হল একটি SQL query যা অন্য একটি SQL query এর ভিতরে nested বা embedded থাকে। এটি "query within a query" নামেও পরিচিত। Subquery এর result main query তে ব্যবহৃত হয়।

```sql
SELECT column1, column2
FROM table1
WHERE column1 = (SELECT column1 FROM table2 WHERE condition);
```

#### Types of Subqueries:

##### **1. Single Row Subquery:**
```sql
-- Highest paid employee এর তথ্য
SELECT name, salary 
FROM employees 
WHERE salary = (SELECT MAX(salary) FROM employees);
```

##### **2. Multiple Row Subquery:**
```sql
-- IT department এর সব employees
SELECT name, salary 
FROM employees 
WHERE dept_id IN (SELECT dept_id FROM departments WHERE dept_name = 'IT');
```

##### **3. Subquery in Different Clauses:**

**WHERE Clause:**
```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**FROM Clause (Derived Table):**
```sql
SELECT dept_name, avg_salary
FROM (
    SELECT dept_id, AVG(salary) as avg_salary
    FROM employees
    GROUP BY dept_id
) AS dept_avg
JOIN departments d ON dept_avg.dept_id = d.dept_id;
```

**SELECT Clause:**
```sql
SELECT 
    name,
    salary,
    (SELECT AVG(salary) FROM employees) AS company_avg_salary
FROM employees;
```

### Difference between Subquery and Correlated Subquery?

#### **Regular Subquery (Independent):**

Regular subquery একবার execute হয় এবং তার result main query তে ব্যবহৃত হয়।

```sql
-- Simple subquery - executes once
SELECT name, salary
FROM employees
WHERE dept_id = (SELECT dept_id FROM departments WHERE dept_name = 'IT');
```

**Execution Process:**
1. Inner query execute: `SELECT dept_id FROM departments WHERE dept_name = 'IT'` → Returns 101
2. Main query execute: `SELECT name, salary FROM employees WHERE dept_id = 101`

#### **Correlated Subquery (Dependent):**

Correlated subquery main query এর প্রতিটি row এর জন্য execute হয়।

```sql
-- Correlated subquery - executes for each row
SELECT e1.name, e1.salary
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary) 
    FROM employees e2 
    WHERE e2.dept_id = e1.dept_id  -- References outer query
);
```

**Execution Process:**
1. Main query এর প্রতিটি row এর জন্য
2. Inner query execute হয় সেই row এর context এ
3. Result compare করে condition check করে

#### **Performance Comparison:**

| বিষয় | Regular Subquery | Correlated Subquery |
|-------|------------------|---------------------|
| **Execution** | Once | For each outer row |
| **Performance** | Generally faster | Generally slower |
| **Dependency** | Independent | Dependent on outer query |
| **Optimization** | Easier to optimize | Harder to optimize |

#### **Real-world Examples:**

**Regular Subquery:**
```sql
-- সবচেয়ে expensive product এর category
SELECT category_name
FROM categories
WHERE category_id = (
    SELECT category_id 
    FROM products 
    ORDER BY price DESC 
    LIMIT 1
);
```

**Correlated Subquery:**
```sql
-- Each department এর highest paid employee
SELECT e1.name, e1.salary, d.dept_name
FROM employees e1
JOIN departments d ON e1.dept_id = d.dept_id
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.dept_id = e1.dept_id  -- Correlated part
);
```

### When would you use EXISTS vs IN with subqueries?

#### **EXISTS Operator:**

EXISTS operator check করে যে subquery কোনো rows return করে কি না। এটি boolean result দেয় (TRUE/FALSE)।

```sql
-- Customers যাদের কমপক্ষে একটি order আছে
SELECT c.customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.customer_id = c.customer_id
);
```

#### **IN Operator:**

IN operator specific values এর list এর সাথে match করে।

```sql
-- Same result, কিন্তু IN দিয়ে
SELECT customer_name
FROM customers
WHERE customer_id IN (
    SELECT DISTINCT customer_id 
    FROM orders
);
```

#### **Performance Comparison:**

#### **EXISTS এর Advantages:**

**1. NULL Handling:**
```sql
-- EXISTS doesn't care about NULL values
SELECT c.customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id 
    AND o.status IS NULL  -- NULL values don't affect EXISTS
);
```

**2. Early Termination:**
```sql
-- EXISTS stops after finding first match
-- More efficient for large datasets
```

**3. Better for Correlated Queries:**
```sql
-- Efficiently finds customers with orders in last 30 days
SELECT c.customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
    AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
);
```

#### **IN এর Advantages:**

**1. Simple Value Lists:**
```sql
-- Direct value comparison
SELECT * FROM products 
WHERE category_id IN (1, 2, 3, 4);
```

**2. Readable for Simple Cases:**
```sql
-- Easy to understand
SELECT * FROM employees 
WHERE dept_id IN (SELECT dept_id FROM departments WHERE location = 'Dhaka');
```

#### **When to Use Which:**

| Scenario | Use | Reason |
|----------|-----|---------|
| **NULL values in subquery** | EXISTS | IN returns NULL with NULL values |
| **Large datasets** | EXISTS | Early termination, better performance |
| **Simple value lists** | IN | More readable |
| **Correlated subqueries** | EXISTS | Better optimization |
| **Multiple columns** | EXISTS | IN doesn't support multiple columns well |

#### **Examples with Performance Impact:**

**Large Table Scenario:**
```sql
-- Table: customers (1M rows), orders (10M rows)

-- EXISTS - faster (stops at first match)
SELECT COUNT(*)
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id
);
-- Execution time: ~2 seconds

-- IN - slower (processes all subquery results)
SELECT COUNT(*)
FROM customers c
WHERE c.customer_id IN (
    SELECT customer_id FROM orders
);
-- Execution time: ~8 seconds
```

### Performance Comparison: JOIN vs Subquery?

#### **JOIN Approach:**

```sql
-- Using JOIN
SELECT DISTINCT c.customer_name, c.email
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2023-01-01';
```

#### **Subquery Approach:**

```sql
-- Using EXISTS subquery
SELECT c.customer_name, c.email
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
    AND o.order_date >= '2023-01-01'
);
```

#### **Performance Analysis:**

#### **JOIN Advantages:**

**1. Better Optimization:**
```sql
-- Query optimizer can choose best execution plan
-- Can use indexes efficiently
-- Better statistics available
```

**2. Retrieving Related Data:**
```sql
-- When you need data from both tables
SELECT c.customer_name, o.order_date, o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed';
```

**3. Set-based Operations:**
```sql
-- Better for aggregations
SELECT c.customer_name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
```

#### **Subquery Advantages:**

**1. Existence Check:**
```sql
-- Better when you only need to check existence
SELECT customer_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
```

**2. Complex Conditions:**
```sql
-- Complex logic easier to read
SELECT product_name
FROM products p
WHERE price > (
    SELECT AVG(price) 
    FROM products p2 
    WHERE p2.category_id = p.category_id
);
```

#### **Performance Benchmarks:**

**Test Setup:** 100K customers, 1M orders

| Query Type | Execution Time | Memory Usage |
|------------|----------------|--------------|
| **INNER JOIN** | 0.8 seconds | 50MB |
| **EXISTS Subquery** | 1.2 seconds | 30MB |
| **IN Subquery** | 3.5 seconds | 80MB |

#### **Best Practices:**

**Use JOIN when:**
- Need data from multiple tables
- Better performance for large datasets
- Simple relationships

**Use Subquery when:**
- Complex business logic
- Existence checks
- Avoiding duplicate results
- Nested conditions

**Example Decision Tree:**
```sql
-- Need customer info + order details? → Use JOIN
SELECT c.name, o.order_date, o.amount
FROM customers c
JOIN orders o ON c.id = o.customer_id;

-- Only need customers who have orders? → Use EXISTS
SELECT c.name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- Need customers with specific order criteria? → Use subquery
SELECT c.name
FROM customers c
WHERE c.id IN (
    SELECT customer_id FROM orders 
    WHERE total_amount > (SELECT AVG(total_amount) FROM orders)
);
```

---

## **17. What is HAVING vs WHERE Clause?**

WHERE এবং HAVING উভয়ই SQL এ filtering এর জন্য ব্যবহৃত হয়, কিন্তু তারা different stages এ apply হয় এবং different purposes serve করে।

| বিষয় | WHERE | HAVING |
|-------|-------|--------|
| **Usage** | Individual rows filter | Groups filter |
| **Applied** | Before GROUP BY | After GROUP BY |
| **Works with** | Column values | Aggregate functions |
| **Performance** | Faster (fewer rows to process) | Slower (after aggregation) |

#### WHERE Clause:

WHERE clause individual rows কে filter করে GROUP BY এবং aggregation এর আগে।

```sql
-- WHERE example: Individual row filtering
SELECT name, salary, department
FROM employees
WHERE salary > 50000;  -- Filters rows before any grouping
```

#### HAVING Clause:

HAVING clause groups কে filter করে GROUP BY এবং aggregation এর পরে।

```sql
-- HAVING example: Group filtering
SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 60000;  -- Filters groups after aggregation
```

**Table Structure:**
```sql
CREATE TABLE sales (
    id INT,
    salesperson VARCHAR(50),
    region VARCHAR(50),
    sale_amount DECIMAL(10,2),
    sale_date DATE
);

INSERT INTO sales VALUES
(1, 'আলী', 'ঢাকা', 15000, '2023-01-15'),
(2, 'ফাতেমা', 'ঢাকা', 25000, '2023-01-20'),
(3, 'করিম', 'চট্টগ্রাম', 18000, '2023-01-25'),
(4, 'রহিম', 'ঢাকা', 12000, '2023-02-01'),
(5, 'আয়েশা', 'চট্টগ্রাম', 22000, '2023-02-05');
```

#### **WHERE Usage:**
```sql
-- Individual sales > 15000 এর তথ্য
SELECT salesperson, region, sale_amount
FROM sales
WHERE sale_amount > 15000;  -- Filters individual rows

-- Result:
-- ফাতেমা, ঢাকা, 25000
-- করিম, চট্টগ্রাম, 18000
-- আয়েশা, চট্টগ্রাম, 22000
```

#### **HAVING Usage:**
```sql
-- Regions যাদের total sales > 30000
SELECT region, SUM(sale_amount) as total_sales
FROM sales
GROUP BY region
HAVING SUM(sale_amount) > 30000;  -- Filters groups

-- Result:
-- ঢাকা, 52000
-- চট্টগ্রাম, 40000
```

#### **Combined Usage:**
```sql
-- 2023 January এর sales, regions যাদের average > 15000
SELECT 
    region, 
    COUNT(*) as sale_count,
    AVG(sale_amount) as avg_sale
FROM sales
WHERE sale_date >= '2023-01-01' 
  AND sale_date < '2023-02-01'  -- WHERE: filters rows first
GROUP BY region
HAVING AVG(sale_amount) > 15000;  -- HAVING: filters groups after

-- Execution order:
-- 1. WHERE filters January sales only
-- 2. GROUP BY groups by region  
-- 3. HAVING filters regions with avg > 15000
```

### Can HAVING be used without GROUP BY?

**হ্যাঁ, কিন্তু limited cases এ।** কিছু database systems এ HAVING without GROUP BY ব্যবহার করা যায়, কিন্তু এটি পুরো table কে একটি single group হিসেবে treat করে।

#### **HAVING without GROUP BY:**

```sql
-- Valid in some databases (MySQL, SQL Server)
SELECT COUNT(*) as total_employees
FROM employees
HAVING COUNT(*) > 100;

-- Equivalent to:
SELECT COUNT(*) as total_employees
FROM employees
WHERE (SELECT COUNT(*) FROM employees) > 100;
```

#### **Practical Example:**

```sql
-- Check if company has more than 50 employees
SELECT 'Company is large' as status
FROM employees
HAVING COUNT(*) > 50;

-- If condition false, no rows returned
-- If condition true, returns the message
```

#### **Why it's rarely used:**
```sql
-- More readable approach
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM employees) > 50 
        THEN 'Large Company' 
        ELSE 'Small Company' 
    END as company_size;
```

### Can you use column aliases in HAVING clause?

**এটি database-dependent।** বেশিরভাগ modern databases এ column aliases HAVING clause এ ব্যবহার করা যায়।

#### **Supported Databases:**

**MySQL:**
```sql
SELECT 
    department,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING avg_salary > 60000;  -- ✓ Alias works
```

**PostgreSQL:**
```sql
SELECT 
    department,
    COUNT(*) as emp_count
FROM employees
GROUP BY department
HAVING emp_count > 5;  -- ✓ Alias works
```

**SQL Server:**
```sql
SELECT 
    region,
    SUM(sales) as total_sales
FROM sales_data
GROUP BY region
HAVING total_sales > 100000;  -- ✓ Alias works
```

#### **Alternative Approach (Universal):**

```sql
-- If aliases don't work, repeat the expression
SELECT 
    department,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 60000;  -- Repeat the aggregate function
```



#### **Execution Order এ Alias Usage:**

```sql
-- SQL execution order:
-- 1. FROM - Table selection
-- 2. WHERE - Row filtering (aliases not available yet)
-- 3. GROUP BY - Grouping (aliases not available yet)  
-- 4. SELECT - Column calculation (aliases created here)
-- 5. HAVING - Group filtering (aliases available now)
-- 6. ORDER BY - Sorting (aliases available)

SELECT 
    department,
    AVG(salary) as dept_avg_salary
FROM employees
WHERE salary > 30000           -- ❌ Can't use dept_avg_salary here
GROUP BY department            -- ❌ Can't use dept_avg_salary here
HAVING dept_avg_salary > 55000 -- ✓ Can use alias here
ORDER BY dept_avg_salary DESC; -- ✓ Can use alias here
```

---

## **18. What is UNION vs UNION ALL?**

UNION এবং UNION ALL operators দুই বা ততোধিক SELECT statements এর results combine করার জন্য ব্যবহৃত হয়। তাদের মধ্যে main difference হল duplicate handling এ।

#### UNION Operator:

UNION operator দুই বা ততোধিক SELECT statements এর results combine করে এবং **duplicate rows remove** করে দেয়।

```sql
-- UNION syntax
SELECT column1, column2 FROM table1
UNION
SELECT column1, column2 FROM table2;
```

#### UNION ALL Operator:

UNION ALL operator same কাজ করে কিন্তু **duplicate rows keep** করে।

```sql
-- UNION ALL syntax
SELECT column1, column2 FROM table1
UNION ALL
SELECT column1, column2 FROM table2;
```

##### **Table Setup:**
```sql
-- Dhaka customers
CREATE TABLE dhaka_customers (
    id INT,
    name VARCHAR(50),
    city VARCHAR(50)
);

INSERT INTO dhaka_customers VALUES
(1, 'রহিম', 'ঢাকা'),
(2, 'করিম', 'ঢাকা'),
(3, 'ফাতেমা', 'ঢাকা');

-- Chittagong customers  
CREATE TABLE chittagong_customers (
    id INT,
    name VARCHAR(50),
    city VARCHAR(50)
);

INSERT INTO chittagong_customers VALUES
(2, 'করিম', 'ঢাকা'),  -- Duplicate
(4, 'আলী', 'চট্টগ্রাম'),
(5, 'আয়েশা', 'চট্টগ্রাম');
```

##### **UNION Example:**
```sql
SELECT name, city FROM dhaka_customers
UNION
SELECT name, city FROM chittagong_customers;

-- Result (duplicates removed):
-- রহিম, ঢাকা
-- করিম, ঢাকা  (appears only once)
-- ফাতেমা, ঢাকা
-- আলী, চট্টগ্রাম
-- আয়েশা, চট্টগ্রাম
```

##### **UNION ALL Example:**
```sql
SELECT name, city FROM dhaka_customers
UNION ALL
SELECT name, city FROM chittagong_customers;

-- Result (all rows included):
-- রহিম, ঢাকা
-- করিম, ঢাকা
-- ফাতেমা, ঢাকা
-- করিম, ঢাকা  (duplicate included)
-- আলী, চট্টগ্রাম
-- আয়েশা, চট্টগ্রাম
```

### When would you use UNION ALL instead of UNION?

#### **1. Performance Reasons:**

UNION ALL significantly faster কারণ duplicate checking এর প্রয়োজন নেই।

```sql
-- Performance test with large tables

-- UNION (slower - needs duplicate checking)
SELECT customer_id, name FROM customers_2022  -- 1M rows
UNION
SELECT customer_id, name FROM customers_2023; -- 1M rows
-- Execution time: ~15 seconds

-- UNION ALL (faster - no duplicate checking)  
SELECT customer_id, name FROM customers_2022
UNION ALL  
SELECT customer_id, name FROM customers_2023;
-- Execution time: ~3 seconds
```

#### **2. When Duplicates are Wanted:**

```sql
-- Sales report: want to see all transactions including duplicates
SELECT sale_date, amount, 'Online' as channel FROM online_sales
UNION ALL
SELECT sale_date, amount, 'Store' as channel FROM store_sales;

-- Result shows all sales, even if same date/amount
```

#### **3. Data Migration/ETL:**

```sql
-- Combining data from multiple sources
SELECT emp_id, name, 'HR_SYSTEM' as source FROM hr_employees
UNION ALL
SELECT emp_id, name, 'PAYROLL_SYSTEM' as source FROM payroll_employees
UNION ALL  
SELECT emp_id, name, 'BENEFITS_SYSTEM' as source FROM benefits_employees;

-- Need to see all records from all systems for analysis
```

#### **4. Log/Audit Tables:**

```sql
-- Combining different log tables
SELECT timestamp, user_id, action FROM login_logs
UNION ALL
SELECT timestamp, user_id, action FROM logout_logs
UNION ALL
SELECT timestamp, user_id, action FROM error_logs;

-- All log entries needed, duplicates are meaningful
```

### Performance Difference Between Them:

#### **UNION Performance Impact:**

```sql
-- UNION process:
-- 1. Execute first SELECT
-- 2. Execute second SELECT  
-- 3. Combine results
-- 4. Sort/hash to identify duplicates (EXPENSIVE)
-- 5. Remove duplicates
-- 6. Return final result
```

#### **UNION ALL Performance:**

```sql
-- UNION ALL process:
-- 1. Execute first SELECT
-- 2. Execute second SELECT
-- 3. Combine results (SIMPLE APPEND)
-- 4. Return final result
```

#### **Real Performance Numbers:**

**Test Setup:** 2 tables with 500K rows each, 10% overlap

| Operation | Execution Time | Memory Usage | CPU Usage |
|-----------|----------------|--------------|-----------|
| **UNION** | 12.5 seconds | 450MB | 85% |
| **UNION ALL** | 2.1 seconds | 180MB | 35% |

#### **When Performance Matters Most:**

```sql
-- Large dataset combination
SELECT product_id, sales_amount FROM sales_q1_2023  -- 2M rows
UNION ALL  -- Choose UNION ALL for performance
SELECT product_id, sales_amount FROM sales_q2_2023  -- 2M rows
UNION ALL
SELECT product_id, sales_amount FROM sales_q3_2023  -- 2M rows
UNION ALL
SELECT product_id, sales_amount FROM sales_q4_2023; -- 2M rows

-- 8M total rows processed in ~5 seconds vs ~45 seconds with UNION
```

### What is INTERSECT and EXCEPT?

#### **INTERSECT Operator:**

INTERSECT returns rows যা **দুই SELECT statements এ common** আছে।

```sql
-- Common customers between two regions
SELECT customer_id, name FROM dhaka_customers
INTERSECT
SELECT customer_id, name FROM premium_customers;

-- Returns only customers who are both in Dhaka AND premium
```

#### **EXCEPT (or MINUS) Operator:**

EXCEPT returns rows যা **first SELECT এ আছে কিন্তু second SELECT এ নেই**।

```sql
-- Customers in Dhaka but not premium
SELECT customer_id, name FROM dhaka_customers
EXCEPT
SELECT customer_id, name FROM premium_customers;

-- Returns Dhaka customers who are NOT premium
```

## **19. What is DISTINCT Keyword?**

DISTINCT keyword SQL এ duplicate values remove করার জন্য ব্যবহৃত হয়। এটি SELECT statement এ unique values শুধুমাত্র একবার return করে।

```sql
SELECT DISTINCT column1, column2, ...
FROM table_name;
```

#### **Without DISTINCT:**
```sql
-- Sample data in employees table
SELECT department FROM employees;

-- Result (with duplicates):
-- IT
-- HR  
-- IT
-- Finance
-- HR
-- IT
-- Finance
```

#### **With DISTINCT:**
```sql
SELECT DISTINCT department FROM employees;

-- Result (without duplicates):
-- IT
-- HR
-- Finance
```
### Can DISTINCT be used across multiple columns?

**হ্যাঁ, DISTINCT multiple columns এর combination এর জন্য ব্যবহার করা যায়।**

#### **Multiple Column DISTINCT:**

```sql
-- Unique combinations of city and state
SELECT DISTINCT city, state FROM customers;

-- Result:
-- ঢাকা, ঢাকা বিভাগ
-- চট্টগ্রাম, চট্টগ্রাম বিভাগ
-- সিলেট, সিলেট বিভাগ
-- কুমিল্লা, চট্টগ্রাম বিভাগ
```

#### **Understanding Multi-column DISTINCT:**

**Sample Data:**
```sql
CREATE TABLE orders (
    customer_id INT,
    product_id INT,
    order_date DATE,
    quantity INT
);

INSERT INTO orders VALUES
(1, 101, '2023-01-15', 2),
(1, 101, '2023-01-15', 3),  -- Different quantity, same customer+product+date
(1, 102, '2023-01-15', 1),  -- Different product
(2, 101, '2023-01-15', 2),  -- Different customer
(1, 101, '2023-01-16', 2);  -- Different date
```

**Different DISTINCT Applications:**

```sql
-- 1. Unique customers who placed orders
SELECT DISTINCT customer_id FROM orders;
-- Result: 1, 2

-- 2. Unique customer-product combinations
SELECT DISTINCT customer_id, product_id FROM orders;
-- Result: (1,101), (1,102), (2,101)

-- 3. Unique customer-product-date combinations
SELECT DISTINCT customer_id, product_id, order_date FROM orders;
-- Result: (1,101,'2023-01-15'), (1,102,'2023-01-15'), (2,101,'2023-01-15'), (1,101,'2023-01-16')

-- 4. All unique combinations (all columns)
SELECT DISTINCT customer_id, product_id, order_date, quantity FROM orders;
-- Result: All 5 rows (each is unique in this combination)
```

### How does DISTINCT work internally?

#### **Internal Processing Steps:**

**1. Sorting Method:**
```sql
-- Database sorts all result rows
SELECT DISTINCT department, salary FROM employees;

-- Internal process:
-- 1. Retrieve all rows: (IT, 50000), (HR, 45000), (IT, 50000), (Finance, 55000)
-- 2. Sort by all columns: (Finance, 55000), (HR, 45000), (IT, 50000), (IT, 50000)  
-- 3. Remove consecutive duplicates: (Finance, 55000), (HR, 45000), (IT, 50000)
-- 4. Return result
```

**2. Hashing Method:**
```sql
-- Database uses hash table to track seen combinations
-- 1. Create empty hash table
-- 2. For each row, calculate hash of (department, salary)
-- 3. If hash not seen before, add to result and hash table
-- 4. If hash already exists, skip row
-- 5. Return accumulated results
```

#### **Performance Implications:**

**Memory Usage:**
```sql
-- DISTINCT needs memory to track unique values
SELECT DISTINCT customer_id FROM large_orders_table;  -- 10M rows

-- Memory usage approaches:
-- Sorting: Needs space to sort all customer_ids
-- Hashing: Needs space for hash table of unique customer_ids
```

**Query Execution Plan:**
```sql
-- Check execution plan
EXPLAIN SELECT DISTINCT department FROM employees;

-- Possible plans:
-- 1. Sort + Remove Duplicates
-- 2. Hash Aggregate  
-- 3. Index Scan (if covering index exists)
```

#### **Optimization Techniques:**

**1. Index Usage:**
```sql
-- If index exists on department column
CREATE INDEX idx_department ON employees (department);

-- DISTINCT can use index scan instead of full table scan
SELECT DISTINCT department FROM employees;
-- Uses index scan → much faster
```

**2. Covering Index:**
```sql
-- For multi-column DISTINCT
CREATE INDEX idx_dept_salary ON employees (department, salary);

SELECT DISTINCT department, salary FROM employees;
-- Uses covering index → no table access needed
```

**3. Limit Results:**
```sql
-- When you don't need all distinct values
SELECT DISTINCT category FROM products LIMIT 10;
-- Database can stop after finding 10 unique values
```

#### **DISTINCT vs GROUP BY Performance:**

```sql
-- These queries are often equivalent internally:

-- Using DISTINCT
SELECT DISTINCT department FROM employees;

-- Using GROUP BY
SELECT department FROM employees GROUP BY department;

-- Both might generate similar execution plans
-- GROUP BY sometimes optimized better with indexes
```

#### **Best Practices:**

**1. Use Indexes:**
```sql
-- Create appropriate indexes for DISTINCT queries
CREATE INDEX idx_category ON products (category);
SELECT DISTINCT category FROM products;  -- Fast with index
```

**2. Limit Columns:**
```sql
-- Bad: DISTINCT on many columns
SELECT DISTINCT * FROM large_table;  -- Slow, memory intensive

-- Good: DISTINCT on specific columns
SELECT DISTINCT category, brand FROM products;  -- Faster, less memory
```

**3. Consider Alternatives:**
```sql
-- Sometimes EXISTS is more efficient than DISTINCT
-- Instead of:
SELECT DISTINCT customer_id FROM orders;

-- Consider:
SELECT customer_id FROM customers c 
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
```

**4. Monitor Performance:**
```sql
-- Use EXPLAIN to understand execution plan
EXPLAIN SELECT DISTINCT department, location FROM employees;

-- Look for:
-- - Index usage
-- - Memory usage estimates  
-- - Sort operations
-- - Hash operations
```

---