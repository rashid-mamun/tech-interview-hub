---
sidebar_position: 1
title: 'Complexity Analysis'
---


## 1. What is Big-O notation and why is it important?


Big-O notation হলো একটি mathematical notation যা কোনো algorithm এর **time complexity** বা **space complexity** কে input size (সাধারণত `n` দিয়ে denote করা হয়) এর function হিসেবে প্রকাশ করে। এটা মূলত algorithm এর **growth rate** measure করে — অর্থাৎ input size বাড়লে execution time বা memory usage কতটা বাড়বে সেটা বোঝায়।

গুরুত্বপূর্ণ কারণ:
- এটা আমাদের **hardware-independent** এবং **implementation-independent** ভাবে algorithm এর efficiency compare করতে সাহায্য করে
- Large input size এর ক্ষেত্রে algorithm কেমন behave করবে সেটা predict করা যায় (worst-case scenario বোঝা যায়)
- একই সমস্যার different solution এর মধ্যে কোনটা better সেটা decide করতে সাহায্য করে
- Interview এবং real-world system design এ scalability বোঝার জন্য essential

**Growth rate example:**

```text
n = 1,000,000 হলে roughly:

O(1)        -> 1 operation
O(log n)    -> around 20 operations
O(n)        -> 1,000,000 operations
O(n log n)  -> around 20,000,000 operations
O(n^2)      -> 1,000,000,000,000 operations

এই কারণেই বড় input এ complexity difference huge হয়ে যায়।
```

**Common Big-O order:**

```text
fastest
O(1)
O(log n)
O(n)
O(n log n)
O(n^2)
O(2^n)
O(n!)
slowest
```


### What is the difference between Big-O, Big-Theta (Θ), and Big-Omega (Ω)?

এই তিনটি notation আসলে algorithm এর complexity এর **different bounds** বোঝায়:

- **Big-O (O)** — এটা **upper bound** নির্দেশ করে। মানে algorithm সর্বোচ্চ কতটা সময় নিতে পারে (worst-case)। উদাহরণ: `O(n²)` মানে algorithm এর growth rate n² এর বেশি হবে না।

- **Big-Omega (Ω)** — এটা **lower bound** নির্দেশ করে। মানে algorithm সর্বনিম্ন কতটা সময় নেবে (best-case)। উদাহরণ: `Ω(n)` মানে algorithm কমপক্ষে n সময় নেবেই।

- **Big-Theta (Θ)** — এটা **tight bound**, অর্থাৎ upper এবং lower bound দুটোই একসাথে। যখন কোনো algorithm এর best-case এবং worst-case complexity একই হয়, তখন Θ notation ব্যবহার করা হয়। উদাহরণ: `Θ(n log n)` মানে algorithm এর complexity ঠিক n log n এর কাছাকাছি, কম-বেশি হবে না।

সহজভাবে বললে: **O = worst case, Ω = best case, Θ = average/exact bound (both upper and lower)।**

> **Precision note:** `O`, `Ω`, এবং `Θ` যথাক্রমে asymptotic upper, lower, এবং tight bound; এগুলো নিজেরা worst, best, বা average case বোঝায় না। Best/average/worst হলো কোন input-case analyze করা হচ্ছে, আর notation হলো সেই case-এর growth bound। যেমন linear search-এর worst-case runtime `Θ(n)`, কিন্তু সেটি একই সঙ্গে `O(n²)`-ও—যদিও `O(n²)` tight নয়।

Practical world এ আমরা প্রায়ই "Big-O" বলি কিন্তু আসলে "Big-Theta" বোঝাই, কারণ industry তে সাধারণত tight bound নিয়েই আলোচনা হয়।

**Bound diagram:**

```text
runtime
  ^
  |
  |          upper bound: Big-O
  |        /
  |      /     actual runtime
  |    /      /
  |  /      /
  |/______/________________> n
       lower bound: Big-Omega

যদি upper এবং lower দুটো একই growth rate এ tight হয়,
তখন সেটাকে Big-Theta বলা হয়।
```


### How do you calculate the time complexity of nested loops?

Nested loop এর ক্ষেত্রে সাধারণ rule হলো প্রতিটি loop এর complexity **multiply** করা।

```cpp
for (int i = 0; i < n; i++) {        // O(n)
    for (int j = 0; j < n; j++) {    // O(n)
        cout << i << " " << j << endl; // O(1)
    }
}
```
এখানে outer loop `n` বার চলে এবং প্রতিটি iteration এ inner loop আবার `n` বার চলে, তাই total complexity = `O(n) × O(n) = O(n²)`।

**Iteration grid:**

```text
n = 4

        j=0  j=1  j=2  j=3
i=0     x    x    x    x
i=1     x    x    x    x
i=2     x    x    x    x
i=3     x    x    x    x

Total = 4 * 4 = 16 = n^2
```

কিছু variation:

1. **Independent nested loops** (উপরের example এর মতো) → `O(n × m)` যদি দুটো loop এর range আলাদা হয় (n এবং m)।

2. **Dependent nested loops** (inner loop এর range outer loop এর উপর depend করে):
```cpp
for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
        cout << i << " " << j << endl;
    }
}
```
এখানে total iterations = `1 + 2 + 3 + ... + n = n(n+1)/2`, যা simplify করলে দাঁড়ায় `O(n²)`।

```text
n = 5

i=0:
i=1: x
i=2: x x
i=3: x x x
i=4: x x x x

Total = 0 + 1 + 2 + 3 + 4 = n(n-1)/2 = O(n^2)
```

3. **Logarithmic nested loop**:
```cpp
for (int i = 0; i < n; i++) {
    int j = 1;
    while (j < n) {
        j *= 2;
    }
}
```
এখানে complexity হবে `O(n log n)`।

**মূল কথা:** নেস্টেড লুপে প্রতিটি লেভেলের iteration count বের করে সেগুলো multiply করলেই মূল complexity পাওয়া যায়।

> **Precision note:** শুধু independent loop bound হলে iteration count সরাসরি multiply করা যায়। Inner bound যদি outer variable-এর উপর নির্ভর করে, তাহলে summation দিয়ে মোট iteration হিসাব করতে হয়—যেমন triangular loop-এ `Σi = n(n-1)/2`।


### What is amortized time complexity, and can you give an example?

Amortized time complexity বলতে বোঝায় — কোনো operation এর কিছু individual call এ বেশি সময় লাগলেও, বহুবার call করলে **average cost per operation** কম থাকে। এটা worst-case এর চেয়ে আলাদা, কারণ এখানে আমরা একটা sequence of operations এর overall (total) cost বিবেচনা করি, single operation নয়।

**Classic উদাহরণ: Dynamic Array (যেমন Python এর `list` বা Java এর `ArrayList`) তে `append` operation**

- সাধারণত `append` করা হলে time complexity `O(1)` হয় (array তে খালি জায়গায় element বসানো)।
- কিন্তু যখন array full হয়ে যায়, তখন নতুন (সাধারণত দ্বিগুণ size এর) array allocate করে সব পুরনো element copy করতে হয় — যেটা `O(n)` সময় নেয়।
- যদিও কিছু নির্দিষ্ট `append` call এ `O(n)` সময় লাগে, কিন্তু **n টা append operation** করলে total cost হয় `O(n)`, তাই **average (amortized) cost per operation = O(1)**।

এই কারণে dynamic array এর `append` কে amortized `O(1)` বলা হয়, যদিও worst-case (resize হওয়ার সময়) এ এটা `O(n)`।

**Amortized resize timeline:**

```text
capacity starts at 1

push 1: [1]                  cost 1
push 2: resize 1 -> 2        copy 1 + insert
push 3: resize 2 -> 4        copy 2 + insert
push 4: no resize            cost 1
push 5: resize 4 -> 8        copy 4 + insert
...

Total copy cost:
1 + 2 + 4 + 8 + ... < 2n

n pushes এর total cost O(n),
so per push amortized O(1)
```


## 2. What is space complexity, and how is it different from time complexity?

**Space complexity** হলো একটা algorithm চালাতে input size এর function হিসেবে কতটুকু **memory (RAM)** প্রয়োজন হয় তার measurement। অন্যদিকে **time complexity** measure করে algorithm সম্পন্ন করতে কতটা **execution time (steps/operations)** লাগে।

মূল পার্থক্য:
- Time complexity → **সময়** (CPU operations count) নিয়ে কথা বলে
- Space complexity → **memory** (variables, data structures, call stack ইত্যাদির জন্য ব্যবহৃত জায়গা) নিয়ে কথা বলে

কখনো কখনো একটা algorithm এ **time-space tradeoff** থাকে — অর্থাৎ কম time নিতে গেলে বেশি space লাগতে পারে (যেমন memoization/caching), আবার কম space ব্যবহার করলে time বেশি লাগতে পারে।

**Time vs space example:**

```text
Two Sum problem:

Approach 1: nested loop
Time: O(n^2)
Space: O(1)

Approach 2: hash map
Time: O(n)
Space: O(n)

আমরা extra memory use করে time কমালাম।
```


### What is the difference between auxiliary space and total space complexity?

- **Total Space Complexity** = Input data store করতে যে space লাগে + Algorithm চালানোর জন্য যে extra space লাগে (দুটোর যোগফল)।

- **Auxiliary Space** = শুধুমাত্র algorithm চালানোর জন্য প্রয়োজনীয় **extra (temporary) space**, input data এর space বাদ দিয়ে। এর মধ্যে temporary variables, recursion stack, নতুন তৈরি করা data structures ইত্যাদি অন্তর্ভুক্ত থাকে।

উদাহরণ: **Merge Sort** এর ক্ষেত্রে input array এর জন্য `O(n)` space লাগে, কিন্তু merging এর জন্য আলাদা temporary array লাগে যেটাও `O(n)`। এখানে:
- Total space complexity = `O(n)` (input) + `O(n)` (auxiliary) = `O(n)`
- Auxiliary space complexity = `O(n)` (শুধু temporary array এর জন্য)

Interview এ সাধারণত **auxiliary space** নিয়েই বেশি প্রশ্ন করা হয়, কারণ এটাই algorithm এর প্রকৃত "extra cost" দেখায়।

**Diagram:**

```text
Input array:
[5, 2, 4, 1]     -> input space

Merge temp array:
[ ,  ,  ,  ]     -> auxiliary space

Total space = input + auxiliary
Auxiliary space = only extra temp memory
```


### How does recursion affect space complexity through the call stack?

যখন কোনো function recursively call হয়, তখন প্রতিটি call এর জন্য একটা নতুন **stack frame** তৈরি হয় যেটা call stack এ push হয়। এই stack frame এ local variables, parameters, এবং return address store থাকে। যতক্ষণ পর্যন্ত function return না করে, ততক্ষণ এই frame stack এ থেকে যায়।

উদাহরণ:
```cpp
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
```
এখানে `factorial(n)` কল করলে মোট `n` টা recursive call হবে, এবং প্রতিটি call এর জন্য একটা করে stack frame তৈরি হবে। তাই **space complexity = O(n)**, যদিও প্রতিটি individual call এ constant space লাগছে।

**Call stack diagram for `factorial(4)`:**

```text
factorial(4)
  -> factorial(3)
      -> factorial(2)
          -> factorial(1)
              -> factorial(0)

Maximum stack depth = 5 calls = O(n)

Call stack at deepest point:
top -> factorial(0)
       factorial(1)
       factorial(2)
       factorial(3)
       factorial(4)
```

তুলনায়, একই কাজ **iterative** ভাবে (loop দিয়ে) করলে space complexity হয় `O(1)`, কারণ কোনো call stack তৈরি হয় না।

এই কারণে deep recursion এ **stack overflow** হওয়ার ঝুঁকি থাকে, এবং অনেক ক্ষেত্রে **tail recursion optimization** বা iterative approach ব্যবহার করে এই space cost কমানো হয়।


## 3. What is the difference between best-case, average-case, and worst-case complexity?

- **Best-case complexity**: সবচেয়ে favorable input এর জন্য algorithm এর performance। যেমন — array আগে থেকেই sorted থাকলে linear search এ প্রথম element এ target পেয়ে যাওয়া (`O(1)`)।

- **Average-case complexity**: সব সম্ভাব্য input এর উপর expected (গড়) performance। এটা calculate করতে সাধারণত **probability distribution** বিবেচনা করতে হয়।

- **Worst-case complexity**: সবচেয়ে unfavorable input এর জন্য algorithm এর performance। যেমন — linear search এ target element একদম শেষে থাকা বা না থাকা (`O(n)`)।

**Linear search example:**

```text
arr = [10, 20, 30, 40, 50]

Best case:
target = 10
check first element -> O(1)

Worst case:
target = 50 or target not present
check all elements -> O(n)

Average case:
target random position এ থাকলে average প্রায় n/2 checks -> O(n)
```


### Why do interviewers usually focus on worst-case complexity?

কয়েকটা কারণে:

1. **Guarantee/Reliability**: Worst-case complexity একটা algorithm এর **upper bound guarantee** দেয় — অর্থাৎ যেকোনো input এর জন্য algorithm কখনোই এর চেয়ে বেশি সময় নেবে না। এটা একটা **safe এবং predictable** measurement।

2. **Real-world critical systems**: Real-time systems, financial systems, বা safety-critical applications এ average performance যথেষ্ট না — worst-case এ system কেমন behave করবে সেটা জানা জরুরি (যেমন একটা medical device বা stock trading system কখনোই unexpectedly slow হতে পারে না)।

3. **Average-case measure করা কঠিন**: Average-case complexity বের করতে input distribution সম্পর্কে assumption লাগে, যেটা বাস্তবে সবসময় accurate নাও হতে পারে। Worst-case এর জন্য এমন assumption লাগে না।

4. **Scalability testing**: Interview এ candidate এর algorithmic thinking এবং edge-case handling capability যাচাই করার জন্যও worst-case analysis ভালো measure।


### Can you give an example where average case differs significantly from worst case (e.g., quicksort)?

**Quicksort** এর ক্ষেত্রে এটা সবচেয়ে classic উদাহরণ:

- **Average case: `O(n log n)`** — যখন pivot selection মোটামুটি balanced partition তৈরি করে (array কে প্রায় সমান দুইভাগে ভাগ করে)।

- **Worst case: `O(n²)`** — যখন pivot বারবার সবচেয়ে ছোট বা সবচেয়ে বড় element হিসেবে select হয় (যেমন already sorted বা reverse-sorted array তে যদি সবসময় প্রথম বা শেষ element কে pivot হিসেবে নেওয়া হয়)। তখন প্রতিটি partition এ একটা subarray তে `n-1` element থাকে এবং অন্যটাতে `0` element থাকে, ফলে recursion depth `n` হয়ে যায় এবং total complexity `O(n²)` হয়ে যায়।

এই কারণেই practical implementation এ **randomized pivot selection** বা **median-of-three** technique ব্যবহার করা হয়, যাতে worst-case scenario এড়ানো যায় এবং average case এর কাছাকাছি performance পাওয়া যায়।

**Quicksort partition shape:**

```text
Good pivots:

          n
        /   \
      n/2   n/2
     / \     / \
   n/4 n/4 n/4 n/4

height = log n
each level total work = n
total = O(n log n)
```

```text
Bad pivots:

n
 \
 n-1
   \
   n-2
     \
     n-3

height = n
total = O(n^2)
```

(তুলনামূলকভাবে, **Merge Sort** এর best, average, এবং worst — সব ক্ষেত্রেই complexity `O(n log n)`, যেটা এটাকে বেশি predictable করে তোলে, যদিও এর জন্য অতিরিক্ত `O(n)` space লাগে।)


## 4. How do you analyze the time complexity of recursive algorithms?

Recursive algorithm এর complexity analyze করার জন্য সাধারণত একটা **recurrence relation** তৈরি করা হয়, যেটা প্রতিটি recursive call এর cost এবং subproblem এর সংখ্যাকে represent করে। এরপর এই recurrence relation কে solve করে closed-form complexity বের করা হয়। এটা solve করার কয়েকটা common method:

1. **Recursion Tree Method** — recursive call গুলোকে tree আকারে draw করে প্রতি level এর cost যোগ করা হয়
2. **Substitution Method** — একটা guess করে mathematical induction দিয়ে সেটা verify করা হয়
3. **Master Theorem** — নির্দিষ্ট ধরনের recurrence এর জন্য direct formula ব্যবহার করা


### What is a recurrence relation?

Recurrence relation হলো একটা equation যা কোনো function কে তার নিজের **smaller input** এর উপর define করে। এটা recursive algorithm এর time complexity কে mathematically express করার একটা way।

উদাহরণ: **Binary Search** এর recurrence relation:
```
T(n) = T(n/2) + O(1)
```
এখানে `T(n/2)` মানে হলো recursive call (input কে অর্ধেক করে), এবং `O(1)` মানে হলো প্রতি call এ constant কাজ (comparison)।

**Binary search recursion tree:**

```text
n
|
n/2
|
n/4
|
n/8
|
...
|
1

Levels = log n
cost per level = O(1)
Total = O(log n)
```

আরেকটা উদাহরণ — **Merge Sort**:
```
T(n) = 2T(n/2) + O(n)
```
এখানে `2T(n/2)` মানে দুইটা recursive call (array কে দুইভাগে ভাগ করে), এবং `O(n)` হলো merging এর cost।

```text
Merge sort recursion tree:

Level 0:          n                 cost = n
                /   \
Level 1:      n/2   n/2             cost = n
             / \     / \
Level 2:   n/4 n/4 n/4 n/4          cost = n

Total levels = log n
Total cost = n * log n = O(n log n)
```


### What is the Master Theorem and when can it be applied?

Master Theorem হলো একটা shortcut formula যা দিয়ে নির্দিষ্ট ধরনের recurrence relation সরাসরি solve করা যায়, recursion tree বা substitution method এ না গিয়ে।

এটা এই form এর recurrence এর জন্য applicable:
```
T(n) = a·T(n/b) + f(n)
```
যেখানে:
- `a` = কতগুলো subproblem তৈরি হচ্ছে (a ≥ 1)
- `n/b` = প্রতিটি subproblem এর size (b > 1)
- `f(n)` = divide এবং combine করার জন্য প্রয়োজনীয় cost

Master Theorem এ `f(n)` কে `n^(log_b a)` এর সাথে compare করে তিনটি case এ ভাগ করা হয়:

- **Case 1**: যদি `f(n) = O(n^(log_b a - ε))` হয় (f(n) ছোট) → `T(n) = Θ(n^(log_b a))`
- **Case 2**: যদি `f(n) = Θ(n^(log_b a))` হয় (সমান) → `T(n) = Θ(n^(log_b a) · log n)`
- **Case 3**: যদি `f(n) = Ω(n^(log_b a + ε))` হয় (f(n) বড়, এবং regularity condition satisfy করে) → `T(n) = Θ(f(n))`

**Limitation**: Master Theorem সব recurrence তে apply করা যায় না — শুধুমাত্র এই নির্দিষ্ট form এবং condition গুলো satisfy করলেই কাজ করে। যেমন `T(n) = T(n-1) + T(n-2)` (Fibonacci এর মতো recurrence) তে এটা apply করা যায় না, কারণ এটা `a·T(n/b)` form এ নেই।

**Examples:**

```text
Binary Search:
T(n) = 1T(n/2) + O(1)
a = 1, b = 2
n^(log_b a) = n^(log_2 1) = n^0 = 1
f(n) = 1
Case 2 -> T(n) = O(log n)
```

```text
Merge Sort:
T(n) = 2T(n/2) + O(n)
a = 2, b = 2
n^(log_b a) = n^(log_2 2) = n
f(n) = n
Case 2 -> T(n) = O(n log n)
```


### How would you compute the complexity of a recursive Fibonacci function vs. its memoized version?

**Naive Recursive Fibonacci:**
```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```
এর recurrence relation: `T(n) = T(n-1) + T(n-2) + O(1)`

এখানে প্রতিটি call দুইটা নতুন call তৈরি করছে, এবং একই subproblem বারবার (redundantly) calculate হচ্ছে (যেমন `fib(3)` কে বহুবার call করা হবে বিভিন্ন branch থেকে)। এই recursion কে tree আকারে দেখলে দেখা যায় এটা exponentially বাড়ে। এর time complexity হলো **`O(2ⁿ)`** (আরো precisely `O(φⁿ)` যেখানে φ = golden ratio ≈ 1.618, কিন্তু সাধারণত `O(2ⁿ)` বলা হয়)।

**Naive Fibonacci recursion tree:**

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   └── fib(1)
│   └── fib(2)
└── fib(3)
    ├── fib(2)
    └── fib(1)

fib(3), fib(2) বারবার calculate হচ্ছে।
```

Space complexity এখানে `O(n)`, কারণ call stack এর maximum depth `n`।

**Memoized (Dynamic Programming) Fibonacci:**
```cpp
int fibMemo(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];

    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}
```
এখানে আমরা প্রতিটি subproblem এর result একবার calculate করে একটা **cache (memo dictionary)** তে store করে রাখি, ফলে একই subproblem দ্বিতীয়বার calculate করার প্রয়োজন হয় না।

```text
Memo table:

fib(0), fib(1), fib(2), fib(3), fib(4), fib(5)
প্রতিটা value একবার calculate হয়, তারপর cache থেকে return হয়।
```

যেহেতু `fib(0)` থেকে `fib(n)` পর্যন্ত প্রতিটি unique value ঠিক একবার করে calculate হয় (constant time এ, cache lookup সহ), তাই time complexity কমে দাঁড়ায় **`O(n)`**।

Space complexity এখানে `O(n)` — memo dictionary store করার জন্য, প্লাস call stack এর জন্যও `O(n)`।

**সংক্ষেপে:**

| Version | Time Complexity | Space Complexity |
|---|---|---|
| Naive Recursive | `O(2ⁿ)` | `O(n)` |
| Memoized | `O(n)` | `O(n)` |

এটা দেখায় যে **memoization** (একটা classic **time-space tradeoff** technique) কীভাবে exponential time কে linear time এ নামিয়ে আনতে পারে, সামান্য extra space এর বিনিময়ে।

## Complete complexity demonstration

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    const int n = 5;
    int constantOperations = 0, linearOperations = 0, quadraticOperations = 0;
    ++constantOperations;
    for (int i = 0; i < n; ++i) ++linearOperations;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j) ++quadraticOperations;

    cout << "O(1) operations: " << constantOperations << '\n';
    cout << "O(n) operations: " << linearOperations << '\n';
    cout << "O(n^2) operations: " << quadraticOperations << '\n';
    return 0;
}
```

**Sample output**

```text
O(1) operations: 1
O(n) operations: 5
O(n^2) operations: 25
```

### Growth-rate diagram

```text
Operations
   ▲                         O(2ⁿ)
   │                    O(n²)
   │                O(n log n)
   │             O(n)
   │        O(log n)
   │  O(1)
   └──────────────────────────────► input size n
```

### Recursive-space diagram

```text
┌──────────────┐
│ recursive(0) │ ← base case
├──────────────┤
│ recursive(1) │
├──────────────┤
│ recursive(2) │
├──────────────┤
│ recursive(3) │
└──────────────┘

n active frames → O(n) auxiliary space
```
