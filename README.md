# mlem.click

A silly clicker website inspired by [lizard.click](https://lizard.click/). Click the button, hear the mlem, watch the counter go up.

**Live site:** [mlem.click](https://mlem.click)

## Tech Stack

- **Frontend:** Vanilla JS, CSS
- **Backend:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Rate Limiting:** Cloudflare KV
- **Bot Protection:** Cloudflare Turnstile

## Local Development

```bash
# Frontend
cd frontend
python -m http.server 8000

# Worker (requires wrangler)
cd worker
npm install
wrangler dev
```

## Deployment

```bash
# Deploy Worker
cd worker
wrangler deploy

# Deploy Frontend
cd frontend
npx wrangler pages deploy . --project-name=mlem-click
```
