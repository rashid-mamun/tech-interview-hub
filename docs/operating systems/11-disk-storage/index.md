---
sidebar_position: 11
title: 'Disk & Storage'
---

## 💾 11. Disk scheduling and storage

HDD-তে seek time বড় factor, তাই request order performance affect করে।

### 💿 Disk scheduling algorithms

| Algorithm | Idea |
|---|---|
| FCFS | request আসার order |
| SSTF | nearest track first |
| SCAN | elevator মতো এক direction |
| C-SCAN | এক direction, তারপর jump |
| LOOK | request থাকা পর্যন্ত যায় |

### 📏 Access time

```text
Disk access time = seek time + rotational latency + transfer time
```

### 🗃️ RAID levels

| RAID | Idea | Benefit |
|---|---|---|
| RAID 0 | striping | performance, no redundancy |
| RAID 1 | mirroring | redundancy |
| RAID 5 | striping + parity | one disk failure tolerate |
| RAID 6 | double parity | two disk failure tolerate |
| RAID 10 | mirror + stripe | performance + redundancy |

### 💽 HDD vs SSD

HDD mechanical, seek latency important। SSD flash-based, random access much faster। SSD-তে TRIM command OS-কে বলে কোন blocks আর দরকার নেই।
