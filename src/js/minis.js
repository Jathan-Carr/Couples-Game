import { getAllQuestions, pickRandom } from "./questions.js";
import { recordAnswer } from "./statistics.js";

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function startSip() {
  return {
    mode: "sip",
    phase: "show",
    current: pickRandom(getAllQuestions()),
  };
}

export function nextSip(session) {
  if (session.current) recordAnswer(session.current.level);
  session.current = pickRandom(getAllQuestions());
}

export function skipSip(session) {
  session.current = pickRandom(getAllQuestions());
}

export function startNightstand() {
  const queue = shuffle(getAllQuestions()).slice(0, 3);
  return {
    mode: "nightstand",
    phase: "show",
    queue,
    index: 0,
    current: queue[0] || null,
  };
}

export function advanceNightstand(session, didAnswer) {
  if (didAnswer && session.current) recordAnswer(session.current.level);
  session.index += 1;
  if (session.index >= session.queue.length) {
    session.phase = "done";
    session.current = null;
    return;
  }
  session.current = session.queue[session.index];
}

export function startMug() {
  return {
    mode: "mug",
    phase: "p1",
    current: pickRandom(getAllQuestions()),
    a1: "",
    a2: "",
  };
}

export function submitMug(session, text) {
  const answer = String(text || "").trim();
  if (!answer) return false;
  if (session.phase === "p1") {
    session.a1 = answer;
    session.phase = "handoff";
    return true;
  }
  if (session.phase === "handoff") {
    session.phase = "p2";
    return true;
  }
  session.a2 = answer;
  if (session.current) recordAnswer(session.current.level);
  session.phase = "done";
  return true;
}

export function anotherMug(session) {
  Object.assign(session, startMug());
}
