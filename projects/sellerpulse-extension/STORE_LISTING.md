# Chrome Web Store Listing Draft

## Name
SellerPulse for Etsy

## One-line summary
Analyze Etsy listings in SellerPulse with one click.

## Detailed description
SellerPulse for Etsy adds a fast “Analyze in SellerPulse” action directly on Etsy pages.

Use it to:
- open SellerPulse Analyzer from Etsy listing pages
- pass listing/shop context into the analyzer
- trigger live sync through your SellerPulse Connector (official Etsy OAuth + API)

Why it helps:
- less manual copy/paste
- faster weekly optimization loop
- cleaner workflow for Etsy shops

## Permissions rationale
- `storage`: save connector URL and defaults
- `tabs` / `activeTab`: open SellerPulse pages and read active Etsy tab URL context
- host access to `*.etsy.com`: show action button on Etsy pages
- host access to local connector URL: connect/sync actions
- host access to SellerPulse GitHub Pages URL: open analyzer pages

## Category
Productivity

## Privacy policy URL
(Host `PRIVACY_POLICY.md` on repo/docs and use public URL)

## Suggested screenshots
1. Etsy listing page with floating “Analyze in SellerPulse” button
2. Extension popup settings
3. SellerPulse analyzer with live sync results
