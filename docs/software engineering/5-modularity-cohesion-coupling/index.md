---
sidebar_position: 5
title: 'Modularity, Cohesion, and Coupling'
---

## 5. Modularity, Cohesion, and Coupling

Large software manageable হয় যখন আমরা এটিকে meaningful **module**-এ ভাগ করি। Module হতে পারে package, class, library, service, feature folder, or bounded component। Good module নিজের কাজ clear রাখে এবং অন্য module-এর internal detail কম জানে।

```text
Online store
  |- Catalog      : products and prices
  |- Order        : place/cancel order
  |- Payment      : charge/refund
  |- Notification : email/SMS/push
  |- Identity     : login and permissions
```

এই separation-এর quality বুঝতে two key concept:

- **Cohesion:** একটি module-এর ভিতরের জিনিসগুলো কতটা related
- **Coupling:** module-গুলোর মধ্যে dependency কতটা strong

Target হলো **high cohesion, low coupling**।

---

## Why modularity matters

একটি well-designed module ideally একটি understandable responsibility own করে এবং stable interface দেয়।

| Benefit | Real effect |
|---|---|
| Easier change | payment rule বদলালেও catalog code touch কম হয় |
| Easier test | order rule in isolation test করা যায় |
| Parallel work | team members different module-এ কাজ করতে পারে |
| Reuse | notification module multiple workflow-এ use হয় |
| Fault isolation | email failure order creation stop না-ও করতে পারে |

### Module boundary example

```text
Order module public API
  - placeOrder(customerId, items)
  - cancelOrder(orderId)
  - getOrderStatus(orderId)

Order module private details
  - order database tables
  - validation helpers
  - internal status mapping
```

Another module should call public API, not read Order-এর internal database table directly। Private detail leak হলে later change costly হয়।

---

## Cohesion: things that belong together

High cohesion মানে module-এর responsibilities একই purpose-এ serve করে।

```text
High cohesion: RefundService
- validate refund eligibility
- calculate refundable amount
- create refund request
- update refund status

Low cohesion: UtilityService
- calculate refund
- export CSV
- send SMS
- hash password
- parse date
```

`UtilityService` নামটি often warning sign: unrelated work এক জায়গায় জমেছে।

### Cohesion types

| Type | Meaning | Quality |
|---|---|---|
| Functional | one well-defined task | best |
| Sequential | one operation output feeds next | good |
| Communicational | same data used by related operations | acceptable |
| Procedural | same execution sequence, but separate purpose | weak |
| Temporal | same timeে run হয়, like startup tasks | weak |
| Logical | same category selected by flag | weak |
| Coincidental | unrelated operations grouped randomly | worst |

### Functional cohesion

```text
TaxCalculator
Input: invoice
Output: tax amount

All methods support one job: calculate tax correctly.
```

### Sequential cohesion

```text
ReportGenerator
1. Load sales data
2. Aggregate data
3. Format report

Output of step 1 feeds step 2; step 2 feeds step 3.
```

এটি reasonable, তবে reporting logic খুব বড় হলে loading/aggregation/presentation আলাদা module-এ নেয়া better হতে পারে।

### Logical cohesion: a common smell

```text
NotificationSender.send(type, target, message)

if type == EMAIL -> email logic
if type == SMS   -> SMS logic
if type == PUSH  -> push logic
```

সবই notification category-তে হলেও change reason আলাদা। Email provider change হলে SMS path touch না করা ideally better। Strategy/interface দিয়ে implementations separate করা যায়।

### Coincidental cohesion

```text
CommonUtils
- calculateDiscount()
- validatePassword()
- convertImage()
- findRestaurant()
```

এগুলোর একমাত্র relation হলো “কেউ জানত না কোথায় রাখবে।” এমন module discoverability, testing, ownership সব খারাপ করে।

---

## Coupling: how much modules know about each other

সব module completely independent হতে পারে না; communication দরকার। Goal zero coupling না, **appropriate and controlled coupling**।

### Data coupling: generally preferred

One module অন্য module-এ only needed data pass করে।

```text
PaymentService.charge(orderId, amount, currency)
```

Payment service Order service-এর database, internal objects, or UI state জানে না।

### Stamp coupling

Whole structure pass করা হয়, কিন্তু receiver কয়েকটি field use করে।

```text
PaymentService.charge(Order order)

PaymentService only needs order.id and order.total.
```

This can be convenient, but `Order` object change হলে Payment affected হতে পারে। A smaller `PaymentRequest` contract sometimes clearer।

### Control coupling

Caller flag দিয়ে receiver-এর behavior control করে।

```text
generateInvoice(invoice, true, false, "PDF")
```

Boolean/flag বাড়তে বাড়তে API unclear হয়। Separate operations or explicit options often better।

### Common coupling

Multiple modules same global mutable state share করে।

```text
GlobalConfig.currentDiscountRate = 20
```

কোন module value change করেছে বোঝা কঠিন; test order-dependent হয়। Immutable configuration and explicit dependency safer।

### Content coupling: worst form

এক module অন্য module-এর internal code/data modify বা depend করে।

```text
Order module directly updates Payment module's private database table.
```

Payment module schema change করলেই Order break করতে পারে। Public contract ছাড়া internal access avoid করো।

| Coupling type | Example | Risk |
|---|---|---|
| Data | explicit small parameters | low |
| Stamp | pass whole object | medium |
| Control | mode flags | medium-high |
| Common | shared global state | high |
| Content | reach into internals | very high |

---

## High cohesion + low coupling in practice

```text
                    +------------------+
                    | Order Module     |
                    | - order rules    |
                    | - status changes |
                    +--------+---------+
                             |
                   OrderPlaced event
                             |
             +---------------+---------------+
             v                               v
  +-------------------+            +-------------------+
  | Notification      |            | Loyalty           |
  | - send message    |            | - award points    |
  +-------------------+            +-------------------+
```

Order module doesn’t need to know email template or points formula। Each consumer owns cohesive concern, and event contract creates loose coupling।

But loose coupling has a cost: asynchronous event delivery may fail, arrive twice, or be delayed। Design must include retry, idempotency, and monitoring. “Loose” does not mean “free.”

---

## Coupling reduction techniques

### Depend on abstractions

```text
Checkout -> PaymentGateway interface <- StripeGateway
                                     <- BankGateway
```

Checkout knows `charge()` contract, not provider-specific API. This supports testing and provider swap, provided the abstraction represents a real stable need.

### Dependency injection

Dependency injection gives a module what it needs from outside, instead of constructing hidden dependency internally.

```text
Hidden dependency:
OrderService creates its own EmailClient

Explicit dependency:
OrderService receives a Notifier interface
```

This makes dependency visible and allows a test double in unit tests। DI alone good architecture guarantee করে না; an injected object can still have a bad boundary.

### Stable contracts

Avoid exposing database schema as an integration contract. Prefer versioned API, message schema, or module interface। Add fields in backward-compatible way; plan deprecation before removal।

---

## Module boundaries and microservices

Service boundary should follow business capability and ownership, not just tables or technical layers।

Weak split:

```text
UserService owns user_table
AddressService owns address_table
PhoneService owns phone_table
```

Every checkout may need three network calls. Better domain boundary may be `Customer Profile` if those data change together. Conversely Payment often deserves clear separate boundary because security, provider integration, and compliance differ.

### A practical boundary test

Ask:

- Do these responsibilities change for the same business reason?
- Can one team own and deploy this area independently?
- Does it need its own data consistency rule?
- Is communication through a small meaningful contract possible?
- Are we splitting only because “microservices” sounds modern?

---

## Common mistakes

| Mistake | Why it hurts | Better direction |
|---|---|---|
| giant `Utils` module | coincidental cohesion | move functions to owning domain |
| shared database for every service | content coupling | use service-owned data/API |
| deep object graph passed everywhere | stamp coupling | define focused request/value object |
| long parameter list of booleans | control coupling | use named options or separate command |
| duplicate same business rule | drift and bugs | establish one owner for the rule |

## Interview-ready explanation

**High cohesion, low coupling** means each module focuses on a closely related responsibility while exposing minimal, stable dependencies to others. Example: a Payment module owns charging and refunds, while Order module asks it through a clear contract instead of updating payment data directly. This makes changes, tests, and parallel development safer.

Remember: a class with only one tiny method is not automatically high cohesion, and a system with no dependencies is not realistic. Good modularity is about meaningful boundaries and controlled collaboration.
