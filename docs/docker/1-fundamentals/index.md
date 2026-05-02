---
sidebar_position: 1
title: ''
---


## 🧱 1. What is Docker, and why is it used in modern software development?
**Docker** হলো একটি open-source platform যা application-কে **container**-এর মধ্যে package করে run করার সুবিধা দেয়। একটি container হলো একটি lightweight, isolated environment যেখানে application এবং তার সমস্ত **dependencies** (যেমন libraries, runtime, configuration) একসাথে থাকে।

সহজ ভাষায় বলতে গেলে — Docker একটি "বাক্সের" মতো, যেখানে তোমার পুরো application সহ সবকিছু ভরে দিতে পারো, এবং সেই বাক্স যেকোনো machine-এ হুবহু একইভাবে চলবে।

---

#### Container vs Virtual Machine (VM)

| বিষয় | Container | Virtual Machine |
|---|---|---|
| Size | অনেক ছোট (MB) | অনেক বড় (GB) |
| Startup time | মাত্র কয়েক সেকেন্ড | কয়েক মিনিট |
| Resource usage | কম | বেশি |
| OS | Host OS share করে | আলাদা OS দরকার |

Container, VM-এর মতো পুরো **operating system** নকল করে না — শুধু application layer isolate করে। তাই এটি অনেক দ্রুত এবং কম resource ব্যবহার করে।

---

#### কেন Docker ব্যবহার করা হয়?

**১. "Works on my machine" সমস্যার সমাধান**
Development, testing, এবং production environment-এ অনেক সময় software আলাদাভাবে behave করে। Docker নিশ্চিত করে যে সব জায়গায় **same environment** পাওয়া যাবে।

**২. Dependency Management সহজ হয়**
একটি application-এর জন্য দরকারী সব dependency container-এর ভেতরে থাকে, তাই host machine-এ আলাদা করে install করতে হয় না।

**৩. Rapid Deployment**
Container অনেক দ্রুত start হয়, তাই **CI/CD pipeline**-এ deploy করা সহজ এবং দ্রুত হয়।

**৪. Scalability**
**Kubernetes**-এর মতো orchestration tool ব্যবহার করে Docker container সহজেই scale করা যায় — load বাড়লে নতুন container চালু করা যায়, কমলে বন্ধ করা যায়।

**৫. Microservices Architecture-এর জন্য আদর্শ**
আধুনিক application অনেক ছোট ছোট **microservice**-এ ভাগ করা হয়। প্রতিটি service আলাদা container-এ চালানো যায়, যা independent development এবং deployment নিশ্চিত করে।

**৬. Resource Efficiency**
VM-এর তুলনায় Docker container অনেক কম memory এবং CPU ব্যবহার করে, কারণ এটি host machine-এর **kernel** share করে।

---

#### Docker-এর মূল components
- **Docker Image** — application-এর একটি read-only blueprint বা template। এটি থেকে container তৈরি হয়।
- **Docker Container** — Image-এর একটি running instance। এটিই actual execution environment।
- **Dockerfile** — Image build করার জন্য step-by-step instruction লেখা একটি text file।
- **Docker Hub** — Docker image-এর একটি public registry যেখানে image share এবং download করা যায়।
- **Docker Engine** — Docker-এর core runtime যা container manage করে।

### What problems does Docker solve that virtual machines do not?
**VM** চালাতে হলে প্রতিটির জন্য আলাদা একটি পূর্ণ **Operating System** install করতে হয়। এর মানে হলো — একটি server-এ যদি ৫টি VM চালাও, তাহলে ৫টি আলাদা OS চলবে, যা প্রচুর **CPU**, **RAM**, এবং **disk space** খরচ করে।

Docker এই সমস্যাগুলো সমাধান করে:

---
**১. Resource overhead কমানো**
VM-এ প্রতিটি instance-এর জন্য আলাদা **Guest OS** লাগে, যা GB পরিমাণ memory দখল করে। Docker container host machine-এর **OS kernel** share করে, তাই resource খরচ অনেক কম।

**২. Startup time কমানো**
VM boot হতে কয়েক মিনিট লাগে কারণ পুরো OS load হয়। Docker container মাত্র কয়েক **millisecond** থেকে কয়েক second-এ চালু হয় — শুধু application process শুরু হয়, OS নয়।

**৩. Image size ছোট রাখা**
একটি VM image সাধারণত কয়েক **GB**। Docker image হয় মাত্র কয়েক **MB** — কারণ এতে শুধু application এবং তার dependencies থাকে, পুরো OS থাকে না।

**৪. Developer environment-এর consistency**
VM দিয়েও isolation সম্ভব, কিন্তু **Dockerfile** দিয়ে পুরো environment-এর exact instruction লিখে রাখা যায়। ফলে যেকোনো developer সেই file দিয়ে হুবহু একই environment তৈরি করতে পারে — manually কিছু configure করতে হয় না।

**৫. Microservices architecture-এর জন্য উপযুক্ত**
একটি বড় application-কে অনেকগুলো ছোট **microservice**-এ ভাগ করলে প্রতিটির জন্য আলাদা VM চালানো অনেক ব্যয়বহুল। Docker container হালকা হওয়ায় একই server-এ শত শত container চালানো সম্ভব।

**৬. CI/CD pipeline-এ দ্রুততা**
VM-based environment বারবার spin up ও tear down করা ধীর। Docker container-এ এটি অত্যন্ত দ্রুত হয়, যা **automated testing** ও **deployment**-কে অনেক efficient করে তোলে।

---

### What is the difference between containerization and virtualization?
Virtualization-এ **Hypervisor** নামের একটি software, physical hardware-এর উপরে বসে একাধিক **Virtual Machine** তৈরি করে। প্রতিটি VM-এর নিজস্ব **Guest OS**, virtual **CPU**, virtual **RAM**, এবং virtual **storage** থাকে।

```
┌───────────────────────────────────────────────────────────────┐
│   Application A         │        Application B                │
├─────────────────────────┼─────────────────────────────────────┤
│   Guest OS (Linux)      │        Guest OS (Windows)           │
├───────────────────────────────────────────────────────────────┤
│                        Hypervisor                             │
├───────────────────────────────────────────────────────────────┤
│                     Physical Hardware                         │
└───────────────────────────────────────────────────────────────┘
```

#### Containerization কীভাবে কাজ করে?

Containerization-এ **Container Engine** (যেমন Docker) host machine-এর **OS kernel** ব্যবহার করে। আলাদা OS নেই — শুধু application এবং তার dependencies আলাদা আলাদা container-এ থাকে।

```
┌──────────────────────────────────────────────────────────────┐
│  Container A          │  Container B          │  Container C  │
│  (App + Dependencies) │  (App + Dependencies) │  (App + Deps) │
├──────────────────────────────────────────────────────────────┤
│                    Docker Engine                              │
├──────────────────────────────────────────────────────────────┤
│                    Host OS Kernel                             │
├──────────────────────────────────────────────────────────────┤
│                    Physical Hardware                          │
└──────────────────────────────────────────────────────────────┘
```

---

#### কোনটি কখন ব্যবহার করবে?

**VM বেছে নাও যখন —** তোমার application-এর জন্য সম্পূর্ণ আলাদা OS দরকার (যেমন Linux server-এ Windows app চালাতে হবে), অথবা maximum **security isolation** দরকার।

**Docker বেছে নাও যখন —** দ্রুত deploy করতে হবে, resource কম খরচ করতে হবে, **microservices** বা **cloud-native** application তৈরি করতে হবে।

> 💡 বাস্তবে অনেক সময় দুটো একসাথে ব্যবহার হয় — cloud provider-এর VM-এর উপরে Docker container চালানো হয়। এতে VM-এর security এবং Docker-এর efficiency দুটোই পাওয়া যায়।

### How does Docker use Linux kernel features (namespaces, cgroups) under the hood?
Docker আসলে নিজে কোনো "magic" করে না — এটি Linux kernel-এর দুটি শক্তিশালী feature ব্যবহার করে container তৈরি করে: **Namespaces** এবং **cgroups**।

#### 🔷 Namespaces — Isolation-এর জন্য

**Namespace** হলো Linux kernel-এর একটি feature যা প্রতিটি container-কে মনে করিয়ে দেয় যে সে একা পুরো system চালাচ্ছে। অর্থাৎ, প্রতিটি container তার নিজের isolated view পায়।

Docker মোট ৬ ধরনের namespace ব্যবহার করে:

| Namespace | কী isolate করে | উদাহরণ |
|---|---|---|
| **PID namespace** | Process IDs | Container-এর ভেতরে প্রথম process সবসময় PID 1, কিন্তু host-এ সে ভিন্ন PID |
| **NET namespace** | Network interfaces, IP, ports | প্রতিটি container-এর নিজস্ব virtual network interface থাকে |
| **MNT namespace** | Filesystem mount points | Container শুধু তার নিজের filesystem দেখতে পায় |
| **UTS namespace** | Hostname | প্রতিটি container-এর আলাদা hostname থাকতে পারে |
| **IPC namespace** | Inter-process communication | Container-এর processes শুধু নিজেদের মধ্যে communicate করতে পারে |
| **USER namespace** | User ও Group IDs | Container-এর ভেতরে root user, host-এ সাধারণ user হতে পারে |

সহজ কথায়: Namespace দিয়ে container মনে করে সে আলাদা একটি system, কিন্তু আসলে সে host-এর kernel-ই ব্যবহার করছে।

---

#### 🔷 cgroups (Control Groups) — Resource limit-এর জন্য

**cgroups** হলো Linux kernel-এর আরেকটি feature যা দিয়ে প্রতিটি process বা process group কতটুকু resource ব্যবহার করতে পারবে তা নিয়ন্ত্রণ করা যায়।

Docker cgroups দিয়ে যা নিয়ন্ত্রণ করে:

```
┌─────────────────────────────────────────────────┐
│                  cgroups                         │
│                                                  │
│  CPU limit     → container কত % CPU পাবে        │
│  Memory limit  → container কত RAM ব্যবহার করবে │
│  Disk I/O      → read/write speed limit          │
│  Network       → bandwidth throttling            │
└─────────────────────────────────────────────────┘
```

উদাহরণস্বরূপ, তুমি যখন লেখো:
```bash
docker run --memory="512m" --cpus="1.5" my-app
```
তখন Docker, Linux kernel-এর cgroups-কে বলে দেয় যে এই container সর্বোচ্চ 512MB RAM এবং 1.5টি CPU core ব্যবহার করতে পারবে।

---

#### 🔷 Union File System — Layered Image-এর জন্য

Docker আরেকটি kernel feature ব্যবহার করে — **Union File System** (সাধারণত **OverlayFS**)। এটি multiple read-only **layers** একসাথে stack করে একটি single filesystem তৈরি করে।

- প্রতিটি **Dockerfile** instruction একটি নতুন layer তৈরি করে
- Layer গুলো সব Image-এর মধ্যে share হয়, তাই disk space কম লাগে
- Container চালু হলে উপরে একটি writable layer যোগ হয়

```
┌─────────────────────────────┐  ← Writable layer (container-এর পরিবর্তন)
├─────────────────────────────┤  ← App code layer
├─────────────────────────────┤  ← Dependencies layer
├─────────────────────────────┤  ← Base OS layer (যেমন Ubuntu)
└─────────────────────────────┘
```

#### সংক্ষেপে Docker-এর architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Container                   │
│                                                      │
│  Isolated by: Namespaces (PID, NET, MNT, UTS...)    │
│  Limited by:  cgroups (CPU, RAM, I/O)               │
│  Storage:     Union Filesystem (overlay2)           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
             Linux Kernel (shared, not duplicated)
```

Docker মূলত এই kernel feature-গুলোকে একটি সহজ **API** ও **CLI**-এর মাধ্যমে ব্যবহারযোগ্য করে তোলে — এটাই Docker-এর মূল কাজ।

---

### What is the Open Container Initiative (OCI) and how does Docker relate to it?
**Open Container Initiative (OCI)** হলো একটি open governance structure যা container technology-র জন্য industry-wide **open standard** তৈরি করে। এটি ২০১৫ সালে **Linux Foundation**-এর অধীনে প্রতিষ্ঠিত হয়।

OCI তৈরির কারণ ছিল — Docker তখন container জগতে একচেটিয়া ছিল, এবং বিভিন্ন vendor চাইছিল একটি neutral, shared standard থাকুক যাতে কোনো একটি কোম্পানির উপর নির্ভরশীল না হতে হয়।

---

#### OCI-এর দুটি মূল Specification

**১. OCI Image Spec**
Container image কীভাবে তৈরি ও package করতে হবে তার standard। এই spec মেনে তৈরি করা যেকোনো image, যেকোনো OCI-compliant runtime-এ চলবে।

**২. OCI Runtime Spec**
Container কীভাবে চালু করতে হবে তার standard। এই spec-এর reference implementation হলো **runc** — যা Docker নিজেই তৈরি করে OCI-তে donate করেছে।

```
┌─────────────────────────────────────────────────────┐
│              OCI Standards                           │
│                                                      │
│  Image Spec        → image কীভাবে package হবে      │
│  Runtime Spec      → container কীভাবে run হবে      │
│  Distribution Spec → image কীভাবে distribute হবে  │
└─────────────────────────────────────────────────────┘
```

---

#### Docker এবং OCI-এর সম্পর্ক

Docker-ই OCI গঠনে অগ্রণী ভূমিকা রেখেছিল এবং নিজের core technology OCI ও CNCF-এ contribute করেছে:

**Docker → OCI/CNCF-এ যা দিয়েছে:**
- **runc** — Docker-এর low-level container runtime, OCI Runtime Spec-এর reference implementation হিসেবে OCI-তে donate করা হয়েছে
- **containerd** — Docker-এর container management layer, যা এখন একটি স্বাধীন **CNCF** (Cloud Native Computing Foundation) project

আজকে Docker-এর ভেতরে যা চলে তার architecture:

```
Docker CLI
    │
    ▼
Docker Daemon (dockerd)
    │
    ▼
containerd  ← (OCI-compliant, CNCF project)
    │
    ▼
runc        ← (OCI Runtime Spec মেনে চলে)
    │
    ▼
Linux Kernel (namespaces + cgroups)
```

---

#### OCI Standard-এর সুবিধা কী?

OCI standard থাকায় এখন Docker ছাড়াও অন্য tool দিয়ে container চালানো যায়:

| Tool | কোথায় ব্যবহার হয় |
|---|---|
| **containerd** | Kubernetes-এর default runtime |
| **Podman** | Red Hat-এর Docker alternative (daemon-less) |
| **CRI-O** | Kubernetes-specific runtime |
| **runc** | সব OCI runtime-এর ভিত্তি |

এই সব tool OCI standard মেনে চলে বলে Docker দিয়ে build করা image এগুলোতেও চলে — এবং উল্টোটাও সত্য।

> Docker container technology-কে জনপ্রিয় করেছে, আর OCI সেই technology-কে একটি **vendor-neutral open standard**-এ পরিণত করেছে — যাতে পুরো industry একসাথে এগিয়ে যেতে পারে।

### 🔩 containerd এবং runc — বিস্তারিত আলোচনা

Docker CLI-তে `docker run` লিখলে আসলে অনেকগুলো layer কাজ করে। containerd এবং runc এই chain-এর দুটি আলাদা স্তরে কাজ করে:

```
তুমি লিখলে:  docker run nginx
                    │
                    ▼
            ┌───────────────┐
            │  Docker CLI   │  ← তুমি যা দেখো
            └───────┬───────┘
                    │ HTTP API call
                    ▼
            ┌───────────────┐
            │  dockerd      │  ← Docker Daemon (high-level manager)
            └───────┬───────┘
                    │ gRPC call
                    ▼
            ┌───────────────┐
            │  containerd   │  ← Container lifecycle manager
            └───────┬───────┘
                    │ OCI bundle তৈরি করে
                    ▼
            ┌───────────────┐
            │     runc      │  ← Actual container চালু করে
            └───────┬───────┘
                    │ syscall
                    ▼
            ┌───────────────┐
            │ Linux Kernel  │  ← namespaces + cgroups
            └───────────────┘
```

এরা একে অপরের প্রতিযোগী নয় — এরা **একই chain-এর আলাদা স্তর**।

---

#### runc আসলে কী?

**runc** হলো একটি lightweight **command-line tool** যার একটাই কাজ — OCI spec মেনে Linux kernel-এর feature ব্যবহার করে একটি container process চালু করা।

এটি Go ভাষায় লেখা এবং Docker ২০১৫ সালে এটি OCI-তে donate করে।

---

#### runc ঠিক কী করে, ধাপে ধাপে

runc-কে কাজ করতে হলে দুটি জিনিস দিতে হয়:

**১. একটি OCI bundle** — যার মধ্যে থাকে:
- `config.json` → container-এর সব configuration (কোন namespace, কোন cgroup limit, কোন filesystem)
- `rootfs/` → container-এর root filesystem (image-এর contents)

runc এই bundle পেলে যা করে:

```
config.json পড়ে
      │
      ▼
Namespaces তৈরি করে    → clone() syscall দিয়ে নতুন PID/NET/MNT namespace
      │
      ▼
cgroups সেট করে        → CPU/RAM limit enforce করে
      │
      ▼
rootfs mount করে       → container-এর filesystem set up করে
      │
      ▼
capabilities সেট করে  → কোন Linux permission থাকবে ঠিক করে
      │
      ▼
Application চালু করে  → execve() syscall দিয়ে actual process শুরু
```

---

#### runc-এর একটি গুরুত্বপূর্ণ বৈশিষ্ট্য

runc container চালু করার পরে **নিজে থেকে যায়**। এটি কোনো daemon হিসেবে background-এ চলে না। Container চালু হলে runc-এর কাজ শেষ। Container-এর process তখন সরাসরি kernel-এর সাথে কথা বলে।

```
runc → container চালু করল → runc exit করল
                              container চলছে (runc ছাড়াই)
```

এই design-টি ইচ্ছাকৃত — runc যত ছোট ও simple রাখা যায়, attack surface তত কম।

---

#### containerd আসলে কী?

**containerd** হলো একটি **industry-standard container runtime** যা runc-এর উপরে বসে container-এর image ও lifecycle সংক্রান্ত কাজগুলো সরাসরি execute করে। এটি একটি daemon হিসেবে চলে।

> ⚠️ একটু পরেই দেখবে dockerd-ও image ও container নিয়ে কথা বলে — তাই দুটোর boundary এখনই বুঝে নাও:
>
> **containerd** = **হাত** — সে আসলে কাজটা করে (image download, layer store, process চালু)
>
> **dockerd** = **মাথা** — সে সিদ্ধান্ত নেয় এবং containerd-কে নির্দেশ দেয়

---

#### containerd ঠিক কী কী করে?

containerd-এর কাজের সীমানা স্পষ্ট — সে শুধু **image ও container runtime** নিয়ে কাজ করে। Network policy বা volume management তার কাজ নয়।

**① Image pull ও storage (আসল execution)**
```
Registry থেকে সরাসরি image layer download করে
Layer গুলো verify করে (checksum) এবং disk-এ store করে
Image-কে OCI bundle-এ রূপান্তর করে runc-এর জন্য তৈরি করে
Snapshot তৈরি করে → প্রতিটি container-এর জন্য আলাদা filesystem layer
```

> dockerd "image pull করো" বলে নির্দেশ দেয়, containerd সেই pull আসলে execute করে।

**② Container lifecycle execution (runc-এর মাধ্যমে)**
```
Container তৈরি করা    (create)  → OCI bundle তৈরি করে runc-কে দেয়
Container চালু করা   (start)   → runc দিয়ে process চালু করে
Container pause করা  (pause)   → process-কে SIGSTOP পাঠায়
Container বন্ধ করা   (stop)    → process-কে SIGTERM/SIGKILL পাঠায়
Container মুছে ফেলা  (delete)  → filesystem layer মুছে দেয়
```

> dockerd "এই container চালু করো" বলে, containerd runc ডেকে সেটা আসলে execute করে।

**③ containerd-shim — container টিকিয়ে রাখা**

containerd সরাসরি runc-কে call করে না। মাঝে আরেকটি component থাকে — **containerd-shim**:

```
containerd
    │
    ▼
containerd-shim   ← প্রতিটি container-এর জন্য একটি আলাদা shim process
    │
    ▼
runc              ← container চালু করে, তারপর exit
    │
    ▼
container process ← চলতে থাকে (shim এটি watch করে)
```

runc exit করে যায় container চালু হলে। কিন্তু তখনও কেউ একজনকে container-এর stdin/stdout ধরে রাখতে হবে এবং exit code সংগ্রহ করতে হবে — containerd-shim এই কাজটি করে। এর ফলে containerd নিজে crash করলেও container চলতে থাকে, কারণ shim আলাদাভাবে চলছে।

**④ Network namespace তৈরি (শুধু namespace, policy নয়)**
```
Container-এর জন্য একটি নতুন NET namespace তৈরি করে
এই খালি namespace-টি dockerd-কে হস্তান্তর করে
```

> IP assign করা, bridge তৈরি করা, iptables rules লেখা — এগুলো containerd করে না। এটা dockerd-এর কাজ। containerd শুধু একটি ফাঁকা network namespace তৈরি করে দেয়, বাকি কাজ dockerd করে।

---

#### containerd না থাকলে:

**১. Docker monolith হয়ে থাকতো**
আগে Docker daemon একাই সব করতো। containerd আলাদা হওয়ায় এটি Kubernetes-সহ অন্য system সরাসরি ব্যবহার করতে পারে — dockerd ছাড়াই।

**২. Kubernetes Docker-এর উপর নির্ভরশীল থাকতো**
Kubernetes এখন সরাসরি containerd ব্যবহার করে। Docker-এর অনেক feature Kubernetes-এর দরকার ছিল না, containerd সেই unnecessary overhead সরিয়ে দিয়েছে।

**৩. Container চালু থাকা নিশ্চিত করা কঠিন হতো**
containerd-shim-এর কারণে containerd নিজে restart করলেও container চলতে থাকে। এটি না থাকলে daemon restart মানেই সব container বন্ধ — production-এ এটি বিপর্যয়কর।

**৪. Image layer management জটিল হতো**
Image pull করা, layer cache করা, snapshot নেওয়া — এই কাজগুলো containerd অত্যন্ত efficiently করে। এটি না থাকলে প্রতিটি tool-কে নিজেই এই complex logic implement করতে হতো।

---

#### runc না থাকলে:

**১. প্রতিটি runtime নিজের মতো container চালাতো**
Docker, Podman, Kubernetes — সবাই নিজেদের মতো করে namespace ও cgroup সেট করতো। কোনো standard থাকতো না, ফলে একটির image অন্যটিতে চলতো না।

**২. Security patch সব জায়গায় আলাদাভাবে দিতে হতো**
runc একটি central জায়গায় Linux kernel interaction handle করে। এটি না থাকলে প্রতিটি tool-এ আলাদাভাবে এই low-level code থাকতো।

**৩. OCI standard থাকতো না**
runc হলো OCI Runtime Spec-এর reference implementation। এটি না থাকলে container ecosystem এতটা interoperable হতো না।

---

### 🔷 dockerd আসলে কী?

**dockerd** হলো **Docker Daemon** — এটি Docker-এর মূল background process যা সবসময় চলতে থাকে এবং Docker-এর সব কিছু orchestrate করে।

তুমি যখন terminal-এ `docker run`, `docker build`, বা `docker pull` লেখো — তুমি আসলে **Docker CLI**-এর সাথে কথা বলছো। CLI নিজে কিছু করে না, সে শুধু dockerd-কে বলে "এই কাজটা করো।" dockerd তখন সেই কাজ করে।

```
তুমি                Docker CLI            dockerd
  │                      │                    │
  │─── docker run ──────▶│                    │
  │                      │──── HTTP/Unix ─────▶│
  │                      │     socket          │  (এখানে সিদ্ধান্ত নেওয়া হয়)
  │                      │                    │
  │◀──────────────────────│◀─── response ──────│
```

---

### 🔷 dockerd কোথায় থাকে এবং কীভাবে চলে?

dockerd একটি **Unix socket** এর উপর listen করে:

```
/var/run/docker.sock
```

Docker CLI এই socket-এ **REST API call** পাঠায়। এই কারণেই remote machine থেকেও Docker control করা যায় — শুধু socket-এর পরিবর্তে TCP port expose করলেই হয়।

```bash
# dockerd যে socket-এ listen করে
unix:///var/run/docker.sock

# Remote access এর জন্য TCP (সাবধানে ব্যবহার করতে হয়)
tcp://0.0.0.0:2376
```

---

### 🔷 dockerd ঠিক কী কী করে?

> **মূল কথা:** dockerd নিজে কোনো container বা image সরাসরি execute করে না — সে সিদ্ধান্ত নেয়, policy enforce করে, এবং containerd-কে নির্দেশ দেয়। তবে **networking** এবং **volume management** dockerd নিজেই সরাসরি করে, কারণ এগুলো Docker-এর নিজস্ব feature যা containerd-এর scope-এর বাইরে।

---

#### ① 📥 Image Pull — নির্দেশ দেওয়া ও BuildKit

`docker pull` করলে dockerd প্রথমে request receive করে, authentication যাচাই করে, কোন registry থেকে pull হবে সেটা ঠিক করে, তারপর **containerd-কে বলে** আসলে download করতে। containerd সেই download execute করে।

তবে **image build** করা সম্পূর্ণ dockerd-এর নিজের কাজ — এর মধ্যে **BuildKit** integrated আছে:

```
docker build লিখলে dockerd যা করে:
│
├── Dockerfile পড়ে এবং parse করে
├── BuildKit engine দিয়ে প্রতিটি instruction execute করে
├── প্রতিটি layer cache করে (পরের build দ্রুত হওয়ার জন্য)
└── Final image তৈরি করে containerd-এর storage-এ রাখে
```

containerd নিজে Dockerfile পড়তে বা image build করতে পারে না।

---

#### ② 🚀 Container চালু করার সিদ্ধান্ত ও Configuration

dockerd সরাসরি container চালায় না — সে containerd-কে দিয়ে চালায়। কিন্তু **কীভাবে চালাতে হবে** সেটা সম্পূর্ণ dockerd ঠিক করে:

```
docker run -p 8080:80 -v mydata:/data --restart=always nginx:
│
├── Image আছে কিনা check করে, না থাকলে pull করার নির্দেশ দেয়
├── Container-এর পূর্ণ configuration তৈরি করে
│     ├── কোন network-এ থাকবে
│     ├── কোন volume mount হবে
│     ├── কোন environment variable থাকবে
│     ├── restart policy কী হবে
│     └── কোন port expose হবে
│
└── containerd-কে বলে: "এই configuration দিয়ে container চালাও"
     (containerd runc দিয়ে আসলে process চালু করে)
```

---

#### ③ 🌐 Networking — dockerd নিজেই করে

এটি সেই জায়গা যেখানে dockerd containerd-এর উপর নির্ভর করে না — **networking সম্পূর্ণ dockerd-এর নিজস্ব কাজ**।

containerd শুধু container-এর জন্য একটি ফাঁকা NET namespace তৈরি করে দেয়। সেই namespace-এ আসল network গড়ে তোলার কাজটা dockerd করে:

```
docker network create mynet লিখলে, বা docker run -p 8080:80 লিখলে dockerd:
│
├── Linux bridge interface তৈরি করে (যেমন docker0)
├── IP address range assign করে (যেমন 172.17.0.0/16)
├── iptables rules লেখে (traffic routing ও port forwarding-এর জন্য)
├── Container-এর মধ্যে DNS set up করে
│     └── Container নাম দিয়ে একে অপরকে খুঁজে পায়
└── Host port → container port forward করে (যেমন 8080 → 80)
```

Default network modes যা dockerd manage করে:

| Network Mode | কী করে |
|---|---|
| **bridge** | Default। Virtual bridge দিয়ে container connect হয় |
| **host** | Container host-এর network সরাসরি ব্যবহার করে |
| **none** | কোনো network নেই, সম্পূর্ণ isolated |
| **overlay** | Multiple host-এর মধ্যে network (Swarm-এ ব্যবহার হয়) |

---

#### ④ 💾 Volume Management — dockerd নিজেই করে

Volume management-ও সম্পূর্ণ dockerd-এর কাজ — containerd এখানে involved নয়।

```
docker volume create mydata লিখলে dockerd:
│
├── Host machine-এ একটি directory তৈরি করে
│     /var/lib/docker/volumes/mydata/_data
├── Volume-এর metadata রাখে
└── Container চালু করার সময় সেই path bind mount করে দেয়
```

Volume-এর সুবিধা হলো container মরে গেলেও data থাকে — এটি dockerd-ই নিশ্চিত করে।

---

#### ⑤ 🔌 Plugin System Management

dockerd একটি **plugin architecture** support করে। Third-party plugin দিয়ে Docker-এর capability বাড়ানো যায়:

```
Storage plugins   → AWS EBS, Azure Disk ইত্যাদি volume driver
Network plugins   → Weave, Calico ইত্যাদি network driver
Auth plugins      → Custom authentication system
Log plugins       → Splunk, Fluentd ইত্যাদিতে log পাঠানো
```

---

#### ⑥ 📊 Logging এবং Events

dockerd সব container-এর **log collect** করে এবং বিভিন্ন **log driver**-এ পাঠাতে পারে:

```
docker logs mycontainer → dockerd log store থেকে দেখায়

Log drivers:
├── json-file (default) → disk-এ JSON হিসেবে রাখে
├── syslog             → system log-এ পাঠায়
├── journald           → systemd journal-এ পাঠায়
├── fluentd            → Fluentd aggregator-এ পাঠায়
└── awslogs            → AWS CloudWatch-এ পাঠায়
```

---

#### ⑦ 🔁 Restart Policy — dockerd-এর একার কাজ

containerd শুধু জানায় যে container exit করেছে। সেই information পেয়ে কী করতে হবে — এটা সম্পূর্ণ dockerd ঠিক করে:

```
Container crash করলো
        │
        ▼
containerd-shim dockerd-কে জানালো → container exit করেছে
        │
        ▼
dockerd restart policy check করলো → "always" মানে সবসময় restart
        │
        ▼
dockerd containerd-কে নির্দেশ দিল → আবার চালাও
        │
        ▼
Container আবার চালু হলো
```

```bash
docker run --restart=always myapp
```

এই কাজটি dockerd ছাড়া কেউ করতো না।

---

#### ⑧ 🐝 Docker Swarm Management

dockerd-এর মধ্যে **Swarm mode** built-in আছে। এটি দিয়ে multiple Docker host-কে একটি cluster হিসেবে manage করা যায়:

```
docker swarm init করলে dockerd:
│
├── এই machine-কে Swarm manager বানায়
├── Worker node join করার token তৈরি করে
├── Service scheduling শুরু করে
├── Load balancing configure করে
└── Cluster state maintain করে (Raft consensus algorithm দিয়ে)
```

---

### 🔷 dockerd-এর ভেতরের architecture

dockerd নিজেও অনেকগুলো internal component দিয়ে তৈরি:

```
┌─────────────────────────────────────────────────────┐
│                      dockerd                        │
│                                                     │
│  ┌─────────────┐    ┌──────────────┐               │
│  │  REST API   │    │  Swarm Mode  │               │
│  │  Server     │    │  (built-in)  │               │
│  └──────┬──────┘    └──────────────┘               │
│         │                                           │
│  ┌──────▼──────────────────────────────────────┐   │
│  │              Docker Engine Core              │   │
│  │                                             │   │
│  │  BuildKit  Network    Volume    Plugin      │   │
│  │  (build)   Manager    Manager   Manager     │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                              │
└─────────────────────┼──────────────────────────────┘
                      │ gRPC (নির্দেশ পাঠায়)
                      ▼
                 containerd
          (image download ও container execution করে)
                      │
                     runc
                      │
               Linux Kernel
```

---

### 🔷 containerd বনাম dockerd — এক নজরে পার্থক্য

এই table-টি মনে রাখলে আর কোনো confusion থাকবে না:

| কাজ | dockerd | containerd |
|---|---|---|
| `docker pull` request receive ও auth | ✅ নির্দেশ দেয় | ✅ আসলে download করে |
| `docker build` (Dockerfile) | ✅ BuildKit দিয়ে নিজেই করে | ❌ করে না |
| Container configuration তৈরি | ✅ নিজেই করে | ❌ করে না |
| Container process চালু | ❌ নিজে করে না | ✅ runc দিয়ে করে |
| Network bridge, IP, iptables | ✅ নিজেই করে | ❌ করে না |
| NET namespace তৈরি | ❌ | ✅ করে |
| Volume তৈরি ও bind mount | ✅ নিজেই করে | ❌ করে না |
| Restart policy enforce | ✅ নিজেই করে | ❌ করে না |
| Image layer disk-এ store | ❌ নির্দেশ দেয় | ✅ আসলে store করে |
| Logging driver config | ✅ নিজেই করে | ❌ করে না |
| stdin/stdout ধরে রাখা | ❌ | ✅ shim দিয়ে করে |
| Swarm orchestration | ✅ নিজেই করে | ❌ করে না |

---

### ❌ dockerd না থাকলে কী সমস্যা হতো?

#### ১. সরাসরি containerd ব্যবহার করতে হতো — যা অনেক কঠিন

containerd-এর নিজস্ব CLI আছে — **ctr** এবং **nerdctl**। কিন্তু এগুলো অনেক low-level। উদাহরণ দেখো:

```bash
# Docker দিয়ে (dockerd আছে):
docker run -p 8080:80 -v mydata:/data --name web nginx

# containerd দিয়ে সরাসরি (dockerd নেই):
ctr image pull docker.io/library/nginx:latest
ctr container create \
  --net-host \
  --mount type=bind,src=/var/lib/mydata,dst=/data \
  docker.io/library/nginx:latest web
ctr task start web
# port mapping? নিজে iptables rules লিখতে হবে
```

dockerd এই complexity লুকিয়ে রাখে একটি simple command-এ।

---

#### ২. Image build করার কোনো সহজ উপায় থাকতো না

containerd নিজে image build করতে পারে না। dockerd-এর মধ্যে **BuildKit** integrated আছে যা Dockerfile থেকে image তৈরি করে। dockerd না থাকলে আলাদাভাবে BuildKit configure করতে হতো।

---

#### ৩. Networking অনেক manual হতো

dockerd automatic ভাবে bridge তৈরি করে, IP assign করে, iptables rules লেখে এবং container-এর মধ্যে DNS করে। এগুলো dockerd ছাড়া manually করতে হতো — প্রতিটি container-এর জন্য আলাদাভাবে।

---

#### ৪. Single API থাকতো না

dockerd একটি **unified REST API** দেয়। এই API দিয়ে Docker CLI, Docker Compose এবং third-party tool (Portainer, Watchtower) কাজ করে। dockerd না থাকলে এই ecosystem তৈরি হতো না।

---

#### ৫. Log এবং Event tracking থাকতো না

`docker logs`, `docker events`, `docker stats` — এই সব command dockerd-এর উপর নির্ভরশীল। এটি না থাকলে container-এর কী হচ্ছে জানার কোনো সহজ উপায় থাকতো না।

---

> 💡 **এক লাইনে মনে রাখো:**
> **runc** জানে container *চালু* করতে।
> **containerd** জানে image *download* করতে এবং container process *execute* করতে।
> **dockerd** জানে তোমার *ইচ্ছা* বুঝে network ও volume *নিজে* গড়তে এবং containerd-কে *নির্দেশ* দিতে।
> **Docker CLI** হলো তোমার *মুখ* — তুমি বলো, dockerd সিদ্ধান্ত নেয়, containerd কাজ করে।