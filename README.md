# Ferncliff Farms Field Card

A parcel screening tool for evaluating candidate farmsteads in upstate New York —
scoring land cost, regulatory posture, roadside cafe viability, and buildout potential
on a consistent basis so properties can be compared against each other rather than by feel.

## Live tools

- Landing (both tools): https://farmstead-scorecard.pages.dev/
- Ferncliff Farms Field Card (parcel scoring): https://farmstead-scorecard.pages.dev/scorecard
- Readiness Checklist (prep tracker): https://farmstead-scorecard.pages.dev/checklist

Both tools sync behind the same shared passphrase (enter it once per device); signing into
either authorizes the other. Both are offline-first and store a local cache in the browser.

## How it works

**Three deal breakers** sit above the score. Any "no" disqualifies the parcel regardless
of how well it scores elsewhere:

- Legal access on a maintained public road
- Lodging achievable without a full rezoning
- Wastewater feasible for commercial flows

**Twenty scored criteria** across four weighted sections:

| Section | Points | Covers |
|---|---|---|
| Cost & structures | 30 | Price, price per acre, seller financing, farmhouse, barn convertibility |
| Regulatory | 27 | Agricultural district, cabin zoning, town track record, constraints, water |
| Cafe viability | 25 | Traffic count, sight lines, nearby draws, highway and transit access |
| Land & buildout | 18 | Pasture, slope and aspect, cabin siting, utilities, soils |

Each criterion scores 0–4. The weighted total runs 0–100. Above 70 stamps as Shortlist,
50–70 as Worth a look.

## Data and syncing

Property cards are stored in a shared database so the same set is available on every device.
The tool is **offline-first**: edits save to the browser immediately and sync to the database
when there is a connection, which matters when you are scoring in a driveway with no signal.
Sync uses last-write-wins per property, so two people touring separately can each edit and the
newest change to a given card wins. Deletes propagate too.

Access is gated by a **shared passphrase**, checked server-side; you enter it once per device.
**Export** still downloads a JSON file and **Import** merges one back in, as an offline fallback.

## Before you tour

Two things worth pulling in advance, since they score better from a desk than a driveway:

- **NYSDOT traffic counts** — annual average daily traffic by road segment, for the cafe frontage
- **NRCS Web Soil Survey** — soil classification for the parcel

## Architecture

Everything runs on Cloudflare, deployed from this repo:

- **Frontend** — `public/index.html`, a single self-contained file (no build step).
- **API** — Cloudflare Pages Functions under `functions/api/` (`login`, `session`, `logout`, `properties`, `checklist`).
- **Database** — Cloudflare D1 (SQLite). Schema in `migrations/`.
- **Auth** — the passphrase is compared server-side; a signed, HttpOnly cookie authorizes API calls.
  The database credentials never reach the browser. Secrets (`APP_PASSPHRASE`, `AUTH_SECRET`) are
  stored as Cloudflare secrets, never in the repo.

## Running locally

Requires Node 22 (pinned via `mise.toml`) and the Cloudflare `wrangler` CLI.

```
npm install
npm run db:migrate:local   # one time: set up the local D1 database
npm run dev                # serves at http://127.0.0.1:8788 with a local D1 + .dev.vars
```

Create a `.dev.vars` file (git-ignored) with local secrets:

```
APP_PASSPHRASE="your local passphrase"
AUTH_SECRET="any-random-string-for-local-dev"
```

## Deploying

```
npm run db:migrate         # apply new migrations to the remote D1 (when the schema changes)
npm run deploy             # deploy the frontend + Functions to Cloudflare Pages
```

Production secrets are set once with `wrangler pages secret put APP_PASSPHRASE` and `AUTH_SECRET`.
