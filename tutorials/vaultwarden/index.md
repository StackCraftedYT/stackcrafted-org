---
title: Vaultwarden (Password Manager)
---

# Vaultwarden Docker Deployment Guide

Deploy Vaultwarden securely using Docker with persistent storage and
prepare it for production use behind a reverse proxy.

Vaultwarden is a lightweight, self-hosted Bitwarden-compatible password
manager.

This guide follows production best practices and integrates cleanly into
a reverse proxy architecture.

------------------------------------------------------------------------

## 📦 What This Deploys

-   Vaultwarden server (Bitwarden-compatible)
-   Persistent storage using bind-mounted data directory
-   Local-only binding for secure reverse proxy integration
-   Ready for production behind HTTPS reverse proxy

Vaultwarden will run at:

    http://127.0.0.1:8081

This is intentional and secure.

------------------------------------------------------------------------

## 📁 Folder Structure

Deployment path:

    /opt/docker/vaultwarden/
    ├── docker-compose.yml
    ├── .env
    └── data/

Create the directory:

``` bash
mkdir -p /opt/docker/vaultwarden
cd /opt/docker/vaultwarden
```

------------------------------------------------------------------------

## 🌐 Create the Reverse Proxy Network

This setup expects an external Docker network called `web-net` (shared
with your reverse proxy stack).

Create it once:

``` bash
docker network create web-net
```

If it already exists, Docker will tell you.

------------------------------------------------------------------------

## ⚙️ Create docker-compose.yml

Create the file:

``` bash
nano docker-compose.yml
```

Paste:

``` yaml
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

Save and exit.

------------------------------------------------------------------------

## ⚙️ Create .env file

Create:

``` bash
nano .env
```

Paste (update the domain):

``` env
# Public URL you will use via your reverse proxy (HTTPS recommended)
DOMAIN=https://vault.example.com

# Replace with your Argon2 hash (see next section)
ADMIN_TOKEN=replace_with_argon2_hash
```

Save and exit.

------------------------------------------------------------------------

## 🔐 Secure Admin Token (Argon2)

To securely enable the admin panel (`/admin`), generate a hashed token
using Argon2.

1.  Ensure Argon2 is installed:

``` bash
sudo apt install argon2
```

2.  Run the following command:

``` bash
echo -n "YourStrongPassword" | argon2 "$(openssl rand -base64 32)" -e -id -k 65540 -t 3 -p 4 | sed 's#\$#\$\$#g'
```

3.  Copy the **entire output** (it will start with `$$argon2id...`).

4.  Paste it as the value for `ADMIN_TOKEN` in your `.env` file:

``` env
ADMIN_TOKEN=$$argon2id$$v=19$$m=65540,t=3,p=4...
```

------------------------------------------------------------------------

## ▶️ Start Vaultwarden

Run:

``` bash
docker compose up -d
```

Verify container is running:

``` bash
docker ps
```

Expected output includes:

    vaultwarden

------------------------------------------------------------------------

## 🌐 Verify Local Access

Test locally on the server:

``` bash
curl -sI http://127.0.0.1:8081 | head -n 5
```

Expected:

    HTTP/1.1 200 OK
    server: Rocket

Vaultwarden is now running.

------------------------------------------------------------------------

## 🔐 Access via SSH Tunnel (Optional)

From your local machine:

``` bash
ssh -L 8081:127.0.0.1:8081 user@your-server-ip
```
If your server uses a custom SSH port (example: 1234):
```
ssh -p 1234 -L 8081:127.0.0.1:8081 user@your-server-ip
```

Then open:

    http://localhost:8081

------------------------------------------------------------------------

## 🔒 Production Setup: Reverse Proxy Required

Vaultwarden is intentionally bound to:

    127.0.0.1:8081

This prevents direct internet exposure.

For production use, Vaultwarden must be placed behind a reverse proxy.

Supported reverse proxies include:

-   Nginx
-   Nginx Proxy Manager
-   Caddy
-   Traefik

Architecture overview:

    Internet
       ↓
    Reverse Proxy (HTTPS :443)
       ↓
    Vaultwarden (127.0.0.1:8081)

The reverse proxy provides:

-   HTTPS encryption
-   SSL certificate management (Let's Encrypt, etc.)
-   Secure public access
-   Proper request forwarding

------------------------------------------------------------------------

## 🔧 Reverse Proxy Integration Example (Nginx)

If you already have a reverse proxy, configure it to forward to:

    http://127.0.0.1:80

Example Nginx location block:

``` nginx
location / {
    proxy_pass http://127.0.0.1:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

------------------------------------------------------------------------

## 🎥 Reverse Proxy Setup (Next Tutorial)

The next StackCrafted tutorial will cover:

-   Nginx Proxy Manager deployment
-   Automatic HTTPS with Let's Encrypt
-   Domain configuration
-   Secure internet exposure
-   Integration with Vaultwarden and other services

This reverse proxy setup will serve as the foundation for all future
deployments.

------------------------------------------------------------------------

## 💾 Persistent Storage

Vaultwarden data is stored in:
``` bash
    /opt/docker/vaultwarden/data
```
Backup this directory regularly.

------------------------------------------------------------------------

## 🔄 Updating Vaultwarden

To update:

``` bash
cd /opt/docker/vaultwarden
docker compose pull
docker compose up -d
```

------------------------------------------------------------------------

## 🛑 Stop Vaultwarden

To stop:

``` bash
docker compose down
```

------------------------------------------------------------------------

## ✅ Deployment Complete

You now have a secure, production-ready Vaultwarden deployment using
Docker.

Next recommended steps:

-   Configure reverse proxy (HTTPS)
-   Create your user account
-   Disable public registration if required
-   Configure automated backups

------------------------------------------------------------------------

StackCrafted tutorials focus on clean, production-ready deployments
using Docker and open-source tools.
