---
sidebar_position: 1
title: 'Performance'
---

## 1. How do you optimize a Node.js application for performance?
Node.js application-এর performance optimize করার জন্য নিচের পদ্ধতিগুলো ব্যবহার করা হয়:
- **Asynchronous Programming:** I/O heavy কাজগুলোর জন্য `async/await` বা Promise ব্যবহার করা, যাতে Event Loop ব্লক না হয়।
- **Caching:** বারবার ব্যবহৃত ডেটা ডাটাবেস থেকে না এনে Redis বা in-memory cache থেকে সার্ভ করা।
- **Connection Pooling:** বারবার ডাটাবেস কানেকশন তৈরি না করে connection pool ব্যবহার করা।
- **Clustering / Load Balancing:** মাল্টি-কোর CPU-র পুরো সুবিধা নিতে `cluster` মডিউল, PM2 বা Nginx/HAProxy ব্যবহার করে লোড ব্যালেন্স করা।
- **Stateless APIs:** অ্যাপ্লিকেশনকে stateless রাখা, যেন সহজেই horizontally scale করা যায়।
- **Pagination & Query Optimization:** ডাটাবেস থেকে একসাথে অনেক ডেটা না এনে pagination ব্যবহার করা এবং query optimize করা।
- **Use Streams:** বড় ফাইল (যেমন ভিডিও, ইমেজ বা লগ ফাইল) প্রোসেস করার জন্য মেমরি বাফারের বদলে Streams ব্যবহার করা।
- **Gzip Compression:** ক্লায়েন্টকে ডেটা পাঠানোর আগে response-কে compress (যেমন: `compression` middleware) করে সাইজ কমানো।

### What tools do you use to profile a Node.js app?
Node.js অ্যাপ্লিকেশনের performance profiling করার জন্য যে টুলগুলো ব্যবহৃত হয়:
- **Node.js Built-in Profiler:** `node --prof app.js` কমান্ড ব্যবহার করে V8 ইঞ্জিনের profiling ডেটা জেনারেট করা।
- **Chrome DevTools:** `node --inspect index.js` দিয়ে অ্যাপ্লিকেশন রান করে Chrome ব্রাউজারের DevTools (Memory, CPU Profiler) ব্যবহার করা।
- **Clinic.js:** এটি (Doctor, Bubbleprof, Flame) Node.js-এর bottleneck এবং memory issue আইডেন্টিফাই করতে অত্যন্ত কার্যকরী ভিজ্যুয়াল টুল।
- **APM Tools:** Production-এ performance মনিটরের জন্য New Relic, Datadog বা AppDynamics ব্যবহার করা।

### What is flame graph analysis and how do you read one?
**Flame Graph** হলো একটি ভিজ্যুয়াল রিপ্রেজেন্টেশন (visual representation), যা দেখায় একটি অ্যাপ্লিকেশন কোন ফাংশন রান করতে কতটুকু CPU টাইম ব্যবহার করছে। 

এর মাধ্যমে বোঝা যায় (কীভাবে রিড করতে হয়):
- **Y-axis (Depth):** X-অক্ষ বরাবর ফাংশন কল স্ট্যাকের (call stack) গভীরতা দেখায়। অর্থাৎ, কে কাকে কল করেছে (parent-child relationship)।
- **X-axis (Width):** কোন ফাংশনটি CPU-তে কত বেশি সময় ধরে এক্সিকিউট হয়েছে, তার প্রস্থ (width) সেটাই নির্দেশ করে। 
- চওড়া ব্লকগুলো মানে হলো ওই ফাংশনটি সবচেয়ে বেশি সময় নিচ্ছে (Performance bottleneck)। এটি optimize করতে পারলে overall performance বৃদ্ধি পাবে।

---

## 2. What is clustering in Node.js, and how does it improve performance?
Node.js বাই-ডিফল্ট সিঙ্গেল-থ্রেডেড (Single-threaded) হওয়ায় এটি মাল্টি-কোর CPU-এর সবকটি কোর নিজে থেকে ব্যবহার করতে পারে না। 
**Clustering** হলো এমন একটি পদ্ধতি যার মাধ্যমে মূল প্রসেস (Master process) অনেকগুলি চাইল্ড প্রসেস (Worker process) তৈরি করে, যা CPU-এর প্রতিটি কোরে রান করে। 
এটি performance উন্নত করে কারণ সবগুলো Worker একই সার্ভার পোর্টে incoming request গুলো হ্যান্ডেল করতে পারে, ফলে অ্যাপ্লিকেশন একসাথে অনেক বেশি রিকোয়েস্ট (concurrency) প্রসেস করতে পারে। 

### How does the cluster module distribute incoming connections across workers?
Node.js-এর `cluster` মডিউল ডিফল্টভাবে **Round-Robin** পদ্ধতির মাধ্যমে incoming connections গুলোকে ডিস্ট্রিবিউট করে (Windows বাদে সব OS এ)।
- Master process নির্দিষ্ট পোর্টটিতে listen করে এবং যখন কোনো নতুন কানেকশন আসে, তখন master process সেটি receive করে।
- এরপর Master process রাউন্ড-রবিন অ্যালগরিদম ব্যবহার করে উক্ত কানেকশনটি একটি নির্দিষ্ট Worker-এর কাছে প্রসেস করার জন্য পাঠিয়ে দেয় (IPC - Inter-Process Communication এর মাধ্যমে)। 

### What is the difference between clustering and using Worker Threads?
- **Clustering:** এটি সম্পূর্ণ আলাদা আলাদা Node.js process তৈরি করে। একে অপরের সাথে মেমরি শেয়ার করতে পারে না। এদের মধ্যে যোগাযোগের জন্য IPC (Inter-process communication) ব্যবহার করতে হয়। এটি মূলত **I/O-heavy** রিকোয়েস্ট বা ওয়েব সার্ভারের লোড ব্যালেন্স করার জন্য ব্যবহৃত হয়।
- **Worker Threads:** এটি একই Node.js process-এর ভেতরে একাধিক thread তৈরি করে। এরা নিজেদের মধ্যে মেমরি শেয়ার (SharedArrayBuffer) করতে পারে। এটি মূলত **CPU-intensive** কাজ (যেমন: ইমেজ বা ভিডিও প্রোসেসিং, ভারী ক্যালকুলেশন) Main Event Loop কে ব্লক না করে সম্পন্ন করার জন্য ব্যবহৃত হয়।

---

## 3. What is the `pm2` process manager, and how does it help?
**PM2** হলো Node.js অ্যাপ্লিকেশনের জন্য একটি অত্যন্ত জনপ্রিয় Production Process Manager। 
এটি যে সুবিধাগুলো দেয়:
- **Process Management:** অ্যাপ্লিকেশনের প্রসেসগুলো ব্যাকগ্রাউন্ডে রান করা এবং সার্ভার রিস্টার্ট হলে স্বয়ংক্রিয়ভাবে অ্যাপ স্টার্ট করা।
- **Clustering:** অ্যাপের কোড পরিবর্তন না করেই `pm2 start app.js -i max` কমান্ড দিয়ে সবগুলো CPU কোর ব্যবহার করা যায়।
- **Auto Restart:** অ্যাপ্লিকেশন ক্র্যাশ (Crash) করলে PM2 অটোমেটিকভাবে সেটি রিস্টার্ট করে দেয়।
- **Monitoring:** CPU, Memory usage মনিটর করা এবং লগ (logs) ম্যানেজ করা।

### How do you configure `pm2` for zero-downtime deployments?
Zero-downtime deployment মানে হলো অ্যাপ্লিকেশন রিস্টার্ট করার সময় ইউজারদের যেন কোনো downtime বা error ফেস করতে না হয়।
PM2-তে এটি কনফিগার করার নিয়ম:
- অ্যাপ্লিকেশনটি Cluster মোডে (`-i` attribute সহ) রান করাতে হবে।
- এরপর ডেপ্লয়মেন্টের সময় `pm2 reload <app_name>` কমান্ড ব্যবহার করতে হবে। 
- `reload` কমান্ডটি একসাথে সবগুলো worker রিস্টার্ট না করে, একে একে (gracefully) রিস্টার্ট করে। ফলে পুরনো worker গুলো নতুন আসা ট্রাফিক হ্যান্ডেল করার জন্য সর্বদা প্রস্তুত থাকে এবং কোন রিকোয়েস্ট ড্রপ হয় না।

---

## 4. How do you implement caching in Node.js?
Caching-এর মূল উদ্দেশ্য হলো ধীরগতির কোনো অপারেশন (যেমন ডাটাবেস কুয়েরি) এর রেজাল্ট আগে থেকে মেমরিতে সাময়িকভাবে সেভ করে রাখা, যেন পরবর্তীতে একই রিকোয়েস্ট এলে দ্রুত রেসপন্স দেওয়া যায়।
Node.js-এ caching করার উপায়:
- সাধারণত API রেসপন্স বা ডেটাবেসের রেজাল্ট একটি key-value জোড়া হিসেবে Cache-এ সেভ করা হয়।
- রিকোয়েস্ট আসার পর প্রথমে চেক করা হয় যে ওই ডেটা (key) Cache-এ আছে কিনা (Cache Hit)। থাকলে সেখান থেকে সরাসরি রেসপন্স দেওয়া হয়। 
- না থাকলে (Cache Miss) ডাটাবেস থেকে ডেটা এনে প্রথমে Cache-এ স্টোর করে তারপর ক্লায়েন্টকে পাঠানো হয়। 

### What is the difference between in-memory caching and Redis caching?
- **In-memory Caching (যেমন `node-cache`):** এটি Node.js অ্যাপ্লিকেশনের নিজস্ব মেমরি (RAM) ব্যবহার করে ডেটা স্টোর করে। এটি খুবই দ্রুত, কিন্তু অ্যাপ্লিকেশন রিস্টার্ট হলে ডেটা হারিয়ে যায়। তাছাড়া, একাধিক Node instance (cluster) থাকলে তারা একে অপরের cache অ্যাক্সেস করতে পারে না।
- **Redis Caching:** এটি একটি আলাদা (External) ইন-মেমরি ডেটাবেস। এটি Node.js প্রসেস থেকে সম্পূর্ণ স্বাধীন। সার্ভার বা অ্যাপ রিস্টার্ট হলেও ডেটা হারায় না (যদি persist করা থাকে)। স্কেলিংয়ের সময় একাধিক Node instance সহজেই একটি কমন Redis সার্ভার থেকে ডেটা অ্যাক্সেস করতে পারে।

---

## 5. What is the Worker Threads module, and when is it useful?
**Worker Threads** (`worker_threads`) হলো Node.js-এর একটি মডিউল যা মেইন থ্রেডের (Main Event Loop) পাশাপাশি প্যারালালি অন্যান্য থ্রেডে জাভাস্ক্রিপ্ট কোড এক্সিকিউট করতে সাহায্য করে।

**কখন উপকারী:**
এটি মূলত **CPU-intensive** কাজ (যেমন: ক্রিপ্টোগ্রাফি, ইমেজ রিসাইজিং, বড় অ্যারে সর্টিং, ম্যাথমেটিক্যাল ক্যালকুলেশন) করার ক্ষেত্রে উপকারী। কারণ এসব কাজ মেইন থ্রেডে করলে Event Loop ব্লক হয়ে যায় এবং অন্যান্য রিকোয়েস্ট ঝুলে থাকে। Worker Threads ব্যবহার করলে এই ভারী কাজগুলো ব্যাকগ্রাউন্ডে ভিন্ন থ্রেডে সম্পন্ন হয়।

### How do you share memory between Worker Threads using `SharedArrayBuffer`?
Worker Threads একে অপরের মেমরি সরাসরি অ্যাক্সেস করতে পারে না। তবে তারা **`SharedArrayBuffer`** ব্যবহার করে একই মেমরি স্পেস শেয়ার করতে পারে।
- প্রথমে Main thread-এ একটি `SharedArrayBuffer` তৈরি করা হয়।
- এরপর সেটি Worker Thread-এর কাছে `postMessage()` দিয়ে পাঠানো হয় (ডেটা কপি না করে)।
- উভয় thread-ই একই মেমরি ব্লক রিড এবং রাইট করতে পারে। তবে ডেটা রেস (Race Condition) এড়াতে `Atomics` অবজেক্ট ব্যবহার করে সিঙ্ক্রোনাইজড বা নিরাপদ طریقےতে ডেটা রিড-রাইট করতে হয়।

---

## 6. How do you handle memory leaks in Node.js?
Memory Leak হলো এমন একটি অবস্থা যেখানে একটি অ্যাপ্লিকেশন মেমরি (RAM) ব্যবহার করতেই থাকে, কিন্তু আর প্রয়োজন না থাকার পরও সেই মেমরিগুলো খালি (Garbage Collection দ্বারা) করে না। এটি ঠেকানোর উপায়:
- অপ্রয়োজনীয় object, array বা connection কে ঠিকমতো clear/close করা।
- ইভেন্ট লিসেনারগুলো (Event listeners) ঠিকমতো remove করা।
- গ্লোবাল ভ্যারিয়েবলের ব্যবহার পরিহার করা।
- নিয়মিত heap-dump নিয়ে এবং profiling করে মেমরি ব্যবহারের প্যাটার্ন অ্যানালাইজ করা।

### What are the most common causes of memory leaks?
Memory leak-এর সবচেয়ে সাধারণ কারণগুলো হলো:
1. **Global Variables:** গ্লোবাল ভ্যারিয়েবলে স্টোর করা ডেটা কখনোই Garbage Collector দ্বারা ক্লিন হয় না।
2. **Closures:** Closure-এর কারণে এমন কিছু ভ্যারিয়েবলের রেফারেন্স মেমরিতে থেকে যায়, যেগুলো আর কখনোই ব্যবহৃত হবে না।
3. **Uncleared Event Listeners:** `EventEmitter`-এ অনবরত নতুন `on()` ইভেন্ট তৈরি করে তা `removeListener()` বা `off()` দিয়ে রিমুভ না করা।
4. **Caches without Expiration:** বড় কোনো ডেটা ক্যাশে সেভ করে তার কোনো এক্সপায়ারি না দেওয়া বা মেমরি লিমিট সেট না করা।

### What tools help identify memory leaks?
- **Chrome DevTools:** Node.js-কে `node --inspect` মোডে রান করে মেমরি ট্যাব থেকে Heap Snapshot নেওয়া এবং স্পেসিফিক কোনো লিকেজ আছে কিনা তা তুলনা (Compare) করা।
- **Clinic.js (HeapProfiler):** মেমরির ব্যবহার ট্র‍্যাক করতে সাহায্য করে।
- `process.memoryUsage()`: কোড থেকে ডায়নামিক্যালি মেমরির অবস্থা দেখার জন্য।
- **APM Tools:** New Relic বা Datadog প্রোডাকশনে মেমরি লিকেজ অ্যালার্ট দিতে পারে।

---

## 7. What is the purpose of the `--max-old-space-size` flag?
V8 ইঞ্জিনের (Node.js এর কোর) ডিফল্ট মেমরি লিমিট (Heap size) সাধারণত ২ গিগাবাইটের কাছাকাছি থাকে। 
**`--max-old-space-size`** ফ্ল্যাগটি ব্যবহার করে এই ডিফল্ট মেমরি লিমিট বাড়ানো বা কমানো যায়। 
উধাহরনস্বরূপ, আপনার সার্ভারের RAM যদি বেশি থাকে এবং আপনার অ্যাপ্লিকেশন যদি বড় ডেটাসেট নিয়ে কাজ করে, তখন `node --max-old-space-size=4096 app.js` (এখানে 4096 MB বা 4 GB) ব্যবহার করে Node.js কে আরও বেশি মেমরি ব্যবহারের অনুমতি দেওয়া যায়।

### What happens when Node.js exceeds its memory limit?
যখন Node.js অ্যাপ্লিকেশন তার নির্ধারিত মেমরি (Heap limit) সম্পূর্ণ ব্যবহার করে ফেলে এবং Garbage Collector আর কোনো মেমরি খালি করতে পারে গুরুতে পারে না, তখন V8 ইঞ্জিন **"Fatal error: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory"** এরর প্রদান করে এবং অ্যাপ্লিকেশনটি সম্পূর্ণভাবে ক্র্যাশ (Crash) করে।

### How do you monitor heap usage in production?
Production-এ Heap usage মনিটর করার উপায়:
- **`process.memoryUsage()`:** এই ফাংশনের আউটপুট থেকে (বিশেষ করে `heapUsed` এবং `heapTotal`) মেট্রিক্স সংগ্রহ করা।
- **PM2 Dashboard:** PM2 ব্যবহার করলে `pm2 monit` কমান্ড বা PM2 Plus ড্যাশবোর্ড থেকে মেমরি ইউজেস দেখা।
- **Prometheus & Grafana:** `prom-client` মডিউল ব্যবহার করে অ্যাপ্লিকেশনের মেমরি মেট্রিক্স Prometheus-এ পাঠানো এবং Grafana-তে ভিজ্যুয়ালাইজ করা।
- **APM Tools (Datadog/New Relic/AppDynamics):** এগুলো স্বয়ংক্রিয়ভাবে মেমরি মনিটর করে এবং নির্দিষ্ট থ্রেশহোল্ড (Threshold) পার হলে সতর্কবার্তা (Alert) দেয়।

---

## 8. How do you scale a Node.js application horizontally?
**Horizontal Scaling (Scaling out):** হলো বিদ্যমান সার্ভারের (CPU/RAM) ক্ষমতা বৃদ্ধি না করে, একাধিক নতুন সার্ভার বা ইনস্ট্যান্স যোগ করে লোড ডিস্ট্রিবিউট করা।
Node.js-এ এটি করার উপায়:
- **Load Balancer (Nginx, AWS ALB):** ক্লায়েন্ট ট্রাফিক প্রথমে লোড ব্যালেন্সারে আসবে এবং সেটি পেছনে থাকা একাধিক Node.js সার্ভারের (instances) মধ্যে রিকোয়েস্ট ডিস্ট্রিবিউট করবে।
- **Stateless Architecture:** অ্যাপ্লিকেশনকে সম্পূর্ণ Stateless হতে হবে (সার্ভারের মেমরিতে কোনো সেশন বা ইউজার ডেটা না রাখা)। ডেটা বা সেশনগুলো একটি সেন্ট্রাল ডাটাবেস বা Redis-এ রাখতে হবে।
- **Containerization (Docker/Kubernetes):** অ্যাপটিকে ডকার ইমেজ (Docker Image) বানিয়ে কুবারনেটস ক্লাস্টারের (Kubernetes cluster) মাধ্যমে খুব সহজেই মাল্টিপল পডে (Pods) রান এবং স্কেল করা যায়।

### What is sticky session and when is it needed for stateful Node.js apps?
**Sticky Session (বা Session Affinity):** হলো Load Balancer-এর এমন একটি কনফিগারেশন, যা নিশ্চিত করে যে একজন নির্দিষ্ট ইউজারের সব রিকোয়েস্ট যেন সবসময় একই Node.js সার্ভার/ইনস্ট্যান্সে পাঠানো হয় (প্রথমবার যেটায় গিয়েছিল)।

এটি প্রয়োজন হয় যখন অ্যাপ্লিকেশনটি **Stateful** হয় (যেমন ওয়েব সকেট কানেকশন, Socket.io বা সেশন ডেটা সরাসরি সার্ভারের লোকাল মেমরিতে সেভ থাকে)। সেশন রেপ্লিকা না থাকলে ইউজার পরবর্তী রিকোয়েস্টে লগ-আউট হয়ে যেতে পারে বা সকেট কানেকশন ড্রপ হতে পারে।

### How do you handle session sharing across multiple Node.js instances using Redis?
একাধিক Node.js ইনস্ট্যান্স যখন একই টার্গেটে কাজ করে, তখন লোকাল মেমরির বদলে সেশন ডেটা একটি সেন্ট্রাল স্টোরে রাখতে হয়। এর জন্য **Redis** সবচেয়ে ভালো উপায়।
- **Express-session + Connect-Redis:** `express-session` প্যাকেজটিকে ক্যাশে স্টোর হিসেবে `connect-redis` এর সাথে যুক্ত করা হয়।
- ইউজার লগইন করলে তার সেশন ডেটা Redis-এ সেভ হয় এবং সেশন আইডি কুকিতে যায়।
- পরবর্তী রিকোয়েস্ট যে কোনো Node.js ইনস্ট্যান্সে (A, B বা C সার্ভার) গেলেও, সেই সার্ভার কুকির আইডি দিয়ে সরাসরি Redis থেকে ইউজারের সেশন ভ্যালিডেট করতে পারে। ফলে ইউজার লগ-আউট হয় না।

---

## 9. What is stream piping, and how does it improve performance?
**Stream Piping:** হলো একটি Readable Stream (যেখান থেকে ডেটা পড়া হচ্ছে)-এর আউটপুট সরাসরি একটি Writable Stream (যেখানে ডেটা লেখা হচ্ছে)-এর ইনপুট হিসেবে জোড়া লাগিয়ে দেওয়া। `readableStream.pipe(writableStream)` মেথড দিয়ে এটি করা হয়।

**Performance Improvement:** 
- এটি ডেটাকে সম্পূর্ণ মেমরিতে বাফার (Buffering) করার পরিবর্তে চাঙ্কে-চাঙ্কে (Chunk) প্রসেস করে। ফলে বিশাল ফাইলের (যেমন ২ জিবির ভিডিও) ক্ষেত্রেও খুব অল্প মেমরি (RAM) ব্যবহার হয়।
- ডেটা পড়ার সাথে সাথেই লেখা শুরু হওয়ায় ওভারঅল প্রোসেসিং অনেক ফাস্ট (Fast) হয়।
- এটি স্বয়ংক্রিয়ভাবে **Backpressure** হ্যান্ডেল করে, অর্থাৎ পড়ার গতি লেখার গতির চেয়ে বেশি হলে নিজে থেকেই পড়ার স্পীড অ্যাডজাস্ট করে।

### What is the difference between `pipe` and `pipeline` in Node.js streams?
- **`.pipe()`:** এটি স্ট্রিমগুলোকে একসাথে কানেক্ট করে, তবে এটি Error Handling স্বয়ংক্রিয়ভাবে করতে পারে না। যদি মাঝখানে কোনো স্ট্রিম ফেইল করে বা ক্র্যাশ করে, তাহলে ডেটা মেমরিতে আটকে (memory leak) যেতে পারে বা প্রসেস বন্ধ না ও হতে পারে।
- **`stream.pipeline()`:** এটি Node.js-এর একটি বিল্ট-ইন ইউটিলিটি, যা মাল্টিপল স্ট্রিমকে একত্রে পাইপ করার পাশাপাশি সঠিকভাবে **Error Handling** নিশ্চিত করে। কোনো একটি স্ট্রিমে এরর হলে বা কাজ শেষ হলে, এটি সুন্দরভাবে সবগুলো স্ট্রিমকে বন্ধ (Close/Destroy) করে দেয়। তাই প্রোডাকশনে `.pipe()` এর বদলে `pipeline()` ব্যবহার করা বেস্ট প্র্যাকটিস।

---

## 10. How do you optimize database queries in Node.js?
ডাটাবেস কুয়েরি অপটিমাইজ করার কিছু গুরুত্বপূর্ণ উপায়:
- **Indexing:** ডাটাবেস টেবিলে যেসব কলাম দিয়ে ফিল্টার (WHERE clause) বা সর্টিং হয়, সেগুলোতে Indexing ব্যবহার করা।
- **Selecting Only Required Fields:** `SELECT *` ব্যবহার না করে শুধু যে কলামগুলো প্রয়োজন সেগুলো ফেচ করা।
- **Caching:** বারবার রিড করা হয় এমন কুয়েরির রেজাল্ট Redis বা Memcached-এ স্টোর করে রাখা।
- **Avoid N+1 Query Problem:** লুপের ভেতরে বারবার ডাটাবেস কুয়েরি না চালিয়ে `JOIN` বা Populate (ORMs) ব্যবহার করা।
- **Pagination (`LIMIT` & `OFFSET`):** একসাথে হাজার হাজার ডেটা রিটার্ন না করে পেজিনেশন ব্যবহার করা।
- **Asynchronous Execution:** একাধিক স্বাধীন কুয়েরিকে (independent queries) প্যারালালি রান করতে `Promise.all()` ব্যবহার করা।

### What is query batching and how does it reduce database round trips?
**Query Batching:** হলো একাধিক ছোট ছোট ডাটাবেস কুয়েরিকে একত্রিত করে একসাথে একটি সিঙ্গেল রিকোয়েস্ট হিসেবে ডাটাবেসে পাঠানো। (যেমন: GraphQL-এ **Dataloader** ব্যবহার করে N+1 issue ফিক্স করা)।

এটি ডাটাবেসের **Round Trips** (সার্ভার থেকে ডাটাবেসে যাওয়া-আসার সময়) কমিয়ে দেয়। উদাহরণস্বরূপ, যদি ১০০ ইউজারের তথ্য আনতে ১০০টি আলাদা কুয়েরি চালানোর বদলে, সেগুলোকে ব্যাচ করে ১টি কুয়েরি হিসেবে (`SELECT WHERE ID IN (...)`) ডাটাবেসে পাঠানো হয়, তাহলে নেটওয়ার্ক ওভারহেড অনেকটা কমে যায় এবং পারফরম্যান্স অনেক ফাস্ট হয়।

### How do you use database connection pooling to improve throughput?
প্রত্যেকটি ডাটাবেস রিকোয়েস্টের জন্য নতুন কানেকশন তৈরি (Create) এবং বন্ধ (Destroy) করা অনেক সময়সাপেক্ষ এবং ব্যয়বহুল প্রসেস। 
**Connection Pooling** হলো আগে থেকেই তৈরি করে রাখা একাধিক ডাটাবেস কানেকশনের একটি রিজার্ভ বা পোল (Pool)। 
- যখনই Node.js থেকে কোনো কুয়েরি রান করার প্রয়োজন হয়, এটি পুল থেকে একটি খালি কানেকশন নিয়ে সেটি ব্যবহার করে এবং শেষে আবার কানেকশনটি পুলে ফেরত দিয়ে দেয়। 
- ফলে প্রতিবার কানেকশন তৈরি করার ওভারহেড (Overhead) থাকে না এবং ডাটাবেস দ্রুত রেসপন্স দিতে পারে, যা অ্যাপ্লিকেশনের ওভারঅল Throughput (প্রতি সেকেন্ডে প্রসেস করা রিকোয়েস্ট) বাড়িয়ে দেয়। `pg` বা `mysql2` এর মত লাইব্রেরিতে এটি বিল্ট-ইন থাকে। 