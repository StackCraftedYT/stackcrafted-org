---
title: Vaultwarden (Self-Hosted Bitwarden)
---

# Vaultwarden — Self-Host Your Own Password Manager

Vaultwarden is a lightweight, self-hosted Bitwarden-compatible password manager.

This guide shows how to deploy Vaultwarden securely using Docker and reverse proxy.

---

# Overview

This deployment:

- runs in Docker
- binds only to localhost
- uses persistent storage
- integrates with reverse proxy
- supports secure admin panel

---

# Requirements

- Linux server
- Docker
- Docker Compose
- Reverse proxy (recommended)

---

# Step 1 — Create directory

```bash
mkdir -p /opt/docker/vaultwarden
cd /opt/docker/vaultwarden
```

---

# Step 2 — Create Docker network

```bash
docker network create web-net
```

---

# Step 3 — Create docker-compose.yml

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "127.0.0.1:8081:80"
    volumes:
      - ./data:/data
    environment:
      - ADMIN_TOKEN=${ADMIN_TOKEN}
      - DOMAIN=${DOMAIN}
    networks:
      - web-net

networks:
  web-net:
    external: true
```

---

# Step 4 — Create .env file

```bash
nano .env
```

Example:

```env
DOMAIN=https://vault.yourdomain.tld
ADMIN_TOKEN=your_secure_token
```

---

# Step 5 — Start container

```bash
docker compose up -d
```

---

# Step 6 — Verify container

```bash
docker ps
```

---

# Step 7 — Access Vaultwarden

Local test:

```
http://127.0.0.1:8081
```
## Accessing Vaultwarden on a VPS (SSH tunnel required)

Vaultwarden is bound to:

127.0.0.1:8081

This means it is only accessible from the server itself for security reasons.

To access it from your local computer, create an SSH tunnel:

```bash
ssh -L 8081:127.0.0.1:8081 USER@YOUR_SERVER_IP
```

Or if using a custom SSH port:
```bash
ssh -p 1234 -L 8081:127.0.0.1:8081 USER@YOUR_SERVER_IP

```
External access via reverse proxy:

```
https://vault.yourdomain.tld
```

---

# Admin panel

```
https://vault.yourdomain.tld/admin
```

---

# Data storage

```
/opt/docker/vaultwarden/data
```

---

# Updating

```bash
docker compose pull
docker compose up -d
```

---

# GitHub repository

https://github.com/StackCraftedYT/vaultwarden-docker
