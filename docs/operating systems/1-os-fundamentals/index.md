---
sidebar_position: 1
title: 'OS Fundamentals'
---

## 🖥️ 1. What is an operating system?

Operating System হলো software layer যা hardware resource manage করে এবং application-কে safe, consistent interface দেয়।

### 🧩 Main functions

| Function | কাজ |
|---|---|
| Process management | process create, schedule, terminate |
| Memory management | RAM allocate, virtual memory |
| File system | file/directory manage |
| Device management | driver দিয়ে hardware access |
| Security | permission, isolation |

### 🧠 OS vs Kernel

```text
OS     = kernel + utilities + services + UI/tools
Kernel = core privileged part, hardware/resource manager
```

### 🔐 User mode vs kernel mode

User application direct hardware access করতে পারে না। Sensitive operation করতে system call লাগে।

```text
User mode app
   ↓ system call trap
Kernel mode
   ↓ hardware operation
Return to user mode
```

### 📞 System call vs normal function

Normal function same user process-এর ভিতর call হয়। System call CPU mode switch করে kernel-এ যায়, তাই overhead বেশি।

Common system calls:

```text
open(), read(), write(), close()
fork(), exec(), wait()
socket(), bind(), listen()
```

### 🔌 Boot process

```text
Power on -> BIOS/UEFI -> Bootloader -> Kernel load -> init/systemd -> services
```

Bootloader kernel memory-তে load করে, kernel hardware initialize করে, তারপর first user-space process চালু হয়।
