/* eslint-disable camelcase */

import { choose, dp } from "./dptables";

/**
 * Calculates the quinary hash using the dp table.
 *
 * @name hashQuinary
 * @function
 * @private
 * @param {Array} q array with an element for each rank, usually total of 13
 * @param {Number} len number of ranks, usually 13
 * @param {Number} k number of cards that make up the hand, 5, 6 or 7
 * @return {Number} hash sum
 */
function hashQuinary(q, len, k) {
  var sum = 0;

  for (var i = 0; i < len; i++) {
    if (dp[q[i]] === undefined) {
      debugger;
    }
    sum += dp[q[i]][len - i - 1][k];

    k -= q[i];

    if (k <= 0) break;
  }

  return sum;
}

/**
 * Calculates the binary hash using the choose table.
 *
 * @name hashBinary
 * @function
 * @private
 * @param {Array} q array with an element for each rank, usually total of 13
 * @param {Number} len number of ranks, usually 13
 * @param {Number} k number of cards that make up the hand, 5, 6 or 7
 * @return {Number} hash sum
 */
function hashBinary(q, len, k) {
  var sum = 0;

  for (var i = 0; i < len; i++) {
    if (q[i]) {
      if (len - i - 1 >= k) {
        sum += choose[len - i - 1][k];
      }

      k--;
      if (k === 0) break;
    }
  }

  return sum;
}

export { hashQuinary, hashBinary };
