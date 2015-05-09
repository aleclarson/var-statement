
# var-statement v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```sh
npm install aleclarson/var-statement#1.0.0
```

usage
-----

```CoffeeScript
Function.fromString = (string) -> eval "(function () { return " + inner + "; })()"

myFunc = `function () { var hello, foo, test, bar, world; }`

VarStatement = require "var-statement"

statement = VarStatement.first myFunc

newFunc = Function.fromString statement.remove "world", "hello", "test"

newFunc.toString() # "function () { var foo, bar; }"
```

tests
-----

All tests are passing! Find out for yourself:

```sh
npm install -g jasmine-node
npm test
```
