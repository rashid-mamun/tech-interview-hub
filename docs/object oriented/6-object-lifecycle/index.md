---
sidebar_position: 6
title: 'Object Lifecycle'
---


## 🛠️ 25. What is a constructor, and how does it differ from a regular method?

**Constructor** হলো special block/method-like structure যা object তৈরি হওয়ার সময় automatically call হয়। Java তে constructor object এর initial state setup করে।

Constructor characteristics:

- class name এর same name হয়
- return type থাকে না, `void` ও না
- `new` keyword দিয়ে object create করলে call হয়
- field initialize, validation, dependency inject করতে use হয়

```java
public class User {
    private final String name;
    private final String email;

    public User(String name, String email) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }
}
```

Object creation flow:

```text
new User("Rahim", "rahim@example.com")
        |
        v
allocate memory on heap
        |
        v
initialize fields with default values
        |
        v
run constructor body
        |
        v
return object reference
```

Constructor vs regular method:

| বিষয় | Constructor | Regular Method |
|---|---|---|
| Purpose | object initialize করা | behavior execute করা |
| Name | class name same | any valid method name |
| Return type | নেই | থাকে, `void` হতে পারে |
| Call | `new` এর সময় automatic | manually call করতে হয় |
| Inheritance | inherited হয় না | inherited হতে পারে |

### What is a default constructor, and when is it automatically provided by the compiler?

যদি class এ কোনো constructor explicitly না লিখি, Java compiler automatically no-argument default constructor দেয়।

```java
public class Product {
    private String name;
}
```

Compiler conceptually adds:

```java
public class Product {
    private String name;

    public Product() {
        super();
    }
}
```

But যদি তুমি কোনো constructor লিখে ফেলো, compiler আর default constructor দেয় না।

```java
public class Product {
    private final String name;

    public Product(String name) {
        this.name = name;
    }
}

// new Product(); // compile error
```

### What is a parameterized constructor, and how does constructor overloading work?

**Parameterized constructor** argument নিয়ে object initialize করে।

**Constructor overloading** মানে same class এ multiple constructor রাখা, parameter list আলাদা।

```java
public class Rectangle {
    private final int width;
    private final int height;

    public Rectangle() {
        this(1, 1);
    }

    public Rectangle(int size) {
        this(size, size);
    }

    public Rectangle(int width, int height) {
        if (width <= 0 || height <= 0) {
            throw new IllegalArgumentException("Width and height must be positive");
        }
        this.width = width;
        this.height = height;
    }

    public int area() {
        return width * height;
    }
}
```

```text
new Rectangle()      -> 1 x 1
new Rectangle(5)     -> 5 x 5
new Rectangle(4, 6)  -> 4 x 6
```

---

## 🔗 26. What is constructor chaining, and how is it implemented (e.g., `this()`/`super()` calls)?

**Constructor chaining** হলো এক constructor থেকে আরেক constructor call করা, যাতে initialization logic duplicate না হয়।

Java তে:

- `this(...)` same class এর another constructor call করে
- `super(...)` parent class constructor call করে
- `this(...)` বা `super(...)` constructor body এর first statement হতে হবে

**Same class chaining:**

```java
public class Customer {
    private final String name;
    private final String email;
    private final boolean active;

    public Customer(String name) {
        this(name, "unknown@example.com");
    }

    public Customer(String name, String email) {
        this(name, email, true);
    }

    public Customer(String name, String email, boolean active) {
        this.name = name;
        this.email = email;
        this.active = active;
    }
}
```

```text
new Customer("Rahim")
    -> Customer(String name)
        -> this(name, "unknown@example.com")
            -> Customer(String name, String email)
                -> this(name, email, true)
                    -> main constructor
```

### In what order are constructors called in a class hierarchy during object creation?

Object create হলে parent constructor আগে চলে, তারপর child constructor।

```java
class Animal {
    public Animal() {
        System.out.println("Animal constructor");
    }
}

class Dog extends Animal {
    public Dog() {
        super();
        System.out.println("Dog constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        new Dog();
    }
}
```

```text
Output:
Animal constructor
Dog constructor
```

Order:

```text
1. Object memory allocated
2. Fields default values
3. Parent constructor chain runs top-down
4. Child field initializers run
5. Child constructor body runs
```

More detailed example:

```java
class Parent {
    private String parentField = initParentField();

    public Parent() {
        System.out.println("Parent constructor");
    }

    private String initParentField() {
        System.out.println("Parent field init");
        return "parent";
    }
}

class Child extends Parent {
    private String childField = initChildField();

    public Child() {
        System.out.println("Child constructor");
    }

    private String initChildField() {
        System.out.println("Child field init");
        return "child";
    }
}
```

```text
new Child() output:
Parent field init
Parent constructor
Child field init
Child constructor
```

Important warning: constructor থেকে overridable method call করা risky, কারণ child object fully initialized না হওয়ার আগেই overridden method run করতে পারে।

---

## 📋 27. What is a copy constructor, and when is it used?

**Copy constructor** হলো এমন constructor যা same class এর another object নিয়ে নতুন object তৈরি করে।

Java built-in copy constructor দেয় না, কিন্তু manually লেখা যায়।

```java
public class Address {
    private String city;
    private String street;

    public Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

    public Address(Address other) {
        this.city = other.city;
        this.street = other.street;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCity() {
        return city;
    }
}
```

```java
public class User {
    private String name;
    private Address address;

    public User(String name, Address address) {
        this.name = name;
        this.address = new Address(address);
    }

    public User(User other) {
        this.name = other.name;
        this.address = new Address(other.address);
    }
}
```

Use cases:

- object clone করতে
- defensive copy বানাতে
- mutable object sharing avoid করতে
- snapshot/state copy রাখতে

### What is the difference between a shallow copy and a deep copy?

**Shallow copy** reference fields এর reference copy করে। Nested object same থাকে।

**Deep copy** nested object এর নতুন copy তৈরি করে।

```text
Original User
   |
   v
Address("Dhaka")

Shallow copy:
Copied User ----+
                |
Original User --+--> same Address object

Deep copy:
Original User -> Address("Dhaka")
Copied User   -> Address("Dhaka") separate object
```

Shallow copy example:

```java
class ShallowUser {
    private String name;
    private Address address;

    public ShallowUser(String name, Address address) {
        this.name = name;
        this.address = address; // same reference
    }

    public ShallowUser(ShallowUser other) {
        this.name = other.name;
        this.address = other.address; // shallow copy
    }
}
```

Deep copy example:

```java
class DeepUser {
    private String name;
    private Address address;

    public DeepUser(String name, Address address) {
        this.name = name;
        this.address = new Address(address);
    }

    public DeepUser(DeepUser other) {
        this.name = other.name;
        this.address = new Address(other.address);
    }
}
```

### What problems can arise from a shallow copy of an object containing references/pointers?

Problem: shared mutable nested object.

```java
public class ShallowCopyDemo {
    public static void main(String[] args) {
        Address address = new Address("Dhaka", "Road 1");

        ShallowUser user1 = new ShallowUser("Rahim", address);
        ShallowUser user2 = new ShallowUser(user1);

        address.setCity("Chittagong");

        // user1 and user2 both see changed address if they share same Address reference
    }
}
```

Potential issues:

- accidental mutation
- hard-to-track bugs
- thread-safety problem
- object invariants break
- defensive copy missing হলে encapsulation break হয়

Guideline:

```text
If field type is immutable, shallow copy is usually okay.
If field type is mutable, consider deep copy or immutable design.
```

---

## 🧹 28. What is a destructor (or finalizer), and how does its role differ across languages?

**Destructor** হলো object destroy হওয়ার সময় resource cleanup করার special method. C++ এ destructor deterministic, object scope শেষ হলে run হয়।

Java তে C++ style destructor নেই। Java memory garbage collector manage করে। কিন্তু file/socket/database connection এর মতো external resource manually close করতে হয়।

Java replacement:

- `AutoCloseable`
- `try-with-resources`
- explicit `close()`

```java
class FileResource implements AutoCloseable {
    public FileResource() {
        System.out.println("Opening file");
    }

    public void read() {
        System.out.println("Reading file");
    }

    @Override
    public void close() {
        System.out.println("Closing file");
    }
}

public class Main {
    public static void main(String[] args) {
        try (FileResource resource = new FileResource()) {
            resource.read();
        }
    }
}
```

```text
Output:
Opening file
Reading file
Closing file
```

### Why doesn't Java have destructors in the same sense as C++, and what replaces them?

Java object memory cleanup timing non-deterministic। Garbage collector decide করে কখন unreachable object collect হবে। তাই destructor এর মতো exact time এ cleanup guarantee নেই।

Use this instead:

```text
Memory cleanup -> Garbage Collector
External resource cleanup -> close() / try-with-resources
```

Example with standard Java:

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileExample {
    public static void main(String[] args) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
            System.out.println(reader.readLine());
        }
    }
}
```

`try-with-resources` block শেষে `reader.close()` automatically call করে।

### What is the difference between a destructor and a garbage collector's finalize method?

Java historically `finalize()` method ছিল, কিন্তু এটা deprecated and unreliable। Use করা উচিত না।

| Concept | Destructor | Java `finalize()` |
|---|---|---|
| Timing | deterministic in languages like C++ | non-deterministic |
| Purpose | resource cleanup | GC before collection hook |
| Reliability | predictable | not reliable |
| Java recommendation | not available | avoid |
| Replacement | `close()` / `AutoCloseable` | try-with-resources |

Why avoid `finalize()`:

- কখন run হবে guarantee নেই
- run নাও হতে পারে before program exits
- performance overhead
- object resurrection problem হতে পারে

---

## ♻️ 29. How does garbage collection relate to object lifecycle management in OOP languages?

**Garbage Collection (GC)** হলো runtime system এর memory management process। Java তে programmer manually `delete` করে না। GC unreachable object find করে memory reclaim করে।

Object lifecycle:

```text
new object created
      |
      v
reachable from stack/static/other objects
      |
      v
used by program
      |
      v
no reachable references
      |
      v
eligible for garbage collection
      |
      v
memory reclaimed by GC
```

Example:

```java
public class Main {
    public static void main(String[] args) {
        User user = new User("Rahim", "rahim@example.com");

        user = null; // object no longer reachable through this variable

        // GC may collect it later, timing not guaranteed
    }
}
```

### What is reference counting, and how does it differ from mark-and-sweep garbage collection?

**Reference counting** প্রতিটি object এর reference count রাখে। Count zero হলে object immediately free করা যায়।

```text
Object A refCount = 2
one reference removed -> refCount = 1
another removed -> refCount = 0 -> free
```

Problem: cycles.

```text
A -> B
B -> A

External reference নেই,
কিন্তু A and B each other কে reference করছে।
refCount zero হয় না।
```

**Mark-and-sweep** root থেকে reachable object mark করে। Unmarked object sweep করে।

```text
Roots:
- local variables
- static fields
- active threads

Mark phase:
roots থেকে reachable সব object mark

Sweep phase:
unmarked object memory reclaim
```

Java GC mark-and-sweep family এর advanced generational algorithms use করে। Exact GC algorithm JVM/version/config অনুযায়ী vary করে।

### What is a memory leak in a garbage-collected language, and how can it still occur?

GC থাকা সত্ত্বেও memory leak হতে পারে যদি unused object এখনো reachable থাকে।

```text
Object actually not needed
but still referenced from:
- static collection
- cache
- listener
- thread local
- long-lived map

GC দেখে reachable, তাই collect করে না।
```

Example: static list leak.

```java
import java.util.ArrayList;
import java.util.List;

public class EventStore {
    private static final List<byte[]> EVENTS = new ArrayList<>();

    public static void addEvent(byte[] eventPayload) {
        EVENTS.add(eventPayload);
    }
}
```

If `EVENTS` never removes old data, memory keeps growing.

Listener leak example:

```java
import java.util.ArrayList;
import java.util.List;

interface Listener {
    void onEvent();
}

class EventBus {
    private final List<Listener> listeners = new ArrayList<>();

    public void register(Listener listener) {
        listeners.add(listener);
    }

    public void unregister(Listener listener) {
        listeners.remove(listener);
    }
}
```

যদি object listener হিসেবে register হয় কিন্তু unregister না হয়, `EventBus` reference ধরে রাখে, তাই object collect হবে না।

Prevention:

- collection/cache size limit রাখা
- listener unregister করা
- `try-with-resources` use করা
- unnecessary static references avoid করা
- weak references use করা when appropriate
- profiling tools দিয়ে heap inspect করা

**Important distinction:**

```text
GC manages memory.
GC does not automatically close files, sockets, database connections.
```

External resources always explicitly close করতে হবে।

---
