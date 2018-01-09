const forEach = require("lodash/forEach");
const winningHands = require("./winningHands");
const findMatchingCards = require("./findMatchingCards");

exports = {};
exports.winning = function(cards) {
  var result = false;
  forEach(winningHands.priority, (checker) => {
    result = checker(cards);
    if (result !== false) {
      result = {
        name: checker.name,
        type: "winning",
        indexes: result.indexes,
        score: result.score
      };
      return false;
    }
  });
  return result;
};

exports.sameSuits = function(cards) {
  const matches = findMatchingCards(cards);
  var result = false;
  forEach(matches.suit, (indexes) => {
    if (indexes.length >= 4) {
      result = {
        name: "sameSuits",
        type: "keep",
        score: 0,
        indexes
      };
      return false;
    }
  });
  return result;
};

exports.onePair = function(cards) {
  const matches = findMatchingCards(cards, false);
  var result = false;
  forEach(matches.rank, (indexes) => {
    if (indexes.length >= 2) {
      result = {
        name: "onePair",
        type: "keep",
        score: 0,
        indexes
      };
      return false;
    }
  });
  return result;
};

exports.joker = function(cards) {
  var result = false;
  forEach(cards, ({rank}, index) => {
    if (rank >= 99) {
      result = {
        name: "joker",
        type: "keep",
        score: 0,
        indexes: [index]
      };
      return false;
    }
  });
  return result;
};

exports.none = function() {
  return {
    name: "none",
    type: "none",
    score: 0,
    indexes: []
  };
};

forEach(exports, (func, name) => {
  Object.defineProperty(func, "name", {value: name});
});

exports.priority = [
  exports.winning,
  exports.sameSuits,
  exports.onePair,
  exports.joker,
  exports.none
];

module.exports = exports;
