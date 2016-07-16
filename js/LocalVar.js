var Finder, Type, fromArgs, type;

fromArgs = require("fromArgs");

Finder = require("finder");

Type = require("Type");

type = Type("LocalVar");

type.optionTypes = {
  name: String,
  position: Number,
  endIndex: Number
};

type.defineValues({
  name: fromArgs("name"),
  position: fromArgs("position"),
  endIndex: fromArgs("endIndex")
});

type.defineStatics({
  find: Finder(/[^\,\;\s]+/)
});

module.exports = type.build();

//# sourceMappingURL=map/LocalVar.map
