import { byLevel, pickRandom, playableQuestions, createDeck } from "./questions.js";
import { recordAnswer, getNotes } from "./statistics.js";
import { CATEGORIES } from "./categories.js";
import { getLater, unpinLater, getLetter, sealLetter, letterDue, getMorning, markMorning, morningDoneToday } from "./keeps.js";

export const NIGHT_IDS = [
  "dare",
  "hotseat",
  "never",
  "bookmark",
  "postcards",
  "whosaid",
  "slowdance",
  "morning",
  "letter",
  "later",
  "category",
  "close",
];

export const DARES = [
  { id: "seats", text: "Swap seats (or pillows) before the next question." },
  { id: "today-photo", text: "Show a photo from today — no scrolling back." },
  { id: "six-words", text: "Write a six-word note for them and read it aloud." },
  { id: "eyes", text: "Hold eye contact while they ask you anything they want." },
  { id: "three-lines", text: "Tell a story from this week in exactly three sentences." },
  { id: "portrait", text: "Draw them in twenty seconds. Keep the paper." },
  { id: "noticed", text: "Name three things you noticed about them today." },
  { id: "phones-down", text: "Both phones face-down until someone kindly skips." },
  { id: "face", text: "Recreate the last face they made. They judge the likeness." },
  { id: "compliment", text: "Give a compliment that has nothing to do with how they look." },
  { id: "hum", text: "Hum five seconds of a song that reminds you of them." },
  { id: "secret", text: "Trade one small secret you’re actually okay sharing." },
  { id: "favorite", text: "Point at something in the room you’d steal for them and say why." },
  { id: "hand", text: "Hold hands for the next answer, even if it’s a Surface question." },
  { id: "alias", text: "Answer the next question as if you were them." },
  { id: "margin", text: "Doodle in the margin while they think. No peeking at theirs." },
];

export function isNight(id) {
  return NIGHT_IDS.includes(id);
}

export function togetherNight(id) {
  return ["dare", "hotseat", "never", "bookmark", "postcards", "whosaid", "slowdance"].includes(id);
}

function card(opts = {}) {
  return pickRandom(playableQuestions(opts));
}

export function startNight(id, { me = "You", her = "them", roster = [], category = "" } = {}) {
  const people = roster.length ? roster : [me, her].filter(Boolean);
  if (id === "dare") {
    return { mode: "dare", phase: "pick", current: null, slip: null };
  }
  if (id === "hotseat") {
    return {
      mode: "hotseat",
      phase: "pick",
      seat: people[0] || me,
      people,
      left: 5,
      current: null,
    };
  }
  if (id === "never") {
    const fingers = Object.fromEntries(people.map((name) => [name, 5]));
    return {
      mode: "never",
      phase: "play",
      people,
      fingers,
      current: card({ level: "personal" }) || card(),
      out: [],
    };
  }
  if (id === "bookmark") {
    return {
      mode: "bookmark",
      phase: "plant1",
      choices: playableQuestions().slice().sort(() => Math.random() - 0.5).slice(0, 3),
      plant1: null,
      plant2: null,
      remaining: [],
      current: null,
      planted: false,
    };
  }
  if (id === "postcards") {
    return {
      mode: "postcards",
      phase: "p1",
      current: card() || pickRandom(byLevel("personal")),
      a1: "",
      a2: "",
      endsAt: Date.now() + 60000,
    };
  }
  if (id === "whosaid") {
    return { mode: "whosaid", phase: "ask", quiz: nextWho(), score: 0, total: 0 };
  }
  if (id === "slowdance") {
    return { mode: "slowdance", phase: "show", current: card({ level: "deep" }) };
  }
  if (id === "morning") {
    return { mode: "morning", phase: morningDoneToday() ? "done" : "show", current: card({ level: "surface" }), morning: getMorning() };
  }
  if (id === "letter") {
    const sealed = getLetter();
    if (!sealed) return { mode: "letter", phase: "pick", choices: playableQuestions({ level: "deep" }).slice(0, 3), letter: null };
    if (letterDue(sealed)) return { mode: "letter", phase: "open", letter: sealed, current: sealed.card };
    return { mode: "letter", phase: "sealed", letter: sealed };
  }
  if (id === "later") {
    return { mode: "later", phase: "list", current: null };
  }
  if (id === "category") {
    return { mode: "category", phase: "pick", category, remaining: [], current: null };
  }
  if (id === "close") {
    return { mode: "close", phase: "write", favoriteQ: "", favoriteA: "" };
  }
  return { mode: id, phase: "show" };
}

export function categoryList() {
  const list = [];
  for (const [level, cats] of Object.entries(CATEGORIES)) {
    for (const [id, meta] of Object.entries(cats)) {
      list.push({ id, level, ...meta });
    }
  }
  return list;
}

export function startCategory(session, category, level) {
  session.category = category;
  session.level = level;
  session.remaining = createDeck(level, { category });
  session.current = session.remaining.shift() || null;
  session.phase = session.current ? "show" : "empty";
  return session;
}

export function nextDare(session, kind) {
  if (kind === "dare") {
    session.slip = "dare";
    session.current = pickRandom(DARES);
  } else {
    session.slip = "truth";
    session.current = card() || pickRandom(byLevel("personal"));
  }
  session.phase = "show";
  return session;
}

export function hotseatQuestion(session) {
  session.current = card() || pickRandom(byLevel("personal"));
  session.phase = "show";
  return session;
}

export function finishHotseat(session, didAnswer) {
  if (didAnswer && session.current) recordAnswer(session.current.level);
  session.left -= 1;
  session.current = null;
  if (session.left <= 0) {
    session.phase = "pass";
    return session;
  }
  return hotseatQuestion(session);
}

export function passHotseat(session) {
  const idx = session.people.indexOf(session.seat);
  session.seat = session.people[(idx + 1) % session.people.length];
  session.left = 5;
  return hotseatQuestion(session);
}

export function neverPrompt(session) {
  session.current = card({ level: session.current?.level === "deep" ? "personal" : "random" }) || card();
  return session;
}

export function neverTap(session, name, has) {
  if (has) {
    session.fingers[name] = Math.max(0, (session.fingers[name] || 0) - 1);
    if (session.fingers[name] === 0 && !session.out.includes(name)) session.out.push(name);
  }
  if (session.current) recordAnswer(session.current.level);
  const alive = session.people.filter((person) => (session.fingers[person] || 0) > 0);
  if (alive.length <= 1 && session.people.length > 1) {
    session.phase = "done";
    session.winner = alive[0] || null;
    return session;
  }
  return neverPrompt(session);
}

export function plantBookmark(session, which, cardId) {
  const picked = session.choices.find((item) => item.id === cardId) || null;
  if (which === 1) {
    session.plant1 = picked;
    session.phase = "plant2";
    session.handoff = true;
    session.choices = playableQuestions()
      .filter((item) => item.id !== cardId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  } else {
    session.plant2 = picked;
    const extras = playableQuestions()
      .filter((item) => item.id !== session.plant1?.id && item.id !== session.plant2?.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    session.remaining = [session.plant1, session.plant2, ...extras].filter(Boolean).sort(() => Math.random() - 0.5);
    session.phase = "draw";
    session.current = session.remaining.shift() || null;
  }
  return session;
}

export function nextBookmark(session, didAnswer) {
  if (didAnswer && session.current) recordAnswer(session.current.level);
  session.planted =
    session.current && (session.current.id === session.plant1?.id || session.current.id === session.plant2?.id);
  session.current = session.remaining.shift() || null;
  if (!session.current) session.phase = "done";
  else session.phase = "draw";
  return session;
}

export function lockPostcard(session, who, text) {
  const answer = String(text || "").trim();
  if (!answer) return false;
  if (who === 1) {
    session.a1 = answer;
    session.phase = "handoff";
    session.endsAt = Date.now() + 60000;
    return true;
  }
  session.a2 = answer;
  session.phase = "reveal";
  if (session.current) recordAnswer(session.current.level);
  return true;
}

export function nextPostcard(session) {
  Object.assign(session, startNight("postcards"));
  return session;
}

function nextWho() {
  const notes = getNotes().filter((note) => note.text?.trim());
  if (notes.length < 1) return null;
  const note = pickRandom(notes);
  const names = [...new Set(notes.flatMap((item) => [item.from, item.to]).filter(Boolean))];
  const decoy = names.find((name) => name !== note.from) || "a friend";
  const options = [note.from, decoy].sort(() => Math.random() - 0.5);
  return { note, options };
}

export function guessWho(session, name) {
  if (!session.quiz) return session;
  session.total += 1;
  session.correct = name === session.quiz.note.from;
  if (session.correct) session.score += 1;
  session.phase = "reveal";
  return session;
}

export function anotherWho(session) {
  session.quiz = nextWho();
  session.phase = session.quiz ? "ask" : "empty";
  session.correct = null;
  return session;
}

export function nextSlow(session) {
  if (session.current) recordAnswer("deep");
  session.current = card({ level: "deep" });
  return session;
}

export function finishMorning(session) {
  if (session.current) {
    recordAnswer("surface");
    session.morning = markMorning(session.current);
  }
  session.phase = "done";
  return session;
}

export function pickLetter(session, cardId) {
  const picked = session.choices.find((item) => item.id === cardId) || card({ level: "deep" });
  session.letter = sealLetter(picked);
  session.phase = "sealed";
  return session;
}

export function drawLater(session, id) {
  const pile = getLater();
  session.current = id ? pile.find((item) => item.id === id) : pile[0];
  session.phase = session.current ? "show" : "list";
  return session;
}

export function answeredLater(session) {
  if (session.current) {
    recordAnswer(session.current.level);
    unpinLater(session.current.id);
  }
  session.current = null;
  session.phase = "list";
  return session;
}
