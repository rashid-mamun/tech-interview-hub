---
sidebar_position: 12
title: 'Inter-Process Communication'
---

## 📨 12. What is IPC?

IPC বা Inter-Process Communication হলো processes-এর মধ্যে data exchange করার mechanism।

### 💬 IPC categories

| Category | Example | Notes |
|---|---|---|
| Shared memory | mmap, shm | fastest, synchronization দরকার |
| Message passing | pipe, queue, socket | simpler isolation |

### 🚇 Pipe

Anonymous pipe related processes-এর মধ্যে common, যেমন parent-child।

```text
Process A stdout -> pipe -> Process B stdin
```

Shell example:

```bash
ls | grep ".md"
```

### 📡 Signals

Signal process-কে async notification দেয়।

```text
SIGINT  -> Ctrl+C
SIGTERM -> graceful terminate request
SIGKILL -> force kill
```

### 🔌 Sockets

Socket same machine বা network across processes communicate করতে পারে।

```text
Unix domain socket -> same machine
TCP/IP socket      -> network
```
