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
mkdir -p /opt/vaultwarden
cd /opt/vaultwarden
```

---

## Step 2 – Create Environment File

```bash
nano .env
```

```env
ADMIN_TOKEN=generate_a_random_string_here
```

---

## Step 3 – Create Docker Compose File

```bash
nano compose.yml
```

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - DOMAIN=https://vault.stackcrafted.org
      - TZ=Europe/London
    volumes:
      - ./data:/data
    ports:
      - "127.0.0.1:8080:80"
```

---

## Step 4 – Start Vaultwarden

```bash
docker compose up -d
```

---

## Step 5 – Reverse Proxy + SSL

Vaultwarden must be placed behind a reverse proxy.

Detailed example (Nginx Proxy Manager):

https://github.com/StackCraftedYT/vaultwarden-docker/blob/main/proxy-examples/nginx-proxy-manager.md

Proxy target:

```
127.0.0.1:8080
```

---

## Step 6 – Access Vault

```
https://vault.stackcrafted.org
```

---

## Step 7 – Admin Panel

```
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
tar -czvf vaultwarden-backup.tar.gz /opt/vaultwarden/data
```

---

## Links

GitHub Repo: https://github.com/StackCraftedYT/vaultwarden-docker  
YouTube Video: coming soon
