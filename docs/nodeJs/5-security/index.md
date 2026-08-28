---
sidebar_position: 1
title: 'Node.js Security'
sidebar_label: 'Security'
---

## 1. How do you secure a Node.js application?
Node.js application secure করার জন্য একাধিক লেয়ারে protection নিশ্চিত করতে হয়:
- **Input Validation:** User input সর্বদা validate এবং sanitize করতে হবে।
- **Authentication & Authorization:** Secure login (JWT, OAuth) এবং proper role-based access control (RBAC) ব্যবহার করতে হবে।
- **Security Headers:** `helmet` ব্যবহার করে secure HTTP headers সেট করতে হবে।
- **Data Protection:** Sensitive data (যেমন password) hash (bcrypt) করে স্টোর করতে হবে।
- **Rate Limiting:** API endpoint-এ rate limiting ব্যবহার করে brute-force এবং DDoS attack প্রতিরোধ করতে হবে।
- **Dependency Management:** `npm audit` এর মাধ্যমে vulnerable package গুলো চেক এবং আপডেট করতে হবে।
- **Error Handling:** Production-এ error stack trace হাইড করতে হবে।

### What is the role of the `helmet` middleware and what HTTP headers does it set?
`helmet` হলো Express.js এর একটি middleware যা বিভিন্ন secure HTTP headers সেট করে application-কে সাধারণ web vulnerabilities (যেমন XSS, clickjacking) থেকে রক্ষা করে।
এটি সাধারণত যেসব headers সেট করে:
- `Content-Security-Policy`: XSS attack প্রতিরোধ করে।
- `X-Frame-Options`: Clickjacking প্রতিরোধ করে (`SAMEORIGIN` বা `DENY` সেট করে)।
- `Strict-Transport-Security`: HTTPS ব্যবহারে বাধ্য করে।
- `X-Content-Type-Options`: MIME-sniffing প্রতিরোধ করে (`nosniff`).
- `X-Powered-By`: এটি Express এর default header রিমুভ করে, যাতে attacker জানতে না পারে যে সার্ভারটি Express-এ চলছে।

### What is the principle of least privilege and how do you apply it in Node.js?
**Principle of Least Privilege (PoLP)** বলতে বোঝায় যে, একটি system, process বা user-কে শুধুমাত্র তার কাজ করার জন্য যতটুকু permission বা access প্রয়োজন, ঠিক ততটুকুই দেওয়া।

Node.js-এ এটি যেভাবে apply করা যায়:
- **Database Access:** Application-এর database user-কে শুধুমাত্র প্রয়োজনীয় table গুলোতে read/write access দেওয়া, admin permission (privilege) না দেওয়া।
- **File System:** Server-এ Node process-টি root user হিসেবে না চালিয়ে একটি restricted/non-root user (যেমন `node` user) দিয়ে চালানো।
- **API Roles:** Authorization-এর ক্ষেত্রে role-based access control (RBAC) ব্যবহার করা, যেন সাধারণ user এডমিন API access করতে না পারে।

### How do you perform dependency vulnerability scanning?
Dependencies-এর vulnerability scan করার জন্য নিচের টুলগুলো ব্যবহার করা হয়:
- **`npm audit` / `yarn audit`:** Command line-এ এটি রান করলে project-এর dependency tree এনালাইজ করে known vulnerabilities খুঁজে বের করে।
- **Snyk:** এটি একটি জনপ্রিয় security tool যা CI/CD pipeline-এর সাথে integrate করে dependency scan করতে পারে।
- **GitHub Dependabot:** এটি স্বয়ংক্রিয়ভাবে repository স্ক্যান করে এবং vulnerable package এর আপডেট এর জন্য Pull Request তৈরি করে।


## 2. What is JWT, and how do you implement it in Node.js?
**JWT (JSON Web Token)** হলো একটি open standard (RFC 7519) যা দুটি পার্টির মধ্যে securely data transfer করার জন্য ব্যবহৃত হয়। এটি সাধারণত authentication এবং authorization এর কাজে ব্যবহৃত হয়।

Node.js-এ এটি implement করার নিয়ম:
1. `jsonwebtoken` package ইন্সটল করতে হবে।
2. User সফলভাবে login করলে, তার user ID বা অন্যান্য payload দিয়ে একটি token generate (sign) করতে হবে (যেখানে একটি `secret_key` ব্যবহৃত হয়)।
3. Client সেই token-টি পরবর্তী প্রতি request এর Authorization header-এ (`Bearer <token>`) পাঠায়।
4. Server একটি middleware এর মাধ্যমে token-টি verify করে এবং valid হলে request এ্যাপ্রুভ করে।

### Where should JWTs be stored — localStorage vs httpOnly cookies?
- **`localStorage`:** এখানে JWT স্টোর করা সহজ, কিন্তু এটি **XSS (Cross-Site Scripting)** attack এর জন্য ঝুঁকিপূর্ণ। Attacker malicious script রান করে token চুরি করতে পারে।
- **`httpOnly` cookies:** এটি সবচেয়ে secure পদ্ধতি। `httpOnly` flag সেট করা থাকলে JavaScript দিয়ে cookie access করা যায় না, তাই এটি XSS attack থেকে সুরক্ষিত। তবে এক্ষেত্রে **CSRF (Cross-Site Request Forgery)** attack প্রতিরোধের ব্যবস্থা রাখতে হয়।

### How do you revoke a JWT before it expires?
JWT stateless হওয়ার কারণে সরাসরি এটি সার্ভার থেকে revoke (বাতিল) করা কঠিন। তবে নিচের উপায়গুলো ব্যবহার করা যায়:
- **Token Blacklist:** Logout বা revoke করার সময় token-টি database বা Redis cache-এ একটি "blacklist"-এ রেখে দেওয়া। প্রতিটি request-এ চেক করা যে token-টি blacklist-এ আছে কিনা।
- **Short Expiration Time:** Token এর expiry time (TTL) খুব কম রাখা (যেমন ১৫ মিনিট) এবং refresh token ব্যবহার করে নতুন access token জেনারেট করা।
- **Refresh Token Revocation:** Refresh token-টি database-এ সেভ করা থাকে। User logout করলে বা session invalid করতে চাইলে database থেকে refresh token-টি মুছে ফেলা হয়।


## 3. How do you prevent SQL injection in Node.js?
SQL Injection প্রতিরোধ করার সবচেয়ে কার্যকর উপায় হলো **Parameterized Queries** বা **Prepared Statements** ব্যবহার করা। 

Node.js-এ prevention এর উপায়:
- SQL query তে সরাসরি user input concatenate (যেমন `SELECT * FROM users WHERE email = '` + req.body.email + `'`) করা থেকে বিরত থাকা।
- Parameterized queries ব্যবহার করা — তবে placeholder-এর syntax library ভেদে আলাদা:
  - **`pg` (PostgreSQL):** numbered placeholder ব্যবহার করে — `SELECT * FROM users WHERE email = $1`, `$2` ইত্যাদি।
  - **`mysql2`:** `?` placeholder ব্যবহার করে — `SELECT * FROM users WHERE email = ?`
- Stored procedures ব্যবহার করা।
- সবচেয়ে নিরাপদ উপায় হলো ORM বা Query Builder ব্যবহার করা।

### How do ORMs like Prisma or Sequelize handle injection by default?
**Prisma** এবং **Sequelize** এর মতো ORM (Object-Relational Mapping) বা Query Builder (যেমন Knex.js) ডিফল্টভাবেই SQL injection থেকে সুরক্ষিত। 
এরা background-এ user input-কে escape এবং sanitize করে এবং database-এ পাঠানোর আগে parameterized queries ব্যবহার করে। ফলে malicious SQL code execute হতে পারে না।

### What is the difference between input sanitization and input validation?
- **Input Validation:** এটি চেক করে যে user input সঠিক format-এ আছে কিনা। (যেমন: email field-এ আসলেই একটি valid email address দেওয়া হয়েছে কিনা, বা age ফিল্ডে শুধু number আছে কিনা)।
- **Input Sanitization:** এটি input থেকে ক্ষতিকর বা অপ্রয়োজনীয় ক্যারেক্টার মুছে ফেলে বা modify করে ডেটা ক্লিন করে। (যেমন: input-এর শুরুতে বা শেষে space থাকলে তা `trim()` করা, বা HTML tag থাকলে তা escape করা যাতে XSS attack না হয়)।

---

## 4. What is CSRF, and how do you protect against it?
**CSRF (Cross-Site Request Forgery)** হলো একটি attack যেখানে attacker ইউজারের authenticated session (যেমন browser-এ সেভ থাকা session cookie) ব্যবহার করে ইউজারের অজান্তে অন্য কোনো সাইট থেকে malicious request পাঠায় (যেমন টাকা ট্রান্সফার করা)।

প্রতিরক্ষামূলক ব্যবস্থা:
- **Anti-CSRF Tokens:** সার্ভার একটি unique random token জেনারেট করে ক্লায়েন্টকে দেয়। প্রতিটি state-changing request (POST, PUT, DELETE) এর সাথে ক্লায়েন্টকে এই token পাঠাতে হয়, যা সার্ভার ভেরিফাই করে।
- **SameSite Cookies:** Session cookie তে `SameSite` attribute (`Lax` বা `Strict`) ব্যবহার করা, যাতে cross-site রিকোয়েস্টে cookie না যায়।
- **Custom Request Headers:** ফ্রন্টএন্ড থেকে একটি custom header (যেমন `X-Requested-With`) রিকোয়েস্টে যুক্ত করা, যা attacker-এর পক্ষে অন্য ডোমেইন থেকে পাঠানো কঠিন।

### When is CSRF protection not necessary?
- যখন অ্যাপ্লিকেশনটি authentication এর জন্য cookie এর পরিবর্তে **localStorage** বা **sessionStorage** এ রাখা **JWT** (বা Bearer token) ব্যবহার করে এবং Authorization header এর মাধ্যমে পাঠায়, তখন CSRF protection এর প্রয়োজন নেই। (কারণ browser নিজে থেকে Header automatically পাঠায় না)।
- যেসব API শুধুমাত্র data read (GET) করে, সেখানে CSRF protection এর দরকার নেই, কারণ সেগুলো application-এর state পরিবর্তন করে না।

### What is the SameSite cookie attribute and how does it mitigate CSRF?
`SameSite` হলো একটি cookie attribute যা নির্ধারণ করে cross-site রিকোয়েস্টের সাথে cookie পাঠানো হবে কিনা।
- `Strict`: কুকি শুধুমাত্র সেইম সাইটের রিকোয়েস্টেই পাঠানো হবে। অন্য কোনো সাইট থেকে আসা লিঙ্কে ক্লিক করলেও কুকি যাবে না।
- `Lax`: ডিফল্ট হিসেবে কাজ করে। Top-level navigation (যেমন লিংকে ক্লিক করা) এ কুকি পাঠানো হবে, কিন্তু cross-site POST/PUT রিকোয়েস্টে পাঠানো হবে না।

এটি third-party সাইটগুলোকে ইউজারের authenticated session ব্যবহার করে request পাঠানো থেকে বিরত রাখে, যা অনেকাংশেই CSRF প্রতিরোধ করে।

---

## 5. How do you handle password hashing in Node.js?
Node.js-এ password secure ভাবে সংরক্ষণের জন্য hashing algorithm ব্যবহার করা হয়, সাথে "salt" যোগ করা হয়।
সবচেয়ে জনপ্রিয় লাইব্রেরি হলো `bcrypt` বা `argon2`।

নিয়ম:
- রেজিস্ট্রেশনের সময় ইউজারের পাসওয়ার্ড `bcrypt.hash()` দিয়ে hash করে ডাটাবেসে সেভ করতে হবে।
- লগইনের সময় ইউজারের দেওয়া পাসওয়ার্ড `bcrypt.compare()` ব্যবহার করে ডাটাবেসের hashed পাসওয়ার্ডের সাথে মিলিয়ে দেখতে হবে।

### Why is `bcrypt` preferred over `SHA-256` or `MD5` for password hashing?
`SHA-256` বা `MD5` হলো সাধারণ "Fast" hashing algorithms, যা সেকেন্ডে কোটি কোটি বার hash করতে পারে। ফলে attacker খুব সহজেই Brute-force বা Rainbow Table attack করে পাসওয়ার্ড বের করে ফেলতে পারে।

অন্যদিকে `bcrypt` হলো **key-stretching**, "Slow" hashing algorithm।
- এর একটি `saltRound` বা `cost` factor থাকে, যার কারণে hash ক্যালকুলেট হতে ইচ্ছাকৃতভাবে একটু বেশি সময় লাগে (যেমন ১০০ মিলি-সেকেন্ড)।
- এটি hardware accelerator (GPU/ASIC) দিয়েও দ্রুত crack করা সম্ভব হয় না।
- `bcrypt` বিল্ট-ইনভাবে প্রতিটি পাসওয়ার্ডের জন্য unique **salt** জেনারেট করে।


## 6. What is rate limiting, and how do you implement it?
**Rate Limiting** হলো একটি নির্দিষ্ট সময়ের মধ্যে একজন ইউজার (বা IP address) কতগুলো request করতে পারবে, তার একটি সীমা (limit) সেট করে দেওয়া। এটি DoS/DDoS attack, brute-force attack এবং API abuse প্রতিরোধে সাহায্য করে।

Node.js-এ `express-rate-limit` প্যাকেজ দিয়ে এটি সহজে implement করা যায়।
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### How do you implement distributed rate limiting using Redis across multiple servers?
যখন অ্যাপ্লিকেশনটি multiple instance বা server-এ (load balancer এর পেছনে) রান করে, তখন ইন-মেমরি rate limiting কাজ করে না। এক্ষেত্রে একটি centralized ডাটাবেস যেমন **Redis** প্রয়োজন হয়।
Node.js-এ `rate-limit-redis` স্টোর ব্যবহার করে `express-rate-limit` এর সাথে Redis কানেক্ট করা যায়, ফলে যেকোনো সার্ভার থেকে আসা রিকোয়েস্টের কাউন্ট একটি কমন Redis instance-এ আপডেট হতে থাকে।

### What is the difference between rate limiting and throttling?
- **Rate Limiting:** এটি নির্দিষ্ট সময়ের মধ্যে সর্বোচ্চ কতগুলো রিকোয়েস্ট করা যাবে তার একটি হার্ড লিমিট (Hard Limit) সেট করে। লিমিট পার হওয়ার পর সার্ভার `429 Too Many Requests` status code ফেরত দেয়।
- **Throttling:** এটি রিকোয়েস্ট পুরোপুরি ব্লক না করে, এর প্রসেসিং স্পিড কমিয়ে দেয় বা রিকোয়েস্টগুলোকে একটি queue তে রাখে। এটি সার্ভারকে ওভারলোড হওয়া থেকে বাঁচায় এবং ক্লায়েন্টকে ধীরগতিতে রেসপন্স দেয়।

---

## 7. How do you prevent DDoS attacks in Node.js?
DDoS (Distributed Denial of Service) attack সরাসরি পুরোটা Node.js অ্যাপ্লিকেশন থেকে ঠেকানো সম্ভব নয়, তবে কিছু পদক্ষেপ নেওয়া যায়:
- **Rate Limiting:** IP ভিত্তিক রিকোয়েস্টের লিমিট সেট করা।
- **Payload Size Limit:** বড় সাইজের রিকোয়েস্ট বডি ব্লক করা (যেমন: `express.json({ limit: '10kb' })`)।
- **Timeout Configuration:** অনেক বেশি সময় ধরে কানেকশন ধরে রাখা আটকাতে HTTP timeout কমানো।
- **Blocking Malicious IPs:** পরিচিত ক্ষতিকর IP অ্যাড্রেস ব্লক করা।
- **Clustering/Load Balancing:** ট্রাফিক ডিস্ট্রিবিউট করার জন্য সার্ভার স্কেল (Scale) করা।

### What role does a reverse proxy (Nginx, Cloudflare) play in DDoS protection?
Reverse proxy (যেমন Nginx, HAProxy) এবং CDN (যেমন Cloudflare, AWS Shield) DDoS প্রতিরোধের মূল লেয়ার হিসেবে কাজ করে:
- **Traffic Filtering:** Cloudflare এর মতন সার্ভিসগুলো নেটওয়ার্ক লেয়ারেই ফায়ারওয়াল রুলস (Firewall rules) চেক করে ক্ষতিকর ট্রাফিক ব্লক করতে পারে।
- **Load Distribution:** এরা ট্রাফিককে বিভিন্ন গ্লোবাল সার্ভারে ছড়িয়ে দেয়, ফলে একটি সার্ভার ওভারলোড হয় না।
- **Caching:** এরা স্ট্যাটিক ফাইলগুলো ক্যাশ করে রাখে, যার ফলে মূল Node.js সার্ভারের উপর চাপ অনেক কমে যায়।


## 8. What is input validation, and how do you implement it?
**Input Validation** হলো ক্লায়েন্ট থেকে আসা ডেটা (যেমন form submission, API payload) সার্ভারে প্রসেস করার আগেই চেক করে দেখা যে ডেটাটি সঠিক এবং প্রত্যাশিত ফরমেটে আছে কিনা।

Node.js-এ এটি `Joi`, `Zod`, বা `express-validator` এর মতো লাইব্রেরি ব্যবহার করে implement করা যায়।

```javascript
// Zod Example
const { z } = require('zod');
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});
```

### What is the difference between whitelist validation and blacklist validation?
- **Whitelist Validation (Allowlist):** এটি শুধুমাত্র প্রত্যাশিত এবং বৈধ ইনপুটগুলোকে অনুমতি দেয়, বাকি সবকিছু রিজেক্ট করে দেয়। এটি সবচেয়ে নিরাপদ পদ্ধতি (যেমন "Country" ফিল্ডে শুধুমাত্র নির্দিষ্ট কিছু দেশের নাম অ্যালাও করা)।
- **Blacklist Validation (Denylist):** এটি নির্দিষ্ট কিছু ক্ষতিকর প্যাটার্ন বা ক্যারেক্টার (যেমন `<script>`, `OR 1=1`) কে আটকে দেয়। এটি তুলনামূলক কম নিরাপদ, কারণ attacker নতুন কোনো প্যাটার্ন ব্যবহার করে সিকিউরিটি বাইপাস করতে পারে।


## 9. How do you secure environment variables in Node.js?
- Sensitive তথ্য (যেমন Database URI, API Keys, Secret Keys) সরাসরি কোডের ভেতর হার্ডকোড (hardcode) না করে `.env` ফাইলে রাখা হয়।
- প্রজেক্টে `dotenv` প্যাকেজ ব্যবহার করে সেগুলোকে `process.env` অবজেক্টের মাধ্যমে লোড করা হয়।

### What is the risk of committing `.env` files to version control?
`.env` ফাইল ভার্সন কন্ট্রোলে (যেমন GitHub এ) পুশ (commit) করলে সকল sensitive data, পাসওয়ার্ড এবং সিক্রেট কি পাবলিক হয়ে যেতে পারে বা অন্যান্য টিমের মেম্বারদের কাছে এক্সপোজ হয়ে যেতে পারে। এর ফলে ডাটাবেস হ্যাক বা ক্লাউড বিলের অপব্যবহার হতে পারে। তাই সর্বদা `.gitignore` ফাইলে `.env` উল্লেখ করে রাখতে হয়।

### How do you manage secrets in production?
Production-এ `.env` ফাইল ব্যবহার করা উচিত নয়। এর বদলে:
- Cloud provider-এর ইনবিল্ট Environment Variables কনফিগারেশন ব্যবহার করা (যেমন Vercel, Heroku Config Vars, AWS Elastic Beanstalk Environment Properties)।
- **Secret Management Services** ব্যবহার করা, যেমন: AWS Secrets Manager, HashiCorp Vault, বা Azure Key Vault।


## 10. What is HTTPS, and how do you enable it in Node.js?
**HTTPS (Hypertext Transfer Protocol Secure)** হলো HTTP-এর একটি সিকিউর ভার্সন, যা ক্লায়েন্ট এবং সার্ভারের মধ্যে আদান-প্রদান করা ডেটাকে TLS/SSL এনক্রিপশনের মাধ্যমে সুরক্ষিত করে।

Node.js-এ এটি বিল্ট-ইন `https` মডিউলের মাধ্যমে এনাবল করা যায়। এর জন্য একটি SSL Certificate এবং Private Key প্রয়োজন হয়।

```javascript
const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443, () => {
    console.log('Server running on HTTPS');
});
```

### What is the difference between terminating TLS at the Node.js app vs at a load balancer?
- **Terminating TLS at Node.js app:** এখানে Node.js নিজেই সরাসরি HTTPS রিকোয়েস্ট হ্যান্ডেল করে এবং ডিক্রিপ্ট করে। এটি কনফিগার করা একটু জটিল এবং এটি Node.js এর CPU রিসোর্স অনেকটা ব্যবহার করে।
- **Terminating TLS at a Load Balancer / Reverse Proxy:** এখানে ট্রাফিক শুরুতে একটি Load Balancer (যেমন Nginx, AWS ALB) এ আসে। Load Balancer HTTPS ট্রাফিককে ডিক্রিপ্ট (Reverse Proxy-তে TLS termination হয়) করে এবং তারপর প্লেইন HTTP রিকোয়েস্ট হিসেবে Node.js অ্যাপ্লিকেশনের কাছে পাঠিয়ে দেয়। এটি বেস্ট প্র্যাকটিস কারণ এটি সার্ভারের পারফরম্যান্স ভালো রাখে এবং এক জায়গা থেকে সহজেই সার্টিফিকেট ম্যানেজমেন্ট করা যায়।
