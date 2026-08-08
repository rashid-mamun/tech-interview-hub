---
sidebar_position: 8
title: 'Virtual Memory'
---


## 🪟 33. What is virtual memory, and why is it used?

**Virtual Memory** হলো একটি **memory management technique** যা প্রতিটি process-কে এমন একটি **illusion (বিভ্রম)** দেয় যে তার নিজস্ব একটি বড়, continuous এবং private address space রয়েছে—যদিও বাস্তবে physical RAM সীমিত এবং সেটি একাধিক process-এর মধ্যে share করা হয়।

Virtual Memory-তে process শুধুমাত্র **logical (virtual) address** ব্যবহার করে। এই virtual address সরাসরি physical RAM-এর address নয়। **Memory Management Unit (MMU)** এবং Operating System একসঙ্গে virtual address-কে physical address-এ translate করে।

আধুনিক Operating System-এ Virtual Memory সাধারণত **Demand Paging** ব্যবহার করে। Process-এর পুরো code, data এবং stack একসঙ্গে RAM-এ resident থাকে না; প্রয়োজনীয় page-গুলো RAM-এ আনা হয়। Non-resident page file-backed executable/library থেকে load হতে পারে, swap-backed হতে পারে, অথবা anonymous demand-zero/COW page হিসেবে memory-তেই তৈরি হতে পারে।

---

### কেন Virtual Memory ব্যবহার করা হয়?

**1. Physical RAM-এর চেয়ে বড় Virtual Address Space ব্যবহার করা যায়:** Program-এর সম্পূর্ণ mapped memory একসঙ্গে RAM-এ resident রাখার প্রয়োজন হয় না। তবে actively touched/committed data-এর practical limit RAM, swap/backing store, OS commit policy এবং workload locality-এর ওপর নির্ভর করে; virtual allocation মানেই সমপরিমাণ physical storage reserved নয়।

**2. Higher Degree of Multiprogramming:** যেহেতু প্রতিটি process-এর কেবল active page-গুলো RAM-এ থাকে, তাই একই RAM-এ আরও বেশি process একসঙ্গে manage করা যায়।
ফলে system resources আরও দক্ষভাবে ব্যবহার করা সম্ভব হয়।


**3. সহজ Programming Model:** Programmer-কে physical memory কোথায় আছে বা কতটুকু free আছে তা নিয়ে চিন্তা করতে হয় না।
প্রতিটি process একটি বড় এবং continuous virtual address space ব্যবহার করতে পারে।


**4. Process Isolation এবং Security:** প্রতিটি process-এর নিজস্ব virtual address space থাকে।
ফলে একটি process অন্য process-এর memory সরাসরি access বা modify করতে পারে না।


**5. Efficient Memory Utilization:** Operating System শুধুমাত্র প্রয়োজনীয় page-গুলো RAM-এ রাখে।
ফলে RAM-এর ব্যবহার আরও efficient হয় এবং অপ্রয়োজনীয় memory occupation কমে যায়।

---

### How does virtual memory allow processes to use more memory than physically available?

Virtual Memory মূলত **Demand Paging** এবং **Secondary Storage** ব্যবহার করে এই সুবিধা প্রদান করে।


**1. পুরো Process একসঙ্গে RAM-এ Load হয় না:** একটি process-কে ছোট ছোট fixed-size **page**-এ ভাগ করা হয়।
Execution শুরু করার জন্য যতটুকু page প্রয়োজন, শুধুমাত্র সেই page-গুলো RAM-এ load করা হয়।


**2. Page Table প্রতিটি Page-এর অবস্থা সংরক্ষণ করে:** প্রতিটি Page Table Entry (PTE)-তে একটি **Present (Valid/Invalid) Bit** থাকে।

* Present = 1 → Page বর্তমানে RAM-এ আছে।
* Present = 0 → Page বর্তমানে RAM-এ নেই।

**3. Page Fault হলে কী হয়?**

যখন process এমন একটি page access করে যা RAM-এ নেই—

1. Hardware একটি **Page Fault** exception generate করে।
2. Operating System page fault handler execute করে।
3. Fault-এর type অনুযায়ী page-টি executable/mapped file বা swap থেকে আনা হয়, demand-zero page তৈরি করা হয়, অথবা copy-on-write copy বানানো হয়।
4. RAM-এ একটি free frame খোঁজা হয়।
5. Free frame না থাকলে Page Replacement Algorithm (যেমন LRU approximation বা Clock Algorithm) ব্যবহার করে একটি page replace করা হয়।
6. Victim page dirty এবং contents preserve করা প্রয়োজন হলে সেটি backing store-এ write করা হয়।
7. নতুন page RAM-এ load করা হয়।
8. Page Table update করা হয়।
9. Faulting instruction পুনরায় execute করা হয়।

Valid, recoverable page fault application-এর জন্য transparent থাকে, যদিও latency বাড়তে পারে। Invalid access বা unrecoverable I/O error হলে signal/exception দেখা যায়।


**4. ফলাফল** যেহেতু যেকোনো সময় process-এর শুধুমাত্র active page-গুলো RAM-এ থাকে, তাই process-এর মোট virtual address space physical RAM-এর চেয়ে অনেক বড় হতে পারে।

উদাহরণস্বরূপ, 2 GB RAM-এর system-এ process-গুলোর মোট mapped virtual address space সহজেই 8 GB-এর বেশি হতে পারে। তবে সব mapped page একই সময়ে resident/committed ও actively used হলে পর্যাপ্ত RAM/backing না থাকায় severe paging বা allocation failure হতে পারে।

---

### How does virtual memory provide isolation between processes?

Virtual Memory প্রতিটি process-কে একটি স্বাধীন virtual address space প্রদান করে এবং hardware ও Operating System একসঙ্গে সেই isolation নিশ্চিত করে।


**1. প্রতিটি Process-এর নিজস্ব Page Table থাকে:** Operating System প্রতিটি process-এর জন্য আলাদা Page Table maintain করে।
একই virtual address (যেমন **0x1000**) দুইটি process-এ সম্পূর্ণ ভিন্ন physical frame-এ map হতে পারে।
ফলে প্রতিটি process নিজের address space-ই দেখতে পায়।

**2. Process সরাসরি Physical Address ব্যবহার করে না:** Application শুধুমাত্র virtual address ব্যবহার করে।
MMU ছাড়া কোনো process সরাসরি physical memory access করতে পারে না।

**3. Protection Bits:** প্রতিটি Page Table Entry-তে সাধারণত Read, Write এবং Execute permission থাকে।
যদি কোনো process এমন page access করার চেষ্টা করে যার permission নেই বা page mapping বৈধ নয়, তাহলে hardware একটি **protection fault** বা **page fault** exception generate করে।

Operating System সেই exception handle করে। Application এটি handle করতে না পারলে সাধারণত process terminate হয় (যেমন Unix/Linux-এ segmentation fault signal পাওয়া যায়)।



**4. Kernel এবং User Space আলাদা থাকে:** Virtual Memory-এর মাধ্যমে Operating System kernel memory-কে user process থেকে আলাদা রাখে।
User mode-এ থাকা কোনো process সরাসরি kernel memory access করতে পারে না।
Kernel service ব্যবহার করতে হলে process-কে **system call** করতে হয়।

---

## ⚡ 34. What is a Translation Lookaside Buffer (TLB), and how does it speed up address translation?

**Translation Lookaside Buffer (TLB)** হলো একটি ছোট, অত্যন্ত দ্রুতগতির (**high-speed**) **hardware cache**, যা সাধারণত **MMU (Memory Management Unit)**-এর অংশ হিসেবে বা CPU-এর memory management hardware-এর মধ্যে implement করা হয়।

এর কাজ হলো সাম্প্রতিক ব্যবহৃত **virtual page number → physical frame number** translation-গুলো cache করে রাখা, যাতে বারবার page table access করতে না হয়।

সহজভাবে বললে, **TLB হলো Page Table-এর একটি cache**।
এখানে পুরো Page Table থাকে না; বরং শুধুমাত্র সাম্প্রতিক বা frequently used কিছু Page Table Entry (PTE)-এর translation সংরক্ষিত থাকে।


### TLB কীভাবে Address Translation Speed Up করে?

Paging ব্যবস্থায় CPU যখনই কোনো virtual address access করে, তখন সেটিকে physical address-এ translate করতে হয়।
Page Table সাধারণত main memory (RAM)-এ থাকে।
Single-level page table ধরে নিলে TLB ছাড়া প্রতিটি memory access-এর জন্য সাধারণত—

1. Page Table থেকে Frame Number বের করতে একটি memory access।
2. এরপর Actual Data বা Instruction access করতে আরেকটি memory access।

Multi-level page table হলে cold page-table walk-এ একাধিক dependent memory access লাগতে পারে, তারপর actual data access হয়। Page-walk cache এই cost কিছুটা কমাতে পারে।


#### TLB কীভাবে এই সমস্যা সমাধান করে?

**1. CPU প্রথমে TLB-তে খোঁজে:** CPU যখন একটি virtual address generate করে, তখন MMU প্রথমে TLB-তে সেই page number-এর translation খোঁজে।

**2. TLB Hit:** যদি translation TLB-তে পাওয়া যায় (**TLB Hit**)—
* সরাসরি Frame Number পাওয়া যায়।
* Page Table access করার প্রয়োজন হয় না।
* দ্রুত Physical Address তৈরি করা যায়।
* এরপর RAM থেকে Actual Data access করা হয়।

যেহেতু TLB অত্যন্ত দ্রুত hardware cache, তাই TLB hit হলে address translation খুব কম সময়ে সম্পন্ন হয়।



**3. কেন এটি কার্যকর?:** Program-গুলো সাধারণত **temporal locality** প্রদর্শন করে।
অর্থাৎ, সম্প্রতি ব্যবহৃত page আবার ব্যবহৃত হওয়ার সম্ভাবনা বেশি।
TLB এই বৈশিষ্ট্যের সুবিধা নিয়ে সাম্প্রতিক translation-গুলো cache করে রাখে।

ফলে অধিকাংশ memory access-এ Page Table পর্যন্ত যেতে হয় না এবং system performance উল্লেখযোগ্যভাবে বৃদ্ধি পায়।

---

### What happens on a TLB miss, and how is the page table consulted afterward?

**TLB Miss** ঘটে যখন চাওয়া page-এর translation TLB-তে পাওয়া যায় না।
TLB Miss-এর ধাপগুলো

**1. Page Table Walk:** x86-এর মতো hardware-managed TLB architecture-এ MMU page table walk করে; multi-level table হলে প্রয়োজনীয় level traverse করে mapping বের করে। কিছু architecture-এ TLB miss software handler refill করে। Exact mechanism architecture-dependent।


**2. Translation পাওয়া গেলে:** যদি Page Table-এ বৈধ mapping পাওয়া যায়—

* সংশ্লিষ্ট Frame Number পাওয়া যায়।
* নতুন translation TLB-তে insert করা হয়।
* এরপর Actual Data access করা হয়।

যদি TLB পূর্ণ থাকে, তাহলে কোনো একটি পুরোনো entry replacement policy অনুযায়ী সরিয়ে নতুন entry রাখা হয়।


**3. যদি Page Memory-তে না থাকে**: যদি Page Table দেখায় যে page বর্তমানে RAM-এ নেই, তাহলে **Page Fault** ঘটে।

এক্ষেত্রে Operating System—

1. Page Fault handler execute করে।
2. Page-টি executable file অথবা swap space থেকে নিয়ে আসে।
3. প্রয়োজনে একটি page replace করে।
4. Page Table update করে।
5. TLB update করে।
6. Faulting instruction পুনরায় execute করে।

---

#### TLB Miss-এর Cost:

TLB Miss হলে—

* Page Table Walk করতে হয়।
* অতিরিক্ত memory access লাগে।

আর যদি Page Fault-ও ঘটে, তাহলে disk access লাগার কারণে delay অনেক বেড়ে যায়।

---

### What is a TLB flush, and when does it need to happen?
**TLB Flush** হলো এমন একটি operation যেখানে TLB-এর সব entry অথবা নির্দিষ্ট কিছু entry invalidate করা হয়।
এর ফলে পুরোনো translation আর ব্যবহার করা যায় না।



**কেন TLB Flush প্রয়োজন হয়?** TLB-এর প্রতিটি entry একটি নির্দিষ্ট address space-এর জন্য valid।
কারণ প্রতিটি process-এর নিজস্ব Page Table থাকে।
একই virtual address দুইটি process-এ সম্পূর্ণ ভিন্ন physical frame-এ map হতে পারে।

তাই পুরোনো translation ভুল process-এর ক্ষেত্রে ব্যবহার করা গেলে memory corruption বা security সমস্যা হতে পারে।

---
**কখন TLB Flush করা হয়?**


**1. Context Switch:** একটি process থেকে অন্য process-এ switch হলে address space পরিবর্তিত হয়।
পুরোনো translation নতুন process-এর জন্য সাধারণত valid থাকে না।
অনেক architecture-এ তাই Context Switch-এর সময় TLB flush করা হয়।

তবে আধুনিক processor-এ **ASID (Address Space Identifier)** বা **PCID (Process-Context Identifier)** ব্যবহৃত হলে প্রতিবার পুরো TLB flush করার প্রয়োজন হয় না। প্রতিটি TLB entry নির্দিষ্ট address space-এর সঙ্গে tag করা থাকে।

**2. Page Table পরিবর্তন হলে:** যদি কোনো page—
* Unmap করা হয়,
* Permission পরিবর্তন করা হয়,
* অথবা নতুন Frame-এ remap করা হয়,

তাহলে সংশ্লিষ্ট TLB entry invalidate করতে হয়।
নইলে stale translation ব্যবহৃত হতে পারে।


**3. Address-space destruction/reuse:** Process শেষ হলে তার page table আর valid থাকে না। OS architecture অনুযায়ী targeted invalidation, ASID/PCID generation change বা lazy invalidation ব্যবহার করতে পারে; প্রতিবার synchronous full-TLB flush বাধ্যতামূলক নয়।

**4. Kernel Memory Mapping পরিবর্তন হলে:** Operating System যদি Kernel-এর memory mapping পরিবর্তন করে, তাহলে সংশ্লিষ্ট TLB entry invalidate করতে হতে পারে।

---

**TLB Flush-এর Cost**

TLB Flush-এর পরে TLB-তে খুব কম translation থাকে।
ফলে কিছু সময়ের জন্য অনেক **TLB Miss** ঘটে।
একে অনেক সময় **Cold TLB** অবস্থা বলা হয়।
এই সময় address translation তুলনামূলক ধীর হয়।
এই কারণেই আধুনিক processor-গুলো **ASID/PCID** ব্যবহার করে অপ্রয়োজনীয় TLB Flush এড়ানোর চেষ্টা করে।

---

## 📥 35. What is demand paging, and how does a page fault work end-to-end?

**Demand Paging** হলো **Virtual Memory** বাস্তবায়নের একটি technique, যেখানে কোনো page **শুধুমাত্র তখনই RAM-এ load করা হয় যখন সেটি প্রথমবার সত্যিই প্রয়োজন হয় (on demand)**।

অর্থাৎ, process শুরু হওয়ার সময় তার পুরো memory image একসঙ্গে RAM-এ load করা হয় না। বরং **lazy loading** ব্যবহার করা হয়—শুধুমাত্র execution-এর জন্য প্রয়োজনীয় page-গুলো RAM-এ আনা হয়।

**মূল ধারণা**

* Process-এর virtual address space ছোট ছোট fixed-size **page**-এ বিভক্ত থাকে।
* শুরুতে অনেক page RAM-এ থাকে না; Page Table-এ সেগুলোর **Present (Valid) Bit = 0** থাকে।
* CPU যখন এমন কোনো page access করে যা RAM-এ নেই, তখন **Page Fault** exception ঘটে।
* Operating System তখন প্রয়োজনীয় page RAM-এ load করে এবং execution পুনরায় শুরু করে।


### Demand Paging-এর সুবিধা

**1. কম Memory ব্যবহার:** যেসব page কখনো access-ই করা হয় না, সেগুলো RAM-এ load করার প্রয়োজন হয় না।
ফলে memory সাশ্রয় হয়।

**2. দ্রুত Process Startup:** Execution শুরু করার জন্য যতটুকু page প্রয়োজন, শুধুমাত্র সেটুকুই load করা হয়।
ফলে process দ্রুত শুরু করা যায়।

**3. Higher Degree of Multiprogramming:** প্রতিটি process কম RAM ব্যবহার করায় একই RAM-এ আরও বেশি process manage করা সম্ভব হয়।

**4. Efficient Memory Utilization:** RAM-এ শুধুমাত্র active page-গুলো থাকে।
অপ্রয়োজনীয় page RAM দখল করে রাখে না।

**Demand Paging-এর trade-off:** প্রথমবার কোনো page access করলে page fault হতে পারে। Page fault handle করতে disk I/O লাগলে delay অনেক বেশি হয়। তাই demand paging memory save করলেও page fault rate বেশি হলে performance কমে যায়।

### What steps does the OS take when a page fault occurs?

**Page Fault** হলো একটি **hardware exception**, যা address translation বা permission check সফলভাবে সম্পন্ন না হলে ঘটে—যেমন page non-present, write-protected COW page-এ write, অথবা invalid/protected address access। Demand paging-এর non-present fault স্বাভাবিক ও recoverable হতে পারে; সব page fault স্বাভাবিক বা disk-backed নয়।


#### Page Fault End-to-End কীভাবে কাজ করে?

**Step 1: Virtual Address Generate:** CPU একটি instruction execute করার সময় একটি virtual address generate করে।
MMU cached translation/permission check করে এবং প্রয়োজন হলে Page Table consult করে। Mapping absent থাকলে বা requested access permission violate করলে hardware Page Fault তোলে।


**Step 2: Page Fault Exception** Hardware একটি **Page Fault Exception** generate করে।
CPU control Operating System-এর Page Fault Handler-এর কাছে চলে যায়।
Process-এর execution context (যেমন Program Counter, Registers ইত্যাদি) সংরক্ষণ করা হয়।


**Step 3: Access বৈধ কিনা যাচাই:** Operating System প্রথমে পরীক্ষা করে—

* Addressটি process-এর address space-এর মধ্যে আছে কিনা।
* Process-এর সেই page access করার অনুমতি আছে কিনা।

যদি access অবৈধ হয়, তাহলে Operating System exception report করে (যেমন Unix/Linux-এ segmentation fault signal), এবং সাধারণত process terminate হয়।
যদি access বৈধ হয়, তাহলে পরবর্তী ধাপে যাওয়া হয়।


**Step 4: Free Frame খোঁজা** Operating System RAM-এ একটি free frame খোঁজে।
* যদি free frame থাকে, সেটি ব্যবহার করা হয়।
* যদি free frame না থাকে, তাহলে একটি **Page Replacement Algorithm** ব্যবহার করা হয় (যেমন FIFO, Clock বা LRU approximation)।

Victim page dirty হলে সেটিকে আগে disk-এ write-back করা হয়।


**Step 5: Page Materialize করা** Major fault হলে Operating System page executable/mapped file বা swap থেকে RAM-এ load করে; disk/storage I/O চলার সময় process block করে এবং scheduler অন্য task চালায়। Minor fault-এ demand-zero page allocate বা COW copy তৈরি করা যায়, যেখানে storage I/O ও দীর্ঘ blocking প্রয়োজন নাও হতে পারে।


**Step 6: Page Table Update:** Page সফলভাবে RAM-এ আসার পরে—

* সংশ্লিষ্ট Frame Number Page Table Entry-তে লেখা হয়।
* Present (Valid) Bit = 1 করা হয়।
* প্রয়োজনীয় অন্যান্য status bit-ও update করা হয়।

নতুন translation পরবর্তীতে TLB-তেও cache হতে পারে।

**Step 7: Process runnable হয়:** Major fault-এর I/O complete হলে process ready/runnable হয়। Minor fault handler completion-এর পর kernel সরাসরি একই task-এ ফেরতও যেতে পারে।


**Step 8: Faulting Instruction পুনরায় Execute:** যখন Process আবার CPU পায়, তখন যে instruction Page Fault ঘটিয়েছিল, সেটি পুনরায় execute করা হয়।

এবার Page RAM-এ থাকায় Address Translation সফল হয় এবং execution স্বাভাবিকভাবে চলতে থাকে।

---

**পুরো Flow**

নিচের diagram-টি non-present, storage-backed **major page fault**-এর simplified path দেখায়। Demand-zero/COW minor fault বা protection fault-এর path কিছু ধাপে আলাদা হতে পারে।

```text
CPU Virtual Address
        │
        ▼
     TLB Lookup
        │
        ▼
    TLB Miss
        │
        ▼
   Page Table Lookup
        │
        ▼
 Present Bit = 0 ?
        │
      Yes
        │
        ▼
 Page Fault Exception
        │
        ▼
 Operating System
        │
        ▼
 Legal Access?
   │           │
  No          Yes
   │           │
Terminate   Find Free Frame
                │
 Free Frame আছে?
    │          │
   Yes         No
    │          │
    │     Page Replacement
    │          │
    │     Dirty Page?
    │       │        │
    │      Yes       No
    │       │        │
    │   Write Back   │
    │       │        │
    └───────┴────────┘
            │
            ▼
Load Required Page
        │
        ▼
Update Page Table
        │
        ▼
Ready Queue
        │
        ▼
Restart Faulting Instruction
```

---




## 🔄 36. What are the common page replacement algorithms?

যখন একটি **page fault** ঘটে এবং physical memory-তে কোনো **free frame** না থাকে, তখন OS-কে RAM-এ থাকা কোনো একটি existing page বেছে সরিয়ে ফেলতে হয়। এই page-কে **victim page** বলা হয়। কোন page সরানো হবে, সেটি ঠিক করার strategy-ই হলো **page replacement algorithm**।

ভালো page replacement algorithm-এর লক্ষ্য:

* **page fault rate** কমানো
* dirty page write-back কমানো
* frequently used page RAM-এ রাখা
* implementation overhead reasonable রাখা

---

### FIFO, LRU, Optimal, এবং LFU/MFU — তুলনামূলক আলোচনা

#### 1. FIFO (First-In-First-Out)

* **ধারণা:** যে page সবচেয়ে আগে RAM-এ এসেছিল, সেটিকে আগে সরানো হয়।
* **বাস্তবায়ন:** একটি simple queue maintain করা হয়।
* **সুবিধা:** implement করা সহজ এবং overhead কম।
* **অসুবিধা:** পুরোনো page এখনো frequently used হতে পারে। FIFO usage pattern দেখে না, তাই decision খারাপ হতে পারে। এছাড়া এটি **Belady's Anomaly**-তে ভুগতে পারে।

#### 2. LRU (Least Recently Used)

* **ধারণা:** যে page সবচেয়ে দীর্ঘ সময় ধরে access হয়নি, সেটিকে সরানো হয়।
* **ভিত্তি:** temporal locality — সম্প্রতি ব্যবহৃত page আবার ব্যবহৃত হওয়ার সম্ভাবনা বেশি।
* **সুবিধা:** সাধারণত FIFO-এর চেয়ে ভালো performance দেয়।
* **অসুবিধা:** Exact LRU implement করা costly, কারণ প্রতিটি page access-এর recency track করতে হয়।

#### 3. Optimal (OPT / MIN)

* **ধারণা:** যে page ভবিষ্যতে সবচেয়ে দেরিতে ব্যবহৃত হবে, বা আর ব্যবহৃতই হবে না, সেটিকে সরানো হয়।
* **বৈশিষ্ট্য:** theoretically সবচেয়ে কম page fault rate দেয়।
* **সীমাবদ্ধতা:** বাস্তবে implement করা যায় না, কারণ future reference string আগে থেকে জানা থাকে না। এটি benchmark হিসেবে ব্যবহৃত হয়।

#### 4. LFU (Least Frequently Used)

* **ধারণা:** যে page সবচেয়ে কমবার ব্যবহৃত হয়েছে, সেটিকে সরানো হয়।
* **যুক্তি:** কম ব্যবহৃত page ভবিষ্যতেও কম দরকার হতে পারে।
* **অসুবিধা:** নতুন দরকারি page-এর count কম থাকায় সেটি ভুলভাবে remove হতে পারে। পুরোনো page historically বেশি ব্যবহৃত হলেও এখন useless হতে পারে।

#### 5. MFU (Most Frequently Used)

* **ধারণা:** LFU-এর বিপরীত — যে page সবচেয়ে বেশি ব্যবহৃত হয়েছে, সেটিকে সরানো হয়।
* **যুক্তি:** page অনেকবার ব্যবহার হয়ে গেলে তার কাজ শেষ হয়ে থাকতে পারে।
* **বাস্তবে ব্যবহার:** LFU/MFU সাধারণ-purpose OS page replacement-এ খুব কম ব্যবহৃত হয়, কারণ counter maintain costly এবং access pattern predict করা কঠিন।

#### সারসংক্ষেপ তুলনা

| Algorithm | ভিত্তি | Performance | Practical Implementation |
| --- | --- | --- | --- |
| FIFO | Age (কতক্ষণ আগে এসেছে) | সাধারণত খারাপ | সহজ, কম overhead |
| LRU | Recency (কতক্ষণ আগে ব্যবহার হয়েছে) | ভালো; এর approximations widely ব্যবহৃত | Exact implementation costly |
| Optimal | Future knowledge | সর্বোত্তম (theoretical) | বাস্তবে সম্ভব না |
| LFU | Frequency (কতবার ব্যবহার হয়েছে) | মাঝারি, কিছু সমস্যা আছে | Costly, কম ব্যবহৃত |
| MFU | Frequency (উল্টো logic) | সাধারণত খারাপ | কম ব্যবহৃত |

---

### Belady's Anomaly কী, এবং কোন Algorithm এতে ভোগে?

**Belady's Anomaly** হলো counter-intuitive একটি পরিস্থিতি, যেখানে physical memory-তে **frame-এর সংখ্যা বাড়ানো হলেও page fault-এর সংখ্যা কমার বদলে বেড়ে যায়**।

সাধারণ যুক্তি অনুযায়ী মনে হওয়া উচিত যে বেশি frame দিলে বেশি page RAM এ রাখা যাবে, তাই fault কমবে — কিন্তু কিছু নির্দিষ্ট algorithm এ এবং কিছু নির্দিষ্ট reference string এ, বাস্তবে উল্টোটা ঘটে।

**কোন Algorithm এতে ভোগে:**

**FIFO** algorithm এই anomaly-তে ভুগতে পারে। এর কারণ হলো FIFO শুধুমাত্র page কতক্ষণ আগে RAM-এ এসেছে সেটা বিবেচনা করে, page কতটা useful বা recently used সেটি বিবেচনা করে না।

**গুরুত্বপূর্ণ তথ্য:**

* **LRU এবং Optimal** algorithm Belady's Anomaly-তে ভোগে না। এদের **stack property** আছে।
* Stack property মানে, `N` frame-এর সাথে যে pageগুলো RAM-এ থাকে, সেগুলো `N+1` frame-এর সাথে RAM-এ থাকা pageগুলোর subset হবে।
* FIFO-এর এই stack property নেই, তাই এটি anomaly-তে পড়তে পারে।

---

### বাস্তবে LRU কীভাবে approximate করা হয়?

Pure LRU implement করতে হলে প্রতিটি page access-এর জন্য timestamp বা linked list/stack maintain করতে হয়। প্রতিটি memory reference-এ এই structure update করা costly। তাই practical systems সাধারণত LRU approximation ব্যবহার করে।

#### Clock Algorithm (Second-Chance Algorithm)

এটি সবচেয়ে common LRU approximation technique-এর একটি।

**কীভাবে কাজ করে:**

1. প্রতিটি page-এর জন্য একটি **reference bit** বা **use bit** রাখা হয়।
2. কোনো page access হলে hardware সেই page-এর reference bit `1` করে।
3. pageগুলো circular list/queue আকারে থাকে, এবং একটি pointer বা clock hand ঘুরতে থাকে।
4. page replace দরকার হলে pointer pageগুলো check করে:
   * reference bit `0` হলে pageটি victim হিসেবে বেছে নেওয়া হয়।
   * reference bit `1` হলে pageটিকে second chance দেওয়া হয়, bit `0` করা হয়, এবং pointer সামনে যায়।
5. এই প্রক্রিয়া চলতে থাকে যতক্ষণ না reference bit 0 থাকা একটা page খুঁজে পাওয়া যায়।

**কেন এটা LRU এর একটা ভালো Approximation:**

* এটি exact recency track না করলেও recent use-এর rough signal দেয়।
* এটি implement করা সহজ: reference bit এবং circular pointer দরকার, exact timestamp/linked list দরকার হয় না।

**Enhanced Second-Chance Algorithm:**

কিছু system-এ reference bit-এর সাথে **dirty (modified) bit**-ও বিবেচনা করা হয়। এতে সাধারণত clean এবং recently unused page আগে replace করার চেষ্টা করা হয়, কারণ dirty page remove করলে disk write-back দরকার হয়।

**সংক্ষেপে:** Clock/Second-Chance Algorithm pure LRU-এর মতো নিখুঁত না হলেও কম overhead-এ ভালো practical result দেয়।

---

### Thrashing কী, এবং page replacement-এর সাথে এর সম্পর্ক কী?

**Thrashing** হলো এমন অবস্থা যেখানে system useful work করার চেয়ে page fault handle করা এবং page swap in/out করাতেই বেশি সময় ব্যয় করে।

এটি সাধারণত ঘটে যখন:

* RAM-এর তুলনায় active process/page demand অনেক বেশি
* process-এর **working set** RAM-এ ধরছে না
* OS অতিরিক্ত multiprogramming করছে
* page replacement algorithm বারবার দরকারি page-ই বের করে দিচ্ছে

**Working set** বলতে একটি process সাম্প্রতিক সময়ে যে pageগুলো actively ব্যবহার করছে সেই set বোঝায়। যদি কোনো process-এর working set RAM-এ রাখা না যায়, তাহলে সে বারবার page fault করবে।

Thrashing-এর লক্ষণ:

* CPU utilization কমে যায়
* disk I/O খুব বেড়ে যায়
* page fault rate অনেক বেশি হয়
* system sluggish হয়ে যায়

**সমাধান/Control**

* multiprogramming degree কমানো
* process-এর resident set/frame allocation বাড়ানো
* working-set based বা page-fault-frequency based control ব্যবহার করা
* বেশি RAM যোগ করা

সংক্ষেপে, page replacement algorithm ভালো হলেও RAM যদি active working set ধরে রাখতে না পারে, তাহলে thrashing হতে পারে।
