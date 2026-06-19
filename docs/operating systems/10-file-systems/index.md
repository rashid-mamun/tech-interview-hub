---
sidebar_position: 10
title: 'File Systems'
---

## 📁 10. What is a file system?

File system disk-এর data file/directory হিসেবে organize করে। এটি naming, metadata, permission, allocation, free space manage করে।

### 🔖 Inode

Unix-like system-এ inode file metadata রাখে।

```text
inode:
- file type
- permission
- owner
- size
- timestamps
- data block pointers
```

File name directory entry-তে থাকে, inode-এ না।

### 🔗 Hard link vs symbolic link

| Topic | Hard link | Symbolic link |
|---|---|---|
| Points to | inode | path |
| Original delete হলে | data থাকে যতক্ষণ link count > 0 | broken link হতে পারে |
| Cross filesystem | usually no | yes |

### 📝 Journaling

Journaling file system crash recovery improve করে। Metadata update আগে journal/log-এ লেখা হয়, তারপর actual structure update হয়।

```text
Intent write -> actual update -> mark committed
```

### 📂 File allocation methods

| Method | Pros | Cons |
|---|---|---|
| Contiguous | fast sequential access | external fragmentation |
| Linked | easy grow | random access slow |
| Indexed | random access good | index overhead |
