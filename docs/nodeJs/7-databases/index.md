---
sidebar_position: 1
title: ''
---


## 61. How do you connect to a MongoDB database in Node.js?

```javascript
// Mongoose — সবচেয়ে popular
const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,          // Connection pool
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
}

// Schema define
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, min: 18 },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CRUD
const user = await User.create({ name: 'Alice', email: 'alice@mail.com' });
const users = await User.find({ age: { $gte: 18 } }).limit(10).sort('-createdAt');
const found = await User.findById(id);
await User.findByIdAndUpdate(id, { name: 'Bob' }, { new: true });
await User.findByIdAndDelete(id);
```

### What is the difference between Mongoose and the MongoDB native driver?
| | Mongoose | Native Driver (mongodb) |
|---|---|---|
| **Schema** | Schema-based validation | Schemaless |
| **Middleware** | Pre/post hooks | নেই |
| **Query API** | Higher level, chainable | Lower level |
| **Performance** | Slight overhead | Maximum performance |
| **Use case** | Most apps | High performance, custom need |

### How do you handle connection retries and reconnection logic?
```javascript
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Reconnecting...');
    setTimeout(() => connectDB(), 5000);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});
```

---

## 62. How do you integrate PostgreSQL with Node.js?

```javascript
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
});

// Query
const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    ['alice@mail.com']
);

// Transaction
const client = await pool.connect();
try {
    await client.query('BEGIN');

    const userResult = await client.query(
        'INSERT INTO users(name, email) VALUES($1, $2) RETURNING id',
        ['Alice', 'alice@mail.com']
    );
    const userId = userResult.rows[0].id;

    await client.query(
        'INSERT INTO accounts(user_id, balance) VALUES($1, $2)',
        [userId, 0]
    );

    await client.query('COMMIT');
    return userId;
} catch (err) {
    await client.query('ROLLBACK');
    throw err;
} finally {
    client.release(); // Pool এ ফিরিয়ে দিন
}
```

### Why might you choose the `pg` driver over an ORM like Sequelize?
- Full SQL control — complex query, CTE, window functions।
- ORM abstraction নেই — কী query চলছে সব জানা যায়।
- Performance critical এ ORM overhead নেই।

---

## 63. What is an ORM, and how does it help in Node.js?

**ORM (Object-Relational Mapper):** JavaScript object এবং DB table এর মধ্যে mapping। SQL না লিখেও DB operation।

```javascript
// Prisma — আধুনিক, type-safe ORM
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Find with relations
const user = await prisma.user.findUnique({
    where: { email: 'alice@mail.com' },
    include: {
        orders: {
            include: { products: true }
        }
    }
});

// Create
const newUser = await prisma.user.create({
    data: {
        name: 'Alice',
        email: 'alice@mail.com',
        orders: {
            create: { total: 100 }
        }
    }
});
```

### What is the difference between Sequelize, TypeORM, and Prisma?
| | Sequelize | TypeORM | Prisma |
|---|---|---|---|
| **Type Safety** | কম | ভালো (TS) | সর্বোচ্চ (TS) |
| **Schema** | JavaScript model | Decorators | .prisma schema file |
| **Migrations** | Sequelize migrations | TypeORM migrations | Prisma Migrate |
| **Query Builder** | Chainable | QueryBuilder | Fluent API |
| **Learning curve** | মাঝারি | বেশি | কম |
| **Best For** | Legacy, JS project | Angular-like TS | TypeScript, new project |

---

## 64. How do you handle database connection pooling?

```javascript
// pg-pool configuration
const pool = new Pool({
    max: 20,          // সর্বোচ্চ connection — DB এর max_connections এর 80%
    min: 5,           // Idle minimum — cold start এড়াতে
    idleTimeoutMillis: 30000,        // 30s idle এ close
    connectionTimeoutMillis: 2000,   // 2s তে connection না পেলে error
    allowExitOnIdle: false,          // Process alive রাখুন
});

// Pool monitoring
pool.on('error', (err) => {
    console.error('Unexpected pool error', err);
});

setInterval(async () => {
    console.log({
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
    });
}, 30000);
```

### What happens when all connections in the pool are in use?
- নতুন query `connectionTimeoutMillis` এর জন্য wait করে।
- Timeout হলে error: `Error: timeout exceeded when trying to connect`।
- **সমাধান:** Pool size বাড়ান, slow query optimize করুন, read replica ব্যবহার।

---

## 65. What is the difference between SQL and NoSQL databases in Node.js?

| বৈশিষ্ট্য | SQL (PostgreSQL) | NoSQL (MongoDB) |
|---|---|---|
| **Schema** | Strict, predefined | Flexible, dynamic |
| **Relations** | JOIN — native | Application level / $lookup |
| **Transactions** | ACID | MongoDB 4.0+ তে ACID |
| **Scale** | Vertical (primarily) | Horizontal (built-in sharding) |
| **Query** | SQL (powerful) | Document query (flexible) |

### When would you choose NoSQL (MongoDB, DynamoDB) over SQL?
- Schema frequently changes (rapid prototyping)।
- Document-oriented data (product catalog, user profiles)।
- Horizontal scale at TB+ level।
- Unstructured or semi-structured data।

---

## 66. What is Prisma, and how does it differ from traditional ORMs?

```prisma
// schema.prisma
model User {
    id       Int      @id @default(autoincrement())
    email    String   @unique
    name     String
    orders   Order[]
    createdAt DateTime @default(now())
}

model Order {
    id     Int   @id @default(autoincrement())
    total  Float
    user   User  @relation(fields: [userId], references: [id])
    userId Int
}
```

```bash
# Migration তৈরি এবং run
npx prisma migrate dev --name add_user_table

# Prisma Client generate
npx prisma generate
```

### How does Prisma's type-safe query builder benefit TypeScript projects?
```typescript
// TypeScript এ Prisma — সম্পূর্ণ type-safe
const user = await prisma.user.findUnique({
    where: { id: 1 },
    select: { name: true, email: true }
});
// user: { name: string; email: string } | null
// Typo বা wrong field = compile error
```

### What is the difference between `prisma migrate dev` and `prisma migrate deploy`?
| | `migrate dev` | `migrate deploy` |
|---|---|---|
| **ব্যবহার** | Development | Production/CI |
| **Behavior** | Migration তৈরি করে, apply করে | শুধু pending migration apply |
| **Prompt** | Interactive | Non-interactive |
| **Shadow DB** | Creates shadow DB | নেই |

---

## 67. How do you handle database migrations in Node.js?

```bash
# Prisma Migrate
npx prisma migrate dev        # Development
npx prisma migrate deploy     # Production

# Knex migrations
knex migrate:make add_users_table  # Create migration file
knex migrate:latest                 # Apply all pending
knex migrate:rollback               # Last batch rollback
```

### How do you write a zero-downtime migration for a high-traffic production database?
**Expand-Contract pattern:**
```sql
-- Step 1: নতুন column যোগ (nullable — existing row এ value নেই)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Step 2: Application deploy — নতুন row এ phone লেখে, পুরনোতে NULL
-- Step 3: Background job — পুরনো row এ phone fill করে
UPDATE users SET phone = '' WHERE phone IS NULL;

-- Step 4: NOT NULL constraint যোগ (এখন safe)
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;

-- Step 5: পুরনো code drop
```

---

## 68. How do you implement Redis in a Node.js application?

```javascript
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
});

// Caching
await redis.setex('user:123', 3600, JSON.stringify(user)); // TTL 1 hour
const cached = await redis.get('user:123');
await redis.del('user:123');

// Rate limiting
const count = await redis.incr(`rate:${ip}`);
if (count === 1) await redis.expire(`rate:${ip}`, 60);
if (count > 100) return res.status(429).send('Too many requests');

// Pub/Sub
const publisher = new Redis();
const subscriber = new Redis();

subscriber.subscribe('notifications', (err, count) => {});
subscriber.on('message', (channel, message) => {
    console.log(`Received: ${message} on ${channel}`);
});

publisher.publish('notifications', JSON.stringify({ type: 'new_order', id: 123 }));
```

### What is the difference between `ioredis` and `redis` npm clients?
| | `ioredis` | `redis` (v4) |
|---|---|---|
| **Cluster** | Built-in | Built-in |
| **Sentinel** | Built-in | Built-in |
| **Pipelining** | Auto-pipelining | Manual |
| **TypeScript** | আছে | আছে |
| **Community** | Popular | Official |

---

## 69. How do you handle transactions in Node.js?

```javascript
// Sequelize transaction
const t = await sequelize.transaction();
try {
    const user = await User.create({ name: 'Alice' }, { transaction: t });
    await Account.create({ userId: user.id, balance: 0 }, { transaction: t });
    await t.commit();
} catch (err) {
    await t.rollback();
    throw err;
}

// Managed transaction (auto commit/rollback)
await sequelize.transaction(async (t) => {
    const user = await User.create({ name: 'Alice' }, { transaction: t });
    await Account.create({ userId: user.id }, { transaction: t });
    // Error হলে auto rollback
});
```

### What is optimistic locking and when do you use it?
```javascript
// Sequelize optimistic locking — version field
const User = sequelize.define('User', {
    name: DataTypes.STRING,
}, { version: true }); // version column auto-add

// Update — version check
const user = await User.findByPk(1);
user.name = 'Bob';
await user.save(); // version increment হয়

// Concurrent update conflict → VersionError
```
- **Use:** Low conflict scenario — mostly read, rarely update।

---

## 70. What is the N+1 query problem in Node.js, and how do you solve it?

```javascript
// ❌ N+1 Problem
const posts = await Post.findAll();      // 1 query
for (const post of posts) {
    const author = await User.findByPk(post.userId); // N queries!
    post.authorName = author.name;
}
// 100 posts = 101 queries!

// ✅ Solution 1: Eager Loading
const posts = await Post.findAll({
    include: [{ model: User, attributes: ['name'] }]
});
// 1 JOIN query

// ✅ Solution 2: DataLoader (GraphQL এ বেশি ব্যবহৃত)
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
    const users = await User.findAll({
        where: { id: { [Op.in]: userIds } }
    });
    // userIds order এ return করুন
    return userIds.map(id => users.find(u => u.id === id));
});

// Usage
const posts = await Post.findAll();
const postsWithAuthors = await Promise.all(
    posts.map(async (post) => ({
        ...post.toJSON(),
        author: await userLoader.load(post.userId) // Batched!
    }))
);
// সব userId batch হয়ে একটি query
```

### How do you detect N+1 queries in a Node.js application?
```javascript
// Sequelize logging
const sequelize = new Sequelize(url, {
    logging: (sql, timing) => {
        console.log(`[${timing}ms] ${sql}`);
        // Log analyze করে বারবার similar query খুঁজুন
    }
});

// Better: query-count middleware
let queryCount = 0;
sequelize.addHook('beforeQuery', () => queryCount++);

// Request শেষে
app.use((req, res, next) => {
    queryCount = 0;
    res.on('finish', () => {
        if (queryCount > 10) {
            logger.warn(`High query count: ${queryCount} for ${req.url}`);
        }
    });
    next();
});
```
