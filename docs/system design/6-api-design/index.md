---
sidebar_position: 1
title: 'API Design'
---


## 35. What are the principles of good API design?

ভালো API design করলে developer experience ভালো হয়, integration সহজ হয় এবং সিস্টেম maintain করা সহজ হয়।

### What makes an API RESTful?
**REST (Representational State Transfer)** এর মূল নীতিগুলো:
1. **Stateless:** প্রতিটি request স্বয়ংসম্পূর্ণ — server client এর আগের state মনে রাখে না।
2. **Uniform Interface:** HTTP methods সঠিকভাবে ব্যবহার করুন।
3. **Resource-based:** URL এ noun ব্যবহার করুন, verb নয়। ✅ `/users/123` ❌ `/getUser?id=123`
4. **Stateless:** Server client state store করে না।
5. **Cacheable:** Response cacheable হওয়া উচিত।

### What is the Richardson Maturity Model?
| Level | নাম | বৈশিষ্ট্য |
|---|---|---|
| **0** | The Swamp of POX | একটিই endpoint, সব POST — SOAP-like |
| **1** | Resources | আলাদা resource URL: `/users`, `/orders` |
| **2** | HTTP Verbs | GET, POST, PUT, DELETE সঠিকভাবে |
| **3** | Hypermedia (HATEOAS) | Response এ next possible actions এর link থাকে |

### How do you version a public API?
- **URL Path (সবচেয়ে সাধারণ):** `/api/v1/users`, `/api/v2/users`।
- **Header:** `Accept: application/vnd.myapp.v2+json`।
- **Query Param:** `/users?version=2` — সহজ কিন্তু ugly।
- **Best practice:** URL path versioning করুন, Semantic versioning follow করুন।

---

## 36. What is the difference between REST, GraphQL, and gRPC?

| বৈশিষ্ট্য | REST | GraphQL | gRPC |
|---|---|---|---|
| **Protocol** | HTTP/1.1 | HTTP | HTTP/2 |
| **Format** | JSON/XML | JSON | Protocol Buffers (binary) |
| **Typing** | Manual/OpenAPI | Strongly typed schema | Strongly typed .proto |
| **Over/Under-fetching** | সমস্যা আছে | নেই — ঠিক যা চাই তাই | নেই |
| **Browser Support** | ✅ সহজ | ✅ | ⚠️ gRPC-Web দরকার |
| **Best For** | Public APIs | Flexible client needs | Microservices, low latency |

### When would you choose GraphQL over REST?
- **বেছে নিন GraphQL যখন:** Client বিভিন্ন ধরনের data combination দরকার, mobile app bandwidth সাশ্রয় করতে চায়, rapid front-end iteration।
- **এড়িয়ে চলুন:** Simple CRUD, caching জটিল (query unique বলে HTTP cache কঠিন), team GraphQL জানে না।

### What are the performance benefits of gRPC over REST?
- **Protocol Buffers:** JSON এর চেয়ে ৫-১০x ছোট payload।
- **HTTP/2:** Multiplexing — একটি connection এ একসাথে অনেক request।
- **Streaming:** Server-side, client-side, bidirectional streaming support।
- **Code generation:** .proto file থেকে আপনাআপনি client/server code generate।

### What is the n+1 query problem in GraphQL and how is it solved?
```
Query: { users { posts { comments } } }
N+1: 1 (users fetch) + N (posts for each user) + N*M (comments for each post)
```
- **সমাধান: DataLoader** — request গুলো batch করে একটি query তে পাঠায়।

---

## 37. How do you design a pagination API for large datasets?

### What is the difference between offset pagination and cursor-based pagination?
| বৈশিষ্ট্য | Offset Pagination | Cursor-based Pagination |
|---|---|---|
| **URL** | `/posts?page=2&limit=20` | `/posts?cursor=xyz&limit=20` |
| **DB Query** | `LIMIT 20 OFFSET 40` | `WHERE id > last_id LIMIT 20` |
| **Performance** | বড় offset এ slow (DB পুরোটা scan করে) | সবসময় fast |
| **Real-time data** | নতুন item যোগ হলে page shift হয় | Stable — cursor based |
| **Random access** | যেকোনো page এ যাওয়া যায় | শুধু next/prev |

### Why is cursor-based pagination preferred for real-time feeds?
- Twitter/Instagram feed এ নতুন post আসতে থাকে।
- Offset pagination এ page 2 দেখলে, নতুন 5টি post আসলে পুরনো items shift হয়ে duplicate বা missing দেখায়।
- Cursor (last seen item ID) stable reference — যতই নতুন item আসুক, cursor থেকে continue হয়।

### How do you handle page size limits in a public API?
- Default limit সেট করুন: `limit=20`।
- Maximum limit enforce করুন: `max limit=100` — ইউজার বেশি চাইলেও ১০০ দিন।
- Response এ `next_cursor`, `has_more`, `total_count` দিন।

---

## 38. What is rate limiting in APIs and how do you implement it?

**Rate Limiting** হলো প্রতি ইউজার/IP কে নির্দিষ্ট সময়ে নির্দিষ্ট সংখ্যক request এর অনুমতি দেওয়া।

### What algorithms are used for rate limiting?
| Algorithm | কীভাবে কাজ করে | Pros/Cons |
|---|---|---|
| **Token Bucket** | প্রতি second একটি bucket এ token যোগ হয়, request এলে token খরচ | Burst allow করে |
| **Leaky Bucket** | Queue এ request রাখে, fixed rate এ process করে | Smooth output |
| **Fixed Window Counter** | প্রতি minute window তে count রাখে | Window edge এ spike সম্ভব |
| **Sliding Window Log** | Last N seconds এর সব request timestamp track করে | Most accurate, memory বেশি |

### How do you implement distributed rate limiting?
- **Redis + Lua Script:** Atomic operation দিয়ে counter increment।
- Redis এ key: `rate_limit:{user_id}:{window}` — INCR + EXPIRE।

```
MULTI
INCR user:123:1702000000
EXPIRE user:123:1702000000 60
EXEC

Count > 100 → reject with 429
```

### How do you communicate rate limit status to clients (HTTP headers)?
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 43
X-RateLimit-Reset: 1702000060
Retry-After: 30
```

---

## 39. How do you design an idempotent API?

**Idempotent API:** একই request একাধিকবার পাঠালেও ফলাফল একই — no unwanted side effects।

### Which HTTP methods are idempotent by definition?
| Method | Idempotent? | Safe? | ব্যাখ্যা |
|---|---|---|---|
| GET | ✅ | ✅ | শুধু পড়ে, পরিবর্তন করে না |
| PUT | ✅ | ❌ | Replace করে — বারবার করলে same result |
| DELETE | ✅ | ❌ | ২য় DELETE = 404, কিন্তু state same |
| POST | ❌ | ❌ | বারবার করলে duplicate তৈরি |
| PATCH | ❌ (usually) | ❌ | Depends on implementation |

### How do you make a POST endpoint idempotent using idempotency keys?
- Client একটি unique `Idempotency-Key` header পাঠায়।
- Server সেই key দেখে: আগে process হয়েছে কি? হলে same response return করো।

```http
POST /payments
Idempotency-Key: abc-123-xyz

{ "amount": 1000, "to": "user_456" }
```

---

## 40. How do you handle API versioning?

### What are the different API versioning strategies?
| কৌশল | উদাহরণ | Pros | Cons |
|---|---|---|---|
| **URL Path** | `/api/v1/users` | স্পষ্ট, cacheable | URL ugly হয় |
| **Query Param** | `/users?v=1` | Easy | Non-standard |
| **Request Header** | `API-Version: 2024-01` | Clean URL | কম visible |
| **Accept Header** | `Accept: application/vnd.v2+json` | HTTP standard | Complex |

### How long should you maintain backward compatibility in a versioned API?
- **ন্যূনতম ৬-১২ মাস** deprecation notice দেওয়ার পরে।
- Sunset header দিন: `Sunset: Sat, 31 Dec 2024 00:00:00 GMT`।
- Email notification + documentation update।
- Breaking change এ major version bump করুন (v1 → v2)।

---

## 41. What is an API gateway and what does it provide?

**API Gateway** হলো সব external client request এর single entry point।

```
Mobile App  ─┐
Web App     ─┤→ API Gateway → User Service
3rd Party  ─┘              → Order Service
                           → Product Service
```

### What is the difference between an API gateway and a reverse proxy?
| বৈশিষ্ট্য | Reverse Proxy (Nginx) | API Gateway (Kong, AWS API GW) |
|---|---|---|
| **Layer** | Network/HTTP level | Application level |
| **ক্ষমতা** | Load balance, SSL termination, cache | Auth, rate limit, transform, routing, analytics |
| **Business Logic** | নেই | সীমিত থেকে বেশি |
| **উদাহরণ** | Nginx, HAProxy | AWS API Gateway, Kong, Envoy |

### How does an API gateway handle authentication and authorization?
- **Authentication:** Token validate করা (JWT, OAuth) — backend কে একাধিকবার করতে হয় না।
- **Authorization:** Policy based — "এই API endpoint এ শুধু admin যাবে।"
- **API Key management:** Third-party developer দের জন্য।

### What is a BFF (Backend for Frontend) pattern?
- প্রতিটি frontend (mobile, web, TV) এর জন্য আলাদা gateway যা তাদের specific needs অনুযায়ী response shape করে।
- Mobile কে compact response, web কে full response।
- GraphQL প্রায়ই BFF pattern implement করে।
