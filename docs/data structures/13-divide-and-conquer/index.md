---
sidebar_position: 13
title: 'Divide and Conquer'
---

## 🪓 75. What is the divide and conquer paradigm, and what are its three main steps?

Divide and conquer problem-কে independent ছোট subproblem-এ ভাগ করে, সেগুলো recursively solve করে এবং result combine করে। তিনটি ধাপ:

1. **Divide:** problem-কে ছোট অংশে ভাগ করা
2. **Conquer:** base case পর্যন্ত অংশগুলো solve করা
3. **Combine:** ছোট result মিলিয়ে final result তৈরি করা

Merge sort-এ array half করা হলো divide, দুই half sort করা conquer, এবং sorted half merge করা combine। DP-এর সঙ্গে পার্থক্য হলো divide-and-conquer subproblem সাধারণত independent; overlapping হলে DP cache ব্যবহার করে repeated work এড়ায়।

```cpp title="Complete example: merge sort"
#include <bits/stdc++.h>
using namespace std;

void mergeParts(vector<int>& values, int left, int middle, int right) {
    vector<int> merged;
    int first = left, second = middle + 1;
    while (first <= middle && second <= right) {
        if (values[first] <= values[second]) merged.push_back(values[first++]);
        else merged.push_back(values[second++]);
    }
    while (first <= middle) merged.push_back(values[first++]);
    while (second <= right) merged.push_back(values[second++]);
    copy(merged.begin(), merged.end(), values.begin() + left);
}

void mergeSort(vector<int>& values, int left, int right) {
    if (left >= right) return;
    int middle = left + (right - left) / 2;
    mergeSort(values, left, middle);
    mergeSort(values, middle + 1, right);
    mergeParts(values, left, middle, right);
}

int main() {
    vector<int> values{8, 3, 5, 1, 9, 2};
    mergeSort(values, 0, static_cast<int>(values.size()) - 1);
    for (int value : values) cout << value << ' ';
    cout << '\n';
    return 0;
}
```

**Sample output**

```text
1 2 3 5 8 9
```

```text
                  [8 3 5 1]
                 /         \
Divide        [8 3]       [5 1]
              /   \       /   \
Conquer     [8]   [3]   [5]   [1]
              \   /       \   /
Combine       [3 8]       [1 5]
                 \         /
                  [1 3 5 8]
```

## 📐 76. What is the Master Theorem, and how is it used?

`T(n) = aT(n/b) + f(n)` recurrence-এ `a` subproblem-এর সংখ্যা, `n/b` প্রতিটির size এবং `f(n)` divide/combine cost। Merge sort-এর জন্য `a=2`, `b=2`, `f(n)=Θ(n)`। যেহেতু `n^(log_b a)=n`, Master Theorem case 2 অনুযায়ী `T(n)=Θ(n log n)`।

```cpp title="Complete example: recursion-level work"
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 8;
    int levels = 0;
    for (int size = n; size > 1; size /= 2) {
        cout << "Level " << levels << ": total merge work = " << n << '\n';
        ++levels;
    }
    cout << "Levels: " << levels << "\nTotal proportional work: " << n * levels << '\n';
    return 0;
}
```

**Sample output**

```text
Level 0: total merge work = 8
Level 1: total merge work = 8
Level 2: total merge work = 8
Levels: 3
Total proportional work: 24
```

```text
T(n) = 2T(n/2) + n

Level 0:  1 problem  × n work       = n
Level 1:  2 problems × n/2 work     = n
Level 2:  4 problems × n/4 work     = n
...
log₂n levels × n work = Θ(n log n)
```

## 📈 77. How does divide and conquer solve maximum subarray sum?

Maximum subarray সম্পূর্ণ left half-এ, সম্পূর্ণ right half-এ, অথবা midpoint cross করে—এই তিনটির maximum answer। Crossing sum midpoint থেকে দুইদিকে best sum নেয়। এই solution `O(n log n)`; Kadane একই problem `O(n)` time ও `O(1)` space-এ solve করে বলে practical ক্ষেত্রে preferred।

```cpp title="Complete example: maximum subarray"
#include <bits/stdc++.h>
using namespace std;

long long crossingSum(const vector<int>& values, int left, int middle, int right) {
    long long sum = 0, bestLeft = LLONG_MIN, bestRight = LLONG_MIN;
    for (int i = middle; i >= left; --i) {
        sum += values[i];
        bestLeft = max(bestLeft, sum);
    }
    sum = 0;
    for (int i = middle + 1; i <= right; ++i) {
        sum += values[i];
        bestRight = max(bestRight, sum);
    }
    return bestLeft + bestRight;
}

long long maximumSubarray(const vector<int>& values, int left, int right) {
    if (left == right) return values[left];
    int middle = left + (right - left) / 2;
    return max({maximumSubarray(values, left, middle),
                maximumSubarray(values, middle + 1, right),
                crossingSum(values, left, middle, right)});
}

int main() {
    vector<int> values{-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "Maximum subarray sum: "
         << maximumSubarray(values, 0, static_cast<int>(values.size()) - 1) << '\n';
    return 0;
}
```

**Sample output**

```text
Maximum subarray sum: 6
```

```text
                    [left ... mid | mid+1 ... right]
                       /          |          \
             best in left   best crossing   best in right
                       \          |          /
                              maximum

Example best crossing subarray: [4, -1, 2, 1] → 6
```

## 🔢 78. How do you find the closest pair of points using divide and conquer?

Points প্রথমে x-coordinate অনুযায়ী sort করা হয়। দুই half recursively solve করার পর midpoint-এর দুই পাশে current best distance `d`-এর ভেতরের strip পরীক্ষা করা হয়। Strip-কে y অনুযায়ী রাখলে প্রতিটি point-এর পরের সর্বোচ্চ কয়েকটি candidate-ই পরীক্ষা করতে হয়, ফলে total time `O(n log n)`।

```cpp title="Complete example: closest pair of points"
#include <bits/stdc++.h>
using namespace std;

struct Point { double x, y; };

double distanceBetween(const Point& a, const Point& b) {
    return hypot(a.x - b.x, a.y - b.y);
}

double closestRecursive(vector<Point>& points, int left, int right) {
    int count = right - left;
    if (count <= 3) {
        double best = numeric_limits<double>::infinity();
        for (int i = left; i < right; ++i)
            for (int j = i + 1; j < right; ++j)
                best = min(best, distanceBetween(points[i], points[j]));
        sort(points.begin() + left, points.begin() + right,
             [](const Point& a, const Point& b) { return a.y < b.y; });
        return best;
    }

    int middle = left + count / 2;
    double middleX = points[middle].x;
    double best = min(closestRecursive(points, left, middle),
                      closestRecursive(points, middle, right));
    inplace_merge(points.begin() + left, points.begin() + middle, points.begin() + right,
                  [](const Point& a, const Point& b) { return a.y < b.y; });

    vector<Point> strip;
    for (int i = left; i < right; ++i)
        if (abs(points[i].x - middleX) < best) strip.push_back(points[i]);
    for (int i = 0; i < static_cast<int>(strip.size()); ++i)
        for (int j = i + 1; j < static_cast<int>(strip.size()) &&
             strip[j].y - strip[i].y < best; ++j)
            best = min(best, distanceBetween(strip[i], strip[j]));
    return best;
}

double closestPair(vector<Point> points) {
    if (points.size() < 2) throw invalid_argument("At least two points are required");
    sort(points.begin(), points.end(), [](const Point& a, const Point& b) {
        return a.x < b.x || (a.x == b.x && a.y < b.y);
    });
    return closestRecursive(points, 0, points.size());
}

int main() {
    vector<Point> points{{2, 3}, {12, 30}, {40, 50}, {5, 1}, {12, 10}, {3, 4}};
    cout << fixed << setprecision(3)
         << "Closest distance: " << closestPair(points) << '\n';
    return 0;
}
```

**Sample output**

```text
Closest distance: 1.414
```

```text
Sorted by x:
left half             │ right half
●   ●  ●              │   ●      ●
                      │
                <── d ┼ d ──>       strip near midpoint

Only points close to the dividing line can beat current distance d.
```
