---
sidebar_position: 1
title: 'Scalability'
---


## 6. What is scalability and why does it matter in system design?

**Scalability (স্কেলেবিলিটি)** হলো একটি সিস্টেমের ক্ষমতা যা বাড়তি লোড বা ট্রাফিক সামলাতে পারে — পারফরম্যান্স না কমিয়ে।

- ধরুন, আপনার অ্যাপ এখন ১,০০০ ইউজার সামলাচ্ছে। হঠাৎ ১০ লাখ ইউজার এলে কি অ্যাপ ক্র্যাশ করবে? যদি না করে তাহলে সিস্টেমটি স্কেলেবল।
- **স্কেলেবিলিটি এত গুরুত্বপূর্ণ কেন?** কারণ ব্যবসা বাড়ে, ইউজার বাড়ে। শুরু থেকেই ভালো আর্কিটেকচার না করলে পরে সব ভেঙে নতুন করে বানাতে হয়।

### What is the difference between horizontal scaling and vertical scaling?
| বৈশিষ্ট্য | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
|---|---|---|
| **পদ্ধতি** | এক সার্ভারে বেশি RAM/CPU/SSD যোগ করা | সার্ভারের সংখ্যা বাড়ানো |
| **উপমা** | একজন কর্মীকে আরও শক্তিশালী করা | আরও কর্মী নিয়োগ করা |
| **সীমাবদ্ধতা** | একটি সার্ভারের সর্বোচ্চ সীমা আছে | তাত্ত্বিকভাবে সীমাহীন |
| **খরচ** | শুরুতে সস্তা, পরে অনেক ব্যয়বহুল | Commodity hardware ব্যবহার করে কম খরচে |
| **Downtime** | আপগ্রেডের সময় সার্ভার বন্ধ রাখতে হয় | নতুন সার্ভার যোগ করলে ডাউনটাইম নেই |

### What is the ceiling of vertical scaling?
- বর্তমানে পাওয়া সবচেয়ে বড় AWS instance (যেমন `u-24tb1.metal`) তে ২৪ TB RAM দেওয়া সম্ভব।
- কিন্তু এই ধরনের মেশিন অবিশ্বাস্য রকম ব্যয়বহুল এবং এটি নিজেই Single Point of Failure।
- যখন ওই সীমায় পৌঁছে যাবেন, তখন আর উপায় নেই — Horizontal scaling করতেই হবে।

### What does it mean for a system to scale linearly?
- **Linear Scaling:** দ্বিগুণ সার্ভার মানে দ্বিগুণ পারফরম্যান্স। বাস্তবে এটা সবসময় হয় না।
- যদি ডাটাবেস bottleneck হয়, বা সার্ভারগুলোর মধ্যে কোঅর্ডিনেশনের জন্য overhead বাড়ে, তাহলে Linear scaling পাওয়া যায় না।

---

## 7. What is horizontal vs vertical scaling and when do you use each?

### What are the cost implications of horizontal vs vertical scaling?
- **Vertical:** শুরুতে সহজ এবং কম কোড পরিবর্তন, কিন্তু high-end hardware অনেক দামি।
- **Horizontal:** Commodity servers সস্তা কিন্তু distributed system জটিল — load balancer, session management, distributed caching সব দরকার।
- **সিদ্ধান্ত:** Startup শুরুতে Vertical করুন (simple), ট্রাফিক বাড়লে Horizontal migrate করুন।

### Which cloud services support automatic horizontal scaling?
- **AWS:** EC2 Auto Scaling Groups, ECS, EKS।
- **GCP:** Managed Instance Groups, GKE Autopilot।
- **Azure:** Virtual Machine Scale Sets, AKS।
- **Kubernetes:** Horizontal Pod Autoscaler (HPA) — সবচেয়ে জনপ্রিয় কন্টেইনার স্কেলিং।

### When does horizontal scaling introduce complexity that vertical scaling avoids?
- **Session Management:** HTTP stateless, তাই session data কোথায় রাখবেন? (Redis ব্যবহার করুন)।
- **Data Consistency:** একাধিক সার্ভারে একই ডাটা থাকলে কোনটা latest?
- **Networking Overhead:** সার্ভারের মধ্যে যোগাযোগে latency বাড়ে।
- **Distributed Transactions:** একাধিক সার্ভারে atomic operation কঠিন।

---

## 8. What is database sharding and how does it help with scalability?

**Database Sharding (ডাটাবেস শার্ডিং)** হলো একটি বড় ডাটাবেসকে ছোট ছোট অংশ (Shard) এ ভাগ করে ভিন্ন ভিন্ন সার্ভারে রাখা।

- ধরুন, ইউজার টেবিলে ১ বিলিয়ন রো। একটি সার্ভারে এত ডাটা সামলানো কঠিন। তাই User ID 1-250M → Shard 1, 250M-500M → Shard 2 এভাবে ভাগ করা হয়।

### What are the different sharding strategies?
| কৌশল | কীভাবে কাজ করে | ব্যবহার |
|---|---|---|
| **Range-based** | মান অনুযায়ী বিভাজন (যেমন A-M, N-Z) | তারিখ বা ID range এর জন্য |
| **Hash-based** | Key হ্যাশ করে সার্ভার নির্ধারণ | সমান বিতরণের জন্য |
| **Directory-based** | একটি lookup table থেকে সার্ভার খোঁজা | Flexible কিন্তু lookup overhead আছে |

### What is a hot shard problem and how do you solve it?
- **Hot Shard:** যখন এক বা দুটি shard এ অস্বাভাবিক বেশি ট্রাফিক — বাকিগুলো প্রায় ফাঁকা।
- **কেন হয়?** Range-based sharding এ কিছু range বেশি active হতে পারে। বা Hash ভালো না হলে।
- **সমাধান:**
  - Consistent hashing ব্যবহার করুন।
  - Hot shard কে আবার দুটি ভাগে বিভক্ত করুন (re-shard)।
  - Hot data গুলো cache করুন।

### How do you handle cross-shard queries?
- Cross-shard query (যেমন সব ইউজারের বয়সের গড়) যতটা সম্ভব এড়িয়ে চলুন।
- যদি দরকার হয়: Application layer এ প্রতিটি shard এ আলাদাভাবে কোয়েরি চালিয়ে ফলাফল merge করুন।
- বিকল্পভাবে: একটি আলাদা Analytics/OLAP সিস্টেমে সব ডাটা একত্রিত করুন।

### What happens when you need to re-shard a database?
- Re-sharding (ডাটা নতুনভাবে ভাগ করা) অনেক কঠিন এবং risky।
- পদ্ধতি: নতুন shard তৈরি করুন → ডাটা migrate করুন → traffic ধীরে ধীরে সরান → পুরনো shard মুছুন।
- **Consistent hashing** ব্যবহার করলে re-sharding এর সময় কম ডাটা সরাতে হয়।

---

## 9. How do you scale a relational database?

Relational database (যেমন PostgreSQL, MySQL) শুরুতে দারুন, কিন্তু ট্রাফিক বাড়লে চ্যালেঞ্জ আসে।

### What is a read replica and how does it offload read traffic?
- **Read Replica:** Primary database এর একটি কপি, যা শুধু read করার জন্য।
- Primary DB → সব write operation পায়।
- Read Replica → read query পায় (যেমন রিপোর্ট, সার্চ)।
- বেশিরভাগ অ্যাপ read-heavy (80-90% read), তাই replica বানালে Primary এর লোড অনেক কমে।

```
Architecture:
Client → Load Balancer → [Write: Primary DB]
                       → [Read: Replica 1, Replica 2, Replica 3]
```

### What is connection pooling and why is it important at scale?
- প্রতিটি DB connection তৈরি করা সময়সাপেক্ষ এবং resource-intensive।
- **Connection Pool:** আগে থেকেই কিছু সংখ্যক connection তৈরি করে রাখা এবং রিকোয়েস্ট এলে সেগুলো পুনরায় ব্যবহার করা।
- **PgBouncer** (PostgreSQL), **HikariCP** (Java) জনপ্রিয় connection pool।
- ছাড়া: ১০,০০০ concurrent user → ১০,০০০ DB connection → DB crash।

### When should you move from a relational database to a NoSQL database for scale?
| Relational রাখুন | NoSQL এ যান |
|---|---|
| Complex joins দরকার | Schema খুব ঘন ঘন বদলায় |
| ACID compliance বাধ্যতামূলক | অনেক বেশি horizontal scale দরকার |
| ডাটা স্ট্রাকচার্ড | Unstructured বা semi-structured data |
| Team SQL ভালো জানে | Write throughput অনেক বেশি |

---

## 10. What is the role of a load balancer in a scalable system?

**Load Balancer** হলো এমন একটি সিস্টেম যা ইনকামিং ট্রাফিককে একাধিক সার্ভারে সমানভাবে বিতরণ করে।

```
Client Request → Load Balancer → Server 1
                              → Server 2
                              → Server 3
```

- কোনো একটি সার্ভার ডাউন হলেও সার্ভিস চালু থাকে (High Availability)।
- হেলথ চেক করে — অস্বাস্থ্যকর সার্ভারে ট্রাফিক পাঠায় না।

### What load balancing algorithms exist?
| অ্যালগরিদম | কীভাবে কাজ করে | উপযুক্ত যখন |
|---|---|---|
| **Round Robin** | একের পর এক সার্ভারে পাঠায় | সব সার্ভার সমান ক্ষমতার হলে |
| **Least Connections** | যে সার্ভারে সবচেয়ে কম connection সেখানে পাঠায় | Request duration variable হলে |
| **Consistent Hashing** | User IP বা session হ্যাশ করে নির্দিষ্ট সার্ভারে পাঠায় | Session cache বা Sticky session দরকার হলে |
| **Weighted Round Robin** | বড় সার্ভারে বেশি ট্রাফিক দেয় | Heterogeneous server pool |

### What is the difference between a hardware load balancer and a software load balancer?
- **Hardware:** F5, Citrix NetScaler — অনেক দামি কিন্তু অত্যন্ত পারফরম্যান্ট।
- **Software:** Nginx, HAProxy, AWS ALB — সস্তা, flexible, cloud-native।

### How do you ensure the load balancer itself doesn't become a single point of failure?
- **Active-Passive:** একটি primary LB, আরেকটি standby। Primary ডাউন হলে Standby নেয়।
- **Active-Active:** দুটি LB একসাথে কাজ করে, DNS round-robin এর মাধ্যমে।
- **Anycast DNS:** যেমন Cloudflare, একটি IP এর কাছে অনেক datacenter থাকে।

---

## 11. What is consistent hashing and where is it used?

**Consistent Hashing** হলো এমন একটি hashing পদ্ধতি যেখানে নোড যোগ বা বাদ দিলে খুব কম ডাটা স্থানান্তরিত হয়।

### সাধারণ hashing এর সমস্যা:
- `Server = hash(key) % N` — N সার্ভারের সংখ্যা।
- N পরিবর্তন হলে (১ সার্ভার বাড়লে বা কমলে) প্রায় সব key নতুন সার্ভারে যায়।
- Cache hit rate একদম শূন্য হয়ে যায়!

### Consistent Hashing কীভাবে কাজ করে?
- Key এবং Server উভয়কেই একটি circular ring (0 থেকে 360 ডিগ্রি) এ ম্যাপ করা হয়।
- একটি key তার পরের ক্লকওয়াইজ server এ যায়।
- নতুন সার্ভার যোগ হলে শুধু তার আগের সার্ভারের কিছু key move করতে হয়।

### How does consistent hashing minimize data redistribution when nodes are added or removed?
- সাধারণ hashing এ N পরিবর্তন হলে `k/N` হিসেবে সব ডেটাই সরে।
- Consistent hashing এ শুধুমাত্র `k/N` ডেটা সরে, যেখানে `k` = total keys এবং `N` = server count।

### What is a virtual node (vnode) in consistent hashing?
- এক সার্ভারকে রিং এ একাধিক জায়গায় (Virtual Node হিসেবে) রাখা হয়।
- সুবিধা: লোড আরও সমানভাবে বিতরণ হয়, বড় সার্ভারকে বেশি vnode দিয়ে বেশি ভার দেওয়া যায়।

### Which real-world systems use consistent hashing?
- **Amazon DynamoDB, Apache Cassandra:** Data partitioning।
- **Memcached, Redis Cluster:** Cache key distribution।
- **CDN:** User কে নিকটতম edge server এ রুট করা।

---

## 12. How do you design a system that can auto-scale?

**Auto-scaling** হলো ট্রাফিক বাড়লে স্বয়ংক্রিয়ভাবে সার্ভার বাড়ানো এবং কমলে ঘোষণা না দিয়ে কমানো।

### What metrics trigger auto-scaling?
- **CPU Utilization:** সবচেয়ে সাধারণ। CPU > 70% → নতুন instance।
- **Memory Usage:** RAM > 80% → scale out।
- **Request Queue Depth:** SQS queue তে বেশি message জমলে → scale out।
- **Custom Metrics:** Business metric (active users count) দিয়েও scale করা যায়।

### What is the difference between proactive scaling and reactive scaling?
| ধরন | কীভাবে কাজ করে | উদাহরণ |
|---|---|---|
| **Reactive Scaling** | Metric threshold পার হলে scale করে | CPU > 80% → scale out |
| **Proactive Scaling** | আগে থেকেই জানা যে কখন ট্রাফিক বাড়বে | প্রতি শুক্রবার রাতে scale out করো |

### What are the risks of auto-scaling too aggressively or too slowly?
- **Too Aggressively:** বেশি ঘন ঘন instance তৈরি/বন্ধ করলে extra cost এবং flapping (ওঠানামা) সমস্যা।
- **Too Slowly:** ট্রাফিক বাড়ার পরেও নতুন instance ready হতে দেরি হলে user এর কাছে error আসে।
- **সমাধান:** Cool-down period সেট করুন এবং minimum instance count এ একটু বেশি রাখুন।
