---
sidebar_position: 2
title: ''
---

## 🤝 52. What is a 3-way handshake in TCP?
**3-Way Handshake** হলো TCP প্রোটোকলে এমন একটি প্রক্রিয়া, যার মাধ্যমে ক্লায়েন্ট এবং সার্ভার একে অপরের সাথে ডেটা আদান-প্রদানের আগে একটি লজিক্যাল কানেকশন তৈরি করে। 
- ডেটা ট্রান্সফার শুরু করার আগে ক্লায়েন্ট এবং সার্ভারকে অবশ্যই কিছু নিয়ম (যেমন ইনিশিয়াল সিকোয়েন্স নাম্বার, উইন্ডো সাইজ) বিনিময় করতে হয়, আর এ কাজগুলো এই হ্যান্ডশেকের মাধ্যমে করা হয়। 

### 🤔 Why does TCP need exactly 3 steps (not 2 or 4) to establish a connection?
TCP একটি বাই-ডিরেকশনাল (Bidirectional) বা দ্বিমুখী কানেকশন। অর্থাৎ ক্লায়েন্ট টু সার্ভার একটি দিক এবং সার্ভার টু ক্লায়েন্ট আরেকটি দিক।
- **২টি স্টেপ কেন নয়?** ২ স্টেপে ক্লায়েন্ট শুধু বলতে পারে "আমি রেডি (SYN)" এবং সার্ভার বলতে পারে "আমিও রেডি (SYN-ACK)"। কিন্তু ক্লায়েন্ট যে সার্ভারের মেসেজটি পেয়েছে এবং ডেটা পাঠাতে প্রস্তুত, তা তো সার্ভারেরও কনফার্ম হওয়া দরকার। 
- **৪টি স্টেপ কেন নয়?** সার্ভার চাইলে তার ডাবল কনফার্মেশন দুটি আলাদা মেসেজে (ACK একটিতে, নিজের SYN আরেকটিতে) পাঠাতে পারতো। কিন্তু পারফরম্যান্স বাড়ানোর জন্য TCP এই দুটি মেসেজকে একসাথে জোড়া দিয়ে একটি প্যাকেট বানিয়ে দেয় (`SYN-ACK`), ফলে স্টেপ ৪ থেকে কমে ৩-এ নেমে আসে।

### 🚨 What is a SYN flood attack and how is it mitigated?
```text
Client          Server
  │──── SYN ────▶│  "connection করতে চাই"
  │◀── SYN-ACK ──│  "ঠিক আছে, ready"
  │──── ACK ────▶│  "connected!"
```
Server প্রতিটা **half-open connection** এর জন্য memory তে state রাখে — ACK আসার অপেক্ষায়।

#### 🔴 SYN Flood Attack কী?
Attacker **হাজার হাজার SYN packet** পাঠায়, কিন্তু কখনো ACK পাঠায় না।
```text
Attacker        Server
  │──── SYN ────▶│  Server memory তে entry!
  │──── SYN ────▶│  আরেকটা entry!
  │──── SYN ────▶│  আরেকটা!
  │──── SYN ────▶│  আরেকটা!
  │   (no ACK)   │  
                 │
            ┌────┴────┐
            │ backlog │
            │ queue   │
            │ FULL!   │
            └────┬────┘
                 │
Real Client ──── SYN ────▶ ❌ REJECTED!
              "Sorry, no room!"
```
Server এর **SYN backlog queue** ভরে যায় → legitimate user connect করতে পারে না → **DoS (Denial of Service)!**

#### ⚠️ Attack আরো Dangerous কেন? — Spoofed IPs
```text
Attacker সব SYN এ fake source IP দেয়:

SYN (from 1.2.3.4)   ─▶ Server
SYN (from 5.6.7.8)   ─▶ Server  
SYN (from 9.10.11.12)─▶ Server
     ↑
  সব fake! Attacker এর real IP লুকানো।

Server SYN-ACK পাঠায় fake IPs এ →
কেউ ACK দেয় না →
Queue ভরতেই থাকে!
```

#### 💻 Server এ কী হয়?
```text
Normal state:
┌─────────────────────────┐
│ SYN Queue               │
│ [conn1][conn2][    ][ ] │  ← খালি জায়গা আছে
└─────────────────────────┘

During SYN Flood:
┌─────────────────────────┐
│ SYN Queue               │
│[syn][syn][syn][syn][syn]│  ← FULL!
│[syn][syn][syn][syn][syn]│
└─────────────────────────┘
         ↓
New connection? ❌ DROP!
CPU usage?      📈 HIGH!
Memory?         📈 EXHAUSTED!
```

#### 🛡️ Mitigation Techniques

##### 🍪 ১. SYN Cookies — সবচেয়ে Effective!
Server **queue তে কিছু রাখে না** — বরং একটা cryptographic cookie পাঠায়।
```text
Normal Handshake:
Client ──SYN──▶ Server stores state in queue
Client ◀─SYN-ACK── Server

SYN Cookie:
Client ──SYN──▶ Server calculates cookie
                (hash of IP, port, timestamp, secret)
Client ◀─SYN-ACK (cookie as SEQ number)──

Real client:
Client ──ACK (cookie+1)──▶ Server verifies cookie ✅
                            এখন connection open করো

Fake client:
No ACK ever comes → Server lost nothing! ✅
```
```text
Cookie = Hash(
  src_ip + src_port +
  dst_ip + dst_port +
  timestamp +
  server_secret
)
```
Queue তে কিছু নেই → flood করলেও memory নষ্ট হয় না!

---
##### ⏱️ ২. SYN Timeout কমানো
Half-open connection বেশিক্ষণ রাখবো না:
```text
Default timeout: 75 seconds  ← অনেক বেশি!
Tuned timeout:    10 seconds  ← দ্রুত সরিয়ে দাও

Queue faster এ clear হয়
Attack এর impact কমে
```

---
##### 📈 ৩. SYN Queue Size বাড়ানো
```bash
# Linux এ
sysctl -w net.ipv4.tcp_max_syn_backlog=65536
# Default 1024 → 65536 করলে বেশি connection ধরতে পারে
```
Temporary fix — flood বড় হলে এটাও শেষ হবে।

---
##### 🚦 ৪. Rate Limiting
একটা IP থেকে নির্দিষ্ট সময়ে কতটা SYN আসতে পারবে তা limit করো:
```text
Rule: একটা IP থেকে max 10 SYN/second

iptables example:
iptables -A INPUT -p tcp --syn \
  -m limit --limit 10/s \
  --limit-burst 20 -j ACCEPT

বাকি সব DROP! 🚫
```

---
## 🔄 53. What are the three phases of the 3-way handshake (SYN, SYN-ACK, ACK)?
TCP এর হ্যান্ডশেকের ৩টি ধাপ হলো:
1. **SYN (Synchronize):** ক্লায়েন্ট সার্ভারকে একটি প্যাকেট পাঠায়, যার হেডারে SYN ফ্ল্যাগটি On থাকে এবং একটি র‍্যান্ডম ইনিশিয়াল নাম্বার (ISN) পাঠানো হয়। ক্লায়েন্ট জিজ্ঞেস করে, "সার্ভার, আমি কি কানেকশন শুরু করতে পারি?" 
2. **SYN-ACK (Synchronize-Acknowledgment):** সার্ভার রিকোয়েস্ট পেয়ে রাজি হলে উত্তরে একটি প্যাকেট পাঠায়। এতে ACK ফ্ল্যাগ On থেকে বলে "হ্যাঁ, তুমি পারো" এবং SYN ফ্ল্যাগ On থেকে সার্ভার তার নিজস্ব ISN পাঠায়।
3. **ACK (Acknowledgment):** সবশেষে ক্লায়েন্ট সার্ভারের SYN এর বিপরীতে একটি কনফার্মেশন বা ACK পাঠায়। এটি হওয়ার পর ডেটা ট্রান্সফার শুরু হয়।

### 📦 What information is exchanged during the SYN and SYN-ACK steps?

#### 🧱 TCP Header — আগে চিনে নিই
```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
┌─────────────────────────┬─────────────────────────────────────┐
│      Source Port        │         Destination Port            │
├─────────────────────────┴─────────────────────────────────────┤
│                    Sequence Number                            │
├───────────────────────────────────────────────────────────────┤
│                 Acknowledgment Number                         │
├──────────┬─────────────┬───────────────────────────────────── ┤
│ Data     │   Flags     │           Window Size                │
│ Offset   │SYN ACK RST..|                                      │
├──────────┴─────────────┼───────────────────────────────────── ┤
│         Checksum       │         Urgent Pointer               │
├────────────────────────┴───────────────────────────────────── ┤
│                    Options (variable)                         │
└───────────────────────────────────────────────────────────────┘
```

---
#### 📝 Step 1 — SYN Packet (Client → Server)
```text
Client বলছে: "আমি connect করতে চাই!"
```

##### 📥 SYN Packet এ কী থাকে:
```text
┌────────────────────────────────────────────────┐
│              SYN PACKET                        │
├────────────────────┬───────────────────────────┤
│ Source Port        │  54321 (random ephemeral) │
│ Destination Port   │  443 (HTTPS) / 80 (HTTP)  │
│ Sequence Number    │  ISN = 2917438642 (random)│
│ ACK Number         │  0 (এখনো কিছু পাইনি)     │
│ Flags              │  SYN = 1, ACK = 0         │
│ Window Size        │  65535 bytes              │
│ Options            │  MSS, SACK, Timestamps..  │
└────────────────────┴───────────────────────────┘
```

##### 📌 প্রতিটা Field কী বলছে:

**🔢 Sequence Number (ISN — Initial Sequence Number)**
```text
ISN = 2917438642  ← randomly generated

কেন random?
→ Security! Predictable হলে attacker
  fake packet inject করতে পারত।

এই number দিয়ে client বলছে:
"আমার data এই number থেকে শুরু হবে"
```

**🪟 Window Size**
```text
Window Size = 65535 bytes

মানে: "আমি একসাথে 65535 bytes নিতে পারব
       ACK দেওয়ার আগেই!"

এটা দিয়ে flow control হয়।
```

**⚙️ Options — সবচেয়ে Important অংশ!**
```text
Option 1: MSS (Maximum Segment Size)
─────────────────────────────────────
MSS = 1460 bytes

মানে: "আমাকে এর চেয়ে বড় segment
       পাঠাইও না!"

কোথা থেকে আসে?
MTU (1500) - IP header (20) - TCP header (20) = 1460

Option 2: SACK Permitted
─────────────────────────────────────
"আমি Selective ACK support করি —
 শুধু missing packet চাইতে পারব!"

Option 3: Window Scale
─────────────────────────────────────
Window Scale = 7 (shift factor)

Real window = 65535 × 2⁷ = 8,388,480 bytes!

কেন দরকার?
High-speed network এ 65535 bytes
অনেক কম — scale করতে হয়।

Option 4: Timestamps
─────────────────────────────────────
Timestamp value = 1823746

কাজ:
→ RTT calculate করতে
→ Duplicate packet detect করতে
```

---
#### 📝 Step 2 — SYN-ACK Packet (Server → Client)
```text
Server বলছে: "ঠিক আছে! আমিও ready,
               এখন তোমার কথা confirm করলাম!"
```

##### 📥 SYN-ACK Packet এ কী থাকে:
```text
┌────────────────────────────────────────────────┐
│              SYN-ACK PACKET                    │
├────────────────────┬───────────────────────────┤
│ Source Port        │  443                      │
│ Destination Port   │  54321 (client এর port)   │
│ Sequence Number    │  ISN = 8372916451 (random)│
│ ACK Number         │  2917438643 (client ISN+1)│
│ Flags              │  SYN = 1, ACK = 1         │
│ Window Size        │  28960 bytes              │
│ Options            │  MSS, SACK, Timestamps..  │
└────────────────────┴───────────────────────────┘
```

##### 📌 প্রতিটা Field কী বলছে:

**🔢 Server এর নিজস্ব Sequence Number**
```text
Server ISN = 8372916451  ← server এর নিজস্ব random number

Client এর ISN এর সাথে কোনো সম্পর্ক নেই!
দুজনের আলাদা আলাদা sequence চলবে।
```

**✅ ACK Number — সবচেয়ে গুরুত্বপূর্ণ**
```text
Client ISN ছিল:    2917438642
ACK Number:        2917438643  ← ISN + 1!

Server বলছে:
"তোমার 2917438642 পেয়েছি ✅
 এখন 2917438643 থেকে পাঠাও!"
```

**🪟 Server এর Window Size**
```text
Server Window = 28960 bytes

Server বলছে:
"আমি একসাথে এতটুকু নিতে পারব"

Client এর চেয়ে কম হতে পারে —
server এর resource এর উপর নির্ভর করে।
```

**⚙️ Server Options — Negotiate করছে**
```text
MSS = 1460  ← server ও same বললে settled!
              আলাদা হলে ছোটটা নেওয়া হয়।

SACK = ✅   ← দুজনেই support করলে enabled

Window Scale = 6  ← server এর scale factor
```

---
#### 📝 Step 3 — ACK (Client → Server)
```text
┌────────────────────────────────────────────────┐
│              ACK PACKET                        │
├────────────────────┬───────────────────────────┤
│ Sequence Number    │  2917438643               │
│ ACK Number         │  8372916452 (server ISN+1)│
│ Flags              │  SYN = 0, ACK = 1         │
└────────────────────┴───────────────────────────┘
```
Client বলছে:
```text
"তোমার 8372916451 পেয়েছি ✅
 এখন 8372916452 থেকে পাঠাও!"
```

---
#### 🔄 পুরো Exchange — একসাথে দেখি
```text
CLIENT                          SERVER
  │                               │
  │  SYN                          │
  │  seq=2917438642               │
  │  win=65535                    │
  │  MSS=1460, SACK, WS=7 ───────▶│
  │                               │ "Client ISN মনে রাখলাম"
  │                               │ "আমার ISN generate করলাম"
  │                    SYN-ACK    │
  │                    seq=8372916451
  │                    ack=2917438643
  │◀────────────────── win=28960  │
  │                    MSS=1460   │
  │                               │
  │  ACK                          │
  │  seq=2917438643               │
  │  ack=8372916452 ─────────────▶│
  │                               │
  │  ══ CONNECTION ESTABLISHED ══ │
```

---
#### 🤝 কী কী Negotiate হলো?
```text
Parameter         Client চেয়েছিল    Server দিল      Final
────────────────────────────────────────────────────────
MSS               1460 bytes        1460 bytes      1460 ✅
SACK              Yes               Yes             Enabled ✅
Window Scale      7 (×128)          6 (×64)         দুজনের নিজেরটা ✅
Timestamps        Yes               Yes             Enabled ✅
Initial Seq (C)   2917438642        —               Client এর ✅
Initial Seq (S)   —                 8372916451      Server এর ✅
```

---
#### 🔒 Security Perspective — কেন Random ISN?
```text
Predictable ISN হলে:

Attacker জানে next ISN হবে X+1
Attacker fake ACK পাঠায় X+1 দিয়ে
Server মনে করে legitimate client!
→ Session Hijacking! 😱

Random ISN হলে:
Attacker আন্দাজ করতে পারে না → Safe! ✅
```

---
### 🔢 What is the role of ISN (Initial Sequence Number) in the handshake?
**ISN (Initial Sequence Number)** হলো একটি র‍্যান্ডমভাবে জেনারেট করা ৩২-বিটের নাম্বার।
- হ্যান্ডশেকের সময় ক্লায়েন্ট এবং সার্ভার দুজনেই নিজেদের একটি করে ইউনিক ISN তৈরি করে অপরকে জানায়।
- পরবর্তীতে যত ডাটা পাঠানো হয়, সব ডেটার সিকোয়েন্স এই ISN থেকে বাড়ানো হয় (Increment)। 
- র‍্যান্ডম নাম্বার ব্যবহার করা হয় হ্যাকিং রোধ করার জন্য। যদি সব কানেকশন সবসময় "১" দিয়ে শুরু হতো, তবে হ্যাকাররা সহজেই অনুমান করে ফেক প্যাকেট ঢুকিয়ে দিতে পারতো (Seq Number Prediction Attack)।

---
## 🎯 54. What is the purpose of the 3-way handshake?
এর মূল উদ্দেশ্য হলো:
- ক্লায়েন্ট এবং সার্ভার দুজনেই যে অনলাইনে আছে এবং ডেটা সেন্ড/রিসিভ করতে প্রস্তুত, তা নিশ্চিত করা।
- উভয় পক্ষের রিসিভিং মেমোরি (Buffer) এবং সিকোয়েন্স নাম্বারগুলো সিঙ্ক্রোনাইজ করে নেওয়া যেন পরবর্তীতে ডেটা আদান প্রদানে ভুল না হয়।

### ✅ How does the handshake ensure both parties are ready to send and receive?
এটি প্রতিটি পক্ষকে অপর পক্ষের রেডি থাকা সম্পর্কে ডাবল-কনফার্ম করে।
- **ক্লায়েন্ট রেডি কিনা:** ক্লায়েন্টের SYN প্যাকেটের বিপরীতে যখন সার্ভার SYN-ACK পাঠায়, তখন ক্লায়েন্ট বুঝে যায় তার পাঠানো চ্যানেল কাজ করছে।
- **সার্ভার রেডি কিনা:** সার্ভারের পাঠানো SYN-ACK প্যাকেটের বিপরীতে যখন ক্লায়েন্ট ACK পাঠায়, তখন সার্ভার বুঝে যায় তার রিসিভিং এবং রিপ্লাই চ্যানেল দুটিই নিখুঁতভাবে কাজ করছে।

### 🚪 What is the 4-way handshake used for TCP connection termination?
ডেটা পাঠানো শেষ হলে সুন্দরভাবে বা গ্রেসফুলি কানেকশন ক্লোজ করার জন্য TCP একটি ৪ ধাপের হ্যান্ডশেক (4-way Handshake) ব্যবহার করে।
1. ক্লায়েন্ট কাজ শেষ হলে সার্ভারকে একটি **FIN** প্যাকেট পাঠায় ("আমার ডেটা পাঠানো শেষ")।
2. সার্ভার সেই প্যাকেটের একটি **ACK** পাঠায় ("ঠিক আছে, বুঝেছি")।
3. সার্ভারের নিজের কোনো আনফিনিশড কাজ থাকলে সেগুলো শেষ করে এরপর সার্ভার নিজেও একটি **FIN** প্যাকেট পাঠায় ("আমার কাজও শেষ")।
4. সবশেষে, ক্লায়েন্ট সেই প্যাকেটের বিপরীতে একটি **ACK** পাঠায় ("ওকে, বাই")। এই ACK-টি সার্ভারে পৌঁছানোর পরই কানেকশন ক্লোজ হয়ে যায়।

---
## 📤 55. How is data transmitted after the handshake is complete?

#### 🔗 Connection Established — এখন কী?
```text
Handshake শেষ। দুজন জানে:
✅ Client ISN = 2917438642
✅ Server ISN = 8372916451
✅ MSS = 1460 bytes
✅ Window Size agreed
✅ SACK, Timestamps enabled

এখন actual data পাঠানো শুরু!
```

---
#### ✂️ ১. Data Segmentation — বড় Data ভাঙো
Application যা পাঠায় সেটা TCP **segment এ ভাগ করে:**
```text
Application: "Send this 4000-byte HTTP request"

TCP ভাগ করে:
┌─────────────────┐
│   Segment 1     │  1460 bytes (MSS)
├─────────────────┤
│   Segment 2     │  1460 bytes (MSS)
├─────────────────┤
│   Segment 3     │  1080 bytes (বাকি)
└─────────────────┘
```

---
#### 🔢 ২. Sequence Number — প্রতিটা Byte Track হয়
```text
Client ISN ছিল: 2917438642
Handshake ACK এর পর next seq: 2917438643

Segment 1: seq=2917438643,  data=1460 bytes
Segment 2: seq=2917440103,  data=1460 bytes
            ↑
           2917438643 + 1460 = 2917440103

Segment 3: seq=2917441563,  data=1080 bytes
            ↑
           2917440103 + 1460 = 2917441563
```
Sequence number মানে **"এই segment এর প্রথম byte এর number"**

---
#### 📨 ৩. ACK — Receiver Confirm করে
প্রতিটা segment পেয়ে receiver **ACK পাঠায়:**
```text
CLIENT                         SERVER
  │                               │
  │──Seg1: seq=100, 1460 bytes───▶│
  │◀─────────────── ACK=1560 ─────│ "1560 থেকে দাও"
  │                               │
  │──Seg2: seq=1560, 1460 bytes──▶│
  │◀─────────────── ACK=3020 ─────│
  │                               │
  │──Seg3: seq=3020, 1080 bytes──▶│
  │◀─────────────── ACK=4100 ─────│ "সব পেয়েছি!"
```
ACK Number মানে **"এই number পর্যন্ত পেয়েছি, এরপর থেকে দাও"**

---
#### 🪟 ৪. Sliding Window — Speed এর জন্য
প্রতিটা segment এর জন্য ACK এর wait করলে অনেক slow হবে।
**Window = একসাথে কতটুকু পাঠানো যাবে ACK ছাড়াই:**
```text
Window Size = 4 segments ধরি

Without Sliding Window:
──Seg1──▶ ◀──ACK── ──Seg2──▶ ◀──ACK── ──Seg3──▶
😴 প্রতিটার জন্য wait!

With Sliding Window:
──Seg1──▶
──Seg2──▶
──Seg3──▶
──Seg4──▶  ← window full
◀──ACK1──  window slides!
──Seg5──▶  ← নতুন slot খুললো
◀──ACK2──
──Seg6──▶
```
```text
Sent & ACKed | Sent, awaiting ACK | Can Send | Can't Send yet
─────────────┼────────────────────┼──────────┼───────────────
 [1][2][3]   │    [4][5][6][7]    │  [8][9]  │  [10][11]...
             └────── Window ──────┘
```

---
#### 🚦 ৫. Flow Control — Receiver কে Overwhelm করো না
Receiver তার **current capacity** জানায় window size দিয়ে:
```text
Server: "আমার buffer এ এখন 32000 bytes জায়গা আছে"
        Window = 32000

Client অনেক দ্রুত পাঠাচ্ছে...
Server buffer ভরে যাচ্ছে...

Server: "এখন মাত্র 8000 bytes নিতে পারব!"
        Window = 8000  ← Client slow করে

Server: "Buffer full! থামো!"
        Window = 0  ← Zero Window! Client থামে

Server process করলো, buffer খাললো:
        Window = 32000  ← আবার শুরু!
```
```text
Window Size পরিবর্তন:
65535 → 32000 → 8000 → 0 → 32000
  ↑        ↑      ↑    ↑     ↑
Start  Filling  Almost Stop  Resume
```

---
#### 🚥 ৬. Congestion Control — Network কে Overwhelm করো না
Flow control = receiver protect করা
Congestion control = **network protect করা**

##### 🐢 Slow Start:
```text
শুরুতে আস্তে পাঠাও, দ্রুত বাড়াও:

Round 1: 1 segment
Round 2: 2 segments
Round 3: 4 segments
Round 4: 8 segments  ← exponential growth!
         ↓
Threshold পৌঁছালে → linear growth
```

##### 📉 Congestion Detection:
```text
Packet loss হলো! (timeout বা 3 duplicate ACK)

3 Dup ACK (Fast Retransmit):
◀── ACK=1460 ──  "Seg1 পেয়েছি"
◀── ACK=1460 ──  "Seg2 পাইনি! 1460 চাই"
◀── ACK=1460 ──  "এখনো 1460 চাই"
◀── ACK=1460 ──  "3rd dup ACK!"
      ↓
Immediately retransmit Seg2! (timeout এর আগেই)
Window অর্ধেক করো।
```

---
#### 🔁 ৭. Retransmission — হারানো Data ফেরত আনো
```text
Seg1 ✅ → ACK
Seg2 ❌ → Lost!
Seg3 ✅ → পেয়েছি কিন্তু out of order

Server পাঠায়:
◀── ACK=Seg2's seq (3 বার) ── "Seg2 দাও!"

Client:
→ Seg2 retransmit করে ✅

SACK থাকলে আরো smart:
◀── ACK=Seg2, SACK=Seg3 ──
"Seg2 নেই, কিন্তু Seg3 আছে — শুধু Seg2 দাও!"
```

---
#### 🔄 ৮. Full Data Transfer — পুরো Flow
```text
CLIENT                              SERVER
  │                                    │
  │  [Handshake Complete]              │
  │  Window=65535, MSS=1460            │
  │                                    │
  │──Seg1 (seq=1, 1460b)──────────────▶│ Buffer এ রাখলাম
  │──Seg2 (seq=1461, 1460b)───────────▶│ Buffer এ রাখলাম
  │──Seg3 (seq=2921, 1460b)───────────▶│ Buffer এ রাখলাম
  │                          ACK=4381 ─│ "4381 থেকে দাও"
  │──Seg4 (seq=4381, 1460b)───────────▶│
  │──Seg5 (seq=5841, 1460b)───────────▶│
  │──Seg6 ❌ Lost!                     │
  │──Seg7 (seq=8761, 1460b)───────────▶│ Out of order!
  │                          ACK=7301 ─│ "Seg6 দাও! (3x)"
  │                          ACK=7301 ─│
  │                          ACK=7301 ─│
  │──Seg6 Retransmit──────────────────▶│ ✅
  │                          ACK=10221─│ "সব পেয়েছি!"
  │                                    │
  │  [Data Transfer Complete]          │
```

---
#### 🛑 ৯. Connection Teardown — শেষ করা
Data transfer শেষে **4-way handshake:**
```text
CLIENT                    SERVER
  │──── FIN ────────────▶│  "আমার পাঠানো শেষ"
  │◀─── ACK ─────────────│  "ঠিক আছে"
  │◀─── FIN ─────────────│  "আমারও শেষ"
  │──── ACK ────────────▶│  "OK, bye!"
  │                       │
  [Connection Closed]
```

---
#### 📊 সব কিছু একসাথে — Layer by Layer
```text
Application
    │  "Send: GET /index.html"
    ▼
TCP Layer
    │  Segment করো → Seq number দাও
    │  Window control করো
    │  ACK track করো
    ▼
IP Layer
    │  Source/Dest IP দাও
    │  Route করো
    ▼
Network
    │  Bits আকারে পাঠাও
    ▼
  Receiver
```

---
#### 📌 Key Concepts Summary

| Concept | কাজ |
|---|---|
| **Segmentation** | বড় data কে MSS অনুযায়ী ভাগ করা |
| **Sequence Number** | প্রতিটা byte track করা |
| **ACK** | কতটুকু পেয়েছি confirm করা |
| **Sliding Window** | ACK ছাড়াই multiple segment পাঠানো |
| **Flow Control** | Receiver overwhelm না করা |
| **Congestion Control** | Network overwhelm না করা |
| **Retransmission** | হারানো segment আবার পাঠানো |

---
### 🪟 What is the TCP receive window and how does it affect throughput?
**TCP Receive Window (RWIN)** হলো সার্ভার বা ক্লায়েন্টের অপারেটিং সিস্টেমের মধ্যে বরাদ্দ করা একটি মেমোরি বাফার (Buffer)।
- এর মাধ্যমে নেটওয়ার্কের ফ্লো বা গতি নিয়ন্ত্রণ করা হয়। রিসিভার সেন্ডারকে প্রতিনিয়ত জানায় যে, "আমার মেমোরিতে এই মুহূর্তে এতগুলো বাইট জমা রাখার জায়গা ফাঁকা আছে"।
- থ্রুপুট বা ডাউনলোডের স্পিড সরাসরি উইন্ডো সাইজের ওপর নির্ভর করে। যদি সার্ভারের উইন্ডো সাইজ খুব ছোট হয়, তবে আপনার ইন্টারনেট লাইন ১ জিপিপিএস স্পিডের হলেও আপনি বেশি স্পিড পাবেন না, কারণ সেন্ডারকে অল্প ডেটা পাঠিয়ে ACK-এর জন্য অপেক্ষা করতে হবে।

### ⏱️ What is Nagle's algorithm and when should it be disabled?
TCP তে যখন খুব ছোট ছোট ডেটা (যেমন ১ বাইটের কিবোর্ড স্ট্রোক) পাঠানো হয়, তখন ওই ১ বাইটের জন্য ৪০ বাইটের হেডার যুক্ত হয়ে ব্যান্ডউইথ নষ্ট হয়।
- **Nagle's Algorithm:** এটি ছোট ছোট মেসেজগুলোকে কয়েক মিলি-সেকেন্ড আটকে রাখে এবং সবগুলো জমিয়ে একটু বড় সাইজ হলে একবারে একটি প্যাকেট বানিয়ে সেন্ড করে।
- **কখন বন্ধ করতে হবে:** যেসব অ্যাপে ন্যানো-সেকেন্ডের রিয়েল-টাইম রেসপন্স লাগে (যেমন মাল্টিপ্লেয়ার গেম বা SSH টার্মিনাল), সেখানে সামান্য ল্যাটেন্সিও বিরক্তিকর। ওইসব ক্ষেত্রে ডেভেলপাররা কোড লেভেলে `TCP_NODELAY` অপশন অন করে এই অ্যালগরিদম বন্ধ করে দেন।

---
## 🛡️ 56. What are reliable connection establishment, sequence numbers, and acknowledgments?

এই তিনটা TCP এর **core reliability engine** — একটা ছাড়া আরেকটা কাজ করে না।

#### 🤝 ১. Reliable Connection Establishment

##### ❓ কেন "Reliable" Establishment দরকার?
Simple এক-দিকের "hello" যথেষ্ট না কারণ:
```text
❓ Client জানে না — Server আদৌ আছে কিনা
❓ Server জানে না — Client সত্যিই ready কিনা
❓ কেউ জানে না — Network কাজ করছে কিনা
❓ কেউ জানে না — দুদিকেই data যাচ্ছে কিনা
```
3-Way Handshake এই সব নিশ্চিত করে।

---
##### 🔄 3-Way Handshake — প্রতিটা Step কী Prove করে?
```text
CLIENT                          SERVER
  │                               │
  │──────── SYN ─────────────────▶│
  │                               │
```
**SYN এর পরে Client জানে:**
```text
✅ আমি পাঠাতে পারি (outbound works)
❓ Server পাচ্ছে কিনা জানি না এখনো
```
```text
  │◀──────── SYN-ACK ─────────────│
  │                               │
```
**SYN-ACK পেয়ে Client জানে:**
```text
✅ Server আছে এবং alive
✅ Server আমার SYN পেয়েছে
✅ Server পাঠাতে পারে (Server outbound works)
✅ আমি receive করতে পারি (my inbound works)
```
```text
  │──────── ACK ─────────────────▶│
  │                               │
```
**ACK পেয়ে Server জানে:**
```text
✅ Client আমার SYN-ACK পেয়েছে
✅ Client receive করতে পারে
✅ আমি পাঠাতে পারি (my outbound works)
✅ দুদিকেই communication possible!
```
**এখন দুজনেই নিশ্চিত — Full Duplex ready! ✅**

---
##### ❓ কেন 2-Way যথেষ্ট না?
```text
2-Way হলে (SYN → SYN-ACK):

Client জানে: Server আছে ✅
Server জানে: Client SYN পাঠিয়েছে ✅

কিন্তু Server জানে না:
❌ Client আমার SYN-ACK পেয়েছে কিনা
❌ Client ready কিনা

তাই Server resources allocate করবে কিনা বুঝতে পারে না!
→ SYN Flood এর সুযোগ তৈরি হয়
```
3-Way তে Server ACK না পাওয়া পর্যন্ত **full resource allocate করে না।**

---
#### 🔢 ২. Sequence Numbers

##### 📌 Sequence Number কী?
TCP এ প্রতিটা **byte এর একটা unique number আছে।**
```text
Data: "Hello World" = 11 bytes

ISN = 1000 (ধরি)

H  e  l  l  o     W  o  r  l  d
↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑
1001 1002 1003 1004 1005 1006 1007 1008 1009 1010 1011
```
Segment এর Sequence Number = **সেই segment এর প্রথম byte এর number**

---
##### 🎲 ISN (Initial Sequence Number) — কেন Random?
```text
Predictable ISN (e.g., always 0):

Connection 1: seq 0,1,2,3...1000
Connection 2: seq 0,1,2,3...

পুরনো connection এর stale packet
নতুন connection এ ঢুকে যেতে পারে!

Attacker জানে next seq = X+1
Fake packet inject করতে পারে!

Random ISN:
Connection 1: seq 2917438642...
Connection 2: seq 8371625431...

Attacker আন্দাজ করতে পারবে না ✅
Stale packet match করবে না ✅
```

---
##### ⚙️ Sequence Number এর কাজ — ৪টা

**কাজ ১: Data Ordering**
```text
Network এ আসলো:  Seg3, Seg1, Seg4, Seg2
                  (out of order!)

Sequence number দিয়ে সাজাই:
Seg1(seq=1) → Seg2(seq=1461) → Seg3(seq=2921) → Seg4(seq=4381)

Application পায়: সঠিক order এ data ✅
```

**কাজ ২: Duplicate Detection**
```text
Network এ same segment দুইবার আসলো:
Seg1 (seq=1000) → process করলাম
Seg1 (seq=1000) → আবার আসলো!
                  "seq=1000 আগেই দেখেছি → DROP!" ✅
```

**কাজ ৩: Loss Detection**
```text
পেয়েছি: seq=1, seq=1461, seq=2921
Missing: seq=4381 নেই!

"seq=4381 আসেনি → হারিয়েছে → Retransmit চাই!"
```

**কাজ ৪: Partial Data Tracking**
```text
10000 byte file পাঠাচ্ছি

Received ACK=5001 মানে:
"প্রথম 5000 bytes পেয়েছি (seq 1-5000)
 এখন seq=5001 থেকে দাও"

Exactly কোথায় আছি জানি! ✅
```

---
##### 🔄 Sequence Number Wrap-Around
```text
32-bit sequence number → max = 4,294,967,295

তারপর?  → 0 তে ফিরে আসে! (wrap around)

High-speed network এ (10Gbps):
~34 seconds এ wrap হয়!

Solution: TCP Timestamps option
→ wrap-around এর পরেও duplicate detect করা যায়
```

---
#### ✅ ৩. Acknowledgments (ACK)

##### 🛠️ ACK কীভাবে কাজ করে?
TCP ACK হলো **cumulative** — মানে "এই পর্যন্ত সব পেয়েছি":
```text
ACK = N মানে:
"N-1 পর্যন্ত সব bytes পেয়েছি,
 এখন N নম্বর byte চাই!"
```
```text
Client পাঠালো:
Seg1: seq=1,    data=1460 bytes  (bytes 1-1460)
Seg2: seq=1461, data=1460 bytes  (bytes 1461-2920)
Seg3: seq=2921, data=1460 bytes  (bytes 2921-4380)

Server ACK করলো:
ACK=1461   → "1460 পর্যন্ত পেয়েছি" ✅
ACK=2921   → "2920 পর্যন্ত পেয়েছি" ✅
ACK=4381   → "4380 পর্যন্ত পেয়েছি" ✅
```

---
##### ⚠️ Cumulative ACK এর সমস্যা
```text
পাঠালাম: Seg1, Seg2, Seg3, Seg4, Seg5

পেলো: Seg1 ✅, Seg2 ❌ lost, Seg3 ✅, Seg4 ✅, Seg5 ✅

ACK পাঠাবে:
ACK=1461  → "Seg1 পেয়েছি"
ACK=1461  → "Seg2 নেই! এখনো 1461 চাই"
ACK=1461  → "Seg3,4,5 আছে কিন্তু Seg2 ছাড়া বলতে পারছি না"
ACK=1461  → (3rd duplicate ACK!)

Problem:
Server জানে না Seg3,4,5 পেয়েছে কিনা!
Seg2 শুধু না, Seg2,3,4,5 সব retransmit করতে হতে পারে!
```
**Solution → SACK (Selective ACK):**
```text
SACK বলে:
ACK=1461, SACK=2921-5841

মানে: "Seg2 নেই, কিন্তু Seg3,4,5 আছে!
       শুধু Seg2 পাঠাও!" ✅

Much more efficient!
```

---
##### ⏱️ Delayed ACK — Optimization
প্রতিটা segment এ ACK না পাঠিয়ে **একটু wait করো:**
```text
Without Delayed ACK:
Seg1 → ACK
Seg2 → ACK
Seg3 → ACK
(অনেক small ACK packets!)

With Delayed ACK (200ms wait):
Seg1 arrives...
Seg2 arrives...
Seg3 arrives...
→ একটাই ACK=after Seg3 ✅
(ACK টা data সাথে piggyback করা যায়!)
```

---
##### 🎒 Piggybacking — ACK + Data একসাথে
```text
শুধু ACK পাঠানো wasteful।
যদি আমারও data পাঠানোর থাকে:

SERVER → CLIENT:
┌────────────────────────────────┐
│ seq=8372, ack=4381             │
│ "আমার response data এখানে"    │
│ + তোমার Seg3 এর ACK ও দিলাম! │
└────────────────────────────────┘

একটা packet এ দুটো কাজ! ✅
```

---
### 🔄 How does sequence number wrapping work in long-lived connections?
একটি ৩২-বিটের সিকোয়েন্স নাম্বার ফিল্ড সর্বোচ্চ 4.29 বিলিয়ন বাইট (প্রায় 4 গিগাবাইট) পর্যন্ত ট্র্যাকিং করতে পারে।
- যদি একটি একটানা ভিডিও স্ট্রিমিং সেশন বা লম্বা কানেকশনে 4GB এর বেশি ডেটা পাস হয়, তখন ৩২-বিটের লিমিট পার হয়ে যায়। 
- এই অবস্থায় সিকোয়েন্স নাম্বারটি আবার শূন্য (0) থেকে শুরু (Wrap around) হয়। কিন্তু এতে আগের পুরনো প্যাকেটের সাথে নাম্বার মিলে গিয়ে কনফিউশন তৈরি হতে পারে। তাই "TCP Timestamp" অপশন ব্যবহার করে বোঝা যায় কোনটি পুরনো আর কোনটি নতুন ডেটা।

### 🔁 What is a duplicate ACK and what does it signal?
**Duplicate ACK** হলো যখন রিসিভার পর পর একই সিকোয়েন্স নাম্বারের একনলেজমেন্ট সেন্ডারকে পাঠাতে থাকে।
- রিসিভার যদি এমন কোনো প্যাকেট পায় যা আউট-অফ-অর্ডার (যেমন ৩ এর পর ৫ পেয়েছে, ৪ পায়নি), তবে রিসিভার নতুন ৫ নম্বর প্যাকেটের বদলে বারবার ৩ নম্বর প্যাকেটের ACK ই পাঠাতে থাকবে, যার মানে "আমি ৪ নম্বর প্যাকেটের অপেক্ষায় আছি"।
- সেন্ডার যখন পর পর ৩টি Duplicate ACK রিসিভ করে, সে কনফার্ম হয়ে যায় যে ৪ নম্বর প্যাকেটটি ড্রপ হয়েছে এবং সে দেরি না করে সাথে সাথেই সেটি আবার পাঠিয়ে দেয় (Fast Retransmit)।

---
## ⚠️ 57. What happens if the TCP 3-way handshake fails?
যদি হ্যান্ডশেকের কোনো একটি প্যাকেট (SYN বা SYN-ACK বা ACK) নেটওয়ার্কে ড্রপ বা মিস হয়ে যায়, তবে ক্লায়েন্ট এবং সার্ভার একে অপরের সাথে কানেক্ট হতে পারে কনফার্ম হতে পারে না এবং ডেটা ট্রান্সফার শুরু হয় না। ব্রাউজার তখন "Connection Timed Out" বা "Site Cannot Be Reached" এরর শো করে।

### 🔄 What is the TCP SYN-ACK retransmission behavior?
যদি ক্লায়েন্ট একটি SYN রিকোয়েস্ট পাঠায় কিন্তু সার্ভারের পাঠানো SYN-ACK প্যাকেটটি পথিমধ্যে হারিয়ে যায়, তবে ক্লায়েন্ট নির্দিষ্ট সময় (Retransmission Timeout) পর আবার SYN প্যাকেট পাঠায়। 
- একইভাবে, যদি সার্ভার SYN-ACK পাঠিয়ে ক্লায়েন্টের ACK না পায়, সার্ভার এক্সপোনেনশিয়ালি ব্যাকঅফ করে (যেমন ১ সেকেন্ড, ৩ সেকেন্ড, ৭ সেকেন্ড পর পর) কয়েকবার SYN-ACK প্যাকেটটি রিট্রান্সমিট করতে থাকে।

### 📋 How does a server handle a backlog of incomplete handshakes?
অসম্পূর্ণ হ্যান্ডশেক বা যে হ্যান্ডশেকগুলো এখনো স্টাবলিশ হয়নি, তাদের সার্ভার একটি নির্দিষ্ট মেমোরি কিউ (Queue বা Backlog) তে জমা রাখে।
- একে **SYN Backlog** বলা হয়। 
- যদি কোনো কারণে প্রচুর অসম্পূর্ণ রিকোয়েস্ট জমে এই ব্যাকলগটি পূর্ণ হয়ে যায়, তখন নতুন কোনো ক্লায়েন্টের লেজিটিমেট কানেকশন রিকোয়েস্ট আসলেও সার্ভার তা সরাসরি ড্রপ করে দেয়।

### 🚨 What is a "SYN Flood" attack, and how do servers protect against it?
**SYN Flood:** এটি সার্ভারকে ডাউন করার একটি ডিনায়াল অব সার্ভিস (DDoS) আক্রমণ। হ্যাকার হাজার হাজার ফেক IP থেকে শুধু SYN প্যাকেট পাঠায়, সার্ভার SYN-ACK পাঠায় কিন্তু হ্যাকাররা কখনো ফাইনাল ACK পাঠায় না। এর ফলে সার্ভারের উপরের ওই "SYN Backlog" খুব দ্রুত পূর্ণ হয়ে যায় এবং সার্ভার কাজ করা বন্ধ করে দেয়।
- **প্রতিরক্ষা:** ফায়ারওয়াল বা অপারেটিং সিস্টেমে **SYN cookies** এনাবল করতে হয়। এটি এমন একটি ক্রিপ্টোগ্রাফিক ট্রিক যেখানে সার্ভার ক্লায়েন্টের ACK না পাওয়া পর্যন্ত সংযোগের জন্য কোনো মেমরি ব্লক করে রাখে না।
