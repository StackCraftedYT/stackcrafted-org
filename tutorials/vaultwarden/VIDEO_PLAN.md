# StackCrafted Video Plan: Vaultwarden + Nginx Proxy Manager

## Source of truth

Written tutorial:
- stackcrafted-org/tutorials/vaultwarden/index.md

Config repository:
- vaultwarden-docker/docker-compose.yml
- vaultwarden-docker/.env.example
- vaultwarden-docker/proxy-examples/nginx-proxy-manager/

Real VPS reference:
- /opt/docker/vaultwarden/docker-compose.yml
- /opt/docker/vaultwarden/.env
- /opt/docker/nginx-proxy-manager/compose.yml

## Main rule

The existing written tutorial is the base. Do not replace the method.
The video should follow the StackCrafted.org Vaultwarden tutorial closely.

## Video chapters

1. Intro
Explain Vaultwarden and what the viewer will build.

2. Folder structure
Show /opt/docker/vaultwarden.
Explain why each Docker app gets its own folder.

3. Create the Docker network
Command:
docker network create web-net

Explain that web-net lets Vaultwarden and Nginx Proxy Manager communicate.

4. Create docker-compose.yml
Show the Vaultwarden compose file.
Explain:
- Vaultwarden binds to 127.0.0.1:8081
- It is not directly exposed publicly
- Data is stored in ./data
- DOMAIN and ADMIN_TOKEN come from .env
- The container joins web-net

5. Create .env
Explain:
- DOMAIN is the public HTTPS URL
- ADMIN_TOKEN protects /admin
- Secrets must not be committed to GitHub

6. Secure Admin Token with Argon2

This section is very important because many users struggle with Docker Compose .env files and dollar signs.

Install Argon2:
sudo apt install argon2

Generate the admin token:
echo -n "YourStrongPassword" | argon2 "$(openssl rand -base64 32)" -e -id -k 65540 -t 3 -p 4 | sed 's#\$#\$\$#g'

Teaching point:
Docker Compose .env values treat $ specially.
That is why the command escapes $ as $$.

The final output should start with:
$$argon2id...

Paste the full output into the .env file like this:
ADMIN_TOKEN=$$argon2id$$v=19$$m=65540,t=3,p=4...

7. Start Vaultwarden
Commands:
docker compose up -d
docker compose ps

8. Verify local access
Command:
curl -I http://127.0.0.1:8081/

Explain that public access should go through the reverse proxy, not direct port exposure.

9. Nginx Proxy Manager overview
Show the NPM compose file.
Explain:
- NPM listens on ports 80 and 443
- Admin UI is bound locally on 127.0.0.1:81
- Proxy host forwards to Vaultwarden over Docker network

Recommended proxy settings:
- Domain: vault.yourdomain.tld
- Scheme: http
- Forward hostname: vaultwarden
- Forward port: 80
- Enable Websockets
- Enable Block Common Exploits
- Request SSL certificate
- Force SSL

10. Recap and close
Mention:
- Vaultwarden runs locally
- Nginx Proxy Manager handles HTTPS
- Full guide and files are on StackCrafted.org and GitHub
- Subscribe for more self-hosted Docker tutorials

## Visual style

- Real terminal recording
- Real commands
- No static slideshow as the main style
- Zoom in on important commands
- Bottom-right avatar later
- Narration generated from this plan and the written guide

## Voice plan

Primary:
- ElevenLabs clone of my own voice

Fallback:
- Free/local TTS only for test renders

## Old video handling

Do not delete the old Vaultwarden YouTube video.

When the new relaunch version is ready:
- Make the old video private
- Upload the new version
- Link the new video to StackCrafted.org and GitHub
