---
sidebar_position: 8
title: 'Java OOP'
---

# 8. Java-Specific OOP Interview Questions

## 79. Why does Java not support multiple inheritance of classes?

Java ইচ্ছাকৃতভাবে একটি class-কে একসাথে **একাধিক class থেকে inherit** করার অনুমতি দেয় না — একটি class শুধু একটি `extends` clause-ই পেতে পারে। এর মূল কারণ হলো multiple class inheritance বিখ্যাত **diamond problem** তৈরি করে: যদি class `B` এবং `C` উভয়েই class `A` থেকে inherit করে এবং তারা `A`-এর একটি method override করে, তারপর class `D` যদি `B` ও `C` উভয় থেকেই inherit করার চেষ্টা করে, তাহলে compiler-এর কাছে অস্পষ্ট থেকে যায় `D` আসলে `B`-এর version নেবে নাকি `C`-এর version নেবে।

```text
      A
     / \
    B   C     <- B এবং C দুজনেই A-এর একটি method override করেছে
     \ /
      D       <- D কোন version পাবে? B-এর নাকি C-এর?
```

Java-এর designer-রা ভাষার simplicity এবং predictability বজায় রাখার জন্য সচেতনভাবে এই ambiguity সম্পূর্ণভাবে এড়িয়ে যাওয়ার সিদ্ধান্ত নিয়েছিলেন, যেখানে C++-এর মতো ভাষা multiple class inheritance অনুমতি দেয় কিন্তু তার সাথে জটিল resolution rule (যেমন explicit scope resolution, virtual inheritance) যোগ করতে বাধ্য হয়েছে।

### How do interfaces provide an alternative?

Java একটি class-কে **একাধিক interface** implement করার অনুমতি দেয়, যদিও একাধিক class extend করতে পারে না:

```java
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable { // একাধিক interface — সমস্যাহীন
    public void fly() { /* ... */ }
    public void swim() { /* ... */ }
}
```

এটি নিরাপদ কারণ (Java 8-এর আগে) interface-এ শুধু method signature থাকতো, কোনো implementation বা instance state থাকতো না — তাই দুটি interface-এ একই method signature থাকলেও কোনো conflicting implementation-এর প্রশ্ন আসতো না, `Duck` class-কেই সেই method-এর একটি মাত্র implementation দিতে হতো। ফলে interface দিয়ে "multiple capability inherit করা" (is-capable-of সম্পর্ক) সম্ভব হয়, কিন্তু "multiple implementation inherit করা" (diamond সমস্যার মূল কারণ) সম্ভব হয় না।

### How does Java avoid the traditional diamond problem with classes?

Java 8-এর পর interface-এ `default` method যোগ হওয়ায় তত্ত্বগতভাবে একটি নতুন diamond-এর মতো পরিস্থিতি তৈরি হতে পারে — যদি দুটি interface একই signature-এর `default` method দেয় এবং একটি class দুটিই implement করে:

```java
interface A {
    default void greet() { System.out.println("Hello from A"); }
}

interface B {
    default void greet() { System.out.println("Hello from B"); }
}

class C implements A, B {
    // Compile error: এখানে C-কে অবশ্যই greet() override করতে হবে,
    // নাহলে "class C inherits unrelated defaults for greet()" error দেখাবে
    public void greet() {
        A.super.greet(); // explicitly কোনটা চাই তা বেছে নেওয়া যায়
    }
}
```

এখানে Java compile-time-এই এই ambiguity **detect করে এবং জোর করে**, developer-কে explicitly resolve করতে বাধ্য করে — এটি C++-এর মতো silently বা জটিল runtime resolution rule দিয়ে সমাধানের চেষ্টা করে না। এই approach-টি Java-এর সামগ্রিক দর্শনের সাথে মেলে: ambiguous পরিস্থিতি compiler-লেভেলেই ধরে ফেলা, runtime surprise-এর ওপর নির্ভর না করা।

---

## 80. What is the difference between `==` and `equals()` in Java?

### What is reference equality?

`==` operator, primitive type-এর জন্য value compare করে, কিন্তু **object reference**-এর জন্য এটি **identity/reference equality** check করে — অর্থাৎ দুটি variable কি একই memory location-এ থাকা একই object-কে নির্দেশ করছে কিনা।

```java
String a = new String("hello");
String b = new String("hello");

System.out.println(a == b); // false — দুটি ভিন্ন object, যদিও content একই
```

`a` এবং `b` দুটি আলাদা `String` object, প্রতিটি নিজের memory address-এ তৈরি হয়েছে — `new String(...)` জোর করে একটি নতুন object তৈরি করে, এমনকি content একই হলেও। তাই `==` এখানে `false` return করে, কারণ এটি জিজ্ঞেস করছে "এরা কি একই object?", "এদের content কি একই?" নয়।

### What is logical/value equality?

`.equals()` method, default implementation-এ (যেটা `Object` class থেকে আসে) `==`-এর মতোই আচরণ করে, কিন্তু বেশিরভাগ class (যেমন `String`, wrapper class, বা user-defined class) এই method **override** করে **content/value equality** check করার জন্য।

```java
String a = new String("hello");
String b = new String("hello");

System.out.println(a.equals(b)); // true — content সমান
```

`String` class `.equals()` override করেছে যাতে এটি character-by-character content compare করে, object identity নয়। এই পার্থক্য মনে রাখার সহজ নিয়ম: **`==` জিজ্ঞেস করে "এরা কি একই object?", `.equals()` জিজ্ঞেস করে "এদের মান কি একই?"**। User-defined class-এ যদি meaningful value-based equality দরকার হয় (যেমন দুটি `Point(2, 3)` object-কে সমান বলে গণ্য করতে চাই), তাহলে সেই class-এ `.equals()` explicitly override করতে হবে — নাহলে default `Object.equals()` শুধু reference compare করবে, যা প্রায়ই অপ্রত্যাশিত ফলাফল দেয়।

---

## 81. What is the `equals()` and `hashCode()` contract in Java?

Java-তে `equals()` এবং `hashCode()`-এর মধ্যে একটি **আনুষ্ঠানিক চুক্তি (contract)** আছে, যা `Object` class-এর documentation-এ নির্ধারিত: **যদি দুটি object `.equals()` অনুযায়ী সমান হয়, তাহলে তাদের `.hashCode()`-ও অবশ্যই একই মান দিতে হবে।** (উল্টোটা বাধ্যতামূলক নয় — দুটি অসমান object-এর hash code একই হতে পারে, একে **hash collision** বলা হয়, এবং এটি স্বাভাবিক।)

```java
class Point {
    private final int x, y;

    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Point)) return false;
        Point p = (Point) other;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y); // equals()-এ ব্যবহৃত একই field দিয়ে hash তৈরি
    }
}
```

লক্ষণীয় যে `hashCode()` ঠিক সেই field-গুলোই ব্যবহার করছে যা `equals()`-এও ব্যবহৃত হয়েছে (`x` এবং `y`) — এটি contract বজায় রাখার মূল কৌশল: যদি দুটি `Point` object একই `x`, `y` রাখে (তাই `equals()` অনুযায়ী সমান), তাহলে `Objects.hash(x, y)`-ও নিশ্চিতভাবে একই মান দেবে।

### Why should equal objects return the same hash code?

`HashMap`, `HashSet`-এর মতো hash-based collection প্রথমে একটি object-এর `hashCode()` ব্যবহার করে সেটি কোন "bucket"-এ রাখা হবে তা নির্ধারণ করে, তারপর সেই bucket-এর ভেতরে `equals()` দিয়ে exact match খুঁজে বের করে। যদি দুটি সমান object ভিন্ন hash code দেয়, তাহলে তারা ভিন্ন bucket-এ চলে যেতে পারে — এবং একটি object দিয়ে `HashMap`-এ lookup করলে, যদিও একটি "logically equal" entry আসলে map-এ আছে, সেটি **খুঁজেই পাওয়া যাবে না**, কারণ lookup ভুল bucket-এ খোঁজা হবে।

### What problems occur when the contract is violated?

যদি একটি class শুধু `equals()` override করে কিন্তু `hashCode()` override না করে (বা ভুলভাবে override করে যাতে সমান object ভিন্ন hash দেয়), তাহলে বেশ কয়েকটি সূক্ষ্ম কিন্তু গুরুতর bug তৈরি হয়:

- **HashMap/HashSet-এ "hারিয়ে যাওয়া" entry:** একটি object দিয়ে `map.put(key, value)` করার পর, সেই একই "logically equal" key দিয়ে `map.get(key)` করলে `null` পাওয়া যেতে পারে, কারণ lookup ভুল bucket-এ খোঁজে।
- **Duplicate entries in a Set:** `HashSet`-এ দুটি "logically equal" object যোগ করলে, contract না মানলে দুটোই যোগ হয়ে যেতে পারে (deduplication কাজ করবে না), কারণ `Set` প্রথমে hash bucket দিয়ে filter করে, তারপর `equals()` চেক করে — ভুল bucket-এ থাকলে `equals()` চেক-ই হবে না।
- **অসামঞ্জস্যপূর্ণ আচরণ collection ভেদে:** `List`-এ কাজ করা কোড (যা linear `equals()` scan ব্যবহার করে) ঠিকঠাক চলতে পারে, কিন্তু একই object `HashMap`/`HashSet`-এ ব্যবহার করলে ভেঙে যেতে পারে — এই ধরনের bug debug করা কঠিন কারণ এটি শুধু নির্দিষ্ট collection type-এ প্রকাশ পায়।

এই কারণে IDE-গুলো (এবং Java-এর `record` টাইপ) সাধারণত `equals()` এবং `hashCode()` একসাথে জেনারেট করে, এবং একটি স্বতঃসিদ্ধ নিয়ম হলো: **যদি `equals()` override করো, `hashCode()`-ও অবশ্যই override করো, এবং দুটোই একই field-সেট ব্যবহার করে বানাও।**

---

## 82. What are the important methods inherited from Java's `Object` class?

Java-তে প্রতিটি class implicitly `java.lang.Object` থেকে inherit করে (এমনকি explicitly `extends` না লিখলেও), তাই কিছু method সব object-এই স্বয়ংক্রিয়ভাবে available থাকে। সবচেয়ে গুরুত্বপূর্ণগুলো হলো: `equals()`, `hashCode()`, `toString()`, `getClass()`, এবং (concurrency-সংক্রান্ত) `wait()`/`notify()`/`notifyAll()`।

### What are `equals()`, `hashCode()`, `toString()`, and `getClass()` used for?

- **`equals(Object other)`:** default-এ reference equality (`==`-এর সমতুল্য) দেয়, কিন্তু value-based comparison দরকার হলে override করা হয় (দেখুন প্রশ্ন ৮০ ও ৮১)।
- **`hashCode()`:** একটি `int` hash value দেয় যা hash-based collection (`HashMap`, `HashSet`) ব্যবহার করে object-কে দ্রুত bucket-এ organize করতে। `equals()` override করলে এটিও একসাথে override করা বাধ্যতামূলক (contract অনুযায়ী)।
- **`toString()`:** object-এর একটি human-readable string representation দেয়। Default implementation সাধারণত `ClassName@hexHashCode`-এর মতো একটি খুব কম তথ্যবহুল string দেয়:

  ```java
  class Point {
      private final int x, y;
      // ... constructor ...

      @Override
      public String toString() {
          return "Point(" + x + ", " + y + ")"; // override না করলে: Point@1b6d3586
      }
  }
  ```

  Debugging, logging, এবং console output-এ readable তথ্য দেখানোর জন্য প্রায় সব meaningful class-এই `toString()` override করা একটি common ও ভালো practice।

- **`getClass()`:** object-এর actual **runtime class** ফেরত দেয় (একটি `Class<?>` object হিসেবে), এমনকি যদি সেই object একটি parent type-এর reference দিয়ে ধরা থাকে। এটি reflection, logging, বা runtime type-checking-এ ব্যবহৃত হয় — যেমন `equals()`-এর implementation-এ প্রায়ই `other.getClass() == this.getClass()` চেক করা হয় নির্দিষ্ট class match নিশ্চিত করতে (`instanceof`-এর একটি বিকল্প, যেটা subclass-কেও অনুমতি দেয়, `getClass()` comparison exact match চায়)।

---

## 83. Can static, private, or final methods be overridden in Java?

সংক্ষেপে: **না, এই তিন ধরনের কোনো method-ই traditional অর্থে override করা যায় না** — যদিও প্রতিটির কারণ ভিন্ন, এবং `static` method-এর ক্ষেত্রে একটি ভিন্ন (এবং প্রায়ই বিভ্রান্তিকর) আচরণ ঘটে যাকে **method hiding** বলা হয়।

- **`static` method:** Override করা যায় না, কিন্তু subclass একই signature-এর একটি static method declare করতে পারে — এটিকে **hiding** বলা হয়, override নয়।
- **`private` method:** Subclass-এর কাছে দৃশ্যমানই নয়, তাই override করার প্রশ্নই আসে না। Subclass যদি একই signature-এর একটি method লেখে, সেটি সম্পূর্ণ নতুন, unrelated একটি method।
- **`final` method:** ভাষা explicitly override করা **নিষিদ্ধ** করে — subclass চেষ্টা করলে compile-time error হয়।

### What happens when a subclass declares a static method with the same signature?

```java
class Animal {
    static void identify() { System.out.println("I am an Animal"); }
}

class Dog extends Animal {
    static void identify() { System.out.println("I am a Dog"); } // override নয়, hiding
}

Animal a = new Dog();
a.identify(); // "I am an Animal" ছাপায় — reference-এর static (compile-time) type ব্যবহৃত হয়!
```

এখানে গুরুত্বপূর্ণ পার্থক্যটি হলো: instance method-এর ক্ষেত্রে (polymorphism) call-টি **runtime-এ object-এর actual type** অনুযায়ী resolve হয় (dynamic dispatch), কিন্তু static method-এর call **compile-time-এ reference-এর declared type** অনুযায়ী resolve হয় (static binding) — কারণ static method call-এর জন্য কোনো actual object/receiver দরকারই হয় না, এটি নিছক class-এর সাথে সংযুক্ত একটি function call, যা compiler-ই আগে থেকে ঠিক করে ফেলে কোনটা call হবে।

### Why are private methods not normally overridden?

Override করার পূর্বশর্ত হলো method-টি subclass-এর কাছে visible/accessible হতে হবে, যাতে subclass সেটিকে "replace" করতে পারে এবং polymorphic call সেই replacement খুঁজে পায়। `private` method definition অনুযায়ী শুধু declaring class-এর ভেতরেই দৃশ্যমান — subclass-এর কাছে এর অস্তিত্বই "invisible"। তাই যদি একটি subclass একই নামের ও signature-এর একটি method declare করে, সেটি parent-এর private method-কে override করছে না — এটি সম্পূর্ণ আলাদা, নতুন একটি method, যার সাথে parent-এর private method-এর কোনো polymorphic সম্পর্ক নেই (এবং `@Override` annotation ব্যবহার করলে compile error দেখাবে, কারণ compiler কোনো override-যোগ্য method খুঁজে পাবে না)।

---

## 84. What kinds of methods can a Java interface contain?

আধুনিক Java (8 এবং তার পরবর্তী ভার্সন) interface-এ চার ধরনের method থাকতে পারে: **abstract** (কোনো body নেই), **default** (একটি default implementation আছে), **static** (interface-এর সাথে যুক্ত utility method), এবং **private** (Java 9+ থেকে, শুধু interface-এর নিজের default/static method-গুলোর মধ্যে shared helper logic-এর জন্য)।

```java
interface PaymentProcessor {
    // abstract method — implementer-কে অবশ্যই দিতে হবে
    PaymentResult process(Money amount);

    // default method — override না করলে এই implementation ব্যবহৃত হবে
    default PaymentResult processWithLogging(Money amount) {
        log(amount);
        return process(amount);
    }

    // static method — interface নাম দিয়ে সরাসরি call হয়, instance দরকার নেই
    static PaymentProcessor noOp() {
        return amount -> PaymentResult.skipped();
    }

    // private method (Java 9+) — শুধু interface-এর ভেতরে ব্যবহারযোগ্য helper
    private void log(Money amount) {
        System.out.println("Processing: " + amount);
    }
}
```

### What are abstract, default, static, and private interface methods?

- **Abstract:** ঐতিহ্যবাহী interface method — শুধু একটি signature, কোনো body নেই। Implementing class-কে অবশ্যই এটি সংজ্ঞায়িত করতে হবে।
- **Default:** একটি body-সহ method, যা implementing class override না করলে ব্যবহৃত হয়। এটি interface-এ backward-compatible নতুন method যোগ করার সুযোগ দেয় (দেখুন নিচের প্রশ্ন)।
- **Static:** interface-এর সাথে যুক্ত একটি utility method, যা কোনো implementing instance ছাড়াই সরাসরি `InterfaceName.method()` দিয়ে call হয় — অনেকটা একটি class-এর static method-এর মতো, কিন্তু এখানে সেটি interface-এর namespace-এ থাকে (যেমন factory method তৈরি করতে)।
- **Private (Java 9+):** interface-এর ভেতরের default/static method-গুলোর মধ্যে code duplication কমাতে ব্যবহৃত হয় — এটি বাইরে থেকে (implementing class বা caller থেকে) দেখা বা call করা যায় না, শুধু interface-এর নিজের অন্য method-এর ভেতর থেকেই call করা যায়।

### Why were default methods introduced?

Default method Java 8-এ প্রধানত একটি নির্দিষ্ট backward-compatibility সমস্যা সমাধানের জন্য চালু করা হয়েছিল: **কীভাবে একটি বহুল-ব্যবহৃত interface-এ নতুন method যোগ করা যায়, বিদ্যমান সব implementing class ভেঙে না দিয়ে?**

Default method আসার আগে, `List` interface-এ একটি নতুন method (যেমন `forEach()`) যোগ করলে, `List` implement করা প্রতিটি existing class-এ (developer-দের নিজেদের কোড সহ, third-party library সহ) সেই নতুন method বাধ্যতামূলকভাবে implement করতে হতো, নাহলে compile error হতো — যা Java-এর বিশাল ecosystem জুড়ে একটি বিরাট breaking change তৈরি করত। Default method এই সমস্যা সমাধান করে: interface-এ নতুন method যোগ করার সময় একটি sensible default implementation দেওয়া যায়, যাতে existing implementing class-গুলো কোনো পরিবর্তন ছাড়াই compile হতে থাকে (তারা automatically default behavior পায়), এবং শুধু যারা নতুন, customized behavior চায় তারাই সেটি override করে। এটি মূলত Java 8-এর Stream API এবং lambda-friendly method (যেমন `Collection.stream()`, `List.forEach()`) চালু করার জন্যই প্রয়োজনীয় হয়ে পড়েছিল।

---

## 85. What is the difference between `final`, `finally`, and `finalize()` in Java?

এই তিনটি শব্দ দেখতে একই রকম হলেও তাদের উদ্দেশ্য সম্পূর্ণ ভিন্ন এবং একটি সাধারণ বিভ্রান্তির উৎস — এদের একে অপরের সাথে কোনো সরাসরি সম্পর্ক নেই।

| শব্দ | ধরন | উদ্দেশ্য |
|---|---|---|
| `final` | keyword/modifier | Variable-কে reassign-অযোগ্য, method-কে override-অযোগ্য, বা class-কে extend-অযোগ্য করে |
| `finally` | control-flow block | `try`-এর সাথে ব্যবহৃত হয়, exception ঘটুক বা না ঘটুক — নিশ্চিতভাবে execute হয় |
| `finalize()` | `Object`-এর একটি instance method | (ঐতিহাসিকভাবে) garbage collector object destroy করার আগে call করত |

```java
final int MAX = 100; // final variable — পুনরায় assign করা যাবে না

try {
    riskyOperation();
} finally {
    cleanup(); // exception হোক বা না হোক, এই block অবশ্যই চলবে
}
```

### Why is `finalize()` deprecated/obsolete for resource management?

`finalize()` মূলত এই idea নিয়ে ডিজাইন করা হয়েছিল যে garbage collector একটি object-কে reclaim করার ঠিক আগে সেই object-এর `finalize()` method call করবে, যাতে সেখানে file handle বন্ধ করা, network connection ছেড়ে দেওয়া ইত্যাদি "cleanup" কাজ করা যায়। কিন্তু বাস্তবে এই approach-এ গুরুতর সমস্যা ছিল, যার কারণে Java 9-এ এটি **deprecated** করা হয় এবং পরবর্তী ভার্সনে সরিয়ে ফেলার পরিকল্পনা করা হয়:

- **Timing অনিশ্চিত:** garbage collector কখন (বা আদৌ) চলবে তার কোনো guarantee নেই — একটি object তৈরির পর memory থেকে reclaim হতে কয়েক মিলিসেকেন্ড থেকে অনেকক্ষণ (বা program শেষ হওয়া পর্যন্ত কখনোই না) লাগতে পারে। ফলে `finalize()`-এর ওপর নির্ভর করে resource cleanup করলে, resource "কখন" মুক্ত হবে তা predict করা অসম্ভব — file handle বা connection অনির্দিষ্টকাল খোলা থেকে যেতে পারে।
- **Performance overhead:** `finalize()`-যুক্ত object-গুলো normal garbage collection-এর তুলনায় বেশি ধীরে reclaim হয়, কারণ GC-কে অতিরিক্ত bookkeeping করতে হয়।
- **Exception silently গিলে ফেলা:** `finalize()`-এর ভেতরে exception হলে, সেটি সাধারণত silently ignore হয়ে যায়, যা bug লুকিয়ে রাখতে পারে।
- **Object "পুনরুজ্জীবিত" হওয়ার সম্ভাবনা:** `finalize()`-এর ভেতর থেকে object-টি আবার একটি live reference-এ assign করা সম্ভব ("resurrection"), যা GC-এর behavior-কে জটিল এবং অনির্দেশ্য করে তোলে।

আধুনিক Java resource management-এর জন্য এর বদলে **`try-with-resources`** (`AutoCloseable` interface-এর সাথে) ব্যবহার করার পরামর্শ দেয়, যা deterministic, immediate cleanup guarantee করে:

```java
try (FileInputStream file = new FileInputStream("data.txt")) {
    // file ব্যবহার করা হচ্ছে
} // block শেষ হওয়ার সাথে সাথেই file.close() স্বয়ংক্রিয়ভাবে call হয়, GC-এর অপেক্ষা করতে হয় না
```

---

## 86. How do you create an immutable class in Java?

Java-তে একটি সত্যিকারের immutable class তৈরি করতে সাধারণত নিচের নিয়মগুলো একসাথে মানতে হয়:

```java
final class Point {                          // 1. class-কে final করা (subclass দিয়ে mutation যোগ করা রোধ)
    private final int x;                      // 2. field-গুলো private ও final
    private final int y;

    public Point(int x, int y) {              // 3. constructor-এই সম্পূর্ণ state initialize করা
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }           // 4. শুধু getter, কোনো setter নেই
    public int getY() { return y; }

    public Point translate(int dx, int dy) {  // 5. "modifier" method নতুন object return করে
        return new Point(x + dx, y + dy);      //    original object অপরিবর্তিত থাকে
    }
}
```

সম্পূর্ণ checklist:

1. **Class-কে `final` করা** — যাতে কোনো subclass তৈরি করে সেই subclass-এ mutable behavior যোগ করা না যায় (একটি malicious বা careless subclass অন্যথায় immutability-র প্রতিশ্রুতি ভেঙে দিতে পারত)।
2. **সব field `private` ও `final` করা** — যাতে বাইরে থেকে সরাসরি access বা reassignment না করা যায়।
3. **শুধুমাত্র constructor-এই সম্পূর্ণ, valid state তৈরি করা** — object তৈরির পর তার কোনো অংশে "আংশিক" state থাকা উচিত নয়।
4. **কোনো setter method না দেওয়া** — শুধু getter (read-only access) দেওয়া।
5. **Mutable field থাকলে defensive copy করা** — যদি কোনো field একটি mutable object (যেমন `Date`, `List`, বা array) reference করে, তাহলে constructor-এ receive করার সময় এবং getter-এ return করার সময় উভয় জায়গাতেই একটি copy তৈরি করা উচিত, নাহলে বাইরের কোড সেই mutable object-এর মাধ্যমে "ভেতরে ঢুকে" internal state বদলে দিতে পারবে (যদিও `Point`-এর ভেতরের কোনো field mutable নয়, এই নিয়মটি এমন class-এর ক্ষেত্রে প্রযোজ্য যাদের mutable field থাকে)।
6. **"Modifier"-এর মতো দেখতে যেকোনো method নতুন object return করা** — যেমন `translate()`, যা `x`/`y` সরাসরি বদলায় না, বরং একটি নতুন `Point` তৈরি করে ফেরত দেয়।

### Why are `String` and many value-like types immutable?

`String`, wrapper class (`Integer`, `Long`, ইত্যাদি), এবং `LocalDate`-এর মতো Java-এর অনেক core "value-like" type ইচ্ছাকৃতভাবে immutable করে রাখা হয়েছে, বেশ কয়েকটি কারণে:

- **String pooling/interning:** Java একটি "string constant pool" রাখে, যেখানে একই literal value একাধিকবার ব্যবহার হলে একই object পুনরায় ব্যবহার করা হয় (মেমরি বাঁচাতে)। এটি নিরাপদ শুধুমাত্র কারণ `String` immutable — যদি কেউ একটি shared `String` object মিউটেট করতে পারতো, তাহলে সেটি সেই একই object ব্যবহারকারী প্রতিটি অন্য variable-কেও অপ্রত্যাশিতভাবে বদলে দিত।
- **Hash-based collection-এ নিরাপদ ব্যবহার:** যেহেতু `String` প্রায়ই `HashMap` key হিসেবে ব্যবহৃত হয়, immutability নিশ্চিত করে যে key তৈরি হওয়ার পর তার `hashCode()` কখনো বদলাবে না — নাহলে key যোগ করার পর তার hash বদলে গেলে map-এ সেটি "হারিয়ে" যেতে পারত (দেখুন প্রশ্ন ৮১-এর আলোচনা)।
- **Thread safety:** Immutable object multiple thread-এর মধ্যে কোনো synchronization ছাড়াই নিরাপদে share করা যায়, কারণ কোনো thread-ই সেটির state বদলাতে পারে না।
- **Security:** `String`-এর মতো type প্রায়ই sensitive context-এ ব্যবহৃত হয় (যেমন file path, network address, class name reflection-এ) — যদি `String` mutable হতো, তাহলে একটি method-এ argument হিসেবে পাস করার পর caller সেটি পেছনে থেকে বদলে দিতে পারত, যা security-sensitive validation bypass করার একটি সম্ভাব্য পথ খুলে দিত।

এই কারণগুলো একসাথে immutability-কে শুধু একটি "nice-to-have" ডিজাইন পছন্দ নয়, বরং Java-এর মৌলিক infrastructure (string pooling, hash collection, security model)-এর একটি প্রয়োজনীয় ভিত্তি করে তোলে।

---

## 87. What are upcasting and downcasting in Java?

**Upcasting** হলো একটি subtype object-কে তার supertype (parent class বা implemented interface)-এর reference হিসেবে treat করা। **Downcasting** হলো এর উল্টো — একটি supertype reference-কে আবার তার নির্দিষ্ট subtype-এ ফিরিয়ে নেওয়া।

```java
class Animal {}
class Dog extends Animal {
    void bark() { System.out.println("Woof!"); }
}

Animal animal = new Dog();      // upcasting — implicit, সবসময় নিরাপদ

Dog dog = (Dog) animal;         // downcasting — explicit cast লাগে, সবসময় নিরাপদ নয়
dog.bark();
```

Upcasting সবসময় **implicit/automatic এবং নিরাপদ**, কারণ একটি `Dog` object সবসময়ই একটি `Animal` (is-a সম্পর্ক অনুযায়ী) — কোনো তথ্য হারানোর ভয় নেই, শুধু reference-এর "দৃষ্টিভঙ্গি" সংকীর্ণ (`Animal`-এর দৃষ্টিতে) হয়ে যায়, যদিও underlying object একই থাকে (এখনও একটি `Dog`)। Downcasting **explicit cast syntax** দরকার হয় এবং **compile-time-এ guaranteed নিরাপদ নয়** — কারণ একটি `Animal` reference আসলে একটি `Dog`, `Cat`, বা অন্য কোনো `Animal` subtype-এর object ধরে থাকতে পারে, এবং সেটা compile-time-এ জানার কোনো উপায় নেই।

### What is `instanceof` used for?

`instanceof` operator runtime-এ একটি object-এর actual type check করে, downcast করার আগে সেটি নিরাপদ কিনা যাচাই করার জন্য ব্যবহৃত হয়:

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal; // এখন এই cast নিরাপদ, কারণ আমরা আগেই check করেছি
    dog.bark();
}

// আধুনিক Java (16+) — pattern matching দিয়ে check এবং cast একসাথে:
if (animal instanceof Dog dog) {
    dog.bark(); // আলাদা cast লেখার দরকার নেই, dog variable ইতিমধ্যেই Dog টাইপ
}
```

`instanceof` ব্যবহার করে "guard" করা downcasting-এর সবচেয়ে সাধারণ ও নিরাপদ প্র্যাকটিস — এটি runtime error এড়াতে সাহায্য করে, যেহেতু compiler নিজে থেকে downcast-এর নিরাপত্তা নিশ্চিত করতে পারে না।

### What happens when an invalid downcast is attempted?

যদি একটি downcast করার চেষ্টা করা হয় যেখানে actual runtime object সেই target type-এর নয়, তাহলে Java একটি **`ClassCastException`** throw করে, runtime-এ:

```java
Animal animal = new Animal(); // এটা আসলে একটি plain Animal, Dog নয়

Dog dog = (Dog) animal; // compile হয়ে যায় (compiler শুধু hierarchy check করে),
                         // কিন্তু runtime-এ ClassCastException throw করে
```

এখানে compiler কোনো error দেয় না, কারণ `Animal`-থেকে-`Dog`-এ cast করাটা **type hierarchy অনুযায়ী সম্ভব** (`Dog` একটি `Animal`-এর subtype) — compiler শুধু এটুকু নিশ্চিত করে যে cast-টি hierarchy-গতভাবে অর্থবহ, কিন্তু runtime-এ **actual object** টি সত্যিই `Dog`-এর instance কিনা তা যাচাই করে না। এই যাচাইটা শুধু runtime-এই সম্ভব, কারণ তখনই object-এর প্রকৃত (actual) type জানা যায়। এই কারণেই downcast করার আগে `instanceof` দিয়ে check করা এত গুরুত্বপূর্ণ একটি practice — এটি একটি সম্ভাব্য runtime crash-কে একটি নিয়ন্ত্রিত, predictable `if` branch-এ রূপান্তরিত করে।

---