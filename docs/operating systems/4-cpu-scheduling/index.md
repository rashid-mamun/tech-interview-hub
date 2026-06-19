---
sidebar_position: 4
title: 'CPU Scheduling'
---

## 📅 4. What is CPU scheduling?

CPU scheduling হলো ready queue থেকে কোন process/thread CPU পাবে সেটা decide করা।

### 🎯 Scheduling metrics

| Metric | Meaning |
|---|---|
| Turnaround time | submit থেকে finish |
| Waiting time | ready queue-তে wait |
| Response time | first response পেতে সময় |
| Throughput | প্রতি unit time কত কাজ complete |
| Fairness | সবাই reasonable chance পাচ্ছে কিনা |

### 📊 Common algorithms

| Algorithm | Idea | Problem |
|---|---|---|
| FCFS | আগে আসলে আগে CPU | convoy effect |
| SJF | shortest job আগে | burst time জানা কঠিন |
| Priority | high priority আগে | starvation |
| Round Robin | fixed time quantum | context-switch overhead |

### ⏱️ Round Robin

```text
Time quantum = 4ms

P1 runs 4ms -> P2 runs 4ms -> P3 runs 4ms -> P1 again
```

Quantum খুব ছোট হলে context switch বেশি হয়। খুব বড় হলে response time খারাপ হয়।

### 🔄 Priority inversion

Low-priority process lock ধরে আছে, high-priority process সেই lock-এর জন্য wait করছে, মাঝখানে medium-priority process CPU নিয়ে নিচ্ছে — এটাকে priority inversion বলে।

Solution: **priority inheritance**। Lock holder temporary high priority পায় যাতে lock দ্রুত release করতে পারে।
