---
title: 'Filesystem'
---

## 1. How is the Linux filesystem organized?

Linux filesystem একটি single directory tree, যার root হলো `/`। Windows-এর মতো প্রতিটি disk-কে আলাদা drive letter না দিয়ে disk, partition, removable media এবং virtual kernel interface এই tree-এর নির্দিষ্ট directory-তে attach বা **mount** করা হয়।

### Why do some top-level directories point to `/usr`?

অনেক modern distribution-এ traditional top-level directory আসলে `/usr`-এর ভেতরের directory-র symbolic link। Distribution অনুযায়ী exact layout ভিন্ন হতে পারে।

| Directory | Description |
|-----------|-------------|
| `/sbin -> /usr/sbin` | Administrative command-এর system binary; `/usr/sbin`-এর সঙ্গে linked। |
| `/bin -> /usr/bin` | Essential user binary; `/usr/bin`-এর সঙ্গে linked। |
| `/lib -> /usr/lib` | Shared library ও kernel module; `/usr/lib`-এর সঙ্গে linked। |

### What are the important system directories?

| Directory | Description |
|-----------|-------------|
| `/boot` | System boot করার জন্য প্রয়োজনীয় file রাখে; container-এ সাধারণত relevant নয়। |
| `/usr` | অধিকাংশ application, utility ও library রাখে। |
| `/var` | Log, cache এবং frequently changing data রাখে। |
| `/etc` | System-wide configuration file রাখে। |

### Where are user and application files stored?

| Directory | Description |
|-----------|-------------|
| `/home` | Regular user-এর home directory-গুলোর default location। |
| `/opt` | Optional third-party software install করার convention। |
| `/srv` | Web server-এর মতো service-এর data রাখতে পারে; container-এ তুলনামূলক কম ব্যবহৃত। |
| `/root` | `root` user-এর home directory। |

### What are temporary, runtime, and virtual directories?

| Directory | Description |
|-----------|-------------|
| `/tmp` | Temporary file রাখে; reboot বা cleanup policy-তে মুছে যেতে পারে। |
| `/run` | Running process ও service-এর volatile runtime data রাখে। |
| `/proc` | Process ও kernel state প্রকাশ করা virtual filesystem। |
| `/sys` | Device, driver ও kernel object-এর তথ্য প্রকাশ করা virtual filesystem। |
| `/dev` | Device file রাখে, যেমন `/dev/null` এবং `/dev/sda`। |

### Where are external filesystems mounted?

| Directory | Description |
|-----------|-------------|
| `/mnt` | External filesystem manually ও temporarily mount করার common location। |
| `/media` | USB বা CD-এর মতো removable media mount করার common location। |
| `/data` | Setup example-এ Windows-এর `C:/ubuntu-data` থেকে আসা **mounted volume**। |

`/data` Linux filesystem standard-এর required directory নয়; এটি একটি common convention। Setup example-এ এটি container-এর মধ্যে mounted host folder বোঝায়।

### What is an easy way to remember the filesystem?

- Configuration সাধারণত `/etc`-এ থাকে।
- Changing application data ও log সাধারণত `/var`-এ থাকে।
- User-owned file সাধারণত `/home/<user>`-এ থাকে।
- Installed program ও library প্রধানত `/usr`-এর নিচে থাকে।
- Process, device এবং kernel view `/proc`, `/dev` ও `/sys` দিয়ে প্রকাশ করা হয়।

:::tip Interview summary
`/` পুরো Linux directory tree-এর root। `/etc` configuration, `/var` changing data, `/home` user data, `/usr` program/library এবং `/proc`, `/sys`, `/dev` runtime kernel/device view প্রকাশ করে।
:::
