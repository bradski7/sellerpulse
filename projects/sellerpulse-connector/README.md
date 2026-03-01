# SellerPulse Connector (Etsy API)

Official Etsy API connector for pulling live shop data into SellerPulse.

## Why this exists

SellerPulse Lite is useful with manual input, but real value comes from automated sync.
This service handles OAuth + Etsy API fetches so web app and extension can use real data.

## What it does (MVP)

- OAuth connect to Etsy (personal access)
- CORS-enabled endpoints for local extension/web app usage
- Fetch active listings for a shop
- Fetch listing details (`views`, `num_favorers`, title, state, etc.)
- Fetch receipts for last N days
- Compute listing-level 30-day sales rollups from receipt transactions
- Persist tokens to disk + auto-refresh access token

## Endpoints

- `GET /health` — service status
- `GET /auth/status` — auth state summary
- `GET /auth/start` — begin Etsy OAuth flow
- `GET /auth/callback` — OAuth callback + token exchange
- `POST /auth/logout` — clear token
- `GET /api/sync?shop_id=<id>&days=30` — fetch and aggregate shop data
- `GET /api/listing?shop_id=<id>&listing_id=<id>&days=30` — one listing snapshot

## Setup

1. Create Etsy app credentials in Etsy Open API.
2. Copy `.env.example` to `.env` and fill values.
3. Install + run:

```bash
cd projects/sellerpulse-connector
npm install
npm run dev
```

4. Open OAuth connect:
- `http://localhost:8787/auth/start`

5. Test sync:
- `http://localhost:8787/api/sync?shop_id=YOUR_SHOP_ID&days=30`

## Notes

- This is an MVP scaffold optimized for low-cost deployment.
- Token file default: `projects/sellerpulse-connector/data/etsy-token.json`
- Use official Etsy API access only. Avoid scraping Shop Manager pages.
