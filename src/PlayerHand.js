import CardButton from "./CardButton";
import CardPlaceHolder from "./CardPlaceHolder";
import { rankDescription } from "./eval/hand-rank";
import MiniCard from "./MiniCard";
import { HAND_LABELS } from "./poker-eval/enums";

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
  i,
  hand,
  evaluation,
  handEvals,
  cardToEdit,
  setCardToEdit,
  resetCardFromHand,
}) => (
  <div
    key={i}
    className={`z-10 hover:z-20 text-slate-100  dk:absolute ${playerClassNames[i]} flex gap-4`}
  >
    <div
      className={`dk:w-[124px] z-10 hover:z-20  shadow-xl rounded-md bg-slate-600 bg-opacity-50 dk:backdrop-blur-md`}
    >
      <div className="space-y-1 dk:py-1 dk:px-2 py-2 px-2">
        <div className="text-sm font-bold dk:text-center">Player {i + 1}</div>
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

        <div>
          {handEvals.length > 0 && hand.every((c) => c !== "") && (
            <div>
              <div className="text-md font-semibold text-center">
                Win:&nbsp;
                {Math.round(
                  (handEvals[i].wins / handEvals[i].iterations) * 10000
                ) / 100}
                &nbsp;%
              </div>
              <div className="text-xs font-semibold text-center">
                Tie:&nbsp;
                {Math.round(
                  (handEvals[i].ties / handEvals[i].iterations) * 10000
                ) / 100}
                &nbsp;%
              </div>
            </div>
          )}
        </div>
      </div>
      {evaluation && (
        <div className="pb-2 dk:p-1 dk:pt-0 pt-0 -z-10 left-0 right-0 text-xs font-semibold text-center flex flex-col gap-1 ">
          <div>{HAND_LABELS[evaluation.levelValue]}</div>
          <div className="flex gap-1 items-center justify-center w-full">
            {evaluation.cards.map(
              (h, i) => h && <MiniCard key={i} rank={h[0]} suit={h[1]} />
            )}
          </div>
        </div>
      )}
    </div>
    {handEvals.length > 0 && hand.every((c) => c !== "") && (
      <div className="bg-slate-800 bg-opacity-80 rounded-md p-2 dk:my-2 w-[158px] dk:absolute dk:hidden">
        <ul className="text-xs font-semibold flex flex-col h-full justify-between">
          {handEvals[i].handRanks.map((winsForLevel, level) => (
            <li key={level} className="flex justify-between">
              <div>{rankDescription[level]}</div>
              <div>
                {Math.round((winsForLevel / handEvals[i].iterations) * 10000) /
                  100}
                &nbsp;%
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default PlayerHand;
