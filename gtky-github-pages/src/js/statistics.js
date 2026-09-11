import { loadState, updateState } from "./storage.js";

export function getStats() {
  return loadState().stats;
}

export function recordAnswer(level) {
  updateState((state) => {
    if (state.stats.answered[level] != null) {
      state.stats.answered[level] += 1;
    }
  });
}

export function recordCardDrawn() {
  updateState((state) => {
    state.stats.cardsDrawn += 1;
  });
}

export function recordWheelSpin() {
  updateState((state) => {
    state.stats.wheelSpins += 1;
  });
}

export function recordDuoSession() {
  updateState((state) => {
    state.stats.duoSessions += 1;
  });
}

export function recordPredict(matched) {
  updateState((state) => {
    state.stats.predictTotal += 1;
    if (matched) state.stats.predictMatches += 1;
  });
}

export function recordMatch(same) {
  updateState((state) => {
    state.stats.matchTotal += 1;
    if (same) state.stats.matchSame += 1;
  });
}

export function totalAnswered(stats = getStats()) {
  return (
    (stats.answered.surface || 0) +
    (stats.answered.personal || 0) +
    (stats.answered.deep || 0) +
    (stats.answered.together || 0)
  );
}

export function saveKeepsake(session) {
  const notes = [];
  if (session.note1?.trim()) {
    notes.push({
      from: session.player1,
      to: session.player2,
      text: session.note1.trim(),
      at: Date.now(),
    });
  }
  if (session.note2?.trim()) {
    notes.push({
      from: session.player2,
      to: session.player1,
      text: session.note2.trim(),
      at: Date.now(),
    });
  }
  if (!notes.length) return;
  updateState((state) => {
    state.notes = [...notes, ...(state.notes || [])].slice(0, 24);
  });
}

export function getNotes() {
  return loadState().notes || [];
}
