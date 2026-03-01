# SellerPulse Go-Live Mode (Local + Real Etsy Data)

## Goal
Run SellerPulse with real Etsy data end-to-end:
- Connector running
- Etsy OAuth connected
- Analyzer live sync working
- Chrome extension workflow working on Etsy pages

## Prerequisites
- Etsy Open API app credentials
- Chrome installed
- Node.js installed

## 1) Configure connector

```bash
cd projects/sellerpulse-connector
cp .env.example .env
```

Edit `.env`:
- `ETSY_CLIENT_ID=...`
- `ETSY_CLIENT_SECRET=...`
- `ETSY_REDIRECT_URI=http://localhost:8787/auth/callback`

## 2) Start connector

```bash
cd projects/sellerpulse-connector
npm install
npm run dev
```

Expect: `SellerPulse connector running on http://localhost:8787`

## 3) Run smoke test

```bash
cd projects/sellerpulse-connector
./scripts/smoke-test.sh http://localhost:8787
```

Optional with shop ID:

```bash
./scripts/smoke-test.sh http://localhost:8787 YOUR_SHOP_ID
```

## 4) Load Chrome extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select folder: `projects/sellerpulse-extension`

## 5) Connect Etsy

In extension popup:
1. Set connector URL: `http://localhost:8787`
2. Set default shop ID
3. Click **Connect Etsy**
4. Approve Etsy OAuth
5. Click **Check Connector** (should show connected)

## 6) Validate live workflow

- Visit any Etsy listing page
- Click floating **Analyze in SellerPulse** button
- Analyzer opens
- Click **Sync Live Data** (or auto-sync from extension)
- Confirm:
  - KPI cards populate
  - batch table shows listing rows
  - live sync status = success

## 7) Go-live checks (pass criteria)
- Connector `/health` returns ok
- `/auth/status` shows connected=true
- `/api/sync` returns listings + totals
- Extension button appears on Etsy listing pages
- Analyzer opens with `shop_id`/`listing_id` query params
- Live sync succeeds end-to-end

## Troubleshooting quick hits
- `missing_config`: credentials not set in `.env`
- `not_connected`: OAuth not completed yet
- CORS/network issues: ensure connector URL in popup exactly `http://localhost:8787`
- Listing not found: verify shop ID belongs to authenticated account
