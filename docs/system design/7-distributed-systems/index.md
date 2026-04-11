---
sidebar_position: 1
title: ''
---


## 42. What are the fallacies of distributed computing?

**The 8 Fallacies of Distributed Computing** হলো সেই ভুল ধারণাগুলো যা নতুন বা অনভিজ্ঞ ডেভেলপাররা distributed system design করার সময় করে থাকেন।

| # | Fallacy (ভুল ধারণা) | বাস্তব সত্য |
|---|---|---|
| 1 | The network is reliable | নেটওয়ার্ক যেকোনো সময় fail করতে পারে |
| 2 | Latency is zero | Network call সবসময় delay আনে |
| 3 | Bandwidth is infinite | Bandwidth সীমিত এবং দামি |
| 4 | The network is secure | Attacks, eavesdropping সবসময় সম্ভব |
| 5 | Topology doesn't change | Server, node, IP পরিবর্তন হয় |
| 6 | There is one administrator | Multiple teams, multiple policies |
| 7 | Transport cost is zero | Serialization, network cost real |
| 8 | The network is homogeneous | বিভিন্ন OS, hardware, protocol |

### How does each fallacy affect system design decisions?
- **"Network is reliable":** Retry logic, timeout, circuit breaker implement করুন।
- **"Latency is zero":** Service call গুলো async করুন, batch করুন।
- **"Bandwidth is infinite":** Compression, efficient serialization (Protobuf) ব্যবহার করুন।
- **"Network is secure":** mTLS, encryption at rest and in transit।

### What is "the network is reliable" fallacy and how do you design around it?
- **সমস্যা:** Service A থেকে Service B কে synchronous call করলে B down থাকলে A ও fail।
- **ডিজাইন:**
  - **Timeout:** নির্দিষ্ট সময়ের মধ্যে response না এলে fail।
  - **Retry with exponential backoff।**
  - **Circuit Breaker:** বারবার fail হলে সাময়িক বন্ধ।
  - **Fallback response:** Cache বা default value দিন।

---

## 43. What is a distributed transaction and how do you handle it?

**Distributed Transaction:** একাধিক database বা microservice জুড়ে atomic operation করা।

- **উদাহরণ:** E-commerce order — Order DB তে save + Inventory DB থেকে deduct + Payment DB তে charge — তিনটিই হতে হবে otherwise rollback।

### What is the two-phase commit (2PC) protocol?
**Phase 1 (Prepare):** Coordinator সব participant কে বলে "তুমি কি commit করতে পারবে?"
- প্রতিটি participant YES বা NO বলে।

**Phase 2 (Commit/Rollback):**
- সবাই YES → Coordinator commit করতে বলে।
- যেকোনো একজন NO → Coordinator abort করতে বলে।

**সমস্যা:**
- Coordinator crash হলে participants blocked থাকে।
- Slow — দুই round trip।
- Scalability নেই।

### What is the SAGA pattern and how does it compare to 2PC?
**SAGA** হলো long-running transaction কে ছোট local transaction এ ভাগ করা, প্রতিটির জন্য **compensating transaction** রাখা।

```
Order saga:
1. Create Order (local transaction)
2. Reserve Inventory → Fail হলে: Cancel Order
3. Charge Payment → Fail হলে: Release Inventory + Cancel Order
4. Ship Order → Fail হলে: Refund Payment + Release Inventory + Cancel Order
```

| বৈশিষ্ট্য | 2PC | SAGA |
|---|---|---|
| **Consistency** | Strong | Eventual |
| **Availability** | কম (locking) | বেশি |
| **Complexity** | কম (protocol built-in) | বেশি (compensating transactions) |
| **Best For** | Single DB distributed | Microservices |

---

## 44. What is the SAGA pattern in microservices?

### What is the difference between choreography and orchestration in SAGA?
| বৈশিষ্ট্য | Choreography | Orchestration |
|---|---|---|
| **নিয়ন্ত্রণ** | Event-driven — service নিজেই সিদ্ধান্ত নেয় | Central orchestrator সিদ্ধান্ত নেয় |
| **Coupling** | Loose coupling | Orchestrator সব জানে |
| **Visibility** | Flow track করা কঠিন | Central log — easy to trace |
| **Failure Handling** | জটিল | Orchestrator handle করে |
| **Tool** | Kafka events | Temporal, AWS Step Functions |

### How do you handle partial failures in a SAGA?
- **Compensating Transactions:** প্রতিটি step এর undo operation আগে থেকে লিখুন।
- **Idempotent operations:** Retry safe করুন।
- **Saga log:** কোথায় পৌঁছেছে track করুন — crash resume করতে।

---

## 45. What is leader election and why is it needed in distributed systems?

**Leader Election** হলো distributed system এ একটি node কে "leader" বানানো যে সমন্বয় করবে।

- **কেন দরকার?** দুটি node একই সময় write করলে conflict। একটি leader থাকলে শুধু সে লেখে।
- **Use cases:** Primary DB selection, job scheduler (শুধু একটি instance job চালায়), coordination।

### How does the Raft consensus algorithm work?
Raft তিনটি ভূমিকা: **Leader, Follower, Candidate**।

1. শুরুতে সব Follower।
2. Follower timeout এ কেউ leader heartbeat না পেলে Candidate হয়।
3. Candidate নিজেকে vote দেয়, অন্যদের কাছে vote চায়।
4. Majority vote পেলে Leader।
5. Leader client এর request নেয়, follower দের replicate করে।

### What happens during a split-brain scenario?
- **Split-brain:** Network partition এ দুটি node গ্রুপ নিজেদেরই leader মনে করে।
- **সমস্যা:** দুটি group আলাদা write করে — inconsistency।
- **সমাধান:** Quorum (majority) — leader হতে হলে majority node এর সাথে যোগাযোগ থাকতে হবে।

---

## 46. What is a distributed lock and how do you implement one?

**Distributed Lock:** একাধিক server/process এর মধ্যে shared resource এর exclusive access নিশ্চিত করা।

### What is the Redlock algorithm for distributed locking with Redis?
- **Single Redis:** Simple কিন্তু Redis down হলে lock হারায়।
- **Redlock:** ৫টি স্বাধীন Redis node এ lock নেওয়া।
  1. সব ৫ node এ lock নেওয়ার চেষ্টা।
  2. Majority (৩টি) থেকে lock পেলে সফল।
  3. Lock timeout এর মধ্যে operation করতে হবে।
  4. শেষে সব node থেকে lock release।

### What are the risks of distributed locks?
- **Clock skew:** Server গুলোর ঘড়ি ভিন্ন থাকলে lock আগে expire হতে পারে।
- **Long GC pause:** Java GC lock থাকাকালীন পুরো process থামিয়ে দিলে lock expire হতে পারে।
- **Network delay:** Operation lock expire হওয়ার পরেও চলতে পারে।

### When should you use optimistic locking instead of a distributed lock?
- **Optimistic Locking:** Version number বা timestamp দিয়ে conflict detect।
  ```sql
  UPDATE products SET stock=stock-1, version=version+1
  WHERE id=1 AND version=5  -- version মেলে না? Update fail।
  ```
- **ব্যবহার করুন:** Low conflict scenario (বেশিরভাগ সময় conflict হয় না)।
- **Distributed lock:** High conflict বা critical section (payment, inventory)।

---

## 47. How do you design a system for fault tolerance and high availability?

### What is the difference between fault tolerance and high availability?
| বৈশিষ্ট্য | Fault Tolerance | High Availability |
|---|---|---|
| **লক্ষ্য** | Failure সত্ত্বেও সম্পূর্ণ কাজ করা | Downtime minimize করা |
| **পদ্ধতি** | Redundancy, no single point of failure | Fast failover, quick recovery |
| **উদাহরণ** | RAID — disk fail হলেও data নেই | Active-passive DB — primary fail হলে replica নেয় |
| **Cost** | বেশি (সব duplicate করতে হয়) | মাঝারি |

### What is a circuit breaker pattern?
**Circuit Breaker** তিনটি state এ থাকে:

```
Closed (Normal) → request pass হয়
    ↓ N বার fail হলে
Open (Broken) → request আর পাঠানো হয় না, fast fail
    ↓ Timeout পরে
Half-Open (Testing) → কিছু request পাঠাই, সফল হলে
    ↓ সফল হলে
Closed (Normal)
```

### What is the retry pattern and what are its risks?
- **Retry:** Temporary failure এ automatic retry।
- **Risk:** Retry storm — সব client একসাথে retry করলে server আরও overloaded।
- **সমাধান:** Exponential backoff + random jitter।

```python
import time, random

def retry_with_backoff(fn, max_retries=5):
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception:
            wait = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait)
```

### What is bulkhead isolation?
- জাহাজের bulkhead (জলরোধী বিভাজন) থেকে নাম।
- System কে isolated compartment এ ভাগ করুন — একটি compartment fail হলে বাকি চলে।
- **Thread Pool Isolation:** প্রতিটি service call এর জন্য আলাদা thread pool। একটি service slow হলে অন্যগুলো ব্লক হবে না।

---

## 48. What is the two generals problem and what does it illustrate?

**Two Generals Problem:** দুটি সেনাবাহিনী একে অপরকে confirm message পাঠাচ্ছে unreliable নেটওয়ার্কে — কিন্তু কেউ কখনো ১০০% নিশ্চিত হতে পারে না যে অপরজন message পেয়েছে কিনা।

### Why can you not guarantee consensus in an unreliable network?
- General A → message পাঠায় → lost হতে পারে।
- General B → acknowledgment পাঠায় → সেটিও lost হতে পারে।
- কতটি ack পাঠালেও last ack এর lost হওয়ার সম্ভাবনা থাকে।
- **Mathematical proof:** Unreliable channel এ perfect consensus impossible।

### How does this relate to real-world distributed systems?
- TCP handshake ঠিক এই সমস্যাটি মোকাবেলা করে — কিন্তু guarantee দেয় না, probability কমায়।
- **Practical solution:** Idempotency + Retry + Timeout। Perfect guarantee ছাড়াই practical system বানানো হয়।

### What is the Byzantine Generals Problem?
- Two Generals এর extension — কিছু generals traitor (malicious node)।
- **Byzantine Fault Tolerance (BFT):** Malicious node সত্ত্বেও consensus।
- **ব্যবহার:** Blockchain (Bitcoin, Ethereum)।
- Normal distributed systems এ BFT দরকার নেই — crash fault tolerance যথেষ্ট।
