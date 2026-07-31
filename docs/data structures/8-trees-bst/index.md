---
sidebar_position: 8
title: 'Trees & BST'
---


## 🌲 41. What is a tree data structure, and what is its terminology (root, leaf, height, depth, degree)?

**Tree** হলো একটা hierarchical data structure, যেখানে data গুলো **node** আকারে থাকে এবং node গুলো parent-child relationship দিয়ে connected থাকে। Tree এ সাধারণত একটা **root** থাকে, এবং root থেকে নিচের দিকে child node গুলো ছড়িয়ে যায়।

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

| Concept | Direction | Example |
|---|---|---|
| Depth | Root থেকে node | `Depth(E) = 2` |
| Height | Node থেকে deepest leaf | `Height(B) = 1` |

Interview এ confusion কমানোর জন্য মনে রাখা যায়:
- **Depth starts from root**
- **Height starts from node and goes downward**

### What is the difference between a tree and a graph?

Tree আসলে graph এর special case। Tree এ কিছু extra rule থাকে:

| বিষয় | Tree | Graph |
|---|---|---|
| Cycle | থাকে না | থাকতে পারে |
| Connected | সব node connected থাকে | connected বা disconnected হতে পারে |
| Parent-child relation | স্পষ্ট hierarchy থাকে | সাধারণ relation থাকে |
| Edges | `n` node হলে exactly `n - 1` edge | যেকোনো সংখ্যা হতে পারে |
| Path | দুই node এর মধ্যে unique path | multiple path থাকতে পারে |

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

---

## 🔀 42. What is the difference between a binary tree, a binary search tree (BST), and a balanced tree?

**Binary Tree** হলো এমন tree যেখানে প্রতিটি node এর maximum দুইটা child থাকে: **left child** এবং **right child**।

**Binary Search Tree (BST)** হলো binary tree এর special type, যেখানে প্রতিটি node এর জন্য:
- left subtree এর সব value `< node value`
- right subtree এর সব value `> node value`

**Balanced Tree** হলো এমন tree যেখানে height যতটা সম্ভব কম রাখা হয়, যাতে operation গুলো `O(log n)` এর কাছাকাছি থাকে।

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

**Full Binary Tree**: প্রতিটি node এর হয় `0` child, নয়তো exactly `2` child।

```text
        1
       / \
      2   3
     / \
    4   5
```

**Complete Binary Tree**: শেষ level ছাড়া সব level full, এবং last level left থেকে fill হয়।

```text
        1
       / \
      2   3
     / \  /
    4  5 6
```

**Perfect Binary Tree**: সব internal node এর exactly 2 child এবং সব leaf একই level এ।

```text
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

### What is a balanced binary tree, and why does balance matter for performance?

Balanced binary tree এ left subtree এবং right subtree এর height খুব বেশি difference করে না। সাধারণ definition অনুযায়ী, প্রতিটি node এর জন্য:

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

---

## 🚶 43. What are the different tree traversal methods?

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

---

## 📏 44. How do you find the height (or maximum depth) of a binary tree?

Tree এর height/max depth বের করার idea খুব simple: কোনো node এর height হলো তার left subtree এবং right subtree এর maximum height + 1।

```text
        10
       /  \
      5    20
          /  \
         15   30

Max depth = 3 nodes
Height in edges = 2
```

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

---

## ⚖️ 45. How do you check whether a binary tree is height-balanced?

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

---

## 📐 46. What is the diameter of a binary tree, and how do you compute it?

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

---

## 🔄 47. How would you serialize and deserialize a binary tree?

**Serialization** মানে tree কে string/list আকারে convert করা, যাতে file/network/database এ store বা transfer করা যায়।
**Deserialization** মানে সেই string/list থেকে আবার original tree বানানো।

### What traversal order is commonly used for serialization, and why?

Commonly **pre-order traversal** ব্যবহার করা হয়, কারণ root আগে থাকলে recursive ভাবে tree reconstruct করা সহজ হয়। তবে null node অবশ্যই store করতে হবে, নাহলে structure হারিয়ে যাবে।

```text
Tree:
        1
       / \
      2   3
         /
        4

Preorder with null:
1 2 # # 3 4 # # #
```

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

    return deserializeHelper(tokens);
}
```

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` serialized data এবং recursion/queue এর জন্য

---

## 🌳 48. What is a BST, and what property must every node satisfy?

**Binary Search Tree (BST)** হলো binary tree যেখানে প্রতিটি node এর জন্য:

```text
left subtree এর সব value < node value < right subtree এর সব value
```

**Example BST:**

```text
        8
      /   \
     3     10
    / \      \
   1   6      14
      / \    /
     4   7  13
```

এখানে `8` এর বামে সব value ছোট, ডানে সব value বড়। একই rule প্রতিটি node এর জন্য true।

### Why does an in-order traversal of a BST produce sorted output?

In-order traversal order হলো **Left -> Root -> Right**। BST তে left subtree এর সব value root এর চেয়ে ছোট, এবং right subtree এর সব value root এর চেয়ে বড়। তাই:

```text
left এর sorted values -> root -> right এর sorted values
```

Example BST এর in-order:

```text
1 3 4 6 7 8 10 13 14
```

### What is the difference between a BST and a balanced BST?

BST শুধু ordering property maintain করে। Balanced BST ordering এর সাথে height balance ও maintain করে।

| বিষয় | BST | Balanced BST |
|---|---|---|
| Main property | left ছোট, right বড় | BST property + height controlled |
| Worst-case height | `O(n)` | `O(log n)` |
| Search/Insert/Delete | average `O(log n)`, worst `O(n)` | `O(log n)` |
| Example | normal BST | AVL, Red-Black Tree |

---

## 🔍 49. How do you search, insert, and delete a node in a BST?

BST operation গুলো binary search এর মতো। current node এর value এর সাথে compare করে left বা right দিকে যাই।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

bool searchBST(Node* root, int key) {
    while (root != nullptr) {
        if (root->val == key) return true;
        if (key < root->val) root = root->left;
        else root = root->right;
    }
    return false;
}

Node* insertBST(Node* root, int key) {
    if (!root) return new Node(key);

    if (key < root->val) {
        root->left = insertBST(root->left, key);
    } else if (key > root->val) {
        root->right = insertBST(root->right, key);
    }
    return root;
}

Node* findMin(Node* root) {
    while (root && root->left) {
        root = root->left;
    }
    return root;
}

Node* deleteBST(Node* root, int key) {
    if (!root) return nullptr;

    if (key < root->val) {
        root->left = deleteBST(root->left, key);
    } else if (key > root->val) {
        root->right = deleteBST(root->right, key);
    } else {
        if (!root->left) {
            Node* rightChild = root->right;
            delete root;
            return rightChild;
        }
        if (!root->right) {
            Node* leftChild = root->left;
            delete root;
            return leftChild;
        }

        Node* successor = findMin(root->right);
        root->val = successor->val;
        root->right = deleteBST(root->right, successor->val);
    }
    return root;
}
```

### What happens when you delete a node that has two children?

দুই child থাকা node delete করতে হলে সাধারণত দুইটা option:

1. **In-order successor**: right subtree এর minimum node
2. **In-order predecessor**: left subtree এর maximum node

Example:

```text
Delete 8:

        8
      /   \
     3     10
            \
             14
            /
           13

Successor of 8 = 10

After delete:
        10
      /    \
     3      14
           /
          13
```

Successor/predecessor দিয়ে value replace করে তারপর ঐ successor/predecessor node delete করা হয়।

### What is the time complexity of these operations in a balanced vs. unbalanced BST?

| Operation | Balanced BST | Unbalanced/Skewed BST |
|---|---|---|
| Search | `O(log n)` | `O(n)` |
| Insert | `O(log n)` | `O(n)` |
| Delete | `O(log n)` | `O(n)` |

কারণ operation গুলো tree height `h` এর উপর depend করে: `O(h)`।

---

## ✅ 50. How would you validate whether a given binary tree is a valid BST?

একটা tree valid BST কিনা check করতে শুধু immediate left/right child compare করলেই হবে না। প্রতিটি node কে তার allowed range এর মধ্যে থাকতে হবে।

### What is the common mistake when only comparing a node to its immediate children?

Common ভুল:

```text
        10
       /  \
      5    15
          /  \
         6    20
```

যদি শুধু immediate child check করি:
- `15` এর left child `6`, তাই `6 < 15` ঠিক
- কিন্তু `6` আসলে root `10` এর right subtree তে আছে, তাই `6 > 10` হওয়া উচিত ছিল

এই tree valid BST না।

### How would you solve this using bounds (min/max range) passed down recursively?

প্রতিটি node এর জন্য একটা valid range pass করতে হবে:
- left child এর upper bound হবে current node value
- right child এর lower bound হবে current node value

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

bool validate(Node* root, long long low, long long high) {
    if (!root) return true;

    if (root->val <= low || root->val >= high) {
        return false;
    }

    return validate(root->left, low, root->val) &&
           validate(root->right, root->val, high);
}

bool isValidBST(Node* root) {
    return validate(root, LLONG_MIN, LLONG_MAX);
}
```

**Time Complexity**: `O(n)`
**Space Complexity**: `O(h)`

Alternative approach: in-order traversal করে values strictly increasing কিনা check করা।

---

## 🌀 51. Why can BST operations degrade to O(n) in the worst case, and how is this avoided?

BST operation এর complexity হলো `O(h)`, যেখানে `h` tree height। যদি BST balanced থাকে, `h = log n`; কিন্তু যদি tree skewed হয়ে যায়, `h = n`।

### What input pattern causes a BST to become a "skewed" tree?

Sorted input insert করলে normal BST skewed হয়ে যায়।

```text
Insert order: 1, 2, 3, 4, 5

1
 \
  2
   \
    3
     \
      4
       \
        5
```

এটা linked list এর মতো, তাই search করতে worst case এ সব node traverse করতে হতে পারে।

### How do self-balancing trees prevent this degradation?

Self-balancing BST insert/delete এর পর tree এর height check করে এবং প্রয়োজন হলে **rotation** করে। এতে height `O(log n)` এর মধ্যে থাকে।

```text
Before rotation:
1
 \
  2
   \
    3

After left rotation:
    2
   / \
  1   3
```

Examples:
- **AVL Tree**
- **Red-Black Tree**
- **Treap**
- **Splay Tree**

C++ STL এর `std::map` এবং `std::set` সাধারণত Red-Black Tree based, তাই এগুলো sorted order maintain করে এবং operation `O(log n)`।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    set<int> values;
    values.insert(5);
    values.insert(1);
    values.insert(3);

    for (int x : values) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
```

**Output:**

```text
1 3 5
```

---

## 🔄 52. What are self-balancing BSTs, such as AVL trees and Red-Black trees?

**Self-balancing BST** হলো এমন BST যা insert/delete এর পর নিজে নিজে height adjust করে, যাতে tree খুব বেশি skewed না হয়।

### How does an AVL tree maintain balance using rotations (left, right, left-right, right-left)?

AVL tree প্রতিটি node এর জন্য balance factor maintain করে:

```text
balance_factor = height(left) - height(right)
```

Allowed value: `-1`, `0`, `1`। এর বাইরে গেলে rotation লাগে।

**1. Left Rotation (Right-Right case):**

```text
Before:
10
  \
   20
     \
      30

After:
    20
   /  \
 10    30
```

**2. Right Rotation (Left-Left case):**

```text
Before:
      30
     /
    20
   /
  10

After:
    20
   /  \
 10    30
```

**3. Left-Right Rotation:**

```text
Before:
    30
   /
  10
    \
     20

After:
    20
   /  \
 10    30
```

**4. Right-Left Rotation:**

```text
Before:
  10
    \
     30
    /
   20

After:
    20
   /  \
 10    30
```

Simple rotation code idea:

```cpp
struct AVLNode {
    int val;
    int height;
    AVLNode* left;
    AVLNode* right;
    AVLNode(int x) : val(x), height(1), left(nullptr), right(nullptr) {}
};

int height(AVLNode* node) {
    return node ? node->height : 0;
}

void updateHeight(AVLNode* node) {
    node->height = 1 + max(height(node->left), height(node->right));
}

AVLNode* rotateRight(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* t2 = x->right;

    x->right = y;
    y->left = t2;

    updateHeight(y);
    updateHeight(x);
    return x;
}

AVLNode* rotateLeft(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* t2 = y->left;

    y->left = x;
    x->right = t2;

    updateHeight(x);
    updateHeight(y);
    return y;
}
```

### What is the difference between an AVL tree and a Red-Black tree in terms of balance guarantees and use cases?

| বিষয় | AVL Tree | Red-Black Tree |
|---|---|---|
| Balance | বেশি strict | তুলনামূলক relaxed |
| Search | খুব দ্রুত, কারণ height কম | একটু বেশি height হতে পারে |
| Insert/Delete | বেশি rotation লাগতে পারে | কম rotation লাগে |
| Use case | search-heavy workload | mixed insert/delete/search workload |

AVL tree বেশি balanced, তাই lookup-heavy system এ ভালো। Red-Black tree একটু relaxed balance রাখে, তাই frequent insert/delete এ practical performance ভালো হয়।

### Where are Red-Black trees commonly used in real systems (e.g., language standard libraries)?

Red-Black Tree অনেক standard library তে sorted associative container implement করতে ব্যবহৃত হয়।

Examples:
- C++: `std::map`, `std::set`, `std::multimap`, `std::multiset`
- Java: `TreeMap`, `TreeSet`
- Linux kernel এর কিছু ordered data structure

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    map<string, int> score;
    score["Rahim"] = 80;
    score["Karim"] = 90;
    score["Asha"] = 95;

    for (auto [name, marks] : score) {
        cout << name << " -> " << marks << endl;
    }
    return 0;
}
```

**Output sorted by key:**

```text
Asha -> 95
Karim -> 90
Rahim -> 80
```

---

## 🥇 53. How do you find the kth smallest or kth largest element in a BST?

BST এর in-order traversal sorted order দেয়। তাই **kth smallest** পেতে in-order traversal করে `k` তম element নিতে হবে। **kth largest** এর জন্য reverse in-order: Right -> Root -> Left।

```text
BST:
        5
       / \
      3   8
     / \   \
    2   4   10

In-order: 2 3 4 5 8 10
3rd smallest = 4
2nd largest = 8
```

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

int kthSmallest(Node* root, int k) {
    stack<Node*> st;
    Node* curr = root;

    while (curr != nullptr || !st.empty()) {
        while (curr != nullptr) {
            st.push(curr);
            curr = curr->left;
        }

        curr = st.top();
        st.pop();
        k--;

        if (k == 0) return curr->val;
        curr = curr->right;
    }

    return -1; // invalid k
}

int kthLargest(Node* root, int k) {
    stack<Node*> st;
    Node* curr = root;

    while (curr != nullptr || !st.empty()) {
        while (curr != nullptr) {
            st.push(curr);
            curr = curr->right;
        }

        curr = st.top();
        st.pop();
        k--;

        if (k == 0) return curr->val;
        curr = curr->left;
    }

    return -1; // invalid k
}
```

**Time Complexity**: `O(h + k)`
**Space Complexity**: `O(h)`

### How would augmenting each node with subtree size help answer this in O(log n)?

যদি প্রতিটি node এ তার subtree এর node count store করা থাকে, তাহলে kth smallest search binary search এর মতো করা যায়।

```text
        5(size=6)
       /        \
   3(size=3)   8(size=2)
   /   \          \
 2(1) 4(1)       10(1)
```

Logic:
- `leftSize = size(root->left)`
- যদি `k == leftSize + 1`, তাহলে root answer
- যদি `k <= leftSize`, তাহলে left subtree তে search
- না হলে right subtree তে search with `k = k - leftSize - 1`

Balanced BST হলে এই approach `O(log n)`।

```cpp
struct SizeNode {
    int val;
    int size;
    SizeNode* left;
    SizeNode* right;
    SizeNode(int x) : val(x), size(1), left(nullptr), right(nullptr) {}
};

int getSize(SizeNode* node) {
    return node ? node->size : 0;
}

int kthSmallestWithSize(SizeNode* root, int k) {
    if (!root) return -1;

    int leftSize = getSize(root->left);

    if (k == leftSize + 1) return root->val;
    if (k <= leftSize) return kthSmallestWithSize(root->left, k);

    return kthSmallestWithSize(root->right, k - leftSize - 1);
}
```

### How would you find the in-order predecessor and successor of a given node?

**In-order predecessor** হলো BST sorted order এ target এর ঠিক আগের value।
**In-order successor** হলো target এর ঠিক পরের value।

```text
In-order: 2 3 4 5 8 10
Target = 5
Predecessor = 4
Successor = 8
```

```cpp
pair<int, int> predecessorSuccessor(Node* root, int key) {
    Node* pred = nullptr;
    Node* succ = nullptr;
    Node* curr = root;

    while (curr != nullptr) {
        if (key < curr->val) {
            succ = curr;
            curr = curr->left;
        } else if (key > curr->val) {
            pred = curr;
            curr = curr->right;
        } else {
            Node* leftTree = curr->left;
            while (leftTree) {
                pred = leftTree;
                leftTree = leftTree->right;
            }

            Node* rightTree = curr->right;
            while (rightTree) {
                succ = rightTree;
                rightTree = rightTree->left;
            }
            break;
        }
    }

    int predecessor = pred ? pred->val : -1;
    int successor = succ ? succ->val : -1;
    return {predecessor, successor};
}
```

**Time Complexity**: `O(h)`
Balanced BST হলে `O(log n)`, skewed হলে `O(n)`।

---
