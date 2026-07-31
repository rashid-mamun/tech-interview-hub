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

**Heap** একটি বিশেষ ধরনের **Complete Binary Tree**, যা সাধারণত **Array**-এর মাধ্যমে খুব efficient ভাবে implement করা যায় — কোনো explicit **pointer** (left/right child pointer) ছাড়াই।

যেহেতু Heap সবসময় একটি **Complete Binary Tree** (কোনো gap থাকে না, সব level left থেকে right ক্রমে ভরা থাকে), তাই এর node গুলোকে **index** অনুযায়ী array-তে সাজানো সম্ভব — parent-child সম্পর্ক শুধুমাত্র **index-এর গাণিতিক সম্পর্ক** দিয়েই বের করা যায়।

```
        10
       /  \
      8    9
     / \   /
    4   7 5
```

এই Heap-টিকে array-তে represent করলে (0-indexed):

```cpp
vector<int> heap = {10, 8, 9, 4, 7, 5};
// Index:            0   1  2  3  4  5
```

Tree-এর প্রতিটি **level** array-তে **পাশাপাশি (sequentially)** সাজানো থাকে।

---

### How do you calculate the indices of a node's parent, left child, and right child?

Array-এর indexing **0-indexed** নাকি **1-indexed** তার উপর ভিত্তি করে formula একটু ভিন্ন হয়।

#### 🔹 0-Indexed Array (সবচেয়ে বেশি ব্যবহৃত, যেমন C++ vector/STL)

কোনো node-এর index `i` হলে:

| সম্পর্ক | Formula |
|---|---|
| **Parent** | `(i - 1) / 2` (integer division) |
| **Left Child** | `2 * i + 1` |
| **Right Child** | `2 * i + 2` |

```cpp
int parent(int i)     { return (i - 1) / 2; }
int leftChild(int i)  { return 2 * i + 1; }
int rightChild(int i) { return 2 * i + 2; }
```

#### 🔹 1-Indexed Array (কিছু textbook-এ ব্যবহৃত)

| সম্পর্ক | Formula |
|---|---|
| **Parent** | `i / 2` |
| **Left Child** | `2 * i` |
| **Right Child** | `2 * i + 1` |

> 💡 **কেন এটা কাজ করে:** Complete Binary Tree-এর property অনুযায়ী প্রতিটি level সম্পূর্ণ ভরা থাকে (শেষ level ছাড়া, যা left থেকে right ভরা থাকে) — তাই **level-order** অনুযায়ী array index-এর সাথে একটি নির্দিষ্ট গাণিতিক সম্পর্ক তৈরি হয়ে যায়, আর কোনো explicit pointer রাখার প্রয়োজন পড়ে না।

#### উদাহরণ দিয়ে যাচাই (0-indexed):
Index `1` (value `8`)-এর জন্য:
- **Parent** = `(1-1)/2 = 0` → index `0` (value `10`) ✅
- **Left Child** = `2*1+1 = 3` → index `3` (value `4`) ✅
- **Right Child** = `2*1+2 = 4` → index `4` (value `7`) ✅

---

### What are the "heapify-up" and "heapify-down" (sift up/down) operations?

**Heapify-Up** ব্যবহার করা হয় **insertion**-এর সময়, যখন নতুন একটি element array-এর **শেষে (end)** যুক্ত করা হয় এবং সেটিকে তার সঠিক জায়গায় **উপরের দিকে** নিয়ে যেতে হয়।

##### মূল Logic (Max-Heap-এর জন্য):
নতুন element-কে তার **parent**-এর সাথে compare করা হয়। যদি নতুন element parent থেকে **বড়** হয়, তাহলে তাদের **swap** করা হয়, এবং এই প্রক্রিয়া **root** পর্যন্ত অথবা যতক্ষণ না heap property সঠিক হয়, ততক্ষণ চলতে থাকে।

```cpp
void heapifyUp(vector<int>& heap, int i) {
    while (i > 0) {
        int parentIdx = (i - 1) / 2;
        
        if (heap[i] > heap[parentIdx]) {  // Max-Heap violation
            swap(heap[i], heap[parentIdx]);
            i = parentIdx;  // উপরের দিকে move করা
        } else {
            break;  // Heap property ঠিক আছে, থামো
        }
    }
}

void insert(vector<int>& heap, int value) {
    heap.push_back(value);        // শেষে যুক্ত করা
    heapifyUp(heap, heap.size() - 1);  // সঠিক জায়গায় "bubble up" করা
}
```

##### Time Complexity: **O(log n)** — কারণ element সর্বোচ্চ tree-এর **height** পরিমাণ ধাপ move করতে পারে।

---

#### Heapify-Down (Sift Down) Operation

**Heapify-Down** ব্যবহার করা হয় **deletion** (সাধারণত root/top element মুছে ফেলার) সময়, যখন root-এ **শেষ element** বসিয়ে দিয়ে সেটিকে তার সঠিক জায়গায় **নিচের দিকে** নিয়ে যেতে হয়।

##### মূল Logic (Max-Heap-এর জন্য):
Current node-কে তার **left ও right child**-এর সাথে compare করা হয়। যদি কোনো child current node থেকে **বড়** হয়, তাহলে সবচেয়ে **বড় child**-এর সাথে swap করা হয়, এবং এই প্রক্রিয়া **leaf** পর্যন্ত অথবা heap property সঠিক না হওয়া পর্যন্ত চলতে থাকে।

```cpp
void heapifyDown(vector<int>& heap, int i) {
    int n = heap.size();
    
    while (true) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n && heap[left] > heap[largest]) {
            largest = left;
        }
        if (right < n && heap[right] > heap[largest]) {
            largest = right;
        }
        
        if (largest == i) break;  // Heap property ঠিক আছে, থামো
        
        swap(heap[i], heap[largest]);
        i = largest;  // নিচের দিকে move করা
    }
}

int extractMax(vector<int>& heap) {
    int maxVal = heap[0];
    heap[0] = heap.back();   // শেষ element-কে root-এ বসানো
    heap.pop_back();
    heapifyDown(heap, 0);    // সঠিক জায়গায় "bubble down" করা
    return maxVal;
}
```

##### Time Complexity: **O(log n)** — একইভাবে, element সর্বোচ্চ tree-এর **height** পরিমাণ ধাপ move করতে পারে।


## ⏱️ 57. What is the time complexity of heap operations (insert, extract-min/max, build-heap)?



| Operation | Time Complexity | ব্যাখ্যা |
|---|---|---|
| **Insert** | **O(log n)** | নতুন element শেষে যুক্ত করে **heapify-up** করতে হয়, যা tree-এর height (log n) পরিমাণ ধাপ নেয় |
| **Extract-Min/Max** | **O(log n)** | Root element সরিয়ে শেষ element root-এ বসিয়ে **heapify-down** করতে হয়, যা height পরিমাণ ধাপ নেয় |
| **Peek (Get Min/Max)** | **O(1)** | Min-Heap/Max-Heap-এ root-ই সবসময় সবচেয়ে ছোট/বড় value, তাই সরাসরি access করা যায় |
| **Build-Heap** | **O(n)** | একসাথে n সংখ্যক element থেকে heap তৈরি করা — এটি **O(n log n)** নয়, নিচে ব্যাখ্যা করা হলো |
| **Search (নির্দিষ্ট value)** | **O(n)** | Heap-এর কোনো **ordering property** (BST-এর মতো) না থাকায়, নির্দিষ্ট value খুঁজতে পুরো array scan করতে হয় |
| **Delete (নির্দিষ্ট element)** | **O(log n)** | Element-এর index জানা থাকলে, সেটিকে শেষ element দিয়ে replace করে heapify-up/down করা হয় |

---

### Why is building a heap from an array O(n) rather than O(n log n)?

প্রথম দেখায় মনে হতে পারে যে, যেহেতু **n** সংখ্যক element-এর প্রতিটির জন্য **heapify** করতে **O(log n)** সময় লাগে, তাই মোট সময় হবে **O(n log n)**।

**Build-Heap** সাধারণত **bottom-up** পদ্ধতিতে করা হয় — array-এর **শেষ non-leaf node** থেকে শুরু করে **root** পর্যন্ত প্রতিটি node-এ **heapify-down** apply করা হয়।

```cpp
void buildHeap(vector<int>& arr) {
    int n = arr.size();
    
    // শেষ non-leaf node থেকে শুরু করা: index (n/2 - 1)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
}
```

#### মূল কারণ: **প্রতিটি node-এর heapify-down cost, তার height-এর উপর নির্ভর করে, tree-এর overall height-এর উপর নয়**

- যে node গুলো **leaf**-এর কাছাকাছি (tree-এর নিচের দিকে), তাদের height **কম**, তাই heapify-down-এর জন্য **কম কাজ** লাগে
- মাত্র **root**-এর কাছের কয়েকটি node-এর height বেশি (log n পর্যন্ত), কিন্তু তাদের সংখ্যা **খুবই কম**

#### গাণিতিক প্রমাণ:

একটি **Complete Binary Tree**-তে:
- **Height 0**-তে (leaf level) থাকে প্রায় `n/2` node — এদের heapify করতে **0** কাজ লাগে
- **Height 1**-এ থাকে প্রায় `n/4` node — এদের heapify করতে সর্বোচ্চ **1** ধাপ লাগে
- **Height 2**-এ থাকে প্রায় `n/8` node — সর্বোচ্চ **2** ধাপ লাগে
- ... এভাবে চলতে থাকে **Height h** (root) পর্যন্ত, যেখানে মাত্র **1**টি node থাকে

মোট কাজের পরিমাণ হবে এই series-এর sum:

```text
T(n) = sum from h=0 to log n of (n / 2^(h+1)) * h
```

এই series-টি গাণিতিকভাবে **converge** করে একটি **constant**-এর দিকে, যার ফলে সামগ্রিক sum হয়:

```text
T(n) = O(n) * sum from h=0 to infinity of h / 2^h
     = O(n) * 2
     = O(n)
```

> 🔑 **মূল Insight:** বেশিরভাগ node (প্রায় অর্ধেক) tree-এর **নিচের দিকে (leaf-এর কাছে)** থাকে, যাদের heapify করতে প্রায় **কোনো কাজই লাগে না**। শুধুমাত্র **অল্প কিছু node** (root-এর কাছের) বেশি কাজ করে, কিন্তু তাদের সংখ্যা exponentially কম। এই **weighted sum** মিলিয়ে মোট time complexity **O(n)**-এ নেমে আসে — যা **O(n log n)**-এর চেয়ে **tighter (আরও efficient) bound**।

#### তুলনা: Naive Insert-based Build vs Bottom-Up Build

| পদ্ধতি | Time Complexity | কারণ |
|---|---|---|
| **Insert একে একে** (প্রতিটি element-এ heapify-up) | **O(n log n)** | প্রতিটি insert-এ worst case O(log n), n বার করা হয় |
| **Bottom-Up Build (Floyd's Algorithm)** | **O(n)** | নিচের দিকের বেশিরভাগ node-এ সামান্য কাজ লাগে |

---


### What is the time complexity of heap sort, and is it stable?

| Case | Time Complexity |
|---|---|
| **Best Case** | O(n log n) |
| **Average Case** | O(n log n) |
| **Worst Case** | O(n log n) |

Heap Sort-এর সব case-এই complexity একই থাকে, কারণ:
1. **Build-Heap**: O(n)
2. **n বার Extract-Max/Min** করা, প্রতিবার **O(log n)** — মোট **O(n log n)**
3. সামগ্রিক: `O(n) + O(n log n) = O(n log n)`

```cpp
void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    // Step 1: Max-Heap তৈরি করা - O(n)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
    
    // Step 2: একে একে root (max element) extract করে শেষে বসানো - O(n log n)
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);           // max element-কে শেষে নিয়ে যাওয়া
        heapifyDown(arr, 0, i);         // বাকি অংশে heapify - O(log n)
    }
}
```

#### Space Complexity:
**O(1)** — Heap Sort একটি **in-place** sorting algorithm, কারণ এটি মূল array-এর মধ্যেই heap তৈরি করে এবং sort করে, কোনো extra array-এর প্রয়োজন হয় না।

---

#### Heap Sort কি Stable?

**না, Heap Sort একটি Stable Sorting Algorithm নয়।** ❌

#### কেন Stable নয়:

**Stable Sort**-এর সংজ্ঞা হলো: যদি দুইটি element-এর **value সমান** থাকে, তাহলে sorting-এর পরেও তাদের **আপেক্ষিক ক্রম (relative order)** অপরিবর্তিত থাকবে।

কিন্তু Heap Sort-এ **swap operation**-এর কারণে সমান value-যুক্ত element-গুলোর মূল ক্রম **নষ্ট (disrupt)** হয়ে যেতে পারে, কারণ heapify-down করার সময় elements দূরবর্তী position-এ চলে যায়, যা তাদের original relative order বজায় রাখে না।

```
Input:  [5a, 3, 5b, 1, 5c]  // 5a, 5b, 5c same value কিন্তু ভিন্ন original position বোঝাতে label করা হয়েছে

Heap Sort-এর পর হয়তো output হবে:
[1, 3, 5c, 5a, 5b]  // 5a, 5b, 5c-এর original order (a, b, c) নষ্ট হয়ে গেছে
```

> ⚠️ **Practical প্রভাব:** যদি সমান value-যুক্ত element গুলোর original order গুরুত্বপূর্ণ হয় (যেমন, একাধিক field অনুযায়ী sort করার সময়), তাহলে Heap Sort উপযুক্ত নয়। এক্ষেত্রে **Merge Sort** (যা stable) ব্যবহার করা ভালো।

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
