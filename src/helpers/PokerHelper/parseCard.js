module.exports = function parseCard(card) {
  const [suit, rank] = card.split("_");
  const result = {
    suit: Number(suit),
    rank: Number(rank)
  };
  // in case of Ace, put it higher than others
  if (result.rank == 1) result.rank = 14;
  return result;
};
