---
title: Nginx Proxy Manager on Docker
---

# Nginx Proxy Manager on Docker

Put your self-hosted services behind HTTPS with automatic Let's Encrypt
certificates using Nginx Proxy Manager.

This guide completes the Vaultwarden deployment by adding a secure
reverse proxy in front of it.

------------------------------------------------------------------------

## What This Deploys

- Nginx Proxy Manager admin UI on port 81
- HTTP on port 80 and HTTPS on port 443
- Persistent data and certificate storage
- Ready for Vaultwarden and other self-hosted services

------------------------------------------------------------------------

## Prerequisites

- Docker and Docker Compose installed
- A domain or subdomain pointing to your server IP
- Ports 80 and 443 open in your firewall
- The `web-net` Docker network (created in the Vaultwarden tutorial)

------------------------------------------------------------------------

## Folder Structure

Deployment path:

    /opt/docker/nginx-proxy-manager/
      docker-compose.yml
      data/
      letsencrypt/

Create the directory:

``` bash
mkdir -p /opt/docker/nginx-proxy-manager
cd /opt/docker/nginx-proxy-manager
```

------------------------------------------------------------------------

## Create the Reverse Proxy Network

If you followed the Vaultwarden tutorial, the network already exists.

``` bash
docker network create web-net
```

------------------------------------------------------------------------

## Create docker-compose.yml

Create the file:

``` bash
nano docker-compose.yml
```

Paste:

``` yaml
services:
  app:
    image: jc21/nginx-proxy-manager:latest
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    networks:
      - web-net

networks:
  web-net:
    external: true
```

Save and exit.

------------------------------------------------------------------------

## Start Nginx Proxy Manager

Run:

``` bash
docker compose up -d
```

Verify the container is running:

``` bash
docker ps
```

------------------------------------------------------------------------

## Access the Admin UI

Open:

    http://your-server-ip:81

Default login:

    Email: admin@example.com
    Password: changeme

Change the email and password immediately after first login.

------------------------------------------------------------------------

## Add a Proxy Host for Vaultwarden

1. Hosts, Proxy Hosts, Add Proxy Host.
2. Domain: your domain or subdomain.
3. Scheme: http.
4. Forward hostname: vaultwarden (if on the same Docker network)
   or 127.0.0.1 (if bound to the host).
5. Forward port: 80 for the container, or 8081 for the host binding.
6. Enable Block Common Exploits and Websockets Support.
7. SSL tab: Request a new SSL certificate.
8. Enable Force SSL and HTTP/2.
9. Save.

------------------------------------------------------------------------

## DNS

Point your domain or subdomain to your server IP before requesting
the certificate. Let's Encrypt must be able to reach your server on
port 80.

------------------------------------------------------------------------

## Updating

``` bash
cd /opt/docker/nginx-proxy-manager
docker compose pull
docker compose up -d
```

------------------------------------------------------------------------

## Stop

``` bash
docker compose down
```

------------------------------------------------------------------------

## Deployment Complete

Vaultwarden is now reachable over HTTPS through Nginx Proxy Manager.

Next recommended steps:

- Add more proxy hosts for your other services
- Enable access lists for private services
- Set up automated backups for the data and letsencrypt folders

------------------------------------------------------------------------

StackCrafted tutorials focus on clean, production-ready deployments
using Docker and open-source tools.