---
sidebar_position: 1
title: Cloud Computing Interview Questions
---

## 1. Cloud Fundamentals

1. What is cloud computing, and how is it different from traditional on-premise infrastructure?
   - What are the core characteristics of cloud (on-demand self-service, elasticity, pay-as-you-go)?
   - What are the risks/downsides of cloud adoption (vendor lock-in, security, compliance)?

2. What is the difference between IaaS, PaaS, SaaS, and FaaS?
   - What does the customer manage in each model — which gives the most control, and which needs the least operational work?
   - When would you choose one over another?

3. What is the difference between public, private, hybrid, and multi-cloud?
   - Why are hybrid and multi-cloud not the same thing?
   - What are the operational challenges of multi-cloud?

4. What are Regions and Availability Zones?
   - Why should production systems span multiple AZs?
   - How does region selection affect latency/compliance?

5. What is the Shared Responsibility Model?
   - How does the split of responsibility change across IaaS vs. PaaS vs. SaaS?

6. What is cloud elasticity and auto-scaling, and how does elasticity differ from scalability?
   - What's the difference between horizontal and vertical scaling (scale-out vs. scale-in)?
   - What metrics typically trigger auto-scaling?

---

## 2. Compute

7. What is the difference between a virtual machine and a container?
   - What do you consider when picking an instance type (CPU, memory, network)?

8. What is the difference between spot/preemptible instances and reserved/savings-plan instances?
   - How should an application handle a spot instance interruption?

9. What is serverless compute (Lambda, Cloud Functions)?
   - What is the cold start problem, and how do you reduce it (provisioned concurrency, smaller packages)?
   - When should you avoid serverless?

10. What is edge computing, and why does it reduce latency?
    - How does edge computing differ from a traditional CDN?

---

## 3. Storage

11. What is the difference between object, block, and file storage?
    - When would you use each (images/videos vs. DB disks vs. shared filesystem)?

12. What are storage tiers/classes (hot, cool, cold, archive)?
    - How do lifecycle policies reduce cost?

13. What is storage replication (same-region vs. cross-region, sync vs. async)?
    - What trade-off exists between sync and async replication?

14. What is a signed/pre-signed URL, and why is it used?
    - How do you control its expiry and permissions safely?

15. What is data durability, and how is it different from availability?
    - Can a storage system be highly durable but not highly available?

---

## 4. Networking

16. What is a VPC, and why is a CIDR block needed?
    - How do you plan CIDR ranges to avoid overlap across environments/regions?

17. What is the difference between a public subnet and a private subnet?
    - Why are databases usually placed in private subnets?

18. What is the difference between an internet gateway and a NAT gateway?
    - Why does a NAT gateway only allow outbound, not inbound, initiated traffic?

19. What is the difference between a security group and a network ACL — stateful vs. stateless?
    - Why do you need both layers instead of relying on just one?

20. What is the difference between Layer 4 and Layer 7 load balancing (ALB vs. NLB)?
    - How do health checks affect routing?

21. What is the difference between VPC peering and a transit gateway, and when do you need each?
    - Why is transitive routing usually not supported over peering?

22. What is a private endpoint/private link, and why is it more secure than a public endpoint?
    - How does it help avoid traffic going over the public internet?

23. What is DNS-based routing (latency-based, weighted, failover)?
    - How is DNS failover different from load balancer-based failover?

24. What is the difference between a site-to-site VPN and a dedicated interconnect (e.g., Direct Connect)?
    - What factors would push you toward a dedicated interconnect?

---

## 5. Databases

25. What are the benefits of a managed database service, and what do you still have to manage yourself?
    - What operational burden does it remove versus self-hosting?

26. What is a read replica, and what is replication lag?
    - How can replication lag cause stale reads, and how do you mitigate it?

27. When would you choose a relational database over NoSQL, or vice versa?
    - How does partition key design affect performance?

28. How does database high availability (multi-AZ, failover) work?
    - What happens to open connections during a failover event?

29. What is the difference between snapshot backup and continuous backup? What is point-in-time recovery?
    - How does continuous backup enable a lower RPO than periodic snapshots?

30. Why is connection pooling important, especially with serverless functions? How do managed poolers help?
    - What happens if you don't pool connections in a highly concurrent serverless workload?

31. What is a data warehouse, and how is it different from an OLTP database?
    - Why are OLAP workloads typically separated from OLTP systems?

---

## 6. Containers & Kubernetes

32. What is the difference between a Docker image and a container, and why use a multi-stage build?

33. Why is Kubernetes needed — why isn't Docker alone enough?
    - What problems does Kubernetes solve that plain container orchestration by hand doesn't (self-healing, scheduling, scaling)?

34. What is the Kubernetes architecture — what do the control plane (API server, etcd, scheduler) and worker node (kubelet) each do?
    - What happens to running workloads if the control plane goes down temporarily?

35. What is the difference between a Pod, Deployment, ReplicaSet, DaemonSet, and StatefulSet?
    - When would you use a StatefulSet instead of a Deployment?

36. What is the difference between a Kubernetes Service (ClusterIP/NodePort/LoadBalancer) and an Ingress?
    - Why would you use an Ingress instead of exposing many LoadBalancer services?

37. What is the difference between a ConfigMap and a Secret? What is a PersistentVolume vs. a PVC vs. a StorageClass?
    - Are Kubernetes Secrets encrypted by default — what extra steps are needed for real secret security?

38. How does the Horizontal Pod Autoscaler work? What's the difference between a liveness and a readiness probe?
    - What happens if a readiness probe is misconfigured as a liveness probe?

39. What is Helm, and what problem do Helm charts solve?
    - How does Helm help with versioning and rollback of releases?

40. What is Kubernetes RBAC, and what is a Network Policy?
    - Why is a default-deny Network Policy considered a security best practice?

41. Why is container image vulnerability scanning important (CVEs), and why avoid running containers as root?
    - At what stage of the pipeline should image scanning happen?

---

## 7. Serverless & Event-Driven Architecture

42. What is event-driven architecture, and how does it decouple producers and consumers?
    - What trade-offs does decoupling introduce (eventual consistency, debugging complexity)?

43. What is the difference between a message queue and pub/sub?
    - What is a dead-letter queue, and what is visibility timeout?

44. What is an event bus, and how is it different from pub/sub?
    - How does content-based routing/filtering work on an event bus?

45. What role does an API Gateway play in serverless architecture (auth, throttling)?
    - How does it help with request validation and centralizing cross-cutting concerns?

46. What is a serverless workflow/state-machine service (orchestration vs. choreography)?
    - When would you prefer orchestration over choreography for a multi-step process?

---

## 8. CI/CD & Infrastructure as Code

47. What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?
    - What manual gate typically separates Continuous Delivery from Continuous Deployment?

48. What are the trade-offs between blue-green, canary, and rolling deployment (including in a Kubernetes context)?
    - How do feature flags decouple deployment from release?

49. What is DevSecOps — SAST vs. DAST — and how do you safely inject secrets into a pipeline?
    - At what pipeline stage does each type of scanning typically run?

50. Why is Infrastructure as Code better than manual console changes?
    - How does IaC improve auditability and reproducibility?

51. What is Terraform — provider, resource, state, plan, apply — and why does remote state matter?
    - When would you choose Terraform vs. CloudFormation?

52. What is idempotency and drift in IaC, and how do you detect drift?
    - What causes drift in practice, and how do you reconcile it safely?

53. What's the difference between agent-based and agentless configuration management (Ansible/Chef/Puppet)?
    - How is configuration management different from provisioning?

54. What is immutable infrastructure, and why replace servers instead of modifying them?
    - How does immutability reduce configuration drift and "snowflake servers"?

55. What is GitOps, and how does it differ from traditional CI/CD?
    - How does a GitOps controller reconcile the live state with the Git repository?

---

## 9. Monitoring, Logging & Observability

56. What is the difference between monitoring, logging, and observability (metrics, logs, traces)?
    - Can a system be heavily monitored but not observable?

57. How do Prometheus and Grafana work together? What's push vs. pull-based metrics collection?
    - When would you need a push gateway with a pull-based system like Prometheus?

58. Why is centralized logging (ELK/EFK) and structured logging important?
    - Why is structured (JSON) logging easier to query than plain text logs?

59. What is distributed tracing (trace ID, span)? What is OpenTelemetry?
    - How does trace context get propagated across service boundaries?

60. How do you avoid alert fatigue? How do severity levels help?
    - What makes an alert actionable versus noisy?

61. What are SLI, SLO, SLA, and how does an error budget relate to them?
    - What happens to release velocity when the error budget is exhausted?

62. Why is audit logging important, and what events should be audited?
    - Why should audit logs be stored separately and be tamper-resistant?

63. What's the difference between synthetic monitoring and real-user monitoring?
    - What kind of issues does synthetic monitoring catch that RUM might miss, and vice versa?

---

## 10. Security & IAM

64. What are IAM users, groups, roles, and policies? What is least privilege?
    - Why are IAM roles generally preferred over long-lived user credentials for workloads?

65. How does RBAC work, and why are temporary credentials preferred over long-lived ones?
    - How do temporary credentials limit the blast radius of a leaked key?

66. Why is MFA important, and what is a break-glass account?
    - How should a break-glass account be secured and monitored?

67. What is the difference between encryption at rest and in transit? What is envelope encryption?
    - Why is envelope encryption more efficient than encrypting large data directly with a KMS key?

68. What is a KMS, and how does key rotation work?
    - What's the difference between automatic and manual key rotation?

69. Why shouldn't secrets be stored in source code, and how do you rotate them?
    - What tools/services are commonly used for secret management (e.g., secrets manager, vault)?

70. What is a WAF, and what attacks does it protect against?
    - How does a WAF differ from a network firewall/security group?

71. What's the difference between volumetric and application-layer DDoS, and how does a CDN help mitigate it?
    - Why is rate limiting alone often insufficient against a large volumetric attack?

---

## 11. Reliability, High Availability & Disaster Recovery

72. What is the difference between high availability and fault tolerance?
    - Can a system be fault-tolerant without being highly available, or vice versa?

73. What are RPO and RTO, and how do they shape backup design?
    - How does a lower RPO requirement change your backup frequency and cost?

74. What's the difference between backup/restore, pilot light, warm standby, and active-active DR strategies?
    - How does cost scale as you move from backup/restore toward active-active?

75. What's the difference between active-active and active-passive multi-region architecture? How does DNS failover work?
    - What data consistency challenges does active-active introduce?

76. What is chaos engineering, and what is a game day?
    - Why is chaos engineering typically run in production rather than only in staging?

77. Why is backup testing important, and how do you run a restore drill?
    - What's the risk of never testing a restore before you actually need it?

78. What is a runbook, and how does it help incident response? How is it different from a postmortem?
    - What makes a runbook effective during a high-pressure incident?

---

## 12. Cost Optimization

79. Where does most cloud cost typically get wasted (idle resources)?
    - How do orphaned resources (unattached volumes, idle load balancers) contribute to waste?

80. How does tagging/labeling help with cost allocation?
    - What happens to cost visibility when tagging isn't enforced consistently?

81. What is right-sizing, and how do you identify over-provisioned resources?
    - What metrics would you look at to decide if an instance is over-provisioned?

82. When would you choose reserved instances/savings plans vs. spot vs. on-demand pricing?
    - How would you mix these across a single workload for optimal cost?

83. Why can data transfer (ingress/egress) costs spike unexpectedly, and how do lifecycle policies help control the bill?
    - How does cross-AZ or cross-region traffic quietly add to the bill?

---

## 13. Migration & Architecture Decisions

84. What are the main cloud migration strategies — rehost (lift-and-shift), replatform, refactor, retire, retain?
    - How do you decide which strategy fits a given legacy application?

85. What are the limitations of lift-and-shift migration, and why does it often need modernizing later?
    - Why might a lift-and-shift migration fail to reduce operational cost?

86. What makes an architecture "cloud-native" — how do microservices, containers, automation, and observability fit in? Is every cloud-hosted app cloud-native?
    - Can a monolith running on cloud VMs be considered cloud-native?

87. What trade-offs do you weigh when choosing managed vs. self-managed services?
    - How does the choice affect operational overhead versus flexibility/cost?

88. Why should production, staging, and dev accounts be separated (account structure, governance, service control policies)?
    - How do service control policies help enforce guardrails across accounts?

---

## 14. Architecture Patterns

89. What is a service mesh, and what problem does a sidecar proxy solve?
    - What capabilities does a service mesh add beyond basic service-to-service networking (mTLS, retries, observability)?

90. What is the circuit breaker pattern, and how does it prevent cascading failures?
    - What are the typical states of a circuit breaker (closed, open, half-open)?

91. What is the difference between client-side and server-side service discovery?
    - What additional logic does client-side discovery push onto each service?

---