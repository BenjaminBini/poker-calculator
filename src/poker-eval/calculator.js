import evaluate7cards from "../eval/evaluator7.js";
import { rankCodes, suitCodes } from "../eval/hand-code.js";
import { handRank } from "../eval/hand-rank.js";
import {
  combinations,
  combinationsCount,
  shuffleArray,
} from "../utils/Utils.js";
import { allCards } from "./cards.js";

/**
 * Analyze the situation
 * @param {*} pocketCards Hands of the players, array of array of string, each string being a card, eg. [["As", "Ad"], ["Jc", "Qh"]]
 * @param {*} fullBoard Board of the game, array of string, each string being a card, empty string for no card, eg. ["Ks", "Ts", "", "", ""]
 * @param {*} callback Callback function called every 100k iterations, with the analysis result as parameter
 * @param {*} done Function called when the analysis is done
 * @returns The analysis of the situation
 */
export function analyze(pocketCards, fullBoard, callback, done) {
  const t0 = performance.now();

  // We check first if there is at least 2 full hands (hands with 2 cards)
  const fullHands = pocketCards.filter((h) => h.every((c) => c !== ""));
  if (fullHands.length < 2) {
    callback([]);
    return;
  }

  // We filter the fullBoard to get only cards that are on the board
  const board = fullBoard.filter((c) => c !== "");
  // We compute the number of cards necessary to complete the board (which is 5 minus the number of cards on the board)
  const numberOfCardsToCompleteBoard = 5 - board.length;
  // The dead cards are the pocket cards and the cards on the board
  const deadCards = [...pocketCards.flatMap((h) => h), ...board];
  // The remainding cards are all the cards minus the dead cards
  const remainingDeck = allCards.filter((c) => !deadCards.includes(c));
  // We compute the number of boards that can be made with the remaining cards
  const boardCount = combinationsCount(
    remainingDeck.length,
    numberOfCardsToCompleteBoard
  );

  // Let's initiate our analysis object, which will be returned by the function
  let analysis = pocketCards.map((pockets) => {
    return {
      iterations: 1, // number of boards analyzed
      wins: 0, // number of wins for all the iterations tested
      ties: 0, // same for ties
      pocketCards: pockets, // the pocket cards of the player
      totalIterations: boardCount, // the total number of iterations that will be tested
      handRanks: [0, 0, 0, 0, 0, 0, 0, 0, 0], // the rank of the hand for all iterations tested (from index 0 to 8, 0 being straight flush and 8 being high card)
    };
  });
  callback(analysis); // We send the analysis to the callback function a first time (to initialize the progress bar)

  // We will only run the analyis for the hand with 2 cards set
  const analysisWithHands = analysis.filter((a) =>
    a.pocketCards.every((c) => c !== "")
  );

  // Let's draw all boards first
  let boards = [];
  const t1 = performance.now();
  console.log((t1 - t0) / 1000 + "s - Start drawing cards");
  // If the board is full, we add an empty array to the list of boards to be sure to run the analyis once
  if (numberOfCardsToCompleteBoard === 0) {
    boards.push([]);
  } else {
    // If the board is not full, we get all combinations of the remaining cards to create the boards
    boards = combinations(remainingDeck, numberOfCardsToCompleteBoard);
    // To have a good estimation before the end of the analyis, we shuffle the list of boards
    shuffleArray(boards);
  }
  const t2 = performance.now();
  console.log((t2 - t1) / 1000 + "s - End drawing cards");
  console.log(boards.length + " cards drawn");

  // We iterate through all the boards
  for (let [i, drawnCards] of boards.entries()) {
    analysisWithHands.forEach((p) => {
      // We evaluate all of the hands (pocket cards and board cards)
      p.handValue = evaluate7cards(
        ...[...p.pocketCards, ...board, ...drawnCards]
          .filter((c) => c)
          .map((h) => rankCodes[h[0]] | suitCodes[h[1]])
      );
      const level = handRank(p.handValue);
      p.handRanks[level] = p.handRanks[level] + 1;
    });

    // We get the be  st hand value (value of the winning hand)
    const bestHandValue = Math.min(
      ...analysisWithHands.map((e) => e.handValue)
    );
    // We look for the hands with the best hand value and update wins and ties
    analysisWithHands
      .filter((e) => e.handValue === bestHandValue)
      .forEach((hand, _, winningHands) => {
        winningHands.length > 1 ? hand.ties++ : hand.wins++;
      });

    // We call the callback function every 100k iterations
    if (i > 0 && i % 100000 === 0) {
      analysisWithHands.forEach((p) => (p.iterations = i));
      callback(analysis);
    }
  }
  // When finished, we update the iterations to the total number of iterations
  analysisWithHands.forEach((p) => (p.iterations = boards.length));
  const t3 = performance.now();
  console.log((t3 - t2) / 1000 + "s - End analyzing");

  // At least we call the callback function one last time with the final analysis and the done function
  callback(analysis);
  done();
}
