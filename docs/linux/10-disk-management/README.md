---
title: 'Storage'
---

## 1. How does Linux disk and storage management work?

Linux storage management-এর flow সাধারণত device inspect → partition → filesystem format → mount। LVM physical storage-এর ওপর flexible logical volume দেয়, আর swap RAM pressure-এর সময় disk-backed memory area হিসেবে কাজ করে।

### Which storage commands are covered?

### Viewing Disk Information
- `lsblk` – Display block devices
- `fdisk -l` – List disk partitions
- `blkid` – Show UUIDs of devices
- `df -h` – Check disk space usage
- `du -sh /path` – Show size of a directory

### Partition Management
- `fdisk /dev/sdX` – Create and manage partitions
- `parted /dev/sdX` – Alternative to `fdisk` for GPT disks
- `mkfs.ext4 /dev/sdX1` – Format a partition as ext4
- `mkfs.xfs /dev/sdX1` – Format a partition as XFS

### Mounting and Unmounting
- `mount /dev/sdX1 /mnt` – Mount a partition
- `umount /mnt` – Unmount a partition
- `mount -o remount,rw /mnt` – Remount a partition as read-write

### Logical Volume Management (LVM)
- `pvcreate /dev/sdX` – Create a physical volume
- `vgcreate vg_name /dev/sdX` – Create a volume group
- `lvcreate -L 10G -n lv_name vg_name` – Create a logical volume
- `mkfs.ext4 /dev/vg_name/lv_name` – Format an LVM partition
- `mount /dev/vg_name/lv_name /mnt` – Mount an LVM partition

### Swap Management
- `mkswap /dev/sdX` – Create a swap partition
- `swapon /dev/sdX` – Enable swap space
- `swapoff /dev/sdX` – Disable swap space

## 2. How do you inspect disks and space usage?
### Using `lsblk`
সব block device ও partition tree দেখতে:
```bash
lsblk
```
### Using `fdisk`
Partition table detail দেখতে:
```bash
fdisk -l
```
### Using `df`
Mounted filesystem-এর available space দেখতে:
```bash
df -h
```
### Using `du`
নির্দিষ্ট directory-এর size দেখতে:
```bash
du -sh /var/log
```

## 3. How do you partition and format a disk?
### Creating a Partition with `fdisk`

:::danger Verify the target device
Partitioning, formatting, LVM initialization, and swap setup can overwrite disk metadata or data. Replace `/dev/sdX` only after confirming the exact device with `lsblk`; never copy these commands blindly onto a production machine.
:::

```bash
fdisk /dev/sdX
```
Interactive prompt অনুসরণ করে partition তৈরি করুন; write করার আগে selected device আবার যাচাই করুন।

### Formatting a Partition
Format as ext4:
```bash
mkfs.ext4 /dev/sdX1
```
Format as XFS:
```bash
mkfs.xfs /dev/sdX1
```

## 4. How do you mount, unmount, or remount a filesystem?
### Mount a Partition
```bash
mount /dev/sdX1 /mnt
```
### Unmount a Partition
```bash
umount /mnt
```
### Remount a Partition
```bash
mount -o remount,rw /mnt
```

## 5. How do you create storage with LVM?
### Create a Physical Volume
```bash
pvcreate /dev/sdX
```
### Create a Volume Group
```bash
vgcreate vg_name /dev/sdX
```
### Create a Logical Volume
```bash
lvcreate -L 10G -n lv_name vg_name
```
### Format and Mount the Logical Volume
```bash
mkfs.ext4 /dev/vg_name/lv_name
mount /dev/vg_name/lv_name /mnt
```

## 6. How do you manage swap space?
### Create a Swap Partition
```bash
mkswap /dev/sdX
```
### Enable Swap
```bash
swapon /dev/sdX
```
### Disable Swap
```bash
swapoff /dev/sdX
```

## 7. When should you use `fdisk`, `mount`, or both?
### Check Available Disks
কিছু create বা mount করার আগে available block device যাচাই করুন:
```bash
lsblk
```
### Example output:
|NAME | MAJ:MIN| RM| SIZE |RO | TYPE| MOUNTPOINT|
|-----|---------|--|------|---|-----|-----------|
|sda   |  8:0   | 0 | 100G | 0 | disk|           |
|├─sda1|   8:1  | 0 |  96G | 0 | part| /         |
|└─sda2|   8:2  | 0 |  4G  | 0 | part| [SWAP]    |
|sdb   |   8:16 | 0 |  20G | 0 | disk|           |

`sda` → existing disk, already partitioned।

`sdb` → new disk, এখনো partition নেই।

### When to use `fdisk`
`fdisk` ব্যবহার করুন যখন:

- Disk brand new এবং কোনো partition নেই।
- `/dev/sdb1`, `/dev/sdb2` ইত্যাদি partition তৈরি করতে হবে।

`fdisk`-এর ভেতরে:

1. `n` চাপুন → new partition তৈরি করে।
2. `w` চাপুন → change disk-এ write করে।

Then confirm:
```bash
lsblk
```
### When to Use `mount`
`mount` ব্যবহার করুন যখন:

- The partition already exists and is formatted.
- You just want to make it accessible.

```bash
sudo mkdir /mnt/mydisk
sudo mount /dev/sdb1 /mnt/mydisk
```
এখন disk `/mnt/mydisk` path-এ accessible।

### When to Use fdisk + mount (Full Setup)
`fdisk + mkfs + mount` ব্যবহার করুন যখন:

- The disk is completely new.
- You need to partition → format → mount it.

```bash
# 1. Check available disks
lsblk
# 2. Create partition
sudo fdisk /dev/sdb
# 3. Format the partition
sudo mkfs.ext4 /dev/sdb1
# 4. Mount it
sudo mkdir /data
sudo mount /dev/sdb1 /data
```
### Quick Reference

| Use Case                     | Command(s)                  |
|-------------------------------|-----------------------------|
| View disks and partitions     | `lsblk`                     |
| Partition a new disk          | `fdisk`                     |
| Mount an existing partition   | `mount`                     |
| Full setup (new disk)         | `fdisk + mkfs + mount`      |

:::tip Interview summary
`lsblk` device layout, `fdisk` partition, `mkfs` filesystem, `mount` access path, LVM flexible logical storage এবং swap memory pressure-এর জন্য disk-backed space পরিচালনা করে।
:::
