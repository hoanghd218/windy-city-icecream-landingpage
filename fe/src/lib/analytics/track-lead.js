// Fires the GA4 "generate_lead" key event used as the primary Google Ads conversion.
export function trackGenerateLead(source) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", { lead_source: source });
}

// Fires when a visitor taps a tel: link — a secondary signal until the
// Google Ads website call-conversion snippet is wired in.
export function trackPhoneClick(source) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "phone_click", { lead_source: source });
}
