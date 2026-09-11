import { listAlbums, getAlbum, saveAlbum, addItem, makeItem, emptyPage } from "./albums.js";

export function ensureTableAlbum(code) {
  const id = `alb-table-${code || "local"}`;
  const have = getAlbum(id);
  if (have) return have;
  return saveAlbum({
    id,
    title: code ? `The table · ${code}` : "The table",
    color: "#5a2c48",
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [emptyPage(), emptyPage()],
  });
}

export function stampAlbumId(preferred) {
  if (preferred && getAlbum(preferred)) return preferred;
  const table = listAlbums().find((album) => album.id.startsWith("alb-table-"));
  if (table) return table.id;
  const first = listAlbums()[0];
  if (first) return first.id;
  return ensureTableAlbum("local").id;
}

export function stampRound({ albumId, title, body, page = 0 }) {
  const id = stampAlbumId(albumId);
  const album = getAlbum(id);
  if (!album) return null;
  const item = makeItem("text", {
    style: "tape",
    text: `${title}\n${body}`.slice(0, 280),
    x: 8 + Math.random() * 36,
    y: 10 + Math.random() * 50,
    w: 46,
    h: 22,
  });
  addItem(album, page, item);
  return { albumId: id, item };
}

export function compactAlbum(album) {
  if (!album) return album;
  return {
    ...album,
    pages: album.pages.map((page) => ({
      items: page.items.map((item) => {
        if (item.type === "photo" && item.src && item.src.length > 4000) {
          return { ...item, src: "", noteBelow: item.noteBelow || "(photo stays on that phone)" };
        }
        if (item.type === "voice" && item.src && item.src.length > 4000) {
          return { ...item, src: "", text: "Voice memo stayed on that phone." };
        }
        return item;
      }),
    })),
  };
}
