(function() {
  var VarStatement;

  VarStatement = require("../..");

  describe("VarStatement.first(Function)", function() {
    return it("returns the first 'var' statement in a Function", function() {
      var statement;
      statement = VarStatement.first(function () { var foo; var bar; });
      return expect(statement.vars.foo).not.toBe(null);
    });
  });

  describe("VarStatement::remove(String...)", function() {
    it("removes the entire 'var' statement if all variable names are removed", function() {
      var result, statement;
      statement = VarStatement.first(function () { var foo; });
      result = statement.remove("foo");
      return expect(result).toBe("function () {  }");
    });
    it("supports removing multiple variables at once", function() {
      var result, statement;
      statement = VarStatement.first(function () { var nut, foo, pin, bar, zee; });
      result = statement.remove("foo", "bar");
      return expect(result).toBe("function () { var nut, pin, zee; }");
    });
    it("can remove the first variable", function() {
      var result, statement;
      statement = VarStatement.first(function () { var foo, bar, zee; });
      result = statement.remove("foo");
      return expect(result).toBe("function () { var bar, zee; }");
    });
    it("can remove the last variable", function() {
      var result, statement;
      statement = VarStatement.first(function () { var foo, bar, zee; });
      result = statement.remove("zee");
      return expect(result).toBe("function () { var foo, bar; }");
    });
    return it("can remove a middle variable", function() {
      var result, statement;
      statement = VarStatement.first(function () { var foo, bar, zee; });
      result = statement.remove("bar");
      return expect(result).toBe("function () { var foo, zee; }");
    });
  });

}).call(this);

//# sourceMappingURL=map/index.js.map
