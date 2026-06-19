---
sidebar_position: 7
title: 'Deadlocks'
---

## ⚰️ 7. What is a deadlock?

Deadlock হলো এমন অবস্থা যেখানে processes একে অপরের resource release করার অপেক্ষায় আটকে যায়।

```text
P1 holds A, waits for B
P2 holds B, waits for A
```

### 🔗 Coffman conditions

Deadlock হতে চারটা condition একসাথে থাকতে হয়:

1. Mutual exclusion
2. Hold and wait
3. No preemption
4. Circular wait

### 🛡️ Handling strategies

| Strategy | Idea |
|---|---|
| Prevention | কোনো Coffman condition break করা |
| Avoidance | unsafe allocation avoid করা |
| Detection | deadlock detect করে recover |
| Recovery | process kill বা resource preempt |

### 🏦 Banker's algorithm

Banker's algorithm safe state check করে resource allocate করে। Process maximum need আগে থেকে জানাতে হয়।

```text
Safe state   = এমন sequence আছে যেখানে সবাই eventually finish করতে পারবে
Unsafe state = deadlock guaranteed না, কিন্তু risk আছে
```

### 🐌 Deadlock vs livelock vs starvation

| Term | Meaning |
|---|---|
| Deadlock | সবাই blocked |
| Livelock | সবাই active, কিন্তু progress নেই |
| Starvation | কেউ দীর্ঘসময় resource পাচ্ছে না |
