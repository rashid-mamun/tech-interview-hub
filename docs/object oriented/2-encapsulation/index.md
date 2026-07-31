---
sidebar_position: 2
title: 'Encapsulation'
---


## 📦 5. What is encapsulation, and why is it important?

**Encapsulation** হলো data এবং সেই data নিয়ে কাজ করা method এক class এর ভিতরে রাখা, এবং data কে বাইরের code থেকে direct access করতে না দেওয়া। Java তে সাধারণত field `private` রাখা হয় এবং controlled public method দিয়ে access/change করা হয়।

Simple definition:

```text
Encapsulation = data + behavior + access control
```

**Without encapsulation:**

```text
Any code can do:
account.balance = -500

Object invalid state এ চলে গেল।
```

**With encapsulation:**

```text
Only allowed operations:
account.deposit(500)
account.withdraw(200)

Class নিজে validation enforce করে।
```

```java
public class BankAccount {
    private double balance;

    public BankAccount(double openingBalance) {
        if (openingBalance < 0) {
            throw new IllegalArgumentException("Opening balance cannot be negative");
        }
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
}
```

Encapsulation important কারণ object এর invariant protect করা যায়।

**Invariant** মানে class এর এমন rule যা সবসময় true থাকতে হবে।

```text
BankAccount invariant:
balance কখনো negative হবে না।
```

### How does encapsulation help with data hiding and reducing coupling between modules?

**Data hiding** মানে internal field/implementation detail বাইরে expose না করা।

```text
External code জানে:
account.deposit(100)
account.getBalance()

External code জানে না:
balance double field নাকি BigDecimal
transaction list রাখা হচ্ছে কিনা
database sync হচ্ছে কিনা
```

এতে coupling কমে। Coupling কম মানে একটা class এর internal implementation change করলে অন্য class ভাঙবে না।

**Bad design: high coupling**

```java
public class BadAccount {
    public double balance;
}

public class BillingService {
    public void charge(BadAccount account, double amount) {
        account.balance -= amount; // direct mutation
    }
}
```

Problem:

```text
যদি পরে balance type double থেকে BigDecimal করি,
BillingService সহ অনেক class change করতে হবে।
```

**Good design: low coupling**

```java
import java.math.BigDecimal;

public class Account {
    private BigDecimal balance;

    public Account(BigDecimal openingBalance) {
        if (openingBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Negative balance not allowed");
        }
        this.balance = openingBalance;
    }

    public void charge(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        balance = balance.subtract(amount);
    }

    public BigDecimal getBalance() {
        return balance;
    }
}

public class BillingService {
    public void charge(Account account, BigDecimal amount) {
        account.charge(amount);
    }
}
```

এখানে `BillingService` account এর internal storage জানে না। সে শুধু public API জানে।

### Can you give a real-world analogy for encapsulation?

**ATM machine analogy:**

```text
User sees:
- insert card
- enter PIN
- withdraw money
- check balance

User does not see:
- bank server verification
- cash cassette logic
- transaction ledger update
- fraud detection
```

ATM internal complexity hide করে এবং controlled buttons/API দেয়। User সরাসরি bank database update করতে পারে না। ঠিক একইভাবে encapsulated class internal data hide করে public method দিয়ে controlled operation allow করে।

**Class diagram analogy:**

```text
BankAccount
--------------------------------
- balance        private data
- accountNumber  private data
--------------------------------
+ deposit()      public behavior
+ withdraw()     public behavior
+ getBalance()   public behavior
--------------------------------

- means private
+ means public
```

---

## 🔐 6. What are access modifiers, and how do they enforce encapsulation?

**Access modifier** define করে কোনো class, field, method, constructor কোথা থেকে access করা যাবে।

Java access modifiers:

| Modifier | Same class | Same package | Subclass other package | Anywhere |
|---|---|---|---|---|
| `private` | Yes | No | No | No |
| package-private, no keyword | Yes | Yes | No | No |
| `protected` | Yes | Yes | Yes | No |
| `public` | Yes | Yes | Yes | Yes |

**Example package view:**

```text
com.shop.domain
├── Product
└── ProductService

com.shop.api
└── ProductController
```

If `Product` has package-private method, `ProductService` can access it because same package. `ProductController` cannot.

```java
package com.shop.domain;

public class Product {
    private String name;
    private int stock;

    public Product(String name, int stock) {
        this.name = name;
        this.stock = stock;
    }

    public String getName() {
        return name;
    }

    void decreaseStockInternally(int quantity) { // package-private
        stock -= quantity;
    }

    protected int getRawStockForSubclass() {
        return stock;
    }
}
```

### What is the difference between public, private, protected, and (in some languages) package-private/internal access?

**`private`**:

Only same class থেকে access করা যায়। Sensitive data এবং internal helper method এর জন্য।

```java
public class User {
    private String passwordHash;

    private boolean isStrongPassword(String password) {
        return password.length() >= 8;
    }
}
```

**package-private**:

কোনো keyword নেই। Same package এর class access করতে পারে। Java modular domain design এ useful।

```java
class OrderCalculator {
    int calculateInternalDiscount() {
        return 10;
    }
}
```

**`protected`**:

Same package + subclass access করতে পারে। Inheritance hierarchy তে controlled extension point হিসেবে use হয়।

```java
public class BaseController {
    protected void logRequest() {
        System.out.println("Request logged");
    }
}

public class UserController extends BaseController {
    public void handle() {
        logRequest();
    }
}
```

**`public`**:

Anywhere access করা যায়। Public API design carefully করতে হয়, কারণ একবার public করলে পরে change করলে breaking change হতে পারে।

```java
public class EmailService {
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Sending email");
    }
}
```

**Access level guideline:**

```text
Start restrictive:
private -> package-private -> protected -> public

যেটুকু expose করা দরকার শুধু সেটুকু public করা।
```

### What is the difference between "protected" access in different languages (e.g., C++ vs Java convention-based privacy)?

Java তে `protected` একটু special:

```text
Java protected =
same package access
+ subclass access from another package
```

এটা শুধু subclass-only না। Same package এর যেকোনো class protected member access করতে পারে।

```java
package com.example.domain;

public class Parent {
    protected int value = 10;
}

class SamePackageClass {
    void test() {
        Parent parent = new Parent();
        System.out.println(parent.value); // allowed, same package
    }
}
```

C++ এ `protected` mainly class hierarchy এর মধ্যে accessible। Python এ true private নেই; `_name` convention-based protected/private signal, আর `__name` name-mangling করে।

Java interview point:

```text
private: strongest encapsulation
protected: inheritance extension point, but Java package access-ও দেয়
public: external contract
package-private: module/package internal API
```

---

## 🪞 7. What are getters and setters, and why are they used instead of direct field access?

**Getter** field value read করার method।
**Setter** field value update করার method।

Direct field access এর বদলে getter/setter use করলে validation, formatting, lazy calculation, logging, access control করা যায়।

**Bad: direct field access**

```java
public class User {
    public String email;
}

public class Main {
    public static void main(String[] args) {
        User user = new User();
        user.email = "not-an-email"; // invalid, কেউ আটকাচ্ছে না
    }
}
```

**Good: controlled setter**

```java
public class User {
    private String email;

    public User(String email) {
        setEmail(email);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        this.email = email;
    }
}
```

**Setter as gatekeeper:**

```text
External code
     |
     v
setEmail("x")
     |
     v
validate -> accept/reject
     |
     v
private email field
```

Getters can also hide internal representation.

```java
import java.time.LocalDate;
import java.time.Period;

public class Person {
    private final LocalDate birthDate;

    public Person(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public int getAge() {
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
```

`age` field store করা নেই, কিন্তু public API `getAge()` দিয়ে calculated value দেয়।

### What are the trade-offs of exposing getters/setters for every private field ("anemic" classes)?

Getter/setter blindly generate করলে class শুধু data bag হয়ে যায়। এটাকে অনেক সময় **anemic domain model** বলা হয়।

**Anemic design:**

```java
public class Order {
    private String status;
    private double total;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
```

Problem:

```text
order.setStatus("SHIPPED")
order.setTotal(-100)

Business rule কোথায় enforce হচ্ছে unclear।
```

Better rich domain model:

```java
public class Order {
    private OrderStatus status = OrderStatus.CREATED;
    private double total;

    public Order(double total) {
        if (total < 0) {
            throw new IllegalArgumentException("Total cannot be negative");
        }
        this.total = total;
    }

    public void pay() {
        if (status != OrderStatus.CREATED) {
            throw new IllegalStateException("Only created orders can be paid");
        }
        status = OrderStatus.PAID;
    }

    public void ship() {
        if (status != OrderStatus.PAID) {
            throw new IllegalStateException("Only paid orders can be shipped");
        }
        status = OrderStatus.SHIPPED;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public double getTotal() {
        return total;
    }
}

enum OrderStatus {
    CREATED, PAID, SHIPPED
}
```

Guideline:

- getter okay if outside needs read-only information
- setter only if direct update is valid business operation
- prefer meaningful method names: `pay()`, `ship()`, `changeEmail()`, `deactivate()`
- keep invariants inside class

---

## 🛡️ 8. What does it mean for a class to be "immutable," and how is immutability achieved?

**Immutable class** হলো এমন class যার object create হওয়ার পর তার state আর change করা যায় না।

Example: Java `String`, `Integer`, `LocalDate` immutable।

**Mutable object:**

```text
User object তৈরি হলো
email = old@example.com

setEmail("new@example.com") call করলে same object mutate হলো।
```

**Immutable object:**

```text
Money object তৈরি হলো
amount = 100, currency = BDT

add(50) করলে old object change হয় না।
নতুন Money object return হয়: amount = 150
```

Immutable class বানানোর rules:

1. class `final` করা, যাতে subclass state mutate করতে না পারে
2. fields `private final` করা
3. setter না দেওয়া
4. constructor এ validation করা
5. mutable field থাকলে defensive copy করা
6. getter এ mutable internal object directly return না করা

```java
import java.math.BigDecimal;
import java.util.Objects;

public final class Money {
    private final BigDecimal amount;
    private final String currency;

    public Money(BigDecimal amount, String currency) {
        if (amount == null || currency == null) {
            throw new IllegalArgumentException("Amount and currency are required");
        }
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
        return new Money(amount.add(other.amount), currency);
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Money other)) return false;
        return amount.equals(other.amount) && currency.equals(other.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(amount, currency);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Money price = new Money(new BigDecimal("100"), "BDT");
        Money total = price.add(new Money(new BigDecimal("50"), "BDT"));

        System.out.println(price.getAmount()); // 100, unchanged
        System.out.println(total.getAmount()); // 150
    }
}
```

**Defensive copy example with mutable list:**

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class Course {
    private final String title;
    private final List<String> topics;

    public Course(String title, List<String> topics) {
        this.title = title;
        this.topics = new ArrayList<>(topics); // defensive copy
    }

    public String getTitle() {
        return title;
    }

    public List<String> getTopics() {
        return Collections.unmodifiableList(topics);
    }
}
```

Without defensive copy:

```text
Constructor এ external list directly assign করলে
caller পরে সেই list modify করে immutable object ভেঙে দিতে পারে।
```

### What are the benefits of immutable objects, especially in multithreaded contexts?

Immutable object এর benefits:

- **Thread-safe by default**: state change হয় না, তাই data race কম
- **Easy reasoning**: object একবার create হলে value stable থাকে
- **Safe sharing**: same object multiple class/thread এ share করা যায়
- **HashMap key হিসেবে safe**: hash-relevant field change হবে না
- **Defensive programming**: accidental mutation কমে
- **Functional style**: operation নতুন object return করে, side effect কম

**Thread sharing diagram:**

```text
Immutable Money object
        |
   +----+----+
   |         |
Thread A  Thread B

কেউ object mutate করতে পারে না,
so synchronization দরকার হয় না read-only sharing এ।
```

Mutable object shared হলে:

```text
Thread A: balance += 100
Thread B: balance -= 50

Same object mutate করলে race condition হতে পারে।
```

Immutable does not mean memory free. অনেক নতুন object তৈরি হতে পারে, তাই performance-sensitive code এ balance রাখতে হয়। তবে correctness এবং concurrency এর জন্য immutability খুব powerful।

---
