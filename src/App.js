import { useState } from "react";

import Button from "./Button.js";
import CardButton from "./CardButton.js";
import CardPlaceHolder from "./CardPlaceHolder.js";
import MiniCard from "./MiniCard.js";
import { ranks, suits } from "./poker-eval/cards.js";
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
    calculatorWorker.terminate();
    setCardToEdit([1, 0]);
  };

  return (
    <div className="max-w-4xl m-auto space-y-6 my-4">
      <h1 className="font-bold text-4xl">Poker calculator</h1>
      <div className="flex flex-col gap-2">
        {suits.map((suit, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            {ranks.map((hand, j) => (
              <CardButton
                key={j}
                rank={hand}
                suit={suit}
                onClick={() => addCard(`${hand}${suit}`)}
                disabled={[
                  ...game.hands.flatMap((h) => h),
                  ...game.board,
                ].includes(`${hand}${suit}`)}
              ></CardButton>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={reset}>Reset</Button>
        {handEvals.length > 0 && (
          <span>{handEvals[0].iterations} iterations</span>
        )}
      </div>
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          {game.hands.map((hand, i) => (
            <div key={i} className="space-y-1">
              <div className="text-sm font-bold">Player {i + 1}</div>
              <div className="flex gap-2">
                {hand.map((h, j) =>
                  h.length > 1 ? (
                    <CardButton
                      key={j}
                      rank={h[0]}
                      suit={h[1]}
                      onClick={() => resetCardFromHand(i + 1, j)}
                    ></CardButton>
                  ) : (
                    <CardPlaceHolder
                      onClick={() => setCardToEdit([i + 1, j])}
                      selected={cardToEdit[0] === i + 1 && cardToEdit[1] === j}
                      key={j}
                    ></CardPlaceHolder>
                  )
                )}
              </div>
              {getEval(hand) && (
                <div className="flex items-center text-xs font-semibold space-x-2">
                  <span>{getEval(hand).levelLabel}</span>

                  <div className="flex gap-2">
                    {getEval(hand).cards.map((h, i) => (
                      <MiniCard key={i} rank={h[0]} suit={h[1]} />
                    ))}
                  </div>
                </div>
              )}
              <div>
                {handEvals.length > i && hand.every((c) => c !== "") && (
                  <div className="space-y-1">
                    <div className="text-md font-semibold">
                      Win:&nbsp;
                      {Math.round(
                        (handEvals[i].wins / handEvals[i].iterations) * 10000
                      ) / 100}
                      %
                    </div>
                    <div className="text-xs font-semibold">
                      Ties:&nbsp;
                      {Math.round(
                        (handEvals[i].ties / handEvals[i].iterations) * 10000
                      ) / 100}
                      %
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div>
            <div className="text-sm font-bold text-right">Board</div>
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
  );
}

export default App;
