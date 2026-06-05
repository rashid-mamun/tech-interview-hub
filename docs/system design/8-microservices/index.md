---
sidebar_position: 1
title: 'Microservices'
---


## 49. What are microservices and how do they differ from monoliths?

**Monolith (মনোলিথ):** সমস্ত বৈশিষ্ট্য একটি codebase এবং একটি deployable unit।
**Microservices:** ছোট ছোট, স্বাধীনভাবে deployable service গুলোর একটি collection।

| বৈশিষ্ট্য | Monolith | Microservices |
|---|---|---|
| **Deploy** | যেকোনো change এ পুরো app deploy | শুধু পরিবর্তিত service deploy |
| **Technology** | একটি language/stack | প্রতিটি service আলাদা technology |
| **Scaling** | পুরো app scale করতে হয় | শুধু দরকারি service scale |
| **Failure** | একটি bug পুরো app নামাতে পারে | Isolated failure |
| **Complexity** | কম (initially) | অনেক বেশি (networking, tracing, etc.) |

### What are the benefits and drawbacks of microservices?
**সুবিধা:**
- Independent deployment — feature দ্রুত ship।
- Technology diversity — সঠিক tool সঠিক কাজে।
- Scalability — hot service কে আলাদাভাবে scale।
- Team autonomy — প্রতিটি team তাদের service নিজে manage করে।

**অসুবিধা:**
- Distributed system complexity — network, latency, failure handling।
- Data consistency চ্যালেঞ্জিং।
- Testing কঠিন — integration test জটিল।
- Operational overhead — monitoring, logging, tracing সব আলাদা।

### When should you choose a monolith over microservices?
- **Startup/early stage:** Team ছোট, requirements unclear, monolith দিয়ে শুরু করুন।
- **Well-defined domain না থাকলে:** Wrong service boundary পরে বদলাতে অনেক কষ্ট।
- **Team expertise নেই:** Kubernetes, distributed tracing সব manage করতে অভিজ্ঞতা দরকার।
- **"Modular Monolith":** Internal module division রাখুন — পরে split সহজ হবে।

---

## 50. How do microservices communicate with each other?

### What is the difference between synchronous and asynchronous communication?
| বৈশিষ্ট্য | Synchronous (REST/gRPC) | Asynchronous (Message Queue) |
|---|---|---|
| **Response** | তাৎক্ষণিক অপেক্ষা | পরে, callback বা event driven |
| **Coupling** | Temporal coupling — B down হলে A fail | Decoupled — B down হলেও A চলে |
| **Complexity** | সহজ | Message queue manage দরকার |
| **Use case** | Real-time, user-facing | Background tasks, notifications |

### When should microservices communicate synchronously vs asynchronously?
- **Synchronous:** User এর request এর জন্য real-time response দরকার। যেমন: login, payment status check।
- **Asynchronous:** Non-critical background work। যেমন: email পাঠানো, report generate, analytics।
- **Hybrid:** Order place synchronous, but order fulfillment async।

### What is a service mesh and what problem does it solve?
**Service Mesh:** Microservices এর মধ্যে communication একটি dedicated infrastructure layer manage করে।

- **সমস্যা:** প্রতিটি service নিজে retry, timeout, mTLS, tracing implement করতে হয়।
- **সমাধান (Service Mesh):** **Sidecar proxy** (Envoy) প্রতিটি service এর পাশে থাকে, সব networking concern handle করে।

---

## 51. What is service discovery and how does it work in microservices?

**Service Discovery:** একটি service অন্য service কে dynamically কোথায় পাবে তা জানার mechanism।

- **সমস্যা:** Microservices auto-scale হলে IP এবং port বদলায়। Hardcode করা impossible।

### What is the difference between client-side and server-side service discovery?
| বৈশিষ্ট্য | Client-side Discovery | Server-side Discovery |
|---|---|---|
| **কীভাবে** | Client registry তে query করে, নিজে load balance করে | Load balancer বা router registry তে query করে |
| **উদাহরণ** | Netflix Eureka + Ribbon | AWS ALB + ECS Service Connect |
| **Flexibility** | বেশি (client নিজে algorithm বেছে নেয়) | কম |
| **Complexity** | Client জটিল হয় | Client simple থাকে |

### How do Consul, Eureka, and Kubernetes DNS handle service discovery?
- **Consul (HashiCorp):** Service registration + health check + DNS interface।
- **Eureka (Netflix):** Java-friendly, REST-based registry। Spring Cloud Eureka জনপ্রিয়।
- **Kubernetes DNS:** Service তৈরি হলে `service-name.namespace.svc.cluster.local` DNS entry অটো তৈরি। simplest।

---

## 52. How do you handle data management in a microservices architecture?

### What is the database-per-service pattern?
- প্রতিটি microservice নিজের private database রাখে — অন্য service সরাসরি access করতে পারে না।
- **সুবিধা:** Technology freedom (Order service PostgreSQL, Product service MongoDB), loose coupling।
- **অসুবিধা:** Cross-service query জটিল, data consistency চ্যালেঞ্জ।

### How do you handle data consistency across services without a shared database?
- **SAGA Pattern:** Distributed transaction compensating transaction দিয়ে।
- **Eventual Consistency:** কিছুক্ষণ পরে consistent হবে — acceptable কিনা বিবেচনা করুন।
- **Event Sourcing:** State সরাসরি না রেখে events রাখুন, state events থেকে derive করুন।

### What is event sourcing and how does it help with microservices data?
- **Traditional:** Database এ current state শুধু রাখা।
- **Event Sourcing:** সব change কে immutable event হিসেবে log করা।
  ```
  Event 1: OrderCreated {id: 1, items: [...]}
  Event 2: PaymentReceived {orderId: 1, amount: 100}
  Event 3: OrderShipped {orderId: 1, trackingNo: "XYZ"}
  
  Current State = Replay all events
  ```
- **সুবিধা:** Complete audit log, time travel (যেকোনো past state দেখা), easy event replay।

---

## 53. What is the strangler fig pattern?

**Strangler Fig Pattern:** Monolith কে ধীরে ধীরে microservices দিয়ে replace করার strategy।

- নামটি এসেছে Strangler Fig tree থেকে — যে গাছ host কে আস্তে আস্তে দখল করে।
- Monolith একসাথে বদলানো risky — Service by service migrated করুন।

### How do you migrate a monolith to microservices using the strangler fig pattern?
```
Phase 1: Proxy বসান monolith এর সামনে
Phase 2: একটি feature বের করুন (যেমন: User Authentication)
Phase 3: নতুন microservice deploy করুন
Phase 4: Proxy নতুন service এ route করুন
Phase 5: Monolith থেকে সেই feature remove করুন
Phase 6: পরবর্তী feature নিন
```

### What is an anti-corruption layer?
- Monolith এবং নতুন microservice এর মধ্যে translation layer।
- পুরনো domain model এবং নতুন domain model আলাদা — ACL translate করে।
- Microservice নিজস্ব model রক্ষা করে, legacy code থেকে contaminated হয় না।

---

## 54. How do you monitor and debug a microservices system?

### What is distributed tracing and how does Jaeger or Zipkin work?
- **Distributed Tracing:** একটি request সব microservices পার হওয়ার সময় track করা।
- একটি unique **Trace ID** request এর শুরুতে তৈরি হয়, সব service এ propagate হয়।
- প্রতিটি service operation কে **Span** বলে।
- **Jaeger/Zipkin:** Span collect করে visual timeline দেখায়।

### What is a correlation ID and how is it used?
- HTTP header এ একটি unique ID: `X-Correlation-ID: abc-123`।
- প্রতিটি service এই ID log করে।
- ইউজার bug report করলে correlation ID দিয়ে সব service এর log খুঁজে পাওয়া যায়।

### What are the key metrics to monitor for each microservice?
- **The Four Golden Signals:** Latency, Traffic, Errors, Saturation।
- Custom metrics: Queue depth, cache hit rate, DB connection pool usage।

---

## 55. What is a service mesh and what does it provide?

Service mesh প্রতিটি service এর পাশে **sidecar proxy** বসায়।

```
Service A → Sidecar Proxy A ←→ Sidecar Proxy B ← Service B
                ↕
          Control Plane (Istio Pilot)
```

### What is the difference between Istio and Linkerd?
| বৈশিষ্ট্য | Istio | Linkerd |
|---|---|---|
| **Complexity** | অনেক বেশি | কম — simpler ops |
| **Performance** | Envoy proxy — বেশি overhead | Linkerd proxy (Rust) — lightweight |
| **Features** | Extensive — traffic management, policy | Core features — mTLS, observability |
| **Adoption** | More widespread, Google/IBM backed | Simpler, CNCF Graduated |

### What is a sidecar proxy pattern?
- প্রতিটি application container এর পাশে একটি proxy container থাকে।
- Application সব traffic sidecar এর মাধ্যমে পাঠায়।
- Sidecar যা করে: mTLS, retry, circuit breaking, load balancing, telemetry।
- Application code clean — networking concern নেই।

### How does a service mesh handle mTLS between services?
- Service mesh certificates automatically issue এবং rotate করে।
- প্রতিটি sidecar service এর identity নিয়ে অন্য service এর সাথে mTLS establish করে।
- Developer কে manually certificate manage করতে হয় না।
