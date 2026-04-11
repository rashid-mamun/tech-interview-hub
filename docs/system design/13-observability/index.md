---
sidebar_position: 1
title: ''
---


## 85. What are the three pillars of observability?

**Observability** হলো একটি system এর internal state বাইরে থেকে বোঝার ক্ষমতা — শুধু "আছে না নেই" নয়, "কেন এরকম" বোঝার ক্ষমতা।

তিনটি স্তম্ভ:

| স্তম্ভ | কী | উত্তর দেয় |
|---|---|---|
| **Logs** | Discrete event এর timestamped record | "কী হয়েছিল?" |
| **Metrics** | Aggregated numerical measurement | "কতটা খারাপ?" |
| **Traces** | Request এর end-to-end journey | "কোথায় হয়েছিল, কত সময় লেগেছে?" |

### What is the difference between logs, metrics, and traces?
- **Log:** `2024-01-15 10:30:45 ERROR UserService: User 123 not found`।
- **Metric:** `http_requests_total{status="500"} 42` (Prometheus format)।
- **Trace:** Request ID `abc-123` — Service A (50ms) → Service B (120ms) → DB (30ms) → total 200ms।

### How do logs, metrics, and traces complement each other?
```
Alert fires: "Error rate > 5%"  ← Metric
        ↓
Dashboard দেখি: কোন endpoint?  ← Metric with labels
        ↓
Trace দেখি: কোথায় slow/error? ← Trace
        ↓  
Log দেখি: কী error message?    ← Log
```

### What tools are used for each pillar?
| স্তম্ভ | Open Source | Managed |
|---|---|---|
| **Logs** | ELK Stack, Loki | Datadog, CloudWatch |
| **Metrics** | Prometheus + Grafana | Datadog, CloudWatch Metrics |
| **Traces** | Jaeger, Zipkin | AWS X-Ray, Datadog APM |

---

## 86. How do you design a logging system for a distributed application?

### What is structured logging and why is it preferred?
**Unstructured log (পড়তে কঠিন machine এর জন্য):**
```
User 123 failed to login from IP 192.168.1.1 at 2024-01-15 10:30:45
```

**Structured log (JSON — machine readable):**
```json
{
  "timestamp": "2024-01-15T10:30:45Z",
  "level": "ERROR",
  "service": "auth-service",
  "user_id": 123,
  "ip": "192.168.1.1",
  "event": "login_failed",
  "reason": "invalid_password",
  "trace_id": "abc-123-xyz"
}
```
- **সুবিধা:** Filter, search, aggregate করা সহজ — `level=ERROR AND service=auth-service`।

### How do you aggregate logs from hundreds of services (ELK stack, Loki)?
**ELK Stack:**
```
Application → Filebeat/Fluentd (log shipper)
           → Logstash (parse, transform)
           → Elasticsearch (store, index)
           → Kibana (visualize, search)
```

**Loki (Grafana Labs):**
- Log metadata label করে index করে — log content index করে না।
- Storage অনেক কম (Elasticsearch এর তুলনায়)।
- Grafana দিয়ে Prometheus metric এর পাশে log দেখা যায়।

### How do you handle log sampling to reduce cost?
- **সমস্যা:** Millions of log/sec → storage অনেক দামি।
- **Head-based sampling:** শুরুতে X% request এর জন্য log।
- **Tail-based sampling:** Error বা slow request এর log সবসময় রাখো, সফল request sample করো।
- **Log levels:** Production এ INFO/ERROR রাখুন, DEBUG বন্ধ।

---

## 87. What is distributed tracing and how does it work?

### What is a trace, span, and trace ID?
```
Trace ID: abc-123 (পুরো request এর identifier)
    │
    ├─ Span 1: API Gateway (duration: 5ms)
    ├─ Span 2: User Service (duration: 80ms)
    │   ├─ Span 2a: DB query (duration: 60ms)
    │   └─ Span 2b: Cache lookup (duration: 5ms)
    └─ Span 3: Email Service (duration: 20ms)
```

- **Trace:** একটি request এর সম্পূর্ণ lifecycle।
- **Span:** একটি নির্দিষ্ট operation এর unit (start time + duration + metadata)।
- **Trace ID:** সব span কে একত্রিত করার জন্য shared ID।

### How does a correlation ID propagate through a distributed system?
```
Client Request → API Gateway
    Header: X-Trace-ID: abc-123
    
API Gateway → User Service
    Header: X-Trace-ID: abc-123  (propagate করো)
    
User Service → DB
    SQL comment: /* trace=abc-123 */
    
User Service logs:
    {"trace_id": "abc-123", "event": "user_fetched", ...}
```

### What is OpenTelemetry and why is it important?
- **OpenTelemetry (OTel):** Vendor-neutral instrumentation standard।
- একবার OTel দিয়ে instrument করলে Jaeger, Zipkin, Datadog, AWS X-Ray যেকোনো backend তে পাঠানো যায়।
- SDK supports: Python, Java, Go, Node.js, .NET।
- **CNCF Graduated project** — industry standard হচ্ছে।

---

## 88. What metrics should you monitor for a backend system?

### What are the four golden signals (latency, traffic, errors, saturation)?
**Google SRE Book থেকে:**

| Signal | কী measure করে | Example query |
|---|---|---|
| **Latency** | Request কতটা দ্রুত সার্ভ হচ্ছে | `p99(http_request_duration)` |
| **Traffic** | System কতটা demand handle করছে | `http_requests_total rate per second` |
| **Errors** | কতটা request fail হচ্ছে | `(5xx responses / total) × 100%` |
| **Saturation** | System কতটা ভরা | `CPU usage %, memory %, queue depth` |

### How do you set meaningful alert thresholds?
- **Symptom-based alerting:** "User experience খারাপ হচ্ছে?"
  - Error rate > 1% → Alert।
  - p99 latency > 500ms → Alert।
- **Avoid cause-based:** "CPU > 80%" — CPU বেশি হলেও সবসময় problem নাও হতে পারে।
- **Burn rate alerting:** SLO কত দ্রুত consume হচ্ছে — Google SRE approach।

### What is a p99 latency and why is it more meaningful than average latency?
```
100 requests latency: [10, 15, 20, 20, 25, 50, 100, 200, 500, 2000]ms

Average: (10+15+...+2000)/10 = ~294ms  ← The 2000ms outlier skews this
Median (p50): 25ms           ← Half of users এর নিচে
p95: 500ms                   ← 95% user এর এটার নিচে
p99: 2000ms                  ← ১% user 2 seconds wait করছে
```

- Average একটি slow user কে লুকিয়ে ফেলে।
- p99 দেখলে worst-case user experience বোঝা যায়।

---

## 89. How do you design an alerting system?

### What is the difference between symptom-based and cause-based alerting?
| | Symptom-based | Cause-based |
|---|---|---|
| **প্রশ্ন** | "ইউজার কি কষ্ট পাচ্ছে?" | "সার্ভারে কী হয়েছে?" |
| **উদাহরণ** | "Success rate < 99%" | "CPU > 80%" |
| **Alert value** | বেশি — directly user impact | কম — CPU বেশি হলেও ok হতে পারে |
| **Action** | সবসময় investigate দরকার | Investigate needed কিনা নিশ্চিত নয় |

### How do you reduce alert fatigue?
**Alert fatigue:** অনেক false alert আসলে on-call তে real alert দেখা কঠিন হয়ে পড়ে।

- **High signal alerts only:** শুধু user-impacting এবং actionable alert করুন।
- **Proper thresholds:** একবার বেশি CPU হলেই alert নয় — sustained high CPU ৫ মিনিট ধরে।
- **Alert grouping:** একই incident এর অনেক alert একটিতে group করুন।
- **Runbook:** প্রতিটি alert এর next step লেখা থাকলে on-call দ্রুত কাজ করতে পারে।

### What is a runbook and how does it relate to alerts?
- **Runbook:** Alert আসলে কী করতে হবে তার step-by-step guide।
- Alert → Runbook link → on-call দেখে দ্রুত diagnose করে।
- **উদাহরণ:**
  ```
  Alert: Payment service error rate > 5%
  Runbook:
  1. Check payment service logs: `kubectl logs -n payments -l app=payment-svc`
  2. Check DB connection: `SELECT count FROM pg_stat_activity`
  3. Check upstream Stripe API status: https://status.stripe.com
  4. Escalate to payment team if unresolved after 15 min
  ```

---

## 90. What is a health check endpoint and how is it used?

**Health Check Endpoint:** Service টি নিজের অবস্থা রিপোর্ট করার জন্য একটি dedicated endpoint।

```http
GET /health

HTTP/1.1 200 OK
{
  "status": "healthy",
  "version": "2.1.0",
  "db": "connected",
  "cache": "connected",
  "uptime_seconds": 86400
}
```

### What is the difference between a liveness check and a readiness check?
| | Liveness Check | Readiness Check |
|---|---|---|
| **প্রশ্ন** | "App কি জীবিত?" | "App কি traffic নিতে প্রস্তুত?" |
| **ব্যর্থ হলে** | Kubernetes container restart করে | Load balancer থেকে সরিয়ে নেয় |
| **Check করে** | App process চলছে কিনা | DB connection, dependencies |
| **Example** | `/healthz` → 200 always | `/readyz` → 503 যদি DB না থাকে |

### How does Kubernetes use health checks?
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10
  failureThreshold: 3  # ৩ বার fail → restart

readinessProbe:
  httpGet:
    path: /readyz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### What should a health check endpoint actually verify?
- **Liveness:** App এর core process শুধু। DB চেক নয় — DB ডাউন হলে app restart করলে কী লাভ?
- **Readiness:**
  - Database connection সফল।
  - Cache connection সফল।
  - Critical external dependencies responding।
  - Application fully initialized (startup complete)।
- **Startup probe:** Very slow startup এর জন্য — wait করে restart শুরু করার আগে।
