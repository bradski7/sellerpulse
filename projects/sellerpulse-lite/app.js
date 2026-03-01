const $ = (id) => document.getElementById(id);
let lastAnalysis = null;

const SCENARIOS = {
  "weak-traffic": { views: 90, orders: 3, revenue: 84, adSpend: 12, favorites: 5, multiOrders: 0 },
  "weak-conversion": { views: 1200, orders: 10, revenue: 220, adSpend: 80, favorites: 70, multiOrders: 1 },
  healthy: { views: 750, orders: 26, revenue: 980, adSpend: 140, favorites: 90, multiOrders: 8 },
  "ad-overspend": { views: 900, orders: 14, revenue: 420, adSpend: 260, favorites: 55, multiOrders: 2 },
};

function pct(n) {
  return `${(n * 100).toFixed(2)}%`;
}

function money(n) {
  return `$${n.toFixed(2)}`;
}

function clampPercent(value, maxTarget) {
  if (maxTarget <= 0) return 0;
  return Math.max(0, Math.min(100, (value / maxTarget) * 100));
}

function metricClass(value, good, warn) {
  if (value >= good) return "good";
  if (value >= warn) return "warn";
  return "bad";
}

function metricBarClass(cls) {
  if (cls === "good") return "good-bg";
  if (cls === "warn") return "warn-bg";
  return "bad-bg";
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getInputs() {
  return {
    views: toNumber($("views")?.value),
    orders: toNumber($("orders")?.value),
    revenue: toNumber($("revenue")?.value),
    adSpend: toNumber($("adSpend")?.value),
    favorites: toNumber($("favorites")?.value),
    multiOrders: toNumber($("multiOrders")?.value),
  };
}

function setInputs(values) {
  Object.entries(values).forEach(([key, value]) => {
    const el = $(key);
    if (!el) return;
    el.value = Number(value) || 0;
  });
}

function computeMetrics(inputs) {
  const { views, orders, revenue, adSpend, favorites, multiOrders } = inputs;

  const cvr = views > 0 ? orders / views : 0;
  const aov = orders > 0 ? revenue / orders : 0;
  const roas = adSpend > 0 ? revenue / adSpend : 0;
  const favRate = views > 0 ? favorites / views : 0;
  const attachRate = orders > 0 ? multiOrders / orders : 0;

  const cvrScore = Math.min((cvr / 0.03) * 30, 30);
  const aovScore = Math.min((aov / 30) * 20, 20);
  const roasScore = Math.min((roas / 2.5) * 20, 20);
  const favScore = Math.min((favRate / 0.08) * 15, 15);
  const attachScore = Math.min((attachRate / 0.2) * 15, 15);
  const score = Math.round(cvrScore + aovScore + roasScore + favScore + attachScore);

  return { cvr, aov, roas, favRate, attachRate, score };
}

function buildActions(metrics) {
  const { cvr, aov, roas, favRate, attachRate } = metrics;
  const actions = [];

  if (cvr < 0.02) {
    actions.push("Rewrite title + first 3 tags around one high-intent keyword; replace primary thumbnail text with clearer outcome promise.");
  } else if (cvr < 0.03) {
    actions.push("Run A/B test on thumbnail and first 2 description lines to push conversion above 3%.");
  }

  if (aov < 20) {
    actions.push("Create a bundle SKU and add post-purchase 15% coupon to increase average order value.");
  }

  if (attachRate < 0.12) {
    actions.push("Add explicit cross-sell block in listing image #2 and description CTA.");
  }

  if (roas < 1.5 && roas > 0) {
    actions.push("Pause low-performing ad sets and shift spend to top-converting listings only.");
  } else if (roas >= 2.5) {
    actions.push("Scale ad spend on your winner by 15–20% this week.");
  }

  if (favRate < 0.05) {
    actions.push("Improve visual hook and opening offer clarity to convert favorites into orders.");
  }

  if (actions.length === 0) {
    actions.push("Metrics are healthy. Launch one adjacent product and one bundle test this week.");
  }

  return actions;
}

function buildSummary(metrics) {
  const { cvr, aov, roas, favRate, attachRate, score } = metrics;
  const bottleneck =
    cvr < 0.02
      ? "conversion"
      : roas < 1.5
        ? "paid traffic efficiency"
        : aov < 20
          ? "order value"
          : "volume expansion";

  return `Score ${score}/100. Primary bottleneck: ${bottleneck}. CVR ${pct(cvr)}, AOV ${money(aov)}, ROAS ${roas.toFixed(2)}, Favorites ${pct(favRate)}, Attach ${pct(attachRate)}.`;
}

function render(metrics, actions) {
  const { cvr, aov, roas, favRate, attachRate, score } = metrics;

  const metricCards = [
    { label: "Conversion Rate", value: pct(cvr), cls: metricClass(cvr, 0.03, 0.02), bar: clampPercent(cvr, 0.04) },
    { label: "AOV", value: money(aov), cls: metricClass(aov, 30, 20), bar: clampPercent(aov, 40) },
    { label: "ROAS", value: roas.toFixed(2), cls: metricClass(roas, 2.5, 1.5), bar: clampPercent(roas, 4) },
    { label: "Favorite Rate", value: pct(favRate), cls: metricClass(favRate, 0.08, 0.05), bar: clampPercent(favRate, 0.1) },
    { label: "Attach Rate", value: pct(attachRate), cls: metricClass(attachRate, 0.2, 0.12), bar: clampPercent(attachRate, 0.3) },
  ];

  const kpiGrid = $("kpiGrid");
  if (!kpiGrid) return;

  kpiGrid.innerHTML = "";
  metricCards.forEach((m) => {
    const div = document.createElement("div");
    const barClass = metricBarClass(m.cls);
    div.className = "kpi";
    div.innerHTML = `
      <small>${m.label}</small>
      <strong class="${m.cls}">${m.value}</strong>
      <div class="bar"><span class="${barClass}" style="width:${m.bar.toFixed(0)}%"></span></div>
    `;
    kpiGrid.appendChild(div);
  });

  const list = $("actionList");
  if (list) {
    list.innerHTML = "";
    actions.forEach((a) => {
      const li = document.createElement("li");
      li.textContent = a;
      list.appendChild(li);
    });
  }

  const summary = $("summaryText");
  if (summary) summary.textContent = buildSummary(metrics);

  const scoreEl = $("score");
  if (scoreEl) scoreEl.textContent = score;

  const scorePill = $("scorePill");
  if (scorePill) scorePill.hidden = false;

  const results = $("results");
  if (results) results.hidden = false;

  const rec = $("recommendations");
  if (rec) rec.hidden = false;
}

function analyze() {
  const inputs = getInputs();
  const metrics = computeMetrics(inputs);
  const actions = buildActions(metrics);
  render(metrics, actions);

  lastAnalysis = {
    timestamp: new Date().toISOString(),
    inputs,
    metrics,
    actions,
  };
}

function parseCsvRows(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.");
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });

  return rows;
}

function normalizeRow(row) {
  const pick = (keys) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== "") return row[key];
    }
    return "";
  };

  return {
    listing: pick(["listing", "sku", "title", "name"]) || "(unnamed)",
    views: toNumber(pick(["views", "listingViews"])),
    orders: toNumber(pick(["orders"])),
    revenue: toNumber(pick(["revenue", "sales"])),
    adSpend: toNumber(pick(["adSpend", "adspend", "ads"])),
    favorites: toNumber(pick(["favorites", "favs"])),
    multiOrders: toNumber(pick(["multiOrders", "orders2plus", "multi"])),
  };
}

function setInputsFromRow(row) {
  const normalized = normalizeRow(row);
  setInputs(normalized);
}

function renderBatchFromRows(rows, sourceLabel = "Batch") {
  const analyzed = rows.map((r) => {
    const metrics = computeMetrics(r);
    return { listing: r.listing || "(unnamed)", metrics };
  });

  if (!analyzed.length) return;

  analyzed.sort((a, b) => b.metrics.score - a.metrics.score);

  const avg = analyzed.reduce(
    (acc, cur) => {
      acc.cvr += cur.metrics.cvr;
      acc.aov += cur.metrics.aov;
      acc.roas += cur.metrics.roas;
      acc.score += cur.metrics.score;
      return acc;
    },
    { cvr: 0, aov: 0, roas: 0, score: 0 },
  );

  const n = analyzed.length;
  avg.cvr /= n;
  avg.aov /= n;
  avg.roas /= n;
  avg.score = Math.round(avg.score / n);

  const top = analyzed.slice(0, 3).map((x) => x.listing).join(", ") || "n/a";
  const low = analyzed.slice(-3).map((x) => x.listing).join(", ") || "n/a";

  const batchSummary = $("batchSummary");
  if (batchSummary) {
    batchSummary.textContent = `${sourceLabel}: analyzed ${n} listings · Avg score ${avg.score}/100 · Avg CVR ${pct(avg.cvr)} · Avg AOV ${money(avg.aov)} · Avg ROAS ${avg.roas.toFixed(2)}. Top: ${top}. Needs work: ${low}.`;
  }

  const body = $("batchTableBody");
  if (body) {
    body.innerHTML = "";
    analyzed.slice(0, 25).forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.listing}</td>
        <td>${row.metrics.score}</td>
        <td>${pct(row.metrics.cvr)}</td>
        <td>${money(row.metrics.aov)}</td>
        <td>${row.metrics.roas.toFixed(2)}</td>
      `;
      body.appendChild(tr);
    });
  }

  const batchResults = $("batchResults");
  if (batchResults) batchResults.hidden = false;
}

async function loadCsvRow() {
  const file = $("csvFile")?.files?.[0];
  if (!file) {
    alert("Choose a CSV file first.");
    return;
  }

  try {
    const text = await file.text();
    const rows = parseCsvRows(text);
    setInputsFromRow(rows[0]);
    analyze();
  } catch (err) {
    alert(`CSV error: ${err.message}`);
  }
}

async function batchAnalyzeCsv() {
  const file = $("csvFile")?.files?.[0];
  if (!file) {
    alert("Choose a CSV file first.");
    return;
  }

  try {
    const text = await file.text();
    const rawRows = parseCsvRows(text);
    const rows = rawRows.map(normalizeRow);
    renderBatchFromRows(rows, "CSV");
  } catch (err) {
    alert(`Batch CSV error: ${err.message}`);
  }
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPlan() {
  if (!lastAnalysis) analyze();
  if (!lastAnalysis) return;

  const { timestamp, inputs, metrics, actions } = lastAnalysis;

  const lines = [
    "SellerPulse Lite - Weekly Action Plan",
    `Generated: ${timestamp}`,
    "",
    "INPUTS",
    `views: ${inputs.views}`,
    `orders: ${inputs.orders}`,
    `revenue: ${inputs.revenue}`,
    `adSpend: ${inputs.adSpend}`,
    `favorites: ${inputs.favorites}`,
    `multiOrders: ${inputs.multiOrders}`,
    "",
    "METRICS",
    `CVR: ${pct(metrics.cvr)}`,
    `AOV: ${money(metrics.aov)}`,
    `ROAS: ${metrics.roas.toFixed(2)}`,
    `Favorite Rate: ${pct(metrics.favRate)}`,
    `Attach Rate: ${pct(metrics.attachRate)}`,
    `Health Score: ${metrics.score}/100`,
    "",
    "ACTIONS",
    ...actions.map((a, i) => `${i + 1}. ${a}`),
  ];

  downloadText("sellerpulse-weekly-plan.txt", lines.join("\n"));
}

function downloadCsvTemplate() {
  const template =
    "listing,views,orders,revenue,adSpend,favorites,multiOrders\n" +
    "Pet Intake Pack,500,15,420,80,40,3\n" +
    "Cleaner Dashboard,720,12,390,95,52,2\n";
  downloadText("sellerpulse-template.csv", template);
}

function saveSnapshot() {
  const inputs = getInputs();
  localStorage.setItem("sellerpulse_snapshot", JSON.stringify({ inputs, savedAt: new Date().toISOString() }));
  alert("Snapshot saved in this browser.");
}

function loadSnapshot() {
  const raw = localStorage.getItem("sellerpulse_snapshot");
  if (!raw) {
    alert("No snapshot found yet.");
    return;
  }
  const parsed = JSON.parse(raw);
  setInputs(parsed.inputs || {});
  analyze();
}

async function copySummary() {
  if (!lastAnalysis) analyze();
  if (!lastAnalysis) return;

  const text = [
    `SellerPulse score: ${lastAnalysis.metrics.score}/100`,
    `CVR: ${pct(lastAnalysis.metrics.cvr)}`,
    `AOV: ${money(lastAnalysis.metrics.aov)}`,
    `ROAS: ${lastAnalysis.metrics.roas.toFixed(2)}`,
    "Top actions:",
    ...lastAnalysis.actions.slice(0, 3).map((a, i) => `${i + 1}. ${a}`),
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    alert("Summary copied.");
  } catch {
    downloadText("sellerpulse-summary.txt", text);
    alert("Clipboard blocked. Downloaded summary instead.");
  }
}

function applyScenario() {
  const key = $("scenarioSelect")?.value;
  if (!key || !SCENARIOS[key]) return;
  setInputs(SCENARIOS[key]);
  analyze();
}

function setLiveStatus(text, cls = "muted") {
  const el = $("liveSyncStatus");
  if (!el) return;
  el.textContent = text;
  el.className = `form-status ${cls}`;
}

function getConnectorConfig() {
  const base = ($("connectorBaseUrl")?.value || "http://localhost:8787").trim().replace(/\/$/, "");
  const shopId = ($("shopIdInput")?.value || "").trim();
  const days = Number($("syncDaysInput")?.value || 30);
  return { base, shopId, days };
}

function connectEtsy() {
  const { base } = getConnectorConfig();
  window.open(`${base}/auth/start`, "_blank", "noopener,noreferrer");
  setLiveStatus("Opened Etsy OAuth. Complete connect, then click Sync Live Data.", "muted");
}

async function syncLiveData() {
  const { base, shopId, days } = getConnectorConfig();
  if (!shopId) {
    setLiveStatus("Enter your Etsy Shop ID first.", "bad");
    return;
  }

  setLiveStatus("Syncing live Etsy data…", "muted");

  try {
    const res = await fetch(`${base}/api/sync?shop_id=${encodeURIComponent(shopId)}&days=${encodeURIComponent(days)}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || data?.error || `Sync failed (${res.status})`);
    }

    const listingViews = Number(data?.listing_summary?.total_views_daily_tabulated || 0);
    const listingFavorers = Number(data?.listing_summary?.total_favorers || 0);
    const orders = Number(data?.totals?.orders || 0);
    const revenue = Number(data?.totals?.revenue || 0);

    setInputs({
      views: listingViews,
      orders,
      revenue,
      adSpend: getInputs().adSpend,
      favorites: listingFavorers,
      multiOrders: getInputs().multiOrders,
    });

    analyze();

    const rows = (data.listings || []).map((l) => ({
      listing: l.title || `Listing ${l.listing_id}`,
      views: Number(l.views || 0),
      orders: Number(l.orders_30d || 0),
      revenue: Number(l.revenue_30d || 0),
      adSpend: 0,
      favorites: Number(l.num_favorers || 0),
      multiOrders: 0,
    }));

    if (rows.length) {
      renderBatchFromRows(rows, "Live Etsy");
    }

    setLiveStatus(`Sync complete. Loaded ${rows.length} listings from shop ${shopId}.`, "good");
  } catch (err) {
    setLiveStatus(`Live sync failed: ${err.message}`, "bad");
  }
}

function bindIfPresent(id, event, handler) {
  const el = $(id);
  if (!el) return;
  el.addEventListener(event, handler);
}

bindIfPresent("analyzeBtn", "click", analyze);
bindIfPresent("saveSnapshotBtn", "click", saveSnapshot);
bindIfPresent("loadSnapshotBtn", "click", loadSnapshot);
bindIfPresent("copySummaryBtn", "click", copySummary);
bindIfPresent("downloadPlanBtn", "click", downloadPlan);
bindIfPresent("loadCsvBtn", "click", loadCsvRow);
bindIfPresent("batchAnalyzeBtn", "click", batchAnalyzeCsv);
bindIfPresent("downloadCsvTemplateBtn", "click", downloadCsvTemplate);
bindIfPresent("scenarioSelect", "change", applyScenario);
bindIfPresent("connectEtsyBtn", "click", connectEtsy);
bindIfPresent("syncLiveBtn", "click", syncLiveData);

analyze();
