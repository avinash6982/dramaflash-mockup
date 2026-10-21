import {
  CARD_BONUSES,
  DEMO_MAX_WATCH_SECONDS,
  isTokenEarned,
  offersReward,
  shuffledBonuses,
  watchSecondsNeeded,
} from "../rewards";

describe("Streak Token rule", () => {
  it("needs 80% of a short episode", () => {
    expect(watchSecondsNeeded(10)).toBe(8);
    expect(isTokenEarned(7.9, 10)).toBe(false);
    expect(isTokenEarned(8, 10)).toBe(true);
  });

  it("is capped for the demo on long episodes, but still needs real watching", () => {
    expect(watchSecondsNeeded(192)).toBe(DEMO_MAX_WATCH_SECONDS); // 80% would be 153.6 s
    expect(isTokenEarned(0, 192)).toBe(false); // dragging the bar to the end earns nothing
    expect(isTokenEarned(DEMO_MAX_WATCH_SECONDS, 192)).toBe(true);
  });
});

describe("which episodes offer a reward", () => {
  it("only the free episodes before the cliffhanger", () => {
    // 3 free episodes: the first two offer a reward, the third leads into the lock and does not
    expect([0, 1, 2, 3].map((index) => offersReward(index, 3))).toEqual([true, true, false, false]);
  });
});

describe("the three cards", () => {
  it("always hold the same three bonuses in some order, with no losing card", () => {
    for (let i = 0; i < 20; i++) {
      expect([...shuffledBonuses()].sort((a, b) => a - b)).toEqual([...CARD_BONUSES]);
    }
    expect(Math.min(...CARD_BONUSES)).toBeGreaterThan(0);
  });

  it("uses the random function it is given", () => {
    expect(shuffledBonuses(() => 0)).not.toEqual(shuffledBonuses(() => 0.99));
  });

  it("two rewards can never pay for an episode on their own", () => {
    expect(Math.max(...CARD_BONUSES) * 2 + 15).toBeLessThan(85);
  });
});
