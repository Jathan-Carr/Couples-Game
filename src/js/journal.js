import { updateState, loadState } from "./storage.js";

export function emptyJournal() {
  return { p1: "", p2: "", startedAt: Date.now(), entries: [], notes: { n1: "", n2: "" } };
}

export function appendEntry(session) {
  if (!session.journal) session.journal = emptyJournal();
  session.journal.p1 = session.player1;
  session.journal.p2 = session.player2;
  session.journal.entries.push({
    round: session.round,
    style: session.currentStyle,
    q1: session.q1,
    q2: session.q2,
    a1: session.a1,
    a2: session.a2,
  });
}

export function stampNotes(session) {
  if (!session.journal) session.journal = emptyJournal();
  session.journal.notes = { n1: session.note1 || "", n2: session.note2 || "" };
}

export function saveZine(journal) {
  if (!journal?.entries?.length && !journal?.notes?.n1 && !journal?.notes?.n2) return;
  const copy = JSON.parse(JSON.stringify(journal));
  copy.savedAt = Date.now();
  updateState((state) => {
    state.zines = [copy, ...(state.zines || [])].slice(0, 12);
  });
}

export function getZines() {
  return loadState().zines || [];
}

export function latestZine() {
  return getZines()[0] || null;
}
