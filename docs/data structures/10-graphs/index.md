---
sidebar_position: 10
title: 'Graphs'
---


## 🗺️ 60. What is a graph, and how is it represented in code?
- What is the difference between an adjacency matrix and an adjacency list?
- What are the trade-offs of each representation in terms of space and time for different operations?

## ➡️ 61. What is the difference between a directed graph and an undirected graph?
- What is a weighted graph, and how does it change traversal algorithms?
- What is a multigraph, and where might it appear in real systems?

## 🚶🔍 62. What are BFS and DFS, and when would you use each?
- What is the time and space complexity of BFS and DFS?
- How is BFS used to find the shortest path in an unweighted graph?
- How is DFS used to detect connected components?

## 🔄 63. How do you detect a cycle in a graph?
- How does cycle detection differ between directed and undirected graphs?
- How does the "white-gray-black" coloring technique work for cycle detection in directed graphs?

## 📋 64. What is topological sorting, and where is it used?
- What is the precondition for a graph to have a valid topological order?
- How would you implement topological sort using DFS vs. using Kahn's algorithm (BFS-based)?

## 🛣️ 65. What are the common shortest-path algorithms, and how do they differ?
- How does Dijkstra's algorithm work, and why doesn't it work correctly with negative edge weights?
- How does the Bellman-Ford algorithm handle negative weights, and how does it detect negative cycles?
- How does the Floyd-Warshall algorithm compute all-pairs shortest paths, and what is its time complexity?

## 🌲 66. What is a minimum spanning tree (MST), and how do Prim's and Kruskal's algorithms differ?
- What data structure does Kruskal's algorithm rely on, and why?
- In what scenarios would you prefer Prim's algorithm over Kruskal's (or vice versa)?

## 🔗 67. What are strongly connected components (SCCs), and how are they found?
- What is the difference between a strongly connected component and a weakly connected component?
- How do Tarjan's and Kosaraju's algorithms find SCCs?

## 🌐 68. What is bipartite graph checking, and how is it done?
- How would you use BFS or DFS with two-coloring to check if a graph is bipartite?
- What real-world problems can be modeled as bipartite matching?
