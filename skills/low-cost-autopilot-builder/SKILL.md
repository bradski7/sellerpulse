---
name: low-cost-autopilot-builder
description: "Build and operate low-cost online business experiments with high automation and minimal owner effort. Use when planning, launching, or iterating micro-SaaS, Etsy digital products, lightweight apps, or lead-gen offers under tight budget constraints. Triggers: requests to start building, go autonomous, ship an MVP, find low-cost ideas, create a launch plan, or optimize weekly KPIs."
---

# Low-Cost Autopilot Builder

## Overview
Run a repeatable execution loop for low-budget business experiments: select one offer, ship a minimal deliverable fast, publish with a clear CTA, measure KPIs weekly, and either scale or kill.

## Workflow

1. **Choose one lane only** (no parallel fragmentation)
   - Prefer the lane with fastest time-to-first-revenue and lowest setup cost.
   - Default order: existing distribution channel first (e.g., Etsy) → lightweight software add-on → speculative experiments.

2. **Define a 14-day sprint scope**
   - Write: offer, buyer, delivery format, price, and success threshold.
   - Keep scope tight enough to ship in 2–5 days.

3. **Build MVP artifacts**
   - Create only essentials: product files/app screens/listings/landing copy/CTA.
   - Avoid optional features before first demand signal.

4. **Publish + distribution**
   - Ship to one channel (Etsy/listing page/simple landing page).
   - Add one clear next action: buy, download, join waitlist, or request demo.

5. **Track KPI gates weekly**
   - Use the thresholds in `references/kpi-gates.md`.
   - Decide quickly: scale, improve, or kill.

6. **Iterate in tight loops**
   - Prioritize conversion fixes before traffic expansion.
   - Add budget only after core conversion thresholds are met.

## Hard Rules

- Keep current-phase budget near zero unless KPI gates justify spend.
- Do not start a second main product until the first has a clear pass/fail decision.
- Prefer reusable assets (templates, scripts, listing frameworks) over custom one-offs.
- Push code/deliverables to git after meaningful progress.
- Ask for owner input only on money gates, legal/compliance decisions, or irreversible account actions.

## Recommended Deliverables Per Sprint

- `00_execution_plan.md` (scope, pricing, KPI gates, decision points)
- `README.md` (how to run/use)
- `launch_copy.md` (listing/landing/announcement copy)
- `weekly_kpis.csv` or simple dashboard file

## Use the bundled resources

- Read `references/decision-framework.md` when selecting the next lane.
- Read `references/kpi-gates.md` before recommending budget increases.
- Run `scripts/init_experiment.sh <slug> [workspace]` to scaffold a new experiment folder quickly.
