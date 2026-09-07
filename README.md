# night-desk

pnpm + Turborepo workspace: Express scrape API and a Vite React UI that typesets a job listing as a classified clipping. Scraping is powered by [Firecrawl](https://www.firecrawl.dev/).

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/) (optional, for Compose)

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Put your Firecrawl key in `apps/backend/.env` (gitignored):

   ```bash
   FIRECRAWL_API_KEY=your_key_here
   ```

3. Start both apps:

   ```bash
   pnpm dev
   ```

   - API: http://localhost:3000
   - UI: http://localhost:5173

## Docker Compose

Local stack: API, UI, MongoDB, and Redis, with source bind-mounted for hot reload.

```bash
docker compose up --build
```

| Service | Host |
|---------|------|
| API | http://localhost:3000 |
| UI | http://localhost:5173 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

Compose loads Docker hostnames from `.env.development.local` and the Firecrawl key from `apps/backend/.env`. Do not put the key in the tracked env file.

```bash
docker compose down       # stop; keep volumes
docker compose down -v    # stop and wipe node_modules + DB data
```

## Commands

| Command | What it does |
|---------|----------------|
| `pnpm dev` | Run backend and frontend via Turbo |
| `pnpm build` | Build every app |
| `pnpm --filter backend dev` | API only (`tsx watch`) |
| `pnpm --filter frontend dev` | UI only (Vite) |
| `docker compose up --build` | API, UI, Mongo, Redis in containers |

`POST /scrape` accepts `{ "url": "https://example.com" }`. The UI posts to `/scrape`; Vite proxies that path to the API in development.
