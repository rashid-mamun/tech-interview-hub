---
sidebar_position: 1
title: ''
---


## 22. What is caching and why is it important in system design?

**Caching (ক্যাশিং)** হলো ঘন ঘন ব্যবহৃত ডাটা একটি দ্রুতগতির storage এ সাময়িকভাবে রেখে দেওয়া, যেন বারবার ডাটাবেস বা heavy computation এর প্রয়োজন না হয়।

- **উপমা:** রেস্টুরেন্টে ওয়েটার প্রতিটি অর্ডারের জন্য রান্নাঘরে না গিয়ে, সদ্য বানানো খাবার ট্রেতে রাখে — এটাই ক্যাশিং।
- **ডাটাবেস query:** 50ms লাগে। **Cache hit:** 1ms লাগে। 50x দ্রুততর!

### What types of data are good candidates for caching?
- **Frequently Read, Rarely Changed:** ওয়েবসাইটের homepage banner, product list।
- **Expensive to Compute:** Machine learning model output, complex aggregation।
- **Session Data:** User authentication token, shopping cart।
- **Bad candidates:** User-specific financial data যা real-time accurate হতে হবে।

### What are the trade-offs of caching (staleness, memory cost, complexity)?
| সমস্যা | ব্যাখ্যা | সমাধান |
|---|---|---|
| **Staleness** | Cache এ পুরনো ডাটা থাকতে পারে | TTL সেট করুন বা write এর সাথে invalidate করুন |
| **Memory খরচ** | RAM ডাটাবেসের চেয়ে অনেক দামি | শুধু hot data ক্যাশ করুন |
| **Complexity** | কোথায় কী cache আছে ট্র্যাক করা | Cache layer আলাদা করুন, monitoring বাড়ান |
| **Cache invalidation** | ডাটা বদলালে cache আপডেট করা | "There are only two hard things in CS: cache invalidation and naming things" — Phil Karlton |

### Where can you apply caching in a system?
```
Client Browser Cache
    ↓
CDN Edge Cache
    ↓
API Gateway / Reverse Proxy Cache (Nginx)
    ↓
Application Server Cache (in-memory: Redis/Memcached)
    ↓
Database Query Cache
```

---

## 23. What are the different caching strategies?

### What is cache-aside (lazy loading) and when do you use it?
**Cache-Aside** হলো সবচেয়ে সাধারণ pattern। Application নিজেই cache manage করে।

```
1. Cache এ খোঁজো
2. পেলে → return (Cache Hit)
3. না পেলে (Cache Miss) → DB থেকে আনো → Cache এ রাখো → return
```
- **সুবিধা:** শুধু চাওয়া ডাটাই cache এ যায়, memory waste হয় না।
- **অসুবিধা:** প্রথমবার সবসময় DB hit করে (cold start)।
- **ব্যবহার:** General purpose — product details, user profiles।

### What is write-through caching and what are its trade-offs?
```
Write → Cache এ লেখো → তারপর DB তে লেখো (synchronous)
```
- **সুবিধা:** Cache সবসময় up-to-date। Read করলে always latest পাবেন।
- **অসুবিধা:** Write latency বাড়ে (দুটো জায়গায় লিখতে হয়)। অনেক ডাটা cache এ জমে যায় যা হয়তো আর read হবে না।

### What is write-back (write-behind) caching and when is it risky?
```
Write → শুধু Cache এ লেখো → পরে asynchronously DB তে লেখো
```
- **সুবিধা:** Write অনেক দ্রুত (শুধু cache hit)।
- **অসুবিধা:** Cache crash হলে DB তে যাওয়ার আগে ডাটা হারিয়ে যাবে! ⚠️
- **ব্যবহার:** High-write workload যেখানে সামান্য data loss acceptable — gaming leaderboard।

### What is read-through caching?
- Application cache কে জিজ্ঞেস করে, cache নিজেই DB থেকে ডাটা আনে এবং application কে দেয়।
- Cache-Aside এর মতোই কিন্তু cache খোঁজার logic application এ নেই — cache library নিজে handle করে।

---

## 24. What are cache eviction policies (LRU, LFU, TTL)?

Cache এর memory পূর্ণ হলে কোন ডাটা মুছবেন তা নির্ধারণ করে Eviction Policy।

| Policy | সংজ্ঞা | Best For |
|---|---|---|
| **LRU** (Least Recently Used) | সবচেয়ে পুরনো accessed item বের করো | General-purpose, most common |
| **LFU** (Least Frequently Used) | সবচেয়ে কম ব্যবহৃত item বের করো | Popular content stays longer |
| **TTL** (Time to Live) | নির্দিষ্ট সময় পরে expire করো | Time-sensitive data |
| **FIFO** | প্রথমে ঢুকলে প্রথমে বের হয় | Queue-like behavior |
| **Random** | এলোমেলো item বের করো | Low memory access pattern knowledge |

### How does LRU (Least Recently Used) eviction work?
- LRU একটি **Doubly Linked List + HashMap** দিয়ে implement করা হয়।
- নতুন access = List এর সামনে নিয়ে আসো।
- Eviction দরকার = List এর পেছন থেকে মুছো।
- **O(1) time complexity** — Redis এ ব্যবহৃত।

### When would you prefer LFU (Least Frequently Used) over LRU?
- LRU সমস্যা: যদি কেউ একবার অনেক item scan করে, সেগুলো পুরনো popular item কে বের করে দেয় — **Cache pollution**।
- LFU: Frequency count রাখে, সত্যিকারের popular item রাখে।
- **ব্যবহার:** YouTube video recommendation cache যেখানে viral video বেশির ভাগ সময় থাকার দরকার।

---

## 25. What is a cache stampede (thundering herd) and how do you prevent it?

**Cache Stampede** হলো যখন একটি popular cache entry expire হয়, একসাথে হাজার request সরাসরি DB তে যায় — DB overwhelmed হয়ে পড়ে।

```
Cache expired for "homepage"
→ 10,000 requests hit DB simultaneously
→ DB overloaded → গোটা সিস্টেম ডাউন!
```

### How does mutex locking prevent cache stampede?
```python
def get_data(key):
    data = cache.get(key)
    if data:
        return data
    
    # Acquire lock — শুধু একটি request DB যাবে
    if acquire_lock(key):
        data = db.query(key)
        cache.set(key, data, ttl=60)
        release_lock(key)
    else:
        # অন্যরা lock release এর অপেক্ষায় বা stale data নেয়
        time.sleep(0.1)
        return get_data(key)  # Retry
    return data
```

### What is probabilistic early recomputation for cache stampede prevention?
- Cache expire হওয়ার আগেই probabilistically refresh করা।
- TTL এর কাছাকাছি হলে, random chance এ refresh trigger করা — সবাই একসাথে না গিয়ে কেউ একজন যায়।

### What is request coalescing?
- একই key এর জন্য একসাথে আসা সব request কে একটিতে coalesce (একত্রিত) করা।
- শুধু একটি request DB তে যায়, সব request একই response পায়।
- **Nginx proxy_cache_lock** এই pattern ব্যবহার করে।

---

## 26. What is the difference between Redis and Memcached?

| বৈশিষ্ট্য | Redis | Memcached |
|---|---|---|
| **Data Structures** | String, Hash, List, Set, ZSet, Bitmap, Stream | শুধু String |
| **Persistence** | RDB snapshot + AOF log | নেই (purely in-memory) |
| **Clustering** | Redis Cluster — built-in | Client-side sharding |
| **Pub/Sub** | আছে | নেই |
| **Lua Scripting** | আছে | নেই |
| **Threads** | Single-threaded (I/O + commands) | Multi-threaded (better CPU use) |

### What data structures does Redis support that Memcached does not?
- **Sorted Sets (ZSet):** Leaderboard, priority queue।
- **Lists:** Queue, recent activity feed।
- **Sets:** Unique visitors, tags।
- **Hashes:** User profile (field-level update)।
- **HyperLogLog:** Approximate unique count।
- **Streams:** Event log, message queue।

### How does Redis persistence (RDB vs AOF) work?
- **RDB (Redis Database Backup):** নির্দিষ্ট interval এ snapshot নেয়। Crash হলে শেষ snapshot পর্যন্ত ডাটা যায়। Fast restart।
- **AOF (Append Only File):** প্রতিটি write operation log করে। Crash হলে replay করে recover। বেশি durable কিন্তু বড় file।
- **Production best practice:** দুটোই চালু রাখুন।

---

## 27. How do you design a distributed cache?

Single Redis server এ সীমাবদ্ধতা আছে (memory, throughput)। Distributed cache এ একাধিক node জুড়ে ক্যাশ ছড়িয়ে দেওয়া হয়।

### How do you handle cache invalidation in a distributed system?
**সবচেয়ে কঠিন সমস্যাগুলোর একটি।** কয়েকটি পদ্ধতি:
1. **TTL-based:** সময় পরে নিজেই expire — simple কিন্তু stale হতে পারে।
2. **Write-invalidate:** DB write এর সময় cache মুছুন — consistent কিন্তু thundering herd risk।
3. **Event-based:** DB change event publish করুন, cache subscriber সেটি দেখে invalidate করে। (Kafka/Redis Pub/Sub)।

### What is cache coherence and why is it hard in distributed systems?
- **Cache coherence:** সব cache node এ same key এর same value থাকা।
- কঠিন কারণ: Node A তে update হলে Node B কে কে জানাবে? কত দ্রুত জানাবে? জানানোর সময় কেউ read করলে কী হবে?
- **সমাধান:** Consistent hashing + TTL combination, অথবা Redis Cluster।

### How does consistent hashing apply to distributing cache keys across nodes?
- প্রতিটি cache node কে একটি hash ring এ রাখা হয়।
- Key হ্যাশ করলে ring এ একটি position পাওয়া যায়, সেই position এর পরের node এ key যায়।
- Node যোগ/বাদ হলে মাত্র কিছু key affected — বেশিরভাগ unchanged।

---

## 28. What is CDN caching and how does it differ from server-side caching?

| বৈশিষ্ট্য | CDN Caching | Server-side Caching (Redis) |
|---|---|---|
| **কোথায় থাকে** | Edge servers — user এর কাছে | Application server এর পাশে |
| **কী cache করে** | Static files: JS, CSS, Image, Video | DB query result, API response |
| **Latency benefit** | Geographical proximity — 5-50ms কমায় | DB round-trip কমায় — 50-200ms |
| **কে নিয়ন্ত্রণ করে** | Cache-Control headers দিয়ে | Application code |

### How do cache-control headers control CDN behavior?
```http
Cache-Control: public, max-age=86400, s-maxage=3600
```
- `public`: CDN cache করতে পারবে।
- `max-age=86400`: Browser ২৪ ঘণ্টা cache।
- `s-maxage=3600`: CDN ১ ঘণ্টা cache (overrides max-age for CDN)।
- `no-cache`: CDN কে origin validate করতে বলে।
- `no-store`: কেউ cache করবে না।

### How do you invalidate a CDN cache for a specific resource?
- **পদ্ধতি ১ — Cache busting:** URL এ version যোগ করুন — `style.css?v=2.0` বা `style.v2.css`। নতুন URL মানে নতুন cache।
- **পদ্ধতি ২ — API Purge:** Cloudflare, AWS CloudFront API দিয়ে specific path purge করা যায়।
- **পদ্ধতি ৩ — Surrogate keys / Cache tags:** একটি group এর সব file একসাথে invalidate।
