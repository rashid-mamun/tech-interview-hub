---
sidebar_position: 2
title: 'Second'
---


---

## **32. What is Normalization?**

Normalization হল এমন একটি process যেখানে relational database এর tables গুলোকে ছোট ছোট logically related tables এ ভাগ করা হয়, যাতে redundancy কমে এবং data consistency বাড়ে।

Normalization এ আমরা step by step Normal Forms (1NF, 2NF, 3NF, BCNF …) apply করি।

### Why is it needed?

Normalization দরকার হয় কয়েকটা কারণে:

1. Redundancy কমানো → একই data বারবার store না করে একবার রাখা।
2. Data consistency রাখা → update করলে সব জায়গায় একই রকম থাকে।
3. Storage efficiency → অপ্রয়োজনীয় duplicate data কমে যায়।
4. Maintainability → database structure clear হয়, maintain করা সহজ হয়।
5. Data integrity → logically related data আলাদা আলাদা table এ রাখলে error কমে।


### What problems does it solve?

Normalization না করলে database এ অনেক ধরনের problem (যেটাকে anomaly বলে) হয়।

**1. Insertion Anomaly**

* নতুন data insert করতে গেলে অপ্রয়োজনীয় বা incomplete data দিতে হয়।
* Example: নতুন course যোগ করতে চাইলে student না থাকলে insert করা যাবে না।

**2. Update Anomaly**

* এক জায়গায় update করলে consistency রাখতে একাধিক জায়গায় update করতে হয়।
* Example: Instructor এর নাম change করলে সব row এ করতে হবে।

**3. Deletion Anomaly**

* কোন data delete করলে অন্য important data ও loss হয়ে যায়।
* Example: Student delete করলে তার সাথে course data ও হারিয়ে যায়।

Normalization এই **Insertion, Update, Deletion anomalies** দূর করে।




## **33. What is Denormalization?**

Denormalization হল database design এর একটি technique যেখানে normalized tables কে ইচ্ছাকৃতভাবে merge বা redundancy introduce করা হয় performance improvement এর জন্য।

অর্থাৎ, normalization করলে table গুলো ছোট ছোট ভাগ হয়ে যায়, join বেশি করতে হয়। অনেক সময় join এর কারণে query slow হয়ে যায়। তখন কিছু টেবিল merge করে বা extra redundant column রাখে → একে বলে denormalization।



### When would you prefer denormalization?

Denormalization ব্যবহার করা হয় তখনই যখন performance বেশি গুরুত্বপূর্ণ হয়ে যায় এবং read-heavy operations দ্রুত করতে হয়।

**Use cases:**

1. Reporting systems / Data warehouse → যেখানে অনেক complex join avoid করতে হয়।
2. Read-heavy systems → যেমন e-commerce product catalog, যেখানে fast searching দরকার।
3. Caching purpose → frequently needed data same table এ রাখা হয়।
4. Aggregation pre-store → sales summary বা count data আগে থেকে table এ রেখে দেওয়া হয়।


### Trade-offs of denormalization?

**✅ Advantages:**

* Query performance improve হয় (কম join লাগে)।
* Complex reports দ্রুত পাওয়া যায়।
* Read-heavy workload handle করা সহজ হয়।

**❌ Disadvantages:**

* Redundancy increase → একই data অনেক জায়গায় থাকে।
* Update anomaly → data mismatch হওয়ার chance বাড়ে।
* Storage cost বেশি হয় (কারণ duplicate data থাকে)।
* Maintenance difficulty → consistency maintain করা কঠিন।


---

## **34. What are anomalies in database design?**

Database design এ anomalies বলতে বোঝায় এমন কিছু সমস্যা বা inconsistency যা ঘটে যখন database proper ভাবে normalized না হয়। মূলত Redundancy (data repetition) এর কারণে anomalies হয়।

এই anomalies তিন ধরনের:

1. Insertion anomaly
2. Update anomaly
3. Deletion anomaly



#### Insertion Anomaly:

যখন নতুন data insert করতে গেলে অপ্রয়োজনীয় বা অসম্পূর্ণ data রাখতে হয়, তখন তাকে insertion anomaly বলে।

**Example:**
ধরি, আমাদের একটা table আছে যেখানে **Student** আর **Course** একসাথে রাখা হয়েছে:

| StudentID | StudentName | Course | Instructor |
| --------- | ----------- | ------ | ---------- |
| 1         | Mamun       | DBMS   | Rahim      |
| 2         | Rashid      | OS     | Karim      |

* এখন যদি নতুন course যোগ করতে চাই (যেমন **AI course**) কিন্তু এখনও কোন student ওই course এ admit হয়নি → তখন course টা insert করা যাবে না।
  ➡️ এটাকেই বলে **insertion anomaly**।



#### Update Anomaly:

যখন এক জায়গায় data update করলে, consistency রাখার জন্য অন্য জায়গাতেও update করতে হয়, না হলে data mismatch হয়ে যায় → এটাকে update anomaly বলে।

**Example:**
উপরের table এ DBMS course এর instructor যদি **Rahim** থেকে পরিবর্তন করে **Hasan** করতে হয়, তাহলে যেখানে যেখানে DBMS আছে, সব row এ instructor update করতে হবে।

* যদি এক row এ update করি কিন্তু অন্য row এ ভুলে যাই → তখন data inconsistent হয়ে যাবে।
  ➡️ এটাকেই বলে **update anomaly**।



#### Deletion Anomaly:

যখন কোন একটা data delete করতে গেলে অন্য important data ও loss হয়ে যায়, তখন সেটা deletion anomaly।

**Example:**
উপরের table থেকে যদি আমরা student Rashid কে delete করি, তাহলে Rashid এর সাথে OS course এর instructor **Karim** এর তথ্যও হারিয়ে যাবে।
➡️ অর্থাৎ student delete করার সাথে সাথে course সম্পর্কিত data ও মুছে যাবে।
➡️ এটাকেই বলে **deletion anomaly**।


### How does Normalization prevent these anomalies?

**Normalization** হল database design process যেটা বড় table কে ছোট ছোট সম্পর্কিত table এ ভেঙে ফেলে redundancy কমায়।

* **Insertion anomaly** fix হয় কারণ course data আলাদা table এ থাকবে। Student না থাকলেও course insert করা যাবে।
* **Update anomaly** fix হয় কারণ এক জায়গায় update করলে অন্য table এ একই data থাকবে না।
* **Deletion anomaly** fix হয় কারণ যদি একজন student delete করি, তবুও course আর instructor data আলাদা table এ safe থাকবে।

---


## **35. What is functional dependency?**


Functional Dependency হলো  Database Management System একটি গুরুত্বপূর্ণ ধারণা, যা রিলেশনাল ডাটাবেসের টেবিলে attributes মধ্যে সম্পর্ক বোঝায়। সহজ ভাষায়, যদি একটি attributes or attributes set X এর মান থেকে আরেকটি attributes or attributes set Y এর মান নির্ধারিত হয়, তাহলে বলা হয় যে Y হলো X এর উপর functionally dependent. এটি সাধারণত X → Y হিসেবে প্রকাশ করা হয়।

উদাহরণ: ধরা যাক, একটি টেবিলে আছে Student_ID এবং Student_Name attributes. যদি প্রতিটি Student_ID একটি নির্দিষ্ট Student_Name নির্ধারণ করে, তাহলে Student_Name হলো Student_ID এর উপর functionally dependent. অর্থাৎ, Student_ID → Student_Name।


### How to Identify Functional Dependencies?

functionally dependencies চিহ্নিত করতে নিম্নলিখিত ধাপগুলো অনুসরণ করা হয়:

1. Domain knowledge: প্রথমে ডাটাবেসের প্রতিটি attributes এবং তাদের মধ্যে সম্পর্ক বোঝা প্রয়োজন। এর জন্য Business Rules এবং ডাটার প্রকৃতি বিশ্লেষণ করতে হয়। উদাহরণস্বরূপ, একটি স্টুডেন্ট ডাটাবেসে Student_ID সবসময় একটি নির্দিষ্ট Student_Name নির্ধারণ করে।

2. Data examination: টেবিলের ডাটা পরীক্ষা করে দেখতে হবে কোন attributes or attributes set  অন্য attributes মান নির্ধারণ করছে কিনা। এটি data sample থেকে or  domen knowledge থেকে নির্ধারণ করা যায়।

3. Uniqueness checking: একটি attributes X এর প্রতিটি মানের জন্য Y এর মান যদি সবসময় একই হয়, তাহলে X → Y একটি functional dependencie। উদাহরণ: যদি প্রতিটি Employee_ID একটি নির্দিষ্ট Department নির্ধারণ করে, তাহলে Employee_ID → Department।

4. Key and Candidate Key: Candidate Key হলো এমন attributes or attributes set যা পুরো টেবিলের প্রতিটি Row কে ইউনিকলি চিহ্নিত করে এবং অন্যান্য attributes উপর ফাংশনালি ডিপেন্ডেন্ট করে। এটি চিহ্নিত করা functional dependencies বোঝার জন্য গুরুত্বপূর্ণ।

5. Normalization: Normalization করার সময় functional dependencies চিহ্নিত করা হয়। এটি ডাটাবেসের  Redundancy কমাতে এবং Data Integrity নিশ্চিত করতে সাহায্য করে।

### What is trivial vs non-trivial functional dependency?
#### Trivial Functional Dependency:
- এটা খুব সহজ আর স্বাভাবিক সম্পর্ক। যখন একটা কলাম (Y) ইতিমধ্যেই আরেকটা কলাম সেট (X) এর অংশ হয়, তখন এটাকে trivial বলে।
- উদাহরণ: (Student_ID, Student_Name) → Student_Name। এখানে Student_Name ইতিমধ্যে সেটের মধ্যে আছে, তাই এটা trivial
- এটা সবসময় সত্য, তাই ডাটাবেস ডিজাইনে খুব বেশি কাজে লাগে না।

#### Non-Trivial Functional Dependency:
- এটা এমন সম্পর্ক যেখানে Y, X এর অংশ নয়। অর্থাৎ, X থেকে Y এর মান বোঝা যায়, কিন্তু Y, X এর মধ্যে নেই।
- উদাহরণ: Student_ID → Student_Name। এখানে Student_Name, Student_ID এর সেটের অংশ নয়, তাই এটা non-trivial
- এটা ডাটাবেস ডিজাইনে গুরুত্বপূর্ণ, কারণ এটা attributes মধ্যে অর্থপূর্ণ সম্পর্ক দেখায়।

#### **পার্থক্য**:
- **Trivial**: স্বাভাবিক, সবসময় সত্য। যেমন: A, B → A।
- **Non-Trivial**: অর্থপূর্ণ সম্পর্ক, ডাটাবেস ডিজাইনের জন্য জরুরি। যেমন: Employee_ID → Department_Name।

এই ধারণাগুলো ডাটাবেস ভালোভাবে ডিজাইন করতে এবং Data Integrity বজায় রাখতে খুব গুরুত্বপূর্ণ।


