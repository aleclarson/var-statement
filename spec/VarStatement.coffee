
VarStatement = require "../.."

describe "VarStatement.first(Function)", ->

  it "returns the first 'var' statement in a Function", ->
    statement = VarStatement.first `function () { var foo; var bar; }`
    expect(statement.vars.foo).not.toBe null

describe "VarStatement::remove(String...)", ->

  it "removes the entire 'var' statement if all variable names are removed", ->
    statement = VarStatement.first `function () { var foo; }`
    result = statement.remove "foo"
    expect(result).toBe "function () {  }"

  it "supports removing multiple variables at once", ->
    statement = VarStatement.first `function () { var nut, foo, pin, bar, zee; }`
    result = statement.remove "foo", "bar"
    expect(result).toBe "function () { var nut, pin, zee; }"

  it "can remove the first variable", ->
    statement = VarStatement.first `function () { var foo, bar, zee; }`
    result = statement.remove "foo"
    expect(result).toBe "function () { var bar, zee; }"

  it "can remove the last variable", ->
    statement = VarStatement.first `function () { var foo, bar, zee; }`
    result = statement.remove "zee"
    expect(result).toBe "function () { var foo, bar; }"

  it "can remove a middle variable", ->
    statement = VarStatement.first `function () { var foo, bar, zee; }`
    result = statement.remove "bar"
    expect(result).toBe "function () { var foo, zee; }"
