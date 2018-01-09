const cardRect = {
  left: 170, // 201
  top: 294, // 294
  width: 77, // 77
  height: 109, // 109
  margin: 6 // 6
};

exports = module.exports = (worker, server, run, require) => (indexes) => {
  const Step = require("steps/Step");
  const Wait = require("steps/Wait");
  const Click = require("steps/Click");
  const clickCard = () => {
    return worker.sendAction("element", "#canv").then((result) => {
      const index = indexes.shift();
      if (!index) return true;
  
      const mult = index - 2;
      result.scale = 1.5;
      result.x += cardRect.left + (mult * (cardRect.width + cardRect.margin));
      result.y += cardRect.top;
      result.width = cardRect.width;
      result.height = cardRect.height;
      return server.makeRequest("click", result);
    });
  };

  function ClickCard() {
    return clickCard().then(() => {
      return run(Click.Condition(".prt-ok-shine"));
    }).then(() => {
      return run(Wait(".prt-start,.prt-yes"));
    });
  }
  return Step("Poker", ClickCard);
};
exports["@require"] = ["worker", "server", "run", "require"];
