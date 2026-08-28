---
title: 'Processes'
---

## 1. What is a process in Linux?

Process হলো running program-এর একটি instance। প্রতিটি process-এর unique **Process ID (PID)** থাকে এবং সাধারণত একটি parent process থেকে তৈরি হয়। Linux tool দিয়ে process inspect, signal, prioritize এবং monitor করা যায়।

### Which process-management commands are covered?

### Viewing Processes
- `ps aux` – View all running processes
- `ps -u username` – View processes for a specific user
- `ps -C processname` – Show a process by name
- `pgrep processname` – Find a process by name and return its PID
- `pidof processname` – Find the PID of a running program

### Managing Processes
- `kill PID` – Terminate a process by PID
- `pkill processname` – Terminate a process by name
- `kill -9 PID` – Force kill a process
- `pkill -9 processname` – Kill all instances of a process
- `kill -STOP PID` – Stop a running process
- `kill -CONT PID` – Resume a stopped process
- `renice -n 10 -p PID` – Lower priority of a process
- `renice -n -5 -p PID` – Increase priority of a process (requires root)

### Background & Foreground Processes
- `command &` – Run a command in the background
- `jobs` – List background jobs
- `fg %jobnumber` – Bring a job to the foreground
- `Ctrl + Z` – Suspend a running process
- `bg %jobnumber` – Resume a suspended process in the background

### Monitoring System Processes
- `top` – Interactive process viewer
- `htop` – User-friendly process viewer (requires installation)
- `nice -n 10 command` – Run a command with a specific priority
- `renice -n -5 -p PID` – Change priority of an existing process

### Daemon Process Management
- `systemctl list-units --type=service` – List all system daemons
- `systemctl start service-name` – Start a daemon/service
- `systemctl stop service-name` – Stop a daemon/service
- `systemctl enable service-name` – Enable a service at startup

## 2. How do you find a process and its PID?
### Using `ps`
Show processes for a specific user:
```bash
ps -u username
```
Show a process by name:
```bash
ps -C processname
```

### Using `pgrep`
Find a process by name and return its PID:
```bash
pgrep processname
```

### Using `pidof`
Find the PID of a running program:
```bash
pidof processname
```

## 3. How do you stop, resume, or terminate a process?
### Killing Processes
To terminate a process by PID:
```bash
kill PID
```
To terminate using process name:
```bash
pkill processname
```
Force kill a process:
```bash
kill -9 PID
```
Kill all instances of a process:
```bash
pkill -9 processname
```

:::caution Prefer graceful termination
Signal `-9` (`SIGKILL`) stops a process immediately and does not allow cleanup. Start with `kill PID` or the service manager, then use `kill -9 PID` or `pkill -9 processname` only when the process cannot terminate normally.
:::

### Stopping & Resuming Processes
Stop a running process:
```bash
kill -STOP PID
```
Resume a stopped process:
```bash
kill -CONT PID
```

### Changing Process Priority
View process priorities:
```bash
top  # Look at the NI column
```
Change priority of a running process:
```bash
renice -n 10 -p PID  # Lower priority (positive values)
renice -n -5 -p PID  # Higher priority (negative values, root required)
```

### Running Processes in the Background
Run a command in the background:
```bash
command &
```
List background jobs:
```bash
jobs
```
Bring a job to the foreground:
```bash
fg %jobnumber
```
Send a running process to the background:
```bash
Ctrl + Z  # Suspend process
bg %jobnumber  # Resume in background
```

## 4. How do you monitor processes and change priority?
### Using `top`
Interactive process viewer:
- Press `k` and enter a PID to kill a process.
- Press `r` to renice a process.
- Press `q` to quit.

### Using `htop`
A user-friendly alternative to `top`:
```bash
htop
```
Allows mouse-based interaction for process management.

### Using `nice` & `renice`
Run a command with a specific priority:
```bash
nice -n 10 command
```
Change the priority of an existing process:
```bash
renice -n -5 -p PID
```

## 5. How do you manage daemon processes?

Daemon process user intervention ছাড়াই background-এ service হিসেবে চলে। Systemd-based system-এ `systemctl` দিয়ে service inspect ও control করা হয়।
List all system daemons:
```bash
systemctl list-units --type=service
```
Start a daemon:
```bash
systemctl start service-name
```
Stop a daemon:
```bash
systemctl stop service-name
```
Enable a service at startup:
```bash
systemctl enable service-name
```

## 6. What should you check before controlling a process?

Signal পাঠানো বা priority পরিবর্তনের আগে correct PID, parent process, owner, state এবং resource usage যাচাই করুন। `ps`, `top`, `htop`, `kill` ও `nice` একসঙ্গে process lifecycle বুঝতে এবং নিয়ন্ত্রণ করতে সাহায্য করে।

:::tip Interview summary
`ps` process snapshot দেয়, `top`/`htop` live monitoring দেয়, `kill` signal পাঠায়, `nice`/`renice` scheduling priority বদলায় এবং `systemctl` daemon service manage করে।
:::
