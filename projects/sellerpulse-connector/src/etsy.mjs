const ETSY_API_BASE = "https://openapi.etsy.com";

function toNumber(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && typeof value.amount !== "undefined") {
    const amount = Number(value.amount || 0);
    const divisor = Number(value.divisor || 100);
    return divisor > 0 ? amount / divisor : amount;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function etsyFetch(path, accessToken, clientId) {
  const res = await fetch(`${ETSY_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": clientId,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Etsy API ${res.status} ${path}: ${text.slice(0, 300)}`);
  }

  return res.json();
}

export async function fetchShopSnapshot({ accessToken, clientId, shopId, days = 30 }) {
  const since = Math.floor(Date.now() / 1000) - days * 86400;

  const active = await etsyFetch(
    `/v3/application/shops/${shopId}/listings/active?limit=100&offset=0`,
    accessToken,
    clientId,
  );

  const listings = active?.results || [];

  const receiptsResp = await etsyFetch(
    `/v3/application/shops/${shopId}/receipts?limit=100&offset=0&min_created=${since}&was_paid=true`,
    accessToken,
    clientId,
  );

  const receipts = receiptsResp?.results || [];

  const listingSalesMap = new Map();

  const totals = receipts.reduce(
    (acc, r) => {
      acc.orders += 1;
      acc.revenue += toNumber(r.grandtotal ?? r.total_price ?? 0);

      const transactions = Array.isArray(r.transactions) ? r.transactions : [];
      for (const tx of transactions) {
        const listingId = Number(tx.listing_id || 0);
        const qty = Number(tx.quantity || 0);
        const txRevenue = toNumber(tx.price) * (qty || 1);

        if (listingId > 0) {
          const prev = listingSalesMap.get(listingId) || { orders_30d: 0, quantity_30d: 0, revenue_30d: 0 };
          prev.orders_30d += 1;
          prev.quantity_30d += qty;
          prev.revenue_30d += txRevenue;
          listingSalesMap.set(listingId, prev);
        }

        acc.items += qty;
      }

      return acc;
    },
    { orders: 0, revenue: 0, items: 0 },
  );

  const listingDetails = await Promise.all(
    listings.slice(0, 100).map(async (listing) => {
      const listingId = Number(listing.listing_id || 0);
      const sales = listingSalesMap.get(listingId) || { orders_30d: 0, quantity_30d: 0, revenue_30d: 0 };

      try {
        const detail = await etsyFetch(`/v3/application/listings/${listingId}`, accessToken, clientId);
        const data = detail || {};
        const views = Number(data.views ?? 0);

        return {
          listing_id: listingId,
          title: data.title || listing.title || "",
          state: data.state || listing.state || "",
          price: toNumber(data.price ?? listing.price),
          quantity: Number(data.quantity ?? listing.quantity ?? 0),
          views,
          num_favorers: Number(data.num_favorers ?? listing.num_favorers ?? 0),
          url: data.url || listing.url || "",
          ...sales,
          cvr_30d_proxy: views > 0 ? sales.orders_30d / views : 0,
        };
      } catch {
        const views = Number(listing.views ?? 0);
        return {
          listing_id: listingId,
          title: listing.title || "",
          state: listing.state || "",
          price: toNumber(listing.price),
          quantity: Number(listing.quantity ?? 0),
          views,
          num_favorers: Number(listing.num_favorers ?? 0),
          url: listing.url || "",
          ...sales,
          cvr_30d_proxy: views > 0 ? sales.orders_30d / views : 0,
          partial: true,
        };
      }
    }),
  );

  const listingViews = listingDetails.reduce((sum, l) => sum + Number(l.views || 0), 0);
  const listingFavorers = listingDetails.reduce((sum, l) => sum + Number(l.num_favorers || 0), 0);

  return {
    fetched_at: new Date().toISOString(),
    period_days: days,
    shop_id: Number(shopId),
    totals,
    listing_summary: {
      active_count: listingDetails.length,
      total_views_daily_tabulated: listingViews,
      total_favorers: listingFavorers,
    },
    listings: listingDetails,
    receipts_count: receipts.length,
  };
}
