---
sidebar_position: 1
title: 'Advanced Node.js Topics'
---

## 97. What is the `child_process` module, and when is it useful?

Node.js সাধারণত single-threaded হয়। কিন্তু যদি আপনার এমন কোনো কাজ থাকে যা CPU-তে অনেক চাপ ফেলে (যেমন image processing, video encoding, বা large data parsing), অথবা যদি আপনি system-এর অন্য কোনো CLI command বা script (যেমন Python script, shell command) চালাতে চান, তখন `child_process` module ব্যবহার করা হয়। এটি Node.js-কে নতুন process তৈরি করার ক্ষমতা দেয়, ফলে main event loop block হয় না।

**কখন ব্যবহার করবেন:**
- External command বা system tool (যেমন `git`, `ls`, `grep`) চালানোর জন্য।
- CPU-intensive task গুলো আলাদা process-এ delegate করার জন্য।
- অন্য language-এ লেখা script (যেমন `.sh` বা `.py`) execute করার জন্য।

### What is the difference between `fork`, `spawn`, `exec`, and `execFile`?

Node.js-এ child process তৈরি করার জন্য ৪টি প্রধান method রয়েছে:

| Method | কীভাবে কাজ করে | Output | Use Case |
|---|---|---|---|
| `spawn` | Command-টিকে আলাদা process হিসেবে চালায় এবং output-কে **Stream** হিসেবে return করে। | Stream | Large data বা long-running process-এর জন্য (যেমন log file পড়া), কারণ এটি memory বাঁচায়। |
| `exec` | একটি shell চালু করে command চালায় এবং সম্পূর্ণ output-কে একটি **Buffer**-এ store করে callback-এর মাধ্যমে return করে। | Buffer / String | ছোট output সম্পন্ন simple command চালানোর জন্য (যেমন `ls -la` বা `git status`)। |
| `execFile` | `exec`-এর মতোই, কিন্তু এটি shell start না করে সরাসরি file execute করে। | Buffer / String | Shell না থাকায় এটি `exec`-এর চেয়ে দ্রুত এবং বেশি secure। |
| `fork` | এটি `spawn`-এর একটি special version, যা শুধুমাত্র নতুন **Node.js process** (V8 engine সহ) তৈরি করতে ব্যবহৃত হয়। | Stream + IPC | Node.js worker তৈরি করা এবং Inter-Process Communication (IPC) channel-এর মাধ্যমে message পাস করার জন্য। |

**উদাহরণ:**
```javascript
const { spawn, exec, fork } = require('child_process');

// spawn - data stream হিসেবে আসছে
const ls = spawn('ls', ['-lh', '/usr']);
ls.stdout.on('data', (data) => console.log(`stdout: ${data}`));

// exec - পুরো data একসাথে buffer-এ আসছে
exec('pwd', (error, stdout, stderr) => {
  if (error) return console.error(`error: ${error.message}`);
  console.log(`Current directory: ${stdout}`);
});

// fork - আলাদা Node process চালানো এবং message পাঠানো
const child = fork('worker.js');
child.send({ hello: 'world' });
child.on('message', (msg) => console.log('Message from child:', msg));
```

### What are the security risks of using `exec` with user input?

`exec` method-টি একটি **Shell** (যেমন `/bin/sh` বা `cmd.exe`) open করে command execute করে। তাই যদি আপনি directly user input-কে `exec`-এর ভেতরে পাস করেন, তবে **Command Injection** attack হওয়ার মারাত্মক ঝুঁকি থাকে।

**ঝুঁকিপূর্ণ কোড:**
```javascript
const { exec } = require('child_process');
const userFolder = req.query.folder; // User input: "mydir; rm -rf /"

// ❌ DANGEROUS! userFolder-এর string সরাসরি execute হবে
exec(`ls -l ${userFolder}`, (err, stdout) => { ... });
```
উপরের উদাহরণে, user যদি `mydir; rm -rf /` input দেয়, তবে `ls -l mydir` চলার পরপরই `rm -rf /` command চলে যাবে, যা পুরো server delete করে দিতে পারে।

**প্রতিরোধের উপায়:**
- **`execFile` বা `spawn` ব্যবহার করুন:** এগুলো shell open করে না, বরং argument গুলোকে raw data হিসেবে pass করে, ফলে injection সম্ভব হয় না।
- **Input sanitize করুন:** User input-কে validate এবং escape করুন।
- **`spawn` Example:**
```javascript
const { spawn } = require('child_process');
const userFolder = req.query.folder; // "mydir; rm -rf /"

// ✅ SAFE! পুরো input-টিকে একটি single folder name হিসেবে ট্রিট করবে
const ls = spawn('ls', ['-l', userFolder]);
```

## 98. What is the `fs` module, and how do you use it?

`fs` (File System) module হলো Node.js-এর একটি core module যা file এবং directory-র সাথে interact করার জন্য ব্যবহৃত হয়। এর মাধ্যমে file read, write, update, delete, এবং directory manage করা যায়।

`fs` module-এ প্রতিটি operation-এর ৩ ধরনের API আছে:
1. **Synchronous:** `fs.readFileSync()` - এটি event loop block করে। শুধুমাত্র app startup-এর সময় ব্যবহার করা উচিত।
2. **Callback-based:** `fs.readFile()` - Non-blocking, কিন্তু callback hell তৈরি করতে পারে।
3. **Promise-based:** `fs.promises.readFile()` - Modern approach, `async/await` ব্যবহার করা যায় এবং recommended।

**Promise-based ব্যবহার:**
```javascript
const fs = require('fs').promises;

async function fileOperations() {
  try {
    // Write
    await fs.writeFile('example.txt', 'Hello Node.js!');

    // Read
    const data = await fs.readFile('example.txt', 'utf8');
    console.log(data); // 'Hello Node.js!'

    // Append
    await fs.appendFile('example.txt', '\nNew line appended.');

    // Delete
    await fs.unlink('example.txt');
  } catch (err) {
    console.error('Operation failed:', err);
  }
}
```

### What is the difference between `fs.readFile` and `fs.createReadStream`?

এই দুটি method-ই file পড়ার জন্য ব্যবহৃত হয়, কিন্তু এদের Memory Management সম্পূর্ণ আলাদা:

| বৈশিষ্ট্য | `fs.readFile` | `fs.createReadStream` |
|---|---|---|
| **কীভাবে কাজ করে?** | পুরো file-টি একসাথে memory (RAM)-তে load করে এবং তারপর data return করে। | File-টিকে ছোট ছোট chunks (সাধারণত 64KB) আকারে পড়ে এবং stream হিসেবে পাঠায়। |
| **Memory Usage** | High. ২GB file পড়লে ২GB RAM দখল করবে। | Low. নির্দিষ্ট chunk size অনুযায়ী সামান্য RAM ব্যবহার করে। |
| **Speed/Latency** | পুরো file load না হওয়া পর্যন্ত অপেক্ষা করতে হয়। | প্রথম chunk পড়ার সাথে সাথেই data process করা শুরু করা যায়। |
| **Use Case** | ছোট file (যেমন config files, JSON data) পড়ার জন্য। | বড় file (যেমন video, large CSV, logs) এবং network-এ stream করার জন্য। |

**উদাহরণ:**
```javascript
// ❌ বড় file-এর জন্য খারাপ!
const fs = require('fs');
fs.readFile('largeVideo.mp4', (err, data) => {
  res.send(data); // Server-এর RAM ভর্তি হয়ে crash করতে পারে
});

// ✅ বড় file-এর জন্য সঠিক!
const chunkStream = fs.createReadStream('largeVideo.mp4');
chunkStream.pipe(res); // Memory efficient, সাথে সাথে client data পাওয়া শুরু করবে
```

## 99. What is the `http` module in Node.js?

`http` module হলো Node.js-এর core module যা দিয়ে HTTP server তৈরি করা এবং external HTTP request (REST calls) পাঠানো যায়। Express.js বা Fastify-এর মতো জনপ্রিয় framework-গুলো মূলত এই `http` module-এর উপর ভিত্তি করেই তৈরি।

**Basic HTTP Server তৈরি:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'success', message: 'Hello from raw HTTP!' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

server.listen(3000, () => {
  console.log('HTTP Server is running on port 3000');
});
```
*নোট:* Production-এ raw `http` module দিয়ে server বানানো অনেক জটিল (routing, body parsing ইত্যাদি নিজে করতে হয়)। তাই `Express` বা `Fastify` ব্যবহার করা হয়।

## 100. What is the `crypto` module, and how do you use it?

`crypto` module Node.js-এ cryptographic functionality প্রদান করে। এটি OpenSSL-এর উপর ভিত্তি করে তৈরি এবং এর মাধ্যমে hashing, encryption/decryption, signatures তৈরি এবং validation, এবং secure random bytes generate করা যায়।

**প্রধান Use Cases:**
1. **Hashing (e.g., Data integrity, passwords):**
যদিও password-এর জন্য `bcrypt` ভালো, সাধারণ data hashing-এর জন্য `crypto` ব্যবহৃত হয়।
```javascript
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('mySecretData').digest('hex');
console.log(hash); // 64-character hash
```

2. **Secure Random Tokens Generation (e.g., Password Reset, Session ID):**
```javascript
const resetToken = crypto.randomBytes(32).toString('hex');
console.log(resetToken); // Secure, unguessable string
```

3. **HMAC (Hash-based Message Authentication Code):** (Webhook verification-এ ব্যবহৃত হয়)
```javascript
const hmac = crypto.createHmac('sha256', 'my_secret_key')
                   .update('payload_data')
                   .digest('hex');
```

4. **Symmetric Encryption/Decryption (AES-256):**
```javascript
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Encrypt
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Confidential Message', 'utf8', 'hex');
encrypted += cipher.final('hex');

// Decrypt
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
```

## 101. What is the `zlib` module, and when is it useful?

`zlib` module data compression এবং decompression-এর জন্য ব্যবহৃত হয়। এটি Gzip, Deflate এবং Brotli-এর মতো compression algorithm সাপোর্ট করে।

**কখন ব্যবহার করবেন:**
- HTTP API Response size ছোট করার জন্য, যাতে network bandwidth বাঁচে এবং API দ্রুত load হয় (যদিও `compression` middleware এটি সহজে করে দেয়)।
- বড় file (e.g. log files, DB backups) compress করে disk space বাঁচানোর জন্য।

**Example: File Compress করা (`Gzip` ব্যবহার করে)**
```javascript
const zlib = require('zlib');
const fs = require('fs');

const readStream = fs.createReadStream('large_logs.txt');
const writeStream = fs.createWriteStream('large_logs.txt.gz');
const gzip = zlib.createGzip();

readStream.pipe(gzip).pipe(writeStream).on('finish', () => {
  console.log('File successfully compressed!');
});
```

### What is the trade-off between compression level and CPU usage?

Compression-এর ক্ষেত্রে দুটি প্রধান factor কাজ করে: **CPU Usage** এবং **File Size (Bandwidth)**।

- **High Compression Level (Level 9):** Data-কে সর্বোচ্চ পরিমাণ compress করে, ফলে file size খুব ছোট হয় এবং network bandwidth বাঁচে। কিন্তু এই level-এ compress করতে **CPU-তে প্রচুর চাপ পড়ে** এবং সময় বেশি লাগে (Latency বাড়ে)।
- **Low Compression Level (Level 1):** দ্রুত compress করে এবং CPU usage কম হয়, কিন্তু file size খুব একটা ছোট হয় না।
- **Default/Balanced (Level 6):** Node.js `zlib` default-ভাবে level 6 ব্যবহার করে, যা speed এবং compression ratio-এর মধ্যে চমৎকার balance দেয়।

**সিদ্ধান্ত:**
- **Static Files (CSS/JS):** একবার compress করে বারবার serve করা হয়, তাই সর্বোচ্চ compression (Level 9) ব্যবহার করা উচিত।
- **Dynamic API Responses:** প্রতি request-এ real-time compress করতে হয়, তাই CPU বাঁচাতে Level 4-6 ব্যবহার করা বুদ্ধিমানের কাজ।

## 102. What is the `net` module in Node.js?

`net` module ব্যবহার করে Node.js-এ asynchronous, event-driven network wrapper তৈরি করা যায়। এটি মূলত TCP (Transmission Control Protocol) সার্ভার এবং ক্লায়েন্ট তৈরি করার জন্য ব্যবহৃত হয়। HTTP module-ও নিজে internal-ভাবে এই `net` module-টিই ব্যবহার করে।

**Use Cases:**
- Custom protocol তৈরি করার জন্য (HTTP ছাড়া)।
- Real-time gaming server, chat application, বা IoT device-এর সাথে সরাসরি Data stream আদান-প্রদানের জন্য (যেখানে low-latency, persistent TCP connection প্রয়োজন)।

**TCP Server তৈরি:**
```javascript
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data) => {
    console.log(`Received: ${data.toString()}`);
    socket.write('Echo from server: ' + data);
  });

  socket.on('end', () => console.log('Client disconnected.'));
});

server.listen(8080, () => {
  console.log('TCP Server listening on port 8080');
});
```

## 103. What are Buffers in Node.js?

**Buffer** হলো Node.js-এর একটি global object যা fixed-size raw binary data store করার জন্য ব্যবহৃত হয়। JavaScript ঐতিহাসিকভাবে binary data (0 এবং 1) নিয়ে কাজ করতে পারতো না (শুধু text/unicode নিয়ে কাজ করতো)। কিন্তু file system বা network socket দিয়ে যখন stream-এ data আসে, তখন তা binary format-এই আসে। এই data-কে efficiently handle করতেই Buffer তৈরি করা হয়েছে।

- Buffer-এর size fixed থাকে, একবার তৈরি হলে resize করা যায় না।
- এটি V8 JavaScript engine-এর heap-এর বাইরে সরাসরি memory allocate করে, ফলে অত্যন্ত fast।

**ব্যবহার:**
```javascript
// string থেকে buffer
const buf = Buffer.from('Hello', 'utf8');
console.log(buf); // <Buffer 48 65 6c 6c 6f> (Hex format)

// Buffer থেকে string
console.log(buf.toString('utf8')); // 'Hello'

// খালি Buffer তৈরি (e.g., 10 bytes memory allocate করা)
const emptyBuf = Buffer.alloc(10);
```

### What is a zero-copy operation and how do Buffers enable it?

**Zero-copy** হলো OS (Operating System) লেভেলের একটি optimization যেখানে data-কে disk থেকে network socket-এ পাঠানোর সময় CPU-কে involve করে user-space memory-তে copy করা হয় না।

সাধারণত একটি file read করে HTTP response-এ পাঠাতে হলে data প্রথমে **Kernel Context** থেকে **User Context** (Node.js application memory) এ copy হয়, এবং তারপর আবার Network Interface-এ copy হয়। এতে memory ও CPU খরচ হয়।

Zero-copy operation-এ kernel সরাসরি disk থেকে network buffer-এ data পাঠিয়ে দেয়। Node.js-এ যখন আপনি `streams` ব্যবহার করে একটি file (e.g., `fs.createReadStream`) অন্য একটি writable stream-এ (e.g., `res`) `.pipe()` করেন, এবং data যদি `Buffer` হিসেবে থাকে (না string-এ convert করে), তখন OS level-এ zero-copy mechanism ব্যবহৃত হতে পারে। এর ফলে large file streaming-এর সময় dramatically performance বৃদ্ধি পায়।

---

## 104. What is the `cluster` module and how does it work internally?

Node.js single-threaded হওয়ায় এটি ডিফল্টভাবে মাল্টি-কোর CPU-র মাত্র একটি কোর (Core) ব্যবহার করতে পারে। **`cluster`** module এই সীমাবদ্ধতা দূর করে। এটি main application-এর একাধিক child process (যাদের **Worker** বলা হয়) তৈরি করে এবং মেশিনটির সব কটি CPU কোর ব্যবহার করে।

**কীভাবে কাজ করে?**
- একটি **Primary (বা Master) Process** তৈরি হয়, যা request গ্রহণ করার জন্য একটি পোর্ট (যেমন 3000) listen করে।
- Primary process, `cluster.fork()` ব্লকের মাধ্যমে একাধিক **Worker Process** তৈরি করে।
- প্রতিটি Worker Process আসলে Node.js-এর এক একটি স্বাধীন instance (নিজস্ব v8, memory এবং event loop সহ)।
- Primary process একটি load balancer (Round-robin algorithm) হিসেবে কাজ করে এবং incoming HTTP request-গুলোকে Worker-দের মাঝে distribute করে দেয়।

**উদাহরণ:**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary server started. Forking ${numCPUs} workers...`);

  // CPU-এর প্রতিটি কোরের জন্য একটি করে worker
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // কোনো worker ক্র্যাশ করলে নতুন একটি চালু করো (Resilience)
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Workers HTTP server চালাবে
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Handled by worker ${process.pid}\n`);
  }).listen(8000);
}
```

### How do you share state between cluster workers?

যেহেতু প্রতিটি Cluster Worker একটি সম্পূর্ণ আলাদা process, তাই তারা নিজেদের মধ্যে Memory (Variables, In-memory cache, Session data) share করতে পারে না। Worker 1-এ থাকা কোনো JavaScript object, Worker 2 থেকে access করা অসম্ভব।

**State share করার উপায়সমূহ:**
1. **External Database / Caching Service (Best Practice):**
   সবচেয়ে আধুনিক এবং স্কেলেবল উপায় হলো **Redis** বা **Memcached** ব্যবহার করা। প্রতিটি worker session, cache বা socket information এই সেন্ট্রাল Redis server-এ সেভ করবে এবং প্রয়োজনমতো read করবে।
2. **Inter-Process Communication (IPC):**
   Primary process এবং Worker-এর মধ্যে messaging-এর মাধ্যমে ডেটা শেয়ার করা। Worker `process.send({ msg: 'update' })` পাঠিয়ে Primary-কে জানাবে এবং Primary `cluster.workers` লুপ করে অন্য সব worker-কে তা জানিয়ে দেবে। (তবে এটি স্কেল করা কঠিন এবং slow)।
3. **Sticky Sessions (Socket.io-এর ক্ষেত্রে):**
   State sharing এড়ানোর জন্য Load Balancer-এ `Sticky Session` কনফিগার করা হয়, যাতে নির্দিষ্ট কোনো User-এর সব request সবসময় একই Worker-এর কাছেই যায়। এ পদ্ধতিতে memory share করার প্রয়োজন পড়ে না।

## 105. What are native addons in Node.js (N-API)?

**Native Addons** হলো C বা C++ এ লেখা ডাইনামিকলি লিঙ্ক করা shared object, যেগুলোকে `require()` function ব্যবহার করে সরাসরি Node.js-এ সাধারণ JavaScript module-এর মতো লোড এবং ব্যবহার করা যায়।

JavaScript-এ সব কাজ করা সম্ভব হলেও, কিছু নির্দিষ্ট লো-লেভেল বা heavy-computation কাজের জন্য C++ অনেক বেশি কার্যকরী। Native Addons সেই সুবিধাটি দেয়।

### When would you write a native C++ addon for Node.js?

আপনার কখন C++ Addon লেখা প্রয়োজন হতে পারে:
1. **CPU-Intensive Computation:** Machine Learning algorithm, video processing, image manipulation, বা custom cryptographic calculation-এর মতো কাজ যা JavaScript-এ অনেক ধীরগতিতে হয়। C++ Addon ব্যবহার করলে পারফরম্যান্স ১০-৫০ গুণ পর্যন্ত বাড়তে পারে।
2. **Integrating with existing C/C++ Libraries:** আপনার কাছে যদি আগে থেকেই C/C++ এ লেখা কোনো লিগ্যাসি লাইব্রেরি (যেমন OpenCV, SQLite C API) থাকে, তবে সেটি নতুন করে JavaScript-এ না লিখে সরাসরি Addon বানিয়ে ব্যবহার করা যায়।
3. **OS/Hardware Level Access:** অপারেটিং সিস্টেম বা হার্ডওয়্যারের এমন কিছু লো-লেভেল ফিচার ব্যবহার করা, যা Node.js-এর স্ট্যান্ডার্ড লাইব্রেরিতে নেই (যেমন সরাসরি USB port বা hardware driver এক্সেস করা)।

### What is N-API and how does it provide ABI stability?

**N-API (Node-API)** হলো C/C++ Addon তৈরি করার জন্য C language-এ লেখা একটি অফিশিয়াল API, যা Node.js প্রোজেক্ট কর্তৃক মেইনটেইন করা হয়।

**ABI Stability (Application Binary Interface Stability):**
আগে Native Addon-গুলো সরাসরি Google-এর V8 ইঞ্জিন API ব্যবহার করে লেখা হতো। এর সমস্যা ছিল, যখনই Node.js-এর নতুন ভার্সন আসতো এবং V8 ইঞ্জিন আপডেট হতো, তখন Addon-গুলো ভেঙে যেতো। ডেভেলপারদের প্রতিটি Node Version-এর জন্য অ্যাডঅনটি রি-কম্পাইল (Re-compile) করতে হতো।

**N-API এই সমস্যার সমাধান করেছে:**
এটি V8 এবং Addon-এর মাঝখানে একটি "abstraction layer" তৈরি করে দেয়। ফলে, আপনি একবার C++ কোড লিখে কম্পাইল করলে সেটি **ABI-stable** হয়ে যায়। এর মানে হলো, Node.js-এর ভার্সন (যেমন v14 থেকে v18) পরিবর্তন বা আপগ্রেড হলেও আপনার Compiled Addon-টি ব্রেক করবে না এবং কোনো Re-compilation ছাড়াই কাজ করবে।