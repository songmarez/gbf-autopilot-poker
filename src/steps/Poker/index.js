const PokerHelper = require("../../helpers/PokerHelper");

exports = module.exports = (requireCore, inject, process, env, config) => () => {
  env.poker = {
    helper: new PokerHelper,
    cap: {
      round: Number(config.PokerMode.WinningRoundCap),
      chips: Number(config.PokerMode.WinningChipsCap)
    },
    rate: {
      base: Number(config.PokerMode.WinningRateBase),
      modifier: Number(config.PokerMode.WinningRateModifier)
    }
  };

  const Wait = requireCore("steps/Wait");
  const Step = requireCore("steps/Step");
  const Timeout = requireCore("steps/Timeout");
  
  const PlayPoker = inject(require("./PlayPoker"));
  const PlayDoubleUp = inject(require("./PlayDoubleUp"));
  const CheckDealButton = inject(require("./CheckDealButton"));
  const CheckDoubleUp = inject(require("./CheckDoubleUp"));

  const playPoker = PlayPoker(PlayDoubleUp());
  const playDoubleUp = PlayDoubleUp(PlayPoker());
  const checkDoubleUp = CheckDoubleUp(playDoubleUp, playPoker);
  const checkDealButton = CheckDealButton(checkDoubleUp);

  return Step(function Poker() {
    return process([
      Wait(".cnt-poker"), Timeout(1500),
      checkDealButton
    ]);
  });
};
exports["@require"] = ["require", "inject", "process", "env", "config"];
