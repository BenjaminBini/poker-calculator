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

  const resetCardFromHand = (handIndex, cardPosition) => {
    game.hands[handIndex - 1][cardPosition] = "";
    setCardToEdit([handIndex, cardPosition]);
    setHandEvals([]);
    computeEvals();
  };

  const resetCardFromBoard = (cardPosition) => {
    game.board[cardPosition] = "";
    setCardToEdit([0, cardPosition]);
    setHandEvals([]);
    computeEvals();
  };

  const getNextEmptySlot = () => {
    const handEmptySlots = [];
    game.hands.forEach((hand, handIndex) => {
      hand[0].length === 0 && handEmptySlots.push([handIndex + 1, 0]);
      hand[1].length === 0 && handEmptySlots.push([handIndex + 1, 1]);
    });
    const boardEmptySlots = game.board
      .map((card, cardIndex) => ({ card, cardIndex }))
      .filter((boardSlot) => boardSlot.card.length === 0)
      .map((boardSlot) => [0, boardSlot.cardIndex]);

    const allEmptySlots = [...boardEmptySlots, ...handEmptySlots];
    const firstHandEmptySlotAfterCurrent = handEmptySlots.find(
      (slot) =>
        (slot[0] === cardToEdit[0] && slot[1] > cardToEdit[1]) ||
        slot[0] > cardToEdit[0]
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
    if (hand.length === 2 && hand.every((card) => card.length > 0)) {
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
