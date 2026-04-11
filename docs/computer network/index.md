# How the Internet Works: Backend Developer Interview Questions


---

## 1. Introduction to the Internet

1. **What is the concept of the Internet?**
   - How did the Internet evolve from ARPANET to what it is today?
   - What is the difference between the Internet and an intranet?

2. **What is the World Wide Web (WWW) and its connection to the Internet?**
   - How does the WWW differ from the Internet itself?
   - If the WWW "went down" today, would the Internet still function? Give examples.
   - What role did HTTP and HTML play in creating the Web?

3. **How is data transferred across networks?**
   - What is packet switching and how does it compare to circuit switching?
   - What happens when a packet is lost in transit?

4. **What are IP addresses, domain names, and routing?**
   - What is the difference between public and private IP addresses?
   - How does dynamic routing work in large-scale networks?
   - How does a router decide the "best path" for a packet? 
   - What is the difference between IPv4 and IPv6, and why was IPv6 needed?

5. **What are Internet Service Providers (ISPs), Routers, and DNS?**
   - What is the difference between a Tier-1, Tier-2, and Tier-3 ISP?
   - How do ISPs handle traffic prioritization (net neutrality)?

6. **What are the different types of networks (e.g., LAN, WAN) and their role in the Internet?**
   - What is the difference between a MAN and a WAN?
   - How does a VPN extend a LAN over the Internet?

7. **How does the physical infrastructure of the Internet (e.g., undersea cables, satellites) work?**
   - What is the role of IXPs (Internet Exchange Points) in global connectivity?
   - How do satellite-based Internet services like Starlink compare to fiber connections?

---

## 2. DNS Magic and Internals

8. **What is the Domain Name System (DNS)?**
   - Why was DNS created instead of using IP addresses directly?
   - How does DNS help with load balancing and fault tolerance? 
   - What is the difference between a DNS zone and a DNS record?
   - Why is DNS often called the "Phonebook of the Internet"?
   - What is the difference between forward and reverse DNS lookup?

9. **How does DNS resolve domain names to IP addresses?**
   - What is the difference between an authoritative DNS server and a recursive resolver?
   - What is the role of a DNS resolver in the DNS resolution process?
   - Describe the difference between an Iterative and a Recursive DNS query.    
   - Can you walk through a full DNS resolution step by step?

10. **What are the types of DNS records (A, CNAME, MX, and more)?**
    - What is the difference between an A record and an AAAA record?
    - What is a PTR record and when is it used?
    - What is a TXT record used for in backend configurations?
    - When would you use an ALIAS record instead of a CNAME?

11. **What is the DNS hierarchy (Root DNS servers, TLDs, and authoritative DNS servers)?**
    - How many root DNS servers exist, and how are they managed?
    - What happens if a TLD server becomes unavailable?

12. **How do browsers query DNS servers to load websites?**
    - What is the role of the OS-level DNS cache in this process?
    - How does DNS prefetching work in browsers?

13. **What are recursive queries, caching, and TTL (Time-to-Live)?**
    - What problems can an overly short TTL cause for a backend service?
    - How does negative caching (NXDOMAIN caching) work?
    - How does DNS caching work at the browser, OS, and ISP levels?
    - If I update my IP address, why does it sometimes take 24 hours to reflect globally?

14. **What happens when a DNS query fails, and how is it handled?**
    - How do applications handle DNS failures gracefully?
    - What is DNS failover and how is it configured?

15. **What is DNS security, and how do attacks like DNS spoofing work?**
    - What is DNSSEC and how does it protect DNS records?
    - What is a DNS amplification attack and how is it mitigated?

16. **How do backend developers configure DNS for load balancing or failover?** 
    - What is DNS-based global server load balancing (GSLB)?
    - How does round-robin DNS work and what are its limitations?
    - What is GeoDNS and when would you use it?

---

## 3. Server-Client Architecture

17. **What is the Client-Server model?**
    - How does the peer-to-peer model differ from client-server?
    - What are the trade-offs between thin and thick clients?

18. **What are the differences between Client and Server in web applications?**
    - What is the difference between server-side rendering (SSR) and client-side rendering (CSR)?
    - How does hydration work in modern full-stack frameworks?

19. **What is the HTTP request-response cycle?**
    - What happens at each layer of the OSI model during an HTTP request?
    - How does HTTP keep-alive affect the request-response cycle?
    - What is the difference between a "stateless" and "stateful" protocol in this cycle?

20. **How do browsers act as clients that request resources from web servers?**
    - What is the browser's critical rendering path?
    - How do browsers handle concurrent requests to the same server?

21. **What are web servers and web hosting?**
    - What is the difference between shared hosting, VPS, and dedicated servers?
    - What is serverless hosting and how does it differ from traditional hosting?

22. **What are Web servers (Apache, Nginx), Client-side vs Server-side, Request headers, and Response codes?**
    - What are the most important HTTP request headers a backend developer should know?
    - How do custom response headers improve security (e.g., CSP, HSTS)?

23. **What is a Content Delivery Network (CDN), and how does it improve website performance?**
    - What is the difference between a pull CDN and a push CDN?
    - How does cache invalidation work in a CDN?
    - What is "Edge Computing" and how does it relate to CDNs?

24. **What is the role of load balancers in managing server traffic?**
    - What are the differences between Layer 4 and Layer 7 load balancing?
    - What load balancing algorithms are commonly used (round robin, least connections, IP hash)?

25. **What are reverse proxies, and how do they enhance backend server performance?** 
    - What is the difference between a reverse proxy and a forward proxy?
    - How does Nginx function as both a reverse proxy and a web server?
    - How do reverse proxies help with SSL termination and caching?

26. **How do backend developers choose between Apache and Nginx for specific use cases?** 
    - What is the difference in how Apache and Nginx handle concurrent connections?
    - When would you choose a cloud load balancer (e.g., AWS ALB) over Nginx?

---

## 4. Internet Protocols

27. **What are network protocols, and why are they needed?**
    - What is the role of the IEEE and IETF in defining protocols?
    - How do proprietary protocols differ from open standards?

28. **What is the role of protocols in ensuring data transfer integrity and reliability?**
    - How do checksums and error-detection mechanisms work?
    - What is the difference between error detection and error correction?

29. **What are the key protocols: HTTP, HTTPS, FTP, and SMTP?**
    - Why is FTP considered insecure, and what are its modern alternatives (SFTP, FTPS)?
    - Why is SMTP usually not used for real-time chat? Which protocol is better suited for that?


30. **How do secure protocols like HTTPS ensure encrypted communication?**
    - What is the TLS handshake process in detail?
    - What is certificate pinning and when is it used in backend applications?

31. **What are protocol stacks, handshakes, and encryption?**
    - How does the TCP/IP stack map to the OSI model?
    - What is forward secrecy and why does it matter?

32. **What is the OSI model, and how does it relate to Internet protocols?**
    - Can you explain each of the 7 OSI layers with a real-world example?
    - At which OSI layer do firewalls typically operate?

33. **What is the difference between IPv4 and IPv6, and why is IPv6 important?**
    - What is IPv6 address notation and how does it differ from IPv4?
    - What challenges arise when migrating a backend system from IPv4 to IPv6?

34. **What is WebSocket, and how does it differ from HTTP for real-time communication?** 
    - What is the WebSocket handshake process?
    - How does Socket.IO build on top of WebSocket?
    - When would you choose Server-Sent Events (SSE) over WebSocket?

35. **How does gRPC compare to HTTP for backend API communication?** 
    - What is Protocol Buffers (protobuf) and why does gRPC use it?
    - What are the four types of gRPC communication (unary, server streaming, client streaming, bidirectional)?
    - When would you choose gRPC over REST?

---

## 5. TCP/IP

36. **What is TCP/IP, and why is it fundamental for data transmission?**
    - What does the IP layer actually do, and how does it relate to TCP?
    - What is the difference between the TCP/IP model and the OSI model?

37. **How does TCP ensure reliable data transfer via packet acknowledgment and retransmission?**
    - What is the sliding window protocol in TCP?
    - What is TCP slow start and how does it affect initial connection speed?

38. **What is the role of IP in addressing and routing data packets across networks?**
    - What is the difference between static routing and dynamic routing?
    - What is OSPF and BGP, and where are they used?

39. **What are ports and sockets in TCP/IP communication?**
    - What are well-known ports and ephemeral ports?
    - What is a socket and how is one created programmatically?
    - Why do we need ports in TCP/IP communication?
    - What is the difference between a port and a socket?
    - Can two different processes listen on the same port? Why or why not?
40. **What are the three-way handshake, packet loss, and routing tables?**
    - How does TCP detect and handle packet loss?
    - What is a routing table and how is it built?

41. **How do firewalls use TCP/IP to protect networks?**
    - What is the difference between a stateful and stateless firewall?
    - What is a Web Application Firewall (WAF) and how does it differ from a network firewall?

42. **What is Network Address Translation (NAT), and how does it work in TCP/IP networks?**
    - What is the difference between SNAT and DNAT?
    - How does NAT affect peer-to-peer connections and how is it worked around?
    - How does NAT allow multiple devices in a home to share a single public IP?

43. **How do backend developers handle TCP connection timeouts in API servers?** 
    - What is the difference between a connection timeout and a read timeout?
    - How do you configure idle connection timeouts in Nginx or a Node.js server?

44. **What is the impact of TCP congestion control on backend performance?** 
    - What are the main TCP congestion control algorithms (CUBIC, BBR)?
    - How does TCP BBR improve performance for high-latency connections?

---

## 6. UDP (User Datagram Protocol)

45. **What is UDP, and how does it differ from TCP?**
    - What does the UDP header contain and what does it not include compared to TCP?
    - Can UDP guarantee any kind of ordering?
    - If UDP is "unreliable," why is it used for almost all online gaming?

46. **When and why is UDP used (e.g., in video streaming or gaming)?**
    - How does DNS use UDP and under what circumstances does it fall back to TCP?
    - What is QUIC and how does it use UDP?

47. **How do TCP and UDP compare in terms of reliability vs. speed?**
    - Can you build reliability on top of UDP? How?
    - What is the latency difference between TCP and UDP in practice?

48. **What are datagram-based transmission, low overhead, and connectionless communication?**
    - What is the maximum size of a UDP datagram?
    - What happens when a UDP datagram exceeds the MTU?

49. **What are some common applications that rely on UDP besides streaming and gaming?**
    - How does VoIP use UDP?
    - Why does TFTP use UDP instead of TCP?

50. **How does UDP handle packet loss in real-world scenarios?**
    - What are forward error correction (FEC) techniques used over UDP?
    - How does a video conferencing app handle lost UDP packets?

51. **How do backend developers implement UDP for custom real-time applications?** 
    - What are the challenges of implementing a reliable protocol on top of UDP?
    - How does WebRTC use UDP for peer-to-peer communication?

---

## 7. TCP Handshakes and 3-Way Handshakes

52. **What is a 3-way handshake in TCP?**
    - Why does TCP need exactly 3 steps (not 2 or 4) to establish a connection?
    - What is a SYN flood attack and how is it mitigated?

53. **What are the three phases of the 3-way handshake (SYN, SYN-ACK, ACK)?**
    - What information is exchanged during the SYN and SYN-ACK steps?
    - What is the role of ISN (Initial Sequence Number) in the handshake?

54. **What is the purpose of the 3-way handshake?**
    - How does the handshake ensure both parties are ready to send and receive?
    - What is the 4-way handshake used for TCP connection termination?

55. **How is data transmitted after the handshake is complete?**
    - What is the TCP receive window and how does it affect throughput?
    - What is Nagle's algorithm and when should it be disabled?

56. **What are reliable connection establishment, sequence numbers, and acknowledgments?**
    - How does sequence number wrapping work in long-lived connections?
    - What is a duplicate ACK and what does it signal?

57. **What happens if the TCP 3-way handshake fails?**
    - What is the TCP SYN-ACK retransmission behavior?
    - How does a server handle a backlog of incomplete handshakes?
    - What is a "SYN Flood" attack, and how do servers protect against it?

58. **How does the TCP handshake impact network performance?**
    - What is TCP Fast Open and how does it reduce handshake latency?
    - How does TLS 1.3 reduce the number of round trips needed to establish a secure connection?
    - How does "Keep-Alive" help in reducing handshake overhead?

59. **How do backend developers debug TCP handshake issues in production?** 
    - What tools (tcpdump, Wireshark, ss, netstat) are used to diagnose TCP issues?
    - What does a RST packet indicate and how do you investigate it?

---

## 8. HTTP & HTTPS Protocols

60. **What are HTTP and HTTPS protocols?**
    - What is the difference between HTTP/1.0, HTTP/1.1, HTTP/2, and HTTP/3?
    - What protocol does HTTP/3 use instead of TCP, and why?

61. **What happens during an HTTP request-response cycle?**
    - What is the role of the Host header in HTTP/1.1?
    - How does persistent connection (keep-alive) work in HTTP/1.1?

62. **What are HTTP status codes (200 OK, 404 Not Found, 500 Internal Server Error)?**
    - What is the difference between 401 Unauthorized and 403 Forbidden?
    - What is the difference between 301 and 302 redirects?
    - When would you use 429 Too Many Requests?
    - What is the difference between a 502 Bad Gateway and a 504 Gateway Timeout?
    - Why do browsers show "Your connection is not private" for 401 errors?

63. **What is SSL/TLS, and how does it secure data during transmission?**
    - What is the difference between SSL and TLS?
    - What is mutual TLS (mTLS) and when is it used?
    - Explain the difference between Symmetric and Asymmetric encryption during a TLS handshake

64. **What are request methods, HTTPS handshake, and Certificate Authorities?**
    - What is the difference between a DV, OV, and EV certificate?
    - What is HSTS and how does it prevent downgrade attacks?

65. **What are cookies, and how are they used in HTTP/HTTPS communication?**
    - What is the difference between HttpOnly, Secure, and SameSite cookie attributes?
    - What is a session cookie vs a persistent cookie?

66. **What is the role of HTTP/2 and HTTP/3 in improving web performance?**
    - What is HTTP/2 multiplexing and how does it solve head-of-line blocking?
    - What is QUIC and how does HTTP/3 use it?

67. **How do backend developers implement RESTful APIs using HTTP methods?** 
    - What is the difference between PUT and PATCH?
    - What makes an API truly RESTful (Richardson Maturity Model)?
    - What is idempotency and which HTTP methods are idempotent?

68. **What is the role of rate limiting in HTTP-based APIs, and how is it implemented?** 
    - What are common rate limiting algorithms (token bucket, leaky bucket, sliding window)?
    - How do you implement distributed rate limiting across multiple API servers?

69. **How do backend developers handle CORS (Cross-Origin Resource Sharing) in web applications?** 
    - What is a CORS preflight request and when is it triggered?
    - What is the difference between simple CORS requests and preflighted requests?
    - How do you securely configure CORS headers in production?

---

## 9. Internet Security and Performance

70. **What are common Internet security threats (e.g., phishing, DDoS attacks), and how are they mitigated?**
    - What is the difference between a volumetric DDoS and an application-layer DDoS?
    - What is a man-in-the-middle (MitM) attack and how is it prevented?

71. **How do Virtual Private Networks (VPNs) protect Internet users?**
    - What is the difference between a site-to-site VPN and a remote-access VPN?
    - What protocols do VPNs use (OpenVPN, WireGuard, IPSec)?

72. **What is bandwidth, and how does it affect Internet performance?**
    - What is the difference between bandwidth and latency?
    - What is jitter and how does it affect real-time applications?

73. **What is Internet speed tests, and what factors influence the results?**
    - Why might a speed test show good results but an application still feel slow?
    - What is bufferbloat and how does it affect perceived performance?

74. **How do backend developers secure APIs against common attacks like SQL injection or XSS?** 
    - What is parameterized querying and how does it prevent SQL injection?
    - What is the difference between stored XSS and reflected XSS?
    - How do Content Security Policy (CSP) headers help mitigate XSS?

75. **What is the role of API gateways in managing and securing backend services?** 
    - What features does an API gateway typically provide?
    - What is the difference between an API gateway and a reverse proxy?
    - How do Kong, AWS API Gateway, and Nginx compare as API gateways?

---

## 10. Practical Applications and Troubleshooting

76. **How do users troubleshoot common Internet connectivity issues (e.g., slow speeds, dropped connections)?**
    - What does the traceroute/tracert command tell you about a network path?
    - What is the difference between ping and traceroute?

77. **What is the role of an Internet browser cache, and how does it impact browsing?**
    - What is the difference between the browser cache and the HTTP cache?
    - What are cache-control headers and how are they configured?

78. **What is the Internet support for real-time applications like video conferencing or online gaming?**
    - What is WebRTC and how does it enable browser-to-browser communication?
    - What is a TURN server and when is it needed?

79. **What are the differences between static and dynamic IP addresses, and when are they used?**
    - What is DHCP and how does it assign IP addresses?
    - When would a backend server need a static IP?

80. **How do backend developers monitor and troubleshoot network latency in production systems?** 
    - What tools are used for network observability (Datadog, Prometheus, Grafana)?
    - What is distributed tracing and how does it help diagnose latency?

81. **What is the role of caching strategies (e.g., Redis, Memcached) in backend performance?** 
    - What is the difference between Redis and Memcached?
    - What are common cache eviction strategies (LRU, LFU, TTL)?
    - What is cache stampede and how do you prevent it?

---

## 11. Authentication and Authorization

82. **What are OAuth and JWT, and how are they used for authentication in backend systems?** 
    - What is the difference between OAuth 2.0 and OpenID Connect?
    - What are the components of a JWT (header, payload, signature)?
    - What are the security risks of storing JWTs in localStorage vs httpOnly cookies?

83. **How do backend developers implement session management for secure user authentication?** 
    - What is the difference between stateful sessions and stateless JWT-based auth?
    - How do you handle session invalidation (logout) when using JWTs?

84. **What is the difference between authentication and authorization in web applications?** 
    - What is RBAC (Role-Based Access Control) and how is it implemented?
    - What is ABAC (Attribute-Based Access Control) and when is it preferred over RBAC?

---

## 12. Cloud and Microservices Networking

85. **How do cloud providers (e.g., AWS, Azure) manage networking for backend applications?** 
    - What is the difference between a security group and a network ACL in AWS?
    - What is AWS Route 53 and how does it handle DNS?

86. **What is service discovery, and how is it used in microservices architectures?** 
    - What is the difference between client-side and server-side service discovery?
    - How do tools like Consul and Kubernetes DNS handle service discovery?

87. **How do backend developers configure VPCs (Virtual Private Clouds) for secure networking?** 
    - What is the difference between a public subnet and a private subnet in a VPC?
    - What is VPC peering and what are its limitations?
    - What is a NAT gateway and when is it used in a VPC?

---

## 13. Scalability and Distributed Systems

88. **How do backend developers design scalable APIs to handle high traffic?** 
    - What is the difference between horizontal and vertical scaling?
    - What is the role of an API gateway in scaling microservices?

89. **What is the role of message queues (e.g., RabbitMQ, Kafka) in distributed backend systems?** 
    - What is the difference between a message queue and a message broker?
    - When would you choose Kafka over RabbitMQ?
    - What is a consumer group and partition in Kafka?

90. **How do backend developers ensure data consistency in distributed systems?** 
    - What is the CAP theorem and how does it apply to database choices?
    - What is eventual consistency and when is it acceptable?
    - What are distributed transactions and what is the two-phase commit (2PC) protocol?

---