---
sidebar_position: 18
title: 'Dynamic Memory Allocation'
---

## 🔧 18. How does dynamic memory allocation work?

Dynamic memory allocation runtime-এ heap থেকে memory নেয়।

```c
int* arr = malloc(10 * sizeof(int));
free(arr);
```

C++-এ:

```cpp
int* arr = new int[10];
delete[] arr;
```

### 📦 Stack vs heap

| Topic | Stack | Heap |
|---|---|---|
| Lifetime | function scope | manual/GC managed |
| Speed | fast | relatively slower |
| Size | limited | larger |
| Use | local variables | dynamic objects |

### 📐 Allocation strategies

| Strategy | Idea |
|---|---|
| First-fit | first suitable free block |
| Best-fit | smallest suitable block |
| Worst-fit | largest block split |

### 🤝 Buddy system

Buddy system memory power-of-two blocks-এ ভাগ করে। Free করলে buddy block free থাকলে merge করা সহজ।

### 🕳️ Memory leak

Memory allocate করে release না করলে leak হয়।

```cpp
void leak() {
    int* x = new int[100];
    // delete[] x missing
}
```

Modern C++-এ `unique_ptr`, `vector`, RAII use করলে leak কমে।

### 🧩 Fragmentation

Allocator অনেক ছোট-বড় allocation/free করলে heap fragmented হতে পারে। Slab allocator same-size object efficiently manage করে fragmentation কমায়।
