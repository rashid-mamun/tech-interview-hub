---
sidebar_position: 1
title: 'ObjectOriented Programming'
---


## 📖 1. What is Object Oriented Programming, and what problem does it solve compared to procedural programming?
### What are the four main pillars of OOP (encapsulation, abstraction, inheritance, polymorphism)?
### How does OOP improve code reusability and maintainability?

## 🧩 2. What is a class, and what is an object?
### What is the difference between a class and an object/instance?
### What is the difference between a class and a struct (in languages that have both)?

## 🏷️ 3. What is the difference between a class variable and an instance variable?
### What is the difference between a class method and an instance method?

## 🔄4. What is the difference between procedural and object-oriented programming paradigms?
### Can you give an example of the same problem solved procedurally vs. with OOP?


## 📦5. What is encapsulation, and why is it important?
### How does encapsulation help with data hiding and reducing coupling between modules?
### Can you give a real-world analogy for encapsulation?

## 🔐6. What are access modifiers, and how do they enforce encapsulation?
### What is the difference between public, private, protected, and (in some languages) package-private/internal access?
### What is the difference between "protected" access in different languages (e.g., C++ vs Java vs Python's convention-based privacy)?

## 🪞7. What are getters and setters, and why are they used instead of direct field access?
### What are the trade-offs of exposing getters/setters for every private field ("anemic" classes)?

## 🛡️8. What does it mean for a class to be "immutable," and how is immutability achieved?
### What are the benefits of immutable objects, especially in multithreaded contexts?


## 🖼️9. What is abstraction, and how does it differ from encapsulation?
### Can you give an example where abstraction and encapsulation work together?

## 🧩10. What is an abstract class, and when would you use one?
### Can an abstract class have a constructor? Why or why not?
### Can an abstract class have non-abstract (concrete) methods?

## 📜11. What is an interface, and how does it differ from an abstract class?
### Can a class implement multiple interfaces but extend only one class? Why is this design common?
### What are default methods in interfaces (e.g., Java 8+), and why were they introduced?

## 🎯12. When would you choose an interface over an abstract class, and vice versa?
### How does this decision relate to "is-a" vs "can-do" relationships?



## 👪13. What is inheritance, and what problem does it solve?
### What is the difference between a superclass/base class and a subclass/derived class?

## 🔄14. What are the different types of inheritance?
### What is the difference between single, multiple, multilevel, hierarchical, and hybrid inheritance?
### Why do some languages (like Java) not support multiple inheritance of classes directly?

## 💎15. What is the "diamond problem" in multiple inheritance, and how do different languages resolve it?
### How does C++ handle the diamond problem using virtual inheritance?
### How does Java avoid this problem entirely?

## 🔁16. What is method overriding, and what rules must be followed for it?
### What is the difference between overriding and "hiding" a method (e.g., shadowing static methods)?
### What is covariant return type, and how does it relate to overriding?

## 🚪17. What is the difference between "is-a" and "has-a" relationships?
### How would you decide whether to model a relationship using inheritance or composition?

## 🛑18. What does it mean to prevent a class or method from being inherited/overridden (e.g., `final` in Java, `sealed` in C#)?
### What are valid reasons to mark a class as non-inheritable?



## 🌈19. What is polymorphism, and what are its two main types?
### What is the difference between compile-time (static) polymorphism and runtime (dynamic) polymorphism?

## ➕20. What is method overloading, and what rules govern it?
### Can methods be overloaded based on return type alone? Why or why not?
### How does the compiler resolve which overloaded method to call?

### 🔁 21. What is method overriding, and how does it enable runtime polymorphism?
### How does the JVM (or equivalent runtime) decide which overridden method implementation to call at runtime?

## 📐22. What is dynamic method dispatch, and how is it implemented internally (e.g., vtables)?
### What is a virtual function, and how does the `virtual` keyword affect dispatch in C++?
### What is the performance cost of virtual function calls compared to regular function calls?

## 🎭23. What is operator overloading, and how does it relate to polymorphism?
### What are the risks or downsides of overusing operator overloading?

## 🔀24. What is the difference between adhoc polymorphism, parametric polymorphism, and subtype polymorphism?
### How do generics/templates relate to parametric polymorphism?



## 🛠️ 25. What is a constructor, and how does it differ from a regular method?
### What is a default constructor, and when is it automatically provided by the compiler?
### What is a parameterized constructor, and how does constructor overloading work?

## 🔗 26. What is constructor chaining, and how is it implemented (e.g., `this()`/`super()` calls)?
### In what order are constructors called in a class hierarchy during object creation?

## 📋 27. What is a copy constructor, and when is it used?
### What is the difference between a shallow copy and a deep copy?
### What problems can arise from a shallow copy of an object containing references/pointers?

## 🧹28. What is a destructor (or finalizer), and how does its role differ across languages?
### Why doesn't Java have destructors in the same sense as C++, and what replaces them?
### What is the difference between a destructor and a garbage collector's finalize method?

## ♻️29. How does garbage collection relate to object lifecycle management in OOP languages?
### What is reference counting, and how does it differ from mark-and-sweep garbage collection?
### What is a memory leak in a garbage-collected language, and how can it still occur?


## 🏷️30. What is the difference between static and instance members (fields and methods)?
### Why can't a static method access instance variables directly?
### When would you use a static method vs an instance method?

## 🧱31. What is a static (or class-level) variable, and how is it shared across instances?
### What are common use cases for static variables (e.g., counters, constants, singletons)?

## 🏛️32. What is a static nested class (or inner class), and how does it differ from a non-static inner class?
### What is the relationship between a non-static inner class and its enclosing class instance?

## 🎯33. What is a static initializer block (or static constructor), and when is it executed?



## 🔗 34. What is the difference between composition, aggregation, and association?
### How does the lifecycle dependency differ between composition and aggregation (e.g., can the "part" exist without the "whole")?

## 🏗️ 35. What is "composition over inheritance," and why is it often recommended?
### Can you give an example where composition leads to more flexible code than inheritance?

## 36. How would you refactor a class hierarchy that relies heavily on inheritance into one that uses composition?
### What design patterns (e.g., Strategy, Decorator) facilitate this kind of refactoring?



## 🔤 37. What does SOLID stand for, and why are these principles important in OOP design?

## 1️⃣ 38. What is the Single Responsibility Principle (SRP)?
### How would you identify that a class violates SRP?

## 2️⃣ 39. What is the Open/Closed Principle (OCP)?
### How does polymorphism help a class be "open for extension but closed for modification"?

## 3️⃣ 40. What is the Liskov Substitution Principle (LSP)?
### Can you give an example of a class hierarchy that violates LSP (e.g., the classic Square/Rectangle problem)?

## 4️⃣ 41. What is the Interface Segregation Principle (ISP)?
### Why is it better to have many small, specific interfaces rather than one large, general-purpose interface?

## 5️⃣ 42. What is the Dependency Inversion Principle (DIP)?
### How does dependency injection relate to DIP?
### What is the difference between dependency injection and the Service Locator pattern?



## 🗂️ 43. What are design patterns, and why are they useful in OOP?
### What is the difference between creational, structural, and behavioral design patterns?

## 1️⃣ 44. What is the Singleton pattern, and what are its potential downsides?
### How do you implement a thread-safe singleton?
### Why is Singleton sometimes considered an anti-pattern?

## 🏭 45. What is the Factory Method pattern, and how does it differ from the Abstract Factory pattern?
### When would you choose Factory Method over directly instantiating objects with `new`?

## 🎯 46. What is the Strategy pattern, and how does it relate to "favor composition over inheritance"?
### How does Strategy differ from the State pattern?

## 👀 47. What is the Observer pattern, and where is it commonly used?
### How does the Observer pattern relate to event-driven programming and pub/sub systems?

## 🎁 48. What is the Decorator pattern, and how does it allow extending behavior without modifying existing code?
### How does Decorator differ from simple inheritance for adding functionality?

## 🔌 49. What is the Adapter pattern, and what problem does it solve?
### What is the difference between the Adapter and Facade patterns?

## 🏗️ 50. What is the Builder pattern, and when is it preferred over a constructor with many parameters?


