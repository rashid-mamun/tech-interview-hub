---
sidebar_position: 4
title: 'Inheritance'
---


## 👪 13. What is inheritance, and what problem does it solve?

**Inheritance** হলো OOP এর এমন feature যেখানে একটা class আরেকটা class এর field/method reuse করতে পারে। Parent class কে Java তে সাধারণত **superclass** বলা হয়, আর child class কে **subclass** বলা হয়।

Simple idea:

```text
Animal
├── eat()
└── sleep()

Dog extends Animal
├── eat()     inherited
├── sleep()   inherited
└── bark()    own behavior
```

Inheritance solve করে:

- common code duplication কমায়
- related classes এর common behavior parent class এ রাখা যায়
- polymorphism enable করে
- shared contract এবং default behavior দিতে পারে

```java
class Animal {
    private final String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }

    public void sleep() {
        System.out.println(name + " is sleeping");
    }

    public String getName() {
        return name;
    }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    public void bark() {
        System.out.println(getName() + " says woof");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Rex");

        dog.eat();   // inherited from Animal
        dog.sleep(); // inherited from Animal
        dog.bark();  // Dog's own method
    }
}
```

### What is the difference between a superclass/base class and a subclass/derived class?

| Concept | Meaning | Java keyword |
|---|---|---|
| Superclass/Base class | Common behavior/state define করে | class being extended |
| Subclass/Derived class | Parent থেকে inherit করে, নিজের behavior add/override করে | `extends` |

```text
Superclass:
Vehicle
├── brand
├── start()
└── stop()

Subclass:
Car extends Vehicle
├── inherited: brand, start(), stop()
└── own: openTrunk()
```

```java
class Vehicle {
    protected final String brand;

    public Vehicle(String brand) {
        this.brand = brand;
    }

    public void start() {
        System.out.println(brand + " is starting");
    }
}

class Car extends Vehicle {
    public Car(String brand) {
        super(brand);
    }

    public void openTrunk() {
        System.out.println("Opening trunk");
    }
}
```

Important:

- Java class only one class extend করতে পারে
- subclass parent এর `private` field directly access করতে পারে না
- `protected` field/method subclass access করতে পারে, কিন্তু overuse করলে coupling বাড়ে

---

## 🔄 14. What are the different types of inheritance?

Inheritance types:

```text
Single inheritance:
A -> B

Multilevel inheritance:
A -> B -> C

Hierarchical inheritance:
      A
     / \
    B   C

Multiple inheritance of classes:
A   B
 \ /
  C
Java class দিয়ে support করে না।

Hybrid inheritance:
multiple inheritance patterns combined
Java class inheritance দিয়ে directly support করে না।
```

### What is the difference between single, multiple, multilevel, hierarchical, and hybrid inheritance?

| Type | Meaning | Java support |
|---|---|---|
| Single | one parent, one child | Yes |
| Multilevel | chain inheritance | Yes |
| Hierarchical | many children from one parent | Yes |
| Multiple class inheritance | one child extends multiple classes | No |
| Hybrid | mixed inheritance pattern | class দিয়ে No, interface দিয়ে possible |

**Single inheritance:**

```java
class User {
    public void login() {
        System.out.println("User logged in");
    }
}

class Admin extends User {
    public void deleteUser() {
        System.out.println("User deleted");
    }
}
```

**Multilevel inheritance:**

```java
class Person {
    public void breathe() {
        System.out.println("Breathing");
    }
}

class Employee extends Person {
    public void work() {
        System.out.println("Working");
    }
}

class Manager extends Employee {
    public void approveBudget() {
        System.out.println("Budget approved");
    }
}
```

**Hierarchical inheritance:**

```java
class Shape {
    public double area() {
        return 0;
    }
}

class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    private final double width;
    private final double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}
```

### Why do some languages (like Java) not support multiple inheritance of classes directly?

Java multiple inheritance of classes support করে না mainly ambiguity avoid করার জন্য।

Problem:

```text
Class A has show()
Class B has show()
Class C extends A and B

C object show() call করলে কোন show() চলবে?
```

Java solution:

- class inheritance single: `class C extends A`
- multiple capabilities interface দিয়ে: `class C implements X, Y`

```java
interface Printable {
    void print();
}

interface Scannable {
    void scan();
}

class MultiFunctionPrinter implements Printable, Scannable {
    @Override
    public void print() {
        System.out.println("Printing");
    }

    @Override
    public void scan() {
        System.out.println("Scanning");
    }
}
```

Interfaces allow multiple contracts, but stateful class conflict avoid করে।

---

## 💎 15. What is the "diamond problem" in multiple inheritance, and how do different languages resolve it?

**Diamond problem** multiple inheritance এর ambiguity problem।

```text
        A
       / \
      B   C
       \ /
        D

A has method: show()
B inherits/overrides show()
C inherits/overrides show()
D inherits from both B and C

D.show() হলে B এর show() নাকি C এর show()?
```

### How does C++ handle the diamond problem using virtual inheritance?

C++ multiple inheritance support করে। Diamond problem avoid করতে C++ এ **virtual inheritance** use করা যায়, যাতে shared base class `A` এর একটাই copy থাকে।

Conceptually:

```text
Without virtual inheritance:
D object may contain two A parts:
B -> A
C -> A

With virtual inheritance:
D object contains one shared A part.
```

এই chapter Java-focused, তাই C++ syntax deep দরকার নেই। Interview এ মূল idea বললেই যথেষ্ট: C++ allows multiple class inheritance, so virtual inheritance can resolve duplicate base subobject problem.

### How does Java avoid this problem entirely?

Java class multiple inheritance allow করে না:

```java
// Java does not allow this:
// class D extends B, C {
// }
```

তাই class-level diamond problem হয় না। তবে Java interfaces multiple implement করা যায়। Java 8+ default method এ conflict হলে class must explicitly override করে ambiguity resolve করতে হয়।

```java
interface A {
    default void show() {
        System.out.println("A");
    }
}

interface B {
    default void show() {
        System.out.println("B");
    }
}

class C implements A, B {
    @Override
    public void show() {
        A.super.show(); // or B.super.show(), explicitly choose
    }
}
```

Java rule:

```text
If two interfaces provide same default method,
implementing class must override and decide.
```

---

## 🔁 16. What is method overriding, and what rules must be followed for it?

**Method overriding** হলো subclass parent class এর method কে same signature দিয়ে নতুন implementation দেয়।

```java
class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Animal animal = new Cat();
        animal.makeSound(); // Meow
    }
}
```

Rules in Java:

- method name same হতে হবে
- parameter list same হতে হবে
- return type same বা covariant হতে হবে
- access modifier কম restrictive করা যাবে না
- checked exception broader করা যাবে না
- `final`, `static`, `private` method override করা যায় না
- `@Override` annotation use করা best practice

### What is the difference between overriding and "hiding" a method (e.g., shadowing static methods)?

Instance method override হয় runtime object type অনুযায়ী।

Static method override হয় না; static method **hiding** হয়, এবং reference type অনুযায়ী method resolve হয়।

```java
class Parent {
    public static void staticMethod() {
        System.out.println("Parent static");
    }

    public void instanceMethod() {
        System.out.println("Parent instance");
    }
}

class Child extends Parent {
    public static void staticMethod() {
        System.out.println("Child static");
    }

    @Override
    public void instanceMethod() {
        System.out.println("Child instance");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent obj = new Child();

        obj.staticMethod();   // Parent static, method hiding
        obj.instanceMethod(); // Child instance, overriding
    }
}
```

**Diagram:**

```text
Reference type: Parent
Actual object:  Child

staticMethod()   -> Parent, because static resolved by reference/class
instanceMethod() -> Child, because runtime dispatch
```

### What is covariant return type, and how does it relate to overriding?

**Covariant return type** মানে overriding method parent method এর return type এর subclass return করতে পারে।

```java
class Animal {
}

class Dog extends Animal {
}

class AnimalShelter {
    public Animal adopt() {
        return new Animal();
    }
}

class DogShelter extends AnimalShelter {
    @Override
    public Dog adopt() {
        return new Dog();
    }
}
```

এখানে parent method returns `Animal`, child method returns `Dog`. যেহেতু `Dog is-a Animal`, এটা valid।

Covariant return helps because caller more specific type পেতে পারে without casting.

---

## 🚪 17. What is the difference between "is-a" and "has-a" relationships?

**Is-a relationship** inheritance দিয়ে model করা হয়।

```text
Dog is an Animal
Car is a Vehicle
Circle is a Shape
```

**Has-a relationship** composition দিয়ে model করা হয়।

```text
Car has an Engine
Order has OrderItems
User has Address
```

Java examples:

```java
class Animal {
}

class Dog extends Animal {
}
```

```java
class Engine {
    public void start() {
        System.out.println("Engine started");
    }
}

class Car {
    private final Engine engine;

    public Car(Engine engine) {
        this.engine = engine;
    }

    public void start() {
        engine.start();
    }
}
```

### How would you decide whether to model a relationship using inheritance or composition?

Use inheritance only when true `is-a` relationship exists and subclass can safely substitute parent.

Ask:

```text
Can child object be used anywhere parent object is expected?
```

If yes, inheritance can fit. If object just uses/owns another object, composition better.

**Bad inheritance example:**

```text
Car extends Engine

Wrong, because Car is not an Engine.
Car has an Engine.
```

Better:

```java
class Car {
    private final Engine engine;

    public Car(Engine engine) {
        this.engine = engine;
    }
}
```

**Prefer composition when:**

- behavior should be swapped at runtime
- relationship is `has-a`
- inheritance hierarchy becomes fragile
- parent class has too much behavior child does not need

Example: payment strategy.

```java
interface PaymentStrategy {
    void pay(double amount);
}

class CardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Card: " + amount);
    }
}

class CheckoutService {
    private PaymentStrategy paymentStrategy;

    public CheckoutService(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}
```

This is composition + interface polymorphism. Often more flexible than inheritance.

---

## 🛑 18. What does it mean to prevent a class or method from being inherited/overridden (e.g., `final` in Java, `sealed` in C#)?

Java তে `final` keyword দিয়ে class inheritance এবং method overriding prevent করা যায়।

**Final class:**

```java
public final class StringUtils {
    private StringUtils() {
    }

    public static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

// Not allowed:
// class MyStringUtils extends StringUtils {
// }
```

**Final method:**

```java
class Payment {
    public final void validateAmount(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
}

class CardPayment extends Payment {
    // Not allowed:
    // public void validateAmount(double amount) {}
}
```

**Final field:**

```java
class User {
    private final String id;

    public User(String id) {
        this.id = id;
    }
}
```

Final field once assigned হলে reference/value আর reassign করা যায় না।

### What are valid reasons to mark a class as non-inheritable?

Valid reasons:

- class immutable রাখতে, যেমন Java `String`
- security-sensitive behavior prevent করতে
- class designed for composition, inheritance না
- parent class invariant child যেন break না করে
- API surface stable রাখতে
- performance optimization সুযোগ দিতে

**Example: immutable class**

```java
public final class Money {
    private final long cents;
    private final String currency;

    public Money(long cents, String currency) {
        if (cents < 0) {
            throw new IllegalArgumentException("Negative money not allowed");
        }
        this.cents = cents;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
        return new Money(cents + other.cents, currency);
    }
}
```

If class not final, subclass could add mutable state and break immutability expectation.

**Guideline:**

```text
Design for inheritance, or prohibit it.

যদি subclassing support করতে চান,
protected hooks, constructor behavior, invariants clearly design করতে হবে।
না হলে final রাখা safer।
```

---
