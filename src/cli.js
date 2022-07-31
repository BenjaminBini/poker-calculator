import evaluator from "./poker-eval/evaluator";

const evalStraight2 = evaluator.evaluate(
  ["Kh", "Ks"],
  ["Ts", "Js", "Qs", "5d", "Ah"]
);

console.log(evalStraight2);
