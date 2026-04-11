---
sidebar_position: 1
title: ''
---



## 11. What is the `require` function in Node.js?

`require()` হলো CommonJS module system এর built-in function যা অন্য module load করে।

### How does `require` resolve module paths?
```javascript
// ১. Core modules (সবার আগে)
const fs = require('fs');
const path = require('path');

// ২. Relative paths
const myModule = require('./utils/helper');
// → ./utils/helper.js অথবা ./utils/helper/index.js

// ৩. node_modules lookup (root পর্যন্ত)
const express = require('express');
// → ./node_modules/express
// → ../node_modules/express
// → /node_modules/express (root পর্যন্ত)
```

### What happens if `require` cannot find a module?
```javascript
try {
    const missing = require('non-existent-module');
} catch (err) {
    console.log(err.code);    // 'MODULE_NOT_FOUND'
    console.log(err.message); // "Cannot find module 'non-existent-module'"
}
```

### How does `require` differ from dynamic `import()` in ES Modules?
```javascript
// require — synchronous, blocks
const data = require('./big-data.json');

// import() — async, non-blocking, returns Promise
const data = await import('./big-data.json');     // ESM dynamic import
const { default: config } = await import('./config.js');
```

---

## 12. What is the purpose of `module.exports`?

`module.exports` দিয়ে একটি module বাইরের জগতে কী expose করবে তা নির্ধারণ করা হয়।

### How do you export multiple functions or classes from a module?
```javascript
// utils.js — multiple exports
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
class Calculator { /* ... */ }

module.exports = { add, subtract, Calculator };

// অথবা shorthand
exports.add = add;
exports.subtract = subtract;
```

### What is the difference between `module.exports` and `exports`?
```javascript
// exports হলো module.exports এর একটি reference (shorthand)
console.log(exports === module.exports); // true (initially)

// ✅ SAFE — exports এ property যোগ
exports.greet = () => 'Hello';  // module.exports.greet = ...

// ❌ DANGER — exports reassign করলে reference ভেঙে যায়
exports = { greet: () => 'Hello' }; // এটি কাজ করবে না!

// ✅ CORRECT — function/object সরাসরি export করতে module.exports ব্যবহার করুন
module.exports = { greet: () => 'Hello' };
module.exports = class MyClass { };
```

---

## 13. What is the Node Package Manager (npm), and how does it work?

**npm** হলো Node.js এর default package manager। `package.json` দেখে dependency install করে `node_modules` এ রাখে।

### What is the difference between `npm install` and `npm ci`?
| | `npm install` | `npm ci` |
|---|---|---|
| **ব্যবহার** | Development | CI/CD pipeline |
| **`package-lock.json`** | Update করতে পারে | Must exist, exact version install |
| **Speed** | কম | বেশি (fresh install, no update) |
| **Behavior** | Missing package install করে | Lock file থেকে exact install |

### What does `npm install --save-exact` do?
```bash
npm install lodash --save-exact
# package.json: "lodash": "4.17.21"  (no ^ or ~)
# সবসময় exact এই version install হবে
```

### What is the purpose of `package-lock.json` and why should it be committed?
- **কী করে:** সব dependency এর exact version, download URL এবং integrity hash লক করে।
- **কেন commit করবেন:** Team এর সবাই এবং CI server exactly একই version পাবে।
- **না করলে:** আপনার machine এ কাজ করে, CI তে করে না — "works on my machine" সমস্যা।

---

## 14. What is a `package.json` file, and what are its key fields?

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My Node.js app",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### How do you manage `dependencies` vs `devDependencies` correctly?
- **dependencies:** Production এ দরকার — `express`, `mongoose`, `jsonwebtoken`।
- **devDependencies:** শুধু development এ — `jest`, `nodemon`, `eslint`, `typescript`।
- Production deploy: `npm install --production` → devDependencies skip।

### What is the `scripts` field and how do you chain npm scripts?
```json
"scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "build:start": "npm run build && npm run start",
    "test:watch": "jest --watch",
    "pretest": "npm run lint"  // test এর আগে আপনাআপনি চলে
}
```

---

## 15. What is the difference between `dependencies` and `peerDependencies`?

| ধরন | অর্থ | উদাহরণ |
|---|---|---|
| **dependencies** | Package নিজে install করবে | express, mongoose |
| **devDependencies** | শুধু development এ | jest, typescript |
| **peerDependencies** | Host app কে install করতে হবে | react-dom (React এর) |
| **optionalDependencies** | না থাকলেও চলবে | fsevents (MacOS only) |

### What happens if a peer dependency is not installed?
```bash
npm install react-beautiful-dnd
# Warning: "react-beautiful-dnd" has a peer dependency "react@>=16"
# npm v7+: automatically install করে
# npm v6: warning মাত্র — manually install করতে হবে
```

---

## 16. How does Node.js handle module caching?

`require()` প্রথমবার module load করে **`require.cache`** object এ store করে। পরের বার একই module require করলে disk থেকে না পড়ে cache থেকে দেয়।

```javascript
// Module caching = Singleton behavior
const db = require('./database'); // প্রথমবার load → connection তৈরি
const db2 = require('./database'); // Cache থেকে → same connection object
console.log(db === db2); // true
```

### How can you bypass module caching in development?
```javascript
// Cache invalidate করে reload (hot reloading)
function freshRequire(modulePath) {
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
}
const config = freshRequire('./config'); // Fresh load
```

### What are the implications of module caching on singleton patterns?
- Database connection, Logger instance — একবার তৈরি হলে cache এ থাকে।
- সব module এ `require('./db')` করলে same connection পাওয়া যায় — singleton।

---

## 17. What is Yarn, and how does it differ from npm?

| বৈশিষ্ট্য | npm (v7+) | Yarn (Classic) | pnpm |
|---|---|---|---|
| **Lock file** | package-lock.json | yarn.lock | pnpm-lock.yaml |
| **Speed** | ভালো | ভালো | সবচেয়ে দ্রুত |
| **Disk usage** | প্রতিটি project এ copy | প্রতিটি project এ copy | Symlink — shared store |
| **Workspaces** | আছে | আছে | আছে |

### What is pnpm and how does it differ from both Yarn and npm in disk usage?
- **pnpm:** Package গুলো global content-addressable store এ রাখে, project এ symlink দেয়।
- ১০টি project এ `express@4.18` থাকলে — npm/yarn: ১০ copy। pnpm: ১ copy শুধু।
- **Disk savings:** অনেক বড় — monorepo তে বিশেষত কার্যকর।

---

## 18. What is the purpose of the `node_modules` folder?

`node_modules` হলো সব installed dependency রাখার folder। npm `package.json` এর dependency দেখে এখানে install করে।

```
node_modules/
├── express/
├── lodash/
├── .bin/          ← CLI tools (nodemon, jest)
└── ...
```

### How do you optimize `node_modules` size in production?
```bash
# শুধু production dependency install
npm install --production
# বা
npm ci --omit=dev

# Unused packages মুছুন
npm prune --production
```

### What is the problem with deeply nested `node_modules` and how did npm v3+ fix it?
- npm v2: A → B → C → নেস্টেড ফোল্ডার। Windows path limit (260 chars) ছাড়িয়ে যেত।
- npm v3+: **Flat structure** — সব package root `node_modules` এ।

---

## 19. How do you create a custom Node.js module?

```javascript
// math.js
const PI = 3.14159;

function circle(radius) {
    return PI * radius ** 2;
}

function rectangle(width, height) {
    return width * height;
}

module.exports = { circle, rectangle, PI };
```

### How do you publish a module to the npm registry?
```bash
# ১. npm login
npm login

# ২. package.json এ name, version, main, description fill করুন

# ৩. Publish
npm publish

# Scoped package (private by default):
npm publish --access public  # @myorg/mypackage
```

### What is semantic versioning (semver) and how does it apply to npm packages?
```
MAJOR.MINOR.PATCH  →  1.4.2

MAJOR: Breaking changes (old code কাজ করবে না)
MINOR: New features, backward compatible
PATCH: Bug fixes, backward compatible

package.json ranges:
"^1.4.2"  → >=1.4.2 <2.0.0  (minor/patch update ok)
"~1.4.2"  → >=1.4.2 <1.5.0  (patch update only)
"1.4.2"   → exactly 1.4.2
```

---

## 20. What is the difference between global and local npm packages?

| | Local | Global |
|---|---|---|
| **Install** | `npm install package` | `npm install -g package` |
| **Location** | `./node_modules/` | System path (`/usr/local/lib/`) |
| **কখন ব্যবহার** | Project dependency | CLI tools (forever, nodemon) |
| **Recommended** | বেশিরভাগ ক্ষেত্রে | শুধু CLI tools |

### What is `npx` and how does it avoid the need for global installs?
```bash
# Global install না করে একবার চালান
npx create-react-app my-app
npx prisma migrate dev
npx ts-node script.ts

# package.json এর scripts এর মতোই — local node_modules/.bin/ থেকে চালায়
npx jest  # == ./node_modules/.bin/jest
```

### How do you manage multiple global Node.js versions with tools like `nvm` or `volta`?
```bash
# nvm (Node Version Manager)
nvm install 20       # Node 20 install
nvm use 20           # Switch to Node 20
nvm alias default 18 # Default version সেট করুন

# .nvmrc file — project root এ
echo "20" > .nvmrc
nvm use              # .nvmrc থেকে version নেবে

# volta — faster, project-level pinning
volta install node@20
volta pin node@20    # package.json এ pin করে
```
