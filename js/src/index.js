(function() {
  var Finder, LocalVar, NamedFunction, VarStatement, mergeOptionsInto, splice,
    slice = [].slice;

  require("../../../lotus-require");

  NamedFunction = require("named-function");

  Finder = require("finder");

  VarStatement = module.exports = NamedFunction("VarStatement", function(options) {
    var _startIndex, endIndex, name, position;
    if (!(this instanceof VarStatement)) {
      return new VarStatement(options);
    }
    this.varCount = 0;
    this.vars = {};
    _startIndex = null;
    Object.defineProperty(this, "startIndex", {
      enumerable: true,
      get: function() {
        return _startIndex != null ? _startIndex : _startIndex = this.endIndex - this.contents.length - 4;
      },
      set: function(newValue) {
        return _startIndex = newValue;
      }
    });
    mergeOptionsInto(this, options, VarStatement.options);
    LocalVar.find.target = this.contents;
    while (true) {
      name = LocalVar.find.next();
      if (name == null) {
        break;
      }
      position = this.varCount++;
      endIndex = LocalVar.find.offset;
      this.vars[name] = LocalVar({
        name: name,
        position: position,
        endIndex: endIndex
      });
    }
    return this;
  });

  VarStatement.find = Finder(/var ([^\;]+)/);

  VarStatement.first = function(func) {
    var statement;
    if (typeof func === "function") {
      func = func.toString();
    } else if (typeof func !== "string") {
      throw TypeError("'func' must be a Function or String.");
    }
    statement = VarStatement.find(func);
    if (statement == null) {
      return null;
    }
    return VarStatement({
      contents: statement,
      endIndex: VarStatement.find.offset,
      origin: VarStatement.find.target
    });
  };

  VarStatement.options = {
    endIndex: Number,
    contents: String,
    origin: String
  };

  VarStatement.prototype.remove = function() {
    var contents, i, len, lvar, lvars, names, removedCharCount, result, varCount;
    names = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    removedCharCount = 0;
    result = this.origin;
    varCount = this.varCount - names.length;
    lvars = names.map((function(_this) {
      return function(name) {
        return _this.vars[name];
      };
    })(this));
    lvars = lvars.sort(function(a, b) {
      if (a.position > b.position) {
        return 1;
      } else {
        return -1;
      }
    });
    for (i = 0, len = lvars.length; i < len; i++) {
      lvar = lvars[i];
      if (varCount === 0) {
        result = splice(this.origin, this.startIndex, this.endIndex + 1);
        break;
      } else {
        contents = this.getContents(lvar);
        contents.startIndex -= removedCharCount;
        contents.endIndex -= removedCharCount;
        removedCharCount += contents.length;
        result = splice(result, contents.startIndex, contents.endIndex);
      }
    }
    return result;
  };

  VarStatement.prototype.getContents = function(lvar) {
    var contents;
    contents = {};
    contents.endIndex = this.startIndex + lvar.endIndex + 4;
    contents.startIndex = contents.endIndex - lvar.name.length;
    contents.length = contents.endIndex - contents.startIndex;
    if (lvar.position === 0) {
      contents.endIndex += 2;
    } else {
      contents.startIndex -= 2;
    }
    return contents;
  };

  LocalVar = exports.LocalVar = NamedFunction("LocalVar", function(options) {
    if (!(this instanceof LocalVar)) {
      return new LocalVar(options);
    }
    return mergeOptionsInto(this, options, LocalVar.options);
  });

  LocalVar.find = Finder(/[^\,\;\s]+/);

  LocalVar.options = {
    name: String,
    position: Number,
    endIndex: Number
  };

  splice = function(string, start, end) {
    var slices;
    slices = [];
    slices.push(string.slice(0, start));
    slices.push(string.slice(end));
    return slices.join("");
  };

  mergeOptionsInto = function(target, options, types) {
    var key, type, value;
    for (key in types) {
      type = types[key];
      value = options[key];
      if ((value != null) && value.constructor === type) {
        target[key] = value;
      } else {
        throw TypeError("'options." + key + "' must be a " + type.name + ", but instead was a " + (value != null ? value.constructor.name : 'Void'));
      }
    }
    return target;
  };

}).call(this);

//# sourceMappingURL=map/index.js.map
