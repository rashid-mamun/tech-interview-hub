---
title: 'Monitoring'
---

## 1. Why is Linux system monitoring important?

System monitoring performance baseline বুঝতে, resource bottleneck শনাক্ত করতে এবং incident troubleshoot করতে সাহায্য করে। Linux tool দিয়ে CPU, memory, disk, network, process এবং log পর্যবেক্ষণ করা যায়।

### Which monitoring commands are covered?

### CPU and Memory Monitoring
- `top` – Real-time system monitoring
- `htop` – Interactive process viewer (requires installation)
- `vmstat` – Report system performance statistics
- `free -m` – Show memory usage

### Disk Monitoring
- `df -h` – Check disk space usage
- `du -sh /path` – Show disk usage of a specific directory
- `iostat` – Display CPU and disk I/O statistics

### Network Monitoring
- `ifconfig` – Show network interfaces (deprecated, use `ip a`)
- `ip a` – Show network interface details
- `netstat -tulnp` – Show active connections and listening ports
- `ss -tulnp` – Alternative to `netstat` for socket statistics
- `ping hostname` – Test network connectivity
- `traceroute hostname` – Show network path to a host
- `nslookup domain` – Get DNS resolution details

### Log Monitoring
- `tail -f /var/log/syslog` – Live monitoring of system logs
- `journalctl -f` – Live system logs for systemd-based distros
- `dmesg | tail` – View kernel logs

## 2. How do you monitor CPU and memory?
### Using `top`
Real-time CPU, memory এবং process usage দেখতে:
```bash
top
```
Press `q` to quit.

### Using `htop`
আরও interactive process viewer হিসেবে:
```bash
htop
```
Use arrow keys to navigate and `F9` to kill processes.

### Using `vmstat`
CPU, memory এবং I/O statistics interval অনুযায়ী দেখতে:
```bash
vmstat 1 5  # Update every 1 sec, show 5 updates
```

### Checking Memory Usage
```bash
free -m
```
এটি free ও used memory megabyte-এ দেখায়।

## 3. How do you monitor disk usage and I/O?
### Using `df`
Mounted filesystem-এর available space দেখতে:
```bash
df -h
```
### Using `du`
নির্দিষ্ট directory কত space ব্যবহার করছে দেখতে:
```bash
du -sh /var/log
```
### Using `iostat`
Disk I/O এবং CPU statistics দেখতে:
```bash
iostat
```

## 4. How do you monitor network activity?
### Checking Network Interfaces
```bash
ip a  # Show IP addresses and interfaces
```
### Viewing Open Ports and Connections
```bash
netstat -tulnp  # Show listening ports
ss -tulnp  # Alternative to netstat
```
### Testing Connectivity
```bash
ping google.com  # Test internet connection
traceroute google.com  # Trace the path to Google
```
### Checking DNS Resolution
```bash
nslookup example.com
```

## 5. How do you monitor system and kernel logs?
### Live Monitoring of System Logs
```bash
tail -f /var/log/syslog  # Follow logs in real-time
journalctl -f  # Systemd logs
```
### Checking Kernel Logs
```bash
dmesg | tail
```

## 6. What is a practical monitoring order?

Broad system view-এর জন্য `top` বা `htop` দিয়ে শুরু করুন। এরপর `free -m`, `df -h` এবং `iostat` দিয়ে memory বা storage pressure isolate করুন। Affected resource বা service বোঝার পরে `ss -tulnp`, connectivity tool এবং log ব্যবহার করুন।

:::tip Interview summary
Monitoring-এ একটি command-এর output দেখে সিদ্ধান্ত না নিয়ে CPU, memory, disk I/O, network socket এবং log correlate করতে হয়। `top` broad view দেয়; specialized tool root cause narrow করে।
:::
