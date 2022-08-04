import { allCards } from "./cards.js";
import { HANDS } from "./enums.js";
import evaluator from "./evaluator.js";

/* eslint-disable */
self.onmessage = ({ data: { hands, fullBoard } }) => {
  analyze(hands, fullBoard, self.postMessage, self.close);
}; /* eslint-enable */

/**
 * Analyze the situation
 * @param {*} hands Hands of the players, array of array of string, each string being a card, eg. [["As", "Ad"], ["Jc", "Qh"]]
 * @param {*} fullBoard Board of the game, array of string, each string being a card, empty string for no card, eg. ["Ks", "Ts", "", "", ""]
 * @returns The analyse of the situation
 */
export function analyze(hands, fullBoard, postMessage, close) {
  const fullHands = hands.filter((h) => h.every((c) => c !== ""));
  if (fullHands.length < 2) {
    postMessage([]);
    return;
  }
  const board = fullBoard.filter((c) => c !== "");
  const analysis = hands.map((hand, i) => {
    return {
      key: i,
      wins: 0,
      ties: 0,
      hand,
      iterations: 0,
      levels: {
        ...Object.keys(HANDS).reduce(
          (acc, curr) => ({ ...acc, [curr]: 0 }),
          {}
        ),
      },
    };
  });
  const analysisWithHands = analysis.filter((a) =>
    a.hand.every((c) => c !== "")
  );

  const maxIterations = 1_000_000;
  const numberOfCardsToCompleteBoard = 7 - fullHands[0].length - board.length;
  const deadCards = [...hands.flatMap((h) => h), ...board];
  const possibleCards = allCards.filter((c) => !deadCards.includes(c));
  const drawnCardsList = [];
  if (numberOfCardsToCompleteBoard === 2) {
    // For the turn and river, we check all combinations
    drawnCardsList.push(
      ...possibleCards.flatMap((c1) => {
        return possibleCards.filter((c2) => c1 !== c2).map((c2) => [c1, c2]);
      })
    );
  } else if (numberOfCardsToCompleteBoard === 1) {
    // If we only need the river, we check each card
    drawnCardsList.push(...possibleCards.map((c) => [c]));
  } else if (numberOfCardsToCompleteBoard >= 3) {
    for (let i = 0; i < maxIterations; i++) {
      // For more, we check a maximum of maxIterations random combinations
      const drawnCards = new Set();
      do {
        drawnCards.add(
          possibleCards[Math.floor(Math.random() * possibleCards.length)]
        );
      } while (drawnCards.size < numberOfCardsToCompleteBoard);
      drawnCardsList.push(Array.from(drawnCards));
    }
  } else if (numberOfCardsToCompleteBoard === 0) {
    drawnCardsList.push([]);
  }

  let i = 0;
  for (let drawnCards of drawnCardsList) {
    const handEvals = analysisWithHands.map((p) =>
      evaluator.evaluate(p.hand, [...board, ...drawnCards])
    );
    handEvals.sort((a, b) => a.handValue - b.handValue).reverse();
    const winningEvals = handEvals.filter(
      (e) => e.handValue === handEvals[0].handValue
    );
    const iterations = i;
    analysisWithHands.forEach((p) => {
      p.iterations = iterations + 1;
      const handEval = handEvals.find((e) => e.pocketCards === p.hand);
      p.levels[handEval.levelValue] = p.levels[handEval.levelValue] + 1;
    });
    const winningHands = analysisWithHands.filter((h) =>
      winningEvals.some((e) => e.pocketCards === h.hand)
    );
    if (winningHands.length > 1) {
      winningHands.forEach((h) => h.ties++);
    } else {
      winningHands.forEach((h) => h.wins++);
    }
    if (i > 0 && (i + 1) % 10000 === 0) {
      postMessage(analysis);
    }
    i++;
  }
  postMessage(analysis);
  close();
}
