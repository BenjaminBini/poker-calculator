import Button from "./Button";

const CardButton = ({ rank, suit, disabled, onClick }) => (
  <Button onClick={onClick} disabled={disabled}>
    <div className="w-8 flex justify-between items-center">
      <div>
        <img alt={suit} src={`./icons/${suit}.png`} className="w-4" />
      </div>
      <div>{rank}</div>
    </div>
  </Button>
);

export default CardButton;
