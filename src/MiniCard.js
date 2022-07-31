const MiniCard = ({ rank, suit }) => (
  <div className="rounded inline-flex gap-[2px] justify-between items-center">
    <div>
      <img alt={suit} src={`./icons/${suit}.png`} className="w-3" />
    </div>
    <div>{rank}</div>
  </div>
);

export default MiniCard;
