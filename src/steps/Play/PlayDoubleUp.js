exports = module.exports = (requireCore, inject, run, logger) => () => {
  const Step = requireCore("steps/Step");
  /*
  const Check = requireCore("steps/Check");
  const Fetch = inject(require("./FetchPokerHands"));
  */

  return Step("Poker.Play", function PlayDoubleUp() {
    logger.debug("Playing double up");
    return true;
  });
};
exports["@require"] = ["require", "inject", "run", "logger"];
