---
sidebar_position: 12
title: 'Recursion & Backtracking'
---

## 🔁 69. What is recursion, and what are its essential components?

Recursion-এ function ছোট input দিয়ে নিজেকেই call করে। **Base case** recursion থামায় এবং **recursive case** problem ছোট করে। Base case না থাকলে stack overflow হয়। Direct recursion-এ function নিজেকে call করে; indirect recursion-এ একাধিক function পরস্পরকে call করে।

```cpp title="Complete example: factorial"
#include <bits/stdc++.h>
using namespace std;

long long factorial(int n) {
    if (n < 0) throw invalid_argument("factorial requires n >= 0");
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    cout << "5! = " << factorial(5) << '\n';
    return 0;
}
```

**Sample output**
```text
5! = 120
```

Time `O(n)`, auxiliary space `O(n)`।

## ⚙️ 70. What is the difference between recursion and iteration?

Recursion call stack এবং iteration loop ব্যবহার করে। C++ tail-call optimization-এর guarantee দেয় না, তাই tail recursion-ও stack বাড়াতে পারে।

```cpp title="Complete example: recursion vs iteration"
#include <bits/stdc++.h>
using namespace std;

long long recursiveSum(int n) {
    if (n < 0) throw invalid_argument("n must be non-negative");
    return n == 0 ? 0 : n + recursiveSum(n - 1);
}

long long iterativeSum(int n) {
    if (n < 0) throw invalid_argument("n must be non-negative");
    long long sum = 0;
    for (int i = 1; i <= n; ++i) sum += i;
    return sum;
}

int main() {
    cout << "Recursive: " << recursiveSum(10) << '\n';
    cout << "Iterative: " << iterativeSum(10) << '\n';
    return 0;
}
```

**Sample output**
```text
Recursive: 55
Iterative: 55
```

দুটির time `O(n)`; space যথাক্রমে `O(n)` ও `O(1)`।

## 🧩 71. What is backtracking, and how does it differ from plain brute force?

Backtracking-এর template হলো **choose → explore → undo**। অসম্পূর্ণ solution আর valid result দিতে পারবে না বুঝলে branch-টি prune করা হয়।

```cpp title="Complete example: target-sum combinations"
#include <bits/stdc++.h>
using namespace std;

void search(const vector<int>& a, int start, int target, vector<int>& path) {
    if (target == 0) {
        cout << '[';
        for (int i = 0; i < (int)path.size(); ++i)
            cout << (i ? " " : "") << path[i];
        cout << "]\n";
        return;
    }
    for (int i = start; i < (int)a.size(); ++i) {
        if (a[i] > target) break; // prune
        path.push_back(a[i]);
        search(a, i + 1, target - a[i], path);
        path.pop_back();
    }
}

int main() {
    vector<int> a{2, 3, 5, 7}, path;
    cout << "Combinations with sum 10:\n";
    search(a, 0, 10, path);
    return 0;
}
```

**Sample output**
```text
Combinations with sum 10:
[2 3 5]
[3 7]
```

## 👑 72. How would you solve the N-Queens problem using backtracking?

প্রতি row-তে একটি queen বসানো হয়। Column ও দুই diagonal-এর boolean array ব্যবহার করলে attack test `O(1)`।

```cpp title="Complete example: N-Queens"
#include <bits/stdc++.h>
using namespace std;

void solve(int row, vector<string>& board, vector<bool>& col,
           vector<bool>& d1, vector<bool>& d2, int& count) {
    int n = board.size();
    if (row == n) {
        cout << "Solution " << ++count << ":\n";
        for (const string& line : board) cout << line << '\n';
        return;
    }
    for (int c = 0; c < n; ++c) {
        int x = row - c + n - 1, y = row + c;
        if (col[c] || d1[x] || d2[y]) continue;
        board[row][c] = 'Q';
        col[c] = d1[x] = d2[y] = true;
        solve(row + 1, board, col, d1, d2, count);
        board[row][c] = '.';
        col[c] = d1[x] = d2[y] = false;
    }
}

int main() {
    const int n = 4;
    vector<string> board(n, string(n, '.'));
    vector<bool> col(n), d1(2 * n - 1), d2(2 * n - 1);
    int count = 0;
    solve(0, board, col, d1, d2, count);
    cout << "Total solutions: " << count << '\n';
    return 0;
}
```

**Sample output**
```text
Solution 1:
.Q..
...Q
Q...
..Q.
Solution 2:
..Q.
Q...
...Q
.Q..
Total solutions: 2
```

Worst-case upper bound প্রায় `O(n!)`; recursion/state-array space `O(n)`।

## 💭 73. How does memoization improve recursive algorithms?

Memoization top-down result cache করে; tabulation bottom-up table বানায়। Fibonacci-তে একই subproblem পুনরায় solve না করায় time `O(2^n)` থেকে `O(n)` হয়।

```cpp title="Complete example: memoized Fibonacci"
#include <bits/stdc++.h>
using namespace std;

long long fibonacci(int n, vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
}

int main() {
    int n = 10;
    vector<long long> memo(n + 1, -1);
    cout << "F(" << n << ") = " << fibonacci(n, memo) << '\n';
    return 0;
}
```

**Sample output**
```text
F(10) = 55
```

Time `O(n)`, space `O(n)`।

## 🔢 74. How would you generate permutations, combinations, or subsets?

Permutation-এ order গুরুত্বপূর্ণ, combination-এ নয়। Power set-এ প্রতিটি element include/exclude করা হয়।

```cpp title="Complete example: permutations and subsets"
#include <bits/stdc++.h>
using namespace std;

void print(const vector<int>& a) {
    cout << '{';
    for (int i = 0; i < (int)a.size(); ++i) cout << (i ? "," : "") << a[i];
    cout << "} ";
}

void permute(vector<int>& a, int pos) {
    if (pos == (int)a.size()) { print(a); return; }
    for (int i = pos; i < (int)a.size(); ++i) {
        swap(a[pos], a[i]);
        permute(a, pos + 1);
        swap(a[pos], a[i]);
    }
}

void subsets(const vector<int>& a, int pos, vector<int>& path) {
    if (pos == (int)a.size()) { print(path); return; }
    subsets(a, pos + 1, path);
    path.push_back(a[pos]);
    subsets(a, pos + 1, path);
    path.pop_back();
}

void combinations(const vector<int>& a, int start, int needed, vector<int>& path) {
    if (needed == 0) { print(path); return; }
    for (int i = start; i <= static_cast<int>(a.size()) - needed; ++i) {
        path.push_back(a[i]);
        combinations(a, i + 1, needed - 1, path);
        path.pop_back();
    }
}

int main() {
    vector<int> a{1, 2, 3}, path;
    cout << "Permutations:\n";
    permute(a, 0);
    cout << "\nCombinations of size 2:\n";
    combinations(a, 0, 2, path);
    cout << "\nSubsets:\n";
    subsets(a, 0, path);
    cout << '\n';
    return 0;
}
```

**Sample output**
```text
Permutations:
{1,2,3} {1,3,2} {2,1,3} {2,3,1} {3,2,1} {3,1,2}
Combinations of size 2:
{1,2} {1,3} {2,3}
Subsets:
{} {3} {2} {2,3} {1} {1,3} {1,2} {1,2,3}
```

Permutation time `O(n·n!)`; power-set time `O(n·2^n)` including printing।

## 🗺️ Concept diagrams

### Recursive call stack

```text
factorial(4)
└── 4 × factorial(3)
        └── 3 × factorial(2)
                └── 2 × factorial(1)
                        └── 1  ← base case

Return: 1 → 2 → 6 → 24
Stack : push calls ↓   ↑ pop calls
```

### Backtracking decision tree

```text
                         []
                    choose / \ skip
                         1
                  [1]         []
                /    \       /  \
             [1,2]   [1]   [2]  []
              / \     / \   / \  / \
             include/exclude element 3

At every node: choose → explore → undo
Invalid branch: prune immediately
```

### N-Queens state

```text
Board            Occupied lookup arrays
. Q . .          column[1] = true
. . . Q          diagonal1[row-col+n-1]
Q . . .          diagonal2[row+col]
. . Q .

Each safety check = O(1)
```

### Memoization flow

```text
          F(5)
       /        \
    F(4)        F(3) ── cache hit
   /    \
 F(3)  F(2)

Without cache: repeated subtrees
With cache   : each F(i) computed once
```
