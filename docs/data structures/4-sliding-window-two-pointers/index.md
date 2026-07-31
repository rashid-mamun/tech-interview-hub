---
sidebar_position: 4
title: 'Sliding Window & Two Pointers'
---

## 🪟 16. What is the sliding window technique, and what types of problems is it suited for?

**Sliding Window** হলো একটা technique যেখানে array/string এর উপর একটা **contiguous window (range)** maintain করা হয়, এবং সেই window কে ধীরে ধীরে **slide (সরানো)** করা হয় — প্রতিবার পুরো subarray/substring আবার থেকে recalculate না করে, শুধু window এর boundary (start/end) update করে result বের করা হয়।

এটা এই ধরনের সমস্যায় suited:
- **Contiguous subarray/substring** নিয়ে কাজ করা সমস্যা (যেমন maximum sum subarray of size k)
- যেখানে **brute force** এ প্রতিটি subarray আলাদাভাবে calculate করতে হতো (`O(n²)` বা তার বেশি)
- সমস্যায় একটা **"window" এর property** (sum, count, distinct elements ইত্যাদি) track করার প্রয়োজন হয়

**Sliding window visual idea:**

```text
arr = [2, 1, 5, 1, 3, 2], k = 3

Window 1:
[2, 1, 5] 1  3  2
sum = 8

Window 2:
 2 [1, 5, 1] 3  2
remove 2, add 1
sum = 8 - 2 + 1 = 7

Window 3:
 2  1 [5, 1, 3] 2
remove 1, add 3
sum = 7 - 1 + 3 = 9

প্রতিবার পুরো sum আবার calculate করা লাগছে না।
```

---

### What is the difference between a fixed-size sliding window and a variable-size (dynamic) sliding window?

**Fixed-size Sliding Window**: window এর size **আগে থেকেই নির্দিষ্ট** (constant, যেমন `k`)। window এক ধাপ ডানে সরে গেলে, একটা element যোগ হয় এবং একটা element বাদ যায়, size সবসময় একই থাকে।

**উদাহরণ: Maximum sum of subarray of size k**

```text
arr = [2, 1, 5, 1, 3, 2], k = 3

Window            Sum
[2, 1, 5]          8
   [1, 5, 1]       7
      [5, 1, 3]    9  <- maximum
         [1, 3, 2] 6

Answer = 9
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int maxSumFixedWindow(vector<int>& arr, int k) {
    int n = arr.size();
    int windowSum = 0;

    // প্রথম window এর sum বের করা
    for (int i = 0; i < k; i++)
        windowSum += arr[i];

    int maxSum = windowSum;

    // Window slide করা: একটা element যোগ, একটা বাদ
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }

    return maxSum;
}

int main() {
    vector<int> arr = {2, 1, 5, 1, 3, 2};
    int k = 3;
    cout << "Maximum sum of size " << k << " subarray: " 
         << maxSumFixedWindow(arr, k) << endl;
    return 0;
}
```
**Sample Output:**
```
Maximum sum of size 3 subarray: 9
```
(কারণ subarray `[5, 1, 3]` এর sum সবচেয়ে বেশি = 9)

**Variable-size (Dynamic) Sliding Window**: window এর size **fixed না**, বরং একটা নির্দিষ্ট condition (যেমন sum ≥ target, বা distinct character এর সংখ্যা) satisfy করার জন্য window কে dynamically **grow বা shrink** করা হয়। এই ধরনের সমস্যায় সাধারণত দুইটা pointer (`left`, `right`) ব্যবহার করা হয় যেগুলো independently move করে।

```text
Variable-size example:
target = 7
arr = [2, 3, 1, 2, 4, 3]

right move করে window grow:
[2, 3, 1, 2] sum = 8 valid

left move করে shrink:
remove 2 -> [3, 1, 2] sum = 6 invalid

আবার right grow করবে।
```

---

### How does the sliding window technique reduce time complexity from O(n²) to O(n)?

**Brute force approach**: প্রতিটি সম্ভাব্য subarray এর জন্য আলাদা করে sum (বা অন্য কোনো property) calculate করা হয়। এতে outer loop (starting point) এবং inner loop (sum calculate করার জন্য) মিলিয়ে `O(n²)` (বা তার বেশি) সময় লাগে।

**Sliding window এর মূল insight**: যখন window এক ধাপ সরে যায় (যেমন `left` বা `right` boundary এক ঘর move করে), তখন window এর content এ **সামান্য পরিবর্তন** হয় (একটা element add হয়, একটা remove হয়)। তাই পুরো window আবার recalculate না করে, **আগের calculation এর উপর ভিত্তি করে** (incremental update) নতুন window এর result বের করা যায়।

**Complexity comparison diagram:**

```text
Brute force:
start=0: check 0..0, 0..1, 0..2, ...
start=1: check 1..1, 1..2, 1..3, ...
start=2: check 2..2, 2..3, ...

অনেক subarray বারবার calculate হয় -> O(n^2)

Sliding window:
left  moves: 0 -> 1 -> 2 -> ...
right moves: 0 -> 1 -> 2 -> ...

প্রতিটি element at most add once, remove once -> O(n)
```

এর ফলে প্রতিটি element মাত্র **constant বার** (সাধারণত একবার `right` pointer দিয়ে যোগ হওয়ার সময়, এবং একবার `left` pointer দিয়ে বাদ যাওয়ার সময়) process হয়, ফলে total complexity `O(n)` তে নেমে আসে — যেখানে প্রতিটি element সর্বোচ্চ দুইবার visited হয় (once by each pointer)।

---

## 👉👈 17. How does the two-pointer technique work, and what conditions make it applicable?

**Two-pointer technique** এ দুইটা pointer (index) ব্যবহার করা হয় যেগুলো array/string এর মধ্যে **বিভিন্ন দিক থেকে বা বিভিন্ন গতিতে** move করে, একটা নির্দিষ্ট condition খুঁজে বের করার জন্য। সাধারণত brute-force nested loop (`O(n²)`) এর বদলে একটা single pass এ (`O(n)`) সমস্যা সমাধান করা যায়।

**Applicable হওয়ার conditions:**
- Array/string যদি **sorted** থাকে (বা sorted করা যায়), তাহলে two-pointer খুব কার্যকর হয়
- সমস্যায় যদি **pair বা triplet** খুঁজতে হয় যা একটা নির্দিষ্ট condition satisfy করে (sum, difference ইত্যাদি)
- **In-place** modification প্রয়োজন হয় এমন সমস্যায় (duplicate remove করা, partition করা)

দুইটা সাধারণ pattern:
1. **Opposite direction pointers** (`left` শুরু থেকে, `right` শেষ থেকে) — sorted array তে pair খোঁজার জন্য
2. **Same direction pointers** (দুইটাই শুরু থেকে, কিন্তু ভিন্ন গতিতে move করে) — in-place array modification এর জন্য

**Opposite direction pointer diagram:**

```text
sorted arr = [1, 3, 4, 5, 7, 10, 11]
target = 9

left                           right
  |                              |
  v                              v
[1, 3, 4, 5, 7, 10, 11]

sum = 1 + 11 = 12 > 9
right-- করে sum কমানো হবে।
```

**Same direction pointer diagram:**

```text
Remove duplicates:

arr = [1, 1, 2, 2, 3]
       ^  ^
      slow fast

fast নতুন unique value খুঁজে,
slow next write position manage করে।
```

---

### How would you solve the "two sum" problem on a sorted array using two pointers?

**সমস্যা:** একটা sorted array তে দুইটা element খুঁজে বের করতে হবে যাদের sum একটা নির্দিষ্ট `target` এর সমান।

**Two sum walkthrough:**

```text
arr = [1, 3, 4, 5, 7, 10, 11], target = 9

Step 1:
left=0 (1), right=6 (11)
sum = 12 > 9, so right--

Step 2:
left=0 (1), right=5 (10)
sum = 11 > 9, so right--

Step 3:
left=0 (1), right=4 (7)
sum = 8 < 9, so left++

Step 4:
left=1 (3), right=4 (7)
sum = 10 > 9, so right--

Step 5:
left=1 (3), right=3 (5)
sum = 8 < 9, so left++

Step 6:
left=2 (4), right=3 (5)
sum = 9 found
```

```cpp
#include <bits/stdc++.h>
using namespace std;

pair<int, int> twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return {left, right};
        } else if (currentSum < target) {
            left++;   // sum কম, তাই left বাড়িয়ে sum বাড়ানো হচ্ছে
        } else {
            right--;  // sum বেশি, তাই right কমিয়ে sum কমানো হচ্ছে
        }
    }
    return {-1, -1};  // pair পাওয়া যায়নি
}

int main() {
    vector<int> arr = {1, 3, 4, 5, 7, 10, 11};
    int target = 9;

    pair<int, int> result = twoSum(arr, target);
    if (result.first != -1) {
        cout << "Pair found at indices: " << result.first << ", " << result.second << endl;
        cout << "Values: " << arr[result.first] << " + " << arr[result.second] 
             << " = " << target << endl;
    } else {
        cout << "No pair found." << endl;
    }
    return 0;
}
```
**Sample Output:**
```
Pair found at indices: 1, 4
Values: 3 + 7 = 9
```

**Time Complexity**: `O(n)` (single pass, প্রতিটি pointer সর্বোচ্চ n বার move করে)
**Space Complexity**: `O(1)`

**কেন কাজ করে:** যেহেতু array sorted, `left` বাড়ালে sum বাড়ে এবং `right` কমালে sum কমে। তাই প্রতিটি ধাপে আমরা logically সঠিক দিকে move করছি, কোনো সম্ভাবনা miss করছি না।

---

### How is the two-pointer technique used to remove duplicates from a sorted array in place?

**Walkthrough:**

```text
arr = [1, 1, 2, 2, 2, 3, 4, 4, 5]

slow = 0 points to last unique position
fast scans the array

Initial:
[1, 1, 2, 2, 2, 3, 4, 4, 5]
 ^  ^
 s  f

fast sees 1, same as arr[slow], skip

fast sees 2:
slow++ and write 2
[1, 2, 2, 2, 2, 3, 4, 4, 5]
    ^  ^
    s  f

fast sees 3:
[1, 2, 3, 2, 2, 3, 4, 4, 5]
       ^
       s

Final first part:
[1, 2, 3, 4, 5, ...]
newLength = 5
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int removeDuplicates(vector<int>& arr) {
    if (arr.empty()) return 0;

    int slow = 0;  // unique elements এর শেষ position track করে

    for (int fast = 1; fast < arr.size(); fast++) {
        if (arr[fast] != arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
    }
    return slow + 1;  // unique elements এর সংখ্যা
}

int main() {
    vector<int> arr = {1, 1, 2, 2, 2, 3, 4, 4, 5};
    int newLength = removeDuplicates(arr);

    cout << "New length: " << newLength << endl;
    cout << "Array after removing duplicates: ";
    for (int i = 0; i < newLength; i++)
        cout << arr[i] << " ";
    cout << endl;
    return 0;
}
```
**Sample Output:**
```
New length: 5
Array after removing duplicates: 1 2 3 4 5
```

এখানে `slow` pointer হলো "write pointer" (যেখানে পরবর্তী unique element বসবে), এবং `fast` pointer পুরো array traverse করে নতুন unique element খুঁজে বের করে। যখনই `fast` position এ একটা নতুন (আগের থেকে different) value পাওয়া যায়, `slow` কে এক ঘর এগিয়ে সেই value সেখানে বসিয়ে দেওয়া হয়।

**Time Complexity**: `O(n)` **Space Complexity**: `O(1)` (in-place, কোনো extra array লাগেনি)

---

## 🔤 18. How would you find the longest substring without repeating characters?

এই সমস্যায় **variable-size sliding window** এবং একটা **hash map/set** ব্যবহার করে character এর last-seen position track করা হয়।

**Example walkthrough (`s = "abcabcbb"`):**

```text
right reads characters one by one.

right=0, char=a
window: [a]
maxLength = 1

right=1, char=b
window: [a b]
maxLength = 2

right=2, char=c
window: [a b c]
maxLength = 3

right=3, char=a
a already seen at index 0 inside current window
move left from 0 to 1
window: [b c a]
maxLength still 3

right=4, char=b
b seen at index 1, move left to 2
window: [c a b]

answer = 3
```

**Window boundary view:**

```text
s = a b c a b c b b
    0 1 2 3 4 5 6 7

Before duplicate a:
left=0, right=3
[a b c a]
 ^     ^
 L     R

After handling duplicate:
left=1, right=3
 a [b c a]
    ^   ^
    L   R
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastSeen;  // character -> last seen index
    int maxLength = 0;
    int left = 0;  // window এর start

    for (int right = 0; right < s.length(); right++) {
        char c = s[right];

        // যদি এই character আগে দেখা গেছে এবং current window এর মধ্যেই আছে
        if (lastSeen.find(c) != lastSeen.end() && lastSeen[c] >= left) {
            left = lastSeen[c] + 1;  // window কে shrink করে duplicate এর পরে নিয়ে যাওয়া
        }

        lastSeen[c] = right;  // current position update করা
        maxLength = max(maxLength, right - left + 1);
    }

    return maxLength;
}

int main() {
    string s = "abcabcbb";
    cout << "Length of longest substring without repeating characters: " 
         << lengthOfLongestSubstring(s) << endl;
    return 0;
}
```
**Sample Output:**
```
Length of longest substring without repeating characters: 3
```
(কারণ `"abc"` হলো সবচেয়ে বড় substring যেখানে কোনো repeating character নেই, length = 3)

**কীভাবে কাজ করে (step-by-step logic):**
- `right` pointer প্রতিবার এক ঘর করে এগিয়ে string traverse করে
- প্রতিটি character এর **last seen index** একটা hashmap এ store করা হয়
- যদি current character আগে দেখা গিয়ে থাকে এবং সেই position current window এর মধ্যেই থাকে (`lastSeen[c] >= left`), তাহলে `left` pointer কে সেই duplicate এর ঠিক পরের position এ নিয়ে যাওয়া হয় (window shrink করা)
- প্রতিটি ধাপে window এর current length (`right - left + 1`) দিয়ে `maxLength` update করা হয়

---

**Time এবং Space Complexity কত?**

- **Time Complexity**: `O(n)` — কারণ `right` pointer পুরো string এ একবার iterate করে, এবং `left` pointer ও সর্বোচ্চ `n` বার move করতে পারে (প্রতিটি pointer সর্বোচ্চ n বার), তাই total কাজ `O(n)`
- **Space Complexity**: `O(min(n, k))` — যেখানে `k` হলো character set এর size (যেমন English lowercase এর জন্য 26, ASCII এর জন্য 128)। Hashmap এ সর্বোচ্চ `min(n, k)` টা entry থাকতে পারে।

---

## 📊 19. How would you find the smallest subarray with a sum greater than or equal to a target value?

এখানেও **variable-size sliding window** ব্যবহার করা হয় — window কে **grow** করা হয় (right বাড়িয়ে) যতক্ষণ না sum target এ পৌঁছায়, এবং **shrink** করা হয় (left বাড়িয়ে) যতক্ষণ sum target এর সমান বা বেশি থাকে (minimum length খোঁজার জন্য)।

**Example diagram:**

```text
target = 7
arr = [2, 3, 1, 2, 4, 3]

Valid windows:
[2, 3, 1, 2] sum = 8, length = 4
   [3, 1, 2, 4] sum = 10, length = 4
      [1, 2, 4] sum = 7, length = 3
            [4, 3] sum = 7, length = 2  <- minimum

Answer = 2
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int minSubArrayLen(int target, vector<int>& arr) {
    int n = arr.size();
    int left = 0, sum = 0;
    int minLength = INT_MAX;

    for (int right = 0; right < n; right++) {
        sum += arr[right];  // window grow করা (right বাড়ানো)

        // যতক্ষণ sum >= target, window shrink করে minimum length বের করার চেষ্টা
        while (sum >= target) {
            minLength = min(minLength, right - left + 1);
            sum -= arr[left];
            left++;
        }
    }

    return (minLength == INT_MAX) ? 0 : minLength;
}

int main() {
    vector<int> arr = {2, 3, 1, 2, 4, 3};
    int target = 7;

    int result = minSubArrayLen(target, arr);
    cout << "Length of smallest subarray with sum >= " << target << ": " << result << endl;
    return 0;
}
```
**Sample Output:**
```
Length of smallest subarray with sum >= 7: 2
```
(কারণ subarray `[4, 3]` এর sum = 7, এবং এটা এই condition satisfy করা সবচেয়ে ছোট subarray, length = 2)

---

### How does the sliding window shrink and grow based on the running sum?

**Grow phase**: `right` pointer প্রতিবার এক ঘর এগিয়ে array traverse করে এবং সেই element কে `sum` এ যোগ করে (window এর size বাড়ে, sum বাড়ে)।

**Shrink phase**: যখনই current `sum >= target` হয়ে যায়, তখন আমরা জানি এই window টা condition satisfy করছে। এখন আমরা চেষ্টা করি window কে **যতটা সম্ভব ছোট** করতে — তাই `left` pointer কে এগিয়ে নিয়ে (এবং সংশ্লিষ্ট element `sum` থেকে বাদ দিয়ে) window shrink করতে থাকি, যতক্ষণ পর্যন্ত `sum >= target` condition বজায় থাকে। প্রতিবার shrink করার আগে current window length দিয়ে answer update করা হয়।

**Grow/shrink walkthrough:**

```text
target = 7
arr = [2, 3, 1, 2, 4, 3]

right=0: [2] sum=2
right=1: [2,3] sum=5
right=2: [2,3,1] sum=6
right=3: [2,3,1,2] sum=8 valid, length=4

shrink:
remove 2 -> [3,1,2] sum=6 invalid

right=4: [3,1,2,4] sum=10 valid, length=4
shrink:
remove 3 -> [1,2,4] sum=7 valid, length=3
remove 1 -> [2,4] sum=6 invalid

right=5: [2,4,3] sum=9 valid, length=3
shrink:
remove 2 -> [4,3] sum=7 valid, length=2
remove 4 -> [3] sum=3 invalid

Answer = 2, subarray [4,3]
```

এই grow-shrink cycle এর মাধ্যমে আমরা প্রতিটি সম্ভাব্য valid window এর মধ্যে **সবচেয়ে ছোট** টা খুঁজে বের করি, বিনা কোনো subarray কে explicitly পুনরায় calculate না করেই।

**Time Complexity**: `O(n)` — যদিও দুইটা nested loop দেখতে মনে হচ্ছে, কিন্তু `left` pointer সব মিলিয়ে সর্বোচ্চ `n` বার move করে (প্রতিটি element সর্বোচ্চ একবার `left` দিয়ে remove হয়), তাই total কাজ `O(n)`।
**Space Complexity**: `O(1)`

---

## 🎯 20. How would you solve the "minimum window substring" problem?

**সমস্যা:** একটা string `s` এবং একটা string `t` দেওয়া আছে। `s` এর মধ্যে সবচেয়ে ছোট window (substring) খুঁজে বের করতে হবে যেটাতে `t` এর সব character (তাদের frequency সহ) অন্তর্ভুক্ত আছে।

এখানেও **variable-size sliding window** ব্যবহার করা হয়, কিন্তু এবার দুইটা hashmap (বা একটা array + counter) দিয়ে window এর মধ্যে কোন character "needed" এবং কোনটা "satisfied" সেটা track করা হয়।

**Example target:**

```text
s = "ADOBECODEBANC"
t = "ABC"

Need:
A:1, B:1, C:1

Goal:
s এর smallest substring যেখানে A, B, C সব আছে।
Answer: "BANC"
```

**Window walkthrough (high level):**

```text
Expand right until window valid:

A D O B E C
^         ^
L         R

Window = "ADOBEC", contains A, B, C
formed == required
answer candidate = "ADOBEC"

Now shrink left:
remove A করলে A missing হয়ে যাবে, so stop.

Continue expanding:
... B A N C
    ^     ^
    L     R

Window = "BANC", contains A, B, C
length = 4, better answer.
```

**Need vs window table:**

```text
t = "ABC"

need:
A -> 1
B -> 1
C -> 1

window = "BANC"

window count:
B -> 1
A -> 1
N -> 1
C -> 1

A, B, C requirement satisfied, N extra থাকলেও problem নেই।
```

```cpp
#include <bits/stdc++.h>
using namespace std;

string minWindow(string s, string t) {
    if (s.empty() || t.empty()) return "";

    unordered_map<char, int> need;   // t এর প্রতিটি character এর প্রয়োজনীয় frequency
    for (char c : t) need[c]++;

    unordered_map<char, int> window; // current window এর character frequency
    int required = need.size();      // কতগুলো distinct character satisfy করতে হবে
    int formed = 0;                  // কতগুলো distinct character এখন পর্যন্ত satisfy হয়েছে

    int left = 0, minLen = INT_MAX, minStart = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s[right];
        window[c]++;

        // যদি এই character এর current frequency ঠিক প্রয়োজনীয় frequency এর সমান হয়ে যায়
        if (need.count(c) && window[c] == need[c]) {
            formed++;
        }

        // window valid (সব character satisfied) হলে shrink করার চেষ্টা করা
        while (left <= right && formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }

            char leftChar = s[left];
            window[leftChar]--;
            if (need.count(leftChar) && window[leftChar] < need[leftChar]) {
                formed--;  // এই character আর satisfied নেই
            }
            left++;
        }
    }

    return (minLen == INT_MAX) ? "" : s.substr(minStart, minLen);
}

int main() {
    string s = "ADOBECODEBANC";
    string t = "ABC";

    string result = minWindow(s, t);
    cout << "Minimum window substring: \"" << result << "\"" << endl;
    return 0;
}
```
**Sample Output:**
```
Minimum window substring: "BANC"
```

---

### How do you track which characters are "needed" vs. "satisfied" within the window?

এই সমস্যায় দুইটা মূল data structure ব্যবহার হয়:

1. **`need` hashmap**: `t` string এ প্রতিটি character কতবার প্রয়োজন সেটা store করে — এটা **fixed**, পুরো process এ পরিবর্তন হয় না।

2. **`window` hashmap**: current window এর মধ্যে প্রতিটি character কতবার আছে সেটা track করে — এটা dynamically পরিবর্তিত হয় যখন `left`/`right` pointer move করে।

3. **`formed` counter**: এটা track করে কতগুলো **distinct character** এর frequency তাদের `need` এর frequency এর সাথে (বা তার বেশি) মিলে গেছে — অর্থাৎ কতগুলো character এর requirement **"satisfied"** হয়ে গেছে।

4. **`required`**: `t` তে মোট কতগুলো distinct character আছে (এটা হলো `formed` এর target value — যখন `formed == required`, তখন window এ `t` এর সব character এর প্রয়োজনীয়তা পূরণ হয়ে গেছে)।

**Logic flow:**
- `right` pointer এগিয়ে গিয়ে নতুন character window এ যোগ করে; যদি সেই character এর frequency ঠিক `need` এর সমান হয়ে যায়, `formed++` করা হয়
- যখন `formed == required` (window valid), তখন `left` pointer এগিয়ে window **shrink** করার চেষ্টা করা হয় — প্রতিটি shrink এর আগে current window এর length দিয়ে answer (minimum length) update করা হয়
- shrink করার সময় যদি কোনো character এর frequency `need` এর নিচে নেমে যায়, তাহলে সেটা আর "satisfied" থাকে না, তাই `formed--` করা হয় এবং shrinking বন্ধ হয়ে যায় (আবার `right` বাড়াতে হয়)

**Time Complexity**: `O(|s| + |t|)` — `t` থেকে `need` map বানাতে `O(|t|)`, এবং `s` এর উপর `right` এবং `left` pointer মিলিয়ে total `O(|s|)` কাজ হয় (প্রতিটি character সর্বোচ্চ দুইবার visited — once by right, once by left)

**Space Complexity**: `O(|s| + |t|)` (worst case এ, hashmap গুলোর জন্য, যদিও character set fixed থাকলে এটা `O(1)` ও ধরা যায়)
