#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8787}"
SHOP_ID="${2:-}"

echo "[1/5] Checking connector health: $BASE_URL/health"
health=$(curl -fsS "$BASE_URL/health")
echo "$health" | sed 's/{/{\n  /; s/,/\n  /g; s/}/\n}/'

echo "[2/5] Checking auth status: $BASE_URL/auth/status"
auth=$(curl -fsS "$BASE_URL/auth/status")
echo "$auth" | sed 's/{/{\n  /; s/,/\n  /g; s/}/\n}/'

if [[ -n "$SHOP_ID" ]]; then
  echo "[3/5] Attempting live sync for shop_id=$SHOP_ID"
  set +e
  sync_resp=$(curl -sS "$BASE_URL/api/sync?shop_id=$SHOP_ID&days=30")
  code=$?
  set -e
  if [[ $code -ne 0 ]]; then
    echo "Sync request failed at transport layer."
    exit 1
  fi
  echo "$sync_resp" | head -c 1200
  echo
else
  echo "[3/5] Skipping /api/sync (no shop_id provided)"
fi

echo "[4/5] Verify OAuth start endpoint reachable"
set +e
oauth_headers=$(curl -sSI "$BASE_URL/auth/start" | head -n 8)
set -e
echo "$oauth_headers"

echo "[5/5] Smoke test complete"
