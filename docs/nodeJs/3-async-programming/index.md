---
sidebar_position: 1
title: 'Async Programming'
---

## 📌 21. What are callbacks in Node.js, and what is callback hell?

**Callback** হলো এমন একটি function যেটাকে argument হিসেবে অন্য একটি function-এ pass করা হয়, এবং সেই function তার কাজ শেষ করার পরে এটিকে execute করে। Node.js-এ যেহেতু সবকিছু **asynchronous** এবং **non-blocking**, তাই callback হলো asynchronous operations handle করার সবচেয়ে পুরনো এবং মৌলিক পদ্ধতি।

```js
// সহজ callback-এর উদাহরণ
fs.readFile("file.txt", "utf8", function (err, data) {
  console.log(data);
});
```

**Callback Hell কী?**

যখন একটি asynchronous operation-এর পরে আরেকটি, তারপরে আরেকটি — এভাবে nested callbacks-এর স্তর বাড়তে থাকে, তখন code দেখতে একটি ত্রিভুজের মতো ডানদিকে হেলে যায়। এটাকেই **Callback Hell** বা **Pyramid of Doom** বলা হয়।

```js
// Callback Hell-এর উদাহরণ
getUser(userId, function (err, user) {
  getOrders(user.id, function (err, orders) {
    getOrderDetails(orders[0].id, function (err, details) {
      sendEmail(details, function (err, result) {
        // আরো nested হতে থাকে...
      });
    });
  });
});
```

এতে code পড়া, maintain করা এবং debug করা অত্যন্ত কঠিন হয়ে পড়ে।

---

### 💡 How do you avoid callback hell using Promises or `async/await`?

**১. Promises দিয়ে**

**Promise** হলো একটি object যেটি একটি asynchronous operation-এর eventual completion বা failure-কে represent করে। এটির তিনটি state থাকে: `pending`, `fulfilled`, এবং `rejected`।

```js
// Promise chain দিয়ে Callback Hell এড়ানো
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => sendEmail(details))
  .catch((err) => console.error(err)); // centralized error handling
```

এতে code flat থাকে এবং পড়তে সহজ হয়।

**২. `async/await` দিয়ে**

`async/await` হলো Promises-এরই syntactic sugar, যা asynchronous code-কে synchronous-এর মতো দেখতে এবং পড়তে সাহায্য করে।

```js
// async/await দিয়ে
async function processOrder(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    const result = await sendEmail(details);
    return result;
  } catch (err) {
    console.error("Error:", err);
  }
}
```

`async` keyword দিয়ে function declare করতে হয়, এবং `await` keyword দিয়ে Promise resolve হওয়া পর্যন্ত অপেক্ষা করা হয়। `try/catch` block দিয়ে error handle করা হয়।

---

### ⚙️ What is the error-first callback convention and why is it used?

**Error-First Callback** (বা **Node.js Callback Convention**) হলো একটি standard pattern যেখানে callback function-এর **প্রথম parameter সবসময় error** এবং দ্বিতীয় parameter হলো successful result।

```js
// Error-first callback convention
fs.readFile("file.txt", "utf8", function (err, data) {
  if (err) {
    // প্রথমে সবসময় error check করতে হবে
    console.error("File পড়তে সমস্যা হয়েছে:", err);
    return;
  }
  // error না থাকলে data নিয়ে কাজ করো
  console.log(data);
});
```

**কেন এই convention ব্যবহার করা হয়:**

- **Consistency:** Node.js-এর সব built-in modules (যেমন `fs`, `http`, `crypto`) এই pattern follow করে, ফলে developer-রা সহজেই যেকোনো library-র সাথে কাজ করতে পারেন।
- **Explicit Error Handling:** Error সবসময় প্রথমে আসে বলে developer-রা এটাকে ignore করতে পারেন না — error check করাটা mandatory হয়ে যায়।
- **Predictability:** সব asynchronous function একই ধরনের signature follow করায় code predictable এবং maintainable থাকে।

---

### ❓ What is inversion of control?

### 🔄 How do you convert a callback-based library to Promises using `util.promisify`?
Node.js-এর built-in `util` module-এ `promisify` function আছে, যেটি error-first callback convention follow করা যেকোনো function-কে automatically Promise-based function-এ রূপান্তর করে।

```js
const util = require("util");
const fs = require("fs");

// fs.readFile একটি callback-based function
// promisify দিয়ে এটিকে Promise-based বানানো হচ্ছে
const readFileAsync = util.promisify(fs.readFile);

// এখন এটাকে async/await দিয়ে ব্যবহার করা যাবে
async function readConfig() {
  try {
    const data = await readFileAsync("config.json", "utf8");
    const config = JSON.parse(data);
    console.log(config);
  } catch (err) {
    console.error("Config পড়তে সমস্যা:", err);
  }
}
```

**Custom Callback function promisify করা:**

```js
// নিজের তৈরি callback-based function
function delay(ms, callback) {
  setTimeout(() => callback(null, `${ms}ms পরে সম্পন্ন`), ms);
}

// promisify দিয়ে convert করা
const delayAsync = util.promisify(delay);

// এখন Promise হিসেবে ব্যবহার করা যাবে
delayAsync(2000).then((msg) => console.log(msg));
```

> **গুরুত্বপূর্ণ নোট:** `util.promisify` শুধুমাত্র **error-first callback convention** follow করা functions-এ কাজ করে। যদি কোনো library ভিন্ন pattern ব্যবহার করে, তাহলে manually Promise wrap করতে হবে।

## 📌 22. What are Promises in Node.js, and how do they work?

**Promise** হলো একটি object যেটি একটি asynchronous operation-এর ভবিষ্যৎ completion বা failure-কে represent করে। সহজ ভাষায়, এটি একটি "প্রতিশ্রুতি" — হয় কাজটি সফলভাবে শেষ হবে, নয়তো কোনো error দেবে।

**Promise-এর তিনটি State**

```
pending  ──→  fulfilled (resolve হয়েছে)
         ──→  rejected  (error হয়েছে)
```

একটি Promise একবার `fulfilled` বা `rejected` হলে সেটি আর পরিবর্তন হয় না — এই property-কে বলে **immutability**।

**Promise কীভাবে তৈরি করতে হয়**

```js
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("কাজ সফল হয়েছে!"); // fulfilled state-এ নিয়ে যায়
  } else {
    reject(new Error("কাজ ব্যর্থ হয়েছে!")); // rejected state-এ নিয়ে যায়
  }
});

// Promise consume করা
myPromise
  .then((result) => console.log(result)) // fulfilled হলে
  .catch((err) => console.error(err)); // rejected হলে
```

**`Promise.all`, `Promise.race`, `Promise.allSettled`**

একসাথে একাধিক Promise handle করার জন্য এই static methods ব্যবহার করা হয়:

```js
const p1 = fetch("/api/users");
const p2 = fetch("/api/orders");
const p3 = fetch("/api/products");

// সবগুলো সফল হলেই result দেবে, একটি fail করলেই reject হবে
Promise.all([p1, p2, p3])
  .then(([users, orders, products]) => {
    console.log(users, orders, products);
  })
  .catch((err) => console.error("যেকোনো একটি fail করেছে:", err));

// সবচেয়ে আগে যেটি resolve/reject হবে সেটিই return করবে
Promise.race([p1, p2, p3]).then((fastest) =>
  console.log("সবচেয়ে দ্রুত:", fastest),
);

// সব Promise শেষ হওয়ার পরে প্রতিটির status জানাবে (fail হলেও)
Promise.allSettled([p1, p2, p3]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("সফল:", result.value);
    } else {
      console.log("ব্যর্থ:", result.reason);
    }
  });
});
```

---

:::info 🔗 Related Questions

- What are the states of a Promise?
- What is Promise chaining and what are its pitfalls?
:::

**Promise chaining** হলো একটির পর একটি `.then()` জুড়ে দিয়ে sequential asynchronous operations চালানোর technique। প্রতিটি `.then()` একটি নতুন Promise return করে।

**সঠিক Promise Chaining**

```js
getUserFromDB(userId)
  .then((user) => {
    console.log("User পাওয়া গেছে:", user.name);
    return getOrdersByUser(user.id); // নতুন Promise return করতে হবে
  })
  .then((orders) => {
    console.log("Orders:", orders.length);
    return getOrderDetails(orders[0].id);
  })
  .then((details) => {
    console.log("Details:", details);
  })
  .catch((err) => {
    // chain-এর যেকোনো জায়গায় error হলে এখানে আসবে
    console.error("কোথাও সমস্যা হয়েছে:", err);
  })
  .finally(() => {
    // সফল বা ব্যর্থ — সবসময় এটি চলবে (cleanup-এর জন্য)
    db.connection.close();
  });
```

**Promise Chaining-এর Pitfalls**

**Pitfall ১: `.then()`-এর ভেতরে return না করা**

```js
// ❌ ভুল — return না করায় chain ভেঙে যায়
getUserFromDB(userId)
  .then((user) => {
    getOrdersByUser(user.id); // return নেই! পরের .then() undefined পাবে
  })
  .then((orders) => {
    console.log(orders); // undefined আসবে
  });

// ✅ সঠিক
getUserFromDB(userId)
  .then((user) => {
    return getOrdersByUser(user.id); // অবশ্যই return করতে হবে
  })
  .then((orders) => {
    console.log(orders); // সঠিক data আসবে
  });
```

**Pitfall ২: Nested Promise তৈরি করা (Promise Hell)**

```js
// ❌ ভুল — আবার callback hell-এর মতো nested হয়ে যাচ্ছে
getUserFromDB(userId).then((user) => {
  return getOrdersByUser(user.id).then((orders) => {
    // এখানে nest না করে
    return getOrderDetails(orders[0].id).then((details) => details); // flat chain করা উচিত ছিল
  });
});

// ✅ সঠিক — flat chain
getUserFromDB(userId)
  .then((user) => getOrdersByUser(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => console.log(details));
```

**Pitfall ৩: প্রতিটি `.then()`-এ আলাদা `.catch()` না রাখা**

```js
// ❌ ভুল — শুধু শেষে একটি .catch() থাকলে কোথায় error হয়েছে বোঝা যায় না
step1()
  .then(() => step2())
  .then(() => step3())
  .catch((err) => console.error(err)); // কোন step-এ হলো?

// ✅ সঠিক — specific error handling
step1()
  .then(() => step2())
  .catch((err) => {
    console.error("step2-এ সমস্যা:", err);
    throw err; // re-throw করে পরের .catch()-এও পাঠানো যায়
  })
  .then(() => step3())
  .catch((err) => console.error("step3-এ সমস্যা:", err));
```

**Pitfall ৪: `.catch()` ছাড়াই chain শেষ করা**

```js
// ❌ বিপজ্জনক — unhandled rejection হবে
getUserFromDB(userId).then((user) => processUser(user));
// .catch() নেই!

// ✅ সবসময় .catch() দিয়ে শেষ করো
getUserFromDB(userId)
  .then((user) => processUser(user))
  .catch((err) => console.error("Error:", err));
```

**Pitfall ৫: `async/await`-এর সাথে mix করা**

```js
// ❌ অপ্রয়োজনীয় mix — confusing হয়
async function fetchData() {
  return getUserFromDB(userId).then((user) => {
    // async function-এ .then() ব্যবহার না করাই ভালো
    return user;
  });
}

// ✅ পরিষ্কার — শুধু async/await ব্যবহার করো
async function fetchData() {
  const user = await getUserFromDB(userId);
  return user;
}
```

| বিষয়                   | মূল কথা                                                  |
| ----------------------- | -------------------------------------------------------- |
| **Promise**             | Asynchronous operation-এর future result represent করে    |
| **States**              | `pending` → `fulfilled` অথবা `rejected`                  |
| **Global Rejection**    | `process.on('unhandledRejection')` দিয়ে handle করতে হয় |
| **Chaining**            | প্রতিটি `.then()`-এ অবশ্যই `return` করতে হবে             |
| **সবচেয়ে বড় pitfall** | `return` না করা এবং `.catch()` না রাখা                   |

---

### 🚨 How are errors propagated in Promise chains?

:::info 🔗 Related Questions

- What is the difference between `Promise.resolve()` and `new Promise(resolve => resolve())`?
- How do you handle Promise rejections globally?
:::

যদি কোনো Promise `reject` হয় এবং সেখানে `.catch()` না থাকে, সেটি **unhandled rejection** হয়। Production-এ এটি খুবই বিপজ্জনক কারণ error নীরবে হারিয়ে যায়।

**`unhandledRejection` Event**

```js
// process-এর উপরে global handler বসানো
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection ধরা পড়েছে!");
  console.error("Reason:", reason);
  console.error("Promise:", promise);

  // Production-এ application gracefully বন্ধ করা উচিত
  process.exit(1);
});

// এখন .catch() ছাড়া reject হলেও উপরের handler কাজ করবে
Promise.reject(new Error("এই error কেউ catch করেনি!"));
```

**`rejectionHandled` Event**

```js
// যখন আগের unhandled rejection পরে catch করা হয়
process.on("rejectionHandled", (promise) => {
  console.warn("একটি rejection দেরিতে handle করা হয়েছে:", promise);
});
```

**Express.js-এ Global Error Handling**

```js
// Async route handler-এ unhandled rejection ধরা
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ব্যবহার
app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await getUsersFromDB(); // error হলে automatically next(err) যাবে
    res.json(users);
  }),
);

// Global error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
```

> **Node.js v15+ থেকে:** Unhandled Promise rejection হলে Node.js automatically process crash করে। তাই `unhandledRejection` handler রাখা production-এ অপরিহার্য।

---

## 📌 23. What is `async/await`, and how does it simplify asynchronous code?

`async/await` হলো JavaScript-এর একটি syntax যা Promise-based asynchronous code কে synchronous code-এর মতো দেখতে ও পড়তে সাহায্য করে।

- **`async`** keyword দিয়ে একটি function declare করলে সেটি সবসময় একটি Promise return করে।
- **`await`** keyword শুধুমাত্র `async` function-এর ভেতরে ব্যবহার করা যায়। এটি একটি Promise resolve হওয়া পর্যন্ত execution pause করে রাখে এবং resolved value টি return করে।

**আগে Promise chain দিয়ে লিখতে হতো:**

```js
fetch("/api/user")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

**`async/await` দিয়ে একই কাজ অনেক পরিষ্কারভাবে লেখা যায়:**

```js
async function getUser() {
  const res = await fetch("/api/user");
  const data = await res.json();
  console.log(data);
}
```

`async/await` ব্যবহার করলে callback hell বা `.then()` chain এর জটিলতা এড়ানো যায় এবং code পড়া ও maintain করা সহজ হয়।

---

### ⏸️ How does `await` pause execution?

:::info 🔗 Related Questions

- Is `async/await` blocking or non-blocking?
- How does it work under the hood (Promises)?
- How do you handle errors in `async/await` using `try/catch`?
:::

`async/await`-এ error handle করার জন্য standard `try/catch` block ব্যবহার করা হয়। যদি `await` করা কোনো Promise reject হয়, তাহলে সেটি automatically `catch` block-এ চলে যায়।

```js
async function getUser() {
  try {
    const res = await fetch("/api/user");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    // Promise reject হলে বা কোনো runtime error হলে এখানে আসবে
    console.error("Error:", error.message);
  } finally {
    // সবসময় execute হবে (optional)
    console.log("Request complete");
  }
}
```

একাধিক `await` call থাকলে যেকোনো একটিতে error হলে সেটি একই `catch` block ধরে ফেলবে, যা `.then().catch()` chain-এর চেয়ে অনেক বেশি সুবিধাজনক।

---

### 🤔 What happens if you forget the `await` keyword before a Promise?

`await` ভুলে গেলে function টি Promise resolve হওয়ার জন্য অপেক্ষা না করে সাথে সাথে পরের line-এ চলে যায়। ফলে resolved value-এর বদলে একটি **pending Promise object** পাওয়া যায়।

```js
async function example() {
  const data = fetch("/api/user"); // ❌ await নেই
  console.log(data); // Promise { <pending> } — actual data নয়
}
```

```js
async function example() {
  const data = await fetch("/api/user"); // ✅ await আছে
  console.log(data); // actual Response object
}
```

এই ধরনের bug ধরা কঠিন হতে পারে কারণ কোনো error throw হয় না, কিন্তু program ভুল result নিয়ে কাজ করতে থাকে।

---

### ⚡ How do you run multiple async operations in parallel?

যদি একটির result-এর উপর আরেকটি নির্ভর না করে, তাহলে সেগুলো একে একে `await` করা উচিত নয় — এতে অপ্রয়োজনীয় সময় নষ্ট হয়। পরিবর্তে `Promise.all()` ব্যবহার করলে সব operation একসাথে শুরু হয় এবং সবগুলো শেষ হলে result পাওয়া যায়।

**❌ Sequential (ধীর) — একটি শেষ হলে আরেকটি শুরু হয়:**

```js
const user = await fetchUser(); // ধরি ৩০০ms লাগলো
const posts = await fetchPosts(); // ধরি আরো ৩০০ms লাগলো
// মোট ~৬০০ms
```

**✅ Parallel (দ্রুত) — সবগুলো একসাথে শুরু হয়:**

```js
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
// মোট ~৩০০ms (যেটি সবচেয়ে বেশি সময় নেয় সেটুকু)
```

> **⚠️ সতর্কতা:** `Promise.all()` এ যদি যেকোনো একটি Promise reject হয়, তাহলে সম্পূর্ণ call টিই reject হয়ে যাবে। যদি একটির failure অন্যগুলোকে প্রভাবিত করতে না দিতে চান, তাহলে `Promise.allSettled()` ব্যবহার করুন — এটি সবগুলোর result (fulfilled বা rejected যাই হোক) আলাদাভাবে দেয়।

---

## 📌 24. What is the difference between `setTimeout`, `setInterval`, and `setImmediate`?

তিনটিই asynchronous code schedule করার জন্য ব্যবহৃত হয়, কিন্তু এদের কাজ করার ধরন আলাদা।

**`setTimeout(fn, delay)`**
নির্দিষ্ট সময় (millisecond) পরে callback function টি **একবার** execute করে। delay শেষ হলে callback টি event loop-এর **macrotask queue**-এ যোগ হয়।

```js
setTimeout(() => {
  console.log("৫০০ms পরে একবার চলবে");
}, 500);
```

**`setInterval(fn, delay)`**
নির্দিষ্ট সময় পরপর callback function টি **বারবার** execute করতে থাকে, যতক্ষণ না `clearInterval()` দিয়ে থামানো হয়।

```js
const id = setInterval(() => {
  console.log("প্রতি ১ সেকেন্ডে চলবে");
}, 1000);

// থামাতে হলে:
clearInterval(id);
```

**`setImmediate(fn)`** _(Node.js only)_
Current event loop iteration-এর I/O callback শেষ হওয়ার পরপরই, কিন্তু `setTimeout`-এর আগে callback টি execute করে। Browser-এ এটি available নেই।

```js
setImmediate(() => {
  console.log("I/O phase-এর পরপরই চলবে");
});
```

**তিনটির তুলনা:**

| বৈশিষ্ট্য  | `setTimeout`      | `setInterval`     | `setImmediate` |
| ---------- | ----------------- | ----------------- | -------------- |
| কতবার চলে  | একবার             | বারবার            | একবার          |
| delay      | নির্দিষ্ট ms      | নির্দিষ্ট ms      | কোনো delay নেই |
| কোথায় চলে | Browser + Node.js | Browser + Node.js | শুধু Node.js   |
| Queue      | macrotask         | macrotask         | check phase    |

---

### ⏱️ When would you use `setImmediate` over `setTimeout(fn, 0)`?

`setTimeout(fn, 0)` মানে এই নয় যে কাজটি ঠিক `0ms` পরে হবে — minimum delay সাধারণত `1ms` বা তার বেশি হয়। এছাড়া `setTimeout`-এর execution timing, event loop-এর কোন phase-এ call করা হচ্ছে তার উপর নির্ভর করে।

**Node.js-এ `setImmediate` ব্যবহার করুন যখন:**

- কোনো I/O operation (file read, network request) সম্পন্ন হওয়ার পর callback execute করতে চান।
- Consistent এবং predictable execution order দরকার।
- Timer overhead ছাড়াই current operation শেষে কিছু করতে চান।

```js
const fs = require("fs");

fs.readFile("file.txt", () => {
  // এই I/O callback-এর ভেতরে:

  setImmediate(() => {
    console.log("1: setImmediate — সবার আগে চলবে");
  });

  setTimeout(() => {
    console.log("2: setTimeout — পরে চলবে");
  }, 0);
});

// Output সবসময় consistent:
// 1: setImmediate
// 2: setTimeout
```

> **⚠️ লক্ষ্য করুন:** I/O callback-এর বাইরে (top-level code-এ) `setTimeout(fn, 0)` এবং `setImmediate`-এর order **অনিশ্চিত** — system performance-এর উপর নির্ভর করে যেকোনোটি আগে চলতে পারে।

---

:::info 🔗 Related Questions

- How do you cancel a `setInterval` and why is it important to do so?
- What is `queueMicrotask` and how does it differ from `setImmediate`?
:::

`queueMicrotask()` একটি function কে **microtask queue**-এ যোগ করে। Microtask queue সবসময় macrotask queue ও check phase-এর **আগে** execute হয় — অর্থাৎ current synchronous code শেষ হওয়ার সাথে সাথে।

```js
console.log("1: sync start");

setTimeout(() => console.log("4: setTimeout"), 0);

setImmediate(() => console.log("5: setImmediate"));

queueMicrotask(() => console.log("3: microtask"));

Promise.resolve().then(() => console.log("3: promise (also microtask)"));

console.log("2: sync end");

// Output:
// 1: sync start
// 2: sync end
// 3: microtask        ← current task শেষে, সাথে সাথে
// 3: promise
// 4: setTimeout       ← পরের event loop iteration-এ
// 5: setImmediate     ← I/O phase-এর পরে
```

**Event loop-এ execution order:**

```
Synchronous Code
      ↓
Microtask Queue  ← queueMicrotask(), Promise.then()
      ↓
Macrotask Queue  ← setTimeout(), setInterval()
      ↓
Check Phase      ← setImmediate()  [Node.js only]
```

**`queueMicrotask` কখন ব্যবহার করবেন:**
যখন কোনো কাজ current synchronous execution শেষ হওয়ার পরপরই করতে চান, কিন্তু সেটি কোনো Promise-এর সাথে যুক্ত নয়। যেমন — internal state update করার পর UI re-render trigger করার আগে কোনো cleanup logic চালানো।

---

## 📌 25. How do you run async operations in parallel vs sequentially?

:::info 🔗 Related Questions

- Difference between `await` in a loop vs `Promise.all`
- What is the difference between `Promise.all` and `Promise.allSettled`?
- What is `Promise.race` and when is it useful?
- How do you limit concurrency when running many async operations in parallel (e.g., `p-limit`)?
:::

## 📌 26. What is the `async` module, and when is it useful?

`async` হলো একটি popular third-party Node.js library যা complex asynchronous control flow — যেমন series, parallel, waterfall, queue — সহজে manage করার জন্য utility function সরবরাহ করে।

Native Promise বা `async/await` আসার আগে callback-based asynchronous code manage করা খুব কঠিন ছিল। `async` module সেই সমস্যা সমাধান করতো।

```bash
npm install async
```

**আজকের দিনে কখন useful:**

- Legacy codebase যেখানে callback pattern ব্যবহার হচ্ছে।
- Concurrency limit সহ bulk operation চালাতে হলে (যেমন একসাথে সর্বোচ্চ ৫টি request)।
- Complex dependency-based task flow manage করতে হলে।

---

:::info 🔗 Related Questions

- How does `async.waterfall` compare to native Promise chaining?
- What is `async.parallel` and `async.series`?
:::

**`async.series`** — tasks গুলো **একটার পর একটা** চালায়। একটি শেষ না হলে পরেরটি শুরু হয় না। একটিতে error হলে বাকিগুলো আর চলে না।

```js
const async = require("async");

async.series(
  [
    (callback) => {
      setTimeout(() => {
        console.log("Task 1 শেষ");
        callback(null, "result1");
      }, 300);
    },
    (callback) => {
      setTimeout(() => {
        console.log("Task 2 শেষ");
        callback(null, "result2");
      }, 100);
    },
  ],
  (err, results) => {
    console.log(results); // ['result1', 'result2']
    // মোট সময়: ~400ms
  },
);
```

**`async.parallel`** — tasks গুলো **একসাথে** শুরু করে। সবগুলো complete হলে final callback-এ সব result একসাথে পাওয়া যায়।

```js
async.parallel(
  [
    (callback) => {
      setTimeout(() => callback(null, "result1"), 300);
    },
    (callback) => {
      setTimeout(() => callback(null, "result2"), 100);
    },
  ],
  (err, results) => {
    console.log(results); // ['result1', 'result2']
    // মোট সময়: ~300ms (সবচেয়ে বেশি সময় নেওয়া task-এর সমান)
  },
);
```

|             | `async.series`             | `async.parallel`         |
| ----------- | -------------------------- | ------------------------ |
| Execution   | একটার পর একটা              | একসাথে                   |
| মোট সময়    | সব task-এর সময়ের যোগফল    | সবচেয়ে ধীর task-এর সময় |
| কখন ব্যবহার | একটির output আরেকটির input | tasks পরস্পর independent |

---

### ⚖️ How does the `async` module compare to native `Promise.all`?

---

## 📌 27. How do you handle parallel asynchronous operations in Node.js?

Node.js-এ parallel async operation handle করার সবচেয়ে সহজ এবং modern উপায় হলো `Promise.all()`, `Promise.allSettled()`, বা `Promise.race()` ব্যবহার করা।

---

:::info 🔗 Related Questions

- Difference between `await` in a loop vs `Promise.all`
- What is the difference between `Promise.all` and `Promise.allSettled`?
:::

**`Promise.all()`** — সবগুলো Promise **সফলভাবে** resolve হলে তবেই result দেয়। যেকোনো **একটি** reject হলে সাথে সাথে পুরো call টি reject হয়ে যায় এবং বাকিগুলোর result পাওয়া যায় না।

```js
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1),
]);
// তিনটির যেকোনো একটি fail করলে সব বাতিল
```

**`Promise.allSettled()`** — সবগুলো Promise complete হওয়া পর্যন্ত অপেক্ষা করে, কেউ reject হলেও। প্রতিটির জন্য আলাদাভাবে `status: 'fulfilled'` বা `status: 'rejected'` জানা যায়।

```js
const results = await Promise.allSettled([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1), // এটি fail করলেও বাকিগুলোর result পাবো
]);

results.forEach((result) => {
  if (result.status === "fulfilled") {
    console.log("সফল:", result.value);
  } else {
    console.log("ব্যর্থ:", result.reason);
  }
});
```

|                | `Promise.all`        | `Promise.allSettled`              |
| -------------- | -------------------- | --------------------------------- |
| একটি fail করলে | সব বাতিল             | বাকিগুলো চলতে থাকে                |
| Result         | শুধু values-এর array | `{status, value/reason}`-এর array |
| কখন ব্যবহার    | সব result দরকার      | partial failure acceptable        |

---

### 🏎️ What is `Promise.race` and when is it useful?

`Promise.race()` — দেওয়া Promise গুলোর মধ্যে **যেটি সবার আগে** settle হয় (fulfilled বা rejected যাই হোক), শুধু সেটির result return করে। বাকিগুলো তখনও background-এ চলতে পারে, কিন্তু তাদের result আর পাওয়া যায় না।

```js
const result = await Promise.race([
  fetchFromServer1(), // ২০০ms লাগলো
  fetchFromServer2(), // ৫০০ms লাগলো
  fetchFromServer3(), // ১০০ms লাগলো — এটি জিতবে
]);
// result = server3-এর response
```

**কখন useful:**

**Timeout implement করতে:**

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout!")), ms),
  );
  return Promise.race([promise, timeout]);
}

// ৩ সেকেন্ডের মধ্যে response না পেলে error
const data = await withTimeout(fetchData(), 3000);
```

**Fastest available resource ব্যবহার করতে:**

```js
// একাধিক CDN-এর মধ্যে যেটি আগে respond করে
const asset = await Promise.race([
  fetch("https://cdn1.example.com/file.js"),
  fetch("https://cdn2.example.com/file.js"),
]);
```

---

### 🚦 How do you limit concurrency when running many async operations in parallel?

`Promise.all()` দিয়ে হাজারো request একসাথে পাঠালে server বা rate limit সমস্যা হতে পারে। এই সমস্যা সমাধানে concurrency limit করতে হয়।

**`p-limit` library দিয়ে (recommended):**

```js
import pLimit from "p-limit";

const limit = pLimit(3); // একসাথে সর্বোচ্চ ৩টি

const urls = Array.from(
  { length: 20 },
  (_, i) => `https://api.example.com/item/${i}`,
);

const results = await Promise.all(
  urls.map((url) => limit(() => fetch(url).then((r) => r.json()))),
);
// ২০টি request চলবে, কিন্তু যেকোনো মুহূর্তে সর্বোচ্চ ৩টি active থাকবে
```

**Manual chunking দিয়ে (library ছাড়া):**

```js
async function runInBatches(items, batchSize, asyncFn) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(asyncFn));
    results.push(...batchResults);
  }

  return results;
}

// প্রতি batch-এ ৫টি করে process হবে
const data = await runInBatches(urls, 5, (url) =>
  fetch(url).then((r) => r.json()),
);
```

> **⚠️ সতর্কতা:** Manual chunking-এ একটি batch-এর সবচেয়ে ধীর task সম্পন্ন না হওয়া পর্যন্ত পরের batch শুরু হয় না। `p-limit` এই সমস্যা এড়িয়ে চলে — একটি task শেষ হওয়ার সাথে সাথে নতুন একটি শুরু করে, ফলে concurrency সবসময় সর্বোচ্চ সংখ্যায় active থাকে।

---

## 📌 28. What is an EventEmitter in Node.js?

`EventEmitter` হলো Node.js-এর `events` module-এর একটি core class যা event-driven programming pattern implement করে। এটি দিয়ে custom event তৈরি করা যায়, সেই event-এ listener (callback) register করা যায়, এবং পরে event emit করলে সব listener গুলো automatically execute হয়।

```js
const { EventEmitter } = require("events");

const emitter = new EventEmitter();

// 'data' event-এ listener register করা
emitter.on("data", (payload) => {
  console.log("Data পাওয়া গেছে:", payload);
});

// 'data' event emit করা
emitter.emit("data", { id: 1, name: "Alice" });
// Output: Data পাওয়া গেছে: { id: 1, name: 'Alice' }
```

Real-world Node.js-এ `EventEmitter` সর্বত্র ব্যবহৃত হয় — `fs`, `http`, `stream`, `process` সবই এর উপর ভিত্তি করে তৈরি। নিজের class-এও extend করে ব্যবহার করা যায়:

```js
const { EventEmitter } = require("events");

class FileProcessor extends EventEmitter {
  process(file) {
    // কাজ শুরু
    this.emit("start", file);
    // ... processing ...
    this.emit("done", { file, status: "success" });
  }
}

const processor = new FileProcessor();
processor.on("start", (f) => console.log(`শুরু হয়েছে: ${f}`));
processor.on("done", (result) => console.log("শেষ:", result));
processor.process("report.pdf");
```

---

### 🔁 What is the `once` method vs `on` on an EventEmitter?

**`on(event, listener)`** — একটি event-এ listener permanently register করে। Event যতবার emit হবে, listener ততবার call হবে।

```js
emitter.on("message", (msg) => {
  console.log("Message:", msg);
});

emitter.emit("message", "প্রথম"); // ✅ চলবে
emitter.emit("message", "দ্বিতীয়"); // ✅ চলবে
emitter.emit("message", "তৃতীয়"); // ✅ চলবে
```

**`once(event, listener)`** — listener টি **শুধুমাত্র একবার** execute হয়। প্রথমবার event emit হওয়ার পরে listener টি automatically remove হয়ে যায়।

```js
emitter.once("connection", (socket) => {
  console.log("প্রথম connection পাওয়া গেছে");
});

emitter.emit("connection", socket1); // ✅ চলবে
emitter.emit("connection", socket2); // ❌ আর চলবে না
```

**কখন কোনটি ব্যবহার করবেন:**

|               | `on`                           | `once`                              |
| ------------- | ------------------------------ | ----------------------------------- |
| কতবার চলে     | বারবার                         | শুধু একবার                          |
| কখন ব্যবহার   | ongoing events (data, message) | one-time events (ready, connection) |
| Manual remove | `off()` দিয়ে করতে হয়         | Automatic                           |

---

### ⚠️ What is a memory leak risk with EventEmitters?

`EventEmitter`-এ default হিসেবে একটি event-এ সর্বোচ্চ **10টি** listener register করা যায়। এর বেশি হলে Node.js warning দেয়। কিন্তু আসল সমস্যা হলো — `on()` দিয়ে listener add করে পরে `off()` দিয়ে remove না করলে সেই listener এবং এর সাথে সংশ্লিষ্ট সব object memory-তে আটকে থাকে, Garbage Collector সেগুলো free করতে পারে না।

**সাধারণ memory leak-এর উদাহরণ:**

```js
class DataService extends EventEmitter {}
const service = new DataService();

function setupHandler() {
  const cache = new Array(10000).fill("data"); // বড় object

  // প্রতিবার call হলে নতুন listener add হচ্ছে, কিন্তু কখনো remove হচ্ছে না
  service.on("update", () => {
    console.log(cache.length); // cache টি memory-তে আটকে থাকছে
  });
}

setInterval(setupHandler, 1000); // ❌ প্রতি সেকেন্ডে leak বাড়ছে
```

**সমাধান ১ — listener সঠিকভাবে remove করা:**

```js
function setupHandler() {
  const cache = new Array(10000).fill("data");
  const handler = () => console.log(cache.length);

  service.on("update", handler);

  // কাজ শেষে remove করতে হবে
  return () => service.off("update", handler); // cleanup function return
}

const cleanup = setupHandler();
// পরে যখন দরকার:
cleanup(); // ✅ listener remove, memory free
```

**সমাধান ২ — `once()` ব্যবহার করা (যখন একবারই দরকার):**

```js
service.once("update", () => {
  console.log("একবার চলবে, তারপর automatically remove");
}); // ✅ কোনো manual cleanup দরকার নেই
```

**সমাধান ৩ — limit বাড়ানো (যদি সত্যিই বেশি listener দরকার):**

```js
service.setMaxListeners(20); // warning বন্ধ করা — কিন্তু root cause ঠিক করা উচিত
```

---

## 📌 29. How do you handle uncaught exceptions in asynchronous code?

**Synchronous error** সাধারণ `try/catch` দিয়ে ধরা যায়। কিন্তু asynchronous code-এ error handle না করলে সেটি "uncaught" হয়ে পড়ে।

**`async/await`-এ `try/catch`:**

```js
async function fetchData() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (err) {
    console.error("Async error handled:", err.message);
  }
}
```

**Unhandled Promise rejection handle করা:**

```js
// Modern Node.js-এ unhandled rejection process crash করাতে পারে
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  // Log করুন, তারপর gracefully shutdown করুন
  process.exit(1);
});
```

**Synchronous uncaught exception handle করা:**

```js
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  // cleanup করুন, তারপর অবশ্যই exit করুন
  process.exit(1);
});
```

**Production-এ recommended pattern:**

```js
async function main() {
  try {
    await startServer();
    await connectDatabase();
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

// Global safety net — শুধু last resort হিসেবে
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled:", reason);
  process.exit(1);
});

main();
```

---

### 🛡️ What is the role of `process.on('uncaughtException')` and when should you use it?

`uncaughtException` তখন fire হয় যখন কোনো synchronous error কোনো `try/catch` দিয়ে ধরা পড়েনি এবং সরাসরি event loop-এ পৌঁছে গেছে। এটি একটি **last resort safety net** — এখানে পৌঁছানো মানেই program-এর কোথাও error handling-এ ফাঁক আছে।

```js
process.on("uncaughtException", (err, origin) => {
  // origin হবে 'uncaughtException' অথবা 'unhandledRejection'
  console.error("Fatal error:", err.message);
  console.error("Origin:", origin);

  // ✅ শুধু এই দুটো কাজ করুন:
  // ১. Error log করুন (file বা monitoring service-এ)
  // ২. Gracefully exit করুন
  process.exit(1);
});
```

**কখন ব্যবহার করবেন:**

- Production-এ last-resort logging এর জন্য।
- `pm2` বা `systemd`-এর মতো process manager-এর সাথে — crash হলে automatically restart হবে।
- কখনোই primary error handling হিসেবে নয়।

---

### ⚖️ What is the difference between `uncaughtException` and `unhandledRejection`?

দুটো দেখতে একই মনে হলেও এদের source আলাদা:

**`uncaughtException`** — synchronous code-এ throw হওয়া error যা কোনো `try/catch` ধরেনি।

```js
process.on("uncaughtException", (err) => {
  console.error("Sync error ধরা পড়েছে:", err.message);
  process.exit(1);
});

// এটি uncaughtException trigger করবে:
setTimeout(() => {
  throw new Error("Synchronous throw!"); // ❌ কোনো try/catch নেই
}, 100);
```

**`unhandledRejection`** — কোনো Promise reject হয়েছে কিন্তু `.catch()` বা `try/catch` দিয়ে handle করা হয়নি।

```js
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

// এটি unhandledRejection trigger করবে:
async function fail() {
  throw new Error("Promise rejected!");
}

fail(); // ❌ await নেই, .catch() নেই
```

**দুটোর তুলনা:**

|                          | `uncaughtException` | `unhandledRejection`               |
| ------------------------ | ------------------- | ---------------------------------- |
| Source                   | Synchronous `throw` | Promise rejection                  |
| Callback parameters      | `(err, origin)`     | `(reason, promise)`                |
| Node.js default behavior | Process crash       | Node.js 15+ থেকে crash             |
| Handle করার উপায়        | `try/catch`         | `.catch()` বা `try/catch` in async |

---

### ⛔ Why is it dangerous to continue running after an `uncaughtException`?

`uncaughtException` মানে application একটি **অজানা, unexpected state**-এ আছে। এই অবস্থায় চালিয়ে গেলে:

```js
// ❌ অত্যন্ত বিপজ্জনক pattern
process.on("uncaughtException", (err) => {
  console.error("Error logged:", err);
  // exit না করে চালিয়ে যাচ্ছি — এটি করবেন না
});

let totalAmount = 0;

async function processPayment(amount) {
  totalAmount += amount; // Step 1: হয়েছে
  await saveToDatabase(); // Step 2: এখানে throw হলো
  await sendConfirmationEmail(); // Step 3: আর হলো না
  // ফলে: টাকা কাটা গেছে, কিন্তু confirmation যায়নি
  // totalAmount corrupted state-এ আছে
}
```

**কী কী সমস্যা হতে পারে:**

- **Corrupted state:** Variable বা data structure অর্ধেক update হয়ে আটকে আছে।
- **Resource leak:** Database connection, file handle খোলা রয়ে গেছে।
- **Security risk:** Authentication বা authorization logic skip হয়ে যেতে পারে।
- **Silent wrong results:** Program চলছে কিন্তু ভুল output দিচ্ছে।

```js
// ✅ সঠিক pattern — crash করুন, process manager restart করুক
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — shutting down");

  // Graceful shutdown: চলমান request শেষ করুন, নতুন নেবেন না
  server.close(() => {
    process.exit(1); // সবসময় exit করতে হবে
  });

  // Graceful shutdown-এ বেশি সময় লাগলে force exit
  setTimeout(() => process.exit(1), 5000).unref();
});
```

---

### 🆚 `try/catch` বনাম `.catch()` — কোনটি কখন ব্যবহার করবেন?

**`try/catch`** — `async/await` context-এ ব্যবহার হয়। Synchronous এবং asynchronous উভয় error ধরতে পারে।

```js
// ✅ async/await-এ try/catch
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Network error এবং HTTP error দুটোই এখানে আসবে
    console.error("fetchUser failed:", err.message);
    throw err; // upstream-এ re-throw করুন যদি দরকার হয়
  }
}
```

**`.catch()`** — Promise chain-এ ব্যবহার হয়। Chain-এর যেকোনো জায়গায় error হলে সরাসরি `.catch()`-এ চলে আসে।

```js
// ✅ Promise chain-এ .catch()
fetch("/api/users/1")
  .then((res) => res.json())
  .then((user) => processUser(user))
  .catch((err) => {
    // উপরের যেকোনো step-এর error এখানে আসবে
    console.error("Pipeline failed:", err.message);
  });
```

**গুরুত্বপূর্ণ পার্থক্য:**

```js
// ❌ try/catch দিয়ে non-awaited Promise ধরা যায় না
async function broken() {
  try {
    fetchData(); // await নেই — error ধরা পড়বে না!
  } catch (err) {
    console.error("এটি কখনো চলবে না");
  }
}

// ✅ সঠিক — await থাকলে try/catch কাজ করে
async function fixed() {
  try {
    await fetchData(); // await আছে
  } catch (err) {
    console.error("Error:", err.message); // ✅ ধরা পড়বে
  }
}
```

---

### 💥 What happens with unhandled rejections?

**Node.js 14 এবং আগে:** Warning print হতো কিন্তু process চলতে থাকতো।

**Node.js 15 এবং পরে:** Unhandled rejection সরাসরি **process crash** করে — ঠিক `uncaughtException`-এর মতো।

```js
// এই code Node.js 15+-এ process crash করবে:
async function fail() {
  throw new Error("Rejected!");
}

fail(); // .catch() নেই, await নেই
// UnhandledPromiseRejection: process exit code 1
```

**কীভাবে prevent করবেন:**

```js
// ✅ Pattern 1: সবসময় await করুন
const result = await riskyOperation();

// ✅ Pattern 2: .catch() chain করুন
riskyOperation().catch((err) => logger.error(err));

// ✅ Pattern 3: Global handler (last resort)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});
```

---

### 🚨 How do you handle multiple async errors?

**`Promise.all` দিয়ে — একটি fail করলে সব বাতিল:**

```js
async function fetchDashboardData(userId) {
  try {
    const [user, posts, notifications] = await Promise.all([
      fetchUser(userId),
      fetchPosts(userId),
      fetchNotifications(userId),
    ]);

    return { user, posts, notifications };
  } catch (err) {
    // যেকোনো একটি fail করলে এখানে আসবে
    // কিন্তু কোনটি fail করেছে জানা যাবে না সহজে
    console.error("Dashboard load failed:", err.message);
    throw err;
  }
}
```

**`Promise.allSettled` দিয়ে — partial failure সামলানো:**

```js
async function fetchDashboardData(userId) {
  const results = await Promise.allSettled([
    fetchUser(userId),
    fetchPosts(userId),
    fetchNotifications(userId),
  ]);

  // প্রতিটির result আলাদাভাবে check করা যাচ্ছে
  const [userResult, postsResult, notifResult] = results;

  if (userResult.status === "rejected") {
    // User ছাড়া dashboard দেখানো সম্ভব নয়
    throw new Error("Critical: user fetch failed");
  }

  return {
    user: userResult.value,
    posts: postsResult.status === "fulfilled" ? postsResult.value : [], // Posts না পেলে empty array fallback
    notifications: notifResult.status === "fulfilled" ? notifResult.value : [],
    warnings: results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason.message),
  };
}
```

**Centralized error handler pattern — বড় application-এর জন্য:**

```js
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Expected error কিনা
  }
}

// middleware/errorHandler.js
function globalErrorHandler(err, req, res, next) {
  if (err instanceof AppError && err.isOperational) {
    // Expected error — client-কে জানানো যায়
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Unexpected error — log করুন, generic response দিন
  logger.fatal({ err }, "Unexpected error");
  res.status(500).json({ status: "error", message: "Internal server error" });
}

// Route-এ ব্যবহার:
async function getUser(req, res, next) {
  try {
    const user = await UserService.findById(req.params.id);
    if (!user) throw new AppError("User not found", 404);
    res.json(user);
  } catch (err) {
    next(err); // Central handler-এ পাঠানো
  }
}
```

---

## 📌 30. What are async hooks in Node.js?

`async_hooks` হলো Node.js-এর একটি built-in module যা asynchronous operation-এর lifecycle track করতে দেয়। প্রতিটি async operation (Promise, setTimeout, fs.readFile ইত্যাদি) তৈরি হওয়া থেকে শেষ হওয়া পর্যন্ত প্রতিটি ধাপে callback execute করা যায়।

প্রতিটি async resource-এর একটি unique **`asyncId`** এবং একটি **`triggerAsyncId`** থাকে (যে resource এটি তৈরি করেছে তার id)। এই দুটো দিয়ে async operation-এর পুরো chain trace করা সম্ভব।

```js
const async_hooks = require("async_hooks");
const fs = require("fs");

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    fs.writeSync(1, `Init: ${type} (asyncId: ${asyncId})\n`);
  },
  before(asyncId) {
    fs.writeSync(1, `Before: ${asyncId}\n`);
  },
  after(asyncId) {
    fs.writeSync(1, `After: ${asyncId}\n`);
  },
  destroy(asyncId) {
    fs.writeSync(1, `Destroy: ${asyncId}\n`);
  },
});

hook.enable();

setTimeout(() => {
  fs.writeSync(1, "Timeout callback চলছে\n");
}, 100);
```

> **⚠️ সতর্কতা:** `async_hooks` এর performance overhead উল্লেখযোগ্য। Production-এ সরাসরি ব্যবহার না করে `AsyncLocalStorage`-এর মতো higher-level API ব্যবহার করা উচিত।

**কখন useful:**

- Request tracing এবং distributed logging-এ।
- APM (Application Performance Monitoring) tool তৈরিতে।
- Async context propagation implement করতে।

---

### 📦 What is `AsyncLocalStorage` and how does it replace async hooks for context propagation?

`AsyncLocalStorage` হলো `async_hooks`-এর উপর ভিত্তি করে তৈরি একটি high-level API যা async operation-এর পুরো chain জুড়ে **context (data) automatically carry** করে — কোনো function-এ manually parameter pass না করেই।

সমস্যাটা বোঝা যাক — একটি HTTP request আসলে অনেক async step-এর মধ্য দিয়ে যায়। প্রতিটি step-এ `requestId` বা `userId` জানতে হলে সাধারণত সব function-এ parameter হিসেবে pass করতে হতো:

```js
// ❌ ছাড়া AsyncLocalStorage — সব জায়গায় manually pass করতে হচ্ছে
async function handleRequest(requestId) {
  const user = await getUser(requestId); // pass করতে হচ্ছে
  const data = await fetchData(requestId); // এখানেও
  await saveLog(requestId, user, data); // এখানেও
}
```

**`AsyncLocalStorage` দিয়ে সমাধান:**

```js
const { AsyncLocalStorage } = require("async_hooks");

const storage = new AsyncLocalStorage();

// Middleware — request আসলে context set করা হচ্ছে
function requestMiddleware(req, res, next) {
  const context = {
    requestId: crypto.randomUUID(),
    userId: req.headers["x-user-id"],
    startTime: Date.now(),
  };

  // এই context টি এই request-এর সব async chain-এ automatically পাওয়া যাবে
  storage.run(context, () => next());
}

// যেকোনো nested async function-এ, parameter ছাড়াই context পাওয়া যাচ্ছে
async function getUser() {
  const { userId, requestId } = storage.getStore(); // ✅ parameter ছাড়াই পাচ্ছি
  console.log(`Request ${requestId}: user ${userId} fetch করা হচ্ছে`);
  return db.query("SELECT * FROM users WHERE id = ?", [userId]);
}

async function saveLog(data) {
  const { requestId, startTime } = storage.getStore(); // ✅ এখানেও
  const duration = Date.now() - startTime;
  await logger.log({ requestId, duration, data });
}

async function handleRequest(req, res) {
  const user = await getUser(); // requestId pass করতে হচ্ছে না
  await saveLog(user); // এখানেও না
  res.json(user);
}
```

**দুটি request একসাথে আসলেও context আলাদা থাকে:**

```js
// Request A এবং Request B একই সময়ে চললেও
// প্রতিটির storage.getStore() নিজের context দেখাবে — কোনো mixing হবে না
storage.run({ requestId: "A" }, () => handleRequest());
storage.run({ requestId: "B" }, () => handleRequest());
```

|                     | `async_hooks` | `AsyncLocalStorage` |
| ------------------- | ------------- | ------------------- |
| Level               | Low-level     | High-level          |
| Performance         | বেশি overhead | অনেক কম overhead    |
| ব্যবহারের সহজতা     | জটিল          | সহজ                 |
| Context propagation | Manual        | Automatic           |

---

## 📌 31. What is the `util.promisify` function and how does it work?

`util.promisify` হলো Node.js-এর built-in একটি utility function যা **Node.js-এর standard `callback(err, result)` pattern** অনুসরণ করা যেকোনো function কে automatically Promise-based function-এ convert করে।

```js
const util = require("util");
const fs = require("fs");

// fs.readFile একটি callback-based function
// স্বাভাবিক ব্যবহার:
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// util.promisify দিয়ে Promise-এ convert:
const readFile = util.promisify(fs.readFile);

// এখন async/await দিয়ে ব্যবহার করা যাচ্ছে
const data = await readFile("file.txt", "utf8"); // ✅ অনেক পরিষ্কার
console.log(data);
```

**`util.promisify` ভেতরে কীভাবে কাজ করে:**

```js
// util.promisify মূলত এটাই করে:
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}
```

---

### 🛠️ How do you manually wrap a callback function in a Promise?

যখন function টি `util.promisify`-এর standard pattern অনুসরণ করে না, তখন manually `new Promise()` দিয়ে wrap করতে হয়।

```js
// একটি third-party callback-based function
function connectToDatabase(host, port, callback) {
  // ... connection logic ...
  if (success) callback(null, connection);
  else callback(new Error("Connection failed"));
}

// Manual Promise wrapper:
function connectToDatabaseAsync(host, port) {
  return new Promise((resolve, reject) => {
    connectToDatabase(host, port, (err, connection) => {
      if (err) {
        reject(err); // error হলে Promise reject
      } else {
        resolve(connection); // সফল হলে Promise resolve
      }
    });
  });
}

// এখন async/await দিয়ে ব্যবহার:
try {
  const connection = await connectToDatabaseAsync("localhost", 5432);
  console.log("Connected:", connection);
} catch (err) {
  console.error("Failed:", err.message);
}
```

---

### 🧩 How do you handle callbacks that call `callback(result)` instead of `callback(err, result)`?

কিছু library (বিশেষত পুরনো) error-first pattern অনুসরণ করে না — তারা সরাসরি `callback(result)` call করে। এক্ষেত্রে `util.promisify` কাজ করবে না, manually wrap করতে হবে।

```js
// ❌ Non-standard pattern — error parameter নেই
function getUserById(id, callback) {
  const user = database.find(id);
  callback(user); // শুধু result, কোনো err নেই
}

// ✅ Manual wrapper দিয়ে handle করা:
function getUserByIdAsync(id) {
  return new Promise((resolve, reject) => {
    getUserById(id, (user) => {
      if (!user) {
        reject(new Error(`User ${id} পাওয়া যায়নি`));
      } else {
        resolve(user);
      }
    });
  });
}
```

**যদি success এবং error দুটো আলাদা callback থাকে:**

```js
// কিছু library এই pattern ব্যবহার করে
function loadImage(url, onSuccess, onError) {
  // ... loading logic ...
}

// Promise wrapper:
function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    loadImage(url, resolve, reject); // resolve এবং reject সরাসরি pass
  });
}

const image = await loadImageAsync("https://example.com/photo.jpg");
```

**`util.promisify`-কে custom symbol দিয়ে override করা:**

কোনো function-এর নিজস্ব promisified version থাকলে `util.promisify.custom` symbol দিয়ে define করা যায়:

```js
function getUserById(id, callback) {
  callback(database.find(id)); // non-standard
}

// Custom promisified version define করা
getUserById[util.promisify.custom] = (id) => {
  return new Promise((resolve, reject) => {
    const user = database.find(id);
    user ? resolve(user) : reject(new Error("Not found"));
  });
};

const getUserByIdAsync = util.promisify(getUserById);
// এখন util.promisify custom version টি ব্যবহার করবে ✅
const user = await getUserByIdAsync(42);
```
