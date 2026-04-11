---
sidebar_position: 1
title: ''
---



## 51. How do you optimize a Node.js application for performance?

Performance optimization এর ধাপসমূহ:
1. **Measure first:** আগে কোথায় সমস্যা তা জানুন।
2. **Profile:** Flame graph, heap snapshot।
3. **Fix bottleneck:** DB query, blocking code, memory leak।
4. **Verify:** আগের এবং পরের benchmark compare।

### What tools do you use to profile a Node.js app?
```bash
# Built-in V8 profiler
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# clinic.js — সবচেয়ে সহজ
npm install -g clinic
clinic doctor -- node app.js   # Overall health
clinic flame -- node app.js    # CPU flame graph
clinic bubbleprof -- node app.js  # Async delay

# 0x — Interactive flame graph
npx 0x app.js
```

### What is flame graph analysis and how do you read one?
- **X-axis:** Time (sampling এর % হিসেবে)।
- **Y-axis:** Call stack — নিচে caller, উপরে callee।
- **Wide box:** বেশি CPU time নিচ্ছে — optimize target।
- **Tall stack:** Deep recursion বা many middleware।

---

## 52. What is clustering in Node.js, and how does it improve performance?

Node.js single-threaded কিন্তু আধুনিক server এ ৪-৬৪টি CPU core আছে। **Cluster** দিয়ে সব core ব্যবহার করুন।

```javascript
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // প্রতিটি CPU core এর জন্য একটি worker
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Worker crash হলে নতুন তৈরি করুন
    cluster.on('exit', (worker, code) => {
        console.log(`Worker ${worker.process.pid} died. Forking new...`);
        cluster.fork();
    });
} else {
    // প্রতিটি worker আলাদা process
    const app = require('./app');
    app.listen(3000);
    console.log(`Worker ${process.pid} started`);
}
```

### How does the cluster module distribute incoming connections across workers?
- Linux: OS kernel এ `SO_REUSEPORT` — কার্নেল নিজেই distribute।
- Other OS: Primary process connection accept করে round-robin এ worker দেয়।

### What is the difference between clustering and using Worker Threads?
| | Cluster | Worker Threads |
|---|---|---|
| **Process** | আলাদা process (separate memory) | Same process (shared memory) |
| **Use case** | HTTP server scale | CPU-bound computation |
| **Communication** | IPC (message passing) | SharedArrayBuffer, MessageChannel |
| **Overhead** | বেশি (process overhead) | কম |
| **Independence** | Crash isolated | Error একটি crash করলে সব |

---

## 53. What is the `pm2` process manager, and how does it help?

**pm2** হলো production Node.js process manager। Auto-restart, cluster mode, monitoring।

```bash
# Install
npm install -g pm2

# Start
pm2 start app.js                      # Single process
pm2 start app.js -i max               # Cluster (সব CPU core)
pm2 start app.js --name "my-api"      # Named process
pm2 start ecosystem.config.js          # Config file

# Monitor
pm2 status
pm2 monit                             # Real-time CPU/memory
pm2 logs                              # Log streaming

# Deploy
pm2 reload my-api                     # Zero-downtime reload
pm2 restart my-api                    # Full restart

# Startup
pm2 startup                           # System reboot এ auto-start
pm2 save                              # Current process list save
```

### How do you configure `pm2` for zero-downtime deployments?
```javascript
// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'my-api',
        script: 'src/index.js',
        instances: 'max',           // সব CPU core
        exec_mode: 'cluster',
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        // Zero-downtime reload
        wait_ready: true,           // process.send('ready') এর জন্য অপেক্ষা
        listen_timeout: 10000,
        kill_timeout: 5000
    }]
};
```
```javascript
// app.js — Ready signal
app.listen(3000, () => {
    process.send?.('ready'); // pm2 কে জানান
});
```

---

## 54. How do you implement caching in Node.js?

```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern
async function getUser(userId) {
    const cacheKey = `user:${userId}`;

    // ১. Cache check
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    // ২. Cache miss → DB fetch
    const user = await db.users.findById(userId);
    if (!user) throw new Error('User not found');

    // ৩. Cache store (1 hour TTL)
    await redis.setex(cacheKey, 3600, JSON.stringify(user));

    return user;
}

// Cache invalidation (user update এ)
async function updateUser(userId, data) {
    const user = await db.users.update(userId, data);
    await redis.del(`user:${userId}`); // Invalidate
    return user;
}
```

### What is the difference between in-memory caching and Redis caching?
| | In-memory (node-cache) | Redis |
|---|---|---|
| **Scope** | Single process | All servers shared |
| **Restart** | Cache হারায় | Persistent (optional) |
| **Scale** | Multi-server এ inconsistent | Centralized |
| **Speed** | দ্রুততর (no network) | Slightly slower (network hop) |
| **Use case** | Single server, static config | Production, multi-server |

---

## 55. What is the Worker Threads module, and when is it useful?

```javascript
// main.js
const { Worker } = require('worker_threads');

function runWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: data
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker exited: ${code}`));
        });
    });
}

// CPU-heavy task offload
app.post('/process-image', async (req, res) => {
    const result = await runWorker({ image: req.body.imageBuffer });
    res.json({ processed: result });
});
```

```javascript
// worker.js
const { workerData, parentPort } = require('worker_threads');
const result = processCPUHeavyTask(workerData.image);
parentPort.postMessage(result);
```

### How do you share memory between Worker Threads using `SharedArrayBuffer`?
```javascript
// Shared memory — zero-copy data sharing
const shared = new SharedArrayBuffer(4); // 4 bytes
const array = new Int32Array(shared);
array[0] = 42;

const worker = new Worker('./worker.js', {
    workerData: { shared }
});

// worker.js
const { workerData } = require('worker_threads');
const array = new Int32Array(workerData.shared);
console.log(array[0]); // 42 — copy ছাড়াই পড়া যায়

// Atomics — concurrent access safe করুন
Atomics.add(array, 0, 1); // Thread-safe increment
```

---

## 56. How do you handle memory leaks in Node.js?

### What are the most common causes of memory leaks?
```javascript
// ১. Global variables
global.bigData = []; // Never GC হয়
for (let i = 0; i < 1000000; i++) global.bigData.push({...});

// ২. Event listener not removed
const emitter = new EventEmitter();
setInterval(() => {
    emitter.on('data', handler); // বারবার add, কখনো remove নেই!
}, 100);

// ৩. Closures holding references
function createClosure() {
    const largeData = new Array(1000000).fill('data');
    return function() {
        return largeData[0]; // largeData GC হবে না
    };
}

// ৪. Cache without bounds
const cache = {};
setInterval(() => {
    cache[Date.now()] = new Array(1000).fill('data'); // বাড়তেই থাকে!
}, 10);
```

### What tools help identify memory leaks?
```bash
# Chrome DevTools memory profiling
node --inspect app.js
# Chrome: chrome://inspect → Memory tab → Heap snapshot

# heapdump
const heapdump = require('heapdump');
process.on('SIGUSR2', () => heapdump.writeSnapshot());
# kill -USR2 <pid>  → snapshot.heapsnapshot file

# clinic.js
clinic heapprofiler -- node app.js
```

---

## 57. What is the purpose of the `--max-old-space-size` flag?

```bash
# Default: 1.5GB (64-bit systems)
node --max-old-space-size=4096 app.js  # 4GB RAM allow

# Production সেট করার উপায়
NODE_OPTIONS="--max-old-space-size=2048" node app.js
```

### What happens when Node.js exceeds its memory limit?
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```
- Process crash হয় — `pm2` বা Kubernetes restart করবে।
- **সমাধান:** Memory limit বাড়ান, memory leak fix করুন, Worker Threads এ heavy work।

### How do you monitor heap usage in production?
```javascript
// Health check endpoint এ
app.get('/health', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
        status: 'ok',
        memory: {
            heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
            rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
        }
    });
});
```

---

## 58. How do you scale a Node.js application horizontally?

```
Load Balancer (Nginx/AWS ALB)
    ├── Node.js Instance 1 (port 3000)
    ├── Node.js Instance 2 (port 3001)
    └── Node.js Instance 3 (port 3002)
         ↓
    Shared Redis (session, cache)
         ↓
    Shared PostgreSQL (with read replicas)
```

### What is sticky session and when is it needed for stateful Node.js apps?
- **Sticky session:** একই client এর request সবসময় same server এ যায়।
- **কখন দরকার:** Server-side session (express-session) বা WebSocket।
- **ভালো সমাধান:** Stateless করুন — session Redis এ রাখুন, sticky session এড়ান।

### How do you handle session sharing across multiple Node.js instances using Redis?
```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

app.use(session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));
// এখন সব instance একই Redis থেকে session পড়বে
```

---

## 59. What is stream piping, and how does it improve performance?

```javascript
const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

// ❌ Without streaming — পুরো file memory তে
app.get('/download', async (req, res) => {
    const data = await fs.promises.readFile('large-file.zip'); // 1GB memory!
    res.send(data);
});

// ✅ With streaming — chunk by chunk
app.get('/download', async (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    await pipeline(
        fs.createReadStream('large-file.zip'),
        res  // HTTP response stream
    );
});

// Compress on-the-fly
app.get('/compressed', async (req, res) => {
    res.setHeader('Content-Encoding', 'gzip');
    await pipeline(
        fs.createReadStream('large-file.csv'),
        zlib.createGzip(),
        res
    );
});
```

### What is the difference between `pipe` and `pipeline` in Node.js streams?
```javascript
// pipe — error propagation নেই, cleanup করে না
readStream.pipe(gzip).pipe(writeStream);
// readStream error হলে writeStream open থেকে যায় → resource leak!

// pipeline (recommend) — error handle করে, cleanup করে
const { pipeline } = require('stream/promises');
await pipeline(readStream, gzip, writeStream);
// যেকোনো error হলে সব stream destroy করে
```

---

## 60. How do you optimize database queries in Node.js?

```javascript
// ❌ N+1 problem — প্রতিটি user এর জন্য আলাদা query
const users = await User.findAll();
for (const user of users) {
    const orders = await Order.findAll({ where: { userId: user.id } });
    // 1 (users) + N (orders) = N+1 queries!
}

// ✅ Eager loading — একটি JOIN query
const users = await User.findAll({
    include: [{ model: Order }]
});

// ✅ Query batching with DataLoader
const DataLoader = require('dataloader');
const orderLoader = new DataLoader(async (userIds) => {
    const orders = await Order.findAll({
        where: { userId: { [Op.in]: userIds } }
    });
    return userIds.map(id => orders.filter(o => o.userId === id));
});
```

### What is query batching and how does it reduce database round trips?
- **Batching:** অনেকগুলো single query কে একটি bulk query তে পরিণত করা।
- DataLoader: `userIds = [1, 2, 3, 4]` → `SELECT * FROM orders WHERE user_id IN (1, 2, 3, 4)` — ১টি query।

### How do you use database connection pooling to improve throughput?
```javascript
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,                  // Max connections
    min: 2,                   // Minimum idle connections
    idleTimeoutMillis: 30000, // 30s idle এ close
    connectionTimeoutMillis: 2000, // 2s এ connection পেতে না পারলে error
});

// Pool automatically reuse করে
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```
