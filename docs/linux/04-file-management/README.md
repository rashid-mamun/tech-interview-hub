---
title: 'Files'
---

## 1. How do you manage files and directories in Linux?

Linux file management path এবং ছোট composable command-এর ওপর তৈরি। `/` দিয়ে শুরু হওয়া path **absolute path**, আর current working directory থেকে লেখা path **relative path**।

### Which commands manage files and directories?

1. **`ls`** – Current location-এর file ও directory list দেখায়।
2. **`cd /path/to/directory`** – Working directory পরিবর্তন করে।
3. **`pwd`** – Current working directory-এর absolute path দেখায়।
4. **`mkdir new_folder`** – নতুন directory তৈরি করে।
5. **`rmdir empty_folder`** – Empty directory remove করে।
6. **`rm file.txt`** – একটি file delete করে।
7. **`rm -r folder`** – Directory ও তার সব content recursively delete করে।
8. **`cp file1.txt file2.txt`** – একটি file copy করে।
9. **`cp -r dir1 dir2`** – একটি directory recursively copy করে।
10. **`mv old_name new_name`** – File বা directory move অথবা rename করে।

:::warning Before deleting files
`rm file.txt` and especially `rm -r folder` permanently remove data instead of moving it to a recycle bin. Verify the target path first; interactive options such as `rm -i` can reduce accidental deletion.
:::

## 2. How do you view and edit files?

11. **`cat file.txt`** – পুরো file content output করে।
12. **`tac file.txt`** – File-এর line reverse order-এ output করে।
13. **`less file.txt`** – Scroll ও search support-সহ file দেখতে দেয়।
14. **`more file.txt`** – `less`-এর মতো viewer, তবে মূলত forward navigation দেয়।
15. **`head -n 10 file.txt`** – File-এর প্রথম 10 line দেখায়।
16. **`tail -n 10 file.txt`** – File-এর শেষ 10 line দেখায়।
17. **`nano file.txt`** – Simple terminal text editor-এ file খোলে।
18. **`vi file.txt`** – Powerful modal text editor-এ file খোলে।
19. **`echo 'Hello' > file.txt`** – Existing content overwrite করে text লেখে।
20. **`echo 'Hello' >> file.txt`** – Existing content না মুছে শেষে text append করে।

### Which command should you choose?

| Goal | Preferred command |
|---|---|
| Confirm the current directory | `pwd` |
| Inspect directory contents | `ls` |
| Browse a long text file | `less file.txt` |
| Inspect the beginning or end of a file | `head -n 10 file.txt` or `tail -n 10 file.txt` |
| Copy while preserving the source | `cp file1.txt file2.txt` |
| Rename or relocate an item | `mv old_name new_name` |
| Append a simple line | `echo 'Hello' >> file.txt` |

`>` operator file-এর আগের content replace করে, আর `>>` শেষে append করে। যেকোনো operator ব্যবহারের আগে destination path যাচাই করুন।

:::tip Interview summary
`pwd`, `cd` ও `ls` navigation-এর জন্য; `cp` copy, `mv` move/rename এবং `rm` delete করার জন্য। Large file পড়তে `less`, আর recent line দেখতে `tail` বেশি practical।
:::
