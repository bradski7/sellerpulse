# Day 1 — Ops & Automation Package

## Prompt

[Sun 2026-03-01 13:17 EST] [Subagent Context] You are running as a subagent (depth 1/1). Results auto-announce to your requester; do not busy-poll for status.

[Subagent Task]: You are Execution Bot 3. Build Day 1 operations package for an AI-operated Etsy store. Deliver: (1) cross-sell matrix for 9 products, (2) customer support macro library for top 12 support questions, (3) weekly KPI dashboard template with formulas/definitions, (4) 7-day execution checklist where AI does most tasks and owner only approves/publishes. Keep concise and execution-focused.

## Output

Completed. Here’s the **Day 1 Operations Package** for an AI-operated Etsy store (concise + execution-first).

---

## 1) Cross-Sell Matrix (9 Products)

### Product Catalog (example SKUs)
- **P1** Budget Planner (Printable)
- **P2** Debt Snowball Tracker
- **P3** Savings Challenge Bundle
- **P4** Meal Planner Kit
- **P5** Fitness Habit Tracker
- **P6** Wedding Planner Binder
- **P7** Small Business Expense Tracker
- **P8** Social Media Content Calendar
- **P9** Yearly Goal Planner

### Cross-sell Rules (Primary → Offer A / Offer B / Bundle)
- **P1** → P2 / P3 / “Personal Finance Starter Pack” (P1+P2+P3)
- **P2** → P1 / P3 / Finance Pack
- **P3** → P1 / P2 / Finance Pack
- **P4** → P5 / P9 / “Wellness + Planning Pack” (P4+P5+P9)
- **P5** → P4 / P9 / Wellness + Planning Pack
- **P6** → P9 / P8 / “Event Productivity Pack” (P6+P8+P9)
- **P7** → P8 / P1 / “Business Ops Pack” (P7+P8+P1)
- **P8** → P7 / P9 / Business Ops Pack
- **P9** → P1 / P8 / “Annual Success Pack” (P9+P1+P8)

### Implementation Placement
- **Listing description CTA:** “Pair this with [Offer A] for best results.”
- **Listing image #2:** “Customers also buy: [Offer A], [Offer B]”
- **Post-purchase message:** 15% coupon to bundle SKU (48-hour urgency).

---

## 2) Customer Support Macro Library (Top 12)

Use variables: `{first_name}`, `{order_id}`, `{product_name}`, `{download_link}`, `{shop_name}`, `{coupon_code}`.

1. **Download not received**
> Hi {first_name} — thanks for your order #{order_id}. Etsy digital files are in **Purchases & Reviews**. Direct link: {download_link}. If checkout was as guest, I can resend immediately.

2. **Can’t open file**
> Thanks for the note! {product_name} is delivered as [PDF/ZIP]. Please try desktop first and unzip before opening. If needed, I can send an alternate file format.

3. **Need different size**
> Absolutely — I can provide {product_name} in [A4/US Letter/A5]. Reply with your preferred size and I’ll send it.

4. **Customization request**
> Happy to help. Please share exact text/details you want changed. I’ll confirm feasibility + turnaround before starting.

5. **Where to print**
> Best results: home printer (draft test first) or local print shop (Staples/FedEx/Office Depot). Use “Actual Size” or 100% scale.

6. **Color mismatch**
> Colors vary by monitor/printer/paper settings. For closer match: print one test page, use matte paper, and disable “auto color enhance.”

7. **Refund request (digital)**
> I’m sorry it missed the mark. Because this is a digital item, refunds are limited once downloaded, but I can offer a fix/replacement file to make this right.

8. **Duplicate purchase**
> Thanks for flagging this. I can either provide a store credit coupon or help you contact Etsy support for duplicate billing review.

9. **Commercial use/license**
> License for {product_name}: [personal/commercial with limits]. Not allowed: reselling the original file or sharing as-is. I can offer extended license if needed.

10. **Order issue urgency**
> Got it — I’m prioritizing this now. Expected update within {time_window}. I’ll message you as soon as it’s resolved.

11. **Negative review recovery**
> I’m really sorry for the experience. I’d like to fix this fast: [option A], [option B]. If one works for you, I’ll process it right away.

12. **Coupon request**
> Thanks for your interest! Here’s a thank-you code: **{coupon_code}** (valid 48 hours). Let me know if you want bundle recommendations too.

---

## 3) Weekly KPI Dashboard Template (with formulas)

### KPI Block (weekly)
- **Sessions** = Etsy visits
- **Orders** = total orders
- **Revenue** = gross sales $
- **Ad Spend** = Etsy Ads $
- **Conversion Rate** = `Orders / Sessions`
- **AOV** (Avg Order Value) = `Revenue / Orders`
- **ROAS** = `Revenue / Ad Spend`
- **Cross-sell Attach Rate** = `Orders with 2+ items / Total Orders`
- **Refund Rate** = `Refunded Orders / Total Orders`
- **Message SLA (hrs)** = `Avg first response time`
- **Review Rate** = `New Reviews / Orders`
- **Avg Rating** = star average for week

### Traffic + Listing Performance
Per top 10 listings:
- Visits
- Orders
- Revenue
- CVR = `Orders/Visits`
- Favorite rate = `Favorites/Visits`
- Tag in dashboard: **Scale / Improve / Pause**

### Targets (starter benchmarks)
- CVR: **2.5%+**
- AOV: **+$2 WoW**
- Cross-sell attach: **20%+**
- Refund rate: **<2%**
- SLA: **<12h**
- ROAS: **>2.0**

### Weekly Decision Rules
- If CVR < 2% and visits >100 → improve thumbnails/title/tags.
- If visits low (<50) → SEO rewrite + add 1 new pin/post.
- If ROAS <1.5 for 7 days → pause ad set.
- If attach rate <15% → tighten bundle CTA and post-purchase coupon.

---

## 4) 7-Day Execution Checklist (AI-heavy, owner approves/publishes)

### Day 1 (Setup)
- AI: Audit top listings, map 9-SKU cross-sell links, draft bundle names/pricing.
- AI: Create 12 support macros in Etsy saved replies format.
- Owner: Approve bundle names + discount levels (10–20%).

### Day 2 (Listing Optimization)
- AI: Rewrite titles/tags/descriptions for top 9 listings with internal cross-sell CTA.
- AI: Generate image text overlays (“Pair with…”, “Bundle & Save”).
- Owner: Final approve and publish listing edits.

### Day 3 (Offers + Coupons)
- AI: Create coupon logic (new buyer, abandoned cart, post-purchase 48h).
- AI: Draft auto-message templates for each coupon trigger.
- Owner: Approve coupon percentages and activate.

### Day 4 (Support Automation)
- AI: Load and QA all 12 macros, map trigger keywords.
- AI: Build escalation labels: Refund risk / Technical issue / Custom request.
- Owner: Approve escalation policy + tone.

### Day 5 (KPI Dashboard Live)
- AI: Build weekly dashboard sheet + formulas + conditional formatting.
- AI: Import current week baseline data.
- Owner: Confirm targets/benchmarks.

### Day 6 (Promotion Engine)
- AI: Draft 7-day promo calendar (Etsy updates + Pinterest/IG captions).
- AI: Prepare 14 short posts linked to top bundles.
- Owner: Approve publishing queue.

### Day 7 (Review + Scale Decisions)
- AI: Produce weekly insight report (what to scale, fix, pause).
- AI: Recommend 2 new bundle experiments and 1 pricing test.
- Owner: Approve next-week actions and publish.

---

### Notes for main agent
- Built as a **plug-and-run ops pack**; can be adapted to real SKU names in ~30 minutes.
- Most work is AI-executable; owner involvement intentionally limited to approvals/publishing.
- If needed, next step is to convert this into:
  1) Etsy saved replies import text,
  2) Google Sheet template tabs + formulas prefilled,
  3) SOP doc for virtual assistant handoff.
