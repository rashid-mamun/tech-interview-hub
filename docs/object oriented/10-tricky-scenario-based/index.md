---
sidebar_position: 10
title: 'Scenarios'
---


## 101. Can inheritance be used purely for code reuse?

Technically হ্যাঁ — অনেক ভাষায় inheritance ব্যবহার করে সহজেই parent class-এর method reuse করা যায়, কম্পাইলার কোনো বাধা দেয় না। কিন্তু এটি একটি **common এবং widely-recognized design mistake**, কারণ inheritance-এর সঠিক অর্থ হলো একটি **is-a substitutability relationship** (দেখুন প্রশ্ন ২), শুধু "কোড শেয়ার করা সুবিধাজনক" নয়। যদি দুটি class-এর মধ্যে সত্যিকারের conceptual is-a সম্পর্ক না থাকে, কিন্তু শুধু কিছু common method আছে বলে একটিকে আরেকটির subclass বানানো হয়, তাহলে এটি একটি ভুল abstraction তৈরি করে যা পরে maintain করা কঠিন হয়ে পড়ে।

একটি classic উদাহরণ: `Stack extends Vector` (Java-এর প্রাথমিক দিনের একটি পরিচিত design ভুল) — `Stack` কে reuse-এর সুবিধার জন্য `Vector`-এর subclass বানানো হয়েছিল, যদিও conceptually একটি stack "is-a" vector নয় (stack-এর শুধু push/pop অর্থবহ, কিন্তু `Vector`-এর সব method যেমন `insertElementAt(middle)` inherited হয়ে stack-এর LIFO invariant ভেঙে দেয়)।

### Why can implementation inheritance create unnecessary coupling?

শুধু code reuse-এর জন্য inheritance ব্যবহার করলে subclass parent class-এর **internal implementation detail-এর সাথে tightly coupled** হয়ে যায়, শুধু তার public contract-এর সাথে নয়। এর কয়েকটি নির্দিষ্ট সমস্যা:

- **Fragile base class problem:** parent class-এর একটি internal method পরিবর্তন করলে, subclass-এ (যা সেই method-এর ওপর নির্ভর করছিল, হয়তো না জেনেই) অপ্রত্যাশিত bug দেখা দিতে পারে — যদিও parent-এর public contract অপরিবর্তিত ছিল।
- **Unwanted method inheritance:** subclass parent-এর সব public method পায়, এমনকি সেগুলো যদি subclass-এর জন্য অর্থহীন বা বিপজ্জনক হয় (উপরের `Stack`/`Vector` উদাহরণের মতো)।
- **Single inheritance limit:** যদি একটি class ইতিমধ্যে একটি অসম্পর্কিত কারণে অন্য class extend করছে, তাহলে শুধু "কিছু কোড ধার নেওয়ার জন্য" আরেকটি class extend করা সম্ভবই হয় না (বেশিরভাগ ভাষায়)।

### When would composition be better?

Composition ভালো যখন সম্পর্কটি আসলে "has-a" বা "uses-a", is-a নয় — যেমন একটি `Car`-এর একটি `Engine` আছে, কিন্তু `Car` নিজেই একটি `Engine` নয়। Composition ব্যবহার করলে reusable logic একটি আলাদা, focused class-এ থাকে, এবং যেকোনো অন্য class সেটিকে একটি field হিসেবে ধরে রেখে ব্যবহার করতে পারে, কোনো is-a সম্পর্ক তৈরি না করেই:

```java
// ভুল: শুধু sorting/searching reuse করার জন্য inheritance
class EmployeeList extends ArrayList<Employee> { /* ... */ }

// ভালো: composition — EmployeeList একটি List "আছে", সেটা নিজে একটি List নয়
class EmployeeDirectory {
    private final List<Employee> employees = new ArrayList<>();

    void add(Employee e) { employees.add(e); }
    List<Employee> all() { return List.copyOf(employees); }
}
```

`EmployeeDirectory` এখন শুধু নিজের প্রয়োজনীয় operation-গুলোই expose করে (`add()`, `all()`), `ArrayList`-এর পুরো (এবং প্রায়ই অপ্রাসঙ্গিক) API surface নয় — এবং ভবিষ্যতে internal storage `ArrayList` থেকে অন্য কোনো structure-এ বদলালেও caller-এর কোনো প্রভাব পড়ে না।

---

## 102. If all fields of a class are private, is the class automatically well encapsulated?

**না।** `private` field শুধু **data hiding** নিশ্চিত করে (দেখুন প্রশ্ন ১০), কিন্তু encapsulation-এর আসল পরীক্ষা হলো: object কি নিজের **invariant রক্ষা করতে পারছে**? যদি একটি class-এর সব field private কিন্তু প্রতিটির জন্য একটি unrestricted public setter থাকে, তাহলে সেই private-nesss কার্যত অর্থহীন হয়ে যায়:

```java
class Account {
    private long balance;

    public void setBalance(long balance) { this.balance = balance; } // কোনো validation নেই!
    public long getBalance() { return balance; }
}

Account account = new Account();
account.setBalance(-9999); // অনুমোদিত — invariant রক্ষা হচ্ছে না!
```

এখানে `balance` field private, কিন্তু `setBalance()` কোনো validation করছে না — caller effectively field-টি সরাসরি access করার মতোই ইচ্ছামতো value বসাতে পারছে। এই class technically "data hidden" কিন্তু design-wise খুবই দুর্বল encapsulation-এর উদাহরণ।

### What if the class exposes internal mutable objects through getters?

আরেকটি common ভুল হলো একটি private mutable field-কে সরাসরি একটি getter দিয়ে "leak" করে দেওয়া:

```java
class Order {
    private final List<Item> items = new ArrayList<>();

    public List<Item> getItems() {
        return items; // বিপজ্জনক! caller এখন সরাসরি এই list modify করতে পারবে
    }
}

Order order = new Order();
order.getItems().clear(); // Order class কিছু জানলোই না, কিন্তু তার internal state বদলে গেলো!
```

যদিও `items` field private, `getItems()` সেই same, mutable object-এর reference সরাসরি ফেরত দিচ্ছে — caller এখন `Order`-এর কোনো official method না ব্যবহার করেই তার internal collection সরাসরি modify করতে পারছে (`clear()`, `add()`, ইত্যাদি)। এটি একটি সূক্ষ্ম কিন্তু খুবই common encapsulation leak, এবং এর সমাধান হলো defensive copy বা unmodifiable view return করা:

```java
public List<Item> getItems() {
    return List.copyOf(items); // অথবা Collections.unmodifiableList(items)
}
```

**সারমর্ম:** encapsulation-এর মূল প্রশ্ন "field-গুলো কি private?" নয়, বরং "object কি নিশ্চিত করতে পারছে যে তার state শুধু নিয়ন্ত্রিত, বৈধ পথেই পরিবর্তিত হবে?" — যেকোনো leak (unrestricted setter বা mutable getter) এই নিশ্চয়তা ভেঙে দেয়।

---

## 103. Can a subclass violate the contract of its parent even if the code compiles?

**হ্যাঁ, absolutely।** Compiler শুধু **syntactic** সঠিকতা যাচাই করে — method signature মিলছে কিনা, return type compatible কিনা, ইত্যাদি। কিন্তু parent class-এর **semantic contract** (যেমন "এই method কখনো negative return করবে না", "এই collection ordered থাকবে", "এই method কখনো exception throw করবে না") compiler-এর কাছে অদৃশ্য — এটি শুধু documentation, convention, বা unit test-এর মাধ্যমে enforce হয়।

```java
class Rectangle {
    protected int width, height;

    void setWidth(int w) { this.width = w; }
    void setHeight(int h) { this.height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(int w) {
        this.width = w;
        this.height = w; // Square-এর invariant বজায় রাখতে height-ও বদলে দিচ্ছে
    }

    @Override
    void setHeight(int h) {
        this.height = h;
        this.width = h;
    }
}
```

এই কোড নিখুঁতভাবে **compile** হয় — কোনো syntax error নেই। কিন্তু এটি `Rectangle`-এর implicit contract ভঙ্গ করছে: caller প্রত্যাশা করে `setWidth()` শুধু width বদলাবে, height অপরিবর্তিত থাকবে। যদি কোনো code এই প্রত্যাশা নিয়ে লেখা হয়:

```java
void resize(Rectangle r) {
    r.setWidth(5);
    r.setHeight(10);
    assert r.area() == 50; // Rectangle-এর জন্য ঠিক, কিন্তু Square পাস করলে area হবে 100!
}
```

`Square` object পাস করলে এই assertion fail করবে, যদিও কোনো compile error হয়নি — কারণ `Square` structurally `Rectangle`-এর subtype, কিন্তু **behaviorally** তার contract ভঙ্গ করছে।

### How does this relate to LSP?

এটি সরাসরি **Liskov Substitution Principle (LSP)**-এর একটি classic উদাহরণ — LSP বলে যে একটি subtype তার supertype-এর জায়গায় ব্যবহার করা গেলে program-এর correctness ভাঙা উচিত নয়। `Square extends Rectangle` compile হয় (structural substitutability আছে), কিন্তু behavioral substitutability নেই — `Rectangle`-কে যেখানে ব্যবহার করা প্রত্যাশিত, সেখানে `Square` বসালে program ভুল ফলাফল দেয়। এই কারণেই এই উদাহরণটি প্রায়ই বলা হয়: **"mathematically একটি square একটি rectangle, কিন্তু OOP-তে `Square` কে `Rectangle`-এর subclass বানানো উচিত নয়"** — কারণ OOP-তে subtype সম্পর্ক গণিতের সম্পর্ক নয়, বরং **behavioral contract**-এর সম্পর্ক।

---

## 104. Why is a `Bird` class with a mandatory `fly()` method problematic if `Penguin` inherits from it?

```java
class Bird {
    void fly() { System.out.println("Flying..."); }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!"); // সমস্যা!
    }
}
```

এই design সমস্যাযুক্ত কারণ এটি আবারও LSP লঙ্ঘন করে — `Bird` type-এর যেকোনো object-এর ওপর `fly()` call করা নিরাপদ হওয়া উচিত (এটাই `Bird` contract-এর অংশ), কিন্তু `Penguin` সেই expectation ভেঙে একটি exception throw করে। যদি কোনো code `List<Bird>`-এর ওপর loop করে সব bird-কে `fly()` call করে (একটি সম্পূর্ণ যুক্তিসঙ্গত assumption, যেহেতু `Bird` interface এটি প্রতিশ্রুতি দেয়), সেই code `Penguin` encounter করলেই runtime exception পাবে — যদিও কোনো compile-time সংকেত ছিল না যে এটি ঘটতে পারে।

মূল সমস্যাটি হলো: `Bird` abstraction "সব পাখি ওড়ে" — এই বাস্তব-জগতের সাধারণীকরণের ওপর ভিত্তি করে তৈরি হয়েছে, যা আসলে সত্য নয় (penguin, ostrich, kiwi — সবাই পাখি, কেউই ওড়ে না)। Class hierarchy ডিজাইন করার সময় real-world category নয়, বরং **behavioral contract**-এর ওপর ভিত্তি করে চিন্তা করা উচিত।

### How would you redesign the hierarchy?

সবচেয়ে সাধারণ সমাধান হলো `fly()`-কে `Bird`-এর mandatory contract থেকে সরিয়ে একটি আলাদা, optional capability-interface-এ নিয়ে যাওয়া:

```java
interface Bird {
    void eat();
    void makeSound();
}

interface FlyingBird extends Bird {
    void fly();
}

interface SwimmingBird extends Bird {
    void swim();
}

class Sparrow implements FlyingBird {
    public void eat() { /* ... */ }
    public void makeSound() { /* ... */ }
    public void fly() { /* ... */ }
}

class Penguin implements SwimmingBird {
    public void eat() { /* ... */ }
    public void makeSound() { /* ... */ }
    public void swim() { /* ... */ }
    // fly() নেই — এবং এটাই সঠিক, কারণ Penguin এই capability-ই রাখে না
}
```

এখন `Penguin` কে আর একটি ভুয়া `fly()` implementation দিতে হচ্ছে না, এবং caller code শুধুমাত্র `FlyingBird` type-এর object-এর ওপরই `fly()` call করবে — type system-ই নিশ্চিত করে যে ভুল object-এর ওপর `fly()` call করা যাবে না, সেটা কম্পাইল-টাইমেই ধরা পড়বে। এটি দেখায় capability-ভিত্তিক interface design কীভাবে বাস্তব জগতের "সব X-ই Y করে"-জাতীয় ভুল সাধারণীকরণ এড়াতে সাহায্য করে।

---

## 105. A class has many `if/else` checks based on object type. What OOP design problem might this indicate?

```java
double calculateArea(Shape shape) {
    if (shape.getType().equals("CIRCLE")) {
        return Math.PI * shape.getRadius() * shape.getRadius();
    } else if (shape.getType().equals("RECTANGLE")) {
        return shape.getWidth() * shape.getHeight();
    } else if (shape.getType().equals("TRIANGLE")) {
        return 0.5 * shape.getBase() * shape.getHeight();
    }
    // নতুন shape যোগ হলে এই method-এ আরও একটি branch যোগ করতে হবে
    throw new IllegalArgumentException("Unknown shape");
}
```

এই ধরনের কোড একটি স্পষ্ট সংকেত যে **polymorphism ব্যবহার হচ্ছে না, যদিও object-oriented syntax ব্যবহৃত হচ্ছে**। প্রতিবার একটি নতুন object type check করার জন্য `if/else`/`switch` লেখা মানে হলো "type-অনুযায়ী আচরণ" নির্ধারণের দায়িত্বটি caller-এর হাতে চলে গেছে, যেখানে সেটি প্রতিটি object-এর নিজের দায়িত্ব হওয়া উচিত ছিল। এই anti-pattern-কে অনেক সময় বলা হয় "type-checking instead of polymorphism"।

এর ফলে কয়েকটি সমস্যা দেখা দেয়: **Open/Closed Principle লঙ্ঘন** (নতুন shape type যোগ করতে existing method-এ পরিবর্তন লাগে), **duplication** (যদি এই একই ধরনের `if/else` একাধিক জায়গায় ছড়িয়ে থাকে — যেমন `calculateArea()`, `calculatePerimeter()`, `draw()` — প্রতিটিতে একই type-check pattern repeat হয়), এবং **fragility** (কোনো নতুন branch যোগ করতে ভুলে গেলে runtime-এ silent bug বা exception হতে পারে)।

### Could polymorphism or Strategy improve the design?

হ্যাঁ — সঠিক OOP সমাধান হলো এই logic-টিকে প্রতিটি shape-এর নিজের method-এ সরিয়ে নেওয়া, একটি common interface-এর মাধ্যমে:

```java
interface Shape {
    double area();
}

class Circle implements Shape {
    private final double radius;
    Circle(double radius) { this.radius = radius; }
    public double area() { return Math.PI * radius * radius; }
}

class Rectangle implements Shape {
    private final double width, height;
    Rectangle(double width, double height) { this.width = width; this.height = height; }
    public double area() { return width * height; }
}

// caller code:
double calculateArea(Shape shape) {
    return shape.area(); // কোনো if/else নেই — polymorphism নিজে থেকে সঠিক implementation বেছে নেয়
}
```

এখন একটি নতুন shape (যেমন `Triangle`) যোগ করতে শুধু নতুন একটি class লিখলেই হয়, `calculateArea()`-এ কোনো পরিবর্তন লাগে না। যদি "type-check" আসলে "কোন algorithm ব্যবহার হবে" এই ধরনের সিদ্ধান্তকে represent করে (object-এর নিজস্ব identity-এর অংশ না হয়ে, বরং বাইরের একটি স্বাধীন পছন্দ হয়), তাহলে Strategy pattern (দেখুন প্রশ্ন ৭৪) আরও উপযুক্ত হতে পারে — উভয় সমাধানই মূল idea শেয়ার করে: **conditional branching-কে polymorphic dispatch দিয়ে প্রতিস্থাপন করা।**

---

## 106. A class handles validation, database access, email sending, logging, and business logic. What is wrong with the design?

```java
class OrderProcessor {
    void processOrder(Order order) {
        // validation
        if (order.getItems().isEmpty()) throw new IllegalArgumentException("Empty order");

        // business logic
        double total = order.calculateTotal();

        // database access
        Connection conn = DriverManager.getConnection("jdbc:...");
        conn.createStatement().executeUpdate("INSERT INTO orders ...");

        // email sending
        SmtpClient smtp = new SmtpClient("smtp.example.com");
        smtp.send(order.getCustomerEmail(), "Order confirmed");

        // logging
        System.out.println("Order processed: " + order.getId());
    }
}
```

এই class-টির মূল সমস্যা হলো এটি একসাথে **অনেকগুলো সম্পূর্ণ ভিন্ন কারণে বদলাতে পারে** — validation rule বদলালে, database schema/technology বদলালে, email provider বদলালে, বা logging format বদলালে, প্রতিটি ক্ষেত্রেই এই একই class-টি touch করতে হবে। এই ধরনের class-কে প্রায়ই **God Object** বলা হয় (দেখুন প্রশ্ন ১১৬) — এটি অতিরিক্ত অনেক দায়িত্ব একা বহন করছে।

এর ব্যবহারিক সমস্যা: এই class **unit test করা কঠিন** (business logic টেস্ট করতে গেলেও একটি real (বা mocked) database connection এবং SMTP client দরকার হয়ে পড়ে); **reuse করা কঠিন** (যদি কোনো অন্য জায়গায় শুধু validation logic দরকার হয়, পুরো class-সহ তার database/email dependency-ও টেনে আনতে হয়); এবং **একাধিক developer/team-এর একই file-এ কাজ করার সময় merge conflict বাড়ায়।**

### Which SOLID principle is being violated?

এটি **Single Responsibility Principle (SRP)** লঙ্ঘনের একটি প্রায়-teaching-textbook উদাহরণ। SRP বলে: **"একটি class-এর বদলানোর একটিই কারণ থাকা উচিত"** — কিন্তু এখানে `OrderProcessor`-এর বদলানোর অন্তত পাঁচটি সম্পূর্ণ স্বাধীন কারণ আছে (validation rule, business calculation, database technology, email provider, logging format), যার প্রতিটিই ভিন্ন stakeholder বা ভিন্ন কারণে বদলাতে পারে।

### How would you refactor it?

প্রতিটি responsibility-কে একটি আলাদা, focused class-এ ভাগ করে, এবং `OrderProcessor`-কে শুধু সেগুলোর **coordination**-এর দায়িত্ব দিয়ে:

```java
class OrderValidator {
    void validate(Order order) {
        if (order.getItems().isEmpty()) throw new IllegalArgumentException("Empty order");
    }
}

interface OrderRepository {
    void save(Order order);
}

interface NotificationService {
    void notifyOrderConfirmed(Order order);
}

interface Logger {
    void info(String message);
}

class OrderProcessor {
    private final OrderValidator validator;
    private final OrderRepository repository;
    private final NotificationService notifier;
    private final Logger logger;

    OrderProcessor(OrderValidator validator, OrderRepository repository,
                    NotificationService notifier, Logger logger) {
        this.validator = validator;
        this.repository = repository;
        this.notifier = notifier;
        this.logger = logger;
    }

    void processOrder(Order order) {
        validator.validate(order);
        repository.save(order);
        notifier.notifyOrderConfirmed(order);
        logger.info("Order processed: " + order.getId());
    }
}
```

এখন প্রতিটি concern আলাদা, independently testable এবং replaceable — `OrderRepository`-এর একটি fake implementation দিয়ে test করা যায়, database না ছুঁয়েই। `OrderProcessor` নিজে শুধু **orchestration**-এর দায়িত্ব বহন করে, actual implementation detail তার জানার দরকার নেই (dependency injection ব্যবহার করে)।

---

## 107. An interface contains many methods, but most implementing classes use only a few. What is wrong?

```java
interface Worker {
    void code();
    void test();
    void deploy();
    void manageBudget();
    void conductInterviews();
    void writeDocumentation();
}

class Developer implements Worker {
    public void code() { /* ... */ }
    public void test() { /* ... */ }
    public void deploy() { /* ... */ }

    // এই তিনটি Developer-এর জন্য অর্থহীন, কিন্তু implement করতে বাধ্য:
    public void manageBudget() { throw new UnsupportedOperationException(); }
    public void conductInterviews() { throw new UnsupportedOperationException(); }
    public void writeDocumentation() { throw new UnsupportedOperationException(); }
}
```

এই ধরনের একটি বৃহৎ, "সবকিছু-সহ" interface-কে প্রায়ই **"fat interface"** বলা হয়। সমস্যা হলো এটি implementing class-দের এমন method implement করতে বাধ্য করে যা তাদের জন্য conceptually অপ্রাসঙ্গিক — এবং প্রায়ই দেখা যায় সেই class-গুলো সেই method-এর জন্য একটি empty body, বা একটি `throw new UnsupportedOperationException()` দিয়ে "কোনোরকমে compile করানো" implementation দেয় (যা প্রশ্ন ১০৪-এর `Penguin.fly()`-এর মতোই একটি LSP violation তৈরি করে)। এছাড়া `Worker` interface-এর কোনো একটি method-এর signature বদলালে, সেই method ব্যবহারই না-করা সব implementing class-কেও পুনরায় compile/পরিবর্তন করতে হয় — একটি অপ্রয়োজনীয় coupling তৈরি হয়।

### Which SOLID principle applies?

এটি **Interface Segregation Principle (ISP)** লঙ্ঘনের উদাহরণ — ISP বলে: **"কোনো client-কে এমন কোনো method-এর ওপর নির্ভর করতে বাধ্য করা উচিত নয় যা সে ব্যবহার করে না।"** সমাধান হলো একটি বড় interface-কে ছোট, focused, role-specific interface-এ ভেঙে ফেলা:

```java
interface Coder {
    void code();
    void test();
    void deploy();
}

interface Manager {
    void manageBudget();
    void conductInterviews();
}

interface Documenter {
    void writeDocumentation();
}

class Developer implements Coder {
    public void code() { /* ... */ }
    public void test() { /* ... */ }
    public void deploy() { /* ... */ }
    // আর কোনো অপ্রয়োজনীয় method implement করতে হচ্ছে না
}

class TeamLead implements Coder, Manager { // যার যতগুলো role দরকার ততগুলো interface implement করে
    // ...
}
```

এখন প্রতিটি class শুধু সেই capability-গুলোই implement করে যেগুলো তার জন্য বাস্তবিকভাবে প্রাসঙ্গিক, এবং একটি interface-এর পরিবর্তন শুধু সেটি ব্যবহারকারী class-গুলোকেই প্রভাবিত করে।

---

## 108. Every time a new payment method is added, the existing payment class must be modified. Which principle is being violated?

```java
class PaymentService {
    PaymentResult pay(String method, Money amount) {
        if (method.equals("CARD")) {
            return processCardPayment(amount);
        } else if (method.equals("PAYPAL")) {
            return processPaypalPayment(amount);
        }
        // নতুন payment method যোগ করতে হলে এখানে আরও একটি else-if যোগ করতে হবে!
        throw new IllegalArgumentException("Unsupported method");
    }
    // ...
}
```

এখানে লঙ্ঘিত হচ্ছে **Open/Closed Principle (OCP)** — যা বলে: **"একটি class extension-এর জন্য open থাকা উচিত, কিন্তু modification-এর জন্য closed থাকা উচিত।"** অর্থাৎ নতুন behavior যোগ করার জন্য existing, ইতিমধ্যে-কাজ-করা, ইতিমধ্যে-টেস্ট-করা code পরিবর্তন করা উচিত নয় — বরং নতুন কোড যোগ করেই সেই capability extend করা উচিত। এখানে প্রতিবার নতুন payment method (যেমন "BANK_TRANSFER") যোগ করতে হলে `PaymentService`-এর এই method-টিই বারবার বদলাতে হচ্ছে, যা কয়েকটি ঝুঁকি তৈরি করে: existing, well-tested branch-গুলো ভুলবশত ভেঙে ফেলার সম্ভাবনা, এবং এই একই method বারবার পরিবর্তনের ফলে merge conflict বাড়া।

### How could interfaces, polymorphism, Strategy, or Factory help?

`PaymentMethod` interface এবং Strategy/Factory pattern একসাথে ব্যবহার করে OCP অনুসরণ করা সম্ভব (দেখুন প্রশ্ন ২ এবং ৭৪):

```java
interface PaymentMethod {
    PaymentResult pay(Money amount);
}

class CardPayment implements PaymentMethod {
    public PaymentResult pay(Money amount) { /* ... */ return null; }
}

class PaypalPayment implements PaymentMethod {
    public PaymentResult pay(Money amount) { /* ... */ return null; }
}

// নতুন payment method যোগ করতে হলে শুধু একটি নতুন class লিখতে হবে:
class BankTransferPayment implements PaymentMethod {
    public PaymentResult pay(Money amount) { /* ... */ return null; }
}

class PaymentService {
    PaymentResult pay(PaymentMethod method, Money amount) {
        return method.pay(amount); // কোনো if/else নেই, existing code কখনো বদলাতে হয় না
    }
}
```

এখানে একটি নতুন payment method যোগ করতে `PaymentService`-এর একটি লাইনও বদলাতে হয় না — শুধু নতুন একটি class লিখে `PaymentMethod` interface implement করলেই যথেষ্ট (Open for extension, Closed for modification)। যদি "কোন `PaymentMethod` object তৈরি হবে" নির্ধারণের জন্য কোনো conditional logic দরকার হয় (যেমন একটি string identifier থেকে সঠিক implementation বেছে নেওয়া), সেই একটি নির্দিষ্ট decision-point-কে একটি Factory-তে isolate করা যায়, যাতে বাকি সব business logic (যেমন `PaymentService`) সম্পূর্ণভাবে সেই conditional logic থেকে মুক্ত থাকে।

---

## 109. How would you design a Notification system supporting Email, SMS, and Push Notifications?

### Which abstractions would you introduce?

মূল abstraction হবে একটি capability-focused interface, যা "একটি notification পাঠানো যায়" — এই একটি common contract প্রকাশ করে, চ্যানেল-নির্দিষ্ট detail নয়:

```java
interface NotificationChannel {
    void send(Notification notification, Recipient recipient);
}

class EmailChannel implements NotificationChannel {
    private final SmtpClient smtpClient;
    EmailChannel(SmtpClient smtpClient) { this.smtpClient = smtpClient; }

    public void send(Notification notification, Recipient recipient) {
        smtpClient.send(recipient.getEmail(), notification.getSubject(), notification.getBody());
    }
}

class SmsChannel implements NotificationChannel {
    private final SmsGateway smsGateway;
    SmsChannel(SmsGateway smsGateway) { this.smsGateway = smsGateway; }

    public void send(Notification notification, Recipient recipient) {
        smsGateway.sendText(recipient.getPhoneNumber(), notification.getBody());
    }
}

class PushChannel implements NotificationChannel {
    private final PushProvider pushProvider;
    PushChannel(PushProvider pushProvider) { this.pushProvider = pushProvider; }

    public void send(Notification notification, Recipient recipient) {
        pushProvider.push(recipient.getDeviceToken(), notification.getTitle(), notification.getBody());
    }
}

class NotificationService {
    private final List<NotificationChannel> channels;

    NotificationService(List<NotificationChannel> channels) {
        this.channels = channels;
    }

    void notifyAll(Notification notification, Recipient recipient) {
        for (NotificationChannel channel : channels) {
            channel.send(notification, recipient);
        }
    }
}
```

`Notification` (কী পাঠানো হচ্ছে — subject, body, title) এবং `Recipient` (কাকে পাঠানো হচ্ছে — email, phone, device token) আলাদা data class হিসেবে থাকবে, যাতে প্রতিটি channel শুধু তার প্রয়োজনীয় তথ্য বের করে নিতে পারে।

### How would you add a new channel without modifying existing business logic?

যেহেতু `NotificationService` এবং caller code শুধু `NotificationChannel` interface-এর ওপর নির্ভর করে (concrete implementation-এর ওপর নয়), তাই একটি নতুন channel (যেমন `WhatsAppChannel` বা `SlackChannel`) যোগ করতে শুধু একটি নতুন class লিখে `NotificationChannel` implement করতে হয়, এবং সেটিকে `channels` list-এ যোগ করতে হয় (dependency injection configuration-এ) — `NotificationService`-এর নিজের কোনো কোড বদলাতে হয় না। এটি একটি সরাসরি প্রয়োগ প্রশ্ন ১০৮-এ আলোচিত Open/Closed Principle-এর।

---

## 110. How would you design a Payment system supporting multiple payment methods?

একটি সম্পূর্ণ payment system শুধু "কীভাবে charge করা হয়" (Strategy) না, বরং "কোন strategy তৈরি করা হবে" (Factory)-ও প্রয়োজন হতে পারে:

```java
interface PaymentMethod {
    PaymentResult pay(Money amount);
}

class CardPayment implements PaymentMethod { /* ... */ public PaymentResult pay(Money amount) { return null; } }
class PaypalPayment implements PaymentMethod { /* ... */ public PaymentResult pay(Money amount) { return null; } }

interface PaymentMethodFactory {
    PaymentMethod create(String type);
}

class DefaultPaymentMethodFactory implements PaymentMethodFactory {
    public PaymentMethod create(String type) {
        return switch (type) {
            case "CARD" -> new CardPayment();
            case "PAYPAL" -> new PaypalPayment();
            default -> throw new IllegalArgumentException("Unsupported: " + type);
        };
    }
}

class CheckoutService {
    private final PaymentMethodFactory factory;

    CheckoutService(PaymentMethodFactory factory) { this.factory = factory; }

    PaymentResult checkout(String paymentType, Money amount) {
        PaymentMethod method = factory.create(paymentType);
        return method.pay(amount);
    }
}
```

### Where would Strategy or Factory patterns be useful?

**Strategy** pattern প্রয়োগ হয় `PaymentMethod` interface-এ — প্রতিটি implementation একটি ভিন্ন "কীভাবে charge করা হবে" এর algorithm represent করে, এবং `CheckoutService` কোন concrete strategy ব্যবহৃত হচ্ছে তা না জেনেই কাজ করতে পারে। **Factory** pattern প্রয়োজন হয় যখন runtime-এ (যেমন একটি user-selected string বা configuration থেকে) সঠিক `PaymentMethod` instance তৈরি করার decision নিতে হয় — এই সিদ্ধান্তটিকে একটি isolated জায়গায় (factory) কেন্দ্রীভূত রাখলে, বাকি business logic (`CheckoutService`) সেই decision-making logic থেকে সম্পূর্ণ মুক্ত থাকে।

### How would you keep the design open for future providers?

নতুন provider (যেমন `BankTransferPayment`, `CryptoPayment`) যোগ করতে শুধু একটি নতুন class লিখে `PaymentMethod` implement করতে হয়, এবং `DefaultPaymentMethodFactory`-এর `switch`-এ একটি নতুন case যোগ করতে হয় — এই factory-টিই একমাত্র জায়গা যেখানে "নতুন type যোগ" মানে "existing code পরিবর্তন" (একে **local, isolated, expected modification** বলা যায়, যেখানে বাকি সব business logic — `CheckoutService`-সহ — সম্পূর্ণ অপরিবর্তিত থাকে)। বড় system-এ এই factory-র conditional logic-ও একটি registry/plugin-based mechanism দিয়ে প্রতিস্থাপন করা যায়, যাতে নতুন provider যোগ করতে factory-র কোডও বদলাতে না হয় (যেমন একটি `Map<String, Supplier<PaymentMethod>>` registration mechanism)।

---

## 111. How would you design a Parking Lot system using OOP?

### What main classes and relationships would you identify?

একটি parking lot system-এর মূল entity ও তাদের সম্পর্ক:

```java
enum VehicleType { MOTORCYCLE, CAR, TRUCK }

abstract class Vehicle {
    private final String licensePlate;
    private final VehicleType type;

    protected Vehicle(String licensePlate, VehicleType type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }

    VehicleType getType() { return type; }
}

class Car extends Vehicle { Car(String plate) { super(plate, VehicleType.CAR); } }
class Motorcycle extends Vehicle { Motorcycle(String plate) { super(plate, VehicleType.MOTORCYCLE); } }
class Truck extends Vehicle { Truck(String plate) { super(plate, VehicleType.TRUCK); } }

class ParkingSpot {
    private final String id;
    private final VehicleType allowedType;
    private Vehicle parkedVehicle;

    ParkingSpot(String id, VehicleType allowedType) {
        this.id = id;
        this.allowedType = allowedType;
    }

    boolean isAvailable() { return parkedVehicle == null; }

    boolean canFit(Vehicle vehicle) {
        return isAvailable() && vehicle.getType() == allowedType;
    }

    void park(Vehicle vehicle) {
        if (!canFit(vehicle)) throw new IllegalStateException("Spot cannot fit this vehicle");
        this.parkedVehicle = vehicle;
    }

    void vacate() { this.parkedVehicle = null; }
}

class ParkingFloor {
    private final List<ParkingSpot> spots;

    ParkingFloor(List<ParkingSpot> spots) { this.spots = spots; }

    Optional<ParkingSpot> findAvailableSpot(Vehicle vehicle) {
        return spots.stream().filter(spot -> spot.canFit(vehicle)).findFirst();
    }
}

class ParkingLot {
    private final List<ParkingFloor> floors;
    private final Map<String, Ticket> activeTickets = new HashMap<>();

    ParkingLot(List<ParkingFloor> floors) { this.floors = floors; }

    Ticket parkVehicle(Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            Optional<ParkingSpot> spot = floor.findAvailableSpot(vehicle);
            if (spot.isPresent()) {
                spot.get().park(vehicle);
                Ticket ticket = new Ticket(vehicle, spot.get(), Instant.now());
                activeTickets.put(ticket.getId(), ticket);
                return ticket;
            }
        }
        throw new IllegalStateException("Parking lot full");
    }
}

class Ticket {
    private final String id = UUID.randomUUID().toString();
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final Instant entryTime;

    Ticket(Vehicle vehicle, ParkingSpot spot, Instant entryTime) {
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = entryTime;
    }

    String getId() { return id; }
}
```

এখানে মূল entity: `Vehicle` (এবং তার subtype), `ParkingSpot`, `ParkingFloor`, `ParkingLot`, `Ticket`, এবং সম্ভবত একটি `PaymentProcessor`/`FeeCalculator` (যা প্রশ্ন ১১০-এর ধরনেই design করা যায়)। সম্পর্কগুলো মূলত composition-based: একটি `ParkingLot`-এ একাধিক `ParkingFloor` **আছে**, একটি `ParkingFloor`-এ একাধিক `ParkingSpot` **আছে** — এগুলো "has-a" সম্পর্ক, "is-a" নয়।

### Where would you use inheritance?

Inheritance ব্যবহৃত হয় `Vehicle` hierarchy-তে (`Car`, `Motorcycle`, `Truck` — is `Vehicle`), কারণ এখানে সত্যিকারের is-a সম্পর্ক আছে: একটি `Car` সত্যিই একটি বিশেষ ধরনের `Vehicle`, এবং সব vehicle-এর common attribute (license plate, type) ও সম্ভাব্য common behavior একটি shared abstract base class-এ রাখা স্বাভাবিক এবং যুক্তিসঙ্গত।

### Where would you use composition?

Composition ব্যবহৃত হয় `ParkingLot`-`ParkingFloor`-`ParkingSpot` সম্পর্কে (has-a), এবং `ParkingSpot`-`Vehicle`-এর সম্পর্কেও (একটি spot একটি vehicle **ধরে রাখে**, কোনো spot নিজে একটি vehicle নয়)। এছাড়া `ParkingLot` যদি payment/fee-calculation logic-এর জন্য একটি আলাদা `FeeCalculator` বা `PaymentMethod` ব্যবহার করে (দেখুন প্রশ্ন ১১০), সেটিও composition — `ParkingLot` একটি payment-processing **রাখে**, নিজে একটি payment processor নয়। এই ধরনের বেশিরভাগ "system design" প্রশ্নে composition-ই প্রধান organizing tool হয়ে থাকে, inheritance শুধু সেইসব জায়গায় সীমাবদ্ধ থাকে যেখানে সত্যিকারের is-a সম্পর্ক এবং substitutability প্রয়োজন (যেমন `Vehicle` hierarchy)।

---

## 112. How do you decide whether something should be a class, an interface, or just a simple function/data structure?

সিদ্ধান্তটি নির্ভর করে concept-টি আসলে কী represent করছে তার ওপর:

- **Simple function** উপযুক্ত যখন operation-টি stateless এবং কোনো object identity-র সাথে যুক্ত নয় — যেমন `calculateDistance(pointA, pointB)`, `formatDate(date)`। এখানে কোনো state maintain করার দরকার নেই, শুধু input থেকে output গণনা করতে হয়।
- **Simple data structure** (struct, record, plain object) উপযুক্ত যখন প্রয়োজন শুধু data একসাথে group করা, কোনো significant behavior বা invariant enforcement ছাড়াই — যেমন `Point(x, y)`, `Coordinates(lat, lng)`।
- **Class** উপযুক্ত যখন state এবং সেই state-কে রক্ষা/পরিবর্তনের rule (invariant) একসাথে দরকার — যেমন `BankAccount`, `Order`, যেখানে state পরিবর্তনের একটি নির্দিষ্ট, enforceable নিয়ম আছে।
- **Interface** উপযুক্ত যখন একাধিক (সম্ভবত unrelated) implementation একই capability/contract মেনে চলবে, এবং caller সেই concrete implementation থেকে decoupled থাকতে চায় — যেমন `PaymentMethod`, `NotificationChannel` (দেখুন প্রশ্ন ১৭)।

### Why should every noun in a requirement not automatically become a class?

একটি common নতুন-developer-এর ভুল হলো একটি requirement document পড়ে প্রতিটি noun-কে যান্ত্রিকভাবে একটি class বানিয়ে ফেলা ("Order Processing System"-এ "Order", "Item", "Processing" — সবকিছুকেই class বানানো, এমনকি "Processing"-এর মতো একটি process/verb-ধর্মী শব্দকেও)। এই approach-এ সমস্যা হলো:

- এটি প্রায়ই অপ্রয়োজনীয় class তৈরি করে যাদের কোনো meaningful state বা behavior নেই (শুধু একটি noun থাকার কারণেই class হয়ে যায়)।
- এটি বাস্তব domain-এর behavior এবং invariant-কে উপেক্ষা করে শুধু vocabulary-র ওপর ভিত্তি করে design করে, যা প্রায়ই একটি anemic (data-only, behavior-less) design তৈরি করে।
- এটি প্রশ্ন করে না "এই concept-টির কি নিজস্ব state আছে যা রক্ষা করা দরকার?" বা "এই concept-টির কি একাধিক পরিবর্তনশীল implementation থাকতে পারে?" — এই প্রশ্নগুলোই আসলে class/interface/function সিদ্ধান্তের ভিত্তি হওয়া উচিত, শুধু "এটি কি একটি noun?" নয়।

সঠিক approach হলো প্রথমে system-এর **behavior এবং invariant** চিহ্নিত করা (কোন state-এর কোন rule আছে, কোন operation কীভাবে অন্য operation-কে প্রভাবিত করে), তারপর সেই behavior/invariant-এর ভিত্তিতে responsibility-কে class/interface/function-এ ভাগ করা।

---

## 113. How do you decide between an interface and an abstract class?

এই সিদ্ধান্তটি তিনটি মূল প্রশ্নের ওপর নির্ভর করে (দেখুন প্রশ্ন ১৮-এও এই আলোচনা বিস্তারিতভাবে আছে):

### Is shared implementation required?

যদি একাধিক subtype-এর মধ্যে সত্যিকারের common, reusable **code** (শুধু signature নয়, actual logic) শেয়ার করার প্রয়োজন হয় — যেমন একটি common validation routine, বা একটি template algorithm-এর কিছু ধাপ — তাহলে abstract class একটি স্বাভাবিক fit, কারণ এটি concrete method সরাসরি রাখতে পারে। যদি শুধু "প্রতিটি implementer-এর এই operation-টি থাকা উচিত" এই ধরনের contract দরকার হয় (কোনো shared logic ছাড়াই), তাহলে interface যথেষ্ট।

### Is shared state required?

যদি সব subtype-এর একটি common field/state দরকার হয় (যেমন উপরে `ReportExporter`-এর `Clock clock`, দেখুন প্রশ্ন ১৬) — যা প্রতিটি subclass constructor-এর মাধ্যমে পায় — তাহলে abstract class উপযুক্ত, কারণ interface-এ (Java-তে) instance field রাখা যায় না। Shared state না থাকলে interface যথেষ্ট।

### Are unrelated classes expected to support the same capability?

যদি সম্পূর্ণ ভিন্ন, একে অপরের সাথে conceptually-অসম্পর্কিত class-গুলো একই capability মেনে চলার প্রয়োজন হয় (যেমন `EmailSender` এবং `SmsSender`, যাদের মধ্যে কোনো common ancestry নেই, শুধু একটি common `send()` capability আছে) — তাহলে interface একমাত্র বাস্তবসম্মত option, কারণ একাধিক class একটি common abstract class থেকে inherit করতে গেলে (যদি তাদের অন্যকোনো ইতিমধ্যে-বিদ্যমান inheritance সম্পর্ক থাকে) ভাষার single-inheritance সীমাবদ্ধতার সাথে সংঘর্ষ হতে পারে। একটি class একাধিক interface implement করতে পারে, কিন্তু (বেশিরভাগ mainstream ভাষায়) মাত্র একটি class extend করতে পারে।

**সংক্ষিপ্ত rule of thumb:** shared implementation/state + closely-related subtype family → **abstract class**। শুধু contract + potentially unrelated implementer-রা → **interface**।

---

## 114. How do you decide between inheritance and composition?

### Is true behavioral substitutability present?

মূল প্রশ্নটি হলো: "একটি child object কি সব জায়গায় parent object-এর জায়গায় নিরাপদে ব্যবহার করা যাবে, program-এর correctness না ভেঙেই?" (এটাই Liskov Substitution Principle-এর মূল test, দেখুন প্রশ্ন ১০৩)। যদি উত্তর হ্যাঁ হয় — সত্যিকারের is-a সম্পর্ক এবং behavioral compatibility আছে — তাহলে inheritance যুক্তিসঙ্গত। যদি সম্পর্কটি শুধু "কিছু common attribute/method আছে" (কিন্তু behavior সম্পূর্ণ compatible নয়, যেমন `Square`/`Rectangle` বা `Penguin`/`Bird`-এর `fly()` উদাহরণ) — তাহলে inheritance ভুল পছন্দ, এবং composition বা একটি ভিন্ন abstraction (যেমন capability-interface) বেশি উপযুক্ত।

### Is behavior likely to change independently?

যদি একটি object-এর behavior-এর একটি অংশ (যেমন "কীভাবে discount গণনা করা হয়", বা "কীভাবে data serialize করা হয়") ভবিষ্যতে independently, runtime-এ, বা একাধিক ভিন্ন combination-এ বদলানোর সম্ভাবনা থাকে, তাহলে composition অনেক বেশি flexible: একটি আলাদা, injectable object (Strategy pattern, দেখুন প্রশ্ন ৭৪) সেই behavior-কে represent করতে পারে, এবং runtime-এই সেটি বদলানো যায়, নতুন subclass তৈরি না করেই। Inheritance এর তুলনায় rigid — behavior compile-time-এ class hierarchy দিয়ে fixed হয়ে যায়, এবং প্রতিটি নতুন combination-এর জন্য একটি নতুন subclass প্রয়োজন হতে পারে (দেখুন প্রশ্ন ৭৬-এর Decorator আলোচনায় combinatorial explosion সমস্যা)।

**সংক্ষিপ্ত heuristic:** "is-a এবং সবসময় সত্য" হলে inheritance বিবেচনা করা যায়; "has-a", "uses-a", বা "behavior পরিবর্তনশীল/pluggable" হলে composition প্রায় সবসময় নিরাপদ এবং flexible পছন্দ। সন্দেহ হলে composition-কে default হিসেবে বেছে নেওয়াই বেশিরভাগ আধুনিক OOP guideline-এর পরামর্শ ("favor composition over inheritance")।

---

## 115. How does good OOP design improve testability?

ভালো OOP design (clear responsibility, encapsulation, abstraction-based dependency) সরাসরি testability বাড়ায়, কারণ এটি একটি system-কে ছোট, স্বাধীনভাবে verify-যোগ্য অংশে ভাগ করে। একটি well-encapsulated object তার নিজের behavior-এর জন্য দায়ী, তাই সেই object-কে test করতে পুরো system চালানোর দরকার হয় না — শুধু সেই object-এর public contract-এর ওপর test লেখা যায়।

### Why are loosely coupled objects easier to test?

যদি একটি class অন্য class-গুলোর সাথে **tightly coupled** হয় (যেমন সরাসরি `new DatabaseConnection()` করে ভেতরে ব্যবহার করা), তাহলে সেই class-কে test করতে গেলে একটি real database লাগবে — যা test-কে ধীর, fragile (network/environment-নির্ভর), এবং setup-জটিল করে তোলে। **Loosely coupled** design-এ (dependency injection দিয়ে interface পাস করা, দেখুন প্রশ্ন ১৭), test-এর সময় একটি lightweight fake/mock implementation পাঠানো যায়, যা কোনো external resource ছাড়াই দ্রুত, deterministic ফলাফল দেয়।

### How do abstractions help with mocks, fakes, or alternate implementations?

Abstraction (interface) caller-কে concrete implementation থেকে decouple করে, যার একটি সরাসরি সুবিধা হলো test-time-এ সেই concrete implementation-এর জায়গায় একটি বিকল্প বসানো যায়:

```java
interface PaymentGateway {
    PaymentResult charge(Money amount);
}

class FakePaymentGateway implements PaymentGateway { // শুধু testing-এর জন্য
    public PaymentResult charge(Money amount) {
        return PaymentResult.success(); // কোনো real network call নেই
    }
}

// Test:
CheckoutService service = new CheckoutService(new FakePaymentGateway());
// এখন CheckoutService-এর logic test করা যায়, real payment processor ছাড়াই
```

যদি `CheckoutService` সরাসরি `StripeGateway` তৈরি করত (constructor-এর ভেতরে `new StripeGateway(...)`), তাহলে এই সহজ substitution সম্ভব হতো না — dependency injection-এর মাধ্যমে interface পাস করার সুযোগ থাকাটাই এই flexibility-র মূল কারণ। এই কারণেই "program to an interface" (প্রশ্ন ১১৭) নীতিটি শুধু flexibility-র জন্য নয়, testability-র জন্যও গুরুত্বপূর্ণ একটি design decision।

---

## 116. What are common OOP code smells?

**Code smell** হলো এমন একটি সংকেত যা নির্দেশ করে code-টি হয়তো compile ও run করছে ঠিকঠাক, কিন্তু তার underlying design-এ একটি সমস্যা লুকিয়ে আছে — এটি নিজে কোনো bug নয়, কিন্তু ভবিষ্যতে maintainability সমস্যা তৈরি করার সম্ভাবনা নির্দেশ করে।

### What are God Object, deep inheritance, duplicated behavior, feature envy, primitive obsession, and circular dependencies?

- **God Object:** একটি single class যা অতিরিক্ত অনেক দায়িত্ব বহন করে (দেখুন প্রশ্ন ১০৬-এর `OrderProcessor` উদাহরণ) — validation, persistence, notification, business logic — সবকিছু একসাথে, যা SRP-এর সরাসরি লঙ্ঘন।
- **Deep inheritance (hierarchy):** যখন একটি class hierarchy অনেকগুলো স্তর গভীর (যেমন `A → B → C → D → E`), তখন একটি নির্দিষ্ট method-এর actual behavior বুঝতে অনেকগুলো স্তর "ট্রেস" করতে হয়, এবং কোনো একটি স্তরে পরিবর্তন আনলে নিচের সব স্তরে অপ্রত্যাশিত প্রভাব পড়ার ঝুঁকি বাড়ে (fragile base class problem, প্রশ্ন ১০১-এ আলোচিত)।
- **Duplicated behavior:** একই logic একাধিক জায়গায় copy-paste করা থাকা — একটি bug fix বা rule পরিবর্তন করতে হলে সব জায়গায় খুঁজে খুঁজে পরিবর্তন করতে হয়, এবং কোনো একটি জায়গা মিস হয়ে গেলে inconsistency তৈরি হয়।
- **Feature envy:** একটি method যেটি নিজের class-এর data-র চেয়ে অন্য কোনো class-এর data নিয়ে বেশি কাজ করে — এটি ইঙ্গিত দেয় যে সেই method-টি হয়তো ভুল class-এ আছে, এটি বরং সেই অন্য class-এই থাকা উচিত ছিল (encapsulation দুর্বল হওয়ার একটি সংকেত)।
- **Primitive obsession:** domain concept (যেমন money, email address, phone number) represent করতে plain primitive type (যেমন `double`, `String`) ব্যবহার করা, একটি dedicated value-object type তৈরি না করে — এর ফলে validation logic ছড়িয়ে-ছিটিয়ে থাকে এবং type system domain-নির্দিষ্ট ভুল (যেমন একটি email-এর জায়গায় ভুলবশত একটি phone number পাস করে দেওয়া, যেহেতু দুটোই `String`) ধরতে পারে না।
- **Circular dependencies:** যখন class `A`, class `B`-এর ওপর নির্ভর করে, এবং `B`-ও `A`-এর ওপর নির্ভর করে — এটি সেই দুটি class-কে effectively একটি single, অবিচ্ছেদ্য unit-এ পরিণত করে, একটিকে বুঝতে বা টেস্ট করতে অন্যটিও দরকার হয়ে পড়ে, এবং modular reasoning ভেঙে যায়।

### How can these smells indicate design problems?

এই smell-গুলোর প্রতিটিই একটি সাধারণ underlying সমস্যার ভিন্ন প্রকাশ: **responsibility ভুলভাবে বণ্টিত হয়েছে**, অথবা **coupling খুব বেশি, cohesion খুব কম** (দেখুন প্রশ্ন ১২০)। এগুলো compile-time বা এমনকি runtime error তৈরি করে না — code পুরোপুরি কাজ করতে পারে — কিন্তু এগুলো ভবিষ্যতে পরিবর্তন আনা কঠিন, ঝুঁকিপূর্ণ এবং ব্যয়বহুল করে তোলে। এই কারণেই code smell চেনা গুরুত্বপূর্ণ: এগুলো "এখনই ভাঙা" জিনিসের সংকেত নয়, বরং "ভবিষ্যতে সমস্যা তৈরি করবে" এমন জিনিসের প্রাথমিক সতর্কবার্তা।

---

## 117. What does "program to an interface, not an implementation" mean?

এই নীতিটি বলে: caller code-কে সবসময় একটি **abstraction** (interface, বা abstract class)-এর ওপর নির্ভর করা উচিত, কোনো নির্দিষ্ট **concrete class**-এর ওপর সরাসরি নির্ভর করা উচিত নয় — এমনকি যদি বর্তমানে শুধুমাত্র একটি concrete implementation-ই বিদ্যমান থাকে।

```java
// ভুল: concrete implementation-এর ওপর সরাসরি নির্ভরতা
class OrderService {
    private final MySqlOrderRepository repository = new MySqlOrderRepository();
}

// ভালো: abstraction-এর ওপর নির্ভরতা
class OrderService {
    private final OrderRepository repository; // interface

    OrderService(OrderRepository repository) { // concrete implementation বাইরে থেকে injected
        this.repository = repository;
    }
}
```

এখানে `OrderService` জানে শুধু এটুকু: "কোনো একটি `OrderRepository` আমাকে order save করতে সাহায্য করবে" — কীভাবে (MySQL, PostgreSQL, in-memory, ইত্যাদি) সেই detail তার জানার দরকার নেই।

### Why does this improve flexibility and testability?

**Flexibility:** যেহেতু `OrderService` কোনো নির্দিষ্ট database technology-র নাম জানে না, ভবিষ্যতে database বদলানো (MySQL থেকে PostgreSQL, বা এমনকি একটি সম্পূর্ণ ভিন্ন storage mechanism-এ) সম্ভব হয় শুধু একটি নতুন `OrderRepository` implementation লিখে, `OrderService`-এর কোনো কোড না ছুঁয়েই। **Testability:** test-এর সময় একটি real database-এর বদলে একটি in-memory fake `OrderRepository` পাস করা যায় (দেখুন প্রশ্ন ১১৫), যা test-কে দ্রুত এবং deterministic করে তোলে। মূলত এই নীতিটি হলো encapsulation এবং abstraction-এর একটি practical, actionable rule — "কোন জিনিসের ওপর নির্ভর করবো" সিদ্ধান্ত নেওয়ার সময় সবসময় সবচেয়ে narrow, stable contract বেছে নেওয়া, সবচেয়ে specific implementation নয়।

---

## 118. What does "encapsulate what varies" mean?

এই নীতিটি বলে: একটি system-এর যে অংশটি **সময়ের সাথে বদলাতে পারে বা একাধিক variant-এ থাকতে পারে**, সেটিকে চিহ্নিত করে একটি আলাদা, isolated abstraction-এর পেছনে "encapsulate" (বন্দি) করে রাখা উচিত, যাতে সেই পরিবর্তনশীল অংশটি বাকি, স্থিতিশীল code-কে প্রভাবিত না করে। বিপরীতভাবে, যা **বদলায় না**, সেটিকে stable code-এই রাখা যায়, কোনো অতিরিক্ত abstraction ছাড়াই।

উদাহরণস্বরূপ, প্রশ্ন ৭৪-এর discount উদাহরণে: "discount কীভাবে গণনা করা হবে" — এই অংশটিই ভবিষ্যতে বদলাতে পারে (নতুন discount type যোগ হতে পারে), তাই সেটিকে `DiscountStrategy` interface-এর পেছনে encapsulate করা হয়েছে। কিন্তু "checkout-এর সময় discount apply করে final price বের করা" — এই overall workflow-টি স্থিতিশীল, তাই সেটি `PriceCalculator`-এর মধ্যে সরাসরি, plain code হিসেবে থেকে যায়।

### How does this idea appear in Strategy, Factory, and other patterns?

- **Strategy:** "কোন algorithm ব্যবহার হবে" — এই পরিবর্তনশীল অংশটি একটি interface-এর পেছনে encapsulate করা হয় (দেখুন প্রশ্ন ৭৪), caller সেই variation থেকে সম্পূর্ণ অপরিবর্তিত থাকে।
- **Factory Method/Abstract Factory:** "কোন concrete class-এর object তৈরি হবে" — এই পরিবর্তনশীল সিদ্ধান্তটি factory-র পেছনে encapsulate করা হয় (দেখুন প্রশ্ন ৭২), caller code শুধু abstraction-এর মাধ্যমে object পায়, creation logic-এর কোনো পরিবর্তনের প্রভাব caller-এ পৌঁছায় না।
- **Decorator:** "কোন additional behavior যোগ করা হবে" — এই পরিবর্তনশীল combination-টি individual decorator class-এ encapsulate করা হয় (দেখুন প্রশ্ন ৭৬), মূল object-এর class স্পর্শ না করেই।
- **Observer:** "কারা event-এ react করবে, এবং কীভাবে" — এই পরিবর্তনশীল অংশ (observer-দের তালিকা এবং তাদের individual behavior) subject class থেকে সম্পূর্ণ আলাদা রাখা হয় (দেখুন প্রশ্ন ৭৫)।

মূলত এই একটি নীতিই বেশিরভাগ classic design pattern-এর অন্তর্নিহিত motivation — প্রতিটি pattern কোনো না কোনো নির্দিষ্ট ধরনের "variation"-কে কীভাবে সবচেয়ে ভালোভাবে isolate করা যায়, তার একটি প্রমাণিত সমাধান দেয়।

---

## 119. Can a program use classes everywhere and still have poor OOP design?

**হ্যাঁ, absolutely — এবং এটি খুবই common।** শুধু `class` keyword ব্যবহার করা, বা syntax-level OOP feature (inheritance, method) ব্যবহার করা মানেই ভালো object-oriented design নয়। একটি খুবই সাধারণ উদাহরণ হলো **anemic domain model**: যেখানে সব class শুধু data ধারণ করে (fields + getter/setter), কোনো real behavior/logic ছাড়াই, এবং সব actual logic আলাদা "Service" বা "Manager" class-এ থাকে যা সেই data-object-গুলোকে বাইরে থেকে manipulate করে — এটি structurally OOP (classes ব্যবহার করছে) কিন্তু conceptually procedural programming, শুধু class syntax-এ মোড়ানো:

```java
// "Anemic" — শুধু data, কোনো behavior নেই
class Order {
    public List<Item> items;
    public String status;
    public double total;
}

// পুরো logic বাইরে, একটি "service" class-এ
class OrderService {
    void confirmOrder(Order order) {
        if (order.status.equals("SHIPPED")) throw new IllegalStateException();
        order.status = "CONFIRMED"; // Order নিজে তার নিজের invariant রক্ষা করছে না
    }
}
```

এখানে `Order`-এর নিজের কোনো method নেই যা তার state protect করে — যেকোনো বাইরের code `order.status = "..."` লিখে সরাসরি বদলে দিতে পারে, encapsulation সম্পূর্ণভাবে অনুপস্থিত (দেখুন প্রশ্ন ১০২)।

### What characteristics actually make a design object-oriented?

সত্যিকারের ভালো object-oriented design চেনা যায় `class` keyword-এর উপস্থিতি দিয়ে নয়, বরং এই characteristics দিয়ে:

- **State এবং behavior একসাথে থাকে:** `Order`-এর নিজেরই `confirm()` method থাকা উচিত, যা তার নিজের `status` পরিবর্তনের rule enforce করে — বাইরের কোনো "service"-এর সরাসরি field বদলে দেওয়া নয়।
- **Invariant protected থাকে:** object কখনো invalid state-এ পৌঁছাতে পারে না, কারণ তার নিজের method-ই সেই নিশ্চয়তা দেয়।
- **Caller implementation detail থেকে decoupled থাকে:** abstraction ব্যবহার করে caller "কী করা যায়" জানে, "কীভাবে" জানার দরকার হয় না।
- **Responsibility স্পষ্টভাবে বণ্টিত:** প্রতিটি class-এর একটি নির্দিষ্ট, focused দায়িত্ব থাকে (SRP), কোনো "God Object" নয়।

সংক্ষেপে: OOP-এর মূল প্রতিশ্রুতি (encapsulation, meaningful abstraction, protected invariant) বাস্তবে প্রয়োগ হচ্ছে কিনা, সেটাই আসল পরীক্ষা — শুধু class syntax ব্যবহার হচ্ছে কিনা নয়।

---

## 120. How would you evaluate whether an OOP design is good?

একটি design ভালো কিনা মূল্যায়ন করার জন্য কয়েকটি নির্দিষ্ট, actionable প্রশ্ন জিজ্ঞেস করা যায়, প্রতিটি এই ডকুমেন্টে আলোচিত ধারণাগুলোর সাথে সরাসরি সংযুক্ত:

### Are responsibilities clear?

প্রতিটি class/module-এর কি একটি স্পষ্ট, single, describe-করা-সহজ দায়িত্ব আছে (SRP, প্রশ্ন ১০৬)? একটি class-এর নাম এবং তার actual content যদি না মেলে (যেমন একটি "Validator" class যেটা database access-ও করছে), সেটি একটি লাল পতাকা।

### Are object invariants protected?

State পরিবর্তনের সব পথ কি controlled এবং validated (encapsulation, প্রশ্ন ৯, ১০২)? নাকি কোনো বাইরের code যেকোনো সময় object-কে একটি invalid state-এ ফেলে দিতে পারে?

### Is coupling reasonable?

Class-গুলো কি একে অপরের internal implementation detail-এর ওপর নির্ভর করছে, নাকি শুধু stable abstraction-এর ওপর (প্রশ্ন ১১৭)? একটি class পরিবর্তন করলে কতগুলো অন্য class-এ ঢেউ ছড়ায় — এই সংখ্যা যত কম, coupling তত ভালো।

### Is cohesion high?

একটি class-এর ভেতরের সব field/method কি সত্যিকারের সম্পর্কিত এবং একে অপরের সাথে একসাথে কাজ করে (high cohesion), নাকি সেগুলো শুধু "কাকতালীয়ভাবে" একই class-এ রাখা হয়েছে (low cohesion, প্রায়ই God Object-এর লক্ষণ, প্রশ্ন ১১৬)?

### Can the design be extended without modifying unrelated code?

নতুন feature/variant যোগ করতে কি existing, ইতিমধ্যে-কাজ-করা code পরিবর্তন করতে হয়, নাকি শুধু নতুন code যোগ করলেই যথেষ্ট (Open/Closed Principle, প্রশ্ন ১০৮)? এই একটি প্রশ্নই প্রায়ই সবচেয়ে ভালোভাবে predict করে একটি codebase ভবিষ্যতে কতটা maintain করা সহজ হবে।

### Is the design easy to test and understand?

একটি নির্দিষ্ট class/method-এর behavior verify করতে কি পুরো system চালানোর দরকার হয়, নাকি সেটি isolation-এ test করা যায় (testability, প্রশ্ন ১১৫)? এবং একজন নতুন developer কি কোডটি পড়ে যুক্তিসঙ্গত সময়ে বুঝতে পারবে সেটি কী করছে এবং কেন?

এই ছয়টি প্রশ্নের কোনোটিরই একটি সহজ, yes/no, স্বয়ংক্রিয়ভাবে পরিমাপযোগ্য উত্তর নেই — ভালো OOP design মূল্যায়ন করা তাই সবসময় কিছুটা judgment-নির্ভর থেকে যায়। কিন্তু এই প্রশ্নগুলো ধারাবাহিকভাবে জিজ্ঞেস করার অভ্যাস একটি design-কে সময়ের সাথে সাথে ভালো দিকে চালিত করে, এবং এই পুরো document-এ আলোচিত প্রতিটি ধারণা (encapsulation, abstraction, SOLID principle, design pattern) আসলে এই ছয়টি মূল প্রশ্নেরই বিভিন্ন, নির্দিষ্ট প্রয়োগ।

---