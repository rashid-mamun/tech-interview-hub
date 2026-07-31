---
sidebar_position: 7
title: 'Static vs Instance'
---


## 🏷️ 30. What is the difference between static and instance members (fields and methods)?

Java তে **instance member** object-specific, আর **static member** class-level shared member।

```text
Instance field/method:
প্রতিটি object নিজের copy/state পায়।

Static field/method:
Class এর সাথে attached, সব object share করে।
```

**Memory idea:**

```text
Class area:
User.totalUsers = 2     <- static field, one shared copy

Heap:
u1 object:
  name = "Rahim"        <- instance field

u2 object:
  name = "Nadia"        <- instance field
```

```java
public class User {
    private static int totalUsers = 0; // static/class-level

    private final String name;         // instance-level

    public User(String name) {
        this.name = name;
        totalUsers++;
    }

    public String getName() {          // instance method
        return name;
    }

    public static int getTotalUsers() { // static method
        return totalUsers;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        User u1 = new User("Rahim");
        User u2 = new User("Nadia");

        System.out.println(u1.getName());       // Rahim
        System.out.println(u2.getName());       // Nadia
        System.out.println(User.getTotalUsers()); // 2
    }
}
```

### Why can't a static method access instance variables directly?

Static method class-level. It can run without any object. Instance variable object-level, so Java needs to know **which object** এর field access করবে।

```java
public class Counter {
    private int value = 10;

    public static void printValue() {
        // System.out.println(value); // compile error
    }
}
```

Why error:

```text
Counter.printValue()

এখানে কোনো Counter object নেই।
তাহলে কোন object's value print করবে?
```

Correct way:

```java
public class Counter {
    private int value = 10;

    public static void printValue(Counter counter) {
        System.out.println(counter.value);
    }
}
```

Static method instance data access করতে পারে only if object reference explicitly দেওয়া হয়।

### When would you use a static method vs an instance method?

Use **static method** when behavior object state এর উপর depend করে না।

Examples:

- utility/helper method
- factory method
- validation
- conversion
- constants related logic

```java
public final class StringUtils {
    private StringUtils() {
    }

    public static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
```

Use **instance method** when behavior object state read/update করে।

```java
public class BankAccount {
    private double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void deposit(double amount) {
        balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

Decision:

```text
Does method need this object's state?
Yes -> instance method
No  -> static method can fit
```

---

## 🧱 31. What is a static (or class-level) variable, and how is it shared across instances?

**Static variable** class এর একটা shared field। সব object একই value দেখে।

```java
public class Order {
    private static int nextId = 1;

    private final int id;

    public Order() {
        this.id = nextId;
        nextId++;
    }

    public int getId() {
        return id;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Order o1 = new Order();
        Order o2 = new Order();
        Order o3 = new Order();

        System.out.println(o1.getId()); // 1
        System.out.println(o2.getId()); // 2
        System.out.println(o3.getId()); // 3
    }
}
```

**Shared state diagram:**

```text
Order.nextId = 4

o1.id = 1
o2.id = 2
o3.id = 3

nextId একটাই shared counter,
কিন্তু id প্রতিটি object এর own copy।
```

### What are common use cases for static variables (e.g., counters, constants, singletons)?

Common use cases:

1. **Constants**

```java
public final class AppConfig {
    public static final int MAX_LOGIN_ATTEMPTS = 5;
    public static final String DEFAULT_CURRENCY = "BDT";

    private AppConfig() {
    }
}
```

2. **Counters**

```java
public class UserSession {
    private static int activeSessionCount = 0;

    public UserSession() {
        activeSessionCount++;
    }

    public static int getActiveSessionCount() {
        return activeSessionCount;
    }
}
```

3. **Singleton instance**

```java
public final class AppLogger {
    private static final AppLogger INSTANCE = new AppLogger();

    private AppLogger() {
    }

    public static AppLogger getInstance() {
        return INSTANCE;
    }

    public void log(String message) {
        System.out.println(message);
    }
}
```

Warning:

```text
Mutable static state বেশি হলে:
- tests flaky হতে পারে
- concurrency bug হতে পারে
- hidden dependency তৈরি হয়
```

Constants are safe. Mutable static variables carefully use করতে হয়।

---

## 🏛️ 32. What is a static nested class (or inner class), and how does it differ from a non-static inner class?

Java তে nested class দুই রকম:

1. **Static nested class**
2. **Non-static inner class**

**Static nested class** outer class এর instance ছাড়াই create করা যায়। It does not automatically hold outer object reference.

**Non-static inner class** outer class instance এর সাথে attached থাকে এবং outer instance member access করতে পারে।

```text
Outer
├── static nested class
│   └── no automatic outer object reference
└── non-static inner class
    └── has outer object reference
```

Static nested class example:

```java
public class HttpResponse {
    private final int statusCode;
    private final String body;

    private HttpResponse(Builder builder) {
        this.statusCode = builder.statusCode;
        this.body = builder.body;
    }

    public static class Builder {
        private int statusCode = 200;
        private String body = "";

        public Builder statusCode(int statusCode) {
            this.statusCode = statusCode;
            return this;
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public HttpResponse build() {
            return new HttpResponse(this);
        }
    }
}
```

```java
HttpResponse response = new HttpResponse.Builder()
        .statusCode(201)
        .body("Created")
        .build();
```

Non-static inner class example:

```java
public class ShoppingCart {
    private final String owner;

    public ShoppingCart(String owner) {
        this.owner = owner;
    }

    public class CartItem {
        private final String productName;

        public CartItem(String productName) {
            this.productName = productName;
        }

        public String describe() {
            return owner + " has item " + productName;
        }
    }
}
```

```java
ShoppingCart cart = new ShoppingCart("Rahim");
ShoppingCart.CartItem item = cart.new CartItem("Keyboard");
System.out.println(item.describe());
```

### What is the relationship between a non-static inner class and its enclosing class instance?

Non-static inner class hidden reference রাখে enclosing object এর দিকে।

```text
cart object
 owner = "Rahim"
     ^
     |
CartItem object has hidden reference to cart
 productName = "Keyboard"
```

Because of this:

- inner class outer instance fields access করতে পারে
- inner class object create করতে outer object লাগে
- accidental memory leak হতে পারে যদি inner object long-lived হয় and outer object ধরে রাখে

Guideline:

```text
If nested class does not need outer object state,
make it static.
```

---

## 🎯 33. What is a static initializer block (or static constructor), and when is it executed?

**Static initializer block** class load/init হওয়ার সময় একবার execute হয়। Java তে C# এর মতো named static constructor নেই, কিন্তু `static { ... }` block আছে।

Use cases:

- static data initialize করা
- complex constant map/list build করা
- one-time class-level setup

```java
import java.util.HashMap;
import java.util.Map;

public class CountryCodes {
    public static final Map<String, String> CODES;

    static {
        CODES = new HashMap<>();
        CODES.put("BD", "Bangladesh");
        CODES.put("US", "United States");
        CODES.put("IN", "India");
        System.out.println("CountryCodes initialized");
    }

    private CountryCodes() {
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Before access");
        System.out.println(CountryCodes.CODES.get("BD"));
        System.out.println(CountryCodes.CODES.get("US"));
    }
}
```

```text
Output:
Before access
CountryCodes initialized
Bangladesh
United States
```

Static block runs once, before first active use of class.

Execution order:

```text
1. static fields in declaration order
2. static initializer blocks in declaration order
3. instance fields/blocks when object created
4. constructor body
```

Example:

```java
public class InitOrder {
    static String staticField = print("static field");

    static {
        print("static block");
    }

    String instanceField = print("instance field");

    public InitOrder() {
        print("constructor");
    }

    private static String print(String message) {
        System.out.println(message);
        return message;
    }
}
```

```text
new InitOrder()

Output:
static field
static block
instance field
constructor
```

---
