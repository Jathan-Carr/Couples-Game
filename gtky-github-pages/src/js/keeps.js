import { loadState, updateState } from "./storage.js";

export function getVeto() {
  return loadState().veto || [];
}

export function isVetoed(id) {
  return getVeto().includes(id);
}

export function vetoQuestion(id) {
  if (!id) return;
  updateState((state) => {
    const veto = new Set(state.veto || []);
    veto.add(id);
    state.veto = [...veto];
  });
}

export function unvetoQuestion(id) {
  updateState((state) => {
    state.veto = (state.veto || []).filter((item) => item !== id);
  });
}

export function getLater() {
  return loadState().later || [];
}

export function pinLater(card) {
  if (!card?.id) return;
  updateState((state) => {
    const later = state.later || [];
    if (later.some((item) => item.id === card.id)) return;
    state.later = [{ ...card, pinnedAt: Date.now() }, ...later].slice(0, 80);
  });
}

export function unpinLater(id) {
  updateState((state) => {
    state.later = (state.later || []).filter((item) => item.id !== id);
  });
}

export function getLetter() {
  return loadState().letter || null;
}

export function sealLetter(card) {
  const sealedAt = Date.now();
  updateState((state) => {
    state.letter = {
      card,
      sealedAt,
      openAt: sealedAt + 7 * 24 * 60 * 60 * 1000,
    };
  });
  return loadState().letter;
}

export function clearLetter() {
  updateState((state) => {
    state.letter = null;
  });
}

export function letterDue(letter = getLetter()) {
  if (!letter) return false;
  return Date.now() >= letter.openAt;
}

export function getMorning() {
  return loadState().morning || { streak: 0, lastDay: 0, lastCard: null };
}

export function dayStamp(ms = Date.now()) {
  return Math.floor(ms / 86400000);
}

export function markMorning(card) {
  const day = dayStamp();
  updateState((state) => {
    const morning = state.morning || { streak: 0, lastDay: 0, lastCard: null };
    const yesterday = morning.lastDay === day - 1;
    const same = morning.lastDay === day;
    state.morning = {
      streak: same ? morning.streak : yesterday ? morning.streak + 1 : 1,
      lastDay: day,
      lastCard: card,
    };
  });
  return loadState().morning;
}

export function morningDoneToday() {
  return getMorning().lastDay === dayStamp();
}

export function getLastNight() {
  return loadState().lastNight || null;
}

export function saveLastNight(patch) {
  updateState((state) => {
    state.lastNight = {
      ...(state.lastNight || {}),
      ...patch,
      savedAt: Date.now(),
    };
  });
}

export function defaultRules() {
  return { lockDeep: false, skipAllowed: true, dares: true };
}

export function getPartyRules(room) {
  return { ...defaultRules(), ...(room?.rules || {}) };
}
