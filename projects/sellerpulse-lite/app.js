const $ = (id) => document.getElementById(id);
let lastAnalysis = null;

function pct(n) {
  return `${(n * 100).toFixed(2)}%`;
}

function money(n) {
  return `$${n.toFixed(2)}`;
}

function metricClass(value, good, warn) {
  if (value >= good) return "good";
  if (value >= warn) return "warn";
  return "bad";
}

function getInputs() {
  return {
    views: Number($("views").value || 0),
    orders: Number($("orders").value || 0),
    revenue: Number($("revenue").value || 0),
    adSpend: Number($("adSpend").value || 0),
    favorites: Number($("favorites").value || 0),
    multiOrders: Number($("multiOrders").value || 0),
  };
}

function computeMetrics(inputs) {
  const { views, orders, revenue, adSpend, favorites, multiOrders } = inputs;

  const cvr = views > 0 ? orders / views : 0;
  const aov = orders > 0 ? revenue / orders : 0;
  const roas = adSpend > 0 ? revenue / adSpend : 0;
  const favRate = views > 0 ? favorites / views : 0;
  const attachRate = orders > 0 ? multiOrders / orders : 0;

  // weighted score out of 100
  const cvrScore = Math.min((cvr / 0.03) * 30, 30); // target 3%
  const aovScore = Math.min((aov / 30) * 20, 20); // target $30
  const roasScore = Math.min((roas / 2.5) * 20, 20); // target 2.5
  const favScore = Math.min((favRate / 0.08) * 15, 15); // target 8%
  const attachScore = Math.min((attachRate / 0.2) * 15, 15); // target 20%
  const score = Math.round(cvrScore + aovScore + roasScore + favScore + attachScore);

  return { cvr, aov, roas, favRate, attachRate, score };
}

function buildActions(metrics) {
  const { cvr, aov, roas, favRate, attachRate } = metrics;
  const actions = [];

  if (cvr < 0.02) {
    actions.push(
      "Rewrite title + first 3 tags around one high-intent keyword; replace primary thumbnail text with clearer outcome promise.",
    );
  } else if (cvr < 0.03) {
    actions.push("Run A/B test on thumbnail and first 2 description lines to push conversion above 3%.");
  }

  if (aov < 20) {
    actions.push("Create a bundle SKU and add post-purchase 15% coupon to increase average order value.");
  }

  if (attachRate < 0.12) {
    actions.push("Add explicit cross-sell block: 'Pair with X/Y' in listing image #2 and description CTA.");
  }

  if (roas < 1.5 && roas > 0) {
    actions.push("Pause low-performing ad set and shift spend to top-converting listing only.");
  } else if (roas >= 2.5) {
    actions.push("Scale ad spend on winning listing by 15-20% this week.");
  }

  if (favRate < 0.05) {
    actions.push("Improve listing visual hook: clearer before/after outcome and add social proof line.");
  }

  if (actions.length === 0) {
    actions.push("Metrics look healthy. Focus this week on launching one adjacent product and one bundle test.");
  }

  return actions;
}

function render(metrics, actions) {
  const { cvr, aov, roas, favRate, attachRate, score } = metrics;

  const metricCards = [
    { label: "Conversion Rate", value: pct(cvr), cls: metricClass(cvr, 0.03, 0.02) },
    { label: "AOV", value: money(aov), cls: metricClass(aov, 30, 20) },
    { label: "ROAS", value: roas.toFixed(2), cls: metricClass(roas, 2.5, 1.5) },
    { label: "Favorite Rate", value: pct(favRate), cls: metricClass(favRate, 0.08, 0.05) },
    { label: "Attach Rate", value: pct(attachRate), cls: metricClass(attachRate, 0.2, 0.12) },
  ];

  const kpiGrid = $("kpiGrid");
  kpiGrid.innerHTML = "";
  metricCards.forEach((m) => {
    const div = document.createElement("div");
    div.className = "kpi";
    div.innerHTML = `<small>${m.label}</small><strong class="${m.cls}">${m.value}</strong>`;
    kpiGrid.appendChild(div);
  });

  const list = $("actionList");
  list.innerHTML = "";
  actions.forEach((a) => {
    const li = document.createElement("li");
    li.textContent = a;
    list.appendChild(li);
  });

  $("score").textContent = score;
  $("results").hidden = false;
  $("recommendations").hidden = false;
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

function parseCsv(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.");
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const values = lines[1].split(",").map((v) => v.trim());
  const row = {};

  headers.forEach((h, i) => {
    row[h] = values[i] ?? "";
  });

  return row;
}

function setInputsFromRow(row) {
  const aliases = {
    views: ["views", "listingViews"],
    orders: ["orders"],
    revenue: ["revenue", "sales"],
    adSpend: ["adSpend", "adspend", "ads"],
    favorites: ["favorites", "favs"],
    multiOrders: ["multiOrders", "orders2plus", "multi"],
  };

  Object.entries(aliases).forEach(([field, keys]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== "") {
        $(field).value = Number(row[key]) || 0;
        return;
      }
    }
  });
}

async function loadCsvRow() {
  const file = $("csvFile").files?.[0];
  if (!file) {
    alert("Choose a CSV file first.");
    return;
  }

  try {
    const text = await file.text();
    const row = parseCsv(text);
    setInputsFromRow(row);
    analyze();
  } catch (err) {
    alert(`CSV error: ${err.message}`);
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
  const template = "views,orders,revenue,adSpend,favorites,multiOrders\n500,15,420,80,40,3\n";
  downloadText("sellerpulse-template.csv", template);
}

$("analyzeBtn").addEventListener("click", analyze);
$("downloadPlanBtn").addEventListener("click", downloadPlan);
$("loadCsvBtn").addEventListener("click", loadCsvRow);
$("downloadCsvTemplateBtn").addEventListener("click", downloadCsvTemplate);

analyze();
