const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const suits = ["h", "c", "d", "s"];

const allCards = ranks.flatMap((h) => suits.map((s) => `${h}${s}`));
export { ranks, suits, allCards };
