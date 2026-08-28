---
sidebar_position: 1
title: 'Core Concepts & Architecture'
---

## 1. What is NestJS, and what problems does it solve?

**NestJS** হলো Node.js-এর উপর তৈরি একটা **progressive, opinionated backend framework**, যা TypeScript-কে first-class citizen হিসেবে ব্যবহার করে server-side application তৈরি করার একটা **সুনির্দিষ্ট architecture** দেয়। এটা নিজে কোনো নতুন HTTP server লেখে না — নিচে default হিসেবে **Express** (বা চাইলে **Fastify**) ব্যবহার করে, কিন্তু তার উপরে একটা **module system + Dependency Injection container + decorator-based metadata layer** বসিয়ে দেয়।

এক লাইনে: **NestJS = Express-এর power + Angular-এর structure + Spring-এর DI discipline।**

### NestJS মূলত কোন সমস্যাগুলো সমাধান করে?

- **"Structure নেই" সমস্যা:** Raw Express কোনো folder structure বা architecture চাপিয়ে দেয় না। ফলে ১০ জন developer-এর ১০ রকম structure হয় — কেউ `routes/`-এ business logic লেখে, কেউ `controllers/`-এ, কেউ সব `app.js`-এ। NestJS **Module → Controller → Service → Repository** নামে একটা enforced layering দেয়, যেটা প্রতিটা project-এ একই রকম দেখায়।

- **Manual dependency wiring:** Express-এ service-গুলো সাধারণত `new UserService(new UserRepo(db))` করে হাতে instantiate করা হয়, বা global singleton `require` করা হয়। NestJS-এর **DI container** এই wiring নিজে করে — আপনি শুধু constructor-এ type লিখে দেন।

- **Testability:** হাতে-instantiate করা dependency mock করা কষ্টকর। DI থাকার কারণে NestJS-এ যেকোনো dependency-কে test-এ এক লাইনে fake দিয়ে replace করা যায় (`{ provide: MailService, useValue: mockMail }`)।

- **Cross-cutting concern-এর duplication:** Auth check, logging, response shaping, validation — Express-এ এগুলো প্রতিটা route-এ middleware হিসেবে ছড়িয়ে থাকে। NestJS এদের জন্য আলাদা, declarative building block দেয়: **Guard** (auth), **Interceptor** (logging/transform), **Pipe** (validation), **Exception Filter** (error shaping)।

- **Type safety-র অভাব:** Plain JS Express-এ `req.body` হলো `any`। NestJS-এ **DTO class + class-validator** দিয়ে request body একইসাথে compile-time type এবং runtime validation পায়।

- **Monolith থেকে microservice-এ যাওয়ার খরচ:** NestJS-এর transport layer abstract করা, তাই একই Controller/Service code HTTP, TCP, Kafka, gRPC, বা RabbitMQ-র উপর প্রায় অপরিবর্তিত রেখে চালানো যায়।

- **Boilerplate:** Nest CLI (`nest g resource users`) একটা CRUD module-এর controller, service, DTO, entity, spec file সব একসাথে generate করে দেয়।

```ts
// একটা minimal NestJS application — তিনটা layer স্পষ্টভাবে আলাদা

// user.service.ts — business logic
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [{ id: 1, name: 'Mamun' }];

  findAll() {
    return this.users;
  }
}

// user.controller.ts — শুধু HTTP concern, কোনো business logic নেই
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  // DI container নিজেই UserService inject করে দিচ্ছে — new করতে হচ্ছে না
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}

// user.module.ts — এই feature-এর boundary
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### How does NestJS's architecture compare to Angular's (modules, DI, decorators)?

NestJS-এর creator (Kamil Myśliwiec) সচেতনভাবে **Angular-এর architecture backend-এ port** করেছেন — উদ্দেশ্য ছিল একজন Angular developer যেন প্রায় শূন্য শেখার খরচে backend লিখতে পারে, এবং full-stack team একটাই mental model share করতে পারে।

| Concept | Angular (frontend) | NestJS (backend) |
|---|---|---|
| Module | `@NgModule({ declarations, imports, providers, exports })` | `@Module({ controllers, imports, providers, exports })` |
| Root module | `AppModule` → `platformBrowserDynamic().bootstrapModule()` | `AppModule` → `NestFactory.create(AppModule)` |
| Injectable unit | `@Injectable()` service | `@Injectable()` provider/service |
| DI | Constructor injection, hierarchical injector | Constructor injection, module-scoped provider graph |
| Custom provider | `{ provide, useClass/useValue/useFactory }` | হুবহু একই syntax ও semantics |
| Entry point of a request | Component (`@Component`) — user event handle করে | Controller (`@Controller`) — HTTP request handle করে |
| Cross-cutting | HTTP Interceptor, Guard (router), Pipe (template) | Interceptor, Guard, Pipe — একই নাম, একই ধারণা |
| Async primitive | RxJS `Observable` | RxJS `Observable` (Interceptor-এ), সাথে Promise-ও |
| Lazy loading | Route-based lazy module | `LazyModuleLoader` |
| Code generation | Angular CLI (`ng g service`) | Nest CLI (`nest g service`) |

**মূল পার্থক্যগুলো:**

- **Rendering vs request handling:** Angular-এর কাজ DOM render করা, তাই তার template engine, change detection, zone.js আছে। NestJS-এর কাজ request-response, তাই তার জায়গায় আছে routing, serialization, transport adapter।
- **Injector hierarchy:** Angular-এ component tree ধরে nested injector তৈরি হয়। NestJS-এ hierarchy component tree-ভিত্তিক নয় — module graph ভিত্তিক, এবং একই provider পুরো app-এ singleton হিসেবে share হয় (যদি `@Global()` বা re-export করা থাকে)।
- **Scope:** Angular-এ provider scope মূলত root বা component-level। NestJS-এ scope তিনটা — `DEFAULT` (singleton), `REQUEST`, `TRANSIENT` — এবং `REQUEST` scope backend-এর জন্য বিশেষভাবে দরকারি (tenant context, request-scoped logger)।

### What pain points of raw Express does NestJS address (structure, testability, scalability)?

- **Structure:** Express-এ `app.get('/users', handler)` লিখলে route, validation, DB call, error handling সব এক জায়গায় জমে যায়। বড় project-এ এটা কয়েক হাজার লাইনের "fat route file"-এ পরিণত হয়। NestJS-এ HTTP concern (Controller), business rule (Service), data access (Repository) আলাদা করা **বাধ্যতামূলক** হয়ে যায়, কারণ framework-ই এই ভাগগুলো চিনে।

- **Testability:** Express handler সাধারণত closure-এর মধ্যে DB client-কে সরাসরি ধরে রাখে, তাই unit test করতে গেলে পুরো DB mock করতে হয় বা supertest দিয়ে integration test-এ যেতে হয়। NestJS-এ dependency constructor দিয়ে আসে, তাই:

```ts
const module = await Test.createTestingModule({
  controllers: [UserController],
  providers: [{ provide: UserService, useValue: { findAll: () => [] } }],
}).compile();
```
এক লাইনে পুরো dependency replace — DB, network, বা Redis ছাড়াই real unit test।

- **Scalability (code + team):** Express-এ কোন module কোন module-এর উপর নির্ভরশীল তা কোথাও লেখা থাকে না — যে কেউ যেকোনো file `require` করতে পারে, ফলে সময়ের সাথে সব কিছু সব কিছুর সাথে coupled হয়ে যায়। NestJS-এ একটা provider ব্যবহার করতে হলে তার module **import** করতে হয় এবং সেই module-কে provider টা **export** করতে হয় — অর্থাৎ dependency-টা explicit, review-able, এবং enforce করা।

- **Error handling:** Express-এ async handler-এ throw করা error automatically catch হয় না (Express 4-এ), প্রতিটা handler-এ `try/catch` বা `asyncHandler` wrapper লাগে। NestJS async handler-এর error নিজেই ধরে global exception filter-এ পাঠায়।

- **Configuration ও lifecycle:** Express-এ DB connect, cache warm-up, graceful shutdown সব হাতে লিখতে হয়। NestJS দেয় `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, `enableShutdownHooks()` — lifecycle hook হিসেবে।

- **Consistency:** NestJS-এর `ValidationPipe`, `ClassSerializerInterceptor`, `HttpException` hierarchy পুরো app-এ একই request validation ও error response shape নিশ্চিত করে; Express-এ এটা প্রতিটা team member-এর discipline-এর উপর নির্ভর করে।

### Who are the typical teams that benefit most from adopting NestJS?

- **মাঝারি থেকে বড় team (৩+ developer):** যেখানে একাধিক মানুষ একই codebase-এ কাজ করে, সেখানে enforced structure-এর মান সবচেয়ে বেশি — কারণ "কোথায় কী লিখব" নিয়ে বিতর্ক বন্ধ হয়ে যায় এবং code review-এ শুধু logic দেখা যায়।
- **Angular ব্যবহার করা full-stack team:** Module, DI, decorator, RxJS — সব ধারণা identical, তাই শেখার খরচ প্রায় শূন্য।
- **Enterprise / long-lived product team:** যে codebase ৩–৫ বছর ধরে maintain হবে এবং developer আসা-যাওয়া করবে, সেখানে predictable structure onboarding cost অনেক কমায়।
- **Microservices বা multi-transport system তৈরি করা team:** একই abstraction-এ HTTP, Kafka, gRPC, RabbitMQ — আলাদা framework শিখতে হয় না।
- **TypeScript-first team:** যারা compile-time safety-কে গুরুত্ব দেয়, তাদের জন্য NestJS-এর DTO + validation + typed config একসাথে কাজ করে।

**কাদের জন্য NestJS অতিরিক্ত (overkill):**

- খুব ছোট script, একটা-দুইটা endpoint-এর webhook, বা throwaway prototype — সেখানে raw Express/Fastify কম boilerplate-এ দ্রুত কাজ সারে।
- Extreme cold-start-sensitive serverless function — NestJS-এর bootstrap (module graph resolve + decorator metadata scan) একটা bare handler-এর তুলনায় বেশি সময় নেয়।
- যে team-এর OOP/DI/decorator-এর সাথে পরিচয় নেই এবং শেখার সময় নেই — শুরুতে productivity কমে যেতে পারে।

**সংক্ষেপে:** NestJS কোনো নতুন capability যোগ করে না যা Express দিয়ে করা যায় না — এটা **একই কাজকে structured, testable এবং team-scalable** করে তোলে। এর দাম হলো একটা learning curve এবং কিছু boilerplate; এর লাভ হলো বড় codebase-এ দীর্ঘমেয়াদি maintainability।

---

## 2. How does NestJS leverage TypeScript?

NestJS-এর পুরো design **TypeScript-এর type information runtime-এ পড়তে পারার** ক্ষমতার উপর দাঁড়িয়ে আছে। সাধারণত TypeScript compile হওয়ার পর সব type মুছে যায় (type erasure), কিন্তু TypeScript-এর `emitDecoratorMetadata` flag চালু থাকলে compiler **decorator-যুক্ত class-এর constructor parameter-এর type-গুলো `reflect-metadata` দিয়ে JS output-এ লিখে রাখে**। NestJS ঠিক এই metadata পড়েই বুঝতে পারে কোন class-এর কোন dependency লাগবে।

তাই বলা যায় — **NestJS-এর DI container টিকে আছে TypeScript-এর emitted metadata-র উপর**, শুধু syntactic sugar হিসেবে TypeScript ব্যবহার করা হয়নি।

```ts
// আপনি যা লেখেন
@Injectable()
export class UserService {
  constructor(private readonly mail: MailService, private readonly db: DbService) {}
}
```

```js
// compiler যা emit করে (সরলীকৃত)
UserService = __decorate([
  Injectable(),
  // এই লাইনটাই আসল জাদু — constructor parameter-এর type list runtime-এ পাওয়া যাচ্ছে
  __metadata("design:paramtypes", [MailService, DbService])
], UserService);
```

NestJS internally মূলত এটা করে: `Reflect.getMetadata('design:paramtypes', UserService)` → `[MailService, DbService]` → এই দুইটা token DI container-এ resolve করে → `new UserService(mailInstance, dbInstance)`।

### What specific TypeScript features (decorators, metadata reflection, generics) improve NestJS development?

- **Decorators:** পুরো framework-এর declarative API-ই decorator-ভিত্তিক। `@Module`, `@Controller`, `@Get`, `@Injectable`, `@Body`, `@UseGuards` — প্রতিটাই আসলে class/method/parameter-এ metadata attach করে, যেটা NestJS bootstrap-এর সময় scan করে routing table ও provider graph বানায়। এর ফলে configuration আর code পাশাপাশি থাকে (colocation), আলাদা XML/JSON config file লাগে না।

- **Metadata reflection (`reflect-metadata`):** `design:paramtypes`, `design:type`, `design:returntype` — এই তিনটা emitted metadata key দিয়ে NestJS type থেকেই injection token বের করে। এটাই কারণ, আপনাকে `@Inject(MailService)` লিখতে হয় না — শুধু `private mail: MailService` লিখলেই হয়।

- **Generics:** Type-safe reusable abstraction তৈরি করতে ব্যাপকভাবে ব্যবহৃত হয় — `Repository<User>`, `ConfigService.get<string>('PORT')`, `NestInterceptor<T, R>`, `PipeTransform<Input, Output>`, `Observable<Response<T>>`। এর ফলে generic interceptor বা pagination wrapper লিখলেও return type সঠিকভাবে infer হয়।

- **Interface + abstract class:** Contract define করে implementation swap করা যায় (`NestInterceptor`, `CanActivate`, `ExceptionFilter`, `OnModuleInit` — সবগুলোই interface)। Abstract class-কে injection token হিসেবেও ব্যবহার করা যায়, যা interface দিয়ে সম্ভব নয় (কারণ interface runtime-এ থাকে না)।

- **Access modifier + parameter property:** `constructor(private readonly svc: Svc) {}` — এক লাইনেই declare + assign, TypeScript-এর parameter property feature-এর কারণে। NestJS code এত সংক্ষিপ্ত দেখায় মূলত এই কারণে।

- **Enum ও union type:** DTO-তে `@IsEnum(UserRole)` দিয়ে validation, এবং একই enum type-safe ভাবে service ও database layer-এ reuse করা যায়।

- **Utility type:** `PartialType`, `PickType`, `OmitType` (`@nestjs/swagger`/`@nestjs/mapped-types`) — `UpdateUserDto extends PartialType(CreateUserDto)` লিখে DTO duplication এড়ানো যায়, TypeScript-এর `Partial<T>`-এর runtime সমতুল্য হিসেবে।

```ts
// Generics-এর বাস্তব ব্যবহার — যেকোনো response একই envelope-এ wrap করা
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_ctx: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    // T যা-ই হোক, return type সঠিকভাবে ApiResponse<T> হিসেবে infer হবে
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}
```

### How does `emitDecoratorMetadata` in `tsconfig.json` enable NestJS's dependency injection?

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,   // decorator syntax ব্যবহারের অনুমতি
    "emitDecoratorMetadata": true,    // decorator-যুক্ত class-এর type info runtime-এ emit করা
    "target": "ES2021",
    "module": "commonjs"
  }
}
```

ধাপে ধাপে কী ঘটে:

1. `main.ts`-এর একেবারে শুরুতে `import 'reflect-metadata'` load হয় (NestJS নিজেই এটা import করে), যা global `Reflect` object-এ `getMetadata`/`defineMetadata` API যোগ করে।
2. Compile-এর সময় `emitDecoratorMetadata: true` থাকলে TypeScript প্রতিটা decorated class-এর জন্য `Reflect.metadata("design:paramtypes", [...])` call emit করে — constructor parameter-এর **actual class reference** সহ।
3. Bootstrap-এ NestJS প্রতিটা provider-এর জন্য `Reflect.getMetadata('design:paramtypes', TargetClass)` পড়ে dependency list পায়।
4. প্রতিটা dependency-কে token হিসেবে ধরে module-এর provider registry-তে খোঁজে, না পেলে সেই সুপরিচিত error দেয়: `Nest can't resolve dependencies of the UserService (?). Please make sure that the argument MailService at index [0] is available in the UserModule context.`
5. সব dependency resolve হলে topological order-এ instantiate করে singleton হিসেবে container-এ cache করে রাখে।

**`emitDecoratorMetadata: false` করলে কী হয়?** সব class-based injection ভেঙে পড়ে — NestJS আর জানে না constructor-এ কী লাগবে, তাই `undefined` inject করে বা "cannot read property of undefined" জাতীয় runtime error দেয়। তখন প্রতিটা dependency-তে explicit `@Inject(MailService)` লিখতে বাধ্য হতে হয়।

**গুরুত্বপূর্ণ সীমাবদ্ধতা:** `emitDecoratorMetadata` শুধু **class-কে token হিসেবে** কাজ করাতে পারে। Interface বা type alias compile-এর পর মুছে যায় (`design:paramtypes`-এ `Object` হিসেবে emit হয়), তাই interface কখনো injection token হতে পারে না — এই কারণেই string/Symbol token বা abstract class ব্যবহার করতে হয়:

```ts
// ❌ কাজ করবে না — interface runtime-এ থাকে না
constructor(private readonly repo: IUserRepository) {}

// ✅ সমাধান ১ — string/Symbol token + @Inject
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: IUserRepository) {}
}

// module-এ:
providers: [{ provide: USER_REPOSITORY, useClass: PrismaUserRepository }]

// ✅ সমাধান ২ — abstract class token হিসেবে (runtime-এ থাকে, তাই @Inject লাগে না)
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
}
providers: [{ provide: UserRepository, useClass: PrismaUserRepository }]
```

### What happens if you try to use NestJS with plain JavaScript?

NestJS-এ plain JavaScript ব্যবহার করা **technically সম্ভব, কিন্তু বাস্তবে অত্যন্ত অসুবিধাজনক** — কারণ decorator ও metadata emission দুটোই TypeScript (বা Babel-এর decorator plugin)-এর উপর নির্ভরশীল।

- **Type-based DI কাজ করে না:** JS-এ কোনো `design:paramtypes` metadata emit হয় না, তাই প্রতিটা dependency-তে `@Inject()` explicitly লিখতে হয়, অথবা Babel plugin দিয়ে metadata emit করাতে হয়।
- **Decorator experimental syntax দরকার:** `@babel/plugin-proposal-decorators` (legacy mode) + `@babel/plugin-proposal-class-properties` + `babel-plugin-transform-typescript-metadata` — এই combination ছাড়া decorator parse-ই হবে না।
- **DTO validation প্রায় অকার্যকর:** `class-validator` decorator + `ValidationPipe`-এর মূল সুবিধা type-driven transformation; JS-এ property type না থাকায় `transform` ঠিকভাবে কাজ করে না।
- **কোনো compile-time safety নেই:** `Nest can't resolve dependencies` জাতীয় ভুল যা TS-এ IDE-তেই ধরা পড়ত, সেটা production runtime-এ গিয়ে ধরা পড়বে।
- **Editor support ও generic হারিয়ে যায়:** Autocomplete, refactor safety, `Repository<User>`-এর মতো typed API — সব চলে যায়।
- **Ecosystem-এর সব example TS-এ:** Official documentation, Nest CLI-generated code, community package — সবই TypeScript ধরে নিয়ে লেখা, তাই প্রতিটা সমস্যার সমাধান নিজেকে অনুবাদ করে নিতে হবে।

**সংক্ষেপে:** NestJS-এ TypeScript "optional nicety" নয় — DI container-এর কাজ করার শর্ত। JavaScript-এ NestJS চালানো মানে framework-এর সবচেয়ে বড় সুবিধাগুলো (type-driven DI, validation, safety) হারিয়ে শুধু structure-টা রাখা, যেটা খরচের তুলনায় খুব কম লাভ।

---

## 3. What is the architectural style of NestJS?

NestJS-এর architectural style-কে বলা যায় **modular, layered, decorator-driven architecture** যার কেন্দ্রে আছে **Dependency Injection** এবং **Inversion of Control (IoC)**। Official documentation এটাকে বর্ণনা করে "**platform-agnostic, progressive framework**" হিসেবে, যা তিনটা programming paradigm একসাথে মিশিয়ে ব্যবহার করতে দেয়।

কাঠামোগতভাবে এটা মূলত:

- **Modular monolith by default** — পুরো app ছোট ছোট self-contained module-এর graph, যেগুলো প্রয়োজনে আলাদা microservice-এ কেটে নেওয়া যায়।
- **Layered (n-tier)** — Controller (presentation) → Service (application/business) → Repository (data access)।
- **Aspect-oriented flavour** — Guard, Interceptor, Pipe, Filter দিয়ে cross-cutting concern-কে business logic থেকে সম্পূর্ণ আলাদা রাখা হয়।
- **Hexagonal/Clean architecture-friendly** — DI + custom provider token থাকার কারণে domain layer-কে infrastructure থেকে সহজে decouple করা যায়।

### How does NestJS combine OOP, functional programming, and reactive programming?

- **OOP (Object-Oriented Programming) — মূল ভিত্তি:**
  - সব building block class: Controller, Service, Guard, Interceptor, Pipe, Filter।
  - Encapsulation (`private readonly`), inheritance (`extends PrismaClient`, custom `HttpException` subclass), polymorphism (একই interface-এর একাধিক implementation, `useClass` দিয়ে swap), abstraction (abstract class token) — চারটাই সরাসরি ব্যবহৃত হয়।
  - Interface-driven contract: `CanActivate`, `NestInterceptor`, `PipeTransform`, `ExceptionFilter`।

- **FP (Functional Programming) — যেখানে state দরকার নেই:**
  - Custom decorator factory (`createParamDecorator((data, ctx) => ...)`) — pure function।
  - `useFactory` provider — factory function দিয়ে value তৈরি।
  - Middleware-কে function হিসেবেই লেখা যায় (`app.use((req, res, next) => ...)`)。
  - Pipe/Interceptor-এর ভিতরের transformation logic সাধারণত pure, side-effect-free function।
  - Immutability-র চর্চা: DTO-কে না mutate করে নতুন object return করা।

- **FRP (Functional Reactive Programming) — RxSJ দিয়ে:**
  - Interceptor-এর `intercept()` একটা `Observable` ফেরত দেয়, ফলে response stream-এর উপর RxJS operator চেইন করা যায় — `map`, `tap`, `catchError`, `timeout`, `retry`, `mergeMap`।
  - Microservices client (`ClientProxy.send()`) `Observable` ফেরত দেয়।
  - GraphQL subscription ও SSE (`@Sse()`) — দুটোই Observable-ভিত্তিক stream।

```ts
// একই interceptor-এ তিনটা paradigm একসাথে
@Injectable()
export class TimeoutRetryInterceptor implements NestInterceptor {   // OOP: class + interface
  private readonly logger = new Logger(TimeoutRetryInterceptor.name);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const started = Date.now();

    return next.handle().pipe(          // FRP: Observable stream
      timeout(3000),                    // ৩ সেকেন্ডের বেশি হলে fail
      retry({ count: 2, delay: 200 }),  // দুইবার retry
      map((data) => ({ ...data, servedAt: new Date().toISOString() })), // FP: pure transform, mutation নেই
      tap(() => this.logger.log(`took ${Date.now() - started}ms`)),
      catchError((err) => throwError(() => new RequestTimeoutException(err.message))),
    );
  }
}
```

### How does NestJS enforce a layered architecture (controllers, services, repositories)?

NestJS "enforce" করে মূলত **framework-level responsibility আলাদা করে দিয়ে** — প্রতিটা layer-এর নিজস্ব decorator ও lifecycle আছে, ফলে ভুল জায়গায় code লিখলে সেটা চোখে পড়ে এবং awkward লাগে।

| Layer | Decorator/টুল | দায়িত্ব | যা করা উচিত নয় |
|---|---|---|---|
| **Controller** (presentation) | `@Controller`, `@Get`, `@Body`, `@Param` | Route define, request parse, DTO bind, service call, response return | Business rule, SQL, external API call |
| **Service** (application/business) | `@Injectable()` | Business rule, orchestration, transaction boundary, domain validation | `req`/`res` object ছোঁয়া, HTTP status নিয়ে ভাবা |
| **Repository** (data access) | `@InjectRepository`, `PrismaService` | Query, persistence, mapping | Business decision নেওয়া |
| **Cross-cutting** | Guard / Interceptor / Pipe / Filter | Auth, logging, validation, error shaping | Domain logic রাখা |

কীভাবে বাস্তবে enforce হয়:

- **Controller-এ HTTP object সাধারণত লাগেই না:** `@Body()`, `@Query()`, `@Param()` decorator থাকায় `req` ছোঁয়ার দরকার হয় না; তাই Controller স্বাভাবিকভাবেই thin থাকে।
- **Service-এ `req` পাওয়ার সহজ উপায় নেই:** Request object service-এ নিতে গেলে `REQUEST` scope inject করতে হয়, যেটা ইচ্ছাকৃতভাবে "একটু কষ্টকর" — এই friction-ই developer-কে HTTP concern controller-এ রাখতে উৎসাহিত করে।
- **Validation pipeline-এ সরে যায়:** `ValidationPipe` handler-এর আগেই DTO validate করে, তাই "if (!body.email) throw" জাতীয় code service-এ জমে না।
- **Module boundary:** এক module-এর provider অন্য module-এ পেতে explicit `exports` + `imports` লাগে — এটাই layer/domain leak আটকানোর প্রধান হাতিয়ার।
- **ESLint + monorepo boundary rule** দিয়ে এটাকে আরও শক্ত করা যায় (যেমন controller থেকে সরাসরি repository import নিষিদ্ধ করা)।

```ts
// Controller — thin, শুধু HTTP mapping
@Controller('orders')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.placeOrder(dto);   // কোনো business rule এখানে নেই
  }
}

// Service — business rule, HTTP সম্পর্কে কিছুই জানে না
@Injectable()
export class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly payments: PaymentService,
  ) {}

  async placeOrder(dto: CreateOrderDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }
    const total = dto.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    await this.payments.charge(dto.userId, total);
    return this.repo.create({ ...dto, total });
  }
}

// Repository — শুধু persistence
@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data });
  }
}
```

### What is the NestJS request pipeline from incoming HTTP request to outgoing response?

এটা interview-এর সবচেয়ে ঘনঘন জিজ্ঞাসিত NestJS প্রশ্ন। সম্পূর্ণ order:

```
Incoming HTTP Request
        │
        ▼
1. Global Middleware            (app.use / MiddlewareConsumer — Express-level, DI পায়)
        │
        ▼
2. Guards                       (global → controller → route)   ── canActivate() false হলে 403
        │
        ▼
3. Interceptors (pre-handler)   (next.handle() call করার আগের অংশ)
        │
        ▼
4. Pipes                        (parameter-level transform + validation) ── fail হলে 400
        │
        ▼
5. Route Handler (Controller method) → Service → Repository → DB
        │
        ▼
6. Interceptors (post-handler)  (Observable stream-এর map/tap/catchError অংশ)
        │
        ▼
7. Exception Filters            (উপরের যেকোনো ধাপে exception হলে এখানে এসে response shape হয়)
        │
        ▼
Outgoing HTTP Response
```

**খেয়াল রাখার সূক্ষ্ম বিষয়গুলো:**

- **Middleware সবার আগে, এবং সে NestJS-এর `ExecutionContext` পায় না** — সে Express/Fastify-র `(req, res, next)` দেখে। তাই route metadata বা DTO সে জানে না।
- **Guard, Pipe-এর আগে চলে।** অর্থাৎ Guard-এর ভিতরে `request.body` তখনও validated/transformed নয় — এটা একটা সাধারণ ভুলের জায়গা।
- **Interceptor দুইবার "চলে":** `next.handle()`-এর আগের code request-এর পথে, আর `.pipe(...)`-এর ভিতরের operator response-এর পথে।
- **একই ধরনের multiple binding-এর order:** global → controller-level → method-level।
- **`@Res()` ব্যবহার করে নিজে response পাঠালে** NestJS-এর response pipeline (interceptor-এর post অংশ, serialization) bypass হয়ে যায় — এজন্য `@Res({ passthrough: true })` ব্যবহার করা ভালো।
- **Exception filter সবচেয়ে বাইরের layer** — middleware-এর ভিতরে throw করা error কিন্তু NestJS filter নয়, underlying platform-এর error handler ধরে।

**সংক্ষেপে:** NestJS-এর architectural style হলো **OOP-কে backbone করে, cross-cutting concern-কে aspect হিসেবে আলাদা করে, এবং response stream-কে reactive ভাবে handle করা একটা layered modular architecture** — যেখানে DI container পুরো graph একসাথে বেঁধে রাখে।

---

## 4. What are the main components of a NestJS application?

একটা NestJS application মূলত **আটটা building block**-এর সমন্বয়। প্রতিটার একটা নির্দিষ্ট দায়িত্ব এবং request pipeline-এ একটা নির্দিষ্ট জায়গা আছে।

| Component | Decorator | pipeline-এ কখন চলে | মূল কাজ |
|---|---|---|---|
| **Module** | `@Module()` | Bootstrap-এ (runtime নয়) | Component-দের একসাথে বাঁধা, boundary নির্ধারণ |
| **Controller** | `@Controller()` | ধাপ ৫ | Route define, request → response mapping |
| **Provider/Service** | `@Injectable()` | Controller থেকে call হয় | Business logic, reusable dependency |
| **Middleware** | `NestMiddleware` | ধাপ ১ (সবার আগে) | Raw request-level কাজ (raw body, correlation ID, helmet) |
| **Guard** | `CanActivate` | ধাপ ২ | Authorization — এই request-টা আদৌ চলবে কি না |
| **Interceptor** | `NestInterceptor` | ধাপ ৩ ও ৬ | Request/response wrap — logging, cache, transform, timeout |
| **Pipe** | `PipeTransform` | ধাপ ৪ | Input transform + validation |
| **Exception Filter** | `ExceptionFilter` | ধাপ ৭ | Error catch করে consistent response shape দেওয়া |

### What is the role of each building block: modules, controllers, providers, guards, interceptors, pipes, and filters?

- **Module** — application-এর organizational unit; একটা feature-এর controller, provider, এবং কোন module-এর উপর সে নির্ভরশীল তা ঘোষণা করে। Root module (`AppModule`) থেকে শুরু করে NestJS পুরো dependency graph তৈরি করে। Module-ই encapsulation boundary: `exports` না করলে provider বাইরে থেকে পাওয়া যায় না।

- **Controller** — নির্দিষ্ট route-এর জন্য incoming request গ্রহণ করে, DTO-তে bind করে, উপযুক্ত service-কে call করে, এবং return value ফেরত দেয় (NestJS নিজেই সেটা serialize করে পাঠায়)। এখানে কোনো business rule থাকা উচিত নয়।

- **Provider (Service, Repository, Factory, Helper)** — DI container-এ registered যেকোনো কিছু। সবচেয়ে সাধারণ রূপ Service — business logic-এর ধারক। Provider class হতে হবে না; value বা factory-ও হতে পারে (`useValue`, `useFactory`)।

- **Middleware** — Express/Fastify-র middleware-এর সমতুল্য, route handler-এর অনেক আগেই চলে। সবচেয়ে উপযুক্ত সেসব কাজে যেখানে raw `req`/`res` দরকার: request ID assign, raw body ধরে রাখা (webhook signature verify), third-party Express middleware (helmet, cookie-parser, morgan) mount করা।

- **Guard** — একটাই প্রশ্নের উত্তর দেয়: "এই request handler পর্যন্ত পৌঁছাবে কি না?" `canActivate()` থেকে `false`/throw করলে NestJS `403 Forbidden` দেয়। Authentication (`AuthGuard('jwt')`) এবং authorization (`RolesGuard`) — দুটোরই আদর্শ জায়গা, কারণ Guard `ExecutionContext` পায়, তাই route metadata (`@Roles('admin')`) পড়তে পারে।

- **Interceptor** — handler-এর চারপাশে wrap করে; আগে-পরে দুই জায়গাতেই কাজ করতে পারে এবং response stream পরিবর্তন করতে পারে। Use case: request/response logging, execution time measure, response envelope, caching, `ClassSerializerInterceptor` দিয়ে `@Exclude()` field বাদ দেওয়া, `TimeoutInterceptor`।

- **Pipe** — handler parameter-এর উপর কাজ করে; দুইটা দায়িত্ব: **transformation** (`'42'` → `42`, plain object → DTO instance) এবং **validation** (নিয়ম না মানলে `BadRequestException`)। Built-in: `ValidationPipe`, `ParseIntPipe`, `ParseUUIDPipe`, `ParseBoolPipe`, `DefaultValuePipe`।

- **Exception Filter** — যেকোনো unhandled exception ধরে HTTP response-এ রূপান্তর করে। Built-in global filter `HttpException` ও তার subclass handle করে; custom filter দিয়ে database error, domain exception, বা error body-র shape নিজের মতো করা যায়।

**আরও দুইটা যা প্রায়ই এই তালিকায় যোগ হয়:**

- **Custom Decorator** — `@CurrentUser()`, `@Roles()` — repetitive boilerplate কমায়।
- **Lifecycle hook** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, `BeforeApplicationShutdown` — startup/shutdown সময়ের কাজ।

### Which component is most critical for scalability and why?

**Module (এবং তার পেছনের DI container) — এটাই সবচেয়ে গুরুত্বপূর্ণ**, দুই অর্থেই: code scalability এবং team scalability।

কারণগুলো:

- **Boundary তৈরি করে:** Module-ই ঠিক করে কোন code কোন code দেখতে পাবে। এই encapsulation ছাড়া বড় codebase অনিবার্যভাবে "big ball of mud"-এ পরিণত হয়, যেখানে একটা পরিবর্তন কোথায় কী ভাঙবে তা কেউ জানে না।
- **Microservice-এ কাটার প্রস্তুতি:** ভালোভাবে আলাদা করা module মানে কোন অংশটা আলাদা service হতে পারে তার rehearsal আগেই হয়ে আছে — module-টাকে তুলে নিয়ে আলাদা app বানানো তুলনামূলক সহজ।
- **Team scalability:** প্রতিটা team একটা module-এর owner হতে পারে, merge conflict ও coordination cost কমে।
- **DI graph-ই performance-এর ভিত্তি:** Provider singleton হিসেবে একবার তৈরি হয়ে reuse হয় — এটাই per-request overhead কম রাখে। এখানে ভুল করলে (যেমন অকারণে সব provider `REQUEST`-scoped করা) throughput সরাসরি পড়ে যায়।

তবে **"critical"-এর মানে context-নির্ভর:**

- **Throughput/latency scalability** → **Interceptor + provider scope** সবচেয়ে বড় প্রভাব ফেলে (caching interceptor, singleton vs request scope, N+1 এড়ানো)।
- **Security scalability** → **Guard** (একটা global guard দিয়ে পুরো app protect করা, প্রতিটা route-এ আলাদা check না লিখে)।
- **Codebase/team scalability** → **Module** — এবং interview-এ এটাই প্রত্যাশিত উত্তর।

### How do these components map to the responsibilities in a clean architecture?

Clean Architecture-এর কেন্দ্রীয় নিয়ম: **dependency সবসময় বাইরের layer থেকে ভিতরের দিকে যাবে; domain কখনো infrastructure-এর উপর নির্ভর করবে না।** NestJS-এর DI + custom token এই নিয়ম মানা সহজ করে দেয়।

| Clean Architecture layer | NestJS-এ কী | নিয়ম |
|---|---|---|
| **Entities / Domain** | Plain TS class, value object, domain exception | কোনো NestJS বা ORM decorator থাকা উচিত নয় — framework-independent |
| **Use Cases / Application** | `@Injectable()` service (বা `CommandHandler`, `QueryHandler`) | শুধু abstract interface/token-এর উপর নির্ভর করবে |
| **Interface Adapters** | Controller, GraphQL Resolver, Gateway, Presenter/DTO mapper | Domain-কে বাইরের protocol-এ অনুবাদ করে |
| **Infrastructure** | `PrismaService`, `TypeOrmRepository`, `HttpService`, `BullMQ` processor, mailer | Abstract port-এর concrete implementation |
| **Cross-cutting** | Guard, Interceptor, Pipe, Filter | Domain-কে না ছুঁয়ে policy/plumbing enforce করে |

```ts
// Domain layer — framework-এর কোনো চিহ্ন নেই (pure TypeScript)
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private passwordHash: string,
  ) {}

  isSameAs(other: User) {
    return this.id === other.id;
  }
}

// Application layer — শুধু abstract port-এর উপর নির্ভরশীল, Prisma/TypeORM চেনে না
export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly users: UserRepositoryPort) {}   // interface নয়, abstract class = valid token

  async execute(email: string, hash: string): Promise<User> {
    if (await this.users.findByEmail(email)) {
      throw new EmailAlreadyTakenError(email);   // domain exception, HttpException নয়
    }
    const user = new User(crypto.randomUUID(), email, hash);
    await this.users.save(user);
    return user;
  }
}

// Infrastructure layer — port-এর concrete implementation
@Injectable()
export class PrismaUserRepository extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) { super(); }

  async findByEmail(email: string) {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? new User(row.id, row.email, row.passwordHash) : null;
  }

  async save(user: User) { /* mapping + persist */ }
}

// Composition root — module-এ port ↔ adapter জোড়া লাগানো হয়
@Module({
  providers: [
    RegisterUserUseCase,
    { provide: UserRepositoryPort, useClass: PrismaUserRepository },  // এখানেই direction উল্টে যায় (DIP)
  ],
})
export class UserModule {}
```

**সংক্ষেপে:** NestJS-এর building block-গুলো clean architecture-এর layer-এর সাথে প্রায় এক-এক করে মেলে, এবং `{ provide: AbstractPort, useClass: ConcreteAdapter }` pattern-টাই Dependency Inversion Principle-এর বাস্তব রূপ — domain এখানে কখনো Prisma/TypeORM-এর নাম জানে না।

---

## 5. How does NestJS differ from Express or Fastify?

সবচেয়ে গুরুত্বপূর্ণ কথাটা আগে: **NestJS আর Express/Fastify একই স্তরের প্রতিযোগী নয়।** Express ও Fastify হলো **HTTP library/server framework** (minimal, unopinionated), আর NestJS হলো **application framework** যেটা এদের একটাকে নিচে ব্যবহার করে। NestJS ছাড়া Express চলে, কিন্তু Express (বা Fastify) ছাড়া NestJS-এর HTTP layer চলে না।

| বিষয় | Express | Fastify | NestJS |
|---|---|---|---|
| ধরন | Minimal HTTP framework | High-performance HTTP framework | Full application framework (Express/Fastify-এর উপরে) |
| Opinion | প্রায় শূন্য | কম | অনেক বেশি (module, DI, layering) |
| DI container | নেই | নেই | Built-in |
| TypeScript | Community typings | ভালো native support | First-class, DI-র জন্য অপরিহার্য |
| Validation | Manual / middleware | JSON Schema-based, built-in | `ValidationPipe` + class-validator |
| Structure | আপনি ঠিক করবেন | আপনি ঠিক করবেন | Framework ঠিক করে দেয় |
| Performance | Baseline | Express-এর চেয়ে উল্লেখযোগ্য দ্রুত | Underlying adapter-এর উপর নির্ভরশীল (~1–5% Nest overhead) |
| Microservices/GraphQL/WebSocket | Manual integration | Manual integration | First-party module (`@nestjs/microservices`, `@nestjs/graphql`, `@nestjs/websockets`) |
| শেখার খরচ | কম | কম-মাঝারি | বেশি |
| উপযুক্ত | ছোট service, prototype | Performance-critical API | মাঝারি-বড় team, দীর্ঘজীবী product |

### When would you choose Fastify as the underlying HTTP adapter over Express in NestJS?

**Fastify বাছবেন যখন:**

- **Throughput/latency আসল constraint:** Fastify-র fast JSON serialization (schema-based `fast-json-stringify`) এবং হালকা routing benchmark-এ Express-এর তুলনায় প্রায় ২× পর্যন্ত request/sec দিতে পারে। যে API প্রতি সেকেন্ডে হাজারো ছোট JSON response পাঠায়, সেখানে পার্থক্য বাস্তবে টের পাওয়া যায়।
- **JSON-heavy, high-volume payload:** Serialization-ই যেখানে bottleneck, সেখানে Fastify-র schema-driven serializer সবচেয়ে বড় লাভ দেয়।
- **Built-in schema validation চাই:** Fastify route-level JSON Schema দিয়ে validation ও serialization একসাথে করে।
- **Modern plugin ecosystem গ্রহণযোগ্য:** `@fastify/helmet`, `@fastify/rate-limit`, `@fastify/multipart` ইত্যাদি দিয়েই চলবে।
- **HTTP/2 বা native async/await-first middleware দরকার।**

**Express-এই থাকবেন যখন:**

- **Express-specific middleware-এর উপর নির্ভরতা আছে** — অনেক পুরনো/enterprise middleware শুধু Express-এর `(req, res, next)` signature ধরে লেখা।
- **কোনো third-party NestJS package Express ধরে নেয়** — যেমন কিছু auth strategy, file upload helper, বা legacy `csurf`।
- **Bottleneck HTTP layer নয়** — বাস্তব API-তে সময়ের বড় অংশ DB query ও external call-এ যায়; সেখানে adapter বদলে ২–৩% লাভ হয়, যা প্রায়ই migration cost-এর যোগ্য নয়।
- **Team-এর Express-এ অভিজ্ঞতা বেশি এবং debugging সহজ রাখা দরকার।**

**বাস্তব পরামর্শ:** আগে profile করুন। Adapter বদলানো সবচেয়ে সহজ optimization হলেও প্রায়ই সবচেয়ে কম প্রভাবশালী — index missing বা N+1 query ঠিক করলে সাধারণত অনেক বেশি লাভ হয়।

### What is the NestJS platform abstraction and how do you swap the underlying HTTP driver?

NestJS-এর **platform abstraction** মানে: framework নিজে সরাসরি Express বা Fastify-র API-র উপর নির্ভর করে না, বরং একটা interface — `AbstractHttpAdapter` — এর উপর নির্ভর করে। `ExpressAdapter` ও `FastifyAdapter` সেই interface-এর দুইটা implementation। ফলে আপনার Controller, Service, Guard, Interceptor-এর code প্রায় অপরিবর্তিত রেখেই নিচের HTTP driver বদলে দেওয়া যায়।

```ts
// main.ts — Express (default)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);   // ভিতরে ExpressAdapter ব্যবহার হয়
  await app.listen(3000);
}
bootstrap();
```

```ts
// main.ts — Fastify-তে swap করা
// npm i @nestjs/platform-fastify
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, bodyLimit: 10 * 1024 * 1024 }),
  );

  // Fastify-এ 0.0.0.0 explicitly দিতে হয় (container-এ না দিলে বাইরে থেকে reach করা যায় না)
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

Adapter-নিরপেক্ষভাবে underlying instance পেতে `HttpAdapterHost` ব্যবহার করা হয় — global exception filter-এ এটা খুব দরকারি:

```ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // Express না Fastify — filter-কে জানতে হচ্ছে না
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    httpAdapter.reply(ctx.getResponse(), { statusCode: status, timestamp: new Date().toISOString() }, status);
  }
}
```

**Swap করার সময় যা ভাঙতে পারে:**

- Express-only middleware (`csurf`, কিছু `express-*` package) — Fastify plugin দিয়ে বদলাতে হবে।
- `@Res()` দিয়ে সরাসরি `res.status().json()` লেখা code — Fastify-তে API আলাদা (`reply.status().send()`)।
- Static asset ও view: `useStaticAssets`/`setViewEngine`-এর জন্য `@fastify/static`, `@fastify/view` দরকার।
- File upload: `FileInterceptor` (multer, Express) কাজ করবে না — `@fastify/multipart` ব্যবহার করতে হবে।
- Socket.IO ব্যবহার করলে adapter setup আলাদা করে যাচাই করা দরকার।

### What does NestJS add on top of Express that Express does not provide out of the box?

- **DI container ও IoC** — provider graph, scope, custom token, circular dependency resolution।
- **Module system** — explicit boundary, `imports`/`exports`, dynamic module (`forRoot`/`forRootAsync`), global module।
- **Declarative routing** — `@Controller`/`@Get` decorator থেকে routing table তৈরি হয়; সাথে built-in API versioning (`URI`, `Header`, `Media type`, `Custom`)।
- **Structured request pipeline** — Guard, Interceptor, Pipe, Filter — Express-এ যা সব "middleware" নামে একসাথে মিশে থাকে, এখানে তা আলাদা, testable abstraction।
- **Validation ও serialization** — `ValidationPipe` (class-validator), `ClassSerializerInterceptor` (class-transformer)।
- **Async error handling** — async handler-এ throw করা error automatically ধরা পড়ে।
- **Lifecycle hook** — `OnModuleInit` থেকে `BeforeApplicationShutdown` পর্যন্ত, সাথে `enableShutdownHooks()` দিয়ে graceful shutdown।
- **Testing infrastructure** — `@nestjs/testing`-এর `Test.createTestingModule()`, `overrideProvider()`।
- **First-party integration** — Microservices (Kafka/NATS/gRPC/RabbitMQ/Redis), GraphQL, WebSocket, Swagger (`@nestjs/swagger`), Config (`@nestjs/config`), Scheduling (`@nestjs/schedule`), Queue (`@nestjs/bullmq`), Health check (`@nestjs/terminus`), Cache, Throttler।
- **CLI ও schematics** — `nest g resource`, monorepo support (`nest g app`, `nest g lib`)।
- **Platform abstraction** — Express ↔ Fastify swap, এবং একই application context-কে HTTP ছাড়াও microservice/CLI হিসেবে চালানো (`createApplicationContext`)।

**সংক্ষেপে:** Express দেয় একটা **HTTP toolkit**; NestJS দেয় একটা **application architecture** — যার দাম abstraction ও bootstrap overhead, আর লাভ consistency, testability ও দীর্ঘমেয়াদি maintainability।

---

## 6. What is the role of the `@nestjs/core` package?

`@nestjs/core` হলো NestJS-এর **runtime engine** — যে অংশটা আসলে application চালায়। `@nestjs/common` যদি হয় "আপনি যা লেখেন" (decorator, interface, built-in pipe/exception), তাহলে `@nestjs/core` হলো "যা সেই লেখাকে কাজ করায়"।

`@nestjs/core`-এর মূল দায়িত্ব:

- **IoC container:** Provider scan করা, dependency graph তৈরি করা, topological order-এ instantiate করা, singleton cache রাখা।
- **Metadata scanning:** Decorator-এর রেখে যাওয়া metadata (`reflect-metadata`) পড়ে module graph ও routing table বানানো।
- **Bootstrapping:** `NestFactory` দিয়ে application তৈরি করা এবং underlying platform (Express/Fastify/microservice transport)-এর সাথে জোড়া লাগানো।
- **Request pipeline execution:** Guard → Interceptor → Pipe → handler → Filter — এই order-এ enhancer চালানো।
- **Lifecycle management:** `OnModuleInit` থেকে `OnApplicationShutdown` পর্যন্ত hook সঠিক ক্রমে call করা।
- **Router ও exception layer:** RouterExplorer, RouterProxy, base exception filter।

### What key classes does `@nestjs/core` export (NestFactory, Reflector, ContextIdFactory)?

| Export | কাজ | কখন নিজে ব্যবহার করবেন |
|---|---|---|
| **`NestFactory`** | Application তৈরি করার static factory: `create()`, `createMicroservice()`, `createApplicationContext()` | প্রতিটা `main.ts`-এ |
| **`Reflector`** | Decorator-এ set করা metadata পড়ার helper (`get`, `getAllAndOverride`, `getAllAndMerge`) | প্রতিটা custom Guard/Interceptor-এ, যেখানে `@Roles()`-এর মতো metadata পড়তে হয় |
| **`ModuleRef`** | Container-কে runtime-এ query করা: `get()`, `resolve()`, `create()` | Dynamic/conditional resolution, request-scoped provider হাতে পাওয়া, factory pattern |
| **`ContextIdFactory`** | Request-scoped provider resolve করার জন্য context ID তৈরি | Custom durable provider, multi-tenant, microservice-এ request scope |
| **`HttpAdapterHost`** | Underlying HTTP adapter (Express/Fastify instance) হাতে পাওয়া | Global exception filter, platform-নিরপেক্ষ code |
| **`DiscoveryModule` / `DiscoveryService`** | নির্দিষ্ট decorator-যুক্ত সব provider/handler খুঁজে বের করা | Plugin system, custom decorator-ভিত্তিক framework লেখা |
| **`APP_GUARD`, `APP_PIPE`, `APP_INTERCEPTOR`, `APP_FILTER`** | DI-সহ global enhancer register করার token | Global guard/pipe-এ dependency inject করতে হলে |
| **`REQUEST`** | Request-scoped provider-এ current request inject করার token | Multi-tenancy, request-scoped logger |
| **`BaseExceptionFilter`** | Built-in filter, যেটা extend করে fallback behaviour ধরে রাখা যায় | Custom global filter লিখে unknown error default-এ পাঠাতে |
| **`RouterModule`** | Route prefix/hierarchy declarative ভাবে define করা | Module-ভিত্তিক route grouping |

```ts
// Reflector — Guard-এ metadata পড়ার আদর্শ ব্যবহার
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // method-level metadata আগে, না পেলে controller-level
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required?.length) return true;             // কোনো role চাওয়া হয়নি → allow

    const { user } = ctx.switchToHttp().getRequest();
    return required.some((role) => user?.roles?.includes(role));
  }
}
```

```ts
// APP_GUARD — global guard যেটা DI পায় (app.useGlobalGuards() দিয়ে DI পাওয়া যায় না)
@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, transform: true }) },
  ],
})
export class AppModule {}
```

### Can you name a scenario where you interact directly with `@nestjs/core` beyond bootstrapping?

- **Guard/Interceptor-এ `Reflector` দিয়ে metadata পড়া** — সবচেয়ে সাধারণ (`@Roles`, `@Public`, `@CacheKey`, `@RateLimit`)।
- **`ModuleRef` দিয়ে dynamic resolution** — যখন কোন implementation লাগবে তা runtime-এ ঠিক হয় (strategy pattern), বা circular dependency-র জটিলতা এড়াতে lazily dependency নিতে হয়:

```ts
@Injectable()
export class PaymentDispatcher {
  constructor(private readonly moduleRef: ModuleRef) {}

  pick(provider: 'stripe' | 'sslcommerz'): PaymentGateway {
    // runtime-এ ঠিক হচ্ছে কোন implementation লাগবে
    return provider === 'stripe'
      ? this.moduleRef.get(StripeGateway, { strict: false })
      : this.moduleRef.get(SslCommerzGateway, { strict: false });
  }
}
```

- **Request-scoped provider হাতে resolve করা** (`ContextIdFactory` + `ModuleRef.resolve`) — যেমন BullMQ processor বা Kafka consumer-এর ভিতরে, যেখানে HTTP request নেই কিন্তু per-job scope দরকার:

```ts
@Processor('emails')
export class EmailProcessor {
  constructor(private readonly moduleRef: ModuleRef) {}

  async process(job: Job) {
    const contextId = ContextIdFactory.create();
    // job-টাকেই "request" হিসেবে register করা হচ্ছে, যাতে REQUEST-scoped provider কাজ করে
    this.moduleRef.registerRequestByContextId({ tenantId: job.data.tenantId }, contextId);

    const mailer = await this.moduleRef.resolve(TenantMailerService, contextId);
    await mailer.send(job.data);
  }
}
```

- **`HttpAdapterHost` দিয়ে platform-agnostic global exception filter লেখা** (উপরে উদাহরণ আছে)।
- **`DiscoveryService` দিয়ে decorator-ভিত্তিক plugin system বানানো** — যেমন `@EventHandler('order.created')` নামের custom decorator scan করে নিজের event bus-এ register করা।
- **`BaseExceptionFilter` extend করা** — নিজের logging যোগ করে বাকি behaviour framework-এর হাতে রেখে দেওয়া।
- **Standalone application context** — HTTP server ছাড়া DI ব্যবহার করা (CLI script, seeder, cron worker):

```ts
// seed.ts — কোনো HTTP port খোলা হচ্ছে না, শুধু DI container চালু হচ্ছে
const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error'] });
const seeder = app.get(SeederService);
await seeder.run();
await app.close();
```

### What is `NestFactory.createMicroservice` and how does it differ from `NestFactory.create`?

| বিষয় | `NestFactory.create()` | `NestFactory.createMicroservice()` |
|---|---|---|
| ফেরত দেয় | `INestApplication` | `INestMicroservice` |
| Communication | HTTP (Express/Fastify) | Transport layer — TCP, Redis, NATS, MQTT, Kafka, gRPC, RMQ |
| Handler decorator | `@Get`, `@Post`, `@Put` … | `@MessagePattern` (request-response), `@EventPattern` (fire-and-forget) |
| শুরু করার method | `app.listen(3000)` | `app.listen()` (port option-এ থাকে) |
| HTTP-only API | `enableCors`, `useStaticAssets`, `setGlobalPrefix` — আছে | নেই |
| Exception | `HttpException` | `RpcException` |
| Client | Browser/HTTP client | `ClientProxy` (`@nestjs/microservices`) |

```ts
// একটা pure microservice — কোনো HTTP port নেই
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['kafka:9092'] },
      consumer: { groupId: 'orders-consumer' },
    },
  });
  await app.listen();
}
bootstrap();
```

```ts
// Hybrid application — একই process HTTP এবং microservice message দুটোই handle করে
async function bootstrap() {
  const app = await NestFactory.create(AppModule);      // HTTP layer

  app.connectMicroservice<MicroserviceOptions>({        // সাথে TCP listener যোগ
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 3001 },
  });

  await app.startAllMicroservices();   // microservice listener চালু
  await app.listen(3000);              // HTTP server চালু
}
```

**তিনটা factory method একসাথে দেখলে:**

- `create()` → HTTP server সহ full application।
- `createMicroservice()` → HTTP ছাড়া, শুধু message transport।
- `createApplicationContext()` → কোনো listener ছাড়া, শুধু DI container (CLI, seeder, scheduled script)।

**সংক্ষেপে:** `@nestjs/core` হলো NestJS-এর ইঞ্জিন — DI container, metadata scanner, request pipeline executor, এবং bootstrapper। দৈনন্দিন কাজে আপনি এর থেকে মূলত `NestFactory`, `Reflector`, `ModuleRef`, `APP_*` token আর `HttpAdapterHost` ব্যবহার করবেন।

---

## 7. What is the difference between monolithic and microservices architecture in NestJS?

**Monolithic NestJS application:** একটাই deployable unit, একটাই process, একটাই `AppModule` graph। সব feature module (User, Order, Payment) একই memory space-এ থাকে, এবং একে অপরকে সরাসরি **in-process method call** দিয়ে ডাকে (DI দিয়ে service inject করে)। একটাই database connection pool, একটাই deployment, একটাই log stream।

**Microservices NestJS application:** প্রতিটা bounded context আলাদা deployable NestJS app। তারা একে অপরের সাথে **network-এর উপর message** দিয়ে কথা বলে (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC), `@nestjs/microservices`-এর `ClientProxy` ও `@MessagePattern`/`@EventPattern` ব্যবহার করে। সাধারণত প্রতিটার নিজের database থাকে।

| বিষয় | Monolith | Microservices |
|---|---|---|
| Deployment unit | একটা | প্রতিটা service আলাদা |
| Communication | In-process method call (DI) | Network message (`ClientProxy.send/emit`) |
| Failure mode | একটা bug পুরো app ফেলে দিতে পারে | একটা service পড়লে বাকিরা টিকে থাকতে পারে (যদি resilient design থাকে) |
| Data consistency | ACID transaction সহজ | Distributed → Saga, eventual consistency |
| Scaling | পুরো app একসাথে scale করতে হয় | যে service-এ চাপ, শুধু সেটাই scale |
| Latency | Method call (ন্যানোসেকেন্ড) | Network hop (মিলিসেকেন্ড) |
| Debugging | Stack trace সরাসরি পড়া যায় | Distributed tracing দরকার (correlation ID, OpenTelemetry) |
| Local dev | `npm run start:dev` | Docker Compose + broker + কয়েকটা service |
| Team fit | ছোট-মাঝারি team | একাধিক independent team |
| Operational cost | কম | অনেক বেশি (broker, monitoring, CI/CD × N) |

```ts
// Monolith — সরাসরি service call
@Injectable()
export class OrderService {
  constructor(private readonly inventory: InventoryService) {}   // একই process

  async place(dto: CreateOrderDto) {
    await this.inventory.reserve(dto.items);   // in-process, transaction-এ অংশ নিতে পারে
  }
}
```

```ts
// Microservice — network message
@Injectable()
export class OrderService {
  constructor(@Inject('INVENTORY_SERVICE') private readonly client: ClientProxy) {}

  async place(dto: CreateOrderDto) {
    // request-response: উত্তরের জন্য অপেক্ষা করছে
    await firstValueFrom(this.client.send({ cmd: 'reserve_items' }, dto.items));

    // fire-and-forget event: উত্তরের অপেক্ষা নেই
    this.client.emit('order.created', { orderId: dto.id });
  }
}
```

### What challenges arise when transitioning a NestJS monolith to microservices?

- **Bounded context ভুল করে কাটা:** সবচেয়ে ব্যয়বহুল ভুল। Module boundary যদি domain boundary না হয়, তাহলে "distributed monolith" তৈরি হয় — যেখানে একটা feature বদলাতে ৪টা service একসাথে deploy করতে হয়, কিন্তু network latency-র খরচও দিতে হয়।
- **Shared database ভাঙা:** Monolith-এ একটা JOIN দিয়ে যা হতো, এখন দুইটা service call + application-level merge লাগে। Foreign key constraint আর কাজ করে না, data duplication ও sync-এর সিদ্ধান্ত নিতে হয়।
- **Transaction হারানো:** `prisma.$transaction` দিয়ে যা atomic ছিল, সেটা এখন **Saga** + compensating transaction (payment fail হলে inventory release) হয়ে যায়।
- **Eventual consistency মেনে নেওয়া:** UI ও product requirement-কে পরিবর্তন করতে হয় ("processing…" state), কারণ data সাথে সাথে সব জায়গায় consistent থাকবে না।
- **Message contract ও versioning:** DTO এখন network contract; একদিকে বদলালে অন্য service ভেঙে যায়। Schema registry বা versioned pattern (`{ cmd: 'reserve_items', v: 2 }`) দরকার।
- **Idempotency ও duplicate message:** At-least-once delivery মানে একই message দুইবার আসতে পারে — handler-কে idempotent করতে হয় (idempotency key, dedup table)।
- **Error propagation বদলে যায়:** `HttpException` আর সরাসরি client-এ পৌঁছায় না; `RpcException` + RPC exception filter দরকার।
- **Observability:** Correlation ID প্রতিটা message-এ propagate করা, centralized logging, distributed tracing — না থাকলে debugging প্রায় অসম্ভব।
- **Local development ও testing জটিল:** Broker, একাধিক service, contract test — সব setup করতে হয়। E2E test আর একটা `supertest` call নয়।
- **CI/CD ও infra multiplication:** N service = N pipeline, N Dockerfile, N alert rule, N on-call playbook।
- **Shared code-এর ব্যবস্থাপনা:** Common DTO, auth logic, logger — monorepo library (`nest g lib`) বা private npm package দিয়ে share করতে হয়, আর তখন version skew সমস্যা আসে।

**পরিণত approach:** Big-bang rewrite নয় — **Modular monolith → strangler fig**। আগে monolith-এর ভিতরেই module boundary শক্ত করুন (কোনো cross-module direct repository access নয়, শুধু service interface দিয়ে যোগাযোগ), তারপর সবচেয়ে বেশি চাপ/সবচেয়ে স্বাধীন module-টাকে প্রথম service হিসেবে বের করুন।

### How does NestJS support both patterns without requiring a full rewrite?

NestJS-এর সবচেয়ে বড় practical সুবিধা এটাই: **transport layer আপনার business logic থেকে আলাদা**।

- **Service layer অপরিবর্তিত থাকে:** আপনার business logic `@Injectable()` service-এ; সেটা জানেই না তাকে HTTP controller ডাকছে না Kafka handler।
- **Controller-কে microservice handler বানানো এক লাইনের কাজ:**

```ts
// আগে — HTTP
@Controller('orders')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.place(dto);
  }
}

// পরে — একই service, message-driven handler; business logic-এ হাত পড়েনি
@Controller()
export class OrderMessageController {
  constructor(private readonly orders: OrderService) {}

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() dto: CreateOrderDto) {
    return this.orders.place(dto);
  }

  @EventPattern('payment.completed')
  onPaid(@Payload() evt: PaymentCompletedEvent) {
    return this.orders.markPaid(evt.orderId);
  }
}
```

- **একই module দুই জায়গায় reuse:** Extract করা module-কে নতুন app-এর `AppModule`-এ import করলেই চলে — provider graph একই থাকে।
- **Hybrid mode দিয়ে ধীরে ধীরে migration:** একই process HTTP serve করতে করতেই microservice message handle করা শুরু করতে পারে (`connectMicroservice` + `startAllMicroservices`) — অর্থাৎ big-bang cutover লাগে না।
- **Monorepo support:** `nest g app orders`, `nest g lib shared` — একই repo-তে একাধিক app ও shared library, একই tsconfig path alias দিয়ে।
- **CQRS module:** `@nestjs/cqrs` দিয়ে monolith-এর ভিতরেই command/query/event আলাদা করা যায়; পরে in-memory `EventBus`-কে Kafka-backed করে দিলে বাকি code বদলায় না।
- **Transport swap configuration-এর ব্যাপার:** TCP → Redis → Kafka বদলানো মূলত `main.ts` ও client registration-এর option বদল, handler code নয়।

### What is a hybrid NestJS application and when would you use one?

**Hybrid application** হলো এমন একটা NestJS app যেটা **একইসাথে একটা HTTP server এবং এক বা একাধিক microservice listener** চালায় — একই process, একই DI container, একই provider instance।

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kafka consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: { client: { brokers: ['kafka:9092'] }, consumer: { groupId: 'orders' } },
  }, { inheritAppConfig: true });   // global pipe/filter/interceptor microservice-এও প্রযোজ্য হবে

  // RabbitMQ consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: { urls: ['amqp://rabbit:5672'], queue: 'billing_queue' },
  }, { inheritAppConfig: true });

  await app.startAllMicroservices();
  await app.listen(3000);
}
```

**কখন ব্যবহার করবেন:**

- **Migration-এর মধ্যবর্তী ধাপে:** পুরনো client এখনো REST call করছে, নতুন internal service message পাঠাচ্ছে — দুটোই একই app handle করবে।
- **Public API + internal event consumer একই domain-এ:** যেমন Order service একদিকে `/orders` REST endpoint দেয়, অন্যদিকে `payment.completed` event consume করে।
- **Webhook + queue worker একসাথে:** External webhook HTTP-তে আসে, ভারী কাজটা queue-তে যায়, আর worker-ও একই app-এ থাকে (ছোট team-এর জন্য deployment সরল রাখে)।
- **Health check ও metrics endpoint দরকার এমন pure worker:** Kubernetes-এর readiness/liveness probe HTTP চায়; একটা pure microservice-এ ছোট HTTP layer রাখলে Terminus `/health` দেওয়া যায়।

**কখন এড়াবেন:**

- HTTP traffic আর message consumption-এর scaling profile সম্পূর্ণ আলাদা হলে (একটাতে ১০ replica দরকার, অন্যটায় ২) — তখন আলাদা deployment ভালো, কারণ hybrid app-এ দুটো একসাথে scale করতে বাধ্য হবেন।
- Message processing CPU-heavy হলে — সেটা HTTP request-এর latency-কে ক্ষতিগ্রস্ত করবে, কারণ একই event loop।
- Fault isolation দরকার হলে — একই process মানে একটা memory leak বা crash দুটো responsibility-ই নামিয়ে দেয়।

**সংক্ষেপে:** NestJS-এ monolith আর microservices একই architecture-এর দুইটা deployment topology, দুইটা আলাদা framework নয়। তাই সঠিক পথ হলো — **modular monolith দিয়ে শুরু করুন, boundary পরিষ্কার রাখুন, এবং বাস্তব প্রয়োজন (scaling, team autonomy, deployment independence) দেখা দিলে module ধরে ধরে service বের করুন।**

---

## 8. How does NestJS support both REST and GraphQL APIs?

NestJS-এ REST ও GraphQL দুটোই **একই application-এর দুইটা "transport/presentation layer"** হিসেবে বসে, আর নিচে একই Service, একই DI container, একই Guard/Interceptor/Pipe reuse হয়। REST-এর জন্য আছে `@Controller` + `@Get/@Post`, GraphQL-এর জন্য `@Resolver` + `@Query/@Mutation` (`@nestjs/graphql` package)। দুইজনেই একই `UserService`-কে inject করে ব্যবহার করে — business logic দুইবার লিখতে হয় না।

GraphQL layer-এর দুইটা approach:

- **Code-first (সবচেয়ে প্রচলিত):** TypeScript class ও decorator (`@ObjectType`, `@Field`) থেকে NestJS নিজেই `schema.gql` generate করে।
- **Schema-first:** আগে `.graphql` SDL লেখা হয়, তারপর সেখান থেকে TypeScript type generate করা হয়।

### How do you run both a REST controller and a GraphQL resolver in the same NestJS application?

`GraphQLModule` import করলেই GraphQL endpoint (`/graphql`) চালু হয়, আর existing controller-গুলো আগের মতোই কাজ করতে থাকে — কোনো conflict নেই, কারণ route আলাদা।

```ts
// app.module.ts
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),   // code-first
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req }) => ({ req }),   // guard-এ req পাওয়ার জন্য জরুরি
    }),
    UserModule,
  ],
})
export class AppModule {}
```

```ts
// একই module-এ REST controller এবং GraphQL resolver — দুজনেই একই service ব্যবহার করছে
@Module({
  controllers: [UserController],       // REST:    GET /users/:id
  providers: [UserResolver, UserService], // GraphQL: query { user(id: "1") { ... } }
})
export class UserModule {}
```

```ts
// user.model.ts — GraphQL ObjectType
@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => [PostModel], { nullable: true })
  posts?: PostModel[];
}

// user.resolver.ts
@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly users: UserService) {}   // REST controller-এর সাথে একই instance

  @Query(() => UserModel, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.users.findById(id);
  }

  @Mutation(() => UserModel)
  createUser(@Args('input') input: CreateUserInput) {
    return this.users.create(input);
  }

  // nested field — N+1 এড়াতে সাধারণত DataLoader ব্যবহার করা হয়
  @ResolveField(() => [PostModel])
  posts(@Parent() user: UserModel) {
    return this.users.findPostsByUserId(user.id);
  }
}
```

**একটা গুরুত্বপূর্ণ পার্থক্য — Guard-এ context:** REST-এ `ctx.switchToHttp().getRequest()` কাজ করে, GraphQL-এ করে না। তাই dual-protocol guard লিখতে হলে:

```ts
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType<'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();   // REST fallback
  }
}
```

### What are the trade-offs between REST and GraphQL for large-scale NestJS backends?

| বিষয় | REST | GraphQL |
|---|---|---|
| Data fetching | Fixed response shape; over/under-fetching হয় | Client ঠিক যা চায় তাই পায় |
| Round trip | একাধিক endpoint = একাধিক request | একটা request-এ nested data |
| HTTP caching | URL-ভিত্তিক, CDN/browser cache সহজ | সব POST `/graphql` — CDN caching কঠিন, persisted query/response cache লাগে |
| Versioning | `/v1`, `/v2` — সোজা | Schema evolution + `@deprecated` field |
| Error handling | HTTP status code (404, 400, 500) | সাধারণত `200 OK` + `errors[]` array |
| File upload | সহজ (multipart) | Extra spec/library দরকার |
| Rate limiting | Endpoint-ভিত্তিক, সহজ | Query complexity/depth analysis দরকার |
| N+1 risk | কম (query নিজে লিখছেন) | বেশি — DataLoader প্রায় বাধ্যতামূলক |
| Observability | Route-ভিত্তিক metric সহজ | সব একই endpoint — resolver-level tracing দরকার |
| Learning curve | কম | বেশি (schema design, loader, complexity) |
| Frontend velocity | Backend-এর উপর নির্ভরশীল | Backend পরিবর্তন ছাড়াই নতুন view বানানো যায় |

**কখন কোনটা:**

- **REST বেছে নিন:** Public API, simple CRUD, ভারী CDN caching দরকার, file-heavy endpoint, third-party integration, বা team-এ GraphQL অভিজ্ঞতা কম।
- **GraphQL বেছে নিন:** একাধিক ভিন্ন client (web + iOS + Android) যাদের data need আলাদা, deeply nested/relational data, দ্রুত frontend iteration দরকার, বা BFF (Backend-for-Frontend) হিসেবে বহু service-এর data একত্র করা।
- **বাস্তবে অনেক বড় system দুটোই রাখে:** ভিতরের product client-এর জন্য GraphQL, আর public/partner integration, webhook, file upload ও health check-এর জন্য REST।

**GraphQL-এর যে ঝুঁকিগুলো বড় scale-এ মনে রাখতে হয়:** unbounded query (depth/complexity limit ছাড়া একটা query দিয়ে DB নামিয়ে দেওয়া সম্ভব), introspection production-এ খোলা রাখা, per-resolver authorization ভুলে যাওয়া, এবং caching strategy আগে থেকে না ভাবা।

### How do you share DTOs and validation logic between REST and GraphQL in NestJS?

মূল কৌশল: **একটাই class, দুই ধরনের decorator** — `class-validator` decorator validation-এর জন্য, আর `@InputType()`/`@Field()` GraphQL schema-র জন্য। REST সেই একই class DTO হিসেবে ব্যবহার করে।

```ts
// create-user.input.ts — REST এবং GraphQL দুই জায়গাতেই ব্যবহারযোগ্য একটাই class
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, Min, MinLength } from 'class-validator';

@InputType()                       // GraphQL input type
export class CreateUserInput {
  @Field()                         // GraphQL field
  @ApiProperty({ example: 'mamun@example.com' })   // Swagger doc (REST)
  @IsEmail()                       // runtime validation — দুই protocol-এই কাজ করে
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(13)
  age?: number;
}
```

GraphQL-এ validation চালু করতে global `ValidationPipe` লাগে (REST-এর মতোই — একই pipe দুই জায়গায় কাজ করে):

```ts
// main.ts — একই pipe REST route এবং GraphQL resolver arg দুটোতেই প্রযোজ্য
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

আরও যা share করা যায়:

- **Validation ও transformation:** একই `ValidationPipe`, একই custom validator (`@IsUniqueEmail()`), একই `@Transform()`।
- **Guard ও authorization logic:** context-aware guard (উপরের `GqlAuthGuard`) লিখে একই `RolesGuard` দুই জায়গায় ব্যবহার।
- **Exception mapping:** Domain exception (`EmailAlreadyTakenError`) একবার define করে REST-এ HTTP filter, GraphQL-এ `formatError`-এ map করা।
- **Interceptor:** Logging/metrics interceptor context type দেখে দুই protocol handle করতে পারে।
- **DTO duplication কমানো:** `PartialType` — GraphQL-এর জন্য `@nestjs/graphql`-এর `PartialType` ব্যবহার করবেন (`@nestjs/swagger`-এর নয়, নয়তো `@Field` metadata হারাবে):

```ts
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}   // সব field optional
```

**খেয়াল রাখার ফাঁদ:** একই class-এ Prisma/TypeORM entity, GraphQL type, Swagger DTO — সব একসাথে মিশিয়ে ফেলা। এটা শুরুতে DRY মনে হয়, কিন্তু পরে database column পরিবর্তন সরাসরি public API contract ভেঙে দেয়। ভালো চর্চা: **Entity (persistence) ≠ Model/ObjectType (API output) ≠ Input/DTO (API input)** — তিনটা আলাদা রাখা, mapper দিয়ে যোগ করা।

**সংক্ষেপে:** NestJS-এ REST ও GraphQL একে অপরের প্রতিদ্বন্দ্বী নয় — একই service layer-এর উপর দুইটা adapter। তাই dual support-এর আসল কাজ হলো business logic-কে protocol-agnostic রাখা, আর DTO/validation/guard-কে context-aware ভাবে share করা।

---

## 9. What is the purpose of the Nest CLI?

**Nest CLI** (`@nestjs/cli`) হলো একটা command-line tool যা NestJS project **তৈরি, code generate, build, run এবং maintain** করার কাজ automate করে। এর মূল উদ্দেশ্য দুইটা: **boilerplate লেখা বন্ধ করা** এবং **পুরো team জুড়ে একই convention ধরে রাখা**।

সবচেয়ে বেশি ব্যবহৃত command:

```bash
npm i -g @nestjs/cli

nest new my-app                 # নতুন project (Express, TS, Jest, ESLint সহ scaffold)
nest generate module users      # বা সংক্ষেপে: nest g mo users
nest g controller users         # nest g co users
nest g service users            # nest g s users
nest g resource users           # পুরো CRUD (module + controller + service + DTO + entity + spec)
nest g guard auth
nest g interceptor logging
nest g pipe validation
nest g filter http-exception
nest g decorator current-user

nest build                      # tsc দিয়ে production build (dist/)
nest start                      # চালানো
nest start --watch              # dev mode, hot reload
nest start --debug --watch      # debugger attach সহ
nest info                       # Nest/Node/npm version ও package তালিকা (bug report-এ দরকারি)
```

### How does the CLI improve development workflows (generating resources, running schematics)?

- **Boilerplate শূন্যে নামানো:** একটা service তৈরি করতে গেলে file বানানো, `@Injectable()` লেখা, module-এর `providers`-এ যোগ করা, spec file বানানো — চারটা কাজ। `nest g service users` চারটাই একসাথে করে, **module-এ auto-register সহ**।
- **Convention enforce করা:** File name (`users.service.ts`), class name (`UsersService`), folder structure, test file naming — সব CLI-র schematic দিয়ে একই থাকে, ফলে code review-তে "নাম কী হবে" নিয়ে আলোচনা লাগে না।
- **Module wiring ভুল হওয়া কমে:** CLI নিজেই nearest module-এর `providers`/`controllers` array আপডেট করে — "provider register করতে ভুলে গেছি" জাতীয় error কমে যায়।
- **Test file আগে থেকেই তৈরি:** প্রতিটা generated class-এর সাথে `.spec.ts` আসে, তাই test লেখা শুরু করার friction কম।
- **Dev loop দ্রুত:** `nest start --watch` (এবং `--webpack` দিয়ে HMR) — save করলেই restart।
- **Monorepo ব্যবস্থাপনা:** `nest g app`, `nest g lib` দিয়ে multi-app workspace-এ path alias, tsconfig, build target সব CLI নিজে সেট করে দেয়।
- **Dry run দিয়ে নিরাপত্তা:** `nest g resource users --dry-run` চালিয়ে আগে দেখে নেওয়া যায় কোন কোন file তৈরি/পরিবর্তন হবে।
- **উপকারী flag:** `--no-spec` (test file ছাড়া), `--flat` (আলাদা folder ছাড়া), `--project app-name` (monorepo-তে নির্দিষ্ট app-এ generate)।

### What is a NestJS schematic and how do you create a custom one?

**Schematic** হলো Angular DevKit-এর একটা concept: একটা **code generation blueprint** — template file + logic, যা আপনার project-এর file tree-এর উপর নিরাপদে (transactionally) পরিবর্তন প্রয়োগ করে। `nest g service` আসলে `@nestjs/schematics` package-এর `service` schematic চালায়।

কেন custom schematic লিখবেন: আপনার organization-এর নিজস্ব pattern থাকলে (যেমন প্রতিটা feature-এ controller + service + repository + mapper + Swagger doc + i18n key একসাথে লাগে) — একবার schematic লিখে পুরো team-এর জন্য `nest g my-feature orders` বানিয়ে ফেলা যায়।

```bash
# ১. schematic project scaffold
npm i -g @angular-devkit/schematics-cli
schematics blank --name=my-nest-schematics
cd my-nest-schematics
```

```json
// src/collection.json — কোন schematic কোথায় আছে তার registry
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "feature": {
      "description": "Generate a feature with controller, service and repository",
      "factory": "./feature/index#feature",
      "schema": "./feature/schema.json"
    }
  }
}
```

```ts
// src/feature/index.ts — schematic-এর মূল logic (Rule factory)
import { strings } from '@angular-devkit/core';
import {
  apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, Tree, url,
} from '@angular-devkit/schematics';

interface FeatureOptions {
  name: string;
  path?: string;
}

export function feature(options: FeatureOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...options,
        classify: strings.classify,   // orders → Orders
        dasherize: strings.dasherize, // Orders → orders
      }),
      move(`${options.path ?? 'src'}/${strings.dasherize(options.name)}`),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
```

```
src/feature/files/
├── __dasherize@name__.controller.ts.template
├── __dasherize@name__.service.ts.template
├── __dasherize@name__.repository.ts.template
└── __dasherize@name__.module.ts.template
```

```ts
// __dasherize@name__.service.ts.template
import { Injectable } from '@nestjs/common';
import { <%= classify(name) %>Repository } from './<%= dasherize(name) %>.repository';

@Injectable()
export class <%= classify(name) %>Service {
  constructor(private readonly repo: <%= classify(name) %>Repository) {}
}
```

```bash
# ২. build ও লোকাল ব্যবহার
npm run build
nest g -c /absolute/path/to/my-nest-schematics feature orders

# ৩. npm-এ publish করলে পুরো team ব্যবহার করতে পারবে
nest g -c @my-org/nest-schematics feature orders
```

Project-এ default collection সেট করে রাখা যায়, তাহলে `-c` লিখতে হয় না:

```json
// nest-cli.json
{
  "collection": "@my-org/nest-schematics",
  "sourceRoot": "src"
}
```

### How do you generate a complete CRUD resource with a single CLI command?

```bash
nest g resource users
```

CLI তখন দুইটা প্রশ্ন করে:

1. **Transport layer:** `REST API` / `GraphQL (code first)` / `GraphQL (schema first)` / `Microservice (non-HTTP)` / `WebSockets`
2. **CRUD entry point generate করতে চান?** → `Yes` বললে পাঁচটা endpoint সহ সম্পূর্ণ code তৈরি হয়।

যা তৈরি হয় (REST বেছে নিলে):

```
src/users/
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts        // PartialType(CreateUserDto)
├── entities/
│   └── user.entity.ts
├── users.controller.ts           // GET / GET :id / POST / PATCH / DELETE
├── users.controller.spec.ts
├── users.module.ts               // AppModule-এ auto-import হয়ে যায়
├── users.service.ts              // findAll, findOne, create, update, remove (stub)
└── users.service.spec.ts
```

```ts
// generated users.controller.ts (সরলীকৃত) — পাঁচটা REST endpoint প্রস্তুত
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()   create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }
  @Get()    findAll() { return this.usersService.findAll(); }
  @Get(':id')   findOne(@Param('id') id: string) { return this.usersService.findOne(+id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.usersService.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.usersService.remove(+id); }
}
```

উপকারী variation:

```bash
nest g resource users --no-spec              # test file ছাড়া
nest g resource users --dry-run              # কী কী তৈরি হবে আগে দেখা
nest g resource orders --project api         # monorepo-তে নির্দিষ্ট app-এ
```

**যা CLI করে না** (এবং আপনাকেই করতে হবে): DTO-তে আসল validation decorator বসানো, service-এর stub-এ আসল database logic লেখা, entity-তে ORM decorator/column define করা, এবং authorization যোগ করা। CLI structure দেয়, business logic নয়।

**সংক্ষেপে:** Nest CLI-র মূল মূল্য repetitive file তৈরি বাঁচানোর চেয়েও বেশি — এটা পুরো team-এ **একই structure ও naming convention** ধরে রাখে, এবং custom schematic দিয়ে organization-এর নিজস্ব architecture-কেও automate করা যায়।

---

## 10. What are the benefits of using NestJS for enterprise applications?

Enterprise context-এ (বড় team, দীর্ঘ product lifecycle, compliance, একাধিক integration) NestJS-এর মূল আকর্ষণ কোনো একক feature নয় — বরং **predictability**। যে জিনিসগুলো সবচেয়ে বেশি মূল্য দেয়:

- **Enforced architecture** — প্রতিটা service একই রকম দেখতে, তাই এক team-এর developer অন্য team-এর codebase-এ দ্রুত কাজ করতে পারে।
- **TypeScript-first + DI** — compile-time safety এবং সহজ mocking, যা regression কমায়।
- **Built-in cross-cutting layer** — auth, validation, logging, error shaping পুরো app জুড়ে consistent, প্রতিটা endpoint-এ আলাদা করে লেখা লাগে না।
- **First-party ecosystem** — Swagger, Config, Terminus (health check), BullMQ, Throttler, Cache, Scheduler, Microservices — এগুলোর জন্য architectural সিদ্ধান্ত নিতে হয় না, official module আছে।
- **Testability** — `Test.createTestingModule` + `overrideProvider` দিয়ে unit/integration/E2E তিন স্তরেই test করা সহজ, যা compliance ও CI gate-এর জন্য জরুরি।
- **Multi-protocol** — REST, GraphQL, WebSocket, gRPC, Kafka — একই codebase, একই DI, একই team।
- **Observability ও operations** — structured logger swap (Pino/Winston), OpenTelemetry integration, lifecycle hook দিয়ে graceful shutdown — Kubernetes-এ চালানোর জন্য যা দরকার।
- **Monorepo support** — একাধিক app ও shared library একই repo-তে, একই version-এ।
- **Documentation ও hiring** — বড়, সক্রিয় community; Nest-জানা developer পাওয়া সহজ, এবং official doc-ই onboarding material হিসেবে চলে।

### How does NestJS ensure maintainability in large teams (enforced structure, testability)?

- **"কোথায় লিখব" প্রশ্নের একটাই উত্তর:** নতুন business rule → service; নতুন endpoint → controller; নতুন auth নিয়ম → guard; নতুন response shape → interceptor। এই map টা framework-এর অংশ, কোনো team convention document নয় যা কেউ পড়ে না।
- **Explicit dependency graph:** কোনো provider ব্যবহার করতে হলে তার module import করতে হয় — অর্থাৎ "কে কার উপর নির্ভরশীল" code review-তে দেখা যায়, এবং অবাঞ্ছিত coupling PR-এই ধরা পড়ে।
- **Encapsulation by default:** `exports` না করলে provider module-এর বাইরে অদৃশ্য — internal helper accidentally public API হয়ে যায় না।
- **Test-friendly by construction:** DI থাকার কারণে প্রতিটা class isolated ভাবে test করা যায়; `overrideProvider` দিয়ে integration test-এ শুধু external boundary (DB, payment gateway) fake করা যায়।

```ts
// বড় team-এ সবচেয়ে দরকারি test pattern — শুধু boundary mock, বাকি সব real
const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
  .overrideProvider(PaymentGateway).useValue({ charge: jest.fn().mockResolvedValue({ ok: true }) })
  .overrideProvider(MailService).useValue({ send: jest.fn() })
  .compile();
```

- **Consistent error ও validation contract:** Global `ValidationPipe` + global exception filter মানে প্রতিটা endpoint-এর error response একই shape-এ — frontend team একবার handle করলেই সব জায়গায় চলে।
- **Lint + boundary rule দিয়ে আরও শক্ত করা:** ESLint import restriction বা monorepo tag rule দিয়ে "domain layer থেকে Prisma import নিষিদ্ধ" ধরনের নিয়ম automated করা যায়।
- **Onboarding cost কম:** নতুন developer একটা module পড়লেই বাকি ৩০টা module-এর pattern বুঝে যায়।

### What is the role of the NestJS monorepo support for large codebases?

NestJS-এর **monorepo mode** একই repository-তে একাধিক application এবং shared library রাখতে দেয়, একটাই `node_modules`, একটাই tsconfig base, একটাই lint/test configuration নিয়ে।

```bash
nest new my-workspace
nest g app api-gateway        # প্রথম app যোগ করলেই workspace monorepo mode-এ চলে যায়
nest g app orders-service
nest g app billing-service
nest g lib shared             # shared library
nest g lib auth
```

```json
// nest-cli.json (সরলীকৃত)
{
  "monorepo": true,
  "root": "apps/api-gateway",
  "sourceRoot": "apps/api-gateway/src",
  "projects": {
    "api-gateway":    { "type": "application", "root": "apps/api-gateway" },
    "orders-service": { "type": "application", "root": "apps/orders-service" },
    "shared":         { "type": "library", "root": "libs/shared", "prefix": "libs" }
  }
}
```

```
my-workspace/
├── apps/
│   ├── api-gateway/
│   ├── orders-service/
│   └── billing-service/
├── libs/
│   ├── shared/          // DTO, event contract, utility
│   └── auth/            // guard, strategy, decorator
└── nest-cli.json
```

```ts
// tsconfig path alias স্বয়ংক্রিয়ভাবে সেট হয়, তাই relative path নরক এড়ানো যায়
import { OrderCreatedEvent } from '@app/shared/events';
import { JwtAuthGuard } from '@app/auth';
```

```bash
nest build orders-service
nest start orders-service --watch
```

**কী লাভ:**

- **Shared contract একই version-এ:** DTO ও event contract library-তে থাকে, তাই দুই service-এর মধ্যে version skew হয় না (আলাদা repo + npm package-এ এই সমস্যাটাই সবচেয়ে বেশি ভোগায়)।
- **Atomic refactor:** একটা shared DTO বদলালে যে সব app প্রভাবিত হবে, সবগুলো একই PR-এ আপডেট ও test হয় — publish/bump/install cycle লাগে না।
- **একটাই toolchain:** ESLint, Prettier, Jest, CI config একবার সেট করলেই সব app-এ প্রযোজ্য।
- **Microservices-এ যাওয়ার সহজ পথ:** নতুন service বের করা মানে `nest g app` + module move — নতুন repo, নতুন pipeline, নতুন dependency setup লাগে না।

**সীমাবদ্ধতা:** Repository বড় হলে CI ধীর হয় (তাই affected-project-only build দরকার — Nx বা turborepo এখানে সাহায্য করে), সবাইকে সব code-এ access দিতে হয়, আর careless import দিয়ে দুইটা "independent" service আসলে coupled হয়ে যেতে পারে — এজন্য boundary lint rule দরকার।

### How does NestJS's opinionated structure reduce decision fatigue compared to raw Express?

Raw Express-এ একটা নতুন project শুরু করতে গেলে যে সিদ্ধান্তগুলো নিতে হয় — এবং NestJS যেগুলো আগেই নিয়ে রেখেছে:

| সিদ্ধান্ত | Express-এ | NestJS-এ |
|---|---|---|
| Folder structure | নিজে ঠিক করুন (layer-wise? feature-wise?) | Module-per-feature, CLI-ই তৈরি করে |
| DI/service wiring | Manual, singleton, বা awilix/tsyringe | Built-in container |
| Validation library | Joi / Zod / express-validator / Yup | `class-validator` + `ValidationPipe` (default path) |
| Error handling | নিজের error middleware ও error shape | `HttpException` hierarchy + exception filter |
| Config management | dotenv + নিজের helper | `@nestjs/config` + validation schema |
| Auth structure | নিজে middleware বানান | Guard + Passport strategy |
| Logging | morgan/winston, নিজে wire করুন | Built-in `Logger`, চাইলে Pino/Winston swap |
| Testing setup | Jest/Mocha + নিজের DI mock strategy | `@nestjs/testing` + Jest, CLI-তেই preconfigured |
| API docs | Manual OpenAPI yaml বা swagger-jsdoc | `@nestjs/swagger` decorator থেকে auto-generate |
| Health check | নিজে endpoint লিখুন | `@nestjs/terminus` |
| Background job | নিজে Bull wire করুন | `@nestjs/bullmq` |

এর ফলে **যে সিদ্ধান্তগুলো ব্যবসায়িক মূল্য যোগ করে না** (folder নাম, validation library, error format) সেগুলোতে সময় ও তর্ক নষ্ট হয় না — team-এর মনোযোগ domain logic-এ থাকে। বড় organization-এ এর আরেকটা বড় লাভ: **একটা service-এ যা শিখলেন, সেটা বাকি ২০টা service-এও প্রযোজ্য।**

**এর বিপরীত দিকটাও সৎভাবে বলা দরকার:** Opinionated হওয়ার দাম আছে —

- Framework-এর abstraction (decorator, DI, metadata) শিখতে সময় লাগে, এবং debugging-এ কখনো framework-এর ভিতরে নামতে হয়।
- Simple use case-এ NestJS বেশি code দাবি করে (একটা endpoint-এর জন্য module + controller + service)।
- Bootstrap time ও bundle size raw Express-এর চেয়ে বেশি — extreme cold-start-sensitive serverless-এ এটা বিবেচ্য।
- Framework-এর "Nest way"-র বাইরে কিছু করতে চাইলে (যেমন খুব ভিন্ন DI pattern) framework-এর সাথে লড়তে হয়।

**সংক্ষেপে:** Enterprise-এ NestJS বাছার আসল কারণ raw performance নয় — **predictability, testability এবং team scalability**। ছোট এক-দুই endpoint-এর service-এ এই সুবিধাগুলো তেমন মূল্য দেয় না, কিন্তু যে codebase বহু বছর ধরে বহু developer maintain করবে, সেখানে এগুলোই দীর্ঘমেয়াদি খরচ সবচেয়ে বেশি কমায়।
