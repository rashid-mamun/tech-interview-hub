---
sidebar_position: 1
title: 'OOP Fundamentals'
---

## 📖 1. What is Object-Oriented Programming, and what problem does it solve compared to procedural programming?

**Object-Oriented Programming (OOP)** হলো এমন একটা programming paradigm যেখানে software কে **object** দিয়ে model করা হয়। প্রতিটি object এর থাকে:

- **State/Data**: object কী information ধরে রাখছে
- **Behavior/Method**: object কী কাজ করতে পারে
- **Identity**: একই class থেকে তৈরি হলেও প্রতিটি object আলাদা instance

Real-world চিন্তা করলে:

```java
BankAccount object:

State:
- accountNumber
- ownerName
- balance

Behavior:
- deposit()
- withdraw()
- getBalance()
```

Procedural programming এ সাধারণত data এবং function আলাদা থাকে। ছোট program এ এটা simple, কিন্তু বড় system এ data ছড়িয়ে গেলে কে কখন কোন data change করছে সেটা track করা কঠিন হয়। OOP data এবং behavior কে একসাথে রাখে, তাই code বেশি modular, maintainable, এবং real-world domain model এর কাছাকাছি হয়।

**Procedural style problem:**

```java
balance variable আলাদা
deposit() আলাদা
withdraw() আলাদা

কোনো function ভুল করে balance = -500 করে দিলে
system invalid state এ চলে যেতে পারে।
```

```java
public class ProceduralExample {
    static double balance = 1000;

    static void deposit(double amount) {
        balance += amount;
    }

    static void withdraw(double amount) {
        if (amount > balance) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        balance -= amount;
    }

    public static void main(String[] args) {
        deposit(500);
        withdraw(200);

        // Problem: global/static state সরাসরি invalid করা যাচ্ছে
        balance = -500;

        System.out.println(balance);
    }
}
```

**OOP style:**

```java
public class BankAccount {
    private final String accountNumber;
    private final String ownerName;
    private double balance;

    public BankAccount(String accountNumber, String ownerName, double openingBalance) {
        if (openingBalance < 0) {
            throw new IllegalArgumentException("Opening balance cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = openingBalance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdraw amount must be positive");
        }
        if (amount > balance) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        balance -= amount;
    }

    public double getBalance() {
        return balance;
    }

    public String getSummary() {
        return accountNumber + " - " + ownerName + " - balance: " + balance;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("AC-101", "Rahim", 1000);

        account.deposit(500);
        account.withdraw(200);

        System.out.println(account.getBalance()); // 1300.0

        // account.balance = -500; // compile error, because balance is private
    }
}
```

এখানে `balance` directly বাইরে থেকে change করা যাচ্ছে না। `deposit()` এবং `withdraw()` method এর মাধ্যমে state change হচ্ছে, তাই validation enforce করা যাচ্ছে।

### What are the four main pillars of OOP (encapsulation, abstraction, inheritance, polymorphism)?

OOP এর চারটা pillar:

| Pillar | মূল idea | Java example |
|---|---|---|
| **Encapsulation** | data এবং behavior একসাথে রাখা, data access control করা | `private balance`, public `deposit()` |
| **Abstraction** | unnecessary implementation detail hide করে essential interface দেখানো | `PaymentProcessor.pay()` |
| **Inheritance** | parent class এর common behavior child class reuse করে | `SavingsAccount extends BankAccount` |
| **Polymorphism** | same interface/method call different object এ different behavior করে | `payment.pay()` card/bKash/cash অনুযায়ী |

**Pillars diagram:**

```java
OOP
├── Encapsulation: data protect করা
├── Abstraction: complexity hide করা
├── Inheritance: common code reuse করা
└── Polymorphism: same call, different behavior
```

**Java example combining all pillars:**

```java
abstract class PaymentMethod {
    private final String owner; // Encapsulation

    protected PaymentMethod(String owner) {
        this.owner = owner;
    }

    public String getOwner() {
        return owner;
    }

    // Abstraction: কীভাবে pay হবে সেটা child class define করবে
    public abstract void pay(double amount);

    public void printReceipt(double amount) {
        System.out.println("Paid " + amount + " by " + owner);
    }
}

class CardPayment extends PaymentMethod {
    public CardPayment(String owner) {
        super(owner); // Inheritance
    }

    @Override
    public void pay(double amount) {
        System.out.println("Charging card: " + amount);
        printReceipt(amount);
    }
}

class MobilePayment extends PaymentMethod {
    public MobilePayment(String owner) {
        super(owner);
    }

    @Override
    public void pay(double amount) {
        System.out.println("Sending mobile payment request: " + amount);
        printReceipt(amount);
    }
}

public class PaymentDemo {
    public static void main(String[] args) {
        PaymentMethod payment = new CardPayment("Nadia");
        payment.pay(1500);

        payment = new MobilePayment("Rafi");
        payment.pay(800);
    }
}
```

```java
Output:
Charging card: 1500.0
Paid 1500.0 by Nadia
Sending mobile payment request: 800.0
Paid 800.0 by Rafi
```

এখানে `payment.pay()` same call, কিন্তু actual object অনুযায়ী behavior change হচ্ছে। এটাকেই polymorphism বলে।

### How does OOP improve code reusability and maintainability?

OOP maintainability improve করে কারণ code responsibility অনুযায়ী class এ ভাগ হয়।

**Without OOP:**

```java
Order data আলাদা
discount function আলাদা
tax function আলাদা
payment function আলাদা

সব function একই data structure manipulate করছে।
Change করলে অনেক জায়গায় bug হতে পারে।
```

**With OOP:**

```java
Order
├── items
├── calculateTotal()
├── applyDiscount()
└── place()

PaymentService
└── process()

InventoryService
└── reserve()
```

Benefits:

- **Reusability**: common logic parent class বা utility service এ রাখা যায়
- **Maintainability**: class নিজের data নিজে protect করে, side effect কমে
- **Extensibility**: নতুন class add করে behavior extend করা যায়
- **Testability**: ছোট class/method আলাদা unit test করা সহজ
- **Domain modeling**: business concept code এ clean ভাবে map হয়

Example: নতুন payment method add করতে পুরনো payment processing code rewrite করতে হয় না।

```java
interface PaymentGateway {
    void pay(double amount);
}

class CardGateway implements PaymentGateway {
    public void pay(double amount) {
        System.out.println("Paying by card: " + amount);
    }
}

class CashGateway implements PaymentGateway {
    public void pay(double amount) {
        System.out.println("Paying by cash: " + amount);
    }
}

class CheckoutService {
    public void checkout(double amount, PaymentGateway gateway) {
        gateway.pay(amount);
    }
}
```

`CheckoutService` জানে না card না cash, সে শুধু `PaymentGateway` abstraction জানে। তাই নতুন `BkashGateway` add করলেও `CheckoutService` change করতে হবে না।

---

## 🧩 2. What is a class, and what is an object?

**Class** হলো blueprint/template। এতে define করা থাকে object এর field এবং method কী হবে।

**Object** হলো class থেকে তৈরি actual instance, যার নিজের state থাকে।

```java
Class = blueprint

          User
   +---------------+
   | name          |
   | email         |
   | login()       |
   +---------------+

Objects = actual users

user1:
name = "Rahim"
email = "rahim@example.com"

user2:
name = "Nadia"
email = "nadia@example.com"
```

```java
public class User {
    private String name;
    private String email;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String greet() {
        return "Hello, I am " + name;
    }

    public String getEmail() {
        return email;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        User user1 = new User("Rahim", "rahim@example.com");
        User user2 = new User("Nadia", "nadia@example.com");

        System.out.println(user1.greet());
        System.out.println(user2.greet());
        System.out.println(user1 == user2); // false
    }
}
```

```java
Output:
Hello, I am Rahim
Hello, I am Nadia
false
```

`user1` এবং `user2` একই `User` class থেকে তৈরি, কিন্তু তারা আলাদা object এবং তাদের state আলাদা।

### What is the difference between a class and an object/instance?

| বিষয় | Class | Object / Instance |
|---|---|---|
| Meaning | blueprint/template | actual created entity |
| Memory | class metadata থাকে, কিন্তু instance field এর memory object তৈরি হলে লাগে | `new` করলে heap এ object memory allocate হয় |
| State | নিজে per-user state ধরে না | নিজের field value ধরে |
| Example | `class User` | `new User("Rahim", "...")` |
| Count | একবার define করা হয় | অনেক object তৈরি করা যায় |

**Memory reference diagram in Java:**

```java
Stack:
user1 ----+
         |
         v
Heap:  User object
       name  = "Rahim"
       email = "rahim@example.com"

Stack:
user2 ----+
         |
         v
Heap:  User object
       name  = "Nadia"
       email = "nadia@example.com"
```

Java variable object store করে না; variable object এর **reference** store করে।

```java
User a = new User("Asha", "asha@example.com");
User b = a;

System.out.println(a == b); // true, same object reference
```

এখানে `a` এবং `b` same object point করছে।

### What is the difference between a class and a struct (in languages that have both)?

Java তে `struct` নেই। Java তে custom data type বানাতে class/record ব্যবহার করা হয়। কিন্তু C/C++/C# এর মতো language এ class এবং struct আলাদা concept হতে পারে।

General comparison:

| বিষয় | Class | Struct |
|---|---|---|
| Main use | identity + behavior সহ complex object | small data carrier |
| Java support | আছে | নেই |
| Copy behavior | Java object reference copy হয় | অনেক language এ value copy হয় |
| Inheritance | class inheritance থাকে | language অনুযায়ী limited/none |
| Encapsulation | methods/access modifiers থাকে | language অনুযায়ী থাকে বা কম থাকে |

**Java equivalent options:**

1. Normal class:

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
```

2. Java record, simple immutable data carrier:

```java
public record Point(int x, int y) {
}
```

`record` অনেকটা lightweight immutable data class এর মতো, কিন্তু এটা struct না। Java তে record-ও reference type।

---

## 🏷️ 3. What is the difference between a class variable and an instance variable?

**Instance variable** হলো object-specific field। প্রতিটি object নিজের copy পায়।

**Class variable** হলো `static` field। এটা class-level shared data, সব object একই copy share করে।

```java
User class
├── static totalUsers = 2     <- shared class variable
├── user1.name = "Rahim"      <- instance variable
└── user2.name = "Nadia"      <- instance variable
```

```java
public class User {
    private static int totalUsers = 0; // class variable

    private final String name;         // instance variable
    private final String email;        // instance variable

    public User(String name, String email) {
        this.name = name;
        this.email = email;
        totalUsers++;
    }

    public String getName() {
        return name;
    }

    public static int getTotalUsers() {
        return totalUsers;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        User u1 = new User("Rahim", "rahim@example.com");
        User u2 = new User("Nadia", "nadia@example.com");

        System.out.println(u1.getName());       // Rahim
        System.out.println(u2.getName());       // Nadia
        System.out.println(User.getTotalUsers()); // 2
    }
}
```

**Memory view:**

```java
Class area:
User.totalUsers = 2

Heap:
u1 object: name="Rahim", email="rahim@example.com"
u2 object: name="Nadia", email="nadia@example.com"

totalUsers object এর ভিতরের আলাদা copy না।
সব object same static field share করে।
```

Important:

- `static` field object ছাড়াই class name দিয়ে access করা উচিত: `User.getTotalUsers()`
- static mutable state বেশি ব্যবহার করলে testing এবং concurrency problem হতে পারে
- constants এর জন্য `public static final` common

```java
public class MathConfig {
    public static final double PI = 3.14159;
}
```

### What is the difference between a class method and an instance method?

**Instance method** object এর state নিয়ে কাজ করে এবং object reference দিয়ে call হয়।

**Class/static method** class-level behavior, object না বানিয়েও call করা যায়।

| বিষয় | Instance Method | Static Method |
|---|---|---|
| Call | `object.method()` | `ClassName.method()` |
| Instance field access | পারে | directly পারে না |
| `this` available | আছে | নেই |
| Use case | object-specific behavior | utility/factory/class-level logic |

```java
public class BankAccount {
    private double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void deposit(double amount) {
        balance += amount; // instance field access
    }

    public double getBalance() {
        return balance;
    }

    public static boolean isValidOpeningBalance(double amount) {
        return amount >= 0; // কোনো object state দরকার নেই
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(BankAccount.isValidOpeningBalance(100)); // static method

        BankAccount account = new BankAccount(500);
        account.deposit(200); // instance method
        System.out.println(account.getBalance());
    }
}
```

Static method এর ভিতরে `this` নেই:

```java
public class Example {
    private int value = 10;

    public static void wrong() {
        // System.out.println(this.value); // compile error
    }
}
```

---

## 🔄 4. What is the difference between procedural and object-oriented programming paradigms?

**Procedural programming** action/function কে center করে।
**OOP** object/entity কে center করে।

| বিষয় | Procedural Programming | Object-Oriented Programming |
|---|---|---|
| Focus | function/procedure | object/entity |
| Data and behavior | আলাদা থাকে | একসাথে class/object এ থাকে |
| State management | global/shared data বেশি হতে পারে | encapsulated object state |
| Reuse | function reuse | class, inheritance, composition, interface |
| Best for | ছোট script/simple calculation | large evolving system |
| Java style | static utility-heavy code | classes with domain behavior |

**Thinking difference:**

```java
Procedural:
"কোন function চালাব?"
borrowBook(books, title)
returnBook(books, title)

OOP:
"কোন object এই কাজের owner?"
book.borrow()
book.returnBook()
library.findBook(title)
```

### Can you give an example of the same problem solved procedurally vs. with OOP?

Problem: Library system এ book borrow/return manage করতে হবে।

**Procedural Java style:**

```java
import java.util.ArrayList;
import java.util.List;

class BookData {
    String title;
    boolean borrowed;

    BookData(String title) {
        this.title = title;
        this.borrowed = false;
    }
}

public class ProceduralLibrary {
    static void borrowBook(List<BookData> books, String title) {
        for (BookData book : books) {
            if (book.title.equals(title)) {
                if (book.borrowed) {
                    throw new IllegalStateException("Book already borrowed");
                }
                book.borrowed = true;
                return;
            }
        }
        throw new IllegalArgumentException("Book not found");
    }

    static void returnBook(List<BookData> books, String title) {
        for (BookData book : books) {
            if (book.title.equals(title)) {
                book.borrowed = false;
                return;
            }
        }
    }

    public static void main(String[] args) {
        List<BookData> books = new ArrayList<>();
        books.add(new BookData("Clean Code"));

        borrowBook(books, "Clean Code");

        // Problem: direct invalid mutation possible
        books.get(0).borrowed = false;
    }
}
```

Procedural version কাজ করে, কিন্তু data public-like হলে যেকোনো জায়গা থেকে mutate করা যায়। Rule change হলে many functions update করতে হতে পারে।

**OOP Java style:**

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class Book {
    private final String title;
    private boolean borrowed;

    public Book(String title) {
        this.title = title;
        this.borrowed = false;
    }

    public void borrow() {
        if (borrowed) {
            throw new IllegalStateException("Book already borrowed");
        }
        borrowed = true;
    }

    public void returnBook() {
        borrowed = false;
    }

    public boolean isAvailable() {
        return !borrowed;
    }

    public String getTitle() {
        return title;
    }
}

class Library {
    private final List<Book> books = new ArrayList<>();

    public void addBook(Book book) {
        books.add(book);
    }

    public Optional<Book> findByTitle(String title) {
        return books.stream()
                .filter(book -> book.getTitle().equals(title))
                .findFirst();
    }

    public void borrow(String title) {
        Book book = findByTitle(title)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        book.borrow();
    }
}

public class OopLibraryDemo {
    public static void main(String[] args) {
        Library library = new Library();
        library.addBook(new Book("Clean Code"));

        library.borrow("Clean Code");
    }
}
```

OOP version এ `Book` নিজের validity নিজে maintain করে। `Library` collection manage করে। Responsibility clear।

**Design diagram:**

```java
Library
├── books: List<Book>
├── addBook()
├── findByTitle()
└── borrow()

Book
├── title
├── borrowed
├── borrow()
├── returnBook()
└── isAvailable()
```

এটাই OOP এর core value: state এবং behavior এর owner clear করা।

---
