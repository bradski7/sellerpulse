# SellerPulse

SellerPulse is a low-cost Etsy growth toolkit built to turn shop data into weekly execution moves.

## Live Site

- https://bradski7.github.io/sellerpulse/

## Core Components

### 1) Web App (public)
- Path: `docs/sellerpulse/`
- Includes:
  - Landing page
  - SellerPulse Lite Analyzer
  - Waitlist form hooks
  - Live Etsy Sync beta UI

### 2) Etsy API Connector (local service)
- Path: `projects/sellerpulse-connector/`
- Handles:
  - Etsy OAuth
  - API sync for listings + receipts
  - token persistence + refresh
  - CORS for web/extension access

### 3) Chrome Extension (MV3)
- Path: `projects/sellerpulse-extension/`
- Adds:
  - Etsy page floating analyze button
  - Popup actions for connect/sync/open analyzer
  - URL handoff into SellerPulse analyzer with context

## Quick Start (Connector + Extension)

```bash
cd projects/sellerpulse-connector
cp .env.example .env
# fill ETSY_CLIENT_ID / ETSY_CLIENT_SECRET
npm install
npm run dev
```

Then load extension from:
- `projects/sellerpulse-extension`

Detailed setup:
- `docs/sellerpulse/EXTENSION_SETUP.md`

## Notes

- Use official Etsy API access via OAuth.
- Avoid scraping private Etsy surfaces.
