---
title: Run Codex App on a Local AI Gateway
---

# Run Codex App on a Local AI Gateway

Point the Codex desktop app and CLI at a local OpenAI-compatible gateway so
model requests go wherever you want: free models, a paid relay, or your own
server. Your provider key stays on your machine, and no OpenAI subscription is
required for model calls.

This guide assumes OmniRoute as the gateway. Any gateway that implements the
OpenAI Responses API works the same way.

------------------------------------------------------------------------

## What This Solves

- Codex clients only speak the OpenAI Responses API, not Chat Completions
- The desktop app's model picker only knows OpenAI model names
- A gateway rejects unknown model ids with a confusing 401
- Environment variables are invisible to GUI apps started before they were set

------------------------------------------------------------------------

## How The Pieces Fit

    Codex app or CLI
      -> POST http://127.0.0.1:20128/v1/responses
        -> local gateway (OmniRoute)
          -> provider or relay (free tier, paid API, self-hosted model)

The gateway translates nothing about the protocol here. Codex requires
`wire_api = "responses"`, so the gateway must expose `/v1/responses`. If your
gateway only exposes `/v1/chat/completions`, you need a protocol-converting
proxy in front of it.

------------------------------------------------------------------------

## Prerequisites

- Node.js 20 or newer
- Codex app or Codex CLI installed and launched at least once
- The gateway running locally
- A provider key added to the gateway (free tier or paid)

------------------------------------------------------------------------

## 1. Start The Gateway

    npm install -g omniroute
    omniroute

Open the dashboard:

    http://127.0.0.1:20128

Sign in, connect one provider, and confirm the dashboard lists models.

------------------------------------------------------------------------

## 2. Create A Client API Key

In the dashboard, open **API Manager** and create a key for the client.

Store it outside any repository. For the CLI, an environment variable is
enough:

    setx GATEWAY_API_KEY "your-key-here"

Do not paste keys into `config.toml`, screenshots, or chat. The key is only
read from the environment.

Verify the gateway and key before touching Codex:

    curl http://127.0.0.1:20128/v1/models \
      -H "Authorization: Bearer $GATEWAY_API_KEY"

A JSON list of models means the gateway and key work.

------------------------------------------------------------------------

## 3. Configure Codex

Edit the user-level file, not a project file:

    %USERPROFILE%\.codex\config.toml

    model_provider = "gateway"
    model = "my-model"

    [model_providers.gateway]
    name = "Local Gateway"
    base_url = "http://127.0.0.1:20128/v1"
    env_key = "GATEWAY_API_KEY"
    wire_api = "responses"
    request_max_retries = 4
    stream_max_retries = 5
    stream_idle_timeout_ms = 300000

Rules that save time:

- `wire_api = "chat"` no longer loads. Only `responses` is accepted.
- `model_provider`, `model_providers` and provider auth only work in the user
  level file. Project level `.codex/config.toml` is ignored for these keys.
- Do not reuse the built-in ids `openai`, `ollama` or `lmstudio`.

------------------------------------------------------------------------

## 4. Verify With The CLI First

    codex exec --skip-git-repo-check "Reply with exactly: GATEWAY-OK"

If that answers, protocol and auth are correct. Then test a tool loop:

    codex exec --skip-git-repo-check "Run: echo hello-from-tool and report it"

Text alone is not proof. Tool calling is what makes Codex useful.

------------------------------------------------------------------------

## 5. The 401 That Confuses Everyone

Symptom:

    401 Unauthorized: No active credentials for provider: gpt-5.6-sol

The desktop app does not use the `model` value from `config.toml` for every
choice. Its picker sends its own model ids. A gateway that routes on
`provider/model` reads the first segment as a provider name, finds no provider
with that name, and returns 401.

Two working fixes.

### Fix A: map the picker ids to a real model

Create a route in the gateway for each id the client may send. With OmniRoute:

    omniroute combo create gpt-5.6-sol --strategy fill-first \
      --models "openrouter/model-a:free,openrouter/model-b:free"

Repeat for the other names in the picker. Now any of those choices resolves to
a real model, and the labels become cosmetic.

### Fix B: give Codex its own model catalog

The picker reads a catalog, so supply one:

    model_catalog_json = "C:/Users/you/.codex/my-models.json"

    {
      "models": [
        {
          "slug": "gateway-route",
          "display_name": "My Gateway Route",
          "description": "Routed through the local gateway.",
          "visibility": "list",
          "supported_in_api": true
        }
      ]
    }

The catalog must match the client's schema. The reliable way to build it is to
copy one model object from the client's own `models_cache.json` and keep every
field, changing only `slug`, `display_name` and `description`. Missing fields
fail loudly at startup with `missing field ...`.

------------------------------------------------------------------------

## 6. GUI Apps And Environment Variables

A desktop app only sees environment variables that exist when it starts.

- Set the variable with `setx`, then fully quit and reopen the app
- Restart the app after any `config.toml` or catalog change
- Confirm from a new terminal that the variable is visible

------------------------------------------------------------------------

## 7. Free Tiers Behave Like Free Tiers

Expect rate limits. A gateway route with several models and automatic fallback
keeps working when one model cools down, but you will still see occasional:

    429: all credentials for model X are cooling down

Retry after the stated seconds. Unlimited free access to paid models does not
exist, and anything advertising it is reselling or abusing someone else's
credentials.

------------------------------------------------------------------------

## 8. Old Chats Refuse To Open

After switching providers, existing chats can show:

    Model provider mismatch
    This chat uses OpenAI, but your current provider is Local Gateway.
    Switch to OpenAI to continue.

Each chat records the provider it was created with and refuses to continue
under a different one. Three ways out, in order of safety.

### Option A: keep two configurations

Switch `model_provider` back, restart, read the old chats, then switch forward
again. Slow, but nothing is modified.

### Option B: copy the chat into a new one

Start a new chat with the new provider and paste the transcript. Manual, but
zero risk.

### Option C: re-point the chat records

The client stores provider metadata in a local SQLite database. With the app
fully closed:

    %USERPROFILE%\.codex\state_5.sqlite

Back it up first, including any `-wal` and `-shm` files sitting beside it, then:

    UPDATE threads
    SET model_provider = 'gateway'
    WHERE model_provider = 'openai';

Restart the app. The transcripts are unchanged; only the provider label moves.
This is an unsupported edit, so keep the backup and expect to restore it if a
very old transcript contains payloads the new provider rejects. A rejected
payload shows as a 400, not as the mismatch error.

------------------------------------------------------------------------

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `wire_api = "chat"` is no longer supported | Old guides | Set `responses` |
| `No active credentials for provider: X` | Client sent a model id the gateway parsed as a provider | Add a route or catalog entry for X |
| 401 from the gateway | Key missing or not visible to the app | Check `env_key` name, restart the app |
| Provider not found | `model_provider` in a project file | Move it to the user level file |
| Model missing from picker | Catalog not loaded | Fix `model_catalog_json`, restart |
| `Model provider mismatch` on an old chat | Chat was created under another provider | See section 8 |
| Text works, tools fail | Weak tool calling or dropped tool fields | Test a read, edit, run loop |

------------------------------------------------------------------------

## Checklist

- Gateway answers `/v1/models` with your key
- `codex exec` answers a short prompt
- `codex exec` completes one tool call
- The desktop app answers after a full restart
- Keys exist only in the environment and the local gateway store
