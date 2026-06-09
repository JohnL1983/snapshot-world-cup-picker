# Snapshot World Cup Challenge 2026

Single-page entry form with Supabase backend. Hosted on GitHub Pages.

---

## Local development

**Prerequisites:** Node 18+

```bash
# 1. Install dependencies
npm install

# 2. Copy the env example and fill in your Supabase credentials
cp .env.example .env
# Edit .env and add your real SUPABASE_URL and SUPABASE_ANON_KEY

# 3. Build — injects credentials into index.html
npm run dev

# 4. Open index.html in your browser
```

---

## Supabase setup (one-time)

1. Create a free project at https://supabase.com (sign in with GitHub)
2. In **SQL Editor**, run:

```sql
create table entries (
  id           bigint generated always as identity primary key,
  email        text unique not null,
  name         text not null,
  submitted_at timestamptz default now(),
  groups       jsonb,
  knockout     jsonb
);

alter table entries enable row level security;

create policy "Anyone can insert"
  on entries for insert with check (true);

create policy "Anyone can read"
  on entries for select using (true);
```

3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public** key → `SUPABASE_ANON_KEY`

---

## Deploying to GitHub Pages

### 1. Add secrets to your GitHub repo

Go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### 2. Enable GitHub Pages

Go to **Settings → Pages → Source** and select **GitHub Actions**.

### 3. Push to main

The `.github/workflows/deploy.yml` workflow will automatically:
- Install Node dependencies
- Run the build script (injecting secrets into `index.html`)
- Deploy to GitHub Pages

---

## Repo structure

```
├── index.template.html     # Source HTML — credentials are placeholders
├── index.html              # Built output — generated, not committed
├── scripts/
│   └── build.js            # Injects env vars into the template
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD: build + deploy on push to main
├── .env                    # Local secrets — gitignored, never committed
├── .env.example            # Safe to commit — shows required var names
├── .gitignore
├── package.json
└── README.md
```

---

## Security notes

- `index.html` is in `.gitignore` — the built file with real credentials is never committed to the repo
- Secrets only exist in GitHub's encrypted secret store and in the deployed static file
- The Supabase **anon key** is safe to expose in a static site — it is a public key by design. Row-level security policies on the `entries` table control what anonymous users can and cannot do
