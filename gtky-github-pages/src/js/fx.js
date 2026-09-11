export function burst(kind = "hearts") {
  if (document.documentElement.classList.contains("no-anim")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "burst-layer";
  const glyphs =
    kind === "stars"
      ? ["✦", "✧", "⋆"]
      : kind === "party"
        ? ["♡", "✦", "★", "✿", "⋆"]
        : ["♡", "♥", "♡"];
  const count = kind === "party" ? 16 : 10;
  for (let i = 0; i < count; i += 1) {
    const span = document.createElement("span");
    span.textContent = glyphs[i % glyphs.length];
    span.style.setProperty("--x", `${(Math.random() * 80 + 10).toFixed(1)}vw`);
    span.style.setProperty("--d", `${(0.8 + Math.random() * 1.2).toFixed(2)}s`);
    span.style.setProperty("--s", `${(0.8 + Math.random() * 1.1).toFixed(2)}`);
    if (i % 3 === 0) span.classList.add("is-blue");
    layer.append(span);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 2200);
}

export function sparkleCard(el) {
  if (!el) return;
  el.classList.add("sparkle");
  setTimeout(() => el.classList.remove("sparkle"), 900);
}
