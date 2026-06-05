---
sidebar_position: 1
title: 'Messaging and Queues'
---


## 29. What is a message queue and why is it used in distributed systems?

**Message Queue (মেসেজ কিউ)** হলো এমন একটি মধ্যবর্তী system যেখানে একটি component (Producer) message পাঠায় এবং আরেকটি component (Consumer) সেটি পরে প্রসেস করে।

- **সমস্যা যা সমাধান করে:** সার্ভিস A সার্ভিস B কে সরাসরি কল করে — B ডাউন থাকলে A ও fail করে।
- **সমাধান:** A কে message queue তে রাখো, B ready হলে নেবে — পরস্পর থেকে decoupled।

### What problems does asynchronous messaging solve?
- **Decoupling:** Producer এবং Consumer স্বাধীন — একটি ডাউন হলে অন্যটি চলে।
- **Load Leveling:** Traffic spike এ message queue বাফার হিসেবে কাজ করে।
- **Reliability:** B crash হলেও message হারায় না।
- **উদাহরণ:** Order placed → Queue → Email service, Inventory service, Payment service আলাদাভাবে process করে।

### What is the difference between a queue and a topic (pub/sub)?
| বৈশিষ্ট্য | Queue | Topic (Pub/Sub) |
|---|---|---|
| **Delivery** | একটি consumer পায় | সব subscriber পায় |
| **Pattern** | Point-to-Point | Fan-out |
| **ব্যবহার** | Task processing, job queue | Event notification, broadcast |
| **উদাহরণ** | Order processing | User signup → Email, Analytics, Notification সবাই পায় |

---

## 30. What is the difference between RabbitMQ and Kafka?

| বৈশিষ্ট্য | RabbitMQ | Apache Kafka |
|---|---|---|
| **Model** | Traditional message broker | Distributed event log/streaming |
| **Message Storage** | Consumer নিলে message মুছে যায় | Disk এ log হিসেবে persist থাকে |
| **Replay** | সাধারণত সম্ভব নয় | Offset দিয়ে যেকোনো সময় replay |
| **Throughput** | ~20k-50k msg/sec | Millions msg/sec |
| **Ordering** | Queue level | Partition level |
| **Best For** | Complex routing, task queues | Event streaming, audit log, high throughput |

### When would you choose Kafka over RabbitMQ?
- **Kafka বেছে নিন:** লাখ লাখ events per second, event replay দরকার, multiple consumer group একই data process করবে।
- **RabbitMQ বেছে নিন:** Complex routing logic (exchange, binding), lower volume, message priority দরকার।

### What is Kafka's log-based storage model?
- Kafka প্রতিটি message একটি **append-only log file** এ লেখে।
- Consumer নিজের **offset** track করে — কোন message পর্যন্ত পড়েছে।
- Retention period (যেমন ৭ দিন) পর্যন্ত message থাকে — তারপর মুছে যায়।
- এই কারণে reprocessing সম্ভব — consumer offset reset করলে আগের events দিয়ে নতুন করে process।

### What is a consumer group in Kafka and how does it enable parallel processing?
- প্রতিটি **Consumer Group** একটি topic এর সব message একবার করে দেখে।
- Group এর প্রতিটি consumer আলাদা partition থেকে পড়ে — parallel processing।
- নতুন service যোগ করতে চাইলে নতুন consumer group তৈরি করুন — একই events ভিন্নভাবে process হবে।

```
Topic: user-events [Partition 0] [Partition 1] [Partition 2]
Consumer Group A:  [Consumer 1]  [Consumer 2]  [Consumer 3]
Consumer Group B (Analytics): [Consumer 1] পুরো topic পড়ে
```

---

## 31. What is pub/sub messaging and when do you use it?

**Pub/Sub (Publish-Subscribe)** pattern এ Publisher message পাঠায় topic এ, Subscriber সেই topic এ ভর্তি হয়ে সব message পায়।

### What are fan-out patterns in pub/sub systems?
**Fan-out:** একটি event একসাথে অনেক service কে notify করা।

```
User Signup Event (Published)
    → Email Service (Welcome email পাঠায়)
    → Analytics Service (signup track করে)
    → Notification Service (Welcome push notification)
    → Recommendation Service (Initial recommendations generate করে)
```

### What is the difference between push and pull delivery in pub/sub?
| বৈশিষ্ট্য | Push Delivery | Pull Delivery |
|---|---|---|
| **কীভাবে কাজ করে** | Broker subscriber কে message ঠেলে দেয় | Subscriber নিজে broker থেকে message টেনে নেয় |
| **Latency** | কম | একটু বেশি (polling interval) |
| **Backpressure** | Consumer overwhelmed হতে পারে | Consumer নিজের গতিতে নেয় |
| **উদাহরণ** | Google Cloud Pub/Sub push, Webhook | SQS, Kafka |

---

## 32. How do you ensure exactly-once delivery in a message queue?

### What is at-least-once vs at-most-once vs exactly-once delivery semantics?
| Semantics | মানে | Data Loss? | Duplicate? |
|---|---|---|---|
| **At-most-once** | পাঠানো হবে, সফল কিনা নিশ্চিত নয় | সম্ভব | না |
| **At-least-once** | অবশ্যই পাবে, তবে একাধিকবার পেতে পারে | না | সম্ভব |
| **Exactly-once** | ঠিক একবার পাবে | না | না |

- **Exactly-once সবচেয়ে কঠিন** এবং performance cost বেশি।
- বেশিরভাগ system **at-least-once + idempotent consumer** দিয়ে practically exactly-once অর্জন করে।

### How do idempotency keys help ensure exactly-once processing?
- Consumer যদি একই message দুবার পায়, idempotency key দিয়ে চেক করবে "এটা কি আগেই process হয়েছে?"
- হ্যাঁ হলে — skip।
- না হলে — process করে key store করে।

```python
def process_payment(message):
    idempotency_key = message['id']
    if redis.exists(f"processed:{idempotency_key}"):
        return  # Already processed
    
    do_payment(message)
    redis.setex(f"processed:{idempotency_key}", 86400, "done")
```

---

## 33. What is a dead letter queue (DLQ) and why is it important?

**Dead Letter Queue (DLQ)** হলো এমন একটি বিশেষ queue যেখানে সফলভাবে process না হওয়া message গুলো যায়।

### When does a message end up in a dead letter queue?
- নির্দিষ্ট সংখ্যক retry এর পরেও fail।
- Message expiration (TTL পার হলে)।
- Consumer explicitly reject করলে (poison message)।
- Message format invalid বা corrupted।

### How do you monitor and process messages in a DLQ?
- **Alert setup:** DLQ তে message গেলে PagerDuty/Slack alert।
- **Dashboard:** DLQ size time over time monitor করুন।
- **Manual review:** DLQ message inspect করে bug fix করুন।
- **Replay:** Bug fix এর পরে DLQ থেকে original queue তে পুনরায় পাঠান।

### What retry strategies work well with a DLQ?
- **Exponential Backoff with Jitter:** 1s, 2s, 4s, 8s — এর সাথে random jitter যোগ করুন যেন একসাথে retry না হয়।
- **Max Retry Count:** ৩-৫ বার retry এর পরে DLQ।
- **Timeout:** Message কতক্ষণ active থাকবে তার সীমা।

---

## 34. How do you handle backpressure in a messaging system?

**Backpressure** হলো যখন consumer producer এর তুলনায় ধীর — queue অনিয়ন্ত্রিতভাবে বাড়তে থাকে।

### What strategies can a consumer use to signal backpressure to a producer?
- **Rate Limiting:** Producer কে বলুন কম পাঠাতে।
- **Pull-based consumption:** Consumer নিজের গতিতে টেনে নেয় (Kafka এর default)।
- **Reject with backpressure signal:** Consumer `503 Service Unavailable` বা custom signal পাঠায়।

### How does Kafka handle slow consumers?
- Kafka consumer নিজের offset track করে — slow consumer শুধু পিছিয়ে পড়ে, কিন্তু message হারায় না (until retention period শেষ হয়)।
- **Consumer Lag Monitoring:** কতটা পিছিয়ে আছে তা monitor করুন।
- **Scale out consumer:** Consumer group এ আরও consumer যোগ করুন — parallel processing বাড়ে।
- যদি consumer অনেক slow হয়, **retention period পার হলে message চলে যাবে** — এটাই মূল risk।
