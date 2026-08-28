---
sidebar_position: 7
title: 'Patterns'
---

# 7. Important Design Patterns

## 70. What are design patterns?

**Design pattern** হলো একটি recurring design problem-এর জন্য প্রমাণিত, reusable solution template — এটি কোনো ready-made code নয়, বরং একটি vocabulary এবং structure যা বারবার দেখা সমস্যাগুলো সমাধান করতে সাহায্য করে। যখন একই ধরনের সমস্যা (যেমন "একটি object-এর মাত্র একটি instance থাকা উচিত", বা "runtime-এ algorithm বদলানো দরকার") বারবার বিভিন্ন system-এ দেখা যায়, তখন একটি well-known solution structure হিসেবে সেটিকে নামসহ document করা হয়, যাতে developer-রা একই vocabulary ব্যবহার করে দ্রুত communicate করতে পারেন — "এখানে Strategy pattern ব্যবহার করি" বললে পুরো solution structure বোঝানোর জন্য একটি লম্বা ব্যাখ্যার দরকার হয় না।

Design pattern-এর ধারণা মূলত **"Design Patterns: Elements of Reusable Object-Oriented Software"** বইটি (Gang of Four / GoF) থেকে জনপ্রিয় হয়, যেখানে ২৩টি classic pattern তিনটি category-তে ভাগ করা হয়েছিল।

### What is the difference between creational, structural, and behavioral patterns?

GoF pattern-গুলোকে তিনটি বড় category-তে ভাগ করা হয়, প্রতিটি ভিন্ন ধরনের সমস্যা সমাধান করে:

| Category | মূল প্রশ্ন | উদাহরণ pattern |
|---|---|---|
| **Creational** | Object কীভাবে তৈরি হবে? | Singleton, Factory Method, Abstract Factory, Builder, Prototype |
| **Structural** | Object/class-গুলো কীভাবে একসাথে যুক্ত/compose হবে? | Adapter, Decorator, Facade, Composite, Proxy |
| **Behavioral** | Object-গুলোর মধ্যে responsibility ও communication কীভাবে ভাগ হবে? | Strategy, Observer, State, Template Method, Command |

**Creational pattern** object-instantiation-এর complexity লুকিয়ে caller-কে "কীভাবে object তৈরি হলো" থেকে আলাদা রাখে। **Structural pattern** বিদ্যমান class/object-গুলোকে নতুনভাবে সাজিয়ে বড় structure তৈরি করে, প্রায়ই legacy code-এর সাথে নতুন code-কে মেলাতে ব্যবহৃত হয়। **Behavioral pattern** runtime-এ object-গুলোর মধ্যে কাজ ও responsibility কীভাবে বণ্টন এবং communicate হবে তা নিয়ন্ত্রণ করে।

### Why should patterns not be used just for the sake of using them?

Pattern নিজে কোনো objective ভালো measure নয় — এটি একটি **means**, **goal** নয়। একজন developer যদি "আমি একটি design pattern ব্যবহার করেছি" এই সন্তুষ্টির জন্য জোর করে কোনো simple সমস্যায় Factory বা Strategy বসিয়ে দেন, তাহলে সেটি code-এ unnecessary indirection, extra class, এবং বাড়তি cognitive load যোগ করে — এই সমস্যাকে অনেক সময় **over-engineering** বা "pattern fever" বলা হয়।

একটি ভালো নিয়ম হলো: pattern তখনই ব্যবহার করা উচিত যখন সেই নির্দিষ্ট সমস্যা (variation point, extensibility প্রয়োজন, বা coupling সমস্যা) বাস্তবেই উপস্থিত — সমস্যাটি প্রথমে চিহ্নিত করতে হবে, তারপর সেই সমস্যার জন্য উপযুক্ত pattern বেছে নিতে হবে, উল্টোটা নয়। যেমন যদি একটি application-এ মাত্র একটি payment method আছে এবং ভবিষ্যতে আরও যোগ হওয়ার কোনো ইঙ্গিত নেই, তাহলে সেখানে আগে থেকেই Strategy pattern বসানো অপ্রয়োজনীয় complexity — একটি simple `if/else`-ই যথেষ্ট, প্রয়োজন হলে পরে refactor করা যাবে।

---

## 71. What is the Singleton pattern?

**Singleton pattern** নিশ্চিত করে যে একটি class-এর সম্পূর্ণ application lifecycle-এ মাত্র একটি instance তৈরি হবে, এবং সেই instance-এ একটি well-known global access point থাকবে।

```java
final class ConfigurationManager {
    private static final ConfigurationManager INSTANCE = new ConfigurationManager();

    private final Map<String, String> settings = new HashMap<>();

    private ConfigurationManager() { // private constructor — বাইরে থেকে new করা যাবে না
        // load settings...
    }

    static ConfigurationManager getInstance() {
        return INSTANCE;
    }

    String get(String key) {
        return settings.get(key);
    }
}
```

### How does Singleton ensure one instance?

Constructor-কে `private` করে দেওয়া হয়, যাতে ক্লাসের বাইরে থেকে কেউ `new ConfigurationManager()` লিখে সরাসরি instance তৈরি করতে না পারে। একমাত্র valid instance class-এর ভেতরেই (static field হিসেবে, বা lazy initialization-এর মাধ্যমে) তৈরি করা হয়, এবং একটি static method (`getInstance()`) সেই একই instance বারবার return করে। Multithreaded environment-এ lazy initialization করলে extra সতর্কতা দরকার হয় (যেমন double-checked locking, বা Java-তে static holder idiom / enum singleton), যাতে একাধিক thread একযোগে দুটি আলাদা instance তৈরি করে না ফেলে।

### Why is Singleton sometimes considered an anti-pattern?

Singleton প্রায়ই anti-pattern হিসেবে সমালোচিত হয় কয়েকটি কারণে:

- **Hidden dependency:** কোনো class যদি `ConfigurationManager.getInstance()` সরাসরি call করে, তাহলে সেই dependency constructor বা method signature-এ visible হয় না — code পড়ে বোঝা যায় না যে class-টি আসলে এই singleton-এর ওপর নির্ভরশীল, যা code-কে কম explicit এবং কম testable করে তোলে।
- **Testing কঠিন হয়:** যেহেতু constructor private এবং instance global, তাই test-এর সময় একটি fake/mock implementation দিয়ে সেটি replace করা কঠিন হয়ে যায় — dependency injection-এর মাধ্যমে interface পাঠানো হলে সহজেই mock দেওয়া যেত।
- **Global mutable state:** যদি singleton-এর ভেতরে mutable data থাকে, তাহলে সেটি কার্যত একটি global variable-এর মতোই আচরণ করে, যার সমস্যাগুলো নিচে আলোচনা করা হয়েছে।
- **Hidden coupling বৃদ্ধি:** একাধিক unrelated অংশের code একই singleton-এর ওপর নির্ভর করলে, তাদের মধ্যে একটি অদৃশ্য coupling তৈরি হয় যা refactoring কঠিন করে তোলে।

এই কারণে আধুনিক design-এ singleton-এর বদলে dependency injection framework ব্যবহার করে একটি object-কে "effectively singleton" (একবারই তৈরি হয়, কিন্তু constructor দিয়ে explicitly পাস করা হয়) রাখার প্রবণতা বেশি দেখা যায়।

### What problems can global shared state create?

Global shared mutable state কয়েকটি নির্দিষ্ট সমস্যা তৈরি করে:

- **Test isolation নষ্ট হওয়া:** একটি test যদি global state পরিবর্তন করে এবং সেটি reset না করে, তাহলে পরবর্তী test সেই "leaked" state-এর ওপর নির্ভর করে ভুল ফলাফল দিতে পারে — test-গুলো একে অপরের ওপর নির্ভরশীল হয়ে পড়ে, যা flaky (মাঝেমধ্যে pass, মাঝেমধ্যে fail হওয়া) test তৈরি করে।
- **Concurrency bug:** একাধিক thread যদি একই global mutable object access/modify করে, race condition তৈরি হতে পারে, যা debug করা কঠিন এবং intermittent (মাঝেমধ্যে ঘটে এমন) bug তৈরি করে।
- **Implicit coupling:** system-এর দূরবর্তী দুটি অংশ যদি একই global state-এর ওপর নির্ভর করে, তাহলে একটি অংশে পরিবর্তন আনলে অন্য অংশে অপ্রত্যাশিত প্রভাব পড়তে পারে, এবং এই সম্পর্কটি code পড়ে সহজে ধরা যায় না।
- **Reasoning কঠিন হয়ে যাওয়া:** যেকোনো সময় global state কে বদলে দিতে পারে এমন অনেক জায়গা থাকলে, একটি নির্দিষ্ট মুহূর্তে state-এর মান predict করা কঠিন হয়ে ওঠে।

---

## 72. What is the Factory Method pattern?

**Factory Method pattern** object তৈরির logic-কে একটি dedicated method-এ সরিয়ে দেয়, যাতে caller সরাসরি `new ConcreteClass()` না লিখে একটি abstraction-এর মাধ্যমে object পায়, এবং কোন concrete class actually তৈরি হচ্ছে তা caller-এর জানার দরকার হয় না।

```java
interface Notification {
    void send(String message);
}

class EmailNotification implements Notification {
    public void send(String message) { /* SMTP logic */ }
}

class SmsNotification implements Notification {
    public void send(String message) { /* SMS gateway logic */ }
}

abstract class NotificationCreator {
    abstract Notification createNotification(); // factory method

    void notifyUser(String message) {
        Notification notification = createNotification();
        notification.send(message);
    }
}

class EmailNotificationCreator extends NotificationCreator {
    Notification createNotification() {
        return new EmailNotification();
    }
}
```

### Why use a factory instead of directly creating objects?

সরাসরি `new EmailNotification()` লিখলে caller code সেই concrete class-এর সাথে tightly coupled হয়ে যায় — ভবিষ্যতে notification type পরিবর্তন করতে চাইলে caller-এর code-ও বদলাতে হবে। Factory Method ব্যবহার করলে caller শুধু abstraction (`Notification` interface) নিয়ে কাজ করে, এবং কোন concrete implementation তৈরি হবে সেই সিদ্ধান্ত subclass-এর ওপর ছেড়ে দেওয়া যায় (এটি একটি নমুনা **"program to an interface, not an implementation"** নীতির)। এছাড়াও object তৈরির সময় জটিল conditional logic, configuration lookup, বা caching থাকলে, সেই সবকিছু factory-তে কেন্দ্রীভূত রাখা যায়, caller-কে সেই জটিলতা থেকে দূরে রাখা যায়।

### How is Factory Method different from Abstract Factory?

দুটি pattern একই সমস্যা-পরিবারের (object creation abstraction) সমাধান করে, কিন্তু scope আলাদা:

| Factory Method | Abstract Factory |
|---|---|
| একটি single method, একটি single product তৈরি করে | একটি পুরো family/set of related product তৈরি করার interface দেয় |
| সাধারণত inheritance-ভিত্তিক (subclass override করে) | সাধারণত composition-ভিত্তিক (একটি factory object পাস করা হয়) |
| উদাহরণ: `createNotification()` একটি `Notification` দেয় | উদাহরণ: `UIFactory` একসাথে matching `Button`, `Checkbox`, `Scrollbar` দেয় (যাতে সব একই theme/OS-এর হয়) |

Abstract Factory প্রায়ই একাধিক Factory Method-কে একটি interface-এর মধ্যে গুচ্ছবদ্ধ করে ধরা যায় — যেমন `UIFactory` interface-এ `createButton()`, `createCheckbox()`, `createScrollbar()` — তিনটি আলাদা factory method, কিন্তু একসাথে ব্যবহৃত হয় যাতে সব UI element একই "family" (যেমন Windows theme বা macOS theme)-এর হয়। মূল পার্থক্য হলো Abstract Factory নিশ্চিত করে যে **related object-গুলো একসাথে সামঞ্জস্যপূর্ণ (consistent) থাকবে**, শুধু একটিমাত্র object তৈরি করা নয়।

---

## 73. What is the Builder pattern?

**Builder pattern** একটি complex object-কে ধাপে ধাপে (step-by-step) তৈরি করার জন্য একটি আলাদা "builder" object ব্যবহার করে, এবং শেষে একটি সম্পূর্ণ ও valid object return করে। এটি বিশেষভাবে কাজে লাগে যখন object-এর অনেকগুলো optional field থাকে বা নির্মাণ প্রক্রিয়া জটিল multiple ধাপে বিভক্ত।

```java
final class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = Map.copyOf(builder.headers);
        this.body = builder.body;
    }

    static class Builder {
        private final String url;
        private String method = "GET";
        private final Map<String, String> headers = new HashMap<>();
        private String body;

        Builder(String url) {
            this.url = url;
        }

        Builder method(String method) {
            this.method = method;
            return this;
        }

        Builder header(String key, String value) {
            headers.put(key, value);
            return this;
        }

        Builder body(String body) {
            this.body = body;
            return this;
        }

        HttpRequest build() {
            return new HttpRequest(this);
        }
    }
}

// ব্যবহার:
HttpRequest request = new HttpRequest.Builder("https://api.example.com")
        .method("POST")
        .header("Content-Type", "application/json")
        .body("{\"key\":\"value\"}")
        .build();
```

### When is Builder better than a constructor with many parameters?

যখন একটি object-এর অনেকগুলো field আছে, তার মধ্যে কিছু required এবং কিছু optional, তখন Builder ব্যবহার করলে caller শুধু প্রয়োজনীয় field-গুলো readable নাম দিয়ে সেট করতে পারে, বাকিগুলো default value-তেই থেকে যায়। উপরের উদাহরণে caller-কে `method`, `header`, বা `body` না দিলেও চলবে — `GET` request-এর জন্য শুধু `new HttpRequest.Builder(url).build()` লিখলেই যথেষ্ট। এছাড়া প্রতিটি field-এর নাম method call-এ স্পষ্টভাবে দেখা যায় (`.method("POST")`), যা একটি long constructor-এর positional argument-এর চেয়ে অনেক বেশি readable এবং ভুলের সম্ভাবনা কম।

Builder object-টি নিজে mutable হতে পারে (ধাপে ধাপে field সেট হয়), কিন্তু `build()` call করার পর যে final object তৈরি হয় সেটি immutable রাখা একটি common ও ভালো practice — এতে construction-এর সুবিধা এবং immutability-র নিরাপত্তা দুটোই পাওয়া যায়।

### What is the telescoping constructor problem?

**Telescoping constructor problem** ঘটে যখন একটি class-এ optional parameter-এর বিভিন্ন combination সামলানোর জন্য একাধিক overloaded constructor তৈরি করা হয়, প্রতিটি আগেরটার চেয়ে একটি বেশি parameter নিয়ে:

```java
class Pizza {
    Pizza(int size) { /* ... */ }
    Pizza(int size, boolean cheese) { /* ... */ }
    Pizza(int size, boolean cheese, boolean pepperoni) { /* ... */ }
    Pizza(int size, boolean cheese, boolean pepperoni, boolean mushroom) { /* ... */ }
    // ... আরও অনেক combination
}
```

এই approach-এর সমস্যা হলো: constructor-এর সংখ্যা parameter-এর combination-এর সাথে exponentially বাড়তে পারে; caller-এর কাছে `new Pizza(12, true, false, true)` কল করার সময় বোঝা কঠিন কোন boolean কীসের জন্য (readability সমস্যা); এবং একটি নতুন optional parameter যোগ করলে অনেক constructor-এ পরিবর্তন আনতে হয়। Builder pattern এই সমস্যার সরাসরি সমাধান দেয় — named method (`cheese(true)`, `pepperoni(false)`) ব্যবহার করে caller স্পষ্টভাবে বলতে পারে কোন value কীসের জন্য, এবং constructor overload-এর কম্বিনেটোরিয়াল বিস্ফোরণ এড়ানো যায়।

---

## 74. What is the Strategy pattern?

**Strategy pattern** একটি algorithm/behavior-কে একটি আলাদা, interchangeable object হিসেবে encapsulate করে, যাতে runtime-এ বিভিন্ন strategy-র মধ্যে সুইচ করা যায়, caller-এর মূল logic না বদলিয়ে।

```java
interface DiscountStrategy {
    Money apply(Money originalPrice);
}

class NoDiscount implements DiscountStrategy {
    public Money apply(Money price) { return price; }
}

class PercentageDiscount implements DiscountStrategy {
    private final double percentage;

    PercentageDiscount(double percentage) { this.percentage = percentage; }

    public Money apply(Money price) {
        return price.multiply(1 - percentage);
    }
}

class PriceCalculator {
    private final DiscountStrategy strategy;

    PriceCalculator(DiscountStrategy strategy) { // strategy বাইরে থেকে injected
        this.strategy = strategy;
    }

    Money finalPrice(Money price) {
        return strategy.apply(price);
    }
}
```

### How does Strategy replace large conditional blocks?

Strategy pattern ছাড়া, বিভিন্ন discount type সামলাতে গেলে code-এ এমন একটি বড় `if/else` বা `switch` block তৈরি হয়:

```java
Money finalPrice(Money price, String discountType) {
    if (discountType.equals("NONE")) {
        return price;
    } else if (discountType.equals("PERCENTAGE")) {
        return price.multiply(1 - percentage);
    } else if (discountType.equals("FIXED")) {
        return price.subtract(fixedAmount);
    }
    // নতুন discount type যোগ করলেই এই method-এ আরেকটি branch যোগ করতে হবে
    throw new IllegalArgumentException("Unknown discount type");
}
```

এই ধরনের conditional block সময়ের সাথে বড় হতে থাকে, এবং একটি নতুন discount type যোগ করতে হলে এই একই method বারবার পরিবর্তন করতে হয় (যা Open/Closed Principle লঙ্ঘন করে)। Strategy pattern প্রতিটি branch-কে একটি আলাদা class-এ রূপান্তরিত করে — নতুন discount type যোগ করতে হলে শুধু নতুন একটি `DiscountStrategy` implementation লিখলেই হয়, existing code স্পর্শ করতে হয় না। এছাড়া প্রতিটি strategy আলাদাভাবে unit test করা সহজ হয়, যেখানে একটি বিশাল conditional block টেস্ট করা তুলনামূলক জটিল।

### How does Strategy demonstrate composition over inheritance?

Strategy pattern-এ `PriceCalculator` একটি `DiscountStrategy` object-কে **inherit** করে না, বরং সেটিকে একটি field হিসেবে **compose** করে (has-a সম্পর্ক, is-a নয়) এবং runtime-এ constructor বা setter দিয়ে ভিন্ন strategy পাস করা যায়। এটি inheritance-based সমাধানের (যেমন `PercentageDiscountCalculator extends PriceCalculator`) তুলনায় বেশি flexible, কারণ:

- Runtime-এ strategy বদলানো যায় (একটি নতুন object তৈরি না করে), যেখানে inheritance-এর ক্ষেত্রে একটি object-এর class runtime-এ বদলানো যায় না।
- একই `DiscountStrategy` একাধিক ভিন্ন context-এ reuse করা যায় (যেমন `PriceCalculator` এবং অন্য কোনো `InvoiceGenerator`-এও একই `PercentageDiscount` ব্যবহার করা যায়), যেখানে inheritance-এ এই ধরনের cross-cutting reuse hierarchy দিয়ে সীমাবদ্ধ হয়ে যায়।
- Class hierarchy বিস্ফোরণ এড়ানো যায় — inheritance ব্যবহার করলে প্রতিটি discount ও প্রতিটি "calculator type"-এর combination-এর জন্য আলাদা subclass দরকার হতে পারত।

এই কারণেই Strategy pattern প্রায়ই "favor composition over inheritance" নীতির একটি classic উদাহরণ হিসেবে উল্লেখ করা হয়।

---

## 75. What is the Observer pattern?

**Observer pattern** একটি one-to-many dependency তৈরি করে: একটি "subject"/"publisher" object-এর state বদলালে, সেই object-এ registered সব "observer"/"subscriber" object স্বয়ংক্রিয়ভাবে notify হয়, subject-কে observer-দের সম্পর্কে detail জানার দরকার হয় না — শুধু একটি common `Observer` interface জানলেই চলে।

```java
interface OrderObserver {
    void onOrderConfirmed(Order order);
}

class Order {
    private final List<OrderObserver> observers = new ArrayList<>();

    void addObserver(OrderObserver observer) {
        observers.add(observer);
    }

    void confirm() {
        // ... confirmation logic ...
        for (OrderObserver observer : observers) {
            observer.onOrderConfirmed(this);
        }
    }
}

class EmailNotifier implements OrderObserver {
    public void onOrderConfirmed(Order order) { /* confirmation email পাঠায় */ }
}

class InventoryUpdater implements OrderObserver {
    public void onOrderConfirmed(Order order) { /* stock কমায় */ }
}
```

### Where is Observer commonly used?

Observer pattern ব্যাপকভাবে ব্যবহৃত হয় এমন জায়গায় যেখানে একাধিক অংশের interested party একটি নির্দিষ্ট event-এ react করতে চায়:

- **GUI framework:** button click, text change ইত্যাদি UI event listener-দের notify করা।
- **MVC/MVVM architecture:** model বদলালে সব সংশ্লিষ্ট view স্বয়ংক্রিয়ভাবে re-render হয়।
- **Pub-sub messaging system:** একটি message queue/event bus-এ publisher event পাঠায়, একাধিক subscriber সেই event শোনে (যদিও distributed pub-sub system-এ প্রায়ই এই idea-টিকে আরও loosely-coupled আকারে, message broker-এর মাধ্যমে বাস্তবায়ন করা হয়)।
- **Reactive programming library** (যেমন RxJava, RxJS): observable stream-এর মাধ্যমে data change propagate করা।

### How does Observer relate to event-driven programming?

Event-driven programming একটি broader architectural style, যেখানে system-এর flow মূলত event-এর occurrence দিয়ে নিয়ন্ত্রিত হয় (কোনো linear, sequential call chain দিয়ে নয়)। Observer pattern হলো এই style-এর একটি concrete, object-oriented বাস্তবায়ন — এটি দেখায় কীভাবে একটি object অন্য object-দের "event শোনার" সুযোগ দিতে পারে এবং সেই event ঘটলে তাদের notify করতে পারে।

বড় scale-এ, অনেক event-driven system Observer pattern-এর সরাসরি in-process বাস্তবায়নের বদলে একটি dedicated **event bus** বা **message broker** (যেমন Kafka, RabbitMQ) ব্যবহার করে, যেখানে publisher এবং subscriber একে অপরের সরাসরি reference-ও রাখে না — broker-ই মধ্যস্থতা করে। তবে core idea একই থেকে যায়: producer এবং consumer-এর মধ্যে decoupling, এবং একাধিক consumer একই event-এ independently react করতে পারা।

---

## 76. What is the Decorator pattern?

**Decorator pattern** একটি object-কে runtime-এ নতুন responsibility/behavior দিয়ে "wrap" করে, মূল class-এর code পরিবর্তন না করেই। Decorator একই interface implement করে যেটা সে wrap করছে, ফলে caller-এর কাছে decorated object এবং original object দুটোই একইভাবে ব্যবহারযোগ্য মনে হয়।

```java
interface Coffee {
    double cost();
    String description();
}

class PlainCoffee implements Coffee {
    public double cost() { return 2.0; }
    public String description() { return "Coffee"; }
}

abstract class CoffeeDecorator implements Coffee {
    protected final Coffee wrapped;

    CoffeeDecorator(Coffee wrapped) { this.wrapped = wrapped; }
}

class MilkDecorator extends CoffeeDecorator {
    MilkDecorator(Coffee wrapped) { super(wrapped); }

    public double cost() { return wrapped.cost() + 0.5; }
    public String description() { return wrapped.description() + " + Milk"; }
}

class SugarDecorator extends CoffeeDecorator {
    SugarDecorator(Coffee wrapped) { super(wrapped); }

    public double cost() { return wrapped.cost() + 0.2; }
    public String description() { return wrapped.description() + " + Sugar"; }
}

// ব্যবহার:
Coffee order = new SugarDecorator(new MilkDecorator(new PlainCoffee()));
// order.description() -> "Coffee + Milk + Sugar"
// order.cost() -> 2.7
```

### How does Decorator extend behavior without modifying the original class?

`PlainCoffee` class-টি অপরিবর্তিত থাকে — `MilkDecorator` এবং `SugarDecorator` উভয়ই সেই একই `Coffee` interface implement করে এবং একটি existing `Coffee` object-কে ভেতরে "wrap" করে রাখে (composition)। যখন `cost()` বা `description()` call হয়, decorator নিজের কিছু আচরণ যোগ করে এবং তারপর wrapped object-এর একই method delegate/call করে। এভাবে multiple decorator একে অপরের ওপর "stack" করা যায় (যেমন উপরের উদাহরণে `Sugar(Milk(Plain))`), এবং প্রতিটি নতুন combination-এর জন্য নতুন কোনো explicit class লেখার দরকার হয় না — existing decorator-গুলো বিভিন্নভাবে combine করলেই যথেষ্ট।

### How is Decorator different from inheritance?

| Decorator (composition-based) | Inheritance (subclassing) |
|---|---|
| Runtime-এ dynamically behavior যোগ/সরানো যায় | Behavior compile-time-এ class hierarchy দিয়ে fixed |
| একাধিক decorator যেকোনো order-এ combine করা যায় | প্রতিটি combination-এর জন্য আলাদা subclass দরকার হতে পারে (combinatorial explosion) |
| Object wrap করে, is-a সম্পর্ক নয় | is-a সম্পর্ক তৈরি করে |
| একই object-কে বিভিন্ন সময়ে ভিন্নভাবে wrap করা যায় | একবার class নির্ধারিত হলে object সেই class-এই থেকে যায় |

যদি inheritance দিয়ে একই সমস্যা সমাধান করার চেষ্টা করা হতো (`MilkCoffee`, `SugarCoffee`, `MilkSugarCoffee`, `MilkSugarWhippedCreamCoffee`, ...), তাহলে প্রতিটি সম্ভাব্য combination-এর জন্য আলাদা subclass দরকার হতো — combination-এর সংখ্যা বাড়ার সাথে সাথে class-এর সংখ্যা exponentially বাড়তে থাকে। Decorator pattern এই সমস্যা এড়ায় কারণ একই ছোট সেটের decorator class একাধিকবার এবং যেকোনো order-এ ব্যবহার করা যায়।

---

## 77. What is the Adapter pattern?

**Adapter pattern** দুটি অসামঞ্জস্যপূর্ণ (incompatible) interface-এর মধ্যে একটি translation layer তৈরি করে, যাতে caller একটি নির্দিষ্ট interface-এর প্রত্যাশা নিয়ে কাজ করতে পারে, যখন actual implementation সম্পূর্ণ ভিন্ন একটি interface প্রকাশ করে (যেমন একটি third-party library বা legacy system)।

```java
// caller এই interface প্রত্যাশা করে:
interface JsonExporter {
    String exportAsJson(Report report);
}

// কিন্তু legacy library সম্পূর্ণ ভিন্ন interface দেয়:
class LegacyXmlLibrary {
    String convertToXml(Report report) { /* ... */ return "<report>...</report>"; }
}

// Adapter দুই interface-এর মধ্যে সেতু তৈরি করে:
class XmlToJsonAdapter implements JsonExporter {
    private final LegacyXmlLibrary legacyLibrary;

    XmlToJsonAdapter(LegacyXmlLibrary legacyLibrary) {
        this.legacyLibrary = legacyLibrary;
    }

    public String exportAsJson(Report report) {
        String xml = legacyLibrary.convertToXml(report);
        return convertXmlToJson(xml); // ভেতরে conversion logic
    }

    private String convertXmlToJson(String xml) { /* ... */ return "{}"; }
}
```

### What problem does Adapter solve?

Adapter সমাধান করে সেই পরিস্থিতি যেখানে caller-এর প্রত্যাশিত interface এবং available implementation-এর interface মেলে না — সাধারণত third-party library ব্যবহার করার সময়, legacy code-এর সাথে নতুন code integrate করার সময়, বা একাধিক ভিন্ন vendor-এর API-কে একটি unified interface-এর পেছনে লুকানোর সময় এই সমস্যা দেখা দেয়। Adapter ব্যবহার করলে caller code তার নিজের প্রত্যাশিত (এবং সাধারণত পরিষ্কার, domain-specific) interface নিয়ে কাজ চালিয়ে যেতে পারে, এবং incompatible external system-এর সাথে "translation" করার জটিলতা একটি single, isolated class-এ (adapter) কেন্দ্রীভূত থাকে। এটি একটি বিশেষভাবে কাজের pattern legacy system migrate করার সময় — পুরনো এবং নতুন system একসাথে চালানোর জন্য।

### How is Adapter different from Facade?

দুটি pattern-ই একটি existing interface-কে caller-এর জন্য সহজ করার চেষ্টা করে, কিন্তু তাদের উদ্দেশ্য ভিন্ন:

| Adapter | Facade |
|---|---|
| একটি **incompatible** interface-কে caller-এর প্রত্যাশিত interface-এ **translate** করে | একটি **complex** (কিন্তু compatible) subsystem-এর জন্য একটি **simplified** entry point দেয় |
| উদ্দেশ্য: দুই interface-এর অসামঞ্জস্যতা দূর করা | উদ্দেশ্য: ব্যবহারের সহজতা বাড়ানো, complexity লুকানো |
| সাধারণত একটি single class/interface-এর সাথে কাজ করে | সাধারণত একাধিক class/subsystem-এর সামনে একটি একক interface দেয় |
| উদাহরণ: `LegacyXmlLibrary`-কে `JsonExporter`-এর মতো দেখানো | উদাহরণ: `HomeTheaterFacade.watchMovie()` যা ভেতরে projector, sound system, lights আলাদাভাবে চালু করে |

সহজ কথায়: Adapter বলে "এই interface-টা তোমার প্রত্যাশিত interface-এর মতো দেখতে বদলে দিচ্ছি" (compatibility সমস্যা সমাধান), আর Facade বলে "এই জটিল subsystem-এর জন্য আমি একটি সহজ, একক প্রবেশপথ দিচ্ছি" (simplicity/usability সমস্যা সমাধান) — Facade-এর subsystem-গুলোর সাথে caller-এর ইতিমধ্যেই interface compatible, শুধু অনেকগুলো ধাপ একসাথে coordinate করতে হয় বলেই সেটি জটিল।

---

## 78. What is the difference between Strategy and State patterns?

Strategy এবং State pattern-এর **class diagram structure প্রায় হুবহু একই** — উভয়েই একটি context object একটি interface-এর reference রাখে এবং সেই interface-এর মাধ্যমে behavior delegate করে। কিন্তু তাদের **উদ্দেশ্য এবং ব্যবহারের ধরন সম্পূর্ণ ভিন্ন**।

```java
// State pattern উদাহরণ
interface OrderState {
    void confirm(OrderContext context);
    void ship(OrderContext context);
}

class CreatedState implements OrderState {
    public void confirm(OrderContext context) {
        context.setState(new ConfirmedState());
    }
    public void ship(OrderContext context) {
        throw new IllegalStateException("Cannot ship an unconfirmed order");
    }
}

class ConfirmedState implements OrderState {
    public void confirm(OrderContext context) {
        throw new IllegalStateException("Already confirmed");
    }
    public void ship(OrderContext context) {
        context.setState(new ShippedState());
    }
}

class OrderContext {
    private OrderState state = new CreatedState();

    void setState(OrderState state) { this.state = state; }
    void confirm() { state.confirm(this); }
    void ship() { state.ship(this); }
}
```

| Strategy | State |
|---|---|
| Caller (বা caller-এর হয়ে client code) explicitly একটি strategy বেছে নেয় | Context object নিজেই internal logic দিয়ে state বদলায়, caller সরাসরি state বদলায় না |
| Strategy-গুলো সাধারণত একে অপরের সম্পর্কে জানে না | State-গুলো প্রায়ই একে অপরকে জানে, কারণ একটি state next state নির্ধারণ করে (transition logic) |
| উদ্দেশ্য: একই কাজ করার বিভিন্ন **উপায়** এর মধ্যে বেছে নেওয়া | উদ্দেশ্য: object-এর internal lifecycle/state-এর ওপর ভিত্তি করে **আচরণ বদলানো** |
| Strategy পরিবর্তন সাধারণত bounded, একবারই সেট করা হয় (বা কম ঘন ঘন বদলায়) | State transition ঘন ঘন এবং pattern-এর মূল কেন্দ্রবিন্দু |

### Why do they look structurally similar but solve different problems?

দুটি pattern-ই "একটি interface-এর মাধ্যমে delegate করা, concrete implementation runtime-এ swap করা যায়" — এই একই mechanism ব্যবহার করে, তাই UML/class diagram-এ তাদের প্রায় আলাদা করা যায় না। পার্থক্যটা কাঠামোতে (structure) নয়, বরং **intent**-এ (উদ্দেশ্য) এবং **কে সিদ্ধান্ত নেয়** তাতে:

- Strategy pattern-এ, caller/client (context-এর বাইরের কেউ) সিদ্ধান্ত নেয় কোন strategy ব্যবহার হবে — যেমন `new PriceCalculator(new PercentageDiscount(0.1))`। এই সিদ্ধান্তটি context-এর বাইরে থেকে আসে, এবং সাধারণত context-এর lifetime-এ খুব ঘন ঘন বদলায় না।
- State pattern-এ, context object নিজেই (বা তার current state object) সিদ্ধান্ত নেয় পরবর্তী state কী হবে — যেমন উপরের উদাহরণে `CreatedState.confirm()` নিজেই ঠিক করে যে পরবর্তী state হবে `ConfirmedState`। Caller শুধু `order.confirm()` call করে, কিন্তু state transition-এর logic context/state-এর ভেতরেই এনক্যাপসুলেটেড থাকে, caller এই transition সম্পর্কে বিস্তারিত জানে না।

এই পার্থক্যটি মনে রাখার একটি সহজ উপায়: Strategy pattern-এ প্রশ্ন হলো **"কীভাবে করবো?"** (algorithm choice, বাইরে থেকে নির্ধারিত), আর State pattern-এ প্রশ্ন হলো **"এখন আমি কী অবস্থায় আছি, এবং সেই অনুযায়ী কী করা উচিত?"** (internal lifecycle, ভেতর থেকে নিয়ন্ত্রিত)। এই পার্থক্য বুঝলে কোড দেখেই বলা যায় কোনটি আসলে কোন pattern প্রয়োগ করছে, শুধু class diagram দেখে নয়।

---