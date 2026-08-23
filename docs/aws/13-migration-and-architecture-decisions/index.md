---
sidebar_position: 1
title: Migration & Architecture Decisions
---

## 84. What are AWS's migration strategies (the "6 R's": rehost, replatform, refactor, retire, retain, repurchase), and how do Migration Hub/DMS support them?

## 85. What are the limitations of lift-and-shift migration to EC2, and why does it often need modernizing later?

### What cost or performance problem typically shows up 6 months after a pure lift-and-shift?

## 86. What makes an architecture "cloud-native" on AWS — how do ECS/EKS/Lambda, CDK/CloudFormation, and CloudWatch/X-Ray fit in?

### Is an EC2-hosted monolith automatically "not cloud-native"? Why or why not?

## 87. What trade-offs do you weigh when choosing a managed service (RDS, Lambda) vs. self-managed (running your own DB on EC2)?

### What's a scenario where self-managing a database on EC2 actually makes sense over RDS?

## 88. Why should production, staging, and dev workloads live in separate AWS accounts, and how do AWS Organizations and Service Control Policies (SCPs) enforce that?

### What's an SCP you'd apply company-wide regardless of which account it is?
