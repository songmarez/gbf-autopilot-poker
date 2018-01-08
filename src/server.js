const PokerPipeline = require("./PokerPipeline");

module.exports = function() {
  this.coreExtension.pipelines.push(PokerPipeline);
};
