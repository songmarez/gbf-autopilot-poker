exports = module.exports = (requireCore, inject, run, logger) => () => {
  const Step = requireCore("steps/Step");
  /*
  const Check = requireCore("steps/Check");
  */
  const Fetch = inject(require("./FetchPokerHands"));

  return Step("Poker.Play", function PlayPoker() {
    logger.debug("Playing poker");
    return run(Fetch()).then((payload) => {
      logger.debug(payload.card_list);
    });
  });
};
exports["@require"] = ["require", "inject", "run", "logger"];
