---
sidebar_position: 1
title: ''
---



## 41. How do you secure a Node.js application?

Security হলো একটি layered approach — একটি layer fail করলেও অন্যগুলো রক্ষা করবে।

### What is the role of the `helmet` middleware and what HTTP headers does it set?
```javascript
const helmet = require('helmet');
app.use(helmet());

// Helmet যে headers set করে:
// X-Content-Type-Options: nosniff          (MIME sniffing রোধ)
// X-Frame-Options: SAMEORIGIN              (Clickjacking রোধ)
// X-XSS-Protection: 0                     (Legacy XSS filter)
// Strict-Transport-Security: max-age=...   (HTTPS enforce)
// Content-Security-Policy: ...             (XSS, injection রোধ)
// Referrer-Policy: no-referrer             (Referrer লুকানো)
```

### What is the principle of least privilege and how do you apply it in Node.js?
- **Concept:** Process/user কে শুধু সেই permission দিন যা তার কাজের জন্য দরকার।
- **DB user:** `SELECT`, `INSERT`, `UPDATE` — কিন্তু `DROP TABLE` নয়।
- **File access:** শুধু নির্দিষ্ট folder, সব filesystem নয়।
- **Docker:** Non-root user দিয়ে container চালান।
```dockerfile
USER node  # root এর বদলে
```

### How do you perform dependency vulnerability scanning?
```bash
# Built-in — package.json এর dependency scan
npm audit
npm audit fix          # Auto fix করুন
npm audit fix --force  # Breaking changes সহ (সতর্কতার সাথে)

# Snyk — বেশি detailed, CI integration
npx snyk test
npx snyk monitor       # Production monitoring
```

---

## 42. What is JWT, and how do you implement it in Node.js?

**JWT (JSON Web Token):** Header.Payload.Signature — stateless authentication token।

```javascript
const jwt = require('jsonwebtoken');

// Sign (login এ)
const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
);

// Verify (প্রতিটি protected request এ)
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Invalid token' });
    }
}
```

### Where should JWTs be stored — localStorage vs httpOnly cookies?
| | localStorage | httpOnly Cookie |
|---|---|---|
| **XSS Attack** | ❌ Vulnerable — JS দিয়ে পড়া যায় | ✅ Safe — JS access নেই |
| **CSRF Attack** | ✅ Safe — Auto-send হয় না | ❌ Vulnerable — SameSite দিয়ে মোকাবেলা |
| **Mobile App** | ✅ সহজ | ⚠️ জটিল |
| **Recommended** | API-only + short-lived | Web app — httpOnly + Secure + SameSite |

### How do you revoke a JWT before it expires?
- JWT stateless — server side revoke impossible by design।
- **Solutions:**
  - **Token blacklist:** Redis এ revoked token ID store।
  - **Short-lived access token + refresh token rotation.**
  - **Version field:** User এ `tokenVersion` রাখুন, logout এ increment।

```javascript
// Token blacklist check
async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Blacklist check
    const isRevoked = await redis.get(`revoked:${decoded.jti}`);
    if (isRevoked) return res.status(401).json({ error: 'Token revoked' });

    req.user = decoded;
    next();
}
```

---

## 43. How do you prevent SQL injection in Node.js?

**SQL Injection:** Malicious SQL code কে user input এর মাধ্যমে query তে inject করা।

```javascript
// ❌ VULNERABLE — String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;
// email = "' OR '1'='1" → সব user expose!

// ✅ SAFE — Parameterized queries
const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]  // Automatically escape করা হয়
);

// ✅ SAFE — Named parameters (MySQL)
await connection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
);
```

### How do ORMs like Prisma or Sequelize handle injection by default?
```javascript
// Prisma — সবসময় parameterized (safe by default)
const user = await prisma.user.findUnique({
    where: { email: userInput }  // Auto-escape
});

// Sequelize — parameterized
const user = await User.findOne({
    where: { email: userInput }  // Safe
});

// Raw query এ সাবধান!
// ❌ UNSAFE
await prisma.$queryRaw`SELECT * FROM users WHERE email = '${email}'`;
// ✅ SAFE
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

### What is the difference between input sanitization and input validation?
- **Validation:** Input কি expected format এ আছে? (email format, required field)
- **Sanitization:** Input clean করা (HTML tags strip, whitespace trim)
- **Best practice:** Validate first, then sanitize।

---

## 44. What is CSRF, and how do you protect against it?

**CSRF (Cross-Site Request Forgery):** Malicious site ব্যবহারকারীর browser দিয়ে authenticated request পাঠায়।

```javascript
// csurf middleware (session-based app এর জন্য)
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
    res.render('form', { csrfToken: req.csrfToken() });
});

// HTML form এ hidden field
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">

app.post('/submit', csrfProtection, (req, res) => {
    // Token মিললে proceed
    res.json({ success: true });
});
```

### When is CSRF protection not necessary?
- **Stateless JWT API:** Cookie ব্যবহার করে না তাই CSRF সম্ভব নয়।
- Browser automatically JWT header পাঠায় না — malicious site পারে না।
- **শুধু প্রয়োজন:** Cookie-based session authentication।

### What is the SameSite cookie attribute and how does it mitigate CSRF?
```javascript
res.cookie('session', token, {
    httpOnly: true,
    secure: true,         // HTTPS only
    sameSite: 'strict'    // Cross-site request এ cookie পাঠাবে না
    // 'lax' = Top-level navigation এ allow (GET)
    // 'strict' = সব cross-site request block
    // 'none' = সব allow (secure=true দরকার)
});
```

---

## 45. How do you handle password hashing in Node.js?

```javascript
const bcrypt = require('bcrypt');

// Hash (register এ)
async function hashPassword(plainPassword) {
    const saltRounds = 12; // Work factor — বেশি = ধীর = secure
    return bcrypt.hash(plainPassword, saltRounds);
}

// Verify (login এ)
async function verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

// Usage
const hashed = await hashPassword('myPassword123');
// '$2b$12$...' — bcrypt format

const isValid = await verifyPassword('myPassword123', hashed);
// true
```

### Why is `bcrypt` preferred over `SHA-256` or `MD5` for password hashing?
| | MD5/SHA-256 | bcrypt |
|---|---|---|
| **Speed** | অত্যন্ত দ্রুত | ইচ্ছাকৃতভাবে ধীর |
| **GPU attack** | Billions/sec crack করা যায় | Hundreds/sec — impractical |
| **Salt** | Manual add করতে হয় | Built-in random salt |
| **Purpose** | Data integrity (file hash) | Password storage |

### What is `Argon2` and how does it compare to `bcrypt`?
```javascript
const argon2 = require('argon2');

// Hash
const hash = await argon2.hash('password', {
    type: argon2.argon2id,  // Memory-hard
    memoryCost: 2 ** 16,    // 64MB RAM প্রয়োজন
    timeCost: 3,
    parallelism: 1
});

// Verify
const valid = await argon2.verify(hash, 'password');
```
- **Argon2:** আরও modern, memory-hard (GPU/ASIC attack impractical)। Password Hashing Competition winner।
- **bcrypt:** Battle-tested, widely support। Production এ safe।

---

## 46. What is rate limiting, and how do you implement it?

```javascript
const rateLimit = require('express-rate-limit');

// Global rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // প্রতি window এ max 100 request
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,     // Rate limit headers
    legacyHeaders: false,
});

app.use(limiter);

// Login endpoint এ strict limit
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,              // 5 attempts
    skipSuccessfulRequests: true,
});

app.post('/auth/login', loginLimiter, loginHandler);
```

### How do you implement distributed rate limiting using Redis across multiple servers?
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
});
// এখন সব server instance share করবে একটি counter
```

### What is the difference between rate limiting and throttling?
- **Rate Limiting:** নির্দিষ্ট সময়ে নির্দিষ্ট সংখ্যক request। বেশি হলে 429।
- **Throttling:** Request গুলো delay করে queue এ রাখে — reject নয়, slow করে।

---

## 47. How do you prevent DDoS attacks in Node.js?

```javascript
// Request body size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: false }));

// Rate limiting (উপরে দেখুন)

// Timeout — slow request kill করুন
const timeout = require('connect-timeout');
app.use(timeout('5s'));
app.use((req, res, next) => {
    if (!req.timedout) next();
});

// Nginx এ request limit (upstream)
// limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### What role does a reverse proxy (Nginx, Cloudflare) play in DDoS protection?
- **Nginx:** Connection limit, request rate limit, upstream protection।
- **Cloudflare:** WAF, Bot management, Challenge pages, BGP blackholing।
- Node.js process কে direct internet expose করবেন না — reverse proxy এর পেছনে রাখুন।

---

## 48. What is input validation, and how do you implement it?

```javascript
const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).max(120),
    role: Joi.string().valid('user', 'admin').default('user')
});

// Middleware
function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,    // সব error একসাথে দেখান
            stripUnknown: true,   // Extra field remove
        });
        if (error) {
            return res.status(400).json({
                errors: error.details.map(d => d.message)
            });
        }
        req.body = value; // Sanitized value
        next();
    };
}

app.post('/users', validate(userSchema), createUser);
```

### What is the difference between whitelist validation and blacklist validation?
- **Whitelist (Allow-list):** শুধু known good values allow করুন। (Recommended)
- **Blacklist (Deny-list):** Known bad values block করুন। (Avoid — attacker নতুন vector খোঁজে)

---

## 49. How do you secure environment variables in Node.js?

```javascript
// ✅ dotenv — development এ
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;

// ❌ NEVER hardcode secrets
const secret = 'my-super-secret'; // Code এ এটা করবেন না!
```

### What is the risk of committing `.env` files to version control?
- `.env` এ DB password, API key, JWT secret থাকে।
- Git history তে একবার commit হলে সরানো কঠিন।
- **সমাধান:**
  ```bash
  # .gitignore
  .env
  .env.local
  .env.production
  ```
  `.env.example` commit করুন — actual value ছাড়া।

### How do you manage secrets in production?
- **AWS Secrets Manager / Parameter Store।**
- **HashiCorp Vault।**
- **Kubernetes Secrets (encrypted etcd)।**
- Environment variable runtime injection (Docker/K8s)।

---

## 50. What is HTTPS, and how do you enable it in Node.js?

```javascript
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/path/to/private-key.pem'),
    cert: fs.readFileSync('/path/to/certificate.pem'),
};

https.createServer(options, app).listen(443, () => {
    console.log('HTTPS server on port 443');
});

// HTTP → HTTPS redirect
const http = require('http');
http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80);
```

### What is the difference between terminating TLS at the Node.js app vs at a load balancer?
| | Node.js তে TLS | Load Balancer তে TLS |
|---|---|---|
| **Certificate management** | App এ রাখতে হয় | LB এ centralized |
| **Performance** | App CPU ব্যবহার | LB এ offload |
| **Internal traffic** | Plaintext (safe if private network) | Plaintext (same) |
| **Best Practice** | ছোট app | Production (ALB, Nginx) |

- **Production best practice:** TLS terminate করুন Load Balancer বা Nginx এ। Node.js HTTP দিয়ে চলুক।
