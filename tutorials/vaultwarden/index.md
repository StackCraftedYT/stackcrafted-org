# Vaultwarden (Bitwarden) -- Docker Deployment

Self-host Vaultwarden (lightweight Bitwarden server) using Docker and
Docker Compose with persistent storage.

This tutorial is part of the **StackCrafted** project.

------------------------------------------------------------------------

# Important Prerequisite: Reverse Proxy Required

This guide assumes you already have a functioning reverse proxy
configured, such as:

-   Nginx Proxy Manager\
-   Nginx\
-   Traefik\
-   Caddy

and that:

-   Your domain is working (example: `vault.stackcrafted.org`)
-   SSL certificate is already configured
-   The service is accessible externally via HTTPS

Example working setup:

https://vault.stackcrafted.org

Vaultwarden itself runs locally on port:

http://localhost:8081

The reverse proxy handles:

-   External access
-   HTTPS encryption
-   Domain routing

If you do not yet have a reverse proxy configured, you must complete
that first before continuing.

------------------------------------------------------------------------

# Folder Structure

vaultwarden-docker/ ├── docker-compose.yml ├── .env └── data/

------------------------------------------------------------------------

# Step 1 --- Create docker-compose.yml

``` yaml
version: "3.8"

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped

    env_file:
      - .env

    volumes:
      - ./data:/data

    ports:
      - "127.0.0.1:8081:80"
```

------------------------------------------------------------------------

# Step 2 --- Create .env file

``` env
DOMAIN=https://vault.YOURDOMAIN.TLD
ADMIN_TOKEN=PASTE_GENERATED_TOKEN_HERE
SIGNUPS_ALLOWED=false
```

Replace vault.YOURDOMAIN.TLD with your actual domain.

Example:

vault.stackcrafted.org

------------------------------------------------------------------------

# Step 3 --- Generate Secure ADMIN_TOKEN

Run:

``` bash
echo -n "YourStrongPassword" | argon2 "$(openssl rand -base64 32)" -e -id -k 65540 -t 3 -p 4 | sed 's#\$#\$\$#g'
```

This command:

-   Generates Argon2 hash
-   Automatically escapes \$ characters
-   Works directly in Docker Compose .env

Paste output into:

ADMIN_TOKEN=OUTPUT_HERE

------------------------------------------------------------------------

# Step 4 --- Start Vaultwarden

``` bash
docker compose up -d
```

Verify:

``` bash
docker ps
```

------------------------------------------------------------------------

# Step 5 --- Access Vaultwarden

Local:

http://localhost:8081

External:

https://vault.YOURDOMAIN.TLD

------------------------------------------------------------------------

# Step 6 --- Access Admin Panel

https://vault.YOURDOMAIN.TLD/admin

Use password from ADMIN_TOKEN generation.

------------------------------------------------------------------------

# Backup Recommendation

Backup:

vaultwarden-docker/data

Contains:

-   Database
-   Encryption keys
-   All vault data

------------------------------------------------------------------------

# StackCrafted

More tutorials:

https://stackcrafted.org
