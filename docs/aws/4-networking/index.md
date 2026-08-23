---
sidebar_position: 1
title: Networking
---

## 16. What is a VPC, and why is a CIDR block needed when creating one?

### Why is resizing a VPC's CIDR block after creation difficult, and what do you do instead?

## 17. What is the difference between a public subnet and a private subnet in a VPC?

### Why are RDS databases usually placed in private subnets?

### If a private subnet needs outbound internet access for patching, how does it get it without a public IP?

## 18. What is the difference between an Internet Gateway (IGW) and a NAT Gateway?

### What's the cost-model difference between a NAT Gateway and a self-managed NAT instance?

## 19. What is the difference between a Security Group and a Network ACL — stateful vs. stateless?

### If you need to explicitly deny traffic from one specific IP, which one do you use, and why?

## 20. What is the difference between an Application Load Balancer (Layer 7) and a Network Load Balancer (Layer 4)?

### How do target group health checks affect routing decisions?

### When would you need an NLB even though your traffic is plain HTTP?

## 21. What is the difference between VPC Peering and a Transit Gateway, and when do you need each?

### Why doesn't VPC Peering support transitive routing?

### At roughly how many VPCs does peering become unmanageable, forcing a move to Transit Gateway?

## 22. What is a VPC Endpoint / AWS PrivateLink, and why is it more secure than routing over the public internet?

### What's the difference between a Gateway endpoint (S3, DynamoDB) and an Interface endpoint?

### Why is a Gateway endpoint free while an Interface endpoint isn't?

## 23. What is Route 53, and how do latency-based, weighted, and failover routing policies work?

### How would you use weighted routing to gradually canary a new region?

## 24. What is the difference between AWS Site-to-Site VPN and Direct Connect?

### When would you run both together (VPN as a failover path for Direct Connect)?
