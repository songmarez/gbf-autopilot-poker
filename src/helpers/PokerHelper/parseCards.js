const map = require("lodash/map");
const parseCard = require("./parseCard");
module.exports = function parseCards(cards) {
  return map(cards, parseCard);
};
