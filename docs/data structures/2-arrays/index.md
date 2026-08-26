---
sidebar_position: 2
title: 'Arrays'
---

## 5. What is an array, and how is it stored in memory?

**Array** হলো একটা linear data structure যেখানে একই type এর multiple element গুলো **contiguous (পাশাপাশি, একটানা)** memory location এ store করা হয়। প্রতিটি element কে তার **index** দিয়ে identify করা যায়, এবং index সাধারণত `0` থেকে শুরু হয়।

Memory তে array স্টোর হওয়ার mechanism:
- একটা array declare করলে OS/compiler memory তে একটা **contiguous block** allocate করে, যার size = `number of elements × size of each element`
- প্রতিটি element এর memory address আগের element এর address থেকে predictable distance এ থাকে
- Element এর address বের করার formula: `address = base_address + (index × size_of_element)`

এই **contiguous storage** এবং **fixed-size element** থাকার কারণেই array তে **random access (index দিয়ে direct access)** সম্ভব হয় constant time এ, কারণ address সরাসরি calculate করা যায়, কোনো traversal লাগে না।

**Memory layout diagram:**

```text
int arr[5] = {10, 20, 30, 40, 50}
ধরি base address = 1000, এবং int size = 4 bytes

Index:      0      1      2      3      4
Value:     10     20     30     40     50
Address: 1000   1004   1008   1012   1016

address(arr[3]) = 1000 + (3 * 4) = 1012
```

```text
Array memory:

+------+------+------+------+------+
|  10  |  20  |  30  |  40  |  50  |
+------+------+------+------+------+
  0      1      2      3      4

সব element পাশাপাশি memory block এ থাকে।
```


### What is the difference between a static array and a dynamic array (e.g., ArrayList, Python list)?

**Static Array:**
- Size **fixed** থাকে compile-time এ বা creation-time এ (যেমন C/Java তে `int arr[10]`)
- একবার size define করার পর সেটা runtime এ change করা যায় না
- Memory allocation সাধারণত **stack** এ হয় (অথবা fixed heap block)
- খুবই memory-efficient কিন্তু flexibility কম

**Dynamic Array** (যেমন Python এর `list`, Java এর `ArrayList`, C++ এর `vector`):
- Size runtime এ **grow বা shrink** করতে পারে
- Internally এটা একটা static array দিয়েই implement করা হয়, কিন্তু capacity ফুরিয়ে গেলে automatically নতুন, বড় array তে resize হয়ে যায়
- এই flexibility এর জন্য সামান্য extra overhead থাকে (memory এবং সময় উভয় ক্ষেত্রেই)

**Static vs dynamic diagram:**

```text
Static array:
capacity = 4, size = 4
[10][20][30][40]

আর element add করা যাবে না, কারণ size fixed.

Dynamic array/vector:
capacity = 4, size = 3
[10][20][30][  ]

push_back(40):
capacity = 4, size = 4
[10][20][30][40]

push_back(50), capacity full:
new capacity = 8
[10][20][30][40][50][  ][  ][  ]
```

মূল পার্থক্য টেবিল আকারে:

| বৈশিষ্ট্য | Static Array | Dynamic Array |
|---|---|---|
| Size | Fixed | Resizable |
| Memory location | সাধারণত Stack | Heap |
| Resize overhead | নেই | আছে (occasionally) |
| Flexibility | কম | বেশি |


### How does a dynamic array handle resizing internally, and what is its amortized insertion cost?

Dynamic array এর internal mechanism:

1. শুরুতে একটা নির্দিষ্ট **capacity** নিয়ে একটা internal static array তৈরি হয় (উদাহরণস্বরূপ capacity = 4)
2. নতুন element যোগ করার সময় (`append`), যদি current array তে জায়গা থাকে, তাহলে সরাসরি সেখানে element বসিয়ে দেওয়া হয় — এটা `O(1)` operation
3. যখন array **full** হয়ে যায় এবং নতুন element যোগ করার প্রয়োজন হয়, তখন:
   - একটা নতুন, বড় (সাধারণত **double size**, growth factor 2x) array allocate করা হয়
   - পুরনো সব element নতুন array তে **copy** করা হয় — এটা `O(n)` operation
   - পুরনো array **deallocate** করে দেওয়া হয়
   - এরপর নতুন element যোগ করা হয়

**Amortized insertion cost:**

যদিও resize হওয়ার সময় একটা single `append` call এ `O(n)` সময় লাগে, কিন্তু এই resize খুব **কম frequency তে** ঘটে (doubling strategy এর কারণে), তাই বহুসংখ্যক `append` operation এর over average cost হিসাব করলে দেখা যায় প্রতিটি insertion এর **amortized cost = `O(1)`**।

**কেন doubling strategy কাজ করে (mathematical intuition):**

ধরা যাক শুরুতে capacity = 1, এবং প্রতিবার full হলে size দ্বিগুণ হয়। n টা element insert করতে মোট copy operation এর সংখ্যা হবে:
```
1 + 2 + 4 + 8 + ... + n ≈ 2n
```
এই geometric series এর sum `O(n)` এর মধ্যেই থাকে (2n কখনোই n এর অনেক বেশি হয় না)। তাই n টা insertion এর total cost = `O(n)`, ফলে **প্রতিটি insertion এর amortized cost = `O(n)/n = O(1)`**।

(লক্ষণীয়: যদি resize এর সময় capacity শুধু **fixed amount** (যেমন +1) বাড়ানো হতো, তাহলে amortized cost `O(n)` হয়ে যেত, কারণ প্রতি insertion এই পুরো array copy করতে হতো। তাই **doubling (multiplicative growth)** ব্যবহার করাটাই এই efficiency এর মূল কারণ।)

**Resize walkthrough:**

```text
Before push_back(50):
size = 4, capacity = 4

Old buffer:
[10][20][30][40]

Allocate bigger buffer:
[  ][  ][  ][  ][  ][  ][  ][  ]  capacity = 8

Copy old elements:
[10][20][30][40][  ][  ][  ][  ]

Insert new element:
[10][20][30][40][50][  ][  ][  ]
```


## 6. What is the time complexity of common array operations (access, search, insertion, deletion)?

| Operation | Time Complexity | ব্যাখ্যা |
|---|---|---|
| **Access (by index)** | `O(1)` | Direct address calculation দিয়ে element পাওয়া যায় |
| **Search (unsorted)** | `O(n)` | প্রতিটি element check করতে হয় (linear search) |
| **Search (sorted)** | `O(log n)` | Binary search ব্যবহার করা যায় |
| **Insertion (at end)** | `O(1)` amortized | যদি জায়গা থাকে, direct বসানো যায় |
| **Insertion (at beginning/middle)** | `O(n)` | পরের সব element shift করতে হয় |
| **Deletion (at end)** | `O(1)` | সরাসরি last element remove করা যায় |
| **Deletion (at beginning/middle)** | `O(n)` | পরের সব element shift করে জায়গা fill করতে হয় |

**Operation visual summary:**

```text
Access arr[3]:
[10][20][30][40][50]
             ^
          direct formula -> O(1)

Search 50:
10 -> 20 -> 30 -> 40 -> 50
সব element check লাগতে পারে -> O(n)
```


### Why is insertion/deletion at the beginning of an array O(n)?

Array যেহেতু **contiguous memory** তে store হয়, তাই প্রতিটি element এর একটা নির্দিষ্ট, predictable index/address থাকা প্রয়োজন — এই property টাই array কে `O(1)` random access দেয়।

যখন array এর **শুরুতে (index 0)** একটা নতুন element insert করতে হয়, তখন existing সব element কে **এক ঘর করে ডানে shift** করতে হয়, যাতে index 0 এ জায়গা খালি হয়। এই shifting operation এ প্রতিটি element (সর্বোচ্চ `n` টা) move করতে হয়, তাই এটা `O(n)` time নেয়।

**Insertion at beginning:**

```text
Insert 5 at index 0

Before:
Index:  0   1   2   3
Value: 10  20  30  40

Shift right:
Index:  0   1   2   3   4
Value: __  10  20  30  40

Insert:
Index:  0   1   2   3   4
Value:  5  10  20  30  40
```

একইভাবে, শুরু থেকে কোনো element **delete** করলে তার পরের সব element কে **এক ঘর করে বামে shift** করতে হয়, যাতে array তে কোনো gap না থাকে — এটাও `O(n)` operation।

**Deletion at beginning:**

```text
Delete index 0

Before:
[10][20][30][40]

Shift left:
[20][30][40][  ]
```

(মাঝখানে insertion/deletion করলেও একইভাবে `O(n)` হয়, কারণ average case এ প্রায় `n/2` element shift করতে হয়, যেটা asymptotically `O(n)` ই থাকে।)


### How does access by index achieve O(1) time?

Array এর contiguous memory allocation এর কারণে, প্রতিটি element এর memory address একটা simple **arithmetic formula** দিয়ে সরাসরি calculate করা যায়:

```
address(arr[i]) = base_address + (i × size_of_each_element)
```

যেহেতু এই calculation এ কোনো loop বা traversal লাগে না — শুধু একটা multiplication এবং addition — তাই যত বড় array-ই হোক না কেন (n যত বড়ই হোক), যেকোনো index এ element access করতে **সবসময় constant সংখ্যক operation** লাগে। এই কারণেই array access `O(1)` (constant time)।

**Example:**

```text
arr[1000000] access করতেও traversal লাগে না।
CPU শুধু address calculate করে:

base + index * element_size

তাই arr[3] এবং arr[1000000] দুটোই O(1) access।
```


## 7. What is a 2D array, and how is it stored in memory?

**2D array** হলো একটা array of arrays — row এবং column আকারে data organize করা হয় (matrix এর মতো)। যদিও logically এটা একটা **grid/table** হিসেবে দেখা যায়, কিন্তু computer memory তে সবকিছুই **linear (1D)** ভাবে store হয়, তাই 2D array কে internally একটা 1D array হিসেবেই map করা হয়।

**Logical view vs memory view:**

```text
Logical 2D matrix:

row\col   0   1   2
0         1   2   3
1         4   5   6

Actual memory is linear:
[1][2][3][4][5][6]
```

এই mapping দুইভাবে করা যায়: **row-major order** অথবা **column-major order**।


### What is the difference between row-major and column-major order?

**Row-major order** (C, C++, Java, Python এ ব্যবহৃত):
- প্রতিটি **row সম্পূর্ণভাবে একসাথে** memory তে store করা হয়, তারপর পরের row
- অর্থাৎ প্রথমে row 0 এর সব element, তারপর row 1 এর সব element, এভাবে চলতে থাকে
- Element `arr[i][j]` এর address: `base + (i × total_columns + j) × size_of_element`

**Column-major order** (Fortran, MATLAB, R এ ব্যবহৃত):
- প্রতিটি **column সম্পূর্ণভাবে একসাথে** memory তে store করা হয়, তারপর পরের column
- Element `arr[i][j]` এর address: `base + (j × total_rows + i) × size_of_element`

**উদাহরণ:**
```
Matrix:
1  2  3
4  5  6
```
- **Row-major** memory layout: `1, 2, 3, 4, 5, 6`
- **Column-major** memory layout: `1, 4, 2, 5, 3, 6`

**Diagram:**

```text
Matrix:
        col0 col1 col2
row0     1    2    3
row1     4    5    6

Row-major:
row0 first, then row1
[1][2][3][4][5][6]

Column-major:
col0 first, then col1, then col2
[1][4][2][5][3][6]
```

**কেন এটা গুরুত্বপূর্ণ:** এই order জানা থাকলে **cache locality** optimize করা যায় — row-major language এ row-wise traversal করলে memory access pattern sequential হয় (cache-friendly), কিন্তু column-wise traversal করলে memory access scattered হয়ে যায়, যা performance কমিয়ে দেয়।

> **C++/language precision:** C/C++-এর built-in rectangular array row-major contiguous। Java-এর `int[][]` এবং Python-এর সাধারণ nested list মূলত row/list object-এর reference রাখে; পুরো matrix একটি single contiguous numeric buffer—এমন guarantee নেই। Python-এ NumPy array ব্যবহার করলে contiguous C-order বা Fortran-order layout explicitly পাওয়া যায়।


### How would you rotate a matrix in place by 90 degrees?

Matrix কে **in-place** (extra matrix ব্যবহার না করে) 90 degree clockwise rotate করার জন্য দুইটা ধাপে করা হয়:

**Step 1: Transpose করা** (row কে column এ convert করা — `arr[i][j]` এবং `arr[j][i]` swap করা)

**Step 2: প্রতিটি row কে reverse করা**

```cpp
#include <bits/stdc++.h>
using namespace std;

void rotate90Clockwise(vector<vector<int>>& matrix) {
    int n = matrix.size();

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }

    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}
```

**Example:**
```
Original:          After Transpose:      After Row Reverse (Final):
1 2 3               1 4 7                  7 4 1
4 5 6      →         2 5 8         →        8 5 2
7 8 9               3 6 9                  9 6 3
```

এই approach এর **Time Complexity = `O(n²)`** (প্রতিটি element একবার করে touch হয়), এবং **Space Complexity = `O(1)`** (কোনো extra matrix লাগে না, শুধু in-place swapping)।


## 8. How would you find duplicate elements in an array efficiently?

**1. Sorting-based Approach**
- প্রথমে array **sort** করে ফেলা হয়, তারপর adjacent element গুলো compare করা হয়
- **Time Complexity**: `O(n log n)` (sorting এর জন্য)
- **Space Complexity**: `O(1)` (in-place sort ব্যবহার করলে) বা `O(log n)` (sorting algorithm এর recursion stack এর জন্য)
- **Trade-off**: Space efficient, কিন্তু original array এর order নষ্ট হয়ে যায় এবং sorting এর জন্য extra time লাগে

**2. Hashing-based Approach**
- একটা **HashSet/HashMap** ব্যবহার করে প্রতিটি element traverse করার সময় দেখা হয় সেটা আগে দেখা গেছে কিনা
- **Time Complexity**: `O(n)` (average case)
- **Space Complexity**: `O(n)` (hash set store করার জন্য)
- **Trade-off**: Time efficient (fastest), কিন্তু extra space লাগে

**3. Bit Manipulation Approach**
- যখন element এর range সীমিত থাকে, তখন একটা **bit vector** ব্যবহার করে প্রতিটি number এর জন্য একটা bit flag রাখা যায় (দেখা গেছে কিনা)
- **Time Complexity**: `O(n)`
- **Space Complexity**: `O(1)` (fixed-size bit array, hashing এর তুলনায় অনেক কম space)
- **Trade-off**: শুধুমাত্র non-negative integers এবং known/limited range এর ক্ষেত্রে কাজ করে

**Sorting approach diagram:**

```text
Original:
[4, 2, 7, 2, 9]

Sort:
[2, 2, 4, 7, 9]
 ^
 adjacent same -> duplicate found
```

**Hashing approach diagram:**

```text
arr = [4, 2, 7, 2, 9]

seen = {}
read 4 -> not seen, add
seen = {4}

read 2 -> not seen, add
seen = {4, 2}

read 7 -> not seen, add
seen = {4, 2, 7}

read 2 -> already seen -> duplicate
```

### What approaches exist (sorting, hashing, bit manipulation) and what are their trade-offs?

| Approach | Time | Space | কখন ব্যবহার করবেন |
|---|---|---|---|
| Sorting | `O(n log n)` | `O(1)`–`O(log n)` | Space constraint থাকলে, order matter না করলে |
| Hashing | `O(n)` | `O(n)` | Time priority হলে, space available থাকলে |
| Bit Manipulation | `O(n)` | `O(1)` | Range জানা এবং limited থাকলে |

এখানে bit-vector-এর space `O(1)` বলা যায় কেবল value universe আগে থেকে fixed constant হলে। Range `0..U-1` input-এর সঙ্গে বাড়লে space `O(U)` bits।


### How would you find the only duplicate in an array of n+1 integers ranging from 1 to n?

এই একটা classic problem, এবং এর জন্য সবচেয়ে elegant solution হলো **Floyd's Cycle Detection Algorithm** (Tortoise and Hare) — `O(n)` time এবং `O(1)` space এ।

**মূল ধারণা:** array কে একটা **linked list** হিসেবে চিন্তা করা হয়, যেখানে `arr[i]` হলো index `i` থেকে পরবর্তী index এ যাওয়ার "pointer"। যেহেতু একটা duplicate value আছে, তাই এই linked list এ একটা **cycle** তৈরি হবে, এবং সেই cycle এর entry point-ই হলো duplicate number।

**Array as linked list diagram:**

```text
nums = [1, 3, 4, 2, 2]
index:  0  1  2  3  4

Pointer relation:
0 -> nums[0] = 1
1 -> nums[1] = 3
3 -> nums[3] = 2
2 -> nums[2] = 4
4 -> nums[4] = 2

Graph:
0 -> 1 -> 3 -> 2 -> 4
               ^    |
               |____|

Cycle entry = 2, duplicate = 2
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int findDuplicate(std::vector<int>& nums) {
    // Phase 1: Detect cycle (find intersection point)
    int slow = nums[0];
    int fast = nums[0];
    while (true) {
        slow = nums[slow];
        fast = nums[nums[fast]];
        if (slow == fast) {
            break;
        }
    }

    // Phase 2: Find entrance to the cycle (the duplicate)
    int slow2 = nums[0];
    while (slow != slow2) {
        slow = nums[slow];
        slow2 = nums[slow2];
    }

    return slow;
}
```

**বিকল্প approaches** (কম optimal কিন্তু simpler):
- **Sorting**: sort করে adjacent duplicate খুঁজা — `O(n log n)` time, কিন্তু array কে modify করতে হয়
- **HashSet**: `O(n)` time, `O(n)` space — সহজ কিন্তু extra space লাগে
- **Sum/Math trick**: expected sum (1 to n) এর সাথে actual sum এর পার্থক্য বের করে duplicate পাওয়া যায় — `O(n)` time, `O(1)` space (তবে শুধুমাত্র একটা duplicate এবং সেটা exactly একবার extra থাকলেই কাজ করে)

> **Constraint note:** Sum trick কেবল তখনই valid যখন `1..n`-এর প্রতিটি value অন্তত একবার আছে এবং duplicate value-টি ঠিক একবার অতিরিক্ত এসেছে। Standard Floyd problem-এ একই duplicate একাধিকবার থাকতে পারে; সেখানে sum trick reliable নয়।

Floyd's algorithm সবচেয়ে ভালো, কারণ এটা array কে **modify করে না** এবং `O(1)` extra space ব্যবহার করে।


## 9. What is an "in-place" algorithm, and why does it matter for array problems?

**In-place algorithm** হলো এমন একটা algorithm যেটা input data structure কে transform করতে **constant (`O(1)`) বা খুব সামান্য extra space** ব্যবহার করে — অর্থাৎ input size এর সাথে proportionally বাড়ে এমন কোনো নতুন data structure তৈরি করে না। Transformation মূল data structure এর মধ্যেই ঘটে।

এটা গুরুত্বপূর্ণ কারণ:
- **Memory-constrained environments** এ (embedded systems, large-scale data processing) এটা essential
- বড় dataset এর ক্ষেত্রে extra copy তৈরি করলে অনেক বেশি memory এবং copy করার সময় লাগতে পারে
- Interview এবং real-world system এ **space efficiency** একটা গুরুত্বপূর্ণ optimization metric


### Can you give an example of an in-place array transformation?

**উদাহরণ: Array কে reverse করা**

```text
Before:
[1, 2, 3, 4, 5]
 ^           ^
left       right

swap 1 and 5:
[5, 2, 3, 4, 1]
    ^     ^
  left  right

swap 2 and 4:
[5, 4, 3, 2, 1]
       ^
     done
```

```cpp
void reverse(std::vector<int>& arr) {
    int left = 0, right = static_cast<int>(arr.size()) - 1;
    while (left < right) {
        std::swap(arr[left], arr[right]);
        left++;
        right--;
    }
}
```
এখানে কোনো নতুন array তৈরি না করে, শুধু **two-pointer technique** দিয়ে element গুলো swap করা হচ্ছে মূল array এর মধ্যেই। **Space Complexity = `O(1)`**।

(তুলনায়, out-of-place approach হলো: `arr[::-1]` এর মতো একটা নতুন reversed array রিটার্ন করা, যেটার জন্য `O(n)` extra space লাগে।)

আরেকটা উদাহরণ: **Quicksort** — এটাও in-place sorting algorithm (partition করে element গুলো মূল array এর মধ্যেই rearrange করে), যেখানে **Merge Sort** সাধারণত out-of-place (merging এর জন্য extra array লাগে)।


### What is the difference between in-place and out-of-place algorithms in terms of space complexity?

| বৈশিষ্ট্য | In-place Algorithm | Out-of-place Algorithm |
|---|---|---|
| Extra Space | `O(1)` (বা `O(log n)`, recursion stack থাকলে) | `O(n)` বা তার বেশি |
| Original Data | সরাসরি modify হয় | সাধারণত অপরিবর্তিত থাকে, নতুন copy তৈরি হয় |
| উদাহরণ | Quicksort, in-place reverse | Merge Sort, creating a new sorted list |

**গুরুত্বপূর্ণ note:** কিছু algorithm এ recursion ব্যবহার হলে, যদিও data structure এর জন্য কোনো নতুন array তৈরি হয় না, তবুও **call stack** এর কারণে `O(log n)` বা `O(n)` space লাগতে পারে — তাই strictly বলতে গেলে সেটাকে পুরোপুরি "constant space" বলা যায় না, কিন্তু সাধারণত এটাকেও in-place ধরা হয় যদি auxiliary data structure না লাগে।


## 10. What are prefix sums, and how are they used to optimize array problems?

**Prefix Sum** হলো একটা technique যেখানে একটা নতুন array তৈরি করা হয়, যার প্রতিটি index `i` তে **original array এর 0 থেকে i পর্যন্ত সব element এর cumulative sum** store থাকে।

```
Original array:  [3, 1, 4, 1, 5, 9]
Prefix sum:       [3, 4, 8, 9, 14, 23]
```
এখানে `prefix[i] = arr[0] + arr[1] + ... + arr[i]`, অথবা recursively: `prefix[i] = prefix[i-1] + arr[i]`

এই prefix array একবার (`O(n)` time এ) তৈরি করে ফেললে, এরপর যেকোনো **range sum query** কে `O(1)` time এ answer দেওয়া যায়, যেটা naive approach এ প্রতিবার `O(n)` সময় নিত। এটা বিশেষভাবে কাজে লাগে যখন একই array তে **বহুবার** range sum query করতে হয় (repeated queries এর জন্য preprocessing worth it হয়ে যায়)।

**Prefix sum diagram:**

```text
arr:     [3, 1, 4, 1, 5, 9]
prefix:  [3, 4, 8, 9,14,23]

prefix[4] = 3 + 1 + 4 + 1 + 5 = 14
```


### How would you use a prefix sum to answer range sum queries efficiently?

যদি আমাদের `l` থেকে `r` (inclusive) পর্যন্ত element এর sum জানতে হয়, তাহলে formula:

```
range_sum(l, r) = prefix[r] - prefix[l-1]
```
(যদি `l == 0` হয়, তাহলে সরাসরি `prefix[r]` ই answer)

**উদাহরণ:** উপরের array এ `l=2, r=4` (index 2 থেকে 4, অর্থাৎ `4+1+5=10`) এর sum জানতে:
```
range_sum(2, 4) = prefix[4] - prefix[1] = 14 - 4 = 10 ✓
```

```text
arr:      [3, 1, 4, 1, 5, 9]
index:     0  1  2  3  4  5

Need sum from 2 to 4:
          [4, 1, 5]

prefix[4] gives sum 0..4 = 14
prefix[1] gives sum 0..1 = 4

subtract prefix[1]:
14 - 4 = 10
```

এই approach এ প্রতিটি query `O(1)` time এ answer পাওয়া যায় (একবার `O(n)` preprocessing এর পর), যা multiple queries এর ক্ষেত্রে naive `O(n)` per-query approach এর চেয়ে অনেক efficient — বিশেষত যদি `q` টা query থাকে, তাহলে total complexity `O(n + q)` হয়ে যায়, নাহলে `O(n × q)` হতো।


### What is the difference between a prefix sum and a difference array?

**Prefix Sum** এবং **Difference Array** আসলে একে অপরের **inverse concept**, এবং তারা opposite ধরনের problem solve করতে ব্যবহৃত হয়:

- **Prefix Sum**: original array থেকে তৈরি করা হয়, এবং এটা **range sum query** efficiently answer করার জন্য ব্যবহৃত হয় (query-focused)

- **Difference Array**: এটা তৈরি করা হয় এভাবে: `diff[i] = arr[i] - arr[i-1]`, এবং এটা ব্যবহৃত হয় যখন array তে **বারবার range update** করতে হয় (যেমন index `l` থেকে `r` পর্যন্ত সব element এ একটা value যোগ করা), সেটা efficiently করার জন্য (update-focused)।

**Difference array দিয়ে range update:**
```cpp
void rangeUpdate(vector<int>& diff, int l, int r, int val) {
    diff[l] += val;
    if (r + 1 < (int)diff.size()) {
        diff[r + 1] -= val;
    }
}
```
এখানে `l` থেকে `r` পর্যন্ত সব element এ `val` যোগ করতে মাত্র **`O(1)`** সময় লাগে (পুরো range traverse করতে হয় না)। এরপর সব update শেষ হলে, difference array এর **prefix sum** নিলেই final updated array পাওয়া যায় — অর্থাৎ **difference array + prefix sum technique একসাথে মিলেই full array update reconstruct করে**।

**Difference array update diagram:**

```text
Initial arr:
[0, 0, 0, 0, 0]

Add +5 from index 1 to 3:
diff[1] += 5
diff[4] -= 5

diff:
[0, 5, 0, 0, -5]

Prefix of diff gives final arr:
[0, 5, 5, 5, 0]
```

**সংক্ষেপে:**

| | Prefix Sum | Difference Array |
|---|---|---|
| Purpose | Range **query** (sum) efficient করা | Range **update** efficient করা |
| Build from | Original array | Original array এর adjacent difference |
| Best for | Static array, বহু query | বহু range update, শেষে একবার query |

## Complete array example

```cpp
#include <bits/stdc++.h>
using namespace std;

void print(const vector<int>& numbers) {
    for (int number : numbers) cout << number << ' ';
    cout << '\n';
}

int main() {
    vector<int> numbers{10, 20, 30, 40};
    cout << "Index 2: " << numbers[2] << '\n';
    auto position = find(numbers.begin(), numbers.end(), 30);
    cout << "30 found at: " << distance(numbers.begin(), position) << '\n';

    numbers.insert(numbers.begin() + 1, 15);
    cout << "After insert: "; print(numbers);
    numbers.erase(numbers.begin() + 3);
    cout << "After delete: "; print(numbers);

    vector<long long> prefix(numbers.size() + 1, 0);
    for (int i = 0; i < (int)numbers.size(); ++i)
        prefix[i + 1] = prefix[i] + numbers[i];
    cout << "Range sum [1,3]: " << prefix[4] - prefix[1] << '\n';

    reverse(numbers.begin(), numbers.end());
    cout << "Reversed: "; print(numbers);
    return 0;
}
```

**Sample output**

```text
Index 2: 30
30 found at: 2
After insert: 10 15 20 30 40
After delete: 10 15 20 40
Range sum [1,3]: 75
Reversed: 40 20 15 10
```

### Array memory diagram

```text
Index:       0          1          2          3
         ┌────────┬────────┬────────┬────────┐
Value:   │   10   │   20   │   30   │   40   │
         └────────┴────────┴────────┴────────┘
Address:   1000       1004       1008       1012

address(i) = base + i × sizeof(int)
```

### Prefix-sum query diagram

```text
Array :     10   15   20   40
Prefix:  0  10   25   45   85

sum(1..3) = prefix[4] - prefix[1] = 85 - 10 = 75
```
