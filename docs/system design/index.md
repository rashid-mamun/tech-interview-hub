# System Design Interview Questions
---

## 1. Fundamentals and Approach

1. **How do you approach a system design interview question?** `[core]`
   - What are the steps you follow when given an open-ended design problem?
   - How do you handle ambiguity in requirements during a design interview?
   - How do you prioritize features when you cannot build everything?

2. **How do you gather and clarify requirements for a system?** `[core]`
   - What is the difference between functional and non-functional requirements?
   - How do you estimate scale and traffic requirements from scratch?
   - What questions do you ask to determine read-heavy vs write-heavy workloads?

3. **How do you estimate scale — users, requests per second, storage?** `[core]`
   - How do you calculate requests per second from daily active users (DAU)?
   - How do you estimate storage needs for a system like Instagram?
   - What is back-of-the-envelope calculation and how do you practice it?

4. **What are the key trade-offs to consider in any system design?** `[core]`
   - How do you decide between consistency and availability?
   - When do you trade latency for throughput?
   - How do you evaluate build vs buy decisions?

5. **How do you define SLAs, SLOs, and SLIs for a system?** `[core]`
   - What is the difference between SLA, SLO, and SLI?
   - How do you set a realistic uptime SLA (e.g., 99.9% vs 99.99%)?
   - What does 99.99% availability mean in terms of downtime per year?

---

## 2. Scalability

6. **What is scalability and why does it matter in system design?** `[core]`
   - What is the difference between horizontal scaling and vertical scaling?
   - What is the ceiling of vertical scaling?
   - What does it mean for a system to scale linearly?

7. **What is horizontal vs vertical scaling and when do you use each?** `[core]`
   - What are the cost implications of horizontal vs vertical scaling?
   - Which cloud services support automatic horizontal scaling?
   - When does horizontal scaling introduce complexity that vertical scaling avoids?

8. **What is database sharding and how does it help with scalability?** `[core]`
   - What are the different sharding strategies (range-based, hash-based, directory-based)?
   - What is a hot shard problem and how do you solve it?
   - How do you handle cross-shard queries?
   - What happens when you need to re-shard a database?

9. **How do you scale a relational database?** `[core]`
   - What is a read replica and how does it offload read traffic?
   - What is connection pooling and why is it important at scale?
   - When should you move from a relational database to a NoSQL database for scale?

10. **What is the role of a load balancer in a scalable system?** `[core]`
    - What load balancing algorithms exist (round robin, least connections, consistent hashing)?
    - What is the difference between a hardware load balancer and a software load balancer?
    - How do you ensure the load balancer itself doesn't become a single point of failure?

11. **What is consistent hashing and where is it used?** `[advanced]`
    - How does consistent hashing minimize data redistribution when nodes are added or removed?
    - What is a virtual node (vnode) in consistent hashing?
    - Which real-world systems use consistent hashing (Cassandra, Dynamo, CDNs)?

12. **How do you design a system that can auto-scale?** `[advanced]`
    - What metrics trigger auto-scaling (CPU, memory, request queue depth)?
    - What is the difference between proactive scaling and reactive scaling?
    - What are the risks of auto-scaling too aggressively or too slowly?

---

## 3. Databases

13. **How do you choose between SQL and NoSQL databases?** `[core]`
    - What workloads favor a relational database?
    - When is a document store (MongoDB) better than a key-value store (Redis)?
    - What does ACID compliance mean and why does it matter?

14. **What are the different types of NoSQL databases and their use cases?** `[core]`
    - When do you use a wide-column store like Cassandra vs a document store like MongoDB?
    - What is a time-series database and when is it appropriate?
    - What is a graph database and what problems does it solve?

15. **What is database replication and what are the different replication strategies?** `[core]`
    - What is the difference between synchronous and asynchronous replication?
    - What is master-slave vs master-master replication?
    - How does replication lag affect system behavior?

16. **What is database indexing and how does it improve query performance?** `[core]`
    - What is the difference between a clustered and non-clustered index?
    - What are the downsides of over-indexing a database?
    - What is a composite index and when should you use one?

17. **What is the CAP theorem?** `[core]`
    - Can a distributed system be both consistent and available at the same time?
    - What does partition tolerance mean in practice?
    - Which databases choose CP and which choose AP?

18. **What is eventual consistency and when is it acceptable?** `[core]`
    - What is the difference between strong consistency, eventual consistency, and causal consistency?
    - How does Amazon DynamoDB implement eventual consistency?
    - What real-world scenarios can tolerate eventual consistency?

19. **What is ACID vs BASE and how do they apply to system design?** `[advanced]`
    - What does BASE stand for (Basically Available, Soft state, Eventually consistent)?
    - How do you achieve ACID guarantees in a distributed system?
    - What is a distributed transaction and what are its challenges?

20. **How do you handle database migrations in a production system?** `[advanced]`
    - What is a zero-downtime migration strategy?
    - What is the expand-contract pattern for schema changes?
    - How do you roll back a failed database migration?

21. **What is a data warehouse and how does it differ from a transactional database?** `[advanced]`
    - What is OLTP vs OLAP?
    - When would you use Snowflake, BigQuery, or Redshift?
    - What is the star schema vs snowflake schema?

---

## 4. Caching

22. **What is caching and why is it important in system design?** `[core]`
    - What types of data are good candidates for caching?
    - What are the trade-offs of caching (staleness, memory cost, complexity)?
    - Where can you apply caching in a system (client, CDN, server, database)?

23. **What are the different caching strategies (cache-aside, write-through, write-back)?** `[core]`
    - What is cache-aside (lazy loading) and when do you use it?
    - What is write-through caching and what are its trade-offs?
    - What is write-back (write-behind) caching and when is it risky?
    - What is read-through caching?

24. **What are cache eviction policies (LRU, LFU, TTL)?** `[core]`
    - How does LRU (Least Recently Used) eviction work?
    - When would you prefer LFU (Least Frequently Used) over LRU?
    - What is a TTL-based eviction and when is it most appropriate?

25. **What is a cache stampede (thundering herd) and how do you prevent it?** `[advanced]`
    - What is probabilistic early recomputation for cache stampede prevention?
    - How does mutex locking prevent cache stampede?
    - What is request coalescing?

26. **What is the difference between Redis and Memcached?** `[core]`
    - What data structures does Redis support that Memcached does not?
    - When would you choose Memcached over Redis?
    - How does Redis persistence (RDB vs AOF) work?

27. **How do you design a distributed cache?** `[advanced]`
    - How do you handle cache invalidation in a distributed system?
    - What is cache coherence and why is it hard in distributed systems?
    - How does consistent hashing apply to distributing cache keys across nodes?

28. **What is CDN caching and how does it differ from server-side caching?** `[core]`
    - How do cache-control headers control CDN behavior?
    - What is the difference between edge caching and origin caching?
    - How do you invalidate a CDN cache for a specific resource?

---

## 5. Messaging and Queues

29. **What is a message queue and why is it used in distributed systems?** `[core]`
    - What problems does asynchronous messaging solve?
    - What is the difference between a queue and a topic (pub/sub)?
    - How does a message queue decouple producers from consumers?

30. **What is the difference between RabbitMQ and Kafka?** `[core]`
    - When would you choose Kafka over RabbitMQ?
    - What is Kafka's log-based storage model?
    - What is a consumer group in Kafka and how does it enable parallel processing?
    - What level does Kafka guarantee message ordering?

31. **What is pub/sub messaging and when do you use it?** `[core]`
    - What are fan-out patterns in pub/sub systems?
    - How does Google Pub/Sub differ from Kafka?
    - What is the difference between push and pull delivery in pub/sub?

32. **How do you ensure exactly-once delivery in a message queue?** `[advanced]`
    - What is at-least-once vs at-most-once vs exactly-once delivery semantics?
    - How do idempotency keys help ensure exactly-once processing?
    - How does Kafka implement exactly-once semantics?

33. **What is a dead letter queue (DLQ) and why is it important?** `[core]`
    - When does a message end up in a dead letter queue?
    - How do you monitor and process messages in a DLQ?
    - What retry strategies work well with a DLQ?

34. **How do you handle backpressure in a messaging system?** `[advanced]`
    - What is backpressure and why does it occur?
    - What strategies can a consumer use to signal backpressure to a producer?
    - How does Kafka handle slow consumers?

---

## 6. API Design

35. **What are the principles of good API design?** `[core]`
    - What makes an API RESTful?
    - What is the Richardson Maturity Model?
    - How do you version a public API?
    - What is HATEOAS?

36. **What is the difference between REST, GraphQL, and gRPC?** `[core]`
    - When would you choose GraphQL over REST?
    - What are the performance benefits of gRPC over REST?
    - What is the n+1 query problem in GraphQL and how is it solved?

37. **How do you design a pagination API for large datasets?** `[core]`
    - What is the difference between offset pagination and cursor-based pagination?
    - Why is cursor-based pagination preferred for real-time feeds?
    - How do you handle page size limits in a public API?

38. **What is rate limiting in APIs and how do you implement it?** `[core]`
    - What algorithms are used for rate limiting (token bucket, leaky bucket, sliding window log)?
    - How do you implement distributed rate limiting?
    - How do you communicate rate limit status to clients (HTTP headers)?

39. **How do you design an idempotent API?** `[advanced]`
    - Which HTTP methods are idempotent by definition?
    - How do you make a POST endpoint idempotent using idempotency keys?
    - What are the storage implications of idempotency key tracking?

40. **How do you handle API versioning?** `[core]`
    - What are the different API versioning strategies (URL path, header, query param)?
    - What are the trade-offs of each versioning approach?
    - How long should you maintain backward compatibility in a versioned API?

41. **What is an API gateway and what does it provide?** `[core]`
    - What is the difference between an API gateway and a reverse proxy?
    - How does an API gateway handle authentication and authorization?
    - What is a BFF (Backend for Frontend) pattern?

---

## 7. Distributed Systems

42. **What are the fallacies of distributed computing?** `[advanced]`
    - What are the 8 fallacies of distributed computing?
    - How does each fallacy affect system design decisions?
    - What is "the network is reliable" fallacy and how do you design around it?

43. **What is a distributed transaction and how do you handle it?** `[advanced]`
    - What is the two-phase commit (2PC) protocol?
    - What is the SAGA pattern and how does it compare to 2PC?
    - What is a compensating transaction and when is it used?

44. **What is the SAGA pattern in microservices?** `[advanced]`
    - What is the difference between choreography and orchestration in SAGA?
    - How do you handle partial failures in a SAGA?
    - What are the trade-offs of using SAGA vs 2PC?

45. **What is leader election and why is it needed in distributed systems?** `[advanced]`
    - How does the Raft consensus algorithm work?
    - How does ZooKeeper implement leader election?
    - What happens during a split-brain scenario?

46. **What is a distributed lock and how do you implement one?** `[advanced]`
    - What is the Redlock algorithm for distributed locking with Redis?
    - What are the risks of distributed locks?
    - When should you use optimistic locking instead of a distributed lock?

47. **How do you design a system for fault tolerance and high availability?** `[core]`
    - What is the difference between fault tolerance and high availability?
    - What is a circuit breaker pattern?
    - What is the retry pattern and what are its risks?
    - What is bulkhead isolation?

48. **What is the two generals problem and what does it illustrate?** `[advanced]`
    - Why can you not guarantee consensus in an unreliable network?
    - How does this relate to real-world distributed systems?
    - What is the Byzantine Generals Problem?

---

## 8. Microservices

49. **What are microservices and how do they differ from monoliths?** `[core]`
    - What are the benefits and drawbacks of microservices?
    - When should you choose a monolith over microservices?
    - What is a modular monolith?

50. **How do microservices communicate with each other?** `[core]`
    - What is the difference between synchronous (REST/gRPC) and asynchronous (message queue) communication?
    - When should microservices communicate synchronously vs asynchronously?
    - What is a service mesh and what problem does it solve?

51. **What is service discovery and how does it work in microservices?** `[core]`
    - What is the difference between client-side and server-side service discovery?
    - How do Consul, Eureka, and Kubernetes DNS handle service discovery?
    - How does a health check integrate with service discovery?

52. **How do you handle data management in a microservices architecture?** `[advanced]`
    - What is the database-per-service pattern?
    - How do you handle data consistency across services without a shared database?
    - What is event sourcing and how does it help with microservices data?

53. **What is the strangler fig pattern?** `[advanced]`
    - How do you migrate a monolith to microservices using the strangler fig pattern?
    - What are the risks of incremental migration?
    - What is an anti-corruption layer?

54. **How do you monitor and debug a microservices system?** `[core]`
    - What is distributed tracing and how does Jaeger or Zipkin work?
    - What is a correlation ID and how is it used?
    - What are the key metrics to monitor for each microservice?

55. **What is a service mesh and what does it provide?** `[advanced]`
    - What is the difference between Istio and Linkerd?
    - What is a sidecar proxy pattern?
    - How does a service mesh handle mTLS between services?

---

## 9. Storage Systems

56. **How do you design a distributed file storage system?** `[core]`
    - How does Google File System (GFS) or HDFS work?
    - What is erasure coding vs replication for data durability?
    - How do you handle file chunking and metadata management?

57. **What is object storage and how does it differ from block storage?** `[core]`
    - What is the difference between object storage (S3), block storage (EBS), and file storage (EFS)?
    - When would you use object storage over a relational database?
    - How does Amazon S3 achieve durability?

58. **How do you design a blob storage system like S3?** `[advanced]`
    - What data structures are used to store and retrieve blobs efficiently?
    - How do you handle large file uploads (multipart upload)?
    - How do you implement access control for stored objects?

59. **What is a columnar storage format and when is it used?** `[advanced]`
    - What is the difference between row-oriented and column-oriented storage?
    - When does columnar storage (Parquet, ORC) outperform row storage?
    - How does columnar storage improve compression?

60. **How do you handle data replication for durability?** `[core]`
    - What is the replication factor and how do you choose it?
    - What is quorum-based replication?
    - How does Cassandra handle replication across data centers?

---

## 10. Real-world System Design Problems

61. **How would you design a URL shortener (like bit.ly)?** `[core]`
    - How do you generate a unique short code?
    - How do you handle collisions in short code generation?
    - How do you scale reads since redirects are very frequent?
    - How do you handle custom aliases?

62. **How would you design a rate limiter?** `[core]`
    - Which algorithm would you use (token bucket, sliding window)?
    - How do you make the rate limiter work across multiple servers?
    - How do you store rate limit state (Redis, in-memory)?

63. **How would you design a notification system?** `[core]`
    - How do you handle push notifications to millions of users?
    - How do you ensure notifications are delivered exactly once?
    - How do you handle user preference settings (opt-out, channels)?

64. **How would you design a social media news feed (like Twitter or Facebook)?** `[core]`
    - What is the fan-out on write vs fan-out on read approach?
    - How do you handle celebrity users with millions of followers in fan-out?
    - How do you rank and filter a user's feed?

65. **How would you design a ride-sharing system (like Uber)?** `[advanced]`
    - How do you match drivers with riders efficiently?
    - How do you handle geolocation and proximity queries at scale?
    - How do you handle surge pricing?

66. **How would you design a distributed key-value store?** `[advanced]`
    - How does consistent hashing distribute keys across nodes?
    - How do you handle node failures and data recovery?
    - How does Amazon DynamoDB or Apache Cassandra implement a key-value store?

67. **How would you design a video streaming platform (like YouTube or Netflix)?** `[advanced]`
    - How do you handle video upload, transcoding, and storage?
    - How does adaptive bitrate streaming work?
    - How do you use a CDN to serve video content globally?

68. **How would you design a chat application (like WhatsApp)?** `[core]`
    - How do you implement real-time message delivery using WebSocket?
    - How do you store and retrieve chat history efficiently?
    - How do you handle group chats and delivery receipts?

69. **How would you design a search autocomplete system?** `[core]`
    - What data structure is used for prefix search (trie)?
    - How do you rank autocomplete suggestions by popularity?
    - How do you update suggestions in real time as trends change?

70. **How would you design a distributed job scheduler?** `[advanced]`
    - How do you ensure a job runs exactly once?
    - How do you handle job failures and retries?
    - How do you schedule jobs with dependencies?

71. **How would you design a payment processing system?** `[advanced]`
    - How do you ensure idempotency in payment APIs?
    - How do you handle double charges and refunds?
    - What compliance considerations (PCI-DSS) affect payment system design?

72. **How would you design a web crawler?** `[advanced]`
    - How do you avoid crawling the same page twice?
    - How do you handle crawl politeness (robots.txt, rate limiting)?
    - How do you scale a crawler to billions of pages?

---

## 11. Reliability and Fault Tolerance

73. **What is the circuit breaker pattern and how does it work?** `[core]`
    - What are the three states of a circuit breaker (closed, open, half-open)?
    - What metrics trigger a circuit breaker to open?
    - How does the circuit breaker pattern relate to the bulkhead pattern?

74. **What is a retry pattern and what are its risks?** `[core]`
    - What is exponential backoff with jitter?
    - What is the difference between retry at the client vs retry at the proxy layer?
    - When should you not retry (non-idempotent operations)?

75. **What is a bulkhead pattern in system design?** `[advanced]`
    - How does bulkhead isolation prevent cascading failures?
    - What is thread pool isolation vs semaphore isolation?
    - How does Netflix's Hystrix implement bulkheads?

76. **How do you design for graceful degradation?** `[core]`
    - What is the difference between graceful degradation and failover?
    - How do you implement a fallback response when a dependency fails?
    - What is feature flagging and how does it support graceful degradation?

77. **What is chaos engineering and why do companies practice it?** `[advanced]`
    - What is Netflix's Chaos Monkey?
    - How do you design a chaos experiment?
    - What is the difference between chaos engineering and load testing?

78. **What are the different types of system failures (hardware, software, network)?** `[core]`
    - What is a cascading failure and how does it start?
    - What is a gray failure and why is it harder to detect than a hard failure?
    - How do you design a system to detect and recover from partial failures?

---

## 12. Security in System Design

79. **How do you design a secure authentication system?** `[core]`
    - What is the difference between session-based and token-based authentication?
    - How do you store passwords securely (bcrypt, Argon2)?
    - How do you implement multi-factor authentication (MFA)?

80. **What is OAuth 2.0 and how does it work in system design?** `[core]`
    - What are the OAuth 2.0 grant types (authorization code, client credentials, implicit)?
    - What is the difference between OAuth 2.0 and OpenID Connect?
    - How do you implement token refresh and revocation?

81. **How do you secure inter-service communication in microservices?** `[advanced]`
    - What is mutual TLS (mTLS) and how does it work?
    - How does a service mesh like Istio enforce mTLS?
    - What is a service account and how is it used for authorization?

82. **How do you design a system to protect against DDoS attacks?** `[core]`
    - What is rate limiting and how does it mitigate DDoS?
    - How do CDNs absorb volumetric DDoS attacks?
    - What is a WAF (Web Application Firewall) and how does it help?

83. **What is encryption at rest vs encryption in transit?** `[core]`
    - How do you implement encryption at rest in a cloud database?
    - What is envelope encryption?
    - What key management strategies exist (KMS, HSM)?

84. **How do you handle secrets management in a distributed system?** `[advanced]`
    - What is HashiCorp Vault and how does it manage secrets?
    - What are the risks of storing secrets in environment variables?
    - How do you rotate secrets without downtime?

---

## 13. Observability and Monitoring

85. **What are the three pillars of observability?** `[core]`
    - What is the difference between logs, metrics, and traces?
    - How do logs, metrics, and traces complement each other?
    - What tools are used for each pillar (ELK, Prometheus, Jaeger)?

86. **How do you design a logging system for a distributed application?** `[core]`
    - What is structured logging and why is it preferred over unstructured logging?
    - How do you aggregate logs from hundreds of services (ELK stack, Loki)?
    - How do you handle log sampling to reduce cost?

87. **What is distributed tracing and how does it work?** `[core]`
    - What is a trace, span, and trace ID?
    - How does a correlation ID propagate through a distributed system?
    - What is OpenTelemetry and why is it important?

88. **What metrics should you monitor for a backend system?** `[core]`
    - What are the four golden signals (latency, traffic, errors, saturation)?
    - How do you set meaningful alert thresholds?
    - What is a p99 latency and why is it more meaningful than average latency?

89. **How do you design an alerting system?** `[advanced]`
    - What is the difference between symptom-based and cause-based alerting?
    - How do you reduce alert fatigue?
    - What is a runbook and how does it relate to alerts?

90. **What is a health check endpoint and how is it used?** `[core]`
    - What is the difference between a liveness check and a readiness check?
    - How does Kubernetes use health checks?
    - What should a health check endpoint actually verify?

---

## 14. Cloud and Infrastructure

91. **What is the difference between IaaS, PaaS, and SaaS?** `[core]`
    - What are examples of each (EC2, Elastic Beanstalk, Salesforce)?
    - When would you choose PaaS over IaaS?
    - What is FaaS (Function as a Service) and how does serverless fit in?

92. **What is serverless computing and when is it appropriate?** `[core]`
    - What is the cold start problem and how do you mitigate it?
    - What are the cost implications of serverless vs always-on servers?
    - What types of workloads are a poor fit for serverless?

93. **What is a VPC and how do you design network security with it?** `[core]`
    - What is the difference between a public subnet and a private subnet?
    - What is a NAT gateway and when is it needed?
    - What is VPC peering and what are its limitations?

94. **What is Infrastructure as Code (IaC) and why is it important?** `[core]`
    - What is the difference between Terraform and CloudFormation?
    - What is idempotency in the context of IaC?
    - How do you manage secrets in IaC configurations?

95. **How do you design a multi-region architecture?** `[advanced]`
    - What is active-active vs active-passive multi-region deployment?
    - How do you handle data replication across regions?
    - How do you handle DNS failover for multi-region deployments?

96. **What is a content delivery network (CDN) and how do you integrate it into a system design?** `[core]`
    - What types of content should be served from a CDN?
    - How does a CDN reduce latency for a globally distributed user base?
    - How do you handle CDN cache invalidation?