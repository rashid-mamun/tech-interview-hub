# 🌍 How the Internet Works: Backend Developer Interview Questions

---

## 📦 1. Docker Fundamentals

**🧱 1. What is Docker, and why is it used in modern software development?**
- What problems does Docker solve that virtual machines do not?
- What is the difference between containerization and virtualization?
- How does Docker use Linux kernel features (namespaces, cgroups) under the hood?
- What is the Open Container Initiative (OCI) and how does Docker relate to it?

**🆚 2. What is the difference between a Docker Image and a Docker Container?**
- How is a Docker image structured in layers?
- What is the Union File System (UnionFS) and how does it enable image layering?
- What happens to data written inside a running container when it stops?
- Can you run multiple containers from the same image simultaneously?

**📄 3. What is a Dockerfile, and how does it define an image?**
- What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?
- What is the difference between `RUN`, `CMD`, and `ENTRYPOINT`?
- What is the difference between `COPY` and `ADD` instructions?
- What is a multi-stage build and when would you use it?
- How does the order of instructions in a Dockerfile affect build cache?

**🏗️ 4. What is the Docker build context, and why does it matter?**
- What is `.dockerignore` and why should you use it?
- How does Docker decide which layers to cache during a build?
- What happens when you use `--no-cache` in a `docker build` command?

**🔄 5. What is the Docker lifecycle (pull, build, run, stop, remove)?**
- What is the difference between `docker stop` and `docker kill`?
- What is the difference between `docker rm` and `docker rmi`?
- What happens when you run `docker run` on an image not present locally?
- What is the difference between `docker run` and `docker start`?

---

## 🗂️ 2. Docker Images and Registry

**📤 6. What is Docker Hub, and how do image registries work?**
- What is the difference between a public and private Docker registry?
- How do you push and pull images from Docker Hub?
- What is the difference between Docker Hub and a self-hosted registry like Harbor?
- How do image tags work, and what is the significance of the `latest` tag?

**🏷️ 7. What is image tagging and versioning in Docker?**
- What is a digest (SHA256) in Docker images and how is it used?
- Why is using the `latest` tag in production considered a bad practice?
- How do you tag an existing image without rebuilding it?

**🧹 8. How do you manage and optimize Docker image sizes?**
- What are some techniques to reduce Docker image size?
- What is the difference between `alpine`, `slim`, and standard base images?
- How does multi-stage build reduce final image size?
- What tools can you use to analyze Docker image layers (e.g., `dive`)?

**🔒 9. What is Docker image security scanning?**
- How do you scan a Docker image for known vulnerabilities?
- What is the difference between image signing and image scanning?
- What is Docker Content Trust (DCT) and how does it work?
- How do you prevent running containers as root inside Docker?

---

## 🌐 3. Docker Networking

**🔗 10. What are Docker network drivers, and what are their types?**
- What is the difference between `bridge`, `host`, `none`, and `overlay` networks?
- When would you use the `host` network mode?
- What is the default network mode for a Docker container?
- How does DNS resolution work between containers on the same bridge network?

**🛡️ 11. How does Docker container networking work internally?**
- What is a `veth` pair and how does Docker use it?
- What is the `docker0` bridge interface?
- How does Docker implement inter-container communication (ICC)?
- How does port mapping (`-p`) work at the kernel level?

**🌍 12. How do containers communicate with each other and with the outside world?**
- What is the difference between exposing a port (`EXPOSE`) and publishing a port (`-p`)?
- How does Docker handle container-to-container communication across hosts?
- What is an overlay network and when is it used in Docker Swarm?
- How do you connect a container to multiple networks?

**🔐 13. How do you secure Docker networking?**
- What is network segmentation in Docker, and why is it important?
- How do you disable inter-container communication on a custom bridge network?
- What are the security implications of using `--network host`?

---

## 💾 4. Docker Volumes and Storage

**📁 14. What are Docker volumes, and why are they needed?**
- What is the difference between a volume, a bind mount, and a tmpfs mount?
- Where does Docker store volume data on the host filesystem?
- What is the difference between named volumes and anonymous volumes?
- How do you share a volume between multiple containers?

**🔄 15. How do you persist data in Docker containers?**
- What happens to data inside a container when it is removed?
- How would you back up and restore a Docker volume?
- What is the difference between using volumes and writing to the container layer?
- How do you manage volume permissions for non-root users inside containers?

**⚙️ 16. How do bind mounts work, and when should you use them?**
- What is the risk of using bind mounts in production?
- How does a bind mount differ from a volume in terms of Docker management?
- How do you mount a configuration file from the host into a container?

---


## 🐇 RABBITMQ

---

## 📬 8. RabbitMQ Fundamentals

**📨 31. What is RabbitMQ, and what problem does it solve?**
- What is a message broker and how does RabbitMQ fit into a microservices architecture?
- What is the difference between RabbitMQ and a REST API for inter-service communication?
- What protocol does RabbitMQ natively use (AMQP)?
- What is the difference between synchronous and asynchronous communication, and when would you choose messaging?

**🔄 32. What is the AMQP protocol and how does RabbitMQ implement it?**
- What is AMQP 0-9-1 and how does it differ from AMQP 1.0?
- What are the core entities in AMQP: producers, consumers, brokers, exchanges, queues, and bindings?
- What is the difference between a channel and a connection in AMQP?
- Why are channels used instead of creating a new connection for every operation?

**🏗️ 33. What are the core components of RabbitMQ architecture?**
- What is a producer, consumer, exchange, queue, and binding?
- What is a virtual host (vhost) in RabbitMQ and why is it used?
- What is the difference between a durable and transient exchange?
- What is a RabbitMQ node and how does it relate to a cluster?

**🔀 34. What are the types of exchanges in RabbitMQ?**
- What is the difference between direct, fanout, topic, and headers exchanges?
- When would you use a topic exchange over a direct exchange?
- What is the default exchange in RabbitMQ?
- What is a dead-letter exchange (DLX) and when is it useful?
- How does a fanout exchange work and what are its use cases?

---

## 📋 9. Queues and Messages

**📥 35. What is a RabbitMQ queue and how does it work?**
- What is the difference between a durable and non-durable (transient) queue?
- What is the difference between an exclusive and non-exclusive queue?
- What is an auto-delete queue and when should it be used?
- How do you declare a queue idempotently in RabbitMQ?

**📩 36. What is message acknowledgment (ack) in RabbitMQ?**
- What is the difference between `basic.ack`, `basic.nack`, and `basic.reject`?
- What happens to a message if a consumer crashes before sending an ack?
- What is the difference between auto-ack and manual ack modes?
- What is the risk of using auto-ack in production consumers?

**⚠️ 37. What is a dead-letter queue (DLQ) and how is it configured?**
- Under what conditions does a message get dead-lettered in RabbitMQ?
- How do you configure a dead-letter exchange on a queue?
- How do you reprocess messages from a DLQ?
- What metadata is preserved when a message is dead-lettered?

**⏳ 38. What is message TTL (Time-to-Live) in RabbitMQ?**
- What is the difference between per-message TTL and per-queue TTL?
- What happens to a message when its TTL expires?
- How do you configure queue-level TTL using `x-message-ttl`?
- How does TTL interact with a dead-letter exchange?

**🔢 39. What is message priority in RabbitMQ?**
- How do you create a priority queue in RabbitMQ?
- What is the maximum number of priority levels supported?
- What is the performance impact of using priority queues?

---

## 🔗 10. Routing and Bindings

**🗺️ 40. How does message routing work in RabbitMQ?**
- What is a routing key and how is it used by direct and topic exchanges?
- What is a binding key and how does it differ from a routing key?
- How does a fanout exchange ignore routing keys?
- What are wildcards (`*` and `#`) in topic exchange routing keys?

**🔗 41. How do bindings work in RabbitMQ?**
- Can a single queue be bound to multiple exchanges?
- Can a single exchange have multiple bindings to the same queue?
- What happens when a message is published to an exchange with no matching binding?
- What is the `mandatory` flag in `basic.publish` and how does it work?

**📤 42. What is the `alternate-exchange` in RabbitMQ?**
- How do you configure an alternate exchange on an exchange?
- What is the difference between using `mandatory` flag and an alternate exchange for unroutable messages?
- When would you use an alternate exchange in a production system?

---

## ⚙️ 11. RabbitMQ Reliability and Durability

**💾 43. How does RabbitMQ ensure message durability?**
- What is the difference between a durable queue and a persistent message?
- Do you need both a durable queue AND a persistent message to survive a broker restart?
- What is the performance trade-off of using persistent messages?
- What is the role of disk writes in RabbitMQ's persistence mechanism?

**✅ 44. What is publisher confirms in RabbitMQ?**
- What is the difference between publisher confirms and transactions in AMQP?
- How do publisher confirms work in asynchronous mode?
- What is a negative publisher confirm (nack) and what should a producer do?
- How do publisher confirms interact with message persistence?

**🔄 45. What is a RabbitMQ transaction and when should it be used?**
- What is the performance cost of AMQP transactions compared to publisher confirms?
- Why are AMQP transactions generally avoided in high-throughput systems?

**🔁 46. How do you implement retry logic with RabbitMQ?**
- What is the pattern for implementing delayed retries using DLQ and TTL?
- How do you implement exponential backoff with RabbitMQ?
- What is the `x-death` header and what information does it contain?
- When should you give up retrying and move a message to a permanent dead-letter storage?

---

## 📈 12. RabbitMQ Performance and Scaling

**⚡ 47. How do you scale RabbitMQ consumers?**
- What is the `prefetch count` (`basic.qos`) setting and why is it critical?
- What is the difference between `prefetch count` per channel and per consumer?
- How does the number of consumers affect queue throughput?
- What is the competing consumers pattern and how does it work in RabbitMQ?

**🏭 48. What are RabbitMQ clusters and how do they work?**
- What is the difference between a RabbitMQ cluster and a standalone node?
- How does RabbitMQ distribute queues across cluster nodes?
- What is queue mirroring (classic mirrored queues) in RabbitMQ?
- What is the difference between classic mirrored queues and Quorum queues?

**🔮 49. What are Quorum Queues in RabbitMQ?**
- How do Quorum Queues differ from classic queues in terms of replication?
- What consensus algorithm do Quorum Queues use (Raft)?
- When should you migrate from classic mirrored queues to Quorum Queues?
- What features are not supported by Quorum Queues (e.g., priority, TTL)?

**🌊 50. What is the impact of queue length on RabbitMQ performance?**
- What is queue flow control and when does RabbitMQ trigger it?
- What is the memory high watermark in RabbitMQ and what happens when it is reached?
- How do you set `x-max-length` and `x-overflow` on a queue?
- What are lazy queues and how do they help with memory management?

---

## 🛡️ 13. RabbitMQ Security

**🔐 51. How do you secure RabbitMQ in production?**
- How do you enable TLS for AMQP connections in RabbitMQ?
- What is the default guest user limitation in RabbitMQ and why does it exist?
- How do you manage users, passwords, and permissions in RabbitMQ?
- What are the three types of permissions in RabbitMQ (configure, write, read)?

**🏠 52. What is a virtual host (vhost) and how does it help with security and isolation?**
- How do you create and assign users to a specific vhost?
- Can two vhosts share the same exchange or queue names?
- What is the `/` (default) vhost and why should production applications avoid it?

**🛡️ 53. How do you implement authentication and authorization in RabbitMQ?**
- What is the RabbitMQ management plugin and how do you secure it?
- What are RabbitMQ user tags (administrator, monitoring, management, policymaker)?
- How do you integrate RabbitMQ with LDAP for centralized authentication?

---

## 🔍 14. RabbitMQ Monitoring and Management

**📊 54. How do you monitor RabbitMQ in production?**
- What is the RabbitMQ management plugin and what metrics does it expose?
- How do you integrate RabbitMQ with Prometheus and Grafana?
- What are the key metrics to monitor in RabbitMQ (queue depth, consumer count, memory, disk)?
- What is the RabbitMQ `rabbitmqctl` CLI and what can you do with it?

**📉 55. What are common RabbitMQ performance problems and how do you diagnose them?**
- What causes a queue to grow unboundedly and how do you fix it?
- What does it mean when RabbitMQ is in a "flow" state?
- How do you identify slow consumers in RabbitMQ?
- What does an unacknowledged message count spike indicate?

**⚙️ 56. What is the RabbitMQ management HTTP API?**
- How do you list queues, exchanges, and bindings using the API?
- How do you purge a queue via the management API?
- How do you move messages from one queue to another using the Shovel plugin?

---

## 🔌 15. RabbitMQ Plugins and Advanced Features

**🔌 57. What are RabbitMQ plugins and how do you enable them?**
- What is the Shovel plugin and what is it used for?
- What is the Federation plugin and how does it differ from Shovel?
- What is the Delayed Message Exchange plugin and how does it work?
- What is the Consistent Hash Exchange plugin used for?

**🔁 58. What is the RabbitMQ Shovel plugin and how is it used?**
- When would you use Shovel over Federation?
- How do you configure a dynamic Shovel using the management API?
- Can Shovel move messages between different RabbitMQ clusters?

**🌐 59. What is RabbitMQ Federation?**
- What is the difference between exchange federation and queue federation?
- What is an upstream in RabbitMQ Federation?
- How does Federation help with geographic distribution of RabbitMQ?

**⏱️ 60. How do you implement delayed/scheduled messages in RabbitMQ?**
- How do you use TTL + DLX to simulate delayed message delivery?
- What is the `rabbitmq-delayed-message-exchange` plugin?
- What are the limitations of delay-via-DLX compared to the dedicated plugin?

---

## 🏗️ 16. RabbitMQ Design Patterns

**🎯 61. What messaging patterns are commonly implemented with RabbitMQ?**
- What is the Publish/Subscribe (Pub/Sub) pattern and how is it implemented?
- What is the Work Queue (Task Queue) pattern and when is it used?
- What is the RPC (Remote Procedure Call) pattern over RabbitMQ?
- What is the Routing pattern and how does it differ from Pub/Sub?

**🔄 62. How do you implement the RPC pattern using RabbitMQ?**
- What is the `reply_to` property and `correlation_id` in RabbitMQ RPC?
- What are the risks of implementing RPC over a message broker?
- When is it better to use a direct REST call instead of RPC over RabbitMQ?

**⚖️ 63. How does RabbitMQ compare to other messaging systems?**
- What is the difference between RabbitMQ and Apache Kafka?
- When would you choose RabbitMQ over Kafka?
- What is the difference between RabbitMQ and Redis Pub/Sub?
- What is the difference between RabbitMQ and AWS SQS/SNS?

**🛠️ 64. How do backend developers integrate RabbitMQ into microservices?**
- How do you handle idempotency for RabbitMQ consumers?
- What is the outbox pattern and how does it integrate with RabbitMQ?
- How do you handle message ordering in RabbitMQ?
- What is the Saga pattern and how can RabbitMQ be used to coordinate it?

---

## 🧪 17. RabbitMQ in Production

**🚀 65. How do you deploy RabbitMQ in a production environment?**
- How do you deploy RabbitMQ using Docker and Docker Compose?
- What are the important RabbitMQ configuration parameters in `rabbitmq.conf`?
- How do you configure `vm_memory_high_watermark` and `disk_free_limit`?
- What is the recommended infrastructure for a production RabbitMQ cluster?

**🔁 66. How do you handle RabbitMQ upgrades and rolling restarts in a cluster?**
- What is the difference between an in-place upgrade and a blue-green upgrade?
- What precautions do you take before stopping a RabbitMQ node in a cluster?
- How do you handle the case where a Quorum Queue loses its quorum?

**🐛 67. How do you debug RabbitMQ issues in production?**
- How do you trace messages through RabbitMQ using the Firehose Trace feature?
- How do you enable and use the `rabbitmq_tracing` plugin?
- What does it mean when a consumer receives messages but doesn't ack them?
- How do you investigate "channel-level" vs "connection-level" errors in RabbitMQ?

**📦 68. How do you handle poison messages in RabbitMQ?**
- What is a poison message and how does it differ from a normal failed message?
- How do you detect and quarantine poison messages?
- How do you prevent a poison message from causing consumer restart loops?

---