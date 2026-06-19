---
sidebar_position: 6
title: 'Classic Sync Problems'
---

## 🔄 6. Producer-Consumer problem

Producer buffer-এ item রাখে, consumer item নেয়। Buffer bounded হলে full/empty condition handle করতে হয়।

```text
Producer -> [ bounded buffer ] -> Consumer
```

Need:

- `mutex` for buffer access
- `empty` semaphore for free slots
- `full` semaphore for available items

### 🏭 Flow

```text
Producer:
wait(empty)
lock(mutex)
add item
unlock(mutex)
signal(full)

Consumer:
wait(full)
lock(mutex)
remove item
unlock(mutex)
signal(empty)
```

## 📖 Readers-Writers problem

Multiple reader একসাথে read করতে পারে, কিন্তু writer exclusive access চাই।

```text
Many readers allowed
Writer needs no reader + no writer
```

Reader preference দিলে writer starvation হতে পারে। Writer preference দিলে readers wait করতে পারে।

## 🍝 Dining Philosophers

Deadlock illustrate করার classic problem। প্রত্যেক philosopher দুই fork চাইলে circular wait হতে পারে।

Avoid:

- Resource ordering
- এক philosopher reverse order নেয়
- At most `n - 1` philosopher একসাথে বসতে দেওয়া
