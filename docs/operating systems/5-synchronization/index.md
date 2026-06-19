---
sidebar_position: 5
title: 'Synchronization'
---

## 🔒 5. What is a race condition?

Race condition হয় যখন multiple thread shared data একই সময়ে access/update করে এবং final result timing-এর উপর depend করে।

### ⚠️ Shared counter problem

```cpp
int counter = 0;

void increment() {
    counter++; // read -> add -> write, atomic না
}
```

দুই thread একই সময়ে `counter++` করলে update lost হতে পারে।

### 🚪 Critical section

Shared resource access করা code block critical section।

Correct solution-এর দরকার:

- Mutual exclusion
- Progress
- Bounded waiting

### 🔑 Mutex example

```cpp
#include <bits/stdc++.h>
using namespace std;

int counter = 0;
mutex m;

void increment() {
    lock_guard<mutex> lock(m);
    counter++;
}
```

### 🚦 Mutex vs Semaphore

| Topic | Mutex | Semaphore |
|---|---|---|
| Ownership | lock owner unlock করে | signal অন্য thread দিতে পারে |
| Count | usually 1 | binary/counting |
| Use | critical section protect | resource count manage |

### ⚛️ Atomic operation

Atomic operation indivisible। Hardware level-এ CAS বা lock-prefixed instruction দিয়ে implement হতে পারে।

```cpp
atomic<int> safeCounter = 0;
safeCounter++;
```
