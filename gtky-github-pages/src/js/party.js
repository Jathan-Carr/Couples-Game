const PREFIX = "gtky-";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let peer = null;
let role = null;
let conns = new Map();
let onMessage = () => {};
let onStatus = () => {};
let maxPeers = 5;

export function randomCode(length = 5) {
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

export function joinUrl(code) {
  const url = new URL(window.location.href);
  url.hash = `#/lobby?join=${code}`;
  return url.toString();
}

export function myPeerId() {
  return peer?.id || "";
}

export function partyRole() {
  return role;
}

export function connectedCount() {
  let n = 0;
  for (const conn of conns.values()) if (conn.open) n += 1;
  return n;
}

export function isConnected() {
  if (role === "host") return Boolean(peer);
  return [...conns.values()].some((conn) => conn.open);
}

export function send(payload) {
  const packet = { ...payload, _from: peer?.id || "local" };
  if (role === "host") {
    for (const conn of conns.values()) {
      if (conn.open) conn.send(packet);
    }
  } else {
    const conn = [...conns.values()][0];
    if (conn?.open) conn.send(packet);
  }
}

export function disconnectParty() {
  for (const conn of conns.values()) {
    try {
      conn.close();
    } catch {
      /* ignore */
    }
  }
  conns.clear();
  try {
    peer?.destroy();
  } catch {
    /* ignore */
  }
  peer = null;
  role = null;
}

let PeerCtor = null;
let peerLoader = null;

function loadPeer() {
  if (PeerCtor) return Promise.resolve(PeerCtor);
  if (!peerLoader) {
    peerLoader = import("peerjs").then((mod) => {
      PeerCtor = mod.default;
      return PeerCtor;
    });
  }
  return peerLoader;
}

function wire(connection, { relay } = {}) {
  const id = connection.peer;
  conns.set(id, connection);
  connection.on("data", (data) => {
    if (relay && role === "host") {
      for (const [other, conn] of conns) {
        if (other !== id && conn.open) conn.send({ ...data, _from: data?._from || id });
      }
    }
    onMessage(data, id);
  });
  connection.on("close", () => {
    conns.delete(id);
    onStatus("peer-left", id);
  });
  connection.on("error", () => onStatus("error", "A connection hiccuped."));
  connection.on("open", () => onStatus("peer-open", id));
  if (connection.open) onStatus("peer-open", id);
}

export function hostParty(code, handlers, { size = 4 } = {}) {
  disconnectParty();
  role = "host";
  maxPeers = Math.max(1, Number(size) || 4);
  onMessage = handlers.onMessage;
  onStatus = handlers.onStatus;
  onStatus("hosting");
  loadPeer().then((Peer) => {
    if (role !== "host") return;
    peer = new Peer(PREFIX + code, { debug: 0 });
    peer.on("open", () => onStatus("waiting"));
    peer.on("connection", (connection) => {
      if (conns.size >= maxPeers + 4) {
        try {
          connection.close();
        } catch {
          /* ignore */
        }
        return;
      }
      wire(connection, { relay: true });
    });
    peer.on("error", (err) => {
      onStatus("error", err?.message || "Could not open a room.");
    });
  }).catch((err) => {
    onStatus("error", err?.message || "Could not open a room.");
  });
  return code;
}

export function joinParty(code, handlers) {
  disconnectParty();
  role = "guest";
  onMessage = handlers.onMessage;
  onStatus = handlers.onStatus;
  onStatus("connecting");
  loadPeer().then((Peer) => {
    if (role !== "guest") return;
    peer = new Peer({ debug: 0 });
    peer.on("open", () => {
      const connection = peer.connect(PREFIX + code, { reliable: true });
      wire(connection, { relay: false });
    });
    peer.on("error", (err) => {
      onStatus("error", err?.message || "Could not join that room.");
    });
  }).catch((err) => {
    onStatus("error", err?.message || "Could not join that room.");
  });
}
