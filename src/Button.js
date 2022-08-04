const Button = ({ children, onClick, disabled }) => (
  <button
    className={`border border-slate-200  transition-colors rounded text-sm px-2 py-1 flex items-center font-semibold bg-slate-200
     ${disabled ? "opacity-30" : ""} `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
