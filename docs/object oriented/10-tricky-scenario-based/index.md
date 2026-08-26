---
sidebar_position: 10
title: 'Scenarios'
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

