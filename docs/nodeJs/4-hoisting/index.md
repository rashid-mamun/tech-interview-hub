---
sidebar_position: 1
title: ''
---

## 1. What is hoisting in JavaScript?

**Hoisting** হলো JavaScript engine-এর একটি behavior যেখানে variable এবং function declaration গুলো **code execute হওয়ার আগে** তাদের containing scope-এর শীর্ষে তুলে নেওয়া হয়। এটি physically code move করে না — engine **compilation phase-এ** এই declaration গুলো আগে process করে।

```js
// আপনি যা লেখেন:
console.log(greet()); // 'Hello!' — কাজ করে, যদিও নিচে define
console.log(name);    // undefined — error নয়, কিন্তু value নেই

function greet() { return 'Hello!'; }
var name = 'Ali';
```
```js
// Engine যেভাবে দেখে (conceptually):
function greet() { return 'Hello!'; }  // ← উপরে উঠে আসে
var name;                               // ← declaration উঠে আসে
console.log(greet()); // 'Hello!'
console.log(name);    // undefined
name = 'Ali';         // assignment নিচেই থাকে
```

---

### What gets hoisted (functions vs variables)?

**Function Declaration — সম্পূর্ণ hoisted (declaration + body):**

```js
// ✅ Function declaration — call করার আগেই ব্যবহার করা যায়
sayHi(); // 'Hi!' — কাজ করে

function sayHi() {
  console.log('Hi!');
}
```

**`var` — শুধু declaration hoisted, assignment নয়:**

```js
console.log(score); // undefined — error নয়!
var score = 100;
console.log(score); // 100

// Engine দেখে এভাবে:
// var score;           ← hoisted উপরে উঠে আসে
// console.log(score);  → undefined
// score = 100;         ← assignment নিচেই থাকে
// console.log(score);  → 100
```

**`let` এবং `const` — hoisted কিন্তু initialized নয় (TDZ):**

```js
console.log(city); // ❌ ReferenceError: Cannot access 'city' before initialization
let city = 'Dhaka';
```

**Function Expression এবং Arrow Function — variable-এর মতো hoisted:**

```js
// ❌ var দিয়ে — undefined, call করলে TypeError
greetUser(); // TypeError: greetUser is not a function
var greetUser = function() { console.log('Hello'); };

// ❌ let/const দিয়ে — TDZ error
greetUser(); // ReferenceError
const greetUser = () => console.log('Hello');
```

**Hoisting summary:**

| Declaration | Hoisted? | Initial value | Call before declaration |
|---|---|---|---|
| `function` declaration | ✅ সম্পূর্ণ | function body | ✅ কাজ করে |
| `var` | ✅ declaration | `undefined` | ⚠️ `undefined` পাবে |
| `let` | ✅ declaration | ❌ (TDZ) | ❌ ReferenceError |
| `const` | ✅ declaration | ❌ (TDZ) | ❌ ReferenceError |
| function expression (`var`) | ✅ declaration | `undefined` | ❌ TypeError |

---

### How does hoisting work internally?

JavaScript code চলে **দুটো phase-এ:**

```
Phase 1 — Creation (Compilation):
  → Scope তৈরি হয়
  → সব var declaration খুঁজে বের করে → undefined দিয়ে initialize
  → সব function declaration খুঁজে বের করে → সম্পূর্ণ function store
  → let/const declaration খুঁজে বের করে → TDZ-তে রাখে (uninitialized)

Phase 2 — Execution:
  → Code line by line চলে
  → Assignment গুলো এখন হয়
  → let/const-এর declaration line-এ এসে initialize হয়
```

```js
// Creation phase শেষে memory-তে:
// greet   → function() { return 'Hello' }  (সম্পূর্ণ)
// score   → undefined
// city    → <uninitialized> (TDZ)

// Execution phase:
console.log(greet());  // 'Hello' ✅
console.log(score);    // undefined ✅
// console.log(city);  // ❌ TDZ — এখনো initialize হয়নি

function greet() { return 'Hello'; }
var score = 90;   // এখন score → 90
let city = 'Dhaka'; // এখন city → 'Dhaka' (TDZ শেষ)
```

---

### Why does JavaScript hoist declarations?

Hoisting-এর **ঐতিহাসিক কারণ** হলো JavaScript-এর original design — যেখানে function declaration যেকোনো জায়গায় define করে সব জায়গা থেকে call করা যাবে এই flexibility রাখা। Mutual recursion (দুটো function একে অপরকে call করা) সহজ করতেও এটি দরকার ছিল।

```js
// Hoisting-এর কারণে mutual recursion সম্ভব:
function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);  // isOdd এখনো define হয়নি — তবুও কাজ করে!
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}

console.log(isEven(4)); // true
```

> **💡 মনে রাখুন:** Hoisting JavaScript-এর feature, কিন্তু এর উপর নির্ভর করে code লেখা **bad practice**। সবসময় function ও variable declare করার পরে ব্যবহার করুন।

---

## 2. What is the difference between `var`, `let`, and `const`?

`var`, `let`, `const` — তিনটিই variable declare করে, কিন্তু **scope**, **hoisting**, এবং **reassignment-এ** গুরুত্বপূর্ণ পার্থক্য আছে।

---

### Scope differences

**`var` — Function scope (বা Global scope):**

```js
function checkVar() {
  if (true) {
    var x = 10; // if block-এ declare, কিন্তু function-এ accessible
  }
  console.log(x); // 10 ✅ — var function-scoped
}
checkVar();

// ⚠️ Block দিয়ে আটকানো যায় না:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 — সব loop শেষে একই var i
```

**`let` — Block scope:**

```js
function checkLet() {
  if (true) {
    let y = 20; // শুধু এই if block-এ accessible
  }
  // console.log(y); // ❌ ReferenceError — block-এর বাইরে নেই
}

// ✅ Block scope-এ loop ঠিকঠাক কাজ করে:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 — প্রতিটি iteration-এ আলাদা i
```

**`const` — Block scope (let-এর মতো):**

```js
{
  const PI = 3.14159;
  console.log(PI); // 3.14159
}
// console.log(PI); // ❌ ReferenceError
```

**Scope তুলনা:**

| | `var` | `let` | `const` |
|---|---|---|---|
| Global scope | ✅ (browser-এ global property হয়) | ✅ (global property হয় না) | ✅ (global property হয় না) |
| Function scope | ✅ | ✅ | ✅ |
| Block scope | ❌ | ✅ | ✅ |

---

### Hoisting differences

```js
// var — hoisted + undefined দিয়ে initialize
console.log(a); // undefined (error নয়!)
var a = 5;
console.log(a); // 5

// let — hoisted কিন্তু TDZ-এ (uninitialized)
// console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;
console.log(b); // 10

// const — let-এর মতোই TDZ
// console.log(c); // ❌ ReferenceError
const c = 15;
console.log(c); // 15
```

```js
// var — global object-এর property হয় (browser)
var globalVar = 'I am global';
console.log(window.globalVar); // 'I am global' (browser-এ)

// let/const — global object-এর property হয় না
let globalLet = 'Not on window';
const globalConst = 'Also not on window';
console.log(window.globalLet); // undefined
console.log(window.globalConst); // undefined
```

---

### Reassignment rules

**`var` — যতবার খুশি reassign এবং re-declare করা যায়:**

```js
var count = 1;
var count = 2;    // ✅ re-declaration — error নেই (কিন্তু bad practice!)
count = 3;        // ✅ reassignment
console.log(count); // 3
```

**`let` — reassign করা যায়, কিন্তু re-declare করা যায় না:**

```js
let score = 10;
// let score = 20; // ❌ SyntaxError: Identifier 'score' has already been declared
score = 20;        // ✅ reassignment — কাজ করে
console.log(score); // 20
```

**`const` — না reassign, না re-declare:**

```js
const MAX = 100;
// MAX = 200;    // ❌ TypeError: Assignment to constant variable
// const MAX = 200; // ❌ SyntaxError

// ⚠️ কিন্তু const object/array-এর ভেতর পরিবর্তন করা যায়:
const user = { name: 'Ali' };
user.name = 'Rahim'; // ✅ — object-এর property পরিবর্তন হচ্ছে, reference নয়
console.log(user.name); // 'Rahim'

// user = {}; // ❌ — নতুন object assign করা যাবে না

const arr = [1, 2, 3];
arr.push(4);     // ✅ — array modify করা যায়
console.log(arr); // [1, 2, 3, 4]
// arr = [];     // ❌ — নতুন array assign করা যাবে না
```

**সম্পূর্ণ তুলনা:**

| | `var` | `let` | `const` |
|---|---|---|---|
| Re-declare | ✅ হয় | ❌ | ❌ |
| Reassign | ✅ হয় | ✅ হয় | ❌ |
| Hoisting | `undefined` | TDZ | TDZ |
| Scope | Function | Block | Block |
| Global property (browser) | ✅ | ❌ | ❌ |

> **💡 সুপারিশ:** Default হিসেবে `const` ব্যবহার করুন। পরিবর্তনযোগ্য value-এর জন্য `let`। `var` এড়িয়ে চলুন।

---

## 3. What is the Temporal Dead Zone (TDZ)?

**Temporal Dead Zone (TDZ)** হলো `let` এবং `const` variable-এর **hoisting হওয়া থেকে শুরু করে declaration line execute হওয়া পর্যন্ত** সময়কাল যেখানে ঐ variable access করলে `ReferenceError` হয়।

```js
// TDZ — এই জায়গায় city exist করে কিন্তু access করা যাচ্ছে না:
// ↓ (TDZ শুরু — city hoisted কিন্তু initialized নয়)
console.log(city); // ❌ ReferenceError: Cannot access 'city' before initialization
// ↑ (TDZ-এ আছে)
let city = 'Dhaka'; // ← এই line-এ TDZ শেষ, city initialized হয়
// ↓ (TDZ শেষ — এখন access করা যাবে)
console.log(city); // 'Dhaka' ✅
```

---

### Why does accessing `let`/`const` before declaration throw error?

JavaScript design করা হয়েছে যাতে **uninitialized variable access করা সহজে ধরা পড়ে**। `var`-এর `undefined` behavior অনেক bug তৈরি করতো — `let`/`const`-এ TDZ দিয়ে সেটি ঠিক করা হয়েছে।

```js
// var-এর সমস্যা — silent bug:
console.log(price); // undefined — কোনো error নেই, কিন্তু wrong value!
var price = 500;
// Developer মনে করতে পারে price ঠিক আছে কিন্তু সে undefined পাচ্ছে

// let/const-এর সমাধান — loud error:
console.log(amount); // ❌ ReferenceError — সরাসরি জানা যাচ্ছে bug কোথায়
let amount = 500;
```

```js
// TDZ — function-এর ভেতরেও প্রযোজ্য:
let x = 'global';

function test() {
  // TDZ শুরু (local x hoisted কিন্তু initialized নয়)
  console.log(x); // ❌ ReferenceError — TDZ-এ local x
  // global x access হবে না কারণ local x ইতিমধ্যে hoisted
  let x = 'local';
  // TDZ শেষ
  console.log(x); // 'local'
}
test();
```

> **⚠️ লক্ষ্য করুন:** `typeof` operator সাধারণত undeclared variable-এ `undefined` দেয় — কিন্তু TDZ-এ থাকা `let`/`const`-এ `ReferenceError` দেয়।

```js
// Undeclared variable — typeof নিরাপদ
console.log(typeof undeclaredVar); // "undefined" — error নেই

// TDZ — typeof unsafe
console.log(typeof x); // ❌ ReferenceError
let x = 5;
```

---

### How is TDZ different from `undefined`?

| বিষয় | `var` (hoisted) | TDZ (`let`/`const`) |
|---|---|---|
| Memory allocate হয়েছে? | ✅ হ্যাঁ | ✅ হ্যাঁ |
| Initialize হয়েছে? | ✅ (`undefined`) | ❌ (uninitialized) |
| Access করলে? | `undefined` পাওয়া যায় | `ReferenceError` |
| `typeof` করলে? | `"undefined"` | `ReferenceError` |
| Bug ধরা পড়ে? | ❌ নীরবে fail | ✅ জোরে fail |

```js
// undefined — ইচ্ছাকৃতভাবে দেওয়া বা var-এর default:
let result = undefined; // valid, intentional
console.log(result); // undefined — কোনো error নেই

// TDZ — ভুলবশত declaration-এর আগে access:
console.log(data); // ❌ ReferenceError — TDZ
let data = 'value';
```

---

### When does TDZ start and end?

**TDZ শুরু হয়:** যখন enclosing scope (block/function) শুরু হয় — অর্থাৎ hoisting-এর সময় থেকেই।

**TDZ শেষ হয়:** যখন code execution সেই variable-এর **declaration line-এ** পৌঁছায় এবং variable initialize হয়।

```js
{
  // ← Block শুরু = TDZ শুরু (x এবং y উভয়ের জন্য)

  console.log(x); // ❌ ReferenceError — x TDZ-এ

  let x = 10;     // ← x-এর TDZ শেষ, x = 10

  console.log(x); // ✅ 10

  console.log(y); // ❌ ReferenceError — y এখনো TDZ-এ

  const y = 20;   // ← y-এর TDZ শেষ, y = 20

  console.log(y); // ✅ 20
} // ← Block শেষ = x, y উভয়ই scope থেকে বেরিয়ে যায়
```

**Function parameter-এ TDZ:**

```js
// Default parameter-এ TDZ:
function greet(name, greeting = name.toUpperCase()) {
  // name এখানে আগে initialize হয়, তারপর greeting
  console.log(greeting);
}

greet('ali'); // 'ALI' ✅

// ❌ নিজেকে নিজে default হিসেবে ব্যবহার করা যায় না:
function broken(x = x) { // ReferenceError — x TDZ-এ থেকে নিজেই নিজের default
  return x;
}
// broken(5); // ✅ কাজ করবে কারণ x = 5 পাস করা হয়েছে
// broken();  // ❌ ReferenceError — default value evaluate করতে গিয়ে TDZ
```

**class-এও TDZ প্রযোজ্য:**

```js
// ❌ class declaration-এর আগে ব্যবহার করা যায় না
const obj = new MyClass(); // ReferenceError — TDZ
class MyClass {
  constructor() { this.name = 'test'; }
}

// function declaration থেকে পার্থক্য:
const obj2 = new MyFunc(); // ✅ — function declaration সম্পূর্ণ hoisted
function MyFunc() { this.name = 'test'; }
```

> **💡 সুপারিশ:** TDZ এড়াতে সবসময় **block-এর শুরুতে** `let`/`const` declare করুন। এতে code readable হয় এবং TDZ-related bug হওয়ার সুযোগ থাকে না।