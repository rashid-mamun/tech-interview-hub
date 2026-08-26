---
sidebar_position: 11
title: 'Sorting & Searching'
---


## 91. What are the common sorting algorithms, and what are their time and space complexities?

**Sorting** মানে data কে কোনো নির্দিষ্ট order এ arrange করা, যেমন ascending বা descending। Interview এ sorting important কারণ অনেক problem sorting করার পর সহজ হয়ে যায়: duplicate detect, interval merge, two pointers, greedy scheduling, kth element ইত্যাদি।

Common sorting algorithms:

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Bubble Sort | `O(n)` | `O(n^2)` | `O(n^2)` | `O(1)` | Yes |
| Selection Sort | `O(n^2)` | `O(n^2)` | `O(n^2)` | `O(1)` | No |
| Insertion Sort | `O(n)` | `O(n^2)` | `O(n^2)` | `O(1)` | Yes |
| Merge Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | Yes |
| Quick Sort | `O(n log n)` | `O(n log n)` | `O(n^2)` | `O(log n)` average | No |
| Heap Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` | No |
| Counting Sort | `O(n + k)` | `O(n + k)` | `O(n + k)` | `O(n + k)` | Yes possible |
| Radix Sort | `O(d(n + k))` | `O(d(n + k))` | `O(d(n + k))` | `O(n + k)` | Yes if stable sub-sort |

Here:
- `n` = number of elements
- `k` = value range বা base/radix size
- `d` = number of digits

C++ practical use:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 9, 1, 5, 6};

    sort(nums.begin(), nums.end()); // intro-sort, average/worst O(n log n)

    for (int x : nums) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

**Output:**

```text
1 2 5 5 6 9
```

### How do bubble sort, selection sort, and insertion sort compare in terms of performance and use cases?

এই তিনটা simple `O(n^2)` sorting algorithm। Interview এ এগুলো mostly concept বুঝতে কাজে লাগে।

**Bubble Sort:** adjacent element compare করে বড় element ধীরে ধীরে end এ নিয়ে যায়।

```text
5 1 4 2
1 5 4 2
1 4 5 2
1 4 2 5
```

**Selection Sort:** প্রতিবার unsorted part থেকে minimum বের করে সামনে বসায়।

```text
5 1 4 2
1 5 4 2
1 2 4 5
```

**Insertion Sort:** left side sorted ধরে current element কে correct position এ insert করে।

```text
5 | 1 4 2
1 5 | 4 2
1 4 5 | 2
1 2 4 5
```

| Algorithm | Main idea | Practical use |
|---|---|---|
| Bubble Sort | repeated adjacent swaps | teaching/basic concept |
| Selection Sort | minimum select করে place | swap কম লাগে, কিন্তু slow |
| Insertion Sort | sorted prefix maintain | small/nearly sorted data |

Insertion sort C++:

```cpp
void insertionSort(vector<int>& nums) {
    int n = nums.size();

    for (int i = 1; i < n; i++) {
        int key = nums[i];
        int j = i - 1;

        while (j >= 0 && nums[j] > key) {
            nums[j + 1] = nums[j];
            j--;
        }

        nums[j + 1] = key;
    }
}
```

### Why is insertion sort often used for small or nearly-sorted datasets?

Insertion sort nearly sorted array এ খুব efficient, কারণ খুব কম shifting লাগে।

```text
Nearly sorted:
1 2 3 5 4 6

শুধু 4 কে 5 এর আগে আনলেই sorted।
```

Benefits:
- implementation simple
- small input এ overhead কম
- stable
- in-place
- nearly sorted data হলে almost `O(n)`

এই কারণে অনেক production sorting algorithm small partition এর জন্য insertion sort ব্যবহার করে।


## 92. What is the difference between stable and unstable sorting algorithms?

**Stable sorting** হলে equal keys এর relative order preserve থাকে।
**Unstable sorting** হলে equal keys এর relative order change হতে পারে।

Example:

```text
Before sorting by marks:
(A, 80), (B, 90), (C, 80), (D, 70)

Stable sort by marks:
(D, 70), (A, 80), (C, 80), (B, 90)

A এবং C দুজনের marks 80।
Stable sort এ A আগে ছিল, তাই sorted result এও A আগে।
```

### Why does stability matter when sorting objects with multiple keys?

Stability useful যখন multiple key দিয়ে sort করতে হয়। যেমন first by name, then by marks, অথবা first by secondary key, then stable sort by primary key।

Example:

```text
Students:
Name   Dept
Rahim  CSE
Karim  EEE
Asha   CSE
Nila   EEE

যদি আগে Name sort করি, তারপর stable sort by Dept করি:
CSE group এর ভিতরে name order preserved থাকবে।
EEE group এর ভিতরেও name order preserved থাকবে।
```

C++ এ stable sorting:

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Student {
    string name;
    int marks;
};

int main() {
    vector<Student> students = {
        {"A", 80},
        {"B", 90},
        {"C", 80},
        {"D", 70}
    };

    stable_sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        return a.marks < b.marks;
    });

    for (auto s : students) {
        cout << s.name << " " << s.marks << endl;
    }

    return 0;
}
```

### Which common algorithms are stable, and which are not?

| Stable algorithms | Unstable algorithms |
|---|---|
| Bubble Sort | Selection Sort |
| Insertion Sort | Quick Sort |
| Merge Sort | Heap Sort |
| Counting Sort possible | C++ `sort` not guaranteed stable |
| Radix Sort if stable sub-sort used |  |

C++:
- `sort()` is not stable, but fast
- `stable_sort()` preserves equal element order

```cpp
sort(v.begin(), v.end());
stable_sort(v.begin(), v.end());
```


## 93. How does quicksort work, and what is its worst-case time complexity?

**Quick Sort** divide-and-conquer algorithm। একটা **pivot** choose করা হয়, তারপর array partition করা হয়:

- pivot এর চেয়ে ছোট elements এক পাশে
- pivot এর চেয়ে বড় elements অন্য পাশে
- তারপর left এবং right part recursively sort করা হয়

```text
Array: [8, 3, 1, 7, 0, 10, 2]
Pivot: 2

After partition:
[1, 0] 2 [8, 3, 7, 10]

তারপর left এবং right part recursively sort।
```

Average time `O(n log n)`, কিন্তু worst case `O(n^2)` হতে পারে যদি pivot বারবার smallest বা largest element হয়।

### How do you choose a good pivot to avoid the O(n²) worst case?

Bad pivot এ partition খুব imbalanced হয়।

```text
Sorted array: 1 2 3 4 5
যদি সবসময় last element pivot নিই:

1 2 3 4 | 5
1 2 3 | 4
1 2 | 3
...

Total work = O(n^2)
```

Good pivot strategies:
- random pivot
- median-of-three: first, middle, last এর median
- shuffle array before sorting
- introsort: recursion depth বেশি হলে heap sort এ switch করে

C++ `std::sort` implementations সাধারণত introsort ব্যবহার করে; standard algorithm নির্দিষ্ট করে না, তবে C++11 থেকে worst-case `O(n log n)` comparison guarantee করে।

Randomized quicksort:

```cpp
#include <bits/stdc++.h>
using namespace std;

int partitionLomuto(vector<int>& nums, int left, int right) {
    int pivotIndex = left + rand() % (right - left + 1);
    swap(nums[pivotIndex], nums[right]);

    int pivot = nums[right];
    int i = left;

    for (int j = left; j < right; j++) {
        if (nums[j] <= pivot) {
            swap(nums[i], nums[j]);
            i++;
        }
    }

    swap(nums[i], nums[right]);
    return i;
}

void quickSort(vector<int>& nums, int left, int right) {
    if (left >= right) return;

    int pivotIndex = partitionLomuto(nums, left, right);
    quickSort(nums, left, pivotIndex - 1);
    quickSort(nums, pivotIndex + 1, right);
}
```

### How does the "Lomuto" partition scheme differ from the "Hoare" partition scheme?

**Lomuto partition:**
- Usually last element pivot
- one pointer tracks smaller region
- simple to understand
- more swaps

```text
[ <= pivot | > pivot | unknown ... | pivot ]
```

**Hoare partition:**
- usually first/middle pivot
- two pointers from both sides move inward
- fewer swaps
- returns split point, pivot final index নাও হতে পারে

```cpp
int partitionHoare(vector<int>& nums, int left, int right) {
    int pivot = nums[left + (right - left) / 2];
    int i = left - 1;
    int j = right + 1;

    while (true) {
        do {
            i++;
        } while (nums[i] < pivot);

        do {
            j--;
        } while (nums[j] > pivot);

        if (i >= j) return j;

        swap(nums[i], nums[j]);
    }
}

void quickSortHoare(vector<int>& nums, int left, int right) {
    if (left >= right) return;

    int split = partitionHoare(nums, left, right);
    quickSortHoare(nums, left, split);
    quickSortHoare(nums, split + 1, right);
}
```

| Partition | Simpler? | Swaps | Pivot final position |
|---|---|---|---|
| Lomuto | Yes | বেশি | Yes |
| Hoare | একটু tricky | কম | Not always |


## 94. How does merge sort work, and why is it often preferred for linked lists?

**Merge Sort** divide-and-conquer algorithm:

1. Array কে দুই ভাগে split করা
2. দুই ভাগ recursively sort করা
3. দুই sorted part merge করা

```text
[8, 3, 5, 1]

Split:
[8, 3]       [5, 1]
[8] [3]      [5] [1]

Merge:
[3, 8]       [1, 5]
[1, 3, 5, 8]
```

```cpp
#include <bits/stdc++.h>
using namespace std;

void mergeParts(vector<int>& nums, int left, int mid, int right) {
    vector<int> temp;
    int i = left;
    int j = mid + 1;

    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j]) {
            temp.push_back(nums[i++]);
        } else {
            temp.push_back(nums[j++]);
        }
    }

    while (i <= mid) temp.push_back(nums[i++]);
    while (j <= right) temp.push_back(nums[j++]);

    for (int k = 0; k < (int)temp.size(); k++) {
        nums[left + k] = temp[k];
    }
}

void mergeSort(vector<int>& nums, int left, int right) {
    if (left >= right) return;

    int mid = left + (right - left) / 2;
    mergeSort(nums, left, mid);
    mergeSort(nums, mid + 1, right);
    mergeParts(nums, left, mid, right);
}
```

Linked list এ merge sort preferred কারণ:
- middle find করা slow/fast pointer দিয়ে করা যায়
- merge করার সময় node relink করা যায়, extra array লাগে না
- linked list এ random access নেই, তাই quicksort/heap sort convenient না

### Why is merge sort's time complexity always O(n log n), regardless of input order?

Merge sort সবসময় array কে half করে split করে।

```text
Levels = log n
প্রতিটি level এ total merge work = O(n)

Total = O(n log n)
```

Input sorted, reverse sorted, random যাই হোক, splitting pattern same থাকে। তাই best/average/worst সব `O(n log n)`।

### What is the space complexity of merge sort, and can it be implemented in-place?

Array merge sort সাধারণত extra `O(n)` space ব্যবহার করে, কারণ merge করার জন্য temp array লাগে।

Linked list merge sort extra array লাগে না, কারণ pointer relink করা যায়। তবে recursion stack `O(log n)` লাগে।

| Version | Time | Extra Space |
|---|---|---|
| Array merge sort | `O(n log n)` | `O(n)` |
| Linked list merge sort | `O(n log n)` | `O(log n)` recursion |
| In-place merge sort | possible but complex | `O(1)` possible, practical না |

C++ `stable_sort()` commonly merge-sort-like strategy use করে এবং stable।


## 95. What is the difference between comparison-based and non-comparison-based sorting algorithms?

**Comparison-based sorting** element compare করে order ঠিক করে। যেমন:
- Bubble Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- C++ `sort`

Comparison sort এর theoretical lower bound:

```text
O(n log n)
```

মানে comparison-based sort worst case এ এর চেয়ে asymptotically faster হতে পারে না।

**Non-comparison-based sorting** direct value/digit/count use করে। যেমন:
- Counting Sort
- Radix Sort
- Bucket Sort

এগুলো special condition এ `O(n)` এর কাছাকাছি হতে পারে।

### How does counting sort achieve O(n+k) time, and what are its limitations?

Counting sort value range ছোট হলে ভালো। প্রতিটি value কতবার এসেছে সেটা count array তে store করা হয়।

```text
nums = [4, 2, 2, 8, 3, 3, 1]
range 1..8

count[1] = 1
count[2] = 2
count[3] = 2
count[4] = 1
count[8] = 1

Output: 1 2 2 3 3 4 8
```

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> countingSort(vector<int>& nums) {
    int mn = *min_element(nums.begin(), nums.end());
    int mx = *max_element(nums.begin(), nums.end());
    int range = mx - mn + 1;

    vector<int> count(range, 0);

    for (int x : nums) {
        count[x - mn]++;
    }

    vector<int> sorted;
    for (int i = 0; i < range; i++) {
        while (count[i] > 0) {
            sorted.push_back(i + mn);
            count[i]--;
        }
    }

    return sorted;
}
```

**Time Complexity**: `O(n + k)`
**Space Complexity**: `O(k)`

Limitations:
- range `k` অনেক বড় হলে memory waste
- floating point/string direct sort করা যায় না
- negative values handle করতে offset লাগে
- stable version বানাতে prefix sum লাগে

### How does radix sort work, and when is it preferable to comparison-based sorts?

**Radix Sort** digit by digit sort করে। সাধারণত least significant digit থেকে most significant digit পর্যন্ত stable counting sort ব্যবহার করা হয়।

Example:

```text
nums = [170, 45, 75, 90, 802, 24, 2, 66]

Sort by ones digit
Sort by tens digit
Sort by hundreds digit

Final: [2, 24, 45, 66, 75, 90, 170, 802]
```

```cpp
#include <bits/stdc++.h>
using namespace std;

void countingSortByDigit(vector<int>& nums, int exp) {
    int n = nums.size();
    vector<int> output(n);
    vector<int> count(10, 0);

    for (int x : nums) {
        int digit = (x / exp) % 10;
        count[digit]++;
    }

    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (int i = n - 1; i >= 0; i--) {
        int digit = (nums[i] / exp) % 10;
        output[count[digit] - 1] = nums[i];
        count[digit]--;
    }

    nums = output;
}

void radixSort(vector<int>& nums) {
    int mx = *max_element(nums.begin(), nums.end());

    for (int exp = 1; mx / exp > 0; exp *= 10) {
        countingSortByDigit(nums, exp);
    }
}
```

Radix sort preferable যখন:
- integers/string-like fixed length keys sort করতে হবে
- range/digit count controlled
- stable linear-ish sort দরকার


## 96. When would you use heap sort over quicksort or merge sort?

**Heap Sort** heap data structure ব্যবহার করে sorting করে। Max-heap build করে বারবার maximum element end এ পাঠানো হয়।

Steps:

```text
1. Build max-heap
2. Swap root with last element
3. Heap size reduce
4. Heapify-down root
5. Repeat
```

Example:

```text
Initial: [4, 10, 3, 5, 1]
Max-heap: [10, 5, 3, 4, 1]

Extract 10 -> end
Extract 5 -> before 10
...
Sorted: [1, 3, 4, 5, 10]
```

Use heap sort when:
- worst-case `O(n log n)` guarantee দরকার
- extra memory `O(1)` রাখতে হবে
- stability দরকার নেই
- recursion depth issue avoid করতে চাই

C++ STL heap sort:

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

### What are the trade-offs of heap sort in terms of stability and cache performance?

| বিষয় | Heap Sort |
|---|---|
| Time | always `O(n log n)` |
| Extra space | `O(1)` |
| Stable | No |
| Cache locality | Quick sort এর চেয়ে often worse |
| Practical speed | অনেক ক্ষেত্রে quicksort/introsort faster |

Heap sort random index jump করে parent-child relation maintain করে, তাই cache locality quicksort এর মতো ভালো না। তবে memory কম লাগা এবং worst-case guarantee এর জন্য heap sort useful।



## 97. How does binary search work, and what are its prerequisites?

**Binary Search** sorted/monotonic search space এ target খোঁজার algorithm। প্রতিবার middle element check করে search space অর্ধেক করে।

Prerequisite:
- array sorted হতে হবে, অথবা
- answer space monotonic হতে হবে

```text
nums = [1, 3, 5, 7, 9, 11]
target = 7

mid = 5 -> target bigger, go right
mid = 9 -> target smaller, go left
mid = 7 -> found
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int binarySearch(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}
```

### Why must the input be sorted (or have some monotonic property) for binary search to work?

Binary search decision নেয়:

```text
target যদি nums[mid] থেকে বড় হয়, তাহলে left half বাদ
target যদি nums[mid] থেকে ছোট হয়, তাহলে right half বাদ
```

এই বাদ দেওয়া correct হবে তখনই যখন order/monotonic property আছে।

Monotonic example:

```text
false false false true true true
```

এখানে first `true` খোঁজার জন্য binary search করা যায়, যদিও এটা normal sorted number array না।

### What is the time complexity of binary search, and how does it compare to linear search?

| Search | Time | Requirement |
|---|---|---|
| Linear Search | `O(n)` | কোনো order লাগে না |
| Binary Search | `O(log n)` | sorted/monotonic |

Binary search প্রতি step এ search space half করে:

```text
n -> n/2 -> n/4 -> n/8 -> ... -> 1
steps = log2(n)
```

C++ STL:

```cpp
bool exists = binary_search(nums.begin(), nums.end(), target);
auto it = lower_bound(nums.begin(), nums.end(), target);
```


## 98. How would you perform binary search on a rotated sorted array?

Rotated sorted array হলো sorted array কে কোনো pivot এ rotate করা।

```text
Sorted:  [1, 2, 3, 4, 5, 6, 7]
Rotated: [4, 5, 6, 7, 1, 2, 3]
```

Binary search still possible, কারণ প্রতিবার অন্তত একটা half sorted থাকে।

### How do you determine which half of the array is sorted at each step?

At every step:
- যদি `nums[left] <= nums[mid]`, তাহলে left half sorted
- নাহলে right half sorted

তারপর target সেই sorted half এর range এ পড়ে কিনা check করি।

```cpp
#include <bits/stdc++.h>
using namespace std;

int searchRotated(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}
```

**Example:**

```text
nums = [4, 5, 6, 7, 0, 1, 2]
target = 0

mid = 7, left half [4,5,6,7] sorted, target নেই
go right
found 0
```

### How would your approach change if the array contains duplicate values?

Duplicates থাকলে `nums[left] == nums[mid] == nums[right]` হলে কোন half sorted বোঝা যায় না। তখন boundary shrink করতে হয়।

```cpp
bool searchRotatedWithDuplicates(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return true;

        if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
            left++;
            right--;
        } else if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return false;
}
```

Without duplicates: `O(log n)`
With duplicates: worst case `O(n)`


## 99. What is the difference between "search for exact value" and "search for boundary" (lower bound/upper bound) binary search variants?

**Exact value search** target আছে কিনা খোঁজে।
**Boundary search** target বা condition এর first/last valid position খোঁজে।

Common boundary functions:

```text
lower_bound: first index where nums[i] >= target
upper_bound: first index where nums[i] > target
```

Example:

```text
nums = [1, 2, 2, 2, 3, 5]
target = 2

lower_bound = index 1
upper_bound = index 4
last occurrence = upper_bound - 1 = index 3
count of 2 = upper_bound - lower_bound = 3
```

C++ STL:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 2, 2, 3, 5};
    int target = 2;

    int lb = lower_bound(nums.begin(), nums.end(), target) - nums.begin();
    int ub = upper_bound(nums.begin(), nums.end(), target) - nums.begin();

    cout << "First index: " << lb << endl;
    cout << "Last index: " << ub - 1 << endl;
    cout << "Count: " << ub - lb << endl;

    return 0;
}
```

### How would you find the first and last occurrence of a target value in a sorted array?

Manual binary search দিয়ে first/last occurrence:

```cpp
int firstOccurrence(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    int ans = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] >= target) {
            if (nums[mid] == target) ans = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return ans;
}

int lastOccurrence(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    int ans = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] <= target) {
            if (nums[mid] == target) ans = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return ans;
}
```

Boundary binary search template:

```cpp
int firstTrue(int n) {
    int left = 0;
    int right = n;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (condition(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}
```

**Important:** `condition(mid)` must be monotonic:

```text
false false false true true true
```


## 100. How would you search in an array of unknown or infinite size?

যদি array size জানা না থাকে, তাহলে direct binary search এর `right` boundary জানা যায় না। তাই আগে range বের করতে হয়।

Idea:
1. Start with range `[0, 1]`
2. যতক্ষণ `arr[right] < target`, range double করা
3. তারপর ঐ range এর মধ্যে binary search

এটা **Exponential Search**।

```text
target = 20

Check index 1
Check index 2
Check index 4
Check index 8

যখন arr[right] >= target, তখন left..right range এ binary search।
```

### How would you use exponential search combined with binary search?

Interview style API ধরে নেওয়া যাক:

```text
get(i) returns value at index i
যদি index out of bound হয়, INF return করে
```

```cpp
#include <bits/stdc++.h>
using namespace std;

class ArrayReader {
    vector<int> nums;

public:
    ArrayReader(vector<int> arr) : nums(arr) {}

    int get(int index) {
        if (index >= (int)nums.size()) return INT_MAX;
        return nums[index];
    }
};

int searchUnknownSize(ArrayReader& reader, int target) {
    int left = 0;
    int right = 1;

    while (reader.get(right) < target) {
        left = right + 1;
        right *= 2;
    }

    while (left <= right) {
        int mid = left + (right - left) / 2;
        int value = reader.get(mid);

        if (value == target) return mid;
        if (value < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}
```

**Time Complexity**: `O(log p)`
এখানে `p` হলো target এর position। কারণ boundary double করতে `O(log p)`, তারপর binary search `O(log p)`।


## 101. What is ternary search, and when might it be useful?

**Ternary Search** এমন search technique যা unimodal function/array এর maximum বা minimum খুঁজতে ব্যবহার করা হয়।

Unimodal মানে:
- আগে increasing, তারপর decreasing; peak আছে
- অথবা আগে decreasing, তারপর increasing; valley আছে

```text
Peak type:
1 3 6 9 7 4 2
      ^
    maximum

Valley type:
9 7 4 2 5 8
      ^
    minimum
```

Binary search যেখানে sorted/monotonic space এ কাজ করে, ternary search সেখানে unimodal search space এ কাজ করে।

### How does ternary search compare to binary search in terms of efficiency, and why is binary search usually preferred?

Ternary search প্রতি step এ দুইটা mid নেয়:

```text
mid1 = left + (right - left) / 3
mid2 = right - (right - left) / 3
```

তারপর function value compare করে one-third বাদ দেয়।

For maximum in unimodal function:

```text
if f(mid1) < f(mid2), maximum right side এ
else maximum left side এ
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int ternarySearchMax(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;

    while (right - left > 3) {
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;

        if (nums[mid1] < nums[mid2]) {
            left = mid1 + 1;
        } else {
            right = mid2 - 1;
        }
    }

    int bestIndex = left;
    for (int i = left; i <= right; i++) {
        if (nums[i] > nums[bestIndex]) {
            bestIndex = i;
        }
    }

    return bestIndex;
}
```

**Efficiency comparison:**

| Search | Each step removes | Comparisons | Use case |
|---|---|---|---|
| Binary Search | half | usually 1 | sorted/monotonic |
| Ternary Search | one-third | usually 2 | unimodal max/min |

Binary search usually preferred কারণ:
- simpler
- fewer comparisons
- sorted/monotonic problems বেশি common
- many peak-search problems binary-search-like logic দিয়েও solve করা যায়

Continuous function এর জন্য ternary search:

```cpp
double f(double x) {
    return -(x - 3) * (x - 3) + 10; // maximum at x = 3
}

double ternarySearchDouble(double left, double right) {
    for (int iter = 0; iter < 100; iter++) {
        double mid1 = left + (right - left) / 3.0;
        double mid2 = right - (right - left) / 3.0;

        if (f(mid1) < f(mid2)) {
            left = mid1;
        } else {
            right = mid2;
        }
    }

    return (left + right) / 2.0;
}
```
