import { useState } from "react";

import Button from "./Button";
import CalculatorProgressBar from "./CalculatorProgressBar";
import CardSelector from "./CardSelector";
import evaluator from "./eval/evaluator";
import PlayersHandRanksOdds from "./PlayersHandRanksOdds";
import Table from "./Table";

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
    const worker = new Worker(new URL("./worker/worker.js", import.meta.url));
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

  const newHand = () => {
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
          <Button onClick={newHand}>New hand</Button>
        </div>
        <CalculatorProgressBar
          show={handEvals.length > 0}
          currentIteration={handEvals.length > 0 ? handEvals[0].iterations : 0}
          totalIterations={
            handEvals.length > 0 ? handEvals[0].totalIterations : 0
          }
        ></CalculatorProgressBar>
        <CardSelector addCard={addCard} game={game}></CardSelector>
        <Table
          hands={game.hands}
          board={game.board}
          handEvals={handEvals}
          cardToEdit={cardToEdit}
          setCardToEdit={setCardToEdit}
          getEval={getEval}
          resetCardFromHand={resetCardFromHand}
          resetCardFromBoard={resetCardFromBoard}
        ></Table>
        <PlayersHandRanksOdds
          hands={game.hands}
          handEvals={handEvals}
        ></PlayersHandRanksOdds>
      </div>
    </div>
  );
}

export default App;
