---
sidebar_position: 4
title: 'CPU Scheduling'
---


## 🎯 19. What are the key goals/criteria of a CPU scheduling algorithm?

একটি ভালো CPU scheduler ডিজাইন করতে গেলে নিচের criteria গুলো maximize বা minimize করার চেষ্টা করা হয়।

#### **Maximize করতে হয়:**

**CPU Utilization** — CPU-কে যত বেশি সম্ভব কার্যকর (busy) রাখা এবং idle time কমিয়ে আনা। CPU utilization যত বেশি হবে, system-এর resource তত ভালোভাবে ব্যবহার হবে।

**Throughput** — প্রতি unit time-এ কতটি process সম্পন্ন হয়েছে। Throughput যত বেশি হবে, system তত বেশি কাজ সম্পন্ন করতে পারবে। এটি বিশেষ করে **batch system**-এ অত্যন্ত গুরুত্বপূর্ণ।

#### **Minimize করতে হয়:**

**Turnaround Time, Waiting Time, এবং Response Time** — এই তিনটি যত কম হবে, system-এর performance এবং user experience তত ভালো হবে।

---

### What is the difference between turnaround time, waiting time, and response time?

উপরের diagram-এ timeline দেখে এটি সহজে বোঝা যায়।

#### **Turnaround Time**

Process submit (arrival) করার মুহূর্ত থেকে শুরু করে সেটি সম্পূর্ণ শেষ হওয়া পর্যন্ত মোট সময়।

> **Turnaround Time = Completion Time − Arrival Time**

---

#### **Waiting Time**

Process টি Ready Queue-তে থেকে CPU পাওয়ার জন্য যত সময় অপেক্ষা করেছে, সেই সময়গুলোর সমষ্টি। CPU execution-এর সময় waiting time-এর মধ্যে গণনা করা হয় না।

> **Waiting Time = Turnaround Time − Burst Time**

---

#### **Response Time**

Process arrive করার পর প্রথমবার CPU পাওয়া পর্যন্ত সময়। অর্থাৎ process প্রথমবার execution শুরু করতে যত সময় লাগে। Interactive system-এ এটি সবচেয়ে গুরুত্বপূর্ণ, কারণ user কত দ্রুত প্রথম response পাচ্ছে সেটি এটি নির্দেশ করে।

> **Response Time = First Start Time − Arrival Time**

---

ধরো একটি process **t = 0**-তে arrive করল, **t = 5**-এ প্রথমবার CPU পেল, **t = 30**-এ execution শেষ হলো এবং এর **Burst Time = 20**।

তাহলে,

* **Response Time = 5 − 0 = 5**
* **Turnaround Time = 30 − 0 = 30**
* **Waiting Time = 30 − 20 = 10**

---

### How do throughput and fairness factor into scheduler design?

**Throughput** বাড়ানোর জন্য সাধারণত **Shortest Job First (SJF)** বা **Shortest Remaining Time First (SRTF)** algorithm ভালো কাজ করে। কারণ এগুলো average waiting time এবং average turnaround time কমিয়ে দেয়। এর ফলে একই সময়ে তুলনামূলক বেশি process সম্পন্ন হতে পারে এবং throughput উন্নত হয়। তবে এর একটি বড় সমস্যা হলো **starvation**—দীর্ঘ burst time-এর বা low-priority process অনেক সময় দীর্ঘক্ষণ CPU না-ও পেতে পারে।

**Fairness** নিশ্চিত করার জন্য **Round Robin (RR)** বা **Aging** ব্যবহার করা হয়। Round Robin-এ প্রতিটি process একটি নির্দিষ্ট **time quantum** পায়, ফলে কোনো process দীর্ঘ সময় CPU থেকে বঞ্চিত হয় না। অন্যদিকে Aging-এ যে process দীর্ঘক্ষণ অপেক্ষা করছে, তার priority ধীরে ধীরে বাড়িয়ে দেওয়া হয়, যাতে starvation না ঘটে।

সবশেষে, scheduler design-এর মূল trade-off হলো **throughput**, **fairness**, এবং **responsiveness**-এর মধ্যে ভারসাম্য (balance) বজায় রাখা। Throughput বাড়াতে গেলে fairness কিছুটা কমতে পারে, আবার সম্পূর্ণ fairness নিশ্চিত করতে গেলে context switching বেড়ে throughput কিছুটা কমে যেতে পারে। তাই modern operating system (যেমন Linux-এর **Completely Fair Scheduler (CFS)**) এই বিষয়গুলোর মধ্যে একটি কার্যকর balance বজায় রেখে কাজ করে।


## ⏸️ 20. What is the difference between preemptive and non-preemptive scheduling?

**Non-preemptive scheduling** — একটি process একবার CPU পেলে, সে নিজে থেকে CPU ছেড়ে না দেওয়া পর্যন্ত (যেমন execution শেষ করা বা I/O wait-এ যাওয়া) Operating System জোর করে CPU কেড়ে নিতে পারে না। অর্থাৎ CPU একবার কোনো process-কে দিলে সেটি স্বেচ্ছায় relinquish না করা পর্যন্ত অন্য কোনো process CPU পায় না।

উপরের diagram-এ দেখো — **P2** t = 2-তে arrive করেছে, কিন্তু **P1** শেষ না হওয়া পর্যন্ত (t = 8) তাকে অপেক্ষা করতে হয়েছে, যদিও **P2**-এর burst time অনেক কম।

---

**Preemptive scheduling** — Operating System প্রয়োজন হলে একটি running process-কে interrupt করে CPU অন্য process-কে দিতে পারে। সাধারণত **timer interrupt**, **উচ্চতর priority-র process arrive করা**, অথবা **time quantum শেষ হয়ে যাওয়া**-র কারণে preemption ঘটে।

দ্বিতীয় timeline-এ দেখো — **P1** চলতে চলতে **P2** arrive করায় **P1**-কে preempt করা হয়েছে। পরে **P3** arrive করায় **P2**-কেও preempt করা হয়েছে। ফলে ছোট বা বেশি priority-সম্পন্ন process-গুলো অনেক আগে execution শেষ করতে পেরেছে।

---

### What are the trade-offs in terms of responsiveness and overhead?

**Responsiveness**

Preemptive scheduling-এ responsiveness অনেক বেশি। কোনো high-priority বা short job এলে সেটি দ্রুত CPU পেতে পারে। এজন্য আধুনিক interactive operating system (যেমন Linux, Windows এবং macOS) preemptive scheduling ব্যবহার করে।

অন্যদিকে, Non-preemptive scheduling-এ একটি বড় process দীর্ঘ সময় CPU দখল করে রাখতে পারে। ফলে ছোট process-গুলোকে অপ্রয়োজনীয়ভাবে অপেক্ষা করতে হয়। এই সমস্যাকে **Convoy Effect** বলা হয়।

---

**Context Switch Overhead**

Preemptive scheduling-এর প্রধান অসুবিধা হলো **ঘন ঘন context switch** হওয়া।

প্রতিটি context switch-এর সময় Operating System-কে বর্তমান process-এর state (যেমন **CPU registers, Program Counter (PC), Stack Pointer (SP)** এবং অন্যান্য execution context) সংরক্ষণ করতে হয় এবং পরবর্তী process-এর state পুনরায় restore করতে হয়। এই কাজ অতিরিক্ত CPU time ও system resource ব্যবহার করে, ফলে scheduling overhead বেড়ে যায়।

অন্যদিকে, Non-preemptive scheduling-এ context switch তুলনামূলক কম হওয়ায় overhead-ও কম হয়।

---

**Race Condition এবং Shared Data**

Preemptive scheduling-এ একটি process যেকোনো সময় interrupt হতে পারে। তাই shared data বা kernel data structure update করার সময় preemption ঘটলে **race condition** বা **data inconsistency** দেখা দিতে পারে।

এই সমস্যা এড়ানোর জন্য Operating System-কে **critical section** সুরক্ষিত রাখতে **lock**, **mutex**, **spinlock**, অথবা প্রয়োজন অনুযায়ী **interrupt disable** করার মতো synchronization mechanism ব্যবহার করতে হয়। ফলে kernel design তুলনামূলকভাবে বেশি জটিল হয়ে যায়।

---

**Real-time System-এ**

Hard real-time system-এ নির্দিষ্ট **deadline** মেনে চলা অত্যন্ত গুরুত্বপূর্ণ। তাই সেখানে preemptive scheduling অপরিহার্য, যাতে জরুরি process প্রয়োজন হলে সঙ্গে সঙ্গে CPU পেতে পারে।

অন্যদিকে, batch processing system-এ responsiveness-এর তুলনায় throughput বেশি গুরুত্বপূর্ণ। তাই কিছু ক্ষেত্রে non-preemptive scheduling উপযুক্ত হতে পারে, কারণ এতে scheduling overhead কম থাকে।

---


## 📊 21. Can you explain the common CPU scheduling algorithms?

**FCFS, SJF, Priority, এবং Round Robin**

প্রতিটি algorithm আলাদাভাবে বুঝতে চারটির Gantt chart পাশাপাশি দেখা সবচেয়ে কার্যকর। ধরো তিনটি process: **P1 (Burst = 6), P2 (Burst = 2), P3 (Burst = 4)** — সবাই **t = 0**-তে arrive করেছে।

**FCFS (First-Come, First-Served)**

Queue-তে যে process আগে আসে, সে-ই আগে CPU পায়। এটি সবচেয়ে সহজ scheduling algorithm এবং implementation-ও সহজ।

তবে যদি একটি বড় job আগে এসে CPU দখল করে, তাহলে ছোট process-গুলোকে দীর্ঘ সময় অপেক্ষা করতে হয়। এই সমস্যাকে **Convoy Effect** বলা হয়। ফলে average waiting time এবং average turnaround time অনেক বেড়ে যেতে পারে।

---

**SJF (Shortest Job First)**

যে process-এর **CPU Burst Time** সবচেয়ে কম, সেটি আগে execution পায়।

এটি **average waiting time** এবং **average turnaround time** সর্বনিম্ন করে—তাই এটি তাত্ত্বিকভাবে (theoretically) সর্বোত্তম scheduling algorithm-গুলোর একটি।

তবে বাস্তবে একটি বড় সমস্যা হলো ভবিষ্যতের CPU burst time আগে থেকে সঠিকভাবে জানা যায় না। এছাড়া দীর্ঘ burst time-এর process দীর্ঘক্ষণ অপেক্ষা করতে পারে, ফলে **starvation** হতে পারে।

---

**Priority Scheduling**

এখানে প্রতিটি process-এর একটি **priority** থাকে। সর্বোচ্চ priority-সম্পন্ন process আগে CPU পায়।

Priority **static** বা **dynamic**—দুই ধরনেরই হতে পারে।

**SJF-কে Priority Scheduling-এর একটি বিশেষ রূপ হিসেবে ধরা যায়**, যেখানে **ছোট burst time-কে উচ্চ priority হিসেবে বিবেচনা করা হয়।**

যদি low-priority process দীর্ঘ সময় CPU না পায়, তাহলে **starvation** দেখা দিতে পারে। এই সমস্যা সমাধানের জন্য সাধারণত **Aging** ব্যবহার করা হয়।

---

**Round Robin (RR)**

প্রতিটি process একটি নির্দিষ্ট **Time Quantum** (যেমন 2 ms) পায়। Quantum শেষ হলে process-টিকে Ready Queue-এর শেষে পাঠিয়ে দেওয়া হয় এবং পরবর্তী process CPU পায়।

Round Robin সবচেয়ে **fair** scheduling algorithm-গুলোর একটি এবং interactive system-এর জন্য অত্যন্ত উপযোগী।

তবে Time Quantum-এর আকার গুরুত্বপূর্ণ।

* **Quantum খুব ছোট হলে** responsiveness বাড়ে, কিন্তু context switching overhead বেড়ে যায়।
* **Quantum খুব বড় হলে** Round Robin ধীরে ধীরে FCFS-এর মতো আচরণ করতে শুরু করে।

---

### What are Multilevel Queue and Multilevel Feedback Queue scheduling, and how do they adapt to process behavior?

এবার দেখা যাক **Multilevel Queue** এবং **Multilevel Feedback Queue** scheduling-এর পার্থক্য।

**Multilevel Queue (MLQ)**

Processes-দের স্থায়ীভাবে (permanently) বিভিন্ন category-তে ভাগ করা হয়, যেমন—

* System Processes
* Interactive Processes
* Batch Processes

প্রতিটি queue নিজস্ব scheduling algorithm ব্যবহার করতে পারে (যেমন একটি queue Round Robin, অন্যটি FCFS)।

সাধারণত উচ্চ priority-র queue খালি না হওয়া পর্যন্ত নিচের queue CPU পায় না।

এর প্রধান অসুবিধা হলো, একটি process একবার যে queue-তে রাখা হয়, পরে সেটি আর অন্য queue-তে যেতে পারে না।

---

**Multilevel Feedback Queue (MLFQ)**

MLFQ আরও উন্নত ও adaptive scheduling algorithm।

এখানে একটি process তার runtime behavior অনুযায়ী এক queue থেকে অন্য queue-তে যেতে পারে।

সাধারণত নতুন process সর্বোচ্চ priority-র queue-তে শুরু করে।

* যদি process পুরো time quantum ব্যবহার করে (CPU-bound behavior), তাহলে সেটিকে নিচের priority queue-তে নামিয়ে দেওয়া হয়।
* যদি process দ্রুত I/O request করে বা quantum শেষ হওয়ার আগেই CPU ছেড়ে দেয় (Interactive/I/O-bound behavior), তাহলে সেটি উচ্চ priority queue-তে থেকেই যায় বা প্রয়োজনে উপরে promote হতে পারে।

এভাবে scheduler process-এর behavior অনুযায়ী নিজেকে adapt করে এবং interactive process-কে দ্রুত response দিতে পারে।

---

### How does "aging" help prevent starvation in priority-based scheduling?

ধরো **P1**-এর priority সবচেয়ে বেশি (সংখ্যায় ১), তাই সে বারবার CPU পাচ্ছে। অন্যদিকে **P3**-এর priority সবচেয়ে কম (সংখ্যায় ৯), তাই সে দীর্ঘ সময় CPU পাচ্ছে না। এই অবস্থাকেই **Starvation** বলা হয়।

**Aging** হলো এই সমস্যার সমাধান।

এখানে একটি process যত বেশি সময় Ready Queue-তে অপেক্ষা করে, তার priority ধীরে ধীরে বাড়িয়ে দেওয়া হয়। উদাহরণস্বরূপ, প্রতি **৩ time unit** অপেক্ষার পর তার priority এক ধাপ বৃদ্ধি করা হতে পারে।

কিছুক্ষণ পরে দেখা যাবে, আগে low-priority হওয়া process-টিও যথেষ্ট priority অর্জন করে CPU পাবে। ফলে কোনো process-কেই অনির্দিষ্টকাল অপেক্ষা করতে হয় না এবং starvation দূর হয়।

MLFQ scheduler-এও Aging-এর ধারণা ব্যবহার করা হয়, যাতে দীর্ঘ সময় নিচের queue-তে থাকা process-গুলো প্রয়োজনে উপরের queue-তে promote হতে পারে।

> **নোট:** Linux-এর বর্তমান **Completely Fair Scheduler (CFS)** সরাসরি MLFQ ব্যবহার করে না। তবে CFS-এর মূল লক্ষ্যও fairness বজায় রাখা এবং কোনো process-কে দীর্ঘ সময় CPU থেকে বঞ্চিত না রাখা। অর্থাৎ উদ্দেশ্যের দিক থেকে MLFQ-এর Aging ধারণার সঙ্গে মিল থাকলেও CFS-এর implementation সম্পূর্ণ ভিন্ন।
