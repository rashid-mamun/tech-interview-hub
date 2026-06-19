---
sidebar_position: 1
title: 'Software Engineering'
---

# 💻 Software Engineering: Interview Questions

---

## 1. 🔄 SDLC Models and Methodologies

**1. What is the SDLC, and what are its typical phases?**
- What is the difference between the Waterfall model and iterative/incremental models?
- What is the V-model, and in what contexts is it used?

**2. What is the Waterfall model, and what are its sequential phases?**
- What are the main advantages and disadvantages of the Waterfall model?
- In what kinds of projects is Waterfall still a reasonable choice?

**3. What is the Spiral model, and how does it incorporate risk management into the SDLC?**
- How many "loops" or iterations does the Spiral model typically involve, and what activities happen in each?
- How does the Spiral model differ from a simple iterative/incremental model?

**4. What is the Iterative and Incremental model, and how does it differ from Waterfall?**
- How does delivering the system in increments help reduce overall project risk?

**5. What is the Prototype model, and when is it useful?**
- What is the difference between a throwaway prototype and an evolutionary prototype?

**6. What is the Rapid Application Development (RAD) model?**
- What are its key characteristics, and what types of projects is it best suited for?

**7. How would you compare Waterfall, Spiral, Iterative, and Agile models in terms of flexibility, risk handling, and customer involvement?**
- For a project with rapidly changing requirements, which model would you recommend, and why?

---

## 2. 🏃 Agile, Scrum, and Kanban

**8. What is Agile, and how does it differ from Waterfall?**
- What are the core values and principles behind the Agile Manifesto?

**9. What is Scrum, and what are its key roles, artifacts, and ceremonies?**
- What are the responsibilities of the Product Owner, Scrum Master, and Development Team?
- What happens during sprint planning, daily standups, sprint review, and sprint retrospective?

**10. What is Kanban, and how does it differ from Scrum?**
- What is a WIP (Work In Progress) limit, and why is it important in Kanban?

**11. What is a user story, and what makes a good one?**
- What does the INVEST acronym (Independent, Negotiable, Valuable, Estimable, Small, Testable) stand for?

**12. What is the difference between epics, stories, and tasks?**
- How do these relate to a product backlog and a sprint backlog?

**13. What is a "Definition of Done," and why is it important for a team?**
- How does a Definition of Done differ from acceptance criteria for a specific story?

**14. What is the difference between a sprint and a release?**
- How do teams decide what gets included in a given release?

---

## 3. 📋 Requirements Engineering

**15. What is requirements engineering, and what are its main activities?**
- What is the difference between requirements elicitation, analysis, specification, validation, and management?

**16. What is a requirements specification document (SRS), and why is it important?**
- According to standards like IEEE 830, what characteristics should a good SRS have (e.g., unambiguous, complete, consistent, verifiable, traceable)?
- What is the difference between gathering, analyzing, and documenting requirements?

**17. What are common techniques for requirements elicitation?**
- How do interviews, questionnaires, brainstorming sessions, and use cases each contribute to gathering requirements?
- Is there a meaningful difference between "requirements gathering" and "requirements elicitation"?

**18. What is the difference between functional requirements, non-functional requirements, and domain requirements?**
- Can you give examples of each in the context of a real system (e.g., an online banking application)?

**19. What is a Requirements Traceability Matrix (RTM), and what purpose does it serve?**
- How does traceability help during testing, impact analysis, and change management?

**20. How are requirements prioritized, and what techniques are commonly used (e.g., MoSCoW)?**
- What is "requirements creep" (scope creep at the requirements level), and how is it controlled?

**21. What is technical debt, and how does it typically accumulate over the SDLC?**
- How do you balance paying down technical debt against delivering new features?

---

## 4. 🏗️ Software Architecture and Design Principles

**22. What is software architecture, and how does it differ from software design?**
- How does architecture address cross-cutting concerns like scalability and security?

**23. What is the difference between a monolithic architecture and a microservices architecture?**
- What are the trade-offs of microservices in terms of complexity, deployment, and team organization?
- What is a "modular monolith," and how does it sit between the two extremes?

**24. What is layered (n-tier) architecture, and what are its common layers?**
- What is the difference between a 3-tier architecture and an n-tier architecture?

**25. What is MVC (Model-View-Controller), and how does it separate concerns?**
- How does MVC differ from MVVM and MVP?

**26. What is the difference between tightly coupled and loosely coupled systems?**
- How does dependency injection help reduce coupling?

**27. What is the difference between synchronous and asynchronous communication between services?**
- What is event-driven architecture, and how does it relate to asynchronous communication?

**28. What does DRY (Don't Repeat Yourself) mean, and what problems can violating it cause?**
- Is all code duplication necessarily bad? When might some duplication be acceptable?

**29. What does KISS (Keep It Simple, Stupid) mean in the context of software design?**
- How do you balance simplicity with the need for extensibility?

**30. What does YAGNI (You Aren't Gonna Need It) mean?**
- How does YAGNI relate to over-engineering and premature optimization?

**31. What is "separation of concerns," and why is it a foundational design principle?**
- Can you give an example of a design that violates separation of concerns?

**32. What is the difference between high-level design (HLD) and low-level design (LLD)?**
- What artifacts are typically produced at each stage?

---

## 5. 🧩 Modularity, Cohesion, and Coupling

**33. What is modularity in software design, and why is it desirable?**
- How does modularity support easier testing, maintenance, and reuse of code?

**34. What is cohesion, and what are its different types (functional, sequential, communicational, procedural, temporal, logical, coincidental)?**
- Why is functional cohesion considered the most desirable, and coincidental cohesion the least?

**35. What is coupling, and what are its different types (content, common, control, stamp, data, message)?**
- Why is data coupling generally preferred over content or common coupling?

**36. What is the relationship between "high cohesion, low coupling" and good modular design?**
- How does this principle relate to concepts like microservice boundaries or class responsibilities in OOP?

---

## 6. 📊 UML Diagrams

**37. What is UML, and how are its diagrams broadly categorized?**
- What is the difference between structural (static) diagrams and behavioral (dynamic) diagrams?

**38. What is a class diagram, and what does it represent?**
- How are relationships such as inheritance, association, aggregation, and composition shown in a class diagram?

**39. What is a use case diagram, and what are its main components (actors, use cases, relationships)?**
- What is the difference between "include" and "extend" relationships in a use case diagram?

**40. What is a sequence diagram, and how does it show interaction between objects over time?**
- What do lifelines, activation bars, and messages represent in a sequence diagram?

**41. What is an activity diagram, and how does it differ from a traditional flowchart?**
- What do swimlanes represent in an activity diagram?

**42. What is a state machine (state chart) diagram, and what kinds of systems is it best suited for modeling?**
- What is the difference between a state and a transition in this diagram?

**43. What is a component diagram, and what does it show about a system's architecture?**
- How does a component diagram differ from a deployment diagram?

**44. What is a deployment diagram, and what does it represent in terms of physical architecture?**
- How would you use a deployment diagram to show how software components map onto hardware nodes?

**45. What is UML, and what are the most common diagrams used to model OOP systems?**
- What is the difference between a class diagram and an object diagram?

**46. 🔗 How are relationships like inheritance, composition, aggregation, and association represented in a UML class diagram?**
- What do the different arrow types/notations (e.g., open triangle, filled diamond, open diamond) represent?

**47. 🔄 What is a sequence diagram, and how does it help model interactions between objects?**
- How would you use a sequence diagram to illustrate polymorphic method calls at runtime?

**48. 🏗️ How would you go about designing the class structure for a real-world system (e.g., a library management system or an online ordering system)?**
- What entities, relationships, and responsibilities would you identify first?
- How would you decide which classes should be abstract vs concrete?

---

## 7. 🧪 Software Testing Techniques

**49. What are the different levels of testing, and how do they fit together?**
- How do unit testing, integration testing, system testing, and acceptance testing differ in scope and who typically performs each?
- What is the difference between top-down and bottom-up integration testing, and what role do "stubs" and "drivers" play in each?

**50. What is the difference between white-box testing and black-box testing?**
- What is gray-box testing, and how does it combine elements of both approaches?

**51. What are common white-box testing techniques?**
- What is statement coverage, branch coverage, and path coverage, and how do they differ?
- What is basis path testing, and how does it relate to cyclomatic complexity?

**52. What are common black-box testing techniques?**
- How does equivalence partitioning reduce the number of test cases needed while maintaining coverage?
- What is boundary value analysis, and why are input boundaries a common source of defects?
- What is decision table testing, and when is it particularly useful?

**53. What is the difference between alpha testing and beta testing?**
- Who performs each, and what is the primary goal of each?

**54. What is the difference between smoke testing and sanity testing?**
- When and why would you run a smoke test as part of a CI/CD pipeline?

**55. What is the difference between functional testing and non-functional testing?**
- Can you give examples of non-functional testing types (load testing, stress testing, usability testing, security testing, compatibility testing)?

**56. What is Test-Driven Development (TDD)?**
- Can you walk through the "red-green-refactor" cycle?
- What are the benefits and challenges of practicing TDD on a real project?

**57. What is the difference between TDD and BDD (Behavior-Driven Development)?**
- How do tools like Cucumber or Gherkin syntax support BDD?

**58. What is the difference between a mock, a stub, and a fake?**
- When would you use a mock vs. a real dependency in a unit test?

**59. What is code coverage, and what are its limitations as a quality metric?**
- Can a codebase have 100% coverage and still be poorly tested? Why?

**60. What is regression testing, and when should it be performed?**
- How does automated regression testing fit into a CI/CD pipeline?

**61. What is the "testing pyramid," and why is it shaped the way it is?**
- What are the trade-offs between having many unit tests vs. many end-to-end tests?

---

## 8. 📅 Estimation, Planning, and Project Management

**62. What are the main activities involved in software project management?**
- How do planning, organizing, staffing, monitoring, and controlling apply across a project's lifecycle?

**63. What is the COCOMO model, and how is it used for software cost and effort estimation?**
- What factors does COCOMO consider when estimating effort (e.g., project size, complexity, team experience)?

**64. How do you estimate the time required for a software development task?**
- What is the difference between optimistic, pessimistic, and most-likely estimates (e.g., in three-point estimation)?

**65. What is story point estimation, and how does it differ from time-based (hours/days) estimation?**
- What is "planning poker," and how does it help reduce estimation bias?

**66. What is "scope creep," and how do you manage it during a project?**
- What role does a change request process play in controlling scope?

**67. What is risk management in software projects, and what are its main steps?**
- What is the difference between risk identification, risk analysis, and risk mitigation?

**68. What are Gantt charts and PERT charts, and how are they used in project scheduling?**
- What is the "critical path" in a PERT chart, and why is it important?

**69. What is Software Configuration Management (SCM), and what does it manage?**
- How do version control, change control, and release management relate to SCM?

**70. How do you handle a situation where a deadline is at risk due to unforeseen issues?**
- What trade-offs (scope, time, quality, resources) can be adjusted, and what are the implications of each?

---