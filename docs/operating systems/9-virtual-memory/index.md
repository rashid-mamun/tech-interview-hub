---
sidebar_position: 9
title: 'Virtual Memory'
---

## 🌐 9. What is virtual memory?

Virtual memory process-কে illusion দেয় যে তার নিজস্ব continuous memory আছে। এতে isolation, protection, এবং physical RAM-এর চেয়ে বড় address space পাওয়া যায়।

### ⚡ TLB

TLB হলো address translation cache।

```text
Virtual page -> TLB hit -> frame quickly
Virtual page -> TLB miss -> page table walk
```

TLB miss হলে page table consult করতে হয়, তাই slower।

### 📥 Page fault

যে page RAM-এ নেই সেটায় access করলে page fault হয়।

```text
Access page -> not in RAM -> trap to OS
OS finds page on disk
Free frame choose
Disk থেকে page load
Page table update
Instruction retry
```

### 🔄 Page replacement algorithms

| Algorithm | Idea |
|---|---|
| FIFO | সবচেয়ে পুরোনো page replace |
| LRU | least recently used replace |
| Optimal | future-এ সবচেয়ে পরে লাগবে এমন page replace |
| Clock | LRU approximation |

### 💥 Thrashing

Working set RAM-এর চেয়ে বড় হলে system mostly page swap করে, actual work কম হয়। এটাকে thrashing বলে।

Solution:

- More RAM
- Reduce multiprogramming
- Working set based allocation
