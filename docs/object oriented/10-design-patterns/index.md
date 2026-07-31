---
sidebar_position: 10
title: 'Design Patterns'
---


## 🗂️ 43. What are design patterns, and why are they useful in OOP?

**Design Pattern** হলো common software design problem এর reusable solution template। এটা ready-made code না; বরং proven design idea।

Example:

```text
Problem:
অনেক payment method support করতে হবে.

Pattern:
Strategy

Idea:
Payment behavior কে interface এর পেছনে রাখো,
runtime এ implementation swap করো.
```

Why useful:

- common vocabulary দেয়
- maintainable design করতে সাহায্য করে
- repeated design problem solve করে
- SOLID principles apply করা সহজ করে
- code extension safer করে

### What is the difference between creational, structural, and behavioral design patterns?

| Category | Focus | Examples |
|---|---|---|
| Creational | object creation কীভাবে হবে | Singleton, Factory Method, Abstract Factory, Builder |
| Structural | objects/classes কীভাবে compose হবে | Adapter, Decorator, Facade, Composite |
| Behavioral | objects কীভাবে communicate/behavior change করবে | Strategy, Observer, State, Command |

```text
Creational:
How to create objects?

Structural:
How to connect/wrap/adapt objects?

Behavioral:
How do objects communicate or choose behavior?
```

---

## 1️⃣ 44. What is the Singleton pattern, and what are its potential downsides?

**Singleton** ensures class এর only one instance থাকবে এবং global access point থাকবে।

Use cases:

- application config
- logger
- shared registry

But overuse dangerous because it behaves like global state.

### How do you implement a thread-safe singleton?

Best simple Java approach: enum singleton.

```java
public enum AppLogger {
    INSTANCE;

    public void log(String message) {
        System.out.println(message);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        AppLogger.INSTANCE.log("Application started");
    }
}
```

Alternative: initialization-on-demand holder.

```java
public final class DatabaseConnectionPool {
    private DatabaseConnectionPool() {
    }

    private static class Holder {
        private static final DatabaseConnectionPool INSTANCE = new DatabaseConnectionPool();
    }

    public static DatabaseConnectionPool getInstance() {
        return Holder.INSTANCE;
    }
}
```

```text
Holder class load হয় only when getInstance() called.
JVM class loading thread-safe.
```

### Why is Singleton sometimes considered an anti-pattern?

Downsides:

- hidden dependency
- global mutable state
- unit testing harder
- lifecycle control difficult
- concurrency bugs possible
- violates dependency inversion if concrete singleton directly used everywhere

Better often:

```java
class OrderService {
    private final Logger logger;

    public OrderService(Logger logger) {
        this.logger = logger;
    }
}
```

Instead of:

```java
AppLogger.INSTANCE.log("...");
```

Dependency injection makes dependency explicit and testable.

---

## 🏭 45. What is the Factory Method pattern, and how does it differ from the Abstract Factory pattern?

**Factory Method** object creation logic encapsulate করে। Client directly `new` না করে factory method call করে।

Problem:

```text
if type == "EMAIL" -> new EmailNotification()
if type == "SMS"   -> new SmsNotification()

এই logic everywhere ছড়ালে maintenance hard.
```

Factory method:

```java
interface Notification {
    void send(String to, String message);
}

class EmailNotification implements Notification {
    public void send(String to, String message) {
        System.out.println("Email to " + to + ": " + message);
    }
}

class SmsNotification implements Notification {
    public void send(String to, String message) {
        System.out.println("SMS to " + to + ": " + message);
    }
}

class NotificationFactory {
    public static Notification create(String type) {
        return switch (type) {
            case "EMAIL" -> new EmailNotification();
            case "SMS" -> new SmsNotification();
            default -> throw new IllegalArgumentException("Unknown type");
        };
    }
}
```

**Abstract Factory** related object families create করে।

```text
UI Factory:
WindowsButton + WindowsCheckbox
MacButton + MacCheckbox
```

```java
interface Button {
    void render();
}

interface Checkbox {
    void render();
}

interface UiFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsButton implements Button {
    public void render() {
        System.out.println("Windows button");
    }
}

class WindowsCheckbox implements Checkbox {
    public void render() {
        System.out.println("Windows checkbox");
    }
}

class WindowsUiFactory implements UiFactory {
    public Button createButton() {
        return new WindowsButton();
    }

    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}
```

### When would you choose Factory Method over directly instantiating objects with `new`?

Use factory when:

- creation logic complex
- implementation selected by config/input
- client should depend on interface
- object creation repeated in many places
- future implementations likely

Direct `new` is fine when creation simple and stable.

```text
new User("Rahim") -> okay

PaymentGatewayFactory.create(region, currency, provider)
-> better factory
```

---

## 🎯 46. What is the Strategy pattern, and how does it relate to "favor composition over inheritance"?

**Strategy Pattern** behavior কে separate interchangeable object এ রাখে। Main class behavior inherit না করে compose করে।

```java
interface ShippingStrategy {
    double calculate(double weight);
}

class StandardShipping implements ShippingStrategy {
    public double calculate(double weight) {
        return 50 + weight * 10;
    }
}

class ExpressShipping implements ShippingStrategy {
    public double calculate(double weight) {
        return 100 + weight * 25;
    }
}

class CheckoutService {
    private final ShippingStrategy shippingStrategy;

    public CheckoutService(ShippingStrategy shippingStrategy) {
        this.shippingStrategy = shippingStrategy;
    }

    public double total(double itemPrice, double weight) {
        return itemPrice + shippingStrategy.calculate(weight);
    }
}
```

```text
CheckoutService
└── ShippingStrategy
       ^
       |
  +----+-------------+
  |                  |
StandardShipping ExpressShipping
```

This is composition because `CheckoutService has-a ShippingStrategy`.

### How does Strategy differ from the State pattern?

| Pattern | Intent | Who changes behavior? |
|---|---|---|
| Strategy | choose algorithm/behavior | client/config chooses strategy |
| State | object behavior changes as internal state changes | object transitions state |

Strategy:

```text
Checkout uses selected ShippingStrategy.
```

State:

```text
Order behavior changes:
CREATED -> PAID -> SHIPPED
```

---

## 👀 47. What is the Observer pattern, and where is it commonly used?

**Observer Pattern** one-to-many dependency। Subject state/event change হলে observers notify হয়।

```text
Subject: Order
Observers:
- EmailNotifier
- SmsNotifier
- InventoryUpdater

Order placed -> all observers notified
```

```java
import java.util.ArrayList;
import java.util.List;

interface OrderObserver {
    void onOrderPlaced(String orderId);
}

class EmailNotifier implements OrderObserver {
    public void onOrderPlaced(String orderId) {
        System.out.println("Email sent for order " + orderId);
    }
}

class SmsNotifier implements OrderObserver {
    public void onOrderPlaced(String orderId) {
        System.out.println("SMS sent for order " + orderId);
    }
}

class OrderService {
    private final List<OrderObserver> observers = new ArrayList<>();

    public void addObserver(OrderObserver observer) {
        observers.add(observer);
    }

    public void placeOrder(String orderId) {
        System.out.println("Order placed: " + orderId);
        for (OrderObserver observer : observers) {
            observer.onOrderPlaced(orderId);
        }
    }
}
```

### How does the Observer pattern relate to event-driven programming and pub/sub systems?

Observer is in-process direct notification.

Pub/Sub is usually broker-based and more decoupled.

```text
Observer:
OrderService directly calls observers.

Pub/Sub:
OrderService publishes "OrderPlaced" event to broker.
Subscribers consume independently.
```

Use cases:

- UI event listeners
- domain events
- cache invalidation
- notification systems
- reactive programming

Warning: observers should be managed carefully; forgotten listeners can cause memory leaks.

---

## 🎁 48. What is the Decorator pattern, and how does it allow extending behavior without modifying existing code?

**Decorator** object কে wrap করে extra behavior add করে, without modifying original class.

```text
Notifier
  ^
  |
EmailNotifier
  ^
  |
SmsDecorator
  ^
  |
SlackDecorator
```

```java
interface Notifier {
    void send(String message);
}

class EmailNotifier implements Notifier {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

abstract class NotifierDecorator implements Notifier {
    protected final Notifier wrapped;

    protected NotifierDecorator(Notifier wrapped) {
        this.wrapped = wrapped;
    }
}

class SmsDecorator extends NotifierDecorator {
    public SmsDecorator(Notifier wrapped) {
        super(wrapped);
    }

    public void send(String message) {
        wrapped.send(message);
        System.out.println("SMS: " + message);
    }
}

class SlackDecorator extends NotifierDecorator {
    public SlackDecorator(Notifier wrapped) {
        super(wrapped);
    }

    public void send(String message) {
        wrapped.send(message);
        System.out.println("Slack: " + message);
    }
}
```

```java
Notifier notifier = new SlackDecorator(new SmsDecorator(new EmailNotifier()));
notifier.send("Server down");
```

### How does Decorator differ from simple inheritance for adding functionality?

Inheritance creates fixed combinations at compile time.

```text
EmailNotifier
EmailSmsNotifier
EmailSmsSlackNotifier
EmailSlackNotifier
...
```

Decorator creates combinations at runtime:

```text
new SmsDecorator(new EmailNotifier())
new SlackDecorator(new EmailNotifier())
new SlackDecorator(new SmsDecorator(new EmailNotifier()))
```

Decorator follows composition over inheritance.

---

## 🔌 49. What is the Adapter pattern, and what problem does it solve?

**Adapter Pattern** incompatible interface কে expected interface এর সাথে compatible করে।

Problem:

```text
App expects PaymentGateway.pay(amount)
Third-party library has StripeClient.charge(cents)
```

Adapter:

```java
interface PaymentGateway {
    void pay(double amount);
}

class StripeClient {
    public void charge(long cents) {
        System.out.println("Charging cents: " + cents);
    }
}

class StripePaymentAdapter implements PaymentGateway {
    private final StripeClient stripeClient;

    public StripePaymentAdapter(StripeClient stripeClient) {
        this.stripeClient = stripeClient;
    }

    public void pay(double amount) {
        long cents = Math.round(amount * 100);
        stripeClient.charge(cents);
    }
}
```

```java
PaymentGateway gateway = new StripePaymentAdapter(new StripeClient());
gateway.pay(19.99);
```

### What is the difference between the Adapter and Facade patterns?

| Pattern | Purpose |
|---|---|
| Adapter | incompatible interface compatible করা |
| Facade | complex subsystem এর simple interface দেওয়া |

Adapter:

```text
Expected interface != existing interface
Adapter converts.
```

Facade:

```text
Many subsystem calls:
Inventory, Payment, Shipping, Email

Facade:
orderFacade.placeOrder()
```

Facade example:

```java
class OrderFacade {
    public void placeOrder() {
        System.out.println("Reserve inventory");
        System.out.println("Process payment");
        System.out.println("Create shipment");
        System.out.println("Send email");
    }
}
```

---

## 🏗️ 50. What is the Builder pattern, and when is it preferred over a constructor with many parameters?

**Builder Pattern** complex object step-by-step create করতে use হয়, especially যখন constructor এ অনেক optional parameter থাকে।

Bad telescoping constructor:

```java
class User {
    public User(String name, String email, String phone, String address, boolean active) {
    }
}
```

Problem:

```text
new User("Rahim", "r@example.com", null, null, true)

কোন argument কী বুঝতে difficult.
```

Builder:

```java
public class User {
    private final String name;
    private final String email;
    private final String phone;
    private final String address;
    private final boolean active;

    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.phone = builder.phone;
        this.address = builder.address;
        this.active = builder.active;
    }

    public static class Builder {
        private final String name;
        private final String email;
        private String phone = "";
        private String address = "";
        private boolean active = true;

        public Builder(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder active(boolean active) {
            this.active = active;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}
```

```java
User user = new User.Builder("Rahim", "rahim@example.com")
        .phone("01700000000")
        .address("Dhaka")
        .active(true)
        .build();
```

Use Builder when:

- many constructor parameters
- many optional fields
- object should be immutable
- validation before creation needed
- readable object construction important

Builder diagram:

```text
User.Builder
├── required: name, email
├── optional: phone, address, active
└── build() -> immutable User
```

---
