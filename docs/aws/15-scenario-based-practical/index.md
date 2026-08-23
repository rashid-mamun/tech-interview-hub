---
sidebar_position: 1
title: Scenario-Based / Practical
---

## 92. How would you design a highly available backend on AWS (multi-AZ EC2/ASG behind an ALB, RDS Multi-AZ failover)?

### What happens to in-flight requests during an AZ failure?

### How do you actually test that failover works before it's needed in production?

## 93. How would you deploy a Node.js backend on AWS end-to-end (EC2 vs. ECS vs. Lambda, Secrets Manager, ALB, Auto Scaling, CloudWatch)?

### How would you handle environment-specific configuration across dev/staging/prod?

### What's your rollback plan if the new deployment turns out to be broken?

## 94. How would you handle a full AWS region outage (Route 53 failover, RPO/RTO targets, cross-region DR)?

### Who decides the RPO/RTO targets, and how is that decision typically made?

### What's your communication plan to users while the outage is ongoing?

## 95. How would you secure a public API on AWS (Cognito/IAM auth, API Gateway throttling, WAF and Shield, CloudWatch logging)?

### How would you protect against a leaked API key being used for a burst of fraudulent requests?

### What gets logged so you can investigate after the fact?

## 96. Your AWS bill suddenly doubled — how do you debug it using Cost Explorer and the Cost and Usage Report?

### What's the first report you'd pull, and what would you look for first?

### How do you prevent this from silently happening again (budgets, anomaly alerts)?

## 97. How would you design observability for a microservices system on AWS (CloudWatch + X-Ray, trace ID propagation, alarms)?

### How do you propagate a trace ID across an async boundary like SQS?

### Do you alert on symptoms (latency, errors) or on root causes — and why?

## 98. How would you design a secure file-upload system using S3 and CloudFront (pre-signed URLs, malware scanning via GuardDuty Malware Protection or a Lambda-based scanner)?

### What do you do if a malicious file is flagged after it's already uploaded but before it's served?

### How do you stop users from bypassing your validation step and uploading directly?

## 99. How would you design serverless image processing triggered by an S3 upload event (S3 → Lambda)?

### How do you avoid processing the same event twice if Lambda retries?

### What happens if processing takes longer than the Lambda timeout?

## 100. How would you migrate a monolithic application to AWS with minimal downtime (DMS for the database, blue-green cutover via Route 53/ALB)?

### How do you handle schema changes during a live cutover with DMS?

### What's your rollback plan if the new environment misbehaves right after cutover?

## 101. How would you design the backend for a real-time chat application on AWS (API Gateway WebSocket APIs, DynamoDB for chat history, Global Tables for multi-region)?

### How do you handle a client disconnecting and reconnecting?

### How would you scale connection state across multiple WebSocket API instances?

## 102. How would you design a video streaming platform on AWS (S3 upload, MediaConvert transcoding, CloudFront delivery)?

### How do you handle different output formats/bitrates for different devices?

### What's your strategy for reliably handling very large (multi-GB) uploads?

## 103. How would you design an e-commerce backend on AWS (ECS/EKS microservices, DynamoDB/RDS for orders, SQS/SNS for async, PCI-compliant payments)?

### How do you guarantee exactly-once processing of a payment event?

### What happens if the payment succeeds but the order-service update fails?

## 104. How do you debug a failing pod in EKS? What's the difference between `CrashLoopBackOff` and `ImagePullBackOff`, and what does `kubectl describe pod` tell you?

### If you see `ImagePullBackOff`, what are the first three things you'd check (ECR auth, image tag, network)?

### How is debugging different if the pod is stuck in `Pending` instead?

## 105. What is ChatOps using AWS Chatbot with Slack/Teams, and what are the security considerations of triggering infra changes from chat?

### What guardrails would stop a Slack command from accidentally deleting a production resource?
