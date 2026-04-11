---
sidebar_position: 1
title: ''
---



## 1. What is Node.js, and what makes it different from other server-side technologies?

**Node.js** হলো Chrome এর **V8 JavaScript engine** এর উপর নির্মিত একটি open-source, cross-platform runtime environment। এটি JavaScript কে browser এর বাইরে, সরাসরি server এ চালানোর সুবিধা দেয়।

### Node.js অন্যদের থেকে কীভাবে আলাদা?
| বৈশিষ্ট্য | Node.js | Traditional Server (PHP, Java) |
|---|---|---|
| **Threading Model** | Single-threaded Event Loop | Multi-threaded (প্রতিটি request এ thread) |
| **I/O Model** | Non-blocking, Asynchronous | Blocking (I/O এর জন্য thread wait করে) |
| **Concurrency** | Event Loop দিয়ে হাজার connection | Thread per connection (RAM বেশি লাগে) |
| **Language** | JavaScript (frontend এ যা জানেন) | আলাদা language (Java, PHP, Python) |

### How does Node.js's single-threaded nature impact its performance under high concurrency?
- **সুবিধা:** I/O-bound কাজে অত্যন্ত efficient। একটি thread হাজার concurrent connection handle করতে পারে।
- **অসুবিধা:** CPU-bound task (heavy computation) পুরো event loop ব্লক করে দেয়।

```
Traditional: Request এলে → New thread (1MB RAM) → 10,000 req = 10GB RAM!
Node.js:     Request এলে → Event loop queue → I/O শেষে callback → All on 1 thread
```

### What kind of workloads is Node.js NOT well-suited for, and why?
- **এড়িয়ে চলুন:** Image/Video processing, ML model inference, heavy cryptography।
- **কারণ:** এগুলো CPU-intensive — single thread ব্লক করে অন্য সব request আটকে যায়।
- **সমাধান:** Worker Threads বা microservice হিসেবে আলাদা করুন।

### How does Node.js compare to Go or Rust for backend services?
| | Node.js | Go | Rust |
|---|---|---|---|
| **Performance** | ভালো (I/O bound) | খুব ভালো | সর্বোচ্চ |
| **Concurrency** | Event Loop | Goroutines | async/await |
| **DX** | সহজ, বিশাল ecosystem | সহজ, fast compile | কঠিন, steep curve |
| **Best For** | API, Real-time, Rapid dev | High performance API | System programming |

---

## 2. What is the event loop in Node.js?

**Event Loop** হলো Node.js এর হৃদয়। এটি single thread এ non-blocking asynchronous operation করার জন্য দায়ী।

### Can you explain the phases of the event loop in detail?
Event loop এর প্রতিটি iteration (tick) এ নিচের phases ক্রমান্বয়ে চলে:

```
   ┌───────────────────────────┐
   │          timers           │ ← setTimeout, setInterval callbacks
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │     pending callbacks     │ ← I/O error callbacks
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │   idle, prepare (internal)│
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │           poll            │ ← I/O callbacks (file read, network)
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │           check           │ ← setImmediate callbacks
   └─────────────┬─────────────┘
                 │
   ┌─────────────▼─────────────┐
   │      close callbacks      │ ← socket.on('close') etc.
   └───────────────────────────┘
```

### What is the difference between the microtask queue and the macrotask queue?
| Queue | কী আসে | Priority |
|---|---|---|
| **Microtask Queue** | `Promise.then`, `process.nextTick` | সর্বোচ্চ — প্রতিটি phase এর পরে empty করা হয় |
| **Macrotask Queue** | `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks | Event loop এর নির্দিষ্ট phase এ |

### How do `process.nextTick` and `Promise.resolve` interact with the event loop phases?
```javascript
console.log('1: start');

setTimeout(() => console.log('5: setTimeout'), 0);

Promise.resolve().then(() => console.log('3: Promise'));

process.nextTick(() => console.log('2: nextTick'));

console.log('4: end');

// Output: 1, 4, 2, 3, 5
// nextTick > Promise > setTimeout
```

- `process.nextTick`: Microtask এর মধ্যেও সর্বোচ্চ priority।
- `Promise.then`: Microtask, nextTick এর পরে।
- `setTimeout(0)`: Macrotask, সবার পরে।

---

## 3. What is the difference between synchronous and asynchronous code in Node.js?

- **Synchronous:** কোড ধাপে ধাপে চলে — একটি শেষ না হলে পরেরটি শুরু হয় না। Event loop ব্লক।
- **Asynchronous:** I/O operation শুরু করে, completion এর জন্য অপেক্ষা না করে পরের কাজ করে।

### How do you handle CPU-intensive synchronous tasks without blocking the event loop?
```javascript
// ❌ BAD — Event loop ব্লক করে
app.get('/hash', (req, res) => {
    const result = computeHeavyHash(req.body.data); // 2 সেকেন্ড block
    res.json({ result });
});

// ✅ GOOD — Worker Thread এ offload
const { Worker } = require('worker_threads');

app.get('/hash', (req, res) => {
    const worker = new Worker('./hash-worker.js', {
        workerData: req.body.data
    });
    worker.on('message', result => res.json({ result }));
});
```

### How do you offload synchronous work to Worker Threads?
```javascript
// hash-worker.js
const { workerData, parentPort } = require('worker_threads');
const result = computeHeavyHash(workerData); // আলাদা thread এ চলে
parentPort.postMessage(result);
```

---

## 4. What is the role of V8 in Node.js?

**V8** হলো Google এর open-source JavaScript engine — Chrome এবং Node.js উভয়েই ব্যবহৃত। এটি JavaScript কে machine code এ compile করে।

### How does V8 optimize JavaScript execution using JIT compilation?
- **Interpreter (Ignition):** প্রথমে JavaScript কে bytecode তে compile করে।
- **JIT Compiler (TurboFan):** Hot code (বারবার চলা code) detect করে → machine code এ optimize।
- **Deoptimization:** যদি assumption ভুল হয়, আবার interpreter এ ফিরে যায়।

### What is hidden class optimization in V8 and how does it affect performance?
```javascript
// ✅ GOOD — Same hidden class, fast
function Point(x, y) {
    this.x = x;
    this.y = y;
}
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

// ❌ BAD — Different hidden classes, slow
const p3 = {};
p3.x = 1;
const p4 = {};
p4.y = 2;  // Different property order → different hidden class
```
- Object এর property সবসময় একই ক্রমে যোগ করুন।
- Constructor function ব্যবহার করুন।

### What is the difference between V8's "young generation" and "old generation" memory spaces?
| Memory Space | বৈশিষ্ট্য | GC Type |
|---|---|---|
| **Young Generation (Scavenger)** | নতুন object, ছোট (1-8MB) | Minor GC — frequent, fast |
| **Old Generation** | Survive করা object, বড় | Major GC — infrequent, slower |

- Short-lived object যত বেশি, Minor GC তত ভালো।
- Global variable এ বড় object রাখলে Old Generation ভরে যায় — Major GC trigger।

---

## 5. What are the benefits of using Node.js for backend development?

- **JavaScript সর্বত্র:** Frontend এবং Backend একই ভাষা — context switch নেই।
- **NPM Ecosystem:** ২ মিলিয়নেরও বেশি package।
- **Non-blocking I/O:** High concurrency সহজে।
- **Real-time friendly:** WebSocket, SSE সহজে implement।
- **Fast development:** JSON native, REST API দ্রুত বানানো যায়।

### When would you choose Node.js over Django, Spring, or Laravel?
- **Node.js:** Real-time apps (chat, gaming), API-heavy, high concurrency, startup।
- **Django (Python):** ML integration, rapid CRUD, batteries included।
- **Spring (Java):** Enterprise, complex business logic, JVM ecosystem।

### How does sharing code between frontend and backend (isomorphic JS) benefit a team?
- Validation logic, business rules, model/type definitions একবার লিখুন — frontend ও backend এ ব্যবহার করুন।
- **উদাহরণ:** Zod schema, date utility functions, constants।

---

## 6. What is the difference between Node.js and traditional multi-threaded servers?

### How does Node.js handle concurrency without threads using the event loop?
```
Apache/Nginx (Multi-thread):           Node.js (Event Loop):
Request 1 → Thread 1 (blocked)        Request 1 → Callback queued
Request 2 → Thread 2 (blocked)        Request 2 → Callback queued
Request 3 → Thread 3 (blocked)        Request 3 → Callback queued
...                                    (all served by 1 thread, I/O async)
10k req = 10k threads = high RAM       10k req = 10k callbacks = low RAM
```

### What is the C10K problem and how does Node.js address it?
- **C10K:** ১০,০০০ concurrent connection handle করা — ২০০০ দশকে একটি বড় সমস্যা।
- Traditional server এ প্রতিটি connection এ thread — ১০K connection = ১০K thread = অব্যবহারিক।
- Node.js এর event loop ও non-blocking I/O দিয়ে ১০K+ connection একটি process এ।

### What are the downsides of the single-threaded model?
- **Unhandled exception:** একটি unhandled error পুরো process crash করে।
- **CPU-bound block:** Heavy computation সব request আটকে দেয়।
- **সমাধান:** `pm2` দিয়ে process restart, cluster mode, Worker Threads।

---

## 7. What is a REPL in Node.js?

**REPL** = Read-Eval-Print Loop। Node.js এর built-in interactive environment যেখানে JavaScript সরাসরি execute করা যায়।

```bash
$ node
> 2 + 2
4
> const name = "Node"
undefined
> `Hello, ${name}!`
'Hello, Node!'
> .exit
```

### How do you use the Node.js REPL for quick debugging and prototyping?
```bash
# Module load করুন
> const axios = require('axios')
> axios.get('https://api.github.com/users/nodejs').then(r => console.log(r.data.name))

# Multi-line code
> function add(a, b) {
...   return a + b
... }
> add(3, 4)
7
```

### What is the `_` variable in the REPL and what does it store?
- `_` সবসময় সর্বশেষ evaluated expression এর মান ধারণ করে।
```bash
> 10 * 5
50
> _
50
> _ + 10
60
```

---

## 8. What is the purpose of the `process` object in Node.js?

`process` হলো Node.js এর global object যা current process এর তথ্য এবং control provide করে।

### How do you access environment variables using `process.env`?
```javascript
// .env ফাইল থেকে load (dotenv package দিয়ে)
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
}
```

### What is `process.argv` and how do you use it to parse CLI arguments?
```javascript
// node app.js --port 3000 --env production
const args = process.argv.slice(2);
// ['--port', '3000', '--env', 'production']

// Popular alternative: minimist, commander, yargs
const { program } = require('commander');
program.option('--port <number>', 'Port number');
program.parse();
console.log(program.opts().port); // '3000'
```

### How do you gracefully shut down a Node.js process?
```javascript
const server = app.listen(3000);

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Graceful shutdown...');
    server.close(() => {
        // DB connection বন্ধ করুন
        db.disconnect();
        console.log('Process terminated.');
        process.exit(0);
    });
});
```

---

## 9. What are streams in Node.js, and why are they useful?

**Streams** হলো data এর continuous flow। বড় data (ফাইল, network) চাংক চাংক করে process করে — সম্পূর্ণ memory তে load না করেই।

```javascript
// ❌ BAD — পুরো 10GB file memory তে load
const data = fs.readFileSync('huge-file.csv');  // Out of Memory!

// ✅ GOOD — Chunk by chunk process
const readStream = fs.createReadStream('huge-file.csv');
readStream.on('data', chunk => processChunk(chunk));
```

### What are the four types of streams?
| ধরন | বর্ণনা | উদাহরণ |
|---|---|---|
| **Readable** | শুধু পড়া যায় | `fs.createReadStream()`, HTTP request |
| **Writable** | শুধু লেখা যায় | `fs.createWriteStream()`, HTTP response |
| **Duplex** | পড়া ও লেখা উভয় | TCP socket |
| **Transform** | পড়ে process করে লেখে | `zlib.createGzip()` (compress করে) |

### Can you give an example of using a Transform stream to compress data?
```javascript
const { createReadStream, createWriteStream } = require('fs');
const { createGzip } = require('zlib');
const { pipeline } = require('stream/promises');

async function compressFile(input, output) {
    await pipeline(
        createReadStream(input),
        createGzip(),
        createWriteStream(output)
    );
    console.log(`Compressed: ${input} → ${output}`);
}

compressFile('large-file.log', 'large-file.log.gz');
```

### What is backpressure in streams and how do you handle it?
- **Backpressure:** Writable stream যদি Readable এর চেয়ে ধীর হয় — data buffer এ জমে।
- `pipe()` বা `pipeline()` automatically backpressure handle করে।
```javascript
// pipeline backpressure handle করে, pipe() error handle করে না
const { pipeline } = require('stream/promises');
await pipeline(readableStream, transformStream, writableStream);
```

---

## 10. What is the difference between Node.js's CommonJS and ES Modules?

| বৈশিষ্ট্য | CommonJS (CJS) | ES Modules (ESM) |
|---|---|---|
| **Syntax** | `require()` / `module.exports` | `import` / `export` |
| **Loading** | Synchronous | Asynchronous (static analysis) |
| **File ext** | `.js` (default) | `.mjs` বা `"type":"module"` |
| **Top-level await** | নেই | আছে |
| **Tree shaking** | কঠিন | সম্ভব (bundler এর জন্য ভালো) |

### How do you use ES Modules in Node.js without a bundler?
```json
// package.json
{
  "type": "module"
}
```
```javascript
// app.mjs অথবা type:module হলে app.js
import express from 'express';
import { readFile } from 'fs/promises';
import myModule from './my-module.js';  // extension বাধ্যতামূলক

export const greet = (name) => `Hello, ${name}!`;
export default { greet };
```

### What is the difference between `require()` and `import`?
```javascript
// CommonJS — synchronous, runtime
const module = require('./module');  // যেকোনো জায়গায় ব্যবহার করা যায়
if (condition) {
    const optional = require('./optional');  // conditional load সম্ভব
}

// ESM — static, parse time
import module from './module.js';  // শুধু top-level এ
// Conditional: dynamic import() ব্যবহার করুন
if (condition) {
    const optional = await import('./optional.js');
}
```

### How do you migrate a CommonJS project to ES Modules?
1. `package.json` এ `"type": "module"` যোগ করুন।
2. সব `require()` → `import` এ বদলান।
3. `module.exports` → `export` এ বদলান।
4. File extension `.js` explicit করুন import path এ।
5. `__dirname` এবং `__filename` নেই — `import.meta.url` ব্যবহার করুন।
