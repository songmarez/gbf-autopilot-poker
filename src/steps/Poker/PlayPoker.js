exports = module.exports = (env, requireCore, inject, run, logger) => (playDoubleUp) => {
  const Step = requireCore("steps/Step");
  const Wait = requireCore("steps/Wait");
  const Check = requireCore("steps/Check");
  const Click = requireCore("steps/Click");
  const Timeout = requireCore("steps/Timeout");
  const Fetch = inject(require("./FetchPokerHands"));
  const ClickCard = inject(require("./ClickCard"));

  const continueDoubleUp = () => {
    return run(Click.Condition(".prt-yes-shine")).then(playDoubleUp);
  };

  const continuePoker = () => {
    return run(Click.Condition(".prt-start-shine")).then(PlayPoker);
  };

  const helper = env.poker.helper;
  function PlayPoker() {
    logger.info("Playing poker");
    return run(Wait(".prt-ok-shine")).then(() => {
    }).then(() => {
      return run(Timeout(500));
    }).then(() => {
      return run(Fetch());
    }).then((cards) => {
      const suggestion = helper.keepSuggestion(cards);
      logger.debug("Suggestion:", suggestion.name, suggestion.score);
      return run(ClickCard(suggestion.indexes));
    }).then(() => {
      return run(Check(".prt-yes-shine")).then(continueDoubleUp, continuePoker);
    });
  }

  return Step("Poker", PlayPoker);
};
exports["@require"] = ["env", "require", "inject", "run", "logger"];
