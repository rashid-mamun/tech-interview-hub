---
sidebar_position: 1
title: Databases
---

## 25. What are the benefits of RDS/Aurora as a managed database, and what do you still have to manage yourself?

### What's the difference between Aurora and standard RDS MySQL/PostgreSQL in terms of what AWS manages?

## 26. What is an RDS Read Replica, and what is replication lag?

### How would your application detect and handle stale reads from a lagging replica?

## 27. When would you choose RDS (relational) over DynamoDB (NoSQL), or vice versa?

### How does DynamoDB partition key design affect performance and hot partitions?

## 28. How does RDS Multi-AZ deployment and automatic failover work?

### How long does failover typically take, and what does the application experience during that window?

## 29. What is the difference between an RDS automated snapshot and continuous backup? What is point-in-time recovery?

## 30. Why is connection pooling important for RDS with Lambda, and how does RDS Proxy help?

### Why does Lambda's concurrency model make traditional connection pooling break down?

## 31. What is Amazon Redshift (data warehouse), and how is it different from RDS (OLTP)?

### Why would running analytical queries directly against production RDS be a bad idea?
