exports = module.exports = (requireCore, inject, process) => () => {
  const Wait = requireCore("steps/Wait");
  const Step = requireCore("steps/Step");
  
  const PlayPoker = inject(require("./Play/PlayPoker"));
  const PlayDoubleUp = inject(require("./Play/PlayDoubleUp"));
  const CheckDealButton = inject(require("./Play/CheckDealButton"));
  const CheckDoubleUp = inject(require("./Play/CheckDoubleUp"));

  const checkDoubleUp = CheckDoubleUp(PlayDoubleUp(), PlayPoker());
  const checkDealButton = CheckDealButton(checkDoubleUp);

  return Step(function Poker() {
    return process([
      Wait(".cnt-poker"),
      checkDealButton
    ]);
  });
};
exports["@require"] = ["require", "inject", "process"];
