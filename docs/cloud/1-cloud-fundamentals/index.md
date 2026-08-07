---
sidebar_position: 1
title: Cloud Fundamentals
---


## 1. What is cloud computing, and how is it different from traditional on-premise infrastructure?

**Cloud computing** হলো internet-এর মাধ্যমে compute, storage, database, networking, security, analytics ইত্যাদি IT resources ব্যবহার করার model। এখানে নিজের data center বানিয়ে server কিনে, rack বসিয়ে, cooling/power/manage করার বদলে cloud provider যেমন AWS, Azure, Google Cloud এগুলো থেকে প্রয়োজন অনুযায়ী resource rent করা হয়।

সহজভাবে বললে, traditional infrastructure-এ আপনি নিজের kitchen বানিয়ে সব equipment কিনে রান্না করেন; cloud computing-এ আপনি প্রয়োজন অনুযায়ী cloud provider-এর ready kitchen ব্যবহার করেন এবং যতটুকু ব্যবহার করেন ততটুকুর জন্য pay করেন।

Traditional on-premise infrastructure এবং cloud-এর মূল পার্থক্য:

| বিষয় | Traditional / On-Premise | Cloud Computing |
| :--- | :--- | :--- |
| **Ownership** | Server, storage, network company নিজে কিনে | Cloud provider infrastructure own করে |
| **Cost model** | আগে থেকেই বড় capital expense লাগে | Pay-as-you-go operational expense |
| **Scaling** | নতুন hardware কিনতে হয়, সময় লাগে | কয়েক মিনিটে resource বাড়ানো/কমানো যায় |
| **Maintenance** | Hardware, power, cooling, patching অনেকটাই নিজের দায়িত্ব | অনেক operational কাজ provider handle করে |
| **Availability** | নিজের data center design-এর উপর নির্ভর করে | Region/AZ ব্যবহার করে high availability সহজ হয় |
| **Speed** | Procurement ধীর | Resource on-demand পাওয়া যায় |

Interview-এ short answer:

> Cloud computing is the delivery of computing resources over the internet on-demand. Unlike on-premise infrastructure where a company owns and manages physical hardware, cloud uses provider-managed infrastructure, gives elastic scaling, faster provisioning, and pay-as-you-go pricing.

### What are the core characteristics of cloud (on-demand self-service, elasticity, pay-as-you-go)?

Cloud computing-এর কয়েকটা core characteristic আছে, যেগুলো cloud-কে traditional hosting থেকে আলাদা করে।

1. **On-demand self-service**

User নিজে portal, CLI, API বা automation tool দিয়ে resource create করতে পারে। আলাদা করে vendor বা infrastructure team-এর কাছে manually server setup করার জন্য অপেক্ষা করতে হয় না।

Example:

```text
Need a VM? Create EC2 instance.
Need database? Create RDS.
Need object storage? Create S3 bucket.
```

2. **Broad network access**

Cloud services internet বা private network-এর মাধ্যমে globally accessible হয়। Laptop, mobile, server, CI/CD pipeline, application backend - সব জায়গা থেকে API দিয়ে cloud resource access করা যায়।

3. **Resource pooling**

Cloud provider একই physical infrastructure অনেক customer-এর মধ্যে securely share করে। এই model-কে **multi-tenancy** বলা হয়। Customer directly physical machine manage করে না, কিন্তু logically isolated resource পায়।

4. **Elasticity**

Demand বাড়লে resource বাড়ানো এবং demand কমলে resource কমানো যায়। এটাই cloud-এর সবচেয়ে বড় advantage।

Example:

```text
Normal traffic: 2 servers
Campaign traffic: 20 servers
Traffic কমে গেলে: আবার 2 servers
```

5. **Pay-as-you-go**

যতটুকু resource ব্যবহার করবেন, সাধারণত ততটুকুর জন্য bill আসে। আগে থেকে ৫ বছরের server কিনে বসিয়ে রাখার দরকার হয় না।

6. **Measured service**

Cloud provider CPU, memory, storage, bandwidth, request count, database usage ইত্যাদি measure করে। তাই cost tracking, usage monitoring, optimization করা সহজ হয়।

> সংক্ষেপে: Cloud-এর মূল শক্তি হলো **speed, elasticity, automation, global reach, and usage-based pricing**।

### What are the risks/downsides of cloud adoption (vendor lock-in, security, compliance)?

Cloud powerful হলেও blind adoption করলে সমস্যা হতে পারে। Interview-এ balanced answer দেওয়া জরুরি: cloud মানেই সবসময় cheap বা automatically secure না।

**১. Vendor lock-in**

যদি application খুব বেশি provider-specific service-এর উপর depend করে, তাহলে অন্য cloud বা on-premise-এ migrate করা কঠিন হয়।

Example:

```text
AWS Lambda + DynamoDB + EventBridge + Step Functions
```

এই architecture ভালো হতে পারে, কিন্তু Azure বা Google Cloud-এ সরাতে গেলে অনেক code/design change লাগতে পারে।

**২. Security misconfiguration**

Cloud provider secure infrastructure দেয়, কিন্তু customer ভুল configuration করলে data leak হতে পারে।

Common mistake:

- Public storage bucket
- Over-permissive IAM policy
- Open security group: `0.0.0.0/0`
- Secrets source code-এ রাখা
- Encryption disabled রাখা

**৩. Compliance and data residency**

কিছু industry যেমন banking, healthcare, government-এ data কোথায় store হচ্ছে, কে access করছে, audit log আছে কিনা - এগুলো strict requirement। ভুল region বা ভুল service choose করলে compliance issue হতে পারে।

**৪. Cost surprise**

Cloud easy to create, তাই unused resource, data transfer, oversized database, logging cost, NAT gateway cost ইত্যাদি থেকে bill হঠাৎ বেড়ে যেতে পারে।

**৫. Availability dependency**

Cloud provider outage হলে আপনার system impact হতে পারে। তাই multi-AZ, backup, disaster recovery, fallback plan দরকার।

**৬. Skill gap**

Cloud শুধু server rent না; networking, IAM, monitoring, automation, cost, security - সব বোঝা লাগে। Team প্রস্তুত না হলে architecture messy হয়ে যায়।

Interview-ready line:

> Cloud adoption brings speed and scalability, but risks include vendor lock-in, misconfiguration, compliance constraints, unexpected costs, provider dependency, and the need for strong cloud expertise.

---

## 2. What is the difference between IaaS, PaaS, SaaS, and FaaS?

Cloud service model বোঝার সবচেয়ে সহজ উপায় হলো: **কে কী manage করছে**।

Cloud stack roughly এমন:

```text
Application
Data
Runtime
Middleware
Operating System
Virtualization
Servers
Storage
Networking
Data Center
```

প্রতিটি model-এ customer এবং provider-এর দায়িত্ব আলাদা।

| Model | Full Form | আপনি কী পান | Example |
| :--- | :--- | :--- | :--- |
| **IaaS** | Infrastructure as a Service | VM, storage, network | AWS EC2, Azure VM, Google Compute Engine |
| **PaaS** | Platform as a Service | App run করার managed platform | Heroku, Google App Engine, AWS Elastic Beanstalk |
| **SaaS** | Software as a Service | Ready-to-use software | Gmail, Slack, Salesforce |
| **FaaS** | Function as a Service | Event-based function execution | AWS Lambda, Azure Functions, Cloud Functions |

**IaaS**-এ আপনি বেশি control পান। VM-এর OS, packages, runtime, deployment, scaling অনেক কিছু নিজেরা manage করেন।

**PaaS**-এ infrastructure নিয়ে কম চিন্তা করতে হয়। আপনি code deploy করেন, platform runtime, scaling, OS অনেক কিছু handle করে।

**SaaS**-এ আপনি software ব্যবহার করেন। Application build/manage করা আপনার কাজ না।

**FaaS**-এ আপনি ছোট function লিখেন, event trigger হলে function run হয়। Server provisioning বা runtime server manage করতে হয় না।

### What does the customer manage in each model - which gives the most control, and which needs the least operational work?

Responsibility split:

| Layer | IaaS | PaaS | SaaS | FaaS |
| :--- | :--- | :--- | :--- | :--- |
| Application code | Customer | Customer | Provider | Customer |
| Data | Customer | Customer | Customer/Provider | Customer |
| Runtime | Customer | Provider | Provider | Provider |
| OS patching | Customer | Provider | Provider | Provider |
| Server management | Provider | Provider | Provider | Provider |
| Scaling setup | Customer | Mostly provider/platform | Provider | Mostly automatic |

Control ranking:

```text
Most control        IaaS > PaaS > FaaS > SaaS        Least control
Most ops work       IaaS > PaaS > FaaS > SaaS        Least ops work
```

তবে nuance আছে: FaaS-এ server operation কম, কিন্তু function timeout, cold start, event retry, observability, concurrency এগুলো বুঝতে হয়।

### When would you choose one over another?

**IaaS choose করবেন যখন:**

- OS-level control দরকার
- Legacy application migrate করতে হচ্ছে
- Custom networking/security setup দরকার
- Specific software install/configure করতে হবে

Example: পুরনো monolithic app EC2 VM-এ run করা।

**PaaS choose করবেন যখন:**

- Fast deployment দরকার
- Infrastructure manage করতে চান না
- Standard web app/API run করবেন
- Team ছোট, operations কম রাখতে চান

Example: Node.js API managed platform-এ deploy করা।

**SaaS choose করবেন যখন:**

- Business problem solve করতে ready-made software যথেষ্ট
- নিজে software build/host করতে চান না
- Email, CRM, chat, analytics এর মতো commodity tool দরকার

Example: নিজের email server না বানিয়ে Google Workspace ব্যবহার করা।

**FaaS choose করবেন যখন:**

- Event-driven workload
- Infrequent বা bursty traffic
- Background task, image processing, webhook handling
- Server idle cost avoid করতে চান

Example:

```text
User image uploads to object storage
Upload event triggers function
Function resizes image and saves thumbnail
```

Interview shortcut:

> Choose IaaS for control, PaaS for developer productivity, SaaS for ready business software, and FaaS for event-driven serverless tasks.

---

## 3. What is the difference between public, private, hybrid, and multi-cloud?

Cloud deployment model বলে infrastructure কোথায় এবং কীভাবে run হচ্ছে।

| Model | Meaning | Example |
| :--- | :--- | :--- |
| **Public cloud** | Third-party provider-এর shared cloud infrastructure | AWS, Azure, Google Cloud |
| **Private cloud** | Single organization-এর dedicated cloud-like infrastructure | Company-owned VMware/OpenStack environment |
| **Hybrid cloud** | On-prem/private + public cloud connected together | Data center + AWS |
| **Multi-cloud** | একাধিক public cloud provider ব্যবহার | AWS + Azure + Google Cloud |

**Public cloud** সবচেয়ে common। এখানে provider infrastructure own করে, customer logical resource use করে।

**Private cloud** সাধারণত strict security/compliance বা legacy constraint-এর জন্য use হয়। Infrastructure dedicated থাকে, কিন্তু cloud-like automation থাকতে পারে।

**Hybrid cloud** তখন হয় যখন company-এর কিছু workload on-premise/private cloud-এ থাকে এবং কিছু workload public cloud-এ থাকে।

**Multi-cloud** মানে একাধিক public cloud provider intentionally use করা। যেমন application AWS-এ, analytics Google Cloud-এ, identity Azure-এ।

### Why are hybrid and multi-cloud not the same thing?

Hybrid cloud এবং multi-cloud দেখতে similar মনে হলেও concept আলাদা।

**Hybrid cloud** = private/on-premise environment + public cloud।

```text
Company data center + AWS
```

**Multi-cloud** = multiple public cloud providers।

```text
AWS + Azure
AWS + Google Cloud
Azure + Google Cloud
```

একটা architecture একইসাথে hybrid এবং multi-cloud হতে পারে।

Example:

```text
On-prem data center + AWS + Azure
```

এখানে on-prem + public cloud আছে, তাই hybrid। আবার AWS + Azure আছে, তাই multi-cloud।

### What are the operational challenges of multi-cloud?

Multi-cloud-এর benefit হলো flexibility, vendor risk reduction, best-of-breed service use করা। কিন্তু operation কঠিন হয়ে যায়।

Major challenges:

1. **Different IAM model**

AWS IAM, Azure Entra ID/RBAC, Google IAM - সবগুলোর permission model আলাদা।

2. **Networking complexity**

VPC/VNet, private connectivity, DNS, routing, firewall rules, VPN/interconnect - সব cloud-এ আলাদা concept এবং tooling।

3. **Monitoring and logging fragmentation**

প্রতি cloud-এর নিজস্ব monitoring tool থাকে। Unified observability না করলে incident debug করা কঠিন।

4. **Cost visibility**

Billing model, discount plan, egress charge, managed service price - cloud ভেদে আলাদা। Central cost governance দরকার।

5. **Skill requirement**

Team-কে একাধিক platform deeply বুঝতে হয়। Surface-level knowledge দিয়ে production multi-cloud safe না।

6. **Data transfer and latency**

Cloud-to-cloud data movement expensive এবং latency-sensitive হতে পারে।

Interview line:

> Multi-cloud reduces dependency on one provider, but increases operational complexity across IAM, networking, observability, cost management, automation, and team skill requirements.

---

## 4. What are Regions and Availability Zones?

**Region** হলো cloud provider-এর একটি geographic area, যেমন `us-east-1`, `ap-south-1`, `eu-west-1`। প্রতিটি region সাধারণত আলাদা city/area/country-level location represent করে।

**Availability Zone (AZ)** হলো একই region-এর ভিতরে physically separate data center বা data center cluster। প্রতিটি AZ-এর power, cooling, networking আলাদা থাকে, যাতে এক AZ fail করলেও অন্য AZ চালু থাকতে পারে।

Structure:

```text
Region: us-east-1
  AZ-1: us-east-1a
  AZ-2: us-east-1b
  AZ-3: us-east-1c
```

Region বড় geographic boundary। AZ হলো সেই region-এর ভিতরের isolated failure zone।

### Why should production systems span multiple AZs?

Production system single AZ-এ রাখলে সেই AZ-এর issue হলেই application down হতে পারে। Multi-AZ design করলে system বেশি available হয়।

Example architecture:

```text
Load Balancer
  -> App Server in AZ-1
  -> App Server in AZ-2
  -> App Server in AZ-3

Database
  -> Primary in AZ-1
  -> Standby/Replica in AZ-2
```

Multi-AZ benefits:

- AZ outage হলেও traffic অন্য AZ-এ route করা যায়
- Maintenance বা hardware failure-এর impact কমে
- Load distribution ভালো হয়
- Database failover possible হয়
- SLA improve হয়

কিন্তু শুধু multi-AZ করলেই সব problem solve হয় না। Application stateless হওয়া, shared session strategy, database failover, health check, retry logic - এগুলোও ঠিক থাকতে হবে।

### How does region selection affect latency/compliance?

Region selection দুইটা বড় জিনিসে impact করে: **latency** এবং **compliance**।

**Latency**

User-এর কাছাকাছি region choose করলে request round-trip time কম হয়। Bangladesh/India user-এর জন্য Singapore বা Mumbai region অনেক সময় US region-এর চেয়ে faster হবে।

Example:

```text
User in Dhaka -> Singapore/Mumbai region: lower latency
User in Dhaka -> US East region: higher latency
```

**Compliance and data residency**

অনেক business বা law বলে data নির্দিষ্ট country/region-এর মধ্যে রাখতে হবে। যেমন healthcare, banking, government, EU user data ইত্যাদিতে data residency requirement থাকতে পারে।

Region choose করার সময় consider করবেন:

- User কোথায়
- Data কোথায় legally store করা যাবে
- কোন services সেই region-এ available
- Cost কেমন
- Disaster recovery-এর জন্য second region কোথায় হবে
- Existing network বা partner system কোথায় আছে

Interview answer:

> Region selection affects user latency, legal compliance, service availability, cost, and disaster recovery design. Usually we choose a region close to users while respecting data residency and business requirements.

---

## 5. What is the Shared Responsibility Model?

**Shared Responsibility Model** হলো cloud security and operations-এর responsibility split: cloud provider কিছু জিনিস manage করে, customer কিছু জিনিস manage করে।

Cloud provider সাধারণত responsible for **security of the cloud**।

Customer responsible for **security in the cloud**।

মানে provider data center, physical server, power, networking backbone, virtualization layer secure রাখে। Customer responsible থাকে নিজের data, identity, access policy, application security, network rules, encryption configuration ইত্যাদির জন্য।

Basic split:

| Responsibility | Cloud Provider | Customer |
| :--- | :--- | :--- |
| Physical data center | Yes | No |
| Power/cooling/hardware | Yes | No |
| Global network infrastructure | Yes | No |
| Virtualization layer | Usually yes | No |
| OS patching | Depends on service | Depends on service |
| Application code | No | Yes |
| Data classification | No | Yes |
| IAM permissions | No | Yes |
| Encryption configuration | Provides tools | Customer configures |
| Network access rules | Provides tools | Customer configures |

Common interview example:

```text
Cloud provider gives a secure storage service.
Customer accidentally makes the bucket public.
Data leak happens.
In most cases, that misconfiguration is customer's responsibility.
```

### How does the split of responsibility change across IaaS vs. PaaS vs. SaaS?

যত managed service বেশি হয়, provider তত বেশি layer manage করে। কিন্তু customer-এর data, identity, access, configuration responsibility থেকে যায়।

**IaaS**

IaaS-এ provider hardware, data center, virtualization manage করে। Customer VM-এর OS, patching, firewall, runtime, application, data manage করে।

Example:

```text
EC2 VM:
Provider: data center, physical server, hypervisor
Customer: OS patch, SSH access, app code, database config, security group
```

**PaaS**

PaaS-এ provider OS, runtime, scaling platform অনেক কিছু manage করে। Customer mainly application code, data, config, access control manage করে।

Example:

```text
Managed app platform:
Provider: OS, runtime, platform scaling
Customer: code, env vars, secrets, IAM, data
```

**SaaS**

SaaS-এ provider পুরো application manage করে। Customer user access, data usage, configuration, compliance process manage করে।

Example:

```text
Google Workspace / Salesforce:
Provider: application, infrastructure, updates
Customer: users, roles, data sharing, MFA policy
```

Short rule:

```text
IaaS: customer manages most
PaaS: customer manages app and data
SaaS: customer manages usage, users, and data governance
```

> Important: Cloud provider অনেক security feature দেয়, কিন্তু ভুল IAM policy, exposed secrets, public database, weak password - এগুলো customer-side risk।

---

## 6. What is cloud elasticity and auto-scaling, and how does elasticity differ from scalability?

**Cloud elasticity** হলো workload demand অনুযায়ী resource automatically বা quickly বাড়ানো-কমানোর ক্ষমতা।

Example:

```text
Traffic suddenly increases -> more servers start
Traffic decreases -> extra servers terminate
```

**Auto-scaling** হলো সেই mechanism যেটা metrics বা schedule দেখে resource count বাড়ায়/কমানায়।

Example:

```text
CPU > 70% for 5 minutes -> add 2 instances
CPU < 30% for 10 minutes -> remove 1 instance
```

**Scalability** এবং **elasticity** close concept হলেও একই না।

| Concept | Meaning |
| :--- | :--- |
| **Scalability** | System বড় workload handle করতে পারে কিনা |
| **Elasticity** | Workload change অনুযায়ী resource quickly adjust করতে পারে কিনা |

Scalability capacity-এর ব্যাপার। Elasticity dynamic adjustment-এর ব্যাপার।

Example:

```text
Scalable system: 10x traffic handle করার design আছে
Elastic system: traffic বাড়লে automatically resource বাড়ায়, কমলে resource কমায়
```

একটা system scalable হতে পারে কিন্তু elastic না। যেমন manually server add করতে হয়। আবার cloud-native system সাধারণত scalable এবং elastic দুইটাই হওয়া উচিত।

### What's the difference between horizontal and vertical scaling (scale-out vs. scale-in)?

Scaling দুইভাবে করা যায়:

**Vertical scaling** মানে same machine-কে বড় করা।

```text
2 CPU, 4 GB RAM -> 8 CPU, 32 GB RAM
```

এটাকে **scale-up** বলা হয়। আবার resource কমালে **scale-down**।

Pros:

- Simple
- Application change কম লাগে
- Database server-এর ক্ষেত্রে অনেক সময় useful

Cons:

- Hardware limit আছে
- Downtime লাগতে পারে
- Single machine failure risk থাকে
- Cost high হতে পারে

**Horizontal scaling** মানে machine সংখ্যা বাড়ানো।

```text
2 servers -> 5 servers -> 20 servers
```

এটাকে **scale-out** বলা হয়। Server কমালে **scale-in**।

Pros:

- High availability ভালো
- Traffic multiple instance-এ distribute করা যায়
- Cloud auto-scaling-এর জন্য ideal
- Failure impact কম

Cons:

- Application stateless হতে হয় বা session externalize করতে হয়
- Load balancer দরকার
- Distributed system complexity আসে
- Database consistency/design challenge হতে পারে

Interview shortcut:

> Vertical scaling makes one server bigger; horizontal scaling adds more servers. Cloud systems usually prefer horizontal scaling because it improves availability and elasticity.

### What metrics typically trigger auto-scaling?

Auto-scaling সাধারণত monitoring metrics দেখে decision নেয়। Metric workload type অনুযায়ী choose করতে হয়।

Common metrics:

| Metric | কখন useful |
| :--- | :--- |
| **CPU utilization** | CPU-heavy backend/API |
| **Memory utilization** | Memory-heavy app, cache, worker |
| **Request count** | Web/API traffic |
| **Average response time / latency** | User-facing service |
| **Queue length** | Background worker scaling |
| **Messages per consumer** | Event-driven architecture |
| **Network throughput** | Streaming/proxy/data-heavy workload |
| **Custom business metric** | Orders per minute, active sessions, jobs pending |

Example policy:

```text
If average CPU > 70% for 5 minutes:
  add instances

If average CPU < 30% for 10 minutes:
  remove instances
```

Queue-based worker example:

```text
Queue has 10,000 pending jobs -> add workers
Queue becomes empty -> reduce workers
```

Good auto-scaling design-এ শুধু scale-out না, scale-in-ও carefully করতে হয়। না হলে running request kill হতে পারে বা cost unnecessarily high থাকে।

Best practices:

- Proper health check configure করা
- Cooldown period রাখা
- Minimum and maximum capacity set করা
- Stateless application design করা
- Logs/metrics দিয়ে scaling behavior observe করা
- Sudden traffic spike-এর জন্য buffer রাখা

Interview-ready final line:

> Auto-scaling is usually triggered by CPU, memory, request rate, latency, queue depth, or custom metrics. The right metric depends on what actually represents load for that application.
