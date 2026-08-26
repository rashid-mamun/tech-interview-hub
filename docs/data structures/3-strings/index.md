---
sidebar_position: 3
title: 'Strings'
---


## 11. How are strings represented and stored internally?
String হলো মূলত **characters এর একটা sequence/array**। Internally বেশিরভাগ language এ string কে **character array** (বা byte array, encoding অনুযায়ী) হিসেবে memory তে **contiguous** ভাবে store করা হয়।

- **C** এর মতো language এ string হলো একটা `char` array যেটা `\0` (null character) দিয়ে শেষ হয় (null-terminated)
- **C++** এ `std::string` internally একটা dynamic character buffer manage করে (heap এ allocate হয়, সাথে length এবং capacity metadata থাকে)
- **Java** তে string internally একটা `char[]` (Java 9 এর আগে) বা `byte[]` (Java 9 থেকে, compact strings feature সহ) array দিয়ে represent হয়
- **Python** এ string `str` object হিসেবে store হয়, যেখানে encoding (Latin-1, UCS-2, বা UCS-4) content অনুযায়ী automatically নির্বাচিত হয়

**String memory diagram:**

```text
string s = "hello"

Index:      0    1    2    3    4
Character: 'h'  'e'  'l'  'l'  'o'
Address:   A   A+1  A+2  A+3  A+4

std::string object:
+---------+----------+----------+
| pointer | length=5 | capacity |
+---------+----------+----------+
     |
     v
  character buffer: [h][e][l][l][o]
```

**C-style string vs C++ string:**

```text
C string:
['h']['e']['l']['l']['o']['\0']
                         ^
                    null terminator

C++ std::string:
['h']['e']['l']['l']['o']
length metadata আলাদা থাকে, তাই '\0' দিয়ে length বুঝতে হয় না।
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    string s = "hello";

    // Absolute address run ভেদে বদলায়, তাই deterministic byte offset দেখানো হচ্ছে।
    cout << "Characters and byte offsets:" << endl;
    for (size_t i = 0; i < s.length(); i++) {
        cout << "s[" << i << "] = '" << s[i]
             << "'  offset: " << (&s[i] - &s[0]) << endl;
    }
    return 0;
}
```

```
Characters and byte offsets:
s[0] = 'h'  offset: 0
s[1] = 'e'  offset: 1
s[2] = 'l'  offset: 2
s[3] = 'l'  offset: 3
s[4] = 'o'  offset: 4
```
(লক্ষ্য করুন প্রতিটি address আগেরটার থেকে ঠিক 1 বেশি — এটাই **contiguous storage** এর প্রমাণ, ফলে index দিয়ে `O(1)` access সম্ভব হয়)

> **Implementation note:** ছোট `std::string` implementation-এর Small String Optimization (SSO) ব্যবহার করে character object-এর ভেতরেই রাখতে পারে; বড় string সাধারণত dynamic buffer ব্যবহার করে। দুক্ষেত্রেই C++11 থেকে characters contiguous থাকার guarantee আছে।


### Why are strings immutable in languages like Java and Python?

String কে **immutable** design করার পেছনে কয়েকটা গুরুত্বপূর্ণ কারণ আছে:

1. **String Pool / Interning এর জন্য Memory Efficiency**: একই value এর একাধিক string থাকলে একটাই copy রাখা যায়। যদি mutable হতো, একজনের পরিবর্তনে অন্যদের value বদলে যেত।

2. **Thread Safety**: Immutable object naturally **thread-safe**, multiple thread একই string concurrently access করলেও data race হয় না।

3. **Security**: File path, credentials এর মতো sensitive data string হিসেবে ব্যবহৃত হয়। Immutable হলে validate করা string পরবর্তীতে tamper করা যায় না।

4. **Hashing Consistency**: String প্রায়ই **HashMap এর key** হিসেবে ব্যবহৃত হয়। Mutable হলে key হিসেবে ব্যবহারের পর value change হলে hash code বদলে গিয়ে data structure corrupt হয়ে যেত।

5. **Caching hashCode**: Immutable হওয়ায় hashCode একবার calculate করে cache করা যায়।

(লক্ষণীয়: C++ এর `std::string` কিন্তু **mutable** — Java/Python এর মতো immutable না। এটা language design choice এর পার্থক্য।)

**Immutable string example:**

```text
Java/Python style:

s = "cat"
s = s + "s"

Old object: "cat"   unchanged
New object: "cats"  created

s এখন নতুন object কে point করে।
```


### What is string interning, and how does it save memory?

**String Interning** হলো একটা technique যেখানে একই content এর একাধিক string এর জন্য একটাই copy memory তে (**String Pool** এ) রাখা হয়, এবং সব identical string সেই একই object কে reference করে।

**String pool diagram:**

```text
String Pool:

         +---------+
s1 ----> | "hello" |
s2 ----> | "hello" |
         +---------+

দুইটা reference, কিন্তু memory তে একটাই "hello" object।

Without interning:
s1 -> ["hello"]
s2 -> ["hello"]
দুইটা আলাদা copy লাগত।
```

```text
Java-like concept:

s1 = "hello"
s2 = "hello"

s1 এবং s2 একই interned object কে reference করে।

s3 = explicitly new string object with value "hello"

s3 এর value same, কিন্তু object আলাদা হতে পারে।
```

**Memory save হওয়ার কারণ:** যদি কোনো program এ `"hello"` string ১০০ বার ব্যবহৃত হয়, interning ছাড়া প্রতিটির জন্য আলাদা memory allocate হতো। Interning এর মাধ্যমে শুধু **একবার** memory allocate হয়, বাকি সব reference সেই একই object কে point করে।

C++ এ direct string interning নেই (`std::string` mutable), তবে similar concept **flyweight pattern** দিয়ে manually implement করা যায়, অথবা string literal (`const char*`) কম্পাইলার প্রায়ই একটা read-only data segment এ pool করে রাখে।


## 12. Why is repeated string concatenation in a loop inefficient, and what's the alternative?

C++ এ `std::string` mutable হলেও, `+` অপারেটর দিয়ে concatenate করলে প্রতিবার existing buffer এ জায়গা না থাকলে **নতুন, বড় buffer allocate করে পুরো content copy** করতে হয় (dynamic array resize এর মতো)।

**Repeated concatenation problem:**

```text
Build "abcd" one char at a time:

Step 1: "" + "a"    -> "a"
Step 2: "a" + "b"   -> "ab"     copy old 1 char
Step 3: "ab" + "c"  -> "abc"    copy old 2 chars
Step 4: "abc" + "d" -> "abcd"   copy old 3 chars

Immutable string হলে total copy:
1 + 2 + 3 + ... + n = O(n^2)
```

```cpp
#include <bits/stdc++.h>
using namespace std;

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


### How does StringBuilder (or equivalent) improve performance?

C++ এ `std::string` নিজেই mutable এবং internally **dynamic array এর মতো doubling strategy** ব্যবহার করে বলে আলাদা `StringBuilder` লাগে না, তবে performance আরো optimize করতে `reserve()` ব্যবহার করে **আগে থেকেই capacity allocate** করে রাখা যায় (Java এর `StringBuilder(int capacity)` constructor এর মতো):

```text
Without reserve:
capacity full হলে বারবার new buffer allocate + copy

With reserve(n):
[ ][ ][ ][ ][ ][ ][ ][ ] ... n slots
আগে থেকেই enough capacity, তাই repeated reallocation কমে যায়।
```

```cpp
#include <bits/stdc++.h>
using namespace std;

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


### What is the time complexity of concatenating strings in a loop vs using a builder?

| Approach | Time Complexity |
|---|---|
| Immutable string `+=` (Java/Python এর মতো language এ) | `O(n²)` |
| `std::string +=` (C++, mutable, amortized doubling) | `O(n)` amortized |
| `StringBuilder` / `reserve()` সহ pre-allocated buffer | `O(n)` |


## 13. How do you check if two strings are anagrams of each other?

**Anagram** মানে দুইটা string এর character frequency একই, শুধু order আলাদা।

```text
"listen"
"silent"

Both have:
e:1, i:1, l:1, n:1, s:1, t:1

তাই তারা anagram।
```

**Approach 1: Sorting-based**

```text
listen -> eilnst
silent -> eilnst

Sorted strings same -> anagram
```

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

**Frequency count walkthrough:**

```text
s1 = "anagram"
s2 = "nagaram"

Process s1:
a:3, n:1, g:1, r:1, m:1

Process s2 by decrement:
n -> 0
a -> 2
g -> 0
a -> 1
r -> 0
a -> 0
m -> 0

সব frequency 0 -> anagram
```

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


### How would you handle Unicode characters in an anagram check?

1. **Fixed-size array এর বদলে HashMap ব্যবহার করা**: Unicode range অনেক বড়, তাই `int[26]` এর মতো fixed array না ব্যবহার করে `unordered_map<char32_t, int>` (বা language অনুযায়ী equivalent) ব্যবহার করতে হবে, উপরের `unordered_map<char, int>` approach টাই এই ক্ষেত্রে scalable।

2. **Normalization প্রয়োজন**: Unicode এ একই দৃশ্যমান character বিভিন্ন encoding form এ থাকতে পারে (composed vs decomposed), তাই comparison এর আগে **Unicode normalization** (NFC/NFD) করা উচিত।

3. **Multi-byte character সাবধানে handle করা**: C++ এ যদি UTF-8 string হয়, একটা single Unicode character একাধিক `char` (byte) নিয়ে গঠিত হতে পারে, তাই byte-by-byte iterate না করে **code point** ভিত্তিতে iterate করা উচিত (যেমন `<codecvt>` বা ICU library ব্যবহার করে)।

Time complexity তখনও `O(n)` থাকে, কিন্তু constant factor বাড়ে।

```text
Unicode issue:

"é" can be represented as:
1. composed:   U+00E9
2. decomposed: U+0065 + U+0301

দেখতে একই, কিন্তু raw bytes/code points আলাদা হতে পারে।
Normalization না করলে anagram/palindrome result ভুল হতে পারে।
```


## 14. What is a palindrome, and how do you efficiently check for one?

**Palindrome** হলো এমন string যা সামনে থেকে এবং পেছন থেকে একই পড়া যায়।

```text
madam

m a d a m
^       ^
|       |
same   same

left/right pointer ভিতরের দিকে এগোয়।
```

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


### How would you check if a string can be rearranged to form a palindrome?

একটা string কে rearrange করে palindrome বানানো সম্ভব হবে যদি **সর্বোচ্চ একটা character এর frequency odd** হয়:

**Why odd frequency rule works:**

```text
Palindrome: "civic"

c i v i c
| |   | |
c pair
i pair
v single middle

Even length palindrome: all frequencies even
Odd length palindrome: exactly one odd frequency allowed
```

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


## 15. What are common string-matching algorithms?

String matching মানে text এর মধ্যে pattern আছে কিনা বা কোথায় আছে সেটা খোঁজা।

```text
text    = A A B A A C A A D A A B A A B A
pattern = A A B A

Matches start at index 0, 9, 12
```

**Naive matching idea:**

```text
Try pattern at every index:

text:    A A B A A C ...
pattern: A A B A
         match at 0

text:    A A B A A C ...
pattern:   A A B A
           mismatch, shift by 1

Worst case এ একই character বারবার compare হতে পারে।
```

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


### How does the KMP (Knuth-Morris-Pratt) algorithm improve on the naive approach?

KMP pattern সম্পর্কে preprocessing করে **LPS array** (Longest Proper Prefix which is also Suffix) তৈরি করে, যা mismatch হলে pattern pointer কে smartly reposition করতে সাহায্য করে (text pointer কখনো backtrack করে না)।

**LPS example:**

```text
pattern = "AABA"

Index:   0 1 2 3
Char:    A A B A
LPS:     0 1 0 1

LPS[i] মানে pattern[0..i] এর longest proper prefix
যেটা suffix-ও।

At i=3, substring "AABA"
proper prefix/suffix match = "A"
so LPS[3] = 1
```

**KMP mismatch jump:**

```text
text:    A A B A A C
pattern: A A B A B
                 ^
             mismatch at B vs C

Naive হলে pattern আবার শুরুতে নিয়ে যেত।
KMP LPS ব্যবহার করে j কে smartly পিছায়,
text pointer i পিছায় না।
```

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
    if (pattern.empty()) {
        cout << "Empty pattern matches at index 0" << endl;
        return;
    }
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


### What is the Rabin-Karp algorithm, and how does it use hashing for pattern matching?

**মূল ধারণা:** pattern এর hash এবং text এর প্রতিটি window এর hash **rolling hash** technique দিয়ে দ্রুত calculate ও compare করা হয়।

**Rolling hash window:**

```text
text = "ABCDE"
pattern length = 3

Window 1: "ABC"
Window 2: "BCD"

Naive hash:
ABC এর hash calculate O(3)
BCD এর hash calculate O(3)

Rolling hash:
ABC থেকে A remove, D add
BCD hash O(1) এ update
```

```text
Hash match হলেই final answer না।
Hash collision হতে পারে, তাই actual substring compare করে confirm করা হয়।
```

```cpp
#include <bits/stdc++.h>
using namespace std;

void rabinKarp(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    if (m == 0) {
        cout << "Empty pattern matches at index 0" << endl;
        return;
    }
    if (m > n) return;
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


### What is the Z-algorithm used for?

**Z-algorithm** একটা `Z-array` তৈরি করে, যেখানে `Z[i]` হলো position `i` থেকে শুরু হওয়া substring এবং পুরো string এর prefix এর মধ্যে সবচেয়ে বড় common length।

**Z-array example:**

```text
s = "aabxaab"

Index: 0 1 2 3 4 5 6
Char:  a a b x a a b
Z:     0 1 0 0 3 1 0

Z[4] = 3, কারণ s[4..] = "aab"
এটা prefix "aab" এর সাথে 3 character match করে।
```

**Pattern search with Z:**

```text
pattern = "AABA"
text    = "AABAACAADAABAABA"

combined = pattern + "$" + text

যেখানে Z[i] == pattern.length(),
সেখানে text এ pattern match আছে।
```

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
    if (pattern.empty()) {
        cout << "Empty pattern matches at index 0" << endl;
        return;
    }
    char separator = '\1'; // production-এ input-এ নেই এমন delimiter বেছে নিতে হবে
    string combined = pattern + separator + text;
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
