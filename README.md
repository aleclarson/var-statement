
# var-statement v1.0.1 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```sh
npm install aleclarson/var-statement#1.0.1
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

changelog
---------

#### 1.0.1

&nbsp;&nbsp;
**\+** Fix major bug with removing multiple variables at once

&nbsp;&nbsp;
**\+** Remove accidental relative module path

&nbsp;&nbsp;
**\+** Add missing dependencies to `package.json`

#### 1.0.0

&nbsp;&nbsp;
**\+** Initial release
