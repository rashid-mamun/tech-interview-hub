---
sidebar_position: 1
title: ''
---



## 106. How do you deploy a Node.js application?

### What is the role of Docker in Node.js deployment?
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
```

```bash
docker build -t my-api:latest .
docker run -p 3000:3000 --env-file .env my-api:latest
```

### What is the difference between deploying to a VM, a PaaS, and Kubernetes?
| | VM (EC2) | PaaS (Heroku/Railway) | Kubernetes |
|---|---|---|---|
| **Control** | সর্বোচ্চ | কম | সর্বোচ্চ |
| **Ops burden** | বেশি | নেই | বেশি |
| **Scale** | Manual | Auto | Auto |
| **Cost** | Predictable | Usage-based | Efficient |
| **Best For** | Custom setup | Startup | Large scale |

### What is a blue-green deployment and how does it achieve zero downtime?
```
Blue (current v1) — receives 100% traffic
Green (new v2)    — deploy, test, ready

Switch: Load Balancer → Green ৯৯% traffic
        Blue ← rollback point

Blue (now old v1) → terminate after verification
```

---

## 107. What is the difference between development and production modes in Node.js?

```javascript
// NODE_ENV=production এর প্রভাব

// Express
app.use(express.static('public', {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        // Production এ stack trace লুকান
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Config based on environment
const config = {
    db: {
        pool: process.env.NODE_ENV === 'production'
            ? { max: 20, min: 5 }
            : { max: 5, min: 1 }
    },
    logging: process.env.NODE_ENV !== 'production'
};
```

### What optimizations should you enable in production?
```bash
NODE_ENV=production           # Express caching, error details hide
node --optimize-for-size      # Memory কম ব্যবহার
node --max-semi-space-size=64 # GC optimize

# package.json
"start": "NODE_ENV=production node --max-old-space-size=2048 src/index.js"
```

---

## 108. How do you implement CI/CD for a Node.js application?

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:test@localhost/testdb
          NODE_ENV: test

      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Build Docker image
        run: docker build -t my-api:${{ github.sha }} .

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster production \
            --service my-api --force-new-deployment
```

---

## 109. What is the purpose of `nodemon` in development?

```bash
# Install
npm install -D nodemon

# Basic usage
npx nodemon src/index.js

# package.json
"scripts": {
    "dev": "nodemon src/index.js"
}
```

```json
// nodemon.json — configuration
{
  "watch": ["src"],
  "ext": "js,ts,json",
  "ignore": ["src/**/*.test.js", "node_modules"],
  "delay": 1000,
  "env": {
    "NODE_ENV": "development"
  },
  "exec": "ts-node src/index.ts"
}
```

### What is the difference between `nodemon` and `ts-node-dev` for TypeScript projects?
| | nodemon + ts-node | ts-node-dev |
|---|---|---|
| **Speed** | Full restart | File-level incremental recompile |
| **Setup** | nodemon.json + exec | Simple |
| **Memory** | করে কম | বেশি efficient |
| **Recommended** | Simple projects | TypeScript প্রজেক্ট |

---

## 110. How do you monitor a Node.js application in production?

```javascript
// Custom Prometheus metrics
const prometheus = require('prom-client');
prometheus.collectDefaultMetrics(); // CPU, memory, GC etc.

const httpRequestDuration = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

// Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(duration);
    });
    next();
});

// Metrics endpoint (Prometheus scrape করবে)
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.send(await prometheus.register.metrics());
});
```

### What is the four golden signals framework?
- **Latency:** Request কতটা দ্রুত serve হচ্ছে → `p99 < 500ms`।
- **Traffic:** কতটা request আসছে → `requests per second`।
- **Errors:** Error rate → `5xx < 0.1%`।
- **Saturation:** Resource কতটা ভরা → `CPU < 80%, Memory < 85%`।

---

## 111. How do you implement graceful shutdown in Node.js?

```javascript
const server = app.listen(3000);

// SIGTERM — Kubernetes pod termination
// SIGINT  — Ctrl+C
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, async () => {
        console.log(`${signal} received — graceful shutdown`);

        // ১. নতুন request নেওয়া বন্ধ
        server.close(async () => {
            console.log('HTTP server closed');

            // ২. In-flight request শেষ হওয়ার জন্য অপেক্ষা
            try {
                // ৩. Cleanup
                await db.disconnect();
                await redis.quit();
                console.log('All connections closed');
                process.exit(0);
            } catch (err) {
                console.error('Graceful shutdown error:', err);
                process.exit(1);
            }
        });

        // Force shutdown if timeout
        setTimeout(() => {
            console.error('Forced shutdown after timeout');
            process.exit(1);
        }, 30000); // 30s grace period
    });
});

// pm2 এর জন্য ready signal
process.send?.('ready');
```

### How does Kubernetes use `SIGTERM` for pod termination?
```
Kubernetes terminates a pod:
1. Pod status → Terminating
2. SIGTERM → Container (Node.js receives)
3. Grace period: 30s (default)
4. Node.js: server.close() → finish in-flight requests
5. After close: SIGKILL (force terminate)
```

---

## 112. What is the role of Nginx with a Node.js application?

```nginx
# nginx.conf — Reverse proxy
upstream nodejs_backend {
    least_conn;  # Load balancing algorithm
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    keepalive 64;
}

server {
    listen 80;
    server_name api.example.com;
    return 301 https://$host$request_uri;  # HTTP → HTTPS
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    # Static files — Node.js bypass করুন
    location /static/ {
        root /var/www;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API → Node.js proxy
    location /api/ {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
}
```

---

## 113. How do you manage environment configuration across environments?

```javascript
// config/index.js — environment-based config
const config = {
    development: {
        db: { url: 'postgresql://localhost/myapp_dev', pool: { max: 5 } },
        redis: { host: 'localhost' },
        logLevel: 'debug',
    },
    test: {
        db: { url: 'postgresql://localhost/myapp_test', pool: { max: 2 } },
        redis: { host: 'localhost' },
        logLevel: 'error',
    },
    production: {
        db: { url: process.env.DATABASE_URL, pool: { max: 20 } },
        redis: { url: process.env.REDIS_URL },
        logLevel: 'info',
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

### What is the 12-factor app methodology and how does it apply to Node.js?
```
১. Codebase: One repo, multiple deploys
২. Dependencies: package.json এ explicitly declare
৩. Config: Environment variables এ (not hardcoded)
৪. Backing services: DB, Redis — URL দিয়ে attach
৫. Build, release, run: CI/CD pipeline
৬. Processes: Stateless — state Redis/DB তে
৭. Port binding: app.listen(process.env.PORT)
৮. Concurrency: Cluster/horizontal scale
৯. Disposability: Fast start, graceful shutdown
১০. Dev/prod parity: Docker দিয়ে same env
১১. Logs: stdout এ (না file এ)
১২. Admin processes: npm script / one-off tasks
```
