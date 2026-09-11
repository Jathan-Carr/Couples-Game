import { escapeHtml } from "./ui.js";
import { STICKERS, TEXT_STYLES, STICKY_COLORS, listAlbums } from "./albums.js";

export function albumStudioHTML({
  albums,
  filter,
  album,
  spread,
  tray,
  selected,
  creating,
}) {
  const shown = filter === "favorites" ? albums.filter((item) => item.favorite) : albums;
  if (creating) return createSheet();
  if (album) return editorSheet(album, spread, tray, selected);
  return librarySheet(shown, filter, albums.length);
}

function createSheet() {
  return `
    <div class="album-desk">
      <div class="open-book" aria-label="New album">
        ${ribbons()}
        <div class="book-spread">
          <section class="leaf leaf--left">
            <p class="hello">New album</p>
            <h1>Give it a title.</h1>
            <p class="muted">This becomes the spine on the skinny shelf.</p>
            <form id="album-create">
              <div class="field">
                <label for="album-title">Title</label>
                <input id="album-title" name="title" maxlength="48" required placeholder="(I love you)" />
              </div>
              <button class="button button--dark button--large" type="submit">Open the book →</button>
            </form>
          </section>
          <section class="leaf leaf--right leaf--blank">
            <p class="muted center">Blank pages waiting.</p>
          </section>
        </div>
      </div>
      ${sideTools({ tray: "create", library: true })}
    </div>`;
}

function librarySheet(shown, filter, total) {
  return `
    <div class="album-desk">
      <div class="open-book">
        ${ribbons()}
        <div class="book-spread">
          <section class="leaf leaf--left">
            <div class="frame-ornament">
              <p class="hello">Albums</p>
              <h2>${total ? "Your little library." : "No albums yet."}</h2>
              <p>${total ? "Open a spine, or create a new book." : "Tap Create. Name a book. Fill it with photos and scraps."}</p>
            </div>
            <div class="album-grid">
              ${
                shown.length
                  ? shown
                      .map(
                        (album) => `
                    <button type="button" class="album-tile" data-act="album-open" data-value="${escapeHtml(album.id)}" style="--spine:${album.color}">
                      <b>${escapeHtml(album.title)}</b>
                      <small>${album.pages.length} pages${album.favorite ? " · ★" : ""}</small>
                    </button>`
                      )
                      .join("")
                  : `<p class="muted">Nothing in ${filter === "favorites" ? "favorites" : "all albums"} yet.</p>`
              }
            </div>
          </section>
          <section class="leaf leaf--right">
            <div class="recipe-pad" aria-hidden="true">
              <p>RECIPE</p>
              <span></span><span></span><span></span>
            </div>
            <p class="muted">Import a JSON keepsake, or export before you close the night.</p>
          </section>
        </div>
      </div>
      ${sideTools({ tray: null, library: true, filter })}
    </div>`;
}

function editorSheet(album, spread, tray, selected) {
  const left = album.pages[spread * 2] || { items: [] };
  const right = album.pages[spread * 2 + 1] || { items: [] };
  return `
    <div class="album-desk is-editing">
      <div class="open-book is-editing">
        ${ribbons()}
        <div class="book-spread">
          ${leafHTML(left, spread * 2, "left", selected)}
          ${leafHTML(right, spread * 2 + 1, "right", selected)}
        </div>
        <div class="page-nav">
          <button type="button" class="button" data-act="album-prev" ${spread === 0 ? "disabled" : ""}>← Previous</button>
          <span>Pages ${spread * 2 + 1}–${spread * 2 + 2}</span>
          <button type="button" class="button button--dark" data-act="album-next">Next page →</button>
        </div>
      </div>
      ${sideTools({ tray, library: false, album, filter: "all", selected })}
    </div>`;
}

function leafHTML(page, pageIndex, side, selected) {
  return `
    <section class="leaf leaf--${side}" data-page="${pageIndex}">
      <div class="leaf-canvas" data-page="${pageIndex}">
        ${page.items.map((item) => itemHTML(item, pageIndex, selected)).join("")}
      </div>
    </section>`;
}

function itemHTML(item, pageIndex, selected) {
  const on = selected === item.id ? " is-on" : "";
  const style = `left:${item.x}%;top:${item.y}%;width:${item.w}%;`;
  if (item.type === "photo") {
    return `
      <figure class="scrap scrap--photo${on}" data-item="${item.id}" data-page="${pageIndex}" style="${style}">
        ${item.noteAbove ? `<figcaption class="sticky sticky--above" style="background:${item.noteColor || "#f3c56a"}">${escapeHtml(item.noteAbove)}</figcaption>` : ""}
        ${item.src ? `<img src="${item.src}" alt="" draggable="false" decoding="async" />` : `<button type="button" class="photo-hole" data-act="album-photo" data-page="${pageIndex}" data-item="${item.id}">Add a photo</button>`}
        ${item.noteBelow ? `<figcaption class="sticky sticky--below" style="background:${item.noteColor || "#f3c56a"}">${escapeHtml(item.noteBelow)}</figcaption>` : ""}
      </figure>`;
  }
  if (item.type === "text") {
    return `<div class="scrap scrap--text scrap--${item.style || "caption"}${on}" data-item="${item.id}" data-page="${pageIndex}" style="${style}" contenteditable="true" spellcheck="false">${escapeHtml(item.text || "Write here")}</div>`;
  }
  if (item.type === "sticky") {
    return `<div class="scrap scrap--sticky${on}" data-item="${item.id}" data-page="${pageIndex}" style="${style};background:${item.color || "#f3c56a"}" contenteditable="true" spellcheck="false">${escapeHtml(item.text || "a little note")}</div>`;
  }
  if (item.type === "sticker") {
    return `<div class="scrap scrap--sticker${on}" data-item="${item.id}" data-page="${pageIndex}" style="${style}">${item.glyph || "♡"}</div>`;
  }
  if (item.type === "recipe") {
    return `<div class="scrap scrap--recipe${on}" data-item="${item.id}" data-page="${pageIndex}" style="${style}"><b>${escapeHtml(item.heading || "RECIPE")}</b><p contenteditable="true" spellcheck="false">${escapeHtml(item.text || "")}</p></div>`;
  }
  if (item.type === "voice") {
    return `<div class="scrap scrap--voice${on}" data-item="${item.id}" data-page="${pageIndex}" style="${style}">
      <b>Voice</b>
      ${item.src ? `<audio controls src="${item.src}"></audio>` : `<span class="muted">Hold to record</span>`}
    </div>`;
  }
  return "";
}

function ribbons() {
  return `
    <div class="book-ribbons" aria-hidden="true">
      <span class="ribbon r-red"></span>
      <span class="ribbon r-blue"></span>
      <span class="ribbon r-green"></span>
    </div>`;
}

function sideTools({ tray, library, filter, album, selected }) {
  return `
    <aside class="album-tools">
      <button type="button" class="tape-btn ${filter === "all" || library ? "is-on" : ""}" data-act="album-filter" data-value="all">All</button>
      <button type="button" class="tape-btn ${filter === "favorites" ? "is-on" : ""}" data-act="album-filter" data-value="favorites">FAVORITES</button>
      <button type="button" class="tape-btn tape-clear" data-act="album-clear">(clear albums)</button>
      <button type="button" class="tape-btn tape-star" data-act="album-star" ${album ? "" : "disabled"} aria-label="Favorite">★</button>
      <button type="button" class="tape-btn" data-act="album-cancel">Cancel</button>
      <button type="button" class="tape-btn tape-create" data-act="album-new">Create</button>
      <button type="button" class="tape-btn" data-act="album-print">Print this spread</button>
      ${
        library
          ? `<div class="recipe-pad small"><p>RECIPE</p><span></span><span></span></div>`
          : `
        <p class="tray-hint">Drag these onto a page. On a phone, tap to add.</p>
        <button type="button" class="tape-btn" data-act="album-delete">Remove selected</button>
        <div class="tool-stack">
          <p class="tray-label">Stickers</p>
          ${trayStickers()}
          <p class="tray-label">Text</p>
          ${trayText()}
          <p class="tray-label">Notes</p>
          ${traySticky()}
          <p class="tray-label">Photos</p>
          ${trayPhoto()}
          <p class="tray-label">Voice</p>
          <div class="tray"><button type="button" class="tray-item" data-act="album-add" data-kind="voice" data-value="memo">10s memo</button></div>
        </div>`
      }
    </aside>`;
}

function trayStickers() {
  return `<div class="tray">${STICKERS.map(
    (item) =>
      `<button type="button" class="tray-item" data-act="album-add" data-kind="sticker" data-value="${item.id}" title="${item.label}">${item.glyph}</button>`
  ).join("")}</div>`;
}

function trayText() {
  return `<div class="tray">${TEXT_STYLES.map(
    (item) =>
      `<button type="button" class="tray-item" data-act="album-add" data-kind="text" data-value="${item.id}">${escapeHtml(item.label)}</button>`
  ).join("")}</div>`;
}

function traySticky() {
  return `<div class="tray">${STICKY_COLORS.map(
    (item) =>
      `<button type="button" class="tray-item" data-act="album-add" data-kind="sticky" data-value="${item.id}" style="background:${item.color}">${escapeHtml(item.label)}</button>`
  ).join("")}
    <button type="button" class="tray-item" data-act="album-add" data-kind="recipe" data-value="recipe">Recipe card</button>
    <button type="button" class="tray-item" data-act="album-note" data-value="above">Note above photo</button>
    <button type="button" class="tray-item" data-act="album-note" data-value="below">Note below photo</button>
  </div>`;
}

function trayPhoto() {
  return `<div class="tray">
    <button type="button" class="tray-item" data-act="album-add" data-kind="photo" data-value="polaroid">Polaroid</button>
    <button type="button" class="tray-item" data-act="album-add" data-kind="photo" data-value="wide">Wide frame</button>
  </div>`;
}

function dropPos(canvas, clientX, clientY) {
  const box = canvas.getBoundingClientRect();
  return {
    page: Number(canvas.dataset.page),
    x: Math.max(2, Math.min(72, ((clientX - box.left) / box.width) * 100)),
    y: Math.max(2, Math.min(80, ((clientY - box.top) / box.height) * 100)),
  };
}

function highlightCanvas(clientX, clientY) {
  const hit = document.elementFromPoint(clientX, clientY)?.closest(".leaf-canvas");
  document.querySelectorAll(".leaf-canvas.is-drop").forEach((el) => {
    if (el !== hit) el.classList.remove("is-drop");
  });
  hit?.classList.add("is-drop");
  return hit;
}

export function bindAlbumStudio(root, { onMove, onDrop, onSelect, onPhotoFile, onText, onFetch }) {
  root.querySelectorAll(".tray-item[data-kind]").forEach((el) => {
    el.addEventListener("pointerdown", (event) => {
      if (event.button && event.button !== 0) return;
      const startX = event.clientX;
      const startY = event.clientY;
      const kind = el.dataset.kind;
      const value = el.dataset.value;
      let ghost = null;
      let started = false;
      let frame = 0;

      const onMovePtr = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!started && dx * dx + dy * dy < 100) return;
        if (!started) {
          started = true;
          el._skipClick = true;
          el.classList.add("is-dragging");
          ghost = document.createElement("div");
          ghost.className = "tray-ghost";
          ghost.textContent = el.textContent.trim();
          document.body.append(ghost);
        }
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          ghost.style.transform = `translate3d(${ev.clientX - 18}px, ${ev.clientY - 18}px, 0)`;
          highlightCanvas(ev.clientX, ev.clientY);
        });
      };

      const onUp = (ev) => {
        window.removeEventListener("pointermove", onMovePtr);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        el.classList.remove("is-dragging");
        ghost?.remove();
        const hit = started ? highlightCanvas(ev.clientX, ev.clientY) : null;
        document.querySelectorAll(".leaf-canvas.is-drop").forEach((node) => node.classList.remove("is-drop"));
        if (!started || !hit) return;
        onDrop?.({ kind, value, ...dropPos(hit, ev.clientX, ev.clientY) });
      };

      window.addEventListener("pointermove", onMovePtr);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });

    el.addEventListener(
      "click",
      (event) => {
        if (!el._skipClick) return;
        event.preventDefault();
        event.stopPropagation();
        el._skipClick = false;
      },
      true
    );
  });

  root.querySelectorAll(".leaf-canvas").forEach((canvas) => {
    canvas.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      canvas.classList.add("is-drop");
    });
    canvas.addEventListener("dragleave", () => canvas.classList.remove("is-drop"));
    canvas.addEventListener("drop", (event) => {
      event.preventDefault();
      canvas.classList.remove("is-drop");
      const pos = dropPos(canvas, event.clientX, event.clientY);
      const files = event.dataTransfer?.files;
      if (files?.length) {
        [...files].forEach((file, index) => {
          if (!file.type.startsWith("image/")) return;
          onPhotoFile?.(pos.page, file, { x: pos.x + index * 4, y: pos.y + index * 4 });
        });
      }
    });
  });

  root.querySelectorAll(".scrap").forEach((el) => {
    el.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button") || event.target.closest("[contenteditable]")) return;
      event.preventDefault();
      onSelect?.(el.dataset.item);
      el.classList.add("is-on", "is-lift");
      const page = el.closest(".leaf-canvas");
      if (!page) return;
      el.setPointerCapture?.(event.pointerId);
      const startX = event.clientX;
      const startY = event.clientY;
      const box = page.getBoundingClientRect();
      let frame = 0;
      const onMovePtr = (ev) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const x = Math.max(0, Math.min(78, ((ev.clientX - box.left) / box.width) * 100));
          const y = Math.max(0, Math.min(82, ((ev.clientY - box.top) / box.height) * 100));
          el.style.left = `${x}%`;
          el.style.top = `${y}%`;
        });
      };
      const onUp = (ev) => {
        el.classList.remove("is-lift");
        el.releasePointerCapture?.(ev.pointerId);
        el.removeEventListener("pointermove", onMovePtr);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        const x = parseFloat(el.style.left);
        const y = parseFloat(el.style.top);
        onMove?.(el.dataset.page, el.dataset.item, { x, y });
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (el.classList.contains("scrap--sticker") && dx * dx + dy * dy < 64) {
          onFetch?.(el);
        }
      };
      el.addEventListener("pointermove", onMovePtr);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
    });
    el.addEventListener("focusout", () => {
      if (!el.isContentEditable && !el.querySelector("[contenteditable]")) return;
      const field = el.matches("[contenteditable]") ? el : el.querySelector("[contenteditable]");
      onText?.(el.dataset.page, el.dataset.item, field?.innerText || "");
    });
  });
}

export function albumCount() {
  return listAlbums().length;
}
