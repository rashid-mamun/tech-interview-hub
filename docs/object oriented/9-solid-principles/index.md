---
sidebar_position: 9
title: 'SOLID Principles'
---


## 🔤 37. What does SOLID stand for, and why are these principles important in OOP design?

**SOLID** হলো পাঁচটা OOP design principle, যেগুলো code কে maintainable, extensible, testable, এবং loosely coupled করতে সাহায্য করে।

```text
S - Single Responsibility Principle
O - Open/Closed Principle
L - Liskov Substitution Principle
I - Interface Segregation Principle
D - Dependency Inversion Principle
```

Why important:

- change impact কমায়
- tightly coupled code avoid করে
- unit test সহজ করে
- new feature add করা safer করে
- large codebase maintainable রাখে

```text
Bad design:
one class does everything
      |
      v
change এক জায়গায় করলে many bugs

SOLID design:
small focused classes + abstractions
      |
      v
change localized, extension easier
```

---

## 1️⃣ 38. What is the Single Responsibility Principle (SRP)?

**SRP** বলে: একটা class এর change করার **একটাই reason** থাকা উচিত।

Meaning:

```text
Class should have one primary responsibility.
```

Bad example:

```java
class Invoice {
    private final double amount;

    public Invoice(double amount) {
        this.amount = amount;
    }

    public double calculateTotal() {
        return amount * 1.15;
    }

    public void printInvoice() {
        System.out.println("Invoice total: " + calculateTotal());
    }

    public void saveToDatabase() {
        System.out.println("Saving invoice to database");
    }
}
```

Problem:

```text
Invoice class has 3 reasons to change:
1. calculation rule change
2. print format change
3. database logic change
```

Better:

```java
class Invoice {
    private final double amount;

    public Invoice(double amount) {
        this.amount = amount;
    }

    public double calculateTotal() {
        return amount * 1.15;
    }
}

class InvoicePrinter {
    public void print(Invoice invoice) {
        System.out.println("Invoice total: " + invoice.calculateTotal());
    }
}

class InvoiceRepository {
    public void save(Invoice invoice) {
        System.out.println("Saving invoice to database");
    }
}
```

### How would you identify that a class violates SRP?

Symptoms:

- class name vague: `Manager`, `Helper`, `Processor`
- class has unrelated methods
- class imports database, email, UI, business logic একসাথে
- different teams need to edit same class for unrelated reasons
- test setup huge because class does too many things

Checklist:

```text
Can I describe class responsibility in one sentence?
If I need "and", maybe SRP violation.
```

Example:

```text
UserService validates user, saves user, sends email, generates PDF.

Better split:
UserValidator
UserRepository
EmailService
PdfGenerator
```

---

## 2️⃣ 39. What is the Open/Closed Principle (OCP)?

**OCP** বলে: software entities should be **open for extension, closed for modification**।

Meaning:

```text
নতুন behavior add করতে existing tested code edit করতে না হলে ভালো।
```

Bad example:

```java
class DiscountCalculator {
    public double calculate(String customerType, double total) {
        if (customerType.equals("REGULAR")) {
            return total;
        }
        if (customerType.equals("PREMIUM")) {
            return total * 0.90;
        }
        if (customerType.equals("VIP")) {
            return total * 0.80;
        }
        throw new IllegalArgumentException("Unknown customer type");
    }
}
```

Problem: নতুন discount type add করতে এই class modify করতে হবে।

Better with polymorphism:

```java
interface DiscountPolicy {
    double apply(double total);
}

class RegularDiscount implements DiscountPolicy {
    public double apply(double total) {
        return total;
    }
}

class PremiumDiscount implements DiscountPolicy {
    public double apply(double total) {
        return total * 0.90;
    }
}

class VipDiscount implements DiscountPolicy {
    public double apply(double total) {
        return total * 0.80;
    }
}

class CheckoutService {
    public double calculateFinalPrice(double total, DiscountPolicy policy) {
        return policy.apply(total);
    }
}
```

নতুন `StudentDiscount` add করলে `CheckoutService` change লাগবে না।

### How does polymorphism help a class be "open for extension but closed for modification"?

Polymorphism common interface দেয়। New class same interface implement করে behavior extend করে।

```java
class StudentDiscount implements DiscountPolicy {
    public double apply(double total) {
        return total * 0.85;
    }
}
```

```text
CheckoutService -> DiscountPolicy
                      ^
                      |
        +-------------+-------------+
        |             |             |
 RegularDiscount PremiumDiscount StudentDiscount
```

Existing service depends on abstraction, concrete class না। তাই extension possible without modifying service.

---

## 3️⃣ 40. What is the Liskov Substitution Principle (LSP)?

**LSP** বলে: subclass object parent class এর জায়গায় use করলে program correctness break করা যাবে না।

Simple:

```text
If S is subtype of T,
then T expected জায়গায় S safely use করা যাবে।
```

Bad example: Square/Rectangle.

```java
class Rectangle {
    protected int width;
    protected int height;

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int area() {
        return width * height;
    }
}

class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width;
    }

    @Override
    public void setHeight(int height) {
        this.width = height;
        this.height = height;
    }
}
```

Client expectation:

```java
class AreaTest {
    public static void resize(Rectangle rectangle) {
        rectangle.setWidth(5);
        rectangle.setHeight(4);

        if (rectangle.area() != 20) {
            throw new IllegalStateException("Expected area 20");
        }
    }
}
```

`resize(new Square())` দিলে area `16`, expectation break।

### Can you give an example of a class hierarchy that violates LSP (e.g., the classic Square/Rectangle problem)?

LSP violation signs:

- subclass throws unsupported operation for parent method
- subclass strengthens preconditions
- subclass weakens postconditions
- subclass changes expected behavior unexpectedly

Bad bird example:

```java
abstract class Bird {
    public abstract void fly();
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins cannot fly");
    }
}
```

Better:

```java
abstract class Bird {
    public abstract void eat();
}

interface Flyable {
    void fly();
}

class Sparrow extends Bird implements Flyable {
    public void eat() {
        System.out.println("Sparrow eats");
    }

    public void fly() {
        System.out.println("Sparrow flies");
    }
}

class Penguin extends Bird {
    public void eat() {
        System.out.println("Penguin eats");
    }
}
```

Now only birds that can fly implement `Flyable`.

---

## 4️⃣ 41. What is the Interface Segregation Principle (ISP)?

**ISP** বলে: client কে এমন method depend করতে বাধ্য করা উচিত না যেগুলো সে use করে না।

Bad fat interface:

```java
interface Worker {
    void work();
    void eat();
    void sleep();
}

class Robot implements Worker {
    public void work() {
        System.out.println("Robot working");
    }

    public void eat() {
        throw new UnsupportedOperationException("Robot does not eat");
    }

    public void sleep() {
        throw new UnsupportedOperationException("Robot does not sleep");
    }
}
```

Better small interfaces:

```java
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class HumanWorker implements Workable, Eatable, Sleepable {
    public void work() {
        System.out.println("Human working");
    }

    public void eat() {
        System.out.println("Human eating");
    }

    public void sleep() {
        System.out.println("Human sleeping");
    }
}

class RobotWorker implements Workable {
    public void work() {
        System.out.println("Robot working");
    }
}
```

### Why is it better to have many small, specific interfaces rather than one large, general-purpose interface?

Small interfaces:

- irrelevant method implement করতে হয় না
- LSP violation কমে
- mocking/testing easier
- client dependency smaller
- change impact কম

```text
Fat interface:
PrinterScannerFax
├── print()
├── scan()
└── fax()

SimplePrinter forced to implement scan/fax -> bad

Small interfaces:
Printable
Scannable
Faxable

SimplePrinter implements Printable only.
```

---

## 5️⃣ 42. What is the Dependency Inversion Principle (DIP)?

**DIP** বলে:

1. High-level module should not depend on low-level module.
2. Both should depend on abstraction.
3. Abstraction should not depend on details; details should depend on abstraction.

Bad:

```java
class MySqlUserRepository {
    public void save(String username) {
        System.out.println("Saving to MySQL: " + username);
    }
}

class UserService {
    private final MySqlUserRepository repository = new MySqlUserRepository();

    public void register(String username) {
        repository.save(username);
    }
}
```

Problem: `UserService` directly depends on MySQL implementation. Test or DB change hard.

Better:

```java
interface UserRepository {
    void save(String username);
}

class MySqlUserRepository implements UserRepository {
    public void save(String username) {
        System.out.println("Saving to MySQL: " + username);
    }
}

class InMemoryUserRepository implements UserRepository {
    public void save(String username) {
        System.out.println("Saving in memory: " + username);
    }
}

class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public void register(String username) {
        repository.save(username);
    }
}
```

```text
UserService -> UserRepository interface
                    ^
                    |
        MySqlUserRepository
        InMemoryUserRepository
```

### How does dependency injection relate to DIP?

**Dependency Injection (DI)** হলো dependency বাইরে থেকে class এ pass করা। এটা DIP implement করার common technique।

Constructor injection:

```java
UserRepository repository = new MySqlUserRepository();
UserService service = new UserService(repository);
```

Benefits:

- testing easy with fake implementation
- concrete implementation swap করা যায়
- class নিজে dependency create করে না
- coupling কমে

Test example:

```java
class FakeUserRepository implements UserRepository {
    public boolean saved = false;

    public void save(String username) {
        saved = true;
    }
}
```

### What is the difference between dependency injection and the Service Locator pattern?

**Dependency Injection**: dependency explicit.

```java
class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

**Service Locator**: class global registry থেকে dependency নিজে খুঁজে নেয়.

```java
class ServiceLocator {
    public static UserRepository getUserRepository() {
        return new MySqlUserRepository();
    }
}

class UserService {
    private final UserRepository repository = ServiceLocator.getUserRepository();
}
```

Comparison:

| বিষয় | Dependency Injection | Service Locator |
|---|---|---|
| Dependency visibility | constructor এ clear | hidden |
| Testing | easier | harder |
| Coupling | lower | locator এর সাথে coupled |
| Failure | object create time এ clear | runtime lookup fail হতে পারে |

DI usually preferred because dependencies explicit and testable.

---
