---
title: 'Users'
---

## 1. How does user management work in Linux?

Linux একটি multi-user operating system, তাই একই system-এ একাধিক user আলাদা identity ও permission নিয়ে কাজ করতে পারে। Proper user management controlled access, accountability এবং system integrity নিশ্চিত করে।

User management-এর গুরুত্বপূর্ণ file:

- `/etc/passwd` – User account-এর basic detail রাখে।
- `/etc/shadow` – Password hash ও password-aging information নিরাপদে রাখে।
- `/etc/group` – Group information ও supplementary membership রাখে।
- `/etc/gshadow` – Secure group information রাখে।

## 2. How do you create users in Linux?

নতুন user তৈরি করতে distribution অনুযায়ী `useradd` বা `adduser` ব্যবহার করা যায়।

### `useradd` Command (For most Linux distributions)
```bash
useradd username
```
এটি home directory ছাড়া user account তৈরি করে।

Home directory-সহ user তৈরি করতে:
```bash
useradd -m username
```

Default login shell নির্ধারণ করতে:
```bash
useradd -s /bin/bash username
```

### `adduser` Command (For Debian-based systems)
```bash
adduser username
```
এটি interactive command; password ও additional user detail জানতে চায়।

## 3. How do you manage user passwords?

User-এর password set বা change করতে:
```bash
passwd username
```

### Enforcing Password Policies
- **Password expiration**: Set password expiry days
  ```bash
  chage -M 90 username
  ```
- **Lock a user account**
  ```bash
  passwd -l username
  ```
- **Unlock a user account**
  ```bash
  passwd -u username
  ```

## 4. How do you modify an existing user?

`usermod` দিয়ে existing user-এর name, home directory, shell এবং group membership পরিবর্তন করা যায়:
- Change the username:
  ```bash
  usermod -l new_username old_username
  ```
- Change the home directory:
  ```bash
  usermod -d /new/home/directory -m username
  ```
- Change the default shell:
  ```bash
  usermod -s /bin/zsh username
  ```

## 5. How do you delete a user safely?

Home directory রেখে শুধু user account remove করতে:
```bash
userdel username
```
User account-এর সঙ্গে home directory-ও remove করতে:
```bash
userdel -r username
```

:::caution Verify before deletion
`userdel -r username` also removes the user's home directory and mail spool. Confirm the account name and preserve required data before running it.
:::

## 6. How do you manage Linux groups?
### Creating Groups
```bash
groupadd groupname
```

### Adding Users to Groups
```bash
usermod -aG groupname username
```

### Viewing Group Memberships
```bash
groups username
```

### Changing Primary Group
```bash
usermod -g new_primary_group username
```

## 7. How do you grant sudo access?
### Adding a User to Sudo Group
On Debian-based systems:
```bash
usermod -aG sudo username
```
On RHEL-based systems:
```bash
usermod -aG wheel username
```

### Granting Specific Commands with Sudo
Edit the sudoers file:
```bash
visudo
```
Then add:
```bash
username ALL=(ALL) NOPASSWD: /path/to/command
```

`visudo` save করার আগে sudoers syntax validate করে, তাই সরাসরি file edit করার চেয়ে এটি নিরাপদ। Unrestricted passwordless access না দিয়ে প্রয়োজনীয় সবচেয়ে narrow command permission দেওয়া উচিত।

:::tip Interview summary
User identity `/etc/passwd`, password hash `/etc/shadow`, group data `/etc/group` এবং secure group data `/etc/gshadow`-এ থাকে। Account lifecycle-এর জন্য `useradd`, `usermod`, `passwd`, `userdel` এবং group command ব্যবহার করা হয়।
:::
