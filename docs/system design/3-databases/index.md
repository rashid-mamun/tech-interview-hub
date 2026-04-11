---
sidebar_position: 1
title: ''
---


## 13. How do you choose between SQL and NoSQL databases?

এটি সিস্টেম ডিজাইনের সবচেয়ে গুরুত্বপূর্ণ সিদ্ধান্তগুলোর একটি। সঠিক পছন্দ না করলে পরে ব্যয়বহুল migration দরকার হতে পারে।

### What workloads favor a relational database?
SQL (যেমন PostgreSQL, MySQL) ব্যবহার করুন যদি:
- ডাটার মধ্যে জটিল সম্পর্ক আছে এবং JOIN দরকার।
- **ACID transactions** অপরিহার্য (যেমন ব্যাংক, ই-কমার্স অর্ডার)।
- ডাটা স্ট্রাকচার্ড এবং schema সহজে পরিবর্তন হয় না।
- Complex reporting এবং aggregation query দরকার।

### When is a document store (MongoDB) better than a key-value store (Redis)?
| বৈশিষ্ট্য | Key-Value (Redis) | Document Store (MongoDB) |
|---|---|---|
| **ডাটা স্ট্রাকচার** | Simple key-value pair | Nested JSON documents |
| **Query পাওয়া যায়?** | শুধু key দিয়ে look up | Field দিয়ে query করা যায় |
| **ব্যবহার** | Caching, Session, Rate Limiting | Product catalog, User profiles |
| **Persistence** | In-memory (বা disk) | মূলত disk |

- MongoDB বেছে নিন যদি: document-level query এবং flexible schema দরকার।
- Redis বেছে নিন যদি: ultra-low latency এবং simple look up দরকার।

### What does ACID compliance mean and why does it matter?
**ACID** হলো চারটি গুণ যা নিশ্চিত করে database transaction নির্ভরযোগ্য:
- **A (Atomicity):** Transaction সব হবে অথবা কিছুই হবে না। কোনো "half-done" state নেই।
- **C (Consistency):** Transaction শেষে ডাটাবেস সবসময় valid state এ থাকে।
- **I (Isolation):** দুটি সমান্তরাল transaction একে অপরকে প্রভাবিত করে না।
- **D (Durability):** Commit হলে ডাটা হারিয়ে যাবে না — এমনকি crash হলেও।

---

## 14. What are the different types of NoSQL databases and their use cases?

NoSQL কোনো একটি জিনিস নয়, বরং বিভিন্ন ধরনের ডাটাবেস এর সমষ্টি:

| ধরন | উদাহরণ | Best For |
|---|---|---|
| **Key-Value** | Redis, DynamoDB | Session, Cache, Shopping cart |
| **Document** | MongoDB, Firestore | User profiles, Product catalog |
| **Wide-Column** | Cassandra, HBase | Time-series, IoT, High write |
| **Graph** | Neo4j, Amazon Neptune | Social networks, Recommendations |
| **Time-Series** | InfluxDB, TimescaleDB | Monitoring metrics, Sensor data |

### When do you use a wide-column store like Cassandra vs a document store like MongoDB?
- **Cassandra:** প্রতি সেকেন্ডে লক্ষাধিক write, time-ordered data, geo-distributed — IoT sensor data, activity logs।
- **MongoDB:** Flexible document structure, rich query, moderate write — User data, CMS, E-commerce।

### What is a time-series database and when is it appropriate?
- **Time-series DB:** প্রতিটি entry টাইমস্ট্যাম্প সহ সংরক্ষণ করা এবং সময় ভিত্তিক query করা।
- **উদাহরণ:** CPU temperature হর সেকেন্ডে রেকর্ড করা, stock price প্রতি মিলিসেকেন্ডে।
- **ব্যবহার করুন:** Prometheus metrics, Grafana dashboard, IoT monitoring, Financial data।

### What is a graph database and what problems does it solve?
- ডাটা এবং তাদের সম্পর্ক উভয়ই সমান গুরুত্বপূর্ণ হলে graph DB সেরা।
- **উদাহরণ:** 
  - Social network: "Friend of friend" query।
  - Fraud detection: সন্দেহজনক transaction pattern খোঁজা।
  - Knowledge graph: Google Knowledge Panel।

---

## 15. What is database replication and what are the different replication strategies?

**Replication** মানে ডাটার কপি একাধিক সার্ভারে রাখা — availability এবং durability বাড়ানোর জন্য।

### What is the difference between synchronous and asynchronous replication?
| বৈশিষ্ট্য | Synchronous | Asynchronous |
|---|---|---|
| **কীভাবে কাজ করে** | Primary replica তে লিখে confirm পাওয়ার পরেই client কে success বলে | Primary তে লেখে, পরে replica তে পাঠায় |
| **Data Loss Risk** | নেই | Replica আপডেট হওয়ার আগে crash হলে ডাটা হারাতে পারে |
| **Latency** | বেশি (replica confirm এর জন্য অপেক্ষা) | কম |
| **উদাহরণ** | PostgreSQL synchronous_commit | MySQL binlog replication |

### What is master-slave vs master-master replication?
- **Master-Slave (Primary-Replica):** শুধু master write করে, replica read করে। সহজ কিন্তু master ডাউন হলে write বন্ধ।
- **Master-Master (Multi-Primary):** যেকোনো master লিখতে পারে। Write availability বেশি কিন্তু **conflict resolution** জটিল।

### How does replication lag affect system behavior?
- Replication lag মানে Master এ লেখা হয়েছে কিন্তু Replica তে এখনো যায়নি।
- **সমস্যা:** ইউজার একটি পোস্ট করল, তারপর নিজের ফিডে গেল কিন্তু পোস্ট দেখছে না। (Replica থেকে read হচ্ছে যেখানে এখনো পোস্ট নেই)।
- **সমাধান:** "Read your own writes" — নিজের শেষ write এর পরের read গুলো primary থেকে করুন।

---

## 16. What is database indexing and how does it improve query performance?

**Database Index** হলো ডাটাবেসে এমন একটি Data Structure (সাধারণত B-Tree বা Hash) যা নির্দিষ্ট column এর মান দ্রুত খোঁজার সুবিধা দেয়।

- Index ছাড়া: সমস্ত row scan করতে হয় (Full Table Scan) — `O(n)`।
- Index সহ: সরাসরি নির্দিষ্ট row এ যাওয়া যায় — `O(log n)` বা `O(1)`।

### What is the difference between a clustered and non-clustered index?
| বৈশিষ্ট্য | Clustered Index | Non-Clustered Index |
|---|---|---|
| **ডাটা সংরক্ষণ** | ডাটা নিজেই Index অনুযায়ী সাজানো থাকে | আলাদা Index structure, ডাটার pointer থাকে |
| **সংখ্যা** | প্রতি টেবিলে মাত্র একটি | অনেকগুলো হতে পারে |
| **উদাহরণ** | Primary Key সাধারণত Clustered | Email, Username এর উপর Non-Clustered |

### What are the downsides of over-indexing a database?
- প্রতিটি index **Write performance কমায়** — INSERT/UPDATE/DELETE এ index ও আপডেট করতে হয়।
- Extra disk space ব্যবহার হয়।
- Query Planner confused হতে পারে (too many choices)।
- **Rule of thumb:** Read-heavy column এ index করুন, Write-heavy column এ সতর্ক থাকুন।

### What is a composite index and when should you use one?
- **Composite Index:** একাধিক column এর উপর একটি index।
- **উদাহরণ:** `CREATE INDEX ON orders(user_id, created_at)`।
- Query: `WHERE user_id = 123 AND created_at > '2024-01-01'` — composite index ব্যবহার করবে।
- **সতর্কতা:** Index এর column order গুরুত্বপূর্ণ — `(user_id, created_at)` ≠ `(created_at, user_id)`।

---

## 17. What is the CAP theorem?

**CAP Theorem** বলে: একটি distributed system একসাথে এই তিনটি গুণ **সবসময় পুরোপুরি** দিতে পারে না — সর্বোচ্চ দুটি।

| C | A | P |
|---|---|---|
| **Consistency** | **Availability** | **Partition Tolerance** |
| প্রতিটি read সর্বশেষ write দেখাবে | প্রতিটি request সফল response পাবে | Network failure হলেও কাজ করবে |

### Can a distributed system be both consistent and available at the same time?
- **Network partition ছাড়া:** হ্যাঁ, দুটোই পাওয়া যায়।
- **Network partition হলে:** হয় Consistency (কিছু node এর request reject) অথবা Availability (stale data দেওয়া) বেছে নিতে হয়।
- **বাস্তবে:** Network failure যেকোনো সময় হতে পারে, তাই P সবসময় দরকার। তাই মূলত CP বা AP বেছে নিতে হয়।

### What does partition tolerance mean in practice?
- **Network Partition:** দুটি সার্ভার গ্রুপ একে অপরের সাথে কথা বলতে পারছে না।
- Partition tolerance মানে এই অবস্থায়ও সিস্টেম কাজ করবে।
- Internet based distributed system এ P বাদ দেওয়ার উপায় নেই।

### Which databases choose CP and which choose AP?
| CP (Consistency + Partition Tolerance) | AP (Availability + Partition Tolerance) |
|---|---|
| HBase, Zookeeper, MongoDB (strong mode) | Cassandra, CouchDB, DynamoDB (eventual) |
| Partition হলে কিছু node error দেয় | Partition হলে stale data দেয় |
| Banking, Financial systems | Social media, Shopping cart |

---

## 18. What is eventual consistency and when is it acceptable?

**Eventual Consistency** মানে: সব write এর পরে, একটি নির্দিষ্ট সময়ের মধ্যে সব replica তে ডাটা same হবে — কিন্তু তাৎক্ষণিকভাবে নয়।

### What is the difference between strong consistency, eventual consistency, and causal consistency?
| ধরন | সংজ্ঞা | উদাহরণ |
|---|---|---|
| **Strong Consistency** | Write এর পরে সব read latest data দেখাবে | Bank balance |
| **Eventual Consistency** | কিছুক্ষণ পরে সব পেয়ে যাবে, কিন্তু এখনই নয় | Social media likes count |
| **Causal Consistency** | কার্যকারণ সম্পর্ক রক্ষা করে — X এর আগে Y লেখা হলে সবাই X এর পরে Y দেখবে | Comment reply order |

### How does Amazon DynamoDB implement eventual consistency?
- DynamoDB তে প্রতিটি item ৩টি replica তে লেখা হয়।
- Default read: যেকোনো ২টি replica থেকে — eventually consistent।
- **Strongly Consistent Read:** তিনটি replica সবই concur করলে — extra cost।

### What real-world scenarios can tolerate eventual consistency?
- **Social media:** Like/Follower count কিছুক্ষণ stale থাকলেও চলে।
- **Shopping cart:** ২ সেকেন্ড পুরনো cart দেখালেও সমস্যা নেই।
- **DNS:** DNS propagation কয়েক ঘণ্টা লাগে — এটাই eventual consistency।
- **কখন acceptable নয়:** Bank transaction, medical records, inventory (out-of-stock item sell করা যাবে না)।

---

## 19. What is ACID vs BASE and how do they apply to system design?

| | **ACID** | **BASE** |
|---|---|---|
| **পূর্ণ নাম** | Atomicity, Consistency, Isolation, Durability | Basically Available, Soft state, Eventually consistent |
| **ব্যবহার** | SQL Databases | NoSQL Databases |
| **Trade-off** | Strong guarantees, lower performance | Higher availability, eventual consistency |

### What does BASE stand for?
- **BA (Basically Available):** সিস্টেম সর্বদা response দেবে, কিন্তু সেটা stale হতে পারে।
- **S (Soft State):** ডাটা সময়ের সাথে পরিবর্তন হতে পারে update ছাড়াই (replica sync)।
- **E (Eventually Consistent):** অবশেষে সব node একমত হবে।

### How do you achieve ACID guarantees in a distributed system?
- **Two-Phase Commit (2PC):** সব participant কে lock করে তারপর commit — slow।
- **SAGA Pattern:** ছোট ছোট local transaction, failure হলে compensating transaction।
- **Spanner (Google):** TrueTime API দিয়ে global atomic clock — সবচেয়ে complex।

### What is a distributed transaction and what are its challenges?
- **Distributed transaction:** একাধিক database বা service জুড়ে atomic operation।
- **চ্যালেঞ্জ:**
  - যেকোনো একটি node fail হলে কী করবেন?
  - Partial success কীভাবে rollback করবেন?
  - Network latency transaction কে slow করে।
  - Deadlock হতে পারে।

---

## 20. How do you handle database migrations in a production system?

ডাটাবেস migration মানে schema বদলানো — কিন্তু ২৪/৭ চলা প্রোডাকশনে ডাউনটাইম ছাড়া এটা করা কঠিন।

### What is a zero-downtime migration strategy?
**Expand-Contract Pattern** (সবচেয়ে নিরাপদ):
1. **Expand Phase:** নতুন column/table যোগ করুন, পুরনোটি রাখুন।
2. **Migrate Phase:** ব্যাকগ্রাউন্ডে পুরনো ডাটা নতুন structure এ copy করুন।
3. **Switch Phase:** Application কে নতুন column ব্যবহার করতে দিন।
4. **Contract Phase:** পুরনো column মুছুন।

### What is the expand-contract pattern for schema changes?
- **উদাহরণ:** `name` column কে `first_name` ও `last_name` এ ভাগ করতে চাইলে:
  - Step 1: নতুন `first_name`, `last_name` column যোগ।
  - Step 2: নতুন row লেখার সময় তিনটিই আপডেট করুন।
  - Step 3: ব্যাকগ্রাউন্ড job দিয়ে পুরনো row migrate।
  - Step 4: App নতুন column ব্যবহার শুরু করলে পুরনো `name` মুছুন।

### How do you roll back a failed database migration?
- **Backward-compatible migration করুন:** পুরনো কোড নতুন schema তেও কাজ করা উচিত।
- **Migration script এ Rollback script রাখুন:** Alembic, Flyway, Liquibase তে rollback সমর্থন আছে।
- **Blue-Green Deployment:** নতুন DB তে migrate করুন, পুরনো রাখুন। সমস্যা হলে ফিরে যান।

---

## 21. What is a data warehouse and how does it differ from a transactional database?

| বৈশিষ্ট্য | Transactional DB (OLTP) | Data Warehouse (OLAP) |
|---|---|---|
| **উদ্দেশ্য** | রোজকারের ব্যবসায়িক অপারেশন | বিশ্লেষণ এবং রিপোর্টিং |
| **Query Pattern** | ছোট, frequent, row-level | বড়, complex, aggregation |
| **ডাটার বয়স** | সর্বশেষ (current) | Historical (months/years) |
| **Optimization** | Write performance | Read/Query performance |
| **উদাহরণ** | MySQL, PostgreSQL | Snowflake, BigQuery, Redshift |

### What is OLTP vs OLAP?
- **OLTP (Online Transaction Processing):** "ইউজার X এর অর্ডার দাও।" — Low latency, high concurrency।
- **OLAP (Online Analytical Processing):** "গত মাসে কোন পণ্য সবচেয়ে বেশি বিক্রি হলো?" — Complex query, large scan।

### When would you use Snowflake, BigQuery, or Redshift?
- **BigQuery (GCP):** Serverless, pay-per-query, ভালো real-time streaming এর সাথে।
- **Snowflake:** Multi-cloud, data sharing সহজ, SaaS-friendly।
- **Amazon Redshift:** AWS ecosystem, Columnar storage, classic enterprise DWH।

### What is the star schema vs snowflake schema?
- **Star Schema:** কেন্দ্রে Fact Table, চারদিকে Dimension Tables — simple, fast query।
- **Snowflake Schema:** Dimension tables আরও normalize করা হয় — কম storage, জটিল query।
- ইন্টারভিউতে Star Schema বেশি preferred কারণ query লিখতে সহজ।
