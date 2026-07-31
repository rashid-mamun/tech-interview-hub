---
sidebar_position: 3
title: 'Requirements Engineering'
---

## 3. Requirements Engineering

অনেক software project code quality-এর জন্য না, বরং **ভুল problem solve করার জন্য** fail করে। Requirements engineering হলো stakeholder-এর need বুঝে সেটিকে clear, testable, manageable software requirement-এ রূপান্তর করার discipline।

```text
Stakeholder need
       |
       v
Elicitation -> Analysis -> Specification -> Validation -> Management
       ^                                                     |
       |---------------- change and feedback ----------------|
```

Example: restaurant owner বলে, “আমার order যেন দ্রুত আসে।” এটি useful business signal, কিন্তু developer-এর জন্য implementable requirement না। “দ্রুত” কত? কোন user? কোন screen? কোন load-এ? এগুলো বের করাই requirements engineering-এর কাজ।

---

## Main activities

| Activity | প্রশ্ন | Output |
|---|---|---|
| Elicitation | কার কী দরকার? | raw needs, notes, questions |
| Analysis | conflict/ambiguity আছে? feasible? | refined, prioritized requirements |
| Specification | team কীভাবে বুঝবে? | SRS, stories, use cases, diagrams |
| Validation | requirement correct/complete/testable? | reviewed and approved baseline |
| Management | change হলে কী impact? | versions, traceability, decisions |

### End-to-end example

```text
Raw request:
"Customers should be able to cancel orders."

Analysis questions:
- payment হওয়ার পর cancel করা যাবে?
- restaurant accept করার পর?
- refund কতক্ষণে?
- rider picked up করলে?

Specified rule:
Customer may cancel before restaurant accepts.
For prepaid orders, refund is initiated automatically within 5 minutes.

Validated by:
Product owner, payment owner, restaurant operations, QA.
```

---

## Stakeholder analysis

Stakeholder শুধু client বা end-user না। যারা system ব্যবহার করে, operate করে, fund করে, regulate করে, বা impact পায় তারাই stakeholder।

```text
                 +----------------+
                 | Food-delivery  |
                 |    platform    |
                 +----------------+
                 /       |        \
        Customer     Restaurant    Rider
            |             |          |
       Support        Finance    Operations
            \             |          /
                 Regulator / Security
```

এক stakeholder-এর need আরেকজনের সঙ্গে conflict করতে পারে। Customer one-tap cancellation চায়; restaurant late cancellation কমাতে চায়; finance auditable refund trail চায়। Requirement workshop-এ এই conflict early surface করা জরুরি।

---

## Requirements elicitation techniques

একটি technique rarely enough। Stakeholder যা বলেন, যা করেন, এবং যা actually need করেন, এই তিনটি সবসময় এক না।

| Technique | Best for | Example | Limitation |
|---|---|---|---|
| Interview | deep context | support agent-এর refund flow বোঝা | small sample bias |
| Workshop | conflict/decision | cancellation policy agree করা | dominant voice problem |
| Observation | real workflow | restaurant tablet ব্যবহার দেখা | people may change behavior |
| Questionnaire | broad input | 1,000 customer survey | shallow answers |
| Document analysis | rules/history | existing refund policy পড়া | document outdated হতে পারে |
| Prototype | UX discovery | checkout screen test | not full business rule |
| Use case | interactions and alternate flow | order cancellation path | detail maintain করতে হয় |

### Interview example

Bad question:

```text
"আপনার কি refund dashboard দরকার?"
```

এতে interviewer solution suggest করে ফেলছে। Better questions:

```text
"সর্বশেষ refund request-এ আপনি কী করেছিলেন?"
"কোন তথ্য খুঁজতে সবচেয়ে সময় লাগে?"
"কোন অবস্থায় আপনি refund approve করতে পারেন না?"
```

এই প্রশ্নগুলো real workflow, exception, pain point বের করে।

---

## Functional, non-functional, and domain requirements

### Functional requirement (FR)

System কী **করে**।

```text
FR-12: A customer shall be able to cancel an order before restaurant acceptance.
```

### Non-functional requirement (NFR)

System কত ভালোভাবে বা কী constraint-এর মধ্যে কাজ করে। Quality attribute এবং constraint সাধারণত NFR।

```text
NFR-07: The cancellation API shall respond within 2 seconds for 95% of requests
        under 500 concurrent users.
```

### Domain requirement

Business domain, law, policy, or industry rule থেকে আসা requirement।

```text
DR-03: Refund records shall be retained for seven years under company policy.
```

| Type | Food-delivery example | Test idea |
|---|---|---|
| Functional | customer can save address | save then retrieve |
| Performance NFR | search p95 under 2 sec | load test |
| Security NFR | payment token never logged | security/log review |
| Usability NFR | new user can place order without training | usability test |
| Domain | VAT calculation follows rule | acceptance calculation cases |

### Vague requirement থেকে testable requirement

| Vague | Testable rewrite |
|---|---|
| “System should be fast” | “Search p95 response time shall be under 2 sec at 300 requests/sec” |
| “App should be secure” | “Passwords shall be salted and hashed; admin actions require MFA” |
| “Easy to use” | “At least 90% of tested first-time users can complete checkout within 3 minutes” |

যদি pass/fail objectiveভাবে বলা না যায়, requirement এখনও refine করা দরকার।

---

## SRS: Software Requirements Specification

**SRS** হলো agreed requirements-এর structured source of truth। এটি one giant document হওয়া বাধ্যতামূলক না; Agile team-এ it can be a combination of backlog, API contract, decision record, wireframe, and acceptance criteria। Important হলো content complete, accessible, and versioned থাকা।

Typical SRS sections:

```text
1. Purpose and scope
2. Stakeholders and glossary
3. Functional requirements / use cases
4. Non-functional requirements
5. Data and external interfaces
6. Assumptions and constraints
7. Acceptance criteria
8. Traceability and change history
```

### Good requirement characteristics

| Characteristic | Meaning |
|---|---|
| Correct | actual stakeholder need represents |
| Complete | important rule/exception missing না |
| Unambiguous | two people same meaning বুঝবে |
| Consistent | অন্য requirement-এর সঙ্গে conflict নেই |
| Feasible | budget, technology, time-এ possible |
| Prioritized | value/urgency clear |
| Verifiable | test/review দিয়ে confirm করা যায় |
| Traceable | source, design, test-এর সঙ্গে link করা যায় |

---

## Use case: a concrete interaction model

User story value communicate করে; **use case** normal flow ও alternate flow detail করতে পারে।

```text
Use case: Cancel prepaid order

Primary actor: Customer
Precondition: Order is placed and not accepted by restaurant

Main flow:
1. Customer opens order details.
2. Customer selects Cancel order.
3. System displays refund amount and reason options.
4. Customer confirms cancellation.
5. System marks order cancelled and initiates refund.
6. System notifies customer and restaurant.

Alternate flow:
3a. Restaurant already accepted the order.
    System shows "Contact support" instead of cancellation.
```

এই format developer, tester, designer, and product owner-কে same scenario নিয়ে কথা বলতে সাহায্য করে।

---

## Acceptance criteria and examples

Acceptance criteria story-এর boundary set করে। It should cover happy path, important business rules, and key error/edge cases।

```text
Story: As a customer, I want to cancel an eligible prepaid order,
so that I can correct an accidental order.

Acceptance criteria:
1. Cancellation button is visible only before restaurant acceptance.
2. Customer sees refundable amount before confirming.
3. On confirmation, order status becomes CANCELLED.
4. Refund request is created once, even if customer retries due to network failure.
5. Customer and restaurant receive notification.
```

Rule 4 হলো hidden but important engineering requirement: retry হলে duplicate refund হওয়া যাবে না। Good refinement often এমন failure scenario বের করে।

---

## Requirement prioritization

সব requirement একই সময়ে করা যায় না। Priority decide করার সময় value, risk, urgency, dependency, and effort consider করা হয়।

### MoSCoW method

| Category | Meaning | Example |
|---|---|---|
| Must have | ছাড়া release invalid | place order, payment safety |
| Should have | high value, workaround আছে | saved addresses |
| Could have | nice to have | order animation |
| Won't have now | explicitly not this release | group order feature |

### Simple value-risk discussion

```text
High value + high risk: payment gateway integration
-> build/prove early

Low value + high effort: animated delivery map theme
-> defer unless strategy needs it
```

Priority কোনো permanent truth না। Market condition বা legal deadline change হলে backlog reorder হবে।

---

## Traceability and RTM

**Requirements Traceability Matrix (RTM)** requirement-এর source থেকে implementation, test, and release পর্যন্ত link রাখে। এটি “কোন test কোন requirement verify করে?” প্রশ্নের answer দেয়।

```text
Business need -> Requirement -> Design/API -> Code -> Test -> Release
      |              |              |          |        |
      +--------------+--------------+----------+--------+
                    traceability links
```

| Req ID | Requirement | Design/API | Test ID | Status |
|---|---|---|---|---|
| FR-12 | cancel eligible order | `POST /orders/{id}/cancel` | AT-42 | passed |
| NFR-07 | p95 under 2 sec | cache design | PT-08 | passed |
| DR-03 | retain refund records | retention job | AT-67 | pending |

### RTM কেন দরকার?

- missing test ধরতে সাহায্য করে
- change impact analysis করা যায়
- regulated project-এ evidence দেয়
- obsolete requirement বা orphan feature identify করা যায়

Example: policy change হয়ে refund retention 7 থেকে 10 বছর হলে RTM থেকে data store, deletion job, legal test, documentation impact দ্রুত বের করা যায়।

---

## Requirement change and scope creep

**Scope creep** হলো proper evaluation/approval ছাড়া scope ধীরে ধীরে বাড়া। Change খারাপ না; unmanaged change খারাপ।

```text
Original: "Add order cancellation"
Then:    "Also add partial refund"
Then:    "Also auto-approve support cases"
Then:    "Also redesign order history"

Result: original estimate and release promise no longer meaningful.
```

Healthy change control:

1. Change request capture করো
2. Value, cost, risk, dependency impact analyse করো
3. Stakeholder decision record করো
4. Backlog/scope baseline update করো
5. Relevant tests and documents update করো

Agile-এ change control মানে committee approval বাধ্যতামূলক না। Often Product Owner backlog reorder করেন, কিন্তু team impact transparentভাবে জানে।

---

## Technical debt and requirements

**Technical debt** হলো দ্রুত delivery বা incomplete design-এর ফলে future cost বাড়া। এটি শুধু bad code না; undocumented decision, missing automated test, outdated dependency, unclear requirement-ও debt হতে পারে।

```text
Today: skip refund idempotency "to ship fast"
Tomorrow: duplicate refund incidents
Later: reconciliation, support cost, trust loss
```

Debt manage করার practical way:

- backlog-এ debt visible করো
- interest measure করো: incidents, slow delivery, maintenance cost
- high-risk debt আগে pay করো
- DoD-তে tests/review/documentation রাখো
- new feature-এর সাথে related cleanup include করো

সব debt immediately pay করা realistic না। Good judgment হলো risk এবং business value অনুযায়ী balance করা।

---

## Common interview questions

### Requirements gathering আর elicitation কি একই?

Often interchangeably use হয়। Elicitation একটু broader: stakeholder-এর latent need, conflict, assumption, constraint discover করার active process। শুধু list collect করা নয়।

### Functional and non-functional requirement-এর difference কী?

Functional requirement system behavior বলে, যেমন customer order cancel করতে পারবে। Non-functional requirement quality/constraint বলে, যেমন cancel API p95 2 second-এর মধ্যে response দেবে।

### Good SRS-এর characteristics কী?

Correct, complete, unambiguous, consistent, feasible, prioritized, verifiable, and traceable। সবচেয়ে জরুরি: implementation ও testing-এর জন্য shared understanding তৈরি করা।

### Requirement change কীভাবে handle করবে?

Change capture করে value, cost, risk, dependency, test impact analyse করব; right stakeholder-এর decision নেব; তারপর backlog/specification/traceability update করব। Change reject করাই goal না, informed trade-off করা goal।
