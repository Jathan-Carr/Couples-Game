import { loadState } from "./storage.js";

let allQuestions = [];
let loadPromise = null;
let partyRules = { lockDeep: false };

export function setPartyRules(rules = {}) {
  partyRules = { lockDeep: false, ...rules };
}

export function questionsReady() {
  return allQuestions.length > 0;
}

function vetoSet() {
  try {
    return new Set(loadState().veto || []);
  } catch {
    return new Set();
  }
}

export function playableQuestions({ level, category, allowDeep } = {}) {
  const hidden = vetoSet();
  const deepOk = allowDeep ?? !partyRules.lockDeep;
  return allQuestions.filter((q) => {
    if (hidden.has(q.id)) return false;
    if (!deepOk && q.level === "deep") return false;
    if (level && level !== "random" && q.level !== level) return false;
    if (category && q.category !== category) return false;
    return true;
  });
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function fetchAll() {
  const response = await fetch("./data/questions.json");
  if (!response.ok) throw new Error("Could not load questions");
  return response.json();
}

export async function loadQuestions() {
  if (allQuestions.length) return allQuestions;
  if (loadPromise) return loadPromise;
  loadPromise = fetchAll().then((fresh) => {
    allQuestions = fresh;
    return fresh;
  });
  return loadPromise;
}

export function getAllQuestions() {
  return allQuestions;
}

export function byLevel(level) {
  return playableQuestions({ level });
}

export function createDeck(level, { category } = {}) {
  return shuffle(playableQuestions({ level, category }));
}

export function drawFrom(deck) {
  if (!deck.length) return { card: null, deck: [] };
  const [card, ...rest] = deck;
  return { card, deck: rest };
}

export function pickRandom(list) {
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

export function questionsForDuo(level, style) {
  const pool = byLevel(level);
  if (style === "match") {
    return pool.filter((q) => q.choices?.length === 2 || q.duoTypes?.includes("match"));
  }
  if (style === "predict") {
    return pool.filter((q) => q.duoTypes?.includes("predict"));
  }
  if (style === "connect") {
    return pool.filter((q) => q.duoTypes?.includes("connect") && q.duoCompatible !== false);
  }
  return pool.filter((q) => q.duoCompatible !== false);
}

export function twoConnected(level, exclude = []) {
  const pool = questionsForDuo(level, "connect").filter((q) => !exclude.includes(q.id));
  const grouped = new Map();
  for (const q of pool) {
    const key = `${q.level}:${q.category}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(q);
  }
  const pairs = [...grouped.values()].filter((group) => group.length >= 2);
  if (!pairs.length) return null;
  const group = pickRandom(pairs);
  const shuffled = shuffle(group);
  return [shuffled[0], shuffled[1]];
}

export function dailySpark() {
  const pool = byLevel("surface");
  if (!pool.length) return null;
  const day = Math.floor(Date.now() / 86400000);
  return pool[day % pool.length];
}

export function counts() {
  return {
    surface: byLevel("surface").length,
    personal: byLevel("personal").length,
    deep: byLevel("deep").length,
    together: byLevel("together").length,
    total: allQuestions.length,
  };
}

loadQuestions().catch(() => {});
