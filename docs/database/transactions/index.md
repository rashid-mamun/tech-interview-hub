---
sidebar_position: 5
title: ''
---

## **51. What is a transaction?**

Transaction হল database operations এর একটি logical unit যা complete হতে হবে as a whole অথবা একেবারেই হবে না। এটি database consistency এবং integrity maintain করার জন্য অত্যন্ত গুরুত্বপূর্ণ।

**Technical definition:** Transaction হল এক বা একাধিক SQL statements এর একটি sequence যা একসাথে execute হয় এবং সফল হলে সব changes permanent হয়, আর fail হলে সব changes undo হয়ে যায়।

### Why are transactions important?

Transactions গুরুত্বপূর্ণ কয়েকটি কারণে:

**1. Data Consistency:**
```sql
-- Bank transfer example
BEGIN TRANSACTION
    UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';  -- Debit
    UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A002';  -- Credit
COMMIT;
```
যদি first UPDATE successful হয় কিন্তু second UPDATE fail হয়, transaction rollback হবে। এতে data inconsistent হবে না।

**2. Business Logic Protection:**
```sql
-- E-commerce order processing
BEGIN TRANSACTION
    INSERT INTO orders (customer_id, total_amount) VALUES (123, 500);
    UPDATE inventory SET stock = stock - 1 WHERE product_id = 'P001';
    INSERT INTO order_items (order_id, product_id, quantity) VALUES (LAST_INSERT_ID(), 'P001', 1);
    
    -- If any operation fails, entire order is cancelled
COMMIT;
```

**3. Multi-user Environment:**
- একই সময়ে multiple users যখন same data modify করে
- Transaction isolation প্রদান করে
- Data corruption prevent করে

### What makes a transaction atomic?

**Atomicity** হল ACID properties এর মধ্যে প্রথমটি। এর মানে transaction এর সব operations either completely successful হবে অথবা completely fail হবে।

**All-or-Nothing Principle:**
```sql
-- Atomic transaction example
BEGIN TRANSACTION
    DELETE FROM order_items WHERE order_id = 12345;     -- Step 1
    DELETE FROM payments WHERE order_id = 12345;        -- Step 2  
    DELETE FROM orders WHERE order_id = 12345;          -- Step 3
    
    -- If Step 2 fails, Step 1 will be rolled back automatically
COMMIT;
```

**Implementation Mechanisms:**
- **Write-Ahead Logging (WAL):** Changes log এ লেখা হয় before actual data modification
- **Shadow Paging:** Original data copy রাখা হয় until transaction commits
- **Rollback Segments:** Undo information store করা হয় automatic rollback এর জন্য

---

## **52. What is COMMIT and ROLLBACK?**

**COMMIT** এবং **ROLLBACK** হল transaction control করার জন্য দুটি fundamental commands।

### COMMIT Statement:

**COMMIT** transaction এর সব changes কে permanent করে database এ।

```sql
BEGIN TRANSACTION
    INSERT INTO employees (name, department, salary) VALUES ('রহিম', 'IT', 50000);
    UPDATE employees SET salary = salary * 1.1 WHERE department = 'IT';
COMMIT;  -- এখন সব changes permanent
```

**COMMIT এর পরে কী হয়:**
- সব changes physical storage এ write হয়
- Transaction locks release হয়
- Other transactions এখন এই changes দেখতে পাবে
- Rollback আর possible না

### ROLLBACK Statement:

**ROLLBACK** transaction এর সব changes কে undo করে দেয়।

```sql
BEGIN TRANSACTION
    DELETE FROM products WHERE category = 'Electronics';
    -- Oops! এটা ভুল হয়েছে
ROLLBACK;  -- সব deletions undo হবে
```

**ROLLBACK এর পরে কী হয়:**
- সব uncommitted changes undo হয়
- Database আগের state এ ফিরে যায়
- Transaction locks release হয়
- Memory থেকে temporary changes clear হয়

### Can you rollback after commit?

**না, COMMIT এর পরে ROLLBACK করা যায় না।** COMMIT একবার execute হলে changes permanent হয়ে যায়।

```sql
BEGIN TRANSACTION
    UPDATE products SET price = price * 0.5;  -- 50% discount
COMMIT;  -- Changes are now permanent

ROLLBACK;  -- ❌ This will give error: "No active transaction to rollback"
```

**তবে alternatives আছে:**

**1. Explicit Reverse Operations:**
```sql
-- Manual undo through reverse operations
UPDATE products SET price = price * 2;  -- Reverse the 50% discount
```

**2. Database Backup Recovery:**
```sql
-- Restore from backup (if available)
RESTORE DATABASE mydb FROM BACKUP_FILE = 'backup_before_changes.bak';
```

**3. Point-in-Time Recovery:**
```sql
-- MySQL example
mysqlbinlog --start-datetime="2023-12-01 10:00:00" 
           --stop-datetime="2023-12-01 09:59:59" 
           binlog_file | mysql -u root -p
```

### What is auto-commit mode?

**Auto-commit mode** হল database এর একটি setting যেখানে প্রতিটি individual SQL statement automatically commit হয়ে যায়।

**Auto-commit ON (Default in most databases):**
```sql
-- Each statement commits automatically
INSERT INTO users (name) VALUES ('আলী');      -- Automatically committed
UPDATE users SET name = 'আলী আহমেদ' WHERE id = 1;  -- Automatically committed
DELETE FROM users WHERE id = 1;                -- Automatically committed
```

**Auto-commit OFF:**
```sql
-- Disable auto-commit
SET autocommit = 0;  -- MySQL
-- SET AUTOCOMMIT OFF;  -- Oracle/PostgreSQL

INSERT INTO users (name) VALUES ('করিম');
UPDATE users SET age = 25 WHERE name = 'করিম';
-- Changes are not permanent yet

COMMIT;  -- Now both changes are committed together
```

**When to use Auto-commit OFF:**
- Complex business operations
- Multiple related changes
- Error handling scenarios
- Performance optimization (batch operations)

**Example: Bank Transfer with Auto-commit OFF:**
```sql
SET autocommit = 0;

BEGIN TRANSACTION;
    -- Deduct from source account  
    UPDATE bank_accounts 
    SET balance = balance - 5000 
    WHERE account_number = 'ACC001';
    
    -- Check if sufficient balance
    IF (SELECT balance FROM bank_accounts WHERE account_number = 'ACC001') < 0 THEN
        ROLLBACK;
        SELECT 'Insufficient funds' as error_message;
    ELSE
        -- Credit to destination account
        UPDATE bank_accounts 
        SET balance = balance + 5000 
        WHERE account_number = 'ACC002';
        
        COMMIT;
        SELECT 'Transfer successful' as success_message;
    END IF;
```

---

## **53. What is SAVEPOINT in SQL?**

**SAVEPOINT** হল transaction এর মধ্যে একটি intermediate checkpoint তৈরি করার mechanism। এটি partial rollback করার সুবিধা দেয়।

### Basic SAVEPOINT Syntax:

```sql
BEGIN TRANSACTION;
    -- Some operations
    SAVEPOINT savepoint_name;
    -- More operations
    ROLLBACK TO savepoint_name;  -- Rollback to savepoint only
    -- Continue with transaction
COMMIT;
```

### When is SAVEPOINT used?

**1. Complex Business Logic:**
```sql
BEGIN TRANSACTION;
    -- Create customer
    INSERT INTO customers (name, email) VALUES ('রহিম আহমেদ', 'rahim@example.com');
    SAVEPOINT after_customer_creation;
    
    -- Try to create premium subscription
    INSERT INTO subscriptions (customer_id, plan_type, amount) 
    VALUES (LAST_INSERT_ID(), 'PREMIUM', 999);
    
    -- Check if payment processing successful
    DECLARE payment_status VARCHAR(20);
    SET payment_status = process_payment(999);  -- Custom function
    
    IF payment_status != 'SUCCESS' THEN
        -- Rollback subscription creation but keep customer
        ROLLBACK TO after_customer_creation;
        
        -- Create basic subscription instead
        INSERT INTO subscriptions (customer_id, plan_type, amount) 
        VALUES (LAST_INSERT_ID(), 'BASIC', 99);
    END IF;
    
COMMIT;
```

**2. Error Recovery:**
```sql
BEGIN TRANSACTION;
    -- Bulk data import
    INSERT INTO products SELECT * FROM staging_products WHERE category = 'Electronics';
    SAVEPOINT electronics_imported;
    
    INSERT INTO products SELECT * FROM staging_products WHERE category = 'Books';
    SAVEPOINT books_imported;
    
    INSERT INTO products SELECT * FROM staging_products WHERE category = 'Clothing';
    -- If clothing import fails due to constraint violation
    -- ROLLBACK TO books_imported;  -- Keep electronics and books
    
COMMIT;
```

**3. Nested Operations:**
```sql
BEGIN TRANSACTION;
    -- Main order creation
    INSERT INTO orders (customer_id, order_date) VALUES (123, NOW());
    SAVEPOINT main_order_created;
    
    -- Try to add each item
    DECLARE item_counter INT DEFAULT 1;
    WHILE item_counter <= 5 DO
        SAVEPOINT before_item_add;
        
        INSERT INTO order_items (order_id, product_id, quantity) 
        VALUES (LAST_INSERT_ID(), item_counter, 1);
        
        -- Check stock availability
        IF (SELECT stock FROM products WHERE id = item_counter) < 1 THEN
            ROLLBACK TO before_item_add;  -- Skip this item
        END IF;
        
        SET item_counter = item_counter + 1;
    END WHILE;
    
COMMIT;
```

### Can you have nested savepoints?

**হ্যাঁ, nested savepoints support করা হয় কিন্তু implementation database specific।**

**MySQL Example:**
```sql
BEGIN TRANSACTION;
    INSERT INTO audit_log (action) VALUES ('Transaction started');
    SAVEPOINT level_1;
    
        INSERT INTO users (name) VALUES ('User 1');
        SAVEPOINT level_2;
        
            INSERT INTO user_profiles (user_id, bio) VALUES (LAST_INSERT_ID(), 'Bio 1');
            SAVEPOINT level_3;
            
                INSERT INTO user_settings (user_id, theme) VALUES (LAST_INSERT_ID(), 'dark');
                -- যদি এখানে error হয় তাহলে level_3 এ rollback করতে পারি
                
            -- ROLLBACK TO level_3;  -- শুধু settings insertion undo
        -- ROLLBACK TO level_2;      -- Profile এবং settings undo
    -- ROLLBACK TO level_1;          -- User, profile, settings সব undo
    
COMMIT;
```

**PostgreSQL Example with Subtransactions:**
```sql
BEGIN;
    INSERT INTO parent_table (name) VALUES ('Parent 1');
    SAVEPOINT sp1;
    
    BEGIN;  -- Subtransaction
        INSERT INTO child_table (parent_id, name) VALUES (currval('parent_table_id_seq'), 'Child 1');
        SAVEPOINT sp2;
        
        BEGIN;  -- Nested subtransaction
            INSERT INTO grandchild_table (child_id, name) VALUES (currval('child_table_id_seq'), 'Grandchild 1');
            -- ROLLBACK TO sp2;  -- Possible
        END;
        
    EXCEPTION
        WHEN others THEN
            ROLLBACK TO sp1;  -- Rollback to outer savepoint
    END;
    
COMMIT;
```

**Important Notes about Nested Savepoints:**
- Savepoint names must be unique within same transaction
- Rolling back to outer savepoint automatically releases inner savepoints
- Memory usage increases with nested savepoints
- Performance impact grows with nesting depth

**Best Practice Example:**
```sql
DELIMITER //
CREATE PROCEDURE ProcessComplexOrder(IN customer_id INT, IN order_data JSON)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
        INSERT INTO orders (customer_id, status) VALUES (customer_id, 'PROCESSING');
        SAVEPOINT order_created;
        
        -- Process each item in order
        CALL ProcessOrderItems(LAST_INSERT_ID(), order_data);
        SAVEPOINT items_processed;
        
        -- Apply discounts
        CALL ApplyDiscounts(LAST_INSERT_ID());
        SAVEPOINT discounts_applied;
        
        -- Process payment
        IF NOT ProcessPayment(LAST_INSERT_ID()) THEN
            ROLLBACK TO discounts_applied;  -- Keep order but remove payment
            UPDATE orders SET status = 'PAYMENT_FAILED' WHERE id = LAST_INSERT_ID();
        ELSE
            UPDATE orders SET status = 'CONFIRMED' WHERE id = LAST_INSERT_ID();
        END IF;
        
    COMMIT;
END //
DELIMITER ;
```

---

## **54. What are isolation levels?**

**Isolation levels** হল database transaction এর concurrency এবং consistency এর মধ্যে balance করার জন্য different levels of isolation প্রদান করে। এটি ACID properties এর 'I' (Isolation) implement করে।

### Four Standard Isolation Levels:

#### **1. READ UNCOMMITTED (Level 0):**

**সবচেয়ে কম isolation level।** এতে uncommitted changes অন্য transactions দেখতে পায়।

```sql
-- Session 1
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
UPDATE products SET price = 100 WHERE id = 1;
-- Still not committed

-- Session 2  
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT price FROM products WHERE id = 1;  -- Shows 100 (uncommitted value)
```

**Problems it allows:**
- ✅ Dirty Reads
- ✅ Non-repeatable Reads  
- ✅ Phantom Reads

**Use cases:** 
- Reporting systems যেখানে approximate data acceptable
- High-performance scenarios যেখানে data accuracy less critical

#### **2. READ COMMITTED (Level 1):**

**Most databases এর default level।** শুধুমাত্র committed data পড়া যায়।

```sql
-- Session 1
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
UPDATE products SET price = 100 WHERE id = 1;
-- Not committed yet

-- Session 2
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT price FROM products WHERE id = 1;  -- Shows old value (50)

-- Session 1 continues
COMMIT;

-- Session 2 reads again
SELECT price FROM products WHERE id = 1;  -- Now shows 100
```

**Problems it prevents:**
- ❌ Dirty Reads (prevented)
- ✅ Non-repeatable Reads (allowed)
- ✅ Phantom Reads (allowed)

#### **3. REPEATABLE READ (Level 2):**

**Same data multiple times পড়লে same result পাওয়া যায়।**

```sql
-- Session 1  
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT price FROM products WHERE id = 1;  -- Returns 50

-- Session 2
UPDATE products SET price = 100 WHERE id = 1;
COMMIT;

-- Session 1 continues
SELECT price FROM products WHERE id = 1;  -- Still returns 50 (repeatable)
COMMIT;
```

**Problems it prevents:**
- ❌ Dirty Reads (prevented)
- ❌ Non-repeatable Reads (prevented)
- ✅ Phantom Reads (allowed in some databases)

#### **4. SERIALIZABLE (Level 3):**

**Highest isolation level।** Transactions একটার পর একটা execute হয়েছে এমন guarantee দেয়।

```sql
-- Session 1
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT COUNT(*) FROM products WHERE category = 'Electronics';  -- Returns 10

-- Session 2
INSERT INTO products (name, category) VALUES ('New Phone', 'Electronics');
-- This will wait for Session 1 to complete

-- Session 1 continues  
SELECT COUNT(*) FROM products WHERE category = 'Electronics';  -- Still returns 10
COMMIT;

-- Now Session 2 can complete
COMMIT;
```

**Problems it prevents:**
- ❌ Dirty Reads (prevented)
- ❌ Non-repeatable Reads (prevented)  
- ❌ Phantom Reads (prevented)

### Which isolation level does your database use by default?

**Database-wise Default Isolation Levels:**

| Database | Default Level | Can be Changed |
|----------|--------------|----------------|
| **MySQL InnoDB** | READ COMMITTED | ✅ Yes |
| **PostgreSQL** | READ COMMITTED | ✅ Yes |
| **SQL Server** | READ COMMITTED | ✅ Yes |
| **Oracle** | READ COMMITTED | ✅ Yes |
| **SQLite** | SERIALIZABLE | ❌ Limited |

**How to Check Current Isolation Level:**

```sql
-- MySQL
SELECT @@transaction_isolation;
-- or
SHOW VARIABLES LIKE 'transaction_isolation';

-- PostgreSQL  
SHOW transaction_isolation;

-- SQL Server
SELECT 
    CASE transaction_isolation_level
        WHEN 1 THEN 'READ UNCOMMITTED'
        WHEN 2 THEN 'READ COMMITTED'  
        WHEN 3 THEN 'REPEATABLE READ'
        WHEN 4 THEN 'SERIALIZABLE'
    END as isolation_level
FROM sys.dm_exec_sessions 
WHERE session_id = @@SPID;

-- Oracle
SELECT s.sid, s.serial#, s.username, s.isolation_level
FROM v$session s
WHERE s.sid = SYS_CONTEXT('USERENV', 'SID');
```

**How to Change Isolation Level:**

```sql
-- For current session
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- For next transaction only
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Global setting (requires privileges)
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

### Real-world Examples:

**E-commerce Application:**
```sql
-- Product inventory management
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
    DECLARE @current_stock INT;
    SELECT @current_stock = stock FROM products WHERE id = 123;
    
    IF @current_stock >= 5 THEN
        UPDATE products SET stock = stock - 5 WHERE id = 123;
        INSERT INTO order_items (product_id, quantity) VALUES (123, 5);
    END IF;
COMMIT;
```

**Banking System:**
```sql
-- Account balance transfer
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
    DECLARE @source_balance DECIMAL(10,2);
    SELECT @source_balance = balance FROM accounts WHERE account_id = 'A001';
    
    IF @source_balance >= 1000 THEN
        UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
        UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A002';
        
        INSERT INTO transaction_log (from_account, to_account, amount) 
        VALUES ('A001', 'A002', 1000);
    END IF;
COMMIT;
```

**Choosing the Right Level:**

| Scenario | Recommended Level | Reason |
|----------|------------------|---------|
| **Financial Transactions** | SERIALIZABLE | Data accuracy critical |
| **E-commerce Orders** | REPEATABLE READ | Prevent inventory overselling |
| **Reporting/Analytics** | READ COMMITTED | Balance between performance and accuracy |
| **High-traffic Reads** | READ UNCOMMITTED | Performance over accuracy |

---

## **55. What is dirty read?**

**Dirty read** হল এমন একটি concurrency problem যেখানে একটি transaction অন্য transaction এর uncommitted (dirty) changes পড়তে পারে। এটি data inconsistency এর কারণ হতে পারে।

### Dirty Read Example:

```sql
-- Example: Bank account scenario

-- Session 1 (Transaction A)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 5000 WHERE account_id = 'A001';
-- Balance changed from 1000 to 6000, but not committed yet
-- ... some processing time ...

-- Session 2 (Transaction B) - at the same time
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A001';  
-- Reads 6000 (dirty/uncommitted value)

-- Based on this dirty read, might make wrong decision
IF balance >= 5000 THEN
    -- Approve a large withdrawal thinking balance is 6000
    INSERT INTO withdrawals (account_id, amount) VALUES ('A001', 4000);
END IF;
COMMIT;

-- Session 1 continues
-- Suppose there was an error and we need to rollback
ROLLBACK;  -- Balance goes back to 1000

-- Now we have a problem:
-- Transaction B approved 4000 withdrawal based on dirty read of 6000
-- But actual balance is only 1000!
```

### Real-world Problems:

**1. E-commerce Inventory:**
```sql
-- Session 1: Processing return
BEGIN TRANSACTION;
UPDATE products SET stock = stock + 10 WHERE product_id = 'P001';
-- Stock temporarily shows 20 (was 10), but not committed

-- Session 2: Customer trying to buy
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT stock FROM products WHERE product_id = 'P001';  -- Reads 20 (dirty)

-- Customer sees 20 items available and tries to buy 15
INSERT INTO orders (product_id, quantity) VALUES ('P001', 15);

-- Session 1 rollbacks due to some validation error
ROLLBACK;  -- Stock goes back to 10

-- Now we oversold! Customer ordered 15 but only 10 available
```

**2. Financial Reporting:**
```sql
-- Session 1: End-of-day processing  
BEGIN TRANSACTION;
UPDATE daily_sales SET total_amount = 50000 WHERE date = '2023-12-01';
-- Temporarily updated, processing continues...

-- Session 2: Generate report
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT SUM(total_amount) FROM daily_sales WHERE date = '2023-12-01';
-- Report shows incorrect total based on uncommitted data

-- Session 1 rollbacks due to error
ROLLBACK;

-- Report sent to management with wrong figures!
```

### How can dirty reads be avoided?

**1. Use Higher Isolation Levels:**

```sql
-- READ COMMITTED prevents dirty reads
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A001';  
-- Will wait for other transaction to commit or will see committed value only
COMMIT;
```

**2. Explicit Locking:**

```sql
-- Shared lock to prevent reading uncommitted data
BEGIN TRANSACTION;
SELECT balance FROM accounts WITH (HOLDLOCK, ROWLOCK) WHERE account_id = 'A001';
-- This ensures we read only committed data
COMMIT;
```

**3. Application-level Coordination:**

```sql
-- Use application flags/status
UPDATE accounts 
SET balance = balance + 5000, 
    status = 'PROCESSING' 
WHERE account_id = 'A001';

-- Other transactions check status
SELECT balance FROM accounts 
WHERE account_id = 'A001' AND status = 'ACTIVE';
-- Returns nothing if account is being processed
```

### Which isolation levels prevent dirty reads?

| Isolation Level | Prevents Dirty Reads | Example |
|----------------|---------------------|---------|
| **READ UNCOMMITTED** | ❌ No | ```SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;``` |
| **READ COMMITTED** | ✅ Yes | ```SET TRANSACTION ISOLATION LEVEL READ COMMITTED;``` |
| **REPEATABLE READ** | ✅ Yes | ```SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;``` |
| **SERIALIZABLE** | ✅ Yes | ```SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;``` |

**Demonstration:**

```sql
-- Setup test data
CREATE TABLE test_account (id INT, balance DECIMAL(10,2));
INSERT INTO test_account VALUES (1, 1000);

-- Session 1: READ UNCOMMITTED (allows dirty reads)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
    -- Session 2 makes uncommitted change here
    SELECT balance FROM test_account WHERE id = 1;  -- Sees uncommitted value
COMMIT;

-- Session 1: READ COMMITTED (prevents dirty reads)  
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
    -- Session 2 makes uncommitted change here
    SELECT balance FROM test_account WHERE id = 1;  -- Sees only committed value
COMMIT;
```

### Performance vs Consistency Trade-off:

**READ UNCOMMITTED (Allows Dirty Reads):**
- ✅ **Pros:** Highest performance, no locking overhead
- ❌ **Cons:** Data inconsistency, unreliable results

**READ COMMITTED (Prevents Dirty Reads):**
- ✅ **Pros:** Good balance of performance and consistency
- ❌ **Cons:** Slight performance overhead due to locking

**Best Practice Recommendations:**

```sql
-- For financial/critical data - use higher isolation
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT account_balance FROM bank_accounts WHERE account_id = @account_id;

-- For reporting/analytics where approximate data is OK
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;  
SELECT COUNT(*) FROM large_analytics_table WHERE date >= @start_date;

-- For real-time dashboards with millions of records
-- READ UNCOMMITTED might be acceptable for performance
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT SUM(sales_amount) FROM daily_sales_summary;
```

---

## **56. What is non-repeatable read?**

**Non-repeatable read** হল এমন একটি concurrency problem যেখানে একই transaction এর মধ্যে same data একাধিকবার read করলে different results পাওয়া যায়। এটি ঘটে যখন অন্য transaction মাঝখানে data modify করে commit করে দেয়।

### Non-repeatable Read Example:

```sql
-- Session 1 (Transaction A)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;

-- First read
SELECT balance FROM accounts WHERE account_id = 'A001';  -- Returns 1000

-- ... some processing or user interaction time ...

-- Session 2 (Transaction B) - executes during Session 1's processing
BEGIN TRANSACTION;
UPDATE accounts SET balance = 1500 WHERE account_id = 'A001';
COMMIT;  -- Changes are now permanent

-- Session 1 continues with second read
SELECT balance FROM accounts WHERE account_id = 'A001';  -- Returns 1500 (different!)

-- This is non-repeatable read - same query gave different results
COMMIT;
```

### Example in real-world banking scenario:

**ATM Transaction Scenario:**
```sql
-- ATM Session processing withdrawal
BEGIN TRANSACTION;

-- Step 1: Check balance (user inserted card)
DECLARE @balance DECIMAL(10,2);
SELECT @balance = balance FROM accounts WHERE account_id = 'A001';  
-- Shows $1000

-- User sees balance: $1000 on ATM screen
-- User decides to withdraw $800

-- Meanwhile, salary deposit happens in another system
-- Background Process:
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 2000 WHERE account_id = 'A001';  -- Salary deposit
COMMIT;  -- Balance is now $3000

-- ATM continues processing withdrawal
-- Step 2: Re-check balance before withdrawal (security check)
SELECT @balance = balance FROM accounts WHERE account_id = 'A001';
-- Now shows $3000 (non-repeatable read!)

-- ATM logic gets confused:
-- Initially showed $1000, now internal check shows $3000
-- This inconsistency can cause system errors

IF @balance >= 800 THEN
    UPDATE accounts SET balance = balance - 800 WHERE account_id = 'A001';
    -- Dispense cash
END IF;

COMMIT;
```

**Problems this causes:**
- User saw $1000 balance initially
- System internal checks see $3000
- Confusion in business logic
- Potential for incorrect decisions

### How is it different from dirty read?

| Aspect | Dirty Read | Non-repeatable Read |
|--------|------------|-------------------|
| **What is read** | Uncommitted (dirty) data | Committed data (both times) |
| **When occurs** | Reading uncommitted changes | Reading different committed values |
| **Data validity** | Invalid data (might rollback) | Valid data (both reads are correct) |
| **Problem** | Reading data that might not exist | Reading inconsistent data within same transaction |

**Dirty Read Example:**
```sql
-- Session 1
BEGIN TRANSACTION;
UPDATE products SET price = 100 WHERE id = 1;  -- Not committed

-- Session 2  
SELECT price FROM products WHERE id = 1;  -- Reads 100 (dirty/uncommitted)

-- Session 1
ROLLBACK;  -- Price goes back to original value

-- Session 2 read invalid data that was rolled back
```

**Non-repeatable Read Example:**
```sql
-- Session 1
BEGIN TRANSACTION;
SELECT price FROM products WHERE id = 1;  -- Reads 50 (committed data)

-- Session 2
UPDATE products SET price = 100 WHERE id = 1;
COMMIT;  -- Now committed

-- Session 1 continues
SELECT price FROM products WHERE id = 1;  -- Reads 100 (committed data)
-- Both reads were valid, but different within same transaction
```

### Real-world Banking Scenarios:

**1. Loan Approval Process:**
```sql
-- Loan officer reviewing application
BEGIN TRANSACTION;

-- Initial credit check
SELECT credit_score, debt_ratio FROM customers WHERE customer_id = 12345;
-- Shows: credit_score = 750, debt_ratio = 0.3

-- Officer reviews documents, makes phone calls (takes 30 minutes)

-- Meanwhile, customer makes a large purchase on credit card
-- Another system updates:
UPDATE customers SET debt_ratio = 0.6 WHERE customer_id = 12345;

-- Officer does final verification before approval
SELECT credit_score, debt_ratio FROM customers WHERE customer_id = 12345;
-- Shows: credit_score = 750, debt_ratio = 0.6 (non-repeatable read!)

-- Decision logic gets inconsistent data:
-- Initial assessment was based on 0.3 debt ratio (good)
-- Final check shows 0.6 debt ratio (risky)
COMMIT;
```

**2. Investment Portfolio Rebalancing:**
```sql
-- Portfolio manager rebalancing investments
BEGIN TRANSACTION;

-- Check current portfolio value
SELECT SUM(shares * current_price) as total_value 
FROM portfolio_holdings 
WHERE customer_id = 'C001';  -- Shows $100,000

-- Calculate rebalancing strategy based on $100,000

-- Meanwhile, market prices update:
UPDATE stock_prices SET current_price = 95 WHERE symbol = 'AAPL';  -- 5% drop

-- Re-check before executing trades
SELECT SUM(shares * current_price) as total_value 
FROM portfolio_holdings 
WHERE customer_id = 'C001';  -- Shows $95,000 (non-repeatable read!)

-- Strategy calculation is now incorrect
-- Based decisions on $100,000 but actual value is $95,000
COMMIT;
```

### How to Prevent Non-repeatable Reads:

**1. Use REPEATABLE READ Isolation Level:**
```sql
-- Ensures same reads return same results
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

SELECT balance FROM accounts WHERE account_id = 'A001';  -- 1000
-- Other transactions can't modify this row until we commit

SELECT balance FROM accounts WHERE account_id = 'A001';  -- Still 1000
-- Guaranteed same result

COMMIT;
```

**2. Explicit Row Locking:**
```sql
-- MySQL
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A001' FOR UPDATE;
-- Row is locked for updates

SELECT balance FROM accounts WHERE account_id = 'A001';  -- Same value guaranteed
COMMIT;

-- SQL Server
BEGIN TRANSACTION;
SELECT balance FROM accounts WITH (HOLDLOCK) WHERE account_id = 'A001';
-- Holds lock until transaction ends
COMMIT;
```

**3. Snapshot Isolation (if supported):**
```sql
-- SQL Server
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
BEGIN TRANSACTION;
-- Reads are based on snapshot of data at transaction start time
SELECT balance FROM accounts WHERE account_id = 'A001';  -- 1000
-- Always returns same value based on snapshot
COMMIT;
```

### Prevention Strategies Comparison:

| Strategy | Pros | Cons | Use Case |
|----------|------|------|----------|
| **REPEATABLE READ** | Consistent reads, standard SQL | May cause deadlocks | Financial calculations |
| **Row Locking** | Precise control | Reduces concurrency | Critical business logic |
| **Snapshot Isolation** | No blocking reads | More memory usage | Reporting systems |
| **Application Locking** | Custom control | Complex implementation | Specialized scenarios |

**Best Practice Example:**
```sql
-- Banking transfer with consistent reads
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

DECLARE @source_balance DECIMAL(10,2), @transfer_amount DECIMAL(10,2) = 1000;

-- First balance check
SELECT @source_balance = balance FROM accounts WHERE account_id = 'A001';

IF @source_balance >= @transfer_amount THEN
    -- Business logic processing...
    
    -- Second balance check (guaranteed same result)
    SELECT @source_balance = balance FROM accounts WHERE account_id = 'A001';
    
    -- Perform transfer
    UPDATE accounts SET balance = balance - @transfer_amount WHERE account_id = 'A001';
    UPDATE accounts SET balance = balance + @transfer_amount WHERE account_id = 'A002';
END IF;

COMMIT;
```

---

## **57. What is phantom read?**

**Phantom read** হল এমন একটি concurrency problem যেখানে একই transaction এর মধ্যে same query দুইবার execute করলে different number of rows পাওয়া যায়। এটি ঘটে যখন অন্য transaction নতুন rows insert করে বা existing rows delete করে।

### Phantom Read Example:

```sql
-- Session 1 (Transaction A)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

-- First query: Count employees in IT department
SELECT COUNT(*) FROM employees WHERE department = 'IT';  -- Returns 5

-- ... some processing time ...

-- Session 2 (Transaction B) - executes during Session 1's processing
BEGIN TRANSACTION;
INSERT INTO employees (name, department, salary) VALUES ('নতুন ডেভেলপার', 'IT', 45000);
COMMIT;  -- New employee added

-- Session 1 continues with same query
SELECT COUNT(*) FROM employees WHERE department = 'IT';  -- Returns 6 (phantom!)

-- Same transaction, same query, but different result count
-- The new row is a "phantom" - wasn't there before
COMMIT;
```

### Which isolation level prevents phantom reads?

| Isolation Level | Prevents Phantom Reads | Example |
|----------------|----------------------|---------|
| **READ UNCOMMITTED** | ❌ No | Allows all concurrency problems |
| **READ COMMITTED** | ❌ No | ```SELECT COUNT(*) FROM products WHERE price > 100;``` |
| **REPEATABLE READ** | ⚠️ Database Dependent | MySQL: ✅ Yes, PostgreSQL: ❌ No |
| **SERIALIZABLE** | ✅ Yes | ```SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;``` |

**Database-specific Behavior:**

```sql
-- MySQL InnoDB: REPEATABLE READ prevents phantom reads
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT * FROM products WHERE category = 'Electronics';  -- Consistent results
COMMIT;

-- PostgreSQL: REPEATABLE READ allows phantom reads
-- Need SERIALIZABLE to prevent them
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM products WHERE category = 'Electronics';  -- Prevents phantoms
COMMIT;
```

### How does it differ from non-repeatable read?

| Aspect | Non-repeatable Read | Phantom Read |
|--------|-------------------|--------------|
| **What changes** | Existing row values | Number of rows (inserts/deletes) |
| **Query result** | Same rows, different values | Different number of rows |
| **Operation type** | UPDATE operations | INSERT/DELETE operations |
| **Example** | Balance changes from $100 to $150 | Employee count changes from 5 to 6 |

**Non-repeatable Read:**
```sql
-- Session 1
BEGIN TRANSACTION;
SELECT salary FROM employees WHERE id = 123;  -- Returns 50000

-- Session 2 updates same row
UPDATE employees SET salary = 55000 WHERE id = 123;

-- Session 1 reads again
SELECT salary FROM employees WHERE id = 123;  -- Returns 55000 (different value)
```

**Phantom Read:**
```sql
-- Session 1  
BEGIN TRANSACTION;
SELECT * FROM employees WHERE salary > 50000;  -- Returns 3 rows

-- Session 2 inserts new row matching condition
INSERT INTO employees (name, salary) VALUES ('নতুন কর্মী', 60000);

-- Session 1 reads again
SELECT * FROM employees WHERE salary > 50000;  -- Returns 4 rows (phantom row)
```

### Real-world Examples:

**1. Financial Reporting:**
```sql
-- Month-end financial report generation
BEGIN TRANSACTION;

-- Initial count of high-value transactions
SELECT COUNT(*) as high_value_count 
FROM transactions 
WHERE amount >= 10000 AND transaction_date = '2023-12-31';  -- Returns 150

-- Report generation takes 30 minutes...

-- Meanwhile, batch processing system inserts late transactions:
INSERT INTO transactions (amount, transaction_date, type) 
VALUES (15000, '2023-12-31', 'WIRE_TRANSFER');

-- Final verification count before report finalization
SELECT COUNT(*) as high_value_count 
FROM transactions 
WHERE amount >= 10000 AND transaction_date = '2023-12-31';  -- Returns 151

-- Report shows inconsistent numbers!
COMMIT;
```

**2. E-commerce Inventory Reports:**
```sql
-- Daily inventory report
BEGIN TRANSACTION;

-- Count low-stock items
SELECT COUNT(*) as low_stock_items
FROM products 
WHERE stock_quantity < 10 AND status = 'ACTIVE';  -- Returns 25

-- Generate detailed report for each low-stock item...

-- Meanwhile, automated restock system adds new products:
INSERT INTO products (name, stock_quantity, status) 
VALUES ('New Product', 5, 'ACTIVE');

-- Final summary count
SELECT COUNT(*) as low_stock_items
FROM products 
WHERE stock_quantity < 10 AND status = 'ACTIVE';  -- Returns 26

-- Summary doesn't match detailed report!
COMMIT;
```

**3. User Analytics Dashboard:**
```sql
-- Real-time user analytics
BEGIN TRANSACTION;

-- Count active users in last hour
SELECT COUNT(DISTINCT user_id) as active_users
FROM user_sessions 
WHERE last_activity >= NOW() - INTERVAL '1 HOUR';  -- Returns 1,250

-- Generate detailed user behavior analysis...

-- Meanwhile, users continue logging in:
INSERT INTO user_sessions (user_id, last_activity) 
VALUES (99999, NOW());

-- Final count for dashboard update
SELECT COUNT(DISTINCT user_id) as active_users
FROM user_sessions 
WHERE last_activity >= NOW() - INTERVAL '1 HOUR';  -- Returns 1,251

-- Dashboard shows inconsistent metrics
COMMIT;
```

### How to Prevent Phantom Reads:

**1. Use SERIALIZABLE Isolation Level:**
```sql
-- Guaranteed prevention of phantom reads
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

SELECT COUNT(*) FROM orders WHERE order_date = CURRENT_DATE;  -- e.g., 100
-- Other transactions cannot insert/delete rows matching this condition

SELECT COUNT(*) FROM orders WHERE order_date = CURRENT_DATE;  -- Still 100
-- Guaranteed same result

COMMIT;
```

**2. Range Locking (Database Specific):**
```sql
-- SQL Server: Lock range of values
BEGIN TRANSACTION;
SELECT * FROM products 
WITH (HOLDLOCK, SERIALIZABLE) 
WHERE price BETWEEN 100 AND 500;
-- Prevents inserts in this price range

COMMIT;

-- Oracle: Similar with SELECT FOR UPDATE
SELECT * FROM products 
WHERE price BETWEEN 100 AND 500
FOR UPDATE;
```

**3. Application-level Versioning:**
```sql
-- Use version numbers or timestamps
CREATE TABLE report_snapshots (
    snapshot_id INT IDENTITY,
    creation_time DATETIME DEFAULT GETDATE(),
    data_version_hash VARCHAR(32)
);

-- Before generating report
DECLARE @snapshot_hash VARCHAR(32);
SELECT @snapshot_hash = CHECKSUM_AGG(CHECKSUM(*)) 
FROM products WHERE status = 'ACTIVE';

INSERT INTO report_snapshots (data_version_hash) VALUES (@snapshot_hash);

-- After report generation, verify data hasn't changed
DECLARE @current_hash VARCHAR(32);
SELECT @current_hash = CHECKSUM_AGG(CHECKSUM(*)) 
FROM products WHERE status = 'ACTIVE';

IF @snapshot_hash != @current_hash
    -- Data changed during report generation, regenerate report
    RAISERROR('Data changed during report generation', 16, 1);
```

### Performance vs Consistency Trade-offs:

**SERIALIZABLE Level:**
```sql
-- High consistency, low concurrency
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
    -- Reports are perfectly consistent
    -- But system throughput decreases significantly
    SELECT SUM(amount) FROM daily_sales WHERE sale_date = CURRENT_DATE;
COMMIT;
```

**Application-level Snapshots:**
```sql
-- Good performance, eventual consistency
CREATE TEMPORARY TABLE temp_snapshot AS 
SELECT * FROM live_data WHERE report_criteria = 'ACTIVE';

-- Generate report from snapshot
SELECT COUNT(*), AVG(amount), SUM(total) FROM temp_snapshot;

-- No phantom reads from snapshot, good performance
DROP TEMPORARY TABLE temp_snapshot;
```

### Best Practices:

**1. Choose Right Strategy Based on Use Case:**
```sql
-- For financial reconciliation: Use SERIALIZABLE
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT SUM(debits), SUM(credits) FROM account_transactions 
WHERE transaction_date = '2023-12-31';

-- For user analytics: Use snapshots or lower isolation
CREATE TEMPORARY TABLE analytics_snapshot AS 
SELECT user_id, activity_count FROM user_activities 
WHERE activity_date >= CURRENT_DATE - 7;

-- For real-time dashboards: Accept phantom reads for performance
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT COUNT(*) FROM active_users WHERE last_seen >= NOW() - INTERVAL '5 MINUTES';
```

**2. Document Phantom Read Behavior:**
```sql
-- Clearly document when phantom reads are acceptable
-- Dashboard metrics (approximate counts OK)
SELECT 
    COUNT(*) as approximate_user_count,
    'Note: Count may vary due to concurrent user activity' as disclaimer
FROM active_users;

-- Financial reports (phantom reads not acceptable)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT 
    SUM(amount) as exact_total,
    'Guaranteed consistent total as of transaction start' as note
FROM financial_transactions 
WHERE report_date = '2023-12-31';
```

---

## **58. What is deadlock?**

**Deadlock** হল এমন একটি situation যেখানে দুই বা ততোধিক transactions একে অপরের জন্য অপেক্ষা করে এবং কেউই proceed করতে পারে না। এটি database system এর একটি common concurrency problem।

### Simple Deadlock Example:

```sql
-- Setup: Two accounts with balances
CREATE TABLE accounts (account_id VARCHAR(10), balance DECIMAL(10,2));
INSERT INTO accounts VALUES ('A001', 1000), ('A002', 1500);

-- Transaction 1 (Session 1)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';  -- Locks A001
-- ... processing time ...
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'A002';  -- Waits for A002 lock

-- Transaction 2 (Session 2) - starts almost simultaneously
BEGIN TRANSACTION;  
UPDATE accounts SET balance = balance - 300 WHERE account_id = 'A002';  -- Locks A002
-- ... processing time ...
UPDATE accounts SET balance = balance + 300 WHERE account_id = 'A001';  -- Waits for A001 lock

-- DEADLOCK! 
-- Transaction 1 holds A001, wants A002
-- Transaction 2 holds A002, wants A001
-- Neither can proceed
```

### Deadlock Detection Cycle:

```
Transaction 1: Holds Lock(A001) → Wants Lock(A002)
                      ↓                    ↑
Transaction 2: Wants Lock(A001) ← Holds Lock(A002)
```

### Real-world Deadlock Scenarios:

**1. Order Processing System:**
```sql
-- Transaction 1: Process Order #123
BEGIN TRANSACTION;
UPDATE inventory SET stock = stock - 5 WHERE product_id = 'P001';     -- Locks P001
UPDATE customers SET credit_limit = credit_limit - 500 WHERE id = 100; -- Waits for Customer 100

-- Transaction 2: Update Customer Credit  
BEGIN TRANSACTION;
UPDATE customers SET credit_limit = credit_limit + 1000 WHERE id = 100; -- Locks Customer 100
UPDATE inventory SET reserved = reserved + 10 WHERE product_id = 'P001'; -- Waits for P001

-- Deadlock: T1 has P001, wants Customer 100; T2 has Customer 100, wants P001
```

**2. Banking Transfer System:**
```sql
-- Transfer 1: A001 → A002 ($500)
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';  -- Locks A001
-- Some business logic validation...
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'A002';  -- Wants A002

-- Transfer 2: A002 → A001 ($300) - concurrent transaction
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 300 WHERE account_id = 'A002';  -- Locks A002  
-- Some business logic validation...
UPDATE accounts SET balance = balance + 300 WHERE account_id = 'A001';  -- Wants A001

-- Classic deadlock situation
```

### How can DBMS resolve deadlock?

Database Management Systems use several strategies to handle deadlocks:

#### **1. Deadlock Detection:**

**Graph-based Detection:**
```sql
-- DBMS maintains wait-for graph
-- Example detection query (conceptual)
WITH wait_for_graph AS (
    SELECT 
        waiting_transaction_id,
        blocking_transaction_id,
        resource_locked
    FROM sys.dm_tran_locks l1
    JOIN sys.dm_tran_locks l2 ON l1.resource_associated_entity_id = l2.resource_associated_entity_id
    WHERE l1.request_status = 'WAIT' AND l2.request_status = 'GRANT'
)
-- DBMS detects cycles in this graph
SELECT * FROM wait_for_graph;
```

**Victim Selection:**
```sql
-- DBMS chooses victim based on:
-- 1. Transaction cost (how much work done)
-- 2. Transaction priority  
-- 3. Number of rows affected
-- 4. Transaction duration

-- Lower cost transaction is usually chosen as victim
-- Victim transaction is automatically rolled back
-- Error returned: "Transaction was deadlocked and has been chosen as the deadlock victim"
```

#### **2. Timeout-based Resolution:**

```sql
-- Set deadlock timeout (SQL Server example)
SET LOCK_TIMEOUT 5000;  -- 5 seconds

BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';
-- If deadlock occurs, transaction will timeout after 5 seconds
-- Error: "Lock request time out period exceeded"
```

#### **3. Deadlock Prevention (2PL - Two Phase Locking):**

```sql
-- Acquire all locks at once before starting operations
BEGIN TRANSACTION;
-- Phase 1: Acquire all needed locks
SELECT * FROM accounts WHERE account_id IN ('A001', 'A002') FOR UPDATE;

-- Phase 2: Perform operations (no new locks acquired)
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'A002';

COMMIT;
```

### How can developers prevent deadlocks?

#### **1. Consistent Lock Ordering:**

```sql
-- Always acquire locks in same order (e.g., by account_id)
CREATE PROCEDURE transfer_money(
    @from_account VARCHAR(10),
    @to_account VARCHAR(10), 
    @amount DECIMAL(10,2)
)
AS
BEGIN
    DECLARE @first_account VARCHAR(10), @second_account VARCHAR(10);
    
    -- Order accounts alphabetically to ensure consistent locking
    IF @from_account < @to_account 
    BEGIN
        SET @first_account = @from_account;
        SET @second_account = @to_account;
    END
    ELSE
    BEGIN
        SET @first_account = @to_account;
        SET @second_account = @from_account;
    END
    
    BEGIN TRANSACTION;
        -- Always lock in same order
        UPDATE accounts SET balance = balance - 
            CASE WHEN account_id = @from_account THEN @amount ELSE 0 END +
            CASE WHEN account_id = @to_account THEN @amount ELSE 0 END
        WHERE account_id IN (@first_account, @second_account)
        ORDER BY account_id;  -- Consistent ordering
    COMMIT;
END
```

#### **2. Reduce Transaction Scope:**

```sql
-- Bad: Long transaction holding locks
BEGIN TRANSACTION;
UPDATE inventory SET stock = stock - 1 WHERE product_id = 'P001';
-- ... lots of business logic, external API calls ...
-- ... email sending, file operations ...
UPDATE customers SET last_purchase = GETDATE() WHERE customer_id = 123;
COMMIT;

-- Good: Minimal transaction scope
-- Do business logic outside transaction
DECLARE @new_order_id INT;
-- Business logic here (outside transaction)

BEGIN TRANSACTION;
    INSERT INTO orders (customer_id, amount) VALUES (123, 500);
    SET @new_order_id = SCOPE_IDENTITY();
    UPDATE inventory SET stock = stock - 1 WHERE product_id = 'P001';
COMMIT;

-- Continue with non-critical updates
UPDATE customers SET last_purchase = GETDATE() WHERE customer_id = 123;
```

#### **3. Use Lower Isolation Levels:**

```sql
-- Instead of default isolation level
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- Use READ UNCOMMITTED for reporting (where data consistency less critical)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT COUNT(*) FROM large_reporting_table WHERE status = 'ACTIVE';
-- Reduces lock contention
```

#### **4. Implement Retry Logic:**

```sql
-- Application-level retry logic
CREATE PROCEDURE transfer_with_retry(
    @from_account VARCHAR(10),
    @to_account VARCHAR(10),
    @amount DECIMAL(10,2)
)
AS
BEGIN
    DECLARE @retry_count INT = 0;
    DECLARE @max_retries INT = 3;
    
    WHILE @retry_count < @max_retries
    BEGIN
        BEGIN TRY
            EXEC transfer_money @from_account, @to_account, @amount;
            BREAK;  -- Success, exit loop
        END TRY
        BEGIN CATCH
            IF ERROR_NUMBER() = 1205  -- Deadlock error
            BEGIN
                SET @retry_count = @retry_count + 1;
                WAITFOR DELAY '00:00:01';  -- Wait 1 second before retry
                
                IF @retry_count >= @max_retries
                    THROW;  -- Re-throw error after max retries
            END
            ELSE
                THROW;  -- Re-throw non-deadlock errors immediately
        END CATCH
    END
END
```

### What is deadlock detection vs prevention?

| Approach | How it Works | Pros | Cons | Example |
|----------|-------------|------|------|---------|
| **Detection** | Let deadlocks occur, detect and resolve | Simple to implement, good concurrency | Some transactions will be rolled back | DBMS wait-for graphs |
| **Prevention** | Design system to avoid deadlocks | No rollbacks needed | More complex, may reduce concurrency | Lock ordering, 2PL |

#### **Deadlock Detection Example:**
```sql
-- Detection approach: Let it happen, handle gracefully
BEGIN TRY
    BEGIN TRANSACTION;
        UPDATE accounts SET balance = balance - @amount WHERE account_id = @from_account;
        UPDATE accounts SET balance = balance + @amount WHERE account_id = @to_account;
    COMMIT;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 1205  -- Deadlock victim
    BEGIN
        ROLLBACK TRANSACTION;
        -- Log deadlock occurrence
        INSERT INTO deadlock_log (transaction_type, accounts_involved, occurrence_time)
        VALUES ('TRANSFER', @from_account + ',' + @to_account, GETDATE());
        
        -- Retry with exponential backoff
        WAITFOR DELAY '00:00:02';
        EXEC transfer_money @from_account, @to_account, @amount;  -- Retry
    END
END CATCH
```

#### **Deadlock Prevention Example:**
```sql
-- Prevention approach: Avoid deadlocks by design
CREATE PROCEDURE deadlock_free_transfer(
    @from_account VARCHAR(10),
    @to_account VARCHAR(10),
    @amount DECIMAL(10,2)
)
AS
BEGIN
    -- Single statement to update both accounts (atomic)
    UPDATE accounts 
    SET balance = CASE 
        WHEN account_id = @from_account THEN balance - @amount
        WHEN account_id = @to_account THEN balance + @amount
        ELSE balance
    END
    WHERE account_id IN (@from_account, @to_account);
    
    -- Alternative: Use table hints to control locking
    UPDATE accounts WITH (UPDLOCK, HOLDLOCK)
    SET balance = balance - @amount 
    WHERE account_id = @from_account;
    
    UPDATE accounts WITH (UPDLOCK, HOLDLOCK)
    SET balance = balance + @amount 
    WHERE account_id = @to_account;
END
```

### Deadlock Monitoring and Analysis:

```sql
-- Enable deadlock monitoring (SQL Server)
DBCC TRACEON(1222, -1);  -- Enable deadlock logging

-- Query deadlock information
SELECT 
    database_id,
    OBJECT_NAME(object_id) as table_name,
    resource_type,
    request_mode,
    request_type,
    request_status
FROM sys.dm_tran_locks
WHERE request_status = 'WAIT';

-- Identify frequent deadlock patterns
SELECT 
    object_name,
    COUNT(*) as deadlock_count,
    AVG(duration_ms) as avg_duration
FROM deadlock_history  -- Custom logging table
WHERE occurrence_date >= DATEADD(day, -7, GETDATE())
GROUP BY object_name
ORDER BY deadlock_count DESC;
```

**Best Practices Summary:**
1. **Design**: Use consistent lock ordering
2. **Implementation**: Keep transactions short
3. **Monitoring**: Log and analyze deadlock patterns  
4. **Handling**: Implement retry logic with exponential backoff
5. **Testing**: Test concurrent scenarios during development

---

## **59. Difference between optimistic and pessimistic locking?**

**Optimistic** এবং **Pessimistic locking** হল দুটি ভিন্ন approach concurrent data access handle করার জন্য। এদের মধ্যে fundamental difference হল কখন এবং কীভাবে conflicts detect ও resolve করা হয়।

### Pessimistic Locking:

**Approach:** "Lock first, then work" - Data access করার আগেই lock নিয়ে নেয় এবং transaction শেষ পর্যন্ত hold করে রাখে।

```sql
-- Pessimistic locking example
BEGIN TRANSACTION;

-- Immediately lock the row for exclusive access
SELECT balance FROM accounts 
WHERE account_id = 'A001' 
FOR UPDATE;  -- Row locked until transaction ends

-- Now safely perform operations knowing no one else can modify
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';

-- Lock held throughout transaction
COMMIT;  -- Lock released here
```

**Characteristics:**
- ✅ **Prevents conflicts:** No other transaction can modify locked data
- ✅ **Data consistency:** Guaranteed no conflicting changes
- ❌ **Reduced concurrency:** Other transactions wait for locks
- ❌ **Potential deadlocks:** Multiple locks can cause deadlock cycles

### Optimistic Locking:

**Approach:** "Work first, check later" - Assumes conflicts are rare, performs work without locking, checks for conflicts at commit time।

```sql
-- Optimistic locking with version column
CREATE TABLE accounts (
    account_id VARCHAR(10),
    balance DECIMAL(10,2),
    version_number INT DEFAULT 0  -- Version for optimistic locking
);

-- Transaction reads data with version
SELECT account_id, balance, version_number 
FROM accounts 
WHERE account_id = 'A001';  -- Returns: balance=1000, version=5

-- Perform business logic without locking...

-- Update with version check (optimistic locking)
UPDATE accounts 
SET balance = balance - 500, 
    version_number = version_number + 1
WHERE account_id = 'A001' 
    AND version_number = 5;  -- Only update if version unchanged

-- Check if update successful
IF @@ROWCOUNT = 0 
    -- Someone else modified the data, handle conflict
    RAISERROR('Data was modified by another user', 16, 1);
```

### When would you use each approach?

#### **Use Pessimistic Locking When:**

**1. High Conflict Scenarios:**
```sql
-- Popular product inventory during flash sale
BEGIN TRANSACTION;
    -- Lock immediately to prevent overselling
    SELECT stock FROM products 
    WHERE product_id = 'FLASH_SALE_ITEM' 
    FOR UPDATE;
    
    IF stock >= 1 THEN
        UPDATE products SET stock = stock - 1 WHERE product_id = 'FLASH_SALE_ITEM';
        INSERT INTO orders (product_id, customer_id) VALUES ('FLASH_SALE_ITEM', @customer_id);
    END IF;
COMMIT;
```

**2. Financial Transactions:**
```sql
-- Bank account transfers (critical accuracy needed)
BEGIN TRANSACTION;
    -- Lock both accounts to prevent concurrent modifications
    SELECT balance FROM accounts 
    WHERE account_id IN ('A001', 'A002') 
    FOR UPDATE;
    
    -- Safe to perform transfer knowing balances won't change
    UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
    UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A002';
COMMIT;
```

**3. Sequential Number Generation:**
```sql
-- Generate unique invoice numbers
BEGIN TRANSACTION;
    SELECT next_invoice_number FROM invoice_sequence FOR UPDATE;
    
    DECLARE @invoice_number INT;
    SELECT @invoice_number = next_invoice_number FROM invoice_sequence;
    
    UPDATE invoice_sequence SET next_invoice_number = next_invoice_number + 1;
    
    INSERT INTO invoices (invoice_number, customer_id, amount) 
    VALUES (@invoice_number, @customer_id, @amount);
COMMIT;
```

#### **Use Optimistic Locking When:**

**1. Low Conflict Scenarios:**
```sql
-- User profile updates (users rarely edit simultaneously)
-- Read user profile
SELECT user_id, profile_data, last_modified 
FROM user_profiles 
WHERE user_id = 123;  -- last_modified = '2023-12-01 10:00:00'

-- User edits profile in UI for 10 minutes...

-- Save changes with optimistic check
UPDATE user_profiles 
SET profile_data = @new_profile_data,
    last_modified = GETDATE()
WHERE user_id = 123 
    AND last_modified = '2023-12-01 10:00:00';  -- Check if unchanged

IF @@ROWCOUNT = 0
    -- Profile was modified by someone else, show conflict resolution UI
    SELECT 'Profile was modified by another session' as conflict_message;
```

**2. Long-running Operations:**
```sql
-- Document editing system
-- User opens document for editing
SELECT document_id, content, version_hash 
FROM documents 
WHERE document_id = 456;  -- version_hash = 'ABC123'

-- User spends 2 hours editing document...

-- Save changes optimistically  
UPDATE documents 
SET content = @new_content,
    version_hash = HASHBYTES('SHA1', @new_content),
    last_modified = GETDATE()
WHERE document_id = 456 
    AND version_hash = 'ABC123';  -- Optimistic check

IF @@ROWCOUNT = 0
BEGIN
    -- Handle conflict: merge changes or ask user to choose
    SELECT current_content FROM documents WHERE document_id = 456;
    -- Show merge interface to user
END
```

**3. Web Applications:**
```sql
-- E-commerce product reviews
-- Display product with current rating
SELECT product_id, average_rating, review_count, rating_version
FROM product_ratings 
WHERE product_id = 'P001';  -- rating_version = 15

-- User submits review after browsing for 20 minutes

BEGIN TRANSACTION;
    -- Add new review
    INSERT INTO reviews (product_id, user_id, rating, comment) 
    VALUES ('P001', @user_id, @rating, @comment);
    
    -- Update average rating optimistically
    UPDATE product_ratings 
    SET average_rating = (average_rating * review_count + @rating) / (review_count + 1),
        review_count = review_count + 1,
        rating_version = rating_version + 1
    WHERE product_id = 'P001' 
        AND rating_version = 15;  -- Optimistic check
    
    IF @@ROWCOUNT = 0
    BEGIN
        -- Recalculate rating from scratch
        UPDATE product_ratings 
        SET average_rating = (SELECT AVG(CAST(rating AS FLOAT)) FROM reviews WHERE product_id = 'P001'),
            review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = 'P001'),
            rating_version = rating_version + 1
        WHERE product_id = 'P001';
    END
COMMIT;
```

### Which is better for high-traffic systems?

**Generally, Optimistic Locking is better for high-traffic systems** কারণ:

#### **Optimistic Locking Advantages in High Traffic:**

**1. Better Scalability:**
```sql
-- Optimistic: Multiple users can read simultaneously
-- No blocking, better throughput
SELECT * FROM products WHERE category = 'Electronics';  -- 1000 concurrent reads OK

-- Each user can work independently
UPDATE products 
SET description = @new_description,
    last_modified = GETDATE()
WHERE product_id = @product_id 
    AND last_modified = @original_timestamp;  -- Quick conflict check
```

**2. Reduced Lock Contention:**
```sql
-- High-traffic news website: Article view counting
-- Pessimistic would create bottleneck:
-- BEGIN TRANSACTION;
-- SELECT view_count FROM articles WHERE id = 123 FOR UPDATE;  -- Blocks other readers
-- UPDATE articles SET view_count = view_count + 1 WHERE id = 123;
-- COMMIT;

-- Optimistic approach for high traffic:
UPDATE articles 
SET view_count = view_count + 1,
    version = version + 1
WHERE article_id = 123;

-- Or even better: Use eventual consistency
INSERT INTO article_views (article_id, view_timestamp) VALUES (123, GETDATE());
-- Batch process to update counts periodically
```

**3. No Deadlock Risk:**
```sql
-- Multiple users updating different fields optimistically
-- User 1: Update product price
UPDATE products 
SET price = @new_price, version = version + 1 
WHERE product_id = 'P001' AND version = @current_version;

-- User 2: Update product description (concurrent)
UPDATE products 
SET description = @new_description, version = version + 1 
WHERE product_id = 'P001' AND version = @current_version;

-- No deadlock possible - conflicts handled at application level
```

#### **When Pessimistic Still Better in High Traffic:**

**1. Critical Resources with High Contention:**
```sql
-- Limited inventory during sales events
-- Optimistic would cause too many conflicts
BEGIN TRANSACTION;
    SELECT stock FROM limited_edition_products 
    WHERE product_id = 'LIMITED_001' 
    FOR UPDATE;  -- Prevent overselling
    
    IF stock > 0 THEN
        UPDATE limited_edition_products SET stock = stock - 1 
        WHERE product_id = 'LIMITED_001';
        INSERT INTO orders (...) VALUES (...);
    END IF;
COMMIT;
```

**2. Sequential Operations:**
```sql
-- Order number generation in high-volume e-commerce
-- Optimistic retry would be inefficient
BEGIN TRANSACTION;
    SELECT @next_order_id = next_order_id FROM order_sequence FOR UPDATE;
    UPDATE order_sequence SET next_order_id = next_order_id + 1;
    INSERT INTO orders (order_id, ...) VALUES (@next_order_id, ...);
COMMIT;
```

### Hybrid Approaches for High Traffic:

**1. Optimistic with Retry Logic:**
```sql
CREATE PROCEDURE OptimisticUpdateWithRetry
AS
BEGIN
    DECLARE @retry_count INT = 0;
    DECLARE @max_retries INT = 3;
    
    WHILE @retry_count < @max_retries
    BEGIN
        UPDATE products 
        SET price = @new_price, version = version + 1
        WHERE product_id = @product_id AND version = @current_version;
        
        IF @@ROWCOUNT > 0
            BREAK;  -- Success
        ELSE
        BEGIN
            SET @retry_count = @retry_count + 1;
            -- Exponential backoff
            WAITFOR DELAY '00:00:00.100';  -- 100ms, then 200ms, then 400ms
            
            -- Refresh current version
            SELECT @current_version = version FROM products WHERE product_id = @product_id;
        END
    END
END
```

**2. Eventual Consistency for Analytics:**
```sql
-- High-traffic analytics: Use append-only pattern
INSERT INTO page_views (page_id, user_id, view_timestamp) 
VALUES (@page_id, @user_id, GETDATE());

-- Background job aggregates data
UPDATE page_statistics 
SET total_views = (SELECT COUNT(*) FROM page_views WHERE page_id = @page_id),
    unique_visitors = (SELECT COUNT(DISTINCT user_id) FROM page_views WHERE page_id = @page_id)
WHERE page_id = @page_id;
```

**3. Database-specific Features:**
```sql
-- MySQL: Use ON DUPLICATE KEY UPDATE for atomic operations
INSERT INTO product_ratings (product_id, total_score, review_count)
VALUES (@product_id, @rating, 1)
ON DUPLICATE KEY UPDATE 
    total_score = total_score + VALUES(total_score),
    review_count = review_count + 1;

-- PostgreSQL: Use UPSERT with conflict resolution
INSERT INTO product_ratings (product_id, total_score, review_count)
VALUES (@product_id, @rating, 1)
ON CONFLICT (product_id) DO UPDATE SET
    total_score = product_ratings.total_score + EXCLUDED.total_score,
    review_count = product_ratings.review_count + 1;
```

**Summary for High-Traffic Systems:**
- **Default choice:** Optimistic locking with retry logic
- **Critical sections:** Pessimistic locking for short operations  
- **Analytics:** Eventual consistency with background processing
- **Inventory:** Pessimistic for stock management
- **User interactions:** Optimistic for profile updates, comments, etc.

---

## **60. What is two-phase locking (2PL)?**

**Two-Phase Locking (2PL)** হল database concurrency control এর একটি protocol যা transactions এর serializability guarantee করে। এটি লকিং process কে দুটি distinct phases এ ভাগ করে।

### Two Phases of 2PL:

#### **Phase 1: Growing Phase (Expanding Phase)**
- Transaction শুধুমাত্র locks acquire করতে পারে
- কোনো locks release করতে পারে না
- নতুন data access করলে corresponding locks নিতে হবে

#### **Phase 2: Shrinking Phase (Contracting Phase)** 
- Transaction শুধুমাত্র locks release করতে পারে
- কোনো নতুন locks acquire করতে পারে না
- একবার কোনো lock release করলে আর কোনো নতুন lock নেওয়া যাবে না

### What are growing and shrinking phases?

**Growing Phase Example:**
```sql
BEGIN TRANSACTION;  -- 2PL starts

-- Growing phase begins - acquiring locks only
SELECT balance FROM accounts WHERE account_id = 'A001';  -- Acquires shared lock on A001
-- Lock set: {S(A001)}

SELECT balance FROM accounts WHERE account_id = 'A002';  -- Acquires shared lock on A002  
-- Lock set: {S(A001), S(A002)}

UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';  -- Upgrades to exclusive lock
-- Lock set: {X(A001), S(A002)}

SELECT * FROM transaction_log WHERE account_id = 'A001';  -- Acquires shared lock on transaction_log
-- Lock set: {X(A001), S(A002), S(transaction_log)}

-- Growing phase continues until first lock release...
```

**Shrinking Phase Example:**
```sql
-- Still in growing phase
INSERT INTO transaction_log (account_id, action) VALUES ('A001', 'DEBIT');  -- May acquire more locks

-- Shrinking phase begins with first lock release
-- (Usually happens at COMMIT/ROLLBACK, but can be earlier)

-- Once any lock is released, no new locks can be acquired
COMMIT;  -- All locks released simultaneously
-- Lock set: {} (empty)
```

### How does 2PL prevent inconsistencies?

**2PL prevents three main consistency problems:**

#### **1. Prevents Lost Updates:**

**Without 2PL (Problem):**
```sql
-- Transaction 1                    -- Transaction 2
READ balance (A001) = 1000         READ balance (A001) = 1000
balance = 1000 - 500 = 500         balance = 1000 - 300 = 700
WRITE balance (A001) = 500         WRITE balance (A001) = 700

-- Result: Last write wins, one update is lost!
-- Should be: 1000 - 500 - 300 = 200
```

**With 2PL (Solution):**
```sql
-- Transaction 1                    -- Transaction 2
BEGIN TRANSACTION;                 BEGIN TRANSACTION;
-- Growing phase                   -- Growing phase
SELECT balance FROM accounts        SELECT balance FROM accounts 
WHERE account_id = 'A001'          WHERE account_id = 'A001'  
FOR UPDATE;  -- X-lock on A001     FOR UPDATE;  -- WAITS for X-lock

UPDATE accounts SET balance = 500   -- Still waiting...
WHERE account_id = 'A001';

COMMIT;  -- Shrinking phase        -- Now can acquire lock
-- X-lock released                 UPDATE accounts SET balance = 400  -- 500-300=200
                                  WHERE account_id = 'A001';
                                  COMMIT;  -- Correct result: 200
```

#### **2. Prevents Dirty Reads:**

```sql
-- Transaction 1                    -- Transaction 2  
BEGIN TRANSACTION;                 BEGIN TRANSACTION;
UPDATE accounts                    SELECT balance FROM accounts
SET balance = 1500                 WHERE account_id = 'A001';  -- WAITS
WHERE account_id = 'A001';         -- Cannot read due to X-lock
-- X-lock held on A001

-- Business logic error occurs
ROLLBACK;  -- X-lock released      -- Now reads original value (1000)
                                  -- No dirty read occurred
```

#### **3. Prevents Non-repeatable Reads:**

```sql
-- Transaction 1                    -- Transaction 2
BEGIN TRANSACTION;                 BEGIN TRANSACTION;
SELECT balance FROM accounts       -- Wants to update
WHERE account_id = 'A001';         UPDATE accounts SET balance = 1500
-- S-lock acquired                 WHERE account_id = 'A001';  -- WAITS
-- Returns: 1000                   -- Cannot get X-lock due to S-lock

-- Some processing...              -- Still waiting...

SELECT balance FROM accounts       -- Still waiting...
WHERE account_id = 'A001';         
-- Same S-lock, same result: 1000  

COMMIT;  -- S-lock released        -- Now can update
-- Repeatable read guaranteed      COMMIT;
```

### Types of Two-Phase Locking:

#### **1. Basic 2PL:**
```sql
-- Locks released at transaction end
BEGIN TRANSACTION;
-- Growing phase
SELECT * FROM products WHERE id = 1 FOR UPDATE;  -- Acquire X-lock
SELECT * FROM customers WHERE id = 100;          -- Acquire S-lock  
UPDATE products SET stock = stock - 1 WHERE id = 1;

-- Shrinking phase starts at commit
COMMIT;  -- All locks released together
```

#### **2. Conservative 2PL (Static 2PL):**
```sql
-- All locks acquired at transaction start
BEGIN TRANSACTION;
-- Acquire ALL needed locks upfront
LOCK TABLE products IN EXCLUSIVE MODE;
LOCK TABLE customers IN SHARE MODE;
LOCK TABLE orders IN EXCLUSIVE MODE;

-- Now perform all operations
-- No additional locks needed (prevents deadlocks)
UPDATE products SET stock = stock - 1 WHERE id = 1;
INSERT INTO orders (customer_id, product_id) VALUES (100, 1);

COMMIT;  -- Release all locks
```

#### **3. Strict 2PL:**
```sql
-- Most common implementation
-- Exclusive locks held until transaction end
BEGIN TRANSACTION;
-- Growing phase
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';  -- X-lock
SELECT balance FROM accounts WHERE account_id = 'A002';                 -- S-lock

-- X-locks held until commit (prevents cascading rollbacks)
-- S-locks may be released earlier

COMMIT;  -- All locks released (shrinking phase)
```

#### **4. Rigorous 2PL:**
```sql
-- ALL locks held until transaction end
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A001';  -- S-lock held until commit
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';  -- X-lock held until commit

-- Both shared and exclusive locks held until end
COMMIT;  -- All locks released simultaneously
```

### Real-world 2PL Implementation:

**Banking System Example:**
```sql
CREATE PROCEDURE TransferMoney(
    @from_account VARCHAR(10),
    @to_account VARCHAR(10), 
    @amount DECIMAL(10,2)
)
AS
BEGIN
    BEGIN TRANSACTION;  -- 2PL starts
    
    -- Growing Phase: Acquire locks in consistent order (prevent deadlocks)
    DECLARE @first_account VARCHAR(10), @second_account VARCHAR(10);
    
    IF @from_account < @to_account 
    BEGIN
        SET @first_account = @from_account;
        SET @second_account = @to_account;
    END
    ELSE
    BEGIN
        SET @first_account = @to_account;
        SET @second_account = @from_account;
    END
    
    -- Acquire locks in order
    DECLARE @balance1 DECIMAL(10,2), @balance2 DECIMAL(10,2);
    
    SELECT @balance1 = balance FROM accounts 
    WHERE account_id = @first_account FOR UPDATE;  -- X-lock acquired
    
    SELECT @balance2 = balance FROM accounts 
    WHERE account_id = @second_account FOR UPDATE;  -- X-lock acquired
    
    -- Validate business rules
    IF (@from_account = @first_account AND @balance1 < @amount) OR
       (@from_account = @second_account AND @balance2 < @amount)
    BEGIN
        ROLLBACK;  -- Shrinking phase - all locks released
        RAISERROR('Insufficient funds', 16, 1);
        RETURN;
    END
    
    -- Perform transfer
    UPDATE accounts SET balance = balance - @amount 
    WHERE account_id = @from_account;
    
    UPDATE accounts SET balance = balance + @amount 
    WHERE account_id = @to_account;
    
    -- Log transaction
    INSERT INTO transaction_log (from_account, to_account, amount, timestamp)
    VALUES (@from_account, @to_account, @amount, GETDATE());
    
    COMMIT;  -- Shrinking phase - all locks released
END
```

### 2PL Benefits and Limitations:

**Benefits:**
- ✅ **Serializability:** Guarantees equivalent serial execution
- ✅ **Consistency:** Prevents data inconsistencies  
- ✅ **Isolation:** Proper transaction isolation
- ✅ **Standard Implementation:** Used by most databases

**Limitations:**
- ❌ **Deadlocks:** Can still occur with multiple transactions
- ❌ **Reduced Concurrency:** Locks limit parallel execution
- ❌ **Cascading Rollbacks:** In basic 2PL (solved by strict 2PL)

### Database Implementation Examples:

**MySQL InnoDB:**
```sql
-- Uses Strict 2PL
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- X-lock held until commit
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;  -- Lock released here
```

**PostgreSQL:**
```sql
-- Uses 2PL with MVCC
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- Row-level X-lock
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;  -- Locks released, MVCC handles concurrent reads
```

**SQL Server:**
```sql
-- Uses 2PL with various lock hints
BEGIN TRANSACTION;
SELECT balance FROM accounts WITH (UPDLOCK, HOLDLOCK) WHERE account_id = 'A001';
-- UPDLOCK: Update lock, HOLDLOCK: Hold until commit (Strict 2PL)
UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A001';
COMMIT;
```

### Monitoring 2PL in Practice:

```sql
-- Monitor lock information (SQL Server)
SELECT 
    resource_type,
    resource_description,
    request_mode,
    request_type,
    request_status,
    request_session_id
FROM sys.dm_tran_locks
WHERE resource_database_id = DB_ID('YourDatabase');

-- Check for blocking
SELECT 
    blocking_session_id,
    blocked_session_id,
    wait_type,
    wait_time,
    wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id <> 0;
```

2PL হল modern databases এর foundation, যদিও বেশিরভাগ systems এখন optimizations like MVCC, snapshot isolation ইত্যাদি use করে better performance এবং concurrency achieve করার জন্য।

---

## **61. What is multi-version concurrency control (MVCC)?**

**Multi-Version Concurrency Control (MVCC)** হল একটি advanced concurrency control mechanism যেখানে database একই data এর multiple versions maintain করে। এটি readers এবং writers এর মধ্যে conflicts reduce করে এবং better concurrency প্রদান করে।

### MVCC Core Concept:

**Traditional Locking:**
```sql
-- Reader blocks writer, writer blocks reader
-- Session 1 (Reader)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Shared lock acquired
-- Writer has to wait...

-- Session 2 (Writer) 
UPDATE accounts SET balance = 1500 WHERE id = 1;  -- BLOCKED by shared lock
```

**MVCC Approach:**
```sql
-- Readers and writers don't block each other
-- Session 1 (Reader)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;  -- Reads current version (1000)

-- Session 2 (Writer) - concurrent
UPDATE accounts SET balance = 1500 WHERE id = 1;  -- Creates new version
COMMIT;  -- New version becomes current

-- Session 1 continues
SELECT balance FROM accounts WHERE id = 1;  -- Still reads old version (1000)
-- Consistent read throughout transaction
COMMIT;
```

### How MVCC Works:

#### **1. Version Storage:**

**Row-level Versioning Example:**
```sql
-- Conceptual representation of MVCC storage
-- Physical storage might look like this:

Accounts Table (Multiple Versions):
| ID | Balance | Transaction_ID | Timestamp | Status |
|----|---------|----------------|-----------|---------|
| 1  | 1000    | TXN_100       | 10:00:00  | COMMITTED |
| 1  | 1500    | TXN_101       | 10:01:00  | COMMITTED |  -- New version
| 1  | 1200    | TXN_102       | 10:02:00  | ACTIVE    |  -- Uncommitted

-- When TXN_99 (started at 09:59:00) reads:
SELECT balance FROM accounts WHERE id = 1;  -- Returns 1000 (latest committed version before TXN_99)

-- When TXN_103 (started at 10:03:00) reads:
SELECT balance FROM accounts WHERE id = 1;  -- Returns 1500 (latest committed version before TXN_103)
```

#### **2. Transaction Snapshots:**

```sql
-- Each transaction gets a snapshot of database state
-- PostgreSQL example
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;  -- MVCC snapshot created
-- Snapshot includes all transactions committed before this point

SELECT balance FROM accounts WHERE id = 1;  -- Uses snapshot
-- Even if other transactions commit new versions, this will return same result

SELECT balance FROM accounts WHERE id = 1;  -- Same result guaranteed
COMMIT;
```

### Which databases use MVCC?

| Database | MVCC Implementation | Storage Method |
|----------|-------------------|----------------|
| **PostgreSQL** | ✅ Full MVCC | Row versions in main table |
| **MySQL InnoDB** | ✅ MVCC + Locking | Undo logs for old versions |
| **Oracle** | ✅ MVCC | Undo tablespaces |
| **SQL Server** | ✅ Snapshot Isolation (optional) | Version store in tempdb |
| **SQLite** | ✅ MVCC | WAL mode |
| **MongoDB** | ✅ MVCC | WiredTiger storage engine |

#### **PostgreSQL MVCC:**
```sql
-- PostgreSQL uses tuple versioning
CREATE TABLE accounts (id INT, balance DECIMAL(10,2));
INSERT INTO accounts VALUES (1, 1000);

-- Transaction 1
BEGIN;
UPDATE accounts SET balance = 1500 WHERE id = 1;  -- Creates new tuple version
-- Old version still exists for concurrent readers

-- Transaction 2 (concurrent)
BEGIN;
SELECT balance FROM accounts WHERE id = 1;  -- Reads old version (1000)
COMMIT;

-- Transaction 1 continues
COMMIT;  -- New version becomes visible to new transactions
```

#### **MySQL InnoDB MVCC:**
```sql
-- MySQL uses undo logs for MVCC
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;

SELECT balance FROM accounts WHERE id = 1;  -- Creates consistent read view
-- InnoDB uses undo logs to reconstruct old versions if needed

-- Concurrent updates create undo log entries
-- Original read view remains consistent

SELECT balance FROM accounts WHERE id = 1;  -- Same result as first SELECT
COMMIT;
```

#### **Oracle MVCC:**
```sql
-- Oracle uses undo tablespaces
ALTER SYSTEM SET undo_retention = 3600;  -- Keep undo for 1 hour

BEGIN;
SELECT balance FROM accounts WHERE id = 1;  -- SCN (System Change Number) recorded
-- Oracle reconstructs old version from undo if needed

-- Concurrent changes stored in undo tablespace

SELECT balance FROM accounts WHERE id = 1;  -- Consistent with original SCN
COMMIT;
```

### How does MVCC handle concurrent reads and writes?

#### **1. Read-Write Concurrency:**

**Scenario: Long-running Report + Concurrent Updates**
```sql
-- Long-running analytics query (Session 1)
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;  -- MVCC snapshot created
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary
FROM employees 
GROUP BY department;  -- Takes 30 minutes to run

-- Meanwhile, HR updates happen (Session 2, 3, 4...)
-- Session 2
INSERT INTO employees (name, department, salary) VALUES ('New Hire', 'IT', 60000);

-- Session 3  
UPDATE employees SET salary = 65000 WHERE id = 123;

-- Session 4
DELETE FROM employees WHERE id = 456;

-- Original analytics query continues unaffected
-- Uses consistent snapshot from transaction start
-- Results based on data state when transaction began
COMMIT;  -- Analytics complete
```

#### **2. Write-Write Conflicts:**

**MVCC handles write conflicts differently:**
```sql
-- Transaction 1
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;  -- Creates new version
-- Holds exclusive lock on current version

-- Transaction 2 (concurrent)
BEGIN;
UPDATE accounts SET balance = balance - 300 WHERE id = 1;  -- WAITS for lock
-- Cannot modify same row until T1 commits/rollbacks

-- T1 commits
COMMIT;  -- New version (500 less) becomes current, lock released

-- T2 continues with new current version
-- UPDATE now applies to 500 less balance, not original balance
COMMIT;  -- Final result: original - 500 - 300
```

#### **3. Multi-Reader Scenarios:**

```sql
-- Multiple concurrent readers, no blocking
-- Reader 1
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT SUM(balance) FROM accounts;  -- Snapshot at time T1

-- Reader 2  
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT AVG(balance) FROM accounts;  -- Snapshot at time T2 (slightly later)

-- Reader 3
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT MAX(balance) FROM accounts;  -- Fresh read each time

-- Writer (concurrent with all readers)
UPDATE accounts SET balance = balance * 1.05;  -- 5% interest
COMMIT;

-- All readers continue without blocking
-- Reader 1: Consistent sum based on T1 snapshot
-- Reader 2: Consistent average based on T2 snapshot  
-- Reader 3: May see updated values after writer commits
```

### MVCC Implementation Details:

#### **Version Cleanup (Garbage Collection):**

**PostgreSQL VACUUM:**
```sql
-- Old tuple versions need cleanup
VACUUM accounts;  -- Removes old versions no longer needed

-- Automatic vacuum configuration
ALTER TABLE accounts SET (autovacuum_enabled = true);

-- Monitor table bloat from old versions
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup,
    n_dead_tup::float / n_live_tup as bloat_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 0;
```

**MySQL InnoDB Purge:**
```sql
-- InnoDB automatically purges old undo log entries
SHOW ENGINE INNODB STATUS\G
-- Look for "Purge done for trx's" information

-- Configure purge threads
SET GLOBAL innodb_purge_threads = 4;
```

#### **Storage Overhead:**

**MVCC Storage Impact:**
```sql
-- Example: Table with frequent updates
CREATE TABLE high_update_table (
    id INT PRIMARY KEY,
    data VARCHAR(1000),
    last_modified TIMESTAMP
);

-- After many updates, storage comparison:
-- Traditional locking: 1 row = ~1KB
-- MVCC with history: 1 logical row might use 5KB+ for version history

-- Monitor version overhead
-- PostgreSQL
SELECT 
    pg_size_pretty(pg_total_relation_size('high_update_table')) as total_size,
    pg_size_pretty(pg_relation_size('high_update_table')) as table_size;

-- MySQL
SELECT 
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS total_mb,
    ROUND(data_free / 1024 / 1024, 2) AS free_mb
FROM information_schema.tables 
WHERE table_name = 'high_update_table';
```

### MVCC Benefits and Trade-offs:

**Benefits:**
- ✅ **High Concurrency:** Readers don't block writers, writers don't block readers
- ✅ **Consistent Reads:** Snapshot isolation provides consistent view
- ✅ **No Deadlocks:** Between readers and writers
- ✅ **Better Performance:** Reduced lock contention

**Trade-offs:**
- ❌ **Storage Overhead:** Multiple versions consume more space
- ❌ **Cleanup Overhead:** Garbage collection needed for old versions
- ❌ **Memory Usage:** Version information stored in memory
- ❌ **Complex Implementation:** More sophisticated than simple locking

### Real-world MVCC Applications:

#### **1. Analytics + OLTP Workload:**
```sql
-- Analytics query runs for hours
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT 
    product_category,
    SUM(sales_amount) as total_sales,
    COUNT(*) as transaction_count
FROM sales_transactions 
WHERE sale_date >= '2023-01-01'
GROUP BY product_category;  -- Long-running query

-- Meanwhile, OLTP continues normally
INSERT INTO sales_transactions (customer_id, product_id, amount) VALUES (...);
UPDATE inventory SET stock = stock - 1 WHERE product_id = 'P001';
-- No interference with analytics query

COMMIT;  -- Analytics complete with consistent results
```

#### **2. Web Application with High Read Load:**
```sql
-- Product catalog with frequent price updates
-- Many users browsing (readers)
SELECT product_name, price, description FROM products WHERE category = 'Electronics';

-- Admin updating prices (writer)
UPDATE products SET price = price * 0.9 WHERE category = 'Electronics';  -- 10% discount

-- Users continue browsing without interruption
-- New users see updated prices, existing sessions remain consistent
```

#### **3. Financial Reporting:**
```sql
-- Month-end financial reports
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;  -- Highest consistency
SELECT 
    account_type,
    SUM(balance) as total_balance
FROM accounts 
WHERE report_date = '2023-12-31'
GROUP BY account_type;

-- Day-to-day banking operations continue
-- Account updates, transfers, etc. don't affect report consistency
-- Report sees point-in-time snapshot of data

COMMIT;  -- Consistent month-end numbers
```

MVCC হল modern database systems এর backbone, যা high-performance applications এ excellent concurrency এবং consistency provide করে। এটি especially beneficial যেখানে read-heavy workloads আছে এবং analytical queries এর সাথে transactional operations parallel এ চলতে হয়।

---
