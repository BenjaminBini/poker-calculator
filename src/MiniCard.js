const MiniCard = ({ rank, suit }) => (
  <div className="rounded min-w-[18px] max-w-[18px] inline-flex flex-col pt-1 px-1 justify-between items-center bg-slate-200 text-black">
    <div className="min-w-[8px]">
      <img alt={suit} src={`./icons/${suit}.png`} />
    </div>
    <div>{rank}</div>
  </div>
);

export default MiniCard;
