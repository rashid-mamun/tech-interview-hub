---
sidebar_position: 1
title: 'OOP Fundamentals'
---

## 📖 1. What is Object-Oriented Programming, and what problem does it solve compared to procedural programming?

**Object-Oriented Programming (OOP)** হলো একটি programming paradigm যেখানে কোড-কে **Object**-এর মাধ্যমে organize করা হয়। প্রতিটি Object-এর নিজস্ব **Data (Properties/State)** এবং **Behavior (Methods/Functions)** একসাথে থাকে। বাস্তব জগতের entity (যেমন: User, Car, BankAccount) যেভাবে data এবং behavior একসাথে বহন করে, OOP ঠিক সেভাবেই কোড মডেল করে।

**Procedural Programming-এর সমস্যা:**
Procedural approach-এ Data এবং Function সম্পূর্ণ আলাদা থাকে, এবং সাধারণত global state ব্যবহার করা হয়। ছোট প্রোগ্রামে এটি সমস্যা না হলেও, বড় সিস্টেমে নিচের সমস্যাগুলো দেখা দেয়:
- **Uncontrolled Data Access:** যেকোনো function থেকে global data পরিবর্তন করা যায়, ফলে bug track করা কঠিন হয়ে যায়।
- **Code Duplication:** একই ধরনের logic বারবার আলাদা function-এ লিখতে হয়, কারণ কোনো central "template" থাকে না।
- **Poor Scalability:** নতুন feature যোগ করলে পুরনো function-গুলোতে হাত দিতে হয়, ফলে অজান্তেই অন্য অংশ ভেঙে যাওয়ার ঝুঁকি থাকে।

OOP এই সমস্যাগুলো সমাধান করে data-কে object-এর ভেতরে **encapsulate** করে এবং কোডকে reusable, modular ও real-world-এর কাছাকাছি রেখে।

```javascript
// Procedural style — data এবং function আলাদা, global state-এর উপর নির্ভরশীল
let balance = 1000;

function deposit(amount) {
    balance += amount;
}

function withdraw(amount) {
    if (amount > balance) throw new Error('Insufficient funds');
    balance -= amount;
}

// যেকোনো জায়গা থেকে সরাসরি balance পরিবর্তন করা সম্ভব — এটাই সমস্যা
balance = -500; // Invalid state, কিন্তু কেউ আটকাচ্ছে না
```

```javascript
// OOP style — data (balance) encapsulated, শুধু class-এর নিজস্ব method দিয়েই পরিবর্তনযোগ্য
class BankAccount {
    #balance; // Private field

    constructor(initialBalance) {
        this.#balance = initialBalance;
    }

    deposit(amount) {
        this.#balance += amount;
    }

    withdraw(amount) {
        if (amount > this.#balance) throw new Error('Insufficient funds');
        this.#balance -= amount;
    }

    getBalance() {
        return this.#balance;
    }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// account.#balance = -500; // ❌ SyntaxError — বাইরে থেকে সরাসরি access করা যাবে না
```

### What are the four main pillars of OOP (encapsulation, abstraction, inheritance, polymorphism)?

| Pillar | সংজ্ঞা | উদাহরণ |
|---|---|---|
| **Encapsulation** | Data এবং সেই data-র উপর কাজ করা Method-গুলোকে একসাথে বেঁধে রাখা, এবং বাইরের থেকে সরাসরি data access সীমাবদ্ধ করা (`private` field, getter/setter)। | `BankAccount` class-এর `#balance` field সরাসরি বাইরে থেকে বদলানো যায় না, শুধু `deposit()`/`withdraw()` method দিয়ে বদলানো যায়। |
| **Abstraction** | জটিল internal implementation লুকিয়ে রেখে ব্যবহারকারীকে শুধু প্রয়োজনীয়, সরলীকৃত interface দেখানো। | `car.start()` কল করলেই গাড়ি চালু হয়ে যায় — ইঞ্জিনের ভেতরের ignition বা fuel-injection logic user-কে জানতে হয় না। |
| **Inheritance** | একটি Class (Child) আরেকটি Class (Parent)-এর property এবং method পুনরায় ব্যবহার করতে পারে, ফলে Code Duplication কমে। | `class Dog extends Animal` — `Dog` class স্বয়ংক্রিয়ভাবে `Animal`-এর `eat()`, `sleep()` method পেয়ে যাবে। |
| **Polymorphism** | একই Method/Interface বিভিন্ন Object-এর জন্য ভিন্নভাবে কাজ করতে পারে (Same interface, different implementation)। | `Dog` এবং `Cat` উভয়ের `makeSound()` method আছে, কিন্তু প্রতিটি নিজের মতো ভিন্ন output দেয়। |

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    makeSound() {
        return 'Some generic sound';
    }
}

class Dog extends Animal {          // Inheritance
    makeSound() {                   // Polymorphism — Method Override
        return `${this.name} says: Woof!`;
    }
}

class Cat extends Animal {
    makeSound() {                   // একই method name, ভিন্ন behavior
        return `${this.name} says: Meow!`;
    }
}

const animals = [new Dog('Rex'), new Cat('Whiskers')];
animals.forEach(a => console.log(a.makeSound()));
// Rex says: Woof!
// Whiskers says: Meow!
```

### How does OOP improve code reusability and maintainability?

- **Reusability (Inheritance-এর মাধ্যমে):** Common logic একবার Parent Class-এ লিখলেই সব Child Class সেটা reuse করতে পারে, বারবার একই কোড লেখার প্রয়োজন হয় না।
- **Maintainability (Encapsulation-এর মাধ্যমে):** যেহেতু কোনো একটি Class-এর internal data অন্য কোনো অংশ থেকে সরাসরি access করা যায় না, তাই একটি Class-এর ভেতরের implementation পরিবর্তন করলে বাকি সিস্টেমে unexpected side-effect হওয়ার ঝুঁকি অনেক কমে যায়।
- **Extensibility (Polymorphism-এর মাধ্যমে):** নতুন Class যোগ করার সময় পুরনো কোড পরিবর্তন না করেই নতুন behavior যোগ করা যায় (Open/Closed Principle)।
- **Real-world Modeling (Abstraction-এর মাধ্যমে):** সিস্টেমকে বাস্তব জগতের entity হিসেবে মডেল করা যায় বলে বড় টিমের জন্য কোড বোঝা এবং maintain করা সহজ হয়।

---

## 🧩 2. What is a class, and what is an object?

**Class** হলো একটি **Blueprint বা Template**, যেখানে বলা থাকে একটি Object-এর কী কী Property (Data) এবং Method (Behavior) থাকবে। এটি নিজে কোনো memory দখল করে না, শুধু structure define করে।

**Object** হলো সেই Class থেকে তৈরি করা একটি **Concrete Instance**, যার নিজস্ব actual data এবং memory allocation থাকে।

```javascript
// Class — শুধু Blueprint, এখনো কোনো memory allocate হয়নি
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

// Object — Class থেকে তৈরি প্রকৃত Instance, প্রতিটির নিজস্ব memory এবং data আছে
const user1 = new User('Rafi', 'rafi@example.com');
const user2 = new User('Nadia', 'nadia@example.com');

console.log(user1.greet()); // Hello, I'm Rafi
console.log(user2.greet()); // Hello, I'm Nadia
console.log(user1 === user2); // false — দুটো সম্পূর্ণ আলাদা object
```

### What is the difference between a class and an object/instance?

| বৈশিষ্ট্য | Class | Object / Instance |
|---|---|---|
| **সংজ্ঞা** | Blueprint বা Template। | Class থেকে তৈরি concrete জিনিস। |
| **Memory** | নিজে কোনো memory দখল করে না। | তৈরি হওয়ার সময় (`new` keyword দিয়ে) memory allocate হয়। |
| **সংখ্যা** | একটি Class সাধারণত একবারই define করা হয়। | একটি Class থেকে অসংখ্য আলাদা Object তৈরি করা যায়। |
| **উদাহরণ** | `class Car { ... }` | `const myCar = new Car('Toyota');` |

### What is the difference between a class and a struct (in languages that have both)?

JavaScript-এ `struct` নেই, তবে C++, C#, বা Go-এর মতো ভাষায় Class এবং Struct উভয়ই থাকে, এবং তাদের মধ্যে কিছু গুরুত্বপূর্ণ পার্থক্য আছে:

| বৈশিষ্ট্য | Class | Struct |
|---|---|---|
| **Type** | সাধারণত **Reference Type** — variable-এ object-এর reference/address store হয়। | সাধারণত **Value Type** — variable-এ সরাসরি data-ই store হয়। |
| **Memory Location** | Heap-এ allocate হয়। | সাধারণত Stack-এ allocate হয় (তাই দ্রুততর)। |
| **Copy Behavior** | Copy করলে শুধু reference কপি হয় — দুটো variable একই object-কে point করে। | Copy করলে সম্পূর্ণ নতুন এবং স্বাধীন data কপি তৈরি হয়। |
| **Inheritance** | Full Inheritance সাপোর্ট করে (C++, C#-এ)। | সাধারণত Inheritance সাপোর্ট করে না (বা সীমিত)। |
| **Use Case** | জটিল, বড় object যেগুলোর identity এবং behavior গুরুত্বপূর্ণ (যেমন: `User`, `Order`)। | ছোট, lightweight, immutable data group করার জন্য (যেমন: `Point { x, y }`, `Color { r, g, b }`)। |

```csharp
// C# উদাহরণ — Value Type vs Reference Type-এর পার্থক্য
struct PointStruct { public int X, Y; }
class PointClass { public int X, Y; }

PointStruct s1 = new PointStruct { X = 1, Y = 1 };
PointStruct s2 = s1;      // পুরো data কপি হলো (independent copy)
s2.X = 99;
Console.WriteLine(s1.X);  // 1 — s1 অপরিবর্তিত

PointClass c1 = new PointClass { X = 1, Y = 1 };
PointClass c2 = c1;       // শুধু reference কপি হলো
c2.X = 99;
Console.WriteLine(c1.X);  // 99 — c1-ও বদলে গেছে, কারণ c1 আর c2 একই object
```

---

## 🏷️ 3. What is the difference between a class variable and an instance variable?

- **Instance Variable:** প্রতিটি Object তৈরি হওয়ার সময় নিজের একটি আলাদা কপি পায়। এক Object-এর instance variable বদলালে অন্য Object-এর উপর কোনো প্রভাব পড়ে না।
- **Class Variable (Static Variable):** এটি Class-এর সব Object-এর মধ্যে **শেয়ার করা** হয় — মেমোরিতে এর মাত্র একটি কপি থাকে। যেকোনো একটি Object দিয়ে বদলালে সেটি সব জায়গায় প্রতিফলিত হয়।

```javascript
class User {
    static totalUsers = 0; // Class variable — সব Instance-এর মধ্যে শেয়ার্ড, একটাই কপি

    constructor(name) {
        this.name = name;        // Instance variable — প্রতিটি Object-এর নিজস্ব কপি
        User.totalUsers++;       // Class variable আপডেট করা
    }
}

const u1 = new User('Rafi');
const u2 = new User('Nadia');

console.log(u1.name);          // 'Rafi'  — শুধু u1-এর নিজস্ব
console.log(u2.name);          // 'Nadia' — শুধু u2-এর নিজস্ব
console.log(User.totalUsers);  // 2       — u1 এবং u2 উভয়ের জন্য একই, শেয়ার্ড value
```

### What is the difference between a class method and an instance method?

| বৈশিষ্ট্য | Instance Method | Class Method (Static Method) |
|---|---|---|
| **Access** | কোনো নির্দিষ্ট Object (`this`)-এর মাধ্যমে কল করতে হয়। | সরাসরি Class-এর নাম দিয়ে কল করা হয়, কোনো Object তৈরি করার প্রয়োজন নেই। |
| **`this` context** | `this` দিয়ে ওই নির্দিষ্ট Instance-এর data access করা যায়। | কোনো নির্দিষ্ট Instance-এর `this` থাকে না, শুধু Class-level data নিয়ে কাজ করে। |
| **Use Case** | Object-এর নিজস্ব data নিয়ে কাজ করার জন্য (যেমন: `user.updateProfile()`)। | Utility/Helper function, বা Class-level shared logic-এর জন্য (যেমন: `Math.random()`, `User.findByEmail()`)। |

```javascript
class User {
    static totalUsers = 0;

    constructor(name) {
        this.name = name;
        User.totalUsers++;
    }

    // Instance Method — একটি নির্দিষ্ট user-এর data নিয়ে কাজ করে
    greet() {
        return `Hi, I'm ${this.name}`;
    }

    // Class/Static Method — কোনো নির্দিষ্ট instance ছাড়াই কল করা যায়
    static getTotalUsers() {
        return User.totalUsers;
    }
}

const u1 = new User('Rafi');
console.log(u1.greet());            // Instance method — object দিয়ে কল করতে হয়েছে
console.log(User.getTotalUsers());  // Static method — সরাসরি Class দিয়ে কল করা হয়েছে
```

---

## 🔄 4. What is the difference between procedural and object-oriented programming paradigms?

| বৈশিষ্ট্য | Procedural Programming | Object-Oriented Programming |
|---|---|---|
| **কেন্দ্রবিন্দু (Focus)** | Function/Procedure — "কী করতে হবে" (Actions) নিয়ে চিন্তা করা হয়। | Object — "কে করবে" (Entities) নিয়ে চিন্তা করা হয়। |
| **Data ও Function** | সাধারণত আলাদা থাকে; Function বাইরে থেকে Data নিয়ে কাজ করে। | একসাথে একটি Object-এর ভেতরে bundled থাকে (Encapsulation)। |
| **Data Security** | Data সাধারণত global/exposed থাকে, তাই accidental পরিবর্তনের ঝুঁকি বেশি। | Data private/protected রাখা যায়, নিয়ন্ত্রিত access সম্ভব। |
| **Code Reuse** | মূলত Function call-এর মাধ্যমে হয়। | Inheritance ও Composition-এর মাধ্যমে আরও শক্তিশালীভাবে হয়। |
| **উপযুক্ত ক্ষেত্র** | ছোট, straightforward, linear script (যেমন: automation script, simple calculation)। | বড়, জটিল এবং evolving system (যেমন: Enterprise application, GUI, Game engine)। |
| **উদাহরণ ভাষা** | C, Pascal | Java, C++, Python, JavaScript (ES6+) |

### Can you give an example of the same problem solved procedurally vs. with OOP?

ধরা যাক আমাদের একটি Library System-এ বইয়ের ধার (borrow) দেওয়ার হিসাব রাখতে হবে।

```javascript
// ==============================
// Procedural Approach
// ==============================
// Data এবং Logic সম্পূর্ণ আলাদা, প্রতিটি ফাংশন array-কে সরাসরি manipulate করছে

let books = [
    { title: 'Clean Code', isBorrowed: false },
    { title: 'The Pragmatic Programmer', isBorrowed: false },
];

function borrowBook(bookList, title) {
    const book = bookList.find(b => b.title === title);
    if (!book || book.isBorrowed) throw new Error('Not available');
    book.isBorrowed = true;
}

function returnBook(bookList, title) {
    const book = bookList.find(b => b.title === title);
    if (book) book.isBorrowed = false;
}

borrowBook(books, 'Clean Code');
// সমস্যা: 'books' array যেকোনো জায়গা থেকে সরাসরি বদলানো সম্ভব,
// এবং নতুন ধরনের বই (e.g. E-Book) যোগ করতে হলে সব ফাংশন আবার লিখতে হতে পারে।
```

```javascript
// ==============================
// OOP Approach
// ==============================
// Data (books) এবং Behavior (borrow/return logic) একসাথে encapsulated

class Book {
    #isBorrowed = false;

    constructor(title) {
        this.title = title;
    }

    borrow() {
        if (this.#isBorrowed) throw new Error('Not available');
        this.#isBorrowed = true;
    }

    returnBook() {
        this.#isBorrowed = false;
    }

    isAvailable() {
        return !this.#isBorrowed;
    }
}

class Library {
    #books = [];

    addBook(book) {
        this.#books.push(book);
    }

    findByTitle(title) {
        return this.#books.find(b => b.title === title);
    }
}

const library = new Library();
library.addBook(new Book('Clean Code'));
library.addBook(new Book('The Pragmatic Programmer'));

const book = library.findByTitle('Clean Code');
book.borrow();
console.log(book.isAvailable()); // false

// সুবিধা: প্রতিটি Book নিজের state নিজেই সামলায় (Encapsulation),
// এবং ভবিষ্যতে `class EBook extends Book` লিখে নতুন behavior
// যোগ করা যাবে পুরনো কোড না ভেঙেই (Inheritance/Polymorphism)।
```

---
