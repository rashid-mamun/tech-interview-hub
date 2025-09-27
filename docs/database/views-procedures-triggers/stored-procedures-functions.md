---
sidebar_position: 2
title: "Stored Procedures & Functions"
description: "Database stored procedures, functions এবং UDFs সম্পর্কে বিস্তারিত আলোচনা"
---

# Stored Procedures & Functions

## **64. What is a stored procedure?**

**Stored Procedure** হল pre-compiled SQL statements এর একটি collection যা database এ stored থাকে এবং একটি name দিয়ে call করা যায়। এটি complex business logic implement করার জন্য ব্যবহার হয়।

**Technical definition:** Stored procedure হল named database object যা SQL statements, control structures, variables, এবং exception handling contain করে এবং database server এ execute হয়।

### Basic Stored Procedure Syntax:

#### **MySQL Stored Procedure:**
```sql
DELIMITER //
CREATE PROCEDURE procedure_name(
    IN input_param INT,
    OUT output_param VARCHAR(100),
    INOUT inout_param DECIMAL(10,2)
)
BEGIN
    -- Variable declarations
    DECLARE local_var INT DEFAULT 0;
    
    -- Procedure logic
    SELECT COUNT(*) INTO local_var FROM employees WHERE department_id = input_param;
    
    SET output_param = CONCAT('Found ', local_var, ' employees');
    SET inout_param = inout_param * 1.1;
END //
DELIMITER ;

-- Calling procedure
CALL procedure_name(5, @result, @value);
SELECT @result, @value;
```

#### **PostgreSQL Stored Procedure:**
```sql
CREATE OR REPLACE PROCEDURE process_employee_data(
    dept_id INT,
    OUT total_employees INT,
    INOUT budget DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    avg_salary DECIMAL(10,2);
BEGIN
    -- Get employee count
    SELECT COUNT(*) INTO total_employees
    FROM employees 
    WHERE department_id = dept_id;
    
    -- Calculate average salary
    SELECT AVG(salary) INTO avg_salary
    FROM employees 
    WHERE department_id = dept_id;
    
    -- Adjust budget based on average salary
    budget := budget + (avg_salary * total_employees * 0.1);
    
    -- Log the operation
    INSERT INTO procedure_log (procedure_name, execution_time, parameters)
    VALUES ('process_employee_data', NOW(), dept_id::TEXT);
END;
$$;

-- Calling procedure
CALL process_employee_data(10, NULL, 100000.00);
```

### Complex Business Logic Examples:

#### **E-commerce Order Processing:**
```sql
DELIMITER //
CREATE PROCEDURE process_order(
    IN customer_id INT,
    IN product_list JSON,  -- [{"product_id": "P001", "quantity": 2}, ...]
    IN payment_method VARCHAR(50),
    OUT order_id INT,
    OUT total_amount DECIMAL(10,2),
    OUT status_message VARCHAR(255)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE item_product_id VARCHAR(50);
    DECLARE item_quantity INT;
    DECLARE item_price DECIMAL(10,2);
    DECLARE item_stock INT;
    DECLARE line_total DECIMAL(10,2);
    DECLARE customer_discount DECIMAL(5,2) DEFAULT 0.0;
    DECLARE tax_rate DECIMAL(5,4) DEFAULT 0.15;
    DECLARE final_total DECIMAL(10,2) DEFAULT 0.0;
    DECLARE item_count INT DEFAULT 0;
    
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET status_message = 'Order processing failed due to database error';
        SET order_id = 0;
    END;
    
    -- Validate customer
    IF NOT EXISTS (SELECT 1 FROM customers WHERE customer_id = customer_id AND status = 'ACTIVE') THEN
        SET status_message = 'Invalid or inactive customer';
        SET order_id = 0;
        LEAVE;
    END IF;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Create order record
    INSERT INTO orders (customer_id, order_date, status, payment_method)
    VALUES (customer_id, NOW(), 'PROCESSING', payment_method);
    
    SET order_id = LAST_INSERT_ID();
    
    -- Get customer discount tier
    SELECT 
        CASE customer_tier
            WHEN 'PLATINUM' THEN 15.0
            WHEN 'GOLD' THEN 10.0
            WHEN 'SILVER' THEN 5.0
            ELSE 0.0
        END
    INTO customer_discount
    FROM customers 
    WHERE customer_id = customer_id;
    
    -- Process each item in the order
    SET item_count = JSON_LENGTH(product_list);
    
    process_items: WHILE item_count > 0 DO
        -- Extract item details from JSON
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(product_list, CONCAT('$[', item_count - 1, '].product_id'))),
            JSON_EXTRACT(product_list, CONCAT('$[', item_count - 1, '].quantity'))
        INTO item_product_id, item_quantity;
        
        -- Validate product and get details
        SELECT price, stock_quantity
        INTO item_price, item_stock
        FROM products
        WHERE product_id = item_product_id AND status = 'ACTIVE';
        
        IF item_price IS NULL THEN
            ROLLBACK;
            SET status_message = CONCAT('Product not found: ', item_product_id);
            SET order_id = 0;
            LEAVE;
        END IF;
        
        -- Check stock availability
        IF item_stock < item_quantity THEN
            ROLLBACK;
            SET status_message = CONCAT('Insufficient stock for product: ', item_product_id, 
                                      '. Available: ', item_stock, ', Requested: ', item_quantity);
            SET order_id = 0;
            LEAVE;
        END IF;
        
        -- Calculate line total
        SET line_total = item_price * item_quantity;
        
        -- Insert order item
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
        VALUES (order_id, item_product_id, item_quantity, item_price, line_total);
        
        -- Update product stock
        UPDATE products 
        SET stock_quantity = stock_quantity - item_quantity,
            reserved_stock = reserved_stock + item_quantity
        WHERE product_id = item_product_id;
        
        -- Add to total
        SET final_total = final_total + line_total;
        
        -- Create inventory movement record
        INSERT INTO inventory_movements (product_id, movement_type, quantity, order_id, movement_date)
        VALUES (item_product_id, 'RESERVED', item_quantity, order_id, NOW());
        
        SET item_count = item_count - 1;
    END WHILE process_items;
    
    -- Apply customer discount
    IF customer_discount > 0 THEN
        SET final_total = final_total * (1 - customer_discount / 100);
        
        INSERT INTO order_discounts (order_id, discount_type, discount_percentage, discount_amount)
        VALUES (order_id, 'CUSTOMER_TIER', customer_discount, final_total * customer_discount / 100);
    END IF;
    
    -- Apply tax
    SET final_total = final_total * (1 + tax_rate);
    
    -- Update order with final total
    UPDATE orders 
    SET total_amount = final_total,
        tax_amount = final_total * tax_rate / (1 + tax_rate),
        discount_amount = COALESCE((SELECT SUM(discount_amount) FROM order_discounts WHERE order_id = order_id), 0),
        updated_at = NOW()
    WHERE order_id = order_id;
    
    -- Process payment
    CALL process_payment(order_id, final_total, payment_method, @payment_status, @payment_message);
    
    IF @payment_status = 'SUCCESS' THEN
        -- Update order status
        UPDATE orders SET status = 'CONFIRMED' WHERE order_id = order_id;
        
        -- Update customer statistics
        UPDATE customer_statistics 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + final_total,
            last_order_date = NOW()
        WHERE customer_id = customer_id;
        
        -- Check for loyalty points
        INSERT INTO loyalty_points (customer_id, points_earned, transaction_type, order_id, earned_date)
        VALUES (customer_id, FLOOR(final_total * 0.01), 'ORDER', order_id, NOW());
        
        COMMIT;
        SET total_amount = final_total;
        SET status_message = 'Order processed successfully';
        
    ELSE
        -- Payment failed
        ROLLBACK;
        SET status_message = CONCAT('Payment failed: ', @payment_message);
        SET order_id = 0;
    END IF;
    
END //
DELIMITER ;

-- Usage example
SET @product_json = '[
    {"product_id": "P001", "quantity": 2},
    {"product_id": "P002", "quantity": 1},
    {"product_id": "P003", "quantity": 3}
]';

CALL process_order(12345, @product_json, 'CREDIT_CARD', @order_id, @total, @message);
SELECT @order_id as order_id, @total as total_amount, @message as status;
```

#### **Employee Payroll Processing:**
```sql
DELIMITER //
CREATE PROCEDURE calculate_monthly_payroll(
    IN target_month INT,
    IN target_year INT,
    OUT total_processed INT,
    OUT total_payroll DECIMAL(15,2)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_name VARCHAR(100);
    DECLARE base_salary DECIMAL(10,2);
    DECLARE overtime_hours DECIMAL(5,2);
    DECLARE performance_bonus DECIMAL(10,2);
    DECLARE deductions DECIMAL(10,2);
    DECLARE net_salary DECIMAL(10,2);
    DECLARE tax_amount DECIMAL(10,2);
    
    -- Cursor for active employees
    DECLARE payroll_cursor CURSOR FOR
        SELECT 
            e.employee_id,
            e.name,
            e.salary,
            COALESCE(at.overtime_hours, 0) as overtime_hours,
            COALESCE(pb.bonus_amount, 0) as performance_bonus,
            COALESCE(d.total_deductions, 0) as deductions
        FROM employees e
        LEFT JOIN (
            SELECT employee_id, SUM(overtime_hours) as overtime_hours
            FROM attendance
            WHERE MONTH(attendance_date) = target_month 
            AND YEAR(attendance_date) = target_year
            GROUP BY employee_id
        ) at ON e.employee_id = at.employee_id
        LEFT JOIN (
            SELECT employee_id, SUM(bonus_amount) as bonus_amount
            FROM performance_bonuses
            WHERE bonus_month = target_month AND bonus_year = target_year
            GROUP BY employee_id
        ) pb ON e.employee_id = pb.employee_id
        LEFT JOIN (
            SELECT employee_id, SUM(deduction_amount) as total_deductions
            FROM employee_deductions
            WHERE deduction_month = target_month AND deduction_year = target_year
            GROUP BY employee_id
        ) d ON e.employee_id = d.employee_id
        WHERE e.status = 'ACTIVE';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET total_processed = 0;
    SET total_payroll = 0;
    
    -- Clear previous payroll data for this month
    DELETE FROM payroll_records 
    WHERE payroll_month = target_month AND payroll_year = target_year;
    
    OPEN payroll_cursor;
    
    payroll_loop: LOOP
        FETCH payroll_cursor INTO emp_id, emp_name, base_salary, overtime_hours, performance_bonus, deductions;
        
        IF done THEN
            LEAVE payroll_loop;
        END IF;
        
        -- Calculate overtime pay (1.5x hourly rate)
        SET net_salary = base_salary + (base_salary / 160 * overtime_hours * 1.5) + performance_bonus;
        
        -- Calculate tax based on salary brackets
        SET tax_amount = CASE
            WHEN net_salary <= 25000 THEN 0
            WHEN net_salary <= 50000 THEN (net_salary - 25000) * 0.1
            WHEN net_salary <= 100000 THEN 2500 + (net_salary - 50000) * 0.15
            ELSE 10000 + (net_salary - 100000) * 0.25
        END;
        
        -- Apply deductions and tax
        SET net_salary = net_salary - deductions - tax_amount;
        
        -- Insert payroll record
        INSERT INTO payroll_records (
            employee_id, payroll_month, payroll_year,
            base_salary, overtime_pay, bonus_amount,
            gross_salary, tax_amount, deductions,
            net_salary, processed_date
        ) VALUES (
            emp_id, target_month, target_year,
            base_salary, (base_salary / 160 * overtime_hours * 1.5), performance_bonus,
            base_salary + (base_salary / 160 * overtime_hours * 1.5) + performance_bonus,
            tax_amount, deductions, net_salary, NOW()
        );
        
        -- Update counters
        SET total_processed = total_processed + 1;
        SET total_payroll = total_payroll + net_salary;
        
        -- Generate pay slip
        INSERT INTO pay_slips (
            employee_id, payroll_month, payroll_year,
            pay_slip_data, generated_date
        ) VALUES (
            emp_id, target_month, target_year,
            JSON_OBJECT(
                'employee_name', emp_name,
                'base_salary', base_salary,
                'overtime_hours', overtime_hours,
                'overtime_pay', ROUND(base_salary / 160 * overtime_hours * 1.5, 2),
                'performance_bonus', performance_bonus,
                'gross_salary', ROUND(base_salary + (base_salary / 160 * overtime_hours * 1.5) + performance_bonus, 2),
                'tax_amount', ROUND(tax_amount, 2),
                'deductions', deductions,
                'net_salary', ROUND(net_salary, 2)
            ),
            NOW()
        );
        
    END LOOP;
    
    CLOSE payroll_cursor;
    
    -- Update payroll summary
    INSERT INTO payroll_summary (
        payroll_month, payroll_year, total_employees,
        total_gross_pay, total_tax, total_deductions,
        total_net_pay, processed_date
    ) VALUES (
        target_month, target_year, total_processed,
        (SELECT SUM(gross_salary) FROM payroll_records WHERE payroll_month = target_month AND payroll_year = target_year),
        (SELECT SUM(tax_amount) FROM payroll_records WHERE payroll_month = target_month AND payroll_year = target_year),
        (SELECT SUM(deductions) FROM payroll_records WHERE payroll_month = target_month AND payroll_year = target_year),
        total_payroll, NOW()
    );
    
END //
DELIMITER ;

-- Execute payroll for December 2024
CALL calculate_monthly_payroll(12, 2024, @processed_count, @total_payroll);
SELECT @processed_count as employees_processed, @total_payroll as total_payroll_amount;
```

### Parameter Types:

#### **IN, OUT, INOUT Parameters:**
```sql
DELIMITER //
CREATE PROCEDURE demo_parameters(
    IN input_value INT,           -- Input only
    OUT output_value VARCHAR(100), -- Output only
    INOUT modify_value DECIMAL(10,2) -- Input and Output
)
BEGIN
    DECLARE result_count INT;
    
    -- Use input parameter
    SELECT COUNT(*) INTO result_count 
    FROM orders 
    WHERE customer_id = input_value;
    
    -- Set output parameter
    SET output_value = CONCAT('Customer has ', result_count, ' orders');
    
    -- Modify input/output parameter
    SET modify_value = modify_value * 1.15; -- Add 15% markup
    
    -- Can also return result sets
    SELECT order_id, order_date, total_amount
    FROM orders 
    WHERE customer_id = input_value
    LIMIT 5;
END //
DELIMITER ;

-- Usage
SET @customer_id = 123;
SET @message = '';
SET @amount = 1000.00;

CALL demo_parameters(@customer_id, @message, @amount);
SELECT @message as customer_info, @amount as marked_up_amount;
```

## **65. Difference between stored procedures and functions?**

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

### Detailed Comparison:

#### **Return Values:**

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
END //
DELIMITER ;

-- Usage
CALL get_employee_stats('IT', @total, @avg, @max);
SELECT @total, @avg, @max;
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
    get_department_avg_salary(department) as avg_salary
FROM departments;
```

#### **Usage in SQL Statements:**

**Functions in Complex Queries:**
```sql
-- Functions can be used anywhere expressions are allowed
SELECT 
    e.name,
    e.salary,
    get_department_avg_salary(e.department) as dept_avg,
    CASE 
        WHEN e.salary > get_department_avg_salary(e.department) THEN 'Above Average'
        ELSE 'Below Average'
    END as performance_category
FROM employees e
WHERE get_department_avg_salary(e.department) > 50000
ORDER BY get_department_avg_salary(e.department) DESC;
```

**Procedures Cannot be Used in Expressions:**
```sql
-- ❌ This will NOT work
-- SELECT name, get_employee_stats('IT') FROM employees;  -- Error!

-- ✅ Must use CALL statement
CALL get_employee_stats('IT', @total, @avg, @max);
```

#### **Side Effects and Transaction Control:**

**Stored Procedure with Side Effects:**
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET result_message = 'Transaction failed';
    END;
    
    START TRANSACTION;
    
    SELECT balance INTO from_balance 
    FROM accounts WHERE account_id = from_account FOR UPDATE;
    
    IF from_balance < amount THEN
        ROLLBACK;
        SET result_message = 'Insufficient funds';
    ELSE
        UPDATE accounts SET balance = balance - amount WHERE account_id = from_account;
        UPDATE accounts SET balance = balance + amount WHERE account_id = to_account;
        
        INSERT INTO transaction_log (from_account, to_account, amount, created_at)
        VALUES (from_account, to_account, amount, NOW());
        
        COMMIT;
        SET result_message = 'Transfer successful';
    END IF;
END //
DELIMITER ;
```

**Function Should be Pure:**
```sql
-- ✅ GOOD: Pure function without side effects
DELIMITER //
CREATE FUNCTION calculate_interest(
    principal DECIMAL(15,2), 
    rate DECIMAL(5,4), 
    time_years INT
)
RETURNS DECIMAL(15,2)
NO SQL
DETERMINISTIC
BEGIN
    RETURN principal * POWER(1 + rate, time_years);
END //
DELIMITER ;
```

### When to Use Each:

#### **Use Stored Procedures When:**
- Complex business operations with multiple steps
- Need transaction control (COMMIT/ROLLBACK)  
- Want to return multiple result sets
- Performing data modifications
- Need comprehensive error handling

#### **Use Functions When:**
- Calculate and return a single value
- Use result in SQL expressions
- Create reusable calculations
- Implement data transformations
- Need deterministic computations

**Summary:** Functions should be **pure** (no side effects) এবং শুধুমাত্র calculations এর জন্য ব্যবহার করা উচিত। Database state modification এর জন্য stored procedures ব্যবহার করা best practice।

---

## **69. What are User-Defined Functions (UDFs)?**

**User-Defined Functions (UDFs)** হল custom functions যা developers নিজেরা create করে specific business logic implement করার জন্য। এগুলো built-in functions এর মতো reusable এবং SQL statements এ directly ব্যবহার করা যায়।

### Types of UDFs:

#### **1. Scalar Functions (Single Value Return):**
```sql
-- Business logic function: Tax calculation
DELIMITER //
CREATE FUNCTION calculate_tax(salary DECIMAL(10,2), tax_rate DECIMAL(5,4))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE tax_amount DECIMAL(10,2);
    
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

-- Usage in SELECT
SELECT 
    employee_id, name, salary,
    calculate_tax(salary, 0.15) as tax_amount,
    salary - calculate_tax(salary, 0.15) as net_salary
FROM employees;
```

#### **2. Table-Valued Functions (PostgreSQL):**
```sql
-- Function returning table data
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
        SELECT 
            e.employee_id,
            e.name::VARCHAR(100),
            1 as level_depth,
            m.name::TEXT as manager_chain
        FROM employees e
        JOIN employees m ON e.manager_id = m.employee_id
        WHERE e.manager_id = $1
        
        UNION ALL
        
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
```

### Complex UDF Examples:

#### **Credit Score Calculation:**
```sql
DELIMITER //
CREATE FUNCTION calculate_credit_score(customer_id INT)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE credit_score INT DEFAULT 300;
    DECLARE payment_history DECIMAL(5,2);
    DECLARE credit_utilization DECIMAL(5,2);
    DECLARE account_age_months INT;
    DECLARE total_orders INT;
    DECLARE payment_delays INT;
    
    -- Payment history (% of on-time payments)
    SELECT 
        COALESCE(
            (COUNT(CASE WHEN payment_date <= due_date THEN 1 END) * 100.0 / COUNT(*)), 
            0
        )
    INTO payment_history
    FROM orders 
    WHERE customer_id = customer_id AND status = 'PAID';
    
    -- Credit utilization
    SELECT 
        COALESCE(
            (SUM(outstanding_amount) * 100.0 / NULLIF(credit_limit, 0)), 
            0
        )
    INTO credit_utilization
    FROM customer_accounts 
    WHERE customer_id = customer_id;
    
    -- Account age
    SELECT TIMESTAMPDIFF(MONTH, MIN(created_at), NOW())
    INTO account_age_months
    FROM customers WHERE customer_id = customer_id;
    
    -- Calculate score components
    SET credit_score = credit_score + ROUND(payment_history * 3.15);  -- 35%
    
    -- Credit utilization impact (lower is better)
    IF credit_utilization <= 10 THEN
        SET credit_score = credit_score + 270;
    ELSEIF credit_utilization <= 30 THEN
        SET credit_score = credit_score + 210;
    ELSE
        SET credit_score = credit_score + 90;
    END IF;
    
    SET credit_score = credit_score + LEAST(account_age_months * 2, 135);  -- 15%
    
    RETURN GREATEST(300, LEAST(850, credit_score));
END //
DELIMITER ;

-- Usage
SELECT 
    customer_id, name,
    calculate_credit_score(customer_id) as credit_score,
    CASE 
        WHEN calculate_credit_score(customer_id) >= 750 THEN 'Excellent'
        WHEN calculate_credit_score(customer_id) >= 700 THEN 'Good'
        ELSE 'Fair'
    END as credit_rating
FROM customers
ORDER BY calculate_credit_score(customer_id) DESC;
```

#### **Dynamic Pricing Function:**
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
NOT DETERMINISTIC
BEGIN
    DECLARE base_price DECIMAL(10,2);
    DECLARE final_price DECIMAL(10,2);
    DECLARE stock_level INT;
    DECLARE tier_discount DECIMAL(5,3) DEFAULT 0.0;
    DECLARE quantity_discount DECIMAL(5,3) DEFAULT 0.0;
    DECLARE seasonal_adjustment DECIMAL(5,3) DEFAULT 1.0;
    
    SELECT price, stock_quantity 
    INTO base_price, stock_level
    FROM products WHERE product_id = product_id;
    
    IF base_price IS NULL THEN RETURN 0; END IF;
    
    -- Customer tier discount
    SET tier_discount = CASE customer_tier
        WHEN 'PLATINUM' THEN 0.20
        WHEN 'GOLD' THEN 0.15
        WHEN 'SILVER' THEN 0.10
        ELSE 0.0
    END;
    
    -- Quantity discount
    SET quantity_discount = CASE 
        WHEN quantity >= 100 THEN 0.15
        WHEN quantity >= 50 THEN 0.10
        WHEN quantity >= 10 THEN 0.05
        ELSE 0.0
    END;
    
    -- Demand-based pricing
    SET final_price = base_price * CASE
        WHEN stock_level <= 10 THEN 1.2   -- Low stock premium
        WHEN stock_level > 500 THEN 0.95  -- Overstock discount
        ELSE 1.0
    END;
    
    -- Seasonal adjustment
    SET seasonal_adjustment = CASE season
        WHEN 'RAMADAN' THEN 1.15
        WHEN 'EID' THEN 1.20
        ELSE 1.0
    END;
    
    SET final_price = final_price * seasonal_adjustment * (1 - tier_discount) * (1 - quantity_discount);
    
    -- Minimum margin protection
    RETURN GREATEST(final_price, base_price * 0.7);
END //
DELIMITER ;

-- Usage in pricing
SELECT 
    p.product_name,
    p.price as base_price,
    get_dynamic_price(p.product_id, 'GOLD', 25, 'RAMADAN') as dynamic_price
FROM products p
WHERE p.category = 'ELECTRONICS';
```

### Function Attributes:

```sql
-- Different function characteristics
DELIMITER //

-- DETERMINISTIC: Same input = same output
CREATE FUNCTION calculate_circle_area(radius DECIMAL(10,2))
RETURNS DECIMAL(15,5)
DETERMINISTIC
BEGIN
    RETURN PI() * radius * radius;
END //

-- NOT DETERMINISTIC: Output can vary
CREATE FUNCTION get_random_discount()
RETURNS DECIMAL(5,2)
NOT DETERMINISTIC
BEGIN
    RETURN ROUND(RAND() * 20, 2);
END //

-- READS SQL DATA: Function reads database
CREATE FUNCTION get_customer_orders(cust_id INT)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM orders WHERE customer_id = cust_id;
    RETURN total;
END //

-- NO SQL: No database access
CREATE FUNCTION compound_interest(
    principal DECIMAL(15,2),
    rate DECIMAL(5,4),
    time_years INT
)
RETURNS DECIMAL(15,2)
NO SQL
DETERMINISTIC
BEGIN
    RETURN principal * POWER(1 + rate, time_years);
END //

DELIMITER ;
```

### Utility Functions:

#### **Date and Validation Functions:**
```sql
-- Business day calculation
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
        
        IF DAYOFWEEK(current_date) NOT IN (1, 7) THEN  -- Skip weekends
            IF NOT EXISTS (SELECT 1 FROM holidays WHERE holiday_date = current_date) THEN
                SET days_added = days_added + 1;
            END IF;
        END IF;
    END WHILE;
    
    RETURN current_date;
END //

-- Phone number formatting
CREATE FUNCTION format_phone_number(phone VARCHAR(50), country_code VARCHAR(10))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE clean_phone VARCHAR(20);
    
    SET clean_phone = REGEXP_REPLACE(phone, '[^0-9]', '');
    
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
            ELSE
                RETURN NULL;
            END IF;
        ELSE
            RETURN clean_phone;
    END CASE;
END //

DELIMITER ;

-- Usage
SELECT 
    customer_id,
    format_phone_number(phone, 'BD') as formatted_phone,
    get_next_business_day(CURDATE(), 3) as delivery_date
FROM customers;
```

UDFs powerful tools যা code reusability এবং business logic encapsulation provide করে, কিন্তু performance implications বিবেচনা করে ব্যবহার করতে হয়।

---

## **70. What is the difference between stored procedures and functions?**

### Comprehensive Comparison:

#### **When to Use Each:**

**Use Stored Procedures When:**
- Need complex business operations with multiple steps
- Require transaction control (COMMIT/ROLLBACK)
- Want to return multiple result sets  
- Need to perform data modifications (INSERT/UPDATE/DELETE)
- Need comprehensive error handling
- Building workflow processes

**Use Functions When:**
- Need to calculate and return a single value
- Want to use the result in SQL expressions (SELECT/WHERE/HAVING)
- Creating reusable calculations
- Implementing data transformations
- Need deterministic computations
- Building utility functions

### Best Practice Templates:

#### **Stored Procedure Template:**
```sql
DELIMITER //
CREATE PROCEDURE template_procedure(
    IN input_param INT,
    OUT success_flag BOOLEAN,
    OUT error_message VARCHAR(500)
)
BEGIN
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
    
    START TRANSACTION;
    
    -- Business operations here
    
    COMMIT;
    SET success_flag = TRUE;
    SET error_message = 'Operation completed successfully';
END //
DELIMITER ;
```

#### **Function Template:**
```sql
DELIMITER //
CREATE FUNCTION template_function(input_value DECIMAL(10,2))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE result DECIMAL(10,2);
    
    -- Input validation
    IF input_value IS NULL OR input_value < 0 THEN
        RETURN 0;
    END IF;
    
    -- Pure calculation logic (no data modifications)
    
    RETURN COALESCE(result, 0);
END //
DELIMITER ;
```

Functions এবং stored procedures দুটোই valuable tools, কিন্তু সঠিক context এ ব্যবহার করা important performance এবং maintainability এর জন্য।

---