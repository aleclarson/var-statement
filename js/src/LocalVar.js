var Factory, Finder;

Factory = require("factory");

Finder = require("finder");

module.exports = Factory("LocalVar", {
  optionTypes: {
    name: String,
    position: Number,
    endIndex: Number
  },
  initValues: function(options) {
    return options;
  },
  statics: {
    find: Finder(/[^\,\;\s]+/)
  }
});

//# sourceMappingURL=../../map/src/LocalVar.map
