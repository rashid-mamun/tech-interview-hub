---
sidebar_position: 1
title: 'SQL Basics'
---


## **11. What is SQL?**

```mermaid
flowchart LR
    Select[SELECT] --> From[FROM]
    From --> Where[WHERE]
    Where --> Group[GROUP BY]
    Group --> Having[HAVING]
    Having --> Order[ORDER BY]
```

SQL (Structured Query Language) হল একটি standard programming language যা relational database management systems (RDBMS) এর সাথে communicate করার জন্য ব্যবহৃত হয়। এটি data store, manipulate, এবং retrieve করার জন্য ব্যবহৃত হয়।

**Technical Definition:** SQL হল একটি declarative language যেখানে আমরা বলি "কী চাই" কিন্তু "কীভাবে পেতে হবে" তা database engine নিজেই ঠিক করে।

### Difference between SQL, MySQL, PostgreSQL, Oracle?

#### **SQL vs Database Systems:**

| বিষয় | SQL | MySQL | PostgreSQL | Oracle |
|-------|-----|-------|------------|---------|
| **Type** | Language/Standard | Database System | Database System | Database System |
| **Role** | Query Language | RDBMS Software | RDBMS Software | RDBMS Software |
| **Relationship** | Standard | Implements SQL | Implements SQL | Implements SQL |

**বিস্তারিত:**

**SQL:** 
- এটি একটি **standard language** (ANSI/ISO standard)
- সব relational databases এ SQL ব্যবহার হয়
- Basic syntax সব database এ একই

**MySQL:**
- Open-source relational database
- Web applications এ popular (WordPress, Facebook early days)
- MyISAM, InnoDB storage engines
- Limited window functions (older versions)

**PostgreSQL:**
- Advanced open-source object-relational database
- ACID compliance এ strongest  
- Advanced features: JSON support, arrays, custom data types
- Enterprise-level features

**Oracle:**
- Commercial enterprise database
- Most advanced features এবং performance optimization
- Large enterprise applications এর জন্য
- Expensive licensing

### Is SQL case-sensitive?

SQL case-sensitivity নির্ভর করে database system এবং configuration এর উপর:

#### **Keywords এবং Functions:**
```sql
-- এই সব একই
SELECT * FROM users;
select * from users;
Select * From Users;
```
SQL keywords (SELECT, FROM, WHERE) সাধারণত case-insensitive।

#### **Database এবং Table Names:**

**MySQL (Windows):**
```sql
-- একই table reference করে
SELECT * FROM Users;
SELECT * FROM users;
SELECT * FROM USERS;
```

**MySQL (Linux) এবং PostgreSQL:**
```sql
-- Different tables!
SELECT * FROM Users;   -- 'Users' table
SELECT * FROM users;   -- 'users' table  
SELECT * FROM USERS;   -- 'USERS' table
```

#### **Column Names:**
```sql
-- সাধারণত case-insensitive
SELECT first_name FROM users;
SELECT First_Name FROM users;
SELECT FIRST_NAME FROM users;
```

#### **String Values:**
```sql
-- Case-sensitive
SELECT * FROM users WHERE name = 'John';     -- ✓
SELECT * FROM users WHERE name = 'john';     -- ✗ (different)
SELECT * FROM users WHERE name = 'JOHN';     -- ✗ (different)
```

### What are SQL standards (ANSI SQL)?

ANSI SQL হল American National Standards Institute (ANSI) এবং ISO (International Organization for Standardization) দ্বারা defined SQL standards।

#### **Major SQL Standards:**

**SQL-86 (SQL1):**
- First major standard
- Basic SELECT, INSERT, UPDATE, DELETE
- Primary and foreign keys

**SQL-89 (SQL1 Revised):**
- Minor revision
- Referential integrity

**SQL-92 (SQL2):**
- Major expansion
- OUTER JOINs
- New data types (DATE, TIME, TIMESTAMP)
- String operations

**SQL:1999 (SQL3):**
- Object-relational features
- Arrays
- User-defined types
- Regular expressions

**SQL:2003:**
- XML features
- Window functions
- Standardized object features

**SQL:2006:**
- XML import, store, query
- More XML features

**SQL:2008:**
- MERGE statement
- INSTEAD OF triggers
- Enhanced window functions

**SQL:2011:**
- Temporal data (time-based data)
- Enhanced window functions

#### **Why Standards Matter:**

**Portability:**
```sql
-- Standard SQL - works across databases
SELECT customer_id, COUNT(*) as order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;
```

**Database-Specific Extensions:**
```sql
-- MySQL specific
SELECT * FROM users LIMIT 10;

-- SQL Server specific  
SELECT TOP 10 * FROM users;

-- Oracle specific
SELECT * FROM users WHERE ROWNUM <= 10;
```

---

## **12. Types of SQL Commands**

SQL commands গুলোকে ৪টি main categories এ ভাগ করা হয়:

### 1.DDL (Data Definition Language)
Database structure define এবং modify করার জন্য ব্যবহৃত হয়।

- **CREATE** - Database, table, index তৈরি করা
- **ALTER** - Existing structure modify করা  
- **DROP** - Database objects delete করা
- **TRUNCATE** - Table data remove করা (structure রেখে)

```sql
-- CREATE examples
CREATE DATABASE company;
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2)
);

-- ALTER examples
ALTER TABLE employees ADD COLUMN department VARCHAR(50);
ALTER TABLE employees MODIFY COLUMN salary DECIMAL(12,2);

-- DROP examples
DROP TABLE employees;
DROP DATABASE company;

-- TRUNCATE
TRUNCATE TABLE employees;  -- All data removed, structure remains
```

### 2.DML (Data Manipulation Language)
Table এর data এর সাথে কাজ করার জন্য।

- **SELECT** - Data retrieve করা
- **INSERT** - নতুন data add করা
- **UPDATE** - Existing data modify করা
- **DELETE** - Data remove করা

```sql
-- INSERT
INSERT INTO employees (id, name, salary) 
VALUES (1, 'রহিম', 50000);

-- SELECT
SELECT name, salary FROM employees WHERE salary > 40000;

-- UPDATE
UPDATE employees SET salary = 55000 WHERE id = 1;

-- DELETE
DELETE FROM employees WHERE id = 1;
```

### 3.DCL (Data Control Language)
Database access এবং permissions control করার জন্য।

- **GRANT** - User permissions দেওয়া
- **REVOKE** - User permissions কেড়ে নেওয়া

```sql
-- GRANT examples
GRANT SELECT, INSERT ON employees TO user1;
GRANT ALL PRIVILEGES ON company.* TO admin_user;

-- REVOKE examples
REVOKE INSERT ON employees FROM user1;
REVOKE ALL PRIVILEGES ON company.* FROM admin_user;
```

### 4.TCL (Transaction Control Language)
Database transactions manage করার জন্য।

- **COMMIT** - Transaction confirm করা
- **ROLLBACK** - Transaction cancel করা
- **SAVEPOINT** - Transaction এর মধ্যে checkpoint তৈরি করা

```sql
-- Transaction example
BEGIN TRANSACTION;

INSERT INTO employees VALUES (1, 'আলী', 45000);
UPDATE employees SET salary = 50000 WHERE id = 2;

-- যদি সব ঠিক থাকে
COMMIT;

-- অথবা problem হলে
ROLLBACK;

-- SAVEPOINT example
BEGIN TRANSACTION;
INSERT INTO employees VALUES (3, 'করিম', 48000);
SAVEPOINT sp1;

UPDATE employees SET salary = 52000 WHERE id = 3;
-- যদি এই update এ problem হয়
ROLLBACK TO SAVEPOINT sp1;  -- শুধু update টা cancel হবে

COMMIT;  -- INSERT টা confirm হবে
```

### Which commands require COMMIT?

#### **Auto-commit Mode:**
বেশিরভাগ database systems এ **auto-commit mode** enable থাকে by default।

**DDL Commands (dialect-dependent):**
```sql
-- MySQL/Oracle-এ অনেক DDL implicit commit করে।
-- PostgreSQL/SQL Server-এ অনেক DDL explicit transaction-এ rollback করা যায়।
CREATE TABLE test (id INT);
DROP TABLE test;             -- Immediate commit
ALTER TABLE users ADD age INT; -- Immediate commit
```

**DML Commands in Auto-commit:**
```sql
-- Auto-commit mode এ এগুলো immediate commit হয়
INSERT INTO users VALUES (1, 'জন');  -- Auto-committed
UPDATE users SET name = 'জেন' WHERE id = 1;  -- Auto-committed
DELETE FROM users WHERE id = 1;  -- Auto-committed
```

#### **Manual Transaction Control:**
```sql
-- Auto-commit disable করে manual control
SET AUTOCOMMIT = 0;  -- MySQL
-- বা
BEGIN TRANSACTION;   -- SQL Server, PostgreSQL

INSERT INTO users VALUES (1, 'রহিম');
UPDATE users SET age = 25 WHERE id = 1;

-- এখন manual commit প্রয়োজন
COMMIT;  -- Changes saved

-- অথবা 
ROLLBACK;  -- Changes cancelled
```

#### **যেসব Commands সবসময় COMMIT প্রয়োজন:**

**Explicit Transaction এর মধ্যে:**
- All DML commands (INSERT, UPDATE, DELETE, SELECT for modification)
- Some DDL commands (database dependent)

**Never Need COMMIT:**
- SELECT statements (read-only)
- Most DDL in auto-commit systems

---

## **13. What is SELECT Statement?**

SELECT statement হল SQL এর সবচেয়ে গুরুত্বপূর্ণ এবং frequently used command। এটি database থেকে data retrieve করার জন্য ব্যবহৃত হয়।

```sql
-- সব columns এবং সব rows
SELECT * FROM employees;

-- নির্দিষ্ট columns
SELECT name, salary FROM employees;

-- Condition সহ
SELECT name, salary 
FROM employees 
WHERE salary > 50000;

-- Sorting সহ
SELECT name, salary 
FROM employees 
ORDER BY salary DESC;
```

### Difference between SELECT * and SELECT column_name?

#### **SELECT * (Select All):**

**Advantages:**
- দ্রুত লেখা যায়
- Development/testing এ convenient
- নতুন columns automatically আসে

```sql
SELECT * FROM employees;
-- Returns: id, name, salary, department, hire_date, etc.
```

**Disadvantages:**
- Unnecessary data transfer
- Network bandwidth waste
- Memory consumption বেশি
- Application break হতে পারে নতুন columns এর কারণে

#### **SELECT column_name (Specific Columns):**

**Advantages:**
- শুধু required data আসে
- Better performance
- Network efficiency
- Predictable result structure
- Security (sensitive columns hide করা যায়)

```sql
SELECT name, salary FROM employees;
-- Returns: শুধু name এবং salary columns
```

#### **Performance Comparison:**
```sql
CREATE TABLE employees (
    id INT,
    name VARCHAR(100),
    salary DECIMAL(10,2),
    department VARCHAR(50),
    hire_date DATE,
    address TEXT,        -- Large text field
    photo BLOB,          -- Large binary field
    notes TEXT           -- Another large field
);
```

**SELECT * Impact:**
```sql
-- 1 million records থেকে সব columns
SELECT * FROM employees;
-- Network transfer: ~500MB
-- Memory usage: ~500MB
-- Time: 15 seconds
```

**Specific Columns:**
```sql
-- শুধু প্রয়োজনীয় columns
SELECT id, name, salary FROM employees;
-- Network transfer: ~50MB
-- Memory usage: ~50MB  
-- Time: 2 seconds
```

### Why is SELECT * considered bad practice?

#### **1. Performance Issues:**

**Example scenario:** E-commerce product table
```sql
-- Bad practice
SELECT * FROM products WHERE category = 'electronics';
-- Returns: id, name, price, description (TEXT), image (BLOB), 
--          specifications (JSON), reviews (TEXT)

-- Good practice  
SELECT id, name, price FROM products WHERE category = 'electronics';
-- শুধু display এর জন্য প্রয়োজনীয় data
```

#### **2. Application Brittleness:**

```sql
-- Original table
CREATE TABLE users (id INT, name VARCHAR(50), email VARCHAR(100));

-- Application code expects this order
SELECT * FROM users;  -- Returns: id, name, email

-- Later, DBA adds a column
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER name;

-- Now SELECT * returns: id, name, phone, email
-- Application breaks! Column order changed
```

#### **3. Security Concerns:**

```sql
-- Table with sensitive data
CREATE TABLE users (
    id INT,
    name VARCHAR(50),
    email VARCHAR(100),
    password_hash VARCHAR(255),    -- Sensitive
    ssn VARCHAR(11),              -- Sensitive
    salary DECIMAL(10,2)          -- Sensitive
);

-- Bad - exposes sensitive data
SELECT * FROM users;

-- Good - only public data
SELECT id, name, email FROM users;
```

#### **4. Network and Memory Waste:**

```sql
-- Bad: Mobile app loading user list
SELECT * FROM users;  -- Gets unnecessary data

-- Good: Mobile app optimization
SELECT id, name, avatar_thumbnail FROM users;
```

#### **5. Index Usage Problems:**

```sql
-- Table with covering index
CREATE INDEX idx_user_search ON users (name, email, active_status);

-- Bad - might not use covering index efficiently
SELECT * FROM users WHERE name = 'রহিম';

-- Good - uses covering index perfectly
SELECT name, email, active_status FROM users WHERE name = 'রহিম';
```

#### **When is SELECT * acceptable?**

**1. Development/Testing:**
```sql
-- Quick data exploration
SELECT * FROM new_table LIMIT 10;
```

**2. Small lookup tables:**
```sql
-- Country codes table (only 3-4 columns)
SELECT * FROM country_codes;
```

**3. Stored procedures with specific use:**
```sql
-- When you actually need all columns
CREATE PROCEDURE backup_user_data(user_id INT)
BEGIN
    SELECT * FROM users WHERE id = user_id;
END
```

---

## **14. Difference between DELETE, TRUNCATE, DROP?**

এই তিনটি command database থেকে data remove করার জন্য ব্যবহৃত হয়, কিন্তু তাদের behavior এবং impact ভিন্ন।

### DELETE Command

DELETE command table থেকে specific rows বা সব rows remove করে, কিন্তু table structure intact রাখে।


```sql
-- Specific rows delete
DELETE FROM employees WHERE salary < 30000;

-- সব rows delete (table structure থাকবে)
DELETE FROM employees;

-- Condition সহ complex delete
DELETE FROM orders 
WHERE order_date < '2020-01-01' 
AND status = 'cancelled';
```

- Row-by-row operation
- WHERE clause support করে
- Transaction log এ record হয়
- ROLLBACK করা যায়
- Triggers fire হয়
- Identity/Auto-increment reset হয় না

### TRUNCATE Command

TRUNCATE command table এর সব data remove করে দেয় কিন্তু structure রেখে দেয়।

```sql
TRUNCATE TABLE employees;
```
- সব rows একসাথে remove
- WHERE clause support করে না
- Minimal transaction logging
- Much faster than DELETE
- Identity/Auto-increment reset হয়
- Triggers fire হয় না (most databases)

### DROP Command

DROP command পুরো table বা database remove করে দেয় - data এবং structure দুইই।

```sql
-- Table drop
DROP TABLE employees;

-- Database drop
DROP DATABASE company;

-- Index drop
DROP INDEX idx_employee_name ON employees;
```

- Structure এবং data দুইই remove
- Associated indexes, constraints, triggers সব remove
- Dictionary থেকে table definition remove
- Storage space immediately release

### Comparison Table:

| বিষয় | DELETE | TRUNCATE | DROP |
|-------|---------|----------|------|
| **Data Remove** | ✓ (Selected rows) | ✓ (All rows) | ✓ (All rows) |
| **Structure Remove** | ✗ | ✗ | ✓ |
| **WHERE Clause** | ✓ | ✗ | ✗ |
| **Speed** | Slow | Very Fast | Fast |
| **Rollback** | ✓ | Database dependent | Database dependent |
| **Identity Reset** | ✗ | ✓ | ✓ |
| **Triggers** | ✓ Fire | ✗ Don't fire | ✗ Don't fire |
| **Transaction Log** | Full logging | Minimal logging | Minimal logging |

### Which is faster and why?

#### **Performance Ranking:** TRUNCATE > DROP > DELETE

#### **TRUNCATE (Fastest):**
```sql
-- 1 million records table
TRUNCATE TABLE large_table;
-- Time: ~0.1 seconds
```

**কেন fastest:**
- Page-level operation (row-by-row না)
- Minimal transaction logging
- No individual row locks
- Simply deallocates data pages

#### **DROP (Fast):**
```sql
DROP TABLE large_table;
-- Time: ~0.5 seconds
```

**Fast কারণ:**
- Metadata operation primarily
- Storage space immediately released
- No row-by-row processing

#### **DELETE (Slowest):**
```sql
DELETE FROM large_table;  -- 1 million records
-- Time: ~30 seconds to 5 minutes
```

**Slow কারণ:**
- Row-by-row operation
- Full transaction logging
- Index maintenance for each row
- Lock management overhead
- Trigger execution

### Which operations can be rolled back?

#### **DELETE - Can be Rolled Back:**
```sql
BEGIN TRANSACTION;

DELETE FROM employees WHERE department = 'Marketing';
-- 50 rows deleted

-- Oops! Wrong department
ROLLBACK;  -- ✓ Data restored

-- Check - data is back
SELECT COUNT(*) FROM employees;  -- Original count restored
```

#### **TRUNCATE - Database Dependent:**

**MySQL:**
```sql
START TRANSACTION;
TRUNCATE TABLE employees;  -- Error! Can't use in transaction
```

**SQL Server:**
```sql
BEGIN TRANSACTION;
TRUNCATE TABLE employees;
ROLLBACK;  -- ✓ Can be rolled back
```

**PostgreSQL:**
```sql
BEGIN;
TRUNCATE TABLE employees;
ROLLBACK;  -- ✓ Can be rolled back
```

#### **DROP - Database Dependent:**

**MySQL/Oracle-এর অনেক DDL operation:**
```sql
BEGIN TRANSACTION;
DROP TABLE employees;
ROLLBACK;  -- ✗ Cannot rollback, table is gone
```

**Advanced Databases (with versioning):**
```sql
-- Oracle with Flashback
DROP TABLE employees;
-- Later restore
FLASHBACK TABLE employees TO BEFORE DROP;
```

### What happens to indexes when you TRUNCATE?

#### **Index Structure:**
যখন TRUNCATE করা হয়:

**Indexes থেকে যায়:**
- Index definitions remain
- Index structure preserved  
- But all index entries removed

```sql
-- Before TRUNCATE
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    department VARCHAR(50)
);

CREATE INDEX idx_department ON employees (department);
CREATE INDEX idx_name ON employees (name);

-- Insert data
INSERT INTO employees VALUES 
(1, 'রহিম', 'rahim@company.com', 'IT'),
(2, 'করিম', 'karim@company.com', 'HR');

-- Check indexes
SHOW INDEX FROM employees;
-- Shows: PRIMARY, email (UNIQUE), idx_department, idx_name

-- TRUNCATE
TRUNCATE TABLE employees;

-- Check indexes after TRUNCATE
SHOW INDEX FROM employees;
-- Shows: Same indexes still exist!

-- But data is gone
SELECT * FROM employees;  -- Empty result

-- Indexes will work for new data
INSERT INTO employees VALUES (1, 'নতুন ইউজার', 'new@company.com', 'Sales');
-- Indexes automatically updated
```

#### **Index Statistics Reset:**
```sql
-- Before TRUNCATE - index statistics
ANALYZE TABLE employees;
-- Shows row count, cardinality, etc.

TRUNCATE TABLE employees;

-- After TRUNCATE - statistics reset
ANALYZE TABLE employees;
-- Shows 0 rows, no cardinality data
```

#### **Performance Benefit:**
```sql
-- New data insert after TRUNCATE
INSERT INTO employees (name, email, department) 
VALUES ('আলী', 'ali@company.com', 'Finance');

-- Index immediately available and efficient
SELECT * FROM employees WHERE department = 'Finance';
-- Uses idx_department index efficiently
```

**Index Rebuild না লাগে:** TRUNCATE এর পর indexes rebuild করার প্রয়োজন নেই, কারণ structure intact থাকে।

---

## **15. What are Constraints in SQL?**

SQL constraints হল rules যা database table এর data এর integrity এবং accuracy maintain করার জন্য ব্যবহৃত হয়। এগুলো database level এ enforce হয় এবং invalid data entry prevent করে।

### Types of Constraints:

#### **1. PRIMARY KEY Constraint**
Table এর each row কে uniquely identify করে।

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- অথবা composite primary key
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);
```

#### **2. FOREIGN KEY Constraint**
দুই table এর মধ্যে relationship establish করে।

```sql
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50)
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
```

#### **3. UNIQUE Constraint**
Column এর values unique রাখে (কিন্তু NULL allow করে)।

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE
);
```

#### **4. NOT NULL Constraint**
Column এ NULL values prevent করে।

```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT  -- NULL allowed
);
```

#### **5. CHECK Constraint**
Custom conditions enforce করে।

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 65),
    salary DECIMAL(10,2) CHECK (salary > 0),
    email VARCHAR(100) CHECK (email LIKE '%@%.%')
);
```

#### **6. DEFAULT Constraint**
Column এর default value set করে।

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'PENDING',
    total DECIMAL(10,2) DEFAULT 0.00
);
```

### NOT NULL vs CHECK Constraint?

#### **NOT NULL Constraint:**

**Purpose:** Column এ NULL values prevent করা।

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Valid inserts
INSERT INTO users VALUES (1, 'রহিম', 'rahim@email.com');

-- Invalid inserts (will fail)
INSERT INTO users VALUES (2, NULL, 'karim@email.com');  -- Error!
INSERT INTO users VALUES (3, 'করিম', NULL);  -- Error!
```

**Characteristics:**
- Simple NULL check only
- Very fast validation
- Cannot be conditional
- Standard across all databases

#### **CHECK Constraint:**

**Purpose:** Complex business rules enforce করা।

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age BETWEEN 18 AND 65),
    salary DECIMAL(10,2) CHECK (salary > 0),
    email VARCHAR(100) CHECK (email LIKE '%@%.%')
);

-- Valid insert
INSERT INTO employees VALUES (1, 'আলী', 25, 50000, 'ali@company.com');

-- Invalid inserts (will fail)
INSERT INTO employees VALUES (2, 'করিম', 17, 45000, 'karim@company.com');  -- Age < 18
INSERT INTO employees VALUES (3, 'রহিম', 30, -5000, 'rahim@company.com');  -- Negative salary
INSERT INTO employees VALUES (4, 'ফাতেমা', 28, 55000, 'invalid-email');  -- Invalid email
```

#### **Comparison:**

| বিষয় | NOT NULL | CHECK |
|-------|----------|-------|
| **Purpose** | শুধু NULL prevent | Complex validation |
| **Performance** | Very fast | Slower (condition evaluation) |
| **Flexibility** | Fixed rule | Customizable conditions |
| **Multiple conditions** | No | Yes |
| **Business logic** | No | Yes |


### Can you have multiple CHECK constraints on same column?

**হ্যাঁ, একই column এ multiple CHECK constraints থাকতে পারে।**

#### **Multiple Named Constraints:**

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    salary DECIMAL(10,2) 
        CONSTRAINT chk_salary_positive CHECK (salary > 0)
        CONSTRAINT chk_salary_reasonable CHECK (salary <= 1000000),
    age INT 
        CONSTRAINT chk_age_minimum CHECK (age >= 18)
        CONSTRAINT chk_age_maximum CHECK (age <= 65)
        CONSTRAINT chk_age_valid CHECK (age IS NOT NULL)
);
```

#### **Single Constraint with Multiple Conditions:**

```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    price DECIMAL(10,2) CHECK (price > 0 AND price <= 999999),
    stock INT CHECK (stock >= 0 AND stock <= 10000)
);
```

### What is DEFAULT Constraint?

DEFAULT constraint একটি column এর জন্য default value specify করে যখন INSERT statement এ সেই column এর value provide করা হয় না।

#### **Basic Syntax:**

```sql
CREATE TABLE table_name (
    column_name datatype DEFAULT default_value
);
```
