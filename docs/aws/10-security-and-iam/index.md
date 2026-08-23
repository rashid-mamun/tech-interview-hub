---
sidebar_position: 1
title: Security & IAM
---

## 64. What are IAM users, groups, roles, and policies? What is the principle of least privilege?

### What's wrong with attaching a policy directly to a user instead of a group or role?

## 65. How does IAM Role-based access (and STS temporary credentials) work, and why are they preferred over long-lived access keys?

### Why are long-lived access keys a security risk even with a tightly scoped policy attached?

## 66. Why is MFA important on AWS accounts, and what is a "break-glass" root account procedure?

### What should a break-glass account's access look like, and how do you audit when it's used?

## 67. What is the difference between encryption at rest (KMS) and in transit (TLS)? What is envelope encryption in KMS?

### Why does KMS use envelope encryption instead of directly encrypting large objects with the master key?

## 68. What is AWS KMS, and how does automatic vs. manual key rotation work?

### What breaks if you rotate a CMK manually without updating the resources that reference it?

## 69. Why shouldn't secrets be stored in source code, and how do Secrets Manager or Parameter Store handle rotation?

### When would you pick Secrets Manager over Parameter Store, given the cost difference?

## 70. What is AWS WAF, and what attacks does it protect against (SQL injection, XSS, bot traffic)?

### How would you write a WAF rule to rate-limit a specific IP hitting a login endpoint?

## 71. What's the difference between volumetric and application-layer DDoS, and how do AWS Shield and CloudFront help mitigate each?

### Why doesn't Shield Standard alone protect against a sophisticated Layer 7 attack?
