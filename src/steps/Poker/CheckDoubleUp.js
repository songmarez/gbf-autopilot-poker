exports = module.exports = (requireCore, run) => (next, stop) => {
  const Step = requireCore("steps/Step");
  const Check = requireCore("steps/Check");

  return Step("Poker", function CheckDoubleUp() {
    return run(Check(".prt-low-shine")).then(next, stop);
  });
};
exports["@require"] = ["require", "run"];
