---
sidebar_position: 8
title: 'Trees'
---


## 41. What is a tree data structure, and what is its terminology (root, leaf, height, depth, degree)?

**Tree** হলো একটি non-linear, hierarchical data structure যেখানে data গুলো parent-child সম্পর্কের মাধ্যমে সংযুক্ত থাকে। এটি অনেকটা উল্টানো গাছের মতো দেখতে, যেখানে সবচেয়ে উপরে থাকে **root** এবং নিচের দিকে বিভিন্ন **branch** ছড়িয়ে থাকে।

একটি Tree-এর কিছু বৈশিষ্ট্য হলো:
- এতে কোনো **cycle** থাকে না
- N সংখ্যক node থাকলে তাতে ঠিক **N-1টি edge** থাকবে
- প্রতিটি node-এ একটি মাত্র **parent** থাকে (root ছাড়া)

**Basic terminology:**
- **Root**: Tree এর top-most node, যার কোনো parent নেই
- **Parent**: কোনো node এর ঠিক উপরের node
- **Child**: কোনো node এর নিচের connected node
- **Leaf**: যে node এর কোনো child নেই
- **Edge**: parent এবং child এর connection
- **Degree**: কোনো node এর child সংখ্যা
- **Depth**: root থেকে কোনো node পর্যন্ত edge সংখ্যা
- **Height**: কোনো node থেকে সবচেয়ে দূরের leaf পর্যন্ত edge সংখ্যা
- **Subtree**: কোনো node এবং তার নিচের সব descendant মিলে একটা subtree

**Example diagram:**

```text
              A        <- root
            /   \
           B     C
          / \     \
         D   E     F

Leaf nodes: D, E, F
Degree(A) = 2
Degree(C) = 1
Depth(E) = 2   (A -> B -> E)
Height(B) = 1  (B -> D or B -> E)
Height(A) = 2
```

### What is the difference between height and depth of a node?

**Depth** root থেকে node পর্যন্ত distance measure করে।

**Height** node থেকে নিচের সবচেয়ে দূরের leaf পর্যন্ত distance measure করে।

| বিষয় | Height | Depth |
|---|---|---|
| **সংজ্ঞা** | কোনো node থেকে নিচের দিকের সবচেয়ে দূরের leaf পর্যন্ত edge সংখ্যা | Root থেকে সেই node পর্যন্ত edge সংখ্যা |
| **হিসাবের দিক** | নিচ থেকে উপরের দিকে (bottom-up) | উপর থেকে নিচের দিকে (top-down) |
| **Leaf node-এর জন্য মান** | সবসময় **0** | Root থেকে কতটা দূরে তার উপর নির্ভর করে |
| **Root node-এর জন্য মান** | পুরো tree-এর height-এর সমান | সবসময় **0** |
| **সম্পর্ক** | Tree-এর **height** = root-এর height | Node-এর **level** বলতেও depth বোঝানো হয় |

Interview এ confusion কমানোর জন্য মনে রাখা যায়:
- **Depth starts from root**
- **Height starts from node and goes downward**

### What is the difference between a tree and a graph?

Tree আসলে graph এর special case। Tree এ কিছু extra rule থাকে:

| বিষয় | Tree | Graph |
|---|---|---|
| **Cycle** | কোনো **cycle** থাকতে পারে না (acyclic) | Cycle থাকতে পারে (cyclic হতে পারে) |
| **Root** | একটি নির্দিষ্ট **root node** থাকে | Root বলে কিছু নেই, কোনো নির্দিষ্ট starting point বাধ্যতামূলক নয় |
| **Edge সংখ্যা** | N node-এর জন্য ঠিক **N-1টি edge** থাকে | Edge সংখ্যা নির্দিষ্ট নয়, N node-এর জন্য যেকোনো সংখ্যক edge থাকতে পারে |
| **Parent-Child সম্পর্ক** | স্পষ্ট **hierarchical** (parent-child) সম্পর্ক আছে | এমন কোনো নির্দিষ্ট hierarchy থাকে না |
| **Path** | দুটি node-এর মধ্যে ঠিক **একটি মাত্র path** থাকে | দুটি node-এর মধ্যে একাধিক path থাকতে পারে |
| **Connectivity** | সবসময় **connected** থাকতে হয় | Connected অথবা disconnected দুটোই হতে পারে |
| **Directed/Undirected** | সাধারণত undirected, তবে কিছু ক্ষেত্রে directed (যেমন: Binary Tree) হতে পারে | Directed অথবা undirected দুটোই হতে পারে |
| **উদাহরণ** | Binary Tree, BST, AVL Tree, Heap | Social Network, Road Map, Web Page linking |


**Tree example:**

```text
1
├── 2
└── 3
    └── 4
```

**Graph example:**

```text
1 ----- 2
|     / |
|   /   |
3 ----- 4

এখানে cycle আছে: 1 -> 2 -> 4 -> 3 -> 1
```


## 42. What is the difference between a binary tree, a binary search tree (BST), and a balanced tree?

**Binary Tree** হলো এমন একটি tree data structure যেখানে প্রতিটি node-এর সর্বোচ্চ **দুইটি child** থাকতে পারে — **left child** এবং **right child**। এখানে node গুলোর মধ্যে কোনো নির্দিষ্ট **ordering rule** থাকে না, অর্থাৎ data যেকোনো ক্রমে বসানো যায়।

**BST** হলো একটি বিশেষ ধরনের Binary Tree যেখানে একটি নির্দিষ্ট **ordering property** মেনে চলতে হয়:
- প্রতিটি node-এর **left subtree**-এর সব value সেই node-এর value থেকে **ছোট**
- প্রতিটি node-এর **right subtree**-এর সব value সেই node-এর value থেকে **বড়**
- এই rule প্রতিটি subtree-তে recursively প্রযোজ্য

এই property-এর কারণে BST-তে **search, insert, delete** অপারেশনগুলো efficient হয় (average case-এ **O(log n)**)।

**Balanced Tree** হলো এমন একটি tree (সাধারণত BST) যেখানে প্রতিটি node-এর left ও right subtree-এর **height-এর পার্থক্য** একটি নির্দিষ্ট সীমার মধ্যে রাখা হয় (যেমন AVL Tree-তে এই পার্থক্য সর্বোচ্চ ১)। এর ফলে tree-টি খুব বেশি **skewed** বা একদিকে হেলে পড়ে না।

```text
Binary Tree:
        10
       /  \
      30   5
     /
    2

BST:
        10
       /  \
      5    15
     / \     \
    2   7     20

Balanced BST:
        8
      /   \
     4     12
    / \   /  \
   2   6 10  14
```

| Type | Main rule | Searching |
|---|---|---|
| Binary Tree | প্রতি node এর max 2 child | সাধারণত `O(n)` |
| BST | left ছোট, right বড় | average `O(log n)` |
| Balanced Tree | height controlled | usually `O(log n)` |

### What is a full binary tree vs. a complete binary tree vs. a perfect binary tree?

**Full Binary Tree**: প্রতিটি node-এর হয় **০টি** নাহলে **২টি** child থাকে — কোনো node-এর মাত্র ১টি child থাকতে পারবে না

```text
        1
       / \
      2   3
     / \
    4   5
```

**Complete Binary Tree**: সব **level** সম্পূর্ণ ভরা থাকে, শুধু শেষ level-এর node গুলো **left থেকে right** ক্রমে ভরা থাকে (মাঝে কোনো gap থাকবে না)

```text
        1
       / \
      2   3
     / \  /
    4  5 6
```

**Perfect Binary Tree**: সব **internal node**-এর ঠিক ২টি করে child থাকে এবং সব **leaf node** একই **depth**-এ থাকে

```text
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

### What is a balanced binary tree, and why does balance matter for performance?

**Balanced Binary Tree** হলো এমন একটি tree যেখানে প্রতিটি node-এর জন্য তার **left subtree** এবং **right subtree**-এর height-এর পার্থক্য খুব বেশি হয় না (সাধারণত **1**-এর বেশি না)। সাধারণ definition অনুযায়ী, প্রতিটি node এর জন্য:

```text
abs(height(left) - height(right)) <= 1
```

Balance important কারণ tree এর operation গুলোর cost height এর উপর depend করে।

```text
Balanced BST:                 Skewed BST:
        4                          1
      /   \                         \
     2     6                         2
    / \   / \                         \
   1   3 5   7                         3
                                           \
                                            4
```

Balanced tree এর height `log n`, তাই search/insert/delete `O(log n)`। Skewed tree linked list এর মতো হয়ে গেলে height `n`, তাই operation `O(n)` হয়ে যায়।

> **Terminology note:** প্রতিটি node-এর height difference সর্বোচ্চ 1 হওয়া বিশেষভাবে **height-balanced/AVL-style** condition। Red-Black Tree-এর মতো অন্য balanced BST একই local rule মানে না, কিন্তু overall height `O(log n)` guarantee করে।


## 43. What are the different tree traversal methods?

**Tree traversal** মানে tree এর সব node একটা নির্দিষ্ট order এ visit করা। Common traversal:
- **Pre-order**: Root -> Left -> Right
- **In-order**: Left -> Root -> Right
- **Post-order**: Left -> Right -> Root
- **Level-order/BFS**: Level by level

**Example tree:**

```text
        1
       / \
      2   3
     / \
    4   5
```

| Traversal | Order | Output |
|---|---|---|
| Pre-order | Root, Left, Right | `1 2 4 5 3` |
| In-order | Left, Root, Right | `4 2 5 1 3` |
| Post-order | Left, Right, Root | `4 5 2 3 1` |
| Level-order | Level by level | `1 2 3 4 5` |

### How do in-order, pre-order, and post-order traversals differ, and what is each typically used for?

- **Pre-order**: root আগে visit হয়, তাই tree copy/serialize করতে useful
- **In-order**: BST এর ক্ষেত্রে sorted output দেয়
- **Post-order**: child আগে process হয়, তাই delete tree, expression evaluation, height/diameter type problem এ useful

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

void preorder(Node* root) {
    if (!root) return;
    cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";
}
```

### How would you implement these traversals iteratively using a stack?

Recursion internally call stack ব্যবহার করে। Iterative version এ আমরা explicitly `stack` ব্যবহার করি।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<int> iterativeInorder(Node* root) {
    vector<int> ans;
    stack<Node*> st;
    Node* curr = root;

    while (curr != nullptr || !st.empty()) {
        while (curr != nullptr) {
            st.push(curr);
            curr = curr->left;
        }
        curr = st.top();
        st.pop();
        ans.push_back(curr->val);
        curr = curr->right;
    }
    return ans;
}

vector<int> iterativePreorder(Node* root) {
    vector<int> ans;
    if (!root) return ans;

    stack<Node*> st;
    st.push(root);

    while (!st.empty()) {
        Node* node = st.top();
        st.pop();
        ans.push_back(node->val);

        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
    return ans;
}

vector<int> iterativePostorder(Node* root) {
    vector<int> ans;
    if (!root) return ans;

    stack<Node*> st1, st2;
    st1.push(root);

    while (!st1.empty()) {
        Node* node = st1.top();
        st1.pop();
        st2.push(node);

        if (node->left) st1.push(node->left);
        if (node->right) st1.push(node->right);
    }

    while (!st2.empty()) {
        ans.push_back(st2.top()->val);
        st2.pop();
    }
    return ans;
}
```

**Time Complexity**: `O(n)`
**Space Complexity**: `O(h)` for inorder/preorder average, worst case `O(n)`; postorder two-stack version `O(n)`

### How does level-order (BFS) traversal differ from the other traversal types?

Level-order traversal tree কে **level by level** visit করে। এখানে `queue` ব্যবহার করা হয়।

```cpp
vector<int> levelOrder(Node* root) {
    vector<int> ans;
    if (!root) return ans;

    queue<Node*> q;
    q.push(root);

    while (!q.empty()) {
        Node* node = q.front();
        q.pop();
        ans.push_back(node->val);

        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return ans;
}
```

**Example output:** `1 2 3 4 5`


## 44. How do you find the height (or maximum depth) of a binary tree?

**Height (Maximum Depth)** হলো **root থেকে সবচেয়ে দূরের leaf node পর্যন্ত longest path-এর দৈর্ঘ্য**।

Height দুইভাবে define করা হয়—

- **Edge Count Convention:** path-এ যতগুলো **edge** আছে।
- **Node Count Convention:** path-এ যতগুলো **node** আছে।

> **Programming Interview (LeetCode, NeetCode, GeeksforGeeks)-এ সাধারণত Node Count Convention ব্যবহার করা হয়।**
>

```text
        1
       / \
      2   3
     / \
    4   5
```

**Node Count Convention**: Longest Path:

```
1 → 2 → 4
```

এখানে node আছে **3টি**।

অতএব,

**Height (Maximum Depth) = 3**


**Edge Count Convention**

একই path:

```
1 → 2 → 4
```

এখানে edge আছে **2টি**।

অতএব,

**Height = 2**


**Interview-এ কোনটা ব্যবহার হয়?**

Programming Interview-তে (বিশেষ করে **LeetCode**) height বলতে সাধারণত **Maximum Depth (Node Count)** বোঝানো হয়।

অর্থাৎ উপরের tree-এর height হবে **3**।

Interview problem এ "maximum depth" সাধারণত node count হিসেবে ধরা হয়। তাই empty tree এর depth `0`, single node এর depth `1`।

```cpp
int maxDepth(Node* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
```

### What is the time and space complexity of a recursive solution?

- **Time Complexity**: `O(n)`, কারণ প্রতিটি node একবার visit হয়
- **Space Complexity**: `O(h)`, recursion stack এর জন্য, যেখানে `h` হলো tree height
- Balanced tree হলে `h = log n`, skewed tree হলে `h = n`

### How would you solve this iteratively using BFS?

BFS দিয়ে level count করলেই max depth পাওয়া যায়।

```cpp
int maxDepthBFS(Node* root) {
    if (!root) return 0;

    queue<Node*> q;
    q.push(root);
    int depth = 0;

    while (!q.empty()) {
        int levelSize = q.size();
        depth++;

        for (int i = 0; i < levelSize; i++) {
            Node* node = q.front();
            q.pop();

            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return depth;
}
```

**Time Complexity**: `O(n)`
**Space Complexity**: `O(w)`, যেখানে `w` হলো maximum width of tree


## 45. How do you check whether a binary tree is height-balanced?

একটা binary tree **height-balanced** যদি প্রতিটি node এর left subtree এবং right subtree এর height difference সর্বোচ্চ `1` হয়।

```text
Balanced:
        3
       / \
      9   20
         /  \
        15   7

Not Balanced:
        1
       /
      2
     /
    3
   /
  4
```

### What is the time complexity of a naive vs. optimized approach?

**Naive approach:** প্রতিটি node এর জন্য আলাদা করে left/right height calculate করলে একই subtree বারবার calculate হয়।
- Time Complexity: `O(n^2)` worst case

**Optimized approach:** এক traversal এ height calculate করার সময় imbalance পেলে `-1` return করি।
- Time Complexity: `O(n)`

```cpp
int checkHeight(Node* root) {
    if (!root) return 0;

    int leftHeight = checkHeight(root->left);
    if (leftHeight == -1) return -1;

    int rightHeight = checkHeight(root->right);
    if (rightHeight == -1) return -1;

    if (abs(leftHeight - rightHeight) > 1) return -1;

    return 1 + max(leftHeight, rightHeight);
}

bool isBalanced(Node* root) {
    return checkHeight(root) != -1;
}
```

### How is this related to the definition of an AVL tree?

**AVL Tree** হলো self-balancing BST, যেখানে প্রতিটি node এর balance factor `-1`, `0`, বা `1` থাকে।

```text
balance_factor = height(left subtree) - height(right subtree)
```

AVL tree insert/delete এর পর rotation করে balance ঠিক রাখে, তাই search/insert/delete `O(log n)` থাকে।


## 46. What is the diameter of a binary tree, and how do you compute it?

**Diameter** হলো tree এর যেকোনো দুই node এর মধ্যে longest path। অনেক problem এ diameter count করা হয় **number of edges** হিসেবে।

```text
        1
       / \
      2   3
     / \
    4   5

Longest path: 4 -> 2 -> 1 -> 3
Diameter = 3 edges
```

### Does the diameter always pass through the root? Why or why not?

না, diameter সবসময় root দিয়ে pass করে না। Longest path কোনো subtree এর ভিতরেই থাকতে পারে।

```text
            1
           /
          2
         / \
        3   4
       /     \
      5       6

Longest path: 5 -> 3 -> 2 -> 4 -> 6
এটা root 1 দিয়ে যায় না।
```

### How would you compute it in a single traversal?

প্রতিটি node এ আমরা left height এবং right height বের করি। ঐ node দিয়ে pass করা path length হবে `leftHeight + rightHeight`। সব node এর মধ্যে maximum রাখলেই diameter।

```cpp
int diameter = 0;

int heightForDiameter(Node* root) {
    if (!root) return 0;

    int leftHeight = heightForDiameter(root->left);
    int rightHeight = heightForDiameter(root->right);

    diameter = max(diameter, leftHeight + rightHeight);

    return 1 + max(leftHeight, rightHeight);
}

int diameterOfBinaryTree(Node* root) {
    diameter = 0;
    heightForDiameter(root);
    return diameter;
}
```

**Time Complexity**: `O(n)`
**Space Complexity**: `O(h)`


## 47. How would you serialize and deserialize a binary tree?

**Serialization** হলো একটি Binary Tree-কে এমন একটি **String** বা **List**-এ রূপান্তর করা, যাতে সেটিকে সহজে—

- File-এ Store করা যায়
- Database-এ Save করা যায়
- Network-এর মাধ্যমে Transfer করা যায়
- পরে আবার একই Tree Recover করা যায়

**Deserialization** হলো সেই Serialized String বা List থেকে আবার **ঠিক একই Binary Tree** পুনরায় তৈরি করার প্রক্রিয়া।

### What traversal order is commonly used for serialization, and why?

সবচেয়ে বেশি **Preorder Traversal (Root → Left → Right)** ব্যবহার করা হয়।

কারণ,

- Root প্রথমে পাওয়া যায়।
- এরপর Recursive ভাবে Left ও Right Subtree সহজে Reconstruct করা যায়।
- Implementation সহজ এবং Efficient।

> **তবে Inorder Traversal একা ব্যবহার করে Tree Reconstruct করা যায় না**, কারণ একই Inorder Traversal থেকে একাধিক ভিন্ন Tree তৈরি হতে পারে।


### Null Node কেন Store করতে হয়?

Serialization-এর সময় **Null Child** অবশ্যই Store করতে হবে।

নাহলে Tree-এর Structure হারিয়ে যাবে এবং Original Tree পুনরায় তৈরি করা সম্ভব হবে না।

সাধারণত Null Node বোঝাতে—

```
# or null
```


ধরি Tree টি হলো—

```text
        1
       / \
      2   3
         /
        4
```
**Preorder Traversal**

```
1 2 3 4
```

এটি যথেষ্ট নয়।

কারণ,

```
        1
       /
      2
       \
        3
         \
          4
```

এই Tree থেকেও একই Preorder পাওয়া যেতে পারে।

অতএব Structure হারিয়ে যায়।


**Preorder + Null Marker**

```
1 2 # # 3 4 # # #
```

এখানে

```
#
```

বোঝাচ্ছে Missing Child।

এখন Tree-টি Uniquely Reconstruct করা সম্ভব।

### How do you handle null nodes during serialization?

Null node এর জন্য special marker ব্যবহার করা হয়, যেমন `#`। এতে বোঝা যায় কোন child missing ছিল।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

void serializeHelper(Node* root, string& data) {
    if (!root) {
        data += "# ";
        return;
    }

    data += to_string(root->val) + " ";
    serializeHelper(root->left, data);
    serializeHelper(root->right, data);
}

string serialize(Node* root) {
    string data;
    serializeHelper(root, data);
    return data;
}

Node* deserializeHelper(queue<string>& tokens) {
    if (tokens.empty()) throw invalid_argument("Malformed serialized tree");
    string token = tokens.front();
    tokens.pop();

    if (token == "#") return nullptr;

    Node* root = new Node(stoi(token));
    root->left = deserializeHelper(tokens);
    root->right = deserializeHelper(tokens);
    return root;
}

Node* deserialize(string data) {
    stringstream ss(data);
    string token;
    queue<string> tokens;

    while (ss >> token) {
        tokens.push(token);
    }

    if (tokens.empty()) return nullptr;

    Node* root = deserializeHelper(tokens);
    if (!tokens.empty()) throw invalid_argument("Extra serialization tokens");
    return root;
}
```

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` serialized data এবং recursion/queue এর জন্য


## Complete binary-tree example

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
    explicit Node(int value) : value(value), left(nullptr), right(nullptr) {}
};

void preorder(Node* root) {
    if (root == nullptr) return;
    cout << root->value << ' ';
    preorder(root->left);
    preorder(root->right);
}

void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    cout << root->value << ' ';
    inorder(root->right);
}

void postorder(Node* root) {
    if (root == nullptr) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->value << ' ';
}

int height(Node* root) {
    if (root == nullptr) return 0;
    return 1 + max(height(root->left), height(root->right));
}

void levelOrder(Node* root) {
    if (root == nullptr) return;
    queue<Node*> pending;
    pending.push(root);
    while (!pending.empty()) {
        Node* current = pending.front();
        pending.pop();
        cout << current->value << ' ';
        if (current->left) pending.push(current->left);
        if (current->right) pending.push(current->right);
    }
}

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);

    cout << "Pre-order: "; preorder(root);
    cout << "\nIn-order: "; inorder(root);
    cout << "\nPost-order: "; postorder(root);
    cout << "\nLevel-order: "; levelOrder(root);
    cout << "\nHeight: " << height(root) << '\n';
    return 0;
}
```

**Sample output**

```text
Pre-order: 1 2 4 5 3
In-order: 4 2 5 1 3
Post-order: 4 5 2 3 1
Level-order: 1 2 3 4 5
Height: 3
```

### Traversal diagram

```text
          1
        /   \
       2     3
      / \
     4   5

Pre-order   Root → Left → Right   1 2 4 5 3
In-order    Left → Root → Right   4 2 5 1 3
Post-order  Left → Right → Root   4 5 2 3 1
Level-order level by level        1 2 3 4 5
```
