---
sidebar_position: 1
title: ''
---



## 91. What is the difference between IaaS, PaaS, and SaaS?

| | IaaS | PaaS | SaaS |
|---|---|---|---|
| **পূর্ণ নাম** | Infrastructure as a Service | Platform as a Service | Software as a Service |
| **কে manage করে** | আপনি OS, App manage করেন | আপনি শুধু App manage করেন | সব vendor করে |
| **উদাহরণ** | AWS EC2, Azure VM | Heroku, AWS Elastic Beanstalk | Gmail, Salesforce, Slack |
| **Flexibility** | সর্বোচ্চ | মধ্যম | সর্বনিম্ন |
| **Ops বোঝা** | বেশি লাগে | কম লাগে | প্রায় নেই |

### What are examples of each?
- **IaaS:** AWS EC2 (VM), S3 (Storage), VPC (Network)।
- **PaaS:** Google App Engine, AWS Elastic Beanstalk, Azure App Service।
- **SaaS:** Google Workspace, Salesforce CRM, GitHub, Datadog।

### When would you choose PaaS over IaaS?
- Developer productivity বেশি গুরুত্বপূর্ণ — infrastructure management এ সময় নষ্ট করতে চান না।
- Startup এ দ্রুত product ship করতে।
- Ops expertise কম — PaaS scaling, patching নিজে করে।

### What is FaaS (Function as a Service) and how does serverless fit in?
- **FaaS:** Code deploy করুন, execution এর জন্য pay করুন — server manage করতে হয় না।
- **Serverless:** Event-driven, auto-scale, pay-per-use।
- **উদাহরণ:** AWS Lambda, Google Cloud Functions, Azure Functions।

---

## 92. What is serverless computing and when is it appropriate?

**Serverless** মানে server নেই তা নয় — server আছে, কিন্তু vendor manage করে। আপনি শুধু code push করুন।

```
Traditional: Server 24/7 চলছে, ট্রাফিক নেই তবুও pay
Serverless:  Request এলে → Function start → Execute → Stop → Pay for execution time only
```

### What is the cold start problem and how do you mitigate it?
- **Cold start:** Lambda function কিছুক্ষণ না চললে shutdown হয়। পরের request এ আবার initialize।
- Initialization time: JVM (Java) > Node.js/Python।
- **First request slow:** কয়েকশো ms থেকে কয়েক সেকেন্ড।

**Mitigation:**
- **Provisioned Concurrency (AWS Lambda):** আগে থেকেই কিছু instance warm রাখুন।
- **Scheduled warm-up:** প্রতি ৫ মিনিটে dummy request পাঠান।
- **Lightweight runtime:** Java বদলে Go বা Node.js — কম cold start।

### What are the cost implications of serverless vs always-on servers?
- **Serverless সস্তা যখন:** Traffic irregular, intermittent — 24/7 server চালানোর দরকার নেই।
- **Serverless দামি যখন:** High, consistent traffic — request প্রতি pay করলে EC2 এর চেয়ে বেশি হয়।

### What types of workloads are a poor fit for serverless?
- **Long-running:** Lambda timeout 15 min — ঘণ্টার task সম্ভব নয়।
- **Stateful:** Lambda stateless — in-memory state নেই।
- **High throughput বিশেষ resource:** GPU computation।
- **Tight low-latency:** Cold start সহনীয় নয় (trading system)।

---

## 93. What is a VPC and how do you design network security with it?

**VPC (Virtual Private Cloud):** Cloud এ আপনার private, isolated network।

```
┌─────────────────── VPC (10.0.0.0/16) ─────────────────────┐
│                                                             │
│  ┌──── Public Subnet ─────┐   ┌──── Private Subnet ────┐  │
│  │  (10.0.1.0/24)         │   │  (10.0.2.0/24)         │  │
│  │  Load Balancer         │   │  Application Servers   │  │
│  │  Bastion Host          │   │  Databases             │  │
│  └────────┬───────────────┘   └──────────┬─────────────┘  │
│           │                              │                  │
│     Internet Gateway              NAT Gateway              │
└───────────┼──────────────────────────────┼─────────────────┘
            │                              │
          Internet               (Private → Internet)
```

### What is the difference between a public subnet and a private subnet?
| | Public Subnet | Private Subnet |
|---|---|---|
| **Internet access** | সরাসরি Internet Gateway দিয়ে | NAT Gateway দিয়ে outbound শুধু |
| **কী রাখবেন** | Load Balancer, Bastion host | App servers, Databases |
| **Public IP** | আছে (optional) | নেই |

### What is a NAT gateway and when is it needed?
- **NAT (Network Address Translation) Gateway:** Private subnet এর server কে outbound internet access দেয়।
- Private DB server → software update, API call করতে পারে।
- Inbound internet থেকে DB server access করা যায় না।

### What is VPC peering and what are its limitations?
- দুটি VPC কে একে অপরের সাথে **directly** connect করা।
- **Cross-account, cross-region** peering সম্ভব।
- **Limitations:**
  - **Transitive peering নেই:** A↔B, B↔C হলেও A↔C সরাসরি communicate করতে পারবে না।
  - CIDR ranges overlap করলে peering সম্ভব নয়।
  - অনেক VPC থাকলে mesh complex — **AWS Transit Gateway** ব্যবহার করুন।

---

## 94. What is Infrastructure as Code (IaC) and why is it important?

**IaC:** Infrastructure (server, network, DB) code দিয়ে define করা — GUI বা manual এ নয়।

```hcl
# Terraform দিয়ে EC2 instance তৈরি:
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1d0"
  instance_type = "t3.medium"
  
  tags = {
    Name = "production-web-server"
  }
}
```

**সুবিধা:**
- **Version control:** Git এ infrastructure history।
- **Reproducible:** Same code দিয়ে staging ও production তৈরি।
- **Review:** Infrastructure change কে code review করা যায়।
- **Disaster recovery:** সব মুছে গেলেও code থেকে rebuild।

### What is the difference between Terraform and CloudFormation?
| বৈশিষ্ট্য | Terraform | CloudFormation |
|---|---|---|
| **Vendor** | HashiCorp (open source) | AWS (managed) |
| **Cloud support** | Multi-cloud (AWS, GCP, Azure) | AWS only |
| **Language** | HCL (HashiCorp Config Language) | YAML/JSON |
| **State** | Local বা remote state file | AWS manages |
| **Adoption** | Industry-wide popular | AWS-only shop |

### What is idempotency in the context of IaC?
- Terraform plan run করুন ১ বার বা ১০০ বার — result same।
- "Desired state" define করুন — Terraform নিজে বের করে কী পরিবর্তন দরকার।

### How do you manage secrets in IaC configurations?
- **কখনো hardcode করবেন না** API key, DB password।
- **Terraform:** `variable` + environment variable `TF_VAR_db_password`।
- **AWS Secrets Manager:** Terraform এ reference — `data "aws_secretsmanager_secret_version"`।
- **Vault:** IaC tool এ dynamic credentials।

---

## 95. How do you design a multi-region architecture?

Multi-region মানে একাধিক geographic location এ app চালানো।

**কেন:** Regional failure (AWS us-east-1 outage), latency reduction, data sovereignty।

### What is active-active vs active-passive multi-region deployment?
| | Active-Active | Active-Passive |
|---|---|---|
| **কীভাবে** | সব region traffic serve করে | Primary fail হলে Secondary নেয় |
| **Failover** | Automatic, seamless | কিছু downtime হতে পারে |
| **Cost** | বেশি (দুই region resource) | কম |
| **Data sync** | জটিল — conflict resolution | Simple — single source of truth |
| **Latency** | সর্বোচ্চ user experience | Normal latency |

### How do you handle data replication across regions?
- **Strong consistency across region:** Latency অনেক বেশি হবে (cross-region RTT 100ms+)।
- **Asynchronous replication:** Primary region এ write → async secondary এ propagate।
- **Conflict resolution:** Active-active এ same record দুই region এ update হলে? Last-write-wins বা custom merge।
- **Global database:** CockroachDB, Google Spanner — globally distributed, ACID।

### How do you handle DNS failover for multi-region deployments?
```
AWS Route 53 Health Check + Failover Routing:

Primary Record: app.example.com → us-east-1 ALB
  Health check: /health endpoint পর্যন্ত
  
Failover Record: app.example.com → eu-west-1 ALB
  Type: Secondary (activates when primary unhealthy)
```
- **TTL কম রাখুন:** DNS TTL 60s — failover দ্রুত হয়।
- **Geolocation routing:** User location অনুযায়ী closest region।

---

## 96. What is a content delivery network (CDN) and how do you integrate it into a system design?

**CDN (Content Delivery Network):** ব্যবহারকারীর কাছাকাছি edge server থেকে content serve করা — origin এ না গিয়ে।

```
Without CDN:
User (Dhaka) → Request → Origin Server (US) → 300ms

With CDN:
User (Dhaka) → CDN Edge (Singapore) → Cached Response → 20ms
```

### What types of content should be served from a CDN?
- **Static assets:** JS, CSS, Images, Fonts, Videos।
- **Dynamic content with edge caching:** API response যা সব user এর জন্য same (যেমন: trending posts)।
- **Video streaming:** HLS/DASH segments।
- **আIডিয়াল:** 80% request CDN থেকে → origin এ ২০% পৌঁছায়।

### How does a CDN reduce latency for a globally distributed user base?
- **Edge PoP (Point of Presence):** Cloudflare এর ২৮০+ edge location বিশ্বজুড়ে।
- **Geographic proximity:** Content user এর কাছে → network hop কম → latency কম।
- **Persistent connections:** Edge থেকে origin এ HTTP/2 connection pre-established।

### How do you handle CDN cache invalidation?
```
পদ্ধতি ১ — Cache Busting (সবচেয়ে reliable):
  old: /static/app.js
  new: /static/app.a3f9b2c.js  (content hash)
  Deploy করলে নতুন file URL — CDN কে কিছু বলতে হয় না।

পদ্ধতি ২ — API Purge:
  Cloudflare API: DELETE /zones/{zone_id}/purge_cache
  Body: {"files": ["https://example.com/api/trending"]}

পদ্ধতি ৩ — Surrogate Keys / Cache Tags:
  Response Header: Cache-Tag: product-123, category-electronics
  Purge by tag: সব product-123 cache একসাথে invalidate।
```

**Best Practice:** Static assets → content hash (never expire), API responses → short TTL + purge on update।
