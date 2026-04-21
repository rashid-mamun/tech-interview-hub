---
sidebar_position: 1
title: ''
---

## 1. What is the difference between `==` and `===`?

| | `==` (Loose Equality) | `===` (Strict Equality) |
|---|---|---|
| Type check করে? | ❌ না | ✅ হ্যাঁ |
| Type coercion করে? | ✅ হ্যাঁ | ❌ না |
| কখন `true`? | value same হলে (type convert করে) | value এবং type উভয় same হলে |

```js
// == — type convert করে তারপর compare
console.log(1 == '1');   // true  — string '1' → number 1
console.log(0 == false); // true  — false → 0
console.log(null == undefined); // true  — special rule

// === — type এবং value দুটোই same হতে হবে
console.log(1 === '1');  // false — number vs string
console.log(0 === false);// false — number vs boolean
console.log(null === undefined); // false — আলাদা type
```

---

### How does type coercion work in `==`?

`==` ব্যবহার করলে JavaScript **Abstract Equality Comparison Algorithm** follow করে:

```
Rule 1: একটি boolean হলে → number-এ convert করো
Rule 2: একটি string, অন্যটি number হলে → string কে number-এ convert করো
Rule 3: একটি object, অন্যটি primitive হলে → object.valueOf() বা toString() call করো
Rule 4: null == undefined → সবসময় true (অন্য কিছুর সাথে false)
Rule 5: NaN == যেকোনো কিছু → সবসময় false (নিজের সাথেও false!)
```

```js
// Rule 1 — boolean to number:
false == 0     // false → 0, তারপর 0 == 0 → true
true  == 1     // true  → 1, তারপর 1 == 1 → true
true  == 2     // true  → 1, তারপর 1 == 2 → false

// Rule 2 — string to number:
'5'   == 5     // '5' → 5, তারপর 5 == 5 → true
''    == 0     // '' → 0, তারপর 0 == 0 → true
'0'   == false // false → 0, '0' → 0, তারপর 0 == 0 → true

// Rule 3 — object to primitive:
[1]   == 1     // [1].toString() → '1' → 1, তারপর 1 == 1 → true
[]    == false // [].toString() → '', '' → 0, false → 0 → true
['a'] == 'a'   // ['a'].toString() → 'a', 'a' == 'a' → true

// Rule 4 — null/undefined special:
null  == undefined // true  ✅ (special case)
null  == 0         // false ❌
null  == ''        // false ❌
null  == false     // false ❌

// Rule 5 — NaN:
NaN == NaN  // false — NaN নিজের সাথেও equal নয়!
```

---

### When should you use strict equality?

**সবসময় `===` ব্যবহার করুন** — শুধুমাত্র বিশেষ কারণে `==` ব্যবহার করুন।

```js
// ✅ === ব্যবহার করুন — predictable, no surprises
function checkAge(age) {
  if (age === 18) {          // শুধু number 18, '18' নয়
    console.log('Adult');
  }
}

checkAge(18);   // 'Adult' ✅
checkAge('18'); // কিছু না — intentional!
```

**`==` ব্যবহার করা যেতে পারে শুধুমাত্র `null`/`undefined` check-এ:**

```js
// null বা undefined — দুটো একসাথে check করতে == কাজের:
function process(value) {
  if (value == null) {        // null এবং undefined উভয়ই catch করে
    return 'No value';
  }
  return value;
}

process(null);      // 'No value'
process(undefined); // 'No value'
process(0);         // 0 — false নয়!

// === দিয়ে একই কাজ করতে দুটো check লাগতো:
if (value === null || value === undefined) { ... }
```

---

### What are tricky equality cases?

```js
// ⚠️ সবচেয়ে confusing cases:

// 1. NaN
NaN === NaN  // false — NaN কখনো নিজের সমান নয়
Number.isNaN(NaN) // true  ✅ — NaN check করার সঠিক উপায়

// 2. +0 এবং -0
+0 === -0    // true  — strict equality-তে equal!
Object.is(+0, -0) // false ✅ — সত্যিকারের পার্থক্য দেখায়

// 3. object comparison — reference check করে
const a = { x: 1 };
const b = { x: 1 };
a == b   // false — আলাদা reference
a === b  // false — আলাদা reference
a === a  // true  — একই reference

// 4. type coercion chain — transitivity নেই:
'' == '0'    // false — '' এবং '0' দুটোই string, value আলাদা
0  == ''     // true  — '' → 0
0  == '0'    // true  — '0' → 0
// কিন্তু: '' != '0', 0 == '', 0 == '0' — transitivity নেই! 😱

// 5. null এবং undefined অন্য falsy থেকে আলাদা:
null  == false // false — null শুধু undefined-এর সাথে ==
null  == 0     // false
null  == ''    // false
```

---

## 2. What is type coercion in JavaScript?

**Type coercion** হলো JavaScript-এর automatic (বা manual) একটি data type-কে অন্য type-এ convert করার process। JavaScript **dynamically typed** language, তাই বিভিন্ন operation-এ এটি স্বয়ংক্রিয়ভাবে হয়।

---

### Implicit vs explicit coercion

**Implicit coercion — JavaScript নিজে করে (automatic):**

```js
// String + Number → String (concatenation wins)
console.log('5' + 3);    // '53' — number → string
console.log('5' - 3);    // 2   — string → number (- operator)
console.log('5' * '3');  // 15  — উভয়ই → number

// Boolean context → number
console.log(true  + 1);  // 2   — true → 1
console.log(false + 1);  // 1   — false → 0
console.log(null  + 1);  // 1   — null → 0
console.log(undefined + 1); // NaN — undefined → NaN

// Template literal → string
const num = 42;
console.log(`Value: ${num}`); // 'Value: 42' — number → string
```

**Explicit coercion — developer নিজে করে (manual):**

```js
// → Number
Number('42')       // 42
Number('')         // 0
Number('abc')      // NaN
Number(true)       // 1
Number(false)      // 0
Number(null)       // 0
Number(undefined)  // NaN
parseInt('42px')   // 42 — string শুরু থেকে number নেয়
parseFloat('3.14') // 3.14
+'42'              // 42 — unary + operator

// → String
String(42)         // '42'
String(true)       // 'true'
String(null)       // 'null'
String(undefined)  // 'undefined'
(42).toString()    // '42'
'' + 42            // '42' — concatenation trick

// → Boolean
Boolean(1)         // true
Boolean(0)         // false
Boolean('')        // false
Boolean('hello')   // true
Boolean(null)      // false
Boolean({})        // true — empty object-ও truthy!
!!value            // double negation trick
```

---

### How does JS convert types internally?

JavaScript তিনটি abstract operation ব্যবহার করে:

**`ToPrimitive(value, hint)`** — object থেকে primitive বানানোর সময়:

```js
// hint = 'number' হলে: valueOf() আগে, তারপর toString()
// hint = 'string' হলে: toString() আগে, তারপর valueOf()
// hint = 'default' হলে: number-এর মতো (Date ছাড়া)

const obj = {
  valueOf()  { return 42; },
  toString() { return 'hello'; }
};

console.log(obj + 1);     // 43  — default hint → valueOf() → 42 + 1
console.log(`${obj}`);    // 'hello' — string hint → toString()
console.log(obj == 42);   // true — default hint → valueOf()
```

**`ToNumber(value)`** — number conversion-এর নিয়ম:

```js
// Conversion table:
// undefined  → NaN
// null       → 0
// true       → 1
// false      → 0
// ''         → 0
// '  '       → 0  (whitespace trim হয়)
// '42'       → 42
// '0x1F'     → 31 (hex)
// '0o10'     → 8  (octal)
// '0b101'    → 5  (binary)
// 'abc'      → NaN
// []         → 0  ([].toString() → '' → 0)
// [1]        → 1  ([1].toString() → '1' → 1)
// [1,2]      → NaN ([1,2].toString() → '1,2' → NaN)
// {}         → NaN ({}.toString() → '[object Object]' → NaN)
```

**`ToString(value)`** — string conversion-এর নিয়ম:

```js
// undefined   → 'undefined'
// null        → 'null'
// true/false  → 'true'/'false'
// 0           → '0'
// -0          → '0'  (লক্ষ্য করুন — '-0' নয়!)
// NaN         → 'NaN'
// Infinity    → 'Infinity'
// []          → ''
// [1,2,3]     → '1,2,3'
// {}          → '[object Object]'
// Symbol('x') → TypeError (cannot convert)
```

---

### What are common pitfalls?

```js
// ⚠️ Pitfall 1: + operator ambiguity
1 + '2'    // '12' — concatenation (string wins)
1 - '2'    // -1  — subtraction (number wins, - is always numeric)
+ '42'     // 42  — unary + converts to number

// ⚠️ Pitfall 2: null vs undefined addition
null + 1      // 1   — null → 0
undefined + 1 // NaN — undefined → NaN

// ⚠️ Pitfall 3: array + array
[] + []    // ''   — [].toString() + [].toString() → '' + '' → ''
[] + {}    // '[object Object]'
{} + []    // 0 (statement context-এ {} = empty block, তারপর +[] = 0)
({} + [])  // '[object Object]' (expression context-এ)

// ⚠️ Pitfall 4: parseInt-এর radix না দেওয়া
parseInt('08')   // 8  (modern ES5+)
parseInt('0x10') // 16 — hex detect করে!
parseInt('10', 2) // 2 — binary: 10₂ = 2
parseInt('10.5') // 10 — decimal part ignore করে
// সবসময় radix দিন: parseInt(str, 10)

// ⚠️ Pitfall 5: conditional-এ implicit boolean
const count = 0;
if (count) { // ❌ 0 falsy — count = 0 valid value, কিন্তু skip হবে!
  console.log('Has items');
}
// ✅ সঠিক:
if (count !== undefined) { ... } // অথবা
if (count > 0) { ... }

// ⚠️ Pitfall 6: String to Number conversion edge cases
Number('   ')      // 0   — whitespace only
Number('123abc')   // NaN — invalid number
parseInt('123abc') // 123 — partial parsing
parseFloat('12.3.4') // 12.3 — stops at second dot
```

> **💡 সুপারিশ:** Implicit coercion এড়িয়ে সবসময় explicit conversion করুন। Code পড়তে সহজ হয় এবং bug কম হয়।

---

## 3. What are truthy and falsy values?

JavaScript-এ প্রতিটি value-এরই একটি **inherent boolean** আছে — `if`, `while`, `&&`, `||`, `!` — যেকোনো boolean context-এ সেই value `true` বা `false` হিসেবে কাজ করে।

---

### List all falsy values

JavaScript-এ মাত্র **৮টি falsy value** আছে — বাকি সবকিছু truthy:

```js
// ৮টি falsy value:
if (false)        {} // ❌ boolean false
if (0)            {} // ❌ number zero
if (-0)           {} // ❌ negative zero
if (0n)           {} // ❌ BigInt zero
if ('')           {} // ❌ empty string
if (null)         {} // ❌ null
if (undefined)    {} // ❌ undefined
if (NaN)          {} // ❌ Not a Number

// বাকি সবকিছু truthy:
if (1)            { console.log('truthy'); } // ✅
if ('0')          { console.log('truthy'); } // ✅ — '0' string, empty নয়!
if ([])           { console.log('truthy'); } // ✅ — empty array truthy!
if ({})           { console.log('truthy'); } // ✅ — empty object truthy!
if (-1)           { console.log('truthy'); } // ✅ — যেকোনো non-zero number
if (Infinity)     { console.log('truthy'); } // ✅
if ('false')      { console.log('truthy'); } // ✅ — 'false' string truthy!
```

**Falsy values summary table:**

| Value | Type | Falsy কারণ |
|---|---|---|
| `false` | Boolean | সরাসরি false |
| `0` | Number | শূন্য |
| `-0` | Number | negative শূন্য |
| `0n` | BigInt | BigInt শূন্য |
| `''` / `""` / ` `` ` | String | empty string |
| `null` | Null | no value |
| `undefined` | Undefined | unassigned |
| `NaN` | Number | invalid number |

---

### How are objects treated?

**সব object — truthy**, এমনকি empty হলেও:

```js
// ✅ সব object truthy:
Boolean({})          // true — empty object
Boolean([])          // true — empty array
Boolean(new Date())  // true — Date object
Boolean(function(){})// true — function
Boolean(/regex/)     // true — RegExp

// ⚠️ সাধারণ ভুল:
const data = [];
if (data) {
  console.log('Has data?'); // ✅ print হবে — কিন্তু array empty!
}

// ✅ সঠিকভাবে check করুন:
if (data.length > 0) {
  console.log('Has data!');
}
```

**Object-এর boolean check করবেন যেভাবে:**

```js
// Object empty কিনা check:
const obj = {};
if (Object.keys(obj).length === 0) {
  console.log('Empty object');
}

// Array empty কিনা check:
const arr = [];
if (arr.length === 0) {
  console.log('Empty array');
}

// Null বা undefined check (but not false/0/''):
if (value == null) { // null == undefined
  console.log('No value');
}

// Optional chaining দিয়ে safe access:
const name = user?.profile?.name ?? 'Anonymous';
```

---

### What are edge cases?

```js
// ⚠️ Edge case 1: '0' string — truthy, কিন্তু Number('0') falsy!
const str = '0';
if (str)          { console.log('truthy'); } // ✅ — string '0' truthy
if (Number(str))  { console.log('truthy'); } // ❌ — 0 falsy
// API থেকে আসা '0' কে if (str) দিয়ে check করলে bug হবে

// ⚠️ Edge case 2: [] == false কিন্তু Boolean([]) = true!
console.log([] == false);  // true  — coercion: [] → '' → 0, false → 0
console.log(Boolean([]));  // true  — object সবসময় truthy
if ([]) { console.log('truthy'); } // ✅ print হবে
// if ([]) → truthy, কিন্তু [] == false → true — বিরোধী মনে হয়!

// ⚠️ Edge case 3: || এবং && operator
// || — প্রথম truthy value return করে, অথবা শেষটি
console.log(0 || 'default');      // 'default' — 0 falsy
console.log('' || 'fallback');    // 'fallback' — '' falsy
console.log(false || null || 1);  // 1 — প্রথম truthy

// && — প্রথম falsy value return করে, অথবা শেষটি
console.log(1 && 2 && 3);   // 3 — সব truthy, শেষটি
console.log(1 && 0 && 3);   // 0 — প্রথম falsy
console.log(null && 'hi');  // null — প্রথম falsy

// ⚠️ Edge case 4: ?? (Nullish Coalescing) vs ||
const count = 0;
console.log(count || 10);  // 10 — 0 falsy, তাই default নেয়
console.log(count ?? 10);  // 0  — ?? শুধু null/undefined check করে

const value = '';
console.log(value || 'default');  // 'default' — '' falsy
console.log(value ?? 'default');  // '' — ?? শুধু null/undefined

// ⚠️ Edge case 5: Explicit Boolean conversion
console.log(!!null);       // false
console.log(!!undefined);  // false
console.log(!!'');         // false
console.log(!![]);         // true  — array, তাই truthy
console.log(!!0);          // false
console.log(!!'0');        // true  — '0' string, truthy

// ⚠️ Edge case 6: new Boolean(false) — truthy!
const b = new Boolean(false); // object wrapper
if (b) {
  console.log('truthy!'); // ✅ print হবে — object wrapper সবসময় truthy
}
console.log(b == false);    // true  — coercion: b.valueOf() → false
console.log(b === false);   // false — object vs primitive
console.log(b.valueOf());   // false — primitive value
// new Boolean() ব্যবহার করা উচিত নয়!

// ⚠️ Edge case 7: document.all — historically falsy object
console.log(Boolean(document.all)); // false (legacy quirk)
console.log(typeof document.all);   // "undefined" (legacy quirk)
// এটি একমাত্র falsy object — backward compatibility-এর জন্য
```

> **💡 সুপারিশ:** Truthy/falsy-র উপর blindly নির্ভর না করে explicit comparison ব্যবহার করুন। `count > 0`, `arr.length > 0`, `value !== null` — এরকম স্পষ্ট condition code পড়তে সহজ এবং bug-free।