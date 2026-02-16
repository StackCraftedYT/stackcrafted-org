# Vaultwarden (Bitwarden Alternative) — Docker Deployment

Deploy Vaultwarden securely using Docker, localhost binding, and reverse proxy readiness.

This guide matches the StackCrafted tutorial:

https://stackcrafted.org/tutorials/vaultwarden/

---

# Overview

Vaultwarden is a lightweight, open-source Bitwarden-compatible password manager designed for self-hosting.

This deployment is:

- Bound to localhost (`127.0.0.1`)
- Reverse proxy ready
- Secure admin token supported
- Persistent data storage enabled

---

# Architecture

```
Internet
   │
Reverse Proxy (Nginx Proxy Manager / Traefik / Caddy)
   │
Docker network: web-net
   │
Vaultwarden container
   │
Persistent data folder
```

Vaultwarden itself is NOT exposed publicly.

---

# Folder Structure

```
vaultwarden-docker/
├── docker-compose.yml
├── .env.example
└── data/
```

---

# Requirements

- Linux server
- Docker
- Docker Compose plugin

Verify installation:

```bash
docker --version
docker compose version
```

---

# Setup

## 1. Clone repository

```bash
git clone https://github.com/StackCraftedYT/vaultwarden-docker.git
cd vaultwarden-docker
```

---

## 2. Create Docker network (required once)

```bash
docker network create web-net
```

---

## 3. Configure environment file

```bash
cp .env.example .env
nano .env
```

Example:

```env
DOMAIN=https://vault.yourdomain.tld
ADMIN_TOKEN=your_secure_token
```

Generate secure token:

```bash
openssl rand -base64 48
```

---

## 4. Start Vaultwarden

```bash
docker compose up -d
```

---

## 5. Verify container

```bash
docker ps
```

Expected output:

```
vaultwarden   Up ...
```

---

# Access

Vaultwarden listens locally:

```
http://127.0.0.1:8081
```

Access externally via reverse proxy:

```
https://vault.yourdomain.tld
```

Admin panel:

```
https://vault.yourdomain.tld/admin
```

---

# Security Notes

This deployment:

- prevents direct public access
- requires reverse proxy
- supports secure admin tokens
- isolates Vaultwarden on Docker network

---

# Reverse Proxy (Recommended)

Supported proxies:

- Nginx Proxy Manager
- Traefik
- Caddy
- Nginx

Example forward target:

```
vaultwarden:80
```

Docker network:

```
web-net
```

---

# Data Persistence

Vaultwarden data is stored in:

```
./data
```

Do NOT delete unless wiping instance.

---

# Updating

```bash
docker compose pull
docker compose up -d
```

---

# Stop container

```bash
docker compose down
```

---

# Tutorial and Documentation

Full tutorial:

https://stackcrafted.org/tutorials/vaultwarden/

StackCrafted project:

https://github.com/StackCraftedYT
