---
sidebar_position: 3
title: 'ACID Properties'
---

# ACID Properties

ACID properties হলো database transaction এর চারটি fundamental characteristic যা data integrity এবং reliability ensure করে।

## ৩. What are ACID properties?

**ACID** হলো database transaction এর চারটি essential property এর acronym:
- **A**tomicity (পরমাণুতা)
- **C**onsistency (সামঞ্জস্য)
- **I**solation (বিচ্ছিন্নতা)  
- **D**urability (স্থায়িত্ব)

এই properties ensure করে যে database transaction গুলো reliable, consistent এবং error-resistant হয়।

#### ১. **Atomicity (পরমাণুতা)**:

Transaction এর সব operation হয় completely execute হবে নাহয় কিছুই হবে না।

```sql
-- Banking transfer example
BEGIN TRANSACTION;

-- Step 1: Deduct from sender account
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';

-- Step 2: Add to receiver account  
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A002';

-- Step 3: Log the transaction
INSERT INTO transaction_log (from_account, to_account, amount, timestamp) 
VALUES ('A001', 'A002', 1000, NOW());

-- Either all three operations succeed, or none of them do
COMMIT;
```

#### ২. **Consistency (সামঞ্জস্য)**:

Transaction completion এর পর database valid state এ থাকবে, সব business rule এবং constraint maintain হবে।

```sql
-- Consistency example: Account balance constraints
CREATE TABLE accounts (
    account_id VARCHAR(10) PRIMARY KEY,
    balance DECIMAL(10,2) CHECK (balance >= 0),  -- Balance cannot be negative
    account_type VARCHAR(20) NOT NULL
);

-- This transaction will maintain consistency
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'A002';
COMMIT;

-- This would violate consistency (if A001 has less than 1000 balance)
-- UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
-- Transaction would be rolled back to maintain consistency
```

#### ৩. **Isolation (বিচ্ছিন্নতা)**:

Concurrent transaction গুলো একে অপরকে interfere করবে না।

```sql
-- Two concurrent transactions
-- Transaction 1: Transfer money
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A001'; -- Reads 1000
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'A002';
COMMIT;

-- Transaction 2: Check balance (concurrent)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE account_id = 'A001'; -- Should not see intermediate state
COMMIT;

-- Isolation ensures Transaction 2 sees either 1000 (before T1) or 500 (after T1)
-- Never sees any intermediate inconsistent state
```

#### ৪. **Durability (স্থায়িত্ব)**:

Committed transaction এর changes permanently stored হবে, system failure হলেও।

```sql
-- Example: Order placement
BEGIN TRANSACTION;
INSERT INTO orders (order_id, customer_id, total_amount) 
VALUES (12345, 678, 99.99);

INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (12345, 'P001', 2);

UPDATE products SET stock_quantity = stock_quantity - 2 WHERE product_id = 'P001';

COMMIT; -- Once committed, this data survives system crashes
```

### Why are they important?

ACID properties business-critical application এর জন্য absolutely essential:

#### ১. **Data Integrity Protection**:

```sql
-- Without ACID: Possible data corruption scenario
-- E-commerce order processing without atomicity:

-- Step 1: Deduct inventory (succeeds)
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE product_id = 'P001';

-- Step 2: Create order (fails due to system crash)
-- INSERT INTO orders (...) -- FAILS

-- Result: Stock reduced but no order created = Lost sale + Wrong inventory
```

#### ২. **Business Rule Enforcement**:

```sql
-- Banking example: Account balance rules
CREATE TABLE accounts (
    account_id VARCHAR(10),
    balance DECIMAL(10,2) CHECK (balance >= 0),
    credit_limit DECIMAL(10,2)
);

-- ACID ensures business rules are never violated
-- Even during high concurrent load or system failures
BEGIN TRANSACTION;
-- Complex business logic with multiple validations
IF (sender_balance - transfer_amount >= 0) THEN
    -- Proceed with transfer
    UPDATE accounts SET balance = balance - transfer_amount WHERE account_id = sender;
    UPDATE accounts SET balance = balance + transfer_amount WHERE account_id = receiver;
    COMMIT;
ELSE
    ROLLBACK; -- Maintain consistency
END IF;
```

#### ৩. **Concurrent User Support**:

```sql
-- Multiple users booking same airline seat
-- Without isolation, both users might get same seat

-- User 1: Books seat 12A
BEGIN TRANSACTION;
SELECT status FROM seats WHERE seat_number = '12A' AND flight_id = 'FL001';
-- Status: 'available'
UPDATE seats SET status = 'booked', passenger_id = 'P001' 
WHERE seat_number = '12A' AND flight_id = 'FL001';
COMMIT;

-- User 2: Simultaneously tries to book seat 12A  
BEGIN TRANSACTION;
SELECT status FROM seats WHERE seat_number = '12A' AND flight_id = 'FL001';
-- Isolation ensures this sees either 'available' or 'booked', never intermediate state
-- Prevents double booking
```

#### ৪. **System Reliability**:

```sql
-- Example: Hospital patient record update
-- Durability ensures critical data survives system crashes

BEGIN TRANSACTION;
-- Update patient medical history
UPDATE patients SET medical_history = medical_history || 'New diagnosis: Diabetes' 
WHERE patient_id = 'P12345';

-- Record medication prescription
INSERT INTO prescriptions (patient_id, medication, dosage, prescribed_date)
VALUES ('P12345', 'Metformin', '500mg twice daily', CURRENT_DATE);

-- Update doctor's notes
INSERT INTO doctor_notes (patient_id, doctor_id, notes, visit_date)
VALUES ('P12345', 'D567', 'Patient diagnosed with Type 2 diabetes', CURRENT_DATE);

COMMIT; -- Durability ensures this critical medical data is permanently saved
```

### Which ACID property is most critical in banking systems?

**Atomicity** এবং **Consistency** banking system এ সবচেয়ে critical, তবে সব four properties equally important।

#### **Atomicity এর গুরুত্ব**:

```sql
-- Money transfer scenario - Atomicity is CRITICAL
BEGIN TRANSACTION;

-- Step 1: Check sufficient balance
SELECT balance FROM accounts WHERE account_id = 'ACC001' FOR UPDATE;
-- Balance: $1000, Transfer amount: $500

-- Step 2: Deduct from sender
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'ACC001';

-- Step 3: Add to receiver  
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'ACC002';

-- Step 4: Record transaction
INSERT INTO transaction_history (from_acc, to_acc, amount, timestamp)
VALUES ('ACC001', 'ACC002', 500, NOW());

-- CRITICAL: Either ALL steps succeed or NONE
-- If any step fails, entire transaction must rollback
-- Otherwise money could disappear or be created from nothing!
COMMIT;
```

#### **Consistency এর গুরুত্ব**:

```sql
-- Banking business rules that MUST be maintained
CREATE TABLE accounts (
    account_id VARCHAR(20) PRIMARY KEY,
    balance DECIMAL(15,2) CHECK (balance >= minimum_balance),
    account_type VARCHAR(20) NOT NULL,
    minimum_balance DECIMAL(15,2) DEFAULT 0,
    daily_withdrawal_limit DECIMAL(15,2),
    status VARCHAR(20) CHECK (status IN ('active', 'frozen', 'closed'))
);

-- Every transaction must maintain these invariants:
-- 1. Balance never goes below minimum
-- 2. Daily withdrawal limits are respected  
-- 3. Frozen accounts cannot perform transactions
-- 4. Total money in system remains constant (for transfers)

-- Example of consistency check
BEGIN TRANSACTION;
DECLARE @current_balance DECIMAL(15,2);
DECLARE @minimum_balance DECIMAL(15,2);
DECLARE @withdrawal_amount DECIMAL(15,2) = 1000;

SELECT @current_balance = balance, @minimum_balance = minimum_balance 
FROM accounts WHERE account_id = 'ACC001';

IF (@current_balance - @withdrawal_amount >= @minimum_balance) THEN
    UPDATE accounts SET balance = balance - @withdrawal_amount 
    WHERE account_id = 'ACC001';
    COMMIT;
ELSE
    ROLLBACK; -- Maintain consistency - insufficient funds
END IF;
```

#### **Real Banking Scenario**:

```sql
-- ATM withdrawal with all ACID properties
-- Atomicity: All steps or nothing
-- Consistency: Business rules maintained
-- Isolation: Multiple ATM users don't interfere
-- Durability: Transaction recorded permanently

BEGIN TRANSACTION; -- ATM withdrawal of $200

-- 1. Verify account status and balance (Consistency check)
SELECT balance, status, daily_withdrawal_limit, 
       (SELECT COALESCE(SUM(amount), 0) FROM transactions 
        WHERE account_id = 'ATM001' AND DATE(transaction_date) = CURDATE() 
        AND transaction_type = 'withdrawal') as today_withdrawal
FROM accounts WHERE account_id = 'ATM001' FOR UPDATE;

-- 2. Business rule validation
IF (status = 'active' AND 
    balance >= 200 AND 
    today_withdrawal + 200 <= daily_withdrawal_limit) THEN
    
    -- 3. Deduct money (Atomicity - part 1)
    UPDATE accounts SET balance = balance - 200 WHERE account_id = 'ATM001';
    
    -- 4. Record transaction (Atomicity - part 2)
    INSERT INTO transactions (account_id, transaction_type, amount, timestamp, atm_id)
    VALUES ('ATM001', 'withdrawal', 200, NOW(), 'ATM_BRANCH_01');
    
    -- 5. Update ATM cash count (Atomicity - part 3)
    UPDATE atm_cash_inventory SET cash_amount = cash_amount - 200 
    WHERE atm_id = 'ATM_BRANCH_01';
    
    COMMIT; -- Durability ensures permanent record
ELSE
    ROLLBACK; -- Consistency maintained
END IF;
```

### Can you give an example where each property is violated?

#### ১. **Atomicity Violation**:

```sql
-- BAD EXAMPLE: Transfer without proper transaction handling
-- This violates atomicity

-- Step 1: Deduct from sender (executes successfully)
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';

-- SYSTEM CRASHES HERE before next statement

-- Step 2: Add to receiver (never executes due to crash)  
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A002';

-- RESULT: Money disappeared from A001 but never reached A002
-- Atomicity violated - partial transaction completed

-- CORRECT APPROACH:
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A002';
COMMIT; -- Both operations succeed or both fail
```

#### ২. **Consistency Violation**:

```sql
-- BAD EXAMPLE: Violating business rules
-- Account balance constraint: balance >= 0

-- Current state: Account A001 has $500
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
-- RESULT: Account A001 now has -$500 (NEGATIVE BALANCE!)

-- This violates consistency rule that balance cannot be negative
-- Database should reject this transaction

-- CORRECT APPROACH:
BEGIN TRANSACTION;
DECLARE @current_balance DECIMAL(10,2);
SELECT @current_balance = balance FROM accounts WHERE account_id = 'A001';

IF (@current_balance >= 1000) THEN
    UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
    COMMIT;
ELSE
    ROLLBACK; -- Reject transaction to maintain consistency
END IF;
```

#### ৩. **Isolation Violation**:

```sql
-- BAD EXAMPLE: Dirty read problem
-- Two transactions running concurrently without proper isolation

-- Transaction 1: Update account balance
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'A001';
-- Don't commit yet - still in progress

-- Transaction 2: Read account balance (DIRTY READ!)
SELECT balance FROM accounts WHERE account_id = 'A001';
-- Reads the uncommitted value (dirty data)
-- What if Transaction 1 rolls back? Transaction 2 used wrong data!

-- Transaction 1: Rollback due to error
ROLLBACK;

-- RESULT: Transaction 2 made decisions based on data that never actually existed
-- Isolation violated - transactions interfered with each other

-- CORRECT APPROACH: Use proper isolation levels
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- This prevents reading uncommitted data
```

#### ৪. **Durability Violation**:

```sql
-- BAD EXAMPLE: Lost committed data
-- This typically happens due to improper database configuration

-- User completes online purchase
BEGIN TRANSACTION;
INSERT INTO orders (order_id, customer_id, total_amount)
VALUES (12345, 678, 299.99);

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 'P001';

UPDATE customer_accounts SET loyalty_points = loyalty_points + 30 
WHERE customer_id = 678;

COMMIT; -- Transaction committed successfully
-- User receives confirmation email

-- DATABASE CRASH occurs but changes are lost because:
-- 1. Write-ahead logging not properly configured
-- 2. Data not flushed to disk
-- 3. Backup/recovery mechanism failed

-- RESULT: Customer charged money, got confirmation, but order lost
-- Durability violated - committed data not permanently stored

-- CORRECT APPROACH: Proper database configuration
-- 1. Enable write-ahead logging (WAL)
-- 2. Configure proper sync/flush settings  
-- 3. Regular backups and tested recovery procedures
```

#### **Real-world Impact of ACID Violations**:

| Property Violated | Real-world Impact | Business Cost |
|------------------|-------------------|---------------|
| **Atomicity** | Partial transactions, money disappears | Loss of customer trust, financial liability |
| **Consistency** | Invalid data states, broken business rules | Compliance violations, operational chaos |
| **Isolation** | Race conditions, incorrect calculations | Wrong reports, poor decisions |
| **Durability** | Lost transactions, data disappears | Customer complaints, legal issues |

#### **Industries Where ACID Compliance is Critical**:

```sql
-- 1. BANKING: Money transfers, account management
-- 2. E-COMMERCE: Order processing, inventory management
-- 3. HEALTHCARE: Patient records, prescription management  
-- 4. AVIATION: Seat booking, flight management
-- 5. FINANCE: Stock trading, portfolio management
-- 6. INSURANCE: Claims processing, policy management

-- Example: Stock trading system
BEGIN TRANSACTION;
-- Buy 100 shares of AAPL at $150 each

-- 1. Check account balance (Consistency)
-- 2. Deduct $15,000 from cash account (Atomicity part 1)
-- 3. Add 100 AAPL shares to portfolio (Atomicity part 2)  
-- 4. Record trade in transaction log (Atomicity part 3)
-- 5. Update market data (Isolation ensures other trades don't interfere)

COMMIT; -- Durability ensures trade is permanently recorded
```

### **Summary**:

ACID properties একসাথে কাজ করে database system এর reliability ensure করতে:

- **Atomicity**: "All or nothing" - partial failure থেকে protect করে
- **Consistency**: Business rule violation prevent করে  
- **Isolation**: Concurrent transaction এর interference avoid করে
- **Durability**: Committed data এর permanent storage guarantee করে

এই চারটি property ছাড়া modern business application এ database ব্যবহার করা অত্যন্ত risky এবং unreliable হবে।