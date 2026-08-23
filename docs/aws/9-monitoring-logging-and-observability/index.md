---
sidebar_position: 1
title: Monitoring, Logging & Observability
---

## 56. What is the difference between CloudWatch (metrics/logs) and X-Ray (traces) — how do they cover monitoring, logging, and observability?

### If a request is slow, which of the three pillars actually tells you where the time went?

## 57. What's push vs. pull-based metrics collection, and how do Amazon Managed Prometheus and Managed Grafana fit alongside CloudWatch?

### Why would a team choose Managed Prometheus over plain CloudWatch metrics?

## 58. Why is centralized logging via CloudWatch Logs or OpenSearch important, and why use structured logging?

### Why does unstructured plain-text logging become painful to query at scale?

## 59. What is distributed tracing in AWS X-Ray (trace ID, segments/subsegments)? How does it relate to OpenTelemetry?

### How does a trace ID propagate across a Lambda → SQS → Lambda chain?

## 60. How do you avoid alert fatigue with CloudWatch Alarms? How do severity levels and SNS topics help?

## 61. What are SLI, SLO, SLA, and how does an error budget relate to them?

### If you've burned your error budget for the month, what should change about how the team ships features?

## 62. Why is AWS CloudTrail important for audit logging, and what events should be tracked?

### What specific event (e.g., root login, IAM policy change) would you want an immediate alert on?

## 63. What's the difference between CloudWatch Synthetics (synthetic monitoring) and CloudWatch RUM (real-user monitoring)?

### Why might Synthetics show green while real users are actually seeing errors?
