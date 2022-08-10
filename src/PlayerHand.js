import CardButton from "./CardButton";
import CardPlaceHolder from "./CardPlaceHolder";
import { rankDescription } from "./eval/hand-rank";
import MiniCard from "./MiniCard";
import PlayerHandRanksOdds from "./PlayerHandRanksOdds";

const playerClassNames = [
  "dk:bottom-0 dk:left-1/2 dk:-translate-x-1/2 dk:translate-y-[60px]",
  "dk:bottom-0 dk:left-1/4 dk:-translate-x-1/2 dk:translate-y-[60px]",
  "dk:bottom-0 dk:-translate-x-1/3 dk:translate-y-[30px]",
  "dk:top-0 dk:-translate-x-1/3 dk:-translate-y-[30px]",
  "dk:-top-4 dk:left-1/4 dk:-translate-x-1/2 dk:-translate-y-[60px]",
  "dk:-top-4 dk:left-1/2 dk:-translate-x-1/2 dk:-translate-y-[60px]",
  "dk:-top-4 dk:left-3/4 dk:-translate-x-1/2 dk:-translate-y-[60px]",
  "dk:top-0 dk:right-0 dk:translate-x-1/3 dk:-translate-y-[30px]",
  "dk:bottom-0 dk:right-0 dk:translate-x-1/3 dk:translate-y-[30px]",
  "dk:bottom-0 dk:left-3/4 dk:-translate-x-1/2 dk:translate-y-[60px]",
];

const PlayerHand = ({
  playerIndex,
  hand,
  evaluation,
  handEvals,
  cardToEdit,
  setCardToEdit,
  resetCardFromHand,
}) => {
  const clickOnPlayerCardPlaceHolder = (playerIndex, cardIndex) => {
    if (cardIndex === 0 || hand[0].length > 1) {
      setCardToEdit([playerIndex + 1, cardIndex]);
    } else {
      setCardToEdit([playerIndex + 1, 0]);
    }
  };
  return (
    <div
      key={playerIndex}
      className={`z-10 hover:z-20 text-slate-100  dk:absolute ${playerClassNames[playerIndex]} flex gap-4`}
    >
      <div
        className={`dk:w-[124px] z-10 hover:z-20  shadow-xl rounded-md bg-slate-600 bg-opacity-80`}
      >
        <div className="space-y-1 dk:py-1 dk:px-2 py-2 px-2">
          <div className="text-sm font-bold dk:text-center">
            Player {playerIndex + 1}
          </div>
          <div className="flex gap-2">
            {hand.map((card, cardIndex) =>
              card.length > 1 ? (
                <CardButton
                  key={cardIndex}
                  rank={card[0]}
                  suit={card[1]}
                  onClick={() => resetCardFromHand(playerIndex + 1, cardIndex)}
                ></CardButton>
              ) : (
                <CardPlaceHolder
                  onClick={() =>
                    clickOnPlayerCardPlaceHolder(playerIndex, cardIndex)
                  }
                  selected={
                    cardToEdit[0] === playerIndex + 1 &&
                    cardToEdit[1] === cardIndex
                  }
                  key={cardIndex}
                ></CardPlaceHolder>
              )
            )}
          </div>

          <div>
            {handEvals.length > 0 && hand.every((card) => card.length > 0) && (
              <div>
                <div className="text-md font-semibold text-center">
                  Win:&nbsp;
                  {Math.round(
                    (handEvals[playerIndex].wins /
                      handEvals[playerIndex].iterations) *
                      10000
                  ) / 100}
                  &nbsp;%
                </div>
                <div className="text-xs font-semibold text-center">
                  Tie:&nbsp;
                  {Math.round(
                    (handEvals[playerIndex].ties /
                      handEvals[playerIndex].iterations) *
                      10000
                  ) / 100}
                  &nbsp;%
                </div>
              </div>
            )}
          </div>
        </div>
        {evaluation && (
          <div className="pb-2 dk:p-1 dk:pt-0 pt-0 -z-10 left-0 right-0 text-xs font-semibold text-center flex flex-col gap-1 ">
            <div>{rankDescription[evaluation.rank]}</div>
            <div className="flex gap-1 items-center justify-center w-full">
              {evaluation.cards.map(
                (h, i) => h && <MiniCard key={i} rank={h[0]} suit={h[1]} />
              )}
            </div>
          </div>
        )}
      </div>
      {handEvals.length > 0 && hand.every((card) => card.length > 0) && (
        <div className="block dk:hidden">
          <PlayerHandRanksOdds
            handEval={handEvals[playerIndex]}
            playerIndex={playerIndex}
          ></PlayerHandRanksOdds>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
