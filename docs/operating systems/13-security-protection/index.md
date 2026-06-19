---
sidebar_position: 13
title: 'Security & Protection'
---

## 🔐 13. Authentication vs authorization

**Authentication** হলো তুমি কে সেটা verify করা। **Authorization** হলো তুমি কী access করতে পারবে সেটা decide করা।

```text
Authentication: login password/SSH key
Authorization: file read/write permission
```

### 🛡️ Least privilege

Process/service যতটুকু permission দরকার শুধু ততটুকুই দেওয়া উচিত।

```text
Web server should not run as root unless necessary
```

এতে compromised process পুরো system damage করতে পারে না।

### 📋 ACL vs capability

| Model | Question |
|---|---|
| ACL | object বলে কে access করতে পারবে |
| Capability | subject token/key নিয়ে access করে |

### 💣 Buffer overflow mitigation

OS/runtime কয়েকভাবে protect করে:

- ASLR: memory address randomize
- Stack canary: return address overwrite detect
- DEP/NX: data memory execute prevent
- Permission/isolation: process damage limit

### 🧱 Process isolation

প্রতিটা process আলাদা virtual address space পায়। এক process direct অন্য process memory access করতে পারে না।
