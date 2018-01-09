const map = require("lodash/map");
const uniq = require("lodash/uniq");
const keys = require("lodash/keys");
const forEach = require("lodash/forEach");
const findMatchingCards = require("./findMatchingCards");

exports = {};
exports.someOfAKind = function(cards, min, matchJoker) {
  const matches = findMatchingCards(cards, matchJoker);
  var result = false;
  forEach(matches.rank, (indexes) => {
    if (indexes.length == min) {
      result = indexes;
      return false;
    }
  });
  return result;
};

exports.royalStraightFlush = function(cards) {
  if (!exports.straightFlush(cards)) return false;
  var result = {
    score: 150,
    indexes: [0, 1, 2, 3, 4]
  };
  forEach(cards, (card) => {
    if (card.rank < 10 || card.rank > 14) {
      result = false;
      return false;
    } 
  });
  return result;
};

exports.fiveOfAKind = function(cards) {
  const indexes = exports.someOfAKind(cards, 5, true);
  if (indexes === false) return false;
  return {
    score: 40,
    indexes
  };
};
  
exports.straightFlush = function(cards) {
  const straight = exports.straight(cards);
  const flush = exports.flush(cards);
  const valid = straight !== false &&
    flush !== false;
  if (!valid) return false;
  return {
    score: 15,
    indexes: [0, 1, 2, 3, 4]
  };
};

exports.fourOfAKind = function(cards) {
  const indexes = exports.someOfAKind(cards, 4, true);
  if (indexes === false) return false;
  return {
    score: 10,
    indexes
  };
};

exports.fullHouse = function(cards) {
  const matches = findMatchingCards(cards, true);
  const numberOfRanks = keys(matches.rank).length;
  if (numberOfRanks != 2) return false;
  return {
    score: 5,
    indexes: [0, 1, 2, 3, 4]
  };
};

exports.flush = function(cards) {
  const matches = findMatchingCards(cards, true);
  var result = false;
  forEach(matches.suit, (indexes) => {
    if (indexes.length >= 5) {
      result = indexes;
      return false;
    }
  });
  if (result === false) return false;
  return {
    score: 4,
    indexes: result
  };
};

exports.straight = function(cards) {
  const ranks = map(cards, (card) => card.rank).sort((a, b) => {
    return a - b;
  });
  var lastRank = -1;
  var result = [0, 1, 2, 3, 4];
  var wasJoker = false;
  forEach(ranks, (rank) => {
    if (rank >= 99) {
      wasJoker = true;
      return;
    }
    if (lastRank == -1) {
      lastRank = rank;
      return;
    }
    if (wasJoker) {
      wasJoker = false;
    } else if (rank - lastRank != 1) {
      result = false;
      return false;
    }
    lastRank = rank;
  });

  if (result === false) return false;
  return {
    score: 3,
    indexes: result
  };
};

exports.threeOfAKind = function(cards) {
  const indexes = exports.someOfAKind(cards, 3, true);
  if (indexes === false) return false;
  return {
    score: 1,
    indexes
  };
};

exports.twoPair = function(cards) {
  const matches = findMatchingCards(cards, true);
  const pairs = [];
  forEach(matches.rank, (indexes) => {
    if (indexes.length == 2) pairs.push(indexes);
    if (pairs.length >= 2) return false;
  });

  if (pairs.length < 2) return false;

  var result = [];
  forEach(pairs, (pair) => {
    forEach(pair, (index) => {
      result.push(index);
    });
  });
  result = uniq(result);

  if (result.length != 4) return false;
  return {
    score: 1,
    indexes: result
  };
};

forEach(exports, (func, name) => {
  Object.defineProperty(func, "name", {value: name});
});

exports.priority = [
  exports.royalStraightFlush,
  exports.fiveOfAKind,
  exports.straightFlush,
  exports.fourOfAKind,
  exports.fullHouse,
  exports.flush,
  exports.straight,
  exports.threeOfAKind,
  exports.twoPair
];

module.exports = exports;
