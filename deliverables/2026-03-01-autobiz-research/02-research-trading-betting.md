# Research Bot B — Trading & Betting Opportunities

## Prompt

[Sun 2026-03-01 13:07 EST] [Subagent Context] You are running as a subagent (depth 1/1). Results auto-announce to your requester; do not busy-poll for status.

[Subagent Task]: You are Research Bot B. Research autonomous trading and betting style opportunities for a small operator. Cover crypto, prediction markets, sports/stat arb, and market-making style ideas, but prioritize legality and risk controls. For each idea include expected edge source, required capital, tooling stack, realistic return range, downside/drawdown profile, legal/regulatory concerns, and whether it can be mostly automated by an AI agent. End with a strict risk policy and recommendation on whether to pursue or avoid each idea.

## Output

Completed. Here’s a practical, legality-first map of **autonomous trading/betting opportunities for a small operator**.

## Big picture (for a small operator)
- Most “easy alpha” in public markets is competed away.
- What still works: **execution edge, speed, discipline, and risk controls**.
- Avoid models that depend on hidden info, exchange abuse, or unclear legal status.

---

## 1) Crypto funding-rate carry (delta-neutral)
**What it is:** Long spot + short perp (or reverse) to collect positive net funding.

- **Edge source:** Structural imbalance between leveraged longs/shorts.
- **Capital needed:** ~$10k minimum to matter; better $25k+ for fees/slippage buffer.
- **Tooling:** Exchange APIs (CCXT), position reconciler, funding monitor, auto-hedger, alerting.
- **Realistic return:** ~5–20% annualized in normal conditions (can spike higher briefly).
- **Downside/drawdown:** Basis blowouts, forced liquidations if hedge fails, exchange/custody risk.
- **Legal/regulatory:** Depends on jurisdiction and venue licensing; derivatives access may be restricted for US retail on many platforms.
- **AI automation fit:** **High** (monitoring, execution, rebalancing, risk triggers).
- **Recommendation:** **PURSUE (with strict venue/risk controls).**

---

## 2) Cross-exchange crypto basis/arb (spot-spot or spot-perp)
**What it is:** Buy cheaper venue, sell richer venue.

- **Edge source:** Fragmented liquidity + latency + temporary dislocations.
- **Capital needed:** $20k+ across multiple venues; extra inventory per asset.
- **Tooling:** Multi-exchange router, low-latency quotes, transfer/risk engine, fee optimizer.
- **Realistic return:** ~5–30% annualized gross; net can collapse after fees/slippage.
- **Downside/drawdown:** Transfer delays, stuck capital, exchange failure, stale quotes.
- **Legal/regulatory:** KYC/AML and cross-border restrictions; tax complexity high.
- **AI automation fit:** **Medium-high** (execution/monitoring yes; infra reliability is key).
- **Recommendation:** **PURSUE cautiously** only if you can operationally manage inventory and venue risk.

---

## 3) On-chain AMM liquidity provision (market-making via LP)
**What it is:** Provide liquidity to DEX pools and collect fees/incentives.

- **Edge source:** Earn spread/fees from flow; incentives on certain pools.
- **Capital needed:** $5k+ (realistically $25k+ for diversification and gas efficiency).
- **Tooling:** Vault/LP manager, rebalancer, IL analytics, smart-contract risk scoring.
- **Realistic return:** Wide range, often **-20% to +40% annualized** depending on volatility and incentives.
- **Downside/drawdown:** Impermanent loss, smart-contract exploits, oracle/manipulation risk.
- **Legal/regulatory:** Token listing status and DeFi compliance uncertainty in some regions.
- **AI automation fit:** **Medium** (strategy rules automatable; exploit risk not automatable away).
- **Recommendation:** **LIMITED PURSUE** (only blue-chip pools, capped allocation).

---

## 4) Prediction market market-making (two-sided quoting)
**What it is:** Quote both YES/NO around fair probability and capture spread.

- **Edge source:** Retail order-flow inefficiency + wide spreads in less liquid contracts.
- **Capital needed:** $5k–$50k depending on market depth.
- **Tooling:** Odds normalizer, probability model, quote engine, inventory/risk limits.
- **Realistic return:** ~10–35% annualized possible in niche books; highly variable.
- **Downside/drawdown:** Event-resolution risk, liquidity gaps, correlated headline shocks.
- **Legal/regulatory:** **Critical**—jurisdiction and platform permissions vary; US access may be constrained by platform/event type and regulator stance.
- **AI automation fit:** **High** for quoting/risk, **medium** for event modeling.
- **Recommendation:** **PURSUE only on clearly licensed/permitted venues for your jurisdiction.**

---

## 5) Prediction market directional/stat models (election, macro, sports events)
**What it is:** Bet when model probability differs from market implied odds.

- **Edge source:** Better forecasting features/calibration than crowd in specific niches.
- **Capital needed:** $2k+; scales with edge confidence and liquidity.
- **Tooling:** Data pipeline, calibration framework (Brier/log-loss), execution bot.
- **Realistic return:** Could be strong in niche domains, but often noisy; expect long flat/drawdown periods.
- **Downside/drawdown:** Model decay, regime shifts, overfitting.
- **Legal/regulatory:** Same venue/jurisdiction constraints as above.
- **AI automation fit:** **Medium-high** (feature generation and monitoring strong; true edge still hard).
- **Recommendation:** **PURSUE as research sleeve**, small capital until statistically validated.

---

## 6) Sports betting arbitrage (multi-book surebets)
**What it is:** Lock profit via odds discrepancies across sportsbooks.

- **Edge source:** Price differences and slow line updates.
- **Capital needed:** $3k+ across many books; more is better for scalability.
- **Tooling:** Odds scraper/API, arb detector, stake optimizer, rapid execution.
- **Realistic return:** ~2–15% annualized after account churn; often decays due to limits.
- **Downside/drawdown:** Voids, palp errors, limits/gubbing, payout friction, operational mistakes.
- **Legal/regulatory:** Must use legal books in licensed jurisdictions; account behavior may violate book TOS.
- **AI automation fit:** **High** technically, but **operational fragility high**.
- **Recommendation:** **LIMITED PURSUE** as short/medium-term cashflow tactic, not durable core business.

---

## 7) Sports “value betting” (model vs closing line)
**What it is:** Bet when your fair odds > book odds; track CLV.

- **Edge source:** Better pricing than softer books before market corrects.
- **Capital needed:** $2k–$20k.
- **Tooling:** Odds feeds, model, CLV tracker, bankroll allocator (fractional Kelly).
- **Realistic return:** Skilled operators may see ~3–12% ROI on turnover; variance very high.
- **Downside/drawdown:** 20–40% bankroll drawdowns are realistic even with edge.
- **Legal/regulatory:** Jurisdiction-dependent legality; TOS/account limiting common.
- **AI automation fit:** **Medium** (signal + staking automatable; model governance required).
- **Recommendation:** **PURSUE only if CLV-positive over large sample**; otherwise avoid.

---

## 8) “High-frequency” small-scale crypto market making (centralized exchange)
**What it is:** Continuous bid/ask quoting to capture spread rebates/spread.

- **Edge source:** Queue positioning + inventory control + microstructure.
- **Capital needed:** Usually $50k+ and strong infra to be competitive.
- **Tooling:** Low-latency infra, robust OMS, inventory/risk engine, exchange-specific tuning.
- **Realistic return:** For small operator without elite infra, often near zero or negative after fees/adverse selection.
- **Downside/drawdown:** Toxic flow, sudden volatility, inventory blowups.
- **Legal/regulatory:** Exchange/derivatives rules and licensing exposure.
- **AI automation fit:** **Medium** (control logic yes, but infra moat dominates).
- **Recommendation:** **AVOID** unless you already have serious technical edge and capital.

---

## Strict risk policy (non-negotiable)
1. **Legal first:** Trade only on venues legal for your residency and account type; complete KYC/AML.
2. **Capital protection:**  
   - Max **1% NAV risk per position idea**,  
   - Max **5% daily loss**, **10% weekly loss** hard stop,  
   - At breach: bot shuts down and requires manual review.
3. **Venue concentration:** Max **20–25% NAV per exchange/platform**.
4. **Leverage cap:** Prefer no leverage; if used, cap effective leverage at conservative levels (e.g., <=2x for carry sleeves).
5. **Automation controls:** Kill switch, heartbeat checks, stale-price guard, max slippage, max order size, circuit breakers.
6. **Model governance:** No live deployment without out-of-sample validation and paper/live-shadow period.
7. **Audit trail:** Log every signal/order/fill/error; daily PnL attribution.
8. **Tax/compliance:** Keep full records; assume taxable events are frequent and complex.
9. **Security:** Hardware keys, withdrawal whitelists, API key scope minimization, no hot-wallet overexposure.
10. **No martingale/chasing:** Size down after drawdown; never “double to recover.”

---

## Final pursue/avoid summary
- **PURSUE:**  
  1) Crypto funding carry (delta-neutral),  
  2) Cross-exchange basis/arb (if operationally mature),  
  3) Licensed prediction-market making,  
  4) Small, validated sports value sleeve.
- **LIMITED/EXPERIMENTAL PURSUE:**  
  - AMM LP (blue-chip only),  
  - Sports arb (tactical, not durable).
- **AVOID (for small operator):**  
  - Full HFT-style crypto market making without institutional-grade infra.

If useful, I can convert this into a **90-day implementation plan** (paper trade → limited live capital → scale gates) with concrete bot architecture and monitoring checklist.
