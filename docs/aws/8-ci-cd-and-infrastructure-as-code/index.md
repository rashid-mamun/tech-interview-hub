---
sidebar_position: 1
title: CI/CD & Infrastructure as Code
---

## 47. What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment, and how do CodeCommit/CodeBuild/CodeDeploy/CodePipeline map to each?

### What's the actual difference between Continuous Delivery and Continuous Deployment in terms of the human approval gate?

## 48. What are the trade-offs between blue-green, canary, and rolling deployment using CodeDeploy or ECS/EKS deployment configs?

### How does AWS AppConfig decouple deployment from release using feature flags?

### If a canary shows elevated error rates, how do you trigger an automatic rollback?

## 49. What is DevSecOps on AWS — where do SAST/DAST tools fit, and how do you inject secrets from Secrets Manager/Parameter Store into CodeBuild safely?

### Where in the pipeline should SAST run vs. DAST, and why does the order matter?

## 50. Why is Infrastructure as Code (CloudFormation/Terraform/CDK) better than manual changes in the AWS Console ("ClickOps")?

## 51. What is Terraform's AWS provider — resource and state — and why should state live in a remote backend (S3 + DynamoDB lock)?

### Why is state locking necessary, and what breaks without it?

### When would you choose Terraform vs. CloudFormation vs. CDK?

## 52. What is idempotency and drift in IaC, and how do CloudFormation drift detection or `terraform plan` surface it?

### What would you do if drift detection shows a resource was manually changed outside of IaC?

## 53. What is the difference between agent-based and agentless configuration management, and how does AWS Systems Manager (SSM) fit in vs. Chef/Puppet?

### Why is SSM considered "agentless" from the user's perspective even though it technically runs an agent?

## 54. What is immutable infrastructure on AWS — using AMIs and replacing instances instead of patching in place?

## 55. What is GitOps, and how would you implement it on EKS (Flux/ArgoCD) vs. a traditional CodePipeline setup?

### What's the core philosophical difference — "push" deployment vs. "pull" deployment?
