---
sidebar_position: 1
title: 'Express Framework'
---

## 1.What is the difference between `req.params`, `req.query`, and `req.body`?
| | Source | উদাহরণ |
|---|---|---|
| `req.params` | URL path `:id` | `GET /users/123` → `{id: "123"}` |
| `req.query` | URL query string | `GET /users?page=2` → `{page: "2"}` |
| `req.body` | Request body (POST/PUT) | JSON body parse করা |


---

## 2.Optional route parameter কীভাবে define করবে?

Route path-এ `{}` (braces) দিয়ে অংশটুকু wrap করলে সেটা optional হয়ে যায়:

```js
app.get('/users{/:id}', (req, res) => {
  if (req.params.id) {
    res.send(`User: ${req.params.id}`);
  } else {
    res.send('All users');
  }
});
// /users     → works (id undefined)
// /users/42  → works (id = "42")
```

---

## 3.Middleware কী Express-এ?

Middleware হলো এমন function যেটা request আর response-এর মাঝখানে বসে কাজ করে। প্রতিটা middleware তিনটা জিনিস পায়: `req`, `res`, এবং `next`. কাজ শেষে হয় `next()` call করে পরের middleware-এ যায়, নয়তো `res.send()` দিয়ে response শেষ করে দেয়।

Middleware দিয়ে করা যায়: authentication check, logging, request body parse, error handling, CORS ইত্যাদি।

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // পরের middleware-এ যাও
};

app.use(logger);
```

---

## 4.Application-level বনাম Router-level middleware

**Application-level middleware** পুরো app-এ apply হয়, `app.use()` দিয়ে register করা হয়। সব route-এর জন্য run করে।

**Router-level middleware** একটা নির্দিষ্ট `express.Router()` instance-এ apply হয়। শুধু সেই router-এর route-গুলোর জন্য run করে। এটা দিয়ে code modular রাখা যায়।

```js
const router = express.Router();

// শুধু /api/* route-এর জন্য
router.use(authMiddleware);
router.get('/profile', profileHandler);

app.use('/api', router);
```

Request flow-টা সংক্ষেপে এভাবে বোঝা যায়:

```
Request
  → Application-level middleware (app.use করা সব middleware, সব route-এর জন্য)
  → Router-level middleware (শুধু matched router-এর জন্য, যেমন router.use)
  → Route handler
  → Response
```

---

## 5.`next()` call না করলে কী হয়?

Request সেখানেই আটকে যাবে। Response কখনো client-এ পৌঁছাবে না, browser timeout করবে। এটা একটা খুব common bug।

```js
app.use((req, res, next) => {
  console.log('middleware ran');
  // next() ভুলে গেছি!
  // request এখানেই stuck — client চিরকাল wait করবে
});

app.get('/', (req, res) => {
  res.send('Hello'); // এই line কখনো execute হবে না
});
```

---

## 6.Async route handler-এ error কীভাবে catch হয়?

Async route handler বা middleware কোনো Promise reject করলে বা `throw` করলে, Express নিজে থেকেই সেটাকে ধরে error-handling middleware-এ পাঠিয়ে দেয় — এর জন্য আলাদা কোনো package বা manual `try/catch` লাগে না।

```js
app.get('/user', async (req, res) => {
  const user = await db.findUser(req.query.id); // reject হলে Express নিজেই next(err) call করে
  res.json(user);
});

// এই error handler সব async error পাবে
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

`try/catch` তখনই দরকার যখন error-টা নিজে handle করে ভিন্ন কিছু করতে চাও (যেমন custom message দেওয়া, retry করা, বা নির্দিষ্ট error type অনুযায়ী আলাদা response দেওয়া):

```js
app.get('/user', async (req, res, next) => {
  try {
    const user = await db.findUser(req.query.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err); // চাইলে এখানেও Express নিজেই ধরে নিত
  }
});
```

---

## 7.Memory vs Disk vs Cloud (S3) — file upload storage

তিনটা approach-এর আলাদা আলাদা trade-off আছে:

**Memory storage** — file সরাসরি RAM-এ রাখে। ছোট file-এর জন্য দ্রুত, কিন্তু server restart হলে সব শেষ, আর বড় file হলে memory শেষ হয়ে যায়।

**Disk storage** — server-এর local filesystem-এ save করে। Persistent, কিন্তু multiple server থাকলে (horizontal scaling) সমস্যা হয় — একটা server-এ upload হওয়া file আরেকটা server দেখতে পায় না।

**Cloud storage (S3)** — AWS S3 বা similar service-এ upload করে। সব server একই storage দেখতে পায়, practically unlimited space, CDN দিয়ে fast delivery — তবে latency আছে এবং cost লাগে।

| | Memory | Disk | S3 |
|---|---|---|---|
| Speed | দ্রুত | মাঝারি | নেটওয়ার্ক-নির্ভর |
| Persistence | নেই | আছে | আছে |
| Scaling | সমস্যা | সমস্যা | সহজ |
| Cost | বেশি (RAM) | কম | pay-per-use |
| Production-ready | না | সীমিত | হ্যাঁ |

`multer` দিয়ে example:

```js
const multer = require('multer');

// Memory
const memUpload = multer({ storage: multer.memoryStorage() });

// Disk
const diskUpload = multer({ dest: 'uploads/' });

// S3 — multer-s3 package ব্যবহার করে
const s3Upload = multer({ storage: multerS3({ s3, bucket: 'my-bucket' }) });
```

Production-এ সবসময় S3 বা similar object storage ব্যবহার করাই ভালো।