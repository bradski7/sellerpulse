# Deploy SellerPulse Lite on GitHub Pages (No Budget)

## Goal
Host `landing.html` + `index.html` publicly for free.

## Option A (fast): use `/docs`
1. Create `docs/sellerpulse/` in repo.
2. Copy these files into it:
   - `landing.html` (rename to `index.html` for landing)
   - `index.html` (rename to `analyzer.html`)
   - `styles.css`
   - `app.js`
3. In GitHub repo settings:
   - Pages -> Source: `Deploy from branch`
   - Branch: `main` / folder: `/docs`
4. Your URL will be:
   - `https://bradski7.github.io/OpenClaw/sellerpulse/`

## Option B: separate repo/site
- Put sellerpulse files in a dedicated repo and enable Pages from root.

## Recommended page structure
- `index.html` = landing page + CTA
- `analyzer.html` = free SellerPulse Lite tool
- CTA button from landing -> analyzer and Pro purchase link

## Launch checklist
- [ ] Add your Pro buy link in `landing.html`
- [ ] Add contact/support email
- [ ] Add simple privacy note
- [ ] Test on mobile
