---
sidebar_position: 1
title: 'Node.js Core Concepts'
---

## 1. What is Node.js, and what makes it different from other server-side technologies?
Node.js হলো একটি **open-source, cross-platform runtime environment** যা browser-এর বাইরে, অর্থাৎ server-এ JavaScript code execute করতে দেয়। এটি Google Chrome-এর **V8 JavaScript Engine** ব্যবহার করে তৈরি, এবং Ryan Dahl ২০০৯ সালে এটি প্রথম release করেন।

সহজ কথায় — আগে JavaScript শুধু browser-এ চলত। Node.js আসার পর থেকে JavaScript দিয়ে server-side programming করা সম্ভব হয়েছে।

### What makes it different from other server-side technologies:

**🧵 ১. Single-Threaded, Non-Blocking I/O Model**
Node.js একটিমাত্র thread ব্যবহার করে কাজ করে। কোনো database query বা file read করার সময় সে block হয়ে বসে থাকে না — বরং **Event Loop** এর মাধ্যমে অন্য কাজ চালিয়ে যায়, আর কাজ শেষ হলে **callback** বা **Promise** এর মাধ্যমে result ফেরত দেয়।

**⚡ ২. Asynchronous Architecture**
PHP বা Java-তে প্রতিটি request-এর জন্য আলাদা thread তৈরি হয়, যা memory-intensive। কিন্তু Node.js-এ **asynchronous, event-driven** approach-এর কারণে হাজার হাজার concurrent request অনেক কম resource-এ handle করা যায়।

**🌐 ৩. JavaScript Everywhere (Full-Stack)**
Frontend এবং backend — দুই জায়গাতেই JavaScript ব্যবহার করা যায়। এতে team-এর মধ্যে code sharing এবং context switching অনেক কমে যায়।

**📦 ৪. NPM (Node Package Manager)**
Node.js-এর সাথে আসে বিশ্বের সবচেয়ে বড় package ecosystem — **npm**। লক্ষাধিক ready-made library ও module মাত্র একটি command-এ ব্যবহার করা যায়।

**🚀 ৫. High Performance for I/O-Bound Tasks**
যেসব কাজে বেশি **I/O operation** (database read/write, API call, file system access) থাকে, সেখানে Node.js অত্যন্ত দ্রুত এবং efficient।

### 🎯 কোথায় Node.js সবচেয়ে ভালো কাজ করে?
- 💬 **Real-time applications** — Chat app, live notification
- 🔌 **REST API** বা **GraphQL API** তৈরিতে
- 🧩 **Microservices architecture**-এ
- 🎥 **Streaming applications** — Netflix, YouTube-এর মতো platforms
- 🌍 **Single Page Application (SPA)**-এর backend হিসেবে

> ⚠️ **একটু সতর্কতা:**  
> Node.js **CPU-intensive tasks** (heavy computation, image processing, machine learning) এর জন্য আদর্শ নয়, কারণ single thread block হয়ে গেলে পুরো application slow হয়ে যেতে পারে। এই ক্ষেত্রে Python বা Java বেশি উপযুক্ত।

### ⚡ How does Node.js's single-threaded nature impact its performance under high concurrency?
সাধারণত একটি program চালাতে OS একটি **thread** তৈরি করে। **Multi-threaded** system যেমন Java বা Apache-এ প্রতিটি নতুন request আসলে একটি নতুন thread তৈরি হয়। কিন্তু Node.js সবসময় **একটিমাত্র thread**-এ চলে।

এখন প্রশ্ন হলো — একটা thread দিয়ে হাজার হাজার user কীভাবে handle করে? 🤔

### 🎯 মূল রহস্য: Event Loop
Node.js-এর পুরো concurrency model দাঁড়িয়ে আছে **Event Loop**-এর উপর।
```
   ┌─────────────────────────────┐
   │        Your Code            │
   │    (Call Stack এ চলে)       │
   └──────────────┬──────────────┘
                  │
   ┌──────────────▼──────────────┐
   │         Event Loop          │  ← সবকিছুর কেন্দ্র
   └──────────────┬──────────────┘
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
  Timers       I/O ops    Callbacks
(setTimeout) (File/DB/  (Promise,
             Network)    async/await)
```
### 🎡 Event Loop কীভাবে কাজ করে — সহজ উদাহরণ:

ধরো একটি restaurant-এ একজনমাত্র waiter আছে (single thread)।
- সে order নেয় → রান্নাঘরে দেয় (I/O task শুরু)
- রান্না হওয়ার **অপেক্ষায় দাঁড়িয়ে থাকে না**
- অন্য table-এ চলে যায় order নিতে
- রান্না হলে **notification** আসে → সে খাবার deliver করে

এটাই Node.js-এর **Non-Blocking I/O** — অপেক্ষা না করে কাজ চালিয়ে যাওয়া।

**❌ Blocking (খারাপ — সব আটকে যাবে):**
```javascript
// Synchronous file read — thread block হয়ে যাবে
const data = fs.readFileSync('file.txt'); // এখানে আটকে থাকবে
console.log(data);
console.log('এই line টা আগেরটা শেষ না হলে চলবে না');
```

**✅ Non-Blocking (ভালো — Event Loop কাজ করবে):**
```javascript
// Asynchronous file read — thread block হবে না
fs.readFile('file.txt', (err, data) => {
    console.log(data); // কাজ শেষ হলে callback আসবে
});
console.log('এই line আগেই চলে যাবে!'); // এটা আগে print হবে
```

### 🚀 High Concurrency-তে কী হয়?
ধরো **১০,০০০ simultaneous request** এলো, সবাই database থেকে data চাইছে।

Java/PHP (Multi-threaded) approach:
```
Request 1  → Thread 1 তৈরি → DB query → অপেক্ষা → Response
Request 2  → Thread 2 তৈরি → DB query → অপেক্ষা → Response
Request 3  → Thread 3 তৈরি → DB query → অপেক্ষা → Response
...
Request 10000 → Thread 10000 → ❌ Memory শেষ! Crash!
```
প্রতিটি thread প্রায় **1-2MB RAM** নেয় → ১০,০০০ thread = ~**10-20GB RAM** 😱

**Node.js (Single-threaded) approach:**
```
Request 1  ──┐
Request 2  ──┤
Request 3  ──┼──→ Event Loop → সব DB query একসাথে পাঠাল
...          │                  (Async, Non-blocking)
Request 10000┘
                    ↓ যার যার result আসলে callback দিয়ে response পাঠাল ✅
```
মাত্র **একটি thread**, অনেক কম memory, হাজারো request handle! ✅

### ⚙️ Libuv — আসল কাজ যে করে
Node.js single-threaded হলেও behind the scenes **libuv** library একটি **Thread Pool** রাখে (default: 4 threads)।
```
Node.js Main Thread (Event Loop)
        │
        ▼
    libuv Thread Pool
   ┌────┬────┬────┬────┐
   │ T1 │ T2 │ T3 │ T4 │  ← Heavy I/O কাজ এখানে হয়
   └────┴────┴────┴────┘
   (File system, DNS, Crypto)
```
- **Network I/O** (HTTP, database) → OS-এর async mechanism ব্যবহার করে, thread pool লাগে না
- **File I/O, DNS lookup** → libuv-এর thread pool ব্যবহার করে

তাই বলা ঠিক না যে Node.js "সম্পূর্ণ" single-threaded — **JavaScript execution** single-threaded, কিন্তু **I/O operations** internally multi-threaded।

### ⚠️ কোথায় সমস্যা হয়? — CPU-Intensive Task
```javascript
// ❌ এই কাজ Event Loop কে block করে দেবে!
app.get('/calculate', (req, res) => {
    let result = 0;
    for (let i = 0; i < 10_000_000_000; i++) { // ভারী calculation
        result += i;
    }
    res.send({ result }); // এই সময় অন্য কোনো request serve হবে না!
});
```
এই ধরনের **CPU-bound task** Node.js-এর single thread-কে block করে দেয়, ফলে বাকি সব request queue-এ আটকে থাকে।

**সমাধান:**

| সমস্যা | সমাধান |
|---|---|
| Heavy computation | **Worker Threads** ব্যবহার করো |
| Multiple CPU cores ব্যবহার | **Cluster Module** দিয়ে multiple process তৈরি করো |
| External CPU task | আলাদা **Microservice**-এ পাঠাও |

> Node.js single-threaded হওয়া সত্ত্বেও **Event Loop + Non-Blocking I/O** এর কারণে high concurrency-তে অত্যন্ত ভালো perform করে — **যতক্ষণ CPU-intensive কাজ না থাকে।**

## 🧠 2. How does JavaScript execute code internally?

JavaScript code execute হওয়ার পেছনে বেশ কিছু component একসাথে কাজ করে। প্রতিটি ধাপ বোঝা দরকার।

#### 📖 ধাপ ১ — Parsing (Code পড়া ও বোঝা)

JavaScript engine (যেমন V8) সবার আগে source code টি পড়ে এবং দুটি কাজ করে:

**Tokenization / Lexing:** Code কে ছোট ছোট অর্থপূর্ণ অংশে (token) ভাগ করে।

```
let x = 10 + 5;
Tokens: [let] [x] [=] [10] [+] [5] [;]
```

**AST (Abstract Syntax Tree) তৈরি:** Token গুলো দিয়ে একটি tree structure তৈরি হয় যা code-এর logical structure represent করে।

```
      Assignment
      /        \
    'x'       BinaryExpr
              /    |    \
            10    '+'    5
```

Syntax error থাকলে এই ধাপেই ধরা পড়ে।

---

#### ⚙️ ধাপ ২ — Compilation (JIT)

JavaScript কে বলা হয় **interpreted language**, কিন্তু আধুনিক engines (V8, SpiderMonkey) আসলে **JIT (Just-In-Time) compilation** ব্যবহার করে।

```
Source Code
    ↓
   AST
    ↓
Bytecode (Ignition interpreter — দ্রুত শুরু করার জন্য)
    ↓
বারবার চালানো code (hot code) detect হলে
    ↓
Optimized Machine Code (TurboFan compiler — দ্রুত চালানোর জন্য)
```

যদি optimized code-এর assumption ভুল হয় (যেমন variable-এর type হঠাৎ বদলে গেলে), তাহলে **deoptimization** হয় এবং আবার bytecode-এ ফিরে যায়।

---

#### 🏗️ ধাপ ৩ — Execution Context তৈরি

Code execute শুরু হওয়ার আগে JavaScript engine **Execution Context** তৈরি করে। প্রতিটি Execution Context-এ দুটি phase থাকে:

**Phase 1 — Creation Phase (Hoisting):**

```js
console.log(x);    // undefined (error নয়!)
console.log(fn);   // [Function: fn]
var x = 10;
function fn() { return 'hello'; }
```

Creation phase-এ engine এগুলো করে:
- `var` declaration গুলো memory-তে রাখে, value দেয় `undefined`।
- `function` declaration গুলো সম্পূর্ণ memory-তে রাখে।
- `let` ও `const` declare করে কিন্তু initialize করে না (**Temporal Dead Zone**)।

**Phase 2 — Execution Phase:**

```js
var x = 10;      // এখন x = 10 assign হলো
console.log(x);  // 10
```

Line by line code execute হয়, value assign হয়।

---

#### 📚 ধাপ ৪ — Call Stack

JavaScript **single-threaded** — একসময়ে একটিই কাজ করতে পারে। Call Stack হলো সেই জায়গা যেখানে currently কোন function চলছে তা track হয়।

```js
function multiply(a, b) {
  return a * b;           // ধাপ 3: multiply চলছে
}

function square(n) {
  return multiply(n, n);  // ধাপ 2: square চলছে, multiply call করলো
}

function main() {
  const result = square(4); // ধাপ 1: main চলছে, square call করলো
  console.log(result);
}

main();
```

```
Call Stack এর অবস্থা:
ধাপ 1:        ধাপ 2:        ধাপ 3:        ধাপ 4:        ধাপ 5:
┌────────┐    ┌────────┐    ┌──────────┐   ┌────────┐    ┌────────┐
│        │    │ square │    │ multiply │   │ square │    │        │
│  main  │    │  main  │    │  square  │   │  main  │    │  main  │
└────────┘    └────────┘    │   main   │   └────────┘    └────────┘
                            └──────────┘
```

**Stack Overflow** হয় যখন stack-এর limit অতিক্রম হয়:

```js
function infinite() {
  return infinite(); // প্রতিবার নতুন frame, কখনো শেষ হয় না
}
infinite(); // RangeError: Maximum call stack size exceeded
```

---

#### 🗄️ ধাপ ৫ — Memory: Heap এবং Stack

```
┌─────────────────────────────────────────┐
│              Memory Layout               │
│  ┌──────────────┐   ┌────────────────┐  │
│  │  Call Stack  │   │      Heap      │  │
│  │ - Primitives │   │ - Objects {}   │  │
│  │ - References │   │ - Arrays []    │  │
│  │ - Execution  │   │ - Functions    │  │
│  │   Contexts   │   │ - Closures     │  │
│  └──────────────┘   └────────────────┘  │
└─────────────────────────────────────────┘
```

**Stack** — fixed size, fast access। Primitive value (`number`, `string`, `boolean`) এবং object-এর reference এখানে থাকে।

**Heap** — dynamic size। Object, array, function এর actual data এখানে থাকে।

```js
let a = 10;           // Stack-এ: a = 10
let b = a;            // Stack-এ: b = 10 (copy)
b = 20;
console.log(a);       // 10 — a অপরিবর্তিত

let obj1 = { x: 1 };  // Heap-এ object, Stack-এ reference
let obj2 = obj1;       // Stack-এ একই reference copy হলো
obj2.x = 99;
console.log(obj1.x);  // 99 — একই object!
```

---

#### 🔗 ধাপ ৬ — Scope Chain এবং Closure

প্রতিটি Execution Context-এর নিজস্ব **Lexical Environment** থাকে যা variable খোঁজার জন্য parent scope-এর দিকে যায়।

```js
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';

    // inner → outer → global — এই chain-এ খোঁজে
    console.log(innerVar);   // ✅ নিজের scope-এ
    console.log(outerVar);   // ✅ parent scope-এ
    console.log(globalVar);  // ✅ global scope-এ
    console.log(unknownVar); // ❌ কোথাও নেই — ReferenceError
  }

  inner();
}
```

**Closure** — function তার lexical scope মনে রাখে, যদিও সে scope-এর execution শেষ হয়ে গেছে:

```js
function makeCounter() {
  let count = 0;           // এই scope শেষ হবে

  return function() {
    count++;               // কিন্তু count এখনো accessible!
    return count;
  };
}

const counter = makeCounter(); // makeCounter-এর execution শেষ
counter(); // 1 — count এখনো মনে আছে
counter(); // 2
counter(); // 3
```

---

#### 🔄 ধাপ ৭ — Event Loop (Async কীভাবে কাজ করে)

JavaScript single-threaded হলেও async কাজ করতে পারে **Event Loop**-এর মাধ্যমে।

```
┌──────────────────────────────────────────────────────┐
│                    JavaScript Engine                  │
│                                                      │
│   ┌─────────────┐        ┌──────────────────────┐   │
│   │ Call Stack  │        │      Web APIs         │   │
│   │             │  call  │  (setTimeout, fetch,  │   │
│   │   main()    │───────▶│   DOM events, etc.)   │   │
│   │             │        └──────────┬───────────┘   │
│   └──────┬──────┘                   │ callback ready │
│          │ empty?                   ▼               │
│          │            ┌─────────────────────────┐   │
│          │            │    nextTick Queue        │   │
│          │            ├─────────────────────────┤   │
│          │            │    Microtask Queue       │   │
│          │            │  (Promise.then, etc.)    │   │
│          │            ├─────────────────────────┤   │
│          │            │    Macrotask Queue       │   │
│          │            │  (setTimeout, I/O, etc.) │   │
│          │            └──────────┬──────────────┘   │
│          │                       │                   │
│          └───────────────────────┘                   │
│                    Event Loop                        │
└──────────────────────────────────────────────────────┘
```

```js
console.log('1');              // Call Stack — এখনই

fetch('/api/data')             // Web API-তে পাঠানো হলো
  .then(res => res.json())
  .then(data => {
    console.log('4', data);    // Microtask Queue — পরে
  });

setTimeout(() => {
  console.log('5');            // Macrotask Queue — সবার শেষে
}, 0);

Promise.resolve().then(() => {
  console.log('3');            // Microtask Queue
});

console.log('2');              // Call Stack — এখনই

// Output: 1 → 2 → 3 → 4 → 5
```

---

### 🖼️ সব কিছু একসাথে — Complete Picture

```
Source Code
    │
    ▼
┌─────────┐
│ Parsing │ → Tokenization → AST
└────┬────┘
     │
     ▼
┌─────────────┐
│ Compilation │ → Bytecode → (hot path) → Machine Code
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Global Execution │ → Creation Phase (Hoisting)
│    Context       │ → Execution Phase (line by line)
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────┐
│              Runtime                   │
│                                        │
│  Call Stack ←→ Heap Memory             │
│       ↕                                │
│  Event Loop                            │
│  (nextTick → Microtask → Macrotask)    │
└────────────────────────────────────────┘
```

JavaScript-এর execution এই পুরো pipeline-এর মধ্য দিয়ে যায় — Parsing থেকে শুরু করে JIT compilation, Execution Context তৈরি, Call Stack management, Memory allocation, এবং সবশেষে Event Loop দিয়ে async operation handle করা।


---

### 🥞 What is the call stack and how does it work?

Call Stack হলো JavaScript engine-এর একটি **LIFO (Last In, First Out)** data structure যা track করে যে এই মুহূর্তে কোন function চলছে এবং সেটি শেষ হলে কোথায় ফিরে যেতে হবে।

**LIFO মানে:** সবার শেষে যে function stack-এ ঢুকেছে, সে সবার আগে বের হবে — অনেকটা থালার stack-এর মতো।


### 🚶‍♂️ How does JavaScript handle function invocation step-by-step?

একটি concrete উদাহরণ দিয়ে প্রতিটি ধাপ দেখা যাক:

```js
function multiply(a, b) {
  return a * b;
}

function square(n) {
  const result = multiply(n, n);
  return result;
}

function printSquare(n) {
  const sq = square(n);
  console.log(sq);
}

printSquare(5);
```

**ধাপ ১ — Global Execution Context তৈরি:**

Program শুরু হলেই Global Execution Context stack-এ যোগ হয়। সব function declaration memory-তে চলে যায় (hoisting)।

```
┌───────────────────────┐
│  Global Execution     │
│  Context              │
│                       │
│  multiply: fn         │
│  square: fn           │
│  printSquare: fn      │
└───────────────────────┘
```

**ধাপ ২ — `printSquare(5)` call:**
নতুন Execution Context তৈরি হয়ে stack-এ push হয়। নিজস্ব local variable (`n = 5`, `sq = undefined`) তৈরি হয়।

```
┌───────────────────────┐
│  printSquare          │
│  n = 5                │
│  sq = undefined       │  ← TOP: এখন এটি চলছে
├───────────────────────┤
│  Global Execution     │
│  Context              │  ← অপেক্ষায়
└───────────────────────┘
```

**ধাপ ৩ — `square(5)` call:**
`printSquare`-এর ভেতর থেকে `square` call হলো। নতুন frame push হলো।

```
┌───────────────────────┐
│  square               │
│  n = 5                │
│  result = undefined   │  ← TOP: এখন এটি চলছে
├───────────────────────┤
│  printSquare          │
│  n = 5                │
│  sq = undefined       │  ← অপেক্ষায়
├───────────────────────┤
│  Global Execution     │
│  Context              │
└───────────────────────┘
```

**ধাপ ৪ — `multiply(5, 5)` call:**
`square`-এর ভেতর থেকে `multiply` call হলো।

```
┌───────────────────────┐
│  multiply             │
│  a = 5, b = 5         │  ← TOP: এখন এটি চলছে
├───────────────────────┤
│  square               │
│  n = 5                │
│  result = undefined   │  ← অপেক্ষায়
├───────────────────────┤
│  printSquare          │
│  n = 5                │
│  sq = undefined       │  ← অপেক্ষায়
├───────────────────────┤
│  Global Execution     │
│  Context              │
└───────────────────────┘
```

**ধাপ ৫ — `multiply` return করলো (25):**
`return a * b` execute হলো। `multiply`-এর frame pop হলো। Return value `square`-এর `result` variable-এ গেল।

```
┌───────────────────────┐
│  square               │
│  n = 5                │
│  result = 25          │  ← TOP: আবার চলছে, result পেয়েছে
├───────────────────────┤
│  printSquare          │
│  n = 5                │
│  sq = undefined       │  ← অপেক্ষায়
├───────────────────────┤
│  Global Execution     │
│  Context              │
└───────────────────────┘
```

**ধাপ ৬ — `square` return করলো (25):**
`square`-এর frame pop হলো। Return value `printSquare`-এর `sq` variable-এ গেল।

```
┌───────────────────────┐
│  printSquare          │
│  n = 5                │
│  sq = 25              │  ← TOP: আবার চলছে, sq পেয়েছে
├───────────────────────┤
│  Global Execution     │
│  Context              │
└───────────────────────┘
```

**ধাপ ৭ — `console.log(25)` call এবং শেষ:**

```
┌───────────────────────┐     ┌───────────────────────┐
│  console.log          │     │                       │
│  value = 25           │ →   │  Global Execution     │
├───────────────────────┤  →  │  Context              │
│  printSquare          │ pop │                       │
│  ...                  │     │  (program শেষ)        │
├───────────────────────┤     └───────────────────────┘
│  Global Execution     │
└───────────────────────┘
```

---

### 📦 প্রতিটি Execution Context-এ কী থাকে?

```js
function greet(name) {
  const message = 'Hello, ' + name;
  return message;
}

greet('Alice');
```

```
┌──────────────────────────────────────────┐
│         greet() Execution Context        │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      Variable Environment          │  │
│  │  name = 'Alice'                    │  │
│  │  message = 'Hello, Alice'          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         Scope Chain                │  │
│  │  greet scope → Global scope        │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          this binding              │  │
│  │  (non-strict: global object)       │  │
│  │  (strict mode: undefined)          │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 🔁 3. What is the event loop in Node.js?
**Event Loop** হলো Node.js-এর হৃদপিণ্ড। এটি একটি continuously running mechanism যা দেখে — **Call Stack** খালি আছে কিনা, এবং যদি খালি থাকে তাহলে **Callback Queue** থেকে কাজ তুলে এনে execute করে।
এটির কারণেই Node.js single thread হয়েও **asynchronous, non-blocking** কাজ করতে পারে।

### 🔹 Event Loop চালু হওয়ার আগে — মূল Components

```ascii
┌──────────────────────────────────────────────┐
│              Node.js Architecture            │
│                                              │
│   ┌──────────────┐      ┌─────────────────┐  │
│   │  Call Stack  │  ◄───│   Event Loop    │  │
│   │     (V8)     │      │  (6 Phases)     │  │
│   └──────────────┘      └───────┬─────────┘  │
│                                 │             │
│                  ┌──────────────▼─────────────┐ │
│                  │           libuv            │ │
│                  │ Timers │ I/O │ Thread Pool │ │
│                  └────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 🔹 Event Loop-এর ৬টি Phase

Event Loop একটি নির্দিষ্ট cycle-এ ঘোরে। প্রতিটি cycle-কে বলে **"tick"**।
প্রতিটি tick-এ নিচের phases গুলো **ক্রমানুসারে** execute হয়:

```ascii
   ┌───────────────────────┐
   │  1. Timers            │ ← setTimeout, setInterval
   ├───────────────────────┤
   │  2. Pending Callbacks │ ← OS-level I/O errors
   ├───────────────────────┤
   │  3. Idle / Prepare    │ ← Internal only
   ├───────────────────────┤
   │  4. Poll ⭐           │ ← নতুন I/O events (সবচেয়ে গুরুত্বপূর্ণ)
   ├───────────────────────┤
   │  5. Check             │ ← setImmediate
   ├───────────────────────┤
   │  6. Close Callbacks   │ ← socket 'close' events
   └───────────────────────┘
          ↑ (Loop আবার শুরু)
```

> ⚠️ প্রতিটি phase-এর **মাঝে মাঝে** দুটো special queue চেক হয়:
> **`process.nextTick()`** এবং **Promise microtasks** — এগুলো সবার আগে চলে!


**🔵 Phase 1: Timers**:

`setTimeout()` এবং `setInterval()`-এর যেসব callback-এর delay সময় পার হয়ে গেছে, সেগুলো এই phase-এ execute হয়।
> ⚠️ মনে রাখো — timer সবসময় exact time-এ চলে না, বরং "কমপক্ষে এতটুকু সময় পরে" চলে।

```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timer 1 — 0ms');
}, 0);

setTimeout(() => {
    console.log('Timer 2 — 100ms');
}, 100);

console.log('End');
```

**Output:**
```
Start
End
Timer 1 — 0ms
Timer 2 — 100ms
```

---

**🔵 Phase 2: Pending Callbacks**:
আগের **I/O cycle**-এ complete হয়নি এমন কিছু system-level error callback এখানে চলে। যেমন TCP socket error।
> সাধারণ development-এ এই phase সরাসরি দেখা যায় না — এটি OS-level error handle করে。

---

**🔵 Phase 3: Idle / Prepare**:
সম্পূর্ণ **internal use**। Node.js নিজে এখানে কিছু preparation করে। আমরা এই phase-এ directly কিছু করতে পারি না।

---

**🔵 Phase 4: Poll ⭐**:

এটি Event Loop-এর **সবচেয়ে গুরুত্বপূর্ণ phase**। দুটো কাজ করে:
1. নতুন **I/O events** fetch করে এবং সাথে সাথে execute করে
2. যদি কোনো কাজ না থাকে, তাহলে এখানে **wait/block** করে থাকে

```
Poll Phase Logic:
─────────────────
যদি Poll Queue তে callback আছে?
   → সব callback execute করো
যদি Poll Queue খালি?
   → setImmediate() আছে? → Check Phase এ যাও
   → Timer ready আছে?    → Timer Phase এ যাও
   → না হলে?             → নতুন I/O event-এর জন্য wait করো
```

```javascript
const fs = require('fs');

fs.readFile('data.txt', (err, data) => {
    console.log('File পড়া হয়েছে!');
});
```

---

**🔵 Phase 5: Check**:

`setImmediate()`-এর সব callback এখানে execute হয়। Poll phase শেষ হওয়ার **সাথে সাথে** এটি চলে।

```javascript
const fs = require('fs');

fs.readFile('data.txt', () => {
    setTimeout(() => {
        console.log('setTimeout');
    }, 0);

    setImmediate(() => {
        console.log('setImmediate');
    });
});
```

**Output:**
```
setImmediate
setTimeout
```

> I/O callback (Poll phase) থেকে বের হলে event loop সরাসরি Check phase-এ যায়, তাই setImmediate আগে execute হয়

---

**🔵 Phase 6: Close Callbacks**:

যেসব resource হঠাৎ বন্ধ হয়ে যায়, তাদের **`close` event** এখানে fire হয়।

```javascript
const net = require('net');
const server = net.createServer();

server.on('close', () => {
    console.log('Server বন্ধ হয়ে গেছে');
});

server.close();
```

---

### ⚡ Special: Microtask Queue (সব Phase-এর মাঝে)

এই দুটো **সব phase-এর আগে ও মাঝে** চলে — এরা সবার উপরে priority পায়:

**1. `process.nextTick()`**: 
Current operation শেষ হলে **সাথে সাথেই** চলে, Event Loop-এর পরের phase-এ যাওয়ার আগেই।

**2. Promise Microtasks (`.then`, `async/await`)**

`process.nextTick()` শেষ হওয়ার পর, পরের phase-এ যাওয়ার আগে চলে।

```javascript
console.log('1. Synchronous');

setTimeout(() => console.log('2. setTimeout'), 0);
setImmediate(() => console.log('3. setImmediate'));

Promise.resolve().then(() => console.log('4. Promise'));
process.nextTick(() => console.log('5. nextTick'));

console.log('6. Synchronous আবার');
```

**Output:**
```
1. Synchronous
6. Synchronous আবার
5. nextTick
4. Promise
2. setTimeout
3. setImmediate
```

```ascii
┌─────────────────────────────────────────────────┐
│           Execution Priority (উপর = আগে)        │
├─────────────────────────────────────────────────┤
│  1. Synchronous Code (Call Stack)               │
│  2. process.nextTick()                          │
│  3. Promise Microtasks (.then, async/await)     │
│  4. setTimeout / setInterval (Timer phase)      │
│  5. setImmediate (Check phase)                  │
│  6. I/O Callbacks (Poll phase)                  │
│  7. Close Callbacks                             │
└─────────────────────────────────────────────────┘
```

> Event Loop হলো Node.js-এর **traffic controller** — সে নির্ধারণ করে কোন callback কখন চলবে। Microtasks সবার আগে, তারপর phase-by-phase চলে। এই পুরো mechanism-এর কারণেই Node.js single thread হয়েও লক্ষ লক্ষ request handle করতে পারে।
---
## ⚖️ 4. What is the difference between microtasks and macrotasks?
JavaScript-এ সব asynchronous কাজ **একই queue-এ** রাখলে priority manage করা কঠিন হয়ে যেত। তাই দুটো আলাদা queue আছে
* **Microtask Queue** → High priority, ছোট ও জরুরি কাজ
* **Macrotask Queue** → Low priority, বড় ও পরে করার কাজ

| বিষয়           | Microtask Queue                 | Macrotask Queue             |
| -------------- | ------------------------------- | --------------------------- |
| অন্য নাম       | Job Queue                       | Callback Queue / Task Queue |
| Priority       | 🔴 সর্বোচ্চ                     | 🟡 তুলনামূলক কম             |
| কখন execute হয় | প্রতিটি phase ও callback-এর পরে | নির্দিষ্ট phase-এ           |
| Execution      | সম্পূর্ণ খালি না হওয়া পর্যন্ত   | phase অনুযায়ী execute হয়    |

---
### 🤔 Why do microtasks execute before macrotasks?
এটি বোঝার জন্য আগে event loop-এর structure জানতে হবে।
**Event loop-এর structure:**

```
┌─────────────────────────────┐
│       Synchronous Code       │  ← সবার আগে (Call Stack)
└──────────────┬──────────────┘
               │ শেষ হলে
               ▼
┌─────────────────────────────┐
│      process.nextTick Queue  │  ← সর্বোচ্চ priority microtask
└──────────────┬──────────────┘
               │ খালি হলে
               ▼
┌─────────────────────────────┐
│        Microtask Queue       │  ← Promise.then(), queueMicrotask()
└──────────────┬──────────────┘
               │ খালি হলে
               ▼
┌─────────────────────────────┐
│  Macrotask Queue (একটি মাত্র)│  ← setTimeout, setInterval, I/O
└──────────────┬──────────────┘
               │ একটি task শেষে আবার microtask check
               ▼
             (loop)
```
> **কারণটা design-গত:** Microtask-এর উদ্দেশ্য হলো current operation-এর "immediately after" কিছু করা — পরের unrelated task-এর আগে। JavaScript engine গ্যারান্টি দেয় যে প্রতিটি macrotask-এর **পরে** এবং পরের macrotask শুরুর **আগে** microtask queue সম্পূর্ণ খালি করা হবে।

### 🔹 What goes into the microtask queue and macrotask queue?

```ascii
┌─────────────────────────────────────────────────────┐
│                  MICROTASK QUEUE                     │
│                  (High Priority)                     │
│                                                      │
│   • process.nextTick()      ← সবার আগে              │
│   • Promise.resolve().then()                         │
│   • async/await (await এর পরের অংশ)                 │
│   • queueMicrotask()                                 │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│                  MACROTASK QUEUE                     │
│                  (Lower Priority)                    │
│                                                      │
│   • setTimeout()                                     │
│   • setInterval()                                    │
│   • setImmediate()                                   │
│   • I/O callbacks (fs.readFile, HTTP request)        │
│   • UI rendering events (browser-এ)                 │
└─────────────────────────────────────────────────────┘
```

---

### 🏆 কীভাবে Execute হয় — The Golden Rule:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   1. একটি Macrotask execute করো                            │
│              ↓                                             │
│   2. Microtask Queue সম্পূর্ণ খালি করো                    │
│      (process.nextTick আগে, তারপর Promise)                 │
│              ↓                                             │
│   3. পরের Macrotask নাও                                    │
│              ↓                                             │
│   4. আবার Microtask Queue খালি করো                         │
│              ↓                                             │
│          (চলতেই থাকে...)                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> 🔑 **Key Rule:** একটি Macrotask শেষ হলে, পরের Macrotask শুরু হওয়ার **আগেই** সব Microtask শেষ করতে হবে।
> *(Node.js-এ এটি প্রতিটি phase ও callback-এর পরেও apply হয়)*

**Example**

```javascript
console.log('🟢 1. Script start');

setTimeout(() => {
    console.log('⏰ 5. setTimeout 1');

    Promise.resolve().then(() =>
        console.log('🔷 6. Promise inside setTimeout')
    );
}, 0);

setTimeout(() => {
    console.log('⏰ 7. setTimeout 2');
}, 0);

Promise.resolve()
    .then(() => {
        console.log('🔷 3. Promise 1');
        return Promise.resolve();
    })
    .then(() => console.log('🔷 4. Promise 2'));

process.nextTick(() => console.log('⚡ 2. nextTick'));

console.log('🔴 1. Script end');
```

**Output:**
```
🟢 1. Script start
🔴 1. Script end
⚡ 2. nextTick
🔷 3. Promise 1
🔷 4. Promise 2
⏰ 5. setTimeout 1
🔷 6. Promise inside setTimeout
⏰ 7. setTimeout 2
```

> ⚠️ Note: `setTimeout 1` এবং `setTimeout 2` এর order **guaranteed না** (same delay হলে)।
`setTimeout 1` চলার পরে, `setTimeout 2` চলার **আগেই** তার ভেতরের Promise চলে গেছে — কারণ Macrotask-এর মাঝেও Microtask Queue চেক হয়।

---

### 🚦 How do `process.nextTick`, `Promise.resolve`, and `queueMicrotask` interact with the event loop?
তিনটিই microtask, কিন্তু এদের **priority আলাদা**।

**Node.js-এ execution order:**

```
Synchronous Code
      ↓
process.nextTick Queue    ← সর্বোচ্চ priority
      ↓
Promise Microtask Queue   ← Promise.then(), queueMicrotask()
      ↓
Macrotask Queue           ← setTimeout, setInterval, I/O
```


**Starvation সমস্যা — `process.nextTick`-এর বিপদ:**

```js
// ❌ infinite nextTick — event loop চিরকাল আটকে থাকবে
function infiniteNextTick() {
  process.nextTick(infiniteNextTick);
}
infiniteNextTick();
// setTimeout, I/O, Promise — কিছুই আর চলবে না!
```

```js
// ✅ setImmediate ব্যবহার করলে এই সমস্যা নেই
function safeRecursion() {
  setImmediate(safeRecursion); // প্রতি iteration-এ I/O-কে সুযোগ দেয়
}
```

**`Promise.resolve` বনাম `queueMicrotask` — কোনটি কখন:**

```js
// queueMicrotask — শুধু scheduling দরকার হলে
queueMicrotask(() => {
  updateDOM(); // কোনো value return বা chain দরকার নেই
});

// Promise.resolve — value propagation বা chain দরকার হলে
const result = await Promise.resolve(computeValue());
const final = await Promise.resolve(result).then(transform);
```

---

### ⏰ How does `setTimeout(fn, 0)` actually work and why is it not executed immediately?

`setTimeout(fn, 0)` দেখতে "এখনই চালাও" মনে হলেও এটি কখনোই synchronous নয়। এর পেছনে তিনটি কারণ আছে।

**কারণ ১ — Minimum delay:**

HTML specification অনুযায়ী nested `setTimeout`-এর minimum delay **4ms**। এমনকি `0` দিলেও browser সেটি `1ms` (বা বেশি) হিসেবে treat করে।

```js
console.time('actual delay');
setTimeout(() => {
  console.timeEnd('actual delay'); // ~1-4ms, কখনো 0ms নয়
}, 0);
```

**কারণ ২ — Macrotask queue-এ যায়:**

`setTimeout` callback টি call stack-এ সরাসরি যায় না — Web API delay শেষে এটিকে **macrotask queue**-তে রাখে। Event loop তখনই এটি তুলবে যখন call stack সম্পূর্ণ খালি এবং microtask queue খালি।

```js
console.log('A');         // call stack-এ সরাসরি

setTimeout(() => {        // Web API-তে পাঠানো হলো
  console.log('C');       // macrotask queue → তারপর call stack
}, 0);

console.log('B');         // call stack-এ সরাসরি

// Output: A → B → C
// 'C' কখনো A ও B-এর মাঝে আসবে না
```

**কারণ ৩ — System timer resolution:**

Operating system-এর timer interrupt সাধারণত ১৫.৬ms (Windows) বা ১ms (Linux/Mac) interval-এ কাজ করে। তাই `0ms` চাইলেও OS যতক্ষণ না timer check করে ততক্ষণ callback queue-তে যাবে না।

**`setTimeout(fn, 0)`-এর practical use case:**

যদিও এটি immediately চলে না, কিছু valid কারণে ব্যবহার হয়:

```js
// ১. DOM update-এর পরে কাজ করতে (Browser)
element.style.display = 'block';
setTimeout(() => {
  // Browser repaint করার পরে এই code চলবে
  element.classList.add('animate');
}, 0);

// ২. Long synchronous task কে break করে I/O-কে সুযোগ দিতে
function processLargeArray(items) {
  const chunk = items.splice(0, 100);
  processChunk(chunk);

  if (items.length > 0) {
    setTimeout(() => processLargeArray(items), 0); // I/O-কে breathe করতে দেয়
  }
}

// ৩. Stack overflow এড়াতে recursive call-এ
function recursiveTask(n) {
  if (n === 0) return;
  setTimeout(() => recursiveTask(n - 1), 0); // call stack reset হয়
}
```

### 🔹 async/await আসলে কী?

`async/await` হলো **Promise-এর syntactic sugar** — তাই এটি Microtask Queue-এ যায়।

```javascript
async function myFunc() {
    console.log('A. async function শুরু');
    await Promise.resolve();
    console.log('C. await এর পরে');
}

console.log('1. Start');
myFunc();
console.log('B. myFunc() call এর পরে');
```
**Output:**
```
1. Start
A. async function শুরু
B. myFunc() call এর পরে
C. await এর পরে
```
> `await` এর পরের সব code আসলে `.then()` callback-এর মতো — Microtask Queue-এ জমা হয়।

### 📊 Visual Summary

```ascii
┌────────────────────────────────────┐
│         JavaScript Runtime         │
├────────────────────────────────────┤
│  Call Stack                        │
├────────────────────────────────────┤
│  Microtask Queue (High)            │
│   • nextTick • Promise             │
├────────────────────────────────────┤
│  Macrotask Queue (Low)             │
│   • setTimeout • I/O • setImmediate│
└────────────────────────────────────┘
```

---

| বিষয়           | Microtask                            | Macrotask                          |
| --------------- | ------------------------------------ | ---------------------------------- |
| Examples        | `nextTick`, `Promise`, `async/await` | `setTimeout`, `setInterval`, `I/O` |
| Priority        | ⬆️ বেশি                              | ⬇️ কম                              |
| Execution       | Queue সম্পূর্ণ খালি হওয়া পর্যন্ত    | phase অনুযায়ী এক/একাধিক callback  |
| কখন চেক হয়     | প্রতিটি phase ও callback-এর পরে      | Event Loop-এর নির্দিষ্ট phase-এ    |
| Starvation risk | ✅ হ্যাঁ (infinite loop হতে পারে)     | ⚠️ খুব কম (but possible)           |

---

> **Microtask** হলো VIP guest — সে সবার আগে ঢোকে, এবং তার দল শেষ না হওয়া পর্যন্ত কাউকে ঢুকতে দেয় না।
> **Macrotask** হলো সাধারণ queue — তারা phase অনুযায়ী ঢোকে, কিন্তু প্রতিবার ঢোকার আগে VIP list চেক হয়。

