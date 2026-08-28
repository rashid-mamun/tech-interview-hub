---
sidebar_position: 4
title: 'Setup'
---

## 1. How can you set up a Linux environment on Windows or macOS?

Windows বা macOS machine-এ Linux practice করার জন্য `cloud vm`, `wsl2`, `virtualbox`, `Hyperkit` এবং container ব্যবহার করা যায়। শেখার জন্য Docker container দ্রুত ও repeatable environment দেয়, কারণ একই configuration দিয়ে প্রয়োজনে container আবার তৈরি করা যায়।

Docker Desktop install করে নিচের command চালালে Ubuntu-based Linux environment তৈরি হবে। Container full virtual machine নয়—এটি host kernel share করে, কিন্তু process ও filesystem isolation দেয়।

### How do you run a persistent Ubuntu container on Windows?

- Downloads folder-এর মধ্যে `ubuntu-data` নামে folder তৈরি করুন।

- তারপর `PowerShell`-এ command চালান এবং source path-এর username/location নিজের machine অনুযায়ী update করুন।

```bash
docker run -dit `
  --name ubuntu-container `
  --hostname ubuntu-dev `
  --restart unless-stopped `
  --cpus="2" `
  --memory="4g" `
  --mount type=bind,source="C:/Users/Monica Korla/Downloads/ubuntu-container",target=/data `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -p 2222:22 `
  -p 8080:80 `
  --env TZ=Asia/Kolkata `
  --env LANG=en_US.UTF-8 `
  ubuntu:latest /bin/bash              
```

### How do you run it on macOS or Linux?

```bash
docker run -dit \
  --name ubuntu-container \
  --hostname ubuntu-dev \
  --restart unless-stopped \
  --cpus="2" \
  --memory="4g" \
  --mount type=bind,source=/tmp/ubuntu-data,target=/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 2222:22 \
  -p 8080:80 \
  --env TZ=Asia/Kolkata \
  --env LANG=en_US.UTF-8 \
  ubuntu:latest /bin/bash
                 
```

### What does each parameter do?

:::caution Docker socket access
Mounting `/var/run/docker.sock` gives the container powerful control over the host Docker daemon. Keep the existing option only when Docker-from-Docker access is required; omit it for an ordinary Linux practice container.
:::

| Parameter | Description |
|-----------|-------------|
| `-dit` | Runs the container in **detached (-d)**, **interactive (-i)**, and **terminal (-t)** mode. |
| `--name ubuntu-container` | Assigns a name to the container for easy management. |
| `--hostname ubuntu-dev` | Sets the container’s hostname. |
| `--restart unless-stopped` | Ensures the container restarts automatically unless manually stopped. |
| `--cpus="2"` | Limits the container to **2 CPU cores**. |
| `--memory="4g"` | Allocates **4GB RAM** to the container. |
| `--mount type=bind,source=C:/ubuntu-data,target=/data` | **Mounts a folder** from Windows into the container to persist data. |
| `-v /var/run/docker.sock:/var/run/docker.sock` | Allows running Docker commands inside the container (optional). |
| `-p 2222:22` | Maps port **2222** on the host to **22** (SSH) inside the container. |
| `-p 8080:80` | Maps port **8080** on the host to **80** (for web services). |
| `--env TZ=Asia/Kolkata` | Sets the **timezone** (modify based on your location). |
| `--env LANG=en_US.UTF-8` | Sets the **language** settings inside the container. |
| `ubuntu:latest /bin/bash` | Uses the latest **Ubuntu** image and runs Bash shell. |

### What should you verify before running it?

Bind-mount source path আগে থেকে আছে কি না, container name unique কি না এবং host port `2222` বা `8080` অন্য process ব্যবহার করছে কি না যাচাই করুন। Port publish করলেই container-এর ভেতরে SSH বা web server automatically install ও start হয় না; সংশ্লিষ্ট service আলাদাভাবে configure করতে হবে।

:::tip Interview summary
VM নিজের guest kernel চালায়, কিন্তু container host kernel share করে। Bind mount persistent data দেয়, port mapping host traffic container-এ পাঠায় এবং CPU/memory option resource limit নির্ধারণ করে।
:::
