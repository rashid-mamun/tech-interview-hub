---
sidebar_position: 4
title: 'Schema'
---

# Database Schema

**Database Schema** হলো একটি ডাটাবেসের Blueprint or Skeleton। এটি ডাটাবেসের logical structure সংজ্ঞায়িত করে, অর্থাৎ data কীভাবে organization করা হবে, table মধ্যে সম্পর্ক কেমন হবে এবং কী কী  Constraints থাকবে—সবই schema মাধ্যমে নির্ধারিত হয়।

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
* **Data Consistency:** ভুল ধরনের ডেটা ইনপুট দেওয়া থেকে রক্ষা করে।
* **Security:** schema মাধ্যমে নির্দিষ্ট ইউজারকে নির্দিষ্ট ডেটা দেখার পারমিশন দেওয়া যায়।
* **Scalability:** একটি ভালো schema ডিজাইন ভবিষ্যতে ডাটাবেস বড় করতে সাহায্য করে।

### Difference between schema and instance?

সহজ কথায় বলতে গেলে, **Schema** হলো একটি বাড়ির **Blueprint**, আর **Instance** হলো ওই নকশা অনুযায়ী তৈরি করা **বাড়ি এবং তার ভেতরের আসবাবপত্র (Actual Data)**।


* **Schema:** এটি ডাটাবেসের একটি logical structure। এতে table নাম, coloumn নাম, data টাইপ এবং  Constraints ডিফাইন করা থাকে। এটি ডাটাবেস তৈরির সময় নির্ধারণ করা হয়।
* **Instance:** একটি নির্দিষ্ট সময়ে (at a particular moment) ডাটাবেসের মধ্যে যে data জমা থাকে, তাকে ওই ডাটাবেসের ইনস্ট্যান্স বলা হয়।

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

সফটওয়্যার যখন বড় হয় বা নতুন ফিচার যোগ করা হয়, তখন তার ডাটাবেসের স্ট্রাকচারও পরিবর্তন করতে হয়। এই পরিবর্তনের প্রক্রিয়া এবং তার রেকর্ড রাখাকেই মূলত **Schema Evolution** এবং **Versioning** বলা হয়।

#### Schema Evolution

সময়ের সাথে সাথে সফটওয়্যারের চাহিদার ওপর ভিত্তি করে ডাটাবেসের স্কিমা বা স্ট্রাকচারে যে পরিবর্তন আনা হয় তাকেই **Schema Evolution** বলে।

* নতুন ফিচার যোগ করার জন্য নতুন টেবিল বা কলাম প্রয়োজন হলে।
* পুরানো বা অপ্রয়োজনীয় ডেটা ফিল্ড মুছে ফেলার জন্য।
* ডেটা টাইপ পরিবর্তন করার জন্য (যেমন: `Integer` থেকে `BigInt`)।
* পারফরম্যান্স বাড়ানোর জন্য ইনডেক্সিং বা রিলেশনশিপ পরিবর্তন করলে।

#### Schema Versioning

যখন একটি ডাটাবেসে একাধিকবার পরিবর্তন (Evolution) আনা হয়, তখন প্রতিটি পরিবর্তনকে একটি নির্দিষ্ট সংস্করণ বা ভার্সন নম্বর দিয়ে ট্র্যাক করাকে **Schema Versioning** বলে।

এটি অনেকটা গিট (Git) বা কোড ভার্সনিংয়ের মতো। এটি নিশ্চিত করে যে আপনার অ্যাপ্লিকেশনের ভার্সন ২.০ যেন ডাটাবেসের ভার্সন ২.০ এর সাথেই কানেক্টেড থাকে।
* **Consistency:** অ্যাপ্লিকেশনের কোড এবং ডাটাবেস স্ট্রাকচার যেন সিঙ্ক (Sync) থাকে।
* **Rollback:** যদি নতুন কোনো পরিবর্তনে সমস্যা দেখা দেয়, তবে সহজেই আগের ভার্সনে ফিরে যাওয়া যায়।
* **Collaboration:** অনেকজন ডেভেলপার একসাথে কাজ করলে কে কোন পরিবর্তন করেছে তা ট্র্যাক করা যায়।

#### কীভাবে এটি কাজ করে? (Migration Scripts)

সাধারণত ডেভেলপারেরা **Migration Scripts** ব্যবহার করে এটি হ্যান্ডেল করেন। প্রতিটি মাইগ্রেশন ফাইলে দুটি অংশ থাকে:

1. **UP Script:** যা স্কিমাকে নতুন ভার্সনে নিয়ে যায় (যেমন: `ADD COLUMN address`)।
2. **DOWN Script:** যা পরিবর্তনটি বাতিল করে আগের অবস্থায় নিয়ে আসে (যেমন: `DROP COLUMN address`)।

**উদাহরণ (Version 1 to Version 2):**

```sql
-- Version 2 Migration Script
ALTER TABLE Users ADD COLUMN phone_number VARCHAR(15);
```

#### Schema Evolution ও Versioning-এর মূল পার্থক্য

| বৈশিষ্ট্য | Schema Evolution | Schema Versioning |
| --- | --- | --- |
| **মূল কাজ** | ডাটাবেসের কাঠামো পরিবর্তন করা। | পরিবর্তনের record or history রাখা। |
| **উদ্দেশ্য** | নতুন প্রয়োজনীয়তা পূরণ করা। | কোড এবং ডাটাবেসের মধ্যে সামঞ্জস্য রাখা। |
| **ফোকাস** | 'কী' পরিবর্তন হচ্ছে (What)। | 'কখন' এবং 'কোন ক্রমে' পরিবর্তন হচ্ছে (When & Order)। |
