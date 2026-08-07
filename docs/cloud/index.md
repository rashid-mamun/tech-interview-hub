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

---

## 3. Storage

11. What is the difference between object, block, and file storage?
    - When would you use each (images/videos vs. DB disks vs. shared filesystem)?

12. What are storage tiers/classes (hot, cool, cold, archive)?
    - How do lifecycle policies reduce cost?

13. What is storage replication (same-region vs. cross-region, sync vs. async)?

14. What is a signed/pre-signed URL, and why is it used?

15. What is data durability, and how is it different from availability?

---

## 4. Networking

16. What is a VPC, and why is a CIDR block needed?

17. What is the difference between a public subnet and a private subnet?
    - Why are databases usually placed in private subnets?

18. What is the difference between an internet gateway and a NAT gateway?

19. What is the difference between a security group and a network ACL — stateful vs. stateless?

20. What is the difference between Layer 4 and Layer 7 load balancing (ALB vs. NLB)?
    - How do health checks affect routing?

21. What is the difference between VPC peering and a transit gateway, and when do you need each?
    - Why is transitive routing usually not supported over peering?

22. What is a private endpoint/private link, and why is it more secure than a public endpoint?

23. What is DNS-based routing (latency-based, weighted, failover)?

24. What is the difference between a site-to-site VPN and a dedicated interconnect (e.g., Direct Connect)?

---

## 5. Databases

25. What are the benefits of a managed database service, and what do you still have to manage yourself?

26. What is a read replica, and what is replication lag?

27. When would you choose a relational database over NoSQL, or vice versa?
    - How does partition key design affect performance?

28. How does database high availability (multi-AZ, failover) work?

29. What is the difference between snapshot backup and continuous backup? What is point-in-time recovery?

30. Why is connection pooling important, especially with serverless functions? How do managed poolers help?

31. What is a data warehouse, and how is it different from an OLTP database?

---

## 6. Containers & Kubernetes

32. What is the difference between a Docker image and a container, and why use a multi-stage build?

33. Why is Kubernetes needed — why isn't Docker alone enough?

34. What is the Kubernetes architecture — what do the control plane (API server, etcd, scheduler) and worker node (kubelet) each do?

35. What is the difference between a Pod, Deployment, ReplicaSet, DaemonSet, and StatefulSet?

36. What is the difference between a Kubernetes Service (ClusterIP/NodePort/LoadBalancer) and an Ingress?

37. What is the difference between a ConfigMap and a Secret? What is a PersistentVolume vs. a PVC vs. a StorageClass?

38. How does the Horizontal Pod Autoscaler work? What's the difference between a liveness and a readiness probe?

39. What is Helm, and what problem do Helm charts solve?

40. What is Kubernetes RBAC, and what is a Network Policy?

41. Why is container image vulnerability scanning important (CVEs), and why avoid running containers as root?

---

## 7. Serverless & Event-Driven Architecture

42. What is event-driven architecture, and how does it decouple producers and consumers?

43. What is the difference between a message queue and pub/sub?
    - What is a dead-letter queue, and what is visibility timeout?

44. What is an event bus, and how is it different from pub/sub?

45. What role does an API Gateway play in serverless architecture (auth, throttling)?

46. What is a serverless workflow/state-machine service (orchestration vs. choreography)?

---

## 8. CI/CD & Infrastructure as Code

47. What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?

48. What are the trade-offs between blue-green, canary, and rolling deployment (including in a Kubernetes context)?
    - How do feature flags decouple deployment from release?

49. What is DevSecOps — SAST vs. DAST — and how do you safely inject secrets into a pipeline?

50. Why is Infrastructure as Code better than manual console changes?

51. What is Terraform — provider, resource, state, plan, apply — and why does remote state matter?
    - When would you choose Terraform vs. CloudFormation?

52. What is idempotency and drift in IaC, and how do you detect drift?

53. What's the difference between agent-based and agentless configuration management (Ansible/Chef/Puppet)?
    - How is configuration management different from provisioning?

54. What is immutable infrastructure, and why replace servers instead of modifying them?

55. What is GitOps, and how does it differ from traditional CI/CD?

---

## 9. Monitoring, Logging & Observability

56. What is the difference between monitoring, logging, and observability (metrics, logs, traces)?

57. How do Prometheus and Grafana work together? What's push vs. pull-based metrics collection?

58. Why is centralized logging (ELK/EFK) and structured logging important?

59. What is distributed tracing (trace ID, span)? What is OpenTelemetry?

60. How do you avoid alert fatigue? How do severity levels help?

61. What are SLI, SLO, SLA, and how does an error budget relate to them?

62. Why is audit logging important, and what events should be audited?

63. What's the difference between synthetic monitoring and real-user monitoring?

---

## 10. Security & IAM

64. What are IAM users, groups, roles, and policies? What is least privilege?

65. How does RBAC work, and why are temporary credentials preferred over long-lived ones?

66. Why is MFA important, and what is a break-glass account?

67. What is the difference between encryption at rest and in transit? What is envelope encryption?

68. What is a KMS, and how does key rotation work?

69. Why shouldn't secrets be stored in source code, and how do you rotate them?

70. What is a WAF, and what attacks does it protect against?

71. What's the difference between volumetric and application-layer DDoS, and how does a CDN help mitigate it?

---

## 11. Reliability, High Availability & Disaster Recovery

72. What is the difference between high availability and fault tolerance?

73. What are RPO and RTO, and how do they shape backup design?

74. What's the difference between backup/restore, pilot light, warm standby, and active-active DR strategies?

75. What's the difference between active-active and active-passive multi-region architecture? How does DNS failover work?

76. What is chaos engineering, and what is a game day?

77. Why is backup testing important, and how do you run a restore drill?

78. What is a runbook, and how does it help incident response? How is it different from a postmortem?

---

## 12. Cost Optimization

79. Where does most cloud cost typically get wasted (idle resources)?

80. How does tagging/labeling help with cost allocation?

81. What is right-sizing, and how do you identify over-provisioned resources?

82. When would you choose reserved instances/savings plans vs. spot vs. on-demand pricing?

83. Why can data transfer (ingress/egress) costs spike unexpectedly, and how do lifecycle policies help control the bill?

---

## 13. Migration & Architecture Decisions

84. What are the main cloud migration strategies — rehost (lift-and-shift), replatform, refactor, retire, retain?

85. What are the limitations of lift-and-shift migration, and why does it often need modernizing later?

86. What makes an architecture "cloud-native" — how do microservices, containers, automation, and observability fit in? Is every cloud-hosted app cloud-native?

87. What trade-offs do you weigh when choosing managed vs. self-managed services?

88. Why should production, staging, and dev accounts be separated (account structure, governance, service control policies)?

---

## 14. Architecture Patterns

89. What is a service mesh, and what problem does a sidecar proxy solve?

90. What is the circuit breaker pattern, and how does it prevent cascading failures?

91. What is the difference between client-side and server-side service discovery?

---

## 15. Scenario-Based / Practical

*Less about memorized facts, more about showing you can reason through a design — good for demonstrating real experience.*

92. How would you design a highly available backend application (multi-AZ, load balancer placement, DB failover)?

93. How would you deploy a Node.js backend on the cloud end-to-end (compute choice, secrets/env vars, load balancing, auto scaling, monitoring)?

94. How would you handle a full region outage (failover strategy, RPO/RTO targets, user communication)?

95. How would you secure a public-facing API (auth, rate limiting, DDoS/bot protection, monitoring)?

96. Your cloud bill suddenly doubled — how do you debug it (billing reports, idle resources, data transfer spikes)?

97. How would you design observability for a microservices system (metrics/logs/traces, trace ID propagation, alerts)?

98. How would you design a secure file-upload system using object storage and a CDN (direct-to-storage upload, validation, malware scanning)?

99. How would you design serverless image processing triggered by an upload event? How do you handle failures and avoid duplicate processing?

100. How would you migrate a monolithic application to the cloud with minimal downtime?

101. How would you design the backend for a real-time chat application (WebSocket connection management, chat history storage, multi-region scaling)?

102. How would you design a video streaming platform (upload, transcode, CDN delivery)?

103. How would you design an e-commerce backend (services, order consistency, async processing, payment security)?

104. How do you debug a failing Kubernetes pod in production? What's the difference between `CrashLoopBackOff` and `ImagePullBackOff`, and what does `kubectl describe pod` tell you?

105. What is ChatOps, and what are the security considerations of triggering infra changes from chat?