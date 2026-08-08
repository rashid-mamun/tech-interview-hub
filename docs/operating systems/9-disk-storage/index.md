---
sidebar_position: 9
title: 'Disk & Storage'
---


## 💿 37. What are the common disk scheduling algorithms?

**Disk scheduling** হলো OS-এর সেই policy যার মাধ্যমে pending disk I/O request-গুলোর মধ্যে কোন request আগে service হবে তা ঠিক করা হয়।

Traditional HDD-তে disk head-কে platter-এর track-এর উপর move করতে হয়। তাই request order ভালো না হলে seek time অনেক বেড়ে যায়। Disk scheduling-এর লক্ষ্য হলো:

* seek movement কমানো
* average waiting time কমানো
* throughput বাড়ানো
* starvation avoid করা
* fairness বজায় রাখা

> **Note:** Disk scheduling মূলত HDD-এর mechanical seek cost-এর কারণে গুরুত্বপূর্ণ ছিল। SSD/NVMe storage-এ seek time নেই, তাই scheduling goal অনেকটা বদলে যায়।

Modern HDD controller logical block address (LBA)-কে physical geometry-তে map ও internally reorder করতে পারে। তাই FCFS/SSTF/SCAN examples মূলত classical OS model বোঝায়; real device behavior firmware ও queueing stack-এর ওপরও নির্ভর করে।

---

### How do FCFS, SSTF, SCAN, C-SCAN, and LOOK differ?

ধরা যাক disk head বর্তমানে cylinder `50`-এ আছে, আর pending requests:

```text
98, 183, 37, 122, 14, 124, 65, 67
```

প্রতিটি algorithm request order আলাদাভাবে সাজাবে।

---

#### FCFS (First-Come, First-Served)

Request যে order-এ আসে, সেই order-এ service করা হয়।

**সুবিধা**

* সহজ
* fair, কারণ arrival order respect করে
* starvation নেই

**অসুবিধা**

* disk head অনেক দূর দূর jump করতে পারে
* average seek time বেশি হতে পারে

FCFS queue-এর মতো:

```text
50 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67
```

---

#### SSTF (Shortest Seek Time First)

বর্তমান head position থেকে যে request সবচেয়ে কাছে, সেটি আগে service করা হয়।

**সুবিধা**

* average seek distance অনেক কমাতে পারে
* FCFS-এর চেয়ে সাধারণত better throughput

**অসুবিধা**

* starvation হতে পারে
* দূরের request দীর্ঘ সময় অপেক্ষা করতে পারে যদি কাছাকাছি request বারবার আসে

---

#### SCAN

Disk head একদিকে move করতে থাকে এবং পথে যে requests পায় সেগুলো service করে। Disk-এর এক প্রান্তে পৌঁছালে direction reverse করে।

এটাকে elevator algorithm-ও বলা হয়।

Example idea:

```text
Head moves upward: 50 → 65 → 67 → 98 → 122 → 124 → 183 → end
Then reverses:     end → 37 → 14
```

**সুবিধা**

* starvation কম
* request distribution ভালো হলে performance stable

**অসুবিধা**

* disk edge-এর কাছাকাছি request wait pattern আলাদা হতে পারে
* সবসময় actual last request পর্যন্ত না গিয়ে physical end পর্যন্ত গেলে extra movement হতে পারে

---

#### C-SCAN (Circular SCAN)

SCAN-এর মতো একদিকেই service করে। কিন্তু শেষ প্রান্তে পৌঁছানোর পর reverse direction-এ service না করে head আবার শুরু প্রান্তে ফিরে যায় এবং একই direction-এ service চালায়।

Example idea:

```text
50 → 65 → 67 → 98 → 122 → 124 → 183 → end
jump back to start
start → 14 → 37
```

**সুবিধা**

* অপেক্ষার সময় বেশি uniform
* request service এক directional sweep হিসেবে predictable

**অসুবিধা**

* jump-back movement service দেয় না
* total movement কিছু ক্ষেত্রে বেশি হতে পারে

---

#### LOOK

LOOK হলো SCAN-এর optimized version। Head physical disk end পর্যন্ত না গিয়ে current direction-এর শেষ pending request পর্যন্ত যায়, তারপর direction reverse করে।

Example:

```text
50 → 65 → 67 → 98 → 122 → 124 → 183
reverse
183 → 37 → 14
```

**সুবিধা**

* unnecessary movement কম
* SCAN-এর তুলনায় efficient হতে পারে

---

#### C-LOOK

C-LOOK হলো C-SCAN-এর optimized version। Head physical end পর্যন্ত না গিয়ে current direction-এর last pending request পর্যন্ত যায়, তারপর lowest pending request-এ jump করে।

---

### Comparison Table

| Algorithm | Main idea | Strength | Weakness |
| --------- | --------- | -------- | -------- |
| FCFS | arrival order | simple, fair | high seek movement |
| SSTF | nearest request first | low average seek | starvation possible |
| SCAN | sweep both directions | good balance | edge behavior uneven |
| C-SCAN | one-direction circular sweep | uniform wait time | jump overhead |
| LOOK | SCAN but only up to last request | less movement than SCAN | direction-dependent wait |
| C-LOOK | C-SCAN but only pending range | uniform + less movement | jump still exists |

---

### Which algorithm provides the most uniform wait time, and why?

**C-SCAN** সাধারণত বেশি uniform wait time দেয়।

কারণ C-SCAN disk head-কে একদিকে service করায় এবং end-এ পৌঁছে আবার beginning-এ ফিরে আসে। এতে সব request এক circular order-এ service পায়। SCAN-এর মতো direction reverse করার কারণে মাঝের cylinder বারবার তুলনামূলক সুবিধা পায় না।

তাই C-SCAN fairness ও predictable wait time-এর জন্য ভালো, যদিও total head movement সবসময় minimum হয় না।

---

## 📏 38. What metrics are used to evaluate disk scheduling algorithms?

Disk scheduling evaluate করার জন্য কয়েকটি common metric ব্যবহার করা হয়।

**1. Seek Time**

Disk head-কে target track/cylinder-এ move করতে যে সময় লাগে।

HDD performance-এ seek time বড় factor, কারণ এটি mechanical movement-এর উপর নির্ভর করে।

---

**2. Rotational Latency**

Head target track-এ পৌঁছানোর পরে target sector head-এর নিচে আসতে platter ঘুরে যে সময় লাগে।

Average rotational latency সাধারণত এক rotation time-এর প্রায় অর্ধেক।

---

**3. Transfer Time**

Data actual read/write করতে যে সময় লাগে।

এটি depend করে:

* data size
* disk bandwidth
* controller speed
* storage medium

---

**4. Waiting / Queue Time**

Request queue-তে অপেক্ষা করে যত সময় কাটায়।

High load system-এ queue time অনেক বড় হতে পারে।

---

**5. Throughput**

প্রতি unit time-এ কতগুলো I/O request complete হলো।

---

**6. Fairness / Starvation**

কোনো request বা process অনির্দিষ্টকাল wait করছে কি না।

---

### What is seek time, rotational latency, and transfer time, and how do they combine to form access time?

Traditional HDD-এর device service/access time roughly:

```text
Device Service Time ≈ Seek Time + Rotational Latency + Transfer Time + Controller Overhead
Total I/O Response Time ≈ Queue Time + Device Service Time
```

**Example**

```text
Seek time          = 5 ms
Rotational latency = 4 ms
Transfer time      = 1 ms

Device service time ≈ 10 ms
```

Disk scheduling mainly seek time এবং queue behavior optimize করার চেষ্টা করে। Rotational latency কিছু advanced disk/controller level scheduling দিয়ে কমানো যেতে পারে, তবে OS-level classical algorithms সাধারণত seek movement focus করে।

> **SSD note:** SSD-তে mechanical seek বা rotational latency নেই। তাই HDD-style seek optimization SSD-তে ততটা গুরুত্বপূর্ণ নয়।

---

## 🗃️ 39. What is RAID, and how do the common levels differ?

**RAID (Redundant Array of Independent Disks)** হলো একাধিক physical disk-কে একসাথে ব্যবহার করে performance, redundancy, capacity বা availability improve করার technique।

RAID hardware controller, software RAID, বা OS/storage layer দিয়ে implement করা যেতে পারে।

RAID-এর তিনটি core idea:

* **Striping** — data একাধিক disk-এ ভাগ করে রাখা
* **Mirroring** — একই data একাধিক disk-এ copy রাখা
* **Parity** — failure হলে missing data reconstruct করার জন্য calculated redundancy রাখা

---

### What are the differences between RAID 0, RAID 1, RAID 5, RAID 6, and RAID 10?

#### RAID 0: Striping only

Data multiple disk-এ stripe করে ছড়িয়ে রাখা হয়।

**সুবিধা**

* high read/write performance
* full usable capacity

**অসুবিধা**

* redundancy নেই
* একটি disk fail করলেই পুরো array fail

Minimum disks: `2`

---

#### RAID 1: Mirroring

একই data mirror set-এর দুই বা ততোধিক disk-এ copy রাখা হয়।

**সুবিধা**

* ভালো redundancy
* read performance improve হতে পারে

**অসুবিধা**

* common two-way mirror-এ usable capacity 50%; `k`-way mirror-এ raw capacity-এর প্রায় `1/k`
* write একই data mirror-এ লিখতে হয়

Minimum disks: `2`

---

#### RAID 5: Striping with distributed parity

Data এবং parity multiple disk-এ distributed থাকে। একটি disk fail করলে parity ব্যবহার করে data reconstruct করা যায়।

**সুবিধা**

* capacity efficiency RAID 1-এর চেয়ে ভালো
* single disk failure tolerate করতে পারে

**অসুবিধা**

* write penalty আছে
* rebuild time দীর্ঘ হতে পারে
* rebuild চলাকালে আরেকটি disk fail করলে data loss

Minimum disks: `3`

---

#### RAID 6: Striping with double distributed parity

RAID 5-এর মতো, কিন্তু দুটি independent parity রাখা হয়।

**সুবিধা**

* দুইটি disk failure tolerate করতে পারে
* large disk array-তে safer than RAID 5

**অসুবিধা**

* write penalty RAID 5-এর চেয়েও বেশি
* usable capacity কম

Minimum disks: `4`

---

#### RAID 10: Mirroring + Striping

RAID 1 mirrors-এর উপর RAID 0 striping। অর্থাৎ mirrored pairs বানিয়ে সেগুলোর উপর stripe করা হয়।

**সুবিধা**

* high performance
* ভালো redundancy
* rebuild সাধারণত RAID 5/6-এর চেয়ে সহজ/দ্রুত

**অসুবিধা**

* usable capacity সাধারণত 50%
* minimum disk বেশি লাগে

Minimum disks: `4`

---

### RAID Comparison

| RAID Level | Technique | Minimum disks | Fault tolerance | Usable capacity | Write performance |
| ---------- | --------- | ------------- | --------------- | --------------- | ----------------- |
| RAID 0 | Striping | 2 | none | 100% | very good |
| RAID 1 | Mirroring | 2 | mirror set-এ অন্তত 1 healthy copy থাকলে data available | 2-way-এ ~50% | moderate |
| RAID 5 | Striping + single parity | 3 | 1 disk | `(N-1)` disks | write penalty |
| RAID 6 | Striping + double parity | 4 | 2 disks | `(N-2)` disks | higher write penalty |
| RAID 10 | Stripe of mirrors | 4 | depends on which disks fail | ~50% | very good |

> **Important:** RAID improves availability, but it is **not a backup**. Accidental deletion, corruption, ransomware, or site failure can still destroy data.

---

### What is the "write penalty" in RAID 5, and why does it occur?

RAID 5 small write করতে গেলে শুধু new data লিখলেই হয় না; parity-ও update করতে হয়।

Classic small-write read-modify-write flow:

1. old data read
2. old parity read
3. new parity calculate
4. new data write
5. new parity write

অর্থাৎ parity calculation ছাড়াও সাধারণত **4টি backend I/O** লাগে: 2 read + 2 write। এটিই classic **RAID 5 small-write penalty**। Full-stripe write করলে পুরোনো data/parity read এড়ানো যেতে পারে, তাই penalty workload ও controller implementation-এর ওপর নির্ভর করে।

RAID 6-এ দুটি parity update করতে হওয়ায় small-write penalty সাধারণত আরও বেশি।

---

## 💽 40. What is the difference between an HDD and an SSD, and how does it affect OS-level design decisions?

**HDD (Hard Disk Drive)** mechanical storage device। এর মধ্যে spinning platter এবং moving head থাকে।

**SSD (Solid State Drive)** flash memory-based storage। এতে moving mechanical part নেই।

---

### HDD vs SSD

| বিষয় | HDD | SSD |
| ----- | --- | --- |
| Mechanism | spinning platter + moving head | NAND flash memory |
| Seek time | আছে, mechanical | practically নেই |
| Rotational latency | আছে | নেই |
| Random I/O | তুলনামূলক slow | অনেক দ্রুত |
| Sequential I/O | ভালো হতে পারে | খুব দ্রুত |
| Wear | mechanical wear | write/erase cycle limit |
| OS scheduling focus | seek optimization | queueing, parallelism, wear/TRIM awareness |

---

### OS-level design impact

**HDD-এর জন্য**

* request reorder করে seek time কমানো useful
* sequential access performance বেশি predictable
* SCAN/C-SCAN/LOOK ধরনের algorithm historically important

**SSD-এর জন্য**

* mechanical seek নেই, তাই HDD-style disk arm scheduling কম relevant
* SSD internal parallelism exploit করতে queue depth গুরুত্বপূর্ণ
* write amplification, erase blocks, garbage collection consideration থাকে
* TRIM/discard support দরকার

---

### What is the TRIM command, and why is it relevant for SSDs?

**TRIM/discard** হলো এমন একটি interface যার মাধ্যমে OS storage device-কে জানায় কোন logical blocks আর ব্যবহার হচ্ছে না। ATA-তে command-টি TRIM, SCSI-তে UNMAP এবং NVMe-তে deallocate semantics দিয়ে একই ধারণা প্রকাশ করা হয়।

যখন user কোনো file delete করে, OS file system metadata update করে। কিন্তু SSD নিজে না-ও জানতে পারে যে সেই old data blocks আর দরকার নেই। TRIM SSD-কে বলে:

> এই blocks আর valid data হিসেবে রাখতে হবে না।

এর ফলে SSD:

* garbage collection ভালোভাবে করতে পারে
* future write performance ভালো রাখতে পারে
* write amplification কমাতে পারে
* erase block management efficient করতে পারে

TRIM না থাকলে SSD অনেক stale data valid মনে করে ধরে রাখতে পারে, ফলে write performance degrade হতে পারে।

---

### How does disk scheduling differ for SSDs compared to HDDs?

SSD-তে seek time ও rotational latency নেই, তাই request reorder করার goal HDD-এর মতো head movement কমানো নয়।

SSD scheduling focus করে:

* fairness
* latency control
* queue depth management
* parallel NAND channels utilize করা
* workload ও discard/write pattern-এর মাধ্যমে device-side write amplification বা garbage-collection pressure পরোক্ষভাবে কমানো
* priority/class-based I/O control

NVMe SSD-তে multiple hardware queues থাকে। তাই modern OS I/O scheduling অনেক ক্ষেত্রে multi-queue block layer, latency target, and device parallelism-এর সাথে কাজ করে।

---

## 📤 41. What is I/O scheduling, and how does it relate to disk scheduling at the OS level?

**I/O scheduling** হলো OS block layer-এর policy, যা storage device-এ যাওয়ার আগে pending I/O requests organize করে।

Disk scheduling ঐতিহাসিকভাবে HDD head movement optimize করার দিকে focus করত। I/O scheduling broader concept:

* request merge করা
* reorder করা
* latency guarantee দেওয়া
* fairness maintain করা
* priority handle করা
* device queue efficiently fill করা

---

### How do I/O schedulers differ in their goals?

Linux-এর legacy single-queue schedulers:

**NOOP (legacy)**

Minimal scheduling। Request mostly FIFO order-এ পাঠায়, কিছু merging করতে পারে।

Useful when:

* device নিজেই scheduling করে
* SSD/flash storage
* virtualization layer-এর নিচে আরেক scheduler আছে

---

**Deadline (legacy)**

Request starvation avoid করতে read/write request-এর deadline maintain করে। Goal হলো কোনো request যেন খুব বেশি delay না হয়।

Useful when:

* latency important
* read starvation avoid করতে হবে

---

**CFQ (legacy Completely Fair Queuing)**

Process/thread অনুযায়ী I/O queue ভাগ করে fairness দিতে চেষ্টা করে।

Useful historically for:

* multi-user desktop/server workloads
* per-process fairness

> **Modern note:** Linux blk-mq block layer-এ available scheduler device/configuration অনুযায়ী `mq-deadline`, `kyber`, `bfq`, বা `none` হতে পারে। Legacy `noop` আর modern `none` conceptually minimal হলেও একই implementation নয়; একইভাবে legacy `deadline` ও `mq-deadline` আলাদা implementation generation।

---

### Summary

| Scheduler | Main goal | Best fit |
| --------- | --------- | -------- |
| none | no elevator / minimal block-layer scheduling | fast device, virtualized storage, smart controller |
| mq-deadline | starvation control and latency-oriented ordering | general-purpose latency-sensitive I/O |
| CFQ (legacy) | per-process fairness | older single-queue Linux workloads |
| BFQ | interactive responsiveness/fairness | desktop/interactive workloads |
| Kyber | latency control on fast devices | fast SSD/NVMe workloads |

Disk scheduling is about **which request next**. Modern I/O scheduling is also about **latency, fairness, queueing, merging, and device parallelism**.
