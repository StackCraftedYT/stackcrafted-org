---
title: Self-Hosted AI Lab (Ollama, Open WebUI, Vaultwarden)
---

# Self-Hosted AI Lab (Ollama, Open WebUI, Vaultwarden)

Deploy a private AI lab on your own hardware using Docker Compose.
Run local language models with Ollama, chat through Open WebUI,
and store passwords in Vaultwarden, all on your own machine.

This guide follows StackCrafted production practices and integrates
cleanly into a reverse proxy architecture.

------------------------------------------------------------------------

## What This Deploys

- Ollama (local language model runtime)
- Open WebUI (chat interface for Ollama)
- Vaultwarden (self-hosted password manager)

Services will run at:

- Open WebUI: http://localhost:3000
- Ollama API: http://localhost:11434
- Vaultwarden: http://localhost:8080

------------------------------------------------------------------------

## Folder Structure

Deployment path:

    /opt/docker/ai-lab/
      docker-compose.yml

Create the directory:

``` bash
mkdir -p /opt/docker/ai-lab
cd /opt/docker/ai-lab
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
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    volumes:
      - open_webui_data:/app/backend/data
    depends_on:
      - ollama

  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - vaultwarden_data:/data
    environment:
      - SIGNUPS_ALLOWED=false

volumes:
  ollama_data:
  open_webui_data:
  vaultwarden_data:
```

Save and exit.

------------------------------------------------------------------------

## Start the Stack

Run:

``` bash
docker compose up -d
```

Verify containers are running:

``` bash
docker ps
```

Expected containers:

- ollama
- open-webui
- vaultwarden

------------------------------------------------------------------------

## Pull a Model

Download a model into Ollama:

``` bash
docker exec -it ollama ollama pull llama3.1
```

------------------------------------------------------------------------

## Verify Access

Open in your browser:

- Open WebUI: http://localhost:3000
- Ollama API: http://localhost:11434
- Vaultwarden: http://localhost:8080

------------------------------------------------------------------------

## GPU Support (Optional)

If you have an NVIDIA GPU, uncomment the deploy section
in the ollama service and restart:

``` bash
docker compose up -d
```

------------------------------------------------------------------------

## Persistent Storage

Data is stored in Docker volumes:

- ollama_data
- open_webui_data
- vaultwarden_data

Back up these volumes regularly.

------------------------------------------------------------------------

## Updating

To update all services:

``` bash
cd /opt/docker/ai-lab
docker compose pull
docker compose up -d
```

------------------------------------------------------------------------

## Stop the Stack

To stop:

``` bash
docker compose down
```

------------------------------------------------------------------------

## Deployment Complete

You now have a private AI lab running on your own hardware.

Next recommended steps:

- Put Open WebUI and Vaultwarden behind a reverse proxy (HTTPS)
- Create your Vaultwarden account and keep signups disabled
- Pull additional models as needed

------------------------------------------------------------------------

StackCrafted tutorials focus on clean, production-ready deployments
using Docker and open-source tools.