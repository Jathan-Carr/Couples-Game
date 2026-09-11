import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { escapeHtml } from "./ui.js";

export function encodeZine(journal) {
  return compressToEncodedURIComponent(JSON.stringify(journal));
}

export function decodeZine(payload) {
  try {
    return JSON.parse(decompressFromEncodedURIComponent(payload));
  } catch {
    return null;
  }
}

export function zineUrl(journal) {
  const packed = encodeZine(journal);
  const url = new URL(window.location.href);
  url.hash = `#/zine?d=${packed}`;
  return { url: url.toString(), packed, tooLong: packed.length > 1400 };
}

export async function makeQrDataUrl(text) {
  const { default: QRCode } = await import("qrcode");
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 280,
    color: { dark: "#c43a5a", light: "#fff8f5" },
  });
}

export function downloadZine(journal) {
  const html = standaloneHtml(journal);
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `gtky-about-us-${safe(journal.p1)}-${safe(journal.p2)}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function safe(name) {
  return String(name || "player").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24);
}

function standaloneHtml(journal) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>About us — ${escapeHtml(journal.p1)} & ${escapeHtml(journal.p2)}</title>
<style>
  body{margin:0;background:#fff8f5;color:#2a2422;font-family:Nunito,system-ui,sans-serif;padding:32px 18px}
  h1{font-size:clamp(2rem,7vw,3.4rem);letter-spacing:-.04em}
  .card{background:#fff;border:1px solid #f0ddd8;border-radius:20px;padding:22px;margin:18px 0;box-shadow:0 2px 12px rgba(42,36,34,.06)}
  .card:nth-child(even){box-shadow:inset 8px 0 0 #d7eaf7,0 2px 12px rgba(42,36,34,.06)}
  .who{font-family:Nunito,system-ui,sans-serif;font-size:.8rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7a6f6a}
  q{display:block;font-size:1.35rem;margin:.4rem 0 1rem}
</style></head><body>
<h1>About us ♡</h1>
<p>${escapeHtml(journal.p1)} & ${escapeHtml(journal.p2)} · GTKY · for a pair of blues</p>
${(journal.entries || []).map((e) => `
  <article class="card">
    <p class="who">${escapeHtml(journal.p1)}</p>
    <q>${escapeHtml(e.q1?.question || "")}</q>
    <p>${escapeHtml(e.a1 || "")}</p>
    <p class="who" style="margin-top:1.2rem">${escapeHtml(journal.p2)}</p>
    <q>${escapeHtml(e.q2?.question || "")}</q>
    <p>${escapeHtml(e.a2 || "")}</p>
  </article>`).join("")}
${journal.notes?.n1 || journal.notes?.n2 ? `
  <article class="card">
    <p class="who">Notes</p>
    <p><strong>${escapeHtml(journal.p1)}:</strong> ${escapeHtml(journal.notes.n1 || "—")}</p>
    <p><strong>${escapeHtml(journal.p2)}:</strong> ${escapeHtml(journal.notes.n2 || "—")}</p>
  </article>` : ""}
</body></html>`;
}
