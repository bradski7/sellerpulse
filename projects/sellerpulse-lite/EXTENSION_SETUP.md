# SellerPulse Chrome Extension Setup

## 1) Load extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select folder: `projects/sellerpulse-extension`

## 2) Start connector locally

```bash
cd projects/sellerpulse-connector
cp .env.example .env
# fill Etsy client id/secret in .env
npm install
npm run dev
```

## 3) Connect Etsy OAuth

- Click extension icon -> **Connect Etsy**
- Approve OAuth

## 4) Analyze from Etsy page

- Visit any Etsy listing page
- Click floating **Analyze in SellerPulse** button
- Analyzer opens with auto-sync query params

## 5) Optional popup settings

- Connector URL (default `http://localhost:8787`)
- Default Shop ID
- Sync days window

## 6) Package extension zip

```bash
cd projects/sellerpulse-extension
./package-extension.sh
```

Output: `projects/sellerpulse-extension/dist/*.zip`

## Notes

- Extension is UX. Real data comes from Etsy API via connector.
- If live sync fails, verify connector is running and OAuth completed.
- For store submission docs, see:
  - `projects/sellerpulse-extension/PRIVACY_POLICY.md`
  - `projects/sellerpulse-extension/STORE_LISTING.md`
