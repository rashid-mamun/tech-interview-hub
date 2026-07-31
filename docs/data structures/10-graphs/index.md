---
sidebar_position: 10
title: 'Graphs'
---


## 🗺️ 60. What is a graph, and how is it represented in code?

**Graph** হলো nodes/vertices এবং তাদের connection/edges দিয়ে তৈরি একটা data structure। Graph ব্যবহার করা হয় relation model করার জন্য।

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

**Adjacency Matrix** হলো `V x V` size এর 2D array, যেখানে `matrix[u][v] = 1` মানে `u` থেকে `v` edge আছে।

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

**Directed graph** এ edge এর direction থাকে। `u -> v` থাকলে `u` থেকে `v` যাওয়া যায়, কিন্তু `v` থেকে `u` যাওয়া যাবে এমন guarantee নেই।

```text
Directed:
0 ----> 1

Meaning:
0 -> 1 only
```

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

### What is a multigraph, and where might it appear in real systems?

**Multigraph** এ একই দুই vertex এর মধ্যে multiple edges থাকতে পারে।

```text
A == train == B
A == road  == B
A == flight == B
```

এখানে `A` এবং `B` এর মধ্যে multiple connection আছে, কিন্তু প্রতিটির type/cost আলাদা।

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

**BFS (Breadth-First Search)** graph level by level explore করে। Queue ব্যবহার করা হয়।

**DFS (Depth-First Search)** এক path ধরে যতদূর সম্ভব যায়, তারপর backtrack করে। Recursion বা stack ব্যবহার করা হয়।

```text
Graph:
    0
   / \
  1   2
 / \
3   4

BFS from 0: 0 1 2 3 4
DFS from 0: 0 1 3 4 2  (neighbor order অনুযায়ী vary করতে পারে)
```

Use BFS when:
- shortest path in unweighted graph দরকার
- level/order/distance দরকার
- minimum number of steps দরকার

Use DFS when:
- connected components বের করতে হবে
- cycle detect করতে হবে
- topological sort করতে হবে
- backtracking/graph traversal দরকার

### What is the time and space complexity of BFS and DFS?

Adjacency list ব্যবহার করলে:

```text
Time Complexity = O(V + E)
Space Complexity = O(V)
```

কারণ প্রতিটি vertex একবার visit হয়, এবং প্রতিটি edge একবার বা দুইবার process হয়।

BFS:

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> bfs(int start, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> order;
    vector<bool> visited(n, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }

    return order;
}
```

DFS:

```cpp
void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}
```

### How is BFS used to find the shortest path in an unweighted graph?

Unweighted graph এ প্রতিটি edge এর cost `1` ধরা হয়। BFS level by level চলে, তাই কোনো node প্রথমবার যখন visit হয়, তখন shortest distance পাওয়া যায়।

```text
0 -- 1 -- 3
|         |
2 --------

Shortest path from 0 to 3:
0 -> 2 -> 3, distance = 2
```

```cpp
vector<int> shortestPathUnweighted(int source, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> dist(n, -1);
    queue<int> q;

    dist[source] = 0;
    q.push(source);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }

    return dist;
}
```

Path reconstruct করতে parent array রাখা যায়।

```cpp
vector<int> shortestPath(int source, int target, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> parent(n, -1);
    vector<bool> visited(n, false);
    queue<int> q;

    visited[source] = true;
    q.push(source);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        if (u == target) break;

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                parent[v] = u;
                q.push(v);
            }
        }
    }

    if (!visited[target]) return {};

    vector<int> path;
    for (int node = target; node != -1; node = parent[node]) {
        path.push_back(node);
    }
    reverse(path.begin(), path.end());
    return path;
}
```

### How is DFS used to detect connected components?

Undirected graph এ connected component মানে এমন node group যেখানে group এর যেকোনো node থেকে অন্য node এ যাওয়া যায়।

DFS দিয়ে প্রতিবার unvisited node থেকে traversal start করলে একটা component complete হয়।

```text
Component 1: 0 -- 1 -- 2

Component 2: 3 -- 4

Component 3: 5
```

```cpp
void dfsComponent(int u, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& comp) {
    visited[u] = true;
    comp.push_back(u);

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfsComponent(v, adj, visited, comp);
        }
    }
}

vector<vector<int>> connectedComponents(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    vector<vector<int>> components;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            vector<int> comp;
            dfsComponent(i, adj, visited, comp);
            components.push_back(comp);
        }
    }

    return components;
}
```

---

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
