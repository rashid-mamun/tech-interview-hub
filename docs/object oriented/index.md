---
sidebar_position: 1
title: 'Object Oriented Programming'
---


# 1. OOP Fundamentals

## 1. What is Object-Oriented Programming, and what problems does it solve?

### How is OOP different from procedural programming?

### What are the advantages and disadvantages of OOP?

### When is OOP a good choice, and when might another paradigm be better?

---

## 2. What are the four main pillars of OOP?

### What are Encapsulation, Abstraction, Inheritance, and Polymorphism?

### How do these four concepts work together in real applications?

---

## 3. What is a class?

### Why is a class often called a blueprint?

### What can a class contain?

---

## 4. What is an object?

### What is the difference between a class and an object?

### What is an instance of a class?

### Can multiple objects be created from the same class?

---

## 5. What is the difference between object state and object behavior?

### How are fields/properties used to represent state?

### How are methods used to represent behavior?

---

## 6. What is the difference between an instance variable and a class/static variable?

### Which data belongs to each object?

### Which data is shared among all objects?

---

## 7. What is the difference between an instance method and a class/static method?

### Why can a static method usually not directly access instance data?

### When should a method be static?

---

## 8. What is the difference between an object and a reference to an object?

### Can multiple references point to the same object?

### What happens when one reference modifies a shared mutable object?

---

# 2. Encapsulation and Abstraction

## 9. What is encapsulation?

### Why is encapsulation important?

### How does encapsulation reduce coupling?

### Is encapsulation only about making variables private?

---

## 10. What is data hiding?

### What is the difference between data hiding and encapsulation?

### Can encapsulation exist without strict private fields?

---

## 11. What are access modifiers?

### What is the difference between public, private, protected, and internal/package-private access?

### Why do access rules differ across programming languages?

---

## 12. What are getters and setters?

### Why are they used instead of direct field access?

### Should every private field always have a getter and setter?

### How can excessive getters/setters weaken encapsulation?

---

## 13. What is an immutable object?

### How is immutability achieved?

### What are the benefits of immutable objects?

### Why are immutable objects useful in multithreaded systems?

---

## 14. What is abstraction?

### What does "hide implementation details and expose essential behavior" mean?

### How does abstraction reduce complexity?

---

## 15. What is the difference between abstraction and encapsulation?

### Can abstraction and encapsulation work together?

### Can you give an example where both concepts are used?

---

## 16. What is an abstract class?

### Can an abstract class have a constructor?

### Can it contain fields and concrete methods?

### Can an abstract class exist without abstract methods?

### Why can an abstract class usually not be instantiated?

---

## 17. What is an interface?

### What problem does an interface solve?

### How does an interface help achieve abstraction and loose coupling?

### Can unrelated classes implement the same interface?

---

## 18. What is the difference between an interface and an abstract class?

### When should you choose an interface?

### When should you choose an abstract class?

### Which is better for representing capabilities?

### Which is better for sharing common state or implementation?

---

# 3. Inheritance and Object Relationships

## 19. What is inheritance?

### What problem does inheritance solve?

### What is a base/superclass?

### What is a derived/subclass?

---

## 20. What are the different types of inheritance?

### What are single, multilevel, hierarchical, multiple, and hybrid inheritance?

### Which inheritance types are supported differently across languages?

---

## 21. What is the diamond problem?

### Why can multiple inheritance create ambiguity?

### How do different languages handle or avoid this problem?

---

## 22. What is an "is-a" relationship?

### When does inheritance correctly represent an "is-a" relationship?

### Why is every conceptual "is-a" relationship not necessarily good inheritance?

---

## 23. What is a "has-a" relationship?

### How does a "has-a" relationship differ from "is-a"?

### Why is composition usually associated with "has-a"?

---

## 24. What is association?

### What does association mean between two objects?

### Can association be one-way or two-way?

---

## 25. What is aggregation?

### Why is aggregation considered a weak "has-a" relationship?

### Can the child object exist independently of the parent object?

---

## 26. What is composition?

### Why is composition considered a strong "has-a" relationship?

### How does lifecycle ownership differ from aggregation?

---

## 27. What is the difference between association, aggregation, and composition?

### How do ownership and lifecycle differ among them?

---

## 28. What does "favor composition over inheritance" mean?

### Why is composition often more flexible than inheritance?

### Does this mean inheritance should never be used?

---

## 29. When should you choose inheritance instead of composition?

### What signs indicate inheritance is appropriate?

### What problems can deep inheritance hierarchies create?

---

## 30. What does it mean to make a class or method final/sealed/non-inheritable?

### Why would you prevent inheritance or overriding?

---

# 4. Polymorphism

## 31. What is polymorphism?

### Why is polymorphism useful?

### How does polymorphism improve extensibility?

---

## 32. What are the main types of polymorphism?

### What are subtype polymorphism, parametric polymorphism, ad-hoc polymorphism, and coercion polymorphism?

---

## 33. What is compile-time polymorphism?

### How does method/function overloading relate to compile-time polymorphism?

### How do generics/templates relate to parametric polymorphism?

---

## 34. What is runtime polymorphism?

### How does method overriding enable runtime polymorphism?

### Why is dynamic dispatch required?

---

## 35. What is method overloading?

### What rules govern method overloading?

### Can methods be overloaded based only on return type?

### How does the compiler choose the correct overloaded method?

---

## 36. What is method overriding?

### What rules normally apply to overriding?

### How does overriding enable runtime polymorphism?

### Can return types differ when overriding?

---

## 37. What is the difference between method overloading and method overriding?

### Which occurs at compile time?

### Which occurs at runtime?

### Does inheritance have to exist for both?

---

## 38. What is method hiding?

### How is method hiding different from overriding?

### Why are static/class methods often hidden instead of overridden?

---

## 39. What is a covariant return type?

### How does it relate to overriding?

---

## 40. What is static binding or early binding?

### Which method calls are commonly resolved statically?

---

## 41. What is dynamic binding or late binding?

### How does runtime dispatch choose an overridden method?

---

## 42. What happens when a parent/base-type reference points to a child/derived object?

### Which members are accessible at compile time?

### Which overridden method executes at runtime?

---

# 5. Object Lifecycle and Memory

## 43. What is a constructor?

### How is a constructor different from a regular method?

### What is its main purpose?

---

## 44. What is a default constructor?

### When is it automatically created?

### When might it not be provided?

---

## 45. What is a parameterized constructor?

### What is constructor overloading?

---

## 46. What is constructor chaining?

### How does one constructor call another?

### In what order are parent and child constructors executed?

---

## 47. Are constructors inherited or overridden?

### Why are constructors treated differently from normal methods?

---

## 48. What is object copying?

### What is the difference between copying an object and copying a reference?

---

## 49. What is the difference between shallow copy and deep copy?

### What problems can shallow copying create with mutable referenced objects?

---

## 50. What is object destruction or resource cleanup?

### Why do some languages have destructors while others rely on garbage collection?

### What resources still require explicit cleanup?

---

## 51. What is garbage collection?

### How does garbage collection manage object lifecycle?

### Does garbage collection eliminate memory leaks completely?

---

## 52. What is reference counting?

### How is it different from tracing/mark-and-sweep garbage collection?

### What problem can cyclic references create?

---

## 53. How can memory leaks occur in garbage-collected languages?

### What does it mean for an unnecessary object to remain reachable?

---

# 6. Good OOP Design and SOLID

## 54. What is coupling?

### What is the difference between tight coupling and loose coupling?

### Why is loose coupling usually preferred?

---

## 55. What is cohesion?

### What is the difference between high cohesion and low cohesion?

### Why should a class have a focused responsibility?

---

## 56. Why do good OOP designs usually aim for high cohesion and low coupling?

---

## 57. What does SOLID stand for?

### Why are SOLID principles important?

### Are SOLID principles strict rules or guidelines?

---

## 58. What is the Single Responsibility Principle?

### What does "one reason to change" mean?

### How do you identify a class that violates SRP?

---

## 59. What is the Open/Closed Principle?

### What does "open for extension but closed for modification" mean?

### How does polymorphism help achieve OCP?

---

## 60. What is the Liskov Substitution Principle?

### What does substitutability mean?

### Why is the Square/Rectangle example commonly used to explain LSP?

---

## 61. What is the Interface Segregation Principle?

### Why are small, focused interfaces usually better than one large interface?

---

## 62. What is the Dependency Inversion Principle?

### What does it mean for high-level modules to depend on abstractions?

---

## 63. What is Dependency Injection?

### How does DI reduce coupling?

### What are constructor, setter/property, and method injection?

---

## 64. What is Inversion of Control?

### How is IoC related to Dependency Injection?

### Is Dependency Injection the only form of IoC?

---

## 65. What is the difference between Dependency Injection and Service Locator?

### Why can Service Locator hide dependencies?

---

## 66. What is the Law of Demeter?

### What does "talk only to your immediate friends" mean?

---

## 67. What is the "Tell, Don't Ask" principle?

### How does it improve encapsulation?

---

## 68. What is the difference between an Entity and a Value Object?

### Why are Value Objects often immutable?

### Why are Entities usually identified by identity rather than field equality?

---

## 69. What is the difference between an anemic domain model and a rich domain model?

### Why can putting behavior close to data improve encapsulation?

---

# 7. Important Design Patterns

## 70. What are design patterns?

### What is the difference between creational, structural, and behavioral patterns?

### Why should patterns not be used just for the sake of using them?

---

## 71. What is the Singleton pattern?

### How does Singleton ensure one instance?

### Why is Singleton sometimes considered an anti-pattern?

### What problems can global shared state create?

---

## 72. What is the Factory Method pattern?

### Why use a factory instead of directly creating objects?

### How is Factory Method different from Abstract Factory?

---

## 73. What is the Builder pattern?

### When is Builder better than a constructor with many parameters?

### What is the telescoping constructor problem?

---

## 74. What is the Strategy pattern?

### How does Strategy replace large conditional blocks?

### How does Strategy demonstrate composition over inheritance?

---

## 75. What is the Observer pattern?

### Where is Observer commonly used?

### How does Observer relate to event-driven programming?

---

## 76. What is the Decorator pattern?

### How does Decorator extend behavior without modifying the original class?

### How is Decorator different from inheritance?

---

## 77. What is the Adapter pattern?

### What problem does Adapter solve?

### How is Adapter different from Facade?

---

## 78. What is the difference between Strategy and State patterns?

### Why do they look structurally similar but solve different problems?

---

# 8. Java-Specific OOP Interview Questions

## 79. Why does Java not support multiple inheritance of classes?

### How do interfaces provide an alternative?

### How does Java avoid the traditional diamond problem with classes?

---

## 80. What is the difference between `==` and `equals()` in Java?

### What is reference equality?

### What is logical/value equality?

---

## 81. What is the `equals()` and `hashCode()` contract in Java?

### Why should equal objects return the same hash code?

### What problems occur when the contract is violated?

---

## 82. What are the important methods inherited from Java's `Object` class?

### What are `equals()`, `hashCode()`, `toString()`, and `getClass()` used for?

---

## 83. Can static, private, or final methods be overridden in Java?

### What happens when a subclass declares a static method with the same signature?

### Why are private methods not normally overridden?

---

## 84. What kinds of methods can a Java interface contain?

### What are abstract, default, static, and private interface methods?

### Why were default methods introduced?

---

## 85. What is the difference between `final`, `finally`, and `finalize()` in Java?

### Why is `finalize()` deprecated/obsolete for resource management?

---

## 86. How do you create an immutable class in Java?

### Why are `String` and many value-like types immutable?

---

## 87. What are upcasting and downcasting in Java?

### What is `instanceof` used for?

### What happens when an invalid downcast is attempted?

---

# 9. C++-Specific OOP Interview Questions

## 88. What is a virtual function in C++?

### Why is the `virtual` keyword used?

### How does it enable runtime polymorphism?

---

## 89. What is a pure virtual function?

### How does it make a class abstract?

### Can an abstract C++ class contain concrete methods and fields?

---

## 90. What is a virtual destructor?

### Why should a polymorphic base class usually have a virtual destructor?

### What can go wrong when deleting a derived object through a base pointer without one?

---

## 91. How does C++ handle the diamond problem?

### What is virtual inheritance?

### How does it prevent duplicate base-class subobjects?

---

## 92. What is object slicing in C++?

### When does object slicing occur?

### Why are references or pointers commonly used for polymorphic objects?

---

## 93. What is the difference between static binding and dynamic binding in C++?

### What happens when a function is not virtual?

### What changes when it is virtual?

---

## 94. What is a copy constructor in C++?

### When is it called?

### How is it related to shallow and deep copying?

---

## 95. What is the copy assignment operator?

### How is copy assignment different from copy construction?

---

## 96. What are the Rule of Three, Rule of Five, and Rule of Zero?

### Why are these rules important for resource-owning classes?

---

## 97. What are move constructor and move assignment in C++?

### Why were move semantics introduced?

### How do move operations differ from copying?

---

## 98. What is the `this` pointer in C++?

### When is it useful?

---

## 99. What are `override` and `final` in C++?

### Why is `override` safer than relying only on matching method signatures?

---

## 100. What is operator overloading in C++?

### How does it relate to ad-hoc polymorphism?

### What are the risks of abusing operator overloading?

---

# 10. Tricky and Scenario-Based Interview Questions

## 101. Can inheritance be used purely for code reuse?

### Why can implementation inheritance create unnecessary coupling?

### When would composition be better?

---

## 102. If all fields of a class are private, is the class automatically well encapsulated?

### What if the class exposes internal mutable objects through getters?

---

## 103. Can a subclass violate the contract of its parent even if the code compiles?

### How does this relate to LSP?

---

## 104. Why is a `Bird` class with a mandatory `fly()` method problematic if `Penguin` inherits from it?

### How would you redesign the hierarchy?

---

## 105. A class has many `if/else` checks based on object type. What OOP design problem might this indicate?

### Could polymorphism or Strategy improve the design?

---

## 106. A class handles validation, database access, email sending, logging, and business logic. What is wrong with the design?

### Which SOLID principle is being violated?

### How would you refactor it?

---

## 107. An interface contains many methods, but most implementing classes use only a few. What is wrong?

### Which SOLID principle applies?

---

## 108. Every time a new payment method is added, the existing payment class must be modified. Which principle is being violated?

### How could interfaces, polymorphism, Strategy, or Factory help?

---

## 109. How would you design a Notification system supporting Email, SMS, and Push Notifications?

### Which abstractions would you introduce?

### How would you add a new channel without modifying existing business logic?

---

## 110. How would you design a Payment system supporting multiple payment methods?

### Where would Strategy or Factory patterns be useful?

### How would you keep the design open for future providers?

---

## 111. How would you design a Parking Lot system using OOP?

### What main classes and relationships would you identify?

### Where would you use inheritance?

### Where would you use composition?

---

## 112. How do you decide whether something should be a class, an interface, or just a simple function/data structure?

### Why should every noun in a requirement not automatically become a class?

---

## 113. How do you decide between an interface and an abstract class?

### Is shared implementation required?

### Is shared state required?

### Are unrelated classes expected to support the same capability?

---

## 114. How do you decide between inheritance and composition?

### Is true behavioral substitutability present?

### Is behavior likely to change independently?

---

## 115. How does good OOP design improve testability?

### Why are loosely coupled objects easier to test?

### How do abstractions help with mocks, fakes, or alternate implementations?

---

## 116. What are common OOP code smells?

### What are God Object, deep inheritance, duplicated behavior, feature envy, primitive obsession, and circular dependencies?

### How can these smells indicate design problems?

---

## 117. What does "program to an interface, not an implementation" mean?

### Why does this improve flexibility and testability?

---

## 118. What does "encapsulate what varies" mean?

### How does this idea appear in Strategy, Factory, and other patterns?

---

## 119. Can a program use classes everywhere and still have poor OOP design?

### What characteristics actually make a design object-oriented?

---

## 120. How would you evaluate whether an OOP design is good?

### Are responsibilities clear?

### Are object invariants protected?

### Is coupling reasonable?

### Is cohesion high?

### Can the design be extended without modifying unrelated code?

### Is the design easy to test and understand?
