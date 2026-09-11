import { loadState, updateState } from "./storage.js";

const COLORS = ["#8a2f1e", "#c4842c", "#3f4a8c", "#5a2c48", "#2c4a6b", "#6b8a4a", "#c47a50", "#4a3a6b", "#1f2a44", "#7a4e32"];

export function listAlbums() {
  return loadState().albums || [];
}

export function getAlbum(id) {
  return listAlbums().find((album) => album.id === id) || null;
}

export function saveAlbum(album) {
  updateState((state) => {
    const albums = state.albums || [];
    const idx = albums.findIndex((item) => item.id === album.id);
    album.updatedAt = Date.now();
    if (idx >= 0) albums[idx] = album;
    else albums.push(album);
    state.albums = albums;
  });
  return album;
}

export function deleteAlbum(id) {
  updateState((state) => {
    state.albums = (state.albums || []).filter((item) => item.id !== id);
  });
}

export function clearAlbums() {
  updateState((state) => {
    state.albums = [];
  });
}

export function newAlbum(title, color) {
  const album = {
    id: `alb-${Date.now().toString(36)}`,
    title: String(title || "Untitled").slice(0, 48),
    color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
    favorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [emptyPage(), emptyPage()],
  };
  return saveAlbum(album);
}

export function emptyPage() {
  return { items: [] };
}

export function ensureSpread(album, spread) {
  const need = (spread + 1) * 2;
  while (album.pages.length < need) album.pages.push(emptyPage());
  return album;
}

export function addItem(album, pageIndex, item) {
  ensureSpread(album, Math.floor(pageIndex / 2));
  album.pages[pageIndex].items.push(item);
  return saveAlbum(album);
}

export function patchItem(album, pageIndex, itemId, patch) {
  const page = album.pages[pageIndex];
  if (!page) return album;
  page.items = page.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item));
  return saveAlbum(album);
}

export function removeItem(album, pageIndex, itemId) {
  const page = album.pages[pageIndex];
  if (!page) return album;
  page.items = page.items.filter((item) => item.id !== itemId);
  return saveAlbum(album);
}

export function makeItem(type, extra = {}) {
  return {
    id: `it-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    x: extra.x ?? 12,
    y: extra.y ?? 16,
    w: extra.w ?? 40,
    h: extra.h ?? 28,
    ...extra,
  };
}

export function scrapFromKind(kind, value, extra = {}) {
  if (kind === "sticker") {
    const sticker = STICKERS.find((entry) => entry.id === value);
    return makeItem("sticker", { glyph: sticker?.glyph || "♡", w: 14, h: 12, ...extra });
  }
  if (kind === "text") {
    return makeItem("text", { style: value, text: "Write something sweet.", w: 42, h: 14, ...extra });
  }
  if (kind === "sticky") {
    const swatch = STICKY_COLORS.find((entry) => entry.id === value);
    return makeItem("sticky", { color: swatch?.color, text: "a little note", w: 30, h: 18, ...extra });
  }
  if (kind === "photo") {
    return makeItem("photo", { src: extra.src || "", w: value === "wide" ? 56 : 40, h: 34, ...extra });
  }
  if (kind === "recipe") {
    return makeItem("recipe", { heading: "RECIPE", text: "for us.", w: 32, h: 28, ...extra });
  }
  if (kind === "voice") {
    return makeItem("voice", { src: extra.src || "", text: extra.text || "Voice memo", w: 44, h: 16, ...extra });
  }
  return null;
}

export function exportAlbums(albums = listAlbums()) {
  return {
    kind: "gtky-albums",
    version: 1,
    exportedAt: Date.now(),
    albums,
  };
}

export function importAlbums(payload) {
  const incoming = payload?.albums || (payload?.kind === "gtky-albums" ? payload.albums : null) || (Array.isArray(payload) ? payload : null);
  if (!incoming?.length) throw new Error("That file doesn’t look like a GTKY album.");
  updateState((state) => {
    const have = new Set((state.albums || []).map((item) => item.id));
    const next = [...(state.albums || [])];
    for (const album of incoming) {
      if (!album?.id || !Array.isArray(album.pages)) continue;
      if (have.has(album.id)) {
        album.id = `${album.id}-copy-${Date.now().toString(36)}`;
        album.title = `${album.title || "Album"} (copy)`;
      }
      next.push(album);
      have.add(album.id);
    }
    state.albums = next;
  });
}

export function downloadAlbums(albums = listAlbums()) {
  const blob = new Blob([JSON.stringify(exportAlbums(albums), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gtky-albums-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const max = 900;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export const STICKERS = [
  { id: "heart", glyph: "♡", label: "Heart" },
  { id: "star", glyph: "★", label: "Star" },
  { id: "spark", glyph: "✦", label: "Spark" },
  { id: "moon", glyph: "☾", label: "Moon" },
  { id: "paw", glyph: "🐾", label: "Paw" },
  { id: "flower", glyph: "✿", label: "Flower" },
  { id: "honey", glyph: "🍯", label: "Honey" },
  { id: "bow", glyph: "🎀", label: "Bow" },
];

export const TEXT_STYLES = [
  { id: "heading", label: "Heading" },
  { id: "script", label: "Handwriting" },
  { id: "caption", label: "Caption" },
  { id: "tape", label: "Tape label" },
];

export const STICKY_COLORS = [
  { id: "honey", color: "#f3c56a", label: "Honey" },
  { id: "rose", color: "#f3d0c4", label: "Blush" },
  { id: "mint", color: "#d5e8c8", label: "Mint" },
  { id: "sky", color: "#d7e4f7", label: "Sky" },
  { id: "cream", color: "#fff8ea", label: "Cream" },
];

export const ALBUM_COLORS = COLORS;
