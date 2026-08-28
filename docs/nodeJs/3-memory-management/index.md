---
sidebar_position: 1
title: 'Node.js Memory Management'
sidebar_label: 'Memory Management'
---

## 1. How is memory managed in JavaScript?

JavaScript-এ memory management **automatic** — developer-কে manually memory allocate বা free করতে হয় না। JavaScript engine (V8) নিজেই memory allocate করে এবং **Garbage Collector** অব্যবহৃত memory পরিষ্কার করে।

Memory management-এর তিনটি ধাপ:
1. **Allocation** — variable/object তৈরিতে memory দেওয়া
2. **Use** — allocated memory পড়া ও লেখা
3. **Release** — আর দরকার নেই এমন memory ফেরত দেওয়া

---

### Stack vs Heap

JavaScript দুটি আলাদা জায়গায় data রাখে — **Stack** এবং **Heap**।

```
┌─────────────────────────────────────────────┐
│                  MEMORY                     │
│                                             │
│   ┌──────────────┐   ┌───────────────────┐  │
│   │    STACK     │   │       HEAP        │  │
│   │  (ordered)   │   │   (unordered)     │  │
│   │              │   │                   │  │
│   │  age = 25    │   │  { name: 'Ali' }  │  │
│   │  score = 90  │   │  [1, 2, 3]        │  │
│   │  isOn = true │   │  function() {...} │  │
│   │              │   │  'hello' (string) │  │
│   │  Fast ⚡     │   │  Flexible 🗃️     │  │
│   └──────────────┘   └───────────────────┘  │
└─────────────────────────────────────────────┘
```

**Stack:**
- **Fixed size**, ordered, LIFO (Last In First Out)
- Primitive value (number, boolean, null, undefined ইত্যাদি) সরাসরি এখানে store হয়
- Function call হলে stack-এ **stack frame** যোগ হয়, return হলে সরে যায়
- **অত্যন্ত দ্রুত** — CPU সরাসরি access করে

**Heap:**
- **Dynamic size**, unordered
- Object, Array, Function — সব reference type এখানে store হয়
- Stack-এ শুধু heap-এর **address (reference)** রাখা হয়
- **তুলনামূলক ধীর** — pointer দিয়ে access করতে হয়

```js
// Stack-এ store হয়:
let age = 25;        // number value সরাসরি stack-এ
let isOn = true;     // boolean stack-এ

// Heap-এ store হয়:
let name = 'Ali';                    // string primitive হলেও internally
                                      // heap-এ একটি string object হিসেবে থাকে
let user = { name: 'Ali', age: 25 }; // object heap-এ
let nums = [1, 2, 3];                // array heap-এ
// name, user, nums — এই variable গুলোর reference/value stack-এ আছে,
// কিন্তু string, object, array-এর প্রকৃত data heap-এ থাকে
```

> **নোট:** JavaScript spec অনুযায়ী `string` একটি **primitive** type — মানে এটি immutable এবং value দিয়ে compare হয় (`a === b`)। কিন্তু এর মানে এই না যে string সবসময় "stack-এ" থাকে। বাস্তব engine implementation-এ (যেমন V8) string data প্রায়ই heap-এ একটি string object হিসেবে রাখা হয়, ছোট হোক বা বড় — engine internally caching/interning করতে পারে, কিন্তু "ছোট string stack-এ, বড় string heap-এ" এই ধারণাটি সঠিক নয়।

---

### Primitive vs reference types

**Primitive types** (JS spec অনুযায়ী value semantics — copy হলে value copy হয়):

| Type | Example | নোট |
|---|---|---|
| `number` | `42`, `3.14` | সাধারণত সরাসরি value হিসেবে আচরণ করে |
| `string` | `'hello'` | immutable, value দিয়ে compare হয়; internally heap-এ string object |
| `boolean` | `true`, `false` | সরাসরি value হিসেবে আচরণ করে |
| `null` | `null` | সরাসরি value |
| `undefined` | `undefined` | সরাসরি value |
| `symbol` | `Symbol('id')` | unique, সরাসরি value হিসেবে আচরণ করে |
| `bigint` | `9007199254740993n` | সরাসরি value হিসেবে আচরণ করে |

**Primitive copy — value copy হয়:**

```js
let a = 10;
let b = a;   // a-এর value copy হয়, আলাদা space তৈরি হয়

b = 99;

console.log(a); // 10 — অপরিবর্তিত
console.log(b); // 99

// Stack:
// a → [10]
// b → [99]  ← আলাদা slot
```

**Reference types** (Heap-এ object, Stack-এ address):

| Type | Example |
|---|---|
| `Object` | `{}`, `{ name: 'Ali' }` |
| `Array` | `[]`, `[1, 2, 3]` |
| `Function` | `function() {}` |
| `Date`, `Map`, `Set` | সব built-in objects |

**Reference copy — address copy হয়:**

```js
let obj1 = { name: 'Ali' };
let obj2 = obj1;  // address (reference) copy — একই object!

obj2.name = 'Rahim';

console.log(obj1.name); // 'Rahim' — obj1-ও পরিবর্তন হয়েছে! 😮
console.log(obj2.name); // 'Rahim'

// Stack:         Heap:
// obj1 → [0x01]─→ { name: 'Rahim' }
// obj2 → [0x01]─┘  (একই heap address!)
```

**সত্যিকারের copy (deep copy) করতে:**

```js
// Shallow copy — nested object এখনো shared থাকে
const copy1 = { ...obj1 };
const copy2 = Object.assign({}, obj1);

// Deep copy — সম্পূর্ণ আলাদা copy
const deepCopy = structuredClone(obj1); // modern, recommended
// অথবা: const deepCopy = JSON.parse(JSON.stringify(obj1)); // limitations আছে
```

> **⚠️ সতর্কতা:** Reference copy-র কারণে অনেক **unexpected mutation bug** হয়। Function-এ object pass করলে original object পরিবর্তন হতে পারে।

```js
function rename(user) {
  user.name = 'Changed'; // ❌ original object পরিবর্তন!
}

const person = { name: 'Ali' };
rename(person);
console.log(person.name); // 'Changed' — বাইরে থেকেও বদলে গেছে
```

---

### Memory allocation process

JavaScript-এ memory allocation তিনটি পর্যায়ে ঘটে:

**পর্যায় ১ — Primitive value allocation (execution-এর শুরুতেই):**
Primitive value-এর size fixed হওয়ায় (যেমন number সবসময় 8 bytes) JavaScript engine সহজেই ও দ্রুত এদের জন্য memory বরাদ্দ করতে পারে। এটি traditional static languages (C/C++)-এর মতো সত্যিকারের "compile-time allocation" নয় — কারণ JavaScript ahead-of-time compiled ভাষা নয়, বরং JIT (Just-In-Time) compiled/interpreted। তবে fixed-size হওয়ায় allocation predictable ও দ্রুত হয়।

```js
// Fixed size হওয়ায় engine দ্রুত allocate করতে পারে:
let count = 0;       // number
let flag = false;    // boolean
const MAX = 1000;    // number
```

> **নোট:** এখানে সরাসরি byte-size উল্লেখ করা হয়নি, কারণ প্রকৃত internal representation (V8-এর SMI tagging, NaN-boxing ইত্যাদি) engine ও optimization-ভেদে ভিন্ন হতে পারে — এগুলো implementation detail, JS spec-এর অংশ নয়।

**পর্যায় ২ — Dynamic allocation (runtime):**
Object এবং Array তৈরি হলে runtime-এ heap-এ memory নেওয়া হয়।

```js
// Runtime-এ heap-এ allocate হয়:
const users = [];              // প্রাথমিক allocation

users.push({ name: 'Ali' });  // আরো memory নেওয়া হয়
users.push({ name: 'Bob' });  // আবার বাড়ে

// V8 engine এর strategy:
// Array ছোট থাকলে → contiguous memory (fast)
// বড় হলে → sparse array বা hash-table mode (flexible)
```

**পর্যায় ৩ — Deallocation (Garbage Collection):**
কোনো variable আর reachable না হলে GC সেই memory free করে।

```js
function createUser() {
  const user = { name: 'Temp', data: new Array(10000) };
  return user.name; // শুধু name return হচ্ছে
  // user object আর reachable নয় → GC free করবে
}

let result = createUser(); // 'Temp'
// user object-এর জন্য নেওয়া memory এখন release হবে
```

**V8-এর Memory Heap Structure:**

```
V8 Heap
├── New Space (Young Generation)  ← নতুন object, ছোট, দ্রুত GC
│   ├── From Space (semi-space)
│   └── To Space (semi-space)
├── Old Space (Old Generation)    ← দীর্ঘস্থায়ী object, বড়
├── Code Space                    ← compiled JIT code
├── Map Space                     ← hidden classes এবং meta info
└── Large Object Space            ← বড় (~1MB+) object
```

```js
// New Space-এ শুরু:
let temp = { x: 1 }; // newly created → New Space

// কয়েকটি GC cycle survive করলে Old Space-এ যায়:
// long-lived objects → Old Space (major GC কম ঘন ঘন)
```

> **💡 মনে রাখুন:** JavaScript-এ memory allocation automatic হলেও **memory leak** হতে পারে — যখন আর দরকার নেই এমন object-এর reference রয়ে যায়। পরবর্তী section-এ এটি বিস্তারিত দেখা হবে।

## 2. How does garbage collection work in JavaScript?

**Garbage Collection (GC)** হলো JavaScript engine-এর automatic process যা অব্যবহৃত memory খুঁজে বের করে এবং সেটি free করে। Developer-কে manually `free()` বা `delete` করতে হয় না।

---

### What is reachability?

GC-এর মূল ধারণা হলো **reachability** — কোনো value যদি কোনোভাবেও access করা সম্ভব হয়, তাহলে সে "reachable", তাই memory-তে থাকবে। যদি না হয়, তাহলে GC সেই memory নেবে।

**Root (শুরুর point) গুলো সবসময় reachable:**
- Global variables
- Currently executing function-এর local variables ও parameters
- Call stack-এর সব function ও তাদের variables
- Closures যেখানে outer variables captured আছে

```js
// Reachable — root থেকে পৌঁছানো যাচ্ছে:
let user = { name: 'Ali' }; // user → { name: 'Ali' } — reachable ✅

// Reference মুছে দিলে unreachable হয়:
user = null;
// { name: 'Ali' } object-এ আর কোনো reference নেই → unreachable ❌
// GC এই memory free করবে
```

```js
// Circular reference — দুটো object একে অপরকে point করলেও
// যদি বাইরে থেকে কোনো reference না থাকে → unreachable
function createCycle() {
  let a = {};
  let b = {};
  a.ref = b;
  b.ref = a;
  // function শেষে a ও b — local, বাইরে থেকে অ্যাক্সেস নেই
}
createCycle();
// a ও b উভয়ই unreachable → GC দুটোকেই free করবে ✅
// (এটাই দেখায় কেন JS mark-and-sweep ব্যবহার করে, শুধু
// reference-counting নয় — reference-counting circular reference
// ধরতে পারত না)
```

---

### What is mark-and-sweep algorithm?

**Mark-and-sweep** হলো JavaScript-এর primary GC algorithm। দুটি ধাপে কাজ করে:

```
Phase 1 — MARK (চিহ্নিত করা):
  Root থেকে শুরু করে সব reachable object-এ "visited" mark করা হয়

Phase 2 — SWEEP (পরিষ্কার করা):
  Mark না পাওয়া (unreachable) object-এর memory free করা হয়
```

```
  [Root]
    │
    ├──→ [A] marked ✅ ──→ [C] marked ✅
    │
    └──→ [B] marked ✅

         [D] ← কোনো reference নেই → unmarked ❌ → SWEEP করা হবে
         [E] ← কোনো reference নেই → unmarked ❌ → SWEEP করা হবে
```

```js
let a = { name: 'A' };
let b = { name: 'B', ref: a }; // b → a

// mark করা হবে: root → b → a (সব reachable)

b = null; // b-এর reference মুছলাম
// এখন: root → a (এখনো reachable)
// শুধু b object unreachable হবে এবং sweep হবে

a = null; // এখন a-ও null
// এখন দুটোই unreachable → sweep-এ দুটোই free হবে
```

---

### How does V8 optimize GC?

V8 engine mark-and-sweep-এর উপর অনেক optimization যোগ করেছে:

**১. Generational GC (Minor + Major):**

```
New Space (Young Gen):  নতুন object, ছোট, Minor GC দ্রুত চলে (Scavenge)
Old Space (Old Gen):    দীর্ঘস্থায়ী object, Major GC মাঝে মাঝে চলে (Mark-Sweep-Compact)

বেশিরভাগ object তৈরির পরই মারা যায় (short-lived)
→ New Space-এ দ্রুত GC চালানো efficient
```

**২. Incremental GC:**
পুরো GC একসাথে না চালিয়ে ছোট ছোট ধাপে চালায় — যাতে app pause না হয়।

**৩. Concurrent & Parallel GC:**
Main thread চলতে চলতে background thread-এ GC চলে — user experience smooth থাকে।

**৪. Scavenge algorithm (New Space):**
New Space-এ semi-space copying algorithm ব্যবহার হয় — From-space থেকে To-space-এ live objects copy করা হয়, বাকি সব discard।

```js
// V8 optimization hint — short-lived object pattern:
function processData(items) {
  // এই temp object function শেষে মারা যাবে → New Space-এ দ্রুত GC
  const result = items.map(item => ({ ...item, processed: true }));
  return result;
}
// Long-lived object না তৈরি করলে GC অনেক কম কাজ করে
```

---

## 3. What are common causes of memory leaks?

**Memory leak** হয় যখন allocated memory আর দরকার নেই, কিন্তু GC-এর কাছে সেটি এখনো **reachable** মনে হয় — ফলে free হয় না। সময়ের সাথে সাথে memory বাড়তে থাকে।

---

### Global variables

Global variable সবসময় root থেকে reachable — GC কখনো free করতে পারে না।

```js
// ❌ Accidental global — 'use strict' ছাড়া
function processUser() {
  userData = { name: 'Ali', history: new Array(100000) };
  // var/let/const নেই → global variable তৈরি হয়ে গেছে!
}

processUser();
// userData এখন global → function শেষেও memory মুক্ত হবে না 😱
```

```js
// ❌ Intentional global — data জমতে থাকে
window.cache = {};

function addToCache(key, value) {
  window.cache[key] = value; // কখনো পরিষ্কার করা হচ্ছে না
}

// প্রতিবার call-এ cache বড় হচ্ছে — leak!
```

```js
// ✅ সমাধান — local scope বা module scope ব্যবহার করুন
function processUser() {
  'use strict'; // accidental global প্রতিরোধ
  const userData = { name: 'Ali' }; // local → GC করতে পারবে
}
```

---

### Closures

Closure-এ outer function-এর variable ধরে রাখা হয় — যদি closure দীর্ঘস্থায়ী হয় তাহলে বড় data-ও ধরে থাকে।

```js
// ❌ বড় data closure-এ আটকে আছে
function createCounter() {
  const hugeData = new Array(1000000).fill('data'); // 1M items!

  let count = 0;
  return function () {
    count++;
    // hugeData ব্যবহার না হলেও closure-এর scope chain-এ আছে
    return count;
  };
}

const counter = createCounter();
// Modern JS engines optimize করে unused variables সরিয়ে দেয়,
// কিন্তু complex cases-এ এখনো leak হতে পারে
```

```js
// ✅ সমাধান — অপ্রয়োজনীয় data closure-এ না রাখুন
function createCounter() {
  // hugeData এখানে নেই
  let count = 0;
  return function () {
    return ++count;
  };
}
```

```js
// ❌ Event handler closure — DOM node ধরে রাখে
function setup() {
  const element = document.getElementById('btn');
  const largeData = new Array(100000);

  element.addEventListener('click', function () {
    console.log(largeData.length); // largeData closure-এ আটকা
  });
  // element remove হলেও listener এবং largeData GC হবে না
}
```

---

### Event listeners

Event listener add করে remove না করলে — listener এবং তার closure সবকিছু memory-তে থেকে যায়।

```js
// ❌ Leak — listener কখনো remove হয় না
class DataFetcher {
  constructor() {
    this.data = new Array(500000);
    // প্রতিবার নতুন instance তৈরিতে listener যোগ হয়
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  handleResize() { /* ... */ }
}

// প্রতিবার নতুন DataFetcher() তৈরি করলে
// আগেরটা GC হয় না — window.resize-এ listener আছে বলে reachable!
const f1 = new DataFetcher();
const f2 = new DataFetcher(); // f1 এর listener এখনো আছে
const f3 = new DataFetcher(); // f1, f2 এর listener এখনো আছে — leak!
```

```js
// ✅ সমাধান — listener কে named function করুন এবং remove করুন
class DataFetcher {
  constructor() {
    this.data = new Array(500000);
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() { /* ... */ }

  destroy() {
    window.removeEventListener('resize', this.handleResize); // ✅ cleanup
    this.data = null;
  }
}

const fetcher = new DataFetcher();
// ব্যবহার শেষে:
fetcher.destroy(); // listener সরানো হলো, GC করতে পারবে
```

---

### Timers

`setInterval` বা `setTimeout` চালু রেখে clear না করলে callback এবং closure সব memory-তে আটকে থাকে।

```js
// ❌ setInterval — কখনো বন্ধ হয় না
function startPolling() {
  const config = { endpoint: '/api/data', retries: 3, timeout: 5000 };

  setInterval(function () {
    // config closure-এ ধরা — interval চলতে থাকলে config কখনো GC হবে না
    fetch(config.endpoint);
  }, 1000);

  // interval ID ধরে রাখা হয়নি → বন্ধ করার উপায় নেই!
}

startPolling();
// এখন interval চিরকাল চলবে, config সহ 😱
```

```js
// ✅ সমাধান — ID সংরক্ষণ করুন এবং clearInterval করুন
class Poller {
  constructor() {
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.fetchData();
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // ✅ বন্ধ করা হলো
      this.intervalId = null;
    }
  }

  fetchData() { /* ... */ }
}

const poller = new Poller();
poller.start();
// ব্যবহার শেষে:
poller.stop(); // memory free হবে
```

**অতিরিক্ত leak source — Detached DOM nodes:**

```js
// ❌ DOM node remove হলেও reference থাকলে GC হবে না
let button = document.getElementById('btn');
document.body.removeChild(button);
// button variable এখনো DOM node reference করছে → detached node leak
// button = null; করতে হবে
```

---

## 4. How do you detect memory leaks in JavaScript?

Memory leak সাধারণত ধীরে ধীরে হয় — সহজে দেখা যায় না। সঠিক tools এবং symptom চেনা দরকার।

---

### What symptoms indicate a leak?

| Symptom | Description |
|---|---|
| Memory ক্রমাগত বাড়ছে | Task Manager বা DevTools-এ দেখা যাচ্ছে |
| সময়ের সাথে app ধীর হচ্ছে | GC বারবার চালাতে হচ্ছে |
| Tab crash বা "out of memory" | Memory সর্বোচ্চ সীমা ছাড়িয়ে গেছে |
| Scroll বা animation jerky | Main thread GC-তে ব্যস্ত |
| Node.js-এ heap used বাড়ছে | `process.memoryUsage()` দিয়ে দেখা যায় |

```js
// Node.js — memory monitoring
setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    heapUsed:  `${Math.round(mem.heapUsed  / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
    rss:       `${Math.round(mem.rss       / 1024 / 1024)} MB`,
  });
}, 5000);
// heapUsed ক্রমাগত বাড়লে leak সন্দেহ করুন
```

---

### What tools can you use (Chrome DevTools, heap snapshots)?

**Chrome DevTools — Memory Tab:**

```
1. Chrome DevTools খুলুন (F12)
2. "Memory" tab-এ যান
3. "Heap snapshot" নিন → বেসলাইন
4. কিছু action করুন (যেখানে leak সন্দেহ)
5. আবার "Heap snapshot" নিন
6. দুটো snapshot compare করুন → নতুন কী allocate হয়েছে দেখুন
```

**Performance Monitor:**
```
DevTools → More tools → Performance monitor
→ JS Heap Size এর graph দেখুন
→ ক্রমাগত বাড়তে থাকা = leak
```

**Allocation Timeline:**
```
Memory tab → Allocation instrumentation on timeline
→ Record করুন, actions করুন, stop করুন
→ Blue bars = allocations, কোথায় বেশি allocation হচ্ছে দেখুন
```

**Node.js — `--inspect` flag:**
```bash
node --inspect app.js
# Chrome-এ chrome://inspect খুলুন
# "Memory" tab থেকে heap snapshot নিন
```

**`clinic` package (Node.js profiling):**
```bash
npm install -g clinic
clinic doctor -- node app.js
# Browser-এ report খুলবে memory এবং CPU profile সহ
```

---

### How do you analyze retained objects?

**Heap Snapshot-এ কী দেখবেন:**

```
Snapshot Summary:
┌─────────────────────────────────────────────┐
│ Constructor    │ Objects │ Shallow │ Retained│
│────────────────┼─────────┼─────────┼─────────│
│ Array          │  1,204  │ 48 KB   │ 12 MB   │← Retained বেশি = সন্দেহজনক
│ Closure        │    892  │ 28 KB   │  8 MB   │← Closure-এ কী আটকা?
│ (system)       │    456  │ 14 KB   │  3 MB   │← Detached DOM nodes
└─────────────────────────────────────────────┘

Shallow size  = object নিজের size
Retained size = এই object free হলে কতটুকু memory বাচবে (dependencies সহ)
```

**Comparison snapshot workflow:**
```
Snapshot 1 (before action)
    ↓ action করুন (e.g., open/close modal 3 times)
Snapshot 2 (after action)
    ↓ DevTools-এ "Comparison" view
→ "New" এবং "Deleted" দেখুন — ideal-এ balanced হবে
→ যদি "New" বেশি থাকে → leak হচ্ছে
→ Retainer tree দেখুন — কে ধরে রেখেছে সেই object
```

**Retainer tree বিশ্লেষণ:**
```
Object → কে retain করছে chain:
  Window
    → global variable 'cache'
      → Map entries
        → User object #12345
```

---

## 5. How do you optimize memory usage in large applications?

Memory optimization মানে শুধু leak ঠেকানো নয় — **efficient data structure** ব্যবহার এবং **reference lifecycle** সচেতনভাবে manage করা।

---

### Avoid unnecessary references

```js
// ❌ পুরো object ধরে রাখা — শুধু একটা field দরকার
function processUsers(users) {
  const allData = users; // পুরো array reference — কেউ GC করতে পারবে না
  return allData.map(u => u.name);
}

// ✅ শুধু দরকারি data নিন
function processUsers(users) {
  return users.map(u => u.name); // users-এর reference ধরে রাখছি না
}
```

```js
// ❌ Cache unbounded growth
const cache = {};
function getUser(id) {
  if (!cache[id]) {
    cache[id] = fetchUser(id); // cache কখনো পরিষ্কার হয় না
  }
  return cache[id];
}

// ✅ LRU cache বা সীমিত size রাখুন
const MAX_CACHE = 100;
const cache = new Map();

function getUser(id) {
  if (cache.has(id)) return cache.get(id);
  const user = fetchUser(id);
  if (cache.size >= MAX_CACHE) {
    // সবচেয়ে পুরোনোটি সরান
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(id, user);
  return user;
}
```

---

### Clean up listeners/timers

```js
// ✅ React-style cleanup pattern
class Component {
  constructor(element) {
    this.element = element;
    this.timers = [];
    this.listeners = [];
  }

  addTimer(fn, ms) {
    const id = setInterval(fn, ms);
    this.timers.push(id);
    return id;
  }

  addListener(el, event, fn) {
    el.addEventListener(event, fn);
    this.listeners.push({ el, event, fn });
  }

  destroy() {
    // সব timer বন্ধ করুন
    this.timers.forEach(id => clearInterval(id));
    this.timers = [];

    // সব listener সরান
    this.listeners.forEach(({ el, event, fn }) => {
      el.removeEventListener(event, fn);
    });
    this.listeners = [];

    this.element = null; // DOM reference ছেড়ে দিন
  }
}
```

```js
// Node.js — AbortController দিয়ে cleanup
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch cancelled');
    }
  });

// আর দরকার না হলে:
controller.abort(); // fetch বাতিল, listener সরে যাবে
```

---

### Use weak references (WeakMap, WeakSet)

`WeakMap` এবং `WeakSet` — object রাখে, কিন্তু GC-এর কাছে সেটি **strong reference** হিসেবে গণ্য হয় না। Object unreachable হলে WeakMap/WeakSet-এর entry automatically সরে যায়।

```js
// ❌ Regular Map — object GC হতে পারে না
const map = new Map();

let user = { name: 'Ali' };
map.set(user, { lastSeen: Date.now() });

user = null;
// user → null, কিন্তু map এখনো object ধরে রেখেছে → GC হবে না!
console.log(map.size); // 1 — এখনো আছে
```

```js
// ✅ WeakMap — key GC হলে entry automatically সরে যায়
const weakMap = new WeakMap();

let user = { name: 'Ali' };
weakMap.set(user, { lastSeen: Date.now() });

user = null;
// user → null → { name: 'Ali' } unreachable → GC করবে
// weakMap-এর entry-ও automatically চলে যাবে ✅
```

**Real-world use case — DOM metadata:**

```js
// ✅ DOM element-এর সাথে data রাখুন — element remove হলে data-ও GC হবে
const metadata = new WeakMap();

function attachData(element, data) {
  metadata.set(element, data);
}

function getData(element) {
  return metadata.get(element);
}

const btn = document.querySelector('#btn');
attachData(btn, { clickCount: 0, userId: 42 });

// btn DOM থেকে remove হলে metadata-ও automatically free হবে
// Regular Map হলে হতো না!
```

**WeakMap vs WeakSet — তুলনা:**

`WeakMap` key-value pair রাখে (key অবশ্যই object হতে হবে), কিন্তু `WeakSet` শুধু value (member) রাখে key-value pair নয়।

| | `Map` | `WeakMap` | `WeakSet` |
|---|---|---|---|
| Structure | Key-Value pair | Key-Value pair | শুধু Value (member) |
| Key/Value type | যেকোনো | Key: Object only | Value: Object only |
| GC prevent করে? | ✅ হ্যাঁ | ❌ না | ❌ না |
| Iterable? | ✅ হ্যাঁ | ❌ না | ❌ না |
| `.size` আছে? | ✅ হ্যাঁ | ❌ না | ❌ না |
| কখন ব্যবহার | General cache | Object metadata (key-value) | Object membership check |

> **💡 সুপারিশ:** Object-এর সাথে extra data (key-value আকারে) রাখতে হলে `WeakMap`, আর শুধু "এই object-টা কি set-এ আছে কিনা" চেক করতে হলে `WeakSet` ব্যবহার করুন — দুটোই automatic memory cleanup নিশ্চিত করে।
