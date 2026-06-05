---
sidebar_position: 1
title: 'Docker Basic'
---

## 🆚 2. What is the difference between a Docker Image and a Docker Container?
এই দুটি concept Docker-এর সবচেয়ে মৌলিক বিষয়। অনেকেই শুরুতে এই দুটো গুলিয়ে ফেলেন, তাই এটি ভালোভাবে বোঝা জরুরি।

| বাস্তব জীবন | Docker |
|---|---|
| রেসিপি / blueprint | **Image** |
| রান্না করা খাবার | **Container** |

একটি রেসিপি থেকে যেমন অনেকবার রান্না করা যায়, একটি Image থেকে তেমনি অনেকগুলো Container তৈরি করা যায়। রেসিপি নিজে পরিবর্তন হয় না, কিন্তু রান্না করা খাবার খাওয়া যায়, নষ্ট হয়, পরিবর্তন হয়।

আরেকটি analogy — **Image হলো class, Container হলো object।** Object-oriented programming-এ যেমন একটি class থেকে অনেক object instantiate করা যায়, একটি Image থেকে তেমনি অনেক Container চালু করা যায়।

---

#### Docker Image কী?

**Docker Image** হলো একটি **read-only template** বা blueprint যা থেকে Container তৈরি হয়। এটি একটি static artifact — একবার build হলে নিজে আর পরিবর্তন হয় না।

Image-এ যা থাকে:
- Application code
- Runtime environment (যেমন Python, Node.js, JVM)
- System libraries এবং dependencies
- Environment variables এবং configuration
- Container start হলে কোন command চালাবে সেই instruction

Image তৈরি হয় **Dockerfile** থেকে এবং এটি multiple **read-only layers**-এ ভাগ করা থাকে।

```dockerfile
# এই Dockerfile থেকে একটি Image build হয়
FROM python:3.11-slim          # Base layer
WORKDIR /app                   # Working directory set
COPY requirements.txt .        # File copy layer
RUN pip install -r requirements.txt  # Dependency layer
COPY . .                       # App code layer
CMD ["python", "app.py"]       # Startup command
```

```bash
# Image build করার command
docker build -t my-python-app:1.0 .

# সব Image দেখার command
docker images
```

---

#### Docker Container কী?

**Docker Container** হলো একটি Image-এর **running instance**। যখন তুমি একটি Image "চালু" করো, তখন সেটি Container হয়ে যায়। Container হলো একটি isolated, live process যা actual কাজ করে।

Container চালু হওয়ার সময় Image-এর উপরে একটি **writable layer** যোগ হয়। Container চলাকালীন যত পরিবর্তন হয় (নতুন file তৈরি, data write) সব এই writable layer-এ জমা হয়। Container বন্ধ বা delete হলে এই layer মুছে যায় — মূল Image অপরিবর্তিত থাকে।

```bash
# Image থেকে Container চালু করা
docker run -d -p 8080:8080 --name my-app my-python-app:1.0

# একই Image থেকে একাধিক Container চালু করা
docker run -d -p 8081:8080 --name my-app-2 my-python-app:1.0
docker run -d -p 8082:8080 --name my-app-3 my-python-app:1.0

# চলমান Container দেখা
docker ps

# সব Container দেখা (বন্ধ সহ)
docker ps -a
```

---

#### Layer Architecture — Image থেকে Container তৈরির প্রক্রিয়া

```
Image Layers (Read-Only)
┌─────────────────────────────┐
│      CMD ["python","app.py"]│  ← Layer 4 (Image)
├─────────────────────────────┤
│      COPY . .               │  ← Layer 3 (Image)
├─────────────────────────────┤
│      pip install ...        │  ← Layer 2 (Image)
├─────────────────────────────┤
│      python:3.11-slim       │  ← Layer 1 (Base Image)
└─────────────────────────────┘
            ↓ docker run
┌─────────────────────────────┐
│   Writable Container Layer  │  ← শুধু Container-এ থাকে
├─────────────────────────────┤
│      CMD ["python","app.py"]│  ← Layer 4 (shared, read-only)
├─────────────────────────────┤
│      COPY . .               │  ← Layer 3 (shared, read-only)
├─────────────────────────────┤
│      pip install ...        │  ← Layer 2 (shared, read-only)
├─────────────────────────────┤
│      python:3.11-slim       │  ← Layer 1 (shared, read-only)
└─────────────────────────────┘
```

একটি গুরুত্বপূর্ণ বিষয় — যদি ১০টি Container একই Image থেকে চালু হয়, তারা সবাই Image-এর read-only layer **share** করে। শুধু প্রতিটির নিজস্ব writable layer আলাদা। এই কারণে Docker এত disk-efficient।


| বিষয় | Docker Image | Docker Container |
|---|---|---|
| সংজ্ঞা | Read-only blueprint/template | Image-এর running instance |
| অবস্থা | Static (পরিবর্তন হয় না) | Dynamic (চলে, থামে, পরিবর্তন হয়) |
| Storage | Disk-এ সংরক্ষিত থাকে | Memory-তে চলে |
| Writable | না | হ্যাঁ (নিজস্ব writable layer আছে) |
| তৈরি হয় | `docker build` দিয়ে | `docker run` দিয়ে |
| lifecycle | Build → Push → Pull | Create → Start → Stop → Delete |
| সংখ্যা | একটি Image থাকে | একটি Image থেকে অনেক Container হয় |
| Share করা যায় | হ্যাঁ, Docker Hub-এ push করা যায় | না, directly share হয় না |

---

#### Container-এর Lifecycle

একটি Container-এর বিভিন্ন অবস্থা থাকে:

```
Image
  ↓ docker run / docker create
Created
  ↓ docker start
Running  ←──── docker restart ────┐
  ↓ docker pause                  │
Paused                            │
  ↓ docker unpause                │
Running                           │
  ↓ docker stop                   │
Stopped ────────────────────────→─┘
  ↓ docker rm
Deleted
```

---

**Image** হলো নির্জীব blueprint — এটি describe করে container কেমন হবে। **Container** হলো সেই blueprint-এর জীবন্ত, চলমান রূপ — এটি actual কাজ করে। Image ছাড়া Container হয় না, কিন্তু একটি Image থেকে যতখুশি Container চালানো যায়।

### How is a Docker image structured in layers?
Docker Image একটি single monolithic file নয় — এটি multiple **read-only layers**-এর একটি stack। প্রতিটি layer হলো **Dockerfile**-এর একটি instruction-এর ফলাফল।

```dockerfile
FROM ubuntu:22.04          # Layer 1: Base OS layer
RUN apt-get update && \
    apt-get install -y python3    # Layer 2: Python install
WORKDIR /app               # Layer 3: Directory set
COPY requirements.txt .    # Layer 4: File copy
RUN pip install -r requirements.txt  # Layer 5: Dependencies
COPY . .                   # Layer 6: App code
CMD ["python3", "app.py"]  # Layer 7: Startup command
```

প্রতিটি instruction একটি নতুন layer তৈরি করে এবং আগের layer-এর উপর stack হয়:

```
┌─────────────────────────────────────┐
│  Layer 7: CMD ["python3","app.py"]  │ ← সবচেয়ে উপরে
├─────────────────────────────────────┤
│  Layer 6: App source code           │
├─────────────────────────────────────┤
│  Layer 5: pip dependencies          │
├─────────────────────────────────────┤
│  Layer 4: requirements.txt          │
├─────────────────────────────────────┤
│  Layer 3: /app directory            │
├─────────────────────────────────────┤
│  Layer 2: python3 installed         │
├─────────────────────────────────────┤
│  Layer 1: ubuntu:22.04 base         │ ← সবচেয়ে নিচে
└─────────────────────────────────────┘
```

#### Layer Caching — Docker-এর একটি বড় সুবিধা

প্রতিটি layer-এর একটি unique **content hash (SHA256)** থাকে। যদি কোনো layer পরিবর্তন না হয়, Docker পরবর্তী build-এ সেই layer **cache** থেকে নেয় — নতুন করে build করে না। এটি build time অনেক কমিয়ে দেয়।

```
docker build করার সময়:

Step 1/7: FROM ubuntu:22.04       ✅ Cache hit — skip
Step 2/7: RUN apt-get install...  ✅ Cache hit — skip
Step 3/7: WORKDIR /app            ✅ Cache hit — skip
Step 4/7: COPY requirements.txt   ✅ Cache hit — skip
Step 5/7: RUN pip install...      ✅ Cache hit — skip
Step 6/7: COPY . .                ❌ Cache miss — rebuild (code পরিবর্তন হয়েছে)
Step 7/7: CMD [...]               ❌ Cache miss — rebuild
```

এই কারণে Dockerfile লেখার সময় **কম পরিবর্তনশীল layers উপরে** এবং **বেশি পরিবর্তনশীল layers নিচে** রাখা উচিত।

### Layer Sharing — Disk Efficiency

একাধিক Image যদি একই base layer ব্যবহার করে, তারা সেই layer **share** করে। মানে disk-এ একবারই থাকে:

```
Image A (my-flask-app)          Image B (my-django-app)
┌────────────────────┐          ┌────────────────────┐
│  Flask app code    │          │  Django app code    │
├────────────────────┤          ├────────────────────┤
│  Flask library     │          │  Django library     │
├────────────────────┤          ├────────────────────┤
│     python:3.11    │◄────────►│     python:3.11    │
└────────────────────┘ shared!  └────────────────────┘
```

---

### What is the Union File System (UnionFS) and how does it enable image layering?
**Union File System (UnionFS)** হলো একটি special type-এর filesystem যা multiple directory বা filesystem-কে একসাথে **merge** করে একটি single unified view দেখায়। User-এর কাছে মনে হয় একটি single filesystem, কিন্তু আসলে ভেতরে অনেকগুলো layer আলাদাভাবে exist করে।

সহজ analogy: ধরো তোমার কাছে একটি স্বচ্ছ acetate sheet-এর stack আছে। প্রতিটি sheet-এ কিছু আঁকা আছে। সব sheet একসাথে দেখলে মনে হয় একটি complete ছবি — কিন্তু আসলে ছবিটি অনেক layer-এ ভাগ করা।

#### Docker-এ ব্যবহৃত UnionFS Implementation: OverlayFS

Modern Docker সাধারণত **OverlayFS** ব্যবহার করে (পুরনো version-এ AUFS ব্যবহার হতো)। OverlayFS Linux kernel-এ built-in।

OverlayFS মূলত দুটি directory নিয়ে কাজ করে:

- **lowerdir** — Read-only Image layers (একাধিক হতে পারে)
- **upperdir** — Writable Container layer
- **merged** — User যা দেখে, lowerdir ও upperdir-এর combined view

```
                    ┌──────────────────┐
User দেখে →         │   merged view    │  (lowerdir + upperdir একসাথে)
                    └──────────────────┘
                           ↑ ↑
              ┌────────────┘ └────────────┐
              │                           │
   ┌──────────────────┐      ┌──────────────────┐
   │    upperdir      │      │    lowerdir       │
   │ (writable layer) │      │ (read-only Image) │
   └──────────────────┘      └──────────────────┘
```

#### Copy-on-Write (CoW) Strategy

UnionFS-এর সবচেয়ে গুরুত্বপূর্ণ concept হলো **Copy-on-Write (CoW)**।

নিয়ম হলো: কোনো file **read** করার সময় সরাসরি lower layer থেকে পড়া হয়। কিন্তু কোনো file **modify** করার সময় সেটি প্রথমে upper writable layer-এ **copy** করা হয়, তারপর সেখানে পরিবর্তন করা হয়। মূল lower layer-এর file অপরিবর্তিত থাকে।

```
Container-এর ভেতরে /etc/nginx/nginx.conf পরিবর্তন করলে:

১. Docker দেখে file টি lower layer (Image)-এ আছে
২. File টি upper layer (writable)-এ copy করা হয়
৩. Upper layer-এর copy পরিবর্তন করা হয়
৪. Merged view-এ upper layer-এর version দেখায়
৫. Lower layer-এর original file অক্ষত থাকে

Lower layer:  /etc/nginx/nginx.conf  (original, unchanged ✅)
Upper layer:  /etc/nginx/nginx.conf  (modified copy ✏️)
Merged view:  /etc/nginx/nginx.conf  (upper layer-এরটা দেখায়)
```

---

### What happens to data written inside a running container when it stops?

এটি Docker-এর সবচেয়ে গুরুত্বপূর্ণ এবং practical বিষয়গুলোর একটি।

#### Default Behavior: Data হারিয়ে যায়

Container-এ লেখা সব data **writable layer**-এ জমা হয়। Container **stop** করলে data থাকে, কিন্তু Container **remove (rm)** করলে সেই writable layer সহ সব data চিরতরে মুছে যায়।

```bash
# Container চালু করো
docker run -it --name test-container ubuntu bash

# Container-এর ভেতরে একটি file তৈরি করো
echo "এই data হারিয়ে যাবে" > /tmp/my-data.txt

# Container থেকে বের হও এবং delete করো
exit
docker rm test-container

# Container আর নেই — my-data.txt ও নেই! 💀
```

#### Data Persistence-এর সমাধান

Docker তিনটি উপায়ে data persistent করার সুবিধা দেয়:

**① Volume (সবচেয়ে recommended)**
Docker নিজে manage করে একটি dedicated storage area। Container delete হলেও Volume থাকে।

```bash
# Volume তৈরি করো
docker volume create my-data

# Volume সহ Container চালু করো
docker run -d \
  --name my-db \
  -v my-data:/var/lib/mysql \
  mysql:8.0

# Container delete করো
docker rm -f my-db

# Volume এখনও আছে! নতুন Container-এ same data পাবে
docker run -d \
  --name my-db-new \
  -v my-data:/var/lib/mysql \
  mysql:8.0
```

**② Bind Mount**
Host machine-এর একটি specific directory, Container-এর সাথে সরাসরি connect করা হয়।

```bash
# Host-এর /home/user/data folder, Container-এর /app/data-এ mount করা
docker run -d \
  -v /home/user/data:/app/data \
  my-app
```

**③ tmpfs Mount**
Data শুধু memory-তে থাকে। Container বন্ধ হলে মুছে যায়। Sensitive temporary data-এর জন্য ব্যবহার হয়।

```bash
docker run -d \
  --tmpfs /app/temp \
  my-app
```

#### তিনটি পদ্ধতির তুলনা

| বিষয় | Volume | Bind Mount | tmpfs |
|---|---|---|---|
| Data কোথায় থাকে | Docker-managed disk | Host filesystem | Memory |
| Container delete হলে | Volume থাকে ✅ | Host file থাকে ✅ | মুছে যায় ❌ |
| Docker manage করে | হ্যাঁ | না | হ্যাঁ |
| Best use case | Database, persistent data | Development, live reload | Sensitive temp data |

---

### Can you run multiple containers from the same image simultaneously?

**হ্যাঁ — এটাই Docker-এর অন্যতম প্রধান শক্তি।** একটি Image থেকে যতখুশি Container simultaneously চালানো যায়। প্রতিটি Container সম্পূর্ণ আলাদা এবং independent।

প্রতিটি Container Image-এর read-only layers **share** করে, কিন্তু প্রতিটির নিজস্ব আলাদা **writable layer**, **network interface**, **PID namespace** এবং **process space** থাকে।

Web application scale করার সময় একই Image থেকে multiple Container চালানো হয় এবং সামনে একটি **load balancer** রাখা হয়:

```bash
# একই Image থেকে ৩টি Container আলাদা port-এ চালু করো
docker run -d -p 8081:8080 --name app-instance-1 my-web-app:1.0
docker run -d -p 8082:8080 --name app-instance-2 my-web-app:1.0
docker run -d -p 8083:8080 --name app-instance-3 my-web-app:1.0

# সব চলছে কিনা দেখো
docker ps
```

```
User request
     ↓
Load Balancer (nginx / HAProxy)
     ↓         ↓         ↓
  app-1      app-2      app-3
(port 8081) (port 8082) (port 8083)
     ↑           ↑           ↑
     └───────────┴───────────┘
      সবাই একই Image থেকে তৈরি
```

#### Docker Compose দিয়ে Scale করা

**Docker Compose** ব্যবহার করে আরও সহজে scale করা যায়:

```bash
# একই service-এর ৫টি instance চালু করো
docker compose up --scale web-app=5
```

#### Kubernetes-এ এই concept

Production-এ **Kubernetes** এই same concept ব্যবহার করে। Kubernetes-এ একটি **Pod** basically একটি Container, এবং একটি **Deployment** define করে কতগুলো identical Pod (same Image থেকে) চলবে:

```yaml
# এই Deployment ৩টি identical Container চালাবে
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3          # ৩টি Container
  template:
    spec:
      containers:
      - name: web-app
        image: my-web-app:1.0   # সবাই একই Image
```

---

## 📄 3. What is a Dockerfile, and how does it define an image?
**Dockerfile** হলো একটি plain text file যেখানে step-by-step instruction লেখা থাকে — Docker এই instruction গুলো পড়ে একটি **Image** build করে। এটি essentially একটি **recipe** বা **blueprint** যা Docker-কে বলে দেয়:

- কোন base থেকে শুরু করতে হবে
- কোন software install করতে হবে
- কোন file copy করতে হবে
- Container চালু হলে কোন command run করতে হবে

সহজ কথায়: **Dockerfile = Image-এর source code।** ঠিক যেমন source code থেকে executable তৈরি হয়, Dockerfile থেকে Docker Image তৈরি হয়।

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y python3
WORKDIR /app
COPY . .
CMD ["python3", "app.py"]
```

উপরের উদাহরণে:
- `FROM` — base image নির্বাচন করে
- `RUN` — build time-এ command চালায়
- `WORKDIR` — working directory set করে
- `COPY` — host থেকে file container-এ আনে
- `CMD` — container start হলে কী চলবে তা নির্ধারণ করে

> **মনে রাখুন:** Dockerfile → `docker build` → Image → `docker run` → Container।
> Image হলো blueprint, Container হলো সেই blueprint থেকে তৈরি চলমান instance।

**1. `FROM` — Base Image নির্ধারণ:** প্রতিটি Dockerfile-এর প্রথম instruction হতে হয় `FROM`। এটি বলে দেয় কোন base Image-এর উপর নতুন Image build হবে।

**2. `WORKDIR` — Working Directory set করা:** Container-এর ভেতরে subsequent instruction গুলো কোন directory-তে চলবে তা set করে। Directory না থাকলে automatically তৈরি করে।

**3. `COPY` এবং `ADD` — File Copy করা:** Host machine থেকে Container-এ file বা directory copy করে।

**`ADD`** `COPY`-এর মতোই, কিন্তু দুটো extra feature আছে:

```dockerfile
# ADD দিয়ে URL থেকে file download করা যায়
ADD https://example.com/file.tar.gz /app/

# ADD .tar.gz file automatically extract করে
ADD archive.tar.gz /app/
```

> **Best practice:** সাধারণ file copy-র জন্য সবসময় `COPY` ব্যবহার করো। `ADD` শুধু তখনই ব্যবহার করো যখন auto-extraction দরকার।
---
**4. `RUN` — Command Execute করা:** Image build করার সময় command চালায় এবং result-কে একটি নতুন layer হিসেবে save করে।

> **Important:** প্রতিটি `RUN` instruction একটি নতুন layer তৈরি করে। তাই related command গুলো `&&` দিয়ে একটি `RUN`-এ লেখা উচিত — এতে layer সংখ্যা কমে এবং Image size ছোট হয়।

---

**5. `CMD` এবং `ENTRYPOINT` — Container Startup Command:** এই দুটো instruction define করে Container চালু হলে কী execute হবে।

**`CMD`** — Default command যা override করা যায়:

```dockerfile
# Exec form (recommended)
CMD ["python3", "app.py"]

# Shell form
CMD python3 app.py

# docker run-এ অন্য command দিলে CMD override হয়
# docker run my-image python3 other_script.py
```

**`ENTRYPOINT`** — Fixed command যা সবসময় চলে, override করা যায় না (সহজে):

```dockerfile
ENTRYPOINT ["python3"]

# এখন Container সবসময় python3 দিয়ে শুরু হবে
# docker run my-image app.py → python3 app.py চলবে
# docker run my-image other.py → python3 other.py চলবে
```

**`CMD` + `ENTRYPOINT` একসাথে** — সবচেয়ে flexible pattern:

```dockerfile
# ENTRYPOINT = fixed executable
# CMD = default argument (override করা যায়)
ENTRYPOINT ["python3"]
CMD ["app.py"]

# Default: python3 app.py
# Override: docker run my-image other.py → python3 other.py
```

---

**6. `ENV` — Environment Variable set করা**

```dockerfile
ENV APP_ENV=production
ENV PORT=8080
ENV DB_HOST=localhost DB_PORT=5432

# Container-এর ভেতরে এবং পরবর্তী instruction-এ ব্যবহার করা যায়
RUN echo "Running in $APP_ENV mode"
```

---

**7. `EXPOSE` — Port Document করা:** Container কোন port-এ listen করে তা document করে। এটি শুধু **documentation** — actual port mapping `docker run -p` দিয়ে করতে হয়।

**8. `VOLUME` — Mount Point define করা:** Persistent data storage-এর জন্য mount point declare করে।

**9. `ARG` — Build-time Argument:** `docker build` করার সময় pass করা যায়, কিন্তু runtime-এ available থাকে না।

**10. `USER` — User পরিবর্তন করা:** Security-র জন্য root ছাড়া অন্য user দিয়ে process চালানো:

```dockerfile
# User তৈরি করো
RUN groupadd -r appuser && useradd -r -g appuser appuser

# সেই user-এ switch করো
USER appuser

# এরপর সব command এই user হিসেবে চলবে
CMD ["python3", "app.py"]
```

---

### What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?

| বিষয় | `CMD` | `ENTRYPOINT` |
|---|---|---|
| কাজ | Default command দেয় | Fixed executable নির্ধারণ করে |
| Override | `docker run`-এ সহজে override হয় | সহজে override হয় না |
| Argument | Replace হয় | Append হয় |

```dockerfile
# CMD উদাহরণ
CMD ["python3", "app.py"]
# docker run myimage bash → python3 বাদ দিয়ে bash চলবে

# ENTRYPOINT উদাহরণ
ENTRYPOINT ["python3"]
CMD ["app.py"]
# docker run myimage other.py → python3 other.py চলবে
```

`ENTRYPOINT` এবং `CMD` একসাথে ব্যবহার করলে `ENTRYPOINT` হয় main executable আর `CMD` হয় default argument। এটি flexible container তৈরির best practice।

> **Exec form ব্যবহার করুন:** সবসময় JSON array format ব্যবহার করুন: `["python3", "app.py"]`
> Shell form `python3 app.py` এড়িয়ে চলুন, কারণ shell form signal handling সঠিকভাবে করে না।

---

### What is the difference between `RUN`, `CMD`, and `ENTRYPOINT`?

| Instruction | কখন চলে | কাজ |
|---|---|---|
| `RUN` | Build time | Image-এ নতুন layer যোগ করে। Package install, file compile করতে ব্যবহার হয়। |
| `CMD` | Run time | Container start হলে default command চালায়। Override করা যায়। |
| `ENTRYPOINT` | Run time | Container-এর main process নির্ধারণ করে। সহজে override হয় না। |

```dockerfile
FROM python:3.11-slim

# Build time: dependency install করে
RUN pip install flask

WORKDIR /app
COPY . .

# Run time: container চালু হলে এটি চলে
CMD ["python3", "app.py"]
```

> **সাধারণ ভুল:** `RUN` দিয়ে service start করার চেষ্টা করবেন না — এটি build time-এ চলে এবং container চালু হলে বন্ধ হয়ে যায়। Service start করতে `CMD` বা `ENTRYPOINT` ব্যবহার করুন।

---

### What is the difference between `COPY` and `ADD` instructions?

| বিষয় | `COPY` | `ADD` |
|---|---|---|
| Local file copy | ✅ হ্যাঁ | ✅ হ্যাঁ |
| URL থেকে download | ❌ না | ✅ হ্যাঁ |
| .tar.gz auto-extract | ❌ না | ✅ হ্যাঁ |
| Recommended | ✅ বেশিরভাগ ক্ষেত্রে | ⚠️ শুধু দরকারে |

```dockerfile
# COPY — simple এবং predictable
COPY src/ /app/src/
COPY package.json /app/

# ADD — extra features সহ
ADD https://example.com/file.tar.gz /tmp/
ADD archive.tar.gz /app/
```

Best practice হলো সাধারণ file copy-র জন্য সবসময় `COPY` ব্যবহার করা। `ADD` শুধুমাত্র তখন ব্যবহার করুন যখন tar extraction বা URL download সত্যিই দরকার।

> **কেন `COPY` prefer করা হয়?** `ADD`-এর behavior implicit — কখন extract হবে বা download হবে তা বোঝা কঠিন। `COPY` explicit এবং transparent, তাই Dockerfile বুঝতে সহজ হয়।

---

### What is a multi-stage build and when would you use it?

Multi-stage build হলো একটি Dockerfile-এ একাধিক `FROM` instruction ব্যবহার করার কৌশল। এতে build environment আলাদা এবং final image ছোট রাখা যায়।

```dockerfile
# Stage 1: Build
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

# Stage 2: Production
FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

প্রথম stage (`builder`)-এ Go compiler, source code, এবং build tools থাকে। দ্বিতীয় stage-এ শুধু compiled binary copy করা হয়। Final image-এ Go compiler বা source code থাকে না।

| | Without multi-stage | With multi-stage |
|---|---|---|
| Image size | অনেক বড় (শত MB – GB) | অনেক ছোট (কয়েক MB) |
| Security | Build tools expose থাকে | শুধু runtime binary |
| Production ready | ❌ | ✅ |

> **কখন ব্যবহার করবেন?** Compiled languages (Go, Java, C++, Rust), frontend build (Node.js → static files), এবং যেকোনো ক্ষেত্রে যেখানে build-time dependency production-এ দরকার নেই।

---

### How does the order of instructions in a Dockerfile affect build cache?

Docker প্রতিটি instruction-এর জন্য একটি layer cache রাখে। কোনো instruction বা তার পূর্ববর্তী কোনো instruction পরিবর্তন হলে, সেই layer থেকে পরের সব layer-এর cache invalidate হয়ে যায়।

**❌ খারাপ ক্রম (ধীর build):**

```dockerfile
COPY . .
RUN pip install -r requirements.txt
# যেকোনো source file পরিবর্তনে pip install আবার চলবে
```

**✅ ভালো ক্রম (দ্রুত build):**

```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# requirements.txt না বদলালে pip cache ব্যবহার হবে
```

**Cache optimization strategy:**

```
Base image
  └── System packages (কম পরিবর্তন হয়)
        └── Dependency files (package.json / requirements.txt)
              └── Install dependencies (RUN npm install)
                    └── Source code COPY (বেশি পরিবর্তন হয়)
```

> **মূল নিয়ম:** যে layer কম পরিবর্তন হয় তা উপরে রাখুন, বেশি পরিবর্তন হয় তা নিচে রাখুন। Dependencies আগে install করুন, তারপর source code copy করুন।

## 🏗️ 4. What is the Docker build context, and why does it matter?

Docker build context হলো সেই directory যা `docker build` command চালানোর সময় Docker daemon-এ পাঠানো হয়। সহজ কথায়, এটি হলো সেই সব file এবং folder-এর সমষ্টি যা Docker image build করার সময় available থাকে।

```bash
docker build -t myapp .
#                     ↑
#               এই "." হলো build context
#               (current directory)
```

`docker build` চালালে Docker প্রথমে পুরো context directory টি tar করে Docker daemon-এ পাঠায়, তারপর Dockerfile-এর instruction অনুযায়ী image build করে।

---

#### Build context কীভাবে কাজ করে?

```
আপনার Machine
│
├── src/
├── tests/
├── node_modules/   ← হাজার হাজার file!
├── .git/           ← বড় history
├── Dockerfile
└── .env            ← secret থাকতে পারে!

     ↓ docker build . চালালে

Docker Daemon সব কিছু পায়
(যদি .dockerignore না থাকে)
```

Build context গুরুত্বপূর্ণ কারণ:

1. **Build speed** — context যত বড়, daemon-এ পাঠাতে তত বেশি সময় লাগে
2. **Security** — `.env`, secret key, credential সহ সব file চলে যেতে পারে
3. **Image size** — অপ্রয়োজনীয় file image-এ ঢুকে যেতে পারে

---

### `.dockerignore` file — build context নিয়ন্ত্রণ করার উপায়

`.gitignore`-এর মতোই `.dockerignore` file দিয়ে কোন file বা folder build context থেকে বাদ দেওয়া যায়।

```
# .dockerignore

node_modules/
.git/
.env
*.log
tests/
README.md
.DS_Store
```

```bash
# .dockerignore ছাড়া
Sending build context to Docker daemon  500MB   ← ধীর!

# .dockerignore সহ
Sending build context to Docker daemon  1.2MB   ← দ্রুত!
```

---

#### ভিন্ন directory থেকে build context দেওয়া

```bash
# অন্য directory কে context হিসেবে দেওয়া
docker build -t myapp /path/to/context

# Dockerfile আলাদা জায়গায়, context আলাদা জায়গায়
docker build -f /path/to/Dockerfile -t myapp /path/to/context

# শুধু Dockerfile দিয়ে build (context ছাড়া)
docker build - < Dockerfile
```

---

#### Context বড় হলে কী সমস্যা হয়?

| সমস্যা | কারণ |
|---|---|
| Build অনেক ধীর | পুরো context daemon-এ upload হয় |
| Cache কাজ করে না ঠিকমতো | অপ্রয়োজনীয় file পরিবর্তনে cache invalidate হয় |
| Image-এ secret চলে যায় | `.env` বা credential file context-এ থাকলে |
| Disk space নষ্ট | `node_modules`, `.git` image layer-এ ঢুকে যায় |

---
Docker build-এ প্রতিটি step-এ cache ব্যবহার করা যাবে কিনা তা নির্ধারণ করতে নির্দিষ্ট rules follow করে।

**Rule 1: Parent layer-এর cache miss হলে সব পরের layer-এর cache miss**

এটিই সবচেয়ে গুরুত্বপূর্ণ rule। Cache একটি chain — মাঝখানে ভাঙলে বাকি সবটাই rebuild হয়:

```
FROM python:3.11     → ✅ Cache hit
WORKDIR /app         → ✅ Cache hit
COPY req.txt .       → ❌ Cache miss  ← এখানে ভাঙলো
RUN pip install      → ❌ Cache miss  ← automatically miss
COPY . .             → ❌ Cache miss  ← automatically miss
CMD [...]            → ❌ Cache miss  ← automatically miss
```

**Rule 2: `RUN` instruction-এর জন্য — Command text হুবহু same হতে হবে**

```dockerfile
# এই দুটো different layer — cache hit হবে না
RUN apt-get install -y curl git
RUN apt-get install -y git curl    # order আলাদা = different hash
```

**Rule 3: `COPY` এবং `ADD`-এর জন্য — File content check হয়**

Docker শুধু filename বা timestamp দেখে না — **file-এর actual content-এর checksum** compare করে।

```dockerfile
COPY requirements.txt .
```

```
requirements.txt-এর content পরিবর্তন হলে → ❌ Cache miss
requirements.txt-এর content same হলে    → ✅ Cache hit
                                           (timestamp আলাদা হলেও)
```

**Rule 4: `ARG` পরিবর্তন হলে সেই line থেকে cache miss**

```dockerfile
ARG VERSION=1.0
RUN echo "Version: $VERSION"    # VERSION বদলালে এখান থেকে miss
COPY . .                        # এটাও miss
```
----
### What happens when you use `--no-cache` in a `docker build` command?


`--no-cache` flag দিলে Docker সব layer-এর existing cache **সম্পূর্ণ ignore** করে এবং প্রতিটি instruction fresh ভাবে execute করে।

```bash
# Normal build — cache ব্যবহার করে
docker build -t my-app .

# Cache ছাড়া build — সব instruction নতুন করে চলে
docker build --no-cache -t my-app .
```

### কখন `--no-cache` ব্যবহার করবে?

**① External dependency update নিশ্চিত করতে**

```dockerfile
RUN apt-get update && apt-get install -y curl
```

Cache থাকলে `apt-get update` আবার চলে না — পুরনো package list থেকে install হয়। `--no-cache` দিলে latest package পাওয়া যায়।

```bash
# Security patch পাওয়ার জন্য fresh build
docker build --no-cache -t my-app:security-patched .
```

**② Cache corruption সন্দেহ হলে**

```bash
# কিছু একটা ঠিকমতো কাজ করছে না,
# cache থেকে পুরনো কিছু আসছে কিনা test করতে
docker build --no-cache -t my-app:debug .
```

**③ CI/CD pipeline-এ fresh build নিশ্চিত করতে**

```yaml
# GitHub Actions-এ
- name: Build Docker Image
  run: docker build --no-cache -t my-app:${{ github.sha }} .
```

**④ Base image update হলে**

```bash
# python:3.11-slim নতুন version release হয়েছে
docker pull python:3.11-slim        # নতুন version pull করো
docker build --no-cache -t my-app . # Cache ছাড়া rebuild করো
```

#### `--no-cache`-এর বিকল্প: Cache-from

Production-এ প্রতিবার `--no-cache` ব্যবহার করা slow। বরং আগের build-এর Image থেকে cache নেওয়া যায়:

```bash
# আগের Image-কে cache source হিসেবে ব্যবহার করো
docker build \
  --cache-from my-app:latest \
  -t my-app:new .
```
এটি CI/CD-এ খুব কাজের — registry থেকে latest Image pull করে তার layer গুলো cache হিসেবে ব্যবহার করা যায়।

---


## 🔄 5. What is the Docker lifecycle (pull, build, run, stop, remove)?
Docker-এ একটি application-এর জীবনচক্র কয়েকটি পরিষ্কার ধাপে ভাগ করা যায়:

**ধাপ 1: `docker pull` — Image নামিয়ে আনা:** Registry (যেমন Docker Hub) থেকে local machine-এ Image download করে।

**ধাপ 2: `docker build` — Image তৈরি করা:** Dockerfile থেকে নিজের Image build করা।

**ধাপ 3: `docker run` — Container চালু করা:** Image থেকে নতুন Container তৈরি করে চালু করে।

**ধাপ 4: `docker stop` / `docker pause` — Container থামানো**

**ধাপ 5: `docker start` — Stopped Container পুনরায় চালু করা**

**ধাপ 6: `docker rm` / `docker rmi` — মুছে ফেলা**

**ধাপ 7: `docker push` — Registry-তে আপলোড করা**

---

### What is the difference between `docker stop` and `docker kill`?

এই দুটোই Container বন্ধ করে — কিন্তু পদ্ধতি সম্পূর্ণ আলাদা।

#### `docker stop` — Graceful Shutdown

`docker stop` একটি two-step process follow করে:

```
Step 1: SIGTERM signal পাঠায়
        ↓
        Application-কে বলে "তুমি বন্ধ হতে চলেছো,
        নিজের কাজ গুছিয়ে নাও"
        ↓
        Application নিজের মতো cleanup করে:
        - চলমান request শেষ করে
        - Database connection বন্ধ করে
        - File ঠিকমতো close করে
        ↓
Step 2: Timeout (default 10 seconds) পরেও না থামলে
        SIGKILL পাঠায় (force kill)
```

```bash
# Default 10 second timeout দিয়ে stop
docker stop my-container

# Custom timeout (30 seconds)
docker stop --time 30 my-container
docker stop -t 30 my-container

# একসাথে multiple container stop
docker stop container1 container2 container3
```

#### `docker kill` — Immediate Force Kill

`docker kill` সরাসরি **SIGKILL** পাঠায় — কোনো warning নেই, কোনো cleanup সুযোগ নেই।

```
SIGKILL পাঠায়
↓
OS সরাসরি process terminate করে
↓
Application কিছু করার সুযোগ পায় না
↓
Container তাৎক্ষণিক বন্ধ হয়
```

```bash
# Default SIGKILL দিয়ে kill
docker kill my-container

# Custom signal দিয়ে kill
docker kill --signal SIGTERM my-container   # stop-এর মতো
docker kill --signal SIGUSR1 my-container   # custom signal
docker kill --signal 9 my-container         # SIGKILL = 9
```

#### কখন কোনটি ব্যবহার করবে?

| Situation | Command |
|---|---|
| Normal shutdown | `docker stop` ✅ |
| Graceful shutdown নিশ্চিত করতে | `docker stop -t 60` |
| App hang হয়ে গেছে, সাড়া দিচ্ছে না | `docker kill` |
| Development-এ দ্রুত restart করতে | `docker kill` তারপর `docker start` |
| Production database বন্ধ করতে | `docker stop -t 120` (data loss এড়াতে) |
| CI/CD-এ দ্রুত cleanup করতে | `docker kill` |

---

### What is the difference between `docker rm` and `docker rmi`?

নামে মিল আছে, কিন্তু কাজ সম্পূর্ণ আলাদা।

#### `docker rm` — Container মুছে ফেলা

```bash
# Stopped container মুছে ফেলো
docker rm my-container

# Running container force মুছে ফেলো (-f = force)
docker rm -f my-container

# Container মুছে ফেলো এবং তার volume ও মুছে ফেলো
docker rm -v my-container

# সব stopped container মুছে ফেলো
docker container prune

# একটি command-এ run + automatic remove
# Container বন্ধ হলে automatically মুছে যাবে
docker run --rm my-image
```

```
docker rm করলে কী মুছে যায়:
✅ Container-এর writable layer
✅ Container metadata
✅ Container-এর network configuration
❌ Image (অক্ষত থাকে)
❌ Named Volume (অক্ষত থাকে)
❌ Bind Mount (host file অক্ষত থাকে)
```

#### `docker rmi` — Image মুছে ফেলা

```bash
# Image মুছে ফেলো
docker rmi my-app:1.0

# Image ID দিয়ে মুছে ফেলো
docker rmi a1b2c3d4e5f6

# Multiple image মুছে ফেলো
docker rmi my-app:1.0 my-app:2.0 nginx:latest

# Force মুছে ফেলো (Container চলছে তবুও)
docker rmi -f my-app:1.0

# সব unused (dangling) image মুছে ফেলো
docker image prune

# সব image মুছে ফেলো (চলছে না এমন)
docker image prune -a
```

```
docker rmi করলে কী হয়:
✅ Image-এর layers মুছে যায় (যদি অন্য Image share না করে)
✅ Image metadata মুছে যায়
✅ Image tag মুছে যায়
❌ Image থেকে তৈরি Container (আগে rm করতে হবে)
❌ Shared layers (অন্য Image ব্যবহার করলে সেগুলো থাকে)
```
---

### What happens when you run `docker run` on an image not present locally?

এটি Docker-এর একটি intelligent behavior — manually `pull` না করলেও চলে।


```bash
docker run nginx:latest
```

Docker এই steps follow করে:

```
Step 1: Local cache check করো
        ↓
        "nginx:latest আমার কাছে আছে?"
        ↓
┌───────────────────────────────────┐
│ আছে ✅                            │  না থাকলে ❌
│ সরাসরি Container তৈরি করো        │      ↓
└───────────────────────────────────┘  Step 2: Registry-তে খোঁজো
                                            ↓
                                       Docker Hub-এ
                                       nginx:latest আছে?
                                            ↓
                                    ┌───────────────────┐
                                    │ আছে ✅             │
                                    │ Pull শুরু করো      │
                                    └───────────────────┘
                                            ↓
                                       Step 3: Layer by layer
                                       download করো
                                            ↓
                                       Step 4: Image locally
                                       cache করো
                                            ↓
                                       Step 5: Container
                                       তৈরি করে চালু করো
```

---

### What is the difference between `docker run` and `docker start`?

এটি অনেকের কাছেই confusing — দুটোই Container চালু করে, কিন্তু পার্থক্য মৌলিক।

**`docker run` — নতুন Container তৈরি করে চালু করে**

`docker run` = `docker create` + `docker start` একসাথে।

**প্রতিবার নতুন Container তৈরি হয়।**

```bash
docker run -d --name web-1 -p 8080:80 nginx
docker run -d --name web-2 -p 8081:80 nginx
docker run -d --name web-3 -p 8082:80 nginx

# তিনটি আলাদা Container তৈরি হলো
docker ps
# CONTAINER ID   NAME    STATUS
# a1b2c3d4e5f6   web-3   Up 5 seconds
# b2c3d4e5f6a7   web-2   Up 8 seconds
# c3d4e5f6a7b8   web-1   Up 12 seconds
```

`docker run`-এ যা specify করা যায়:

```bash
docker run \
  -d \                          # Detached mode
  --name my-app \               # Container নাম
  -p 8080:80 \                  # Port mapping
  -e DB_HOST=postgres \         # Environment variable
  -v /data:/app/data \          # Volume mount
  --network my-network \        # Network
  --memory 512m \               # Memory limit
  --cpus 1.0 \                  # CPU limit
  --restart unless-stopped \    # Restart policy
  my-app:1.0                    # Image
```

#### `docker start` — আগে তৈরি হওয়া Container পুনরায় চালু করে

`docker start` কোনো নতুন Container তৈরি করে না। শুধু **existing stopped Container** চালু করে — আগের configuration সহ।

```bash
# Container stop করো
docker stop web-1

# Same Container আবার চালু করো (নতুন Container নয়)
docker start web-1

# Interactive mode-এ start (stdin attach করো)
docker start -i web-1

# Attach করে start (output দেখতে)
docker start -a web-1
```

#### পার্থক্যটি visually দেখা যাক

```
docker run:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Image ──────────────► নতুন Container তৈরি
                            │
                            ▼
                       Container চালু
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
প্রতিবার নতুন Container, নতুন writable layer,
নতুন IP address, নতুন Container ID


docker start:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stopped Container ──► Same Container চালু
                       (কিছুই নতুন হয় না)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Same Container ID, same writable layer,
same configuration — সব আগের মতো
```


#### Restart Policy — Automatic Start

Production-এ `docker start` manually না করে **restart policy** ব্যবহার করা ভালো:

```bash
docker run -d \
  --restart unless-stopped \   # Server restart হলে auto-start
  --name my-app \
  my-app:1.0

# Restart policy options:
# no            — কখনো restart করে না (default)
# always        — সবসময় restart করে
# on-failure    — শুধু error-এ restart করে
# unless-stopped — manually stop না করলে সবসময় restart করে
```