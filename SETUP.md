# StartupDNA — Local Setup (VSCode)

## Requirements
- Node.js 20+ or Bun 1.1+
- VSCode

## Steps
1. Extract the zip.
2. `cp .env.local.example .env` (overwrites the included cloud `.env`).
3. Fill in:
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase Dashboard → Project Settings → API
   - `SUPABASE_DB_URL` — replace `[YOUR-PASSWORD]` with your DB password
   - `GEMINI_API_KEY` — already pre-filled (use your own real key from https://aistudio.google.com/apikey if the provided one fails — real keys start with `AIza`)
4. Install deps: `bun install` (or `npm install`)
5. Run dev server: `bun run dev` → opens at http://localhost:8080

## Database
Run all migrations in `supabase/migrations/` against your Supabase project (SQL Editor or `supabase db push`).

## AI
- Locally uses `GEMINI_API_KEY` (direct Google Gemini API) when `LOVABLE_API_KEY` is not set.
- Note: the API key you provided starts with `AQ.` which looks like an OAuth access token, not a permanent API key. If requests fail with 401/403, generate a real key at https://aistudio.google.com/apikey (starts with `AIza`).
