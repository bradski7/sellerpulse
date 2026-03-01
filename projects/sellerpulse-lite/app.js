const $ = (id) => document.getElementById(id);

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

function analyze() {
  const views = Number($("views").value || 0);
  const orders = Number($("orders").value || 0);
  const revenue = Number($("revenue").value || 0);
  const adSpend = Number($("adSpend").value || 0);
  const favorites = Number($("favorites").value || 0);
  const multiOrders = Number($("multiOrders").value || 0);

  const cvr = views > 0 ? orders / views : 0;
  const aov = orders > 0 ? revenue / orders : 0;
  const roas = adSpend > 0 ? revenue / adSpend : 0;
  const favRate = views > 0 ? favorites / views : 0;
  const attachRate = orders > 0 ? multiOrders / orders : 0;

  // weighted score out of 100
  const cvrScore = Math.min((cvr / 0.03) * 30, 30); // target 3%
  const aovScore = Math.min((aov / 30) * 20, 20);   // target $30
  const roasScore = Math.min((roas / 2.5) * 20, 20); // target 2.5
  const favScore = Math.min((favRate / 0.08) * 15, 15); // target 8%
  const attachScore = Math.min((attachRate / 0.2) * 15, 15); // target 20%
  const score = Math.round(cvrScore + aovScore + roasScore + favScore + attachScore);

  const metrics = [
    { label: "Conversion Rate", value: pct(cvr), cls: metricClass(cvr, 0.03, 0.02) },
    { label: "AOV", value: money(aov), cls: metricClass(aov, 30, 20) },
    { label: "ROAS", value: roas.toFixed(2), cls: metricClass(roas, 2.5, 1.5) },
    { label: "Favorite Rate", value: pct(favRate), cls: metricClass(favRate, 0.08, 0.05) },
    { label: "Attach Rate", value: pct(attachRate), cls: metricClass(attachRate, 0.2, 0.12) },
  ];

  const kpiGrid = $("kpiGrid");
  kpiGrid.innerHTML = "";
  metrics.forEach((m) => {
    const div = document.createElement("div");
    div.className = "kpi";
    div.innerHTML = `<small>${m.label}</small><strong class="${m.cls}">${m.value}</strong>`;
    kpiGrid.appendChild(div);
  });

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
    actions.push("Add explicit cross-sell block: 'Pair with X/Y' in listing image #2 and description CTA.");
  }

  if (roas < 1.5 && adSpend > 0) {
    actions.push("Pause low-performing ad set and shift spend to top-converting listing only.");
  } else if (roas >= 2.5 && adSpend > 0) {
    actions.push("Scale ad spend on winning listing by 15-20% this week.");
  }

  if (favRate < 0.05) {
    actions.push("Improve listing visual hook: clearer before/after outcome and add social proof line.");
  }

  if (actions.length === 0) {
    actions.push("Metrics look healthy. Focus this week on launching one adjacent product and one bundle test.");
  }

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

$("analyzeBtn").addEventListener("click", analyze);
analyze();
