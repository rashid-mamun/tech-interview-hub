---
sidebar_position: 1
title: ''
---


## 97. What is the `child_process` module, and when is it useful?

`child_process` দিয়ে Node.js থেকে external process চালানো যায় — shell command, Python script, CLI tool।

### What is the difference between `fork`, `spawn`, `exec`, and `execFile`?
| Method | কাজ | Use Case |
|---|---|---|
| `spawn` | Command stream দিয়ে চালায় | Long-running, large output |
| `exec` | Command চালায়, buffer এ output | Simple commands, small output |
| `execFile` | File directly চালায় (no shell) | Safer than exec |
| `fork` | নতুন Node.js process, IPC built-in | Separate Node.js worker |

```javascript
const { spawn, exec, execFile, fork } = require('child_process');

// spawn — streaming output
const ls = spawn('ls', ['-la', '/tmp']);
ls.stdout.on('data', (data) => console.log(data.toString()));
ls.on('close', (code) => console.log(`exited: ${code}`));

// exec — simple command
exec('git log --oneline -5', (err, stdout) => {
    if (err) throw err;
    console.log(stdout);
});

// fork — IPC সহ Node.js child
const child = fork('./worker.js', [], { silent: true });
child.send({ task: 'process', data: heavyData });
child.on('message', (result) => console.log('Result:', result));
```

### What are the security risks of using `exec` with user input?
```javascript
// ❌ DANGEROUS — Command injection
exec(`cat /files/${userInput}`, callback);
// userInput = "report.txt; rm -rf /"  → disaster!

// ✅ SAFE — execFile (no shell, no injection)
execFile('cat', [`/files/${sanitizedFileName}`], callback);

// ✅ SAFE — spawn (arguments array)
spawn('ls', ['-la', userProvidedPath]);
```

---

## 98. What is the `fs` module, and how do you use it?

```javascript
const fs = require('fs');
const { promises: fsPromises } = require('fs');

// Modern async (recommended)
const content = await fsPromises.readFile('config.json', 'utf8');
await fsPromises.writeFile('output.txt', 'Hello World');
await fsPromises.appendFile('log.txt', `${new Date().toISOString()}: entry\n`);
await fsPromises.rename('old.txt', 'new.txt');
await fsPromises.unlink('delete-me.txt');

const stats = await fsPromises.stat('file.txt');
console.log(`Size: ${stats.size} bytes, Modified: ${stats.mtime}`);

// Directory
await fsPromises.mkdir('new-folder', { recursive: true });
const files = await fsPromises.readdir('./src');

// File watcher
const watcher = fs.watch('./src', { recursive: true }, (event, filename) => {
    console.log(`${event}: ${filename}`);
});
// watcher.close(); // Stop watching
```

### What is the difference between `fs.readFile` and `fs.createReadStream`?
```javascript
// readFile — পুরো file memory তে load
const data = await fsPromises.readFile('huge.csv'); // 10GB = 10GB RAM used!

// createReadStream — chunk by chunk (memory efficient)
const stream = fs.createReadStream('huge.csv', { highWaterMark: 64 * 1024 }); // 64KB chunks
stream.on('data', chunk => process(chunk));
```
- **ছোট file (< 10MB):** `readFile` সহজ।
- **বড় file:** সবসময় `createReadStream`।

---

## 99. What is the `http` module in Node.js?

```javascript
const http = require('http');
const { URL } = require('url');

// Raw HTTP server (Express ছাড়া)
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Route matching
    if (req.method === 'GET' && url.pathname === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const users = await getUsers();
        res.end(JSON.stringify(users));
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/users') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const data = JSON.parse(body);
            const user = await createUser(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        });
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(3000, () => console.log('Server started'));
```

---

## 100. What is the `crypto` module, and how do you use it?

```javascript
const crypto = require('crypto');

// Secure random token (password reset, API key)
function generateToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex'); // 64 char hex string
}
const resetToken = generateToken(); // '3a9f2b...' (cryptographically secure)

// Hash
const hash = crypto.createHash('sha256').update('data').digest('hex');

// HMAC — request signing
function signRequest(data, secret) {
    return crypto.createHmac('sha256', secret)
        .update(typeof data === 'string' ? data : JSON.stringify(data))
        .digest('hex');
}

// Webhook verification
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-signature'];
    const expected = signRequest(req.body, process.env.WEBHOOK_SECRET);

    // Timing-safe comparison (timing attack রোধ)
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(400).send('Invalid signature');
    }
    processWebhook(req.body);
    res.sendStatus(200);
});

// Symmetric encryption
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
}
```

---

## 101. What is the `zlib` module, and when is it useful?

```javascript
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

// HTTP response compression (Express)
const compression = require('compression');
app.use(compression({ level: 6 })); // gzip level 6 (balance)

// File compression
async function compressFile(input, output) {
    await pipeline(
        fs.createReadStream(input),
        zlib.createBrotliCompress(),  // Brotli better than gzip
        fs.createWriteStream(output)
    );
}

// HTTP response manual gzip
app.get('/data', async (req, res) => {
    const data = await getLargeDataset();
    const json = JSON.stringify(data);

    if (req.headers['accept-encoding']?.includes('br')) {
        res.setHeader('Content-Encoding', 'br');
        await pipeline(
            Readable.from(json),
            zlib.createBrotliCompress(),
            res
        );
    } else {
        res.json(data);
    }
});
```

### What is the trade-off between compression level and CPU usage?
- **Level 1:** Fastest, least compression। Low traffic: speed হয় কিন্তু bandwidth বেশি।
- **Level 9:** Slowest, maximum compression। Static file serve এ একবার compress — worth it।
- **Production API:** Level 4-6 — balance of speed and compression।

---

## 102. What is the `net` module in Node.js?

```javascript
const net = require('net');

// Raw TCP server
const server = net.createServer((socket) => {
    console.log('Client connected:', socket.remoteAddress);

    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log('Received:', message);
        socket.write(`Echo: ${message}\n`);
    });

    socket.on('end', () => console.log('Client disconnected'));
    socket.on('error', (err) => console.error('Socket error:', err));
});

server.listen(9090, () => console.log('TCP server on port 9090'));

// TCP Client
const client = net.createConnection({ port: 9090 }, () => {
    client.write('Hello TCP Server!\n');
});
client.on('data', (data) => console.log('Server:', data.toString()));
```

---

## 103. What are Buffers in Node.js?

**Buffer:** Raw binary data নিয়ে কাজ করার জন্য — V8 heap এর বাইরে allocated (faster I/O)।

```javascript
// Buffer তৈরি
const buf1 = Buffer.alloc(10);                       // 10 bytes, zeros
const buf2 = Buffer.from('Hello World', 'utf8');     // String → Buffer
const buf3 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // 'Hello'

// Encoding convert
buf2.toString('utf8');  // 'Hello World'
buf2.toString('hex');   // '48656c6c6f...'
buf2.toString('base64'); // 'SGVsbG8gV29ybGQ='

// Buffer slice (view, no copy)
const slice = buf2.slice(0, 5); // 'Hello'

// Concatenate
const combined = Buffer.concat([buf2, Buffer.from(' World')]);

// Binary data manipulation
const num = Buffer.alloc(4);
num.writeUInt32BE(12345678, 0); // Big-endian 32-bit int write
console.log(num.readUInt32BE(0)); // 12345678
```

### What is a zero-copy operation and how do Buffers enable it?
- **Zero-copy:** OS kernel থেকে network socket এ data copy না করে directly send।
- Node.js `sendfile()` system call — disk → network, CPU involvement ছাড়া।
- Large file serve করতে **streams + Buffer** → OS level optimization।

---

## 104. What is the `cluster` module and how does it work internally?

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Primary ${process.pid} — spawning ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    // IPC — worker থেকে message
    cluster.on('message', (worker, message) => {
        console.log(`Worker ${worker.id}: ${JSON.stringify(message)}`);
        // Broadcast to all workers
        Object.values(cluster.workers).forEach(w =>
            w.send({ type: 'broadcast', data: message.data })
        );
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died — restarting`);
        cluster.fork();
    });
} else {
    require('./app').listen(3000);

    // Worker → Primary message
    process.send({ type: 'worker:ready', pid: process.pid });

    // Primary → Worker message
    process.on('message', (msg) => {
        if (msg.type === 'broadcast') handleBroadcast(msg.data);
    });
}
```

### How do you share state between cluster workers?
- Cluster worker আলাদা process — memory share হয় না।
- **Solution:** Redis (centralized state)।
- In-memory state → Redis তে সরান।

---

## 105. What are native addons in Node.js (N-API)?

```javascript
// binding.gyp
{
  "targets": [{
    "target_name": "my_addon",
    "sources": ["src/addon.cc"]
  }]
}
```

```cpp
// addon.cc (C++)
#include <napi.h>

Napi::Value FastHash(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string input = info[0].As<Napi::String>();
    // C++ level computation
    uint64_t hash = computeHash(input);
    return Napi::Number::New(env, hash);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("fastHash", Napi::Function::New(env, FastHash));
    return exports;
}
NODE_API_MODULE(my_addon, Init)
```

```javascript
// Node.js usage
const addon = require('./build/Release/my_addon');
const hash = addon.fastHash('my-data');
```

### When would you write a native C++ addon for Node.js?
- **CPU-intensive computation:** Hashing, encryption, image processing — C++ তে Node.js এর চেয়ে ১০-১০০x দ্রুত।
- **Existing C/C++ library reuse:** OpenCV, OpenSSL।
- **Low-level system access:** Hardware, OS API।

### What is N-API and how does it provide ABI stability?
- **N-API (নতুন: Node-API):** C API যা Node.js version এর সাথে ABI stable।
- একবার compile করলে সব Node.js version এ চলে — recompile দরকার নেই।
- আগে: NAN (Native Abstractions for Node) — version specific।
