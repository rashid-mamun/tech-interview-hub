---
sidebar_position: 1
title: ''
---



## 31. What is Express, and how does it integrate with Node.js?

**Express** হলো Node.js এর সবচেয়ে popular web framework — minimal, fast, unopinionated।

```javascript
const express = require('express');
const app = express();

app.use(express.json()); // JSON body parse

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.listen(3000, () => console.log('Server on port 3000'));
```

### What are the advantages of using Express over raw `http` module?
- **Routing:** URL এবং HTTP method দিয়ে handler define।
- **Middleware:** Request/response pipeline।
- **Template engines:** EJS, Pug support।
- **Ecosystem:** হাজারো middleware package।
- Raw `http` তে এসব manually করতে হয়।

### What alternatives to Express exist and when would you choose them?
| Framework | বৈশিষ্ট্য | Best For |
|---|---|---|
| **Fastify** | Express এর ২x দ্রুত, schema validation built-in | High performance API |
| **Koa** | async/await first, lightweight | Custom middleware stack |
| **Hapi** | Configuration-driven, enterprise | Complex enterprise apps |
| **NestJS** | TypeScript, Angular-inspired, DI | Large TypeScript backend |

---

## 32. How do you define routes in Express?

```javascript
const express = require('express');
const router = express.Router();

// GET /users
router.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// GET /users/:id — dynamic parameter
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// POST /users
router.post('/users', async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});
```

### What is the difference between `req.params`, `req.query`, and `req.body`?
| | Source | উদাহরণ |
|---|---|---|
| `req.params` | URL path `:id` | `GET /users/123` → `{id: "123"}` |
| `req.query` | URL query string | `GET /users?page=2` → `{page: "2"}` |
| `req.body` | Request body (POST/PUT) | JSON body parse করা |

### How do you define optional route parameters?
```javascript
// :format? — optional
router.get('/users/:id/:format?', (req, res) => {
    const { id, format = 'json' } = req.params;
    res.send(`User ${id} in ${format} format`);
});
// /users/123 বা /users/123/xml উভয়ই কাজ করবে
```

---

## 33. What is middleware in Express?

**Middleware** হলো request এবং response এর মাঝে function যা request process করে, response পাঠায়, বা পরের middleware কে call করে।

```javascript
// Middleware signature: (req, res, next)
function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next(); // পরের middleware এ যান
}

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// Apply করুন
app.use(requestLogger);           // সব route এ
app.use('/api', authenticate);    // /api এর সব route এ
app.get('/profile', authenticate, profileHandler); // শুধু এই route এ
```

### What is the difference between application-level and router-level middleware?
```javascript
// Application-level — সব route এ
app.use(express.json());
app.use(helmet());

// Router-level — শুধু এই router এর route এ
const apiRouter = express.Router();
apiRouter.use(authenticate);  // শুধু /api/* এ
app.use('/api', apiRouter);
```

### What happens if you forget to call `next()` in a middleware function?
- Request permanently hang হয়ে যায় — client কখনো response পাবে না।
- Error handler middleware এ error পাঠাতে চাইলে: `next(error)`।

---

## 34. How do you handle errors in Express?

```javascript
// ✅ Synchronous error — throw করলেই Express ধরে
app.get('/sync', (req, res) => {
    throw new Error('Sync error'); // Express catch করবে
});

// ⚠️ Async error — manually next(err) করতে হবে
app.get('/async', async (req, res, next) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (err) {
        next(err); // Error middleware তে পাঠান
    }
});

// Global Error Handler — ৪টি argument বাধ্যতামূলক
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Production এ stack trace লুকান
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});
```

### How do you use `express-async-errors` to catch async errors automatically?
```javascript
require('express-async-errors'); // শুরুতেই import করুন

// এরপর async route এ try/catch লাগবে না!
app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id); // Error হলে auto next(err)
    res.json(user);
});
```

---

## 35. What is the purpose of `express.Router`?

`Router` হলো mini Express app — route group করার জন্য।

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// app.js
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

app.use('/api/users', usersRouter);   // /api/users, /api/users/:id
app.use('/api/orders', ordersRouter); // /api/orders
```

### How do you apply middleware to a specific router only?
```javascript
const adminRouter = express.Router();

// এই router এর সব route এ admin check
adminRouter.use(requireAdmin);

adminRouter.get('/dashboard', getDashboard);
adminRouter.delete('/users/:id', deleteUser);

app.use('/admin', adminRouter);
```

### What is the difference between `router.use` and `router.all`?
```javascript
// router.use — path prefix match (nested route সহ)
router.use('/users', middleware); // /users, /users/123, /users/123/orders সব

// router.all — exact path, সব HTTP method
router.all('/users', middleware); // শুধু /users (exact)
```

---

## 36. How do you serve static files in Express?

```javascript
const path = require('path');

// Public folder থেকে static files serve
app.use(express.static(path.join(__dirname, 'public')));
// GET /images/logo.png → ./public/images/logo.png

// Cache headers সেট করুন
app.use(express.static('public', {
    maxAge: '1d',      // 1 দিন cache
    etag: true,        // ETag header
    lastModified: true
}));

// Multiple static directories
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('node_modules/bootstrap/dist'));
```

### How do you secure static file access (prevent directory traversal)?
- `express.static` by default directory traversal prevent করে।
- `..` এবং absolute path access block করে।
- **Extra security:** শুধু authorized file access করতে custom middleware।

---

## 37. What is the difference between `app.use` and `app.get` in Express?

| | `app.use` | `app.get` |
|---|---|---|
| **HTTP method** | সব method (GET, POST, etc.) | শুধু GET |
| **Path matching** | Prefix match | Exact match |
| **Use case** | Middleware, sub-app mount | Specific route handle |

```javascript
app.use('/api', (req, res, next) => {
    // /api, /api/users, /api/orders — সব match করে
    console.log('API request');
    next();
});

app.get('/api/users', (req, res) => {
    // শুধু GET /api/users (exact)
    res.json(users);
});
```

### How does `app.use` handle path prefix matching differently from `app.get`?
```javascript
app.use('/users', router);
// Match: /users, /users/, /users/123, /users/123/orders
// Router তে path হবে /123, /123/orders (prefix stripped)

app.get('/users', handler);
// Match: শুধু /users (exact)
```

---

## 38. How do you implement CORS in Express?

**CORS (Cross-Origin Resource Sharing):** Browser security policy যা different origin থেকে API call করতে হলে server permission দিতে হয়।

```javascript
const cors = require('cors');

// সব origin allow (development)
app.use(cors());

// Specific origin allow (production)
app.use(cors({
    origin: ['https://myapp.com', 'https://admin.myapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Cookie send করতে
    maxAge: 86400       // Preflight cache 24h
}));

// Per-route CORS
app.get('/public-data', cors(), (req, res) => {
    res.json({ data: 'public' });
});
```

### What is a CORS preflight request and how does Express handle it?
```
Browser → OPTIONS /api/users (Preflight)
          Access-Control-Request-Method: POST
          Access-Control-Request-Headers: Authorization

Server → 204 No Content
         Access-Control-Allow-Origin: https://myapp.com
         Access-Control-Allow-Methods: POST
         Access-Control-Allow-Headers: Authorization

Browser → POST /api/users (Actual request)
```
- `cors()` middleware OPTIONS request automatically handle করে।

---

## 39. How do you handle file uploads in Express?

```javascript
const multer = require('multer');

// Disk storage
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG/PNG/WebP allowed'));
        }
    }
});

// Single file
app.post('/upload', upload.single('avatar'), (req, res) => {
    res.json({ filename: req.file.filename, path: req.file.path });
});

// Multiple files
app.post('/gallery', upload.array('photos', 10), (req, res) => {
    res.json({ files: req.files.map(f => f.filename) });
});
```

### What is the difference between storing uploads in memory vs disk vs cloud storage (S3)?
| Storage | Pros | Cons | Use Case |
|---|---|---|---|
| **Memory** | দ্রুত, no disk I/O | Server restart এ হারায়, RAM বাড়ে | Small temporary processing |
| **Disk** | Simple, no external dependency | Multiple server এ শেয়ার নেই | Single server, small scale |
| **S3/Cloud** | Scalable, durable, CDN সহজ | External dependency, latency | Production, multi-server |

---

## 40. What is the difference between Express and Fastify?

| বৈশিষ্ট্য | Express | Fastify |
|---|---|---|
| **Performance** | ~15k req/sec | ~30k req/sec (2x দ্রুত) |
| **Validation** | Manual (Joi, yup) | Built-in JSON Schema |
| **TypeScript** | @types/express | Built-in TS support |
| **Plugin system** | Simple middleware | Scoped, encapsulated plugins |
| **Logging** | External (Morgan, Winston) | Built-in (Pino — very fast) |
| **Ecosystem** | বিশাল | ছোট কিন্তু বাড়ছে |

### Why might you choose Fastify for a high-performance API?
- **JSON Schema validation:** Request/response schema define করলে AJV দিয়ে validate — 10x দ্রুত Joi এর চেয়ে।
- **Pino logger:** Low overhead structured logging।
- **Serialization:** JSON serialize করে response schema থেকে — দ্রুত।

### How does Fastify's schema-based validation improve performance?
```javascript
// Fastify — schema দিয়ে validation এবং serialization
fastify.post('/users', {
    schema: {
        body: {
            type: 'object',
            required: ['name', 'email'],
            properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' }
            }
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' }
                }
            }
        }
    }
}, async (request, reply) => {
    const user = await createUser(request.body);
    return reply.status(201).send(user);
});
```
