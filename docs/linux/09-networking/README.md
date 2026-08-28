---
title: 'Networking'
---

## 1. How do you troubleshoot Linux networking?

Network troubleshooting layer-by-layer করলে root cause দ্রুত পাওয়া যায়: local interface inspect করুন, reachability test করুন, DNS verify করুন, listening socket দেখুন এবং শেষে application protocol test করুন।

### Which networking commands are essential?

1. **`ping google.com`** – Remote host-এর basic reachability test করে।
2. **`ifconfig`** – Network interface দেখায়; এটি deprecated, modern alternative হলো `ip`।
3. **`ip a`** – Interface এবং assigned IP address দেখায়।
4. **`netstat -tulnp`** – Open connection ও listening socket দেখায়।
5. **`curl https://example.com`** – Web resource request করে response output করে।
6. **`wget https://example.com/file.zip`** – Internet থেকে resource file হিসেবে download করে।

### What does each command tell you?

| Command | Diagnostic purpose |
|---|---|
| `ip a` | Confirms that an interface exists and has an IP address. |
| `ping google.com` | Tests name resolution and basic reachability when ICMP is allowed. |
| `ifconfig` | Shows legacy interface information; modern systems generally use the `ip` command. |
| `netstat -tulnp` | Shows listening TCP/UDP sockets and associated processes when permissions allow. |
| `curl https://example.com` | Tests an HTTP/HTTPS endpoint and displays its response. |
| `wget https://example.com/file.zip` | Downloads a remote resource to a file. |

### What is a practical troubleshooting flow?

1. Run `ip a` to confirm local interface configuration.
2. Run `ping google.com` to test reachability. A failed ping is not conclusive because some networks block ICMP.
3. Run `netstat -tulnp` to check whether the expected service is listening. On modern systems, `ss -tulnp` is the usual replacement.
4. Run `curl https://example.com` to verify the application-level response.
5. Use `wget https://example.com/file.zip` when the goal is to download and retain a remote file.

এই sequence local configuration, network reachability, transport availability এবং application behavior আলাদা করে—তাই failure কোন layer-এ তা বোঝা সহজ হয়।

:::tip Interview summary
`ip a` local configuration, `ping` reachability, `netstat`/`ss` socket, `curl` HTTP response এবং `wget` file download পরীক্ষা করে। Ping fail মানেই host down নয়, কারণ ICMP block থাকতে পারে।
:::
