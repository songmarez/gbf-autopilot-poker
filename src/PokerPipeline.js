exports = module.exports = (logger, inject, process, config, requireCore) => () => {
  const Location = requireCore("steps/Location");
  const Poker = inject(require("./steps/Poker"));
  const StartPoker = inject(require("./steps/StartPoker"));

  const pipeline = [
    Location(),
    (_, location) => {
      const steps = [];
      if (location.hash.startsWith("#casino/game/poker")) {
        steps.push(Poker());
      } else {
        const chipAmount = Number(config.PokerMode.ChipAmount);
        steps.push(StartPoker(chipAmount));
      }

      steps.push(() => process(pipeline));
      return process(steps);
    }
  ];
  return pipeline;
};
exports.test = (config) => config.PokerMode.Enabled;
exports["@require"] = ["logger", "inject", "process", "config", "require"];
exports["@name"] = "Poker";
