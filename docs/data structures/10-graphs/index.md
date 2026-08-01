---
sidebar_position: 10
title: 'Graphs'
---


## 🗺️ 60. What is a graph, and how is it represented in code?

**Graph** হলো একটি **non-linear data structure**, যা একগুচ্ছ **vertices (নোড)** এবং তাদের মধ্যে সংযোগকারী **edges** নিয়ে গঠিত। Tree-এর মতো এখানে কোনো strict **hierarchy** বা **root** থাকে না — যেকোনো vertex, যেকোনো অন্য vertex-এর সাথে সংযুক্ত থাকতে পারে, এমনকি **cycle** তৈরি হতে পারে।

Real-world examples:
- Social network: user হলো vertex, friendship/follow হলো edge
- Google Maps: city/intersection হলো vertex, road হলো edge
- Computer network: router/server হলো vertex, connection হলো edge
- Course prerequisite: course হলো vertex, prerequisite relation হলো directed edge

Basic terms:
- **Vertex/Node**: graph এর একটা point/entity
- **Edge**: দুইটা vertex এর connection
- **Degree**: কোনো vertex এর সাথে কতগুলো edge connected
- **Path**: এক vertex থেকে আরেক vertex এ যাওয়ার sequence
- **Cycle**: কোনো path আবার starting vertex এ ফিরে আসে
- **Connected graph**: যেকোনো node থেকে অন্য node এ যাওয়া যায়
- **Directed Graph**: Edge-গুলোর একটি নির্দিষ্ট **দিক (direction)** থাকে (যেমন `A → B`)
- **Undirected Graph**: Edge-গুলোর কোনো দিক থাকে না (যেমন `A - B`, দুইদিকেই যাওয়া যায়)
- **Weighted Graph**: প্রতিটি edge-এর সাথে একটি **weight/cost** যুক্ত থাকে
- **Unweighted Graph**: সব edge-এর গুরুত্ব সমান ধরা হয়

**Example graph:**

```text
    0 ----- 1
    |     / |
    |   /   |
    2 ----- 3

Vertices: 0, 1, 2, 3
Edges: (0,1), (0,2), (1,2), (1,3), (2,3)
```

Graph সাধারণত দুইভাবে represent করা হয়:

1. **Adjacency Matrix**
2. **Adjacency List**

### What is the difference between an adjacency matrix and an adjacency list?

একটি **2D matrix** (আকার `V x V`, যেখানে V = vertex সংখ্যা) ব্যবহার করে vertex গুলোর মধ্যে connection represent করা হয়। যদি `i` এবং `j` vertex-এর মধ্যে edge থাকে, তাহলে `matrix[i][j] = 1` (অথবা weight), নাহলে `0`।

```text
Graph:
0 -- 1
|    |
2 -- 3

Adjacency Matrix:
    0 1 2 3
0:  0 1 1 0
1:  1 0 0 1
2:  1 0 0 1
3:  0 1 1 0
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 4;
    vector<vector<int>> matrix(n, vector<int>(n, 0));

    vector<pair<int, int>> edges = {
        {0, 1}, {0, 2}, {1, 3}, {2, 3}
    };

    for (auto [u, v] : edges) {
        matrix[u][v] = 1;
        matrix[v][u] = 1; // undirected graph
    }

    cout << "Is there an edge between 0 and 2? ";
    cout << (matrix[0][2] ? "yes" : "no") << endl;

    return 0;
}
```

**Adjacency List** এ প্রতিটি vertex এর neighbor list store করা হয়।

```text
Adjacency List:
0: 1, 2
1: 0, 3
2: 0, 3
3: 1, 2
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 4;
    vector<vector<int>> adj(n);

    vector<pair<int, int>> edges = {
        {0, 1}, {0, 2}, {1, 3}, {2, 3}
    };

    for (auto [u, v] : edges) {
        adj[u].push_back(v);
        adj[v].push_back(u); // undirected graph
    }

    for (int u = 0; u < n; u++) {
        cout << u << ": ";
        for (int v : adj[u]) {
            cout << v << " ";
        }
        cout << endl;
    }

    return 0;
}
```

### What are the trade-offs of each representation in terms of space and time for different operations?

| Operation/Feature | Adjacency Matrix | Adjacency List |
|---|---|---|
| Space | `O(V^2)` | `O(V + E)` |
| Check edge `u-v` | `O(1)` | `O(degree(u))` |
| Iterate neighbors | `O(V)` | `O(degree(u))` |
| Sparse graph | memory waste বেশি | best choice |
| Dense graph | acceptable | also works |
| Weighted graph | weight store করা easy | pair/struct দিয়ে weight store |

**Rule of thumb:**
- Graph sparse হলে adjacency list use করা ভালো
- Edge existence বারবার check করতে হলে adjacency matrix convenient
- Most interview graph problems এ adjacency list preferred

Weighted adjacency list:

```cpp
int n = 5;
vector<vector<pair<int, int>>> adj(n); // {neighbor, weight}

adj[0].push_back({1, 10});
adj[0].push_back({2, 5});
```

---

## ➡️ 61. What is the difference between a directed graph and an undirected graph?

**Undirected graph** এ edge দুই দিকে কাজ করে। যদি `u` এবং `v` connected হয়, তাহলে `u` থেকে `v` এবং `v` থেকে `u` দুই দিকেই যাওয়া যায়।

```text
Undirected:
0 ----- 1

Meaning:
0 -> 1
1 -> 0
```
##### বাস্তব উদাহরণ:
- **Facebook Friendship**: A, B-এর friend হলে B-ও A-এর friend
- **Road Network** (two-way road-এর ক্ষেত্রে): দুই দিকেই যাতায়াত সম্ভব
- **Computer Network**: দুইটি device-এর মধ্যে direct connection

**Directed graph** এ edge এর direction থাকে। `u -> v` থাকলে `u` থেকে `v` যাওয়া যায়, কিন্তু `v` থেকে `u` যাওয়া যাবে এমন guarantee নেই।

```text
Directed:
0 ----> 1

Meaning:
0 -> 1 only
```
##### বাস্তব উদাহরণ:
- **Twitter/Instagram Follow System**: A, B-কে follow করলেও B, A-কে follow নাও করতে পারে
- **Web Page Links**: Page A-তে Page B-এর link থাকলেই B-তে A-এর link থাকা বাধ্যতামূলক নয়
- **Task Dependency (DAG)**: Task A সম্পন্ন হওয়ার পর Task B শুরু হবে

Code difference:

```cpp
// Undirected edge
adj[u].push_back(v);
adj[v].push_back(u);

// Directed edge
adj[u].push_back(v);
```

| বিষয় | Directed Graph | Undirected Graph |
|---|---|---|
| Edge direction | থাকে | থাকে না |
| Example | prerequisites, web links | friendship, road map |
| Cycle detection | recursion stack/color লাগে | parent tracking লাগে |
| Degree | in-degree, out-degree | single degree |

### What is a weighted graph, and how does it change traversal algorithms?

**Weighted graph** এ প্রতিটি edge এর সাথে একটা cost/weight থাকে।

```text
0 --(5)-- 1
|         |
(2)      (7)
|         |
2 --(3)-- 3
```

Weight distance, cost, time, latency, risk, capacity ইত্যাদি represent করতে পারে।

Unweighted graph এ shortest path বের করতে BFS enough, কারণ সব edge এর cost same ধরা হয়। Weighted graph এ shortest path এর জন্য edge weight consider করতে হয়।

Common algorithms:
- Non-negative weights: **Dijkstra**
- Negative weights allowed: **Bellman-Ford**
- All-pairs shortest path: **Floyd-Warshall**

```cpp
int n = 4;
vector<vector<pair<int, int>>> adj(n);

adj[0].push_back({1, 5}); // 0 -> 1, weight 5
adj[0].push_back({2, 2}); // 0 -> 2, weight 2
```
#### কীভাবে এটি Traversal Algorithm পাল্টায়:

| বিষয় | Unweighted Graph | Weighted Graph |
|---|---|---|
| **Shortest Path Algorithm** | **BFS** যথেষ্ট (কারণ প্রতিটি edge-এর cost সমান, তাই fewest edges = shortest path) | BFS কাজ করে না, বরং **Dijkstra's Algorithm** (non-negative weight) বা **Bellman-Ford** (negative weight থাকলে) লাগে |
| **Data Structure ব্যবহার** | সাধারণ **Queue** (FIFO) | **Priority Queue (Min-Heap)** ব্যবহার করতে হয়, যাতে সবসময় সবচেয়ে কম cost-এর path আগে explore হয় |
| **"নিকটতম" node নির্ধারণ** | edge সংখ্যা (level) দিয়ে নির্ধারিত হয় | সঞ্চিত **total weight/cost** দিয়ে নির্ধারিত হয় |
| **MST (Minimum Spanning Tree)** | প্রযোজ্য নয় (সব edge সমান হলে MST-এর কোনো মানে থাকে না) | **Prim's** বা **Kruskal's Algorithm** ব্যবহার করে ন্যূনতম total weight-এর spanning tree বের করা হয় |

### What is a multigraph, and where might it appear in real systems?
**Multigraph** হলো এমন একটি graph, যেখানে **দুইটি নির্দিষ্ট vertex-এর মধ্যে একাধিক (multiple) edge** থাকতে পারে। সাধারণ (simple) graph-এ দুই vertex-এর মধ্যে সর্বোচ্চ **একটি** edge থাকে, কিন্তু multigraph-এ এই নিয়ম শিথিল।

```
A ═══ B     (A ও B-এর মধ্যে ৩টি আলাদা edge)
  ╲╱
  ╱╲
```

Real-world examples:
- দুই city এর মধ্যে multiple roads/routes
- network এ multiple physical links
- airline graph এ same city pair এর multiple flights
- transaction graph এ একই account pair এর মধ্যে multiple transfers

Adjacency list multigraph naturally support করে, কারণ same neighbor multiple times store করা যায়।

```cpp
vector<vector<pair<int, int>>> adj(2);

adj[0].push_back({1, 10}); // route 1 cost 10
adj[0].push_back({1, 20}); // route 2 cost 20
```

---

## 🚶🔍 62. What are BFS and DFS, and when would you use each?

**BFS** হলো একটি graph traversal algorithm, যা **level-by-level** (breadth-wise) ভাবে graph explore করে। এটি প্রথমে source node-এর সব **immediate neighbor** visit করে, তারপর তাদের neighbor-দের visit করে — এভাবে "ঢেউ" (wave) আকারে বাইরের দিকে ছড়িয়ে পড়ে।
**Data Structure: Queue (FIFO)**


**DFS** হলো একটি graph traversal algorithm, যা একটি path ধরে যতদূর সম্ভব **গভীরে (depth-wise)** চলে যায়, তারপর **backtrack** করে অন্য path explore করে।
**Data Structure: Stack (recursive call stack অথবা explicit stack)**
```cpp

// Recursive DFS
void dfs(int curr, vector<list<int>>& adjList, vector<bool>& visited) {
    visited[curr] = true;
    // curr node process করা
    
    for (int neighbor : adjList[curr]) {
        if (!visited[neighbor]) {
            dfs(neighbor, adjList, visited);
        }
    }
}

```


#### কখন কোনটি ব্যবহার করবেন

| ব্যবহারের ক্ষেত্র | উপযুক্ত Algorithm | কারণ |
|---|---|---|
| **Shortest Path (Unweighted Graph)** | **BFS** | Level-by-level explore করায় প্রথমবার যখন target-এ পৌঁছায়, সেটাই shortest path নিশ্চিত করে |
| **Connected Components খুঁজে বের করা** | **DFS** (বা BFS, দুটোই সমানভাবে কাজ করে) | পুরো component একবারে explore করার জন্য উপযোগী |
| **Cycle Detection** | **DFS** | Recursion stack track করে back edge সহজে ধরা যায় |
| **Topological Sort** | **DFS** | Post-order finish time ব্যবহার করে ordering পাওয়া যায় |
| **Maze/Puzzle Solving** (একটি path খুঁজে বের করা) | **DFS** | কম memory লাগে, deep path দ্রুত explore করে |
| **Level-order প্রয়োজন হলে** (যেমন social network-এ "k-degree connection") | **BFS** | স্বাভাবিকভাবেই level ধরে ধরে কাজ করে |
| **Minimum Spanning Tree, Network Flow-related Problem** | **DFS/BFS উভয়ই ব্যবহৃত হয়** | Algorithm-ভেদে ভিন্ন (Prim's-এ BFS-এর মতো priority queue, Kruskal's-এ Union-Find) |

---

### What is the time and space complexity of BFS and DFS?

| বিষয় | BFS | DFS |
|---|---|---|
| **Time Complexity** | **O(V + E)** | **O(V + E)** |
| **Space Complexity (Adjacency List)** | **O(V)** — queue-তে worst case সব vertex থাকতে পারে | **O(V)** — recursion stack (বা explicit stack) worst case সব vertex ধারণ করতে পারে |
| **Space Complexity (Adjacency Matrix)** | **O(V)** | **O(V)** |


- **V** = vertex সংখ্যা, **E** = edge সংখ্যা
- **Time O(V+E)** কারণ: প্রতিটি vertex ঠিক একবার visit হয় (**O(V)**), এবং প্রতিটি edge-ও একবার (undirected হলে দুইবার, কিন্তু constant factor) explore হয় (**O(E)**)
- **Space** নির্ভর করে graph-এর **shape**-এর উপর:
  - BFS-এ worst case space লাগে যখন graph-এর **width** বেশি (যেমন একটি node-এর অনেক neighbor)
  - DFS-এ worst case space লাগে যখন graph-এর **depth** বেশি (যেমন একটি লম্বা chain)

---

### How is BFS used to find the shortest path in an unweighted graph?

BFS স্বভাবতই **level-by-level** explore করে, তাই যখন কোনো node প্রথমবার **visit/discover** করা হয়, সেই মুহূর্তেই তার **shortest distance** (source থেকে edge সংখ্যায়) নিশ্চিত হয়ে যায় — কারণ BFS কখনো কোনো node-এ **পরে** কম distance দিয়ে পৌঁছাতে পারে না (unweighted graph-এ)।

```cpp
vector<int> bfsShortestPath(int source, vector<list<int>>& adjList, int n) {
    vector<int> dist(n, -1);  // -1 মানে unreachable
    queue<int> q;
    
    dist[source] = 0;
    q.push(source);
    
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        
        for (int neighbor : adjList[curr]) {
            if (dist[neighbor] == -1) {  // এখনো visit হয়নি
                dist[neighbor] = dist[curr] + 1;
                q.push(neighbor);
            }
        }
    }
    
    return dist;  // প্রতিটি node-এর জন্য shortest distance (edge count)
}
```

#### কেন এটি সঠিক Shortest Path দেয়:

```
       A
      / \
     B   C
     |   |
     D---E
```

`A` থেকে BFS চালালে:
- **Level 0**: `A` (distance = 0)
- **Level 1**: `B, C` (distance = 1) — একই সাথে discover হয়
- **Level 2**: `D, E` (distance = 2) — `D`, `B` থেকে আসতে পারে অথবা `E`, `C` থেকে, কিন্তু উভয়ই distance 2-তে discover হবে

যেহেতু BFS একটি **queue (FIFO)** ব্যবহার করে সব node একই level-এ **একসাথে** process করে, তাই কোনো node-এ **আগে যে distance দিয়ে পৌঁছানো হয়, সেটিই সবসময় ন্যূনতম (shortest)** — এরপর যদি সেই node-এ আবার পৌঁছানোর চেষ্টা করা হয় (longer path দিয়ে), তা simply **ignore** করা হয় (`dist[neighbor] == -1` check-এর মাধ্যমে)।

#### Path Reconstruction (actual path বের করতে চাইলে):
```cpp
vector<int> parent(n, -1);

// BFS-এর মধ্যেই parent track করা:
if (dist[neighbor] == -1) {
    dist[neighbor] = dist[curr] + 1;
    parent[neighbor] = curr;
    q.push(neighbor);
}

// Target থেকে backtrack করে path বের করা:
vector<int> getPath(int target, vector<int>& parent) {
    vector<int> path;
    for (int curr = target; curr != -1; curr = parent[curr]) {
        path.push_back(curr);
    }
    reverse(path.begin(), path.end());
    return path;
}
```

> ⚠️ **গুরুত্বপূর্ণ Limitation:** BFS শুধুমাত্র **unweighted graph**-এ shortest path দেয়। **Weighted graph**-এ shortest path বের করতে হলে **Dijkstra's Algorithm** (priority queue সহ BFS-এর একটি variant) প্রয়োজন।

---

### How is DFS used to detect connected components?

**Connected Component** হলো একটি graph-এর এমন একটি **subgraph**, যেখানে যেকোনো দুইটি vertex-এর মধ্যে একটি **path** আছে, কিন্তু সেই subgraph-এর বাইরের কোনো vertex-এর সাথে সংযোগ নেই।

#### মূল Logic:
প্রতিটি **unvisited** vertex থেকে একটি নতুন DFS **শুরু** করা হয়। একটি সম্পূর্ণ DFS call, একটি সম্পূর্ণ **connected component**-কে cover করে (যেহেতু DFS তার reachable সব vertex visit করে ফেলে)। যতবার নতুন DFS শুরু করতে হয়, ততগুলোই connected component।

```cpp
void dfsUtil(int curr, vector<list<int>>& adjList, vector<bool>& visited, vector<int>& component) {
    visited[curr] = true;
    component.push_back(curr);
    
    for (int neighbor : adjList[curr]) {
        if (!visited[neighbor]) {
            dfsUtil(neighbor, adjList, visited, component);
        }
    }
}

vector<vector<int>> findConnectedComponents(vector<list<int>>& adjList, int n) {
    vector<bool> visited(n, false);
    vector<vector<int>> allComponents;
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            vector<int> component;
            dfsUtil(i, adjList, visited, component);
            allComponents.push_back(component);
        }
    }
    
    return allComponents;
}
```

```
Component 1:  0 - 1     Component 2:  3 - 4     Component 3: 5
              |
              2
```

```cpp
// Graph structure:
// 0-1, 1-2, 0-2 (Component 1: {0,1,2})
// 3-4              (Component 2: {3,4})
// 5-এর কোনো edge নেই (Component 3: {5})

// findConnectedComponents() output:
// [[0, 1, 2], [3, 4], [5]]
```

#### কীভাবে কাজ করে ধাপে ধাপে:
1. `visited = [false, false, false, false, false, false]` দিয়ে শুরু
2. `i = 0` থেকে unvisited পাওয়ায়, DFS শুরু হয় → `0, 1, 2` সব visit হয়ে যায় (Component 1 তৈরি)
3. `i = 1, 2` — already visited, skip
4. `i = 3` unvisited পাওয়ায়, নতুন DFS শুরু → `3, 4` visit হয় (Component 2 তৈরি)
5. `i = 4` — visited, skip
6. `i = 5` unvisited, নতুন DFS শুরু → শুধু `5` (Component 3, কারণ এর কোনো edge নেই)

#### Complexity:
| Complexity | মান |
|---|---|
| **Time** | **O(V + E)** — প্রতিটি vertex ও edge ঠিক একবার visit হয়, outer loop-সহ |
| **Space** | **O(V)** — visited array এবং recursion stack-এর জন্য |

> 🎯 **সারকথা:** **BFS** ব্যবহার করা হয় যখন **shortest path (unweighted)** বা **level-wise processing** প্রয়োজন, এবং এটি **Queue** ব্যবহার করে; **DFS** ব্যবহার করা হয় যখন **path existence, connectivity, cycle detection** ইত্যাদি "গভীরে গিয়ে সম্পূর্ণ explore করা" ধরনের সমস্যা সমাধান করতে হয়, এবং এটি **Stack (recursion)** ব্যবহার করে। উভয়েরই Time complexity **O(V+E)**, কিন্তু ব্যবহারের ধরন এবং internal data structure ভিন্ন — এই পার্থক্যটাই নির্ধারণ করে কোন সমস্যায় কোনটি বেছে নেওয়া উচিত।

## 🔄 63. How do you detect a cycle in a graph?

Cycle detection graph type অনুযায়ী আলাদা হয়:

- Undirected graph: DFS/BFS করার সময় parent track করতে হয়
- Directed graph: recursion stack বা color method লাগে

**Cycle example:**

```text
0 -- 1
|    |
3 -- 2

Cycle: 0 -> 1 -> 2 -> 3 -> 0
```

### How does cycle detection differ between directed and undirected graphs?

**Undirected graph** এ যদি current node থেকে কোনো visited neighbor পাওয়া যায় এবং সেটা parent না হয়, তাহলে cycle আছে।

```cpp
bool hasCycleUndirectedDFS(int u, int parent, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;

    for (int v : adj[u]) {
        if (!visited[v]) {
            if (hasCycleUndirectedDFS(v, u, adj, visited)) {
                return true;
            }
        } else if (v != parent) {
            return true;
        }
    }

    return false;
}

bool hasCycleUndirected(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (hasCycleUndirectedDFS(i, -1, adj, visited)) {
                return true;
            }
        }
    }

    return false;
}
```

**Directed graph** এ parent check enough না, কারণ direction matter করে। এখানে যদি DFS এর current recursion path এ থাকা কোনো node এ আবার edge যায়, তাহলে cycle আছে।

```text
0 -> 1 -> 2
     ^    |
     |____|

Cycle: 1 -> 2 -> 1
```

### How does the "white-gray-black" coloring technique work for cycle detection in directed graphs?

Color meaning:
- **White (0)**: এখনো visit হয়নি
- **Gray (1)**: current DFS recursion stack এ আছে
- **Black (2)**: fully processed

যদি কোনো node থেকে gray neighbor এ edge পাওয়া যায়, তাহলে directed cycle আছে।

```cpp
bool dfsDirectedCycle(int u, vector<vector<int>>& adj, vector<int>& color) {
    color[u] = 1; // gray

    for (int v : adj[u]) {
        if (color[v] == 1) {
            return true; // back edge
        }
        if (color[v] == 0 && dfsDirectedCycle(v, adj, color)) {
            return true;
        }
    }

    color[u] = 2; // black
    return false;
}

bool hasCycleDirected(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n, 0);

    for (int i = 0; i < n; i++) {
        if (color[i] == 0) {
            if (dfsDirectedCycle(i, adj, color)) {
                return true;
            }
        }
    }

    return false;
}
```

**Time Complexity**: `O(V + E)`
**Space Complexity**: `O(V)`

---

## 📋 64. What is topological sorting, and where is it used?

**Topological Sort** হলো directed graph এর vertex গুলোকে এমন order এ সাজানো, যাতে প্রতিটি edge `u -> v` এর জন্য `u` সবসময় `v` এর আগে আসে।

এটা শুধুমাত্র **DAG (Directed Acyclic Graph)** এ possible।

Example:

```text
Course prerequisites:
Math      -> DSA
Programming -> DSA
DSA       -> Algorithms
Algorithms -> System Design

Valid topological order:
Math, Programming, DSA, Algorithms, System Design
```

Use cases:
- Course prerequisite planning
- Build system dependency order
- Package installation order
- Task scheduling with dependencies
- Data pipeline execution order

### What is the precondition for a graph to have a valid topological order?

Graph must be:

1. **Directed**
2. **Acyclic**

Cycle থাকলে topological order possible না।

```text
A -> B -> C
^         |
|_________|

এখানে A আগে B, B আগে C, আবার C আগে A দরকার।
এটা impossible।
```

### How would you implement topological sort using DFS vs. using Kahn's algorithm (BFS-based)?

**DFS-based topological sort:** DFS complete হওয়ার পর node stack/result এ add করি। শেষে reverse করলে topological order পাওয়া যায়।

```cpp
void topoDfs(int u, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& order) {
    visited[u] = true;

    for (int v : adj[u]) {
        if (!visited[v]) {
            topoDfs(v, adj, visited, order);
        }
    }

    order.push_back(u);
}

vector<int> topologicalSortDFS(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    vector<int> order;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            topoDfs(i, adj, visited, order);
        }
    }

    reverse(order.begin(), order.end());
    return order;
}
```

**Kahn's algorithm:** যেসব node এর in-degree `0`, সেগুলো queue তে নিয়ে process করি।

```cpp
vector<int> topologicalSortKahn(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> indegree(n, 0);

    for (int u = 0; u < n; u++) {
        for (int v : adj[u]) {
            indegree[v]++;
        }
    }

    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }

    vector<int> order;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            indegree[v]--;
            if (indegree[v] == 0) {
                q.push(v);
            }
        }
    }

    if ((int)order.size() != n) {
        return {}; // cycle আছে, topological sort possible না
    }

    return order;
}
```

| Method | Idea | Cycle detect |
|---|---|---|
| DFS | finish time reverse | extra color লাগলে detect করা যায় |
| Kahn | in-degree zero process | result size `V` না হলে cycle |

**Time Complexity**: `O(V + E)`

---

## 🛣️ 65. What are the common shortest-path algorithms, and how do they differ?

Shortest path problem graph type অনুযায়ী solve করা হয়।

| Algorithm | Works for | Negative edge | Time Complexity |
|---|---|---|---|
| BFS | unweighted graph | not relevant | `O(V + E)` |
| Dijkstra | non-negative weighted graph | না | `O((V + E) log V)` |
| Bellman-Ford | weighted graph | হ্যাঁ | `O(VE)` |
| Floyd-Warshall | all-pairs shortest path | হ্যাঁ, negative cycle ছাড়া | `O(V^3)` |

**Which one to choose:**
- সব edge weight same হলে BFS
- non-negative weight হলে Dijkstra
- negative edge থাকলে Bellman-Ford
- সব node pair এর shortest distance দরকার হলে Floyd-Warshall

### How does Dijkstra's algorithm work, and why doesn't it work correctly with negative edge weights?

**Dijkstra** greedy algorithm। প্রতিবার currently known smallest distance এর node process করে। Min-heap/priority queue ব্যবহার করা হয়।

```text
0 --(4)-- 1
|         |
(1)      (2)
|         |
2 --(1)-- 1

Shortest 0 -> 1:
0 -> 2 -> 1 cost = 2
```

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> dijkstra(int source, vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    const int INF = 1e9;
    vector<int> dist(n, INF);

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [currentDist, u] = pq.top();
        pq.pop();

        if (currentDist != dist[u]) continue;

        for (auto [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}
```

Dijkstra negative edge এ fail করতে পারে, কারণ একবার কোনো node কে shortest ধরে finalize করলে পরে negative edge দিয়ে তার distance আরও কমে যেতে পারে।

```text
0 -> 1 cost 2
0 -> 2 cost 5
2 -> 1 cost -10

Dijkstra 1 কে early finalize করলে ভুল result হতে পারে।
```

### How does the Bellman-Ford algorithm handle negative weights, and how does it detect negative cycles?

Bellman-Ford প্রতিটি edge বারবার relax করে। `V - 1` বার relax করলে shortest path settle হয়, কারণ shortest simple path এ maximum `V - 1` edge থাকতে পারে।

```cpp
struct Edge {
    int u;
    int v;
    int weight;
};

vector<int> bellmanFord(int n, int source, vector<Edge>& edges) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    dist[source] = 0;

    for (int i = 0; i < n - 1; i++) {
        for (auto edge : edges) {
            if (dist[edge.u] != INF &&
                dist[edge.u] + edge.weight < dist[edge.v]) {
                dist[edge.v] = dist[edge.u] + edge.weight;
            }
        }
    }

    for (auto edge : edges) {
        if (dist[edge.u] != INF &&
            dist[edge.u] + edge.weight < dist[edge.v]) {
            cout << "Negative cycle detected" << endl;
            return {};
        }
    }

    return dist;
}
```

Negative cycle detect করার idea:
- `V - 1` relaxation এর পরও যদি কোনো edge relax করা যায়
- তাহলে graph এ reachable negative cycle আছে

```text
A -> B cost 1
B -> C cost -3
C -> A cost 1

Cycle cost = -1
বারবার ঘুরলে distance কমতেই থাকবে।
```

### How does the Floyd-Warshall algorithm compute all-pairs shortest paths, and what is its time complexity?

**Floyd-Warshall** all-pairs shortest path বের করে। `dist[i][j]` মানে `i` থেকে `j` যাওয়ার current shortest distance।

Core transition:

```text
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

মানে `i` থেকে `j` directly যাওয়ার চেয়ে `k` node হয়ে গেলে কম লাগে কিনা check করা।

```cpp
vector<vector<int>> floydWarshall(vector<vector<int>> dist) {
    int n = dist.size();
    const int INF = 1e9;

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] == INF || dist[k][j] == INF) continue;
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }

    return dist;
}
```

**Time Complexity**: `O(V^3)`
**Space Complexity**: `O(V^2)`

Negative cycle detect:

```text
Floyd-Warshall শেষে যদি dist[i][i] < 0 হয়,
তাহলে negative cycle আছে।
```

---

## 🌲 66. What is a minimum spanning tree (MST), and how do Prim's and Kruskal's algorithms differ?

**Minimum Spanning Tree (MST)** হলো connected undirected weighted graph এর এমন subset of edges, যা:

- সব vertex connect করে
- কোনো cycle থাকে না
- total edge weight minimum হয়
- `V` vertex হলে MST তে exactly `V - 1` edge থাকে

```text
Graph:
0 --(10)-- 1
| \        |
(6) (5)   (15)
|     \    |
2 --(4)-- 3

Possible MST:
2 --(4)-- 3
0 --(5)-- 3
0 --(10)-- 1

Total cost = 19
```

**Prim's algorithm** এক vertex থেকে start করে cheapest edge দিয়ে tree grow করে।
**Kruskal's algorithm** সব edge sort করে smallest edge থেকে নেয়, যদি cycle না বানায়।

| বিষয় | Prim | Kruskal |
|---|---|---|
| Approach | vertex/tree grow করে | edge sort করে নেয় |
| Data structure | min-heap | DSU/Union-Find |
| Good for | dense graph | sparse graph |
| Graph input | adjacency list/matrix | edge list |

Prim using min-heap:

```cpp
#include <bits/stdc++.h>
using namespace std;

int primMST(vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> used(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    pq.push({0, 0}); // {cost, node}
    int totalCost = 0;

    while (!pq.empty()) {
        auto [cost, u] = pq.top();
        pq.pop();

        if (used[u]) continue;

        used[u] = true;
        totalCost += cost;

        for (auto [v, weight] : adj[u]) {
            if (!used[v]) {
                pq.push({weight, v});
            }
        }
    }

    return totalCost;
}
```

Kruskal using DSU:

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u;
    int v;
    int weight;
};

class DSU {
    vector<int> parent, rankValue;

public:
    DSU(int n) {
        parent.resize(n);
        rankValue.assign(n, 0);
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);

        if (a == b) return false;

        if (rankValue[a] < rankValue[b]) {
            swap(a, b);
        }

        parent[b] = a;
        if (rankValue[a] == rankValue[b]) {
            rankValue[a]++;
        }

        return true;
    }
};

int kruskalMST(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
        return a.weight < b.weight;
    });

    DSU dsu(n);
    int totalCost = 0;
    int edgesUsed = 0;

    for (auto edge : edges) {
        if (dsu.unite(edge.u, edge.v)) {
            totalCost += edge.weight;
            edgesUsed++;
        }
    }

    if (edgesUsed != n - 1) {
        return -1; // graph connected না
    }

    return totalCost;
}
```

### What data structure does Kruskal's algorithm rely on, and why?

Kruskal **DSU (Disjoint Set Union)** বা **Union-Find** ব্যবহার করে।

DSU এর কাজ:
- দুই node same component এ আছে কিনা check করা
- দুই component merge করা

কোনো edge `u-v` add করলে যদি `u` এবং `v` already same component এ থাকে, তাহলে edge add করলে cycle হবে। তাই edge skip করতে হয়।

DSU optimization:
- **Path compression**
- **Union by rank/size**

এই optimizations থাকলে operation almost `O(1)` practical time এ হয়।

### In what scenarios would you prefer Prim's algorithm over Kruskal's (or vice versa)?

**Prim prefer করবো যখন:**
- graph dense
- adjacency list/matrix already আছে
- connected graph থেকে এক source ধরে grow করা convenient

**Kruskal prefer করবো যখন:**
- graph sparse
- edge list already আছে
- edges sort করে process করা সহজ
- MST forest দরকার disconnected graph এর জন্য

Complexity:

```text
Prim with heap: O(E log V)
Kruskal: O(E log E), usually O(E log V)
```

---

## 🔗 67. What are strongly connected components (SCCs), and how are they found?

**Strongly Connected Component (SCC)** directed graph এর এমন একটা component, যেখানে component এর যেকোনো node থেকে অন্য যেকোনো node এ যাওয়া যায়।

```text
0 -> 1 -> 2
^         |
|_________|

3 -> 4

SCC 1: {0, 1, 2}
SCC 2: {3}
SCC 3: {4}
```

SCC only directed graph এর জন্য meaningful।

### What is the difference between a strongly connected component and a weakly connected component?

| Concept | Meaning |
|---|---|
| Strongly connected | directed path দুই দিকেই থাকতে হবে |
| Weakly connected | direction ignore করলে connected হলেই হবে |

Example:

```text
0 -> 1 -> 2
```

Direction consider করলে:
- `{0}`, `{1}`, `{2}` আলাদা SCC

Direction ignore করলে:
- `{0, 1, 2}` এক weakly connected component

### How do Tarjan's and Kosaraju's algorithms find SCCs?

**Kosaraju's algorithm** দুইবার DFS করে:

1. Original graph এ DFS করে finish order বের করা
2. সব edge reverse করা
3. Reverse graph এ finish order এর reverse অনুযায়ী DFS করা
4. প্রতিটি DFS call একটা SCC দেয়

```cpp
#include <bits/stdc++.h>
using namespace std;

void dfsOrder(int u, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& order) {
    visited[u] = true;

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfsOrder(v, adj, visited, order);
        }
    }

    order.push_back(u);
}

void dfsCollect(int u, vector<vector<int>>& rev, vector<bool>& visited, vector<int>& comp) {
    visited[u] = true;
    comp.push_back(u);

    for (int v : rev[u]) {
        if (!visited[v]) {
            dfsCollect(v, rev, visited, comp);
        }
    }
}

vector<vector<int>> kosarajuSCC(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    vector<int> order;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfsOrder(i, adj, visited, order);
        }
    }

    vector<vector<int>> rev(n);
    for (int u = 0; u < n; u++) {
        for (int v : adj[u]) {
            rev[v].push_back(u);
        }
    }

    fill(visited.begin(), visited.end(), false);
    reverse(order.begin(), order.end());

    vector<vector<int>> components;
    for (int node : order) {
        if (!visited[node]) {
            vector<int> comp;
            dfsCollect(node, rev, visited, comp);
            components.push_back(comp);
        }
    }

    return components;
}
```

**Tarjan's algorithm** এক DFS traversal এ SCC বের করে। এটা `disc` এবং `low` value maintain করে।

- `disc[u]`: node `u` first visit time
- `low[u]`: `u` থেকে reachable smallest discovery time
- যদি `low[u] == disc[u]`, তাহলে `u` একটা SCC এর root

```cpp
class TarjanSCC {
    vector<vector<int>> adj;
    vector<int> disc, low;
    vector<bool> inStack;
    stack<int> st;
    vector<vector<int>> components;
    int timer = 0;

    void dfs(int u) {
        disc[u] = low[u] = timer++;
        st.push(u);
        inStack[u] = true;

        for (int v : adj[u]) {
            if (disc[v] == -1) {
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (inStack[v]) {
                low[u] = min(low[u], disc[v]);
            }
        }

        if (low[u] == disc[u]) {
            vector<int> comp;

            while (true) {
                int node = st.top();
                st.pop();
                inStack[node] = false;
                comp.push_back(node);

                if (node == u) break;
            }

            components.push_back(comp);
        }
    }

public:
    vector<vector<int>> findSCC(vector<vector<int>>& graph) {
        adj = graph;
        int n = adj.size();

        disc.assign(n, -1);
        low.assign(n, -1);
        inStack.assign(n, false);

        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                dfs(i);
            }
        }

        return components;
    }
};
```

Both algorithms:

```text
Time Complexity = O(V + E)
Space Complexity = O(V + E)
```

---

## 🌐 68. What is bipartite graph checking, and how is it done?

**Bipartite graph** হলো এমন graph যার vertices দুইটা group/set এ ভাগ করা যায়, যাতে কোনো edge same group এর দুই node এর মধ্যে না থাকে।

```text
Bipartite:

Set A: 0, 2
Set B: 1, 3

0 ----- 1
|       |
3 ----- 2

Edges সবসময় opposite set এর node connect করছে।
```

Non-bipartite graph:

```text
0
| \
|  \
1---2

Triangle বা odd cycle থাকলে graph bipartite না।
```

### How would you use BFS or DFS with two-coloring to check if a graph is bipartite?

Idea: প্রতিটি node কে দুই color এর একটায় color করি। Adjacent node অবশ্যই opposite color হবে। যদি কোনো edge এর দুই endpoint same color হয়ে যায়, তাহলে graph bipartite না।

BFS two-coloring:

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isBipartite(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n, -1);

    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;

        queue<int> q;
        q.push(start);
        color[start] = 0;

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (int v : adj[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return false;
                }
            }
        }
    }

    return true;
}
```

DFS version:

```cpp
bool dfsBipartite(int u, int c, vector<vector<int>>& adj, vector<int>& color) {
    color[u] = c;

    for (int v : adj[u]) {
        if (color[v] == -1) {
            if (!dfsBipartite(v, 1 - c, adj, color)) {
                return false;
            }
        } else if (color[v] == color[u]) {
            return false;
        }
    }

    return true;
}
```

**Time Complexity**: `O(V + E)`
**Space Complexity**: `O(V)`

### What real-world problems can be modeled as bipartite matching?

**Bipartite matching** এ দুইটা আলাদা set থাকে, এবং এক set এর item অন্য set এর item এর সাথে match করা হয়।

Examples:
- Students এবং projects
- Workers এবং jobs
- Drivers এবং ride requests
- Users এবং recommended items
- Doctors এবং available appointment slots
- Applicants এবং interview slots

```text
Students          Projects
   S1  --------->   P1
   S1  --------->   P2
   S2  --------->   P2
   S3  --------->   P1
   S3  --------->   P3

Goal: maximum valid assignment
```

Common algorithms:
- DFS based augmenting path for simple maximum bipartite matching
- Hopcroft-Karp for faster matching
- Min-cost max-flow when cost/priority matters

Simple DFS-based bipartite matching:

```cpp
#include <bits/stdc++.h>
using namespace std;

bool tryMatch(int u, vector<vector<int>>& adj, vector<int>& matchRight, vector<bool>& seen) {
    for (int v : adj[u]) {
        if (seen[v]) continue;
        seen[v] = true;

        if (matchRight[v] == -1 || tryMatch(matchRight[v], adj, matchRight, seen)) {
            matchRight[v] = u;
            return true;
        }
    }

    return false;
}

int maximumBipartiteMatching(vector<vector<int>>& adj, int leftSize, int rightSize) {
    vector<int> matchRight(rightSize, -1);
    int matching = 0;

    for (int u = 0; u < leftSize; u++) {
        vector<bool> seen(rightSize, false);
        if (tryMatch(u, adj, matchRight, seen)) {
            matching++;
        }
    }

    return matching;
}
```

এখানে `adj[u]` মানে left side এর node `u` কোন right side nodes এর সাথে match হতে পারে।

---
