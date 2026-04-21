---
sidebar_position: 1
title: ''
---

## 15. `dependencies` আর `peerDependencies`-এর পার্থক্য কী?

**`dependencies`** হলো সেইসব package যেগুলো তোমার project runtime-এ সরাসরি দরকার হয়। যেমন `express`, `react` ইত্যাদি। `npm install` করলে এগুলো তোমার `node_modules`-এ install হয়।

**`peerDependencies`** হলো এমন package যেগুলো তোমার library বা plugin-এর জন্য দরকার, কিন্তু তুমি চাও সেগুলো **host project** নিজে install করুক — তুমি করবে না। উদাহরণ: তুমি একটা React component library বানাচ্ছো। তুমি `react`-কে `peerDependency` হিসেবে রাখবে, কারণ user-এর project-এ React আলরেডি থাকবে — দুইটা আলাদা copy থাকলে conflict হবে।

```json
// তোমার library-র package.json
{
  "peerDependencies": {
    "react": ">=17.0.0"
  }
}
```

### Peer dependency install না হলে কী হয়?

**npm v7+** এ peer dependency automatically install হয়। কিন্তু আগের version-এ বা যদি manually skip করা হয়:
- Warning বা error দেখাবে
- Runtime-এ `Module not found` error আসতে পারে
- Unexpected behavior হতে পারে কারণ সঠিক version পাচ্ছে না

---

## 17. Yarn কী, এবং npm থেকে কীভাবে আলাদা?

**Yarn** হলো Facebook-এর তৈরি একটি alternative package manager, যেটা npm-এর কিছু সমস্যা সমাধানের জন্য আনা হয়েছিল।

| বিষয় | npm | Yarn |
|---|---|---|
| **Speed** | তুলনামূলক ধীর (আগে) | Parallel install করে, তাই দ্রুত |
| **Lock file** | `package-lock.json` | `yarn.lock` |
| **Offline cache** | সীমিত | শক্তিশালী offline cache |
| **Workspaces** | আছে | আগে থেকেই mature support |
| **Security** | npm audit | Checksum verification |

Yarn-এর `yarn.lock` file exact versions lock করে রাখে, ফলে যেকোনো machine-এ same dependency tree পাওয়া যায়। আধুনিক npm-ও এখন অনেক কাছাকাছি এসে গেছে, কিন্তু Yarn-এর **Plug'n'Play (PnP)** mode `node_modules` ছাড়াই কাজ করতে পারে — এটা একটা বড় পার্থক্য।

---

## 18. `node_modules` folder-এর কাজ কী?

`node_modules` হলো সেই folder যেখানে তোমার project-এর সব installed dependency-গুলো রাখা হয়। `npm install` দিলে `package.json`-এ listed সব package এখানে download হয়।

এটা usually `.gitignore`-এ রাখা হয়, কারণ এটা অনেক বড় হয় এবং যে কেউ `npm install` দিয়ে recreate করতে পারে।

### Production-এ `node_modules` size কীভাবে optimize করবে?

কয়েকটা কার্যকর উপায়:

**১. শুধু production dependency install করো:**
```bash
npm install --omit=dev
# অথবা আগের syntax
npm install --production
```

**২. `devDependencies` সঠিকভাবে আলাদা রাখো** — testing tools, bundler, linter এগুলো `devDependencies`-এ রাখো, `dependencies`-এ না।

**৩. Bundle করো** — Webpack, esbuild, Rollup ব্যবহার করে সব code একটা optimized file-এ নিয়ে আসো, তাহলে production-এ `node_modules` আর লাগে না।

**৪. `npm prune`** — unnecessary package remove করে।

**৫. Package audit করো** — `depcheck` দিয়ে unused dependency খুঁজে বের করো।

---

### Deeply nested `node_modules`-এর সমস্যা কী ছিল, এবং npm v3+ কীভাবে ঠিক করলো?

**পুরনো সমস্যা (npm v1/v2):**

npm আগে dependency-গুলো nested করে রাখত। মানে:

```
node_modules/
  package-A/
    node_modules/
      lodash@3.0/
  package-B/
    node_modules/
      lodash@3.0/    ← same package, duplicate!
        node_modules/
          package-C/
            node_modules/
              ...     ← আরো গভীর!
```

এতে দুটো বড় সমস্যা হতো:
- **Duplicate packages** — same package বারবার install হতো, size বিশাল হয়ে যেত
- **Windows path limit** — Windows-এ maximum path length `260 characters`, কিন্তু deeply nested `node_modules` সেটা পার হয়ে যেত, ফলে file কাজ করত না

**npm v3+ এর সমাধান — Flat installation:**

npm v3 থেকে **hoisting** চালু হলো। সব package যতটা সম্ভব top-level `node_modules`-এ রাখা হয়:

```
node_modules/
  lodash@3.0/     ← একটাই copy, সবাই share করে
  package-A/
  package-B/
  package-C/
```

শুধুমাত্র **version conflict** হলে nested রাখে:

```
node_modules/
  lodash@4.0/       ← package-A এর জন্য (top-level)
  package-A/
  package-B/
    node_modules/
      lodash@3.0/   ← package-B এর আলাদা version দরকার, তাই nested
```

এতে duplication কমে, path ছোট থাকে, এবং performance ভালো হয়।উপরের diagram-এ দেখতে পাচ্ছো npm v1/v2-তে `lodash` দুইবার install হচ্ছে, কিন্তু npm v3+-এ একবারই top-level-এ রাখা হয়েছে এবং সবাই সেটা share করছে।