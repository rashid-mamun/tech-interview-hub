---
sidebar_position: 3
title: "Triggers & Cursors"
description: "Database triggers, cursors এবং INSTEAD OF triggers সম্পর্কে বিস্তারিত আলোচনা"
---

# Triggers & Cursors

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

### BEFORE vs AFTER Triggers:

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

#### **Data Validation and Transformation:**
```sql
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
    
    -- Normalize data
    SET NEW.email = LOWER(TRIM(NEW.email));
    SET NEW.first_name = CONCAT(UPPER(LEFT(NEW.first_name, 1)), LOWER(SUBSTRING(NEW.first_name, 2)));
    
    -- Set default values
    IF NEW.status IS NULL THEN
        SET NEW.status = 'ACTIVE';
    END IF;
    
    -- Set audit fields
    SET NEW.created_at = NOW();
    SET NEW.created_by = USER();
END //
DELIMITER ;

-- Test validation
INSERT INTO employees (name, email, salary, department)
VALUES ('নতুন কর্মী', 'INVALID-EMAIL', 75000, 'IT');  -- Will fail
```

#### **Business Rule Enforcement:**
```sql
DELIMITER //
CREATE TRIGGER enforce_business_rules_before_update
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Prevent status change if order is already shipped
    IF OLD.status = 'SHIPPED' AND NEW.status != 'DELIVERED' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot modify shipped order except to mark as delivered';
    END IF;
    
    -- Validate total amount changes
    IF NEW.total_amount < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order total cannot be negative';
    END IF;
    
    -- Large order amount changes require approval
    IF ABS(NEW.total_amount - OLD.total_amount) > 1000 THEN
        IF NEW.approval_status IS NULL THEN
            SET NEW.approval_status = 'PENDING';
            SET NEW.requires_approval = TRUE;
        END IF;
    END IF;
    
    -- Update modification tracking
    SET NEW.updated_at = NOW();
    SET NEW.updated_by = USER();
    SET NEW.version = OLD.version + 1;
    
    -- Log significant changes
    IF OLD.status != NEW.status THEN
        INSERT INTO order_status_changes (order_id, old_status, new_status, changed_by, changed_at)
        VALUES (NEW.order_id, OLD.status, NEW.status, USER(), NOW());
    END IF;
END //
DELIMITER ;
```

### AFTER Trigger Examples:

#### **Audit Trail and Logging:**
```sql
DELIMITER //
CREATE TRIGGER employee_salary_audit
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    -- Log salary changes
    IF OLD.salary != NEW.salary THEN
        INSERT INTO employee_audit (
            employee_id, action, field_changed,
            old_value, new_value, changed_by, change_date
        )
        VALUES (
            NEW.employee_id, 'UPDATE', 'salary',
            OLD.salary, NEW.salary, USER(), NOW()
        );
        
        -- Alert for significant salary changes
        IF ABS(NEW.salary - OLD.salary) > OLD.salary * 0.2 THEN
            INSERT INTO hr_alerts (
                alert_type, employee_id, message, severity, created_at
            )
            VALUES (
                'LARGE_SALARY_CHANGE', NEW.employee_id,
                CONCAT('Salary changed by ', 
                    ROUND(((NEW.salary - OLD.salary) / OLD.salary) * 100, 2), '%'),
                'HIGH', NOW()
            );
        END IF;
    END IF;
    
    -- Log department changes
    IF OLD.department_id != NEW.department_id THEN
        INSERT INTO employee_audit (
            employee_id, action, field_changed,
            old_value, new_value, changed_by, change_date
        )
        VALUES (
            NEW.employee_id, 'UPDATE', 'department',
            (SELECT department_name FROM departments WHERE department_id = OLD.department_id),
            (SELECT department_name FROM departments WHERE department_id = NEW.department_id),
            USER(), NOW()
        );
    END IF;
END //
DELIMITER ;
```

#### **Inventory Management:**
```sql
DELIMITER //
CREATE TRIGGER update_inventory_after_order
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    -- Update product stock
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        reserved_stock = reserved_stock + NEW.quantity,
        last_sold_date = NOW()
    WHERE product_id = NEW.product_id;
    
    -- Check for low stock alerts
    IF (SELECT stock_quantity FROM products WHERE product_id = NEW.product_id) < 
       (SELECT minimum_stock_level FROM products WHERE product_id = NEW.product_id) THEN
        
        INSERT INTO inventory_alerts (
            product_id, alert_type, message, priority, created_at
        )
        VALUES (
            NEW.product_id, 'LOW_STOCK',
            CONCAT('Product ', NEW.product_id, ' stock is below minimum level'),
            'HIGH', NOW()
        );
    END IF;
    
    -- Log inventory movement
    INSERT INTO inventory_movements (
        product_id, movement_type, quantity, 
        order_id, movement_date, notes
    )
    VALUES (
        NEW.product_id, 'RESERVED', NEW.quantity,
        NEW.order_id, NOW(), 'Order item reserved'
    );
    
    -- Update product analytics
    INSERT INTO product_sales_stats (product_id, sale_date, quantity_sold, revenue)
    VALUES (NEW.product_id, CURDATE(), NEW.quantity, NEW.quantity * NEW.unit_price)
    ON DUPLICATE KEY UPDATE
        quantity_sold = quantity_sold + NEW.quantity,
        revenue = revenue + (NEW.quantity * NEW.unit_price);
END //
DELIMITER ;
```

### Cascading Triggers:

**Triggers can fire other triggers**, creating a chain reaction called **cascading triggers**.

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
        INSERT INTO price_history (product_id, old_price, new_price, change_date, change_reason)
        VALUES (NEW.product_id, OLD.price, NEW.price, NOW(), 'Manual price update');
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
    
    -- Update product analytics
    UPDATE product_analytics 
    SET price_changes = price_changes + 1,
        last_price_change = NOW(),
        avg_price_change = (avg_price_change + ABS(price_change_percent)) / 2
    WHERE product_id = NEW.product_id;
    
    -- Create notifications for significant changes (will fire Level 3 trigger)
    IF ABS(price_change_percent) > 10 THEN
        INSERT INTO price_change_notifications (
            product_id, change_percent, notification_type, created_at
        )
        VALUES (
            NEW.product_id, price_change_percent,
            IF(price_change_percent > 0, 'PRICE_INCREASE', 'PRICE_DECREASE'),
            NOW()
        );
    END IF;
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
    WHERE w.product_id = NEW.product_id AND w.notify_price_changes = 1;
    
    -- Create marketing campaign for significant price drops
    IF NEW.notification_type = 'PRICE_DECREASE' AND NEW.change_percent < -15 THEN
        INSERT INTO marketing_campaigns (
            product_id, campaign_type, discount_percent, 
            start_date, end_date, status
        )
        VALUES (
            NEW.product_id, 'FLASH_SALE', ABS(NEW.change_percent),
            NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'ACTIVE'
        );
    END IF;
END //
DELIMITER ;

-- Single price update cascades through all levels
UPDATE products SET price = 799.99 WHERE product_id = 'P001';  -- Was 999.99
-- Automatically: logs change → calculates metrics → notifies customers → creates campaigns
```

#### **Preventing Infinite Cascading:**
```sql
DELIMITER //
CREATE TRIGGER safe_cascading_trigger
AFTER UPDATE ON sensitive_table
FOR EACH ROW
BEGIN
    DECLARE cascade_level INT DEFAULT 0;
    
    -- Check current cascade depth
    SELECT COALESCE(@cascade_level, 0) INTO cascade_level;
    
    -- Prevent deep cascading (max 5 levels)
    IF cascade_level < 5 THEN
        SET @cascade_level = cascade_level + 1;
        
        -- Operations that might trigger other triggers
        INSERT INTO cascade_log (level, table_name, action, timestamp)
        VALUES (cascade_level, 'sensitive_table', 'UPDATE', NOW());
        
        -- Reset cascade level
        SET @cascade_level = cascade_level - 1;
    ELSE
        -- Log cascade limit reached
        INSERT INTO error_log (error_type, message, timestamp)
        VALUES ('CASCADE_LIMIT', 'Maximum cascade depth reached', NOW());
    END IF;
END //
DELIMITER ;
```

### Trigger Performance Optimization:

#### **Efficient Trigger Design:**
```sql
DELIMITER //
CREATE TRIGGER efficient_audit_trigger
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Only audit significant changes (avoid unnecessary work)
    IF (OLD.status != NEW.status) OR 
       (ABS(OLD.total_amount - NEW.total_amount) > 0.01) OR
       (OLD.customer_id != NEW.customer_id) THEN
        
        INSERT INTO order_audit (
            order_id, changed_fields, old_values, new_values, change_time
        )
        VALUES (
            NEW.order_id,
            JSON_ARRAY(
                IF(OLD.status != NEW.status, 'status', NULL),
                IF(ABS(OLD.total_amount - NEW.total_amount) > 0.01, 'total_amount', NULL),
                IF(OLD.customer_id != NEW.customer_id, 'customer_id', NULL)
            ),
            JSON_OBJECT('status', OLD.status, 'total_amount', OLD.total_amount),
            JSON_OBJECT('status', NEW.status, 'total_amount', NEW.total_amount),
            NOW()
        );
    END IF;
END //
DELIMITER ;
```

---

## **67. What is an INSTEAD OF trigger?**

**INSTEAD OF trigger** হল একটি special type of trigger যা শুধুমাত্র **views** এর উপর defined হয় এবং original DML operation (INSERT, UPDATE, DELETE) এর পরিবর্তে custom logic execute করে।

**Technical definition:** INSTEAD OF trigger হল view-specific trigger যা view এর উপর DML operations এর সময় default behavior replace করে custom business logic দিয়ে।

### Key Characteristics:

- শুধুমাত্র **views** এর উপর ব্যবহার হয়, tables এর উপর নয়
- Original operation **replace** করে, supplement করে না
- Complex views কে updatable বানানোর জন্য ব্যবহার হয়
- **FOR EACH ROW** basis এ execute হয়

### Making Complex Views Updatable:

#### **Complex Join View with INSTEAD OF:**
```sql
-- Create complex view that's not naturally updatable
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

-- INSTEAD OF UPDATE trigger
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
    WHERE department_id = (
        SELECT department_id FROM employees WHERE employee_id = NEW.employee_id
    );
    
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

#### **Business Logic Enforcement in Views:**
```sql
-- Order summary view with complex business rules
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

-- INSTEAD OF INSERT with business logic
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
    
    -- Apply business rules
    IF NEW.total_amount > 10000 THEN
        -- Large orders need approval
        UPDATE orders SET status = 'PENDING_APPROVAL' 
        WHERE order_id = new_order_id;
        
        -- Notify management
        INSERT INTO notifications (type, message, created_at)
        VALUES ('LARGE_ORDER', 
                format('Large order %s requires approval: $%s', new_order_id, NEW.total_amount),
                NOW());
    END IF;
    
    -- Log order creation
    INSERT INTO order_audit (order_id, action, performed_by, performed_at)
    VALUES (new_order_id, 'CREATED_VIA_VIEW', current_user, NOW());
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_summary_insert_trigger
    INSTEAD OF INSERT
    ON order_summary_view
    FOR EACH ROW
    EXECUTE FUNCTION insert_order_summary();

-- Insert through view with automatic business logic
INSERT INTO order_summary_view (customer_name, order_date, total_amount, status)
VALUES ('John Doe', CURRENT_DATE, 15000, 'PENDING');
```

### Data Transformation Through Views:

#### **Normalized Data Entry Through Denormalized View:**
```sql
-- Denormalized view for easy data entry
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
    
    -- Insert customer with normalized data
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
    
    -- Insert phone with cleaning
    IF NEW.phone_number IS NOT NULL THEN
        INSERT INTO customer_phones (customer_id, phone_number, phone_type)
        VALUES (new_customer_id, 
                REGEXP_REPLACE(NEW.phone_number, '[^0-9]', '', 'g'),  -- Clean phone
                COALESCE(NEW.phone_type, 'PRIMARY'));
    END IF;
    
    -- Create welcome notification
    INSERT INTO customer_notifications (customer_id, type, message, created_at)
    VALUES (new_customer_id, 'WELCOME', 
            format('Welcome %s %s!', NEW.first_name, NEW.last_name), NOW());
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_contact_insert_trigger
    INSTEAD OF INSERT
    ON customer_contact_view
    FOR EACH ROW
    EXECUTE FUNCTION insert_customer_contact();

-- Simple insert handles complex normalization
INSERT INTO customer_contact_view (
    first_name, last_name, email, 
    street_address, city, postal_code, country_name,
    phone_number, phone_type
) VALUES (
    'জন', 'ডো', 'JOHN.DOE@EXAMPLE.COM',
    '123 Main St', 'Dhaka', '1000', 'Bangladesh',
    '+880-171-234-5678', 'MOBILE'
);
```

### INSTEAD OF vs BEFORE/AFTER Triggers:

| Aspect | BEFORE/AFTER Triggers | INSTEAD OF Triggers |
|--------|----------------------|-------------------|
| **Target** | Tables only | Views only |
| **Execution** | Supplement original operation | Replace original operation |
| **When executed** | Before/After original DML | Instead of original DML |
| **Purpose** | Enhance or validate operations | Implement custom operations |
| **Original operation** | Still happens | Does not happen |

#### **Soft Delete Implementation:**
```sql
-- View that hides soft-deleted records
CREATE VIEW active_products_view AS
SELECT product_id, product_name, price, stock_quantity
FROM products
WHERE deleted_at IS NULL;

-- INSTEAD OF DELETE for soft delete
CREATE OR REPLACE FUNCTION soft_delete_product()
RETURNS TRIGGER AS $$
BEGIN
    -- Instead of actual delete, mark as deleted
    UPDATE products 
    SET deleted_at = NOW(),
        deleted_by = current_user,
        status = 'DELETED'
    WHERE product_id = OLD.product_id;
    
    -- Archive the product
    INSERT INTO products_archive 
    SELECT *, NOW() as archived_at
    FROM products 
    WHERE product_id = OLD.product_id;
    
    -- Update related records
    UPDATE order_items 
    SET product_status = 'DISCONTINUED'
    WHERE product_id = OLD.product_id 
    AND order_id IN (SELECT order_id FROM orders WHERE status = 'PENDING');
    
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

INSTEAD OF triggers হল complex views কে fully functional বানানোর powerful tool, যা simple interface provide করে complex database operations এর জন্য।

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
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_name VARCHAR(100);
    
    -- Declare cursor
    DECLARE emp_cursor CURSOR FOR
        SELECT employee_id, name FROM employees WHERE department = 'IT';
    
    -- Declare continue handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN emp_cursor;
    
    read_loop: LOOP
        FETCH emp_cursor INTO emp_id, emp_name;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Process each row
        SELECT CONCAT('Processing employee: ', emp_name) AS message;
    END LOOP;
    
    CLOSE emp_cursor;
END //
DELIMITER ;
```

### Complex Business Logic with Cursors:

#### **Annual Salary Review Process:**
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
    
    -- Complex cursor with multiple joins
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
    
    -- Create temp table for results
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
        
        IF done THEN LEAVE salary_loop; END IF;
        
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
        
        -- Service-based adjustment
        IF years_of_service >= 10 THEN
            SET raise_percentage = raise_percentage + 2.0;
        ELSEIF years_of_service >= 5 THEN
            SET raise_percentage = raise_percentage + 1.0;
        END IF;
        
        -- Market adjustment for low salaries
        IF current_salary < 45000 THEN
            SET raise_percentage = raise_percentage + 3.0;
        END IF;
        
        -- Calculate and cap raise
        SET new_salary = current_salary * (1 + LEAST(raise_percentage, 15) / 100);
        
        -- Minimum 1% raise for active employees
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
    
    -- Return summary
    SELECT 
        COUNT(*) as employees_processed,
        ROUND(AVG(raise_percentage), 2) as avg_raise_percent,
        ROUND(SUM(raise_amount), 2) as total_raise_amount
    FROM salary_adjustments;
    
END //
DELIMITER ;
```

#### **Data Migration with Transformation:**
```sql
DELIMITER //
CREATE PROCEDURE migrate_customer_data()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE old_id INT;
    DECLARE full_name VARCHAR(200);
    DECLARE contact_info TEXT;
    DECLARE address_info TEXT;
    DECLARE new_customer_id INT;
    DECLARE first_name VARCHAR(100);
    DECLARE last_name VARCHAR(100);
    DECLARE email VARCHAR(100);
    DECLARE phone VARCHAR(20);
    
    DECLARE migration_cursor CURSOR FOR
        SELECT customer_id, full_name, contact_info, address
        FROM legacy_customers
        WHERE migrated = 0
        ORDER BY customer_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    CREATE TEMPORARY TABLE migration_log (
        legacy_id INT,
        new_id INT,
        status VARCHAR(50),
        errors TEXT,
        migrated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    OPEN migration_cursor;
    
    migration_loop: LOOP
        FETCH migration_cursor INTO old_id, full_name, contact_info, address_info;
        
        IF done THEN LEAVE migration_loop; END IF;
        
        -- Parse and transform data
        SET first_name = SUBSTRING_INDEX(full_name, ' ', 1);
        SET last_name = SUBSTRING(full_name, LENGTH(first_name) + 2);
        
        -- Extract email using regex
        SET email = NULL;
        IF contact_info REGEXP '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' THEN
            SET email = REGEXP_SUBSTR(contact_info, '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}');
        END IF;
        
        -- Extract phone
        SET phone = REGEXP_REPLACE(contact_info, '[^0-9]', '');
        IF LENGTH(phone) < 10 THEN SET phone = NULL; END IF;
        
        -- Migrate with transaction per customer
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                INSERT INTO migration_log (legacy_id, status, errors)
                VALUES (old_id, 'FAILED', 'Database error during migration');
            END;
            
            -- Insert new customer
            INSERT INTO customers (first_name, last_name, email, created_at, migrated_from)
            VALUES (first_name, last_name, email, NOW(), old_id);
            
            SET new_customer_id = LAST_INSERT_ID();
            
            -- Insert contact info
            IF phone IS NOT NULL THEN
                INSERT INTO customer_phones (customer_id, phone_number, phone_type)
                VALUES (new_customer_id, phone, 'PRIMARY');
            END IF;
            
            -- Insert address
            IF address_info IS NOT NULL AND address_info != '' THEN
                INSERT INTO customer_addresses (customer_id, full_address, created_at)
                VALUES (new_customer_id, address_info, NOW());
            END IF;
            
            -- Mark as migrated
            UPDATE legacy_customers SET migrated = 1 WHERE customer_id = old_id;
            
            INSERT INTO migration_log (legacy_id, new_id, status)
            VALUES (old_id, new_customer_id, 'SUCCESS');
            
            COMMIT;
        END;
        
    END LOOP;
    
    CLOSE migration_cursor;
    
    -- Migration summary
    SELECT 
        status,
        COUNT(*) as count
    FROM migration_log
    GROUP BY status;
    
END //
DELIMITER ;
```

### When to Use Cursors:

#### **✅ Good Use Cases:**
- Complex row-by-row business logic that cannot be expressed in set-based SQL
- Sequential processing requirements (order matters)
- Data transformation during migration
- Generating sequential numbers/codes with complex rules
- Cross-table operations with complex dependencies

#### **❌ Avoid Cursors For:**
```sql
-- ❌ BAD: Using cursor for simple operations
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

-- ✅ GOOD: Use set-based operation instead
UPDATE employees SET salary = salary * 1.1;
```

### Cursor Performance Optimization:

#### **Batch Processing with Cursors:**
```sql
DELIMITER //
CREATE PROCEDURE efficient_cursor_processing()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE batch_size INT DEFAULT 1000;
    DECLARE processed_count INT DEFAULT 0;
    
    DECLARE batch_cursor CURSOR FOR
        SELECT employee_id, salary 
        FROM employees 
        WHERE last_processed < DATE_SUB(NOW(), INTERVAL 1 DAY)
        ORDER BY employee_id
        LIMIT batch_size;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    OPEN batch_cursor;
    
    process_loop: LOOP
        FETCH batch_cursor INTO @emp_id, @emp_salary;
        
        IF done THEN LEAVE process_loop; END IF;
        
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

### PostgreSQL Cursor Features:

#### **Scrollable Cursors:**
```sql
-- PostgreSQL scrollable cursor
CREATE OR REPLACE FUNCTION process_with_scrollable_cursor()
RETURNS VOID AS $$
DECLARE
    emp_cursor SCROLL CURSOR FOR 
        SELECT employee_id, name, salary FROM employees ORDER BY salary DESC;
    emp_record RECORD;
BEGIN
    OPEN emp_cursor;
    
    -- Move to different positions
    FETCH NEXT FROM emp_cursor INTO emp_record;      -- Next row
    FETCH PRIOR FROM emp_cursor INTO emp_record;     -- Previous row  
    FETCH FIRST FROM emp_cursor INTO emp_record;     -- First row
    FETCH LAST FROM emp_cursor INTO emp_record;      -- Last row
    FETCH ABSOLUTE 5 FROM emp_cursor INTO emp_record; -- 5th row
    FETCH RELATIVE 3 FROM emp_cursor INTO emp_record; -- 3 rows forward
    
    -- Process the record
    RAISE NOTICE 'Employee: %, Salary: %', emp_record.name, emp_record.salary;
    
    CLOSE emp_cursor;
END;
$$ LANGUAGE plpgsql;
```

#### **Cursor with Parameters:**
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
    FOR emp_record IN emp_cursor(dept_name) LOOP
        -- Department-specific bonus calculation
        bonus_amount = CASE dept_name
            WHEN 'SALES' THEN emp_record.salary * 0.15
            WHEN 'IT' THEN emp_record.salary * 0.12
            WHEN 'HR' THEN emp_record.salary * 0.10
            ELSE emp_record.salary * 0.08
        END;
        
        UPDATE employees 
        SET bonus = bonus_amount 
        WHERE employee_id = emp_record.employee_id;
        
        RAISE NOTICE 'Applied bonus of % to %', bonus_amount, emp_record.name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

Cursors powerful tools হলেও সাবধানে ব্যবহার করতে হয় কারণ অনেক সময় set-based operations বেশি efficient হয়। শুধুমাত্র complex business logic যা SQL দিয়ে express করা যায় না, সেক্ষেত্রে cursors ব্যবহার করা উচিত।

---