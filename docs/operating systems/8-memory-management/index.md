---
sidebar_position: 8
title: 'Memory Management'
---

## 🧠 8. What is memory management?

Memory management হলো RAM allocate, protect, translate এবং reclaim করার OS কাজ।

### 📍 Logical vs physical address

```text
Logical/Virtual address -> MMU -> Physical address
```

Process virtual address দেখে। MMU page table ব্যবহার করে physical RAM address বের করে।

### 🧩 Fragmentation

| Type | Meaning |
|---|---|
| Internal fragmentation | allocated block-এর ভিতরে unused space |
| External fragmentation | free memory আছে, কিন্তু contiguous না |

### 📄 Paging

Paging-এ virtual memory fixed-size **page**, physical memory fixed-size **frame**।

```text
Virtual page 5 -> Page table -> Physical frame 12
```

Paging external fragmentation কমায়, কিন্তু page table overhead থাকে।

### ✂️ Segmentation

Segmentation logical units অনুযায়ী memory ভাগ করে:

```text
code segment
data segment
stack segment
heap segment
```

Segmentation user/programmer view-এর সাথে natural, কিন্তু external fragmentation হতে পারে।

### 💱 Swapping

Swapping-এ পুরো process বা memory portion disk-এ move করে RAM free করা হয়। Disk slow, তাই excessive swapping performance খারাপ করে।
