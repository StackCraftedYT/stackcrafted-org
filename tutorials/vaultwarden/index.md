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
