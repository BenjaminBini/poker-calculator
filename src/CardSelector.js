import { useState } from "react";

import CardButton from "./CardButton";
import { ranks, suits } from "./eval/cards";

const CardSelector = ({ addCard, game }) => {
  const [selectedSuit, setSelectedSuit] = useState("h");
  return (
    <div className="bg-slate-800 py-4 px-6 dk:mb-6 dk:rounded-xl flex items-center justify-center dk:relative fixed bottom-0 left-0 right-0 z-50 bg-opacity-40 dk:bg-opacity-100">
      <div className="flex flex-col gap-4">
        <div className="flex dk:hidden gap-6 justify-center">
          {suits.map((suit, i) => (
            <button
              key={i}
              className={` bg-slate-200 p-2 rounded ${
                suit !== selectedSuit && "opacity-30"
              }`}
              onClick={() => setSelectedSuit(suit)}
            >
              <img alt={suit} src={`./icons/${suit}.png`} className="w-6" />
            </button>
          ))}
        </div>
        {suits.map((suit, i) => (
          <div
            key={i}
            className={`flex-wrap gap-2 justify-center dk:flex ${
              selectedSuit === suit ? "flex" : "hidden"
            }`}
          >
            {ranks.map((hand, j) => (
              <CardButton
                key={j}
                rank={hand}
                suit={suit}
                onClick={() => addCard(`${hand}${suit}`)}
                disabled={
                  [...game.hands.flatMap((h) => h), ...game.board].includes(
                    `${hand}${suit}`
                  ) ||
                  [...game.hands.flatMap((h) => h), ...game.board].filter(
                    (c) => c.length === 2
                  ).length ===
                    2 * 10 + 5
                }
              ></CardButton>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
