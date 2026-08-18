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


## 6. Serverless & Event-Driven Architecture

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

## 7. Reliability, High Availability & Disaster Recovery

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
