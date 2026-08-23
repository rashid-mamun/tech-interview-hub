---
sidebar_position: 1
title: Containers & Kubernetes
---

## 32. What is the difference between a Docker image and a container, and why use a multi-stage build (with ECR as the registry)?

### Why does a multi-stage build reduce the final image size, and why does that matter for ECR/EKS?

## 33. Why would you use ECS or EKS instead of just running Docker on EC2?

### What specific problem (scheduling, self-healing, service discovery) does ECS/EKS solve that raw Docker doesn't?

## 34. What is the EKS architecture — what does the AWS-managed control plane handle vs. worker nodes (EC2 or Fargate)?

### If the EKS control plane has an issue, do your already-running pods keep serving traffic?

## 35. What is the difference between a Pod, Deployment, ReplicaSet, DaemonSet, and StatefulSet in EKS?

### When would you use a DaemonSet instead of a Deployment?

### Why does a StatefulSet need stable network identity, and what real workload needs that?

## 36. What is the difference between a Kubernetes Service and Ingress on EKS, and how does the AWS Load Balancer Controller map Ingress to an ALB?

### What's the difference between a ClusterIP Service and a headless Service?

## 37. What is the difference between a ConfigMap and a Secret (or Secrets Manager/Parameter Store integration)? What is a PersistentVolume vs. a PVC, via the EBS CSI driver?

### Why is storing a secret in a ConfigMap a bad practice even though it technically works?

## 38. How does the Horizontal Pod Autoscaler work on EKS? What's the difference between a liveness and a readiness probe?

### What happens to traffic routing if a pod fails its readiness probe but still passes its liveness probe?

## 39. What is Helm, and what problem do Helm charts solve when deploying to EKS?

### What real problem does templating solve when the same app is deployed to three environments?

## 40. How does EKS map IAM to Kubernetes RBAC (aws-auth ConfigMap), and what is a Network Policy?

### How does IRSA (IAM Roles for Service Accounts) let a pod assume an IAM role without hardcoded credentials?

## 41. Why is ECR image vulnerability scanning important (CVEs), and why avoid running containers as root?

### What's the actual risk of a root container even if it's otherwise isolated?
