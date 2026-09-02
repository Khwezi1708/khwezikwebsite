# KHWEZI K Website

Official artist site for **KHWEZI K** — Afro electronic DJ.

## Develop

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

GitHub Pages deploys automatically from `main` via Actions.

Custom domain: **khwezik.com** (`public/CNAME`).

## Gigs calendar

Public gigs are pulled from **Google Calendar** at build time (upcoming first, then past from the start of the current year). The page shows 8 at first; **See more** reveals 5 at a time, with **Show less** to collapse.

1. Use a **gigs-only** calendar (no private booking holds).
2. For each event:
   - **Title:** event name (shown on top — e.g. `Amapiano Worldwide`)
   - **Location:** start with **venue**, then address, ending in city/country — e.g. `Basing House, 25 Kingsland Rd, London E2 8AA, UK`
   - **Date/time:** start time (all-day events show as “All day”)
   - **Description (optional):** first URL becomes the **Tickets** link
3. In calendar settings → **Integrate calendar**, copy **Secret address in iCal format** (or public iCal if the calendar is public).
4. Set locally in `.env` (see `.env.example`) and in GitHub → **Settings → Secrets** as `GOOGLE_CALENDAR_ICAL_URL`.

Gigs update on the live site when a deploy runs: `push` to `main`, manual **Actions → Deploy GitHub Pages**, or the daily scheduled rebuild (06:00 UTC).

## Assets

- Hero video: `public/video/hero.mov`
- Brand marks: `public/brand/`
- Colours and type follow the 2026 brand book (Cocoa / Cream / Clay)
