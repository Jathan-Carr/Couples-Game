export const SOLO_GAMES = [
  { id: "deck", title: "The Deck", kicker: "draw a card", color: "#7a4e32" },
  { id: "wheel", title: "The Wheel", kicker: "let it choose", color: "#c4842c" },
  { id: "sip", title: "One Page", kicker: "just one question", color: "#6b8a4a" },
  { id: "nightstand", title: "The Nightstand", kicker: "three, then lights out", color: "#2c4a6b" },
  { id: "coffee", title: "Coffee Stains", kicker: "surface, cozy", color: "#c47a50" },
  { id: "midnight", title: "Midnight Chapter", kicker: "deep only", color: "#3d2418" },
  { id: "morning", title: "Morning Page", kicker: "one with coffee", color: "#c4842c" },
  { id: "letter", title: "Unopened Letter", kicker: "seal for a week", color: "#5a2c48" },
  { id: "later", title: "For Later", kicker: "the flinch pile", color: "#4a3a6b" },
  { id: "category", title: "Category Night", kicker: "one shelf only", color: "#2c4a6b" },
];

export const TOGETHER_GAMES = [
  { id: "duo", title: "Two of Us", kicker: "guess & match", color: "#5a2c48" },
  { id: "evenodd", title: "Even & Odd", kicker: "roulette 1–32", color: "#1f2a44", featured: true },
  { id: "mug", title: "Pass the Mug", kicker: "same question, both", color: "#8a5a3c" },
  { id: "dare", title: "Truth or Dare", kicker: "kind slips", color: "#8a2f1e" },
  { id: "hotseat", title: "Hot Seat", kicker: "five, then pass", color: "#c44a28" },
  { id: "never", title: "Never Have I", kicker: "fingers, then stories", color: "#3f4a8c" },
  { id: "bookmark", title: "The Bookmark", kicker: "plant a question", color: "#6b8a4a" },
  { id: "postcards", title: "Postcards", kicker: "sixty seconds each", color: "#5f82c4" },
  { id: "whosaid", title: "Who Said It", kicker: "old notes, new guess", color: "#7a4e32" },
  { id: "slowdance", title: "Slow Dance", kicker: "one deep question", color: "#3d2418" },
];

export const KEEPSAKES = [
  { title: "Firebird", author: "Kathy Tyers", color: "#8a2f1e", set: true },
  { title: "Fusion Fire", author: "Kathy Tyers", color: "#a33a22", set: true },
  { title: "Crown of Fire", author: "Kathy Tyers", color: "#c44a28", set: true },
  { title: "Letters of Enchantment", author: "Rebecca Ross", color: "#3f4a8c", wide: true },
  { title: "Six of Crows", author: "Leigh Bardugo", color: "#1f2a44", wide: true },
  { title: "A Time to Die", author: "Out of Time · Nadine Brandes", color: "#2c4a6b", set: true },
  { title: "A Time to Speak", author: "Out of Time · Nadine Brandes", color: "#3a5a7a", set: true },
  { title: "A Time to Rise", author: "Out of Time · Nadine Brandes", color: "#4a6a8a", set: true },
  { title: "The False Prince", author: "Jennifer A. Nielsen", color: "#5a2c48", wide: true },
  { title: "(I love you)", author: "for her", color: "love", love: true },
];

const BLANK_COLORS = [
  "#6b4e32", "#8a2f1e", "#c4842c", "#4a5a38", "#3d2418", "#5f82c4", "#7a4e32",
  "#2c4a6b", "#5a2c48", "#8a5a3c", "#c47a50", "#4a3a6b", "#1f2a44", "#6b8a4a",
  "#a33a22", "#3f4a8c", "#7a6248", "#c44a28", "#5a3828", "#2c3a4a",
];

export function blankBooks(count, seed = 0) {
  return Array.from({ length: count }, (_, i) => ({
    color: BLANK_COLORS[(i + seed) % BLANK_COLORS.length],
    height: 108 + ((i * 13 + seed * 5) % 42),
  }));
}

export function isPlaySession(name) {
  return ["deck", "wheel", "duo", "evenodd", "mug", "nightstand", "sip", "dare", "hotseat", "never", "bookmark", "postcards", "whosaid", "slowdance", "morning", "letter", "later", "category"].includes(name);
}

export function skipShelfMotion() {
  return (
    document.documentElement.classList.contains("no-anim") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
