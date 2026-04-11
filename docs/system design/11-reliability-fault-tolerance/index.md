---
sidebar_position: 1
title: ''
---


## 73. What is the circuit breaker pattern and how does it work?

**Circuit Breaker** হলো এমন একটি design pattern যা একটি failing service কে বারবার call করা থেকে বিরত রাখে এবং fast fail করে — cascade failure রোধ করতে।

### What are the three states of a circuit breaker (closed, open, half-open)?

```
            ┌─────────────────────────────────────────────┐
            │                                             │
    ┌────── CLOSED ──────┐              ┌──── HALF-OPEN ──┘
    │   (Normal mode)    │  N failures  │   (Testing mode)
    │  Requests pass     │────────────→ │  Some requests pass
    └────────────────────┘              └────────────────────
                ↑                              │
                │  Success                     │ Success/Fail
                │                             ↓
                │              ┌──────── OPEN ──────────┐
                └──────────────│  (Blocking mode)       │
                               │  Fast fail immediately  │
                               │  (no actual call)      │
                               └────────────────────────┘
```

| অবস্থা | আচরণ |
|---|---|
| **Closed** | সব request সার্ভিসে যাচ্ছে। Error threshold না পার হলে এখানেই থাকে। |
| **Open** | Error threshold পার হলে circuit খুলে যায়। সব request fast fail — DB চাপ নেই। |
| **Half-Open** | Timeout পরে কিছু test request পাঠায়। Success হলে Closed, fail হলে আবার Open। |

### What metrics trigger a circuit breaker to open?
- **Error Rate:** শেষ N request এর ৫০%+ fail হলে।
- **Slow Response Rate:** Request গুলো timeout হলে।
- **Time Window:** ৬০ সেকেন্ডে ২০টি request এর মধ্যে ১০ fail।

### How does the circuit breaker pattern relate to the bulkhead pattern?
- **Circuit Breaker:** Failing service এ call বন্ধ করে।
- **Bulkhead:** Failure কে isolate করে যেন অন্য অংশ affected না হয়।
- একসাথে ব্যবহার করুন: Circuit breaker সংবেদনশীল, bulkhead টি রক্ষাকারী পরিবেশ।

---

## 74. What is a retry pattern and what are its risks?

**Retry Pattern:** Transient failure (network glitch, timeout) এ automatic retry — permanent failure এ নয়।

### What is exponential backoff with jitter?
```python
import time, random

def call_with_retry(fn, max_retries=5):
    for attempt in range(max_retries):
        try:
            return fn()
        except TransientError:
            if attempt == max_retries - 1:
                raise
            # Exponential backoff: 1s, 2s, 4s, 8s, 16s...
            base_delay = 2 ** attempt
            # Jitter: random delay যোগ করুন synchronization এড়াতে
            jitter = random.uniform(0, base_delay * 0.1)
            time.sleep(base_delay + jitter)
```

- **Jitter ছাড়া:** সব client একই সময় retry → server আরও চাপে পড়ে (thundering herd)।
- **Jitter সহ:** Client গুলো আলাদা সময়ে retry → চাপ বিতরণ হয়।

### What is the difference between retry at the client vs retry at the proxy layer?
| ধরন | সুবিধা | অসুবিধা |
|---|---|---|
| **Client-side retry** | Client এর control এ | প্রতিটি client আলাদাভাবে implement |
| **Proxy-layer retry** (Nginx/Envoy) | Centralized — service code clean থাকে | Non-idempotent request এ risky |

### When should you not retry (non-idempotent operations)?
- `POST /payments` — retry করলে double charge!
- `DELETE /user` — প্রথম call সফল কিন্তু response হারিয়ে গেলে, retry → error।
- **সমাধান:** Idempotency key ব্যবহার করুন, তারপর safely retry।

---

## 75. What is a bulkhead pattern in system design?

জাহাজে **bulkhead** হলো watertight compartment — একটি ফুটো হলে পুরো জাহাজ ডুবে না।

Software এ: System কে isolated resource pool এ ভাগ করুন — একটি ব্যর্থ হলে অন্যগুলো চলে।

### How does bulkhead isolation prevent cascading failures?
```
Service A দুটি downstream call করে:
- Service X (critical) 
- Service Y (non-critical)

Without Bulkhead:
Service Y হ্যাং করলে → সব 500 thread ব্লক → Service X ও call করতে পারছে না → A ডাউন!

With Bulkhead:
Service X: 300 dedicated threads
Service Y: 200 dedicated threads
→ Y এ সব thread blocked হলেও X চলছে!
```

### What is thread pool isolation vs semaphore isolation?
| ধরন | কীভাবে | Overhead | Async support |
|---|---|---|---|
| **Thread Pool** | প্রতিটি service এর জন্য আলাদা thread pool | বেশি (context switching) | হ্যাঁ |
| **Semaphore** | Concurrent request count limit করো | কম | না |

- **Netflix Hystrix:** Thread pool isolation — সবচেয়ে জনপ্রিয়।
- **Resilience4j:** আধুনিক replacement, semaphore সাপোর্ট।

---

## 76. How do you design for graceful degradation?

**Graceful Degradation:** Component fail হলেও সিস্টেম কিছু কম feature নিয়ে চলতে থাকে — সম্পূর্ণ crash হয় না।

### What is the difference between graceful degradation and failover?
| | Graceful Degradation | Failover |
|---|---|---|
| **কী হয়** | Reduced functionality তে চলে | Backup system তে switch করে |
| **উদাহরণ** | Recommendation engine ডাউন → শুধু popular items দেখাও | Primary DB ডাউন → Read replica নেয় |
| **User impact** | কিছু feature নেই | Minimal downtime |

### How do you implement a fallback response when a dependency fails?
```python
def get_recommendations(user_id):
    try:
        # Primary: ML recommendation service
        return ml_service.recommend(user_id, timeout=200)
    except (Timeout, ServiceUnavailable):
        # Fallback 1: Cached recommendations
        cached = cache.get(f"recs:{user_id}")
        if cached:
            return cached
        # Fallback 2: Popular items (always available)
        return popular_items_service.get_top_10()
```

### What is feature flagging and how does it support graceful degradation?
- **Feature Flag:** কোড deploy করা কিন্তু runtime এ enable/disable করা।
- নতুন feature এ সমস্যা হলে flag off করুন — redeploy ছাড়াই।
- Progressive rollout: ১% user → ১০% → ৫০% → ১০০%।
- **Tools:** LaunchDarkly, Unleash, AWS Feature Flags।

---

## 77. What is chaos engineering and why do companies practice it?

**Chaos Engineering:** Production system এ ইচ্ছাকৃতভাবে failure ঘটিয়ে দেখা সিস্টেম কতটুকু resilient।

*"Hope is not a strategy"* — আপনি জানেন না আপনার সিস্টেম কোথায় fail করবে যতক্ষণ না আপনি নিজে fail করান।

### What is Netflix's Chaos Monkey?
- Netflix এর Chaos Engineering team এর tool।
- **Chaos Monkey:** Random EC2 instance terminate করে। Production এ।
- **Chaos Gorilla:** পুরো Availability Zone terminate।
- **Chaos Kong:** পুরো AWS Region টা।
- Netflix এ এটি হয় যেন engineer সবসময় resilient system বানায়।

### How do you design a chaos experiment?
```
১. Steady State Hypothesis: "Normal এ 99.9% request success < 200ms"
২. Experiment: একটি Database replica terminate করুন।
৩. Measure: Success rate কি এখনো 99.9%? Latency কি বেড়েছে?
৪. Observe: Circuit breaker কি triggered হলো? Failover হলো?
৫. Fix আর retest: যদি hypothesis ব্যর্থ হয়, fix করুন।
```

### What is the difference between chaos engineering and load testing?
| | Chaos Engineering | Load Testing |
|---|---|---|
| **লক্ষ্য** | Failure response test | Performance under high load |
| **Input** | Failure injection (node remove) | High traffic volume |
| **প্রশ্ন** | "কী ভাঙলে কী হয়?" | "কতটুকু ট্রাফিক সামলাতে পারি?" |
| **Tool** | Chaos Monkey, Gremlin | JMeter, k6, Locust |

---

## 78. What are the different types of system failures (hardware, software, network)?

| ধরন | উদাহরণ | Detection |
|---|---|---|
| **Hardware** | Disk failure, server crash, NIC failure | Heartbeat missing, IPMI alert |
| **Software** | Bug, memory leak, deadlock, OOM kill | Exception log, health check fail |
| **Network** | Packet loss, high latency, partition | Ping failure, increased latency |
| **Human** | Bad deployment, config change, wrong SQL | Post-deploy metrics drop |
| **Dependency** | Third-party API down, DNS failure | Error rate from dependency |

### What is a cascading failure and how does it start?
```
Service A → Service B (overloaded) → timeout
Service A retry → Service B আরও চাপে
More retries → B completely down
Service A কে depend করা Services → A down
→ পুরো system ডাউন!
```
**প্রতিরোধ:** Circuit breaker, bulkhead, rate limiting, timeout।

### What is a gray failure and why is it harder to detect than a hard failure?
- **Hard failure:** Service সম্পূর্ণ ডাউন — clear, alert আসে।
- **Gray failure:** Service চলছে কিন্তু partial failure।
  - কিছু request succeed, কিছু timeout।
  - Error rate 5% — alert threshold না পার হওয়া পর্যন্ত কেউ জানে না।
  - Memory slowly leak — কয়েক দিনে ক্রাশ।
- **Detection:** Percentile latency monitor (p99), error rate alerting, synthetic monitoring।
