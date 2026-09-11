const KEY = "gtky.v1";

const defaults = {
  player: { name: "" },
  lastGuest: { player2: "" },
  settings: {
    theme: "system",
    music: false,
    sfx: true,
    timer: false,
    skipAllowed: true,
    animations: true,
    predictionScoring: true,
    revealAnimations: true,
  },
  stats: {
    answered: { surface: 0, personal: 0, deep: 0, together: 0 },
    duoSessions: 0,
    wheelSpins: 0,
    cardsDrawn: 0,
    predictMatches: 0,
    predictTotal: 0,
    matchSame: 0,
    matchTotal: 0,
  },
  notes: [],
  zines: [],
  albums: [],
  lastRoomCode: "",
  paused: null,
  veto: [],
  later: [],
  letter: null,
  morning: { streak: 0, lastDay: 0, lastCard: null },
  lastNight: null,
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

let memo = null;
let writeTimer = 0;

function hydrate(parsed) {
  return {
    ...clone(defaults),
    ...parsed,
    player: { ...defaults.player, ...parsed.player },
    lastGuest: { ...defaults.lastGuest, ...parsed.lastGuest },
    settings: { ...defaults.settings, ...parsed.settings },
    stats: {
      ...defaults.stats,
      ...parsed.stats,
      answered: { ...defaults.stats.answered, ...parsed.stats?.answered },
    },
    notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    zines: Array.isArray(parsed.zines) ? parsed.zines : [],
    albums: Array.isArray(parsed.albums) ? parsed.albums : [],
    lastRoomCode: parsed.lastRoomCode || "",
    paused: parsed.paused || null,
    veto: Array.isArray(parsed.veto) ? parsed.veto : [],
    later: Array.isArray(parsed.later) ? parsed.later : [],
    letter: parsed.letter || null,
    morning: { streak: 0, lastDay: 0, lastCard: null, ...parsed.morning },
    lastNight: parsed.lastNight || null,
  };
}

export function loadState() {
  if (memo) return memo;
  try {
    const raw = localStorage.getItem(KEY);
    memo = raw ? hydrate(JSON.parse(raw)) : clone(defaults);
  } catch {
    memo = clone(defaults);
  }
  return memo;
}

export function saveState(state) {
  memo = state;
  window.clearTimeout(writeTimer);
  writeTimer = window.setTimeout(flushState, 120);
}

export function flushState() {
  window.clearTimeout(writeTimer);
  writeTimer = 0;
  if (!memo) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(memo));
  } catch {
    /* quota */
  }
}

export function updateState(mutator) {
  const state = loadState();
  mutator(state);
  saveState(state);
  return state;
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushState);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushState();
  });
}
