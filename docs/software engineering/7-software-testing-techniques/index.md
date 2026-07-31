---
sidebar_position: 7
title: 'Software Testing Techniques'
---

## 7. Software Testing Techniques

Testing-এর goal শুধু bug খুঁজে বের করা না; evidence তৈরি করা যে system expected behavior ও quality level meet করছে। Testing quality team-এর একার কাজও না। Developer, QA, product owner, security engineer, and operations সবাই different risk cover করে।

```text
Requirement -> design review -> automated tests -> exploratory tests -> production monitoring
                                  |                   |                    |
                              prevent defects      find defects        detect reality
```

ধরা যাক customer prepaid order cancel করবে। Happy path test করলেই যথেষ্ট না। Payment timeout, double-click, restaurant ইতিমধ্যে accept করেছে, refund amount, notification failure - এগুলোও test design-এর অংশ।

---

## Testing levels

| Level | Scope | Main question | Example |
|---|---|---|---|
| Unit test | function/class | ruleটি ঠিক? | discount calculation |
| Integration test | connected components | boundary ঠিক? | order service + database |
| System test | complete system | user workflow ঠিক? | checkout through UI/API |
| Acceptance test | business expectation | stakeholder need met? | user can get refund |

```text
Unit:
RefundCalculator -> amount 500, fee 20 -> refund 480

Integration:
CancelOrderUseCase -> RefundRepository -> database transaction

System:
Customer app -> API -> payment sandbox -> confirmation screen

Acceptance:
Product owner confirms cancellation policy behavior.
```

### Integration approaches

**Top-down integration** high-level flow আগে test করে; missing lower modules temporary stub দিয়ে replace হয়। User journey early validate হয়।

**Bottom-up integration** low-level component আগে combine করে; missing caller temporary driver দিয়ে call করা হয়। Foundation logic early validate হয়।

বাস্তব team often vertical slice বা risk-based integration করে, textbook style strictly না।

---

## Testing pyramid

Fast, deterministic test বেশি; slow end-to-end test fewer and carefully chosen রাখা ভালো।

```text
                 /\
                /  \       Few: end-to-end / UI tests
               / E2E\
              /------\
             /Integration\  Some: API, database, contract tests
            /------------\
           /  Unit tests   \ Many: rules, edge cases, fast feedback
          /________________\
```

| Test type | Strength | Cost/risk |
|---|---|---|
| Unit | fast, precise failures | may miss integration issue |
| Integration | validates real boundary | setup/slower execution |
| E2E | closest to user behavior | flaky, slow, costly to debug |

“More E2E tests” always better না। A login UI change যেন 500 unrelated tests fail না করে। Critical user path-এ E2E test রাখো, business rule unit test-এ রাখো, and external integration contract test-এ রাখো।

---

## White-box, black-box, and gray-box testing

| Style | Tester sees | Focus |
|---|---|---|
| White-box | code/internal structure | branch, path, implementation risk |
| Black-box | input/output contract | expected behavior without code knowledge |
| Gray-box | partial internal knowledge | data flow, integration, security |

### White-box example

```text
if amount >= 500:
    deliveryFee = 0
else:
    deliveryFee = 60
```

To cover both branches, test `500` and `499`। Code structure জানার কারণে branch coverage deliberate করা গেল।

### Black-box example

Tester policy জানে: “orders above 500 get free delivery.” Implementation if/else না দেখেও input/output verify করতে পারে।

---

## White-box coverage techniques

| Technique | Meaning | Limitation |
|---|---|---|
| Statement coverage | each executable line runs | branch outcome miss হতে পারে |
| Branch coverage | each decision outcome true/false runs | complex condition combination miss হতে পারে |
| Path coverage | possible control-flow paths run | loops-এ paths explode করে |
| Basis path testing | independent paths identify করে | still not every combination |

Example:

```text
if isMember and total >= 1000:
    applyDiscount()
else:
    noDiscount()
```

শুধু true branch এবং false branch run করলে branch coverage হতে পারে, কিন্তু `isMember=false, total=2000` এবং `isMember=true, total=500` business-wise different false cases। Coverage helpful signal, requirement coverage-এর substitute না।

---

## Black-box test design techniques

### Equivalence partitioning

Same behavior expected এমন input group থেকে representative case বেছে নেয়া।

```text
Delivery radius: 1 to 10 km

Invalid group: <= 0
Valid group:   1..10
Invalid group: > 10

Representative tests: 0, 5, 11
```

সব possible integer test করার দরকার নেই যদি same partition একই way behave করে।

### Boundary value analysis

Defect boundary-তে বেশি হয়। তাই edge এবং just-inside/outside test করো।

```text
Valid radius: 1..10
Test: 0, 1, 2, 9, 10, 11
```

### Decision table testing

Multiple rule combination থাকলে table clear করে।

| Prepaid? | Restaurant accepted? | Customer can cancel? | Refund action |
|---|---|---|---|
| no | no | yes | no refund |
| yes | no | yes | initiate refund |
| yes | yes | no | show support path |
| no | yes | no | show support path |

This technique hidden conflict or missing rule ধরতে excellent।

### State transition testing

Order state machine থাকলে valid/invalid transition test করো।

```text
CREATED -> PAID -> ACCEPTED -> OUT_FOR_DELIVERY -> DELIVERED
                     |
                     +-> CANCELLED only when policy allows
```

`DELIVERED -> CANCELLED` request rejected হচ্ছে কি না একটি important negative test।

---

## Functional and non-functional testing

**Functional testing** system কী করে তা verify করে। **Non-functional testing** system কত ভালোভাবে বা কী constraint-এ করে তা verify করে।

| Test area | Example question |
|---|---|
| Performance/load | 2,000 concurrent checkout-এ p95 latency কত? |
| Security | normal user কি admin refund endpoint call করতে পারে? |
| Reliability | payment provider timeout হলে order state consistent থাকে? |
| Usability | new user কি address add করতে পারে? |
| Accessibility | keyboard দিয়ে checkout complete করা যায়? |
| Compatibility | supported browser/device-এ screen ঠিক? |
| Recovery | database failover-এর পরে service recover করে? |

Performance test শুধু “fast” বলা না। Load profile, target metric, environment, and acceptable threshold define করো।

---

## Smoke, sanity, regression, alpha, beta

| Type | Purpose | Typical time |
|---|---|---|
| Smoke test | build usable কি না verify | every deployment/CI build |
| Sanity test | focused change plausible কি না | small fix after build |
| Regression test | old behavior still works কি না | change/merge/release |
| Alpha test | internal team validates near-release product | before external release |
| Beta test | selected real users validate in real environment | limited external rollout |

### Example

Payment SDK upgrade-এর পর smoke suite হয়: app starts, login works, product loads, checkout opens। তারপর payment-focused sanity suite। Full automated regression suite নিশ্চিত করে address, coupon, refund-এর existing behavior ভাঙেনি।

---

## Test doubles: stub, mock, fake

External payment gateway call করে unit test চালালে test slow, flaky, and potentially costly হবে। Test double use করা যায়।

| Double | What it does | Example |
|---|---|---|
| Stub | predefined answer দেয় | gateway always returns approved |
| Mock | expected interaction verify করে | `charge` called once with 500 |
| Fake | lightweight working implementation | in-memory order repository |

```text
Unit test: use fake repository + stubbed payment result
Integration test: use real database + payment sandbox
Production: real payment gateway
```

Test double production behavior hide করে ফেলছে কি না খেয়াল রাখো। Important integration-এর জন্য real/sandbox contract test দরকার।

---

## TDD: Test-Driven Development

TDD-তে production code-এর আগে ছোট failing test লেখা হয়। Cycle:

```text
RED       -> write a failing test
GREEN     -> write simplest code to pass
REFACTOR  -> improve design, keep tests green
                         |
                         v
                      repeat
```

Example thought process:

```text
Rule: order total 500 or more -> delivery fee 0

1. Test total=500 expects 0 fee (red)
2. Implement minimum behavior (green)
3. Add total=499 expects 60 fee
4. Refactor duplicate setup if needed
```

Benefits: feedback fast, behavior explicit, code testable হওয়ার pressure পায়। Challenges: it does not replace integration/E2E testing; poor test design can over-couple tests to implementation; unfamiliar team-এর pace শুরুতে slower লাগতে পারে।

### TDD vs BDD

| TDD | BDD |
|---|---|
| developer-level behavior and design feedback | shared business behavior and examples |
| tests often technical naming | scenarios readable by product/QA |
| focuses implementation cycle | focuses communication and acceptance |

BDD scenario example:

```text
Given a prepaid order not accepted by a restaurant
When the customer cancels it
Then the order is cancelled
And a refund request is created
```

Gherkin/Cucumber-like syntax useful only when scenario is maintained as a living shared contract; ceremonial step files alone bring little value।

---

## Code coverage: useful but incomplete

Coverage বলে test চলার সময় কত code executed হয়েছে। It cannot prove assertions are meaningful, requirements correct, or integration safe।

```text
100% line coverage possible when:
- every line is executed
- test asserts nothing useful
- wrong edge cases are absent
- external failure path is untested
```

Better questions:

- Critical business rule-এর behavior covered?
- Boundary, invalid input, and failure paths covered?
- Production defect-এর জন্য regression test added?
- Test is stable and understandable?

Coverage threshold can prevent completely untested code, but never treat it as a quality score।

---

## Testing in CI/CD

```text
Developer push
     |
Lint + unit tests
     |
Build + integration / contract tests
     |
Deploy to staging
     |
Smoke + selected E2E + security checks
     |
Production deploy -> monitor error rate / latency / business metrics
```

Fast feedback must come first. A test that takes 45 minutes belongs later in pipeline unless it blocks a critical risk. Flaky tests deserve urgent attention; teams will ignore red pipeline if “it is probably flaky.”

## Interview-ready answers

### Unit, integration, and system testing-এর difference কী?

Unit test isolated rule/component check করে। Integration test real components-এর boundary check করে। System test full workflow verify করে। They complement each other; one replaces another না।

### Smoke and sanity testing-এর difference কী?

Smoke checks whether a build is broadly usable after deployment. Sanity testing is a focused check that a specific change or fix behaves plausibly.

### 100% coverage কি bug-free code guarantee করে?

না। Coverage execution measure করে, correctness না। Missing assertion, bad requirement, wrong test data, concurrency issue, or external integration failure 100% coverage-এর মধ্যেও থাকতে পারে।
