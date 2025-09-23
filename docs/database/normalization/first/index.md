---
sidebar_position: 1
title: 'Basic'
---

---

## **32.What is Database Normalization?**

Database normalization হল একটি systematic process যা database design করার সময় data redundancy কমানো এবং data integrity বজায় রাখার জন্য ব্যবহৃত হয়। এটি Edgar F. Codd দ্বারা প্রবর্তিত হয়েছিল।

#### **Main Goals of Normalization:**
1. Eliminate data redundancy (duplicate data)
2. Prevent data anomalies (insert, update, delete anomalies)
3. Ensure data integrity and consistency
4. Optimize storage space
5. Make database structure more logical

---
###  0NF Unnormalized Form

0NF represents the raw, unstructured data যেখানে কোন normalization rules apply করা হয়নি। এখানে data থাকে flat file বা spreadsheet format এ।

##### **Example - University Student System:**

| Student_ID | Student_Name | Age | Courses           | Course_Credits | Instructor_Names      | Dept_Name | Dept_Location |
|------------|--------------|-----|-------------------|----------------|-----------------------|-----------|---------------|
| 1          | Mamun        | 22  | DBMS, Physics     | 3, 4           | Dr. Khan, Dr. Rahman  | CSE       | Building A    |
| 2          | Arafat       | 21  | Math, Chemistry   | 4, 3           | Dr. Ali, Dr. Hassan   | Physics   | Building B    |
| 3          | Rashida      | 23  | DBMS             | 3              | Dr. Khan              | CSE       | Building A    |

#### **Critical Problems in 0NF:**

1. **Multi-valued Attributes:** 
   - `Courses` column এ multiple values (DBMS, Physics)
   - `Course_Credits` column এ multiple values (3, 4)
   - `Instructor_Names` column এ multiple values

2. **Data Redundancy:**
   - `CSE` department name এবং `Building A` location multiple times repeat
   - `Dr. Khan` instructor name multiple times appear

3. **Storage Inefficiency:**
   - Same information multiple places এ store
   - Unnecessary disk space consumption

4. **Data Anomalies:**
   - **Insert Anomaly:** নতুন course add করতে হলে পুরো student record দিতে হবে
   - **Update Anomaly:** CSE department location change করতে হলে multiple rows update করতে হবে
   - **Delete Anomaly:** Mamun কে delete করলে DBMS course এর information হারিয়ে যেতে পারে

---
## **33. Explain 1NF, 2NF, 3NF?**

### Step 1: 1NF Achieving Atomicity

1NF হল normalization এর **first step** যেখানে আমরা ensure করি যে:
1. **Each cell contains atomic (indivisible) values**
2. **Each row is unique** (Primary Key দ্বারা)
3. **No repeating groups** of data

#### **Rules for 1NF:**
- প্রতিটি column এ **single value** থাকতে হবে
- **Multi-valued attributes** eliminate করতে হবে
- **Primary Key** define করতে হবে row uniqueness এর জন্য

#### **Conversion to 1NF:**

**Step 1: Break down multi-valued attributes**

| Student_ID | Student_Name | Age | Course    | Course_Credit | Instructor_Name | Dept_Name | Dept_Location |
|------------|--------------|-----|-----------|---------------|-----------------|-----------|---------------|
| 1          | Mamun        | 22  | DBMS      | 3             | Dr. Khan        | CSE       | Building A    |
| 1          | Mamun        | 22  | Physics   | 4             | Dr. Rahman      | CSE       | Building A    |
| 2          | Arafat       | 21  | Math      | 4             | Dr. Ali         | Physics   | Building B    |
| 2          | Arafat       | 21  | Chemistry | 3             | Dr. Hassan      | Physics   | Building B    |
| 3          | Rashida      | 23  | DBMS      | 3             | Dr. Khan        | CSE       | Building A    |

**Step 2: Define Primary Key**
- **Primary Key:** `(Student_ID, Course)` 
- এই composite key প্রতিটি row কে uniquely identify করে

#### **Benefits of 1NF:**
✅ **Atomic values** → easy searching, filtering, indexing  
✅ **Row uniqueness** → prevents duplicate records  
✅ **Eliminates multi-valued attributes** → cleaner data structure  
✅ **Query optimization** → database engine can better optimize queries  

#### **Remaining Problems after 1NF:**
❌ **Data redundancy still exists** (Student info repeats)  
❌ **Partial dependency exists** (Student_Name depends only on Student_ID)  
❌ **Update anomalies persist**  

---

### Step 2: 2NF Eliminating Partial Dependency

2NF achieve করতে হলে:
1. Table must be in **1NF**
2. **No partial dependency** should exist
3. Every **non-key attribute** must be **fully functionally dependent** on the **entire primary key**

#### **Understanding Partial Dependency:**

**Partial Dependency** occurs যখন একটি **non-key attribute** শুধুমাত্র **composite primary key এর একটি অংশের উপর depend** করে।

**In our 1NF table:**
- Primary Key = `(Student_ID, Course)`
- `Student_Name` depends শুধু `Student_ID` এর উপর, `Course` এর উপর না
- `Age` depends শুধু `Student_ID` এর উপর
- `Dept_Name` depends শুধু `Student_ID` এর উপর

**Functional Dependencies:**
- `Student_ID` → `Student_Name, Age, Dept_Name, Dept_Location`
- `Course` → `Course_Credit, Instructor_Name`
- `(Student_ID, Course)` → `all attributes`

#### **Conversion to 2NF:**

**Step 1: Create Student Table**
| Student_ID (PK) | Student_Name | Age | Dept_Name | Dept_Location |
|-----------------|--------------|-----|-----------|---------------|
| 1               | Mamun        | 22  | CSE       | Building A    |
| 2               | Arafat       | 21  | Physics   | Building B    |
| 3               | Rashida      | 23  | CSE       | Building A    |

**Step 2: Create Course Table**
| Course_ID (PK) | Course_Name | Course_Credit | Instructor_Name |
|----------------|-------------|---------------|-----------------|
| 101            | DBMS        | 3             | Dr. Khan        |
| 102            | Physics     | 4             | Dr. Rahman      |
| 103            | Math        | 4             | Dr. Ali         |
| 104            | Chemistry   | 3             | Dr. Hassan      |

**Step 3: Create Enrollment Table (Junction Table)**
| Student_ID (FK) | Course_ID (FK) |
|-----------------|----------------|
| 1               | 101            |
| 1               | 102            |
| 2               | 103            |
| 2               | 104            |
| 3               | 101            |

#### **Key Concepts in 2NF:**
- **Foreign Key (FK):** Reference to primary key of another table
- **Junction Table:** Manages many-to-many relationship between Student and Course
- **Referential Integrity:** FK values must exist in referenced table

#### **Benefits of 2NF:**
✅ **Eliminates partial dependency**  
✅ **Reduces data redundancy** significantly  
✅ **Insert anomaly solved:** Can add new course without student  
✅ **Update anomaly reduced:** Change student name only once  
✅ **Storage efficiency improved**  

#### **Remaining Problems after 2NF:**
❌ **Transitive dependency exists** (Dept_Name depends on Student_ID through department)  
❌ **Some redundancy remains**  

---

###  Step 3: 3NF Eliminating Transitive Dependency


3NF achieve করতে হলে:
1. Table must be in **2NF**
2. **No transitive dependency** should exist
3. **Non-key attributes** should not depend on other **non-key attributes**

#### **Understanding Transitive Dependency:**

**Transitive Dependency** occurs যখন:
- A → B (A determines B)
- B → C (B determines C)  
- Therefore: A → C (A transitively determines C)

**In our Student table:**
- `Student_ID` → `Dept_Name` (Student belongs to a department)
- `Dept_Name` → `Dept_Location` (Department has a location)
- Therefore: `Student_ID` → `Dept_Location` (transitive dependency)

#### **Conversion to 3NF:**

**Step 1: Create Department Table**
| Dept_ID (PK) | Dept_Name | Dept_Location | Dept_Head    | Established_Year |
|--------------|-----------|---------------|--------------|------------------|
| 10           | CSE       | Building A    | Dr. Ahmed    | 1995             |
| 20           | Physics   | Building B    | Dr. Sultana  | 1980             |
| 30           | Math      | Building C    | Dr. Karim    | 1975             |

**Step 2: Update Student Table**
| Student_ID (PK) | Student_Name | Age | Dept_ID (FK) |
|-----------------|--------------|-----|--------------|
| 1               | Mamun        | 22  | 10           |
| 2               | Arafat       | 21  | 20           |
| 3               | Rashida      | 23  | 10           |

**Step 3: Course Table (Enhanced)**
| Course_ID (PK) | Course_Name | Course_Credit | Instructor_ID (FK) | Dept_ID (FK) |
|----------------|-------------|---------------|--------------------|--------------|
| 101            | DBMS        | 3             | 501                | 10           |
| 102            | Physics     | 4             | 502                | 20           |
| 103            | Math        | 4             | 503                | 30           |
| 104            | Chemistry   | 3             | 504                | 20           |

**Step 4: Create Instructor Table**
| Instructor_ID (PK) | Instructor_Name | Qualification | Dept_ID (FK) |
|--------------------|-----------------|---------------|--------------|
| 501                | Dr. Khan        | PhD in CS     | 10           |
| 502                | Dr. Rahman      | PhD in Physics| 20           |
| 503                | Dr. Ali         | PhD in Math   | 30           |
| 504                | Dr. Hassan      | PhD in Chem   | 20           |

**Step 5: Enrollment Table (unchanged)**
| Student_ID (FK) | Course_ID (FK) | Enrollment_Date | Grade |
|-----------------|----------------|-----------------|-------|
| 1               | 101            | 2024-01-15      | A     |
| 1               | 102            | 2024-01-15      | B+    |
| 2               | 103            | 2024-01-16      | A-    |
| 2               | 104            | 2024-01-16      | B     |
| 3               | 101            | 2024-01-17      | A+    |

#### **Benefits of 3NF:**
✅ **Eliminates transitive dependency completely**  
✅ **Maximum data redundancy reduction**  
✅ **All anomalies eliminated:**
   - Insert: Can add department without student
   - Update: Change department location once
   - Delete: Deleting student doesn't affect department info
   
✅ **Optimal storage utilization**  
✅ **Enhanced data integrity**  
✅ **Better database maintenance**  


### **Types of Dependencies Eliminated:**

1. Multi-valued Dependencies: Eliminated in 1NF
2. Partial Dependencies: Eliminated in 2NF
3. Transitive Dependencies: Eliminated in 3NF

---
##  **34.When to Use Each Normal Form**

#### **1NF - Basic Requirements:**
- Small applications with simple data
- When query performance is more important than storage
- Legacy system migrations

#### **2NF - Medium Complexity:**
- Most business applications
- E-commerce systems
- Content management systems

#### **3NF - High Complexity:**
- Enterprise applications
- Financial systems
- Large-scale databases
- When data integrity is critical



## **35.When would you denormalize a database and why?**
I would consider denormalization in these scenarios:

**1. Performance-Critical Applications:**
- Data warehousing systems
- Reporting dashboards with complex aggregations
- Real-time analytics platforms

**2. Read-Heavy Systems:**
- E-commerce product catalogs
- Content management systems
- Social media feeds

**3. Specific Techniques:**
- Materialized Views: For complex calculations
- Redundant Columns: For frequently accessed data
- Pre-calculated Fields: For expensive computations

**Trade-offs Considered:**
- Storage cost vs Query performance
- Data consistency vs Response time
- Maintenance complexity vs User experience

**Example:** In an e-commerce system, I might store product rating averages 
redundantly instead of calculating from reviews table each time."


## **36. Explain the difference between 2NF and 3NF with a real example**
The key difference lies in the type of dependency eliminated:

**2NF eliminates Partial Dependencies:**
- When non-key attributes depend on part of a composite key
- Example: (Student_ID, Course_ID) → Student_Name
- Student_Name depends only on Student_ID, not the full key

**3NF eliminates Transitive Dependencies:**
- When non-key attributes depend on other non-key attributes
- Example: Student_ID → Dept_Name → Dept_Location
- Dept_Location depends on Dept_Name, not directly on Student_ID


## **37. What problems does normalization solve and what problems does it create?**

Problems Solved by Normalization:

**1. Data Anomalies:**
- Insert Anomaly: Can't add data without complete information
- Update Anomaly: Same data stored in multiple places
- Delete Anomaly: Losing important data when deleting records

**2. Storage Issues:**
- Data redundancy and wasted space
- Inconsistent data across records

**3. Maintenance Problems:**
- Difficult to maintain data integrity
- Complex business rule enforcement

**Problems Created by Normalization:**

**1. Performance Issues:**
- Multiple JOINs required for simple queries
- Increased query complexity and execution time

**2. Development Complexity:**
- More complex SQL queries
- Understanding relationships requires expertise

**3. Maintenance Overhead:**
- More tables to manage
- Complex referential integrity constraints

**Balanced Approach:**
- Normalize to 3NF for most applications
- Consider BCNF for critical systems
- Denormalize selectively for performance
- Use views to simplify complex queries"


## **38.How do you handle many-to-many relationships in database design?**

Many-to-many relationships require a Junction/Bridge table:

Example: Student-Course Relationship

**Wrong Approach (Violates 1NF):**
Students(ID, Name, Courses) // Courses as comma-separated values

**Correct Approach:**
1. Students Table: Student_ID (PK), Name, Email
2. Courses Table: Course_ID (PK), Name, Credits  
3. Enrollments Table: Student_ID (FK), Course_ID (FK), Grade, Date

**Junction Table Benefits:**
- Maintains referential integrity
- Allows additional attributes (Grade, Enrollment_Date)
- Enables efficient queries
- Supports proper indexing

**Advanced Considerations:**
- Composite Primary Key: (Student_ID, Course_ID)
- Additional Attributes: Enrollment date, grade, status
- Constraints: Prevent duplicate enrollments
- Indexes: On foreign key columns for performance

**Query Examples:**
- Find all courses for a student: JOIN through Enrollments
- Find all students in a course: JOIN through Enrollments  
- Count enrollments: Aggregate on Enrollments table"


## **39.Explain ACID properties and their relationship to normalization**
ACID properties ensure database reliability, and normalization supports them:

**ACID Properties:**

- Atomicity: All-or-nothing transactions
- Consistency: Database remains in valid state
- Isolation: Concurrent transactions don't interfere  
- Durability: Committed changes are permanent

**Relationship to Normalization:**

**Consistency Enhancement:**
- Normalized tables enforce referential integrity
- Foreign key constraints prevent orphan records
- Check constraints ensure valid data

**Atomicity Support:**
- Smaller, focused tables enable atomic operations
- Reduced data redundancy minimizes update complexity
- Transaction scope becomes clearer

**Example:**
In a normalized e-commerce system:
- Order transaction updates: Orders, Order_Items, Inventory tables
- Each table has specific responsibility
- Foreign keys ensure consistency
- Rollback affects only relevant tables

**Trade-offs:**
- More tables = more complex transactions
- Multiple JOINs might affect isolation levels
- Need careful transaction design for performance"

## **40.How do you optimize queries on highly normalized databases?**
Several strategies can optimize queries on normalized databases:

**1. Indexing Strategy:**
- Primary keys (automatic indexes)
- Foreign key columns for JOIN performance
- Composite indexes for multi-column searches
- Covering indexes for SELECT-only queries

**2. Query Optimization:**
- Use EXPLAIN PLAN to analyze execution
- Write efficient JOIN conditions
- Filter early with WHERE clauses
- Use EXISTS instead of IN for subqueries

**3. Denormalization Techniques:**
- Materialized Views: Pre-computed JOINs
- Calculated Fields: Store computed values
- Summary Tables: Aggregate data for reporting

**4. Caching Strategies:**
- Application-level caching: Redis, Memcached
- Database query caching: Built-in mechanisms
- Result set caching: For expensive queries

**5. Database Design:**
- Partitioning: Split large tables
- Read Replicas: Separate read/write operations
- Archive Old Data: Keep active data small


**Monitoring and Maintenance:**
- Regular EXPLAIN PLAN analysis
- Index usage statistics
- Query performance monitoring
- Periodic optimization reviews"


##  **Advanced Considerations & Trade-offs**

#### **Denormalization Strategies:**

**1. Controlled Redundancy:**
- Store frequently accessed calculated values
- Maintain consistency through triggers or application logic
- Example: Customer total orders, Product average rating

**2. Materialized Views:**
- Pre-computed complex JOINs
- Refresh strategies (immediate vs scheduled)
- Suitable for data warehousing

**3. NoSQL Integration:**
- Use normalized RDBMS for transactions
- Use denormalized NoSQL for read-heavy operations
- Example: Product catalog in MongoDB, orders in PostgreSQL


