---
sidebar_position: 1
title: Serverless & Event-Driven Architecture
---

## 42. What is event-driven architecture using EventBridge/SNS/SQS/Lambda, and how does it decouple producers and consumers?

### If the consumer Lambda is down, does the event get lost, or is it retried/queued?

## 43. What is the difference between SQS (queue) and SNS (pub/sub)?

### What is an SQS Dead-Letter Queue, and what is visibility timeout?

### What happens if a message's visibility timeout expires before the consumer finishes processing it?

## 44. What is Amazon EventBridge (event bus), and how is it different from SNS?

### When would you choose EventBridge's rule-based routing over a simple SNS fan-out?

## 45. What role does API Gateway play in a serverless architecture (IAM/Cognito/Lambda authorizers, throttling, usage plans)?

### What's the difference between a Lambda authorizer and using a Cognito authorizer directly?

## 46. What is AWS Step Functions, and how does it compare orchestration vs. choreography?

### What's the benefit of Step Functions over just chaining Lambdas together via SQS?
