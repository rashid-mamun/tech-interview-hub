---
sidebar_position: 1
title: ''
---

## 1. What is lexical scope in JavaScript?

**Lexical scope** মানে হলো — একটি variable কোথায় **access** করা যাবে, সেটা নির্ধারিত হয় সেই variable টি **code-এ কোথায় লেখা হয়েছে** তার উপর ভিত্তি করে, **runtime**-এ কোথায় call হচ্ছে তার উপর নয়।

সহজ কথায়: **"কোড লেখার সময়ই scope নির্ধারিত হয়ে যায়।"**

JavaScript-এ প্রতিটি **function** বা **block** তার চারপাশের (outer/parent) scope-এর variable গুলো **access** করতে পারে। এটাই **lexical scoping**।

```javascript
function outer() {
  const message = "Hello from outer!"; // outer scope-এ define করা

  function inner() {
    console.log(message); // ✅ inner function, outer-এর variable access করতে পারে
  }

  inner();
}

outer(); // Output: "Hello from outer!"
```

এখানে `inner` function টি `message` variable-টি **নিজের scope**-এ না থাকলেও, **lexical parent** (অর্থাৎ `outer`) থেকে সেটি **access** করতে পারছে।


#### 🔍 Scope Chain

Lexical scope কাজ করে **scope chain** তৈরির মাধ্যমে। কোনো variable খুঁজে না পেলে JavaScript **inner → outer → global** — এই ক্রমে উপরে উঠতে থাকে।


#### ⚠️ Lexical Scope বনাম Dynamic Scope

| বিষয় | **Lexical Scope**  | **Dynamic Scope** |
|---|---|---|
| Scope নির্ধারিত হয় | **লেখার সময়** (compile time) | **call করার সময়** (runtime) |
| ভিত্তি | Code-এর **structure** | **Call stack** |
| উদাহরণ | JavaScript, Python | Bash, বিশেষ কিছু Lisp |

---

#### 🔗 Closure-এর সাথে সম্পর্ক

**Lexical scope**-এর কারণেই **closure** সম্ভব। একটি **function** তার **outer scope**-এর variable মনে রাখে, এমনকি সেই outer function শেষ হয়ে যাওয়ার পরেও।

```javascript
function makeCounter() {
  let count = 0; // এই variable টি closure-এ "ধরা" থাকে

  return function () {
    count++;
    console.log(count);
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
// makeCounter() শেষ হয়ে গেছে, কিন্তু count এখনো accessible!
```

---

> **"Function যেখানে *defined*, সেই জায়গার scope-ই তার lexical scope — যেখানে *called* সেটা নয়।"**

### How is scope determined at compile time?

JavaScript **engine** code **execute** করার আগে দুটি ধাপে কাজ করে:

```
Source Code
    ↓
┌─────────────────────────────────────┐
│  Phase 1: COMPILATION / PARSING     │
│  • Tokenization                     │
│  • AST (Abstract Syntax Tree) তৈরি  │
│  • Scope নির্ধারণ ✅                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Phase 2: EXECUTION                 │
│  • Code line by line চলে            │
│  • Variable-এ value assign হয়       │
└─────────────────────────────────────┘
```

**Compilation phase**-এ engine প্রতিটি **variable** ও **function declaration** খুঁজে বের করে এবং সেগুলো কোন **scope**-এ আছে সেটা নির্দিষ্ট করে রাখে।

```javascript
function outer() {
  var x = 10; // ← compile time-এ engine জানে: x, outer-এর scope-এ

  function inner() {
    var y = 20; // ← compile time-এ engine জানে: y, inner-এর scope-এ
    console.log(x); // ← x কোথায় আছে? outer-এ — compile time-এই জানা
  }
}
```

#### `var` vs `let`/`const` — Hoisting-এর পার্থক্য

| | `var` | `let` / `const` |
|---|---|---|
| **Hoisting** | হয় — `undefined` দিয়ে | হয় — কিন্তু **TDZ**-এ থাকে |
| **Scope** | **Function scope** | **Block scope** |
| **Compile time-এ** | Declaration register হয় | Declaration register হয় |

```javascript
console.log(a); // undefined (hoisted)
var a = 5;

console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;     // TDZ (Temporal Dead Zone)-এ থাকে
```

---

### What is the scope chain?

**Scope chain** হলো একটি সংযুক্ত **chain** যা দিয়ে JavaScript **variable** খোঁজে — প্রথমে **current scope**, না পেলে **outer scope**, তারপর আরও উপরে — যতক্ষণ না **global scope** পর্যন্ত পৌঁছায়।

```
┌──────────────────────────────┐
│       Global Scope           │  ← সবচেয়ে উপরে
│   globalVar = "I'm global"   │
└──────────────┬───────────────┘
               │ (outer reference)
┌──────────────▼───────────────┐
│       outer() Scope          │
│   outerVar = "I'm outer"     │
└──────────────┬───────────────┘
               │ (outer reference)
┌──────────────▼───────────────┐
│       inner() Scope          │  ← সবচেয়ে নিচে (current)
│   innerVar = "I'm inner"     │
└──────────────────────────────┘
```

```javascript
const globalVar = "Global";

function outer() {
  const outerVar = "Outer";

  function inner() {
    const innerVar = "Inner";

    // Scope chain বরাবর উপরে খোঁজে
    console.log(innerVar);  // ✅ নিজের scope-এ পেয়েছে
    console.log(outerVar);  // ✅ outer-এ পেয়েছে
    console.log(globalVar); // ✅ global-এ পেয়েছে
    console.log(unknown);   // ❌ ReferenceError — কোথাও নেই
  }

  inner();
}

outer();
```

#### Variable Resolution-এর ক্রম:

```
inner scope → outer scope → global scope → ReferenceError ❌
```

**গুরুত্বপূর্ণ:** Scope chain **শুধু উপরে** যায়, কখনো **নিচে** যায় না।


---

### How does nested scope work?

**Nested scope** মানে হলো একটি **scope**-এর ভেতরে আরেকটি **scope** থাকা। প্রতিটি **function** বা `{}` **block** নিজের আলাদা **scope** তৈরি করে।

```javascript
// Level 0: Global Scope
const app = "MyApp";

function level1() {
  // Level 1: Function Scope
  const user = "Karim";

  function level2() {
    // Level 2: Nested Function Scope
    const role = "admin";

    if (true) {
      // Level 3: Block Scope (let/const এর জন্য)
      const temp = "temporary";

      // ✅ সব উপরের level access করা যাবে
      console.log(app);   // "MyApp"
      console.log(user);  // "Karim"
      console.log(role);  // "admin"
      console.log(temp);  // "temporary"
    }

    // console.log(temp); // ❌ Block এর বাইরে temp নেই
  }

  level2();
  // console.log(role); // ❌ level2-এর scope দেখা যাচ্ছে না
}

level1();
```

#### Shadowing — একই নামের Variable

**Inner scope**-এ যদি **outer scope**-এর মতো একই নামের variable থাকে, তাহলে inner টি outer টিকে **shadow** করে:

```javascript
const color = "red"; // outer

function paintWall() {
  const color = "blue"; // inner — outer "red" কে shadow করছে

  console.log(color); // "blue" — inner-টাই দেখা যাচ্ছে
}

paintWall();
console.log(color); // "red" — global এখনো অপরিবর্তিত
```
## 2. What is a closure and how does it work?

**Closure** হলো এমন একটি **function** যেটি তার **outer (lexical) scope**-এর **variables**গুলো মনে রাখে — এমনকি সেই outer function-এর **execution** শেষ হয়ে যাওয়ার পরেও।

সহজ কথায়: **"Function + তার জন্মস্থানের Scope = Closure"**

```javascript
function outer() {
  const message = "আমি outer-এর variable!";

  function inner() {
    // inner function, outer-এর variable "মনে রেখেছে"
    console.log(message);
  }

  return inner; // function টা return করা হচ্ছে
}

const remembers = outer(); // outer() এখানে শেষ হয়ে যায়
remembers(); // কিন্তু তবুও Output: "আমি outer-এর variable!"
```

> `outer()` শেষ হয়ে গেলেও `message` variable টি **garbage collect** হয়নি — কারণ `inner` function টির একটি **closure** আছে সেই variable-এর উপর।

---

### How does a function “remember” variables from its outer scope?

এটি সম্ভব হয় কারণ JavaScript **engine** প্রতিটি **function** তৈরির সময় সেই function-এর সাথে একটি **`[[Environment]]`** (internal hidden property) যুক্ত করে দেয়। এই **`[[Environment]]`**-এ সেই function-এর **lexical scope**-এর **reference** সংরক্ষিত থাকে।

```
Function Object তৈরি হওয়ার সময়:
┌────────────────────────────────────┐
│         inner (Function Object)    │
│                                    │
│  code: "console.log(message)"      │
│  [[Environment]] ──────────────────┼───► outer-এর Variable Environment
└────────────────────────────────────┘          │
                                                 ▼
                                    ┌────────────────────────┐
                                    │  { message: "Hello!" } │
                                    └────────────────────────┘
```

```javascript
function createGreeter(name) {
  // name → [[Environment]]-এ store হয়

  return function greet() {
    // greet-এর [[Environment]] → createGreeter-এর scope-এর reference ধরে রাখে
    console.log(`Hello, ${name}!`);
  };
}

const greetKarim = createGreeter("Karim");
const greetRahim = createGreeter("Rahim");

// প্রতিটি closure-এর নিজস্ব আলাদা [[Environment]] আছে
greetKarim(); // Hello, Karim!
greetRahim(); // Hello, Rahim!
```

প্রতিটি `createGreeter()` call-এ আলাদা **closure** তৈরি হয় — আলাদা `name`-সহ।

---

### What happens to variables after the outer function returns?

সাধারণত কোনো **function** তার execution শেষ করলে তার **local variables** গুলো **Call Stack** থেকে সরিয়ে **Garbage Collected** হয়। কিন্তু **closure**-এর ক্ষেত্রে এই নিয়মের ব্যতিক্রম ঘটে।

```
সাধারণ ক্ষেত্রে (closure ছাড়া):
──────────────────────────────────────────────
outer() call হলো
    ↓
local variable তৈরি হলো (Stack-এ)
    ↓
outer() return করলো
    ↓
local variable → ❌ Garbage Collected (মুছে যায়)


Closure-এর ক্ষেত্রে:
──────────────────────────────────────────────
outer() call হলো
    ↓
local variable তৈরি হলো (Heap-এ move হয়)
    ↓
inner function টি [[Environment]]-এ variable-এর reference রাখলো
    ↓
outer() return করলো
    ↓
local variable → ✅ Heap-এ বেঁচে থাকে (reference আছে বলে)
    ↓
inner function যতদিন alive, variable ততদিন alive
```

```javascript
function makeCounter() {
  let count = 0; // outer function return করার পরেও বেঁচে থাকবে

  return {
    increment() { count++; console.log(count); },
    decrement() { count--; console.log(count); },
    reset()     { count = 0; console.log("Reset!"); }
  };
}

const counter = makeCounter(); // makeCounter() এখানে শেষ

counter.increment(); // 1  ← count এখনো জীবিত!
counter.increment(); // 2
counter.increment(); // 3
counter.decrement(); // 2
counter.reset();     // Reset!
counter.increment(); // 1
```

---

### How are closures stored in memory?

JavaScript **engine** দুটি জায়গায় data রাখে:

| | **Call Stack** | **Heap Memory** |
|---|---|---|
| রাখে | Function execution context, primitive values | Objects, closures, functions |
| কখন মুছে যায় | Function return করলেই | কোনো reference না থাকলে (GC) |
| আকার | ছোট, সীমিত | বড়, dynamic |

#### Closure-এর Memory Model:

```
CALL STACK                    HEAP MEMORY
──────────────────            ─────────────────────────────────────
│ Global Context │            │                                   │
│                │            │   ┌─────────────────────────┐    │
│  counter ──────┼────────────┼──►│   counter (Object)      │    │
│                │            │   │   increment: fn ─────┐  │    │
└────────────────┘            │   │   decrement: fn ──┐   │  │    │
                              │   │   reset:     fn ─┐│   │  │    │
                              │   └─────────────────┼┼───┘  │    │
                              │                     │││      │    │
                              │   ┌─────────────────▼▼▼──────┐   │
                              │   │  Closure Environment      │   │
                              │   │  { count: 1 }  ← shared! │   │
                              │   └───────────────────────────┘   │
                              └───────────────────────────────────┘
```

তিনটি **method** (increment, decrement, reset) একই **closure environment** share করে — তাই `count` সবার কাছে একই।

#### Garbage Collection ও Closure:

```javascript
function heavyClosure() {
  const bigData = new Array(1000000).fill("data"); // বড় data

  return function () {
    console.log(bigData.length); // bigData-এর reference ধরে রেখেছে
  };
}

let fn = heavyClosure();
fn(); // 1000000 → bigData এখনো memory-তে আছে

fn = null; // ← reference সরিয়ে দিলাম
// এখন bigData → ❌ Garbage Collected হবে (কোনো reference নেই)
```

> ⚠️ **Memory Leak সতর্কতা:** Closure অপ্রয়োজনীয়ভাবে বড় data ধরে রাখলে **memory leak** হতে পারে। Reference সরিয়ে দিলে **Garbage Collector** সেই memory মুক্ত করে।

## ৩. What are real-world use cases of closures?

### How are closures used in data privacy (encapsulation)?

**Encapsulation** মানে হলো — data লুকিয়ে রাখা এবং শুধুমাত্র নির্দিষ্ট **interface**-এর মাধ্যমে সেটি access করতে দেওয়া। Closure দিয়ে JavaScript-এ **private variable** তৈরি করা যায় — যা বাইরে থেকে directly access বা modify করা সম্ভব না।

```javascript
// ❌ Closure ছাড়া — সব কিছু exposed, যে কেউ balance বদলাতে পারে
const account = {
  balance: 1000,
  owner: "Karim"
};
account.balance = 999999; // ⚠️ যে কেউ হাত দিতে পারছে!

// ✅ Closure দিয়ে — balance সম্পূর্ণ private
function createBankAccount(initialBalance, owner) {
  let balance = initialBalance; // 🔒 private — বাইরে visible না
  let transactionHistory = [];  // 🔒 private

  return {
    deposit(amount) {
      if (amount <= 0) return console.log("Invalid amount!");
      balance += amount;
      transactionHistory.push(`+${amount}`);
      console.log(`Deposited ${amount}. Balance: ${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) return console.log("Insufficient funds!");
      balance -= amount;
      transactionHistory.push(`-${amount}`);
      console.log(`Withdrawn ${amount}. Balance: ${balance}`);
    },
    getBalance() {
      return balance; // শুধু read করতে পারবে, directly set করতে পারবে না
    },
    getHistory() {
      return [...transactionHistory]; // copy দেওয়া হচ্ছে, original নয়
    },
    getOwner() {
      return owner;
    }
  };
}

const myAccount = createBankAccount(1000, "Karim");

myAccount.deposit(500);       // Deposited 500. Balance: 1500
myAccount.withdraw(200);      // Withdrawn 200. Balance: 1300
console.log(myAccount.getBalance()); // 1300

// বাইরে থেকে balance access করার চেষ্টা:
console.log(myAccount.balance);      // undefined ← protected!
myAccount.balance = 999999;          // কোনো effect নেই!
console.log(myAccount.getBalance()); // এখনো 1300 ✅
```

### How are they used in function factories?

**Function factory** হলো এমন একটি **function** যেটি অন্য **function** তৈরি করে — এবং প্রতিটি তৈরি হওয়া function তার নিজস্ব **closure**-এ কিছু pre-configured state নিয়ে থাকে।

```javascript
// ✅ Function Factory: Multiplier তৈরি করে
function createMultiplier(factor) {
  // factor টি closure-এ ধরা থাকে
  return (number) => number * factor;
}

const double   = createMultiplier(2);
const triple   = createMultiplier(3);
const tenTimes = createMultiplier(10);

console.log(double(5));    // 10
console.log(triple(5));    // 15
console.log(tenTimes(5));  // 50

// প্রতিটি function-এর নিজস্ব আলাদা closure আছে
console.log(double(7));    // 14
console.log(triple(7));    // 21
```

#### Real-World উদাহরণ — API Request Factory:

```javascript
function createApiClient(baseURL, authToken) {
  // baseURL ও authToken closure-এ থাকে — বারবার দেওয়া লাগবে না
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`
  };

  async function request(method, endpoint, body = null) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : null
    });
    return response.json();
  }

  // Pre-configured HTTP methods return করছে
  return {
    get:    (endpoint)       => request("GET",    endpoint),
    post:   (endpoint, data) => request("POST",   endpoint, data),
    put:    (endpoint, data) => request("PUT",    endpoint, data),
    delete: (endpoint)       => request("DELETE", endpoint)
  };
}

// প্রতিটি client-এর আলাদা closure — আলাদা baseURL ও token
const productionApi = createApiClient("https://api.myapp.com", "prod-token-xyz");
const stagingApi    = createApiClient("https://staging.myapp.com", "staging-token-abc");

// ব্যবহার করতে token বা URL আর দিতে হচ্ছে না!
productionApi.get("/users");
productionApi.post("/users", { name: "Karim" });
stagingApi.get("/products");
```

### How are closures used in event handlers?

**Event handler**-এ closure ব্যবহার করা হয় যখন handler function-টার কাছে event তৈরির সময়কার কিছু **context (data)** রাখা দরকার হয়।

```javascript
// ❌ Closure ছাড়া — কোন button click হলো বোঝা যাচ্ছে না
function handleClick() {
  console.log("A button was clicked"); // কোনটা?
}

// ✅ Closure দিয়ে — প্রতিটি handler নিজের data মনে রাখছে
function createButtonHandler(buttonId, label) {
  let clickCount = 0; // প্রতিটি button-এর নিজস্ব আলাদা counter

  return function handleClick(event) {
    clickCount++;
    console.log(`Button "${label}" (id: ${buttonId}) — clicked ${clickCount} times`);
    console.log("Event target:", event.target);
  };
}

const buttons = [
  { id: "btn-1", label: "Submit" },
  { id: "btn-2", label: "Cancel" },
  { id: "btn-3", label: "Delete" }
];

// প্রতিটি button-এর জন্য আলাদা handler তৈরি হচ্ছে, আলাদা closure-এ
buttons.forEach(({ id, label }) => {
  const button = document.getElementById(id);
  button.addEventListener("click", createButtonHandler(id, label));
});

// Submit click করলে: Button "Submit" (id: btn-1) — clicked 1 times
// Submit আবার click: Button "Submit" (id: btn-1) — clicked 2 times
// Cancel click করলে: Button "Cancel" (id: btn-2) — clicked 1 times ← আলাদা counter!
```
#### Debounce Function — Closure-এর Practical Power:

```javascript
// Search input-এ প্রতিটি keystroke-এ API call না করে
// user টাইপ থামার পর একটিই call করো
function debounce(fn, delay) {
  let timeoutId; // closure-এ থাকে — প্রতিটি call-এ shared

  return function (...args) {
    clearTimeout(timeoutId);           // আগের timer বাতিল
    timeoutId = setTimeout(() => {     // নতুন timer শুরু
      fn.apply(this, args);
    }, delay);
  };
}

async function searchProducts(query) {
  console.log(`API call: searching for "${query}"`);
  // const results = await fetch(`/api/search?q=${query}`);
}

// 500ms এর মধ্যে আবার টাইপ করলে আগের API call বাতিল হবে
const debouncedSearch = debounce(searchProducts, 500);

// User দ্রুত টাইপ করলে:
debouncedSearch("n");        // timer শুরু → বাতিল
debouncedSearch("no");       // timer শুরু → বাতিল
debouncedSearch("nod");      // timer শুরু → বাতিল
debouncedSearch("node");     // timer শুরু → 500ms পরে চলে
// API call: searching for "node" ← শুধু একটিই!
```

## ৪. Closures in Loops — Common Pitfalls


###  `var` কেন Loop-এ Async Code-এ ভুল করে?

সমস্যাটা বোঝার জন্য আগে `var`-এর **function scope** সম্পর্কে জানতে হবে।

```javascript
// var — function scope (block এর ভেতরেও থাকে না!)
for (var i = 0; i < 3; i++) {
  // এই i টি loop-এর ভেতরে নয়, বাইরের function scope-এ থাকে
}
console.log(i); // 3 ← loop শেষেও accessible!
```

**😱 বিখ্যাত Bug:**

```javascript
// ❌ var দিয়ে loop + setTimeout
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // কী দেখাবে বলে মনে হয়?
  }, 1000);
}

// আশা: 0, 1, 2
// বাস্তব: 3, 3, 3 😱
```

**কেন `3, 3, 3` আসছে?**

কারণটা হলো **closure + var-এর function scope** এর সমন্বয়:

```
Loop চলার সময় কী হচ্ছে:
─────────────────────────────────────────────────────
i = 0 → setTimeout register হলো (1000ms পরে চলবে)
i = 1 → setTimeout register হলো (1000ms পরে চলবে)
i = 2 → setTimeout register হলো (1000ms পরে চলবে)
i = 3 → loop শেষ (i++ → i = 3, condition false)
─────────────────────────────────────────────────────
  ...1000ms পার হলো...
─────────────────────────────────────────────────────
Callback 1 চলে → console.log(i) → i এখন 3 → "3"
Callback 2 চলে → console.log(i) → i এখন 3 → "3"
Callback 3 চলে → console.log(i) → i এখন 3 → "3"
```

তিনটি **callback** তিনটি আলাদা `i` দেখছে না — সব কটি **একই `i` variable**-এর **reference** ধরে আছে। এবং যখন callback চলে, ততক্ষণে `i` এর মান `3` হয়ে গেছে।

```
Memory-তে var দিয়ে:
┌─────────────────────────────────────────┐
│           Function/Global Scope         │
│                                         │
│  i = 0 → 1 → 2 → 3  (একটিই variable)  │
│      ▲      ▲      ▲                    │
│      │      │      │                    │
│  cb1 ─┘  cb2 ─┘  cb3 ─┘               │
│  (তিনটি callback একই i-কে point করে)   │
└─────────────────────────────────────────┘
```

### `let` কীভাবে সমস্যা সমাধান করে?

`let` হলো **block-scoped** — প্রতিটি loop iteration-এ একটি নতুন, আলাদা `i` তৈরি হয়। ফলে প্রতিটি **callback** তার নিজস্ব `i`-এর **closure** পায়।

```javascript
// ✅ let দিয়ে — সঠিক output
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2 ✅
  }, 1000);
}

// Output (1 second পরে): 0
//                         1
//                         2
```

#### Memory-তে `let` কীভাবে কাজ করে:

```
let দিয়ে — প্রতিটি iteration-এ নতুন binding:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Iteration 0  │  │ Iteration 1  │  │ Iteration 2  │
│  i = 0       │  │  i = 1       │  │  i = 2       │
│    ▲         │  │    ▲         │  │    ▲         │
│    │         │  │    │         │  │    │         │
│   cb1        │  │   cb2        │  │   cb3        │
└──────────────┘  └──────────────┘  └──────────────┘
  (আলাদা scope)    (আলাদা scope)    (আলাদা scope)
```

প্রতিটি callback তার নিজের iteration-এর `i` মনে রাখছে। এটাই **closure + block scope** এর শক্তি।

### How can you manually fix it using IIFE?

**IIFE (Immediately Invoked Function Expression)** হলো এমন একটি **function** যেটি define করার সাথে সাথেই **execute** হয়। `let` আসার আগে, `var`-এর যুগে এটি দিয়ে loop-এ closure fix করা হতো।

#### মূল কৌশল:

`i`-এর current value টি IIFE-তে **parameter** হিসেবে পাঠালে সেটি নতুন **function scope**-এ **capture** হয়ে যায় — loop variable-এর সাথে আর কোনো link থাকে না।

```javascript
// ❌ var দিয়ে সমস্যা
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000); // 3, 3, 3
}

// ✅ IIFE দিয়ে Fix — i-এর value capture করা হচ্ছে
for (var i = 0; i < 3; i++) {
  (function (capturedI) {
    // capturedI টি এই function-এর নিজস্ব parameter
    // বাইরের i পরিবর্তন হলেও capturedI পরিবর্তন হবে না
    setTimeout(function () {
      console.log(capturedI); // 0, 1, 2 ✅
    }, 1000);
  })(i); // ← i-এর current value এখনই পাঠানো হচ্ছে
}
```

#### IIFE কীভাবে কাজ করে — Step by Step:

```
i = 0:  IIFE(0) চলে → capturedI = 0 → setTimeout register (capturedI = 0 মনে আছে)
i = 1:  IIFE(1) চলে → capturedI = 1 → setTimeout register (capturedI = 1 মনে আছে)
i = 2:  IIFE(2) চলে → capturedI = 2 → setTimeout register (capturedI = 2 মনে আছে)
i = 3:  loop শেষ
...1000ms পরে...
Callback 0 → capturedI = 0 → "0"
Callback 1 → capturedI = 1 → "1"
Callback 2 → capturedI = 2 → "2"
```

```
Memory-তে IIFE দিয়ে:
┌────────────────────┐
│ var i (shared)     │  i → 0 → 1 → 2 → 3
└────────────────────┘
        │ value copy হচ্ছে (reference নয়)
        ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  IIFE(0)     │  │  IIFE(1)     │  │  IIFE(2)     │
│ capturedI=0  │  │ capturedI=1  │  │ capturedI=2  │
│    ▲         │  │    ▲         │  │    ▲         │
│   cb1        │  │   cb2        │  │   cb3        │
└──────────────┘  └──────────────┘  └──────────────┘
  (নিজস্ব scope)   (নিজস্ব scope)   (নিজস্ব scope)
```
## 5. How can closures cause memory leaks?

**Memory leak** হলো এমন পরিস্থিতি যেখানে **Garbage Collector** memory মুক্ত করতে পারে না — কারণ সেই memory-র দিকে এখনও একটি **reference** আছে, যদিও সেটির আর কোনো প্রয়োজন নেই।

Closure স্বাভাবিকভাবেই outer scope-এর variable-এর **reference** ধরে রাখে। যদি সেই **reference** অপ্রয়োজনীয়ভাবে দীর্ঘস্থায়ী হয়, তখনই **memory leak** হয়।

```
সাধারণ GC (Garbage Collection):
──────────────────────────────────────
function run() {
  const bigData = new Array(1000000); ← Heap-এ
}
run(); ← function শেষ, কোনো reference নেই
       → ✅ GC করে memory মুক্ত করে

Closure-এ Memory Leak:
──────────────────────────────────────
function run() {
  const bigData = new Array(1000000); ← Heap-এ
  return () => console.log(bigData);  ← reference ধরে আছে
}
const fn = run(); ← bigData এখনো reference-এ আছে
                  → ❌ GC করতে পারছে না!
```

---

### What happens when closures hold references to unused variables?

সবচেয়ে বিপজ্জনক leak হয় যখন closure একটি **বিশাল object/array** ধরে রাখে — কিন্তু আসলে সেটির শুধু একটি ছোট অংশই দরকার।

```javascript
// ❌ Accidental Leak — পুরো bigData ধরে রাখছে, দরকার শুধু length
function processData() {
  const bigData = new Array(1_000_000).fill({ value: "important" });

  // bigData-এর শুধু length দরকার, কিন্তু পুরো array closure-এ আটকে গেছে!
  const getLength = () => bigData.length;

  return getLength;
}

const fn = processData();
fn(); // 1000000 ← কাজ করছে, কিন্তু 1 million object এখনো memory-তে!
```