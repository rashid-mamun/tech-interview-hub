---
sidebar_position: 1
title: Cloud Fundamentals
---

## 1. What is cloud computing, and how does AWS differ from traditional on-premise infrastructure?

### What are AWS's core characteristics (on-demand self-service, elasticity, pay-as-you-go pricing)?

### What are the risks of relying on AWS (vendor lock-in, shared security responsibility, compliance)?

### Can you give an example of a workload that's actually cheaper to keep on-prem?

### How would you explain "elasticity" to a non-technical stakeholder?

## 2. What is the difference between IaaS, PaaS, SaaS, and FaaS, and which AWS services represent each?

### EC2 (IaaS) vs. Elastic Beanstalk/RDS (PaaS) vs. Lambda (FaaS) — what does AWS manage in each?

### When would you choose EC2 vs. Elastic Beanstalk vs. Lambda for a given workload?

### If you migrate a service from EC2 to Lambda, what operational burden disappears, and what new constraints appear?

## 3. What is the difference between a single-account/single-region AWS setup, a hybrid setup, and multi-cloud?

### How do AWS Outposts and Direct Connect support hybrid architectures?

### What are the operational challenges of running AWS alongside another cloud provider?

### Why might a company deliberately choose multi-cloud despite the added complexity?

## 4. What are AWS Regions and Availability Zones?

### Why should production workloads span multiple AZs within a region?

### How does region selection affect latency, data residency, and compliance (e.g., GovCloud)?

### What's the difference in blast radius between an AZ-level failure and a full region-level failure?

## 5. What is the AWS Shared Responsibility Model?

### How does the split differ between EC2 (IaaS), RDS (managed), and Lambda (FaaS)?

### Who's responsible for OS patching on EC2 vs. RDS vs. Lambda?

### If there's a data breach because of a misconfigured public S3 bucket, whose fault is it under this model?

## 6. What is elasticity in AWS, and how do Auto Scaling Groups (ASG) implement it?

### What's the difference between horizontal scaling (adding/removing instances) and vertical scaling (resizing an instance)?

### What CloudWatch metrics typically trigger an ASG scaling policy?

### What's the ASG cooldown period, and why does skipping it cause problems?
