exports = module.exports = (requireCore, run) => (next) => {
  const Step = requireCore("steps/Step");
  const Click = requireCore("steps/Click");
  const Check = requireCore("steps/Check");

  return Step("Poker.Play", function CheckDealButton() {
    return run(Check(".prt-start-shine")).then(() => {
      return run(Click.Condition(".prt-start-shine")).then(next);
    }, next);
  });
};
exports["@require"] = ["require", "run", "process"];
