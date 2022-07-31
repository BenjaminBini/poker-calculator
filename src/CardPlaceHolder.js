const CardPlaceHolder = ({ selected, onClick }) => (
  <button
    onClick={onClick}
    className={`transition - colors border-dashed rounded text-sm border-gray-300 px-2 py-1 flex items-center font-semibold bg-white border w-[49.6px] h-[29.6px] ${
      selected && "border-yellow-400 border-2"
    }`}
  ></button>
);

export default CardPlaceHolder;
