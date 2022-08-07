import { useState } from "react";

import Button from "./Button.js";
import CardButton from "./CardButton.js";
import CardPlaceHolder from "./CardPlaceHolder.js";
import CardSelector from "./CardSelector.js";
import { rankDescription } from "./eval/hand-rank.js";
import PlayerHand from "./PlayerHand.js";
import evaluator from "./poker-eval/evaluator.js";

function App() {
  const initialHands = [
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
  ];
  const initialBoard = ["", "", "", "", ""];
  const initialGame = {
    hands: initialHands,
    board: initialBoard,
  };
  const [game, setGame] = useState(initialGame);

  const [handEvals, setHandEvals] = useState([]);

  // The slot where the card will be added/modified
  // Index 1: 0 for board, 1-10 for hands
  // Index 2: Slot of the hand
  const [cardToEdit, setCardToEdit] = useState([1, 0]);

  const addCard = (card) => {
    setHandEvals([]);
    if (cardToEdit[0] === 0) {
      game.board[cardToEdit[1]] = card;
    } else {
      game.hands[cardToEdit[0] - 1][cardToEdit[1]] = card;
    }
    const nextEmptySlot = getNextEmptySlot();
    setCardToEdit([...nextEmptySlot]);
    computeEvals();
  };

  const resetCardFromHand = (i, j) => {
    game.hands[i - 1][j] = "";
    setCardToEdit([i, j]);
    setHandEvals([]);
    computeEvals();
  };

  const resetCardFromBoard = (i) => {
    game.board[i] = "";
    setCardToEdit([0, i]);
    setHandEvals([]);
    computeEvals();
  };

  const getNextEmptySlot = () => {
    const handEmptySlots = [];
    game.hands.forEach((h, i) => {
      h[0] === "" && handEmptySlots.push([i + 1, 0]);
      h[1] === "" && handEmptySlots.push([i + 1, 1]);
    });
    const boardEmptySlots = Object.keys(game.board)
      .filter((i) => game.board[i] === "")
      .map((i) => [0, parseInt(i)]);
    const allEmptySlots = [...boardEmptySlots, ...handEmptySlots];
    const firstHandEmptySlotAfterCurrent = handEmptySlots.find(
      (s) =>
        (s[0] === cardToEdit[0] && s[1] > cardToEdit[1]) || s[0] > cardToEdit[0]
    );
    if (
      cardToEdit[0] === 2 &&
      cardToEdit[1] === 1 &&
      boardEmptySlots.length > 0
    ) {
      return boardEmptySlots[0];
    }
    if (cardToEdit[0] > 0 && firstHandEmptySlotAfterCurrent) {
      return firstHandEmptySlotAfterCurrent;
    } else if (cardToEdit[0] === 1 && boardEmptySlots.length > 0) {
      return boardEmptySlots[0];
    } else if (allEmptySlots.length > 0) {
      return allEmptySlots[0];
    }
    return [-1, -1];
  };

  let [calculatorWorker, setCalculateWorker] = useState(null);

  const computeEvals = () => {
    if (calculatorWorker) {
      calculatorWorker.terminate();
    }
    const worker = new Worker(
      new URL("./poker-eval/calculator.js", import.meta.url)
    );
    setCalculateWorker(worker);
    worker.onmessage = (data) => {
      setHandEvals(data.data);
    };
    const payload = {
      hands: game.hands,
      fullBoard: game.board,
    };
    worker.postMessage(payload);
  };

  const getEval = (hand) => {
    if (hand.length === 2 && hand.every((c) => c !== "")) {
      return evaluator.evaluate(hand, game.board);
    }
    return null;
  };

  const reset = () => {
    const newGame = {
      hands: initialHands,
      board: initialBoard,
    };
    setGame(newGame);
    setHandEvals([]);
    if (calculatorWorker) {
      calculatorWorker.terminate();
    }
    setCardToEdit([1, 0]);
  };

  return (
    <div className="max-w-4xl m-auto my-4">
      <div className="mx-5">
        <h1 className="font-bold text-4xl mb-6 text-white">Poker calculator</h1>
        <div>
          <Button onClick={reset}>New hand</Button>
        </div>
        <div className="flex items-center space-x-2 dk:mb-6">
          <div className="w-full mt-2">
            <div className="text-slate-100 text-sm text-right italic mb-1">
              {handEvals.length > 0 ? (
                <span>
                  {handEvals[0].iterations.toLocaleString()} /{" "}
                  {handEvals[0].totalIterations.toLocaleString()} iterations
                </span>
              ) : (
                <div>Please pick at least 2 hands</div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width:
                    handEvals.length > 0
                      ? (handEvals[0].iterations /
                          handEvals[0].totalIterations) *
                          100 +
                        "%"
                      : 0,
                }}
              ></div>
            </div>
          </div>
        </div>
        <CardSelector addCard={addCard} game={game}></CardSelector>
        <div className=" dk:bg-slate-800 dk:shadow-2xl rounded-xl py-6 dk:py-20">
          <div className="flex flex-col-reverse items-start gap-4 dk:bg-green-600 dk:border-yellow-600 dk:border-[12px] dk:shadow-lg dk:mx-16 rounded-full dk:h-[300px] relative">
            <div className="hidden dk:block absolute top-0 bottom-0 left-0 right-0  border-2 rounded-full m-2 box-content"></div>
            <div className="flex flex-col gap-4 mb-40 dk:mb-0">
              {game.hands.map((hand, i) => (
                <PlayerHand
                  key={i}
                  i={i}
                  hand={hand}
                  evaluation={getEval(hand)}
                  handEvals={handEvals}
                  cardToEdit={cardToEdit}
                  setCardToEdit={setCardToEdit}
                  resetCardFromHand={resetCardFromHand}
                ></PlayerHand>
              ))}
            </div>
            <div>
              <div className="dk:absolute dk:left-1/2 dk:-translate-x-1/2 dk:top-1/2 dk:-translate-y-3/4 px-2 pt-1 dk:mt-3 pb-2 border-white flex flex-col gap-1 bg-slate-600 rounded-md bg-opacity-50 shadow-lg">
                <div className="text-sm font-bold text-slate-100">Board</div>
                <div className="flex gap-2">
                  {game.board.map((h, i) =>
                    h.length > 0 ? (
                      <CardButton
                        key={i}
                        rank={h[0]}
                        suit={h[1]}
                        onClick={() => resetCardFromBoard(i)}
                      ></CardButton>
                    ) : (
                      <CardPlaceHolder
                        onClick={() => setCardToEdit([0, i])}
                        selected={cardToEdit[0] === 0 && cardToEdit[1] === i}
                        key={i}
                      ></CardPlaceHolder>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {handEvals.length > 0 && (
          <div className="hidden dk:flex gap-6 flex-wrap my-6">
            {game.hands.map(
              (hand, i) =>
                hand.every((c) => c !== "") && (
                  <div
                    key={i}
                    className=" dk:bg-slate-800 dk:shadow-2xl rounded-xl py-2 px-2 text-slate-100"
                  >
                    <div className="font-bold mb-2">Player {i + 1}</div>
                    <ul className="text-sm font-semibold flex flex-col gap-1 justify-between min-w-[180px]">
                      {handEvals[i].levels.map((winsForLevel, level) => (
                        <li key={level} className="flex justify-between">
                          <div>{rankDescription[level]}</div>
                          <div>
                            {Math.round(
                              (winsForLevel / handEvals[i].iterations) * 10000
                            ) / 100}
                            &nbsp;%
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
