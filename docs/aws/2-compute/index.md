---
sidebar_position: 1
title: Compute
---

## 7. What is the difference between an EC2 instance and a container running on ECS/EKS?

- **EC2 Instance**: এটা একটা **সম্পূর্ণ virtual machine (VM)**—নিজস্ব OS, kernel, এবং resource আছে। প্রতিটা EC2 instance independent এবং heavyweight। এখানে একটা মাত্র application বা একাধিক application run করানো যায়, কিন্তু resource isolation OS-level-এ হয়।

- **Container (ECS/EKS)**: Container হলো **OS-level virtualization**—একটা host (EC2 instance বা Fargate) এর উপরে একাধিক container চলে, কিন্তু সবাই **একই OS kernel share করে**। প্রতিটা container নিজের মধ্যে শুধু application এবং তার dependencies package করে রাখে (lightweight, isolated process)।
  - **ECS (Elastic Container Service)**: AWS-এর নিজস্ব container orchestration service।
  - **EKS (Elastic Kubernetes Service)**: AWS-এ managed **Kubernetes**।

**মূল পার্থক্য**:

| বিষয় | EC2 Instance | Container (ECS/EKS) |
|---|---|---|
| Virtualization level | Hardware-level (Hypervisor) | OS-level (kernel shared) |
| Startup time | মিনিট (OS boot লাগে) | সেকেন্ড (কোনো OS boot লাগে না) |
| Resource overhead | বেশি (প্রতিটার নিজস্ব OS) | কম (kernel shared) |
| Density | কম application per host | অনেক container per host |
| Portability | কম (OS/environment-dependent) | বেশি (image যেকোনো জায়গায় চলে) |
| Isolation | Strong (full OS boundary) | Process-level isolation (তুলনামূলক কম strong) |

সহজভাবে: **EC2 = পুরো একটা বাড়ি**, **Container = একটা বাড়ির মধ্যে আলাদা আলাদা room**—রুমগুলো একই infrastructure (kernel) share করে কিন্তু independently কাজ করে।

---

### How do you choose an EC2 instance family/type (T, M, C, R series) based on CPU, memory, and network needs?

- **T series (Burstable)**: `t3`, `t4g` — Low, variable workload-এর জন্য (যেমন dev/test environment, small website)। Baseline CPU performance কম, কিন্তু "CPU credit" জমা করে মাঝেমধ্যে burst করতে পারে। **Cost-effective**, কিন্তু sustained high-CPU workload-এর জন্য উপযুক্ত না।

- **M series (General Purpose)**: `m5`, `m6i` — CPU এবং memory-এর **balanced ratio** (সাধারণত 1:4 vCPU:RAM)। বেশিরভাগ standard application (web server, small-medium database, application server)-এর জন্য default choice।

- **C series (Compute Optimized)**: `c5`, `c6i` — High **CPU-to-memory ratio**। যেসব workload compute-intensive কিন্তু memory কম লাগে—যেমন batch processing, video encoding, scientific modeling, high-performance web server, gaming server।

- **R series (Memory Optimized)**: `r5`, `r6i` — High **memory-to-CPU ratio**। In-memory database (Redis, SAP HANA), big data processing (Spark), memory-heavy caching layer-এর জন্য উপযুক্ত।

**Decision process**:
1. প্রথমে workload-এর nature বুঝুন (compute-heavy? memory-heavy? variable/bursty?)।
2. CPU utilization এবং memory utilization pattern পর্যবেক্ষণ করুন (CloudWatch দিয়ে)।
3. সেই অনুযায়ী family বেছে নিন, তারপর সেই family-র মধ্যে size (small থেকে large) নির্ধারণ করুন performance testing-এর মাধ্যমে।

---

### How do you decide between many small instances vs. fewer large ones for the same total capacity?

**অনেকগুলো ছোট instance-এর সুবিধা**:
- **Better fault tolerance**: একটা instance fail করলে total capacity-র শুধু ছোট একটা অংশ হারায় (যেমন 10টার মধ্যে 1টা গেলে 10% impact, কিন্তু 2টার মধ্যে 1টা গেলে 50% impact)।
- **Granular scaling**: Auto Scaling ছোট ছোট step-এ resource যোগ/বাদ দিতে পারে, ফলে **cost efficiency** বাড়ে (demand-এর সাথে খুব কাছাকাছি match করে)।
- **Better load distribution**: Multiple AZ-এ ছড়িয়ে দেওয়া সহজ হয়, availability বাড়ে।

**কম কিন্তু বড় instance-এর সুবিধা**:
- **Lower overhead**: প্রতিটা instance-এর কিছু fixed overhead থাকে (OS, agent, networking)। কম instance মানে কম overhead।
- **Simpler management**: কম instance manage করা, monitor করা, patch করা সহজ।
- **কিছু workload বড় instance ছাড়া চলে না**: যেমন in-memory database যেখানে পুরো dataset একটা instance-এর memory-তে থাকা দরকার (horizontally split করা কঠিন)।

**সাধারণ নিয়ম**: **Stateless, horizontally-scalable application** (web server, API layer)-এর জন্য বেশি ছোট instance ভালো (resilience এবং elasticity বাড়ায়)। **Stateful বা tightly-coupled workload** (single-node database, legacy monolith)-এর জন্য কম কিন্তু বড় instance প্রয়োজন হতে পারে।

---

## 8. What is the difference between EC2 Spot Instances, Reserved Instances, Savings Plans, and On-Demand?

- **On-Demand**: কোনো commitment ছাড়া, per-second/per-hour ভিত্তিতে pay করা। সবচেয়ে **flexible কিন্তু সবচেয়ে expensive**। Unpredictable, short-term workload-এর জন্য উপযুক্ত।

- **Reserved Instances (RI)**: 1 বা 3 বছরের জন্য একটা **নির্দিষ্ট instance type এবং region** commit করলে, On-Demand-এর তুলনায় বড় discount (up to ~৭৫%) পাওয়া যায়। কিন্তু flexibility কম—instance type/region change করলে সুবিধা পাওয়া যায় না (যদি না Convertible RI ব্যবহার করেন)।

- **Savings Plans**: RI-এর মতোই 1/3 বছরের commitment-এ discount দেয়, কিন্তু এটা **নির্দিষ্ট instance type-এর বদলে একটা নির্দিষ্ট ডলার/ঘণ্টা spending commit করা**। এটা অনেক বেশি flexible—instance family, size, region, এমনকি EC2 থেকে Lambda/Fargate-এও automatically apply হতে পারে।

- **Spot Instances**: AWS-এর unused capacity **সবচেয়ে সস্তা দামে** (up to ~৯০% discount) ব্যবহার করা, কিন্তু AWS-এর যখনই সেই capacity দরকার হয়, তখন **যেকোনো সময় interrupt/terminate** করে দিতে পারে। Fault-tolerant, flexible workload-এর জন্য উপযুক্ত।

---

### How should an application handle a Spot Instance interruption (2-minute warning, Spot Fleet, interruption handlers)?

- **2-minute warning**: AWS একটা instance terminate করার আগে **CloudWatch Event/EventBridge** এর মাধ্যমে ২ মিনিট আগে notification পাঠায়। Application-কে এই সময়ের মধ্যে **graceful shutdown** করতে হবে—in-progress task save করা, connection close করা, state persist করা (external storage যেমন S3/DynamoDB-এ)।

- **Spot Fleet/Auto Scaling with mixed instance types**: একটা মাত্র instance type-এর উপর নির্ভর না করে, **একাধিক instance type এবং AZ** জুড়ে Spot request diversify করা উচিত। এতে একটা instance pool interrupt হলেও অন্য pool থেকে capacity পাওয়া যায়—interruption risk কমে যায়।

- **Interruption handler**: EC2 Instance Metadata Service থেকে interruption notice **poll** করে (অথবা EventBridge rule সেট করে) automatically:
  - Load balancer থেকে instance-কে **deregister** করা (নতুন traffic আসা বন্ধ করা)।
  - Running task/job অন্য healthy instance-এ **migrate** করা।
  - Auto Scaling Group-কে নতুন replacement instance launch করতে বলা।

- **Best practice**: Stateless, checkpoint-based design ব্যবহার করা (যেমন batch job নিয়মিত progress save করবে), যাতে interruption হলেও কাজ থেকেই আবার শুরু করা যায়, একদম প্রথম থেকে না।

---

### What kind of workload is a bad fit for Spot Instances?

- **Stateful, single-instance critical application**: যেমন primary database server, যেটা interrupt হলে data loss বা downtime হতে পারে।
- **Long-running, non-checkpointed process**: যেমন ৮ ঘণ্টার একটা render job যেটা মাঝপথে বন্ধ হয়ে গেলে পুরোটা আবার শুরু করতে হবে (checkpoint না থাকলে)।
- **Latency-sensitive, always-on production service**: যেমন real-time payment processing system, যেখানে সামান্যতম unavailability-ও ব্যবসার জন্য ক্ষতিকর।
- **Workload যেখানে specific instance type/AZ বাধ্যতামূলক** এবং সেই pool-এ Spot capacity অস্থির/কম পাওয়া যায়।

Spot সবচেয়ে ভালো কাজ করে **fault-tolerant, distributed, interruption-resilient** workload-এ—যেমন batch processing, CI/CD build server, big data analysis (Hadoop/Spark), stateless web server (ASG-এর সাথে mixed instance policy)।

---

### What's the flexibility difference between a Savings Plan and a Reserved Instance?

| বিষয় | Reserved Instance (Standard) | Savings Plan |
|---|---|---|
| Commitment | নির্দিষ্ট instance type + region | নির্দিষ্ট $/hour spend |
| Instance family change | সম্ভব না (Convertible RI ছাড়া) | স্বাধীনভাবে যেকোনো family/size-এ apply হয় |
| Region flexibility | নির্দিষ্ট region-এ আবদ্ধ | Region flexible (Compute Savings Plan-এ) |
| Service coverage | শুধু EC2 (RDS/ElastiCache-এর জন্য আলাদা RI) | EC2, Fargate, Lambda—সবকিছুতে apply হতে পারে (Compute Savings Plan) |
| Discount rate | সাধারণত সামান্য বেশি (বিশেষত Standard RI) | কাছাকাছি, কিছুটা কম flexible discount |
| Resale | Standard RI **AWS Marketplace-এ বিক্রি করা যায়** যদি আর দরকার না হয় | বিক্রি করা যায় **না** |

**সংক্ষেপে**: Reserved Instance **discount বেশি কিন্তু rigid** (নির্দিষ্ট configuration-এ আবদ্ধ)। Savings Plan **সামান্য কম rigid, কিন্তু অনেক বেশি flexible**—architecture পরিবর্তন হলেও (EC2 থেকে Fargate/Lambda-তে migrate করলেও) commitment-এর সুবিধা হারাতে হয় না। তাই যেসব organization-এর architecture ভবিষ্যতে পরিবর্তন হতে পারে, তাদের জন্য Savings Plan সাধারণত বেশি recommended।

## 9. What is AWS Lambda, and how does it fit the serverless model?

**AWS Lambda** হলো একটা **Function as a Service (FaaS)** offering, যেখানে আপনি শুধু কোড (function) লেখেন, এবং কোনো নির্দিষ্ট **event** (যেমন API call, S3 file upload, DynamoDB update, scheduled cron) ঘটলে সেই function automatically **execute** হয়। এখানে server provision, patch, বা scale করার কোনো দরকার নেই—AWS পুরো infrastructure layer সম্পূর্ণভাবে manage করে।

এটা **serverless model**-এর সাথে perfectly fit করে কারণ:
- **No server management**: Developer শুধু business logic নিয়ে ভাবে, infrastructure নিয়ে না।
- **Automatic scaling**: প্রতিটা incoming request-এর জন্য AWS automatically নতুন function instance spin up করে (concurrent request হাজার হাজার হলেও)।
- **Pay-per-use**: Function idle থাকলে কোনো cost নেই—শুধু actual execution time-এর জন্য bill হয়।
- **Event-driven architecture**: Lambda সহজেই অন্য AWS service (S3, DynamoDB, SNS, SQS, API Gateway)-এর সাথে integrate হয়ে event-driven, decoupled system তৈরি করে।

---

### What is the Lambda cold start problem, and how do you reduce it (Provisioned Concurrency, smaller packages, SnapStart)?

**Cold start problem**: যখন একটা Lambda function অনেকক্ষণ ব্যবহার হয়নি (idle), এবং নতুন request আসে, তখন AWS-কে প্রথমে একটা নতুন **execution environment তৈরি করতে হয়**—runtime initialize করা, dependencies load করা, এবং function code load করা। এই পুরো প্রক্রিয়ায় কয়েকশ millisecond থেকে কয়েক সেকেন্ড পর্যন্ত **extra latency** যোগ হয়, যেটাকে "cold start" বলে। এরপর থেকে যতক্ষণ environment "warm" থাকে (idle না হয়), ততক্ষণ latency কম থাকে ("warm start")।

**কমানোর উপায়**:

- **Provisioned Concurrency**: আপনি আগে থেকেই একটা নির্দিষ্ট সংখ্যক execution environment **pre-warmed/ready** রাখতে বলতে পারেন, যাতে request আসলে সাথে সাথেই সেটা ব্যবহার হয়, cold start একদমই না হয়। এতে অতিরিক্ত cost লাগে (idle থাকলেও pay করতে হয়), কিন্তু latency-sensitive production workload-এ এটা জরুরি।

- **Smaller deployment package**: Function-এর code এবং dependency package যত ছোট হবে, initialization তত দ্রুত হবে। অপ্রয়োজনীয় library বাদ দেওয়া, Lambda Layer ব্যবহার করে shared dependency আলাদা রাখা—এসব cold start কমাতে সাহায্য করে।

- **SnapStart**: এটা মূলত Java-এর মতো runtime-এর জন্য (যেগুলোতে cold start সাধারণত বেশি হয়) AWS-এর একটা feature, যেখানে initialized execution environment-এর একটা **encrypted snapshot** নিয়ে রাখা হয় (memory এবং disk state সহ), এবং নতুন invocation আসলে সেই snapshot থেকে **resume** করা হয়—পুরো initialization প্রক্রিয়া নতুন করে না চালিয়ে। এতে cold start অনেকাংশে (কখনো ~90% পর্যন্ত) কমে যায়।

- অন্যান্য practice: runtime choice (lightweight runtime যেমন Node.js/Python সাধারণত Java/.NET-এর চেয়ে দ্রুত cold start হয়), VPC-তে unnecessary connection এড়ানো (VPC-attached Lambda-তে আগে extra latency হতো, যদিও এখন অনেক improve হয়েছে)।

---

### When should you avoid Lambda (long-running jobs beyond the 15-minute timeout, steady heavy compute)?

- **Long-running jobs**: Lambda-এর **maximum execution time 15 মিনিট**। এর চেয়ে বেশি সময় লাগে এমন কাজ (বড় video processing, বড় ETL job, ML model training) Lambda-তে করা যাবে না—এক্ষেত্রে **ECS/EKS (container)**, **EC2**, বা **AWS Batch** ব্যবহার করা উচিত।

- **Steady, predictable heavy compute**: যদি একটা workload **24/7 continuously high utilization**-এ চলে (যেমন সবসময় ব্যস্ত থাকা backend service), তাহলে Lambda-এর per-request pricing model actually **EC2/Reserved Instance-এর চেয়ে বেশি costly** হয়ে যায়। Lambda মূলত **intermittent, bursty, event-driven** workload-এর জন্য cost-effective, continuous heavy-load-এর জন্য না।

- **Stateful application**: যেখানে in-memory state বা persistent connection দরকার (যেমন WebSocket server যেটা দীর্ঘক্ষণ connection ধরে রাখে), Lambda-তে সেটা awkward, কারণ Lambda মূলত stateless, short-lived execution-এর জন্য design করা।

- **Predictable, low-latency-critical workload যেখানে cold start অগ্রহণযোগ্য**: যদিও Provisioned Concurrency দিয়ে mitigate করা যায়, কিন্তু তখন Lambda-এর মূল cost-benefit (pay only for use) অনেকটাই কমে যায়—এক্ষেত্রে EC2/ECS বিবেচনা করা ভালো।

---

### How does Lambda's pricing model (requests + duration + memory) change your design choices?


Lambda-এর cost তিনটা factor-এর উপর নির্ভর করে: **(1) number of requests**, **(2) execution duration**, এবং **(3) allocated memory** (এবং memory-এর সাথে proportionally CPU-ও বাড়ে)।

এটা design choice-কে যেভাবে প্রভাবিত করে:

- **Code optimization গুরুত্বপূর্ণ হয়ে ওঠে**: যেহেতু duration সরাসরি cost-এর সাথে যুক্ত, তাই function-কে দ্রুত execute করানো (efficient algorithm, unnecessary I/O কমানো, connection reuse করা) সরাসরি bill কমায়—EC2-তে এটা এতটা critical না, কারণ সেখানে instance চললেই একই cost।

- **Memory allocation-এ trade-off**: বেশি memory allocate করলে CPU-ও বেশি পাওয়া যায়, ফলে function দ্রুত শেষ হতে পারে—কখনো কখনো **বেশি memory দিলে total cost কমে যায়** (কারণ duration কমে), কম memory দিলে ধীরে চলে এবং duration বেশি হয়ে cost বেড়ে যায়। তাই সঠিক memory size টেস্ট করে বের করা জরুরি (AWS Lambda Power Tuning tool দিয়ে)।

- **Function granularity/decomposition**: অনেক ছোট, single-purpose function বানানো (microservice-style) না কি একটা বড় monolithic function—এই সিদ্ধান্তে cost একটা factor। অতিরিক্ত ছোট function বানালে request সংখ্যা বেড়ে যেতে পারে (chaining-এর কারণে), যেটা request-based cost বাড়ায়।

- **Batching**: যেখানে সম্ভব, একাধিক ছোট event একসাথে batch করে process করা (যেমন SQS থেকে batch of messages) individual invocation-এর সংখ্যা কমায়, ফলে request-based cost কমে।

- **Avoiding unnecessary external calls/waiting**: Function যদি external API call-এর জন্য **wait** করে (blocking call), তাহলে সেই wait time-ও duration-এর মধ্যে count হয় এবং cost বাড়ায়—তাই asynchronous pattern বা efficient timeout design গুরুত্বপূর্ণ।

---

## 10. What is edge computing on AWS (CloudFront, Lambda@Edge, CloudFront Functions), and why does it reduce latency?

**Edge computing** হলো compute/processing power-কে central data center-এর বদলে **user-এর ভৌগোলিকভাবে কাছাকাছি অবস্থিত location (edge location)**-এ নিয়ে আসা।

- **CloudFront**: AWS-এর **CDN (Content Delivery Network)**—এটা সারা পৃথিবীতে ছড়িয়ে থাকা শত শত **edge location**-এ content (static file, image, video) **cache** করে রাখে, যাতে user-কে সেই content সবচেয়ে কাছের location থেকেই সরাসরি সরবরাহ করা যায়, মূল origin server (যেমন S3 বা EC2) পর্যন্ত না গিয়ে।

- **Lambda@Edge**: CloudFront-এর সাথে integrated একটা feature, যেটা edge location-এ **custom Lambda function চালানোর** সুযোগ দেয়—viewer request/response, origin request/response—এই চার পয়েন্টে code inject করা যায়। এখানে Node.js/Python-এর মতো full-featured runtime সাপোর্ট করে এবং execution time limit তুলনামূলক বেশি (কয়েক সেকেন্ড পর্যন্ত)।

- **CloudFront Functions**: আরও lightweight, দ্রুত, এবং সস্তা option—শুধুমাত্র **JavaScript**-এ লেখা যায়, execution time **sub-millisecond**, এবং শুধু simple, high-volume operation (header manipulation, URL rewrite, redirect) করার জন্য ডিজাইন করা।

**কেন latency কমায়**: যেহেতু processing/content delivery user-এর কাছাকাছি edge location থেকেই হয়ে যায়, তাই request-কে দূরের central region পর্যন্ত travel করতে হয় না—**round-trip time কমে যায়**, ফলে user experience দ্রুত হয়।

---

### What's the difference between Lambda@Edge and CloudFront Functions, and when would you pick one over the other?

| বিষয় | Lambda@Edge | CloudFront Functions |
|---|---|---|
| Language | Node.js, Python | শুধু JavaScript (ES) |
| Execution time | কয়েক সেকেন্ড পর্যন্ত | Sub-millisecond (খুবই দ্রুত) |
| Trigger points | Viewer request/response, Origin request/response (৪টা) | শুধু Viewer request/response (২টা) |
| Complexity | জটিল logic, external call, npm package সাপোর্ট করে | শুধু simple, lightweight logic |
| Scale | তুলনামূলক কম (higher latency budget) | Millions of request/second handle করতে পারে |
| Cost | তুলনামূলক বেশি | অনেক সস্তা |

**কখন কোনটা choose করবেন**:
- **CloudFront Functions** বেছে নিন যখন কাজ খুবই simple এবং high-volume—যেমন **HTTP header manipulation, simple redirect, URL rewrite/normalization, access control token validation (simple)**। এটা দ্রুততম এবং সস্তা।

- **Lambda@Edge** বেছে নিন যখন বেশি জটিল logic দরকার—যেমন **A/B testing logic, dynamic content generation, external API/database call, image resizing on-the-fly, complex authentication/authorization**, অথবা origin request/response-এ কাজ করতে হবে (যেটা CloudFront Functions সাপোর্ট করে না)।

---

### What kind of logic should never run at the edge?

- **Heavy computation/long-running process**: যেমন large-scale data processing, machine learning inference (বড় model), video transcoding—এগুলো edge-এর resource-constrained, time-limited environment-এর জন্য উপযুক্ত না।

- **Database-heavy বা stateful transaction logic**: যেমন payment processing, order placement, inventory update—এসব logic যেখানে **strong consistency এবং transactional integrity** দরকার, সেটা edge-এ distributed ভাবে চালানো risky (data consistency নিশ্চিত করা কঠিন, এবং origin database-এর সাথে বারবার communicate করলে edge-এর latency benefit-ই হারিয়ে যায়)।

- **Sensitive/critical business logic যেখানে centralized control দরকার**: যেমন core authentication/authorization logic যেটা ঘন ঘন আপডেট হয় বা audit করা দরকার—edge-এ distributed হয়ে গেলে consistency এবং monitoring জটিল হয়ে পড়ে।

- **Large dependency/package দরকার এমন logic**: Edge environment-এর package size এবং memory-তে সীমাবদ্ধতা থাকে (বিশেষত CloudFront Functions-এ), তাই বড় library-নির্ভর logic এখানে চালানো যায় না।

- **High-latency external API call-নির্ভর logic**: Edge-এ যদি বারবার দূরের একটা external service-কে call করতে হয়, তাহলে edge computing-এর মূল সুবিধা (low latency) নষ্ট হয়ে যায়—এই ধরনের কাজ বরং central/origin layer-এ রাখা ভালো।

**সাধারণ নিয়ম**: Edge-এ শুধু **lightweight, stateless, fast-executing logic** রাখা উচিত (routing, header/cookie manipulation, simple validation, caching decision)। যেকোনো কিছু যেটা **heavy resource, persistent state, বা strict consistency** দাবি করে, সেটা central/origin-এ রাখাই নিরাপদ এবং সঠিক architecture।