---
sidebar_position: 1
title: 'Node.js Fundamentals'
---
## 3. What is the difference between synchronous and asynchronous code in Node.js?
**Synchronous (sync)** code মানে হলো — একটি কাজ শেষ না হওয়া পর্যন্ত পরের কাজ শুরু হবে না। একটি line execute হচ্ছে, বাকি সব **অপেক্ষা করছে**।

**Asynchronous (async)** code মানে হলো — একটি কাজ শুরু করে দাও, শেষ হওয়ার অপেক্ষা না করে পরের কাজে চলে যাও। কাজ শেষ হলে **callback / Promise / async-await** এর মাধ্যমে result পাবে।

#### তুলনামূলক দেখি — Code দিয়ে:
**❌ Synchronous — Thread Block হয়:**
```javascript
const fs = require('fs');

console.log('কাজ শুরু');

// পুরো file পড়া শেষ না হওয়া পর্যন্ত এখানে আটকে থাকবে
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log('File পড়া হলো:', data.length, 'characters');

console.log('কাজ শেষ');

// Output ক্রম:
// কাজ শুরু
// File পড়া হলো: 50000 characters   ← সব থেমে ছিল এই পর্যন্ত
// কাজ শেষ
```
**✅ Asynchronous — Thread Free থাকে:**
```javascript
const fs = require('fs');

console.log('কাজ শুরু');

// কাজ শুরু হয়ে গেল, কিন্তু thread এখানে আটকে থাকল না
fs.readFile('large-file.txt', 'utf8', (err, data) => {
    console.log('File পড়া হলো:', data.length, 'characters'); // পরে চলবে
});

console.log('কাজ শেষ'); // এটা আগেই চলে যাবে

// Output ক্রম:
// কাজ শুরু
// কাজ শেষ              ← আগেই চলে গেছে
// File পড়া হলো: 50000 characters   ← পরে callback এ এলো
```
#### একটা সহজ ছবি:
```
SYNCHRONOUS:
Task 1 ████████████ Task 2 ████████████ Task 3 ████████████
       (অপেক্ষা)           (অপেক্ষা)

ASYNCHRONOUS:
Task 1 ──────────────────────────────► complete!
Task 2 ──────────────────────────► complete!
Task 3 ──────────────────────────────────────► complete!
       (সব একসাথে চলছে, Event Loop manage করছে)
```
#### Async-এর ৩টি রূপ:
| রূপ | Example | ব্যবহার |
|-----|---------|---------|
| **Callback** | `fs.readFile('f', callback)` | পুরনো style, Callback Hell সমস্যা |
| **Promise** | `fetch(url).then().catch()` | Cleaner, chainable |
| **async/await** | `const data = await fetch(url)` | সবচেয়ে readable, modern |
```javascript
// ✅ async/await — সবচেয়ে clean way
const fs = require('fs').promises;

async function readFile() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log('Data:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

readFile();
```
> Synchronous code **simple** কিন্তু scalable না। Asynchronous code একটু জটিল কিন্তু Node.js-এর শক্তি — লক্ষ লক্ষ request handle করার ক্ষমতা এখান থেকেই আসে।

### How do you handle CPU-intensive synchronous tasks without blocking the event loop?
Node.js-এর Event Loop single-threaded। যদি কোনো **heavy computation** (যেমন image processing, encryption, large data sorting) main thread-এ চলে, তাহলে পুরো server **freeze** হয়ে যাবে।

#### সমস্যাটা দেখি:
```javascript
// ❌ এটা Event Loop block করে দেবে
app.get('/heavy', (req, res) => {
    let result = 0;
    for (let i = 0; i < 10_000_000_000; i++) {
        result += i; // এই সময় অন্য কোনো request serve হবে না!
    }
    res.json({ result });
});
```
**সমাধান — ৪টি উপায়:**

**✅ সমাধান ১: Worker Threads (সবচেয়ে ভালো)**
```javascript
// main.js
const { Worker } = require('worker_threads');

app.get('/heavy', (req, res) => {
    const worker = new Worker('./worker.js', { workerData: { limit: 10_000_000_000 } });

    worker.on('message', result => res.json({ result }));
    worker.on('error', err => res.status(500).json({ error: err.message }));
});

// worker.js
const { workerData, parentPort } = require('worker_threads');

let result = 0;
for (let i = 0; i < workerData.limit; i++) {
    result += i;
}
parentPort.postMessage(result); // main thread-কে result পাঠাও
```
**✅ সমাধান ২: Child Process**
```javascript
const { fork } = require('child_process');

app.get('/heavy', (req, res) => {
    const child = fork('./heavyTask.js');

    child.send({ limit: 10_000_000_000 });
    child.on('message', result => res.json({ result }));
});
```
**✅ সমাধান ৩: setImmediate দিয়ে কাজ ভাগ করা (chunking)**
```javascript
// ভারী কাজটাকে ছোট ছোট ভাগে ভাগ করো
function heavyTaskInChunks(total, chunkSize, callback) {
    let result = 0;
    let i = 0;

    function processChunk() {
        const end = Math.min(i + chunkSize, total);
        for (; i < end; i++) {
            result += i;
        }

        if (i < total) {
            setImmediate(processChunk); // পরের chunk আগামী tick-এ
        } else {
            callback(result);
        }
    }

    processChunk();
}

app.get('/heavy', (req, res) => {
    heavyTaskInChunks(10_000_000_000, 1_000_000, result => {
        res.json({ result });
    });
});
```
**✅ সমাধান ৪: External Queue (Bull/BullMQ + Redis)**
```
Request আসলো → Job Queue তে রাখো → Worker process সেটা তুলে কাজ করুক → Result পাঠাও
```
| সমাধান | কখন ব্যবহার করবে |
|--------|-----------------|
| **Worker Threads** | Same process-এ heavy computation |
| **Child Process** | আলাদা process দরকার, বেশি isolation চাই |
| **Chunking** | কাজটা ছোট ভাগে ভাগ করা সম্ভব |
| **Job Queue** | Background processing, retry logic দরকার |

### How do you offload synchronous work to Worker Threads?
**Worker Threads** হলো Node.js-এর built-in module (`worker_threads`) যা দিয়ে **আলাদা thread**-এ JavaScript code চালানো যায় — main Event Loop block না করেই।
```
Main Thread (Event Loop)
        │
        ├──► Worker Thread 1  (heavy calculation)
        ├──► Worker Thread 2  (image processing)
        └──► Worker Thread 3  (data encryption)
             (সব parallel এ চলছে, main thread free)
```
#### Complete Example:
```javascript
// worker.js — আলাদা thread এ চলবে
const { workerData, parentPort } = require('worker_threads');

function expensiveCalculation(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += Math.sqrt(i); // ভারী calculation
    }
    return result;
}

const result = expensiveCalculation(workerData.n);
parentPort.postMessage({ result }); // main thread-কে result পাঠাও
```
```javascript
// main.js — main thread
const { Worker } = require('worker_threads');
const path = require('path');

function runWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
            workerData
        });

        worker.on('message', resolve);    // result এলে resolve করো
        worker.on('error', reject);       // error এলে reject করো
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

// Usage
app.get('/calculate', async (req, res) => {
    try {
        const { result } = await runWorker({ n: 100_000_000 });
        res.json({ result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```
#### Worker Thread vs Child Process:
| বিষয় | Worker Thread | Child Process |
|------|--------------|---------------|
| Memory sharing | ✅ SharedArrayBuffer দিয়ে সম্ভব | ❌ সম্ভব না |
| Startup time | ⚡ দ্রুত | 🐢 তুলনামূলক ধীর |
| Isolation | কম (same process) | বেশি (separate process) |
| Crash impact | Main process-কে প্রভাবিত করতে পারে | Independent |
| কখন ব্যবহার করবে | CPU-bound JS tasks | Heavy, isolated OS tasks |
> Worker Threads ব্যবহার করে Node.js-এর single-thread limitation কাটিয়ে CPU-intensive কাজও efficiently করা সম্ভব — Event Loop কে free রেখেই।


## 4. What is the difference between Node.js and traditional multi-threaded servers?
###
Traditional web servers যেমন **Apache (PHP)** বা **Java Tomcat** প্রতিটি incoming request-এর জন্য একটি নতুন **thread** তৈরি করে। অন্যদিকে Node.js **একটিমাত্র thread** ব্যবহার করে সব request handle করে।

#### Architecture তুলনা:
```
Traditional Multi-threaded Server (Apache/Java):
────────────────────────────────────────────────
Request 1 ──► Thread 1 (RAM: ~1MB) ──► Response
Request 2 ──► Thread 2 (RAM: ~1MB) ──► Response
Request 3 ──► Thread 3 (RAM: ~1MB) ──► Response
Request N ──► Thread N (RAM: ~1MB) ──► Response
             ↑ ১০,০০০ request = ~10GB RAM 😱

Node.js (Event-Driven, Single-threaded):
────────────────────────────────────────────────
Request 1 ──┐
Request 2 ──┤
Request 3 ──┼──► Event Loop ──► I/O (async) ──► Response
Request N ──┘
             ↑ ১০,০০০ request কিন্তু ১টি thread ✅
```
#### বিস্তারিত তুলনা:
| বিষয় | Traditional Multi-threaded | Node.js |
|------|--------------------------|---------|
| **Threading Model** | প্রতি request-এ নতুন thread | Single thread, Event Loop |
| **Memory Usage** | বেশি (per-thread overhead) | কম (shared single thread) |
| **Concurrency** | Thread সংখ্যার উপর নির্ভরশীল | Event Loop — unlimited async |
| **I/O Handling** | Blocking (thread অপেক্ষা করে) | Non-blocking (async I/O) |
| **CPU-Bound Tasks** | ভালো (multi-core use করে) | দুর্বল (single thread block) |
| **Context Switching** | ঘন ঘন (OS overhead) | নেই (single thread) |
| **Scalability** | Vertical scaling সহজ | Horizontal scaling সহজ |
| **Best For** | CPU-intensive, stateful apps | I/O-intensive, real-time apps |
### How does Node.js handle concurrency without threads using the event loop?
Node.js concurrency achieve করে **Event Loop + Non-Blocking I/O** দিয়ে — thread তৈরি না করেই।

#### মূল কৌশল:
```
1. Request আসলো
       │
       ▼
2. Event Loop accept করলো
       │
       ├─► I/O কাজ? (DB, file, network)
       │         │
       │         ▼
       │   OS/libuv-কে দিয়ে দাও (async)
       │   Main thread free → অন্য request নাও
       │         │
       │         ▼ (কাজ শেষ হলে)
       │   Callback Queue তে রাখো
       │         │
       └─────────▼
          Event Loop callback তুলে Response পাঠায়
```
#### Real Code উদাহরণ — হাজার request একসাথে:
```javascript
const express = require('express');
const app = express();

// এই endpoint একসাথে হাজার request handle করতে পারে
app.get('/users', async (req, res) => {
    // DB query async — thread block হয় না
    const users = await db.query('SELECT * FROM users');
    res.json(users);
    // এই সময় অন্য request serve হচ্ছে!
});

// Proof — একই সময়ে ১০০০ request আসলেও fine
app.listen(3000);
```
> Node.js concurrency মানে **parallel execution** নয় — মানে **smart waiting**। কেউ I/O-এর জন্য অপেক্ষা করার সময় অন্যকে serve করো।
### What kind of workloads is Node.js not well-suited for, and why?
### What is the C10K problem and how does Node.js address it?
**C10K Problem** (১৯৯৯ সালে Dan Kegel তুলেছিলেন): একটি server কীভাবে **একসাথে ১০,০০০ client connection** handle করবে?

#### সমস্যার মূল কারণ (Traditional approach):
```
১০,০০০ clients
    │
    ▼
১০,০০০ threads তৈরি করো
    │
    ├─ প্রতি thread = ~1MB RAM → 10GB RAM লাগবে
    ├─ OS context switching overhead বাড়বে
    └─ Thread limit hit → নতুন connection refuse ❌
```
#### Node.js-এর সমাধান:
```
১০,০০০ clients
    │
    ▼
১টি Event Loop
    │
    ├─ Async I/O — OS-কে delegate করো
    ├─ libuv epoll/kqueue use করে
    └─ Callback ready হলে process করো ✅

RAM: ~50KB per connection (vs 1MB per thread)
→ 10,000 connections = ~500MB RAM (manageable!) ✅
```
```javascript
// Node.js automatically handles C10K
// কোনো configuration ছাড়াই ১০,০০০+ concurrent connections:
const net = require('net');

const server = net.createServer(socket => {
    socket.on('data', data => {
        socket.write(`Echo: ${data}`);
    });
});

server.listen(3000);
// ১০,০০০ connection? No problem — Event Loop manage করবে ✅
```
### What are the downsides of the single-threaded model?
Node.js-এর single-threaded model শক্তিশালী হলেও কিছু **সীমাবদ্ধতা** আছে:

**১. CPU-Intensive Task-এ Event Loop Block:**
```javascript
// ❌ এই code পুরো server freeze করে দেবে
app.get('/cpu-heavy', (req, res) => {
    const result = computePrimes(10_000_000); // সব request আটকে যাবে!
    res.json({ result });
});
```
**২. একটি Unhandled Error পুরো Server Crash:**
```javascript
// ❌ uncaught exception → process exit
app.get('/risky', (req, res) => {
    throw new Error('Unhandled!'); // পুরো server ক্র্যাশ!
});
// সমাধান: সবসময় try/catch বা error middleware ব্যবহার করো
```
**৩. Multi-Core CPU সম্পূর্ণ ব্যবহার হয় না:**
```javascript
// একটি Node.js process শুধু একটি CPU core ব্যবহার করে
// সমাধান: Cluster module
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    os.cpus().forEach(() => cluster.fork()); // প্রতিটি core-এ একটি worker
} else {
    require('./app'); // প্রতিটি worker same server চালায়
}
```
#### Downsides Summary:
| সমস্যা | সমাধান |
|--------|--------|
| CPU-bound tasks Event Loop block করে | Worker Threads / Child Process |
| Single point of failure | PM2, Cluster Module, uncaughtException handler |
| Multi-core use হয় না | Cluster Module / Load Balancer |
| Memory leak পুরো app-কে প্রভাবিত করে | Proper cleanup, heap monitoring |
| Callback Hell (পুরনো code) | async/await, Promise |
> Single-threaded model I/O-heavy, real-time app-এর জন্য আদর্শ। CPU কাজের জন্য Worker Threads বা external services ব্যবহার করো।

## 5. What is the role of V8 in Node.js?
**V8** হলো Google-এর তৈরি **open-source JavaScript engine**, যা originally Chrome browser-এর জন্য তৈরি। Node.js এই V8 engine-এর উপর build করা — মানে Node.js-এ যখন JavaScript code লেখো, সেটা V8 engine-ই execute করে।

#### V8 কী কী করে?
```
তোমার JavaScript Code
        │
        ▼
┌──────────────────────────────────┐
│           V8 Engine              │
│                                  │
│  1. Parsing (Code বোঝা)         │
│  2. AST তৈরি                    │
│  3. Bytecode Compilation         │
│  4. JIT Optimization             │
│  5. Machine Code Execute         │
│  6. Garbage Collection           │
└──────────────────────────────────┘
        │
        ▼
   CPU Result ✅
```
#### Node.js-এ V8-এর ভূমিকা:
**১. JavaScript Execution**
V8 ছাড়া Node.js JavaScript run করতে পারত না। V8 JavaScript-কে **machine code**-এ রূপান্তর করে CPU-তে চালায়।

**২. Memory Management**
V8 নিজেই **Heap memory** allocate ও **Garbage Collection** করে। তোমাকে manually memory free করতে হয় না।

**৩. Performance Optimization**
V8-এর **JIT (Just-In-Time) Compiler** code-কে runtime-এ optimize করে — প্রথমবারের চেয়ে পরে আরো দ্রুত চলে।

**৪. ES Features Support**
V8 update-এর সাথে সাথে নতুন JavaScript features (ES2022, ES2023...) Node.js-এও কাজ করে।
> V8 হলো Node.js-এর **engine** — গাড়ির মতো, Node.js হলো chassis আর V8 হলো ভেতরের engine যা সব চালায়।

### How does V8 optimize JavaScript execution using JIT compilation?
**JIT (Just-In-Time) Compilation** হলো এমন একটি technique যেখানে code **runtime-এ** compile হয় — আগে থেকে নয়, চলার সময়। এটি interpreter-এর flexibility এবং compiler-এর speed উভয়ই দেয়।

#### Traditional Approach vs JIT:
```
Interpreter (পুরনো উপায়):
JS Code → Line by line পড়ো → Execute করো (ধীর, কিন্তু flexible)

Compiler (C++ style):
Code → সব compile করো → Binary → Execute (দ্রুত, কিন্তু rigid)

JIT (V8-এর উপায়):
JS Code → Interpret করো → Hot spots খুঁজো → Compile করো → দ্রুত Execute ✅
```
#### V8-এর JIT Pipeline:
```
┌─────────────┐
│  JS Source  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Parser → AST   │  কোড বুঝে Abstract Syntax Tree তৈরি
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│    Ignition     │  Bytecode এ compile করো (interpreter)
│  (Interpreter)  │
└──────┬──────────┘
       │ hot code (বেশি বার চলে) detect হলে
       ▼
┌─────────────────┐
│   TurboFan      │  Optimized machine code তৈরি করো
│  (JIT Compiler) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Machine Code   │  সরাসরি CPU চালায় ⚡
└─────────────────┘
```
#### Optimization কীভাবে হয়?
**১. Hot Code Detection (Profiling)**
```javascript
function add(a, b) {
    return a + b;
}

// যদি এটা হাজারবার call হয়:
for (let i = 0; i < 100000; i++) {
    add(i, i + 1); // V8 দেখে — এটা "hot function"!
}
```
V8 দেখে `add()` বারবার call হচ্ছে। তখন TurboFan এটাকে **optimize করে machine code**-এ রূপান্তর করে।

**২. Type Speculation (Inline Caching)**
```javascript
// যদি সবসময় number আসে:
add(1, 2);     // number + number
add(3, 4);     // number + number
add(5, 6);     // number + number

// V8 assume করে — এটা সবসময় number, তাই integer-specific fast path তৈরি করে
```
**৩. Deoptimization (Bailout)**
```javascript
add(1, 2);        // number — fast path
add('hello', 2);  // STRING! V8 আগের assumption ভুল হয়ে গেল
                  // Deoptimize → আবার slow path এ যাও
```
> তাই JavaScript-এ **consistent types** ব্যবহার করলে V8 ভালো optimize করতে পারে।

### What is hidden class optimization in V8 and how does it affect performance?
V8 JavaScript object-এর property access দ্রুত করার জন্য **Hidden Class** (internal class) ব্যবহার করে। এটি C++ struct-এর মতো একটি internal structure।

#### সমস্যাটা কী?
JavaScript object dynamic — যেকোনো সময় property add/remove করা যায়। তাহলে V8 property কোথায় আছে সেটা কীভাবে দ্রুত খুঁজে পাবে?

#### Hidden Class কীভাবে কাজ করে:
```javascript
// যখন object তৈরি হয়:
const obj = {};           // Hidden Class C0 তৈরি → { }
obj.x = 10;               // Hidden Class C1 তৈরি → { x: at offset 0 }
obj.y = 20;               // Hidden Class C2 তৈরি → { x: at offset 0, y: at offset 8 }
```
```
C0 → (x যোগ হলে) → C1 → (y যোগ হলে) → C2
```
V8 এই transition chain মনে রাখে।

#### ✅ ভালো Pattern — Hidden Class Stable থাকে:
```javascript
// ✅ সবসময় একই ক্রমে property দাও
function Point(x, y) {
    this.x = x; // সবসময় x আগে
    this.y = y; // তারপর y
}

const p1 = new Point(1, 2); // C0→C1→C2
const p2 = new Point(3, 4); // C0→C1→C2 (same hidden class — fast! ✅)
```
#### ❌ খারাপ Pattern — Hidden Class ভেঙে যায়:
```javascript
// ❌ ভিন্ন ক্রমে property দিলে আলাদা hidden class তৈরি হয়
function Point(x, y) {
    if (x > 0) {
        this.x = x; // কখনো x আগে
        this.y = y;
    } else {
        this.y = y; // কখনো y আগে
        this.x = x;
    }
}
// p1 এবং p2 এর hidden class আলাদা → V8 optimize করতে পারবে না ❌
```
#### আরেকটি খারাপ উদাহরণ:
```javascript
// ❌ Dynamic property deletion
const obj = { x: 1, y: 2 };
delete obj.x; // Hidden class ভেঙে যায়! Performance কমে
```
#### Performance Impact Summary:
| Pattern | Result |
|---------|--------|
| Constructor-এ সব property initialize | ✅ Fast — stable hidden class |
| একই ক্রমে property যোগ | ✅ Fast — shared hidden class |
| Random order এ property যোগ | ❌ Slow — many hidden classes |
| `delete` ব্যবহার | ❌ Slow — hidden class breaks |
| `obj.x = undefined` (delete এর বদলে) | ✅ Better — class intact |
> Object তৈরির সময় **constructor-এ সব property initialize** করো এবং **consistent order** মেনে চলো — V8 সবচেয়ে ভালো optimize করতে পারবে।

### What is the difference between V8's "young generation" and "old generation" memory spaces?
V8-এর **Garbage Collector (GC)** memory-কে দুটো প্রধান ভাগে ভাগ করে রাখে। এটি **Generational GC** নামে পরিচিত — এই theory বলে: বেশিরভাগ object অল্প সময়ের জন্য থাকে, তারপর মরে যায়।
```
┌────────────────────────────────────────────────────┐
│                  V8 Heap Memory                     │
│                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   Young Generation  │  │   Old Generation     │  │
│  │   (New Space)       │  │   (Old Space)        │  │
│  │                     │  │                      │  │
│  │  ┌───────┬────────┐ │  │  দীর্ঘস্থায়ী object  │  │
│  │  │ From  │   To   │ │  │  বাস করে এখানে      │  │
│  │  │ Space │ Space  │ │  │                      │  │
│  │  └───────┴────────┘ │  │                      │  │
│  │  (1-8 MB)           │  │  (Hundreds of MB)    │  │
│  └─────────────────────┘  └─────────────────────┘  │
└────────────────────────────────────────────────────┘
```
#### Young Generation (New Space):
| বিষয় | বিবরণ |
|------|-------|
| **Size** | ছোট (1–8 MB) |
| **Object** | নতুন তৈরি, short-lived object |
| **GC Algorithm** | **Scavenger (Minor GC)** |
| **GC Speed** | ⚡ অত্যন্ত দ্রুত (milliseconds) |
| **কখন চলে** | প্রায়ই |
```javascript
// এই object Young Generation এ যাবে:
function processRequest(req) {
    const temp = { data: req.body }; // request শেষ হলে মরে যাবে
    return transform(temp);
}
```
Young Generation-এ **Scavenger** algorithm কাজ করে।সে From Space থেকে জীবিত object গুলো To Space-এ copy করে, মৃতগুলো ফেলে দেয়। তারপর From ↔ To swap হয়।

#### Old Generation (Old Space):
| বিষয় | বিবরণ |
|------|-------|
| **Size** | বড় (hundreds of MB বা বেশি) |
| **Object** | Young Generation থেকে **survive** করা object |
| **GC Algorithm** | **Mark-Sweep-Compact (Major GC)** |
| **GC Speed** | 🐢 তুলনামূলক ধীর |
| **কখন চলে** | কম, কিন্তু বেশি সময় নেয় |
```javascript
// এই object Old Generation এ যাবে:
const cache = new Map(); // application চলার পুরো সময় থাকবে

app.use((req, res, next) => {
    cache.set(req.url, someData); // বারবার GC survive করবে → Old Generation
    next();
});
```
**Promotion:** Young Generation-এ দুবার GC survive করলে object **Old Generation-এ promote** হয়।

#### Memory Lifecycle:
```
object তৈরি
     │
     ▼
Young Generation
(Minor GC বারবার চলে)
     │
     │ যদি দুবার survive করে
     ▼
Old Generation
(Major GC মাঝে মাঝে চলে)
     │
     │ আর reference নেই
     ▼
Garbage Collected ✅
```
#### Performance Tips:
| চর্চা | কারণ |
|-------|------|
| Short-lived object ব্যবহার করো | Young GC দ্রুত — কম cost |
| Global cache সীমিত রাখো | Old GC ধীর, Stop-the-world pause হয় |
| বড় array/buffer reuse করো | নতুন allocation এড়াও |
| Memory leak এড়াও | Old Generation ভরে গেলে Major GC বারবার চলে |
> Young Generation = দ্রুত জন্ম, দ্রুত মৃত্যু। Old Generation = দীর্ঘস্থায়ী বাসিন্দা। এই দুই স্তরের GC strategy Node.js-কে efficient memory management দেয়।

## 7. What is the purpose of the `process` object in Node.js?
`process` হলো Node.js-এ একটি **global object** — import ছাড়াই যেকোনো জায়গা থেকে ব্যবহার করা যায়। এটি **current Node.js process** সম্পর্কে সব তথ্য দেয় এবং process-কে control করার সুযোগ দেয়।

### `process` দিয়ে কী কী করা যায়:
```
process object
    │
    ├── Environment variables   → process.env
    ├── CLI arguments           → process.argv
    ├── Process info            → process.pid, process.version
    ├── Platform info           → process.platform, process.arch
    ├── Working directory       → process.cwd()
    ├── Memory usage            → process.memoryUsage()
    ├── Exit control            → process.exit()
    ├── Signal handling         → process.on('SIGTERM', ...)
    └── Standard I/O            → process.stdin, process.stdout, process.stderr
```
```javascript
console.log(process.pid);        // Current process ID: 12345
console.log(process.version);   // Node.js version: v20.0.0
console.log(process.platform);  // OS: linux / win32 / darwin
console.log(process.arch);      // CPU: x64 / arm64
console.log(process.cwd());     // Current directory: /home/user/myapp
console.log(process.uptime());  // Process চলার সময় (seconds)
```


### How do you gracefully shut down a Node.js process?
**Graceful shutdown** মানে — হঠাৎ server বন্ধ না করে, **চলমান request সম্পন্ন করে**, **resources cleanup করে**, তারপর বন্ধ হওয়া।

#### কেন দরকার?
```
❌ Abrupt shutdown (process.exit() সাথে সাথে):
  → চলমান HTTP request মাঝপথে কেটে যায়
  → Database connection ঠিকমতো বন্ধ হয় না
  → File write incomplete থাকতে পারে

✅ Graceful shutdown:
  → নতুন request নেওয়া বন্ধ করো
  → চলমান request শেষ হতে দাও
  → DB connection বন্ধ করো
  → তারপর exit করো
```


## 8. What are streams in Node.js, and why are they useful?
**Stream** হলো Node.js-এ এমন একটি mechanism যা **data-কে chunk by chunk** (ছোট ছোট টুকরায়) process করে — পুরো data memory-তে load না করেই।

#### কেন Stream দরকার?
```
❌ Stream ছাড়া (পুরো file memory-তে):
একটি 2GB video file পড়তে হলে:
→ 2GB RAM লাগবে
→ পুরো file load হওয়ার আগে কিছু করা যাবে না

✅ Stream দিয়ে (chunk by chunk):
→ একসাথে মাত্র কয়েক KB/MB RAM
→ পড়তে পড়তেই process করা যায়
→ User অনেক আগেই data পেতে শুরু করে
```

#### কোথায় Stream ব্যবহার হয়:
* Large file upload/download
* Video/Audio streaming (Netflix, YouTube)
* Real-time data processing (logs, events)
* HTTP request/response handling
* Database result streaming

### What are the four types of streams?

- ১. Readable Stream — শুধু পড়া যায়: উদাহরণ: `fs.createReadStream()`, `http.IncomingMessage`, `process.stdin`
- ২. Writable Stream — শুধু লেখা যায়: উদাহরণ: `fs.createWriteStream()`, `http.ServerResponse`, `process.stdout`
- ৩. Duplex Stream — পড়া এবং লেখা দুটোই: উদাহরণ: `net.Socket`, `TCP connection`
- ৪. Transform Stream — পড়তে পড়তে data বদলে দেয়: উদাহরণ: `zlib.createGzip()`, `crypto.createCipher()`


## 9. What is a REPL in Node.js?
###
**REPL** মানে **Read-Eval-Print Loop**। এটি Node.js-এর একটি built-in **interactive programming environment** যেখানে তুমি সরাসরি JavaScript code লিখলে সাথে সাথে execute হয় এবং result দেখায়।
```
R → Read    (তোমার input পড়ে)
E → Eval    (JavaScript হিসেবে evaluate করে)
P → Print   (result print করে)
L → Loop    (আবার input নেওয়ার জন্য অপেক্ষা করে)
```
#### REPL চালু করা:
```bash
$ node
Welcome to Node.js v20.0.0
Type ".help" for more information.
>
```
#### Basic ব্যবহার:
```javascript
> 2 + 3
5
> 'Hello' + ' ' + 'World'
'Hello World'
> Math.max(10, 20, 5)
20
> [1, 2, 3].map(x => x * 2)
[ 2, 4, 6 ]
```
#### REPL-এর Special Commands:
| Command | কাজ |
|---------|-----|
| `.help` | সব command দেখাও |
| `.exit` | REPL থেকে বের হও |
| `.save filename.js` | এই session-এর code save করো |
| `.load filename.js` | একটি file load করো |
| `.clear` | context reset করো |
| `Ctrl + C` | current expression cancel |
| `Ctrl + D` | REPL exit |
### How do you use the Node.js REPL for quick debugging and prototyping?
REPL হলো developer-এর **scratchpad** — কোনো file তৈরি না করেই idea quickly test করা যায়।

#### ১. Quick Math ও Logic Test:
```javascript
> const nums = [1, 2, 3, 4, 5]
undefined
> nums.filter(n => n % 2 === 0)
[ 2, 4 ]
> nums.reduce((acc, n) => acc + n, 0)
15
```
#### ২. Built-in Module Test:
```javascript
> const os = require('os')
undefined
> os.platform()
'linux'
> os.cpus().length
8
> os.freemem() / 1024 / 1024 + ' MB'
'1234.56 MB'
```
#### ৩. Regular Expression Test:
```javascript
> const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
undefined
> emailRegex.test('user@example.com')
true
> emailRegex.test('invalid-email')
false
```
#### ৪. Async Code Test:
```javascript
> const fetch = require('node-fetch')  // npm install করা থাকলে
> const res = await fetch('https://api.github.com/users/nodejs')
> const data = await res.json()
> data.public_repos
100
```
> Node.js REPL top-level `await` support করে (v14.8.0+)

#### ৫. Live Debugging — Object Inspect:
```javascript
> const obj = { name: 'Node', version: 20, features: ['async', 'streams'] }
undefined
> obj.features
[ 'async', 'streams' ]
> JSON.stringify(obj, null, 2)
'{\n  "name": "Node",\n  "version": 20,\n  "features": [\n    "async",\n    "streams"\n  ]\n}'
```

### What is the `_` variable in the REPL and what does it store?
REPL-এ `_` (underscore) একটি **special variable** যা সবসময় **সর্বশেষ evaluated expression-এর result** store করে।
```javascript
> 5 + 3
8
> _
8              // আগের result!

> 'hello'.toUpperCase()
'HELLO'
> _
'HELLO'        // সর্বশেষ result

> _ + '!!!'
'HELLO!!!'     // _ কে expression-এ ব্যবহার করা যায়
> _
'HELLO!!!'
```
#### Practical Use — ধাপে ধাপে calculation:
```javascript
> [1, 2, 3, 4, 5]
[ 1, 2, 3, 4, 5 ]
> _.filter(n => n > 2)
[ 3, 4, 5 ]
> _.map(n => n * 10)
[ 30, 40, 50 ]
> _.reduce((a, b) => a + b)
120
```
প্রতিটি step-এ আগের result `_`-এ ছিল, তাই নতুন করে variable declare করতে হলো না।
> ⚠️ `_` এ নিজে কিছু assign করলে এই behavior বন্ধ হয়ে যায়:
> ```javascript
> > _ = 'custom'
> Expression assignment to _ now disabled.
> 'custom'
> ```
> `_` হলো REPL-এর **history shortcut** — দ্রুত iterative testing-এর জন্য অত্যন্ত উপকারী।
