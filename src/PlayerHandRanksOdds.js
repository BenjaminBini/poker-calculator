import { rankDescription } from "./eval/hand-rank";

const PlayerHandRanksOdds = ({ playerIndex, handEval }) => (
  <div
    key={playerIndex}
    className=" dk:bg-slate-800 dk:shadow-2xl rounded-xl py-2 px-2 text-slate-100"
  >
    <div className="font-bold mb-2 hidden dk:block">
      Player {playerIndex + 1}
    </div>
    <ul className="text-xs dk:text-sm font-semibold flex flex-col gap-1 justify-between min-w-[180px]">
      {handEval.handRanks.map((numberOfHands, handRank) => (
        <li key={handRank} className="flex justify-between">
          <div>{rankDescription[handRank]}</div>
          <div>
            {Math.round((numberOfHands / handEval.iterations) * 10000) / 100}
            &nbsp;%
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default PlayerHandRanksOdds;
