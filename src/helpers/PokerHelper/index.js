const uniq = require("lodash/uniq");
const range = require("lodash/range");
const forEach = require("lodash/forEach");
const parseCard = require("./parseCard");
const parseCards = require("./parseCards");
const checkers = require("./checker").priority;

function PokerHelper() {
  this.winningRounds = 0;
  this.winningChips = 0;
  this.availableCards = {};
  this.resetAvailableCards();
}

PokerHelper.prototype.resetAvailableCards = function() {
  range(2, 15).forEach((rank) => {
    this.availableCards[rank] = 4;
  });
  return this;
};

PokerHelper.prototype.keepSuggestion = function(cards) {
  this.resetAvailableCards();
  cards = parseCards(cards);

  var result;
  forEach(checkers, (checker) => {
    result = checker(cards);
    if (result !== false) {
      result.indexes = uniq(result.indexes);
      return false;
    }
  });
  return result;
};

PokerHelper.prototype.rememberCard = function(card) {
  card = parseCard(card);
  if (this.availableCards[card.rank] > 0) {
    this.availableCards[card.rank]--;
  }
  return this;
};

PokerHelper.prototype.predictDouble = function(card) {
  const initialRank = parseCard(card).rank;
  var high = 0, low = 0, total = 0;

  forEach(this.availableCards, (count, rank) => {
    // if our card is higher than this card, count as low
    if (initialRank > rank) {
      low += count;
    } else if (initialRank < rank) {
      high += count;
    } else {
      return;
    }
    total += count;
  });

  return {
    low: low / total,
    high: high / total
  };
};

module.exports = PokerHelper;
