---
sidebar_position: 1
title: ''
---


## 71. How do you write unit tests for Node.js applications?

**Unit Test:** একটি function বা module আলাদাভাবে test করা — dependency mock করে।

```javascript
// userService.js
async function getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return { id: user.id, name: user.name, email: user.email };
}

// userService.test.js
const { getUserById } = require('./userService');
const userRepository = require('./userRepository');

jest.mock('./userRepository'); // Auto-mock

describe('getUserById', () => {
    it('should return user when found', async () => {
        // Arrange
        const mockUser = { id: 1, name: 'Alice', email: 'alice@mail.com' };
        userRepository.findById.mockResolvedValue(mockUser);

        // Act
        const result = await getUserById(1);

        // Assert
        expect(result).toEqual({ id: 1, name: 'Alice', email: 'alice@mail.com' });
        expect(userRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw when user not found', async () => {
        userRepository.findById.mockResolvedValue(null);
        await expect(getUserById(999)).rejects.toThrow('User not found');
    });
});
```

### What is the difference between Jest and Mocha/Chai?
| | Jest | Mocha + Chai |
|---|---|---|
| **All-in-one** | ✅ Runner + Assertion + Mock | Runner আলাদা, Assertion আলাদা |
| **Setup** | Zero config | Configuration দরকার |
| **Mocking** | Built-in | Sinon লাগে |
| **Speed** | Parallel | Series (by default) |
| **TypeScript** | ts-jest | @types/mocha |
| **Popular for** | React, Node.js | Legacy, flexible setup |

---

## 72. How do you mock dependencies in Node.js tests?

```javascript
// Mock, Stub, Spy এর পার্থক্য

// Spy — function call track করে, original implementation রাখে
const spy = jest.spyOn(emailService, 'sendEmail');
await userService.createUser(data);
expect(spy).toHaveBeenCalledWith('alice@mail.com', 'Welcome!');

// Stub — function replace করে, fixed response দেয়
emailService.sendEmail = jest.fn().mockResolvedValue({ messageId: '123' });

// Mock — পুরো module replace করে
jest.mock('./emailService', () => ({
    sendEmail: jest.fn().mockResolvedValue(true)
}));
```

### How do you mock HTTP requests using `nock` or `msw`?
```javascript
const nock = require('nock');

describe('fetchUserFromAPI', () => {
    it('should fetch user data', async () => {
        // External API mock করুন
        nock('https://api.external.com')
            .get('/users/1')
            .reply(200, { id: 1, name: 'Alice' });

        const user = await fetchUserFromAPI(1);
        expect(user.name).toBe('Alice');
    });

    it('should handle API errors', async () => {
        nock('https://api.external.com')
            .get('/users/999')
            .reply(404, { error: 'Not found' });

        await expect(fetchUserFromAPI(999)).rejects.toThrow();
    });
});
```

### What is the difference between a mock, a stub, and a spy?
| | Mock | Stub | Spy |
|---|---|---|---|
| **Implementation** | Fake object | Fake function | Real function |
| **Tracking** | হ্যাঁ | না | হ্যাঁ |
| **Purpose** | Verify behavior | Control return | Observe calls |

---

## 73. What is integration testing, and how do you implement it?

**Integration Test:** Multiple module একসাথে কাজ করছে কিনা test — real DB বা test DB ব্যবহার।

```javascript
// userRoutes.integration.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Test DB setup
});

afterEach(async () => {
    await User.truncate({ cascade: true }); // প্রতিটি test এর পরে clean
});

afterAll(async () => {
    await sequelize.close(); // Connection বন্ধ
});

describe('POST /api/users', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ name: 'Alice', email: 'alice@mail.com' })
            .expect(201);

        expect(response.body.name).toBe('Alice');
        expect(response.body.id).toBeDefined();

        // DB তে actually আছে কিনা check করুন
        const dbUser = await User.findByPk(response.body.id);
        expect(dbUser).not.toBeNull();
    });
});
```

### How do you test database interactions using a test database?
```bash
# .env.test
DATABASE_URL=postgresql://localhost/myapp_test
NODE_ENV=test

# package.json
"scripts": {
    "test": "NODE_ENV=test jest --runInBand"
}
```

---

## 74. What is the role of `supertest` in testing Express APIs?

`supertest` দিয়ে HTTP server কে actual network call ছাড়াই test করা যায়।

```javascript
const request = require('supertest');
const app = require('../app');

// Basic GET test
describe('GET /api/users', () => {
    it('returns a list of users', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });
});

// Authenticated route test
describe('GET /api/profile (authenticated)', () => {
    it('returns user profile with valid JWT', async () => {
        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);

        const response = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.userId).toBe(1);
    });

    it('returns 401 without token', async () => {
        await request(app)
            .get('/api/profile')
            .expect(401);
    });
});

// File upload test
describe('POST /api/upload', () => {
    it('uploads a file successfully', async () => {
        const response = await request(app)
            .post('/api/upload')
            .attach('avatar', Buffer.from('fake-image'), 'test.jpg')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.filename).toBeDefined();
    });
});

// Error response test
describe('GET /api/users/:id', () => {
    it('returns 404 for non-existent user', async () => {
        const response = await request(app)
            .get('/api/users/99999')
            .expect(404);

        expect(response.body.error).toBe('User not found');
    });
});
```

---

## 75. How do you measure test coverage in Node.js?

```bash
# Jest coverage
jest --coverage

# Output:
# --------------------------------|---------|---------|---------|---------|
# File                            | % Stmts | % Branch| % Funcs | % Lines |
# --------------------------------|---------|---------|---------|---------|
# src/services/userService.js     |    92.3 |    85.7 |   100   |    92.3 |
# src/controllers/userController.js|   88.5|    80.0 |    90.0 |    88.5 |
```

```json
// jest.config.js — Coverage threshold
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/migrations/**"
  ]
}
```

### What are the risks of chasing 100% test coverage?
- **Vanity metric:** 100% line coverage কিন্তু edge case miss।
- **Trivial tests:** Coverage বাড়াতে meaningless test।
- **Maintenance burden:** Over-mocked test যা refactor এ break।
- **Better metrics:** Mutation testing, integration test coverage।

---

## 76. What is Test-Driven Development (TDD) and how do you apply it in Node.js?

**TDD Cycle:** 🔴 Red → 🟢 Green → ♻️ Refactor

```javascript
// Step 1: RED — test লিখুন (fail হবে)
it('should calculate order total with discount', () => {
    const order = new Order([
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
    ]);
    expect(order.total({ discount: 10 })).toBe(225);
    // 250 - 10% = 225
});

// Step 2: GREEN — minimum code লিখুন যা pass করে
class Order {
    constructor(items) { this.items = items; }
    total({ discount = 0 } = {}) {
        const subtotal = this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return subtotal * (1 - discount / 100);
    }
}

// Step 3: REFACTOR — code clean করুন, test চালু থাকে
```

### When is TDD most beneficial and when is it counterproductive?
- **Beneficial:** Pure functions, business logic, utility functions।
- **Counterproductive:** UI, exploratory code, prototype, complex setup দরকার।

---

## 77. How do you test asynchronous code in Node.js?

```javascript
// async/await (সবচেয়ে সহজ)
it('fetches user', async () => {
    const user = await getUser(1);
    expect(user.name).toBe('Alice');
});

// .resolves / .rejects (elegant)
it('fetches user', () => {
    return expect(getUser(1)).resolves.toMatchObject({ name: 'Alice' });
});

it('throws for missing user', () => {
    return expect(getUser(999)).rejects.toThrow('User not found');
});

// Done callback (legacy, avoid)
it('fetches user', (done) => {
    getUser(1).then(user => {
        expect(user.name).toBe('Alice');
        done();
    }).catch(done); // done(err) হলে test fail
});
```

### What is the danger of false positives in async tests?
```javascript
// ❌ DANGER — test সবসময় pass করবে (assertion কখনো চলে না)
it('should throw error', () => {
    getUser(999).catch(err => {
        expect(err.message).toBe('User not found');
        // return নেই! Jest test complete হয়ে যাবে
    });
});

// ✅ CORRECT
it('should throw error', async () => {
    await expect(getUser(999)).rejects.toThrow('User not found');
});
```

---

## 78. What is end-to-end (E2E) testing and how do you implement it for a Node.js backend?

**E2E Test:** Real server, real DB দিয়ে complete user flow test।

```javascript
// Newman (Postman CLI)
// জটিল API flow test করুন

// Or: supertest with seed data
describe('Complete order flow', () => {
    let authToken;
    let userId;

    beforeAll(async () => {
        // Seed test data
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@mail.com', password: 'Password123' });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@mail.com', password: 'Password123' });

        authToken = loginRes.body.token;
        userId = loginRes.body.user.id;
    });

    it('completes the full order flow', async () => {
        // Add to cart
        const cartRes = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ productId: 1, quantity: 2 })
            .expect(200);

        // Place order
        const orderRes = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ cartId: cartRes.body.id })
            .expect(201);

        expect(orderRes.body.status).toBe('pending');
        expect(orderRes.body.total).toBeGreaterThan(0);
    });
});
```

### How do you integrate E2E tests into a CI/CD pipeline?
```yaml
# GitHub Actions
- name: Run E2E tests
  run: |
    docker-compose -f docker-compose.test.yml up -d  # DB, Redis start
    sleep 10  # Wait for services
    npm run test:e2e
    docker-compose -f docker-compose.test.yml down
```

---

## 79. How do you test environment-specific code in Node.js?

```javascript
// process.env mock
describe('config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules(); // Module cache clear
        process.env = { ...originalEnv }; // Restore
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('uses production URL in production', () => {
        process.env.NODE_ENV = 'production';
        process.env.API_URL = 'https://prod.api.com';

        const { apiUrl } = require('./config');
        expect(apiUrl).toBe('https://prod.api.com');
    });
});
```

### How do you test code that depends on `Date.now()` or `Math.random()`?
```javascript
// Date mock
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-15'));

const result = generateExpiryDate(); // বর্তমান date depend করে
expect(result).toEqual(new Date('2024-01-22')); // 7 days later

jest.useRealTimers();

// Math.random mock
jest.spyOn(Math, 'random').mockReturnValue(0.5);
const code = generateVerificationCode(); // predicable
expect(code).toBe('500000');
```

---

## 80. What is snapshot testing and when is it useful?

```javascript
// Snapshot test — API response shape check
describe('GET /api/user/1', () => {
    it('matches snapshot', async () => {
        const response = await request(app)
            .get('/api/users/1')
            .expect(200);

        // প্রথমবার: snapshot তৈরি হয়
        // পরের বার: তুলনা করা হয়
        expect(response.body).toMatchSnapshot();
        // __snapshots__/user.test.js.snap এ store হয়
    });
});
```

### When would you use snapshot testing vs explicit assertions?
| | Snapshot Testing | Explicit Assertions |
|---|---|---|
| **Best For** | Response shape, component output | Business logic, specific values |
| **Maintenance** | Stale হলে update করতে হয় (`jest --updateSnapshot`) | Manual কিন্তু precise |
| **Readability** | কম (snapshot file দেখতে হয়) | বেশি (assertion code এ) |
| **Risk** | Accidentally wrong output pass | Explicit fail |

### What are the risks of stale snapshots?
- Bug introduce হলেও snapshot update করলে test pass — real problem miss।
- **Best practice:** Snapshot change review করুন PR এ।
- API response structure এর জন্য ভালো, business logic এর জন্য নয়।
