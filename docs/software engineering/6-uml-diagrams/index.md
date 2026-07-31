---
sidebar_position: 6
title: 'UML Diagrams'
---

## 6. UML Diagrams

**UML (Unified Modeling Language)** হলো software system describe করার visual notation। UML diagram code replace করে না; shared understanding তৈরি করে। Good diagram একটি question answer করে, যেমন “Order placement-এ কারা interact করে?” বা “এই class-গুলোর relation কী?”

```text
Question: system-এর parts কী?
    -> component diagram

Question: user কী করতে পারে?
    -> use case diagram

Question: request চলার সময় message order কী?
    -> sequence diagram

Question: an order কোন state-এ যেতে পারে?
    -> state machine diagram
```

### Broad categories

| Category | Focus | Examples |
|---|---|---|
| Structural | system-এর static shape | class, component, deployment |
| Behavioral | behavior over time | use case, activity, state machine |
| Interaction | objects/services message exchange | sequence, communication |

বাস্তবে perfect UML notation-এর চেয়ে diagram readable এবং audience-এর জন্য useful হওয়া বেশি important।

---

## Class diagram

Class diagram classes, attributes, operations, and relationships দেখায়। এটি design-time static model।

```text
+------------------+
| Order            |
|------------------|
| - id             |
| - status         |
|------------------|
| + cancel()       |
| + total()        |
+------------------+
```

Notation convention:

```text
+ ClassName        +
| - privateField   |   - private
| # protectedField |   # protected
| + publicMethod() |   + public
+------------------+
```

### Common relationships

```text
Inheritance / generalization
CardPayment --------|> PaymentMethod
                      hollow triangle points to parent

Association
Customer -------- places -------- Order

Aggregation (whole-part, weak ownership)
Team o-------- Developer
      hollow diamond at whole

Composition (whole-part, strong lifecycle ownership)
Order *-------- OrderLine
      filled diamond at whole
```

### Association multiplicity

```text
Customer 1 -------- 0..* Order

One customer may have zero or many orders.
Each order belongs to exactly one customer.
```

### Composition vs aggregation

**Composition:** part cannot meaningfully live without whole in that model. Deleting an `Order` deletes its `OrderLine` records.

**Aggregation:** part can exist independently. Deleting a `Team` does not delete `Developer` people.

In normal application design, plain association often enough. Do not force diamond notation when lifecycle ownership unclear.

---

## Use case diagram

Use case diagram system boundary-এর বাইরে থাকা actor এবং system-এর services দেখায়। এটি implementation detail দেখায় না।

```text
          +-----------------------------------+
Customer  |         Food Delivery App         |
   o ---- | (Browse restaurants)               |
   | ---- | (Place order) ------------------+  |
   | ---- | (Track order)                   |  |
          +---------------------------------+--+
                                            |
Payment Gateway o --------------------------+
```

- **Actor:** system-এর বাইরে person বা external system
- **Use case:** actor-এর goal-oriented interaction
- **System boundary:** which system we are modeling

### `include` and `extend`

```text
(Place order) ---- <<include>> ----> (Process payment)

Every order placement requires payment processing.

(Place order) <---- <<extend>> ----- (Apply coupon)

Coupon is optional behavior under a condition.
```

`include` mandatory reusable sub-flow; `extend` optional/conditional addition। Arrow direction ভুল না করার জন্য sentence দিয়ে check করো: “Place order includes Process payment.”

---

## Sequence diagram

Sequence diagram objects/services-এর interaction time order-এ দেখায়। Top থেকে bottom time progresses।

```text
Customer    App      OrderService   PaymentGateway
   |          |            |              |
   | checkout |            |              |
   |--------->| placeOrder |              |
   |          |----------->| charge       |
   |          |            |------------->|
   |          |            |<-------------| success
   |          |            | create order |
   |          |            |------        |
   |          |<-----------| order id     |
   |<---------| confirmation              |
```

| Element | Meaning |
|---|---|
| Lifeline | participant’s existence over time |
| Message arrow | call, command, event, or return |
| Activation bar | participant is executing work |
| `alt` fragment | conditional alternatives |
| `loop` fragment | repeated interaction |

### Failure path using `alt`

```text
alt payment accepted
  create order
  return confirmation
else payment declined
  return payment error
end
```

Sequence diagram perfect for showing timeout, retry, authorization, and polymorphic runtime dispatch. It exposes hidden assumptions: does the order get saved before payment? What happens if notification fails?

---

## Activity diagram

Activity diagram workflow, decisions, concurrency দেখায়। Flowchart-এর মতো, কিন্তু UML activity diagram actions, object flow, and partitions/swimlanes model করতে পারে।

```text
Customer lane          System lane             Restaurant lane
    |                      |                         |
[Submit order] ------> [Validate cart]               |
                           |                         |
                       <items valid?>                |
                       /           \                 |
                    no              yes              |
                    |                |               |
             [Show error]      [Request payment]     |
                                      |               |
                                   <paid?>            |
                                   /    \             |
                                  no    yes ----------> [Accept/reject]
```

### Symbols in concept

```text
Filled circle        = start
Rounded rectangle    = action
Diamond              = decision/merge
Bullseye             = end
Horizontal bar       = fork/join parallel work
```

Swimlane বলে কোন role/system action-এর owner। এটি handoff এবং missing responsibility ধরতে useful।

---

## State machine diagram

State machine diagram একটি entity-এর valid states এবং event-driven transitions দেখায়। Lifecycle-heavy objects-এর জন্য excellent: order, ticket, payment, subscription, document approval।

```text
 [Created]
     | paymentAuthorized
     v
 [Paid] ---- restaurantAccepts ----> [Accepted]
   |                                      |
   | customerCancels                      | riderPicksUp
   v                                      v
[Cancelled] <--- deliveryFails --- [OutForDelivery]
                                             |
                                             | delivered
                                             v
                                         [Delivered]
```

একটি **state** হলো current condition; **transition** হলো event/guard-এর কারণে state change।

```text
[Paid] -- [refundEligible] customerCancels / initiateRefund --> [Cancelled]

guard: [refundEligible]
action: / initiateRefund
```

State diagram invalid transition prevent করার design aid। For example `Delivered -> Cancelled` allowed কি না diagram থেকেই discuss করা যায়।

---

## Component diagram

Component diagram deployable/logical large building block এবং dependency দেখায়। Class-level detail নয়।

```text
+----------------+       +----------------+
| Web Application | ----> | Order API      |
+----------------+       +-------+--------+
                                  |
                    +-------------+-------------+
                    v                           v
            +---------------+           +---------------+
            | Payment API   |           | Catalog API   |
            +---------------+           +---------------+
```

It answers: which component provides an interface, which one consumes it, and what external dependency exists? Architecture review-এ useful।

---

## Deployment diagram

Deployment diagram software components কোন physical/virtual node-এ run করে দেখায়। It is operational view।

```text
[Customer Phone]
        |
      HTTPS
        v
[Load Balancer]
        |
        +---------------------------+
        |                           |
 [App Server A]               [App Server B]
        |                           |
        +-----------> [PostgreSQL] <+
                         |
                    [Backup storage]
```

| Component diagram | Deployment diagram |
|---|---|
| logical software parts/dependencies | runtime nodes/network mapping |
| “Order API calls Payment API” | “Order API runs in two containers” |
| architecture ownership | infrastructure and availability |

---

## Object diagram vs class diagram

Class diagram defines types and possible relationships. Object diagram shows a snapshot of actual instances.

```text
Class view:
Customer 1 -------- 0..* Order

Object snapshot:
rahim:Customer -------- order102:Order
                       order103:Order
```

Object diagram useful when checking whether a complicated class relationship allows the intended concrete data.

---

## Choosing the right diagram

| Need | Best starting diagram |
|---|---|
| clarify scope and actors | use case |
| explain a request interaction | sequence |
| model business workflow | activity |
| constrain lifecycle transitions | state machine |
| describe domain structure | class |
| explain service/module dependencies | component |
| explain infrastructure | deployment |

### A good diagram has a purpose

Bad diagram: every class, database column, and service on one unreadable page.

Better approach:

```text
Audience: product + support
Diagram: order cancellation activity diagram

Audience: developers
Diagram: cancellation sequence diagram

Audience: operations
Diagram: deployment diagram with failover path
```

## Interview-ready answers

### Class diagram and object diagram-এর difference কী?

Class diagram types, attributes, operations, and allowable relationships দেখায়। Object diagram নির্দিষ্ট সময়ের actual instance এবং link দেখায়। প্রথমটি blueprint, দ্বিতীয়টি snapshot।

### Sequence diagram কেন useful?

এটি message ordering ও responsibility visible করে। API call, payment failure, retry, async event, and return path নিয়ে ambiguity কমায়।

### `include` এবং `extend` কী?

Use case diagram-এ `include` mandatory shared behavior; `extend` optional or conditionally added behavior। Order placement payment processing include করতে পারে; coupon apply optional extension হতে পারে।
