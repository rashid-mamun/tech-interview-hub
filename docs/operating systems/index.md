---
sidebar_position: 1
title: Operating Systems
---

# Operating Systems Interview Guide

Operating system CPU, memory, storage এবং devices-কে safe abstractions হিসেবে process-এর কাছে উপস্থাপন করে। Backend performance, concurrency এবং container behavior বুঝতে process scheduling থেকে virtual memory পর্যন্ত এই foundation জরুরি।

```mermaid
flowchart LR
    O[OS foundations] --> P[Processes and threads] --> C[Concurrency]
    C --> M[Memory and virtual memory] --> I[Storage and I/O]
    I --> V[Virtualization and containers]
```

## Learning path

1. [OS Fundamentals](./1-os-fundamentals/index.md)
2. [Processes](./2-processes/index.md) and [Threads](./3-threads/index.md)
3. [CPU Scheduling](./4-cpu-scheduling/index.md)
4. [Synchronization](./5-synchronization/index.md) and [Deadlocks](./6-deadlocks/index.md)
5. [Memory Management](./7-memory-management/index.md) and [Virtual Memory](./8-virtual-memory/index.md)
6. [Disk and Storage](./9-disk-storage/index.md)
7. [Virtualization and Containers](./10-virtualization-containers/index.md)
8. [Dynamic Memory Allocation](./11-dynamic-memory-allocation/index.md)

## Interview focus

শুধু definition নয়, state transition ব্যাখ্যা করুন: thread blocked হলে scheduler কী করে, page fault হলে কোন steps ঘটে, lock contention throughput কেন কমায়, deadlock-এর conditions কীভাবে তৈরি হয়, এবং container isolation VM থেকে কীভাবে আলাদা। Diagram বা timeline ব্যবহার করলে concurrency answer আরও নির্ভুল হয়।
