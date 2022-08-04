const CardPlaceHolder = ({ selected, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded text-sm px-2 py-1 flex items-center font-semibold bg-white w-[50px] h-[30px] ${
      selected && "bg-yellow-400"
    }`}
  ></button>
);

export default CardPlaceHolder;
