---
title: Vaultwarden (Bitwarden Server) with Docker + SSL + Domain
---

# Vaultwarden (Bitwarden Server) with Docker + SSL + Domain

This guide shows how to deploy **Vaultwarden**, a lightweight Bitwarden-compatible password manager server, using Docker, secured with HTTPS, and accessible via:

**vault.stackcrafted.org**

This page is the written companion to the StackCrafted YouTube video.

---

## What You Will Deploy

- Vaultwarden in Docker  
- Docker Compose deployment  
- HTTPS with free SSL  
- Custom domain/subdomain  
- Persistent storage  

---

## Prerequisites

- Linux server or VPS  
- Domain name with DNS access  
- Docker installed  
- Docker Compose installed  

---

## Step 1 – Create Project Directory

```bash
sudo mkdir -p /opt/docker/vaultwarden
sudo chown -R $USER:$USER /opt/docker
cd /opt/docker/vaultwarden
```

---

## Step 2 – Get the Config Files (Clone Repo)

```bash
cd /opt/docker
git clone https://github.com/StackCraftedYT/vaultwarden-docker.git vaultwarden
cd /opt/docker/vaultwarden
```

---

## Step 3 – Create Environment File

```bash
cp .env.example .env
nano .env
```

Set a random admin token:

```env
ADMIN_TOKEN=generate_a_random_string_here
```

---

## Step 4 – Start Vaultwarden

```bash
docker compose up -d
```

Vaultwarden is bound to localhost only (for reverse proxy use).

---

## Step 5 – Reverse Proxy + SSL

Vaultwarden must be placed behind a reverse proxy.

Detailed example (Nginx Proxy Manager):

https://github.com/StackCraftedYT/vaultwarden-docker/blob/main/proxy-examples/nginx-proxy-manager.md

Proxy target (example):

```text
127.0.0.1:8081
```

---

## Step 6 – Access Vault

```text
https://vault.stackcrafted.org
```

---

## Step 7 – Admin Panel

```text
https://vault.stackcrafted.org/admin
```

---

## Updates

```bash
docker compose pull
docker compose up -d
```

---

## Backup

```bash
tar -czvf vaultwarden-backup.tar.gz /opt/docker/vaultwarden/data
```

---

## Links

GitHub Repo: https://github.com/StackCraftedYT/vaultwarden-docker  
YouTube Video: coming soon
