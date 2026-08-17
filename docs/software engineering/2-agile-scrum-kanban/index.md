---
sidebar_position: 2
title: 'Agile, Scrum, and Kanban'
---
## 8. What is Agile, and how does it differ from Waterfall?

**Agile** হলো একটি software development **philosophy বা mindset** (specific model নয়), যেখানে software কে ছোট ছোট **iteration/sprint** এর মাধ্যমে develop করা হয়, প্রতিটি sprint শেষে একটি **working software increment** delivery করা হয়। Agile এ emphasis দেওয়া হয় **flexibility, collaboration, continuous feedback**, এবং **customer satisfaction** এর উপর।

**Agile বনাম Waterfall:**

| বিষয় | Waterfall | Agile |
|---|---|---|
| **Approach** | Linear, sequential | Iterative, incremental |
| **Requirement** | শুরুতেই সম্পূর্ণভাবে fix | ধীরে ধীরে evolve করে, change কে স্বাগত জানানো হয় |
| **Delivery** | শেষে একবারে পুরো product | প্রতি sprint শেষে working increment |
| **Customer Involvement** | মূলত শুরু ও শেষে | Continuous, প্রতি sprint এ |
| **Documentation** | Heavy | Minimal, working software কে অগ্রাধিকার |
| **Testing** | শেষ দিকে, আলাদা phase | প্রতিটি sprint এর অংশ হিসেবে continuous |
| **Change Management** | কঠিন এবং costly | সহজ, প্রতি sprint এ accommodate করা যায় |

---

### What are the core values and principles behind the Agile Manifesto?

**চারটি Core Values:**

1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

(লক্ষ্য করুন — ডান পাশের বিষয়গুলোও গুরুত্বপূর্ণ, কিন্তু বাম পাশেরগুলোকে বেশি priority দেওয়া হয়)

**১২টি Principles এর মধ্যে গুরুত্বপূর্ণ কিছু:**
- Customer satisfaction কে সর্বোচ্চ অগ্রাধিকার দেওয়া, **early এবং continuous delivery** এর মাধ্যমে
- Development এর যেকোনো পর্যায়ে **requirement change কে স্বাগত জানানো**, এমনকি late stage এও
- **Frequent delivery** — কয়েক সপ্তাহ থেকে কয়েক মাস পর পর working software দেওয়া (ছোট timeframe কে preference)
- Business people এবং developer দের **daily একসাথে কাজ করা**
- Motivated individuals দিয়ে project build করা এবং তাদের প্রয়োজনীয় support ও trust দেওয়া
- **Face-to-face conversation** কে সবচেয়ে efficient communication মাধ্যম হিসেবে বিবেচনা করা
- **Working software** কেই progress এর প্রধান measurement হিসেবে ধরা
- **Sustainable development pace** বজায় রাখা
- **Technical excellence** এবং ভালো design এর প্রতি continuous মনোযোগ
- **Simplicity** — অপ্রয়োজনীয় কাজ কমিয়ে ফেলা
- **Self-organizing team** থেকে সেরা architecture, requirement, এবং design বের হয়ে আসে
- Team নিয়মিত **retrospect** করে এবং সেই অনুযায়ী নিজেদের আচরণ adjust করে

---

## 9. What is Scrum, and what are its key roles, artifacts, and ceremonies?

**Scrum** হলো Agile এর সবচেয়ে জনপ্রিয় **framework**, যা কাজকে **Sprint** নামক fixed-length (সাধারণত ২-৪ সপ্তাহ) time-box এ ভাগ করে সম্পন্ন করা হয়।

### Key Roles

**Product Owner:**
- **Product Backlog** তৈরি এবং maintain করেন — কী কী feature বা requirement দরকার তার prioritized list
- Business value অনুযায়ী backlog item গুলো **prioritize** করেন
- Stakeholder এবং development team এর মধ্যে **bridge** হিসেবে কাজ করেন
- Requirement clarify করেন এবং delivered feature **accept বা reject** করেন
- ROI (Return on Investment) maximize করার responsibility থাকে তার উপর

**Scrum Master:**
- Team কে Scrum process এবং Agile principle মেনে চলতে **guide এবং facilitate** করেন (কিন্তু নিজে team কে command করেন না)
- **Obstacles/blockers** দূর করতে সাহায্য করেন, যাতে team নির্বিঘ্নে কাজ করতে পারে
- Scrum ceremony গুলো (standup, planning, review, retrospective) organize এবং facilitate করেন
- Team কে বাইরের distraction থেকে **protect** করেন
- একজন **servant leader** হিসেবে কাজ করেন, boss হিসেবে নয়

**Development Team:**
- Self-organizing এবং cross-functional group, যারা actual product তৈরি করেন (design, code, test)
- Sprint Backlog এ থাকা item গুলো কীভাবে সম্পন্ন করবেন, সেই সিদ্ধান্ত **নিজেরাই** নেন
- সাধারণত ৩-৯ জন সদস্য থাকেন, এবং কোনো internal hierarchy/title থাকে না

### Key Artifacts

- **Product Backlog** — পুরো project এর জন্য সম্ভাব্য সব feature, requirement, bug fix এর prioritized list
- **Sprint Backlog** — একটি নির্দিষ্ট sprint এ কোন কোন item নিয়ে কাজ করা হবে তার list, task breakdown সহ
- **Increment (Product Increment)** — একটি sprint শেষে তৈরি হওয়া working, potentially shippable product অংশ
- **Burndown Chart** (কখনো কখনো ব্যবহৃত হয়) — sprint এর বাকি কাজ কতটুকু আছে তা visually দেখানোর জন্য

### Key Ceremonies (Events)

**Sprint Planning:**
এই meeting এ team ঠিক করে সেই sprint এ কোন কোন Product Backlog item নিয়ে কাজ করবে (**Sprint Backlog** তৈরি হয়), এবং প্রতিটি item কীভাবে সম্পন্ন করা হবে তার task breakdown করা হয়। সাধারণত sprint শুরুর দিন এই meeting হয়।

**Daily Standup (Daily Scrum):**
প্রতিদিন একটি **short (১৫ মিনিটের) meeting**, যেখানে প্রতিটি team member তিনটি প্রশ্নের উত্তর দেন:
- গতকাল কী করেছি?
- আজ কী করবো?
- কোনো **blocker/obstacle** আছে কিনা?

**Sprint Review:**
Sprint শেষে অনুষ্ঠিত হয়, যেখানে team তাদের তৈরি করা **increment** stakeholder দের সামনে **demo** করে এবং feedback নেয়। এটি informal এবং collaborative হয়।

**Sprint Retrospective:**
Sprint Review এর পর অনুষ্ঠিত হয়, যেখানে team নিজেদের **process** নিয়ে reflect করে — কী ভালো হয়েছে, কী খারাপ হয়েছে, এবং পরবর্তী sprint এ কী improve করা যায়। এটি team এর **continuous improvement** এর জন্য অত্যন্ত গুরুত্বপূর্ণ।

---

## 10. What is Kanban, and how does it differ from Scrum?

**Kanban** হলো একটি Agile-based **visual workflow management method**, যা মূলত Toyota এর manufacturing process থেকে অনুপ্রাণিত। এখানে কাজের প্রতিটি ধাপ একটি **Kanban Board**-এ visually represent করা হয় — সাধারণত কলাম আকারে (যেমন: **To Do → In Progress → Testing → Done**), এবং প্রতিটি task একটি **card** হিসেবে board এ move করানো হয়।

**Kanban বনাম Scrum:**

| বিষয় | Scrum | Kanban |
|---|---|---|
| **Structure** | Fixed-length **Sprint** (time-boxed) | কোনো fixed time-box নেই, **continuous flow** |
| **Roles** | নির্দিষ্ট roles (Product Owner, Scrum Master, Dev Team) | কোনো mandatory specific role নেই |
| **Ceremonies** | নির্দিষ্ট meeting (Planning, Standup, Review, Retro) | কোনো mandatory meeting নেই (যদিও অনেক team standup রাখে) |
| **Change Mid-Cycle** | Sprint চলাকালীন নতুন কাজ যোগ করা discouraged | যেকোনো সময় নতুন কাজ যোগ করা যায় |
| **Delivery** | Sprint শেষে batch delivery | Continuous delivery, task complete হলেই deliver |
| **Core Mechanism** | Sprint-based iteration | **WIP Limit** এবং continuous flow |
| **উপযুক্ত ক্ষেত্র** | Project-based কাজ, যেখানে predictable delivery cycle দরকার | Continuous, unpredictable workflow — যেমন support/maintenance team |

---

### What is a WIP (Work In Progress) limit, and why is it important in Kanban?

**WIP Limit** হলো Kanban board এর প্রতিটি column (stage) এ **একই সময়ে সর্বোচ্চ কতগুলো task** থাকতে পারবে তার একটি নির্দিষ্ট সংখ্যা। উদাহরণস্বরূপ, "In Progress" column এ যদি WIP limit ৩ সেট করা থাকে, তাহলে একসাথে সর্বোচ্চ ৩টি task-ই সেই column এ থাকতে পারবে — নতুন task যোগ করতে হলে আগে থেকে থাকা কোনো task সম্পূর্ণ করে সরাতে হবে।

**WIP Limit কেন গুরুত্বপূর্ণ:**

- **Multitasking কমায়** — team member রা একসাথে অনেক কাজে হাত না দিয়ে, সীমিত সংখ্যক task এ **focus** করতে পারেন, যা efficiency বাড়ায়
- **Bottleneck সহজে চিহ্নিত করা যায়** — কোনো column এ যদি task জমে যায় এবং WIP limit ছাড়িয়ে যাওয়ার উপক্রম হয়, তাহলে সেটা স্পষ্টভাবে বোঝা যায় যে সেই stage এ কোনো সমস্যা (bottleneck) আছে
- **Faster Delivery/Cycle Time কমায়** — কাজ শেষ না করে নতুন কাজ শুরু করার প্রবণতা কমে যায়, ফলে task গুলো দ্রুত "Done" এ পৌঁছায়
- **Quality বৃদ্ধি পায়** — কম কাজে বেশি মনোযোগ দেওয়ার কারণে ভুল হওয়ার সম্ভাবনা কমে
- **Team এর Overload প্রতিরোধ করে** — অতিরিক্ত কাজের চাপ এড়ানো যায়, যা burnout প্রতিরোধে সাহায্য করে
- Continuous flow বজায় রাখতে সাহায্য করে, যা Kanban এর মূল লক্ষ্য — **Lean principle** অনুযায়ী "waste" (এক্ষেত্রে অতিরিক্ত WIP) কমানো

---

## 11. What is a user story, and what makes a good one?

**User Story** হলো একটি **short, simple description** যা একটি feature বা functionality কে **end-user এর perspective** থেকে বর্ণনা করে। এটি সাধারণত একটি নির্দিষ্ট template অনুসরণ করে লেখা হয়:

> **"As a** [user role/persona], **I want** [some goal/functionality], **so that** [some reason/benefit/value]"

**উদাহরণ:** "As a registered user, I want to reset my password via email, so that I can regain access to my account if I forget it."

User Story এর মূল উদ্দেশ্য হলো technical specification নয়, বরং **feature এর পেছনের business value এবং user need** কে সামনে আনা, এবং team ও client এর মধ্যে **conversation** শুরু করা (documentation এর বদলে discussion কে priority দেওয়া, যা Agile philosophy এর সাথে সামঞ্জস্যপূর্ণ)।

---

### What does the INVEST acronym (Independent, Negotiable, Valuable, Estimable, Small, Testable) stand for?

একটি ভালো User Story লেখার জন্য **INVEST** নামক একটি guideline ব্যবহার করা হয়, যা Bill Wake প্রস্তাব করেছিলেন:

- **I — Independent:** Story টি যতটা সম্ভব **স্বাধীন** হওয়া উচিত, অন্য story এর উপর নির্ভরশীল না হয়ে, যাতে যেকোনো order এ implement এবং prioritize করা যায়
- **N — Negotiable:** Story টি fixed contract নয়, বরং এটি একটি **placeholder for conversation** — details নিয়ে client এবং team আলোচনা করে চূড়ান্ত করবে
- **V — Valuable:** প্রতিটি story থেকে **end-user বা customer এর জন্য স্পষ্ট business value** থাকতে হবে, শুধু technical task নয়
- **E — Estimable:** Team যেন story টির **size বা effort estimate** করতে পারে — অর্থাৎ এটি যথেষ্ট clear হতে হবে
- **S — Small:** Story টি যথেষ্ট **ছোট** হতে হবে, যাতে একটি single sprint এর মধ্যে সম্পন্ন করা যায় (বড় হলে ভেঙে ছোট story তে ভাগ করতে হয়)
- **T — Testable:** Story টির জন্য স্পষ্ট **acceptance criteria** থাকতে হবে, যা দিয়ে verify করা যায় কাজটি সঠিকভাবে সম্পন্ন হয়েছে কিনা

---

## 12. What is the difference between epics, stories, and tasks?

| বিষয় | **Epic** | **User Story** | **Task** |
|---|---|---|---|
| **Size** | সবচেয়ে বড়, high-level | মাঝারি | সবচেয়ে ছোট |
| **Definition** | একটি বড় feature বা goal, যা একাধিক story নিয়ে গঠিত | একটি নির্দিষ্ট, deliverable feature/requirement, user perspective থেকে লেখা | Story সম্পন্ন করতে যে technical কাজ করতে হয় তার breakdown |
| **Timeframe** | কয়েক sprint বা এমনকি পুরো release জুড়ে বিস্তৃত হতে পারে | সাধারণত একটি sprint এর মধ্যে সম্পন্ন করা যায় | কয়েক ঘণ্টা থেকে ১-২ দিনের কাজ |
| **উদাহরণ** | "User Account Management" | "As a user, I want to reset my password" | "Design password-reset email template", "Write API endpoint for token generation", "Write unit tests" |
| **কে লেখে** | Product Owner/Business stakeholder | Product Owner (team এর সাহায্যে) | Development Team |

**সম্পর্ক:** একটি **Epic** ভেঙে একাধিক **User Story** তৈরি হয়, এবং প্রতিটি **User Story** আবার ভেঙে একাধিক **Task** এ পরিণত হয় — যা developer রা বাস্তবে সম্পন্ন করেন। এটি একটি **hierarchical breakdown**: Epic → Stories → Tasks।

---

### How do these relate to a product backlog and a sprint backlog?

- **Product Backlog** এ সাধারণত **Epic** এবং **User Story** — উভয়ই থাকে, prioritized আকারে। বড় Epic গুলো সাধারণত backlog এর নিচের দিকে থাকে (কারণ সেগুলো এখনো breakdown করা হয়নি), এবং যেসব story আসন্ন sprint এ কাজ করা হবে, সেগুলো ছোট ছোট, well-defined আকারে উপরের দিকে থাকে
- **Sprint Planning** এর সময়, Product Backlog থেকে নির্দিষ্ট কিছু **User Story** বেছে নিয়ে **Sprint Backlog** এ যোগ করা হয় — এগুলোই সেই sprint এ সম্পন্ন করা হবে
- Sprint Backlog এ থাকা প্রতিটি User Story কে development team আরও ছোট **Task** এ ভেঙে ফেলেন (যেমন: design task, coding task, testing task), যাতে দৈনন্দিন কাজ manage করা সহজ হয়

**সংক্ষেপে:** Epic → breakdown হয়ে Story (Product Backlog এ থাকে) → Sprint Planning এর মাধ্যমে নির্বাচিত হয়ে Sprint Backlog এ যায় → আরও breakdown হয়ে Task (দৈনন্দিন কাজের একক) এ পরিণত হয়।

---

## 13. What is a "Definition of Done," and why is it important for a team?

**Definition of Done (DoD)** হলো team এর একটি **shared, agreed-upon checklist**, যা নির্ধারণ করে একটি কাজ (User Story, Task, বা পুরো Sprint Increment) কখন সত্যিকার অর্থে **"সম্পন্ন" বা "done"** বলে গণ্য হবে। এটি পুরো team এর জন্য একটি **consistent, objective standard**, যা প্রতিটি item এর ক্ষেত্রেই প্রযোজ্য (individual story-specific নয়)।

**একটি typical Definition of Done এ থাকতে পারে:**
- Code সম্পূর্ণ লেখা হয়েছে এবং **code review** সম্পন্ন হয়েছে
- **Unit test** লেখা হয়েছে এবং pass করেছে
- **Integration testing** সম্পন্ন হয়েছে
- Code **documentation** আপডেট করা হয়েছে
- **No critical bugs** অবশিষ্ট নেই
- Feature টি **staging/QA environment** এ deploy এবং verify করা হয়েছে
- **Product Owner** approval দিয়েছেন

**কেন এটি গুরুত্বপূর্ণ:**

- **Consistency এবং Quality বজায় রাখে** — প্রতিটি feature একই standard মেনে সম্পন্ন হয়, কারো ব্যক্তিগত ধারণার উপর নির্ভর করে না
- **"Done" মানে কী তা নিয়ে ভুল বোঝাবুঝি দূর করে** — team member, Product Owner, এবং stakeholder — সবার একই বোঝাপড়া থাকে
- **Technical debt এবং hidden work এড়ানো যায়** — testing বা documentation বাদ দিয়ে অসম্পূর্ণ কাজ "done" হিসেবে দেখানো বন্ধ হয়
- **Sprint এর প্রকৃত progress সঠিকভাবে measure করা যায়** — অসম্পূর্ণ কাজকে সম্পূর্ণ বলে ভুল করে গণনা করা হয় না
- Team এর মধ্যে **accountability এবং transparency** বাড়ায়

---

### How does a Definition of Done differ from acceptance criteria for a specific story?

| বিষয় | **Definition of Done** | **Acceptance Criteria** |
|---|---|---|
| **Scope** | **সব** User Story/Task এর জন্য প্রযোজ্য — general, team-wide standard | শুধুমাত্র **একটি নির্দিষ্ট** User Story এর জন্য specific |
| **তৈরি করে কে** | পুরো Scrum Team একসাথে সিদ্ধান্ত নেয় | সাধারণত Product Owner (developer দের সাথে আলোচনা করে) নির্দিষ্ট story এর জন্য লেখেন |
| **Focus** | Process এবং quality standard (যেমন: testing হয়েছে কিনা, code review হয়েছে কিনা) | সেই নির্দিষ্ট feature এর **functional behavior** কী হবে |
| **উদাহরণ** | "সব code review এবং unit test pass করতে হবে" | "যদি user ভুল password দেয়, তাহলে system একটি error message দেখাবে" |
| **পরিবর্তনশীলতা** | তুলনামূলক স্থায়ী, পুরো project জুড়ে একই থাকে | প্রতিটি story এর জন্য আলাদা, নতুন করে লেখা হয় |

**সহজভাবে বলতে গেলে:** Definition of Done উত্তর দেয় "**আমরা কি ভালোভাবে কাজটি করেছি?**" (quality/process প্রশ্ন), আর Acceptance Criteria উত্তর দেয় "**আমরা কি সঠিক জিনিসটি তৈরি করেছি?**" (functionality প্রশ্ন)।

---

## 14. What is the difference between a sprint and a release?

| বিষয় | **Sprint** | **Release** |
|---|---|---|
| **Definition** | একটি fixed-length time-box (সাধারণত ২-৪ সপ্তাহ), যেখানে team নির্দিষ্ট কিছু Backlog item নিয়ে কাজ করে | একটি version বা feature set, যা **end-user দের কাছে actual deploy/launch** করা হয় |
| **Duration** | ছোট, fixed (যেমন ২ সপ্তাহ) | বড়, variable — একাধিক sprint নিয়ে গঠিত হতে পারে |
| **Output** | একটি **potentially shippable increment** (যা shipped নাও হতে পারে) | Actual, end-user দের কাছে **deployed/live** product version |
| **Frequency** | নিয়মিত, নির্দিষ্ট interval এ | Business need অনুযায়ী — সাপ্তাহিক, মাসিক, বা quarterly হতে পারে |
| **উদ্দেশ্য** | Development এবং internal progress measurement | Market/customer এর কাছে value delivery |

**গুরুত্বপূর্ণ পার্থক্য:** প্রতিটি sprint এর শেষে একটি **increment** তৈরি হয়, কিন্তু এর মানে এই না যে সেটা সাথে সাথেই customer দের কাছে release করা হবে। কয়েকটি sprint এর increment একসাথে জমা হয়ে, একটি নির্দিষ্ট সময়ে একটি **Release** হিসেবে launch করা হতে পারে।

---

### How do teams decide what gets included in a given release?

- **Business Priority এবং Market Timing** — কোন feature গুলো market এ আগে দরকার, কোনটা competitive advantage দেবে, তার উপর ভিত্তি করে Product Owner সিদ্ধান্ত নেন
- **Release Planning/Roadmap** — Product Owner এবং stakeholder রা মিলে একটি **release roadmap** তৈরি করেন, যেখানে কোন feature কোন release এ যাবে তা মোটামুটি ঠিক করা থাকে
- **Feature Completeness এবং Dependencies** — একটি feature সম্পূর্ণভাবে কাজ করার জন্য যদি একাধিক related story লাগে, তাহলে সবগুলো সম্পন্ন না হওয়া পর্যন্ত সেই feature release এ অন্তর্ভুক্ত করা হয় না
- **Quality এবং Testing Status** — যেসব feature Definition of Done পূরণ করেছে এবং QA/UAT pass করেছে, শুধুমাত্র সেগুলোই release এ যায়
- **Minimum Viable Product (MVP) Concept** — অনেক সময় প্রথম release এ শুধু core, essential feature গুলো রাখা হয়, বাকিগুলো পরবর্তী release এ যোগ করা হয়
- **Stakeholder Feedback** — sprint review থেকে পাওয়া feedback অনুযায়ী কোন feature ready, কোনটা আরও refinement দরকার, তা বিবেচনা করা হয়
- **Technical Constraints** — infrastructure readiness, third-party integration, বা deployment complexity ও বিবেচনা করা হয় release timing ঠিক করার সময়

Agile এ সাধারণত এই সিদ্ধান্ত নেওয়ার জন্য একটি **Release Planning meeting** করা হয়, যেখানে Product Owner, Scrum Master, এবং কখনো কখনো পুরো team মিলে ঠিক করেন কোন sprint গুলোর কাজ মিলিয়ে একটি coherent, valuable release তৈরি করা যাবে।