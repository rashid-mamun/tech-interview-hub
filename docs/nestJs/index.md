---
sidebar_position: 1
title: NestJS
description: Study NestJS interview questions covering modules, dependency injection, controllers, providers, pipes, guards, interceptors, testing, and microservices.
keywords: [NestJS interview questions, NestJS interview guide, dependency injection interview, NestJS backend interview]
---

# NestJS Interview Questions

NestJS interview-এ decorator বা CLI command মুখস্থ করার চেয়ে request lifecycle এবং dependency graph বোঝা বেশি গুরুত্বপূর্ণ। Module boundary, dependency injection, validation, guards, interceptors, persistence, testing ও deployment কীভাবে একসঙ্গে কাজ করে—এই question bank সেই reasoning practice করায়।

## How to use this question bank

1. Core concepts, modules, controllers এবং dependency injection আগে শেষ করুন।
2. একটি request middleware থেকে pipe, guard, interceptor, handler ও exception filter পর্যন্ত trace করুন।
3. Authentication, database ও microservice প্রশ্নে security এবং failure behavior উল্লেখ করুন।
4. প্রতিটি design answer testability, coupling এবং operational cost দিয়ে evaluate করুন।

> **150+ core questions · 420+ follow-up questions · 20 topics**
> Fixed all bugs, added 7 missing topics, expanded all thin sections, 2–3 follow-ups per question.

---


---

## 1. Core Concepts and Architecture

1. **What is NestJS, and what problems does it solve?**
   - How does NestJS's architecture compare to Angular's (modules, DI, decorators)?
   - What pain points of raw Express does NestJS address (structure, testability, scalability)?
   - Who are the typical teams that benefit most from adopting NestJS?

2. **How does NestJS leverage TypeScript?**
   - What specific TypeScript features (decorators, metadata reflection, generics) improve NestJS development?
   - How does `emitDecoratorMetadata` in `tsconfig.json` enable NestJS's dependency injection?
   - What happens if you try to use NestJS with plain JavaScript?

3. **What is the architectural style of NestJS?**
   - How does NestJS combine OOP, functional programming, and reactive programming?
   - How does NestJS enforce a layered architecture (controllers, services, repositories)?
   - What is the NestJS request pipeline from incoming HTTP request to outgoing response?

4. **What are the main components of a NestJS application?**
   - What is the role of each building block: modules, controllers, providers, guards, interceptors, pipes, and filters?
   - Which component is most critical for scalability and why?
   - How do these components map to the responsibilities in a clean architecture?

5. **How does NestJS differ from Express or Fastify?**
   - When would you choose Fastify as the underlying HTTP adapter over Express in NestJS?
   - What is the NestJS platform abstraction and how do you swap the underlying HTTP driver?
   - What does NestJS add on top of Express that Express does not provide out of the box?

6. **What is the role of the `@nestjs/core` package?**
   - What key classes does `@nestjs/core` export (NestFactory, Reflector, ContextIdFactory)?
   - Can you name a scenario where you interact directly with `@nestjs/core` beyond bootstrapping?
   - What is `NestFactory.createMicroservice` and how does it differ from `NestFactory.create`?

7. **What is the difference between monolithic and microservices architecture in NestJS?**
   - What challenges arise when transitioning a NestJS monolith to microservices?
   - How does NestJS support both patterns without requiring a full rewrite?
   - What is a hybrid NestJS application and when would you use one?

8. **How does NestJS support both REST and GraphQL APIs?**
   - How do you run both a REST controller and a GraphQL resolver in the same NestJS application?
   - What are the trade-offs between REST and GraphQL for large-scale NestJS backends?
   - How do you share DTOs and validation logic between REST and GraphQL in NestJS?

9. **What is the purpose of the Nest CLI?**
   - How does the CLI improve development workflows (generating resources, running schematics)?
   - What is a NestJS schematic and how do you create a custom one?
   - How do you generate a complete CRUD resource with a single CLI command?

10. **What are the benefits of using NestJS for enterprise applications?**
    - How does NestJS ensure maintainability in large teams (enforced structure, testability)?
    - What is the role of the NestJS monorepo support for large codebases?
    - How does NestJS's opinionated structure reduce decision fatigue compared to raw Express?

---

## 2. Modules

11. **What is a module in NestJS, and how is it defined?**
    - How do you decide what components (providers, controllers) belong in a given module?
    - What is the difference between a feature module and a shared module?
    - What is the root module (`AppModule`) and what is its special role in bootstrapping?

12. **What are the `imports`, `exports`, `providers`, and `controllers` arrays in a module decorator?**
    - What happens if you add a provider to `providers` but forget to add it to `exports`?
    - When should you put a provider in `exports` vs keeping it private to the module?
    - What is the difference between importing a module and importing a provider directly?

13. **What is a dynamic module, and when would you use it?**
    - What is the difference between `forRoot` and `forFeature` in dynamic modules?
    - Can you give a real-world example of a dynamic module (e.g., `ConfigModule.forRoot`, `TypeOrmModule.forFeature`)?
    - How do you pass configuration options into a dynamic module?

14. **How do you create a global module in NestJS?**
    - What is the `@Global()` decorator and what does it do to the module's providers?
    - What are the risks of overusing global modules (hidden dependencies, testability issues)?
    - When is it appropriate to make a module global (e.g., ConfigModule, LoggerModule)?

15. **What happens if you forget to export a provider from a module?**
    - How do you debug a `Nest can't resolve dependencies` error?
    - How does the NestJS dependency graph help you trace missing providers?
    - How do you avoid this error by structuring your modules correctly?

16. **What is a shared module in NestJS?**
    - How do you create a shared module that exposes reusable providers to the rest of the app?
    - What is the difference between a shared module and a global module?
    - How do you avoid circular imports when building shared modules?

17. **How does NestJS handle lazy-loaded modules?**
    - What is `LazyModuleLoader` and when is it useful?
    - How do lazy-loaded modules improve cold start time in serverless deployments?
    - What are the limitations of lazy-loaded modules (e.g., guards, middleware not auto-applied)?

---

## 3. Controllers

18. **What is a controller in NestJS, and how does it handle requests?**
    - How do you structure controllers for large applications (one controller per resource)?
    - What is the difference between `@Controller('users')` path prefix and individual `@Get`, `@Post` route paths?
    - How does NestJS route matching work when multiple routes could match a request?

19. **How do you define a route with parameters in NestJS?**
    - How do you validate and transform route parameters using pipes?
    - What is the difference between `@Param('id')` and `@Param()` (all params as object)?
    - How do you define optional route segments in NestJS?

20. **What is the difference between `@Body`, `@Query`, and `@Param`?**
    - When would you use `@Query` over `@Param` for resource filtering?
    - How do you bind a DTO to `@Body` for automatic validation?
    - What is `@Headers()` and how do you access specific request headers?

21. **How do you handle file uploads in a controller?**
    - How do you use `@UseInterceptors(FileInterceptor)` and `@UploadedFile` together?
    - How do you validate file type and size within the controller or a pipe?
    - What is the difference between `FileInterceptor` (single file) and `FilesInterceptor` (multiple files)?

22. **How do you version APIs in NestJS?**
    - What are the four versioning strategies in NestJS (URI, Header, Media type, Custom)?
    - What are the pros and cons of URI versioning (`/v1/users`) vs header versioning?
    - How do you set a default version for all routes and override it per controller?

23. **How do you send custom HTTP responses in NestJS?**
    - What is the difference between using `@Res()` directly and letting NestJS handle the response?
    - How do you set custom status codes using `@HttpCode()` decorator?
    - When does using `@Res()` break NestJS interceptors and how do you avoid that?

24. **What is response serialization in NestJS?**
    - How does `ClassSerializerInterceptor` work with `@Exclude()` and `@Expose()` from `class-transformer`?
    - How do you apply `@SerializeOptions({ strategy: 'excludeAll' })` to a controller?
    - How do you serialize nested objects in a response DTO?

25. **How do you handle streaming responses in NestJS?**
    - How do you pipe a Node.js `ReadableStream` to an HTTP response in a NestJS controller?
    - What is `StreamableFile` in NestJS and when do you use it?
    - How do you set the correct `Content-Type` and `Content-Disposition` headers for file downloads?

---

## 4. Dependency Injection

26. **What is Dependency Injection in NestJS, and why is it important?**
    - How does DI improve testability by allowing you to swap real implementations for mocks?
    - How does NestJS's DI container differ from manually instantiating classes?
    - What is the difference between constructor injection and property injection in NestJS?

27. **How do you inject a service into a controller?**
    - What happens at runtime if the service is not marked with `@Injectable`?
    - What is the role of the module's `providers` array in making a service injectable?
    - How does TypeScript's `emitDecoratorMetadata` allow NestJS to infer the injection token from the type?

28. **What is the `@Injectable` decorator, and when is it used?**
    - Can a class without `@Injectable` be injected — and what error do you get if you try?
    - Why do you need `@Injectable` even on classes that don't inject anything themselves?
    - What is the `scope` option on `@Injectable` and what are its three values?

29. **How do you solve a circular dependency in NestJS?**
    - How does `forwardRef(() => ServiceName)` break a circular dependency?
    - What are alternative architectural approaches to eliminate circular dependencies (event emitter, shared module)?
    - How do circular dependencies affect application startup performance?

30. **What is a custom provider, and how do you create one?**
    - What is the difference between `useClass`, `useValue`, `useFactory`, and `useExisting`?
    - When would you use `useFactory` over `useValue` (async initialization, conditional logic)?
    - How do you inject other providers into a `useFactory` function using the `inject` array?

31. **How do you handle provider scopes in NestJS DI?**
    - What are the three provider scopes: `DEFAULT` (singleton), `REQUEST`, and `TRANSIENT`?
    - What are the performance implications of request-scoped providers (new instance per request)?
    - How does a request-scoped provider propagate up to its consumers (scope bubbling)?

32. **What is the `@Inject` decorator, and when is it needed?**
    - When do you need `@Inject(TOKEN)` instead of relying on TypeScript type inference?
    - How do you use `@Inject` with string or Symbol injection tokens?
    - Can you use `@Inject` with built-in NestJS providers like `HttpService`?

33. **How do you test DI in NestJS?**
    - How do you use `Test.createTestingModule` to build an isolated DI container for unit tests?
    - How do you mock a provider using `{ provide: ServiceName, useValue: mockObject }`?
    - How do you override a provider only for a specific test without affecting others?

34. **How do you create an asynchronous provider in NestJS?**
    - How do you use `useFactory` with `async/await` to initialize a provider asynchronously?
    - What is `registerAsync` on dynamic modules (e.g., `TypeOrmModule.forRootAsync`) and how does it work?
    - What are the use cases for async providers (database connection, remote config fetch)?

---

## 5. Providers and Services

35. **What is a provider in NestJS?**
    - What types of values can be a NestJS provider (class, value, factory, alias)?
    - How is a provider different from a plain TypeScript class?
    - What is an injection token and how do you define a custom one using `InjectionToken`?

36. **What is the difference between a service and a repository in NestJS?**
    - How do you structure services and repositories in a clean architecture (service calls repo, controller calls service)?
    - What is the repository pattern and how does TypeORM's `@InjectRepository` implement it?
    - When should business logic live in a service vs a domain entity?

37. **How do you create a factory provider in NestJS?**
    - How do you inject other providers into a factory using the `inject` array?
    - How do you conditionally return different implementations from a factory?
    - What is the difference between a factory provider and a `useClass` provider?

38. **What is the role of the `@Optional` decorator?**
    - What happens at runtime if an optional dependency is not registered in the module?
    - When is `@Optional` appropriate vs making the dependency mandatory?
    - How do you combine `@Optional` with `@Inject` for non-class tokens?

39. **How do you share a provider across multiple modules in NestJS?**
    - What is the correct pattern: export from a shared module and import that module?
    - What are the risks of sharing stateful providers across modules?
    - How does NestJS ensure that a singleton provider is the same instance across all modules?

40. **What is the difference between singleton and transient providers?**
    - How do you declare a transient provider and what does NestJS do differently for it?
    - When is a transient provider preferable to a singleton?
    - How do you verify in a test that a provider is being instantiated fresh each time?

---

## 6. Middleware, Pipes, Guards, and Interceptors

41. **What is middleware in NestJS, and how is it applied?**
    - How does NestJS middleware differ from Express middleware in terms of application?
    - How do you apply middleware to specific routes using `configure` in a module?
    - Can middleware access NestJS's DI container — and if so, how?

42. **What are pipes in NestJS, and how do they work?**
    - What are the two roles of pipes: transformation and validation?
    - How do you chain multiple pipes on a single parameter?
    - What are the NestJS built-in pipes and when would you use each (`ParseIntPipe`, `ValidationPipe`, `ParseUUIDPipe`)?

43. **How do you create a custom pipe in NestJS?**
    - What interface does a custom pipe implement and what method must it define?
    - When would you need a custom pipe over the built-in `ValidationPipe`?
    - How do you throw a `BadRequestException` from inside a custom pipe?

44. **What are guards in NestJS, and how are they used?**
    - How do guards interact with the `ExecutionContext` to access request data?
    - How do you apply a guard at the method, controller, and global level?
    - What is the return value of a guard's `canActivate` method and what happens on `false`?

45. **What are interceptors in NestJS, and when are they useful?**
    - How do interceptors use RxJS `Observable` to wrap the request/response cycle?
    - Can interceptors modify both the request before it reaches the handler and the response after?
    - What are common use cases for interceptors (logging, caching, response transformation, timing)?

46. **What is the difference between middleware, pipes, guards, and interceptors?**
    - What is the exact execution order: middleware → guard → interceptor → pipe → handler → interceptor → filter?
    - When would you choose an interceptor over middleware for response transformation?
    - How do you decide between a guard and middleware for authentication?

47. **How do you apply multiple guards to a route in NestJS?**
    - In what order does NestJS evaluate multiple guards — and does evaluation short-circuit on the first failure?
    - How do you combine an authentication guard and an authorization guard on the same route?
    - How do you write a guard that checks custom metadata set by a decorator?

48. **What is the `ExecutionContext` in NestJS?**
    - How do you switch context using `switchToHttp()`, `switchToRpc()`, and `switchToWs()`?
    - How do you access the underlying request object from `ExecutionContext`?
    - How do you use `ExecutionContext` to read custom metadata in a guard?

---

## 7. Exception Handling

49. **How do you handle exceptions in NestJS?**
    - What is the built-in global exception filter and what exceptions does it handle by default?
    - How do you throw HTTP exceptions from a service or controller (`NotFoundException`, `BadRequestException`)?
    - How do you customize the shape of the error response body?

50. **What is an exception filter, and how do you create one?**
    - What interface does a custom exception filter implement and what method must it define?
    - How do you handle non-HTTP exceptions (e.g., database errors) in a custom exception filter?
    - How do you access the request and response objects inside an exception filter?

51. **How do you apply an exception filter at different levels in NestJS?**
    - What is the difference between applying a filter with `@UseFilters` on a method, controller, and globally with `app.useGlobalFilters`?
    - What are the limitations of globally registered exception filters (no DI access) and how do you work around them?
    - How do you apply a filter only to specific HTTP exception types?

52. **What is the difference between `HttpException` and its subclasses?**
    - What is the difference between `HttpException` (base), `BadRequestException` (400), `UnauthorizedException` (401), `NotFoundException` (404), and `InternalServerErrorException` (500)?
    - When would you create a custom exception class that extends `HttpException`?
    - How do you pass a custom error object (not just a string message) to `HttpException`?

53. **How do you build a custom exception hierarchy in NestJS?**
    - How do you create a base domain exception class and extend it for specific errors?
    - How do you map domain exceptions to HTTP status codes in an exception filter?
    - What is the benefit of domain-specific exceptions vs throwing `HttpException` directly from a service?

54. **How do you log exceptions in NestJS?**
    - How do you use the NestJS built-in `Logger` inside an exception filter?
    - How do you integrate a third-party logger (Winston, Pino) with NestJS exception handling?
    - What information should you always include in an exception log (stack trace, request ID, timestamp)?

---

## 8. Validation with class-validator and class-transformer

55. **What is `ValidationPipe` in NestJS and how do you enable it globally?**
    - What is the difference between enabling `ValidationPipe` globally via `app.useGlobalPipes` vs `APP_PIPE` token?
    - What does the `whitelist: true` option do and why is it a security best practice?
    - What does `forbidNonWhitelisted: true` do and how does it differ from `whitelist: true`?

56. **How do you define a DTO with class-validator decorators?**
    - What are the most commonly used class-validator decorators (`@IsString`, `@IsEmail`, `@IsInt`, `@IsOptional`, `@IsEnum`, `@MinLength`)?
    - How do you validate nested objects inside a DTO using `@ValidateNested` and `@Type`?
    - How do you validate arrays of objects inside a DTO?

57. **What is `class-transformer` and how does it work with NestJS?**
    - What is the difference between `@Exclude()` and `@Expose()` from `class-transformer`?
    - How do you use `@Transform()` to normalize or sanitize incoming data (e.g., trim strings, convert to lowercase)?
    - What does `plainToInstance` do and when would you call it manually?

58. **How do you create custom validation decorators with class-validator?**
    - How do you use `registerDecorator` to build a fully custom validation rule?
    - How do you create a `ValidatorConstraint` class that performs async validation (e.g., check if email exists in DB)?
    - How do you inject NestJS services into a custom async validator?

59. **What is the `transform: true` option on `ValidationPipe` and why is it important?**
    - How does `transform: true` automatically convert query string numbers from string to `number` type?
    - How do you use `@Type(() => Number)` from `class-transformer` with `transform: true`?
    - What are the risks of enabling `transform: true` without strict DTO definitions?

60. **How do you validate query parameters and route params in NestJS?**
    - How do you apply a DTO to `@Query()` parameters using `ValidationPipe`?
    - How do you use `ParseIntPipe` or `ParseUUIDPipe` for individual route params?
    - How do you handle partial validation for optional query parameters?

---

## 9. Database Integration

61. **How do you integrate TypeORM with NestJS?**
    - How do you configure `TypeOrmModule.forRoot` with database connection options?
    - How do you handle database transactions in TypeORM within a NestJS service?
    - What is the difference between `TypeOrmModule.forRoot` and `TypeOrmModule.forRootAsync`?

62. **What is the difference between `@nestjs/typeorm` and `@nestjs/mongoose`?**
    - When would you choose MongoDB (Mongoose) over a SQL database (TypeORM) in NestJS?
    - How does schema definition differ between TypeORM entities and Mongoose schemas?
    - How do you handle relations in TypeORM (`@OneToMany`, `@ManyToOne`) vs Mongoose (populate)?

63. **How do you use repositories in NestJS with TypeORM?**
    - How do you inject a TypeORM repository using `@InjectRepository(Entity)`?
    - What are the benefits of custom repositories (extending `Repository<Entity>`) over the default one?
    - How do you use the `QueryBuilder` for complex queries in a NestJS service?

64. **How do you handle database migrations in NestJS with TypeORM?**
    - How do you generate and run migrations using the TypeORM CLI?
    - How do you automate migrations in a CI/CD pipeline?
    - What is the risk of using `synchronize: true` in production and why should it be disabled?

65. **How do you configure multiple database connections in NestJS?**
    - How do you use `name` on `TypeOrmModule.forRoot` to define a named connection?
    - How do you inject a repository from a named connection using `@InjectRepository(Entity, 'connectionName')`?
    - When would you need multiple database connections in a single NestJS application?

66. **How do you implement soft deletes in TypeORM with NestJS?**
    - What is the `@DeleteDateColumn` decorator and how does TypeORM use it for soft deletes?
    - How does `softDelete` differ from `delete` in a TypeORM repository?
    - How do you query and restore soft-deleted records?

67. **How do you handle eager vs lazy loading in TypeORM?**
    - What is the difference between `eager: true` on a relation and using `relations` in a `find` call?
    - What are the performance trade-offs of eager loading vs explicit join queries?
    - How do you avoid N+1 query problems in TypeORM with NestJS?

68. **How do you integrate Mongoose with NestJS?**
    - How do you define a Mongoose schema and model using `@Schema` and `@Prop` decorators?
    - How do you inject a Mongoose model into a service using `@InjectModel`?
    - How do you handle Mongoose middleware (pre/post hooks) in NestJS?

---

## 10. Prisma with NestJS

69. **What is Prisma and why is it popular in the NestJS ecosystem?**
    - How does Prisma's type safety compare to TypeORM or Mongoose in a TypeScript project?
    - What are the components of Prisma (Prisma Client, Prisma Migrate, Prisma Studio)?
    - What are the trade-offs of Prisma vs TypeORM for a NestJS project?

70. **How do you integrate Prisma into a NestJS application?**
    - How do you create a `PrismaService` that extends `PrismaClient` and implements `OnModuleInit`?
    - Why should you call `$connect()` in `onModuleInit` and `$disconnect()` in `onModuleDestroy`?
    - How do you make `PrismaService` globally available across all modules?

71. **What is the Prisma schema file and how do you define models in it?**
    - How do you define a model, fields, relations, and enums in `schema.prisma`?
    - What is the `@id`, `@unique`, `@default`, and `@relation` directive in Prisma schema?
    - How do you define a one-to-many and many-to-many relation in Prisma?

72. **How do you run Prisma migrations in NestJS?**
    - What is the difference between `prisma migrate dev` (development) and `prisma migrate deploy` (production)?
    - How do you integrate `prisma migrate deploy` into a Docker or CI/CD deployment pipeline?
    - What does `prisma generate` do and when must you run it?

73. **How do you use Prisma Client for CRUD operations in a NestJS service?**
    - How do you use `findMany`, `findUnique`, `create`, `update`, `upsert`, and `delete` in Prisma Client?
    - How do you filter, sort, and paginate results using Prisma's query API?
    - How do you handle Prisma's `PrismaClientKnownRequestError` (e.g., unique constraint violation)?

74. **How do you handle database transactions in Prisma with NestJS?**
    - What is `prisma.$transaction` and how do you use it for atomic operations?
    - What is the difference between sequential transactions and interactive transactions in Prisma?
    - How do you roll back a Prisma transaction on error?

75. **How do you use Prisma with NestJS for relation queries?**
    - How do you use `include` to eagerly load related records in a Prisma query?
    - How do you use `select` to return only specific fields and nested relations?
    - How do you create a record and its related records in a single Prisma `create` call?

---

## 11. Microservices

76. **How does NestJS support microservices?**
    - What is the difference between a NestJS HTTP application and a NestJS microservice application?
    - Which transport layer is best suited for high-throughput microservices (Kafka, NATS, Redis)?
    - How do you create a hybrid app that handles both HTTP and microservice messages?

77. **What is a message pattern in NestJS microservices?**
    - What is the difference between `@MessagePattern` (request-response) and `@EventPattern` (fire-and-forget)?
    - How do you handle message versioning in a microservices architecture?
    - How do you test a microservice message handler in NestJS?

78. **What are the different transport layers supported by NestJS microservices?**
    - What are the trade-offs between TCP, Redis, NATS, Kafka, and RabbitMQ transport layers?
    - How do you configure Kafka transport in a NestJS microservice?
    - What is the gRPC transport in NestJS and how do you define a `.proto` file for it?

79. **How do you handle errors in a NestJS microservices setup?**
    - How do you propagate errors from a microservice back to the caller using `RpcException`?
    - How do you use an RPC exception filter to catch and format microservice errors?
    - What happens to unhandled errors in a NestJS microservice (are they swallowed silently)?

80. **How do you scale a NestJS microservices architecture?**
    - How do you run multiple instances of a NestJS microservice for load balancing?
    - What is service discovery and how do you implement it with NestJS microservices?
    - How do you implement a circuit breaker between NestJS microservices?

81. **What is CQRS and how does `@nestjs/cqrs` implement it?**
    - What is the difference between a Command, a Query, and an Event in CQRS?
    - How do you implement a `CommandHandler` and register it in a NestJS module?
    - How do `EventBus` and `QueryBus` work and when do you use each?

82. **How do you implement the SAGA pattern in NestJS?**
    - What is a saga in the context of `@nestjs/cqrs` (reacting to events and dispatching commands)?
    - How do sagas manage distributed transactions without two-phase commit?
    - How do you handle saga failures and compensating transactions in NestJS?

---

## 12. Authentication and Security

83. **How do you implement JWT authentication in NestJS?**
    - How do you use `@nestjs/jwt` and `@nestjs/passport` together to implement JWT auth?
    - How do you configure `JwtModule.registerAsync` to load the secret from `ConfigService`?
    - How do you attach the authenticated user to the request object in a JWT guard?

84. **How do you implement a Passport local strategy in NestJS?**
    - What is the `LocalStrategy` and how does it validate username and password?
    - How does `AuthGuard('local')` trigger the Passport local strategy?
    - How do you return a JWT after successful local authentication?

85. **What is role-based access control (RBAC) and how do you implement it in NestJS?**
    - How do you create a `@Roles` custom decorator and a `RolesGuard` that reads it?
    - How do you use the `Reflector` class inside a guard to read custom metadata?
    - What is the difference between RBAC and ABAC (Attribute-Based Access Control)?

86. **How do you implement refresh token rotation in NestJS?**
    - How do you store refresh tokens securely (hashed in the database, httpOnly cookie)?
    - How do you detect and invalidate a refresh token after it has been used once?
    - What endpoint pattern do you use for `/auth/refresh` in a NestJS REST API?

87. **How do you prevent CORS issues in NestJS?**
    - How do you enable CORS globally using `app.enableCors()` with specific origins?
    - How do you configure different CORS settings per environment (dev vs prod)?
    - What are the security risks of using `origin: '*'` in production?

88. **What is CSRF protection and how do you implement it in NestJS?**
    - How do you use the `csurf` middleware with NestJS and Express?
    - When is CSRF protection unnecessary (stateless JWT APIs with no cookies)?
    - What is the `SameSite` cookie attribute and how does it reduce CSRF risk?

89. **How do you secure WebSocket connections in NestJS?**
    - How do you authenticate a WebSocket connection using a JWT in the handshake headers?
    - How do you apply a guard to a WebSocket gateway in NestJS?
    - How do you handle token expiry for long-lived WebSocket connections?

90. **How do you perform security hardening on a NestJS application?**
    - How do you use `helmet` middleware to set secure HTTP headers in NestJS?
    - How do you implement request rate limiting using `@nestjs/throttler`?
    - How do you run `npm audit` and integrate dependency scanning into a CI/CD pipeline?

---

## 13. Testing

91. **How do you write unit tests in NestJS?**
    - How do you use `Test.createTestingModule` to set up an isolated module for testing?
    - How do you structure tests for maintainability (one test file per service/controller)?
    - What is the Arrange-Act-Assert pattern and how does it apply to NestJS unit tests?

92. **How do you mock dependencies in NestJS tests?**
    - How do you provide a mock service using `{ provide: ServiceName, useValue: mockObject }`?
    - How do you mock external HTTP calls using `jest.spyOn` or `nock`?
    - How do you test that a method was called with specific arguments using Jest matchers?

93. **What is the difference between unit tests and integration tests in NestJS?**
    - How do you write integration tests using `Test.createTestingModule` with a real database?
    - How do you set up and tear down test data between integration tests?
    - What is an end-to-end (E2E) test in NestJS and how do you write one?

94. **How do you write E2E tests in NestJS?**
    - How do you use `supertest` with NestJS to send real HTTP requests in E2E tests?
    - How do you bootstrap the full NestJS application in a test environment?
    - How do you seed a test database and clean it up after each E2E test suite?

95. **How do you test guards and interceptors in NestJS?**
    - How do you test a guard by mocking `ExecutionContext` and calling `canActivate` directly?
    - How do you test an interceptor by providing a mock `CallHandler` with an observable?
    - How do you test that an interceptor transforms the response correctly?

96. **How do you test middleware in NestJS?**
    - How do you simulate an HTTP request through middleware in a unit test?
    - How do you test middleware that calls `next()` vs middleware that blocks the request?
    - How do you test middleware that depends on NestJS-injected services?

97. **How do you test exception filters in NestJS?**
    - How do you trigger an exception in an E2E test and assert the response shape?
    - How do you unit test the `catch` method of an exception filter?
    - How do you verify that the correct HTTP status code is returned by a custom filter?

98. **How do you measure and enforce test coverage in NestJS?**
    - How do you configure Jest coverage thresholds in `jest.config.ts` or `package.json`?
    - What is a meaningful coverage target for a NestJS backend (line, branch, function)?
    - What are the risks of targeting 100% coverage in a NestJS project?

---

## 14. Performance and Optimization

99. **How do you optimize a NestJS application for performance?**
    - What tools do you use to profile NestJS performance (clinic.js, `--prof`, Datadog APM)?
    - How do you identify slow routes or database queries using request logging?
    - What is the impact of request-scoped providers on throughput and how do you minimize it?

100. **What is caching in NestJS and how do you implement it?**
     - How do you use `@nestjs/cache-manager` to cache method results in a service?
     - How do you use Redis as the cache store with `cache-manager`?
     - How do you invalidate a specific cache key when data changes?

101. **How do you implement lazy loading in NestJS?**
     - What is `LazyModuleLoader` and how do you use it to load a module on demand?
     - What are the performance benefits of lazy loading in a serverless or large modular app?
     - What are the limitations (guards, middleware, pipes not automatically applied)?

102. **What is the benefit of using Fastify over Express in NestJS?**
     - What throughput improvements does Fastify provide over Express in benchmarks?
     - How do you switch the NestJS HTTP adapter from Express to Fastify?
     - What Express-specific middleware is incompatible with Fastify and how do you replace it?

103. **How do you use compression in NestJS?**
     - How do you add gzip or Brotli compression middleware to a NestJS Express application?
     - What is the CPU cost of compression and when should you offload it to Nginx or a CDN?
     - How do you enable compression only for responses above a certain size threshold?

104. **How do you profile and debug a NestJS application?**
     - How do you use the `--inspect` Node.js flag with a running NestJS app for Chrome DevTools profiling?
     - How do you identify memory leaks in a NestJS application?
     - What is the NestJS `Logger` and how do you replace it with a structured logger like Pino?

---

## 15. GraphQL

105. **How do you set up GraphQL in NestJS?**
     - What is the difference between `GraphQLModule.forRoot` with `code-first` and `schema-first` options?
     - How do you integrate `@nestjs/graphql` with Apollo Server vs Mercurius?
     - How do you enable GraphQL playground and introspection safely in production?

106. **What is a resolver in NestJS GraphQL?**
     - What decorators define a query (`@Query`), mutation (`@Mutation`), and subscription (`@Subscription`) in a resolver?
     - How does the resolver chain work for nested types using `@ResolveField`?
     - How do you optimize resolver performance to avoid N+1 queries?

107. **What is the difference between code-first and schema-first GraphQL in NestJS?**
     - How do you define a GraphQL type using `@ObjectType` and `@Field` in code-first?
     - What is the `schema.gql` auto-generated file and when is it updated?
     - Which approach is better for large teams — and what are the trade-offs?

108. **How do you handle authentication in NestJS GraphQL APIs?**
     - How do you pass the authenticated user to the GraphQL context function?
     - How do you apply a guard to a specific GraphQL query or mutation?
     - How do you implement field-level authorization in a NestJS resolver?

109. **How do you implement DataLoader in NestJS GraphQL?**
     - What problem does DataLoader solve in a GraphQL resolver (N+1 queries)?
     - How do you create a per-request DataLoader instance in NestJS using a factory provider?
     - How do you inject a DataLoader into a resolver and use it in `@ResolveField`?

110. **How do you handle GraphQL subscriptions in NestJS?**
     - How do you set up `subscriptions-transport-ws` or `graphql-ws` with NestJS?
     - How do you use `PubSub` from `graphql-subscriptions` to publish and listen to events?
     - How do you scale GraphQL subscriptions across multiple NestJS instances using Redis PubSub?

111. **How do you optimize a NestJS GraphQL API?**
     - How do you implement query complexity analysis to reject expensive queries?
     - How do you implement query depth limiting in NestJS GraphQL?
     - How do you cache GraphQL responses using persisted queries or response caching?

---

## 16. WebSockets

112. **How do you implement WebSockets in NestJS?**
     - What is a WebSocket gateway and how do you create one using `@WebSocketGateway`?
     - How do you handle WebSocket events using `@SubscribeMessage`?
     - How do you broadcast a message to all connected clients using `@WebSocketServer`?

113. **What is the difference between WebSockets and Server-Sent Events (SSE)?**
     - When would you use SSE over WebSockets in a NestJS application?
     - How do you implement SSE in NestJS using `@Sse()` and `EventEmitter`?
     - What are the connection limits and browser support differences between SSE and WebSockets?

114. **How do you handle WebSocket disconnections in NestJS?**
     - How do you use `handleDisconnect` and `handleConnection` lifecycle hooks in a gateway?
     - How do you track connected clients and clean up resources on disconnect?
     - How do you reconnect clients automatically on the frontend after a disconnection?

115. **How do you scale WebSocket applications in NestJS?**
     - What is the `@nestjs/platform-socket.io` Redis adapter and how does it enable multi-node WebSocket scaling?
     - What is sticky session and when is it required for WebSocket servers behind a load balancer?
     - How do you test WebSocket gateways including connection, message, and disconnect events?

116. **What is a WebSocket namespace in NestJS?**
     - How do you define a namespace on `@WebSocketGateway({ namespace: '/chat' })`?
     - How do namespaces improve organization and isolation in a WebSocket application?
     - How do you apply different guards or middleware to different namespaces?

---

## 17. Advanced Patterns

117. **How do you implement a custom decorator in NestJS?**
     - How do you create a parameter decorator that extracts data from the request?
     - How do you create a method decorator that sets metadata using `SetMetadata`?
     - How do you compose multiple decorators into a single custom decorator using `applyDecorators`?

118. **What is the Reflector class in NestJS, and how is it used?**
     - How do you use `Reflector.get` and `Reflector.getAllAndMerge` inside a guard?
     - How do you read metadata set by `SetMetadata` at both method and class level?
     - What is `Reflector.getAllAndOverride` and when is it more appropriate than `getAllAndMerge`?

119. **What is event sourcing and how do you implement it in NestJS?**
     - How does event sourcing differ from traditional CRUD (storing events vs current state)?
     - How do you use `@nestjs/cqrs` `EventBus` to publish and subscribe to domain events?
     - How do you handle event versioning as your domain evolves over time?

120. **What is the outbox pattern and how do you implement it in NestJS?**
     - What problem does the outbox pattern solve (dual write, message loss on service crash)?
     - How do you implement an outbox table in Prisma or TypeORM with NestJS?
     - How do a background poller or CDC (change data capture) tool relay outbox events to a message broker?

121. **How do you implement multi-tenancy in NestJS?**
     - What are the three multi-tenancy database strategies (shared schema, schema-per-tenant, DB-per-tenant)?
     - How do you use a request-scoped provider to inject the tenant context into a service?
     - How do you use Prisma or TypeORM with row-level tenant isolation?

---

## 18. Configuration and Environment

122. **How do you manage environment variables in NestJS?**
     - How do you use `@nestjs/config` with `ConfigModule.forRoot` to load `.env` files?
     - How do you access config values using `ConfigService.get<string>('KEY')`?
     - How do you secure sensitive environment variables in production (AWS Secrets Manager, Vault)?

123. **What is the difference between `forRoot` and `forFeature` in NestJS?**
     - How do `forRoot` and `forFeature` enable the module registration pattern for database connection sharing?
     - Can `forFeature` be used in a module that has not called `forRoot` — and what happens?
     - How do you implement this pattern in your own dynamic modules?

124. **How do you handle different configurations for development and production?**
     - How do you use `process.env.NODE_ENV` to load different `.env` files (`.env.development`, `.env.production`)?
     - How do you use the `load` option on `ConfigModule` to load typed configuration objects?
     - How do you test environment-specific configurations in unit tests?

125. **How do you validate environment variables in NestJS?**
     - How do you use `Joi` schema validation in `ConfigModule.forRoot({ validationSchema })` to validate env vars at startup?
     - How do you use `class-validator` with a config class and `validate` option on `ConfigModule`?
     - What happens if validation fails — does NestJS start or throw at bootstrap?

126. **What is the `@nestjs/config` `ConfigService` and how do you type it?**
     - How do you create a typed config interface and use `ConfigService.get<MyConfig>('database')`?
     - How do you use namespaced config with `registerAs('database', () => ({ ... }))` and `ConfigService.get`?
     - How do you inject `ConfigService` into a `TypeOrmModule.forRootAsync` factory?

---

## 19. Ecosystem and Tooling

127. **What is `@nestjs/swagger` and how do you use it?**
     - How do you set up Swagger UI using `SwaggerModule.setup` and `DocumentBuilder`?
     - How do you use `@ApiProperty`, `@ApiResponse`, `@ApiTags`, and `@ApiBearerAuth` to document an API?
     - How do you generate a TypeScript client from a NestJS Swagger spec?

128. **How do you document DTOs with `@nestjs/swagger`?**
     - How does `@ApiProperty({ description, example, required })` document a DTO field?
     - How do you document enums, arrays, and nested objects in a Swagger DTO?
     - How do you use `@ApiPropertyOptional` to mark optional fields?

129. **What is `@nestjs/terminus` and how do you implement health checks?**
     - How do you create a `HealthController` with `@nestjs/terminus` that exposes `/health`?
     - What health indicators does Terminus provide out of the box (database, Redis, HTTP, disk, memory)?
     - How do you configure a Kubernetes readiness probe and liveness probe using a Terminus health endpoint?

130. **How do you implement background job processing in NestJS with BullMQ?**
     - How do you set up `@nestjs/bullmq` with a Redis connection and define a queue?
     - How do you create a `@Processor` class and handle jobs with `@Process` (or `@OnWorkerEvent`)?
     - How do you handle job retries, backoff, and failed jobs in BullMQ?

131. **How do you monitor BullMQ queues in a NestJS application?**
     - What is Bull Board and how do you integrate it with a NestJS application?
     - What metrics should you track for a job queue (throughput, failure rate, queue depth)?
     - How do you set up alerts for stalled or failed jobs?

132. **What are NestJS lifecycle hooks and how do you use them?**
     - What is the difference between `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, and `BeforeApplicationShutdown`?
     - How do you use `OnModuleInit` to run setup logic (DB connection, cache warm-up) before the app accepts requests?
     - How do you use `OnApplicationShutdown` for graceful shutdown (draining queues, closing DB connections)?

133. **How do you implement graceful shutdown in NestJS?**
     - How do you enable shutdown hooks using `app.enableShutdownHooks()`?
     - What happens when Kubernetes sends a `SIGTERM` to a NestJS pod — and how do you handle it?
     - How do you drain in-flight HTTP requests before the process exits?

134. **What is the NestJS Logger and how do you replace it?**
     - How do you use the built-in `Logger` class from `@nestjs/common` with context?
     - How do you replace the NestJS default logger with Winston or Pino using `app.useLogger`?
     - How do you set the log level per environment (debug in dev, warn in production)?

135. **How do you implement internationalization (i18n) in NestJS?**
     - How do you use `nestjs-i18n` to support multiple languages in a NestJS API?
     - How do you translate validation error messages from `class-validator` using i18n?
     - How do you detect the user's preferred language from `Accept-Language` headers?

---

## 20. Docker, Deployment, and Scenario-Based Questions

136. **How do you write a Dockerfile for a NestJS application?**
     - What is the recommended base image for a NestJS production container (`node:20-alpine`)?
     - How do you use a multi-stage build to compile TypeScript in one stage and run the output in another?
     - Why should you copy `package.json` and install dependencies before copying the rest of the source code?

137. **What is a multi-stage Docker build for NestJS and how does it reduce image size?**
     - How do you exclude `devDependencies` from the production image using `npm ci --only=production`?
     - What is the difference between `COPY --from=builder` in multi-stage builds?
     - How do you run NestJS as a non-root user inside the container for security?

138. **How do you use Docker Compose with a NestJS application?**
     - How do you define NestJS, PostgreSQL, and Redis services in a `docker-compose.yml`?
     - How do services in Docker Compose communicate with each other (service name as hostname)?
     - How do you use volumes to persist database data and hot-reload NestJS during development?

139. **How do you deploy a NestJS application to Kubernetes?**
     - What Kubernetes resources do you need for a NestJS deployment (Deployment, Service, ConfigMap, Secret)?
     - How do you configure resource limits and requests for a NestJS container in Kubernetes?
     - How do you use a Kubernetes `readinessProbe` pointing to your NestJS Terminus `/health` endpoint?

140. **How do you implement CI/CD for a NestJS application?**
     - What stages should a NestJS CI/CD pipeline include (lint, test, build, docker push, deploy)?
     - How do you run NestJS E2E tests in a CI pipeline with a real database (GitHub Actions service containers)?
     - What is a blue-green deployment for NestJS and how does it achieve zero downtime?

141. **Describe a challenging NestJS-specific problem you solved.**
     - How did NestJS's DI system, module structure, or decorator pattern play a role in the challenge?
     - How did you debug a `Nest can't resolve dependencies` error in a large module graph?
     - What would you architect differently with your current knowledge of NestJS internals?

142. **How would you debug a NestJS application crashing in production?**
     - How do you read and interpret NestJS startup logs to find a missing provider or bad config?
     - How do you use distributed tracing (OpenTelemetry) to find the failing request in a NestJS microservice?
     - What is your process for enabling `DEBUG=*` or verbose NestJS logging without redeploying?

143. **What would you do if a NestJS API route is returning 500 errors intermittently?**
     - How do you use a global exception filter with structured logging to capture the error context?
     - How do you correlate a 500 error with a specific database query, guard, or interceptor using request IDs?
     - How do you use feature flags to disable a faulty endpoint without a full redeploy?

144. **How do you ensure code quality in a NestJS project?**
     - How do you configure ESLint with the `@typescript-eslint` plugin and NestJS-specific rules?
     - How do you use `husky` and `lint-staged` to run linting and tests on pre-commit?
     - How do you enforce test coverage thresholds and type checks in a NestJS CI pipeline?

145. **How do you onboard a new developer to a NestJS project?**
     - What NestJS-specific concepts do you prioritize explaining first (DI, module graph, request pipeline)?
     - How do you use Docker Compose and `npm run start:dev` to get a new developer running in one command?
     - How do you document module dependencies and the overall module graph for a large NestJS codebase?

146. **How do you design a NestJS application for a team of 10+ developers?**
     - How do you use NestJS monorepo support (`nest generate app`, `nest generate library`) to split a large codebase?
     - How do you enforce module boundaries to prevent cross-domain coupling?
     - What shared libraries (auth, logging, database) do you extract into NestJS libraries for reuse across apps?

147. **How do you handle a performance regression in a NestJS API?**
     - How do you use NestJS interceptors to add per-request timing logs for all routes?
     - How do you identify whether the regression is in a guard, interceptor, pipe, or service using execution time breakdowns?
     - What is your rollback strategy if a performance fix introduces a new bug?

148. **How would you migrate a large Express REST API to NestJS?**
     - What is the strangler fig pattern and how do you apply it to incrementally replace Express routes with NestJS controllers?
     - How do you preserve existing Express middleware (auth, logging) during migration?
     - What is your strategy for migrating tests from a raw Express test suite to NestJS `Test.createTestingModule`?
