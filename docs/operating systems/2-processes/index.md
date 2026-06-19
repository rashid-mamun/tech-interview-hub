---
sidebar_position: 2
title: 'Processes'
---

## ⚙️ 2. What is a process?

Program হলো disk-এ থাকা passive file। Process হলো running program with state.

```text
Program = executable file
Process = executable + memory + registers + open files + state
```

### 📦 Process Control Block (PCB)

PCB-তে OS process সম্পর্কে metadata রাখে:

- Process ID
- Process state
- Program counter
- CPU registers
- Memory info
- Open file descriptors
- Scheduling info

### 🔄 Process lifecycle

```text
New -> Ready -> Running -> Terminated
          ↑        ↓
        Waiting <- I/O wait
```

### 🔁 Context switching

CPU এক process থেকে আরেক process-এ switch করলে current registers, program counter save করে next process-এর state restore করে।

```text
Save P1 state -> load P2 state -> run P2
```

Context switch useful, কিন্তু overhead আছে কারণ CPU actual user work না করে management work করে।

### 👶 fork() and exec()

```text
fork() -> current process-এর copy child process বানায়
exec() -> current process image replace করে new program চালায়
```

Typical shell flow:

```c
pid_t pid = fork();
if (pid == 0) {
    execlp("ls", "ls", "-l", NULL);
}
wait(NULL);
```

### 🧟 Zombie and orphan

| Type | Meaning |
|---|---|
| Zombie | child exit করেছে, parent এখনো wait করেনি |
| Orphan | parent exit করেছে, child এখনো চলছে |

Zombie remove করতে parent `wait()` করে child status reap করে।
