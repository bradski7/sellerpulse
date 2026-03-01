import crypto from "node:crypto";
import express from "express";
import dotenv from "dotenv";
import { fetchShopSnapshot } from "./etsy.mjs";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 8787);
const ETSY_CLIENT_ID = process.env.ETSY_CLIENT_ID;
const ETSY_CLIENT_SECRET = process.env.ETSY_CLIENT_SECRET;
const ETSY_REDIRECT_URI = process.env.ETSY_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;
const ETSY_SCOPES = (process.env.ETSY_SCOPES || "listings_r shops_r transactions_r").trim();

const oauthStateStore = new Map();
let tokenStore = {
  access_token: null,
  refresh_token: null,
  expires_at: 0,
  scope: "",
};

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "sellerpulse-connector",
    hasClientId: Boolean(ETSY_CLIENT_ID),
    hasClientSecret: Boolean(ETSY_CLIENT_SECRET),
    redirectUri: ETSY_REDIRECT_URI,
    tokenLoaded: Boolean(tokenStore.access_token),
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
  if (req.query.json === "1") {
    return res.json({ connectUrl });
  }
  return res.redirect(connectUrl);
});

app.get("/auth/callback", async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;

  if (error) {
    return res.status(400).json({ error, errorDescription });
  }

  if (!state || !oauthStateStore.has(String(state))) {
    return res.status(400).json({ error: "invalid_state" });
  }

  oauthStateStore.delete(String(state));

  if (!code) {
    return res.status(400).json({ error: "missing_code" });
  }

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: ETSY_CLIENT_ID,
      redirect_uri: ETSY_REDIRECT_URI,
      code: String(code),
      client_secret: ETSY_CLIENT_SECRET,
    });

    const tokenRes = await fetch("https://api.etsy.com/v3/public/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).json({ error: "token_exchange_failed", details: tokenJson });
    }

    tokenStore = {
      access_token: tokenJson.access_token,
      refresh_token: tokenJson.refresh_token,
      expires_at: Date.now() + Number(tokenJson.expires_in || 0) * 1000,
      scope: tokenJson.scope || ETSY_SCOPES,
    };

    return res.send(
      `<html><body style="font-family:system-ui;padding:24px;background:#0b1020;color:#eaf0ff">
      <h2>SellerPulse Connector</h2>
      <p>Etsy connected successfully.</p>
      <p>You can now call <code>/api/sync?shop_id=YOUR_SHOP_ID</code>.</p>
      </body></html>`,
    );
  } catch (err) {
    return res.status(500).json({ error: "oauth_callback_failed", message: String(err.message || err) });
  }
});

app.get("/api/sync", async (req, res) => {
  if (!tokenStore.access_token) {
    return res.status(401).json({ error: "not_connected", message: "Run /auth/start first." });
  }

  const shopId = req.query.shop_id;
  const days = Number(req.query.days || 30);

  if (!shopId) {
    return res.status(400).json({ error: "missing_shop_id" });
  }

  try {
    const snapshot = await fetchShopSnapshot({
      accessToken: tokenStore.access_token,
      clientId: ETSY_CLIENT_ID,
      shopId,
      days,
    });

    return res.json(snapshot);
  } catch (err) {
    return res.status(500).json({ error: "sync_failed", message: String(err.message || err) });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SellerPulse connector running on http://localhost:${PORT}`);
});
