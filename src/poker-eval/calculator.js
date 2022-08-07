import evaluate7cards from "../eval/evaluator7.js";
import { rankCodes, suitCodes } from "../eval/hand-code.js";
import { handRank } from "../eval/hand-rank.js";
import { allCards } from "./cards.js";

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
  const t0 = performance.now();
  const fullHands = hands.filter((h) => h.every((c) => c !== ""));
  if (fullHands.length < 2) {
    postMessage([]);
    return;
  }
  const board = fullBoard.filter((c) => c !== "");
  const numberOfCardsToCompleteBoard = 5 - board.length;
  const deadCards = [...hands.flatMap((h) => h), ...board];
  const remainingDeck = allCards.filter((c) => !deadCards.includes(c));

  let analysis = hands.map((hand, i) => {
    return {
      key: i,
      wins: 0,
      ties: 0,
      hand,
      iterations: 1,
      totalIterations: combinationsCount(
        remainingDeck.length,
        numberOfCardsToCompleteBoard
      ),
      levels: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  });
  postMessage(analysis);
  const analysisWithHands = analysis.filter((a) =>
    a.hand.every((c) => c !== "")
  );

  let drawnCardsList = [];

  const t1 = performance.now();
  console.log((t1 - t0) / 1000 + "s - Start drawing cards");
  if (numberOfCardsToCompleteBoard === 0) {
    drawnCardsList.push([]);
  } else {
    drawnCardsList = combinations(remainingDeck, numberOfCardsToCompleteBoard);
    shuffleArray(drawnCardsList);
  }
  const t2 = performance.now();
  console.log((t2 - t1) / 1000 + "s - End drawing cards");
  console.log(drawnCardsList.length + " cards drawn");
  let i = 0;
  for (let drawnCards of drawnCardsList) {
    const iterations = i;
    analysisWithHands.forEach((p) => {
      p.iterations = iterations + 1;
      p.handValue = evaluate7cards(
        ...[...p.hand, ...board, ...drawnCards]
          .filter((c) => c)
          .map((h) => rankCodes[h[0]] | suitCodes[h[1]])
      );
      const level = handRank(p.handValue);
      p.levels[level] = p.levels[level] + 1;
    });
    const bestHandValue = Math.min(
      ...analysisWithHands.map((e) => e.handValue)
    );
    const winningEvals = analysisWithHands.filter(
      (e) => e.handValue === bestHandValue
    );
    const winningHands = analysisWithHands.filter((h) =>
      winningEvals.some((e) => e.hand === h.hand)
    );
    if (winningHands.length > 1) {
      winningHands.forEach((h) => h.ties++);
    } else {
      winningHands.forEach((h) => h.wins++);
    }
    if (i > 0 && (i + 1) % 100000 === 0) {
      postMessage(analysis);
    }
    i++;
  }
  const t3 = performance.now();
  console.log((t3 - t2) / 1000 + "s - End analyzing");
  postMessage(analysis);
  close();
}

function combinations(set, k) {
  var i, j, combs, head, tailcombs;

  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k === set.length) {
    return [set];
  }

  // There is N 1-sized subsets in a N-sized set.
  if (k === 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = combinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function productRange(a, b) {
  var prd = a,
    i = a;

  while (i++ < b) {
    prd *= i;
  }
  return prd;
}

function combinationsCount(n, r) {
  if (n === r || r === 0) {
    return 1;
  } else {
    r = r < n - r ? n - r : r;
    return productRange(r + 1, n) / productRange(1, n - r);
  }
}
