---
sidebar_position: 5
title: 'Packages'
---

## 1. What is a package manager in Linux?

**Package manager** হলো এমন tool, যা software install, update, configure এবং remove করার process automate করে। এটি dependency resolve করে, trusted repository থেকে package download করে এবং installed software-এর state track করে।

### How does a package manager work?
1. **Repositories (Repos):**
   - A package manager fetches software from **official repositories (online storage of packages).**
   - Example: Ubuntu gets packages from `archive.ubuntu.com`.

2. **Installing Software:**
   - When you install software, the package manager:
     ✅ Downloads the package from the repository.
     ✅ Resolves dependencies (installs additional required software).
     ✅ Installs and configures the software automatically.

3. **Updating Software:**
   - A single command updates all installed packages to the latest version.

4. **Removing Software:**
   - The package manager also **removes** software cleanly without leaving unnecessary files.

### Which package manager does each distribution use?
| Linux Distro   | Package Manager | Command Example |
|---------------|----------------|----------------|
| Ubuntu, Debian | `apt` (Advanced Package Tool) | `sudo apt install nginx` |
| Fedora, RHEL, CentOS | `dnf` (or `yum` for older versions) | `sudo dnf install nginx` |
| Arch Linux | `pacman` | `sudo pacman -S nginx` |
| OpenSUSE | `zypper` | `sudo zypper install nginx` |

## 2. How do package managers fetch software from repositories?

**Repository** হলো server-side storage, যেখানে package file, version metadata, dependency information এবং signature থাকে। Package manager install করার সময়:

1. It **checks the repository list** (e.g., `/etc/apt/sources.list` in Ubuntu).
2. It **downloads the package** and its dependencies.
3. It **installs and configures the software** automatically.

### What does an Ubuntu repository entry look like?
```plaintext
Types: deb
URIs: http://ports.ubuntu.com/ubuntu-ports/
Suites: noble noble-updates noble-backports noble-security
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

## 3. Why should you run `apt update` after installing Ubuntu?

Ubuntu ISO-তে থাকা local package index সময়ের সঙ্গে outdated হতে পারে। প্রথমে প্রয়োজন হলে `sudo` install করে repository metadata refresh করা যায়:
```bash
apt install sudo
sudo apt update
```
`sudo apt update` repository থেকে available package list refresh করে; এটি installed application upgrade করে না।

Installed package-এর latest compatible version apply করতে চালান:
```bash
sudo apt upgrade -y
```

## 4. What are the essential package-manager commands?

### APT: Debian and Ubuntu
```bash
sudo apt update         # Update package lists
sudo apt upgrade -y     # Upgrade installed packages
sudo apt install nginx  # Install a package
sudo apt remove nginx   # Remove a package
sudo apt autoremove     # Remove unused dependencies
sudo apt search nginx   # Search for a package
```

### DNF: Fedora, RHEL, and CentOS
```bash
sudo dnf check-update   # Check for updates
sudo dnf update         # Update all packages
sudo dnf install nginx  # Install a package
sudo dnf remove nginx   # Remove a package
```

### Pacman: Arch Linux
```bash
sudo pacman -Syu        # Sync and update all packages
sudo pacman -S nginx    # Install a package
sudo pacman -R nginx    # Remove a package
```

### Zypper: OpenSUSE
```bash
sudo zypper refresh     # Refresh package list
sudo zypper update      # Update all packages
sudo zypper install nginx  # Install a package
sudo zypper remove nginx   # Remove a package
```

## 5. What are the package-management best practices?
- ✅ **Always update your package list before installing software:**
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- ✅ **Use `autoremove` to clean up unused dependencies:**
  ```bash
  sudo apt autoremove
  ```
- ✅ **Enable automatic security updates (Ubuntu):**
  ```bash
  sudo apt install unattended-upgrades
  sudo dpkg-reconfigure unattended-upgrades
  ```

Package manager-এর administrative command শুধু system change প্রয়োজন হলে চালানো উচিত। Package source, package name এবং proposed removal list transaction confirm করার আগে review করুন।

:::tip Interview summary
Repository package সরবরাহ করে, package manager dependency ও installed state পরিচালনা করে, `apt update` metadata refresh করে এবং `apt upgrade` installed package update করে।
:::
