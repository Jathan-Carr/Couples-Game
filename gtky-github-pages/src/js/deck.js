import { createDeck } from "./questions.js";

export function startDeck(level) {
  return {
    mode: "deck",
    level,
    remaining: createDeck(level),
    current: null,
    discarded: [],
    skipped: [],
    phase: "idle",
    flipped: false,
  };
}

export function reshuffle(session) {
  session.remaining = createDeck(session.level);
  session.current = null;
  session.discarded = [];
  session.skipped = [];
  session.phase = "idle";
  session.flipped = false;
  return session;
}

export function resetDeck(session) {
  return Object.assign(session, startDeck(session.level));
}

export function drawCard(session, record) {
  if (!session.remaining.length) {
    if (session.skipped.length) {
      session.remaining = [...session.skipped];
      session.skipped = [];
    } else {
      reshuffle(session);
    }
  }
  const [card, ...rest] = session.remaining;
  session.remaining = rest;
  session.current = card;
  session.phase = "show";
  record?.();
  return card;
}

export function skipCard(session) {
  if (session.current) {
    session.skipped.push(session.current);
  }
  session.current = null;
  session.phase = "idle";
  session.flipped = false;
}

export function answerCard(session, record) {
  if (session.current) {
    record?.(session.current.level);
    session.discarded.push(session.current);
  }
  session.current = null;
  session.phase = "idle";
  session.flipped = false;
}
