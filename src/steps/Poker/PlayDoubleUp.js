exports = module.exports = (env, requireCore, run, process, logger, worker) => (playPoker) => {
  const Step = requireCore("steps/Step");
  const Wait = requireCore("steps/Wait");
  const Check = requireCore("steps/Check");
  const Click = requireCore("steps/Click");

  const helper = env.poker.helper;
  const continuePoker = () => {
    return process([
      Click.Condition(".prt-no,.prt-start-shine"),
      Wait(".prt-start-shine,.prt-ok-shine"),
      Click.Condition(".prt-start-shine"),
      playPoker
    ]);
  };
  const continueDoubleUp = () => {
    return process([
      Click.Condition(".prt-yes-shine"),
      PlayDoubleUp
    ]);
  };
  const checkDoubleUp = () => {
    return worker.sendAction("poker", "doubleResult").then((payload) => {
      if (payload.result == "win") {
        env.poker.winningRounds++;
        env.poker.winningChips = payload.pay_medal;
      }
      helper.rememberCard(payload.card_first);

      const nextPredict = helper.predictDouble(payload.card_second);
      const highestRate = nextPredict.high > nextPredict.low ?
        nextPredict.high : nextPredict.low;
      const maximumRate = 1.0;
      var minimumRate = 0;

      if (env.poker.winningChips >= env.poker.cap.chips) {
        // multiplier is calculated from how many chips are won that have passed the cap
        const rateMultiplier = (env.poker.winningChips / env.poker.cap.chips);
        minimumRate = env.poker.rate.base + (env.poker.rate.modifier * rateMultiplier);
      } else if (env.poker.winningRounds >= env.poker.cap.round) {
        // multiplier is calculated from how many winning rounds have passed the cap
        const rateMultiplier = (env.poker.winningRounds - env.poker.cap.round);
        minimumRate = env.poker.rate.base + (env.poker.rate.modifier * rateMultiplier);
      }
      minimumRate = minimumRate > maximumRate ? maximumRate : minimumRate;

      // stop double-up
      if (highestRate < minimumRate) {
        return continuePoker();
      } else {
        return continueDoubleUp();
      }
    });
  };

  function PlayDoubleUp() {
    logger.info("Playing double up");
    env.poker.winningRounds = 0;
    env.poker.winningChips = 0;
    return process([
      Wait(".prt-double-select"),
      () => worker.sendAction("poker", "doubleStart"),
      (_, payload) => {
        const card = payload.card_first;
        const prediction = helper.predictDouble(card);
        logger.debug("Prediction:", prediction);
        if (prediction.low > prediction.high) {
          return "low";
        } else if (prediction.low < prediction.high) { 
          return "high";
        } else { // in case of 50:50, just randomize
          return Math.random() < 0.5 ? "low" : "high";
        }
      },
      (_, select) => {
        return run(Click(".prt-double-select[select='" + select + "']"));
      },
      Wait(".prt-start,.prt-yes"),
      () => run(Check(".prt-yes")).then(checkDoubleUp, continuePoker)
    ]);
  }
  return Step("Poker", PlayDoubleUp);
};
exports["@require"] = ["env", "require", "run", "process", "logger", "worker"];
