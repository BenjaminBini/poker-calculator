import PlayerHandRanksOdds from "./PlayerHandRanksOdds";

const PlayersHandRanksOdds = ({ handEvals, hands }) =>
  handEvals.length > 0 && (
    <div className="hidden dk:flex gap-6 flex-wrap my-6">
      {hands.map(
        (hand, handIndex) =>
          hand.every((card) => card.length > 0) && (
            <PlayerHandRanksOdds
              handEval={handEvals[handIndex]}
              playerIndex={handIndex}
              key={handIndex}
            ></PlayerHandRanksOdds>
          )
      )}
    </div>
  );

export default PlayersHandRanksOdds;
