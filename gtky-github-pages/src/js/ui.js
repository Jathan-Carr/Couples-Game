export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function siteHeader({ title = "", actions = "", playHref = "#/deck" } = {}) {
  return `
    <header class="site-header">
      <nav class="nav container" aria-label="Main">
        <a class="logo" href="#/" aria-label="GTKY home">
          <span class="logo-mark">♡</span>
          GTKY
        </a>
        <div class="nav-actions">
          ${title ? `<span class="nav-kicker">${escapeHtml(title)}</span>` : ""}
          ${actions}
        </div>
      </nav>
    </header>
  `;
}

export function homeActions() {
  return `
    <a class="icon-button" href="#/stats" title="Statistics" aria-label="Statistics">↗</a>
    <a class="icon-button" href="#/settings" title="Settings" aria-label="Settings">✦</a>
    <a class="button button--dark" href="#/lobby">Play</a>
  `;
}

export function backActions() {
  return `
    <a class="icon-button" href="#/" title="Home" aria-label="Home">←</a>
    <a class="icon-button" href="#/stats" title="Statistics" aria-label="Statistics">↗</a>
  `;
}

export function shelfBack() {
  return `
    <a class="icon-button" href="#/play" title="Bookshelf" aria-label="Back to bookshelf">←</a>
    <a class="icon-button" href="#/stats" title="Statistics" aria-label="Statistics">↗</a>
  `;
}

export function returnToShelf() {
  return `<a class="shelf-return" href="#/play">Return to bookshelf</a>`;
}

export function levelDot(level) {
  return `<span class="dot ${escapeHtml(level)}"></span>`;
}

export function starterChips(targetId) {
  const starters = ["Honestly?", "Hmm, maybe…", "A tiny story:", "I used to think…"];
  return `<div class="starter-chips">${starters
    .map(
      (text) =>
        `<button type="button" class="chip" data-act="prefill" data-target="${escapeHtml(targetId)}" data-value="${escapeHtml(text)}">${escapeHtml(text)}</button>`
    )
    .join("")}</div>`;
}

export function tapeCard(inner, extraClass = "") {
  return `<article class="question-card ${extraClass}">${inner}</article>`;
}

export function waitingPup() {
  return `
    <button type="button" class="waiting-pup" data-act="pup-woof" aria-label="The cream pup is waiting with you. Tap to hear a bark.">
      <span class="pup-shadow"></span>
      <span class="bark-bubble">woof!</span>
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="pup-tail" d="M24 42c-14-6-18 10-8 16" stroke="#3d2418" stroke-width="4.5" stroke-linecap="round"/>
        <rect class="pup-leg pup-leg-bl" x="38" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <rect class="pup-leg pup-leg-br" x="52" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <ellipse cx="58" cy="42" rx="28" ry="17" fill="#fff6ea" stroke="#3d2418" stroke-width="2.6"/>
        <ellipse cx="44" cy="38" rx="8" ry="6" fill="#c4a07a"/>
        <rect class="pup-leg pup-leg-fl" x="64" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <rect class="pup-leg pup-leg-fr" x="78" y="50" width="9" height="22" rx="4.5" fill="#fff6ea" stroke="#3d2418" stroke-width="2"/>
        <g class="pup-head">
          <rect x="74" y="32" width="18" height="7" rx="3.5" fill="#5f82c4" stroke="#3d2418" stroke-width="1.6"/>
          <path d="M86 39l4 6 4-6" fill="#f3c56a" stroke="#3d2418" stroke-width="1.4" stroke-linejoin="round"/>
          <circle cx="96" cy="28" r="15" fill="#fff6ea" stroke="#3d2418" stroke-width="2.6"/>
          <ellipse class="pup-ear" cx="86" cy="24" rx="7" ry="13" fill="#3d2418" transform="rotate(-18 86 24)"/>
          <ellipse cx="107" cy="32" rx="8" ry="6" fill="#fff6ea" stroke="#3d2418" stroke-width="2.2"/>
          <circle cx="111" cy="31" r="2.1" fill="#3d2418"/>
          <circle cx="100" cy="24" r="1.9" fill="#3d2418"/>
          <ellipse class="pup-mouth" cx="110" cy="36" rx="2.2" ry="1.2" fill="#3d2418"/>
        </g>
      </svg>
    </button>`;
}
