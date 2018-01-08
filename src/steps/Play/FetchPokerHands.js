exports = module.exports = (worker, logger, require) => () => {
  const Step = require("steps/Step");
  return Step("Poker.Play", function FetchPokerHands() {
    return worker.sendAction("poker", "deal").then((payload) => {
      if (!payload.card_list) {
        logger.debug("From initialize model");
        return worker.sendAction("poker", "initialize");
      } else {
        logger.debug("From deal model");
        return payload;
      }
    });
  });
};
exports["@require"] = ["worker", "logger", "require"];
