# firecrawl

pnpm + Turborepo workspace with an Express scrape API and a Vite React UI.

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/installation)

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Put your Firecrawl key in `apps/backend/.env`:

   ```bash
   FIRECRAWL_API_KEY=your_key_here
   ```

3. Start both apps:

   ```bash
   pnpm dev
   ```

   - API: http://localhost:3000
   - UI: http://localhost:5173

## Commands

| Command | What it does |
|---------|----------------|
| `pnpm dev` | Run backend and frontend via Turbo |
| `pnpm build` | Build every app |
| `pnpm --filter backend dev` | API only (`tsx watch`) |
| `pnpm --filter frontend dev` | UI only (Vite) |

`POST /scrape` accepts `{ "url": "https://example.com" }`. The UI posts to `/scrape`; Vite proxies that path to the API in development.
