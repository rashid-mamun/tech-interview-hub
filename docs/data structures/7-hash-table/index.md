---
sidebar_position: 7
title: 'Hash Table'
---


## 🔑 36. What is a hash table, and how does it achieve average O(1) lookup time?

**Hash Table** হলো একটা data structure যেটা **key-value pair** store করে, এবং একটা **hash function** ব্যবহার করে key কে একটা **array index** এ map করে। এই index এ সরাসরি data store/retrieve করা যায় বলে, average case এ lookup, insertion, এবং deletion সবই `O(1)` time এ সম্পন্ন হয়।

**কীভাবে `O(1)` achieve হয়:**
- একটা key কে hash function দিয়ে একটা integer (hash code) এ convert করা হয়
- এই hash code কে array এর size দিয়ে **modulo** করে একটা **index** বের করা হয় (`index = hash(key) % array_size`)
- সেই index এ সরাসরি data access করা যায়, যেমন array indexing এ `O(1)` লাগে

যদি hash function ভালো হয় (uniform distribution দেয়) এবং **load factor** নিয়ন্ত্রণে রাখা হয়, তাহলে প্রতিটি bucket এ গড়ে খুব কম সংখ্যক element থাকে, ফলে **average case** এ lookup প্রায় constant time এ হয়ে যায়।

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    unordered_map<string, int> hashTable;

    hashTable["apple"] = 10;
    hashTable["banana"] = 20;
    hashTable["cherry"] = 30;

    cout << "Value of 'banana': " << hashTable["banana"] << endl;

    if (hashTable.find("grape") == hashTable.end()) {
        cout << "'grape' not found in hash table" << endl;
    }
    return 0;
}
```

### What is a hash function, and what properties make a good one?

**Hash Function** হলো একটা function যেটা যেকোনো size এর input (key) নিয়ে একটা **fixed-size integer output** (hash code) তৈরি করে।

**ভালো hash function এর properties:**
1. **Deterministic**: একই input সবসময় একই hash code দেবে
2. **Uniform Distribution**: hash code গুলো available buckets এ যতটা সম্ভব **সমানভাবে ছড়িয়ে** থাকা উচিত, যাতে কোনো একটা bucket এ বেশি element জমা না হয় (collision কমানোর জন্য)
3. **Fast to Compute**: hash calculation টা দ্রুত হওয়া উচিত (`O(1)` বা তার কাছাকাছি), নাহলে পুরো hash table এর efficiency নষ্ট হয়ে যায়
4. **Avalanche Effect**: input এ সামান্য পরিবর্তন হলেও output hash code এ বড় পরিবর্তন আসা উচিত (এটা distribution ভালো রাখতে সাহায্য করে)
5. **Minimizes Collisions**: যদিও collision সম্পূর্ণ এড়ানো সম্ভব না (Pigeonhole principle অনুযায়ী), ভালো hash function collision এর সম্ভাবনা কমিয়ে আনে

```cpp
#include <bits/stdc++.h>
using namespace std;

// একটা simple custom hash function এর উদাহরণ (educational purpose)
int simpleHash(string key, int tableSize) {
    int hash = 0;
    for (char c : key) {
        hash = (hash * 31 + c) % tableSize;   // 31 একটা প্রাইম নাম্বার, distribution ভালো করার জন্য
    }
    return hash;
}

int main() {
    int tableSize = 10;
    vector<string> keys = {"apple", "banana", "cherry"};

    for (string key : keys) {
        cout << "Hash of \"" << key << "\": " << simpleHash(key, tableSize) << endl;
    }
    return 0;
}
```
---

### What is a load factor, and how does it affect performance and resizing?

**Load Factor** হলো hash table এর **কতটা "ভর্তি"** তার একটা measurement, এই formula দিয়ে বের করা হয়:
```
load_factor = number_of_elements / number_of_buckets
```

**Performance এর উপর প্রভাব:**
- Load factor **কম** থাকলে (যেমন 0.5), প্রতিটি bucket এ average খুব কম element থাকে, তাই collision কম হয় এবং lookup প্রায় `O(1)` এ থাকে
- Load factor **বেশি** হয়ে গেলে (যেমন 1.0 বা তার বেশি), অনেক collision হতে শুরু করে, ফলে প্রতিটি bucket এর মধ্যে অনেক element জমা হয়ে যায় এবং lookup time `O(n)` এর কাছাকাছি চলে যেতে পারে (worst case এ)

**Resizing এর সাথে সম্পর্ক:** যখন load factor একটা নির্দিষ্ট **threshold** (সাধারণত 0.7-0.75) অতিক্রম করে, তখন hash table **automatically resize** হয় — নতুন, বড় (সাধারণত দ্বিগুণ size এর) array allocate করে সব existing element **rehash** করে নতুন array তে বসানো হয়। এই resize operation এ `O(n)` সময় লাগে, কিন্তু dynamic array এর মতোই এটাও **amortized `O(1)`** per insertion থাকে, কারণ resize infrequent ভাবে ঘটে।

---

## 💥 37. How do hash tables handle collisions?

**Collision** ঘটে যখন দুইটা ভিন্ন key একই hash index এ map হয়ে যায় (`hash(key1) == hash(key2)` কিন্তু `key1 ≠ key2`)। এই collision handle করার প্রধান দুইটা পদ্ধতি: **Chaining** এবং **Open Addressing**।


### What is the difference between open addressing and chaining?

**Chaining (Separate Chaining):**
প্রতিটি bucket একটা **linked list** (বা অন্য কোনো data structure, যেমন balanced tree) ধরে রাখে। যখন collision হয়, নতুন element সেই bucket এর linked list এ **যোগ** হয়ে যায়, existing data replace হয় না।


**Open Addressing:**
যখন collision হয়, তখন **একই array এর মধ্যেই** অন্য একটা খালি slot খোঁজা হয় (linked list বা extra structure ছাড়াই)। সব element মূল array এর মধ্যেই থাকে।

**পার্থক্য টেবিল আকারে:**

| বৈশিষ্ট্য | Chaining | Open Addressing |
|---|---|---|
| Extra memory | লাগে (linked list node এর জন্য) | লাগে না (একই array ব্যবহার হয়) |
| Load factor > 1 | সম্ভব (linked list অসীম বড় হতে পারে) | সম্ভব না (array এর size দ্বারা সীমাবদ্ধ) |
| Cache performance | তুলনামূলক খারাপ (scattered nodes) | ভালো (contiguous array) |
| Deletion | সহজ | জটিল (special marker লাগে) |

---

### What is the difference between linear probing, quadratic probing, and double hashing?

এই তিনটাই **open addressing** এর ভিন্ন strategy, যা বলে দেয় collision হলে **পরবর্তী কোন slot** try করতে হবে।

**1. Linear Probing:** collision হলে পরবর্তী slot গুলো ক্রমান্বয়ে (একটা একটা করে) check করা হয়।
```
index, index+1, index+2, index+3, ...
```
**সমস্যা:** **Clustering** — একবার কোনো এলাকায় অনেক element জমা হয়ে গেলে, সেই এলাকা আরও বড় হতে থাকে (কারণ নতুন collision গুলোও সেখানেই গিয়ে জমা হয়), যা performance কমিয়ে দেয়।

**2. Quadratic Probing:** collision হলে quadratic (বর্গ) distance অনুযায়ী পরবর্তী slot check করা হয়।
```
index, index+1², index+2², index+3², ...
```
এটা clustering কিছুটা কমায়, কিন্তু সম্পূর্ণ eliminate করে না (**secondary clustering** সমস্যা থেকে যায়)।

**3. Double Hashing:** একটা **দ্বিতীয় hash function** ব্যবহার করে step size নির্ধারণ করা হয়, যা প্রতিটি key এর জন্য আলাদা হয়।
```
index = (hash1(key) + i × hash2(key)) % table_size
```
এটা clustering সবচেয়ে ভালোভাবে এড়ায়, কারণ প্রতিটি key এর জন্য probing sequence আলাদা (unlike linear/quadratic probing, যেখানে সবার probing pattern একই)।


**Summary:**

| Technique | Clustering সমস্যা | Complexity |
|---|---|---|
| Linear Probing | বেশি (primary clustering) | সহজ implement করা যায় |
| Quadratic Probing | কম (কিন্তু secondary clustering আছে) | মাঝারি জটিলতা |
| Double Hashing | সবচেয়ে কম | দুইটা hash function লাগে, তুলনামূলক জটিল |

---

## 🗺️ 38. What is the difference between HashMap, TreeMap, and LinkedHashMap (or their equivalents)?

C++ এ এই তিনটার সবচেয়ে কাছাকাছি equivalent হলো: `unordered_map` (HashMap), `map` (TreeMap), এবং একটা custom implementation (LinkedHashMap এর জন্য কোনো direct STL equivalent নেই, তবে concept বোঝানো যাবে)।

| বৈশিষ্ট্য | HashMap (`unordered_map`) | TreeMap (`map`) | LinkedHashMap |
|---|---|---|---|
| Internal structure | Hash table | Self-balancing BST (Red-Black Tree) | Hash table + Doubly Linked List |
| Order | কোনো নির্দিষ্ট order নেই | Keys sorted order এ থাকে | Insertion order (বা access order) বজায় থাকে |
| Access time | Average `O(1)` | `O(log n)` | Average `O(1)` |
| Use case | দ্রুত lookup দরকার, order matter না করলে | Sorted iteration বা range query দরকার হলে | Insertion order বজায় রাখা প্রয়োজন হলে |

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    // unordered_map (HashMap equivalent) - কোনো নির্দিষ্ট order নেই
    unordered_map<string, int> hashMap;
    hashMap["banana"] = 2;
    hashMap["apple"] = 1;
    hashMap["cherry"] = 3;

    cout << "unordered_map (HashMap) iteration order:" << endl;
    for (auto& p : hashMap) {
        cout << p.first << ": " << p.second << endl;
    }

    cout << "\nmap (TreeMap) iteration order (sorted by key):" << endl;
    map<string, int> treeMap;
    treeMap["banana"] = 2;
    treeMap["apple"] = 1;
    treeMap["cherry"] = 3;
    for (auto& p : treeMap) {
        cout << p.first << ": " << p.second << endl;
    }
    return 0;
}
```

```
unordered_map (HashMap) iteration order:
cherry: 3
apple: 1
banana: 2

map (TreeMap) iteration order (sorted by key):
apple: 1
banana: 2
cherry: 3
```
(লক্ষ্য করুন: `unordered_map` এর order প্রতিবার আলাদা/unpredictable হতে পারে, কিন্তু `map` সবসময় key অনুযায়ী sorted থাকে)

---

### Why does TreeMap guarantee sorted order, and what is the trade-off in complexity?

**TreeMap** (C++ এ `std::map`) internally একটা **self-balancing Binary Search Tree** (সাধারণত **Red-Black Tree**) দিয়ে implement করা হয়। BST এর property অনুযায়ী, প্রতিটি node এর বামের সব node তার চেয়ে ছোট এবং ডানের সব node তার চেয়ে বড় থাকে — এই property এর কারণে **in-order traversal** করলে স্বয়ংক্রিয়ভাবে **sorted order** পাওয়া যায়।

**Trade-off:**
- **HashMap**: `O(1)` average lookup, কিন্তু কোনো order নেই
- **TreeMap**: `O(log n)` lookup (BST height এর কারণে), কিন্তু sorted order এবং range query (যেমন "সব key যেগুলো x থেকে y এর মধ্যে") efficient ভাবে করা যায়

তাই TreeMap ব্যবহার করলে আমরা **speed এর বিনিময়ে order** পাই — যদি sorted access দরকার না হয়, HashMap সবসময় দ্রুত।

---

### When would you prefer a LinkedHashMap over a regular HashMap?

**LinkedHashMap** internally একটা **HashMap + Doubly Linked List** এর combination — hash table দ্রুত lookup দেয়, আর linked list **insertion order** (অথবা access order, configuration অনুযায়ী) বজায় রাখে।

**LinkedHashMap preferred হয় যখন:**
1. **Insertion order মনে রাখা প্রয়োজন**, কিন্তু একই সাথে `O(1)` lookup ও চাই (যেমন কোনো configuration file এ যে order এ setting গুলো লেখা হয়েছে, সেই order এ iterate করতে হবে)
2. **LRU Cache implement করার জন্য** — LinkedHashMap এর "access order" mode ব্যবহার করে (Java তে), সবচেয়ে সম্প্রতি ব্যবহৃত element গুলো সবসময় শেষে থাকে, এবং সবচেয়ে পুরনো (least recently used) element সহজে identify করে remove করা যায়
3. **Reproducible iteration order** প্রয়োজন হলে (testing/debugging এ predictable output পাওয়ার জন্য), যেখানে regular HashMap এর order unpredictable

---

## 🛠️ 39. How would you design a HashSet from scratch?

**HashSet** হলো এমন data structure যেখানে শুধু **unique keys** store করা হয়, কোনো value থাকে না। Internally এটা সাধারণত hash table দিয়েই implement করা হয়: key hash করে bucket index বের করা হয়, তারপর collision handle করার জন্য chaining বা open addressing ব্যবহার করা হয়।

নিচের implementation-এ **separate chaining** ব্যবহার করা হয়েছে:

```cpp
#include <bits/stdc++.h>
using namespace std;

class MyHashSet {
    vector<list<int>> buckets;
    int elementCount;
    double maxLoadFactor;

    int hashFunc(int key) const {
        int bucketSize = static_cast<int>(buckets.size());
        return ((key % bucketSize) + bucketSize) % bucketSize;
    }

    double loadFactor() const {
        return (double)elementCount / buckets.size();
    }

    void rehash() {
        vector<int> values;
        for (auto& bucket : buckets) {
            for (int key : bucket) values.push_back(key);
        }

        buckets.clear();
        buckets.resize(values.size() * 2 + 1);
        elementCount = 0;

        for (int key : values) add(key);
    }

public:
    MyHashSet(int initialSize = 8) {
        buckets.resize(initialSize);
        elementCount = 0;
        maxLoadFactor = 0.75;
    }

    void add(int key) {
        if (contains(key)) return;

        if ((double)(elementCount + 1) / buckets.size() > maxLoadFactor) {
            rehash();
        }

        int idx = hashFunc(key);
        buckets[idx].push_back(key);
        elementCount++;
    }

    bool contains(int key) const {
        int idx = hashFunc(key);
        for (int value : buckets[idx]) {
            if (value == key) return true;
        }
        return false;
    }

    void remove(int key) {
        int idx = hashFunc(key);
        for (auto it = buckets[idx].begin(); it != buckets[idx].end(); ++it) {
            if (*it == key) {
                buckets[idx].erase(it);
                elementCount--;
                return;
            }
        }
    }
};

int main() {
    MyHashSet set;

    set.add(10);
    set.add(20);
    set.add(10);

    cout << set.contains(10) << endl;
    cout << set.contains(30) << endl;

    set.remove(10);
    cout << set.contains(10) << endl;

    return 0;
}
```

```text
1
0
0
```


| Operation | Average Case | Worst Case |
|---|---:|---:|
| Add | `O(1)` amortized | `O(n)` |
| Contains | `O(1)` | `O(n)` |
| Remove | `O(1)` | `O(n)` |

Worst case `O(n)` হয় যখন অনেক key একই bucket এ চলে যায়। ভালো hash function এবং controlled load factor থাকলে average case `O(1)` থাকে।

---

### How would you handle resizing when the underlying array becomes too full?

HashSet-এর underlying bucket array বেশি full হয়ে গেলে collision বাড়ে। তাই **load factor** threshold cross করলেই resize করতে হয়।

সাধারণ strategy:

1. `load_factor = number_of_elements / number_of_buckets` calculate করা
2. load factor `0.7` বা `0.75` ছাড়ালে bucket array বড় করা
3. পুরনো সব key নতুন array size অনুযায়ী আবার hash করা
4. নতুন bucket array-তে key গুলো বসানো

Resize operation নিজে `O(n)`, কারণ সব element rehash করতে হয়। কিন্তু resize মাঝে মাঝে হয়, তাই অনেকগুলো insertion মিলিয়ে **amortized insertion cost `O(1)`** থাকে।

---

### How would you implement a HashSet that also supports O(1) retrieval of a random element?

শুধু hash table দিয়ে random element `O(1)` এ নেওয়া কঠিন, কারণ buckets sparse হতে পারে। এর জন্য commonly **array/vector + hash map** combination ব্যবহার করা হয়:

- `vector<int> values`: সব element compact ভাবে রাখে, random index নেওয়া যায়
- `unordered_map<int, int> indexMap`: কোন value vector-এর কোন index এ আছে সেটা রাখে

Remove করার সময় target element-এর জায়গায় vector-এর last element বসিয়ে দেওয়া হয়, তারপর last pop করা হয়। এতে shifting লাগে না, তাই remove `O(1)` থাকে।

```cpp
#include <bits/stdc++.h>
using namespace std;

class RandomizedSet {
    vector<int> values;
    unordered_map<int, int> indexMap;

public:
    bool insert(int val) {
        if (indexMap.count(val)) return false;

        values.push_back(val);
        indexMap[val] = values.size() - 1;
        return true;
    }

    bool remove(int val) {
        if (!indexMap.count(val)) return false;

        int idx = indexMap[val];
        int lastValue = values.back();

        values[idx] = lastValue;
        indexMap[lastValue] = idx;

        values.pop_back();
        indexMap.erase(val);

        return true;
    }

    int getRandom() {
        int idx = rand() % values.size();
        return values[idx];
    }
};
```



| Operation | Time Complexity |
|---|---:|
| Insert | `O(1)` average |
| Remove | `O(1)` average |
| Get Random | `O(1)` |

---

## 🌐 40. What is consistent hashing, and where is it used?

**Consistent Hashing** হলো একটি বিশেষ hashing technique, যা **distributed systems**-এ data (key) কে একাধিক server বা node-এর মধ্যে distribute করার জন্য ব্যবহৃত হয়। এর সবচেয়ে বড় সুবিধা হলো, **server যোগ বা বাদ গেলেও (scale up/down) খুব অল্প সংখ্যক key-এর mapping পরিবর্তন হয়।**


Consistent Hashing-এ একটি **logical circular ring** (hash ring) কল্পনা করা হয়।

* প্রতিটি **server**-কে hash করে ring-এর একটি position-এ বসানো হয়।
* একইভাবে প্রতিটি **key**-কেও hash করে ring-এর উপর বসানো হয়।
* একটি key সর্বদা তার **clockwise direction-এর প্রথম server**-এ assign হয়।
* এই server-টিকে ওই key-এর **successor** বলা হয়।
* যদি clockwise direction-এ আর কোনো server না থাকে, তাহলে ring **wrap around** করে প্রথম server-এ ফিরে আসে।

এভাবে server সংখ্যা পরিবর্তন হলেও পুরো system-এর mapping পরিবর্তন করতে হয় না।

---


### How does Consistent Hashing help with Distributed Caching Systems?

Distributed caching system (যেমন **Memcached**) এ data অনেকগুলো cache server-এর মধ্যে ভাগ করে রাখা হয়। Consistent Hashing এই system-কে efficient এবং scalable করে তোলে।

#### 1. Minimal Data Movement

যখন নতুন cache server যোগ করা হয় বা কোনো server remove/fail করে, তখন **শুধুমাত্র সেই server-এর adjacent (neighboring) অংশের key-গুলোই** remap হয়।

বাকি অধিকাংশ key আগের server-এই থেকে যায়।

এর ফলে—

* Cache hit rate বেশি থাকে
* Database-এ অতিরিক্ত load পড়ে না
* Cache warm-up কম লাগে

---

#### 2. Better Load Balancing (Virtual Nodes)

বাস্তবে প্রতিটি physical server-এর জন্য একাধিক **virtual node (replica)** ring-এর বিভিন্ন স্থানে রাখা হয়।

এর ফলে—

* Key distribution আরও uniform হয়
* কোনো একটি server-এ অতিরিক্ত load পড়ে না
* নতুন server যোগ করলে load আরও সমানভাবে redistribute হয়

যদি virtual node ব্যবহার না করা হয়, তাহলে hash distribution-এর কারণে কিছু server অনেক বেশি key পেতে পারে।

---

#### 3. Easy Scalability

নতুন server যোগ করা বা remove করা সহজ।

পুরো system-এর সব key পুনরায় hash করার দরকার হয় না।

শুধু একটি ছোট অংশের key remap হয়, তাই scale করা অনেক efficient হয়।

---

### What problem does Consistent Hashing solve compared to simple modulo-based hashing?

Simple hashing সাধারণত এভাবে করা হয়—

```cpp
server = hash(key) % number_of_servers;
```

এখানে সবচেয়ে বড় সমস্যা হলো, `number_of_servers` পরিবর্তন হলেই প্রায় সব key-এর mapping পরিবর্তন হয়ে যায়।

#### উদাহরণ

ধরা যাক,

```text
server = hash(key) % 4
```

এখন যদি একটি নতুন server যোগ হয়,

```text
server = hash(key) % 5
```

হয়ে যাবে।

ফলে `N -> N+1` server হলে **প্রায় `N/(N+1)` অংশ key** ভিন্ন server mapping-এ চলে যায়।

উদাহরণস্বরূপ—

* 4 → 5 server হলে প্রায় **80% key**
* 10 → 11 server হলে প্রায় **90% key**

নতুন server-এ remap হয়ে যায়।

এর ফলে—

* Cache miss বেড়ে যায়
* Database-এ হঠাৎ load বেড়ে যায়
* Network traffic বৃদ্ধি পায়
* Cache warm-up করতে সময় লাগে

অনেক ক্ষেত্রে এটিকে **cache miss storm** বা **cache stampede**-এর অন্যতম কারণ হিসেবে দেখা হয়।

---

#### Consistent Hashing কীভাবে এই সমস্যা সমাধান করে?

ধরা যাক,

* মোট key = **K**
* মোট server = **N**

যদি একটি server যোগ বা remove করা হয়, তাহলে গড়ে মাত্র **K/N** সংখ্যক key remap হয়।

উদাহরণ:

* মোট key = **1000**
* মোট server = **10**

তাহলে গড়ে মাত্র

```text
1000 / 10 = 100
```

টি key নতুন server-এ যাবে।

বাকি **900টি key** আগের server-এই থাকবে।

এ কারণেই Consistent Hashing distributed caching system-এর জন্য অত্যন্ত কার্যকর।

---

### Time Complexity

যদি ring-এ মোট **M** টি virtual node থাকে এবং প্রতিটি physical server-এর **V** টি virtual node থাকে, তাহলে—

| Operation     | Time Complexity |
| ------------- | --------------: |
| Add Server    |  **O(V log M)** |
| Remove Server |  **O(V log M)** |
| Find Server   |    **O(log M)** |

---

### কোথায় ব্যবহার হয়?

Consistent Hashing ব্যাপকভাবে ব্যবহৃত হয়—

* Distributed Cache (যেমন Memcached)
* Apache Cassandra
* Riak
* Amazon Dynamo (paper)
* Distributed Key-Value Store
* CDN (Content Delivery Network)
* Distributed Storage Systems
* Load Balancer
* Service Discovery Systems

---
