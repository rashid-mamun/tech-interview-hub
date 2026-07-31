---
sidebar_position: 9
title: 'Heap & Priority Queue'
---


## 🏔️ 54. What is a heap, and how does it differ from a binary search tree?

**Heap** হলো একটা special tree-based data structure, সাধারণত **complete binary tree** আকারে represent করা হয়, যেখানে parent এবং child node এর মধ্যে একটা priority rule follow করা হয়। এই rule কে বলা হয় **heap property**।

Heap মূলত তখন useful, যখন আমাদের বারবার **minimum** বা **maximum** element দ্রুত বের করতে হয়। যেমন: task scheduling, Dijkstra's algorithm, kth largest, merge k sorted lists, priority-based processing ইত্যাদি।

**Example max-heap:**

```text
        50
       /  \
      30   40
     / \   / \
    10 20 35 25

প্রতিটি parent তার child থেকে বড় বা সমান।
```

**Example min-heap:**

```text
        5
       / \
      10  8
     / \  / \
    30 20 15 25

প্রতিটি parent তার child থেকে ছোট বা সমান।
```

Heap এবং BST দেখতে দুইটাই binary tree হতে পারে, কিন্তু তাদের rule আলাদা।

| বিষয় | Heap | BST |
|---|---|---|
| Main property | Parent-child priority relation | Left subtree ছোট, right subtree বড় |
| Root | Min-heap এ smallest, max-heap এ largest | Root মাঝামাঝি value হতে পারে |
| Search arbitrary value | `O(n)` | balanced হলে `O(log n)` |
| Get min/max | `O(1)` for heap top | BST তে leftmost/rightmost যেতে হয় `O(h)` |
| Structure | Complete binary tree | Complete হওয়া বাধ্যতামূলক না |
| Main use case | Priority access | Sorted search/range query |

### What is the heap property, and how does it differ from the BST property?

**Heap property** শুধু parent এবং direct child এর মধ্যে relation maintain করে।

- **Max-heap**: `parent >= child`
- **Min-heap**: `parent <= child`

Heap এ left child এবং right child এর মধ্যে কোনো sorted relationship থাকে না।

```text
Valid max-heap:
        100
       /   \
      40    90
     / \   /  \
    10 30 70  80

এখানে 40 এর right child 30, 90 এর left child 70।
Left subtree পুরোটা root থেকে ছোট, কিন্তু BST এর মতো ordered না।
```

**BST property** অনেক strict:

```text
left subtree এর সব value < root < right subtree এর সব value
```

তাই BST তে in-order traversal sorted output দেয়, কিন্তু heap এ in-order traversal sorted output দেয় না।

### Is a heap always a complete binary tree? Why does that matter for array-based implementation?

Binary heap সাধারণত **complete binary tree** হয়। Complete মানে:
- last level ছাড়া সব level full থাকে
- last level left থেকে right fill হয়

```text
Complete binary tree:
        1
       / \
      2   3
     / \  /
    4  5 6

Not complete:
        1
       / \
      2   3
       \
        5
```

Complete হওয়ার কারণে heap কে pointer-based tree না বানিয়েও array দিয়ে store করা যায়। কোনো gap থাকে না, তাই index formula ব্যবহার করে parent/child বের করা যায়।

```text
Heap tree:
        50
       /  \
      30   40
     / \   /
    10 20 35

Array representation:
Index:  0   1   2   3   4   5
Value: 50  30  40  10  20  35
```

এই array-based representation memory efficient এবং cache-friendly।

---

## ⬆️⬇️ 55. What is the difference between a min-heap and a max-heap?

**Min-heap** এ root node সবসময় minimum element।
**Max-heap** এ root node সবসময় maximum element।

```text
Min-heap:                  Max-heap:
        3                         30
       / \                       /  \
      8   5                     20   25
     / \                       / \
    20 10                     3   8
```

| বিষয় | Min-heap | Max-heap |
|---|---|---|
| Root এ থাকে | Smallest element | Largest element |
| C++ STL default | না | `priority_queue<int>` |
| Common use | kth largest এর জন্য small heap, Dijkstra | kth smallest এর জন্য large heap, scheduling |

C++ STL এ `priority_queue` default ভাবে **max-heap**।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    priority_queue<int> maxHeap;

    maxHeap.push(10);
    maxHeap.push(30);
    maxHeap.push(20);

    cout << "Top of max-heap: " << maxHeap.top() << endl;
    return 0;
}
```

**Output:**

```text
Top of max-heap: 30
```

Min-heap বানাতে `greater<int>` comparator ব্যবহার করা হয়।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    priority_queue<int, vector<int>, greater<int>> minHeap;

    minHeap.push(10);
    minHeap.push(30);
    minHeap.push(20);

    cout << "Top of min-heap: " << minHeap.top() << endl;
    return 0;
}
```

**Output:**

```text
Top of min-heap: 10
```

### How would you implement a max-heap using a min-heap (or vice versa)?

Max-heap কে min-heap দিয়ে simulate করার common trick হলো value এর negative store করা।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    priority_queue<int, vector<int>, greater<int>> minHeap;

    vector<int> nums = {10, 30, 20};

    for (int x : nums) {
        minHeap.push(-x);
    }

    int maximumValue = -minHeap.top();
    cout << "Maximum value: " << maximumValue << endl;

    return 0;
}
```

**Output:**

```text
Maximum value: 30
```

একইভাবে max-heap দিয়ে min-heap simulate করতে negative value store করা যায়। তবে C++ এ direct comparator (`greater<int>`) ব্যবহার করাই clean।

---

## 📊 56. How is a heap implemented using an array?

Heap complete binary tree হওয়ার কারণে array তে level-order অনুযায়ী store করা হয়।

```text
Tree:
        90
       /  \
      60   70
     / \   / \
    20 50 65 40

Array:
Index:  0   1   2   3   4   5   6
Value: 90  60  70  20  50  65  40
```

কোনো pointer দরকার হয় না। শুধু index calculation দিয়েই parent/child access করা যায়।

### How do you calculate the indices of a node's parent, left child, and right child?

0-indexed array হলে:

```text
parent(i) = (i - 1) / 2
left(i)   = 2 * i + 1
right(i)  = 2 * i + 2
```

Example:

```text
Index 1 এর value 60
parent = (1 - 1) / 2 = 0 -> 90
left   = 2 * 1 + 1 = 3 -> 20
right  = 2 * 1 + 2 = 4 -> 50
```

1-indexed array হলে formula একটু আলাদা:

```text
parent(i) = i / 2
left(i)   = 2 * i
right(i)  = 2 * i + 1
```

### What are the "heapify-up" and "heapify-down" (sift up/down) operations?

**Heapify-up / Sift-up** ব্যবহার হয় insert করার পর। নতুন element array এর শেষে বসে, তারপর parent এর সাথে compare করে উপরে উঠতে থাকে যতক্ষণ heap property ঠিক না হয়।

```text
Insert 80 in max-heap:

Before:
        70
       /  \
      50   60

After insert at end:
        70
       /  \
      50   60
     /
    80

Sift-up:
        80
       /  \
      70   60
     /
    50
```

**Heapify-down / Sift-down** ব্যবহার হয় root remove করার পর। Last element root এ বসে, তারপর child এর সাথে compare করে নিচে নামে।

```text
Extract max:

Before:
        90
       /  \
      60   70
     / \
    20 50

Move last element 50 to root:
        50
       /  \
      60   70
     /
    20

Sift-down:
        70
       /  \
      60   50
     /
    20
```

Manual max-heap implementation using `vector`:

```cpp
#include <bits/stdc++.h>
using namespace std;

class MaxHeap {
    vector<int> heap;

    void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[parent] >= heap[i]) break;

            swap(heap[parent], heap[i]);
            i = parent;
        }
    }

    void siftDown(int i) {
        int n = heap.size();

        while (true) {
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            int largest = i;

            if (left < n && heap[left] > heap[largest]) {
                largest = left;
            }
            if (right < n && heap[right] > heap[largest]) {
                largest = right;
            }

            if (largest == i) break;

            swap(heap[i], heap[largest]);
            i = largest;
        }
    }

public:
    void push(int x) {
        heap.push_back(x);
        siftUp(heap.size() - 1);
    }

    int top() {
        return heap.front();
    }

    void pop() {
        if (heap.empty()) return;

        heap[0] = heap.back();
        heap.pop_back();

        if (!heap.empty()) {
            siftDown(0);
        }
    }

    bool empty() {
        return heap.empty();
    }
};

int main() {
    MaxHeap pq;
    pq.push(10);
    pq.push(30);
    pq.push(20);

    cout << pq.top() << endl;
    pq.pop();
    cout << pq.top() << endl;

    return 0;
}
```

**Output:**

```text
30
20
```

---

## ⏱️ 57. What is the time complexity of heap operations (insert, extract-min/max, build-heap)?

Heap operation এর complexity tree height এর উপর depend করে। Complete binary tree এর height `O(log n)`।

| Operation | Complexity | Explanation |
|---|---|---|
| `top()` / peek | `O(1)` | root directly access |
| Insert / push | `O(log n)` | sift-up করতে হতে পারে |
| Extract min/max / pop | `O(log n)` | sift-down করতে হতে পারে |
| Build heap | `O(n)` | bottom-up heapify |
| Search arbitrary value | `O(n)` | heap sorted না, তাই traversal লাগে |

C++ STL priority queue:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    priority_queue<int> pq;

    pq.push(40); // O(log n)
    pq.push(10);
    pq.push(60);

    cout << pq.top() << endl; // O(1), output 60

    pq.pop(); // O(log n)

    cout << pq.top() << endl; // output 40
    return 0;
}
```

### Why is building a heap from an array O(n) rather than O(n log n)?

যদি আমরা `n` টা element একে একে insert করি, তাহলে প্রতিটি insert `O(log n)`, total `O(n log n)`।

কিন্তু **bottom-up build heap** এ আমরা last non-leaf node থেকে root পর্যন্ত heapify-down করি। নিচের level এর node বেশি, কিন্তু তাদের height কম; root এর height বেশি, কিন্তু root মাত্র একটা।

```text
Array: 4 10 3 5 1

Initial tree:
        4
       / \
      10  3
     / \
    5   1

Build max-heap result:
        10
       /  \
      5    3
     / \
    4   1
```

Mathematical intuition:

```text
সব node log n distance move করে না।
অনেক leaf node 0 move করে,
তার উপর level এর node 1 move করে,
তার উপর level এর node 2 move করে,
...
Total work = O(n)
```

C++ STL এ `make_heap` bottom-up heap build করে।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> nums = {4, 10, 3, 5, 1};

    make_heap(nums.begin(), nums.end()); // max-heap, O(n)

    cout << "Max element: " << nums.front() << endl;

    return 0;
}
```

**Output:**

```text
Max element: 10
```

### What is the time complexity of heap sort, and is it stable?

**Heap Sort** এর idea:
1. Array থেকে heap build করা: `O(n)`
2. বারবার max/min বের করে sorted position এ রাখা: প্রতিবার `O(log n)`, মোট `n` বার

Total time complexity:

```text
O(n) + n * O(log n) = O(n log n)
```

Heap sort generally **not stable**। কারণ heapify এর সময় দূরের element swap হয়, ফলে same value এর relative order preserve নাও থাকতে পারে।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> nums = {4, 10, 3, 5, 1};

    make_heap(nums.begin(), nums.end());
    sort_heap(nums.begin(), nums.end());

    for (int x : nums) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

**Output:**

```text
1 3 4 5 10
```

---

## 🥇 58. How would you find the kth largest (or smallest) element in an unsorted array?

Unsorted array থেকে kth largest বের করার common approaches:

1. Sort করে answer নেওয়া
2. Heap ব্যবহার করা
3. Quickselect ব্যবহার করা

**Example:**

```text
nums = [3, 2, 1, 5, 6, 4]
k = 2

Sorted descending: [6, 5, 4, 3, 2, 1]
2nd largest = 5
```

Heap approach এ kth largest বের করতে size `k` এর min-heap রাখা হয়। Heap এর top সবসময় current top k elements এর মধ্যে সবচেয়ে ছোট। তাই শেষ পর্যন্ত heap top হবে kth largest।

```cpp
#include <bits/stdc++.h>
using namespace std;

int kthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;

    for (int x : nums) {
        minHeap.push(x);

        if ((int)minHeap.size() > k) {
            minHeap.pop();
        }
    }

    return minHeap.top();
}

int main() {
    vector<int> nums = {3, 2, 1, 5, 6, 4};
    int k = 2;

    cout << kthLargest(nums, k) << endl;
    return 0;
}
```

**Output:**

```text
5
```

kth smallest বের করতে size `k` এর max-heap রাখা যায়।

```cpp
int kthSmallest(vector<int>& nums, int k) {
    priority_queue<int> maxHeap;

    for (int x : nums) {
        maxHeap.push(x);

        if ((int)maxHeap.size() > k) {
            maxHeap.pop();
        }
    }

    return maxHeap.top();
}
```

### How does using a heap compare to sorting the entire array first?

| Approach | Time | Space | কখন ভালো |
|---|---|---|---|
| Sorting | `O(n log n)` | `O(1)` বা `O(n)` implementation অনুযায়ী | পুরো sorted order দরকার হলে |
| Heap of size k | `O(n log k)` | `O(k)` | শুধু kth element দরকার হলে, বিশেষ করে `k` ছোট হলে |
| Build full heap | `O(n + k log n)` | `O(n)` | বারবার top k বের করতে হলে |

যদি `k` ছোট হয়, heap of size `k` sorting এর চেয়ে efficient হতে পারে।

### How does the Quickselect algorithm compare in terms of average-case complexity?

**Quickselect** partition-based algorithm, quicksort এর মতো। এটা average case এ kth element `O(n)` time এ বের করতে পারে।

| Approach | Average Time | Worst Time | Extra Space |
|---|---|---|---|
| Heap | `O(n log k)` | `O(n log k)` | `O(k)` |
| Quickselect | `O(n)` | `O(n^2)` | `O(1)` average |

Quickselect fast, কিন্তু worst case খারাপ হতে পারে যদি pivot repeatedly bad হয়। Random pivot ব্যবহার করলে practical performance ভালো হয়।

```cpp
#include <bits/stdc++.h>
using namespace std;

int partition(vector<int>& nums, int left, int right) {
    int pivotIndex = left + rand() % (right - left + 1);
    swap(nums[pivotIndex], nums[right]);

    int pivot = nums[right];
    int storeIndex = left;

    for (int i = left; i < right; i++) {
        if (nums[i] <= pivot) {
            swap(nums[i], nums[storeIndex]);
            storeIndex++;
        }
    }

    swap(nums[storeIndex], nums[right]);
    return storeIndex;
}

int quickselect(vector<int>& nums, int kSmallestIndex) {
    int left = 0;
    int right = nums.size() - 1;

    while (left <= right) {
        int pivotIndex = partition(nums, left, right);

        if (pivotIndex == kSmallestIndex) {
            return nums[pivotIndex];
        }
        if (pivotIndex < kSmallestIndex) {
            left = pivotIndex + 1;
        } else {
            right = pivotIndex - 1;
        }
    }

    return -1;
}

int findKthLargestQuickselect(vector<int> nums, int k) {
    int kSmallestIndex = nums.size() - k;
    return quickselect(nums, kSmallestIndex);
}
```

---

## 🔗 59. How would you merge k sorted arrays or lists efficiently using a heap?

`k` টা sorted array merge করার জন্য min-heap ব্যবহার করা যায়। প্রতিটি array এর current smallest element heap এ রাখা হয়। Heap থেকে smallest বের করে result এ add করি, তারপর সেই element যে array থেকে এসেছে, সেই array এর next element heap এ push করি।

**Example:**

```text
arrays:
[1, 4, 7]
[2, 5, 8]
[3, 6, 9]

Min-heap initially: 1, 2, 3
Pop 1 -> push 4
Pop 2 -> push 5
Pop 3 -> push 6
...

Merged: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Item {
    int value;
    int arrayIndex;
    int elementIndex;

    bool operator>(const Item& other) const {
        return value > other.value;
    }
};

vector<int> mergeKSortedArrays(vector<vector<int>>& arrays) {
    priority_queue<Item, vector<Item>, greater<Item>> minHeap;
    vector<int> result;

    for (int i = 0; i < (int)arrays.size(); i++) {
        if (!arrays[i].empty()) {
            minHeap.push({arrays[i][0], i, 0});
        }
    }

    while (!minHeap.empty()) {
        Item current = minHeap.top();
        minHeap.pop();

        result.push_back(current.value);

        int nextIndex = current.elementIndex + 1;
        if (nextIndex < (int)arrays[current.arrayIndex].size()) {
            minHeap.push({
                arrays[current.arrayIndex][nextIndex],
                current.arrayIndex,
                nextIndex
            });
        }
    }

    return result;
}

int main() {
    vector<vector<int>> arrays = {
        {1, 4, 7},
        {2, 5, 8},
        {3, 6, 9}
    };

    vector<int> merged = mergeKSortedArrays(arrays);

    for (int x : merged) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

**Output:**

```text
1 2 3 4 5 6 7 8 9
```

### What is the time complexity of this approach?

ধরা যাক total element সংখ্যা `N`, এবং array/list সংখ্যা `k`।

- Heap এ একসাথে maximum `k` টা element থাকে
- প্রতিটি element একবার push এবং একবার pop হয়
- প্রতিটি push/pop এর cost `O(log k)`

তাই:

```text
Time Complexity = O(N log k)
Space Complexity = O(k) excluding output
```

যদি সব array একসাথে concatenate করে sort করি, তাহলে `O(N log N)` লাগবে। Heap approach better, কারণ already sorted structure কাজে লাগানো হচ্ছে।

### How does this relate to the "merge k sorted linked lists" problem?

Merge k sorted linked lists problem একই idea follow করে। পার্থক্য শুধু array index এর বদলে linked list node pointer heap এ রাখা হয়।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

struct CompareNode {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val; // min-heap
    }
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*, vector<ListNode*>, CompareNode> minHeap;

    for (ListNode* head : lists) {
        if (head != nullptr) {
            minHeap.push(head);
        }
    }

    ListNode dummy(0);
    ListNode* tail = &dummy;

    while (!minHeap.empty()) {
        ListNode* node = minHeap.top();
        minHeap.pop();

        tail->next = node;
        tail = tail->next;

        if (node->next != nullptr) {
            minHeap.push(node->next);
        }
    }

    return dummy.next;
}
```

**Why heap works here:** প্রতিটি list sorted, তাই প্রতিটি list এর current head হলো ঐ list এর smallest remaining element। সব current head এর মধ্যে globally smallest বের করতে min-heap perfect fit।

**Time Complexity**: `O(N log k)`
**Space Complexity**: `O(k)`

---
