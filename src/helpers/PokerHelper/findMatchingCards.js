const forEach = require("lodash/forEach");
const has = require("lodash/has");

module.exports = function findMatchingCards(cards, matchJoker) {
  const matches = {
    rank: {},
    suit: {}
  };
  const hasMatch = (type, card) => {
    return has(matches[type], card[type]);
  };
  const addMatch = (type, card, index) => {
    if (has(matches[type], card[type])) matches[type][card[type]].push(index);
    else matches[type][card[type]] = [index];
  };

  forEach(["rank", "suit"], (type) => {
    forEach(cards, (initialCard, initialIndex) => {
      // no need to check existing rank/suit
      if (hasMatch(type, initialCard)) return;
      // skip joker cards
      if (initialCard[type] >= 99) return;
      addMatch(type, initialCard, initialIndex);
      forEach(cards, (card, index) => {
        if (index == initialIndex) return;
        if (card[type] == initialCard[type]) {
          addMatch(type, card, index);
        } else if (matchJoker && card[type] >= 99) { // check for joker cards
          addMatch(type, initialCard, index);
        }
      });
    });
  });

  return matches;
};
