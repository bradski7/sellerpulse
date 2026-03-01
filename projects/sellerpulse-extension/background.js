const DEFAULTS = {
  connectorBaseUrl: "http://localhost:8787",
  defaultShopId: "",
  defaultDays: 30,
};

const ANALYZER_BASE = "https://bradski7.github.io/sellerpulse/sellerpulse/analyzer.html";

function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULTS, (items) => resolve(items));
  });
}

function buildAnalyzerUrl({ listingId = "", shopId = "", autoSync = false, connectorBaseUrl = DEFAULTS.connectorBaseUrl, days = 30 }) {
  const url = new URL(ANALYZER_BASE);
  url.searchParams.set("source", "extension");
  if (listingId) url.searchParams.set("listing_id", String(listingId));
  if (shopId) url.searchParams.set("shop_id", String(shopId));
  if (connectorBaseUrl) url.searchParams.set("connector_base", connectorBaseUrl);
  if (days) url.searchParams.set("days", String(days));
  if (autoSync) url.searchParams.set("auto_sync", "1");
  return url.toString();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      const settings = await getSettings();

      if (message?.type === "OPEN_ANALYZER") {
        const url = buildAnalyzerUrl({
          listingId: message.listingId,
          shopId: message.shopId || settings.defaultShopId,
          autoSync: Boolean(message.autoSync),
          connectorBaseUrl: settings.connectorBaseUrl,
          days: settings.defaultDays,
        });

        chrome.tabs.create({ url });
        sendResponse({ ok: true, url });
        return;
      }

      if (message?.type === "OPEN_CONNECT") {
        const base = (settings.connectorBaseUrl || DEFAULTS.connectorBaseUrl).replace(/\/$/, "");
        chrome.tabs.create({ url: `${base}/auth/start` });
        sendResponse({ ok: true });
        return;
      }

      sendResponse({ ok: false, error: "unknown_message" });
    } catch (err) {
      sendResponse({ ok: false, error: String(err.message || err) });
    }
  })();

  return true;
});
