const gameIdMap = {
  1: "200010",
  10: "200020",
  100: "200030",
  1000: "200040"
};

exports = module.exports = (require, process) => (chip) => {
  chip = chip || 1000;
  const gameId = gameIdMap[chip];
  if (!gameId) throw new Error("Unknown poker chip bet '" + chip + "'!");

  const Step = require("steps/Step");
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  const Location = require("steps/Location");

  return Step("Poker", function Start() {
    return process([
      Location.Change("#casino/list/poker"),
      Wait(".atx-lead-link"),
      Click.Condition(".btn-game[game-id='" + gameId + "']", "!.pop-poker.pop-show"),
      Click.Condition(".btn-double.type1", ".pop-poker.pop-show")
    ]);
  });
};
exports["@require"] = ["require", "process"];
