# StartupDNA — Local Setup (VSCode)

## Requirements
- Node.js 20+ or Bun 1.1+
- VSCode

## Steps
1. Extract the zip.
2. `cp .env.local.example .env` (overwrites the included cloud `.env`).
3. Fill in:
   - `GEMINI_API_KEY` — required for generating new reports locally.
   - `SUPABASE_DB_URL` — optional, only needed if you run migrations from your machine.
   - `SUPABASE_SERVICE_ROLE_KEY` — optional now. Add it only if you want local generated reports saved permanently to the database; without it localhost still runs using public reads + temporary in-memory cache.
   - `GEMINI_API_KEY` — already pre-filled (use your own real key from https://aistudio.google.com/apikey if the provided one fails — real keys start with `AIza`)
4. Install deps: `bun install` (or `npm install`)
5. Run dev server: `bun run dev` or `npm run dev` → open the URL Vite prints, usually http://localhost:8080. If 8080 is busy, Vite may use 8081 — that is normal.

## Local behavior without service role key
The app no longer crashes when `SUPABASE_SERVICE_ROLE_KEY` is missing. Existing public reports can load from the database, and newly generated reports are kept in memory until you restart the dev server.

## Database
Run all migrations in `supabase/migrations/` against your Supabase project (SQL Editor or `supabase db push`).

## AI
- Locally uses `GEMINI_API_KEY` (direct Google Gemini API) when `LOVABLE_API_KEY` is not set.
- Note: the API key you provided starts with `AQ.` which looks like an OAuth access token, not a permanent API key. If requests fail with 401/403, generate a real key at https://aistudio.google.com/apikey (starts with `AIza`).
