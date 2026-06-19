---
sidebar_position: 16
title: 'Linux/Unix Concepts'
---

## 🐧 16. Linux/Unix specific concepts

### 🐚 Shell vs kernel

```text
Shell  = user command interpreter
Kernel = OS core, hardware/resource manager
```

Shell command নেয়, system call বা program execution-এর মাধ্যমে kernel service ব্যবহার করে।

### 📁 Everything is a file

Unix-like system-এ many resources file-like interface দিয়ে expose হয়:

```text
regular files
directories
devices: /dev/sda
pipes
sockets
proc info: /proc
```

### 🎚️ nice/renice

Nice value scheduling priority influence করে।

```text
Lower nice  -> higher priority
Higher nice -> lower priority
```

Linux nice range generally `-20` to `19`।

### 🔗 Hard and soft link

Hard link same inode-এর আরেক name। Symbolic link path reference করে।

### 🌍 Environment variables

Process environment হলো key-value list। Child process parent থেকে environment inherit করে।

```bash
export NODE_ENV=production
echo $NODE_ENV
```
