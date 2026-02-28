---
sidebar_position: 1
title: 'Basics'
---

# Database Fundamentals

## ১. What is a database?

**Database** হলো একটি structured collection of data যেটা systematically store, manage এবং retrieve করা যায়। অর্থাৎ, data যাতে সহজে **insert, update, delete, query** করা যায়, সেজন্য database ব্যবহৃত হয়।

#### মূল বৈশিষ্ট্য:
- **Structured collection**: Data একটি specific format এ organized থাকে (যেমন tables with rows and columns)
- **Systematic management**: Data manipulation এবং retrieval এর জন্য mechanism প্রদান করে
- **DBMS integration**: সাধারণত Database Management System দিয়ে manage করা হয়

#### উদাহরণ:
ধরুন আপনার company তে ১০০০ employee এর data আছে। Employee data কে Excel file এ store করতে পারেন, কিন্তু **MySQL** বা **PostgreSQL** এর মতো database ব্যবহার করলে অনেক সুবিধা পাবেন:

```sql
SELECT name, salary FROM employees WHERE department='IT';
```

এই query দিয়ে তাৎক্ষণিকভাবে সব IT department এর employee এবং তাদের salary retrieve করতে পারবেন।

### How is a database different from a file system?

সঠিক data storage solution বেছে নেওয়ার জন্য database এবং file system এর মধ্যে পার্থক্য বোঝা জরুরি।

#### File System এর সীমাবদ্ধতা:
- **File system** শুধুমাত্র individual files আকারে data store করে (text files, CSV files, ইত্যাদি)
- **Limited search capabilities**: Files এর মধ্যে searching করা slow এবং inefficient
- **No built-in relationships**: বিভিন্ন data set এর মধ্যে connection establish করা কঠিন
- **Concurrency issues**: একাধিক user একই file access করলে conflict হতে পারে
- **No data integrity**: Built-in validation বা consistency check নেই

#### Database এর সুবিধা:
- **Structured storage**: Data tables, rows, columns এ organized, indexes এবং relationships সহ
- **Optimized querying**: SQL এবং অন্যান্য query language দিয়ে fast, complex search করা যায়
- **Built-in concurrency control**: একাধিক user একসাথে safely data access করতে পারে
- **Data integrity**: Built-in validation এবং consistency mechanism আছে
- **ACID properties**: Reliable transaction processing নিশ্চিত করে

### What are the advantages of databases over flat files?

| সুবিধা | বর্ণনা |
|--------|--------|
| **Data Integrity & Consistency** | Data duplication রোধ করে এবং system জুড়ে consistency maintain করে |
| **Advanced Querying** | SQL দিয়ে complex data retrieval এবং manipulation সম্ভব |
| **Relationships** | বিভিন্ন data entity এর মধ্যে connection establish করা যায় |
| **Security** | User authentication, authorization, এবং access control |
| **Backup & Recovery** | Automated backup system এবং disaster recovery mechanism |
| **Concurrency Control** | একাধিক user conflict ছাড়াই একসাথে কাজ করতে পারে |
| **Scalability** | Growing data volume এবং user load efficiently handle করতে পারে |
| **Data Validation** | Business rule এবং data constraint enforce করে |

### Examples of different types of databases (relational, NoSQL, graph)?

Modern application গুলো তাদের specific requirement অনুযায়ী বিভিন্ন ধরনের database ব্যবহার করে:

#### Relational Database (RDBMS)
- **Structure**: Data predefined schema সহ tables এ store করা হয়
- **Query Language**: SQL (Structured Query Language)
- **Use Cases**: Traditional business application, financial system, e-commerce
- **Examples**: MySQL, PostgreSQL, Oracle Database, SQL Server

```sql
-- Example: Relational database এ user table তৈরি করা
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### NoSQL Database
- **Structure**: Flexible schema, unstructured/semi-structured data support করে
- **Types**: Document, Key-Value, Column-Family, Graph
- **Use Cases**: Big data, real-time web application, content management
- **Examples**: MongoDB, Cassandra, CouchDB, DynamoDB

```javascript
// Example: MongoDB তে document structure
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "tags": ["developer", "javascript", "nodejs"]
}
```

#### Graph Database
- **Structure**: Data কে nodes এবং edges (relationships) আকারে represent করা হয়
- **Use Cases**: Social network, recommendation engine, fraud detection
- **Examples**: Neo4j, ArangoDB, Amazon Neptune

```cypher
-- Example: Neo4j এর জন্য Cypher query
MATCH (user:User)-[:FRIENDS_WITH]->(friend:User)
WHERE user.name = "John"
RETURN friend.name, friend.age
```

## ২. What is DBMS?

**DBMS (Database Management System)** হলো একটি software system যা database তৈরি, maintain, এবং manage করার জন্য design করা হয়েছে। এটি user/application এবং database এর মধ্যে interface হিসেবে কাজ করে, data management এর জন্য tool এবং service প্রদান করে।

#### DBMS এর মূল বৈশিষ্ট্য:
- **Data Storage & Retrieval**: Efficient storage mechanism এবং query processing
- **Security & Integrity**: Access control, authentication, এবং data validation
- **Concurrency Control**: একাধিক user একসাথে data access করতে পারে
- **Data Redundancy Reduction**: Duplicate data storage কমায়
- **Consistency Maintenance**: Data যেন accurate থাকে system জুড়ে তা নিশ্চিত করে
- **Backup & Recovery**: Automated backup system এবং disaster recovery

###  Difference between DBMS and RDBMS?

| **বিষয়** | **DBMS** | **RDBMS** |
|-----------|----------|------------|
| **Data Structure** | File-based storage | Table-based storage with rows and columns |
| **Relationships** | Data এর মধ্যে কোনো relationship নেই | Table গুলোর মধ্যে relationship support করে |
| **Normalization** | Support করে না | Full normalization support |
| **ACID Properties** | Limited বা কোনো ACID support নেই | Complete ACID compliance |
| **SQL Support** | Basic বা limited SQL | Full SQL support with advanced features |
| **Data Integrity** | Basic integrity constraint | Advanced integrity এবং validation rule |
| **Scalability** | Limited scalability | High scalability option |
| **Examples** | File system, XML database | MySQL, Oracle, PostgreSQL, SQL Server |

**RDBMS** হলো DBMS এর একটি advanced version যেখানে data table এ store করা হয় established relationship সহ, যা better data integrity এবং sophisticated querying capability প্রদান করে।

#### জনপ্রিয় Database Management System

#### Relational DBMS (RDBMS):
| Database | Use Case | Key Feature |
|----------|----------|-------------|
| **MySQL** | Web application, e-commerce | Open-source, high performance, easy to use |
| **Oracle Database** | Enterprise application, banking | Advanced feature, high reliability, scalability |
| **Microsoft SQL Server** | Business application, data warehousing | Microsoft ecosystem এর সাথে integration |
| **PostgreSQL** | Complex application, scientific data | Advanced SQL feature, extensibility |
| **SQLite** | Mobile app, embedded system | Lightweight, serverless, self-contained |

#### NoSQL DBMS:
| Database | Type | Use Case |
|----------|------|----------|
| **MongoDB** | Document | Social media, content management, web application |
| **Cassandra** | Column-family | IoT application, time-series data, high-write workload |
| **Redis** | Key-value | Caching, session management, real-time analytics |
| **Amazon DynamoDB** | Document/Key-value | Serverless application, gaming, mobile backend |
| **Neo4j** | Graph | Social network, recommendation engine, fraud detection |

### Examples of DBMS used in real world?

Database কার্যত প্রতিটি modern application এবং business system চালায়:

| Industry | Application | Database Type | উদাহরণ |
|----------|-------------|---------------|---------|
| **Banking & Finance** | Account management, transaction | RDBMS | Core banking system, payment processing |
| **E-commerce** | Product catalog, order, inventory | RDBMS + NoSQL | Amazon, eBay, Shopify |
| **Social Media** | User profile, post, relationship | NoSQL + Graph | Facebook, Twitter, LinkedIn |
| **Healthcare** | Patient record, medical history | RDBMS | Electronic Health Record (EHR) |
| **Education** | Student information, course management | RDBMS | Learning Management System (LMS) |
| **Government** | Citizen database, tax system | RDBMS | National ID system, tax processing |
| **Gaming** | Player data, leaderboard, session | NoSQL | Mobile game, online multiplayer |
| **IoT & Analytics** | Sensor data, real-time monitoring | Time-series DB | Smart city, industrial monitoring |

## ৩.What is the role of database administrator (DBA)?

**DBA** হলো একজন professional যিনি database system এর overall management এর জন্য দায়ী।

#### DBA এর প্রধান দায়িত্ব:

#### ১. Database Design ও Planning:
- Database architecture design করা
- Data modeling এবং schema design
- Capacity planning এবং resource allocation

#### ২. Installation ও Configuration:
- DBMS software install এবং configure করা
- Database instance তৈরি করা
- System parameter tuning করা

#### ৩. Security Management:
- User access control এবং permission
- Data encryption এবং security policy
- Authentication এবং authorization setup

#### ৪. Performance Monitoring:
- Database performance monitoring
- Query optimization
- Index management
- Resource utilization tracking

#### ৫. Backup ও Recovery:
- Regular backup schedule তৈরি করা
- Disaster recovery planning
- Data restoration procedure
- High availability setup

#### ৬. Maintenance Task:
- Database update এবং patch
- Data archiving এবং cleanup
- Storage management
- Log file management

#### ৭. Troubleshooting:
- Database issue diagnose করা
- Performance problem solve করা
- Data corruption recovery
- System failure handle করা

#### DBA এর প্রকারভেদ:
- **System DBA** - Infrastructure এবং installation focus
- **Development DBA** - Application development support
- **Data DBA** - Data modeling এবং design focus
- **Cloud DBA** - Cloud-based database management

#### প্রয়োজনীয় দক্ষতা:
- SQL এবং database technology তে expert knowledge
- Operating system (Linux/Windows) knowledge
- Scripting language (Python, Shell scripting)
- Cloud platform (AWS, Azure, GCP) familiarity
- Problem-solving এবং analytical skill

DBA একটি critical role কারণ modern organization এর সব data database এ stored থাকে এবং এর proper management ছাড়া business operation সম্ভব নয়।