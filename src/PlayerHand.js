import CardButton from "./CardButton";
import CardPlaceHolder from "./CardPlaceHolder";
import MiniCard from "./MiniCard";
import { HAND_LABELS } from "./poker-eval/enums";

const playerClassNames = [
  "bottom-0 left-1/2 -translate-x-1/2 translate-y-[60px]",
  "bottom-0 left-1/4 -translate-x-1/2 translate-y-[60px]",
  "bottom-0 -translate-x-1/3 translate-y-[30px]",
  "top-0 -translate-x-1/3 -translate-y-[30px]",
  "top-0 left-1/4 -translate-x-1/2 -translate-y-[60px]",
  "top-0 left-1/2 -translate-x-1/2 -translate-y-[60px]",
  "top-0 left-3/4 -translate-x-1/2 -translate-y-[60px]",
  "top-0 right-0 translate-x-1/3 -translate-y-[30px]",
  "bottom-0 right-0 translate-x-1/3 translate-y-[30px]",
  "bottom-0 left-3/4 -translate-x-1/2 translate-y-[60px]",
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
    className={`w-[124px] z-10 hover:z-20 text-slate-100 shadow-xl rounded-md absolute bg-slate-600 bg-opacity-50 backdrop-blur-md ${playerClassNames[i]} group`}
  >
    <div className="space-y-1 py-1 px-2">
      <div className="text-sm font-bold text-center">Player {i + 1}</div>
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

      <div className="">
        {handEvals.length > 0 && hand.every((c) => c !== "") && (
          <div>
            <div className="text-md font-semibold text-center">
              Win:&nbsp;
              {Math.round(
                (handEvals[i].wins / handEvals[i].iterations) * 10000
              ) / 100}
              %
            </div>
            <div className="text-xs font-semibold text-center">
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
    {evaluation && (
      <div className="p-1 pt-0 -z-10 left-0 right-0 text-xs font-semibold text-center flex flex-col gap-1 ">
        <div>{HAND_LABELS[evaluation.levelValue]}</div>
        <div className="flex gap-1 items-center justify-center w-full">
          {evaluation.cards.map(
            (h, i) => h && <MiniCard key={i} rank={h[0]} suit={h[1]} />
          )}
        </div>
      </div>
    )}
    {handEvals.length > 0 && hand.every((c) => c !== "") && (
      <div
        className={`bg-slate-800 bg-opacity-80 rounded-md p-1 my-2 w-[140px] absolute hidden group-hover:block group-hover:animate-apparate ${
          [0, 1, 2, 8, 9].includes(i) ? "bottom-full" : "top-full"
        }`}
      >
        <ul className="text-xs font-semibold">
          {Object.keys(handEvals[i].levels).map((l, j) => (
            <li key={j} className="flex justify-between">
              <div>{HAND_LABELS[l]}</div>
              <div>
                {Math.round(
                  (handEvals[i].levels[l] / handEvals[i].iterations) * 10000
                ) / 100}{" "}
                %
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default PlayerHand;
