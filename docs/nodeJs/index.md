# Node.js Interview Questions


## 1. Core Concepts and Architecture

1. **What is Node.js, and what makes it different from other server-side technologies?**
   - How does Node.js's single-threaded nature impact its performance under high concurrency?
   - What kind of workloads is Node.js NOT well-suited for, and why?
   - How does Node.js compare to Go or Rust for backend services?

2. **What is the event loop in Node.js?**
   - Can you explain the phases of the event loop in detail (timers, I/O, idle, poll, check, close)?
   - What is the difference between the microtask queue and the macrotask queue?
   - How do `process.nextTick` and `Promise.resolve` interact with the event loop phases?

3. **What is the difference between synchronous and asynchronous code in Node.js?**
   - How do you handle CPU-intensive synchronous tasks without blocking the event loop?
   - What happens to other requests while a synchronous operation is running?
   - How do you offload synchronous work to Worker Threads?

4. **What is the role of V8 in Node.js?**
   - How does V8 optimize JavaScript execution using JIT compilation?
   - What is hidden class optimization in V8 and how does it affect performance?
   - What is the difference between V8's "young generation" and "old generation" memory spaces?

5. **What are the benefits of using Node.js for backend development?**
   - When would you choose Node.js over Django, Spring, or Laravel?
   - How does sharing code between frontend and backend (isomorphic JS) benefit a team?
   - What is the npm ecosystem's role in Node.js's popularity?

6. **What is the difference between Node.js and traditional multi-threaded servers?**
   - How does Node.js handle concurrency without threads using the event loop?
   - What is the C10K problem and how does Node.js address it?
   - What are the downsides of the single-threaded model (e.g., unhandled exceptions crashing the process)?

7. **What is a REPL in Node.js?**
   - How do you use the Node.js REPL for quick debugging and prototyping?
   - How do you load a module or file into the REPL session?
   - What is the `_` variable in the REPL and what does it store?

8. **What is the purpose of the `process` object in Node.js?**
   - How do you access environment variables using `process.env`?
   - What is `process.argv` and how do you use it to parse CLI arguments?
   - How do you gracefully shut down a Node.js process using `process.exit` and signal handlers?

9. **What are streams in Node.js, and why are they useful?**
   - What are the four types of streams (Readable, Writable, Duplex, Transform)?
   - Can you give an example of using a Transform stream to compress data on the fly?
   - What is backpressure in streams and how do you handle it?

10. **What is the difference between Node.js's CommonJS and ES Modules?**
    - How do you migrate a CommonJS project to ES Modules?
    - What is the difference between `require()` (synchronous) and `import` (asynchronous evaluation)?
    - How do you use ES Modules in Node.js without a bundler (`.mjs`, `"type": "module"`)?

---

## 2. Modules and Packages

11. **What is the `require` function in Node.js?**
    - How does `require` resolve module paths (node_modules lookup, relative paths, core modules)?
    - What happens if `require` cannot find a module?
    - How does `require` differ from dynamic `import()` in ES Modules?

12. **What is the purpose of `module.exports`?**
    - How do you export multiple functions or classes from a module?
    - What is the difference between `module.exports` and `exports`?
    - What happens if you reassign `exports` directly instead of `module.exports`?

13. **What is the Node Package Manager (npm), and how does it work?**
    - What is the difference between `npm install` and `npm ci`?
    - What does `npm install --save-exact` do and when would you use it?
    - What is the purpose of `package-lock.json` and why should it be committed?

14. **What is a `package.json` file, and what are its key fields?**
    - How do you manage `dependencies` vs `devDependencies` correctly?
    - What is the `engines` field and how does it enforce Node.js version requirements?
    - What is the `scripts` field and how do you chain npm scripts?

15. **What is the difference between `dependencies` and `peerDependencies`?**
    - When would you use `optionalDependencies`?
    - What happens if a peer dependency is not installed?
    - What is `bundledDependencies` and when is it used?

16. **How does Node.js handle module caching?**
    - How can you bypass module caching in development (delete from `require.cache`)?
    - What are the implications of module caching on singleton patterns?
    - How does module caching behave differently with ES Modules vs CommonJS?

17. **What is Yarn, and how does it differ from npm?**
    - What is the advantage of Yarn's Plug'n'Play (PnP) feature?
    - How does Yarn workspaces help manage monorepos?
    - What is pnpm and how does it differ from both Yarn and npm in disk usage?

18. **What is the purpose of the `node_modules` folder?**
    - How do you optimize `node_modules` size in production (pruning, `npm prune --production`)?
    - What is the problem with deeply nested `node_modules` and how did npm v3+ fix it?
    - What is the `.npmrc` file and what configurations can it hold?

19. **How do you create a custom Node.js module?**
    - How do you publish a module to the npm registry?
    - What is semantic versioning (semver) and how does it apply to npm packages?
    - How do you create a scoped package (e.g., `@myorg/mypackage`)?

20. **What is the difference between global and local npm packages?**
    - When would you install a package globally vs locally?
    - What is `npx` and how does it avoid the need for global installs?
    - How do you manage multiple global Node.js versions with tools like `nvm` or `volta`?

---

## 3. Asynchronous Programming

21. **What are callbacks in Node.js, and what is callback hell?**
    - How do you avoid callback hell using Promises or `async/await`?
    - What is the error-first callback convention and why is it used?
    - How do you convert a callback-based library to Promises using `util.promisify`?

22. **What are Promises in Node.js, and how do they work?**
    - How do you handle Promise rejections globally using `process.on('unhandledRejection')`?
    - What is Promise chaining and what are its pitfalls?
    - What is the difference between `Promise.resolve()` and `new Promise(resolve => resolve())`?

23. **What is `async/await`, and how does it simplify asynchronous code?**
    - How do you handle errors in `async/await` using `try/catch`?
    - What happens if you forget the `await` keyword before a Promise?
    - How do you run multiple async operations in parallel using `async/await`?

24. **What is the difference between `setTimeout`, `setInterval`, and `setImmediate`?**
    - When would you use `setImmediate` over `setTimeout(fn, 0)`?
    - How do you cancel a `setInterval` and why is it important to do so?
    - What is `queueMicrotask` and how does it differ from `setImmediate`?

25. **What is the `async` module, and when is it useful?**
    - How does `async.waterfall` compare to native Promise chaining?
    - What is `async.parallel` and `async.series` and when do you use each?
    - How does the `async` module compare to native `Promise.all`?

26. **How do you handle parallel asynchronous operations in Node.js?**
    - What is the difference between `Promise.all` and `Promise.allSettled`?
    - What is `Promise.race` and when is it useful?
    - How do you limit concurrency when running many async operations in parallel (e.g., `p-limit`)?

27. **What is an EventEmitter in Node.js?**
    - How do you create a custom EventEmitter class?
    - What is the `once` method vs `on` on an EventEmitter?
    - What is a memory leak risk with EventEmitters and how do you detect it (`maxListeners`)?

28. **How do you handle uncaught exceptions in asynchronous code?**
    - What is the role of `process.on('uncaughtException')` and when should you use it?
    - What is the difference between `uncaughtException` and `unhandledRejection`?
    - Why is it dangerous to continue running after an `uncaughtException`?

29. **What are async hooks in Node.js?**
    - How can async hooks be used for performance monitoring and request tracing?
    - What is `AsyncLocalStorage` and how does it replace async hooks for context propagation?
    - What is the performance overhead of enabling async hooks?

30. **How do you convert callback-based code to Promises?**
    - What is the `util.promisify` function and how does it work?
    - How do you manually wrap a callback function in a Promise?
    - How do you handle callbacks that call `callback(result)` instead of `callback(err, result)`?

---


## 6. Performance and Optimization

51. **How do you optimize a Node.js application for performance?**
    - What tools do you use to profile a Node.js app (`--prof`, `clinic.js`, `0x`)?
    - What is flame graph analysis and how do you read one?
    - How do you identify and resolve hot code paths?

52. **What is clustering in Node.js, and how does it improve performance?**
    - How do you manage inter-process communication (IPC) in clusters?
    - How does the cluster module distribute incoming connections across workers?
    - What is the difference between clustering and using Worker Threads?

53. **What is the `pm2` process manager, and how does it help?**
    - How do you configure `pm2` for zero-downtime deployments (`pm2 reload`)?
    - How do you use `pm2` in cluster mode vs fork mode?
    - How do you monitor memory and CPU usage with `pm2 monit`?

54. **How do you implement caching in Node.js?**
    - What is the difference between in-memory caching and Redis caching?
    - How do you implement cache-aside pattern in a Node.js API?
    - What is cache invalidation and what strategies exist (TTL, event-driven)?

55. **What is the Worker Threads module, and when is it useful?**
    - How do Worker Threads differ from child processes in terms of memory and communication?
    - How do you share memory between Worker Threads using `SharedArrayBuffer`?
    - What types of tasks are best suited for Worker Threads (CPU-bound work)?

56. **How do you handle memory leaks in Node.js?**
    - What tools help identify memory leaks (`node --inspect`, `heapdump`, `clinic.js`)?
    - What are the most common causes of memory leaks in Node.js (global variables, event listeners, closures)?
    - How do you take and analyze a heap snapshot?

57. **What is the purpose of the `--max-old-space-size` flag?**
    - How do you determine the right memory limit for your Node.js process?
    - What happens when Node.js exceeds its memory limit?
    - How do you monitor heap usage in production?

58. **How do you scale a Node.js application horizontally?**
    - What is the role of a load balancer (Nginx, AWS ALB) in horizontal scaling?
    - What is sticky session and when is it needed for stateful Node.js apps?
    - How do you handle session sharing across multiple Node.js instances using Redis?

59. **What is stream piping, and how does it improve performance?**
    - How do you pipe a file read stream directly to an HTTP response?
    - What happens if the writable stream errors during piping?
    - What is the difference between `pipe` and `pipeline` in Node.js streams?

60. **How do you optimize database queries in Node.js?**
    - What is query batching and how does it reduce database round trips?
    - How do you use database connection pooling to improve throughput?
    - What is the N+1 query problem and how do you solve it in Node.js?

---



## 9. Microservices

81. **How do you implement microservices in Node.js?**
    - What communication protocols work best (REST, gRPC, message queues)?
    - How do you handle service versioning in a microservices architecture?
    - What is the single responsibility principle applied to microservice design?

82. **What is a message broker, and how do you use it in Node.js?**
    - How does RabbitMQ compare to Kafka for Node.js microservices?
    - How do you use `amqplib` to publish and consume messages from RabbitMQ?
    - What is at-least-once delivery and how do you handle message idempotency?

83. **How do you handle service discovery in Node.js microservices?**
    - What tools support service discovery (Consul, Kubernetes DNS, Eureka)?
    - What is the difference between client-side and server-side service discovery?
    - How do you implement health checks for service discovery?

84. **What is an API Gateway, and how do you implement it in Node.js?**
    - How does an API Gateway improve security (auth, rate limiting, input validation)?
    - What is the BFF (Backend for Frontend) pattern?
    - What are the trade-offs of a custom Node.js API gateway vs managed solutions (AWS API Gateway)?

85. **How do you monitor microservices in Node.js?**
    - What metrics are most important to track (request rate, error rate, latency)?
    - How do you implement distributed tracing with OpenTelemetry in Node.js?
    - What is a correlation ID and how do you propagate it across services?

86. **What is the circuit breaker pattern and how do you implement it in Node.js?**
    - What are the three states of a circuit breaker (closed, open, half-open)?
    - How does the `opossum` library implement circuit breaking in Node.js?
    - What is the retry pattern and how do you combine it with a circuit breaker?

87. **How do you implement gRPC in Node.js?**
    - What is Protocol Buffers (protobuf) and how do you define a `.proto` file?
    - How does gRPC compare to REST for inter-service communication in Node.js?
    - What are the four types of gRPC communication (unary, server streaming, client streaming, bidirectional)?

88. **How do you handle distributed transactions in Node.js microservices?**
    - What is the SAGA pattern and how do you implement choreography vs orchestration?
    - What is a compensating transaction?
    - How do you handle partial failures in a distributed transaction?

89. **How do you implement event-driven architecture in Node.js?**
    - What is event sourcing and how does it differ from CRUD?
    - How do you use Kafka with Node.js for event streaming?
    - What is CQRS (Command Query Responsibility Segregation) and when is it applicable?

90. **How do you secure inter-service communication in Node.js microservices?**
    - What is mutual TLS (mTLS) and how do you implement it between Node.js services?
    - How do you use API keys or service tokens for internal service authentication?
    - What is a service mesh (Istio, Linkerd) and when would you use one?

---

## 11. Advanced Topics

97. **What is the `child_process` module, and when is it useful?**
    - What is the difference between `fork`, `spawn`, `exec`, and `execFile`?
    - How do you communicate between parent and child processes using IPC?
    - What are the security risks of using `exec` with user input?

98. **What is the `fs` module, and how do you use it?**
    - How do you handle large file reads without loading the entire file into memory?
    - What is the difference between `fs.readFile` and `fs.createReadStream`?
    - How do you watch files for changes using `fs.watch` or `chokidar`?

99. **What is the `http` module in Node.js?**
    - How do you create a custom HTTP server without Express?
    - How do you manually parse request body in a raw HTTP server?
    - What is the difference between `http.Server` and `https.Server`?

100. **What is the `crypto` module, and how do you use it?**
     - How do you generate secure random tokens for password reset links?
     - What is HMAC and how do you use it for request signing?
     - What is the difference between `crypto.createHash` and `crypto.createHmac`?

101. **What is the `zlib` module, and when is it useful?**
     - How do you compress HTTP responses using gzip or Brotli in Express?
     - What is the trade-off between compression level and CPU usage?
     - How do you pipe a file through `zlib` for on-the-fly compression?

102. **What is the `net` module in Node.js?**
     - How do you create a raw TCP server using the `net` module?
     - What is the difference between a TCP socket and a WebSocket?
     - When would you use the `net` module directly instead of HTTP?

103. **What are Buffers in Node.js?**
     - What is the difference between a Buffer and a regular JavaScript array?
     - How do you convert between Buffers and strings with different encodings?
     - What is a zero-copy operation and how do Buffers enable it?

104. **What is the `cluster` module and how does it work internally?**
     - How does the master process distribute connections to workers?
     - What happens when a cluster worker crashes — does the master restart it automatically?
     - How do you share state between cluster workers (you generally cannot — how do you work around it)?

105. **What are native addons in Node.js (N-API)?**
     - When would you write a native C++ addon for Node.js?
     - What is N-API and how does it provide ABI stability across Node.js versions?
     - What is `node-gyp` and what does it do?

---


## 13. TypeScript with Node.js

114. **Why use TypeScript with Node.js?**
     - What are the main benefits of TypeScript in a Node.js backend (type safety, IDE support, refactoring)?
     - What are the trade-offs (compilation step, learning curve, type definition maintenance)?
     - How does TypeScript catch bugs at compile time that JavaScript would only catch at runtime?

115. **How do you set up a Node.js project with TypeScript?**
     - What are the key `tsconfig.json` options for a Node.js backend (`target`, `module`, `strict`, `outDir`)?
     - What is the difference between `ts-node` and compiling with `tsc` for production?
     - How do you use `ts-node-dev` for hot reloading during development?

116. **What are TypeScript types and interfaces, and how do you use them in Node.js?**
     - What is the difference between `type` and `interface` in TypeScript?
     - How do you type Express `Request` and `Response` objects with custom properties?
     - What is a generic type and when would you use one in a Node.js backend?

117. **How do you handle TypeScript declaration files (`.d.ts`)?**
     - What is `@types/node` and why do you need it?
     - How do you install type definitions for third-party packages (`@types/express`)?
     - What do you do when a package has no type definitions available?

118. **What are decorators in TypeScript and how are they used in Node.js?**
     - How do decorators work in frameworks like NestJS (`@Controller`, `@Injectable`)?
     - What is the difference between experimental decorators and the TC39 decorator proposal?
     - How do you write a custom class decorator?

119. **What is NestJS and how does it use TypeScript?**
     - How does NestJS's module system organize application code?
     - What is dependency injection in NestJS and how does it work?
     - How does NestJS compare to Express for large TypeScript backend projects?

120. **How do you enforce strict TypeScript in a Node.js project?**
     - What does `"strict": true` enable in `tsconfig.json`?
     - What is `noImplicitAny` and why is it important?
     - How do you handle `any` types when integrating with untyped third-party code?

121. **How do you type asynchronous code in TypeScript?**
     - How do you type a function that returns a `Promise<T>`?
     - What is `Awaited<T>` utility type and when do you use it?
     - How do you type error handling in `async/await` with TypeScript?

122. **How do you migrate an existing Node.js JavaScript project to TypeScript?**
     - What is the `allowJs` flag and how does it enable gradual migration?
     - What is `checkJs` and how does it add type checking to `.js` files?
     - What is the recommended incremental migration strategy (file by file vs all at once)?

---

## 15. Authentication and Authorization

133. **What is the difference between authentication and authorization?**
     - What is the difference between session-based auth and token-based auth?
     - What is the difference between OAuth 2.0 (authorization) and OpenID Connect (authentication)?
     - How do you implement role-based access control (RBAC) in a Node.js API?

134. **How do you implement JWT authentication in Node.js?**
     - What are the three parts of a JWT (header, payload, signature)?
     - How do you verify and decode a JWT using `jsonwebtoken`?
     - What is the difference between `jwt.sign` with a secret vs an RSA private key?

135. **What is OAuth 2.0 and how do you implement it in Node.js?**
     - What are the OAuth 2.0 grant types (authorization code, client credentials, implicit, device)?
     - How do you implement the authorization code flow with PKCE in Node.js?
     - How do you use Passport.js to handle OAuth 2.0 strategies?

136. **What is Passport.js and how does it work?**
     - What is a Passport strategy and how do you configure one (Local, JWT, Google OAuth)?
     - How does `passport.initialize()` and `passport.session()` work in Express?
     - How do you serialize and deserialize a user with Passport sessions?

137. **How do you implement refresh token rotation in Node.js?**
     - What is refresh token rotation and why does it improve security?
     - How do you store refresh tokens securely (database, httpOnly cookie)?
     - How do you detect and handle refresh token reuse attacks?

138. **What is session management in Node.js and how do you implement it securely?**
     - How does `express-session` work and where should sessions be stored (Redis, database)?
     - What is session fixation and how do you prevent it?
     - What is the difference between a session cookie and a persistent cookie?

139. **What is RBAC (Role-Based Access Control) and how do you implement it?**
     - How do you attach roles to a JWT payload and enforce them in middleware?
     - What is the difference between RBAC and ABAC (Attribute-Based Access Control)?
     - How do you implement resource-level permissions (user can only edit their own posts)?

140. **What is multi-factor authentication (MFA) and how do you implement it in Node.js?**
     - How do you implement TOTP (Time-based One-Time Password) using `speakeasy` or `otplib`?
     - How do you generate and validate backup codes for MFA recovery?
     - What is WebAuthn and how does it enable passwordless authentication?

141. **How do you implement social login (Google, GitHub) in a Node.js application?**
     - How does Passport.js `GoogleStrategy` work step by step?
     - How do you link a social account to an existing email/password account?
     - What user data do you store after a successful OAuth login?

142. **How do you protect API endpoints from unauthorized access?**
     - How do you write an authentication middleware that validates JWTs on every protected route?
     - What is API key authentication and when is it appropriate vs JWT?
     - How do you implement IP whitelisting for internal APIs?

---


## 17. Scenario-Based and Behavioral Questions

151. **Describe a challenging Node.js project you worked on.**
     - What was the most difficult technical issue and how did you resolve it?
     - What would you do differently if you started that project today?
     - What Node.js-specific constraints shaped your architectural decisions?

152. **How would you debug a Node.js application crashing in production?**
     - What steps do you take first — logs, metrics, or traces?
     - How do you use `node --inspect` or `clinic.js` to diagnose the crash?
     - What steps do you implement to prevent future crashes (process manager, error monitoring)?

153. **What would you do if a Node.js API is slow to respond?**
     - How do you identify whether the bottleneck is CPU, I/O, database, or external API?
     - What profiling tools do you reach for first?
     - How do you prioritize and implement optimization tasks?

154. **How do you ensure code quality in a Node.js project?**
     - How do you configure ESLint and Prettier for a Node.js/TypeScript project?
     - How do you enforce code standards in CI (failing builds on lint errors)?
     - What is a pre-commit hook and how do you set one up with `husky` and `lint-staged`?

155. **How do you handle a memory leak in a Node.js application?**
     - What symptoms indicate a memory leak in production (growing heap, OOM restarts)?
     - What tools do you use to diagnose memory leaks (`heapdump`, Chrome DevTools, `clinic.js`)?
     - Walk me through a real or hypothetical memory leak investigation step by step.

156. **How do you onboard a new developer to a Node.js project?**
     - What documentation is critical for a Node.js project (README, API docs, architecture diagrams)?
     - How do you use Docker Compose to make local setup a single command?
     - How do you share coding standards and patterns with new team members?

157. **What would you do if a third-party package breaks your application after an update?**
     - How do you identify which package caused the regression?
     - How do you pin package versions and set up `npm audit` in CI?
     - How do you evaluate whether to replace a package vs patch it?

158. **How do you stay updated with Node.js advancements?**
     - What resources do you rely on (Node.js changelog, NodeWeekly, official blog)?
     - How do you evaluate whether to adopt a new Node.js feature in production?
     - How do you manage Node.js version upgrades across a team?

159. **Describe a time you optimized a Node.js application.**
     - What metrics did you use to measure success (p99 latency, throughput, error rate)?
     - What was the biggest single win and what was the approach?
     - How did you validate the optimization did not introduce regressions?

160. **How do you collaborate with frontend developers on a Node.js backend?**
     - How do you handle API contract changes without breaking the frontend?
     - How do you use tools like OpenAPI/Swagger or GraphQL schema to document your API?
     - How do you involve frontend developers in API design decisions early?
