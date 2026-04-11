---
sidebar_position: 1
title: ''
---


## 56. How do you design a distributed file storage system?

**Distributed File System:** একাধিক machine জুড়ে ফাইল সংরক্ষণ করে, client কে একটি unified interface দেয়।

### How does Google File System (GFS) or HDFS work?
**GFS / HDFS Architecture:**
```
Master Node (NameNode):
  - File metadata রাখে (file→chunk mapping)
  - Chunk server location track করে
  
Chunk Servers (DataNodes):
  - Actual data রাখে
  - 64MB/128MB chunk এ বিভক্ত
  - প্রতিটি chunk ৩ বার replication
```

**Client read flow:**
1. Client Master কে জিজ্ঞেস করে: "file.txt কোথায়?"
2. Master chunk location list দেয়।
3. Client সরাসরি Chunk Server থেকে data পড়ে।

### What is erasure coding vs replication for data durability?
| বৈশিষ্ট্য | Replication | Erasure Coding |
|---|---|---|
| **কীভাবে** | n copy রাখা (3x replication = 200% overhead) | Data + parity ভাগ করা |
| **Storage Overhead** | বেশি | কম (যেমন 1.5x) |
| **Performance** | Fast read/write | Decode করতে CPU লাগে |
| **উদাহরণ** | HDFS 3x replication | AWS S3, Azure Blob |

- **Erasure coding (RS Codes):** ডাটাকে k fragment, m parity fragment এ ভাগ — যেকোনো m fail হলেও recover।

### How do you handle file chunking and metadata management?
- **Chunking:** বড় ফাইল chunk এ ভাগ — প্রতিটি parallel upload/download সম্ভব।
- **Metadata:** Master node এ in-memory রাখুন — fast lookup। Persistent log এ লিখুন।
- **Namespace:** Directory tree structure maintain করুন।

---

## 57. What is object storage and how does it differ from block storage?

| বৈশিষ্ট্য | Object Storage (S3) | Block Storage (EBS) | File Storage (EFS) |
|---|---|---|---|
| **Unit** | Objects (file + metadata) | Fixed-size blocks | Files/directories |
| **Access** | HTTP API (GET, PUT) | Mount as disk | Mount as filesystem |
| **Use case** | Static files, backup, media | Database (OS disk) | Shared filesystem |
| **Scale** | প্রায় unlimited | Limited (to instance) | Scalable |
| **Latency** | Higher (HTTP overhead) | Low | Medium |

### When would you use object storage over a relational database?
- **Object storage:** Large binary files — images, video, audio, documents।
- **Database:** Structured data, complex queries, transactions।
- **Pattern:** Database তে file path store করুন, actual file S3 তে।

### How does Amazon S3 achieve durability?
- S3 standard: **99.999999999% (11 nines) durability**।
- একটি region এ ন্যূনতম ৩টি Availability Zone এ data replicate।
- Automatic checksum verification — silent corruption detect করে।
- Lifecycle policies — তে automatically archive (Glacier) বা delete।

---

## 58. How do you design a blob storage system like S3?

### What data structures are used to store and retrieve blobs efficiently?
- **Object ID → Storage Location mapping:** Consistent hashing বা distributed hash table।
- **Metadata store:** NoSQL বা relational DB (filename, size, checksum, owner)।
- **Content-based addressing:** File content hash = Object key (deduplication automatic)।

```
Upload: hash(content) → key
Store: key → [server_id, offset, length]
Retrieve: key → server_id → read data
```

### How do you handle large file uploads (multipart upload)?
```
Large File Upload (যেমন 10GB video):
1. Initiate multipart upload → upload_id পাওয়া
2. File কে chunk এ ভাগ (5MB-5GB each)
3. প্রতিটি chunk independently upload করুন (parallel)
4. সব chunk upload এর পরে complete করুন
5. Server chunk গুলো একত্রিত করে final file তৈরি করে
```
- **সুবিধা:** Network failure এ শুধু failed chunk retry, parallel upload — fast।

### How do you implement access control for stored objects?
- **Bucket Policies:** Resource-level policy — "এই bucket এ শুধু authenticated user পড়তে পারবে।"
- **IAM Roles/Policies:** User/service level — "এই service শুধু এই bucket এ read করবে।"
- **Pre-signed URLs:** Temporary URL তৈরি — ১ ঘণ্টার জন্য একটি specific object এর link share করা।
- **ACL (Access Control List):** Object-level — specific user কে share।

---

## 59. What is a columnar storage format and when is it used?

**Row-oriented:** Traditional table — প্রতিটি row একসাথে store। OLTP।
**Column-oriented:** প্রতিটি column আলাদাভাবে store। OLAP, analytics।

### What is the difference between row-oriented and column-oriented storage?
```
Row-oriented:
| id | name    | age | salary |
| 1  | "Alice" | 30  | 50000  |  ← একসাথে disk এ
| 2  | "Bob"   | 25  | 45000  |

Column-oriented:
id:     [1, 2, 3, 4, 5...]
name:   ["Alice", "Bob", ...]  ← আলাদা disk block
age:    [30, 25, 28, ...]
salary: [50000, 45000, ...]
```

### When does columnar storage (Parquet, ORC) outperform row storage?
- **Analytics query:** `SELECT AVG(salary) FROM employees WHERE department='Engineering'`
  - Row: সব row পড়তে হয়, বেশিরভাগ column ignore করা হয়।
  - Column: শুধু `salary` এবং `department` column পড়লেই হয়।
- **Parquet/ORC:** Columnar format + compression — Big Data এর standard।

### How does columnar storage improve compression?
- একই column এর data similar type এবং similar range — compression ratio অনেক ভালো।
- **Run-length encoding:** `[0,0,0,0,1,1,1]` → `[(0,4),(1,3)]`।
- **Dictionary encoding:** Repeated strings একবার store, index রাখো।
- Column compressed হলে I/O কম — query আরও দ্রুত।

---

## 60. How do you handle data replication for durability?

### What is the replication factor and how do you choose it?
- **Replication Factor:** কতটি copy রাখবেন।
- **RF=1:** কোন durability নেই।
- **RF=3:** সাধারণত sufficient — একটি node fail হলেও data নিরাপদ।
- **RF=5:** আরও critical data, quorum read/write এনাবল।
- **Cost vs Risk:** RF বাড়ালে storage cost বাড়ে, failure tolerance বাড়ে।

### What is quorum-based replication?
- **Write quorum (W):** কতটি node তে লিখলে success।
- **Read quorum (R):** কতটি node থেকে পড়লে consistent।
- **N = Total replicas.**
- **Rule: W + R > N → Strong consistency।**

```
N=3, W=2, R=2: Write 2 নোডে হলে success
                Read 2 নোড থেকে পড়লে latest পাবো
                কারণ W+R=4 > N=3
```

### How does Cassandra handle replication across data centers?
- **Network Topology Strategy:** প্রতিটি data center এ replica count আলাদাভাবে specify।
- **LOCAL_QUORUM:** Quorum শুধু local data center এ — cross-DC latency এড়াানো।
- **EACH_QUORUM:** প্রতিটি DC তে quorum — very strong but slow।

```yaml
# Cassandra replication
CREATE KEYSPACE my_app WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'us-east': 3,
    'eu-west': 2
};
```
