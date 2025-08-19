import { describe, it, expect } from "vitest";
import { handValue } from "..";

describe("handValue", () => {
  it("counts face cards as 10", () => {
    expect(handValue([{r: 13, s: "H"}, {r: 12, s: "D"}])).toBe(20);
  });
  it("handles soft ace", () => {
    expect(handValue([{r: 1, s: "S"}, {r: 9, s: "C"}])).toBe(20);
  });
  it("reduces soft ace when bust", () => {
    expect(handValue([{r: 1, s: "S"}, {r: 9, s: "C"}, {r: 9, s: "H"}])).toBe(19);
  });
});
