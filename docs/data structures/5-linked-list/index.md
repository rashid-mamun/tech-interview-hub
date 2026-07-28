---
sidebar_position: 5
title: 'Linked List'
---


## 🪢 21. What is a linked list, and how does it differ from an array?

**Linked List** হলো একটা linear data structure যেখানে element গুলো (যাদের **node** বলা হয়) memory তে **contiguous** না থেকে, বরং scattered ভাবে store হয়, এবং প্রতিটি node তার পরবর্তী node এর memory address (**pointer/reference**) ধরে রাখে। প্রতিটি node এ থাকে দুইটা অংশ: **data** এবং **pointer(s)** (next node এর দিকে নির্দেশ করে)।

**Array vs Linked List — মূল পার্থক্য:**

| বৈশিষ্ট্য | Array | Linked List |
|---|---|---|
| Memory layout | Contiguous | Scattered (non-contiguous) |
| Access by index | `O(1)` | `O(n)` (traverse করতে হয়) |
| Insertion/Deletion (beginning) | `O(n)` (shifting লাগে) | `O(1)` (শুধু pointer পরিবর্তন) |
| Size | Fixed (static) বা resizing overhead (dynamic) | Dynamically grow/shrink করে, কোনো resize overhead নেই |
| Extra memory | লাগে না | প্রতিটি node এ pointer store করার জন্য extra memory লাগে |

---

### What is the difference between a singly linked list, doubly linked list, and circular linked list?

**Singly Linked List**: প্রতিটি node শুধু **পরবর্তী node** এর দিকে নির্দেশ করে (এক দিকে traverse করা যায়)।
```cpp
struct Node {
    int data;
    Node* next;
};
```

**Doubly Linked List**: প্রতিটি node **পরবর্তী এবং আগের** — দুই দিকের node কে reference করে। এতে **উভয় দিক থেকে** traverse করা যায়, এবং কোনো node delete করা সহজ হয় (আগের node এর reference সরাসরি পাওয়া যায়, খুঁজতে হয় না)।
```cpp
struct Node {
    int data;
    Node* next;
    Node* prev;
};
```

**Circular Linked List**: শেষ node টা `NULL` না হয়ে আবার **প্রথম node** কে point করে (একটা loop তৈরি হয়)। এটা singly বা doubly — দুই ধরনেরই হতে পারে। Circular queue বা round-robin scheduling এর মতো সমস্যায় এটা কাজে লাগে।

---

### What are the trade-offs of linked lists vs arrays in terms of memory and access time?

**Memory:**
- Array তে শুধু data-ই store হয় (compact), কিন্তু linked list এ প্রতিটি node এ extra pointer(s) store করতে হয়, তাই একই সংখ্যক element এর জন্য linked list বেশি memory ব্যবহার করে
- Array তে যদি dynamic resizing হয়, তাহলে মাঝেমধ্যে extra unused capacity থাকতে পারে; linked list এ exactly যতগুলো node লাগে ততটাই allocate হয় (কোনো wasted pre-allocated space নেই)

**Access Time:**
- Array এ **random access** (`arr[i]`) `O(1)` — কারণ address সরাসরি calculate করা যায়
- Linked list এ কোনো নির্দিষ্ট position এ পৌঁছাতে **head থেকে traverse** করতে হয়, তাই access `O(n)`

**Insertion/Deletion:**
- Array এর শুরুতে/মাঝে insert/delete করতে elements shift করতে হয় — `O(n)`
- Linked list এ যদি position (node reference) জানা থাকে, insert/delete `O(1)` এ হয় (শুধু pointer redirect করলেই হয়)

**Cache Performance:**
- Array এর contiguous memory এর কারণে **cache locality** ভালো (sequential access দ্রুত হয়)
- Linked list এর scattered memory এর কারণে cache miss বেশি হয়, যা practical performance এ array কে প্রায়ই দ্রুত করে তোলে, যদিও theoretical complexity ভালো না হতে পারে

---

## 🔁 22. How do you reverse a linked list?

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* reverseIterative(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;

    while (curr != nullptr) {
        Node* nextTemp = curr->next;  // পরের node টা আগে save রাখা
        curr->next = prev;            // link reverse করা
        prev = curr;                  // prev এগিয়ে নেওয়া
        curr = nextTemp;              // curr এগিয়ে নেওয়া
    }
    return prev;  // নতুন head
}

void printList(Node* head) {
    while (head != nullptr) {
        cout << head->data;
        if (head->next != nullptr) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);

    cout << "Original list: ";
    printList(head);

    head = reverseIterative(head);

    cout << "Reversed list: ";
    printList(head);
    return 0;
}
```
**Sample Output:**
```
Original list: 1 -> 2 -> 3 -> 4
Reversed list: 4 -> 3 -> 2 -> 1
```
**Time Complexity**: `O(n)` **Space Complexity**: `O(1)`

---

### How would you do it iteratively vs recursively?

```cpp
Node* reverseRecursive(Node* head) {
    // Base case: empty list বা শেষ node
    if (head == nullptr || head->next == nullptr) {
        return head;
    }

    // বাকি list টা recursively reverse করা
    Node* newHead = reverseRecursive(head->next);

    // current node কে তার পরের node এর সাথে reverse link করা
    head->next->next = head;
    head->next = nullptr;

    return newHead;
}
```
**Sample Output (একই input দিয়ে চালালে):**
```
Reversed list: 4 -> 3 -> 2 -> 1
```
**Time Complexity**: `O(n)` **Space Complexity**: `O(n)` (recursion call stack এর কারণে — iterative approach এর তুলনায় এটা একটা disadvantage)

---

### How would you reverse a linked list in groups of k?

**সমস্যা:** প্রতি `k` টা node কে group আকারে reverse করতে হবে (যদি শেষে `k` এর চেয়ে কম node থাকে, সেগুলো unchanged থাকবে)।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* reverseKGroup(Node* head, int k) {
    // প্রথমে check করা এই group এ k টা node আছে কিনা
    Node* node = head;
    int count = 0;
    while (node != nullptr && count < k) {
        node = node->next;
        count++;
    }
    if (count < k) return head;  // k এর কম হলে reverse করা হবে না

    // এই group টা reverse করা (iterative reverse এর মতো)
    Node* prev = nullptr;
    Node* curr = head;
    for (int i = 0; i < k; i++) {
        Node* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }

    // পরের group কে recursively reverse করে link করা
    head->next = reverseKGroup(curr, k);

    return prev;  // নতুন head of this group
}

void printList(Node* head) {
    while (head != nullptr) {
        cout << head->data;
        if (head->next != nullptr) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    head->next->next->next->next = new Node(5);

    cout << "Original list: ";
    printList(head);

    head = reverseKGroup(head, 2);

    cout << "Reversed in groups of 2: ";
    printList(head);
    return 0;
}
```
**Sample Output:**
```
Original list: 1 -> 2 -> 3 -> 4 -> 5
Reversed in groups of 2: 2 -> 1 -> 4 -> 3 -> 5
```
(লক্ষ্য করুন: শেষের `5` একা থাকায় (k=2 পূরণ হয় না) সেটা unchanged থেকে গেছে)

**Time Complexity**: `O(n)` **Space Complexity**: `O(n/k)` (recursion stack depth এর জন্য)

---

## 🐢🐇 23. How do you detect a cycle in a linked list?

**Floyd's cycle detection algorithm (tortoise and hare) কীভাবে কাজ করে?**

এই algorithm এ দুইটা pointer ব্যবহার করা হয় — একটা **slow (tortoise)** যেটা প্রতিবার এক ঘর এগোয়, এবং একটা **fast (hare)** যেটা প্রতিবার দুই ঘর এগোয়। যদি linked list এ কোনো **cycle (loop)** থাকে, তাহলে fast pointer একসময় slow pointer কে "ধরে ফেলবে" (একই node এ মিলবে) — ঠিক যেমন একটা circular track এ দ্রুত দৌড়ানো কেউ ধীরে দৌড়ানো কাউকে একসময় lap করে ধরে ফেলে। যদি cycle না থাকে, fast pointer `NULL` এ পৌঁছে যাবে।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

bool hasCycle(Node* head) {
    Node* slow = head;
    Node* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;         // এক ঘর এগোয়
        fast = fast->next->next;   // দুই ঘর এগোয়

        if (slow == fast) {
            return true;  // মিলে গেলে cycle আছে
        }
    }
    return false;  // fast NULL এ পৌঁছালে cycle নেই
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    head->next->next->next->next = head->next;  // cycle তৈরি করা (4 -> 2)

    cout << "Has cycle: " << (hasCycle(head) ? "Yes" : "No") << endl;
    return 0;
}
```
**Sample Output:**
```
Has cycle: Yes
```
**Time Complexity**: `O(n)` **Space Complexity**: `O(1)` (কোনো extra data structure লাগে না, যেখানে hashset ব্যবহার করলে `O(n)` space লাগত)

---
### How would you find the starting node of the cycle once detected?

**Mathematical insight:** যখন `slow` এবং `fast` pointer মিলে যায়, সেই meeting point থেকে **একটা নতুন pointer** (`slow2`) কে `head` থেকে শুরু করানো হয়, এবং `slow` কে একই জায়গায় (meeting point এ) রেখে দুইজনকেই **এক ঘর করে** move করানো হয়। যেখানে তারা আবার মিলবে, সেটাই cycle এর **entry point (starting node)**।

```cpp
Node* detectCycleStart(Node* head) {
    Node* slow = head;
    Node* fast = head;

    // Phase 1: cycle আছে কিনা detect করা এবং meeting point বের করা
    bool hasCycle = false;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            hasCycle = true;
            break;
        }
    }

    if (!hasCycle) return nullptr;

    // Phase 2: cycle এর entry point বের করা
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }

    return slow;  // এটাই cycle এর starting node
}
```
**কেন এটা কাজ করে (সংক্ষিপ্ত ব্যাখ্যা):** ধরা যাক head থেকে cycle এর entry point পর্যন্ত distance = `a`, এবং entry point থেকে meeting point পর্যন্ত distance = `b`। গাণিতিকভাবে প্রমাণ করা যায় যে, meeting point থেকে entry point এ ফিরে আসার distance ঠিক `a` এর সমান — তাই head থেকে এবং meeting point থেকে একই গতিতে (এক ঘর করে) move করলে তারা ঠিক **entry point** এ মিলবে।

**Time Complexity**: `O(n)` **Space Complexity**: `O(1)`

---

## 🎯 24. How do you find the middle of a linked list in a single pass?

Slow/fast pointer technique ব্যবহার করে: `slow` এক ঘর করে এবং `fast` দুই ঘর করে এগোয়। যখন `fast` শেষে পৌঁছায়, তখন `slow` ঠিক **middle** এ থাকে (কারণ `fast` দ্বিগুণ গতিতে move করে, তাই `slow` অর্ধেক distance পার হবে)।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* findMiddle(Node* head) {
    Node* slow = head;
    Node* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;  // middle node
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    head->next->next->next->next = new Node(5);

    Node* mid = findMiddle(head);
    cout << "Middle node value: " << mid->data << endl;
    return 0;
}
```
**Sample Output:**
```
Middle node value: 3
```
**Time Complexity**: `O(n)` (একটা মাত্র pass) **Space Complexity**: `O(1)`

---
### How does the slow/fast pointer technique work here?

**এই technique ব্যবহার করে linked list palindrome কিনা কীভাবে check করবেন?**

**Approach:**
1. Slow/fast pointer দিয়ে **middle** খুঁজে বের করা
2. Middle থেকে দ্বিতীয় অর্ধেক (second half) কে **reverse** করা
3. প্রথম অর্ধেক এবং reversed দ্বিতীয় অর্ধেক কে **element-by-element compare** করা
4. (Optional) list কে আগের অবস্থায় ফিরিয়ে আনতে দ্বিতীয় অর্ধেক আবার reverse করা

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    while (head != nullptr) {
        Node* nextTemp = head->next;
        head->next = prev;
        prev = head;
        head = nextTemp;
    }
    return prev;
}

bool isPalindrome(Node* head) {
    if (head == nullptr || head->next == nullptr) return true;

    // Step 1: middle খুঁজে বের করা
    Node* slow = head;
    Node* fast = head;
    while (fast->next != nullptr && fast->next->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }

    // Step 2: দ্বিতীয় অর্ধেক reverse করা
    Node* secondHalf = reverseList(slow->next);

    // Step 3: দুই অর্ধেক compare করা
    Node* firstHalf = head;
    Node* secondHalfCopy = secondHalf;  // পরে restore করার জন্য save রাখা
    bool result = true;

    while (secondHalf != nullptr) {
        if (firstHalf->data != secondHalf->data) {
            result = false;
            break;
        }
        firstHalf = firstHalf->next;
        secondHalf = secondHalf->next;
    }

    // Step 4 (Optional): list restore করা
    slow->next = reverseList(secondHalfCopy);

    return result;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(2);
    head->next->next->next->next = new Node(1);

    cout << "Is palindrome: " << (isPalindrome(head) ? "Yes" : "No") << endl;
    return 0;
}
```
**Sample Output:**
```
Is palindrome: Yes
```
**Time Complexity**: `O(n)` **Space Complexity**: `O(1)` (in-place reverse ব্যবহার করা হয়েছে, কোনো extra array/stack লাগেনি)

---

## 🔀 25. How would you merge two sorted linked lists?

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* mergeTwoLists(Node* l1, Node* l2) {
    Node dummy(0);           // dummy node ব্যবহার করলে edge case handle করা সহজ হয়
    Node* tail = &dummy;

    while (l1 != nullptr && l2 != nullptr) {
        if (l1->data <= l2->data) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }

    // যেই list এ element বাকি আছে সেটা সরাসরি জুড়ে দেওয়া
    tail->next = (l1 != nullptr) ? l1 : l2;

    return dummy.next;
}

void printList(Node* head) {
    while (head != nullptr) {
        cout << head->data;
        if (head->next != nullptr) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}

int main() {
    Node* l1 = new Node(1);
    l1->next = new Node(3);
    l1->next->next = new Node(5);

    Node* l2 = new Node(2);
    l2->next = new Node(4);
    l2->next->next = new Node(6);

    Node* merged = mergeTwoLists(l1, l2);

    cout << "Merged list: ";
    printList(merged);
    return 0;
}
```
**Sample Output:**
```
Merged list: 1 -> 2 -> 3 -> 4 -> 5 -> 6
```

### What is the time and space complexity of your approach?

- **Time Complexity**: `O(n + m)`, যেখানে `n` এবং `m` হলো দুইটা list এর length (প্রতিটি node একবার করে visit করা হয়)
- **Space Complexity**: `O(1)` — কোনো নতুন node তৈরি করা হয়নি, শুধু existing node গুলোর pointer পুনরায় সাজানো হয়েছে (in-place merge)

---

### How would you merge k sorted linked lists efficiently?

**সবচেয়ে efficient approach: Min-Heap (Priority Queue) ব্যবহার করা**

**মূল ধারণা:** প্রতিটি list এর **head node** গুলো একটা min-heap এ রাখা হয়। প্রতিবার heap থেকে সবচেয়ে ছোট value বের করে result এ যোগ করা হয়, এবং সেই node এর পরবর্তী node (যদি থাকে) heap এ push করা হয়।

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

struct Compare {
    bool operator()(Node* a, Node* b) {
        return a->data > b->data;  // min-heap বানানোর জন্য
    }
};

Node* mergeKLists(vector<Node*>& lists) {
    priority_queue<Node*, vector<Node*>, Compare> minHeap;

    // প্রতিটি list এর head heap এ push করা
    for (Node* head : lists) {
        if (head != nullptr) minHeap.push(head);
    }

    Node dummy(0);
    Node* tail = &dummy;

    while (!minHeap.empty()) {
        Node* smallest = minHeap.top();
        minHeap.pop();

        tail->next = smallest;
        tail = tail->next;

        if (smallest->next != nullptr) {
            minHeap.push(smallest->next);
        }
    }

    return dummy.next;
}

void printList(Node* head) {
    while (head != nullptr) {
        cout << head->data;
        if (head->next != nullptr) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}

int main() {
    Node* l1 = new Node(1);
    l1->next = new Node(4);
    l1->next->next = new Node(5);

    Node* l2 = new Node(1);
    l2->next = new Node(3);
    l2->next->next = new Node(4);

    Node* l3 = new Node(2);
    l3->next = new Node(6);

    vector<Node*> lists = {l1, l2, l3};
    Node* merged = mergeKLists(lists);

    cout << "Merged k lists: ";
    printList(merged);
    return 0;
}
```
**Sample Output:**
```
Merged k lists: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6
```

**Time Complexity**: `O(N log k)`, যেখানে `N` = সব list মিলিয়ে মোট node সংখ্যা, এবং `k` = list এর সংখ্যা (প্রতিটি heap operation `O(log k)`, এবং মোট `N` টা node process করা হয়)
**Space Complexity**: `O(k)` (heap এ সর্বোচ্চ `k` টা node থাকে একসাথে)

(তুলনায়, যদি একটার পর একটা list কে pairwise merge করা হতো (section এর প্রথম approach বারবার ব্যবহার করে), সেটা `O(N × k)` সময় নিত — heap approach অনেক বেশি efficient বড় `k` এর জন্য।)

---

## 🪜 26. What is a skip list, and how does it improve search performance over a regular linked list?

**Skip List** হলো একটা **probabilistic data structure** যেটা sorted linked list এর উপর ভিত্তি করে তৈরি, কিন্তু এতে **multiple levels** থাকে — প্রতিটি উপরের level এ কম সংখ্যক node থাকে, যেগুলো নিচের level এর কিছু node কে "skip" করে সরাসরি অনেক দূরের node এ পৌঁছাতে সাহায্য করে (অনেকটা একটা "express lane" এর মতো)।

**Structure:**
```
Level 3:  1 ------------------> 9
Level 2:  1 -------> 5 -------> 9
Level 1:  1 -> 3 --> 5 -> 7 --> 9
Level 0:  1 -> 3 -> 5 -> 7 -> 9  (সব element, base list)
```

**কেন এটা performance improve করে:** একটা normal (single-level) sorted linked list এ কোনো element খুঁজতে `O(n)` সময় লাগে, কারণ প্রতিটি node একে একে check করতে হয় — linked list এ **binary search করা সম্ভব না** (কারণ random access নেই)। Skip list এ, search শুরু হয় **সবচেয়ে উপরের (sparse) level** থেকে, এবং যখন target value এর চেয়ে বড় কোনো node পাওয়া যায়, তখন **নিচের level** এ নেমে সূক্ষ্মভাবে search continue করা হয়। এভাবে প্রতিটি level এ অনেকটা distance "skip" করে এগোনো যায়, যা কার্যত **binary search এর মতো logarithmic efficiency** দেয়।

```cpp
// Simplified conceptual sketch (production-grade skip list আরো complex)
#include <bits/stdc++.h>
using namespace std;

#define MAX_LEVEL 4

struct Node {
    int data;
    vector<Node*> forward;  // প্রতিটি level এর জন্য একটা forward pointer
    Node(int val, int level) : data(val), forward(level + 1, nullptr) {}
};

class SkipList {
    Node* head;
    int level;
public:
    SkipList() {
        head = new Node(-1, MAX_LEVEL);
        level = 0;
    }

    int randomLevel() {
        int lvl = 0;
        while (rand() % 2 && lvl < MAX_LEVEL) lvl++;
        return lvl;
    }

    void insert(int value) {
        vector<Node*> update(MAX_LEVEL + 1);
        Node* curr = head;

        for (int i = level; i >= 0; i--) {
            while (curr->forward[i] && curr->forward[i]->data < value)
                curr = curr->forward[i];
            update[i] = curr;
        }

        int newLevel = randomLevel();
        if (newLevel > level) {
            for (int i = level + 1; i <= newLevel; i++)
                update[i] = head;
            level = newLevel;
        }

        Node* newNode = new Node(value, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->forward[i] = update[i]->forward[i];
            update[i]->forward[i] = newNode;
        }
    }

    bool search(int value) {
        Node* curr = head;
        for (int i = level; i >= 0; i--) {
            while (curr->forward[i] && curr->forward[i]->data < value)
                curr = curr->forward[i];
        }
        curr = curr->forward[0];
        return (curr != nullptr && curr->data == value);
    }
};

int main() {
    SkipList sl;
    sl.insert(3);
    sl.insert(6);
    sl.insert(7);
    sl.insert(9);
    sl.insert(12);

    cout << "Search 7: " << (sl.search(7) ? "Found" : "Not Found") << endl;
    cout << "Search 10: " << (sl.search(10) ? "Found" : "Not Found") << endl;
    return 0;
}
```
**Sample Output:**
```
Search 7: Found
Search 10: Not Found
```

---

### What is the expected time complexity of search, insert, and delete in a skip list?

| Operation | Expected Time Complexity | Worst Case |
|---|---|---|
| Search | `O(log n)` | `O(n)` |
| Insert | `O(log n)` | `O(n)` |
| Delete | `O(log n)` | `O(n)` |

**কেন "expected" (probabilistic)**: Skip list এর level structure **randomization** এর উপর ভিত্তি করে তৈরি হয় (প্রতিটি node কে coin-flip এর মতো randomly higher level এ promote করা হয় insert করার সময়)। এই randomization এর কারণে **average case** এ `O(log n)` performance পাওয়া যায় (অনেকটা balanced binary search tree এর মতো), কিন্তু theoretically worst case এ (যদি randomization খুব খারাপ ভাবে হয়, যেমন সব node একই level এ থেকে যায়) এটা `O(n)` তে নেমে যেতে পারে — যদিও practice এ এটা extremely rare।

**Space Complexity**: `O(n)` average case এ (প্রতিটি node average ভাবে সীমিত সংখ্যক extra level এ থাকে, geometric distribution অনুযায়ী)।

**Skip list এর সুবিধা**: এটা balanced BST (যেমন Red-Black Tree, AVL Tree) এর একটা সহজ বিকল্প, কারণ এতে complex rotation/rebalancing logic লাগে না, কিন্তু similar `O(log n)` performance দেয়। Redis এর মতো systems এ sorted set implement করতে skip list ব্যবহৃত হয়।