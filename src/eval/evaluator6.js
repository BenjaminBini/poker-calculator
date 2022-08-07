import { binariesById, suibitById } from "./bin-bit-table";
import { suits } from "./dptables";
import { hashQuinary } from "./hash";
import { flush } from "./hashtable";
import { noflush6 } from "./hashtable6";

export default function evaluate6cards(a, b, c, d, e, f) {
  var suit_hash = 0;
  const suit_binary = [0, 0, 0, 0]; // 4
  const quinary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 13
  var hash;

  suit_hash += suibitById[a];
  quinary[a >> 2]++;
  suit_hash += suibitById[b];
  quinary[b >> 2]++;
  suit_hash += suibitById[c];
  quinary[c >> 2]++;
  suit_hash += suibitById[d];
  quinary[d >> 2]++;
  suit_hash += suibitById[e];
  quinary[e >> 2]++;
  suit_hash += suibitById[f];
  quinary[f >> 2]++;

  if (suits[suit_hash]) {
    suit_binary[a & 0x3] |= binariesById[a];
    suit_binary[b & 0x3] |= binariesById[b];
    suit_binary[c & 0x3] |= binariesById[c];
    suit_binary[d & 0x3] |= binariesById[d];
    suit_binary[e & 0x3] |= binariesById[e];
    suit_binary[f & 0x3] |= binariesById[f];

    return flush[suit_binary[suits[suit_hash] - 1]];
  }

  hash = hashQuinary(quinary, 13, 6);

  return noflush6[hash];
}
