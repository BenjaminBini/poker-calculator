const CalculatorProgressBar = ({ show, currentIteration, totalIterations }) => (
  <div className="flex items-center space-x-2 dk:mb-6">
    <div className="w-full mt-2">
      <div className="text-slate-100 text-sm text-right italic mb-1">
        {show ? (
          <span>
            {currentIteration.toLocaleString()} /{" "}
            {totalIterations.toLocaleString()} iterations
          </span>
        ) : (
          <div>Please pick at least 2 hands</div>
        )}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            show && currentIteration === totalIterations
              ? "bg-green-500"
              : "bg-blue-600"
          }`}
          style={{
            width: show ? (currentIteration / totalIterations) * 100 + "%" : 0,
          }}
        ></div>
      </div>
    </div>
  </div>
);

export default CalculatorProgressBar;
