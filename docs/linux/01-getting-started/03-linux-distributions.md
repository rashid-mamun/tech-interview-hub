---
sidebar_position: 3
title: 'Distributions'
---

## 1. What is a Linux distribution?

Linux distribution বা **distro** হলো Linux kernel-এর সঙ্গে system utility, package manager, default configuration এবং software repository মিলিয়ে তৈরি একটি complete operating-system environment। একই Linux kernel family ব্যবহার করলেও distribution-গুলোর release model, package format, support lifecycle এবং target use case আলাদা হতে পারে।

### What are the popular Linux distributions?

| Distribution | Typical use and characteristics |
|---|---|
| **Ubuntu** | Beginner-friendly; desktop, server, cloud VM এবং development environment-এ ব্যাপকভাবে ব্যবহৃত হয়। |
| **CentOS** | Original CentOS Linux discontinued। AlmaLinux ও Rocky Linux common RHEL-compatible replacement, আর CentOS Stream RHEL-এর আগের development stream অনুসরণ করে। |
| **Debian** | Stability এবং বড় package repository-এর জন্য পরিচিত; Ubuntu-সহ অনেক distribution-এর base। |
| **Fedora** | Fast-moving distribution; অনেক নতুন technology পরে Red Hat Enterprise Linux-এ যায়। |
| **Arch Linux** | Lightweight rolling-release distribution; advanced customization ও user control-এর জন্য পরিচিত। |
| **Kali Linux** | Authorized cybersecurity, penetration testing এবং security research-এর জন্য তৈরি। |
| **Alpine Linux** | Small ও security-focused distribution; minimal container image-এ বহুল ব্যবহৃত। |

### How do distributions differ from one another?

Distribution-গুলোর প্রধান পার্থক্য:

- **Package manager:** Ubuntu/Debian-এ APT, Fedora/RHEL family-তে DNF, Arch-এ Pacman এবং OpenSUSE-এ Zypper।
- **Release model:** Fixed release predictable version দেয়; rolling release নিয়মিত নতুন package সরবরাহ করে।
- **Support lifecycle:** Enterprise distribution দীর্ঘমেয়াদি security update ও vendor support দিতে পারে।
- **Default software:** Desktop environment, init system, filesystem tool এবং security policy আলাদা হতে পারে।
- **Target audience:** Beginner desktop, production server, container, security testing অথবা advanced customization—প্রতিটির focus ভিন্ন।

### How should you choose a distribution?

- Broad documentation ও beginner-friendly server administration-এর জন্য **Ubuntu বা Debian**।
- Red Hat ecosystem-এর জন্য **Fedora, AlmaLinux, Rocky Linux বা RHEL**।
- Highly customizable rolling-release system-এর জন্য **Arch Linux**।
- Authorized security testing-এর জন্য **Kali Linux**; general production server হিসেবে নয়।
- Minimal container image-এর জন্য **Alpine Linux**, তবে এর musl-based environment ও package compatibility আগে যাচাই করা উচিত।

Selection-এর সময় শুধু popularity নয়—application compatibility, support period, security updates, team experience এবং deployment environment বিবেচনা করতে হয়।

### Where can you read the Linux kernel source?

- [Linux Kernel source](https://git.kernel.org/)
- [Linux Kernel mirror on GitHub](https://github.com/torvalds/linux)

:::tip Interview summary
Linux নিজে kernel; distribution সেই kernel-এর সঙ্গে package manager, utilities, repositories এবং defaults যোগ করে usable operating system তৈরি করে।
:::

