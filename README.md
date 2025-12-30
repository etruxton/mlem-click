# mlem.click

A silly clicker website inspired by [lizard.click](https://lizard.click/). Click the button to MLEM!

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

# Navigate to http://localhost:8000
```

## Deployment

Deployment happens automatically via GitHub Actions when pushing to `main`:

1. Linting runs (Prettier + ESLint)
2. D1 database migrations are applied
3. Worker and Frontend deploy to Cloudflare in parallel
