# SellerPulse Chrome Extension (MV3)

Use SellerPulse directly on Etsy pages.

## What it does (v1)

- Injects an **Analyze in SellerPulse** button on Etsy listing/shop pages
- Detects listing ID from URL when possible
- Opens SellerPulse Analyzer with prefilled query params
- Lets you configure connector URL + default shop ID in popup
- Provides quick actions:
  - Connect Etsy OAuth (via connector)
  - Open Analyzer
  - Open Analyzer + Auto Sync

## Folder

- `manifest.json`
- `background.js`
- `content-script.js`
- `popup.html`
- `popup.js`
- `popup.css`

## Install (Developer mode)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `projects/sellerpulse-extension`

## Required setup

- Run connector locally (`projects/sellerpulse-connector`)
- In extension popup, set connector URL (default `http://localhost:8787`)
- Optionally set default shop ID

## Notes

- This extension is a UX layer. Real data comes from official Etsy API via connector.
- Avoid scraping private Etsy pages; use OAuth + API flow.
