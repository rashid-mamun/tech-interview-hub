---
sidebar_position: 1
title: 'Data Structures'
---
# 🧠 Data Structures & Algorithms: Interview Questions

---

## 📊 1. Complexity Analysis & Big-O Notation

**📈 1. What is Big-O notation and why is it important?**
- What is the difference between Big-O, Big-Theta (Θ), and Big-Omega (Ω)?
- How do you calculate the time complexity of nested loops?
- What is amortized time complexity, and can you give an example?

**💾 2. What is space complexity, and how is it different from time complexity?**
- What is the difference between auxiliary space and total space complexity?
- How does recursion affect space complexity through the call stack?

**⚖️ 3. What is the difference between best-case, average-case, and worst-case complexity?**
- Why do interviewers usually focus on worst-case complexity?
- Can you give an example where average case differs significantly from worst case (e.g., quicksort)?

**🔁 4. How do you analyze the time complexity of recursive algorithms?**
- What is a recurrence relation?
- What is the Master Theorem and when can it be applied?
- How would you compute the complexity of a recursive Fibonacci function vs. its memoized version?

---

## 🔢 2. Arrays

**📦 5. What is an array, and how is it stored in memory?**
- What is the difference between a static array and a dynamic array (e.g., ArrayList, Python list)?
- How does a dynamic array handle resizing internally, and what is its amortized insertion cost?

**⏱️ 6. What is the time complexity of common array operations (access, search, insertion, deletion)?**
- Why is insertion/deletion at the beginning of an array O(n)?
- How does access by index achieve O(1) time?

**🧮 7. What is a 2D array, and how is it stored in memory?**
- What is the difference between row-major and column-major order?
- How would you rotate a matrix in place by 90 degrees?

**🔍 8. How would you find duplicate elements in an array efficiently?**
- What approaches exist (sorting, hashing, bit manipulation) and what are their trade-offs?
- How would you find the only duplicate in an array of n+1 integers ranging from 1 to n?

**♻️ 9. What is an "in-place" algorithm, and why does it matter for array problems?**
- Can you give an example of an in-place array transformation?
- What is the difference between in-place and out-of-place algorithms in terms of space complexity?

**📐 10. What are prefix sums, and how are they used to optimize array problems?**
- How would you use a prefix sum to answer range sum queries efficiently?
- What is the difference between a prefix sum and a difference array?

---

## 🔤 3. Strings

**🧵 11. How are strings represented and stored internally?**
- Why are strings immutable in languages like Java and Python?
- What is string interning, and how does it save memory?

**➕ 12. Why is repeated string concatenation in a loop inefficient, and what's the alternative?**
- How does StringBuilder (or equivalent) improve performance?
- What is the time complexity of concatenating strings in a loop vs using a builder?

**🔄 13. How do you check if two strings are anagrams of each other?**
- What approaches exist (sorting vs. frequency count) and what are their complexities?
- How would you handle Unicode characters in an anagram check?

**🪞 14. What is a palindrome, and how do you efficiently check for one?**
- How would you check if a string can be rearranged to form a palindrome?
- What is Manacher's algorithm and what problem does it solve?

**🔎 15. What are common string-matching algorithms?**
- How does the naive substring search algorithm work, and what is its worst-case complexity?
- How does the KMP (Knuth-Morris-Pratt) algorithm improve on the naive approach?
- What is the Rabin-Karp algorithm, and how does it use hashing for pattern matching?
- What is the Z-algorithm used for?

---

## 🪟 4. Sliding Window & Two Pointers

**🪟 16. What is the sliding window technique, and what types of problems is it suited for?**
- What is the difference between a fixed-size sliding window and a variable-size (dynamic) sliding window?
- How does the sliding window technique reduce time complexity from O(n²) to O(n)?

**👉👈 17. How does the two-pointer technique work, and what conditions make it applicable?**
- How would you solve the "two sum" problem on a sorted array using two pointers?
- How is the two-pointer technique used to remove duplicates from a sorted array in place?

**🔤 18. How would you find the longest substring without repeating characters?**
- How do you use a hash map alongside the sliding window to track character positions?
- What is the time and space complexity of your solution?

**📊 19. How would you find the smallest subarray with a sum greater than or equal to a target value?**
- How does the sliding window shrink and grow based on the running sum?

**🎯 20. How would you solve the "minimum window substring" problem?**
- How do you track which characters are "needed" vs. "satisfied" within the window?

---

## 🔗 5. Linked Lists

**🪢 21. What is a linked list, and how does it differ from an array?**
- What is the difference between a singly linked list, doubly linked list, and circular linked list?
- What are the trade-offs of linked lists vs arrays in terms of memory and access time?

**🔁 22. How do you reverse a linked list?**
- How would you do it iteratively vs recursively?
- How would you reverse a linked list in groups of k?

**🐢🐇 23. How do you detect a cycle in a linked list?**
- How does Floyd's cycle detection algorithm (tortoise and hare) work?
- How would you find the starting node of the cycle once detected?

**🎯 24. How do you find the middle of a linked list in a single pass?**
- How does the slow/fast pointer technique work here?
- How would you check if a linked list is a palindrome using this technique?

**🔀 25. How would you merge two sorted linked lists?**
- What is the time and space complexity of your approach?
- How would you merge k sorted linked lists efficiently?

**🪜 26. What is a skip list, and how does it improve search performance over a regular linked list?**
- What is the expected time complexity of search, insert, and delete in a skip list?

---

## 📚 6. Stacks

**📥 27. What is a stack, and what are its core operations?**
- What does LIFO (Last In, First Out) mean?
- What are real-world applications of stacks (call stack, undo/redo, expression parsing)?

**🏗️ 28. How would you implement a stack using an array vs. a linked list?**
- What are the trade-offs between the two implementations?
- How would you implement a stack using two queues?

**🧮 29. How do you evaluate postfix or prefix expressions using a stack?**
- How would you convert an infix expression to postfix (Shunting Yard algorithm)?
- How do you handle operator precedence and parentheses?

**📈 30. What is the "next greater element" problem, and how is it solved using a stack?**
- How would you find the next greater element for every element in an array in O(n)?
- How is a monotonic stack used in problems like "largest rectangle in histogram"?

**⬇️⬆️ 31. How would you design a stack that supports retrieving the minimum/maximum element in O(1)?**
- What additional data structure would you use alongside the stack?
- How do you handle duplicates when popping elements?

---

## 🚶 7. Queues

**📤 32. What is a queue, and what are its core operations?**
- What does FIFO (First In, First Out) mean?
- What is the difference between a queue, a deque (double-ended queue), and a circular queue?

**🔁 33. How would you implement a queue using two stacks?**
- What is the time complexity of enqueue and dequeue in your implementation?
- How would you implement a stack using two queues?

**⭐ 34. What is a priority queue, and how does it differ from a regular queue?**
- How is a priority queue typically implemented internally?
- What are common use cases for priority queues (Dijkstra's algorithm, task scheduling)?

**📉 35. What is a monotonic queue/deque, and where is it used?**
- How would you solve the "sliding window maximum" problem using a monotonic deque?
- What is the time complexity of this approach compared to a brute-force solution?

---

## 🗂️ 8. Hash Tables / Hash Maps

**🔑 36. What is a hash table, and how does it achieve average O(1) lookup time?**
- What is a hash function, and what properties make a good one?
- What is a load factor, and how does it affect performance and resizing?

**💥 37. How do hash tables handle collisions?**
- What is the difference between open addressing and chaining?
- What is the difference between linear probing, quadratic probing, and double hashing?

**🗺️ 38. What is the difference between HashMap, TreeMap, and LinkedHashMap (or their equivalents)?**
- Why does TreeMap guarantee sorted order, and what is the trade-off in complexity?
- When would you prefer a LinkedHashMap over a regular HashMap?

**🛠️ 39. How would you design a HashSet from scratch?**
- How would you handle resizing when the underlying array becomes too full?
- How would you implement a HashSet that also supports O(1) retrieval of a random element?

**🌐 40. What is consistent hashing, and where is it used?**
- How does consistent hashing help with distributed caching systems?
- What problem does consistent hashing solve compared to simple modulo-based hashing?

---

## 🌳 9. Trees

**🌲 41. What is a tree data structure, and what is its terminology (root, leaf, height, depth, degree)?**
- What is the difference between height and depth of a node?
- What is the difference between a tree and a graph?

**🔀 42. What is the difference between a binary tree, a binary search tree (BST), and a balanced tree?**
- What is a full binary tree vs. a complete binary tree vs. a perfect binary tree?
- What is a balanced binary tree, and why does balance matter for performance?

**🚶 43. What are the different tree traversal methods?**
- How do in-order, pre-order, and post-order traversals differ, and what is each typically used for?
- How would you implement these traversals iteratively using a stack?
- How does level-order (BFS) traversal differ from the other traversal types?

**📏 44. How do you find the height (or maximum depth) of a binary tree?**
- What is the time and space complexity of a recursive solution?
- How would you solve this iteratively using BFS?

**⚖️ 45. How do you check whether a binary tree is height-balanced?**
- What is the time complexity of a naive vs. optimized approach?
- How is this related to the definition of an AVL tree?

**📐 46. What is the diameter of a binary tree, and how do you compute it?**
- Does the diameter always pass through the root? Why or why not?
- How would you compute it in a single traversal?

**🔄 47. How would you serialize and deserialize a binary tree?**
- What traversal order is commonly used for serialization, and why?
- How do you handle null nodes during serialization?

---

## ⚖️ 10. Binary Search Trees (BST)

**🌳 48. What is a BST, and what property must every node satisfy?**
- Why does an in-order traversal of a BST produce sorted output?
- What is the difference between a BST and a balanced BST?

**🔍 49. How do you search, insert, and delete a node in a BST?**
- What happens when you delete a node that has two children?
- What is the time complexity of these operations in a balanced vs. unbalanced BST?

**✅ 50. How would you validate whether a given binary tree is a valid BST?**
- What is the common mistake when only comparing a node to its immediate children?
- How would you solve this using bounds (min/max range) passed down recursively?

**🌀 51. Why can BST operations degrade to O(n) in the worst case, and how is this avoided?**
- What input pattern causes a BST to become a "skewed" tree?
- How do self-balancing trees prevent this degradation?

**🔄 52. What are self-balancing BSTs, such as AVL trees and Red-Black trees?**
- How does an AVL tree maintain balance using rotations (left, right, left-right, right-left)?
- What is the difference between an AVL tree and a Red-Black tree in terms of balance guarantees and use cases?
- Where are Red-Black trees commonly used in real systems (e.g., language standard libraries)?

**🥇 53. How do you find the kth smallest or kth largest element in a BST?**
- How would augmenting each node with subtree size help answer this in O(log n)?
- How would you find the in-order predecessor and successor of a given node?

---

## ⛰️ 11. Heaps and Priority Queues

**🏔️ 54. What is a heap, and how does it differ from a binary search tree?**
- What is the heap property, and how does it differ from the BST property?
- Is a heap always a complete binary tree? Why does that matter for array-based implementation?

**⬆️⬇️ 55. What is the difference between a min-heap and a max-heap?**
- How would you implement a max-heap using a min-heap (or vice versa)?

**📊 56. How is a heap implemented using an array?**
- How do you calculate the indices of a node's parent, left child, and right child?
- What are the "heapify-up" and "heapify-down" (sift up/down) operations?

**⏱️ 57. What is the time complexity of heap operations (insert, extract-min/max, build-heap)?**
- Why is building a heap from an array O(n) rather than O(n log n)?
- What is the time complexity of heap sort, and is it stable?

**🥇 58. How would you find the kth largest (or smallest) element in an unsorted array?**
- How does using a heap compare to sorting the entire array first?
- How does the Quickselect algorithm compare in terms of average-case complexity?

**🔗 59. How would you merge k sorted arrays or lists efficiently using a heap?**
- What is the time complexity of this approach?
- How does this relate to the "merge k sorted linked lists" problem?

---

## 🕸️ 12. Graphs

**🗺️ 60. What is a graph, and how is it represented in code?**
- What is the difference between an adjacency matrix and an adjacency list?
- What are the trade-offs of each representation in terms of space and time for different operations?

**➡️ 61. What is the difference between a directed graph and an undirected graph?**
- What is a weighted graph, and how does it change traversal algorithms?
- What is a multigraph, and where might it appear in real systems?

**🚶🔍 62. What are BFS and DFS, and when would you use each?**
- What is the time and space complexity of BFS and DFS?
- How is BFS used to find the shortest path in an unweighted graph?
- How is DFS used to detect connected components?

**🔄 63. How do you detect a cycle in a graph?**
- How does cycle detection differ between directed and undirected graphs?
- How does the "white-gray-black" coloring technique work for cycle detection in directed graphs?

**📋 64. What is topological sorting, and where is it used?**
- What is the precondition for a graph to have a valid topological order?
- How would you implement topological sort using DFS vs. using Kahn's algorithm (BFS-based)?

**🛣️ 65. What are the common shortest-path algorithms, and how do they differ?**
- How does Dijkstra's algorithm work, and why doesn't it work correctly with negative edge weights?
- How does the Bellman-Ford algorithm handle negative weights, and how does it detect negative cycles?
- How does the Floyd-Warshall algorithm compute all-pairs shortest paths, and what is its time complexity?

**🌲 66. What is a minimum spanning tree (MST), and how do Prim's and Kruskal's algorithms differ?**
- What data structure does Kruskal's algorithm rely on, and why?
- In what scenarios would you prefer Prim's algorithm over Kruskal's (or vice versa)?

**🔗 67. What are strongly connected components (SCCs), and how are they found?**
- What is the difference between a strongly connected component and a weakly connected component?
- How do Tarjan's and Kosaraju's algorithms find SCCs?

**🌐 68. What is bipartite graph checking, and how is it done?**
- How would you use BFS or DFS with two-coloring to check if a graph is bipartite?
- What real-world problems can be modeled as bipartite matching?

---

## 🔄 13. Recursion and Backtracking

**🔁 69. What is recursion, and what are its essential components?**
- What is a base case, and why is it critical to avoid infinite recursion?
- What is the difference between direct and indirect recursion?

**⚙️ 70. What is the difference between recursion and iteration?**
- What is tail recursion, and how can it optimize stack usage?
- Why might some languages not optimize tail-recursive calls even when written that way?

**🧩 71. What is backtracking, and how does it differ from plain brute force?**
- What is the role of "pruning" in backtracking algorithms?
- Can you describe the general template for a backtracking solution?

**👑 72. How would you solve the N-Queens problem using backtracking?**
- How do you efficiently check if a position is under attack without re-scanning the board each time?
- What is the time complexity of the brute-force vs. optimized backtracking approach?

**💭 73. How does memoization improve recursive algorithms?**
- What is the difference between memoization and tabulation?
- Can you walk through how memoization transforms an exponential recursive Fibonacci into a linear-time solution?

**🔢 74. How would you generate all permutations or combinations of a set using recursion?**
- How do permutations differ from combinations in terms of approach?
- How would you generate all subsets of a set (the power set)?

---

## ✂️ 14. Divide and Conquer

**🪓 75. What is the divide and conquer paradigm, and what are its three main steps?**
- How do "divide," "conquer," and "combine" map onto an algorithm like merge sort?
- What distinguishes divide and conquer from dynamic programming when subproblems overlap?

**📐 76. What is the Master Theorem, and how is it used to analyze divide and conquer algorithms?**
- How would you apply the Master Theorem to derive the time complexity of merge sort?

**📈 77. How does the divide and conquer approach apply to the "maximum subarray sum" problem?**
- How does the divide and conquer solution compare in complexity to Kadane's algorithm (O(n))?
- Why might Kadane's algorithm be preferred in practice despite both having different complexities?

**🔢 78. How would you find the closest pair of points in a 2D plane using divide and conquer?**
- Why is sorting points by x-coordinate (and handling a "strip" near the dividing line) important here?

---

## 🧩 15. Dynamic Programming

**📐 79. What is dynamic programming, and when should it be applied?**
- What are the two main approaches to DP: top-down (memoization) and bottom-up (tabulation)?
- What is the difference between DP and divide and conquer?

**🧱 80. What are "optimal substructure" and "overlapping subproblems," and why are they essential for DP?**
- Can you give an example of a problem that has overlapping subproblems but is NOT typically solved with DP?
- How do you identify whether a problem can be solved using DP?

**🎒 81. How would you solve the classic 0/1 knapsack problem?**
- How does the DP table get constructed, and what do its dimensions represent?
- How would you optimize the space complexity from O(n*W) to O(W)?

**📏 82. How does the Longest Common Subsequence (LCS) problem work?**
- How is the DP table for LCS constructed, and how do you trace back the actual subsequence?
- How does LCS relate to the "edit distance" problem?

**📈 83. How do you approach the Longest Increasing Subsequence (LIS) problem?**
- What is the O(n²) DP solution, and how does it work?
- How can LIS be solved in O(n log n) using binary search?

**💰 84. How is the coin change problem solved using DP?**
- What is the difference between "minimum number of coins" and "number of ways to make change" variants?
- How does this problem relate to the unbounded knapsack problem?

**🛣️ 85. How would you solve grid-based DP problems (e.g., unique paths, minimum path sum)?**
- How do you define the state and transition for a 2D grid DP problem?
- How would you handle obstacles in the grid?

---

## 💰 16. Greedy Algorithms

**🎯 86. What is a greedy algorithm, and how does it differ from dynamic programming?**
- Why do greedy algorithms not always guarantee an optimal solution?
- What is the "greedy choice property," and how do you prove a greedy algorithm is correct?

**📅 87. How does the greedy approach work for the activity/interval selection problem?**
- Why does sorting by end time (rather than start time or duration) lead to an optimal solution?
- How would you modify this approach to find the minimum number of meeting rooms required?

**🌳 88. How does Huffman encoding use a greedy approach?**
- How is a priority queue used to build the Huffman tree?
- Why does this approach guarantee an optimal prefix-free encoding?

**🎒 89. What is the difference between the greedy approach to the fractional knapsack problem and the DP approach to the 0/1 knapsack problem?**
- Why does the greedy approach work for the fractional version but not the 0/1 version?

**🔢 90. How would you solve the "jump game" type of problem using a greedy approach?**
- How do you track the "farthest reachable index" while iterating?
- How does this compare to a DP or BFS-based solution in terms of efficiency?

---

## 🔀 17. Sorting Algorithms

**📋 91. What are the common sorting algorithms, and what are their time and space complexities?**
- How do bubble sort, selection sort, and insertion sort compare in terms of performance and use cases?
- Why is insertion sort often used for small or nearly-sorted datasets?

**🔒 92. What is the difference between stable and unstable sorting algorithms?**
- Why does stability matter when sorting objects with multiple keys?
- Which common algorithms are stable, and which are not?

**⚡ 93. How does quicksort work, and what is its worst-case time complexity?**
- How do you choose a good pivot to avoid the O(n²) worst case?
- How does the "Lomuto" partition scheme differ from the "Hoare" partition scheme?

**🔗 94. How does merge sort work, and why is it often preferred for linked lists?**
- Why is merge sort's time complexity always O(n log n), regardless of input order?
- What is the space complexity of merge sort, and can it be implemented in-place?

**🔢 95. What is the difference between comparison-based and non-comparison-based sorting algorithms?**
- How does counting sort achieve O(n+k) time, and what are its limitations?
- How does radix sort work, and when is it preferable to comparison-based sorts?

**🏔️ 96. When would you use heap sort over quicksort or merge sort?**
- What are the trade-offs of heap sort in terms of stability and cache performance?

---

## 🔍 18. Searching Algorithms

**🎯 97. How does binary search work, and what are its prerequisites?**
- Why must the input be sorted (or have some monotonic property) for binary search to work?
- What is the time complexity of binary search, and how does it compare to linear search?

**🔄 98. How would you perform binary search on a rotated sorted array?**
- How do you determine which half of the array is sorted at each step?
- How would your approach change if the array contains duplicate values?

**📐 99. What is the difference between "search for exact value" and "search for boundary" (lower bound/upper bound) binary search variants?**
- How would you find the first and last occurrence of a target value in a sorted array?

**♾️ 100. How would you search in an array of unknown or infinite size?**
- How would you use exponential search combined with binary search?

**🔢 101. What is ternary search, and when might it be useful?**
- How does ternary search compare to binary search in terms of efficiency, and why is binary search usually preferred?

---

## 🔢 19. Bit Manipulation

**⚙️ 102. What are the common bitwise operators, and what are typical use cases for each?**
- How do AND, OR, XOR, NOT, left shift, and right shift behave at the bit level?
- How would you use bit shifting to multiply or divide by powers of two?

**2️⃣ 103. How do you check if a number is a power of two using bit manipulation?**
- Why does `n & (n-1) == 0` work for this check?
- What edge cases (like zero or negative numbers) need to be handled?

**🔢 104. How do you count the number of set bits (1s) in an integer's binary representation?**
- What is "Brian Kernighan's algorithm," and how does it improve on checking each bit individually?

**⊕ 105. How is XOR used to solve problems like "find the unique element in an array where every other element appears twice"?**
- Why does XOR-ing all elements together cancel out pairs?
- How would you extend this approach if every element appears three times except one?

**🎭 106. How do bitmasks help in solving subset-related problems?**
- How would you use a bitmask to represent and iterate over all subsets of a set?
- How is bitmasking used in DP problems like the "traveling salesman problem" (bitmask DP)?

---
