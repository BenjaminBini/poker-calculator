import evaluator from "./evaluator";
import {
  FLUSH,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  HIGH_CARD,
  ONE_PAIR,
  STRAIGHT,
  STRAIGHT_FLUSH,
  THREE_OF_A_KIND,
  TWO_PAIR,
} from "./hand-rank";

test("get the suit of a card", function () {
  expect(evaluator.getSuit("2c")).toBe("c");
  expect(evaluator.getSuit("2h")).toBe("h");
  expect(evaluator.getSuit("AD")).toBe("d");
  expect(evaluator.getSuit("Ad")).toBe("d");
  expect(evaluator.getSuit("Ks")).not.toBe("d");
});

test("get the rank of a card", function () {
  expect(evaluator.getRank("2c")).toBe(0 << 2);
  expect(evaluator.getRank("2h")).toBe(0 << 2);
  expect(evaluator.getRank("5h")).toBe(3 << 2);
  expect(evaluator.getRank("Ad")).toBe(12 << 2);
  expect(evaluator.getRank("Qs")).toBe(10 << 2);
  expect(evaluator.getRank("Qs")).not.toBe(9 << 2);
  expect(evaluator.getRank("Ad")).not.toBe(11 << 2);
});

test("get the suit map of a hand", function () {
  expect(evaluator.getSuitMap(["2c", "2h", "As", "3c", "3d"])).toEqual({
    c: 2,
    h: 1,
    d: 1,
    s: 1,
  });

  expect(
    evaluator.getSuitMap(["2c", "2h", "Ah", "3h", "5h", "6h", "7d"])
  ).toEqual({
    c: 1,
    h: 5,
    d: 1,
  });
});

test("get the rank map of a hand", function () {
  expect(evaluator.getRankMap(["2c", "2h", "As", "3c", "3d"])).toEqual({
    0b000000: 2,
    0b000100: 2,
    0b110000: 1,
  });
});

test("get the highest card", function () {
  expect(evaluator.getHighestCard(["2c", "2h", "As", "3s", "3d"])).toBe("As");
  expect(evaluator.getHighestCard(["2c", "2h", "Ks", "As", "3s"])).toBe("As");
  expect(evaluator.getHighestCard(["2c", "2h", "Ks", "2s", "3s"])).toBe("Ks");
});

test("sort a hand", function () {
  expect(evaluator.sortHand(["Ks", "3s", "As", "2s", "5s", "4s"])).toEqual([
    "2s",
    "3s",
    "4s",
    "5s",
    "Ks",
    "As",
  ]);
});

test("get pairs of a hand", function () {
  expect(evaluator.getPairs(["As", "3c", "3d", "2c", "2h"])).toEqual([
    ["2c", "2h"],
    ["3c", "3d"],
  ]);
  expect(evaluator.getPairs(["2c", "Kh", "As", "3c", "3d"])).toEqual([
    ["3c", "3d"],
  ]);
  expect(evaluator.getPairs(["2c", "Kh", "Ks", "Kc", "8d"])).toEqual([]);
  expect(evaluator.getPairs(["8c", "Ah", "2s", "As", "3c", "2d"])).toEqual([
    ["2s", "2d"],
    ["Ah", "As"],
  ]);
});

test("get sets of a hand", function () {
  expect(evaluator.getSets(["2c", "2h", "2s", "3d", "4d"])).toEqual([
    ["2c", "2h", "2s"],
  ]);
  expect(evaluator.getSets(["2c", "2h", "2s", "2d", "4d"])).toEqual([]);
});

test("get the straight", function () {
  expect(evaluator.getStraight(["2", "3", "4", "5", "A"])).toEqual([
    "A",
    "2",
    "3",
    "4",
    "5",
  ]);
  expect(evaluator.getStraight(["2", "3", "4", "5", "6", "A"])).toEqual([
    "2",
    "3",
    "4",
    "5",
    "6",
  ]);
  expect(evaluator.getStraight(["T", "J", "Q", "K", "A"])).toEqual([
    "T",
    "J",
    "Q",
    "K",
    "A",
  ]);

  expect(evaluator.getStraight(["3", "4", "5", "6", "A"])).toEqual(null);
});

test("get the flush", function () {
  expect(
    evaluator.getFlush(["2c", "Ac", "3c", "4c", "Qc", "6h", "Kh"])
  ).toEqual(["2c", "3c", "4c", "Qc", "Ac"]);
  expect(
    evaluator.getFlush(["2c", "3c", "4c", "Qc", "Ac", "Jc", "6h", "Kh"])
  ).toEqual(["3c", "4c", "Jc", "Qc", "Ac"]);
  expect(
    evaluator.getFlush(["2c", "3c", "4c", "Qc", "Ah", "6h", "Kh"])
  ).toEqual(null);
});

test("get quads of a hand", function () {
  expect(evaluator.getQuads(["2c", "2h", "2s", "2h", "4d"])).toEqual([
    ["2c", "2h", "2s", "2h"],
  ]);
  expect(
    evaluator.getQuads(["2c", "2h", "3c", "3h", "3d", "2s", "3s", "2d", "4d"])
  ).toEqual([
    ["2c", "2h", "2s", "2d"],
    ["3c", "3h", "3d", "3s"],
  ]);
  expect(evaluator.getQuads(["2c", "2h", "2s", "3d", "4d"])).toEqual([]);
});

test("get straight flush of a hand", function () {
  expect(evaluator.getStraightFlush(["Tc", "Jc", "Qc", "Kc", "Ac"])).toEqual([
    "Tc",
    "Jc",
    "Qc",
    "Kc",
    "Ac",
  ]);
  expect(
    evaluator.getStraightFlush(["Ac", "Jc", "Qc", "Kc", "Tc", "2h"])
  ).toEqual(["Tc", "Jc", "Qc", "Kc", "Ac"]);
  expect(
    evaluator.getStraightFlush(["Ac", "2c", "4c", "Kc", "Tc", "2h"])
  ).toEqual(null);
});

test("get value of a hand", function () {
  const evalStraightFlush1 = evaluator.evaluate(
    ["Ah", "As"],
    ["2h", "3h", "4h", "5h", "5d"]
  );
  expect(evalStraightFlush1.rank).toBe(STRAIGHT_FLUSH);
  expect(evalStraightFlush1.cards).toEqual(["Ah", "2h", "3h", "4h", "5h"]);
  const evalStraightFlush2 = evaluator.evaluate(
    ["2c", "Jh", "4c", "Th", "Qh", "Kh", "Ah"],
    []
  );
  expect(evalStraightFlush2.rank).toBe(STRAIGHT_FLUSH);
  expect(evalStraightFlush2.cards).toEqual(["Th", "Jh", "Qh", "Kh", "Ah"]);

  const evalQuads = evaluator.evaluate(
    ["2c", "2h", "4c", "Th", "Qh", "2s", "2d"],
    []
  );
  expect(evalQuads.rank).toBe(FOUR_OF_A_KIND);
  expect(evalQuads.cards).toEqual(["2c", "2h", "2s", "2d", "Qh"]);
  const evalFull = evaluator.evaluate(
    ["2c", "Th", "Td", "2h", "Ah", "Tc", "Ad"],
    []
  );
  expect(evalFull.rank).toBe(FULL_HOUSE);
  expect(evalFull.cards).toEqual(["Th", "Td", "Tc", "Ah", "Ad"]);
  const evalFlush = evaluator.evaluate(
    ["2c", "Kc", "8d", "Ac", "4d", "7c", "Jc"],
    []
  );
  expect(evalFlush.rank).toBe(FLUSH);
  expect(evalFlush.cards).toEqual(["2c", "7c", "Jc", "Kc", "Ac"]);
  const evalStraight = evaluator.evaluate(
    ["2c", "4c", "3d", "Ac", "8d", "5h", "Js"],
    []
  );
  expect(evalStraight.rank).toBe(STRAIGHT);
  expect(evalStraight.cards).toEqual(["Ac", "2c", "3d", "4c", "5h"]);
  const evalStraight2 = evaluator.evaluate(
    ["Kh", "Ks"],
    ["Ts", "Js", "Qs", "5d", "Ah"]
  );
  expect(evalStraight2.rank).toBe(STRAIGHT);
  expect(evalStraight2.cards).toEqual(["Ts", "Js", "Qs", "Kh", "Ah"]);
  const evalSet = evaluator.evaluate(
    ["2c", "4c", "2d", "Ac", "8d", "2h", "Js"],
    []
  );
  expect(evalSet.rank).toBe(THREE_OF_A_KIND);
  expect(evalSet.cards).toEqual(["2c", "2d", "2h", "Ac", "Js"]);
  const evalTwoPair = evaluator.evaluate(
    ["2c", "4c", "2d", "4c", "8d", "8h", "Js"],
    []
  );
  expect(evalTwoPair.rank).toBe(TWO_PAIR);
  expect(evalTwoPair.cards).toEqual(["8d", "8h", "4c", "4c", "Js"]);
  const evalPair = evaluator.evaluate(
    ["2c", "4c", "8d", "Ac", "Kd", "7h", "Ks"],
    []
  );
  expect(evalPair.rank).toBe(ONE_PAIR);
  expect(evalPair.cards).toEqual(["Kd", "Ks", "Ac", "8d", "7h"]);
  const evalHighCard = evaluator.evaluate(
    ["2c", "4c", "8d", "Ac", "Kd", "7h", "3s"],
    []
  );
  expect(evalHighCard.rank).toBe(HIGH_CARD);
  expect(evalHighCard.cards).toEqual(["Ac", "Kd", "8d", "7h", "4c"]);
});
