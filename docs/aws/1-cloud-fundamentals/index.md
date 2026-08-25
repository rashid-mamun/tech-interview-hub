---
sidebar_position: 1
title: Cloud Fundamentals
---


## 1. What is cloud computing, and how does AWS differ from traditional on-premise infrastructure?

**Cloud computing** হলো internet-এর মাধ্যমে computing resources (server, storage, database, networking, software) ব্যবহার করার একটা model, যেখানে নিজের কোনো physical hardware কিনতে বা maintain করতে হয় না। এর বদলে আপনি একটা cloud provider (যেমন AWS, Azure, GCP) থেকে এই resources গুলো **rent** করেন এবং যতটুকু ব্যবহার করেন ততটুকুর জন্য pay করেন।

অন্যদিকে, **traditional on-premise infrastructure**-এ organization নিজে server কিনে, নিজের data center-এ বসিয়ে, নিজে maintain, upgrade, এবং secure করে। এখানে বিশাল **upfront capital investment (CAPEX)** লাগে, hardware procurement-এ সময় লাগে, এবং scaling করতে হলে নতুন hardware কিনতে হয়—যেটা সময়সাপেক্ষ এবং costly।

মূল পার্থক্যগুলো হলো:

| বিষয় | On-premise | AWS (Cloud) |
|---|---|---|
| Cost model | CAPEX (upfront investment) | OPEX (pay-as-you-go) |
| Scaling | Slow, hardware কিনতে হয় | Fast, minutes-এ scale করা যায় |
| Maintenance | নিজে করতে হয় | AWS করে (infrastructure layer) |
| Deployment time | সপ্তাহ/মাস লাগতে পারে | মিনিট-এর মধ্যে resource তৈরি করা যায় |

---

### What are AWS's core characteristics (on-demand self-service, elasticity, pay-as-you-go pricing)?

- **On-demand self-service**: কোনো human interaction বা approval process ছাড়াই আপনি নিজে AWS Console/CLI/API দিয়ে যেকোনো সময় resource (EC2 instance, S3 bucket ইত্যাদি) provision করতে পারবেন। কোনো sales person বা IT team-এর কাছে ticket রেইজ করার দরকার নেই।

- **Elasticity**: Demand অনুযায়ী resource automatically বা manually **scale up/down** করা যায়। Traffic বাড়লে server সংখ্যা বাড়বে, কমলে কমবে—এটা **Auto Scaling**-এর মাধ্যমে হয়।

- **Pay-as-you-go pricing**: আপনি শুধু যতটুকু resource ব্যবহার করেছেন ততটুকুর জন্যই bill পাবেন। কোনো long-term commitment ছাড়াই hourly/per-second billing হয় (যদিও Reserved Instances বা Savings Plans দিয়ে discount নেওয়া যায়)।

এছাড়া আরও কিছু characteristics আছে: **broad network access**, **resource pooling (multi-tenancy)**, এবং **measured service** (usage-এর transparent metering)।

---

### What are the risks of relying on AWS (vendor lock-in, shared security responsibility, compliance)?

- **Vendor lock-in**: AWS-এর proprietary services (যেমন DynamoDB, Lambda-specific configurations) ব্যবহার করলে পরে অন্য cloud provider-এ migrate করা কঠিন এবং costly হয়ে যায়, কারণ architecture ওই specific service-এর উপর tightly coupled হয়ে যায়।

- **Shared Responsibility Model**: AWS শুধু "security **of** the cloud" (physical infrastructure, hardware, networking) এর দায়িত্ব নেয়। কিন্তু "security **in** the cloud" (data encryption, IAM permissions, application-level security, patching OS) এর দায়িত্ব **customer**-এর। এই বিষয়টা অনেক organization ভুল বোঝে এবং misconfiguration-এর কারণে data breach হয়।

- **Compliance**: বিভিন্ন industry-তে (healthcare, finance) নির্দিষ্ট regulatory requirement থাকে (যেমন HIPAA, GDPR, PCI-DSS)। যদিও AWS অনেক compliance certification support করে, তবুও architecture সঠিকভাবে design না করলে compliance violation হতে পারে—আর এই দায়িত্ব ultimately customer-এর।

এছাড়াও **cost unpredictability** (usage বেড়ে গেলে bill হঠাৎ অনেক বেড়ে যাওয়া) এবং **outage risk** (AWS-এর কোনো region down হলে dependent service গুলোও affected হয়) বড় risk।

---

### Can you give an example of a workload that's actually cheaper to keep on-prem?

**Example**: ধরুন একটা company-র একটা **predictable, steady-state, high-volume compute workload** আছে—যেমন একটা batch processing system যেটা 24/7, বছরের পর বছর একই resource utilization-এ চলে (যেমন একটা internal payroll processing system বা legacy ERP system)।

এক্ষেত্রে:
- Resource usage **predictable এবং constant**, তাই elasticity-এর কোনো advantage নেই।
- বড় পরিমাণ compute/storage বছরের পর বছর ব্যবহার হবে, তাই **long-term TCO (Total Cost of Ownership)** হিসেবে hardware কিনে ফেলা cloud-এর ongoing pay-as-you-go cost-এর চেয়ে সস্তা পড়ে।
- Data sovereignty বা strict regulatory requirement থাকলে (যেমন data দেশের বাইরে যেতে পারবে না), on-prem বা private data center বাধ্যতামূলক হতে পারে।

সাধারণত rule of thumb: **variable, unpredictable, বা bursty workload-এর জন্য cloud ভালো**; **steady, predictable, long-term high-utilization workload-এর জন্য on-prem সস্তা** হতে পারে।

---

### How would you explain "elasticity" to a non-technical stakeholder?

একটা সহজ analogy ব্যবহার করা যায়:

> "ধরুন আপনার একটা restaurant আছে। সাধারণ দিনে ৫ জন staff লাগে। কিন্তু ঈদের সময় হঠাৎ customer অনেক বেড়ে যায়, তখন আপনার ১৫ জন staff দরকার হয়। এখন যদি আপনি সারা বছর ১৫ জন staff-কে salary দিতে থাকেন, সেটা অপচয়। আবার শুধু ৫ জন রাখলে ঈদের সময় customer সামলাতে পারবেন না।
>
> **Elasticity** মানে হলো—আপনি demand অনুযায়ী automatically staff (এখানে server/computing power) বাড়াতে বা কমাতে পারবেন। ঈদের সময় resource বেড়ে যাবে, normal দিনে কমে যাবে—এবং আপনি শুধু যতটুকু দরকার ততটুকুর জন্যই pay করবেন। এতে কখনো over-spend হবে না, আবার কখনো customer হারাবেন না।"

এই analogy দিয়ে stakeholder সহজেই বুঝবেন কেন elasticity একটা cost-effective এবং flexible solution।

## 2. What is the difference between IaaS, PaaS, SaaS, and FaaS, and which AWS services represent each?

এই চারটা model মূলত **"কতটুকু responsibility AWS নেয় আর কতটুকু আপনি নেন"**—এই spectrum-এর উপর ভিত্তি করে তৈরি।

- **IaaS (Infrastructure as a Service)**: AWS শুধু raw infrastructure (server, storage, network) দেয়। OS install, patching, application deployment—সব আপনার দায়িত্ব।
  → **AWS example: EC2, EBS, VPC**

- **PaaS (Platform as a Service)**: AWS underlying infrastructure এবং runtime environment manage করে। আপনি শুধু code/application deploy করেন, server management নিয়ে ভাবতে হয় না।
  → **AWS example: Elastic Beanstalk, RDS (managed database)**

- **SaaS (Software as a Service)**: সম্পূর্ণ ready-made application, আপনি শুধু end-user হিসেবে ব্যবহার করেন। Infrastructure, platform, application—সবকিছুর দায়িত্ব provider-এর।
  → **AWS example: Amazon Chime, WorkMail, QuickSight** (এগুলো fully managed end-user application)

- **FaaS (Function as a Service / Serverless)**: আপনি শুধু individual function/code লিখেন, event trigger হলে সেটা execute হয়। Server, scaling, provisioning—কিছুই manage করতে হয় না।
  → **AWS example: Lambda**

---

### EC2 (IaaS) vs. Elastic Beanstalk/RDS (PaaS) vs. Lambda (FaaS) — what does AWS manage in each?

| Layer | EC2 (IaaS) | Elastic Beanstalk/RDS (PaaS) | Lambda (FaaS) |
|---|---|---|---|
| Physical hardware | AWS manages | AWS manages | AWS manages |
| Virtualization | AWS manages | AWS manages | AWS manages |
| OS | **আপনি manage করেন** (patching, updates) | AWS manages (কিছু customization option থাকে) | AWS manages (fully abstracted) |
| Runtime/Middleware | আপনি install/configure করেন | AWS manages, আপনি শুধু config করেন | AWS manages fully |
| Application code | আপনি deploy ও manage করেন | আপনি deploy করেন, deployment pipeline AWS handle করে | আপনি শুধু function code লেখেন |
| Scaling | আপনাকে **Auto Scaling group** নিজে configure করতে হয় | Elastic Beanstalk অনেকটা automate করে | AWS automatically scale করে (per-request) |
| Data (RDS-এ) | N/A | AWS backup, patching, replication manage করে; আপনি schema/query নিয়ন্ত্রণ করেন | N/A |

সংক্ষেপে: **EC2-তে আপনি সবচেয়ে বেশি control পান কিন্তু সবচেয়ে বেশি responsibility-ও আপনার**। **Lambda-তে আপনার দায়িত্ব সবচেয়ে কম, কিন্তু control-ও সবচেয়ে কম।**

---

### When would you choose EC2 vs. Elastic Beanstalk vs. Lambda for a given workload?

- **EC2 choose করবেন যখন**:
  - Full control দরকার (custom OS configuration, specific software stack, legacy application যেটা specific environment ছাড়া চলে না)।
  - Long-running process আছে যেটা continuously চলে (যেমন গেম সার্ভার)।
  - Licensing বা compliance requirement-এর কারণে specific OS-level control দরকার।

- **Elastic Beanstalk choose করবেন যখন**:
  - Standard web application (Node.js, Python, Java, .NET ইত্যাদি) দ্রুত deploy করতে চান, কিন্তু infrastructure management-এর ঝামেলায় যেতে চান না।
  - Team-এর মধ্যে DevOps expertise কম, কিন্তু কিছুটা customization-ও দরকার (EC2-এর তুলনায় সহজ, তবে Lambda-এর মতো fully abstract না)।

- **Lambda choose করবেন যখন**:
  - **Event-driven, short-duration task** (যেমন image processing, API backend, scheduled job) যেটা intermittently trigger হয়।
  - Traffic pattern **unpredictable বা spiky**, এবং idle time-এ কোনো cost দিতে চান না (Lambda-তে শুধু execution time-এর জন্য pay করেন)।
  - Team চায় সম্পূর্ণভাবে **infrastructure-free, serverless architecture**।

---

### If you migrate a service from EC2 to Lambda, what operational burden disappears, and what new constraints appear?

**যা চলে যায় (disappears)**:
- **OS patching এবং maintenance**—আর করতে হবে না।
- **Server provisioning এবং capacity planning**—Lambda নিজেই automatically scale করে।
- **Auto Scaling group configuration**—দরকার নেই, প্রতিটা request নিজে থেকেই handle হয়।
- **Idle-time cost**—EC2-তে server 24/7 চললে idle থাকলেও pay করতে হয়, Lambda-তে শুধু actual execution time-এর জন্য bill হয়।
- **Load balancer/health check management** (অনেকাংশে simplified হয়ে যায়)।

**নতুন যা constraint আসে**:
- **Execution time limit**: Lambda function-এর maximum execution time আছে (১৫ মিনিট)। দীর্ঘ সময় ধরে চলা process এখানে চলবে না।
- **Cold start latency**: অনেকদিন idle থাকার পর প্রথম request-এ latency বেড়ে যেতে পারে, কারণ AWS নতুন করে environment initialize করে।
- **Stateless architecture বাধ্যতামূলক**: Lambda function stateless হতে হবে; কোনো local state persist করা যায় না (session data external store, যেমন DynamoDB/ElastiCache-এ রাখতে হয়)।
- **Resource limit**: Memory (up to 10GB) এবং ephemeral storage-এর সীমা আছে, যেটা EC2-তে অনেক flexible।
- **Vendor lock-in বাড়ে**: Lambda-specific triggers, event source integration (API Gateway, S3 event ইত্যাদি) code-এর মধ্যে tightly coupled হয়ে যায়, migration কঠিন হয়ে পড়ে।
- **Debugging/monitoring complexity**: Distributed, event-driven architecture-এ traditional debugging পদ্ধতি (SSH করে log দেখা) কাজ করে না; CloudWatch Logs, X-Ray-এর মতো tool-এর উপর নির্ভর করতে হয়।

## 3. What is the difference between a single-account/single-region AWS setup, a hybrid setup, and multi-cloud?

- **Single-account/single-region setup**: পুরো organization-এর সব workload একটা মাত্র **AWS account**-এ এবং একটা মাত্র **region**-এ (যেমন শুধু `us-east-1`) চলে। এটা simple, manage করা সহজ, কিন্তু **single point of failure** এবং **blast radius** বড়—কোনো misconfiguration বা security breach হলে পুরো organization affected হয়। ছোট প্রজেক্ট বা startup-এর জন্য common।

- **Hybrid setup**: Organization-এর কিছু workload **AWS (public cloud)**-এ থাকে, আর কিছু workload নিজেদের **on-premise data center**-এ থাকে, এবং এই দুটো environment একসাথে **connected** হয়ে কাজ করে (secure network link-এর মাধ্যমে)। সাধারণত legacy system, sensitive data, বা regulatory reason-এ কিছু অংশ on-prem রাখতে হয়, বাকিটা cloud-এ scale করা হয়।

- **Multi-cloud**: Organization একাধিক cloud provider (যেমন AWS + Azure, বা AWS + GCP) একসাথে ব্যবহার করে বিভিন্ন workload-এর জন্য। এটা vendor lock-in কমায়, কিন্তু complexity অনেক বেড়ে যায়—কারণ প্রতিটা provider-এর আলাদা tooling, API, এবং pricing model থাকে।

---

### How do AWS Outposts and Direct Connect support hybrid architectures?

- **AWS Outposts**: এটা মূলত AWS-এর **physical hardware/rack** যেটা আপনার নিজের data center-এ install করা হয়, কিন্তু সেটা AWS-এর নিজস্ব cloud console, API, এবং service (EC2, EBS, RDS ইত্যাদি) দিয়েই manage হয়। ফলে আপনি on-premise-এ থেকেও **AWS-native experience** পান—data সরাসরি local data center-এ থাকে (low latency, data residency compliance-এর জন্য দরকারি), অথচ management AWS console থেকেই হয়। এটা "cloud experience, on-prem location"।

- **AWS Direct Connect**: এটা একটা **dedicated, private network connection** যেটা আপনার on-premise data center থেকে সরাসরি AWS-এর network-এর সাথে যুক্ত করে—public internet bypass করে। এর ফলে:
  - **Latency কম এবং predictable** হয় (internet-এর unpredictable congestion থাকে না)।
  - **Bandwidth বেশি এবং consistent**।
  - **Security বাড়ে**, কারণ traffic public internet দিয়ে যায় না।

  এটা মূলত hybrid architecture-এ on-prem এবং AWS-এর মধ্যে **reliable backbone** হিসেবে কাজ করে—যেমন on-prem database-কে AWS-এর application-এর সাথে sync রাখা, বা large data migration করা।

---

### What are the operational challenges of running AWS alongside another cloud provider?

- **Tooling এবং skillset fragmentation**: AWS-এর জন্য CloudFormation, IAM, CloudWatch শিখতে হয়; আবার Azure/GCP-এর জন্য আলাদা tool (ARM templates, Azure AD, Stackdriver) শিখতে হয়। Team-এর উপর **dual expertise** maintain করার চাপ পড়ে।

- **Networking complexity**: দুই provider-এর মধ্যে secure, low-latency connectivity স্থাপন করা (VPN বা dedicated link দিয়ে) এবং সেটা troubleshoot করা কঠিন।

- **Identity এবং access management**: প্রতিটা provider-এর নিজস্ব IAM system আছে; unified identity management (SSO) সেট আপ করা এবং consistent security policy বজায় রাখা জটিল।

- **Cost visibility এবং management**: প্রতিটা provider-এর আলাদা billing dashboard, pricing model, এবং discount structure থাকে—unified cost tracking করা কঠিন হয়ে যায়।

- **Monitoring এবং observability**: Centralized logging/monitoring তৈরি করতে হয় (যেমন third-party tool যেমন Datadog ব্যবহার করে), কারণ CloudWatch শুধু AWS-এর জন্য কাজ করে।

- **Data consistency এবং latency**: Provider-এর মধ্যে data sync করলে latency এবং eventual consistency-এর সমস্যা দেখা দিতে পারে।

- **CI/CD pipeline complexity**: Deployment pipeline-কে দুই ভিন্ন provider-এর জন্য আলাদাভাবে design করতে হয়, যেটা automation-কে জটিল করে তোলে।

---

### Why might a company deliberately choose multi-cloud despite the added complexity?

- **Vendor lock-in এড়ানো**: কোনো একটা provider-এর উপর সম্পূর্ণ নির্ভরশীল না হয়ে, negotiation power এবং flexibility বজায় রাখা যায়।

- **Best-of-breed service ব্যবহার**: প্রতিটা provider-এর নিজস্ব strength আছে—যেমন কেউ AI/ML-এর জন্য GCP-এর BigQuery/Vertex AI পছন্দ করতে পারে, আবার general compute-এর জন্য AWS ব্যবহার করতে পারে।

- **Redundancy এবং disaster recovery**: একটা provider-এ বড় outage হলে (যেমন AWS-এর কোনো region down হলে), অন্য provider-এ workload চালু রাখা যায়—এটা **business continuity** বাড়ায়।

- **Regulatory/compliance requirement**: কিছু দেশ বা industry-তে data নির্দিষ্ট provider বা region-এ রাখার বাধ্যবাধকতা থাকতে পারে, যেটা multi-cloud দিয়ে satisfy করা সহজ হয়।

- **M&A (Mergers & Acquisitions)**: কোম্পানি অন্য কোম্পানি কিনলে, সেই কোম্পানি হয়তো ইতিমধ্যে অন্য cloud provider ব্যবহার করছে—পুরোপুরি migrate না করে multi-cloud হিসেবে চালিয়ে যাওয়া সহজ ও কম risky।

- **Cost optimization**: বিভিন্ন provider-এর pricing model তুলনা করে workload অনুযায়ী সবচেয়ে সাশ্রয়ী provider বেছে নেওয়া যায়।

তবে এই সব benefit-এর বিপরীতে **operational overhead এবং complexity** অনেক বেড়ে যায়, তাই বেশিরভাগ ছোট-মাঝারি company এটা এড়িয়ে চলে এবং শুধু বড়, enterprise-level organization-ই এই approach নেয়, যাদের dedicated cloud infrastructure team আছে।

## 4. What are AWS Regions and Availability Zones?

- **AWS Region**: এটা পৃথিবীর একটা নির্দিষ্ট ভৌগোলিক এলাকা (geographic location) যেখানে AWS তাদের data center-গুলোর একটা cluster স্থাপন করেছে—যেমন `us-east-1` (N. Virginia), `ap-southeast-1` (Singapore)। প্রতিটা region সম্পূর্ণভাবে **independent এবং isolated**, যাতে একটা region-এর সমস্যা অন্য region-কে affect না করে।

- **Availability Zone (AZ)**: প্রতিটা Region-এর ভেতরে একাধিক (সাধারণত ৩টা বা তার বেশি) **AZ** থাকে। প্রতিটা AZ আসলে এক বা একাধিক **আলাদা, physically separated data center**—যাদের নিজস্ব power, cooling, এবং networking থাকে। কিন্তু একই region-এর মধ্যে AZ গুলো **low-latency, high-bandwidth private network** দিয়ে interconnected থাকে।

সহজভাবে: **Region = শহর/এলাকা**, **AZ = সেই এলাকার মধ্যে আলাদা আলাদা building/data center**।

---

### Why should production workloads span multiple AZs within a region?

- **High Availability (HA)**: যদি একটা মাত্র AZ ব্যবহার করেন এবং সেই AZ-এ power outage, hardware failure, বা natural disaster (fire, flood) হয়, তাহলে পুরো application down হয়ে যাবে। Multiple AZ-তে deploy করলে একটা AZ fail করলেও বাকি AZ গুলো traffic handle করতে পারে—**downtime এড়ানো যায়**।

- **Fault tolerance**: AWS service যেমন **RDS Multi-AZ**, **Auto Scaling Group across AZs**, **Elastic Load Balancer (ELB)**—এগুলো automatically multiple AZ-এ resource distribute করে এবং কোনো AZ fail করলে traffic অন্য AZ-এ route করে দেয়।

- **Data durability**: Database replication multiple AZ-তে রাখলে (যেমন RDS Multi-AZ deployment), একটা AZ-এর data loss হলেও অন্য AZ-এ synchronous replica থেকে data recover করা যায়।

- **SLA compliance**: AWS-এর অনেক managed service-এর **SLA (Service Level Agreement)** guarantee করার শর্তই হলো multi-AZ architecture ব্যবহার করা।

সংক্ষেপে: single-AZ architecture মানে **single point of failure**, যেটা production workload-এর জন্য অগ্রহণযোগ্য।

---

### How does region selection affect latency, data residency, and compliance (e.g., GovCloud)?

- **Latency**: User-এর geographic location-এর যত কাছে region থাকবে, **round-trip latency** তত কম হবে। যেমন, যদি আপনার বেশিরভাগ user বাংলাদেশ/দক্ষিণ এশিয়া থেকে হয়, তাহলে `ap-south-1` (Mumbai) বা `ap-southeast-1` (Singapore) region ব্যবহার করলে `us-east-1`-এর তুলনায় latency অনেক কম পাবেন।

- **Data residency**: অনেক দেশের আইন অনুযায়ী নাগরিকদের sensitive data (personal data, financial data, health record) সেই দেশের ভৌগোলিক সীমানার মধ্যেই থাকতে হয় (data sovereignty law)। যেমন EU-এর **GDPR** অনুযায়ী EU citizen-দের data EU-এর বাইরে নেওয়ার ক্ষেত্রে কড়াকড়ি আছে। এক্ষেত্রে সঠিক region বেছে নেওয়া legal বাধ্যবাধকতা।

- **Compliance (GovCloud উদাহরণ)**: **AWS GovCloud (US)** একটা isolated region, যেটা বিশেষভাবে US government agency এবং তাদের contractor-দের জন্য ডিজাইন করা—যেখানে **FedRAMP, ITAR, DoD** এর মতো strict compliance requirement satisfy করা হয়। এই region-এ access সীমাবদ্ধ (শুধু vetted US person/entity), এবং data সাধারণ AWS region থেকে সম্পূর্ণ আলাদাভাবে isolated রাখা হয়। কোনো organization যদি regulated industry-তে (defense, government contract) কাজ করে, তাদের অবশ্যই এই ধরনের specialized region ব্যবহার করতে হবে, নাহলে compliance violation হবে।

- **Cost**: Region ভেদে pricing আলাদা হয় (যেমন `us-east-1` সাধারণত সবচেয়ে সস্তা region-গুলোর একটা), তাই region selection cost optimization-কেও প্রভাবিত করে।

---

### What's the difference in blast radius between an AZ-level failure and a full region-level failure?

- **AZ-level failure**: এখানে blast radius **সীমিত**—শুধু একটা নির্দিষ্ট data center/AZ-এ থাকা resource-গুলো affected হয়। যদি architecture properly multi-AZ design করা থাকে (Auto Scaling, Load Balancer, RDS Multi-AZ ব্যবহার করে), তাহলে application-level-এ **কোনো downtime ছাড়াই বা খুব সামান্য downtime-এ** traffic অন্য healthy AZ-তে shift হয়ে যায়। User প্রায় কিছুই টের পায় না।

- **Region-level failure**: এটা অনেক **rare** কিন্তু ঘটলে blast radius **অনেক বড়**—পুরো region-এর সব AZ একসাথে affected হয় (যদিও পুরো region সম্পূর্ণ down হওয়া বিরল, কিন্তু critical service disruption হতে পারে, যেমন 2021-এর `us-east-1` outage-এর ঘটনা)। এক্ষেত্রে যদি আপনার architecture শুধুমাত্র একটা region-এর উপর নির্ভরশীল থাকে, তাহলে পুরো application/service globally down হয়ে যেতে পারে।

  এই ঝুঁকি এড়াতে **multi-region architecture** (Disaster Recovery strategy যেমন **Pilot Light, Warm Standby, বা Active-Active**) ব্যবহার করা হয়, যেখানে একটা region সম্পূর্ণ fail করলেও অন্য region-এ traffic route করে দেওয়া যায় (যেমন **Route 53 failover routing** ব্যবহার করে)।

**সংক্ষেপে**:
- AZ failure → **local, contained impact**, multi-AZ architecture দিয়ে সহজে mitigate করা যায়।
- Region failure → **catastrophic, wide-scale impact**, mitigate করতে হলে costly এবং complex **multi-region architecture** দরকার হয়—যেটা সাধারণত শুধু mission-critical, high-availability requirement থাকা application-এর জন্যই justify করা হয়।

## 5. What is the AWS Shared Responsibility Model?

এই model অনুযায়ী cloud security-র দায়িত্ব দুই ভাগে ভাগ করা হয়েছে:

- **AWS-এর দায়িত্ব ("Security OF the Cloud")**: Physical infrastructure, data center security, hardware, networking infrastructure, এবং virtualization layer-এর security AWS নিশ্চিত করে।

- **Customer-এর দায়িত্ব ("Security IN the Cloud")**: Data encryption, IAM configuration, network/firewall (Security Group) configuration, application-level security, এবং OS-level patching (যেখানে applicable) — এগুলো customer-এর দায়িত্ব।

মূল কথা হলো: **AWS infrastructure secure রাখে, কিন্তু আপনি সেই infrastructure কীভাবে ব্যবহার/configure করছেন তার দায়িত্ব আপনার**।

---

### How does the split differ between EC2 (IaaS), RDS (managed), and Lambda (FaaS)?


| Layer | EC2 (IaaS) | RDS (Managed) | Lambda (FaaS) |
|---|---|---|---|
| Physical/Hardware | AWS | AWS | AWS |
| Network infrastructure | AWS | AWS | AWS |
| Hypervisor/Virtualization | AWS | AWS | AWS |
| **OS patching** | **Customer** | **AWS** | **AWS** |
| Database engine patching | N/A | **AWS** (auto বা scheduled) | N/A |
| Runtime | Customer install করে | AWS manages | **AWS** |
| Application code security | **Customer** | **Customer** (query, access control) | **Customer** (function code) |
| Data encryption configuration | **Customer** | **Customer** (enable/configure করতে হয়) | **Customer** |
| Network config (Security Group, VPC) | **Customer** | **Customer** | **Customer** (VPC integration optional) |
| IAM permissions | **Customer** | **Customer** | **Customer** |

লক্ষ্য করুন: যত বেশি "managed"/serverless-এর দিকে যাবেন (EC2 → RDS → Lambda), AWS তত বেশি responsibility নেয়, আর customer-এর responsibility তত সংকুচিত হয়ে **শুধু data, access control, এবং application logic**-এ কেন্দ্রীভূত হয়।

---

### Who's responsible for OS patching on EC2 vs. RDS vs. Lambda?

- **EC2**: **সম্পূর্ণভাবে customer-এর দায়িত্ব**। আপনি নিজে OS choose করেছেন (Amazon Linux, Ubuntu, Windows), তাই security patch, update, vulnerability fix—সবকিছু নিয়মিত নিজে করতে হবে (অথবা AWS Systems Manager Patch Manager-এর মতো tool দিয়ে automate করতে হবে)।

- **RDS**: **AWS-এর দায়িত্ব**। Underlying OS এবং database engine patching AWS নিজে করে (maintenance window অনুযায়ী)। আপনি চাইলে auto-minor-version-upgrade enable/disable করতে পারেন, কিন্তু patching-এর actual কাজ AWS করে।

- **Lambda**: **সম্পূর্ণভাবে AWS-এর দায়িত্ব**। আপনার OS-এর সাথে কোনো সম্পর্কই নেই—AWS পুরো execution environment (runtime সহ) manage করে। আপনি শুধু function code লেখেন।

---

### If there's a data breach because of a misconfigured public S3 bucket, whose fault is it under this model?

এটা **customer-এর দায়িত্ব**, AWS-এর নয়।

কারণ:
- S3 bucket-এর **default configuration আসলে private** থাকে—AWS ইচ্ছাকৃতভাবে bucket public করে দেয় না।
- Bucket-কে public করা, ACL (Access Control List) সেট করা, বা bucket policy লেখা—এগুলো সবই **"Security IN the Cloud"**-এর অংশ, যেটা সম্পূর্ণভাবে customer configuration-এর উপর নির্ভরশীল।
- AWS শুধু **infrastructure** (S3-এর underlying storage system, durability, availability) সুরক্ষিত রাখার দায়িত্ব নেয়, কিন্তু আপনি সেই bucket-এ কী **access policy** সেট করবেন—সেটা সম্পূর্ণ আপনার নিয়ন্ত্রণে।

তাই এই ধরনের ঘটনা ঘটলে, incident response এবং post-mortem-এ সাধারণত দেখা যায় এটা **customer-side misconfiguration**—এবং AWS-ও তাদের documentation-এ বারবার এই বিষয়ে সতর্ক করে (যেমন S3 Block Public Access feature দিয়ে accidental exposure রোধ করার সুবিধা দেয়, কিন্তু সেটাও enable করা customer-এর দায়িত্ব)।

---

## 6. What is elasticity in AWS, and how do Auto Scaling Groups (ASG) implement it?


**Elasticity** হলো demand-এর সাথে সাথে computing resource-কে **automatically বাড়ানো বা কমানোর** সক্ষমতা—যাতে সবসময় ঠিক ততটুকু resource ব্যবহার হয় যতটুকু প্রয়োজন, না বেশি, না কম।

**Auto Scaling Group (ASG)** এটা বাস্তবায়ন করে এভাবে:
- একটা **minimum, maximum, এবং desired capacity** define করা হয় (কতগুলো EC2 instance রাখতে হবে)।
- **CloudWatch metrics** (যেমন CPU utilization) monitor করে, নির্দিষ্ট threshold পার হলে ASG automatically নতুন instance **launch** করে (scale-out), আর demand কমলে instance **terminate** করে (scale-in)।
- এটা **Launch Template/Configuration** ব্যবহার করে জানে কোন AMI, instance type, এবং configuration দিয়ে নতুন instance তৈরি করতে হবে।

---

### What's the difference between horizontal scaling (adding/removing instances) and vertical scaling (resizing an instance)?

- **Horizontal Scaling (Scale Out/In)**: Instance-এর **সংখ্যা** বাড়ানো বা কমানো হয়। যেমন 2টা EC2 instance থেকে 5টা instance-এ যাওয়া। এটা ASG-এর মূল কাজ। এর সুবিধা—কোনো downtime ছাড়াই scale করা যায়, এবং **fault tolerance** বাড়ে (একটা instance fail করলে বাকিগুলো চলতে থাকে)।

- **Vertical Scaling (Scale Up/Down)**: একটা instance-এর **size/capacity** (CPU, RAM) বাড়ানো বা কমানো হয়—যেমন `t3.medium` থেকে `t3.xlarge`-এ upgrade করা। এতে সাধারণত instance **restart/stop** করতে হয়, তাই সাময়িক **downtime** হয়। এছাড়া একটা নির্দিষ্ট সীমার পরে (সবচেয়ে বড় instance type) আর scale করা যায় না—এটাই vertical scaling-এর limitation।

**সংক্ষেপে**: Cloud-native architecture-এ **horizontal scaling** বেশি preferred, কারণ এটা elastic, fault-tolerant, এবং zero-downtime। Vertical scaling সাধারণত database-এর মতো stateful system-এ ব্যবহার হয় যেখানে horizontal scaling সহজ না।

---

### What CloudWatch metrics typically trigger an ASG scaling policy?
সবচেয়ে common metrics গুলো হলো:

- **CPUUtilization**: সবচেয়ে বেশি ব্যবহৃত metric। CPU usage একটা threshold (যেমন 70%) পার হলে scale-out হয়।
- **NetworkIn/NetworkOut**: Network traffic বেড়ে গেলে scaling trigger করা যায়।
- **RequestCountPerTarget** (ALB থেকে): প্রতিটা target/instance কতগুলো request handle করছে, সেটার ভিত্তিতে scaling।
- **Custom metrics**: Application-specific metric (যেমন queue length, active connection সংখ্যা) CloudWatch-এ push করে সেটার ভিত্তিতেও scaling policy বানানো যায় (যেমন SQS queue-এর message count বেড়ে গেলে worker instance বাড়ানো)।
- **Memory utilization** (default-এ available না, custom CloudWatch agent দিয়ে সেট করতে হয়)।

Scaling policy সাধারণত তিন ধরনের হয়: **Target Tracking** (একটা target value maintain করা, যেমন average CPU 50%), **Step Scaling** (threshold অনুযায়ী ধাপে ধাপে scale করা), এবং **Simple Scaling**।

---

### What's the ASG cooldown period, and why does skipping it cause problems?

**Cooldown period** হলো একটা scaling activity সম্পন্ন হওয়ার পর, ASG একটা নির্দিষ্ট সময় (default 300 seconds/5 মিনিট) **অপেক্ষা করে**, যাতে নতুন কোনো scaling action trigger না হয়—নতুন instance-গুলো ভালোভাবে **boot up এবং metrics stabilize** হওয়ার সুযোগ পায়।

**Cooldown period skip করলে বা খুব ছোট রাখলে যে সমস্যা হয়**:

- **"Thrashing" বা oscillation**: নতুন instance launch হওয়ার সাথে সাথে সেটার CPU/metrics এখনও stabilize হয়নি, কিন্তু ASG যদি সাথে সাথেই আবার metrics check করে, তাহলে ভুল signal পেয়ে **আরও বেশি instance launch** করতে পারে (over-provisioning), অথবা উল্টো দ্রুত **scale-in** করে ফেলতে পারে, যদিও আসল demand তখনও বেশি।

- **Unnecessary cost**: বারবার instance launch/terminate হলে (thrashing), অপ্রয়োজনীয় resource তৈরি হয়ে **cost বেড়ে যায়**।

- **Instability**: Application-এর behavior অস্থির হয়ে পড়ে—instance বারবার আসা-যাওয়া করলে load balancer-এর সাথে connection re-establish করতে হয়, যেটা end-user experience-এ negative impact ফেলে।

তাই cooldown period একটা **buffer** হিসেবে কাজ করে, যাতে ASG প্রতিটা scaling decision নেওয়ার আগে system-কে "settle" হওয়ার সময় দেয়, এবং reactive, unstable scaling behavior এড়ানো যায়।