---
sidebar_position: 2
title: 'Agile, Scrum, and Kanban'
---

## 2. Agile, Scrum, and Kanban

একটি product team প্রতিদিন নতুন information পায়: user feature চায়, competitor কিছু launch করে, production bug আসে, estimation ভুল হয়। **Agile** এই uncertainty-র মধ্যে small value deliver করে শেখার পথ। এটি কোনো single ceremony-এর নাম না।

```text
Idea -> Small valuable slice -> Build + test -> Feedback -> Re-prioritize
                         ^                              |
                         |------------------------------|
```

### Agile-এর core idea

Agile Manifesto-এর spirit সংক্ষেপে:

| বেশি গুরুত্ব | কম গুরুত্ব |
|---|---|
| people and collaboration | rigid process/tool |
| working software | excessive document |
| customer collaboration | contract argument |
| responding to change | blindly following a plan |

“কম গুরুত্ব” মানে “কোনো গুরুত্ব নেই” না। যেমন working software দরকার, আবার production API-এর documentation-ও দরকার। Balance-টাই গুরুত্বপূর্ণ।

---

## Scrum: time-boxed product delivery framework

**Scrum** Agile-এর একটি framework যেখানে team fixed-length **Sprint**-এ কাজ করে। একটি sprint সাধারণত 1-4 সপ্তাহ। Sprint শেষে potentially releasable product increment তৈরি হওয়া লক্ষ্য।

```text
Product Backlog
      |
Sprint Planning
      |
Sprint Backlog -> Daily work -> Tested Increment
      |                              |
      |                              v
      |                        Sprint Review
      |                              |
      +-------- Retrospective <-----+
                     |
                 next sprint
```

### Scrum roles

| Role | Core responsibility | Should not become |
|---|---|---|
| Product Owner | value/order of backlog decide করা | every implementation decision-এর boss |
| Scrum Master | Scrum effective হতে help করা, impediment remove করা | team manager or meeting police |
| Developers | plan, build, test, deliver increment | only coders; QA/design/devops may all be included |

### Food-delivery example

Product Owner বলল, “Eid-এর আগে schedule delivery দরকার।” Developers বলেন, “First version-এ one-time scheduling করব; recurring order পরে।” Scrum Master দেখে payment-team dependency আটকে আছে এবং coordination করে। Sprint শেষে user schedule করে order দিতে পারে।

---

## Scrum artifacts

### Product Backlog

সব desired work-এর ordered list: feature, bug, technical improvement, research, compliance task। এটি living document; constantly refine হয়।

```text
1. Schedule delivery (high value)
2. Payment failure retry
3. Restaurant search filters
4. Refactor notification service
5. Dark mode
```

### Sprint Backlog

Current sprint-এ Developers যে items এবং delivery plan নেয়। এটি team-এর plan, Product Owner-এর task assignment list না।

### Increment

Sprint শেষে done work-এর usable addition। “Almost done” increment না। Feature deployable হতে পারে, even যদি business পরে release button চাপতে চায়।

### Definition of Done (DoD)

একটি shared quality bar। Example:

```text
Definition of Done for an API change:
[x] Acceptance criteria met
[x] Code reviewed
[x] Unit and integration tests pass
[x] Security check completed
[x] API documentation updated
[x] Deployed to staging
```

DoD পুরো product-এর consistent standard। এটি specific story-এর requirement না।

---

## Scrum ceremonies

### Sprint Planning

Team decide করে:

1. **Why:** sprint goal কী?
2. **What:** কোন backlog item নেয়া হবে?
3. **How:** কাজটি করার initial plan কী?

Example sprint goal: “Customer can choose a delivery time slot before paying.”

Sprint plan শুধু item-count না; capacity, risk, support work, dependency সব consider করতে হয়।

### Daily Scrum

Developers-এর short daily coordination। Goal হলো sprint goal-এর দিকে plan adjust করা, manager-কে status report দেয়া না।

Useful discussion:

```text
"Time-slot API এখনও restaurant service-এর response পায়নি.
আজ mock response দিয়ে UI complete করি, এবং dependency owner-কে ping করি."
```

### Sprint Review

Stakeholder-এর কাছে actual working increment দেখানো এবং future backlog adapt করা। Slide দেখানো যথেষ্ট না; real behavior দেখানো বেশি useful।

### Retrospective

Team নিজের process improve করে। Blame session না।

```text
Observation: QA last two days-এ tests পেয়েছে.
Cause: Stories too late moved to review.
Action: Each story-এর test case refinement-এ agree করব;
        mid-sprint integration checkpoint রাখব.
```

---

## User story and acceptance criteria

**User story** user value-এর short reminder; detailed contract না। Common format:

```text
As a <user>,
I want <goal>,
so that <benefit>.
```

Example:

```text
As a customer,
I want to save multiple delivery addresses,
so that I can checkout faster.
```

### Good story: INVEST

| Letter | Meaning | Address example |
|---|---|---|
| I | Independent | address save feature payment change ছাড়া deliverable |
| N | Negotiable | UI details conversation-এ refine হবে |
| V | Valuable | customer checkout faster করে |
| E | Estimable | team enough detail জানে |
| S | Small | one sprint-এর মধ্যে done করা যায় |
| T | Testable | clear acceptance criteria আছে |

Acceptance criteria story-specific success condition:

```text
Given a logged-in customer
When they add a valid address with a label
Then it appears in their saved address list

And a customer cannot save more than 5 addresses.
```

### Weak vs strong story

| Weak | Better |
|---|---|
| “Build address module” | “Customer can save, edit, and choose an address at checkout” |
| “Improve performance” | “Restaurant search responds within 2 seconds for 95% of requests” |

---

## Epic, story, task, and bug

```text
Epic: Faster checkout
  |
  +-- Story: Save delivery addresses
  |      +-- Task: Add address API
  |      +-- Task: Add validation tests
  |      +-- Task: Build mobile screen
  |
  +-- Story: Reuse last payment method
         +-- Task: Encrypt payment token reference

Bug: Saved address does not appear after app restart
```

| Item | Scope | Example |
|---|---|---|
| Epic | big outcome; multiple sprints | faster checkout |
| Story | user-visible valuable slice | save address |
| Task | implementation work | write migration |
| Bug | incorrect existing behavior | address list disappears |

Task alone value describe করে না, কিন্তু story deliver করতে প্রয়োজন। Backlog-এ technical debt ও investigation item-ও থাকতে পারে।

---

## Kanban: optimize flow

**Kanban** continuous flow method। Fixed sprint না থাকলেও চলে। কাজ board-এ visualize করা হয় এবং work-in-progress (WIP) limit দিয়ে bottleneck reveal করা হয়।

```text
Backlog -> Ready -> In Development -> Code Review -> Testing -> Done
                  WIP: 3             WIP: 2        WIP: 2
```

ধরা যাক Testing column সবসময় full, কিন্তু Development column empty। আরও feature শুরু করলে লাভ নেই; testing bottleneck solve করতে হবে। হয়তো automation দরকার, developer test-এ help করবে, অথবা work item ছোট করা দরকার।

### WIP limit কেন powerful?

```text
Without limit:
Dev A starts 5 tasks -> context switching -> nothing finishes

With limit 2:
Dev A finishes/reviews current task -> value reaches user earlier
```

WIP limit utilisation maximum করার জন্য নয়; smooth completion ও fast feedback-এর জন্য।

---

## Scrum vs Kanban

| Topic | Scrum | Kanban |
|---|---|---|
| Cadence | fixed sprint | continuous flow |
| Commitment | sprint goal and selected work | pull work when capacity free |
| Change during cycle | protect sprint goal | priority may change any time |
| Core metric | sprint goal/increment | cycle time, throughput, WIP |
| Useful for | product feature teams | support, operations, maintenance |

একই team Scrum-এর sprint rhythm রেখে Kanban board ও WIP limit ব্যবহার করতে পারে। এটাকে অনেক সময় Scrumban বলা হয়। Framework-এর নামের চেয়ে delivery problem solve করা বেশি important।

---

## Estimation and planning reality

Story point effort/complexity/risk-এর relative estimate হতে পারে; এটি exact hour না।

```text
Story A: add simple button       = 1 point
Story B: save address CRUD       = 3 points
Story C: payment retry + gateway = 8 points
```

Team-এর past throughput দেখে forecast করা যায়, কিন্তু uncertainty eliminate করা যায় না। “8 points মানে 8 days” বলা ভুল।

### Sprint vs release

- **Sprint:** team-এর short execution cycle
- **Release:** user-এর কাছে feature available করার business/deployment event

এক sprint-এ multiple release হতে পারে; আবার multiple sprint-এর done features এক release-এ যেতে পারে। Feature flag ব্যবহার করলে code production-এ থাকলেও user-এর জন্য feature hidden রাখা যায়।

---

## Common failure modes

| Anti-pattern | কেন problem | Better move |
|---|---|---|
| Daily standup as manager report | team coordination কমে যায় | sprint goal-এর plan নিয়ে কথা বলো |
| Every story half-done | no usable increment | smaller vertical slice নাও |
| Retro আছে, action নেই | same issue repeat হয় | one measurable improvement choose করো |
| Velocity দিয়ে team compare | metric gaming হয় | team-এর own planning signal হিসেবে use করো |
| “Agile তাই no docs” | knowledge lost, risk বাড়ে | right-sized living documentation রাখো |

## Interview-ready answers

### Definition of Done vs acceptance criteria?

Acceptance criteria নির্দিষ্ট story কী করবে বলে। Definition of Done সব item-এর shared quality bar বলে। Address story-এর criterion হতে পারে “maximum 5 address”; DoD হতে পারে “tests pass and code reviewed.”

### Scrum Master কি project manager?

সব context-এ না। Scrum Master team-এর effectiveness ও impediment removal facilitate করে। Traditional project manager-এর budget, people assignment, reporting responsibility আলাদা হতে পারে।

### Kanban-এ WIP limit কেন?

এটি new work শুরু করার বদলে existing work শেষ করতে encourage করে, bottleneck visible করে, cycle time কমাতে সাহায্য করে, এবং context switching কমায়।
