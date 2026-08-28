---
title: 'Permissions'
---

## 1. How do Linux file permissions work?

Linux file permission নির্ধারণ করে কে file বা directory read, write অথবা execute করতে পারবে। Permission তিনটি identity class-এর জন্য আলাদাভাবে থাকে:

- **Owner (User):** File-এর owner।
- **Group:** Assigned group-এর member।
- **Others:** System-এর অন্য সব user।

Permission representation:

- **Read (`r` or `4`)** – File content দেখা।
- **Write (`w` or `2`)** – File content পরিবর্তন করা।
- **Execute (`x` or `1`)** – Script বা program চালানো।

To check file permissions, use:
```bash
ls -l filename
```
Output example:
```bash
-rwxr--r-- 1 user group 1234 Mar 28 10:00 myfile.sh
```

## 2. How do you change permissions with `chmod`?
### Using Symbolic Mode
Modify permissions using symbols:
- Add (`+`), remove (`-`), or set (`=`) permissions.

Examples:
```bash
chmod u+x filename  # Add execute for user
chmod g-w filename  # Remove write for group
chmod o=r filename  # Set read-only for others
chmod u=rwx,g=rx,o= filename  # Set full access for user, read/execute for group, and no access for others
```

### Using Numeric (Octal) Mode
Each permission has a value:
- Read (`4`), Write (`2`), Execute (`1`).

Examples:
```bash
chmod 755 filename  # User (rwx), Group (r-x), Others (r-x)
chmod 644 filename  # User (rw-), Group (r--), Others (r--)
chmod 700 filename  # User (rwx), No access for others
```

## 3. How do you change ownership with `chown`?

File owner এবং group পরিবর্তন করতে:
```bash
chown newuser filename  # Change owner
chown newuser:newgroup filename  # Change owner and group
chown :newgroup filename  # Change only group
```

Recursively change ownership:
```bash
chown -R newuser:newgroup directory/
```

Recursive ownership changes can affect every file below the target directory. Verify the resolved path before using `-R`, especially with administrative privileges.

## 4. How do you change group ownership with `chgrp`?
```bash
chgrp newgroup filename  # Change group
chgrp -R newgroup directory/  # Change group recursively
```

## 5. What are SetUID, SetGID, and the sticky bit?
### SetUID (`s` on user execute bit)
Allows users to run a file with the file owner's permissions.
```bash
chmod u+s filename
```
Example: `/usr/bin/passwd` allows users to change their passwords.

### SetGID (`s` on group execute bit)
Files: Users run the file with the group's permissions.
Directories: Files created inside inherit the group.
```bash
chmod g+s filename  # Set on file
chmod g+s directory/  # Set on directory
```

### Sticky Bit (`t` on others execute bit)
Used on directories to allow only the owner to delete their files.
```bash
chmod +t directory/
```
Example: `/tmp` directory.

## 6. How does `umask` control default permissions?

`umask` নতুন file ও directory থেকে কোন permission bit বাদ যাবে তা নির্ধারণ করে।
Check current umask:
```bash
umask
```
Set a new umask:
```bash
umask 022  # Default: 755 for directories, 644 for files
```

## 7. What is the safest permission strategy?

`chmod`, `chown` এবং `chgrp` দিয়ে access control করা যায়। **Least privilege** অনুসরণ করে user বা service-কে শুধু প্রয়োজনীয় read, write অথবা execute permission দিন।

:::tip Interview summary
`chmod` permission বদলায়, `chown` owner/group বদলায়, `chgrp` group বদলায় এবং `umask` default permission mask নির্ধারণ করে। SetUID, SetGID ও sticky bit special behavior যোগ করে।
:::
