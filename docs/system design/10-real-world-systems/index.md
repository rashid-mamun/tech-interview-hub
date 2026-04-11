---
sidebar_position: 1
title: ''
---



## 61. How would you design a URL shortener (like bit.ly)?

URL shortener এমন একটি service যা একটি দীর্ঘ URL কে একটি ছোট, sharable URL এ রূপান্তর করে।

**Requirements:**
- Input: `https://www.example.com/very/long/path?with=params` → `https://short.ly/abc123`
- Redirect: ছোট URL hit করলে original URL এ redirect।
- Scale: ১ বিলিয়ন URL, ১০০ মিলিয়ন রিডাইরেক্ট/দিন।

### How do you generate a unique short code?
```
পদ্ধতি ১ — Base62 Encoding:
  - একটি counter (auto-increment) → Base62 encode (a-z, A-Z, 0-9)
  - Counter 1 → "1", Counter 62 → "z", Counter 63 → "10"
  - 7 character = 62^7 = 3.5 trillion unique codes

পদ্ধতি ২ — Random + Collision check:
  - random(62^7) → check DB → not exists? save.
  - Collision হওয়ার সম্ভাবনা কম কিন্তু DB hit দরকার।

পদ্ধতি ৩ — MD5/SHA Hash truncate:
  - hash(long_url) → first 7 chars
  - সমস্যা: Collision বেশি।
```

### How do you handle collisions in short code generation?
- Counter-based approach এ collision হয় না — counter সবসময় unique।
- Hash-based এ collision হলে: `hash(url + salt)` দিয়ে আবার চেষ্টা।
- **Distributed counter:** Redis INCR atomic — একাধিক server same counter share করে।

### How do you scale reads since redirects are very frequent?
- **Cache aggressively:** `short_code → long_url` mapping Redis এ রাখুন। Read ৯৯% cache hit করবে।
- **Read replicas:** DB read replica দিয়ে read scale করুন।
- **CDN:** Redirect response CDN এ cache করুন (301 permanent redirect)।

```
Request: GET /abc123
1. Redis check → hit? → 301 Redirect directly
2. Miss → DB query → cache করুন → 301 Redirect
```

### How do you handle custom aliases?
- ইউজার নিজে short code choose করতে পারবে: `short.ly/my-product`।
- DB তে `is_custom` flag রাখুন।
- Custom aliases reserve করুন (offensive words blocklist)।
- Premium feature হিসেবে দিন।

---

## 62. How would you design a rate limiter?

### Which algorithm would you use?
**Token Bucket (সবচেয়ে সাধারণ):**
```
প্রতিটি user এর জন্য একটি bucket।
প্রতি second bucket এ T token যোগ।
Request এলে ১ token খরচ।
Token শেষ হলে → 429 Too Many Requests।
```

**Sliding Window Counter (সবচেয়ে accurate):**
```
Last N seconds এর request count track।
Redis Sorted Set এ timestamp store।
Count > limit → reject।
```

### How do you make the rate limiter work across multiple servers?
- **Problem:** Server A তে 50 request count, Server B তে আলাদা 50 — user মোট 100 করতে পারে।
- **Solution:** **Redis** এ centralized counter।

```python
# Redis Lua script (atomic)
local current = redis.call('INCR', key)
if current == 1 then
    redis.call('EXPIRE', key, window_seconds)
end
return current
```

### How do you store rate limit state (Redis, in-memory)?
| Storage | Pros | Cons |
|---|---|---|
| **Redis (Recommended)** | Distributed, atomic, TTL support | Network latency |
| **In-memory** | Fastest | Multiple server এ inconsistent |
| **Database** | Persistent | Too slow for every request |

---

## 63. How would you design a notification system?

**Types:** Push (mobile), Email, SMS, In-app।

### High-Level Architecture:
```
Event Source → Notification Service → Message Queue (Kafka)
                                    ↓
                    [Push Worker] [Email Worker] [SMS Worker]
                          ↓             ↓            ↓
                   Firebase FCM      SendGrid      Twilio
```

### How do you handle push notifications to millions of users?
- **Fan-out:** একটি event কে লক্ষ লক্ষ user এ distribute করুন।
- **Problem:** Celebrity user A এর ১০ মিলিয়ন follower — সবাইকে notify করতে কয়েক ঘণ্টা!
- **সমাধান:** Message Queue + Worker pool (horizontal scale worker)।
- Priority queue: Real-time notification > batch digest।

### How do you ensure notifications are delivered exactly once?
- **Idempotency key:** প্রতিটি notification একটি unique ID পাবে।
- Worker DB তে check করবে `notification_id` already delivered কিনা।
- **Delivered এর পরে status update:** `status=sent, sent_at=timestamp`।

### How do you handle user preference settings (opt-out, channels)?
```sql
CREATE TABLE notification_preferences (
    user_id BIGINT,
    channel ENUM('push', 'email', 'sms'),
    notification_type VARCHAR(50),  -- 'marketing', 'security', etc.
    enabled BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (user_id, channel, notification_type)
);
```
- Notification পাঠানোর আগে user preference check করুন।
- Opt-out request cache করুন (Redis) — fast lookup।

---

## 64. How would you design a social media news feed (like Twitter or Facebook)?

**Challenge:** ইউজার A ১০ জনকে follow করে, তাদের মিলিত posts কে A এর home feed এ show করা।

### What is the fan-out on write vs fan-out on read approach?

| বৈশিষ্ট্য | Fan-out on Write (Push) | Fan-out on Read (Pull) |
|---|---|---|
| **Write সময়** | Post create হলে সব follower এর feed এ copy | শুধু post store করা |
| **Read সময়** | Pre-computed feed — fast | সব following এর post query করুন |
| **Read latency** | কম | বেশি |
| **Write latency** | অনেক বেশি (millions followers!) | কম |
| **Storage** | অনেক বেশি | কম |

### How do you handle celebrity users with millions of followers in fan-out?
- **Hybrid approach (Twitter/Instagram করে):**
  - Normal user (< ১০K followers): Fan-out on write।
  - Celebrity user (> ১০K followers): Fan-out on read।
- Normal user এর feed pre-computed cache এ। Celebrity এর posts runtime এ mix করুন।

### How do you rank and filter a user's feed?
- **Chronological:** সহজ — `ORDER BY created_at DESC`।
- **Algorithmic (Facebook, Instagram):** ML model দিয়ে engagement score predict।
  - Features: recency, relationship closeness, content type, past interaction।
- **Practical approach ইন্টারভিউতে:** "Weighted score = w1×recency + w2×engagement + w3×relationship"।

---

## 65. How would you design a ride-sharing system (like Uber)?

### How do you match drivers with riders efficiently?
```
১. Rider "Book" চাপে → location পাঠায়
২. System nearby available driver খোঁজে
৩. Closest driver কে dispatch করে
৪. Driver accept করলে match confirmed
```

**Matching Algorithm:**
- Geospatial index (Geohash বা QuadTree) দিয়ে nearby driver খোঁজা।
- **Geohash:** Location কে string এ encode — `drm3bsp` (Dhaka area)। একই prefix = close location।
- Candidate drivers এর মধ্যে ETD + driver rating বিবেচনায় best match।

### How do you handle geolocation and proximity queries at scale?
- Driver প্রতি ৫ সেকেন্ডে location update পাঠায় → Redis Geo Index update।
- `GEORADIUS` command: নির্দিষ্ট point থেকে N km এর মধ্যে সব driver।
- **Scale:** Redis Cluster, Geospatial sharding by city/region।

### How do you handle surge pricing?
- **Supply/demand ratio** monitor করুন।
- Surge multiplier = `max(1.0, demand / supply × base_multiplier)`।
- Event-driven: City এর request rate spike করলে → pricing service calculation trigger।
- ইউজারকে surge price দেখিয়ে confirm করতে বলুন।

---

## 66. How would you design a distributed key-value store?

**Target:** DynamoDB বা Cassandra এর মতো — high availability, eventual consistency।

### How does consistent hashing distribute keys across nodes?
- প্রতিটি node কে hash ring এ রাখুন।
- Key hash করুন → ring এ position → পরের node।
- Virtual nodes ব্যবহার করুন — uniform distribution।

### How do you handle node failures and data recovery?
- **Replication:** প্রতিটি key N node এ replicate। Default N=3।
- **Hinted Handoff:** Target node down হলে temporary অন্য node রাখুন, node ফিরলে দিন।
- **Anti-entropy (Merkle Tree):** নিয়মিত nodes এর data compare করুন, difference sync করুন।

### How does Amazon DynamoDB or Apache Cassandra implement a key-value store?
- **DynamoDB:** Partition key hash করে storage node নির্ধারণ। Sort key দিয়ে range query। Fully managed।
- **Cassandra:** Partition key → Consistent hashing, Clustering column → SSTable sorting। Open source, peer-to-peer।

---

## 67. How would you design a video streaming platform (like YouTube or Netflix)?

### How do you handle video upload, transcoding, and storage?
```
Upload Flow:
1. Client → Chunked upload → Object Storage (S3)
2. Upload complete → Transcoding job queue এ event
3. Transcoding service: video → multiple resolutions (360p, 720p, 1080p, 4K)
4. Each resolution → CDN তে push
5. Metadata (title, duration, thumbnail) → DB তে save
6. User কে notify করুন
```

### How does adaptive bitrate streaming work?
- **ABR (Adaptive Bitrate Streaming):** Network speed অনুযায়ী video quality automatically বদলায়।
- **HLS (HTTP Live Streaming):** Video ছোট ছোট segment (2-10 sec) এ ভাগ করা।
- ক্লায়েন্ট network speed measure করে → manifest file থেকে সঠিক quality segment request।
- **DASH (MPEG-DASH):** Netflix ব্যবহার করে — platform neutral।

### How do you use a CDN to serve video content globally?
- Video file CDN edge এ cache।
- User → nearest edge server → video serve।
- Cache miss হলে → origin (S3) থেকে আনো।
- Popular video: অনেক edge এ pre-pushed।

---

## 68. How would you design a chat application (like WhatsApp)?

### How do you implement real-time message delivery using WebSocket?
```
Client A ← WebSocket Connection → Chat Server ← WebSocket Connection → Client B

1. A connection করে server এ
2. A একটি message পাঠায়
3. Server message DB তে save করে
4. Server B এর connection খোঁজে → B online থাকলে WebSocket দিয়ে push করে
5. B offline হলে → Push notification পাঠায়
```

### How do you store and retrieve chat history efficiently?
- **Schema:**
  ```sql
  messages (
      conversation_id UUID,
      message_id TIMEUUID,  -- time-based UUID for ordering
      sender_id BIGINT,
      content TEXT,
      created_at TIMESTAMP
  )
  ```
- **Cassandra/HBase:** Time-based ordering, high write throughput। Perfect for chat।
- Pagination: cursor-based — `WHERE conversation_id = X AND message_id < last_id LIMIT 20`।

### How do you handle group chats and delivery receipts?
- **Group Chat:** Fan-out — একটি message সব member কে deliver করুন।
- **Delivery Receipts:** Message state track করুন।
  ```
  Sent ✓ → Delivered ✓✓ → Read ✓✓ (blue)
  ```
- **Delivery status table:** `(message_id, user_id, status, timestamp)`।

---

## 69. How would you design a search autocomplete system?

### What data structure is used for prefix search (trie)?
**Trie (Prefix Tree):**
```
         root
        /    \
       a      b
      / \      \
     p   n      a
    /     \      \
  apple   and   banana
```
- প্রতিটি node একটি character।
- Word শেষে `is_end = True`।
- Prefix "ap" → "apple" পাওয়া → O(prefix length)।

### How do you rank autocomplete suggestions by popularity?
- প্রতিটি trie node এ frequency count রাখুন।
- Query "ap" → subtree এর top-k by frequency।
- **Top-K problem:** Min-heap ব্যবহার করুন।

### How do you update suggestions in real time as trends change?
- **Offline (daily batch):** Search log analyze করুন → trie rebuild।
- **Online (real-time):** Query হলে counter Redis এ INCR। Periodic trie update।
- **Practical:** Google এর মতো — hourly aggregation + smart filtering।

---

## 70. How would you design a distributed job scheduler?

### How do you ensure a job runs exactly once?
- **Distributed Lock (Redis Redlock):** Job pick up করার আগে lock নিন।
- **Database lease:** Job assignment table এ `locked_by`, `locked_until` কলাম।
  ```sql
  UPDATE jobs SET locked_by='worker-1', locked_until=NOW()+INTERVAL '5 minutes'
  WHERE id=123 AND locked_by IS NULL
  ```
- **Idempotent jobs:** Job duplicate run হলেও side effect নেই।

### How do you handle job failures and retries?
- Job failure হলে: `retry_count++`, `status='pending'`, exponential backoff এ retry।
- Max retry পার হলে: `status='dead'` → DLQ বা alert।
- **Job state machine:** `pending → running → success/failed`।

### How do you schedule jobs with dependencies?
- **DAG (Directed Acyclic Graph):** A → B, C → D। A complete না হলে B, C শুরু হয় না।
- **Apache Airflow:** DAG-based workflow — dependencies, retry, monitoring সব built-in।
- Topological sort দিয়ে execution order নির্ধারণ।

---

## 71. How would you design a payment processing system?

### How do you ensure idempotency in payment APIs?
```
Client → POST /payments
         Idempotency-Key: "order-123-payment-attempt-1"
         
Server:
  1. Key already exists? → Return same response।
  2. Not exists? → Process payment → Save result with key।
```
- Key expire করুন ২৪ ঘণ্টা পরে।
- Key store: Redis বা DB।

### How do you handle double charges and refunds?
- **Double charge:** Idempotency key দিয়ে prevent।
- **Reconciliation:** প্রতিদিন bank statement এবং internal DB match করুন।
- **Refund:** Original charge এর reference রাখুন। Refund = new transaction টাকা ফেরত।
- **Immutable ledger:** Transaction মুছবেন না, compensating entry করুন।

### What compliance considerations (PCI-DSS) affect payment system design?
- **PCI-DSS:** Payment Card Industry Data Security Standard।
- Card number (PAN) **never** store করবেন না — Tokenize করুন।
- Encryption at rest এবং in transit।
- Access control, audit log, vulnerability scanning।
- Payment gateway (Stripe, PayPal) ব্যবহার করলে PCI scope কমে।

---

## 72. How would you design a web crawler?

### How do you avoid crawling the same page twice?
- **URL frontier:** Priority queue of URLs to crawl।
- **Visited set:** Bloom filter বা Redis Set এ crawled URL store।
  - Bloom filter: Memory efficient, false positive সম্ভব (কিছু page miss হবে)।
  - Redis Set: Exact, কিন্তু memory বেশি।

### How do you handle crawl politeness (robots.txt, rate limiting)?
- **robots.txt:** প্রতিটি domain এর crawl permission check করুন।
- **Crawl delay:** একই domain এ request এর মধ্যে নির্দিষ্ট delay।
- **Rate limiting:** প্রতি domain এ max N req/sec।
- **User-Agent:** Proper bot identification করুন।

### How do you scale a crawler to billions of pages?
```
Architecture:
URL Frontier (Priority Queue) → Distributed Crawlers → HTML Parser
                                                      → Link Extractor → URL Frontier
                                                      → Content Store (S3)
                                                      → Index Builder
```
- **Horizontal scale:** Crawlers stateless — যত দরকার তত add করুন।
- **Domain-based partitioning:** প্রতিটি crawler নির্দিষ্ট domain handle করে (politeness)।
- **DNS caching:** প্রতিটি URL এ DNS lookup না করে cache করুন।
