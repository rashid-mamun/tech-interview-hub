---
sidebar_position: 1
title: ''
---

## 1. How do you approach a system design interview question?

System Design ইন্টারভিউয়ে একটি ওপেন-এন্ডেড প্রশ্ন দেওয়া হয় এবং দেখা হয় আপনি কীভাবে বড় এবং জটিল সমস্যাকে ছোট ছোট অংশে ভেঙে সমাধান করেন। আমরা সাধারণত নিচের ধাপগুলো অনুসরণ করি:

1. **Clarify Requirements (প্রয়োজনীয়তা নির্ধারণ):** প্রথমেই ইন্টারভিউয়ারকে প্রশ্ন করুন। ফিচার কী কী হবে? ইউজার সংখ্যা কত? কী কী ধরনের ডিভাইস থেকে অ্যাক্সেস হবে?
2. **Estimate Scale (স্কেল অনুমান):** DAU (Daily Active Users), RPS (Requests Per Second), স্টোরেজ — এগুলো মোটামুটি হিসাব করুন।
3. **High-Level Design (সামগ্রিক ডিজাইন):** প্রথমে একটি সাধারণ ডায়াগ্রাম আঁকুন — ক্লায়েন্ট, লোড ব্যালেন্সার, সার্ভার, ডাটাবেস।
4. **Deep Dive (গভীরে যান):** ইন্টারভিউয়ার যে অংশে বেশি আগ্রহী সেটা নিয়ে বিস্তারিত বলুন।
5. **Discuss Trade-offs (ট্রেড-অফ আলোচনা করুন):** কেন এই ডিজাইন বেছে নিয়েছেন এবং বিকল্পগুলো কী ছিল তা ব্যাখ্যা করুন।

### What are the steps you follow when given an open-ended design problem?
- প্রথম ৫ মিনিট: প্রশ্ন জিজ্ঞেস করুন, ধরে নেবেন না।
- পরের ১০ মিনিট: High-level API/Data model আঁকুন।
- পরের ১৫ মিনিট: প্রতিটি কম্পোনেন্ট বিস্তারিত ব্যাখ্যা করুন।
- শেষ ৫ মিনিট: Bottleneck, monitoring, failure case নিয়ে আলোচনা।

### How do you handle ambiguity in requirements during a design interview?
অস্পষ্টতা দূর করতে নির্দিষ্ট প্রশ্ন জিজ্ঞেস করুন:
- "এটা কি শুধু ওয়েব অ্যাপের জন্য, নাকি মোবাইলেও চলবে?"
- "ইউজার কি নিজে ডাটা আপলোড করবে, নাকি সার্ভার জেনারেট করবে?"
- "রিড বেশি গুরুত্বপূর্ণ নাকি রাইট?"

### How do you prioritize features when you cannot build everything?
**MoSCoW Method** ব্যবহার করুন:
- **Must Have:** সিস্টেম কাজ করার জন্য যা অপরিহার্য।
- **Should Have:** গুরুত্বপূর্ণ কিন্তু সিস্টেম এটা ছাড়াও চলবে।
- **Could Have:** থাকলে ভালো কিন্তু এখনই দরকার নেই।
- **Won't Have:** এটা এখন করব না, পরে হবে।

---

## 2. How do you gather and clarify requirements for a system?

System requirements দুই ধরনের হয়:

- **Functional Requirements (কার্যকরী প্রয়োজনীয়তা):** সিস্টেম কী করবে? যেমন: ইউজার লগইন করতে পারবে, পোস্ট তৈরি করতে পারবে।
- **Non-Functional Requirements (অ-কার্যকরী প্রয়োজনীয়তা):** সিস্টেম কতটা ভালোভাবে করবে? যেমন: 99.9% আপটাইম, 200ms এর কম রেসপন্স টাইম।

### What is the difference between functional and non-functional requirements?
| বৈশিষ্ট্য | Functional | Non-Functional |
|---|---|---|
| **প্রধান প্রশ্ন** | সিস্টেম কী করবে? | সিস্টেম কতটা ভালো করবে? |
| **উদাহরণ** | ইউজার পাসওয়ার্ড রিসেট করতে পারবে | পাসওয়ার্ড রিসেট ৩ সেকেন্ডের মধ্যে হবে |
| **পরিমাপ করা যায়?** | হ্যাঁ/না দিয়ে যাচাই করা যায় | সংখ্যা বা মেট্রিক দিয়ে পরিমাপ করতে হয় |

### How do you estimate scale and traffic requirements from scratch?
ইন্টারভিউতে সাধারণত এভাবে হিসাব করা হয়:
- **DAU (Daily Active Users) → RPS:** `DAU × Average actions per day ÷ 86,400 seconds`
- **উদাহরণ:** ১ মিলিয়ন DAU, প্রতিজন ১০ বার অ্যাকশন → `10,000,000 ÷ 86,400 ≈ 116 RPS`
- হঠাৎ ট্রাফিক পিক মোকাবেলায় সাধারণত ৫-১০x বাফার যোগ করুন।

### What questions do you ask to determine read-heavy vs write-heavy workloads?
- "ইউজার কি প্রতিদিন পোস্ট করবে, নাকি শুধু পড়বে?"
- "নিউজফিড কি ব্যবহারকারী প্রতিবার রিফ্রেশ করে দেখবে নাকি পুশ নোটিফিকেশন আসবে?"
- Read-heavy সিস্টেমে **Read Replica, Caching** বেশি কাজে লাগে।
- Write-heavy সিস্টেমে **Write-ahead Logging, Sharding** বেশি গুরুত্বপূর্ণ।

---

## 3. How do you estimate scale — users, requests per second, storage?

**Back-of-the-envelope (মোটামুটি হিসাব)** হচ্ছে সিস্টেম ডিজাইন ইন্টারভিউর অন্যতম গুরুত্বপূর্ণ দক্ষতা।

### How do you calculate requests per second from daily active users (DAU)?
```
RPS = (DAU × Requests per user per day) / 86,400

উদাহরণ: Twitter-এর মতো সিস্টেম
- DAU: 100 million
- Average requests per user: 20 (timeline, tweet, like, etc.)
- RPS = 100,000,000 × 20 / 86,400 ≈ 23,148 RPS
- Peak RPS (3x average) ≈ 70,000 RPS
```

### How do you estimate storage needs for a system like Instagram?
```
Instagram-এর মতো ফটো শেয়ারিং সিস্টেম:
- ১ মিলিয়ন নতুন ছবি প্রতিদিন
- গড় ছবির সাইজ: 200KB (compressed)
- Daily storage: 1,000,000 × 200KB = 200 GB/day
- 10 বছরের জন্য: 200 GB × 365 × 10 ≈ 730 TB
- (thumbnail + metadata যোগ করলে ~1 PB)
```

### What is back-of-the-envelope calculation and how do you practice it?
এটি হলো দ্রুত এবং মোটামুটি নির্ভুল আনুমানিক হিসাব করার পদ্ধতি।
- গুরুত্বপূর্ণ সংখ্যাগুলো মুখস্থ রাখুন: `1 day = 86,400s`, `1 million = 10^6`, `1 GB = 10^9 bytes`
- নিজে নিজে প্র্যাকটিস করুন: "WhatsApp ডিজাইন করো" — নিজেই হিসাব করুন RPS, Storage, Bandwidth।

---

## 4. What are the key trade-offs to consider in any system design?

System design এ কোনো "perfect" সমাধান নেই। সবসময় কিছু না কিছু ছাড় দিতে হয়।

| Trade-off | একদিকে পেলে | অন্যদিকে হারাবেন |
|---|---|---|
| **Consistency vs Availability** | সব ডাটা সবসময় সঠিক থাকবে | নেটওয়ার্ক partition এ সার্ভিস বন্ধ হবে |
| **Latency vs Throughput** | দ্রুত রেসপন্স পাবেন | একসাথে কম রিকোয়েস্ট প্রসেস হবে |
| **Read Performance vs Write Performance** | Read ক্যাশ করলে রিড ফাস্ট হয় | কিন্তু ক্যাশ ইনভ্যালিডেশন জটিল হয় |
| **SQL vs NoSQL** | SQL = ACID গ্যারান্টি | NoSQL = Horizontal scaling সহজ |

### How do you decide between consistency and availability?
**CAP Theorem** অনুযায়ী — নেটওয়ার্ক partition হলে আপনাকে বেছে নিতে হবে:
- **Consistency:** ব্যাংক ট্র্যান্জেকশন, ইনভেন্টরি ম্যানেজমেন্ট।
- **Availability:** সোশ্যাল মিডিয়া ফিড, লাইক কাউন্ট।

### When do you trade latency for throughput?
- **Low Latency দরকার:** Gaming, Video call, Trading system।
- **High Throughput দরকার:** Batch processing (ETL), Log aggregation।

### How do you evaluate build vs buy decisions?
- **Build করবেন** যদি: কাস্টম requirement থাকে বা vendor lock-in থেকে বাঁচতে চান।
- **Buy/Use করবেন** যদি: সমস্যাটি common এবং মার্কেটে ভালো সলিউশন ইতিমধ্যে আছে।

---

## 5. How do you define SLAs, SLOs, and SLIs for a system?

এই তিনটি টার্ম একসাথে কাজ করে একটি সিস্টেমের মান নির্ধারণ করতে:

| টার্ম | পূর্ণ নাম | সংজ্ঞা |
|---|---|---|
| **SLI** | Service Level Indicator | একটি পরিমাপযোগ্য মেট্রিক। যেমন: গত ১ ঘণ্টায় রেসপন্স টাইম। |
| **SLO** | Service Level Objective | SLI-এর জন্য নির্ধারিত লক্ষ্যমাত্রা। যেমন: ৯৯% রিকোয়েস্ট ২০০ms-এর মধ্যে। |
| **SLA** | Service Level Agreement | গ্রাহকের সাথে আইনগত চুক্তি। SLO না মানলে কী হবে (ক্ষতিপূরণ) তা থাকে। |

### What is the difference between SLA, SLO, and SLI?
- **SLI** হলো পরিমাপ (what we measure)।
- **SLO** হলো লক্ষ্য (what we aim for internally)।
- **SLA** হলো প্রতিশ্রুতি (what we promise to customers, with consequences)।

### How do you set a realistic uptime SLA (e.g., 99.9% vs 99.99%)?
| Uptime | Allowed Downtime / Year | Allowed Downtime / Month |
|---|---|---|
| **99%** | ~3.65 দিন | ~7.2 ঘণ্টা |
| **99.9%** | ~8.7 ঘণ্টা | ~43.8 মিনিট |
| **99.99%** | ~52.6 মিনিট | ~4.4 মিনিট |
| **99.999% (Five 9s)** | ~5.26 মিনিট | ~26 সেকেন্ড |

### What does 99.99% availability mean in terms of downtime per year?
- এর মানে বছরে মাত্র **৫২.৬ মিনিট** ডাউনটাইম সহ্য করা যাবে।
- এই লেভেলের SLA পূরণ করতে হলে **active-active multi-region deployment**, **automatic failover**, এবং **zero-downtime deployments** বাধ্যতামূলক।
