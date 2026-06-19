---
sidebar_position: 1
title: 'Operating Systems'
---

# 🖥️ Operating Systems: Interview Questions

---

## 🖥️ 1. Fundamentals of Operating Systems

**📖 1. What is an operating system, and what are its main functions?**
- What is the difference between an OS and the kernel?
- What is the difference between an operating system and a hypervisor?

**🗂️ 2. What are the different types of operating systems?**
- What distinguishes batch, time-sharing, distributed, real-time, and embedded operating systems?
- How does a network OS differ from a distributed OS?

**🧩 3. What is the difference between a monolithic kernel and a microkernel?**
- What is a hybrid kernel, and can you name examples?
- What are the performance and reliability trade-offs between monolithic and microkernel designs?

**🔐 4. What is the difference between user mode and kernel mode?**
- How does the CPU switch between user mode and kernel mode?
- What happens if a user-mode process tries to execute a privileged instruction?

**📞 5. What is a system call, and how does it differ from a regular function call?**
- Can you give examples of common system calls (e.g., fork, read, write, open)?
- What is the system call interface, and how does it relate to APIs like POSIX?

**🔌 6. What happens during the boot process of an operating system?**
- What roles do BIOS/UEFI, the bootloader, and the kernel play during boot?
- What is the difference between a cold boot and a warm boot?

---

## ⚙️ 2. Processes and Process Management

**📦 7. What is a process, and how does it differ from a program?**
- What information is stored in a Process Control Block (PCB)?
- How does the OS keep track of multiple processes?

**🔄 8. What are the different states in the process lifecycle?**
- What transitions exist between new, ready, running, waiting, and terminated states?
- What causes a process to move from "running" to "waiting"?

**🔁 9. What is context switching, and what overhead does it introduce?**
- What information must be saved and restored during a context switch?
- How does the frequency of context switches affect system performance?

**👶 10. What is the difference between fork() and exec()?**
- What happens to memory, file descriptors, and the process ID after a fork()?
- Why are fork() and exec() often used together?

**🧟 11. What are zombie and orphan processes?**
- How does a parent process "reap" a zombie child?
- What happens to an orphan process when its parent terminates first?

**📋 12. What is process scheduling, and what are the roles of the long-term, short-term, and medium-term schedulers?**
- How does the medium-term scheduler relate to swapping?

---

## 🧵 3. Threads and Multithreading

**🧶 13. What is a thread, and how does it differ from a process?**
- What resources are shared between threads of the same process, and what is private to each thread?
- Why is creating a thread generally cheaper than creating a process?

**🏗️ 14. What is the difference between user-level threads and kernel-level threads?**
- What are the advantages and disadvantages of each?
- How does the OS schedule user-level threads versus kernel-level threads?

**🔀 15. What are the multithreading models, and how do they differ?**
- How do the many-to-one, one-to-one, and many-to-many models map user threads to kernel threads?

**🏊 16. What is a thread pool, and why is it used?**
- How does a thread pool help avoid the overhead of repeatedly creating and destroying threads?
- How would you size a thread pool appropriately for CPU-bound vs I/O-bound workloads?

**🐍 17. What is the Global Interpreter Lock (GIL) in Python, and how does it affect multithreading?**
- Why might multiprocessing be preferred over multithreading for CPU-bound tasks in Python?

**⚡ 18. What is the difference between concurrency and parallelism?**
- Can a single-core system exhibit concurrency? Can it exhibit parallelism?

---

## 📅 4. CPU Scheduling

**🎯 19. What are the key goals/criteria of a CPU scheduling algorithm?**
- What is the difference between turnaround time, waiting time, and response time?
- How do throughput and fairness factor into scheduler design?

**⏸️ 20. What is the difference between preemptive and non-preemptive scheduling?**
- What are the trade-offs in terms of responsiveness and overhead?

**📊 21. Can you explain the common CPU scheduling algorithms?**
- How do First-Come-First-Served (FCFS), Shortest Job First (SJF), Priority Scheduling, and Round Robin work?
- What are Multilevel Queue and Multilevel Feedback Queue scheduling, and how do they adapt to process behavior?
- How does "aging" help prevent starvation in priority-based scheduling?

**🚗 22. What is the convoy effect, and which scheduling algorithm is most susceptible to it?**
- How does this relate to the choice between FCFS and other algorithms?

**⏱️ 23. How is the time quantum chosen in Round Robin scheduling, and what happens if it's too small or too large?**
- What is the relationship between time quantum size and context-switch overhead?

**🔄 24. What is priority inversion, and how can it be solved?**
- How does priority inheritance address this problem?

---

## 🔒 5. Process Synchronization

**⚠️ 25. What is a race condition, and how does it occur?**
- Can you give a simple example involving two threads incrementing a shared counter?

**🚪 26. What is a critical section, and what are the requirements for a correct solution to the critical-section problem?**
- What do mutual exclusion, progress, and bounded waiting mean in this context?

**🔑 27. What is the difference between a mutex and a semaphore?**
- What is the difference between a binary semaphore and a counting semaphore?
- What is the difference between a mutex and a spinlock, and when would you use each?

**📺 28. What are monitors, and how do they simplify synchronization compared to raw semaphores?**
- How do condition variables work within a monitor?

**🚧 29. What is a memory barrier (fence), and why is it needed on multi-core systems?**
- How do compiler optimizations and CPU instruction reordering complicate synchronization?

**⚛️ 30. What is an atomic operation, and how is it implemented at the hardware level?**
- What is Compare-And-Swap (CAS), and how is it used to build lock-free data structures?

---

## 🔄 6. Classic Synchronization Problems

**🏭 31. What is the Producer-Consumer (bounded buffer) problem, and how is it solved?**
- Why are both a mutex and counting semaphores typically needed for this problem?
- What happens if the buffer is full and a producer tries to write?

**🍝 32. What is the Dining Philosophers problem, and what concept does it illustrate?**
- How can deadlock be avoided in this problem (e.g., resource ordering, asymmetric solutions)?

**📖 33. What is the Readers-Writers problem, and how do you balance reader and writer priority?**
- What is the difference between a "readers-preference" and "writers-preference" solution?
- How can starvation of writers be avoided?

**💈 34. What is the Sleeping Barber problem, and what synchronization concepts does it demonstrate?**
- How does this problem relate to real-world request-queueing scenarios?

---

## ⚰️ 7. Deadlocks

**🔗 35. What is a deadlock, and what are the four necessary conditions for it to occur (Coffman conditions)?**
- Why must all four conditions hold simultaneously for a deadlock to exist?

**🛡️ 36. What is the difference between deadlock prevention, avoidance, detection, and recovery?**
- Which approach tends to have the highest runtime overhead, and why?

**🏦 37. How does the Banker's algorithm work for deadlock avoidance?**
- What do "safe state" and "unsafe state" mean in this context?
- What information does the algorithm require about each process in advance?

**🗺️ 38. How is a resource allocation graph used to detect deadlocks?**
- How does a cycle in the graph relate to a deadlock when each resource has a single instance vs multiple instances?

**🐌 39. What is the difference between deadlock, livelock, and starvation?**
- Can a system be in livelock without being in deadlock? Give an example.

**🔓 40. What recovery strategies exist once a deadlock is detected?**
- What are the trade-offs of process termination vs resource preemption as recovery strategies?

---

## 🧠 8. Memory Management

**📍 41. What is the difference between a logical (virtual) address and a physical address?**
- What hardware component translates logical addresses to physical addresses?

**🧩 42. What is the difference between internal and external fragmentation?**
- How does compaction help address external fragmentation, and what is its cost?

**📄 43. What is paging, and how does it solve the fragmentation problem?**
- What is a page table, and what kind of information does each page table entry contain?
- What is a multi-level page table, and why is it used for large address spaces?

**✂️ 44. What is segmentation, and how does it differ from paging?**
- What is segmentation with paging, and why might a system use both?

**💱 45. What is swapping, and how does it relate to memory management?**
- How does swapping differ from paging in terms of granularity?

**📦 46. What is the difference between contiguous and non-contiguous memory allocation?**
- What are the advantages of non-contiguous allocation schemes like paging?

---

## 🌐 9. Virtual Memory

**🪟 47. What is virtual memory, and why is it used?**
- How does virtual memory allow processes to use more memory than physically available?
- How does virtual memory provide isolation between processes?

**⚡ 48. What is a Translation Lookaside Buffer (TLB), and how does it speed up address translation?**
- What happens on a TLB miss, and how is the page table consulted afterward?
- What is a TLB flush, and when does it need to happen?

**📥 49. What is demand paging, and how does a page fault work end-to-end?**
- What steps does the OS take when a page fault occurs?

**🔄 50. What are the common page replacement algorithms?**
- How do FIFO, LRU, Optimal, and LFU/MFU page replacement algorithms compare?
- What is Belady's anomaly, and which algorithm is susceptible to it?
- How is LRU approximated in practice (e.g., the clock/second-chance algorithm)?

**💥 51. What is thrashing, and what causes it?**
- How does the working set model help detect and prevent thrashing?

**📋 52. What is copy-on-write, and how is it used during fork()?**
- How does copy-on-write improve the efficiency of process creation?

---

## 📁 10. File Systems

**🗄️ 53. What is a file system, and what are its main responsibilities?**
- What is the difference between a file and a directory from the OS's perspective?

**📂 54. What are the different file allocation methods?**
- How do contiguous, linked, and indexed allocation compare in terms of performance and fragmentation?
- What is a "extent-based" allocation, and how does it relate to contiguous allocation?

**🔖 55. What is an inode, and what information does it store?**
- How does an inode relate to the actual data blocks of a file on disk?

**🔗 56. What is the difference between a hard link and a symbolic (soft) link?**
- What happens to a hard link vs a symbolic link if the original file is deleted?

**📝 57. What is a journaling file system, and how does it improve crash recovery?**
- What is the difference between write-ahead logging and journaling in this context?

**🆓 58. How is free space managed on disk?**
- What are the trade-offs between using a bitmap vs a linked list to track free blocks?

---

## 💾 11. Disk Scheduling and Storage

**💿 59. What are the common disk scheduling algorithms?**
- How do FCFS, SSTF (Shortest Seek Time First), SCAN, C-SCAN, and LOOK differ?
- Which algorithm provides the most uniform wait time, and why?

**📏 60. What metrics are used to evaluate disk scheduling algorithms?**
- What is seek time, rotational latency, and transfer time, and how do they combine to form access time?

**🗃️ 61. What is RAID, and how do the common levels differ?**
- What are the differences between RAID 0, RAID 1, RAID 5, RAID 6, and RAID 10 in terms of redundancy and performance?
- What is the "write penalty" in RAID 5, and why does it occur?

**💽 62. What is the difference between an HDD and an SSD, and how does it affect OS-level design decisions?**
- What is the TRIM command, and why is it relevant for SSDs?
- How does disk scheduling differ (or become less relevant) for SSDs compared to HDDs?

**📤 63. What is I/O scheduling, and how does it relate to disk scheduling at the OS level?**
- How do I/O schedulers (e.g., CFQ, deadline, noop in Linux) differ in their goals?

---

## 📨 12. Inter-Process Communication (IPC)

**💬 64. What is IPC, and why is it needed?**
- What are the main categories of IPC mechanisms (shared memory vs message passing)?

**🔧 65. What are the different IPC mechanisms available in a typical OS?**
- How do pipes, named pipes (FIFOs), message queues, shared memory, and sockets differ?
- What are the trade-offs between shared memory and message passing in terms of speed and complexity?

**🚇 66. What is the difference between a named pipe and an unnamed (anonymous) pipe?**
- Can unrelated processes communicate using an unnamed pipe? Why or why not?

**📡 67. What are signals, and how are they used for IPC?**
- What is the difference between synchronous and asynchronous signal delivery?
- How does a process register a custom signal handler?

**🔌 68. What is a socket, and how does it differ from a pipe in terms of scope?**
- What is the difference between a Unix domain socket and a network (TCP/IP) socket?

---

## 🔐 13. Security, Protection, and Access Control

**🪪 69. What is the difference between authentication and authorization?**
- Can you give an OS-level example of each?

**🛡️ 70. What is the principle of least privilege, and how is it enforced by an operating system?**
- How does running services with minimal required permissions reduce attack surface?

**📋 71. What is the difference between access control lists (ACLs) and capability-based security?**
- How does each approach decide whether a subject can access an object?

**💣 72. What is a buffer overflow attack, and how does the OS help mitigate it?**
- How do Address Space Layout Randomization (ASLR), stack canaries, and Data Execution Prevention (DEP) work?

**🦠 73. What is the difference between a virus, a worm, and a trojan from an OS security perspective?**
- How does the OS's process isolation model limit the damage a compromised process can do?

---

## 🖧 14. System Calls, Interrupts, and Kernel Architecture

**📞 74. How does a system call work end-to-end, from a user program to the kernel and back?**
- What is the role of the system call table/dispatch table?

**⚡ 75. What is the difference between an interrupt, a trap, and an exception?**
- Can you give examples of each (e.g., hardware interrupt, divide-by-zero exception, system call trap)?

**🔔 76. What is an Interrupt Service Routine (ISR), and how does interrupt handling work?**
- What is the difference between maskable and non-maskable interrupts?
- What is an interrupt vector table?

**📡 77. What is the difference between polling and interrupt-driven I/O?**
- What is Direct Memory Access (DMA), and how does it reduce CPU overhead during I/O?

**🔧 78. What is a device driver, and how does it interface with the kernel?**
- What is the difference between a character device and a block device?

---

## 🐳 15. Virtualization and Containers

**🖥️ 79. What is virtualization, and what problem does it solve?**
- What is a hypervisor, and what is its role?

**1️⃣2️⃣ 80. What is the difference between a Type 1 and a Type 2 hypervisor?**
- Can you give examples of each type?

**📦 81. What is the difference between a virtual machine and a container?**
- Why are containers generally more lightweight and faster to start than VMs?

**🔒 82. How do containers achieve isolation using Linux namespaces and cgroups?**
- What types of namespaces exist (PID, network, mount, etc.), and what does each isolate?
- How do cgroups enforce resource limits (CPU, memory) on containers?

**⚙️ 83. What is the difference between full virtualization, paravirtualization, and hardware-assisted virtualization?**
- How does hardware-assisted virtualization (e.g., Intel VT-x, AMD-V) improve performance over software-only virtualization?

---

## 🐧 16. Linux/Unix Specific Concepts

**🚀 84. What happens during the Linux boot process?**
- What are the roles of GRUB, the initramfs, and init/systemd?

**🐚 85. What is the difference between a shell and a kernel?**
- What is the difference between a login shell and a non-login shell?

**📁 86. What does the "everything is a file" philosophy mean in Unix-like systems?**
- How do devices, sockets, and pipes fit into this philosophy?

**🎚️ 87. What is the nice/renice value, and how does it affect scheduling priority?**
- What is the range of nice values, and what do lower vs higher values mean?

**🔗 88. What is the difference between hard links and soft (symbolic) links in a Unix file system, and how is this enforced at the inode level?**
- Can a hard link cross filesystem boundaries? Why or why not?

**🌍 89. How do environment variables and process environments work?**
- How are environment variables inherited by child processes?

---

## ⏱️ 17. Real-Time Operating Systems

**⏰ 90. What is a Real-Time Operating System (RTOS), and how does it differ from a general-purpose OS?**
- What design priorities does an RTOS optimize for compared to a general-purpose OS?

**🔴🟢 91. What is the difference between hard real-time and soft real-time systems?**
- Can you give examples of applications that require hard real-time guarantees?

**📊 92. What scheduling algorithms are commonly used in RTOS environments?**
- How does Rate Monotonic Scheduling (RMS) work, and what assumptions does it make?
- How does Earliest Deadline First (EDF) scheduling differ from RMS?

**🔄 93. What is priority inheritance, and how does it solve priority inversion in real-time systems?**
- Can you describe a scenario where priority inversion would cause a missed deadline without this mechanism?

---

## 🔧 18. Dynamic Memory Allocation

**📦 94. How does dynamic memory allocation work (e.g., malloc/free)?**
- What is the difference between memory allocated on the stack vs the heap?

**📐 95. What are the common memory allocation strategies?**
- How do first-fit, best-fit, and worst-fit allocation strategies compare in terms of speed and fragmentation?

**🤝 96. What is the buddy system, and how does it manage memory allocation?**
- How does the buddy system simplify merging of freed blocks?

**🕳️ 97. What is a memory leak, and how can OS-level or language-level tools help detect them?**
- How does garbage collection differ from manual memory management in addressing leaks?

**🧩 98. What is fragmentation in the context of dynamic memory allocators, and how is it mitigated?**
- How does slab allocation (used in kernel memory management) help reduce fragmentation for frequently allocated object types?