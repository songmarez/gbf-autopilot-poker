const assert = require("chai").assert;
const PokerHelper = require("../src/helpers/PokerHelper");
const helper = new PokerHelper;

// pattern: <suit>_<rank>
const winningPatterns = {
  royalStraightFlush: ["1_10", "1_11", "1_12", "1_13", "1_14"],
  fiveOfAKind: ["1_2", "2_2", "3_2", "4_2", "99_99"],
  straightFlush: ["1_2", "1_3", "1_4", "1_5", "1_6"],
  fourOfAKind: ["1_2", "2_2", "3_2", "4_2", "1_3"],
  fullHouse: ["1_2", "2_2", "3_2", "4_3", "1_3"],
  flush: ["1_3", "1_4", "1_10", "1_11", "1_5"],
  straight: ["1_3", "2_4", "3_5", "2_6", "4_7"],
  threeOfAKind: ["1_3", "2_3", "3_3", "2_6", "4_7"],
  twoPair: ["1_3", "2_3", "3_5", "2_6", "4_6"],
};
const winningOrder = [
  "royalStraightFlush",
  "fiveOfAKind",
  "straightFlush",
  "fourOfAKind",
  "fullHouse",
  "straight",
  "threeOfAKind",
  "twoPair"
];

const keepPatterns = {
  sameSuits: ["1_2", "1_3", "1_4", "1_5", "2_7"],
  onePair: ["1_3", "2_3", "4_5", "2_1", "4_2"],
  joker: ["1_1", "2_2", "3_3", "4_4", "99_99"]
};
const keepOrder = [
  "sameSuits",
  "onePair",
  "joker"
];

const nonePattern = ["1_1", "2_2", "3_3", "4_4", "4_5"];

function assertHandAlgorithms(result, type, name, min) {
  assert.isNotFalse(result);
  assert.isObject(result);
  assert.propertyVal(result, "name", name);
  assert.propertyVal(result, "type", type);
  assert.isAtLeast(result.indexes.length, min);
}

describe("Test poker winning hand algorithms", function() {
  winningOrder.forEach(function(key) {
    it("should be a " + key, function() {
      const cards = winningPatterns[key];
      const result = helper.keepSuggestion(cards);
      assertHandAlgorithms(result, "winning", key, 3);
    });
  });
});

describe("Test poker keep hand algorithms", function() {
  keepOrder.forEach(function(key) {
    it("should be a " + key, function() {
      const cards = keepPatterns[key];
      const result = helper.keepSuggestion(cards);
      assertHandAlgorithms(result, "keep", key, 1);
    });
  });
});

describe("Test poker no keep hand algorithm", function() {
  it("should be a none", function() {
    const cards = nonePattern;
    const result = helper.keepSuggestion(cards);
    assertHandAlgorithms(result, "none", "none", 0);
  });
});

describe("Test double-up prediction", function() {
  it("should be 50-50 chance", function() {
    const chance = helper.predictDouble("1_8");
    assert.propertyVal(chance, "high", 0.5);
    assert.propertyVal(chance, "low", 0.5);
  });

  it("should be 100% high chance", function() {
    const chance = helper.predictDouble("1_2");
    assert.propertyVal(chance, "high", 1.0);
    assert.propertyVal(chance, "low", 0.0);
  });

  it("should be 100% low chance", function() {
    const chance = helper.predictDouble("1_14");
    assert.propertyVal(chance, "high", 0.0);
    assert.propertyVal(chance, "low", 1.0);
  });

  it("should be >50% high chance", function() {
    const chance = helper.predictDouble("1_5");
    assert.isAbove(chance.high, 0.5);
    assert.isBelow(chance.low, 0.5);
  });

  it("should be >50% low chance", function() {
    const chance = helper.predictDouble("1_9");
    assert.isAbove(chance.low, 0.5);
    assert.isBelow(chance.high, 0.5);
  });
});
