import { pickRandom, getAllQuestions } from "./questions.js";
import { recordAnswer, recordWheelSpin } from "./statistics.js";

export const VARIANTS = {
  evenodd: {
    id: "evenodd",
    label: "Evens or Odds",
    blurb: "She picks even or odd. You automatically get the other.",
    sides: [
      { id: "even", label: "Evens", hint: "2, 4, 6 … 32" },
      { id: "odd", label: "Odds", hint: "1, 3, 5 … 31" },
    ],
    matches(n, side) {
      return side === "even" ? n % 2 === 0 : n % 2 === 1;
    },
    color(n) {
      return n % 2 === 0 ? "#f3c56a" : "#3d2418";
    },
    ink(n) {
      return n % 2 === 0 ? "#3d2418" : "#fff8ea";
    },
  },
  highlow: {
    id: "highlow",
    label: "High or Low",
    blurb: "Low is 1–16. High is 17–32.",
    sides: [
      { id: "low", label: "Low", hint: "1–16" },
      { id: "high", label: "High", hint: "17–32" },
    ],
    matches(n, side) {
      return side === "low" ? n <= 16 : n >= 17;
    },
    color(n) {
      return n <= 16 ? "#e8b44a" : "#5f82c4";
    },
    ink(n) {
      return n <= 16 ? "#3d2418" : "#fff8ea";
    },
  },
  redblack: {
    id: "redblack",
    label: "Red or Black",
    blurb: "Odds wear red. Evens wear black.",
    sides: [
      { id: "red", label: "Red", hint: "odd numbers" },
      { id: "black", label: "Black", hint: "even numbers" },
    ],
    matches(n, side) {
      return side === "red" ? n % 2 === 1 : n % 2 === 0;
    },
    color(n) {
      return n % 2 === 1 ? "#8a2f1e" : "#1a1410";
    },
    ink() {
      return "#fff8ea";
    },
  },
};

export function startRoulette() {
  return {
    mode: "evenodd",
    phase: "pick-variant",
    variant: "evenodd",
    herSide: null,
    mySide: null,
    number: null,
    rotation: 0,
    spinning: false,
    current: null,
    answerer: null,
  };
}

export function otherSide(variant, side) {
  const sides = VARIANTS[variant].sides;
  return sides.find((item) => item.id !== side)?.id || sides[0].id;
}

export function chooseVariant(session, variant) {
  session.variant = VARIANTS[variant] ? variant : "evenodd";
  session.herSide = null;
  session.mySide = null;
  session.phase = "pick-side";
}

export function chooseSide(session, herSide) {
  session.herSide = herSide;
  session.mySide = otherSide(session.variant, herSide);
  session.phase = "ready";
  session.number = null;
  session.current = null;
  session.answerer = null;
}

export function spinRoulette(session) {
  const n = 1 + Math.floor(Math.random() * 32);
  session.number = n;
  const pocket = 360 / 32;
  const extraTurns = 5 + Math.floor(Math.random() * 3);
  const landing = 360 - ((n - 1) * pocket + pocket / 2);
  session.rotation += extraTurns * 360 + landing - (session.rotation % 360);
  session.spinning = true;
  session.phase = "spinning";
  recordWheelSpin();
  return n;
}

export function resolveSpin(session) {
  const variant = VARIANTS[session.variant];
  session.spinning = false;
  session.answerer = variant.matches(session.number, session.herSide) ? "her" : "me";
  session.current = pickRandom(getAllQuestions());
  session.phase = "show";
  return session.current;
}

export function finishRoulette(session, didAnswer) {
  if (didAnswer && session.current) recordAnswer(session.current.level);
  session.current = null;
  session.answerer = null;
  session.phase = "ready";
}

export function rouletteGradient(variantId) {
  const variant = VARIANTS[variantId] || VARIANTS.evenodd;
  const pocket = 360 / 32;
  return Array.from({ length: 32 }, (_, i) => {
    const n = i + 1;
    return `${variant.color(n)} ${i * pocket}deg ${(i + 1) * pocket}deg`;
  }).join(", ");
}

export function sideLabel(variantId, side) {
  return VARIANTS[variantId]?.sides.find((item) => item.id === side)?.label || side;
}
