---
sidebar_position: 3
title: 'Abstraction'
---


## 🖼️ 9. What is abstraction, and how does it differ from encapsulation?

**Abstraction** হলো unnecessary internal detail hide করে শুধু important behavior/API expose করা। User কী করতে পারবে সেটা জানবে, কিন্তু কাজটা internally কীভাবে হচ্ছে সেটা জানতেই হবে না।

Simple definition:

```text
Abstraction = what an object can do
Encapsulation = how object data is protected
```

Real-world example:

```text
Car driver sees:
- start()
- accelerate()
- brake()

Driver does not need to know:
- fuel injection
- spark plug timing
- engine sensor calibration
```

Java example:

```java
public interface NotificationSender {
    void send(String receiver, String message);
}
```

Client code শুধু জানে `send()` আছে। Email, SMS, Push notification কীভাবে send হচ্ছে সেটা hidden।

```java
public class EmailSender implements NotificationSender {
    @Override
    public void send(String receiver, String message) {
        System.out.println("Sending email to " + receiver + ": " + message);
    }
}

public class SmsSender implements NotificationSender {
    @Override
    public void send(String receiver, String message) {
        System.out.println("Sending SMS to " + receiver + ": " + message);
    }
}

public class NotificationService {
    private final NotificationSender sender;

    public NotificationService(NotificationSender sender) {
        this.sender = sender;
    }

    public void notifyUser(String receiver, String message) {
        sender.send(receiver, message);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        NotificationService service = new NotificationService(new EmailSender());
        service.notifyUser("rahim@example.com", "Welcome!");

        NotificationService smsService = new NotificationService(new SmsSender());
        smsService.notifyUser("01700000000", "Your OTP is 1234");
    }
}
```

**Abstraction diagram:**

```text
NotificationService
        |
        v
NotificationSender interface
        |
   +----+----+
   |         |
EmailSender SmsSender

Service interface এর উপর depend করে,
concrete implementation এর উপর না।
```

### Can you give an example where abstraction and encapsulation work together?

Abstraction public interface define করে। Encapsulation internal state protect করে।

Example: `PaymentProcessor`

```text
Abstraction:
pay(amount) method আছে

Encapsulation:
apiKey, secret, retryCount private রাখা হয়েছে
```

```java
public interface PaymentProcessor {
    PaymentResult pay(double amount);
}

public record PaymentResult(boolean success, String transactionId) {
}

public class StripePaymentProcessor implements PaymentProcessor {
    private final String apiKey;
    private int retryCount = 3;

    public StripePaymentProcessor(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("API key is required");
        }
        this.apiKey = apiKey;
    }

    @Override
    public PaymentResult pay(double amount) {
        validateAmount(amount);
        String transactionId = callStripeApi(amount);
        return new PaymentResult(true, transactionId);
    }

    private void validateAmount(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }

    private String callStripeApi(double amount) {
        // apiKey, retryCount, HTTP details hidden from caller
        return "txn_123";
    }
}
```

Caller:

```java
public class CheckoutService {
    private final PaymentProcessor processor;

    public CheckoutService(PaymentProcessor processor) {
        this.processor = processor;
    }

    public void checkout(double amount) {
        PaymentResult result = processor.pay(amount);
        if (!result.success()) {
            throw new IllegalStateException("Payment failed");
        }
    }
}
```

`CheckoutService` শুধু abstraction দেখে: `PaymentProcessor.pay()`. `StripePaymentProcessor` internal secret, validation, API call encapsulate করে।

---

## 🧩 10. What is an abstract class, and when would you use one?

**Abstract class** হলো এমন class যেটা direct instantiate করা যায় না, কিন্তু child class এর জন্য common structure/behavior define করে। Java তে `abstract` keyword ব্যবহার করা হয়।

Use abstract class when:

- multiple related classes এর common state আছে
- common implemented method share করতে হবে
- কিছু method child class must implement করবে
- inheritance relationship truly `is-a`

Example: different employee types.

```java
public abstract class Employee {
    private final String id;
    private final String name;

    protected Employee(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public abstract double calculateMonthlySalary();

    public void printPaySlip() {
        System.out.println(name + " salary: " + calculateMonthlySalary());
    }
}
```

```java
public class FullTimeEmployee extends Employee {
    private final double monthlySalary;

    public FullTimeEmployee(String id, String name, double monthlySalary) {
        super(id, name);
        this.monthlySalary = monthlySalary;
    }

    @Override
    public double calculateMonthlySalary() {
        return monthlySalary;
    }
}

public class ContractEmployee extends Employee {
    private final double hourlyRate;
    private final int hoursWorked;

    public ContractEmployee(String id, String name, double hourlyRate, int hoursWorked) {
        super(id, name);
        this.hourlyRate = hourlyRate;
        this.hoursWorked = hoursWorked;
    }

    @Override
    public double calculateMonthlySalary() {
        return hourlyRate * hoursWorked;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Employee employee = new FullTimeEmployee("E-1", "Nadia", 60000);
        employee.printPaySlip();

        employee = new ContractEmployee("E-2", "Rahim", 500, 80);
        employee.printPaySlip();
    }
}
```

**Abstract class diagram:**

```text
Employee (abstract)
├── id
├── name
├── getName()
├── printPaySlip()
└── calculateMonthlySalary() abstract
       ^
       |
  +----+----------------+
  |                     |
FullTimeEmployee   ContractEmployee
```

### Can an abstract class have a constructor? Why or why not?

Yes, abstract class constructor থাকতে পারে। কিন্তু abstract class direct `new Employee()` করা যায় না। Constructor child class এর constructor থেকে `super(...)` দিয়ে call হয়।

Why constructor needed:

- common field initialize করতে
- validation enforce করতে
- parent class invariant setup করতে

```java
public abstract class Vehicle {
    private final String registrationNumber;

    protected Vehicle(String registrationNumber) {
        if (registrationNumber == null || registrationNumber.isBlank()) {
            throw new IllegalArgumentException("Registration number required");
        }
        this.registrationNumber = registrationNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public abstract void start();
}

public class Car extends Vehicle {
    public Car(String registrationNumber) {
        super(registrationNumber);
    }

    @Override
    public void start() {
        System.out.println("Car engine started");
    }
}
```

```text
new Car("DHK-123")
   |
   v
Car constructor
   |
   v
super("DHK-123")
   |
   v
Vehicle constructor initializes registrationNumber
```

### Can an abstract class have non-abstract (concrete) methods?

Yes. Abstract class এর সবচেয়ে useful feature হলো common concrete behavior এবং abstract behavior একসাথে রাখা।

```java
public abstract class ReportGenerator {
    public final void generate() {
        fetchData();
        formatData();
        export();
    }

    protected void fetchData() {
        System.out.println("Fetching data from database");
    }

    protected abstract void formatData();

    protected void export() {
        System.out.println("Exporting report");
    }
}

public class PdfReportGenerator extends ReportGenerator {
    @Override
    protected void formatData() {
        System.out.println("Formatting data as PDF");
    }
}
```

এটা **Template Method Pattern** এর example। Parent class algorithm skeleton define করে, child class specific step implement করে।

```text
generate()
├── fetchData()      concrete
├── formatData()    abstract, child decides
└── export()         concrete
```

---

## 📜 11. What is an interface, and how does it differ from an abstract class?

**Interface** হলো behavior contract। এটা বলে class কী করতে পারবে, কিন্তু সাধারণত state/implementation detail define করে না। Java তে class multiple interface implement করতে পারে।

```java
public interface Flyable {
    void fly();
}

public interface Trackable {
    String getCurrentLocation();
}

public class DeliveryDrone implements Flyable, Trackable {
    @Override
    public void fly() {
        System.out.println("Drone is flying");
    }

    @Override
    public String getCurrentLocation() {
        return "Dhaka";
    }
}
```

**Interface = can-do relationship**

```text
DeliveryDrone can fly
DeliveryDrone can be tracked
```

Abstract class vs interface:

| বিষয় | Abstract Class | Interface |
|---|---|---|
| Relationship | `is-a` base type | `can-do` capability |
| State | instance fields রাখতে পারে | instance fields রাখতে পারে না |
| Constructor | থাকতে পারে | constructor নেই |
| Multiple inheritance | একটাই class extend করা যায় | multiple interfaces implement করা যায় |
| Method | abstract + concrete methods | abstract, default, static methods |
| Best for | closely related classes | common capability across unrelated classes |

### Can a class implement multiple interfaces but extend only one class? Why is this design common?

Java single class inheritance allow করে, কিন্তু multiple interface implementation allow করে।

```java
public abstract class Machine {
    public void powerOn() {
        System.out.println("Power on");
    }
}

interface Printable {
    void print(String document);
}

interface Scannable {
    void scan(String document);
}

public class MultiFunctionPrinter extends Machine implements Printable, Scannable {
    @Override
    public void print(String document) {
        System.out.println("Printing " + document);
    }

    @Override
    public void scan(String document) {
        System.out.println("Scanning " + document);
    }
}
```

Why:

- Multiple class inheritance diamond problem create করতে পারে
- Interface multiple capability safely model করে
- Class hierarchy shallow রাখা যায়
- Composition এবং polymorphism easier হয়

**Diamond problem idea:**

```text
If Java allowed:

       A
      / \
     B   C
      \ /
       D

B and C দুজনেই same method override করলে D কোনটা inherit করবে?
Java class multiple inheritance avoid করে।
```

### What are default methods in interfaces (e.g., Java 8+), and why were they introduced?

Java 8 থেকে interface এ `default` method রাখা যায়। এতে interface এ নতুন method add করলেও old implementing class গুলো break করে না।

```java
public interface Logger {
    void log(String message);

    default void logError(String message) {
        log("ERROR: " + message);
    }
}

public class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println(message);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Logger logger = new ConsoleLogger();
        logger.log("Started");
        logger.logError("Something went wrong");
    }
}
```

Why introduced:

- existing interface evolve করা
- backward compatibility রাখা
- common behavior interface level এ share করা

Important:

```text
Interface default method stateful behavior এর replacement না।
যদি shared state/common constructor দরকার হয়, abstract class better।
```

---

## 🎯 12. When would you choose an interface over an abstract class, and vice versa?

Decision mostly relationship এর উপর depend করে।

**Use interface when:**

- unrelated classes same capability share করে
- multiple capability combine করতে হবে
- dependency inversion চাই
- implementation completely swappable
- behavior contract important, shared state না

```java
interface Payable {
    void pay(double amount);
}

class CardPayment implements Payable {
    public void pay(double amount) {
        System.out.println("Card payment: " + amount);
    }
}

class MobilePayment implements Payable {
    public void pay(double amount) {
        System.out.println("Mobile payment: " + amount);
    }
}
```

**Use abstract class when:**

- classes closely related
- common fields/state আছে
- constructor দিয়ে shared validation/init দরকার
- common algorithm skeleton আছে
- child classes same family

```java
abstract class Shape {
    private final String color;

    protected Shape(String color) {
        this.color = color;
    }

    public String getColor() {
        return color;
    }

    public abstract double area();
}

class Circle extends Shape {
    private final double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}
```

**Decision table:**

| Need | Choose |
|---|---|
| Only behavior contract | Interface |
| Multiple capabilities | Interface |
| Common state/fields | Abstract class |
| Constructor/shared validation | Abstract class |
| Many unrelated implementers | Interface |
| Same object family | Abstract class |

### How does this decision relate to "is-a" vs "can-do" relationships?

**`is-a`** means object belongs to a family/type hierarchy.
**`can-do`** means object has a capability.

```text
Dog is an Animal        -> abstract class/inheritance can fit
Drone can Fly           -> interface
Bird can Fly            -> interface
Printer can Print       -> interface
Circle is a Shape       -> abstract class can fit
```

Example:

```java
abstract class Animal {
    public abstract void eat();
}

interface Flyable {
    void fly();
}

class Bird extends Animal implements Flyable {
    @Override
    public void eat() {
        System.out.println("Bird eats seeds");
    }

    @Override
    public void fly() {
        System.out.println("Bird flies");
    }
}

class Airplane implements Flyable {
    @Override
    public void fly() {
        System.out.println("Airplane flies");
    }
}
```

`Bird` is an `Animal`, so inheritance makes sense. `Bird` and `Airplane` both can fly, but airplane is not animal. তাই `Flyable` interface better।

**Final guideline:**

```text
If you are modeling shared identity/state -> abstract class
If you are modeling shared ability/contract -> interface
```

Modern Java design এ often:

- interface দিয়ে dependency define করা হয়
- concrete class implementation দেয়
- abstract class use করা হয় যখন real shared base behavior দরকার
- composition inheritance এর চেয়ে prefer করা হয় যখন possible

---
