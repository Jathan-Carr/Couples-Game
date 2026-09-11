import { byLevel, pickRandom } from "./questions.js";
import { recordAnswer, recordWheelSpin } from "./statistics.js";

export const PRESETS = {
  balanced: {
    id: "balanced",
    label: "Balanced",
    blurb: "Equal odds for every level.",
    weights: { surface: 25, personal: 25, deep: 25, together: 25 },
  },
  deeper: {
    id: "deeper",
    label: "Getting Deeper",
    blurb: "More personal, more deep.",
    weights: { surface: 15, personal: 30, deep: 30, together: 25 },
  },
  chaos: {
    id: "chaos",
    label: "Chaos",
    blurb: "The wheel leans into the deep end.",
    weights: { surface: 10, personal: 25, deep: 40, together: 25 },
  },
};

const ORDER = ["surface", "personal", "deep", "together"];

export function segments(preset) {
  const weights = PRESETS[preset]?.weights || PRESETS.balanced.weights;
  const total = ORDER.reduce((sum, level) => sum + (weights[level] || 0), 0);
  let start = 0;
  return ORDER.map((level) => {
    const sweep = (weights[level] / total) * 360;
    const seg = { level, start, sweep, end: start + sweep };
    start += sweep;
    return seg;
  });
}

export function wheelGradient(preset) {
  const segs = segments(preset);
  const colors = {
    surface: "var(--surface)",
    personal: "var(--personal)",
    deep: "var(--deep)",
    together: "var(--together)",
  };
  return segs.map((seg) => `${colors[seg.level]} ${seg.start}deg ${seg.end}deg`).join(", ");
}

export function startWheel(preset = "balanced") {
  return {
    mode: "wheel",
    preset,
    rotation: 0,
    spinning: false,
    current: null,
    lastLevel: null,
    phase: "ready",
  };
}

export function spinWheel(session) {
  const segs = segments(session.preset);
  const pick = Math.random() * 360;
  let level = "personal";
  for (const seg of segs) {
    if (pick >= seg.start && pick < seg.end) {
      level = seg.level;
      break;
    }
  }
  const extraTurns = 5 + Math.floor(Math.random() * 3);
  const pointer = 0;
  const targetCenter = segs.find((s) => s.level === level).start + segs.find((s) => s.level === level).sweep / 2;
  const landing = 360 - ((targetCenter - pointer + 360) % 360);
  const jitter = (Math.random() - 0.5) * Math.min(18, segs.find((s) => s.level === level).sweep * 0.4);
  session.rotation += extraTurns * 360 + landing + jitter - (session.rotation % 360);
  session.lastLevel = level;
  session.spinning = true;
  session.phase = "spinning";
  recordWheelSpin();
  return level;
}

export function revealWheelQuestion(session) {
  const card = pickRandom(byLevel(session.lastLevel));
  session.current = card;
  session.spinning = false;
  session.phase = "show";
  return card;
}

export function finishWheelQuestion(session, didAnswer) {
  if (didAnswer && session.current) recordAnswer(session.current.level);
  session.current = null;
  session.phase = "ready";
}
