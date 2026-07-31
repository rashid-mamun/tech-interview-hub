---
sidebar_position: 3
title: 'Strings'
---


## 🧵 11. How are strings represented and stored internally?
String হলো মূলত **characters এর একটা sequence/array**। Internally বেশিরভাগ language এ string কে **character array** (বা byte array, encoding অনুযায়ী) হিসেবে memory তে **contiguous** ভাবে store করা হয়।

- **C** এর মতো language এ string হলো একটা `char` array যেটা `\0` (null character) দিয়ে শেষ হয় (null-terminated)
- **C++** এ `std::string` internally একটা dynamic character buffer manage করে (heap এ allocate হয়, সাথে length এবং capacity metadata থাকে)
- **Java** তে string internally একটা `char[]` (Java 9 এর আগে) বা `byte[]` (Java 9 থেকে, compact strings feature সহ) array দিয়ে represent হয়
- **Python** এ string `str` object হিসেবে store হয়, যেখানে encoding (Latin-1, UCS-2, বা UCS-4) content অনুযায়ী automatically নির্বাচিত হয়

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    string s = "hello";

    // Memory তে contiguous storage এর প্রমাণ: address গুলো sequential
    cout << "Characters and their memory addresses:" << endl;
    for (int i = 0; i < s.length(); i++) {
        cout << "s[" << i << "] = '" << s[i]
             << "'  address: " << (void*)&s[i] << endl;
    }
    return 0;
}
```

```
Characters and their memory addresses:
s[0] = 'h'  address: 0x55d3a2b1eeb0
s[1] = 'e'  address: 0x55d3a2b1eeb1
s[2] = 'l'  address: 0x55d3a2b1eeb2
s[3] = 'l'  address: 0x55d3a2b1eeb3
s[4] = 'o'  address: 0x55d3a2b1eeb4
```
(লক্ষ্য করুন প্রতিটি address আগেরটার থেকে ঠিক 1 বেশি — এটাই **contiguous storage** এর প্রমাণ, ফলে index দিয়ে `O(1)` access সম্ভব হয়)

---

### Why are strings immutable in languages like Java and Python?

String কে **immutable** design করার পেছনে কয়েকটা গুরুত্বপূর্ণ কারণ আছে:

1. **String Pool / Interning এর জন্য Memory Efficiency**: একই value এর একাধিক string থাকলে একটাই copy রাখা যায়। যদি mutable হতো, একজনের পরিবর্তনে অন্যদের value বদলে যেত।

2. **Thread Safety**: Immutable object naturally **thread-safe**, multiple thread একই string concurrently access করলেও data race হয় না।

3. **Security**: File path, credentials এর মতো sensitive data string হিসেবে ব্যবহৃত হয়। Immutable হলে validate করা string পরবর্তীতে tamper করা যায় না।

4. **Hashing Consistency**: String প্রায়ই **HashMap এর key** হিসেবে ব্যবহৃত হয়। Mutable হলে key হিসেবে ব্যবহারের পর value change হলে hash code বদলে গিয়ে data structure corrupt হয়ে যেত।

5. **Caching hashCode**: Immutable হওয়ায় hashCode একবার calculate করে cache করা যায়।

(লক্ষণীয়: C++ এর `std::string` কিন্তু **mutable** — Java/Python এর মতো immutable না। এটা language design choice এর পার্থক্য।)

---

### What is string interning, and how does it save memory?

**String Interning** হলো একটা technique যেখানে একই content এর একাধিক string এর জন্য একটাই copy memory তে (**String Pool** এ) রাখা হয়, এবং সব identical string সেই একই object কে reference করে।

```java
// Java উদাহরণ (concept বোঝানোর জন্য)
String s1 = "hello";
String s2 = "hello";
// s1 == s2 → true, দুইটাই একই interned object কে point করছে

String s3 = new String("hello");
// s3 == s1 → false, 'new' দিয়ে আলাদা object তৈরি হয়েছে heap এ
```

**Memory save হওয়ার কারণ:** যদি কোনো program এ `"hello"` string ১০০ বার ব্যবহৃত হয়, interning ছাড়া প্রতিটির জন্য আলাদা memory allocate হতো। Interning এর মাধ্যমে শুধু **একবার** memory allocate হয়, বাকি সব reference সেই একই object কে point করে।

C++ এ direct string interning নেই (`std::string` mutable), তবে similar concept **flyweight pattern** দিয়ে manually implement করা যায়, অথবা string literal (`const char*`) কম্পাইলার প্রায়ই একটা read-only data segment এ pool করে রাখে।

---

## ➕ 12. Why is repeated string concatenation in a loop inefficient, and what's the alternative?

C++ এ `std::string` mutable হলেও, `+` অপারেটর দিয়ে concatenate করলে প্রতিবার existing buffer এ জায়গা না থাকলে **নতুন, বড় buffer allocate করে পুরো content copy** করতে হয় (dynamic array resize এর মতো)।

```cpp
#include <bits/stdc++.h>
using namespace std;
#include <chrono>

int main() {
    int n = 50000;

    // Inefficient way: repeated concatenation
    auto start1 = chrono::high_resolution_clock::now();
    string result1 = "";
    for (int i = 0; i < n; i++) {
        result1 += "x";   // প্রতিবার potentially reallocation হতে পারে
    }
    auto end1 = chrono::high_resolution_clock::now();
    auto duration1 = chrono::duration_cast<chrono::milliseconds>(end1 - start1);

    cout << "Naive concatenation time: " << duration1.count() << " ms" << endl;
    cout << "Result length: " << result1.length() << endl;

    return 0;
}
```

```
Naive concatenation time: 8 ms
Result length: 50000
```
(এই ছোট উদাহরণে `std::string` এর built-in **growth strategy — doubling capacity** থাকায় খুব বেশি slow দেখাবে না, কিন্তু বড় স্কেলে এবং immutable-string language এ (Java/Python) এই সমস্যা অনেক প্রকট হয়)

---

### How does StringBuilder (or equivalent) improve performance?

C++ এ `std::string` নিজেই mutable এবং internally **dynamic array এর মতো doubling strategy** ব্যবহার করে বলে আলাদা `StringBuilder` লাগে না, তবে performance আরো optimize করতে `reserve()` ব্যবহার করে **আগে থেকেই capacity allocate** করে রাখা যায় (Java এর `StringBuilder(int capacity)` constructor এর মতো):

```cpp
#include <bits/stdc++.h>
using namespace std;
#include <chrono>

int main() {
    int n = 1000000;

    // Without reserve
    auto start1 = chrono::high_resolution_clock::now();
    string s1 = "";
    for (int i = 0; i < n; i++) s1 += 'x';
    auto end1 = chrono::high_resolution_clock::now();
    auto d1 = chrono::duration_cast<chrono::milliseconds>(end1 - start1);

    // With reserve (StringBuilder এর মতো pre-allocated buffer)
    auto start2 = chrono::high_resolution_clock::now();
    string s2 = "";
    s2.reserve(n);   // capacity আগে থেকেই fix করে দেওয়া
    for (int i = 0; i < n; i++) s2 += 'x';
    auto end2 = chrono::high_resolution_clock::now();
    auto d2 = chrono::duration_cast<chrono::milliseconds>(end2 - start2);

    cout << "Without reserve(): " << d1.count() << " ms" << endl;
    cout << "With reserve(): " << d2.count() << " ms" << endl;
    return 0;
}
```

```
Without reserve(): 12 ms
With reserve(): 6 ms
```
`reserve()` ব্যবহার করলে buffer বারবার resize/reallocate হওয়ার দরকার হয় না, তাই performance আরো ভালো হয়। Java এর `StringBuilder` internally ঠিক এই কাজটাই করে — একটা mutable buffer maintain করে যেটা প্রয়োজনে doubling strategy তে grow করে, এবং শেষে `.toString()` কল করলে একটা immutable `String` তৈরি হয়।

---

### What is the time complexity of concatenating strings in a loop vs using a builder?

| Approach | Time Complexity |
|---|---|
| Immutable string `+=` (Java/Python এর মতো language এ) | `O(n²)` |
| `std::string +=` (C++, mutable, amortized doubling) | `O(n)` amortized |
| `StringBuilder` / `reserve()` সহ pre-allocated buffer | `O(n)` |

---

## 🔄 13. How do you check if two strings are anagrams of each other?

**Approach 1: Sorting-based**
```cpp
#include <bits/stdc++.h>
using namespace std;

bool isAnagramSorting(string s1, string s2) {
    if (s1.length() != s2.length()) return false;
    sort(s1.begin(), s1.end());
    sort(s2.begin(), s2.end());
    return s1 == s2;
}

int main() {
    string s1 = "listen", s2 = "silent";
    cout << "\"" << s1 << "\" and \"" << s2 << "\" are anagrams: "
         << (isAnagramSorting(s1, s2) ? "Yes" : "No") << endl;
    return 0;
}
```

```
"listen" and "silent" are anagrams: Yes
```
- **Time Complexity**: `O(n log n)` **Space Complexity**: `O(n)` (sorted copy বা sort algorithm এর জন্য)

### What approaches exist (sorting vs. frequency count) and what are their complexities?

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isAnagramFrequency(string s1, string s2) {
    if (s1.length() != s2.length()) return false;

    unordered_map<char, int> freq;
    for (char c : s1) freq[c]++;
    for (char c : s2) freq[c]--;

    for (auto& pair : freq) {
        if (pair.second != 0) return false;
    }
    return true;
}

int main() {
    string s1 = "anagram", s2 = "nagaram";
    cout << "\"" << s1 << "\" and \"" << s2 << "\" are anagrams: "
         << (isAnagramFrequency(s1, s2) ? "Yes" : "No") << endl;

    string s3 = "rat", s4 = "car";
    cout << "\"" << s3 << "\" and \"" << s4 << "\" are anagrams: "
         << (isAnagramFrequency(s3, s4) ? "Yes" : "No") << endl;
    return 0;
}
```

```
"anagram" and "nagaram" are anagrams: Yes
"rat" and "car" are anagrams: No
```
- **Time Complexity**: `O(n)` **Space Complexity**: `O(k)`, যেখানে `k` = distinct character সংখ্যা (English lowercase এর জন্য fixed 26, তাই প্রায় `O(1)`)

**Trade-off:** Frequency count approach **faster** (`O(n)` vs `O(n log n)`), তাই এটাই সাধারণত preferred।

---

### How would you handle Unicode characters in an anagram check?

1. **Fixed-size array এর বদলে HashMap ব্যবহার করা**: Unicode range অনেক বড়, তাই `int[26]` এর মতো fixed array না ব্যবহার করে `unordered_map<char32_t, int>` (বা language অনুযায়ী equivalent) ব্যবহার করতে হবে, উপরের `unordered_map<char, int>` approach টাই এই ক্ষেত্রে scalable।

2. **Normalization প্রয়োজন**: Unicode এ একই দৃশ্যমান character বিভিন্ন encoding form এ থাকতে পারে (composed vs decomposed), তাই comparison এর আগে **Unicode normalization** (NFC/NFD) করা উচিত।

3. **Multi-byte character সাবধানে handle করা**: C++ এ যদি UTF-8 string হয়, একটা single Unicode character একাধিক `char` (byte) নিয়ে গঠিত হতে পারে, তাই byte-by-byte iterate না করে **code point** ভিত্তিতে iterate করা উচিত (যেমন `<codecvt>` বা ICU library ব্যবহার করে)।

Time complexity তখনও `O(n)` থাকে, কিন্তু constant factor বাড়ে।

---

## 🪞 14. What is a palindrome, and how do you efficiently check for one?

**Two-pointer technique** ব্যবহার করে:
```cpp
#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    string s1 = "madam";
    string s2 = "hello";

    cout << "\"" << s1 << "\" is palindrome: " << (isPalindrome(s1) ? "Yes" : "No") << endl;
    cout << "\"" << s2 << "\" is palindrome: " << (isPalindrome(s2) ? "Yes" : "No") << endl;
    return 0;
}
```

```
"madam" is palindrome: Yes
"hello" is palindrome: No
```
- **Time Complexity**: `O(n)` **Space Complexity**: `O(1)`

---

### How would you check if a string can be rearranged to form a palindrome?

একটা string কে rearrange করে palindrome বানানো সম্ভব হবে যদি **সর্বোচ্চ একটা character এর frequency odd** হয়:

```cpp
#include <bits/stdc++.h>
using namespace std;

bool canFormPalindrome(string s) {
    unordered_map<char, int> freq;
    for (char c : s) freq[c]++;

    int oddCount = 0;
    for (auto& pair : freq) {
        if (pair.second % 2 != 0) oddCount++;
    }
    return oddCount <= 1;
}

int main() {
    string s1 = "civic";
    string s2 = "ivicc";
    string s3 = "hello";

    cout << "\"" << s1 << "\" can form palindrome: " << (canFormPalindrome(s1) ? "Yes" : "No") << endl;
    cout << "\"" << s2 << "\" can form palindrome: " << (canFormPalindrome(s2) ? "Yes" : "No") << endl;
    cout << "\"" << s3 << "\" can form palindrome: " << (canFormPalindrome(s3) ? "Yes" : "No") << endl;
    return 0;
}
```

```
"civic" can form palindrome: Yes
"ivicc" can form palindrome: Yes
"hello" can form palindrome: No
```
(`"ivicc"` কে rearrange করলে `"civic"` পাওয়া যায়, তাই এটাও Yes)
- **Time Complexity**: `O(n)` **Space Complexity**: `O(k)`

---

## 🔎 15. What are common string-matching algorithms?

```cpp
#include <bits/stdc++.h>
using namespace std;

void naiveSearch(string text, string pattern) {
    int n = text.length(), m = pattern.length();

    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m && text[i + j] == pattern[j]) {
            j++;
        }
        if (j == m) {
            cout << "Pattern found at index " << i << endl;
        }
    }
}

int main() {
    string text = "AABAACAADAABAABA";
    string pattern = "AABA";

    naiveSearch(text, pattern);
    return 0;
}
```

```
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12
```
**Worst-case Time Complexity**: `O(n × m)` — ঘটে যখন text এবং pattern প্রায় একই রকম repetitive character দিয়ে গঠিত (যেমন `text = "aaaaaaaaaa"`, `pattern = "aaab"`)।

---

### How does the KMP (Knuth-Morris-Pratt) algorithm improve on the naive approach?

KMP pattern সম্পর্কে preprocessing করে **LPS array** (Longest Proper Prefix which is also Suffix) তৈরি করে, যা mismatch হলে pattern pointer কে smartly reposition করতে সাহায্য করে (text pointer কখনো backtrack করে না)।

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> computeLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;

    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else if (len != 0) {
            len = lps[len - 1];
        } else {
            lps[i] = 0;
            i++;
        }
    }
    return lps;
}

void KMPSearch(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    vector<int> lps = computeLPS(pattern);

    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
            if (j == m) {
                cout << "Pattern found at index " << i - j << endl;
                j = lps[j - 1];
            }
        } else if (j != 0) {
            j = lps[j - 1];   // smart repositioning, text pointer backtrack করে না
        } else {
            i++;
        }
    }
}

int main() {
    string text = "AABAACAADAABAABA";
    string pattern = "AABA";

    KMPSearch(text, pattern);
    return 0;
}
```

```
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12
```
- **Preprocessing**: `O(m)` **Searching**: `O(n)` **Total**: `O(n + m)` — naive এর `O(n × m)` থেকে অনেক ভালো

---

### What is the Rabin-Karp algorithm, and how does it use hashing for pattern matching?

**মূল ধারণা:** pattern এর hash এবং text এর প্রতিটি window এর hash **rolling hash** technique দিয়ে দ্রুত calculate ও compare করা হয়।

```cpp
#include <bits/stdc++.h>
using namespace std;

void rabinKarp(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    int base = 256, mod = 101;   // hashing parameters

    int patternHash = 0, windowHash = 0, h = 1;

    for (int i = 0; i < m - 1; i++) h = (h * base) % mod;

    // pattern এবং প্রথম window এর hash calculate করা
    for (int i = 0; i < m; i++) {
        patternHash = (base * patternHash + pattern[i]) % mod;
        windowHash = (base * windowHash + text[i]) % mod;
    }

    for (int i = 0; i <= n - m; i++) {
        if (patternHash == windowHash) {
            // hash মিললে actual comparison করে confirm করা (collision check)
            if (text.substr(i, m) == pattern) {
                cout << "Pattern found at index " << i << endl;
            }
        }
        // rolling hash: next window এর hash O(1) এ বের করা
        if (i < n - m) {
            windowHash = (base * (windowHash - text[i] * h) + text[i + m]) % mod;
            if (windowHash < 0) windowHash += mod;
        }
    }
}

int main() {
    string text = "AABAACAADAABAABA";
    string pattern = "AABA";

    rabinKarp(text, pattern);
    return 0;
}
```

```
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12
```
- **Average Case**: `O(n + m)` **Worst Case**: `O(n × m)` (বেশি hash collision হলে)

**সবচেয়ে বড় সুবিধা**: **multiple pattern search** এ কার্যকর — একসাথে অনেক pattern এর hash compute করে দ্রুত candidate বাছাই করা যায়।

---

### What is the Z-algorithm used for?

**Z-algorithm** একটা `Z-array` তৈরি করে, যেখানে `Z[i]` হলো position `i` থেকে শুরু হওয়া substring এবং পুরো string এর prefix এর মধ্যে সবচেয়ে বড় common length।

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> computeZ(string s) {
    int n = s.length();
    vector<int> z(n, 0);
    int l = 0, r = 0;

    for (int i = 1; i < n; i++) {
        if (i < r) {
            z[i] = min(r - i, z[i - l]);
        }
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }
        if (i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }
    return z;
}

void zSearch(string text, string pattern) {
    string combined = pattern + "$" + text;
    vector<int> z = computeZ(combined);
    int patternLen = pattern.length();

    for (int i = 0; i < z.size(); i++) {
        if (z[i] == patternLen) {
            int index = i - patternLen - 1;   // '$' এর জন্য adjust
            cout << "Pattern found at index " << index << endl;
        }
    }
}

int main() {
    string text = "AABAACAADAABAABA";
    string pattern = "AABA";

    zSearch(text, pattern);
    return 0;
}
```

```
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12
```
**Time Complexity**: `O(n + m)` — KMP এর মতোই linear।

**ব্যবহার:**
- Pattern matching (KMP এর বিকল্প)
- Longest common prefix related problems
- String periodicity detect করা
- Competitive programming এ prefix-related সমস্যায়

**Summary Table:**

| Algorithm | Average Time | Worst Time | মূল কৌশল |
|---|---|---|---|
| Naive | `O(n × m)` | `O(n × m)` | Brute force comparison |
| KMP | `O(n + m)` | `O(n + m)` | LPS array (prefix-suffix matching) |
| Rabin-Karp | `O(n + m)` | `O(n × m)` | Rolling hash |
| Z-algorithm | `O(n + m)` | `O(n + m)` | Z-array (prefix matching length) |
