(() => {
  const ID = "sellerpulse-floating-btn";

  function parseContext() {
    const url = new URL(window.location.href);
    const path = url.pathname;

    let listingId = "";
    let shopId = "";

    const listingMatch = path.match(/\/listing\/(\d+)/i);
    if (listingMatch) listingId = listingMatch[1];

    const shopQuery = url.searchParams.get("shop_id");
    if (shopQuery) shopId = shopQuery;

    return { listingId, shopId };
  }

  function createBtn() {
    if (document.getElementById(ID)) return;

    const btn = document.createElement("button");
    btn.id = ID;
    btn.textContent = "Analyze in SellerPulse";
    Object.assign(btn.style, {
      position: "fixed",
      right: "18px",
      bottom: "18px",
      zIndex: "2147483647",
      border: "1px solid rgba(124,155,255,0.45)",
      borderRadius: "999px",
      padding: "10px 14px",
      background: "linear-gradient(180deg,#86a4ff,#6f90ff)",
      color: "white",
      fontWeight: "700",
      fontSize: "13px",
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(30,52,120,.35)",
    });

    btn.addEventListener("click", () => {
      const ctx = parseContext();
      chrome.runtime.sendMessage({
        type: "OPEN_ANALYZER",
        listingId: ctx.listingId,
        shopId: ctx.shopId,
        autoSync: true,
      });
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBtn);
  } else {
    createBtn();
  }
})();
