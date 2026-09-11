import { updateState, loadState } from "./storage.js";

export function getPaused() {
  return loadState().paused || null;
}

export function savePaused(route, session) {
  if (!session) return;
  const snapshot = JSON.parse(JSON.stringify(session));
  if (snapshot.current && snapshot.mode === "deck" && snapshot.phase === "show") {
    snapshot.remaining = [snapshot.current, ...(snapshot.remaining || [])];
    snapshot.current = null;
    snapshot.phase = "idle";
    snapshot.flipped = false;
  }
  if (snapshot.mode === "wheel" && snapshot.phase === "show" && snapshot.current) {
    snapshot.phase = "ready";
    snapshot.current = null;
  }
  snapshot.spinning = false;
  if (snapshot.mode === "evenodd" && snapshot.phase === "spinning") {
    snapshot.phase = "ready";
  }
  snapshot.peerStatus = snapshot.online ? snapshot.peerStatus : "idle";
  updateState((state) => {
    state.paused = { route, session: snapshot, savedAt: Date.now() };
  });
}

export function clearPaused() {
  updateState((state) => {
    state.paused = null;
  });
}

export function restorePaused() {
  const paused = getPaused();
  if (!paused?.session) return null;
  return paused;
}
