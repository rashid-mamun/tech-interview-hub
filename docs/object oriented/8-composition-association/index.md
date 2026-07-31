---
sidebar_position: 8
title: 'Composition & Association'
---


## 🔗 34. What is the difference between composition, aggregation, and association?

OOP relationship model করার জন্য common তিনটা term:

- **Association**: দুই class একে অপরের সাথে related
- **Aggregation**: weak whole-part relationship, part independently exist করতে পারে
- **Composition**: strong whole-part relationship, part এর lifecycle whole এর উপর depend করে

```text
Association:
Teacher ---- teaches ---- Student

Aggregation:
Department o---- Professor
Professor department ছাড়া exist করতে পারে।

Composition:
House ◆---- Room
Room house এর part; house destroy হলে room meaningful থাকে না।
```

| Relationship | Strength | Lifecycle dependency | Example |
|---|---|---|---|
| Association | loose | no ownership | Doctor treats Patient |
| Aggregation | weak ownership | part can exist alone | Team has Players |
| Composition | strong ownership | part depends on whole | Order has OrderItems |

**Association example:**

```java
class Student {
    private final String name;

    public Student(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

class Teacher {
    private final String name;

    public Teacher(String name) {
        this.name = name;
    }

    public void teach(Student student) {
        System.out.println(name + " teaches " + student.getName());
    }
}
```

Teacher and Student related, but neither owns the other.

**Aggregation example:**

```java
import java.util.ArrayList;
import java.util.List;

class Player {
    private final String name;

    public Player(String name) {
        this.name = name;
    }
}

class Team {
    private final List<Player> players = new ArrayList<>();

    public void addPlayer(Player player) {
        players.add(player);
    }
}
```

Player team ছাড়াও exist করতে পারে, team change করতে পারে।

**Composition example:**

```java
import java.util.ArrayList;
import java.util.List;

class OrderItem {
    private final String productName;
    private final int quantity;

    public OrderItem(String productName, int quantity) {
        this.productName = productName;
        this.quantity = quantity;
    }
}

class Order {
    private final List<OrderItem> items = new ArrayList<>();

    public void addItem(String productName, int quantity) {
        items.add(new OrderItem(productName, quantity));
    }
}
```

এখানে `Order` নিজেই `OrderItem` create/manage করছে। OrderItem order এর part।

### How does the lifecycle dependency differ between composition and aggregation (e.g., can the "part" exist without the "whole")?

**Aggregation lifecycle:**

```text
Player created independently
Player joins Team A
Player leaves Team A
Player joins Team B

Team destroy হলেও Player object conceptually exist করতে পারে।
```

**Composition lifecycle:**

```text
Order created
Order creates OrderItem
Order cancelled/deleted
OrderItem also goes away as part of Order
```

Java code difference:

```java
class AggregationTeam {
    private final List<Player> players;

    public AggregationTeam(List<Player> players) {
        this.players = players; // existing external objects
    }
}
```

```java
class CompositionOrder {
    private final List<OrderItem> items = new ArrayList<>();

    public void addItem(String productName, int quantity) {
        items.add(new OrderItem(productName, quantity)); // owned internally
    }
}
```

Practical note: Java GC lifecycle physical destruction এর exact time decide করে, but design-level ownership still matters.

---

## 🏗️ 35. What is "composition over inheritance," and why is it often recommended?

**Composition over inheritance** means behavior reuse করার জন্য class extend করার বদলে object কে অন্য object এর ভিতরে রাখা/prefer করা।

Inheritance:

```text
Car extends Engine  -> wrong
Car is not an Engine
```

Composition:

```text
Car has an Engine   -> correct
```

Inheritance tightly couples child to parent implementation. Composition more flexible, because component object swap করা যায়।

### Can you give an example where composition leads to more flexible code than inheritance?

Problem: Bird behavior model করা।

Bad inheritance:

```java
abstract class Bird {
    public abstract void fly();
}

class Sparrow extends Bird {
    @Override
    public void fly() {
        System.out.println("Sparrow flies");
    }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins cannot fly");
    }
}
```

Problem:

```text
All Bird can fly assumption wrong.
Penguin forced to inherit behavior it cannot support.
This can violate LSP.
```

Better with composition:

```java
interface FlyBehavior {
    void fly();
}

class CanFly implements FlyBehavior {
    public void fly() {
        System.out.println("Flying");
    }
}

class CannotFly implements FlyBehavior {
    public void fly() {
        System.out.println("Cannot fly");
    }
}

class Bird {
    private final String name;
    private FlyBehavior flyBehavior;

    public Bird(String name, FlyBehavior flyBehavior) {
        this.name = name;
        this.flyBehavior = flyBehavior;
    }

    public void performFly() {
        System.out.print(name + ": ");
        flyBehavior.fly();
    }

    public void setFlyBehavior(FlyBehavior flyBehavior) {
        this.flyBehavior = flyBehavior;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Bird sparrow = new Bird("Sparrow", new CanFly());
        Bird penguin = new Bird("Penguin", new CannotFly());

        sparrow.performFly();
        penguin.performFly();

        penguin.setFlyBehavior(new CanFly()); // behavior can be swapped if needed
        penguin.performFly();
    }
}
```

**Composition diagram:**

```text
Bird
├── name
└── FlyBehavior
       ^
       |
   +---+-------+
   |           |
 CanFly    CannotFly
```

Benefits:

- runtime behavior swap possible
- avoids deep inheritance tree
- easier testing with mock behavior
- follows open/closed principle
- avoids forcing invalid behavior into subclasses

---

## 🔄 36. How would you refactor a class hierarchy that relies heavily on inheritance into one that uses composition?

Heavy inheritance smell:

```text
Report
├── PdfReport
├── CsvReport
├── EmailPdfReport
├── EmailCsvReport
├── EncryptedPdfReport
└── EncryptedEmailCsvReport

Combination explosion হচ্ছে।
```

Problem: format, delivery, encryption সব inheritance hierarchy তে mix হয়ে গেছে।

Refactor by composition:

```text
ReportService
├── ReportFormatter
├── ReportDelivery
└── ReportSecurity
```

Step-by-step:

1. Identify varying behaviors
2. Extract each behavior into interface
3. Create concrete implementations
4. Main class depends on interfaces
5. Inject behavior through constructor

```java
class Report {
    private final String title;
    private final String content;

    public Report(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}

interface ReportFormatter {
    String format(Report report);
}

class PdfFormatter implements ReportFormatter {
    public String format(Report report) {
        return "PDF: " + report.getTitle() + "\n" + report.getContent();
    }
}

class CsvFormatter implements ReportFormatter {
    public String format(Report report) {
        return report.getTitle() + "," + report.getContent();
    }
}

interface ReportDelivery {
    void deliver(String formattedReport);
}

class EmailDelivery implements ReportDelivery {
    public void deliver(String formattedReport) {
        System.out.println("Emailing report:\n" + formattedReport);
    }
}

class FileDelivery implements ReportDelivery {
    public void deliver(String formattedReport) {
        System.out.println("Saving report:\n" + formattedReport);
    }
}

class ReportService {
    private final ReportFormatter formatter;
    private final ReportDelivery delivery;

    public ReportService(ReportFormatter formatter, ReportDelivery delivery) {
        this.formatter = formatter;
        this.delivery = delivery;
    }

    public void publish(Report report) {
        String formatted = formatter.format(report);
        delivery.deliver(formatted);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Report report = new Report("Sales", "Revenue: 1000");

        ReportService service = new ReportService(
                new PdfFormatter(),
                new EmailDelivery()
        );

        service.publish(report);
    }
}
```

### What design patterns (e.g., Strategy, Decorator) facilitate this kind of refactoring?

Useful patterns:

| Pattern | Helps with |
|---|---|
| Strategy | behavior swap করা |
| Decorator | behavior layer/add করা |
| Adapter | incompatible API compatible করা |
| Bridge | abstraction and implementation separate করা |

**Strategy**: `ReportFormatter` and `ReportDelivery` examples above.

**Decorator**: base behavior wrap করে extra behavior add করা।

```java
interface Notifier {
    void send(String message);
}

class EmailNotifier implements Notifier {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class SmsNotifierDecorator implements Notifier {
    private final Notifier wrapped;

    public SmsNotifierDecorator(Notifier wrapped) {
        this.wrapped = wrapped;
    }

    public void send(String message) {
        wrapped.send(message);
        System.out.println("SMS: " + message);
    }
}
```

```java
Notifier notifier = new SmsNotifierDecorator(new EmailNotifier());
notifier.send("Order shipped");
```

Decorator avoids:

```text
EmailNotifier
SmsNotifier
EmailAndSmsNotifier
EmailSmsAndPushNotifier
...
```

Composition keeps combinations flexible.

---
