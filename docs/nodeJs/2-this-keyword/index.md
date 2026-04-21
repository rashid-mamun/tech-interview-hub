---
sidebar_position: 1
title: ''
---

## 1. What is this in JavaScript?
`this` হলো JavaScript-এর একটি special keyword যা **কোন object-এর context-এ বর্তমান code চলছে** তা refer করে। অন্য অনেক language-এ `this` সবসময় class-এর instance কে বোঝায়, কিন্তু JavaScript-এ `this`-এর value **function কীভাবে call হয়েছে** তার উপর নির্ভর করে — কোথায় define হয়েছে তার উপর নয়।

```js
function show() {
  console.log(this);
}
const obj = { name: 'Alice', show };
show();      // → Window (বা global)
obj.show();  // → { name: 'Alice', show: fn }
// একই function, কিন্তু this আলাদা — কারণ call করার ধরন আলাদা
```
---
### How is this determined at runtime?
JavaScript-এ `this` নির্ধারণের **৪টি binding rule** আছে। Engine এই rules গুলো priority অনুযায়ী check করে।
```
**this নির্ধারণের priority:**
1. new binding          ← সর্বোচ্চ priority
2. Explicit binding     ← call/apply/bind
3. Implicit binding     ← object method call
4. Default binding      ← সর্বনিম্ন priority
─────────────────────────
★ Arrow function        ← উপরের কোনো rule প্রযোজ্য নয়,
                          lexical scope থেকে নেয়
```
---
### What is the default binding rule?
কোনো object ছাড়া, plain function call হলে `this` হয় **global object** (`window` browser-এ, `global` Node.js-এ)।

```js
function showThis() {
  console.log(this);
}

showThis(); // Browser: Window object
            // Node.js: global object
```

```js
var name = 'Global Alice'; // Browser-এ var global object-এর property হয়

function greet() {
  console.log(this.name); // global object-এর name
}

greet(); // Browser: 'Global Alice'
         // Node.js: undefined (var top-level-এ global property হয় না)
```

> **⚠️ সতর্কতা:** `let` এবং `const` দিয়ে declare করা variable global object-এর property হয় না।

### What happens in strict mode?

**Strict mode-এ default binding-এ `this` হয় `undefined`** — global object নয়। এটি accidental global variable তৈরি এবং global object mutation থেকে রক্ষা করে।

```js
'use strict';

function showThis() {
  console.log(this); // undefined
}

showThis(); // undefined — global object নয়!
```

```js
'use strict';

function greet() {
  console.log(this.name); // TypeError: Cannot read properties of undefined
}

greet(); // 💥 Error — this undefined, তাই .name access করা যাচ্ছে না
```

**Strict mode এবং non-strict mode একসাথে থাকলে:**

```js
function nonStrict() {
  console.log(this); // Window — নিজের mode অনুযায়ী
}

function strict() {
  'use strict';
  console.log(this); // undefined — নিজের mode অনুযায়ী
}

nonStrict(); // Window
strict();    // undefined
```

---

### Rule 2 — Implicit Binding

Function যদি কোনো **object-এর method হিসেবে** call হয়, তাহলে `this` হয় সেই object।

```js
const user = {
  name: 'Alice',
  greet() {
    console.log(`Hello, আমি ${this.name}`);
  }
};

user.greet(); // Hello, আমি Alice
// this → user object
```

**Chained object-এ সবসময় সবচেয়ে কাছের object:**

```js
const company = {
  name: 'TechCorp',
  ceo: {
    name: 'Bob',
    introduce() {
      console.log(`আমি ${this.name}, CEO`);
    }
  }
};

company.ceo.introduce(); // আমি Bob, CEO
// this → company.ceo (সবচেয়ে কাছের object)
// this → company নয়!
```

**Implicit binding হারিয়ে যাওয়া — সবচেয়ে common bug:**

```js
const user = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

user.greet(); // ✅ Hello, Alice

// Reference copy করলে binding হারায়:
const fn = user.greet; // শুধু function reference, object ছাড়া
fn(); // ❌ Hello, undefined (বা strict mode-এ TypeError)
```

```js
// Callback-এ দিলেও binding হারায়:
const user = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};

setTimeout(user.greet, 1000); // ❌ undefined
// setTimeout শুধু function reference নেয়, object context নেয় না
```
---
### Rule 3 — Explicit Binding

`call()`, `apply()`, `bind()` দিয়ে `this` কী হবে তা **সরাসরি বলে দেওয়া** যায়।

**`call(thisArg, arg1, arg2, ...)`** — সাথে সাথে call করে, arguments আলাদাভাবে:

```js
function introduce(city, country) {
  console.log(`আমি ${this.name}, ${city}, ${country} থেকে`);
}

const person = { name: 'Alice' };

introduce.call(person, 'Dhaka', 'Bangladesh');
// আমি Alice, Dhaka, Bangladesh থেকে
// this → person
```

**`apply(thisArg, [args])`** — সাথে সাথে call করে, arguments array হিসেবে:

```js
introduce.apply(person, ['Dhaka', 'Bangladesh']);
// একই output — শুধু arguments দেওয়ার ধরন আলাদা
```

**`bind(thisArg, arg1, ...)`** — নতুন function return করে, পরে call করার জন্য:

```js
const aliceIntroduce = introduce.bind(person, 'Dhaka');
// এখনই call হয়নি — নতুন function তৈরি হয়েছে

aliceIntroduce('Bangladesh');
// আমি Alice, Dhaka, Bangladesh থেকে

// Callback-এর binding সমস্যা সমাধান:
setTimeout(user.greet.bind(user), 1000); // ✅ Alice
```

**তিনটির তুলনা:**

| | `call` | `apply` | `bind` |
|---|---|---|---|
| কখন execute হয় | সাথে সাথে | সাথে সাথে | পরে (new function) |
| Arguments | আলাদাভাবে | Array হিসেবে | আলাদাভাবে (partial) |
| Return করে | result | result | নতুন function |

---

### Rule 4 — `new` Binding

`new` দিয়ে function call করলে JavaScript automatically একটি নতুন empty object তৈরি করে এবং `this` সেই নতুন object কে point করে।

```js
function Person(name, age) {
  // new দিলে JavaScript এটি করে:
  // const this = {};  ← নতুন object তৈরি

  this.name = name;   // নতুন object-এ property set
  this.age = age;

  // return this;      ← automatically return
}

const alice = new Person('Alice', 30);
console.log(alice.name); // Alice
console.log(alice.age);  // 30
// this → নতুন তৈরি হওয়া alice object
```

**`new` ছাড়া call করলে বিপদ:**

```js
const bob = Person('Bob', 25); // new ছাড়া!
// this → global object (non-strict) বা undefined (strict)
// global object pollute হয়ে যাবে!

console.log(window.name); // 'Bob' — global-এ চলে গেছে! 😱
console.log(bob);         // undefined — কিছু return হয়নি
```
---

## 2. How does this behave in different contexts?

`this`-এর value **context** অনুযায়ী পরিবর্তন হয় — কোথায় code লেখা হয়েছে তার উপর নয়, **কীভাবে call হয়েছে** তার উপর।

---
### Global context vs function context

**Global context-এ `this`:**

Browser-এ top-level code-এ `this` হয় `window` object। Node.js-এ top-level `this` হয় `module.exports` (empty object `{}`), কিন্তু global object পাওয়া যায় `globalThis` দিয়ে।

```js
// Browser
console.log(this === window); // true

// Node.js (top-level)
console.log(this);           // {} — module.exports
console.log(globalThis);     // global object
```

**Function context-এ `this`:**

Regular function-এ `this` নির্ভর করে কীভাবে call হয়েছে তার উপর:

```js
function showContext() {
  console.log(this);
}

// Non-strict mode:
showContext();           // Window / global object (default binding)

// Strict mode:
'use strict';
showContext();           // undefined
```

> **💡 মনে রাখুন:** Global context এবং function context-এ `this` আলাদা। Function-এর ভেতরে `this` automatic ভাবে global হয় না — binding rule প্রযোজ্য হয়।

---

### Object methods vs standalone functions

**Object method-এ `this`:**

কোনো function যখন object-এর property হিসেবে call হয়, তখন `this` সেই object হয়।

```js
const counter = {
  count: 0,
  increment() {
    this.count++;                    // this → counter object
    console.log(this.count);
  }
};

counter.increment(); // 1
counter.increment(); // 2
```

**Standalone function-এ `this`:**

একই function কে object থেকে বের করে call করলে `this` হারিয়ে যায়।

```js
const counter = {
  count: 10,
  increment() {
    console.log(this.count);
  }
};

const fn = counter.increment; // শুধু function reference নেওয়া হয়েছে
fn();                          // ❌ undefined — object context নেই

// ✅ সমাধান: bind() দিয়ে context ঠিক রাখুন
const boundFn = counter.increment.bind(counter);
boundFn(); // 10
```

**Nested function-এও `this` হারায়:**

```js
const user = {
  name: 'Alice',
  greet() {
    function inner() {
      console.log(this.name); // ❌ undefined — inner একটি standalone function
    }
    inner();
  }
};

user.greet(); // undefined

// ✅ সমাধান 1: arrow function ব্যবহার করুন
const user2 = {
  name: 'Alice',
  greet() {
    const inner = () => {
      console.log(this.name); // ✅ Alice — lexical this
    };
    inner();
  }
};

user2.greet(); // Alice

// ✅ সমাধান 2: self/that pattern
const user3 = {
  name: 'Alice',
  greet() {
    const self = this;           // this সংরক্ষণ করা হলো
    function inner() {
      console.log(self.name);    // ✅ Alice
    }
    inner();
  }
};

user3.greet(); // Alice
```

---

### Constructor functions vs classes

**Constructor function-এ `this`:**

`new` keyword দিয়ে call করলে `this` হয় নতুন তৈরি হওয়া object। প্রতিটি `new` call-এ আলাদা instance তৈরি হয়।

```js
function Animal(name, sound) {
  this.name = name;
  this.sound = sound;
  this.speak = function () {
    console.log(`${this.name} বলে: ${this.sound}`);
  };
}

const cat = new Animal('Cat', 'Meow');
const dog = new Animal('Dog', 'Woof');

cat.speak(); // Cat বলে: Meow  → this = cat
dog.speak(); // Dog বলে: Woof  → this = dog

console.log(cat === dog); // false — সম্পূর্ণ আলাদা object
```

**Class-এ `this`:**

ES6 Class-ও internally constructor function-এর মতোই কাজ করে, তবে syntax পরিষ্কার এবং সবসময় strict mode-এ চলে।

```js
class Vehicle {
  constructor(brand, speed) {
    this.brand = brand;       // this → নতুন তৈরি instance
    this.speed = speed;
  }

  describe() {
    console.log(`${this.brand} চলে ${this.speed} km/h বেগে`);
    // this → যে instance থেকে call হয়েছে
  }
}

const car = new Vehicle('Toyota', 120);
const bike = new Vehicle('Honda', 80);

car.describe();  // Toyota চলে 120 km/h বেগে  → this = car
bike.describe(); // Honda চলে 80 km/h বেগে   → this = bike
```

**Class-এ `this` হারানোর সমস্যা (callback):**

```js
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // ❌ this হারিয়ে যাবে — setTimeout callback-এ this = undefined (strict mode)
    setTimeout(function () {
      this.seconds++;          // TypeError!
    }, 1000);

    // ✅ সমাধান: arrow function ব্যবহার করুন
    setTimeout(() => {
      this.seconds++;          // this → Timer instance (lexical binding)
      console.log(this.seconds);
    }, 1000);
  }
}

const t = new Timer();
t.start(); // 1
```

**Constructor function vs Class — তুলনা:**

| বিষয় | Constructor Function | Class |
|---|---|---|
| Syntax | পুরোনো, কম readable | আধুনিক, পরিষ্কার |
| Strict mode | না (default) | সবসময় strict |
| Hoisting | ✅ হয় | ❌ হয় না |
| `this` behavior | একই | একই |
| Inheritance | `prototype` দিয়ে | `extends` দিয়ে |

> **💡 সুপারিশ:** নতুন code-এ সবসময় `class` ব্যবহার করুন — এটি readable, strict mode-এ চলে এবং inheritance সহজ।

## 3. What is the difference between arrow functions and regular functions in terms of `this`?

Arrow function এবং regular function-এর মধ্যে সবচেয়ে বড় পার্থক্য হলো **`this` কীভাবে নির্ধারণ হয়**।

| বিষয় | Regular Function | Arrow Function |
|---|---|---|
| নিজের `this` আছে? | ✅ হ্যাঁ | ❌ নেই |
| `this` নির্ধারণ | Call-time (কীভাবে call হয়) | Lexical (কোথায় লেখা হয়) |
| `call/apply/bind` দিয়ে পরিবর্তন | ✅ হয় | ❌ হয় না |
| Constructor হিসেবে ব্যবহার | ✅ হয় | ❌ হয় না |
| `arguments` object | ✅ আছে | ❌ নেই |

---

### Why do arrow functions not have their own `this`?

Arrow function তৈরির সময় JavaScript কোনো নতুন `this` binding তৈরি করে না। পরিবর্তে, এটি **surrounding (enclosing) scope-এর `this`** ধার করে নেয়। এটি JavaScript engine-এর design decision — arrow function শুধু callback এবং short expression-এর জন্য।

```js
function Regular() {
  this.value = 10;

  // Regular function — নতুন this তৈরি হয়
  const inner = function () {
    console.log(this); // undefined (strict) বা window (non-strict)
  };

  // Arrow function — surrounding this নেয়
  const arrow = () => {
    console.log(this.value); // 10 — Regular-এর this
  };

  inner(); // undefined বা window
  arrow(); // 10
}

new Regular();
```

> **💡 কারণ:** Arrow function define হওয়ার সময় **surrounding execution context-এর `this`** capture করে — এটি runtime-এ পরিবর্তন হয় না।

---

### What is lexical `this`?

**Lexical `this`** মানে হলো `this`-এর value **code লেখার অবস্থান (lexical position)** থেকে নেওয়া হয়, call করার সময় থেকে নয়।

```js
const team = {
  name: 'Dev Team',
  members: ['Alice', 'Bob', 'Carol'],

  printMembers() {
    // এখানে this → team object (implicit binding)
    this.members.forEach(member => {
      // Arrow function — surrounding printMembers-এর this নেয়
      console.log(`${member} is in ${this.name}`);
      //                              ↑ this → team (lexical!)
    });
  }
};

team.printMembers();
// Alice is in Dev Team
// Bob is in Dev Team
// Carol is in Dev Team
```

**Regular function হলে কী হতো:**

```js
const team = {
  name: 'Dev Team',
  members: ['Alice', 'Bob'],

  printMembers() {
    this.members.forEach(function (member) {
      // Regular function — নিজের this তৈরি করে, team নয়!
      console.log(`${member} is in ${this.name}`); // ❌ undefined
    });
  }
};

team.printMembers(); // Alice is in undefined, Bob is in undefined
```

---

### When should you avoid arrow functions?

Arrow function **সব জায়গায় ব্যবহার করা উচিত নয়**। নিচের ক্ষেত্রে regular function ব্যবহার করুন:

**১. Object method হিসেবে:**

```js
const user = {
  name: 'Alice',
  // ❌ ভুল — arrow function তাই this = window/undefined
  greet: () => {
    console.log(this.name); // undefined
  },
  // ✅ সঠিক
  greetCorrect() {
    console.log(this.name); // Alice
  }
};

user.greet();        // undefined
user.greetCorrect(); // Alice
```

**২. Constructor function হিসেবে:**

```js
// ❌ arrow function দিয়ে new করা যায় না
const Person = (name) => {
  this.name = name;
};
const p = new Person('Alice'); // TypeError: Person is not a constructor

// ✅ regular function বা class ব্যবহার করুন
function Person(name) {
  this.name = name;
}
```

**৩. `prototype` method হিসেবে:**

```js
function Dog(name) {
  this.name = name;
}

// ❌ arrow function — this হারাবে
Dog.prototype.bark = () => {
  console.log(`${this.name} barks!`); // undefined
};

// ✅ regular function
Dog.prototype.bark = function () {
  console.log(`${this.name} barks!`); // Rex barks!
};

const rex = new Dog('Rex');
rex.bark();
```

**৪. Dynamic `this` দরকার হলে (event handler-এ element access):**

```js
const button = document.querySelector('button');

// ❌ arrow function — this = window, element নয়
button.addEventListener('click', () => {
  console.log(this); // window
});

// ✅ regular function — this = clicked element
button.addEventListener('click', function () {
  console.log(this); // <button> element
  this.style.color = 'red';
});
```

---

## 4. What are `call`, `apply`, and `bind`?

`call()`, `apply()`, `bind()` — এই তিনটি method দিয়ে **explicit binding** করা হয়, অর্থাৎ `this` কী হবে তা সরাসরি নির্ধারণ করে দেওয়া যায়।

---

### What is the difference between them?

**`call(thisArg, arg1, arg2, ...)`**
তাৎক্ষণিক call করে, arguments একটি একটি করে দেওয়া হয়:

```js
function introduce(city, language) {
  console.log(`আমি ${this.name}, ${city} থেকে, ${language} বলি`);
}

const dev = { name: 'Rahim' };

introduce.call(dev, 'Dhaka', 'Bengali');
// আমি Rahim, Dhaka থেকে, Bengali বলি
```

**`apply(thisArg, [argsArray])`**
তাৎক্ষণিক call করে, arguments **array** হিসেবে দেওয়া হয়:

```js
const args = ['Dhaka', 'Bengali'];
introduce.apply(dev, args);
// আমি Rahim, Dhaka থেকে, Bengali বলি
// — একই output, শুধু args দেওয়ার ধরন আলাদা
```

> **💡 টিপ:** `apply` ব্যবহার করুন যখন arguments আগে থেকে array হিসেবে আছে।

```js
// Real-world use case — array-এর max খোঁজা
const scores = [88, 95, 72, 100, 67];
const highest = Math.max.apply(null, scores);
console.log(highest); // 100
// Modern alternative: Math.max(...scores)
```

**`bind(thisArg, arg1, ...)`**
**নতুন function return করে** — সাথে সাথে call করে না:

```js
const devIntroduce = introduce.bind(dev, 'Dhaka');
// এখনই execute হয়নি — নতুন function তৈরি হয়েছে

devIntroduce('Bengali');   // আমি Rahim, Dhaka থেকে, Bengali বলি
devIntroduce('English');   // আমি Rahim, Dhaka থেকে, English বলি
// প্রথম argument (city) pre-filled, বাকিটা পরে দেওয়া যাচ্ছে
```

---

### When would you use `bind` over `call`?

`bind` ব্যবহার করুন যখন function **এখনই চালাতে চান না**, বরং পরে বা বারবার ব্যবহার করতে চান

**`call` ব্যবহার করুন** যখন function একবার তাৎক্ষণিক চালাতে চান

---

### How do they affect function execution?

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: 'Karim' };

// call — সাথে সাথে চলে, result পায়
const r1 = greet.call(user, 'Hello', '!');
console.log(r1); // Hello, Karim!

// apply — সাথে সাথে চলে, args array হিসেবে
const r2 = greet.apply(user, ['Hi', '?']);
console.log(r2); // Hi, Karim?

// bind — পরে চলে, নতুন function return করে
const boundGreet = greet.bind(user, 'Hey');
console.log(boundGreet('.')); // Hey, Karim.
console.log(boundGreet('!')); // Hey, Karim! (পুনরায় ব্যবহার)
```

> **⚠️ গুরুত্বপূর্ণ:** Arrow function-এ `call`, `apply`, `bind` দিয়ে `this` পরিবর্তন করা **সম্ভব নয়** — lexical `this` সবসময় নির্দিষ্ট থাকে।

```js
const arrow = () => console.log(this.name);
const obj = { name: 'Fixed' };

arrow.call(obj);  // undefined — this পরিবর্তন হয়নি!
arrow.apply(obj); // undefined
const bound = arrow.bind(obj);
bound();          // undefined
```

---

## 5. What happens to `this` in asynchronous callbacks?

Asynchronous code (setTimeout, setInterval, fetch, event listener) — এই সব ক্ষেত্রে `this` হারিয়ে যাওয়া JavaScript-এর সবচেয়ে **common bug**।

---

### Why does `this` get lost in callbacks?

Callback function গুলো **পরে** এবং **আলাদা context-এ** call হয়। যখন callback execute হয়, original object-এর সাথে কোনো সংযোগ থাকে না — তাই `this` default binding-এ চলে যায়।

```js
class Stopwatch {
  constructor() {
    this.elapsed = 0;
  }

  start() {
    // ❌ Regular function callback — this হারায়
    setTimeout(function () {
      this.elapsed += 1; // TypeError: Cannot set properties of undefined
      // এখানে this = undefined (strict) বা window (non-strict)
    }, 1000);
  }
}

const sw = new Stopwatch();
sw.start(); // 💥 Error
```

**কেন হারায়?** `setTimeout`-এর callback-টি JavaScript engine নিজে call করে, `sw` object নয়। তাই কোনো implicit binding তৈরি হয় না।

```js
// সহজ উদাহরণ
const obj = {
  name: 'Test',
  run() {
    console.log('run:', this.name);       // ✅ Test

    setTimeout(function () {
      console.log('timeout:', this.name); // ❌ undefined
    }, 100);
  }
};

obj.run();
```

---

### How do arrow functions fix this issue?

Arrow function **lexical `this`** ব্যবহার করে — অর্থাৎ যেখানে define হয়েছে সেখানকার `this` নেয়, পরে call হলেও `this` পরিবর্তন হয় না।

```js
class Stopwatch {
  constructor() {
    this.elapsed = 0;
  }

  start() {
    // ✅ Arrow function — surrounding this (Stopwatch instance) নেয়
    setTimeout(() => {
      this.elapsed += 1; // this → Stopwatch instance
      console.log(`Elapsed: ${this.elapsed}s`);
    }, 1000);
  }
}

const sw = new Stopwatch();
sw.start(); // Elapsed: 1s ✅
```

**Real-world: fetch callback:**

```js
class UserProfile {
  constructor(userId) {
    this.userId = userId;
    this.data = null;
  }

  async load() {
    // ✅ async/await-এ this সাধারণত ঠিক থাকে
    const response = await fetch(`/api/users/${this.userId}`);
    this.data = await response.json();
    console.log(`Loaded: ${this.data.name}`);
  }

  loadWithCallback() {
    // ❌ regular callback
    fetch(`/api/users/${this.userId}`)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        this.data = data; // ❌ this = undefined
      });

    // ✅ arrow callback
    fetch(`/api/users/${this.userId}`)
      .then(res => res.json())
      .then(data => {
        this.data = data; // ✅ this → UserProfile instance
        console.log(`Loaded: ${this.data.name}`);
      });
  }
}
```

---

### What are alternative solutions (`bind`, `self = this`)?

Arrow function ছাড়াও `this` ঠিক রাখার দুটি classic পদ্ধতি আছে:

**সমাধান ১ — `bind()` দিয়ে `this` fix করা:**

```js
class Counter {
  constructor() {
    this.count = 0;
    // Constructor-এই bind করে রাখুন
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.count++;
    console.log(this.count);
  }

  start() {
    setInterval(this.tick, 1000); // ✅ bind করা আছে, this ঠিক থাকবে
  }
}

const c = new Counter();
c.start(); // 1, 2, 3, ...
```

**সমাধান ২ — `self = this` (closure) pattern:**

```js
class Poller {
  constructor() {
    this.status = 'idle';
  }

  poll() {
    const self = this; // this কে variable-এ সংরক্ষণ

    setInterval(function () {
      // self closure-এর মাধ্যমে original this access করা হচ্ছে
      console.log(`Status: ${self.status}`); // ✅ idle
    }, 1000);
  }
}

const p = new Poller();
p.poll();
```

**তিনটি সমাধানের তুলনা:**

| পদ্ধতি | সুবিধা | অসুবিধা |
|---|---|---|
| **Arrow function** | সহজ, আধুনিক, readable | Object method হিসেবে ব্যবহার করা যায় না |
| **`bind()`** | Explicit, reusable | প্রতিটি method-এ আলাদাভাবে bind করতে হয় |
| **`self = this`** | পুরোনো browser-এও কাজ করে | Extra variable, কম readable |

> **💡 সুপারিশ:** আধুনিক JavaScript-এ সবসময় **arrow function** ব্যবহার করুন। Class-এ event listener-এর জন্য constructor-এ `bind()` করুন।