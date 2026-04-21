---
sidebar_position: 1
title: ''
---



## 81. How do you implement microservices in Node.js?

Node.js-এ microservices implement করার জন্য প্রতিটি service-কে আলাদা আলাদা process হিসেবে তৈরি করতে হয়, যেখানে প্রতিটির নিজস্ব codebase, database এবং deployment pipeline থাকে।

**মূল পদক্ষেপগুলো:**

প্রথমত, প্রতিটি microservice-কে একটি স্বতন্ত্র Node.js application হিসেবে তৈরি করতে হবে। উদাহরণস্বরূপ, একটি e-commerce system-এ `user-service`, `order-service`, এবং `product-service` আলাদা আলাদা Express বা Fastify application হিসেবে থাকবে।

দ্বিতীয়ত, প্রতিটি service-এর নিজস্ব database থাকা উচিত — এই pattern-কে বলা হয় **Database per Service**। এতে services একে অপরের data-তে সরাসরি access করতে পারে না, বরং API-এর মাধ্যমে communicate করে।

তৃতীয়ত, একটি **API Gateway** ব্যবহার করতে হবে যা client-এর সব request গ্রহণ করে এবং উপযুক্ত microservice-এ forward করে। Node.js-এ এই কাজের জন্য `http-proxy-middleware` বা dedicated gateway যেমন **Kong** বা **AWS API Gateway** ব্যবহার করা হয়।

চতুর্থত, **Service Discovery** mechanism দরকার হয়, যাতে services একে অপরকে dynamically খুঁজে পেতে পারে। এই কাজে **Consul** বা **Kubernetes**-এর built-in DNS ব্যবহার করা হয়।

### What communication protocols work best?
Microservices-এর মধ্যে communication দুই ধরনের হয় — **synchronous** এবং **asynchronous**।

**Synchronous Communication:**

- **REST over HTTP/HTTPS** — সবচেয়ে সহজ এবং widely used। একটি service অন্য service-এর endpoint-এ HTTP request পাঠায় এবং response-এর জন্য অপেক্ষা করে। Simple CRUD operation-এর জন্য উপযুক্ত।
- **gRPC** — Google-এর তৈরি high-performance protocol, যা Protocol Buffers ব্যবহার করে data serialize করে। REST-এর তুলনায় অনেক দ্রুত এবং strongly typed। Internal service-to-service communication যেখানে low latency দরকার সেখানে আদর্শ।
- **GraphQL** — যখন client নিজে decide করতে চায় কোন data দরকার, তখন GraphQL উপযুক্ত।

**Asynchronous Communication:**

- **Message Queue (RabbitMQ, Apache Kafka)** — একটি service message publish করে এবং অন্য service সেই message পরে consume করে। Services একে অপরের উপর directly নির্ভর না করায় এই approach-কে **loose coupling** বলা হয়। Order placed হলে notification পাঠানো বা payment processing-এর মতো কাজের জন্য এটি আদর্শ।
- **Event-Driven Architecture** — services events emit করে এবং অন্য services সেই events-এ subscribe করে। Node.js-এ **EventEmitter** বা **Kafka**-র মাধ্যমে এটি implement করা যায়।

**সাধারণ recommendation হলো:** Real-time response দরকার হলে gRPC বা REST, আর background processing বা decoupled workflow-এর জন্য Kafka বা RabbitMQ ব্যবহার করুন।

### What is the single responsibility principle applied to microservice design?
**Single Responsibility Principle (SRP)** বলে যে একটি module বা class-এর শুধুমাত্র একটিই কারণ থাকা উচিত পরিবর্তিত হওয়ার। Microservice design-এ এই principle-টি service level-এ apply হয়।

**মূল ধারণা:** প্রতিটি microservice শুধুমাত্র একটি নির্দিষ্ট **business capability** পরিচালনা করবে। অর্থাৎ, একটি service একাধিক ভিন্ন domain-এর কাজ করবে না।

**উদাহরণ:**

একটি bad design হবে যদি একটিই service user registration, order processing এবং email notification — সব কিছু করে। কারণ এই তিনটি কাজের যেকোনো একটিতে পরিবর্তন আনলে পুরো service-কে redeploy করতে হবে এবং অন্য কাজগুলোতে bug আসার ঝুঁকি থাকে।

একটি good design হবে:
- `user-service` → শুধু user registration, authentication, profile management
- `order-service` → শুধু order create, update, track করা
- `notification-service` → শুধু email, SMS বা push notification পাঠানো

**SRP follow করার সুবিধা:**

প্রতিটি service স্বাধীনভাবে **scale** করা যায়। যদি order-service-এ বেশি load পড়ে, তাহলে শুধু সেই service-এর instance বাড়ানো যাবে, পুরো application নয়। এছাড়া একটি service-এর failure অন্য service-কে directly প্রভাবিত করে না, যা **fault isolation** নিশ্চিত করে। Team-গুলোও আলাদাভাবে কাজ করতে পারে এবং independent deployment সম্ভব হয়।

**Boundary নির্ধারণের উপায়:** **Domain-Driven Design (DDD)**-এর **Bounded Context** concept ব্যবহার করে প্রতিটি microservice-এর boundary নির্ধারণ করা হয়। একটি Bounded Context মানে হলো একটি নির্দিষ্ট business domain যেখানে নির্দিষ্ট কিছু terms এবং rules প্রযোজ্য।

## 82. What is a message broker, and how do you use it in Node.js?

**Message Broker** হলো একটি middleware software যা বিভিন্ন application বা microservice-এর মধ্যে message আদান-প্রদান পরিচালনা করে। এটি **producer** (যে message পাঠায়) এবং **consumer** (যে message গ্রহণ করে) — এই দুইয়ের মধ্যে intermediary হিসেবে কাজ করে, ফলে তারা একে অপরের সম্পর্কে সরাসরি জানার দরকার হয় না।

**কেন দরকার:** ধরুন একটি order-service order নিলো এবং সেই সাথে notification-service-কে email পাঠাতে হবে, inventory-service-কে stock কমাতে হবে, payment-service-কে charge করতে হবে। Message broker ছাড়া order-service-কে সবার সাথে সরাসরি কথা বলতে হতো। Broker থাকলে order-service শুধু একটি message publish করে এবং বাকিরা নিজেদের মতো সেটি consume করে।

**Node.js-এ RabbitMQ দিয়ে basic implementation:**

```javascript
// producer.js — message পাঠানো
const amqp = require('amqplib');

async function sendMessage(queue, message) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true }); // server restart-এ queue টিকে থাকবে
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true, // message disk-এ save হবে
  });

  console.log('Message sent:', message);
  await channel.close();
  await connection.close();
}

sendMessage('order.created', { orderId: 'ORD-123', userId: 'USR-456', amount: 1500 });
```

```javascript
// consumer.js — message গ্রহণ করা
const amqp = require('amqplib');

async function consumeMessages(queue) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1); // একবারে একটি message process করবে

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log('Received:', content);

      try {
        await processOrder(content); // actual business logic
        channel.ack(msg); // সফল হলে acknowledge করো
      } catch (error) {
        channel.nack(msg, false, true); // ব্যর্থ হলে requeue করো
      }
    }
  });
}

consumeMessages('order.created');
```


### How does RabbitMQ compare to Kafka for Node.js microservices?
এই দুটি tool মূলত ভিন্ন ভিন্ন সমস্যার জন্য তৈরি, তাই তুলনাটা use case-নির্ভর।

**RabbitMQ:**

RabbitMQ একটি traditional **message queue**। এটি **push-based** — broker নিজে consumer-কে message push করে। Message একবার successfully consume হলে queue থেকে delete হয়ে যায়।

```javascript
// RabbitMQ-তে Exchange এবং Routing Key দিয়ে flexible routing
const amqp = require('amqplib');

async function setupExchange() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Direct exchange — নির্দিষ্ট routing key-তে message পাঠানো
  await channel.assertExchange('orders', 'direct', { durable: true });

  // notification-service শুধু 'order.created' পাবে
  await channel.assertQueue('notification-queue', { durable: true });
  await channel.bindQueue('notification-queue', 'orders', 'order.created');

  // inventory-service শুধু 'order.cancelled' পাবে
  await channel.assertQueue('inventory-queue', { durable: true });
  await channel.bindQueue('inventory-queue', 'orders', 'order.cancelled');

  channel.publish('orders', 'order.created',
    Buffer.from(JSON.stringify({ orderId: 'ORD-123' }))
  );
}
```

**Kafka:**

Kafka একটি **distributed event streaming platform**। এটি **pull-based** — consumer নিজে broker থেকে message টেনে নেয়। Message consume হওয়ার পরেও delete হয় না, বরং configured সময় পর্যন্ত (যেমন ৭ দিন) disk-এ থাকে। এই কারণে পুরনো events replay করা সম্ভব।

```javascript
// Kafka-তে producer
const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function publishEvent(topic, event) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [
      {
        key: event.orderId, // same key সবসময় same partition-এ যাবে — ordering নিশ্চিত
        value: JSON.stringify(event),
      },
    ],
  });
  await producer.disconnect();
}

publishEvent('order-events', { orderId: 'ORD-123', status: 'created' });
```

```javascript
// Kafka-তে consumer group
const consumer = kafka.consumer({ groupId: 'notification-service' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`Processing event from partition ${partition}:`, event);
      await sendNotification(event);
    },
  });
}
```

**সংক্ষিপ্ত তুলনা:**

| বিষয় | RabbitMQ | Kafka |
|---|---|---|
| **Best for** | Task queue, job processing | Event streaming, audit log |
| **Message retention** | Consume হলে delete | Disk-এ রাখে (replay সম্ভব) |
| **Throughput** | মাঝারি | অত্যন্ত বেশি (millions/sec) |
| **Complexity** | সহজ setup | তুলনামূলক জটিল |
| **Use case** | Email পাঠানো, background job | Analytics, event sourcing |

**সাধারণ recommendation:** ছোট থেকে মাঝারি project এবং traditional task queue-এর জন্য RabbitMQ, আর high-throughput event streaming এবং audit trail দরকার হলে Kafka।

### What is at-least-once delivery and how do you handle message idempotency?

**At-Least-Once Delivery** মানে হলো message broker নিশ্চিত করে যে প্রতিটি message **অন্তত একবার** consumer-এর কাছে পৌঁছাবে। কিন্তু network failure বা consumer crash-এর কারণে **একই message একাধিকবার** deliver হতে পারে।

**সমস্যাটা কোথায়:** ধরুন payment-service একটি payment process করলো, কিন্তু acknowledge পাঠানোর আগেই crash করলো। Broker ভাববে message deliver হয়নি এবং আবার পাঠাবে। ফলে একই payment দুইবার charge হবে — এটি একটি critical bug।

**Idempotency** হলো এই সমস্যার সমাধান। একটি operation **idempotent** হয় যদি সেটি একবার বা একাধিকবার চালালে result একই থাকে।

**Solution 1: Idempotency Key দিয়ে database-এ check করা:**

```javascript
// প্রতিটি message-এ unique messageId থাকবে
async function processPayment(message) {
  const { messageId, orderId, amount } = message;

  // database-এ check করো এই messageId আগে process হয়েছে কিনা
  const alreadyProcessed = await db.query(
    'SELECT id FROM processed_messages WHERE message_id = $1',
    [messageId]
  );

  if (alreadyProcessed.rows.length > 0) {
    console.log(`Message ${messageId} already processed. Skipping.`);
    return; // duplicate — skip করো
  }

  // Transaction-এর মধ্যে payment process এবং record insert — atomically
  await db.transaction(async (trx) => {
    await trx.query(
      'INSERT INTO payments (order_id, amount) VALUES ($1, $2)',
      [orderId, amount]
    );
    await trx.query(
      'INSERT INTO processed_messages (message_id, processed_at) VALUES ($1, NOW())',
      [messageId]
    );
  });

  console.log(`Payment processed for order ${orderId}`);
}
```

**Solution 2: Redis দিয়ে fast idempotency check:**

```javascript
const redis = require('redis');
const client = redis.createClient();

async function idempotentConsumer(channel, msg) {
  const message = JSON.parse(msg.content.toString());
  const { messageId } = message;

  // Redis-এ SET NX — key না থাকলেই শুধু set হবে
  const isNew = await client.set(
    `processed:${messageId}`,
    '1',
    { NX: true, EX: 86400 } // 24 ঘন্টা পর expire
  );

  if (!isNew) {
    console.log(`Duplicate message detected: ${messageId}`);
    channel.ack(msg); // acknowledge করো কিন্তু process করো না
    return;
  }

  try {
    await processOrder(message);
    channel.ack(msg);
  } catch (error) {
    // processing ব্যর্থ হলে Redis key delete করো যাতে retry হতে পারে
    await client.del(`processed:${messageId}`);
    channel.nack(msg, false, true);
  }
}
```

**Solution 3: Kafka-তে exactly-once semantics:**

```javascript
// Kafka producer-এ idempotent mode enable করা
const producer = kafka.producer({
  idempotent: true,           // duplicate message পাঠাবে না
  transactionalId: 'payment-producer', // exactly-once guarantee
});

async function sendWithTransaction(event) {
  await producer.transaction(async (tx) => {
    await tx.send({
      topic: 'payment-events',
      messages: [{ key: event.orderId, value: JSON.stringify(event) }],
    });
  });
}
```

**মূল নীতি:** At-least-once delivery-তে duplicate আসবেই — এটি prevent করা যায় না। তাই consumer-কে সবসময় idempotent হতে হবে। Database transaction বা Redis lock দিয়ে নিশ্চিত করতে হবে যে একই messageId দুইবার process না হয়।

## 83. How do you handle service discovery in Node.js microservices?

**Service Discovery** হলো সেই mechanism যার মাধ্যমে একটি microservice অন্য microservice-এর network location (host এবং port) dynamically খুঁজে পায়। Static IP বা hardcoded URL ব্যবহার না করে services runtime-এ একে অপরকে discover করে।

**কেন দরকার:** Modern microservices environment-এ (বিশেষত Kubernetes বা Docker Swarm-এ) প্রতিটি service-এর IP address যেকোনো সময় পরিবর্তন হতে পারে — নতুন instance deploy হলে, crash করে restart হলে, বা auto-scaling হলে। এই dynamic environment-এ hardcoded address কাজ করে না।

**মূল components:**

একটি service discovery system-এ তিনটি মূল অংশ থাকে — **Service Registry** (যেখানে সব service তাদের address register করে), **Health Check** (registry নিশ্চিত করে সব registered service চালু আছে কিনা), এবং **Lookup mechanism** (যার মাধ্যমে একটি service অন্যটিকে খোঁজে)।

**Consul দিয়ে implementation:**

```javascript
// service-registry.js — Consul-এ service register করা
const consul = require('consul')();

async function registerService(serviceName, port) {
  await consul.agent.service.register({
    name: serviceName,
    id: `${serviceName}-${port}`,   // প্রতিটি instance-এর unique id
    address: process.env.HOST_IP || 'localhost',
    port: port,
    check: {
      http: `http://localhost:${port}/health`, // health check endpoint
      interval: '10s',  // প্রতি ১০ সেকেন্ডে check করবে
      timeout: '5s',
      deregistercriticalserviceafter: '30s', // ৩০ সেকেন্ড unhealthy থাকলে deregister
    },
  });

  console.log(`${serviceName} registered on port ${port}`);
}

// graceful shutdown-এ deregister করা জরুরি
process.on('SIGINT', async () => {
  await consul.agent.service.deregister(`order-service-3001`);
  process.exit();
});
```

```javascript
// service-discovery.js — অন্য service-এর address খোঁজা
const consul = require('consul')();

async function discoverService(serviceName) {
  const services = await consul.health.service({
    service: serviceName,
    passing: true, // শুধু healthy instances পাবো
  });

  if (services.length === 0) {
    throw new Error(`No healthy instances of ${serviceName} found`);
  }

  // load balancing — random instance select করা
  const instance = services[Math.floor(Math.random() * services.length)];
  const { Address, Port } = instance.Service;

  return `http://${Address}:${Port}`;
}

// order-service থেকে payment-service discover করে call করা
async function callPaymentService(orderId, amount) {
  const baseUrl = await discoverService('payment-service');

  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount }),
  });

  return response.json();
}
```

**Kubernetes-এ DNS-based Service Discovery:**

Kubernetes-এ আলাদা করে Consul সেটআপ করার দরকার নেই। Kubernetes নিজেই built-in DNS দিয়ে service discovery handle করে।

```yaml
# payment-service এর Kubernetes Service manifest
apiVersion: v1
kind: Service
metadata:
  name: payment-service
  namespace: production
spec:
  selector:
    app: payment-service
  ports:
    - port: 80
      targetPort: 3000
```

```javascript
// Kubernetes-এ অন্য service call করা — DNS name ব্যবহার করলেই হয়
// format: http://<service-name>.<namespace>.svc.cluster.local
async function callPaymentService(orderId, amount) {
  const url = 'http://payment-service.production.svc.cluster.local/payments';

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ orderId, amount }),
  });

  return response.json();
}
```

**Circuit Breaker pattern দিয়ে resilient discovery:**

Service discovery-র সাথে **Circuit Breaker** ব্যবহার করা উচিত, কারণ discovered service টি যদি slow বা failing হয়, তাহলে সব request আটকে যাবে।

```javascript
const CircuitBreaker = require('opossum');

async function createResilientClient(serviceName) {
  const breaker = new CircuitBreaker(
    async (path, options) => {
      const baseUrl = await discoverService(serviceName);
      const response = await fetch(`${baseUrl}${path}`, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    {
      timeout: 3000,         // ৩ সেকেন্ডের বেশি হলে fail
      errorThresholdPercentage: 50, // ৫০% error হলে circuit open হবে
      resetTimeout: 10000,   // ১০ সেকেন্ড পর আবার try করবে
    }
  );

  breaker.on('open', () =>
    console.log(`Circuit open for ${serviceName} — requests blocked`)
  );
  breaker.on('halfOpen', () =>
    console.log(`Circuit half-open for ${serviceName} — testing...`)
  );
  breaker.on('close', () =>
    console.log(`Circuit closed for ${serviceName} — back to normal`)
  );

  return breaker;
}
```

---

### What is the difference between client-side and server-side service discovery?

এই দুটি approach-এর মূল পার্থক্য হলো — **কে** service registry-তে query করে এবং load balancing কোথায় হয়।

**Client-Side Service Discovery:**

এই approach-এ client (যে service call করছে) নিজে registry-তে query করে সব available instances-এর list পায় এবং নিজেই একটি instance select করে সরাসরি call করে।

```javascript
// client-side discovery — client নিজেই সব কাজ করে
class ServiceClient {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.cachedInstances = [];
    this.cacheExpiry = 0;
  }

  async getInstances() {
    const now = Date.now();

    // cache ৩০ সেকেন্ড পর্যন্ত valid — প্রতি request-এ registry call নয়
    if (now < this.cacheExpiry && this.cachedInstances.length > 0) {
      return this.cachedInstances;
    }

    const services = await consul.health.service({
      service: this.serviceName,
      passing: true,
    });

    this.cachedInstances = services.map(s =>
      `http://${s.Service.Address}:${s.Service.Port}`
    );
    this.cacheExpiry = now + 30000; // ৩০ সেকেন্ড cache

    return this.cachedInstances;
  }

  // Round-Robin load balancing — client নিজেই করছে
  async call(path, options = {}) {
    const instances = await this.getInstances();
    if (instances.length === 0) throw new Error('No instances available');

    this.currentIndex = (this.currentIndex || 0) % instances.length;
    const selectedInstance = instances[this.currentIndex++];

    return fetch(`${selectedInstance}${path}`, options);
  }
}

// ব্যবহার
const paymentClient = new ServiceClient('payment-service');
const result = await paymentClient.call('/payments', {
  method: 'POST',
  body: JSON.stringify({ amount: 1500 }),
});
```

**Server-Side Service Discovery:**

এই approach-এ client কিছুই জানে না। Client শুধু একটি fixed address-এ (Load Balancer বা API Gateway) request পাঠায়। সেই load balancer নিজে registry query করে এবং উপযুক্ত instance-এ request forward করে।

```javascript
// server-side discovery — client শুধু gateway-এ call করে
// client-এর কোনো discovery logic নেই

async function callPaymentService(orderId, amount) {
  // client শুধু gateway-এর address জানে, payment-service কোথায় সেটা নয়
  const response = await fetch('http://api-gateway/payments', {
    method: 'POST',
    body: JSON.stringify({ orderId, amount }),
  });
  return response.json();
}

// API Gateway-এর ভেতরে server-side discovery হচ্ছে
// (এটি gateway-এর code, client-এর নয়)
async function gatewayHandler(req, res) {
  const instances = await consul.health.service({
    service: 'payment-service',
    passing: true,
  });

  // gateway load balancing করে সঠিক instance-এ forward করে
  const selected = selectInstance(instances); // round-robin বা weighted
  const target = `http://${selected.Service.Address}:${selected.Service.Port}`;

  proxy.web(req, res, { target });
}
```

**দুটি approach-এর তুলনা:**

| বিষয় | Client-Side | Server-Side |
|---|---|---|
| **Discovery logic** | Client-এ থাকে | Gateway/LB-তে থাকে |
| **Client complexity** | বেশি | কম |
| **Network hop** | কম (সরাসরি call) | বেশি (gateway হয়ে) |
| **Language dependency** | প্রতিটি language-এ client library লাগে | যেকোনো client কাজ করে |
| **উদাহরণ** | Netflix Eureka + Ribbon | AWS ALB, Nginx, Kubernetes Service |

**কোনটি বেছে নেবেন:** Node.js microservices যদি Kubernetes-এ run করে, তাহলে server-side discovery (Kubernetes Service + Ingress) সবচেয়ে সহজ এবং recommended। Kubernetes-এর বাইরে নিজস্ব infrastructure-এ হলে Consul দিয়ে client-side discovery ভালো কাজ করে।

## 84. What is an API Gateway, and how do you implement it in Node.js?


**API Gateway** হলো microservices architecture-এর একটি single entry point যা সব client request গ্রহণ করে এবং উপযুক্ত microservice-এ forward করে। Client সরাসরি কোনো microservice-এর সাথে কথা বলে না — সব communication API Gateway-এর মাধ্যমে হয়।

**Gateway যা যা করে:** Request routing, authentication/authorization, rate limiting, request/response transformation, logging, caching এবং load balancing — এই সব cross-cutting concerns একটি জায়গায় handle হয়, ফলে প্রতিটি microservice-কে আলাদাভাবে এগুলো implement করতে হয় না।

**Basic API Gateway implementation:**

```javascript
// gateway.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();

// ১. Rate Limiting — প্রতি IP থেকে প্রতি ১৫ মিনিটে সর্বোচ্চ ১০০ request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
});
app.use(limiter);

// ২. Authentication Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ৩. Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      user: req.user?.id,
    });
  });
  next();
});

// ৪. Route definitions — কোন path কোন service-এ যাবে
const routes = [
  {
    path: '/api/users',
    target: 'http://user-service:3001',
    auth: true,
  },
  {
    path: '/api/orders',
    target: 'http://order-service:3002',
    auth: true,
  },
  {
    path: '/api/products',
    target: 'http://product-service:3003',
    auth: false, // public endpoint — auth লাগবে না
  },
  {
    path: '/api/payments',
    target: 'http://payment-service:3004',
    auth: true,
  },
];

// ৫. Dynamic proxy setup
routes.forEach(({ path, target, auth }) => {
  const middlewares = [];

  if (auth) middlewares.push(authenticate);

  middlewares.push(
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${path}`]: '' }, // /api/users/123 → /123
      on: {
        proxyReq: (proxyReq, req) => {
          // downstream service-কে user info পাঠানো header-এ
          if (req.user) {
            proxyReq.setHeader('X-User-Id', req.user.id);
            proxyReq.setHeader('X-User-Role', req.user.role);
          }
        },
        error: (err, req, res) => {
          res.status(503).json({ error: 'Service temporarily unavailable' });
        },
      },
    })
  );

  app.use(path, ...middlewares);
});

app.listen(3000, () => console.log('API Gateway running on port 3000'));
```

**Request Aggregation — একাধিক service-এর data একটি response-এ:**

```javascript
// client যদি dashboard-এর জন্য user + orders + notifications একসাথে চায়
app.get('/api/dashboard', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    // সব request parallel-এ পাঠাও — sequential নয়
    const [user, orders, notifications] = await Promise.allSettled([
      fetch(`http://user-service:3001/users/${userId}`).then(r => r.json()),
      fetch(`http://order-service:3002/orders?userId=${userId}`).then(r => r.json()),
      fetch(`http://notification-service:3005/notifications/${userId}`).then(r => r.json()),
    ]);

    res.json({
      user: user.status === 'fulfilled' ? user.value : null,
      orders: orders.status === 'fulfilled' ? orders.value : [],
      notifications: notifications.status === 'fulfilled' ? notifications.value : [],
    });
    // একটি service fail করলেও বাকিগুলোর data পাঠানো হবে
  } catch (error) {
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
});
```

**Caching layer Gateway-এ:**

```javascript
const redis = require('redis');
const client = redis.createClient();

function cacheMiddleware(ttl = 60) {
  return async (req, res, next) => {
    // শুধু GET request cache করবো
    if (req.method !== 'GET') return next();

    const cacheKey = `cache:${req.path}:${JSON.stringify(req.query)}`;
    const cached = await client.get(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }

    // original res.json intercept করে cache-এ save করা
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      await client.setEx(cacheKey, ttl, JSON.stringify(data));
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

// product list ৫ মিনিট cache করো
app.use('/api/products', cacheMiddleware(300),
  createProxyMiddleware({ target: 'http://product-service:3003', changeOrigin: true })
);
```
### What is the BFF (Backend for Frontend) pattern?
**BFF** হলো একটি architectural pattern যেখানে প্রতিটি frontend client-এর জন্য আলাদা একটি dedicated backend layer তৈরি করা হয়। একটি single generic API Gateway-এর বদলে mobile app-এর জন্য আলাদা BFF, web app-এর জন্য আলাদা BFF থাকে।

**কেন দরকার:** Mobile app এবং web app-এর data requirement সম্পূর্ণ আলাদা। Mobile-এ bandwidth কম, screen ছোট, তাই কম data দরকার। Web-এ বেশি data এবং rich UI দরকার। একটি generic gateway দিয়ে দুজনকে সমানভাবে serve করতে গেলে হয় mobile অনেক বেশি data পাবে (over-fetching), অথবা web কম data পাবে (under-fetching)।

```javascript
// mobile-bff.js — শুধু mobile app-এর জন্য
const express = require('express');
const app = express();

// Mobile-এর product list — শুধু দরকারি fields, ছোট image
app.get('/mobile/products', async (req, res) => {
  const products = await fetch('http://product-service:3003/products').then(r => r.json());
  const inventory = await fetch('http://inventory-service:3006/stock').then(r => r.json());

  // mobile-এর জন্য lightweight response — শুধু যা দরকার
  const mobileProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    thumbnail: p.images[0]?.small,  // small image only
    inStock: inventory[p.id] > 0,
  }));

  res.json(mobileProducts);
});

// Mobile-এ offline support-এর জন্য aggressive caching header
app.get('/mobile/user/:id', async (req, res) => {
  const user = await fetch(`http://user-service:3001/users/${req.params.id}`).then(r => r.json());

  res.setHeader('Cache-Control', 'max-age=300'); // ৫ মিনিট cache
  res.json({
    id: user.id,
    name: user.name,
    avatar: user.avatar?.small, // mobile-এ small avatar
  });
});

app.listen(3010, () => console.log('Mobile BFF running on port 3010'));
```

```javascript
// web-bff.js — শুধু web app-এর জন্য
const express = require('express');
const app = express();

// Web-এর product list — বেশি detail, large image, reviews সহ
app.get('/web/products', async (req, res) => {
  const [products, reviews, inventory] = await Promise.all([
    fetch('http://product-service:3003/products').then(r => r.json()),
    fetch('http://review-service:3007/reviews/summary').then(r => r.json()),
    fetch('http://inventory-service:3006/stock').then(r => r.json()),
  ]);

  // web-এর জন্য rich response — সব data একসাথে
  const webProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description, // full description
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercentage: p.discountPercentage,
    images: p.images, // সব images, সব sizes
    rating: reviews[p.id]?.average,
    reviewCount: reviews[p.id]?.count,
    stockCount: inventory[p.id], // exact stock number
    specifications: p.specifications,
  }));

  res.json(webProducts);
});

// Web dashboard — বেশি analytics data
app.get('/web/dashboard', authenticate, async (req, res) => {
  const userId = req.user.id;

  const [user, orders, analytics, recommendations] = await Promise.all([
    fetch(`http://user-service:3001/users/${userId}`).then(r => r.json()),
    fetch(`http://order-service:3002/orders?userId=${userId}&limit=10`).then(r => r.json()),
    fetch(`http://analytics-service:3008/users/${userId}/stats`).then(r => r.json()),
    fetch(`http://recommendation-service:3009/users/${userId}`).then(r => r.json()),
  ]);

  res.json({ user, recentOrders: orders, stats: analytics, recommendations });
});

app.listen(3011, () => console.log('Web BFF running on port 3011'));
```

**BFF-এর সাথে API Gateway একসাথে ব্যবহার:**

```
Client Layer:
  Mobile App  ──→  Mobile BFF (:3010)  ──┐
  Web App     ──→  Web BFF (:3011)     ──┤──→  API Gateway  ──→  Microservices
  3rd Party   ──→  Public API (:3012)  ──┘
```

```javascript
// প্রতিটি BFF-কে API Gateway-এর পেছনে রাখা যায়
// Gateway শুধু auth এবং routing করবে, transformation BFF করবে

// nginx বা gateway config
const bffRoutes = [
  { path: '/mobile', target: 'http://mobile-bff:3010' },
  { path: '/web',    target: 'http://web-bff:3011' },
  { path: '/api',    target: 'http://public-api:3012' },
];
```

**BFF-এর সুবিধা ও কখন ব্যবহার করবেন:**

BFF তখনই ব্যবহার করা উচিত যখন আপনার কাছে clearly আলাদা client types আছে যাদের data requirement significantly ভিন্ন। প্রতিটি BFF তার নিজের frontend team manage করতে পারে — mobile team mobile BFF নিয়ন্ত্রণ করে, web team web BFF নিয়ন্ত্রণ করে। এতে teams একে অপরের উপর dependent থাকে না এবং independently deploy করতে পারে। তবে মনে রাখতে হবে BFF মানে আরেকটি layer, আরেকটি service maintain করা — তাই ছোট project-এ এটি অতিরিক্ত complexity যোগ করতে পারে।

## 86. What is the circuit breaker pattern and how do you implement it in Node.js?
**Circuit Breaker** হলো একটি design pattern যা একটি failing service-এ বারবার request পাঠানো বন্ধ করে। Real-world electrical circuit breaker-এর মতোই কাজ করে — যখন কোনো service বারবার fail করে, circuit "open" হয়ে যায় এবং সেই service-এ নতুন request পাঠানো বন্ধ করে দেয়। এতে failing service recovery-র সময় পায় এবং caller service অপ্রয়োজনীয় timeout-এর জন্য অপেক্ষা করে resource নষ্ট করে না।

**তিনটি state:**

- **Closed** — সব কিছু স্বাভাবিক, request যাচ্ছে। Failure count track হচ্ছে।
- **Open** — অনেক বেশি failure হয়েছে, request block। Fallback response দেওয়া হচ্ছে।
- **Half-Open** — কিছুক্ষণ পর test করতে কিছু request ছাড়া হচ্ছে। সফল হলে Closed-এ ফিরে যাবে।

**Circuit Breaker from scratch implement করা:**

```javascript
// circuit-breaker.js
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;

    // configuration
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 10000;     // ১০ সেকেন্ড পর half-open
    this.requestTimeout = options.requestTimeout || 3000; // request timeout
  }

  async call(...args) {
    if (this.state === 'OPEN') {
      // timeout পার হলে half-open-এ যাও
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = 'HALF_OPEN';
        console.log('Circuit: OPEN → HALF_OPEN, testing service...');
      } else {
        // এখনো open — fallback দাও, service-এ যেও না
        throw new Error(`Circuit is OPEN for ${this.fn.name}. Service unavailable.`);
      }
    }

    try {
      // request timeout enforce করা
      const result = await Promise.race([
        this.fn(...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.requestTimeout)
        ),
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log('Circuit: HALF_OPEN → CLOSED, service recovered!');
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      // half-open-এ failure মানে এখনো ঠিক হয়নি
      this.state = 'OPEN';
      this.successCount = 0;
      console.log('Circuit: HALF_OPEN → OPEN, service still failing');
      return;
    }

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log(`Circuit: CLOSED → OPEN after ${this.failureCount} failures`);
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

module.exports = CircuitBreaker;
```

**Production-এ `opossum` library দিয়ে ব্যবহার:**

```javascript
const CircuitBreaker = require('opossum');

// payment service call করার function
async function callPaymentService(orderId, amount) {
  const response = await fetch('http://payment-service:3004/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount }),
  });

  if (!response.ok) throw new Error(`Payment service error: ${response.status}`);
  return response.json();
}

// Circuit Breaker দিয়ে wrap করা
const paymentBreaker = new CircuitBreaker(callPaymentService, {
  timeout: 3000,                  // ৩ সেকেন্ডের বেশি হলে failure
  errorThresholdPercentage: 50,   // ৫০% error rate হলে open
  resetTimeout: 15000,            // ১৫ সেকেন্ড পর half-open
  volumeThreshold: 5,             // minimum ৫টি request-এর পরেই circuit open হবে
});

// Fallback — circuit open থাকলে এটি চলবে
paymentBreaker.fallback((orderId, amount) => ({
  status: 'pending',
  message: 'Payment queued — will process shortly',
  orderId,
  amount,
}));

// Event listeners দিয়ে monitoring
paymentBreaker.on('open',     () => console.log('⚡ Payment circuit OPEN'));
paymentBreaker.on('halfOpen', () => console.log('⚡ Payment circuit HALF-OPEN'));
paymentBreaker.on('close',    () => console.log('⚡ Payment circuit CLOSED'));
paymentBreaker.on('fallback', (result) => console.log('Using fallback:', result));

// Express route-এ ব্যবহার
app.post('/orders', async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const result = await paymentBreaker.fire(orderId, amount);
    res.json({ success: true, payment: result });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

// Circuit-এর current state monitor করা
app.get('/health/circuit', (req, res) => {
  res.json({
    payment: {
      state: paymentBreaker.opened ? 'OPEN'
           : paymentBreaker.halfOpen ? 'HALF_OPEN'
           : 'CLOSED',
      stats: paymentBreaker.stats,
    },
  });
});
```

---


## 87. How do you implement gRPC in Node.js?
**gRPC** হলো Google-এর তৈরি একটি high-performance RPC (Remote Procedure Call) framework যা **Protocol Buffers (protobuf)** ব্যবহার করে data serialize করে। REST-এর তুলনায় অনেক দ্রুত কারণ data JSON-এর মতো text format-এ নয়, binary format-এ পাঠানো হয়। Internal microservice-to-microservice communication-এর জন্য এটি আদর্শ।

**Step 1: Proto file define করা:**

```protobuf
// order.proto — service contract সংজ্ঞায়িত করা
syntax = "proto3";

package order;

service OrderService {
  // Unary — একটি request, একটি response
  rpc GetOrder (GetOrderRequest) returns (OrderResponse);
  rpc CreateOrder (CreateOrderRequest) returns (OrderResponse);

  // Server Streaming — একটি request, একাধিক response
  rpc GetOrderUpdates (GetOrderRequest) returns (stream OrderUpdate);

  // Client Streaming — একাধিক request, একটি response
  rpc BulkCreateOrders (stream CreateOrderRequest) returns (BulkOrderResponse);

  // Bidirectional Streaming — উভয় দিকে stream
  rpc TrackOrders (stream GetOrderRequest) returns (stream OrderUpdate);
}

message GetOrderRequest {
  string order_id = 1;
}

message CreateOrderRequest {
  string user_id    = 1;
  repeated OrderItem items = 2;
  double total_amount = 3;
}

message OrderItem {
  string product_id = 1;
  int32  quantity   = 2;
  double price      = 3;
}

message OrderResponse {
  string order_id     = 1;
  string status       = 2;
  double total_amount = 3;
  string created_at   = 4;
}

message OrderUpdate {
  string order_id  = 1;
  string status    = 2;
  string timestamp = 3;
}

message BulkOrderResponse {
  int32           total_created = 1;
  repeated string order_ids    = 2;
  repeated string failed_items = 3;
}
```

**Step 2: gRPC Server implement করা:**

```javascript
// order-server.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
  path.join(__dirname, 'order.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const { order } = grpc.loadPackageDefinition(packageDef);

// ১. Unary RPC — একটি request, একটি response
async function getOrder(call, callback) {
  const { order_id } = call.request;

  try {
    const orderData = await db.findOrder(order_id);

    if (!orderData) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: `Order ${order_id} not found`,
      });
    }

    callback(null, {
      order_id: orderData.id,
      status: orderData.status,
      total_amount: orderData.totalAmount,
      created_at: orderData.createdAt.toISOString(),
    });
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, message: error.message });
  }
}

// ২. Server Streaming — একটি request, একাধিক response stream করা
function getOrderUpdates(call) {
  const { order_id } = call.request;

  // database বা message queue থেকে updates stream করা
  const updateEmitter = subscribeToOrderUpdates(order_id);

  updateEmitter.on('update', (update) => {
    call.write({
      order_id: update.orderId,
      status: update.status,
      timestamp: new Date().toISOString(),
    });
  });

  updateEmitter.on('complete', () => call.end());
  updateEmitter.on('error', (err) => call.destroy(err));

  // client disconnect হলে subscription cancel করা
  call.on('cancelled', () => updateEmitter.unsubscribe());
}

// ৩. Client Streaming — client একাধিক request পাঠাবে, server একটি response দেবে
function bulkCreateOrders(call, callback) {
  const createdIds = [];
  const failedItems = [];

  call.on('data', async (orderRequest) => {
    try {
      const newOrder = await db.createOrder(orderRequest);
      createdIds.push(newOrder.id);
    } catch {
      failedItems.push(orderRequest.user_id);
    }
  });

  call.on('end', () => {
    callback(null, {
      total_created: createdIds.length,
      order_ids: createdIds,
      failed_items: failedItems,
    });
  });
}

// ৪. Bidirectional Streaming — উভয় দিকেই stream
function trackOrders(call) {
  call.on('data', async (request) => {
    // client যতবার request পাঠাবে, server ততবার update দেবে
    const updates = await getLatestUpdates(request.order_id);
    updates.forEach(update => call.write(update));
  });

  call.on('end', () => call.end());
}

// Server তৈরি এবং চালু করা
const server = new grpc.Server();

server.addService(order.OrderService.service, {
  getOrder,
  createOrder: async (call, cb) => { /* similar to getOrder */ },
  getOrderUpdates,
  bulkCreateOrders,
  trackOrders,
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(), // production-এ TLS ব্যবহার করুন
  (error, port) => {
    if (error) throw error;
    console.log(`gRPC server running on port ${port}`);
  }
);
```

**Step 3: gRPC Client implement করা:**

```javascript
// order-client.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('order.proto', {
  keepCase: true, longs: String, enums: String, defaults: true,
});
const { order } = grpc.loadPackageDefinition(packageDef);

const client = new order.OrderService(
  'order-service:50051',
  grpc.credentials.createInsecure()
);

// ১. Unary call
function getOrder(orderId) {
  return new Promise((resolve, reject) => {
    client.getOrder({ order_id: orderId }, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

// ২. Server Streaming — stream থেকে updates পড়া
function watchOrderUpdates(orderId) {
  const stream = client.getOrderUpdates({ order_id: orderId });

  stream.on('data', (update) => {
    console.log(`Order ${update.order_id} status: ${update.status}`);
  });

  stream.on('end',   ()    => console.log('Stream ended'));
  stream.on('error', (err) => console.error('Stream error:', err));

  return stream;
}

// ৩. Client Streaming — একাধিক order একসাথে পাঠানো
function bulkCreateOrders(orders) {
  return new Promise((resolve, reject) => {
    const stream = client.bulkCreateOrders((error, response) => {
      if (error) reject(error);
      else resolve(response);
    });

    orders.forEach(order => stream.write(order));
    stream.end(); // সব পাঠানো শেষ
  });
}

// ৪. Bidirectional Streaming
function trackMultipleOrders(orderIds) {
  const stream = client.trackOrders();

  stream.on('data', (update) => {
    console.log('Received update:', update);
  });

  // বিভিন্ন সময়ে বিভিন্ন order track করতে পাঠানো
  orderIds.forEach((id, index) => {
    setTimeout(() => stream.write({ order_id: id }), index * 1000);
  });

  setTimeout(() => stream.end(), orderIds.length * 1000 + 500);

  return stream;
}

// ব্যবহার
(async () => {
  const order = await getOrder('ORD-123');
  console.log('Order:', order);

  await bulkCreateOrders([
    { user_id: 'U1', items: [{ product_id: 'P1', quantity: 2, price: 500 }], total_amount: 1000 },
    { user_id: 'U2', items: [{ product_id: 'P2', quantity: 1, price: 750 }], total_amount: 750 },
  ]);
})();
```

### What are the four types of gRPC communication?
```
┌─────────────────────────────────────────────────────────┐
│              gRPC Communication Types                   │
├──────────────────┬──────────────────────────────────────┤
│  Unary           │  Client ──[req]──→ Server            │
│                  │  Client ←──[res]── Server            │
├──────────────────┼──────────────────────────────────────┤
│  Server          │  Client ──[req]──→ Server            │
│  Streaming       │  Client ←[res1]── Server             │
│                  │  Client ←[res2]── Server             │
│                  │  Client ←[res3]── Server             │
├──────────────────┼──────────────────────────────────────┤
│  Client          │  Client ──[req1]→ Server             │
│  Streaming       │  Client ──[req2]→ Server             │
│                  │  Client ──[req3]→ Server             │
│                  │  Client ←──[res]── Server            │
├──────────────────┼──────────────────────────────────────┤
│  Bidirectional   │  Client ──[req1]→ Server             │
│  Streaming       │  Client ←[res1]── Server             │
│                  │  Client ──[req2]→ Server             │
│                  │  Client ←[res2]── Server             │
└──────────────────┴──────────────────────────────────────┘
```

**১. Unary RPC** — সবচেয়ে সহজ। একটি request পাঠাও, একটি response পাও। Traditional REST call-এর মতোই। User fetch করা, order create করার মতো standard operation-এর জন্য।

**২. Server Streaming RPC** — Client একটি request পাঠায়, server একাধিক response stream করে পাঠায় যতক্ষণ data আছে। Real-time stock price, order status updates, বা large dataset download-এর জন্য উপযুক্ত।

**৩. Client Streaming RPC** — Client একাধিক request পাঠাতে থাকে, server সব শেষে একটি response দেয়। Bulk data upload, large file chunks পাঠানো, বা batch processing-এর জন্য আদর্শ।

**৪. Bidirectional Streaming RPC** — Client এবং server উভয়েই একসাথে স্বাধীনভাবে stream করতে পারে। Real-time chat, collaborative editing, বা live game state synchronization-এর মতো fully interactive use case-এর জন্য।

## 88. How do you handle distributed transactions in Node.js microservices?
**Distributed Transaction** হলো এমন একটি operation যা একাধিক microservice-এ data পরিবর্তন করে এবং সবগুলো পরিবর্তন হয় একসাথে সফল হবে, নয়তো একসাথে rollback হবে। একটি single database-এ ACID transaction সহজ, কিন্তু প্রতিটি microservice-এর আলাদা database থাকায় traditional two-phase commit কার্যকর নয়।

**সমস্যাটা কোথায়:** Order place করার সময় order-service-এ order save হলো, payment-service-এ payment deduct হলো, কিন্তু inventory-service-এ stock কমানোর সময় error হলো — এই অবস্থায় কীভাবে সব rollback করবেন?
### What is the SAGA pattern?
**SAGA** হলো distributed transaction handle করার একটি pattern। পুরো transaction-কে ছোট ছোট local transaction-এ ভাগ করা হয়। প্রতিটি step সফল হলে পরের step চলে, কোনো step fail করলে আগের সব step-এর জন্য **compensating transaction** চালানো হয় — অর্থাৎ আগে যা করা হয়েছিল তা undo করা হয়।

দুটি SAGA implementation approach আছে — **Choreography** এবং **Orchestration**।

**Choreography-based SAGA — services নিজেরাই events-এর মাধ্যমে coordinate করে:**

```javascript
// order-service.js — SAGA শুরু করে
const { publishEvent, subscribeToEvent } = require('./event-bus');

async function createOrder(orderData) {
  // Step 1: Order create করো "pending" state-এ
  const order = await db.orders.create({
    ...orderData,
    status: 'PENDING',
    sagaId: generateId(), // পুরো saga track করার জন্য
  });

  // Payment service-কে জানাও
  await publishEvent('order.created', {
    sagaId: order.sagaId,
    orderId: order.id,
    userId: order.userId,
    amount: order.totalAmount,
    items: order.items,
  });

  return order;
}

// Payment সফল হলে
subscribeToEvent('payment.completed', async (event) => {
  await db.orders.update(
    { sagaId: event.sagaId },
    { status: 'PAYMENT_DONE' }
  );

  // Inventory service-কে জানাও
  await publishEvent('reserve.inventory', {
    sagaId: event.sagaId,
    orderId: event.orderId,
    items: event.items,
  });
});

// Inventory সফল হলে — SAGA সম্পন্ন
subscribeToEvent('inventory.reserved', async (event) => {
  await db.orders.update(
    { sagaId: event.sagaId },
    { status: 'CONFIRMED' }
  );
  await publishEvent('order.confirmed', { sagaId: event.sagaId });
});

// Payment fail হলে — compensate করো
subscribeToEvent('payment.failed', async (event) => {
  // Compensating transaction: order cancel করো
  await db.orders.update(
    { sagaId: event.sagaId },
    { status: 'CANCELLED', cancelReason: event.reason }
  );
  await publishEvent('order.cancelled', { sagaId: event.sagaId });
});

// Inventory fail হলে — payment refund করো
subscribeToEvent('inventory.failed', async (event) => {
  await db.orders.update(
    { sagaId: event.sagaId },
    { status: 'CANCELLED' }
  );
  // Payment-কে refund করতে বলো
  await publishEvent('payment.refund', {
    sagaId: event.sagaId,
    orderId: event.orderId,
    amount: event.amount,
  });
});
```

```javascript
// payment-service.js
subscribeToEvent('order.created', async (event) => {
  try {
    await processPayment(event.userId, event.amount);
    await publishEvent('payment.completed', {
      sagaId: event.sagaId,
      orderId: event.orderId,
      items: event.items,
    });
  } catch (error) {
    await publishEvent('payment.failed', {
      sagaId: event.sagaId,
      orderId: event.orderId,
      reason: error.message,
    });
  }
});

// Refund request handle করা — compensating transaction
subscribeToEvent('payment.refund', async (event) => {
  await refundPayment(event.orderId, event.amount);
  await publishEvent('payment.refunded', { sagaId: event.sagaId });
});
```

**Orchestration-based SAGA — একটি central Saga Orchestrator সব coordinate করে:**

```javascript
// saga-orchestrator.js — পুরো flow এক জায়গায় control হয়
class OrderSagaOrchestrator {
  constructor(sagaId, orderData) {
    this.sagaId = sagaId;
    this.orderData = orderData;
    this.state = 'STARTED';
    this.completedSteps = [];
  }

  async execute() {
    try {
      // Step 1: Order create
      const order = await this.createOrder();
      this.completedSteps.push({ step: 'CREATE_ORDER', data: order });

      // Step 2: Payment process
      const payment = await this.processPayment(order);
      this.completedSteps.push({ step: 'PROCESS_PAYMENT', data: payment });

      // Step 3: Inventory reserve
      const inventory = await this.reserveInventory(order);
      this.completedSteps.push({ step: 'RESERVE_INVENTORY', data: inventory });

      // Step 4: Order confirm
      await this.confirmOrder(order.id);
      this.state = 'COMPLETED';

      return { success: true, orderId: order.id };

    } catch (error) {
      console.error(`SAGA ${this.sagaId} failed at step:`, error.message);
      await this.compensate(); // rollback করো
      return { success: false, error: error.message };
    }
  }

  async compensate() {
    this.state = 'COMPENSATING';
    console.log(`Starting compensation for SAGA ${this.sagaId}`);

    // সম্পন্ন steps উল্টো order-এ undo করো
    const stepsToUndo = [...this.completedSteps].reverse();

    for (const { step, data } of stepsToUndo) {
      try {
        await this.executeCompensation(step, data);
      } catch (err) {
        // compensation fail হলেও চালিয়ে যাও — log করো
        console.error(`Compensation failed for step ${step}:`, err.message);
        await this.saveCompensationFailure(step, err);
      }
    }

    this.state = 'COMPENSATED';
  }

  async executeCompensation(step, data) {
    const compensations = {
      CREATE_ORDER:      () => this.cancelOrder(data.id),
      PROCESS_PAYMENT:   () => this.refundPayment(data.paymentId),
      RESERVE_INVENTORY: () => this.releaseInventory(data.reservationId),
    };

    if (compensations[step]) {
      await compensations[step]();
      console.log(`Compensated step: ${step}`);
    }
  }

  // individual step implementations
  async createOrder() {
    const response = await fetch('http://order-service/orders', {
      method: 'POST',
      body: JSON.stringify({ ...this.orderData, sagaId: this.sagaId }),
    });
    if (!response.ok) throw new Error('Order creation failed');
    return response.json();
  }

  async processPayment(order) {
    const response = await fetch('http://payment-service/payments', {
      method: 'POST',
      body: JSON.stringify({ orderId: order.id, amount: order.totalAmount }),
    });
    if (!response.ok) throw new Error('Payment failed');
    return response.json();
  }

  async reserveInventory(order) {
    const response = await fetch('http://inventory-service/reserve', {
      method: 'POST',
      body: JSON.stringify({ items: order.items }),
    });
    if (!response.ok) throw new Error('Inventory reservation failed');
    return response.json();
  }

  async cancelOrder(orderId) {
    await fetch(`http://order-service/orders/${orderId}/cancel`, { method: 'POST' });
  }

  async refundPayment(paymentId) {
    await fetch(`http://payment-service/payments/${paymentId}/refund`, { method: 'POST' });
  }

  async releaseInventory(reservationId) {
    await fetch(`http://inventory-service/reserve/${reservationId}`, { method: 'DELETE' });
  }
}

// Route handler
app.post('/checkout', async (req, res) => {
  const sagaId = generateId();
  const orchestrator = new OrderSagaOrchestrator(sagaId, req.body);
  const result = await orchestrator.execute();

  res.status(result.success ? 201 : 500).json(result);
});
```

---

## 89. How do you implement event-driven architecture in Node.js?
**Event-Driven Architecture (EDA)** হলো একটি design pattern যেখানে services সরাসরি একে অপরকে call না করে **events** publish এবং consume করে communicate করে। এতে services loosely coupled থাকে।

```javascript
// event-bus.js — central event bus (Kafka দিয়ে)
const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['kafka:9092'] });

class EventBus {
  constructor() {
    this.producer = kafka.producer();
    this.consumers = new Map();
  }

  async connect() {
    await this.producer.connect();
  }

  // Event publish করা
  async publish(eventType, payload) {
    const event = {
      id: generateId(),
      type: eventType,
      timestamp: new Date().toISOString(),
      version: '1.0',
      payload,
    };

    await this.producer.send({
      topic: eventType,
      messages: [{
        key: payload.aggregateId || payload.id,
        value: JSON.stringify(event),
        headers: { 'event-type': eventType },
      }],
    });

    console.log(`Event published: ${eventType}`, event.id);
    return event;
  }

  // Event subscribe করা
  async subscribe(eventType, groupId, handler) {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic: eventType });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());
        try {
          await handler(event);
        } catch (error) {
          console.error(`Handler failed for event ${event.id}:`, error);
          // Dead Letter Queue-এ পাঠাও
          await this.publishToDLQ(event, error);
        }
      },
    });

    this.consumers.set(`${eventType}-${groupId}`, consumer);
  }

  async publishToDLQ(event, error) {
    await this.producer.send({
      topic: 'dead-letter-queue',
      messages: [{
        value: JSON.stringify({ originalEvent: event, error: error.message }),
      }],
    });
  }
}

const eventBus = new EventBus();
module.exports = eventBus;
```

```javascript
// Event Sourcing — state পরিবর্তনের পরিবর্তে events store করা
class OrderEventStore {
  // শুধু events save করা, state নয়
  async saveEvent(aggregateId, eventType, eventData, expectedVersion) {
    const currentVersion = await this.getCurrentVersion(aggregateId);

    // Optimistic concurrency — version mismatch হলে conflict
    if (currentVersion !== expectedVersion) {
      throw new Error(`Concurrency conflict: expected v${expectedVersion}, got v${currentVersion}`);
    }

    await db.events.create({
      aggregateId,
      eventType,
      eventData: JSON.stringify(eventData),
      version: expectedVersion + 1,
      timestamp: new Date(),
    });
  }

  // Events replay করে current state বের করা
  async getOrderState(orderId) {
    const events = await db.events.findAll({
      where: { aggregateId: orderId },
      order: [['version', 'ASC']],
    });

    return events.reduce((state, event) => {
      return this.applyEvent(state, JSON.parse(event.eventData), event.eventType);
    }, {});
  }

  applyEvent(state, eventData, eventType) {
    const handlers = {
      ORDER_CREATED:    (s, d) => ({ ...s, id: d.id, status: 'PENDING', items: d.items }),
      PAYMENT_RECEIVED: (s, d) => ({ ...s, status: 'PAID', paymentId: d.paymentId }),
      ORDER_SHIPPED:    (s, d) => ({ ...s, status: 'SHIPPED', trackingId: d.trackingId }),
      ORDER_CANCELLED:  (s, d) => ({ ...s, status: 'CANCELLED', cancelReason: d.reason }),
    };

    return handlers[eventType] ? handlers[eventType](state, eventData) : state;
  }
}
```

### What is CQRS (Command Query Responsibility Segregation)?
**CQRS** হলো একটি pattern যেখানে data **লেখার** (Command) এবং **পড়ার** (Query) responsibility আলাদা করা হয়। একই model দিয়ে read এবং write না করে আলাদা model, এমনকি আলাদা database ব্যবহার করা হয়।

**কেন দরকার:** Write operation-এ complex business validation দরকার, কিন্তু read operation-এ দ্রুত optimized query দরকার। এক model দিয়ে দুটো efficiently করা কঠিন।

```javascript
// commands/ — শুধু write operations
// commands/create-order.command.js
class CreateOrderCommand {
  constructor({ userId, items, shippingAddress }) {
    this.userId = userId;
    this.items = items;
    this.shippingAddress = shippingAddress;
  }
}

// command-handlers/order.handler.js
class OrderCommandHandler {
  async handle(command) {
    if (command instanceof CreateOrderCommand) {
      // Business validation সব এখানে
      await this.validateStock(command.items);
      await this.validateUser(command.userId);

      const order = await writeDb.orders.create({
        userId: command.userId,
        items: command.items,
        status: 'PENDING',
        totalAmount: this.calculateTotal(command.items),
      });

      // Read model update করতে event publish করো
      await eventBus.publish('order.created', { orderId: order.id, ...command });

      return order.id;
    }
  }

  calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// queries/ — শুধু read operations, আলাদা optimized database
// queries/order.query.js
class OrderQueryService {
  // Read model — denormalized, query-এর জন্য optimized
  async getOrderDetails(orderId) {
    // Read DB-তে আগে থেকেই join করা data আছে
    return readDb.order_views.findOne({
      where: { orderId },
      // complex join লাগছে না কারণ data already denormalized
    });
  }

  async getUserOrderHistory(userId, page = 1, limit = 10) {
    return readDb.order_views.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
  }

  async getOrderStats(userId) {
    // Analytics-এর জন্য আলাদা optimized view
    return readDb.order_stats.findOne({ where: { userId } });
  }
}

// Read model sync রাখা — event consume করে
subscribeToEvent('order.created', async (event) => {
  const { payload } = event;
  // Read database-এ denormalized data insert
  await readDb.order_views.create({
    orderId: payload.orderId,
    userId: payload.userId,
    userName: await getUserName(payload.userId), // pre-join
    itemCount: payload.items.length,
    totalAmount: payload.totalAmount,
    status: 'PENDING',
    createdAt: new Date(),
  });
});

// Express routes — Command এবং Query আলাদা
const commandHandler = new OrderCommandHandler();
const queryService = new OrderQueryService();

// Command route — write
app.post('/orders', async (req, res) => {
  const command = new CreateOrderCommand(req.body);
  const orderId = await commandHandler.handle(command);
  res.status(202).json({ orderId, message: 'Order accepted' });
});

// Query routes — read
app.get('/orders/:id', async (req, res) => {
  const order = await queryService.getOrderDetails(req.params.id);
  res.json(order);
});

app.get('/users/:userId/orders', async (req, res) => {
  const orders = await queryService.getUserOrderHistory(
    req.params.userId,
    req.query.page,
    req.query.limit
  );
  res.json(orders);
});
```

---

## 90. How do you secure inter-service communication in Node.js microservices?
**Inter-service communication** secure করার মানে হলো নিশ্চিত করা যে একটি service অন্য service-এর সাথে কথা বলার সময় সেই communication encrypted, authenticated এবং authorized।

**১. Mutual TLS (mTLS) — উভয় service পরস্পরকে authenticate করে:**

```javascript
// tls-config.js — certificate-based authentication
const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

// mTLS server — client certificate verify করবে
const server = https.createServer({
  key:  fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
  ca:   fs.readFileSync('./certs/ca.crt'),   // Certificate Authority
  requestCert: true,    // client-কে certificate দিতে হবে
  rejectUnauthorized: true, // invalid certificate reject
}, app);

// Middleware — কোন service request করছে সেটা verify করা
app.use((req, res, next) => {
  const clientCert = req.socket.getPeerCertificate();

  if (!clientCert || !req.client.authorized) {
    return res.status(401).json({ error: 'Valid client certificate required' });
  }

  // Certificate-এ service name check করা
  req.callerService = clientCert.subject.CN; // e.g., "order-service"
  console.log(`Request from service: ${req.callerService}`);
  next();
});

server.listen(3001);
```

```javascript
// secure-client.js — mTLS দিয়ে অন্য service call করা
const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  key:  fs.readFileSync('./certs/client.key'),
  cert: fs.readFileSync('./certs/client.crt'),
  ca:   fs.readFileSync('./certs/ca.crt'),
});

async function secureServiceCall(url, options = {}) {
  const response = await fetch(url, { ...options, agent });
  return response.json();
}
```

**২. JWT-based Service Authentication:**

```javascript
// service-auth.js — service-to-service JWT
const jwt = require('jsonwebtoken');

class ServiceAuthManager {
  constructor(serviceName, privateKey) {
    this.serviceName = serviceName;
    this.privateKey = privateKey;
    this.tokenCache = new Map();
  }

  // Service token generate করা
  generateServiceToken(targetService) {
    const cacheKey = `token:${targetService}`;
    const cached = this.tokenCache.get(cacheKey);

    // Cached token এখনো valid কিনা check (৫ মিনিট buffer)
    if (cached && cached.expiresAt > Date.now() + 300000) {
      return cached.token;
    }

    const token = jwt.sign(
      {
        iss: this.serviceName,   // issuer — কে পাঠাচ্ছে
        aud: targetService,       // audience — কার জন্য
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // ১ ঘন্টা valid
        scope: ['service:read', 'service:write'],
      },
      this.privateKey,
      { algorithm: 'RS256' }
    );

    this.tokenCache.set(cacheKey, {
      token,
      expiresAt: Date.now() + 3600000,
    });

    return token;
  }

  // Incoming token verify করা
  verifyServiceToken(token, expectedAudience) {
    try {
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: expectedAudience,
      });

      // Allowed services whitelist check
      const allowedServices = ['order-service', 'payment-service', 'inventory-service'];
      if (!allowedServices.includes(decoded.iss)) {
        throw new Error(`Unknown service: ${decoded.iss}`);
      }

      return decoded;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}

// Middleware
const authManager = new ServiceAuthManager('payment-service', privateKey);

function requireServiceAuth(req, res, next) {
  const token = req.headers['x-service-token'];

  if (!token) {
    return res.status(401).json({ error: 'Service token required' });
  }

  try {
    req.callerInfo = authManager.verifyServiceToken(token, 'payment-service');
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}

// Outgoing request-এ token attach করা
async function callInventoryService(items) {
  const token = authManager.generateServiceToken('inventory-service');

  return fetch('http://inventory-service:3003/reserve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Service-Token': token,
    },
    body: JSON.stringify({ items }),
  });
}

app.post('/payments', requireServiceAuth, async (req, res) => {
  console.log(`Payment requested by: ${req.callerInfo.iss}`);
  // process payment...
});
```

**৩. Network Policy এবং Secret Management:**

```javascript
// secrets.js — hardcoded credentials নয়, secret manager থেকে নেওয়া
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretsClient = new SecretsManagerClient({ region: 'ap-southeast-1' });

class SecretManager {
  constructor() {
    this.cache = new Map();
  }

  async getSecret(secretName) {
    // Memory cache — প্রতি request-এ AWS call নয়
    if (this.cache.has(secretName)) {
      return this.cache.get(secretName);
    }

    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsClient.send(command);
    const secret = JSON.parse(response.SecretString);

    // ৫ মিনিট cache করো
    this.cache.set(secretName, secret);
    setTimeout(() => this.cache.delete(secretName), 300000);

    return secret;
  }
}

const secrets = new SecretManager();

async function initializeApp() {
  const dbCredentials = await secrets.getSecret('prod/payment-service/db');
  const jwtKeys = await secrets.getSecret('prod/payment-service/jwt');

  // এখন credentials ব্যবহার করো
  const dbConnection = await createDbConnection(dbCredentials);
  return { dbConnection, jwtKeys };
}
```

**৪. API Gateway-এ Centralized Security:**

```javascript
// security-middleware.js — gateway-এ সব security check
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Per-service rate limiting
const serviceLimits = {
  'payment-service': rateLimit({ windowMs: 60000, max: 50 }),
  'order-service':   rateLimit({ windowMs: 60000, max: 200 }),
  'product-service': rateLimit({ windowMs: 60000, max: 500 }),
};

app.use(helmet()); // Security headers

// Service-specific rate limiting
app.use((req, res, next) => {
  const targetService = getTargetService(req.path);
  const limiter = serviceLimits[targetService];
  if (limiter) return limiter(req, res, next);
  next();
});

// Request signing — HMAC দিয়ে request tamper-proof করা
function signRequest(payload, secret) {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${JSON.stringify(payload)}`)
    .digest('hex');

  return { timestamp, signature };
}

function verifyRequestSignature(req, secret) {
  const { 'x-timestamp': timestamp, 'x-signature': signature } = req.headers;

  // Replay attack prevent করা — ৫ মিনিটের পুরনো request reject
  if (Date.now() - parseInt(timestamp) > 300000) {
    throw new Error('Request expired');
  }

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${JSON.stringify(req.body)}`)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    throw new Error('Invalid signature');
  }
}
```

**Security layers সংক্ষেপে:**

| Layer | Mechanism | কী protect করে |
|---|---|---|
| **Transport** | TLS/mTLS | Data in transit encryption |
| **Authentication** | JWT / mTLS certificate | Service identity verify |
| **Authorization** | Scope-based access | কোন service কী করতে পারবে |
| **Integrity** | HMAC signing | Request tampering prevent |
| **Rate Limiting** | Per-service limits | DDoS এবং abuse prevent |
| **Secrets** | AWS Secrets Manager | Credential exposure prevent |