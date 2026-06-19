---
sidebar_position: 14
title: 'Interrupts & Kernel'
---

## ⚡ 14. Interrupt, trap, exception

| Term | Meaning | Example |
|---|---|---|
| Interrupt | hardware async event | keyboard, network packet |
| Trap | intentional software interrupt | system call |
| Exception | CPU detected error | divide by zero, page fault |

### 📞 System call flow

```text
User code calls read()
Library wrapper prepares syscall number
CPU trap to kernel mode
Kernel dispatch table finds handler
Kernel performs operation
Return value copied back
CPU returns to user mode
```

### 🔔 ISR

Interrupt Service Routine hardware interrupt handle করে। ISR ছোট রাখা হয়, heavy কাজ পরে deferred handler/thread করে।

### 📡 Polling vs interrupt-driven I/O

| Method | Idea |
|---|---|
| Polling | CPU বারবার device ready কিনা দেখে |
| Interrupt | device ready হলে CPU-কে notify করে |

### 🚀 DMA

DMA controller device থেকে memory-তে data copy করতে পারে CPU-কে প্রতি byte involve না করে। এতে CPU overhead কমে।

### 🔧 Device driver

Driver kernel আর hardware device-এর মাঝের translation layer।
