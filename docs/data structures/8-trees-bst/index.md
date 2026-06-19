---
sidebar_position: 8
title: 'Trees & BST'
---


## 🌲 41. What is a tree data structure, and what is its terminology (root, leaf, height, depth, degree)?
- What is the difference between height and depth of a node?
- What is the difference between a tree and a graph?

## 🔀 42. What is the difference between a binary tree, a binary search tree (BST), and a balanced tree?
- What is a full binary tree vs. a complete binary tree vs. a perfect binary tree?
- What is a balanced binary tree, and why does balance matter for performance?

## 🚶 43. What are the different tree traversal methods?
- How do in-order, pre-order, and post-order traversals differ, and what is each typically used for?
- How would you implement these traversals iteratively using a stack?
- How does level-order (BFS) traversal differ from the other traversal types?

## 📏 44. How do you find the height (or maximum depth) of a binary tree?
- What is the time and space complexity of a recursive solution?
- How would you solve this iteratively using BFS?

## ⚖️ 45. How do you check whether a binary tree is height-balanced?
- What is the time complexity of a naive vs. optimized approach?
- How is this related to the definition of an AVL tree?

## 📐 46. What is the diameter of a binary tree, and how do you compute it?
- Does the diameter always pass through the root? Why or why not?
- How would you compute it in a single traversal?

## 🔄 47. How would you serialize and deserialize a binary tree?
- What traversal order is commonly used for serialization, and why?
- How do you handle null nodes during serialization?



## 🌳 48. What is a BST, and what property must every node satisfy?
- Why does an in-order traversal of a BST produce sorted output?
- What is the difference between a BST and a balanced BST?

## 🔍 49. How do you search, insert, and delete a node in a BST?
- What happens when you delete a node that has two children?
- What is the time complexity of these operations in a balanced vs. unbalanced BST?

## ✅ 50. How would you validate whether a given binary tree is a valid BST?
- What is the common mistake when only comparing a node to its immediate children?
- How would you solve this using bounds (min/max range) passed down recursively?

## 🌀 51. Why can BST operations degrade to O(n) in the worst case, and how is this avoided?
- What input pattern causes a BST to become a "skewed" tree?
- How do self-balancing trees prevent this degradation?

## 🔄 52. What are self-balancing BSTs, such as AVL trees and Red-Black trees?
- How does an AVL tree maintain balance using rotations (left, right, left-right, right-left)?
- What is the difference between an AVL tree and a Red-Black tree in terms of balance guarantees and use cases?
- Where are Red-Black trees commonly used in real systems (e.g., language standard libraries)?

## 🥇 53. How do you find the kth smallest or kth largest element in a BST?
- How would augmenting each node with subtree size help answer this in O(log n)?
- How would you find the in-order predecessor and successor of a given node?

---