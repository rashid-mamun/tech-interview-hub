---
sidebar_position: 1
title: ''
---



## 91. How do you implement WebSockets in Node.js?

**WebSocket:** HTTP handshake দিয়ে শুরু, তারপর persistent bidirectional connection।

```javascript
const WebSocket = require('ws');

// Server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
    console.log('Client connected:', req.socket.remoteAddress);

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        console.log('Received:', message);

        // Echo back
        ws.send(JSON.stringify({ type: 'echo', data: message }));
    });

    ws.on('close', (code, reason) => {
        console.log(`Disconnected: ${code} ${reason}`);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    // Ping/pong for keep-alive
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
});

// Heartbeat — dead connection detect
const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', () => clearInterval(heartbeat));

// Client
const ws = new WebSocket('ws://localhost:8080');
ws.on('open', () => ws.send(JSON.stringify({ type: 'hello' })));
ws.on('message', (data) => console.log('Server says:', JSON.parse(data)));
```

### How do you broadcast messages to all connected clients?
```javascript
function broadcast(wss, message, excludeClient = null) {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Chat — সবাইকে পাঠান sender ছাড়া
ws.on('message', (data) => {
    broadcast(wss, { type: 'chat', text: data.toString() }, ws);
});
```

---

## 92. What is the difference between WebSockets and HTTP long polling?

| | HTTP Polling | HTTP Long Polling | WebSocket | SSE |
|---|---|---|---|---|
| **Connection** | প্রতিবার নতুন | Keep-open until data | Persistent | Persistent |
| **Direction** | Client → Server | Client → Server | Bidirectional | Server → Client |
| **Overhead** | বেশি (HTTP headers) | মাঝারি | কম (after handshake) | কম |
| **Latency** | বেশি | মাঝারি | সর্বনিম্ন | সর্বনিম্ন |
| **Use case** | Infrequent updates | Chat (legacy) | Chat, gaming, real-time | Notifications, feeds |

### When would you use Server-Sent Events (SSE) over WebSockets?
```javascript
// SSE — শুধু server → client (unidirectional)
app.get('/notifications', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Event পাঠান
    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // নতুন notification আসলে push
    const unsubscribe = notificationService.subscribe(req.user.id, sendEvent);

    req.on('close', () => unsubscribe());
});
```
- **SSE ব্যবহার করুন:** Notification, live feed, dashboard updates।
- **WebSocket ব্যবহার করুন:** Chat, gaming, bidirectional যোগাযোগ দরকার।

---

## 93. How do you secure WebSocket connections?

```javascript
// Authentication in WebSocket handshake
const wss = new WebSocket.Server({
    port: 8080,
    verifyClient: async ({ req }, done) => {
        const token = new URL(req.url, 'ws://localhost').searchParams.get('token');
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            done(true);
        } catch {
            done(false, 401, 'Unauthorized');
        }
    }
});

// Rate limiting — too many messages block
ws.on('message', (data) => {
    const now = Date.now();
    ws.messageCount = (ws.messageCount || 0) + 1;
    ws.windowStart = ws.windowStart || now;

    if (now - ws.windowStart > 60000) {
        ws.messageCount = 1;
        ws.windowStart = now;
    }

    if (ws.messageCount > 100) {
        ws.send(JSON.stringify({ error: 'Rate limit exceeded' }));
        return;
    }

    // Message size limit
    if (data.length > 10240) { // 10KB
        ws.send(JSON.stringify({ error: 'Message too large' }));
        return;
    }

    processMessage(ws, data);
});
```

### How do you use `wss://` (WebSocket Secure)?
```javascript
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    cert: fs.readFileSync('/certs/server.crt'),
    key: fs.readFileSync('/certs/server.key'),
});

const wss = new WebSocket.Server({ server });
server.listen(8443);
// Client: const ws = new WebSocket('wss://example.com:8443');
```

---

## 94. How do you scale WebSocket applications in Node.js?

**Problem:** User A Server 1 এ, User B Server 2 এ — সরাসরি communicate করতে পারে না।

```javascript
// Redis Pub/Sub দিয়ে multi-server WebSocket
const Redis = require('ioredis');
const subscriber = new Redis(process.env.REDIS_URL);
const publisher = new Redis(process.env.REDIS_URL);

// User connection track
const userSockets = new Map(); // userId → ws

wss.on('connection', (ws, req) => {
    const { userId } = req.user;
    userSockets.set(userId, ws);

    ws.on('close', () => userSockets.delete(userId));
});

// Message publish করুন (যেকোনো server থেকে)
async function sendToUser(userId, message) {
    publisher.publish('ws:message', JSON.stringify({ userId, message }));
}

// সব server subscribe করে
subscriber.subscribe('ws:message');
subscriber.on('message', (channel, data) => {
    const { userId, message } = JSON.parse(data);
    const ws = userSockets.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message)); // এই server এ user আছে
    }
});
```

---

## 95. What is Socket.IO, and how does it differ from raw WebSockets?

**Socket.IO:** WebSocket এর উপর abstraction — fallback, rooms, namespaces, reconnection built-in।

```javascript
// Server
const { Server } = require('socket.io');
const io = new Server(httpServer, {
    cors: { origin: 'https://myapp.com', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    // Room join
    socket.on('join:room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user:joined', { userId: socket.userId });
    });

    // Chat message
    socket.on('message:send', ({ roomId, text }) => {
        // শুধু এই room এ broadcast (sender এর কাছে নয়)
        socket.to(roomId).emit('message:received', {
            from: socket.userId,
            text,
            timestamp: Date.now()
        });
    });

    // Namespace
    const adminNs = io.of('/admin');
    adminNs.on('connection', (socket) => {
        // শুধু /admin socket
    });

    socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
    });
});

// Client
const socket = io('https://myapp.com');
socket.emit('join:room', 'room-123');
socket.on('message:received', (msg) => console.log(msg));
```

### What is Socket.IO's fallback mechanism?
```
Connection attempt order:
1. WebSocket (fastest)
2. HTTP long-polling (fallback for strict firewall/proxy)

// Force WebSocket only
const socket = io({ transports: ['websocket'] });
```

---

## 96. How do you implement a real-time notification system in Node.js?

```javascript
// Notification Service Architecture
// 1. Event source → Kafka topic
// 2. Notification Service consume করে
// 3. WebSocket / SSE দিয়ে user কে push

// notification-service.js
const activeConnections = new Map(); // userId → Set of sockets

io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!activeConnections.has(userId)) {
        activeConnections.set(userId, new Set());
    }
    activeConnections.get(userId).add(socket);

    socket.on('disconnect', () => {
        activeConnections.get(userId)?.delete(socket);
    });
});

// Kafka consumer → push to WebSocket
consumer.run({
    eachMessage: async ({ message }) => {
        const notification = JSON.parse(message.value.toString());
        const sockets = activeConnections.get(notification.userId);

        if (sockets?.size > 0) {
            // User online — WebSocket push
            sockets.forEach(socket =>
                socket.emit('notification', notification)
            );
            await markAsDelivered(notification.id);
        } else {
            // User offline — DB তে store, অথবা Push Notification
            await storeUnreadNotification(notification);
            await sendPushNotification(notification);
        }
    }
});

// Reconnection — missed notification দিন
socket.on('reconnect', async () => {
    const unread = await getUnreadNotifications(userId);
    socket.emit('notifications:unread', unread);
});
```
