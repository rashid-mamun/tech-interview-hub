---
sidebar_position: 17
title: 'Real-Time OS'
---

## ⏱️ 17. What is an RTOS?

Real-Time Operating System deadline guarantee বা predictable response time optimize করে। General-purpose OS throughput/fairness বেশি optimize করে।

### 🔴 Hard vs soft real-time

| Type | Meaning | Example |
|---|---|---|
| Hard real-time | deadline miss = failure | pacemaker, airbag |
| Soft real-time | deadline miss bad but tolerable | video streaming |

### 📊 RMS and EDF

| Algorithm | Idea |
|---|---|
| RMS | shorter period task gets higher static priority |
| EDF | earliest deadline task runs first |

### 🔄 Priority inversion

RTOS-এ priority inversion deadline miss করাতে পারে। Priority inheritance lock holder-এর priority temporarily boost করে।

```text
High waits for lock held by Low
Low inherits High priority
Low finishes quickly and releases lock
```

### 🎯 RTOS design priorities

- Deterministic scheduling
- Low interrupt latency
- Predictable memory allocation
- Minimal jitter
