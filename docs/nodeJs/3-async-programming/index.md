---
sidebar_position: 1
title: ''
---



## 21. What are callbacks in Node.js, and what is callback hell?

**Callback** হলো এমন একটি function যাকে argument হিসেবে পাঠিয়ে asynchronous কাজ শেষ হলে call করা হয়।

**Callback Hell (Pyramid of Doom):**
```javascript
// ❌ Callback hell — পড়তে কঠিন, error handle করা কঠিন
getUser(id, (err, user) => {
    if (err) return handleError(err);
    getOrders(user.id, (err, orders) => {
        if (err) return handleError(err);
        getProducts(orders[0].id, (err, products) => {
            if (err) return handleError(err);
            sendEmail(user.email, products, (err, result) => {
                if (err) return handleError(err);
                console.log('Done!');
            });
        });
    });
});
```

### How do you avoid callback hell using Promises or `async/await`?
```javascript
// ✅ Promise chaining
getUser(id)
    .then(user => getOrders(user.id))
    .then(orders => getProducts(orders[0].id))
    .then(products => sendEmail(user.email, products))
    .then(() => console.log('Done!'))
    .catch(handleError);

// ✅ async/await (সবচেয়ে পরিষ্কার)
async function processOrder(userId) {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const products = await getProducts(orders[0].id);
    await sendEmail(user.email, products);
    console.log('Done!');
}
```

### What is the error-first callback convention and why is it used?
```javascript
// Node.js standard: প্রথম argument সবসময় error
fs.readFile('file.txt', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log(data.toString());
});
```

### How do you convert a callback-based library to Promises using `util.promisify`?
```javascript
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);

// এখন Promise ব্যবহার করা যাবে
const data = await readFile('file.txt', 'utf8');
```

---

## 22. What are Promises in Node.js, and how do they work?

**Promise** হলো future value এর একটি wrapper। তিনটি state থাকে: `pending`, `fulfilled`, `rejected`।

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = true;
        if (success) resolve('Data fetched!');
        else reject(new Error('Failed to fetch'));
    }, 1000);
});

promise
    .then(data => console.log(data))    // fulfilled
    .catch(err => console.error(err))   // rejected
    .finally(() => console.log('Done')); // সবসময়
```

### How do you handle Promise rejections globally?
```javascript
// Unhandled rejection — process crash রোধ করুন
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Log করুন, alert পাঠান, তারপর gracefully shutdown
    process.exit(1);
});
```

### What is Promise chaining and what are its pitfalls?
```javascript
// ✅ Correct chaining — প্রতিটি then value return করুন
fetchUser(1)
    .then(user => fetchOrders(user.id))  // Promise return করুন
    .then(orders => processOrders(orders))
    .catch(err => handleError(err));

// ❌ Common mistake — return না করলে chain ভেঙে যায়
fetchUser(1)
    .then(user => {
        fetchOrders(user.id);  // return নেই! পরের then undefined পাবে
    })
    .then(orders => console.log(orders)); // undefined!
```

---

## 23. What is `async/await`, and how does it simplify asynchronous code?

`async/await` হলো Promises এর উপর syntactic sugar — asynchronous code কে synchronous এর মতো দেখায়।

```javascript
// async function সবসময় Promise return করে
async function fetchUser(id) {
    const user = await db.users.findById(id); // Promise unwrap
    return user;
}
```

### How do you handle errors in `async/await` using `try/catch`?
```javascript
async function getUser(id) {
    try {
        const user = await db.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    } catch (err) {
        // DB error এবং custom error উভয়ই catch হবে
        logger.error('getUser failed:', err);
        throw err; // Re-throw করুন অথবা custom error
    }
}
```

### What happens if you forget the `await` keyword before a Promise?
```javascript
async function example() {
    const data = fetchData(); // await ভুলে গেলে
    // data = Promise object, not the actual data!
    console.log(data); // Promise { <pending> }
    console.log(data.name); // undefined (Promise এ name নেই)
}
```

### How do you run multiple async operations in parallel?
```javascript
// ❌ Sequential — একটার পর একটা (ধীর)
const user = await getUser(id);      // 200ms wait
const orders = await getOrders(id);  // 200ms wait
// Total: 400ms

// ✅ Parallel — একসাথে (দ্রুত)
const [user, orders] = await Promise.all([
    getUser(id),
    getOrders(id)
]);
// Total: ~200ms (parallel)
```

---

## 24. What is the difference between `setTimeout`, `setInterval`, and `setImmediate`?

| Function | কাজ | Event Loop Phase |
|---|---|---|
| `setTimeout(fn, 0)` | ন্যূনতম delay এর পরে | timers phase |
| `setInterval(fn, ms)` | বারবার চলে | timers phase |
| `setImmediate(fn)` | Current poll phase এর পরেই | check phase |
| `process.nextTick(fn)` | Current operation এর পরেই | (phase এর আগে) |

### When would you use `setImmediate` over `setTimeout(fn, 0)`?
```javascript
// setImmediate: I/O callback এর পরে নিশ্চিতভাবে চলবে
fs.readFile('file.txt', () => {
    setTimeout(() => console.log('timeout'), 0);
    setImmediate(() => console.log('immediate'));
    // Output: 'immediate' আগে (I/O callback এর মধ্যে থেকে)
});
```

### What is `queueMicrotask` and how does it differ from `setImmediate`?
```javascript
// Priority: nextTick > queueMicrotask > Promise.then > setImmediate > setTimeout
queueMicrotask(() => console.log('microtask'));
setImmediate(() => console.log('immediate'));
// queueMicrotask আগে চলবে
```

---

## 25. What is the `async` module, and when is it useful?

`async` npm module হলো callback-based asynchronous control flow library।

```javascript
const async = require('async');

// async.waterfall — ধাপে ধাপে, পূর্ববর্তী result পরবর্তীতে যায়
async.waterfall([
    callback => db.getUser(id, callback),
    (user, callback) => db.getOrders(user.id, callback),
    (orders, callback) => processOrders(orders, callback)
], (err, result) => {
    if (err) return handleError(err);
    console.log('Done:', result);
});
```

### What is `async.parallel` and `async.series`?
```javascript
// async.parallel — সব একসাথে চলে
async.parallel({
    user: cb => db.getUser(id, cb),
    orders: cb => db.getOrders(id, cb),
}, (err, results) => {
    console.log(results.user, results.orders);
});

// async.series — একটির পর একটি (waterfall এর মতো কিন্তু result pass করে না)
async.series([task1, task2, task3], (err) => { /**/ });
```

> **আজকাল:** Native `Promise.all()` এবং `async/await` এর কারণে `async` module কম ব্যবহৃত।

---

## 26. How do you handle parallel asynchronous operations in Node.js?

### What is the difference between `Promise.all` and `Promise.allSettled`?
| | `Promise.all` | `Promise.allSettled` |
|---|---|---|
| **একটি reject হলে** | সাথে সাথে reject | সব শেষ হওয়ার পরে result দেয় |
| **Return** | সব fulfilled value | `{status, value/reason}` array |
| **Use case** | সব দরকার, fail fast | কিছু fail হলেও বাকিগুলো চাই |

```javascript
// Promise.allSettled — সব result পাবো
const results = await Promise.allSettled([
    fetchUser(1),
    fetchUser(999),  // 404 error
    fetchUser(2)
]);

results.forEach(result => {
    if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
    } else {
        console.log('Failed:', result.reason);
    }
});
```

### What is `Promise.race` and when is it useful?
```javascript
// প্রথম যেটি settle করে সেটির result পাওয়া
const result = await Promise.race([
    fetchData(),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
    )
]);
// 5 সেকেন্ডের বেশি লাগলে timeout error
```

### How do you limit concurrency when running many async operations in parallel?
```javascript
const pLimit = require('p-limit');
const limit = pLimit(5); // একসাথে max 5 concurrent

const urls = Array.from({ length: 100 }, (_, i) => `https://api.example.com/${i}`);

const results = await Promise.all(
    urls.map(url => limit(() => fetch(url).then(r => r.json())))
);
// ১০০ request পাঠাবে কিন্তু একসাথে ৫টির বেশি না
```

---

## 27. What is an EventEmitter in Node.js?

`EventEmitter` হলো Node.js এর event-driven programming এর core। এটি custom events emit এবং listen করতে দেয়।

```javascript
const { EventEmitter } = require('events');

class OrderService extends EventEmitter {
    createOrder(order) {
        // Order save to DB...
        this.emit('order:created', order);
        this.emit('order:email', order.userEmail);
    }
}

const orderService = new OrderService();

orderService.on('order:created', (order) => {
    console.log('Order created:', order.id);
});

orderService.on('order:email', (email) => {
    sendConfirmationEmail(email);
});
```

### What is the `once` method vs `on` on an EventEmitter?
```javascript
// on — বারবার চলে (সব event এ)
emitter.on('data', handler);

// once — শুধু প্রথমবার চলে, তারপর automatically remove
emitter.once('connect', () => console.log('Connected!'));
```

### What is a memory leak risk with EventEmitters?
```javascript
// সতর্কতা: বারবার listener যোগ করলে memory leak
for (let i = 0; i < 100; i++) {
    emitter.on('data', handler); // 100 listener!
}

// Default maxListeners = 11, বেশি হলে warning
emitter.setMaxListeners(20); // বাড়ানো

// Listener সঠিকভাবে remove করুন
const handler = (data) => console.log(data);
emitter.on('data', handler);
// ... পরে
emitter.off('data', handler); // Remove
```

---

## 28. How do you handle uncaught exceptions in asynchronous code?

```javascript
// Synchronous uncaught exception
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    // Cleanup করুন
    process.exit(1); // Exit করা বাধ্যতামূলক!
});

// Async unhandled rejection
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
});
```

### Why is it dangerous to continue running after an `uncaughtException`?
- Process এর state অজানা এবং corrupt হতে পারে।
- Memory leak, broken DB connection হতে পারে।
- **Best practice:** Log করুন, cleanup করুন, exit করুন। `pm2` বা Kubernetes restart করবে।

---

## 29. What are async hooks in Node.js?

**Async Hooks** হলো একটি API যা async operation এর lifecycle track করতে দেয়।

```javascript
const async_hooks = require('async_hooks');

// AsyncLocalStorage — request context propagation
const { AsyncLocalStorage } = require('async_hooks');
const requestStore = new AsyncLocalStorage();

// Middleware
app.use((req, res, next) => {
    const store = { requestId: uuid(), userId: req.user?.id };
    requestStore.run(store, next);
});

// যেকোনো জায়গায় request context পাওয়া
function logSomething(message) {
    const store = requestStore.getStore();
    console.log(`[${store?.requestId}] ${message}`);
}
```

### What is `AsyncLocalStorage` and how does it replace async hooks for context propagation?
- `AsyncLocalStorage`: Request scoped data (like request ID, user info) যেকোনো async context এ পাওয়া।
- Thread local storage এর async equivalent।
- Performance overhead নেই (async hooks এর তুলনায়)।

---

## 30. How do you convert callback-based code to Promises?

### What is the `util.promisify` function and how does it work?
```javascript
const { promisify } = require('util');
const fs = require('fs');
const dns = require('dns');

// এক লাইনে convert
const readFile = promisify(fs.readFile);
const lookup = promisify(dns.lookup);

// এখন await করা যাবে
const content = await readFile('config.json', 'utf8');
const address = await lookup('google.com');
```

### How do you manually wrap a callback function in a Promise?
```javascript
function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// Use করুন
const content = await readFilePromise('config.json');
```

### How do you handle callbacks that call `callback(result)` instead of `callback(err, result)`?
```javascript
// Non-standard callback (no error-first)
function fetchData(callback) {
    setTimeout(() => callback({ data: 'result' }), 100);
}

// Manual wrap দরকার — promisify কাজ করবে না
const fetchDataPromise = () =>
    new Promise(resolve => {
        fetchData(result => resolve(result));
    });
```
