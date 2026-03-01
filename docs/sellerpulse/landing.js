(() => {
  const form = document.getElementById("waitlistForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  const cfg = window.SELLERPULSE_CONFIG || {};

  const setStatus = (text, type = "muted") => {
    status.textContent = text;
    status.className = `form-status ${type}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = (document.getElementById("waitlistName")?.value || "").trim();
    const email = (document.getElementById("waitlistEmail")?.value || "").trim();

    if (!email) {
      setStatus("Please enter your email.", "bad");
      return;
    }

    if (!cfg.googleFormAction) {
      setStatus(
        "Waitlist endpoint not configured yet. For now, this will open email signup.",
        "warn",
      );
      const subject = encodeURIComponent("SellerPulse Pro Waitlist");
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSource: sellerpulse-landing`);
      window.location.href = `mailto:brr2k5@yahoo.com?subject=${subject}&body=${body}`;
      return;
    }

    const payload = new URLSearchParams();
    payload.set(cfg.emailFieldName || "entry.1111111111", email);
    if (cfg.nameFieldName) payload.set(cfg.nameFieldName, name);
    if (cfg.sourceFieldName) payload.set(cfg.sourceFieldName, cfg.sourceValue || "sellerpulse-landing");

    setStatus("Submitting…", "muted");

    try {
      await fetch(cfg.googleFormAction, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: payload.toString(),
      });

      form.reset();
      setStatus("You’re on the waitlist. Nice — I’ll send early access updates.", "good");
    } catch (err) {
      setStatus("Submission failed. Please try again or email brr2k5@yahoo.com.", "bad");
    }
  });
})();
