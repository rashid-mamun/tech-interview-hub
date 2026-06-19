---
sidebar_position: 3
title: 'Threads'
---

## 🧵 3. What is a thread?

Thread হলো process-এর ভিতরের execution unit। একই process-এর thread একই address space share করে।

| Resource | Process | Threads in same process |
|---|---|---|
| Memory space | আলাদা | shared |
| File descriptors | আলাদা/own table | shared |
| Stack | own | each thread own stack |
| Creation cost | বেশি | কম |

### ⚡ Concurrency vs Parallelism

```text
Concurrency = একসাথে progress হচ্ছে মনে হয়
Parallelism = সত্যি একই সময়ে multiple core-এ চলছে
```

Single-core system concurrency করতে পারে, parallelism করতে পারে না।

### 🏊 Thread pool

Thread repeatedly create/destroy না করে fixed pool রাখা হয়।

```cpp
// Simplified idea
queue<function<void()>> tasks;
mutex m;
condition_variable cv;
```

Thread pool useful:

- Web server request handling
- Background jobs
- Database connection tasks

### 🧠 CPU-bound vs I/O-bound sizing

```text
CPU-bound: thread count প্রায় CPU core count
I/O-bound: বেশি thread রাখা যায়, কারণ অনেক সময় wait করে
```

> Threads shared memory use করে, তাই synchronization না করলে race condition হতে পারে।
