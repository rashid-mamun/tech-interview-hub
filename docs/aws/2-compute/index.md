---
sidebar_position: 1
title: Compute
---

## 7. What is the difference between an EC2 instance and a container running on ECS/EKS?

### How do you choose an EC2 instance family/type (T, M, C, R series) based on CPU, memory, and network needs?

### How do you decide between many small instances vs. fewer large ones for the same total capacity?

## 8. What is the difference between EC2 Spot Instances, Reserved Instances, Savings Plans, and On-Demand?

### How should an application handle a Spot Instance interruption (2-minute warning, Spot Fleet, interruption handlers)?

### What kind of workload is a bad fit for Spot Instances?

### What's the flexibility difference between a Savings Plan and a Reserved Instance?

## 9. What is AWS Lambda, and how does it fit the serverless model?

### What is the Lambda cold start problem, and how do you reduce it (Provisioned Concurrency, smaller packages, SnapStart)?

### When should you avoid Lambda (long-running jobs beyond the 15-minute timeout, steady heavy compute)?

### How does Lambda's pricing model (requests + duration + memory) change your design choices?

## 10. What is edge computing on AWS (CloudFront, Lambda@Edge, CloudFront Functions), and why does it reduce latency?

### What's the difference between Lambda@Edge and CloudFront Functions, and when would you pick one over the other?

### What kind of logic should never run at the edge?
