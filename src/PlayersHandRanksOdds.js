import PlayerHandRanksOdds from "./PlayerHandRanksOdds";

const PlayersHandRanksOdds = ({ handEvals, hands }) =>
  handEvals.length > 0 && (
    <div className="hidden dk:flex gap-6 flex-wrap my-6">
      {hands.map(
        (hand, i) =>
          hand.every((c) => c !== "") && (
            <PlayerHandRanksOdds
              handEval={handEvals[i]}
              i={i}
              key={i}
            ></PlayerHandRanksOdds>
          )
      )}
    </div>
  );

export default PlayersHandRanksOdds;
