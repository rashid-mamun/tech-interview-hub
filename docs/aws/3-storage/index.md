---
sidebar_position: 1
title: Storage
---

## 11. What is the difference between S3 (object), EBS (block), and EFS (file) storage?

### When would you use each — S3 for images/backups, EBS for an EC2 volume, EFS for a shared filesystem?

### Can EBS be attached to multiple instances at once? What about EFS, and why the difference?

## 12. What are S3 Storage Classes (Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier, Glacier Deep Archive)?

### How do S3 Lifecycle policies automatically transition objects to cheaper tiers?

### What's the retrieval-time trade-off between Standard-IA and Glacier Deep Archive?

### If access patterns are unpredictable, which class do you pick and why?

## 13. What is S3 replication (Same-Region vs. Cross-Region), and how does it compare to RDS's sync/async replicas?

### Why choose asynchronous replication over synchronous, given the trade-off?

### Does deleting a source object propagate through Cross-Region Replication?

## 14. What is an S3 pre-signed URL, and why is it used instead of making a bucket public?

### How long can a pre-signed URL stay valid, and what happens if the underlying credentials are revoked before it expires?

## 15. What is S3's durability (11 nines) vs. availability, and how are they different?

### What does "11 nines of durability" actually guarantee — and what doesn't it guarantee?
