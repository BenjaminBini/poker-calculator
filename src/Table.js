import CardButton from "./CardButton";
import CardPlaceHolder from "./CardPlaceHolder";
import PlayerHand from "./PlayerHand";

const Table = ({
  hands,
  board,
  handEvals,
  cardToEdit,
  setCardToEdit,
  resetCardFromHand,
  resetCardFromBoard,
  getEval,
}) => {
  const clickOnBoard = (cardIndex) => {
    if (board[cardIndex].length > 0) {
      setCardToEdit([0, cardIndex]);
    } else {
      const indexToModify = board.findIndex((c) => c.length === 0);
      setCardToEdit([0, indexToModify]);
    }
  };
  return (
    <div className=" dk:bg-slate-800 dk:shadow-2xl rounded-xl py-6 dk:py-20">
      <div className="flex flex-col-reverse items-start gap-4 dk:bg-green-600 dk:border-yellow-600 dk:border-[12px] dk:shadow-lg dk:mx-16 rounded-full dk:h-[300px] relative">
        <div className="hidden dk:block absolute top-0 bottom-0 left-0 right-0  border-2 rounded-full m-2 box-content"></div>
        <div className="flex flex-col gap-4 mb-40 dk:mb-0">
          {hands.map((hand, playerIndex) => (
            <PlayerHand
              key={playerIndex}
              playerIndex={playerIndex}
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
              {board.map((card, cardIndex) =>
                card.length > 0 ? (
                  <CardButton
                    key={cardIndex}
                    rank={card[0]}
                    suit={card[1]}
                    onClick={() => resetCardFromBoard(cardIndex)}
                  ></CardButton>
                ) : (
                  <CardPlaceHolder
                    onClick={() => clickOnBoard(cardIndex)}
                    selected={
                      cardToEdit[0] === 0 && cardToEdit[1] === cardIndex
                    }
                    key={cardIndex}
                  ></CardPlaceHolder>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
