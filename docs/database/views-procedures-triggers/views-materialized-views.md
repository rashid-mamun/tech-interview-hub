---
sidebar_position: 1
title: "Views & Materialized Views"
description: "Database views এবং materialized views সম্পর্কে বিস্তারিত আলোচনা"
---

# Views & Materialized Views

## **62. What is a view in database?**

**View** হল একটি virtual table যা এক বা একাধিক tables থেকে data retrieve করে show করে। এটি physically stored থাকে না, বরং একটি saved SQL query যা execute হয়ে data দেখায়।

**Technical definition:** View হল pre-defined SQL query যা table এর মতো behave করে কিন্তু actual data store করে না, শুধু underlying tables থেকে data fetch করে display করে।

### Basic View Creation:

```sql
-- Simple view creation
CREATE VIEW employee_summary AS
SELECT 
    employee_id,
    CONCAT(first_name, ' ', last_name) as full_name,
    department,
    salary,
    hire_date
FROM employees
WHERE status = 'ACTIVE';

-- View usage (just like a table)
SELECT * FROM employee_summary;
SELECT * FROM employee_summary WHERE department = 'IT';
```

### Types of Views:

#### **1. Simple Views (Single Table):**
```sql
-- Simple view from one table
CREATE VIEW high_salary_employees AS
SELECT 
    employee_id,
    name,
    email,
    salary,
    department
FROM employees
WHERE salary > 50000;

-- Usage
SELECT * FROM high_salary_employees WHERE department = 'Engineering';
```

#### **2. Complex Views (Multiple Tables/Joins):**
```sql
-- Complex view with joins and calculations
CREATE VIEW employee_department_details AS
SELECT 
    e.employee_id,
    e.name as employee_name,
    e.email,
    e.salary,
    d.department_name,
    d.location as department_location,
    d.budget as department_budget,
    m.name as manager_name,
    YEAR(CURDATE()) - YEAR(e.hire_date) as years_of_service,
    CASE 
        WHEN e.salary > 80000 THEN 'Senior'
        WHEN e.salary > 50000 THEN 'Mid-level'
        ELSE 'Junior'
    END as level_category
FROM employees e
JOIN departments d ON e.department_id = d.department_id
LEFT JOIN employees m ON e.manager_id = m.employee_id
WHERE e.status = 'ACTIVE';

-- Usage with additional filtering
SELECT 
    employee_name,
    department_name,
    salary,
    level_category,
    manager_name
FROM employee_department_details
WHERE years_of_service > 2
ORDER BY salary DESC;
```

### Benefits of Views:

#### **1. Security (Data Access Control):**
```sql
-- Create view that hides sensitive information
CREATE VIEW public_employee_info AS
SELECT 
    employee_id,
    name,
    department,
    email,
    hire_date,
    -- Hide salary, SSN, personal details
    CASE 
        WHEN department = 'HR' THEN 'Confidential'
        ELSE 'Not Disclosed'
    END as salary_info
FROM employees;

-- Grant access to view instead of base table
GRANT SELECT ON public_employee_info TO 'intern_user'@'%';
-- Don't grant access to employees table directly

-- Different views for different access levels
CREATE VIEW manager_employee_view AS
SELECT 
    employee_id,
    name,
    department,
    email,
    salary,  -- Managers can see salary
    phone,
    hire_date
FROM employees
WHERE department_id IN (
    SELECT department_id 
    FROM department_managers 
    WHERE manager_id = @current_user_id
);
```

#### **2. Abstraction (Hide Complexity):**
```sql
-- Complex business logic hidden in view
CREATE VIEW customer_360_view AS
SELECT 
    c.customer_id,
    c.name as customer_name,
    c.email,
    c.registration_date,
    
    -- Order statistics
    COUNT(DISTINCT o.order_id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as lifetime_value,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value,
    MAX(o.order_date) as last_order_date,
    
    -- Customer categorization
    CASE 
        WHEN COUNT(o.order_id) = 0 THEN 'New'
        WHEN COUNT(o.order_id) < 5 THEN 'Occasional'
        WHEN COUNT(o.order_id) < 20 THEN 'Regular'
        ELSE 'VIP'
    END as customer_category,
    
    -- Loyalty points
    COALESCE(lp.points, 0) as loyalty_points,
    
    -- Support tickets
    COUNT(DISTINCT st.ticket_id) as support_tickets,
    
    -- Address information
    ca.city,
    ca.country
    
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN loyalty_points lp ON c.customer_id = lp.customer_id
LEFT JOIN support_tickets st ON c.customer_id = st.customer_id
LEFT JOIN customer_addresses ca ON c.customer_id = ca.customer_id AND ca.is_primary = 1
GROUP BY c.customer_id, c.name, c.email, c.registration_date, lp.points, ca.city, ca.country;

-- Simple usage of complex logic
SELECT * FROM customer_360_view WHERE customer_category = 'VIP';
SELECT * FROM customer_360_view WHERE lifetime_value > 10000;
```

#### **3. Data Simplification:**
```sql
-- Simplify complex reporting queries
CREATE VIEW monthly_sales_report AS
SELECT 
    DATE_FORMAT(o.order_date, '%Y-%m') as sales_month,
    d.department_name,
    p.category,
    
    -- Sales metrics
    COUNT(DISTINCT o.order_id) as orders_count,
    COUNT(DISTINCT o.customer_id) as unique_customers,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.quantity * oi.unit_price) as gross_revenue,
    SUM(oi.quantity * p.cost_price) as total_cost,
    SUM(oi.quantity * oi.unit_price) - SUM(oi.quantity * p.cost_price) as profit,
    
    -- Average metrics
    AVG(o.total_amount) as avg_order_value,
    AVG(oi.quantity) as avg_quantity_per_item,
    
    -- Performance indicators
    ROUND(
        (SUM(oi.quantity * oi.unit_price) - SUM(oi.quantity * p.cost_price)) / 
        SUM(oi.quantity * oi.unit_price) * 100, 2
    ) as profit_margin_percent

FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN departments d ON p.department_id = d.department_id
WHERE o.status = 'COMPLETED'
GROUP BY 
    DATE_FORMAT(o.order_date, '%Y-%m'),
    d.department_name,
    p.category;

-- Easy reporting queries
SELECT * FROM monthly_sales_report WHERE sales_month = '2024-12';
SELECT * FROM monthly_sales_report WHERE profit_margin_percent > 25;
```

### Updatable vs Non-Updatable Views:

#### **Updatable Views (Simple views):**
```sql
-- Simple view that can be updated
CREATE VIEW active_employees AS
SELECT 
    employee_id,
    name,
    email,
    department,
    salary
FROM employees
WHERE status = 'ACTIVE';

-- These operations work on updatable views
INSERT INTO active_employees (name, email, department, salary)
VALUES ('নতুন কর্মচারী', 'new@company.com', 'IT', 55000);

UPDATE active_employees 
SET salary = 60000 
WHERE employee_id = 123;

DELETE FROM active_employees WHERE employee_id = 456;
```

#### **Non-Updatable Views (Complex views):**
```sql
-- Complex view that cannot be directly updated
CREATE VIEW department_statistics AS
SELECT 
    d.department_name,
    COUNT(e.employee_id) as employee_count,
    AVG(e.salary) as avg_salary,
    MAX(e.salary) as max_salary,
    SUM(e.salary) as total_payroll
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name;

-- These operations will FAIL
-- UPDATE department_statistics SET avg_salary = 70000; -- Error!
-- INSERT INTO department_statistics VALUES (...); -- Error!

-- Must update underlying tables instead
UPDATE employees SET salary = salary * 1.1 WHERE department = 'IT';
```

### Advanced View Examples:

#### **Conditional Data View:**
```sql
-- Dynamic view based on user context
CREATE VIEW my_accessible_data AS
SELECT 
    o.order_id,
    o.order_date,
    o.total_amount,
    o.status,
    c.name as customer_name,
    -- Show customer details only if user has permission
    CASE 
        WHEN @user_role = 'ADMIN' THEN c.email
        WHEN @user_role = 'MANAGER' THEN c.email
        ELSE 'RESTRICTED'
    END as customer_email,
    CASE 
        WHEN @user_role = 'ADMIN' THEN c.phone
        ELSE 'RESTRICTED'
    END as customer_phone
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE 
    -- Regional managers see only their region
    (@user_role = 'REGIONAL_MANAGER' AND o.region_id = @user_region_id)
    OR
    -- Sales reps see only their customers
    (@user_role = 'SALES_REP' AND c.assigned_sales_rep = @user_id)
    OR
    -- Admins and managers see everything
    (@user_role IN ('ADMIN', 'MANAGER'));

-- Usage with user context
SET @user_role = 'REGIONAL_MANAGER';
SET @user_region_id = 5;
SELECT * FROM my_accessible_data;
```

#### **Real-time Dashboard View:**
```sql
-- Real-time business metrics view
CREATE VIEW business_dashboard AS
SELECT 
    -- Today's metrics
    (SELECT COUNT(*) FROM orders WHERE DATE(order_date) = CURDATE()) as today_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(order_date) = CURDATE()) as today_revenue,
    (SELECT COUNT(DISTINCT customer_id) FROM orders WHERE DATE(order_date) = CURDATE()) as today_customers,
    
    -- This month's metrics
    (SELECT COUNT(*) FROM orders WHERE YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE())) as month_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE())) as month_revenue,
    
    -- Inventory alerts
    (SELECT COUNT(*) FROM products WHERE stock_quantity < minimum_stock_level) as low_stock_items,
    (SELECT COUNT(*) FROM products WHERE stock_quantity = 0) as out_of_stock_items,
    
    -- Customer metrics
    (SELECT COUNT(*) FROM customers WHERE DATE(registration_date) = CURDATE()) as new_customers_today,
    (SELECT COUNT(*) FROM customers WHERE status = 'ACTIVE') as total_active_customers,
    
    -- Performance indicators
    (SELECT ROUND(AVG(total_amount), 2) FROM orders WHERE DATE(order_date) = CURDATE()) as today_avg_order_value,
    (SELECT COUNT(*) FROM support_tickets WHERE status = 'OPEN') as open_support_tickets;

-- Simple dashboard query
SELECT * FROM business_dashboard;
```

### View Performance Considerations:

#### **Indexed Views (MySQL):**
```sql
-- Create view with proper indexing strategy
CREATE VIEW optimized_sales_view AS
SELECT 
    DATE(order_date) as order_date,
    customer_id,
    SUM(total_amount) as daily_total,
    COUNT(*) as order_count
FROM orders
WHERE status = 'COMPLETED'
GROUP BY DATE(order_date), customer_id;

-- Create index on underlying table columns used in view
CREATE INDEX idx_orders_date_customer ON orders(order_date, customer_id, status);
CREATE INDEX idx_orders_status_date ON orders(status, order_date);
```

Views হল database এর একটি powerful feature যা security, abstraction, এবং code reusability provide করে। Proper design করলে complex queries কে simple interface এ convert করা যায়।

---

## **63. What is a materialized view?**

**Materialized View** হল একটি view যার result set physically stored থাকে database এ। Regular view এর মতো এটি virtual নয়, বরং actual data store করে এবং periodic refresh করা হয় performance improvement এর জন্য।

**Technical definition:** Materialized view হল pre-computed result set যা disk এ stored থাকে এবং underlying data change হলে manually বা automatically refresh করা হয়।

### Regular View vs Materialized View:

| Aspect | Regular View | Materialized View |
|--------|-------------|------------------|
| **Storage** | Virtual (no storage) | Physical storage required |
| **Performance** | Query executed each time | Pre-computed, fast access |
| **Data Freshness** | Always current | May be stale, needs refresh |
| **Memory Usage** | Minimal | Requires storage space |
| **Maintenance** | No maintenance needed | Requires refresh strategy |

### Basic Materialized View Creation:

#### **PostgreSQL Materialized View:**
```sql
-- Create materialized view
CREATE MATERIALIZED VIEW sales_summary_mv AS
SELECT 
    DATE_TRUNC('month', order_date) as sales_month,
    customer_id,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales,
    AVG(total_amount) as avg_order_value,
    MAX(order_date) as last_order_date
FROM orders
WHERE status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', order_date), customer_id
WITH DATA;  -- Populate immediately

-- Create index on materialized view for faster queries
CREATE INDEX idx_sales_summary_month ON sales_summary_mv(sales_month);
CREATE INDEX idx_sales_summary_customer ON sales_summary_mv(customer_id);

-- Query materialized view (very fast)
SELECT * FROM sales_summary_mv 
WHERE sales_month = '2024-01-01'::date
ORDER BY total_sales DESC;
```

#### **Oracle Materialized View:**
```sql
-- Oracle materialized view with automatic refresh
CREATE MATERIALIZED VIEW customer_analytics_mv
BUILD IMMEDIATE
REFRESH COMPLETE ON COMMIT
AS
SELECT 
    c.customer_id,
    c.name,
    c.registration_date,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as lifetime_value,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.order_date) as last_order_date,
    
    -- Customer segmentation
    CASE 
        WHEN SUM(o.total_amount) > 50000 THEN 'VIP'
        WHEN SUM(o.total_amount) > 20000 THEN 'Premium'
        WHEN SUM(o.total_amount) > 5000 THEN 'Regular'
        ELSE 'Basic'
    END as customer_segment,
    
    -- Recency, Frequency, Monetary analysis
    MONTHS_BETWEEN(SYSDATE, MAX(o.order_date)) as months_since_last_order,
    COUNT(o.order_id) as frequency_score,
    SUM(o.total_amount) as monetary_score
    
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.registration_date;
```

### Refresh Strategies:

#### **1. Manual Refresh:**
```sql
-- PostgreSQL manual refresh
REFRESH MATERIALIZED VIEW sales_summary_mv;

-- Concurrent refresh (allows queries during refresh)
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary_mv;

-- Oracle manual refresh
EXEC DBMS_MVIEW.REFRESH('customer_analytics_mv', 'C');  -- Complete refresh
EXEC DBMS_MVIEW.REFRESH('customer_analytics_mv', 'F');  -- Fast refresh
```

#### **2. Scheduled Automatic Refresh:**
```sql
-- PostgreSQL with pg_cron extension
SELECT cron.schedule('refresh-sales-mv', '0 2 * * *', 'REFRESH MATERIALIZED VIEW sales_summary_mv;');

-- Oracle automatic refresh every hour
CREATE MATERIALIZED VIEW hourly_sales_mv
REFRESH COMPLETE START WITH SYSDATE NEXT SYSDATE + 1/24
AS
SELECT 
    TRUNC(order_date, 'HH24') as sales_hour,
    SUM(total_amount) as hourly_sales,
    COUNT(*) as hourly_orders,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders
WHERE order_date >= SYSDATE - 7  -- Keep last 7 days
GROUP BY TRUNC(order_date, 'HH24');
```

#### **3. Incremental Refresh (Fast Refresh):**
```sql
-- Oracle fast refresh setup
-- 1. Create materialized view log on base table
CREATE MATERIALIZED VIEW LOG ON orders
WITH SEQUENCE, ROWID (order_id, customer_id, order_date, total_amount, status)
INCLUDING NEW VALUES;

-- 2. Create fast-refreshable materialized view
CREATE MATERIALIZED VIEW fast_refresh_sales_mv
BUILD IMMEDIATE
REFRESH FAST ON COMMIT
AS
SELECT 
    customer_id,
    SUM(total_amount) as total_sales,
    COUNT(*) as order_count,
    COUNT_BIG(*) as cb  -- Required for fast refresh
FROM orders
WHERE status = 'COMPLETED'
GROUP BY customer_id;

-- Incremental updates are now automatic on commit
```

### Complex Materialized View Examples:

#### **Data Warehouse Style Aggregation:**
```sql
-- Complex business intelligence materialized view
CREATE MATERIALIZED VIEW business_intelligence_mv AS
WITH monthly_metrics AS (
    SELECT 
        DATE_TRUNC('month', o.order_date) as month,
        p.category,
        p.subcategory,
        d.department_name,
        c.customer_segment,
        c.region,
        
        -- Sales metrics
        COUNT(DISTINCT o.order_id) as orders,
        COUNT(DISTINCT o.customer_id) as customers,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.unit_price) as gross_revenue,
        SUM(oi.quantity * p.cost_price) as cost_of_goods,
        
        -- Customer metrics
        COUNT(DISTINCT CASE WHEN c.registration_date >= DATE_TRUNC('month', o.order_date) THEN c.customer_id END) as new_customers,
        
        -- Product metrics
        COUNT(DISTINCT oi.product_id) as products_sold,
        AVG(oi.unit_price) as avg_selling_price,
        AVG(p.cost_price) as avg_cost_price
        
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN departments d ON p.department_id = d.department_id
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.status = 'COMPLETED'
    GROUP BY 
        DATE_TRUNC('month', o.order_date),
        p.category, p.subcategory,
        d.department_name,
        c.customer_segment, c.region
)
SELECT 
    month,
    category,
    subcategory,
    department_name,
    customer_segment,
    region,
    
    -- Core metrics
    orders,
    customers,
    units_sold,
    gross_revenue,
    cost_of_goods,
    gross_revenue - cost_of_goods as profit,
    
    -- Calculated metrics
    ROUND((gross_revenue - cost_of_goods) / NULLIF(gross_revenue, 0) * 100, 2) as profit_margin_percent,
    ROUND(gross_revenue / NULLIF(orders, 0), 2) as avg_order_value,
    ROUND(units_sold / NULLIF(orders, 0), 2) as avg_units_per_order,
    
    -- Growth metrics (compared to previous month)
    LAG(gross_revenue) OVER (
        PARTITION BY category, subcategory, customer_segment, region 
        ORDER BY month
    ) as prev_month_revenue,
    
    ROUND(
        (gross_revenue - LAG(gross_revenue) OVER (
            PARTITION BY category, subcategory, customer_segment, region 
            ORDER BY month
        )) / NULLIF(LAG(gross_revenue) OVER (
            PARTITION BY category, subcategory, customer_segment, region 
            ORDER BY month
        ), 0) * 100, 2
    ) as revenue_growth_percent,
    
    -- Customer metrics
    new_customers,
    ROUND(new_customers::NUMERIC / NULLIF(customers, 0) * 100, 2) as new_customer_percent,
    
    -- Product metrics
    products_sold,
    avg_selling_price,
    avg_cost_price
    
FROM monthly_metrics
WITH DATA;

-- Create comprehensive indexes
CREATE INDEX idx_bi_mv_month_category ON business_intelligence_mv(month, category);
CREATE INDEX idx_bi_mv_department_segment ON business_intelligence_mv(department_name, customer_segment);
CREATE INDEX idx_bi_mv_region_month ON business_intelligence_mv(region, month);
```

#### **Real-time Analytics Dashboard MV:**
```sql
-- Dashboard materialized view updated every 15 minutes
CREATE MATERIALIZED VIEW realtime_dashboard_mv AS
SELECT 
    -- Time periods
    CURRENT_TIMESTAMP as last_updated,
    
    -- Today's performance
    (SELECT COUNT(*) FROM orders WHERE DATE(order_date) = CURRENT_DATE) as today_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(order_date) = CURRENT_DATE) as today_revenue,
    (SELECT COUNT(DISTINCT customer_id) FROM orders WHERE DATE(order_date) = CURRENT_DATE) as today_customers,
    
    -- Last 24 hours trending
    (SELECT COUNT(*) FROM orders WHERE order_date >= NOW() - INTERVAL '24 hours') as last_24h_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE order_date >= NOW() - INTERVAL '24 hours') as last_24h_revenue,
    
    -- Weekly comparison
    (SELECT COUNT(*) FROM orders WHERE order_date >= DATE_TRUNC('week', CURRENT_DATE)) as this_week_orders,
    (SELECT COUNT(*) FROM orders WHERE order_date >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
     AND order_date < DATE_TRUNC('week', CURRENT_DATE)) as last_week_orders,
    
    -- Monthly performance
    (SELECT COUNT(*) FROM orders WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_revenue,
    
    -- Product performance
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'product_name', p.product_name,
                'units_sold', SUM(oi.quantity),
                'revenue', SUM(oi.quantity * oi.unit_price)
            ) ORDER BY SUM(oi.quantity * oi.unit_price) DESC
        )
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE DATE(o.order_date) = CURRENT_DATE
        GROUP BY p.product_id, p.product_name
        LIMIT 10
    ) as top_products_today,
    
    -- Customer segments performance
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'segment', c.customer_segment,
                'orders', COUNT(o.order_id),
                'revenue', SUM(o.total_amount)
            )
        )
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        WHERE DATE(o.order_date) = CURRENT_DATE
        GROUP BY c.customer_segment
    ) as segment_performance_today,
    
    -- Operational metrics
    (SELECT COUNT(*) FROM products WHERE stock_quantity < minimum_stock_level) as low_stock_alerts,
    (SELECT COUNT(*) FROM support_tickets WHERE status = 'OPEN') as open_tickets,
    (SELECT COUNT(*) FROM customers WHERE DATE(registration_date) = CURRENT_DATE) as new_registrations_today
    
WITH DATA;

-- Schedule refresh every 15 minutes
SELECT cron.schedule('dashboard-refresh', '*/15 * * * *', 
    'REFRESH MATERIALIZED VIEW CONCURRENTLY realtime_dashboard_mv;');
```

### Performance Optimization:

#### **Partitioned Materialized Views:**
```sql
-- Create partitioned materialized view for large datasets
CREATE MATERIALIZED VIEW sales_by_month_mv
PARTITION BY RANGE (sales_month) (
    PARTITION sales_2024_01 VALUES LESS THAN ('2024-02-01'),
    PARTITION sales_2024_02 VALUES LESS THAN ('2024-03-01'),
    PARTITION sales_2024_03 VALUES LESS THAN ('2024-04-01'),
    -- ... more partitions
    PARTITION sales_future VALUES LESS THAN (MAXVALUE)
)
AS
SELECT 
    DATE_TRUNC('month', order_date) as sales_month,
    customer_id,
    product_category,
    SUM(total_amount) as monthly_sales,
    COUNT(*) as order_count,
    AVG(total_amount) as avg_order_value
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', order_date), customer_id, product_category
WITH DATA;

-- Refresh only specific partitions
REFRESH MATERIALIZED VIEW sales_by_month_mv PARTITION (sales_2024_03);
```

#### **Materialized View Maintenance Strategy:**
```sql
-- Create maintenance procedure
CREATE OR REPLACE FUNCTION maintain_materialized_views()
RETURNS VOID AS $$
BEGIN
    -- Refresh small, frequently accessed views concurrently
    REFRESH MATERIALIZED VIEW CONCURRENTLY realtime_dashboard_mv;
    
    -- Refresh larger views during off-peak hours
    IF EXTRACT(HOUR FROM NOW()) BETWEEN 2 AND 4 THEN
        REFRESH MATERIALIZED VIEW business_intelligence_mv;
        REFRESH MATERIALIZED VIEW sales_by_month_mv;
    END IF;
    
    -- Log maintenance activity
    INSERT INTO mv_maintenance_log (view_name, refresh_time, status)
    VALUES ('materialized_views_batch', NOW(), 'COMPLETED');
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO mv_maintenance_log (view_name, refresh_time, status, error_message)
    VALUES ('materialized_views_batch', NOW(), 'FAILED', SQLERRM);
END;
$$ LANGUAGE plpgsql;
```

### When to Use Materialized Views:

#### **Good Use Cases:**
- **Data Warehousing:** Complex aggregations for reporting
- **Dashboard Analytics:** Frequently accessed summary data  
- **Historical Analysis:** Time-series data with complex calculations
- **Cross-table Analytics:** Expensive joins across large tables
- **API Performance:** Pre-computed data for fast API responses

#### **Avoid When:**
- Data changes very frequently (refresh overhead)
- Storage space is limited
- Real-time accuracy is critical
- Simple queries that are already fast

Materialized views হল performance optimization এর powerful tool, কিন্তু proper refresh strategy এবং maintenance planning প্রয়োজন।

---