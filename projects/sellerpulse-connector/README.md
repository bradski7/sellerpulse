# SellerPulse Connector (Etsy API)

Official Etsy API connector for pulling live shop data into SellerPulse.

## Why this exists

SellerPulse Lite is useful with manual input, but the real value is automated sync.
This service handles OAuth + Etsy API fetches so the frontend can use real data.

## What it does (MVP)

- OAuth connect to Etsy (personal access)
- Fetch active listings for a shop
- Fetch listing details (includes daily-tabulated `views` and `num_favorers` when available)
- Fetch receipts for last 30 days
- Return normalized JSON payload for SellerPulse UI

## Endpoints

- `GET /health` — service status
- `GET /auth/start` — begin Etsy OAuth flow
- `GET /auth/callback` — OAuth callback + token exchange
- `GET /api/sync?shop_id=<id>&days=30` — fetch and aggregate shop data

## Setup

1. Create Etsy app credentials in Etsy Open API.
2. Copy `.env.example` to `.env` and fill values.
3. Install + run:

```bash
cd projects/sellerpulse-connector
npm install
npm run dev
```

## Notes

- This is an MVP scaffold optimized for low-cost deployment.
- Token storage is in-memory currently; move to durable encrypted storage before production.
- Avoid scraping Shop Manager pages. Use Etsy API terms-compliant access only.
