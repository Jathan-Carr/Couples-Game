import { pickRandom, questionsForDuo, twoConnected } from "./questions.js";
import { recordAnswer, recordDuoSession, recordMatch, recordPredict } from "./statistics.js";
import { appendEntry, emptyJournal } from "./journal.js";

export const STYLES = {
  same: { id: "same", label: "Same", emoji: "💞", blurb: "You both answer the same question." },
  predict: { id: "predict", label: "Predict", emoji: "🪞", blurb: "Guess how they would answer." },
  different: { id: "different", label: "Different", emoji: "🔀", blurb: "Each of you gets a different question." },
  connect: { id: "connect", label: "Connect", emoji: "🤝", blurb: "Different questions, same category." },
  match: { id: "match", label: "Match", emoji: "🎯", blurb: "A binary choice. Do you pick alike?" },
  mix: { id: "mix", label: "Mix", emoji: "🎲", blurb: "A surprise mechanic each round." },
};

const STYLE_IDS = ["same", "predict", "different", "connect", "match"];

export function startDuo({ player1, player2, level, style, online = false, role = "local", roomCode = "" }) {
  recordDuoSession();
  return {
    mode: "duo",
    player1,
    player2,
    level,
    style,
    online,
    role,
    roomCode,
    peerStatus: online ? "hosting" : "idle",
    round: 0,
    phase: online ? "lobby" : "handoff",
    turn: 1,
    currentStyle: style === "mix" ? pickRandom(STYLE_IDS) : style,
    q1: null,
    q2: null,
    a1: "",
    a2: "",
    ready1: false,
    ready2: false,
    scored: null,
    note1: "",
    note2: "",
    journal: { ...emptyJournal(), p1: player1, p2: player2 },
  };
}

function nextStyle(session) {
  return session.style === "mix" ? pickRandom(STYLE_IDS) : session.style;
}

export function dealRound(session) {
  session.round += 1;
  session.currentStyle = nextStyle(session);
  session.a1 = "";
  session.a2 = "";
  session.scored = null;
  session.ready1 = false;
  session.ready2 = false;
  session.turn = 1;
  session.phase = session.online ? "answer" : "handoff";

  if (session.currentStyle === "connect") {
    const pair = twoConnected(session.level);
    if (pair) {
      [session.q1, session.q2] = pair;
      return session;
    }
    session.currentStyle = "different";
  }

  if (session.currentStyle === "different") {
    const pool = questionsForDuo(session.level, "different");
    session.q1 = pickRandom(pool);
    session.q2 = pickRandom(pool.filter((q) => q.id !== session.q1?.id)) || session.q1;
    return session;
  }

  if (session.currentStyle === "match") {
    const pool = questionsForDuo(session.level, "match").filter((q) => q.choices?.length === 2);
    const card = pickRandom(pool) || pickRandom(questionsForDuo(session.level, "same"));
    session.q1 = card;
    session.q2 = card;
    return session;
  }

  const pool = questionsForDuo(session.level, session.currentStyle);
  const card = pickRandom(pool);
  session.q1 = card;
  session.q2 = card;
  return session;
}

export function questionForTurn(session) {
  return session.turn === 1 ? session.q1 : session.q2;
}

export function promptForTurn(session) {
  const q = questionForTurn(session);
  if (!q) return "";
  if (session.currentStyle === "predict" && session.turn === 1) {
    return `What do you think ${session.player2}'s answer is?\n\n${q.question}`;
  }
  return q.question;
}

export function submitTurn(session, answer) {
  if (session.turn === 1) {
    session.a1 = answer;
    session.turn = 2;
    session.phase = "handoff";
    return;
  }
  session.a2 = answer;
  session.phase = "reveal";
  if (session.q1) recordAnswer(session.q1.level);
  if (session.q2 && session.q2.id !== session.q1?.id) recordAnswer(session.q2.level);
  appendEntry(session);
}

export function promptForPlayer(session, seat) {
  const q = seat === 1 ? session.q1 : session.q2;
  if (!q) return "";
  if (session.currentStyle === "predict" && seat === 1) {
    return `What do you think ${session.player2}'s answer is?\n\n${q.question}`;
  }
  return q.question;
}

export function mySeat(session) {
  return session.role === "guest" ? 2 : 1;
}

export function lockAnswer(session, seat, answer) {
  if (seat === 1) {
    session.a1 = answer;
    session.ready1 = true;
  } else {
    session.a2 = answer;
    session.ready2 = true;
  }
  if (session.ready1 && session.ready2) {
    session.phase = "reveal";
    if (session.q1) recordAnswer(session.q1.level);
    if (session.q2 && session.q2.id !== session.q1?.id) recordAnswer(session.q2.level);
    appendEntry(session);
    return "reveal";
  }
  session.phase = "waiting";
  return "waiting";
}

export function beginOnlineNotes(session) {
  session.phase = "note-write";
  session.ready1 = false;
  session.ready2 = false;
}

export function lockNote(session, seat, text) {
  const cleaned = String(text || "").trim();
  if (seat === 1) {
    session.note1 = cleaned;
    session.ready1 = true;
  } else {
    session.note2 = cleaned;
    session.ready2 = true;
  }
  if (session.ready1 && session.ready2) {
    session.phase = "note-reveal";
    return "reveal";
  }
  session.phase = "note-waiting";
  return "waiting";
}

export function scoreReveal(session, settings) {
  if (session.currentStyle === "predict" && settings.predictionScoring) {
    const matched = normalize(session.a1) === normalize(session.a2) && session.a1.trim() !== "";
    recordPredict(matched);
    return { kind: "predict", matched };
  }
  if (session.currentStyle === "match") {
    const same = session.a1 && session.a1 === session.a2;
    recordMatch(same);
    return { kind: "match", same };
  }
  return { kind: session.currentStyle };
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function skipRound(session) {
  session.phase = "handoff";
  dealRound(session);
}

export function beginNotes(session) {
  session.phase = "note-handoff";
  session.turn = 1;
}

export function openNote(session) {
  session.phase = "note-write";
}

export function submitNote(session, text) {
  const cleaned = String(text || "").trim();
  if (session.turn === 1) {
    session.note1 = cleaned;
    session.turn = 2;
    session.phase = "note-handoff";
    return;
  }
  session.note2 = cleaned;
  session.phase = "note-reveal";
}
