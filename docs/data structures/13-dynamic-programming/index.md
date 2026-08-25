---
sidebar_position: 14
title: 'Dynamic Programming'
---

## 📐 79. What is dynamic programming, and when should it be applied?

একই subproblem বারবার এলে এবং optimal substructure থাকলে DP ব্যবহার করা হয়। Top-down memoization recursion + cache; bottom-up tabulation ছোট state থেকে বড় state তৈরি করে। Divide and conquer-এর subproblem সাধারণত overlap করে না।

```cpp title="Complete example: top-down and bottom-up Fibonacci"
#include <bits/stdc++.h>
using namespace std;

long long topDown(int n, vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = topDown(n - 1, memo) + topDown(n - 2, memo);
}

long long bottomUp(int n) {
    if (n <= 1) return n;
    long long previous = 0, current = 1;
    for (int i = 2; i <= n; ++i) {
        long long next = previous + current;
        previous = current;
        current = next;
    }
    return current;
}

int main() {
    int n = 10;
    vector<long long> memo(n + 1, -1);
    cout << "Top-down: " << topDown(n, memo) << '\n';
    cout << "Bottom-up: " << bottomUp(n) << '\n';
    return 0;
}
```

**Sample output**
```text
Top-down: 55
Bottom-up: 55
```

## 🧱 80. What are optimal substructure and overlapping subproblems?

**Optimal substructure:** optimal answer ছোট state-এর optimal answer দিয়ে তৈরি হয়। **Overlapping subproblems:** একই state বারবার আসে। State, transition, base case ও evaluation order নির্ধারণ করাই DP design-এর মূল ধাপ।

শুধু overlap থাকলেই DP বাধ্যতামূলক নয়—কখনো closed-form formula বা আরো direct algorithm থাকতে পারে। DP useful হয় যখন reusable state-এর সংখ্যা manageable এবং transition সেগুলো থেকে answer তৈরি করতে পারে।

```cpp title="Complete example: minimum cost to reach the top"
#include <bits/stdc++.h>
using namespace std;

int minCostClimbingStairs(const vector<int>& cost) {
    int twoBack = 0, oneBack = 0;
    for (int i = 2; i <= (int)cost.size(); ++i) {
        int current = min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
        twoBack = oneBack;
        oneBack = current;
    }
    return oneBack;
}

int main() {
    vector<int> cost{10, 15, 20};
    cout << "Minimum cost: " << minCostClimbingStairs(cost) << '\n';
    return 0;
}
```

**Sample output**
```text
Minimum cost: 15
```

Time `O(n)`, space `O(1)`।

## 🎒 81. How would you solve the classic 0/1 knapsack problem?

`dp[w]` হলো capacity `w`-তে সর্বোচ্চ value। প্রতিটি item একবারই নিতে weight-কে ডান থেকে বাঁয়ে iterate করতে হয়।

```cpp title="Complete example: space-optimized 0/1 knapsack"
#include <bits/stdc++.h>
using namespace std;

int knapsack(const vector<int>& weight, const vector<int>& value, int capacity) {
    if (weight.size() != value.size() || capacity < 0)
        throw invalid_argument("Mismatched items or negative capacity");
    if (any_of(weight.begin(), weight.end(), [](int w) { return w <= 0; }))
        throw invalid_argument("Weights must be positive");
    vector<int> dp(capacity + 1, 0);
    for (int i = 0; i < (int)weight.size(); ++i)
        for (int w = capacity; w >= weight[i]; --w)
            dp[w] = max(dp[w], dp[w - weight[i]] + value[i]);
    return dp[capacity];
}

int main() {
    vector<int> weight{1, 3, 4, 5}, value{1, 4, 5, 7};
    cout << "Maximum value: " << knapsack(weight, value, 7) << '\n';
    return 0;
}
```

**Sample output**
```text
Maximum value: 9
```

Time `O(nW)`, space `O(W)`।

Full 2D table-এ `dp[i][w]` মানে প্রথম `i`টি item ব্যবহার করে capacity `w`-তে maximum value; dimensions `(n+1) × (W+1)`। 1D version একই previous row reuse করে space `O(W)` করেছে।

## 📏 82. How does the Longest Common Subsequence (LCS) problem work?

Character সমান হলে diagonal state-এর সঙ্গে 1 যোগ হয়; না হলে top ও left-এর maximum নেওয়া হয়। Table থেকে পিছনে হেঁটে actual subsequence পাওয়া যায়।

```cpp title="Complete example: LCS length and sequence"
#include <bits/stdc++.h>
using namespace std;

string lcs(const string& a, const string& b) {
    vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1));
    for (int i = 1; i <= (int)a.size(); ++i)
        for (int j = 1; j <= (int)b.size(); ++j)
            dp[i][j] = a[i - 1] == b[j - 1]
                ? dp[i - 1][j - 1] + 1 : max(dp[i - 1][j], dp[i][j - 1]);

    string answer;
    int i = a.size(), j = b.size();
    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) { answer += a[i - 1]; --i; --j; }
        else if (dp[i - 1][j] >= dp[i][j - 1]) --i;
        else --j;
    }
    reverse(answer.begin(), answer.end());
    return answer;
}

int main() {
    string answer = lcs("ABCBDAB", "BDCAB");
    cout << "LCS: " << answer << "\nLength: " << answer.size() << '\n';
    return 0;
}
```

**Sample output**
```text
LCS: BCAB
Length: 4
```

Time ও space `O(mn)`।

LCS deletion-only edit relation দেয়: দুই string-কে একই করতে minimum deletion সংখ্যা `m + n - 2·LCS`। General edit distance insertion/deletion/replacement-এর আলাদা DP transition ব্যবহার করে।

## 📈 83. How do you approach the Longest Increasing Subsequence (LIS) problem?

`tails[k]`-এ length `k+1` increasing subsequence-এর ক্ষুদ্রতম শেষ value রাখা হয়। `lower_bound` ব্যবহারে `O(n log n)` time পাওয়া যায়।

```cpp title="Complete example: O(n log n) LIS"
#include <bits/stdc++.h>
using namespace std;

int lisLength(const vector<int>& numbers) {
    vector<int> tails;
    for (int number : numbers) {
        auto position = lower_bound(tails.begin(), tails.end(), number);
        if (position == tails.end()) tails.push_back(number);
        else *position = number;
    }
    return tails.size();
}

int main() {
    vector<int> numbers{10, 9, 2, 5, 3, 7, 101, 18};
    cout << "LIS length: " << lisLength(numbers) << '\n';
    return 0;
}
```

**Sample output**
```text
LIS length: 4
```

Classic `O(n²)` DP-তে `dp[i] = 1 + max(dp[j])` for every `j < i` যেখানে `numbers[j] < numbers[i]`; `tails` version length দ্রুত দেয়, তবে `tails` নিজে actual LIS sequence নয়।

## 💰 84. How is the coin change problem solved using DP?

Minimum-coins variant minimum count রাখে; number-of-ways variant count যোগ করে। Coin reuse করা যায় বলে এটি unbounded knapsack-এর উদাহরণ।

```cpp title="Complete example: both coin-change variants"
#include <bits/stdc++.h>
using namespace std;

int minimumCoins(const vector<int>& coins, int amount) {
    if (amount < 0 || any_of(coins.begin(), coins.end(), [](int c) { return c <= 0; }))
        throw invalid_argument("Amount must be non-negative and coins positive");
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int value = 1; value <= amount; ++value)
        for (int coin : coins)
            if (coin <= value) dp[value] = min(dp[value], dp[value - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}

long long numberOfWays(const vector<int>& coins, int amount) {
    if (amount < 0 || any_of(coins.begin(), coins.end(), [](int c) { return c <= 0; }))
        throw invalid_argument("Amount must be non-negative and coins positive");
    vector<long long> dp(amount + 1);
    dp[0] = 1;
    for (int coin : coins)
        for (int value = coin; value <= amount; ++value)
            dp[value] += dp[value - coin];
    return dp[amount];
}

int main() {
    vector<int> coins{1, 2, 5};
    cout << "Minimum coins for 5: " << minimumCoins(coins, 5) << '\n';
    cout << "Ways to make 5: " << numberOfWays(coins, 5) << '\n';
    return 0;
}
```

**Sample output**
```text
Minimum coins for 5: 1
Ways to make 5: 4
```

## 🛣️ 85. How would you solve grid-based DP problems?

`dp[r][c]`-কে cell `(r,c)` পর্যন্ত best answer ধরা হয়। নিচে obstacle এড়িয়ে unique path count করা হয়েছে; obstacle cell-এর state শূন্য।

```cpp title="Complete example: unique paths with obstacles"
#include <bits/stdc++.h>
using namespace std;

long long uniquePaths(const vector<vector<int>>& grid) {
    if (grid.empty() || grid[0].empty()) return 0;
    int rows = grid.size(), columns = grid[0].size();
    for (const auto& row : grid)
        if (static_cast<int>(row.size()) != columns)
            throw invalid_argument("Grid must be rectangular");
    vector<long long> dp(columns, 0);
    dp[0] = grid[0][0] == 0;
    for (int row = 0; row < rows; ++row) {
        for (int column = 0; column < columns; ++column) {
            if (grid[row][column] == 1) dp[column] = 0;
            else if (column > 0) dp[column] += dp[column - 1];
        }
    }
    return dp.back();
}

int main() {
    vector<vector<int>> grid{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}};
    cout << "Unique paths: " << uniquePaths(grid) << '\n';
    return 0;
}
```

**Sample output**
```text
Unique paths: 2
```

Time `O(rows × columns)`, space `O(columns)`।

## 🗺️ Concept diagrams

### DP decision flow

```text
Does the problem have optimal substructure?
                  │
                  ▼ yes
Do subproblems overlap?
      │                       │
      ▼ yes                   ▼ no
Dynamic Programming     Divide and Conquer
      │
      ├── Top-down: recursion + memo
      └── Bottom-up: iterative table
```

### 0/1 knapsack transition

```text
For item i and capacity w:

                 ┌─ skip item i ── dp[i-1][w]
dp[i][w] = max ──┤
                 └─ take item i ── value[i] + dp[i-1][w-weight[i]]

1D optimization: iterate w from W down to weight[i]
                 (prevents taking the same item twice)
```

### LCS table dependency

```text
                 text B →
              ""  B  D  C  A  B
text A  ""    0   0  0  0  0  0
   ↓     A     0   0  0  0  1  1
         B     0   1  1  1  1  2
         C     0   1  1  2  2  2

match    : ↖ + 1
not match: max(↑, ←)
```

### Grid DP dependency

```text
Start ──→ [1] ──→ [1]
  │         │         │
  ▼         ▼         ▼
 [1]       [X]       [1]    X = obstacle
  │                   │
  ▼                   ▼
 [1] ──→ [1] ──→    [2]    answer = top + left
```
