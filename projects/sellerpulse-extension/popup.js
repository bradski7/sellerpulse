const DEFAULTS = {
  connectorBaseUrl: "http://localhost:8787",
  defaultShopId: "",
  defaultDays: 30,
};

const $ = (id) => document.getElementById(id);

function setStatus(text, cls = "muted") {
  const el = $("status");
  if (!el) return;
  el.textContent = text;
  el.className = cls;
}

function getConnectorBase() {
  return ($("connectorBaseUrl")?.value || DEFAULTS.connectorBaseUrl).trim().replace(/\/$/, "");
}

function getCurrentTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0] || null));
  });
}

function parseTabContext(urlString = "") {
  try {
    const url = new URL(urlString);
    const m = url.pathname.match(/\/listing\/(\d+)/i);
    return {
      listingId: m ? m[1] : "",
      shopId: url.searchParams.get("shop_id") || "",
    };
  } catch {
    return { listingId: "", shopId: "" };
  }
}

function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => resolve(response));
  });
}

async function loadSettings() {
  chrome.storage.sync.get(DEFAULTS, (items) => {
    $("connectorBaseUrl").value = items.connectorBaseUrl || DEFAULTS.connectorBaseUrl;
    $("defaultShopId").value = items.defaultShopId || "";
    $("defaultDays").value = Number(items.defaultDays || 30);
  });
}

function buildSettingsPayload() {
  return {
    connectorBaseUrl: getConnectorBase(),
    defaultShopId: ($("defaultShopId").value || "").trim(),
    defaultDays: Number($("defaultDays").value || 30),
  };
}

function persistSettings(silent = false) {
  const payload = buildSettingsPayload();
  return new Promise((resolve) => {
    chrome.storage.sync.set(payload, () => {
      if (!silent) setStatus("Saved settings.", "good");
      resolve(payload);
    });
  });
}

async function saveSettings() {
  await persistSettings(false);
}

async function checkConnectorHealth() {
  const base = getConnectorBase();
  try {
    const res = await fetch(`${base}/health`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

    const connected = data.tokenLoaded ? "connected" : "not connected";
    setStatus(`Connector OK · ${connected}`, data.tokenLoaded ? "good" : "warn");
  } catch (err) {
    setStatus(`Connector unavailable (${err.message})`, "bad");
  }
}

async function openAnalyzer(autoSync = false) {
  await persistSettings(true);
  const tab = await getCurrentTab();
  const ctx = parseTabContext(tab?.url || "");

  const response = await sendMessage({
    type: "OPEN_ANALYZER",
    listingId: ctx.listingId,
    shopId: ctx.shopId,
    autoSync,
  });

  if (response?.ok) {
    setStatus(autoSync ? "Opened analyzer with auto sync." : "Opened analyzer.", "good");
  } else {
    setStatus(`Open failed: ${response?.error || "unknown"}`, "bad");
  }
}

async function connectEtsy() {
  await persistSettings(true);
  const response = await sendMessage({ type: "OPEN_CONNECT" });
  if (response?.ok) {
    setStatus("Opened Etsy OAuth in a new tab.", "good");
  } else {
    setStatus(`Connect failed: ${response?.error || "unknown"}`, "bad");
  }
}

$("saveBtn").addEventListener("click", saveSettings);
$("healthBtn").addEventListener("click", checkConnectorHealth);
$("connectBtn").addEventListener("click", connectEtsy);
$("openAnalyzerBtn").addEventListener("click", () => openAnalyzer(false));
$("openAutoBtn").addEventListener("click", () => openAnalyzer(true));

loadSettings().then(() => {
  checkConnectorHealth();
});
