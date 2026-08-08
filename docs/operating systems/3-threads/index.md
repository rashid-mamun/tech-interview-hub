---
sidebar_position: 3
title: 'Threads'
---



## 🧶 10. What is a thread, and how does it differ from a process?

**Thread** হলো একটি process-এর ভেতরে **execution-এর সবচেয়ে ছোট unit**।
একটি process-এ **একটি বা একাধিক thread** থাকতে পারে। প্রতিটি thread-এর **নিজস্ব execution flow** থাকে, তবে তারা একই process-এর **code, data, heap, open files** ইত্যাদি resource share করে।

Thread-কে অনেক সময় **lightweight process** বলা হয়, কারণ এটি process-এর মতো execution করে, কিন্তু সাধারণত **নিজস্ব আলাদা address space তৈরি করে না**। বরং একই process-এর resources share করে।
এই কারণে thread তৈরি ও একই process-এর threadগুলোর মধ্যে context switch করা process-এর তুলনায় সাধারণত **কম খরচসাপেক্ষ**।

---

**Single-threaded vs Multi-threaded Process**

```text
Single-threaded Process:        Multi-threaded Process:
┌───────────────────┐          ┌───────────────────────────┐
│     Process       │          │         Process           │
│  ┌─────────────┐  │          │  ┌───────┐ ┌───────┐      │
│  │   Thread    │  │          │  │Thread │ │Thread │ ...  │
│  │  (single)   │  │          │  │  T1   │ │  T2   │      │
│  └─────────────┘  │          │  └───────┘ └───────┘      │
│                   │          │                           │
│  Code, Data,      │          │  Code, Data, Files, Heap │
│  Files, Heap      │          │  (সব thread share করে)   │
└───────────────────┘          └───────────────────────────┘
```

---

**Thread এবং Process-এর পার্থক্য**

| বিষয়              | Process                                                             | Thread                                                                     |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **সংজ্ঞা**         | একটি চলমান program-এর instance                                      | Process-এর ভেতরে execution unit                                            |
| **Memory**         | নিজস্ব virtual address space থাকে; explicit shared mapping থাকতে পারে | একই process-এর virtual address space share করে                           |
| **তৈরির খরচ**      | বেশি                                                                | কম                                                                         |
| **Communication**  | IPC লাগে (pipe, socket, message queue ইত্যাদি)                      | Shared memory-এর মাধ্যমে সহজে data share করা যায়                          |
| **Isolation**      | এক process অন্য process থেকে আলাদা                                  | একই process-এর thread গুলো একে অপরকে প্রভাবিত করতে পারে                    |
| **Context switch** | তুলনামূলক ধীর ও ব্যয়বহুল                                           | তুলনামূলক দ্রুত                                                            |
| **Crash effect**   | একটি process crash করলে সাধারণত অন্য process সরাসরি প্রভাবিত হয় না | একটি thread-এ গুরুতর error হলে পুরো process প্রভাবিত বা terminate হতে পারে |

---

### What resources are shared between threads of the same process, and what is private to each thread?

Thread বোঝার জন্য এটি সবচেয়ে গুরুত্বপূর্ণ অংশ।


**Shared — একই process-এর সব thread share করে**

একই process-এর ভেতরে থাকা সব thread নিচের resource গুলো share করে:

* **Code / Text segment**
* **Data segment** (global/static variables)
* **Heap** (dynamic memory)
* **Open files / file descriptors**
* **Process address space**
* **Signal disposition/handlers ও process-level attributes** সাধারণত process-wide হিসেবে shared থাকে; তবে signal mask ও কিছু pending-signal state per-thread হতে পারে

```text
┌─────────────────────────────────────────┐
│            Process Memory               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         Code Segment              │  │  ← একই code সবাই ব্যবহার করে
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │         Data Segment              │  │  ← Global / static data shared
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │         Heap                      │  │  ← Dynamic memory shared
│  │   (malloc / new এর memory)        │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Open File Descriptors         │  │  ← একই files access করতে পারে
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

**Private — প্রতিটি thread-এর নিজস্ব**

প্রতিটি thread-এর কিছু নিজস্ব execution-related state থাকে:

* **Thread ID**
* **Program Counter (PC)**
* **CPU Registers**
* **Stack**
* **Local variables / function call information**
* **Thread-local storage (TLS)** এবং কিছু per-thread signal/scheduling state

> প্রতিটি thread-এর stack আলাদা হলেও সেটি একই process address space-এর অংশ। তাই stack/local data automatically memory-isolated নয়—valid pointer পেলে অন্য thread সেটি access করতে পারে।

```text
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Thread 1   │  │   Thread 2   │  │   Thread 3   │
│              │  │              │  │              │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │  Stack   │ │  │ │  Stack   │ │  │ │  Stack   │ │
│ │ (local   │ │  │ │ (local   │ │  │ │ (local   │ │
│ │ vars,    │ │  │ │ vars,    │ │  │ │ vars,    │ │
│ │ calls)   │ │  │ │ calls)   │ │  │ │ calls)   │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │Program   │ │  │ │Program   │ │  │ │Program   │ │
│ │Counter   │ │  │ │Counter   │ │  │ │Counter   │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │ CPU      │ │  │ │ CPU      │ │  │ │ CPU      │ │
│ │Registers │ │  │ │Registers │ │  │ │Registers │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │Thread ID │ │  │ │Thread ID │ │  │ │Thread ID │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

### Why is creating a thread generally cheaper than creating a process?

Thread process-এর তুলনায় সস্তা হওয়ার মূল কারণ হলো — **thread-এর জন্য পুরো নতুন execution environment তৈরি করতে হয় না**।

**আলাদা address space তৈরি করতে হয় না**

নতুন **process** তৈরি করলে OS-কে সাধারণত একটি **নতুন address space**, **process metadata**, **page table**, **memory management structure** ইত্যাদি সামলাতে হয়।

কিন্তু নতুন **thread** তৈরি করলে সাধারণত:

* একই process-এর **code**
* **data**
* **heap**
* **open files**

এগুলো নতুন করে তৈরি করতে হয় না।
শুধু নতুন thread-এর জন্য মূলত **stack** এবং **thread control information** তৈরি করতে হয়।

```text
নতুন Process তৈরিতে:              নতুন Thread তৈরিতে:
┌──────────────────────┐          ┌──────────────────────┐
│ নতুন address space   │          │ address space shared │
│ নতুন page table      │          │ code/data shared     │
│ নতুন process info    │          │ heap shared          │
│ নতুন stack           │          │ নতুন stack           │
│ নতুন PCB             │          │ নতুন TCB             │
└──────────────────────┘          └──────────────────────┘
```

---

**Memory overhead কম**

Process-এর জন্য পুরো নতুন memory space management দরকার হতে পারে।
Thread-এর ক্ষেত্রে আলাদা পুরো memory space লাগে না, কারণ thread একই process-এর resources share করে।

তাই:

* memory allocation overhead কম
* memory management overhead কম
* resource duplication কম

---
**Context switch তুলনামূলক দ্রুত**

**Process context switch**-এ OS-কে সাধারণত:

* CPU registers save/restore করতে হয়
* process state বদলাতে হয়
* memory management context change করতে হয়
* address space switch করতে হয়

কিন্তু **একই process-এর দুই thread-এর মধ্যে context switch** হলে address space একই থাকে।
তাই ভিন্ন process-এর thread-এ switch করার তুলনায় **memory-management overhead কম হতে পারে**, ফলে একই process-এর thread switch সাধারণত দ্রুত হয়। এটি absolute guarantee নয়; actual cost OS, architecture ও cache state-এর ওপর নির্ভর করে।

```text
Process Context Switch:           Thread Context Switch:
┌────────────────────────┐       ┌────────────────────────┐
│ Registers save         │       │ Registers save         │
│ Address space switch   │       │ Same address space     │
│ Memory context change  │       │ কম overhead            │
│ Registers restore      │       │ Registers restore      │
└────────────────────────┘       └────────────────────────┘
```

---

**Communication সহজ ও দ্রুত**

দুটি **process** যদি একে অপরের সাথে data exchange করতে চায়, তাহলে সাধারণত **IPC (Inter-Process Communication)** ব্যবহার করতে হয়, যেমন:

* pipe
* socket
* shared memory
* message queue

এগুলো তুলনামূলক complex হতে পারে।

কিন্তু একই process-এর **thread** গুলো যেহেতু একই memory share করে, তাই data আদান-প্রদান অনেক সহজ হয়।
যেমন একটি global variable, shared buffer, shared object ইত্যাদি ব্যবহার করে thread গুলো communicate করতে পারে।

```text
Process-এ Communication (IPC):    Thread-এ Communication:

Process A      Process B          Thread 1    Thread 2
   │               │                  │           │
   │──Pipe/──────►│                  │◄─ Shared ─►│
   │  Socket/     │                  │   Memory   │
   │  Queue       │                  │            │
   (more complex)                    (faster, simpler)
```

> তবে shared memory ব্যবহারের সময় **synchronization** না করলে **race condition** হতে পারে।

---

ধরো একটি **web server process** আছে। সেখানে একাধিক thread থাকতে পারে:

* **Thread 1** → নতুন client request accept করছে
* **Thread 2** → database query handle করছে
* **Thread 3** → log লিখছে
* **Thread 4** → background task করছে

এভাবে একই process-এর ভেতরে একাধিক thread একসাথে কাজ করলে application আরও responsive এবং efficient হতে পারে।

আরও একটি উদাহরণ:
একটি application-এর মধ্যে:

* একটি thread UI handle করছে
* আরেকটি thread network request handle করছে
* আরেকটি thread file download করছে

ফলে UI freeze না হয়ে application responsive থাকতে পারে।

---

### Thread-এর সুবিধা

**Responsiveness**: একটি thread block হলেও অন্য thread কাজ চালিয়ে যেতে পারে — **যদি OS/kernel সেই thread-গুলোকে আলাদা scheduling entity হিসেবে handle করতে পারে**।
যেমন UI thread আলাদা থাকলে background download চলার সময়ও application responsive থাকতে পারে।

**Resource sharing**: একই process-এর thread গুলো shared memory ব্যবহার করে সহজে data share করতে পারে।

**Economy**: Thread তৈরি, terminate করা এবং context switch করা process-এর তুলনায় কম খরচসাপেক্ষ।

**Scalability / Parallelism**: Multi-core CPU থাকলে একাধিক thread সত্যিকারের parallel execution পেতে পারে — **যদি underlying threading model ও OS support তা allow করে**।

---

### Thread-এর সমস্যা

**Race Condition**: দুটি বা তার বেশি thread একই shared data একসাথে modify করলে unexpected result হতে পারে।

**Deadlock**: একাধিক thread যদি একে অপরের resource release-এর জন্য অপেক্ষা করতে থাকে, তাহলে তারা আটকে যেতে পারে।

**Synchronization Complexity**: Shared data safe রাখার জন্য mutex, semaphore, lock ইত্যাদি ব্যবহার করতে হয়। এগুলো ভুলভাবে ব্যবহার করলে bug হতে পারে।

**Debugging কঠিন**: Concurrent program-এ bug reproduce করা কঠিন হতে পারে, কারণ timing-এর উপর behavior বদলে যেতে পারে।

**একটি thread-এর গুরুতর error পুরো process-কে প্রভাবিত করতে পারে**: যেহেতু thread গুলো একই process-এর memory space share করে, তাই memory corruption বা segmentation fault-এর মতো error পুরো process-কে ক্ষতিগ্রস্ত করতে পারে।

---

## 🏗️ 11. What is the difference between user-level threads and kernel-level threads?

**মূল প্রশ্ন: OS কি thread-এর অস্তিত্ব জানে?**

User-level threads এবং kernel-level threads-এর পার্থক্যের মূল ভিত্তি হলো:

> **OS kernel কি প্রতিটি thread-এর অস্তিত্ব জানে, নাকি জানে না?**

```text
User-level Thread (ULT):          Kernel-level Thread (KLT):

  User Space                         User Space
┌─────────────────┐               ┌─────────────────┐
│  Thread Library │               │   Application   │
│  T1  T2  T3     │               │   T1  T2  T3    │
│ (OS জানে না)   │               │                 │
└────────┬────────┘               └──┬───┬───┬──────┘
         │ (একটি scheduling entity)   │   │   │
─────────┼───────────────────────  ───┼───┼───┼────────
 Kernel  │                     Kernel │   │   │
┌────────┴────────┐               ┌──┴───┴───┴──────┐
│   Process P     │               │   KT1 KT2 KT3   │
│ Kernel-এর কাছে │               │ OS সবাইকে জানে  │
│ একটাই entity   │               │                 │
└─────────────────┘               └─────────────────┘
```

---

**User-Level Threads (ULT)**

**User-level thread** হলো এমন thread যাকে **user space-এর thread library** manage করে।
Pure many-to-one ULT model-এ thread তৈরি, user-thread scheduling, resume এবং user-thread context switch মূলত **user space-এ** হয়। Many-to-many runtime-এ underlying kernel thread management বা blocking operation-এর জন্য kernel interaction লাগতে পারে।

Kernel সাধারণত জানে না যে ওই process-এর মধ্যে একাধিক user thread আছে।
Many-to-one model-এ kernel-এর কাছে পুরো process-টি **একটি single schedulable entity** হিসেবে দেখা যায়। তবে বাস্তবে ULT/KLT behavior mapping model-এর ওপর নির্ভর করে, যা পরের section-এ এসেছে।



**ULT কীভাবে কাজ করে**

```text
User Space:
┌────────────────────────────────────────────┐
│           Thread Library                   │
│                                            │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │Thread 1│  │Thread 2│  │Thread 3│       │
│  │(Ready) │  │(Run)   │  │(Wait)  │       │
│  └────────┘  └────────┘  └────────┘       │
│                                            │
│  Library নিজেই scheduling করে             │
│  Library নিজেই context switch করে         │
└──────────────────┬─────────────────────────┘
                   │
═══════════════════╪════════════════════════════
Kernel Space:      │
              ┌────┴───────┐
              │  Process P  │
              │ Kernel-এর   │
              │ কাছে একটাই │
              │ entity      │
              └────────────┘
```

ULT-এ সাধারণত:

* thread library ready queue maintain করে
* কোন thread run করবে তা library ঠিক করে
* context switch library code-এর মাধ্যমেই হয়
* kernel শুধু পুরো process-টিকে schedule করে

---


**Kernel-Level Threads (KLT)**

**Kernel-level thread** হলো এমন thread যাকে **OS kernel সরাসরি manage করে**।
প্রতিটি thread OS-এর কাছে আলাদা scheduling entity হিসেবে পরিচিত থাকে। Kernel সরাসরি প্রতিটি thread-কে CPU দিতে পারে।

---

```text
User Space:
┌────────────────────────────────────────────┐
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │Thread 1│  │Thread 2│  │Thread 3│       │
│  └───┬────┘  └───┬────┘  └───┬────┘       │
└──────┼───────────┼───────────┼────────────┘
       │ system    │ system    │ system
       │ call      │ call      │ call
═══════╪═══════════╪═══════════╪════════════
Kernel:│           │           │
  ┌────┴──┐   ┌────┴──┐   ┌───┴───┐
  │  KT1  │   │  KT2  │   │  KT3  │
  └───────┘   └───────┘   └───────┘

Kernel প্রতিটি thread আলাদাভাবে schedule করে
```

---

**ULT বনাম KLT — মূল পার্থক্য**

| বিষয়                        | ULT                                       | KLT                                               |
| ---------------------------- | ----------------------------------------- | ------------------------------------------------- |
| **OS thread সম্পর্কে জানে?** | সাধারণত না                                | হ্যাঁ                                             |
| **কে manage করে?**           | User-space thread library                 | Kernel                                            |
| **Scheduling কে করে?**       | Library                                   | Kernel                                            |
| **Context switch**           | দ্রুত হতে পারে                            | তুলনামূলক ব্যয়বহুল                               |
| **Thread block হলে**         | অনেক ক্ষেত্রে পুরো process block হতে পারে | শুধু ঐ thread block হয়                           |
| **Multi-core parallelism**   | সীমিত / model-নির্ভর                      | সম্ভব                                             |
| **Kernel features**          | সরাসরি সব সুবিধা পায় না                  | Kernel scheduling, priority, signals ইত্যাদি পায় |

---

### What are the advantages and disadvantages of each?

**ULT-এর সুবিধা**

#### i. Thread তৈরি ও switch দ্রুত

ULT context switch user space-এ হওয়ায় system call ছাড়াই হতে পারে।

```text
ULT context switch:
Library function call
→ registers save
→ next thread নির্বাচন
→ registers restore

(অনেক ক্ষেত্রে kernel involvement লাগে না)
```

#### ii. Portable

Thread library অনেক OS-এ চলতে পারে। তাই implementation তুলনামূলক portable হতে পারে।

#### iii. Custom scheduling সম্ভব

Application নিজেই তার দরকারমতো scheduling policy ব্যবহার করতে পারে।

#### iv. Kernel resource কম লাগে

যদি kernel প্রতিটি user thread-এর জন্য আলাদা kernel structure না রাখে, তাহলে অনেক ULT তৈরি করা তুলনামূলক সস্তা হতে পারে।

---

**ULT-এর অসুবিধা**

#### i. একটি blocking operation পুরো process-কে আটকে দিতে পারে

যদি threading model many-to-one ধরনের হয় এবং একটি thread blocking system call করে, তাহলে kernel পুরো process-টিকেই block করে ফেলতে পারে।

```text
T1 block (I/O wait):
┌─────────────────────────────┐
│  T1 (blocked - file read)   │
│  T2 (ready - কিন্তু আটকা)   │
│  T3 (ready - কিন্তু আটকা)   │
└─────────────────────────────┘
```

#### ii. True parallelism সীমিত হতে পারে

যদি kernel একটিমাত্র scheduling entity দেখে, তাহলে multi-core CPU-র full সুবিধা পাওয়া যায় না।

#### iii. Kernel scheduling সুবিধা সরাসরি পাওয়া যায় না

Kernel প্রতিটি thread-কে আলাদা entity হিসেবে না দেখলে per-thread priority বা kernel-level scheduling সুবিধা সীমিত হয়।

---

**KLT-এর সুবিধা ও অসুবিধা**

**সুবিধা**

#### i. True parallelism সম্ভব

Kernel প্রতিটি thread-কে আলাদা entity হিসেবে দেখে, তাই multi-core CPU-তে একাধিক thread একসাথে চলতে পারে।

```text
Multi-core CPU:
Core 1 → KT1
Core 2 → KT2
Core 3 → KT3
```

#### ii. একটি thread block হলেও অন্যরা চলতে পারে

একটি kernel thread blocked হলেও kernel অন্য ready thread-কে schedule করতে পারে।

```text
T1 block (I/O wait):
┌──────────────────────────────────┐
│  KT1 (blocked)                   │
│  KT2 (running) ✓                 │
│  KT3 (running) ✓                 │
└──────────────────────────────────┘
```

#### iii. Kernel-এর scheduling সুবিধা পাওয়া যায়

Priority scheduling, CPU accounting, signals, real-time support ইত্যাদি সুবিধা thread-level-এ পাওয়া যায়।

---

**অসুবিধা**

#### i. Thread তৈরি ও switch ব্যয়বহুল

কারণ kernel-কে প্রতিটি thread-এর জন্য metadata maintain করতে হয় এবং অনেক ক্ষেত্রে system call involve হয়।

```text
Possible KLT context switch:
Interrupt / system call / scheduling event
→ kernel scheduler decision
→ current thread state save
→ next thread state restore
→ selected thread resume
```

Kernel-level thread switch-এ kernel scheduler involvement লাগে। তবে প্রতিবার আলাদা করে `user mode → kernel mode` transition হবেই—এমন নয়; CPU আগে থেকেই kernel mode-এ থাকতে পারে।

#### ii. Kernel resource বেশি লাগে

প্রতিটি kernel thread-এর জন্য kernel data structure, scheduling info, stack ইত্যাদি maintain করতে হতে পারে।

#### iii. খুব বেশি thread তৈরি করলে overhead বাড়ে

প্রতিটি thread kernel-এর কাছে visible হওয়ায় scale বাড়লে overhead-ও বাড়তে পারে।

---


## 🔀 12. What are the multithreading models, and how do they differ?

User-level threads (ULT) এবং kernel-level threads (KLT)-এর মধ্যে **mapping** কীভাবে হবে, সেটাই **multithreading model** নির্ধারণ করে।

মূল প্রশ্ন:

> **কতগুলো user thread (ULT) কতগুলো kernel thread (KLT)-এর সাথে map হবে?**

এর ভিত্তিতে তিনটি classical model দেখা যায়:

* **Many-to-One**
* **One-to-One**
* **Many-to-Many**

---

**Many-to-One Model**


```text
        User Space
┌──────────────────────────────────────┐
│         Thread Library               │
│                                      │
│   T1      T2      T3      T4      T5 │
│   │       │       │       │       │  │
│   └───────┴───────┴───────┴───────┘  │
│                   │                  │
│           (সব ULT map হয়            │
│            একটিমাত্র KLT-এ)          │
└───────────────────┼──────────────────┘
                    │
════════════════════╪═════════════════════
        Kernel Space│
               ┌────┴────┐
               │   KT1   │
               └────┬────┘
                    │
                   CPU
```

---

**কীভাবে কাজ করে**

সমস্ত user thread একটিমাত্র kernel thread-এর উপর map হয়। Thread library সম্পূর্ণ user space-এ thread management করে। Kernel শুধু একটি single schedulable entity দেখে।

```text
Execution Timeline:

Time →  1    2    3    4    5    6    7    8
        ─────────────────────────────────────
CPU:   [T1] [T1] [T2] [T3] [T3] [T2] [T4] [T5]

Library নিজেই একের পর এক thread চালায়
```

---

**সমস্যা — Blocking**

যদি T1 I/O-র জন্য block হয়, তাহলে underlying একমাত্র kernel thread-ও block হতে পারে। ফলে অন্য ULT-গুলো ready থাকলেও তারা চলতে পারে না।

```text
T1 যদি I/O-র জন্য block হয়:

User Space:  T1(block)  T2(ready)  T3(ready)
                │
                ▼
Kernel:         KT1 → BLOCKED

ফলে T2, T3-ও অপেক্ষা করবে
```

---

**সুবিধা ও অসুবিধা**

| ✅ সুবিধা                | ❌ অসুবিধা                                       |
| ----------------------- | ----------------------------------------------- |
| Thread switch দ্রুত     | একটি blocking call পুরো progress আটকে দিতে পারে |
| Thread তৈরি সস্তা       | Multi-core parallelism পাওয়া যায় না           |
| Portable                | Kernel-level scheduling সুবিধা সীমিত            |
| Custom scheduling সম্ভব | True parallelism নেই                            |

---

**One-to-One Model**



```text
        User Space
┌──────────────────────────────────────┐
│                                      │
│   T1      T2      T3      T4         │
│   │       │       │       │          │
└───┼───────┼───────┼───────┼──────────┘
    │       │       │       │
════╪═══════╪═══════╪═══════╪══════════
    │       │       │       │
Kernel:
   KT1     KT2     KT3     KT4
    │       │       │       │
    ▼       ▼       ▼       ▼
  Core1   Core2   Core3   Core4
```

---

**কীভাবে কাজ করে**

প্রতিটি user thread-এর জন্য একটি corresponding kernel thread থাকে। Kernel প্রতিটি thread-কে আলাদাভাবে schedule করতে পারে।

---

**Blocking situation**

T1 block হলেও T2, T3, T4 চলতে পারে — কারণ প্রতিটির জন্য আলাদা kernel thread আছে।

```text
T1 যদি block হয়:

User Threads:  T1(block)  T2(ready)  T3(ready)
Kernel:        KT1        KT2        KT3
              blocked    running    running
```

---

**সুবিধা ও অসুবিধা**

| ✅ সুবিধা                             | ❌ অসুবিধা                                 |
| ------------------------------------ | ----------------------------------------- |
| True parallelism সম্ভব               | Thread তৈরি ব্যয়বহুল                     |
| একটি thread block হলে অন্যরা চলে     | Kernel resource বেশি লাগে                 |
| Kernel scheduling সুবিধা পাওয়া যায় | Context switch তুলনামূলক costly           |
| Modern OS-এ practical                | Thread সংখ্যা খুব বেশি হলে overhead বাড়ে |

**আধুনিক Linux, Windows, macOS** মূলত one-to-one ধরনের kernel-managed threading model ব্যবহার করে।

---

**Many-to-Many Model**


```text
        User Space
┌──────────────────────────────────────────┐
│                                          │
│  T1   T2   T3   T4   T5   T6   T7   T8  │
│  │    │    │    │    │    │    │    │   │
└──┼────┼────┼────┼────┼────┼────┼────┼───┘
   └────┴──┬─┴────┴────┴─┬──┴────┴────┘
           │ flexible mapping │
═══════════╪══════════════════╪════════════
Kernel:   KT1    KT2         KT3
           │      │           │
         Core1  Core2       Core3
```

---

**কীভাবে কাজ করে**

এখানে অনেকগুলো ULT অনেকগুলো KLT-এর সাথে map হয়।
অর্থাৎ user thread সংখ্যা kernel thread সংখ্যার চেয়ে বেশি হতে পারে, আর user-level runtime/library একটি kernel thread pool-এর উপর user threadগুলো multiplex করে। Runtime প্রয়োজন হলে OS-এর কাছে আরও kernel thread চাইতে পারে।

এই model-এর উদ্দেশ্য হলো:

* ULT-এর flexibility রাখা
* আবার KLT-এর parallelism-ও পাওয়া

---

**সুবিধা ও অসুবিধা**

| ✅ সুবিধা                          | ❌ অসুবিধা                     |
| --------------------------------- | ----------------------------- |
| True parallelism সম্ভব            | Implementation জটিল           |
| একটি block হলে অন্যরা চলতে পারে   | Debugging কঠিন                |
| ULT-এর flexibility + KLT-এর power | OS support সবসময় নেই         |
| Resource usage optimize করা যায়  | Runtime mapping logic complex |

---

**তিনটি Model-এর পাশাপাশি তুলনা**

| Feature                       | Many-to-One                          | One-to-One             | Many-to-Many       |
| ----------------------------- | ------------------------------------ | ---------------------- | ------------------ |
| **ULT : KLT mapping**         | অনেক : ১                             | ১ : ১                  | অনেক : অনেক        |
| **True parallelism**          | ❌                                    | ✅                      | ✅                  |
| **একটি thread block হলে**     | অনেক ক্ষেত্রে সবাই আটকে যায়         | শুধু ঐ thread block    | অন্যরা চলতে পারে   |
| **Thread creation cost**      | কম                                   | বেশি                   | মাঝারি             |
| **Implementation complexity** | কম                                   | কম/মাঝারি              | বেশি               |
| **Kernel visibility**         | Kernel সাধারণত একটিমাত্র entity দেখে | প্রতিটি thread visible | একাধিক KLT visible |
| **Modern usage**              | বিরল                                 | খুবই common            | বিরল / specialized |

---

**ULT, KLT এবং Multithreading Model-এর সম্পর্ক**

এখন পুরো picture-টা একসাথে দেখি।

* **ULT** মানে thread management user space-এ হচ্ছে
* **KLT** মানে kernel প্রতিটি thread-কে জানে ও manage করছে
* **Multithreading model** বলে **ULT আর KLT-এর mapping কেমন হবে**

> **Modern note:** Linux, Windows এবং macOS-এর mainstream application threads সাধারণত one-to-one kernel-managed threading model ব্যবহার করে। Many-to-many model historically গুরুত্বপূর্ণ, কিন্তু today সাধারণ application development-এ তুলনামূলক কম দেখা যায়।





## ⚡ 13. What is the difference between concurrency and parallelism?

**Concurrency** হলো এমন একটি অবস্থা বা execution model যেখানে **একাধিক task একই সময়কালে progress করতে পারে**, যদিও তারা **একই মুহূর্তে** necessarily execute নাও করতে পারে।

অর্থাৎ task-গুলো এমনভাবে run করে যে **তাদের কাজের সময় overlap করে**। একটি task কিছুক্ষণ চলে, তারপর আরেকটি task চলে, তারপর আবার আগের task চলে — এভাবে পালাক্রমে একাধিক task-এর progress হয়।

> **মূল কথা:** Concurrency হলো **multiple tasks-এর progress overlap করা**।
> এটি অনেক সময় **time-sharing, scheduling, context switching, async I/O, event-driven execution** ইত্যাদির মাধ্যমে অর্জন করা হয়।

---

**Parallelism (সমান্তরালতা)**

**Parallelism** হলো এমন execution যেখানে **একাধিক task সত্যিকার অর্থে একই মুহূর্তে execute হয়** — সাধারণত **একাধিক CPU core বা processor** ব্যবহার করে।

অর্থাৎ এখানে task-গুলো শুধু পালাক্রমে না, বরং **literally একই সময়ে** run করে।

> **মূল কথা:** Parallelism হলো **multiple tasks actually একই instant-এ run করা**।
> এটি true simultaneous execution, যা সাধারণত **multi-core system**-এ সম্ভব হয়।

---

```text
Concurrency:                    Parallelism:

   Time →                          Time →
   ──────────────────              ──────────────────
   [A][A][B][B][A][B]             Core 1: [A][A][A][A]
    ↑   ↑                         Core 2: [B][B][B][B]
   Switch করছে                      ↑
   (একটি CPU)                    একই সময়ে চলছে
                                  (দুটি CPU core)

A ও B দুটোই progress করছে      A ও B literally
কিন্তু একসাথে নয়               একই সময়ে চলছে
```

---

### তিনটি প্রধান execution pattern

---

#### i) Sequential Execution

একটি task পুরো শেষ হবে, তারপর আরেকটি task শুরু হবে।

```text
[A][A][A][B][B][B]
```

* **Concurrency:** ❌ না
* **Parallelism:** ❌ না

এখানে task A শেষ না হওয়া পর্যন্ত task B শুরুই হচ্ছে না।

---

#### ii) Concurrent but not Parallel

একটি **single-core** system-এ task A ও B **পালাক্রমে** চলছে।

```text
[A][B][A][B][A][B]
```

* **Concurrency:** ✅ হ্যাঁ
* **Parallelism:** ❌ না

এখানে A ও B দুটোরই progress হচ্ছে, কিন্তু একই মুহূর্তে নয়।
CPU interleave করছে।

---

#### iii) Concurrent and Parallel

একাধিক core-এ একাধিক task **একই সময়ে** চলছে।

```text
Core 1: [A][A][A][A]
Core 2: [B][B][B][B]
```

* **Concurrency:** ✅ হ্যাঁ
* **Parallelism:** ✅ হ্যাঁ

এখানে multiple task একই সময়েও চলছে, এবং সবার progress-ও হচ্ছে।

---

### Can a single-core system exhibit concurrency? Can it exhibit parallelism?

**হ্যাঁ, সম্পূর্ণভাবে সম্ভব।**

Single-core CPU-তে একটিমাত্র core থাকলেও OS এমনভাবে scheduling করতে পারে যে **একাধিক task-এর progress overlap** করে।

```text
Single-core CPU:

[Browser][Browser][Editor][Editor][Music][Browser][Editor][Music]...
      ↑                 ↑                 ↑
   switch            switch            switch
```

এখানে CPU একবার browser-কে, তারপর editor-কে, তারপর music player-কে সময় দিচ্ছে।
প্রতিটি task কিছুটা করে এগোচ্ছে।

**কীভাবে এটা সম্ভব হয়?**

Single-core concurrency সাধারণত নিচের উপায়ে হয়:

* **Time-sharing**
* **CPU scheduling**
* **Context switching**
* **Interrupt handling**
* **Async / non-blocking I/O**
* **Event loop / event-driven execution**

**কেন “একসাথে চলছে” মনে হয়?**

কারণ CPU খুব দ্রুত task switch করে।
যেমন যদি OS প্রতি **কয়েক millisecond** পর task switch করে, তাহলে মানুষের কাছে মনে হয় সবকিছু একসাথে চলছে।

অর্থাৎ এটি **true simultaneous execution** না, বরং **interleaved execution**।

---

**Single-core system-এ parallelism কি সম্ভব?**

একটি মাত্র **logical execution context** থাকলে একাধিক independent software thread-এর true task-level parallelism সম্ভব নয়।

কারণ একই সময়ে একাধিক independent software thread execute করার জন্য একাধিক logical processor/execution context প্রয়োজন। তাই একটি single logical CPU-তে task-গুলো interleave করতে পারে, কিন্তু একই instant-এ একাধিক task instruction execute করতে পারে না।

> **Nuance:** একটি physical core-এ SMT/hardware-threading থাকলে OS সেটিকে একাধিক logical CPU হিসেবে দেখতে পারে। এছাড়া instruction-level parallelism ও SIMD একটি core-এর ভেতরে থাকতে পারে; এখানে আলোচনা হচ্ছে independent software task/thread-এর parallelism নিয়ে।

> **সারকথা:**
> **Single-core → Concurrency সম্ভব**
> **Single logical execution context → True task-level parallelism সম্ভব নয়**

---

### Concurrency এবং Parallelism — সম্পর্ক

```text
Concurrency
│
├─ Multiple tasks-এর progress overlap করে
│
└─ এর একটি বিশেষ ক্ষেত্র হলো Parallelism,
   যেখানে task-গুলো একই সময়ে execute-ও হয়
```

অর্থাৎ:

* **Concurrency** মানে একাধিক task-এর progress overlap করা
* **Parallelism** মানে সেই task-গুলো সত্যিকার অর্থে একই মুহূর্তে run করাও

#### গুরুত্বপূর্ণ সম্পর্ক

* **Parallelism সাধারণত concurrency-ও তৈরি করে**, কারণ multiple task একই সময়ে progress করছে
* কিন্তু **Concurrency থাকলেই parallelism হবে না**
* একটি single logical execution context concurrency দিতে পারে, কিন্তু independent software task-এর true parallelism দিতে পারে না

---

#### বাস্তব উদাহরণ দিয়ে পার্থক্য

---

#### উদাহরণ ১ — Web Server

##### Concurrent Web Server (single core / event-driven model)

ধরো একটি web server একসাথে অনেক request handle করছে।

```text
Request 1 → process → DB wait → process → respond
Request 2 → process → DB wait → process → respond
Request 3 → process → DB wait → process → respond
```

এখানে যদি Request 1 database-এর response-এর জন্য wait করে, তাহলে CPU সেই সময় Request 2 বা Request 3 handle করতে পারে।

অর্থাৎ:

* একটি request I/O wait-এ আছে
* সেই সময় অন্য request progress করছে
* ফলে overall system একাধিক request একসাথে manage করতে পারছে

এটাই **Concurrency**।

এটি হতে পারে:

* async I/O দিয়ে
* event loop দিয়ে
* non-blocking server model দিয়ে
* scheduling/interleaving দিয়ে

---

##### Parallel Web Server (multi-core)

যদি server-এর একাধিক core থাকে, তাহলে:

```text
Core 1 → Request 1 handle করছে
Core 2 → Request 2 handle করছে
Core 3 → Request 3 handle করছে
```

এখানে একাধিক request **একই সময়ে** execute হতে পারে।

এটি **Parallelism**।

---

#### উদাহরণ ২ — Video Rendering

##### Concurrent only (single core)

একটি single-core system-এ যদি একাধিক frame render করতে হয়, তাহলে CPU frame 1, frame 2, frame 3 — এভাবে পালাক্রমে কাজ করবে।

```text
Frame 1: [░░██░░░░██░░]
Frame 2: [██░░░░██░░░░]
Frame 3: [░██░░░░██░░░]
```

সব frame-এর progress হচ্ছে, কিন্তু একসাথে নয়।

---

##### Parallel rendering (multi-core)

যদি 4টি core থাকে, তাহলে:

```text
Core 1 → Frame 1
Core 2 → Frame 2
Core 3 → Frame 3
Core 4 → Frame 4
```

এখানে 4টি frame একই সময়ে render হতে পারে।
এটি **Parallelism**, এবং সাধারণত rendering time কমিয়ে দেয়।

---

### Concurrency ও Parallelism-এর লক্ষ্য আলাদা

#### Concurrency-এর লক্ষ্য

Concurrency-এর মূল উদ্দেশ্য সবসময় speedup না।
বরং এটি বেশি useful হয় যখন তুমি চাও:

* system responsive রাখতে
* I/O wait-এর সময় CPU idle না রাখতে
* multiple user/request efficiently manage করতে
* resource utilization improve করতে
* event-driven application smoothly চালাতে

##### উদাহরণ:

* UI responsive রাখা
* browser-এ একসাথে tab/network/download handle করা
* web server-এ বহু request manage করা
* background কাজ চলতে থাকা অবস্থায় foreground কাজ চালানো

---

#### Parallelism-এর লক্ষ্য

Parallelism-এর মূল উদ্দেশ্য সাধারণত **speedup** এবং **throughput** বাড়ানো।

এটি useful হয় যখন:

* CPU-bound বড় কাজ দ্রুত শেষ করতে হবে
* বড় calculation অনেক core-এ ভাগ করে চালাতে হবে
* heavy computation একসাথে করতে হবে

##### উদাহরণ:

* video rendering
* image processing
* machine learning training
* scientific simulation
* large-scale data processing

---

**গুরুত্বপূর্ণ পর্যবেক্ষণ**

#### i) Concurrency মানেই faster execution নয়

Concurrency system-কে responsive ও efficient করতে সাহায্য করে, কিন্তু সবসময় program faster হবে — এমন না।

কারণ concurrency-এর সাথে আসতে পারে:

* context-switch overhead
* synchronization cost
* locking complexity
* race condition handling

---

#### ii) Parallelism speedup দিতে পারে

যদি কাজটি এমন হয় যা কার্যকরভাবে ভাগ করা যায়, তাহলে multiple core ব্যবহার করে কাজ দ্রুত শেষ হতে পারে। তবে serial অংশ, contention এবং coordination overhead-এর কারণে speedup নিশ্চিত নয় এবং core সংখ্যার সঙ্গে linearly বাড়ে না।

তবে parallelism-এরও overhead আছে:

* task splitting
* synchronization
* communication cost
* load balancing

---

#### iii) CPU-bound vs I/O-bound কাজ

##### I/O-bound কাজের জন্য concurrency খুব useful

যেমন:

* file read/write
* database call
* network request
* API call

##### CPU-bound কাজের জন্য parallelism বেশি useful

যেমন:

* matrix multiplication
* rendering
* simulation
* data processing

---

| বিষয়                               | Concurrency                                            | Parallelism                                 |
| ---------------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| মূল ধারণা                          | একাধিক task-এর progress overlap করা                    | একাধিক task একই মুহূর্তে execute হওয়া       |
| একই সময়ে execute হওয়া বাধ্যতামূলক? | না                                                     | হ্যাঁ                                       |
| Single-core-এ সম্ভব?               | হ্যাঁ                                                  | না                                          |
| Multi-core দরকার?                  | না                                                     | হ্যাঁ (true task-level parallelism-এর জন্য) |
| সাধারণ কৌশল                        | scheduling, interleaving, context switching, async I/O | multiple cores / processors                 |
| প্রধান লক্ষ্য                      | responsiveness, overlap, resource utilization          | speedup, throughput                         |
| I/O-bound task-এ useful?           | খুব বেশি                                               | কখনো কখনো                                   |
| CPU-bound task-এ useful?           | সীমিত                                                  | খুব বেশি                                    |

---
