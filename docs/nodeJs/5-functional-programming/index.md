---
sidebar_position: 1
title: ''
---

## 1. What is a pure function?

**Pure function** হলো এমন একটি function যা:
1. **একই input-এ সবসময় একই output** দেয়
2. **কোনো side effect নেই** — বাইরের কিছু পরিবর্তন করে না

```js
// ✅ Pure function — same input → same output, no side effects
function add(a, b) {
  return a + b;
}
add(2, 3); // সবসময় 5 — predictable

// ❌ Impure — বাইরের state-এর উপর নির্ভর করে
let tax = 0.1;
function getPrice(price) {
  return price + price * tax; // tax বাইরে থেকে আসছে — impure!
}

// ✅ Pure version:
function getPrice(price, taxRate) {
  return price + price * taxRate; // সব input parameter হিসেবে আসছে
}
```

---

### What are side effects?

**Side effect** হলো function-এর মূল return value-এর বাইরে যেকোনো পরিবর্তন বা interaction:

```js
// Side effect-এর উদাহরণ:
let count = 0;

function increment() {
  count++; // ❌ বাইরের variable পরিবর্তন করছে (side effect)
  return count;
}

// আরো side effect:
function logAndDouble(n) {
  console.log(n);        // ❌ I/O operation — side effect
  return n * 2;
}

function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user)); // ❌ DOM/storage mutation
  database.save(user);   // ❌ network call
  sendEmail(user.email); // ❌ external system
}
```

**Side effect মানেই খারাপ নয় —** real application-এ side effect দরকার। কিন্তু সেগুলো **isolate** করা উচিত:

```js
// ✅ Pure logic আলাদা, side effect আলাদা:
function calculateTotal(items) {          // pure — শুধু logic
  return items.reduce((sum, item) => sum + item.price, 0);
}

function displayTotal(total) {            // side effect — UI update
  document.getElementById('total').textContent = total;
}

// ব্যবহার:
const total = calculateTotal(cartItems); // pure step
displayTotal(total);                      // side effect step
```

---

### Why are pure functions important?

```js
// ১. Predictable — debug করা সহজ:
function formatName(first, last) {
  return `${first} ${last}`.trim();
}
// যেকোনো সময় call করুন — একই result, কোনো surprise নেই

// ২. Memoizable — একই input-এ cache করা যায়:
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // cache hit
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  // ধরুন এটি অনেক সময় নেয়
  return n * n * n;
});

expensiveCalc(100); // calculate হয়
expensiveCalc(100); // cache থেকে instant ✅

// ৩. Parallelizable — race condition নেই:
// Pure function-এ shared state নেই, তাই parallel চালানো safe
const results = [1, 2, 3, 4, 5].map(n => n * n); // parallel-safe
```

---

### How do they improve testability?

```js
// ❌ Impure — test করা কঠিন (database, network mock করতে হয়)
async function getUserAge(userId) {
  const user = await database.find(userId); // external dependency
  return new Date().getFullYear() - user.birthYear; // Date-ও non-deterministic
}

// ✅ Pure — test করা সহজ, no mock দরকার
function calculateAge(birthYear, currentYear) {
  return currentYear - birthYear;
}

// Test:
console.assert(calculateAge(1995, 2024) === 29, 'Age calculation correct');
console.assert(calculateAge(2000, 2024) === 24, 'Age calculation correct');
// কোনো database, timer, বা network mock ছাড়াই test চলে ✅
```

---

## 2. What are higher-order functions?

**Higher-order function (HOF)** হলো এমন function যা:
- অন্য function-কে **argument হিসেবে নেয়**, অথবা
- অন্য function-কে **return করে**, অথবা দুটোই

```js
// HOF — function argument হিসেবে নেয়:
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i); // passed function call করছে
  }
}

repeat(3, console.log); // 0, 1, 2

// HOF — function return করে:
function multiplier(factor) {
  return (number) => number * factor; // নতুন function return
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

### Functions returning functions

```js
// Closure ব্যবহার করে state ধরে রাখে:
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset:     () => { count = start; },
    value:     () => count,
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.value());     // 11

// Middleware pattern (Express-এ):
function logger(prefix) {
  return function (req, res, next) {
    console.log(`[${prefix}] ${req.method} ${req.url}`);
    next();
  };
}

app.use(logger('INFO')); // customized middleware
```

---

### Functions taking functions as arguments

```js
// Custom sort — comparison function argument হিসেবে:
const users = [
  { name: 'Charlie', age: 25 },
  { name: 'Alice',   age: 30 },
  { name: 'Bob',     age: 20 },
];

// বয়স অনুযায়ী sort:
users.sort((a, b) => a.age - b.age);
// [Bob(20), Charlie(25), Alice(30)]

// নাম অনুযায়ী sort:
users.sort((a, b) => a.name.localeCompare(b.name));
// [Alice, Bob, Charlie]

// Generic retry function:
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.log(`Attempt ${attempt} failed, retrying...`);
    }
  }
}

const data = await withRetry(() => fetch('/api/data').then(r => r.json()));
```

---

### Examples (`map`, `filter`, `reduce`)

**`map`** — প্রতিটি element transform করে নতুন array:

```js
const prices = [100, 250, 80, 320];

// ❌ Imperative style:
const discounted = [];
for (let i = 0; i < prices.length; i++) {
  discounted.push(prices[i] * 0.9);
}

// ✅ map:
const discounted = prices.map(price => price * 0.9);
// [90, 225, 72, 288]

// Object array transform:
const users = [{ name: 'Ali', age: 25 }, { name: 'Rina', age: 30 }];
const names = users.map(user => user.name); // ['Ali', 'Rina']
```

**`filter`** — condition অনুযায়ী element বাছাই করে:

```js
const scores = [45, 78, 32, 90, 55, 88];

const passed = scores.filter(score => score >= 60);
// [78, 90, 88]

// Chain করা যায়:
const highScores = scores
  .filter(score => score >= 60)     // pass করেছে
  .filter(score => score >= 80);    // distinction পেয়েছে
// [90, 88]
```

**`reduce`** — array collapse করে একটি value বানায়:

```js
const cart = [
  { name: 'Book',     price: 200, qty: 2 },
  { name: 'Pen',      price: 20,  qty: 5 },
  { name: 'Notebook', price: 80,  qty: 3 },
];

// Total calculate:
const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
// 200*2 + 20*5 + 80*3 = 400 + 100 + 240 = 740

// Array থেকে object তৈরি:
const byName = cart.reduce((acc, item) => {
  acc[item.name] = item;
  return acc;
}, {});
// { Book: {...}, Pen: {...}, Notebook: {...} }

// Chaining — একসাথে:
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .filter(n => n % 2 === 0)         // even: [2,4,6,8,10]
  .map(n => n * n)                   // square: [4,16,36,64,100]
  .reduce((sum, n) => sum + n, 0);   // sum: 220
```

---

## 3. What is currying?

**Currying** হলো একটি technique যেখানে multiple argument-এর একটি function কে **একটি করে argument নেওয়া** nested function-এর chain-এ রূপান্তর করা হয়।

```js
// Normal function: f(a, b, c)
function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3); // 6

// Curried version: f(a)(b)(c)
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

curriedAdd(1)(2)(3);  // 6
const add1 = curriedAdd(1);       // a = 1 fixed
const add1and2 = add1(2);         // a = 1, b = 2 fixed
console.log(add1and2(3));          // 6
console.log(add1and2(10));         // 13 — b পরিবর্তন না করেও reuse!
```

---

### How does currying work?

**Manual currying:**

```js
// Arrow function দিয়ে compact currying:
const multiply = a => b => a * b;

const double = multiply(2);  // a = 2 captured
const triple = multiply(3);  // a = 3 captured

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**Generic curry utility:**

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // সব argument পাওয়া গেছে → execute করো
      return fn.apply(this, args);
    }
    // আরো argument দরকার → নতুন function return করো
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// ⚠️ সীমাবদ্ধতা: curry() শুধু fixed-arity function-এ কাজ করে।
// Default parameter বা rest parameter (...args) ব্যবহার করলে
// fn.length = 0 হয়ে যায়, তাই curry() সঠিকভাবে কাজ করবে না।

function sum(a, b, c) { return a + b + c; }

const curriedSum = curry(sum);

curriedSum(1)(2)(3);      // 6 — একটি করে
curriedSum(1, 2)(3);      // 6 — দুটো + একটি
curriedSum(1)(2, 3);      // 6 — একটি + দুটো
curriedSum(1, 2, 3);      // 6 — সব একসাথে
```

---

### What are real-world use cases?

**১. Reusable validator:**

```js
const validate = (rule) => (value) => rule(value);

const isRequired    = validate(v => v !== null && v !== undefined && v !== '');
const isEmail       = validate(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
const minLength = n => validate(v => v.length >= n);

console.log(isRequired('Ali'));       // true
console.log(isEmail('ali@test.com')); // true
console.log(minLength(6)('hello'));   // false (length 5 < 6)
console.log(minLength(3)('Ali'));     // true
```

**২. Event handler factory:**

```js
const handleEvent = (type) => (payload) => {
  console.log(`Event: ${type}`, payload);
};

const handleClick  = handleEvent('CLICK');
const handleSubmit = handleEvent('SUBMIT');

button.addEventListener('click',  e => handleClick(e.target.id));
form.addEventListener('submit',   e => handleSubmit(e.target.value));
```

**৩. API request builder:**

```js
const request = (baseUrl) => (endpoint) => (params) =>
  fetch(`${baseUrl}${endpoint}`, { ...params });

const apiCall     = request('https://api.example.com');
const userApi     = apiCall('/users');
const productApi  = apiCall('/products');

userApi({ method: 'GET' });                      // GET /users
productApi({ method: 'POST', body: '...' });     // POST /products
```

---

### Difference between currying and partial application

| | Currying | Partial Application |
|---|---|---|
| Argument | একটি করে নেয় | একাধিক একসাথে fix করা যায় |
| Return | সবসময় unary function | যেকোনো arity-র function |
| Tool | `curry(fn)` | `fn.bind(null, a, b)` বা closure |
| পদ্ধতি | প্রতিটি argument-এর জন্য আলাদা function chain (systematic) | কিছু argument manually আগেই fix করা হয়, বাকি পরে দেওয়া হয় |

```js
// Currying — একটি করে:
const curriedAdd = a => b => c => a + b + c;
curriedAdd(1)(2)(3); // 6

// Partial Application — কিছু argument আগেই fix, বাকি পরে:
function add(a, b, c) { return a + b + c; }

const add10 = add.bind(null, 10);        // a = 10 fixed
add10(5, 3);   // 18 — b এবং c একসাথে

const add10and5 = add.bind(null, 10, 5); // a=10, b=5 fixed
add10and5(3);  // 18 — শুধু c দরকার

// Currying দিয়ে partial application-ও করা যায়:
const curriedAdd10 = curriedAdd(10); // partial — a fixed
curriedAdd10(5)(3); // 18
```

---

## 4. What is immutability?

**Immutability** মানে হলো একটি data structure তৈরি হওয়ার পর সেটি **পরিবর্তন করা যায় না**। পরিবর্তনের দরকার হলে original-টি রেখে **নতুন copy** তৈরি করা হয়।

```js
// ❌ Mutable — original পরিবর্তন হয়:
const user = { name: 'Ali', age: 25 };
user.age = 26; // direct mutation — original বদলে গেল

// ✅ Immutable — নতুন copy তৈরি করা হয়:
const user = { name: 'Ali', age: 25 };
const updatedUser = { ...user, age: 26 }; // নতুন object

console.log(user.age);        // 25 — অপরিবর্তিত ✅
console.log(updatedUser.age); // 26 — নতুন object
```

---

### Why is immutability important?

**১. Predictability — state history track করা যায়:**

```js
// ✅ Immutable state — undo/redo সহজ
const history = [];

function applyChange(state, change) {
  const newState = { ...state, ...change };
  history.push(state); // আগের state সংরক্ষিত
  return newState;
}

let state = { count: 0, name: 'Ali' };
state = applyChange(state, { count: 1 });
state = applyChange(state, { count: 2 });

console.log(history[0]); // { count: 0, name: 'Ali' }
console.log(history[1]); // { count: 1, name: 'Ali' }
console.log(state);       // { count: 2, name: 'Ali' }
```

**২. Bug prevention — unexpected mutation এড়ানো:**

```js
// ❌ Mutable — function অজান্তে caller-এর data বদলায়:
function addDiscount(cart) {
  cart.total *= 0.9; // original cart পরিবর্তন! 😱
  return cart;
}

const myCart = { total: 100, items: ['Book'] };
const discountedCart = addDiscount(myCart);
console.log(myCart.total); // 90 — original বদলে গেছে!

// ✅ Immutable version:
function addDiscount(cart) {
  return { ...cart, total: cart.total * 0.9 }; // নতুন object
}
console.log(myCart.total);         // 100 — অপরিবর্তিত ✅
console.log(discountedCart.total); // 90
```

**৩. Concurrent safety — Node.js async code-এ:**

```js
// ❌ Shared mutable state — async-এ race condition:
let sharedData = { requests: 0 };

async function handleRequest() {
  sharedData.requests++; // ❌ multiple async handlers একই object মিউটেট
}

// ✅ Immutable — কোনো shared state নেই:
async function handleRequest(data) {
  return { ...data, requests: data.requests + 1 }; // নতুন object
}
```

---

### How do you enforce immutability in JS?

**`Object.freeze()` — shallow freeze:**

```js
const config = Object.freeze({
  host: 'localhost',
  port: 3000,
  db: { name: 'mydb' } // nested object freeze হয় না!
});

config.port = 8080; // ❌ silently ignored (strict mode-এ TypeError)
console.log(config.port); // 3000 — অপরিবর্তিত ✅

// ⚠️ Shallow — nested object এখনো mutable:
config.db.name = 'hacked!'; // ❌ কাজ করে — freeze shallow!
console.log(config.db.name); // 'hacked!'

// ✅ Deep freeze:
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}

const frozenConfig = deepFreeze({ host: 'localhost', db: { name: 'mydb' } });
frozenConfig.db.name = 'hacked'; // ❌ TypeError in strict mode
```

**Spread operator / `Object.assign` দিয়ে immutable update:**

```js
// Object update — spread:
const original = { a: 1, b: 2, c: 3 };
const updated  = { ...original, b: 99 }; // b override হলো
// original অপরিবর্তিত ✅

// Array update — spread:
const arr = [1, 2, 3, 4, 5];

// Add:
const withNew      = [...arr, 6];                          // [1,2,3,4,5,6]
// Remove:
const withoutThird = arr.filter((_, i) => i !== 2);        // [1,2,4,5]
// Update:
const updated      = arr.map((v, i) => i === 1 ? 99 : v); // [1,99,3,4,5]
```

**`const` — reference immutable, value নয়:**

```js
const arr = [1, 2, 3];
arr.push(4);        // ⚠️ কাজ করে, কিন্তু immutability নষ্ট করে — avoid করুন
arr = [1, 2, 3, 4]; // ❌ TypeError — reference reassign করা যায় না

// ✅ Array-এর content freeze করতে:
const frozenArr = Object.freeze([1, 2, 3]);
frozenArr.push(4); // TypeError ✅
```

**`structuredClone` দিয়ে deep copy:**

```js
const original = { user: { name: 'Ali', scores: [90, 85] } };
const copy = structuredClone(original); // deep clone

copy.user.name = 'Rahim';
copy.user.scores.push(95);

console.log(original.user.name);   // 'Ali'    — অপরিবর্তিত ✅
console.log(original.user.scores); // [90, 85] — অপরিবর্তিত ✅
```

---

### What are performance trade-offs?

**সমস্যা:** প্রতিটি update-এ নতুন object তৈরি হলে memory বেশি ব্যবহার হয়:

```js
// ❌ বড় array-এ প্রতি update-এ সম্পূর্ণ copy — expensive!
const bigArray = new Array(100000).fill(0);

// প্রতিটি এই operation নতুন 100000 element-এর array তৈরি করে:
const updated = [...bigArray, 1]; // O(n) time ও memory
```

**সমাধান ১ — Structural sharing (Persistent Data Structures):**

```js
// Immer.js — mutable syntax-এ immutable update:
import { produce } from 'immer';

const state = { users: [{ name: 'Ali', score: 90 }], total: 1 };

const newState = produce(state, draft => {
  draft.users[0].score = 95; // মনে হয় mutable, কিন্তু আসলে নতুন object তৈরি হয়
  draft.total++;
});

console.log(state.users[0].score);    // 90 — অপরিবর্তিত ✅
console.log(newState.users[0].score); // 95 ✅
// Immer internally structural sharing করে — শুধু changed part copy
```

**সমাধান ২ — Batch update:**

```js
// ❌ প্রতি step-এ নতুন object:
let state = { a: 1, b: 2, c: 3 };
state = { ...state, a: 10 }; // copy
state = { ...state, b: 20 }; // copy
state = { ...state, c: 30 }; // copy

// ✅ একসাথে update করুন:
state = { ...state, a: 10, b: 20, c: 30 }; // একটি copy
```

**Performance summary:**

| পরিস্থিতি | Mutable | Immutable |
|---|---|---|
| Small objects | Fast | Fast (spread cheap) |
| Large arrays (frequent update) | Fast | Slow (full copy) |
| Concurrent/async code | ⚠️ Race condition | ✅ Safe |
| Debug/testability | ❌ কঠিন | ✅ সহজ |
| Undo/redo feature | ❌ কঠিন | ✅ সহজ |

> **💡 সুপারিশ:** Application logic এবং state management-এ immutability অনুসরণ করুন। Performance-critical loop বা large data processing-এ mutable approach ব্যবহার করুন — তবে সেই অংশ isolate করুন।