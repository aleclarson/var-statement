var Factory, Finder, LocalVar, SortedArray, VarStatement, assertType, isType, ref, splice;

ref = require("type-utils"), isType = ref.isType, assertType = ref.assertType;

SortedArray = require("sorted-array");

Factory = require("factory");

Finder = require("finder");

LocalVar = require("./LocalVar");

module.exports = VarStatement = Factory("VarStatement", {
  optionTypes: {
    endIndex: Number,
    contents: String,
    source: String
  },
  customValues: {
    startIndex: {
      lazy: function() {
        return this.endIndex - this.contents.length - 4;
      }
    }
  },
  initFrozenValues: function(options) {
    return options;
  },
  initValues: function() {
    return {
      nodeCount: 0,
      nodeMap: {}
    };
  },
  init: function() {
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
  },
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
  },
  statics: {
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
  }
});

splice = function(string, start, end) {
  var slices;
  slices = [];
  slices.push(string.slice(0, start));
  slices.push(string.slice(end));
  return slices.join("");
};

//# sourceMappingURL=../../map/src/VarStatement.map
