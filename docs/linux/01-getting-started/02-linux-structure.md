---
sidebar_position: 2
title: 'Architecture'
---

## 1. What are the core components of a Linux machine?

একটি Linux system কয়েকটি layer নিয়ে গঠিত। User application সরাসরি hardware access করে না; shell, system utility, library এবং system call-এর মাধ্যমে kernel-এর কাছে resource চায়, আর kernel CPU, memory, device, filesystem ও network নিয়ন্ত্রণ করে।

```plaintext
+----------------------------------------------------+
| User Applications (Vim, Docker, Apache, etc.)     |
+----------------------------------------------------+
| Shell (Bash, Zsh, Fish, etc.)                     |  <-- Part of the OS
+----------------------------------------------------+
| System Libraries (glibc, libc, OpenSSL, etc.)     |  <-- Part of the OS
+----------------------------------------------------+
| System Utilities (ls, grep, systemctl, etc.)      |  <-- Part of the OS
+----------------------------------------------------+
| Linux Kernel (Process, Memory, FS, Network)       |  <-- Core of the OS
+----------------------------------------------------+
| Hardware (CPU, RAM, Disk, Network, Peripherals)   |
+----------------------------------------------------+
```

### What is the hardware layer?

Hardware layer-এর মধ্যে CPU, RAM, disk, network interface এবং অন্যান্য peripheral থাকে। Linux kernel device driver-এর মাধ্যমে এই physical component-গুলোর সঙ্গে যোগাযোগ করে।

### What does the Linux kernel do?

Kernel হলো Linux operating system-এর core। এটি privileged mode-এ চলে এবং system resource নিরাপদভাবে ভাগ করে দেয়।

- **Process Management:** Process schedule করে এবং multitasking পরিচালনা করে।
- **Memory Management:** RAM allocate, protect ও release করে।
- **Device Drivers:** Hardware এবং software-এর মধ্যে interface হিসেবে কাজ করে।
- **File System Management:** Data কীভাবে store ও retrieve হবে তা নিয়ন্ত্রণ করে।
- **Network Management:** Network interface, packet এবং protocol processing পরিচালনা করে।

Application সাধারণত hardware-এ সরাসরি হাত না দিয়ে **system call** ব্যবহার করে kernel service চায়। এই boundary isolation, permission checking এবং resource protection নিশ্চিত করে।

### What is a shell?

Shell হলো command interpreter, যা user-এর command parse করে program চালায়। Bash, Zsh, Fish, Dash এবং Ksh common shell-এর উদাহরণ।

Shell variable expansion, redirection, pipeline, scripting এবং process launch পরিচালনা করে। Shell kernel নয়; এটি user space-এ চলা একটি program, যা অন্য program ও system call-এর মাধ্যমে kernel-এর সঙ্গে কাজ করে।

### What are system libraries and utilities?

**System libraries** যেমন glibc, libc এবং OpenSSL application-কে reusable function দেয়। **System utilities** যেমন `ls`, `grep` এবং `systemctl` common operating-system task command আকারে প্রকাশ করে।

Library application development সহজ করে, আর utility administrator ও user-কে filesystem, text, process এবং service পরিচালনা করতে সাহায্য করে।

### How do user applications interact with Linux?

Web browser, text editor, Vim, Docker, Apache এবং DevOps tool—সবই user-space application। এগুলো library, system call, shell অথবা GUI framework-এর মাধ্যমে operating system-এর service ব্যবহার করে।

```text
User → Application or Shell → Library/System Call → Kernel → Hardware
```

:::tip Interview summary
Kernel resource control করে, shell command interpret করে, library reusable API দেয়, utility common administrative কাজ করে এবং application এই layer-গুলোর ওপর চলে। Shell ও kernel একই জিনিস নয়।
:::

