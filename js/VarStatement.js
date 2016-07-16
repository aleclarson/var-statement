var Finder, LocalVar, SortedArray, Type, VarStatement, assertType, isType, splice, type;

SortedArray = require("sorted-array");

assertType = require("assertType");

Finder = require("finder");

isType = require("isType");

Type = require("Type");

LocalVar = require("./LocalVar");

type = Type("VarStatement");

type.optionTypes = {
  endIndex: Number,
  contents: String,
  source: String
};

type.defineProperties({
  startIndex: {
    lazy: function() {
      return this.endIndex - this.contents.length - 4;
    }
  }
});

type.defineFrozenValues({
  endIndex: function(options) {
    return options.endIndex;
  },
  contents: function(options) {
    return options.contents;
  },
  source: function(options) {
    return options.source;
  }
});

type.defineValues({
  nodeCount: 0,
  nodeMap: function() {
    return {};
  }
});

type.initInstance(function() {
  var endIndex, name, position;
  LocalVar.find.target = this.contents;
  while (true) {
    name = LocalVar.find.next();
    if (!name) {
      break;
    }
    position = this.nodeCount++;
    endIndex = LocalVar.find.offset;
    this.nodeMap[name] = LocalVar({
      name: name,
      position: position,
      endIndex: endIndex
    });
  }
});

type.defineMethods({
  remove: function(names) {
    var contents, i, j, len, len1, name, newNodeCount, node, nodes, removedCharCount, result;
    if (!Array.isArray(names)) {
      names = [names];
    }
    nodes = SortedArray([], function(a, b) {
      if (a.position > b.position) {
        return 1;
      } else {
        return -1;
      }
    });
    for (i = 0, len = names.length; i < len; i++) {
      name = names[i];
      node = this.nodeMap[name];
      if (!node) {
        continue;
      }
      nodes.insert(node);
    }
    newNodeCount = this.nodeCount - nodes.length;
    if (newNodeCount === 0) {
      splice(this.source, this.startIndex, this.endIndex + 1);
    }
    removedCharCount = 0;
    result = this.source;
    for (j = 0, len1 = nodes.length; j < len1; j++) {
      node = nodes[j];
      contents = this.getContents(node);
      contents.startIndex -= removedCharCount;
      contents.endIndex -= removedCharCount;
      removedCharCount += contents.length;
      result = splice(result, contents.startIndex, contents.endIndex);
    }
    return result;
  },
  getContents: function(node) {
    var contents;
    contents = {};
    contents.endIndex = this.startIndex + node.endIndex + 4;
    contents.startIndex = contents.endIndex - node.name.length;
    contents.length = contents.endIndex - contents.startIndex;
    if (node.position === 0) {
      contents.endIndex += 2;
    } else {
      contents.startIndex -= 2;
    }
    return contents;
  }
});

type.defineStatics({
  find: Finder({
    regex: /var ([^\;]+)/,
    group: 1
  }),
  first: function(source) {
    var contents;
    if (isType(source, Function)) {
      source = source.toString();
    } else {
      assertType(source, String);
    }
    contents = VarStatement.find(source);
    if (!contents) {
      return null;
    }
    return VarStatement({
      source: source,
      contents: contents,
      endIndex: VarStatement.find.offset
    });
  }
});

module.exports = VarStatement = type.build();

splice = function(string, start, end) {
  var slices;
  slices = [];
  slices.push(string.slice(0, start));
  slices.push(string.slice(end));
  return slices.join("");
};

//# sourceMappingURL=map/VarStatement.map
