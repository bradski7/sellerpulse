import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import dotenv from "dotenv";
import { fetchShopSnapshot } from "./etsy.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT || 8787);
const ETSY_CLIENT_ID = process.env.ETSY_CLIENT_ID;
const ETSY_CLIENT_SECRET = process.env.ETSY_CLIENT_SECRET;
const ETSY_REDIRECT_URI = process.env.ETSY_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;
const ETSY_SCOPES = (process.env.ETSY_SCOPES || "listings_r shops_r transactions_r").trim();

const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, "../data");
const TOKEN_FILE = process.env.TOKEN_FILE || path.join(DATA_DIR, "etsy-token.json");

const oauthStateStore = new Map();
let tokenStore = {
  access_token: null,
  refresh_token: null,
  expires_at: 0,
  scope: "",
};

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }
  return next();
});

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadTokenStore() {
  try {
    const raw = await fs.readFile(TOKEN_FILE, "utf8");
    const parsed = JSON.parse(raw);
    tokenStore = {
      access_token: parsed.access_token || null,
      refresh_token: parsed.refresh_token || null,
      expires_at: Number(parsed.expires_at || 0),
      scope: parsed.scope || "",
    };
  } catch {
    // ignore missing file
  }
}

async function saveTokenStore() {
  await ensureDataDir();
  await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenStore, null, 2), "utf8");
}

async function clearTokenStore() {
  tokenStore = { access_token: null, refresh_token: null, expires_at: 0, scope: "" };
  try {
    await fs.unlink(TOKEN_FILE);
  } catch {
    // ignore
  }
}

async function exchangeToken(payload) {
  const body = new URLSearchParams(payload);
  const tokenRes = await fetch("https://api.etsy.com/v3/public/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(`token_exchange_failed: ${JSON.stringify(tokenJson).slice(0, 400)}`);
  }

  tokenStore = {
    access_token: tokenJson.access_token,
    refresh_token: tokenJson.refresh_token || tokenStore.refresh_token,
    expires_at: Date.now() + Number(tokenJson.expires_in || 0) * 1000,
    scope: tokenJson.scope || ETSY_SCOPES,
  };

  await saveTokenStore();
  return tokenStore;
}

async function ensureValidAccessToken() {
  if (!tokenStore.access_token) return null;

  const ttlMs = tokenStore.expires_at - Date.now();
  if (ttlMs > 60_000) {
    return tokenStore.access_token;
  }

  if (!tokenStore.refresh_token) {
    return tokenStore.access_token;
  }

  await exchangeToken({
    grant_type: "refresh_token",
    client_id: ETSY_CLIENT_ID,
    refresh_token: tokenStore.refresh_token,
    client_secret: ETSY_CLIENT_SECRET,
  });

  return tokenStore.access_token;
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "sellerpulse-connector",
    hasClientId: Boolean(ETSY_CLIENT_ID),
    hasClientSecret: Boolean(ETSY_CLIENT_SECRET),
    redirectUri: ETSY_REDIRECT_URI,
    tokenLoaded: Boolean(tokenStore.access_token),
    tokenExpiresAt: tokenStore.expires_at || 0,
  });
});

app.get("/auth/status", (_req, res) => {
  res.json({
    connected: Boolean(tokenStore.access_token),
    expires_at: tokenStore.expires_at,
    scope: tokenStore.scope,
  });
});

app.get("/auth/start", (req, res) => {
  if (!ETSY_CLIENT_ID || !ETSY_CLIENT_SECRET) {
    return res.status(500).json({
      error: "missing_config",
      message: "Set ETSY_CLIENT_ID and ETSY_CLIENT_SECRET first.",
    });
  }

  const state = crypto.randomBytes(16).toString("hex");
  oauthStateStore.set(state, Date.now());

  const params = new URLSearchParams({
    response_type: "code",
    redirect_uri: ETSY_REDIRECT_URI,
    scope: ETSY_SCOPES,
    client_id: ETSY_CLIENT_ID,
    state,
  });

  const connectUrl = `https://www.etsy.com/oauth/connect?${params.toString()}`;
  if (req.query.json === "1") return res.json({ connectUrl });
  return res.redirect(connectUrl);
});

app.get("/auth/callback", async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;

  if (error) return res.status(400).json({ error, errorDescription });
  if (!state || !oauthStateStore.has(String(state))) return res.status(400).json({ error: "invalid_state" });

  oauthStateStore.delete(String(state));
  if (!code) return res.status(400).json({ error: "missing_code" });

  try {
    await exchangeToken({
      grant_type: "authorization_code",
      client_id: ETSY_CLIENT_ID,
      redirect_uri: ETSY_REDIRECT_URI,
      code: String(code),
      client_secret: ETSY_CLIENT_SECRET,
    });

    return res.send(
      `<html><body style="font-family:system-ui;padding:24px;background:#0b1020;color:#eaf0ff">
      <h2>SellerPulse Connector</h2>
      <p>Etsy connected successfully.</p>
      <p>You can now close this tab and run sync from SellerPulse.</p>
      </body></html>`,
    );
  } catch (err) {
    return res.status(500).json({ error: "oauth_callback_failed", message: String(err.message || err) });
  }
});

app.post("/auth/logout", async (_req, res) => {
  await clearTokenStore();
  res.json({ ok: true });
});

app.get("/api/sync", async (req, res) => {
  if (!tokenStore.access_token) {
    return res.status(401).json({ error: "not_connected", message: "Run /auth/start first." });
  }

  const shopId = req.query.shop_id;
  const days = Number(req.query.days || 30);

  if (!shopId) return res.status(400).json({ error: "missing_shop_id" });

  try {
    const accessToken = await ensureValidAccessToken();
    const snapshot = await fetchShopSnapshot({
      accessToken,
      clientId: ETSY_CLIENT_ID,
      shopId,
      days,
    });

    return res.json(snapshot);
  } catch (err) {
    return res.status(500).json({ error: "sync_failed", message: String(err.message || err) });
  }
});

app.get("/api/listing", async (req, res) => {
  if (!tokenStore.access_token) {
    return res.status(401).json({ error: "not_connected", message: "Run /auth/start first." });
  }

  const shopId = req.query.shop_id;
  const listingId = String(req.query.listing_id || "");
  const days = Number(req.query.days || 30);

  if (!shopId) return res.status(400).json({ error: "missing_shop_id" });
  if (!listingId) return res.status(400).json({ error: "missing_listing_id" });

  try {
    const accessToken = await ensureValidAccessToken();
    const snapshot = await fetchShopSnapshot({
      accessToken,
      clientId: ETSY_CLIENT_ID,
      shopId,
      days,
    });

    const listing = (snapshot.listings || []).find((l) => String(l.listing_id) === listingId);
    if (!listing) {
      return res.status(404).json({ error: "listing_not_found", listing_id: listingId, shop_id: shopId });
    }

    return res.json({
      fetched_at: snapshot.fetched_at,
      period_days: snapshot.period_days,
      shop_id: snapshot.shop_id,
      listing,
    });
  } catch (err) {
    return res.status(500).json({ error: "listing_sync_failed", message: String(err.message || err) });
  }
});

async function bootstrap() {
  await ensureDataDir();
  await loadTokenStore();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SellerPulse connector running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Connector bootstrap failed:", err);
  process.exit(1);
});
