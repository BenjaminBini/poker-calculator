const Button = ({ children, onClick, disabled, variant }) => (
  <button
    className={`transition-colors  rounded text-sm border-gray-300 px-2 py-1 flex items-center font-semibold ${
      disabled ? "opacity-40" : "bg-white hover:bg-gray-100"
    } ${variant === "action" ? `bg-blue-500  text-white border-0` : "border"} ${
      variant === "action" && !disabled ? "hover:bg-blue-400" : ""
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
