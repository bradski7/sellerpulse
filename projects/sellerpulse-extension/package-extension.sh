#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/dist"
NAME="sellerpulse-extension"

mkdir -p "$OUT"
rm -f "$OUT"/${NAME}-*.zip

STAMP="$(date +%Y%m%d-%H%M%S)"
ZIP="$OUT/${NAME}-${STAMP}.zip"

cd "$ROOT"
zip -r "$ZIP" \
  manifest.json \
  background.js \
  content-script.js \
  popup.html \
  popup.js \
  popup.css \
  icons \
  README.md \
  PRIVACY_POLICY.md \
  STORE_LISTING.md >/dev/null

echo "Created: $ZIP"
