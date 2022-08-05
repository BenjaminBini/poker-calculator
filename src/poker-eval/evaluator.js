import { HANDS, RANKS } from "./enums";

const evaluator = {
  /**
   * Compare two Texas Hold'em hands
   * @param {*} hand1 First hand to compare, represented as an array of cards.
   * @param {*} hand2 First hand to compare, represented as an array of cards.
   * @returns Positive number if hand1 is better than hand2, negative number if hand2 is better than hand1, 0 if they are equal
   */
  compare(hand1, hand2) {
    const hand1Value = this.evaluate(hand1);
    const hand2Value = this.evaluate(hand2);
    return this.compareEvals(hand1Value, hand2Value);
  },
  /**
   * Compare two Texas Hold'em hands evaluations
   * @param {*} eval1 First value to compare
   * @param {*} eval2 Second value to compare
   * @returns Positive number if eval1 is better than eval2, negative number if eval2 is better than eval1, 0 if they are equal
   */
  compareEvals(eval1, eval2) {
    const result = eval1.level - eval2.level;
    return result !== 0 ? result : eval1.handValue - eval2.handValue;
  },
  evaluate(pocketCards, board) {
    const hand = [...pocketCards, ...(board ? board : [])].filter(
      (c) => c.length === 2
    );
    if (hand.length === 0) {
      return;
    }
    const straightFlush = this.getStraightFlush(hand);
    const quads = this.getQuads(hand);
    const flush = this.getFlush(hand);
    const straight = this.getStraight(hand);
    const sets = this.getSets(hand);
    const pairs = this.getPairs(hand);
    let handEvaluation = {
      hand,
      pocketCards,
    };
    if (straightFlush) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.STRAIGHT_FLUSH,
        levelValue: "STRAIGHT_FLUSH",
        cards: straightFlush,
        // This is a special case where we need to return the highest card in the straight first for the calcualtion of the hand value
        sortedCardsByValue: straight.slice().reverse(),
      };
    } else if (quads.length > 0) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.FOUR_OF_A_KIND,
        levelValue: "FOUR_OF_A_KIND",
        cards: [
          ...quads.at(-1),
          this.getHighestCard(this.filterHand(hand, ...quads)),
        ],
      };
    } else if ((sets.length > 0 && pairs.length > 0) || sets.length > 1) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.FULL_HOUSE,
        levelValue: "FULL_HOUSE",
        cards: [
          ...sets.at(-1),
          ...(pairs.length > 0 ? pairs.at(-1) : sets.at(-2).slice(-2)),
        ],
      };
    } else if (flush) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.FLUSH,
        levelValue: "FLUSH",
        cards: flush,
        // This is a special case where we need to return the highest card in the flush first for the calcualtion of the hand value
        sortedCardsByValue: flush.slice().reverse(),
      };
    } else if (straight) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.STRAIGHT,
        levelValue: "STRAIGHT",
        cards: straight,
        // This is a special case where we need to return the highest card in the straight first for the calcualtion of the hand value
        sortedCardsByValue: straight.slice().reverse(),
      };
    } else if (sets.length > 0) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.THREE_OF_A_KIND,
        levelValue: "THREE_OF_A_KIND",
        cards: [
          ...sets.at(-1),
          ...this.sortHand(this.filterHand(hand, sets.at(-1)))
            .slice(-2)
            .reverse(),
        ],
      };
    } else if (pairs.length > 1) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.TWO_PAIR,
        levelValue: "TWO_PAIR",
        cards: [
          ...pairs.at(-1),
          ...pairs.at(-2),
          ...this.sortHand(
            this.filterHand(hand, [...pairs.at(-1), ...pairs.at(-2)])
          )
            .slice(-1)
            .reverse(),
        ],
      };
    } else if (pairs.length === 1) {
      handEvaluation = {
        ...handEvaluation,
        level: HANDS.ONE_PAIR,
        levelValue: "ONE_PAIR",
        cards: [
          ...pairs[0],
          ...this.sortHand(this.filterHand(hand, pairs[0])).slice(-3).reverse(),
        ],
      };
    } else {
      handEvaluation = {
        ...handEvaluation,

        level: HANDS.HIGH_CARD,
        levelValue: "HIGH_CARD",
        cards: [...this.sortHand(hand).slice(-5).reverse()],
        hand,
        pocketCards,
      };
    }
    handEvaluation.handValue =
      (handEvaluation.sortedCardsByValue
        ? handEvaluation.sortedCardsByValue
        : handEvaluation.cards
      )
        .map((card) => (card ? this.getRank(card) : 0))
        .reduce((acc, cur, i, arr) => {
          return acc + cur * Math.pow(10, (arr.length - i - 1) * 2);
        }, 0) +
      handEvaluation.level * Math.pow(10, handEvaluation.cards.length * 2 + 1);
    return handEvaluation;
  },

  /**
   * Returns the straight flush in the hand or null if there is none;
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The straight flush if it exists, otherwise null.
   */
  getStraightFlush(hand) {
    const flush = this.getCompleteFlush(hand);
    if (!flush) {
      return null;
    }
    const straightFlush = this.getStraight(flush);
    return straightFlush;
  },

  /**
   * Return the highest 5-cards flush in the hand or null if there is none.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The array of cards making flush if it exists, otherwise null.
   */
  getFlush(hand) {
    const flush = this.getCompleteFlush(hand);
    if (flush) {
      return flush.slice(-5);
    } else {
      return null;
    }
  },

  /**
   * Return 5+ card flush in the hand or null if there is none.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The array of cards making flush if it exists, otherwise null.
   */
  getCompleteFlush(hand) {
    const suitMap = this.getSuitMap(hand);
    const suit = Object.keys(suitMap).find((suit) => suitMap[suit] >= 5);
    if (suit) {
      return this.sortHand(hand.filter((card) => this.getSuit(card) === suit));
    } else {
      return null;
    }
  },

  /**
   * Return the highest 5-cards straight in the hand or null if there is none.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The array of cards making straight if it exists, otherwise null.
   */
  getStraight(hand) {
    const handWithoutSuits = hand.map((card) => card[0]).join("");
    const straights = [
      "TJQKA".split(""),
      "9TJQK".split(""),
      "89TJQ".split(""),
      "789JT".split(""),
      "6789T".split(""),
      "56789".split(""),
      "45678".split(""),
      "34567".split(""),
      "23456".split(""),
      "A2345".split(""),
    ];
    const highestStraight = straights.find((s) =>
      s.every((c) => handWithoutSuits.includes(c))
    );
    if (!highestStraight) {
      return null;
    }
    const straight = highestStraight.map((card) =>
      hand.find((h) => h[0] === card)
    );
    return straight;
  },

  /**
   * Returns a map with the rank of each card in the hand as the key and the number of cards with that rank as the value.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The map of the ranks of the cards in the hand.
   */
  getRankMap(hand) {
    const ranks = hand.map((card) => this.getRank(card));
    const rankMap = {};
    ranks.forEach((rank) => {
      if (rankMap[rank]) {
        rankMap[rank]++;
      } else {
        rankMap[rank] = 1;
      }
    });
    return rankMap;
  },

  /**
   * Returns a map with the suit of each card in the hand as the key and the number of cards with that suit as the value.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The map of the suits of the cards in the hand.
   */
  getSuitMap(hand) {
    const suitMap = {};
    hand.forEach((card) => {
      const suit = this.getSuit(card);
      if (suitMap[suit]) {
        suitMap[suit]++;
      } else {
        suitMap[suit] = 1;
      }
    });
    return suitMap;
  },

  /**
   * Returns the pairs of cards in the hand, represented as an array of arrays of cards (one array per pair). Empty array if the hand has no pair.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The pairs of cards in the hand.
   */
  getPairs(hand) {
    const pairs = [];
    const rankMap = this.getRankMap(hand);
    Object.keys(rankMap).forEach((rank) => {
      if (rankMap[rank] === 2) {
        pairs.push(
          hand.filter((card) => this.getRank(card) === parseInt(rank))
        );
      }
    });
    return pairs;
  },
  /**
   * Returns the sets of cards in the hand, represented as an array of arrays of cards (one array per set). Empty array if the hand has no set.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The sets of cards in the hand.
   */
  getSets(hand) {
    const sets = [];
    const rankMap = this.getRankMap(hand);
    Object.keys(rankMap).forEach((rank) => {
      if (rankMap[rank] === 3) {
        sets.push(hand.filter((card) => this.getRank(card) === parseInt(rank)));
      }
    });
    return sets;
  },

  /**
   * Returns the quads of cards in the hand, represented as an array of arrays of cards (one array per quad). Empty array if the hand has no quad.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The quads of cards in the hand.
   */
  getQuads(hand) {
    const quads = [];
    const rankMap = this.getRankMap(hand);
    Object.keys(rankMap).forEach((rank) => {
      if (rankMap[rank] === 4) {
        quads.push(
          hand.filter((card) => this.getRank(card) === parseInt(rank))
        );
      }
    });
    return quads;
  },

  /**
   * Returns the highest card in the hand.
   * @param {*} hand The hand to verify, represented as an array of cards.
   * @returns The highest card in the hand.
   */
  getHighestCard(hand) {
    return this.sortHand(hand).at(-1);
  },

  /**
   * Return the hand passed as an argument with sorted cards
   * @param {*} hand The hand to sort, represented as an array of cards.
   * @returns The sorted hand.
   */
  sortHand(hand) {
    return hand.sort((a, b) => this.getRank(a) - this.getRank(b));
  },

  /**
   * Return the suit of the card
   * @param {*} card The card to get the suit of.
   * @returns The suit of the card.
   */
  getSuit(card) {
    return card.slice(1, 2).toLowerCase();
  },

  /**
   * Return the rank of the card
   * @param {*} card The card to get the rank of.
   * @returns The rank of the card.
   */
  getRank(card) {
    return RANKS[card[0]];
  },

  /**
   * Remove cards from the hand and return the resulting array of cards.
   * @param {*} hand The hand to filter, represented as an array of cards.
   * @param {*} removedCards The cards to remove from the hand, represented as an array of cards.
   * @returns The filtered hand.
   */
  filterHand(hand, removedCards) {
    return hand.filter((card) => !removedCards.includes(card));
  },
};

export default evaluator;
