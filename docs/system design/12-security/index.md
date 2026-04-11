---
sidebar_position: 1
title: ''
---



## 79. How do you design a secure authentication system?

**Authentication (প্রমাণীকরণ):** আপনি কে? তা নিশ্চিত করা।
**Authorization (অনুমতি):** আপনি কী করতে পারবেন? তা নিশ্চিত করা।

### What is the difference between session-based and token-based authentication?

| বৈশিষ্ট্য | Session-based | Token-based (JWT) |
|---|---|---|
| **State** | Server-side session store | Stateless — token এ সব info |
| **Scalability** | Sticky session বা shared session store দরকার | যেকোনো server validate করতে পারে |
| **Revocation** | Server থেকে session মুছে দিন | Difficult — token valid থাকে expiry পর্যন্ত |
| **Storage** | Server memory/Redis | Client (cookie বা localStorage) |
| **Best For** | Traditional web app | SPA, Mobile app, Microservices |

```
Session flow:
Login → Server creates session_id → Set Cookie → Client sends cookie every request
Server validates session_id → DB/Redis lookup

JWT flow:
Login → Server creates JWT (signed) → Client stores → Client sends Bearer token
Server validates signature locally → No DB lookup needed
```

### How do you store passwords securely (bcrypt, Argon2)?
- **কখনো plain text এ নয়।**
- **MD5/SHA-1:** Broken — rainbow table attack সম্ভব।
- **bcrypt:** Adaptive — `cost factor` বাড়িয়ে GPU attack slow করুন।
- **Argon2 (recommended):** Memory-hard — GPU/ASIC দিয়ে brute force কঠিন।

```python
import bcrypt

# Password store:
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# Password verify:
bcrypt.checkpw(password.encode(), hashed)  # True/False
```

### How do you implement multi-factor authentication (MFA)?
- **Something you know:** Password।
- **Something you have:** OTP (TOTP — Google Authenticator, SMS)।
- **Something you are:** Biometric (fingerprint, face)।

**TOTP flow:**
1. User setup: Server generates secret key → QR code দেখাও।
2. Login: Password + TOTP code (30-sec rotating)।
3. Server: TOTP code verify (shared secret + current time)।

---

## 80. What is OAuth 2.0 and how does it work in system design?

**OAuth 2.0:** Third-party application কে আপনার data access করার permission দেওয়ার framework। "Sign in with Google" এর পেছনে এই protocol।

### What are the OAuth 2.0 grant types?
| Grant Type | কখন ব্যবহার | Flow |
|---|---|---|
| **Authorization Code** | Web app, most secure | User → Auth Server → Code → Token |
| **Client Credentials** | Machine-to-machine | Client secret → Token directly |
| **PKCE (Recommended for SPA/Mobile)** | Public clients | Code verifier + challenge |
| **Implicit** | (Deprecated) | ~~Token directly in URL~~ |

**Authorization Code Flow:**
```
1. User → "Login with Google"
2. App → Google (client_id, redirect_uri, scope)
3. User → Google তে login + consent
4. Google → App (authorization_code)
5. App → Google (code + client_secret) → access_token + refresh_token
6. App Google API call করে access_token দিয়ে
```

### What is the difference between OAuth 2.0 and OpenID Connect?
- **OAuth 2.0:** Authorization — "কী access দেবেন?"
- **OpenID Connect (OIDC):** OAuth 2.0 এর উপর — Authentication এর layer — "এই ব্যক্তি কে?"
- OIDC একটি `id_token` (JWT) দেয় যাতে user info থাকে।
- **Auth0, Okta, Google:** OIDC provider।

### How do you implement token refresh and revocation?
```
Access Token: Short-lived (15 min) — stateless JWT
Refresh Token: Long-lived (30 days) — stored in DB

Refresh flow:
Access token expire → Client sends refresh_token → Server validates → New access_token

Revocation:
Refresh token blacklist করুন DB তে।
Access token short-lived বলে expiry পর্যন্ত valid থাকে।
```

---

## 81. How do you secure inter-service communication in microservices?

### What is mutual TLS (mTLS) and how does it work?
- **TLS:** Client সার্ভারের identity verify করে।
- **mTLS:** উভয় পক্ষ একে অপরের identity verify করে।

```
Service A                         Service B
    │                                 │
    │ ── TLS Handshake ──────────────→│
    │ ← Server Certificate ──────────│
    │ ── Client Certificate ─────────→│
    │ ← Verify OK ───────────────────│
    │ ──── Encrypted Data ────────────→│
```

- প্রতিটি service এর certificate আছে — unauthorized service connected হতে পারবে না।

### How does a service mesh like Istio enforce mTLS?
- Certificate authority (CA) প্রতিটি service এর জন্য certificate issue করে।
- Sidecar proxy (Envoy) automatically certificate present করে।
- Developer কে manually TLS handle করতে হয় না।
- **STRICT mode:** mTLS ছাড়া কোনো request accept না।

### What is a service account and how is it used for authorization?
- Service account হলো একটি non-human identity — machine বা service।
- Kubernetes: `ServiceAccount` resource — Pod যে API call করতে পারবে তার permission।
- AWS: IAM Role — EC2/Lambda কে নির্দিষ্ট AWS resources access করতে দেয়।

---

## 82. How do you design a system to protect against DDoS attacks?

**DDoS (Distributed Denial of Service):** হাজার হাজার bot দিয়ে server কে flood করে।

### What is rate limiting and how does it mitigate DDoS?
- IP-based rate limiting: একই IP থেকে ১ মিনিটে ১০০ request এর বেশি → block।
- **Limitation:** Botnet — অনেক আলাদা IP ব্যবহার করে। IP rate limit bypass।
- **User-based rate limiting:** Authenticated user এর rate limit আরও effective।

### How do CDNs absorb volumetric DDoS attacks?
- CDN এর global capacity অনেক বেশি — Cloudflare প্রতিদিন ১৫৭ Tbps পর্যন্ত absorb করেছে।
- Traffic origin এর কাছে drop করে — আপনার origin server পর্যন্ত পৌঁছায় না।
- **Anycast routing:** Traffic globally distribute হয়।
- **BGP Blackholing:** Malicious IP prefix block করা।

### What is a WAF (Web Application Firewall) and how does it help?
- HTTP traffic inspect করে — application layer (L7) DDoS।
- Block করে: SQL injection, XSS, known malicious patterns, bot signatures।
- **AWS WAF, Cloudflare WAF:** Managed rules + custom rules।
- **Challenge page:** Suspicious request এ CAPTCHA দেখান।

---

## 83. What is encryption at rest vs encryption in transit?

| | Encryption at Rest | Encryption in Transit |
|---|---|---|
| **কখন** | Data disk এ stored থাকাকালীন | Data network এ transfer হওয়ার সময় |
| **Protocol/Algo** | AES-256 (symmetric) | TLS 1.3 |
| **Protect from** | Stolen disk, unauthorized DB access | Network eavesdropping, MITM |
| **উদাহরণ** | AWS RDS encrypted volume | HTTPS, mTLS |

### How do you implement encryption at rest in a cloud database?
- **AWS RDS:** Enable encryption at creation — AWS KMS managed key।
- **AWS S3:** Default encryption — SSE-S3 বা SSE-KMS।
- **Transparent Data Encryption (TDE):** PostgreSQL, MySQL নিজেই data encrypt করে।

### What is envelope encryption?
```
Data → encrypt with Data Encryption Key (DEK) → Encrypted Data
DEK → encrypt with Key Encryption Key (KEK/Master Key) → Encrypted DEK

Store: [Encrypted Data + Encrypted DEK]
Decrypt: KEK দিয়ে DEK decrypt → DEK দিয়ে Data decrypt
```
- Master key rotate করলে সব DEK re-encrypt করতে হয় না।
- AWS KMS এই pattern ব্যবহার করে।

### What key management strategies exist (KMS, HSM)?
- **AWS KMS:** Managed service — key storage, rotation, audit log।
- **HashiCorp Vault:** Self-hosted key management।
- **HSM (Hardware Security Module):** Physical device এ key store — highest security।

---

## 84. How do you handle secrets management in a distributed system?

### What is HashiCorp Vault and how does it manage secrets?
```
App → Vault (authenticate with role) → Vault issues DB credentials
Vault → DB (creates temporary credentials) → Returns to App
Credentials expire after TTL → App renews or re-fetches
```
- **Dynamic secrets:** Database credentials on-demand generate — কেউ static password জানে না।
- **Audit log:** কে কখন কোন secret access করেছে।
- **Secret rotation:** Old secret replace করা বিদ্যমান app কে disturb না করে।

### What are the risks of storing secrets in environment variables?
- `docker inspect` বা `ps aux` দিয়ে দেখা যায়।
- Log এ accidentally print হতে পারে।
- Container orchestration platform এ দেখা যায়।
- **Better alternatives:** AWS Secrets Manager, Vault, Kubernetes Secrets (encrypted etcd)।

### How do you rotate secrets without downtime?
```
১. নতুন credential তৈরি (নতুন DB password)
২. Application কে নতুন credential পড়তে বলুন (Vault dynamic secret)
৩. Application reconnect করুন নতুন credential দিয়ে (connection pool drain)
৪. পুরনো credential revoke
```
- **Blue-green deployment:** নতুন version নতুন secret, পুরনো version পুরনো secret।
