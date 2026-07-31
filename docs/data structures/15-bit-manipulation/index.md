---
sidebar_position: 15
title: 'Bit Manipulation'
---


## ⚙️ 102. What are the common bitwise operators, and what are typical use cases for each?

**Bit Manipulation** হলো integer এর binary representation এর উপর সরাসরি operation করা। Interview problem এ এটা খুব useful, কারণ অনেক কাজ `O(1)` বা খুব কম memory দিয়ে করা যায়।

Common bitwise operators:

| Operator | Name | কাজ |
|---|---|---|
| `&` | AND | দুই bit-ই `1` হলে result `1` |
| `|` | OR | যেকোনো এক bit `1` হলে result `1` |
| `^` | XOR | দুই bit আলাদা হলে result `1` |
| `~` | NOT | bit flip করে, `0` কে `1`, `1` কে `0` |
| `<<` | Left shift | bit বামে সরায়, power of two দিয়ে multiply এর মতো |
| `>>` | Right shift | bit ডানে সরায়, power of two দিয়ে divide এর মতো |

**Example:**

```text
a = 5  = 0101
b = 3  = 0011

a & b  = 0001 = 1
a | b  = 0111 = 7
a ^ b  = 0110 = 6
```

Typical use cases:
- কোনো bit set/check/clear/toggle করা
- even/odd check করা
- power of two check করা
- set bit count করা
- subset generate করা
- state compression DP
- permission flags বা feature flags store করা

### How do AND, OR, XOR, NOT, left shift, and right shift behave at the bit level?

**AND (`&`)**: দুটো bit-ই `1` হলে `1`।

```text
  0101
& 0011
------
  0001
```

Use case: কোনো নির্দিষ্ট bit set কিনা check করা।

```cpp
bool isBitSet(int n, int i) {
    return (n & (1 << i)) != 0;
}
```

**OR (`|`)**: যেকোনো এক bit `1` হলেই `1`।

```text
  0101
| 0011
------
  0111
```

Use case: কোনো bit set করা।

```cpp
int setBit(int n, int i) {
    return n | (1 << i);
}
```

**XOR (`^`)**: bit দুইটা আলাদা হলে `1`, same হলে `0`।

```text
  0101
^ 0011
------
  0110
```

Useful XOR properties:

```text
x ^ x = 0
x ^ 0 = x
x ^ y ^ x = y
```

Use case: duplicate pair cancel করে unique element বের করা।

**NOT (`~`)**: সব bit flip করে।

```text
 যদি 8-bit ধরে দেখি:
 5      = 00000101
~5      = 11111010
```

C++ এ signed integer এর ক্ষেত্রে `~n` negative result দিতে পারে, কারণ integer two's complement representation use করে।

**Left shift (`<<`)**: bit বামে সরায়, ডান পাশে `0` বসে।

```text
5       = 00000101
5 << 1  = 00001010 = 10
5 << 2  = 00010100 = 20
```

**Right shift (`>>`)**: bit ডানে সরায়।

```text
20      = 00010100
20 >> 1 = 00001010 = 10
20 >> 2 = 00000101 = 5
```

### How would you use bit shifting to multiply or divide by powers of two?

`n << k` roughly means `n * 2^k`।
`n >> k` roughly means `n / 2^k` for non-negative integers।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 12;

    cout << (n << 1) << endl; // 12 * 2 = 24
    cout << (n << 3) << endl; // 12 * 8 = 96

    cout << (n >> 1) << endl; // 12 / 2 = 6
    cout << (n >> 2) << endl; // 12 / 4 = 3

    return 0;
}
```

**Important note:** Negative number এর right shift language/compiler behavior অনুযায়ী tricky হতে পারে। Interview problem এ সাধারণত non-negative integer ধরে নেওয়া হয়, না হলে explicitly mention থাকে।

Common bit operations:

| কাজ | Formula |
|---|---|
| i-th bit check | `n & (1 << i)` |
| i-th bit set | `n \| (1 << i)` |
| i-th bit clear | `n & ~(1 << i)` |
| i-th bit toggle | `n ^ (1 << i)` |
| last bit check | `n & 1` |
| lowest set bit | `n & -n` |

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 10; // binary: 1010
    int i = 1;

    cout << "Original: " << bitset<8>(n) << endl;
    cout << "Set bit 2: " << bitset<8>(n | (1 << 2)) << endl;
    cout << "Clear bit 1: " << bitset<8>(n & ~(1 << 1)) << endl;
    cout << "Toggle bit 0: " << bitset<8>(n ^ (1 << 0)) << endl;
    cout << "Is bit 1 set? " << ((n & (1 << i)) != 0) << endl;

    return 0;
}
```

---

## 2️⃣ 103. How do you check if a number is a power of two using bit manipulation?

যে number power of two, তার binary representation এ exactly একটা `1` bit থাকে।

```text
1  = 0001
2  = 0010
4  = 0100
8  = 1000
16 = 10000
```

তাই কোনো positive number `n` power of two কিনা check করা যায়:

```text
n > 0 এবং (n & (n - 1)) == 0
```

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

int main() {
    vector<int> nums = {0, 1, 2, 3, 4, 8, 12, 16};

    for (int x : nums) {
        cout << x << " -> " << (isPowerOfTwo(x) ? "yes" : "no") << endl;
    }

    return 0;
}
```

**Output:**

```text
0 -> no
1 -> yes
2 -> yes
3 -> no
4 -> yes
8 -> yes
12 -> no
16 -> yes
```

### Why does `n & (n-1) == 0` work for this check?

যখন `n` থেকে `1` subtract করা হয়, তখন rightmost set bit `0` হয়ে যায় এবং তার ডানের সব bit `1` হয়ে যায়।

Power of two এর ক্ষেত্রে শুধু একটা `1` থাকে, তাই `n - 1` করলে ঐ `1` এর নিচের সব bit `1` হয়, কিন্তু original `n` এর সাথে common কোনো `1` থাকে না।

```text
n     = 8  = 1000
n - 1 = 7  = 0111

  1000
& 0111
------
  0000
```

Non-power of two:

```text
n     = 12 = 1100
n - 1 = 11 = 1011

  1100
& 1011
------
  1000  != 0
```

### What edge cases (like zero or negative numbers) need to be handled?

Edge cases:

- `0` power of two না, কিন্তু `0 & -1 = 0`, তাই `n > 0` condition লাগবে
- Negative number power of two হিসেবে ধরা হয় না
- Large number হলে overflow avoid করতে `long long` বা unsigned type consider করা যেতে পারে

```cpp
bool isPowerOfTwoLong(long long n) {
    return n > 0 && (n & (n - 1)) == 0;
}
```

**Time Complexity**: `O(1)`
**Space Complexity**: `O(1)`

---

## 🔢 104. How do you count the number of set bits (1s) in an integer's binary representation?

Set bit মানে binary representation এ যতগুলো `1` আছে। যেমন:

```text
13 = 1101
Set bits = 3
```

Simple approach হলো প্রতিটি bit check করা।

```cpp
#include <bits/stdc++.h>
using namespace std;

int countSetBitsSimple(unsigned int n) {
    int count = 0;

    while (n > 0) {
        if (n & 1) count++;
        n >>= 1;
    }

    return count;
}

int main() {
    cout << countSetBitsSimple(13) << endl;
    return 0;
}
```

**Output:**

```text
3
```

এই approach এ number of bits অনুযায়ী time লাগে। 32-bit integer হলে maximum 32 iteration।

### What is "Brian Kernighan's algorithm," and how does it improve on checking each bit individually?

**Brian Kernighan's algorithm** প্রতি iteration এ rightmost set bit remove করে।

Key formula:

```text
n = n & (n - 1)
```

Example:

```text
n = 13 = 1101

Step 1:
1101 & 1100 = 1100

Step 2:
1100 & 1011 = 1000

Step 3:
1000 & 0111 = 0000

Total steps = 3, কারণ set bit ছিল 3 টা।
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int countSetBits(unsigned int n) {
    int count = 0;

    while (n > 0) {
        n = n & (n - 1);
        count++;
    }

    return count;
}

int main() {
    cout << countSetBits(13) << endl;
    cout << countSetBits(1024) << endl;
    return 0;
}
```

**Output:**

```text
3
1
```

**Complexity:**
- Simple bit-by-bit: `O(number_of_bits)`
- Brian Kernighan: `O(number_of_set_bits)`

C++ built-in function:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    unsigned int n = 13;

    cout << __builtin_popcount(n) << endl;      // int
    cout << __builtin_popcountll(13LL) << endl; // long long

    return 0;
}
```

---

## ⊕ 105. How is XOR used to solve problems like "find the unique element in an array where every other element appears twice"?

XOR এর সবচেয়ে important properties:

```text
x ^ x = 0
x ^ 0 = x
XOR commutative and associative
```

তাই array এর সব element XOR করলে pair গুলো cancel হয়ে যায়, শুধু unique element থাকে।

**Example:**

```text
nums = [4, 1, 2, 1, 2]

4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int singleNumber(vector<int>& nums) {
    int ans = 0;

    for (int x : nums) {
        ans ^= x;
    }

    return ans;
}

int main() {
    vector<int> nums = {4, 1, 2, 1, 2};
    cout << singleNumber(nums) << endl;
    return 0;
}
```

**Output:**

```text
4
```

### Why does XOR-ing all elements together cancel out pairs?

কারণ same number XOR করলে result `0`।

```text
5 ^ 5 = 0

0101
0101
----
0000
```

আর XOR order matter করে না:

```text
a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b
```

তাই pair গুলো যেকোনো position এ থাকুক, final result unique number হবে।

### How would you extend this approach if every element appears three times except one?

যদি প্রতিটি number 3 বার আসে এবং শুধু একটা number 1 বার আসে, তাহলে simple XOR কাজ করবে না। কারণ:

```text
x ^ x ^ x = x
```

এখানে bit count approach ব্যবহার করা হয়। প্রতিটি bit position এ কতগুলো `1` আছে count করি। যেসব number 3 বার এসেছে, তাদের contribution multiple of 3 হবে। তাই `count % 3` করলে unique number এর bit পাওয়া যাবে।

```cpp
#include <bits/stdc++.h>
using namespace std;

int singleNumberWhenOthersAppearThreeTimes(vector<int>& nums) {
    int ans = 0;

    for (int bit = 0; bit < 32; bit++) {
        int count = 0;

        for (int x : nums) {
            if ((x >> bit) & 1) {
                count++;
            }
        }

        if (count % 3 != 0) {
            ans |= (1 << bit);
        }
    }

    return ans;
}

int main() {
    vector<int> nums = {2, 2, 3, 2};
    cout << singleNumberWhenOthersAppearThreeTimes(nums) << endl;
    return 0;
}
```

**Output:**

```text
3
```

**Time Complexity**: `O(32 * n) = O(n)`
**Space Complexity**: `O(1)`

Another common XOR problem: two unique numbers, others appear twice।

```cpp
vector<int> twoSingleNumbers(vector<int>& nums) {
    int xorAll = 0;
    for (int x : nums) xorAll ^= x;

    int diffBit = xorAll & -xorAll;
    int a = 0, b = 0;

    for (int x : nums) {
        if (x & diffBit) a ^= x;
        else b ^= x;
    }

    return {a, b};
}
```

Idea: unique দুইটা number এর মধ্যে যেই bit আলাদা, সেই bit দিয়ে array কে দুই group এ ভাগ করা হয়।

---

## 🎭 106. How do bitmasks help in solving subset-related problems?

**Bitmask** হলো integer এর bit ব্যবহার করে কোনো set/state represent করা। যদি set এ `n` টা element থাকে, তাহলে `n` bit এর একটা mask দিয়ে বোঝানো যায় কোন element selected।

Example:

```text
items = [A, B, C]

mask = 0 -> 000 -> {}
mask = 1 -> 001 -> {A}
mask = 2 -> 010 -> {B}
mask = 3 -> 011 -> {A, B}
mask = 4 -> 100 -> {C}
mask = 5 -> 101 -> {A, C}
mask = 6 -> 110 -> {B, C}
mask = 7 -> 111 -> {A, B, C}
```

এই technique subset generation, visited state, DP state compression, graph traversal, assignment problem ইত্যাদিতে useful।

### How would you use a bitmask to represent and iterate over all subsets of a set?

`n` টা element থাকলে total subset `2^n`। আমরা `0` থেকে `(1 << n) - 1` পর্যন্ত সব mask iterate করি।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<char> items = {'A', 'B', 'C'};
    int n = items.size();

    for (int mask = 0; mask < (1 << n); mask++) {
        cout << "{ ";

        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                cout << items[i] << " ";
            }
        }

        cout << "}" << endl;
    }

    return 0;
}
```

**Output:**

```text
{ }
{ A }
{ B }
{ A B }
{ C }
{ A C }
{ B C }
{ A B C }
```

Common bitmask operations:

| কাজ | Formula |
|---|---|
| element `i` selected কিনা | `mask & (1 << i)` |
| element `i` add করা | `mask \| (1 << i)` |
| element `i` remove করা | `mask & ~(1 << i)` |
| element `i` toggle করা | `mask ^ (1 << i)` |
| selected element count | `__builtin_popcount(mask)` |

Submask iterate করার useful pattern:

```cpp
for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
    // sub হলো mask এর একটা non-empty submask
}
```

Example:

```text
mask = 1101
submasks: 1101, 1100, 1001, 1000, 0101, 0100, 0001
```

### How is bitmasking used in DP problems like the "traveling salesman problem" (bitmask DP)?

Bitmask DP তে `mask` দিয়ে বোঝানো হয় কোন কোন node/city already visited। TSP এর classic state:

```text
dp[mask][last] = minimum cost to visit cities in mask and end at city last
```

Example:

```text
cities = 0, 1, 2, 3

mask = 0101
মানে city 0 এবং city 2 visited

dp[0101][2] = city 0 থেকে start করে city 0 এবং 2 visit করে,
              এখন city 2 তে থাকার minimum cost
```

Transition:

```text
dp[mask | (1 << next)][next]
    = min(dp[mask | (1 << next)][next],
          dp[mask][last] + dist[last][next])
```

TSP bitmask DP example:

```cpp
#include <bits/stdc++.h>
using namespace std;

int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int fullMask = (1 << n) - 1;
    const int INF = 1e9;

    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0; // city 0 থেকে start, mask 0001

    for (int mask = 0; mask <= fullMask; mask++) {
        for (int last = 0; last < n; last++) {
            if (dp[mask][last] == INF) continue;

            for (int next = 0; next < n; next++) {
                if (mask & (1 << next)) continue;

                int newMask = mask | (1 << next);
                dp[newMask][next] = min(
                    dp[newMask][next],
                    dp[mask][last] + dist[last][next]
                );
            }
        }
    }

    int ans = INF;
    for (int last = 1; last < n; last++) {
        ans = min(ans, dp[fullMask][last] + dist[last][0]);
    }

    return ans;
}

int main() {
    vector<vector<int>> dist = {
        {0, 10, 15, 20},
        {10, 0, 35, 25},
        {15, 35, 0, 30},
        {20, 25, 30, 0}
    };

    cout << tsp(dist) << endl;
    return 0;
}
```

**Output:**

```text
80
```

**Complexity:**

```text
States = 2^n * n
Transitions = n per state
Time Complexity = O(2^n * n^2)
Space Complexity = O(2^n * n)
```

এই approach brute force `O(n!)` থেকে অনেক better, কিন্তু still exponential। তাই bitmask DP সাধারণত `n <= 20` এর মতো constraints এ use করা হয়।

---
