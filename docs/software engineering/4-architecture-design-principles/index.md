---
sidebar_position: 4
title: 'Architecture and Design Principles'
---

## 4. Software Architecture and Design Principles

**Software architecture** হলো system-এর high-level shape: major components কী, তারা কীভাবে communicate করবে, data কোথায় থাকবে, এবং scalability/security/reliability-এর মতো quality goal কীভাবে meet হবে। Architecture diagram দেখলেই পুরো code detail জানা যায় না, কিন্তু system-এর important decisions জানা যায়।

```text
Customer App
     |
 API Gateway
  /     |      \
Order  Payment  Restaurant
Service Service  Service
  |        |         |
Order DB  Gateway   Menu DB
```

**Software design** আরও কাছের level-এর decision: একটি service-এর class, function, validation rule, database table, API request/response কেমন হবে।

| Level | Main question | Typical artifact |
|---|---|---|
| Architecture / HLD | system-এর major parts কীভাবে কাজ করবে? | context/container diagram, technology choice |
| Design / LLD | একটি part internally কীভাবে কাজ করবে? | class diagram, sequence diagram, API contract |

Example: “payment external provider দিয়ে হবে” architecture decision। “`RefundService` কীভাবে idempotency key save করবে” low-level design decision।

---

## Architecture is about trade-offs

কোন architecture universally best না। Decision context, constraint, team skill, traffic, deadline, compliance অনুযায়ী হয়।

```text
Need: launch quickly
Choice: modular monolith
Trade-off: independent scaling later harder

Need: independent deployments for many teams
Choice: microservices
Trade-off: operations and distributed-system complexity grows
```

### Quality attributes

| Attribute | Meaning | Design consequence |
|---|---|---|
| Scalability | more load handle করা | cache, queue, horizontal scaling |
| Availability | service stays usable | redundancy, retry, failover |
| Security | data/action protect করা | auth, authorization, encryption, audit |
| Performance | response quickly দেয়া | indexing, caching, async work |
| Maintainability | safe change করা | boundaries, tests, clear ownership |
| Observability | production behavior বোঝা | logs, metrics, traces |

একটি decision সব attribute improve করে না। Strong encryption security বাড়াতে পারে, কিন্তু performance cost থাকতে পারে। Cache speed বাড়ায়, কিন্তু stale-data handling যোগ করে। Architecture হলো এই trade-off explicit করা।

---

## Monolith, modular monolith, and microservices

### Monolith

Monolith-এ application এক deployable unit হিসেবে থাকে। একই codebase ও often same database থাকে। Monolith মানে automatically bad design না।

```text
Single deployable application

Web/API
  |- Order module
  |- Payment module
  |- Restaurant module
  |- Notification module
             |
          One database
```

### Microservices

Microservices-এ independently deployable services নিজেদের boundary ও usually own data নিয়ে কাজ করে। Network call দিয়ে communicate করে।

```text
Order Service ---- event ----> Notification Service
     |
   Order DB

Payment Service --> Payment DB
```

### Comparison

| Topic | Monolith | Microservices |
|---|---|---|
| Start-up complexity | low | high |
| Deployment | one unit | independent services |
| Cross-module call | in-process | network call |
| Data consistency | easier transaction | distributed consistency harder |
| Scale one feature | whole app scale | service-level scaling possible |
| Operations | simpler | monitoring, discovery, tracing needed |
| Team fit | small/early team | mature teams with clear ownership |

### Modular monolith: often the practical start

একটি **modular monolith** এক deployable app, কিন্তু internal module boundary strict। `Order` module direct `Payment` table access করবে না; public interface/event দিয়ে যোগাযোগ করবে। Later service extract করার পথ cleaner হয়।

```text
Application
  +---------------------+
  | Order Module         | --> OrderRepository
  +---------------------+
              |
           interface/event
              v
  +---------------------+
  | Payment Module       | --> PaymentRepository
  +---------------------+
```

**Interview insight:** microservices choose করা উচিত deployment frequency, scaling need, team boundary, and operational maturity-এর জন্য; fashionable হওয়ার জন্য না। Distributed transaction, network failure, duplicate message, tracing সব real cost।

---

## Layered architecture

Layered architecture responsibility অনুযায়ী code organize করে। সাধারণ example:

```text
Presentation layer     -> HTTP request, UI, controller
       |
Application layer      -> use-case orchestration
       |
Domain / business layer -> rules and core model
       |
Infrastructure layer   -> database, email, external API
```

### Order cancellation example

```text
OrderController
   -> CancelOrderUseCase
       -> Order.cancelIfEligible()
       -> PaymentGateway.requestRefund()
       -> OrderRepository.save()
```

- Controller HTTP status/JSON নিয়ে কাজ করবে।
- Use case operation coordinate করবে।
- Domain object cancellation rule own করবে।
- Infrastructure database/provider detail implement করবে।

### 3-tier vs n-tier

**3-tier** সাধারণত presentation, business, data tiers বোঝায়। **n-tier**-এ আরও separated tier থাকতে পারে, যেমন cache, integration, reporting, security। Tier physical deployment boundary-ও বোঝাতে পারে; layer logical code boundary। দুই শব্দকে interchangeable বলা common, কিন্তু exact context clarify করা ভালো।

---

## MVC, MVP, and MVVM

এই patterns presentation logic আলাদা রাখতে সাহায্য করে।

| Pattern | Main idea | Common fit |
|---|---|---|
| MVC | Model, View, Controller | server-side web / classic web apps |
| MVP | Presenter coordinates passive View | UI with explicit presenter |
| MVVM | View binds to ViewModel state | reactive UI frameworks |

```text
MVC
User -> Controller -> Model
          |             |
          v             v
        View <------- updated state

MVVM
View <---- binding ----> ViewModel ----> Model
```

সব project-এ pattern name force করা দরকার নেই। Goal হলো UI rendering, user interaction, and business logic এক file-এ জটলা না করা।

---

## Synchronous and asynchronous communication

### Synchronous

Caller response না পাওয়া পর্যন্ত অপেক্ষা করে।

```text
Order Service -> Payment Service: charge()
Order Service <- Payment Service: success/failure
```

Useful যখন next decision-এর জন্য answer immediately দরকার, যেমন checkout-এ payment accepted কি না। Risk: downstream slow/failed হলে caller blocked। Timeout, retry, circuit breaker দরকার হতে পারে।

### Asynchronous

Producer event/message পাঠিয়ে later processing allow করে।

```text
Order Service -> [OrderPlaced event] -> Message Broker
                                     |-> Notification Service
                                     |-> Analytics Service
                                     |-> Loyalty Service
```

Useful যখন sender-এর response wait করার দরকার নেই, যেমন confirmation email বা analytics। Benefits: decoupling and resilience। Costs: eventual consistency, duplicate event, ordering, debugging complexity।

### Event-driven architecture

Event বলে “কিছু ঘটেছে”; command বলে “এই কাজ করো।”

```text
Command: "Reserve inventory for order 125"
Event:   "InventoryReserved for order 125"
```

Consumer idempotent হওয়া জরুরি: একই `OrderPlaced` event দুইবার এলে email বা loyalty point দুইবার দেয়া যাবে না।

---

## Core design principles

### Separation of concerns

Different reason for change আলাদা জায়গায় রাখো।

Bad example:

```text
CheckoutController:
- validates HTTP input
- calculates discount
- writes SQL
- calls payment provider
- sends email
- formats HTML response
```

এই class change হবে payment change, pricing change, database change, UI change, email change - সব কারণে। Better design-এ responsibilities split হবে।

### DRY: Don't Repeat Yourself

একই **knowledge/rule** একাধিক জায়গায় independently maintain করা avoid করো।

```text
Bad:
Web checkout: "Free delivery above 500"
Mobile checkout: "Free delivery above 600"

Better:
DeliveryPricingPolicy owns the rule.
```

সব repeated lines DRY violation না। দুই isolated function-এর tiny similar codeকে premature abstraction দিলে coupling বাড়তে পারে। Duplicate হওয়ার আগে change reason একই কি না দেখো।

### KISS: Keep It Simple

Requirement solve করার simplest design prefer করো। Simple মানে careless না; understandable এবং proportionate।

```text
Need: one payment provider today
Simple: PaymentGateway interface + one implementation

Not necessary yet: 12-layer plugin engine with dynamic scripting
```

### YAGNI: You Aren't Gonna Need It

Possible future feature-এর জন্য আজ code/design বানিও না যদি concrete need না থাকে। “Maybe one day 50 currencies” বলে today complex currency platform বানানো over-engineering হতে পারে। But known near-term requirement এবং irreversible decision হলে sensible preparation করা যায়। YAGNI হলো deliberate simplicity, denial না।

---

## HLD and LLD deliverables

| High-Level Design | Low-Level Design |
|---|---|
| system context and boundaries | class/module responsibilities |
| component/service diagram | API request/response details |
| data flow and technology choice | table schema, validation rule |
| scaling/security approach | algorithm/error handling |
| major trade-offs | unit/integration test cases |

```text
HLD: "Order and Payment are separate modules; payment provider is external."

LLD: "CancelOrderUseCase sends idempotency key; refund table has unique order_id."
```

## Architecture checklist

Before committing a major design, ask:

- What business outcome and constraints are we optimizing for?
- What are the failure modes: timeout, invalid data, provider outage, traffic spike?
- Which data is source of truth, and which can be eventually consistent?
- Who owns each component and its production support?
- How will we observe, test, deploy, and roll back this change?

Good architecture makes important choices visible and revisitable. It does not predict every future feature.
