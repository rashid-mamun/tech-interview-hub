---
sidebar_position: 4
title: 'Schema'
---

# Database Schema

Database schema হলো database এর logical structure এবং organization, যা data কিভাবে stored, organized এবং related হবে তা define করে।

## ৪. What is a schema in databases?

**Database Schema** হলো database এর blueprint বা structural design যা define করে:

#### মূল উপাদান:
- **Tables**: Data store করার জন্য table structure
- **Columns**: প্রতিটি table এর field definition
- **Data Types**: Column এ কি ধরনের data store হবে
- **Relationships**: Table গুলোর মধ্যে connection
- **Constraints**: Data validation rule এবং integrity check
- **Indexes**: Query performance optimize করার জন্য

#### উদাহরণ:
```sql
-- E-commerce database schema example
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2),
    category_id INT,
    stock_quantity INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status ENUM('pending', 'confirmed', 'shipped', 'delivered'),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### Schema Design এর গুরুত্ব:
- **Data Organization**: Systematic data storage এবং retrieval
- **Performance**: Proper indexing এবং normalization
- **Data Integrity**: Constraint এবং validation rule
- **Maintainability**: Future modification এবং scaling
- **Security**: Access control এবং permission management

### Difference between schema and instance?

Database system এ schema এবং instance দুটি fundamental concept যা clearly understand করা জরুরি:

| **বিষয়** | **Schema** | **Instance** |
|-----------|------------|-------------|
| **Definition** | Database এর structure/design | Specific point in time এ actual data |
| **Nature** | Static (structure rarely changes) | Dynamic (data frequently changes) |
| **Content** | Table definition, constraint, relationship | Actual data row এবং value |
| **Persistence** | Long-term stable থাকে | Constantly changing |
| **Example** | Table structure definition | Current data in table |

#### Practical Example:

**Schema (Structure)**:
```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 0),
    email VARCHAR(100) UNIQUE,
    course VARCHAR(50)
);
```

**Instance (Data at a specific time)**:
```
student_id | name        | age | email               | course
-----------|-------------|-----|---------------------|-------------
1001       | John Doe    | 22  | john@example.com    | Computer Science
1002       | Jane Smith  | 21  | jane@example.com    | Mathematics  
1003       | Bob Johnson | 23  | bob@example.com     | Physics
```

#### Key Differences:
- **Schema** define করে যে table এ কোন column থাকবে, data type কি হবে
- **Instance** হলো একটি specific moment এ table এ actual কি data আছে
- Schema change হলে database structure modify হয়, কিন্তু instance change হলে শুধু data content change হয়

### Can a database have multiple schemas?

হ্যাঁ, একটি database multiple schema support করতে পারে, এবং এটি একটি common practice।

#### Multi-Schema Architecture:

#### ১. **Logical Separation**:
```sql
-- Different schemas for different modules
CREATE SCHEMA user_management;
CREATE SCHEMA inventory_management;
CREATE SCHEMA order_processing;
CREATE SCHEMA reporting;

-- Table creation in specific schema
CREATE TABLE user_management.users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE inventory_management.products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100),
    stock_level INT
);
```

#### ২. **Environment-based Schema**:
```sql
-- Different schema for different environment
CREATE SCHEMA development;
CREATE SCHEMA staging;
CREATE SCHEMA production;

-- Same table structure in different environment
CREATE TABLE development.users (...);
CREATE TABLE staging.users (...);
CREATE TABLE production.users (...);
```

#### ৩. **Access Control by Schema**:
```sql
-- Different user permission for different schema
GRANT SELECT ON user_management.* TO 'hr_team'@'%';
GRANT SELECT, INSERT, UPDATE ON inventory_management.* TO 'inventory_team'@'%';
GRANT ALL PRIVILEGES ON reporting.* TO 'analytics_team'@'%';
```

#### Multi-Schema এর সুবিধা:
- **Organization**: Related table গুলো logically group করা
- **Security**: Schema level access control
- **Namespace Management**: Same table name different schema তে ব্যবহার করা
- **Environment Isolation**: Development, staging, production আলাদা রাখা
- **Team Collaboration**: বিভিন্ন team এর জন্য আলাদা workspace

#### Database Platform Support:
| Database | Multi-Schema Support | Implementation |
|----------|---------------------|----------------|
| **PostgreSQL** | ✅ Full Support | CREATE SCHEMA command |
| **SQL Server** | ✅ Full Support | CREATE SCHEMA command |
| **Oracle** | ✅ Full Support | User-based schema model |
| **MySQL** | ⚠️ Limited | Database = Schema (different approach) |
| **SQLite** | ❌ No Support | Single schema per database file |

### What is schema evolution and versioning?

Schema evolution হলো database structure এর controlled modification process, যা application এর growing requirement meet করার জন্য necessary।

#### Schema Evolution Process:

#### ১. **Version Control**:
```sql
-- Schema version tracking table
CREATE TABLE schema_versions (
    version_id INT PRIMARY KEY,
    version_number VARCHAR(20) NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    rollback_script TEXT
);

-- Example version entry
INSERT INTO schema_versions (version_number, description) 
VALUES ('1.2.0', 'Added user profile table and email verification');
```

#### ২. **Migration Scripts**:
```sql
-- Migration script for version 1.1.0 to 1.2.0
-- File: migration_v1.2.0.sql

-- Add new column
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Create new table
CREATE TABLE user_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    last_login TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create index for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Update schema version
INSERT INTO schema_versions (version_number, description) 
VALUES ('1.2.0', 'Added email verification and user profiles');
```

#### ৩. **Backward Compatibility Strategy**:
```sql
-- Safe schema evolution practices

-- ✅ Safe: Adding new column with default value
ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ✅ Safe: Adding new table
CREATE TABLE product_reviews (
    review_id INT PRIMARY KEY,
    product_id INT,
    rating INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ⚠️ Risky: Dropping column (data loss)
-- ALTER TABLE users DROP COLUMN phone; -- Avoid if possible

-- ✅ Better: Mark as deprecated first
ALTER TABLE users ADD COLUMN phone_deprecated BOOLEAN DEFAULT TRUE;
-- Later remove after ensuring no dependency
```

#### ৪. **Schema Versioning Best Practices**:

| Practice | Description | Example |
|----------|-------------|---------|
| **Incremental Changes** | Small, gradual modification | Add one column at a time |
| **Rollback Planning** | Every change এর reverse script রাখা | DROP column এর জন্য backup |
| **Testing** | Staging environment এ test করা | Migration script validation |
| **Documentation** | Change এর proper documentation | Why change was needed |
| **Automation** | Migration script automation | CI/CD pipeline integration |

#### ৫. **Modern Schema Evolution Tools**:

#### Database Migration Tools:
| Tool | Language | Features |
|------|----------|----------|
| **Flyway** | Java/SQL | Version control, automatic migration |
| **Liquibase** | Java/XML/SQL | Change tracking, rollback support |
| **Alembic** | Python | SQLAlchemy integration, auto-generation |
| **Django Migrations** | Python | ORM-based, automatic detection |
| **Rails Migrations** | Ruby | Convention-based, reversible |
| **Knex.js** | JavaScript | Schema builder, migration support |

#### Schema Evolution Challenges:
- **Production Downtime**: Large table modification এ downtime
- **Data Migration**: Existing data কে new structure এ convert করা
- **Application Compatibility**: Old application version support
- **Rollback Complexity**: Failed migration থেকে recovery
- **Team Coordination**: Multiple developer এর change management

#### Best Practices Summary:
1. **Always backup** before schema changes
2. **Test migration** in staging environment
3. **Plan rollback strategy** for every change
4. **Use version control** for all schema changes
5. **Document reasons** for each modification
6. **Automate migration process** where possible
7. **Monitor performance** after schema changes