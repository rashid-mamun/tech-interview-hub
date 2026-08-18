---
sidebar_position: 3
title: Storage
---


## 11. What is the difference between object, block, and file storage?

**Object Storage:** এখানে data **object** হিসেবে store হয়, প্রতিটা object-এর একটা unique identifier (key), data নিজেই, এবং metadata থাকে। এটা একটা flat namespace-এ থাকে (traditional folder hierarchy নেই, যদিও logically prefix দিয়ে folder-এর মতো দেখানো যায়)। Access করা হয় সাধারণত **HTTP-based API** (REST API) দিয়ে, filesystem-এর মতো direct mount করে না। উদাহরণ: **AWS S3, Google Cloud Storage, Azure Blob Storage**।
- Highly scalable (petabyte-scale), durable, কিন্তু low-level file editing (partial update) করা যায় না — পুরো object আবার upload করতে হয়।
- Latency তুলনামূলক বেশি block storage-এর চেয়ে।

**Block Storage:** এখানে data ছোট ছোট fixed-size **block**-এ ভাগ করে store করা হয়, প্রতিটা block-এর নিজস্ব address থাকে। এটা raw storage volume হিসেবে কাজ করে যা কোনো server/VM-এর সাথে সরাসরি **attach/mount** করা হয়, ঠিক যেমন একটা physical hard drive। উদাহরণ: **AWS EBS, Google Persistent Disk, Azure Managed Disks**।
- Low latency, high performance (random read/write-এ ভালো)।
- OS নিজে filesystem (ext4, NTFS) format করে ব্যবহার করে।
- সাধারণত একটা volume একসাথে একটা instance-এর সাথেই attach থাকে (multi-attach সীমিত ক্ষেত্রে সম্ভব)।

**File Storage:** এখানে data traditional **hierarchical file system** (folder/subfolder structure) হিসেবে organize করা হয়, এবং **network protocol** (NFS, SMB) দিয়ে multiple client/server থেকে **simultaneously access** করা যায়। উদাহরণ: **AWS EFS, Azure Files, Google Filestore, NAS**।
- Shared access সহজ — একাধিক instance একই filesystem mount করে read/write করতে পারে।
- Object storage-এর তুলনায় কম scalable, কিন্তু block storage-এর তুলনায় শেয়ারিং সহজ।

### When would you use each (images/videos vs. DB disks vs. shared filesystem)?

- **Images/Videos (unstructured media, static assets, backups):** → **Object Storage** ব্যবহার করা উচিত। কারণ এগুলো সাধারণত write-once-read-many, huge scale-এ store করতে হয়, এবং HTTP দিয়ে সরাসরি serve করা যায় (যেমন website-এর image, video streaming, log archive, static website hosting, data lake)।

- **Database disks (transactional data, low-latency I/O):** → **Block Storage** ব্যবহার করা উচিত। কারণ database-এর জন্য দরকার high IOPS, low latency, এবং consistent random read/write performance, যা block storage দেয়। (যেমন MySQL/PostgreSQL-এর data directory একটা EBS volume-এ থাকে)।

- **Shared filesystem (একাধিক server থেকে একইসাথে access দরকার):** → **File Storage** ব্যবহার করা উচিত। যেমন multiple web server-এর মধ্যে shared configuration file/content, content management system (CMS) upload folder, বা HPC (High-Performance Computing) cluster-এ shared dataset — যেখানে একাধিক compute node-কে একই file-এ একসাথে access করতে হয়।

---
## 12. What are storage tiers/classes (hot, cool, cold, archive)?

Cloud provider-রা data-এর **access frequency** অনুযায়ী বিভিন্ন storage tier/class অফার করে, যাতে cost optimize করা যায়:

- **Hot tier:** যে data **frequently access** হয়, তার জন্য। Storage cost বেশি, কিন্তু retrieval cost কম এবং access latency সবচেয়ে কম। উদাহরণ: active application data, frequently viewed content। (যেমন S3 Standard)

- **Cool tier:** যে data **কম frequently access** হয় (মাস-এ একবার-দুবার), কিন্তু হঠাৎ দরকার হলে দ্রুত পাওয়া দরকার। Storage cost hot-এর চেয়ে কম, কিন্তু retrieval cost এবং minimum storage duration commitment থাকে। উদাহরণ: monthly report, infrequently accessed backup। (যেমন S3 Standard-IA, Azure Cool Blob)

- **Cold tier:** আরও কম frequently accessed data-এর জন্য, longer retrieval time acceptable। Storage cost আরও কম, কিন্তু retrieval-এ কিছুটা delay (মিনিট থেকে ঘণ্টা) হতে পারে। উদাহরণ: compliance data, older logs।

- **Archive tier:** যে data **খুবই কদাচিৎ access** হয় (বছরে একবার বা তারও কম), মূলত long-term retention/compliance-এর জন্য রাখা হয়। Storage cost সবচেয়ে কম, কিন্তু retrieval time সবচেয়ে বেশি (ঘণ্টা থেকে এমনকি দিন পর্যন্ত লাগতে পারে) এবং retrieval cost বেশি। উদাহরণ: legal/regulatory archive, disaster recovery backup যা কখনো access হয় না। (যেমন S3 Glacier Deep Archive, Azure Archive Storage)

**সাধারণ trade-off:** Storage cost যত কমে, retrieval cost ও latency তত বাড়ে। তাই সঠিক tier বাছাই করা data-এর access pattern-এর উপর নির্ভর করে।

### How do lifecycle policies reduce cost?

**Lifecycle policy** হলো একটা automated rule-set যা নির্দিষ্ট শর্তের (যেমন age, last access time) ভিত্তিতে data-কে automatically এক tier থেকে অন্য tier-এ **transition** করে, অথবা expired data **delete** করে দেয় — কোনো manual intervention ছাড়াই।

কীভাবে cost কমায়:

- **Automatic tiering:** Data-এর access pattern সময়ের সাথে সাধারণত পরিবর্তিত হয় — নতুন data frequently access হয়, কিন্তু পুরনো হলে access কমে যায়। Lifecycle policy দিয়ে rule সেট করা যায় যেমন: "৩০ দিন পর Standard থেকে Standard-IA-তে move করো, ৯০ দিন পর Glacier-এ move করো, ৭ বছর পর delete করো।" এতে manual ভাবে monitor বা migrate করার দরকার হয় না, এবং data সবসময় সবচেয়ে cost-effective tier-এ থাকে।

- **Unnecessary data মুছে ফেলা:** পুরনো log file, temporary data, বা expired backup automatically delete হয়ে যায়, ফলে unnecessary storage cost বহন করতে হয় না।

- **Incomplete multipart upload cleanup:** Object storage-এ (যেমন S3) কোনো multipart upload যদি অসম্পূর্ণ থেকে যায়, সেটাও storage space নেয় এবং cost যোগ করে — lifecycle policy দিয়ে এগুলো automatically clean up করা যায়।

- **Human error কমায়:** Manual tier management-এ ভুল হওয়ার সম্ভাবনা থাকে (যেমন কেউ ভুলে যেতে পারে পুরনো data move করতে), lifecycle policy সেই ঝুঁকি দূর করে এবং consistent cost optimization নিশ্চিত করে।

- **Compliance-friendly cost saving:** যে data আইনগতভাবে রাখতে হয় কিন্তু কখনো access হয় না, সেটা automatically সবচেয়ে সস্তা archive tier-এ চলে যায়, যা দীর্ঘমেয়াদে বিশাল cost saving নিয়ে আসে বিশেষত বড় ডেটাসেটের ক্ষেত্রে।

## 13. What is storage replication (same-region vs. cross-region, sync vs. async)?

**Storage Replication** হলো data-এর একাধিক copy বিভিন্ন location-এ automatically maintain করার প্রক্রিয়া, যাতে data loss prevent করা যায় এবং availability/durability বাড়ানো যায়।

**Same-Region Replication:** একই geographic region-এর মধ্যে different **Availability Zone (AZ)**-এ data copy রাখা হয়। এটা মূলত single data center failure বা hardware failure থেকে protect করে। Latency কম, কারণ physical distance কম।

**Cross-Region Replication:** সম্পূর্ণ ভিন্ন geographic region-এ data copy রাখা হয় (যেমন US থেকে Europe)। এটা **disaster recovery (DR)** এবং region-wide outage (যেমন natural disaster, regional cloud provider issue) থেকে protect করে, এবং সাথে **data locality/compliance** (data residency law) পূরণেও সাহায্য করে। কিন্তু network distance বেশি হওয়ায় latency বেশি হয়।

**Synchronous (Sync) Replication:** এখানে data primary location-এ write হওয়ার সাথে সাথে replica location-এও write সম্পন্ন হতে হয়, এবং **acknowledgment (ack)** দুই জায়গা থেকেই confirm হওয়ার পরই write operation "successful" ধরা হয়। এতে **zero data loss (RPO = 0)** নিশ্চিত হয়, কিন্তু write latency বেশি হয় কারণ সব replica-র response-এর জন্য অপেক্ষা করতে হয়।

**Asynchronous (Async) Replication:** এখানে primary location-এ write হওয়ার সাথে সাথেই ack পাঠানো হয়, replica-তে data পরে (কিছুটা delay নিয়ে) sync হয়। Write latency কম হয় (fast response), কিন্তু primary যদি হঠাৎ fail করে replication complete হওয়ার আগে, তাহলে কিছু data loss (non-zero RPO) হতে পারে।

### What trade-off exists between sync and async replication?

| বিষয় | Sync Replication | Async Replication |
|---|---|---|
| **Data consistency/loss** | Zero data loss (RPO = 0) | সামান্য data loss হতে পারে |
| **Write latency** | বেশি (সব replica-র জন্য wait) | কম (primary ack দিলেই done) |
| **Distance suitability** | কাছাকাছি location (same-region/AZ) | দূরবর্তী location (cross-region)-এর জন্য উপযুক্ত |
| **Performance impact** | Application performance-এ প্রভাব ফেলতে পারে | Performance ভালো থাকে |
| **Use case** | Critical transactional data (financial system) | DR, backup, geographically distributed read replicas |

মূলত এটা একটা classic trade-off: **consistency/durability vs. performance/latency**। Sync replication data safety নিশ্চিত করে কিন্তু speed sacrifice করে, আর async replication speed দেয় কিন্তু সামান্য data loss-এর ঝুঁকি নেয়।

---

## 14. What is a signed/pre-signed URL, and why is it used?

**Pre-signed URL** হলো একটা temporary, cryptographically signed URL যা একটি **private/protected resource** (যেমন object storage-এর কোনো file)-কে নির্দিষ্ট সময়ের জন্য, নির্দিষ্ট permission সহ, credential ছাড়াই access করার অনুমতি দেয়। URL-টা generate করা হয় owner-এর credential/secret key দিয়ে sign করে, এবং সেই signature-এই embedded থাকে expiry time ও permission।

এটা ব্যবহার করা হয় কারণ:

- **Secure temporary access দেওয়া যায়:** পুরো bucket/storage public না করে, শুধু নির্দিষ্ট object-এ, নির্দিষ্ট সময়ের জন্য access দেওয়া যায় — credential (access key/secret) client-এর সাথে share না করেই।
- **Direct upload/download সম্ভব:** Client (যেমন browser, mobile app) সরাসরি cloud storage-এ file upload/download করতে পারে, কোনো intermediate backend server-এর মধ্য দিয়ে data route না করেই — এতে backend-এর load কমে এবং transfer দ্রুত হয়।
- **Third-party sharing:** কোনো file অন্য কারো সাথে shortly-এর জন্য share করা দরকার হলে (যেমন invoice download link), permanent public access না দিয়ে একটা time-limited link দেওয়া যায়।

###  How do you control its expiry and permissions safely?

- **Short expiry window রাখা:** যতটা সম্ভব কম সময়ের জন্য URL valid রাখা (যেমন কয়েক মিনিট থেকে কয়েক ঘণ্টা), যাতে URL leak হলেও ঝুঁকি সীমিত থাকে। Use case অনুযায়ী duration set করা — যেমন file upload-এর জন্য কয়েক মিনিট, download link share করার জন্য হয়তো কিছু ঘণ্টা।
- **Least privilege principle:** URL-টাকে শুধু নির্দিষ্ট action-এর (GET/PUT/DELETE) জন্যই generate করা, প্রয়োজনের বেশি permission না দেওয়া। যেমন download-এর জন্য শুধু read (GET) permission, লেখার (PUT) দরকার না থাকলে সেটা বাদ দেওয়া।
- **Specific resource-এ scope করা:** পুরো bucket-এর বদলে একটা নির্দিষ্ট object/key-এর জন্য URL generate করা, যাতে unintended resource exposed না হয়।
- **IAM policy/condition দিয়ে restrict করা:** IP address restriction, referrer check, বা specific condition (যেমন file size limit) যোগ করা যায় extra security layer হিসেবে।
- **HTTPS ব্যবহার করা:** URL এবং তার মধ্যে থাকা signature transit-এ intercept না হয় তা নিশ্চিত করতে সবসময় HTTPS ব্যবহার করা।
- **Monitoring/logging:** Access log রাখা যাতে কোনো misuse হলে সেটা detect করা যায়, এবং প্রয়োজনে key rotate করা যায়।
- **One-time use বা revocation ability বিবেচনা করা:** কিছু ক্ষেত্রে critical resource-এর জন্য URL একবার ব্যবহারের পর invalid করে দেওয়ার mechanism (application logic-এ) রাখা ভালো।

---

## 15. What is data durability, and how is it different from availability?

**Durability** বোঝায় data সময়ের সাথে **loss/corruption ছাড়া টিকে থাকার সম্ভাবনা** — অর্থাৎ একবার data store করার পর, সেটা কতটা নিশ্চিতভাবে অক্ষত (intact) থাকবে, হার্ডওয়্যার failure, bit rot, বা অন্য কোনো corruption সত্ত্বেও। এটা সাধারণত percentage-এ প্রকাশ করা হয় (যেমন AWS S3-এর famous "**99.999999999% (11 nines) durability**"), যা বোঝায় কোটি কোটি object store করলেও practically কোনোটাই হারানোর সম্ভাবনা নেই। Durability achieve করা হয় সাধারণত **data replication** (একাধিক copy, একাধিক device/location-এ) এবং **error-checking/checksum** mechanism দিয়ে।

**Availability** বোঝায় system/data একটা নির্দিষ্ট সময়ে **accessible/usable থাকার সম্ভাবনা** — অর্থাৎ যখন আপনি data access করতে চান, তখন সেটা successfully পাওয়া যাবে কিনা। এটাও percentage-এ প্রকাশ করা হয় (যেমন "99.9% uptime" = বছরে প্রায় ৮.৭৬ ঘণ্টা downtime acceptable)। Availability নির্ভর করে system-এর uptime, network connectivity, এবং service-এর operational health-এর উপর।

**মূল পার্থক্য:**
| বিষয় | Durability | Availability |
|---|---|---|
| কী measure করে | Data হারিয়ে যাবে কিনা (data loss risk) | Data এখনই access করা যাবে কিনা |
| Focus | দীর্ঘমেয়াদী data integrity | তাৎক্ষণিক accessibility |
| উদাহরণ metric | 99.999999999% (11 nines) | 99.9% - 99.99% uptime |

### Can a storage system be highly durable but not highly available?

**হ্যাঁ, অবশ্যই সম্ভব।** এই দুইটা সম্পূর্ণ আলাদা concept, একটা অন্যটাকে guarantee করে না।

উদাহরণস্বরূপ: **AWS S3 Glacier / Archive storage** — এটা অত্যন্ত highly durable (11 nines durability, কারণ data একাধিক device-এ, একাধিক facility-তে replicate করা থাকে এবং প্রায় কখনো হারায় না)। কিন্তু এটা highly available না, কারণ data retrieve করতে ঘণ্টার পর ঘণ্টা (এমনকি কিছু ক্ষেত্রে ১২ ঘণ্টা পর্যন্ত) সময় লাগতে পারে, এবং সেই সময়ে system তাৎক্ষণিকভাবে data access দিতে পারে না।

আরেকটা উদাহরণ: ধরুন কোনো system-এর data তিনটা physical location-এ durable ভাবে replicate করা আছে (data কখনো হারাবে না), কিন্তু সেই system-এর সামনের **access layer/API endpoint** যদি maintenance-এর জন্য বা network issue-এর কারণে সাময়িকভাবে down থাকে, তাহলে data নিরাপদে (durably) থাকা সত্ত্বেও এই মুহূর্তে সেটা **access (available)** করা যাচ্ছে না।

সংক্ষেপে: **Durability = data হারাবে না**, **Availability = data এখন পাওয়া যাবে**। একটা system data হারানো থেকে perfectly protect করতে পারে, অথচ সেই data-তে instant access দেওয়ার ক্ষেত্রে ব্যর্থ হতে পারে — এই দুই বৈশিষ্ট্য independent, এবং trade-off ও ডিজাইন choice-এর উপর নির্ভর করে সিস্টেম কোনটাকে কতটা priority দেবে।
