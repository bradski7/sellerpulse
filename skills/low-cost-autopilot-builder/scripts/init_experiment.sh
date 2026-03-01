#!/usr/bin/env bash
set -euo pipefail

slug="${1:-}"
workspace="${2:-$PWD}"

if [[ -z "$slug" ]]; then
  echo "Usage: init_experiment.sh <slug> [workspace]"
  exit 1
fi

base="$workspace/projects/$slug"
mkdir -p "$base"

cat > "$base/00_execution_plan.md" <<'EOF'
# Execution Plan

## Offer
- 

## Buyer
- 

## Price
- 

## Delivery
- 

## 14-day scope
- 

## KPI gates
- 

## Budget gate
- Start budget:
- Next budget trigger:
EOF

cat > "$base/README.md" <<'EOF'
# Project README

## What this project is

## How to use/run

## Current status
- [ ] MVP built
- [ ] Published
- [ ] First KPI review complete
EOF

cat > "$base/launch_copy.md" <<'EOF'
# Launch Copy

## Short hook

## Value bullets

## CTA
EOF

cat > "$base/weekly_kpis.csv" <<'EOF'
week,visits,actions,orders,revenue,ad_spend,notes
1,0,0,0,0,0,
EOF

echo "Initialized experiment at: $base"
