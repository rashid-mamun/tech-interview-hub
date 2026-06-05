---
sidebar_position: 5
title: 'Normalization'
---

## **32. What is Database Normalization?**

**Normalization** হলো একটি ডাটাবেস ডিজাইন টেকনিক যা একটি বড় টেবিলকে ছোট ছোট টেবিলে বিভক্ত করে এবং তাদের মধ্যে লজিক্যাল রিলেশন তৈরি করে। এর মূল লক্ষ্য হলো ডাটাবেস থেকে অপ্রয়োজনীয় বা duplicate ডেটা (Redundancy) দূর করা এবং ডেটার Integrity নিশ্চিত করা।

### Why is it needed?

একটি Unnormalized ডাটাবেস মেইনটেইন করা অত্যন্ত কঠিন। Normalization নিচের কারণগুলোর জন্য প্রয়োজন:

1. **Storage Efficiency:** একই তথ্য বারবার সেভ করতে হয় না বলে মেমোরি বা স্টোরেজ কম লাগে।
2. **Data Consistency:** যখন কোনো তথ্য update করা হয়, তখন সেটি যেন সব জায়গায় সঠিকভাবে প্রতিফলিত হয় তা নিশ্চিত করার জন্য এটি প্রয়োজন।
3. **Better Organization:** টেবিলগুলো ছোট এবং নির্দিষ্ট বিষয়ভিত্তিক হওয়ায় ডেটা খুঁজে পাওয়া এবং ম্যানেজ করা সহজ হয়।
4. **Scalability:** ডাটাবেস বড় হওয়ার সাথে সাথে নতুন ডেটা যোগ করা সহজ হয় কোনো ঝামেলা ছাড়াই।

### What problems does it solve?

Normalization প্রধানত তিনটি বড় সমস্যার সমাধান করে, যাদের একত্রে **Modification Anomalies** বলা হয়:

#### ১. Insertion Anomaly

যদি একটি টেবিলে স্টুডেন্ট এবং তাদের কোর্সের তথ্য একসাথে থাকে, তবে কোনো নতুন কোর্স চালু হলে সেখানে কোনো স্টুডেন্ট ভর্তি না হওয়া পর্যন্ত আপনি কোর্সটি ডাটাবেসে এন্ট্রি দিতে পারবেন না। Normalization কোর্স এবং স্টুডেন্ট টেবিল আলাদা করে এই সমস্যার সমাধান করে।

#### ২. Update Anomaly

ধরুন, একজন কাস্টমারের ঠিকানা ডাটাবেসের ১০টি জায়গায় আছে। যদি সে তার ঠিকানা পরিবর্তন করে এবং আপনি কেবল ৫টি জায়গায় update করেন, তবে ডেটা ইনকনসিস্টেন্ট হয়ে যাবে। নরমালাইজড টেবিলে ঠিকানা কেবল এক জায়গাতেই থাকে, তাই একবার update করলেই সব জায়গায় সঠিক তথ্য পাওয়া যায়।

#### ৩. Deletion Anomaly

যদি আপনি কোনো স্টুডেন্টের তথ্য ডিলিট করতে গিয়ে দেখেন যে ওই রো-তে থাকা কোর্সের তথ্যও ডিলিট হয়ে গেছে (কারণ তারা একই টেবিলে ছিল), তবে সেটা ডিলিট অ্যানোমালি। Normalization এই অনাকাঙ্ক্ষিত ডেটা লস রোধ করে।

### Problems Created by Normalization

**1. Performance Issues:**

* Multiple JOINs required for simple queries
* Increased query complexity and execution time

**2. Development Complexity:**

* More complex SQL queries
* Understanding relationships requires expertise

**3. Maintenance Overhead:**

* More tables to manage
* Complex referential integrity constraints

---

### 0NF: Unnormalized Form

0NF represents the raw, unstructured data যেখানে কোন normalization rules apply করা হয়নি। এখানে data থাকে flat file বা spreadsheet format এ।

**Example - University Student System:**

| Student_ID | Student_Name | Age | Courses | Course_Credits | Instructor_Names | Dept_Name | Dept_Location |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Mamun | 22 | DBMS, Physics | 3, 4 | Dr. Khan, Dr. Rahman | CSE | Building A |
| 2 | Arafat | 21 | Math, Chemistry | 4, 3 | Dr. Ali, Dr. Hassan | Physics | Building B |
| 3 | Rashida | 23 | DBMS | 3 | Dr. Khan | CSE | Building A |

**Critical Problems in 0NF:**

1. **Multi-valued Attributes:** * `Courses` column এ multiple values (DBMS, Physics)
* `Course_Credits` column এ multiple values (3, 4)
* `Instructor_Names` column এ multiple values


2. **Data Redundancy:**
* `CSE` department name এবং `Building A` location multiple times repeat
* `Dr. Khan` instructor name multiple times appear


3. **Storage Inefficiency:**
* Same information multiple places এ store
* Unnecessary disk space consumption


4. **Data Anomalies:**
* **Insert Anomaly:** নতুন course add করতে হলে পুরো student record দিতে হবে
* **Update Anomaly:** CSE department location change করতে হলে multiple rows update করতে হবে
* **Delete Anomaly:** Mamun কে delete করলে DBMS course এর information হারিয়ে যেতে পারে



---

## **33. Explain 1NF, 2NF, 3NF?**

### Step 1: 1NF Achieving Atomicity

1NF হল Normalization এর **first step** যেখানে আমরা ensure করি যে:

1. **Each cell contains atomic (indivisible) values**
2. **Each row is unique** (Primary Key দ্বারা)
3. **No repeating groups** of data

**Rules for 1NF:**

* প্রতিটি column এ **single value** থাকতে হবে
* **Multi-valued attributes** eliminate করতে হবে
* **Primary Key** define করতে হবে row uniqueness এর জন্য

**Conversion to 1NF:**

*Step 1: Break down multi-valued attributes*

| Student_ID | Student_Name | Age | Course | Course_Credit | Instructor_Name | Dept_Name | Dept_Location |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Mamun | 22 | DBMS | 3 | Dr. Khan | CSE | Building A |
| 1 | Mamun | 22 | Physics | 4 | Dr. Rahman | CSE | Building A |
| 2 | Arafat | 21 | Math | 4 | Dr. Ali | Physics | Building B |
| 2 | Arafat | 21 | Chemistry | 3 | Dr. Hassan | Physics | Building B |
| 3 | Rashida | 23 | DBMS | 3 | Dr. Khan | CSE | Building A |

*Step 2: Define Primary Key*

* **Primary Key:** `(Student_ID, Course)`
* এই composite key প্রতিটি row কে uniquely identify করে

**Benefits of 1NF:**

* ✅ **Atomic values** → easy searching, filtering, indexing
* ✅ **Row uniqueness** → prevents duplicate records
* ✅ **Eliminates multi-valued attributes** → cleaner data structure
* ✅ **Query optimization** → database engine can better optimize queries

**Remaining Problems after 1NF:**

* ❌ **Data redundancy still exists** (Student info repeats)
* ❌ **Partial dependency exists** (Student_Name depends only on Student_ID)
* ❌ **Update anomalies persist** ---

### Step 2: 2NF Eliminating Partial Dependency

2NF achieve করতে হলে:

1. Table must be in **1NF**
2. **No partial dependency** should exist
3. Every **non-key attribute** must be **fully functionally dependent** on the **entire primary key**

**Understanding Partial Dependency:**
**Partial Dependency** occurs যখন একটি **non-key attribute** শুধুমাত্র **composite primary key এর একটি অংশের উপর depend** করে।

*In our 1NF table:*

* Primary Key = `(Student_ID, Course)`
* `Student_Name` depends শুধু `Student_ID` এর উপর, `Course` এর উপর না
* `Age` depends শুধু `Student_ID` এর উপর
* `Dept_Name` depends শুধু `Student_ID` এর উপর

*Functional Dependencies:*

* `Student_ID` → `Student_Name, Age, Dept_Name, Dept_Location`
* `Course` → `Course_Credit, Instructor_Name`
* `(Student_ID, Course)` → `all attributes`

**Conversion to 2NF:**

*Step 1: Create Student Table*
| Student_ID (PK) | Student_Name | Age | Dept_Name | Dept_Location |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Mamun | 22 | CSE | Building A |
| 2 | Arafat | 21 | Physics | Building B |
| 3 | Rashida | 23 | CSE | Building A |

*Step 2: Create Course Table*
| Course_ID (PK) | Course_Name | Course_Credit | Instructor_Name |
| :--- | :--- | :--- | :--- |
| 101 | DBMS | 3 | Dr. Khan |
| 102 | Physics | 4 | Dr. Rahman |
| 103 | Math | 4 | Dr. Ali |
| 104 | Chemistry | 3 | Dr. Hassan |

*Step 3: Create Enrollment Table (Junction Table)*
| Student_ID (FK) | Course_ID (FK) |
| :--- | :--- |
| 1 | 101 |
| 1 | 102 |
| 2 | 103 |
| 2 | 104 |
| 3 | 101 |

**Key Concepts in 2NF:**

* **Foreign Key (FK):** Reference to primary key of another table
* **Junction Table:** Manages many-to-many relationship between Student and Course
* **Referential Integrity:** FK values must exist in referenced table

**Benefits of 2NF:**

* ✅ **Eliminates partial dependency** * ✅ **Reduces data redundancy** significantly
* ✅ **Insert anomaly solved:** Can add new course without student
* ✅ **Update anomaly reduced:** Change student name only once
* ✅ **Storage efficiency improved** **Remaining Problems after 2NF:**
* ❌ **Transitive dependency exists** (Dept_Name depends on Student_ID through department)
* ❌ **Some redundancy remains** ---

### Step 3: 3NF Eliminating Transitive Dependency

3NF achieve করতে হলে:

1. Table must be in **2NF**
2. **No transitive dependency** should exist
3. **Non-key attributes** should not depend on other **non-key attributes**

**Understanding Transitive Dependency:**
**Transitive Dependency** occurs যখন:

* A → B (A determines B)
* B → C (B determines C)
* Therefore: A → C (A transitively determines C)

*In our Student table:*

* `Student_ID` → `Dept_Name` (Student belongs to a department)
* `Dept_Name` → `Dept_Location` (Department has a location)
* Therefore: `Student_ID` → `Dept_Location` (transitive dependency)

**Conversion to 3NF:**

*Step 1: Create Department Table*
| Dept_ID (PK) | Dept_Name | Dept_Location | Dept_Head | Established_Year |
| :--- | :--- | :--- | :--- | :--- |
| 10 | CSE | Building A | Dr. Ahmed | 1995 |
| 20 | Physics | Building B | Dr. Sultana | 1980 |
| 30 | Math | Building C | Dr. Karim | 1975 |

*Step 2: Update Student Table*
| Student_ID (PK) | Student_Name | Age | Dept_ID (FK) |
| :--- | :--- | :--- | :--- |
| 1 | Mamun | 22 | 10 |
| 2 | Arafat | 21 | 20 |
| 3 | Rashida | 23 | 10 |

*Step 3: Course Table (Enhanced)*
| Course_ID (PK) | Course_Name | Course_Credit | Instructor_ID (FK) | Dept_ID (FK) |
| :--- | :--- | :--- | :--- | :--- |
| 101 | DBMS | 3 | 501 | 10 |
| 102 | Physics | 4 | 502 | 20 |
| 103 | Math | 4 | 503 | 30 |
| 104 | Chemistry | 3 | 504 | 20 |

*Step 4: Create Instructor Table*
| Instructor_ID (PK) | Instructor_Name | Qualification | Dept_ID (FK) |
| :--- | :--- | :--- | :--- |
| 501 | Dr. Khan | PhD in CS | 10 |
| 502 | Dr. Rahman | PhD in Physics| 20 |
| 503 | Dr. Ali | PhD in Math | 30 |
| 504 | Dr. Hassan | PhD in Chem | 20 |

*Step 5: Enrollment Table (unchanged)*
| Student_ID (FK) | Course_ID (FK) | Enrollment_Date | Grade |
| :--- | :--- | :--- | :--- |
| 1 | 101 | 2024-01-15 | A |
| 1 | 102 | 2024-01-15 | B+ |
| 2 | 103 | 2024-01-16 | A- |
| 2 | 104 | 2024-01-16 | B |
| 3 | 101 | 2024-01-17 | A+ |

**Benefits of 3NF:**

* ✅ **Eliminates transitive dependency completely** * ✅ **Maximum data redundancy reduction** * ✅ **All anomalies eliminated:**
* Insert: Can add department without student
* Update: Change department location once
* Delete: Deleting student doesn't affect department info


* ✅ **Optimal storage utilization** * ✅ **Enhanced data integrity** * ✅ **Better database maintenance** **Types of Dependencies Eliminated:**

1. Multi-valued Dependencies: Eliminated in 1NF
2. Partial Dependencies: Eliminated in 2NF
3. Transitive Dependencies: Eliminated in 3NF

---

## **34. When to Use Each Normal Form**

নরমালাইজেশনের প্রতিটি লেভেলের নিজস্ব গুরুত্ব রয়েছে। তবে প্র্যাকটিক্যাল ডাটাবেস ডিজাইনে সবসময় সব টেবিলকে সর্বোচ্চ লেভেল পর্যন্ত নরমালাইজ করা হয় না। কখন কোন ফরমটি ব্যবহার করবেন, তা নির্ভর করে আপনার সিস্টেমের প্রয়োজন এবং পারফরম্যান্সের ওপর।

নিচে একটি গাইডলাইন দেওয়া হলো:

#### ১. First Normal Form (1NF) কখন ব্যবহার করবেন?

**ব্যবহার:** প্রতিটি ডাটাবেস টেবিলের জন্য এটি **বাধ্যতামূলক**।

* যখন আপনার টেবিলের কোনো কলামে কমা দিয়ে একাধিক ভ্যালু (যেমন: একাধিক ফোন নম্বর বা স্কিল) থাকে, তখন 1NF ব্যবহার করে সেগুলোকে আলাদা করতে হয়।
* **উদ্দেশ্য:** ডেটা সার্চিং এবং query সহজ করা।

#### ২. Second Normal Form (2NF) কখন ব্যবহার করবেন?

**ব্যবহার:** যখন আপনার টেবিলে **Composite Primary Key** (একাধিক কলাম মিলে একটি কি) থাকে।

* যদি দেখেন কোনো কলাম পুরো প্রাইমারি কি-র ওপর নির্ভর না করে কেবল একটি অংশের ওপর নির্ভর করছে (Partial Dependency), তখন সেটিকে আলাদা টেবিলে নিয়ে যান।
* **উদ্দেশ্য:** একই তথ্য বারবার ইনসার্ট করা বন্ধ করা (Redundancy কমানো)।

#### ৩. Third Normal Form (3NF) কখন ব্যবহার করবেন?

**ব্যবহার:** বেশিরভাগ **Transactional (OLTP)** সিস্টেমের জন্য এটি গোল্ডেন স্ট্যান্ডার্ড।

* যদি একটি নন-কি কলাম অন্য একটি নন-কি কলামের ওপর নির্ভর করে (যেমন: জিপ কোড জানলে সিটি জানা যায়), তবে 3NF ব্যবহার করে সিটিকে আলাদা টেবিলে রাখতে হয়।
* **উদ্দেশ্য:** ডেটা update এবং ডিলিট করার সময় ইনকনসিস্টেন্সি বা Anomaly দূর করা।

#### ৪. Boyce-Codd Normal Form (BCNF) কখন ব্যবহার করবেন?

**ব্যবহার:** যখন একটি টেবিলে একাধিক ওভারল্যাপিং ক্যান্ডিডেট কি (Candidate Keys) থাকে।

* এটি 3NF-এর একটি শক্তিশালী সংস্করণ। সাধারণত জটিল সিস্টেম (যেমন: ফিন্যান্সিয়াল বা সায়েন্টিফিক ডাটাবেস) যেখানে ডেটার নির্ভুলতা ১০০% নিশ্চিত করতে হয়, সেখানে এটি ব্যবহৃত হয়।

#### ৫. Denormalization: কখন normalization কমিয়ে দেবেন?

সবসময় 3NF বা BCNF ভালো নয়। বিশেষ করে **Data Warehousing** বা **OLAP** সিস্টেমে যেখানে অনেক বড় বড় রিপোর্ট জেনারেট করতে হয়, সেখানে normalization কিছুটা কমিয়ে দেওয়া হয় (যাকে Denormalization বলে)।

* **কেন?** খুব বেশি normalization করলে table সংখ্যা বেড়ে যায়, ফলে অনেক বেশি `JOIN` ব্যবহার করতে হয় যা সিস্টেমকে ধীর করে দেয়।
* **কখন:** যখন আপনার রিড অপারেশন (Read) write অপারেশনের (Write) চেয়ে অনেক বেশি এবং দ্রুত পারফরম্যান্স জরুরি।

---

## **35. What is Denormalization?**

**Denormalization** হলো একটি ডাটাবেস অপ্টিমাইজেশন টেকনিক যেখানে পূর্বে নরমালাইজ করা একটি ডাটাবেসে ইচ্ছাকৃতভাবে কিছু duplicate ডেটা বা রিডান্ডেন্সি (Redundancy) ফিরিয়ে আনা হয়।

সহজ কথায়, নরমালাইজেশনে আমরা টেবিলগুলোকে ভেঙে ছোট করি, আর ডিনরমালাইজেশনে আমরা টেবিলগুলোকে আবার জোড়া দিই বা একই তথ্য একাধিক টেবিলে রাখি যাতে query করার সময় অনেকগুলো `JOIN` ব্যবহার করতে না হয়।

### When would you prefer denormalization?

সব ক্ষেত্রে denormalization ভালো নয়। এটি কেবল তখনই ব্যবহার করা হয় যখন:

1. **Read-Intensive Applications:** যখন আপনার সিস্টেমে ডেটা write করার চেয়ে রিড (Read) করার পরিমাণ অনেক বেশি।
2. **Complex Joins:** যখন একটি query রান করতে ৫-৬টি বা তার বেশি table `JOIN` করতে হয়, যা সিস্টেমকে ধীর করে দেয়।
3. **Reporting & Analytics (OLAP):** ডেটা ওয়্যারহাউজিং বা ড্যাশবোর্ড তৈরির সময় যেখানে দ্রুত বড় রিপোর্ট জেনারেট করা প্রয়োজন।
4. **Calculated Fields:** যখন কোনো কলামের ভ্যালু প্রতিবার ক্যালকুলেট করা সময়সাপেক্ষ (যেমন: টোটাল সেলস বা এভারেজ মার্কস), তখন সেই ক্যালকুলেটেড ভ্যালুটি একটি কলামে সেভ করে রাখা হয়।

### Trade-offs of denormalization

denormalization করার আগে আপনাকে এর সুবিধা এবং ঝুঁকির ভারসাম্য বুঝতে হবে:

**Advantages:**

* **Faster Queries:** table সংখ্যা কম হওয়ায় `JOIN` কম লাগে এবং query অনেক দ্রুত এক্সিকিউট হয়।
* **Simple SQL:** query লেখা অনেক সহজ হয়ে যায়।
* **Improved Performance:** বড় ডেটাসেটের ওপর এগ্রিগেশন (Sum, Average) করা সহজ হয়।

**Disadvantages/Risks:**

* **Data Inconsistency:** যেহেতু একই ডেটা একাধিক জায়গায় থাকে, তাই এক জায়গায় update করে অন্য জায়গায় ভুলে গেলে ডেটা ইনকনসিস্টেন্ট হয়ে যায়।
* **Update/Insert Overhead:** ডেটা write বা update করার সময় সব জায়গায় update করতে হয়, যা write পারফরম্যান্স কমিয়ে দেয়।
* **Increased Storage:** duplicate ডেটা থাকার কারণে ডাটাবেসের সাইজ অনেক বড় হয়ে যায়।
* **Code Complexity:** অ্যাপ্লিকেশন লেভেলে ডেটার নির্ভুলতা বজায় রাখার জন্য বাড়তি কোড লিখতে হয়।

---

## **36. Explain the difference between 2NF and 3NF with a real example**

The key difference lies in the type of dependency eliminated:

**2NF eliminates Partial Dependencies:**

* When non-key attributes depend on part of a composite key
* Example: `(Student_ID, Course_ID) → Student_Name`
* Student_Name depends only on Student_ID, not the full key

**3NF eliminates Transitive Dependencies:**

* When non-key attributes depend on other non-key attributes
* Example: `Student_ID → Dept_Name → Dept_Location`
* Dept_Location depends on Dept_Name, not directly on Student_ID

---

## **37. What are anomalies in database design?**

ডাটাবেস ডিজাইনে **Anomalies** হলো এমন কিছু অনাকাঙ্ক্ষিত সমস্যা যা মূলত অগোছালো বা ত্রুটিপূর্ণ টেবিল স্ট্রাকচারের কারণে ঘটে। যখন একটি টেবিলে অপ্রয়োজনীয়ভাবে একই ডেটা বারবার (Redundancy) রাখা হয়, তখন ডেটা ইনসার্ট, আপডেট বা ডিলিট করতে গেলে যে অসামঞ্জস্যতা তৈরি হয়, তাকেই Anomaly বলে।

নিচে তিনটি প্রধান Anomaly উদাহরণের মাধ্যমে ব্যাখ্যা করা হলো:

#### ১. Insertion Anomaly

এটি ঘটে যখন কোনো নতুন ডেটা এন্ট্রি দেওয়ার জন্য এমন কোনো তথ্যের প্রয়োজন হয় যা ওই মুহূর্তে আপনার কাছে নেই।

* **উদাহরণ:** ধরুন, একটি টেবিলে স্টুডেন্ট এবং তাদের কোর্সের তথ্য একসাথে আছে। টেবিলের কলামগুলো হলো: `StudentID`, `StudentName`, `CourseID`, `CourseName`।
* **সমস্যা:** এখন কলেজ যদি একটি নতুন কোর্স "Cyber Security" চালু করে, কিন্তু কোনো স্টুডেন্ট এখনও তাতে ভর্তি না হয়, তবে আপনি কোর্সটি ডাটাবেসে এন্ট্রি দিতে পারবেন না। কারণ `StudentID` (Primary Key) খালি রাখা সম্ভব নয়। নতুন কোর্স এন্ট্রি দেওয়ার জন্য একজন স্টুডেন্টের প্রয়োজন হওয়াটাই হলো ইনসার্ট অ্যানোমালি।

#### ২. Update Anomaly

যখন একটি তথ্য ডাটাবেসের অনেকগুলো রো-তে ডুপ্লিকেট হিসেবে থাকে এবং আপডেট করার সময় সব জায়গায় সঠিকভাবে করা হয় না, তখন ডেটা ইনকনসিস্টেন্ট হয়ে যায়।

* **উদাহরণ:** একই টেবিলে রহিম নামের একজন স্টুডেন্ট ৩টি ভিন্ন কোর্সে ভর্তি আছে। তার ঠিকানা ৩টি রো-তেই লেখা আছে।
* **সমস্যা:** রহিম যদি তার ঠিকানা পরিবর্তন করে এবং আপনি কেবল ২টি রো-তে আপডেট করেন আর ১টিতে ভুলে যান, তবে ডাটাবেসে রহিমের দুটি ভিন্ন ঠিকানা দেখাবে। এতে ডেটার সত্যতা নষ্ট হয়। এটিই আপডেট অ্যানোমালি।

#### ৩. Deletion Anomaly

এটি ঘটে যখন একটি অপ্রয়োজনীয় তথ্য ডিলিট করতে গিয়ে ভুলবশত আমরা এমন কিছু তথ্য হারিয়ে ফেলি যা আমাদের প্রয়োজন ছিল।

* **উদাহরণ:** ধরুন, "Physics" কোর্সটি কেবল একজন স্টুডেন্ট (করিম) নিয়েছে। করিম যদি এখন কলেজ ছেড়ে চলে যায় এবং আমরা তার রো-টি ডিলিট করে দিই, তবে করিমের তথ্যের সাথে সাথে "Physics" কোর্সের অস্তিত্বও ডাটাবেস থেকে মুছে যাবে। আমরা কেবল করিমকে সরাতে চেয়েছিলাম, কিন্তু সিস্টেম পুরো কোর্সের তথ্যই হারিয়ে ফেলল। এটিই ডিলিট অ্যানোমালি।

### How Normalization prevents these anomalies?

নরমালাইজেশন মূলত **"Divide and Conquer"** পদ্ধতিতে এই সমস্যার সমাধান করে:

* **টেবিল বিভক্ত করা:** নরমালাইজেশনের মাধ্যমে আমরা একটি বড় অগোছালো টেবিলকে ছোট ছোট লজিক্যাল টেবিলে ভাগ করি (যেমন: স্টুডেন্টের জন্য আলাদা টেবিল, কোর্সের জন্য আলাদা টেবিল)।
* **Redundancy কমানো:** একই তথ্য বারবার না লিখে আমরা **Primary Key** এবং **Foreign Key** ব্যবহার করে টেবিলগুলোর মধ্যে রিলেশন তৈরি করি।
* **Anomaly দূর করা:**
   * কোর্স টেবিল আলাদা হওয়ায় স্টুডেন্ট ছাড়াই নতুন কোর্স অ্যাড করা যায় (**No Insertion Anomaly**)।
   * ঠিকানা কেবল স্টুডেন্ট টেবিলে একবারই থাকে, তাই এক জায়গায় আপডেট করলেই হয় (**No Update Anomaly**)।
   * স্টুডেন্ট ডিলিট করলে কেবল স্টুডেন্ট টেবিল থেকে ডেটা যায়, কোর্স টেবিল অক্ষত থাকে (**No Deletion Anomaly**)।



---

## **38. How do you handle many-to-many relationships in database design?**

Many-to-many relationships require a Junction/Bridge table:

Example: Student-Course Relationship

**Wrong Approach (Violates 1NF):**
`Students(ID, Name, Courses)` // Courses as comma-separated values

**Correct Approach:**

1. **Students Table:** Student_ID (PK), Name, Email
2. **Courses Table:** Course_ID (PK), Name, Credits
3. **Enrollments Table:** Student_ID (FK), Course_ID (FK), Grade, Date

**Junction Table Benefits:**

* Maintains referential integrity
* Allows additional attributes (Grade, Enrollment_Date)
* Enables efficient queries
* Supports proper indexing

**Advanced Considerations:**

* **Composite Primary Key:** (Student_ID, Course_ID)
* **Additional Attributes:** Enrollment date, grade, status
* **Constraints:** Prevent duplicate enrollments
* **Indexes:** On foreign key columns for performance

**Query Examples:**

* Find all courses for a student: JOIN through Enrollments
* Find all students in a course: JOIN through Enrollments
* Count enrollments: Aggregate on Enrollments table

---

## **39. Explain ACID properties and their relationship to normalization**

ডাটাবেস ম্যানেজমেন্ট সিস্টেমে **ACID properties** এবং **Normalization** একে অপরের পরিপূরক। ACID নিশ্চিত করে যে একটি ট্রানজেকশন কতটা নির্ভরযোগ্যভাবে সম্পন্ন হবে, আর Normalization নিশ্চিত করে যে ডাটাবেসের গঠন কতটা নির্ভুল হবে।

### **ACID Properties কী?**

ACID হলো চারটি গুণের সমষ্টি যা একটি ডাটাবেস ট্রানজেকশনের নির্ভরযোগ্যতা নিশ্চিত করে:

* **Atomicity (অখণ্ডতা):** ট্রানজেকশনটি হয় পুরোপুরি সম্পন্ন হবে, না হয় মোটেও হবে না। মাঝপথে কোনো ভুল হলে সব কাজ আগের অবস্থায় ফিরে যাবে (Rollback)।
* **Consistency (সামঞ্জস্যতা):** ট্রানজেকশন শুরুর আগে এবং পরে ডাটাবেস যেন নির্ধারিত নিয়ম (Constraints) মেনে চলে।
* **Isolation (বিচ্ছিন্নতা):** একসাথে একাধিক ট্রানজেকশন চললেও একটির কাজ অন্যটির ওপর প্রভাব ফেলবে না।
* **Durability (স্থায়িত্ব):** একবার ট্রানজেকশন সফলভাবে Commit হলে, সিস্টেম ক্র্যাশ করলেও সেই ডেটা হারাবে না।

### **ACID এবং Normalization-এর সম্পর্ক**

Normalization মূলত ডাটাবেসের **Consistency** (সামঞ্জস্যতা) রক্ষা করতে ACID-কে সরাসরি সাহায্য করে। এদের সম্পর্ক নিচের পয়েন্টগুলোর মাধ্যমে বোঝা যায়:

#### **Consistency রক্ষা করা (মূল সংযোগ)**

Normalization-এর প্রধান লক্ষ্য হলো **Redundancy** বা ডেটা ডুপ্লিকেশন কমানো। যদি ডাটাবেস নরমালাইজড না থাকে এবং একই তথ্য অনেক জায়গায় থাকে, তবে ACID-এর 'Consistency' বজায় রাখা কঠিন হয়ে পড়ে।

> **উদাহরণ:** নরমালাইজড ডাটাবেসে একজন ইউজারের ঠিকানা এক জায়গাতেই থাকে। ফলে আপডেট করার সময় একটি রো আপডেট করলেই ACID প্রপার্টি পুরো ডাটাবেসকে কনসিস্টেন্ট রাখতে পারে।

#### **Atomicity-র ওপর প্রভাব**

একটি আন-নরমালাইজড টেবিলে আপডেট অ্যানোমালি থাকলে, একটি মাত্র তথ্য পরিবর্তনের জন্য ডাটাবেসকে অনেকগুলো রো আপডেট করতে হয়। এতে ট্রানজেকশন বড় হয়ে যায় এবং **Atomicity** বজায় রাখা জটিল হয় (কারণ অনেকগুলো অপারেশনের যেকোনো একটি ফেইল করলে পুরোটা রোলব্যাক করতে হয়)। নরমালাইজেশন ট্রানজেকশনকে ছোট এবং সুনির্দিষ্ট করে তোলে।

#### **Isolation এবং Locking**

নরমালাইজড ডাটাবেসে টেবিলগুলো ছোট ছোট ভাগে বিভক্ত থাকে। ফলে যখন একটি ট্রানজেকশন নির্দিষ্ট কিছু ডেটা আপডেট করে, তখন ডাটাবেসকে কেবল ছোট একটি অংশ বা নির্দিষ্ট রো লক করতে হয়। এটি **Isolation** নিশ্চিত করতে সাহায্য করে এবং একাধিক ট্রানজেকশনকে সহজে চলতে দেয় (Concurrency বাড়ায়)।

### **একটি বাস্তব উদাহরণ**

ধরুন একটি ব্যাংকিং ডাটাবেস নরমালাইজড নয় (অর্থাৎ ইউজার এবং অ্যাকাউন্ট ব্যালেন্স একই টেবিলে অনেকবার আছে)।

1. **Normalization ছাড়া:** আপনি টাকা ট্রান্সফার করার সময় যদি ৫টি জায়গায় ইউজারের ব্যালেন্স আপডেট করতে হয় এবং ৩টি হওয়ার পর সিস্টেম ক্র্যাশ করে, তবে ACID-এর **Atomicity** এবং **Consistency** ভেঙে পড়বে।
2. **Normalization সহ:** ব্যালেন্স কেবল একটি টেবিলে একটি নির্দিষ্ট রো-তে থাকে। ফলে ACID কেবল ওই একটি রো সঠিকভাবে আপডেট করলেই পুরো সিস্টেমের নির্ভুলতা নিশ্চিত করতে পারে।

---

## **40. How do you optimize queries on highly normalized databases?**

Several strategies can optimize queries on normalized databases:

**1. Indexing Strategy:**

* Primary keys (automatic indexes)
* Foreign key columns for JOIN performance
* Composite indexes for multi-column searches
* Covering indexes for SELECT-only queries

**2. Query Optimization:**

* Use EXPLAIN PLAN to analyze execution
* Write efficient JOIN conditions
* Filter early with WHERE clauses
* Use EXISTS instead of IN for subqueries

**3. Denormalization Techniques:**

* Materialized Views: Pre-computed JOINs
* Calculated Fields: Store computed values
* Summary Tables: Aggregate data for reporting

**4. Caching Strategies:**

* Application-level caching: Redis, Memcached
* Database query caching: Built-in mechanisms
* Result set caching: For expensive queries

**5. Database Design:**

* Partitioning: Split large tables
* Read Replicas: Separate read/write operations
* Archive Old Data: Keep active data small

**Monitoring and Maintenance:**

* Regular EXPLAIN PLAN analysis
* Index usage statistics
* Query performance monitoring
* Periodic optimization reviews

---

## **41. What is functional dependency?**

Functional Dependency হলো Database Management System এর একটি গুরুত্বপূর্ণ ধারণা, যা রিলেশনাল ডাটাবেসের টেবিলে attributes এর মধ্যে সম্পর্ক বোঝায়। সহজ ভাষায়, যদি একটি attribute বা attribute set `X` এর মান থেকে আরেকটি attribute বা attribute set `Y` এর মান নির্ধারিত হয়, তাহলে বলা হয় যে `Y` হলো `X` এর উপর functionally dependent। এটি সাধারণত `X → Y` হিসেবে প্রকাশ করা হয়।

* **উদাহরণ:** ধরা যাক, একটি টেবিলে আছে `Student_ID` এবং `Student_Name` attributes। যদি প্রতিটি `Student_ID` একটি নির্দিষ্ট `Student_Name` নির্ধারণ করে, তাহলে `Student_Name` হলো `Student_ID` এর উপর functionally dependent। অর্থাৎ, `Student_ID → Student_Name`।

### How to Identify Functional Dependencies?

functionally dependencies চিহ্নিত করতে নিম্নলিখিত ধাপগুলো অনুসরণ করা হয়:

1. **Domain knowledge:** প্রথমে ডাটাবেসের প্রতিটি attributes এবং তাদের মধ্যে সম্পর্ক বোঝা প্রয়োজন। এর জন্য Business Rules এবং ডাটার প্রকৃতি বিশ্লেষণ করতে হয়। উদাহরণস্বরূপ, একটি স্টুডেন্ট ডাটাবেসে Student_ID সবসময় একটি নির্দিষ্ট Student_Name নির্ধারণ করে।
2. **Data examination:** টেবিলের ডাটা পরীক্ষা করে দেখতে হবে কোন attribute বা attribute set অন্য attribute এর মান নির্ধারণ করছে কিনা। এটি data sample থেকে বা domain knowledge থেকে নির্ধারণ করা যায়।
3. **Uniqueness checking:** একটি attribute `X` এর প্রতিটি মানের জন্য `Y` এর মান যদি সবসময় একই হয়, তাহলে `X → Y` একটি functional dependency। উদাহরণ: যদি প্রতিটি Employee_ID একটি নির্দিষ্ট Department নির্ধারণ করে, তাহলে `Employee_ID → Department`।
4. **Key and Candidate Key:** Candidate Key হলো এমন attribute বা attribute set যা পুরো টেবিলের প্রতিটি Row কে ইউনিকলি চিহ্নিত করে এবং অন্যান্য attributes এর উপর ফাংশনালি ডিপেন্ডেন্ট করে। এটি চিহ্নিত করা functional dependencies বোঝার জন্য গুরুত্বপূর্ণ।
5. **Normalization:** Normalization করার সময় functional dependencies চিহ্নিত করা হয়। এটি ডাটাবেসের Redundancy কমাতে এবং Data Integrity নিশ্চিত করতে সাহায্য করে।

### What is trivial vs non-trivial functional dependency?

#### Trivial Functional Dependency:

* এটা খুব সহজ আর স্বাভাবিক সম্পর্ক। যখন একটা কলাম (`Y`) ইতিমধ্যেই আরেকটা কলাম সেট (`X`) এর অংশ হয়, তখন এটাকে trivial বলে।
* **উদাহরণ:** `(Student_ID, Student_Name) → Student_Name`। এখানে Student_Name ইতিমধ্যে সেটের মধ্যে আছে, তাই এটা trivial।
* এটা সবসময় সত্য, তাই ডাটাবেস ডিজাইনে খুব বেশি কাজে লাগে না।

#### Non-Trivial Functional Dependency:

* এটা এমন সম্পর্ক যেখানে `Y`, `X` এর অংশ নয়। অর্থাৎ, `X` থেকে `Y` এর মান বোঝা যায়, কিন্তু `Y`, `X` এর মধ্যে নেই।
* **উদাহরণ:** `Student_ID → Student_Name`। এখানে Student_Name, Student_ID এর সেটের অংশ নয়, তাই এটা non-trivial।
* এটা ডাটাবেস ডিজাইনে গুরুত্বপূর্ণ, কারণ এটা attributes এর মধ্যে অর্থপূর্ণ সম্পর্ক দেখায়।

**পার্থক্য:**

* **Trivial:** স্বাভাবিক, সবসময় সত্য। যেমন: `A, B → A`।
* **Non-Trivial:** অর্থপূর্ণ সম্পর্ক, ডাটাবেস ডিজাইনের জন্য জরুরি। যেমন: `Employee_ID → Department_Name`।

এই ধারণাগুলো ডাটাবেস ভালোভাবে ডিজাইন করতে এবং Data Integrity বজায় রাখতে খুব গুরুত্বপূর্ণ।

---

## **Advanced Considerations & Trade-offs**

#### **Denormalization Strategies:**

**1. Controlled Redundancy:**

* Store frequently accessed calculated values
* Maintain consistency through triggers or application logic
* Example: Customer total orders, Product average rating

**2. Materialized Views:**

* Pre-computed complex JOINs
* Refresh strategies (immediate vs scheduled)
* Suitable for data warehousing

**3. NoSQL Integration:**

* Use normalized RDBMS for transactions
* Use denormalized NoSQL for read-heavy operations
* Example: Product catalog in MongoDB, orders in PostgreSQL

