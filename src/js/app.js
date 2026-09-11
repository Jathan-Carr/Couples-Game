import { loadState, updateState } from "./storage.js";
import { getPlayerName, setPlayerName, getPlayer2Name, setPlayer2Name } from "./players.js";
import { getStats, totalAnswered, saveKeepsake, getNotes, recordAnswer, recordCardDrawn } from "./statistics.js";
import { loadQuestions, getAllQuestions, counts, dailySpark, setPartyRules, playableQuestions, questionsReady } from "./questions.js";
import { LEVELS, categoryMeta } from "./categories.js";
import { playSfx, setMusic, resumeAudio } from "./audio.js";
import { escapeHtml, siteHeader, homeActions, backActions, shelfBack, returnToShelf, levelDot, starterChips, waitingPup } from "./ui.js";
import { startDeck, drawCard, skipCard, answerCard, reshuffle, resetDeck } from "./deck.js";
import {
  PRESETS,
  startWheel,
  spinWheel,
  revealWheelQuestion,
  finishWheelQuestion,
  wheelGradient,
} from "./wheel.js";
import {
  STYLES,
  startDuo,
  dealRound,
  promptForTurn,
  questionForTurn,
  submitTurn,
  scoreReveal,
  skipRound,
  beginNotes,
  openNote,
  submitNote,
  promptForPlayer,
  mySeat,
  lockAnswer,
  beginOnlineNotes,
  lockNote,
} from "./duo.js";
import { savePaused, getPaused, clearPaused } from "./pause.js";
import { hostParty, joinParty, send, disconnectParty, randomCode, joinUrl } from "./party.js";
import { stampNotes, saveZine, getZines } from "./journal.js";
import { makeQrDataUrl, downloadZine, decodeZine, zineUrl } from "./zine.js";
import { burst } from "./fx.js";
import { SOLO_GAMES, TOGETHER_GAMES, KEEPSAKES, blankBooks, isPlaySession, skipShelfMotion } from "./shelf.js";
import { createRoom, upsertMember, dropMember, rememberCode, lastCode, rosterNames } from "./room.js";
import {
  listAlbums,
  getAlbum,
  saveAlbum,
  newAlbum,
  ensureSpread,
  addItem,
  patchItem,
  removeItem,
  scrapFromKind,
  importAlbums,
  downloadAlbums,
  compressImage,
  clearAlbums,
} from "./albums.js";
import { albumStudioHTML, bindAlbumStudio } from "./album-view.js";
import {
  VARIANTS,
  startRoulette,
  chooseVariant,
  chooseSide,
  spinRoulette,
  resolveSpin,
  finishRoulette,
  rouletteGradient,
  sideLabel,
} from "./roulette.js";
import { startSip, nextSip, skipSip, startNightstand, advanceNightstand, startMug, submitMug, anotherMug } from "./minis.js";
import {
  isNight,
  togetherNight,
  startNight,
  nextDare,
  hotseatQuestion,
  finishHotseat,
  passHotseat,
  neverTap,
  plantBookmark,
  nextBookmark,
  lockPostcard,
  nextPostcard,
  guessWho,
  anotherWho,
  nextSlow,
  finishMorning,
  pickLetter,
  drawLater,
  answeredLater,
  startCategory,
} from "./nights.js";
import { renderNight, lastNightBook, vetoListHTML, nightTools, handoffLock } from "./nights-view.js";
import { pinLater, unpinLater, vetoQuestion, unvetoQuestion, getLater, getLastNight, saveLastNight, getPartyRules, clearLetter } from "./keeps.js";
import { stampRound, ensureTableAlbum, compactAlbum, stampAlbumId } from "./stamp.js";
import { bindDoodle } from "./doodle.js";

const app = document.querySelector("#app");

let chromeKey = "";
let route = "home";
let session = null;
let loadError = "";
let libraryLevel = "surface";
let joinCode = "";
let zinePayload = "";
let zinePage = 0;
let zineQr = "";
let activeZine = null;
let shelfEnter = false;
let shelfNote = "Pull a labeled game book to play.";
let room = null;
let menuTab = "";
let pendingNav = "";
let remindAlbums = false;
let albumFilter = "all";
let albumId = null;
let albumSpread = 0;
let albumTray = null;
let albumSelected = null;
let albumCreating = false;
let albumPhotoTarget = null;
let joinAsSpectator = false;

function settings() {
  return loadState().settings;
}

function afterQuestions(fn) {
  if (questionsReady()) {
    fn();
    return;
  }
  loadQuestions()
    .then(() => fn())
    .catch((error) => {
      loadError = error.message || "Could not load questions.";
      render();
    });
}

function actCanRunCold(act, value) {
  if (!act) return true;
  if (act.startsWith("album") || act.startsWith("rule")) return true;
  if (act === "pull-book" && ["deck", "wheel", "duo", "evenodd"].includes(value)) return true;
  return /^(theme|toggle|menu-tab|open-shelf|leave-party|copy-party|copy-link|rejoin|rehost|pup-woof|keepsake|pause|resume|discard-pause|remind-export|remind-skip|take-nav|close-book|scroll-modes|prefill|library-level)$/.test(
    act
  );
}

function paintQr(code) {
  makeQrDataUrl(joinUrl(code))
    .then((url) => {
      if (room?.code === code) room.qr = url;
      if (session?.roomCode === code) session.qr = url;
      if (document.activeElement?.matches?.("input, textarea, select")) return;
      render();
    })
    .catch(() => {});
}

const INSTANT_ROUTES = new Set([
  "",
  "home",
  "welcome",
  "how",
  "lobby",
  "play",
  "albums",
  "settings",
  "stats",
  "deck",
  "wheel",
  "duo",
  "evenodd",
  "zine",
]);

function applyChrome() {
  const state = loadState();
  const theme = state.settings.theme;
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  const key = `${resolved}|${state.settings.animations}|${state.settings.music}`;
  if (key === chromeKey) return;
  chromeKey = key;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.classList.toggle("no-anim", !state.settings.animations);
  const color = resolved === "dark" ? "#2c1810" : "#f6e4c4";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  setMusic(state.settings.music);
}

function sfx(name) {
  playSfx(name, settings().sfx);
}

function skipOn() {
  if (room?.rules && room.rules.skipAllowed === false) return false;
  return settings().skipAllowed;
}

function isPlay(name) {
  return isPlaySession(name);
}

function nightPeople() {
  const names = rosterNames(room);
  const me = getPlayerName() || "You";
  const her = getPlayer2Name() || "them";
  return names.length ? names : [me, her].filter(Boolean);
}

function beginNight(id, extra = {}) {
  session = startNight(id, {
    me: getPlayerName() || "You",
    her: getPlayer2Name() || "them",
    roster: nightPeople(),
    ...extra,
  });
  clearPaused();
  if (id === "slowdance") {
    updateState((state) => {
      state.settings.music = true;
    });
    applyChrome();
  }
  if (room?.code && togetherNight(id)) {
    send({ type: "nav", route: id });
    send({ type: "night", session });
  }
}

function syncNight() {
  if (room?.code && togetherNight(session?.mode)) send({ type: "night", session });
}

function shareTable() {
  if (!room?.code) return;
  const table = ensureTableAlbum(room.code);
  send({ type: "album-sync", album: compactAlbum(getAlbum(table.id)) });
}

function stampCurrent(card, extra = "") {
  const title = card?.question || card?.text || "Tonight";
  const names = nightPeople().join(" & ");
  const result = stampRound({
    albumId: albumId || (room?.code ? ensureTableAlbum(room.code).id : stampAlbumId()),
    title: names,
    body: `${title}${extra ? `\n${extra}` : ""}`,
  });
  sfx("chime");
  burst("stars");
  shareTable();
  return result;
}

function pupFetch(el) {
  const pup = document.querySelector(".walker-pup");
  if (!pup || !el) return;
  const pupBox = pup.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  const dx = box.left + box.width / 2 - (pupBox.left + pupBox.width / 2);
  const dy = box.top + box.height / 2 - (pupBox.top + pupBox.height / 2);
  pup.classList.add("is-fetching");
  pup.style.transform = `translate(${dx}px, ${dy}px)`;
  playSfx("bark", true);
  window.setTimeout(() => {
    pup.classList.remove("is-fetching");
    pup.style.transform = "";
  }, 1100);
}

async function recordVoiceMemo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = (event) => chunks.push(event.data);
    rec.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => placeScrap("voice", "memo", { src: String(reader.result || "") });
      reader.readAsDataURL(blob);
    };
    rec.start();
    sfx("pop");
    window.setTimeout(() => {
      if (rec.state === "recording") rec.stop();
    }, 10000);
  } catch {
    window.alert("Could not use the microphone on this device.");
  }
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query] = raw.split("?");
  const next = path || "home";
  const params = new URLSearchParams(query || "");
  joinCode = (params.get("join") || "").toUpperCase();
  zinePayload = params.get("d") || "";
  if (isPlay(route) && !isPlay(next) && session && session.phase !== "lobby") {
    savePaused(route, session);
    saveLastNight({ route, albumId, label: "Last night" });
    if (listAlbums().length) remindAlbums = true;
  }
  let resolved = next;
  if (joinCode && (resolved === "home" || resolved === "" || resolved === "duo")) resolved = "lobby";
  if (resolved === "play" && !room?.code) resolved = "lobby";
  route = resolved;
}

export function boot() {
  document.documentElement.classList.add("is-booted");
  applyChrome();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    chromeKey = "";
    applyChrome();
  });
  window.addEventListener("hashchange", () => {
    parseRoute();
    render();
  });
  app.addEventListener("click", onClick);
  app.addEventListener("submit", onSubmit);
  app.addEventListener("input", onInput);
  setupSwipe();
  parseRoute();
  bindPup();
  window.addEventListener("keydown", onAlbumKeys);
  render();
  loadQuestions()
    .then(() => {
      if (document.activeElement?.matches?.("input, textarea, select")) return;
      render();
    })
    .catch((error) => {
      loadError = error.message || "Could not load questions.";
      render();
    });
}

function facingLeft(el) {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === "none") return false;
  try {
    return new DOMMatrixReadOnly(transform).a < 0;
  } catch {
    return transform.includes("scaleX(-1)");
  }
}

function bindPup() {
  const pup = document.querySelector(".walker-pup");
  if (!pup || pup.dataset.bound) return;
  pup.dataset.bound = "1";
  let barkTimer;
  pup.addEventListener("click", () => {
    resumeAudio();
    playSfx("bark", true);
    window.clearTimeout(barkTimer);
    pup.classList.remove("is-barking");
    pup.classList.toggle("is-left", facingLeft(pup));
    void pup.offsetWidth;
    pup.classList.add("is-barking");
    barkTimer = window.setTimeout(() => pup.classList.remove("is-barking"), 1250);
  });
}

function onClick(event) {
  const link = event.target.closest("a[href]");
  if (link?.getAttribute("href") === "#/play") {
    shelfEnter = !skipShelfMotion() && (route === "lobby" || route === "home" || route === "");
    shelfNote = "Pull a labeled game book to play.";
  }
  if (link?.getAttribute("href") === "#/lobby") {
    sfx("whoosh");
  }
  const btn = event.target.closest("[data-act]");
  if (!btn) return;
  event.preventDefault();
  resumeAudio();
  const act = btn.dataset.act;
  const value = btn.dataset.value;
  if (!actCanRunCold(act, value) && !questionsReady()) {
    afterQuestions(() => handle(act, value, btn));
    return;
  }
  handle(act, value, btn);
}

function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  if (form.id === "guest-form") {
    const name = new FormData(form).get("name");
    if (String(name).trim()) {
      setPlayerName(String(name));
      if (route === "welcome" || route === "home" || route === "") location.hash = "#/lobby";
      else render();
    }
    return;
  }
  if (form.id === "menu-start") {
    const name = String(new FormData(form).get("name") || "").trim();
    if (!name) return;
    setPlayerName(name);
    sfx("party");
    burst("party");
    location.hash = "#/lobby";
    return;
  }
  if (form.id === "create-party") {
    const data = new FormData(form);
    const name = getPlayerName() || String(data.get("name") || "Host").trim();
    setPlayerName(name);
    const size = Number(data.get("size") || 4);
    beginHostRoom({ name, size });
    return;
  }
  if (form.id === "join-party") {
    const data = new FormData(form);
    const name = getPlayerName() || String(data.get("name") || "Guest").trim();
    setPlayerName(name);
    const code = String(data.get("code") || joinCode).trim().toUpperCase();
    if (!code) return;
    joinAsSpectator = data.get("watch") === "on";
    beginJoinRoom(code, name);
    return;
  }
  if (form.id === "close-book") {
    const data = new FormData(form);
    const favoriteQ = String(data.get("q") || "").trim();
    const favoriteA = String(data.get("a") || "").trim();
    saveLastNight({ route: "play", albumId, label: "Last night", favoriteQ, favoriteA });
    stampCurrent({ question: favoriteQ || "End of night" }, favoriteA);
    sfx("chime");
    burst("party");
    location.hash = "#/";
    return;
  }
  if (form.id === "album-create") {
    const title = String(new FormData(form).get("title") || "").trim();
    if (!title) return;
    const album = newAlbum(title);
    albumCreating = false;
    albumId = album.id;
    albumSpread = 0;
    sfx("chime");
    render();
    return;
  }
  if (form.id === "duo-setup") {
    const data = new FormData(form);
    const player1 = String(data.get("player1") || "").trim() || "Player 1";
    const player2 = String(data.get("player2") || "").trim() || "Player 2";
    const online = data.get("together") === "party";
    setPlayerName(player1);
    if (!online) setPlayer2Name(player2);
    if (online) {
      startHosting({
        player1,
        level: data.get("level") || "random",
        style: data.get("style") || "mix",
      });
      return;
    }
    afterQuestions(() => {
      session = startDuo({
        player1,
        player2,
        level: data.get("level") || "random",
        style: data.get("style") || "mix",
      });
      dealRound(session);
      render();
    });
  }
  if (form.id === "duo-join") {
    const data = new FormData(form);
    const code = String(data.get("code") || joinCode).trim().toUpperCase();
    const name = getPlayerName() || "Guest";
    startJoining(code, name);
  }
}

function onInput(event) {
  if (event.target.id === "library-search") renderLibraryList(event.target.value);
  if (event.target.id === "album-import" && event.target.files?.[0]) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAlbums(JSON.parse(String(reader.result || "{}")));
        sfx("chime");
        burst("stars");
        render();
      } catch (error) {
        window.alert(error.message || "Could not import that album.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }
  if (event.target.id === "album-photo-file" && event.target.files?.[0] && albumPhotoTarget) {
    const file = event.target.files[0];
    compressImage(file).then((src) => {
      const album = getAlbum(albumId);
      if (!album) return;
      patchItem(album, albumPhotoTarget.page, albumPhotoTarget.item, { src });
      albumPhotoTarget = null;
      sfx("pop");
      render();
    });
    event.target.value = "";
  }
}

function pullBook(id) {
  resumeAudio();
  const together = TOGETHER_GAMES.some((game) => game.id === id);
  if (together && room?.code) send({ type: "nav", route: id });
  if (id === "deck" || id === "wheel" || id === "duo") {
    session = null;
    location.hash = `#/${id}`;
    return;
  }
  if (id === "evenodd") {
    session = startRoulette();
    clearPaused();
    location.hash = "#/evenodd";
    return;
  }
  const start = () => {
    if (id === "coffee") {
      session = startDeck("surface");
      clearPaused();
      location.hash = "#/deck";
      return;
    }
    if (id === "midnight") {
      session = startDeck("deep");
      clearPaused();
      location.hash = "#/deck";
      return;
    }
    if (id === "sip") {
      session = startSip();
      clearPaused();
      location.hash = "#/sip";
      return;
    }
    if (id === "nightstand") {
      session = startNightstand();
      clearPaused();
      location.hash = "#/nightstand";
      return;
    }
    if (id === "mug") {
      session = startMug();
      clearPaused();
      location.hash = "#/mug";
      return;
    }
    if (isNight(id)) {
      beginNight(id);
      location.hash = `#/${id}`;
    }
  };
  afterQuestions(start);
}

function handleNight(act, value, btn) {
  const me = getPlayerName() || "You";
  const her = getPlayer2Name() || "them";
  if (act === "pup-woof") {
    document.querySelector(".walker-pup")?.click();
    const local = document.querySelector(".waiting-pup");
    if (local) {
      local.classList.remove("is-barking");
      void local.offsetWidth;
      local.classList.add("is-barking");
      window.setTimeout(() => local.classList.remove("is-barking"), 1250);
    }
    return true;
  }
  if (act === "last-night") {
    const last = getLastNight();
    const paused = getPaused();
    if (paused?.session) {
      handle("resume");
      return true;
    }
    if (last?.albumId) {
      albumId = last.albumId;
      location.hash = "#/albums";
      return true;
    }
    if (last?.route) {
      location.hash = `#/${last.route}`;
      return true;
    }
    return true;
  }
  if (act === "close-book") {
    beginNight("close");
    location.hash = "#/close";
    return true;
  }
  if (act === "pin-later") {
    const card = session?.current || getAllQuestions().find((item) => item.id === value);
    if (card) pinLater(card);
    sfx("pop");
    burst("stars");
    return true;
  }
  if (act === "later-drop") {
    unpinLater(value);
    render();
    return true;
  }
  if (act === "veto-q") {
    vetoQuestion(value);
    sfx("skip");
    render();
    return true;
  }
  if (act === "unveto-q") {
    unvetoQuestion(value);
    render();
    return true;
  }
  if (act === "stamp-round") {
    const extra = session?.a1 ? `\n${me}: ${session.a1}\n${her}: ${session.a2 || ""}` : "";
    stampCurrent(session?.current || session?.quiz?.note, extra);
    return true;
  }
  if (act === "album-print") {
    window.print();
    return true;
  }
  if (act === "copy-link") {
    navigator.clipboard?.writeText(joinUrl(room?.code || "")).catch(() => {});
    sfx("pop");
    return true;
  }
  if (act === "rejoin") {
    const code = lastCode();
    if (code) beginJoinRoom(code, getPlayerName() || "Guest");
    return true;
  }
  if (act === "rehost") {
    beginHostRoom({ name: getPlayerName() || "Host", size: room?.size || 4, code: lastCode() });
    return true;
  }
  if (act === "rule") {
    if (!room || room.role !== "host") return true;
    room.rules = getPartyRules(room);
    room.rules[value] = !room.rules[value];
    setPartyRules(room.rules);
    send({ type: "rules", rules: room.rules });
    sfx("tick");
    render();
    return true;
  }
  if (act === "dare-pick") {
    if (!session || session.mode !== "dare") beginNight("dare");
    const kind = value === "dare" && room?.rules && room.rules.dares === false ? "truth" : value;
    nextDare(session, kind);
    sfx("draw");
    syncNight();
    render();
    return true;
  }
  if (act === "dare-done" || act === "dare-skip") {
    if (act === "dare-done" && session?.current?.level) recordAnswer(session.current.level);
    session.phase = "pick";
    session.current = null;
    sfx(act === "dare-skip" ? "skip" : "match");
    syncNight();
    render();
    return true;
  }
  if (act === "hotseat-pick") {
    session.seat = value;
    hotseatQuestion(session);
    sfx("draw");
    syncNight();
    render();
    return true;
  }
  if (act === "hotseat-answer" || act === "hotseat-skip") {
    finishHotseat(session, act === "hotseat-answer");
    sfx(act === "hotseat-skip" ? "skip" : "match");
    syncNight();
    render();
    return true;
  }
  if (act === "hotseat-pass") {
    passHotseat(session);
    sfx("whoosh");
    syncNight();
    render();
    return true;
  }
  if (act === "never-has") {
    neverTap(session, value, true);
    sfx("tick");
    syncNight();
    render();
    return true;
  }
  if (act === "never-safe" || act === "never-skip") {
    neverTap(session, me, false);
    sfx(act === "never-skip" ? "skip" : "draw");
    syncNight();
    render();
    return true;
  }
  if (act === "never-reset") {
    beginNight("never");
    render();
    return true;
  }
  if (act === "bookmark-unlock") {
    session.handoff = false;
    session.phase = "plant2";
    render();
    return true;
  }
  if (act === "bookmark-plant") {
    plantBookmark(session, session.phase === "plant2" ? 2 : 1, value);
    sfx("pop");
    syncNight();
    render();
    return true;
  }
  if (act === "bookmark-answer" || act === "bookmark-skip") {
    nextBookmark(session, act === "bookmark-answer");
    sfx(act === "bookmark-skip" ? "skip" : "match");
    syncNight();
    render();
    return true;
  }
  if (act === "postcard-lock") {
    const who = session.phase === "p2" ? 2 : 1;
    if (!lockPostcard(session, who, document.getElementById("postcard-text")?.value || "")) return true;
    sfx("draw");
    syncNight();
    render();
    return true;
  }
  if (act === "postcard-go") {
    session.phase = "p2";
    session.endsAt = Date.now() + 60000;
    render();
    return true;
  }
  if (act === "postcard-again") {
    nextPostcard(session);
    render();
    return true;
  }
  if (act === "postcard-skip") {
    nextPostcard(session);
    sfx("skip");
    render();
    return true;
  }
  if (act === "who-guess") {
    guessWho(session, value);
    sfx(session.correct ? "match" : "skip");
    render();
    return true;
  }
  if (act === "who-next") {
    anotherWho(session);
    render();
    return true;
  }
  if (act === "slow-done") {
    if (session.current) recordAnswer("deep");
    sfx("match");
    location.hash = "#/play";
    return true;
  }
  if (act === "slow-next" || act === "slow-skip") {
    nextSlow(session);
    sfx(act === "slow-skip" ? "skip" : "draw");
    render();
    return true;
  }
  if (act === "morning-done") {
    finishMorning(session);
    sfx("chime");
    render();
    return true;
  }
  if (act === "morning-skip") {
    session.current = playableQuestions({ level: "surface" })[Math.floor(Math.random() * 8)] || session.current;
    render();
    return true;
  }
  if (act === "letter-seal") {
    pickLetter(session, value);
    sfx("chime");
    render();
    return true;
  }
  if (act === "letter-open") {
    if (session.current) recordAnswer("deep");
    clearLetter();
    sfx("match");
    session.phase = "pick";
    session.choices = playableQuestions({ level: "deep" }).slice(0, 3);
    render();
    return true;
  }
  if (act === "letter-reseal") {
    clearLetter();
    beginNight("letter");
    render();
    return true;
  }
  if (act === "later-draw") {
    drawLater(session, value);
    render();
    return true;
  }
  if (act === "later-answer") {
    answeredLater(session);
    sfx("match");
    render();
    return true;
  }
  if (act === "later-skip" || act === "later-list") {
    session.current = null;
    session.phase = "list";
    render();
    return true;
  }
  if (act === "category-start") {
    startCategory(session, value, btn?.dataset.level || "personal");
    sfx("draw");
    render();
    return true;
  }
  if (act === "category-answer" || act === "category-skip") {
    if (act === "category-answer" && session.current) recordAnswer(session.current.level);
    session.current = session.remaining.shift() || null;
    session.phase = session.current ? "show" : "empty";
    sfx(act === "category-skip" ? "skip" : "match");
    render();
    return true;
  }
  if (act === "category-reset") {
    beginNight("category");
    render();
    return true;
  }
  return false;
}

function handle(act, value, btn) {
  if (handleNight(act, value, btn)) return;
  if (act === "scroll-modes") {
    if (route !== "home" && route !== "") {
      location.hash = "#/";
      requestAnimationFrame(() => document.getElementById("modes")?.scrollIntoView({ behavior: "smooth" }));
      return;
    }
    document.getElementById("modes")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (act === "theme") {
    updateState((state) => {
      state.settings.theme = value;
    });
    applyChrome();
    render();
    return;
  }
  if (act === "toggle") {
    updateState((state) => {
      state.settings[value] = !state.settings[value];
    });
    applyChrome();
    render();
    return;
  }
  if (act === "library-level") {
    libraryLevel = value;
    render();
    return;
  }
  if (act === "prefill") {
    const field = document.getElementById(btn.dataset.target);
    if (field) {
      const starter = value || "";
      field.value = field.value.trim() ? `${starter} ${field.value}` : `${starter} `;
      field.focus();
    }
    return;
  }
  if (act === "start-deck") {
    session = startDeck(value);
    clearPaused();
    sfx("draw");
    render();
    return;
  }
  if (act === "draw") {
    drawCard(session, recordCardDrawn);
    session.flipped = false;
    sfx("draw");
    document.querySelector(".deck-stack")?.classList.add("shuffling");
    render();
    requestAnimationFrame(() => {
      session.flipped = true;
      document.querySelector(".playing-card")?.classList.add("flipped", "glow");
      sfx("flip");
    });
    return;
  }
  if (act === "deck-answer") {
    answerCard(session, recordAnswer);
    sfx("match");
    burst("stars");
    render();
    return;
  }
  if (act === "deck-skip") {
    skipCard(session);
    sfx("skip");
    render();
    return;
  }
  if (act === "reshuffle") {
    reshuffle(session);
    sfx("draw");
    render();
    return;
  }
  if (act === "reset-deck") {
    resetDeck(session);
    burst("stars");
    sfx("draw");
    render();
    return;
  }
  if (act === "pause") {
    savePaused(route, session);
    if (session?.online) disconnectParty();
    session = null;
    location.hash = "#/play";
    if (listAlbums().length) remindAlbums = true;
    return;
  }
  if (act === "resume") {
    const paused = getPaused();
    if (!paused?.session) return;
    session = paused.session;
    session.online = false;
    session.peerStatus = "idle";
    clearPaused();
    location.hash = `#/${paused.route || "deck"}`;
    return;
  }
  if (act === "discard-pause") {
    clearPaused();
    if (listAlbums().length) remindAlbums = true;
    render();
    return;
  }
  if (act === "pull-book") {
    pullBook(value);
    return;
  }
  if (act === "keepsake") {
    shelfNote =
      value === "(I love you)"
        ? "That’s not a game. That’s yours."
        : `${value} lives on the keepsake shelf. Pull a game book to play.`;
    sfx("tick");
    render();
    return;
  }
  if (act === "roulette-reset") {
    session = startRoulette();
    sfx("draw");
    render();
    return;
  }
  if (act === "roulette-variant") {
    chooseVariant(session, value);
    sfx("draw");
    render();
    return;
  }
  if (act === "roulette-side") {
    const nameField = document.getElementById("her-name");
    if (nameField?.value.trim()) setPlayer2Name(nameField.value.trim());
    chooseSide(session, value);
    sfx("match");
    if (room?.code) send({ type: "roulette-state", state: { ...session } });
    render();
    return;
  }
  if (act === "roulette-spin") {
    if (!session || session.spinning) return;
    const from = session.rotation;
    spinRoulette(session);
    const to = session.rotation;
    session.rotation = from;
    sfx("spin");
    render();
    const wheel = document.querySelector(".roulette");
    const ticks = settings().sfx ? setInterval(() => sfx("tick"), 160) : null;
    requestAnimationFrame(() => {
      session.rotation = to;
      if (wheel) {
        wheel.classList.add("spinning");
        wheel.style.transform = `rotate(${to}deg)`;
      }
    });
    const wait = settings().animations ? 4200 : 50;
    setTimeout(() => {
      if (ticks) clearInterval(ticks);
      resolveSpin(session);
      sfx("flip");
      if (room?.code) send({ type: "roulette-state", state: { ...session, spinning: false } });
      render();
    }, wait);
    if (room?.code) send({ type: "roulette-spin", rotation: to, number: session.number, variant: session.variant, herSide: session.herSide, mySide: session.mySide });
    return;
  }
  if (act === "roulette-answer") {
    finishRoulette(session, true);
    sfx("match");
    burst("stars");
    render();
    return;
  }
  if (act === "roulette-skip") {
    finishRoulette(session, false);
    sfx("skip");
    render();
    return;
  }
  if (act === "sip-next") {
    nextSip(session);
    sfx("draw");
    render();
    return;
  }
  if (act === "sip-skip") {
    skipSip(session);
    sfx("skip");
    render();
    return;
  }
  if (act === "nightstand-next") {
    advanceNightstand(session, true);
    sfx("match");
    burst("stars");
    render();
    return;
  }
  if (act === "nightstand-skip") {
    advanceNightstand(session, false);
    sfx("skip");
    render();
    return;
  }
  if (act === "mug-go") {
    session.phase = "p2";
    sfx("draw");
    render();
    return;
  }
  if (act === "mug-submit") {
    const field = document.querySelector("#mug-answer");
    if (!submitMug(session, field?.value || "")) return;
    sfx(session.phase === "done" ? "match" : "draw");
    if (session.phase === "done") burst("stars");
    render();
    return;
  }
  if (act === "mug-again") {
    anotherMug(session);
    sfx("draw");
    render();
    return;
  }
  if (act === "menu-tab") {
    menuTab = menuTab === value ? "" : value;
    sfx("pop");
    render();
    return;
  }
  if (act === "copy-party") {
    const code = room?.code || "";
    navigator.clipboard?.writeText(code).catch(() => {});
    sfx("pop");
    burst("stars");
    return;
  }
  if (act === "open-shelf") {
    shelfEnter = !skipShelfMotion();
    location.hash = "#/play";
    return;
  }
  if (act === "leave-party") {
    disconnectParty();
    room = null;
    location.hash = "#/";
    return;
  }
  if (act === "take-nav") {
    const next = pendingNav;
    pendingNav = "";
    location.hash = `#/${next}`;
    return;
  }
  if (act === "album-filter") {
    albumFilter = value;
    albumId = null;
    albumCreating = false;
    sfx("tick");
    render();
    return;
  }
  if (act === "album-clear") {
    if (!listAlbums().length) {
      sfx("skip");
      return;
    }
    const ok = window.confirm("Clear every album on this device? This wipes the books. Export first if you want them back.");
    if (!ok) return;
    clearAlbums();
    albumId = null;
    albumSpread = 0;
    albumSelected = null;
    albumCreating = false;
    albumFilter = "all";
    albumPhotoTarget = null;
    sfx("skip");
    render();
    return;
  }
  if (act === "album-new") {
    albumCreating = true;
    albumId = null;
    albumSpread = 0;
    sfx("page");
    if (route !== "albums") location.hash = "#/albums";
    else render();
    return;
  }
  if (act === "album-cancel") {
    albumCreating = false;
    albumId = null;
    albumTray = null;
    albumSelected = null;
    sfx("skip");
    if (route === "albums") render();
    else location.hash = "#/play";
    return;
  }
  if (act === "album-open") {
    albumId = value;
    albumSpread = 0;
    albumCreating = false;
    sfx("page");
    render();
    return;
  }
  if (act === "album-star") {
    const album = getAlbum(albumId);
    if (album) {
      album.favorite = !album.favorite;
      saveAlbum(album);
      sfx("chime");
      render();
    }
    return;
  }
  if (act === "album-tray") {
    albumTray = albumTray === value ? null : value;
    sfx("pop");
    render();
    return;
  }
  if (act === "album-add") {
    if (btn?.dataset.kind === "voice") {
      recordVoiceMemo();
      return;
    }
    placeScrap(btn?.dataset.kind, value);
    return;
  }
  if (act === "album-delete") {
    const album = getAlbum(albumId);
    if (!album || !albumSelected) return;
    const page = album.pages.findIndex((entry) => entry.items.some((item) => item.id === albumSelected));
    if (page >= 0) removeItem(album, page, albumSelected);
    albumSelected = null;
    sfx("skip");
    render();
    return;
  }
  if (act === "album-note") {
    const album = getAlbum(albumId);
    if (!album || !albumSelected) return;
    const text = window.prompt("Sticky note");
    if (text == null) return;
    const page = Number(
      [...album.pages.entries()].find(([, p]) => p.items.some((it) => it.id === albumSelected))?.[0] ?? albumSpread * 2
    );
    const patch = value === "above" ? { noteAbove: text } : { noteBelow: text };
    patchItem(album, page, albumSelected, patch);
    sfx("pop");
    render();
    return;
  }
  if (act === "album-photo") {
    albumPhotoTarget = { page: Number(btn?.dataset.page || 0), item: btn?.dataset.item };
    document.getElementById("album-photo-file")?.click();
    return;
  }
  if (act === "album-next") {
    const album = getAlbum(albumId);
    if (!album) return;
    albumSpread += 1;
    ensureSpread(album, albumSpread);
    saveAlbum(album);
    sfx("page");
    render();
    return;
  }
  if (act === "album-prev") {
    albumSpread = Math.max(0, albumSpread - 1);
    sfx("page");
    render();
    return;
  }
  if (act === "album-export") {
    downloadAlbums();
    sfx("chime");
    burst("stars");
    return;
  }
  if (act === "album-import") {
    document.getElementById("album-import")?.click();
    return;
  }
  if (act === "album-open-shelf") {
    albumCreating = false;
    albumId = value || null;
    albumSpread = 0;
    location.hash = "#/albums";
    return;
  }
  if (act === "remind-export") {
    downloadAlbums();
    remindAlbums = false;
    sfx("chime");
    render();
    return;
  }
  if (act === "remind-skip") {
    remindAlbums = false;
    render();
    return;
  }
  if (act === "select-scrap") {
    albumSelected = value;
    render();
    return;
  }
  if (act === "start-wheel") {
    session = startWheel(value);
    clearPaused();
    render();
    return;
  }
  if (act === "spin") {
    if (!session || session.spinning) return;
    const from = session.rotation;
    spinWheel(session);
    const to = session.rotation;
    session.rotation = from;
    sfx("spin");
    render();
    const wheel = document.querySelector(".wheel");
    const ticks = settings().sfx ? setInterval(() => sfx("tick"), 180) : null;
    requestAnimationFrame(() => {
      session.rotation = to;
      if (wheel) {
        wheel.classList.add("spinning");
        wheel.style.transform = `rotate(${to}deg)`;
      }
    });
    const wait = settings().animations ? 4200 : 50;
    setTimeout(() => {
      if (ticks) clearInterval(ticks);
      revealWheelQuestion(session);
      sfx("flip");
      render();
    }, wait);
    return;
  }
  if (act === "wheel-answer") {
    finishWheelQuestion(session, true);
    sfx("match");
    render();
    return;
  }
  if (act === "wheel-skip") {
    finishWheelQuestion(session, false);
    sfx("skip");
    render();
    return;
  }
  if (act === "duo-begin") {
    session.phase = session.phase === "note-handoff" ? "note-write" : "answer";
    if (session.phase === "note-write") openNote(session);
    render();
    return;
  }
  if (act === "duo-submit") {
    const field = document.querySelector("#duo-answer");
    const choice = document.querySelector(".choice-btn.selected");
    const q = session.online ? (mySeat(session) === 1 ? session.q1 : session.q2) : questionForTurn(session);
    const answer = q?.choices ? choice?.dataset.value || "" : field?.value || "";
    if (!String(answer).trim()) return;
    if (session.online) {
      const seat = mySeat(session);
      const result = lockAnswer(session, seat, String(answer).trim());
      send({ type: "answer", seat, text: String(answer).trim() });
      if (result === "reveal") {
        session.scored = session.scored || scoreReveal(session, settings());
        if (session.scored.same || session.scored.matched) burst();
        sfx("match");
      } else sfx("draw");
      render();
      return;
    }
    submitTurn(session, String(answer).trim());
    if (session.phase === "reveal") {
      session.scored = scoreReveal(session, settings());
      if (session.scored.kind === "predict" && session.scored.matched) {
        sfx("match");
        burst();
      } else if (session.scored.kind === "match" && session.scored.same) {
        sfx("match");
        burst();
      } else sfx("draw");
    } else {
      sfx("draw");
    }
    render();
    return;
  }
  if (act === "choose") {
    document.querySelectorAll(".choice-btn").forEach((el) => el.classList.remove("selected"));
    btn?.classList.add("selected");
    return;
  }
  if (act === "duo-next") {
    if (session.online && session.role === "guest") {
      send({ type: "next" });
      session.phase = "waiting";
      sfx("draw");
      render();
      return;
    }
    dealRound(session);
    if (session.online) send({ type: "deal", bundle: dealBundle(session) });
    sfx("draw");
    render();
    return;
  }
  if (act === "duo-skip") {
    if (session.online && session.role === "guest") {
      send({ type: "skip" });
      session.phase = "waiting";
      sfx("skip");
      render();
      return;
    }
    skipRound(session);
    if (session.online && session.role === "host") {
      send({ type: "deal", bundle: dealBundle(session) });
    }
    sfx("skip");
    render();
    return;
  }
  if (act === "duo-wrap") {
    if (session.online) {
      beginOnlineNotes(session);
      send({ type: "wrap" });
    } else {
      beginNotes(session);
    }
    sfx("draw");
    render();
    return;
  }
  if (act === "duo-note-submit") {
    const field = document.querySelector("#duo-note");
    if (session.online) {
      const result = lockNote(session, mySeat(session), field?.value || "");
      send({ type: "note", seat: mySeat(session), text: field?.value || "" });
      if (result === "reveal") finishZine();
      else sfx("draw");
      render();
      return;
    }
    submitNote(session, field?.value || "");
    if (session.phase === "note-reveal") {
      finishZine();
    } else {
      sfx("draw");
    }
    render();
    return;
  }
  if (act === "duo-note-skip") {
    if (session.online) {
      const result = lockNote(session, mySeat(session), "");
      send({ type: "note", seat: mySeat(session), text: "" });
      if (result === "reveal") finishZine();
      render();
      return;
    }
    submitNote(session, "");
    if (session.phase === "note-reveal") finishZine();
    sfx("skip");
    render();
    return;
  }
  if (act === "host-party") {
    startHosting();
    return;
  }
  if (act === "copy-code") {
    const code = session?.roomCode || "";
    navigator.clipboard?.writeText(code).catch(() => {});
    return;
  }
  if (act === "open-zine") {
    activeZine = session?.journal || getZines()[0];
    zinePage = 0;
    zineQr = "";
    location.hash = "#/zine";
    return;
  }
  if (act === "download-zine") {
    const journal = activeZine || session?.journal || getZines()[0];
    if (journal) downloadZine(journal);
    return;
  }
  if (act === "zine-next") {
    zinePage += 1;
    render();
    return;
  }
  if (act === "zine-prev") {
    zinePage = Math.max(0, zinePage - 1);
    render();
    return;
  }
  if (act === "reveal-hidden") {
    btn?.classList.remove("answer--hidden");
    if (btn?.dataset.secret) btn.textContent = btn.dataset.secret;
    sfx("flip");
  }
}

function dealBundle(s) {
  return {
    round: s.round,
    currentStyle: s.currentStyle,
    q1: s.q1,
    q2: s.q2,
    player1: s.player1,
    player2: s.player2,
    level: s.level,
    style: s.style,
    phase: s.phase,
  };
}

function applyDeal(bundle) {
  session.round = bundle.round;
  session.currentStyle = bundle.currentStyle;
  session.q1 = bundle.q1;
  session.q2 = bundle.q2;
  session.player1 = bundle.player1 || session.player1;
  session.player2 = bundle.player2 || session.player2;
  session.a1 = "";
  session.a2 = "";
  session.ready1 = false;
  session.ready2 = false;
  session.scored = null;
  session.phase = "answer";
}

function broadcastRoster() {
  if (!room || room.role !== "host") return;
  send({ type: "roster", members: room.members, size: room.size, code: room.code });
}

function onRoomStatus(status, detail) {
  if (!room) return;
  if (status === "waiting" || status === "hosting" || status === "connecting") room.status = status;
  if (status === "peer-open") {
    room.status = "connected";
    sfx("chime");
    burst("party");
    if (room.role === "host") broadcastRoster();
  }
  if (status === "peer-left") {
    dropMember(room, detail);
    if (room.role === "host") broadcastRoster();
  }
  if (status === "error") {
    room.status = "error";
    room.error = detail || "Could not connect.";
  }
  if (session) session.peerStatus = status === "peer-open" ? "connected" : status;
  if (route === "lobby" || route === "play" || session?.online) render();
}

function onRoomMessage(msg) {
  if (!msg?.type) return;
  if (msg.type === "hello" && room?.role === "host") {
    const seated = room.members.filter((item) => !item.spectator);
    const spectator = Boolean(msg.spectator) || seated.length >= room.size;
    upsertMember(room, { id: msg._from || "guest", name: msg.name || "Guest", host: false, spectator });
    if (msg.name && !spectator) setPlayer2Name(msg.name);
    broadcastRoster();
    send({ type: "rules", rules: getPartyRules(room) });
    shareTable();
    sfx("pop");
    burst("hearts");
    render();
    return;
  }
  if (msg.type === "roster" && room) {
    room.members = msg.members || room.members;
    room.size = msg.size || room.size;
    const other = room.members.find((item) => !item.host);
    if (other?.name) setPlayer2Name(other.name);
    render();
    return;
  }
  if (msg.type === "rules") {
    if (room) room.rules = msg.rules || room.rules;
    setPartyRules(msg.rules || {});
    render();
    return;
  }
  if (msg.type === "night") {
    session = msg.session;
    if (msg.session?.mode && route !== msg.session.mode) location.hash = `#/${msg.session.mode}`;
    else render();
    return;
  }
  if (msg.type === "album-sync" && msg.album) {
    saveAlbum(msg.album);
    render();
    return;
  }
  if (msg.type === "nav") {
    if (route === "albums") {
      pendingNav = msg.route;
      render();
      return;
    }
    if (msg.route && msg.route !== route) location.hash = `#/${msg.route}`;
    return;
  }
  if (msg.type === "roulette-state") {
    session = { ...(session || startRoulette()), ...msg.state, mode: "evenodd" };
    if (route !== "evenodd") location.hash = "#/evenodd";
    else render();
    return;
  }
  if (msg.type === "roulette-spin") {
    if (!session || session.mode !== "evenodd") session = startRoulette();
    session.number = msg.number;
    session.variant = msg.variant || session.variant;
    session.herSide = msg.herSide;
    session.mySide = msg.mySide;
    session.spinning = true;
    session.phase = "spinning";
    const from = session.rotation;
    const to = msg.rotation;
    session.rotation = from;
    if (route !== "evenodd") location.hash = "#/evenodd";
    else render();
    requestAnimationFrame(() => {
      session.rotation = to;
      const wheel = document.querySelector(".roulette");
      if (wheel) {
        wheel.classList.add("spinning");
        wheel.style.transform = `rotate(${to}deg)`;
      }
    });
    return;
  }
  if (session?.mode === "duo") onDuoMessage(msg);
}

function beginHostRoom({ name, size, code: given }) {
  const code = given || randomCode();
  room = createRoom({ code, role: "host", size, name });
  rememberCode(code);
  setPartyRules(room.rules);
  ensureTableAlbum(code);
  hostParty(code, { onMessage: onRoomMessage, onStatus: onRoomStatus }, { size });
  sfx("party");
  burst("party");
  render();
  paintQr(code);
}

function beginJoinRoom(code, name) {
  room = createRoom({ code, role: "guest", size: 4, name });
  rememberCode(code);
  joinParty(code, {
    onMessage: onRoomMessage,
    onStatus: (status, detail) => {
      onRoomStatus(status, detail);
      if (status === "peer-open" || status === "connected") send({ type: "hello", name, spectator: joinAsSpectator });
    },
  });
  sfx("whoosh");
  render();
}

function finishZine() {
  stampNotes(session);
  saveKeepsake(session);
  saveZine(session.journal);
  sfx("match");
  burst();
  send({ type: "zine", journal: session.journal });
}

function onDuoMessage(msg) {
  if (!session || !msg?.type) return;
  if (msg.type === "deal") {
    applyDeal(msg.bundle);
    render();
    return;
  }
  if (msg.type === "answer") {
    const result = lockAnswer(session, msg.seat, msg.text);
    if (result === "reveal") {
      session.scored = session.scored || scoreReveal(session, settings());
      if (session.scored.same || session.scored.matched) burst();
    }
    render();
    return;
  }
  if (msg.type === "skip" && session.role === "host") {
    skipRound(session);
    send({ type: "deal", bundle: dealBundle(session) });
    render();
    return;
  }
  if (msg.type === "next" && session.role === "host") {
    dealRound(session);
    send({ type: "deal", bundle: dealBundle(session) });
    render();
    return;
  }
  if (msg.type === "wrap") {
    beginOnlineNotes(session);
    render();
    return;
  }
  if (msg.type === "note") {
    const result = lockNote(session, msg.seat, msg.text);
    if (result === "reveal") finishZine();
    render();
    return;
  }
  if (msg.type === "zine") {
    session.journal = msg.journal;
    saveZine(msg.journal);
  }
}

function startHosting({ player1, level, style }) {
  if (room?.code) {
    afterQuestions(() => {
      session = startDuo({
        player1,
        player2: rosterNames(room).find((n) => n !== player1) || "Waiting…",
        level,
        style,
        online: true,
        role: room.role,
        roomCode: room.code,
      });
      session.phase = room.role === "host" ? "answer" : "waiting";
      if (room.role === "host") {
        dealRound(session);
        send({ type: "deal", bundle: dealBundle(session) });
      }
      send({ type: "nav", route: "duo" });
      clearPaused();
      render();
    });
    return;
  }
  const code = randomCode();
  session = startDuo({
    player1,
    player2: "Waiting…",
    level,
    style,
    online: true,
    role: "host",
    roomCode: code,
  });
  session.phase = "lobby";
  room = createRoom({ code, role: "host", size: 2, name: player1 });
  hostParty(code, { onMessage: onRoomMessage, onStatus: onRoomStatus }, { size: 2 });
  clearPaused();
  render();
  paintQr(code);
}

async function startJoining(code, name) {
  beginJoinRoom(code, name);
  session = startDuo({
    player1: "Host",
    player2: name,
    level: "random",
    style: "mix",
    online: true,
    role: "guest",
    roomCode: code,
  });
  session.phase = "lobby";
  location.hash = "#/duo";
}

function setupSwipe() {
  let startY = null;
  app.addEventListener("touchstart", (event) => {
    if (!event.touches[0]) return;
    startY = event.touches[0].clientY;
  }, { passive: true });
  app.addEventListener("touchend", (event) => {
    if (startY == null || !event.changedTouches[0]) return;
    const dy = startY - event.changedTouches[0].clientY;
    startY = null;
    if (dy > 70 && session?.mode === "deck" && session.phase === "show") {
      handle("deck-answer");
    }
  }, { passive: true });
}

function placeScrap(kind, value, extra = {}) {
  const album = getAlbum(albumId);
  if (!album || !kind) return;
  const page = extra.page ?? albumSpread * 2;
  const item = scrapFromKind(kind, value, extra);
  if (!item) return;
  addItem(album, page, item);
  albumSelected = item.id;
  sfx("pop");
  render();
  if (room?.code) shareTable();
  if (kind === "photo" && !item.src) {
    albumPhotoTarget = { page, item: item.id };
    document.getElementById("album-photo-file")?.click();
  }
}

function onAlbumKeys(event) {
  if (route !== "albums") return;
  if (event.target?.closest?.("input, textarea, [contenteditable]")) return;
  if ((event.key === "Delete" || event.key === "Backspace") && albumSelected) {
    event.preventDefault();
    handle("album-delete");
  }
}

function render() {
  applyChrome();
  if (loadError) {
    app.innerHTML = `<main class="screen container"><div class="error"><h1>GTKY</h1><p>${escapeHtml(loadError)}</p><button class="button button--dark" onclick="location.reload()">Try again</button></div></main>`;
    return;
  }
  const waitingOnDeck =
    !questionsReady() &&
    (!INSTANT_ROUTES.has(route) || Boolean(session && ["deck", "wheel", "duo"].includes(route)));
  if (waitingOnDeck) {
    app.innerHTML = `
      ${siteHeader({ title: "GTKY", actions: shelfBack() })}
      <main class="screen container">
        <header class="section-heading">
          <p class="hello">GTKY</p>
          <h1>Shuffling the deck…</h1>
          <p class="muted">Almost there.</p>
        </header>
      </main>`;
    loadQuestions()
      .then(() => render())
      .catch((error) => {
        loadError = error.message || "Could not load questions.";
        render();
      });
    return;
  }
  const views = {
    welcome: renderMenu,
    home: renderMenu,
    "": renderMenu,
    how: renderHow,
    lobby: renderLobby,
    play: renderPlay,
    albums: renderAlbums,
    deck: renderDeck,
    wheel: renderWheel,
    duo: renderDuo,
    evenodd: renderRoulette,
    sip: renderSip,
    nightstand: renderNightstand,
    mug: renderMug,
    stats: renderStats,
    settings: renderSettings,
    library: renderLibrary,
    zine: renderZine,
    dare: renderNightGames,
    hotseat: renderNightGames,
    never: renderNightGames,
    bookmark: renderNightGames,
    postcards: renderNightGames,
    whosaid: renderNightGames,
    slowdance: renderNightGames,
    morning: renderNightGames,
    letter: renderNightGames,
    later: renderNightGames,
    category: renderNightGames,
    close: renderNightGames,
  };
  (views[route] || renderMenu)();
  if (isPlay(route) || route === "albums") {
    app.insertAdjacentHTML("beforeend", returnToShelf());
  }
  if (remindAlbums) {
    app.insertAdjacentHTML(
      "beforeend",
      `<div class="album-remind" role="dialog" aria-label="Save albums">
        <div class="sheet">
          <p class="hello">Before you go</p>
          <h2>Download your albums?</h2>
          <p>Export them now so you can import them the next time you play — or start a new book.</p>
          <div class="question-actions" style="justify-content:center">
            <button class="button button--dark" data-act="remind-export">Download albums</button>
            <button class="button" data-act="remind-skip">Not now</button>
          </div>
        </div>
      </div>`
    );
  }
  if (pendingNav && route === "albums") {
    app.insertAdjacentHTML(
      "beforeend",
      `<div class="album-remind"><div class="sheet">
        <p>Your party pulled a game.</p>
        <button class="button button--dark" data-act="take-nav">Join them →</button>
      </div></div>`
    );
  }
  if (route === "albums") {
    bindAlbumStudio(app, {
      onSelect(id) {
        albumSelected = id;
      },
      onMove(page, itemId, pos) {
        const album = getAlbum(albumId);
        if (!album) return;
        albumSelected = itemId;
        patchItem(album, Number(page), itemId, pos);
      },
      onText(page, itemId, text) {
        const album = getAlbum(albumId);
        if (!album) return;
        patchItem(album, Number(page), itemId, { text });
      },
      onDrop({ kind, value, page, x, y }) {
        placeScrap(kind, value, { page, x, y });
      },
      onPhotoFile(page, file, pos) {
        compressImage(file).then((src) => {
          placeScrap("photo", "polaroid", { page, src, ...pos });
        });
      },
      onFetch(el) {
        pupFetch(el);
      },
    });
  }
  bindDoodle(app);
}

function renderMenu() {
  const name = getPlayerName();
  const s = settings();
  app.innerHTML = `
    ${siteHeader({ title: "Menu" })}
    <main class="menu-screen">
      <section class="menu-card enter">
        <p class="hello">GTKY</p>
        <h1>Get to know<br /><em>each other.</em></h1>
        <form id="menu-start">
          <div class="field" style="text-align:left">
            <label for="name">Name</label>
            <input id="name" name="name" maxlength="32" autocomplete="nickname" placeholder="Your name" value="${escapeHtml(name)}" required />
          </div>
          <div class="menu-stack">
            <button class="button button--dark button--large" type="submit">Start</button>
            <button class="button" type="button" data-act="menu-tab" data-value="how">How to play</button>
            <button class="button" type="button" data-act="menu-tab" data-value="settings">Settings</button>
          </div>
        </form>
        <p class="muted" style="margin-top:1.1rem">
          <a href="./gtky-github-pages.zip" download>Download GTKY for GitHub Pages</a>
        </p>
        ${dailySparkBlock()}
        ${
          menuTab === "how"
            ? `<div class="question-card" style="margin-top:1.2rem;text-align:left">
                <h3>How to play</h3>
                <p>Start a party. Share the code. Meet at the bookcase.</p>
                <p><strong>Singleplayer</strong> spines are for one phone. <strong>Together</strong> spines sync across the party.</p>
                <p>The skinny shelf is <strong>Albums!</strong> — photos, stickers, sticky notes. Export before you leave so next time you can import.</p>
              </div>`
            : ""
        }
        ${
          menuTab === "settings"
            ? `<div class="question-card" style="margin-top:1.2rem;text-align:left">
                <p class="hello">Quick settings</p>
                ${toggleRow("sfx", "Sound effects", s.sfx)}
                ${toggleRow("music", "Music", s.music)}
                ${toggleRow("animations", "Animations", s.animations)}
                <a class="button" href="#/settings">All settings →</a>
              </div>`
            : ""
        }
      </section>
    </main>
  `;
}

function renderHow() {
  menuTab = "how";
  renderMenu();
}

function renderLobby() {
  const name = getPlayerName();
  const remembered = lastCode();
  if (room?.code) {
    app.innerHTML = `
      ${siteHeader({ title: "Party", actions: backActions() })}
      <main class="lobby-screen">
        <div class="spark-rain" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<span style="left:${8 + i * 7}%;animation-delay:${i * 0.2}s">✦</span>`).join("")}</div>
        <div class="container" style="position:relative;z-index:1;text-align:center">
          <p class="hello">${room.role === "host" ? "You made a room." : "You’re in."}</p>
          <p class="party-code">${escapeHtml(room.code)}</p>
          ${(room.status === "waiting" || room.status === "hosting" || room.status === "connecting") ? waitingPup() : ""}
          <p class="muted">${room.status === "waiting" || room.status === "hosting" ? "Waiting for friends…" : room.status === "error" ? escapeHtml(room.error) : "Connected."} · seats ${room.members.filter((m) => !m.spectator).length}/${room.size}</p>
          <div class="party-members">${room.members.map((m) => `<span class="party-chip">${escapeHtml(m.name)}${m.host ? " ★" : ""}${m.spectator ? " · watching" : ""}</span>`).join("")}</div>
          ${room.qr ? `<img src="${room.qr}" alt="Join QR" width="160" height="160" style="border-radius:12px;background:#fff8ea;padding:8px" />` : ""}
          <div class="lan-box">
            <p class="muted" style="margin:0 0 6px">Share this exact GTKY link — not localhost if they’re on another phone.</p>
            <code>${escapeHtml(joinUrl(room.code))}</code>
          </div>
          ${
            room.role === "host"
              ? `<div class="host-rules">
                  <p class="hello">Host controls</p>
                  <button class="button ${getPartyRules(room).lockDeep ? "button--dark" : ""}" data-act="rule" data-value="lockDeep">${getPartyRules(room).lockDeep ? "Deep is locked" : "Allow Deep"}</button>
                  <button class="button ${getPartyRules(room).skipAllowed ? "button--dark" : ""}" data-act="rule" data-value="skipAllowed">${getPartyRules(room).skipAllowed ? "Skip is kind" : "Skip off"}</button>
                  <button class="button ${getPartyRules(room).dares ? "button--dark" : ""}" data-act="rule" data-value="dares">${getPartyRules(room).dares ? "Dares on" : "Dares off"}</button>
                </div>`
              : ""
          }
          <div class="question-actions" style="justify-content:center;margin-top:1.2rem">
            <button class="button button--dark button--large" data-act="open-shelf">Open the bookcase →</button>
            <button class="button" data-act="copy-party">Copy code</button>
            <button class="button" data-act="copy-link">Copy join link</button>
            <button class="button" data-act="leave-party">Leave party</button>
          </div>
        </div>
      </main>
    `;
    return;
  }
  app.innerHTML = `
    ${siteHeader({ title: "Join or create", actions: backActions() })}
    <main class="lobby-screen">
      <div class="spark-rain" aria-hidden="true">${Array.from({ length: 14 }, (_, i) => `<span style="left:${6 + i * 6.5}%;animation-delay:${i * 0.18}s">${i % 2 ? "♡" : "✦"}</span>`).join("")}</div>
      <div class="container" style="position:relative;z-index:1">
        <header class="section-heading enter" style="text-align:center">
          <p class="hello">Party time</p>
          <h1>Join or create.</h1>
          <p class="muted">One of you makes the room. Everyone else types the code.</p>
        </header>
        <div class="lobby-grid">
          <form id="create-party" class="lobby-card">
            <p class="hello">Create a party</p>
            <h2>Host the bookcase.</h2>
            <div class="field">
              <label for="size">Party size</label>
              <select id="size" name="size">
                ${[1, 2, 3, 4, 5, 6, 8].map((n) => `<option value="${n}" ${n === 2 ? "selected" : ""}>${n === 1 ? "Just me (friends can still join later)" : n + " people"}</option>`).join("")}
              </select>
            </div>
            <button class="button button--dark button--large button-wide" type="submit">Create party</button>
          </form>
          <form id="join-party" class="lobby-card">
            <p class="hello">Join a party</p>
            <h2>Got a code?</h2>
            <div class="field">
              <label for="code">Party code</label>
              <input id="code" name="code" value="${escapeHtml(joinCode || remembered)}" maxlength="8" placeholder="7X4K9" style="text-transform:uppercase;letter-spacing:.18em" required />
            </div>
            <button class="button button--dark button--large button-wide" type="submit">Join →</button>
            <label class="muted" style="display:flex;gap:8px;align-items:center;margin-top:10px">
              <input type="checkbox" name="watch" /> I’m just watching
            </label>
          </form>
        </div>
        ${
          remembered
            ? `<div class="question-actions" style="justify-content:center;margin-top:1.2rem">
                <button class="button button--dark" data-act="rejoin">I’m still here · ${escapeHtml(remembered)}</button>
                <button class="button" data-act="rehost">Host that code again</button>
              </div>`
            : ""
        }
        <p class="muted center" style="margin-top:1.4rem">Playing as ${escapeHtml(name || "…")}. ${location.hostname === "localhost" || location.hostname === "127.0.0.1" ? "This is a local address — phones on Wi‑Fi need your computer’s LAN URL." : ""}</p>
      </div>
    </main>
  `;
}

function levelChoices(name = "level") {
  return ["surface", "personal", "deep", "together", "random"]
    .map(
      (id) => `
      <label class="level-chip">
        <input type="radio" name="${name}" value="${id}" ${id === "surface" ? "checked" : ""} hidden />
        ${levelDot(id)} ${LEVELS[id].label}
        <small>${LEVELS[id].blurb}</small>
      </label>`
    )
    .join("");
}

function renderPlay() {
  const entering = shelfEnter;
  shelfEnter = false;
  const albums = listAlbums();
  const keep = KEEPSAKES.map((book) => {
    const cls = [
      "book",
      "book--star",
      "book--keepsake",
      book.wide ? "book--wide" : "",
      book.set ? "book--set" : "",
      book.love ? "book--love" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const style = book.love ? "" : `style="background:${book.color}"`;
    return `<button type="button" class="${cls}" ${style} data-act="keepsake" data-value="${escapeHtml(book.title)}" aria-label="${escapeHtml(book.title)} by ${escapeHtml(book.author)}">
      <b>${escapeHtml(book.title)}</b><small>${escapeHtml(book.author)}</small>
    </button>`;
  }).join("");
  const blanks = (n, seed) =>
    blankBooks(n, seed)
      .map((book) => `<span class="book book--blank" style="background:${book.color};height:${book.height}px"></span>`)
      .join("");
  const gameRow = (label, games, seed) => `
    <p class="shelf-label">${label}</p>
    <div class="shelf-row">
      ${games
        .map((book) => {
          const cls = `book book--play${book.featured ? " book--featured" : ""}`;
          return `<button type="button" class="${cls}" style="background:${book.color}" data-act="pull-book" data-value="${book.id}" aria-label="${escapeHtml(book.title)}. ${escapeHtml(book.kicker)}">
            <b>${escapeHtml(book.title)}</b><small>${escapeHtml(book.kicker)}</small>
          </button>`;
        })
        .join("")}
      ${blanks(14, seed)}
    </div>`;
  const albumSpines = Array.from({ length: 10 }, (_, i) => {
    const album = albums[i];
    if (album) {
      return `<button type="button" class="book book--album book--play" style="background:${album.color}" data-act="album-open-shelf" data-value="${escapeHtml(album.id)}" aria-label="${escapeHtml(album.title)}"><b>${escapeHtml(album.title)}</b></button>`;
    }
    const blank = blankBooks(1, i + 9)[0];
    return `<button type="button" class="book book--album book--play" style="background:${blank.color};height:${blank.height}px" data-act="album-new" aria-label="Blank album"></button>`;
  }).join("");
  const partyLine = room?.code
    ? `Party ${room.code} · ${room.members.map((m) => m.name).join(", ")}`
    : "Start or join a party from the lobby.";
  app.innerHTML = `
    ${siteHeader({ title: "Bookshelf", actions: backActions() })}
    <main class="play-room ${entering ? "is-entering" : ""}">
      <div class="container">
        <header class="play-intro">
          <p class="hello">${escapeHtml(partyLine)}</p>
          <h1>Pick a spine.</h1>
          <p>Singleplayer on the big case. Together games for the party. Albums on the skinny shelf.</p>
          <div class="question-actions" style="justify-content:center;margin-top:12px">
            <button class="button" data-act="close-book">Close the book</button>
          </div>
        </header>
        <div class="bookshelf-stage shelf-hall">
          <div>
            <div class="bookshelf">
              <p class="shelf-label">Keepsakes</p>
              <div class="shelf-row">${lastNightBook(getLastNight())}${keep}${blanks(8, 1)}</div>
              ${gameRow("Singleplayer", SOLO_GAMES, 2)}
              ${gameRow("Together", TOGETHER_GAMES, 3)}
            </div>
            <p class="play-caption">${escapeHtml(shelfNote)}</p>
          </div>
          <div class="bookshelf bookshelf--skinny">
            <div class="album-head">
              <button type="button" class="shelf-label" data-act="album-open-shelf" style="background:none;border:0;color:#f3c56a;cursor:pointer">Albums!</button>
              <span>
                <button type="button" class="tape-btn" data-act="album-import">Import</button>
                <button type="button" class="tape-btn" data-act="album-export">Export</button>
                <button type="button" class="tape-btn tape-clear" data-act="album-clear">(clear albums)</button>
              </span>
            </div>
            <div class="shelf-row">${albumSpines}${blanks(8, 4)}</div>
            <p class="play-caption" style="font-size:0.95rem">Tap a blank spine to title a new book.</p>
          </div>
        </div>
        <input id="album-import" class="file-hidden" type="file" accept="application/json" />
        <input id="album-photo-file" class="file-hidden" type="file" accept="image/*" />
      </div>
    </main>
  `;
}

function renderAlbums() {
  const albums = listAlbums();
  const album = albumId ? getAlbum(albumId) : null;
  app.innerHTML = `
    ${siteHeader({ title: "Albums!", actions: shelfBack() })}
    <main class="screen container" style="padding-bottom:8rem">
      ${pendingNav ? "" : ""}
      ${albumStudioHTML({
        albums,
        filter: albumFilter,
        album,
        spread: albumSpread,
        tray: albumTray,
        selected: albumSelected,
        creating: albumCreating,
      })}
      <input id="album-import" class="file-hidden" type="file" accept="application/json" />
      <input id="album-photo-file" class="file-hidden" type="file" accept="image/*" />
    </main>
  `;
}

function questionBlock(card, actions) {
  const meta = card ? categoryMeta(card.level, card.category) : null;
  if (!card) return `<p class="muted">No questions loaded.</p>`;
  return `
    <article class="question-card idle-wiggle">
      <span class="question-level ${card.level}">${meta.emoji} ${meta.label}</span>
      <h2>${escapeHtml(card.question)}</h2>
      <p>Take your time. There isn’t a wrong answer.</p>
      ${nightTools(card)}
      <div class="question-actions">${actions}</div>
    </article>`;
}

function renderRoulette() {
  if (!session || session.mode !== "evenodd") session = startRoulette();
  const her = getPlayer2Name() || "her";
  const me = getPlayerName() || "you";
  const skip = settings().skipAllowed;
  const variant = VARIANTS[session.variant];

  let body = "";
  if (session.phase === "pick-variant") {
    body = `
      <header class="section-heading enter">
        <p class="hello">Even &amp; Odd</p>
        <h1>She picks a side.</h1>
        <p class="muted">You automatically get the other. Then a 1–32 wheel decides who answers.</p>
      </header>
      <div class="level-list">
        ${Object.values(VARIANTS)
          .map(
            (item) => `
          <button class="level" data-act="roulette-variant" data-value="${item.id}">
            <div class="level-top"><strong>${item.label}</strong></div>
            <p>${item.blurb}</p>
            <span class="level-count">This one →</span>
          </button>`
          )
          .join("")}
      </div>`;
  } else if (session.phase === "pick-side") {
    body = `
      <header class="section-heading enter">
        <p class="hello">${variant.label}</p>
        <h1>What does she pick?</h1>
        <p class="muted">The moment she chooses, you take the other side. No take-backs, that’s the fun.</p>
      </header>
      <div class="field">
        <label for="her-name">Her name</label>
        <input id="her-name" name="her" maxlength="32" value="${escapeHtml(getPlayer2Name())}" placeholder="her name" />
      </div>
      <div class="sides">
        ${variant.sides
          .map(
            (side) => `
          <button class="side-pick" type="button" data-act="roulette-side" data-value="${side.id}">
            <strong>${side.label}</strong>
            <small>${side.hint}</small>
          </button>`
          )
          .join("")}
      </div>`;
  } else if (session.phase === "show" && session.current) {
    const who = session.answerer === "her" ? her : me;
    const landed = sideLabel(session.variant, variant.matches(session.number, session.herSide) ? session.herSide : session.mySide);
    body = `
      <p class="who-card">
        <span class="hello">The wheel landed on ${session.number} · ${landed}</span>
        <strong>${escapeHtml(who)} answers.</strong>
      </p>
      ${questionBlock(
        session.current,
        `<button class="button button--dark button--large" data-act="roulette-answer">I answered</button>
         ${skip ? `<button class="button button--large" data-act="roulette-skip">Skip →</button>` : ""}
         <button class="button" data-act="pause">Pause</button>`
      )}`;
  } else {
    const pockets = Array.from({ length: 32 }, (_, i) => {
      const n = i + 1;
      const angle = i * (360 / 32) + 360 / 64;
      return `<span class="pocket" style="transform:rotate(${angle}deg);color:${variant.ink(n)}">${n}</span>`;
    }).join("");
    body = `
      <div class="roulette-wrap">
        <div class="who-card">
          <span class="hello">${variant.label}</span>
          <strong>${escapeHtml(her)} has ${sideLabel(session.variant, session.herSide)}.</strong>
          <p class="muted" style="margin:0.4rem 0 0">You have ${sideLabel(session.variant, session.mySide)}. If it lands on her side, she answers. If it lands on yours, you do.</p>
        </div>
        <div class="roulette-scene">
          <div class="roulette-pointer" aria-hidden="true"></div>
          <div class="roulette ${session.spinning ? "spinning" : ""}" style="background:conic-gradient(${rouletteGradient(session.variant)});transform:rotate(${session.rotation}deg)">
            ${pockets}
          </div>
          <div class="roulette-hub">${session.number || "1–32"}</div>
        </div>
        <button class="button button--dark button--large" data-act="roulette-spin" ${session.spinning ? "disabled" : ""}>${session.spinning ? "Spinning…" : "Spin the wheel"}</button>
        <button class="button" data-act="roulette-reset">Change the bet</button>
        <button class="button" data-act="pause">Pause</button>
      </div>`;
  }

  app.innerHTML = `
    ${siteHeader({ title: "Even & Odd", actions: shelfBack() })}
    <main class="screen container">${body}</main>
  `;
}

function renderSip() {
  if (!session || session.mode !== "sip") session = startSip();
  const skip = settings().skipAllowed;
  app.innerHTML = `
    ${siteHeader({ title: "One Page", actions: shelfBack() })}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">One Page</p>
        <h1>Just this.</h1>
      </header>
      ${questionBlock(
        session.current,
        `<button class="button button--dark button--large" data-act="sip-next">I answered · another page</button>
         ${skip ? `<button class="button button--large" data-act="sip-skip">Skip →</button>` : ""}
         <a class="button" href="#/play">Back to the shelf</a>`
      )}
    </main>
  `;
}

function renderNightstand() {
  if (!session || session.mode !== "nightstand") session = startNightstand();
  const skip = settings().skipAllowed;
  if (session.phase === "done") {
    app.innerHTML = `
      ${siteHeader({ title: "The Nightstand", actions: shelfBack() })}
      <main class="screen container">
        <section class="question-card">
          <p class="hello">Lights out</p>
          <h1>That’s three.</h1>
          <p>The nightstand is cleared. Pull another book whenever you want.</p>
          <div class="question-actions">
            <a class="button button--dark button--large" href="#/play">Back to the shelf</a>
          </div>
        </section>
      </main>
    `;
    return;
  }
  app.innerHTML = `
    ${siteHeader({ title: "The Nightstand", actions: shelfBack() })}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">The Nightstand · ${session.index + 1} of ${session.queue.length}</p>
        <h1>Before the light goes out.</h1>
      </header>
      ${questionBlock(
        session.current,
        `<button class="button button--dark button--large" data-act="nightstand-next">${session.index === session.queue.length - 1 ? "I answered · lights out" : "I answered"}</button>
         ${skip ? `<button class="button button--large" data-act="nightstand-skip">Skip →</button>` : ""}
         <button class="button" data-act="pause">Pause</button>`
      )}
    </main>
  `;
}

function renderMug() {
  if (!session || session.mode !== "mug") session = startMug();
  const me = getPlayerName() || "You";
  const her = getPlayer2Name() || "her";
  const card = session.current;
  const meta = card ? categoryMeta(card.level, card.category) : null;
  let body = "";
  if (session.phase === "p1") {
    body = `
      <p class="hello">${escapeHtml(me)} drinks first</p>
      <h1>Same mug. Same question.</h1>
      <article class="question-card">
        <span class="question-level ${card.level}">${meta.emoji} ${meta.label}</span>
        <h2>${escapeHtml(card.question)}</h2>
        ${starterChips("mug-answer")}
        <label class="field" style="display:block">
          <span class="muted">Your answer</span>
          <textarea id="mug-answer" rows="4" required></textarea>
        </label>
        <div class="question-actions">
          <button class="button button--dark button--large" data-act="mug-submit">Pass the mug →</button>
        </div>
      </article>`;
  } else if (session.phase === "handoff") {
    body = handoffLock(her, "mug-go", "Don’t peek. Same mug, same question.");
  } else if (session.phase === "p2") {
    body = `
      <p class="hello">${escapeHtml(her)}’s sip</p>
      <h1>Same question.</h1>
      <article class="question-card">
        <span class="question-level ${card.level}">${meta.emoji} ${meta.label}</span>
        <h2>${escapeHtml(card.question)}</h2>
        ${starterChips("mug-answer")}
        <label class="field" style="display:block">
          <span class="muted">Her answer</span>
          <textarea id="mug-answer" rows="4" required></textarea>
        </label>
        <div class="question-actions">
          <button class="button button--dark button--large" data-act="mug-submit">Read both →</button>
        </div>
      </article>`;
  } else {
    body = `
      <header class="section-heading">
        <p class="hello">Both cups</p>
        <h1>${escapeHtml(card.question)}</h1>
      </header>
      <div class="reveal-grid two">
        <article class="question-card">
          <p class="hello">${escapeHtml(me)}</p>
          <p>${escapeHtml(session.a1)}</p>
        </article>
        <article class="question-card">
          <p class="hello">${escapeHtml(her)}</p>
          <p>${escapeHtml(session.a2)}</p>
        </article>
      </div>
      <div class="question-actions">
        <button class="button button--dark" data-act="stamp-round">Stamp into album</button>
        <button class="button button--dark button--large" data-act="mug-again">Another mug</button>
        <a class="button" href="#/play">Back to the shelf</a>
      </div>`;
  }
  app.innerHTML = `
    ${siteHeader({ title: "Pass the Mug", actions: shelfBack() })}
    <main class="screen container">${body}</main>
  `;
}

function renderDeck() {
  if (!session || session.mode !== "deck") {
    app.innerHTML = `
      ${siteHeader({ title: "The Deck", actions: shelfBack() })}
      <main class="screen container">
        <header class="section-heading enter">
          <p class="hello">01 — The Deck</p>
          <h1>Choose your deck.</h1>
          <p class="muted">Shuffle a stack, draw a card, and talk. Skip anything you don’t want to answer.</p>
        </header>
        <div class="level-list">
          ${["surface", "personal", "deep", "together", "random"]
            .map(
              (id) => `
            <button class="level level--${id}" data-act="start-deck" data-value="${id}">
              <div class="level-top"><strong>${LEVELS[id].label}</strong>${levelDot(id)}</div>
              <h3>${LEVELS[id].blurb}</h3>
              <span class="level-count">Draw a card →</span>
            </button>`
            )
            .join("")}
        </div>
      </main>
    `;
    return;
  }

  const card = session.current;
  const meta = card ? categoryMeta(card.level, card.category) : null;
  const skip = settings().skipAllowed;
  const level = card?.level || "surface";
  app.innerHTML = `
    ${siteHeader({ title: "The Deck", actions: shelfBack() })}
    <main class="screen container">
      <div class="play-layout">
        ${sideStats("Cards left", session.remaining.length)}
        <article class="game-shell">
          <header class="game-toolbar">
            <span class="game-status"><span class="status-dot ${level}"></span>${card ? LEVELS[card.level].label : "Ready"}</span>
            <span>${session.discarded.length + (card ? 1 : 0)} answered · ${session.skipped?.length || 0} saved for later</span>
          </header>
          <div class="game-body">
            ${settings().timer && card ? timerBar() : ""}
            <div class="card-stage">
              <div class="deck-stack">
                <div class="stack-card"></div>
                <div class="stack-card"></div>
                <div class="stack-card"></div>
                <article class="playing-card ${card && session.flipped ? "flipped" : ""}">
                  <div class="face face-front">
                    <p class="card-logo">GTKY</p>
                    <p>?</p>
                    <p class="muted">Tap draw</p>
                  </div>
                  <div class="face face-back">
                    <span class="question-level ${level}">${meta ? `${meta.label}` : "GTKY"}</span>
                    <h2 class="card-q">${card ? escapeHtml(card.question) : "Draw a card to begin."}</h2>
                    <p class="muted">${card ? "Take your time. There isn’t a wrong answer." : `${session.remaining.length} waiting`}</p>
                    ${
                      card
                        ? `<div class="doodle-layer"><canvas></canvas><button type="button" class="chip doodle-clear" data-act="doodle-clear">Erase</button></div>`
                        : ""
                    }
                  </div>
                </article>
              </div>
            </div>
            <div class="question-actions">
              ${
                card
                  ? `                    <button class="button button--dark button--large" data-act="deck-answer">I answered</button>
                     ${skip ? `<button class="button button--large" data-act="deck-skip">Skip for later →</button>` : ""}
                     <button class="button" data-act="pause">Pause</button>`
                  : `<button class="button button--dark button--large" data-act="draw">Draw card</button>
                     <button class="button button--large" data-act="reshuffle">Shuffle leftovers</button>
                     <button class="button" data-act="reset-deck">Reset cards</button>
                     <button class="button" data-act="pause">Pause</button>`
              }
            </div>
          </div>
        </article>
      </div>
    </main>
  `;
}

function renderWheel() {
  if (!session || session.mode !== "wheel") {
    app.innerHTML = `
      ${siteHeader({ title: "The Wheel", actions: shelfBack() })}
      <main class="screen container">
        <header class="section-heading enter">
          <p class="hello">02 — The Wheel</p>
          <h1>Spin the level.</h1>
          <p class="muted">You don’t choose the depth. The wheel does.</p>
        </header>
        <div class="level-list">
          ${Object.values(PRESETS)
            .map(
              (p) => `
            <button class="level" data-act="start-wheel" data-value="${p.id}">
              <div class="level-top"><strong>${p.label}</strong><span class="mode-icon" style="width:42px;height:42px;font-size:1.2rem;margin:0">🎡</span></div>
              <p>${p.blurb}</p>
              <span class="level-count">Spin →</span>
            </button>`
            )
            .join("")}
        </div>
      </main>
    `;
    return;
  }

  const card = session.current;
  const meta = card ? categoryMeta(card.level, card.category) : null;
  const skip = settings().skipAllowed;
  app.innerHTML = `
    ${siteHeader({ title: "The Wheel", actions: shelfBack() })}
    <main class="screen container">
      <div class="play-layout">
        ${sideStats("Preset", PRESETS[session.preset].label)}
        <article class="game-shell">
          <header class="game-toolbar">
            <span class="game-status"><span class="status-dot ${card?.level || "surface"}"></span>${card ? LEVELS[card.level].label : "Spin"}</span>
            <span>${PRESETS[session.preset].label}</span>
          </header>
          <div class="game-body">
            ${
              card
                ? `${settings().timer ? timerBar() : ""}
                   <article class="question-card idle-wiggle">
                     <span class="question-level ${card.level}">${meta.emoji} ${meta.label}</span>
                     <h2>${escapeHtml(card.question)}</h2>
                     <p>Take your time. There isn’t a wrong answer.</p>
                     <div class="question-actions">
                       <button class="button button--dark button--large" data-act="wheel-answer">I answered</button>
                       ${skip ? `<button class="button button--large" data-act="wheel-skip">Skip →</button>` : ""}
                       <button class="button" data-act="pause">Pause</button>
                     </div>
                   </article>`
                : `<div class="wheel-wrap">
                     <div class="wheel-scene">
                       <div class="pointer"></div>
                       <div class="wheel ${session.spinning ? "spinning" : ""}" style="background:conic-gradient(${wheelGradient(session.preset)});transform:rotate(${session.rotation}deg)"></div>
                       <div class="wheel-hub">SPIN</div>
                     </div>
                     <ul class="wheel-legend">
                       <li><span class="dot surface"></span> Surface</li>
                       <li><span class="dot personal"></span> Personal</li>
                       <li><span class="dot deep"></span> Deep</li>
                       <li><span class="dot together"></span> Together</li>
                     </ul>
                     <button class="button button--dark button--large" data-act="spin" ${session.spinning ? "disabled" : ""}>${session.spinning ? "Spinning…" : "Spin"}</button>
                     <button class="button" data-act="pause">Pause</button>
                   </div>`
            }
          </div>
        </article>
      </div>
    </main>
  `;
}

function renderDuo() {
  if (!session || session.mode !== "duo") {
    const p1 = getPlayerName() || "Player 1";
    const p2 = getPlayer2Name();
    const localHint = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    app.innerHTML = `
      ${siteHeader({ title: "Two of Us", actions: shelfBack() })}
      <main class="screen container">
        <div class="duo-layout">
          <header class="section-heading enter">
            <p class="hello">03 — Two of Us</p>
            <h1>What if you had to guess their answer?</h1>
            <p class="muted">One phone, or two. Host a party, send her the code (or a QR), and you each answer on your own screen.</p>
          </header>
          <div class="lobby-grid">
            <form id="duo-join" class="duo-card">
              <div class="player">
                <h3>Join her party</h3>
                <p class="muted">She started a game. Type the five-letter code.</p>
                <div class="field">
                  <label for="code">Room code</label>
                  <input id="code" name="code" value="${escapeHtml(joinCode)}" maxlength="8" placeholder="7X4K9" style="text-transform:uppercase;letter-spacing:.2em" />
                </div>
                <button class="button button--dark button-wide" type="submit">Join →</button>
              </div>
            </form>
            <form id="duo-setup" class="duo-card">
              <div class="player">
                <div class="field" style="margin:0">
                  <label for="player1">Your name</label>
                  <input id="player1" name="player1" value="${escapeHtml(p1)}" required maxlength="32" />
                </div>
              </div>
              <div class="duo-heart">♡</div>
              <div class="player">
                <div class="field" style="margin:0">
                  <label for="player2">Her name (if sharing a phone)</label>
                  <input id="player2" name="player2" value="${escapeHtml(p2)}" placeholder="Anna" maxlength="32" />
                </div>
              </div>
              <div class="player">
                <h3>How are you playing?</h3>
                <div class="style-grid">
                  <label class="style-chip selected">
                    <input type="radio" name="together" value="local" checked hidden />
                    One phone
                    <small>Pass it back and forth.</small>
                  </label>
                  <label class="style-chip">
                    <input type="radio" name="together" value="party" hidden />
                    Two phones
                    <small>You host. She joins with a code.</small>
                  </label>
                </div>
                ${localHint ? `<p class="muted">For two phones, both need the same GTKY link (not 127.0.0.1). Use your computer’s Wi‑Fi address or the GitHub Pages URL.</p>` : ""}
              </div>
              <div class="player">
                <h3>Depth</h3>
                <div class="level-row">${levelChoices("level")}</div>
              </div>
              <div class="player">
                <h3>Question style</h3>
                <div class="style-grid">
                  ${Object.values(STYLES)
                    .map(
                      (s) => `
                    <label class="style-chip">
                      <input type="radio" name="style" value="${s.id}" ${s.id === "mix" ? "checked" : ""} hidden />
                      ${s.label}
                      <small>${s.blurb}</small>
                    </label>`
                    )
                    .join("")}
                </div>
              </div>
              <div class="player">
                <button class="button button--dark button--large button-wide" type="submit">Start →</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    `;
    bindSelectableChips();
    return;
  }

  if (session.phase === "lobby") {
    renderDuoPartyLobby();
    return;
  }

  if (session.phase === "waiting" || session.phase === "note-waiting") {
    renderWaiting();
    return;
  }

  if (session.phase === "note-handoff" || session.phase === "note-write" || session.phase === "note-reveal") {
    renderNotes();
    return;
  }

  const style = STYLES[session.currentStyle];
  const skip = settings().skipAllowed;

  if (session.phase === "handoff") {
    const name = session.turn === 1 ? session.player1 : session.player2;
    app.innerHTML = `
      ${siteHeader({ title: "Two of Us", actions: shelfBack() })}
      <main class="screen container">
        ${handoffLock(name, "duo-begin", `Round ${session.round} · ${style.label}. Keep the screen to yourself.`)}
        ${skip ? `<div class="question-actions" style="justify-content:center;margin-top:1rem"><button class="button" data-act="duo-skip">Skip this round →</button></div>` : ""}
      </main>
    `;
    return;
  }

  if (session.phase === "answer") {
    const seat = session.online ? mySeat(session) : session.turn;
    const q = session.online ? (seat === 1 ? session.q1 : session.q2) : questionForTurn(session);
    const name = session.online ? (seat === 1 ? session.player1 : session.player2) : (session.turn === 1 ? session.player1 : session.player2);
    const prompt = session.online ? promptForPlayer(session, seat) : promptForTurn(session);
    const meta = q ? categoryMeta(q.level, q.category) : { emoji: "", label: "" };
    const already = session.online && ((seat === 1 && session.ready1) || (seat === 2 && session.ready2));
    if (already) {
      renderWaiting();
      return;
    }
    app.innerHTML = `
      ${siteHeader({ title: "Two of Us", actions: shelfBack() })}
      <main class="screen container">
        <article class="game-shell">
          <header class="game-toolbar">
            <span class="game-status"><span class="status-dot ${q?.level || "personal"}"></span>${escapeHtml(name)} · ${style.label} ${session.online ? `<span class="online-pill">live</span>` : ""}</span>
            <span>Round ${session.round}</span>
          </header>
          <div class="game-body">
            ${settings().timer ? timerBar() : ""}
            <article class="question-card">
              <span class="question-level ${q?.level || "personal"}">${meta.label}</span>
              <h2 style="white-space:pre-wrap">${escapeHtml(prompt)}</h2>
              ${
                q?.choices
                  ? `<div class="choice-grid">
                      ${q.choices
                        .map((c) => `<button class="choice-btn button" type="button" data-act="choose" data-value="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
                        .join("")}
                     </div>`
                  : `<div class="composer">
                      <textarea id="duo-answer" class="composer-input" placeholder="Your turn…" autocomplete="off"></textarea>
                      <button class="send" type="button" data-act="duo-submit" aria-label="Lock in">↑</button>
                    </div>
                    ${starterChips("duo-answer")}`
              }
              <div class="question-actions">
                ${q?.choices ? `<button class="button button--dark button--large" data-act="duo-submit">Lock in</button>` : ""}
                ${skip ? `<button class="button" data-act="duo-skip">Skip →</button>` : ""}
              </div>
            </article>
          </div>
        </article>
      </main>
    `;
    return;
  }

  const scored = session.scored || { kind: session.currentStyle };
  const q1 = session.q1;
  const q2 = session.q2;
  let banner = "Both answers, side by side.";
  if (scored.kind === "predict") banner = scored.matched ? "You matched." : "Not quite — still a good conversation.";
  if (scored.kind === "match") banner = scored.same ? "You both chose the same." : "You think differently.";
  if (scored.kind === "connect") banner = "Connected questions.";

  const matched = (scored.kind === "predict" && scored.matched) || (scored.kind === "match" && scored.same);
  app.innerHTML = `
    ${siteHeader({ title: "Two of Us", actions: shelfBack() })}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">Reveal · ${style.label}</p>
        <h2 class="match-banner ${matched ? "is-match" : ""}">${banner}</h2>
      </header>
      <article class="duo-card">
        <div class="player">
          <div class="player-name"><span>${escapeHtml(session.player1)}</span><span>${scored.kind === "predict" ? "Prediction" : "Answer"}</span></div>
          <p class="muted">${escapeHtml(q1?.question || "")}</p>
          <div class="answer">${escapeHtml(session.a1)}</div>
        </div>
        <div class="player player--blue">
          <div class="player-name"><span>${escapeHtml(session.player2)}</span><span>Answer</span></div>
          <p class="muted">${escapeHtml(q2?.question || "")}</p>
          <div class="answer">${escapeHtml(session.a2)}</div>
        </div>
      </article>
      ${scored.kind === "match" && !scored.same ? `<p class="center" style="margin-top:1.2rem">Why?</p>` : ""}
      <div class="question-actions" style="justify-content:center">
        <button class="button button--dark button--large" data-act="duo-next">Next round →</button>
        <button class="button button--deep button--large" data-act="duo-wrap">Notes + About Us zine</button>
        <button class="button" data-act="pause">Pause</button>
      </div>
    </main>
  `;
}

function renderDuoPartyLobby() {
  const waiting = session.peerStatus === "waiting" || session.peerStatus === "hosting" || session.peerStatus === "connecting";
  app.innerHTML = `
    ${siteHeader({ title: "Party", actions: shelfBack() })}
    <main class="screen container">
      <section class="handoff enter">
        <span class="pass-stamp">${session.role === "host" ? "Host" : "Joining"}</span>
        <h2>${waiting ? "Waiting for her…" : session.error ? "Couldn’t connect" : "Connected"}</h2>
        ${waitingPup()}
        ${session.roomCode ? `<p class="ticket">${escapeHtml(session.roomCode)}</p>` : ""}
        <p class="muted">${session.error || (session.role === "host" ? "She opens GTKY, taps Two of Us, and types that code — or scans the QR." : "Hold on while we find the room.")}</p>
        ${session.qr ? `<div class="qr-wrap"><img alt="Join QR code" src="${session.qr}"/><button class="button" data-act="copy-code">Copy code</button></div>` : `<button class="button" data-act="copy-code">Copy code</button>`}
        ${location.hostname === "localhost" || location.hostname === "127.0.0.1" ? `<p class="muted">This QR uses ${escapeHtml(location.host)}. Her phone needs the same site over Wi‑Fi, not localhost.</p>` : ""}
      </section>
    </main>
  `;
}

function renderWaiting() {
  const other = mySeat(session) === 1 ? session.player2 : session.player1;
  app.innerHTML = `
    ${siteHeader({ title: "Two of Us", actions: shelfBack() })}
    <main class="screen container">
      <section class="handoff enter">
        <span class="pass-stamp">live</span>
        <h2 class="waiting-dots">Waiting for ${escapeHtml(other)}</h2>
        ${waitingPup()}
        <p class="muted">You locked yours in. They’re still writing.</p>
      </section>
    </main>
  `;
}

function renderZine() {
  const journal = activeZine || (zinePayload && decodeZine(zinePayload)) || session?.journal || getZines()[0];
  if (!journal) {
    app.innerHTML = `
      ${siteHeader({ title: "About us", actions: backActions() })}
      <main class="screen container"><div class="empty muted">No About Us zine yet. Play Two of Us and wrap up with notes.</div></main>
    `;
    return;
  }
  activeZine = journal;
  const pages = [
    { title: "About us", body: `<h2>${escapeHtml(journal.p1)} & ${escapeHtml(journal.p2)}</h2><p>A GTKY zine of answers you actually gave each other.</p>` },
    ...(journal.entries || []).map((entry, i) => ({
      title: `Page ${i + 1}`,
      body: `<p class="hello">${escapeHtml(journal.p1)}</p><p class="q">${escapeHtml(entry.q1?.question || "")}</p><p>${escapeHtml(entry.a1 || "")}</p><p class="hello" style="margin-top:1.2rem">${escapeHtml(journal.p2)}</p><p class="q">${escapeHtml(entry.q2?.question || "")}</p><p>${escapeHtml(entry.a2 || "")}</p>`,
    })),
    { title: "Notes", body: `<p class="q">${escapeHtml(journal.notes?.n1 || "—")}</p><p class="hello">${escapeHtml(journal.p1)} → ${escapeHtml(journal.p2)}</p><p class="q" style="margin-top:1.4rem">${escapeHtml(journal.notes?.n2 || "—")}</p><p class="hello">${escapeHtml(journal.p2)} → ${escapeHtml(journal.p1)}</p>` },
  ];
  const page = pages[Math.min(zinePage, pages.length - 1)];
  if (!zineQr) {
    const packed = zineUrl(journal);
    const target = packed.tooLong ? window.location.href.split("#")[0] + "#/zine" : packed.url;
    makeQrDataUrl(target).then((url) => {
      zineQr = url;
      if (route === "zine") render();
    });
  }
  app.innerHTML = `
    ${siteHeader({ title: "About us", actions: backActions() })}
    <main class="screen container">
      <div class="zine-stage">
        <article class="polaroid">
          <p class="hello">${escapeHtml(page.title)}</p>
          ${page.body}
        </article>
      </div>
      <div class="question-actions" style="justify-content:center">
        <button class="button" data-act="zine-prev">←</button>
        <button class="button button--dark" data-act="zine-next">Flip page →</button>
      </div>
      <div class="qr-wrap">
        ${zineQr ? `<img alt="Download QR" src="${zineQr}"/>` : `<p class="muted">Drawing a QR…</p>`}
        <p class="muted">Scan to open this zine, or download a cute HTML keepsake.</p>
        <button class="button button--dark" data-act="download-zine">Download About Us</button>
      </div>
    </main>
  `;
}

function renderNotes() {
  if (session.phase === "note-handoff") {
    const name = session.turn === 1 ? session.player1 : session.player2;
    const other = session.turn === 1 ? session.player2 : session.player1;
    app.innerHTML = `
      ${siteHeader({ title: "A little note", actions: backActions() })}
      <main class="screen container">
        <section class="handoff enter">
          <span class="pass-stamp">Private</span>
          <h2>Pass to ${escapeHtml(name)}</h2>
          <p class="muted">Write something only ${escapeHtml(other)} will see. They can skip if they’d rather not.</p>
          <button class="button button--dark button--large" data-act="duo-begin">I’m ${escapeHtml(name)}</button>
        </section>
      </main>
    `;
    return;
  }

  if (session.phase === "note-write") {
    const seat = session.online ? mySeat(session) : session.turn;
    if (session.online && ((seat === 1 && session.ready1) || (seat === 2 && session.ready2))) {
      renderWaiting();
      return;
    }
    const name = seat === 1 ? session.player1 : session.player2;
    const other = seat === 1 ? session.player2 : session.player1;
    app.innerHTML = `
      ${siteHeader({ title: "A little note", actions: backActions() })}
      <main class="screen container">
        <article class="question-card enter">
          <span class="question-level deep">For ${escapeHtml(other)}</span>
          <h2>${escapeHtml(name)}, leave a note.</h2>
          <p class="muted">A thank-you, a secret, a “I liked when you said…” — whatever you want them to keep.</p>
          <div class="field">
            <label for="duo-note">Your note</label>
            <textarea id="duo-note" maxlength="400" placeholder="Dear ${escapeHtml(other)}…" autocomplete="off"></textarea>
          </div>
          <div class="question-actions">
            <button class="button button--dark button--large" data-act="duo-note-submit">Seal it</button>
            <button class="button" data-act="duo-note-skip">Skip →</button>
          </div>
        </article>
      </main>
    `;
    return;
  }

  const n1 = session.note1 || "(no note this time)";
  const n2 = session.note2 || "(no note this time)";
  app.innerHTML = `
    ${siteHeader({ title: "Keepsakes", actions: backActions() })}
    <main class="screen container">
      <div class="envelope" aria-hidden="true">
        <div class="envelope-flap"></div>
        <div class="hearts"><span>♡</span><span>♡</span><span>♡</span><span>♡</span></div>
      </div>
      <header class="section-heading center" style="margin-inline:auto">
        <h2>Notes for each other.</h2>
        <p>These stay on this device, in Statistics, if you want to read them again.</p>
      </header>
      <div class="reveal-grid two">
        <article class="note-letter">
          <p class="hello">From ${escapeHtml(session.player1)} → ${escapeHtml(session.player2)}</p>
          <p>${escapeHtml(n1)}</p>
        </article>
        <article class="note-letter">
          <p class="hello">From ${escapeHtml(session.player2)} → ${escapeHtml(session.player1)}</p>
          <p>${escapeHtml(n2)}</p>
        </article>
      </div>
      <div class="question-actions" style="justify-content:center">
        <button class="button button--dark button--large" data-act="open-zine">Open About Us zine</button>
        <a class="button button--large" href="#/">Back home</a>
      </div>
    </main>
  `;
}

function renderStats() {
  const stats = getStats();
  const total = totalAnswered(stats);
  const notes = getNotes();
  app.innerHTML = `
    ${siteHeader({ title: "Statistics", actions: backActions() })}
    <main class="screen container">
      <header class="section-heading">
        <p class="hello">Your GTKY</p>
        <h1>Questions answered</h1>
        <p class="display" style="font-size:3.4rem;margin:0 0 1rem">${total}</p>
      </header>
      <div class="stats-grid">
        <div class="stat"><b>${stats.answered.surface}</b><span>Surface</span></div>
        <div class="stat"><b>${stats.answered.personal}</b><span>Personal</span></div>
        <div class="stat"><b>${stats.answered.deep}</b><span>Deep</span></div>
        <div class="stat"><b>${stats.answered.together || 0}</b><span>Together</span></div>
        <div class="stat"><b>${stats.duoSessions}</b><span>Two of Us</span></div>
        <div class="stat"><b>${stats.wheelSpins}</b><span>Wheel spins</span></div>
        <div class="stat"><b>${stats.cardsDrawn}</b><span>Cards drawn</span></div>
        <div class="stat"><b>${stats.predictTotal ? Math.round((stats.predictMatches / stats.predictTotal) * 100) : 0}%</b><span>Predict matches</span></div>
        <div class="stat"><b>${getZines().length}</b><span>About Us zines</span></div>
      </div>
      ${
        getZines().length
          ? `<h2 style="margin-top:2.4rem">About Us</h2>
             <div class="question-actions">
               <button class="button button--dark" data-act="open-zine">Open latest zine</button>
             </div>`
          : ""
      }
      ${
        notes.length
          ? `<h2 style="margin-top:2.4rem">Keepsakes</h2>
             <div class="library-list" style="margin-top:1rem">
               ${notes
                 .slice(0, 8)
                 .map(
                   (note) => `
                 <article class="note-letter">
                   <p class="hello">From ${escapeHtml(note.from)} → ${escapeHtml(note.to)}</p>
                   <p>${escapeHtml(note.text)}</p>
                 </article>`
                 )
                 .join("")}
             </div>`
          : ""
      }
    </main>
  `;
}

function renderSettings() {
  const s = settings();
  const name = getPlayerName();
  app.innerHTML = `
    ${siteHeader({ title: "Settings", actions: backActions() })}
    <main class="screen container">
      <section class="panel enter">
        <h2>Player</h2>
        <form id="guest-form">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" name="name" value="${escapeHtml(name)}" maxlength="32" />
          </div>
          <button class="button" type="submit">Save name</button>
        </form>
        <h2 style="margin-top:28px">Appearance</h2>
        <div class="actions-row three">
          ${["light", "dark", "system"]
            .map(
              (id) =>
                `<button class="button ${s.theme === id ? "button--dark" : ""}" data-act="theme" data-value="${id}">${id[0].toUpperCase() + id.slice(1)}</button>`
            )
            .join("")}
        </div>
        <h2 style="margin-top:28px">Audio</h2>
        ${toggleRow("music", "Music", s.music)}
        ${toggleRow("sfx", "Sound effects", s.sfx)}
        <h2 style="margin-top:28px">Gameplay</h2>
        ${toggleRow("timer", "Timer", s.timer)}
        ${toggleRow("skipAllowed", "Skip allowed", s.skipAllowed)}
        ${toggleRow("animations", "Animations", s.animations)}
        <h2 style="margin-top:28px">Two of Us</h2>
        ${toggleRow("predictionScoring", "Prediction scoring", s.predictionScoring)}
        ${toggleRow("revealAnimations", "Reveal animations", s.revealAnimations)}
        <h2 style="margin-top:28px">Hidden questions</h2>
        ${vetoListHTML()}
      </section>
    </main>
  `;
}

function toggleRow(key, label, on) {
  return `
    <div class="setting-row">
      <span>${escapeHtml(label)}</span>
      <button class="toggle ${on ? "on" : ""}" data-act="toggle" data-value="${key}" aria-pressed="${on}" aria-label="${escapeHtml(label)}"></button>
    </div>
  `;
}

function renderLibrary() {
  app.innerHTML = `
    ${siteHeader({ title: "Library", actions: backActions() })}
    <main class="screen container">
      <header class="section-heading">
        <h1>Question library</h1>
        <p class="muted">Browse before you play. Skip still exists in-game, always.</p>
      </header>
      <div class="library-filters">
        ${["surface", "personal", "deep", "together"]
          .map(
            (id) =>
              `<button class="button ${libraryLevel === id ? "button--dark" : ""}" data-act="library-level" data-value="${id}">${LEVELS[id].label}</button>`
          )
          .join("")}
      </div>
      <div class="field">
        <label for="library-search">Search</label>
        <input id="library-search" placeholder="proud, travel, love…" />
      </div>
      <div class="library-list" id="library-list"></div>
    </main>
  `;
  renderLibraryList("");
}

function dailySparkBlock() {
  const spark = dailySpark();
  if (!spark) return "";
  return `<div class="spark-card">
    <p class="hello">Daily spark</p>
    <p>${escapeHtml(spark.question)}</p>
    <button class="chip" data-act="pin-later" data-value="${escapeHtml(spark.id)}">Save for later</button>
  </div>`;
}

function renderNightGames() {
  if (!session || session.mode !== route) beginNight(route);
  const html = renderNight(route, {
    session,
    skip: skipOn(),
    me: getPlayerName() || "You",
    her: getPlayer2Name() || "them",
    roster: nightPeople(),
  });
  if (html) app.innerHTML = html;
  const timer = app.querySelector(".postcard-timer");
  if (timer) {
    const ends = Number(timer.dataset.ends);
    const tick = () => {
      const left = Math.max(0, Math.ceil((ends - Date.now()) / 1000));
      timer.textContent = `${left}s`;
      if (left <= 0) {
        window.clearInterval(timer._id);
        if (session?.mode === "postcards" && (session.phase === "p1" || session.phase === "p2")) {
          lockPostcard(session, session.phase === "p1" ? 1 : 2, document.getElementById("postcard-text")?.value || "(time)");
          render();
        }
      }
    };
    tick();
    timer._id = window.setInterval(tick, 250);
  }
}

function renderLibraryList(query) {
  const q = query.trim().toLowerCase();
  const items = getAllQuestions()
    .filter((item) => item.level === libraryLevel)
    .filter((item) => !q || item.question.toLowerCase().includes(q) || item.category.includes(q));
  const list = document.querySelector("#library-list");
  if (!list) return;
  if (!items.length) {
    list.innerHTML = `<div class="empty muted">No questions match that search.</div>`;
    return;
  }
  list.innerHTML = items
    .map((item) => {
      const meta = categoryMeta(item.level, item.category);
      return `<article class="library-item"><span class="category-chip">${meta.label} · intensity ${item.intensity}</span><p>${escapeHtml(item.question)}</p>
        <div class="night-tools">
          <button type="button" class="chip" data-act="pin-later" data-value="${escapeHtml(item.id)}">For later</button>
          <button type="button" class="chip" data-act="veto-q" data-value="${escapeHtml(item.id)}">Hide this one</button>
        </div></article>`;
    })
    .join("");
}

function sideStats(label, value) {
  const stats = getStats();
  return `
    <aside class="panel side-panel desktop-only">
      <p class="hello">Players</p>
      <p><strong>${escapeHtml(getPlayerName())}</strong></p>
      ${session?.player2 ? `<p><strong>${escapeHtml(session.player2)}</strong></p>` : ""}
      <p class="muted" style="margin-top:1rem">${escapeHtml(label)}</p>
      <p class="display" style="font-size:2rem;margin:0">${escapeHtml(String(value))}</p>
      <p class="muted" style="margin-top:1rem">${stats.answered.surface} surface · ${stats.answered.personal} personal · ${stats.answered.deep} deep · ${stats.answered.together || 0} together</p>
    </aside>
  `;
}

function timerBar() {
  return `<div class="timer on"><span style="animation-duration:60s"></span></div>`;
}

function bindSelectableChips() {
  app.querySelectorAll(".level-chip, .style-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const name = chip.querySelector("input")?.name;
      app.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
        input.closest("label")?.classList.remove("selected");
      });
      chip.classList.add("selected");
    });
    if (chip.querySelector("input")?.checked) chip.classList.add("selected");
  });
}
