---
sidebar_position: 15
title: 'Virtualization & Containers'
---

## 🐳 15. Virtualization and containers

Virtualization hardware abstract করে multiple OS চালাতে দেয়। Container same kernel share করে isolated user-space environment দেয়।

### 📦 VM vs Container

| Topic | VM | Container |
|---|---|---|
| Kernel | each VM own kernel | host kernel share |
| Startup | slower | faster |
| Isolation | stronger | namespace/cgroup based |
| Size | large | lightweight |

### 🖥️ Hypervisor

Hypervisor virtual machines manage করে।

```text
Type 1: bare-metal, e.g. ESXi, Hyper-V
Type 2: host OS-এর উপর, e.g. VirtualBox
```

### 🔒 Linux namespaces

Namespace container isolation দেয়:

- PID namespace: process IDs
- Network namespace: network stack
- Mount namespace: filesystem mount view
- UTS namespace: hostname
- IPC namespace: IPC resources
- User namespace: user/group mapping

### 🎚️ cgroups

cgroups resource limit করে:

```text
CPU quota
Memory limit
Block I/O limit
Process count
```
