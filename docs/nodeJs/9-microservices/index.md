---
sidebar_position: 1
title: ''
---



## 81. How do you implement microservices in Node.js?

**Microservices:** একটি বড় application কে ছোট ছোট independent service এ ভাগ করা — প্রতিটি নিজস্ব DB, নিজস্ব deploy।

```
Client → API Gateway
             ├── User Service    (port 3001, PostgreSQL)
             ├── Order Service   (port 3002, PostgreSQL)
             ├── Product Service (port 3003, MongoDB)
             └── Email Service   (port 3004, async via RabbitMQ)
```

### What communication protocols work best?
| Protocol | কখন ব্যবহার | Pros | Cons |
|---|---|---|---|
| **REST (HTTP)** | Public API, CRUD | Simple, familiar | Higher latency |
| **gRPC** | Internal services, high throughput | Binary, type-safe, fast | Complex setup |
| **Message Queue** | Async, decoupled | Resilient, scalable | Eventual consistency |
| **Event Streaming (Kafka)** | Event-driven, audit log | High throughput | Complex infra |

### What is the single responsibility principle applied to microservice design?
- প্রতিটি service **একটি** business capability নিয়ে কাজ করে।
- User Service → user management shudi।
- Order Service → order shudi — user info দরকার হলে API call বা event।

---

## 82. What is a message broker, and how do you use it in Node.js?

**Message Broker:** Service গুলোর মধ্যে async message pass করার infrastructure।

```javascript
// RabbitMQ with amqplib
const amqp = require('amqplib');

// Publisher
async function publishOrderCreated(order) {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertQueue('order.created', { durable: true });
    channel.sendToQueue(
        'order.created',
        Buffer.from(JSON.stringify(order)),
        { persistent: true }  // Disk এ save — restart এ না হারায়
    );
    console.log('Published:', order.id);
}

// Consumer (Email Service)
async function consumeOrders() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertQueue('order.created', { durable: true });
    channel.prefetch(1); // একসাথে ১টি message

    channel.consume('order.created', async (msg) => {
        const order = JSON.parse(msg.content.toString());
        try {
            await sendConfirmationEmail(order.userEmail, order);
            channel.ack(msg); // Success — queue থেকে remove
        } catch (err) {
            channel.nack(msg, false, true); // Fail — requeue
        }
    });
}
```

### How does RabbitMQ compare to Kafka for Node.js microservices?
| | RabbitMQ | Kafka |
|---|---|---|
| **Model** | Message queue (consumed → deleted) | Event log (persisted, replay করা যায়) |
| **Throughput** | Moderate | Very high (millions/sec) |
| **Use case** | Task queue, RPC | Event streaming, audit, analytics |
| **Complexity** | কম | বেশি |
| **Node.js lib** | `amqplib` | `kafkajs` |

### What is at-least-once delivery and how do you handle message idempotency?
- **At-least-once:** Message কমপক্ষে একবার deliver হবে — কিন্তু network error এ duplicate হতে পারে।
- **Idempotency key:** `message_id` DB তে check করুন — duplicate হলে skip।
```javascript
channel.consume('order.created', async (msg) => {
    const { id, ...order } = JSON.parse(msg.content.toString());
    // Idempotency check
    const alreadyProcessed = await redis.get(`processed:${id}`);
    if (alreadyProcessed) return channel.ack(msg);

    await sendEmail(order);
    await redis.setex(`processed:${id}`, 86400, '1'); // 24h mark
    channel.ack(msg);
});
```

---

## 83. How do you handle service discovery in Node.js microservices?

**Service Discovery:** কোন service কোন IP/port এ আছে তা dynamically খোঁজা।

### What is the difference between client-side and server-side service discovery?
```
Client-side:
Service A → Service Registry (Consul) → Gets Service B address → Direct call to B

Server-side:
Service A → Load Balancer → LB checks registry → Forwards to Service B
```

```javascript
// Kubernetes DNS — সবচেয়ে সহজ service discovery
const orderServiceUrl = 'http://order-service:3002'; // K8s DNS auto-resolves
const response = await fetch(`${orderServiceUrl}/api/orders/${id}`);

// Consul (manual)
const Consul = require('consul');
const consul = new Consul();
const services = await consul.catalog.service.nodes('order-service');
const { Address, ServicePort } = services[0];
// http://${Address}:${ServicePort}
```

---

## 84. What is an API Gateway, and how do you implement it in Node.js?

**API Gateway:** Clients এর single entry point — routing, auth, rate limiting, aggregation।

```javascript
// Custom API Gateway (Express)
const httpProxy = require('http-proxy-middleware');

const app = express();

// Auth middleware — সব request এ
app.use(authenticate);

// Rate limiting
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// Route to microservices
app.use('/api/users', httpProxy.createProxyMiddleware({
    target: 'http://user-service:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/users': '/users' }
}));

app.use('/api/orders', httpProxy.createProxyMiddleware({
    target: 'http://order-service:3002',
    changeOrigin: true,
}));

// BFF — Multiple service aggregate করুন
app.get('/api/dashboard', async (req, res) => {
    const [user, orders, notifications] = await Promise.all([
        fetch(`http://user-service/users/${req.user.id}`).then(r => r.json()),
        fetch(`http://order-service/orders?userId=${req.user.id}`).then(r => r.json()),
        fetch(`http://notification-service/notifications?userId=${req.user.id}`).then(r => r.json()),
    ]);
    res.json({ user, orders, notifications });
});
```

### What is the BFF (Backend for Frontend) pattern?
- প্রতিটি frontend type (mobile, web, admin) এর জন্য আলাদা BFF।
- Mobile BFF: Lightweight response, compressed data।
- Web BFF: Rich response, more details।

---

## 85. How do you monitor microservices in Node.js?

```javascript
// OpenTelemetry — distributed tracing
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
    traceExporter: new JaegerExporter({ endpoint: 'http://jaeger:14268/api/traces' }),
    instrumentations: [getNodeAutoInstrumentations()], // HTTP, Express, DB auto-instrument
});
sdk.start();

// Correlation ID propagate
const { AsyncLocalStorage } = require('async_hooks');
const requestContext = new AsyncLocalStorage();

app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuid();
    req.headers['x-correlation-id'] = correlationId;
    requestContext.run({ correlationId }, next);
});

// যেকোনো service call এ forward করুন
async function callOrderService(orderId) {
    const ctx = requestContext.getStore();
    return fetch(`http://order-service/orders/${orderId}`, {
        headers: { 'x-correlation-id': ctx.correlationId }
    });
}
```

---

## 86. What is the circuit breaker pattern and how do you implement it in Node.js?

```javascript
const CircuitBreaker = require('opossum');

// Circuit breaker wrap করুন
const breaker = new CircuitBreaker(callPaymentService, {
    timeout: 3000,           // 3s response না পেলে fail
    errorThresholdPercentage: 50, // 50% error → circuit open
    resetTimeout: 30000,     // 30s পর half-open try
    volumeThreshold: 10,     // Minimum 10 request analyze করে
});

breaker.fallback(() => ({ error: 'Payment service unavailable', cached: true }));

breaker.on('open', () => logger.warn('Circuit OPEN — payment service down'));
breaker.on('halfOpen', () => logger.info('Circuit HALF-OPEN — testing'));
breaker.on('close', () => logger.info('Circuit CLOSED — recovered'));

// Use করুন
app.post('/checkout', async (req, res) => {
    const result = await breaker.fire(req.body.paymentData);
    res.json(result);
});
```

---

## 87. How do you implement gRPC in Node.js?

```protobuf
// user.proto
syntax = "proto3";

service UserService {
    rpc GetUser (GetUserRequest) returns (UserResponse);
    rpc ListUsers (ListUsersRequest) returns (stream UserResponse);
}

message GetUserRequest { int32 id = 1; }
message UserResponse {
    int32 id = 1;
    string name = 2;
    string email = 3;
}
```

```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('user.proto');
const proto = grpc.loadPackageDefinition(packageDef);

// Server
const server = new grpc.Server();
server.addService(proto.UserService.service, {
    GetUser: async (call, callback) => {
        const user = await db.users.findById(call.request.id);
        callback(null, user);
    },
    ListUsers: async (call) => {
        const users = await db.users.findAll();
        users.forEach(user => call.write(user));
        call.end();
    }
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});

// Client
const client = new proto.UserService('user-service:50051', grpc.credentials.createInsecure());
client.GetUser({ id: 1 }, (err, response) => {
    console.log(response);
});
```

### What are the four types of gRPC communication?
| Type | Description | Use Case |
|---|---|---|
| **Unary** | 1 request → 1 response | Simple API call |
| **Server Streaming** | 1 request → stream of responses | Large data, live updates |
| **Client Streaming** | Stream of requests → 1 response | File upload |
| **Bidirectional** | Stream ↔ Stream | Chat, real-time |

---

## 88. How do you handle distributed transactions in Node.js microservices?

### What is the SAGA pattern?
- Distributed transaction কে ছোট ছোট local transaction এ ভাগ করা।
- প্রতিটি step fail করলে compensating transaction চালু।

```javascript
// Choreography SAGA — event-driven
// Step 1: Order Service
async function createOrder(orderData) {
    const order = await Order.create({ ...orderData, status: 'pending' });
    await eventBus.publish('order.created', order);
}

// Step 2: Payment Service (listens to order.created)
eventBus.on('order.created', async (order) => {
    try {
        await chargeCard(order.total, order.paymentMethod);
        await eventBus.publish('payment.successful', { orderId: order.id });
    } catch (err) {
        await eventBus.publish('payment.failed', { orderId: order.id });
    }
});

// Step 3: Order Service (listens to payment events)
eventBus.on('payment.failed', async ({ orderId }) => {
    // Compensating transaction — order cancel
    await Order.update(orderId, { status: 'cancelled' });
});
```

---

## 89. How do you implement event-driven architecture in Node.js?

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    brokers: ['kafka:9092'],
    clientId: 'order-service'
});

// Producer
const producer = kafka.producer();
await producer.connect();

await producer.send({
    topic: 'order-events',
    messages: [{
        key: order.id.toString(),
        value: JSON.stringify({ type: 'ORDER_CREATED', payload: order }),
        headers: { 'correlation-id': correlationId }
    }]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'email-service-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        if (event.type === 'ORDER_CREATED') {
            await sendOrderConfirmationEmail(event.payload);
        }
    }
});
```

### What is CQRS (Command Query Responsibility Segregation)?
- **Command side:** Write operation — DB তে save।
- **Query side:** Read operation — Read-optimized view (denormalized, cached)।
- Write এবং Read আলাদা model — scale independently।

---

## 90. How do you secure inter-service communication in Node.js microservices?

```javascript
// mTLS — mutual TLS
const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('/certs/service.crt'),
    key: fs.readFileSync('/certs/service.key'),
    ca: fs.readFileSync('/certs/ca.crt'),
    rejectUnauthorized: true, // Client certificate verify করুন
};

const server = https.createServer(options, app);

// Service token authentication
async function callInternalService(url, data) {
    const serviceToken = await getServiceToken(); // Short-lived JWT
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${serviceToken}`,
            'X-Service-Name': 'order-service',
        },
        body: JSON.stringify(data),
        method: 'POST',
    });
}
```
