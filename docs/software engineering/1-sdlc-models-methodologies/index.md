---
sidebar_position: 1
title: 'SDLC Models and Methodologies'
---

## 1. SDLC Models and Methodologies

**SDLC (Software Development Life Cycle)** হলো software idea থেকে production support পর্যন্ত কাজ করার structured process। শুধু code লেখা SDLC না; কী বানাতে হবে, কীভাবে validate হবে, কীভাবে release হবে, আর পরে কীভাবে improve হবে সবই এর অংশ।

একটি food-delivery app কল্পনা করো। User restaurant দেখবে, order করবে, payment দেবে, rider tracking দেখবে। এই feature-gুলোকে reliable product বানাতে দলকে repeatable একটা পথ দরকার। সেই পথই SDLC।

```text
Business idea
     |
     v
Requirements -> Design -> Development -> Testing -> Release -> Maintenance
     ^                                                        |
     |---------------- feedback / change --------------------|
```

বাস্তবে phase-gুলো সবসময় একবার করে শেষ হয় না। Modern team feedback পেলে requirements, design, বা code-এ ফিরে যায়। Model-এর পার্থক্য মূলত এই feedback loop কত দ্রুত এবং কত formal।

---

## SDLC-এর typical phases

| Phase | মূল প্রশ্ন | Food-delivery example | Output |
|---|---|---|---|
| Planning | কেন বানাব? কত cost/risk? | Dhaka-তে lunch delivery launch হবে? | scope, budget, risk list |
| Requirements | কী বানাব? | user cart, coupon, rider assignment | SRS, user stories |
| Design | কীভাবে বানাব? | payment flow, database schema, API contract | architecture, diagrams |
| Development | solution implement কীভাবে? | order service, mobile screens | source code |
| Testing | ঠিক কাজ করছে? | coupon ভুল total দিচ্ছে কি? | test report, bug list |
| Deployment | user-এর কাছে কীভাবে যাবে? | v1.2 production release | release, monitoring |
| Maintenance | পরে কী fix/improve করব? | slow search, payment bug | patches, enhancements |

### Phase মানে strict handoff না

একজন developer requirements বুঝতে গিয়ে ambiguity ধরতে পারে। QA test করতে গিয়ে missing rule ধরতে পারে। তাই healthy team-এ সবাই quality নিয়ে কাজ করে, যদিও ownership আলাদা।

```text
Product owner:  "Free delivery কখন?"
Developer:      "Minimum order amount দরকার।"
QA:             "Coupon + free delivery একসাথে হলে কী হবে?"
Result:         clearer requirement before production bug.
```

---

## Waterfall model

**Waterfall** হলো sequential model: এক phase বেশিরভাগ শেষ হওয়ার পর পরের phase শুরু হয়। Documentation, approval, এবং change control সাধারণত strong থাকে।

```text
Requirements
     |
     v
System Design
     |
     v
Implementation
     |
     v
Testing
     |
     v
Deployment
```

### Example: government payroll system

ধরা যাক tax rule, employee category, audit requirement আগে থেকেই আইন দ্বারা নির্ধারিত। এখানে team requirement freeze করে detailed design ও test evidence তৈরি করতে পারে। Mid-project-এ change expensive হলেও change কম হওয়ার সম্ভাবনা আছে। Waterfall reasonable হতে পারে।

### Advantages

- scope ও milestones পরিষ্কার থাকে
- documentation strong হয়
- regulated project-এ audit evidence পাওয়া সহজ
- fixed requirement হলে estimation সহজ হয়

### Limitations

- user feedback দেরিতে আসে
- requirement ভুল হলে late stage-এ ধরা পড়ে
- working software দেখতে অনেক সময় লাগে
- change request costly হতে পারে

### Interview answer

> Waterfall works best when requirements are stable, compliance and documentation matter, and the cost of late change is acceptable. It is risky for products where user needs are still being discovered.

---

## V-Model

**V-Model** Waterfall-এর disciplined variation। Left side-এ specification/design, right side-এ সেই level-এর matching verification/validation test। শুরুতেই test planning করা হয়।

```text
Requirements -------------------- Acceptance Testing
     \                              /
      System Design ---- System Testing
       \                  /
        Module Design - Integration Testing
             \          /
           Implementation
```

| Left-side artifact | Matching validation |
|---|---|
| Business requirement | acceptance test |
| System design | system test |
| Component/module design | integration test |
| Code | unit test |

### Example: medical-device software

যদি device-এর alarm ভুল সময়ে trigger করে, risk high। তাই requirement থেকে test case trace করা এবং evidence রাখা জরুরি। V-Model এই traceability-কে natural করে।

**Important:** V-Model testing শেষে শুরু হয় না। Requirement লেখার সময়ই ভাবা হয়, “এই requirement pass করেছে প্রমাণ করব কীভাবে?”

---

## Iterative and Incremental development

দুটি related idea:

- **Incremental:** product-এর usable slice একে একে deliver করা
- **Iterative:** existing slice feedback নিয়ে বারবার improve করা

```text
Increment 1: Restaurant list + menu
Increment 2: Cart + checkout
Increment 3: Online payment
Increment 4: Rider tracking

Iteration: checkout confusing? -> redesign -> measure -> improve
```

### Example

প্রথম release-এ cash-on-delivery রাখা হলো। Users সত্যি order complete করছে কি না দেখা গেল। এরপর online payment যোগ করা হলো। সব feature শেষ হওয়া পর্যন্ত অপেক্ষা না করে business earlier learning পায়।

### Why risk কমে?

| Risk | Incremental delivery কীভাবে help করে |
|---|---|
| Wrong feature | ছোট scope-এ user feedback পাওয়া যায় |
| Technical uncertainty | risky integration আগে build করা যায় |
| Late value delivery | usable version আগে release হয় |
| Big-bang failure | failure surface ছোট থাকে |

---

## Prototype model

**Prototype** হলো requirement বা interaction বুঝতে বানানো early model। এটি fully production-ready হওয়া বাধ্যতামূলক না।

```text
Unclear idea
    |
    v
Quick prototype -> User feedback -> Refined requirement -> Real implementation
```

### Example: checkout screen

Team জানে না user delivery address, tip, coupon কোন order-এ দিতে স্বাচ্ছন্দ্যবোধ করবে। Designer clickable screen prototype বানাল। পাঁচজন user test করে দেখা গেল coupon field লুকানো থাকায় সবাই miss করছে। Code করার আগে issue ধরা পড়ল।

### Throwaway vs evolutionary prototype

| Type | Meaning | Use when |
|---|---|---|
| Throwaway | শেখার জন্য বানাও, পরে ফেলে দাও | UI/requirement unclear |
| Evolutionary | prototype-এর উপরেই product build হয় | architecture enough mature, code quality maintained |

**Common trap:** throwaway prototype-কে deadline pressure-এ production-এ পাঠানো। এতে weak security, no tests, temporary data model দীর্ঘমেয়াদি debt হয়ে যায়।

---

## Spiral model

**Spiral model** risk-driven iterative model। প্রতিটি loop-এ objective ঠিক করা, risk analyse করা, solution build করা, তারপর stakeholder review করা হয়।

```text
Each loop:

1. Objectives and alternatives
           |
2. Identify and reduce risks
           |
3. Build and verify next version
           |
4. Stakeholder evaluation and next plan
           |
           v
        next loop
```

### Example: bank fraud-detection platform

Risk হতে পারে: false positive বেশি হলে legitimate payment block হবে; data privacy rule ভাঙা যাবে না; transaction volume handle হবে কি না। Spiral team প্রথমে high-risk proof of concept বানিয়ে unknown কমায়, তারপর broader product build করে।

### When Spiral fits

- large budget এবং high risk
- technology/new integration uncertain
- safety, security, legal risk significant
- stakeholder repeatedly evaluate করতে পারবে

Small CRUD project-এ Spiral usually too heavy; risk analysis-এর overhead value-এর চেয়ে বেশি হতে পারে।

---

## RAD (Rapid Application Development)

**RAD** দ্রুত user feedback এবং rapid prototyping-এর উপর জোর দেয়। Time-boxed development, reusable component, low-code tools, এবং frequent stakeholder involvement common।

```text
Requirements workshop
       |
Prototype <-> User feedback
       |
Rapid build -> Test -> Release
```

### Example

একটি internal leave-management portal দ্রুত দরকার। Workflow simple, users কাছে আছে, existing authentication service reuse করা যাবে। RAD approach-এ prototype নিয়ে HR-এর feedback থেকে কয়েক সপ্তাহে useful version deliver করা সম্ভব।

RAD less suitable যখন system খুব complex, performance/safety requirement strict, বা decision-maker feedback দিতে unavailable।

---

## Agile is a mindset, not one model

**Agile** হলো iterative delivery, customer feedback, collaboration, এবং change embrace করার values/practices-এর family। Scrum, Kanban, XP এগুলো Agile কাজ করার বিভিন্ন framework বা method।

```text
Plan a little -> Build a small slice -> Test -> Release -> Learn -> Adjust
```

Agile মানে “documentation নেই” বা “plan নেই” না। মানে হলো documentation এবং plan এমন পরিমাণে করা, যা decision ও delivery-কে support করে।

---

## Model comparison

| Model | Flexibility | Risk handling | Customer involvement | Best fit |
|---|---|---|---|---|
| Waterfall | low | upfront planning | low after approval | stable/regulatory work |
| V-Model | low | verification-focused | formal review | safety/compliance systems |
| Incremental | medium-high | deliver in slices | frequent | growing product |
| Prototype | high in discovery | usability/requirement risk | very high | unclear user needs |
| Spiral | high | explicit risk analysis | each loop | large high-risk systems |
| RAD | high | speed and feedback | continuous | bounded business apps |
| Agile | high | short feedback cycles | continuous | changing product needs |

## How to choose a model

```text
Requirements stable and audit-heavy?
    -> Waterfall / V-Model

User experience or requirement unclear?
    -> Prototype, then iterative Agile delivery

High technical/business risk?
    -> Spiral-style risk reduction

Need usable value early?
    -> Incremental / Agile
```

বাস্তবে company একটিমাত্র textbook model follow করে না। Example: core payment integration V-Model-like rigor-এ test হতে পারে, কিন্তু mobile UI Scrum sprint-এ evolve হতে পারে। Good engineering হলো context অনুযায়ী process choose করা।

---

## Common interview questions

### Waterfall and iterative model-এর main difference কী?

Waterfall phase-by-phase progression prioritize করে। Iterative development early partial solution দেয় এবং feedback দিয়ে সেটি improve করে। Difference হলো code কতবার লেখা হয় না; learning ও change কবে গ্রহণ করা হয়।

### Rapidly changing requirement হলে কোনটি recommend করবে?

Agile incremental approach recommend করব, কারণ short cycle-এ priority re-evaluate করা যায় এবং stakeholder working software দেখে feedback দিতে পারে। তবে regulated portion থাকলে additional documentation/testing controls যোগ করতে হবে।

### “Agile সব project-এর জন্য best” কি ঠিক?

না। Agile useful যেখানে uncertainty ও feedback বেশি। Fixed contractual requirement, certification evidence, or strict safety constraints থাকলে more formal lifecycle control দরকার হতে পারে.
