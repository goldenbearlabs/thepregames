export type Card = { r: number; s: "H"|"D"|"C"|"S" };
export type Hand = Card[];
export const handValue = (h: Hand) => {
  let sum = 0, aces = 0;
  for (const c of h) {
    const v = c.r > 10 ? 10 : c.r;
    if (c.r === 1) { aces++; sum += 11; } else { sum += v; }
  }
  while (sum > 21 && aces > 0) { sum -= 10; aces--; }
  return sum;
};
