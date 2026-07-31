---
sidebar_position: 5
title: 'Polymorphism'
---


## 🌈 19. What is polymorphism, and what are its two main types?

**Polymorphism** মানে "many forms"। OOP তে একই method call বা same interface different object এর জন্য different behavior করতে পারে।

Simple example:

```text
payment.pay(1000)

If payment = CardPayment   -> card charge হবে
If payment = CashPayment   -> cash collect হবে
If payment = MobilePayment -> mobile payment request যাবে
```

Java তে polymorphism main দুই ধরনের:

1. **Compile-time/static polymorphism**: method overloading
2. **Runtime/dynamic polymorphism**: method overriding

```text
Polymorphism
├── Compile-time
│   └── Method overloading
└── Runtime
    └── Method overriding + dynamic dispatch
```

### What is the difference between compile-time (static) polymorphism and runtime (dynamic) polymorphism?

| বিষয় | Compile-time Polymorphism | Runtime Polymorphism |
|---|---|---|
| Java mechanism | Method overloading | Method overriding |
| Decision time | compile time | runtime |
| Based on | method signature | actual object type |
| Inheritance required | না | usually yes/interface implementation |
| Example | `print(int)`, `print(String)` | `Animal animal = new Dog(); animal.sound()` |

Compile-time example:

```java
class Printer {
    public void print(String text) {
        System.out.println("Text: " + text);
    }

    public void print(int number) {
        System.out.println("Number: " + number);
    }
}
```

Runtime example:

```java
class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.makeSound(); // Woof

        animal = new Cat();
        animal.makeSound(); // Meow
    }
}
```

---

## ➕ 20. What is method overloading, and what rules govern it?

**Method overloading** হলো same class এ same method name দিয়ে multiple method রাখা, কিন্তু parameter list আলাদা হতে হবে।

Parameter list আলাদা হতে পারে:

- number of parameters আলাদা
- parameter type আলাদা
- parameter order আলাদা

```java
class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }

    public double add(double a, double b) {
        return a + b;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Calculator calculator = new Calculator();

        System.out.println(calculator.add(2, 3));       // int, int
        System.out.println(calculator.add(2, 3, 4));    // int, int, int
        System.out.println(calculator.add(2.5, 3.5));   // double, double
    }
}
```

**Overload selection diagram:**

```text
add(2, 3)
 |
 | compile-time argument types: int, int
 v
add(int, int)

add(2.5, 3.5)
 |
 | compile-time argument types: double, double
 v
add(double, double)
```

### Can methods be overloaded based on return type alone? Why or why not?

না। Java তে return type alone দিয়ে overload করা যায় না।

```java
class InvalidExample {
    public int getValue() {
        return 10;
    }

    // Compile error:
    // public String getValue() {
    //     return "10";
    // }
}
```

কারণ caller যদি শুধু `getValue()` call করে, compiler বুঝতে পারবে না কোন method call হবে।

```text
getValue()

Return value use না করলে:
which one?
int getValue() নাকি String getValue()?
```

Return type method signature এর অংশ না in Java overload resolution এর জন্য।

### How does the compiler resolve which overloaded method to call?

Compiler method argument এর compile-time type দেখে best matching overload choose করে।

Resolution order roughly:

1. exact match
2. widening conversion
3. boxing/unboxing
4. varargs

```java
class OverloadResolution {
    public void show(int value) {
        System.out.println("int");
    }

    public void show(long value) {
        System.out.println("long");
    }

    public void show(Integer value) {
        System.out.println("Integer");
    }

    public void show(int... values) {
        System.out.println("varargs");
    }
}

public class Main {
    public static void main(String[] args) {
        OverloadResolution demo = new OverloadResolution();

        demo.show(10); // int, exact match
    }
}
```

If exact `int` method না থাকত, `long` widening often `Integer` boxing এর আগে choose হতে পারে।

Important:

```text
Overloading compile-time type দেখে।
Overriding runtime object type দেখে।
```

---

## 🔁 21. What is method overriding, and how does it enable runtime polymorphism?

**Method overriding** হলো subclass parent/interface method এর same signature দিয়ে own implementation দেয়। Runtime এ actual object type অনুযায়ী method call হয়।

```java
interface ShippingCostCalculator {
    double calculate(double weight);
}

class StandardShipping implements ShippingCostCalculator {
    @Override
    public double calculate(double weight) {
        return 50 + weight * 10;
    }
}

class ExpressShipping implements ShippingCostCalculator {
    @Override
    public double calculate(double weight) {
        return 100 + weight * 25;
    }
}

class CheckoutService {
    public double checkout(double itemPrice, double weight, ShippingCostCalculator calculator) {
        return itemPrice + calculator.calculate(weight);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        CheckoutService service = new CheckoutService();

        double standardTotal = service.checkout(1000, 2, new StandardShipping());
        double expressTotal = service.checkout(1000, 2, new ExpressShipping());

        System.out.println(standardTotal); // 1070.0
        System.out.println(expressTotal);  // 1150.0
    }
}
```

`CheckoutService` জানে না exact calculator কোনটা। সে শুধু interface জানে। Actual implementation runtime এ decide হয়।

### How does the JVM (or equivalent runtime) decide which overridden method implementation to call at runtime?

Java runtime method dispatch করে actual object type দেখে।

```java
Animal animal = new Dog();
animal.makeSound();
```

```text
Compile-time reference type: Animal
Runtime object type: Dog

JVM calls Dog.makeSound()
```

Dispatch flow:

```text
animal.makeSound()
      |
      v
object actual class check
      |
      v
Dog overrides makeSound?
      |
      v
call Dog.makeSound()
```

This is **dynamic method dispatch**.

---

## 📐 22. What is dynamic method dispatch, and how is it implemented internally (e.g., vtables)?

**Dynamic method dispatch** হলো runtime এ actual object type অনুযায়ী overridden method select করার process।

Java-level example:

```java
abstract class Shape {
    public abstract double area();
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

```java
public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle(2),
            new Rectangle(3, 4)
        };

        for (Shape shape : shapes) {
            System.out.println(shape.area());
        }
    }
}
```

**Conceptual method table diagram:**

```text
Shape reference
     |
     v
actual object: Circle
     |
     v
method lookup table:
area() -> Circle.area()

actual object: Rectangle
     |
     v
method lookup table:
area() -> Rectangle.area()
```

JVM implementation detail exact version/JIT অনুযায়ী differ করতে পারে, কিন্তু conceptual idea হলো runtime class metadata থেকে correct method address resolve করা। JIT compiler অনেক সময় optimize করে direct call বানিয়ে ফেলতে পারে যদি type predictable হয়।

### What is a virtual function, and how does the `virtual` keyword affect dispatch in C++?

Java তে normal instance methods by default virtual-like behavior করে, অর্থাৎ overridden method runtime dispatch হয়। Java তে C++ এর মতো `virtual` keyword নেই।

```java
class Parent {
    public void show() {
        System.out.println("Parent");
    }
}

class Child extends Parent {
    @Override
    public void show() {
        System.out.println("Child");
    }
}
```

```java
Parent obj = new Child();
obj.show(); // Child
```

Java exceptions:

- `static` method runtime polymorphic না
- `private` method override হয় না
- `final` method override করা যায় না

### What is the performance cost of virtual function calls compared to regular function calls?

Dynamic dispatch এর ছোট overhead আছে, কারণ runtime এ actual method resolve করতে হয়। কিন্তু modern JVM JIT অনেক ক্ষেত্রে optimize করে।

Performance idea:

```text
Regular/static call:
known target -> direct call

Virtual/dynamic call:
object type -> method lookup -> call
```

In most business applications, this overhead negligible. Usually design clarity বেশি important. Performance-critical tight loops এ JVM profiling/JIT result দেখে optimize করা উচিত।

---

## 🎭 23. What is operator overloading, and how does it relate to polymorphism?

**Operator overloading** মানে `+`, `-`, `*`, `==` এর মতো operator custom type এর জন্য custom behavior পায়।

Java custom operator overloading support করে না। শুধু `+` operator string concatenation এর জন্য built-in overloaded behavior রাখে।

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(10 + 20);        // numeric addition: 30
        System.out.println("A" + "B");      // string concat: AB
        System.out.println("Value: " + 10); // string concat: Value: 10
    }
}
```

Java কেন custom operator overloading দেয় না:

- readability predictable রাখা
- operator misuse avoid করা
- language simpler রাখা

Java alternative: meaningful method names।

```java
import java.math.BigDecimal;

public final class Money {
    private final BigDecimal amount;

    public Money(BigDecimal amount) {
        this.amount = amount;
    }

    public Money add(Money other) {
        return new Money(amount.add(other.amount));
    }

    public BigDecimal getAmount() {
        return amount;
    }
}
```

### What are the risks or downsides of overusing operator overloading?

Even though Java custom operator overloading দেয় না, conceptually risks:

- operator meaning unclear হতে পারে
- code clever but unreadable হতে পারে
- unexpected side effects আসতে পারে
- maintainability কমে

Bad conceptual example:

```text
user1 + user2

এটা কী বোঝায়?
merge user?
add score?
combine permission?
```

Better Java style:

```java
User merged = user1.mergeWith(user2);
```

Method name intention clear করে।

---

## 🔀 24. What is the difference between ad-hoc polymorphism, parametric polymorphism, and subtype polymorphism?

Polymorphism তিনভাবে দেখা যায়:

| Type | Meaning | Java example |
|---|---|---|
| Ad-hoc polymorphism | same name, different parameter types | method overloading |
| Parametric polymorphism | type parameter দিয়ে generic code | generics |
| Subtype polymorphism | parent/interface reference child object hold করে | overriding/interface |

**Ad-hoc polymorphism:**

```java
class Formatter {
    public String format(int value) {
        return "int: " + value;
    }

    public String format(String value) {
        return "string: " + value;
    }
}
```

**Parametric polymorphism:**

```java
import java.util.ArrayList;
import java.util.List;

class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<String> stringBox = new Box<>();
        stringBox.set("hello");

        Box<Integer> intBox = new Box<>();
        intBox.set(10);

        List<String> names = new ArrayList<>();
        names.add("Rahim");
    }
}
```

**Subtype polymorphism:**

```java
interface DiscountPolicy {
    double apply(double total);
}

class NoDiscount implements DiscountPolicy {
    public double apply(double total) {
        return total;
    }
}

class PercentageDiscount implements DiscountPolicy {
    private final double percent;

    public PercentageDiscount(double percent) {
        this.percent = percent;
    }

    public double apply(double total) {
        return total - (total * percent / 100);
    }
}
```

```java
DiscountPolicy policy = new PercentageDiscount(10);
double finalPrice = policy.apply(1000); // 900
```

### How do generics/templates relate to parametric polymorphism?

Java generics allow same class/method logic work with different types safely.

Without generics:

```java
import java.util.ArrayList;
import java.util.List;

List values = new ArrayList();
values.add("hello");

String text = (String) values.get(0); // manual cast needed
```

With generics:

```java
List<String> values = new ArrayList<>();
values.add("hello");

String text = values.get(0); // no cast needed
```

Generic method:

```java
public class ArrayUtils {
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

Bounded generic:

```java
public class NumberUtils {
    public static <T extends Number> double sum(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }
}
```

Parametric polymorphism benefit:

- type-safe reusable code
- less casting
- compile-time error detection
- one algorithm works for many types

---
